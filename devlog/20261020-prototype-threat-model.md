# Threat model — the first Vote Anyway laboratory

**Status:** educational research prototype. No official votes, eligibility decisions, or representative opinion measurement.

## Assets and actors

- Volunteer uses a personal phone or browser.
- Research operator runs one server which publishes the ballot encryption key and also holds the private decryption key.
- Independent observer downloads the public ballot log and signature-verification key.
- Potential attacker can submit unlimited ballots, compromise a browser, interrupt connectivity, or tamper with hosted artifacts.

## Properties this version tests

- Browser encrypts a ballot before transmission, using the server's public key.
- Persisted application records contain ciphertext, not plaintext choices.
- A voter gets a SHA-256 receipt identifying *ciphertext*, not a declaration of candidate preference.
- An independent verifier checks the per-record Ed25519 signature, hash chain, and receipt presence using separately obtained authentic keys/data.
- A modified or deleted record in a fixed, previously-observed log is detectable (unless an attacker can also replace signing keys and all externally known checkpoints).

## Properties it does not establish

- **No eligibility / uniqueness guarantee.** No accounts, identities, personhood checks, or vote limits; unlimited submissions are possible.
- **No verifiable tally.** The server decrypts and counts; it could lie about totals without invalidating the signed record. Encryption is not proof of counting.
- **No cast-as-intended verification.** A compromised browser can encrypt a choice other than the one shown to the voter.
- **No robust bulletin-board consistency.** A corrupt operator with the signing key can create multiple signed histories. External witnessing/gossip and authenticated checkpoints are needed.
- **No receipt-freeness guarantee.** A ciphertext hash alone does not reveal a choice, but the voter could preserve encryption randomness or other evidence; the overall protocol is not coercion-resistant.
- **No strong privacy against the operator.** Server holds the decrypting key; HTTP timing, IP addresses and requests can be correlated even without application logging. Run locally for now. No analytics SDKs.
- **No independent identity channel.** An experiment account would not be proof of legal election eligibility.
- **No availability guarantees.** Denial-of-service, censorship, server or client failures are possible.
- **No proven crypto protocol.** RSA-OAEP/SHA-256/Ed25519 are standardized primitives, but composition here has not been formally reviewed.

## How to interpret outcomes

This laboratory can test usability, integrity of a published record under a fixed key, receipt inclusion, and deployment mechanics. It cannot demonstrate security equivalent to an official election. Differences between volunteer tallies and official results should never be described as proof of irregularities.

## Next security gates

Independent protocol review; ballot challenge protocol; independently verifiable tally, threshold key handling, privacy/logging review; external signed log checkpoints; and a sound eligibility/uniqueness procedure plus coercion research.
