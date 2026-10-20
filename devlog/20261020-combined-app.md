# October 20, 2026 — Bringing the experiment together

The site now combines the original voting experiment with the Svelte interface, civic Americana design, Neon database and Cloud Run deployment. The neighborhood question and its three choices are retained, along with browser encryption, ciphertext receipts, signed records, public downloads, the independent checker and demonstration totals. The newer review step is retained too.

Database transactions serialize the public record across app instances. A duplicate encrypted submission cannot create a second record. The election configuration and public keys are checked against the database on startup. Fresh production keys live in a versioned Secret Manager secret; missing or mismatched keys cause an explicit failure rather than a new election identity.

The browser and standalone checker share verification code. Previously saved checkpoints detect shorter or conflicting histories; they do not prevent an operator from publishing different histories to different people. The original independent checker also accepts the exported records.

Validation: the original end-to-end test passed; six offline app/protocol tests passed; four tests against an isolated Neon branch passed without skips, including 12 simultaneous writes through two pools, duplicate rollback, HTTP submission/lookup/export/totals, fresh-pool persistence and rejection of different keys. The production build passed. Browser checks covered choose, review, encrypted submission and receipt verification, with a 390-pixel layout check.

The essay and three companion appendices retain their wording. The full v0.4 outline, including all eleven exploratory appendix sections, stays in the devlog. Migration notices have been removed from the reading pages; implementation history belongs here.

This remains a fictional research demonstration. The operator can decrypt ballots and computes the totals. Repeat participation is allowed; eligibility, cast-as-intended and independent tally proofs remain future research. The small demo verifies the entire log for writes, exports and totals; incremental verification and pagination are needed before larger use.
