# Selenide + selenide-appium Commands Cheat Sheet: Design

- **Date:** 2026-10-13
- **Status:** Approved in brainstorming, pending written-spec review
- **Brief:** [`docs/kickoff.md`](../../kickoff.md). This spec records the decisions taken on top
  of it. Where the two differ, this spec wins.

## 1. Goal

An interactive, static, single-page cheat sheet for **Selenide 7.19.0** (Java web UI testing)
and **selenide-appium 7.19.0** (mobile testing through Selenide's own API), adapted from the
`playwright-commands-cheat-sheet` engine, which this repo starts as a copy of.

The engine (render, flat/grouped views, search, filters, modal, URL hash state, meta bar,
analytics, tests, CI, release-sync skill) is **adapted, not rebuilt**. The content, the
language-specific highlighter, the version source and the release-sync tooling change.

**Success looks like:**

- 200 to 260 entries, every one verified against what 7.19.0 shipped, every `docs` link and
  anchor resolving.
- A reader can tell the web half from the mobile half at a glance, and a `📱 Mobile` filter
  isolates the mobile half.
- `npm test`, `npm run lint`, `npm run format:check` and `npm run check:links` all pass.
- A fortnightly CI job detects a new Selenide release or a broken link and opens a draft PR
  through the `selenide-release-sync` skill, never merging.

## 2. Decisions

| Topic | Decision |
|---|---|
| Repo / Pages URL | `selenide-commands-cheat-sheet`, `https://youvegotnigel.github.io/selenide-commands-cheat-sheet/` |
| Snippet language | Java 17+ only for v1. Gradle Kotlin DSL is allowed in build snippets |
| Supabase | Reuse the existing project with `selenide_`-prefixed tables, RPCs and functions |
| `platform` | `web` \| `mobile` \| `both`. Android/iOS differences go in the `tip` |
| Sync cadence | Fortnightly: cron `0 6 1,15 * *` (06:00 UTC on the 1st and 15th) |
| `javac` snippet check | Deferred to a follow-up |
| Git | Baseline commit `4a25ee9` on `master` (untouched copy). All work on `develop`. Nothing is pushed without being asked |
| Mobile scope | **selenide-appium's own API only.** No raw Appium, Appium CLI, Appium Inspector, `adb` or `xcrun simctl` entries. The "Appium CLI & Tools" category from the brief is dropped |
| `AppiumBy` | Allowed **only inside Selenide calls** (`$(AppiumBy.accessibilityId("Login"))`, `CombinedBy`), never as a standalone entry. Same for other java-client classes (`UiAutomator2Options`, `AndroidDriver`), which appear only inside a `WebDriverProvider` |
| Verification order | Tooling (`fetch-sources.mjs`, `check-docs-links.mjs`) is built in phase 4b, **before** content |

## 3. Sources policy

The user approved these sources and no others. Any other online resource must be named to
the user and approved **before** it is used for content or a `docs` link.

| Source | Role |
|---|---|
| Context7 `/selenide/selenide` (official GitHub repo) | Discovery: what exists, intended usage, examples |
| `selenide.org` (docs pages and `javadoc/current/`) | Discovery, and the primary `docs` link target |
| `github.com/selenide/*` (incl. `selenide/selenide` at tag `v7.19.0`, `CHANGELOG.md`, `modules/appium/README.md`) | Discovery, release notes, tag-pinned source fallback, `docs` links |
| `github.com/selenide-examples/selenide-appium` | Mobile setup patterns (`WebDriverProvider`, JUnit extension, `selenide.properties`, run commands) and `docs` links |
| Maven Central `-sources.jar` files for the pinned versions | **Verification artifact.** Final say on names, signatures, overloads and defaults |
| User's summary of the video `youtube.com/watch?v=C8rUqOUhxIo` | Scope guide for the mobile half only. Not watched. Every API it names is verified in the jar |

Not approved (do not use): Context7 `/websites/deepwiki_selenide_selenide`, `appium.io`,
`github.com/appium`, Android/Apple developer docs, blogs, Q&A sites.

**What shipped is the truth.** Context7 and `selenide.org` docs may describe `main` or a
newer release. When they disagree with the 7.19.0 sources jar, the jar wins and the conflict
is reported to the user. Example already found: the video summary's `withTagAndDescription()`
shipped as `AppiumSelectors.withTagAndContentDescription()`.

**Known artifact quirks (7.19.0):**

- The real code is in `selenide-core` (~380 KB sources). `com.codeborne:selenide` (~27 KB)
  holds `Configuration`, `Selenide`, `WebDriverRunner` and the JUnit 5 extensions
  (`BrowserPerTestStrategyExtension`, `ScreenShooterExtension`, `SoftAssertsExtension`).
  Both are needed.
- `selenide-proxy`'s published sources jar is a 1 KB stub (`DummyProxy.java` only). Its
  real source is `modules/proxy` at tag `v7.19.0` in `github.com/selenide/selenide`, which is
  the approved fallback for any module whose sources jar is incomplete.
- `selenide-appium` versions track `selenide` exactly. They are one release line.
  selenide-appium 7.19.0 depends on Appium `java-client` **11.0.0** and Selenium 4.51.0.
- Javadoc exists only under `selenide.org/javadoc/current/`. There is no versioned path, so
  links use `current` and the link checker catches drift.

## 4. Data schema

Unchanged from the Playwright project except for one new required field, `platform`.

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',
  cls: 'condition',
  color: '#fb923c',
  items: [
    {
      name: 'shouldHave(text())',
      level: 'beginner',     // 'beginner' | 'intermediate' | 'advanced'
      platform: 'both',      // 'web' | 'mobile' | 'both'
      desc: 'Asserts the element contains the given text, waiting up to Configuration.timeout.',
      tip: 'text() is a case-insensitive substring match. Use exactText() for an exact match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
  ],
};
```

`platform` meaning: `web` is browser-only, `mobile` is selenide-appium-only, `both` is a
concept that works the same on a `SelenideElement` and a `SelenideAppiumElement` (most
conditions, `should*` with `Duration`, collections).

### Integrity rules (`tests/data-integrity.spec.js`)

| Rule | Check |
|---|---|
| Required fields | `name`, `level`, `platform`, `desc`, `tip`, `docs`, `code` present and not blank or whitespace |
| `level` | `beginner` \| `intermediate` \| `advanced` |
| `platform` | `web` \| `mobile` \| `both` |
| `docs` | Parsed with `new URL()`. Protocol `https:`. Host `selenide.org`, **or** host `github.com` with a path starting `/selenide/` or `/selenide-examples/` |
| `code` | At least 20 characters after trimming |
| `name` | Unique within its category and across all categories |
| `name` characters | Contains no `<` or `>`. `app.js` renders names with `innerHTML` (tile and modal title), so a generic such as `Container<T>` would be parsed as a tag and vanish. Write `Container (generic)` and show the generics in `code` |
| `color` | `/^#[0-9a-fA-F]{6}$/` |
| Category `cat` | Must not equal a quick-filter value: `all`, `beginner`, `popular`, `mobile` (filters are keyed by `cat`) |
| All item fields | No em-dash or en-dash |

All Playwright-specific describe blocks are deleted. The generic checks stay.

### Snippet conventions

- Java 17+. Snippets assume `import static com.codeborne.selenide.Selenide.*;`,
  `import static com.codeborne.selenide.Condition.*;` and
  `import static com.codeborne.selenide.CollectionCondition.*;`, shown once in a beginner
  "Static imports" entry. Any other non-obvious import (`AppiumBy`, `CombinedBy`,
  `AppiumClickOptions`, `AppiumSelectors`) is written inside the snippet.
- One concept per snippet. No class boilerplate unless the concept is the class (page
  objects, JUnit extensions, `WebDriverProvider`).
- `selenide.properties` snippets start with a `# selenide.properties` comment line (this
  routes them to the shell highlighter, which renders `key=value` cleanly).
- Template-literal escaping: `\${` for Maven/Gradle properties, Java `"\\d+"` written as
  `"\\\\d+"`. Backticks never occur in Java.
- New in 7.19.0 entries end their `desc` with `Added in Selenide 7.19.0.`

## 5. Categories

Display order is web first, then mobile, so grouped view reads as two halves. 21 categories.
Each category lives in `js/data/<cls>.js` (for example `js/data/config.js`,
`js/data/appium-setup.js`), and its tile gradient is the CSS rule `.<cls>`.

| # | `cat` | `cls` | Half | Target entries |
|---|---|---|---|---|
| 1 | Setup & Config | `config` | web | 14 to 18 |
| 2 | Navigation & Browser | `navigation` | web | 10 to 12 |
| 3 | Selectors | `selector` | web | 14 to 18 |
| 4 | Actions | `action` | web | 16 to 20 |
| 5 | Conditions | `condition` | web (items mostly `both`) | 18 to 22 |
| 6 | Collections | `collection` | web (items mostly `both`) | 12 to 15 |
| 7 | Waits & Timeouts | `wait` | web | 5 to 7 |
| 8 | Page Objects | `page-object` | web | 6 to 8 |
| 9 | Windows, Frames, Alerts | `window` | web | 8 to 10 |
| 10 | Files | `file` | web | 8 to 10 |
| 11 | Proxy & Network | `network` | web | 6 to 8 |
| 12 | JavaScript, Storage, Clipboard | `javascript` | web | 8 to 10 |
| 13 | Reports & Debugging | `report` | web | 8 to 10 |
| 14 | Test Frameworks | `framework` | web | 6 to 8 |
| 15 | Remote & Grid | `remote` | web | 5 to 7 |
| 16 | Patterns | `pattern` | web | 6 to 8 |
| 17 | Build & Run | `cli` | web | 6 to 8 |
| 18 | Appium Setup | `appium-setup` | mobile | 8 to 10 |
| 19 | Mobile Selectors | `mobile-selector` | mobile | 12 to 16 |
| 20 | Mobile Gestures | `mobile-gesture` | mobile | 10 to 14 |
| 21 | Mobile Context & App | `mobile-context` | mobile | 8 to 12 |

The seed lists in kickoff section 4 (items 1 to 16 and 22) apply to the web categories as a
starting point. The 7.19.0 additions belong in the obvious categories: `BrowserState` save and
restore (Patterns or Navigation & Browser), `BrowserClock` and timezone emulation
(JavaScript, Storage, Clipboard), `visibleText()` (Conditions), HtmlUnit (Setup & Config),
Appium `scroll()`/`swipe()` inside an element (Mobile Gestures). Monorepo modules not in the
seed list (`grid`, `selenoid`, `moon`, `video-recorder`, `full-screenshot`,
`clear-with-shortcut`, `cli`, `mcp`) are scoped into Remote & Grid, Reports & Debugging,
Actions and Build & Run where an approved source documents them.

**Mobile seed list, verified against the 7.19.0 jar during brainstorming:**

- *Appium Setup:* `selenide-appium` dependency; `WebDriverProvider` returning `AndroidDriver`
  / `IOSDriver` built from `UiAutomator2Options` / `XCUITestOptions`; `Configuration.browser`
  set to the provider class; `selenide.properties` and `-Dselenide.*` arguments;
  `SelenideAppium.launchApp()`; a JUnit extension for lifecycle (as in the examples repo).
- *Mobile Selectors:* `AppiumSelectors.byAttribute`, `byClassNameAndIndex`,
  `byContentDescription`, `byName`, `byTagAndAttribute`, `byTagAndContentDescription`,
  `byTagAndName`, `byTagAndText`, `byText`, and the `with*` partial-match family;
  `CombinedBy.android(...).ios(...)`; `@AndroidFindBy` / `@iOSXCUITFindBy` with
  `SelenideAppiumPageFactory` / `ScreenObject`; `SelenideAppium.element(By)` /
  `elements(By)` returning `SelenideAppiumElement` / `SelenideAppiumCollection` (any
  `$`-based form is included only if verified in phase 5); `$(AppiumBy.accessibilityId(...))`.
- *Mobile Gestures:* `tap()`, `tap(AppiumClickOptions.tapWithOffset(x, y))`, `doubleTap()`,
  `AppiumClickOptions.longPress()` / `longPressFor(Duration)` /
  `longPressWithOffsetFor(...)`, `scroll(AppiumScrollOptions.down() / up(...) / with(...))`,
  `scrollTo()`, `swipe(AppiumSwipeOptions.left() / right(...))`, `swipeTo()`,
  `hideKeyboard()`, `unfocus()`, `dragAndDrop(...)`.
- *Mobile Context & App:* `SelenideAppium.getContextHandles()`, `getCurrentContext()`,
  `switchTo().context(...)`; `openAndroidDeepLink(url, appPackage)`, `openIOSDeepLink(url)`;
  `launchApp()`, `relaunchApp(appId[, timeout])`, `terminateApp(appId[, timeout])`,
  `activateApp(appId)`, `back()`; `AppiumCondition.attribute(CombinedAttribute, value)`,
  `AppiumCollectionCondition.attributes(...)`; `AppiumClipboard`.

## 6. UI

Everything not listed here is kept as-is (layout, dark theme, tile grid, modal, `⌘K` /
`Ctrl+K`, flat/grouped views, copy button, `window.*` test globals).

- **Branding:** title and header "Selenide Commands Dashboard". Header logo and favicon are
  the official Selenide logo, taken from `github.com/selenide` or `selenide.org`.
  `images/playwright-logo.svg` is deleted.
- **Quick filters:** All · ⭐ Start Here · 🔥 Popular · **📱 Mobile** · one per category. Mobile
  shows `platform === 'mobile' || platform === 'both'` and round-trips through
  `#filter=mobile` like the others. Search applies on top of it.
- **Gradients:** web categories keep the current style (bright, same-hue, two-stop
  gradients) with start hues **outside** the violet/magenta range (roughly 250 to 335
  degrees). The four mobile categories use start colors **inside** it (`#8b5cf6`, `#a855f7`,
  `#c026d3`, `#db2777`) and all end at the same deep indigo `#1e1b4b`. Each category's
  `color` equals its gradient start. Exact web hex values are tuned in phase 4 from a
  grouped-view screenshot.
- **Meta bar:** `js/versions.json` is the single pinned source of truth:

  ```json
  { "selenide": "7.19.0", "selenideAppium": "7.19.0", "appiumJavaClient": "11.0.0" }
  ```

  The first badge reads `selenide v7.19.0` (`#selenide-version`), fetched from
  `./js/versions.json`, with the same value as the HTML fallback. `package.json` is no
  longer a version source. Last-updated (`js/meta.json`, CI-stamped), command count and
  visitors are unchanged in behaviour.

## 7. Syntax highlighting

`js/highlight.js` keeps its design: dependency-free, one regex pass per language, every
character HTML-escaped exactly once, only the six `tok-*` classes, and exact round-trip so
Copy (`innerText`) returns `item.code`.

**`highlight(code)` for Java.** Ordered alternatives:

1. comment: `//...`, `/* ... */`, `/** ... */` → `tok-comment`
2. text block `"""..."""` (before plain strings so it wins) → `tok-string`
3. string `"..."` and char `'c'`, with backslash escapes → `tok-string`
4. annotation `@Ident` (e.g. `@Test`, `@FindBy`, `@AndroidFindBy`) → `tok-keyword`
5. number: hex `0xFF`, underscores `1_000`, long `10L`, float `1.5f`, exponent `2e3` →
   `tok-number`
6. identifier `[A-Za-z_$][\w$]*` (so `$` and `$$` match), then: Java keyword set (incl.
   `var`, `record`, `sealed`, `permits`, `yield`, `non-sealed`, `true`, `false`, `null`) →
   `tok-keyword`; Selenide/Appium API set (`$`, `$$`, `$x`, `open`, `Configuration`,
   `Condition`, `CollectionCondition`, `Selenide`, `SelenideElement`, `ElementsCollection`,
   `WebDriverRunner`, `SelenideAppium`, `SelenideAppiumElement`, `AppiumBy`, `CombinedBy`,
   `AppiumSelectors`, `AppiumClickOptions`, `AppiumScrollOptions`, `AppiumSwipeOptions`, ...)
   → `tok-api`; otherwise followed by `(` → `tok-fn`.

Generics need no rule: `<` and `>` are escaped plain text.

**`highlightShell(code)`** keeps today's behaviour (quoted strings, flags as `tok-keyword`,
numbers, `//` not a comment) with two changes: `#` starts a comment only at line start or
after whitespace (so `mvn test -Dtest=LoginTest#login` stays plain), and flags may contain
dots (`-Dselenide.browser` is one flag). Program set: `mvn`, `gradle`, `gradlew`,
`./gradlew` (own alternative, since `.` and `/` are not identifier characters), `java`,
`emulator`, `npm`, `npx`, `git`.

**`highlightXml(code)`**, for `pom.xml` snippets: `<!-- -->` → `tok-comment`; tag names →
`tok-keyword` (the surrounding `<`, `</`, `>`, `/>` are escaped plain); attribute names →
`tok-fn`; quoted values **directly after `=`** → `tok-string` (so an apostrophe in text
content never pairs up); `${...}` → `tok-api` (inside text content too); other text plain.

**Routing.** `highlight.js` exports `pickHighlighter(item)` returning `'shell' | 'xml' |
'java'`, and `highlightFor(item)` applying it. Both are on `window` for tests. They live in
`highlight.js` rather than `app.js` so they can be tested without the app's side effects:

- shell when `item.cls === 'cli'`, or the code matches
  `/^\s*(?:(?:mvn|gradle|\.\/gradlew|emulator|npm|npx)\s|#)/`
- XML when the code starts with `<` (after leading whitespace)
- Java otherwise

`window.highlightXml` is exposed for tests alongside `window.highlight` and
`window.highlightShell`.

**Tests first** (`tests/highlight.spec.js`), before the rules are written:

- Java: text block; `$("#id")` and `$$(".row")`; annotation; generics; escaped quote inside
  a string; `"//"` inside a string stays a string; `10L`, `0xFF`, `1_000`; method name before
  `(` is `tok-fn`; an API identifier is `tok-api`.
- XML: tag, attribute name and value, `${selenide.version}`, comment.
- Shell: `./gradlew test`, `mvn test -Dselenide.browser=firefox`, `#` comment.
- Routing: one case per branch.
- Round-trip property over **every** entry in `window.categories`: strip the tags, unescape
  the HTML, compare with `item.code`.

## 8. Analytics (Supabase)

Same project, same structure as the existing migrations, with no shared state:

| Existing | Selenide |
|---|---|
| `visits` / `increment_visits()` | `selenide_visits` / `increment_selenide_visits()` |
| `command_views` / `increment_command_view(cmd_id)` | `selenide_command_views` / `increment_selenide_command_view(cmd_id)` |
| Edge Function `increment-visitor` | `increment-selenide-visitor` |
| Edge Function `increment-command-view` | `increment-selenide-command-view` |

- Migrations `supabase/migrations/0001_selenide_visits.sql` and
  `0002_selenide_command_views.sql` copy the existing ones: atomic update /
  upsert-increment, RLS enabled, a public `select` policy only. Writes happen only through the
  Edge Functions with the service-role key. The Playwright migrations and functions are
  removed from this repo (they belong to the other one).
- Client constants are renamed, including storage keys (`selenide-visitor-count-cache`,
  `selenide-command-views-cache`, `selenide-cmd-opened:` prefix), so a browser that visits
  both sites never mixes caches.
- Kept: once-per-session dedup, the `navigator.webdriver` bot guard, the top-~10% 🔥 rule,
  command id `` `${item.cls}:${item.name}` ``, and graceful fallback.
- **Nothing runs against the live project.** The user applies the SQL and deploys the
  functions. Tests mock REST and Edge Function calls with `page.route()`.

## 9. Release-sync skill: `selenide-release-sync`

`.claude/skills/playwright-release-sync/` is replaced by `.claude/skills/selenide-release-sync/`
with the same shape: measure the gap, read the whole delta, verify against the shipped
artifact, check links, bump references, pin with tests, run the gates, report.

### Scripts (Node 20, no dependencies, `unzip` the only external tool)

**`fetch-sources.mjs`** (phase 4b). Reads `js/versions.json`, downloads the `-sources.jar` for
`selenide`, `selenide-core`, `selenide-appium`, `selenide-grid`, `selenide-selenoid`,
`selenide-moon`, `selenide-testng`, `selenide-junit4`, `selenide-video-recorder`,
`selenide-full-screenshot`, `selenide-clear-with-shortcut` (all at `selenide`'s version) and
`io.appium:java-client` (at `appiumJavaClient`) from Maven Central, and unzips each into
`.cache/sources/<artifact>-<version>/`. For `selenide-proxy`, whose jar is a stub, it fetches
`modules/proxy/src/main/java` at tag `v<selenide>` from `github.com/selenide/selenide`.
Idempotent: skips anything already present. `.cache/` is gitignored. npm script:
`fetch:sources`.

**`check-docs-links.mjs`** (phase 4b). Imports `js/data/index.js`, groups items by page URL,
fetches each page once (concurrency 6, 3 retries, 20 s timeout), and for each `#fragment`:
decodes it, then matches `id="<exact>"` literally (no regex built from the anchor, because
Javadoc anchors like `shouldHave(com.codeborne.selenide.WebElementCondition...)` contain
metacharacters). Javadoc ids are quoted. For `github.com` README anchors the checker looks
for `user-content-<anchor>`: a GitHub blob page embeds the rendered README in JSON, where
heading ids appear escaped as `id=\"user-content-features\"` (observed on
`selenide/selenide/blob/main/modules/appium/README.md`). GitHub `docs` links use
`blob/main/...`. The matching logic lives in `scripts/lib/anchors.mjs` with `node:test` unit
tests (`npm run test:scripts`), which `test.yml` runs on the chromium job. Redirects to a different path count as
broken. `--only=<cat,cat>` limits the run. Exit codes: 0 all good, 1 broken links, 2 could not
run (every request failed). npm script: `check:links`.

**`release-delta.mjs`** (phase 7). Pinned version from `js/versions.json`, latest from
`https://repo1.maven.org/maven2/com/codeborne/selenide/maven-metadata.xml` (`<release>`).
Also reads `selenide-appium`'s metadata and warns if its latest differs from core's.

- `--check` prints `pinned=7.19.0 latest=X.Y.Z behind=true|false`.
- Without flags it prints every `## X.Y.Z (date)` section of `CHANGELOG.md` at tag
  `vX.Y.Z` that is newer than the pinned version and not newer than latest. Appium changes are
  listed there too: `modules/appium/CHANGELOG` stopped at 6.15.0, when selenide-appium merged
  into the monorepo, so it is not read.
- `--to=X.Y.Z` compares against a specific release.
- Exit 0 on success, 2 when Maven Central or GitHub could not be reached.

npm scripts keep their names: `release:delta`, `check:links`.

### `SKILL.md` and `references/quality-bar.md`

Rewritten in the same structure. Key changes:

- The verification table points at `.cache/sources/` (`grep -rn` the signature) instead of
  `.d.ts` files, with the sources-policy table from section 3, and the rule "Context7 and the
  official site are for discovery, the jar decides, report conflicts".
- Bump step: `npm run fetch:sources` after editing `js/versions.json`. Version references:
  `js/versions.json`, the `#selenide-version` fallback and `#cmd-count` in `index.html`, the
  `readme.md` badge, the `CLAUDE.md` tech table, and the dependency snippets in
  `js/data/config.js`, `cli.js` and `appium-setup.js`. `js/meta.json` is never hand-edited.
- Triage table adapted to Selenide changelog items ("update Selenium/Appium from X to Y" →
  bump `versions.json` only if it is `appiumJavaClient`, otherwise leave out).
- Test template: a `Selenide X.Y.Z entries` describe block per release.

### Workflow `.github/workflows/cheatsheet-sync.yml`

Cron `0 6 1,15 * *` plus `workflow_dispatch` (`dry_run`). The deterministic "Detect drift"
step runs `release-delta.mjs --check` and `check-docs-links.mjs` before any install; the
agent runs only on `behind=true`, link exit code 1, or a manual run. The agent follows
`selenide-release-sync`, opens a PR (draft with a `[CI FAILING]` title when a gate fails) and
never merges or pushes to `master`/`develop`. `.github/prompts/cheatsheet-sync.md` is
rewritten for Selenide. `.github/cheatsheet-sync.mcp.json` keeps Context7. The sync job also runs
`npm run fetch:sources` before the agent. `test.yml` gains one step (`npm run test:scripts`
on the chromium job); `stamp-date.yml` is unchanged.

## 10. Testing

### Expected values come from an independent source

A test is only as correct as its expected result. Every expected value is written by hand
from a source that is independent of the code or data under test:

| Test kind | Where the expected value comes from |
|---|---|
| Per-category entry guards | The 7.19.0 sources jar. Each expected API string carries a comment citing the jar file and the signature, e.g. `// selenide-appium 7.19.0 AppiumSelectors.java: public static By withTagAndContentDescription(String tag, String contentDescription)` |
| Highlighter | The token rules in section 7, written out as literal expected HTML per input |
| UI behaviour (filters, search, URL hash, meta bar) | The behaviour this spec defines, as literal values (e.g. `#filter=mobile`, `selenide v7.19.0` from a mocked `versions.json`) |
| Schema rules | The rule tables in section 4 |

Forbidden:

- Computing the expected value with the code under test (`expect(highlight(x)).toBe(highlight(x))`
  style), or copying the current output into the test as the expected value.
- Asserting facts about an entry by reading the same entry (`expect(modalText).toBe(item.desc)`).
  Such a test cannot fail when the entry is wrong.
- Weakening or deleting an assertion to make a test pass. If an expected value turns out to
  be wrong, re-check it against its source and record which source corrected it.

Every new test is run and seen to **fail for the expected reason** before the code or entry
that makes it pass is written (test-first). Structural checks that use the data only as
input to the renderer (for example "tile count equals the number of items") stay, because
they test rendering rather than any fact about an entry.

### Test files

- `tests/helpers/schema.js` holds the section 4 rules as pure validators.
  `tests/schema-rules.spec.js` proves each one against hand-written good and bad fixtures, and
  `tests/data-integrity.spec.js` applies them to the real data.
- `tests/content/<cls>.spec.js`, one file per category from phase 5 (separate files so
  parallel content agents never edit the same test file), pinning the details that would be
  wrong if copied from an older or unverified answer (for example
  `withTagAndContentDescription` and never `withTagAndDescription`, `CombinedBy` code
  contains `.ios(`, the 7.19.0 entries exist with the right level and `platform`).
- UI tests that need exact, stable expectations load a hand-written fixture dataset through
  `tests/helpers/fixture-data.js` (a `page.route` that serves it in place of
  `js/data/index.js`).
- `playwright.config.js` reads `PORT` (default 3000), so parallel worktrees never share a server.
- `tests/highlight.spec.js`: section 7.
- `tests/cheatsheet.spec.js`: tests that hard-code Playwright entry names are rewritten
  against Selenide entries or derived from `window.categories`. New: Mobile filter shows only
  `mobile`/`both`, round-trips via `#filter=mobile`, combines with search, and grouped view
  under it shows only categories that have such items.
- `tests/meta-bar.spec.js`: version badge reads `js/versions.json` (mocked with
  `page.route`), falls back to the HTML value when the fetch fails.
- `tests/popular-commands.spec.js`: same behaviour with the renamed function, table and
  storage keys.
- Projects `chromium`, `iPhone 16`, `Pixel 7`, `webServer` on port 3000, unchanged.

## 11. Delivery phases

Each phase ends with `npm test`, `npm run lint` and `npm run format:check` green (from 4b on
also `npm run check:links`), and is committed on `develop` as one commit.

| # | Phase | Notes |
|---|---|---|
| 0 | Baseline commit on `master`, create `develop` | Done: `4a25ee9` |
| 1 | Strip and rebrand | Delete the 16 Playwright modules, Playwright-specific tests, specs and plans. Four placeholder entries: "Static imports" and `Configuration.timeout` (Setup & Config), `open()` (Navigation & Browser), `shouldHave(text())` (Conditions). The fourth (intermediate) keeps the "Start Here" filter a strict subset. Rebrand title, header, favicon, logo |
| 2 | Schema | `platform`, URL allowlist, filter-name clash rule, no `<`/`>` in names, `Item` typedef |
| 3 | Highlighter | Test-first: Java, shell, XML, routing, round-trip |
| 4 | UI | Mobile filter, `versions.json` meta bar, gradient families, tests |
| 4b | Verification tooling | `fetch-sources.mjs`, `check-docs-links.mjs`, npm scripts, `.cache/` gitignored |
| 5 | Content | Subagents in waves of about five, one category file each. The lead owns `index.js`, `style.css` and the per-category tests, and reviews every category diff before committing it. Subagents use approved sources only and report any other source instead of using it. Each runs `check:links --only=<cat>` |
| 6 | Supabase | Migrations and Edge Functions as files, client renames. Nothing applied |
| 7 | Release sync | `release-delta.mjs`, `SKILL.md`, `quality-bar.md`, workflow, prompt |
| 8 | Docs | `CLAUDE.md` (same structure as today's, with the Java-in-template-literal gotchas), `AGENTS.md`, `readme.md`, screenshots in `images/` captured from the local server |

## 12. Out of scope (follow-ups)

- CI job compiling each Java snippet with `javac` against the pinned jars.
- Kotlin snippet toggle.
- Splitting `platform` into `android` / `ios`.
- Raw Appium tooling (Appium CLI, drivers, Inspector, `adb`, `simctl`), unless the user later
  approves `appium.io` and asks for it.
- A grouped-view divider between the web and mobile halves (the gradient family carries the
  split for v1).
