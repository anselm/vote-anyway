import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { makeReceipt } from '../src/receipt.js';

test('browser-only mode never pretends to persist receipts',async t=>{
  const app=await createApp({staticFiles:false});t.after(()=>app.close());
  assert.equal((await app.inject('/api/config')).json().persistent,false);
  assert.equal((await app.inject({method:'POST',url:'/api/receipts',payload:{commitment:'a'.repeat(64)}})).statusCode,503);
});
test('receipt API stores only a commitment and rejects choices or malformed receipts',async t=>{
  const records=new Map();
  const store={health:async()=>{},insert:async commitment=>{const record={commitment,createdAt:'2026-10-20T00:00:00Z'};records.set(commitment,record);return record;},find:async commitment=>records.get(commitment)};
  const app=await createApp({store,staticFiles:false});t.after(()=>app.close());
  const hash='b'.repeat(64);
  const added=await app.inject({method:'POST',url:'/api/receipts',payload:{commitment:hash}});
  assert.equal(added.statusCode,201);
  assert.equal((await app.inject('/api/receipts/'+hash)).json().commitment,hash);
  assert.equal((await app.inject('/api/receipts/'+'c'.repeat(64))).statusCode,404);
  assert.equal((await app.inject('/api/receipts/invalid')).statusCode,400);
  assert.equal((await app.inject({method:'POST',url:'/api/receipts',payload:{commitment:'invalid'}})).statusCode,400);
  assert.equal((await app.inject({method:'POST',url:'/api/receipts',payload:{commitment:hash,choice:'garden'}})).statusCode,400);
  assert.equal((await app.inject('/api/health')).json().ok,true);
});
test('database outages are reported without leaking internal details',async t=>{
  const fail=async()=>{throw Error('secret connection details');};
  const app=await createApp({store:{health:fail,insert:fail,find:fail},staticFiles:false});t.after(()=>app.close());
  assert.equal((await app.inject('/api/health')).statusCode,503);
  const res=await app.inject({method:'POST',url:'/api/receipts',payload:{commitment:'d'.repeat(64)}});
  assert.equal(res.statusCode,503);assert.ok(!res.body.includes('secret'));
});
test('the same choice produces distinct fingerprints and receipts contain no choice',async()=>{
  const first=await makeReceipt('garden'),second=await makeReceipt('garden');
  assert.match(first.commitment,/^[a-f0-9]{64}$/);assert.notEqual(first.commitment,second.commitment);
  assert.deepEqual(Object.keys(first).sort(),['commitment','createdAt']);
});
