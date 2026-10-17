/** @type {import('./index.js').Category} */
export default {
  cat: 'Setup & Config',
  cls: 'config',
  color: '#72a0f5',
  items: [
    {
      name: 'Static imports',
      level: 'beginner',
      platform: 'both',
      desc: 'The three static imports every snippet on this cheat sheet assumes: Selenide, Condition and CollectionCondition.',
      tip: 'Other imports, such as AppiumBy or CombinedBy, are written inside the snippets that need them.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html',
      code: `import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.CollectionCondition.*;`,
    },
    {
      name: 'Selenide dependency (Maven)',
      level: 'beginner',
      platform: 'web',
      desc: 'Adds Selenide to a Maven project in test scope. It brings Selenium WebDriver with it.',
      tip: 'For mobile tests add com.codeborne:selenide-appium too, always at the same version as selenide: the two are released together. Optional modules such as selenide-grid follow the same version.',
      docs: 'https://selenide.org/quick-start.html',
      code: `<dependency>
  <groupId>com.codeborne</groupId>
  <artifactId>selenide</artifactId>
  <version>7.19.0</version>
  <scope>test</scope>
</dependency>`,
    },
    {
      name: 'Selenide dependency (Gradle)',
      level: 'beginner',
      platform: 'web',
      desc: 'Adds Selenide to a Gradle project using the Kotlin DSL in build.gradle.kts.',
      tip: 'testImplementation keeps Selenide off the production classpath. Gradle runs tests in a forked JVM, so -Dselenide.* flags on the command line only reach the tests if the test task forwards them.',
      docs: 'https://selenide.org/quick-start.html',
      code: `dependencies {
  testImplementation("com.codeborne:selenide:7.19.0")
}`,
    },
    {
      name: 'selenide.properties file',
      level: 'beginner',
      platform: 'both',
      desc: 'A file on the test classpath that sets Configuration defaults through selenide.* keys, with no code.',
      tip: 'Every key needs the selenide. prefix: a bare timeout=10000 is silently ignored. System properties override the file, and assignments to Configuration in code override both. selenide-appium runs read the same file.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html',
      code: `# selenide.properties
# lives in src/test/resources
selenide.browser=firefox
selenide.baseUrl=https://staging.example.com
selenide.timeout=10000
selenide.headless=true`,
    },
    {
      name: 'System properties (-Dselenide.*)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Overrides any Configuration setting for one run from the command line, using the same selenide.* keys as selenide.properties.',
      tip: 'Handy on CI to switch browser or base URL without a code change. A value assigned to Configuration in code still wins, so leave CI-controlled settings out of your setup methods.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html',
      code: `mvn test -Dselenide.browser=firefox -Dselenide.headless=true -Dselenide.timeout=10000`,
    },
    {
      name: 'Configuration.browser',
      level: 'beginner',
      platform: 'both',
      desc: 'Which browser Selenide starts: "chrome" (the default), "firefox", "edge", "safari", "ie" or "htmlunit".',
      tip: 'It also accepts the fully qualified name of a WebDriverProvider class. That is how selenide-appium runs plug in an AndroidDriver or IOSDriver.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browser',
      code: `import com.codeborne.selenide.Browsers;

Configuration.browser = Browsers.FIREFOX; // "firefox"`,
    },
    {
      name: 'Configuration.browser (htmlunit)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Runs tests in HtmlUnit, a headless browser written in Java, so no browser binary or driver has to be installed. Added in Selenide 7.19.0.',
      tip: 'Without the htmlunit3-driver dependency the first open() fails with IllegalStateException. HtmlUnit is always headless and ignores browserSize and browserPosition. It is not a real browser engine, so keep it for fast checks of simple pages.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Browsers.html#HTMLUNIT',
      code: `// needs the test dependency org.seleniumhq.selenium:htmlunit3-driver
Configuration.browser = "htmlunit"; // Browsers.HTMLUNIT
open("/login");`,
    },
    {
      name: 'Configuration.browserBinary',
      level: 'intermediate',
      platform: 'web',
      desc: 'Path to the browser executable to start, instead of the browser that Selenium finds on its own. There is no default.',
      tip: 'It works only for Chrome and Firefox. Set it in code, in selenide.properties, or with -Dselenide.browserBinary=/path/to/binary. Use it to test a specific build, such as Chromium or a beta channel.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browserBinary',
      code: `import com.codeborne.selenide.Configuration;

Configuration.browser = "chrome";
Configuration.browserBinary = "/usr/bin/chromium";`,
    },
    {
      name: 'Configuration.baseUrl',
      level: 'beginner',
      platform: 'web',
      desc: 'The URL that open() prepends to relative paths. The default is "http://localhost:8080".',
      tip: 'Selenide joins the two as plain strings, so a trailing slash on baseUrl plus a leading slash on the path gives "//". Absolute URLs passed to open() ignore baseUrl.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#baseUrl',
      code: `Configuration.baseUrl = "https://staging.example.com";
open("/login"); // https://staging.example.com/login`,
    },
    {
      name: 'Configuration.headless',
      level: 'beginner',
      platform: 'web',
      desc: 'Runs the browser without a visible window. The default is false.',
      tip: 'Chrome and Edge get --headless=new and Firefox gets -headless. Safari throws IllegalArgumentException when headless is true, so switch it off for Safari runs.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#headless',
      code: `Configuration.headless = true; // or -Dselenide.headless=true`,
    },
    {
      name: 'Configuration.browserSize',
      level: 'beginner',
      platform: 'web',
      desc: 'The browser window size as "WIDTHxHEIGHT". The default is "1366x768".',
      tip: 'Set it explicitly for headless runs: responsive layouts that hide menus below a breakpoint are a common cause of tests that pass locally and fail on CI. Configuration.browserPosition works the same way.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browserSize',
      code: `Configuration.browserSize = "1920x1080";`,
    },
    {
      name: 'Configuration.timeout',
      level: 'intermediate',
      platform: 'both',
      desc: 'How long, in milliseconds, should* methods keep retrying before they fail. The default is 4000.',
      tip: 'Set it once for the suite, or pass -Dselenide.timeout=10000. For one slow element, pass a Duration to should() instead of raising the global value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#timeout',
      code: `Configuration.timeout = 10_000; // milliseconds`,
    },
    {
      name: 'Configuration.pollingInterval',
      level: 'intermediate',
      platform: 'both',
      desc: 'How often, in milliseconds, a waiting should* check re-evaluates its condition. The default is 200.',
      tip: 'Every poll is a WebDriver call. Over Selenium Grid or Appium each call is a network round trip, so a higher interval reduces load, while a lower one rarely speeds a suite up.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#pollingInterval',
      code: `Configuration.pollingInterval = 500; // milliseconds`,
    },
    {
      name: 'Configuration.pageLoadTimeout',
      level: 'intermediate',
      platform: 'web',
      desc: 'How long, in milliseconds, open() and other navigations wait for a page to load before failing.',
      tip: 'Selenide sets 30000 ms instead of the Selenium default of 300 seconds. A negative value tells Selenide not to set a page load timeout at all.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#pageLoadTimeout',
      code: `Configuration.pageLoadTimeout = 60_000; // milliseconds`,
    },
    {
      name: 'Configuration.pageLoadStrategy',
      level: 'intermediate',
      platform: 'web',
      desc: 'When navigation returns: "normal" (the default) waits for the load event, "eager" for DOMContentLoaded, "none" returns at once.',
      tip: '"eager" can speed up pages with slow images or third-party scripts. Selenide assertions still wait for elements, so it is usually safe.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#pageLoadStrategy',
      code: `Configuration.pageLoadStrategy = "eager";`,
    },
    {
      name: 'Configuration.remote',
      level: 'intermediate',
      platform: 'web',
      desc: 'The URL of a Selenium Grid or other remote WebDriver. The default is null, which starts a local browser.',
      tip: 'Remote calls use remoteConnectionTimeout (default 10000 ms) and remoteReadTimeout (default 90000 ms). Configuration.browser still picks which browser the grid starts.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#remote',
      code: `Configuration.remote = "http://localhost:4444/wd/hub";
Configuration.browser = "firefox";`,
    },
    {
      name: 'Configuration.browserCapabilities',
      level: 'intermediate',
      platform: 'web',
      desc: 'Extra capabilities or browser options merged on top of the ones Selenide builds itself.',
      tip: 'They override capabilities set through system properties. The options must match Configuration.browser: ChromeOptions with browser "firefox" fails with "Conflicting browser name".',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browserCapabilities',
      code: `import org.openqa.selenium.chrome.ChromeOptions;

Configuration.browserCapabilities = new ChromeOptions()
    .addArguments("--lang=en-GB");`,
    },
    {
      name: 'Configuration.reopenBrowserOnFail',
      level: 'advanced',
      platform: 'web',
      desc: 'Whether Selenide starts a new browser when the current one has crashed or been closed. The default is true.',
      tip: 'Set it to false to fail fast with an IllegalStateException instead of carrying on in a fresh browser that has lost cookies and login state.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#reopenBrowserOnFail',
      code: `Configuration.reopenBrowserOnFail = false;`,
    },
    {
      name: 'Configuration.screenshots',
      level: 'intermediate',
      platform: 'both',
      desc: 'Whether a failing check saves a screenshot, and with savePageSource the page source, into reportsFolder. Both default to true.',
      tip: 'reportsFolder defaults to "build/reports/tests", the Gradle layout, so Maven builds usually point it under target. On Appium runs the page source is saved as .xml.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#screenshots',
      code: `Configuration.screenshots = true;
Configuration.savePageSource = false;
Configuration.reportsFolder = "target/selenide-reports";`,
    },
  ],
};
