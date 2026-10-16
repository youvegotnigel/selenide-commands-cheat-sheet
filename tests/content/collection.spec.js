import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Collections entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"ElementsCollection (lazy)" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'ElementsCollection (lazy)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Selenide.java: public static ElementsCollection $$(String cssSelector) {
    expect(entry.code).toContain('ElementsCollection ');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumCollection $$(By selector) {
    // selenide-appium 7.19.0 SelenideAppiumCollection.java: public class SelenideAppiumCollection extends ElementsCollection {
    expect(entry.code).toContain('SelenideAppiumCollection');
    expect(entry.code).toContain('SelenideAppium.$$(');
  });

  test('"filterBy()" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'filterBy()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 BaseElementsCollection.java: public SELF filterBy(WebElementCondition condition) {
    // selenide-core 7.19.0 BaseElementsCollection.java: public SELF filter(WebElementCondition condition) {
    expect(entry.code).toContain('filterBy(');
    expect(entry.code).toContain('.filter(');
    // Both take a WebElementCondition, not a Predicate, so a lambda does not compile.
    expect(entry.code).not.toMatch(/filter(By)?\(\w+ ->/);
  });

  test('"asDynamicIterable() and asFixedIterable()" exists at level advanced, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Collections', 'asDynamicIterable() and asFixedIterable()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 BaseElementsCollection.java: public SelenideElementIterable<T> asDynamicIterable() {
    expect(entry.code).toContain('.asDynamicIterable()');
    // selenide-core 7.19.0 BaseElementsCollection.java: public SelenideElementIterable<T> asFixedIterable() {
    expect(entry.code).toContain('.asFixedIterable()');
  });
});
