import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Appium Setup';

test.describe('Appium Setup entries (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"selenide-appium dependency (Maven)" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'selenide-appium dependency (Maven)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // Maven Central selenide-appium-7.19.0.pom: groupId com.codeborne, artifactId selenide-appium,
    // and modules/appium/build.gradle at v7.19.0: ext { artifactId = 'selenide-appium' }
    expect(entry.code.trim().startsWith('<dependency>')).toBe(true);
    expect(entry.code).toContain('<groupId>com.codeborne</groupId>');
    expect(entry.code).toContain('<artifactId>selenide-appium</artifactId>');
    // selenide-appium versions track selenide exactly: 7.19.0, never an Appium-style 2.x or 7.18.2
    expect(entry.code).toContain('<version>7.19.0</version>');
    // selenide-appium 7.19.0 pom: java-client 11.0.0 comes transitively, so it is not redeclared
    expect(entry.code).not.toContain('java-client');
  });

  test('"selenide-appium dependency (Gradle)" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'selenide-appium dependency (Gradle)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // Maven Central selenide-appium-7.19.0.pom: com.codeborne:selenide-appium:7.19.0
    expect(entry.code).toContain('testImplementation("com.codeborne:selenide-appium:7.19.0")');
  });

  test('"WebDriverProvider (Android)" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'WebDriverProvider (Android)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-core 7.19.0 WebDriverProvider.java:43: WebDriver createDriver(Capabilities capabilities);
    expect(entry.code).toContain('implements WebDriverProvider');
    expect(entry.code).toContain('public WebDriver createDriver(Capabilities capabilities)');
    // java-client 11.0.0 UiAutomator2Options.java:223: public UiAutomator2Options(Capabilities source)
    expect(entry.code).toContain('new UiAutomator2Options(capabilities)');
    // java-client 11.0.0 AndroidDriver.java:104: public AndroidDriver(URL remoteAddress, Capabilities capabilities)
    expect(entry.code).toContain('new AndroidDriver(');
    // java-client 11.0.0 BaseOptions.java:116: public T merge(Capabilities extraCapabilities)
    // returns a clone, so a bare "options.merge(capabilities);" statement drops Selenide's capabilities
    expect(entry.code).not.toMatch(/^\s*options\.merge\(capabilities\);/m);
    // java-client 11 builds sessions from typed options, not DesiredCapabilities;
    // MobileElement does not exist in java-client-11.0.0 at all
    expect(entry.code).not.toContain('DesiredCapabilities');
    expect(entry.code).not.toContain('MobileElement');
  });

  test('"WebDriverProvider (iOS)" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'WebDriverProvider (iOS)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 XCUITestOptions.java:245: public XCUITestOptions(Capabilities source)
    expect(entry.code).toContain('new XCUITestOptions(capabilities)');
    // java-client 11.0.0 IOSDriver.java:96: public IOSDriver(URL remoteAddress, Capabilities capabilities)
    expect(entry.code).toContain('new IOSDriver(');
    // java-client 11.0.0 ios/options/app/SupportsBundleIdOption.java:46: default T setBundleId(String identifier)
    expect(entry.code).toContain('.setBundleId(');
    expect(entry.code).not.toContain('DesiredCapabilities');
    expect(entry.code).not.toContain('MobileElement');
  });

  test('"SelenideAppium.launchApp()" exists at level beginner, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.launchApp()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java:34: public static void launchApp() {
    expect(entry.code).toContain('SelenideAppium.launchApp();');
    // selenide-core 7.19.0 DefaultDriverFactory.java:27: if (WebDriverProvider.class.isAssignableFrom(clazz))
    // the provider is chosen by class name
    expect(entry.code).toContain('.class.getName()');
  });

  test('no entry in the category teaches raw Appium tooling', async ({ page }) => {
    const items = await page.evaluate(
      (c) => window.categories.find((x) => x.cat === c)?.items ?? [],
      CAT
    );
    expect(items.length).toBeGreaterThanOrEqual(8);
    for (const item of items) {
      expect(item.platform).toBe('mobile');
      // scope rule: selenide-appium API only, no Appium CLI, adb or simctl
      expect(item.code).not.toMatch(
        /appium driver install|npm i(nstall)? -g appium|\badb\b|simctl/
      );
      expect(item.code).not.toContain('DesiredCapabilities');
      expect(item.code).not.toContain('MobileElement');
    }
  });

  test('"Permissions and alerts (provider options)" uses the java-client 11 setters', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Permissions and alerts (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/app/SupportsAutoGrantPermissionsOption.java: default T setAutoGrantPermissions(
    expect(entry.code).toContain('.setAutoGrantPermissions(true)');
    // java-client 11.0.0 ios/options/wda/SupportsAutoAcceptAlertsOption.java: default T setAutoAcceptAlerts(
    expect(entry.code).toContain('.setAutoAcceptAlerts(true)');
    // options are built from the provider's capabilities, as in "WebDriverProvider (Android)"
    expect(entry.code).toContain('new UiAutomator2Options(capabilities)');
    expect(entry.code).toContain('new XCUITestOptions(capabilities)');
    // SupportsAutoAcceptAlertsOption javadoc: "This includes privacy access permission alerts ... Default is false."
    expect(entry.tip).toMatch(/privacy/);
    expect(entry.tip).toMatch(/false/);
  });

  test('"Animations off (provider options)" uses one option per platform', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Animations off (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/server/SupportsDisableWindowAnimationOption.java: default T setDisableWindowAnimation(
    expect(entry.code).toContain('.setDisableWindowAnimation(true)');
    // java-client 11.0.0 ios/options/simulator/SupportsReduceMotionOption.java: default T setReduceMotion(  ("Only on simulators.")
    expect(entry.code).toContain('.setReduceMotion(true)');
    expect(entry.tip).toMatch(/simulators? only/i);
  });

  test('"Faster session start (provider options)" names the trade-offs', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Faster session start (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/server/SupportsSkipServerInstallationOption.java: default T setSkipServerInstallation(
    expect(entry.code).toContain('.setSkipServerInstallation(true)');
    // java-client 11.0.0 android/options/server/SupportsSkipDeviceInitializationOption.java: default T setSkipDeviceInitialization(
    expect(entry.code).toContain('.setSkipDeviceInitialization(true)');
    // java-client 11.0.0 ios/options/wda/SupportsUsePrebuiltWdaOption.java: default T setUsePrebuiltWda(
    expect(entry.code).toContain('.setUsePrebuiltWda(true)');
    // java-client 11.0.0 remote/options/BaseOptions.java implements SupportsNoResetOption: default T setNoReset(
    expect(entry.code).toContain('.setNoReset(true)');
    // the misspelling used in some blogs does not exist in java-client 11.0.0
    expect(entry.code).not.toContain('setUsePrebuiltWDA');
  });

  test('"Mobile web (Chrome or Safari on a device)" clears browserSize before open()', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Mobile web (Chrome or Safari on a device)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 remote/options/SupportsBrowserNameOption.java:39: default T withBrowserName(String browserName)
    expect(entry.code).toContain('.withBrowserName("Chrome")');
    // selenide-core 7.19.0 WebDriverFactory.java: factory.setBrowserSize(config, webdriver);
    // BrowserResizer.java: if (browserSize != null) { ... driver.manage().window().setSize(dimension); }
    const cleared = entry.code.indexOf('Configuration.browserSize = null;');
    const opened = entry.code.indexOf('open("https://');
    expect(cleared).toBeGreaterThan(-1);
    expect(opened).toBeGreaterThan(cleared);
    expect(entry.tip).toContain('launchApp()');
    // a browser session has no app under test
    expect(entry.code).not.toMatch(/\.setApp\(|\.setAppPackage\(|\.setBundleId\(/);
  });

  test('"Parallel devices (one udid and port per thread)" sets udid and systemPort per thread', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Parallel devices (one udid and port per thread)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 remote/options/SupportsUdidOption.java: default T setUdid(String id)
    expect(entry.code).toContain('.setUdid(device.udid())');
    // java-client 11.0.0 android/options/server/SupportsSystemPortOption.java: default T setSystemPort(int port)
    expect(entry.code).toContain('.setSystemPort(device.systemPort())');
    expect(entry.code).toContain('ThreadLocal<Device>');
    // SupportsSystemPortOption javadoc: "the first free port from 8200..8299 range is selected for UIA2"
    expect(entry.tip).toContain('8200..8299');
    // SupportsWdaLocalPortOption javadoc: default 8100
    expect(entry.tip).toContain('setWdaLocalPort()');
    // selenide 7.19.0 Configuration.java: static fields, shared by every thread
    expect(entry.code).not.toContain('Configuration.browserCapabilities');
  });

  test('"Cloud devices (BrowserStack provider)" mirrors selenide\'s own CI provider', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Cloud devices (BrowserStack provider)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // selenide v7.19.0 modules/appium/src/test/java/it/mobile/BrowserstackUtils.java: "https://hub.browserstack.com/wd/hub"
    expect(entry.code).toContain('"https://hub.browserstack.com/wd/hub"');
    // it/mobile/android/driverproviders/ci/AndroidDriverProvider.java: options.setCapability("bstack:options", ...)
    expect(entry.code).toContain('options.setCapability("bstack:options", Map.of(');
    // BrowserstackUtils.java getBrowserstackOptions(): userName, accessKey, projectName, buildName
    for (const key of ['"userName"', '"accessKey"', '"projectName"', '"buildName"']) {
      expect(entry.code).toContain(key);
    }
    // BrowserstackUtils.java reads the key with System.getProperty: never a literal in source
    expect(entry.code).toMatch(/"accessKey", System\.getProperty\("[\w.]+"\)/);
    expect(entry.docs).toBe(
      'https://github.com/selenide/selenide/blob/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackUtils.java'
    );
  });
});
