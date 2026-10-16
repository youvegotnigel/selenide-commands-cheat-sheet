import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Mobile Gestures entries (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"tap()" exists at level beginner, platform mobile', async ({ page }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'tap()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java: SelenideAppiumElement tap();
    expect(entry.code).toContain('.tap();');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumElement $(By seleniumSelector)
    // Selenide.$ returns SelenideElement, which has no tap(): the snippet must use SelenideAppium.$
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.SelenideAppium.$;');
  });

  test('"longPress (AppiumClickOptions)" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'longPress (AppiumClickOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumClickOptions.java: public static AppiumClickOptions longPressFor(Duration longPressHoldDuration)
    expect(entry.code).toContain('longPressFor(Duration.ofSeconds(');
    // AppiumClickOptions.java 7.19.0 has longPress() with no arguments only: no longPress(Duration) overload.
    expect(entry.code).not.toContain('longPress(Duration');
  });

  test('"scroll(AppiumScrollOptions)" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'scroll(AppiumScrollOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java: SelenideAppiumElement scroll(AppiumScrollOptions appiumScrollOptions);
    // selenide-appium 7.19.0 AppiumScrollOptions.java: public static AppiumScrollOptions down(int maxSwipeCount)
    expect(entry.code).toContain('.scroll(AppiumScrollOptions.down(');
    // selenide-appium 7.19.0 AppiumScrollOptions.java: public static AppiumScrollOptions up()
    expect(entry.code).toContain('.scroll(AppiumScrollOptions.up())');
  });

  test('"swipe(AppiumSwipeOptions)" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'swipe(AppiumSwipeOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java: SelenideAppiumElement swipe(AppiumSwipeOptions appiumSwipeOptions);
    // selenide-appium 7.19.0 AppiumSwipeOptions.java: public static AppiumSwipeOptions left(int maxSwipeCounts)
    expect(entry.code).toContain('.swipe(AppiumSwipeOptions.left(');
    // selenide-appium 7.19.0 AppiumSwipeOptions.java: public static AppiumSwipeOptions right()
    expect(entry.code).toContain('.swipe(AppiumSwipeOptions.right())');
  });

  test('"scroll() and swipe() inside()" is the 7.19.0 addition, level advanced', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'scroll() and swipe() inside()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // selenide 7.19.0 CHANGELOG.md: "#3445 allow Appium scroll() and swipe() to be performed inside a given element"
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
    // selenide-appium 7.19.0 AppiumScrollOptions.java: public AppiumScrollOptions inside(WebElement container)
    expect(entry.code).toContain('.scroll(AppiumScrollOptions.down().inside(');
    // selenide-appium 7.19.0 AppiumSwipeOptions.java: public AppiumSwipeOptions inside(WebElement container)
    expect(entry.code).toContain('.swipe(AppiumSwipeOptions.right(');
    expect(entry.code).toMatch(/\.swipe\(AppiumSwipeOptions\.right\(\d*\)\.inside\(/);
  });

  test('no Mobile Gestures entry builds W3C or TouchAction gestures by hand', async ({ page }) => {
    const items = await page.evaluate(
      () => window.categories.find((c) => c.cat === 'Mobile Gestures')?.items ?? []
    );
    // selenide-appium 7.19.0 commands/AppiumClick.java, AppiumScrollTo.java, AppiumSwipeTo.java and
    // AppiumDragAndDrop.java build the PointerInput Sequence internally: users never write one.
    expect(items.length).toBeGreaterThanOrEqual(10);
    for (const item of items) {
      const text = [item.name, item.desc, item.tip, item.code].join('\n');
      expect(text, item.name).not.toContain('TouchAction');
      expect(text, item.name).not.toContain('PointerInput');
      expect(text, item.name).not.toContain('new Sequence(');
    }
  });

  test('"setValue() and type() (Appium)" warns that SetValueOptions fails on mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'setValue() and type() (Appium)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java:200: SelenideAppiumElement type(TypeOptions options);
    // selenide-core 7.19.0 TypeOptions.java: public static TypeOptions text(CharSequence) / public TypeOptions sensitive()
    expect(entry.code).toContain('.type(TypeOptions.text("secret_sauce").sensitive())');
    // AppiumSetValue.java: CharSequence text = (CharSequence) requireNonNull(args)[0];
    expect(entry.tip).toContain('ClassCastException');
    expect(entry.code).not.toMatch(/setValue\((SetValueOptions\.)?withText\(/);
    // TypeOptions.java: DEFAULT_DELAY_WHILE_TYPING = Duration.ofMillis(200)
    expect(entry.desc).toContain('200 ms');
    // AppiumType.java: if (AppiumDriverRunner.isAndroidDriver()) { element.click(); actions.sendKeys(character).perform(); }
    expect(entry.tip).toMatch(/Android/);
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.SelenideAppium.$;');
  });
});
