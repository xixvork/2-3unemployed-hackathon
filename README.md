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
2. Run backend
   - `pnpm dev:api`
3. Run frontend
   - `pnpm dev:web`
4. Open frontend
   - `http://localhost:5173`

## Environment

Use `.env.example` as template:

- `VITE_API_URL=http://localhost:3000`

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
