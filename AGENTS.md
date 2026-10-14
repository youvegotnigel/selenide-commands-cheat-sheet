# AGENTS.md

Guidance for AI agents (and humans) working on the **Selenide Commands Cheat Sheet**.

The full project guide lives in [CLAUDE.md](CLAUDE.md). Read it before making changes. The essentials:

1. **No build step, no runtime dependencies, no CDN.** Plain ES modules served as static files.
2. **What shipped is the truth.** Every name, signature and default in `js/data/` is verified against the pinned release's sources jars in `.cache/sources/` (`npm run fetch:sources`).
3. **Approved sources only.** See "Sources policy" in CLAUDE.md. Ask before using any other site.
4. **Tests use independent expected values.** Never derive an expected value from the code or data under test. Write the test first and watch it fail.
5. **Run the gates before finishing:** `npm test`, `npm run lint`, `npm run format:check`, `npm run check:links`.
6. **Don't commit, push, merge, or open PRs unless asked.**
7. **Analytics (Supabase) stay off** until the Selenide-specific backend exists.
8. To sync with a new Selenide release, follow `.claude/skills/selenide-release-sync/SKILL.md`.
