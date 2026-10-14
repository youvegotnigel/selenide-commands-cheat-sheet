/** @type {import('./index.js').Category} */
export default {
  cat: 'Build & Run',
  cls: 'cli',
  color: '#fbbf24',
  items: [
    {
      name: 'mvn test (choose browser)',
      level: 'beginner',
      platform: 'web',
      desc: 'Runs the suite with Maven and picks the browser for this run through the selenide.browser system property, with no code change.',
      tip: 'For a fixed browser matrix use Maven profiles: selenide-examples/google has one profile per browser whose surefire systemPropertyVariables set selenide.browser, and its CI runs mvn test -P chrome and mvn test -P firefox. A Configuration.browser assignment in code still wins over both.',
      docs: 'https://github.com/selenide-examples/google/blob/main/pom.xml',
      code: `# one run in Firefox (the default is chrome)
mvn test -Dselenide.browser=firefox
# or activate a pom.xml profile whose surefire
# systemPropertyVariables set selenide.browser
mvn test -P firefox`,
    },
    {
      name: './gradlew test (forward -Dselenide.*)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Runs the suite with Gradle and passes selenide.* settings on the command line. The test task has to copy them into the test JVM, as the selenide-examples builds do.',
      tip: 'Without a forwarding block the -D flags stay in the Gradle process and the tests run with the defaults. selenide-examples/todomvc forwards only selenide.headless, so check which keys your build copies. Named tasks that set systemProperties for one browser (./gradlew firefox in selenide-examples/google) are the Gradle counterpart of Maven profiles.',
      docs: 'https://github.com/selenide-examples/google/blob/main/build.gradle',
      code: `# build.gradle (as in selenide-examples/google):
# tasks.withType(Test).configureEach {
#   System.properties.stringPropertyNames()
#     .findAll { it.startsWith("selenide.") }
#     .forEach { systemProperties[it] = System.getProperty(it) }
# }
./gradlew test -Dselenide.browser=firefox -Dselenide.headless=true`,
    },
    {
      name: 'Headless run on CI',
      level: 'beginner',
      platform: 'web',
      desc: 'Runs the browser without a window, which CI agents without a display need, by passing selenide.headless=true to the build.',
      tip: 'With Gradle it only works if build.gradle forwards the property. Some example poms (todomvc, testng) already set selenide.headless=true in surefire systemPropertyVariables, so check the pom when no window appears on your own machine either.',
      docs: 'https://github.com/selenide-examples/todomvc#how-to-run-with-gradle',
      code: `# Gradle (as in the selenide-examples/todomvc CI)
./gradlew clean test -Dselenide.headless=true
# Maven
mvn clean test -Dselenide.headless=true`,
    },
    {
      name: 'Run on a Grid (-Dselenide.remote)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Sends the whole run to a Selenium Grid or another remote WebDriver instead of a local browser, by setting selenide.remote for the build.',
      tip: "selenide.browser still chooses which browser the Grid starts. Selenide's own build has a chrome_remote Gradle task that sets exactly these two properties. For slow nodes raise selenide.remoteReadTimeout (default 90000 ms) as well.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#remote',
      code: `# Grid hub listening on localhost:4444
./gradlew test -Dselenide.remote=http://localhost:4444/wd/hub -Dselenide.browser=chrome
mvn test -Dselenide.remote=http://localhost:4444/wd/hub -Dselenide.browser=chrome`,
    },
    {
      name: 'Selenide CLI',
      level: 'intermediate',
      platform: 'web',
      desc: 'A command-line tool, selenide, that drives a real browser one command per call and records every successful command as Selenide Java code. Made for AI agents and quick exploration.',
      tip: 'open starts a background daemon that keeps the browser alive between calls (state in ~/.selenide-cli/), and code prints the recorded test. Quote CSS ids: unquoted, the shell reads #username as a comment. It needs JDK 17+ on PATH, and selenide install --skills copies its bundled agent skill into .claude/skills.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/cli/README.md#quick-start',
      code: `npm install -g @selenide/cli
selenide open https://the-internet.herokuapp.com/login
selenide setValue "#username" tomsmith
selenide click "button[type=submit]"
selenide should "#flash" text "You logged into a secure area!"
selenide code    # prints the recorded Selenide Java
selenide close   # stops the browser and the daemon`,
    },
    {
      name: 'Selenide CLI (open options and sessions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Flags on selenide open configure the browser of a session, and -s runs several independent browser sessions side by side.',
      tip: 'Flags apply only when the session daemon starts: a later open on a live session just navigates, so close it first to switch browser. Values attach with =: --headless=true is silently ignored, and in --browser firefox the word firefox is taken as the URL.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/cli/README.md#open-options',
      code: `# flags take effect when the session's daemon starts
selenide open --headless --browser=firefox --browser-size=1920x1080 https://example.com
# a second, independent browser in the session "grid"
selenide -s grid open --remote=http://localhost:4444/wd/hub https://example.com
selenide -s grid click "#login"
selenide list
selenide close-all`,
    },
    {
      name: 'Selenide MCP server',
      level: 'intermediate',
      platform: 'web',
      desc: 'An MCP server that lets AI assistants such as Claude Code drive a real browser through Selenide tools (browser_navigate, browser_click, browser_snapshot and more). It runs over stdio from the @selenide/mcp npm package.',
      tip: 'Flags mirror Selenide settings (--browser=, --base-url=, --remote=, --timeout=) and boolean ones are bare: --headless and --proxy-enabled, never --headless=true. The codegen tools browser_generate_locator, browser_generate_page_object and selenide_docs stay off until you pass --caps=codegen. Needs Java 17+.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/mcp/README.md#configuration-parameters',
      code: `# register with Claude Code
claude mcp add selenide-mcp -- npx @selenide/mcp --headless --browser=chrome
# or with the test code generation tools as well
claude mcp add selenide-mcp -- npx @selenide/mcp --headless --caps=codegen`,
    },
    {
      name: '--capability (CLI and MCP)',
      level: 'advanced',
      platform: 'web',
      desc: 'Sets any WebDriver capability for the Selenide CLI or MCP browser, including nested ones written as JSON. Added in Selenide 7.19.0.',
      tip: "A value starting with { or [ is parsed as JSON, true or false as a boolean, digits as an integer, anything else as a string. Single-quote the whole flag so the shell keeps the JSON quotes. Chrome args in goog:chromeOptions are added to Selenide's defaults, and a repeated name keeps the last value. A bare --capability with the value after a space throws IllegalArgumentException.",
      docs: 'https://github.com/selenide/selenide/blob/main/modules/mcp/README.md#browser-capabilities',
      code: `selenide open --capability='goog:chromeOptions={"args":["--no-sandbox"]}' https://example.com
claude mcp add selenide-mcp -- npx @selenide/mcp --capability='selenoid:options={"enableVNC":true}'`,
    },
  ],
};
