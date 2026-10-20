# Project brief

Recovered from Anselm’s “Digital voting article framing” conversation on October 20, 2026. The conversation began as an essay discussion and developed into a software project. Some older messages and downloadable artifacts were unavailable during migration. Do not treat this summary as a replacement for unrecovered source text.

## Agreed direction

- Vote Anyway is a clearly unofficial experimental parallel voting platform, with a companion essay, “Vote Anyway” (earlier outline title: “Voting, Unbundled”).
- Node 22, Fastify, Svelte 5, Tailwind, PostgreSQL on Neon, hosting on Google Cloud Run.
- attest.monster is the intended identity integration, pending inspection of its actual protocol and configuration.
- Preserve the essay, linked technical appendices, research, and chronological `/devlog/` in GitHub.
- Start with a mobile demonstration, then support election creation and configurable participation policies.
- Keep authentication, eligibility, encrypted ballots, and public audit evidence separate.
- Explore provisional ballots and eligibility adjudication, Advogato-inspired social trust graphs, richer voting methods, and later liquid-democracy delegation.

## Editorial direction

Keep the core essay persuasive and accessible, with technical material, research citations, and third-party work in appendices. The wider context of collective governance motivates the article without consuming it. Anselm’s praxis connects theory and action: build a working experiment, learn from it, and revise the argument.

## Implementation status

The GitHub repository initially contained only a 13-byte README. Anselm confirmed that no cloud resources or Neon database had been created. The first local implementation provides a practice experience and deployment foundation, not the completed cryptographic voting system.

## Next milestones

1. Preserve the deployed Cloud Run/Neon foundation. Live receipt write/read and pool-restart persistence are verified; cross-instance/redeployment checks remain.
2. Recover the original outline and remaining product discussion without rewriting or inventing the missing material.
3. Inspect attest.monster; define identity and election-scoped eligibility interfaces.
4. Select an established cryptographic protocol and publish a threat model and independently executable verifier before claiming verifiable voting.
5. Introduce election creation, participation policy, provisional ballots, and adjudication with appropriate authorization.
6. Explore ranked/approval methods, trust graphs, delegation, and incentives as separately documented experiments.

## Current infrastructure

Anselm selected `anselm-gcloud`. The site is live at https://vote-anyway-728854538261.us-west1.run.app in `us-west1`, with Neon project `restless-resonance-93178261` on its production branch. See `docs/DEPLOYMENT.md` for identities and secret references. No custom domain is configured.

## Migration completeness

See [`../todo.md`](../todo.md) for the audited recovery checklist. The full essay and original first-draft devlog are recovered. The supplied original prototype source, three appendices, threat model, and editorial roadmap are restored. The v0.4 working sketch is recovered in the devlog, including its research appendices and citations. Original prototype code is preserved under `reference/original-prototype-20261020/`, excluding generated keys/data. The current practice interface is not a feature-complete port of the original encrypted-ballot demo.
