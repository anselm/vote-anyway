# 2026-10-20 — First draft and runnable experiment

## Thesis

A civic right has two engineering requirements: eligible people must be able to participate, and the votes they successfully cast must be recorded and counted faithfully. "Paper versus computers" is too narrow a frame. Ask what guarantees a complete system has, what fails, what can be independently checked, and what happens to democracy when participation becomes much less cumbersome.

## Editorial decisions

- Rename the essay and the project **Vote Anyway**.
- Keep the public essay short and human; use technical appendices for cryptographic designs, historical references, empirical questions, and objections.
- Separate Part I (technology) and Part II (implications).
- Keep broader systems problems such as externalities and digital twins as context only.
- Credit **Brad deGraf** for his involvement in **Smartocracy**, including coauthorship of the 2007 paper with Marko Rodriguez, Daniel Steinbock, Jennifer Watkins, Carlos Gershenson, Johan Bollen and Victor Grey.
- Preserve the author's concern about practical voter suppression and avoid asserting unsupported motives.

## Praxis: build to learn

Start a parallel-voting research site, explicitly **not an official election**. It should eventually mirror sourced ballot questions while preserving conspicuous notices and linking users to real voting information. Begin with an entirely fictional question to avoid confusion. Ship a phone-friendly ballot, a receipt, independently inspectable integrity evidence, and a development log.

## What we actually built in this iteration

- Published essay and appendices as static pages served from this project.
- Node 22 server, browser-side encryption, persisted encrypted ballot records.
- Signed hash-chain bulletin board and an independent log verifier.
- Honest research-stage limitations; particularly, the demo tally is computed by the server and is **not** E2E-verifiable.
- Tests for valid submission, rejected malformed selections, receipt inclusion, and tampering detection.

## Questions uncovered

1. What evidence would let the same phone detect a client that lies about the encrypted selection?
2. Can public witnesses prevent quiet rewrites of the entire election history?
3. How to verify tally correctness without revealing individual ballots or trusting one decryption server?
4. What workable identity/uniqueness assumptions make a parallel trial useful without collecting invasive personal data?
5. Could subject-specific delegation be compatible with receipt-freeness, particularly when the delegation graph itself is identifiable?
6. How to test coercion resistance honestly without creating a misleading decoy UI?

## Next milestone

Specify and integrate a reviewed E2E voting protocol. Verify cast-as-intended, recorded-as-cast, and tallied-as-recorded *separately*. Do not call this demo a secure real-world election until independent scrutiny justifies that language.
