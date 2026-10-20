#!/usr/bin/env python3
"""Build self-contained HTML pages from Markdown sources (pip install mistune)."""
from pathlib import Path
import html
import mistune

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'public'
markdown=mistune.create_markdown(plugins=['table','strikethrough'])

NAV='''<header class="topbar"><nav class="nav" aria-label="Primary"><a class="brand" href="/">VOTE<b> ANYWAY</b></a><div class="navlinks"><a href="/essay.html">Essay</a><a href="/appendix-security.html">Research</a><a href="/devlog.html">Devlog</a><a class="action" href="/lab.html">Try the lab →</a></div></nav></header>'''
FOOT='''<footer class="sitefoot"><div class="wrap"><span>Vote Anyway · Open research, not an election authority</span><span><a href="/essay.html">Essay</a> · <a href="/appendix-security.html">Appendices</a> · <a href="/devlog.html">Devlog</a></span></div></footer>'''
SOURCES=[
 ('content/essays/vote-anyway.md','essay.html','The essay · Vote Anyway','ESSAY · FIRST DRAFT · 2026-10-20'),
 ('content/appendices/security.md','appendix-security.html','Voting security · Vote Anyway','RESEARCH APPENDIX A'),
 ('content/appendices/democracy.md','appendix-democracy.html','Delegation and participation · Vote Anyway','RESEARCH APPENDIX B'),
 ('content/appendices/prototype.md','appendix-prototype.html','Prototype design · Vote Anyway','RESEARCH APPENDIX C'),
 ('devlog/20261020-first-draft.md','devlog.html','Development log · Vote Anyway','PUBLIC DEVELOPMENT JOURNAL'),
]
for src,dest,title,kind in SOURCES:
  body=markdown((ROOT/src).read_text())
  page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html.escape(title)}</title><link rel="stylesheet" href="/style.css"></head><body>{NAV}<main class="article"><div class="paperhead"><span class="kicker">{kind}</span><div class="subnav"><a href="/">← Vote Anyway</a> · <a href="/appendix-security.html">Security</a> · <a href="/appendix-democracy.html">Democracy</a> · <a href="/appendix-prototype.html">Prototype</a></div></div>{body}</main>{FOOT}</body></html>'''
  (SITE/dest).write_text(page)
  print('Built',dest)
