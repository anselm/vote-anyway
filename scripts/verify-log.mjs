#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {verifyBoard} from './verify-board.mjs';
const [boardFile,keyFile,receipt,checkpointFile]=process.argv.slice(2);
if(!boardFile||!keyFile){console.error('Usage: node verify-log.mjs board.json signing-public-key.pem [receipt|-] [checkpoint.json]');process.exit(2);}
try{
 const board=JSON.parse(await readFile(boardFile,'utf8'));
 const key=await readFile(keyFile,'utf8');
 const checkpoint=checkpointFile?JSON.parse(await readFile(checkpointFile,'utf8')):null;
 const verified=await verifyBoard(board,key,'neighborhood-demo-2026',checkpoint,receipt==='-'?null:receipt);
 console.log(`VALID record integrity: ${verified.count} signed ciphertext records. Head: ${verified.head}`);
 if(receipt&&receipt!=='-')console.log('Receipt INCLUDED');
 console.log(checkpoint?'Saved checkpoint continuity verified.':'No prior checkpoint supplied: a valid shortened history cannot be detected.');
 console.log('This checks record integrity and inclusion, not eligibility, ballot intent or tally correctness. Obtain the public key and earlier checkpoint through a trusted channel.');
}catch(e){console.error('INVALID: '+e.message);process.exitCode=1;}
