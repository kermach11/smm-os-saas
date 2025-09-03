# 🚀 PocketBase Storage Setup Guide

## Суpabase-сумісний PocketBase для Hetzner VPS

Цей гід допоможе налаштувати PocketBase на Hetzner VPS так, щоб він працював **ідентично** до Supabase Storage.

## ✨ Особливості

- 🔄 **Повна сумісність з Supabase** - той самий API, ті самі методи
- 🎯 **Drop-in replacement** - заміна без зміни коду
- 🌐 **Уніфікований інтерфейс** - StorageServiceSwitcher автоматично керує провайдерами
- 📦 **Ідентичні bucket names** - як в Supabase
- 🔧 **Автоматичний fallback** - якщо один провайдер недоступний, використовується інший

## 📋 Передумови

1. **Hetzner VPS** з Ubuntu/Debian
2. **PocketBase** встановлений та запущений
3. **Node.js** для запуску setup скрипта

## 🛠️ Налаштування

### 1. Підготовка Hetzner VPS

```bash
# Підключіться до VPS
ssh root@your-server-ip

# Оновіть систему
apt update && apt upgrade -y

# Встановіть необхідні пакети
apt install -y curl wget unzip nginx certbot python3-certbot-nginx

# Створіть користувача для PocketBase
useradd -m -s /bin/bash pocketbase
su - pocketbase
```

### 2. Встановлення PocketBase

```bash
# Завантажте останню версію PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip

# Розпакуйте
unzip pocketbase_0.20.0_linux_amd64.zip

# Зробіть виконуваним
chmod +x pocketbase

# Створіть директорію для даних
mkdir pb_data

# Запустіть PocketBase (для первинного налаштування)
./pocketbase serve --http=0.0.0.0:8090
```

### 3. Налаштування systemd service

```bash
# Створіть service файл
sudo nano /etc/systemd/system/pocketbase.service
```

```ini
[Unit]
Description=PocketBase Service
After=network.target

[Service]
Type=simple
User=pocketbase
Group=pocketbase
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
```

```bash
# Активуйте сервіс
sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
sudo systemctl status pocketbase
```

### 4. Налаштування Nginx (опціонально)

```bash
# Створіть конфігурацію Nginx
sudo nano /etc/nginx/sites-available/pocketbase
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активуйте конфігурацію
sudo ln -s /etc/nginx/sites-available/pocketbase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Налаштуйте SSL (опціонально)
sudo certbot --nginx -d your-domain.com
```

### 5. Запуск setup скрипта

```bash
# В директорії проекту
cd main/

# Встановіть environment variables
export POCKETBASE_URL="http://your-server.com:8090"
export POCKETBASE_ADMIN_EMAIL="admin@example.com"
export POCKETBASE_ADMIN_PASSWORD="your-secure-password"

# Запустіть setup
node pocketbase-setup.js
```

### 6. Додайте змінні в .env

```bash
# Додайте в ваш .env файл:
VITE_POCKETBASE_URL=http://your-server.com:8090
VITE_POCKETBASE_ANON_KEY=public
```

## 🎯 Використання

### В коді - точно як Supabase!

```typescript
import { pocketbaseStorageService } from './services/PocketBaseStorageService';

// Завантаження файлу (ідентично до Supabase)
const uploadedFile = await pocketbaseStorageService.uploadFile(file);

// Видалення файлу (ідентично до Supabase)
await pocketbaseStorageService.deleteFile(filePath, bucket);

// Отримання списку файлів (ідентично до Supabase)
const files = await pocketbaseStorageService.listFiles('smm-os-images');
```

### Автоматичне перемикання

```typescript
import { storageServiceSwitcher } from './services/StorageServiceSwitcher';

// Автоматично вибере найкращий доступний провайдер
storageServiceSwitcher.setProvider('auto');

// Або примусово встановіть провайдер
storageServiceSwitcher.setProvider('pocketbase');

// Завантаження через switcher
const file = await storageServiceSwitcher.uploadFile(selectedFile);
```

## 🧪 Тестування

Використовуйте тестову сторінку:

```typescript
import PocketBaseTestPage from './components/PocketBaseTestPage';

// Додайте в роутер
<Route path="/test-pocketbase" component={PocketBaseTestPage} />
```

## 📦 Buckets (Collections)

PocketBase collections повністю ідентичні до Supabase buckets:

| Supabase Bucket | PocketBase Collection | Опис |
|---|---|---|
| `smm-os-images` | `smm-os-images` | Зображення |
| `smm-os-videos` | `smm-os-videos` | Відео файли |
| `smm-os-audio` | `smm-os-audio` | Аудіо файли |
| `smm-os-documents` | `smm-os-documents` | Документи |

## 🔧 Налаштування файрволу

```bash
# Відкрийте порти
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw allow 8090  # PocketBase (якщо без Nginx)
sudo ufw enable
```

## 📊 Моніторинг

### Перевірка статусу

```bash
# Статус PocketBase
sudo systemctl status pocketbase

# Логи
sudo journalctl -u pocketbase -f

# Використання ресурсів
htop
```

### Health Check URL

```
GET http://your-server.com:8090/api/health
```

## 🔄 Міграція з існуючого Supabase

1. **Безшовна міграція** - код залишається незмінним
2. **Подвійна робота** - можна використовувати обидва провайдери одночасно
3. **Автоматичний fallback** - StorageServiceSwitcher сам керує

## ⚡ Оптимізація продуктивності

### Налаштування PocketBase

```bash
# Збільшіть ліміти файлів
echo "pocketbase soft nofile 65536" >> /etc/security/limits.conf
echo "pocketbase hard nofile 65536" >> /etc/security/limits.conf
```

### Налаштування Nginx

```nginx
# Додайте в конфігурацію Nginx
client_max_body_size 100M;
proxy_connect_timeout 600s;
proxy_send_timeout 600s;
proxy_read_timeout 600s;
```

## 🚨 Вирішення проблем

### PocketBase не запускається

```bash
# Перевірте логи
sudo journalctl -u pocketbase -n 50

# Перевірте права доступу
sudo chown -R pocketbase:pocketbase /home/pocketbase/

# Перезапустіть сервіс
sudo systemctl restart pocketbase
```

### Файли не завантажуються

1. Перевірте розміри файлів в PocketBase Admin
2. Перевірте налаштування collections
3. Перевірте network connectivity

### CORS помилки

Додайте в PocketBase settings CORS origins:
- `http://localhost:3000`
- `https://your-frontend-domain.com`

## 📞 Підтримка

Якщо виникають проблеми:

1. Перевірте логи PocketBase: `sudo journalctl -u pocketbase -f`
2. Перевірте network connectivity: `curl http://your-server.com:8090/api/health`
3. Використовуйте тестову сторінку для діагностики
4. Перевірте firewall налаштування

## ✅ Результат

Після налаштування ви матимете:

- 🎯 **PocketBase працює ідентично до Supabase**
- 🔄 **Автоматичне перемикання між провайдерами**
- 📦 **Той самий код для обох сервісів**
- 🚀 **Високу продуктивність та надійність**
- 💰 **Економію коштів (власний сервер vs cloud)**

**PocketBase тепер працює як повноцінна заміна Supabase Storage! 🎉**

