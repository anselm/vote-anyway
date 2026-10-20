# Electing someone, without losing the second choice

When several people run for one position, a single-choice ballot can divide support among candidates with similar constituencies. A ranked ballot lets someone say both “this is my first choice” and “if they cannot win, I would prefer this person.”

**Proposed next experiment:** single-winner ranked-choice runoff voting. Vote Anyway currently accepts one choice per submission; ranked ballots and automatic runoffs are not yet available. [Where we are](/about#where-we-are) tracks the working features and next steps.

## How an instant runoff works

Rank the candidates in preference order. Count each ballot for its highest-ranked candidate still in contention. If nobody has a majority of the continuing ballots, eliminate the candidate with the fewest votes and transfer those ballots to their next remaining choices. Repeat until a candidate has a majority, subject to the published tie rules. Maine’s [ranked-choice voting guide](https://www3.maine.gov/sos/elections-voting/ranked-choice-voting-frequently-asked-questions) describes this round-by-round approach.

Here is a fictional election with 100 complete ballots:

| Candidate | First choices | Transfers from Casey | Final round |
| --- | ---: | ---: | ---: |
| Avery | 42 | +5 | 47 |
| Blair | 33 | +20 | 53 |
| Casey | 25 | −25 | Eliminated |

Avery would win a simple plurality vote. In this example Casey is eliminated; twenty of Casey’s voters prefer Blair next and five prefer Avery. Blair wins the runoff, 53–47. Those voters can express their first preference and still help decide between the remaining candidates.

If a ballot has no remaining ranked candidate, it is **exhausted** and stops contributing to later rounds. Results should show both continuing and exhausted ballots, and identify the denominator used for any majority claim. A majority of continuing ballots may be less than half of the original ballots.

For the broader history and multi-seat methods, see [Ways of deciding together](/appendix-collective-decisions.html).

## Several ways to address the problem

| Method | What a participant does | What the experiment would need |
| --- | --- | --- |
| Two-round runoff | Votes once, then returns for a second ballot between the finalists if required | Two opening and closing periods, a threshold and rules for qualifying finalists |
| Instant-runoff voting | Ranks candidates on one ballot | Transfers, exhausted-ballot counts and a visible result for every round |
| Approval voting | Marks every candidate they would accept | Approval counts; the most approvals wins, with a published tie rule |

These are alternative rules, not interchangeable names for the same count. For several seats, proportional methods such as single transferable vote require a different design. The [democracy appendix](/appendix-democracy.html) places ballot methods alongside deliberation, participation and delegation.

Ranked-choice voting does not resolve every vote-splitting or strategic-voting problem. A broadly acceptable candidate can be eliminated before the final round. Adam Graham-Squire and David McCune’s [analysis of Alaska’s 2022 special election](https://arxiv.org/abs/2209.04764) documents a result where the instant-runoff winner differed from the candidate who would beat each rival in a head-to-head comparison. That is a reason to make the counting rule explicit and study alternatives.

## What we should build next

The proposed first version is an informal, single-winner election with a ranked ballot and an understandable count. Before opening it, the organizer would publish the candidate list, method, closing time, eligibility and repeat-vote policy, tie handling, and rules for incomplete rankings. Those rules would stay fixed throughout the vote.

The interface should let participants review their order before submitting and inspect each counting round afterward. Tests should cover transfers, exhausted ballots, ties, incomplete rankings and small examples whose outcomes can be checked by hand. Agent submissions would use the same ballot format and permissions as the browser.

Sign-in is already working, but it does not establish one person, one vote. The present experiment permits repeated submissions. Moving to an election of a person also requires an explicit decision about who can participate and whether a later ballot replaces an earlier one.

The public record checker verifies signed records and receipt inclusion. An independently verifiable tally is a separate research task, described in the [security appendix](/appendix-security.html).
