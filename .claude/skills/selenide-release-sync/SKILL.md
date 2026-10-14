---
name: selenide-release-sync
description: Use when a new Selenide version is released, when js/versions.json is behind Maven Central, when asked to update or sync the cheat sheet to a Selenide release, or when js/data entries may have drifted from current Selenide (renamed methods, changed signatures, broken selenide.org or GitHub links).
---

# Selenide release sync

## Overview

Brings `js/data/` in line with a Selenide release: new APIs added, changed and removed APIs
corrected, every `docs` link resolving, version references bumped, tests pinned, and every
gate passing. selenide-appium is released with the same version number as Selenide, so one
sync covers both halves of the cheat sheet.

**Core principle: what shipped is the truth.** Read `CHANGELOG.md` at the release's git tag
and the `-sources.jar` files of the release (unzipped into `.cache/sources/`). Training data,
memory, `main`-branch docs, `selenide.org/javadoc/current/` and Context7 are not evidence on
their own. They can describe unreleased features or miss removed ones.

## Sources

Only these sources may inform an entry. Anything else is named to the user and approved
**before** it is used (in CI: listed in the PR body under "Wanted sources", not used).

| Source | Role |
|---|---|
| `.cache/sources/` (Maven Central sources jars for the pinned versions) | **Final say** on names, signatures, overloads and defaults |
| `CHANGELOG.md` at tag `vX.Y.Z` of `github.com/selenide/selenide` | "Added in", behaviour changes, deprecations, removals |
| Context7 `/selenide/selenide` | Discovery and examples |
| `selenide.org` (docs and `javadoc/current/`) | Discovery, and the primary `docs` link target |
| `github.com/selenide/*`, `github.com/selenide-examples/selenide-appium` | Discovery, mobile setup patterns, `docs` links |

Context7 and the official site are for discovery; the jar decides. When they disagree,
follow the jar and report the conflict.

## When to use

- `npm run release:delta -- --check` prints `behind=true`
- Someone asks to "update to Selenide 7.x" or "sync the cheat sheet"
- A scheduled sync run (`.github/workflows/cheatsheet-sync.yml`)
- Docs links or examples are suspected stale, even with no new release (skip to step 5)

## Workflow

Run everything from the repo root. Make a todo per step.

1. **Measure the gap.** `npm run release:delta -- --check`
2. **Read the whole delta.** `npm run release:delta`. Read **every** bullet of every version
   in the delta, including the "update Selenium/Appium from X to Y" lines.
3. **Bump and fetch.** Edit `js/versions.json`: `selenide` and `selenideAppium` to the new
   version, and `appiumJavaClient` if the changelog says Appium was updated (confirm the
   version in `https://repo1.maven.org/maven2/com/codeborne/selenide-appium/<v>/selenide-appium-<v>.pom`).
   Then `npm run fetch:sources`.
4. **Triage into a change list** (table below). Every item gets an action: add, update,
   rewrite, or skip with a reason.
5. **Check existing entries against the delta.** For each changed, deprecated or removed
   API, `grep -rn` it across `js/data/` and fix every hit. A new API that supersedes an old
   pattern means updating the old entry's tip too.
6. **Verify, then write.** Before writing any entry, confirm each name, signature and
   default with `grep -rn "<name>" .cache/sources/`. Follow `references/quality-bar.md` for
   entry rules, placement and tests.
7. **Check every docs link** (the network is required): `npm run check:links`. Fix every
   failure, including in entries you did not touch. Find the real anchor by listing the
   page's ids. Do not guess them.
8. **Bump version references.**
   - `js/versions.json` (step 3), the `#selenide-version` fallback in `index.html`, and the
     `#cmd-count` fallback, set to the real count:
     `node --no-warnings -e "import('./js/data/index.js').then(({categories})=>console.log(categories.reduce((n,c)=>n+c.items.length,0)))"`
   - The `readme.md` badge, the `CLAUDE.md` tech table, the dependency snippets in
     `js/data/config.js`, `js/data/cli.js` and `js/data/appium-setup.js`, and the expected
     object in `tests/meta-bar.spec.js` (`js/versions.json pins the release…`).
   - `grep -rn --exclude-dir=node_modules --exclude-dir=.cache "<old version>" .` must only
     hit history.
   - Never edit `js/meta.json`. CI stamps it on every push to master; a stale date on
     `develop` is expected.
9. **Pin it with tests.** Add a `Selenide X.Y.Z entries` describe block to the relevant
   `tests/content/<cls>.spec.js`, with expected values copied from `.cache/sources/` and a
   comment citing the file and signature.
10. **Run the gates.** All must pass:
    `npm run lint && npm run format:check && npm test && npm run test:scripts && npm run check:links`.
    In CI, `npm run test:chromium` replaces `npm test`. Run `npm run format` if the format
    check fails.
11. **Report.** The commit or PR body lists every added, updated and fixed entry with the
    version, plus "Deliberately left out" (one line per changelog item), "Conflicts" and
    "Wanted sources". Format in `references/quality-bar.md`.

## Triage

| Changelog item | Action |
|---|---|
| New user-facing method, option, condition, config property or module | Add an entry, desc ends `Added in Selenide X.Y.Z.` |
| New option on an API that already has an entry | Update that entry's code and tip, `(X.Y.Z+)` |
| Behaviour change or rename | Update every affected entry. Say "Since X.Y.Z" in its tip |
| Deprecation | Keep the entry, name the replacement in the tip |
| Removal | Rewrite to the replacement, and add a negative guard test so the old form cannot return |
| "update Appium from X to Y" | Bump `appiumJavaClient`, re-run `fetch:sources`, re-check mobile entries that use java-client classes |
| "update Selenium from X to Y", other dependency bumps, internal refactors, CI | Leave out, and list under "Deliberately left out" |

## Red flags: stop and verify

- Writing a signature or option name you have not seen in `.cache/sources/`
- "The changelog only lists N new APIs" without having read every bullet of every version
- Only adding entries, without grepping existing ones for changed behaviour
- A docs anchor you have not confirmed by listing the page's ids
- Using a Context7 or docs result that the tag's CHANGELOG does not mention
- A test whose expected value was read from `js/data` or produced by running the code
- Weakening or deleting an assertion to make a test pass
- Any source outside the table above

## Common mistakes

| Mistake | Fix |
|---|---|
| Missed a change in an earlier release | The delta covers every version after the pinned one. Read all of them |
| `docs` link passes the tests but 404s | `data-integrity.spec.js` only checks the allowlist. Run the link checker |
| Old version left in `index.html` or a dependency snippet | Step 8 grep, every run |
| Stale sources after a bump | `npm run fetch:sources` after editing `js/versions.json` |
| em or en dash in an entry | Use a period, comma or colon. The test suite rejects dashes |
| `${selenide.version}` in a template literal breaks the whole page | Write `\${selenide.version}` |
