# 2-3unemployed-hackathon

Admin panel and backend skeleton for New York sales-tax calculation workflow.

## Stack

- Node.js
- TypeScript
- React + Vite
- Express
- SQL (migration scaffold in `apps/api/src/db/migrations`)

## Workspace Structure

- `apps/api` — backend API (`/orders/import`, `/orders`, `/orders` list)
- `apps/web` — frontend admin panel (CSV import, manual order form, filters, pagination)
- `packages/shared` — shared DTO contracts for web/api

## Local Run

1. Install dependencies
   - `pnpm install`
2. Start local PostgreSQL
   - `pnpm db:up`
3. Run backend
   - `pnpm dev:api`
4. Run frontend
   - `pnpm dev:web`
5. Open frontend
   - `http://localhost:5173`

## Database (Task 1.3)

Local PostgreSQL is used (no Docker required in current setup):

- Service start: `pnpm db:up`
- Service stop: `pnpm db:down`
- Service status: `pnpm db:status`
- Connection check: `pnpm db:check`

Default local credentials:

- host: `localhost`
- port: `5432`
- db: `hackathon`
- user: `hackathon`
- password: `hackathon`

## Environment

Use `.env.example` as template:

- `VITE_API_URL=http://localhost:3000`
- `POSTGRES_HOST=localhost`
- `POSTGRES_PORT=5432`
- `POSTGRES_DB=hackathon`
- `POSTGRES_USER=hackathon`
- `POSTGRES_PASSWORD=hackathon`
- `DATABASE_URL=postgres://hackathon:hackathon@localhost:5432/hackathon`

## Quality Checks

- `pnpm typecheck`
- `pnpm lint`

## Docs

- API contract (Task 1.4): `docs/api.md`
- Decisions log: `docs/decisions.md`

## Notes

- Coordinates are expected to be within New York State (checked in manual create UI as guardrail).
- Frontend already includes filter and pagination controls required by the task.
- Tax calculation logic and CSV parsing internals are intentionally left for subsequent tasks.
