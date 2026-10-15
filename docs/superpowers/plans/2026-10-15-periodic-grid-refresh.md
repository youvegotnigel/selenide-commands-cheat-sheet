# Periodic Grid Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the tile grid read like a periodic table: element-cell tiles (fixed number,
level dots, large monospace key, small prefix, category), square cells, colour families with
AA contrast, keyboard navigation, a category highlight from the filter bar and a desktop
inspector.

**Architecture:** Static vanilla ES modules, no build step. Three new focused modules sit
beside `js/app.js`: `js/tile.js` (name split, break points, size, the tile button),
`js/grid-keys.js` (roving tabindex and arrow keys) and `js/inspector.js` (the preview
panel). `app.js` keeps state, filtering, rendering and the modal, and wires the new modules
in. Colours live only in `style.css` and each category's `color`.

**Tech Stack:** HTML5, CSS3, ES2022 modules, `@playwright/test` 1.64 (tests only), ESLint 9,
Prettier 3, `serve`.

**Spec:** [`docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md`](../specs/2026-10-15-periodic-grid-refresh-design.md).
Read it before any task. The approved clickable preview is
`https://claude.ai/artifact/DpVrkoXfwrXYAXLW6yvNn1`.

## Global Constraints

- No build step, no bundler, no transpiler, no framework, no CDN imports, no web fonts.
- Zero runtime dependencies. Everything in `package.json` stays a `devDependency`.
- Gates for every task: `npm test`, `npm run lint`, `npm run format:check` all pass.
- Code style: 2-space indent, single quotes, semicolons, ES5 trailing commas, ~100 char lines. Run `npm run format` before each commit.
- Work on branch `develop`. Commit at the end of each task. Never push, never touch `master`.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Data schema is unchanged: no new item or category fields. Only each category's `color` value changes.
- No em-dash `—` or en-dash `–` in `js/data/` (including comments).
- Tile text colour is `#0f172a` for every category; every fill passes WCAG 4.5:1 against it.
- Tile number = 1-based position in the full dataset, stable across filters, search and views.
- `.tile-name`'s `textContent` equals `item.name` exactly (no `<br>`, no extra text).
- Desktop-only features (inspector, pill highlight) are gated by `(hover: hover) and (min-width: 900px)`.
- **Test oracle rule:** every expected value is hand-written from the spec (tables, examples, rules) or from the hand-written fixtures. Never compute an expected value with the code under test, never paste current output as the expectation. Run each new test and see it fail for the expected reason before writing the code that makes it pass.
- Supabase analytics stay off (`ENABLED = false`). Do not flip the flags.

## Review Focus

1. **Tapping a category pill on a phone.** A tap fires `mouseenter` before `click`; tiles must never be left dimmed on touch devices. Pinned in Task 5.
2. **Snippets that open with imports or comments.** The inspector must show the first real line (`$("#a").click();`), and fall back to the first non-blank line for comment-only snippets. Pinned in Task 6.
3. **A `(` after a space.** `Selenide dependency (Maven)` must not offer a break after `(`, so it never renders as `dependency (` / `Maven)`. Pinned in Task 2.
4. **Escape with no modal open, and closing the modal by mouse.** Escape must not move focus when nothing is open; Close, × and backdrop all return focus to the opening tile. Pinned in Task 4.
5. **Re-render while focus is deep in the grid.** After a filter, search or view change there is exactly one tab stop, the first tile. Pinned in Task 4.

---

## File map

| File | Responsibility | Tasks |
|---|---|---|
| `style.css` | Font tokens, grid sizing, tile cell, 21 fills, dimmed state, inspector | 1, 3, 5, 6 |
| `index.html` | `#inspector` container | 6 |
| `js/tile.js` (new) | `splitName`, `appendWithBreaks`, `keySize`, `LEVEL_LABELS`, `buildTile` | 2, 3 |
| `js/grid-keys.js` (new) | `initGridKeys`, `resetRoving` | 4 |
| `js/inspector.js` (new) | `firstMeaningfulLine`, `showInspector`, `clearInspector`, `INSPECTOR_PLACEHOLDER` | 6 |
| `js/app.js` | Item numbers, `makeTile` wiring, modal focus, pill highlight, inspector wiring | 2, 3, 4, 5, 6 |
| `js/data/index.js` | Category order (families contiguous) | 1 |
| `js/data/*.js` (21 modules) | `color` = new fill | 1 |
| `tests/cheatsheet.spec.js` | "Tile colours" replaces "Tile gradients"; `.textContent()` reads | 1, 3 |
| `tests/popular-commands.spec.js` | `.textContent()` read | 3 |
| `tests/helpers/fixture-data.js` | `CELL_FIXTURE` | 3 |
| `tests/grid-cells.spec.js` (new) | Helpers, cell anatomy, numbers, layout | 2, 3 |
| `tests/grid-interactions.spec.js` (new) | Keyboard, highlight, inspector | 4, 5, 6 |
| `CLAUDE.md`, `README.md`, base spec, `images/dashboard.jpeg` | Docs | 7 |

---

### Task 1: Colour families and category order

**Files:**
- Modify: `style.css` (the 21 gradient rules and their two comments, and the `.tile` rule)
- Modify: `js/data/index.js` (the `categories` array)
- Modify: `js/data/*.js` (line 5, `color:` in all 21 modules)
- Test: `tests/cheatsheet.spec.js` (replace the whole `Tile gradients` describe block at the end)

**Interfaces:**
- Consumes: nothing new.
- Produces: `window.categories` in family order (spec section 6, `#` column); every `.tile.<cls>` has a flat fill and `color: rgb(15, 23, 42)`.

- [ ] **Step 1: Commit the approved spec and this plan**

```bash
git add docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md docs/superpowers/plans/2026-10-15-periodic-grid-refresh.md
git commit -m "Add periodic grid refresh spec and plan

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 2: Write the failing tests**

In `tests/cheatsheet.spec.js`, replace everything from the comment line
`/* ── TILE GRADIENTS (expected values from the spec, section 6) ──── */` to the end of the
file with:

```js
/* ── TILE COLOURS (expected values from the 2026-10-15 spec, section 6) ──── */
test.describe('Tile colours', () => {
  // [cls, fill], hand-copied from the spec's colour-family table, in display order
  const PALETTE = [
    ['config', '#72a0f5'],
    ['navigation', '#76bafe'],
    ['remote', '#8ad1ff'],
    ['cli', '#a3e7ff'],
    ['selector', '#3bcddc'],
    ['collection', '#75ecde'],
    ['action', '#3ec87d'],
    ['window', '#84d987'],
    ['file', '#b8e688'],
    ['javascript', '#e2f07d'],
    ['report', '#f4c43a'],
    ['network', '#f4e886'],
    ['condition', '#f98e52'],
    ['wait', '#feb671'],
    ['page-object', '#f0777a'],
    ['pattern', '#f996a9'],
    ['framework', '#ffb5cd'],
    ['appium-setup', '#9e92f3'],
    ['mobile-selector', '#c79ff4'],
    ['mobile-gesture', '#e9aff2'],
    ['mobile-context', '#ffc2e9'],
  ];
  const rgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`;
  };
  const styleOf = (page) =>
    page.evaluate(
      (classes) =>
        classes.map((cls) => {
          const el = document.createElement('div');
          el.className = `tile ${cls}`;
          document.body.appendChild(el);
          const s = getComputedStyle(el);
          const out = { bg: s.backgroundColor, image: s.backgroundImage, color: s.color };
          el.remove();
          return out;
        }),
      PALETTE.map(([cls]) => cls)
    );

  test('every category class renders a flat fill with dark text', async ({ page }) => {
    expect(await styleOf(page)).toEqual(
      PALETTE.map(([, fill]) => ({ bg: rgb(fill), image: 'none', color: 'rgb(15, 23, 42)' }))
    );
  });

  test("every data category's color is its fill", async ({ page }) => {
    const cats = await page.evaluate(() => window.categories.map((c) => [c.cls, c.color]));
    const fill = Object.fromEntries(PALETTE);
    for (const [cls, color] of cats) expect(color.toLowerCase(), cls).toBe(fill[cls]);
  });

  test('categories are in family order', async ({ page }) => {
    const order = await page.evaluate(() => window.categories.map((c) => c.cls));
    expect(order).toEqual(PALETTE.map(([cls]) => cls));
  });

  // Guards future shade changes. WCAG 2.x relative luminance and contrast ratio.
  test('every fill meets WCAG AA (4.5:1) against the tile text', async ({ page }) => {
    const lum = (rgbStr) => {
      const [r, g, b] = rgbStr
        .match(/\d+/g)
        .slice(0, 3)
        .map((v) => {
          const c = Number(v) / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const styles = await styleOf(page);
    styles.forEach(({ bg, color }, i) => {
      const [hi, lo] = [lum(bg), lum(color)].sort((a, b) => b - a);
      expect((hi + 0.05) / (lo + 0.05), PALETTE[i][0]).toBeGreaterThanOrEqual(4.5);
    });
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm run test:chromium -- tests/cheatsheet.spec.js -g "Tile colours"`
Expected: "flat fill" FAILS (`bg` is `rgba(0, 0, 0, 0)` and `image` is a `linear-gradient`),
"color is its fill" FAILS on `config`, "family order" FAILS (`remote` is not 3rd). The
contrast test may already pass, because today's computed background is transparent; it is a
guard for later shade changes.

- [ ] **Step 4: Replace the gradients in `style.css`**

Replace the block that starts with `/* Web categories: same-hue gradients, hues outside violet/magenta */`
and ends with the `.mobile-context` rule with:

```css
/* Tile fills: one hue per family, one shade per category (spec 2026-10-15, section 6).
   Every fill passes 4.5:1 against the tile text #0f172a. */
/* Setup */
.config       { background: #72a0f5; }
.navigation   { background: #76bafe; }
.remote       { background: #8ad1ff; }
.cli          { background: #a3e7ff; }
/* Finding */
.selector     { background: #3bcddc; }
.collection   { background: #75ecde; }
/* Acting */
.action       { background: #3ec87d; }
.window       { background: #84d987; }
.file         { background: #b8e688; }
.javascript   { background: #e2f07d; }
/* Debugging */
.report       { background: #f4c43a; }
.network      { background: #f4e886; }
/* Checking */
.condition    { background: #f98e52; }
.wait         { background: #feb671; }
/* Structure */
.page-object  { background: #f0777a; }
.pattern      { background: #f996a9; }
.framework    { background: #ffb5cd; }
/* Mobile (selenide-appium): violet to pink, hue 288 to 340 */
.appium-setup { background: #9e92f3; }
.mobile-selector { background: #c79ff4; }
.mobile-gesture { background: #e9aff2; }
.mobile-context { background: #ffc2e9; }
```

In the existing `.tile { ... }` rule, add `color: #0f172a;` as its last declaration.

- [ ] **Step 5: Set each category's `color`**

```bash
while read -r cls hex; do
  sed -i '' -E "s/^  color: '#[0-9a-fA-F]{6}',$/  color: '$hex',/" "js/data/$cls.js"
done <<'EOF'
config #72a0f5
navigation #76bafe
remote #8ad1ff
cli #a3e7ff
selector #3bcddc
collection #75ecde
action #3ec87d
window #84d987
file #b8e688
javascript #e2f07d
report #f4c43a
network #f4e886
condition #f98e52
wait #feb671
page-object #f0777a
pattern #f996a9
framework #ffb5cd
appium-setup #9e92f3
mobile-selector #c79ff4
mobile-gesture #e9aff2
mobile-context #ffc2e9
EOF
grep -n "^  color:" js/data/*.js
```

(`sed -i ''` is the macOS form; on Linux use `sed -i`.) Check the grep output: 21 lines,
each with the hex from the list above.

- [ ] **Step 6: Reorder `categories` in `js/data/index.js`**

Leave the imports as they are. Replace the `categories` array with:

```js
/** @type {Category[]} */
export const categories = [
  // Setup
  config,
  navigation,
  remote,
  cli,
  // Finding
  selector,
  collection,
  // Acting
  action,
  windowCat,
  file,
  javascript,
  // Debugging
  report,
  network,
  // Checking
  condition,
  wait,
  // Structure
  pageObject,
  pattern,
  framework,
  // Mobile
  appiumSetup,
  mobileSelector,
  mobileGesture,
  mobileContext,
];
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm run test:chromium -- tests/cheatsheet.spec.js -g "Tile colours"`
Expected: 4 passed.

- [ ] **Step 8: Run all gates**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass. (The old level dots now sit on light fills; Task 3 replaces them.)

- [ ] **Step 9: Commit**

```bash
npm run format
git add style.css js/data tests/cheatsheet.spec.js
git commit -m "Colour tiles by family with dark text, regroup categories

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Name split, break points and key size

**Files:**
- Create: `js/tile.js`
- Modify: `js/app.js` (imports and `window.*` exposure at the top)
- Test: `tests/grid-cells.spec.js` (new)

**Interfaces:**
- Consumes: nothing.
- Produces, in `js/tile.js`:
  - `splitName(name: string): { prefix: string, key: string }`
  - `appendWithBreaks(parent: Element, text: string): void` (appends text nodes and `<wbr>` elements)
  - `keySize(key: string): 's' | 'm' | 'l'`
  - `window.splitName` (set in `app.js`)

- [ ] **Step 1: Write the failing tests**

Create `tests/grid-cells.spec.js`:

```js
import { test, expect } from '@playwright/test';

// Expected values are hand-written from docs/superpowers/specs/
// 2026-10-15-periodic-grid-refresh-design.md; each block cites its section.

test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, body: '' }));
});

/* ── splitName (spec section 3, the example table) ─────────────── */
test.describe('splitName', () => {
  const CASES = [
    ['Configuration.browserSize', 'Configuration.', 'browserSize'],
    ['Configuration.browser (htmlunit)', 'Configuration.', 'browser (htmlunit)'],
    ['webdriver().shouldHave(urlContaining())', 'webdriver().', 'shouldHave(urlContaining())'],
    ['SelenideAppium.switchTo().context()', 'SelenideAppium.switchTo().', 'context()'],
    ['CombinedBy.android().ios()', 'CombinedBy.android().', 'ios()'],
    ['SelenideAppium.$()', 'SelenideAppium.', '$()'],
    ['selenide.properties file', '', 'selenide.properties file'],
    ['./gradlew test (forward -Dselenide.*)', '', './gradlew test (forward -Dselenide.*)'],
    ['System properties (-Dselenide.*)', '', 'System properties (-Dselenide.*)'],
    ['$(AppiumBy.accessibilityId())', '', '$(AppiumBy.accessibilityId())'],
    ['shouldHave(text())', '', 'shouldHave(text())'],
  ];

  test('splits identifier-chain prefixes and nothing else', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(
      (names) => names.map((n) => window.splitName(n)),
      CASES.map(([n]) => n)
    );
    expect(actual).toEqual(CASES.map(([, prefix, key]) => ({ prefix, key })));
  });
});

/* ── Break opportunities (spec section 3) ─────────────────────── */
test.describe('appendWithBreaks', () => {
  // [input, expected innerHTML]: <wbr> after "." and ",", after "(" that follows an
  // identifier character, and before an uppercase letter that follows a lowercase one.
  const CASES = [
    ['browserSize', 'browser<wbr>Size'],
    ['Configuration.', 'Configuration.<wbr>'],
    ['SelenideAppium.', 'Selenide<wbr>Appium.<wbr>'],
    ['shouldHave(text())', 'should<wbr>Have(<wbr>text(<wbr>))'],
    ['$()', '$(<wbr>)'],
    ['Selenide dependency (Maven)', 'Selenide dependency (Maven)'],
    ['a,b', 'a,<wbr>b'],
  ];

  test('inserts <wbr> only at the spec break points and adds no text', async ({ page }) => {
    await page.goto('/');
    const actual = await page.evaluate(async (inputs) => {
      const { appendWithBreaks } = await import('/js/tile.js');
      return inputs.map((text) => {
        const span = document.createElement('span');
        appendWithBreaks(span, text);
        return [span.innerHTML, span.textContent];
      });
    }, CASES.map(([t]) => t));
    expect(actual).toEqual(CASES.map(([text, html]) => [html, text]));
  });
});

/* ── keySize (spec section 3, "Symbol size") ───────────────────── */
test.describe('keySize', () => {
  test('1-12 chars is s, 13-24 is m, 25+ is l', async ({ page }) => {
    await page.goto('/');
    const lengths = [1, 3, 12, 13, 24, 25, 51];
    const actual = await page.evaluate(async (lens) => {
      const { keySize } = await import('/js/tile.js');
      return lens.map((n) => keySize('x'.repeat(n)));
    }, lengths);
    expect(actual).toEqual(['s', 's', 's', 'm', 'm', 'l', 'l']);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:chromium -- tests/grid-cells.spec.js`
Expected: 3 FAIL: `window.splitName is not a function`, and the dynamic import of `/js/tile.js` fails with a 404.

- [ ] **Step 3: Create `js/tile.js`**

```js
// =============================================================
// tile.js — periodic-table cell: name split, break points, size
// (docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md, section 3)
// =============================================================

// A leading chain of Java identifiers, each optionally followed by "()", each ending in "."
const PREFIX_RE = /^(?:[A-Za-z_$][\w$]*(?:\(\))?\.)+/;
// What may follow a prefix: an identifier, optional call parens, optional " (note)"
const KEY_RE = /^[A-Za-z_$][\w$]*(?:\(.*\))?(?: \(.*\))?$/;

/** Splits a command name into a small prefix and the large key. */
export function splitName(name) {
  const match = name.match(PREFIX_RE);
  if (match) {
    const key = name.slice(match[0].length);
    if (KEY_RE.test(key)) return { prefix: match[0], key };
  }
  return { prefix: '', key: name };
}

/**
 * Appends text to parent as text nodes with <wbr> break opportunities. Adds no text, so
 * parent.textContent grows by exactly `text`.
 */
export function appendWithBreaks(parent, text) {
  let run = '';
  const flush = () => {
    if (run) parent.appendChild(document.createTextNode(run));
    run = '';
  };
  const wbr = () => {
    flush();
    parent.appendChild(document.createElement('wbr'));
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : '';
    if (/[A-Z]/.test(ch) && /[a-z]/.test(prev)) wbr();
    run += ch;
    if (ch === '.' || ch === ',' || (ch === '(' && /[\w$]/.test(prev))) wbr();
  }
  flush();
}

/** Size class for the key: 's' (1-12 chars), 'm' (13-24), 'l' (25+). */
export function keySize(key) {
  if (key.length <= 12) return 's';
  if (key.length <= 24) return 'm';
  return 'l';
}
```

- [ ] **Step 4: Expose `splitName` in `js/app.js`**

After the line `import * as popularCmds from './popular-commands.js';` add:

```js
import { splitName } from './tile.js';
```

After the line `window.popularCommands = popularCmds;` add:

```js
// Expose for tests via page.evaluate() (same rationale as window.categories)
window.splitName = splitName;
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run test:chromium -- tests/grid-cells.spec.js`
Expected: 3 passed.

- [ ] **Step 6: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
npm run format
git add js/tile.js js/app.js tests/grid-cells.spec.js
git commit -m "Add name split, break points and key size for tiles

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Tile cell, square grid and fonts

**Files:**
- Modify: `js/tile.js` (add `LEVEL_LABELS`, `buildTile`)
- Modify: `js/app.js` (`allItems` numbering, `renderFlat`, `renderGrouped`, the `TILE` section)
- Modify: `style.css` (`:root` tokens, `body`, `.meta-badge`, `.search-shortcut`, `.grid`, `.tile*`, `.modal-title`, `pre`)
- Modify: `tests/helpers/fixture-data.js` (add `CELL_FIXTURE`)
- Modify: `tests/cheatsheet.spec.js:178,241,242` and `tests/popular-commands.spec.js:97` (`.innerText()` → `.textContent()` on `.tile-name`)
- Test: `tests/grid-cells.spec.js`

**Interfaces:**
- Consumes: `splitName`, `appendWithBreaks`, `keySize` from Task 2.
- Produces:
  - `LEVEL_LABELS: { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }` exported from `js/tile.js`
  - `buildTile(item, { popular?: boolean }): HTMLButtonElement`, where `item` has `name, level, cat, cls, num`
  - every item in `app.js`'s `allItems` has `num` (1-based position in the full dataset)
  - tile DOM: `button.tile.<cls>[type=button][data-cls][aria-label]` > `.tile-num`, optional `.tile-popular`, `.tile-level`, `.tile-name` > (optional `.tile-prefix`) + `.tile-key.tile-key--{s|m|l}`, then `.tile-cat`
  - `makeTile(item)` in `app.js` (one argument) adds the click listener

- [ ] **Step 1: Add `CELL_FIXTURE` to `tests/helpers/fixture-data.js`**

Add after `FIXTURE_CATEGORIES`:

```js
// Names chosen for the cell rules in the 2026-10-15 spec, section 3: prefixes, a "(" after a
// space, and key lengths 3, 11, 12, 13, 18, 24, 25 and 27 around the size boundaries.
export const CELL_FIXTURE = [
  {
    cat: 'Setup & Config',
    cls: 'config',
    color: '#72a0f5',
    items: [
      item('Configuration.browserSize', 'intermediate', 'web', 'Configuration.browserSize = "1920x1080";'),
      item('SelenideAppium.$()', 'beginner', 'mobile', 'SelenideAppium.$(By.id("x")).tap();'),
      item('pageLoadTime', 'advanced', 'web', 'Configuration.pageLoadTimeout = 30000;'),
      item('thirteen_char', 'beginner', 'web', 'open("/thirteen"); // fixture'),
      item('twenty_four_characters_x', 'beginner', 'web', 'open("/twenty-four"); // fixture'),
      item('twenty_five_characters_xy', 'beginner', 'web', 'open("/twenty-five"); // fixture'),
      item('Selenide dependency (Maven)', 'beginner', 'web', '<dependency>fixture</dependency>'),
    ],
  },
  {
    cat: 'Conditions',
    cls: 'condition',
    color: '#fb923c',
    items: [item('shouldHave(text())', 'beginner', 'both', '$("h1").shouldHave(text("Hi"));')],
  },
];
```

- [ ] **Step 2: Write the failing tests**

In `tests/grid-cells.spec.js`, change the import block at the top to:

```js
import { test, expect } from '@playwright/test';
import { useFixtureData, CELL_FIXTURE } from './helpers/fixture-data.js';
```

and append:

```js
/* ── Tile cells (CELL_FIXTURE, spec section 3) ─────────────────── */
test.describe('Tile cells', () => {
  const NAMES = [
    'Configuration.browserSize',
    'SelenideAppium.$()',
    'pageLoadTime',
    'thirteen_char',
    'twenty_four_characters_x',
    'twenty_five_characters_xy',
    'Selenide dependency (Maven)',
    'shouldHave(text())',
  ];

  test.beforeEach(async ({ page }) => {
    await useFixtureData(page, CELL_FIXTURE);
    await page.goto('/');
  });

  test('every tile is a type="button" button', async ({ page }) => {
    const kinds = await page
      .locator('.tile')
      .evaluateAll((els) => els.map((e) => `${e.tagName} ${e.getAttribute('type')}`));
    expect(kinds).toEqual(Array(8).fill('BUTTON button'));
  });

  test('.tile-name text is exactly the command name', async ({ page }) => {
    await expect(page.locator('.tile-name')).toHaveText(NAMES);
  });

  test('prefix and key follow the split rule', async ({ page }) => {
    await expect(page.locator('.tile-prefix')).toHaveText(['Configuration.', 'SelenideAppium.']);
    const first = page.locator('.tile').first();
    expect(await first.locator('.tile-key').innerHTML()).toBe('browser<wbr>Size');
    expect(await page.locator('.tile').nth(6).locator('.tile-key').innerHTML()).toBe(
      'Selenide dependency (Maven)'
    );
  });

  test('key size class follows key length', async ({ page }) => {
    const sizes = await page
      .locator('.tile-key')
      .evaluateAll((els) => els.map((e) => e.className.match(/tile-key--(\w)/)[1]));
    // keys: browserSize 11, $() 3, pageLoadTime 12, thirteen_char 13,
    // twenty_four_characters_x 24, twenty_five_characters_xy 25,
    // Selenide dependency (Maven) 27, shouldHave(text()) 18
    expect(sizes).toEqual(['s', 's', 's', 'm', 'm', 'l', 'l', 'm']);
  });

  test('level shows as dots and in the accessible name', async ({ page }) => {
    await expect(page.locator('.tile-level')).toHaveText([
      '●●',
      '●',
      '●●●',
      '●',
      '●',
      '●',
      '●',
      '●',
    ]);
    await expect(page.locator('.tile').first()).toHaveAttribute(
      'aria-label',
      'Configuration.browserSize, Setup & Config, Intermediate'
    );
    await expect(page.locator('.tile').nth(2)).toHaveAttribute(
      'aria-label',
      'pageLoadTime, Setup & Config, Advanced'
    );
  });

  test('each tile names its category', async ({ page }) => {
    await expect(page.locator('.tile-cat')).toHaveText([
      ...Array(7).fill('Setup & Config'),
      'Conditions',
    ]);
  });

  test('command names use the monospace font', async ({ page }) => {
    const family = await page
      .locator('.tile-name')
      .first()
      .evaluate((e) => getComputedStyle(e).fontFamily);
    expect(family).toContain('monospace');
  });
});

/* ── Tile numbers (FIXTURE_CATEGORIES order: alpha, beta, gamma, delta, epsilon) ── */
test.describe('Tile numbers', () => {
  test.beforeEach(async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
  });

  test('number is the position in the full dataset', async ({ page }) => {
    await expect(page.locator('.tile-num')).toHaveText(['1', '2', '3', '4', '5']);
  });

  test('numbers survive a category filter', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'Conditions' }).click();
    await expect(page.locator('.tile-num')).toHaveText(['3']);
  });

  test('numbers survive search', async ({ page }) => {
    await page.locator('#search-input').fill('epsilon');
    await expect(page.locator('.tile-num')).toHaveText(['5']);
  });

  test('numbers survive grouped view', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.tile-num')).toHaveText(['1', '2', '3', '4', '5']);
  });
});

/* ── Grid layout (spec section 4) ─────────────────────────────── */
test.describe('Grid layout', () => {
  const columns = (page) =>
    page
      .locator('#grid .grid')
      .first()
      .evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(' ').length);
  const noSidewaysScroll = async (page) => {
    const [scroll, client] = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.documentElement.clientWidth,
    ]);
    expect(scroll).toBeLessThanOrEqual(client);
  };

  test('2 columns and no sideways scroll at 320px', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop viewport sizes');
    await page.setViewportSize({ width: 320, height: 800 });
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(2);
    await noSidewaysScroll(page);
  });

  test('6 columns at 1200px', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop viewport sizes');
    await page.setViewportSize({ width: 1200, height: 800 });
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(6);
  });

  test('a short-name tile is square', async ({ page }) => {
    await useFixtureData(page);
    await page.goto('/');
    const box = await page.locator('.tile').first().boundingBox();
    expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  });

  test('phones get 2 columns without sideways scroll', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'device emulation only');
    await useFixtureData(page);
    await page.goto('/');
    expect(await columns(page)).toBe(2);
    await noSidewaysScroll(page);
  });
});
```

- [ ] **Step 3: Switch `.tile-name` reads to `textContent`**

The prefix becomes a block element, so `innerText` would add a line break. Change these
four reads (spec section 9):

- `tests/cheatsheet.spec.js:178`: `await firstTile.locator('.tile-name').innerText();` → `await firstTile.locator('.tile-name').textContent();`
- `tests/cheatsheet.spec.js:241`: `tiles.nth(0).locator('.tile-name').innerText()` → `tiles.nth(0).locator('.tile-name').textContent()`
- `tests/cheatsheet.spec.js:242`: `tiles.nth(1).locator('.tile-name').innerText()` → `tiles.nth(1).locator('.tile-name').textContent()`
- `tests/popular-commands.spec.js:97`: `tile.locator('.tile-name').innerText()` → `tile.locator('.tile-name').textContent()`

- [ ] **Step 4: Run the tests to verify they fail**

Run: `npm test -- tests/grid-cells.spec.js`
Expected: the `Tile cells` tests FAIL (tiles are `DIV`, there is no `.tile-prefix`, `.tile-key`
or `.tile-cat`, and the font is Arial). `Tile numbers` FAILS (text is `#1`; under a filter, `#1`
instead of `3`). `Grid layout` FAILS (7 columns at 1200px, the tile is not square). The
Task 2 tests still pass.

- [ ] **Step 5: Add `LEVEL_LABELS` and `buildTile` to `js/tile.js`**

Append:

```js
export const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
const LEVEL_DOTS = { beginner: '●', intermediate: '●●', advanced: '●●●' };

function span(cls, text) {
  const el = document.createElement('span');
  el.className = cls;
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * Builds the periodic-table cell for one item. The caller attaches listeners.
 * @param {{ name: string, level: string, cat: string, cls: string, num: number }} item
 * @param {{ popular?: boolean }} [opts]
 */
export function buildTile(item, { popular = false } = {}) {
  const tile = document.createElement('button');
  tile.type = 'button';
  tile.className = `tile ${item.cls}`;
  tile.dataset.cls = item.cls;
  tile.setAttribute('aria-label', `${item.name}, ${item.cat}, ${LEVEL_LABELS[item.level]}`);

  tile.appendChild(span('tile-num', String(item.num)));
  if (popular) {
    const fire = span('tile-popular', '🔥');
    fire.title = 'Popular';
    tile.appendChild(fire);
  }
  const level = span('tile-level', LEVEL_DOTS[item.level]);
  level.setAttribute('aria-hidden', 'true');
  tile.appendChild(level);

  const { prefix, key } = splitName(item.name);
  const name = span('tile-name');
  if (prefix) {
    const prefixEl = span('tile-prefix');
    appendWithBreaks(prefixEl, prefix);
    name.appendChild(prefixEl);
  }
  const keyEl = span(`tile-key tile-key--${keySize(key)}`);
  appendWithBreaks(keyEl, key);
  name.appendChild(keyEl);
  tile.appendChild(name);

  tile.appendChild(span('tile-cat', item.cat));
  return tile;
}
```

- [ ] **Step 6: Wire it into `js/app.js`**

Change the import to `import { splitName, buildTile } from './tile.js';`.

Replace the `allItems` block:

```js
// Flatten all items into a single array, tagging each with its category info and its
// "atomic number": the 1-based position in the full dataset, stable across filters
const allItems = [];
categories.forEach((sec) =>
  sec.items.forEach((item) =>
    allItems.push({
      ...item,
      cls: sec.cls,
      cat: sec.cat,
      color: sec.color,
      num: allItems.length + 1,
    })
  )
);
```

In `renderFlat`, change `items.forEach((item, i) => grid.appendChild(makeTile(item, i + 1)));`
to `items.forEach((item) => grid.appendChild(makeTile(item)));`.

In `renderGrouped`, change
`groups[sec.cat].forEach((item, i) => grid.appendChild(makeTile(item, i + 1)));` to
`groups[sec.cat].forEach((item) => grid.appendChild(makeTile(item)));`.

Replace the whole `/* ── TILE ── */` section (`levelDots` and the old `makeTile`) with:

```js
/* ── TILE ─────────────────────────────────────────────────────── */
function makeTile(item) {
  const tile = buildTile(item, { popular: popularCmds.isPopular(popularCmds.commandId(item)) });
  tile.addEventListener('click', () => openModal(item));
  return tile;
}
```

- [ ] **Step 7: Update `style.css`**

Add at the very top of the file:

```css
:root {
  --font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
}
```

Then make these replacements:

- `body { font-family: Arial, sans-serif; ...` → `body { font-family: var(--font-sans); ...` (keep the rest of the rule)
- In `.meta-badge`: `font-family: ui-monospace, Menlo, Consolas, monospace;` → `font-family: var(--font-mono);`
- In `.search-shortcut`: `font-family: monospace;` → `font-family: var(--font-mono);`
- In `.modal-title`: add `font-family: var(--font-mono);`
- In `pre`: add `font-family: var(--font-mono);`

Replace the `.grid` rule with:

```css
/* Square cells, at least 2 columns at 320px (spec 2026-10-15, section 4) */
.grid {
  display: grid; gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(min(160px, calc(50% - 6px)), 1fr));
}
```

Replace the `.tile` and `.tile:hover` rules (keep the fills from Task 1 where they are) with:

```css
/* Periodic-table cell (spec 2026-10-15, section 3) */
.tile {
  position: relative; aspect-ratio: 1; max-width: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 8px; border: 0; border-radius: 12px; cursor: pointer;
  color: #0f172a; font-family: var(--font-sans); text-align: center;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.tile:hover {
  transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  outline: 2px solid rgba(255,255,255,0.85);
}
.tile:focus-visible { outline: 3px solid #f8fafc; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .tile { transition: none; }
  .tile:hover { transform: none; }
}
```

Replace the `.tile-level`, `.tile-popular`, `.tile-inner`, `.tile-num` and `.tile-name`
rules with:

```css
.tile-num {
  position: absolute; top: 8px; left: 9px; line-height: 1;
  font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums;
}
.tile-popular { position: absolute; top: 6px; left: 34px; font-size: 11px; line-height: 1; }
.tile-level {
  position: absolute; top: 7px; right: 9px; line-height: 1;
  font-size: 10px; letter-spacing: 2px;
}
.tile-name {
  width: 100%; min-width: 0; margin-block: 14px; padding-inline: 2px;
  font-family: var(--font-mono); overflow-wrap: break-word;
}
.tile-prefix { display: block; margin-bottom: 2px; font-size: 11px; opacity: 0.7; }
.tile-key    { display: block; font-weight: 600; line-height: 1.25; }
.tile-key--s { font-size: 18px; }
.tile-key--m { font-size: 15px; }
.tile-key--l { font-size: 13px; }
.tile-cat {
  position: absolute; left: 8px; right: 8px; bottom: 8px;
  font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;
  opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
```

- [ ] **Step 8: Run the tests to verify they pass**

Run: `npm test -- tests/grid-cells.spec.js`
Expected: all pass on all three projects (desktop-only and phone-only tests skip where noted).
If the 320px no-sideways-scroll check fails because of an element outside `#grid` (header,
meta bar, filters), stop and report it rather than restyling that element.

- [ ] **Step 9: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
npm run format
git add js/tile.js js/app.js style.css tests
git commit -m "Render tiles as periodic-table cells with square grid and mono names

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Keyboard navigation and modal focus

**Files:**
- Create: `js/grid-keys.js`
- Modify: `js/app.js` (import, `render()`, `makeTile`, `openModal`, `closeModal`, init)
- Test: `tests/grid-interactions.spec.js` (new)

**Interfaces:**
- Consumes: tile DOM from Task 3 (`button.tile` inside `#grid`).
- Produces:
  - `initGridKeys(root: Element): void` (keydown and focusin listeners on `#grid`)
  - `resetRoving(root: Element): void` (first tile `tabindex="0"`, others `-1`)
  - `openModal(item, opener)` in `app.js`; `closeModal()` returns focus to `opener`

- [ ] **Step 1: Write the failing tests**

Create `tests/grid-interactions.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { useFixtureData } from './helpers/fixture-data.js';

// Expected values are hand-written from docs/superpowers/specs/
// 2026-10-15-periodic-grid-refresh-design.md (section 7) and the fixture order
// alpha, beta (Setup & Config), gamma (Conditions), delta, epsilon (Mobile Selectors).

test.beforeEach(async ({ page }) => {
  await page.route('**/rest/v1/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/functions/v1/**', (route) => route.fulfill({ status: 200, body: '' }));
  await useFixtureData(page);
  await page.goto('/');
});

const tile = (page, name) => page.locator('.tile', { hasText: name });

/* ── Keyboard (spec section 7) ─────────────────────────────────── */
test.describe('Keyboard', () => {
  test.beforeEach(async ({ isMobile }) => {
    test.skip(isMobile, 'keyboard navigation is a desktop concern');
  });

  test('Tab enters the grid on the first tile; only one tile is a tab stop', async ({ page }) => {
    await page.locator('#btnGrouped').focus();
    await page.keyboard.press('Tab');
    await expect(tile(page, 'alpha()')).toBeFocused();
    await expect(page.locator('.tile[tabindex="0"]')).toHaveCount(1);
  });

  test('ArrowRight, ArrowLeft, End and Home move focus', async ({ page }) => {
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tile(page, 'beta()')).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(tile(page, 'alpha()')).toBeFocused();
    await page.keyboard.press('End');
    await expect(tile(page, 'epsilon()')).toBeFocused();
    await page.keyboard.press('Home');
    await expect(tile(page, 'alpha()')).toBeFocused();
  });

  test('ArrowDown and ArrowUp move by row (2 columns at 400px)', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 900 });
    // rows: [alpha, beta], [gamma, delta], [epsilon]
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'gamma()')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'epsilon()')).toBeFocused();
    await page.keyboard.press('ArrowUp');
    await expect(tile(page, 'gamma()')).toBeFocused();
  });

  test('ArrowDown crosses group sections in grouped view', async ({ page }) => {
    await page.locator('#btnGrouped').click();
    await tile(page, 'alpha()').focus();
    await page.keyboard.press('ArrowDown');
    await expect(tile(page, 'gamma()')).toBeFocused();
  });

  test('Enter opens the modal on Copy; Escape closes it and refocuses the tile', async ({
    page,
  }) => {
    await tile(page, 'beta()').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#btn-copy')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();
    await expect(tile(page, 'beta()')).toBeFocused();
  });

  test('closing with Close, × or the backdrop refocuses the opener', async ({ page }) => {
    for (const close of [
      () => page.locator('.btn-close').click(),
      () => page.locator('.close-icon').click(),
      () => page.locator('#modal').click({ position: { x: 5, y: 5 } }),
    ]) {
      await tile(page, 'gamma()').click();
      await expect(page.locator('#modal')).toBeVisible();
      await close();
      await expect(page.locator('#modal')).toBeHidden();
      await expect(tile(page, 'gamma()')).toBeFocused();
    }
  });

  test('Escape with no modal open leaves focus where it is', async ({ page }) => {
    await tile(page, 'delta()').focus();
    await page.keyboard.press('Escape');
    await expect(tile(page, 'delta()')).toBeFocused();
  });

  test('a re-render resets the tab stop to the first tile', async ({ page }) => {
    await tile(page, 'delta()').focus();
    await expect(tile(page, 'delta()')).toHaveAttribute('tabindex', '0');
    await page.locator('#btnGrouped').click();
    await expect(page.locator('.tile[tabindex="0"]')).toHaveCount(1);
    await expect(tile(page, 'alpha()')).toHaveAttribute('tabindex', '0');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test:chromium -- tests/grid-interactions.spec.js`
Expected: FAIL. Every tile is a tab stop (count 5, not 1), the arrow keys do nothing,
`#btn-copy` is not focused on open, and focus is not returned on close. "Escape with no
modal open" may already pass.

- [ ] **Step 3: Create `js/grid-keys.js`**

```js
// =============================================================
// grid-keys.js — roving tabindex and arrow keys over the tile grid
// (docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md, section 7)
// =============================================================

const tilesIn = (root) => [...root.querySelectorAll('.tile')];

function moveTabStop(root, target) {
  tilesIn(root).forEach((t) => (t.tabIndex = t === target ? 0 : -1));
}

/** Makes the first tile the grid's only tab stop. Call after every render. */
export function resetRoving(root) {
  tilesIn(root).forEach((t, i) => (t.tabIndex = i === 0 ? 0 : -1));
}

// Nearest tile in the next row above (dir -1) or below (dir 1), by horizontal centre.
// Geometry-based, so it works across group sections and any column count.
function nearestInRow(tiles, from, dir) {
  const r = from.getBoundingClientRect();
  const centre = r.left + r.width / 2;
  let best = null;
  let bestGap = Infinity;
  let bestDx = Infinity;
  for (const t of tiles) {
    if (t === from) continue;
    const q = t.getBoundingClientRect();
    const gap = dir > 0 ? q.top - r.bottom : r.top - q.bottom;
    if (gap < -1) continue; // same row or the wrong direction
    const dx = Math.abs(q.left + q.width / 2 - centre);
    const closerRow = gap < bestGap - 1;
    const sameRowCloser = Math.abs(gap - bestGap) <= 1 && dx < bestDx;
    if (closerRow || sameRowCloser) {
      best = t;
      bestGap = gap;
      bestDx = dx;
    }
  }
  return best;
}

/** Arrow keys, Home and End move focus between tiles inside root. */
export function initGridKeys(root) {
  root.addEventListener('focusin', (e) => {
    if (e.target.classList.contains('tile')) moveTabStop(root, e.target);
  });

  root.addEventListener('keydown', (e) => {
    if (!e.target.classList.contains('tile')) return;
    const tiles = tilesIn(root);
    const i = tiles.indexOf(e.target);
    const moves = {
      ArrowRight: () => tiles[i + 1],
      ArrowLeft: () => tiles[i - 1],
      ArrowDown: () => nearestInRow(tiles, e.target, 1),
      ArrowUp: () => nearestInRow(tiles, e.target, -1),
      Home: () => tiles[0],
      End: () => tiles[tiles.length - 1],
    };
    if (!moves[e.key]) return;
    e.preventDefault();
    const next = moves[e.key]();
    if (next) next.focus();
  });
}
```

- [ ] **Step 4: Wire it into `js/app.js`**

Add the import after the `tile.js` import:

```js
import { initGridKeys, resetRoving } from './grid-keys.js';
```

In `render()`, after the closing brace of the `if (activeView === 'grouped') { ... } else { ... }`
block, add:

```js
  resetRoving(container);
```

In `makeTile`, change `tile.addEventListener('click', () => openModal(item));` to
`tile.addEventListener('click', () => openModal(item, tile));`.

Above `function openModal`, add:

```js
// The tile that opened the modal; focus returns to it on close
let modalOpener = null;
```

Change `function openModal(item) {` to `function openModal(item, opener) {`, add
`modalOpener = opener;` as its first line, and add `copyBtn.focus();` after the two lines
that reset `copyBtn`.

Replace `closeModal` with:

```js
function closeModal() {
  const modal = document.getElementById('modal');
  if (modal.style.display !== 'flex') return; // Escape with nothing open: leave focus alone
  modal.style.display = 'none';
  if (modalOpener?.isConnected) modalOpener.focus();
  modalOpener = null;
}
```

In the `INIT` section, after `buildFilters();`, add:

```js
initGridKeys(document.getElementById('grid'));
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- tests/grid-interactions.spec.js tests/cheatsheet.spec.js`
Expected: all pass (the Keyboard tests skip on the two phone projects; the existing Modal tests still pass).

- [ ] **Step 6: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
npm run format
git add js/grid-keys.js js/app.js tests/grid-interactions.spec.js
git commit -m "Add arrow-key grid navigation and return focus after the modal

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Category highlight from the filter bar

**Files:**
- Modify: `js/app.js` (`buildFilters`, new `highlightCategory`)
- Modify: `style.css` (`.tile.dimmed`)
- Test: `tests/grid-interactions.spec.js`

**Interfaces:**
- Consumes: `button.tile[data-cls]` from Task 3.
- Produces: `.dimmed` class on tiles while a category pill is hovered on desktop.

- [ ] **Step 1: Write the failing tests**

Append to `tests/grid-interactions.spec.js`:

```js
/* ── Category highlight (spec section 7) ───────────────────────── */
test.describe('Category highlight', () => {
  test('hovering a category pill dims the other categories', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover is desktop only');
    await page.locator('.filter-btn', { hasText: 'Conditions' }).hover();
    await expect(page.locator('.tile.dimmed')).toHaveCount(4);
    await expect(tile(page, 'gamma()')).not.toHaveClass(/dimmed/);
    await page.locator('header').hover();
    await expect(page.locator('.tile.dimmed')).toHaveCount(0);
  });

  test('hover neither filters nor changes the URL', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover is desktop only');
    await page.locator('.filter-btn', { hasText: 'Conditions' }).hover();
    await expect(page.locator('.tile')).toHaveCount(5);
    await expect(page).toHaveURL(/\/$/);
  });

  test('hovering a quick filter dims nothing', async ({ page, isMobile }) => {
    test.skip(isMobile, 'hover is desktop only');
    await page.locator('.filter-btn', { hasText: 'Start Here' }).hover();
    await expect(page.locator('.tile.dimmed')).toHaveCount(0);
  });

  // A tap fires mouseenter before click; on touch devices it must never dim.
  test('mouseenter on a phone dims nothing', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'touch devices only');
    await page.locator('.filter-btn', { hasText: 'Conditions' }).dispatchEvent('mouseenter');
    await expect(page.locator('.tile.dimmed')).toHaveCount(0);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/grid-interactions.spec.js -g "Category highlight"`
Expected: on chromium, "dims the other categories" FAILS (0 dimmed, expected 4). The other
three pass already and guard against regressions.

- [ ] **Step 3: Implement**

In `js/app.js`, in `buildFilters`, change the category entry to carry `cls`:

```js
    ...categories.map((c) => ({ label: c.cat, filter: c.cat, color: c.color, cls: c.cls })),
```

change the loop head to `defs.forEach(({ label, filter, color, cls }) => {`, and after the
`btn.addEventListener('click', ...)` line add:

```js
    if (cls) {
      btn.addEventListener('mouseenter', () => highlightCategory(cls));
      btn.addEventListener('mouseleave', () => highlightCategory(null));
    }
```

Above `function buildFilters`, add:

```js
// Hovering a category pill dims the other categories in place (desktop only: on touch
// devices a tap fires mouseenter too, and must not leave tiles dimmed)
const desktopHover = window.matchMedia('(hover: hover) and (min-width: 900px)');

function highlightCategory(cls) {
  const on = cls !== null && desktopHover.matches;
  document
    .querySelectorAll('#grid .tile')
    .forEach((t) => t.classList.toggle('dimmed', on && t.dataset.cls !== cls));
}
```

In `style.css`, after the `.tile:focus-visible` rule, add:

```css
.tile.dimmed { opacity: 0.2; }
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tests/grid-interactions.spec.js -g "Category highlight"`
Expected: all pass (desktop and phone variants skip as noted).

- [ ] **Step 5: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
npm run format
git add js/app.js style.css tests/grid-interactions.spec.js
git commit -m "Highlight a category when its filter pill is hovered

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Desktop inspector

**Files:**
- Create: `js/inspector.js`
- Modify: `index.html` (add `#inspector` between `.toolbar` and `#grid`)
- Modify: `js/app.js` (import, `inspectorEl`, `render()`, `makeTile`)
- Modify: `style.css` (inspector rules, `scroll-margin-top` on tiles)
- Test: `tests/grid-interactions.spec.js`

**Interfaces:**
- Consumes: `splitName`, `appendWithBreaks`, `LEVEL_LABELS` from `js/tile.js`; `highlightFor` from `js/highlight.js`; items with `name, level, cat, cls, color, num, desc, code`.
- Produces:
  - `firstMeaningfulLine(code: string): string`
  - `showInspector(box: Element, item): void`
  - `clearInspector(box: Element): void`
  - `INSPECTOR_PLACEHOLDER = 'Hover or focus a command to preview it.'`

- [ ] **Step 1: Write the failing tests**

Append to `tests/grid-interactions.spec.js`:

```js
/* ── Inspector (spec section 7) ────────────────────────────────── */
test.describe('Inspector', () => {
  const PLACEHOLDER = 'Hover or focus a command to preview it.';

  test('shows the placeholder before any hover', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await expect(page.locator('#inspector')).toHaveText(PLACEHOLDER);
  });

  test('hovering a tile previews it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await tile(page, 'alpha()').hover();
    await expect(page.locator('#inspector .ins-title')).toHaveText('alpha()');
    await expect(page.locator('#inspector .ins-meta')).toHaveText('Setup & Config · Beginner');
    await expect(page.locator('#inspector .ins-desc')).toHaveText('Fixture entry alpha().');
    await expect(page.locator('#inspector .ins-code')).toHaveText('open("/alpha"); // first page');
  });

  test('focusing a tile previews it', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await tile(page, 'beta()').focus();
    await expect(page.locator('#inspector .ins-code')).toHaveText('Configuration.timeout = 6000;');
  });

  test('a re-render resets the placeholder', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await tile(page, 'alpha()').hover();
    await page.locator('#search-input').fill('beta');
    await expect(page.locator('#inspector')).toHaveText(PLACEHOLDER);
  });

  test('clicking a tile still opens the modal', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop only');
    await tile(page, 'alpha()').click();
    await expect(page.locator('#modal')).toBeVisible();
  });

  test('hidden on phones', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phones only');
    await expect(page.locator('#inspector')).toBeHidden();
  });
});

/* ── First meaningful line (spec section 7) ───────────────────── */
test.describe('firstMeaningfulLine', () => {
  const CASES = [
    ['open("/alpha"); // first page', 'open("/alpha"); // first page'],
    [
      'import static com.codeborne.selenide.Selenide.*;\n\n// open it\n$("#a").click();',
      '$("#a").click();',
    ],
    ['/* note\n * more\n */\nopen("/");', 'open("/");'],
    ['# selenide.properties\nselenide.browser=firefox', 'selenide.browser=firefox'],
    ['<!-- pom -->\n<dependency>', '<dependency>'],
    ['mvn test -Dselenide.browser=firefox', 'mvn test -Dselenide.browser=firefox'],
    ['// only a comment', '// only a comment'],
    ['\n   \n', ''],
  ];

  test('skips blanks, comments and imports, else falls back', async ({ page }) => {
    const actual = await page.evaluate(async (codes) => {
      const { firstMeaningfulLine } = await import('/js/inspector.js');
      return codes.map(firstMeaningfulLine);
    }, CASES.map(([c]) => c));
    expect(actual).toEqual(CASES.map(([, line]) => line));
  });
});
```

Note on the third case: `/* note` is skipped (`/*`), ` * more` and ` */` are skipped after
trimming (`*`), so `open("/");` is first.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tests/grid-interactions.spec.js -g "Inspector|firstMeaningfulLine"`
Expected: FAIL. `#inspector` does not exist (the desktop tests time out on the locator, and
on phones "hidden on phones" passes trivially), and the import of `/js/inspector.js` returns a 404.

- [ ] **Step 3: Create `js/inspector.js`**

```js
// =============================================================
// inspector.js — desktop preview of the hovered or focused tile
// (docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md, section 7)
// =============================================================

import { highlightFor } from './highlight.js';
import { splitName, appendWithBreaks, LEVEL_LABELS } from './tile.js';

export const INSPECTOR_PLACEHOLDER = 'Hover or focus a command to preview it.';

// Lines that say nothing on their own: comments (Java, shell, XML) and imports
const SKIP = /^(\/\/|\/\*|\*|#|import |<!--)/;

/** First trimmed line that is not blank, a comment or an import; else the first non-blank line. */
export function firstMeaningfulLine(code) {
  const lines = code.split('\n').map((l) => l.trim());
  return lines.find((l) => l && !SKIP.test(l)) ?? lines.find((l) => l) ?? '';
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function clearInspector(box) {
  box.style.borderLeftColor = '';
  box.replaceChildren(el('div', 'ins-empty', INSPECTOR_PLACEHOLDER));
}

export function showInspector(box, item) {
  const { prefix, key } = splitName(item.name);
  const cell = el('div', 'ins-cell');
  cell.style.background = item.color;
  cell.appendChild(el('span', 'ins-num', String(item.num)));
  if (prefix) {
    const prefixEl = el('span', 'ins-prefix');
    appendWithBreaks(prefixEl, prefix);
    cell.appendChild(prefixEl);
  }
  const keyEl = el('span', 'ins-key');
  appendWithBreaks(keyEl, key);
  cell.appendChild(keyEl);

  // highlightFor escapes every character, so innerHTML is safe here (as in the modal)
  const code = el('div', 'ins-code');
  code.innerHTML = highlightFor({ ...item, code: firstMeaningfulLine(item.code) });

  const body = el('div', 'ins-body');
  body.append(
    el('div', 'ins-title', item.name),
    el('div', 'ins-meta', `${item.cat} · ${LEVEL_LABELS[item.level]}`),
    el('div', 'ins-desc', item.desc),
    code
  );

  box.style.borderLeftColor = item.color;
  box.replaceChildren(cell, body);
}
```

- [ ] **Step 4: Add the container to `index.html`**

Between `<div class="toolbar">…</div>` and `<div id="grid"></div>`, add:

```html
  <div id="inspector" aria-hidden="true"></div>
```

(`aria-hidden`: it repeats what the focused tile's `aria-label` and the modal already say.)

- [ ] **Step 5: Wire it into `js/app.js`**

Add the import after the `grid-keys.js` import:

```js
import { showInspector, clearInspector } from './inspector.js';
```

After `let searchVal = '';` add:

```js
const inspectorEl = document.getElementById('inspector');
```

In `render()`, after `container.innerHTML = '';` add:

```js
  clearInspector(inspectorEl);
```

In `makeTile`, after the click listener add:

```js
  tile.addEventListener('mouseenter', () => showInspector(inspectorEl, item));
  tile.addEventListener('focus', () => showInspector(inspectorEl, item));
```

- [ ] **Step 6: Add the inspector styles to `style.css`**

Append after the `.tile-cat` rule:

```css
/* Inspector: sticky preview of the hovered or focused tile, desktop only (spec section 7) */
#inspector { display: none; }
@media (hover: hover) and (min-width: 900px) {
  #inspector {
    display: flex; gap: 16px; align-items: stretch;
    position: sticky; top: 8px; z-index: 10;
    height: 104px; margin-bottom: 14px; padding: 10px 14px 10px 10px;
    background: #1e293b; border-radius: 10px; border-left: 6px solid #334155;
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.6);
  }
  /* Keep a focused tile clear of the sticky inspector when focus scrolls it into view */
  .tile { scroll-margin-top: 130px; }
}
.ins-cell {
  flex: 0 0 120px; position: relative; padding: 4px; overflow: hidden;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  border-radius: 8px; color: #0f172a; font-family: var(--font-mono); text-align: center;
}
.ins-num {
  position: absolute; top: 5px; left: 6px;
  font-family: var(--font-sans); font-size: 10px; font-weight: 700;
}
.ins-prefix { max-width: 100%; font-size: 9px; opacity: 0.7; overflow-wrap: break-word; }
.ins-key {
  max-width: 100%; font-size: 13px; font-weight: 700; line-height: 1.15;
  overflow-wrap: break-word;
}
.ins-body { flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
.ins-title {
  font-family: var(--font-mono); font-size: 15px; font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ins-meta { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }
.ins-desc { font-size: 13px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ins-code {
  padding: 3px 8px; border-radius: 6px; background: #020617;
  font-family: var(--font-mono); font-size: 12.5px;
  white-space: pre; overflow: hidden; text-overflow: ellipsis;
}
.ins-empty { align-self: center; padding-left: 8px; color: #64748b; font-size: 14px; }
```

Then change the six `#m-code .tok-*` selectors so the inspector code gets the same colours,
for example `#m-code .tok-keyword { color: #38bdf8; }` becomes
`#m-code .tok-keyword, .ins-code .tok-keyword { color: #38bdf8; }`. Do the same for
`tok-string`, `tok-api`, `tok-number`, `tok-comment` and `tok-fn`.

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- tests/grid-interactions.spec.js`
Expected: all pass (desktop and phone variants skip as noted).

- [ ] **Step 8: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
npm run format
git add js/inspector.js js/app.js index.html style.css tests/grid-interactions.spec.js
git commit -m "Add a sticky inspector that previews the hovered tile on desktop

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Docs and screenshot

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md:107`
- Modify: `docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md:214` (the "Gradients" bullet)
- Modify: `images/dashboard.jpeg`

**Interfaces:**
- Consumes: everything above.
- Produces: docs that describe the shipped grid.

- [ ] **Step 1: Update `CLAUDE.md`**

Make these edits:

- Repository layout, `style.css` line: `# Single stylesheet: dark theme, 21 category tile gradients` → `# Single stylesheet: dark theme, tile cells, 21 family fills, inspector`.
- Repository layout, under `js/`, after the `highlight.js` line add:
  ```
  │   ├── tile.js                   # Periodic cell: splitName, <wbr> breaks, key size, buildTile
  │   ├── grid-keys.js              # Roving tabindex + arrow keys over the tile grid
  │   ├── inspector.js              # Desktop hover/focus preview panel
  ```
- Repository layout, under `tests/`: `cheatsheet.spec.js        # UI: load, search, filters (incl. Mobile), modal, hash, gradients` → `…, modal, hash, tile colours`, and add:
  ```
  │   ├── grid-cells.spec.js        # Cell helpers, anatomy, numbers, layout
  │   ├── grid-interactions.spec.js # Keyboard, category highlight, inspector
  ```
- Data Schema example: `color: '#f97316',        // 6-digit hex, equal to the gradient start in style.css` → `color: '#fb923c',        // 6-digit hex, equal to the tile fill in style.css`.
- "Adding a new category", replace step 3 with:
  ```markdown
  3. Add a `.<cls>` fill rule in `style.css` under its family comment, using the category's
     `color`. The fill must pass 4.5:1 against the tile text `#0f172a`; mobile categories
     stay in OKLCH hue 288 to 340, web categories outside it; keep lightness within 0.71 to 0.92. Add `[cls, fill]` to the `PALETTE`
     table in `tests/cheatsheet.spec.js` at its display position.
  ```
- "Filters and URL state" table, `window.*` row: add `window.splitName`.
- Add a section after "Syntax Highlighting":

  ```markdown
  ## Tile grid

  Design: `docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md`.

  - Each tile is a periodic-table cell: `button.tile` with a fixed number (position in the
    full dataset), level dots, a small prefix and a large monospace key (`splitName`), and
    the category. `.tile-name`'s `textContent` is always the full `name`.
  - Categories are coloured by family (Setup, Finding, Acting, Debugging, Checking,
    Structure, Mobile), and `js/data/index.js` keeps each family contiguous.
  - Keyboard: one tab stop, arrow keys, Home and End; the modal returns focus to its tile.
  - Desktop only (`(hover: hover) and (min-width: 900px)`): the sticky inspector and the
    category highlight on pill hover.
  ```

- [ ] **Step 2: Update `README.md:107`**

In that sentence, replace:

```markdown
add a `.category-css-class` gradient rule in [style.css](style.css) that starts with the same color
```

with:

```markdown
add a `.category-css-class` fill rule in [style.css](style.css) in the same color (dark text must reach 4.5:1 contrast)
```

- [ ] **Step 3: Point the base spec at this one**

In `docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md`, change the start of
the "Gradients" bullet from `- **Gradients:** web categories keep` to:

```markdown
- **Gradients:** *(Superseded by
  [`2026-10-15-periodic-grid-refresh-design.md`](2026-10-15-periodic-grid-refresh-design.md),
  section 6: flat family fills with dark text.)* Web categories kept
```

- [ ] **Step 4: Refresh `images/dashboard.jpeg`**

```bash
npx serve -l 3000 . > /dev/null 2>&1 &
SERVER=$!
sleep 2
node --input-type=module -e "
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/');
await page.locator('.tile').nth(9).hover();
await page.screenshot({ path: 'images/dashboard.jpeg', type: 'jpeg', quality: 85 });
await browser.close();
"
kill $SERVER
```

Open `images/dashboard.jpeg` and check it shows the square coloured cells, the inspector
filled for tile 10, and no visitor count other than `—`.

- [ ] **Step 5: Run all gates and commit**

Run: `npm test && npm run lint && npm run format:check`
Expected: all pass.

```bash
git add CLAUDE.md README.md docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md images/dashboard.jpeg
git commit -m "Document the periodic grid and refresh the dashboard screenshot

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
