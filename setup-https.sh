#!/bin/bash
# Скрипт для налаштування HTTPS для PocketBase через DuckDNS

set -e

# Кольори
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${BLUE}[HTTPS-Setup]${NC} $1"; }
success() { echo -e "${GREEN}[HTTPS-Setup]${NC} ✅ $1"; }
warning() { echo -e "${YELLOW}[HTTPS-Setup]${NC} ⚠️ $1"; }

# Змінні (замініть на ваші)
DOMAIN="yournamepocketbase.duckdns.org"
EMAIL="admin@example.com"

log "🌐 Налаштування HTTPS для домену: $DOMAIN"

# Встановлення Certbot
log "📦 Встановлення Certbot..."
apt update
apt install -y snapd
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# Отримання SSL сертифікату
log "🔒 Отримання SSL сертифікату від Let's Encrypt..."
certbot certonly --standalone --preferred-challenges http -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Оновлення Nginx конфігурації для HTTPS
log "🔧 Оновлення Nginx конфігурації..."
cat > /etc/nginx/sites-available/pocketbase << 'NGINX_HTTPS'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name DOMAIN_PLACEHOLDER;
    
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since" always;
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since" always;
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }
}
NGINX_HTTPS

# Заміна placeholder'а на реальний домен
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/pocketbase

# Тестування та перезапуск Nginx
log "🔄 Перезапуск Nginx..."
nginx -t && systemctl reload nginx

# Налаштування автоматичного оновлення сертифікатів
log "🔄 Налаштування автоматичного оновлення..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Оновлення firewall
log "🔥 Оновлення firewall..."
ufw allow 443/tcp

success "🎉 HTTPS налаштовано!"
echo
echo -e "${GREEN}🌐 Ваш PocketBase тепер доступний за адресою:${NC}"
echo -e "${GREEN}   https://$DOMAIN${NC}"
echo -e "${GREEN}   https://$DOMAIN/_/ (адмін панель)${NC}"
echo
warning "📝 Оновіть .env файл:"
echo "   VITE_POCKETBASE_URL=https://$DOMAIN"
