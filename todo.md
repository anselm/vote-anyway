# Vote Anyway — work checklist

Updated October 20, 2026. This file distinguishes recovered source, missing source, implemented features, and future ideas. A link or summary is not evidence that the underlying artifact has been recovered.

## Migration audit: recover the existing work first

### Preserved

- [x] Recover the 2,073-word **Vote Anyway** first draft into `essay/vote-anyway-first-draft.md` and publish it at `/essay.html`.
- [x] Preserve its prose, headings, emphasis, and link destinations. Recovery used the original chat's rendered document; The user-supplied original was compared byte for byte and matches.
- [x] Recover `devlog/20261020-first-draft.md` from its document preview.
- [x] Record the technology choices and main product concepts in `docs/PROJECT.md` and the devlogs.
- [x] Establish GitHub as the source of truth and deploy the site to Cloud Run with Neon receipt persistence.

### Missing original artifacts — highest priority

- [x] Retrieve `vote-anyway-project-20261020.zip` from **Digital voting article framing**, conversation `6ad56b00-2c04-83ea-a361-144e5f98eea5`. Original path: `/mnt/data/vote-anyway-project-20261020.zip`.
- [x] Inspect and import original `content/appendices/security.md`.
- [x] Inspect and import original `content/appendices/democracy.md`.
- [x] Inspect and import original `content/appendices/prototype.md`.
- [x] Recover original `docs/editorial-roadmap.md` and `docs/threat-model.md`.
- [x] Recover `voting_unbundled_working_outline_v0.4.md`, the fuller research notebook. Retain earlier versions if obtainable; v0.3 is an earlier reference, not the latest known outline.
- [x] Preserve the original prototype source and tests in a reference directory or branch before porting them.
- [ ] Save the complete implementation handoff from the original chat as a provenance document. It identifies substantially more work than the initial partial chat read revealed.
- [ ] Audit the remaining original conversation for decisions not represented here; record source message/artifact references rather than relying on recollection.
- [x] Compare the user-supplied essay and original devlog with recovered copies. Essay matches byte for byte; restored the devlog’s numbered question list to match its original.
- [ ] Compare remaining recovered artifacts with originals as they become accessible; retain provenance and checksums.

**Appendix status:** the three original published appendices are now restored from the supplied ZIP under `content/appendices/` and published at their original URLs. The v0.4 working sketch, including eleven exploratory appendix sections, citations, candidate prose, and version history, is in `devlog/20261020-working-sketch-v0.4.md`. These are distinct artifacts. `/lab.html` now opens the combined encrypted-ballot experience.

The original source is preserved under `reference/original-prototype-20261020/`, excluding generated keys and ballot data. The archive's essay and devlog exactly match the supplied originals. The sketch was recovered from the original chat's rendered document and checked for intact transfer, not original-file byte identity.

**Archive handling:** the handoff reports generated development private keys in `data/keys.json` and sample records in `data/board.json`. Do not commit or deploy these keys. Import source separately from generated data and create fresh production secrets where needed.

## Audit decision before implementation

- [x] Compare original and current code, tests, threat model, and product intent. See [implementation audit](docs/IMPLEMENTATION-AUDIT.md).
- [x] Probe the original verifier: valid-prefix truncation passes without an independently trusted checkpoint. Record this as a migration requirement, not a solved guarantee.
- [x] Establish original behavior/artifact compatibility tests before porting.
- [x] Design transactional ballot ordering and persistent election-scoped key initialization together; test on a development database branch.
- [x] Preserve current fingerprint receipts as practice records, separate from encrypted ballots.
- [x] Port and verify in the acceptance order in the audit; do not restore the original server wholesale.

## Preserve the original prototype's capabilities

The combined app retains Svelte, Cloud Run, Neon and the civic Americana design, and ports the original experiment’s behavior. Earlier fingerprint receipts remain separate and readable.

- [x] Browser-side RSA-OAEP ballot encryption and validated ciphertext submission.
- [x] Ciphertext-based receipt generation and lookup.
- [x] Hash-linked ballot records signed with Ed25519.
- [x] Downloadable public bulletin board and signing public key.
- [x] Independent `scripts/verify-log.mjs` record-integrity / receipt-inclusion verifier.
- [x] Server-computed demonstration tally.
- [x] Tests for valid submission, malformed input, receipt inclusion, tamper detection, and tally behavior.
- [x] Replace original filesystem persistence with transactional PostgreSQL storage before deploying that demo on Cloud Run.

Keep limitations explicit: the demonstration has server-held decryption keys, no eligibility or uniqueness enforcement, no cast-as-intended proof, no independent tally proof, no coercion resistance, and no protection against a sole operator replacing history and keys. Record integrity is not independent tally verification.

## Research publication and editorial continuity

- [x] Publish recovered appendices directly from their Markdown source, with working cross-links.
- [x] Publish the actual devlog on the website, including the full original essay as `devlog/20261020-essay-first-draft.md`.
- [ ] Restore citations and third-party research from the appendices: cryptographic protocols, security objections, Estonia, delegation, incentives, and voting methods.
- [ ] Preserve explicit credit to Brad deGraf and the other Smartocracy authors. Keep the 2007 paper and profile references.
- [ ] Keep the core essay concise and persuasive; put technical detail and previous work in appendices.
- [ ] Retain theory → experiment → evidence → revision as the relationship between writing and software.
- [ ] Distinguish digital transaction reliability from all secret-ballot requirements without diluting the essay's argument.
- [ ] Preserve voting access and faithful counting as paired goals, and broader governance/environmental questions as context.
- [ ] Keep original draft descriptions separate from current implementation status; use brief publication notes instead of silently rewriting historical prose.

## Platform development

- [ ] Inspect attest.monster's actual protocol, claims, API, and latency; do not assume OIDC/OAuth. Keep it behind an identity adapter, separate from ballot storage.
- [ ] Define elections, questions, choices, voting methods, published policy versions, entitlements, submissions, eligibility decisions, accepted ballots, audit checkpoints, and tally artifacts.
- [ ] Implement organizer authentication and election creation, preview, publication, opening, closing, adjudication, and audit states.
- [ ] Lock/version rules before votes or results can influence later changes.
- [ ] Support provisional encrypted submission separately from eligibility adjudication, acceptance, and tallying.
- [ ] Begin with open and invitation-only participation; retain policy extension points for membership lists, attestations, and social endorsements.
- [ ] Explore Advogato-inspired trust/enfranchisement graphs. Community eligibility is distinct from statutory governmental eligibility.
- [ ] Select a reviewed election protocol; examine ElectionGuard and Helios before extending custom cryptography.
- [ ] Test cast-as-intended, recorded-as-cast, and tallied-as-recorded independently.
- [ ] Publish independent verification software and signed audit packages; consider R2, external witnesses, and optional checkpoint anchoring. Blockchain is not the default ballot database.
- [ ] Explore plurality, runoff, ranked-choice, and approval methods as explicit, separately testable rules.
- [ ] Later: topic-specific/revocable/transitive delegation, direct-vote override, cycle handling, and concentration analysis.
- [ ] Later: participation incentives, civic credits/rewards/obligations, and reserve/slashing ideas, protecting abstention and avoiding rewards for a particular choice.

## Operations and verification

- [x] Cloud Run: `anselm-gcloud`, `us-west1`, service `vote-anyway`.
- [x] Neon: `restless-resonance-93178261`, production branch `br-twilight-feather-b40ynqpe`.
- [x] Keep application identity separate from build identity; database credential in Secret Manager with secret-scoped runtime access.
- [x] Use pooled application connections and direct migration connections; ignore dotenv and `.neon` in Git and deployment uploads.
- [x] Verify live receipt write/read and persistence across app/pool restart; build and GitHub checks pass.
- [ ] Establish billing alerts, monitoring, retention policy, backup/restore verification, and failure recovery procedures.
- [x] Use isolated Neon branches for future schema changes; verify migration behavior before production application.
- [ ] Add cross-instance and post-redeployment persistence checks, alongside existing pool-restart coverage.
- [ ] Decide whether/when a custom domain is useful.

## Design direction

- [x] Use warm ivory, deep navy, muted brick red, serif editorial headings, fine document rules, and a subtle woven-line/star detail.
- [x] Apply the palette to the main app, essay, and appendices.
- [x] Preserve neutral, welcoming civic positioning; avoid flags, eagles, campaign slogans, official seals, or implied governmental affiliation.
- [x] Carry this design through recovered appendix and audit pages as they are restored.

## Combined release — October 20, 2026

- [x] Remove recovery/migration banners from the public essay and appendix pages without altering their source prose.
- [x] Preserve the v0.4 sketch and all eleven research appendix sections in the devlog.
- [x] Verify public records in the browser and independently with both the original and maintained checkers.
- [x] Compare saved checkpoints to detect truncation, wrong keys/elections and conflicting history.
- [x] Test 12 concurrent writes through two database pools, duplicate rollback, HTTP flow, restart and key mismatch on an isolated Neon branch.
- [x] Store fresh production keys in a versioned Secret Manager secret with access restricted to the app runtime.
- [ ] Introduce pagination/incremental verification before larger use: this research demo reads the complete log for integrity checks and totals.

## Topics, identity, agents and presentation

- [x] Publish immutable topic questions with 2–8 choices and shareable URLs.
- [x] Require attest.monster authentication and device-signed requests for topic creation and voting, including the example endpoint.
- [x] Check delegation origin, device key, expiry and revocation; prevent signed-request replay in shared storage.
- [x] Add explicitly approved, scoped and revocable agent permissions and a runnable CLI.
- [x] Publish `/llms.txt`, `/openapi.json`, and a readable agent guide.
- [x] Reframe the public devlog around the project’s development; retain historical engineering records in Git.
- [x] Support system light/dark mode using one shared palette; check normal text contrast and mobile overflow.
- [x] Use the supplied Anchorage voting-line photograph on the homepage with source credit.
- [x] Confirm a live human passkey sign-in round trip with the owner. Anselm confirmed public-site sign-in works on October 20, 2026.
- [ ] Define topic eligibility and one-person/one-vote or revoting policies. Authentication alone does not implement them.
- [ ] Add topic management, closing and moderation; questions are currently immutable and open immediately.
