import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Collection Conditions entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Every public static member of selenide-core 7.19.0 CollectionCondition.java, copied from
  // the sources jar and cross-checked against javadoc/current/.../CollectionCondition.html.
  const FACTORIES = [
    'size',
    'sizeGreaterThan',
    'sizeGreaterThanOrEqual',
    'sizeLessThan',
    'sizeLessThanOrEqual',
    'sizeNotEqual',
    'texts',
    'textsInAnyOrder',
    'exactTexts',
    'attributes',
    'exactTextsCaseSensitive',
    'anyMatch',
    'allMatch',
    'noneMatch',
    'itemWithText',
    'containExactTextsCaseSensitive',
    'exactTextsCaseSensitiveInAnyOrder',
  ];
  // CollectionCondition.java: public static WebElementsCondition empty = size(0);
  const FIELDS = ['empty'];

  test('every CollectionCondition factory and field appears in a snippet', async ({ page }) => {
    const code = await page.evaluate(() =>
      window.categories
        .find((c) => c.cat === 'Collection Conditions')
        .items.map((i) => i.code)
        .join('\n')
    );
    const missing = [
      ...FACTORIES.filter((f) => !new RegExp(`\\b${f}\\(`).test(code)),
      ...FIELDS.filter((f) => !new RegExp(`\\b${f}\\b`).test(code)),
    ];
    expect(missing).toEqual([]);
  });

  test('the collection condition entries moved out of Collections', async ({ page }) => {
    const names = [
      'shouldHave(size())',
      'shouldHave(sizeGreaterThan())',
      'shouldHave(texts())',
      'shouldHave(exactTexts())',
      'shouldHave(textsInAnyOrder())',
      'shouldHave(itemWithText())',
      'should(containExactTextsCaseSensitive())',
      'shouldHave(attributes())',
      'should(allMatch())',
    ];
    for (const name of names) {
      expect(await itemIn(page, 'Collection Conditions', name), name).not.toBeNull();
      expect(await itemIn(page, 'Collections', name), name).toBeNull();
    }
  });

  test('"should(containExactTextsCaseSensitive())" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Collection Conditions',
      'should(containExactTextsCaseSensitive())'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition containExactTextsCaseSensitive(String... expectedTexts) {
    expect(entry.code).toContain('containExactTextsCaseSensitive("');
    // CHANGELOG.md at v7.19.0: "#1439 rename containTexts() to containExactTextsCaseSensitive()"
    // There is no containTexts() in CollectionCondition.java 7.19.0.
    expect(entry.code).not.toContain('containTexts(');
  });

  test('"shouldHave(textsInAnyOrder())" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Collection Conditions', 'shouldHave(textsInAnyOrder())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition textsInAnyOrder(String... expectedTexts) {
    expect(entry.code).toContain('textsInAnyOrder("');
    // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition exactTextsCaseSensitiveInAnyOrder(String... expectedTexts) {
    expect(entry.code).toContain('exactTextsCaseSensitiveInAnyOrder("');
    // No exactTextsInAnyOrder() exists in CollectionCondition.java 7.19.0.
    expect(entry.code).not.toMatch(/[^e]exactTextsInAnyOrder\(/);
  });

  test('"should(allMatch())" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Collection Conditions', 'should(allMatch())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition allMatch(String description, java.util.function.Predicate<WebElement> predicate) {
    expect(entry.code).toMatch(/allMatch\("[^"]+", \w+ ->/);
    // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition noneMatch(String description, java.util.function.Predicate<WebElement> predicate) {
    expect(entry.code).toMatch(/noneMatch\("[^"]+", \w+ ->/);
  });

  test('"should(collectionCondition, Duration)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Collection Conditions',
      'should(collectionCondition, Duration)'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 BaseElementsCollection.java: public SELF shouldHave(WebElementsCondition condition, Duration timeout) {
    expect(entry.code).toMatch(/\.shouldHave\(\w+\([^)]*\), Duration\.of\w+\(/);
    expect(entry.code).toContain('import java.time.Duration;');
  });

  test('"Custom WebElementsCondition" exists at level advanced, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Collection Conditions', 'Custom WebElementsCondition');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 WebElementsCondition.java: public abstract class WebElementsCondition {
    expect(entry.code).toContain('extends WebElementsCondition');
    // selenide-core 7.19.0 WebElementsCondition.java: public CheckResult check(Driver driver, List<WebElement> elements) {
    expect(entry.code).toContain(
      'public CheckResult check(Driver driver, List<WebElement> elements)'
    );
    // selenide-core 7.19.0 WebElementsCondition.java: public abstract String toString();
    expect(entry.code).toContain('public String toString()');
    // CollectionCondition is the factory class, not the base class to extend.
    expect(entry.code).not.toContain('extends CollectionCondition');
  });
});
