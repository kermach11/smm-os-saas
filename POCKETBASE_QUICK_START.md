# 🚀 PocketBase Quick Start

## Швидкий запуск PocketBase як заміни Supabase

### 📦 Що зроблено

✅ **PocketBase Storage Service** - повністю ідентичний до Supabase  
✅ **Storage Service Switcher** - автоматичне перемикання між провайдерами  
✅ **Setup Script** - автоматичне налаштування collections  
✅ **Test Page** - сторінка для тестування функціоналу  
✅ **Complete Guide** - детальна інструкція налаштування  

### 🎯 Результат

PocketBase тепер працює **ідентично** до Supabase Storage:
- Той самий API
- Ті самі методи  
- Ті самі bucket names
- Повна сумісність коду

## ⚡ Швидкий старт

### 1. Налаштуйте environment

```bash
# Додайте в .env файл:
VITE_POCKETBASE_URL=http://your-server.com:8090
VITE_POCKETBASE_ANON_KEY=public
```

### 2. Запустіть setup

```bash
cd main/
export POCKETBASE_URL="http://your-server.com:8090"
export POCKETBASE_ADMIN_EMAIL="admin@example.com"  
export POCKETBASE_ADMIN_PASSWORD="your-password"
node pocketbase-setup.js
```

### 3. Використовуйте в коді

```typescript
import { storageServiceSwitcher } from './services/StorageServiceSwitcher';

// Автоматично вибере найкращий провайдер (Supabase або PocketBase)
storageServiceSwitcher.setProvider('auto');

// Завантаження файлу - працює ідентично!
const result = await storageServiceSwitcher.uploadFile(file);
```

### 4. Тестування

Відкрийте тестову сторінку:
```
/src/components/PocketBaseTestPage.tsx
```

## 🔄 Переваги

1. **Безшовна заміна** - код залишається незмінним
2. **Подвійна робота** - Supabase + PocketBase одночасно
3. **Автоматичний fallback** - якщо один сервіс недоступний
4. **Економія** - власний сервер замість cloud платежів
5. **Контроль** - повний контроль над даними

## 📂 Структура файлів

```
main/
├── src/services/
│   ├── PocketBaseStorageService.ts    # Основний сервіс (як Supabase)
│   ├── StorageServiceSwitcher.ts      # Керування провайдерами  
│   └── SupabaseStorageService.ts      # Існуючий Supabase
├── src/components/
│   └── PocketBaseTestPage.tsx         # Тестова сторінка
├── pocketbase-setup.js                # Setup скрипт
├── POCKETBASE_SETUP_GUIDE.md          # Детальна інструкція
└── POCKETBASE_QUICK_START.md          # Цей файл
```

## 🎯 Готово!

**PocketBase тепер працює як повноцінна заміна Supabase Storage!**

- Той самий код
- Ті самі методи  
- Автоматичне перемикання
- Повна сумісність

Можете використовувати PocketBase як drop-in replacement для Supabase! 🎉

