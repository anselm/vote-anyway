import pg from 'pg';
import {randomUUID} from 'node:crypto';
import {didFromJwk,idOf,verifyObject} from '../scripts/attest/verify.mjs';
const fail=(message,statusCode=401)=>Object.assign(Error(message),{statusCode});
export function authStore(connectionString,{origins,fetchImpl=fetch}={}){
 const pool=new pg.Pool({connectionString,max:3,connectionTimeoutMillis:10000,idleTimeoutMillis:10000});
 const allowed=new Set(origins);
 async function delegation(id,origin){
  let response;try{response=await fetchImpl('https://attest.monster/delegation/'+id+'?origin='+encodeURIComponent(origin),{signal:AbortSignal.timeout(8000),headers:{accept:'application/json'}});}catch{throw fail('Sign-in verification is temporarily unavailable.',503);}
  if(!response.ok)throw fail('Sign in with attest.monster again.');
  const d=await response.json();
  if(d.id!==id||!d.root||d.origin!=='match'||d.revoked||!(Date.parse(d.until)>Date.now())||!(Date.parse(d.from)<=Date.now()))throw fail('Your attest sign-in is expired, revoked, or for another site.');
  return d;
 }
 async function authenticate(req){
  if(!req.headers.authorization?.startsWith('Attest '))throw fail('Sign in with attest.monster to continue.');
  let p;try{p=JSON.parse(Buffer.from(req.headers.authorization.slice(7),'base64url').toString());}catch{throw fail('Invalid sign-in proof.');}
  if(!p||!['session','agent'].includes(p.kind)||!allowed.has(p.origin)||typeof p.at!=='string'||!Number.isFinite(Date.parse(p.at))||Math.abs(Date.now()-Date.parse(p.at))>120000||typeof p.nonce!=='string'||!/^[a-zA-Z0-9-]{16,80}$/.test(p.nonce)||typeof p.signature!=='string'||p.signature.length>150)throw fail('Invalid or expired sign-in proof.');
  // Browser requests must use the same audience as their actual Origin header.
  if(req.headers.origin&&req.headers.origin!==p.origin)throw fail('Request origin differs from sign-in.');
  let d,jwk,grant;
  if(p.kind==='session'){
   if(!/^[a-f0-9]{64}$/.test(p.id))throw fail('Invalid delegation.');
   d=await delegation(p.id,p.origin);jwk=p.jwk;
   try{if(didFromJwk(jwk)!==d.device)throw fail('Device key mismatch.');}catch{throw fail('Device key mismatch.');}
  }else{
   if(!/^[0-9a-f-]{36}$/.test(p.id))throw fail('Invalid agent permission.');
   const {rows:[g]}=await pool.query('SELECT * FROM agent_grants WHERE id=$1',[p.id]);grant=g;
   if(!g?.approved_at||g.revoked_at||g.expires_at<=new Date()||g.origin!==p.origin)throw fail('Agent permission expired, revoked, or not approved.');
   d=await delegation(g.delegation_id,g.origin);if(d.root!==g.owner_did)throw fail('Agent owner mismatch.');jwk=g.public_key;
   const scope=req.method==='POST'&&req.url==='/api/topics'?'topics:create':req.method==='POST'&&/\/vote$/.test(req.url)?'votes:submit':null;
   if(req.method!=='GET'&&(!scope||!g.scopes.includes(scope)))throw fail('Agent permission does not allow this action.',403);
  }
  const message={type:'vote-anyway-request',kind:p.kind,id:p.id,origin:p.origin,method:req.method,path:req.url,bodyHash:await idOf(req.body??null),at:p.at,nonce:p.nonce};
  try{if(!await verifyObject(jwk,message,p.signature))throw fail('Invalid request signature.');}catch{throw fail('Invalid request signature.');}
  await pool.query('DELETE FROM auth_nonces WHERE expires_at < now()');
  const nonce=await idOf({kind:p.kind,id:p.id,nonce:p.nonce});
  const {rowCount}=await pool.query("INSERT INTO auth_nonces(id,expires_at) VALUES($1,now()+interval '5 minutes') ON CONFLICT DO NOTHING",[nonce]);
  if(!rowCount)throw fail('This signed request has already been used.',409);
  return {kind:p.kind,root:d.root,handle:d.handle,delegationId:grant?.delegation_id??p.id,until:d.until,origin:p.origin};
 }
 return {authenticate,
  async requestAgent({name,purpose='',publicKey,scopes}){
   try{await crypto.subtle.importKey('jwk',{kty:'EC',crv:'P-256',x:publicKey.x,y:publicKey.y,ext:true},{name:'ECDSA',namedCurve:'P-256'},false,['verify']);}catch{throw fail('Invalid agent public key.',400);}
   const id=randomUUID();await pool.query('INSERT INTO agent_grants(id,name,purpose,public_key,scopes) VALUES($1,$2,$3,$4,$5)',[id,name.trim(),purpose.trim(),publicKey,JSON.stringify(scopes)]);
   return {id,approvalUrl:'/agent.html?request='+id,expiresIn:900};
  },
  async getAgent(id){const {rows:[g]}=await pool.query('SELECT id,name,purpose,scopes,expires_at,approved_at,revoked_at FROM agent_grants WHERE id=$1',[id]);if(!g)throw fail('Agent request not found.',404);return {id:g.id,name:g.name,purpose:g.purpose,scopes:g.scopes,expiresAt:g.expires_at,status:g.revoked_at?'revoked':g.expires_at<=new Date()?'expired':g.approved_at?'approved':'pending'};},
  async approveAgent(id,identity,scopes){
   if(identity.kind!=='session')throw fail('A person must approve agent access.',403);
   const {rows:[g]}=await pool.query("UPDATE agent_grants SET approved_at=now(),owner_did=$2,delegation_id=$3,origin=$4,expires_at=least(now()+interval '7 days',$5::timestamptz),scopes=$6 WHERE id=$1 AND approved_at IS NULL AND expires_at>now() AND scopes @> $6::jsonb RETURNING id",[id,identity.root,identity.delegationId,identity.origin,identity.until,JSON.stringify(scopes)]);
   if(!g)throw fail('Agent request expired, already approved, or requested scopes differ.',409);return this.getAgent(id);
  },
  async listAgents(identity){const {rows}=await pool.query('SELECT id,name,purpose,scopes,expires_at AS "expiresAt",revoked_at AS "revokedAt" FROM agent_grants WHERE owner_did=$1 AND approved_at IS NOT NULL ORDER BY created_at DESC LIMIT 100',[identity.root]);return {agents:rows};},
  async revokeAgent(id,identity){if(identity.kind!=='session')throw fail('A person must revoke agent access.',403);const {rowCount}=await pool.query('UPDATE agent_grants SET revoked_at=now() WHERE id=$1 AND owner_did=$2',[id,identity.root]);if(!rowCount)throw fail('Agent permission not found.',404);return {revoked:true};},
  close:()=>pool.end()
 };
}
