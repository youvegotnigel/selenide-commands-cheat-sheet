# Selenide Commands Cheat Sheet — AI Assistant Guide

A static, single-page interactive web dashboard providing a quick reference for **Selenide**
(Java web UI testing) and **selenide-appium** (mobile testing through Selenide's own API).
Users can browse, search, filter, and view syntax-highlighted Java code examples. Hosted on
GitHub Pages at `https://youvegotnigel.github.io/selenide-commands-cheat-sheet/`.

Pinned versions (single source of truth: `js/versions.json`): Selenide **7.19.0**,
selenide-appium **7.19.0**, Appium java-client **11.0.0**.

The site itself is plain JavaScript, so it is tested with **Playwright**, even though the
content is about Selenide.

---

## Core Principles

- **No build step.** Pure vanilla ES modules. No bundler, no transpilation, no compilation.
- **Zero runtime dependencies.** All `package.json` deps are `devDependencies` (Playwright, ESLint, Prettier, Serve).
- **No CDN imports.** Everything loads from the repo or the browser's native APIs.
- **What shipped is the truth.** Every API name, signature and default in `js/data/` is verified against the pinned release's sources jar (`.cache/sources/`), not memory, docs on `main`, or Context7.
- **Approved sources only** (see "Sources policy"). Ask the user before using any other source.
- **Run the tests** before marking any change complete: `npm test`, `npm run lint`, `npm run format:check`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JavaScript (ES2022+ modules), HTML5, CSS3 |
| Syntax highlighting | Custom dependency-free highlighter (`js/highlight.js`): Java, shell, XML |
| Content | Selenide 7.19.0, selenide-appium 7.19.0 (Java 17+ snippets) |
| Analytics backend | Supabase (**currently off**, see "Analytics") |
| Testing | `@playwright/test` v1.64.0, `node:test` for the skill scripts |
| Linting | ESLint 9 flat config |
| Formatting | Prettier 3 |
| Dev server | `npx serve` on port 3000 (`PORT` overrides) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Repository Layout

```
selenide-commands-cheat-sheet/
├── index.html                    # Markup: header, meta-bar, search, filters, grid, modal
├── style.css                     # Single stylesheet: dark theme, tile cells, 22 family fills, inspector
├── js/
│   ├── app.js                    # Render, filter (incl. Mobile), search, modal, meta-bar
│   ├── highlight.js              # Java / shell / XML highlighters + pickHighlighter()
│   ├── tile.js                   # Periodic cell: splitName, <wbr> breaks, key size, buildTile
│   ├── grid-keys.js              # Roving tabindex + arrow keys over the tile grid
│   ├── inspector.js              # Desktop hover/focus preview panel
│   ├── versions.json             # Pinned Selenide / selenide-appium / java-client versions
│   ├── popular-commands.js       # Command open tracking via Supabase (off: ENABLED = false)
│   ├── visitor-counter.js        # Visitor increment (off: ENABLED = false)
│   ├── visitor-display.js        # Visitor count display (off: ENABLED = false)
│   ├── meta.json                 # { "lastUpdated": "YYYY-MM-DD" } — auto-stamped by CI
│   └── data/
│       ├── index.js              # Imports all categories; array order = display order
│       ├── config.js … cli.js    # 18 web categories (see "Categories")
│       └── appium-setup.js … mobile-context.js   # 4 mobile categories
├── tests/
│   ├── helpers/
│   │   ├── schema.js             # Pure schema validators (the rules below)
│   │   ├── fixture-data.js       # Hand-written dataset served in place of js/data/index.js
│   │   └── items.js              # itemIn(page, cat, name) lookup for content tests
│   ├── schema-rules.spec.js      # Validators vs hand-written good/bad fixtures
│   ├── data-integrity.spec.js    # Validators vs the real data
│   ├── content/<cls>.spec.js     # Per-category guards, expected values from the sources jar
│   ├── grid-cells.spec.js        # Cell helpers, anatomy, numbers, layout
│   ├── grid-interactions.spec.js # Keyboard, category highlight, inspector
│   ├── cheatsheet.spec.js        # UI: load, search, filters (incl. Mobile), modal, hash, tile colours
│   ├── highlight.spec.js         # Highlighters, routing, round-trip over every entry
│   ├── meta-bar.spec.js          # Meta-bar, versions.json, analytics placeholder
│   └── popular-commands.spec.js  # Popularity (skipped while analytics are off)
├── supabase/                     # Migrations + Edge Functions (still the Playwright names; Task 8)
├── docs/
│   ├── kickoff.md                # Original brief
│   └── superpowers/{specs,plans}/ # Design spec and implementation plan
├── .claude/skills/selenide-release-sync/
│   ├── SKILL.md                  # How to sync js/data/ with a Selenide release
│   ├── references/quality-bar.md # Entry writing rules, anchors, test template, report format
│   └── scripts/                  # fetch-sources, check-docs-links, release-delta (+ lib/ tests)
├── .github/workflows/            # test.yml, stamp-date.yml, cheatsheet-sync.yml
├── playwright.config.js          # webServer on PORT (default 3000), 3 projects
├── eslint.config.js              # Flat config: lints js/ only, per-block globals
└── package.json                  # devDependencies only
```

---

## Commands

```bash
# Testing
npm test                          # Full suite (chromium, iPhone 16, Pixel 7)
npm run test:chromium             # Desktop Chrome only
npm run test:mobile               # Both mobile projects
npm run test:scripts              # node:test unit tests for the skill scripts
PORT=3101 npm run test:chromium   # Use another port (parallel checkouts / worktrees)

# Linting & formatting
npm run lint                      # ESLint on js/
npm run format                    # Prettier on js/ and tests/
npm run format:check              # Prettier check (no write)

# Selenide release sync (see .claude/skills/selenide-release-sync/)
npm run fetch:sources             # Download + unzip pinned sources jars into .cache/sources/
npm run release:delta             # Changelog between the pinned and the latest Selenide
npm run release:delta -- --check  # One-line pinned/latest/behind summary
npm run check:links               # Every docs URL and #anchor resolves (network)
npm run check:links -- --only="Conditions,Mobile Gestures"
```

---

## Playwright Configuration

- **Test directory:** `./tests/`
- **Dev server:** `npx serve` auto-started on `http://localhost:${PORT:-3000}`
- **Projects:** `chromium`, `iPhone 16`, `Pixel 7`
- **Reporter:** `github` when `process.env.CI` is set, otherwise `list` + `html`

---

## Data Schema

Every command lives in a category module `js/data/<cls>.js`, exporting one `Category`:

```js
/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',        // filter button and tile label
  cls: 'condition',         // CSS class for the tile fill (and the file name)
  color: '#fb923c',         // 6-digit hex, equal to the tile fill in style.css
  items: [
    {
      name: 'shouldHave(text())',  // display name, globally unique
      level: 'beginner',           // 'beginner' | 'intermediate' | 'advanced'
      platform: 'both',            // 'web' | 'mobile' | 'both'
      desc: 'What this does.',
      tip: 'The non-obvious part.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
  ],
};
```

**Every category module uses `export default`.** `platform`: `web` is browser-only,
`mobile` is selenide-appium-only, `both` works the same on `SelenideElement` and
`SelenideAppiumElement`.

The rules live in `tests/helpers/schema.js` and are applied by `data-integrity.spec.js`:

| Rule | Check |
|------|-------|
| Required fields | `name`, `level`, `platform`, `desc`, `tip`, `docs`, `code` present, not blank |
| `level` | `beginner` \| `intermediate` \| `advanced` |
| `platform` | `web` \| `mobile` \| `both` |
| `docs` | `https:`, host `selenide.org`, or `github.com` with a path starting `/selenide/` or `/selenide-examples/` |
| `code` | at least 20 characters after trimming |
| `name` | unique within its category **and** across every category |
| `name` characters | no `<` or `>` (names are rendered with `innerHTML`); write `Container (generic)` |
| `color` | `/^#[0-9a-fA-F]{6}$/` |
| category `cat` | must not equal a quick filter: `all`, `beginner`, `popular`, `mobile` |
| all fields | no em-dash `—` or en-dash `–` |

The tests check `code` length only. They do **not** compile the Java, so a syntax error
ships silently. Read every snippet back as Java.

### Java inside a template literal

`code` is a JS template literal holding Java:

- `$("#id")` and `$$(".row")` are fine. Only `${` needs escaping, which appears in Maven and
  properties snippets: write `\${selenide.version}`. An unescaped `${...}` is evaluated as JS
  and breaks the whole page on load.
- Escape sequences double up: Java `"\\d+"` is written `"\\\\d+"`.
- Backticks never appear in Java, so no escaping is needed there.

### Snippet conventions

- Java 17+. Snippets assume the static imports of `Selenide`, `Condition` and
  `CollectionCondition` (shown once in the "Static imports" entry). Any other import that is
  not obvious (`AppiumBy`, `CombinedBy`, `AppiumClickOptions`, `Selectors`) goes inside the
  snippet.
- One concept per snippet, no class boilerplate unless the concept is the class.
- `selenide.properties` snippets start with `# selenide.properties`. Maven snippets are XML
  starting with `<dependency>`. Gradle snippets use Kotlin DSL.
- Mobile entries use selenide-appium's own API only. `AppiumBy` and other java-client
  classes appear only inside Selenide calls or a `WebDriverProvider`.

### Adding a new category

1. Create `js/data/<cls>.js` with `export default { cat, cls, color, items }`
2. In `js/data/index.js`, add the `import` and an entry in `categories` (position = display
   order: web categories first, then mobile)
3. Add a `.<cls>` fill rule in `style.css` under its family comment, using the category's
   `color`. The fill must pass 4.5:1 against the tile text `#0f172a`; mobile categories stay
   in OKLCH hue 288 to 340, web categories outside it. Add `[cls, fill]` to the `PALETTE`
   table in `tests/cheatsheet.spec.js` at its display position
4. Add `tests/content/<cls>.spec.js`
5. Run `npm test`

### Adding commands to an existing category

Verify the API in `.cache/sources/` (`grep -rn`), write the guard test in
`tests/content/<cls>.spec.js` first, then append the entry next to its closest relative.

---

## Sources policy

| Source | Role |
|---|---|
| `.cache/sources/` (Maven Central sources jars, `npm run fetch:sources`) | **Final say** on names, signatures, defaults |
| `CHANGELOG.md` at tag `vX.Y.Z` of `github.com/selenide/selenide` | Release notes |
| Context7 `/selenide/selenide` | Discovery |
| `selenide.org` (docs, `javadoc/current/`) | Discovery, primary `docs` link target |
| `github.com/selenide/*`, `github.com/selenide-examples/selenide-appium` | Discovery, mobile setup patterns, `docs` links |
| `appium.io/docs/en/latest/`, `appium.github.io/appium-xcuitest-driver/`, `developer.android.com/training/testing/ui-automator` (approved 2026-10-16) | Appium-side syntax and tooling facts only (not `docs` targets) |

Anything else (blogs, DeepWiki, `appium.io`, Q&A sites) is named to the user and approved
before use. When Context7 or the docs disagree with the jar, the jar wins and the conflict is
reported. The real Selenide code is in `selenide-core`; `com.codeborne:selenide` holds
`Configuration`, `Selenide`, `WebDriverRunner` and the JUnit 5 extensions.

---

## Syntax Highlighting

`js/highlight.js` exports:

- **`highlight(code)`** — Java (also fine for Gradle Kotlin DSL)
- **`highlightShell(code)`** — `mvn`, `./gradlew`, shell snippets
- **`highlightXml(code)`** — `pom.xml` snippets
- **`pickHighlighter(item)`** — `'shell'` when `item.cls === 'cli'` or the code starts with
  `mvn `, `gradle `, `./gradlew `, `emulator `, `npm `, `npx ` or `#`; `'xml'` when it starts
  with `<`; `'java'` otherwise
- **`highlightFor(item)`** — applies the picked highlighter (used by the modal)

All are single-pass regex tokenizers that HTML-escape every character exactly once, so Copy
(`innerText`) always yields the original source; `highlight.spec.js` checks this round-trip
for every entry.

| Class | Java | Shell | XML |
|-------|------|-------|-----|
| `tok-keyword` | keywords (incl. `var`, `record`, `sealed`, `permits`, `non-sealed`), annotations | flags (`-x`, `--xyz`, `-Dselenide.browser`) | tag names |
| `tok-string` | `"..."`, `'c'`, text blocks `"""..."""` | quoted strings | attribute values after `=` |
| `tok-comment` | `//`, `/* */`, `/** */` | `#` at line start or after whitespace (`Class#method` is not a comment; `//` never is) | `<!-- -->` |
| `tok-number` | ints, `10L`, `1_000`, `0xFF`, `1.5f`, `2e3` | numbers | not used |
| `tok-fn` | method names before `(` | not used | attribute names |
| `tok-api` | Selenide / selenide-appium identifiers (`$`, `$$`, `open`, `Configuration`, `CombinedBy`, …) | program names (`mvn`, `./gradlew`, …) | `${property}` |

Unknown identifiers render plain. Add names to the `APIS` set as content needs them.

---

## Tile grid

Design: `docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md`.

- Each tile is a periodic-table cell: `button.tile` with a fixed number (position in the
  full dataset), level dots, a small prefix and a large monospace key (`splitName`), and
  the category. `.tile-name`'s `textContent` is always the full `name`.
- Categories are coloured by family (Setup, Finding, Acting, Debugging, Checking,
  Structure, Mobile), running around the colour wheel, and `js/data/index.js` keeps each
  family contiguous. Fills are OKLCH-derived pastels (lightness 0.71 to 0.92) with dark
  text `#0f172a`.
- Keyboard: one tab stop, arrow keys, Home and End; the modal returns focus to its tile.
- Desktop only (`(hover: hover) and (min-width: 900px)`): the sticky inspector and the
  category highlight on pill hover.

---

## Filters and URL state

| Mechanism | Used for |
|-----------|---------|
| URL hash | Filter + search state (`#filter=mobile&search=tap`, `#filter=Setup+%26+Config`) |
| Quick filters | All, ⭐ Start Here (`beginner`), 📱 Mobile (`mobile`: platform `mobile` or `both`), 🔥 Popular (`popular`, hidden while analytics are off) |
| `window.categories`, `window.highlight*`, `window.pickHighlighter`, `window.highlightFor`, `window.splitName`, `window.popularCommands` | Exposed for test access |

---

## Analytics (Supabase) — currently off

Analytics are **switched off** behind `ENABLED = false` flags marked `SUPABASE PLACEHOLDER`
in `js/popular-commands.js`, `js/visitor-counter.js` and `js/visitor-display.js`. While off,
no request is sent, the visitor badge shows `—`, and the Popular filter is hidden. The client
still points at the Playwright site's tables, so **do not flip the flags** until the
Selenide-specific backend exists: tables `selenide_visits` / `selenide_command_views`, RPCs
`increment_selenide_visits` / `increment_selenide_command_view`, Edge Functions
`increment-selenide-visitor` / `increment-selenide-command-view`. The steps are in the plan,
Task 8 (`docs/superpowers/plans/2026-10-13-selenide-cheat-sheet.md`). The analytics tests are
`test.describe.skip` until then, and `Analytics placeholder` in `meta-bar.spec.js` proves no
request reaches Supabase.

---

## Testing Patterns

### Expected values come from an independent source

Every expected value is hand-written from a source independent of the code or data under
test: the sources jar (with a comment citing file and signature), the token rules (literal
expected HTML), the spec's rules. Never compute an expected value with the code under test,
never paste current output in as the expectation, never assert an entry's facts by reading
the same entry. Write the test first and watch it fail.

### Accessing app internals

```js
const categories = await page.evaluate(() => window.categories);
const html = await page.evaluate(() => window.highlight('open("/login");'));
```

### Fixture data for exact UI expectations

```js
import { useFixtureData } from './helpers/fixture-data.js';
await useFixtureData(page);
await page.goto('/'); // full load; a hash-only goto is same-document and keeps the real data
```

### Mocking Supabase

```js
await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200 }));
```

### URL assertions

Use `await expect(page).toHaveURL(...)` (auto-retrying), never `expect(page.url())`:
`history.replaceState` reaches Playwright asynchronously.

---

## Code Style

- **Indentation:** 2 spaces · **Quotes:** single · **Semicolons:** required · **Trailing commas:** ES5 · **Line length:** ~100 chars (Prettier)
- **No em-dashes or en-dashes in command data**, including code comments. Use a period, comma, or colon, and a hyphen for ranges.
- **ESLint globals:** `eslint.config.js` has `js/**/*.js` and `tests/**/*.js` blocks with explicit globals. A browser global not on the list is `no-undef`.

---

## CI/CD

- **`test.yml`** — push / PR to `master`: chromium, iPhone 16, Pixel 7 matrix; the chromium job also runs `npm run test:scripts`.
- **`stamp-date.yml`** — push to `master`: writes `js/meta.json` and commits with `[skip ci]`.
- **`cheatsheet-sync.yml`** — 06:00 UTC on the 1st and 15th, plus manual dispatch (`dry_run`). A deterministic "Detect drift" step runs `release:delta --check` and `check:links` first; the agent runs only on drift or a manual run, fetches sources, follows the `selenide-release-sync` skill, and opens a PR (draft + `[CI FAILING]` if a gate fails). It never merges. Locally, ask Claude Code to "sync the cheat sheet to the latest Selenide".

---

## Important Gotchas

- **No build step.** Never introduce a bundler, transpiler, or CDN import.
- **`npm run lint` covers `js/` only.** Test files and the skill scripts are Prettier-formatted, not linted (`npx prettier --check .claude/skills/selenide-release-sync/scripts/`).
- **`js/meta.json` is auto-updated by CI.** Do not edit it; a stale date on `develop` is expected.
- **`.cache/` is gitignored.** Run `npm run fetch:sources` after cloning and after bumping `js/versions.json`.
- **Version bumps** touch `js/versions.json`, the `#selenide-version` and `#cmd-count` fallbacks in `index.html`, the readme badge, this file's tech table, the dependency snippets, and the pinned object in `meta-bar.spec.js`. Follow the skill.
- **Mobile tests use real device emulation** (`iPhone 16`, `Pixel 7`). Desktop-only UI tests may fail on mobile.
