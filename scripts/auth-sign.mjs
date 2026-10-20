import {idOf,signObject,b64u} from './attest/verify.mjs';
export async function signRequest({kind='session',id,origin,jwk,privateKey,method,path,body=null}){
 const proof={kind,id,origin,at:new Date().toISOString(),nonce:crypto.randomUUID(),...(jwk?{jwk}: {})};
 const message={type:'vote-anyway-request',kind,id,origin,method:method.toUpperCase(),path,bodyHash:await idOf(body),at:proof.at,nonce:proof.nonce};
 proof.signature=await signObject(privateKey,message);
 return 'Attest '+b64u(new TextEncoder().encode(JSON.stringify(proof)));
}
