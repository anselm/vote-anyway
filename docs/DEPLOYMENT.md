# Deploy the existing Vote Anyway service

Read [HANDOFF.md](HANDOFF.md) first. The service, database, accounts and secrets already exist. Run from `/Volumes/summer/projects/2026/vote-anyway`.

## Existing infrastructure

- GCP project `anselm-gcloud`, region `us-west1`, service `vote-anyway`.
- Canonical URL: https://vote-anyway-728854538261.us-west1.run.app/
- Alternate service URL: https://vote-anyway-6zjzomqhbq-uw.a.run.app/
- Candidate tag: https://combined---vote-anyway-6zjzomqhbq-uw.a.run.app/
- Runtime account: `vote-anyway-runtime@anselm-gcloud.iam.gserviceaccount.com`, with secret-scoped access.
- Build account: `vote-anyway-build@anselm-gcloud.iam.gserviceaccount.com`, with `roles/run.builder`. The default build account lacks required permissions.
- Neon org `org-calm-sea-48867466`, project `restless-resonance-93178261`, production branch `br-twilight-feather-b40ynqpe`.
- Runtime secrets: `DATABASE_URL=vote-anyway-database-url:1`, `VOTING_KEYS=vote-anyway-voting-keys:1`.

Never print connection strings or private keys. `.env*`, `.neon`, generated keys and archived runtime data must stay out of Git and source uploads. Do not rotate or regenerate voting keys for an existing election: startup checks the database’s recorded public keys. A new key/election strategy requires an explicit design.

## Database changes

Migrations 001–004 establish legacy practice receipts, encrypted election/ballot records, topic metadata, authentication nonces and agent grants. The migration runner maintains `schema_migrations` and holds an advisory transaction lock; migrations run separately from instance startup.

Test changes on an isolated Neon branch first. The development branch `dev-ballot-migration-20261020` (`br-fragrant-morning-b43xf5jq`) expires October 27, 2026. Its ignored credentials and keys are in `.env.ballot-test`; renew or replace it when needed. Production `.env.local` has not been repointed.

With an explicitly verified test environment:

```sh
node --env-file=.env.ballot-test scripts/migrate.js
node --env-file=.env.ballot-test --test test/*.test.js
```

Migration connections prefer `DATABASE_URL_UNPOOLED`; application requests use pooled connections. Review the target and backup/rollback plan before applying new migrations to production. Do not use `npm run test:db` casually: its default env-file loading may target production on this workstation.

## Build and candidate deployment

Inspect `git status`, the active gcloud account and current traffic. Pass the project explicitly. Build and run checks appropriate to the change; source deployment builds again in Cloud Build.

```sh
npm run build
npm test
npm run test:original
gcloud run services describe vote-anyway --project=anselm-gcloud --region=us-west1 --format='json(status.traffic,status.latestReadyRevisionName)'
gcloud run deploy vote-anyway --source . --project=anselm-gcloud --region=us-west1 --service-account=vote-anyway-runtime@anselm-gcloud.iam.gserviceaccount.com --build-service-account=projects/anselm-gcloud/serviceAccounts/vote-anyway-build@anselm-gcloud.iam.gserviceaccount.com --allow-unauthenticated --min-instances=0 --max-instances=2 --memory=512Mi --cpu=1 --concurrency=40 --set-secrets=DATABASE_URL=vote-anyway-database-url:1,VOTING_KEYS=vote-anyway-voting-keys:1 --no-traffic --tag=combined --quiet
```

`--allow-unauthenticated` permits public HTTP access to the site. Application authentication still gates topic creation and voting. Production startup requires the database and voting-key bundle. There is no supported production “omit the secrets” shortcut.

The Dockerfile builds on Node 22, installs only runtime dependencies in the final image, and runs as an unprivileged user. It copies `server/`, `scripts/`, `migrations/` and the built `dist/`.

## Verify, promote and retain rollback

Check the candidate URL before promotion. Inspect `/api/health` and `/api/config`; verify public reading pages, routes and navigation; check that unsigned topic/vote writes return 401. Retain a public board/key/checkpoint from before deployment and verify continuity afterward with `scripts/verify-log.mjs`. Avoid creating unnecessary production topics or ballots. Validate changed flows on the isolated database; the owner completes passkey prompts.

Promote only the new revision name returned by the successful deployment, replacing `VERIFIED_REVISION` below. Record the previously serving revision before promotion.

```sh
gcloud run services update-traffic vote-anyway --project=anselm-gcloud --region=us-west1 --to-revisions=VERIFIED_REVISION=100 --quiet
```

Check the canonical public URL after promotion. To roll back, use the same traffic command with the previously recorded compatible revision. Do not choose a revision solely because its number looks recent. Check database compatibility before rollback if schemas changed.

Authentication defaults allow the canonical service origin, alternate service origin and `combined` tag. `AUTH_ORIGINS` can explicitly configure this allowlist. Development defaults are `http://localhost:8083` and `http://localhost:8084`. Attest status verification uses HTTPS; the app has no provider client secret. The pinned provider code and MIT license are under `scripts/attest/`.

Budget alerts, monitoring, retention/restore drills and a custom domain remain backlog items. The two-instance ceiling and zero minimum instances do not cap every possible cloud charge.
