# October 20, 2026 — Making the experiment inspectable

The first experiment asks a small fictional question: what should a neighborhood study first? Street trees, safer crossings, or rain gardens. Keeping the question modest gives us room to examine the machinery of participation.

A participant chooses, reviews, and submits. The browser encrypts the ballot; the server validates it, stores the encrypted record, and returns a receipt. Each record is signed and linked to the one before it. Anyone can download the log and check the signatures and receipt inclusion with a separate program.

The interface uses warm ivory, deep navy, muted brick red, serif headings and fine rules. It borrows the quiet clarity of civic documents without presenting itself as an official institution.

Neon PostgreSQL keeps the public record consistent across Cloud Run instances. Encryption and signing keys persist across deployments. Tests exercise simultaneous submissions, rejected duplicates, restart persistence, altered records, and conflicting histories. A saved checkpoint lets a reader compare the record they saw earlier with the one published now.

These are useful pieces of evidence, with clear limits. The server can decrypt ballots and computes the totals. Signing a record does not establish eligibility, prove that the browser honored a person's intent, or independently prove the tally. The experiment makes those next questions concrete.

The essay and its three companion appendices develop the argument alongside the software. The longer working outline holds eleven research appendix sections, alternative passages, references and questions for further work.
