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
