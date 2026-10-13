import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Conditions entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"shouldHave(visibleText())" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Conditions', 'shouldHave(visibleText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    // selenide-core 7.19.0 GetVisibleText.java: private static final JavaScript js = new JavaScript("visible-text.js");
    // The text is read with JavaScript, so the condition is browser-only.
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition visibleText(String text) {
    expect(entry.code).toContain('visibleText("');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition exactVisibleText(String text) {
    expect(entry.code).toContain('exactVisibleText("');
    // CHANGELOG.md at v7.19.0: "#1741 add `visibleText()` conditions for overflow-truncated elements"
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
  });

  test('"Custom WebElementCondition" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Conditions', 'Custom WebElementCondition');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 WebElementCondition.java: public abstract class WebElementCondition {
    expect(entry.code).toContain('extends WebElementCondition');
    // selenide-core 7.19.0 WebElementCondition.java: public abstract CheckResult check(Driver driver, WebElement element);
    expect(entry.code).toContain('public CheckResult check(Driver driver, WebElement element)');
    // selenide-core 7.19.0 CheckResult.java: public CheckResult(boolean checkSucceeded, @Nullable Object actualValue) {
    expect(entry.code).toContain('new CheckResult(');
    // selenide-core 7.19.0 Condition.java: public final class Condition {
    // Condition is final and has no apply(); the 6.x subclassing form does not compile.
    expect(entry.code).not.toContain('extends Condition');
    expect(entry.code).not.toContain('new Condition(');
    expect(entry.code).not.toMatch(/boolean apply\(/);
  });

  test('"should(match())" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Conditions', 'should(match())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition match(String description, Predicate<WebElement> predicate) {
    expect(entry.code).toMatch(/match\("[^"]+", \w+ ->/);
  });

  test('"should(condition, Duration)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Conditions', 'should(condition, Duration)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement shouldBe(WebElementCondition condition, Duration timeout);
    expect(entry.code).toContain('.shouldBe(visible, Duration.ofSeconds(');
    // SelenideElement.java 7.19.0 has no waitUntil(condition, long); the timeout is a Duration.
    expect(entry.code).not.toContain('waitUntil(');
  });

  test('"and()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Conditions', 'and()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition and(String name, WebElementCondition condition1, WebElementCondition condition2,
    expect(entry.code).toMatch(/\band\("[^"]+", \w+, \w+/);
    // There is no and(condition1, condition2) overload; the name comes first.
    expect(entry.code).not.toMatch(/\band\((visible|enabled|exist)\b/);
  });

  test('"or()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Conditions', 'or()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition or(String name, WebElementCondition condition1, WebElementCondition condition2,
    expect(entry.code).toMatch(/\bor\("[^"]+", /);
  });
});
