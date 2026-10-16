# Mobile Guide Gap Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the selenide-appium knowledge from the guide "Mobile Test Automation with Selenide and Appium: Beginner to Expert" (2026-10-11) that the cheat sheet does not cover yet, as 10 verified entries (14 if decision D1 is approved). No UI changes.

**Architecture:** Content-only change. New items are appended to existing category modules in `js/data/`. Each one has a guard test in `tests/content/<cls>.spec.js`, written first. There are no new categories, so `style.css`, `js/data/index.js` and the `PALETTE` table stay untouched. The only non-data edits are the `#cmd-count` fallback in `index.html`, the `SHELL_PROGRAMS` set in `js/highlight.js` (only if D1 is approved), and two rule clarifications in `CLAUDE.md`.

**Tech Stack:** Vanilla ES modules, Playwright 1.64 tests, ESLint 9, Prettier 3. Content: Selenide 7.19.0, selenide-appium 7.19.0, Appium java-client 11.0.0.

**Spec:** Part A of this document (sections A1 to A6). The original project spec is `docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md`. Read `CLAUDE.md` and `.claude/skills/selenide-release-sync/references/quality-bar.md` before starting.

## Global Constraints

- Every API name, signature and default is confirmed in `.cache/sources/` (run `npm run fetch:sources` first if the folder is missing). The jar wins over the guide, the docs and memory.
- Sources policy (`CLAUDE.md`): only the jars, `github.com/selenide/*`, `github.com/selenide-examples/*`, `selenide.org` and Context7 `/selenide/selenide`. Do not use `appium.io`, `developer.android.com`, vendor docs or the guide's other links as fact sources unless decision D1 approves them.
- `docs` must be `https:` on `selenide.org`, or `github.com` with a path starting `/selenide/` or `/selenide-examples/`.
- No em-dash or en-dash characters anywhere in the data, including code comments.
- `name`: globally unique, no `<` or `>`.
- `code`: Java 17+, at least 20 characters, assumes the static imports of `Selenide`, `Condition` and `CollectionCondition`. Every other non-obvious import goes in the snippet.
- In a template literal: Java `\"` is written `\\"`, a backtick is written `` \` ``, and `${` never appears unescaped.
- Mobile entries: java-client classes appear only inside Selenide calls, a `WebDriverProvider`, or (after D2) a cast of `WebDriverRunner.getWebDriver()` to a java-client interface.
- Expected values in tests come from the jar or the approved source, cited in a comment with the file and the line. Never paste current output in as an expectation.
- Gates before each commit: `npm run test:chromium -- tests/content/<file>`. Before the final commit: `npm test`, `npm run lint`, `npm run format:check`, `npm run check:links -- --only="<touched categories>"`.

## Review Focus

1. **Java that does not compile.** The tests only check substrings and length. A reviewer must read every new snippet as Java: imports present, types match (for example `setNoReset` returns the options type, so chaining works), no two public top-level types in one snippet.
2. **Template-literal escaping.** The UiSelector strings (D1 entries) contain Java `\"`, and the iOS class chain contains backticks. If either is mis-escaped, the whole page breaks on load. Task 6 adds a test that pins the evaluated `code` string.
3. **Docs anchors that do not resolve.** The schema test checks only the host. `npm run check:links -- --only=...` must pass for every touched category (Task 7).
4. **Facts copied from the guide without jar confirmation.** The guide pins 7.17.0 and uses deprecated APIs. Each tip sentence must trace to a source line named in the task's "Facts" table. The tests pin the riskiest facts: the `ClassCastException`, `200 ms`, `8200..8299` and the deprecation.
5. **Mobile filter and search.** The new `platform: 'both'` entry in Patterns appears under 📱 Mobile. That is intended, and `cheatsheet.spec.js` already covers the filter rule. No new test is needed, but the reviewer confirms that the count badge equals the data count (`meta-bar.spec.js` covers this).

---

# Part A: Design

## A1. What the guide covers versus the cheat sheet

The cheat sheet already has 266 entries, 52 of them in the four mobile categories. It covers almost the whole public `selenide-appium` 7.19.0 API: `SelenideAppium.*`, `AppiumSelectors.*`, `CombinedBy`, `CombinedAttribute`, the gestures, the scroll and swipe options, context switching, deep links, the app lifecycle, the clipboard and the page factory. The guide's own cheat-sheet table (section 16) is fully covered.

The gaps are in four areas: how to configure the session, platform-native locators, driver features outside Selenide, and how text entry and failure evidence behave on a device.

| Guide section | Topic | Status in cheat sheet | Action |
|---|---|---|---|
| 2, 3 Prerequisites, OS setup | `npm install -g appium`, `appium driver install`, `emulator`, `adb devices` | Missing | **N8, N9**: gated on **D1** (no approved source documents them) |
| 6 Locator table | `AppiumBy.androidUIAutomator`, `iOSNsPredicateString`, `iOSClassChain` | Missing (only `iOSNsPredicate =` inside an annotation) | **N1, N2**: gated on **D1** (query syntax is Android or WDA documentation) |
| 7, 9 System dialogs | `setAutoGrantPermissions`, `setAutoAcceptAlerts` | Missing | **N5** |
| 9 Mobile web | Chrome or Safari through a provider, `open(url)` | Missing | **N3** |
| 9 Reaching the native driver | `getAndroidDriver().rotate(...)`, `runAppInBackground` | The guide's API is **deprecated for removal** in 7.19.0 | **N10** (needs **D2**) |
| 10 Parallel execution | `udid`, `systemPort`, `wdaLocalPort`, per-thread device | Missing | **N4** |
| 10 App state | `noReset`, `fullReset` | Missing | Folded into **N6** (`noReset` only) |
| 11 Reporting | XML page source and native element description on failure | One clause in the `Configuration.screenshots` tip | **N11** |
| 14 Cloud vendors | BrowserStack provider | Missing. selenide's own CI provider is an approved source | **N14** |
| 15 Flakiness | Animations off | Missing | **N7** |
| 15 Speed | `skipServerInstallation`, `skipDeviceInitialization`, `usePrebuiltWda` | Missing | **N6** |
| 15 Custom commands | `Commands.getInstance().add` with a custom interface | Missing. The guide's pattern fails at runtime (see A5) | **N13**: the supported `execute(Command)` |
| (jar only) | `setValue()` and `type()` on a native session | Missing, with a real trap: `setValue(SetValueOptions)` fails | **N12** |

## A2. New entries (summary)

| ID | Name (exact) | Category file | Level | Platform | Task |
|---|---|---|---|---|---|
| N5 | `Permissions and alerts (provider options)` | `appium-setup.js` | intermediate | mobile | 1 |
| N7 | `Animations off (provider options)` | `appium-setup.js` | intermediate | mobile | 1 |
| N6 | `Faster session start (provider options)` | `appium-setup.js` | advanced | mobile | 1 |
| N3 | `Mobile web (Chrome or Safari on a device)` | `appium-setup.js` | intermediate | mobile | 2 |
| N4 | `Parallel devices (one udid and port per thread)` | `appium-setup.js` | advanced | mobile | 2 |
| N14 | `Cloud devices (BrowserStack provider)` | `appium-setup.js` | advanced | mobile | 2 |
| N10 | `Device features without getAndroidDriver()` | `mobile-context.js` | advanced | mobile | 3 |
| N11 | `Failure evidence on mobile (XML page source)` | `mobile-context.js` | intermediate | mobile | 3 |
| N12 | `setValue() and type() (Appium)` | `mobile-gesture.js` | intermediate | mobile | 4 |
| N13 | `execute(Command) (custom command)` | `pattern.js` | advanced | both | 5 |
| N1 | `AppiumBy.androidUIAutomator()` | `mobile-selector.js` | intermediate | mobile | 6 (D1) |
| N2 | `AppiumBy.iOSNsPredicateString() and iOSClassChain()` | `mobile-selector.js` | intermediate | mobile | 6 (D1) |
| N8 | `Appium server and drivers (npm)` | `appium-setup.js` | beginner | mobile | 6 (D1) |
| N9 | `Android emulator and adb` | `appium-setup.js` | beginner | mobile | 6 (D1) |

Entry count: 266, plus 10, gives **276**. With D1 approved it is **280**.

Every mobile-only entry stays in a mobile-family category. N13 works on both platforms, so it goes in Patterns.

## A3. Decisions for the user (resolve before Task 6 and Task 3)

**Resolved 2026-10-16 by the user: D1 = Option A (approved), D2 = allow.** Run Task 6, and apply both `CLAUDE.md` edits in Task 7.

- **D1: Approve fact sources for Appium-side syntax and tooling?** No approved source documents `npm install -g appium`, `appium driver install`, `adb devices`, UiSelector syntax, NSPredicate syntax or class-chain syntax. The java-client javadoc only links out to Android and WDA docs. Option A: approve `appium.io/docs/en/latest/` (quickstart), `appium.github.io/appium-xcuitest-driver` and `developer.android.com/training/testing/ui-automator` as **fact** sources. The `docs` links still point at selenide hosts. Option B: skip Task 6. **Recommendation: A**, because the guide names Appium installation as the most common first-day failure. **Default if no answer: B (skip Task 6).**
- **D2: Allow a java-client interface cast outside a provider?** `CLAUDE.md` says java-client classes appear only inside Selenide calls or a `WebDriverProvider`. The 7.19.0 deprecation note on `AppiumDriverRunner.getAndroidDriver()` itself says "cast your WebDriver to the needed interface, e.g. SupportsRotation or HidesKeyboard". **Recommendation: allow it**, and add the exception to `CLAUDE.md` (Task 7). **Default if no answer: allow it.**

## A4. Out of scope (and why)

| Guide content | Reason |
|---|---|
| CI pipelines (GitHub Actions, Jenkins, Azure DevOps), KVM setup | Not Selenide API, and no approved docs host |
| Selenium Grid 4 relay, Docker Compose, Appium Device Farm plugin | Not Selenide API. The sources are SeleniumHQ and third-party repos |
| Sauce Labs, TestMu AI providers, vendor tunnels | No approved source. BrowserStack is included only because selenide's own tests use it |
| Screen recording, logcat, syslog attachments | java-client and Allure APIs outside any Selenide call |
| `AppiumDriverLocalService` (start Appium from code) | java-client outside a provider. The existing `MobileTestExtension` tip already mentions it |
| iOS real-device signing (`xcodeOrgId`, WDA bundle id), Appium Inspector, Xcode setup | Tooling. The facts live on unapproved sites |
| Retry analyzers, test strategy, device matrix, review checklist, teaching path | Process advice, not commands |
| Hybrid prerequisites (`setWebContentsDebuggingEnabled`, chromedriver autodownload) | Android or Appium facts on unapproved sites. Could join D1 later |
| UI changes (new filters, Android or iOS toggle) | Not needed: the 📱 Mobile filter already selects `mobile` and `both` |

## A5. Corrections to the guide itself (for the guide's author, not cheat-sheet work)

These came up while checking the guide against the 7.19.0 jars. Nothing in this plan depends on them.

1. The guide pins 7.17.0. The cheat sheet pins 7.19.0, which adds `inside()` for scroll and swipe and makes `setValue()` return `SelenideAppiumElement`.
2. `AppiumDriverRunner.getAndroidDriver()`, `getIosDriver()` and `getMobileDriver()` are `@Deprecated(forRemoval = true)` in 7.19.0 (`AppiumDriverRunner.java`). The guide uses them in deep links, rotation, recording and logcat. Cast `WebDriverRunner.getWebDriver()` to the interface instead (N10).
3. `AppiumSelectors.byText("Products")` builds `.//*[@text=...]`, an Android attribute. The guide's "runs on both platforms unchanged" login test would fail on iOS. Use `byName()` or `CombinedBy`.
4. The custom-command example casts the `$()` proxy to `AppElement`. The proxy implements only `SelenideAppiumElement`, so the cast throws `ClassCastException`. Use `$(...).execute(command)` (N13).
5. `Configuration.browserSize = null` before `launchApp()` is redundant, because `launchApp()` sets it. Before `open()` in a mobile-web session it is **required** (N3).
6. The hybrid section reaches for `driver.context(...)`. `SelenideAppium.switchTo().context(...)` exists in 7.19.0 and is logged as a step.

## A6. Entry writing rules recap

`desc` says what the entry does. `tip` gives the non-obvious part, and every clause in it must trace to the "Facts" table of its task. Put a new entry next to its closest relative, at the position each task gives. Use the existing entries' style: two-space indent, single quotes, trailing commas, code in backticks.

---

# Part B: Tasks

Branch first: `git checkout -b feature/mobile-guide-gap-fill` (the user is on `develop`).

### Task 1: Provider options for permissions, animations and start-up speed (N5, N7, N6)

**Files:**
- Modify: `js/data/appium-setup.js`: insert three items right after the item named `WebDriverProvider (iOS)` (ends near line 103), in the order N5, N7, N6
- Test: `tests/content/appium-setup.spec.js`: append three tests inside the existing `test.describe`

**Interfaces:**
- Consumes: `itemIn(page, cat, name)` from `tests/helpers/items.js`; `const CAT = 'Appium Setup'` is already declared in the spec.
- Produces: item names `Permissions and alerts (provider options)`, `Animations off (provider options)`, `Faster session start (provider options)`.

**Facts (verified 2026-10-16; re-run to confirm):**

| Claim | Source |
|---|---|
| `setAutoGrantPermissions(...)`: grants all requested permissions when the test starts, false by default | `java-client-11.0.0/io/appium/java_client/android/options/app/SupportsAutoGrantPermissionsOption.java` |
| `setAutoAcceptAlerts(...)`: accepts all iOS alerts, privacy access alerts included, default false | `.../ios/options/wda/SupportsAutoAcceptAlertsOption.java` |
| `setDisableWindowAnimation(...)`: disables window animations when instrumentation starts, false by default | `.../android/options/server/SupportsDisableWindowAnimationOption.java` |
| `setReduceMotion(...)`: Reduce Motion preference, reduces flakiness, simulators only | `.../ios/options/simulator/SupportsReduceMotionOption.java` |
| `setSkipServerInstallation(...)`: speeds start-up; a missing or wrong server version gives an unexpected error later | `.../android/options/server/SupportsSkipServerInstallationOption.java` |
| `setSkipDeviceInitialization(...)`: skips the ready and Settings-app checks, false by default | `.../android/options/server/SupportsSkipDeviceInitializationOption.java` |
| `setUsePrebuiltWda(...)`: skips building WDA, building becomes the user's job, defaults to false | `.../ios/options/wda/SupportsUsePrebuiltWdaOption.java` |
| `setNoReset(...)` is on `BaseOptions`, so it is available on both options classes | `.../remote/options/BaseOptions.java` implements `SupportsNoResetOption` |
| UiAutomator2Options implements the Android interfaces, XCUITestOptions the iOS ones | `implements` lists in `UiAutomator2Options.java:115`, `XCUITestOptions.java:129` |
| `tap()` reads the element centre once, then performs the touch sequence | `selenide-appium-7.19.0/.../commands/AppiumClick.java`: `getCenter(webElement)` then `perform(...)` |

- [ ] **Step 1: Re-verify the facts**

```bash
cd .cache/sources/java-client-11.0.0/io/appium/java_client
grep -rn "default T setAutoGrantPermissions\|default T setAutoAcceptAlerts\|default T setDisableWindowAnimation\|default T setReduceMotion\|default T setSkipServerInstallation\|default T setSkipDeviceInitialization\|default T setUsePrebuiltWda\|default T setNoReset" .
grep -c "SupportsAutoGrantPermissionsOption\|SupportsDisableWindowAnimationOption\|SupportsSkipServerInstallationOption\|SupportsSkipDeviceInitializationOption" android/options/UiAutomator2Options.java
grep -c "SupportsAutoAcceptAlertsOption\|SupportsReduceMotionOption\|SupportsUsePrebuiltWdaOption" ios/options/XCUITestOptions.java
```

Expected: eight `default T set...(` lines. The two counts are at least 4 and at least 3 (each interface appears in the import list and the `implements` list).

- [ ] **Step 2: Write the failing tests** (append inside the `test.describe` in `tests/content/appium-setup.spec.js`)

```js
  test('"Permissions and alerts (provider options)" uses the java-client 11 setters', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Permissions and alerts (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/app/SupportsAutoGrantPermissionsOption.java: default T setAutoGrantPermissions(
    expect(entry.code).toContain('.setAutoGrantPermissions(true)');
    // java-client 11.0.0 ios/options/wda/SupportsAutoAcceptAlertsOption.java: default T setAutoAcceptAlerts(
    expect(entry.code).toContain('.setAutoAcceptAlerts(true)');
    // options are built from the provider's capabilities, as in "WebDriverProvider (Android)"
    expect(entry.code).toContain('new UiAutomator2Options(capabilities)');
    expect(entry.code).toContain('new XCUITestOptions(capabilities)');
    // SupportsAutoAcceptAlertsOption javadoc: "This includes privacy access permission alerts ... Default is false."
    expect(entry.tip).toMatch(/privacy/);
    expect(entry.tip).toMatch(/false/);
  });

  test('"Animations off (provider options)" uses one option per platform', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Animations off (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/server/SupportsDisableWindowAnimationOption.java: default T setDisableWindowAnimation(
    expect(entry.code).toContain('.setDisableWindowAnimation(true)');
    // java-client 11.0.0 ios/options/simulator/SupportsReduceMotionOption.java: default T setReduceMotion(  ("Only on simulators.")
    expect(entry.code).toContain('.setReduceMotion(true)');
    expect(entry.tip).toMatch(/simulators? only/i);
  });

  test('"Faster session start (provider options)" names the trade-offs', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Faster session start (provider options)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 android/options/server/SupportsSkipServerInstallationOption.java: default T setSkipServerInstallation(
    expect(entry.code).toContain('.setSkipServerInstallation(true)');
    // java-client 11.0.0 android/options/server/SupportsSkipDeviceInitializationOption.java: default T setSkipDeviceInitialization(
    expect(entry.code).toContain('.setSkipDeviceInitialization(true)');
    // java-client 11.0.0 ios/options/wda/SupportsUsePrebuiltWdaOption.java: default T setUsePrebuiltWda(
    expect(entry.code).toContain('.setUsePrebuiltWda(true)');
    // java-client 11.0.0 remote/options/BaseOptions.java implements SupportsNoResetOption: default T setNoReset(
    expect(entry.code).toContain('.setNoReset(true)');
    // the misspelling used in some blogs does not exist in java-client 11.0.0
    expect(entry.code).not.toContain('setUsePrebuiltWDA');
  });
```

- [ ] **Step 3: Run them and watch them fail**

Run: `npm run test:chromium -- tests/content/appium-setup.spec.js`
Expected: the 3 new tests FAIL at `expect(entry).not.toBeNull()`, and the existing tests PASS.

- [ ] **Step 4: Add the three items** after the `WebDriverProvider (iOS)` item in `js/data/appium-setup.js`

```js
    {
      name: 'Permissions and alerts (provider options)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Keeps system dialogs from covering the app: setAutoGrantPermissions(true) on UiAutomator2Options grants every permission the Android app requests when the session starts, and setAutoAcceptAlerts(true) on XCUITestOptions accepts iOS alerts as they appear.',
      tip: 'Both are false by default. The iOS option accepts every alert, privacy prompts for location, contacts and photos included, so leave it off in the test that checks such a prompt and tap its button there. Both are java-client options: set them where the provider builds its options.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.options.XCUITestOptions;

// in AndroidDriverProvider.createDriver(capabilities)
UiAutomator2Options android = new UiAutomator2Options(capabilities)
  .setApp("build/apps/shop-debug.apk")
  .setAutoGrantPermissions(true); // no runtime permission dialogs

// in IosDriverProvider.createDriver(capabilities)
XCUITestOptions ios = new XCUITestOptions(capabilities)
  .setBundleId("com.example.shop")
  .setAutoAcceptAlerts(true); // accepts every alert, privacy prompts too`,
    },
    {
      name: 'Animations off (provider options)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Turns off motion that makes taps miss: setDisableWindowAnimation(true) on UiAutomator2Options and setReduceMotion(true) on XCUITestOptions.',
      tip: 'tap() reads the centre of the element once and touches those coordinates, so an element that is still sliding in can be missed even though shouldBe(visible) passed. The Android option disables window animations when the UiAutomator2 instrumentation starts (false by default). The iOS option switches on the Reduce Motion accessibility setting on simulators only: a real iPhone keeps animating.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.options.XCUITestOptions;

UiAutomator2Options android = new UiAutomator2Options(capabilities)
  .setApp("build/apps/shop-debug.apk")
  .setDisableWindowAnimation(true);

XCUITestOptions ios = new XCUITestOptions(capabilities)
  .setBundleId("com.example.shop")
  .setReduceMotion(true); // simulators only`,
    },
    {
      name: 'Faster session start (provider options)',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Cuts session start-up time by skipping work Appium otherwise repeats: setSkipServerInstallation(true) and setSkipDeviceInitialization(true) on Android, setUsePrebuiltWda(true) on iOS, and setNoReset(true) on both.',
      tip: 'Each one trades a safety check for speed. Skipping the server installation assumes the right UiAutomator2 server is already on the device: a missing or wrong version fails later with an unexpected error. usePrebuiltWda skips building WebDriverAgent, so building it becomes your job. noReset skips the app reset, so data and logins carry over between sessions and tests must clean up after themselves. Use them on devices you prepare, not on fresh emulators.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import io.appium.java_client.android.options.UiAutomator2Options;
import io.appium.java_client.ios.options.XCUITestOptions;

// Android: the UiAutomator2 server and Settings app are already on this device
UiAutomator2Options android = new UiAutomator2Options(capabilities)
  .setApp("build/apps/shop-debug.apk")
  .setSkipServerInstallation(true)
  .setSkipDeviceInitialization(true)
  .setNoReset(true);

// iOS: WebDriverAgent was built once, before the run
XCUITestOptions ios = new XCUITestOptions(capabilities)
  .setBundleId("com.example.shop")
  .setUsePrebuiltWda(true)
  .setNoReset(true);`,
    },
```

- [ ] **Step 5: Run the tests and confirm they pass**

Run: `npm run test:chromium -- tests/content/appium-setup.spec.js tests/data-integrity.spec.js tests/highlight.spec.js`
Expected: all PASS. The data-integrity spec checks the schema rules and dashes; the highlight round-trip covers the new code.

- [ ] **Step 6: Commit**

```bash
git add js/data/appium-setup.js tests/content/appium-setup.spec.js
git commit -m "Add provider option entries: permissions, animations, faster start"
```

---

### Task 2: Mobile web, parallel devices and BrowserStack providers (N3, N4, N14)

**Files:**
- Modify: `js/data/appium-setup.js`: put N3 right after `Faster session start (provider options)` (from Task 1), N4 right after `Switching platform with -Dselenide.browser`, and N14 right after N4
- Test: `tests/content/appium-setup.spec.js`: append three tests

**Interfaces:**
- Consumes: `CAT = 'Appium Setup'`, `itemIn`.
- Produces: names `Mobile web (Chrome or Safari on a device)`, `Parallel devices (one udid and port per thread)`, `Cloud devices (BrowserStack provider)`.

**Facts:**

| Claim | Source |
|---|---|
| `withBrowserName(String)` is on `BaseOptions` | `java-client-11.0.0/.../remote/options/SupportsBrowserNameOption.java:39`; `BaseOptions` implements it |
| Selenide resizes every driver it creates, provider-made ones included, when `browserSize != null` | `selenide-core-7.19.0/.../webdriver/WebDriverFactory.java`: `factory.setBrowserSize(config, webdriver);`. A provider class goes through `DefaultDriverFactory` (no override). `BrowserResizer.adjustBrowserSize`: `if (browserSize != null) ... setSize(dimension)`, no catch |
| Default `browserSize` is `"1366x768"` | Existing entry `Configuration.browserSize` (config.js). Confirm in `selenide-core-7.19.0/.../SelenideConfig.java` or `Configuration.java:124` |
| `launchApp()` sets `browserSize = null` | Existing `SelenideAppium.launchApp()` entry tip (`AppiumNavigator.launchApp`) |
| `setSystemPort(int)`: first free port from 8200..8299 for UIA2; set it for parallel tests on one machine | `.../android/options/server/SupportsSystemPortOption.java` |
| `setWdaLocalPort(int)`: forwards Mac host to real iOS devices over USB, default 8100 | `.../ios/options/wda/SupportsWdaLocalPortOption.java` |
| `setUdid(String)` | `.../remote/options/SupportsUdidOption.java` (both options classes implement it) |
| One driver per thread, created on first use in the calling thread | `selenide-core-7.19.0/.../impl/WebDriverThreadLocalContainer.java` (grep `ThreadLocal`, `getAndCheckWebDriver`) |
| `Configuration.*` fields are static | `selenide-7.19.0/.../Configuration.java` |
| BrowserStack hub `https://hub.browserstack.com/wd/hub`; `bstack:options` keys `userName`, `accessKey`, `projectName`, `buildName`; access key from a system property | `github.com/selenide/selenide/blob/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackUtils.java`, and `.../android/driverproviders/ci/AndroidDriverProvider.java`: `options.setCapability("bstack:options", getBrowserstackOptions());`, `setDeviceName("Google Pixel 8")`, `new AndroidDriver(browserstackUrl(), options)` |
| selenide's tests mark the session result with `executeJavaScript("browserstack_executor: ...")` | `.../it/mobile/BrowserstackExtension.java` at v7.19.0 |
| App reference format for `setApp()` on BrowserStack | **Confirm in Step 1** from `.../android/driverproviders/ci/AndroidDriverWithSwagLabs.java` (`getApplicationUnderTest()`) |

- [ ] **Step 1: Re-verify the facts, including the two GitHub ones**

```bash
cd .cache/sources
grep -n "setBrowserSize" selenide-core-7.19.0/com/codeborne/selenide/webdriver/WebDriverFactory.java
grep -n "setBrowserSize" selenide-core-7.19.0/com/codeborne/selenide/webdriver/AbstractDriverFactory.java selenide-core-7.19.0/com/codeborne/selenide/webdriver/DefaultDriverFactory.java
grep -rn "1366x768" selenide-core-7.19.0/com/codeborne/selenide/ selenide-7.19.0/com/codeborne/selenide/ | head -3
grep -n "ThreadLocal" selenide-core-7.19.0/com/codeborne/selenide/impl/WebDriverThreadLocalContainer.java | head -3
```

Expected: one `factory.setBrowserSize(config, webdriver);` line in WebDriverFactory, **no** match in AbstractDriverFactory or DefaultDriverFactory, at least one `1366x768`, and at least one `ThreadLocal`.

Then open these approved files in a browser or with WebFetch:
- `https://raw.githubusercontent.com/selenide/selenide/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackUtils.java`: confirm the hub URL and the four keys.
- `https://raw.githubusercontent.com/selenide/selenide/v7.19.0/modules/appium/src/test/java/it/mobile/android/driverproviders/ci/AndroidDriverWithSwagLabs.java`: note what `getApplicationUnderTest()` returns. If it is a `bs://` reference, keep the N14 comment as written. If it is something else, change the `setApp(...)` comment in N14 to match, and do not mention `bs://`.
- `https://raw.githubusercontent.com/selenide/selenide/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackExtension.java`: confirm the result is reported through `executeJavaScript` with a `browserstack_executor:` prefix. If it is not, delete the last sentence of the N14 tip.

- [ ] **Step 2: Write the failing tests**

```js
  test('"Mobile web (Chrome or Safari on a device)" clears browserSize before open()', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Mobile web (Chrome or Safari on a device)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 remote/options/SupportsBrowserNameOption.java:39: default T withBrowserName(String browserName)
    expect(entry.code).toContain('.withBrowserName("Chrome")');
    // selenide-core 7.19.0 WebDriverFactory.java: factory.setBrowserSize(config, webdriver);
    // BrowserResizer.java: if (browserSize != null) { ... driver.manage().window().setSize(dimension); }
    const cleared = entry.code.indexOf('Configuration.browserSize = null;');
    const opened = entry.code.indexOf('open("https://');
    expect(cleared).toBeGreaterThan(-1);
    expect(opened).toBeGreaterThan(cleared);
    expect(entry.tip).toContain('launchApp()');
    // a browser session has no app under test
    expect(entry.code).not.toMatch(/\.setApp\(|\.setAppPackage\(|\.setBundleId\(/);
  });

  test('"Parallel devices (one udid and port per thread)" sets udid and systemPort per thread', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Parallel devices (one udid and port per thread)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 remote/options/SupportsUdidOption.java: default T setUdid(String id)
    expect(entry.code).toContain('.setUdid(device.udid())');
    // java-client 11.0.0 android/options/server/SupportsSystemPortOption.java: default T setSystemPort(int port)
    expect(entry.code).toContain('.setSystemPort(device.systemPort())');
    expect(entry.code).toContain('ThreadLocal<Device>');
    // SupportsSystemPortOption javadoc: "the first free port from 8200..8299 range is selected for UIA2"
    expect(entry.tip).toContain('8200..8299');
    // SupportsWdaLocalPortOption javadoc: default 8100
    expect(entry.tip).toContain('setWdaLocalPort()');
    // selenide 7.19.0 Configuration.java: static fields, shared by every thread
    expect(entry.code).not.toContain('Configuration.browserCapabilities');
  });

  test('"Cloud devices (BrowserStack provider)" mirrors selenide\'s own CI provider', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Cloud devices (BrowserStack provider)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // selenide v7.19.0 modules/appium/src/test/java/it/mobile/BrowserstackUtils.java: "https://hub.browserstack.com/wd/hub"
    expect(entry.code).toContain('"https://hub.browserstack.com/wd/hub"');
    // it/mobile/android/driverproviders/ci/AndroidDriverProvider.java: options.setCapability("bstack:options", ...)
    expect(entry.code).toContain('options.setCapability("bstack:options", Map.of(');
    // BrowserstackUtils.java getBrowserstackOptions(): userName, accessKey, projectName, buildName
    for (const key of ['"userName"', '"accessKey"', '"projectName"', '"buildName"']) {
      expect(entry.code).toContain(key);
    }
    // BrowserstackUtils.java reads the key with System.getProperty: never a literal in source
    expect(entry.code).toMatch(/"accessKey", System\.getProperty\("[\w.]+"\)/);
    expect(entry.docs).toBe(
      'https://github.com/selenide/selenide/blob/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackUtils.java'
    );
  });
```

- [ ] **Step 3: Run and watch the 3 new tests fail**

Run: `npm run test:chromium -- tests/content/appium-setup.spec.js`
Expected: the 3 new tests FAIL at `not.toBeNull()`.

- [ ] **Step 4: Add the items**

N3, after `Faster session start (provider options)`:

```js
    {
      name: 'Mobile web (Chrome or Safari on a device)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Tests a website in the phone browser instead of a native app: the provider sets withBrowserName("Chrome") and no app, and the test calls open(url). From there it is ordinary Selenide with CSS selectors. For Safari, build XCUITestOptions with withBrowserName("Safari") and return an IOSDriver.',
      tip: 'Set Configuration.browserSize = null before the first open(). Selenide resizes the window of every driver it creates while browserSize is set (default "1366x768"), one returned by your provider included, and only launchApp() clears it. open() does not.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browserSize',
      code: `import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.WebDriverProvider;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.MalformedURLException;
import java.net.URI;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;

public class AndroidChromeProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    UiAutomator2Options options = new UiAutomator2Options(capabilities)
      .setDeviceName("Android Emulator")
      .withBrowserName("Chrome");
    try {
      return new AndroidDriver(URI.create("http://127.0.0.1:4723").toURL(), options);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException(e);
    }
  }
}

// in the test
Configuration.browser = AndroidChromeProvider.class.getName();
Configuration.browserSize = null; // a phone browser window cannot be resized
open("https://example.com/login");
$("#username").setValue("standard_user");
$("h1").shouldHave(text("Dashboard"));`,
    },
```

The code comment "a phone browser window cannot be resized" is a reasonable reading but not a jar fact. If the reviewer objects, change it to `// otherwise Selenide calls window().setSize() on the phone`, which is the jar fact.

N4, after `Switching platform with -Dselenide.browser`:

```js
    {
      name: 'Parallel devices (one udid and port per thread)',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Runs tests on several devices at once. Selenide keeps one driver per thread and calls the provider in the thread that first needs it, so the provider can look up the device that belongs to the current thread and set its udid and port.',
      tip: 'Every parallel Android session on one machine needs its own setSystemPort(): unset, UiAutomator2 takes the first free port from 8200..8299, and two sessions starting together can pick the same one. Each real iOS device needs its own setWdaLocalPort() (default 8100). Never share a device between threads. Configuration fields are static and shared by all threads, so per-device values cannot go in Configuration.browserCapabilities.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import com.codeborne.selenide.WebDriverProvider;
import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.MalformedURLException;
import java.net.URI;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;

record Device(String udid, int systemPort) {
  static final ThreadLocal<Device> CURRENT = new ThreadLocal<>();
}

public class ParallelAndroidProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    Device device = Device.CURRENT.get();
    UiAutomator2Options options = new UiAutomator2Options(capabilities)
      .setUdid(device.udid())
      .setSystemPort(device.systemPort())
      .setApp("build/apps/shop-debug.apk");
    try {
      return new AndroidDriver(URI.create("http://127.0.0.1:4723").toURL(), options);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException(e);
    }
  }
}

// in each test thread, before the first command (e.g. TestNG @Parameters in @BeforeMethod)
Device.CURRENT.set(new Device("emulator-5556", 8202));
SelenideAppium.launchApp();`,
    },
```

The tip clause "two sessions starting together can pick the same one" is an inference from the javadoc's "It is recommended to set this value if you are running parallel tests on the same machine". If the reviewer wants the literal fact only, replace the clause with ": the javadoc recommends setting it for parallel tests on one machine".

N14, right after N4:

```js
    {
      name: 'Cloud devices (BrowserStack provider)',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Runs the same tests on a BrowserStack device: the provider points AndroidDriver at the BrowserStack hub and adds a bstack:options capability with the credentials and build name. Screens and tests do not change.',
      tip: 'This follows the provider selenide-appium uses for its own CI tests, which reads the access key from a system property, never from source. Map.of() rejects null values, so a missing -Dbs.key fails fast with a NullPointerException instead of an unauthorised session. selenide\'s BrowserstackExtension also reports each test result to the BrowserStack dashboard through executeJavaScript, because BrowserStack cannot see the JUnit outcome.',
      docs: 'https://github.com/selenide/selenide/blob/v7.19.0/modules/appium/src/test/java/it/mobile/BrowserstackUtils.java',
      code: `import com.codeborne.selenide.WebDriverProvider;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.MalformedURLException;
import java.net.URI;
import java.util.Map;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;

public class BrowserStackAndroidProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    UiAutomator2Options options = new UiAutomator2Options(capabilities)
      .setDeviceName("Google Pixel 8")
      .setApp(System.getProperty("bs.app")); // bs:// id returned when the build was uploaded
    options.setCapability("bstack:options", Map.of(
      "userName", System.getProperty("bs.user"),
      "accessKey", System.getProperty("bs.key"),
      "projectName", "Shop app",
      "buildName", System.getProperty("bs.build", "local")));
    try {
      return new AndroidDriver(URI.create("https://hub.browserstack.com/wd/hub").toURL(), options);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException(e);
    }
  }
}

// mvn test -Dselenide.browser=com.example.BrowserStackAndroidProvider -Dbs.user=... -Dbs.key=... -Dbs.app=bs://...`,
    },
```

Adjust the `bs://` mentions to the Step 1 result. The `Map.of` null claim is Java SE behaviour, not Selenide, so it needs no further source.

- [ ] **Step 5: Run the tests**

Run: `npm run test:chromium -- tests/content/appium-setup.spec.js tests/data-integrity.spec.js tests/highlight.spec.js`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add js/data/appium-setup.js tests/content/appium-setup.spec.js
git commit -m "Add mobile web, parallel devices and BrowserStack provider entries"
```

---

### Task 3: Native driver features and failure evidence (N10, N11)

Run this task only after D2 is answered. The default is "allow".

**Files:**
- Modify: `js/data/mobile-context.js`: append N10 and then N11 after `AppiumDriverRunner.isAndroidDriver()` (the last item)
- Test: `tests/content/mobile-context.spec.js`: append two tests (the file declares `const CAT = 'Mobile Context & App'`)

**Interfaces:**
- Produces: names `Device features without getAndroidDriver()`, `Failure evidence on mobile (XML page source)`.

**Facts:**

| Claim | Source |
|---|---|
| `getAndroidDriver()`, `getIosDriver()`, `getMobileDriver()` are `@Deprecated(forRemoval = true)`; the javadoc says to cast to an interface such as `SupportsRotation` or `HidesKeyboard` | `selenide-appium-7.19.0/.../AppiumDriverRunner.java` lines 17 to 60 |
| `AndroidDriver` and `IOSDriver` both implement `SupportsRotation` and `InteractsWithApps` | `java-client-11.0.0/.../android/AndroidDriver.java`, `.../ios/IOSDriver.java` (`implements` lists) |
| `rotate(ScreenOrientation)`; `ScreenOrientation` is `org.openqa.selenium.ScreenOrientation` | `.../remote/SupportsRotation.java:22,56` |
| `runAppInBackground(Duration)` | `.../InteractsWithApps.java:89` |
| A native session saves the page source as `.xml` | `selenide-appium-7.19.0/.../AppiumScreenSourceExtractor.java`: `createFileWithExtension(config, fileName, "xml")` |
| Registered by ServiceLoader | `META-INF/services/com.codeborne.selenide.impl.PageSourceExtractor` and `...ElementDescriber` |
| The error description uses native attributes (`resource-id`, `content-desc`, ...) and falls back to the web describer | `.../AppiumElementDescriber.java`: `androidAttributes()`, `webVersion.fully(...)` |

- [ ] **Step 1: Re-verify**

```bash
cd .cache/sources
grep -n "Deprecated(forRemoval = true)\|cast your" selenide-appium-7.19.0/com/codeborne/selenide/appium/AppiumDriverRunner.java
grep -c "SupportsRotation\|InteractsWithApps" java-client-11.0.0/io/appium/java_client/android/AndroidDriver.java java-client-11.0.0/io/appium/java_client/ios/IOSDriver.java
cat selenide-appium-7.19.0/META-INF/services/com.codeborne.selenide.impl.PageSourceExtractor
grep -n '"xml"' selenide-appium-7.19.0/com/codeborne/selenide/appium/AppiumScreenSourceExtractor.java
```

Expected: 3 `forRemoval` lines plus 3 `cast your` lines, both counts at least 2, `com.codeborne.selenide.appium.AppiumScreenSourceExtractor`, and one `"xml"` line.

- [ ] **Step 2: Write the failing tests**

```js
  test('"Device features without getAndroidDriver()" casts to java-client interfaces', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'Device features without getAndroidDriver()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumDriverRunner.java: @Deprecated(forRemoval = true) getAndroidDriver/getIosDriver/getMobileDriver,
    // javadoc: "cast your WebDriver to the needed interface, e.g. SupportsRotation or HidesKeyboard"
    expect(entry.code).not.toMatch(/getAndroidDriver|getIosDriver|getMobileDriver/);
    expect(entry.code).toContain('((SupportsRotation) WebDriverRunner.getWebDriver())');
    // java-client 11.0.0 remote/SupportsRotation.java:56: default void rotate(ScreenOrientation orientation)
    expect(entry.code).toContain('.rotate(ScreenOrientation.LANDSCAPE)');
    expect(entry.code).toContain('import org.openqa.selenium.ScreenOrientation;');
    // java-client 11.0.0 InteractsWithApps.java:89: default void runAppInBackground(Duration duration)
    expect(entry.code).toMatch(/\.runAppInBackground\(Duration\.of\w+\(\d+\)\)/);
    // AndroidDriver and IOSDriver both implement SupportsRotation and InteractsWithApps: no platform branch
    expect(entry.code).not.toContain('isAndroidDriver()');
    expect(entry.tip).toContain('forRemoval');
  });

  test('"Failure evidence on mobile (XML page source)" needs no setup', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Failure evidence on mobile (XML page source)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumScreenSourceExtractor.java: createFileWithExtension(config, fileName, "xml")
    expect(entry.desc).toContain('.xml');
    // META-INF/services/com.codeborne.selenide.impl.PageSourceExtractor: AppiumScreenSourceExtractor
    expect(entry.tip).toContain('AppiumScreenSourceExtractor');
    expect(entry.code).not.toMatch(/new AppiumScreenSourceExtractor|new AppiumElementDescriber/);
    // selenide 7.19.0 Configuration.java: public static boolean savePageSource
    expect(entry.code).toContain('Configuration.savePageSource = true;');
    // AppiumElementDescriber.androidAttributes(): "resource-id", ..., "content-desc"
    expect(entry.tip).toMatch(/resource-id/);
  });
```

- [ ] **Step 3: Run and watch them fail**

Run: `npm run test:chromium -- tests/content/mobile-context.spec.js`
Expected: the 2 new tests FAIL.

- [ ] **Step 4: Append the items** after `AppiumDriverRunner.isAndroidDriver()`

```js
    {
      name: 'Device features without getAndroidDriver()',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Reaches Appium features that Selenide does not wrap, such as rotating the screen or sending the app to the background, by casting the current driver to the java-client interface that declares them.',
      tip: 'getAndroidDriver(), getIosDriver() and getMobileDriver() are @Deprecated(forRemoval = true) in 7.19.0, and their Javadoc asks for this cast instead. AndroidDriver and IOSDriver implement the same interfaces (SupportsRotation, InteractsWithApps, HidesKeyboard), so one line serves both platforms. For the keyboard, the element method hideKeyboard() is simpler.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumDriverRunner.html#getAndroidDriver()',
      code: `import com.codeborne.selenide.WebDriverRunner;
import io.appium.java_client.AppiumBy;
import io.appium.java_client.InteractsWithApps;
import io.appium.java_client.remote.SupportsRotation;
import java.time.Duration;
import org.openqa.selenium.ScreenOrientation;

((SupportsRotation) WebDriverRunner.getWebDriver()).rotate(ScreenOrientation.LANDSCAPE);
$(AppiumBy.accessibilityId("Video player")).shouldBe(visible);

// background the app for 3 seconds; Appium brings it back afterwards
((InteractsWithApps) WebDriverRunner.getWebDriver()).runAppInBackground(Duration.ofSeconds(3));
$(AppiumBy.accessibilityId("Cart badge")).shouldHave(text("1"));`,
    },
    {
      name: 'Failure evidence on mobile (XML page source)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'With selenide-appium on the classpath, a failing check in a native session saves the screen hierarchy as an .xml file next to the screenshot, and the error message describes the element with its native attributes.',
      tip: 'Both come from ServiceLoader registrations in the selenide-appium jar (AppiumScreenSourceExtractor and AppiumElementDescriber), so there is nothing to configure: savePageSource and reportsFolder work as on the web. Open the .xml to find attributes a locator can use, such as resource-id and content-desc on Android. In a browser session the same classes fall back to .html and the web description.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumScreenSourceExtractor.html',
      code: `import com.codeborne.selenide.Configuration;
import io.appium.java_client.AppiumBy;

Configuration.screenshots = true;     // default
Configuration.savePageSource = true;  // default; .xml for a native session
Configuration.reportsFolder = "target/selenide-reports";

$(AppiumBy.accessibilityId("Order total")).shouldHave(text("29.99"));
// on failure: a .png and an .xml in target/selenide-reports, linked from the error`,
    },
```

Before committing, confirm the last code comment: the error message lists the screenshot and the page source paths, which you can see in the `AppiumElementDescriber` class javadoc sample ("Screenshot: file:... Page source: file:..."). If that sample does not show both, remove ", linked from the error".

- [ ] **Step 5: Run the tests**

Run: `npm run test:chromium -- tests/content/mobile-context.spec.js tests/data-integrity.spec.js tests/highlight.spec.js`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add js/data/mobile-context.js tests/content/mobile-context.spec.js
git commit -m "Add driver-interface casts and mobile failure evidence entries"
```

---

### Task 4: Text entry on a native session (N12)

**Files:**
- Modify: `js/data/mobile-gesture.js`: insert after `hideKeyboard()`
- Test: `tests/content/mobile-gesture.spec.js`: append one test. This file has no `CAT` const, so use the literal `'Mobile Gestures'` as the existing tests do.

**Facts:**

| Claim | Source |
|---|---|
| Mobile `setValue`: finds an interactable element, `clear()` then `sendKeys(text)`, casting `args[0]` to `CharSequence` | `selenide-appium-7.19.0/.../commands/AppiumSetValue.java` |
| So `setValue(SetValueOptions)` throws `ClassCastException` on a native session (`SetValueOptions` is a record, not a `CharSequence`) | Same file, plus `selenide-core-7.19.0/.../SetValueOptions.java` (`public record SetValueOptions(`) |
| Mobile `type`: on Android, `element.click()` then `Actions.sendKeys(char)` for each character; elsewhere `sendKeys(char)`; sleeps `timeDelayWhileTyping` between characters | `.../commands/AppiumType.java` |
| Default delay 200 ms, `clearFirst` true by default, `sensitive()` masks the displayed text | `selenide-core-7.19.0/.../TypeOptions.java` |
| `SelenideAppiumElement type(TypeOptions options)` | `selenide-appium-7.19.0/.../SelenideAppiumElement.java:200` |

- [ ] **Step 1: Re-verify**

```bash
cd .cache/sources
grep -n "(CharSequence) requireNonNull(args)\[0\]" selenide-appium-7.19.0/com/codeborne/selenide/appium/commands/AppiumSetValue.java
grep -n "isAndroidDriver\|element.click()\|sleepAtLeast" selenide-appium-7.19.0/com/codeborne/selenide/appium/commands/AppiumType.java
grep -n "DEFAULT_DELAY_WHILE_TYPING = \|DEFAULT_DELAY_WHILE_TYPING, true" selenide-core-7.19.0/com/codeborne/selenide/TypeOptions.java
grep -n "public record SetValueOptions" selenide-core-7.19.0/com/codeborne/selenide/SetValueOptions.java
```

Expected: one match each for the cast, `isAndroidDriver`, `element.click()`, `sleepAtLeast`, `Duration.ofMillis(200)`, `DEFAULT_DELAY_WHILE_TYPING, true` and the record.

- [ ] **Step 2: Write the failing test**

```js
  test('"setValue() and type() (Appium)" warns that SetValueOptions fails on mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Mobile Gestures', 'setValue() and type() (Appium)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppiumElement.java:200: SelenideAppiumElement type(TypeOptions options);
    // selenide-core 7.19.0 TypeOptions.java: public static TypeOptions text(CharSequence) / public TypeOptions sensitive()
    expect(entry.code).toContain('.type(TypeOptions.text("secret_sauce").sensitive())');
    // AppiumSetValue.java: CharSequence text = (CharSequence) requireNonNull(args)[0];
    expect(entry.tip).toContain('ClassCastException');
    expect(entry.code).not.toMatch(/setValue\((SetValueOptions\.)?withText\(/);
    // TypeOptions.java: DEFAULT_DELAY_WHILE_TYPING = Duration.ofMillis(200)
    expect(entry.desc).toContain('200 ms');
    // AppiumType.java: if (AppiumDriverRunner.isAndroidDriver()) { element.click(); actions.sendKeys(character).perform(); }
    expect(entry.tip).toMatch(/Android/);
    expect(entry.code).toContain('import static com.codeborne.selenide.appium.SelenideAppium.$;');
  });
```

- [ ] **Step 3: Run and watch it fail**

Run: `npm run test:chromium -- tests/content/mobile-gesture.spec.js`
Expected: the new test FAILS. The existing "no PointerInput" loop at the end of the file still PASSES.

- [ ] **Step 4: Insert the item** after `hideKeyboard()`

```js
    {
      name: 'setValue() and type() (Appium)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'How text entry works in a native session: setValue(text) clears the field and sends the whole text at once, while type(text) clears it and types one character at a time with a 200 ms pause between characters.',
      tip: 'On a mobile driver, setValue() accepts only plain text. setValue(SetValueOptions), such as withText(...).sensitive(), fails with ClassCastException because the Appium command casts its argument to CharSequence. To keep a password out of the report, use type(TypeOptions.text(...).sensitive()). On Android, type() taps the field before every character, so each keystroke goes to that field. clearFirst(false) keeps the existing text.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#type(com.codeborne.selenide.TypeOptions)',
      code: `import com.codeborne.selenide.TypeOptions;
import io.appium.java_client.AppiumBy;
import java.time.Duration;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("username")).setValue("standard_user");
$(AppiumBy.accessibilityId("password")).type(TypeOptions.text("secret_sauce").sensitive());

// slow autocomplete: longer pauses, keep what is already typed
$(AppiumBy.accessibilityId("search"))
  .type(TypeOptions.text("Back").withDelay(Duration.ofMillis(400)).clearFirst(false));
$(AppiumBy.accessibilityId("Sauce Labs Backpack")).shouldBe(visible);`,
    },
```

- [ ] **Step 5: Run the tests**

Run: `npm run test:chromium -- tests/content/mobile-gesture.spec.js tests/data-integrity.spec.js tests/highlight.spec.js`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add js/data/mobile-gesture.js tests/content/mobile-gesture.spec.js
git commit -m "Add setValue() and type() behaviour on native sessions"
```

---

### Task 5: Custom element commands (N13)

**Files:**
- Modify: `js/data/pattern.js`: insert after `Condition library (static factories)`
- Test: `tests/content/pattern.spec.js`: append one test (it uses the literal `'Patterns'`)

**Facts:**

| Claim | Source |
|---|---|
| `<ReturnType> ReturnType execute(Command<ReturnType> command)`, `execute(Command, Duration)`, `<ReturnType extends SelenideElement> ReturnType execute(FluentCommand command)` | `selenide-core-7.19.0/.../SelenideElement.java:1431,1434,1449` |
| The command receives no arguments ("this command will not receive any arguments") | Same javadoc, and `commands/Execute.java`: `command.execute(proxy, locator, NO_ARGS)` |
| `FluentCommand`: override `protected abstract void execute(WebElementSource locator, Object @Nullable [] args)`; the 3-argument form is `@Deprecated` and returns the proxy | `selenide-core-7.19.0/.../FluentCommand.java` |
| `WebElementSource.findAndAssertElementIsInteractable()` exists | Used in `selenide-appium-7.19.0/.../commands/AppiumSetValue.java` |
| `Commands.getInstance().add(String, Command<?>)` exists but adds no typed method | `selenide-core-7.19.0/.../commands/Commands.java:18,154` |

- [ ] **Step 1: Re-verify**

```bash
cd .cache/sources/selenide-core-7.19.0/com/codeborne/selenide
grep -n "execute(Command<ReturnType> command\|execute(FluentCommand command" SelenideElement.java
grep -n "protected abstract void execute\|@Deprecated" FluentCommand.java
grep -n "WebElement findAndAssertElementIsInteractable" impl/WebElementSource.java
```

Expected: three `execute(` signatures, the abstract method and `@Deprecated`, and one `findAndAssertElementIsInteractable` declaration.

- [ ] **Step 2: Write the failing test**

```js
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
```

- [ ] **Step 3: Run and watch it fail**

Run: `npm run test:chromium -- tests/content/pattern.spec.js`
Expected: the new test FAILS.

- [ ] **Step 4: Insert the item** after `Condition library (static factories)`

```js
    {
      name: 'execute(Command) (custom command)',
      level: 'advanced',
      platform: 'both',
      desc: 'Packs a reusable element action into a class: extend FluentCommand (or implement Command<T> to return a value) and run it with $(...).execute(command). A FluentCommand returns the element, so the chain continues.',
      tip: 'execute() passes the command no arguments, so give it its data through a constructor or a static factory. Override the two-argument execute(WebElementSource, args): the three-argument one is deprecated. execute(command, Duration) runs it with its own timeout. Registering a name with Commands.getInstance().add() does not add a method to SelenideElement or SelenideAppiumElement, so prefer execute(). The same command works on web and mobile elements.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#execute(com.codeborne.selenide.FluentCommand)',
      code: `import com.codeborne.selenide.FluentCommand;
import com.codeborne.selenide.impl.WebElementSource;
import org.jspecify.annotations.Nullable;
import org.openqa.selenium.WebElement;

public class ReplaceText extends FluentCommand {
  private final String text;

  private ReplaceText(String text) {
    this.text = text;
  }

  public static ReplaceText replaceText(String text) {
    return new ReplaceText(text);
  }

  @Override
  protected void execute(WebElementSource locator, Object @Nullable [] args) {
    WebElement field = locator.findAndAssertElementIsInteractable();
    field.clear();
    field.sendKeys(text);
  }
}

// import static com.example.ReplaceText.replaceText;
$("#search").execute(replaceText("selenide")).pressEnter();`,
    },
```

Check: the `docs` anchor must match the javadoc's spelling. Task 7 runs `check:links`. If `#execute(com.codeborne.selenide.FluentCommand)` does not resolve, use `#execute(com.codeborne.selenide.Command)`. Confirm that `pressEnter()` returns `SelenideElement` (`grep -n "pressEnter()" SelenideElement.java`). The chain compiles because `execute(FluentCommand)` returns a `SelenideElement` subtype.

- [ ] **Step 5: Run the tests**

Run: `npm run test:chromium -- tests/content/pattern.spec.js tests/data-integrity.spec.js tests/highlight.spec.js`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add js/data/pattern.js tests/content/pattern.spec.js
git commit -m "Add execute(Command) custom command entry"
```

---

### Task 6 (gated on D1): Platform-native locators and device tooling (N1, N2, N8, N9)

**Skip this whole task unless the user approved D1.** If D1 is approved, first record the approved fact sources in `CLAUDE.md` under "Sources policy", in a new row: role "Appium-side syntax and tooling facts (not `docs` targets)".

**Files:**
- Modify: `js/data/mobile-selector.js`: insert N1 and then N2 after `$(AppiumBy.accessibilityId())`
- Modify: `js/data/appium-setup.js`: insert N8 and then N9 at the top of the items, before `selenide-appium dependency (Maven)`, because they are the first steps of a setup
- Modify: `js/highlight.js:144-153`: add `'appium'`, `'adb'`, `'xcrun'` to `SHELL_PROGRAMS`
- Test: `tests/content/mobile-selector.spec.js`, `tests/content/appium-setup.spec.js`, `tests/highlight.spec.js`

**Facts:**

| Claim | Source |
|---|---|
| `AppiumBy.androidUIAutomator(String)`, `iOSNsPredicateString(String)`, `iOSClassChain(String)` | `java-client-11.0.0/.../AppiumBy.java:105,212,202` |
| class chain and predicate are "available in XCUITest Driver mode" | Same javadoc |
| UiSelector syntax `new UiSelector().text("...")`, `textContains("...")` | D1 source: developer.android.com UI Automator |
| Predicate `label == '...'`, `CONTAINS`; class chain ``**/XCUIElementTypeCell[`label BEGINSWITH '...'`]`` | D1 source: appium-xcuitest-driver docs |
| `npm install -g appium`, `appium driver install uiautomator2`, `appium driver install xcuitest`, `appium driver list --installed`; default port 4723 | D1 source: appium.io quickstart |
| `emulator -avd <name>` | `github.com/selenide-examples/selenide-appium` README, "How to run the example" (approved) |
| `emulator -list-avds`, `adb devices` | D1 source |

- [ ] **Step 1: Confirm each D1 fact against the approved page and note the URL in the test comments.** If a fact is not on the page, drop it from the snippet.

- [ ] **Step 2: Write the failing tests**

In `tests/content/mobile-selector.spec.js` (it uses `CAT = 'Mobile Selectors'`):

```js
  test('"AppiumBy.androidUIAutomator()" escapes the inner quotes correctly', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'AppiumBy.androidUIAutomator()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 AppiumBy.java:105: public static By androidUIAutomator(final String uiautomatorText)
    // the evaluated code must hold Java \" escapes (written \\\\" in the data file's template literal)
    expect(entry.code).toContain('AppiumBy.androidUIAutomator("new UiSelector().text(\\"Log in\\")")');
  });

  test('"AppiumBy.iOSNsPredicateString() and iOSClassChain()" keeps the class-chain backticks', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumBy.iOSNsPredicateString() and iOSClassChain()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // java-client 11.0.0 AppiumBy.java:212: public static By iOSNsPredicateString(final String iOSNsPredicateString)
    expect(entry.code).toContain('AppiumBy.iOSNsPredicateString("label == \'Log in\'")');
    // java-client 11.0.0 AppiumBy.java:202: public static By iOSClassChain(final String iOSClassChainString)
    // the backticks must survive the template literal (written \` in the data file)
    expect(entry.code).toContain(
      'AppiumBy.iOSClassChain("**/XCUIElementTypeCell[`label BEGINSWITH \'Order\'`]")'
    );
  });
```

Read the escaping in the first test carefully. In this test file the JS string literal `'...text(\\"Log in\\")...'` evaluates to `...text(\"Log in\")...`, which is the Java source. In the data file's template literal you therefore write `\\"`, and the template literal turns that into `\"`.

In `tests/content/appium-setup.spec.js`:

```js
  test('"Appium server and drivers (npm)" installs both platform drivers', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Appium server and drivers (npm)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // <D1 source URL>: npm install -g appium; appium driver install uiautomator2 | xcuitest
    expect(entry.code.trim().startsWith('npm install -g appium')).toBe(true);
    expect(entry.code).toContain('appium driver install uiautomator2');
    expect(entry.code).toContain('appium driver install xcuitest');
    expect(entry.code).not.toMatch(/^sudo /m);
  });

  test('"Android emulator and adb" starts an AVD by name', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'Android emulator and adb');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('mobile');
    // selenide-examples/selenide-appium README, "How to run the example": emulator -avd Pixel_4_API_28_1
    expect(entry.code).toMatch(/^emulator -avd \w+/m);
    // <D1 source URL>: adb devices
    expect(entry.code).toContain('adb devices');
  });
```

In `tests/highlight.spec.js`, inside `test.describe('highlightShell()'` (or the shell describe that exists: find it with `grep -n "describe(" tests/highlight.spec.js`):

```js
  test('appium, adb and xcrun are programs', async ({ page }) => {
    expect(await shell(page, 'adb devices')).toBe('<span class="tok-api">adb</span> devices');
    expect(await shell(page, 'appium driver list')).toBe(
      '<span class="tok-api">appium</span> driver list'
    );
    expect(await shell(page, 'xcrun simctl list')).toBe(
      '<span class="tok-api">xcrun</span> simctl list'
    );
  });
```

and inside the Java describe:

```js
  test('backticks inside a Java string stay in the string (iOS class chain)', async ({ page }) => {
    expect(await java(page, 'By b = AppiumBy.iOSClassChain("**/X[`a`]");')).toBe(
      'By b = <span class="tok-api">AppiumBy</span>.<span class="tok-fn">iOSClassChain</span>(' +
        '<span class="tok-string">"**/X[`a`]"</span>);'
    );
  });
```

These expectations come from the token rules in `CLAUDE.md`: `AppiumBy` is in `APIS`, an identifier before `(` is `tok-fn`, a `"..."` string is `tok-string`, and `By` and `b` are plain. The backtick test may PASS straight away, because no highlighter change is needed. It is a guard; note that in the commit.

- [ ] **Step 3: Run and watch the content and shell-program tests fail**

Run: `npm run test:chromium -- tests/content/mobile-selector.spec.js tests/content/appium-setup.spec.js tests/highlight.spec.js`
Expected: the 4 content tests and `appium, adb and xcrun are programs` FAIL.

- [ ] **Step 4: Implement**

`js/highlight.js`, the `SHELL_PROGRAMS` set:

```js
const SHELL_PROGRAMS = new Set([
  'mvn',
  'gradle',
  'gradlew',
  'java',
  'emulator',
  'npm',
  'npx',
  'git',
  'appium',
  'adb',
  'xcrun',
]);
```

`SHELL_START` needs no change. N8 starts with `npm ` and N9 with `emulator `, so `pickHighlighter` already routes both to the shell highlighter.

`js/data/mobile-selector.js`, after `$(AppiumBy.accessibilityId())`:

```js
    {
      name: 'AppiumBy.androidUIAutomator()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds Android elements with a UiSelector expression, which UiAutomator evaluates on the device instead of an XPath over the page source.',
      tip: 'The expression is Java-like text inside a Java string, so its quotes are escaped as \\" in your test code. It is Android only: pair it with an iOS locator in CombinedBy.android(...).ios(...) when the same screen exists on both platforms.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/selector/CombinedBy.html#android(org.openqa.selenium.By)',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.androidUIAutomator("new UiSelector().text(\\"Log in\\")")).tap();
$(AppiumBy.androidUIAutomator("new UiSelector().textContains(\\"Add\\")")).shouldBe(visible);`,
    },
    {
      name: 'AppiumBy.iOSNsPredicateString() and iOSClassChain()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'The two native iOS locator strategies of the XCUITest driver: an NSPredicate over element attributes, and a class chain that walks the element tree by type.',
      tip: 'Both work only with the XCUITest driver. A class chain puts its predicates between backticks inside the Java string. In CombinedBy, the iOS side is often one of these and the Android side a UiAutomator or id locator.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/selector/CombinedBy.html#ios(org.openqa.selenium.By)',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.iOSNsPredicateString("label == 'Log in'")).tap();
$(AppiumBy.iOSNsPredicateString("label CONTAINS 'Welcome'")).shouldBe(visible);
$(AppiumBy.iOSClassChain("**/XCUIElementTypeCell[\`label BEGINSWITH 'Order'\`]")).tap();`,
    },
```

Note on the N1 `tip`: inside a single-quoted JS string, `\\"` evaluates to `\"`, which is what the reader should see. Confirm that the `CombinedBy.html#ios(org.openqa.selenium.By)` anchor exists. `ios()` is an instance method, so javadoc still gives it an anchor, and `check:links` verifies it.

`js/data/appium-setup.js`, first two items:

```js
    {
      name: 'Appium server and drivers (npm)',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Installs the Appium server with npm and one driver per platform, then starts it. Selenide talks to this server through the URL in your WebDriverProvider.',
      tip: 'Install without sudo: if npm asks for it, fix the Node installation instead. If the shell then reports "appium: command not found", npm\'s global folder (npm config get prefix) is not on PATH. The xcuitest driver needs macOS with Xcode.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#initiating-android--ios-driver-session',
      code: `npm install -g appium
appium driver install uiautomator2
appium driver install xcuitest   # macOS only
appium driver list --installed
appium                           # listens on http://127.0.0.1:4723`,
    },
    {
      name: 'Android emulator and adb',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Starts an Android virtual device from the command line and checks that adb sees it before the tests run.',
      tip: 'adb devices must list the emulator as "device"; "offline" or an empty list means the session will not start. The AVD name comes from emulator -list-avds or from the Android Studio Device Manager.',
      docs: 'https://github.com/selenide-examples/selenide-appium#how-to-run-the-example',
      code: `emulator -list-avds
emulator -avd Pixel_4_API_28_1
adb devices   # emulator-5554  device`,
    },
```

Confirm each line of these two snippets and tips against the D1 page. Remove any line the page does not support.

- [ ] **Step 5: Run the tests**

Run: `npm run test:chromium -- tests/content/mobile-selector.spec.js tests/content/appium-setup.spec.js tests/highlight.spec.js tests/data-integrity.spec.js`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add js/data/mobile-selector.js js/data/appium-setup.js js/highlight.js tests/content/mobile-selector.spec.js tests/content/appium-setup.spec.js tests/highlight.spec.js CLAUDE.md
git commit -m "Add platform-native locators and Appium tooling entries (approved D1 sources)"
```

---

### Task 7: Count fallback, CLAUDE.md rules, full verification

**Files:**
- Modify: `index.html:21`: the `#cmd-count` fallback `266`
- Modify: `CLAUDE.md`: "Java inside a template literal" and "Snippet conventions"

- [ ] **Step 1: Compute the real count from the data (do not hand-add)**

```bash
node --input-type=module -e "import('./js/data/index.js').then(m => console.log(m.categories.reduce((s, c) => s + c.items.length, 0)))"
```

Expected: `276` without Task 6, `280` with it. If the number differs, find the entry that was missed or duplicated before continuing.

- [ ] **Step 2: Update the fallback** in `index.html` line 21: replace `>266<` with the number from Step 1.

- [ ] **Step 3: Update CLAUDE.md**

In "Java inside a template literal", replace the bullet `- Backticks never appear in Java, so no escaping is needed there.` with:

```markdown
- Backticks appear in Java only inside iOS class-chain strings
  (`` AppiumBy.iOSClassChain("**/X[`label == 'a'`]") ``). Write each one as `` \` `` in the
  template literal.
```

(Only if Task 6 ran. Otherwise leave the bullet as it is.)

In "Snippet conventions", replace the last bullet with:

```markdown
- Mobile entries use selenide-appium's own API only. `AppiumBy` and other java-client
  classes appear only inside Selenide calls, a `WebDriverProvider`, or a cast of
  `WebDriverRunner.getWebDriver()` to a java-client interface (the replacement that
  `AppiumDriverRunner.getAndroidDriver()`'s 7.19.0 deprecation note prescribes).
```

(Only if D2 was allowed.)

- [ ] **Step 4: Full gates**

```bash
npm test
npm run lint
npm run format:check
npm run check:links -- --only="Appium Setup,Mobile Context & App,Mobile Gestures,Patterns"
npm run check:links -- --only="Mobile Selectors"   # only if Task 6 ran
```

Expected: every Playwright project passes (chromium, iPhone 16, Pixel 7); lint and format are clean; `check:links` reports 0 broken URLs or anchors. If an anchor fails, fix the `docs` URL to the javadoc's real anchor; do not delete the entry. If format fails, run `npm run format` and re-run the check.

- [ ] **Step 5: Spot-check in the browser**

```bash
npx serve -l 3000 .
```

Open `http://localhost:3000/#filter=mobile&search=provider%20options`. The three Task 1 entries appear. Open each new entry's modal and check that the code is highlighted and that Copy returns the exact snippet. Then open `#filter=Patterns` and confirm `execute(Command) (custom command)` is there.

- [ ] **Step 6: Commit**

```bash
git add index.html CLAUDE.md
git commit -m "Update command count fallback and snippet rules for new mobile entries"
```

- [ ] **Step 7: Report**

Use the report format in `.claude/skills/selenide-release-sync/references/quality-bar.md`: entries added (name, category, level), sources consulted, any fact dropped or reworded during verification and why, and the D1 and D2 outcomes. Do not merge. Hand the branch back for review.
