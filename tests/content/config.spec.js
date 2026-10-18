import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Setup & Config entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Configuration.browser" shows every supported browser and drops the htmlunit tile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Setup & Config', 'Configuration.browser');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    // selenide-core 7.19.0 Browsers.java: CHROME, IE, EDGE, FIREFOX, SAFARI, HTMLUNIT constants
    for (const [constant, value] of [
      ['CHROME', 'chrome'],
      ['FIREFOX', 'firefox'],
      ['EDGE', 'edge'],
      ['SAFARI', 'safari'],
      ['IE', 'ie'],
      ['HTMLUNIT', 'htmlunit'],
    ]) {
      expect(entry.code).toContain(`Configuration.browser = Browsers.${constant};`);
      expect(entry.code).toContain(`"${value}"`);
    }
    // selenide-core 7.19.0 HtmlUnitDriverFactory.java: "HtmlUnit driver not found. Add dependency
    // \"org.seleniumhq.selenium:htmlunit3-driver\" to your project."
    expect(entry.code).toContain('org.seleniumhq.selenium:htmlunit3-driver');
    expect(entry.code).not.toContain('htmlunit-driver');
    expect(await itemIn(page, 'Setup & Config', 'Configuration.browser (htmlunit)')).toBeNull();
  });

  test('"Selenide dependency (Maven)" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Setup & Config', 'Selenide dependency (Maven)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 META-INF/MANIFEST.MF: Implementation-Version: 7.19.0,
    // fetched from repo1.maven.org/maven2/com/codeborne/selenide/7.19.0
    expect(entry.code.startsWith('<dependency>')).toBe(true);
    expect(entry.code).toContain('<groupId>com.codeborne</groupId>');
    expect(entry.code).toContain('<artifactId>selenide</artifactId>');
    expect(entry.code).toContain('<version>7.19.0</version>');
  });

  test('"selenide.properties file" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Setup & Config', 'selenide.properties file');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 SelenideProperties.java: super("selenide.properties");
    expect(entry.code.startsWith('# selenide.properties')).toBe(true);
    // selenide-core 7.19.0 SelenideConfig.java: getProperty("selenide.timeout", "4000")
    expect(entry.code).toContain('selenide.timeout=');
    // Keys always carry the "selenide." prefix; a bare "timeout=" is silently ignored.
    expect(entry.code).not.toMatch(/^(timeout|browser|baseUrl)=/m);
  });

  test('"Configuration.pageLoadTimeout" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Setup & Config', 'Configuration.pageLoadTimeout');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Configuration.java: public static long pageLoadTimeout = defaults.pageLoadTimeout();
    expect(entry.code).toContain('Configuration.pageLoadTimeout =');
    // selenide-core 7.19.0 SelenideConfig.java: getProperty("selenide.pageLoadTimeout", "30000")
    expect(entry.tip).toContain('30000');
  });

  test('"Configuration.pollingInterval" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Setup & Config', 'Configuration.pollingInterval');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Configuration.java: public static long pollingInterval = defaults.pollingInterval();
    expect(entry.code).toContain('Configuration.pollingInterval =');
    // selenide-core 7.19.0 SelenideConfig.java: getProperty("selenide.pollingInterval", "200")
    expect(entry.desc).toContain('200');
  });

  test('no Setup & Config entry uses the removed Configuration.collectionsTimeout', async ({
    page,
  }) => {
    // selenide 7.19.0 Configuration.java declares no collectionsTimeout field (only timeout),
    // although selenide.org/documentation.html still mentions it.
    const items = await page.evaluate(
      () => window.categories.find((c) => c.cat === 'Setup & Config').items
    );
    for (const i of items) {
      expect(`${i.name} ${i.desc} ${i.tip} ${i.code}`).not.toContain('collectionsTimeout');
    }
  });
});

test.describe('Javadoc gap fill: browserBinary (Selenide 7.19.0)', () => {
  test('"Configuration.browserBinary" exists at level intermediate, platform web', async ({
    page,
  }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'Setup & Config', 'Configuration.browserBinary');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browserBinary'
    );
    // selenide-7.19.0 Configuration.java:357 public static String browserBinary;
    // Javadoc: "Works only for Chrome and Firefox", -Dselenide.browserBinary=/path/to/binary
    expect(entry.code).toContain('Configuration.browserBinary = "');
    expect(entry.code).not.toContain('holdBrowserOpen');
    expect(entry.tip).toContain('Chrome and Firefox');
    expect(entry.tip).toContain('-Dselenide.browserBinary');
  });
});
