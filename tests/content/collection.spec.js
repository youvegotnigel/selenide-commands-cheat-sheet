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

  test('"get(index)" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'get(index)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#get(int)'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java:322 public T get(int index)
    expect(entry.code).toContain('.get(2)');
    expect(entry.tip).toContain('ElementNotFound');
  });

  test('"first()" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'first()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#first()'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java:338 public T first(); :358 public SELF first(int elements)
    expect(entry.code).toContain('.first()');
    expect(entry.code).toContain('.first(3)');
    expect(entry.tip).toContain('ElementNotFound');
  });

  test('"last()" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'last()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#last()'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java:348 public T last(); :368 public SELF last(int elements)
    expect(entry.code).toContain('.last()');
    expect(entry.code).toContain('.last(2)');
    expect(entry.tip).toContain('found again');
  });

  test('"asDynamicIterable()" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'asDynamicIterable()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#asDynamicIterable()'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java: public SelenideElementIterable<T> asDynamicIterable() {
    expect(entry.code).toContain('.asDynamicIterable()');
    expect(entry.tip).toContain('StaleElementReferenceException');
  });

  test('"asFixedIterable()" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collections', 'asFixedIterable()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#asFixedIterable()'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java: public SelenideElementIterable<T> asFixedIterable() {
    expect(entry.code).toContain('.asFixedIterable()');
    expect(entry.tip).toContain('StaleElementReferenceException');
  });

  test('the combined tiles are gone: get(), first() and last(), asDynamicIterable() and asFixedIterable()', async ({
    page,
  }) => {
    for (const name of ['get(), first() and last()', 'asDynamicIterable() and asFixedIterable()']) {
      expect(await itemIn(page, 'Collections', name)).toBeNull();
    }
  });
});

test.describe('Javadoc gap fill: texts() (Selenide 7.19.0)', () => {
  test('"texts()" exists at level beginner, platform both', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'Collections', 'texts()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#texts()'
    );
    // selenide-core 7.19.0 BaseElementsCollection.java:302: public List<String> texts()
    expect(entry.code).toContain('.texts()');
    expect(entry.code).not.toContain('assertEquals(');
    // Javadoc: "we highly recommend to verify them with $$.shouldHave(texts(...));"
    expect(entry.tip).toContain('shouldHave(texts(');
  });
});
