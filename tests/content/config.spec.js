import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Setup & Config entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Configuration.browser (htmlunit)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Setup & Config', 'Configuration.browser (htmlunit)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Browsers.java: String HTMLUNIT = "htmlunit";
    expect(entry.code).toContain('Configuration.browser = "htmlunit"');
    // selenide-core 7.19.0 HtmlUnitDriverFactory.java: "HtmlUnit driver not found. Add dependency
    // \"org.seleniumhq.selenium:htmlunit3-driver\" to your project."
    expect(entry.code).toContain('org.seleniumhq.selenium:htmlunit3-driver');
    // The pre-3.x artifact name is the known wrong form.
    expect(entry.code).not.toContain('htmlunit-driver');
    // CHANGELOG.md at v7.19.0: "add support for HtmlUnit browser (#3470)"
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
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
