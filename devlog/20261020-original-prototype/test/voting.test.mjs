import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
import {webcrypto} from 'node:crypto';
import {verifyBoardRecords} from '../server/voting.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
const delay=t=>new Promise(r=>setTimeout(r,t));
const temporaryPort=async()=>await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',reject);s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p));});});

async function start(){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'vote-anyway-test-'));
 const port=await temporaryPort();
 const child=spawn(process.execPath,['server/index.mjs'],{cwd:ROOT,env:{...process.env,PORT:String(port),VOTE_ANYWAY_DATA_DIR:tmp},stdio:['ignore','pipe','pipe']});
 const origin=`http://127.0.0.1:${port}`;
 for(let i=0;i<100;i++){
  if(child.exitCode!==null)throw Error('Server exited unexpectedly');
  try{const r=await fetch(origin+'/api/config');if(r.ok)return{tmp,child,origin};}catch{}
  await delay(40);
 }
 child.kill();throw Error('Server failed to start');
}
const derFromPem=pem=>Buffer.from(pem.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----|\s/g,''),'base64');

await test('experimental vote, receipt, signed record and tampering checks',async()=>{
 const svc=await start();
 try{
  const get=async p=>{const r=await fetch(svc.origin+p);assert.equal(r.status,200);return r.json();};
  const config=await get('/api/config');
  assert.match(config.election.disclaimer,/NOT AN OFFICIAL ELECTION/);
  assert.equal((await fetch(svc.origin+'/lab.html')).status,200);
  assert.equal((await fetch(svc.origin+'/essay.html')).status,200);
  const pub=await webcrypto.subtle.importKey('spki',derFromPem(config.encryptionPublicKey),{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
  const encrypt=async choice=>{
   const data=new TextEncoder().encode(JSON.stringify({electionId:config.election.id,choice,nonce:webcrypto.randomUUID()}));
   return Buffer.from(await webcrypto.subtle.encrypt({name:'RSA-OAEP'},pub,data)).toString('base64');
  };
  const bad=await fetch(svc.origin+'/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ciphertext:await encrypt('invalid-option')})});
  assert.equal(bad.status,400,'reject invalid choice');
  const ciphertext=await encrypt(config.election.options[0].id);
  const cast=()=>fetch(svc.origin+'/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ciphertext})});
  const result=await cast();assert.equal(result.status,201);
  const confirmation=await result.json();assert.match(confirmation.receipt,/^[0-9a-f]{64}$/);
  assert.equal((await cast()).status,409,'reject exact duplicate ciphertext');
  const board=await get('/api/board');assert.equal(board.records.length,1);
  assert.equal(board.records[0].receipt,confirmation.receipt);
  const verifier=verifyBoardRecords(board.records,config.signingPublicKey);
  assert.equal(verifier.ok,true);
  const receipt=await get('/api/receipt?receipt='+confirmation.receipt);assert.equal(receipt.found,true);
  const tallies=await get('/api/results');assert.equal(tallies.total,1);assert.equal(tallies.counts[config.election.options[0].id],1);
  assert.match(tallies.warning,/NOT cryptographically independently verifiable/);
  const tampered=structuredClone(board.records);tampered[0].ciphertext='AAAA';
  assert.equal(verifyBoardRecords(tampered,config.signingPublicKey).ok,false,'detect ciphertext change');
  const missing=structuredClone(board.records);missing[0].previousHash='0'.repeat(63)+'1';
  assert.equal(verifyBoardRecords(missing,config.signingPublicKey).ok,false,'detect hash-chain change');
  const keyfile=JSON.parse(fs.readFileSync(path.join(svc.tmp,'keys.json'),'utf8'));
  assert.equal(keyfile.encryptionPrivateKey.includes('PRIVATE KEY'),true);
  assert.equal(JSON.stringify(board).includes('street-trees'),false,'log contains no plaintext selection');
 }finally{svc.child.kill();fs.rmSync(svc.tmp,{recursive:true,force:true});}
});
