# October 20, 2026 — The argument and the next experiment

Vote Anyway is an argument for digital voting. The homepage now says so directly, and invites people to read the argument before trying the experiment. “Democracy, more often” remains the larger possibility: participation that fits into more of our lives.

The working site lets people sign in, create a topic with a question and fixed choices, and share its ballot. A participant chooses one option, reviews it, and receives a receipt for an encrypted record. People can inspect the signed public record and authorize an agent with explicit, revocable permissions. Sign-in has been confirmed on the public site.

Each app page now has a shareable address. Refreshing, going Back and Forward, or following a topic’s receipt link preserves the intended destination. The interface and reading pages follow the system’s light or dark appearance.

The Research & sources page brings the three companion appendices and the eleven appendix sections of the fuller outline together. Their citations and credits remain part of the work. The essay and original appendix prose have been preserved.

The next proposed experiment asks how we might elect a person without throwing away second preferences. The voting-method note explains single-winner ranked-choice runoffs with a worked example, compares alternatives, and cites research on the limits. Ranked ballots and automatic runoffs are not yet implemented. We first need explicit rules for eligibility, repeat or replacement votes, closing, ties and incomplete rankings.

Today’s counts are submissions, not unique voters; repeat participation is allowed. The operator can decrypt ballots and computes totals. Signed-record checks establish integrity and receipt inclusion, while independent tally verification remains further work. The existing Where we are page distinguishes these working features, limits and next steps.

The latest feature release passed its build, automated repository checks, direct-link and browser-history checks, appendix-link checks, authentication gates and preservation of the existing signed ballot record across deployment. Earlier isolated-database tests cover concurrency, topic isolation, authentication and scoped agent permissions.

For continuing development, the repository’s [handoff guide](https://github.com/anselm/vote-anyway/blob/main/docs/HANDOFF.md) records the code map, preserved sources, deployment procedure, verification evidence and remaining work. Its [AGENTS.md](https://github.com/anselm/vote-anyway/blob/main/AGENTS.md) directs coding assistants to read that guide and this log before making changes.
