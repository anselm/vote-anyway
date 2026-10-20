import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {election,generateKeys,createRecord,decodeBallot,validateKeys} from '../server/protocol.js';
import {encryptBallot,verifyBoard} from '../src/ballot.js';
import {votingStore} from '../server/voting-store.js';
import {createApp} from '../server/app.js';
const keys=generateKeys(),config={election,...keys};
test('original format, WebCrypto round trip, tampering and checkpoint continuity',async()=>{
 validateKeys(keys);
 const a=await encryptBallot(config,'street-trees'),b=await encryptBallot(config,'crosswalks');
 assert.equal(decodeBallot(a.ciphertext,keys).choice,'street-trees');
 assert.throws(()=>decodeBallot('A'.repeat(344),keys));
 const invalid=await encryptBallot(config,'invalid-choice');assert.throws(()=>decodeBallot(invalid.ciphertext,keys));
 const r1=createRecord(a.ciphertext,1,'0'.repeat(64),keys),r2=createRecord(b.ciphertext,2,r1.hash,keys);
 const board={electionId:election.id,records:[r1,r2]};
 const checkpoint=await verifyBoard(board,keys.signingPublicKey,election.id,null,a.receipt);
 assert.equal(checkpoint.count,2);
 await assert.rejects(verifyBoard({...board,records:[r1]},keys.signingPublicKey,election.id,checkpoint),/shorter/);
 await assert.rejects(verifyBoard({...board,records:[]},keys.signingPublicKey,election.id,checkpoint),/shorter/);
 await assert.rejects(verifyBoard({...board,electionId:'foreign'},keys.signingPublicKey,election.id),/Unexpected/);
 await assert.rejects(verifyBoard(board,generateKeys().signingPublicKey,election.id,checkpoint));
 const corrupt=structuredClone(board);corrupt.records[0].ciphertext=b.ciphertext;
 await assert.rejects(verifyBoard(corrupt,keys.signingPublicKey,election.id));
 const fork=createRecord(b.ciphertext,1,'0'.repeat(64),keys);
 await assert.rejects(verifyBoard({electionId:election.id,records:[fork]},keys.signingPublicKey,election.id,{...checkpoint,count:1,head:r1.hash}),/conflicts/);
 const dir=await mkdtemp(join(tmpdir(),'vote-compat-'));
 try{
  await writeFile(join(dir,'board.json'),JSON.stringify(board));await writeFile(join(dir,'key.pem'),keys.signingPublicKey);
  for(const script of ['reference/original-prototype-20261020/scripts/verify-log.mjs','scripts/verify-log.mjs']){
   const check=spawnSync(process.execPath,[script,join(dir,'board.json'),join(dir,'key.pem'),a.receipt],{encoding:'utf8'});assert.equal(check.status,0,check.stderr);assert.match(check.stdout,/VALID record integrity/);
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('lab unavailable is explicit',async()=>{const app=await createApp({staticFiles:false});try{assert.equal((await app.inject('/api/board')).statusCode,503);}finally{await app.close();}});
test('Neon concurrent writes, duplicate rollback, API, restart and key continuity',{skip:!process.env.BALLOT_TEST_DATABASE_URL},async()=>{
 const url=process.env.BALLOT_TEST_DATABASE_URL,testKeys=JSON.parse(process.env.BALLOT_TEST_KEYS);
 let a,b,c,app;
 try{
  a=await votingStore(url,testKeys);b=await votingStore(url,testKeys);
  const before=(await a.board()).records.length;
  const localConfig={election,...testKeys};
  const encrypted=await Promise.all(Array.from({length:12},(_,i)=>encryptBallot(localConfig,election.options[i%3].id)));
  const results=await Promise.all(encrypted.map((e,i)=>(i%2?a:b).submit(e.ciphertext)));
  assert.equal(new Set(results.map(r=>r.index)).size,12);
  await assert.rejects(a.submit(encrypted[0].ciphertext),e=>e.statusCode===409);
  const board=await b.board();assert.equal(board.records.length,before+12);
  assert.equal((await b.totals()).total,before+12);
  await verifyBoard(board,testKeys.signingPublicKey,election.id,results[0].checkpoint,encrypted[0].receipt);
  app=await createApp({authenticate:async()=>({kind:'session',root:'test'}),voting:b,staticFiles:false});
  assert.equal((await app.inject('/api/config')).json().election.id,election.id);
  assert.equal((await app.inject('/api/receipt?receipt='+encrypted[0].receipt)).json().found,true);
  assert.equal((await app.inject({method:'POST',url:'/api/vote',payload:{ciphertext:encrypted[0].ciphertext}})).statusCode,409);
  const next=await encryptBallot(localConfig,'rain-gardens');
  assert.equal((await app.inject({method:'POST',url:'/api/vote',payload:{ciphertext:next.ciphertext}})).statusCode,201);
  assert.equal((await app.inject('/api/results')).json().total,before+13);
  assert.equal((await app.inject('/api/board')).json().records.length,before+13);
  assert.match((await app.inject('/api/signing-key.pem')).body,/BEGIN PUBLIC KEY/);
  await a.close();a=null;c=await votingStore(url,testKeys);
  assert.equal((await c.find(encrypted[0].receipt)).found,true);
  assert.equal((await c.board()).records.length,before+13);
  await assert.rejects(votingStore(url,generateKeys()),/do not match/);
  console.log('Neon proof: 12 concurrent writes through two pools; duplicate rollback; HTTP cast/lookup/totals/export; restart preserved receipts and keys.');
 }finally{await app?.close();await a?.close();await b?.close();await c?.close();}
});
