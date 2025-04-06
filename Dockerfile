FROM nginx:1.27-alpine

RUN apk add --no-cache libssl3 gettext

# 📦 backend — уже собранный бинарник
COPY backend/target/release/rcon-api /usr/local/bin/rcon-api

# 🌐 frontend — собранный дист
COPY frontend/dist /var/www/html

# 📄 nginx конфиги
COPY nginx/nginx.http.conf /etc/nginx/nginx.http.conf
COPY nginx/nginx.https.conf /etc/nginx/nginx.https.conf

# 🛠 старт
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 80
CMD ["/start.sh"]
