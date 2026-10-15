import { test, expect } from '@playwright/test';
import { useFixtureData } from './helpers/fixture-data.js';

// Stub Supabase before every test. app.js re-renders the whole grid when
// popularCmds.loadCounts() resolves, so a live response landing mid-test
// detaches the tile a locator already resolved and the click is lost. These
// tests assert layout and interaction, never popularity, so empty counts are
// the right fixture. Same convention as meta-bar / popular-commands specs.
test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, body: '' }));
  await page.goto('/');
});

/* ── PAGE LOAD ─────────────────────────────────────────────────── */
test.describe('Page load', () => {
  test('shows the header and title', async ({ page }) => {
    await expect(page).toHaveTitle(/Selenide Commands Dashboard/);
    await expect(page.locator('header')).toContainText('Selenide Commands Dashboard');
  });

  test('shows the Selenide logo twice beside the header title', async ({ page }) => {
    const logos = page.locator('header img.header-logo');
    await expect(logos).toHaveCount(2);
    await expect(logos.first()).toBeVisible();
    await expect(logos.last()).toBeVisible();
    // Each logo must actually load (non-zero rendered size), not just exist in the DOM
    for (const box of await logos.all().then((ls) => Promise.all(ls.map((l) => l.boundingBox())))) {
      expect(box?.width).toBeGreaterThan(0);
      expect(box?.height).toBeGreaterThan(0);
    }
  });

  test('renders command tiles', async ({ page }) => {
    const tiles = page.locator('.tile');
    await expect(tiles).toHaveCount(await tiles.count()); // tiles exist
    expect(await tiles.count()).toBeGreaterThan(0);
  });

  test('tile count matches the data', async ({ page }) => {
    const dataCount = await page.evaluate(() =>
      categories.reduce((sum, cat) => sum + cat.items.length, 0)
    );
    expect(await page.locator('.tile').count()).toBe(dataCount);
  });

  test('renders filter buttons including All and Beginner', async ({ page }) => {
    await expect(page.locator('.filter-btn', { hasText: 'All' })).toBeVisible();
    await expect(page.locator('.filter-btn', { hasText: 'Start Here' })).toBeVisible();
  });

  test('Flat view is active by default', async ({ page }) => {
    await expect(page.locator('#btnFlat')).toHaveClass(/active/);
    await expect(page.locator('#btnGrouped')).not.toHaveClass(/active/);
  });
});

/* ── SEARCH ────────────────────────────────────────────────────── */
test.describe('Search', () => {
  test('filters tiles as user types', async ({ page }) => {
    const allCount = await page.locator('.tile').count();

    await page.locator('#search-input').fill('open');
    const filtered = page.locator('.tile');
    expect(await filtered.count()).toBeLessThan(allCount);
    expect(await filtered.count()).toBeGreaterThan(0);
  });

  test('shows empty state for a nonsense query', async ({ page }) => {
    await page.locator('#search-input').fill('xyzxyzxyznonexistent');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state')).toContainText('No commands match');
  });

  test('restores all tiles after clearing search', async ({ page }) => {
    const allCount = await page.locator('.tile').count();
    await page.locator('#search-input').fill('open');
    await page.locator('#search-input').clear();
    expect(await page.locator('.tile').count()).toBe(allCount);
  });

  test('is case-insensitive', async ({ page }) => {
    await page.locator('#search-input').fill('open');
    const lower = await page.locator('.tile').count();

    await page.locator('#search-input').fill('OPEN');
    const upper = await page.locator('.tile').count();

    expect(upper).toBe(lower);
    expect(upper).toBeGreaterThan(0);
  });

  test('works while a category filter is active', async ({ page }) => {
    // Apply a category filter first, then search within it
    await page.locator('.filter-btn', { hasText: 'Start Here' }).click();
    const afterFilter = await page.locator('.tile').count();

    await page.locator('#search-input').fill('open');
    const afterSearch = await page.locator('.tile').count();

    // Search should narrow results further (or keep same if all match)
    expect(afterSearch).toBeLessThanOrEqual(afterFilter);
    expect(afterSearch).toBeGreaterThan(0);
  });

  test('active filter is preserved after clearing search', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Start Here' }).click();
    const afterFilter = await page.locator('.tile').count();

    await page.locator('#search-input').fill('open');
    await page.locator('#search-input').clear();

    // Tile count should return to the filtered count, not the full count
    expect(await page.locator('.tile').count()).toBe(afterFilter);
    await expect(page.locator('.filter-btn', { hasText: 'Start Here' })).toHaveClass(/active/);
  });
});

/* ── FILTERS ───────────────────────────────────────────────────── */
test.describe('Filters', () => {
  test('Beginner filter shows only beginner tiles', async ({ page }) => {
    const allCount = await page.locator('.tile').count();
    await page.locator('.filter-btn', { hasText: 'Start Here' }).click();

    const filtered = await page.locator('.tile').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(allCount);
  });

  test('clicking All resets after another filter', async ({ page }) => {
    const allCount = await page.locator('.tile').count();

    await page.locator('.filter-btn', { hasText: 'Start Here' }).click();
    await page.locator('.filter-btn', { hasText: 'All' }).click();

    expect(await page.locator('.tile').count()).toBe(allCount);
  });

  test('active filter button gets the active class', async ({ page }) => {
    const beginnerBtn = page.locator('.filter-btn', { hasText: 'Start Here' });
    await beginnerBtn.click();
    await expect(beginnerBtn).toHaveClass(/active/);

    await page.locator('.filter-btn', { hasText: 'All' }).click();
    await expect(page.locator('.filter-btn', { hasText: 'All' })).toHaveClass(/active/);
  });
});

/* ── VIEW TOGGLE ───────────────────────────────────────────────── */
test.describe('View toggle', () => {
  test('Grouped view renders group headers', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.group-header').first()).toBeVisible();
  });

  test('switching back to Flat removes group headers', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await page.locator('#btnFlat').click();
    await expect(page.locator('.group-header')).toHaveCount(0);
  });

  test('group counts sum to the total command count in the meta bar', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.group-header').first()).toBeVisible();

    const counts = await page.locator('.group-count').allInnerTexts();
    const sum = counts.reduce((acc, t) => acc + Number(t.replace(/[()]/g, '')), 0);

    const total = Number(await page.locator('#cmd-count').innerText());
    expect(sum).toBe(total);
  });
});

/* ── MODAL ─────────────────────────────────────────────────────── */
test.describe('Modal', () => {
  test('opens when a tile is clicked and shows title/code', async ({ page }) => {
    const firstTile = page.locator('.tile').first();
    const tileName = await firstTile.locator('.tile-name').innerText();

    await firstTile.click();

    const modal = page.locator('#modal');
    await expect(modal).toBeVisible();
    await expect(page.locator('#m-title')).toContainText(tileName);
    await expect(page.locator('#m-code')).not.toBeEmpty();
  });

  test('shows the difficulty badge', async ({ page }) => {
    await page.locator('.tile').first().click();
    await expect(page.locator('#m-level')).toBeVisible();
    const badgeText = await page.locator('#m-level').innerText();
    expect(['Beginner', 'Intermediate', 'Advanced'].some((l) => badgeText.includes(l))).toBe(true);
  });

  test('Docs link has a valid href', async ({ page }) => {
    await page.locator('.tile').first().click();
    const href = await page.locator('#btn-docs').getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  test('closes via the × button', async ({ page }) => {
    await page.locator('.tile').first().click();
    await page.locator('.close-icon').click();
    await expect(page.locator('#modal')).toBeHidden();
  });

  test('closes via the Close button', async ({ page }) => {
    await page.locator('.tile').first().click();
    await page.locator('.btn-close').click();
    await expect(page.locator('#modal')).toBeHidden();
  });

  test('closes when pressing Escape', async ({ page }) => {
    await page.locator('.tile').first().click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();
  });

  test('closes when clicking the backdrop', async ({ page }) => {
    await page.locator('.tile').first().click();
    // Click the modal backdrop (outside modal-content)
    await page.locator('#modal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#modal')).toBeHidden();
  });

  test('Copy button changes text to ✓ Copied!', async ({ page }) => {
    await page.locator('.tile').first().click();
    await page.locator('#btn-copy').click();
    await expect(page.locator('#btn-copy')).toContainText('Copied');
  });

  test('Copy button resets back to Copy after 2 seconds', async ({ page }) => {
    await page.locator('.tile').first().click();
    await page.locator('#btn-copy').click();
    await expect(page.locator('#btn-copy')).toContainText('Copied');
    await expect(page.locator('#btn-copy')).toContainText('Copy', { timeout: 4000 });
  });

  test('opening a different tile shows its content', async ({ page }) => {
    const tiles = page.locator('.tile');
    const firstName = await tiles.nth(0).locator('.tile-name').innerText();
    const secondName = await tiles.nth(1).locator('.tile-name').innerText();

    await tiles.nth(0).click();
    await expect(page.locator('#m-title')).toContainText(firstName);

    // Close first, then open a different tile
    await page.locator('.btn-close').click();
    await tiles.nth(1).click();
    await expect(page.locator('#m-title')).toContainText(secondName);
    await expect(page.locator('#modal')).toBeVisible();
  });

  test('Docs link opens in a new tab', async ({ page }) => {
    await page.locator('.tile').first().click();
    const target = await page.locator('#btn-docs').getAttribute('target');
    expect(target).toBe('_blank');
  });
});

/* ── URL DEEP-LINKING ──────────────────────────────────────────── */
test.describe('URL deep-linking', () => {
  test('applying a category filter updates the URL hash', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Conditions' }).click();
    await expect(page).toHaveURL(/filter=Conditions/);
  });

  test('typing in search updates the URL hash', async ({ page }) => {
    await page.locator('#search-input').fill('text');
    await expect(page).toHaveURL(/search=text/);
  });

  test('both filter and search are reflected in the URL hash', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Conditions' }).click();
    await page.locator('#search-input').fill('text');
    await expect(page).toHaveURL(/filter=Conditions/);
    await expect(page).toHaveURL(/search=text/);
  });

  test('resetting to All removes filter from URL hash', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Conditions' }).click();
    await page.locator('.filter-btn', { hasText: 'All' }).click();
    await expect(page).not.toHaveURL(/filter=/);
  });

  test('clearing search removes search from URL hash', async ({ page }) => {
    await page.locator('#search-input').fill('text');
    await page.locator('#search-input').clear();
    await expect(page).not.toHaveURL(/search=/);
  });

  test('loading with #filter hash pre-applies the category filter', async ({ page }) => {
    const totalCount = await page.locator('.tile').count();

    await page.goto('/#filter=Conditions');
    await expect(page.locator('.filter-btn', { hasText: 'Conditions' })).toHaveClass(/active/);
    const filteredCount = await page.locator('.tile').count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(totalCount);
  });

  test('loading with #filter=beginner hash applies the Start Here filter', async ({ page }) => {
    const totalCount = await page.locator('.tile').count();

    await page.goto('/#filter=beginner');
    await expect(page.locator('.filter-btn', { hasText: 'Start Here' })).toHaveClass(/active/);
    const filteredCount = await page.locator('.tile').count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(totalCount);
  });

  test('loading with #search hash pre-populates the search input and filters tiles', async ({
    page,
  }) => {
    const totalCount = await page.locator('.tile').count();

    await page.goto('/#search=text');
    const inputValue = await page.locator('#search-input').inputValue();
    expect(inputValue).toBe('text');
    const filteredCount = await page.locator('.tile').count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(totalCount);
  });

  test('loading with both #filter and #search applies both simultaneously', async ({ page }) => {
    await page.goto('/#filter=Conditions&search=text');
    await expect(page.locator('.filter-btn', { hasText: 'Conditions' })).toHaveClass(/active/);
    const inputValue = await page.locator('#search-input').inputValue();
    expect(inputValue).toBe('text');
    expect(await page.locator('.tile').count()).toBeGreaterThan(0);
  });
  test('a category name with "&" and spaces round-trips through the hash', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
    await page.locator('.filter-btn', { hasText: 'Setup & Config' }).click();
    // URLSearchParams encodes a space as "+" and "&" as "%26" (WHATWG URL spec)
    await expect(page).toHaveURL(/#filter=Setup\+%26\+Config$/);

    // Fresh document load from the hash (not a same-document hashchange)
    await page.goto('about:blank');
    await page.goto('/#filter=Setup+%26+Config');
    await expect(page.locator('.filter-btn', { hasText: 'Setup & Config' })).toHaveClass(/active/);
    await expect(page.locator('.tile-name')).toHaveText(['alpha()', 'beta()']);
  });
});

/* ── KEYBOARD SHORTCUTS ────────────────────────────────────────── */
test.describe('Keyboard shortcuts', () => {
  test('search shortcut hint badge is visible in the search bar', async ({ page }) => {
    await expect(page.locator('#search-shortcut')).toBeVisible();
    const text = await page.locator('#search-shortcut').innerText();
    expect(['⌘K', 'Ctrl+K']).toContain(text);
  });

  test('Ctrl+K focuses the search input', async ({ page }) => {
    await page.locator('body').click(); // ensure focus is away from search
    await page.keyboard.press('Control+k');
    const isFocused = await page
      .locator('#search-input')
      .evaluate((el) => document.activeElement === el);
    expect(isFocused).toBe(true);
  });

  test('search input has an accessible aria-label', async ({ page }) => {
    const label = await page.locator('#search-input').getAttribute('aria-label');
    expect(label).toBeTruthy();
  });
});

/* ── MOBILE ────────────────────────────────────────────────────── */
test.describe('Mobile', () => {
  test('filter bar is scrollable when filters overflow', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    const filterBar = page.locator('#filters');
    const scrollWidth = await filterBar.evaluate((el) => el.scrollWidth);
    const clientWidth = await filterBar.evaluate((el) => el.clientWidth);
    // On mobile the filter bar should allow horizontal scrolling
    const overflowX = await filterBar.evaluate((el) => getComputedStyle(el).overflowX);
    if (scrollWidth > clientWidth) {
      expect(['auto', 'scroll']).toContain(overflowX);
    }
  });

  test('modal content is visible and not clipped on small screens', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.locator('.tile').first().click();
    const modal = page.locator('.modal-content');
    await expect(modal).toBeVisible();

    const box = await modal.boundingBox();
    const viewportWidth = page.viewportSize().width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding
  });

  test('tiles respond to tap', async ({ page, isMobile }) => {
    if (!isMobile) test.skip();
    await page.locator('.tile').first().tap();
    await expect(page.locator('#modal')).toBeVisible();
  });
});

/* ── MOBILE FILTER (fixture data, hand-written expectations) ─────── */
test.describe('Mobile filter', () => {
  test.beforeEach(async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
  });

  test('sits after Start Here and shows only mobile and both items', async ({ page }) => {
    const labels = await page.locator('.filter-btn').allInnerTexts();
    // Popular is hidden while analytics are off (Task 1 Step 7b); Task 8 re-adds it here.
    expect(labels.slice(0, 3)).toEqual(['All', '⭐ Start Here', '📱 Mobile']);

    await page.locator('.filter-btn[data-filter="mobile"]').click();
    await expect(page.locator('.tile-name')).toHaveText(['gamma()', 'delta()', 'epsilon()']);
    await expect(page).toHaveURL(/#filter=mobile$/);
  });

  test('#filter=mobile in the URL applies it on load', async ({ page }) => {
    await page.goto('about:blank'); // force a fresh document load from the hash
    await page.goto('/#filter=mobile');
    await expect(page.locator('.filter-btn[data-filter="mobile"]')).toHaveClass(/active/);
    await expect(page.locator('.tile-name')).toHaveText(['gamma()', 'delta()', 'epsilon()']);
  });

  test('search narrows the Mobile filter', async ({ page }) => {
    await page.goto('/#filter=mobile&search=tap');
    await expect(page.locator('.tile-name')).toHaveText(['delta()']);
  });

  test('grouped view under Mobile shows only categories with such items', async ({ page }) => {
    await page.goto('/#filter=mobile');
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.group-header')).toHaveText([
      'Conditions (1)',
      'Mobile Selectors (2)',
    ]);
  });
});

test.describe('Search with Selenide symbols (fixture data)', () => {
  test('$$ matches only snippets containing $$', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/'); // full load so the fixture replaces the real data
    await page.locator('#search-input').fill('$$');
    await expect(page.locator('.tile-name')).toHaveText(['gamma()']);
    await expect(page).toHaveURL(/#search=%24%24$/);
  });
});

/* ── TILE COLOURS (expected values from the 2026-10-15 spec, section 6) ──── */
test.describe('Tile colours', () => {
  // [cls, fill], hand-copied from the spec's colour-family table, in display order
  const PALETTE = [
    ['config', '#72a0f5'],
    ['navigation', '#76bafe'],
    ['remote', '#8ad1ff'],
    ['cli', '#a3e7ff'],
    ['selector', '#3bcddc'],
    ['collection', '#75ecde'],
    ['action', '#3ec87d'],
    ['window', '#84d987'],
    ['file', '#b8e688'],
    ['javascript', '#e2f07d'],
    ['report', '#f4c43a'],
    ['network', '#f4e886'],
    ['condition', '#f98e52'],
    ['wait', '#feb671'],
    ['page-object', '#f0777a'],
    ['pattern', '#f996a9'],
    ['framework', '#ffb5cd'],
    ['appium-setup', '#9e92f3'],
    ['mobile-selector', '#c79ff4'],
    ['mobile-gesture', '#e9aff2'],
    ['mobile-context', '#ffc2e9'],
  ];
  const rgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
  };
  const styleOf = (page) =>
    page.evaluate(
      (classes) =>
        classes.map((cls) => {
          const el = document.createElement('div');
          el.className = `tile ${cls}`;
          document.body.appendChild(el);
          const s = getComputedStyle(el);
          const out = { bg: s.backgroundColor, image: s.backgroundImage, color: s.color };
          el.remove();
          return out;
        }),
      PALETTE.map(([cls]) => cls)
    );

  test('every category class renders a flat fill with dark text', async ({ page }) => {
    expect(await styleOf(page)).toEqual(
      PALETTE.map(([, fill]) => ({ bg: rgb(fill), image: 'none', color: 'rgb(15, 23, 42)' }))
    );
  });

  test("every data category's color is its fill", async ({ page }) => {
    const cats = await page.evaluate(() => window.categories.map((c) => [c.cls, c.color]));
    const fill = Object.fromEntries(PALETTE);
    for (const [cls, color] of cats) expect(color.toLowerCase(), cls).toBe(fill[cls]);
  });

  test('categories are in family order', async ({ page }) => {
    const order = await page.evaluate(() => window.categories.map((c) => c.cls));
    expect(order).toEqual(PALETTE.map(([cls]) => cls));
  });

  // Guards future shade changes. WCAG 2.x relative luminance and contrast ratio.
  test('every fill meets WCAG AA (4.5:1) against the tile text', async ({ page }) => {
    const lum = (rgbStr) => {
      const [r, g, b] = rgbStr
        .match(/\d+/g)
        .slice(0, 3)
        .map((v) => {
          const c = Number(v) / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const styles = await styleOf(page);
    styles.forEach(({ bg, color }, i) => {
      const [hi, lo] = [lum(bg), lum(color)].sort((a, b) => b - a);
      expect((hi + 0.05) / (lo + 0.05), PALETTE[i][0]).toBeGreaterThanOrEqual(4.5);
    });
  });
});
