# REACH Studio

The public agency website is a React + TypeScript single-page app. The Go API stores quote requests and newsletter signups in PostgreSQL. The existing SQLite database remains available as a zero-setup local fallback.

## Local development

Install Node.js 24 LTS and Go 1.24 or newer. Open two PowerShell terminals from the repository root.

Terminal 1 — Go API (uses the existing `reach.db` when `DATABASE_URL` is unset):

```powershell
cd backend
go mod tidy
go run ./cmd/api
```

Terminal 2 — React app:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5000`. Vite proxies `/api` requests to the Go API at `http://localhost:8080` while keeping the existing local URL.

## PostgreSQL

1. Copy `.env.example` to `.env` and replace `CHANGE_ME` with a local development password.
2. From the repository root, start PostgreSQL: `docker compose up -d postgres`.
3. The Go API reads `DATABASE_URL`, runs the Goose migrations at startup, and connects to PostgreSQL.
4. To copy the existing local SQLite quote and subscription records once, run `cd backend; go run ./cmd/migrate-sqlite`. The importer preserves row IDs, skips records already present, and prints counts only.

Without `DATABASE_URL`, the API uses `../reach.db` from `backend/`, preserving the existing SQLite data. Do not put database credentials in frontend environment variables.

## Production build

```powershell
cd frontend
npm ci
npm run build
cd ..\backend
$env:PORT = "5000"
go run ./cmd/api
```

The Go server listens on port `5000` by default and serves `frontend/dist` when present. For Vercel, connect the repository with its root as the project root and select the Services framework. The root `vercel.json` builds `backend/` and `frontend/` as separate services, routes `/api/*` to the Go API, and sends all other paths to the Vite app. The frontend calls `/api/v1` on the same domain, so those requests follow the public API rewrite.

Set `DATABASE_URL` to a persistent PostgreSQL database in Vercel's project environment before deploying. The SQLite fallback is for local development and is not suitable for durable production data. Set `CORS_ORIGIN` only if the browser frontend uses a different origin; same-domain Vercel routing does not need it. Run `vercel dev` from the repository root to develop the services together.

## Database changes

PostgreSQL schema changes live in `backend/db/migrations/postgres` and are applied automatically by Goose. Query definitions for SQLC are in `backend/db/queries`; generate typed PostgreSQL bindings from `backend/` with `sqlc generate`.

## API

- `GET /api/v1/health`
- `POST /api/v1/quotes`
- `POST /api/v1/subscriptions`

The previous `/api/health`, `/api/quote`, and `/api/subscribe` form routes remain as compatibility aliases. Quote records are not exposed through a public list endpoint.

## Frontend

The existing REACH visual system is retained in `frontend/src/styles/`. React Router currently serves the public home page and a lightweight not-found view. Shared API calls live in `frontend/src/api/`; quote input is validated with Zod and submitted with TanStack Query. Motion and Lucide React are used for restrained feedback and loading states.
