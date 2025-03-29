FROM rust:1.85-alpine AS builder
RUN apk add --no-cache musl-dev openssl-dev pkgconfig openssl-libs-static
WORKDIR /app
COPY . .
RUN cargo build --release --locked


FROM alpine:3.21
RUN apk add --no-cache libssl3
COPY --from=builder /app/target/release/rcon-api /usr/local/bin/app
COPY .env /app/.env
WORKDIR /app

EXPOSE 3000

CMD ["app"]