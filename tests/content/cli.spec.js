import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Build & Run';

test.describe('Build & Run entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"mvn test (choose browser)" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'mvn test (choose browser)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideConfig.java:17: getProperty("selenide.browser", CHROME)
    expect(entry.code).toContain('mvn test -Dselenide.browser=firefox');
    // selenide-examples/google .github/workflows/build.yml:85: run: mvn test -P <profile>;
    // pom.xml:120-130: profile "firefox" sets systemPropertyVariables selenide.browser
    expect(entry.code).toContain('mvn test -P firefox');
  });

  test('"./gradlew test (forward -Dselenide.*)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, './gradlew test (forward -Dselenide.*)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-examples/google build.gradle:53-58: System.properties.stringPropertyNames()
    //   .findAll { it.startsWith("selenide.") } .forEach { systemProperties[it] = System.getProperty(it) }
    expect(entry.code).toContain('it.startsWith("selenide.")');
    expect(entry.code).toContain('systemProperties[it] = System.getProperty(it)');
    // selenide-examples/hangman README.md:16: ./gradlew uitest_firefox -Dselenide.headless=true
    expect(entry.code).toContain('./gradlew test -Dselenide.');
  });

  test('"Headless run on CI" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Headless run on CI');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideConfig.java:18: properties.getBoolean("selenide.headless", false)
    // selenide-examples/todomvc .github/workflows/test.yml:21:
    //   ./gradlew clean test -Dselenide.headless=true --info --rerun-tasks
    // test.yml:41: ./mvnw clean test -Dselenide.headless=true (./mvnw is the Maven wrapper)
    expect(entry.code).toContain('./gradlew clean test -Dselenide.headless=true');
    expect(entry.code).toContain('mvn clean test -Dselenide.headless=true');
  });

  test('"Run on a Grid (-Dselenide.remote)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Run on a Grid (-Dselenide.remote)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideConfig.java:20: getPropertyOrNull("selenide.remote")
    // selenide v7.19.0 gradle/tests.gradle:94: systemProperties['selenide.remote'] = 'http://localhost:4444/wd/hub'
    expect(entry.code).toContain('-Dselenide.remote=http://localhost:4444/wd/hub');
    // The key is selenide.remote, not a Selenium or WebDriver property name
    expect(entry.code).not.toContain('-Dselenide.remoteUrl');
    expect(entry.code).not.toContain('-Dwebdriver.remote');
  });

  test('"Selenide CLI" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Selenide CLI');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // modules/cli/README.md:26 at v7.19.0: npm install -g @selenide/cli
    expect(entry.code).toContain('npm install -g @selenide/cli');
    // selenide-cli 7.19.0 SelenideCli.java:28-40: open, close, Codegen: code
    expect(entry.code).toContain('selenide open ');
    expect(entry.code).toContain('selenide code');
    expect(entry.code).toContain('selenide close');
    // SelenideCli.java:22: the program is "selenide", not "selenide-cli"
    expect(entry.code).not.toContain('selenide-cli open');
  });

  test('"Selenide CLI (open options and sessions)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Selenide CLI (open options and sessions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-cli 7.19.0 CliConfig.java:45: arg.equals("--headless") (a bare flag)
    expect(entry.code).toContain('--headless');
    expect(entry.code).not.toContain('--headless=true');
    // CliConfig.java:30 "--browser=", :60 "--remote="
    expect(entry.code).toContain('--browser=firefox');
    expect(entry.code).toContain('--remote=');
    // DaemonClient.java:264-270: the first argument not starting with "-" is the URL, so a
    // space-separated "--browser firefox" would open "firefox"
    expect(entry.code).not.toContain('--browser ');
    // SelenideCli.java:133: "-s" / "--session" take the session name
    expect(entry.code).toContain('selenide -s ');
    expect(entry.code).toContain('selenide close-all');
  });

  test('"Selenide MCP server" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Selenide MCP server');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // modules/mcp/README.md:15 at v7.19.0: claude mcp add selenide-mcp -- npx @selenide/mcp
    expect(entry.code).toContain('claude mcp add selenide-mcp -- npx @selenide/mcp');
    // CHANGELOG.md 7.18.0: rename "selenide-mcp" npm module to "@selenide/mcp"
    expect(entry.code).not.toContain('npx selenide-mcp');
    // selenide-mcp 7.19.0 SelenideMcpServer.java:89: --caps= ; README.md:148: codegen
    expect(entry.code).toContain('--caps=codegen');
    // SelenideMcpServer.java:187: arg.equals("--headless"); :223: arg.equals("--proxy-enabled")
    expect(entry.code).not.toContain('--headless=true');
    expect(entry.code).not.toMatch(/--proxy(\s|$)/);
  });

  test('"--capability (CLI and MCP)" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, '--capability (CLI and MCP)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.desc).toContain('Added in Selenide 7.19.0.');
    // selenide-cli 7.19.0 CliConfig.java:89 and selenide-mcp 7.19.0 SelenideMcpServer.java:126:
    // arg.startsWith("--capability="), value split on the first "=" into name and value
    expect(entry.code).toContain("--capability='goog:chromeOptions={");
    // CliConfig.java:86: a bare "--capability" (space-separated value) throws
    expect(entry.code).not.toMatch(/--capability\s/);
  });
});
