#!/bin/sh
set -e

echo "📦 Starting backend..."
cd /app
/usr/local/bin/rcon-api &

# Генерация nginx.conf по окружению
if [ "$RCON_DOMAIN" = "localhost" ]; then
  echo "🔐 Using HTTP (domain: $RCON_DOMAIN)"
  cp /etc/nginx/nginx.http.conf /etc/nginx/nginx.conf
else
  echo "🔐 Using HTTPS with TLS (domain: $RCON_DOMAIN)"
  cp /etc/nginx/nginx.https.conf /etc/nginx/nginx.conf
  envsubst '${RCON_DOMAIN}' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf.tmp
  mv /etc/nginx/nginx.conf.tmp /etc/nginx/nginx.conf
fi

echo "🚀 Starting nginx..."
nginx -g "daemon off;"
