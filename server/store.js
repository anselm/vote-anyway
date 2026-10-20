import pg from 'pg';
export function postgresStore(connectionString){
  const pool=new pg.Pool({connectionString,max:5,connectionTimeoutMillis:5000,idleTimeoutMillis:10000});
  return {
    async health(){await pool.query('SELECT 1 FROM practice_receipts LIMIT 1');},
    async insert(commitment){
      const {rows}=await pool.query('INSERT INTO practice_receipts(commitment) VALUES($1) ON CONFLICT (commitment) DO UPDATE SET commitment=EXCLUDED.commitment RETURNING commitment, created_at AS "createdAt"',[commitment]);
      return rows[0];
    },
    async find(commitment){const {rows}=await pool.query('SELECT commitment, created_at AS "createdAt" FROM practice_receipts WHERE commitment=$1',[commitment]);return rows[0]??null;},
    async close(){await pool.end();}
  };
}
