# October 20, 2026 — Essay recovery and deployment

Anselm selected `anselm-gcloud` as the hosting project. Existing billing is enabled. Created an unprivileged application runtime account and enabled Cloud Build. The first source deployment failed because the default compute service account could not read the source upload. After explicit user approval, created a dedicated `vote-anyway-build` account and granted Google's Cloud Run Builder role. Deployment uses this build account separately from the application runtime account.

Recovered the original 2,073-word essay, titled **Vote Anyway**, from the original chat's document preview. Preserved prose, section headings, emphasis, and link destinations. Download controls did not yield a local file, so this is a reconstruction from the rendered Markdown document, not a verified byte-identical download. Also recovered the original first-draft devlog. These describe the original encrypted-ballot prototype, not the later browser-only practice interface.

The complete handoff revealed an original prototype ZIP, `vote-anyway-project-20261020.zip`, with encrypted ballots, signed records, and an independent integrity verifier. This source archive and its appendices still need importing; do not treat the new practice interface as a feature-complete migration. The ZIP reportedly contains development private keys in `data/keys.json`; exclude generated data and private keys when importing.

The essay now builds directly from Markdown to `/essay.html`. Original appendix links lead to explicit recovery-status pages until their source is recovered. The essay text remains unchanged. A brief publication note distinguishes the prototype described in the draft from the current practice site.

Neon remains unprovisioned. Initial Cloud Run deployment uses browser-only practice with explicit UI status. No claims of durable receipt storage or real election verification should be made until those systems are connected and tested.
