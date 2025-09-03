# 🚀 Міграція з Supabase на PocketBase

## 📋 Environment Variables

### Для локальної розробки (main/.env.local):
```bash
# PocketBase Configuration
VITE_POCKETBASE_URL=https://pocketbase.yourdomain.com
VITE_USE_POCKETBASE=true

# Залишити Supabase для резервного копіювання (опційно)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Для Netlify (Production):
```bash
# Додати в Netlify Dashboard → Site settings → Environment variables:
VITE_POCKETBASE_URL=https://pocketbase.yourdomain.com
VITE_USE_POCKETBASE=true
```

## 🔄 План поетапного переходу:

### КРОК 1: Тестування локально
```bash
# В main/.env.local
VITE_USE_POCKETBASE=false  # Використовувати Supabase
```

### КРОК 2: Перехід на PocketBase
```bash
# В main/.env.local та Netlify
VITE_USE_POCKETBASE=true   # Використовувати PocketBase
```

### КРОК 3: Повне видалення Supabase (опційно)
Після успішного тестування можна видалити:
- SupabaseUploader.tsx
- SupabaseStorageService.ts
- VITE_SUPABASE_* змінні

## 🗄️ PocketBase Collections Schema

### Створіть ці collections в PocketBase Admin:

#### 1. smm_os_images
```javascript
{
  "id": "string",
  "file": "file",
  "site_id": "string",
  "original_name": "string", 
  "file_type": "string",
  "created": "datetime",
  "updated": "datetime"
}
```

#### 2. smm_os_videos (аналогічно)
#### 3. smm_os_audio (аналогічно)  
#### 4. smm_os_documents (аналогічно)

## ✅ Переваги міграції:

1. **💰 Економія коштів** - Власний сервер замість абонплати
2. **🚀 Швидкість** - Hetzner VPS в ЄС, низька затримка
3. **🛡️ Контроль** - Повний контроль над даними
4. **📦 Простота** - PocketBase легше в налаштуванні
5. **🔧 Гнучкість** - Можна кастомізувати під потреби

## 🧪 Тестування:

1. Відкрити сайт з `?admin`
2. Smart Content Manager → **🌐 Cloud Storage**
3. Завантажити тестові файли
4. Перевірити що файли доступні та відображаються

## 🆘 Troubleshooting:

### PocketBase недоступний:
- Перевірити статус сервера на Hetzner
- Перевірити Nginx конфігурацію
- Перевірити systemd статус: `systemctl status pocketbase`

### Файли не завантажуються:
- Перевірити CORS налаштування в PocketBase
- Перевірити права на collections
- Перевірити розмір файлів (макс 50MB)

### Як відкотитися назад:
```bash
# В .env.local або Netlify
VITE_USE_POCKETBASE=false
```

Миттєво повернетеся до Supabase!


