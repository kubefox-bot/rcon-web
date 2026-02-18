# AGENTS.md

## Цель
Этот документ помогает агентам быстро вносить изменения в `rcon-web` без лишних предположений.

## Что это за проект
- Монорепо веб-интерфейса для управления CS2 через RCON.
- Frontend: Vue 3 + Vite + TypeScript (`frontend/`).
- Backend: Rust + Axum (`backend/`).
- Прод и dev-обвязка: Docker + Nginx (`Dockerfile*`, `docker-compose.yml`, `prod/`).

## Карта проекта
- `frontend/src/components/` UI-компоненты.
- `frontend/src/composables/` клиентская бизнес-логика.
- `frontend/src/handlers/` клиентские обработчики вызовов API.
- `frontend/src/lib/api.ts` общий axios-клиент (`baseURL: "/api"`).
- `backend/src/app/router.rs` маршруты API.
- `backend/src/auth/` логин, JWT, middleware.
- `backend/src/handlers/` RCON-обработчики (`connect`, `command`, `disconnect`).
- `backend/src/models/request.rs` входной формат RCON-запросов.
- `backend/src/models/response.rs` единый формат API-ответов.
- `prod/` пример прод-конфигурации (compose + certs).

## API, о котором важно помнить
- Backend монтирует API под префиксом `/api`.
- Открытые маршруты: `GET /api/health`, `POST /api/login` (`{ "password": "..." }`).
- Защищённый маршрут: `POST /api/rcon` с `Bearer` токеном.
- Тело `POST /api/rcon` (tagged enum):
- `{"action":"connect","host":"...","port":27050,"password":"..."}`
- `{"action":"command","command":"status"}`
- `{"action":"disconnect"}`

## Переменные окружения
Ключевые env для backend:
- `AUTH_TOKEN` (секрет для логина/JWT)
- `PORT` (по умолчанию `3000`)
- `ENCRYPTION_KEY` (32 байта для chacha)
- `ENCRYPTION_METHOD` (сейчас ожидается `chacha`)

Ключевые env для frontend/dev:
- `FRONT_PORT` (иначе `5173`)
- В dev Vite проксирует `/api` на `http://localhost:3000`.

## Локальный запуск
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

Через Docker (образ со всем вместе):
```bash
docker compose up --build
```

## Проверки перед сдачей
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

## Правила изменений
- Не ломать префикс API: на фронте использовать `api.post("/login", ...)`, а не `"/api/login"` поверх `baseURL`.
- Не менять контракт `RconRequest` без синхронного обновления frontend-обработчиков.
- Не коммитить реальные секреты в `.env`.
- Если меняется auth/JWT, проверять сценарий `401` (frontend делает `forceLogout()` в interceptor).
- Предпочитать минимальные и целевые правки, без массовых рефакторов не по задаче.

## Полезные замечания
- В CI проверяются Rust (`clippy` + `fmt --check`) и Frontend (`yarn lint`, Biome).
- В репозитории есть файл `frontend/src/handlers/disconnet.ts` с таким именем (опечатка в имени файла). Не переименовывать без явной задачи, чтобы не сломать импорты.
