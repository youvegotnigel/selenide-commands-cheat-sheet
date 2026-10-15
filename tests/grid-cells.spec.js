import { test, expect } from '@playwright/test';

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
    ['Configuration.browser (htmlunit)', 'Configuration.', 'browser (htmlunit)'],
    ['webdriver().shouldHave(urlContaining())', 'webdriver().', 'shouldHave(urlContaining())'],
    ['SelenideAppium.switchTo().context()', 'SelenideAppium.switchTo().', 'context()'],
    ['CombinedBy.android().ios()', 'CombinedBy.android().', 'ios()'],
    ['SelenideAppium.$()', 'SelenideAppium.', '$()'],
    ['selenide.properties file', '', 'selenide.properties file'],
    ['./gradlew test (forward -Dselenide.*)', '', './gradlew test (forward -Dselenide.*)'],
    ['System properties (-Dselenide.*)', '', 'System properties (-Dselenide.*)'],
    ['$(AppiumBy.accessibilityId())', '', '$(AppiumBy.accessibilityId())'],
    ['shouldHave(text())', '', 'shouldHave(text())'],
  ];

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
  test('1-12 chars is s, 13-24 is m, 25+ is l', async ({ page }) => {
    await page.goto('/');
    const lengths = [1, 3, 12, 13, 24, 25, 51];
    const actual = await page.evaluate(async (lens) => {
      const { keySize } = await import('/js/tile.js');
      return lens.map((n) => keySize('x'.repeat(n)));
    }, lengths);
    expect(actual).toEqual(['s', 's', 's', 'm', 'm', 'l', 'l']);
  });
});
