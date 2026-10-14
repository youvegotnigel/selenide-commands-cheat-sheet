import { test, expect } from '@playwright/test';

// Fixed values returned by the mocked backends
const MOCK_DATE = '2025-12-25';
const MOCK_COUNT = 12345;

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers': 'authorization, content-type, apikey, x-client-info',
};

// Install deterministic network mocks so tests never hit the real Supabase /
// GitHub backends (flaky, rate-limited, and a real backend hit would increment
// the production visitor count). Returns a live counter of increment POSTs.
async function mockBackends(page, { count = MOCK_COUNT, offline = false } = {}) {
  const state = { posts: 0 };

  // The "last updated" badge reads from the stamped js/meta.json (same-origin)
  await page.route('**/js/meta.json**', (route) =>
    route.fulfill({
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lastUpdated: MOCK_DATE }),
    })
  );

  if (offline) {
    // Simulate the backend being unreachable
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => route.abort());
    return state;
  }

  // Read path: live visitor count
  await page.route('**/rest/v1/visits**', (route) =>
    route.fulfill({
      status: 200,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: JSON.stringify([{ total_count: count }]),
    })
  );

  // Write path: increment — count only real POSTs (ignore CORS preflight)
  await page.route('**/functions/v1/increment-visitor', (route) => {
    if (route.request().method() === 'POST') state.posts += 1;
    route.fulfill({
      status: 200,
      headers: { ...CORS, 'content-type': 'application/json' },
      body: '{"success":true}',
    });
  });

  return state;
}

/* ── META BAR ──────────────────────────────────────────────────── */
test.describe('Meta bar', () => {
  test('renders all four badges with their labels', async ({ page }) => {
    await mockBackends(page);
    await page.goto('/');

    await expect(page.locator('.meta-badge')).toHaveCount(4);
    const labels = await page.locator('.meta-badge .k').allInnerTexts();
    expect(labels).toEqual(['selenide', 'last updated', 'commands', 'visitors']);
  });

  test('version badge is populated from js/versions.json', async ({ page }) => {
    await page.route('**/js/versions.json**', (route) =>
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          selenide: '9.9.9',
          selenideAppium: '9.9.9',
          appiumJavaClient: '1.0.0',
        }),
      })
    );
    await mockBackends(page);
    await page.goto('/');
    await expect(page.locator('#selenide-version')).toHaveText('v9.9.9');
  });

  test('js/versions.json pins the release this cheat sheet was verified against', async ({
    page,
  }) => {
    await mockBackends(page);
    await page.goto('/');
    // Bumped deliberately by the selenide-release-sync skill, together with the content.
    const versions = await page.evaluate(async () => (await fetch('./js/versions.json')).json());
    expect(versions).toEqual({
      selenide: '7.19.0',
      selenideAppium: '7.19.0',
      appiumJavaClient: '11.0.0',
    });
  });

  test('command count badge matches the data', async ({ page }) => {
    await mockBackends(page);
    await page.goto('/');

    const dataCount = await page.evaluate(() =>
      categories.reduce((sum, cat) => sum + cat.items.length, 0)
    );
    await expect(page.locator('#cmd-count')).toHaveText(String(dataCount));
  });

  test('last-updated badge reflects the stamped meta.json date', async ({ page }) => {
    await mockBackends(page);
    await page.goto('/');

    await expect(page.locator('#last-updated')).toHaveText('2025-12-25');
  });

  test('keeps fallback values if version/date lookups fail', async ({ page }) => {
    // Fail every dynamic source: meta.json, versions.json, and Supabase
    await page.route('**/js/meta.json**', (route) => route.abort());
    await page.route('**/js/versions.json**', (route) => route.abort());
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => route.abort());
    await page.goto('/');

    // Hardcoded fallbacks in the HTML must still be shown (never blank)
    // The spec's HTML fallback for the version badge
    await expect(page.locator('#selenide-version')).toHaveText('v7.19.0');
    await expect(page.locator('#last-updated')).not.toBeEmpty();
  });
});

/* ── VISITOR COUNTER: DISPLAY ──────────────────────────────────── */
// Supabase deferred (plan Task 8): re-enable together with ENABLED = true.
test.describe.skip('Visitor counter — display', () => {
  test('shows the live count, formatted with separators', async ({ page }) => {
    await mockBackends(page, { count: 12345 });
    await page.goto('/');

    await expect(page.locator('#visitor-count-number')).toHaveText('12,345');
  });

  test('falls back to the cached value (dimmed) when offline', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('visitor-count-cache', '9876'));
    await mockBackends(page, { offline: true });
    await page.goto('/');

    const number = page.locator('#visitor-count-number');
    await expect(number).toHaveText('9,876');
    await expect(number).toHaveCSS('opacity', '0.6');
    await expect(number).toHaveAttribute('title', /Last known count/);
  });

  test('does not break the page when the backend is down', async ({ page }) => {
    await mockBackends(page, { offline: true });
    await page.goto('/');

    // Core content still renders regardless of the counter
    expect(await page.locator('.tile').count()).toBeGreaterThan(0);
  });
});

/* ── VISITOR COUNTER: INCREMENT ────────────────────────────────── */
// The counter skips automated browsers (navigator.webdriver === true), which is
// true under Playwright. Tests that assert the increment fires must pose as a
// real visitor by faking navigator.webdriver = false before the page loads.
async function poseAsRealVisitor(page) {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'webdriver', { get: () => false })
  );
}

// Supabase deferred (plan Task 8): re-enable together with ENABLED = true.
test.describe.skip('Visitor counter — increment', () => {
  test('does NOT increment in automated browsers (CI / bots)', async ({ page }) => {
    const state = await mockBackends(page);
    await page.goto('/'); // navigator.webdriver is true under Playwright
    await page.waitForTimeout(500);

    expect(state.posts).toBe(0);
  });

  test('increments exactly once on first load (real visitor)', async ({ page }) => {
    await poseAsRealVisitor(page);
    const state = await mockBackends(page);
    await page.goto('/');
    await page.waitForTimeout(500);

    expect(state.posts).toBe(1);
  });

  test('does not increment again on refresh (once per session)', async ({ page }) => {
    await poseAsRealVisitor(page);
    const state = await mockBackends(page);
    await page.goto('/');
    await page.waitForTimeout(500);
    expect(state.posts).toBe(1);

    await page.reload();
    await page.waitForTimeout(500);
    expect(state.posts).toBe(1); // sessionStorage guard prevents a second hit
  });

  test('counts again in a fresh session', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await poseAsRealVisitor(page);
    const state = await mockBackends(page);

    await page.goto('/');
    await page.waitForTimeout(500);
    expect(state.posts).toBe(1);

    await ctx.close();
  });
});

/* ── ANALYTICS PLACEHOLDER (Supabase deferred, plan Task 8) ────── */
test.describe('Analytics placeholder', () => {
  test('sends no request to Supabase, even for a real visitor opening a command', async ({
    page,
  }) => {
    await poseAsRealVisitor(page);
    const hits = [];
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => {
      hits.push(route.request().url());
      route.abort();
    });
    await page.goto('/');
    await page.locator('.tile').first().click();
    await page.waitForTimeout(500);
    expect(hits).toEqual([]);
  });

  test('hides the Popular filter and keeps the visitor badge placeholder', async ({ page }) => {
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('.filter-btn[data-filter="popular"]')).toHaveCount(0);
    await expect(page.locator('#visitor-count-number')).toHaveText('—');
  });
});
