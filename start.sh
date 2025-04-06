#!/bin/sh
set -e

echo "📦 Starting backend..."
cd /app
/usr/local/bin/rcon-api &



echo "🌐 Starting nginx..."
envsubst '${RCON_DOMAIN}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"
