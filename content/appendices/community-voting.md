# Appendix E — Community voting, identity and usable tools

The [essay](/essay.html) asks what becomes possible when participation is easier. A discussion in the OpenVTC community sharpened a practical answer: build useful tools for groups that already need to make decisions together, while being explicit about what those decisions authorize.

This note draws on a feature description supplied by Glenn Gore, shared with this project by Anselm. The election capabilities below are **reported by their developer, not independently tested here**. They are design references, not claims about Vote Anyway's current implementation. The private discussion itself is not reproduced.

## Begin with the purpose

A survey asks what respondents think. A poll measures the preferences of a defined or self-selected set of participants. An election selects an outcome under agreed rules. Deliberation helps people understand a question and one another. A service can support several of these, but its interface should say which one is happening.

Before the first ballot, people should be able to see who is eligible, what is being decided, how answers become a result, and what authority that result has. An open-source project's procedural vote, a school association's budget choice and a public election have different consequences and adversaries. Smaller scope creates opportunities to learn; it does not eliminate the need for privacy or fair rules.

## Capabilities reported by OpenVTC

The supplied description identifies a useful set of organizer controls:

- **Eligibility and tickets:** eligible participants receive a ticket based on PCS zero-knowledge work; group membership determines participation. Cross-community and wider trust-network voting were described as further work.
- **Question formats:** choice, ranking, score and free-text questions. A question format is distinct from a counting rule: accepting a ranking does not specify an instant-runoff or proportional count.
- **Creation:** a wizard or an uploaded JSON manifest, including one prepared with AI. Organizers still need to review the wording, options and rules before publishing it.
- **Timing:** separate registration and voting periods, immediate opening, and early closure for uses such as live polling.
- **Result policy:** secrecy, who can see results, whether a participant can recast, and running totals.
- **Submission path:** a member uses an application such as Keyring or a browser extension. Their Verifiable Trust Agent (VTA) submits to a separate VTI election service, rather than sending the vote through the Verifiable Trust Community (VTC) service.

The public [OpenVTC zero-knowledge overview](https://openvtc.github.io/wiki/concepts/zero-knowledge-proofs) explains the Predicate Credential System in its identity-vetting context and distinguishes implemented work from proposed credential predicates. The [PCS implementation and its security notes](https://github.com/OpenVTC/predicate-credential-system) provide the underlying research artifact, explicitly labeled unaudited by its authors. These are useful sources to study and test; neither by itself establishes the security properties of the election flow described above.

## The privacy question is the whole journey

Separating credential issuance from ballot submission is a useful design direction. Claiming a ticket in advance can reduce an obvious timing connection between enrollment and voting. Routing the ballot away from the community service can reduce what that service directly sees.

Neither measure alone proves unlinkability. A review must ask which parties can collude, what each logs, whether network addresses or identifiers reconnect the steps, and whether a small group or a distinctive free-text answer reveals its author. A proof may hide its witness while the surrounding application discloses the person.

A membership credential also inherits the decisions of its issuer. It does not by itself prove that a person has only one identity across communities. Eligibility needs an intelligible admission rule, a way to challenge exclusion, and a recovery process that does not accidentally create a second vote.

## Controls are governance decisions

Recasting needs a published rule: does a later ballot replace an earlier one, how is that enforced without disclosing choices, and what happens at the deadline? A privacy mechanism must be evaluated together with that rule.

Running totals may suit an informal live poll. In a secret election, early results can influence later voters or reveal a choice when only one person has just voted. Early closure also gives an organizer power over the outcome. Those options should be explained and fixed in advance where fairness requires it, not left as inconspicuous switches.

Usability includes the unhappy paths. Can a participant recover after losing a device? Discover that a submission failed? Understand a receipt without confusing it with proof of a correct tally? Cast a private ballot using assistive technology? If installing a wallet or extension is required, that requirement is part of the participation cost.

## What this means for Vote Anyway

Vote Anyway currently authenticates through attest.monster, passkeys and signed site-scoped device delegations. Anselm's broader identity direction includes AT Protocol; this application does not independently verify AT Protocol membership or use it to establish voter eligibility. It does not use OpenVTC's identity infrastructure or PCS election tickets.

The working app offers immutable single-choice topics, encrypted submissions, receipts and signed public records. Repeat submissions are allowed; totals are computed by the operator. Membership elections, privacy-preserving eligibility proofs, registration windows, replacement ballots, closing controls, ranked counts and result-release policies remain design work.

The immediate lesson is to design the whole decision process before adding another ballot format. Make participation rules visible, separate sign-in from eligibility and ballot secrecy, and make the ordinary experience clear enough that real groups can use it. The [runoff design note](/voting-methods.html) remains the next proposed counting experiment; these capabilities help define the surrounding requirements.

[Read the essay](/essay.html) · [Security and actual claims](/appendix-security.html) · [Research & sources](/research.html)
