import pg from 'pg';
import { readFile } from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL before running migrations.');
const client=new pg.Client({connectionString:process.env.DATABASE_URL});
try{await client.connect();await client.query(await readFile(new URL('../migrations/001-practice.sql',import.meta.url),'utf8'));console.log('Practice receipt schema is ready.');}finally{await client.end();}
