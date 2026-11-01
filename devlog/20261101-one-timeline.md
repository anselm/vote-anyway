# November 1, 2026 — A route through the thinking

A development log should let someone speedrun the thinking behind a project. Read in order, it should show what we wanted, the ideas we tried, the major turns, and how we arrived at the current work.

That is a different job from keeping a perfect record of everything. Git already keeps that history. The devlog is a curated route map through an exploration: later entries can amend an argument, an earlier entry can be added retrospectively, and an unhelpful detour can be shortened or removed. Sometimes the useful residue of a failed experiment is simply why that direction did not work.

We are bringing the writing, historical prototypes and project notes into one dated timeline. Dates go first so a directory listing has a useful order. A single piece can be `20261101-vote-anyway.md`; a snapshot with several files can be `20261020-original-prototype/`. The snapshot keeps its own internal structure. We use the date of the work when known and explain a later capture or retrospective addition where that distinction matters.

A name such as “ARCHITECTURE” does not tell a reader whether a document describes the present system, an abandoned proposal, or an earlier experiment. Our former architecture note describes the first receipt-only app. It now sits at its October 20 point in the timeline; the later implementation comparison and current continuation entry explain what followed. Meaning comes from those relationships, not capitalization.

The repository's small [entry point](https://github.com/anselm/vote-anyway/blob/main/README.md) links the presently applicable guidance and explains its role. Those links must move when the thinking changes. Stable reader URLs remain: [the essay](/essay.html) draws from a dated source, and its [first draft](/devlog/20261020-essay-first-draft.html), [working outline with appendices](/devlog/20261020-working-sketch-v0.4.html), [original Substack article](/devlog/20261028-substack-original.html) and [revised introduction](/devlog/20261101-substack-vote-anyway.html) remain part of the route.

The Substack keeps the photograph, the opening Flanders Fields riff, the Vancouver / Internet Archive Canada / FutureProof writing note, the closing Yeats poem, the urgency of the argument about war, and “systems with no center.” The fuller essay can be more equanimous. It now directly cites [OpenVTC](https://github.com/OpenVTC/openvtc), its [Predicate Credential System](https://github.com/OpenVTC/predicate-credential-system), and its [zero-knowledge work](https://openvtc.github.io/wiki/concepts/zero-knowledge-proofs).

For the application, the next proposed step is a complete small-group election: rules about membership, replacing a vote, closing and results. Private eligibility proofs and independently verifiable counting are related but distinct research tasks. Ranked runoff and portable evidence are further parts of that work. None of those proposals is an implemented feature in this writing release.

The same convention applies beyond Vote Anyway: keep the route legible, make current guidance discoverable, and leave enough context for someone else to continue. Add structure only when it reduces the effort of understanding the work.
