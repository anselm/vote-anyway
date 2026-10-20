import pg from 'pg';
import {readFile,readdir} from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw Error('Set DATABASE_URL before running migrations.');
const client=new pg.Client({connectionString:process.env.DATABASE_URL_UNPOOLED||process.env.DATABASE_URL});
try {
 await client.connect();
 await client.query('BEGIN');
 await client.query("SELECT pg_advisory_xact_lock(712041301)");
 await client.query('CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
 for(const name of (await readdir(new URL('../migrations/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort()) {
  const {rowCount}=await client.query('SELECT name FROM schema_migrations WHERE name=$1',[name]);
  if(rowCount)continue;
  await client.query(await readFile(new URL('../migrations/'+name,import.meta.url),'utf8'));
  await client.query('INSERT INTO schema_migrations(name) VALUES($1)',[name]);
  console.log('Applied '+name);
 }
 await client.query('COMMIT');
 console.log('Database schema is ready.');
}catch(e){await client.query('ROLLBACK');throw e;}finally{await client.end();}
