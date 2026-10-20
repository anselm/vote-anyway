# Continuing Vote Anyway

Before planning or changing this project:

1. Read `docs/HANDOFF.md` for the current state, preserved material, decisions, constraints and next work.
2. Read `docs/PROJECT.md` and the latest development entry identified in the handoff. Read the relevant earlier devlog entries for the area you are changing.
3. Inspect `git status`, recent commits and the actual implementation. Read `docs/DEPLOYMENT.md` before deployment or database work. Check live Cloud Run traffic rather than assuming a recorded revision is still current.
4. Use `todo.md` as a backlog; completed historical milestones and future ideas are not evidence of current implementation. Resolve discrepancies against code, tests and deployment evidence and update the current documentation.

## Preserve the work and the decisions

- Canonical checkout: `/Volumes/summer/projects/2026/vote-anyway`. Reuse it; do not create a replacement app from a conversation summary.
- Preserve `essay/`, `content/appendices/`, the original draft entries in `devlog/`, and `reference/original-prototype-20261020/`. The original prototype is a reference, not the production deployment target.
- The implementation deliberately combines the Svelte/Fastify/Cloud Run/Neon foundation with the original encrypted-ballot, receipt, signed-log and independent-verification ideas. Consult `docs/IMPLEMENTATION-AUDIT.md` before revisiting those choices.
- Preserve Anselm’s essay voice and emotional progression. Keep supporting explanation in appendices and notes. Do not add recovery/migration warnings or imply that preserved writing is missing.
- The homepage makes an affirmative argument for digital voting. The prototype is an unofficial research experiment. Distinguish working features from planned work without making the public devlog a story about handoff problems.
- Keep the restrained ivory/navy/brick civic palette, system light/dark support, and credited voting-line photograph. Avoid partisan or official-looking imagery.

## Engineering boundaries

- Keep attest.monster authentication; it works on the public site. Sign-in is not voter eligibility or one-person-one-vote. Repeat submissions are currently allowed.
- The operator can decrypt ballots and computes totals. Signed-record verification is not a proof of ballot intent or of the tally. Ranked voting is planned, not implemented.
- Never print or commit credentials, private keys or dotenv files. Never regenerate production voting keys for existing elections. Use an isolated Neon branch for database tests and migrations; the old test branch has an expiry date.
- Keep ordinary shareable page URLs, topic-scoped receipt/record URLs, and existing links compatible.
- Do not spawn subagents unless Anselm explicitly requests delegation.

## Leave a useful handoff

After a meaningful change, update `docs/HANDOFF.md`, the relevant validation/deployment notes and `todo.md`. Add a concise development entry for product decisions; include it in the explicit list in `scripts/build-essay.js` when it should appear on the public site. Record what was tested, what remains untested, and any uncommitted or undeployed work. Preserve historical entries rather than rewriting them as current status.
