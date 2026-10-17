import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Navigation & Browser entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"open (browser state)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'open (browser state)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.desc).toContain('Added in Selenide 7.19.0.');
    // selenide 7.19.0 Selenide.java: public static void open(String relativeOrAbsoluteUrl, OpenOptions options)
    // selenide-core 7.19.0 OpenOptions.java: public static OpenOptions withBrowserState(String file)
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.OpenOptions.withBrowserState;'
    );
    expect(entry.code).toContain('withBrowserState("');
    // selenide-core 7.19.0 OpenOptions.java: public OpenOptions loggedInIf(BooleanSupplier loggedInCheck)
    // selenide-core 7.19.0 OpenOptions.java: public OpenOptions orLogin(Runnable login)
    // orLogin() throws IllegalStateException "Call loggedInIf() before orLogin()" when called first.
    const loggedInIf = entry.code.indexOf('.loggedInIf(');
    const orLogin = entry.code.indexOf('.orLogin(');
    expect(loggedInIf).toBeGreaterThan(-1);
    expect(orLogin).toBeGreaterThan(loggedInIf);
  });

  test('"webdriver().saveBrowserState()" exists at level advanced, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'webdriver().saveBrowserState()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.desc).toContain('Added in Selenide 7.19.0.');
    // selenide-core 7.19.0 BrowserSession.java: public void saveBrowserState(Path file)
    expect(entry.code).toContain('webdriver().saveBrowserState(Path.of(');
    // selenide-core 7.19.0 BrowserSession.java: public void restoreBrowserState(BrowserState state)
    // selenide-core 7.19.0 BrowserState.java: public static BrowserState fromFile(String file)
    expect(entry.code).toContain('webdriver().restoreBrowserState(BrowserState.fromFile(');
    // Not the Playwright name, and not a static Selenide method: neither exists in 7.19.0.
    expect(entry.code).not.toContain('storageState');
    expect(entry.code).not.toMatch(/(^|[^.)])saveBrowserState\(/m);
  });

  test('"webdriver().shouldHave(url())" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'webdriver().shouldHave(url())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 WebDriverConditions.java: public static ObjectCondition<WebDriver> url(String expectedUrl)
    // url() lives in WebDriverConditions, not Condition, so the snippet must import it.
    expect(entry.code).toContain('import static com.codeborne.selenide.WebDriverConditions.url;');
    expect(entry.code).toContain('webdriver().shouldHave(url(');
  });

  test('"webdriver().shouldHave(urlContaining())" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Navigation & Browser',
      'webdriver().shouldHave(urlContaining())'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 WebDriverConditions.java: public static ObjectCondition<WebDriver> urlContaining(String expectedUrl)
    expect(entry.code).toContain('webdriver().shouldHave(urlContaining(');
    // selenide-core 7.19.0 WebDriverConditions.java: public static ObjectCondition<WebDriver> urlStartingWith(String expectedUrl)
    expect(entry.code).toContain('urlStartingWith(');
  });

  test('"open (basic auth)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'open (basic auth)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static void open(String relativeOrAbsoluteUrl, String domain, String login, String password)
    // Four strings in this order: url, domain, login, password.
    expect(entry.code).toMatch(/open\("[^"]+", "[^"]*", "[^"]+", "[^"]+"\)/);
  });

  test('"SelenideDriver (multiple browsers)" exists at level advanced, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'SelenideDriver (multiple browsers)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideDriver.java: public SelenideDriver(Config config)
    expect(entry.code).toContain('new SelenideDriver(new SelenideConfig()');
    // selenide-core 7.19.0 SelenideDriver.java: public void close()
    // There is no closeWebDriver() on SelenideDriver: that is the static Selenide method.
    expect(entry.code).toContain('.close();');
    expect(entry.code).not.toContain('.closeWebDriver()');
  });
});

test.describe('Javadoc gap fill: page state (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"url() and source()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'url() and source()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverRunner.html#url()'
    );
    // selenide-7.19.0 WebDriverRunner.java:258 public static String url(), :250 source()
    expect(entry.code).toContain('import static com.codeborne.selenide.WebDriverRunner.url;');
    expect(entry.code).toContain('import static com.codeborne.selenide.WebDriverRunner.source;');
    // Selenide.java 7.19.0 has no url() or source().
    expect(entry.code).not.toContain('Selenide.url(');
    expect(entry.tip).toContain('webdriver().shouldHave(url(');
  });

  test('"updateHash()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'updateHash()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#updateHash(java.lang.String)'
    );
    // selenide-7.19.0 Selenide.java:198 public static void updateHash(String hash)
    expect(entry.code).toContain('updateHash("');
    // SelenideDriver.java:255 executeJavaScript("window.location.hash='...'")
    expect(entry.tip).toContain('window.location.hash');
  });

  test('"zoom()" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Navigation & Browser', 'zoom()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#zoom(double)'
    );
    // selenide-7.19.0 Selenide.java:1019 public static void zoom(double factor)
    expect(entry.code).toMatch(/zoom\(\d+\.\d+\)/);
  });
});
