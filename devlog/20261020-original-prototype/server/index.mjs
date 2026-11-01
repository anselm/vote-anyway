import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {election,initializeStore,loadBoard,submitBallot,getTotals} from './voting.mjs';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const siteRoot=path.join(projectRoot,'public');
const store=initializeStore(process.env.VOTE_ANYWAY_DATA_DIR || path.join(projectRoot,'data'));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml'};
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function header(res){res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");}
function sendFile(req,res,url){
  const routes={'/':'/index.html','/essay':'/essay.html','/lab':'/lab.html','/devlog':'/devlog.html','/research':'/appendix-security.html'};
  const pathname=routes[url.pathname]||url.pathname;
  let decoded; try{decoded=decodeURIComponent(pathname);}catch{return json(res,400,{error:'Invalid path'});}
  const file=path.resolve(siteRoot,'.'+decoded);
  if(!file.startsWith(siteRoot+path.sep)) return json(res,403,{error:'Forbidden'});
  fs.readFile(file,(err,bytes)=>{
    if(err)return json(res,404,{error:'Not found'});
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':file.endsWith('.html')?'no-store':'public, max-age=60'});
    res.end(bytes);
  });
}
export const server=http.createServer(async(req,res)=>{
  header(res);
  const url=new URL(req.url,'http://localhost');
  try {
    if(req.method==='GET'&&url.pathname==='/api/config')return json(res,200,{election,encryptionPublicKey:store.keys.encryptionPublicKey,signingPublicKey:store.keys.signingPublicKey});
    if(req.method==='GET'&&url.pathname==='/api/signing-key.pem'){res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'});return res.end(store.keys.signingPublicKey);}
    if(req.method==='GET'&&url.pathname==='/api/board')return json(res,200,{electionId:election.id,records:loadBoard(store)});
    if(req.method==='GET'&&url.pathname==='/api/results')return json(res,200,getTotals(store));
    if(req.method==='GET'&&url.pathname==='/api/receipt'){
      const receipt=url.searchParams.get('receipt');
      if(!receipt||!/^[0-9a-f]{64}$/.test(receipt))return json(res,400,{error:'Invalid receipt'});
      const row=loadBoard(store).find(x=>x.receipt===receipt);
      return json(res,200,{found:!!row,index:row?.index||null,notice:'Server lookup only. For independent verification use the downloaded record and verification key.'});
    }
    if(req.method==='POST'&&url.pathname==='/api/vote'){
      let body=''; for await (const chunk of req){body+=chunk.toString('utf8');if(body.length>3000)throw Object.assign(new Error('Payload too large'),{statusCode:413});}
      let input;try{input=JSON.parse(body)}catch{throw Object.assign(new Error('Invalid JSON'),{statusCode:400});}
      return json(res,201,{...submitBallot(store,input?.ciphertext),disclaimer:election.disclaimer});
    }
    if(req.method==='GET')return sendFile(req,res,url);
    return json(res,405,{error:'Method not allowed'});
  }catch(err){return json(res,err.statusCode||500,{error:err.statusCode?err.message:'Internal server error'});}
});
if(process.env.NODE_ENV!=='test'){
  const port=Number(process.env.PORT||3000);
  server.listen(port,'0.0.0.0',()=>console.log(`Vote Anyway research site listening on http://localhost:${port}`));
}
