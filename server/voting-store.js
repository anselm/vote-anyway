import pg from 'pg';
import {isDeepStrictEqual} from 'node:util';
import {election,validateKeys,decodeBallot,createRecord,verifyBoardRecords} from './protocol.js';
const fields='index, previous_hash AS "previousHash", ciphertext, receipt, hash, signature';
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
  async function board() {
    // Read records and head from one snapshot, even while other instances append.
    const client=await pool.connect();
    try {
      await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
      const {rows:[state]}=await client.query('SELECT record_count,head FROM lab_elections WHERE id=$1',[election.id]);
      const {rows:records}=await client.query(`SELECT ${fields} FROM lab_ballots WHERE election_id=$1 ORDER BY index`,[election.id]);
      await client.query('COMMIT');
      const check=verifyBoardRecords(records,keys.signingPublicKey);
      if(!check.ok||check.count!==state.record_count||check.head!==state.head)throw Error('Published log integrity check failed');
      return {electionId:election.id,records,checkpoint:{electionId:election.id,count:check.count,head:check.head,signingPublicKey:keys.signingPublicKey}};
    }catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
  }
  return {config,board,
    async submit(ciphertext) {
      decodeBallot(ciphertext,keys);
      const client=await pool.connect();
      try {
        await client.query('BEGIN');
        const {rows:[state]}=await client.query('SELECT record_count,head FROM lab_elections WHERE id=$1 FOR UPDATE',[election.id]);
        const {rows:existing}=await client.query(`SELECT ${fields} FROM lab_ballots WHERE election_id=$1 ORDER BY index`,[election.id]);
        const verified=verifyBoardRecords(existing,keys.signingPublicKey);
        if(!verified.ok||verified.count!==state.record_count||verified.head!==state.head)throw Error('Log integrity mismatch');
        const row=createRecord(ciphertext,state.record_count+1,state.head,keys);
        await client.query('INSERT INTO lab_ballots(election_id,index,previous_hash,ciphertext,receipt,hash,signature) VALUES($1,$2,$3,$4,$5,$6,$7)',[election.id,row.index,row.previousHash,row.ciphertext,row.receipt,row.hash,row.signature]);
        await client.query('UPDATE lab_elections SET record_count=$2,head=$3 WHERE id=$1',[election.id,row.index,row.hash]);
        await client.query('COMMIT');
        return {receipt:row.receipt,index:row.index,head:row.hash,checkpoint:{electionId:election.id,count:row.index,head:row.hash,signingPublicKey:keys.signingPublicKey},disclaimer:election.disclaimer};
      }catch(e){await client.query('ROLLBACK');if(e.code==='23505')throw Object.assign(Error('Duplicate encrypted submission'),{statusCode:409});throw e;}finally{client.release();}
    },
    async find(receipt){const {rows:[row]}=await pool.query('SELECT index FROM lab_ballots WHERE election_id=$1 AND receipt=$2',[election.id,receipt]);return {found:!!row,index:row?.index??null,notice:'Inclusion does not prove eligibility, ballot intent, or tally correctness.'};},
    async totals(){const {records}=await board();const counts=Object.fromEntries(election.options.map(o=>[o.id,0]));for(const record of records)counts[decodeBallot(record.ciphertext,keys).choice]++;return {counts,total:records.length,warning:'Server-computed demonstration totals, not an independently verified tally. Repeat participation is allowed; these are submissions, not unique people.'};},
    close:()=>pool.end()
  };
}
