# Voting, Unbundled

*Secure internet voting, and the participatory possibilities it opens*

**Working artifact, v0.4.** This is a *sketch of the article*, not an article draft. The core essay should develop a readable argument, not become a technical survey. Appendices carry protocols, research, citations, implementation plans, objections, and detailed comparative material. The questions are whether remote phone voting can satisfy demanding safeguards, and what becomes possible if it can—not an assertion that every security problem is already solved.

## Editorial contract

- **Main article:** target **1,600–2,100 words**, roughly 6–8 short sections. First-person, conversational, persuasive by reasoning and examples, with minimal jargon; a few well-chosen inline links or superscript appendix pointers. Keep the two halves explicit: **technology** and **implications**.
- **Appendices:** unlimited reasonable length. Put technical explanations, adversarial cases, citations, previous third-party work, detailed design alternatives, empirical qualifications, prototype specifications, and voting-method comparisons here. Use links back from each appendix to the main claim it supports.
- **Epistemic labels:** mark claims as **deployed**, **demonstrated in research**, **proposed**, or **open**. A cryptographic proof of a tally is not proof of end-to-end election security.
- **Scope:** broader political economy, environmental externalities, digital twins, wealth concentration, social trust, and governance are *motivation*, not the topic. Do not drift into a general proposal to redesign all of democracy.
- **Praxis:** the essay has a companion idea: **Vote Anyway**, a voluntary, conspicuously unofficial phone-voting experiment mirroring some official ballot questions without affecting official votes. Make the build-and-learn loop visible; put the spec in Appendix H.
- **Fair engagement:** present the strongest objections accurately rather than caricaturing opponents of remote voting. Distinguish feasibility, safety, and institutional desirability; treat incentives and voting methods as open design choices rather than endorsed policies.
- **Moral stake, not conspiracy:** the author is angry about barriers that can prevent eligible people from voting or having their votes counted. Use that frustration as a precise, first-person argument about access, not evidence of a coordinated campaign by paper-ballot advocates. Avoid the phrase “psyop” as an assertion; critique institutional complacency and untested assumptions rather than impute motives.
- **Separate paper from polling booths:** long lines demonstrate the cost and fragility of *in-person access*, not an intrinsic failure of paper ballots. No-excuse absentee/mail voting, early voting, sufficient sites and better administration can improve access while retaining an auditable paper record. Internet voting offers an additional architecture to investigate, not the only solution.

## The through-line (one paragraph)

Voting is still organized around infrequent, administratively expensive events, and access barriers can deter eligible voters before their ballots ever reach the count. A legitimate election must both **accept eligible participation** and **record/count votes faithfully**. Internet voting is often rejected because of plausible security threats, but modern internet systems already execute extraordinarily consequential transactions with strong cryptographic and operational assurances. Rather than assuming paper is inherently trustworthy or that digital security is magically solved, we can state the desired voting properties and examine how to realize and test them. Once voting is genuinely easy to access, verify, and audit, more questions become imaginable: more frequent and smaller decisions, delegated expertise, incentives to participate, and richer ballot methods. This need not solve democracy to enlarge its repertoire.


---

# Main article — compact narrative outline

## Opening — Democracy's bandwidth problem (≈180 words)

**Hook:** A line of people waiting to vote in North Dallas in October 2026 is both a scene of civic commitment and a question about design: why should eligible participation depend on someone's ability to wait in a line? We conduct global commerce from phones, yet political authority is still largely allocated through infrequent, expensive elections. Why is civic participation so cumbersome?

- The author's emotional motivation belongs here, briefly and in first person: anger at preventable barriers to voting, regardless of who encounters them or which candidates they support. **Don't infer intent from a photograph of a queue.**
- State two separate success conditions: **every eligible voter should have a realistic opportunity to cast a vote**, and **every accepted vote should be recorded and counted correctly**.
- Offer a fair comparison: early voting, voting by mail and better polling-place logistics improve accessibility without abandoning paper; properly designed internet voting might expand convenience further, subject to rigorous security testing.
- **Context:** [Appendix K: Access, suppression, and the right to cast a vote](#appendix-k--access-suppression-and-the-right-to-cast-a-vote).
- Acknowledge the larger landscape: distorted market externalities, resource stewardship, concentration of power, and the difficulty of governing complex systems. Better voting is one component of a much larger feedback loop.
- The key provocation: **what if the marginal cost of holding a vote fell dramatically?**
- Set the split: first *can it work?* then *what might it change?*

**Avoid:** promising that technology alone fixes collective decision-making.

# Part I — Can we rebuild the ballot digitally?

## 1. We trust the internet with almost everything else (≈230 words)

- Banking, online commerce, cryptographic transactions, and large-scale digital infrastructure demonstrate that robust, auditable systems can be engineered.
- So *why is voting often spoken of as a categorical exception?* Put that challenge plainly and seriously.
- Say which assurances transport security, consensus, and digital signatures actually provide; do **not** conflate reliable ledger inclusion with a secret, uncoerced vote on a trustworthy device.
- Bridge: an election is not just a payment; that difference calls for engineering requirements, not rhetorical dismissal.

**Deep dive:** [Appendix A: Transaction reliability and voting guarantees](#appendix-a--transaction-reliability-versus-election-security).

## 2. Paper is a technology, not a guarantee (≈260 words)

- Credit the fundamental strength of paper: a human-readable, physically inspectable record can be recounted independently of the counting software.
- Examine the whole election chain of custody: ballot access, handling, transport, physical disruption, losses, and counting. Physical systems also have attack and failure modes.
- Compare *systems*, not idealized paper with imperfect software (or vice versa).
- Define the desired outcome in plain English: only eligible people vote; everyone's vote is private; votes are correctly recorded and counted; failures can be detected and addressed; participation remains possible during disruptions.
- Strong claim to articulate: *“Election integrity cannot mean counting every accepted ballot while remaining indifferent to people prevented from casting one.”* This is an editorial principle, not a claim that every long line is deliberate suppression.
- Avoid a false binary: paper-ballot advocacy often seeks **software independence**, not long queues. Critique access failures on their own terms, and then ask whether remote digital voting can provide secure additional access.

**Deep dives:** [Appendix B: Security properties](#appendix-b--the-properties-a-voting-system-must-establish); [Appendix C: Adversarial questions](#appendix-c--hard-problems-and-open-questions); [Appendix K: Voting access](#appendix-k--access-suppression-and-the-right-to-cast-a-vote).

## 3. A vote you can independently check (≈290 words)

- Tell a single intuitive story: vote on phone → receive a non-revealing tracker → confirm encrypted ballot inclusion → independent auditors validate published tally proofs.
- Introduce **end-to-end verifiability** without turning the narrative into a cryptography tutorial.
- An inclusion tracker cannot by itself prove that a compromised phone submitted the selection the voter intended. Nor should the receipt allow vote-buying proof. These are crucial additional design challenges.
- Address coercion in two sentences in the essay: revoting and decoy/fake credentials are being explored, but a decoy page alone is not a general solution.
- **Estonia:** evidence that binding internet voting can be operated, with details, limits, and the current computer-versus-phone distinction deferred to an appendix.

**Deep dives:** [Appendix D: Protocol walkthrough](#appendix-d--an-illustrative-verifiable-voting-protocol); [Appendix E: Estonia and existing systems](#appendix-e--field-experience-and-third-party-work); [Appendix C](#appendix-c--hard-problems-and-open-questions).

## Interlude — Vote Anyway: build the argument, don't just assert it (≈190 words)

- First-person programming praxis: theory → implementation → failure discovery → revised theory.
- Describe an **experimental**, opt-in parallel site that mirrors selected real ballot questions, accepts separate unofficial votes, and publishes verifiable evidence. No effect on official results.
- The value is neither a competing election count nor a prediction of the official result; it is an inspectable test of a protocol and interface.
- Invite concrete questions: Did my encrypted ballot appear? Can independent software verify the tally? What if the client lies? What happens on revoting? Could users actually understand the verification?
- Establish boundaries in one crisp sentence: experimental participants cannot by themselves prove election-scale eligibility, representativeness, coercion resistance, or full threat resilience.

**Full specification:** [Appendix H: Vote Anyway](#appendix-h--vote-anyway-experiment-brief).

# Part II — What changes if voting becomes cheap?

## 4. Democracy at a higher frequency (≈240 words)

- Convenience alone changes who can participate and how often. Lower administrative cost makes narrower, localized, time-bounded, or reversible decisions feasible to consider.
- Separate *lower cost to participate* from *lower policy stakes*; lowering stakes requires institutional choices such as bounded budgets and trial periods.
- Offer one concrete example: community choice among neighborhood infrastructure or restoration projects.
- Don't imply that asking people to vote constantly is desirable. The information and attention required to decide are real costs.

**Deep dive:** [Appendix I: Institutional possibilities and risks](#appendix-i--participation-granularity-and-governance-risks).

## 5. Delegation, incentives, and richer ballots (≈310 words)

- **Smartocracy / liquid democracy:** on energy policy I might delegate to someone I trust; on local transportation I might vote directly; delegations are scoped and revocable. Explain this without entangling the main essay in network theory.
- **Participation incentives:** friction is not the only barrier. Consider compulsory participation, rewards, participation credits, and reserve/slashing proposals. Keep incentives for the *act of lawful participation*, not for particular choices; allow abstention and consider fairness.
- **Voting methods:** a phone can present runoffs, ranked-choice, approval, score, or participatory-budget formats with less manual counting burden, but the aggregation method is a separate normative choice and paper can support these methods too.
- Each innovation can be studied independently. Together, they change what voting feels like and what kinds of decisions it can support.

**Deep dives:** [Appendix F: Delegation and trust graphs](#appendix-f--delegation-and-smartocracy); [Appendix G: Incentives and voting methods](#appendix-g--participation-incentives-and-ballot-methods).

## Closing — An interface to collective decisions (≈180 words)

- Reconnect briefly to the larger civic loop: **observe → model → deliberate → decide → implement → measure → revise**.
- Digital twins could help people understand consequences; deliberation platforms could help discover agreement; neither substitutes for legitimate authorization.
- Distinguish two questions in the ending: **Can the internet deliver a trustworthy vote?** and **If it can, what kinds of participation do we actually want?**
- Close on the praxis promise: build something small, prove what can be proved, expose limitations, and let practical evidence refine the argument.
- Return to the two-sided definition of election integrity: protect ballots **and protect the practical opportunity to cast them**. A security requirement is not a reason to stop improving access; an access requirement is not a reason to disregard security.

**Context and related tools:** [Appendix I](#appendix-i--participation-granularity-and-governance-risks); [Appendix J: Research](#appendix-j--citations-projects-and-reading).


---

# Appendices — optional depth

## Appendix A — Transaction reliability versus election security

This appendix holds the engineering comparison that would overwhelm the opening narrative.

| Dimension | Typical mature digital transaction | Remote secret-ballot election |
| --- | --- | --- |
| Identity | Authenticate account or payment authority | Establish personhood/eligibility without linking identity to ballot choice |
| Integrity | Transaction correctness; tamper detection | Cast-as-intended, recorded-as-cast, tallied-as-recorded |
| Observability | Operator and/or customer can inspect transaction | Third parties must audit a tally without learning private choices |
| Finality | Settlement/reconciliation may be supported | Finality plus dispute, challenge, and recount rules |
| Recovery | Compensation or reversal sometimes possible | Recovery cannot permit undetectable replacement/double counting |
| Coercion | Usually outside the core transaction guarantee | Receipt-freeness and resistance to some coercion scenarios |
| Device | Client compromise remains relevant | Client compromise may silently change an intended ballot |
| Availability | Distributed failover and incident response | Continued voter access; credible procedures for outages during polling |

**Analogies to examine:** authenticating google.com (DNS/TLS and browser trust); payments and reconciliation (authorized transfers versus scams or bad intent); Bitcoin settlement (distributed ledger verification versus secret-ballot requirements). Avoid unsupported claims about a universal “99.9999%” success rate—define measurable failure classes and cite real rates if used.

**Research starting point:** [NIST, Security Considerations for Remote Electronic UOCAVA Voting](https://www.nist.gov/publications/security-considerations-remote-electronic-uocava-voting).

## Appendix B — The properties a voting system must establish

| Property | Requirement / question |
| --- | --- |
| Eligibility | Only the authorized electorate participates |
| Uniqueness | Only the allotted voting weight is counted per eligible voter |
| Privacy | Ballot contents remain confidential from operators and outsiders |
| Cast-as-intended | Voters have a meaningful way to detect inaccurate ballot encoding |
| Recorded-as-cast | Voters can confirm their submitted ballots are on the accepted record |
| Tallied-as-recorded | Outsiders can verify consistency of tally with accepted ballots |
| Receipt-freeness | Voters cannot reliably prove their selections to a buyer/coercer |
| Coercion resistance | Specify coercion adversaries and available defenses; no universal promise |
| Availability | Resilience to outages, censorship, access barriers, and DoS attacks |
| Software independence | Incorrect software cannot cause an undetectable change to the official outcome |
| Recoverability | Legitimate correction without compromising privacy, eligibility, or integrity |
| Accessibility | Comprehensible, equitable participation and verification |
| Transparency | Published specifications, audit evidence, and trustworthy procedures |

**Key unresolved question:** Which guarantees can be secured cryptographically, and which depend on hardware, physical channels, institutional procedures, or law?

## Appendix C — Hard problems and open questions

**Coercion.** At-home voting lacks the privacy of a booth. An apparently convincing fake page is not sufficient: adversaries can supervise sessions, demand credentials, or block later revoting. Research on decoy credentials, deniable revoting, and coercion-resistant designs is promising but conditional. Ask what the voter can do if the adversary never allows private access.

**Compromised phones.** Perfect cryptographic counting cannot guarantee the client encrypted the option displayed on screen. Challenge ballots, independent verification devices, trusted displays, or separate authentication channels introduce their own tradeoffs. Explicitly differentiate using the same phone for all checks from a genuinely independent channel.

**Large-scale attacks.** At-home devices have heterogeneous security and networks; targeted or widespread malware, server compromise, supply-chain attacks, insider threats, and denial-of-service all deserve testing. Conventional elections have physical attacks and access constraints too, but their attacks often scale differently.

**Secrecy vs. proof.** The user's verification key should demonstrate inclusion in the record, not form a public, transferable certificate of how the user voted. Metadata/logging correlation can undermine nominal cryptographic anonymity.

**Governance and recovery.** Specify who can extend a vote during outages, adjudicate disputes, change cryptographic keys, authorize recounts, or challenge evidence. A mathematical proof does not authorize governance decisions.

**Method:** classify every protection as deployed at scale, prototyped, formally modeled, or still open. Prefer independently replicated studies and third-party criticism.

## Appendix D — An illustrative verifiable voting protocol

*Conceptual system, not a production security claim.*

- **Enrollment:** a real election would establish eligible voters using authoritative procedures. An experiment only authenticates volunteers and cannot prove legal voter eligibility.
- **Authorization:** issue an authorization or anonymous credential that does not publicly attach ballot choice to voter identity.
- **Choice and encryption:** client selects and encrypts; provide an independent *cast-as-intended* challenge/check mechanism.
- **Submission:** post accepted encrypted ballots to a publicly inspectable, signed bulletin board with deterministic ordering and inclusion evidence.
- **Non-revealing receipt:** voter obtains a tracker that permits verifying the presence of ciphertext, not proving candidate selection.
- **Tally:** independent trustees decrypt or compute aggregate results with publicly checkable cryptographic proofs (depending on chosen protocol).
- **Independent verification:** separate software checks election artifacts and tally proofs without trusting the election website.
- **Dispute/recovery:** define revoting, lost keys, outage handling, challenge windows, fraud responses, and post-election audits.

**Techniques worth explaining in detail later:** public-key encryption, commitments, zero-knowledge proofs, homomorphic tallying, mixnets, anonymous credentials, threshold decryption, Merkle proofs, and verifiable bulletin boards. These techniques are neither equivalent nor all required in every design.

**Implementation references:** [ElectionGuard](https://electionguard.vote/) and [Helios](https://www.heliosvoting.org/faq). Note the threat assumptions of each implementation and whether it was designed for supervised versus unsupervised voting.

## Appendix E — Field experience and third-party work

**Estonia.** Conducts legally binding internet voting, in operation since 2005. Its architecture includes digital identity, encrypted ballots, voter verification, and revoting. The documented phone-checking workflow does not imply that all casting is currently phone-native. Review the official [internet-voting overview](https://www.valimised.ee/en/internet-voting-estonia) and [i-vote checking instructions](https://www.valimised.ee/en/internet-voting/guidelines/checking-i-vote); use dated turnout figures only when sourced from the relevant election.

**Switzerland.** Limited internet-voting trials provide another useful design comparison involving verification codes and procedural controls. Confirm the current authorization and cantonal scope when drafting prose; consult the [Swiss Federal Chancellery](https://www.bk.admin.ch/en/e-voting).

**ElectionGuard / Helios.** Distinguish software/toolkits for end-to-end verifiability from a complete solution to coercion and compromised voter endpoints. See links in Appendix D.

**Critical literature.** [National Academies, *Securing the Vote* (2018)](https://www.nationalacademies.org/read/25120/chapter/7) and [*Going from Bad to Worse: From Internet Voting to Blockchain Voting*](https://academic.oup.com/cybersecurity/article/7/1/tyaa025/6137886). Read their critiques in the strongest available form.

## Appendix F — Delegation and Smartocracy

Delegation can be scoped by subject, geography, budget, duration, election, or specific ballot question; reversible up to a published cutoff; direct voting can supersede a delegated instruction when rules allow it.

**Trust graph questions:** Are delegations transitive? How are cycles handled? Can a public delegate acquire enormous influence? How do citizens discover expertise and potential conflicts? Can delegation choices be private? How does coercion manifest when a delegate controls many downstream votes? What does an auditable delegation authorization reveal about voters?

**Foundational source:** Rodriguez et al., [*Smartocracy: Social Networks for Collective Decision Making* (2007)](https://library.uniteddiversity.coop/Decision_Making_and_Democracy/Smartocracy.pdf). More general literature on liquid democracy includes behavioral experiments finding some delegation patterns worsen decision quality. See [NBER working paper](https://www.nber.org/papers/w30794).

## Appendix G — Participation incentives and ballot methods

**Participation incentives** are a distinct institutional design axis. Study voluntary participation, compulsory voting (with exemptions), reminders, civic credits, financial rewards, deposits, and hypothetical reserve/slashing mechanisms. Define whether a valid abstention or active delegation counts as participation. Quantify equity effects, manipulation and coercion concerns, administrative burden, and unintended incentives to cast uninformed ballots. **Do not reward particular candidate selections or political positions.**

**Comparative reference:** [International IDEA compulsory-voting data](https://www.idea.int/data-tools/data/voter-turnout-database/compulsory-voting). Australia can serve as one explicitly dated case study, not proof that a mechanism generalizes everywhere.

**Aggregation methods** are independent of internet transport. Compare plurality, two-round runoff, instant-runoff/ranked choice, approval, score, Condorcet, proportional/STV, and participatory budgeting. Ask how interface design, voter comprehension, independent verification, and counting complexity differ. No method perfectly captures all fairness criteria.

**Starting references:** [MIT Election Lab on instant-runoff voting](https://electionlab.mit.edu/research/ranked-choice-voting-instant-runoff-voting-use-united-states); [NCSL ranked-choice overview](https://www.ncsl.org/elections-and-campaigns/ranked-choice-voting).

## Appendix H — Vote Anyway: experiment brief

## Purpose and positioning

**One-sentence description:** A clearly labeled, unofficial, opt-in digital voting testbed that can display questions from an actual ballot and conduct a separate experimental vote, while publishing enough non-identifying evidence for participants and independent auditors to assess specified properties of the digital protocol.

**Non-negotiable presentation rule:** At the top of every voting flow, show conspicuous language such as: **“EXPERIMENTAL VOTE — NOT AN OFFICIAL ELECTION. Participating here does not cast or change your real ballot.”** Avoid official government seals, election-office styling, or ambiguous completion messages. Link to the responsible jurisdiction's official election information for the actual voting process.

If mirroring a real contest, source ballot question text from the election authority, document the jurisdiction and version/date, attribute it, and check applicable terms. Avoid implied affiliation or endorsement. Where exact ballot wording is unavailable or uncertain, use an obviously fictional practice election.

## What the MVP should establish (and what it cannot)

| Test | Observable evidence | Important limitation |
| --- | --- | --- |
| Mobile ballot UX | Task completion, time, comprehension, accessibility feedback | A smooth interface is not proof of election security |
| Cast-as-intended checks | Challenge/spoil-and-check workflow or independent-device verification | The same compromised phone can subvert a dependent check |
| Recorded-as-cast | Personal inclusion tracker plus public encrypted ballot record | Inclusion does not prove the device encoded the intended candidate |
| Tallied-as-recorded | Independently runnable tally verifier, published proofs/artifacts | Only proves tally consistency under the chosen protocol assumptions |
| Privacy separation | Architectural and code review of authorization vs encrypted ballots | Metadata, logs, device telemetry, or poor credential design can still leak identities |
| Failure recovery | Controlled missing-ballot, duplicate, or outage simulations | Simulations do not prove resilience against determined attackers |
| Coercion research | Safe, consented usability tests of revoting or fake credentials | A decoy screen alone is not coercion resistance |
| Delegation research | Controlled scope, revocation, cycle, and proxy-power tests | Not a substitute for legally defined democratic authority |

## Suggested architecture sketch (research prototype, not an election-certified design)

**Client:** mobile-first web application (e.g., React/TypeScript). Show the ballot; encrypt client-side with a well-reviewed election protocol; support challenge and verification flows. Prefer mature audited implementations over hand-rolled cryptography.

**Authorization layer:** study eligibility/uniqueness separately from the encrypted ballot. In an early opt-in prototype, state explicitly that unique *accounts* or invitations do not establish unique *eligible voters*. Passkeys may improve sign-in usability but do not solve personhood or election eligibility.

**Election engine:** election configuration and public keys; encrypted ballot submission; public bulletin board; tally process with independent trustees where supported; signed releases of election artifacts. A hash on a server log is not enough to establish end-to-end verifiability.

**Public independent verifier:** separate minimal program that downloads an election package and verifies commitments, allowed ballots, proofs, and tally. Make it possible for third parties to run without operator permission.

**Data minimization:** collect no real-world political identity unless essential to a consented test. Keep authorization metadata away from ballot records. Avoid tracking scripts and targeted-ad infrastructure in voting flows. Set clear retention and deletion rules, while explaining which encrypted public artifacts necessarily persist.

**Results:** publish totals with clear labels indicating an opt-in experimental sample. Do **not** suggest discrepancies with official results indicate tampering: selection effects, demographic differences, eligibility uncertainty, wording differences, and different turnout make such comparisons invalid as election audits.

## Incremental build plan

| Stage | Deliverable | Main learning objective |
| --- | --- | --- |
| 0 — Illustrated ballot | Nonbinding mock ballot, clear experiment labeling, no sensitive data required | UX, scope and risk of confusion |
| 1 — Verifiable election | Encrypted casting, trackers, public encrypted bulletin board, reproducible verifier | What E2E verifiability really proves |
| 2 — Adversarial exercises | Simulated altered-client behavior, removed ciphertext, invalid proof, outages | Which failures are detected, and by whom |
| 3 — Privacy/duress laboratory | Separately consented revoting and fake-credential experiments | Usability and limitations of coercion mitigations |
| 4 — Delegation laboratory | Issue-scoped proxy votes with revocation and cycle rules | Influence concentration, transparency, participant comprehension |
| 5 — Comparison and publication | Open methods, aggregate results, attack limitations, independent reviews | Reproducibility—not extrapolation to real electoral outcomes |

## Research questions to record as issues

- Which E2E-V protocol or SDK is best suited to remote voting research rather than in-person voting machines? Review [ElectionGuard](https://electionguard.vote/) and [Helios](https://www.heliosvoting.org/faq), and document their assumptions.
- Can independent ballot-intent checking be practical on a single phone? What additional trusted device, paper code, or hardware anchor might be necessary?
- How would a user enroll and recover credentials without creating a reusable vote-selling receipt?
- Can a recovery or revoting rule be both understandable and robust under coercion?
- How should the public verifier and test vectors be packaged to encourage independent implementation?
- Can a small research study recruit participants without implying that experimental tallies are representative public opinion?
- How should domain-specific delegation work, and how are cycles, concentration and revocation handled?
- Which safeguards must remain human, procedural, or institutional instead of purely cryptographic?

## Appendix I — Participation granularity and governance risks

Voting more often does not automatically lower the stakes. **Granularity** depends on legal authority, budget ceilings, geographic scope, reversibility, and procedural rights. Explore municipal budgeting, local environmental stewardship and planning decisions as hypothetical or documented cases, being explicit about binding versus advisory authority.

Other questions: voter fatigue; unequal participation; agenda-setting power; manipulation and disinformation; effects of repeated majority votes on minority rights; proxy concentration; durable investments and planning horizons. Deliberative systems such as [Pol.is](https://pol.is/), [vTaiwan](https://info.vtaiwan.tw/), and [Decidim](https://decidim.org/) are relevant adjuncts but do not automatically provide legitimate binding voting authority.

Broader framing, intentionally brief in the article: externalities and environmental valuation, digital twins, distributed resource stewardship, wealth concentration, and social trust. A governance system needs sensing, values, deliberation, action, and feedback; voting is one decision mechanism within it.

## Appendix J — Citations, projects, and reading

**Core technical objections and standards**

- National Academies of Sciences, Engineering, and Medicine, [*Securing the Vote: Protecting American Democracy* (2018)](https://www.nationalacademies.org/read/25120/chapter/7). Particularly internet voting and software independence.
- [ElectionGuard: creating a verifiable election](https://github.com/Election-Tech-Initiative/electionguard/blob/main/docs/concepts/Verifiability.md). Concrete definition of tracking codes, challenged ballots, and independent verification.
- [Helios Voting FAQ](https://www.heliosvoting.org/faq) and [verification specification](https://sites.google.com/site/heliosvoting/verification-specs/helios-v3-verification-specs). Open-audit remote-voting reference and its limitations.

**Coercion and usability**

- Merino et al., [*E-Vote Your Conscience: Perceptions of Coercion and Vote Buying, and the Usability of Fake Credentials in Online Voting* (2024)](https://arxiv.org/abs/2404.12075).

**Real-world internet voting**

- [Estonia's October 2025 local election results](https://kov2025.valimised.ee/en/detailed-voting-result).
- [Estonia's official i-vote checking instructions](https://www.valimised.ee/en/internet-voting/guidelines/checking-i-vote).

**Delegation and civic participation**

- Rodriguez et al., [*Smartocracy: Social Networks for Collective Decision Making* (HICSS 2007)](https://library.uniteddiversity.coop/Decision_Making_and_Democracy/Smartocracy.pdf).
- [Decidim](https://decidim.org/) (participatory civic processes).
- [vTaiwan](https://info.vtaiwan.tw/) and [Pol.is](https://pol.is/) (deliberation and preference clustering, not substitutes for binding votes).

## Appendix K — Access, suppression, and the right to cast a vote

**Purpose:** support the moral urgency of the article without treating every inconvenience as deliberate disenfranchisement or treating objections to internet voting as evidence of ill intent. Distinguish three categories:

- **Intentional suppression or intimidation:** deliberate acts to stop eligible participation, requiring evidence about acts and intent before making specific accusations.
- **Administrative barriers or malfunctions:** too few workers/sites, unexpected queues, inaccessible facilities, confusing requirements, registration failures, lost ballots, or service disruptions. These can obstruct participation without proof of intent.
- **Security safeguards with access costs:** identity checks, registration cutoffs, audit procedures, and ballot-handling rules. Evaluate whether burdens are proportional and whether less exclusionary alternatives achieve the same goal.

**October 20, 2026 North Dallas illustration:** [Reddit /r/pics post: “Early voting today in north Dallas [oc]”](https://www.reddit.com/r/pics/comments/1xawic7/early_voting_today_in_north_dallas_oc/). It is a posted photograph and discussion of a queue, not independent proof of wait duration, disenfranchisement, or a deliberate suppression strategy. Verify date/location and reuse permissions before publishing the image in the article. Better to link to the post or describe it than to treat comments as verified facts.

**Research:**

- [Brennan Center, *Election Day Long Lines: Resource Allocation*](https://www.brennancenter.org/our-work/research-reports/election-day-long-lines-resource-allocation): research based on 2012 polling places showing that resource allocation contributed to delays and that planning could have mitigated some lines. Date the study; do not treat it as direct evidence about the Dallas photo.
- [Brennan Center, *How to Fix Long Lines*](https://www.brennancenter.org/our-work/policy-solutions/how-fix-long-lines): documents the participatory cost of long queues and access improvements.
- [U.S. Election Assistance Commission, *2024 Election Administration and Voting Survey*](https://www.eac.gov/news/2025/06/30/us-election-assistance-commission-releases-2024-election-administration-and-voting): national election-administration baseline and methods used to cast ballots, with emphasis on distinguishing paper from in-person-only voting.
- [Associated Press, October 2026 Texas voter registration backlog](https://apnews.com/article/30b754a540feea0e40772e74cf2c4e49): software failures interrupted registration processing for hundreds of thousands of applicants; the state said the backlog had been cleared before early voting. A useful counterexample to technological triumphalism—badly implemented digital systems can also undermine access.
- [National Academies, *Securing the Vote* (2018)](https://www.nationalacademies.org/read/25120/chapter/7): a substantive case for software-independent, auditable systems and a warning about internet-voting attack surfaces. The essay must acknowledge this research rather than caricaturing it.

**Conceptual distinction:** long queues show weaknesses in *polling-place access*, not the paper ballot as such. Paper ballots can be distributed through mail and other mechanisms. Internet voting changes both the access model and the attack surface. The article should compare these full systems.

**Testable research questions for Vote Anyway:** How much time does a user spend authenticating and voting? What fraction can independently verify ballot inclusion and comprehend what their tracker proves? Which accessibility needs are met or not met? How does at-home voting change the risks of coercion? Such experiments cannot establish the impact of remote voting on actual election turnout, nor replace real-world administrative studies.

**Editorial rule:** neither intentional suppression nor perfect security should be inferred from anecdotes. Propose reforms as design alternatives that can be evaluated, not solutions whose efficacy has already been proved.


---

# Editorial workbench / future iterations

**Next prose pass:** draft only the main article (1,600–2,100 words), preserving links from narrative claims to appendices. Open with the cost of *having to get one's vote into the system*—using the Dallas queue as an illustration, not proof of intent—then develop the affirmative engineering case and the actual objections. Retain the author's practice of theory tested by software.

### Candidate prose — opening moral argument (not yet woven into the full essay)

I find it infuriating how difficult we can make it for an eligible citizen to cast a vote. A photograph of people waiting in a long line to vote may inspire admiration for their determination. It should also provoke an uncomfortable question: how many people had neither the time nor the physical ability to join that line? A system can count every ballot it receives perfectly and still fail the people whose ballots never make it that far.

I understand why paper ballots have defenders. A human-readable ballot can be inspected and recounted without relying on the software that counted it the first time. That is a genuine advantage. But it doesn't settle the separate question of whether everyone has a reasonable opportunity to participate. Nor should it close the door on investigating secure voting over the internet. We already engineer reliable, auditable systems for consequential transactions. We should be willing to ask—carefully, critically, and experimentally—what it would take to do the same for voting.

*Editorial note:* This preserves the anger without accusing paper-ballot advocates of a “psyop,” dismissing legitimate security concerns, or claiming that a queue alone proves intentional suppression. If published, link the Dallas example in a nearby note and keep the research in Appendix K.

**Possible headlines:** *Voting, Unbundled*; *Democracy at a Higher Frequency*; *The Ballot Is a Protocol, Not Paper*; *What If Voting Were as Easy as Sending a Message?*

**Decisions to test editorially:**

- Could **Vote Anyway** be the opening anecdote rather than an interlude? Would the piece be stronger with a live prototype link once it exists?
- Can Parts I and II be approximately equal in length, while most highly technical evidence migrates to appendices?
- Should participation incentives and alternative aggregation methods share one compact narrative section or become separate essays later?
- What is the minimum proof/evidence needed to support a compelling claim of *practical feasibility* without overstating election-scale security?
- Which diagrams are worth embedding in the essay (at most two): receipt/verification flow; delegation trust graph? Put all extra diagrams in appendices.

## Version history

- **v0.1 — 2026-10-18:** Two-part article structure; broad governance context; Vote Anyway experiment.
- **v0.2 — 2026-10-19:** Digital transaction reliability analogy; participation incentives, including compulsory voting and reserve/slashing; runoffs and other ballot methods.
- **v0.3 — 2026-10-19:** Re-architected as a short, persuasive article plus optional appendices. Moved technical protocols, prior research, citations, detailed caveats, threat models, alternative voting methods, and Vote Anyway's experimental specification out of the narrative. Reduced the main outline to six substantive sections plus a praxis interlude.
- **v0.4 — 2026-10-20:** Added the article's moral stake: the harm of barriers to legitimate participation; sharpened the distinction between ballot integrity and voting access; retained full credit for paper recountability; added Dallas queue reference, source-backed access/suppression appendix, and a first-person candidate opening passage.
