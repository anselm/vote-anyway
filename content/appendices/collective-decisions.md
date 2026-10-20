# Appendix D — Ways of deciding together

Voting machinery has a richer history than a box beside a name. We can choose one person, assemble a representative council, decide which projects to fund, or discover a proposal that people with different views can support. Each asks something different of the participants and of the rule that turns their responses into a decision.

Digital voting opens a practical question: could more of this repertoire become understandable, accessible and open to inspection? The methods themselves have long histories, including on paper. Software gives us another way to explain and try them.

## Begin with the purpose

| Purpose | What we need to express or examine |
| --- | --- |
| Choose one person | First preferences, acceptable alternatives and support between candidates |
| Elect a representative group | Whether different constituencies gain a voice across the available seats |
| Set priorities or allocate resources | Preferences alongside costs, constraints and competing needs |
| Find common ground | Reasons, objections, revised proposals and areas of shared support |
| Delegate a decision | Who may act for whom, on which question, and how that authority can be withdrawn |

A council can fairly represent people who continue to disagree. A group may reach a workable decision without reaching consensus. Finding agreement may require discussion that changes the proposals themselves. These are related achievements, but the design should say which one it is trying to accomplish.

## A few historical threads

In eighteenth-century France, **Jean-Charles de Borda** and **Nicolas de Condorcet** explored different ways of combining preferences. Borda’s approach assigns points according to rank. Condorcet examined comparisons between pairs of alternatives, including the possibility that collective preferences can cycle even when each person’s ranking is consistent. In the twentieth century, **Duncan Black, Kenneth Arrow and Amartya Sen** helped develop the wider field of social choice: studying the conditions, tradeoffs and limits of collective decision rules. Christian List’s [*Social Choice Theory*](https://plato.stanford.edu/entries/social-choice/) provides an introduction and scholarly bibliography.

Another thread concerns representation. The Electoral Reform Society traces transferable voting through **Thomas Wright Hill’s** committee-election experiment in 1819, **Carl Andræ’s** work in Denmark, and **Thomas Hare’s** *The Machinery of Representation* in 1857. Later contributions by **Henry Droop** and **J. B. Gregory** refined quotas and surplus transfers. This was a developing family of practices, with contributions from several people. See [the Society’s account of STV’s origins](https://electoral-reform.org.uk/who-invented-the-single-transferable-vote/), written from its perspective as an advocate for electoral reform.

These threads help frame our experiment: choosing a broadly supported individual and giving different groups representation have motivated different machinery.

## When several seats are available

The [Nonprofit VOTE article that prompted this discussion](https://www.nonprofitvote.org/fair-vote-methods-for-multi-seat-elections/) compares three alternatives to at-large block voting, where voters can support as many candidates as there are seats and the highest totals win.

| Method | What a voter can do | A tradeoff to examine |
| --- | --- | --- |
| Limited voting | Support fewer candidates than the number of available seats | Simple ballots, but support can still split among similar candidates |
| Cumulative voting | Distribute a fixed number of votes, including several to one candidate | Concentrated support can gain representation, but allocation involves strategy |
| Single transferable vote (STV) | Rank candidates; votes can transfer as candidates are elected or excluded | Representation depends on the available seats, rankings and specified counting rules |

The article is a useful introduction, rather than a universal specification or a guarantee that every constituency will gain a seat. Its recommendations should be read alongside the rules used by actual election administrators.

### Example: a majority need not take every seat

Imagine 100 voters electing five representatives. Sixty support one slate and forty support another. Under block voting, if everyone votes for all five candidates on their own slate, the first slate’s candidates each receive 60 votes and the second slate’s each receive 40. The first group wins all five seats.

Now consider a hypothetical cumulative ballot with five votes per person. The first group has 300 votes to allocate and the second has 200. If the first group concentrates equally on three candidates and the second equally on two, those five candidates each receive 100 votes. With other candidates receiving none, the seats divide three and two.

This is an illustrative allocation, not a prediction: it assumes coordinated choices about whom to support. It shows both the opportunity for minority representation and why the distribution of support matters.

### Example: transferring support after a candidate is elected

STV uses rankings to guide transfers. A common winning threshold, the integer **Droop quota**, is the whole-number part of `valid ballots / (seats + 1)`, plus one. For 100 valid ballots and three seats, that is 26. Ireland’s Electoral Commission explains [quotas, surpluses, exclusions and transfers](https://www.electoralcommission.ie/irelands-voting-system/).

Here is a deliberately simple fictional count using fractional surplus transfers. The ballots are:

- 40 rank Avery, then Blair, then Casey.
- 25 rank Blair, then Casey.
- 20 rank Casey.
- 15 rank Drew.

| Stage | Avery | Blair | Casey | Drew |
| --- | ---: | ---: | ---: | ---: |
| First preferences | 40 | 25 | 20 | 15 |
| Avery elected; transfer surplus of 14 | 26 | 39 | 20 | 15 |
| Blair elected; transfer surplus of 13 | 26 | 26 | 33 | 15 |

Avery and Blair each retain the quota’s worth of support. Their surplus support follows the next available preferences to Casey, who reaches the quota and fills the third seat. Ballot weight is transferred, not duplicated. If no candidate could be elected and no surplus were available, exclusions and further transfers would be needed.

STV has several counting variants. Fractional transfer values, rounding, ties and exhausted ballots must follow a published rule; this example is not a complete implementation specification. The Electoral Reform Society’s [STV counting manual](https://electoral-reform.org.uk/latest-news-and-research/publications/how-to-conduct-an-election-by-the-single-transferable-vote-3rd-edition/) is one concrete reference for fractional transfers. Ireland’s procedures are a separate reference, not a claim that every detail of this example reproduces an Irish count.

## A ranked ballot can serve different purposes

Single-winner instant runoff and multi-seat STV both use rankings. In the former, elimination transfers help select one winner; in the latter, quotas and surplus transfers help allocate several seats. Counting the top three first-choice totals is not the same as conducting a three-seat STV election.

Our [runoff design note](/voting-methods.html) explains the single-winner proposal and its limits, including research showing why ranked-choice voting should not be described as eliminating every spoiler effect or guaranteeing consensus. The [participation and delegation appendix](/appendix-democracy.html) introduces approval, score and Condorcet methods, and credits the Smartocracy work of Brad deGraf and his coauthors.

## Finding common ground before the ballot

Sometimes the useful work is discovering a better proposal. **Polis**, maintained by the Computational Democracy Project, lets participants contribute statements and respond to others with agreement, disagreement or a pass. Its analysis can identify opinion groups and statements supported across those groups. That can inform further discussion and decision-making. See [the project’s own explanation](https://compdemocracy.org/polis/).

For Vote Anyway, we should distinguish such an exercise from an authorized decision. Who participated, who was absent, how statements were moderated, and how findings lead to action all matter. Apparent agreement among participants does not by itself establish consent from an entire community.

## What this means for Vote Anyway

The interface could eventually begin with: **What are you trying to decide together?** It could then explain suitable methods, show a small example, and publish the chosen rules before participation begins. That is a design direction, not a claim that these methods are already available.

Today the app supports informal single-choice topics. The proposed next experiment is a single-winner ranked runoff, with explicit participation and counting rules. Multi-seat methods, resource allocation, deliberation and delegation remain further work. The [current feature plan](/about#where-we-are) distinguishes what is working from what we want to explore.

The aim is to make the choices in democratic machinery visible: what people can express, whose voices the outcome includes, and how anyone can check the path from participation to decision.

[Research & sources](/research.html) · [Read the essay](/essay.html) · [Development log](/devlog.html)
