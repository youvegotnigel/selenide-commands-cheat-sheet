import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Page Objects entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"page(Class) and page(object)" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Page Objects', 'page(Class) and page(object)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static <PageObjectClass> PageObjectClass page(Class<PageObjectClass> pageObjectClass) {
    expect(entry.code).toMatch(/page\(\w+\.class\)/);
    // selenide 7.19.0 Selenide.java: public static <PageObjectClass, T extends PageObjectClass> PageObjectClass page(T pageObject) {
    expect(entry.code).toMatch(/page\(new \w+\([^)]*\)\)/);
    // selenide-core 7.19.0 SelenidePageFactory.java: Constructor<PageObjectClass> constructor = pageObjectClass.getDeclaredConstructor();
    // page(Class) needs a no-argument constructor.
    expect(entry.tip).toMatch(/no-arg/);
  });

  test('"open(url, PageObject.class)" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Page Objects', 'open(url, PageObject.class)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static <PageObjectClass> PageObjectClass open(String relativeOrAbsoluteUrl,
    //                                                       Class<PageObjectClass> pageObjectClassClass) {
    expect(entry.code).toMatch(/= open\("[^"]+", \w+\.class\);/);
  });

  test('"Container (reusable widget)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Page Objects', 'Container (reusable widget)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Container.java: public interface Container {
    expect(entry.code).toContain('implements Container');
    // CHANGELOG.md at v7.19.0, 7.0.0: "remove deprecated abstract class `ElementsContainer` - use `Container` instead (#2523)"
    // No ElementsContainer.java exists in the selenide-core 7.19.0 sources jar.
    expect(entry.code).not.toContain('ElementsContainer');
    expect(entry.code).not.toContain('getSelf()');
    // selenide 7.19.0 Selenide.java: public static <ContainerClass extends Container> ContainerClass container(String cssSelector, Class<ContainerClass> containerClass) {
    expect(entry.code).toMatch(/container\("[^"]+", \w+\.class\)/);
  });

  test('"@Self (container root)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Page Objects', '@Self (container root)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Container.java: @interface Self {   (nested inside public interface Container)
    // There is no top-level com.codeborne.selenide.Self, so the import names Container.Self.
    expect(entry.code).toContain('import com.codeborne.selenide.Container.Self;');
    expect(entry.code).toContain('@Self');
    expect(entry.code).toContain('implements Container');
  });

  test('"List of Containers" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Page Objects', 'List of Containers');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenidePageFactory.java: else if (isDecoratableList(field, selector, genericTypes, Container.class)) {
    // selenide-core 7.19.0 ElementsContainerCollection.java: public class ElementsContainerCollection<T extends Container> extends AbstractList<T> {
    expect(entry.code).toMatch(/@FindBy\([^)]*\)\s+(private |public )?List<\w+> \w+;/);
    expect(entry.code).toContain('implements Container');
  });

  test('"@As (field alias)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Page Objects', '@As (field alias)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 As.java: public @interface As {   with   String value();
    expect(entry.code).toContain('import com.codeborne.selenide.As;');
    expect(entry.code).toMatch(/@As\("[^"]+"\)/);
  });
});
