CREATE TABLE IF NOT EXISTS lab_elections (
 id text PRIMARY KEY,
 config jsonb NOT NULL,
 encryption_public_key text NOT NULL,
 signing_public_key text NOT NULL,
 record_count integer NOT NULL DEFAULT 0 CHECK(record_count >= 0),
 head text NOT NULL DEFAULT repeat('0',64) CHECK(head ~ '^[a-f0-9]{64}$')
);
CREATE TABLE IF NOT EXISTS lab_ballots (
 election_id text NOT NULL REFERENCES lab_elections(id),
 index integer NOT NULL CHECK(index > 0),
 previous_hash text NOT NULL CHECK(previous_hash ~ '^[a-f0-9]{64}$'),
 ciphertext text NOT NULL,
 receipt text NOT NULL CHECK(receipt ~ '^[a-f0-9]{64}$'),
 hash text NOT NULL CHECK(hash ~ '^[a-f0-9]{64}$'),
 signature text NOT NULL,
 PRIMARY KEY(election_id,index),
 UNIQUE(election_id,receipt)
);
