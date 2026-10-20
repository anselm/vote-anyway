# October 20, 2026 — Local development handoff

- Anselm asked to continue the existing Vote Anyway conversation locally, push the GitHub repository, and stand up a site using Cloud Run and a database.
- Found the existing repository `anselm/vote-anyway`, created today, containing only README.md. Cloned it into the canonical 2026 project location.
- Recovered the stack and project brief from the original conversation, including Neon, attest.monster, essay/appendix structure, participation policies, provisional ballots, trust graphs, and delegation.
- Anselm confirmed no cloud resources had been created. Existing Google Cloud authentication required reauthentication. No Neon database connection was available.
- Built the first practice site and API, optional PostgreSQL receipt storage, schema migration, deployment container, and project documentation.
- The practice feature deliberately makes no claim of encrypted ballot casting, eligibility enforcement, or independently verifiable tallies. The selections stay in the browser; only randomized fingerprints may be persisted.
- The original essay download and some older conversation details remain unrecovered. Keep these gaps explicit.
