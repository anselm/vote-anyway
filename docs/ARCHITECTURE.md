# Architecture

One Node 22 container serves a Vite-built Svelte 5 application and Fastify JSON API. Cloud Run is stateless. Persistent practice receipts use an external PostgreSQL database via a bounded connection pool (maximum five connections per container).

## Current data flow

1. Visitor chooses a fictional neighborhood option and reviews it.
2. Browser generates 256 random bits, combines the nonce with the election identifier and choice, and computes SHA-256.
3. Only the fingerprint is sent to the API when a database is configured. Choice and nonce are not sent or saved.
4. PostgreSQL stores the fingerprint and timestamp. Without a database the receipt remains browser-local.
5. Visitor can download the fingerprint and look it up.

The nonce is discarded. This is intentionally **not** a commitment-opening or tally protocol. A random-nonce hash obscures low-entropy choices, but a lookup cannot prove ballot intent, eligibility, uniqueness, secrecy against the platform, or correct tallying. There are no identity/eligibility claims in this practice release. Arbitrary well-formed fingerprints can be submitted.

## Endpoints

- `GET /api/health`: database reachability and schema readiness, or browser-only mode.
- `GET /api/config`: practice mode and whether persistence is configured.
- `POST /api/receipts`: persist one 64-character lowercase hexadecimal fingerprint.
- `GET /api/receipts/:commitment`: retrieve fingerprint and original timestamp.

The service uses request-size limits, schema validation, security headers, parameterized SQL, generic database errors, and per-instance request throttling. Cloud Run request logs can include request IPs/paths; database minimization does not imply infrastructure anonymity. Do not use the practice receipt register for confidential or official voting. Global abuse control and retention policies must be designed before expanding the experiment.

## Future boundaries

Identity authenticates a participant. Eligibility determines authority for a particular election. Ballot casting must avoid disclosing identity-choice links. Audit records carry independently checkable evidence. These require explicit protocol design; do not add an identity column to ballot storage and call the result anonymous.
