# Handover: Supabase analytics (plan Task 8, deferred)

For a fresh session. Read this, then `CLAUDE.md`, then plan Task 8.

## Where the project stands

- Branch `develop`, with `master` also on the remote. 341 entries, 22 categories. The cheat sheet is
  complete and usable.
- The **visitor counter is live** against the shared Supabase project, using Selenide-only objects
  (`selenide_visits`, `increment_selenide_visits`, Edge Function `increment-selenide-visitor`).
- **Command-view tracking is still off** (the Popular filter and the fire badge). The user deferred it
  ("let's worry about the supabase stuff later, remind me to fix those stuff, keep placeholders").
  The user must be reminded of this at the end of major work.

## Why command views are off (do not flip the flag early)

`js/popular-commands.js` was copied from the Playwright cheat sheet and still points at **that
site's** table (`command_views`) and Edge Function (`increment-command-view`) in the shared project
(`tilbhgcncnwibnfgebkg.supabase.co`). Turning it on now would add Selenide command opens to the
Playwright site's counts.

## Current state in the repo

| Item | State |
|---|---|
| `js/popular-commands.js` | `export const ENABLED = false;`, `SUPABASE PLACEHOLDER` comment, early returns, still the **Playwright** names |
| `js/visitor-counter.js`, `js/visitor-display.js` | live, Selenide names, session and cache keys prefixed `selenide-` |
| `js/app.js` | Popular filter shows only when `popularCmds.ENABLED` |
| `tests/popular-commands.spec.js` | `test.describe.skip` |
| `tests/meta-bar.spec.js` | visitor counter tests active; `Command-view analytics placeholder` passes and proves no command-view request is sent |
| `supabase/migrations/0001_selenide_visits.sql` | Selenide names, applied |
| `supabase/migrations/0002_command_views.sql`, `supabase/functions/increment-command-view/` | still the **Playwright** names |
| `supabase/functions/increment-selenide-visitor/` | Selenide name, deployed |

## What to build (Task 8, command views only)

The full, step-by-step version is in
`docs/superpowers/plans/2026-10-13-selenide-cheat-sheet.md`, **Task 8**, with the design in
`docs/superpowers/specs/2026-10-13-selenide-cheat-sheet-design.md` section 8.

Decision already made: reuse the same Supabase project, with `selenide_`-prefixed objects.

| Kind | Name |
|---|---|
| Table | `selenide_command_views` |
| RPC | `increment_selenide_command_view(cmd_id text)` |
| Edge Function | `increment-selenide-command-view` |
| localStorage / sessionStorage keys | `selenide-command-views-cache`, `selenide-cmd-opened:` |

Order of work (the plan's order, test first):
1. Point the popularity tests at the new names and the new storage keys. Watch them fail.
2. Rename in `js/popular-commands.js`. Watch them pass.
3. Write the new migration and Edge Function. Delete the old Playwright-named ones.
4. Then set `ENABLED = true`, remove the placeholder comment, remove `.skip` from the two popularity
   describes, delete the `Command-view analytics placeholder` describe, replace the "20 commands"
   fixtures in the popularity tests (the plan has the exact replacement), update the Mobile filter
   test to expect `['All', '⭐ Start Here', '🔥 Popular', '📱 Mobile']`, and replace the "command
   views are off" notes in `CLAUDE.md` and `AGENTS.md`.

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

## Cleanup when finished

Delete the memory file `supabase-deferred.md` and its line in `MEMORY.md`, and delete this file.
