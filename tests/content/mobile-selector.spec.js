import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Mobile Selectors';

test.describe('Mobile Selectors entries (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"AppiumSelectors.byText()" exists at level beginner, platform mobile', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byText(String elementText)
    expect(entry.code).toContain('byText("Views")');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withText(String elementText)
    expect(entry.code).toContain('withText(');
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.AppiumSelectors.');
    // ByTagAndText.java: super(tag, "text", elementText) -> XPath .//*[@text='...']
    expect(entry.tip).toContain('@text');
  });

  test('"AppiumSelectors.byContentDescription()" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byContentDescription()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byContentDescription(String contentDescriptionValue)
    expect(entry.code).toContain('byContentDescription(');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withContentDescription(String contentDescriptionValue)
    expect(entry.code).toContain('withContentDescription(');
    // ByTagAndContentDescription.java: super(tag, "content-desc", contentDescriptionValue)
    expect(entry.tip).toContain('@content-desc');
  });

  test('"AppiumSelectors.byName()" exists at level beginner, platform mobile', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byName()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byName(String nameAttributeValue)
    expect(entry.code).toContain('byName(');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withName(String nameAttributeValue)
    expect(entry.code).toContain('withName(');
    // ByTagAndName.java: super(tag, "name", attributeValue)
    expect(entry.tip).toContain('@name');
  });

  test('"AppiumSelectors.byTagAndText()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byTagAndText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byTagAndText(String tag, String elementText)
    expect(entry.code).toContain('byTagAndText("android.widget.TextView", ');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withTagAndText(String tag, String elementText)
    expect(entry.code).toContain('withTagAndText(');
  });

  test('"AppiumSelectors.withTagAndContentDescription()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.withTagAndContentDescription()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withTagAndContentDescription(String tag, String contentDescriptionValue)
    expect(entry.code).toContain('withTagAndContentDescription(');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byTagAndContentDescription(String tag, String contentDescriptionValue)
    expect(entry.code).toContain('byTagAndContentDescription(');
  });

  test('"AppiumSelectors.byTagAndName()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byTagAndName()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byTagAndName(String tag, String nameAttributeValue)
    expect(entry.code).toContain('byTagAndName("XCUIElementTypeOther", ');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withTagAndName(String tag, String nameAttributeValue)
    expect(entry.code).toContain('withTagAndName(');
  });

  test('"AppiumSelectors.byAttribute()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byAttribute()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byAttribute(String attributeName, String attributeValue)
    expect(entry.code).toContain('byAttribute("resource-id", ');
    // public static By withAttribute(String attributeName, String attributeValue)
    expect(entry.code).toContain('withAttribute(');
    // public static By byTagAndAttribute(String tag, String attributeName, String attributeValue)
    expect(entry.code).toMatch(/byTagAndAttribute\("[^"]+", "[^"]+", "[^"]+"\)/);
    // public static By withTagAndAttribute(String tag, String attributeName, String attributeValue)
    expect(entry.code).toMatch(/withTagAndAttribute\("[^"]+", "[^"]+", "[^"]+"\)/);
    // WithTagAndAttribute.java: "[contains(@" + attributeName + "," ... ")]"
    expect(entry.tip).toContain('contains(');
  });

  test('"AppiumSelectors.byClassNameAndIndex()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumSelectors.byClassNameAndIndex()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By byClassNameAndIndex(String className, int index)
    expect(entry.code).toMatch(/byClassNameAndIndex\("android\.widget\.EditText", \d+\)/);
    // ByClassNameAndIndex.java: super(String.format("(.//%s)[%s]", className, index)), an XPath position
    expect(entry.tip).toContain('1-based');
  });

  test('"CombinedBy.android().ios()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'CombinedBy.android().ios()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 selector/CombinedBy.java: public static CombinedBy android(By android)
    expect(entry.code).toContain('CombinedBy.android(');
    // selenide-appium 7.19.0 selector/CombinedBy.java: public CombinedBy ios(By ios)
    expect(entry.code).toContain('.ios(');
    expect(entry.code).toContain('import com.codeborne.selenide.appium.selector.CombinedBy;');
    // CombinedBy.java chooseSelector(): requireNonNull(iosSelector, "iOS selector not given")
    expect(entry.tip).toContain('iOS selector not given');
  });

  test('"$(AppiumBy.accessibilityId())" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, '$(AppiumBy.accessibilityId())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 AppiumBy.java: public static By accessibilityId(final String accessibilityId)
    // Allowed only inside a Selenide call: the snippet must wrap it in $( ... ).
    expect(entry.code).toContain('$(AppiumBy.accessibilityId("Login button"))');
    expect(entry.code).toContain('import io.appium.java_client.AppiumBy;');
  });

  test('"SelenideAppium.$()" returns SelenideAppiumElement, level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.$()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumElement $(By seleniumSelector)
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.SelenideAppium.$;');
    expect(entry.code).toMatch(/SelenideAppiumElement \w+ = \$\(/);
    // SelenideAppiumElement.java: SelenideAppiumElement tap(); (not on SelenideElement)
    expect(entry.code).toContain('.tap()');
  });

  test('"SelenideAppium.$$()" returns SelenideAppiumCollection, level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.$$()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumCollection $$(By selector)
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.SelenideAppium.$$;');
    expect(entry.code).toMatch(/SelenideAppiumCollection \w+ = \$\$\(/);
  });

  test('"SelenideAppium.element() and elements()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.element() and elements()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumElement element(By seleniumSelector)
    expect(entry.code).toContain('SelenideAppiumElement login = element(');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumCollection elements(By selector)
    expect(entry.code).toContain('SelenideAppiumCollection fields = elements(');
    // SelenideAppium.java Javadoc: "usable without backticks in Kotlin page objects"
    expect(entry.tip).toContain('Kotlin');
  });

  test('"Fluent chain with smart waits" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Fluent chain with smart waits');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java: SelenideAppiumElement shouldBe(WebElementCondition... condition);
    expect(entry.code).toContain('.shouldBe(visible)');
    // selenide-appium 7.19.0 SelenideAppiumElement.java: SelenideAppiumElement setValue(@Nullable String text);
    // SelenideAppiumElement.java: SelenideAppiumElement hideKeyboard();
    expect(entry.code).toContain('.setValue("bob@example.com").hideKeyboard()');
  });

  test('"@AndroidFindBy and @iOSXCUITFindBy fields" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, '@AndroidFindBy and @iOSXCUITFindBy fields');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumPageFactory.java: platformAnnotations = List.of(AndroidFindBy.class, ..., iOSXCUITFindBy.class, ...)
    expect(entry.code).toContain('@AndroidFindBy(');
    expect(entry.code).toContain('@iOSXCUITFindBy(');
    expect(entry.code).toContain('import io.appium.java_client.pagefactory.iOSXCUITFindBy;');
    // java-client 11.0.0 has no iOSFindBy annotation (only iOSXCUITFindBy and its variants)
    expect(entry.code).not.toContain('@iOSFindBy(');
    // SelenideAppiumPageFactory.java: protected Class<?> elementsBaseType() { return SelenideAppiumElement.class; }
    expect(entry.code).toContain('SelenideAppiumElement ');
    // META-INF/services/com.codeborne.selenide.impl.PageObjectFactory lists SelenideAppiumPageFactory
    expect(entry.tip).toContain('SelenideAppiumPageFactory');
  });

  test('"ScreenObject.screen()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'ScreenObject.screen()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 ScreenObject.java: public static <PageObjectClass> PageObjectClass screen(Class<PageObjectClass> pageObjectClass)
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.appium.ScreenObject.screen;'
    );
    expect(entry.code).toContain('screen(LoginScreen.class)');
  });
});

test.describe('Mobile Selectors guards (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const allItems = (page) =>
    page.evaluate((c) => window.categories.find((x) => x.cat === c)?.items ?? [], CAT);

  test('withTagAndContentDescription() is used and withTagAndDescription() never appears', async ({
    page,
  }) => {
    const items = await allItems(page);
    expect(items.length).toBeGreaterThanOrEqual(12);
    const text = JSON.stringify(items);
    // selenide-appium 7.19.0 AppiumSelectors.java: public static By withTagAndContentDescription(String tag, String contentDescriptionValue)
    expect(text).toContain('withTagAndContentDescription(');
    // The talk summary's withTagAndDescription() never shipped (not in AppiumSelectors.java).
    expect(text).not.toContain('withTagAndDescription(');
    expect(text).not.toContain('byTagAndDescription(');
  });

  test('every entry is platform mobile and no snippet uses MobileBy', async ({ page }) => {
    const items = await allItems(page);
    expect(items.length).toBeGreaterThanOrEqual(12);
    for (const item of items) expect(item.platform, item.name).toBe('mobile');
    // java-client 11.0.0 has no MobileBy class (only io.appium.java_client.AppiumBy).
    for (const item of items) expect(item.code, item.name).not.toContain('MobileBy');
  });

  test('AppiumBy appears only inside a Selenide call, never as a standalone entry', async ({
    page,
  }) => {
    const items = await allItems(page);
    for (const item of items) {
      expect(item.name, item.name).not.toMatch(/^AppiumBy/);
      // Any AppiumBy.x(...) in code is an argument: preceded by $( , ( or an annotation-free call site.
      for (const m of item.code.matchAll(/(.{0,30})AppiumBy\.\w+\(/g)) {
        expect(m[1], item.name).toMatch(/(\$\(|\$\$\(|element\(|elements\(|android\(|ios\()\s*$/);
      }
    }
  });

  test('every docs link points at an appium page or the selenide appium module', async ({
    page,
  }) => {
    const items = await allItems(page);
    for (const item of items) {
      expect(item.docs, item.name).toMatch(
        /^https:\/\/(selenide\.org\/javadoc\/current\/com\/codeborne\/selenide\/appium\/|github\.com\/selenide\/selenide\/blob\/v7\.19\.0\/modules\/appium\/)/
      );
    }
  });
});
