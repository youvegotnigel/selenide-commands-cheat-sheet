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
    // Leave browser shortcuts alone (Alt+Left is Back, Cmd+Left is Back on macOS)
    if (e.altKey || e.metaKey || e.ctrlKey) return;
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
