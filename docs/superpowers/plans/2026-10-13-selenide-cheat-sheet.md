# Selenide + selenide-appium Cheat Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn this copy of the Playwright cheat sheet into a Selenide 7.19.0 + selenide-appium
7.19.0 cheat sheet with 200 to 260 verified entries, keeping the engine, conventions and gates.

**Architecture:** Static vanilla ES modules served as files. Data lives in one
`export default` Category module per file under `js/data/`. `js/highlight.js` gains Java,
shell and XML tokenizers plus routing. Verification tooling (Node, no dependencies) lives in
`.claude/skills/selenide-release-sync/scripts/` and is built before content so every entry is
checked against the shipped sources jar and the live docs anchor.

**Tech Stack:** HTML5, CSS3, ES2022 modules, `@playwright/test` 1.64 (tests only), Node 20
(`node:test` for script unit tests), ESLint 9, Prettier 3, `serve`, Supabase (files only),
GitHub Actions.

**Spec:** [`docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md`](../specs/2026-10-13-selenide-cheat-sheet-design.md).
Read it before any task. Brief: [`docs/kickoff.md`](../../kickoff.md).

## Global Constraints

- No build step, no bundler, no transpiler, no framework, no CDN imports. `index.html` must work from any static file server.
- Zero runtime dependencies. Everything in `package.json` is a `devDependency`.
- Gates for every task: `npm test`, `npm run lint`, `npm run format:check` all pass. From Task 6 on, also `npm run test:scripts` and `npm run check:links`.
- Code style: 2-space indent, single quotes, semicolons, ES5 trailing commas, ~100 char lines (Prettier).
- Work on branch `develop`. Commit at the end of each task. Never push, never touch `master`.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Pinned versions: Selenide `7.19.0`, selenide-appium `7.19.0`, Appium java-client `11.0.0`.
- Item fields, all required: `name`, `level` (`beginner` | `intermediate` | `advanced`), `platform` (`web` | `mobile` | `both`), `desc`, `tip`, `docs`, `code`.
- No em-dash `—` or en-dash `–` in any item field. Use a period, comma, colon, or hyphen.
- `name` contains no `<` or `>`. Names are globally unique.
- `docs`: `https:`, host `selenide.org`, or host `github.com` with path starting `/selenide/` or `/selenide-examples/`. GitHub links use `blob/main/...`.
- Approved sources only: Context7 `/selenide/selenide`, `selenide.org`, `github.com/selenide/*`, `github.com/selenide-examples/selenide-appium`, Maven Central sources jars. Anything else is named to the user and approved before use. The sources jar has the final say.
- Mobile content is selenide-appium's own API only. `AppiumBy` and other java-client classes appear only inside Selenide calls or a `WebDriverProvider`.
- **Test oracle rule:** every expected value is hand-written from an independent source (the sources jar with a citing comment, the spec's rules, literal HTML derived from the token rules). Never compute an expected value with the code under test, never paste current output as the expectation, never assert an entry's facts by reading the same entry. Every new test is run and seen to fail for the expected reason before the code that makes it pass.
- `js/meta.json` is never hand-edited.
- Supabase: nothing runs against the live project. **Task 8 is deferred by the user**: analytics
  stay off behind `ENABLED = false` placeholders (Task 1 Step 7b) until it is picked up.

## Review Focus

1. **Category names with `&`, commas and spaces in the URL hash.** `Setup & Config` and `Windows, Frames, Alerts` must round-trip as `#filter=Setup+%26+Config`. Pinned in Task 1 (fixture test).
2. **`#` that is not a shell comment.** `mvn test -Dtest=LoginTest#login` must not turn `#login` into a comment. Pinned in Task 3.
3. **Strings that contain comment markers or escapes.** `"https://x"`, a text block containing `"//b"`, and a string ending in an escaped backslash `"a\\"` must stay one string token. Pinned in Task 3.
4. **Search for `$` and `$$`.** A query of `$$` must match only snippets that contain `$$`. Pinned in Task 4 (fixture test).
5. **Mobile filter combined with search and grouped view.** Only `mobile`/`both` items, only categories that have some, search narrowing on top. Pinned in Task 4 (fixture test).

---

## File map

| File | Responsibility | Tasks |
|---|---|---|
| `index.html` | Markup, branding, meta bar fallbacks | 1, 4 |
| `style.css` | Theme, tile gradients (21 classes) | 4 |
| `js/app.js` | Render, filters (adds Mobile), search, modal, meta bar | 3, 4 |
| `js/highlight.js` | `highlight` (Java), `highlightShell`, `highlightXml`, `pickHighlighter`, `highlightFor` | 3 |
| `js/versions.json` | Pinned versions, single source of truth | 4 |
| `js/data/index.js` | Category order, `Item`/`Category` typedefs | 1, 2, 7 |
| `js/data/<cls>.js` | One category each (21 files) | 1, 7 |
| `js/popular-commands.js`, `js/visitor-*.js` | Supabase client with `selenide_` names | 8 |
| `tests/helpers/schema.js` | Pure schema validators | 2 |
| `tests/helpers/fixture-data.js` | Serves a hand-written fixture dataset in place of `js/data/index.js` | 1, 4 |
| `tests/helpers/items.js` | `itemIn(page, cat, name)` lookup for content tests | 7 |
| `tests/schema-rules.spec.js` | Validators vs. hand-written fixtures | 2 |
| `tests/data-integrity.spec.js` | Validators vs. real data | 1, 2 |
| `tests/highlight.spec.js` | Highlighter, routing, round-trip | 3 |
| `tests/cheatsheet.spec.js` | UI behaviour | 1, 4 |
| `tests/meta-bar.spec.js` | Meta bar, visitor counter | 1, 4, 8 |
| `tests/popular-commands.spec.js` | Popularity | 1, 8 |
| `tests/content/<cls>.spec.js` | Per-category guards, expected values from the jar | 7 |
| `.claude/skills/selenide-release-sync/` | Skill, quality bar, scripts | 5, 6, 9 |
| `supabase/` | Migrations and Edge Functions | 8 |
| `.github/workflows/`, `.github/prompts/` | CI | 6, 9 |
| `CLAUDE.md`, `AGENTS.md`, `readme.md`, `images/` | Docs | 10 |

Task numbering versus the spec's phases: Task 1 = phase 1, Task 2 = phase 2, Task 3 = phase
3, Task 4 = phase 4, Tasks 5 and 6 = phase 4b, Task 7 = phase 5, Task 8 = phase 6, Task 9 =
phase 7, Task 10 = phase 8.

---

### Task 1: Strip and rebrand

**Files:**
- Delete: `js/data/{setup,actions,queries,assertions,utility,network,api,accessibility,fixtures,clock,tracing,component,media,patterns,cli,config}.js`, `images/playwright-logo.svg`, `docs/superpowers/specs/2026-06-0*.md`, `docs/superpowers/plans/2026-06-07-*.md`
- Create: `js/data/config.js`, `js/data/navigation.js`, `js/data/condition.js`, `images/selenide-logo.png`, `images/favicon.ico`, `tests/helpers/fixture-data.js`
- Modify: `js/data/index.js`, `index.html`, `package.json`, `tests/data-integrity.spec.js`, `tests/cheatsheet.spec.js`, `tests/highlight.spec.js`, `tests/meta-bar.spec.js`, `tests/popular-commands.spec.js`

**Interfaces:**
- Produces: categories `Setup & Config` (`config`), `Navigation & Browser` (`navigation`), `Conditions` (`condition`) with four verified entries: `Static imports`, `Configuration.timeout`, `open()`, `shouldHave(text())`.
- Produces: `useFixtureData(page, categories?)` and `FIXTURE_CATEGORIES` in `tests/helpers/fixture-data.js`.

- [ ] **Step 1: Delete Playwright content, logo, specs and plans**

```bash
git rm -q js/data/{setup,actions,queries,assertions,utility,network,api,accessibility,fixtures,clock,tracing,component,media,patterns,cli,config}.js \
  images/playwright-logo.svg docs/superpowers/specs/2026-06-0*.md docs/superpowers/plans/2026-06-07-*.md
```

- [ ] **Step 2: Add the official Selenide logo and favicon (approved source: selenide.org)**

```bash
curl -sfo images/selenide-logo.png https://selenide.org/images/selenide-logo-big.png
curl -sfo images/favicon.ico https://selenide.org/favicon.ico
sips -g pixelWidth -g pixelHeight images/selenide-logo.png   # expect 352 x 186
```

- [ ] **Step 3: Write the three placeholder category files**

Each fact was verified against the 7.19.0 sources during planning; the comments in Step 7's
tests cite them.

`js/data/config.js`:

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Setup & Config',
  cls: 'config',
  color: '#06b6d4',
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
      name: 'Configuration.timeout',
      level: 'intermediate',
      platform: 'both',
      desc: 'How long, in milliseconds, should* methods keep retrying before they fail. The default is 4000.',
      tip: 'Set it once for the suite, or pass -Dselenide.timeout=10000. For one slow element, pass a Duration to should() instead of raising the global value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#timeout',
      code: `Configuration.timeout = 10_000; // milliseconds`,
    },
  ],
};
```

`js/data/navigation.js`:

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Navigation & Browser',
  cls: 'navigation',
  color: '#0ea5e9',
  items: [
    {
      name: 'open()',
      level: 'beginner',
      platform: 'web',
      desc: 'Opens a URL in the browser, starting the browser on first use. A relative URL is prefixed with Configuration.baseUrl.',
      tip: 'A URL that does not start with http://, https:// or file:// is treated as relative. The browser is reused across calls and closed automatically when the tests finish.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String)',
      code: `Configuration.baseUrl = "https://shop.example.com";
open("/login"); // opens https://shop.example.com/login`,
    },
  ],
};
```

`js/data/condition.js`:

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',
  cls: 'condition',
  color: '#f97316',
  items: [
    {
      name: 'shouldHave(text())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts the element contains the given text, retrying until Configuration.timeout runs out.',
      tip: 'text() is a case-insensitive substring match that ignores repeated whitespace. Use exactText() for an exact match. An empty string is rejected.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
  ],
};
```

- [ ] **Step 4: Rewrite `js/data/index.js`**

```js
/**
 * @typedef {{ name: string, level: 'beginner'|'intermediate'|'advanced', platform: 'web'|'mobile'|'both', desc: string, tip: string, docs: string, code: string }} Item
 * @typedef {{ cat: string, cls: string, color: string, items: Item[] }} Category
 */

import config from './config.js';
import navigation from './navigation.js';
import condition from './condition.js';

/** @type {Category[]} */
export const categories = [config, navigation, condition];
```

- [ ] **Step 5: Rebrand `index.html` and `package.json`**

In `index.html` replace lines 6 to 15 (title through `</header>`) with:

```html
  <title>Selenide Commands Dashboard</title>
  <link rel="icon" href="images/favicon.ico">
  <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
  <img class="header-logo" src="images/selenide-logo.png" alt="Selenide logo" width="83" height="44" />
  <span>Selenide Commands Dashboard</span>
  <img class="header-logo" src="images/selenide-logo.png" alt="" aria-hidden="true" width="83" height="44" />
</header>
```

Set the `#cmd-count` fallback to `4`. Leave the version badge for Task 4.

In `package.json` set `"name": "selenide-commands-cheat-sheet"`.

- [ ] **Step 6: Write the fixture-data helper**

`tests/helpers/fixture-data.js`:

```js
// Serves a small, hand-written dataset in place of js/data/index.js so UI tests
// can assert exact, independently known results (tile names, counts, hash
// strings) that do not change as real content grows.

const item = (name, level, platform, code, extra = {}) => ({
  name,
  level,
  platform,
  desc: `Fixture entry ${name}.`,
  tip: 'Fixture tip.',
  docs: 'https://selenide.org/documentation.html',
  code,
  ...extra,
});

export const FIXTURE_CATEGORIES = [
  {
    cat: 'Setup & Config',
    cls: 'config',
    color: '#06b6d4',
    items: [
      item('alpha()', 'beginner', 'web', 'open("/alpha"); // first page'),
      item('beta()', 'intermediate', 'web', 'Configuration.timeout = 6000;'),
    ],
  },
  {
    cat: 'Conditions',
    cls: 'condition',
    color: '#f97316',
    items: [item('gamma()', 'beginner', 'both', '$$(".row").shouldHave(size(2));')],
  },
  {
    cat: 'Mobile Selectors',
    cls: 'mobile-selector',
    color: '#a855f7',
    items: [
      item('delta()', 'advanced', 'mobile', '$(AppiumBy.accessibilityId("Go")).tap();'),
      item('epsilon()', 'beginner', 'mobile', '$(byText("Ok")).click();'),
    ],
  },
];

export async function useFixtureData(page, categories = FIXTURE_CATEGORIES) {
  await page.route('**/js/data/index.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `export const categories = ${JSON.stringify(categories)};`,
    })
  );
}
```

- [ ] **Step 7: Remove Playwright-specific tests and retarget generic ones**

`tests/data-integrity.spec.js`: keep only lines 1 to 184 (the `Data integrity` describe ends
with `});` on line 184) and delete the test `all docs URLs point to playwright.dev` inside it
(Task 2 replaces it):

```bash
sed -i '' '185,$d' tests/data-integrity.spec.js   # macOS sed; GNU sed: sed -i '185,$d'
```

then remove that one test block with the Edit tool.

`tests/cheatsheet.spec.js`:
- Page load: title regex `/Selenide Commands Dashboard/`, header text `Selenide Commands Dashboard`, test name `shows the Selenide logo twice beside the header title`.
- `renders command tiles`: `toBeGreaterThan(0)` instead of `10`.
- Search: replace every `'goto'`/`'GOTO'` with `'open'`/`'OPEN'`, and `'page'` with `'open'`.
- Delete the `New category filters` and `New assertion tiles` describes.
- URL deep-linking: replace `'Action'` with `'Conditions'` and `filter=Action` with `filter=Conditions`, and `'click'` with `'text'`.
- Add, at the end of `URL deep-linking`:

```js
  test('a category name with "&" and spaces round-trips through the hash', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
    await page.locator('.filter-btn', { hasText: 'Setup & Config' }).click();
    // URLSearchParams encodes a space as "+" and "&" as "%26" (WHATWG URL spec)
    await expect(page).toHaveURL(/#filter=Setup\+%26\+Config$/);

    // Fresh document load from the hash (not a same-document hashchange)
    await page.goto('about:blank');
    await page.goto('/#filter=Setup+%26+Config');
    await expect(page.locator('.filter-btn', { hasText: 'Setup & Config' })).toHaveClass(/active/);
    await expect(page.locator('.tile-name')).toHaveText(['alpha()', 'beta()']);
  });
```

  and `import { useFixtureData } from './helpers/fixture-data.js';` at the top. The file's
  `beforeEach` already loaded `/` with the real data. A `goto` that changes only the hash is
  a same-document navigation and does **not** reload the data, so every fixture test does
  `useFixtureData(page)` and then a full load (`goto('/')`, or `goto('about:blank')` before a
  hash URL).

`tests/highlight.spec.js`: delete the test `CLI commands render with the shell highlighter in
the modal` (Task 3 rewrites the file).

`tests/meta-bar.spec.js`: in `does not break the page when the backend is down` use
`toBeGreaterThan(0)`.

- [ ] **Step 7b: Switch analytics off behind a placeholder flag (Supabase deferred)**

The user deferred Supabase (Task 8). Until then the client would talk to the **Playwright
site's** tables, so any real-browser visit, even on localhost, would bump that site's
visitor count and add Selenide ids to its `command_views`. Analytics are therefore off, with
the switch in one obvious place per file.

First the test (fails today, because `visitor-display.js` always sends a GET). Append to
`tests/meta-bar.spec.js`:

```js
/* ── ANALYTICS PLACEHOLDER (Supabase deferred, plan Task 8) ────── */
test.describe('Analytics placeholder', () => {
  test('sends no request to Supabase, even for a real visitor opening a command', async ({
    page,
  }) => {
    await poseAsRealVisitor(page);
    const hits = [];
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => {
      hits.push(route.request().url());
      route.abort();
    });
    await page.goto('/');
    await page.locator('.tile').first().click();
    await page.waitForTimeout(500);
    expect(hits).toEqual([]);
  });

  test('hides the Popular filter and keeps the visitor badge placeholder', async ({ page }) => {
    await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('.filter-btn[data-filter="popular"]')).toHaveCount(0);
    await expect(page.locator('#visitor-count-number')).toHaveText('—');
  });
});
```

Run: `npx playwright test tests/meta-bar.spec.js -g "Analytics placeholder" --project=chromium`
Expected: FAIL (`hits` contains the `rest/v1/visits` URL; the Popular button exists).

Then the placeholder. `js/popular-commands.js`, after the constants:

```js
// SUPABASE PLACEHOLDER (deferred, see plan Task 8). Analytics stay off until the
// Selenide-specific tables and Edge Functions exist. While off, nothing is sent,
// so this site can never write into the Playwright cheat sheet's counters.
export const ENABLED = false;
```

and make the first line of `loadCounts()` `if (!ENABLED) return Promise.resolve();` and the
first line inside `recordOpen()`'s `try` `if (!ENABLED) return;`.

`js/visitor-counter.js` and `js/visitor-display.js`: as the first two lines inside each IIFE:

```js
  // SUPABASE PLACEHOLDER (deferred, see plan Task 8): no requests until re-enabled.
  const ENABLED = false;
  if (!ENABLED) return;
```

`js/app.js` `buildFilters()`: replace the Popular def with
`...(popularCmds.ENABLED ? [{ label: '🔥 Popular', filter: 'popular', color: null }] : []),`.

Skip the analytics behaviour tests, each with the same comment line above it:

```js
// Supabase deferred (plan Task 8): re-enable together with ENABLED = true.
```

on `test.describe.skip('Visitor counter — display', …)`,
`test.describe.skip('Visitor counter — increment', …)` in `tests/meta-bar.spec.js`, and both
describes in `tests/popular-commands.spec.js`.

Run the same command. Expected: PASS.

- [ ] **Step 8: Run the gates**

Run: `npm run lint && npm run format && npm run format:check && npm test`
Expected: all pass. If the `&` hash test fails, read the actual URL in the error before
changing anything: the expected string comes from the WHATWG encoding rule, not from app output.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Strip Playwright content and rebrand as Selenide

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Schema rules (`platform`, docs allowlist, name characters, filter clash)

**Files:**
- Create: `tests/helpers/schema.js`, `tests/schema-rules.spec.js`
- Modify: `tests/data-integrity.spec.js` (full rewrite)

**Interfaces:**
- Produces (`tests/helpers/schema.js`): `ITEM_FIELDS`, `LEVELS`, `PLATFORMS`, `QUICK_FILTERS`
  arrays and validators, each `(categories: Category[]) => string[]`:
  `categoryFieldProblems`, `missingFieldProblems`, `levelProblems`, `platformProblems`,
  `docsProblems`, `codeLengthProblems`, `duplicateNameProblems`, `colorProblems`,
  `filterClashProblems`, `nameCharProblems`, `dashProblems`.

- [ ] **Step 1: Write the validator tests against hand-written fixtures**

`tests/schema-rules.spec.js`:

```js
import { test, expect } from '@playwright/test';
import * as rules from './helpers/schema.js';

// Each validator is checked against a hand-written good and bad fixture. The
// expected problem strings are written out literally from the rule tables in
// the spec (section 4), so a validator that silently accepts bad data fails here.

const good = () => ({
  name: 'open()',
  level: 'beginner',
  platform: 'web',
  desc: 'Opens a page.',
  tip: 'Relative URLs use baseUrl.',
  docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html',
  code: 'open("/login"); // relative URL',
});
const cat = (items, over = {}) => [{ cat: 'Nav', cls: 'navigation', color: '#0ea5e9', items, ...over }];

test.describe('schema validators', () => {
  test('a fully valid category produces no problems from any rule', () => {
    const data = cat([good()]);
    for (const [name, rule] of Object.entries(rules)) {
      if (typeof rule !== 'function') continue;
      expect(rule(data), name).toEqual([]);
    }
  });

  test('missingFieldProblems reports a missing, an empty and a whitespace field', () => {
    const a = { ...good(), name: 'a()' };
    delete a.platform;
    const b = { ...good(), name: 'b()', tip: '' };
    const c = { ...good(), name: 'c()', desc: '   ' };
    expect(rules.missingFieldProblems(cat([a, b, c]))).toEqual([
      '"a()" in "Nav" is missing "platform"',
      '"b()" in "Nav" is missing "tip"',
      '"c()" in "Nav" has blank "desc"',
    ]);
  });

  test('levelProblems rejects a level outside the enum', () => {
    expect(rules.levelProblems(cat([{ ...good(), level: 'expert' }]))).toEqual([
      '"open()" has invalid level: "expert"',
    ]);
  });

  test('platformProblems rejects android, ios and a missing platform', () => {
    const items = [
      { ...good(), name: 'a()', platform: 'android' },
      { ...good(), name: 'b()', platform: 'ios' },
      { ...good(), name: 'c()', platform: undefined },
    ];
    expect(rules.platformProblems(cat(items))).toEqual([
      '"a()" has invalid platform: "android"',
      '"b()" has invalid platform: "ios"',
      '"c()" has invalid platform: "undefined"',
    ]);
  });

  test('docsProblems accepts the allowlist and rejects everything else', () => {
    const ok = [
      'https://selenide.org/documentation.html',
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#features',
      'https://github.com/selenide-examples/selenide-appium/blob/main/README.md',
    ];
    const bad = [
      'http://selenide.org/documentation.html', // not https
      'https://appium.io/docs/en/latest/', // host not approved
      'https://github.com/appium/java-client', // github org not approved
      'https://github.com/selenidex/fork', // prefix lookalike
      'https://www.selenide.org/', // subdomain not on the list
      'not a url',
    ];
    const items = [...ok, ...bad].map((docs, i) => ({ ...good(), name: `n${i}()`, docs }));
    expect(rules.docsProblems(cat(items))).toEqual([
      '"n4()" in "Nav" has a docs URL outside the allowlist: "http://selenide.org/documentation.html"',
      '"n5()" in "Nav" has a docs URL outside the allowlist: "https://appium.io/docs/en/latest/"',
      '"n6()" in "Nav" has a docs URL outside the allowlist: "https://github.com/appium/java-client"',
      '"n7()" in "Nav" has a docs URL outside the allowlist: "https://github.com/selenidex/fork"',
      '"n8()" in "Nav" has a docs URL outside the allowlist: "https://www.selenide.org/"',
      '"n9()" in "Nav" has an unparseable docs URL: "not a url"',
    ]);
  });

  test('codeLengthProblems rejects code under 20 characters after trimming', () => {
    expect(rules.codeLengthProblems(cat([{ ...good(), code: '   open("/");      ' }]))).toEqual([
      '"open()" has a suspiciously short code snippet: "open("/");"',
    ]);
  });

  test('duplicateNameProblems finds duplicates within and across categories', () => {
    const data = [
      { cat: 'A', cls: 'a', color: '#000000', items: [good(), good()] },
      { cat: 'B', cls: 'b', color: '#000000', items: [good()] },
    ];
    expect(rules.duplicateNameProblems(data)).toEqual([
      'Duplicate "open()" in category "A"',
      '"open()" appears in more than one category',
    ]);
  });

  test('colorProblems rejects 3-digit and named colors', () => {
    const data = [
      { cat: 'A', cls: 'a', color: '#fff', items: [good()] },
      { cat: 'B', cls: 'b', color: 'red', items: [{ ...good(), name: 'x()' }] },
    ];
    expect(rules.colorProblems(data)).toEqual([
      'Category "A" has invalid color: "#fff"',
      'Category "B" has invalid color: "red"',
    ]);
  });

  test('filterClashProblems rejects category names equal to a quick filter', () => {
    const data = ['All', 'beginner', 'Popular', 'MOBILE', 'Mobile Gestures'].map((c, i) => ({
      cat: c,
      cls: `c${i}`,
      color: '#000000',
      items: [{ ...good(), name: `n${i}()` }],
    }));
    expect(rules.filterClashProblems(data)).toEqual([
      'Category "All" clashes with the quick filter "all"',
      'Category "beginner" clashes with the quick filter "beginner"',
      'Category "Popular" clashes with the quick filter "popular"',
      'Category "MOBILE" clashes with the quick filter "mobile"',
    ]);
  });

  test('nameCharProblems rejects < and > in names', () => {
    const items = [
      { ...good(), name: 'Container<T>' },
      { ...good(), name: 'Container (generic)' },
    ];
    expect(rules.nameCharProblems(cat(items))).toEqual([
      '"Container<T>" in "Nav" contains "<" or ">" (names are rendered as HTML)',
    ]);
  });

  test('dashProblems finds em and en dashes in any field, including platform', () => {
    const items = [
      { ...good(), name: 'a()', tip: 'Fast — mostly.' },
      { ...good(), name: 'b()', desc: 'Codes 200–299.' },
      { ...good(), name: 'c()', platform: 'web—' },
    ];
    expect(rules.dashProblems(cat(items))).toEqual([
      '"a()" in "Nav" has an em-dash in "tip"',
      '"b()" in "Nav" has an en-dash in "desc"',
      '"c()" in "Nav" has an em-dash in "platform"',
    ]);
  });

  test('categoryFieldProblems reports missing cat/cls/color and empty items', () => {
    expect(rules.categoryFieldProblems([{ cat: '', cls: 'x', color: '#000000', items: [] }])).toEqual([
      'categories[0] missing "cat"',
      'categories[0] missing or empty "items"',
    ]);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/schema-rules.spec.js --project=chromium`
Expected: FAIL, `Cannot find module './helpers/schema.js'`.

- [ ] **Step 3: Write the validators**

`tests/helpers/schema.js`:

```js
// Pure validators for the js/data categories. Each takes the categories array
// and returns a list of human-readable problems (empty when valid). They are
// tested against hand-written fixtures in schema-rules.spec.js and applied to
// the real data in data-integrity.spec.js. Rules: spec section 4.

export const ITEM_FIELDS = ['name', 'level', 'platform', 'desc', 'tip', 'docs', 'code'];
export const LEVELS = ['beginner', 'intermediate', 'advanced'];
export const PLATFORMS = ['web', 'mobile', 'both'];
export const QUICK_FILTERS = ['all', 'beginner', 'popular', 'mobile'];

const eachItem = (categories, fn) =>
  categories.flatMap((cat) => cat.items.flatMap((item) => fn(item, cat)));

export function categoryFieldProblems(categories) {
  return categories.flatMap((cat, i) => {
    const problems = [];
    if (!cat.cat) problems.push(`categories[${i}] missing "cat"`);
    if (!cat.cls) problems.push(`categories[${i}] missing "cls"`);
    if (!cat.color) problems.push(`categories[${i}] missing "color"`);
    if (!Array.isArray(cat.items) || cat.items.length === 0)
      problems.push(`categories[${i}] missing or empty "items"`);
    return problems;
  });
}

export function missingFieldProblems(categories) {
  return eachItem(categories, (item, cat) =>
    ITEM_FIELDS.flatMap((field) => {
      const value = item[field];
      if (value === undefined || value === null || value === '')
        return [`"${item.name || '?'}" in "${cat.cat}" is missing "${field}"`];
      if (typeof value === 'string' && value.trim() === '')
        return [`"${item.name || '?'}" in "${cat.cat}" has blank "${field}"`];
      return [];
    })
  );
}

export function levelProblems(categories) {
  return eachItem(categories, (item) =>
    LEVELS.includes(item.level) ? [] : [`"${item.name}" has invalid level: "${item.level}"`]
  );
}

export function platformProblems(categories) {
  return eachItem(categories, (item) =>
    PLATFORMS.includes(item.platform)
      ? []
      : [`"${item.name}" has invalid platform: "${item.platform}"`]
  );
}

const DOCS_GITHUB_PATH = /^\/(selenide|selenide-examples)\//;

export function docsProblems(categories) {
  return eachItem(categories, (item, cat) => {
    let url;
    try {
      url = new URL(item.docs);
    } catch {
      return [`"${item.name}" in "${cat.cat}" has an unparseable docs URL: "${item.docs}"`];
    }
    const allowed =
      url.protocol === 'https:' &&
      (url.hostname === 'selenide.org' ||
        (url.hostname === 'github.com' && DOCS_GITHUB_PATH.test(url.pathname)));
    return allowed
      ? []
      : [`"${item.name}" in "${cat.cat}" has a docs URL outside the allowlist: "${item.docs}"`];
  });
}

export function codeLengthProblems(categories) {
  return eachItem(categories, (item) =>
    String(item.code ?? '').trim().length >= 20
      ? []
      : [`"${item.name}" has a suspiciously short code snippet: "${String(item.code).trim()}"`]
  );
}

export function duplicateNameProblems(categories) {
  const problems = [];
  categories.forEach((cat) => {
    const seen = new Set();
    cat.items.forEach((item) => {
      if (seen.has(item.name)) problems.push(`Duplicate "${item.name}" in category "${cat.cat}"`);
      seen.add(item.name);
    });
  });
  const owner = new Map();
  categories.forEach((cat) =>
    new Set(cat.items.map((i) => i.name)).forEach((name) => {
      if (owner.has(name) && owner.get(name) !== cat.cat)
        problems.push(`"${name}" appears in more than one category`);
      else owner.set(name, cat.cat);
    })
  );
  return problems;
}

export function colorProblems(categories) {
  return categories.flatMap((cat) =>
    /^#[0-9a-fA-F]{6}$/.test(cat.color)
      ? []
      : [`Category "${cat.cat}" has invalid color: "${cat.color}"`]
  );
}

export function filterClashProblems(categories) {
  return categories.flatMap((cat) => {
    const clash = QUICK_FILTERS.find((f) => f === String(cat.cat).toLowerCase());
    return clash ? [`Category "${cat.cat}" clashes with the quick filter "${clash}"`] : [];
  });
}

export function nameCharProblems(categories) {
  return eachItem(categories, (item, cat) =>
    /[<>]/.test(item.name)
      ? [`"${item.name}" in "${cat.cat}" contains "<" or ">" (names are rendered as HTML)`]
      : []
  );
}

export function dashProblems(categories) {
  return eachItem(categories, (item, cat) =>
    ITEM_FIELDS.flatMap((field) => {
      const value = item[field];
      if (typeof value !== 'string') return [];
      const found = [];
      if (value.includes('—')) found.push(`"${item.name}" in "${cat.cat}" has an em-dash in "${field}"`);
      if (value.includes('–')) found.push(`"${item.name}" in "${cat.cat}" has an en-dash in "${field}"`);
      return found;
    })
  );
}
```

- [ ] **Step 4: Run the validator tests**

Run: `npx playwright test tests/schema-rules.spec.js --project=chromium`
Expected: PASS (13 tests). If one fails, compare against the spec's rule table, not against
the validator's output.

- [ ] **Step 5: Rewrite `tests/data-integrity.spec.js` to apply every rule to the real data**

```js
import { test, expect } from '@playwright/test';
import * as rules from './helpers/schema.js';

// Applies every schema rule (tests/helpers/schema.js, spec section 4) to the
// real js/data categories, read from the page global. The rules themselves are
// proven against hand-written fixtures in schema-rules.spec.js.

test.describe('Data integrity', () => {
  let data;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    data = await page.evaluate(() => window.categories);
  });

  test('categories array is non-empty', () => {
    expect(data.length).toBeGreaterThan(0);
  });

  const checks = [
    ['every category has cat, cls, color and items', 'categoryFieldProblems'],
    ['every item has all seven fields, none blank', 'missingFieldProblems'],
    ['every level is beginner | intermediate | advanced', 'levelProblems'],
    ['every platform is web | mobile | both', 'platformProblems'],
    ['every docs URL is https and on the allowlist', 'docsProblems'],
    ['every code snippet is at least 20 characters', 'codeLengthProblems'],
    ['names are unique within and across categories', 'duplicateNameProblems'],
    ['every category color is a 6-digit hex', 'colorProblems'],
    ['no category name equals a quick filter', 'filterClashProblems'],
    ['no name contains < or >', 'nameCharProblems'],
    ['no field contains an em-dash or en-dash', 'dashProblems'],
  ];
  for (const [title, rule] of checks) {
    test(title, () => {
      expect(rules[rule](data)).toEqual([]);
    });
  }
});
```

- [ ] **Step 6: Run the full gates**

Run: `npm run format && npm run lint && npm run format:check && npm test`
Expected: PASS. The four placeholder entries already carry `platform`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add platform field, docs allowlist and name rules to the schema

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Java, shell and XML highlighting with routing

**Files:**
- Modify: `js/highlight.js` (full rewrite), `js/app.js:1-16` and `openModal()`, `tests/highlight.spec.js` (full rewrite)

**Interfaces:**
- Produces (`js/highlight.js`): `highlight(code: string): string` (Java),
  `highlightShell(code: string): string`, `highlightXml(code: string): string`,
  `pickHighlighter(item: {cls: string, code: string}): 'shell' | 'xml' | 'java'`,
  `highlightFor(item): string`.
- Produces (`window`): `highlight`, `highlightShell`, `highlightXml`, `pickHighlighter`, `highlightFor`.
- `pickHighlighter` lives in `highlight.js` so it can be tested without the app's side
  effects (spec section 7).

Expected HTML in Step 1 is derived by hand from the token rules in spec section 7:
`escapeHtml` escapes only `&`, `<`, `>`; quotes stay literal.

- [ ] **Step 1: Write the failing tests**

`tests/highlight.spec.js`:

```js
import { test, expect } from '@playwright/test';

// Expected HTML is written by hand from the token rules in the spec (section 7).
// Never regenerate these strings by running the highlighter.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const java = (page, code) => page.evaluate((c) => window.highlight(c), code);
const shell = (page, code) => page.evaluate((c) => window.highlightShell(c), code);
const xml = (page, code) => page.evaluate((c) => window.highlightXml(c), code);

test.describe('highlight() for Java', () => {
  test('$ and $$ are API tokens, methods before ( are fn, strings are strings', async ({ page }) => {
    expect(await java(page, '$("#id").shouldHave(text("Hi"));')).toBe(
      '<span class="tok-api">$</span>(<span class="tok-string">"#id"</span>).' +
        '<span class="tok-fn">shouldHave</span>(<span class="tok-fn">text</span>(' +
        '<span class="tok-string">"Hi"</span>));'
    );
    expect(await java(page, '$$(".row").shouldHave(size(3));')).toBe(
      '<span class="tok-api">$$</span>(<span class="tok-string">".row"</span>).' +
        '<span class="tok-fn">shouldHave</span>(<span class="tok-fn">size</span>(' +
        '<span class="tok-number">3</span>));'
    );
  });

  test('an API name followed by ( stays an API token', async ({ page }) => {
    expect(await java(page, 'open("/login");')).toBe(
      '<span class="tok-api">open</span>(<span class="tok-string">"/login"</span>);'
    );
  });

  test('annotations are keywords', async ({ page }) => {
    expect(await java(page, '@Test\nvoid login() {}')).toBe(
      '<span class="tok-keyword">@Test</span>\n<span class="tok-keyword">void</span> ' +
        '<span class="tok-fn">login</span>() {}'
    );
  });

  test('a text block is one string, even with quotes and // inside', async ({ page }) => {
    const code = 'String json = """\n  {"a": "//b"}\n  """;';
    expect(await java(page, code)).toBe(
      'String json = <span class="tok-string">"""\n  {"a": "//b"}\n  """</span>;'
    );
  });

  test('// inside a string is not a comment; a trailing // is', async ({ page }) => {
    expect(await java(page, 'open("https://example.com"); // go')).toBe(
      '<span class="tok-api">open</span>(<span class="tok-string">"https://example.com"</span>); ' +
        '<span class="tok-comment">// go</span>'
    );
  });

  test('escaped quotes and a trailing escaped backslash stay inside the string', async ({
    page,
  }) => {
    const code = String.raw`String s = "say \"hi\" \\";`;
    expect(await java(page, code)).toBe(
      String.raw`String s = <span class="tok-string">"say \"hi\" \\"</span>;`
    );
  });

  test('char literals are strings', async ({ page }) => {
    expect(await java(page, "char c = 'a';")).toBe(
      '<span class="tok-keyword">char</span> c = <span class="tok-string">\'a\'</span>;'
    );
  });

  test('long, underscore, hex, float and exponent numbers', async ({ page }) => {
    const code = 'long t = 10L; int n = 1_000; int h = 0xFF; float f = 1.5f; double e = 2e3;';
    expect(await java(page, code)).toBe(
      '<span class="tok-keyword">long</span> t = <span class="tok-number">10L</span>; ' +
        '<span class="tok-keyword">int</span> n = <span class="tok-number">1_000</span>; ' +
        '<span class="tok-keyword">int</span> h = <span class="tok-number">0xFF</span>; ' +
        '<span class="tok-keyword">float</span> f = <span class="tok-number">1.5f</span>; ' +
        '<span class="tok-keyword">double</span> e = <span class="tok-number">2e3</span>;'
    );
  });

  test('generics are escaped and an identifier before < is plain', async ({ page }) => {
    expect(await java(page, 'List<SelenideElement> rows = new ArrayList<>();')).toBe(
      'List&lt;<span class="tok-api">SelenideElement</span>&gt; rows = ' +
        '<span class="tok-keyword">new</span> ArrayList&lt;&gt;();'
    );
  });

  test('modern Java keywords: record, sealed, permits, non-sealed', async ({ page }) => {
    expect(await java(page, 'record Point(int x) {}')).toBe(
      '<span class="tok-keyword">record</span> <span class="tok-fn">Point</span>(' +
        '<span class="tok-keyword">int</span> x) {}'
    );
    expect(await java(page, 'sealed interface Shape permits Sq {}')).toBe(
      '<span class="tok-keyword">sealed</span> <span class="tok-keyword">interface</span> Shape ' +
        '<span class="tok-keyword">permits</span> Sq {}'
    );
    expect(await java(page, 'non-sealed class Sq {}')).toBe(
      '<span class="tok-keyword">non-sealed</span> <span class="tok-keyword">class</span> Sq {}'
    );
  });

  test('JavaScript-only words are plain in Java', async ({ page }) => {
    expect(await java(page, 'let await function')).toBe('let await function');
  });

  test('block and Javadoc comments', async ({ page }) => {
    expect(await java(page, '/** Docs */ int a;')).toBe(
      '<span class="tok-comment">/** Docs */</span> <span class="tok-keyword">int</span> a;'
    );
  });

  test('escapes HTML so snippets cannot inject markup', async ({ page }) => {
    expect(await java(page, 'if (a < b && c > d) {}')).toBe(
      '<span class="tok-keyword">if</span> (a &lt; b &amp;&amp; c &gt; d) {}'
    );
  });

  test('is deterministic across repeated calls (regex lastIndex reset)', async ({ page }) => {
    const [a, b] = await page.evaluate(() => {
      const c = 'open("/x");';
      return [window.highlight(c), window.highlight(c)];
    });
    expect(a).toBe(b);
  });
});

test.describe('highlightShell()', () => {
  test('./gradlew is a program, --tests a flag, the quoted name a string', async ({ page }) => {
    expect(await shell(page, './gradlew test --tests "LoginTest"')).toBe(
      '<span class="tok-api">./gradlew</span> test <span class="tok-keyword">--tests</span> ' +
        '<span class="tok-string">"LoginTest"</span>'
    );
  });

  test('a -D system property flag includes its dotted name', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dselenide.browser=firefox')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dselenide.browser</span>=firefox'
    );
  });

  test('# glued to a word is not a comment (mvn -Dtest=Class#method)', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dtest=LoginTest#login')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dtest</span>=LoginTest#login'
    );
  });

  test('# at line start is a comment, key=value lines stay plain', async ({ page }) => {
    expect(await shell(page, '# selenide.properties\nselenide.browser=chrome')).toBe(
      '<span class="tok-comment"># selenide.properties</span>\nselenide.browser=chrome'
    );
  });

  test('// in a URL is not a comment', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dselenide.baseUrl=https://example.com')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dselenide.baseUrl</span>=https://example.com'
    );
  });
});

test.describe('highlightXml()', () => {
  test('tags are keywords, text is plain', async ({ page }) => {
    expect(await xml(page, '<dependency>\n  <groupId>com.codeborne</groupId>\n</dependency>')).toBe(
      '&lt;<span class="tok-keyword">dependency</span>&gt;\n' +
        '  &lt;<span class="tok-keyword">groupId</span>&gt;com.codeborne&lt;/' +
        '<span class="tok-keyword">groupId</span>&gt;\n&lt;/<span class="tok-keyword">dependency</span>&gt;'
    );
  });

  test('${property} references are API tokens', async ({ page }) => {
    expect(await xml(page, '<version>${selenide.version}</version>')).toBe(
      '&lt;<span class="tok-keyword">version</span>&gt;<span class="tok-api">${selenide.version}</span>' +
        '&lt;/<span class="tok-keyword">version</span>&gt;'
    );
  });

  test('attribute names are fn, values are strings, apostrophes in text are plain', async ({
    page,
  }) => {
    expect(await xml(page, '<plugin id="x"/>')).toBe(
      '&lt;<span class="tok-keyword">plugin</span> <span class="tok-fn">id</span>=' +
        '<span class="tok-string">"x"</span>/&gt;'
    );
    expect(await xml(page, "<name>Nigel's tests</name>")).toBe(
      "&lt;<span class=\"tok-keyword\">name</span>&gt;Nigel's tests&lt;/" +
        '<span class="tok-keyword">name</span>&gt;'
    );
  });

  test('comments', async ({ page }) => {
    expect(await xml(page, '<!-- test scope -->')).toBe(
      '<span class="tok-comment">&lt;!-- test scope --&gt;</span>'
    );
  });
});

test.describe('pickHighlighter()', () => {
  const cases = [
    [{ cls: 'cli', code: 'selenide.browser=chrome' }, 'shell'],
    [{ cls: 'config', code: 'mvn test' }, 'shell'],
    [{ cls: 'config', code: './gradlew test' }, 'shell'],
    [{ cls: 'config', code: '  # selenide.properties\nselenide.timeout=6000' }, 'shell'],
    [{ cls: 'config', code: 'emulator -avd Pixel_4' }, 'shell'],
    [{ cls: 'config', code: '<dependency/>' }, 'xml'],
    [{ cls: 'config', code: '\n<project>' }, 'xml'],
    [{ cls: 'config', code: '$("#a").click();' }, 'java'],
    [{ cls: 'config', code: 'mvnHelper();' }, 'java'],
    [{ cls: 'config', code: 'gradleTask.run();' }, 'java'],
  ];
  for (const [item, expected] of cases) {
    test(`${JSON.stringify(item.code)} in "${item.cls}" uses ${expected}`, async ({ page }) => {
      expect(await page.evaluate((i) => window.pickHighlighter(i), item)).toBe(expected);
    });
  }
});

test.describe('round-trip over every entry', () => {
  test('stripping the highlighting gives back each item.code exactly (Copy invariant)', async ({
    page,
  }) => {
    const mismatches = await page.evaluate(() =>
      window.categories.flatMap((c) =>
        c.items
          .filter((item) => {
            const div = document.createElement('div');
            div.innerHTML = window.highlightFor({ ...item, cls: c.cls });
            return div.textContent !== item.code;
          })
          .map((item) => item.name)
      )
    );
    expect(mismatches).toEqual([]);
  });

  test('the modal shows the highlighted snippet with token spans', async ({ page }) => {
    await page.locator('.tile', { hasText: 'shouldHave(text())' }).click();
    await expect(page.locator('#m-code .tok-api').first()).toHaveText('$');
    await expect(page.locator('#m-code .tok-fn').first()).toHaveText('shouldHave');
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx playwright test tests/highlight.spec.js --project=chromium`
Expected: FAIL. Java cases fail on JS keyword rules (for example `let` coloured), and
`window.highlightXml`, `window.pickHighlighter`, `window.highlightFor` are not functions.

- [ ] **Step 3: Rewrite `js/highlight.js`**

```js
// =============================================================
// highlight.js — tiny dependency-free highlighter for code snippets.
// Returns HTML-escaped markup with <span class="tok-*"> wrappers.
// Single pass per language: text between matched tokens is escaped and
// emitted plain, so every character is escaped exactly once and the
// rendered textContent equals the source (Copy stays exact).
// highlight()      — Java snippets (also fine for Gradle Kotlin DSL)
// highlightShell() — mvn / gradle / shell snippets
// highlightXml()   — pom.xml snippets
// pickHighlighter() / highlightFor() — choose one for a cheat sheet item
// =============================================================

const KEYWORDS = new Set([
  'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
  'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final',
  'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
  'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public',
  'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this',
  'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while', 'var', 'record',
  'sealed', 'non-sealed', 'permits', 'yield', 'true', 'false', 'null',
]);

// Selenide / selenide-appium identifiers worth colouring. Unknown names render
// plain, which is graceful: add names here as content needs them.
const APIS = new Set([
  '$', '$$', '$x', 'open', 'Configuration', 'Condition', 'CollectionCondition',
  'Selenide', 'SelenideElement', 'ElementsCollection', 'WebDriverRunner', 'SelenideConfig',
  'SelenideDriver', 'Selectors', 'ClickOptions', 'DragAndDropOptions', 'FileDownloadMode',
  'WebDriverProvider', 'SelenideAppium', 'SelenideAppiumElement', 'SelenideAppiumCollection',
  'AppiumBy', 'CombinedBy', 'AppiumSelectors', 'AppiumClickOptions', 'AppiumScrollOptions',
  'AppiumSwipeOptions', 'AppiumCondition', 'AppiumCollectionCondition',
]);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const span = (cls, text) => `<span class="${cls}">${escapeHtml(text)}</span>`;

// Ordered alternatives: comment | string (text block first) | annotation | number | identifier
const JAVA_TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])+')|(@[A-Za-z_]\w*)|(\b0[xX][0-9a-fA-F_]+[lL]?\b|\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?[lLfFdD]?\b)|(non-sealed(?![\w$])|[A-Za-z_$][\w$]*)/g;

export function highlight(code) {
  let out = '';
  let last = 0;
  let m;
  JAVA_TOKEN_RE.lastIndex = 0;
  while ((m = JAVA_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, string, annotation, number, ident] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (string !== undefined) out += span('tok-string', string);
    else if (annotation !== undefined) out += span('tok-keyword', annotation);
    else if (number !== undefined) out += span('tok-number', number);
    else {
      let cls = null;
      if (KEYWORDS.has(ident)) cls = 'tok-keyword';
      else if (APIS.has(ident)) cls = 'tok-api';
      else if (code[JAVA_TOKEN_RE.lastIndex] === '(') cls = 'tok-fn';
      out += cls ? span(cls, ident) : escapeHtml(ident);
    }
    last = JAVA_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

// Programs that lead a CLI command — coloured like APIs.
const SHELL_PROGRAMS = new Set(['mvn', 'gradle', 'gradlew', 'java', 'emulator', 'npm', 'npx', 'git']);

// '#' starts a comment only at line start or after whitespace, so
// -Dtest=LoginTest#login stays plain. '//' is never a comment (URLs).
// Flags may contain dots: -Dselenide.browser.
// Ordered alternatives: comment | string | flag | ./gradlew | number | identifier
const SHELL_TOKEN_RE =
  /((?<!\S)#[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|((?<![\w-])--?[A-Za-z][\w.-]*)|((?<![\w./])\.\/gradlew\b)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

export function highlightShell(code) {
  let out = '';
  let last = 0;
  let m;
  SHELL_TOKEN_RE.lastIndex = 0;
  while ((m = SHELL_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, string, flag, gradlew, number, ident] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (string !== undefined) out += span('tok-string', string);
    else if (flag !== undefined) out += span('tok-keyword', flag);
    else if (gradlew !== undefined) out += span('tok-api', gradlew);
    else if (number !== undefined) out += span('tok-number', number);
    else out += SHELL_PROGRAMS.has(ident) ? span('tok-api', ident) : escapeHtml(ident);
    last = SHELL_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

// Ordered alternatives: comment | tag open (< or </) + name | attribute name (before =)
// | attribute value (after =) | ${property}. Text content stays plain, so an
// apostrophe in text never pairs up into a string.
const XML_TOKEN_RE =
  /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z_][\w:.-]*)|([A-Za-z_][\w:.-]*)(?==)|((?<==)(?:"[^"]*"|'[^']*'))|(\$\{[^}\n]*\})/g;

export function highlightXml(code) {
  let out = '';
  let last = 0;
  let m;
  XML_TOKEN_RE.lastIndex = 0;
  while ((m = XML_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, tagOpen, tagName, attr, value, prop] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (tagOpen !== undefined) out += escapeHtml(tagOpen) + span('tok-keyword', tagName);
    else if (attr !== undefined) out += span('tok-fn', attr);
    else if (value !== undefined) out += span('tok-string', value);
    else out += span('tok-api', prop);
    last = XML_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

const SHELL_START = /^\s*(?:(?:mvn|gradle|\.\/gradlew|emulator|npm|npx)\s|#)/;

export function pickHighlighter(item) {
  if (item.cls === 'cli' || SHELL_START.test(item.code)) return 'shell';
  if (/^\s*</.test(item.code)) return 'xml';
  return 'java';
}

const BY_NAME = { shell: highlightShell, xml: highlightXml, java: highlight };

export function highlightFor(item) {
  return BY_NAME[pickHighlighter(item)](item.code);
}
```

Prettier will reflow the keyword arrays one per line; that is fine.

- [ ] **Step 4: Wire it into `js/app.js`**

Replace the import and window exposure block at the top:

```js
import { categories } from './data/index.js';
import {
  highlight,
  highlightShell,
  highlightXml,
  pickHighlighter,
  highlightFor,
} from './highlight.js';
import * as popularCmds from './popular-commands.js';

// Expose as a global so data-integrity tests can access it via page.evaluate()
window.categories = categories;
// Expose for tests via page.evaluate() (same rationale as window.categories)
window.highlight = highlight;
window.highlightShell = highlightShell;
window.highlightXml = highlightXml;
window.pickHighlighter = pickHighlighter;
window.highlightFor = highlightFor;
```

In `openModal()` replace the `isShell` lines and the `m-code` assignment with:

```js
  // Java, shell or XML, chosen from the category and the snippet's first line
  document.getElementById('m-code').innerHTML = highlightFor(item);
```

- [ ] **Step 5: Run the highlighter tests**

Run: `npx playwright test tests/highlight.spec.js --project=chromium`
Expected: PASS. A failing case means either the regex or the hand-written expectation is
wrong: re-derive the expectation from the token rules before touching the code.

- [ ] **Step 6: Run the full gates**

Run: `npm run format && npm run lint && npm run format:check && npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Highlight Java, shell and XML snippets and route by snippet

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Mobile filter, versions.json meta bar, gradients

**Files:**
- Create: `js/versions.json`
- Modify: `js/app.js` (`getItems`, `buildFilters`, `initMetaBar`), `index.html` (version badge), `style.css:98-113`, `tests/cheatsheet.spec.js`, `tests/meta-bar.spec.js`

**Interfaces:**
- Consumes: `useFixtureData`, `FIXTURE_CATEGORIES` (Task 1).
- Produces: quick filter value `mobile`; element `#selenide-version`; CSS classes for all 21 `cls` values.

- [ ] **Step 1: Write the failing UI tests**

Append to `tests/cheatsheet.spec.js`:

```js
/* ── MOBILE FILTER (fixture data, hand-written expectations) ─────── */
test.describe('Mobile filter', () => {
  test.beforeEach(async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
  });

  test('sits after Start Here and shows only mobile and both items', async ({ page }) => {
    const labels = await page.locator('.filter-btn').allInnerTexts();
    // Popular is hidden while analytics are off (Task 1 Step 7b); Task 8 re-adds it here.
    expect(labels.slice(0, 3)).toEqual(['All', '⭐ Start Here', '📱 Mobile']);

    await page.locator('.filter-btn[data-filter="mobile"]').click();
    await expect(page.locator('.tile-name')).toHaveText(['gamma()', 'delta()', 'epsilon()']);
    await expect(page).toHaveURL(/#filter=mobile$/);
  });

  test('#filter=mobile in the URL applies it on load', async ({ page }) => {
    await page.goto('about:blank'); // force a fresh document load from the hash
    await page.goto('/#filter=mobile');
    await expect(page.locator('.filter-btn[data-filter="mobile"]')).toHaveClass(/active/);
    await expect(page.locator('.tile-name')).toHaveText(['gamma()', 'delta()', 'epsilon()']);
  });

  test('search narrows the Mobile filter', async ({ page }) => {
    await page.goto('/#filter=mobile&search=tap');
    await expect(page.locator('.tile-name')).toHaveText(['delta()']);
  });

  test('grouped view under Mobile shows only categories with such items', async ({ page }) => {
    await page.goto('/#filter=mobile');
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.group-header')).toHaveText(['Conditions (1)', 'Mobile Selectors (2)']);
  });
});

test.describe('Search with Selenide symbols (fixture data)', () => {
  test('$$ matches only snippets containing $$', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/'); // full load so the fixture replaces the real data
    await page.locator('#search-input').fill('$$');
    await expect(page.locator('.tile-name')).toHaveText(['gamma()']);
    await expect(page).toHaveURL(/#search=%24%24$/);
  });
});

/* ── TILE GRADIENTS (expected values from the spec, section 6) ──── */
test.describe('Tile gradients', () => {
  // [cls, gradient start, gradient end], hand-copied from the spec's palette
  const PALETTE = [
    ['config', '#06b6d4', '#0e7490'],
    ['navigation', '#0ea5e9', '#0369a1'],
    ['selector', '#3b82f6', '#1d4ed8'],
    ['action', '#22c55e', '#15803d'],
    ['condition', '#f97316', '#c2410c'],
    ['collection', '#eab308', '#a16207'],
    ['wait', '#64748b', '#334155'],
    ['page-object', '#f43f5e', '#be123c'],
    ['window', '#10b981', '#047857'],
    ['file', '#84cc16', '#4d7c0f'],
    ['network', '#14b8a6', '#0f766e'],
    ['javascript', '#f59e0b', '#b45309'],
    ['report', '#ef4444', '#b91c1c'],
    ['framework', '#a8a29e', '#57534e'],
    ['remote', '#0891b2', '#164e63'],
    ['pattern', '#fb7185', '#e11d48'],
    ['cli', '#fbbf24', '#d97706'],
    ['appium-setup', '#8b5cf6', '#1e1b4b'],
    ['mobile-selector', '#a855f7', '#1e1b4b'],
    ['mobile-gesture', '#c026d3', '#1e1b4b'],
    ['mobile-context', '#db2777', '#1e1b4b'],
  ];
  const rgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
  };

  test('every category class renders its two-stop gradient', async ({ page }) => {
    const actual = await page.evaluate(
      (classes) =>
        classes.map((cls) => {
          const el = document.createElement('div');
          el.className = `tile ${cls}`;
          document.body.appendChild(el);
          const bg = getComputedStyle(el).backgroundImage;
          el.remove();
          return bg;
        }),
      PALETTE.map(([cls]) => cls)
    );
    expect(actual).toEqual(
      PALETTE.map(([, a, b]) => `linear-gradient(135deg, ${rgb(a)}, ${rgb(b)})`)
    );
  });

  test("every data category's color is its gradient start", async ({ page }) => {
    const cats = await page.evaluate(() => window.categories.map((c) => [c.cls, c.color]));
    const start = Object.fromEntries(PALETTE.map(([cls, a]) => [cls, a]));
    for (const [cls, color] of cats) expect(color.toLowerCase(), cls).toBe(start[cls]);
  });
});
```

Replace the meta-bar tests that read `package.json` in `tests/meta-bar.spec.js`:

```js
  test('renders all four badges with their labels', async ({ page }) => {
    await mockBackends(page);
    await page.goto('/');

    await expect(page.locator('.meta-badge')).toHaveCount(4);
    const labels = await page.locator('.meta-badge .k').allInnerTexts();
    expect(labels).toEqual(['selenide', 'last updated', 'commands', 'visitors']);
  });

  test('version badge is populated from js/versions.json', async ({ page }) => {
    await page.route('**/js/versions.json**', (route) =>
      route.fulfill({
        status: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ selenide: '9.9.9', selenideAppium: '9.9.9', appiumJavaClient: '1.0.0' }),
      })
    );
    await mockBackends(page);
    await page.goto('/');
    await expect(page.locator('#selenide-version')).toHaveText('v9.9.9');
  });

  test('js/versions.json pins the release this cheat sheet was verified against', async ({
    page,
  }) => {
    await mockBackends(page);
    await page.goto('/');
    // Bumped deliberately by the selenide-release-sync skill, together with the content.
    const versions = await page.evaluate(async () => (await fetch('./js/versions.json')).json());
    expect(versions).toEqual({
      selenide: '7.19.0',
      selenideAppium: '7.19.0',
      appiumJavaClient: '11.0.0',
    });
  });
```

and in `keeps fallback values if version/date lookups fail` replace the `package.json` route
with `await page.route('**/js/versions.json**', (route) => route.abort());` and assert
`await expect(page.locator('#selenide-version')).toHaveText('v7.19.0');` (the spec's HTML
fallback value) instead of `not.toBeEmpty()` for the version. Delete `version badge is
populated from package.json`.

- [ ] **Step 2: Run them to see them fail**

Run: `npx playwright test tests/cheatsheet.spec.js tests/meta-bar.spec.js --project=chromium`
Expected: FAIL. No `📱 Mobile` button, `#selenide-version` missing, `js/versions.json` 404,
most gradient classes have `none` as background.

- [ ] **Step 3: Implement**

`js/versions.json`:

```json
{
  "selenide": "7.19.0",
  "selenideAppium": "7.19.0",
  "appiumJavaClient": "11.0.0"
}
```

`index.html`, first meta badge:

```html
  <span class="meta-badge"><span class="k">selenide</span><span class="v" style="background:#22c55e" id="selenide-version">v7.19.0</span></span>
```

`js/app.js` `getItems()`, after the `popular` branch:

```js
  } else if (activeFilter === 'mobile') {
    items = items.filter((i) => i.platform === 'mobile' || i.platform === 'both');
```

`buildFilters()` defs, after Popular:

```js
    { label: '📱 Mobile', filter: 'mobile', color: null },
```

`initMetaBar()`: replace the `package.json` fetch block and its comment with:

```js
  // Selenide version — js/versions.json is the single pinned source of truth,
  // bumped by the selenide-release-sync skill together with the content.
  fetch('./js/versions.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((versions) => {
      if (!versions?.selenide) return;
      const el = document.getElementById('selenide-version');
      if (el) el.textContent = 'v' + versions.selenide;
    })
    .catch(() => {});
```

and update the section comment above `initMetaBar` to say "the Selenide version".

`style.css`: replace lines 98 to 113 (the category gradient block) with:

```css
/* Web categories: same-hue gradients, hues outside violet/magenta */
.config      { background: linear-gradient(135deg, #06b6d4, #0e7490); }
.navigation  { background: linear-gradient(135deg, #0ea5e9, #0369a1); }
.selector    { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.action      { background: linear-gradient(135deg, #22c55e, #15803d); }
.condition   { background: linear-gradient(135deg, #f97316, #c2410c); }
.collection  { background: linear-gradient(135deg, #eab308, #a16207); }
.wait        { background: linear-gradient(135deg, #64748b, #334155); }
.page-object { background: linear-gradient(135deg, #f43f5e, #be123c); }
.window      { background: linear-gradient(135deg, #10b981, #047857); }
.file        { background: linear-gradient(135deg, #84cc16, #4d7c0f); }
.network     { background: linear-gradient(135deg, #14b8a6, #0f766e); }
.javascript  { background: linear-gradient(135deg, #f59e0b, #b45309); }
.report      { background: linear-gradient(135deg, #ef4444, #b91c1c); }
.framework   { background: linear-gradient(135deg, #a8a29e, #57534e); }
.remote      { background: linear-gradient(135deg, #0891b2, #164e63); }
.pattern     { background: linear-gradient(135deg, #fb7185, #e11d48); }
.cli         { background: linear-gradient(135deg, #fbbf24, #d97706); }
/* Mobile (selenide-appium) categories: violet/magenta starts, one shared deep indigo end */
.appium-setup    { background: linear-gradient(135deg, #8b5cf6, #1e1b4b); }
.mobile-selector { background: linear-gradient(135deg, #a855f7, #1e1b4b); }
.mobile-gesture  { background: linear-gradient(135deg, #c026d3, #1e1b4b); }
.mobile-context  { background: linear-gradient(135deg, #db2777, #1e1b4b); }
```

- [ ] **Step 4: Run the tests**

Run: `npx playwright test tests/cheatsheet.spec.js tests/meta-bar.spec.js --project=chromium`
Expected: PASS.

- [ ] **Step 5: Look at it**

Run `npx serve -l 3000 .`, open `http://localhost:3000/#filter=all`, switch to Grouped, and
check the header logo, the version badge and the three tile gradients. Stop the server.

- [ ] **Step 6: Run the full gates and commit**

Run: `npm run format && npm run lint && npm run format:check && npm test`
Expected: PASS.

```bash
git add -A
git commit -m "Add Mobile filter, versions.json meta bar and category gradients

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Source fetching (`fetch-sources.mjs`)

**Files:**
- Create: `.claude/skills/selenide-release-sync/scripts/fetch-sources.mjs`
- Modify: `.gitignore`, `package.json` (scripts)

**Interfaces:**
- Consumes: `js/versions.json`.
- Produces: `.cache/sources/<artifact>-<version>/` trees, e.g.
  `.cache/sources/selenide-core-7.19.0/com/codeborne/selenide/Condition.java`; npm script `fetch:sources`.

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// Downloads the -sources.jar of every pinned Selenide module (and Appium's
// java-client) from Maven Central and unzips each into .cache/sources/, so
// cheat sheet entries can be verified against what actually shipped:
//   grep -rn "visibleText" .cache/sources/
// selenide-proxy's published sources jar is a stub (DummyProxy.java only), so
// its real source is fetched from modules/proxy at the release tag on
// github.com/selenide/selenide.
//
// Usage (from the repo root): node .claude/skills/selenide-release-sync/scripts/fetch-sources.mjs
// Idempotent: a module whose folder has a .complete marker is skipped.
// Exit 0 on success, 2 when Maven Central or GitHub could not be reached.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const versions = JSON.parse(readFileSync('js/versions.json', 'utf8'));
const CACHE = '.cache/sources';
const MAVEN = 'https://repo1.maven.org/maven2';

const SELENIDE_MODULES = [
  'selenide',
  'selenide-core',
  'selenide-grid',
  'selenide-selenoid',
  'selenide-moon',
  'selenide-testng',
  'selenide-junit4',
  'selenide-video-recorder',
  'selenide-full-screenshot',
  'selenide-clear-with-shortcut',
];
const JARS = [
  ...SELENIDE_MODULES.map((artifact) => ({ group: 'com/codeborne', artifact, version: versions.selenide })),
  { group: 'com/codeborne', artifact: 'selenide-appium', version: versions.selenideAppium },
  { group: 'io/appium', artifact: 'java-client', version: versions.appiumJavaClient },
];

async function get(url, as) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return as === 'json' ? res.json() : as === 'text' ? res.text() : Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt >= 3) throw err;
    }
  }
}

async function fetchJar({ group, artifact, version }) {
  const dest = path.join(CACHE, `${artifact}-${version}`);
  if (existsSync(path.join(dest, '.complete'))) return `${artifact}-${version} (cached)`;
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  const jar = path.join(CACHE, `${artifact}-${version}-sources.jar`);
  writeFileSync(jar, await get(`${MAVEN}/${group}/${artifact}/${version}/${artifact}-${version}-sources.jar`));
  execFileSync('unzip', ['-qo', jar, '-d', dest]);
  rmSync(jar);
  writeFileSync(path.join(dest, '.complete'), '');
  return `${artifact}-${version}`;
}

async function fetchProxyFromTag(version) {
  const dest = path.join(CACHE, `selenide-proxy-${version}`);
  if (existsSync(path.join(dest, '.complete'))) return `selenide-proxy-${version} (cached)`;
  rmSync(dest, { recursive: true, force: true });
  const tag = `v${version}`;
  const tree = await get(`https://api.github.com/repos/selenide/selenide/git/trees/${tag}?recursive=1`, 'json');
  if (tree.truncated) throw new Error(`GitHub tree for ${tag} is truncated`);
  const prefix = 'modules/proxy/src/main/java/';
  const files = tree.tree.filter((e) => e.type === 'blob' && e.path.startsWith(prefix));
  if (!files.length) throw new Error(`No files under ${prefix} at ${tag}`);
  for (const f of files) {
    const out = path.join(dest, f.path.slice(prefix.length));
    mkdirSync(path.dirname(out), { recursive: true });
    writeFileSync(out, await get(`https://raw.githubusercontent.com/selenide/selenide/${tag}/${f.path}`, 'text'));
  }
  writeFileSync(path.join(dest, '.complete'), '');
  return `selenide-proxy-${version} (from tag ${tag}, ${files.length} files)`;
}

try {
  mkdirSync(CACHE, { recursive: true });
  for (const jar of JARS) console.log('ok', await fetchJar(jar));
  console.log('ok', await fetchProxyFromTag(versions.selenide));
} catch (err) {
  console.error('Could not fetch sources:', err.message);
  process.exit(2);
}
```

- [ ] **Step 2: Wire it up**

`.gitignore`: add a line `.cache/`.
`package.json` scripts: add `"fetch:sources": "node .claude/skills/selenide-release-sync/scripts/fetch-sources.mjs"`.

- [ ] **Step 3: Run it and check what shipped is there**

Run: `npm run fetch:sources`
Expected: 13 `ok` lines. Then each of these must print a match (they are the facts the
placeholders and the spec rely on):

```bash
grep -n "public static WebElementCondition visibleText" .cache/sources/selenide-core-7.19.0/com/codeborne/selenide/Condition.java
grep -n "public static long timeout" .cache/sources/selenide-7.19.0/com/codeborne/selenide/Configuration.java
grep -n "withTagAndContentDescription" .cache/sources/selenide-appium-7.19.0/com/codeborne/selenide/appium/AppiumSelectors.java
ls .cache/sources/selenide-proxy-7.19.0/com/codeborne/selenide/proxy/ | head
ls .cache/sources/java-client-11.0.0/io/appium/java_client/AppiumBy.java
```

Run it a second time: every line ends `(cached)`.

- [ ] **Step 4: Gates and commit**

Run: `npm run format && npm run lint && npm run format:check && npm test`
Expected: PASS. Scripts are outside `js/` and `tests/`, so `lint`/`format` skip them: also run
`npx prettier --write .claude/skills/selenide-release-sync/scripts/` and then
`npx prettier --check .claude/skills/selenide-release-sync/scripts/` (same in Tasks 6 and 9).

```bash
git add -A
git commit -m "Add fetch-sources script for verifying entries against shipped jars

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Docs link checker with exact anchors

**Files:**
- Create: `.claude/skills/selenide-release-sync/scripts/lib/anchors.mjs`, `.claude/skills/selenide-release-sync/scripts/lib/anchors.test.mjs`, `.claude/skills/selenide-release-sync/scripts/check-docs-links.mjs`
- Modify: `package.json` (scripts), `.github/workflows/test.yml`
- Delete: `.claude/skills/playwright-release-sync/scripts/check-docs-links.mjs` (the rest of that folder goes in Task 9)

**Interfaces:**
- Produces: `decodeAnchor(hash: string): string`, `hasAnchor(html: string, anchor: string, { github?: boolean }): boolean`; npm scripts `check:links` (supports `-- --only=<Cat>,<Cat>`) and `test:scripts`.

The two id formats below were observed on the live pages during planning:
Javadoc writes `id="shouldHave(com.codeborne.selenide.WebElementCondition...)"`; a GitHub
blob page embeds the rendered README in JSON as `id=\"user-content-features\"`.

- [ ] **Step 1: Write the failing unit tests**

`.claude/skills/selenide-release-sync/scripts/lib/anchors.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeAnchor, hasAnchor } from './anchors.mjs';

const JAVADOC =
  '<section class="detail" id="shouldHave(com.codeborne.selenide.WebElementCondition...)">' +
  '<section class="detail" id="shouldHave(com.codeborne.selenide.WebElementCondition,java.time.Duration)">' +
  '<section class="detail" id="textCaseSensitive(java.lang.String)">';
const GITHUB_BLOB = '{"richText":"<h3 id=\\"user-content-features\\">Features</h3>"}';

test('decodeAnchor strips # and percent-decoding', () => {
  assert.equal(decodeAnchor('#open(java.lang.String)'), 'open(java.lang.String)');
  assert.equal(decodeAnchor('#open%28java.lang.String%29'), 'open(java.lang.String)');
  assert.equal(decodeAnchor(''), '');
});

test('finds an exact Javadoc id with parentheses and an ellipsis', () => {
  assert.equal(hasAnchor(JAVADOC, 'shouldHave(com.codeborne.selenide.WebElementCondition...)'), true);
});

test('does not match a different overload or a prefix of another id', () => {
  assert.equal(hasAnchor(JAVADOC, 'shouldHave(com.codeborne.selenide.WebElementCondition)'), false);
  assert.equal(hasAnchor(JAVADOC, 'text(java.lang.String)'), false);
  assert.equal(hasAnchor(JAVADOC, 'textCaseSensitive'), false);
});

test('finds a GitHub README heading through its escaped user-content id', () => {
  assert.equal(hasAnchor(GITHUB_BLOB, 'features', { github: true }), true);
  assert.equal(hasAnchor(GITHUB_BLOB, 'changelog', { github: true }), false);
  assert.equal(hasAnchor(GITHUB_BLOB, 'features'), false);
});
```

`package.json` scripts: add
`"test:scripts": "node --test .claude/skills/selenide-release-sync/scripts/lib/*.test.mjs"`
(unquoted, so `sh` expands the glob on both Node 20 and 22).

- [ ] **Step 2: Run them to see them fail**

Run: `npm run test:scripts`
Expected: FAIL, `Cannot find module '.../lib/anchors.mjs'`.

- [ ] **Step 3: Write `lib/anchors.mjs`**

```js
// Anchor matching for check-docs-links.mjs. Plain string search, never a regex
// built from the anchor: Javadoc anchors such as
// shouldHave(com.codeborne.selenide.WebElementCondition...) are full of regex
// metacharacters. The closing quote is part of the needle, so an id that only
// starts with the anchor (textCaseSensitive vs text) never matches.

export function decodeAnchor(hash) {
  return decodeURIComponent(hash.replace(/^#/, ''));
}

// Javadoc pages use quoted ids. GitHub blob pages embed the rendered README in
// a JSON payload, so heading ids appear escaped (id=\"...\") and prefixed with
// "user-content-".
export function hasAnchor(html, anchor, { github = false } = {}) {
  const id = github ? `user-content-${anchor}` : anchor;
  return [`id="${id}"`, `id='${id}'`, `id=\\"${id}\\"`].some((needle) => html.includes(needle));
}
```

- [ ] **Step 4: Run the unit tests**

Run: `npm run test:scripts`
Expected: PASS (4 tests).

- [ ] **Step 5: Write `check-docs-links.mjs`**

```js
#!/usr/bin/env node
// Verifies that every `docs` URL in js/data/ resolves and, when the URL has a
// #fragment, that the anchor exists on the page. data-integrity.spec.js only
// checks that a URL is on the allowlist; it cannot catch a renamed Javadoc
// method or a moved README heading, which is what drifts between releases.
//
// Usage (from the repo root):
//   node .claude/skills/selenide-release-sync/scripts/check-docs-links.mjs
//   node .claude/skills/selenide-release-sync/scripts/check-docs-links.mjs --only="Conditions,Mobile Gestures"
//
// Exit code 0 when every link is good, 1 when any page or anchor is missing,
// 2 when the checker itself could not run (e.g. no network).

import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { decodeAnchor, hasAnchor } from './lib/anchors.mjs';

process.removeAllListeners('warning'); // silence the MODULE_TYPELESS_PACKAGE_JSON notice

const repoRoot = process.cwd();
const only = (process.argv.find((a) => a.startsWith('--only=')) ?? '')
  .slice('--only='.length)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

let categories;
try {
  ({ categories } = await import(pathToFileURL(path.join(repoRoot, 'js/data/index.js')).href));
} catch (err) {
  console.error(`Could not import js/data/index.js from ${repoRoot}. Run from the repo root.`);
  console.error(err.message);
  process.exit(2);
}

// page URL (no fragment) -> [{ cat, name, anchor, docs }]
const byPage = new Map();
for (const { cat, items } of categories) {
  if (only.length && !only.includes(cat)) continue;
  for (const { name, docs } of items) {
    const url = new URL(docs);
    const anchor = decodeAnchor(url.hash);
    url.hash = '';
    const key = url.href;
    if (!byPage.has(key)) byPage.set(key, []);
    byPage.get(key).push({ cat, name, anchor, docs });
  }
}

async function fetchPage(url, attempt = 1) {
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    return { status: res.status, finalUrl: res.url, html: res.ok ? await res.text() : '' };
  } catch (err) {
    if (attempt < 3) return fetchPage(url, attempt + 1);
    return { status: 0, error: err.message, html: '' };
  }
}

const pages = [...byPage.keys()];
const results = new Map();
const CONCURRENCY = 6;
let next = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (next < pages.length) {
      const url = pages[next++];
      results.set(url, await fetchPage(url));
    }
  })
);

if (pages.length && [...results.values()].every((r) => r.status === 0)) {
  console.error('Every request failed. Is the network available?');
  process.exit(2);
}

const samePath = (a, b) => new URL(a).pathname.replace(/\/$/, '') === new URL(b).pathname.replace(/\/$/, '');
const failures = [];
for (const [url, entries] of byPage) {
  const r = results.get(url);
  const github = new URL(url).hostname === 'github.com';
  for (const e of entries) {
    if (r.status !== 200) {
      failures.push({ ...e, problem: `page returned ${r.status || r.error}` });
    } else if (!samePath(r.finalUrl, url)) {
      failures.push({ ...e, problem: `page redirected to ${r.finalUrl}` });
    } else if (e.anchor && !hasAnchor(r.html, e.anchor, { github })) {
      failures.push({ ...e, problem: `anchor #${e.anchor} not found on page` });
    }
  }
}

const total = [...byPage.values()].reduce((n, list) => n + list.length, 0);
if (!failures.length) {
  console.log(`OK: ${total} docs links across ${pages.length} pages all resolve.`);
  process.exit(0);
}
console.log(`FAIL: ${failures.length} of ${total} docs links are broken.\n`);
for (const f of failures) console.log(`- [${f.cat}] ${f.name}\n    ${f.docs}\n    ${f.problem}`);
process.exit(1);
```

`package.json` scripts: set
`"check:links": "node .claude/skills/selenide-release-sync/scripts/check-docs-links.mjs"`.
Then `git rm .claude/skills/playwright-release-sync/scripts/check-docs-links.mjs`.

- [ ] **Step 6: Prove it catches a broken anchor, then that the real links pass**

Temporarily change the `open()` docs anchor in `js/data/navigation.js` to
`#open(java.lang.Strin)`, run `npm run check:links`, and expect exit 1 with
`anchor #open(java.lang.Strin) not found on page`. Revert, run again:
Expected: `OK: 4 docs links across 3 pages all resolve.` and exit 0 (`Static imports` and
`open()` share `Selenide.html`).

- [ ] **Step 7: Run the script tests in CI**

In `.github/workflows/test.yml`, after `Install dependencies`, add:

```yaml
      - name: Script unit tests
        if: matrix.project == 'chromium'
        run: npm run test:scripts
```

- [ ] **Step 8: Make the dev server port configurable (needed by parallel content agents in Task 7)**

`playwright.config.js`:

```js
import { defineConfig, devices } from '@playwright/test';

// PORT lets several checkouts (e.g. worktrees) run the suite at the same time
// without one reusing another's server on 3000.
const PORT = Number(process.env.PORT) || 3000;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : [['list'], ['html']],

  webServer: {
    command: `npx serve -l ${PORT} .`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
  },

  projects: [
    // Desktop
    { name: 'chromium', use: { browserName: 'chromium' } },

    // Mobile
    { name: 'iPhone 16', use: { ...devices['iPhone 16'] } },
    { name: 'Pixel 7', use: { ...devices['Pixel 7'] } },
  ],
});
```

Check: `PORT=3107 npx playwright test tests/schema-rules.spec.js --project=chromium` passes.

- [ ] **Step 9: Gates and commit**

Run: `npm run format && npm run lint && npm run format:check && npm test && npm run test:scripts && npm run check:links`
Expected: PASS.

```bash
git add -A
git commit -m "Add docs link checker with exact Javadoc and README anchors

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Content, category by category

This task runs as **four waves of parallel subagents**, one subagent per category, each in its
own git worktree (Agent tool, `isolation: "worktree"`). The lead (main session) owns
`js/data/index.js`, `style.css` and the merge, and reviews every category before it lands.

**Files (per category):**
- Create or extend: `js/data/<cls>.js`
- Create: `tests/content/<cls>.spec.js`
- Create once (lead, before wave 1): `tests/helpers/items.js`
- Modify (lead only): `js/data/index.js`, `index.html` (`#cmd-count` fallback)

**Interfaces:**
- Consumes: `.cache/sources/` (Task 5), `npm run check:links -- --only=<Cat>` (Task 6), `PORT` (Task 6), schema validators (Task 2).
- Produces: `itemIn(page, cat, name): Promise<Item | null>` in `tests/helpers/items.js`.

#### Categories, order and waves

Display order is the order of this table, and `js/data/index.js` must list them in it.

| Wave | `cat` | `cls` / file | `color` | Target | Default `platform` |
|---|---|---|---|---|---|
| 1 | Setup & Config | `config` | `#06b6d4` | 14 to 18 | web (`both` where it also drives mobile) |
| 1 | Navigation & Browser | `navigation` | `#0ea5e9` | 10 to 12 | web |
| 1 | Selectors | `selector` | `#3b82f6` | 14 to 18 | web |
| 1 | Actions | `action` | `#22c55e` | 16 to 20 | web |
| 1 | Conditions | `condition` | `#f97316` | 18 to 22 | both |
| 2 | Collections | `collection` | `#eab308` | 12 to 15 | both |
| 2 | Waits & Timeouts | `wait` | `#64748b` | 5 to 7 | both |
| 2 | Page Objects | `page-object` | `#f43f5e` | 6 to 8 | web |
| 2 | Windows, Frames, Alerts | `window` | `#10b981` | 8 to 10 | web |
| 2 | Files | `file` | `#84cc16` | 8 to 10 | web |
| 3 | Proxy & Network | `network` | `#14b8a6` | 6 to 8 | web |
| 3 | JavaScript, Storage, Clipboard | `javascript` | `#f59e0b` | 8 to 10 | web |
| 3 | Reports & Debugging | `report` | `#ef4444` | 8 to 10 | both |
| 3 | Test Frameworks | `framework` | `#a8a29e` | 6 to 8 | both |
| 3 | Remote & Grid | `remote` | `#0891b2` | 5 to 7 | web |
| 4 | Patterns | `pattern` | `#fb7185` | 6 to 8 | web |
| 4 | Build & Run | `cli` | `#fbbf24` | 6 to 8 | web |
| 4 | Appium Setup | `appium-setup` | `#8b5cf6` | 8 to 10 | mobile |
| 4 | Mobile Selectors | `mobile-selector` | `#a855f7` | 12 to 16 | mobile |
| 4 | Mobile Gestures | `mobile-gesture` | `#c026d3` | 10 to 14 | mobile |
| 4 | Mobile Context & App | `mobile-context` | `#db2777` | 8 to 12 | mobile |

Seed lists: kickoff section 4 items 1 to 16 and 22 for the web categories, spec section 5 for
the mobile ones and for the 7.19.0 additions (`BrowserState` save/restore, `BrowserClock` and
timezone emulation, `visibleText()`, HtmlUnit, Appium `scroll()`/`swipe()` inside an element).
Seeds are a starting point: drop what does not exist in 7.19.0, add what is important and
missing.

- [ ] **Step 1 (lead, once): create the lookup helper**

`tests/helpers/items.js`:

```js
// Looks up one entry by category and name through the page global. Content
// tests compare the result against values copied from the sources jar.
export const itemIn = (page, cat, name) =>
  page.evaluate(
    ([c, n]) => window.categories.find((x) => x.cat === c)?.items.find((i) => i.name === n) ?? null,
    [cat, name]
  );
```

Commit: `Add itemIn helper for content tests`.

- [ ] **Step 2 (lead, per wave): dispatch one subagent per category with this brief**

Fill in the five `<…>` values from the table and a distinct port (wave 1: 3101 to 3105,
wave 2: 3111 to 3115, and so on). The brief is the subagent's whole context.

````text
You are writing the "<cat>" category of a Selenide 7.19.0 cheat sheet. Repo: the current
worktree. Main checkout (for the sources cache and node_modules):
/Users/nigelmulholland/Developer/selenide/selenide-commands-cheat-sheet

Read first: CLAUDE.md, docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md
(sections 3, 4, 5, 10), and js/data/config.js as a format example.

Setup:
  ln -s /Users/nigelmulholland/Developer/selenide/selenide-commands-cheat-sheet/node_modules node_modules
  SRC=/Users/nigelmulholland/Developer/selenide/selenide-commands-cheat-sheet/.cache/sources
  export PORT=<port>

Your files: js/data/<cls>.js (create, or extend if it exists: keep existing entries) and
tests/content/<cls>.spec.js. To run tests, also add your category to js/data/index.js
(the lead redoes this on merge, so any position is fine). Touch nothing else.

Category: cat '<cat>', cls '<cls>', color '<color>', target <N to M> entries, default
platform '<platform>'. Seeds: <seed list from kickoff section 4 / spec section 5>.

Sources (approved, nothing else):
  - Context7 /selenide/selenide (at most 3 query-docs calls for this category)
  - selenide.org pages and selenide.org/javadoc/current/
  - github.com/selenide/selenide (tag v7.19.0 for source and CHANGELOG.md)
  - github.com/selenide-examples/selenide-appium
  - the sources in $SRC
If you want any other source, do NOT use it: list it under "Wanted sources" in your report.
Context7 and the docs are for discovery. $SRC decides. If they disagree, use $SRC and list the
conflict under "Conflicts".

For every entry:
  1. Find the API in $SRC: grep -rn "<method or field>" $SRC. Record file and signature.
     If you cannot find it, the entry does not exist in 7.19.0: drop it.
  2. Write the test first in tests/content/<cls>.spec.js (template below). The expected
     values come from the signature you found, with a comment citing file and signature.
     Run it and see it FAIL because the entry is missing.
  3. Write the entry in js/data/<cls>.js. Rules: all seven fields; level beginner for the
     everyday path, intermediate for options most suites need, advanced for specialised or
     tooling APIs; desc in one or two sentences (new in 7.19.0: end with "Added in Selenide
     7.19.0."); tip is the non-obvious part (gotcha, default, when to prefer something else),
     never a restatement of desc; code is Java 17+, one concept, assumes the static imports
     of Selenide, Condition and CollectionCondition, writes any other import inside the
     snippet. Names: globally unique, no < or >, follow "concept (option)" for variants.
     No em-dash or en-dash anywhere, including code comments. Inside the template literal
     write \${ for a literal ${ and double every backslash ("\\d+" in Java is "\\\\d+").
     Mobile entries use selenide-appium API only; AppiumBy and java-client classes only
     inside Selenide calls or a WebDriverProvider. properties snippets start with
     "# selenide.properties"; Maven snippets are XML starting with <dependency>; Gradle
     snippets use Kotlin DSL.
  4. Docs link: the most specific page. For a Javadoc anchor, list the real ids, never guess:
       curl -sf <javadoc page> | grep -oE 'id="[^"]+"' | sed -E 's/id="//; s/"$//' | sort -u
     For a README heading on GitHub: https://github.com/selenide/selenide/blob/main/<path>#<slug>
  5. Read the snippet back as Java. The test suite does not compile it.

Test file template (expected values from $SRC, never from js/data):

  import { test, expect } from '@playwright/test';
  import { itemIn } from '../helpers/items.js';

  test.describe('<cat> entries (Selenide 7.19.0)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });

    test('"<name>" exists at level <level>, platform <platform>', async ({ page }) => {
      const entry = await itemIn(page, '<cat>', '<name>');
      expect(entry).not.toBeNull();
      expect(entry.level).toBe('<level>');
      expect(entry.platform).toBe('<platform>');
      // <artifact> 7.19.0 <File>.java: <exact signature line from $SRC>
      expect(entry.code).toContain('<the call that proves the entry is right>');
    });
  });

Write 3 to 6 such guards per category, picking the entries where a stale or invented answer
is most likely (renamed methods, new options, 7.19.0 additions, overloads). Add a negative
guard where a known wrong form exists, for example:
  expect(entry.code).not.toContain('withTagAndDescription'); // never shipped; see AppiumSelectors.java

Gates before you report (all must pass):
  npx playwright test tests/content/<cls>.spec.js tests/data-integrity.spec.js tests/highlight.spec.js --project=chromium
  npm run check:links -- --only="<cat>"
  npx prettier --check js/data/<cls>.js tests/content/<cls>.spec.js
  npx eslint js/data/<cls>.js

Commit on your worktree branch: "Add <cat> entries" with the trailer
"Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

Report back:
  - Entries: one line each, "<name> (<level>, <platform>): <file>:<line> <signature>"
  - Dropped seeds and why
  - Conflicts between docs/Context7 and $SRC
  - Wanted sources (not used)
  - Gate output (last lines of each command)
````

- [ ] **Step 3 (lead, per category): review before merging**

For each returned category:
1. Read the whole diff of `js/data/<cls>.js` and `tests/content/<cls>.spec.js`.
2. Pick three entries at random and re-run their `grep` in `.cache/sources/` yourself. The
   signature must match the cited comment and the snippet.
3. Check every test's expected value has a citing comment and does not read from `js/data`.
4. Reject (send back with the reason) on any invented API, unsourced claim, circular test,
   non-approved source, or a snippet that is not valid Java on reading.
5. Bring every "Wanted sources" and "Conflicts" item to the user before merging that category.

- [ ] **Step 4 (lead, per category): merge**

```bash
git checkout <agent-branch> -- js/data/<cls>.js tests/content/<cls>.spec.js
```

Then add the import and the array entry to `js/data/index.js` in table order, update the
`#cmd-count` fallback in `index.html` to the real count:

```bash
node --no-warnings -e "import('./js/data/index.js').then(({categories})=>console.log(categories.reduce((n,c)=>n+c.items.length,0)))"
```

and run: `npm run format && npm run lint && npm run format:check && npm test && npm run check:links`.
Expected: PASS. Commit `Add <cat> entries` (trailer as above).

- [ ] **Step 5 (lead, after wave 4): totals and a visual check**

The count printed above is between 200 and 260. Open the site, Grouped view: web categories
first, the four violet/magenta mobile categories last. `#filter=mobile` shows only mobile and
`both` entries. Remove the worktrees (`git worktree list`, `git worktree remove <path>`).

---

### Task 8: Supabase backend files and client renames (DEFERRED by the user)

> **Deferred.** Skip this task in the main run; Tasks 9 and 10 do not depend on it. When the
> user picks it up, do these extra steps on top of the ones below:
> 1. Set `ENABLED = true` in `js/popular-commands.js`, `js/visitor-counter.js` and
>    `js/visitor-display.js` and remove the `SUPABASE PLACEHOLDER` comments.
> 2. Remove `.skip` from the four analytics describes, and delete the `Analytics placeholder`
>    describe in `tests/meta-bar.spec.js`.
> 3. In the popularity tests, replace both "20 commands" fixtures (they no longer have 20
>    real commands to use). Rows may name ids that do not exist; `applyRows` ranks every row
>    with views:
>
>    ```js
>        // 3 real commands with the highest counts + 17 unknown ids = 20 viewed rows,
>        // so the top ~10% is ceil(20 * 0.1) = 2: the two real commands with 30 and 29 views.
>        state.rows = [
>          { command_id: cmds[0].id, view_count: 30 },
>          { command_id: cmds[1].id, view_count: 29 },
>          { command_id: cmds[2].id, view_count: 1 },
>          ...Array.from({ length: 17 }, (_, i) => ({ command_id: `fake:${i}`, view_count: 2 })),
>        ];
>    ```
>
>    The filter test expects `names.length === 2` and `names[0] === cmds[0].name`; the
>    "no badges" test uses `toBeGreaterThan(0)`.
> 4. In `tests/cheatsheet.spec.js` `Mobile filter`, expect
>    `['All', '⭐ Start Here', '🔥 Popular', '📱 Mobile']` for `labels.slice(0, 4)`.
> 5. `CLAUDE.md` / `AGENTS.md`: replace the "analytics are off" note written in Task 10.

**Files:**
- Delete: `supabase/migrations/0001_visits_counter.sql`, `supabase/migrations/0002_command_views.sql`, `supabase/functions/increment-visitor/`, `supabase/functions/increment-command-view/`
- Create: `supabase/migrations/0001_selenide_visits.sql`, `supabase/migrations/0002_selenide_command_views.sql`, `supabase/functions/increment-selenide-visitor/index.ts`, `supabase/functions/increment-selenide-command-view/index.ts`
- Modify: `js/visitor-counter.js`, `js/visitor-display.js`, `js/popular-commands.js`, `tests/meta-bar.spec.js`, `tests/popular-commands.spec.js`

**Interfaces:**
- Produces: table `selenide_visits`, RPC `increment_selenide_visits()`, table `selenide_command_views`, RPC `increment_selenide_command_view(cmd_id text)`, Edge Functions `increment-selenide-visitor`, `increment-selenide-command-view`; storage keys `selenide-visitor-counted-session`, `selenide-visitor-count-cache`, `selenide-command-views-cache`, `selenide-cmd-opened:`.

- [ ] **Step 1: Point the tests at the new names (they fail against the old client)**

**Safety first.** While the client still calls the old endpoints, an unmocked request would
reach the live project, and the increment tests (which pose as a real visitor) would bump
the **Playwright site's** real counters. So the first line of both `mockBackends` helpers
becomes a catch-all abort. Playwright runs the most recently registered matching route
first, so the specific `fulfill` routes registered after it still win:

```js
  // Registered first so every specific route below takes precedence; anything
  // unmocked is aborted and can never reach the live Supabase project.
  await page.route('**tilbhgcncnwibnfgebkg.supabase.co/**', (route) => route.abort());
```

`tests/meta-bar.spec.js` `mockBackends`: route `'**/rest/v1/selenide_visits**'` and
`'**/functions/v1/increment-selenide-visitor'`. In `falls back to the cached value` use
`localStorage.setItem('selenide-visitor-count-cache', '9876')`. Add:

```js
  test("ignores the Playwright site's cached count (separate storage keys)", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('visitor-count-cache', '9876'));
    await mockBackends(page, { offline: true });
    await page.goto('/');
    // No Selenide cache, backend offline: the display falls back to 0, dimmed.
    await expect(page.locator('#visitor-count-number')).toHaveText('0');
  });
```

`tests/popular-commands.spec.js` `mockBackends`: routes `'**/rest/v1/selenide_visits**'`,
`'**/functions/v1/increment-selenide-visitor'`, `'**/rest/v1/selenide_command_views**'` and
`'**/functions/v1/increment-selenide-command-view'` (both in the offline and online branches).

- [ ] **Step 2: Run them to see them fail**

Run: `npx playwright test tests/meta-bar.spec.js tests/popular-commands.spec.js --project=chromium`
Expected: FAIL. `shows the live count` hits the abort and shows `0`, the increment tests
count 0 POSTs, and the record-open test sees no command_id. No request leaves the machine.

- [ ] **Step 3: Rename in the client**

`js/visitor-counter.js`: function URL `https://tilbhgcncnwibnfgebkg.supabase.co/functions/v1/increment-selenide-visitor`, `SESSION_KEY = 'selenide-visitor-counted-session'`.
`js/visitor-display.js`: REST path `/rest/v1/selenide_visits?select=total_count`, `CACHE_KEY = 'selenide-visitor-count-cache'`.
`js/popular-commands.js`: `FUNCTION_URL = \`${SUPABASE_URL}/functions/v1/increment-selenide-command-view\``, `REST_URL = \`${SUPABASE_URL}/rest/v1/selenide_command_views?select=command_id,view_count\``, `CACHE_KEY = 'selenide-command-views-cache'`, `SESSION_PREFIX = 'selenide-cmd-opened:'`, and the error text `'Unexpected selenide_command_views response'`.

- [ ] **Step 4: Run the tests**

Run: `npx playwright test tests/meta-bar.spec.js tests/popular-commands.spec.js --project=chromium`
Expected: PASS.

- [ ] **Step 5: Write the backend files**

`supabase/migrations/0001_selenide_visits.sql`:

```sql
-- Single-row visitor counter for the Selenide cheat sheet. It shares the
-- Supabase project with the Playwright cheat sheet but has its own table and
-- RPC, so the two counts never mix.
create table if not exists public.selenide_visits (
  id integer primary key default 1,
  total_count bigint not null default 0
);
insert into public.selenide_visits (id, total_count)
  values (1, 0)
  on conflict (id) do nothing;

-- Atomic increment (avoids race conditions under concurrent hits)
create or replace function public.increment_selenide_visits()
returns void
language sql
as $$
  update public.selenide_visits set total_count = total_count + 1 where id = 1;
$$;

-- RLS: allow the public anon key to READ only
alter table public.selenide_visits enable row level security;

drop policy if exists "Allow public read" on public.selenide_visits;
create policy "Allow public read"
  on public.selenide_visits for select
  using (true);
```

`supabase/migrations/0002_selenide_command_views.sql`:

```sql
-- Per-command open counter for the Selenide cheat sheet (one row per command,
-- created on first open). Separate from the Playwright site's command_views.
create table if not exists public.selenide_command_views (
  command_id text primary key,
  view_count bigint not null default 0
);

-- Atomic upsert-increment: first open inserts the row, later opens add 1
create or replace function public.increment_selenide_command_view(cmd_id text)
returns void
language sql
as $$
  insert into public.selenide_command_views (command_id, view_count)
  values (cmd_id, 1)
  on conflict (command_id)
  do update set view_count = public.selenide_command_views.view_count + 1;
$$;

-- RLS: allow the public anon key to READ only (writes go through the
-- Edge Function's service-role key, never the client)
alter table public.selenide_command_views enable row level security;
drop policy if exists "Allow public read" on public.selenide_command_views;
create policy "Allow public read"
  on public.selenide_command_views for select
  using (true);
```

Edge Functions: copy each existing `index.ts` to its new folder and change only the RPC
name: `supabase.rpc("increment_selenide_visits")` and
`supabase.rpc("increment_selenide_command_view", { cmd_id: command_id })`.

```bash
mkdir -p supabase/functions/increment-selenide-visitor supabase/functions/increment-selenide-command-view
git mv supabase/functions/increment-visitor/index.ts supabase/functions/increment-selenide-visitor/index.ts
git mv supabase/functions/increment-command-view/index.ts supabase/functions/increment-selenide-command-view/index.ts
git rm -q supabase/migrations/0001_visits_counter.sql supabase/migrations/0002_command_views.sql
```

then edit the two `rpc(...)` calls.

- [ ] **Step 6: Gates and commit**

Run: `npm run format && npm run lint && npm run format:check && npm test`
Expected: PASS, and this returns nothing (no old names left):
`grep -rnE "increment[-_](visits|visitor|command[-_]view)|rest/v1/(visits|command_views)" js supabase`

```bash
git add -A
git commit -m "Use Selenide-specific Supabase tables, RPCs and Edge Functions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Tell the user, without running anything: apply the two migrations in the SQL editor, then
`supabase functions deploy increment-selenide-visitor` and
`supabase functions deploy increment-selenide-command-view`.

---

### Task 9: `selenide-release-sync` skill, delta script and workflow

**Files:**
- Create: `.claude/skills/selenide-release-sync/SKILL.md`, `.claude/skills/selenide-release-sync/references/quality-bar.md`, `.claude/skills/selenide-release-sync/scripts/lib/releases.mjs`, `.claude/skills/selenide-release-sync/scripts/lib/releases.test.mjs`, `.claude/skills/selenide-release-sync/scripts/release-delta.mjs`
- Modify: `package.json` (`release:delta`), `.github/workflows/cheatsheet-sync.yml`, `.github/prompts/cheatsheet-sync.md`
- Delete: `.claude/skills/playwright-release-sync/`

**Interfaces:**
- Produces: `parseRelease(xml: string): string`, `compareVersions(a: string, b: string): number`, `changelogSections(markdown: string, pinned: string, latest: string): string[]`.

Facts observed during planning: `maven-metadata.xml` has `<release>7.19.0</release>`;
`CHANGELOG.md` at a tag has sections `## 7.19.0 (10.10.2026)` separated by `=======` lines;
`modules/appium/CHANGELOG` stopped at 6.15.0 when selenide-appium merged into the monorepo,
so Appium changes are listed in the main `CHANGELOG.md` and that file is the only one read.

- [ ] **Step 1: Write the failing unit tests**

`.claude/skills/selenide-release-sync/scripts/lib/releases.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changelogSections, compareVersions, parseRelease } from './releases.mjs';

const METADATA = `<metadata><groupId>com.codeborne</groupId><artifactId>selenide</artifactId>
<versioning><latest>7.20.0-RC1</latest><release>7.19.0</release></versioning></metadata>`;

const CHANGELOG = `# Changelog

=======
## 7.20.0 (01.11.2026)
* feature twenty

=======
## 7.19.0 (10.10.2026)
* feature nineteen

=======
## 7.18.2 (19.09.2026)
* patch

=======
## 7.18.0 (20.08.2026)
* eighteen
`;

test('parseRelease reads <release>, not <latest>', () => {
  assert.equal(parseRelease(METADATA), '7.19.0');
  assert.throws(() => parseRelease('<metadata/>'), /No <release>/);
});

test('compareVersions orders by major, minor, patch numerically', () => {
  assert.ok(compareVersions('7.19.0', '7.9.0') > 0);
  assert.ok(compareVersions('7.18.2', '7.19.0') < 0);
  assert.equal(compareVersions('7.19.0', '7.19.0'), 0);
});

test('changelogSections returns versions after pinned up to latest, newest first', () => {
  const sections = changelogSections(CHANGELOG, '7.18.0', '7.19.0');
  assert.deepEqual(
    sections.map((s) => s.split('\n')[0]),
    ['## 7.19.0 (10.10.2026)', '## 7.18.2 (19.09.2026)']
  );
  assert.ok(!sections.join('\n').includes('======='));
});

test('changelogSections is empty when pinned is latest', () => {
  assert.deepEqual(changelogSections(CHANGELOG, '7.19.0', '7.19.0'), []);
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `npm run test:scripts`
Expected: FAIL, `Cannot find module '.../lib/releases.mjs'` (anchors tests still pass).

- [ ] **Step 3: Write `lib/releases.mjs`**

```js
// Pure helpers for release-delta.mjs: Maven metadata and Selenide's CHANGELOG.md.

export function parseRelease(xml) {
  const m = xml.match(/<release>([^<]+)<\/release>/);
  if (!m) throw new Error('No <release> in maven-metadata.xml');
  return m[1].trim();
}

const parts = (v) => v.split(/[.-]/).slice(0, 3).map(Number);

export function compareVersions(a, b) {
  const [x, y] = [parts(a), parts(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

// Sections look like "## 7.19.0 (10.10.2026)" and are separated by "=======" lines.
// Returns every section newer than `pinned` and not newer than `latest`, newest first.
export function changelogSections(markdown, pinned, latest) {
  return markdown
    .split(/^(?=## \d+\.\d+\.\d+)/m)
    .filter((s) => /^## \d+\.\d+\.\d+/.test(s))
    .filter((s) => {
      const v = s.match(/^## (\d+\.\d+\.\d+)/)[1];
      return compareVersions(v, pinned) > 0 && compareVersions(v, latest) <= 0;
    })
    .map((s) => s.replace(/\n=+\s*$/, '').trim());
}
```

- [ ] **Step 4: Run the unit tests**

Run: `npm run test:scripts`
Expected: PASS (8 tests).

- [ ] **Step 5: Write `release-delta.mjs`**

```js
#!/usr/bin/env node
// Prints the Selenide changelog between the version pinned in js/versions.json
// and the latest release on Maven Central, read from CHANGELOG.md at the
// release's git tag (the tag is what shipped; main may describe the next one).
//
// Usage (from the repo root):
//   node .claude/skills/selenide-release-sync/scripts/release-delta.mjs
//   node .claude/skills/selenide-release-sync/scripts/release-delta.mjs --check
//       One line, `pinned=7.19.0 latest=7.20.0 behind=true`, for CI gating.
//   ... --to=7.20.0     Compare against a specific release instead of Maven latest.
//
// Exit code 0 on success, 2 when Maven Central or GitHub could not be reached.

import { readFileSync } from 'node:fs';
import { changelogSections, compareVersions, parseRelease } from './lib/releases.mjs';

const arg = (name) => process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const checkOnly = process.argv.includes('--check');
const METADATA = (artifact) =>
  `https://repo1.maven.org/maven2/com/codeborne/${artifact}/maven-metadata.xml`;

async function text(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

const pinned = JSON.parse(readFileSync('js/versions.json', 'utf8')).selenide;
let latest = arg('to');
try {
  if (!latest) {
    latest = parseRelease(await text(METADATA('selenide')));
    const appium = parseRelease(await text(METADATA('selenide-appium')));
    if (appium !== latest)
      console.error(`warning: selenide-appium latest is ${appium}, selenide latest is ${latest}`);
  }
} catch (err) {
  console.error('Could not read Maven Central metadata:', err.message);
  process.exit(2);
}
const behind = compareVersions(pinned, latest) < 0;

if (checkOnly) {
  console.log(`pinned=${pinned} latest=${latest} behind=${behind}`);
  process.exit(0);
}
if (!behind) {
  console.log(`Pinned ${pinned} is already the latest release. No delta.`);
  process.exit(0);
}

const url = `https://raw.githubusercontent.com/selenide/selenide/v${latest}/CHANGELOG.md`;
let changelog;
try {
  changelog = await text(url);
} catch (err) {
  console.error('Could not fetch CHANGELOG.md:', err.message);
  process.exit(2);
}
console.log(`<!-- Selenide changelog ${pinned} -> ${latest} from ${url} -->\n`);
console.log(changelogSections(changelog, pinned, latest).join('\n\n'));
```

`package.json` scripts: `"release:delta": "node .claude/skills/selenide-release-sync/scripts/release-delta.mjs"`.

Check:
1. `npm run release:delta -- --check` prints `pinned=7.19.0 latest=7.19.0 behind=false` (or a
   newer latest if one shipped after 2026-10-10).
2. `npm run release:delta -- --to=7.19.0` prints `Pinned 7.19.0 is already the latest release. No delta.`
3. Temporarily set `"selenide": "7.18.0"` in `js/versions.json`, run
   `npm run release:delta -- --to=7.19.0`, and expect exactly the sections `## 7.19.0 (10.10.2026)`,
   `## 7.18.2 (19.09.2026)` and `## 7.18.1 (29.08.2026)` (dates as read from the tag during
   planning). Revert `js/versions.json` with `git checkout js/versions.json`.

- [ ] **Step 6: Write `SKILL.md`**

Same structure as the Playwright skill (Overview, When to use, Workflow, Triage, Red flags,
Common mistakes). Required content:

```markdown
---
name: selenide-release-sync
description: Use when a new Selenide version is released, when js/versions.json is behind Maven Central, when asked to update or sync the cheat sheet to a Selenide release, or when js/data entries may have drifted from current Selenide (renamed methods, changed signatures, broken selenide.org or GitHub links).
---
```

Workflow steps, in order:
1. Measure the gap: `npm run release:delta -- --check`.
2. Read the whole delta: `npm run release:delta`. Every bullet of every version, including "update Selenium/Appium from X to Y" lines.
3. Bump: edit `js/versions.json` (`selenide`, `selenideAppium`, and `appiumJavaClient` if the changelog says Appium was updated; confirm in `selenide-appium-<v>.pom`), then `npm run fetch:sources`.
4. Triage into a change list (table below).
5. Check existing entries: for each changed or removed API, `grep -rn` across `js/data/` and fix every hit.
6. Verify, then write: every name, signature and default is confirmed in `.cache/sources/` (`grep -rn`), following `references/quality-bar.md`. Sources policy table copied from spec section 3, with "Context7 and the official site are for discovery, the jar decides, report conflicts" and "any other source: ask the user first".
7. Check every docs link: `npm run check:links`. Find anchors by listing ids, never by guessing.
8. Bump version references: `js/versions.json`, `#selenide-version` and `#cmd-count` fallbacks in `index.html` (count via the `node --no-warnings -e` one-liner), the `readme.md` badge, the `CLAUDE.md` tech table, the dependency snippets in `js/data/config.js`, `js/data/cli.js` and `js/data/appium-setup.js`, and the expected object in `tests/meta-bar.spec.js` (`js/versions.json pins the release…`). `grep -rn --exclude-dir=node_modules --exclude-dir=.cache "<old version>" .` must only hit history. Never edit `js/meta.json`.
9. Pin with tests: a `Selenide X.Y.Z entries` describe in the relevant `tests/content/<cls>.spec.js`, expected values cited from the jar.
10. Gates: `npm run lint && npm run format:check && npm test && npm run test:scripts && npm run check:links` (CI uses `npm run test:chromium`).
11. Report (format in `references/quality-bar.md`).

Triage table:

| Changelog item | Action |
|---|---|
| New user-facing method, option, condition, config property or module | Add an entry, desc ends `Added in Selenide X.Y.Z.` |
| New option on an API that has an entry | Update that entry's code and tip, `(X.Y.Z+)` |
| Behaviour change or rename | Update every affected entry, "Since X.Y.Z" in the tip |
| Deprecation | Keep the entry, name the replacement in the tip |
| Removal | Rewrite to the replacement, add a negative guard test |
| "update Selenium from X to Y", dependency bumps other than Appium, internal refactors, CI | Leave out, list under "Deliberately left out" |
| "update Appium from X to Y" | Bump `appiumJavaClient`, re-run `fetch:sources`, re-check mobile entries that use java-client classes |

Red flags: a signature not seen in `.cache/sources/`; a Context7 or docs result the tag's
CHANGELOG does not mention; an anchor not confirmed by listing ids; a test whose expected
value was read from `js/data` or produced by running the code; weakening an assertion; any
source outside the approved list.

- [ ] **Step 7: Write `references/quality-bar.md`**

Port the Playwright file's sections (Every claim is sourced, Writing an entry, Placement,
Finding a real anchor, Tests, Report), replacing:
- the sources table with: name/signature/overloads/defaults → `.cache/sources/` (`grep -rn`); "Added in", behaviour change, deprecation → `CHANGELOG.md` at the tag; `docs` URL and anchor → live page via the link checker; mobile setup patterns → `github.com/selenide-examples/selenide-appium`;
- the entry rules with the ones in Task 7 Step 2's brief (levels, desc, tip, code conventions, escaping, mobile scope);
- the anchor recipe with `curl -sf <javadoc page> | grep -oE 'id="[^"]+"' | sed -E 's/id="//; s/"$//' | sort -u`, noting Javadoc anchors are method signatures with fully qualified parameter types (`open(java.lang.String)`, varargs as `...`) and GitHub README anchors are heading slugs (`#how-to-add-dependency-to-your-project`);
- the test template with the Task 7 template, plus the test oracle rule from spec section 10.

- [ ] **Step 8: Update the workflow and prompt**

`.github/workflows/cheatsheet-sync.yml`:
- header comment: Selenide, `selenide-release-sync`, Maven Central;
- cron `'0 6 1,15 * *' # 06:00 UTC on the 1st and 15th; Selenide ships about monthly`;
- `SCRIPTS: .claude/skills/selenide-release-sync/scripts`;
- keep `Install Playwright browsers` as is (the site's tests still need them), and add a step
  `Fetch sources` running `npm run fetch:sources` right after `Install dependencies`, with the
  same `if: steps.drift.outputs.run == 'true'`.

`.github/prompts/cheatsheet-sync.md`: replace Playwright with Selenide throughout, point at
`.claude/skills/selenide-release-sync/SKILL.md`, the commit message becomes
`chore: sync cheat sheet with Selenide vX.Y.Z`, add the gates `npm run test:scripts`, and add:
"Use only the approved sources in the skill. If you need another source, do not use it: list
it in the PR body under 'Wanted sources'."

Then: `git rm -rq .claude/skills/playwright-release-sync`.

- [ ] **Step 9: Gates and commit**

Run: `npm run format && npm run lint && npm run format:check && npm test && npm run test:scripts && npm run check:links`
Expected: PASS. `grep -rn "playwright-release-sync" --exclude-dir=node_modules --exclude-dir=docs .` returns nothing.

```bash
git add -A
git commit -m "Add selenide-release-sync skill, delta script and fortnightly workflow

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Docs and screenshots

**Files:**
- Modify (rewrite): `CLAUDE.md`, `AGENTS.md`, `readme.md`
- Replace: `images/dashboard.jpeg`, `images/description.jpg`

- [ ] **Step 1: Capture screenshots from the local server**

Write a throwaway script in the session scratchpad (not committed), `shots.mjs`. It imports
Playwright by absolute path because the scratchpad has no `node_modules`:

```js
import { chromium } from '/Users/nigelmulholland/Developer/selenide/selenide-commands-cheat-sheet/node_modules/@playwright/test/index.mjs';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.route('**/rest/v1/**', (r) => r.fulfill({ json: [] }));
await page.route('**/functions/v1/**', (r) => r.fulfill({ status: 200, body: '' }));
await page.goto('http://localhost:3000/');
await page.screenshot({ path: 'images/dashboard.jpeg', quality: 85 });
await page.locator('.tile', { hasText: 'shouldHave(text())' }).click();
await page.screenshot({ path: 'images/description.jpg', quality: 85 });
await browser.close();
```

Run `npx serve -l 3000 .` in the background, then `node <scratchpad>/shots.mjs` from the repo
root, then stop the server. Look at both images.

- [ ] **Step 2: Rewrite `CLAUDE.md`**

Same section structure as the current file (Core Principles, Tech Stack, Repository Layout,
Commands, Playwright Configuration, Data Schema, Syntax Highlighting, Popular Commands Feature,
Visitor Counter, State Management, Testing Patterns, Code Style, CI/CD, Important Gotchas),
updated for this project. Must include:
- Title "Selenide Commands Cheat Sheet — AI Assistant Guide", Pages URL `https://youvegotnigel.github.io/selenide-commands-cheat-sheet/`, the pinned versions from `js/versions.json`.
- The repository layout with the 21 category files and `tests/helpers/`, `tests/content/`, `.claude/skills/selenide-release-sync/`.
- Commands: add `npm run fetch:sources`, `npm run test:scripts`; `PORT` for parallel runs.
- Data schema with `platform` and the full rule table from spec section 4 (including `<`/`>` in names and the filter-name clash).
- The Java-in-template-literal gotchas (`\${selenide.version}`, `"\\d+"` written as `"\\\\d+"`, no backtick issue) and the snippet conventions (static imports, `# selenide.properties`, Kotlin DSL for Gradle).
- Highlighting: three highlighters, `pickHighlighter` rules, the token table for Java/shell/XML.
- Supabase: analytics are **off** (`ENABLED = false`, `SUPABASE PLACEHOLDER` comments) until
  Task 8 is done; describe the planned `selenide_` names from spec section 8 as pending.
- Sources policy (spec section 3) and the test oracle rule (spec section 10).
- Mobile filter and the `#filter=mobile` hash.

- [ ] **Step 3: Rewrite `AGENTS.md` and `readme.md`**

`AGENTS.md`: same structure as today, Selenide content, the category list (`cat` → `cls`),
"Keeping commands accurate" pointing at `.cache/sources/` and the `selenide-release-sync`
skill, the approved-sources rule, the test oracle rule.

`readme.md`: title `# Selenide Commands Cheat Sheet`, badges
`[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Dashboard-0a7cff?style=for-the-badge)](https://youvegotnigel.github.io/selenide-commands-cheat-sheet/)` and
`[![Selenide Version](https://img.shields.io/badge/Selenide-7.19.0-2EAD33?style=for-the-badge)](https://selenide.org/)`,
features (web and mobile halves, Mobile filter), how to use, project structure, data format
with `platform`, development commands, the two screenshots.

- [ ] **Step 4: Final checks and commit**

```bash
grep -rniE "playwright\.dev|playwright commands|🎭" --exclude-dir=node_modules --exclude-dir=.cache --exclude-dir=docs . 
```

Expected: no hits outside `package-lock.json` and the Playwright test tooling itself
(`@playwright/test`, `playwright.config.js`, `npx playwright`), which stay by design.

Run: `npm run format && npm run lint && npm run format:check && npm test && npm run test:scripts && npm run check:links`
Expected: PASS.

```bash
git add -A
git commit -m "Rewrite CLAUDE.md, AGENTS.md and readme for Selenide

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5: Hand over**

Report to the user: entry total per category, any sources or conflicts raised during Task 7,
a **reminder that Supabase (Task 8) is still deferred** and analytics are off, and that
nothing has been pushed.
