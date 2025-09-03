import { useState, useEffect, useCallback } from 'react';
import { 
  DeviceType, 
  LayoutConfig, 
  MainScreenBoxes,
  BoxConfig,
  AdminIntegrationSettings,
  getDeviceType, 
  getLayoutConfig,
  getDynamicLayoutConfig,
  getDynamicBoxConfig,
  generateResponsiveStyles,
  generateDynamicResponsiveStyles,
  generateBoxStyles,
  RESPONSIVE_BREAKPOINTS 
} from '../config/responsiveConfig';

interface UseResponsiveReturn {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  config: LayoutConfig;
  styles: ReturnType<typeof generateResponsiveStyles>;
  boxes: MainScreenBoxes;
  windowWidth: number;
  windowHeight: number;
  isLandscape: boolean;
  isPortrait: boolean;
  // Утилітарні функції
  getResponsiveValue: <T>(values: Record<DeviceType, T>) => T;
  isBreakpoint: (breakpoint: DeviceType) => boolean;
  // Функції для роботи з боксами
  getBox: (boxName: keyof MainScreenBoxes) => BoxConfig;
  getBoxStyles: (boxName: keyof MainScreenBoxes) => any;
  getBoxClasses: (boxName: keyof MainScreenBoxes) => string;
  // Нові функції для інтеграції з адмін панеллю
  updateAdminSettings: (settings: AdminIntegrationSettings) => void;
  adminSettings: AdminIntegrationSettings | null;
}

// Гібридний хук що інтегрується з адмін панеллю MainScreen
export const useResponsive = (): UseResponsiveReturn => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  
  // Стан для налаштувань з адмін панелі
  const [adminSettings, setAdminSettings] = useState<AdminIntegrationSettings | null>(null);

  // Функція для оновлення розмірів та типу пристрою
  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const newDeviceType = getDeviceType(width);
    const newIsLandscape = width > height;

    setWindowWidth(width);
    setWindowHeight(height);
    setDeviceType(newDeviceType);
    setIsLandscape(newIsLandscape);

    // Додаємо CSS класи для глобальних стилів
    document.documentElement.setAttribute('data-device-type', newDeviceType);
    document.documentElement.setAttribute('data-orientation', newIsLandscape ? 'landscape' : 'portrait');
    

  }, [adminSettings]);

  // Слухач для оновлень з адмін панелі (інтеграція з MainScreen)
  const handleAdminUpdate = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<Record<string, unknown>>;
    const settings = customEvent.detail;
    
    // Конвертуємо налаштування з адмін панелі в формат нашої системи
    const newAdminSettings: AdminIntegrationSettings = {
      headerTitle: settings.headerTitle as string,
      headerSubtitle: settings.headerSubtitle as string,
      headerDescription: settings.headerDescription as string,
      logoUrl: settings.logoUrl as string,
      logoSize: settings.logoSize as number,
      adaptiveSettings: settings.mobile || settings.tablet || settings.desktop ? {
        mobile: settings.mobile as any || adminSettings?.adaptiveSettings?.mobile,
        tablet: settings.tablet as any || adminSettings?.adaptiveSettings?.tablet,
        desktop: settings.desktop as any || adminSettings?.adaptiveSettings?.desktop
      } : adminSettings?.adaptiveSettings,
      headerTextSettings: settings.headerTitleFontSize !== undefined ? {
        headerTitleFontSize: settings.headerTitleFontSize as number,
        headerSubtitleFontSize: settings.headerSubtitleFontSize as number,
        headerDescriptionFontSize: settings.headerDescriptionFontSize as number,
        headerTitleFontFamily: settings.headerTitleFontFamily as string || 'Inter',
        headerSubtitleFontFamily: settings.headerSubtitleFontFamily as string || 'Inter',
        headerDescriptionFontFamily: settings.headerDescriptionFontFamily as string || 'Inter',
        headerTitleFontWeight: settings.headerTitleFontWeight as number || 700,
        headerSubtitleFontWeight: settings.headerSubtitleFontWeight as number || 600,
        headerDescriptionFontWeight: settings.headerDescriptionFontWeight as number || 400,
        headerTitleFontStyle: settings.headerTitleFontStyle as string || 'normal',
        headerSubtitleFontStyle: settings.headerSubtitleFontStyle as string || 'normal',
        headerDescriptionFontStyle: settings.headerDescriptionFontStyle as string || 'normal',
        headerTitleShadowIntensity: settings.headerTitleShadowIntensity as number || 0.5,
        headerSubtitleShadowIntensity: settings.headerSubtitleShadowIntensity as number || 0.3,
        headerDescriptionShadowIntensity: settings.headerDescriptionShadowIntensity as number || 0.2,
        headerTitleShadowColor: settings.headerTitleShadowColor as string || '#000000',
        headerSubtitleShadowColor: settings.headerSubtitleShadowColor as string || '#000000',
        headerDescriptionShadowColor: settings.headerDescriptionShadowColor as string || '#000000'
      } : adminSettings?.headerTextSettings,
      carouselSettings: settings.carouselStyle || settings.animationSpeed || settings.showParticles !== undefined ? {
        carouselStyle: settings.carouselStyle as any || 'premium',
        animationSpeed: settings.animationSpeed as any || 'normal',
        showParticles: settings.showParticles as boolean || false,
        particleColor: settings.particleColor as string || '#ffffff',
        brandColor: settings.brandColor as string || '#4a4b57',
        accentColor: settings.accentColor as string || '#3b82f6'
      } : adminSettings?.carouselSettings,
      backgroundSettings: settings.backgroundType || settings.backgroundColor ? {
        backgroundType: settings.backgroundType as any || 'gradient',
        backgroundColor: settings.backgroundColor as string || '#1a1a1a',
        gradientFrom: settings.gradientFrom as string || '#f9fafb',
        gradientTo: settings.gradientTo as string || '#f7f8fa',
        backgroundImage: settings.backgroundImage as string || '',
        backgroundVideo: settings.backgroundVideo as string || ''
      } : adminSettings?.backgroundSettings
    };

    setAdminSettings(prev => ({
      ...prev,
      ...newAdminSettings
    }));
  }, [adminSettings]);

  // Ініціалізація та слухачі подій
  useEffect(() => {
    // Ініціальне встановлення
    updateDimensions();

    // Слухачі подій для зміни розміру
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);
    
    // Слухачі для адмін панелі (інтеграція з MainScreen)
    window.addEventListener('adminDataUpdated', handleAdminUpdate);
    window.addEventListener('mainPageSettingsUpdated', handleAdminUpdate);
    
    // Дебаунс для оптимізації
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', debouncedUpdate);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      window.removeEventListener('resize', debouncedUpdate);
      window.removeEventListener('adminDataUpdated', handleAdminUpdate);
      window.removeEventListener('mainPageSettingsUpdated', handleAdminUpdate);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions, handleAdminUpdate]);

  // Отримуємо конфігурацію для поточного пристрою
  // Якщо є налаштування з адмін панелі - використовуємо динамічну конфігурацію
  const config = adminSettings 
    ? getDynamicLayoutConfig(deviceType, adminSettings)
    : getLayoutConfig(deviceType);
    
  const styles = adminSettings
    ? generateDynamicResponsiveStyles(deviceType, adminSettings)
    : generateResponsiveStyles(deviceType, config);
    
  const boxes = config.boxes;

  // Допоміжні змінні
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const isPortrait = !isLandscape;

  // Утилітарні функції
  const getResponsiveValue = useCallback(<T>(values: Record<DeviceType, T>): T => {
    return values[deviceType];
  }, [deviceType]);

  const isBreakpoint = useCallback((breakpoint: DeviceType): boolean => {
    return deviceType === breakpoint;
  }, [deviceType]);

  // Функції для роботи з боксами з підтримкою адмін панелі
  const getBox = useCallback((boxName: keyof MainScreenBoxes): BoxConfig => {
    return adminSettings 
      ? getDynamicBoxConfig(deviceType, boxName, adminSettings)
      : config.boxes[boxName];
  }, [deviceType, adminSettings, config.boxes]);

  const getBoxStyles = useCallback((boxName: keyof MainScreenBoxes) => {
    const boxConfig = getBox(boxName);
    return generateBoxStyles(boxConfig);
  }, [getBox]);

  const getBoxClasses = useCallback((boxName: keyof MainScreenBoxes): string => {
    const boxConfig = getBox(boxName);
    const baseClasses = [
      `box-${boxName}`,
      `responsive-${deviceType}`,
      boxConfig.className || ''
    ];

    // Додаємо спеціальні класи залежно від пристрою
    if (isMobile) {
      baseClasses.push('mobile-optimized');
    }
    if (isLandscape) {
      baseClasses.push('landscape-mode');
    }
    if (adminSettings) {
      baseClasses.push('admin-controlled');
    }

    return baseClasses.filter(Boolean).join(' ');
  }, [getBox, deviceType, isMobile, isLandscape, adminSettings]);

  // Функція для ручного оновлення налаштувань адмін панелі
  const updateAdminSettings = useCallback((newSettings: AdminIntegrationSettings) => {
    setAdminSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    config,
    styles,
    boxes,
    windowWidth,
    windowHeight,
    isLandscape,
    isPortrait,
    getResponsiveValue,
    isBreakpoint,
    getBox,
    getBoxStyles,
    getBoxClasses,
    updateAdminSettings,
    adminSettings
  };
};

// Хук для роботи з конкретним боксом з підтримкою адмін панелі
export const useResponsiveBox = (boxName: keyof MainScreenBoxes) => {
  const { getBox, getBoxStyles, getBoxClasses, deviceType, adminSettings } = useResponsive();
  
  const boxConfig = getBox(boxName);
  const boxStyles = getBoxStyles(boxName);
  const boxClasses = getBoxClasses(boxName);
  
  return {
    boxConfig,
    boxStyles,
    boxClasses,
    deviceType,
    adminSettings,
    isAdminControlled: !!adminSettings,
    // Утилітарні функції для конкретного боксу
    getAnimation: () => boxConfig.animation,
    getPosition: () => boxConfig.position,
    getSize: () => boxConfig.size,
    getSpacing: () => boxConfig.spacing,
    getStyle: () => boxConfig.style
  };
};

// Хук для перевірки конкретного breakpoint
export const useBreakpoint = (breakpoint: DeviceType): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const query = window.matchMedia(
      breakpoint === 'mobile' ? `(max-width: ${RESPONSIVE_BREAKPOINTS.mobile - 1}px)` :
      breakpoint === 'tablet' ? `(min-width: ${RESPONSIVE_BREAKPOINTS.mobile}px) and (max-width: ${RESPONSIVE_BREAKPOINTS.tablet - 1}px)` :
      `(min-width: ${RESPONSIVE_BREAKPOINTS.tablet}px)`
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(query.matches);
    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
};

// Хук для отримання конкретного значення з конфігурації
export const useResponsiveConfig = <K extends keyof LayoutConfig>(key: K): LayoutConfig[K] => {
  const { config } = useResponsive();
  return config[key];
};

// Хук для роботи з медіа-запросами
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// Хук для перевірки орієнтації
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};

// Хук для міграції зі старої системи MainScreen
export const useMainScreenMigration = () => {
  const { updateAdminSettings, adminSettings } = useResponsive();
  
  // Функція для автоматичного підключення до існуючої системи MainScreen
  const connectToMainScreen = useCallback(() => {
    console.log('🔗 Підключення до існуючої системи MainScreen...');
    
    // Тут можна додати логіку для автоматичного зчитування налаштувань з localStorage
    // або з інших джерел, які використовує стара система
    
    // Приклад зчитування з localStorage (якщо такі є)
    try {
      const savedSettings = localStorage.getItem('mainScreenSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        updateAdminSettings(parsed);
        console.log('✅ Завантажено збережені налаштування з localStorage');
      }
    } catch (error) {
      console.warn('⚠️ Не вдалося завантажити налаштування з localStorage:', error);
    }
  }, [updateAdminSettings]);

  // Функція для експорту поточних налаштувань
  const exportSettings = useCallback(() => {
    if (adminSettings) {
      const settingsJson = JSON.stringify(adminSettings, null, 2);
      console.log('📤 Поточні налаштування адаптивної системи:', settingsJson);
      return settingsJson;
    }
    return null;
  }, [adminSettings]);

  // Функція для імпорту налаштувань
  const importSettings = useCallback((settingsJson: string) => {
    try {
      const settings = JSON.parse(settingsJson);
      updateAdminSettings(settings);
      console.log('📥 Імпортовано налаштування:', settings);
      return true;
    } catch (error) {
      console.error('❌ Помилка імпорту налаштувань:', error);
      return false;
    }
  }, [updateAdminSettings]);

  return {
    connectToMainScreen,
    exportSettings,
    importSettings,
    isConnected: !!adminSettings,
    currentSettings: adminSettings
  };
};

export default useResponsive; 