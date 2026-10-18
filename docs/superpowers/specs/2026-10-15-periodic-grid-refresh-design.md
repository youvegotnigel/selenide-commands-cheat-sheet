# Periodic Grid Refresh: Design

- **Date:** 2026-10-15
- **Status:** Approved 2026-10-15 (after a clickable preview)
- **Builds on:** [`2026-10-13-selenide-cheat-sheet-design.md`](2026-10-13-selenide-cheat-sheet-design.md).
  This spec replaces its section 6 "Gradients" bullet and the tile rendering it implies.
  Everything else in that spec stands.

## 1. Goal

Keep the tile grid's periodic-table pattern, and make it read like one. Today a tile is a
coloured box with a centred name, a positional `#n` and 8px level dots. Names split mid-word
(`Configuration.brows` / `erSize`), four web categories share near-identical blues, white
text fails contrast on the yellow and amber tiles, and tiles are `<div>`s a keyboard cannot
reach.

**Success looks like:**

- Every tile has the same element-cell layout: a fixed number, a level marker, a large
  monospace "symbol" (the key part of the command), a small prefix and the category.
- No command name breaks inside a word at any width from 320px to 1200px.
- Tiles are square, and two columns are the minimum at 320px with no horizontal scroll.
- Categories are coloured by **family**, like element groups. Every tile's text passes
  WCAG AA (4.5:1) against its fill.
- The grid can be used with a keyboard alone: Tab in, arrow keys to move, Enter to open,
  Escape to close with focus returned.
- On desktop, hovering or focusing a tile previews it in a sticky inspector, and hovering a
  category pill highlights that category in place.
- `npm test`, `npm run lint` and `npm run format:check` pass.

## 2. Decisions

| Topic | Decision |
|---|---|
| Layout pattern | Keep the periodic-table grid. No card, list or split-pane redesign |
| Default view | Unchanged: Flat |
| Data schema | Unchanged. No new fields; prefix, symbol and number are derived at render time |
| Tile number | Position in the full dataset (1-based), the "atomic number". Stable across filters, search and views. It can shift when content is added; that is accepted |
| Tile element | `<button type="button">` |
| Fill style | Flat fill, no gradient. Dark text `#0f172a` on every category |
| Category order | Reordered so each family is contiguous (section 6). This changes tile numbers and grouped-view order |
| Fonts | System stacks only, no web fonts (no CDN rule) |
| Desktop-only features | Inspector and pill highlighting, under `(hover: hover) and (min-width: 900px)` |
| Rollout | Four phases (section 10), each leaving the suite green |

## 3. Cell anatomy

```
┌──────────────────────┐
│ 10 🔥            ●●  │  number · popular badge (analytics on) · level dots
│                      │
│    Configuration.    │  prefix: small, 70% opacity
│     browserSize      │  symbol: large, monospace
│                      │
│    SETUP & CONFIG    │  category: tiny, one line, ellipsis
└──────────────────────┘
```

### DOM

```html
<button type="button" class="tile config" data-cls="config"
        aria-label="Configuration.browserSize, Setup & Config, Intermediate">
  <span class="tile-num">10</span>
  <span class="tile-level" aria-hidden="true">●●</span>
  <span class="tile-name">
    <span class="tile-prefix">Configuration.</span><span class="tile-key tile-key--m">browser<wbr>Size</span>
  </span>
  <span class="tile-cat">Setup &amp; Config</span>
</button>
```

- **Invariant:** `.tile-name`'s `textContent` equals `item.name` exactly. `<wbr>` adds no
  text, and the prefix sits on its own line through CSS (`display: block`), not a `<br>`.
- Built with DOM nodes (`textContent`, `createElement('wbr')`), not `innerHTML`.
- `.tile-popular` (🔥) keeps its class and sits after the number. It appears only when
  analytics are on.
- `.tile-cat` is shown in both views.

### Splitting the name into prefix and symbol

The prefix is a leading chain of Java identifiers, each optionally followed by `()`, and
each ending in `.`. The split happens only when **both** hold:

1. `prefix` matches `/^(?:[A-Za-z_$][\w$]*(?:\(\))?\.)+/` (longest match), and
2. the rest (`key`) matches `/^[A-Za-z_$][\w$]*(?:\(.*\))?(?: \(.*\))?$/`.

Otherwise the prefix is empty and the key is the whole name. Exposed as
`window.splitName(name)` returning `{ prefix, key }` for tests.

| Name | Prefix | Key |
|---|---|---|
| `Configuration.browserSize` | `Configuration.` | `browserSize` |
| `webdriver().shouldHave(urlContaining())` | `webdriver().` | `shouldHave(urlContaining())` |
| `SelenideAppium.switchTo().context()` | `SelenideAppium.switchTo().` | `context()` |
| `CombinedBy.android().ios()` | `CombinedBy.android().` | `ios()` |
| `SelenideAppium.$()` | `SelenideAppium.` | `$()` |
| `selenide.properties file` | (none) | `selenide.properties file` |
| `./gradlew test (forward -Dselenide.*)` | (none) | `./gradlew test (forward -Dselenide.*)` |
| `System properties (-Dselenide.*)` | (none) | `System properties (-Dselenide.*)` |
| `$(AppiumBy.accessibilityId())` | (none) | `$(AppiumBy.accessibilityId())` |
| `shouldHave(text())` | `shouldHave(` | `text())` (closing `)` is a small `.tile-suffix`) |

Further shapes, tried in this order after the identifier chain and the `should*` wrapper
(`splitName` also returns a `suffix` where one applies; prefix + key + suffix equals the name):

| Shape | Example | Prefix | Key | Suffix |
|---|---|---|---|---|
| Qualifier `head (note)` | `download() (FOLDER)` | `download() (` | `FOLDER` | `)` |
| Identifier arguments | `click(ClickOptions)` | (none) | `click` | `(ClickOptions)` on its own line |
| Long getter | `getSelectedOptionText()` | (none) | `getSelectedOptionText()` | (none) |
| `selenide-` stem | `selenide-full-screenshot` | `selenide-` | `full-screenshot` | (none) |

This rule was run against all 247 current names. Only the identifier-chain names split.

### Break opportunities

A `<wbr>` is inserted in the key and in the prefix:

- after every `.` and `,`
- after a `(` that directly follows an identifier character (`shouldHave(<wbr>text())`).
  A `(` after a space gets none, so `dependency (Maven)` breaks at the space, never as
  `dependency (` / `Maven)`
- before an uppercase letter that follows a lowercase letter (`browser<wbr>Size`)

`overflow-wrap: anywhere` is removed. `overflow-wrap: break-word` stays as a last resort
only.

### Symbol size

The key's size class is the larger of two classes:

| Key length | Longest unbreakable run | Class | Font size |
|---|---|---|---|
| 1 to 10 | 1 to 10 | `tile-key--s` | 18px |
| 11 to 24 | 11 | `tile-key--m` | 15px |
| 25+ | 12+ | `tile-key--l` | 13px |

An unbreakable run is a stretch with no space, hyphen or `<wbr>` point. A long word must get
a smaller size, or it breaks mid-word in a narrow cell: `sleep(milliseconds)` is 19
characters but its run `milliseconds)` is 13, so it is `l`. The limits keep a run inside the
119px of text space of a 320px phone even with a 15px classic scrollbar (found in the final
review). The longest current key is 51 characters; five lines at 13px fit a 139px cell, and
section 4's `aspect-ratio` lets a cell grow if it ever does not.

### Level marker

`●`, `●●` or `●●●` in the tile text colour `#0f172a`, 10px, letter-spacing 2px, no
background. Every fill passes 4.5:1 against that colour, and the number of dots carries the
meaning, so it reads the same on every fill. (A dark capsule was tried in the preview and
read as a toggle switch.) The modal's level badge is unchanged.

## 4. Size and layout

```css
.grid {
  grid-template-columns: repeat(auto-fill, minmax(min(160px, calc(50% - 6px)), 1fr));
  gap: 12px;
}
.tile { aspect-ratio: 1; }
```

- Within the 1200px container (1170px inner), 6 columns of about 185px. The current grid has 7 columns of about 157px.
- At 320px viewport (290px inner), 2 columns of 139px. `min()` prevents a single column.
- `aspect-ratio` is a preferred size: a tile with unusually long content grows taller
  rather than clipping.
- Tile padding 8px. Number top-left and level top-right are absolutely positioned. Name is
  centred, category pinned to the bottom.

## 5. Typography

| Token | Value | Used for |
|---|---|---|
| `--font-sans` | `system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif` | `body` (replaces `Arial`) |
| `--font-mono` | `ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace` | `.tile-name`, `.modal-title`, `pre`, inspector code, `.meta-badge` |

- `.tile-num`: 11px, weight 700, `font-variant-numeric: tabular-nums`.
- `.tile-prefix`: 11px, opacity 0.7.
- `.tile-key`: weight 600, line-height 1.25.
- `.tile-cat`: 9px, uppercase, letter-spacing 0.06em, opacity 0.7, one line with ellipsis.

## 6. Colour families

Each family has one hue, and each category in it has its own shade, the way a periodic
table colours element groups. Families run around the colour wheel (blue, cyan, green,
yellow, orange, rose, violet) so the grid reads as a smooth spectrum. The mobile family
stays violet to pink (OKLCH hue 288 to 340); web families stay outside it, so the rule from
the base spec still holds.

The fills were generated in OKLCH, not picked by eye. Lightness is held in a narrow band
(0.71 to 0.92) so no tile shouts, chroma tapers as lightness rises so pale tiles stay soft
rather than neon, and shades inside a family step by at least 6 in OKLab delta E (x100).
Between families the step is at least 7.7. The contrast column is against the text colour
`#0f172a`, computed with the WCAG formula; the lowest is 6.5:1.

| # | Family | Category (`cat`) | `cls` | Fill = `color` | Contrast |
|---|---|---|---|---|---|
| 1 | Setup | Setup & Config | `config` | `#72a0f5` | 6.85 |
| 2 | Setup | Navigation & Browser | `navigation` | `#76bafe` | 8.69 |
| 3 | Setup | Remote & Grid | `remote` | `#8ad1ff` | 10.75 |
| 4 | Setup | Build & Run | `cli` | `#a3e7ff` | 13.12 |
| 5 | Finding | Selectors | `selector` | `#3bcddc` | 9.31 |
| 6 | Finding | Collections | `collection` | `#75ecde` | 12.59 |
| 7 | Acting | Actions | `action` | `#3ec87d` | 8.30 |
| 8 | Acting | Windows, Frames, Alerts | `window` | `#84d987` | 10.42 |
| 9 | Acting | Files | `file` | `#b8e688` | 12.51 |
| 10 | Acting | JavaScript, Storage, Clipboard | `javascript` | `#e2f07d` | 14.45 |
| 11 | Debugging | Reports & Debugging | `report` | `#f4c43a` | 10.88 |
| 12 | Debugging | Proxy & Network | `network` | `#f4e886` | 14.23 |
| 13 | Checking | Conditions | `condition` | `#f98e52` | 7.67 |
| 14 | Checking | Waits & Timeouts | `wait` | `#feb671` | 10.32 |
| 15 | Structure | Page Objects | `page-object` | `#f0777a` | 6.48 |
| 16 | Structure | Patterns | `pattern` | `#f996a9` | 8.47 |
| 17 | Structure | Test Frameworks | `framework` | `#ffb5cd` | 10.83 |
| 18 | Mobile | Appium Setup | `appium-setup` | `#9e92f3` | 6.68 |
| 19 | Mobile | Mobile Selectors | `mobile-selector` | `#c79ff4` | 8.24 |
| 20 | Mobile | Mobile Gestures | `mobile-gesture` | `#e9aff2` | 10.10 |
| 21 | Mobile | Mobile Context & App | `mobile-context` | `#ffc2e9` | 12.03 |

- The `#` column is the new order of `categories` in `js/data/index.js`, and so the display
  order of filters, groups and tile numbers.
- `style.css`: `.<cls> { background: <fill>; }`, plus `.tile { color: #0f172a; }`.
- Each category module's `color` changes to its fill. Filter dots and group headers pick it
  up automatically.
- Families exist only as colour and order. They are not a data field and not shown as
  labels (section 11).
- **Tuning:** the user approved these shades in the preview
  (`https://claude.ai/artifact/DpVrkoXfwrXYAXLW6yvNn1`). Any later change edits this table
  first, then the code and the test table.

## 7. Interactions

### Hover and focus

- Hover: `transform: translateY(-2px)`, `box-shadow: 0 6px 20px rgba(0,0,0,0.35)` and
  `outline: 2px solid rgba(255,255,255,0.85)`. The 1.05 scale, which overlaps neighbours, is
  removed.
- `:focus-visible`: `outline: 3px solid #f8fafc; outline-offset: 2px`.
- `@media (prefers-reduced-motion: reduce)`: no transform and no transition.

### Keyboard (roving tabindex)

- Exactly one tile has `tabindex="0"` (initially the first rendered tile). The rest have
  `tabindex="-1"`, so Tab enters and leaves the grid in one step.
- Arrow keys pressed with Alt, Ctrl or Cmd are left to the browser (Alt+Left is Back).
- `ArrowLeft` / `ArrowRight`: previous / next tile in DOM order, across group sections.
- `ArrowUp` / `ArrowDown`: the nearest tile in the row above / below, by horizontal centre
  (geometry, so it works across group sections and any column count).
- `Home` / `End`: first / last tile.
- `Enter` / `Space`: open the modal (native button behaviour).
- On modal open, focus moves to `#btn-copy`. On close (any way), focus returns to the tile
  that opened it.
- `render()` resets the roving tile to the first tile.

### Category highlight from the filter bar (desktop only)

- `mouseenter` on a **category** pill (not All, Start Here, Mobile or Popular) adds
  `.dimmed` (opacity 0.2) to every tile whose `data-cls` differs. `mouseleave` removes all
  `.dimmed`.
- No re-render, no hash change, no filter change.

### Inspector (desktop only)

A sticky preview panel, like an interactive periodic table's detail box.

- `#inspector` sits between the toolbar and `#grid`. It is `display: none` outside
  `(hover: hover) and (min-width: 900px)`.
- `position: sticky; top: 8px; z-index: 10;` fixed height 104px, background `#1e293b`, 6px
  left border in the category colour.
- Left: an enlarged copy of the cell (number, prefix, key on the category fill). Right: the
  full name (mono), `cat · Level`, `desc` clamped to 1 line (as in the approved preview; 2 lines do not fit the 104px height), and the snippet's first
  meaningful line highlighted with `highlightFor({ ...item, code: line })`.
- **First meaningful line:** the first line whose trimmed text is non-empty and does not
  start with `//`, `/*`, `*`, `#`, `import ` or `<!--`. If there is none, the first
  non-empty line.
- Updated on tile `mouseenter` and `focus`. Cleared to the placeholder "Hover or focus a
  command to preview it." whenever `render()` runs.
- Clicking a tile still opens the modal.

## 8. Unchanged

Search, quick filters, URL hash state, Flat/Grouped toggle, the modal's content and
buttons, highlighters, the meta bar, analytics placeholders, and every `window.*` test
global. New globals: `window.splitName`.

## 9. Testing

Expected values are hand-written from this spec, never from the code under test.

**Updated**

- `cheatsheet.spec.js` "Tile gradients" becomes **"Tile colours"**. `PALETTE` holds
  `[cls, fill]` copied from the section 6 table. It asserts each class's computed
  `background-color` equals `rgb(fill)` with `background-image: none`, `.tile` `color` is
  `rgb(15, 23, 42)`, and each data category's `color` equals its fill.
- Category order: `window.categories.map((c) => c.cls)` equals the section 6 `cls` column
  in order.
- Existing `.tile-name` reads via `.innerText()` switch to `.textContent()` (the section 3
  invariant). `toHaveText` already uses `textContent`.

**New** (fixture data unless noted)

| Area | Assertion |
|---|---|
| Contrast (real data) | For every category, WCAG contrast of computed text colour vs fill is ≥ 4.5 |
| `splitName` | Every row of the section 3 table |
| Break opportunities | `Configuration.browserSize` key renders `browser<wbr>Size`; `.tile-name` `textContent` equals the name |
| Size class | Keys of length 3, 12, 13, 24, 25 get `--s`, `--s`, `--m`, `--m`, `--l` (a dedicated fixture via `useFixtureData(page, CELL_FIXTURE)`, so existing fixture counts do not change) |
| Numbers | All: `1`..`5`. Filter Conditions: `gamma()` shows `3`. Search `epsilon`: shows `5` |
| Level | `aria-label` ends with `Beginner` / `Intermediate` / `Advanced`; `.tile-level` shows 1 / 2 / 3 dots |
| Layout | 320px viewport: 2 columns, `scrollWidth <= clientWidth`. 1200px: 6 columns. A short-name tile's width equals its height (±1px) |
| Keyboard | Tab lands on tile 1; ArrowRight → tile 2; End → last; at 400px (2 columns) ArrowDown from tile 1 → tile 3; Enter opens modal; Escape closes and the opener is focused |
| Elements | Every `.tile` is a `button` with `type="button"` |
| Highlight (desktop) | Hover the Conditions pill: every non-`condition` tile has `.dimmed`, `gamma()` does not; mouse out: no `.dimmed` |
| Inspector (desktop) | Hover `alpha()`: shows `Fixture entry alpha().` and `open("/alpha"); // first page`. Hover `beta()`: `Configuration.timeout = 6000;`. Typing in search resets the placeholder. On iPhone 16 and Pixel 7, `#inspector` is hidden |

Desktop-only tests skip when `isMobile`.

## 10. Phases

Each phase ends with `npm test`, `npm run lint` and `npm run format:check` passing.

1. **Colour families.** New fills, dark text, category reorder in `index.js`, `color` in
   all 21 modules, "Tile colours", order and contrast tests. Colour goes first so the dark
   tile text never sits on the old dark gradients.
2. **Cell anatomy, size, fonts, buttons.** `makeTile` rewrite, `splitName`, `<wbr>`, size
   classes, stable numbers, level dots, `aria-label`, square grid, font tokens, hover and
   focus styles.
3. **Interactions.** Roving tabindex and arrow keys, focus return, pill highlight,
   inspector.
4. **Docs.** `CLAUDE.md` (layout line "21 category tile gradients", schema `color` comment,
   "Adding a new category" step 3), a pointer from the base spec's section 6 to this spec,
   and a refreshed `images/dashboard.jpeg`. (The release-sync skill does not mention
   gradients, so it needs no change.)

## 11. Out of scope

- Card, list or split-pane layouts; Grouped as the default view.
- Family names shown in the UI (legend headings or grouped filter bar).
- Deep links to a single command (`#cmd=`) and search by tile number.
- Modal focus trap, light theme, web fonts.
