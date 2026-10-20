import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { createApp } from '../server/app.js';
import { postgresStore } from '../server/store.js';

test('Neon receipt persists across app and connection-pool restarts', {skip:!process.env.DATABASE_URL}, async()=>{
  const commitment=randomBytes(32).toString('hex');
  let store=postgresStore(process.env.DATABASE_URL);
  let app=await createApp({authenticate:async()=>({kind:'session',root:'test'}),store,staticFiles:false});
  let created;
  try {
    assert.equal((await app.inject('/api/health')).json().storage,'postgres');
    assert.equal((await app.inject('/api/config')).json().persistent,true);
    const res=await app.inject({method:'POST',url:'/api/receipts',payload:{commitment}});
    assert.equal(res.statusCode,201);
    created=res.json();
    assert.equal(created.commitment,commitment);
    assert.ok(created.createdAt);
  } finally {await app.close();await store.close();}
  store=postgresStore(process.env.DATABASE_URL);
  app=await createApp({authenticate:async()=>({kind:'session',root:'test'}),store,staticFiles:false});
  try {
    const found=await app.inject('/api/receipts/'+commitment);
    assert.equal(found.statusCode,200);
    assert.deepEqual(found.json(),created);
    const repeated=await app.inject({method:'POST',url:'/api/receipts',payload:{commitment}});
    assert.equal(repeated.statusCode,201);
    assert.deepEqual(repeated.json(),created);
    console.log('PASS: Neon write, restarted-app lookup, idempotent retry preserve the original receipt.');
  } finally {await app.close();await store.close();}
});
