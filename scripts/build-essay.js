import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { marked } from 'marked';
// Stable anchors preserve the recovered notebook's original internal links.
marked.use({renderer:{heading({tokens,depth,text}){const label=text.replace(/<[^>]*>/g,'').replace(/[*_`]/g,'');const id=label.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s/g,'-');return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;}}});
const source=await readFile(new URL('../devlog/20261101-vote-anyway.md',import.meta.url),'utf8');
// Render only the tracked author-controlled source, never visitor-supplied Markdown.
const body=marked.parse(source);
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vote Anyway — Essay</title><link rel="stylesheet" href="/theme.css"><style>body{margin:0;background:var(--civic-paper);color:var(--civic-ink);font-family:Georgia,serif}header,article{max-width:720px;margin:auto;padding:24px}header{font:14px Arial,sans-serif;border-top:3px solid var(--civic-accent);border-bottom:1px solid var(--civic-rule)}a{color:var(--civic-accent)}article{font-size:19px;line-height:1.8}h1{font-size:64px;letter-spacing:-3px;line-height:1.1}h2{border-top:1px solid var(--civic-rule);padding-top:24px;margin-top:60px;font-size:32px;line-height:1.3}h3{margin-top:40px;font-size:24px;line-height:1.4}.note{font:13px/1.7 Arial,sans-serif;background:var(--civic-surface);padding:18px;border-left:3px solid var(--civic-accent)}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:var(--civic-surface);padding:16px;font-size:14px}a:focus-visible{outline:3px solid var(--civic-focus);outline-offset:4px}table{display:block;overflow-x:auto;border-collapse:collapse;font:14px/1.6 Arial,sans-serif}th,td{padding:12px;border:1px solid var(--civic-rule);text-align:left;min-width:80px}li{margin-bottom:12px}img{max-width:100%;height:auto}figure{margin:24px 0}figcaption{font:13px/1.6 Arial,sans-serif;color:var(--civic-ink)}footer{padding:30px 0;font:13px Arial,sans-serif}@media(max-width:600px){article{font-size:17px}h1{font-size:48px}}</style></head><body><header><a href="/">← Vote Anyway</a> · Essay · <a href="/research.html">Research &amp; sources</a> · <a href="/about#where-we-are">Where we are</a></header><article>${body}<footer><p><a href="/appendix-collective-decisions.html">Further reading: Ways of deciding together</a></p><a href="/vote-anyway.md" download>Download Markdown source</a> · <a href="https://github.com/anselm/vote-anyway/tree/main/devlog">Essay history on GitHub</a></footer></article></body></html>`;
await writeFile(new URL('../dist/essay.html',import.meta.url),html);
await writeFile(new URL('../dist/vote-anyway.md',import.meta.url),source);
// Keep the original download URL and archived draft unchanged.
await writeFile(new URL('../dist/vote-anyway-first-draft.md',import.meta.url),await readFile(new URL('../devlog/20261020-essay-first-draft.md',import.meta.url),'utf8'));
// The essay's lab link opens the same Svelte experience as the homepage.
await writeFile(new URL('../dist/lab.html',import.meta.url),await readFile(new URL('../dist/index.html',import.meta.url)));

// Publish chronological project records, including the unedited essay snapshot.
await mkdir(new URL('../dist/devlog/',import.meta.url),{recursive:true});
const entries=[];
for(const filename of ['20261020-first-draft.md','20261020-combined-app.md','20261020-topics-and-agents.md','20261020-digital-voting-and-next-steps.md','20261020-ways-of-deciding.md','20261101-paper-proofs-and-participation.md','20261020-working-sketch-v0.4.md','20261020-essay-first-draft.md','20261101-vote-anyway.md','20261101-substack-vote-anyway.md','20261101-one-timeline.md','20261101-public-ledgers-and-enfranchisement.md'].sort()){
  const markdown=await readFile(new URL('../devlog/'+filename,import.meta.url),'utf8');
  const title=markdown.split('\n').find(line=>line.startsWith('# '))?.slice(2)||filename;
  const slug=filename.slice(0,-3);
  const displayTitle=filename==='20261101-vote-anyway.md'?'November 1, 2026 — Vote Anyway, the essay':filename==='20261101-substack-vote-anyway.md'?'November 1, 2026 — Vote Anyway, the Substack introduction':filename==='20261020-essay-first-draft.md'?'October 20, 2026 — Essay first draft':filename==='20261020-working-sketch-v0.4.md'?'October 20, 2026 — Working essay sketch v0.4 (with research appendices)':title;
  entries.push({slug,title:displayTitle});
  const page=html.replace('<title>Vote Anyway — Essay</title>','<title>'+displayTitle+' — Vote Anyway</title>').replace(' · Essay',' · <a href="/devlog.html">Development log</a>');
  const start=page.indexOf('<article>'),end=page.indexOf('</article>');
  const note=filename==='20261020-essay-first-draft.md'?'<aside class="note">Essay draft · October 20, 2026</aside>':'';
  await writeFile(new URL('../dist/devlog/'+slug+'.html',import.meta.url),page.slice(0,start)+'<article>'+note+marked.parse(markdown)+'<footer><a href="/devlog.html">← All development entries</a></footer>'+page.slice(end));
}
// Preserve the full original HTML on disk; publish its article in the common reading shell.
const originalSubstack=await readFile(new URL('../devlog/20261028-substack-original/substack-vote-anyway.html',import.meta.url),'utf8');
const originalBody=originalSubstack.match(/<article>([\s\S]*?)<\/article>/)?.[1];
if(!originalBody)throw new Error('Original Substack article is missing');
const originalSlug='20261028-substack-original';
const originalTitle='October 28, 2026 — Vote Anyway, original Substack article';
const originalStart=html.indexOf('<article>'),originalEnd=html.indexOf('</article>');
await writeFile(new URL('../dist/devlog/'+originalSlug+'.html',import.meta.url),html.slice(0,originalStart).replace('<title>Vote Anyway — Essay</title>','<title>'+originalTitle+'</title>').replace(' · Essay',' · <a href="/devlog.html">Development log</a>')+'<article><aside class="note">Published October 28, 2026; preserved November 1 before revision. <a href="/devlog/20261101-substack-vote-anyway.html">Later Substack version</a> · <a href="/essay.html">Current essay</a></aside>'+originalBody.replace(/<button\b[\s\S]*?<\/button>/g,'')+'<footer><a href="/devlog.html">← All development entries</a></footer>'+html.slice(originalEnd));
entries.push({slug:originalSlug,title:originalTitle});
entries.sort((a,b)=>a.slug.localeCompare(b.slug));
const list='<h1>Development log</h1><p>From an argument about participation to a public experiment: the questions, design choices, and evidence as Vote Anyway develops.</p><p>Dated entries keep the writing, experiments and decisions in one timeline. Earlier versions stay available alongside later thinking. <a href="https://github.com/anselm/vote-anyway/tree/main/devlog">The complete repository timeline</a> also includes code snapshots and technical notes.</p><ul>'+entries.map(entry=>'<li><a href="/devlog/'+entry.slug+'.html">'+entry.title+'</a></li>').join('')+'</ul>';
const start=html.indexOf('<article>'),end=html.indexOf('</article>');
await writeFile(new URL('../dist/devlog.html',import.meta.url),html.slice(0,start).replace('<title>Vote Anyway — Essay</title>','<title>Development log — Vote Anyway</title>').replace(' · Essay',' · Development log')+'<article>'+list+html.slice(end));

// Publish the original companion appendices and subsequent research additions.
for(const [sourceName,pageName] of [['security','appendix-security'],['democracy','appendix-democracy'],['prototype','appendix-prototype'],['collective-decisions','appendix-collective-decisions'],['community-voting','appendix-community-voting']]){
  const markdown=await readFile(new URL('../content/appendices/'+sourceName+'.md',import.meta.url),'utf8');
  const title=markdown.split('\n')[0].replace(/^# /,'');
  const start=html.indexOf('<article>'),end=html.indexOf('</article>');
  await writeFile(new URL('../dist/'+pageName+'.html',import.meta.url),html.slice(0,start).replace('<title>Vote Anyway — Essay</title>','<title>'+title+' — Vote Anyway</title>')+'<article>'+marked.parse(markdown)+'<footer><a href="/research.html">All appendices &amp; sources</a> · <a href="/appendix-collective-decisions.html">Ways of deciding together</a> · <a href="/essay.html">Essay</a></footer>'+html.slice(end));
}

for(const name of ['verify-log.mjs','verify-board.mjs'])await writeFile(new URL('../dist/'+name,import.meta.url),await readFile(new URL('./'+name,import.meta.url)));

await writeFile(new URL('../dist/agent.html',import.meta.url),await readFile(new URL('../dist/index.html',import.meta.url)));
for(const name of ['agent.mjs','auth-sign.mjs'])await writeFile(new URL('../dist/'+name,import.meta.url),await readFile(new URL('./'+name,import.meta.url)));
await mkdir(new URL('../dist/attest/',import.meta.url),{recursive:true});
for(const name of ['client.mjs','verify.mjs','cid.mjs','LICENSE'])await writeFile(new URL('../dist/attest/'+name,import.meta.url),await readFile(new URL('./attest/'+name,import.meta.url)));
const agentGuide=await readFile(new URL('../devlog/20261020-agent-interface.md',import.meta.url),'utf8');
await writeFile(new URL('../dist/llms.txt',import.meta.url),agentGuide);
await writeFile(new URL('../dist/agents.html',import.meta.url),html.slice(0,start).replace('Vote Anyway — Essay','Vote Anyway — For agents').replace(' · Essay',' · For agents')+'<article>'+marked.parse(agentGuide)+html.slice(end));
// Vite copies the machine-readable API schema from public/openapi.json.

await writeFile(new URL('../dist/theme.css',import.meta.url),await readFile(new URL('../src/theme.css',import.meta.url)));

// Supporting research and current design notes; historical essay sources stay intact.
for (const name of ['research','voting-methods']) {
  const markdown=await readFile(new URL('../content/'+name+'.md',import.meta.url),'utf8');
  const title=markdown.split('\n')[0].replace(/^# /,'');
  const shell=html.slice(0,start).replace('Vote Anyway — Essay',title+' — Vote Anyway').replace(' · Essay',' · <a href="/essay.html">Essay</a>');
  await writeFile(new URL('../dist/'+name+'.html',import.meta.url),shell+'<article>'+marked.parse(markdown)+html.slice(end));
}
