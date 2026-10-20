# Project brief

Recovered from Anselm’s “Digital voting article framing” conversation on October 20, 2026. The conversation began as an essay discussion and developed into a software project. Some older messages and downloadable artifacts were unavailable during migration. Do not treat this summary as a replacement for unrecovered source text.

## Agreed direction

- Vote Anyway is a clearly unofficial experimental parallel voting platform, with a companion essay, “Voting, Unbundled.”
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

1. Deploy the first container to Cloud Run and provision Neon; verify persistence across instances/redeployments.
2. Recover the original outline and remaining product discussion without rewriting or inventing the missing material.
3. Inspect attest.monster; define identity and election-scoped eligibility interfaces.
4. Select an established cryptographic protocol and publish a threat model and independently executable verifier before claiming verifiable voting.
5. Introduce election creation, participation policy, provisional ballots, and adjudication with appropriate authorization.
6. Explore ranked/approval methods, trust graphs, delegation, and incentives as separately documented experiments.

## Infrastructure awaiting confirmation

The local gcloud configuration names `poetic-producer-435915-c2` and account `anselm@costumenetwork.com`; those are existing workstation settings, not confirmed Vote Anyway deployment choices. Authentication was expired at migration. No production URL or domain is established.
