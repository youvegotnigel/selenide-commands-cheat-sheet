import { test, expect } from '@playwright/test';
import { useFixtureData, CELL_FIXTURE } from './helpers/fixture-data.js';

// Expected values are hand-written from docs/superpowers/specs/
// 2026-10-15-periodic-grid-refresh-design.md; each block cites its section.

test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, body: '' }));
});

/* ── splitName (spec section 3, the example table) ─────────────── */
test.describe('splitName', () => {
  const CASES = [
    ['Configuration.browserSize', 'Configuration.', 'browserSize'],
    ['webdriver().shouldHave(urlContaining())', 'webdriver().', 'shouldHave(urlContaining())'],
    ['SelenideAppium.switchTo().context()', 'SelenideAppium.switchTo().', 'context()'],
    ['CombinedBy.android().ios()', 'CombinedBy.android().', 'ios()'],
    ['SelenideAppium.$()', 'SelenideAppium.', '$()'],
    ['selenide.properties file', '', 'selenide.properties file'],
    ['$(AppiumBy.accessibilityId())', '', '$(AppiumBy.accessibilityId())'],
    ['and()', '', 'and()'],
    ['getOwnText()', '', 'getOwnText()'], // under 15 characters: the verb stays in the key
    ['Headless run on CI', '', 'Headless run on CI'],
  ];
  // Wrapper names: the argument is the key, the wrapper is the prefix, the closing paren the suffix.
  const WRAPPED = [
    ['shouldHave(text())', 'shouldHave(', 'text()'],
    ['shouldBe(hidden)', 'shouldBe(', 'hidden'],
    ['should(exist)', 'should(', 'exist'],
    ['shouldNotBe(animated)', 'shouldNotBe(', 'animated'],
  ];

  // Every other shape: [name, expected split]. prefix + key + suffix always equals the name.
  const SHAPES = [
    // qualifier: the note is the key
    ['download() (FOLDER)', { prefix: 'download() (', key: 'FOLDER', suffix: ')' }],
    ['open (basic auth)', { prefix: 'open (', key: 'basic auth', suffix: ')' }],
    ['Selenide dependency (Maven)', { prefix: 'Selenide dependency (', key: 'Maven', suffix: ')' }],
    [
      './gradlew test (forward -Dselenide.*)',
      { prefix: './gradlew test (', key: 'forward -Dselenide.*', suffix: ')' },
    ],
    // method with identifier arguments: the method is the key, the arguments a small line
    ['click(ClickOptions)', { prefix: '', key: 'click', suffix: '(ClickOptions)' }],
    ['screenshot(fileName)', { prefix: '', key: 'screenshot', suffix: '(fileName)' }],
    ['should(condition, Duration)', { prefix: '', key: 'should', suffix: '(condition, Duration)' }],
    // long getter: the verb is the prefix
    ['getSelectedOptionText()', { prefix: 'get', key: 'SelectedOptionText()' }],
    ['asDynamicIterable()', { prefix: 'as', key: 'DynamicIterable()' }],
    // by* selectors stay whole, like their with* siblings
    ['byPartialLinkText()', { prefix: '', key: 'byPartialLinkText()' }],
    ['byPlaceholder()', { prefix: '', key: 'byPlaceholder()' }],
    ['byTextCaseInsensitive()', { prefix: '', key: 'byTextCaseInsensitive()' }],
    // shared stem
    ['selenide-full-screenshot', { prefix: 'selenide-', key: 'full-screenshot' }],
    ['selenide-selenoid', { prefix: 'selenide-', key: 'selenoid' }],
  ];

  test('splits qualifiers, argument lists, long getters and the selenide- stem', async ({
    page,
  }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      (names) => names.map((n) => window.splitName(n)),
      SHAPES.map(([n]) => n)
    );
    expect(actual).toEqual(SHAPES.map(([, split]) => split));
  });

  test('splits a should/shouldBe/shouldHave wrapper around its argument', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      (names) => names.map((n) => window.splitName(n)),
      WRAPPED.map(([n]) => n)
    );
    expect(actual).toEqual(WRAPPED.map(([, prefix, key]) => ({ prefix, key, suffix: ')' })));
  });

  test('splits identifier-chain prefixes and nothing else', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      (names) => names.map((n) => window.splitName(n)),
      CASES.map(([n]) => n)
    );
    expect(actual).toEqual(CASES.map(([, prefix, key]) => ({ prefix, key })));
  });
});

/* ── Break opportunities (spec section 3) ─────────────────────── */
test.describe('appendWithBreaks', () => {
  // [input, expected innerHTML]: <wbr> after "." and ",", after "(" that follows an
  // identifier character, and before an uppercase letter that follows a lowercase one.
  const CASES = [
    ['browserSize', 'browser<wbr>Size'],
    ['Configuration.', 'Configuration.<wbr>'],
    ['SelenideAppium.', 'Selenide<wbr>Appium.<wbr>'],
    ['shouldHave(text())', 'should<wbr>Have(<wbr>text(<wbr>))'],
    ['$()', '$(<wbr>)'],
    ['Selenide dependency (Maven)', 'Selenide dependency (Maven)'],
    ['a,b', 'a,<wbr>b'],
  ];

  test('inserts <wbr> only at the spec break points and adds no text', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      async (inputs) => {
        const { appendWithBreaks } = await import('/js/tile.js');
        return inputs.map((text) => {
          const span = document.createElement('span');
          appendWithBreaks(span, text);
          return [span.innerHTML, span.textContent];
        });
      },
      CASES.map(([t]) => t)
    );
    expect(actual).toEqual(CASES.map(([text, html]) => [html, text]));
  });
});

/* ── keySize (spec section 3, "Symbol size") ───────────────────── */
test.describe('keySize', () => {
  // [key, expected]. Size is the larger of two classes:
  //   by total length: 1-10 s, 11-24 m, 25+ l
  //   by longest unbreakable run (split at spaces, hyphens, after "." "," and call "(",
  //   and before a capital after a lowercase letter): 1-10 s, 11 m, 12+ l
  const CASES = [
    ['x', 's'],
    ['xxxxxxxxxx', 's'], // 10 chars, one run
    ['xxxxxxxxxxx', 'm'], // 11 chars, one run of 11
    ['xxxxxxxxxxxx', 'l'], // one unbreakable run of 12
    ['browserSize', 'm'], // 11 chars, runs "browser" and "Size": length decides
    ['shouldHave(text())', 'm'], // 18 chars, short runs
    ['sleep(milliseconds)', 'l'], // 19 chars but the run "milliseconds)" is 13
    ['selenide-clear-with-shortcut', 'l'], // 28 chars: length decides
    ['x'.repeat(24), 'l'], // run of 24
    ['click(Click Options)', 'm'], // 20 chars, short runs
  ];

  test('size follows total length and the longest unbreakable run', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      async (keys) => {
        const { keySize } = await import('/js/tile.js');
        return keys.map(keySize);
      },
      CASES.map(([k]) => k)
    );
    expect(actual).toEqual(CASES.map(([, size]) => size));
  });
});

/* ── Tile cells (CELL_FIXTURE, spec section 3) ─────────────────── */
test.describe('Tile cells', () => {
  const NAMES = [
    'Configuration.browserSize',
    'SelenideAppium.$()',
    'pageLoadTime',
    'thirteen_char',
    'twenty_four_characters_x',
    'twenty_five_characters_xy',
    'Selenide dependency (Maven)',
    'shouldHave(text())',
  ];

  test.beforeEach(async ({ page }) => {
    await useFixtureData(page, CELL_FIXTURE);
    await page.goto('/');
  });

  test('every tile is a type="button" button', async ({ page }) => {
    const kinds = await page
      .locator('.tile')
      .evaluateAll((els) => els.map((e) => `${e.tagName} ${e.getAttribute('type')}`));
    expect(kinds).toEqual(Array(8).fill('BUTTON button'));
  });

  test('.tile-name text is exactly the command name', async ({ page }) => {
    await expect(page.locator('.tile-name')).toHaveText(NAMES);
  });

  test('prefix and key follow the split rule', async ({ page }) => {
    await expect(page.locator('.tile-prefix')).toHaveText([
      'Configuration.',
      'SelenideAppium.',
      'Selenide dependency (',
      'shouldHave(',
    ]);
    // wrapper: the argument is the key, the closing paren a small suffix inside it
    const last = page.locator('.tile').last();
    await expect(last.locator('.tile-key')).toHaveText('text())');
    await expect(last.locator('.tile-suffix')).toHaveText(')');
    const first = page.locator('.tile').first();
    expect(await first.locator('.tile-key').innerHTML()).toBe('browser<wbr>Size');
    // qualifier: "Selenide dependency (" is the prefix, "Maven" the key, ")" the suffix
    expect(await page.locator('.tile').nth(6).locator('.tile-key').innerHTML()).toBe(
      'Maven<span class="tile-suffix">)</span>'
    );
  });

  test('key size class follows key length', async ({ page }) => {
    const sizes = await page
      .locator('.tile-key')
      .evaluateAll((els) => els.map((e) => e.className.match(/tile-key--(\w)/)[1]));
    // keys: browserSize 11 (m), $() 3 (s), pageLoadTime 12 (m, short runs), thirteen_char (l,
    // one run of 13), twenty_four_characters_x (l, run 24), twenty_five_characters_xy (l),
    // Maven) 6 (s), text() 6 (s) after the shouldHave( prefix
    expect(sizes).toEqual(['m', 's', 'm', 'l', 'l', 'l', 's', 's']);
  });

  test('level shows as dots and in the accessible name', async ({ page }) => {
    await expect(page.locator('.tile-level')).toHaveText([
      '●●',
      '●',
      '●●●',
      '●',
      '●',
      '●',
      '●',
      '●',
    ]);
    await expect(page.locator('.tile').first()).toHaveAttribute(
      'aria-label',
      'Configuration.browserSize, Setup & Config, Intermediate'
    );
    await expect(page.locator('.tile').nth(2)).toHaveAttribute(
      'aria-label',
      'pageLoadTime, Setup & Config, Advanced'
    );
  });

  test('each tile names its category', async ({ page }) => {
    await expect(page.locator('.tile-cat')).toHaveText([
      ...Array(7).fill('Setup & Config'),
      'Conditions',
    ]);
  });

  test('command names use the monospace font', async ({ page }) => {
    const family = await page
      .locator('.tile-name')
      .first()
      .evaluate((e) => getComputedStyle(e).fontFamily);
    expect(family).toContain('monospace');
  });
});

/* ── Tile numbers (FIXTURE_CATEGORIES order: alpha, beta, gamma, delta, epsilon) ── */
test.describe('Tile numbers', () => {
  test.beforeEach(async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
  });

  test('number is the position in the full dataset', async ({ page }) => {
    await expect(page.locator('.tile-num')).toHaveText(['1', '2', '3', '4', '5']);
  });

  test('numbers survive a category filter', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Conditions' }).click();
    await expect(page.locator('.tile-num')).toHaveText(['3']);
  });

  test('numbers survive search', async ({ page }) => {
    await page.locator('#search-input').fill('epsilon');
    await expect(page.locator('.tile-num')).toHaveText(['5']);
  });

  test('numbers survive grouped view', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.tile-num')).toHaveText(['1', '2', '3', '4', '5']);
  });
});

/* ── Grid layout (spec section 4) ─────────────────────────────── */
test.describe('Grid layout', () => {
  const columns = (page) =>
    page
      .locator('#grid .grid')
      .first()
      .evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  const noSidewaysScroll = async (page) => {
    const [scroll, client] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scroll).toBeLessThanOrEqual(client);
  };

  test('2 columns and no sideways scroll at 320px', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop viewport sizes');
    await page.setViewportSize({ width: 320, height: 800 });
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(2);
    await noSidewaysScroll(page);
  });

  test('6 columns at 1200px', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop viewport sizes');
    await page.setViewportSize({ width: 1200, height: 800 });
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(6);
  });

  test('a short-name tile is square', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
    const box = await page.locator('.tile').first().boundingBox();
    expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  });

  test('phones get 2 columns without sideways scroll', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'device emulation only');
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(2);
    await noSidewaysScroll(page);
  });
});

/* ── No mid-word breaks at the narrowest width (spec section 1, real data) ── */
test.describe('No mid-word breaks', () => {
  test('every real command fits its cell without breaking inside a word at 320px with a scrollbar', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop viewport sizes');
    // 305px = a 320px screen minus a classic 15px scrollbar (Windows, macOS "always show")
    await page.setViewportSize({ width: 305, height: 800 });
    await page.goto('/');
    // With overflow-wrap: normal a word that is too wide overflows instead of breaking,
    // so scrollWidth > clientWidth names exactly the tiles that need a mid-word break.
    const tooWide = await page.locator('.tile-name').evaluateAll((els) =>
      els
        .filter((el) => {
          el.style.overflowWrap = 'normal';
          const overflows = el.scrollWidth > el.clientWidth;
          el.style.overflowWrap = '';
          return overflows;
        })
        .map((el) => el.textContent)
    );
    expect(tooWide).toEqual([]);
  });
});
