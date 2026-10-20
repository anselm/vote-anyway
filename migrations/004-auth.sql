CREATE TABLE IF NOT EXISTS auth_nonces (id text PRIMARY KEY, expires_at timestamptz NOT NULL);
CREATE INDEX IF NOT EXISTS auth_nonces_expiry ON auth_nonces(expires_at);
CREATE TABLE IF NOT EXISTS agent_grants (
 id uuid PRIMARY KEY,
 name text NOT NULL,
 purpose text NOT NULL,
 public_key jsonb NOT NULL,
 scopes jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT now()+interval '15 minutes',
 approved_at timestamptz,
 owner_did text,
 delegation_id text,
 origin text,
 revoked_at timestamptz
);
