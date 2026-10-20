# Vote Anyway — start here

Updated October 20, 2026. This is the current continuation guide. Read this file and the latest development entry before starting work. Historical devlog entries explain how decisions developed; they are not a substitute for checking the actual code and live deployment.

## Location and baseline

- Canonical checkout: `/Volumes/summer/projects/2026/vote-anyway`
- Repository: https://github.com/anselm/vote-anyway, branch `main`
- Public site: https://vote-anyway-728854538261.us-west1.run.app/
- Latest feature commits: `7ec4267` (page URLs, research index, feature plan), `a595a49` (explicit homepage argument for digital voting).
- Those features were verified live in Cloud Run revision `vote-anyway-00010-les`, at 100% traffic on October 20. Documentation releases may have a later revision; inspect service traffic before deploying or rolling back.
- Latest development entry: `devlog/20261020-ways-of-deciding.md`.
- The latest research addition publishes Appendix D, Ways of deciding together. It changes reading pages and documentation, not voting or authentication behavior.

## What Anselm wants

The site makes the case for digital voting and connects that argument to a working experiment. The homepage says “The case for digital voting,” retains “Democracy, more often,” and makes “Read the argument” its primary action. The essay’s citations, other people’s work and research appendices matter as much as the demo.

Continue the deliberate combination of both prototypes. Do not replace the existing app or blindly restore the archive. Keep the essay’s voice, original drafts and appendices. The public devlog should tell a consistent story of ideas, experiments and next questions. It should not be dominated by recovery or migration disputes.

## Working today

- Single-choice informal topics: authenticated visitors publish a title, question and 2–8 choices and share a ballot URL. Wording and choices are immutable after publication.
- attest.monster passkey sign-in and site-scoped device delegation. Anselm confirmed the real public sign-in round trip works. Signed requests include method, path, body hash, timestamp and a one-use nonce; provider revocation and expiry are checked.
- Explicit, expiring, scoped agent grants for `topics:create` and/or `votes:submit`, approved and revocable by a signed-in person. `/agents.html`, `/llms.txt`, `/openapi.json` and the downloadable CLI document the interface.
- Browser-encrypted ballots, SHA-256 ciphertext receipts, Ed25519-signed linked public records, transactional PostgreSQL persistence, server-computed totals, browser and standalone record checkers, and retained checkpoints for continuity checks.
- Real page URLs: `/topics`, `/topics/new`, `/about`, `/ballot`, `/verify`, `/board`, `/account/agents`; topic URLs `/topic/:id`, `/topic/:id/verify`, `/topic/:id/board`. Legacy `/lab.html` and `/agent.html` continue to work. Receipt links may include `?receipt=...`. Native links support refresh and browser history.
- Shared system light/dark theme; warm ivory, navy and muted brick; serif headings and fine rules. Homepage photograph credited to Bill Roth / Anchorage Daily News, with provenance in `public/images/README.md`.
- Essay, three original companion appendices plus the new Ways of deciding together appendix, full working outline with eleven appendix sections, curated devlog, research index, sourced runoff design note and existing “Where we are” plan at `/about#where-we-are`.

## Explicit limits and next priorities

Repeat submissions are permitted. Counts are submissions, not unique voters. The operator holds decryption keys and calculates totals. Signature/receipt verification does not independently prove voter eligibility, ballot intent or the tally, nor provide coercion resistance or prevent an operator from presenting different histories.

Anselm asked about electing a person and avoiding vote splitting. The proposed next feature is single-winner ranked-choice instant runoff with understandable transfers and results for each round. **No ranked-ballot or runoff implementation exists yet.** `content/voting-methods.md` explains the proposal, alternatives and limitations with sources. First define the closing time, eligibility, repeat-vote/replacement policy, tie rules and incomplete-ranking rules, fixed before opening a vote. Then implement and test the ballot, count, result presentation and agent format consistently. Approval voting, separate-round runoffs, multi-seat representation and delegation are later possibilities.

Other future work includes reviewed cryptographic protocols and independent tally proofs, incremental/paginated log verification, and operating practices such as monitoring, retention and restore drills. Do not present these as completed.

Anselm also asked to situate the experiment within the richer history of collective decisions. `content/appendices/collective-decisions.md` is published at `/appendix-collective-decisions.html`, covering historical contributions, limited/cumulative voting, STV, representation and deliberation. It cites the supplied Nonprofit VOTE article and additional sources. Its examples are educational, not a new implemented count.

## Preserved source map

- Main essay: `essay/vote-anyway-first-draft.md`; original source and prose preserved.
- Companion appendices: `content/appendices/security.md`, `democracy.md`, `prototype.md`.
- Full unfinished outline: `devlog/20261020-working-sketch-v0.4.md`, including appendices A–K and bibliography.
- Earlier snapshots: `devlog/20261020-first-draft.md`, `devlog/20261020-essay-first-draft.md`.
- Original code: `reference/original-prototype-20261020/`, excluding generated private keys/data.
- Architectural comparison: `docs/IMPLEMENTATION-AUDIT.md`. Original research documents: `docs/threat-model.md`, `docs/editorial-roadmap.md`; their historical proposals are not current implementation claims.
- Research index: `content/research.md`; keep explicit Smartocracy credit to Brad deGraf and coauthors.

All these source files are in Git. The original chat or temporary attachments are not required to continue developing the app. Git history retains earlier decisions and versions, but it does not reproduce every conversational nuance.

## Code map

- `src/App.svelte`: pages, topic creation, ballot review, receipt/record verification, sign-in and agent approval.
- `scripts/page-routes.mjs`: page/path mapping shared with the server; navigation uses ordinary links.
- `src/theme.css`, `src/style.css`: shared color tokens and interface styling.
- `server/app.js`: HTTP routes, validation, auth gates and static page routes.
- `server/protocol.js`, `server/voting-store.js`: ballot format, persistent key validation, topic configuration, encrypted storage, signed records and totals.
- `server/auth.js`, `scripts/auth-sign.mjs`, `scripts/attest/`: attest integration, nonce replay prevention, scoped grants and pinned provider code.
- `scripts/verify-board.mjs`, `scripts/verify-log.mjs`: independent public-record verification. New topics bind election ID into signed records; original example format remains compatible with the archived checker.
- `scripts/build-essay.js`: publishes Markdown reading pages and the explicitly curated devlog. Adding a Markdown file alone does not add it to the public devlog.
- `migrations/001`–`004` SQL files: legacy receipts, encrypted records/topics, authentication nonces and agent grants. `scripts/migrate.js` uses a migration ledger and advisory transaction lock.

## Run and verify

Use Node 22+. Read `README.md` and `docs/DEPLOYMENT.md` first. The ignored `.env.local` contains production database configuration; **do not casually run database tests or migrations using that file**. The ignored `.env.ballot-test` is for the isolated test branch, which expires October 27, 2026; renew or replace the test environment when necessary. Never print these files.

Build: `npm run build`. Offline tests: `npm test` (last checked 7 pass, 3 explicit database skips). Compatibility: `npm run test:original` (1 pass). Full isolated database suite: `node --env-file=.env.ballot-test --test test/*.test.js` (last full run 10 pass, no skips). That suite uses controlled attest responses; it is not a live passkey test.

To preview with the existing isolated environment: `PORT=8083 node --env-file=.env.ballot-test server/index.js`; use an available approved development port (8083 or 8084) and avoid replacing someone’s running process. Auth origins default to those ports in development. `npm start` loads `.env.local` and `.env`, so it is not the default test command on this workstation.

Release evidence is in `docs/VALIDATION-20261020.md`. Latest checks covered direct page URLs and 404s, refresh/Back/Forward, topic context and receipt prefill, all research links and eleven appendix anchors, unchanged essay bytes, authentication gates, and the previously recorded ballot’s signed-chain continuity across deployment. GitHub Checks passed for both latest feature commits. The later navigation/content release did not rerun the full database suite because no schema or ballot/auth logic changed.

Human approval of an agent on the public site has not been confirmed; automated agent scope/revocation tests passed on the isolated database. Never claim that all production interactions have been manually tested.

## Infrastructure and secrets

GCP: project `anselm-gcloud`, region `us-west1`, service `vote-anyway`. Neon: org `org-calm-sea-48867466`, project `restless-resonance-93178261`, production branch `br-twilight-feather-b40ynqpe`. Production is already provisioned; do not create replacements.

Secret Manager provides `vote-anyway-database-url:1` and `vote-anyway-voting-keys:1`. Never regenerate the production voting keys for existing elections. Runtime/build accounts, exact deployment command, candidate checks and promotion procedure are in `docs/DEPLOYMENT.md`. The `combined` candidate URL is already an allowed auth origin. Keep private keys and connection strings out of source, output and deployment uploads.

Anselm previously authorized pushing this repository and deploying the site. Continue within the requested scope; consequential new infrastructure or policy choices still need their own justification. Do not depend on a conversation’s temporary server, scratch file or browser tab for the handoff.
