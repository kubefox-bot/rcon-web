
# 📦 RCON UI + API — Dev & Prod Guide

Полноценный веб-интерфейс для управления CS2-сервером через RCON. Состоит из фронтенда на Vue 3 и backend API на Rust (Axum).

---

## 🔧 Стек
- **Frontend:** Vue 3 + Vite
- **Backend:** Rust + Axum
- **Прод-сборка:** Docker Compose + Nginx

---

## ⚙️ Режимы работы

### 👨‍💻 Dev-режим (локальная разработка)
- Backend запускается в Docker (`localhost:3000`)
- Frontend запускается через `vite` (`localhost:5173`)
- Прокси на `/api` направляет запросы с фронта к бэкенду

### 🚀 Prod-режим (примеры для самостоятельного запуска)
- Все сервисы (frontend, backend, nginx, CS2) могут быть запущены через Docker Compose
- Примерная конфигурация для прод-сервера содержится в папке `prod`
- Можно использовать любой внешний порт и домен

---

## 📁 Папка `prod`

В корне проекта находится папка `prod`, содержащая **примерную продовую конфигурацию**:

- `prod/docker-compose.yml` — пример сборки backend, frontend и nginx
- `prod/nginx/default.conf` — nginx-конфиг с проксированием `/api` и SPA fallback

> ⚠️ Также может использоваться как dev-обёртка для backend в Docker

---

## 📁 Корневая конфигурация

- `docker-compose.yml` — основной Docker Compose для dev
- `nginx/default.conf` — может быть использован как dev-прокси при разработке или для прода

---

## 👨‍💻 Dev: Быстрый старт

### 1. Запуск backend
```bash
cd prod

docker compose -f ../docker-compose.yml -f docker-compose.dev.yml up backend --build
```
> Backend будет доступен на: `http://localhost:3000`


### 2. Запуск frontend
```bash
cd frontend

yarn install
yarn dev
```
> Frontend доступен на: `http://localhost:5173`

---

## 🔁 Прокси в Vite (dev)

Файл `vite.config.ts` содержит:
```ts
server: {
  host: 'localhost',
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      // ВАЖНО: без rewrite
    },
  },
},
```

---

## 📡 Запросы из фронта

Библиотека `axios` настроена на `baseURL: '/api'`,
поэтому используем:

```ts
api.post('/login', { password })
```
а не:
```ts
api.post('/api/login', ...) // ❌ будет /api/api/login
```

---

## ✅ Проверка (dev)

1. Открыть `http://localhost:5173`
2. Логин отправит запрос на `POST /api/login`
3. Прокси направит его на `localhost:3000/api/login`
4. Backend вернёт JWT

---

## 🛠️ Прод-запуск (пример)

1. Убедитесь, что внешний порт (например, `3000`) проброшен на хост
2. Пропишите свой домен в конфиге nginx (если используется)
3. В папке `prod`:

```bash
cd prod

docker compose up -d --pull always
```

4. Откройте в браузере внешний адрес, например: `http://your-server:3000`

---

## 🧼 Troubleshooting

- Если получаешь `404` — проверь, не включён ли `rewrite` в `vite.config.ts`
- Backend использует `tracing` для диагностики; пароли и JWT в логи не выводятся
- Убедись, что `yarn dev` перезапускается после изменения `vite.config.ts`

---

## Проверка исправлений

Регрессионные тесты используют Bun без дополнительных npm-зависимостей. Для
фронтенд-тестов установите зависимости через существующий Yarn lockfile с локальным
переопределением linker (Bun запускается с `node_modules`):

```bash
cd frontend
YARN_NODE_LINKER=node-modules yarn install --immutable
bun test tests
YARN_NODE_LINKER=node-modules yarn lint
YARN_NODE_LINKER=node-modules yarn exec vue-tsc --noEmit
YARN_NODE_LINKER=node-modules yarn build
```

Интеграционный тест авторизации запускает отдельный локальный backend с тестовыми
секретами, проверяет успешный/неуспешный вход и отсутствие паролей и JWT в логах:

```bash
cd backend
cargo build --locked
bun test tests
cargo test --locked
cargo fmt -- --check
cargo clippy --all-targets --all-features -- -D warnings
```

Изменения сгенерированных `.pnp.*`, `.yarn/install-state.gz` и платформенных архивов
после локальной установки зависимостей не входят в исправления.
