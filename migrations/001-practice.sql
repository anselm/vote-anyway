-- Practice commitments only: no names, IPs, identities, or ballot choices.
CREATE TABLE IF NOT EXISTS practice_receipts (
  commitment text PRIMARY KEY CHECK (commitment ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);
