import pg from 'pg';
import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {election,validateKeys,decodeBallot,createRecord,verifyBoardRecords} from './protocol.js';
const fields='signed_election_id AS "electionId", index, previous_hash AS "previousHash", ciphertext, receipt, hash, signature';
export async function votingStore(connectionString,keys) {
  validateKeys(keys);
  const pool=new pg.Pool({connectionString,max:5,connectionTimeoutMillis:10000,idleTimeoutMillis:10000});
  const config={election,encryptionPublicKey:keys.encryptionPublicKey,signingPublicKey:keys.signingPublicKey};
  try {
    await pool.query('INSERT INTO lab_elections(id,config,encryption_public_key,signing_public_key) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING',[election.id,election,keys.encryptionPublicKey,keys.signingPublicKey]);
    const {rows:[stored]}=await pool.query('SELECT * FROM lab_elections WHERE id=$1',[election.id]);
    if(!isDeepStrictEqual(stored.config,election)||stored.encryption_public_key!==keys.encryptionPublicKey||stored.signing_public_key!==keys.signingPublicKey)throw Error('Election configuration or keys do not match the persistent election');
    await board();
  } catch(e) {await pool.end();throw e;}
  async function getConfig(id=election.id,client=pool){
    const {rows:[stored]}=await client.query('SELECT config,encryption_public_key,signing_public_key FROM lab_elections WHERE id=$1',[id]);
    if(!stored)throw Object.assign(Error('Topic not found'),{statusCode:404});
    if(stored.encryption_public_key!==keys.encryptionPublicKey||stored.signing_public_key!==keys.signingPublicKey)throw Error('Topic key mismatch');
    return {election:stored.config,encryptionPublicKey:stored.encryption_public_key,signingPublicKey:stored.signing_public_key};
  }
  async function board(id=election.id) {
    // Read records and head from one snapshot, even while other instances append.
    const client=await pool.connect();
    try {
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      await getConfig(id,client);
      const {rows:[state]}=await client.query('SELECT record_count,head FROM lab_elections WHERE id=$1',[id]);
      const {rows:records}=await client.query(`SELECT ${fields} FROM lab_ballots WHERE election_id=$1 ORDER BY index`,[id]);
      await client.query('COMMIT');
      const check=verifyBoardRecords(records,keys.signingPublicKey);
      if(records.some(r=>id!==election.id&&r.electionId!==id)||!check.ok||check.count!==state.record_count||check.head!==state.head)throw Error('Published log integrity check failed');
      return {electionId:id,records,checkpoint:{electionId:id,count:check.count,head:check.head,signingPublicKey:keys.signingPublicKey}};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  }
  return {config,board,getConfig,
    async listTopics(){const {rows}=await pool.query("SELECT id, config->>'title' AS title, config->>'description' AS question, record_count AS submissions, created_at AS \"createdAt\" FROM lab_elections ORDER BY created_at DESC LIMIT 100");return {topics:rows};},
    async createTopic({title,question,options}){
      title=title.trim();question=question.trim();options=options.map(o=>o.trim());
      if(!title||!question||options.some(o=>!o)||new Set(options.map(o=>o.toLowerCase())).size!==options.length)throw Object.assign(Error('Provide a title, question, and distinct nonempty choices.'),{statusCode:400});
      const id=randomUUID();
      const topic={id,title,description:question,options:options.map((label,i)=>({id:'option-'+(i+1),label})),disclaimer:election.disclaimer};
      await pool.query('INSERT INTO lab_elections(id,config,encryption_public_key,signing_public_key) VALUES($1,$2,$3,$4)',[id,topic,keys.encryptionPublicKey,keys.signingPublicKey]);
      return {id,url:'/topic/'+id,election:topic};
    },
    async submit(ciphertext,id=election.id) {
      const topic=await getConfig(id);
      decodeBallot(ciphertext,keys,topic.election);
      const client=await pool.connect();
      try {
        await client.query('BEGIN');
        const {rows:[state]}=await client.query('SELECT record_count,head FROM lab_elections WHERE id=$1 FOR UPDATE',[id]);
        const {rows:existing}=await client.query(`SELECT ${fields} FROM lab_ballots WHERE election_id=$1 ORDER BY index`,[id]);
        const verified=verifyBoardRecords(existing,keys.signingPublicKey);
        if(existing.some(r=>id!==election.id&&r.electionId!==id)||!verified.ok||verified.count!==state.record_count||verified.head!==state.head)throw Error('Log integrity mismatch');
        const row=createRecord(ciphertext,state.record_count+1,state.head,keys,id);
        await client.query('INSERT INTO lab_ballots(election_id,index,previous_hash,ciphertext,receipt,hash,signature,signed_election_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[id,row.index,row.previousHash,row.ciphertext,row.receipt,row.hash,row.signature,row.electionId??null]);
        await client.query('UPDATE lab_elections SET record_count=$2,head=$3 WHERE id=$1',[id,row.index,row.hash]);
        await client.query('COMMIT');
        return {receipt:row.receipt,index:row.index,head:row.hash,checkpoint:{electionId:id,count:row.index,head:row.hash,signingPublicKey:keys.signingPublicKey},disclaimer:election.disclaimer};
      }catch(e){await client.query('ROLLBACK');if(e.code==='23505')throw Object.assign(Error('Duplicate encrypted submission'),{statusCode:409});throw e;}finally{client.release();}
    },
    async find(receipt,id=election.id){await getConfig(id);const {rows:[row]}=await pool.query('SELECT index FROM lab_ballots WHERE election_id=$1 AND receipt=$2',[id,receipt]);return {found:!!row,index:row?.index??null,notice:'Inclusion does not prove eligibility, ballot intent, or tally correctness.'};},
    async totals(id=election.id){const topic=await getConfig(id);const {records}=await board(id);const counts=Object.fromEntries(topic.election.options.map(o=>[o.id,0]));for(const record of records)counts[decodeBallot(record.ciphertext,keys,topic.election).choice]++;return {counts,total:records.length,warning:'Server-computed demonstration totals, not an independently verified tally. Repeat participation is allowed; these are submissions, not unique people.'};},
    close:()=>pool.end()
  };
}
