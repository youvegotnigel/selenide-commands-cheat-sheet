#!/usr/bin/env node
// Downloads the -sources.jar of every pinned Selenide module (and Appium's
// java-client) from Maven Central and unzips each into .cache/sources/, so
// cheat sheet entries can be verified against what actually shipped:
//   grep -rn "visibleText" .cache/sources/
// The proxy classes (SelenideProxyServer, MockResponseFilter, RequestMatchers)
// ship in selenide-core. The selenide-proxy artifact only carries the
// browserup-proxy dependency, so it is not fetched.
//
// Usage (from the repo root): node .claude/skills/selenide-release-sync/scripts/fetch-sources.mjs
// Idempotent: a module whose folder has a .complete marker is skipped.
// Exit 0 on success, 2 when Maven Central could not be reached.

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
  'selenide-cli',
  'selenide-mcp',
];
const JARS = [
  ...SELENIDE_MODULES.map((artifact) => ({
    group: 'com/codeborne',
    artifact,
    version: versions.selenide,
  })),
  { group: 'com/codeborne', artifact: 'selenide-appium', version: versions.selenideAppium },
  { group: 'io/appium', artifact: 'java-client', version: versions.appiumJavaClient },
];

async function get(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return Buffer.from(await res.arrayBuffer());
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
  writeFileSync(
    jar,
    await get(`${MAVEN}/${group}/${artifact}/${version}/${artifact}-${version}-sources.jar`)
  );
  execFileSync('unzip', ['-qo', jar, '-d', dest]);
  rmSync(jar);
  writeFileSync(path.join(dest, '.complete'), '');
  return `${artifact}-${version}`;
}

try {
  mkdirSync(CACHE, { recursive: true });
  for (const jar of JARS) console.log('ok', await fetchJar(jar));
} catch (err) {
  console.error('Could not fetch sources:', err.message);
  process.exit(2);
}
