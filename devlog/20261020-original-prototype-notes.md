# Original prototype, October 20, 2026

`original-prototype-20261020/` preserves source from Anselm's supplied `vote-anyway-project-20261020 (14).zip`. All 29 archive entries were inspected; `data/keys.json` and `data/board.json` were deliberately excluded. Source files are unchanged. Generated keys and ballots must remain local and ignored.

This is a functioning reference implementation with filesystem persistence. It is not deployed on Cloud Run and is not the current Svelte/Fastify practice application. Port its capabilities to transactional storage before public deployment; see `../todo.md`.

Run its original tests from the repository root with `npm run test:original`. They use an isolated temporary data directory and generate fresh test keys. The original tests passed on import.

The archive's essay and development log match the separately supplied originals byte for byte. The three published appendices are also copied unchanged into the current site's `content/appendices/`. Original design notes are restored into `docs/`.

The earlier exploratory research notebook is a different document: `../devlog/20261020-working-sketch-v0.4.md`. It includes eleven draft appendix sections, candidate prose, citations, open questions, and version history. It was recovered from the original chat's rendered document; the transfer was checked for intact text, but byte identity with the original downloadable file has not been established.
