import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

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

export function initializeStore(dataDir) {
  fs.mkdirSync(dataDir, {recursive:true});
  const keysPath = path.join(dataDir, 'keys.json');
  let keys;
  if (fs.existsSync(keysPath)) keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  else {
    const { publicKey: encPub, privateKey: encPriv } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicExponent: 0x10001 });
    const { publicKey: signPub, privateKey: signPriv } = crypto.generateKeyPairSync('ed25519');
    keys = {
      encryptionPublicKey: encPub.export({type:'spki',format:'pem'}),
      encryptionPrivateKey: encPriv.export({type:'pkcs8',format:'pem'}),
      signingPublicKey: signPub.export({type:'spki',format:'pem'}),
      signingPrivateKey: signPriv.export({type:'pkcs8',format:'pem'}),
    };
    fs.writeFileSync(keysPath, JSON.stringify(keys, null, 2), {mode:0o600, flag:'wx'});
  }
  const boardPath = path.join(dataDir, 'board.json');
  if (!fs.existsSync(boardPath)) fs.writeFileSync(boardPath, '[]\n', {mode:0o600, flag:'wx'});
  return {keys,boardPath};
}

export function loadBoard(store) {return JSON.parse(fs.readFileSync(store.boardPath,'utf8'));}

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

export function submitBallot(store, base64Ciphertext) {
  if(typeof base64Ciphertext!=='string' || base64Ciphertext.length<150 || base64Ciphertext.length>800 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(base64Ciphertext)) throw Object.assign(new Error('Malformed encrypted ballot'),{statusCode:400});
  const bytes=Buffer.from(base64Ciphertext,'base64');
  if(b64(bytes)!==base64Ciphertext) throw Object.assign(new Error('Malformed base64 ballot'),{statusCode:400});
  let decoded;
  try {
    const plaintext=crypto.privateDecrypt({key:store.keys.encryptionPrivateKey,padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,oaepHash:'sha256'},bytes);
    decoded=JSON.parse(plaintext.toString('utf8'));
  } catch { throw Object.assign(new Error('Could not decrypt ballot'),{statusCode:400}); }
  if(decoded.electionId!==election.id || !election.options.some(x=>x.id===decoded.choice) ||
    typeof decoded.nonce!=='string' || decoded.nonce.length<16 || decoded.nonce.length>80) {
    throw Object.assign(new Error('Ballot selection not valid for this experiment'),{statusCode:400});
  }
  const board=loadBoard(store);
  const check=verifyBoardRecords(board,store.keys.signingPublicKey);
  if(!check.ok) throw Object.assign(new Error('Published log integrity check failed; refusing additional votes'),{statusCode:503});
  const receipt=sha256(bytes);
  if(board.some(x=>x.receipt===receipt)) throw Object.assign(new Error('Duplicate encrypted submission'),{statusCode:409});
  const body={index:board.length+1,previousHash:board.length?board.at(-1).hash:HASH_ZERO,ciphertext:base64Ciphertext,receipt};
  const hash=recordHash(body);
  const signature=crypto.sign(null,Buffer.from(hash,'hex'),store.keys.signingPrivateKey).toString('base64');
  const entry={...body,hash,signature};
  board.push(entry);
  const temporary=store.boardPath+'.tmp';
  fs.writeFileSync(temporary,JSON.stringify(board,null,2)+'\n',{mode:0o600});
  fs.renameSync(temporary,store.boardPath);
  return {receipt,index:entry.index,head:hash};
}

export function getTotals(store) {
  const board=loadBoard(store);
  const validity=verifyBoardRecords(board,store.keys.signingPublicKey);
  if(!validity.ok) throw Object.assign(new Error(validity.reason),{statusCode:503});
  const counts=Object.fromEntries(election.options.map(x=>[x.id,0]));
  for(const ballot of board){
    try {
      const decoded=JSON.parse(crypto.privateDecrypt({key:store.keys.encryptionPrivateKey,padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,oaepHash:'sha256'},Buffer.from(ballot.ciphertext,'base64')).toString('utf8'));
      if(Object.hasOwn(counts,decoded.choice)) counts[decoded.choice]++;
    } catch { throw Object.assign(new Error('Encrypted ballot could not be tallied'),{statusCode:503}); }
  }
  return {counts,total:board.length,warning:'These totals are calculated by the server and are NOT cryptographically independently verifiable. Unlimited volunteer ballots are possible.'};
}
