# ==========================
# 🧱 Билдер-этап (мультистейдж) с cargo-chef
# ==========================
FROM rust:1.85-alpine AS chef
RUN apk add --no-cache musl-dev openssl-dev pkgconfig openssl-libs-static curl bash

WORKDIR /app

# Устанавливаем cargo-chef (для кэшируемой сборки зависимостей)
RUN cargo install cargo-chef

# Копируем манифесты и генерируем план
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Ставим зависимости по рецепту
FROM rust:1.85-alpine AS planner
RUN apk add --no-cache musl-dev openssl-dev pkgconfig openssl-libs-static curl bash
WORKDIR /app

RUN cargo install cargo-chef
COPY --from=chef /app/recipe.json recipe.json
COPY . .
RUN cargo chef cook --release --recipe-path recipe.json

# Сборка приложения
FROM rust:1.85-alpine AS builder
RUN apk add --no-cache musl-dev openssl-dev pkgconfig openssl-libs-static curl bash
WORKDIR /app

COPY . .
COPY --from=planner /app/target target
COPY --from=planner /usr/local/cargo /usr/local/cargo

RUN cargo build --release --target x86_64-unknown-linux-musl
RUN strip target/x86_64-unknown-linux-musl/release/rcon-api

# ==========================
# 🧊 Финальный образ
# ==========================
FROM alpine:3.21

RUN apk add --no-cache libssl3

COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/rcon-api /usr/local/bin/app

# ⛔ Не копируем .env внутрь образа — пользователь должен примонтировать его снаружи
WORKDIR /app

EXPOSE 3000
CMD ["app"]
