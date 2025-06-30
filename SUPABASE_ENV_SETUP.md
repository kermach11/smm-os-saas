# 🔧 Швидке налаштування Supabase Environment Variables

## 🚨 Помилка: "Supabase credentials не налаштовані"

### Причина:
Відсутні `VITE_SUPABASE_URL` та `VITE_SUPABASE_ANON_KEY` в environment variables.

## 🎯 Рішення:

### 1. Створення Supabase проекту:

1. Відкрийте https://supabase.com
2. **Sign up** через GitHub → **New project**
3. **Project name:** `smm-os-storage`
4. **Region:** Europe → **Create project** (2-3 хвилини)

### 2. Отримання credentials:

1. **Supabase Dashboard** → **Settings** → **Project Settings** → **API**
2. Скопіюйте:
   - **Project URL:** `https://abcdefgh.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIs...`

### 3. Налаштування Storage:

1. **Storage** → **Create bucket** → Створіть 4 buckets:
   - `smm-os-images` ✅ **Public**
   - `smm-os-videos` ✅ **Public**  
   - `smm-os-audio` ✅ **Public**
   - `smm-os-documents` ✅ **Public**

### 4. Додавання в проект:

#### Для локальної розробки:
1. Створіть файл `main/.env.local`:
```bash
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-ключ
```

#### Для Netlify (продакшен):
1. **Netlify Dashboard** → **lucky-kangaroo-00bbf8** → **Site settings** → **Environment variables**
2. **Add variable:**
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** `https://ваш-проект.supabase.co`
3. **Add variable:**
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `ваш-anon-ключ`
4. **Deploy** → **Trigger deploy**

### 5. Перевірка:

✅ **Успішно:** Таб "☁️ Cloud Storage" з'явиться в ContentManager
❌ **Помилка:** Червоне повідомлення про відсутність credentials

## 💡 Швидкий тест:

Після налаштування:
1. Відкрийте сайт з `?admin`
2. Smart Content Manager → **☁️ Cloud Storage**
3. Спробуйте завантажити фото
4. **Файл має з'явитися на сайті миттєво!**

## 🆘 Якщо не працює:

- Перевірте що Supabase buckets **Public**
- Перевірте що environment variables **правильно скопійовані**
- **Trigger новий deploy** в Netlify після додавання змінних
- Перевірте консоль браузера на помилки

## 🎉 Результат:

Клієнт завантажує фото → Всі відвідувачі бачать миттєво! 