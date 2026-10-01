-- name: CreateQuote :one
INSERT INTO quotes (name, business_type, contact, plan, message)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;

-- name: AddSubscriber :exec
INSERT INTO subscribers (email)
VALUES ($1)
ON CONFLICT (email) DO NOTHING;
