import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Mobile Context & App';

test.describe('Mobile Context & App entries (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"SelenideAppium.switchTo().context()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.switchTo().context()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumTargetLocator switchTo() {
    // selenide-appium 7.19.0 SelenideAppiumTargetLocator.java: public void context(String contextName) {
    expect(entry.code).toContain('SelenideAppium.switchTo().context("NATIVE_APP")');
    // selenide-core 7.19.0 SelenideTargetLocator has no context(String), and the Selenide form
    // replaces a raw cast of the driver to SupportsContextSwitching
    expect(entry.code).not.toContain('Selenide.switchTo().context(');
    expect(entry.code).not.toMatch(/\bdriver\.context\(|SupportsContextSwitching/);
  });

  test('"SelenideAppium.getContextHandles()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.getContextHandles()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static Set<String> getContextHandles() {
    expect(entry.code).toContain('Set<String> contexts = SelenideAppium.getContextHandles();');
    // selenide-appium 7.19.0 SelenideAppium.java: public static String getCurrentContext() {
    expect(entry.code).toContain('SelenideAppium.getCurrentContext()');
  });

  test('"SelenideAppium.openAndroidDeepLink()" takes the url first, then the package', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.openAndroidDeepLink()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void openAndroidDeepLink(String deepLinkUrl, String appPackage) {
    expect(entry.code).toMatch(
      /SelenideAppium\.openAndroidDeepLink\("[a-z]+:\/\/[^"]*", "[\w.]+"\)/
    );
  });

  test('"SelenideAppium.openIOSDeepLink()" takes only the url', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.openIOSDeepLink()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void openIOSDeepLink(String deepLinkUrl) {
    expect(entry.code).toMatch(/SelenideAppium\.openIOSDeepLink\("[a-z]+:\/\/[^"]*"\)/);
    expect(entry.code).not.toContain('openIosDeepLink');
    // selenide-appium 7.19.0 DeepLinkLauncher.java: public static Duration SAFARI_ELEMENTS_TIMEOUT = Duration.ofSeconds(1);
    expect(entry.tip).toContain('SAFARI_ELEMENTS_TIMEOUT');
  });

  test('"SelenideAppium.relaunchApp()" uses the 7.19.0 signature', async ({ page }) => {
    const relaunch = await itemIn(page, CAT, 'SelenideAppium.relaunchApp()');
    expect(relaunch).not.toBeNull();
    expect(relaunch.level).toBe('intermediate');
    expect(relaunch.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void relaunchApp(String appId, @Nullable Duration timeout) {
    expect(relaunch.code).toMatch(
      /SelenideAppium\.relaunchApp\("[\w.]+", Duration\.of\w+\(\d+\)\)/
    );
    // selenide-appium 7.19.0 AppiumNavigator.java: if (mobileDriver instanceof AndroidDriver androidDriver && timeout != null) {
    expect(relaunch.tip).toMatch(/Android/);
  });

  test('"AppiumCondition.attribute()" builds a CombinedAttribute with android() then ios()', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumCondition.attribute()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 conditions/CombinedAttribute.java: package com.codeborne.selenide.appium.conditions;
    expect(entry.code).toContain(
      'import com.codeborne.selenide.appium.conditions.CombinedAttribute;'
    );
    // selenide-appium 7.19.0 CombinedAttribute.java: public static CombinedAttribute android(String android) {
    // selenide-appium 7.19.0 CombinedAttribute.java: public CombinedAttribute ios(String ios) {   (instance, not static)
    expect(entry.code).toMatch(/CombinedAttribute\.android\("[\w-]+"\)\.ios\("\w+"\)/);
    expect(entry.code).not.toContain('CombinedAttribute.ios(');
    // selenide-appium 7.19.0 AppiumCondition.java: public static WebElementCondition attribute(CombinedAttribute attribute, String expectedAttributeValue) {
    expect(entry.code).toContain('AppiumCondition.attribute(');

    const collection = await itemIn(page, CAT, 'AppiumCollectionCondition.attributes()');
    expect(collection).not.toBeNull();
    expect(collection.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumCollectionCondition.java: public static WebElementsCondition attributes(CombinedAttribute attribute, String... expectedAttributeValues) {
    expect(collection.code).toContain('AppiumCollectionCondition.attributes(');
  });

  test('"AppiumClipboard" is reached through clipboard()', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'AppiumClipboard');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 META-INF/services/com.codeborne.selenide.ClipboardService:
    //   com.codeborne.selenide.appium.AppiumClipboardService
    // selenide 7.19.0 Selenide.java: public static Clipboard clipboard() {
    expect(entry.code).toContain('clipboard().setText(');
    expect(entry.code).not.toContain('new AppiumClipboard(');
  });

  test('"Device features without getAndroidDriver()" casts to java-client interfaces', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Device features without getAndroidDriver()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumDriverRunner.java: @Deprecated(forRemoval = true) getAndroidDriver/getIosDriver/getMobileDriver,
    // javadoc: "cast your WebDriver to the needed interface, e.g. SupportsRotation or HidesKeyboard"
    expect(entry.code).not.toMatch(/getAndroidDriver|getIosDriver|getMobileDriver/);
    expect(entry.code).toContain('((SupportsRotation) WebDriverRunner.getWebDriver())');
    // java-client 11.0.0 remote/SupportsRotation.java:56: default void rotate(ScreenOrientation orientation)
    expect(entry.code).toContain('.rotate(ScreenOrientation.LANDSCAPE)');
    expect(entry.code).toContain('import org.openqa.selenium.ScreenOrientation;');
    // java-client 11.0.0 InteractsWithApps.java:89: default void runAppInBackground(Duration duration)
    expect(entry.code).toMatch(/\.runAppInBackground\(Duration\.of\w+\(\d+\)\)/);
    // AndroidDriver and IOSDriver both implement SupportsRotation and InteractsWithApps: no platform branch
    expect(entry.code).not.toContain('isAndroidDriver()');
    expect(entry.tip).toContain('forRemoval');
  });

  test('"Failure evidence on mobile (XML page source)" needs no setup', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Failure evidence on mobile (XML page source)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumScreenSourceExtractor.java: createFileWithExtension(config, fileName, "xml")
    expect(entry.desc).toContain('.xml');
    // META-INF/services/com.codeborne.selenide.impl.PageSourceExtractor: AppiumScreenSourceExtractor
    expect(entry.tip).toContain('AppiumScreenSourceExtractor');
    expect(entry.code).not.toMatch(/new AppiumScreenSourceExtractor|new AppiumElementDescriber/);
    // selenide 7.19.0 Configuration.java: public static boolean savePageSource
    expect(entry.code).toContain('Configuration.savePageSource = true;');
    // AppiumElementDescriber.androidAttributes(): "resource-id", ..., "content-desc"
    expect(entry.tip).toMatch(/resource-id/);
  });
  test('"SelenideAppium.terminateApp()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Context & App', 'SelenideAppium.terminateApp()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#terminateApp(java.lang.String)'
    );
    // selenide-appium 7.19.0 SelenideAppium.java: public static void terminateApp(String appId) {; public static void launchApp() {
    expect(entry.code).toContain('SelenideAppium.launchApp();');
    expect(entry.code).not.toContain('closeApp');
    expect(entry.code).not.toContain('resetApp');
    expect(entry.code).not.toContain('runAppInBackground');
    expect(entry.tip).toContain('IllegalStateException');
    expect(entry.tip).toContain('closeWebDriver()');
  });

  test('"SelenideAppium.activateApp()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Context & App', 'SelenideAppium.activateApp()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#activateApp(java.lang.String)'
    );
    // selenide-appium 7.19.0 SelenideAppium.java: public static void activateApp(String appId) {
    expect(entry.code).not.toContain('closeApp');
    expect(entry.code).not.toContain('resetApp');
    expect(entry.code).not.toContain('runAppInBackground');
    expect(entry.tip).toContain('IllegalStateException');
    expect(entry.tip).toContain('launchApp()');
  });

  test('the combined tiles are gone: App lifecycle: terminateApp(), activateApp()', async ({
    page,
  }) => {
    for (const name of ['App lifecycle: terminateApp(), activateApp()']) {
      expect(await itemIn(page, 'Mobile Context & App', name)).toBeNull();
    }
  });
});
