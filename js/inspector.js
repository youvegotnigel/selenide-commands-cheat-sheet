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
