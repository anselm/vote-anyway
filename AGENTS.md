# Continuing Vote Anyway

The canonical checkout is `/Volumes/summer/projects/2026/vote-anyway`. Reuse it and inspect Git state before changes.

Read these dated entries before continuing; their roles are explicit rather than inferred from filenames:

- [November 1 continuation](devlog/20261101-continuation.md): current implementation, source map, limits and pending work.
- [November 1 project direction](devlog/20261101-project-direction.md): what the project is trying to achieve.
- [November 1 timeline decision](devlog/20261101-one-timeline.md): how to curate this project's history.
- [November 1 deployment instructions](devlog/20261101-deployment.md): existing infrastructure, safe candidate checks and promotion. Read before deployment or database work; inspect actual service traffic.
- [October 20 implementation comparison](devlog/20261020-implementation-audit.md): why the current app combines ideas from both prototypes. Historical analysis, not a current feature inventory.

## A route through the thinking

Use `devlog/YYYYMMDD-description.md` for writing, decisions, investigations and guidance; a dated folder is appropriate for a coherent multi-file snapshot. Dates come first for command-line sorting. Avoid parallel essay, docs, reference, revisions or old-docs stores. Machine-required files and runtime code/assets stay where their tools need them.

The devlog is a curated route map, not an exhaustive ledger. Its reader should be able to speedrun the development thinking: motivation, experiments, major turns, failed directions, and the current position. Retroactive entries, amendments, consolidation and pruning are welcome when they improve that route. A failed exploration may need only a sentence explaining why it was abandoned. Git retains the exhaustive history. Do not impose append-only rules or duplicate every change into prose.

Explain an entry's date, purpose and relation to later thinking when those are not obvious. Dates indicate sequence, not authority. Keep this entry point and README links current when guidance changes. Check facts against code and deployment evidence; distinguish implemented features, proposals and abandoned approaches. `todo.md` is the backlog.

Preserve Anselm's original writing, appendices and requested prototype snapshot as intentional artifacts, including `devlog/20261020-original-prototype/`; curate the surrounding narrative without silently changing their contents. Current essay source is `devlog/20261101-vote-anyway.md`, selected by `scripts/build-essay.js`. Preserve public URLs when selecting a later version. Public devlog entries are explicitly curated in that build script; repository notes are not automatically published.

## Boundaries

- Preserve Anselm's voice and emotional progression. Substack can be fervent; the formal essay can be more equanimous. Keep the photograph, Yeats poem and “systems with no center.” Do not add alarming migration notices to reader-facing prose.
- Keep the restrained civic palette, system light/dark support, credited homepage photograph, ordinary shareable URLs and working attest.monster authentication.
- Sign-in is not voter eligibility or one-person-one-vote. Repeat submissions are allowed. The operator can decrypt ballots and computes totals. Signed-record checks do not prove ballot intent or the tally. Ranked voting remains proposed.
- Never print or commit credentials, private keys or dotenv files. Never regenerate production voting keys for existing elections. Database tests and migrations need an explicitly verified isolated environment; the old test branch has expired.
- Do not spawn subagents unless Anselm requests delegation.

After meaningful work, record the decisions, relevant verification, remaining uncertainty and deployment state in the timeline; update entry-point links and the backlog as needed. Keep this useful and proportionate, not ceremonial.
