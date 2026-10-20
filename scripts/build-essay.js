import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { marked } from 'marked';
// Stable anchors preserve the recovered notebook's original internal links.
marked.use({renderer:{heading({tokens,depth,text}){const label=text.replace(/<[^>]*>/g,'').replace(/[*_`]/g,'');const id=label.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s/g,'-');return `<h${depth} id="${id}">${this.parser.parseInline(tokens)}</h${depth}>\n`;}}});
const source=await readFile(new URL('../essay/vote-anyway-first-draft.md',import.meta.url),'utf8');
// Render only the tracked author-controlled source, never visitor-supplied Markdown.
const body=marked.parse(source);
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Vote Anyway — Essay</title><style>body{margin:0;background:#f7f2e8;color:#20334d;font-family:Georgia,serif}header,article{max-width:720px;margin:auto;padding:24px}header{font:14px Arial,sans-serif;border-top:3px solid #98534d;border-bottom:1px solid #c9c3b8}a{color:#98534d}article{font-size:19px;line-height:1.8}h1{font-size:64px;letter-spacing:-3px;line-height:1.1}h2{border-top:1px solid #c9c3b8;padding-top:24px;margin-top:60px;font-size:32px;line-height:1.3}h3{margin-top:40px;font-size:24px;line-height:1.4}.note{font:13px/1.7 Arial,sans-serif;background:#eee9df;padding:18px;border-left:3px solid #98534d}table{display:block;overflow-x:auto;border-collapse:collapse;font:14px/1.6 Arial,sans-serif}th,td{padding:12px;border:1px solid #c9c3b8;text-align:left;min-width:150px}li{margin-bottom:12px}footer{padding:30px 0;font:13px Arial,sans-serif}@media(max-width:600px){article{font-size:17px}h1{font-size:48px}}</style></head><body><header><a href="/">← Vote Anyway</a> · Essay</header><article>${body}<footer><a href="/vote-anyway-first-draft.md" download>Download Markdown source</a> · <a href="https://github.com/anselm/vote-anyway/tree/main/essay">Essay history on GitHub</a></footer></article></body></html>`;
await writeFile(new URL('../dist/essay.html',import.meta.url),html);
await writeFile(new URL('../dist/vote-anyway-first-draft.md',import.meta.url),source);
// The essay's lab link opens the same Svelte experience as the homepage.
await writeFile(new URL('../dist/lab.html',import.meta.url),await readFile(new URL('../dist/index.html',import.meta.url)));

// Publish chronological project records, including the unedited essay snapshot.
await mkdir(new URL('../dist/devlog/',import.meta.url),{recursive:true});
const entries=[];
for(const filename of (await readdir(new URL('../devlog/',import.meta.url))).filter(name=>name.endsWith('.md')).sort().reverse()){
  const markdown=await readFile(new URL('../devlog/'+filename,import.meta.url),'utf8');
  const title=markdown.split('\n').find(line=>line.startsWith('# '))?.slice(2)||filename;
  const slug=filename.slice(0,-3);
  const displayTitle=filename==='20261020-essay-first-draft.md'?'October 20, 2026 — Essay first draft':filename==='20261020-working-sketch-v0.4.md'?'October 20, 2026 — Working essay sketch v0.4 (with research appendices)':title;
  entries.push({slug,title:displayTitle});
  const page=html.replace('<title>Vote Anyway — Essay</title>','<title>'+displayTitle+' — Vote Anyway</title>').replace(' · Essay',' · <a href="/devlog.html">Development log</a>');
  const start=page.indexOf('<article>'),end=page.indexOf('</article>');
  const note=filename==='20261020-essay-first-draft.md'?'<aside class="note">Essay draft · October 20, 2026</aside>':'';
  await writeFile(new URL('../dist/devlog/'+slug+'.html',import.meta.url),page.slice(0,start)+'<article>'+note+marked.parse(markdown)+'<footer><a href="/devlog.html">← All development entries</a></footer>'+page.slice(end));
}
const list='<h1>Development log</h1><p>The essay, experiments, engineering decisions, and discoveries as they develop.</p><ul>'+entries.map(entry=>'<li><a href="/devlog/'+entry.slug+'.html">'+entry.title+'</a></li>').join('')+'</ul>';
const start=html.indexOf('<article>'),end=html.indexOf('</article>');
await writeFile(new URL('../dist/devlog.html',import.meta.url),html.slice(0,start).replace('<title>Vote Anyway — Essay</title>','<title>Development log — Vote Anyway</title>')+'<article>'+list+html.slice(end));

// Restore the three original published appendices from the supplied source ZIP.
for(const [sourceName,pageName] of [['security','appendix-security'],['democracy','appendix-democracy'],['prototype','appendix-prototype']]){
  const markdown=await readFile(new URL('../content/appendices/'+sourceName+'.md',import.meta.url),'utf8');
  const title=markdown.split('\n')[0].replace(/^# /,'');
  const start=html.indexOf('<article>'),end=html.indexOf('</article>');
  await writeFile(new URL('../dist/'+pageName+'.html',import.meta.url),html.slice(0,start).replace('<title>Vote Anyway — Essay</title>','<title>'+title+' — Vote Anyway</title>')+'<article>'+marked.parse(markdown)+html.slice(end));
}

for(const name of ['verify-log.mjs','verify-board.mjs'])await writeFile(new URL('../dist/'+name,import.meta.url),await readFile(new URL('./'+name,import.meta.url)));
