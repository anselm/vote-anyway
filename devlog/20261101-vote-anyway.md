# Vote Anyway

*What if a ballot were something we could cast from a phone, check for ourselves, and use far more often?*

There are consequences when we can't make decisions together. We divide, we go to war, we bury our beloved. Standing in the ruins of what we built, we try again to identify stakeholders, find common ground, and make tools for rough agreement. “Never again,” we say. Each movement of peace is hard earned.

We are bad at distinguishing between stretching and tearing. We pull at the social fabric without knowing when it will give way. There is no materials science of our collective life. But there are institutions, habits, and tools that help us disagree without destroying one another. I want to work on those.

Voting is one small part of that larger task. It gives us somewhere concrete to begin.

The image is familiar: a line of people stretching around a building, waiting to vote. Sometimes it is offered as proof of civic commitment. I find it infuriating. How many people were unable to join that line? How many could not afford to miss work, find childcare, arrange transportation, or stand for an hour?

A long queue is not, by itself, evidence that someone intended to suppress votes. But an election can be administered without a single ballot being miscounted and still fail people who never had a practical opportunity to cast one. Election integrity has two sides: **legitimate votes must be counted, and legitimate voters must be able to participate**.

We make tremendous demands on people to exercise a simple civic right. Meanwhile, we live in a world where we can move money, sign contracts, authenticate ourselves, buy almost anything, and collaborate across continents using a device in our pockets. It is reasonable to ask why voting is so different.

There are good answers to parts of that question. There are also deeply unsatisfying answers. I don't think the debate should end at *paper ballots are safer*. I think it should begin with something more ambitious: **What would it take to vote securely over the internet—and what might become possible if we could?**

This is not an argument that software can fix democracy. The problems go much deeper: how societies govern shared resources, account for environmental damage, distribute power, and decide what they value. Better voting would be one instrument in a much larger toolkit. But instruments matter. An infrequent, expensive, low-bandwidth mechanism for expressing collective choices limits what kinds of collective decisions we can make.

## I. Rebuilding the ballot

### Start with the person trying to vote

I cut my teeth on mass-market consumer video games. I tend to approach technology through the experience of the person using it: can they understand what is happening, do what they came to do, and recover when something goes wrong? That is a way of thinking about a system, not a layer of decoration added at the end.

Voting is design. Type that is too small, instructions that assume a particular language or level of literacy, a process that rushes someone who needs time: each can become a filter on participation. A person should not have to pass an accidental test of eyesight, dexterity, technical confidence, or endurance to have a voice. A phone can remove some barriers and introduce others. Good design has to include people without one, too.

Los Angeles County's [Voting Solutions for All People](https://www.lavote.gov/vsap/design-concepts) is a useful example of taking that experience seriously, with research, accessibility features and voter testing. It also [retains a paper ballot](https://www.lavote.gov/home/voting-elections/voting-options/voting-in-person/vsap-faqs). Improving the interface and preserving physical evidence can be parts of the same design.

### We already trust the internet with consequential transactions

Every day, technical systems move astonishing quantities of money and information. Cryptographic signatures authenticate transactions. Distributed databases replicate records. Protocols authenticate websites. Ledgers provide evidence of what happened and when. Failure is not impossible, but decades of engineering have produced systems that are extraordinarily capable.

I find it peculiar that we sometimes talk about an internet ballot as though reliable authenticated communication were a mysterious, unsolved problem. When I type the address of a major service, I generally arrive at that service. When I authorize a payment, I generally expect an accurate record of the transaction. Cryptocurrency systems go further in allowing outsiders to verify the state of a ledger without trusting a single operator.

Voting is not identical to banking or Bitcoin. A secret ballot must conceal a choice even while proving that it was properly counted. It must resist vote buying and coercion. It should not give a voter a transferable receipt proving how they voted. A compromised phone might lie about what it submits. Those are real differences—not reasons to stop investigating, but **requirements for the design**.

We should compare actual properties and attack models, not an idealized paper ballot against a deliberately vulnerable computer. [The technical comparison is in the security appendix](/appendix-security.html).

### Arguments for paper voting

Paper's great virtue is that it can be inspected and recounted by humans, independently of the original counting software. That matters enormously. Supporters of auditable paper elections are defending a real safeguard, not merely expressing a sentimental attachment to an old technology.

A voter-verified paper ballot provides evidence outside the computer. With sound custody and a properly conducted audit, it can help expose a wrong reported outcome. The computer's answer does not have to be the last word. This is the heart of the argument for **software independence**: a software failure must not be able to change an outcome without leaving detectable evidence. [Ronald Rivest's account](https://people.csail.mit.edu/rivest/pubs/Riv25a.pdf) makes that case clearly.

A supervised polling place also offers something a living room may not: a private place to make a choice. Remote voting has to contend with someone looking over a voter's shoulder, demanding compliance, or preventing them from voting again. Encryption alone cannot make that person leave the room.

I concede the force of these arguments. The case for paper deserves to be answered at its strongest.

### Arguments against paper voting

Paper doesn't arrive in a ballot box by magic. Ballots must be prepared, distributed, guarded, transported, stored, counted, and sometimes recounted. Those arrangements take labor and resources. They can also fail. Ballots can be lost or damaged; custody can be compromised; voters can be unable to reach the process at all.

For a geographically scattered association, an open-source project, or a community trying to make frequent small decisions, organizing a physical ballot may be so cumbersome that the vote simply never happens. That is an important cost, even when no official election has been compromised. The available machinery shapes which questions we bother to ask.

These are arguments against treating paper as the only possible medium. Long lines are not inherent to it: mail voting, early voting, more polling places and better administration can all improve access while retaining paper evidence. Nor does paper require a simple plurality count; ranked and proportional methods can use it too.

Still, the full comparison matters. What failures can each complete system suffer? How far can one attack spread? Can people detect and correct the damage? Who is excluded, and what happens when they need help? An internet attack can reach across jurisdictions at a scale that a local physical attack cannot. Physical custody has its own vulnerabilities. Neither comparison should disappear because it complicates our preferred story.

Election security should not be defined so narrowly that protecting the count takes precedence over whether people can reach the count in the first place.

### A vote you can check for yourself

Imagine opening a voting application on your phone. You authenticate, select your choices, and submit an encrypted ballot. You receive a tracking code. Later, you can find that exact encrypted ballot on a public record and verify that it was not silently removed. Independent observers can inspect mathematical evidence that the recorded ballots were tallied correctly.

The relevant family of technologies is called **end-to-end verifiable voting**. The point is not merely that a vendor promises its machines are secure. It is that voters and third parties can check important properties of the process *without having to trust the machine that performed it*.

This is a different proposition from putting a ballot on a screen and asking people to trust the vendor. A zero-knowledge proof can establish a specified fact without exposing the secret behind it—for example, in an appropriate election protocol, that an encrypted selection obeys the ballot rules. Other proofs and procedures are needed to connect that ballot to the result.

Zero-knowledge proofs are not new inventions. Their foundations go back to the 1980s, and cryptographic voting has a substantial research history. The fresh opportunity is in developing and combining these ideas into systems people can actually use. **An ordinary electronic voting machine, an end-to-end verifiable election, and an unsupervised vote from a phone are different designs with different risks.** [The history and distinctions are in the security appendix](/appendix-security.html#proofs-change-what-can-be-checked).

That little tracking code should not let you prove your candidate choice to someone else. Otherwise it also becomes a tool for bribery or coercion. And checking that an encrypted ballot was recorded is different from checking that the phone encrypted the choice you intended. The distinction matters, and the engineering is substantial.

We aren't starting from zero. Estonia has conducted binding internet elections for more than two decades. In its 2025 local elections, **45.8 percent of valid votes were cast online**. Estonia's system isn't a complete realization of this phone-native vision—casting currently relies on a computer, with a phone used for checking—but it demonstrates that remote internet voting is more than a whiteboard proposal. Its design also permits revoting, a response to some coercion scenarios.

Researchers have developed techniques involving encrypted ballots, public bulletin boards, zero-knowledge proofs, challenge ballots, and systems that make it harder for coercers to know whether a voter complied. None of these mechanisms should be waved around as a magical solution. Each works under assumptions that must be spelled out, implemented correctly, and tested adversarially. [Those details, and the strongest objections, belong in the appendices](/appendix-security.html).

I made a small contribution to PGP, and cryptography is familiar territory to me. But the argument I want to make here is broader than a claim about a particular protocol: **we should try harder**. We should do much more to find out how good digital voting can become.

That means taking criticism seriously enough to turn it into experiments. A valid proof cannot, by itself, establish that a compromised phone displayed the right question, that a credential was issued to the right person, or that the voter was free from coercion. The space between a mathematical protocol and a trustworthy public service is part of the work.

### Vote Anyway: theory meets practice

As a programmer, I find it useful to move continuously between theory and action. A claim becomes more interesting when I can build a small version of it, discover its failure modes, and revise the claim in response.

So here is an experiment: **Vote Anyway**. On the working site, people can sign in, create a question with a set of choices, share it, and submit an encrypted ballot. It is an unofficial research project: participation here does not cast a vote in a public election.

The first useful settings could be associations, cooperatives, open-source projects, schools and neighborhoods. The stakes still need to be understood; a small group's decision can matter deeply to its members. But we can begin with a clear membership rule, a bounded decision and a way to revisit a failure, instead of making a national election our first test.

Could a voter independently find their encrypted ballot? Could an outside program verify the published record? Would people understand the difference between checking inclusion and checking correct tallying? What happens when a device lies, a server drops a submission, or a voter needs to submit again? How would we make coercion resistance understandable rather than merely mathematically impressive?

The current prototype is deliberately modest. It shows a mobile ballot, encrypts the selection before submission, produces a tracking code, and publishes a signed, independently checkable record. Its tally is still computed by a server and is **not** yet cryptographically independently verifiable. Sign-in uses attest.monster and passkeys, but it does not establish voter eligibility, uniqueness, or coercion resistance. Repeat submissions are currently permitted. Those gaps are the next research questions, not details to conceal.

The experiment won't tell us how a real electorate would vote; volunteers are not a representative sample. It may tell us something about how a voting protocol works, where it fails, and how people understand it. [Explore the prototype](/lab.html), [its engineering notes](/appendix-prototype.html), and the [development log](/devlog.html).

Work in the [OpenVTC community](https://github.com/OpenVTC/openvtc) points toward another useful direction: membership credentials, privacy-preserving proofs, and election tools built on top of identity infrastructure. Their [Predicate Credential System](https://github.com/OpenVTC/predicate-credential-system) and [account of zero-knowledge proofs in their trust infrastructure](https://openvtc.github.io/wiki/concepts/zero-knowledge-proofs) provide concrete work to learn from: checking community attestations while keeping the people who made them private. Its foundation differs from this project's. The shared ambition is to make that infrastructure useful to real groups. I want an organizer to be able to create a comprehensible decision process, and a member to understand what their participation means. [A companion note examines those capabilities and the questions they raise](/appendix-community-voting.html).

## II. What changes if voting becomes cheap?

### Democracy at a higher frequency

For most of us, democracy is a periodic event. We elect representatives who make an enormous number of subsequent decisions on our behalf. A single vote often stands for an unwieldy bundle of positions on housing, schools, transportation, taxes, environmental protection, and matters that have little to do with each other.

This isn't only a philosophical choice. Elections are expensive to organize. Their cost, together with the effort required of participants, encourages us to concentrate decisions into infrequent events.

What if the marginal cost of asking people to vote fell dramatically? A city might ask residents to prioritize several neighborhood improvements. A community might decide how to spend a restoration budget. A policy experiment could be authorized for a limited period, evaluated, and revisited.

Making a vote cheap does **not** automatically make its consequences small. The stakes become smaller only if institutions deliberately bound the decision by budget, scope, duration, or reversibility. A constitutional right should not become a weekly popularity contest. And a stream of constant notifications would be its own form of voter suppression, this time by exhaustion.

Still, the possibility of decisions that are more local, specific, time-bounded, and revisable is worth investigating.

### Public fabric, and the limits of a poll

What if participation were in the fabric, like air? Something people could use without asking a single institution to convene every conversation. I am interested in systems with no center: public protocols, independent tools, evidence that can be inspected, and communities able to carry on when a particular service disappears. Vote Anyway is currently a centrally operated prototype. That wider ambition remains work to do.

Sometimes the useful act is simply to learn what people think. A survey can reveal priorities; deliberation can expose common ground; an election can authorize someone to act. They are different things. A self-selected poll is not the will of an entire community, and agreement among respondents does not automatically confer a mandate. We should make the question, the participants, and the authority of the result visible.

### You shouldn't have to be an expert in everything

There is another barrier to frequent voting: attention. People have lives. They cannot be experts in every public issue. If we merely add hundreds of ballots to everyone's calendar, we have not necessarily improved democracy.

Here a more interesting idea appears: **Smartocracy** and its close relatives in liquid or delegative democracy. [Brad deGraf](https://www.planetwork.net/people/brad-degraf) was among the developers and authors of the early Smartocracy work, including the 2007 paper *Smartocracy: Social Networks for Collective Decision Making*, coauthored with Marko Rodriguez and colleagues.

The essential idea is that people could decide directly where they wish, while delegating specific voting authority to others whom they trust. Perhaps I want to cast my own vote on transportation but delegate an energy question to a technically knowledgeable colleague. I might change that delegation later. Trust could be issue-specific rather than an all-or-nothing transfer of representation.

This is not without risks. Influence might become concentrated in a small class of popular delegates. Delegation networks can develop cycles or hide conflicts of interest. Researchers have also found cases where too much delegation makes collective decisions worse. Yet these are questions we can model and test rather than settling them by assumption.

Convenience, of course, is only part of participation. Some societies require voting; others could explore participation credits, rewards, or civic obligations. Such experiments would have to distinguish participating from supporting any particular candidate, protect legitimate abstention, and account for unequal access. Voting methods themselves are also open to experimentation: runoffs, ranked choices, approval voting, and other rules can express preferences differently. Many already work on paper; a digital interface may make them easier to present, compute, and independently inspect. [The delegation and institutions appendix goes deeper](/appendix-democracy.html).

### Better voting is not the same as better governance

I am more environmentalist than humanist. Nature matters in its own right; humans are change agents within a much larger ecosystem of life. A better instrument for aggregating human preferences would not, by itself, give the rest of that world a voice.

It would be absurd to claim that changing the ballot mechanism solves the problems of democracy. A society must also decide what it values, understand the world it inhabits, deliberate in good faith, execute decisions, and learn from consequences. Environmental monitoring and digital twins might help us see the effects of policy. Deliberation tools might help us find agreement. None of them can tell us, by themselves, what we ought to decide.

But voting is one of the actuators in that larger system. If it is cumbersome, costly, inaccessible, or difficult to audit, it constrains the whole enterprise.

I want an election in which legitimate voters don't have to prove their devotion by standing in a line. I want a vote that can be independently checked, a system whose failures are detectable, and a public conversation that treats security and participation as equally serious requirements. I want us to investigate what becomes possible when citizens can participate from their phones, sometimes directly and sometimes through people they trust.

There is an obvious next step for a programmer: **build it, publish the evidence, invite criticism, and iterate**. Not because the first prototype will have solved democracy, but because we will learn more from a system we can inspect than from another argument about why it can never work.

Why not also vote digitally?

Vote anyway.
