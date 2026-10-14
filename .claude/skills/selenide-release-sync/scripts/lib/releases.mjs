// Pure helpers for release-delta.mjs: Maven metadata and Selenide's CHANGELOG.md.

export function parseRelease(xml) {
  const m = xml.match(/<release>([^<]+)<\/release>/);
  if (!m) throw new Error('No <release> in maven-metadata.xml');
  return m[1].trim();
}

const parts = (v) => v.split(/[.-]/).slice(0, 3).map(Number);

export function compareVersions(a, b) {
  const [x, y] = [parts(a), parts(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

// Sections look like "## 7.19.0 (10.10.2026)" and are separated by "=======" lines.
// Returns every section newer than `pinned` and not newer than `latest`, newest first.
export function changelogSections(markdown, pinned, latest) {
  return markdown
    .split(/^(?=## \d+\.\d+\.\d+)/m)
    .filter((s) => /^## \d+\.\d+\.\d+/.test(s))
    .filter((s) => {
      const v = s.match(/^## (\d+\.\d+\.\d+)/)[1];
      return compareVersions(v, pinned) > 0 && compareVersions(v, latest) <= 0;
    })
    .map((s) => s.replace(/\n=+\s*$/, '').trim());
}
