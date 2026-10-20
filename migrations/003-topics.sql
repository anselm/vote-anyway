ALTER TABLE lab_elections ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE lab_ballots ADD COLUMN IF NOT EXISTS signed_election_id text;
CREATE INDEX IF NOT EXISTS lab_elections_created_at ON lab_elections(created_at DESC);
