# CivicFix API

Express + TypeScript backend for CivicFix, talking directly to the
PostgreSQL/PostGIS schema defined in `../database/*.sql`.

## Setup

```bash
cd backend
npm install
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, etc.
npm run dev                 # tsx watch mode on http://localhost:4000
```

Requires the database migrations in `../database/` to already be applied
(001–010, in order) against a PostgreSQL instance with `postgis` and
`pgcrypto` enabled.

## Scripts

| Command            | Description                          |
|---------------------|---------------------------------------|
| `npm run dev`       | Start with hot reload (tsx)           |
| `npm run build`     | Compile to `dist/` via tsc            |
| `npm start`         | Run the compiled build                |
| `npm run typecheck` | `tsc --noEmit`                        |

## Auth

JWT bearer tokens. `POST /auth/register` (citizens only — authority/worker
accounts are provisioned out of band, see `database/010_test_data.sql` for
the demo logins) and `POST /auth/login` both return `{ token, user }`.
Send `Authorization: Bearer <token>` on protected routes.

## Routes

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET /categories`, `/departments`, `/skills`, `/statuses`, `/severities`, `/priorities`
- `GET /issues`, `GET /issues/nearby`, `GET /issues/:id`, `GET /issues/:id/history`,
  `GET /issues/:id/reports`, `PATCH /issues/:id/status` (authority)
- `GET /issues/:issueId/feedback`, `POST /issues/:issueId/feedback`
- `POST /reports`, `GET /reports/mine`, `GET /reports/:id`
- `GET /workers`, `GET /workers/nearby`, `PATCH /workers/:id/availability`
- `POST /assignments`, `GET /assignments/mine`, `PATCH /assignments/:id/accept|reject|start`,
  `POST /assignments/:id/proof`, `PATCH /assignments/proofs/:id/verify`
- `GET /analytics/overview|by-category|by-department|resolution-time|hotspots|ai-overrides` (authority)

Every mutating route that changes rows the SQL triggers care about (issues,
assignments, resolution proofs) runs inside `withUserContext()`, which sets
the `app.current_user_id` session variable so `issue_status_history` and
`audit_logs` populate correctly — the same pattern used throughout
`database/queries_and_transactions.sql`.
