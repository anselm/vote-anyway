# Vote Anyway

An experimental, unofficial voting laboratory and companion essay. Theory and working software evolve together.

## Current app

The Svelte interface combines a fictional neighborhood ballot and review step with browser-side RSA-OAEP encryption, ciphertext receipts, Ed25519 signed hash-linked records, browser verification, downloadable evidence and an independent checker. Fastify serves the app from Cloud Run; Neon PostgreSQL serializes ballot writes across instances. Encryption and signing keys persist in Secret Manager and must match the election's public keys in the database.

The server can decrypt ballots and computes the demonstration totals. Repeat participation is allowed. This research demo does not provide voter eligibility, cast-as-intended or independent tally proofs, or coercion resistance. Records and totals count submissions, not unique people. Earlier practice fingerprints remain in a separate table and can still be looked up.

## Local development

Requires Node 22 or newer. Install with `npm ci`, run `npm run db:migrate`, `npm run build`, `npm test`, `npm run test:original`, then `npm start`. The app opens at http://localhost:8080; `npm run dev` provides frontend development alongside the backend.

Use an isolated Neon branch for development. `DATABASE_URL` is the pooled connection; migrations prefer `DATABASE_URL_UNPOOLED`. `VOTING_KEYS` is a JSON bundle containing matching encryption and signing public/private PEM keys. Generate development keys explicitly with the exported `generateKeys()` function in `server/protocol.js`; never commit them or reuse development keys in production. Without keys the development server reports the ballot service unavailable; production refuses startup. `.env.local` and `.env` are loaded by npm start and excluded from Git/container uploads.

The database integration tests require `BALLOT_TEST_DATABASE_URL` and `BALLOT_TEST_KEYS`, targeting an isolated migrated branch. Standard tests skip these explicitly when credentials are absent. The original prototype remains unchanged under `reference/` as a compatibility reference.

## Independent checking

Download `/api/board`, `/api/signing-key.pem`, `/verify-log.mjs` and `/verify-board.mjs`. With all four files in one folder:

```sh
node verify-log.mjs board.json signing-public-key.pem [receipt-or-dash] [checkpoint.json]
```

Get an authentic public key and retain earlier checkpoints through a trusted channel. A checkpoint detects a shortened or conflicting history; fetching both key and log from one operator alone does not establish independent trust. This checker verifies record integrity and inclusion, not the tally. The original checker also accepts the exported record format.

## Writing and project records

The essay, three companion appendices, and the full v0.4 outline with eleven exploratory appendix sections are preserved. `/essay.html`, `/devlog.html`, and `/lab.html` link the writing and experiment. The source prose was not rewritten during the software integration.

See [todo.md](todo.md), [implementation audit](docs/IMPLEMENTATION-AUDIT.md), [deployment](docs/DEPLOYMENT.md), and [combined release](devlog/20261020-combined-app.md).

Canonical checkout: `/Volumes/summer/projects/2026/vote-anyway`.
