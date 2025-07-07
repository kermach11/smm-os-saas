import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 🚀 Responsive font size utilities для кращої сумісності браузерів
export function responsiveFontSize(sizeInPx: number): string {
  // Просто повертаємо px значення для тестування
  return `${sizeInPx}px`;
}

// Утилітарна функція для responsive spacing
export function responsiveSpacing(sizeInPx: number): string {
  const remSize = sizeInPx / 16;
  return `clamp(${(remSize * 0.8).toFixed(2)}rem, ${(remSize * 0.9).toFixed(2)}rem + 1vw, ${remSize.toFixed(2)}rem)`;
}

// Функція для визначення типу пристрою
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// Функція для створення CSS змінних для responsive дизайну
export function createResponsiveCSS(element: HTMLElement, baseFontSize: number) {
  const deviceType = getDeviceType();
  const scale = deviceType === 'mobile' ? 0.9 : deviceType === 'tablet' ? 0.95 : 1;
  
  element.style.setProperty('--base-font-size', `${baseFontSize * scale}px`);
  element.style.setProperty('--device-type', deviceType);
}


