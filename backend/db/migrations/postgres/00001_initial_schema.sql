-- +goose Up
CREATE TABLE IF NOT EXISTS quotes (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    contact TEXT NOT NULL,
    plan TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes (created_at DESC);

-- +goose Down
DROP INDEX IF EXISTS quotes_created_at_idx;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS quotes;
