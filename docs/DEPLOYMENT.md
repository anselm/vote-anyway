# Deploy to Cloud Run with Neon PostgreSQL

## Current deployment

- Project: `anselm-gcloud`
- Region: `us-west1`
- Service: `vote-anyway`
- URL: https://vote-anyway-728854538261.us-west1.run.app
- Runtime account: `vote-anyway-runtime@anselm-gcloud.iam.gserviceaccount.com` (no project roles)
- Build account: `vote-anyway-build@anselm-gcloud.iam.gserviceaccount.com` (`roles/run.builder`, explicitly approved)
- Neon project: `restless-resonance-93178261`, production branch (`br-twilight-feather-b40ynqpe`), organization `org-calm-sea-48867466`.
- Database secret: `vote-anyway-database-url:1`, accessible only to the dedicated runtime account via a secret-scoped grant.
- Application requests use the pooled connection; migrations use the direct connection.

When redeploying, include `--build-service-account=projects/anselm-gcloud/serviceAccounts/vote-anyway-build@anselm-gcloud.iam.gserviceaccount.com`. The project default build account lacks the required source-read permissions.

## Prerequisites

Sign in with `gcloud auth login`. Select an intended Google Cloud project with billing. Confirm the account/project before deploying; the workstation default is not automatically the correct project. Create a Neon project and obtain its pooled PostgreSQL connection string with TLS enabled.

Never commit `.env` or paste database credentials into GitHub. Store `DATABASE_URL` in Google Secret Manager as `vote-anyway-database-url` and grant the runtime service account access to that secret only. Configure a dedicated runtime service account; do not reuse broad owner credentials.

## Database

Neon CLI setup uses the existing project, not a new one:

```sh
npx --yes neon@latest init -y --org-id org-calm-sea-48867466 --project-id restless-resonance-93178261 --branch production --services postgres
npx --yes neon@latest deploy
```

Complete the browser login if requested. Deployment pulls `DATABASE_URL` and `DATABASE_URL_UNPOOLED` into ignored `.env.local`. Then:

```sh
npm ci
npm run db:migrate
npm run test:db
```

The migration is idempotent and creates only `practice_receipts`. Back up database data before later schema changes. The initial migration is run separately rather than by every Cloud Run instance.

## Container deployment

The Dockerfile builds the frontend, installs only production dependencies in the final image, and runs as the unprivileged `node` user. Cloud Run builds directly from source with Cloud Build and Artifact Registry.

Replace the uppercase placeholders after confirming the target project, runtime identity, and region:

```sh
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com --project=PROJECT_ID
gcloud run deploy vote-anyway \
  --source . \
  --project PROJECT_ID \
  --region us-west1 \
  --service-account RUNTIME_SERVICE_ACCOUNT \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 2 \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 40 \
  --set-secrets DATABASE_URL=vote-anyway-database-url:latest
```

To deploy the browser-only site first, omit `--set-secrets`. The UI clearly identifies that mode; receipt writes return 503 instead of inventing persistence. The public site is explicitly requested by Anselm; `--allow-unauthenticated` enables access to this practice app, not access to Google Cloud administration or the database.

## Verification

Open the returned HTTPS URL. Try a ballot, download its receipt, and verify the code. With Neon configured, check that the code can be found from another browser and after redeployment. Check `/api/health` reports `postgres`. Inspect logs without printing credentials. The receipt database is not an election tally.

Set budgets/alerts and monitor usage as the experiment grows. Zero minimum instances and a two-instance ceiling limit compute scaling but do not cap all cloud charges.

References: [Cloud Run source deployment](https://docs.cloud.google.com/run/docs/deploying-source-code), [Neon connections](https://neon.com/docs/connect/connect-from-any-app).

## Combined encrypted-ballot release

Run migrations 001 and 002 before deploying. The migration ledger and advisory transaction lock make repeat runs safe. Keep the previous revision available for rollback; the schema changes are additive and the original receipt table remains intact.

Cloud Run requires `DATABASE_URL=vote-anyway-database-url:1` and `VOTING_KEYS=vote-anyway-voting-keys:1` through Secret Manager. The runtime service account has secret-scoped accessor access. Never regenerate the voting keys on restart or replace them for the same election ID. A mismatched bundle causes startup failure. New election keys need a new, explicitly designed election identity and migration.

The development branch `dev-ballot-migration-20261020` expires October 27. Its credentials and keys are in ignored `.env.ballot-test`; production environment files were not repointed.
