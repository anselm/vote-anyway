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

## Paper evidence and software independence

Paper is valuable when it is voter-verified, retained with reliable custody, and actually used to check the reported outcome. A risk-limiting audit sets a bound on the chance of accepting a wrong outcome and can escalate to a full hand count. It does not resolve every enrollment or access problem. Rivest's [2025 presentation](https://people.csail.mit.edu/rivest/pubs/Riv25a.pdf), especially slides 15–16, 22, 28 and 35–41, distinguishes software independence, paper audits, cryptographic verification, hybrids and remote internet voting. It favors paper-plus-cryptography possibilities while rejecting present-day internet voting for public elections. Those are compatible positions.

The essay's [arguments for paper](/essay.html#arguments-for-paper-voting) and [arguments against paper](/essay.html#arguments-against-paper-voting) compare complete participation and verification systems. Neither long lines nor a lack of ranked ballots is an intrinsic property of paper.

## Proofs change what can be checked

Zero-knowledge proofs have a long history: Goldwasser, Micali and Rackoff's [1985 paper](https://doi.org/10.1145/22145.22178) established the foundational idea. A verifier can learn that a specified statement is true without learning the secret evidence used to establish it. In an election, such proofs can help establish ballot validity or correct cryptographic operations without exposing individual choices; the exact statement and assumptions matter.

Ben Adida's [Helios paper (2008)](https://www.usenix.org/conference/17th-usenix-security-symposium/helios-web-based-open-audit-voting) is a reference for web-based open-audit voting. The project's own [FAQ](https://www.heliosvoting.org/faq) distinguishes this work from ordinary electronic voting and explicitly advises against its use for high-stakes public-office internet elections because of endpoint and coercion risks.

Development continues. [ElectionGuard's specification](https://electionguard.vote/spec/) describes proofs, challenge ballots, verifiable decryption and election records; its release notes document reductions in proof size and computation, and support for additional ballot formats. This is evidence of an evolving engineering field, not proof that every proposed remote deployment is safe.

Credential proofs, ballot-validity proofs and tally proofs answer different questions. None alone establishes faithful enrollment, an uncompromised user interface, freedom from pressure, or service availability. A good protocol also needs independent verification, operational review and a usable way to detect and resolve failures. [Community voting and identity](/appendix-community-voting.html) applies those questions to the supplied OpenVTC feature description.
