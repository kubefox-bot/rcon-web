FROM marcaureln/volta:2.0.2-bookworm-slim AS builder

WORKDIR /app

# Копируем lock-файлы и Yarn config
COPY package.json frontend/yarn.lock frontend/.yarnrc.yml ./
COPY .yarn/ ./.yarn/

# Обязательно устанавливаем зависимости!
RUN corepack enable && yarn install --immutable

# Затем копируем всё остальное (включая src, tsconfig и т.п.)
COPY frontend/ ./

# Теперь можно билдить
RUN yarn build