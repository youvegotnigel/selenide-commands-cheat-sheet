import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Patterns entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"WebDriverProvider (custom browser)" exists at level advanced, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'WebDriverProvider (custom browser)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 WebDriverProvider.java:43: WebDriver createDriver(Capabilities capabilities);
    expect(entry.code).toContain('implements WebDriverProvider');
    expect(entry.code).toContain('public WebDriver createDriver(Capabilities capabilities)');
    // The wiki still shows createDriver(DesiredCapabilities), which does not compile in 7.19.0.
    expect(entry.code).not.toContain('DesiredCapabilities');
    // selenide-core 7.19.0 DefaultDriverFactory.java:25: Class<?> clazz = classOf(config.browser());
    expect(entry.code).toContain('Configuration.browser = ');
    expect(entry.code).toContain('.class.getName()');
  });

  test('"using(webDriver, lambda)" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Patterns', 'using(webDriver, lambda)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:161: public static void using(WebDriver webDriver, Runnable lambda)
    expect(entry.code).toMatch(/using\(\w+, \(\) -> \{/);
    // selenide 7.19.0 WebDriverThreadLocalContainer.java:218: using(..., lambda, false) never disposes the driver
    expect(entry.code).toContain('.quit()');
  });

  test('"inNewBrowser() (second user)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'inNewBrowser() (second user)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:176: public static void inNewBrowser(Runnable lambda)
    expect(entry.code).toContain('inNewBrowser(() -> {');
    // selenide 7.19.0 Selenide.java:188: public static void inNewBrowser(Config config, Runnable lambda)
    expect(entry.code).toContain('inNewBrowser(new SelenideConfig()');
  });

  test('"Condition library (static factories)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'Condition library (static factories)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java:644: public static WebElementCondition match(String description, Predicate<WebElement> predicate)
    expect(entry.code).toContain('public static WebElementCondition ');
    expect(entry.code).toContain('match("');
    // selenide-core 7.19.0 Condition.java:64: public final class Condition (no new Condition(...) { })
    expect(entry.code).not.toContain('new Condition(');
  });

  test('"Per-thread settings (open with SelenideConfig)" exists at level advanced, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'Per-thread settings (open with SelenideConfig)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideConfig.java:82: public SelenideConfig timeout(long timeout)
    expect(entry.code).toContain('new SelenideConfig()');
    // selenide 7.19.0 Selenide.java:57: public static void open(String relativeOrAbsoluteUrl, Config config)
    expect(entry.code).toMatch(/open\("[^"]+", [\w.()]+\)/);
  });

  test('"Page ready marker (no sleep)" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'Page ready marker (no sleep)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java:175: public static WebElementCondition attribute(String attributeName, String expectedAttributeValue)
    expect(entry.code).toContain('shouldHave(attribute("data-ready", "true")');
    // The pattern replaces fixed waits: neither Selenide sleep() nor Thread.sleep().
    expect(entry.code).not.toMatch(/sleep\(/i);
  });

  test('"Fluent page objects (return the next page)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'Fluent page objects (return the next page)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:865: public static <PageObjectClass> PageObjectClass page(Class<PageObjectClass> pageObjectClass)
    expect(entry.code).toContain('return page(');
    // selenide 7.19.0 Selenide.java:207: public static <PageObjectClass> PageObjectClass open(String relativeOrAbsoluteUrl, Class<PageObjectClass> pageObjectClassClass)
    expect(entry.code).toContain('open("/login", LoginPage.class)');
  });

  test('"execute(Command) (custom command)" extends FluentCommand and passes data by constructor', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Patterns', 'execute(Command) (custom command)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 FluentCommand.java: protected abstract void execute(WebElementSource locator, Object @Nullable [] args);
    expect(entry.code).toContain('extends FluentCommand');
    expect(entry.code).toContain(
      'protected void execute(WebElementSource locator, Object @Nullable [] args)'
    );
    // FluentCommand.java: the 3-argument execute(SelenideElement proxy, ...) is @Deprecated
    expect(entry.code).not.toContain('execute(SelenideElement proxy');
    // SelenideElement.java:1434: <ReturnType extends SelenideElement> ReturnType execute(FluentCommand command);
    expect(entry.code).toMatch(/\.execute\(\w+\("[^"]*"\)\)\.\w+\(/);
    // commands/Execute.java: command.execute(proxy, locator, NO_ARGS)
    expect(entry.tip).toMatch(/no arguments/);
    // the custom-interface + Commands.add pattern cannot give $() a typed method
    expect(entry.code).not.toContain('Commands.getInstance()');
  });
});
