import { test, expect } from '@playwright/test';
import { useFixtureData } from './helpers/fixture-data.js';

// Expected values are hand-written from docs/superpowers/specs/
// 2026-10-15-periodic-grid-refresh-design.md (section 7) and the fixture order
// alpha, beta (Setup & Config), gamma (Conditions), delta, epsilon (Mobile Selectors).

test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, body: '' }));
  await useFixtureData(page);
  await page.goto('/');
});

const tile = (page, name) => page.locator('.tile', { hasText: name });

/* ── Keyboard (spec section 7) ─────────────────────────────────── */
test.describe('Keyboard', () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(isMobile, 'keyboard navigation is a desktop concern');
  });

  test('Tab enters the grid on the first tile; only one tile is a tab stop', async ({ page }) => {
    await page.locator('#btnGrouped').focus();
    await page.keyboard.press('Tab');
    await expect(tile(page, 'alpha()')).toBeFocused();
    await expect(page.locator('.tile[tabindex="0"]')).toHaveCount(1);
  });

  test('ArrowRight, ArrowLeft, End and Home move focus', async ({ page }) => {
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tile(page, 'beta()')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tile(page, 'alpha()')).toBeFocused();
    await page.keyboard.press('End');
    await expect(tile(page, 'epsilon()')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tile(page, 'alpha()')).toBeFocused();
  });

  test('ArrowDown and ArrowUp move by row (2 columns at 400px)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 900 });
    // rows: [alpha, beta], [gamma, delta], [epsilon]
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'gamma()')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'epsilon()')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(tile(page, 'gamma()')).toBeFocused();
  });

  test('ArrowDown crosses group sections in grouped view', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'gamma()')).toBeFocused();
  });

  test('Enter opens the modal on Copy; Escape closes it and refocuses the tile', async ({
    page,
  }) => {
    await tile(page, 'beta()').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#btn-copy')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();
    await expect(tile(page, 'beta()')).toBeFocused();
  });

  test('closing with Close, × or the backdrop refocuses the opener', async ({ page }) => {
    for (const close of [
      () => page.locator('.btn-close').click(),
      () => page.locator('.close-icon').click(),
      () => page.locator('#modal').click({ position: { x: 5, y: 5 } }),
    ]) {
      await tile(page, 'gamma()').click();
      await expect(page.locator('#modal')).toBeVisible();
      await close();
      await expect(page.locator('#modal')).toBeHidden();
      await expect(tile(page, 'gamma()')).toBeFocused();
    }
  });

  test('Escape with no modal open leaves focus where it is', async ({ page }) => {
    await tile(page, 'delta()').focus();
    await page.keyboard.press('Escape');
    await expect(tile(page, 'delta()')).toBeFocused();
  });

  test('a re-render resets the tab stop to the first tile', async ({ page }) => {
    await tile(page, 'delta()').focus();
    await expect(tile(page, 'delta()')).toHaveAttribute('tabindex', '0');
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.tile[tabindex="0"]')).toHaveCount(1);
    await expect(tile(page, 'alpha()')).toHaveAttribute('tabindex', '0');
  });
});
