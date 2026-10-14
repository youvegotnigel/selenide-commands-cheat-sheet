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
