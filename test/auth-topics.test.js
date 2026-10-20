import test from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';
import {authStore} from '../server/auth.js';
import {createApp} from '../server/app.js';
import {votingStore} from '../server/voting-store.js';
import {encryptBallot,verifyBoard} from '../scripts/verify-board.mjs';
import {signRequest} from '../scripts/auth-sign.mjs';
import {didFromJwk} from '../scripts/attest/verify.mjs';
const origin='http://localhost:8084';
test('unsigned writes require authentication, including the original vote endpoint',async()=>{
 const app=await createApp({staticFiles:false});
 try{
  for(const [url,payload] of [['/api/topics',{title:'Test',question:'Which?',options:['A','B']}],['/api/vote',{ciphertext:'a'.repeat(344)}],['/api/topics/test/vote',{ciphertext:'a'.repeat(344)}],['/api/receipts',{commitment:'a'.repeat(64)}]])assert.equal((await app.inject({method:'POST',url,payload})).statusCode,401,url);
 }finally{await app.close();}
});
test('signed topics, isolated records, replay/forgery/revocation, scoped agent approval',{skip:!process.env.BALLOT_TEST_DATABASE_URL},async()=>{
 const url=process.env.BALLOT_TEST_DATABASE_URL;let revoked=false,offline=false;
 const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
 const jwk=await crypto.subtle.exportKey('jwk',pair.publicKey);const sessionId='c'.repeat(64);
 const auth=authStore(url,{origins:[origin],fetchImpl:async()=>{if(offline)throw Error('offline');return {ok:true,json:async()=>({id:sessionId,root:'did:plc:test-person',handle:'test-person',device:didFromJwk(jwk),from:new Date(Date.now()-60000).toISOString(),until:new Date(Date.now()+3600000).toISOString(),origin:'match',revoked:revoked?'now':null})};}});
 const voting=await votingStore(url,JSON.parse(process.env.BALLOT_TEST_KEYS));
 const app=await createApp({voting,authenticate:auth.authenticate,authService:auth,staticFiles:false});
 const noncePool=new pg.Pool({connectionString:url});
 const user={id:sessionId,origin,jwk,privateKey:pair.privateKey};
 async function signed(path,body,who=user,method='POST'){
  const authorization=await signRequest({...who,method,path,body:body??null});
  return app.inject({method,url:path,headers:{authorization},...(body?{payload:body}:{})});
 }
 try{
  const body={title:'Integration test topic',question:'Which path?',options:['Trees','Gardens']};
  const authorization=await signRequest({...user,method:'POST',path:'/api/topics',body});
  const create=await app.inject({method:'POST',url:'/api/topics',headers:{authorization},payload:body});assert.equal(create.statusCode,201,create.body);
  assert.equal((await app.inject({method:'POST',url:'/api/topics',headers:{authorization},payload:body})).statusCode,409);
  const forgery=await signRequest({...user,method:'POST',path:'/api/topics',body});
  assert.equal((await app.inject({method:'POST',url:'/api/topics',headers:{authorization:forgery},payload:{...body,title:'Changed'}})).statusCode,401);
  const foreign=await signRequest({...user,origin:'https://other.example',method:'POST',path:'/api/topics',body});assert.equal((await app.inject({method:'POST',url:'/api/topics',headers:{authorization:foreign},payload:body})).statusCode,401);
  const id=create.json().id;const base='/api/topics/'+id;const config=(await app.inject(base+'/config')).json();
  const encrypted=await encryptBallot(config,'option-1');const vote=await signed(base+'/vote',{ciphertext:encrypted.ciphertext});assert.equal(vote.statusCode,201,vote.body);
  assert.equal((await signed('/api/vote',{ciphertext:encrypted.ciphertext})).statusCode,400);
  const board=(await app.inject(base+'/board')).json();assert.equal(board.records.length,1);await verifyBoard(board,config.signingPublicKey,id,vote.json().checkpoint,encrypted.receipt);
  await assert.rejects(verifyBoard({...board,electionId:'foreign'},config.signingPublicKey,'foreign'),/different topic/);
  assert.equal((await app.inject(base+'/results')).json().counts['option-1'],1);
  const agentPair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);const ajwk=await crypto.subtle.exportKey('jwk',agentPair.publicKey);
  const request=await app.inject({method:'POST',url:'/api/agent-requests',payload:{name:'Test agent',publicKey:{x:ajwk.x,y:ajwk.y},scopes:['votes:submit']}});assert.equal(request.statusCode,201,request.body);const grant=request.json();
  const agent={kind:'agent',id:grant.id,origin,privateKey:agentPair.privateKey};
  assert.equal((await signed(base+'/vote',{ciphertext:encrypted.ciphertext},agent)).statusCode,401);
  assert.equal((await signed('/api/agent-requests/'+grant.id+'/approve',{scopes:['votes:submit']})).statusCode,200);
  assert.equal((await signed('/api/topics',body,agent)).statusCode,403);
  const second=await encryptBallot(config,'option-2');assert.equal((await signed(base+'/vote',{ciphertext:second.ciphertext},agent)).statusCode,201);
  assert.equal((await signed('/api/agent-requests/'+grant.id+'/approve',{scopes:['votes:submit']},agent)).statusCode,403);
  assert.equal((await signed('/api/agents/'+grant.id+'/revoke')).statusCode,200);
  assert.equal((await signed(base+'/vote',{ciphertext:second.ciphertext},agent)).statusCode,401);
  revoked=true;assert.equal((await signed('/api/session',null,user,'GET')).statusCode,401);revoked=false;
  offline=true;assert.equal((await signed('/api/session',null,user,'GET')).statusCode,503);offline=false;
  console.log('PASS: actual Neon writes with verified signed requests; unsigned/forged/replayed/cross-origin requests rejected; topic isolation; agent approval, scope enforcement and revocation. Attest status responses are controlled fixtures.');
 }finally{await app.close();await auth.close();await voting.close();await noncePool.end();}
});
