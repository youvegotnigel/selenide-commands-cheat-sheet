# Javadoc Gap Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 25 verified entries for public Selenide 7.19.0 methods that the cheat sheet does not cover yet, led by the value getters (`getText()`, `val()`, `getAttribute()`, `exists()`, `texts()`). No UI changes.

**Architecture:** Content-only change. Each new item goes into an existing category module in `js/data/`, next to its closest relative (for example `getText() and text()` sits right after `shouldHave(text())`, the same way `title()` already sits in Navigation). Each item has a guard test in `tests/content/<cls>.spec.js`, written first. There are no new categories, so `style.css`, `js/data/index.js` and the `PALETTE` table stay untouched. The only non-data edit is the `#cmd-count` fallback in `index.html`.

**Tech Stack:** Vanilla ES modules, Playwright 1.64 tests, ESLint 9, Prettier 3. Content: Selenide 7.19.0 (latest: `release:delta --check` reports `behind=false`).

**Spec:** Part A of this document. The gap analysis came from the Javadoc of 7.19.0, read from the sources jars in `.cache/sources/` (the Javadoc is generated from them) and the live `selenide.org/javadoc/current/` anchors. Read `CLAUDE.md` and `.claude/skills/selenide-release-sync/references/quality-bar.md` before starting.

## Global Constraints

- Every name, signature, default and behaviour claim is confirmed in `.cache/sources/` (run `npm run fetch:sources` if the folder is missing). The jar wins over the docs, Context7 and memory.
- Sources policy (`CLAUDE.md`): the jars, `CHANGELOG.md` at a tag, `selenide.org`, `github.com/selenide/*`, Context7 `/selenide/selenide`. Anything else needs the user's approval first.
- `docs` values are exactly the URLs in the A2 table. Every anchor there was confirmed on the live Javadoc page on 2026-10-17.
- No em-dash or en-dash characters anywhere in the data, including code comments.
- `name`: exactly as in A2 (globally unique, no `<` or `>`).
- `code`: Java 17+, at least 20 characters, assumes the static imports of `Selenide`, `Condition` and `CollectionCondition`. Every other import (`Selectors`, `WebDriverRunner`, `TextMatchOptions`, `Device`, `DownloadOptions`, Selenium classes, `java.*`) is written inside the snippet.
- Template literals: `${` never appears unescaped; Java backslashes are doubled.
- Getter tips: every entry in A2 marked **G** says, in its tip, that the Javadoc marks it "NOT RECOMMENDED" and names the waiting assertion to prefer. The wiki page the Javadoc links is `https://github.com/selenide/selenide/wiki/do-not-use-getters-in-tests`.
- Test template: the one in `quality-bar.md` ("Tests"). Each new test cites the jar file and the signature line in a comment above its assertions.
- Gates before each commit: `npm run test:chromium -- tests/content/<touched files>`, `npm run lint`, `npm run format:check`. Task 6 runs the full suite and the link checker.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Java that does not compile.** The tests check substrings only. Read every snippet as Java. The riskiest: `url()` and `source()` come from `WebDriverRunner`, not `Selenide`, so they need `import static com.codeborne.selenide.WebDriverRunner.url;` (P1); `TextMatchOptions.partialText()` (no argument) must stay qualified so it is not confused with `Condition.partialText(String)` (P5); `getSelectedRadio(By)` is a static `Selenide` method, not an element method (C4).
2. **Getters presented as the normal way to check.** A reader who copies `assertEquals("Hello", $("#x").getText())` loses Selenide's waiting. Every **G** entry shows the getter used for a value the test needs (a computed total, an id to reuse), not for an assertion, and the tip points to the `should*` form. The reviewer rejects any snippet that asserts on a getter's result.
3. **Wrong waiting semantics.** `getText()`, `val()` and `getAttribute()` retry until the element is found (up to `Configuration.timeout`), then return the current value at once: they do not wait for the value to change. `exists()` and `isDisplayed()` return `false` instead of throwing, so in practice they do not wait, but an invalid selector still throws. Tests pin the phrases in G1 and G5.
4. **Deprecated or confusable APIs creeping in.** `clearBrowserCookies()`, `clearBrowserLocalStorage()` (deprecated since 7.17.0) and `Configuration.holdBrowserOpen` (deprecated) must not appear. `getSelectedText()` (selected *page* text) is not the select-box getter. `Configuration.webdriverLogsEnabled` (driver service log file) is not `getWebDriverLogs()` (browser log entries). Negative guards pin each one.
5. **Count badge and search.** 279 + 25 = **304**. `meta-bar.spec.js:109` compares the badge with the data count, and Task 6 updates the `index.html` fallback. Searching "getText" must find G1. `cheatsheet.spec.js` already covers search by name, so no new UI test is needed; the reviewer runs the search once by hand.

---

# Part A: Design

## A1. Scope

Compared: every public method and field of `SelenideElement`, `ElementsCollection` / `BaseElementsCollection`, `Condition`, `CollectionCondition`, `Selectors`, `Selenide`, `WebDriverRunner`, `SelenideTargetLocator`, `WebDriverConditions` and `Configuration` (7.19.0 jars), against every `name` and `code` in `js/data/`.

**Deliberately left out** (goes in the final report under that heading):

| Item | Reason |
|---|---|
| `clearBrowserCookies()`, `clearBrowserLocalStorage()` | Deprecated since 7.17.0 (`Selenide.java:1071`, `:1085`). The replacements are already in `cookies()` and `localStorage()` tips |
| `Configuration.holdBrowserOpen` | `@Deprecated`: "the webdriver leaves running forever" (`Configuration.java:65-75`) |
| `Configuration.browserVersion` | Javadoc: "for Internet Explorer" (`Configuration.java:100`) |
| `getSelectedText()`, `getUserAgent()` | Rare; one-line getters with no gotcha worth an entry |
| `isImage()`, `getAlias()` | Covered by `shouldBe(image)` and `as() and describe()` |
| `savePageSourceWithResources`, `selectorMode` | Rare tuning settings |
| `pressTab()`, `pressEscape()`, `scrollTo()`, `selectOptionByValue()`, `selectOptionContainingText()` | Already explained inside existing entries |

## A2. New entries

Docs base `B` = `https://selenide.org/javadoc/current/com/codeborne/selenide/`.

| ID | Name (exact) | File, placed after | Level | Platform | `docs` |
|---|---|---|---|---|---|
| G1 | `getText() and text()` | `condition.js`, `shouldHave(text())` | beginner | both | `B` + `SelenideElement.html#getText()` |
| G2 | `val() and getValue()` | `condition.js`, `shouldHave(value())` | beginner | web | `B` + `SelenideElement.html#val()` |
| G3 | `getAttribute()` | `condition.js`, `shouldHave(attribute())` | beginner | both | `B` + `SelenideElement.html#getAttribute(java.lang.String)` |
| G4 | `innerHtml() and getOwnText()` | `condition.js`, `shouldHave(ownText())` | intermediate | web | `B` + `SelenideElement.html#innerHtml()` |
| G5 | `exists() and isDisplayed()` | `wait.js`, `is(condition) and has(condition)` | beginner | both | `B` + `SelenideElement.html#exists()` |
| C1 | `texts()` | `collection.js`, `get(), first() and last()` | beginner | both | `B` + `BaseElementsCollection.html#texts()` |
| C2 | `getSelectedOptionText() and getSelectedOptionValue()` | `action.js`, `selectOption()` | beginner | web | `B` + `SelenideElement.html#getSelectedOptionText()` |
| C3 | `getOptions() and getSelectedOptions()` | `action.js`, C2 | intermediate | web | `B` + `SelenideElement.html#getOptions()` |
| C4 | `getSelectedRadio()` | `action.js`, `selectRadio()` | intermediate | web | `B` + `Selenide.html#getSelectedRadio(org.openqa.selenium.By)` |
| P1 | `url() and source()` | `navigation.js`, `title()` | beginner | web | `B` + `WebDriverRunner.html#url()` |
| P2 | `updateHash()` | `navigation.js`, `refresh()` | intermediate | web | `B` + `Selenide.html#updateHash(java.lang.String)` |
| P3 | `zoom()` | `navigation.js`, P2 | advanced | web | `B` + `Selenide.html#zoom(double)` |
| P4 | `byLinkText() and byPartialLinkText()` | `selector.js`, `byTagAndText()` | beginner | web | `B` + `Selectors.html#byLinkText(java.lang.String)` |
| P5 | `byLabel()` | `selector.js`, `byTestId()` | intermediate | web | `B` + `Selectors.html#byLabel(java.lang.String,com.codeborne.selenide.TextMatchOptions)` |
| P6 | `getFocusedElement()` | `condition.js`, `shouldBe(focused)` | intermediate | web | `B` + `Selenide.html#getFocusedElement()` |
| W1 | `switchTo().alert()` | `window.js`, `prompt()` | intermediate | web | `B` + `SelenideTargetLocator.html#alert(java.time.Duration)` |
| W2 | `switchTo().newWindow()` | `window.js`, `switchTo().window(nameOrHandleOrTitle)` | intermediate | web | `B` + `SelenideTargetLocator.html#newWindow(org.openqa.selenium.WindowType)` |
| W3 | `actions()` | `action.js`, `dragAndDrop(DragAndDropOptions)` | advanced | web | `B` + `Selenide.html#actions()` |
| W4 | `toWebElement() and getWrappedElement()` | `pattern.js`, `execute(Command) (custom command)` | advanced | both | `B` + `SelenideElement.html#toWebElement()` |
| W5 | `cached()` | `pattern.js`, W4 | advanced | both | `B` + `SelenideElement.html#cached()` |
| D1 | `getWebDriverLogs()` | `report.js`, `SelenideLogger.addListener()` | advanced | web | `B` + `Selenide.html#getWebDriverLogs(java.lang.String,java.util.logging.Level)` |
| D2 | `emulateDevice() and resetEmulation()` | `javascript.js`, `clock().setTimezone()` | advanced | web | `B` + `Selenide.html#emulateDevice(com.codeborne.selenide.Device)` |
| D3 | `atBottom()` | `action.js`, `scrollIntoCenter()` | intermediate | web | `B` + `Selenide.html#atBottom()` |
| D4 | `downloadFiles(DownloadOptions)` | `file.js`, `download(DownloadOptions)` | intermediate | web | `B` + `SelenideElement.html#downloadFiles(com.codeborne.selenide.DownloadOptions)` |
| D5 | `Configuration.browserBinary` | `config.js`, `Configuration.browser (htmlunit)` | intermediate | web | `B` + `Configuration.html#browserBinary` |

**G** = G1 to G5, C1, C2 (getter-tip rule in Global Constraints).

Platform rationale: selenide-appium 7.19.0 `SelenideAppiumCommands.java:7-27` overrides `val` (and setters, gestures, finders) but not `getText`, `getAttribute`, `exists`, `isDisplayed`, `texts`, `toWebElement`, `getWrappedElement` or `cached`, so those behave the same on `SelenideAppiumElement` (`both`). `val()` reads the `value` attribute, which native Android elements do not have, so G2 is `web`.

## A3. Facts per entry

Paths are under `.cache/sources/selenide-core-7.19.0/com/codeborne/selenide/` unless they start with `selenide-7.19.0/`. Cite these in the test comments.

| ID | Facts the entry must state (and only these, plus the getter-tip rule) |
|---|---|
| G1 | `String getText();` (`SelenideElement.java:210`): visible text, trimmed; for a `select` returns the selected option text(s). `text()` is the short form (`:230`). It retries until the element is found (`impl/SelenideElementProxy.java`, `dispatchAndRetry`), then returns the current text: it does not wait for the text to change |
| G2 | `String val();` `:290`, `String getValue();` `:300`: the `value` attribute, `null` if missing. `val(String)` with an argument is `setValue` (`:61`) |
| G3 | `@Nullable String getAttribute(String name);` `:349`. Same retry rule as G1 |
| G4 | `innerHtml()` `:259`: "can be used to get the html of a hidden element", short for `getAttribute("innerHTML")`. `getOwnText()` `:238`: text without children |
| G5 | `exists()` `:366`, `isDisplayed()` `:377`: return `false` when the element is missing, the browser is closed or a WebDriver exception happens (`commands/Exists.java`, `commands/IsDisplayed.java`), so they return at once instead of waiting; an invalid selector still throws. For a waiting yes/no, `is(condition)` already has an entry |
| C1 | `public List<String> texts()` (`BaseElementsCollection.java:302`). Javadoc: "we highly recommend to verify them with `$$.shouldHave(texts(...))`" |
| C2 | `getSelectedOptionText()` `:1056` (`null` if nothing selected, `IllegalArgumentException` if not a `select`), `getSelectedOptionValue()` `:1038` (`null` if the option has no `value`) |
| C3 | `ElementsCollection getOptions();` `:1016`, `ElementsCollection getSelectedOptions();` `:1001` (empty if none): they return collections, so collection conditions apply |
| C4 | `public static SelenideElement getSelectedRadio(By radioField)` (`selenide-7.19.0/.../Selenide.java:701`), `null` if nothing selected |
| P1 | `WebDriverRunner.url()` `:258`, `source()` `:250`, `currentFrameUrl()` `:265` (`selenide-7.19.0/.../WebDriverRunner.java`). `Selenide.java` has no `url()` or `source()`. They read once; the waiting form is `webdriver().shouldHave(url(...))` |
| P2 | `updateHash(String hash)` (`Selenide.java:198`): sets `window.location.hash` without a reload; accepts `"#hash"` or `"hash"` (`SelenideDriver.java:252-256`) |
| P3 | `zoom(double factor)` (`Selenide.java:1019`), factor such as `1.1`, `2.0`, `0.5` |
| P4 | `byLinkText(String)` `Selectors.java:296`, `byPartialLinkText(String)` `:303` wrap `By.linkText` / `By.partialLinkText`. `byXpath`, `byTagName`, `byCssSelector`, `byClassName` (`:289-331`) are the same kind of `By` wrappers (tip only) |
| P5 | `byLabel(String)` `:96` uses `fullText()`; `byLabel(String, TextMatchOptions)` `:100`. `selector/find-elements-by-label.js`: matches the element whose `id` equals the label's `for`, otherwise the `input`, `select` or `textarea` inside the label. `TextMatchOptions.fullText()` / `partialText()` (`TextMatchOptions.java:15,19`) |
| P6 | `getFocusedElement()` (`Selenide.java:836`): `null` if nothing is focused. Prefer `shouldBe(focused)` for checks |
| W1 | `Alert alert()` and `Alert alert(@Nullable Duration timeout)` (`SelenideTargetLocator.java:171,176`): returns the Selenium `Alert` without closing it |
| W2 | `WebDriver newWindow(WindowType typeHint)` (`SelenideTargetLocator.java:281`), `WindowType.TAB` or `WINDOW`; Selenide then works in the new window |
| W3 | `public static Actions actions()` (`Selenide.java:1010`): Selenium `Actions`; the chain ends with `.perform()` |
| W4 | `toWebElement()` `:1268` throws `NoSuchElementException` without waiting; `getWrappedElement()` `:1277` waits and throws `ElementNotFound` |
| W5 | `cached()` `:1283`: later calls do not re-find the element; a re-rendered element becomes stale |
| D1 | `getWebDriverLogs(String logType)` and `(String, Level)` (`Selenide.java:1026,1057`), for example `LogType.BROWSER` for console output. Different from `Configuration.webdriverLogsEnabled` (default `false`), which writes the driver service log to `reportsFolder` as `webdriver.<name>.log` (`webdriver/AbstractDriverFactory.java:37-50`) |
| D2 | `emulateDevice(Device)`, `resetEmulation()` (`Selenide.java:149,153`). `record Device(String name, int width, int height, double pixelRatio)` with `IPHONE_SE`, `IPHONE_14`, `PIXEL_7`, `GALAXY_S21` (`Device.java:3-8`). Chromium uses DevTools, Firefox needs BiDi, anything else throws `UnsupportedOperationException` (`SelenideDriver.java:526-562`) |
| D3 | `public static boolean atBottom()` (`Selenide.java:1103`): `window.scrollY + window.innerHeight >= document.body.scrollHeight` (`SelenideDriver.java:430`). A scroll loop needs an upper bound |
| D4 | `List<File> downloadFiles(DownloadOptions options)` (`SelenideElement.java:1253`), `@since 7.17.0`. `DownloadOptions.files()` = `files(2)`, at least 2 files (`DownloadOptions.java:172-178`); `withExtension`, `withName`, `withNameMatching`, `withTimeout` filter |
| D5 | `public static String browserBinary` (`selenide-7.19.0/.../Configuration.java:357`), `-Dselenide.browserBinary=/path/to/binary`, "Works only for Chrome and Firefox", no default |

## A4. Guard assertions

Every test also asserts `entry` is not null, its `level`, its `platform` and `expect(entry.docs).toBe(<A2 docs>)`. The extra assertions per entry:

| ID | `code` must contain | `code` must not contain | Other |
|---|---|---|---|
| G1 | `.getText()`, `.text()` | `assertEquals(` | `tip` contains `NOT RECOMMENDED`, `shouldHave(text(` |
| G2 | `.val()`, `.getValue()` | `assertEquals(` | `tip` contains `null`, `setValue` |
| G3 | `.getAttribute("` | `assertEquals(` | `tip` contains `shouldHave(attribute(` |
| G4 | `.innerHtml()`, `.getOwnText()` | | `tip` contains `hidden` |
| G5 | `.exists()`, `.isDisplayed()` | `assertTrue(` | `tip` contains `false`, `is(` |
| C1 | `.texts()` | `assertEquals(` | `tip` contains `shouldHave(texts(` |
| C2 | `getSelectedOptionText()`, `getSelectedOptionValue()` | `getSelectedText()` | |
| C3 | `.getOptions().shouldHave(size(`, `.getSelectedOptions()` | | |
| C4 | `getSelectedRadio(byName("` | `).getSelectedRadio(` | |
| P1 | `import static com.codeborne.selenide.WebDriverRunner.url;`, `import static com.codeborne.selenide.WebDriverRunner.source;` | `Selenide.url(` | `tip` contains `webdriver().shouldHave(url(` |
| P2 | `updateHash("` | | `tip` contains `window.location.hash` |
| P3 | `zoom(` | | `code` matches `/zoom\(\d+\.\d+\)/` |
| P4 | `byLinkText("`, `byPartialLinkText("`, `import static com.codeborne.selenide.Selectors.` | | |
| P5 | `byLabel("`, `TextMatchOptions.partialText()` | | `tip` contains `for` |
| P6 | `getFocusedElement()` | | `tip` contains `shouldBe(focused)` |
| W1 | `switchTo().alert(Duration.ofSeconds(`, `import java.time.Duration;` | | |
| W2 | `switchTo().newWindow(WindowType.TAB)`, `import org.openqa.selenium.WindowType;` | | |
| W3 | `actions()`, `.perform()` | | |
| W4 | `.toWebElement()`, `.getWrappedElement()` | | `tip` contains `NoSuchElementException`, `ElementNotFound` |
| W5 | `.cached()` | | `tip` contains `stale` |
| D1 | `getWebDriverLogs(LogType.BROWSER, Level.`, `import org.openqa.selenium.logging.LogType;`, `import java.util.logging.Level;` | `webdriverLogsEnabled` | `tip` contains `webdriverLogsEnabled` |
| D2 | `emulateDevice(Device.PIXEL_7)`, `resetEmulation()`, `import com.codeborne.selenide.Device;` | | `tip` contains `UnsupportedOperationException` |
| D3 | `atBottom()` | | `tip` contains `bound` or `limit` (`toMatch(/bound\|limit/)`) |
| D4 | `downloadFiles(DownloadOptions.files()`, `List<File>` | | `desc` contains `Added in Selenide 7.17.0.`; `tip` contains `at least 2` |
| D5 | `Configuration.browserBinary = "` | `holdBrowserOpen` | `tip` contains `Chrome and Firefox`, `-Dselenide.browserBinary` |

Negative guards for deprecated APIs, added once in Task 6 against the whole dataset: no `code` in any of the 25 new entries contains `clearBrowserCookies(`, `clearBrowserLocalStorage(` or `holdBrowserOpen`.

---

# Part B: Tasks

Each task follows the same five steps. Each task's test block is a new `test.describe('Javadoc gap fill (Selenide 7.19.0)', ...)` at the end of the named spec file, with one `test('"<name>" exists at level <level>, platform <platform>', ...)` per entry, using `itemIn(page, '<cat>', '<name>')` and the A4 assertions.

Category `cat` values: `condition.js` = `Element Conditions`, `wait.js` = `Waits & Timeouts`, `collection.js` = `Collections`, `action.js` = `Actions`, `navigation.js` = `Navigation & Browser`, `selector.js` = `Selectors`, `window.js` = `Windows, Frames, Alerts`, `pattern.js` = `Patterns`, `report.js` = `Reports & Debugging`, `javascript.js` = `JavaScript, Storage, Clipboard`, `file.js` = `Files`, `config.js` = `Setup & Config`.

### Task 1: Element getters (G1 to G5)

**Files:**
- Modify: `js/data/condition.js` (G1 after `shouldHave(text())`, G4 after `shouldHave(ownText())`, G2 after `shouldHave(value())`, G3 after `shouldHave(attribute())`)
- Modify: `js/data/wait.js` (G5 after `is(condition) and has(condition)`)
- Test: `tests/content/condition.spec.js`, `tests/content/wait.spec.js`

**Interfaces:** Produces the entry names G1 to G5 exactly as in A2. Task 6 counts them.

- [ ] **Step 1: Write the failing tests** for G1 to G5 with the A4 assertions; cite the A3 file and line in a comment above each group of assertions.
- [ ] **Step 2: Run** `npm run test:chromium -- tests/content/condition.spec.js tests/content/wait.spec.js`. Expected: 5 new tests FAIL at `expect(entry).not.toBeNull()`; existing tests pass.
- [ ] **Step 3: Write the 5 entries** with the A2 metadata and the A3 facts. Snippets use the value for something other than an assertion (G1: parse a total and reuse it; G5: close an optional cookie banner only if it is displayed).
- [ ] **Step 4: Run** the same command, plus `npm run lint` and `npm run format:check`. Expected: all pass. Read each snippet back as Java.
- [ ] **Step 5: Commit** `git add js/data/condition.js js/data/wait.js tests/content/condition.spec.js tests/content/wait.spec.js && git commit -m "Add element getter entries: getText, val, getAttribute, innerHtml, exists"`

### Task 2: Collection and select getters (C1 to C4)

**Files:**
- Modify: `js/data/collection.js` (C1), `js/data/action.js` (C2 and C3 after `selectOption()`, C4 after `selectRadio()`)
- Test: `tests/content/collection.spec.js`, `tests/content/action.spec.js`

**Interfaces:** Produces C1 to C4 names from A2.

- [ ] **Step 1: Write the failing tests** for C1 to C4 (A4).
- [ ] **Step 2: Run** `npm run test:chromium -- tests/content/collection.spec.js tests/content/action.spec.js`. Expected: 4 new tests FAIL at `not.toBeNull()`.
- [ ] **Step 3: Write the 4 entries.** C4's snippet imports `static com.codeborne.selenide.Selectors.byName`.
- [ ] **Step 4: Run** the same command, `npm run lint`, `npm run format:check`. Expected: pass.
- [ ] **Step 5: Commit** `git commit -m "Add collection and select getter entries: texts, selected option, options, selected radio"`

### Task 3: Page state, selectors and focus (P1 to P6)

**Files:**
- Modify: `js/data/navigation.js` (P1, P2, P3), `js/data/selector.js` (P4, P5), `js/data/condition.js` (P6)
- Test: `tests/content/navigation.spec.js`, `tests/content/selector.spec.js`, `tests/content/condition.spec.js`

**Interfaces:** Produces P1 to P6 names from A2. Touches `condition.js` after Task 1: append P6's test inside the Task 1 `describe` block.

- [ ] **Step 1: Write the failing tests** for P1 to P6 (A4).
- [ ] **Step 2: Run** `npm run test:chromium -- tests/content/navigation.spec.js tests/content/selector.spec.js tests/content/condition.spec.js`. Expected: 6 new tests FAIL.
- [ ] **Step 3: Write the 6 entries.** P5's snippet imports `com.codeborne.selenide.TextMatchOptions` and calls `TextMatchOptions.partialText()` qualified (Review Focus 1).
- [ ] **Step 4: Run** the same command, `npm run lint`, `npm run format:check`. Expected: pass.
- [ ] **Step 5: Commit** `git commit -m "Add page state and selector entries: url, source, updateHash, zoom, link text, byLabel, focused element"`

### Task 4: Windows, alerts and Selenium interop (W1 to W5)

**Files:**
- Modify: `js/data/window.js` (W1, W2), `js/data/action.js` (W3), `js/data/pattern.js` (W4, W5)
- Test: `tests/content/window.spec.js`, `tests/content/action.spec.js`, `tests/content/pattern.spec.js`

**Interfaces:** Produces W1 to W5 names from A2. `action.spec.js` already has Task 2's block: append W3's test to it.

- [ ] **Step 1: Write the failing tests** for W1 to W5 (A4).
- [ ] **Step 2: Run** `npm run test:chromium -- tests/content/window.spec.js tests/content/action.spec.js tests/content/pattern.spec.js`. Expected: 5 new tests FAIL.
- [ ] **Step 3: Write the 5 entries.** W3's snippet imports `org.openqa.selenium.Keys` if it uses `keyDown`; W2's tip says Selenide continues in the new window.
- [ ] **Step 4: Run** the same command, `npm run lint`, `npm run format:check`. Expected: pass.
- [ ] **Step 5: Commit** `git commit -m "Add window, alert and Selenium interop entries: alert, newWindow, actions, toWebElement, cached"`

### Task 5: Debugging, emulation, downloads and config (D1 to D5)

**Files:**
- Modify: `js/data/report.js` (D1), `js/data/javascript.js` (D2), `js/data/action.js` (D3), `js/data/file.js` (D4), `js/data/config.js` (D5)
- Test: `tests/content/report.spec.js`, `tests/content/javascript.spec.js`, `tests/content/action.spec.js`, `tests/content/file.spec.js`, `tests/content/config.spec.js`

**Interfaces:** Produces D1 to D5 names from A2.

- [ ] **Step 1: Write the failing tests** for D1 to D5 (A4).
- [ ] **Step 2: Run** `npm run test:chromium -- tests/content/report.spec.js tests/content/javascript.spec.js tests/content/action.spec.js tests/content/file.spec.js tests/content/config.spec.js`. Expected: 5 new tests FAIL.
- [ ] **Step 3: Write the 5 entries.** D3's snippet bounds its scroll loop (for example `for (int i = 0; i < 20 && !atBottom(); i++)`). D4's desc ends `Added in Selenide 7.17.0.` (Javadoc `@since 7.17.0`; confirm against `CHANGELOG.md` at `v7.17.0` and report any conflict).
- [ ] **Step 4: Run** the same command, `npm run lint`, `npm run format:check`. Expected: pass.
- [ ] **Step 5: Commit** `git commit -m "Add debugging, emulation, download and config entries: logs, emulateDevice, atBottom, downloadFiles, browserBinary"`

### Task 6: Count fallback, deprecated-API guard, full verification

**Files:**
- Modify: `index.html:21` (`#cmd-count` fallback `279` to `304`)
- Test: `tests/data-integrity.spec.js` (one new test)

- [ ] **Step 1: Write the regression test** `'Javadoc gap fill entries avoid deprecated APIs'` in `tests/data-integrity.spec.js`. It reads `window.categories`, collects the entries whose `name` is in a hand-written list of the 25 A2 names, and asserts: `found.length` is `25`; no found `code` contains `clearBrowserCookies(`, `clearBrowserLocalStorage(` or `holdBrowserOpen` (`Selenide.java:1071,1085`, `Configuration.java:65-75`: all deprecated). The rendered badge is already compared with the data count by `meta-bar.spec.js:109`; the `index.html` fallback is not tested and is checked by the reviewer.
- [ ] **Step 2: Run** `npm run test:chromium -- tests/data-integrity.spec.js`. Expected: PASS once Tasks 1 to 5 are in (this test guards later edits rather than driving new code). To see it fail, temporarily misspell one name in the list: it FAILs with `found.length` 24. Restore the name.
- [ ] **Step 3: Update** `index.html:21` fallback to `304`.
- [ ] **Step 4: Run the full gates:** `npm test` (all three projects), `npm run lint`, `npm run format:check`, `npm run check:links -- --only=condition,wait,collection,action,navigation,selector,window,pattern,report,javascript,file,config` (`--only` takes `cls` values). Expected: all pass; the link checker reports every new anchor resolved.
- [ ] **Step 5: Search check by hand:** `npx serve -l 3000`, open `/#search=getText`, confirm G1 is shown. Search `exists`, confirm G5.
- [ ] **Step 6: Commit** `git add index.html tests/data-integrity.spec.js && git commit -m "Update command count to 304 and guard new entries against deprecated APIs"`
- [ ] **Step 7: Report** in the `quality-bar.md` "Report" format: 25 new entries, the A1 "Deliberately left out" table, any Conflicts (CHANGELOG vs Javadoc for D4), and "Wanted sources: none".
