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

const samePath = (a, b) =>
  new URL(a).pathname.replace(/\/$/, '') === new URL(b).pathname.replace(/\/$/, '');
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
