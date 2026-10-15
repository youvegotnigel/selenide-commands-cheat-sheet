# Handover: Supabase analytics (plan Task 8, deferred)

For a fresh session. Read this, then `CLAUDE.md`, then plan Task 8.

## Where the project stands

- Branch `develop`, pushed to `origin/develop`. 247 entries, 21 categories. The cheat sheet is
  complete and usable. `master` is not on the remote yet (see "Branches" below).
- Analytics are **off**. The user deferred all Supabase work ("let's worry about the supabase stuff
  later, remind me to fix those stuff, keep placeholders"). The user must be reminded of this
  at the end of major work.
- Nothing has ever run against the live Supabase project from this repo.

## Why it is off (do not flip the flags early)

The client code was copied from the Playwright cheat sheet and still points at **that site's**
live project (`tilbhgcncnwibnfgebkg.supabase.co`) and its tables (`visits`, `command_views`).
Turning analytics on now would add Selenide visitors and command opens to the Playwright
site's counts.

## Current state in the repo

| Item | State |
|---|---|
| `js/popular-commands.js` | `export const ENABLED = false;`, `SUPABASE PLACEHOLDER` comment, early returns |
| `js/visitor-counter.js` | local `ENABLED = false`, early return, same comment |
| `js/visitor-display.js` | local `ENABLED = false`, early return, same comment |
| `js/app.js:262` | Popular filter shows only when `popularCmds.ENABLED` |
| Visitor badge | shows `—` while off |
| `tests/popular-commands.spec.js`, visitor tests in `tests/meta-bar.spec.js` | `test.describe.skip` |
| `tests/meta-bar.spec.js` `Analytics placeholder` | passes now; proves no request reaches Supabase |
| `supabase/migrations/0001_visits_counter.sql`, `0002_command_views.sql` | still the **Playwright** names |
| `supabase/functions/increment-visitor/`, `increment-command-view/` | still the **Playwright** names |

## What to build (Task 8)

The full, step-by-step version is in
`docs/superpowers/plans/2026-10-13-selenide-cheat-sheet.md`, **Task 8** (around line 2165), with
the design in `docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md` section 8.

Decision already made: reuse the same Supabase project, with `selenide_`-prefixed objects.

| Kind | Name |
|---|---|
| Table | `selenide_visits` |
| RPC | `increment_selenide_visits()` |
| Table | `selenide_command_views` |
| RPC | `increment_selenide_command_view(cmd_id text)` |
| Edge Function | `increment-selenide-visitor` |
| Edge Function | `increment-selenide-command-view` |
| localStorage / sessionStorage keys | `selenide-visitor-counted-session`, `selenide-visitor-count-cache`, `selenide-command-views-cache`, `selenide-cmd-opened:` |

Order of work (the plan's order, test first):
1. Add the catch-all abort route `**tilbhgcncnwibnfgebkg.supabase.co/**` as the first line of both
   `mockBackends` helpers, so an unmocked request can never reach the live project.
2. Point the tests at the new names and the new storage keys. Watch them fail.
3. Rename in the three client files. Watch them pass.
4. Write the new migrations and Edge Functions. Delete the old Playwright-named ones.
5. Then the extra steps: set `ENABLED = true` in the three files and remove the placeholder
   comments, remove `.skip` from the four analytics describes, delete the `Analytics placeholder`
   describe, replace the "20 commands" fixtures in the popularity tests (the plan has the exact
   replacement), update the Mobile filter test to expect
   `['All', '⭐ Start Here', '🔥 Popular', '📱 Mobile']`, and replace the "analytics are off" notes
   in `CLAUDE.md` and `AGENTS.md`.

## What only the user can do

Per the plan, the user applies the SQL and deploys the Edge Functions themselves. Do not run
`supabase` CLI commands against the live project, and do not use the service-role key. Hand
over the SQL files and the exact deploy commands, and ask the user to confirm once applied
before flipping `ENABLED`.

## Rules that still apply

- Expected values in tests come from an independent source, never from the code under test.
  Write the test first and watch it fail.
- No em-dashes or en-dashes in command data. No build step, no CDN.
- Gates: `npm test`, `npm run lint`, `npm run format:check`, `npm run check:links`.
- Do not push or merge without being asked.

## Branches

Local `master` is still the baseline (a Playwright copy, `4a25ee9`) and is not on the remote.
To fix: `git checkout master && git merge --ff-only develop && git push -u origin master`, then
set the default branch and the Pages source in the GitHub settings. CI (`test.yml`,
`stamp-date.yml`) only runs for `master`, so the analytics tests will not run in CI until this
is done.

## Cleanup when finished

Delete the memory file `supabase-deferred.md` and its line in `MEMORY.md`, and delete this file.
