# Vote Anyway

An experimental, unofficial internet voting platform and companion essay. Theory and working software evolve together.

## First release

A responsive Svelte 5 site with a fictional practice ballot, review step, randomized SHA-256 receipt fingerprints, downloadable receipts, and receipt lookup. Fastify serves the app and API from one Cloud Run container. Neon PostgreSQL optionally stores practice fingerprints. Without a database the interface explicitly uses browser-only practice; it never silently uses an ephemeral production database.

**This release is an interface and infrastructure prototype.** It does not implement identity, voter eligibility, encrypted ballot submission, vote counting, or end-to-end election verification. A receipt only establishes fingerprint presence. No actual election ballots should be submitted. Choices never leave the browser and are not tallied. Repeated practice is allowed.

## Local development

Requires Node 22 or newer.

```sh
npm ci
npm run build
npm test
npm start
```

Open http://localhost:8080. For frontend development, run `npm run dev` alongside the backend. Neon writes `.env.local`; startup, migrations, and `npm run test:db` load it automatically. An existing `.env` is also supported. Run `npm run db:migrate` before starting the server. The app uses pooled `DATABASE_URL`; migrations prefer direct `DATABASE_URL_UNPOOLED`. Both files are ignored by Git and excluded from deployment uploads.

## Project records

- [Project brief and recovered decisions](docs/PROJECT.md)
- [Architecture and boundaries](docs/ARCHITECTURE.md)
- [Cloud Run and Neon deployment](docs/DEPLOYMENT.md)
- [Companion essay recovery status](essay/README.md)
- [Development log](devlog/2026-10-20.md)

Canonical checkout: `/Volumes/summer/projects/2026/vote-anyway`.
