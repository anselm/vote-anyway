# Vote Anyway

**Democratic infrastructure as a public experiment.** This repository contains a short essay, research appendices, a public development log, and a small **unofficial** internet-voting research prototype.

**Nothing on this site casts, changes, or confirms an official election ballot.** The initial sample question is fictional. Results reflect only volunteers using this experimental software and must not be compared to an official election as an audit or representative poll.

## Run locally

Requires **Node.js 22+**. No install step or external dependencies are needed.

```bash
npm start
# Open http://localhost:3000
```

To run tests:

```bash
npm test
```

Optional: edit Markdown content under `content/` and regenerate the static HTML pages:

```bash
python -m pip install mistune
python scripts/build-pages.py
```

`public/*.html` are committed prebuilt, so Python is not needed to serve the site.

## Project structure

- `content/essays/vote-anyway.md`: main essay — short, readable argument, published through the site.
- `content/appendices/`: deeper research and sources.
- `devlog/20261020-first-draft.md`: first dated development log.
- `docs/threat-model.md`: precisely what this research prototype does and doesn't establish.
- `server/`: dependency-free Node HTTP server, encrypted-ballot storage, signed public log.
- `public/`: prebuilt editorial pages plus the voting UI.
- `scripts/verify-log.mjs`: independent log/receipt verifier (not a tally verifier).
- `test/`: API and tamper-detection tests.

## Current prototype: research stage 0.5

1. Browser encrypts a ballot using a server-published RSA-OAEP public key.
2. Server validates a decrypted choice and adds **only ciphertext** to a locally persisted append-only *application-level* log.
3. Each published record has a SHA-256 hash link and Ed25519 signature; a non-revealing receipt is derived from the ciphertext hash.
4. Anyone can download the public log and independently verify signatures, the hash chain, and receipt inclusion.
5. The server decrypts ballots to compute totals. **This tally is NOT independently cryptographically verifiable.** The server holds the decryption key, and volunteers are not unique/eligible verified voters.

This design does **not** establish end-to-end verifiability, coercion resistance, anonymous eligibility credentials, anti-stuffing, secure client intent, or protection from a malicious host replacing the entire log. The server can decrypt individual votes and may be able to correlate timing or network metadata. See [threat model](docs/threat-model.md).

For a real remote-voting protocol, review published designs such as [ElectionGuard](https://electionguard.vote/spec/) and [Helios](https://www.heliosvoting.org/). Do not replace their protocol designs with this illustrative implementation.

## Roadmap

- [x] Public essay and appendices in site
- [x] Fictional mobile ballot and local Node server
- [x] Encrypted ballot submission, tracker, signed bulletin-board log
- [x] Offline integrity/receipt checker
- [ ] Independent *cast-as-intended* check or ballot challenge protocol
- [ ] Independently provable tally and separation of encryption/decryption trustees
- [ ] Stronger bulletin-board consistency (witnesses and checkpoint publishing)
- [ ] Eligibility, one-person-one-vote, recovery and formal privacy review
- [ ] Coercion-resistance research (including private revoting and deniable credentials)
- [ ] Smartocracy delegation sandbox; alternative counting methods
- [ ] Authoritative-ballot import with precise source attribution and non-affiliation notices
- [ ] Independent review and public demo deployment

## GitHub destination

Intended repository: https://github.com/anselm/vote-anyway

This package is prepared to commit. At initial creation the repository could not be found via the connected GitHub integration; no remote push or deployment is implied.

## Independent log-integrity check

After running the site and casting a fictional vote, export the record and the public key:

```bash
curl -s http://localhost:3000/api/board > /tmp/board.json
curl -s http://localhost:3000/api/signing-key.pem > /tmp/signing-key.pem
node scripts/verify-log.mjs /tmp/board.json /tmp/signing-key.pem <receipt-hex>
```

**Trust boundary:** obtaining both artifacts from the same potentially malicious server does not prove that it showed everyone the same history, or that the signing key is authentic. For serious assurance, compare a pinned public key and signed history checkpoints distributed independently.

## Container deployment

```bash
docker build -t vote-anyway .
docker run --rm -p 3000:3000 -v vote-anyway-data:/app/data vote-anyway
```

Do not expose this research-only server on a public host as a secure election system. Add rate controls and a serious privacy/deployment review before any public demonstration with live participants. No public deployment has yet been performed.

## Publish to the intended GitHub repository

Once `anselm/vote-anyway` has been created in GitHub (the connected repository was not found when this package was prepared):

```bash
git init -b main
git add .
git commit -m "Start Vote Anyway essay and research voting lab"
git remote add origin git@github.com:anselm/vote-anyway.git
git push -u origin main
```

The website and essays are part of the same repository. Markdown is the source for published text; prebuilt static pages are committed for no-build deployment. The first changelog entry is `devlog/20261020-first-draft.md`.

## License

Not yet selected; please choose a source-code and content license before public redistribution.
