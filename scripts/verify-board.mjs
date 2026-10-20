const bytes64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64=bytes=>btoa(String.fromCharCode(...bytes));
const pemBytes=pem=>bytes64(pem.replace(/-----[^-]+-----/g,'').replace(/\s/g,''));
const hex=bytes=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const hash=async bytes=>hex(await crypto.subtle.digest('SHA-256',bytes));
export async function encryptBallot(config,choice){
 const key=await crypto.subtle.importKey('spki',pemBytes(config.encryptionPublicKey),{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
 const plaintext=new TextEncoder().encode(JSON.stringify({electionId:config.election.id,choice,nonce:crypto.randomUUID()}));
 const bytes=new Uint8Array(await crypto.subtle.encrypt({name:'RSA-OAEP'},key,plaintext));
 return {ciphertext:base64(bytes),receipt:await hash(bytes)};
}
export async function verifyBoard(board,publicKey,electionId,checkpoint=null,receipt=null){
 if(board.electionId!==electionId||!Array.isArray(board.records))throw Error('Unexpected election or board format.');
 const key=await crypto.subtle.importKey('spki',pemBytes(publicKey),{name:'Ed25519'},false,['verify']);
 let previousHash='0'.repeat(64);const receipts=new Set();
 for(let i=0;i<board.records.length;i++){
  const row=board.records[i];
  if(row.index!==i+1||row.previousHash!==previousHash)throw Error('Broken record sequence.');
  const body={index:row.index,previousHash:row.previousHash,ciphertext:row.ciphertext,receipt:row.receipt};
  const computed=await hash(new TextEncoder().encode(JSON.stringify(body)));
  if(computed!==row.hash||row.receipt!==await hash(bytes64(row.ciphertext))||receipts.has(row.receipt))throw Error('Record or receipt mismatch.');
  if(!await crypto.subtle.verify('Ed25519',key,bytes64(row.signature),Uint8Array.from(computed.match(/../g),b=>parseInt(b,16))))throw Error('Invalid record signature.');
  receipts.add(row.receipt);previousHash=computed;
 }
 if(checkpoint){
  if(checkpoint.electionId!==electionId||checkpoint.signingPublicKey!==publicKey||!Number.isSafeInteger(checkpoint.count)||checkpoint.count<0)throw Error('Checkpoint election or signing key differs.');
  if(board.records.length<checkpoint.count)throw Error('The log is shorter than your saved checkpoint.');
  const priorHead=checkpoint.count?board.records[checkpoint.count-1].hash:'0'.repeat(64);
  if(priorHead!==checkpoint.head)throw Error('The log conflicts with your saved checkpoint.');
 }
 if(receipt&&!receipts.has(receipt))throw Error('Your receipt is absent from this log.');
 return {electionId,count:board.records.length,head:previousHash,signingPublicKey:publicKey};
}
