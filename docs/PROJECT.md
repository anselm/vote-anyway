# Project brief

Vote Anyway is an argument for digital voting, paired with an unofficial working experiment. Read [HANDOFF.md](HANDOFF.md) for the current continuation guide and [the development log](../devlog/) for the evolving argument and decisions.

## Agreed direction

- Make democratic participation more accessible and frequent, with privacy, faithful counting and independently checkable evidence as goals.
- Connect theory to experiments and evidence. Keep the core essay persuasive; put technical detail, objections, citations and prior work in appendices.
- Preserve the original writing and prototype as tracked source. Continue the deliberate combination documented in [the implementation audit](IMPLEMENTATION-AUDIT.md).
- Use Svelte 5, Fastify, Node 22, Neon PostgreSQL and Google Cloud Run. Keep the working attest.monster integration.
- Keep authentication, eligibility, encrypted ballots and public audit evidence conceptually separate.
- Maintain a restrained, welcoming civic design, system light/dark support and ordinary shareable URLs.

## Current implementation

Authenticated people can create and share immutable single-choice topics, vote, and authorize scoped agents. Encrypted ballots are persisted transactionally with signed linked records, receipts and independently executable record checks. The public site includes the essay, all preserved appendices, research index, devlog and current feature plan.

Repeat submissions remain allowed. The operator can decrypt ballots and computes totals. Eligibility, ballot-intent proofs and independent tally proofs are not implemented. Anselm confirmed real public passkey sign-in works.

## Next product work

Design an informal single-winner ranked-choice runoff: explicit election rules, a ranked ballot and visible counting rounds. Determine eligibility, replacement/repeat-vote policy, closing time, tie handling and incomplete rankings before implementation. See [the voting-method note](../content/voting-methods.md). Approval, separate-round runoffs, multi-seat methods, provisional participation, trust graphs and delegation remain further research directions.

## Continuity

The original essay, three companion appendices, first-draft devlog, full v0.4 outline with eleven appendices, and original code archive are preserved in Git. Use the source map in the handoff; do not rebuild from fragments of a chat. Historical entries remain historical. Current infrastructure and deployment procedure are in [DEPLOYMENT.md](DEPLOYMENT.md).
