# Appendix A — Security and the actual claims

This appendix is the working technical support for [Vote Anyway](/essay.html). It distinguishes a digitally processed ballot, a cryptographically verifiable election, and an unsupervised internet vote cast on an ordinary phone.

## Three separate properties

1. **Cast as intended:** A voter has a meaningful way to check that their actual choice was encoded correctly.
2. **Recorded as cast:** A voter can check that the ballot they cast was accepted and remains on the election record.
3. **Tallied as recorded:** An observer can independently check that recorded ballots produce the claimed aggregate tally.

A simple tracker generally establishes neither (1) nor (3) by itself. It can assist with (2). A server that merely signs or hashes its database remains trusted for many critical operations. [ElectionGuard's published specification](https://electionguard.vote/spec/) describes challenge ballots, election records and verification proofs.

## Why money isn't a direct analogy

Payments, HTTPS, authenticated transactions, resilient databases and distributed ledgers provide genuine evidence that complex transactions can be implemented reliably. But financial systems commonly retain identity-linked records and can dispute, reverse or compensate transactions. Secret-ballot elections also require privacy, eligibility, correct intent on an untrusted endpoint, and resistance to coercion and vote buying. A voter must be able to confirm inclusion without being able to prove their private choice to a buyer. A false comparison is neither necessary nor useful.

## Physical systems have attack surfaces too

Paper offers human-readable inspection and software-independent recounts. It also requires physical access and custody arrangements that can fail. Long polling-place lines are access failures; they are not inherent to paper because mail voting, early voting, and better staffing can reduce them. An engineering comparison must define threat models for both complete systems, including denial of service and recovery of lost votes.

## Open or conditional problems for remote voting

- **Endpoint trust:** A compromised phone can misrepresent what is encrypted. Challenge workflows, external verification and trusted channels add checks with their own assumptions.
- **Coercion and vote buying:** At-home voting lacks a supervised private booth. Fake credentials, decoy presentations and revoting exist in research, but a fake page alone is not sufficient when someone can supervise or prevent later access.
- **Eligibility and uniqueness:** Cryptography alone does not establish that one authorized human gets one vote.
- **Audit and observation:** Publicly verifying mathematical proofs is not the same as independently verifying all enrollment and administrative processes.
- **Availability:** Device loss, network interruptions, infrastructure outages, malware and DoS require tested remedies.
- **Ballot secrecy:** An encrypted ballot may still be correlated using submission order, IP logs, authentication records, or key misuse.

## Existing implementations and critiques

- [ElectionGuard specifications](https://electionguard.vote/spec/), [verification overview](https://electionguard.vote/overview/Glossary/) and [published verification record workflow](https://electionguard.vote/develop/Applications/).
- [Helios](https://www.heliosvoting.org/faq), a project for auditable online voting with explicit threat assumptions.
- [Estonia election authority overview](https://www.valimised.ee/en/internet-voting-estonia) and [2025 election results](https://kov2025.valimised.ee/en/detailed-voting-result), which recorded **45.8%** of valid local-election votes online. Smartphone voting and smartphone checking must not be conflated.
- [Swiss Federal Chancellery on e-voting](https://www.bk.admin.ch/en/e-voting), including limited trials.
- [National Academies, *Securing the Vote* (2018)](https://www.nationalacademies.org/read/25120/chapter/7), a central argument for auditable paper and against currently available internet voting.
- [*Going from Bad to Worse: From Internet Voting to Blockchain Voting*](https://academic.oup.com/cybersecurity/article/7/1/tyaa025/6137886), a serious research critique.

## What this project's initial prototype really checks

The prototype encrypts submissions on the client and publicly signs a ciphertext log. It lets a receipt holder independently check ciphertext inclusion and log signature/chain consistency. It **does not** offer independent tally proofs or establish intent, uniqueness, coercion resistance or protection against an operator presenting conflicting signed records. These are explicit open milestones, not hidden implementation details. See [Prototype appendix](/appendix-prototype.html).
