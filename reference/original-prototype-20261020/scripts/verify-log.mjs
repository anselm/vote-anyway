#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
const [boardFile,keyFile,receipt] = process.argv.slice(2);
if(!boardFile||!keyFile){console.error('Usage: node scripts/verify-log.mjs <board.json> <signing-public-key.pem> [receipt]');process.exit(2);}
const board=JSON.parse(fs.readFileSync(boardFile,'utf8'));
const records=Array.isArray(board)?board:board.records;
const publicKey=fs.readFileSync(keyFile,'utf8');
const H=s=>crypto.createHash('sha256').update(s).digest('hex');
let prev='0'.repeat(64),error='';
for(let i=0;i<records.length;i++){
  const r=records[i];const body={index:r.index,previousHash:r.previousHash,ciphertext:r.ciphertext,receipt:r.receipt};
  const hash=H(Buffer.from(JSON.stringify(body)));
  if(r.index!==i+1||r.previousHash!==prev||r.hash!==hash||
     r.receipt!==H(Buffer.from(r.ciphertext,'base64'))||
     !crypto.verify(null,Buffer.from(hash,'hex'),publicKey,Buffer.from(r.signature,'base64'))){error=`Invalid log at record ${i+1}`;break;}
  prev=r.hash;
}
if(error){console.error(`INVALID: ${error}`);process.exit(1);}
console.log(`VALID record integrity: ${records.length} signed ciphertext records. Head: ${prev}`);
if(receipt){const found=records.find(r=>r.receipt===receipt);console.log(`Receipt ${found?'INCLUDED at '+found.index:'NOT FOUND'}`);if(!found)process.exitCode=1;}
console.log('LIMITATION: This verifies signatures, hash chain and inclusion, NOT voter eligibility, cast-as-intended or correctness of the published tally.');
