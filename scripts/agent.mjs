#!/usr/bin/env node
import {readFile,writeFile} from 'node:fs/promises';
import {signRequest} from './auth-sign.mjs';
import {encryptBallot,verifyBoard} from './verify-board.mjs';
const [baseArg,command,...args]=process.argv.slice(2);
if(!baseArg||!command){console.error('Usage: node agent.mjs <site-origin> topics|request|status|create|vote|check [arguments]');process.exit(2);}
const base=new URL(baseArg).origin;
if(!base.startsWith('https://')&&!/^http:\/\/localhost(?::\d+)?$/.test(base))throw Error('Use HTTPS, or localhost for development.');
const file=process.env.VOTE_ANYWAY_AGENT_FILE||'.env.vote-anyway-agent';
async function load(){return JSON.parse(await readFile(file,'utf8'));}
async function request(path,{method='GET',body,credentials}={}){
 const headers={};if(body)headers['Content-Type']='application/json';
 if(credentials){
  if(credentials.origin!==base)throw Error('The agent permission belongs to another site origin.');
  const privateKey=await crypto.subtle.importKey('jwk',credentials.privateJwk,{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
  headers.authorization=await signRequest({kind:'agent',id:credentials.id,origin:base,privateKey,method,path,body:body??null});
 }
 const response=await fetch(base+path,{method,headers,...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();if(!response.ok)throw Error(`${response.status}: ${data.error}`);return data;
}
try{
 let result;
 if(command==='topics')result=await request('/api/topics');
 else if(command==='request'){
  const [name='Vote Anyway agent',scopeText='votes:submit']=args;
  const scopes=scopeText.split(',');if(scopes.some(s=>!['votes:submit','topics:create'].includes(s)))throw Error('Scopes: votes:submit,topics:create');
  const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  const privateJwk=await crypto.subtle.exportKey('jwk',pair.privateKey);
  // Reserve the private file before requesting access; never overwrite an existing identity.
  await writeFile(file,JSON.stringify({origin:base,privateJwk}),{mode:0o600,flag:'wx'});
  result=await request('/api/agent-requests',{method:'POST',body:{name,purpose:'Use Vote Anyway within the selected permissions.',publicKey:{x:privateJwk.x,y:privateJwk.y},scopes}});
  await writeFile(file,JSON.stringify({origin:base,privateJwk,id:result.id}),{mode:0o600});
  result={...result,approvalUrl:base+result.approvalUrl,instruction:'Show this URL to the person. They must sign in with attest.monster and approve the permissions. Do not approve for them.'};
 }else if(command==='status'){const credentials=await load();result=await request('/api/agent-requests/'+credentials.id);}
 else if(command==='create'){const credentials=await load();const topic=JSON.parse(await readFile(args[0],'utf8'));result=await request('/api/topics',{method:'POST',body:topic,credentials});result.url=base+result.url;}
 else if(command==='vote'){
  const [id,choice]=args;if(!id||!choice)throw Error('vote requires a topic ID and explicit choice ID');
  const credentials=await load();const path='/api/topics/'+encodeURIComponent(id);
  const config=await request(path+'/config');if(!config.election.options.some(o=>o.id===choice))throw Error('Unknown choice ID. Read the topic config first.');
  const encrypted=await encryptBallot(config,choice);result=await request(path+'/vote',{method:'POST',body:{ciphertext:encrypted.ciphertext},credentials});
  if(result.receipt!==encrypted.receipt)throw Error('Receipt mismatch');
  await verifyBoard(await request(path+'/board'),config.signingPublicKey,id,result.checkpoint,result.receipt);
 }else if(command==='check'){
  const [id,receiptFile]=args;const receipt=JSON.parse(await readFile(receiptFile,'utf8'));const path='/api/topics/'+encodeURIComponent(id);
  const config=await request(path+'/config');result=await verifyBoard(await request(path+'/board'),config.signingPublicKey,id,receipt.checkpoint,receipt.receipt);
 }else throw Error('Unknown command');
 console.log(JSON.stringify(result,null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
