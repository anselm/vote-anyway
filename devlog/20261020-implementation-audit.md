# Implementation audit — October 20, 2026

## Decision

Keep the deployed Fastify/Svelte/Neon/Cloud Run foundation and recover the original laboratory's meaningful behavior through a measured port. Preserve the original code unchanged as a reference. Do not deploy it wholesale, and do not extend the newer fingerprint-only flow into a voting protocol.

This is an audit and implementation decision record, not a claim that the port is complete. No voting behavior was changed during this audit.

## What was compared

- Original: `reference/original-prototype-20261020/`, restored from Anselm's supplied ZIP, excluding generated keys and ballot data.
- Current: `server/`, `src/`, `migrations/`, current tests, container and deployment configuration.
- Product intent: original essay, original threat model and prototype appendix, editorial roadmap, recovered v0.4 working sketch, and the implementation handoff.

The project is a public research publication and a laboratory for testing voting properties. A working ballot is one component. The original research, prose, design reasoning, and independent inspection tools are part of the product, not disposable scaffolding.

## Comparison by responsibility

| Responsibility | Original | Current | Decision |
| --- | --- | --- | --- |
| Research publication | Essay, appendices, devlog, roadmap, threat model | Sources now recovered and published in the new site | Preserve originals; maintain provenance and current-status notes |
| Ballot experience | Fictional question; client encryption; confirmation; receipt; log verification; totals | Different fictional question; review step; fingerprint; receipt lookup | Preserve original question and experiment semantics; retain useful review/accessibility work |
| Ballot protocol | RSA-OAEP ciphertext, ciphertext receipt, signed hash chain | Randomized SHA-256 fingerprint; no submitted ballot | Original is the functional baseline; new fingerprint flow is only a storage exercise |
| Verification | Browser verifier and separately runnable Node verifier | Server lookup | Retain independent verifier and artifact compatibility; strengthen checkpoint checks |
| Tally | Server decrypts and counts, explicitly not independently verifiable | No tally | Restore labeled demonstration tally; do not equate it with a tally proof |
| Persistence | Whole JSON file, synchronous access, local key file | Bounded PostgreSQL pool, parameterized queries, receipt table | Keep PostgreSQL; design transactional ballot storage before porting writes |
| Deployment | Simple dependency-free Node HTTP server | Container, Cloud Run, Secret Manager, Neon, dedicated identities | Keep the deployed infrastructure |
| HTTP behavior | Manual parsing, size checks, static routes, explicit limits | Fastify schema validation, headers, throttling, generic DB errors | Keep framework controls; test compatibility with original endpoints |
| Test evidence | One end-to-end test covers original encrypted flow and tampering | Unit tests plus actual database persistence test | Keep both; add missing adversarial/concurrency/compatibility cases |
| Visual direction | Original page structure and plain JS | Responsive interface, requested civic Americana | Retain current design and stack, carry original functional meaning forward |

## Findings

### 1. The current receipt is not a ballot

`src/receipt.js` hashes `{election, choice, nonce}` and returns only the digest and timestamp. The choice and nonce are discarded, and the server receives only a 64-character string. This is useful for testing storage and lookup, but it cannot produce a tally or demonstrate that a stored record encodes a valid ballot. The API accepts arbitrary well-formed fingerprints. Its existing tests establish storage behavior, not election properties.

Do not build more voting semantics on this format. Preserve existing practice receipts and their lookup rather than reinterpret them as ballots. New encrypted-ballot records need their own explicit version and storage model.

### 2. The original is a coherent, limited laboratory

The browser encrypts an election ID, choice, and nonce. The server decrypts for validation, rejects exact duplicate ciphertext, stores ciphertext, signs hash-linked records, and computes a demonstration tally. The separate verifier checks record hashes, signatures, and receipt inclusion. These are substantive capabilities worth retaining.

The original also correctly documents its limits. The operator can decrypt individual ballots and fabricate tally totals. Client encryption does not establish cast-as-intended, eligibility, coercion resistance, or tally correctness. Porting these features should preserve those qualifications rather than promote them into stronger claims.

### 3. Valid-prefix truncation needs a trusted comparison

A focused audit probe created two valid records using the original code. `verifyBoardRecords` accepted:

- the complete two-record board;
- the board with its last record removed;
- an empty replacement board.

This is a limitation of checking an internally consistent hash chain without an independently known checkpoint. It does not mean the hash/signature primitives failed. The verifier needs an expected election identifier, authentic key, and trusted prior length/head when checking continuity. A voter whose missing receipt is supplied can detect its absence, but an auditor without a checkpoint cannot infer that additional records existed.

Add explicit tests for suffix truncation, rollback, an unexpected key, and conflicting histories. Distinguish detecting a conflict against a known checkpoint from preventing a malicious operator from publishing different signed histories. Independent witnesses remain a separate research/operational task.

### 4. Filesystem persistence cannot simply move to Cloud Run

The original reads and verifies the entire board before each append, rewrites the full JSON array, and uses a local temporary-file rename. Within its single synchronous process that avoids interleaving of this code, but the implementation has no cross-process coordination. Multiple Cloud Run instances cannot share or serialize this local state. Rewriting a growing whole log and re-verifying it on every append also creates scaling costs.

Use a transaction to serialize updates to one election's sequence/head, enforce unique receipt and sequence constraints, insert the record, and update the head atomically. Test parallel writes from distinct pools and rollback on failure. Do not assume that moving the JSON array into a JSONB column solves coordination.

### 5. Key lifecycle is part of the migration

The original generates encryption/signing keys when a local file is missing. On an ephemeral host that could silently generate different keys after a restart, making old records incompatible or unreadable.

Use persistent, versioned, election-scoped key material and explicit initialization. Keep private material out of source, images, public logs, and responses. Missing production keys must fail clearly rather than trigger silent regeneration. Preserve the public key alongside exported evidence and test restart/redeployment compatibility. Decide the longer-term trustee/threshold model separately; server-held keys remain an explicitly limited research mode.

### 6. Original tests are valuable but not exhaustive

The original test passed after import and again during this audit. It exercises actual browser-compatible encryption, invalid-choice rejection, exact-ciphertext duplicate rejection, receipt inclusion, server tally, and modification of a ciphertext or previous-hash field. It does not establish concurrency safety, suffix-truncation detection, key continuity, or independent tally correctness. Those are not implied by its passing status.

The current unit suite also passed. Its database test was skipped in the offline unit run; the separate real-Neon restart test passed earlier and is recorded in `devlog/20261020-neon.md`. Do not count an offline skip as a live database pass in future reports.

### 7. Keep original work and current status distinct

Recovered original appendices and threat-model documents describe the earlier laboratory. The current site still links to a pending lab migration page. A reader should be able to tell which description belongs to which implementation. Keep brief status notes and a capability matrix current; avoid rewriting historical prose to make it appear the migration was always complete.

There is now recovered source for the original code, three published appendices, threat model, editorial roadmap, and v0.4 sketch with its eleven research appendix sections. The complete handoff and the remainder of the conversation still merit a provenance audit. No summary should replace a source artifact that can be preserved.

## Implementation order and acceptance gates

1. **Freeze a behavioral baseline.** Record original fictional election ID/options, ciphertext encoding, receipt derivation, signed-record format, exports, endpoint semantics, UI notices, and verifier output. Preserve the original independent verifier as a compatibility oracle. No new cryptographic primitives are needed to establish this baseline.
2. **Design persistence and key initialization together.** Versioned election configuration/public keys; ciphertext records; transactional sequence/head; duplicate constraints; persistent private material with least-privilege access. Keep existing fingerprint receipts separate. Exercise migrations on a development Neon branch.
3. **Port backend behavior with compatibility tests.** Preserve valid/invalid submission, duplicate handling, receipt lookup, public-board export, public-key download, and explicitly server-computed totals. Check exports with both the original verifier and the maintained verifier. Confirm no plaintext choice is stored in ballot records.
4. **Improve audit continuity deliberately.** Add trusted-checkpoint inputs and tamper/rollback/foreign-election/wrong-key tests. Document what is still trusted. Do not introduce an unreviewed new protocol under the label of migration.
5. **Port the original user flow into the existing design.** Keep its fictional election and explanatory distinctions; add the useful review step. Include encryption, local receipt comparison, full log verification, export, and labeled demonstration totals. Avoid maintaining two competing primary voting experiences.
6. **Verify before public switch.** Original/current unit suites; new protocol compatibility tests; actual Neon concurrent-write/restart tests; independent downloaded verifier; desktop and mobile flow; failure states; current essay/appendix consistency. Then deploy and verify the public service.
7. **Resume broader platform research afterward.** attest.monster, eligibility/adjudication, reviewed E2E tally protocols, witnesses, configurable elections, and delegation remain the documented roadmap. A restoration effort should not silently expand into implementing them all at once.

## Completion standard

The port is complete only when a visitor can perform the original experiment on the deployed infrastructure, an independent tool can inspect its exported evidence, persistence/key continuity survive instance changes, and the claims match the tests. Source recovery, a prettier interface, and a successful deployment are each useful; none alone meets that standard.

## Implementation follow-through

The combined release implements the first six acceptance gates; see `devlog/20261020-combined-app.md` for evidence. The original source and prose remain unchanged. Production keys are a fresh Secret Manager version, the encrypted records use separate PostgreSQL tables, and prior fingerprint receipts remain readable. Full-log verification is deliberately retained for this small research demo, including before append; larger-scale incremental verification remains future work.
