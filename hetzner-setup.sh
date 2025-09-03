#!/bin/bash

# Скрипт автоматичного налаштування PocketBase на Hetzner VPS
# Запуск: chmod +x hetzner-setup.sh && ./hetzner-setup.sh

set -e

# Кольори для виводу
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функція логування
log() {
    echo -e "${BLUE}[HetznerSetup]${NC} $1"
}

success() {
    echo -e "${GREEN}[HetznerSetup]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[HetznerSetup]${NC} ⚠️ $1"
}

error() {
    echo -e "${RED}[HetznerSetup]${NC} ❌ $1"
}

# Перевірка чи запущено від root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        warning "Скрипт запущено від root. Буде створено користувача pocketbase."
    else
        error "Цей скрипт потребує root привілеїв. Запустіть: sudo $0"
        exit 1
    fi
}

# Оновлення системи
update_system() {
    log "Оновлення системи..."
    apt update && apt upgrade -y
    success "Система оновлена"
}

# Встановлення необхідних пакетів
install_packages() {
    log "Встановлення необхідних пакетів..."
    apt install -y curl wget unzip nginx ufw htop
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
    log "Завантаження PocketBase..."
    
    # Отримуємо останню версію
    LATEST_VERSION=$(curl -s https://api.github.com/repos/pocketbase/pocketbase/releases/latest | grep '"tag_name"' | cut -d '"' -f 4)
    log "Остання версія PocketBase: $LATEST_VERSION"
    
    # Завантажуємо
    cd /home/pocketbase
    wget "https://github.com/pocketbase/pocketbase/releases/download/$LATEST_VERSION/pocketbase_${LATEST_VERSION#v}_linux_amd64.zip"
    
    # Розпаковуємо
    unzip "pocketbase_${LATEST_VERSION#v}_linux_amd64.zip"
    chmod +x pocketbase
    chown pocketbase:pocketbase pocketbase
    
    # Створюємо директорії
    mkdir -p pb_data pb_migrations
    chown -R pocketbase:pocketbase /home/pocketbase
    
    # Видаляємо архів
    rm "pocketbase_${LATEST_VERSION#v}_linux_amd64.zip"
    
    success "PocketBase встановлено"
}

# Створення systemd service
create_systemd_service() {
    log "Створення systemd service..."
    
    cat > /etc/systemd/system/pocketbase.service << EOF
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=pocketbase
Group=pocketbase
WorkingDirectory=/home/pocketbase
ExecStart=/home/pocketbase/pocketbase serve --http=0.0.0.0:8090
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=pocketbase
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    systemctl enable pocketbase
    
    success "Systemd service створено"
}

# Налаштування firewall
setup_firewall() {
    log "Налаштування firewall..."
    
    # Базові правила
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Дозволені порти
    ufw allow ssh
    ufw allow 80/tcp   # HTTP
    ufw allow 443/tcp  # HTTPS
    ufw allow 8090/tcp # PocketBase
    
    # Увімкнення firewall
    ufw --force enable
    
    success "Firewall налаштовано"
}

# Налаштування Nginx (опціонально)
setup_nginx() {
    log "Налаштування Nginx для PocketBase..."
    
    # Створюємо конфігурацію
    cat > /etc/nginx/sites-available/pocketbase << EOF
server {
    listen 80;
    server_name _;

    # Збільшуємо розмір файлів для завантаження
    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Таймаути для великих файлів
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:8090/api/health;
        access_log off;
    }
}
EOF

    # Активуємо конфігурацію
    ln -sf /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Перевіряємо конфігурацію
    nginx -t
    systemctl reload nginx
    
    success "Nginx налаштовано"
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
    else
        error "Не вдалося запустити PocketBase"
        log "Перевірте логи: journalctl -u pocketbase -f"
        exit 1
    fi
}

# Перевірка доступності
test_connection() {
    log "Тестування підключення..."
    
    # Тестуємо локальне підключення
    if curl -f -s http://localhost:8090/api/health > /dev/null; then
        success "PocketBase доступний локально на порту 8090"
    else
        error "PocketBase недоступний локально"
        exit 1
    fi
    
    # Отримуємо IP сервера
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "unknown")
    
    if [ "$SERVER_IP" != "unknown" ]; then
        log "IP сервера: $SERVER_IP"
        log "PocketBase буде доступний за адресою: http://$SERVER_IP:8090"
        log "Admin панель: http://$SERVER_IP:8090/_/"
    fi
}

# Створення першого адміністратора
create_admin() {
    log "Інструкції для створення адміністратора:"
    echo
    warning "Відкрийте браузер та перейдіть до:"
    
    SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "your-server-ip")
    echo "   http://$SERVER_IP:8090/_/"
    echo
    warning "Створіть першого адміністратора з credentials:"
    echo "   Email: admin@example.com (або ваш email)"
    echo "   Password: безпечний пароль"
    echo
    warning "ЦІ ДАННІ ПОТРІБНО БУДЕ ВИКОРИСТАТИ В .env ФАЙЛІ!"
}

# Відображення фінального статусу
show_final_status() {
    echo
    success "🎉 Налаштування PocketBase завершено!"
    echo
    log "📊 Статус сервісів:"
    systemctl is-active --quiet pocketbase && echo "   ✅ PocketBase: Запущено" || echo "   ❌ PocketBase: Не запущено"
    systemctl is-active --quiet nginx && echo "   ✅ Nginx: Запущено" || echo "   ❌ Nginx: Не запущено"
    ufw status | grep -q "Status: active" && echo "   ✅ Firewall: Активний" || echo "   ❌ Firewall: Неактивний"
    
    echo
    log "🌐 Доступні URL:"
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "your-server-ip")
    echo "   PocketBase API: http://$SERVER_IP:8090"
    echo "   Admin панель: http://$SERVER_IP:8090/_/"
    echo "   Health check: http://$SERVER_IP:8090/api/health"
    
    echo
    log "📝 Наступні кроки:"
    echo "   1. Відкрийте http://$SERVER_IP:8090/_/ в браузері"
    echo "   2. Створіть першого адміністратора"
    echo "   3. Оновіть .env файл з новим URL: VITE_POCKETBASE_URL=http://$SERVER_IP:8090"
    echo "   4. Запустіть setup скрипт: node pocketbase-setup.js"
    
    echo
    warning "💡 Корисні команди:"
    echo "   Статус PocketBase: systemctl status pocketbase"
    echo "   Логи PocketBase: journalctl -u pocketbase -f"
    echo "   Перезапуск: systemctl restart pocketbase"
}

# Головна функція
main() {
    log "🚀 Початок налаштування PocketBase на Hetzner VPS"
    echo
    
    check_root
    update_system
    install_packages
    create_user
    install_pocketbase
    create_systemd_service
    setup_firewall
    setup_nginx
    start_pocketbase
    test_connection
    
    echo
    create_admin
    show_final_status
}

# Запуск головної функції
main "$@"

