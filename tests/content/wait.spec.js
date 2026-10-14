import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Waits & Timeouts entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Wait() (SelenideWait)" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Waits & Timeouts', 'Wait() (SelenideWait)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Selenide.java: public static SelenideWait Wait() {
    // selenide-core 7.19.0 SelenideWait.java: public final class SelenideWait extends FluentWait<WebDriver> {
    expect(entry.code).toContain('SelenideWait wait = Wait();');
    expect(entry.code).toContain('.until(');
    // Wait() is not a WebDriverWait, so the snippet must not present it as one.
    expect(entry.code).not.toContain('WebDriverWait');
  });

  test('"is(condition, Duration)" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Waits & Timeouts', 'is(condition, Duration)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 SelenideElement.java: boolean is(WebElementCondition condition, Duration timeout);
    expect(entry.code).toContain('.is(visible, Duration.ofSeconds(');
  });

  test('"sleep(milliseconds)" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Waits & Timeouts', 'sleep(milliseconds)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Selenide.java: public static void sleep(long milliseconds) {
    expect(entry.code).toContain('sleep(2000);');
    // Selenide's own sleep, not the JDK one (Stopwatch.sleepAtLeast loops to guarantee the duration).
    expect(entry.code).not.toContain('Thread.sleep(');
  });

  test('"webdriver().shouldHave(condition, Duration)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Waits & Timeouts',
      'webdriver().shouldHave(condition, Duration)'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static BrowserSession webdriver() {
    // selenide-core 7.19.0 Conditional.java: default Conditional<T> shouldHave(ObjectCondition<T> predicate, Duration timeout) {
    // selenide-core 7.19.0 WebDriverConditions.java: public static ObjectCondition<WebDriver> numberOfWindows(int numberOfWindows) {
    expect(entry.code).toContain('webdriver().shouldHave(numberOfWindows(2), Duration.ofSeconds(');
  });

  test('no entry uses the removed waitUntil() or waitWhile()', async ({ page }) => {
    const items = await page.evaluate(
      () => window.categories.find((c) => c.cat === 'Waits & Timeouts')?.items ?? []
    );
    expect(items.length).toBeGreaterThanOrEqual(5);
    // selenide-core 7.19.0 SelenideElement.java declares no waitUntil or waitWhile method.
    // CHANGELOG.md at v7.19.0, 5.17.0: "add method $.shouldBe(condition, timeout) as a replacement
    // for $.waitUntil(condition, timeout)"; 6.0.1: "Remove lots of deprecated methods".
    for (const item of items) {
      expect(item.code, item.name).not.toMatch(/\.waitUntil\(|\.waitWhile\(/);
    }
  });
});
