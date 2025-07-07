# 📱 Адаптивна система SMM OS

## Огляд

Нова адаптивна система забезпечує ідеальне відображення на всіх пристроях: мобільних телефонах, планшетах та десктопах.

## 🏗️ Архітектура

### 1. Конфігурація (`responsiveConfig.ts`)
- **Breakpoints**: Точки переходу між пристроями
- **LayoutConfig**: Налаштування для кожного типу пристрою
- **Утилітарні функції**: Для роботи з адаптивністю

### 2. Хук (`useResponsive.ts`)
- **Автоматичне визначення** типу пристрою
- **Реактивне оновлення** при зміні розміру
- **Готові стилі** для всіх елементів

### 3. Компоненти (`ResponsiveContainer.tsx`)
- **ResponsiveContainer**: Універсальний контейнер
- **ResponsiveText**: Адаптивний текст
- **ShowOn/HideOn**: Умовне відображення

## 📐 Breakpoints

```typescript
mobile: < 768px
tablet: 768px - 1024px  
desktop: > 1024px
```

## 🎯 Особливості для мобільних

### Розміри
- **Заголовок**: 32px (замість 56px на desktop)
- **Підзаголовок**: 20px (замість 36px)
- **Опис**: 14px (замість 20px)
- **Відступи**: Зменшені на 50%

### Елементи інтерфейсу
- **Мінімальний розмір дотику**: 44px
- **Збільшені кнопки**: 48px висота
- **Оптимізовані карусель**: 280px ширина

### Анімації
- **Швидші**: 300ms (замість 500ms)
- **Менша затримка**: 100ms (замість 200ms)

## 🚀 Використання

### Основний спосіб
```tsx
import { useResponsive } from '../hooks/useResponsive';
import { ResponsiveContainer, ResponsiveText } from '../components/ResponsiveContainer';

const MyComponent = () => {
  const { deviceType, isMobile, config, styles } = useResponsive();

  return (
    <ResponsiveContainer 
      containerType="main"
      centerContent
      animated
    >
      <ResponsiveText 
        as="h1" 
        textType="title"
        animated
      >
        Мій заголовок
      </ResponsiveText>
    </ResponsiveContainer>
  );
};
```

### Різні налаштування для пристроїв
```tsx
<ResponsiveContainer
  mobileProps={{
    style: { padding: '16px' },
    className: 'mobile-specific'
  }}
  tabletProps={{
    style: { padding: '24px' },
    className: 'tablet-specific'  
  }}
  desktopProps={{
    style: { padding: '32px' },
    className: 'desktop-specific'
  }}
>
  Контент
</ResponsiveContainer>
```

### Умовне відображення
```tsx
{/* Показати тільки на мобільних */}
<ShowOn devices={['mobile']}>
  <button>Мобільна кнопка</button>
</ShowOn>

{/* Приховати на мобільних */}
<HideOn devices={['mobile']}>
  <div>Десктоп контент</div>
</HideOn>
```

## 🎨 Стилі

### Автоматичні стилі
```tsx
const { styles } = useResponsive();

// Готові стилі для всіх елементів
styles.container  // Контейнер
styles.header     // Заголовок
styles.title      // Заголовок тексту
styles.subtitle   // Підзаголовок
styles.carousel   // Карусель
styles.button     // Кнопка
```

### Ручні стилі
```tsx
const { config } = useResponsive();

const myStyles = {
  fontSize: config.primaryFontSize,
  padding: config.baseSpacing,
  marginTop: config.headerContainerMarginTop
};
```

## 🔧 Налаштування

### Зміна breakpoints
```typescript
// config/responsiveConfig.ts
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 600,   // Змінити з 768
  tablet: 900,   // Змінити з 1024
  desktop: 1200
};
```

### Додавання нових налаштувань
```typescript
// В LayoutConfig додати нові поля
export interface LayoutConfig {
  // ... існуючі поля
  
  // Нові налаштування
  cardWidth: number;
  cardHeight: number;
  iconSize: number;
}

// В DEVICE_CONFIGS додати значення
mobile: {
  // ... існуючі налаштування
  cardWidth: 280,
  cardHeight: 200,
  iconSize: 24
}
```

## 📱 Мобільні оптимізації

### Дотики
- Мінімальний розмір: 44px
- Збільшені кнопки і посилання
- Оптимізовані форми

### Продуктивність
- Менші зображення
- Швидші анімації
- Оптимізовані шрифти

### UX
- Свайп жести
- Scroll snap
- Вібрація (при підтримці)

## 🐛 Дебаг

### Показ поточного пристрою
```tsx
const { deviceType, windowWidth } = useResponsive();

return (
  <div>
    Пристрій: {deviceType} ({windowWidth}px)
  </div>
);
```

### CSS класи
Автоматично додаються:
- `responsive-mobile`
- `responsive-tablet` 
- `responsive-desktop`
- `container-header`
- `container-main`
- `container-carousel`

## 🔄 Міграція з старої системи

### Замінити useDeviceType
```tsx
// Було
const deviceType = useDeviceType();

// Стало
const { deviceType, isMobile, isTablet, isDesktop } = useResponsive();
```

### Замінити адаптивні стилі
```tsx
// Було
const fontSize = deviceType === 'mobile' ? 32 : 
                deviceType === 'tablet' ? 42 : 56;

// Стало
const { config } = useResponsive();
const fontSize = config.headerTitleFontSize;
```

## 📊 Переваги

✅ **Централізована конфігурація** - все в одному місці  
✅ **Автоматична адаптація** - не потрібно думати про розміри  
✅ **Типобезпечність** - TypeScript контролює все  
✅ **Легке тестування** - швидкі зміни налаштувань  
✅ **Оптимізація** - мінімум rerenders  
✅ **Гнучкість** - можна налаштувати все  

## 🎯 Результат

Тепер ваш сайт **ідеально виглядає на всіх пристроях**:
- 📱 Мобільні: оптимізовано для дотиків
- 📱 Планшети: збалансовано
- 🖥️ Десктопи: максимальна функціональність

---

**Створено для SMM OS** | [Повернутися до головного README](../README.md) 