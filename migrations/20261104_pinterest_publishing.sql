-- Dedicated private Pinterest state. Existing content is unchanged.
CREATE TABLE IF NOT EXISTS pinterest_connection (
 account_key TEXT PRIMARY KEY CHECK(account_key='primary'),
 access_token_cipher TEXT NOT NULL, refresh_token_cipher TEXT NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL, scopes TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS pinterest_publish_jobs (
 id TEXT PRIMARY KEY, approval_key TEXT NOT NULL UNIQUE, page_id BIGINT NOT NULL,
 sheet_id TEXT NOT NULL, board_id TEXT NOT NULL, template TEXT NOT NULL,
 headline TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, alt_text TEXT NOT NULL,
 destination TEXT NOT NULL, scheduled_at TIMESTAMPTZ NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('approved','publishing','published','failed','cancelled')),
 error_message TEXT, pinterest_pin_id TEXT,
 approved_at TIMESTAMPTZ NOT NULL DEFAULT now(), published_at TIMESTAMPTZ,
 updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pinterest_jobs_due_idx ON pinterest_publish_jobs (status,scheduled_at);

-- Safe upgrade for databases created before Pinterest Sandbox support.
ALTER TABLE pinterest_connection ADD COLUMN IF NOT EXISTS api_environment TEXT NOT NULL DEFAULT 'production';
ALTER TABLE pinterest_publish_jobs ADD COLUMN IF NOT EXISTS api_environment TEXT NOT NULL DEFAULT 'production';
