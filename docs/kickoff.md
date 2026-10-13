# Kickoff: Selenide + Appium Commands Cheat Sheet

You are starting a new project: an interactive, static, single-page cheat sheet for
**Selenide** (Java web UI testing) and its **Appium integration** (`selenide-appium`, mobile
testing on Android and iOS). It is a sibling of an existing, production-proven project,
`playwright-commands-cheat-sheet`
(https://github.com/youvegotnigel/playwright-commands-cheat-sheet, live at
https://youvegotnigel.github.io/playwright-commands-cheat-sheet/).

**This repository starts as a copy of that project.** The engine (UI, search, filters, modal,
URL state, meta bar, analytics, tests, CI, release-sync skill) is reused. Your job is to
**adapt** it, not to rebuild it: swap the content and the language-specific parts, and keep
the architecture, conventions and quality gates intact.

Before writing any code, read `CLAUDE.md`, `AGENTS.md`, `js/app.js`, `js/highlight.js`,
`tests/data-integrity.spec.js` and `.claude/skills/playwright-release-sync/` so you know what
you are adapting. Then run `superpowers:brainstorming` to confirm the open decisions listed
at the end, write the spec to `docs/superpowers/specs/`, write the plan with
`superpowers:writing-plans`, and execute it phase by phase.

---

## 1. Non-negotiable principles (carried over unchanged)

- **No build step.** Pure vanilla ES2022+ modules, HTML5, CSS3. No bundler, transpiler or
  framework. The site must work when `index.html` is served by any static file server.
- **Zero runtime dependencies, no CDN imports.** Everything in `package.json` is a
  `devDependency` (Playwright, ESLint 9 flat config, Prettier 3, `serve`).
- **The website is tested with Playwright** (`@playwright/test`), even though the content is
  about Selenide. The site is a JS static page, so Playwright is the right tool here. Keep
  the three projects: `chromium`, `iPhone 16`, `Pixel 7`, and the `webServer` on port 3000.
- **`npm test` must pass before any change is called done.** Also `npm run lint` and
  `npm run format:check`.
- **Code style:** 2-space indent, single quotes, semicolons, ES5 trailing commas, ~100 char
  lines (Prettier enforced).
- **Hosting:** GitHub Pages. **CI:** GitHub Actions. **Branches:** work on `develop`, PR to
  `master`.

## 2. What to keep, what to change

| Area | Keep as-is | Change |
|------|-----------|--------|
| `index.html`, `style.css` | Layout, dark theme, tile grid, modal, meta bar, `⌘K`/`Ctrl+K` search | Branding, title, favicon, meta-bar label (`Selenide vX` instead of `Playwright vX`), category gradients |
| `js/app.js` | Render, flat/grouped views, search across name/desc/code/tip, URL hash state, keyboard handling, copy button, `window.*` test globals | Highlighter selection logic (Java / shell / XML), new **Mobile** quick filter, version source for the meta bar |
| `js/highlight.js` | Single-pass regex tokenizer, HTML-escaping, the six `tok-*` classes, exact round-trip on Copy | Replace JS/TS rules with **Java** rules, add an **XML** highlighter (see section 5) |
| `js/data/` | One `export default` Category module per file, `index.js` ordering = display order | All content, plus a new required `platform` field (section 3) |
| `js/popular-commands.js`, `visitor-*.js` | Logic, `sessionStorage` dedup, `navigator.webdriver` bot guard, `localStorage` cache, top ~10% gets 🔥 | Supabase table / function names (section 6) |
| `tests/` | Structure and patterns (`page.evaluate(() => window.categories)`, `page.route` Supabase mocks, `poseAsRealVisitor`) | Data-integrity rules for the new schema, Java highlighter tests, release-specific entry tests |
| `.github/workflows/` | `test.yml`, `stamp-date.yml` (`js/meta.json` auto-stamp, `[skip ci]`), weekly `cheatsheet-sync.yml` with a deterministic drift check before any agent run | Drift detection source (Maven Central, not npm) |
| `.claude/skills/` | The release-sync skill's shape: measure gap, read whole delta, verify against shipped artifact, check links, bump references | Rewrite as `selenide-release-sync` (section 7) |
| Docs | `CLAUDE.md`, `AGENTS.md`, `readme.md`, `docs/superpowers/{specs,plans}` | Rewrite for Selenide, delete Playwright-specific specs and plans |

Delete every Playwright content module and every Playwright-specific test block (for
example the `Playwright 1.62 entries` and `Media & Audio entries` describes in
`data-integrity.spec.js`). Keep the generic integrity checks.

## 3. Data schema

Same shape as the Playwright project, plus one required field:

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',          // filter button and tile label
  cls: 'conditions',          // CSS class for the tile gradient
  color: '#22c55e',           // 6-digit hex, validated by tests
  items: [
    {
      name: 'shouldHave(text())',          // globally unique display name
      level: 'beginner',                   // 'beginner' | 'intermediate' | 'advanced'
      platform: 'web',                     // 'web' | 'mobile' | 'both'  (NEW, required)
      desc: 'Asserts the element contains the given text, waiting up to Configuration.timeout.',
      tip: 'text() is a case-insensitive substring match. Use exactText() for an exact match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
  ],
};
```

`data-integrity.spec.js` must enforce:

| Rule | Check |
|------|-------|
| Required fields | `name`, `level`, `platform`, `desc`, `tip`, `docs`, `code` present, non-blank |
| `level` | `beginner` \| `intermediate` \| `advanced` |
| `platform` | `web` \| `mobile` \| `both` |
| `docs` | starts with `https://` and the host is on the allowlist: `selenide.org`, `github.com/selenide`, `appium.io`, `github.com/appium` |
| `code` | at least 20 characters after trimming |
| `name` | unique within its category and across all categories |
| `color` | `/^#[0-9a-fA-F]{6}$/` |
| All fields | no em-dash `—` or en-dash `–` |

### Java-in-template-literal gotchas (put these in the new CLAUDE.md)

`code` is a JS template literal holding Java:
- `$("#id")` and `$$(".row")` are fine. Only `${` needs escaping, which appears in Maven and
  properties snippets: write `\${selenide.version}`.
- Java regex and escape sequences double up: Java `"\\d+"` must be written `"\\\\d+"`.
- Backticks never appear in Java, so no escaping is needed there.

### Snippet conventions

- Java 17+. Snippets assume the standard Selenide static imports:
  `import static com.codeborne.selenide.Selenide.*;`,
  `import static com.codeborne.selenide.Condition.*;`,
  `import static com.codeborne.selenide.CollectionCondition.*;`.
  Show these once in a dedicated beginner entry ("Static imports"). Any other import that
  is not obvious (for example `AppiumBy`, `CombinedBy`, `AppiumClickOptions`) goes inside the
  snippet.
- Snippets are short and focused: one concept, no class boilerplate unless the concept
  is the class (page objects, JUnit extensions, driver providers).

## 4. Content plan (seed list: verify every API before writing)

Treat the lists below as a starting point, not as facts. **Every API name, signature and
behaviour must be verified against the pinned release's sources** (section 7). Drop
anything that does not exist and add anything important that is missing. Target roughly
200 to 260 entries in total.

**Web (Selenide core)**
1. **Setup & Config**: Maven/Gradle dependency, `Configuration.browser`, `baseUrl`,
   `timeout`, `pageLoadTimeout`, `headless`, `browserSize`, `remote`, `browserCapabilities`,
   `selenide.properties`, `-Dselenide.*` system properties, `reopenBrowserOnFail`.
2. **Navigation & Browser**: `open()`, `Selenide.back/forward/refresh`, `title()`,
   `webdriver().shouldHave(url(...))`, `closeWebDriver()`, `closeWindow()`, `using(driver, ...)`.
3. **Selectors**: `$`, `$$`, `$x`, `byText`, `withText`, `byAttribute`, `byTagAndText`,
   `byId`, `shadowCss`, `find`, `findAll`, `parent`, `closest`, `ancestor`, `sibling`,
   `preceding`, `lastChild`.
4. **Actions**: `click`, `click(ClickOptions...)`, `doubleClick`, `contextClick`, `hover`,
   `setValue`, `val`, `append`, `clear`, `type`, `press`, `pressEnter`, `pressTab`,
   `selectOption`, `selectOptionByValue`, `selectRadio`, `setSelected`, `dragAndDrop`,
   `scrollTo`, `scrollIntoView`.
5. **Conditions**: `shouldBe/shouldHave/shouldNotBe`, `visible`, `hidden`, `exist`,
   `enabled`, `text`, `exactText`, `value`, `attribute`, `cssClass`, `cssValue`,
   `matchText`, `and`, `or`, `not`, custom conditions, `should(..., Duration)`.
6. **Collections**: `ElementsCollection`, `size`, `sizeGreaterThan`, `texts`, `exactTexts`,
   `itemWithText`, `filterBy`, `excludeWith`, `findBy`, `first`, `last`, `get(i)`,
   `asDynamicIterable`, `asFixedIterable`.
7. **Waits & Timeouts**: implicit waiting model, per-call `Duration`, `Selenide.sleep`
   (and why to avoid it), `Wait()`.
8. **Page Objects**: `page()`, `@FindBy`, `SelenideElement` fields, `Container` /
   `ElementsContainer`, `@Self`.
9. **Windows, Frames, Alerts**: `switchTo().window/frame/innerFrame/defaultContent`,
   `confirm`, `dismiss`, `prompt`.
10. **Files**: `uploadFile`, `uploadFromClasspath`, `download()`, `FileDownloadMode`
    (`HTTPGET`, `FOLDER`, `PROXY`, `CDP`), download filters and timeouts.
11. **Proxy & Network**: `proxyEnabled`, `getSelenideProxy()`, request/response filters,
    mocking a response.
12. **JavaScript, Storage, Clipboard**: `executeJavaScript`, `executeAsyncJavaScript`,
    `localStorage()`, `sessionStorage()`, `clipboard()`, cookies via `webdriver().driver()`.
13. **Reports & Debugging**: screenshots, `ScreenShooter`, `TextReport`, `SelenideLogger`
    and listeners, Allure integration (`AllureSelenide`), soft asserts.
14. **Test Frameworks**: JUnit 5 extensions (`TextReportExtension`,
    `ScreenShooterExtension`, `SoftAssertsExtension`, `BrowserPerTestStrategyExtension`),
    TestNG listeners.
15. **Remote & Grid**: Selenium Grid, Selenoid/Moon style capabilities, BiDi or CDP access
    where Selenide exposes it.
16. **Patterns**: login reuse, multiple browsers in one test, custom `WebDriverProvider`,
    custom conditions, data-driven tests.

**Mobile (selenide-appium)**
17. **Appium Setup**: `selenide-appium` dependency, a custom `WebDriverProvider` returning
    `AndroidDriver` / `IOSDriver`, `UiAutomator2Options`, `XCUITestOptions`,
    `SelenideAppium.launchApp()`, `Configuration.browser` pointing at the provider.
18. **Mobile Selectors**: `$(AppiumBy.accessibilityId(...))`, `AppiumBy.id`,
    `AppiumBy.androidUIAutomator`, `AppiumBy.iOSNsPredicateString`, `iOSClassChain`,
    `CombinedBy.android(...).ios(...)`, `@AndroidFindBy` / `@iOSXCUITFindBy` in page
    objects, `SelenideAppiumElement`.
19. **Mobile Gestures**: tap, long press, tap with offset (`AppiumClickOptions`),
    `scroll` / `scrollTo` with `AppiumScrollOptions`, swipe, `hideKeyboard`.
20. **Mobile Context & App**: native vs WebView context switching, deep links, app
    background/terminate/activate, `SelenideAppium.back()`, mobile-specific conditions.
21. **Appium CLI & Tools**: `npm i -g appium`, `appium driver install uiautomator2 / xcuitest`,
    `appium driver doctor`, starting the server, Appium Inspector, `adb` / `xcrun simctl`
    essentials.

**CLI (web)**
22. **Build & Run**: `mvn test -Dselenide.browser=firefox`, Gradle equivalents, running one
    test, headless in CI, passing `-Dselenide.remote`.

Entries with `platform: 'both'` are concepts that apply equally (for example conditions on
a `SelenideAppiumElement`).

## 5. Syntax highlighting

Rewrite `js/highlight.js`, keeping its design (dependency-free, single-pass regex
tokenizer, HTML-escape everything, exact round-trip so Copy yields the original source).
Export:

- `highlight(code)` for **Java** (also acceptable for Gradle Kotlin DSL):
  - `tok-keyword`: Java keywords incl. `var`, `record`, `sealed`, `permits`, `yield`
  - `tok-string`: `"..."`, `'c'`, and text blocks `"""..."""`
  - `tok-comment`: `//`, `/* */`, `/** */`
  - `tok-number`: ints, longs `10L`, floats, underscores `1_000`, hex
  - `tok-fn`: method names before `(`
  - `tok-api`: Selenide/Appium identifiers (`$`, `$$`, `open`, `Configuration`,
    `Condition`, `SelenideElement`, `ElementsCollection`, `AppiumBy`, `CombinedBy`,
    `SelenideAppium`, ...). Annotations (`@Test`, `@FindBy`) may reuse `tok-keyword`.
- `highlightShell(code)` kept for `mvn`, `gradle`, `appium`, `adb`, `npm` snippets
  (`tok-api` = known program names).
- `highlightXml(code)` for `pom.xml` snippets (tags, attributes, strings, comments,
  `${...}` properties), using the same six classes.

`app.js` selects: shell when `item.cls === 'cli' || item.cls === 'appium-cli'` or the snippet
matches `/^\s*(mvn|gradle|\.\/gradlew|appium|adb|npm|npx|#)/`; XML when it starts with `<`;
Java otherwise. Expose `window.highlightXml` for tests. Build it test-first: extend
`tests/highlight.spec.js` with Java cases (text blocks, `$("...")`, annotations, generics,
escaped quotes, a `"//"` inside a string not becoming a comment) before writing the rules.

## 6. UI additions and analytics

- **Mobile quick filter:** add a `📱 Mobile` filter next to `Beginner` and `🔥 Popular`,
  showing `platform === 'mobile' || platform === 'both'`. It must round-trip through the URL
  hash (`#filter=mobile`) like the others. Add tests in `cheatsheet.spec.js`.
- **Visual split:** give the Appium categories a distinct gradient family from the web
  categories so the two halves read apart in grouped view.
- **Meta bar version:** there is no npm package to read. Create `js/versions.json`, for example
  `{ "selenide": "7.x.y", "selenideAppium": "7.x.y", "appiumJavaClient": "9.x.y" }`, as the
  single pinned source of truth. The meta bar fetches it and shows `Selenide vX`, with the
  HTML fallback value kept in sync. The release-sync skill bumps this file.
- **Supabase:** reuse the existing Supabase project, with Selenide-specific tables
  and functions so the counts never mix: `selenide_visits`, `selenide_command_views`,
  RPCs `increment_selenide_visits` / `increment_selenide_command_view`, Edge Functions
  `increment-selenide-visitor` / `increment-selenide-command-view`. Copy the existing
  migrations' structure exactly: atomic `update` / upsert-increment, RLS enabled, public
  `select` only, and writes only through the Edge Function's service-role key. The anon key
  and URL stay public in client JS by design. The command ID scheme stays
  `` `${item.cls}:${item.name}` ``.

## 7. Release sync skill: `selenide-release-sync`

Rewrite `.claude/skills/playwright-release-sync/` as `.claude/skills/selenide-release-sync/`.
Keep the principle **"what shipped is the truth"**: training data, memory, `main`-branch
docs and Context7 are not evidence.

- **Version source:** Maven Central metadata
  (`https://repo1.maven.org/maven2/com/codeborne/selenide/maven-metadata.xml`, and the same
  for `selenide-appium`). Check whether `selenide-appium` versions track core; if they do,
  treat them as one release line.
- **Release notes:** GitHub releases / `CHANGELOG.md` of `selenide/selenide` at the release
  tag, read for every version in the delta.
- **Verification artifact (the equivalent of Playwright's `.d.ts`):** download the
  `-sources.jar` for the pinned version from Maven Central, `unzip` it into a temp dir, and
  `grep` the real signatures. Node and `unzip` only, so no JVM is needed in CI.
- **Scripts** (Node, no deps): `release-delta.mjs` (`--check` prints
  `pinned=… latest=… behind=true|false`) and `check-docs-links.mjs`, which must resolve
  every `docs` URL **and its `#anchor`**. Javadoc anchors look like
  `#shouldHave(com.codeborne.selenide.WebElementCondition...)`, so the checker has to
  decode them and match the page's `id` attributes exactly. Find real anchors by listing the
  page's ids, never by guessing.
- **npm scripts:** `release:delta`, `check:links`, same names as before.
- **Workflow:** `cheatsheet-sync.yml` keeps the weekly cron (Selenide ships less often than
  Playwright, so weekly or fortnightly is fine), the cheap deterministic drift step first,
  the agent only on drift or manual dispatch, a draft PR with `[CI FAILING]` when a gate fails,
  and it never merges.
- Keep `references/quality-bar.md`, adapted: entry writing rules, placement, the test
  template for new-release entries, report format.

## 8. Delivery phases (each ends with all gates green)

1. **Strip and rebrand.** Remove Playwright content and specific tests, rebrand, keep 2 or 3
   placeholder Selenide entries so the UI and the tests have data. Confirm `npm test` passes.
2. **Schema:** add `platform` and the new docs allowlist, then update `data-integrity.spec.js`.
3. **Highlighter**, test-first (Java, shell, XML).
4. **Mobile filter**, `versions.json` meta bar, gradients, with tests.
5. **Content**, category by category. Categories are independent, so use parallel
   subagents, one per category. Each one verifies its entries against the sources jar and
   runs `check:links` for its URLs. Review each category's diff before merging it in.
6. **Supabase** migrations and Edge Functions (I apply them to the project myself, so
   ask before running anything against the live project).
7. **Release-sync skill, scripts and workflow.**
8. **Docs:** rewrite `CLAUDE.md` (same structure as the Playwright one), `AGENTS.md` and
   `readme.md`, with screenshots in `images/`.

## 9. Open decisions to confirm with me during brainstorming

- Repo name and Pages URL (default: `selenide-commands-cheat-sheet`).
- Java only, or Java plus Kotlin toggle for snippets (default: Java only for v1).
- Reuse the existing Supabase project with prefixed tables (default) or a new project.
- Whether `platform` should split `mobile` into `android` / `ios` (default: no; Android/iOS
  differences go in the `tip`).
- Sync cadence (default: weekly).
- Optional stretch goal: a CI job that compiles each Java snippet in a generated harness
  with `javac` against the pinned jars, closing the "syntax errors ship silently" gap.
