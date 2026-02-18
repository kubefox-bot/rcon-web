# AGENTS.md

## Goal
This document helps agents make changes in `rcon-web` quickly without unnecessary assumptions.

## Project Overview
- Monorepo web interface for managing CS2 via RCON.
- Frontend: Vue 3 + Vite + TypeScript (`frontend/`).
- Backend: Rust + Axum (`backend/`).
- Production and dev runtime: Docker + Nginx (`Dockerfile*`, `docker-compose.yml`, `prod/`).

## Project Map
- `frontend/src/components/` UI components.
- `frontend/src/composables/` client-side business logic.
- `frontend/src/handlers/` client API handlers.
- `frontend/src/lib/api.ts` shared axios client (`baseURL: "/api"`).
- `backend/src/app/router.rs` API routes.
- `backend/src/auth/` login, JWT, middleware.
- `backend/src/handlers/` RCON handlers (`connect`, `command`, `disconnect`).
- `backend/src/models/request.rs` input format for RCON requests.
- `backend/src/models/response.rs` unified API response format.
- `prod/` example production config (compose + certs).

## API Notes
- Backend mounts all API routes under `/api`.
- Public routes: `GET /api/health`, `POST /api/login` (`{ "password": "..." }`).
- Protected route: `POST /api/rcon` with Bearer token.
- `POST /api/rcon` body (tagged enum):
- `{"action":"connect","host":"...","port":27050,"password":"..."}`
- `{"action":"command","command":"status"}`
- `{"action":"disconnect"}`

## Environment Variables
Key backend env vars:
- `AUTH_TOKEN` (login/JWT secret)
- `PORT` (default: `3000`)
- `ENCRYPTION_KEY` (32 bytes for chacha)
- `ENCRYPTION_METHOD` (currently expected: `chacha`)

Key frontend/dev env vars:
- `FRONT_PORT` (fallback: `5173`)
- In dev, Vite proxies `/api` to `http://localhost:3000`.

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

Via Docker dev compose:
```bash
docker compose up --build
```

## Pre-Delivery Checks
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

## SKILLS (Required Verification Process)
- For any project change, run both validation flows:
- Frontend: `cd frontend && yarn lint && yarn build`
- Backend: `cd backend && cargo fmt -- --check && cargo clippy --all-targets --all-features -- -D warnings && cargo build`
- If `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `nginx/*`, `start.sh`, or networking/infra code changed:
- required: verify dev image build: `docker compose build rcon-dev`
- required: run compose smoke check: `docker compose up -d rcon-dev && docker compose ps rcon-dev && docker compose down`
- If local limitations block checks (no Docker daemon, busy ports), report this explicitly.

## Change Rules
- Do not break API prefix behavior: on frontend use `api.post("/login", ...)`, not `"/api/login"` on top of `baseURL`.
- Do not change `RconRequest` contract without synchronizing frontend handlers.
- Do not commit real secrets to `.env`.
- If auth/JWT changes, verify `401` flow (frontend triggers `forceLogout()` in interceptor).
- Prefer minimal, targeted changes; avoid unrelated mass refactors.

## Useful Notes
- CI checks Rust (`clippy` + `fmt --check`) and Frontend (`yarn lint`, Biome).
- Repository contains `frontend/src/handlers/disconnet.ts` (filename typo is intentional for now). Do not rename it unless explicitly requested, to avoid breaking imports.
