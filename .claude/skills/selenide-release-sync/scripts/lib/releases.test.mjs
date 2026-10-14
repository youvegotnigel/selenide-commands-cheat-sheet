import { test } from 'node:test';
import assert from 'node:assert/strict';
import { changelogSections, compareVersions, parseRelease } from './releases.mjs';

const METADATA = `<metadata><groupId>com.codeborne</groupId><artifactId>selenide</artifactId>
<versioning><latest>7.20.0-RC1</latest><release>7.19.0</release></versioning></metadata>`;

const CHANGELOG = `# Changelog

=======
## 7.20.0 (01.11.2026)
* feature twenty

=======
## 7.19.0 (10.10.2026)
* feature nineteen

=======
## 7.18.2 (19.09.2026)
* patch

=======
## 7.18.0 (20.08.2026)
* eighteen
`;

test('parseRelease reads <release>, not <latest>', () => {
  assert.equal(parseRelease(METADATA), '7.19.0');
  assert.throws(() => parseRelease('<metadata/>'), /No <release>/);
});

test('compareVersions orders by major, minor, patch numerically', () => {
  assert.ok(compareVersions('7.19.0', '7.9.0') > 0);
  assert.ok(compareVersions('7.18.2', '7.19.0') < 0);
  assert.equal(compareVersions('7.19.0', '7.19.0'), 0);
});

test('changelogSections returns versions after pinned up to latest, newest first', () => {
  const sections = changelogSections(CHANGELOG, '7.18.0', '7.19.0');
  assert.deepEqual(
    sections.map((s) => s.split('\n')[0]),
    ['## 7.19.0 (10.10.2026)', '## 7.18.2 (19.09.2026)']
  );
  assert.ok(!sections.join('\n').includes('======='));
});

test('changelogSections is empty when pinned is latest', () => {
  assert.deepEqual(changelogSections(CHANGELOG, '7.19.0', '7.19.0'), []);
});
