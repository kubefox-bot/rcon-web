FROM marcaureln/volta:2.0.1-bookworm-slim AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml .yarn/ ./
RUN yarn install --immutable

COPY . .
RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

# Устанавливаем только нужную CLI-зависимость
RUN corepack enable && yarn dlx serve --version

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["yarn", "dlx", "serve", "dist", "-l", "4173"]
