#!/bin/bash

# Оптимізований скрипт для налаштування PocketBase на Hetzner VPS
# IP: 91.98.74.36
# Запуск: chmod +x hetzner-setup-optimized.sh && ./hetzner-setup-optimized.sh

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Функції логування
log() {
    echo -e "${BLUE}[PocketBase-Setup]${NC} $1"
}

success() {
    echo -e "${GREEN}[PocketBase-Setup]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[PocketBase-Setup]${NC} ⚠️ $1"
}

error() {
    echo -e "${RED}[PocketBase-Setup]${NC} ❌ $1"
}

info() {
    echo -e "${PURPLE}[PocketBase-Setup]${NC} ℹ️ $1"
}

# Заголовок
print_header() {
    echo -e "${PURPLE}"
    echo "════════════════════════════════════════════════════════════════"
    echo "🚀 PocketBase Setup для Hetzner VPS (91.98.74.36)"
    echo "🎯 Supabase-сумісна конфігурація"
    echo "════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Перевірка системи
check_system() {
    log "Перевірка системи..."
    
    # OS Info
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        info "Операційна система: $PRETTY_NAME"
    fi
    
    # Resources
    info "CPU: $(nproc) cores"
    info "RAM: $(free -h | awk '/^Mem:/ {print $2}') total"
    info "Disk: $(df -h / | awk 'NR==2 {print $4}') доступно"
    
    # Check if root
    if [[ $EUID -eq 0 ]]; then
        success "Запущено від root користувача"
    else
        error "Цей скрипт потребує root привілеїв"
        exit 1
    fi
}

# Перевірка чи PocketBase вже встановлений
check_existing_pocketbase() {
    log "Перевірка існуючого PocketBase..."
    
    if systemctl is-active --quiet pocketbase 2>/dev/null; then
        warning "PocketBase сервіс вже запущений"
        info "Перевіряємо версію..."
        
        if [ -f /home/pocketbase/pocketbase ]; then
            PB_VERSION=$(/home/pocketbase/pocketbase --version 2>/dev/null || echo "unknown")
            info "Поточна версія: $PB_VERSION"
        fi
        
        read -p "Переінсталювати PocketBase? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            info "Пропускаємо встановлення PocketBase"
            return 1
        fi
        
        log "Зупиняємо існуючий PocketBase..."
        systemctl stop pocketbase || true
    fi
    
    return 0
}

# Оновлення системи
update_system() {
    log "Оновлення системи..."
    export DEBIAN_FRONTEND=noninteractive
    apt update -qq
    apt upgrade -y -qq
    success "Система оновлена"
}

# Встановлення пакетів
install_packages() {
    log "Встановлення необхідних пакетів..."
    
    apt install -y -qq \
        curl \
        wget \
        unzip \
        nginx \
        ufw \
        htop \
        nano \
        certbot \
        python3-certbot-nginx \
        fail2ban
    
    success "Пакети встановлено"
}

# Створення користувача pocketbase
create_user() {
    if id "pocketbase" &>/dev/null; then
        warning "Користувач pocketbase вже існує"
    else
        log "Створення користувача pocketbase..."
        useradd -m -s /bin/bash pocketbase
        success "Користувач pocketbase створено"
    fi
}

# Завантаження та встановлення PocketBase
install_pocketbase() {
    log "Завантаження останньої версії PocketBase..."
    
    # Отримуємо останню версію з GitHub API
    LATEST_VERSION=$(curl -s https://api.github.com/repos/pocketbase/pocketbase/releases/latest | grep '"tag_name"' | cut -d '"' -f 4)
    
    if [ -z "$LATEST_VERSION" ]; then
        error "Не вдалося отримати останню версію PocketBase"
        exit 1
    fi
    
    log "Остання версія PocketBase: $LATEST_VERSION"
    
    # Очищуємо робочу директорію
    cd /home/pocketbase
    rm -rf pocketbase pb_data pb_migrations *.zip
    
    # Завантажуємо PocketBase
    DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/$LATEST_VERSION/pocketbase_${LATEST_VERSION#v}_linux_amd64.zip"
    
    log "Завантаження з: $DOWNLOAD_URL"
    wget -q "$DOWNLOAD_URL" -O pocketbase.zip
    
    # Розпаковуємо
    unzip -q pocketbase.zip
    chmod +x pocketbase
    
    # Створюємо директорії
    mkdir -p pb_data pb_migrations pb_hooks
    
    # Встановлюємо права доступу
    chown -R pocketbase:pocketbase /home/pocketbase
    
    # Видаляємо архів
    rm pocketbase.zip
    
    success "PocketBase $LATEST_VERSION встановлено"
}

# Створення systemd service
create_systemd_service() {
    log "Створення systemd service..."
    
    cat > /etc/systemd/system/pocketbase.service << 'EOF'
[Unit]
Description=PocketBase Service (Supabase Compatible)
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=pocketbase
Group=pocketbase
WorkingDirectory=/home/pocketbase
ExecStart=/home/pocketbase/pocketbase serve --http=0.0.0.0:8090 --dir=/home/pocketbase/pb_data
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=pocketbase

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/home/pocketbase

# Resource limits
LimitNOFILE=65536
LimitNPROC=4096

# Graceful shutdown
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=30

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable pocketbase
    
    success "Systemd service створено та увімкнено"
}

# Налаштування Nginx
setup_nginx() {
    log "Налаштування Nginx..."
    
    # Створюємо конфігурацію для PocketBase
    cat > /etc/nginx/sites-available/pocketbase << 'EOF'
# PocketBase Nginx Configuration (Supabase Compatible)
server {
    listen 80;
    listen [::]:80;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # Increase upload size (для файлів)
    client_max_body_size 100M;
    client_body_timeout 120s;
    
    # Main proxy to PocketBase
    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts для великих файлів
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # CORS headers (для web додатків)
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

    # Health check endpoint (не логується)
    location /api/health {
        proxy_pass http://127.0.0.1:8090/api/health;
        access_log off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Admin panel
    location /_/ {
        proxy_pass http://127.0.0.1:8090/_/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Активуємо конфігурацію
    ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
    
    # Видаляємо default конфігурацію
    rm -f /etc/nginx/sites-enabled/default
    
    # Тестуємо конфігурацію
    if nginx -t; then
        systemctl reload nginx
        success "Nginx налаштовано та перезавантажено"
    else
        error "Помилка в конфігурації Nginx"
        exit 1
    fi
}

# Налаштування firewall
setup_firewall() {
    log "Налаштування UFW firewall..."
    
    # Скидаємо правила
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Дозволяємо необхідні порти
    ufw allow 22/tcp comment 'SSH'
    ufw allow 80/tcp comment 'HTTP'
    ufw allow 443/tcp comment 'HTTPS'
    ufw allow 8090/tcp comment 'PocketBase Direct'
    
    # Увімкнення firewall
    ufw --force enable
    
    success "Firewall налаштовано"
}

# Налаштування fail2ban
setup_fail2ban() {
    log "Налаштування fail2ban..."
    
    # Базова конфігурація
    cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
EOF

    systemctl enable fail2ban
    systemctl restart fail2ban
    
    success "Fail2ban налаштовано"
}

# Запуск PocketBase
start_pocketbase() {
    log "Запуск PocketBase..."
    
    systemctl start pocketbase
    
    # Чекаємо кілька секунд
    sleep 5
    
    # Перевіряємо статус
    if systemctl is-active --quiet pocketbase; then
        success "PocketBase успішно запущено"
        
        # Отримуємо версію
        if [ -f /home/pocketbase/pocketbase ]; then
            PB_VERSION=$(/home/pocketbase/pocketbase --version 2>/dev/null || echo "unknown")
            info "Запущена версія: $PB_VERSION"
        fi
    else
        error "Не вдалося запустити PocketBase"
        log "Перевірте логи: journalctl -u pocketbase -f"
        exit 1
    fi
}

# Тестування підключення
test_connection() {
    log "Тестування підключення..."
    
    # Локальний тест
    if curl -f -s http://localhost:8090/api/health > /dev/null; then
        success "✅ PocketBase доступний локально (порт 8090)"
    else
        error "❌ PocketBase недоступний локально"
        return 1
    fi
    
    # Тест через Nginx
    if curl -f -s http://localhost:80/api/health > /dev/null; then
        success "✅ PocketBase доступний через Nginx (порт 80)"
    else
        warning "⚠️ PocketBase може бути недоступний через Nginx"
    fi
    
    return 0
}

# Фінальна інформація
show_final_info() {
    echo
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}🎉 PocketBase успішно встановлено та налаштовано!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo
    
    # Статус сервісів
    log "📊 Статус сервісів:"
    systemctl is-active --quiet pocketbase && echo "   ✅ PocketBase: Запущено" || echo "   ❌ PocketBase: Не запущено"
    systemctl is-active --quiet nginx && echo "   ✅ Nginx: Запущено" || echo "   ❌ Nginx: Не запущено"
    systemctl is-active --quiet fail2ban && echo "   ✅ Fail2ban: Запущено" || echo "   ❌ Fail2ban: Не запущено"
    ufw status | grep -q "Status: active" && echo "   ✅ UFW Firewall: Активний" || echo "   ❌ UFW Firewall: Неактивний"
    
    echo
    log "🌐 Доступні URL:"
    echo "   📡 PocketBase API: http://91.98.74.36:8090"
    echo "   🌍 PocketBase через Nginx: http://91.98.74.36"
    echo "   🛠️ Admin панель: http://91.98.74.36/_/"
    echo "   ❤️ Health check: http://91.98.74.36/api/health"
    
    echo
    warning "📝 НАСТУПНІ КРОКИ:"
    echo "   1. Відкрийте http://91.98.74.36/_/ в браузері"
    echo "   2. Створіть першого адміністратора"
    echo "   3. Оновіть .env файл:"
    echo "      VITE_POCKETBASE_URL=http://91.98.74.36:8090"
    echo "   4. Запустіть setup скрипт: node pocketbase-setup.js"
    
    echo
    info "💡 Корисні команди:"
    echo "   Статус: systemctl status pocketbase"
    echo "   Логи: journalctl -u pocketbase -f"
    echo "   Перезапуск: systemctl restart pocketbase"
    echo "   Nginx логи: tail -f /var/log/nginx/access.log"
}

# Головна функція
main() {
    print_header
    
    check_system
    
    if check_existing_pocketbase; then
        update_system
        install_packages
        create_user
        install_pocketbase
        create_systemd_service
    fi
    
    setup_nginx
    setup_firewall
    setup_fail2ban
    start_pocketbase
    test_connection
    
    show_final_info
    
    echo
    success "🚀 Встановлення завершено! PocketBase готовий до використання."
}

# Запуск
main "$@"

