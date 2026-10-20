import crypto from 'node:crypto';

export const election = Object.freeze({
  id: 'neighborhood-demo-2026',
  title: 'Fictional neighborhood improvement exercise',
  description: 'If this were a community research poll, what should be studied first?',
  options: [
    { id: 'street-trees', label: 'Street trees and shade' },
    { id: 'crosswalks', label: 'Safer pedestrian crossings' },
    { id: 'rain-gardens', label: 'Rain gardens and runoff capture' },
  ],
  disclaimer: 'EXPERIMENTAL VOTE — NOT AN OFFICIAL ELECTION. Participating here does not cast or change your real ballot.',
});

const HASH_ZERO = '0'.repeat(64);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const b64 = bytes => Buffer.from(bytes).toString('base64');
export const recordBody = ({index, previousHash, ciphertext, receipt}) => ({index, previousHash, ciphertext, receipt});
export const recordHash = row => sha256(Buffer.from(JSON.stringify(recordBody(row))));

// A log integrity check, not an election/tally proof. The server's signing key is trusted here.
export function verifyBoardRecords(records, publicKeyPem) {
  let previousHash=HASH_ZERO;
  const receipts=new Set();
  for(let i=0;i<records.length;i++) {
    const row=records[i];
    if(row.index!==i+1 || row.previousHash!==previousHash) return {ok:false,reason:`Broken chain at record ${i+1}`};
    const computed=recordHash(row);
    if(row.hash!==computed) return {ok:false,reason:`Hash mismatch at record ${i+1}`};
    if(!crypto.verify(null,Buffer.from(computed,'hex'),publicKeyPem,Buffer.from(row.signature,'base64')))
      return {ok:false,reason:`Signature invalid at record ${i+1}`};
    const cipher=Buffer.from(row.ciphertext,'base64');
    if(row.receipt!==sha256(cipher)) return {ok:false,reason:`Receipt mismatch at record ${i+1}`};
    if(receipts.has(row.receipt)) return {ok:false,reason:`Repeated ciphertext at record ${i+1}`};
    receipts.add(row.receipt);
    previousHash=row.hash;
  }
  return {ok:true,count:records.length,head:previousHash};
}


export function generateKeys() {
  const enc=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
  const sig=crypto.generateKeyPairSync('ed25519');
  return {encryptionPublicKey:enc.publicKey.export({type:'spki',format:'pem'}),encryptionPrivateKey:enc.privateKey.export({type:'pkcs8',format:'pem'}),signingPublicKey:sig.publicKey.export({type:'spki',format:'pem'}),signingPrivateKey:sig.privateKey.export({type:'pkcs8',format:'pem'})};
}
export function validateKeys(keys) {
  for(const prefix of ['encryption','signing']) {
    const derived=crypto.createPublicKey(keys[prefix+'PrivateKey']).export({type:'spki',format:'pem'});
    if(derived!==keys[prefix+'PublicKey']) throw Error('Voting key pair mismatch');
  }
  if(crypto.createPrivateKey(keys.encryptionPrivateKey).asymmetricKeyType!=='rsa'||crypto.createPrivateKey(keys.signingPrivateKey).asymmetricKeyType!=='ed25519') throw Error('Unexpected voting key types');
}
export function decodeBallot(ciphertext,keys) {
  const invalid=()=>Object.assign(Error('Invalid encrypted ballot for this experiment'),{statusCode:400});
  if(typeof ciphertext!=='string'||ciphertext.length<150||ciphertext.length>800||!/^[A-Za-z0-9+/]+={0,2}$/.test(ciphertext))throw invalid();
  const bytes=Buffer.from(ciphertext,'base64');
  if(bytes.toString('base64')!==ciphertext)throw invalid();
  try {
    const ballot=JSON.parse(crypto.privateDecrypt({key:keys.encryptionPrivateKey,padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,oaepHash:'sha256'},bytes).toString('utf8'));
    if(!ballot||ballot.electionId!==election.id||!election.options.some(o=>o.id===ballot.choice)||typeof ballot.nonce!=='string'||ballot.nonce.length<16||ballot.nonce.length>80)throw invalid();
    return ballot;
  } catch {throw invalid();}
}
export function createRecord(ciphertext,index,previousHash,keys) {
  const body={index,previousHash,ciphertext,receipt:sha256(Buffer.from(ciphertext,'base64'))};
  const hash=recordHash(body);
  return {...body,hash,signature:crypto.sign(null,Buffer.from(hash,'hex'),keys.signingPrivateKey).toString('base64')};
}
