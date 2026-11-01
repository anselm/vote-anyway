# Appendix C — Vote Anyway as praxis

**Stage 0.5: an unofficial, fictional test ballot, not an election system.** [Try the prototype](/lab.html) and read the [devlog](/devlog.html).

The larger hypothesis is that a digital ballot can become a comprehensible, independently checkable civic transaction. This small project publishes its code and its shortcomings so the claim can be improved by implementation, review, and testing.

## Current architecture

1. A Node 22 server publishes a demonstration ballot, its RSA-OAEP public encryption key, and an Ed25519 bulletin-board verification key.
2. A browser encrypts the chosen answer before transmission. It sends ciphertext and never sends the plaintext choice to the API.
3. The server decrypts to validate the submission and calculate a tally. It writes only ciphertext to the application record.
4. The server signs each record and links records by SHA-256 hash. It returns a receipt derived from the ciphertext.
5. A person downloads the publicly available log, obtains the authentic public verification key through a trustworthy channel, and runs the independent checker.

**What it proves:** Given an authentic verification key and a fixed known log history, the verifier can detect changed records and determine whether a supplied ciphertext receipt appears in the log.

**What it does not prove:** The server computes the tally and can misreport it. A malicious host might equivocate by showing different signed logs to different visitors. The operator can decrypt votes, and timing/network logs could correlate participants. Unrestricted volunteer casting permits duplicate submissions. The browser can misrepresent selections. This is not end-to-end verifiable voting and is not suitable for consequential elections.

## Milestones

| Stage | Experiment | Evidence |
|---|---|---|
| 0 — Interface | Explicit unofficial ballot, no official contests | Mobile usability and comprehension |
| 0.5 — Published record | Browser encryption, tracker, signed ciphertext chain | Receipts and third-party log verification |
| 1 — Verifiable election | Reviewed cast-as-intended mechanism; published cryptographic tally proofs | Independent verifier produces the final tally |
| 2 — Adversarial lab | Simulated compromised clients, duplicate ballots, dropped records and outages | Documented detections and failures |
| 3 — Coercion/identity research | Revoting, deniable credentials, privacy, eligibility | Research-backed threat claims |
| 4 — Delegation | Domain-scoped and revocable trust delegation | Comprehensible proxy-flow semantics |
| 5 — Mirror ballot | Import authoritative official question text | Clear provenance, distinction from real election, no representative claims |

## The eventual parallel-election experiment

Selected authentic ballot questions may be reproduced with documented sources, jurisdiction, effective date and exact wording. The site must prominently state on **every ballot and confirmation page**: **“EXPERIMENTAL VOTE — NOT AN OFFICIAL ELECTION. Participating here does not cast or change your real ballot.”** It must not use government seals or impersonate administrators. Participants should be directed to authoritative official voting information for the real process. Any volunteer results must be clearly described as self-selected and **not** a valid audit of official election results.

We begin instead with a fictional neighborhood question to avoid misrepresentation while core protocol features remain preliminary.
