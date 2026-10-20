# Combined release validation — October 20, 2026

The original source archive, essay source, three appendix sources, and v0.4 notebook were preserved unchanged. The original independent verifier accepts the original example's exported record format. New topic records bind the topic ID in the signed hash and use the maintained verifier.

Local build passed. The original prototype end-to-end test passed. The complete suite passed against an isolated Neon branch, exercising concurrent writes through two pools, restart persistence, duplicate rollback, tampering, checkpoint truncation/forks, topic isolation, authentication, replay protection, agent approval/scopes/revocation. Attest status responses in the automated authentication test are controlled fixtures; these tests do not claim a completed real passkey sign-in.

The first Cloud Run candidate (00006-kon) passed a real HTTP encrypted-ballot submission, receipt check, totals check, downloaded-checker run, and preservation checks for the essay and all appendices. Its sole automated example vote remains in the demonstration record. That candidate was never promoted to public traffic; subsequent requirements add mandatory authentication and topics.

Browser checks covered the original encrypted choose/review/submit/receipt flow, then the authenticated topic form and light/dark appearances. At a 390px viewport the document scroll width remained 390px. Light and dark palettes were previewed with temporary style overrides generated from the exact production token sets; production uses prefers-color-scheme. Checked normal-text contrast pairs exceed 4.5:1, including muted text on panels, links, buttons, errors and confirmations. Temporary preview pages are removed by the clean production build.

## Public deployment

Code commit `c9059be` is deployed as Cloud Run revision `vote-anyway-00007-guy`, serving 100% of public traffic. GitHub Checks passed. After promotion, the canonical public URL passed authentication-gate checks, pre-deployment receipt/key continuity, all essay/appendix/outline pages, the curated devlog, system theme CSS, exact supplied photo bytes, API schema, and downloaded agent CLI/verifier execution. Anselm subsequently confirmed that sign-in works well on the public site on October 20, 2026, completing the owner-operated passkey round-trip check.

Full isolated-Neon run: 10 tests passed, zero failures, zero skips. Offline/CI run: 7 passed and 3 database-dependent tests explicitly skipped. Original prototype test: 1 passed. Production build passed. No source prose or research appendices were changed.

## Shareable pages and research navigation

- Build passes. Offline suite: 7 passed, 3 database-dependent tests skipped. No database schema, ballot protocol or authentication rule changes.
- Direct HTTP checks: all 13 tested app URL variants return the application; unknown pages and API routes return 404.
- Browser checks: Topics and Start a vote have distinct paths; refresh, Back and Forward retain the correct page. Topic-specific receipt URLs prefill the receipt and link to the same topic’s public record.
- Research index destinations and all eleven working-outline appendix anchors resolve. Original essay and three appendix Markdown sources remain unchanged.
- Public Where we are updated to distinguish working features, present limitations and proposed runoff work.
