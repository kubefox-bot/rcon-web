# AGENTS.md

## Goal
Help contributors and coding agents make safe, fast, minimal changes in `rcon-web`.

## Project Snapshot
- Monorepo for CS2 RCON web management.
- Frontend: Vue 3 + Vite + TypeScript (`/frontend`).
- Backend: Rust + Axum (`/backend`).
- Runtime packaging: Docker + Nginx (`Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `nginx/`).

## Key Paths
- Frontend app: `frontend/src/app/App.vue`
- Frontend API client: `frontend/src/lib/api.ts`
- Frontend RCON handlers: `frontend/src/handlers/`
- Backend entrypoint: `backend/src/main.rs`
- Backend router: `backend/src/app/router.rs`
- Backend auth: `backend/src/auth/`
- Backend RCON handlers: `backend/src/handlers/`
- Dev compose: `docker-compose.yml`
- Startup script: `start.sh`

## API Contract Notes
- API is mounted under `/api`.
- Public:
- `GET /api/health`
- `POST /api/login`
- Protected:
- `POST /api/rcon` with Bearer token.
- `POST /api/rcon` payload uses tagged action:
- `{"action":"connect","host":"...","port":27050,"password":"..."}`
- `{"action":"command","command":"status"}`
- `{"action":"disconnect"}`

## Environment
Backend important env vars:
- `AUTH_TOKEN`
- `PORT` (default `3000`)
- `ENCRYPTION_KEY`
- `ENCRYPTION_METHOD` (`chacha`)

Frontend/dev:
- `FRONT_PORT` (fallback `5173`)
- Dev proxy forwards `/api` to backend.

## Local Run
Frontend:
```bash
cd frontend
yarn install --immutable
yarn dev
```

Backend:
```bash
cd backend
cargo run
```

Dev stack via Docker:
```bash
docker compose up --build
```

## Required Checks Before Merge
Frontend:
```bash
cd frontend
yarn lint
yarn build
```

Backend:
```bash
cd backend
cargo fmt -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo build
```

If Docker/infra files changed (`Dockerfile*`, `docker-compose.yml`, `nginx/*`, `start.sh`):
```bash
docker compose build rcon-dev
docker compose up -d rcon-dev
docker compose ps rcon-dev
docker compose down
```

## Change Rules
- Keep changes targeted; avoid unrelated refactors.
- Do not break frontend API prefix usage (`baseURL: "/api"`).
- Do not change backend request/response contracts without synchronized frontend updates.
- Never commit real secrets.
- Preserve existing file naming unless task explicitly asks otherwise.
- Note: file `frontend/src/handlers/disconnet.ts` is intentionally named this way in current code; renaming must include all import updates.

## CI/Automation Notes
- CI currently runs Rust lint/format and frontend lint in GitHub Actions.
- Renovate config/workflow may be added or removed over time; always verify current `.github/workflows` before editing automation behavior.
