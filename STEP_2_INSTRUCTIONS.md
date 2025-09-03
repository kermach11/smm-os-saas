# 🖥️ Етап 2: Налаштування Hetzner VPS

## 📝 Що потрібно зробити

### Варіант A: Автоматичне налаштування (Рекомендовано)

#### 1. Підключення до VPS
```bash
# Підключіться до вашого Hetzner VPS
ssh root@YOUR_SERVER_IP
```

#### 2. Завантаження та запуск setup скрипта
```bash
# Завантажте скрипт налаштування
wget https://raw.githubusercontent.com/your-repo/main/hetzner-setup.sh

# Або скопіюйте файл hetzner-setup.sh на сервер
scp main/hetzner-setup.sh root@YOUR_SERVER_IP:/root/

# Надайте права на виконання
chmod +x hetzner-setup.sh

# Запустіть налаштування
./hetzner-setup.sh
```

#### 3. Очікуваний результат
```
[HetznerSetup] 🚀 Початок налаштування PocketBase на Hetzner VPS
[HetznerSetup] ✅ Система оновлена
[HetznerSetup] ✅ Пакети встановлено
[HetznerSetup] ✅ Користувач pocketbase створено
[HetznerSetup] ✅ PocketBase встановлено
[HetznerSetup] ✅ Systemd service створено
[HetznerSetup] ✅ Firewall налаштовано
[HetznerSetup] ✅ Nginx налаштовано
[HetznerSetup] ✅ PocketBase успішно запущено
[HetznerSetup] 🎉 Налаштування PocketBase завершено!
```

### Варіант B: Ручне налаштування

<details>
<summary>Клікніть для розгортання ручних інструкцій</summary>

#### 1. Оновлення системи
```bash
apt update && apt upgrade -y
apt install -y curl wget unzip nginx ufw
```

#### 2. Створення користувача
```bash
useradd -m -s /bin/bash pocketbase
su - pocketbase
```

#### 3. Встановлення PocketBase
```bash
# Завантажте останню версію
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip
unzip pocketbase_0.20.0_linux_amd64.zip
chmod +x pocketbase
mkdir pb_data
```

#### 4. Створення systemd service
```bash
sudo nano /etc/systemd/system/pocketbase.service
# Скопіюйте конфігурацію з hetzner-setup.sh
sudo systemctl daemon-reload
sudo systemctl enable pocketbase
sudo systemctl start pocketbase
```

</details>

## 🌐 Після встановлення

### 1. Створення першого адміністратора
1. Відкрийте браузер
2. Перейдіть до: `http://YOUR_SERVER_IP:8090/_/`
3. Створіть першого адміністратора:
   - **Email:** `admin@example.com` (або ваш email)
   - **Password:** безпечний пароль

⚠️ **ВАЖЛИВО:** Запам'ятайте ці credentials - вони потрібні для .env файлу!

### 2. Оновлення .env файлу
```bash
# Оновіть ваш .env файл:
VITE_POCKETBASE_URL=http://YOUR_REAL_SERVER_IP:8090
POCKETBASE_ADMIN_EMAIL=admin@example.com
POCKETBASE_ADMIN_PASSWORD=your-real-password
```

### 3. Перевірка роботи
```bash
# Локально на сервері
curl http://localhost:8090/api/health

# З вашого комп'ютера
curl http://YOUR_SERVER_IP:8090/api/health
```

Очікувана відповідь: `{"code":200,"message":"API is healthy","data":{}}`

## ❌ Можливі проблеми та рішення

### Проблема: "Connection refused"
**Рішення:**
```bash
# Перевірте статус PocketBase
systemctl status pocketbase

# Перевірте логи
journalctl -u pocketbase -f

# Перезапустіть сервіс
systemctl restart pocketbase
```

### Проблема: "Firewall блокує підключення"
**Рішення:**
```bash
# Перевірте firewall
ufw status

# Дозвольте порт 8090
ufw allow 8090/tcp
```

### Проблема: "Nginx помилки"
**Рішення:**
```bash
# Перевірте конфігурацію
nginx -t

# Перезапустіть Nginx
systemctl restart nginx
```

## 📋 Чек-лист Етапу 2

- [ ] VPS оновлено та налаштовано
- [ ] PocketBase встановлено та запущено
- [ ] Firewall налаштовано (порти 22, 80, 443, 8090)
- [ ] Nginx налаштовано як reverse proxy
- [ ] Перший адміністратор створено
- [ ] Health check відповідає успішно
- [ ] .env файл оновлено з реальним IP

## ➡️ Наступний крок

Після завершення Етапу 2 переходьте до **Етапу 3: Створення collections**

---

### 💡 Підказки

1. **IP адреса:** Знайти IP вашого сервера: `curl ifconfig.me`
2. **Логи:** Моніторинг в реальному часі: `journalctl -u pocketbase -f`
3. **Перезапуск:** При проблемах: `systemctl restart pocketbase`
4. **Безпека:** Змініть порт SSH та налаштуйте ключі

### 🔒 Рекомендації безпеки

1. Змініть стандартний SSH порт
2. Налаштуйте SSH ключі замість паролів
3. Регулярно оновлюйте систему
4. Використовуйте сильні паролі для адміністратора
5. Налаштуйте автоматичні бекапи

