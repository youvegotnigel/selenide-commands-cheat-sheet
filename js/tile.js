// =============================================================
// tile.js — periodic-table cell: name split, break points, size
// (docs/superpowers/specs/2026-10-15-periodic-grid-refresh-design.md, section 3)
// =============================================================

// A leading chain of Java identifiers, each optionally followed by "()", each ending in "."
const PREFIX_RE = /^(?:[A-Za-z_$][\w$]*(?:\(\))?\.)+/;
// What may follow a prefix: an identifier, optional call parens, optional " (note)"
const KEY_RE = /^[A-Za-z_$][\w$]*(?:\(.*\))?(?: \(.*\))?$/;

// A should/shouldBe/shouldHave style wrapper around a single argument: the argument is the
// part worth reading, so it becomes the key and the wrapper becomes the small prefix.
const WRAP_RE = /^(should(?:Not)?(?:Be|Have)?\()([A-Za-z_$][\w$]*(?:\(\))?)\)$/;
// A trailing qualifier, "download() (FOLDER)": the note is what tells siblings apart.
const QUALIFIER_RE = /^(.+?) \((.+)\)$/;
// A method with plain identifier arguments, "click(ClickOptions)": the method is the key and
// the argument list a small line below it.
const ARGS_RE = /^([A-Za-z_$][\w$]*)(\([A-Za-z_$][\w$]*(?:, [A-Za-z_$][\w$]*)*\))$/;
// A long getter, "getSelectedOptionText()": the verb is shared noise, the noun is the point.
const VERB_RE = /^(get|as)([A-Z][\w$]*\(\))$/;
const VERB_MIN_LENGTH = 15;
// Skill and MCP names share a "selenide-" stem.
const STEM_RE = /^(selenide-)([\w-]+)$/;

/**
 * Splits a command name into a small prefix and the large key, and optionally a small
 * `suffix` (the closing `)` of a wrapper or qualifier, or an argument list). prefix + key +
 * suffix always equals the name. `suffix` is absent when there is none.
 */
export function splitName(name) {
  const chain = name.match(PREFIX_RE);
  if (chain) {
    const key = name.slice(chain[0].length);
    if (KEY_RE.test(key)) return { prefix: chain[0], key };
  }
  const wrap = name.match(WRAP_RE);
  if (wrap) return { prefix: wrap[1], key: wrap[2], suffix: ')' };
  const qualifier = name.match(QUALIFIER_RE);
  if (qualifier) return { prefix: `${qualifier[1]} (`, key: qualifier[2], suffix: ')' };
  const args = name.match(ARGS_RE);
  if (args) return { prefix: '', key: args[1], suffix: args[2] };
  const verb = name.length >= VERB_MIN_LENGTH && name.match(VERB_RE);
  if (verb) return { prefix: verb[1], key: verb[2] };
  const stem = name.match(STEM_RE);
  if (stem) return { prefix: stem[1], key: stem[2] };
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

// Where the key can wrap: spaces, hyphens, after "." and ",", after a call "(" and before a
// capital that follows a lowercase letter (the same points appendWithBreaks marks with <wbr>)
const BREAK_RE = /[ -]|(?<=[.,])|(?<=[\w$]\()|(?<=[a-z])(?=[A-Z])/;

const SIZES = ['s', 'm', 'l'];

/**
 * Size class for the key: the larger of the class by total length (1-10 s, 11-24 m, 25+ l)
 * and the class by longest unbreakable run (1-10 s, 11 m, 12+ l). A long unbreakable word
 * must shrink, or it would break mid-word in a narrow cell.
 */
export function keySize(key) {
  const byLength = key.length <= 10 ? 0 : key.length <= 24 ? 1 : 2;
  const run = Math.max(...key.split(BREAK_RE).map((part) => part.length));
  const byRun = run <= 10 ? 0 : run <= 11 ? 1 : 2;
  return SIZES[Math.max(byLength, byRun)];
}

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

  const { prefix, key, suffix } = splitName(item.name);
  const name = span('tile-name');
  if (prefix) {
    const prefixEl = span('tile-prefix');
    appendWithBreaks(prefixEl, prefix);
    name.appendChild(prefixEl);
  }
  const keyEl = span(`tile-key tile-key--${keySize(key)}`);
  appendWithBreaks(keyEl, key);
  // A lone ")" closes the key's line; anything longer is an argument list on its own line
  if (suffix === ')') keyEl.appendChild(span('tile-suffix', suffix));
  name.appendChild(keyEl);
  if (suffix && suffix !== ')') {
    const argsEl = span('tile-suffix tile-suffix--block');
    appendWithBreaks(argsEl, suffix);
    name.appendChild(argsEl);
  }
  tile.appendChild(name);

  tile.appendChild(span('tile-cat', item.cat));
  return tile;
}
