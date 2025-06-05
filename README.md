# SMM OS - Premium Social Media Management System

🚀 **Преміум-система для стратегічного керування соціальними мережами**

## ✨ Особливості

- **🎨 Сучасний дизайн** - Мінімалістичний інтерфейс в стилі iPhone з SF Pro Text шрифтами
- **🎵 Інтегрована музика** - Фонова музика з плавними переходами та елегантним звуковим перемикачем
- **⚡ Плавні анімації** - Ultra-smooth переходи та інтерактивні елементи
- **📱 Адаптивний дизайн** - Оптимізовано для всіх пристроїв від мобільних до десктопів
- **🎪 3D Карусель** - Інтерактивна 3D карусель з продуктами SMM
- **🎭 Преміум завантажувач** - Елегантний preloader з частинками та світловими ефектами

## 🛠 Технології

- **React 18** - Сучасна бібліотека для створення UI
- **TypeScript** - Типізована розробка
- **Vite** - Швидкий збірник та dev сервер
- **Framer Motion** - Плавні анімації та переходи
- **Tailwind CSS** - Utility-first CSS фреймворк
- **ShadCN UI** - Компоненти високої якості
- **Lucide React** - Сучасні іконки

## 🚀 Швидкий старт

### Встановлення

```bash
# Клонування репозиторію
git clone https://github.com/yourusername/smm-os.git

# Перехід в директорію проекту
cd smm-os

# Встановлення залежностей
npm install
```

### Запуск в режимі розробки

```bash
npm run dev
```

Відкрийте [http://localhost:8080](http://localhost:8080) в браузері.

### Збірка для продакшену

```bash
npm run build
```

### Попередній перегляд збірки

```bash
npm run preview
```

## 📁 Структура проекту

```
src/
├── components/          # React компоненти
│   ├── LoadingScreen.tsx    # Преміум завантажувач
│   ├── MainScreen.tsx       # Головний екран
│   ├── Carousel3D.tsx       # 3D карусель
│   └── SoundToggle.tsx      # Звуковий перемикач
├── hooks/              # Custom React hooks
│   └── useAudio.tsx        # Хук для керування аудіо
├── pages/              # Сторінки додатку
│   └── Index.tsx           # Головна сторінка
├── types/              # TypeScript типи
│   └── types.ts            # Загальні типи
├── fonts/              # Шрифти
│   └── sf-pro-text/        # SF Pro Text шрифти
└── public/
    ├── photo/              # Зображення для каруселі
    └── music/              # Фонова музика
```

## 🎨 Дизайн-система

### Кольори
- **Основний фон**: `#f9fafb` до `#f7f8fa`
- **Текст**: `#1d1d1f` (основний), `#3c3c43` (вторинний)
- **Акцент**: `#4a4b57` до `#303142`

### Шрифти
- **SF Pro Text** - Основний шрифт системи
- Вага: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Heavy)

### Анімації
- **Easing**: `[0.16, 1, 0.3, 1]` - Ultra-smooth cubic-bezier
- **Тривалість**: 200ms-4500ms залежно від елементу
- **Spring анімації** для природних рухів

## 🎵 Аудіо функції

- **Автоматичне відтворення** фонової музики
- **Плавні fade-in/fade-out** переходи
- **Глобальний контекст** для синхронізації звуку
- **iPhone-стиль** звукового перемикача

## 📱 Адаптивність

- **Mobile First** підхід
- **Breakpoints**: 
  - `sm`: 640px+
  - `md`: 768px+
  - `lg`: 1024px+
- **Responsive 3D карусель** з оптимізованими розмірами
- **Адаптивна типографіка** з clamp() функціями

## 🎪 3D Карусель

- **Perspective 3D** ефекти
- **Smooth transitions** між елементами
- **Touch/Click** взаємодія
- **Responsive sizing** для всіх екранів
- **Premium frames** з динамічними ефектами

## 🔧 Налаштування

### Додавання нових продуктів в карусель

Відредагуйте масив `mockItems` в `src/components/MainScreen.tsx`:

```typescript
const mockItems: CarouselItem[] = [
  {
    id: "unique-id",
    title: "PRODUCT NAME",
    description: "Опис продукту...",
    imageUrl: "/photo/your-image.png",
    url: "#your-link"
  }
];
```

### Зміна музики

Замініть файл в `public/music/` та оновіть шлях в `src/pages/Index.tsx`.

## 🚀 Деплой

### GitHub Pages

1. Встановіть `gh-pages`:
```bash
npm install --save-dev gh-pages
```

2. Додайте в `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/smm-os",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Деплой:
```bash
npm run deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

Перетягніть папку `dist` на [netlify.com](https://netlify.com)

## 📄 Ліцензія

MIT License - дивіться [LICENSE](LICENSE) файл для деталей.

## 👨‍💻 Автор

Створено з ❤️ для преміум SMM рішень.

---

**SMM OS** - Ваш надійний партнер у світі соціальних медіа! 🚀
