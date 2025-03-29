FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare yarn@4.7.0 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml .yarn/ ./

RUN yarn install --immutable

COPY . .

RUN yarn build



FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare yarn@4.7.0 --activate

WORKDIR /app


COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/.yarn/ ./


RUN yarn install --immutable

EXPOSE 4173

CMD ["yarn", "preview", "--host"]
