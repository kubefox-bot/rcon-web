# === Stage: Frontend ===
FROM marcaureln/volta:2.0.2-bookworm-slim AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml frontend/.yarn/ ./
RUN yarn install --immutable

COPY frontend/ ./
RUN yarn build


# === Stage: Backend (без cargo-chef, fast build)
FROM rust:1.86-slim AS backend-builder

RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev curl bash musl-tools && \
    rm -rf /var/lib/apt/lists/*

RUN rustup target add x86_64-unknown-linux-musl

WORKDIR /backend
COPY backend/ .

RUN cargo build --release --target x86_64-unknown-linux-musl
RUN strip target/x86_64-unknown-linux-musl/release/rcon-api

# === Final dev image with nginx + backend
FROM nginx:1.27-alpine

RUN apk add --no-cache libssl3 gettext

# 📦 backend
COPY --from=backend-builder /backend/target/x86_64-unknown-linux-musl/release/rcon-api /usr/local/bin/rcon-api

# 🌐 frontend
COPY --from=frontend-builder /frontend/dist /var/www/html

# 📄 nginx шаблон
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template

# 🛠 стартовый скрипт
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]
