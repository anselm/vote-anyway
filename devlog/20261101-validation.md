# November 1, 2026 — Essay synthesis validation

Scope: current essay source and publication, extended security appendix, new community-voting appendix, research links and a development entry. No application, authentication, ballot, key, schema or counting behavior changed.

## Local evidence

- `npm run build`: passed (116 modules transformed; reading pages generated).
- `npm test`: 7 passed, 0 failed, 3 database tests explicitly skipped. The recorded development database expiry has passed; no production database tests or migrations were run.
- Checked 65 internal reading links and fragment destinations across the changed reading pages.
- Compared the original essay and both historical essay/outline devlogs to Git HEAD: unchanged. Verified current and original Markdown downloads each match their own source.
- `git diff --check`: passed.
- Before deployment, independently verified the public example board and saved its signing key, one-record checkpoint and receipt for post-deployment continuity checking. No ballot or topic was created.
- Original live revision inspected: `vote-anyway-00015-sap`, 100% traffic.

## Release

Candidate `vote-anyway-00017-qod` deployed at zero traffic, then checked at the existing `combined` URL. Promoted that exact revision to 100% and repeated the checks at the canonical public URL. Both passed:

> PASS: release pages match build, original downloads and all eleven outline anchors retained, health, existing signed-record continuity and unsigned-write auth gates.

The paper-voting sections were visually checked in the deployed reader in system dark mode. Typography and links rendered correctly. No styles changed. Rollback target remains the previously serving `vote-anyway-00015-sap`.

## Substack

Full pre-edit article body archived before editing. Owner signed in and explicitly authorized applying the shorter replacement to the existing post. The shorter body and subtitle were applied using Update → Update now after the website release. The public page was opened and verified with the new text and both correct destination links. Existing URL and October 28 publication date retained. No new post, newsletter send, audience change or comment-policy change was made. A screenshot was saved for the user.

## Substack follow-up and direct citations

Restored the original voting-line photo with Yereth Rosen / Alaska Beacon credit, the closing Yeats poem with original line breaks, three original war passages, and “systems with no center.” Verified these on the public Substack page. The short project bridge and essay links remain. Recorded the preference for a fervent Substack and a more equanimous formal essay.

Direct OpenVTC/PCS citations added to the essay and Appendix E. The final timeline release is documented below.

## Dated timeline and personal writing follow-up

Moved top-level docs, essay and reference material into dated devlog entries/folders. Removed only the redundant first-draft copy after proving it matched the existing dated source. Original prototype internals remain unchanged. API schema moved to `public/openapi.json`, where Vite publishes it at the same URL. Updated build, compatibility tests, root reading pointers and cloud upload exclusions. Root guidance adopts Anselm's curated route-map convention, including retroactive entries and pruning; Git retains exhaustive history.

Restored the Flanders Fields riff and the Vancouver / Internet Archive Canada / FutureProof writing note on the public Substack, keeping their original wording and links. Verified the photo, author’s riff, war passages, “systems with no center,” location note and Yeats poem. No newsletter or audience/comment change. The dated Markdown copy reflects the same additions.

- Build: passed; application asset hashes unchanged.
- Offline suite: 7 pass, 0 fail, 3 explicit database skips. Original prototype compatibility suite: 1 pass, 0 fail.
- 32 moved artifacts checked byte-for-byte, including all 27 original-prototype files, the original Substack HTML, original design notes and API schema.
- First-draft download and API schema match their previous committed bytes. Current essay download matches its dated source. New reading-page links and root guidance links resolve. All three direct OpenVTC citations are present.
- Reading pages now render the original Substack photographs. The image policy permits only the two specific Substack image hosts in addition to existing local/data images; script, connection and other directives are unchanged. No ballot, authentication, counting, keys or schema changes.
- Candidate `vote-anyway-00021-ley` passed the expanded release checks at zero traffic, was promoted to 100%, and passed the same checks at the canonical URL. The checks include the four new timeline pages, both Markdown downloads, unchanged API schema and agent guide, all eleven outline anchors, health, signed-record continuity and unsigned-write authentication gates.
- Public timeline and both Substack reading entries checked in the browser; photo loaded successfully and no browser policy errors were reported. Actual Cloud Run traffic inspected after promotion: 100% to revision 21. Rollback target: `vote-anyway-00017-qod`. No production ballot or topic was created.

## Voter-data report and public-ledger clarification

Added the Vescent/Young/Caballero 2019 report to the current essay, Appendix E and research index; added the dated public-ledgers-and-enfranchisement entry. Checked author attribution, the report's explicit scope on p. 3, registration-flow diagram on p. 11 and relevant discussion. Clearly separated the report from our proposed social-trust and public-ledger research. No choice of eligibility policy, ledger or identity provider was made.

Build passed; application asset hashes remained unchanged. Citation presence, reading-page and fragment links, and current/original Markdown downloads passed local checks. No application, authentication, ballot, schema, key or counting behavior changed; database tests were not rerun for this writing-only update. Candidate `vote-anyway-00023-did` passed the release checks at zero traffic, was promoted to 100%, and passed the same checks on the canonical URL. Verified the new dated entry, source/download equality, all eleven outline anchors, service health, existing signed-record continuity and unsigned-write gates. Actual traffic was inspected after promotion. Rollback target: `vote-anyway-00021-ley`.

## National Academies highlights follow-up

Read the complete official three-page September 2018 highlights and visually checked the page 2 recommendations. Expanded the existing National Academies citation in Appendix A; added the supplied PDF link and its deployment/research distinction to the essay, research index and existing paper/proofs devlog entry. No new archive or application behavior.

Build passed with unchanged application asset hashes. Citation presence on all four affected reading pages, local page/fragment destinations, and unchanged first-draft download were checked. No database tests were rerun for this prose-only change. Candidate `vote-anyway-00025-gom` passed the release checks before promotion and again at the canonical URL afterward. Actual traffic was confirmed at 100%. Checks cover built-page equality, original/current downloads, all eleven outline anchors, health, signed-record continuity and unsigned-write authentication gates. Rollback target: `vote-anyway-00023-did`.
