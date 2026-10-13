import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Remote & Grid';

test.describe('Remote & Grid entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Selenium Grid" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Selenium Grid');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Configuration.java:115: public static String remote = defaults.remote();
    expect(entry.code).toContain('Configuration.remote = "http');
    // selenide 7.19.0 Configuration.java:141: public static MutableCapabilities browserCapabilities
    expect(entry.code).toContain('Configuration.browserCapabilities');
  });

  test('"selenide-grid" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'selenide-grid');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-grid 7.19.0 META-INF/MANIFEST.MF + modules/grid/README.md at v7.19.0:
    // "Import com.codeborne:selenide-grid:7.19.0" (the Java package is org.selenide.grid,
    // the Maven group is com.codeborne)
    expect(entry.code).toContain('com.codeborne:selenide-grid:7.19.0');
    expect(entry.code).not.toContain('org.selenide:selenide-grid');
    // selenide-grid 7.19.0 GridDownloadsFolder.java: webDriver.getDownloadedFiles() needs a
    // session with managed downloads; modules/grid DownloadFileFromGridToFolderTest.java at
    // v7.19.0: Configuration.browserCapabilities.setCapability(ENABLE_DOWNLOADS, true);
    expect(entry.code).toContain('setCapability(ENABLE_DOWNLOADS, true)');
  });

  test('"selenide-selenoid" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'selenide-selenoid');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.code).toContain('com.codeborne:selenide-selenoid:7.19.0');
    // modules/selenoid SelenoidSetup.java at v7.19.0:
    // capabilities.setCapability("selenoid:options", Map.of("enableVNC", true, "enableVideo", true));
    expect(entry.code).toContain('"selenoid:options"');
    expect(entry.code).not.toContain('"moon:options"');
  });

  test('"selenide-moon" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'selenide-moon');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.code).toContain('com.codeborne:selenide-moon:7.19.0');
    // modules/moon MoonSetup.java at v7.19.0:
    // capabilities.setCapability("moon:options", Map.of("enableVNC", true, "enableVideo", true));
    expect(entry.code).toContain('"moon:options"');
    expect(entry.code).not.toContain('"selenoid:options"');
    // selenide 7.19.0 Selenide.java:1194: public static Clipboard clipboard()
    // selenide-core 7.19.0 ClipboardConditions.java:6: public static ObjectCondition<Clipboard> content(String expectedContent)
    expect(entry.code).toContain('clipboard().shouldHave(content(');
  });

  test('"DevTools and BiDi" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'DevTools and BiDi');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 BrowserSession.java:40: public WebDriver object()
    expect(entry.code).toContain('webdriver().object()');
    // selenide-core 7.19.0 SelenideDriver.java:531: if (webDriver instanceof HasDevTools devToolsBrowser)
    expect(entry.code).toContain('HasDevTools');
    // selenide-core 7.19.0 BrowserClock.java:98: BiDi biDi = ((HasBiDi) webDriver).getBiDi();
    expect(entry.code).toContain('HasBiDi');
  });

  test('"setWebDriver()" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'setWebDriver()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 WebDriverRunner.java:67: public static void setWebDriver(WebDriver webDriver)
    expect(entry.code).toContain('WebDriverRunner.setWebDriver(');
    // selenide 7.19.0 WebDriverThreadLocalContainer.java:204: closeWebDriver() disposes (quits)
    // the bound instance, including one passed to setWebDriver
    expect(entry.code).toContain('closeWebDriver()');
    // selenide-core 7.19.0 RemoteDriverFactory.java:31: return new Augmenter().augment(webDriver);
    // A hand-made RemoteWebDriver is not augmented unless you do it yourself
    expect(entry.code).toContain('new Augmenter().augment(');
  });

  test('"sessionId()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'sessionId()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:1203: public static SessionId sessionId()
    expect(entry.code).toContain('SessionId id = sessionId();');
  });
});
