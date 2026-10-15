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
