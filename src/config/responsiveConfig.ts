export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

// Конфігурація для боксів MainScreen
export interface BoxPosition {
  position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky';
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
  zIndex?: number;
  transform?: string;
}

export interface BoxSize {
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  minHeight?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export interface BoxSpacing {
  margin?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  padding?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
}

export interface BoxStyle {
  backgroundColor?: string;
  background?: string;
  borderRadius?: number | string;
  boxShadow?: string;
  border?: string;
  opacity?: number;
  backdropFilter?: string;
}

export interface BoxAnimation {
  initial: any;
  animate: any;
  transition: any;
  hover?: any;
  tap?: any;
}

export interface BoxConfig {
  position: BoxPosition;
  size: BoxSize;
  spacing: BoxSpacing;
  style: BoxStyle;
  animation: BoxAnimation;
  className?: string;
  responsive?: {
    mobile?: Partial<BoxConfig>;
    tablet?: Partial<BoxConfig>;
    desktop?: Partial<BoxConfig>;
  };
}

// Конфігурація для різних боксів MainScreen
export interface MainScreenBoxes {
  logoBox: BoxConfig;
  soundToggleBox: BoxConfig;
  headerTextBox: BoxConfig;
  carouselBox: BoxConfig;
  paginationBox: BoxConfig;
  adminButtonBox: BoxConfig;
  adminPanelBox: BoxConfig;
}

// ===== ІНТЕГРАЦІЯ З АДМІН ПАНЕЛЛЮ =====

// Типи для налаштувань з адмін панелі (відповідають старій системі)
export interface AdminAdaptiveSettings {
  mobile: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
  tablet: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
  desktop: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
}

export interface AdminHeaderTextSettings {
  headerTitleFontSize: number;
  headerSubtitleFontSize: number;
  headerDescriptionFontSize: number;
  headerTitleFontFamily: string;
  headerSubtitleFontFamily: string;
  headerDescriptionFontFamily: string;
  headerTitleFontWeight: number;
  headerSubtitleFontWeight: number;
  headerDescriptionFontWeight: number;
  headerTitleFontStyle: string;
  headerSubtitleFontStyle: string;
  headerDescriptionFontStyle: string;
  headerTitleShadowIntensity: number;
  headerSubtitleShadowIntensity: number;
  headerDescriptionShadowIntensity: number;
  headerTitleShadowColor: string;
  headerSubtitleShadowColor: string;
  headerDescriptionShadowColor: string;
}

export interface AdminCarouselSettings {
  carouselStyle: 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showParticles: boolean;
  particleColor: string;
  brandColor: string;
  accentColor: string;
}

// Інтерфейс для інтеграції з адмін панеллю
export interface AdminIntegrationSettings {
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  logoUrl?: string;
  logoSize?: number;
  adaptiveSettings?: AdminAdaptiveSettings;
  headerTextSettings?: AdminHeaderTextSettings;
  carouselSettings?: AdminCarouselSettings;
  backgroundSettings?: {
    backgroundType: 'color' | 'gradient' | 'image' | 'video';
    backgroundColor: string;
    gradientFrom: string;
    gradientTo: string;
    backgroundImage: string;
    backgroundVideo: string;
  };
}

export interface LayoutConfig {
  // Header/Logo
  headerTitleFontSize: number;
  headerSubtitleFontSize: number;
  headerDescriptionFontSize: number;
  headerTitleMarginBottom: number;
  headerSubtitleMarginBottom: number;
  headerDescriptionMarginBottom: number;
  headerTitleLineHeight: number;
  headerSubtitleLineHeight: number;
  headerDescriptionLineHeight: number;
  headerTitleLetterSpacing: number;
  headerSubtitleLetterSpacing: number;
  headerDescriptionLetterSpacing: number;
  headerContainerPadding: number;
  headerContainerMarginTop: number;
  headerContainerMarginBottom: number;
  logoSize: number;
  
  // Carousel
  carouselItemWidth: number;
  carouselItemHeight: number;
  carouselSpacing: number;
  carouselPadding: number;
  carouselMarginTop: number;
  carouselMarginBottom: number;
  
  // Layout
  containerMaxWidth: number;
  containerPadding: number;
  sectionSpacing: number;
  
  // Typography
  primaryFontSize: number;
  secondaryFontSize: number;
  smallFontSize: number;
  
  // Spacing
  baseSpacing: number;
  smallSpacing: number;
  largeSpacing: number;
  
  // Animation
  animationDuration: number;
  animationDelay: number;
  
  // Interactive elements
  buttonHeight: number;
  buttonPadding: number;
  inputHeight: number;
  
  // Special mobile optimizations
  touchTargetSize: number;
  scrollSnapType: string;
  overflowBehavior: string;
  
  // MainScreen specific boxes
  boxes: MainScreenBoxes;
}

export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

// Конфігурація боксів для MainScreen з підтримкою адмін панелі
const createMainScreenBoxes = (
  deviceType: DeviceType,
  adminSettings?: AdminIntegrationSettings
): MainScreenBoxes => {
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // Отримуємо адаптивні налаштування з адмін панелі або використовуємо за замовчуванням
  const adaptiveSettings = adminSettings?.adaptiveSettings || {
    mobile: {
      headerTitleFontSize: 32,
      headerSubtitleFontSize: 20,
      headerDescriptionFontSize: 14,
      headerTitleMarginBottom: 12,
      headerSubtitleMarginBottom: 8,
      headerDescriptionMarginBottom: 16,
      headerTitleLineHeight: 1.2,
      headerSubtitleLineHeight: 1.3,
      headerDescriptionLineHeight: 1.4,
      headerTitleLetterSpacing: -0.5,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0.2,
      headerContainerPadding: 16,
      headerContainerMarginTop: 16,
      headerContainerMarginBottom: 24
    },
    tablet: {
      headerTitleFontSize: 42,
      headerSubtitleFontSize: 28,
      headerDescriptionFontSize: 16,
      headerTitleMarginBottom: 14,
      headerSubtitleMarginBottom: 10,
      headerDescriptionMarginBottom: 20,
      headerTitleLineHeight: 1.3,
      headerSubtitleLineHeight: 1.4,
      headerDescriptionLineHeight: 1.5,
      headerTitleLetterSpacing: -0.3,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0.1,
      headerContainerPadding: 24,
      headerContainerMarginTop: 24,
      headerContainerMarginBottom: 32
    },
    desktop: {
      headerTitleFontSize: 56,
      headerSubtitleFontSize: 36,
      headerDescriptionFontSize: 20,
      headerTitleMarginBottom: 16,
      headerSubtitleMarginBottom: 12,
      headerDescriptionMarginBottom: 24,
      headerTitleLineHeight: 1.4,
      headerSubtitleLineHeight: 1.5,
      headerDescriptionLineHeight: 1.6,
      headerTitleLetterSpacing: -0.5,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0,
      headerContainerPadding: 32,
      headerContainerMarginTop: 32,
      headerContainerMarginBottom: 40
    }
  };

  const currentAdaptiveSettings = adaptiveSettings[deviceType];
  const logoSize = adminSettings?.logoSize || (isMobile ? 48 : isTablet ? 64 : 80);

  return {
    // БОКС 1: Логотип/Header (інтегрований з адмін панеллю)
    logoBox: {
      position: {
        position: 'absolute',
        top: isMobile ? 8 : isTablet ? 12 : 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20
      },
      size: {
        width: 'fit-content',
        height: 'fit-content'
      },
      spacing: {
        padding: 0,
        margin: 0
      },
      style: {},
      animation: {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay: 0.2 },
        hover: { scale: 1.05 }
      },
      className: 'flex items-center justify-center cursor-pointer select-none'
    },

    // БОКС 2: Sound Toggle
    soundToggleBox: {
      position: {
        position: 'absolute',
        top: currentAdaptiveSettings.headerContainerMarginTop,
        right: 16,
        zIndex: 20
      },
      size: {
        width: 'fit-content',
        height: 'fit-content'
      },
      spacing: {},
      style: {},
      animation: {
        initial: { opacity: 0, x: 10 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, delay: 0.3 }
      }
    },

    // БОКС 3: Header Text (повністю інтегрований з адмін панеллю)
    headerTextBox: {
      position: {
        position: 'relative',
        zIndex: 10
      },
      size: {
        width: '100%',
        maxWidth: isMobile ? '100%' : isTablet ? '90%' : '80%'
      },
      spacing: {
        marginBottom: currentAdaptiveSettings.headerDescriptionMarginBottom,
        paddingTop: currentAdaptiveSettings.headerContainerMarginTop + 60, // відступ від логотипа
        paddingLeft: currentAdaptiveSettings.headerContainerPadding,
        paddingRight: currentAdaptiveSettings.headerContainerPadding
      },
      style: {},
      animation: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.3, ease: "easeOut" }
      },
      className: 'text-center mx-auto'
    },

    // БОКС 4: Carousel
    carouselBox: {
      position: {
        position: 'relative',
        zIndex: 5
      },
      size: {
        width: '100%',
        height: isMobile ? 400 : isTablet ? 500 : 600,
        maxWidth: isMobile ? '100%' : isTablet ? '90%' : '80%'
      },
      spacing: {
        marginTop: isMobile ? 24 : isTablet ? 32 : 40,
        marginBottom: isMobile ? 16 : isTablet ? 24 : 32
      },
      style: {},
      animation: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, delay: 0.6, ease: "easeOut" }
      },
      className: 'flex items-center justify-center mx-auto'
    },

    // БОКС 5: Pagination
    paginationBox: {
      position: {
        position: 'relative',
        zIndex: 10
      },
      size: {
        width: 'fit-content',
        height: 'fit-content'
      },
      spacing: {
        marginTop: -32,
        marginBottom: 16
      },
      style: {},
      animation: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay: 0.9, ease: "easeOut" }
      },
      className: 'flex items-center justify-center space-x-2'
    },

    // БОКС 6: Admin Button
    adminButtonBox: {
      position: {
        position: 'absolute',
        right: 24,
        bottom: isMobile ? 96 : 24,
        zIndex: 30
      },
      size: {
        width: isMobile ? 48 : 56,
        height: isMobile ? 48 : 56
      },
      spacing: {},
      style: {
        background: 'linear-gradient(145deg, #8B5CF6 0%, #A855F7 25%, #9333EA 50%, #7C3AED 75%, #6D28D9 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4), 0 4px 12px rgba(0,0,0,0.15)',
        border: 'none',
        backdropFilter: 'blur(4px)'
      },
      animation: {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay: 1 },
        hover: { scale: 1.1 },
        tap: { scale: 0.95 }
      },
      className: 'flex items-center justify-center text-white cursor-pointer'
    },

    // БОКС 7: Admin Panel Modals
    adminPanelBox: {
      position: {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50
      },
      size: {
        width: '100vw',
        height: '100vh'
      },
      spacing: {},
      style: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)'
      },
      animation: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      },
      className: 'flex items-center justify-center'
    }
  };
};

// Функція для створення динамічної конфігурації з адмін панеллю
export const createDynamicLayoutConfig = (
  deviceType: DeviceType,
  adminSettings?: AdminIntegrationSettings
): LayoutConfig => {
  const adaptiveSettings = adminSettings?.adaptiveSettings || {
    mobile: {
      headerTitleFontSize: 32,
      headerSubtitleFontSize: 20,
      headerDescriptionFontSize: 14,
      headerTitleMarginBottom: 12,
      headerSubtitleMarginBottom: 8,
      headerDescriptionMarginBottom: 16,
      headerTitleLineHeight: 1.2,
      headerSubtitleLineHeight: 1.3,
      headerDescriptionLineHeight: 1.4,
      headerTitleLetterSpacing: -0.5,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0.2,
      headerContainerPadding: 16,
      headerContainerMarginTop: 16,
      headerContainerMarginBottom: 24
    },
    tablet: {
      headerTitleFontSize: 42,
      headerSubtitleFontSize: 28,
      headerDescriptionFontSize: 16,
      headerTitleMarginBottom: 14,
      headerSubtitleMarginBottom: 10,
      headerDescriptionMarginBottom: 20,
      headerTitleLineHeight: 1.3,
      headerSubtitleLineHeight: 1.4,
      headerDescriptionLineHeight: 1.5,
      headerTitleLetterSpacing: -0.3,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0.1,
      headerContainerPadding: 24,
      headerContainerMarginTop: 24,
      headerContainerMarginBottom: 32
    },
    desktop: {
      headerTitleFontSize: 56,
      headerSubtitleFontSize: 36,
      headerDescriptionFontSize: 20,
      headerTitleMarginBottom: 16,
      headerSubtitleMarginBottom: 12,
      headerDescriptionMarginBottom: 24,
      headerTitleLineHeight: 1.4,
      headerSubtitleLineHeight: 1.5,
      headerDescriptionLineHeight: 1.6,
      headerTitleLetterSpacing: -0.5,
      headerSubtitleLetterSpacing: 0,
      headerDescriptionLetterSpacing: 0,
      headerContainerPadding: 32,
      headerContainerMarginTop: 32,
      headerContainerMarginBottom: 40
    }
  };

  const currentSettings = adaptiveSettings[deviceType];
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  return {
    // Header/Logo - тепер з адмін панелі
    headerTitleFontSize: currentSettings.headerTitleFontSize,
    headerSubtitleFontSize: currentSettings.headerSubtitleFontSize,
    headerDescriptionFontSize: currentSettings.headerDescriptionFontSize,
    headerTitleMarginBottom: currentSettings.headerTitleMarginBottom,
    headerSubtitleMarginBottom: currentSettings.headerSubtitleMarginBottom,
    headerDescriptionMarginBottom: currentSettings.headerDescriptionMarginBottom,
    headerTitleLineHeight: currentSettings.headerTitleLineHeight,
    headerSubtitleLineHeight: currentSettings.headerSubtitleLineHeight,
    headerDescriptionLineHeight: currentSettings.headerDescriptionLineHeight,
    headerTitleLetterSpacing: currentSettings.headerTitleLetterSpacing,
    headerSubtitleLetterSpacing: currentSettings.headerSubtitleLetterSpacing,
    headerDescriptionLetterSpacing: currentSettings.headerDescriptionLetterSpacing,
    headerContainerPadding: currentSettings.headerContainerPadding,
    headerContainerMarginTop: currentSettings.headerContainerMarginTop,
    headerContainerMarginBottom: currentSettings.headerContainerMarginBottom,
    logoSize: adminSettings?.logoSize || (isMobile ? 48 : isTablet ? 64 : 80),
    
    // Carousel - базові значення з можливістю перевизначення
    carouselItemWidth: isMobile ? 280 : isTablet ? 340 : 400,
    carouselItemHeight: isMobile ? 160 : isTablet ? 200 : 240,
    carouselSpacing: isMobile ? 16 : isTablet ? 20 : 24,
    carouselPadding: isMobile ? 16 : isTablet ? 24 : 32,
    carouselMarginTop: isMobile ? 24 : isTablet ? 32 : 40,
    carouselMarginBottom: isMobile ? 32 : isTablet ? 40 : 48,
    
    // Layout - базові значення
    containerMaxWidth: isMobile ? 100 : isTablet ? 90 : 80,
    containerPadding: isMobile ? 16 : isTablet ? 24 : 32,
    sectionSpacing: isMobile ? 24 : isTablet ? 32 : 40,
    
    // Typography - базові значення
    primaryFontSize: isMobile ? 16 : isTablet ? 18 : 20,
    secondaryFontSize: isMobile ? 14 : isTablet ? 16 : 18,
    smallFontSize: isMobile ? 12 : isTablet ? 14 : 16,
    
    // Spacing - базові значення
    baseSpacing: isMobile ? 16 : isTablet ? 20 : 24,
    smallSpacing: isMobile ? 8 : isTablet ? 12 : 16,
    largeSpacing: isMobile ? 24 : isTablet ? 32 : 48,
    
    // Animation - базові значення
    animationDuration: isMobile ? 300 : isTablet ? 400 : 500,
    animationDelay: isMobile ? 100 : isTablet ? 150 : 200,
    
    // Interactive elements - базові значення
    buttonHeight: isMobile ? 48 : isTablet ? 44 : 40,
    buttonPadding: isMobile ? 16 : isTablet ? 20 : 24,
    inputHeight: isMobile ? 48 : isTablet ? 44 : 40,
    
    // Mobile optimizations
    touchTargetSize: isMobile ? 44 : isTablet ? 44 : 32,
    scrollSnapType: isMobile ? 'x mandatory' : isTablet ? 'x mandatory' : 'none',
    overflowBehavior: isMobile ? 'contain' : 'auto',
    
    // MainScreen boxes з адмін панеллю
    boxes: createMainScreenBoxes(deviceType, adminSettings)
  };
};

// Статичні конфігурації (для зворотної сумісності)
export const DEVICE_CONFIGS: Record<DeviceType, LayoutConfig> = {
  mobile: createDynamicLayoutConfig('mobile'),
  tablet: createDynamicLayoutConfig('tablet'),
  desktop: createDynamicLayoutConfig('desktop')
};

// Утилітарні функції для роботи з адаптивністю
export const getDeviceType = (width: number): DeviceType => {
  if (width < RESPONSIVE_BREAKPOINTS.mobile) return 'mobile';
  if (width < RESPONSIVE_BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

export const getLayoutConfig = (deviceType: DeviceType): LayoutConfig => {
  return DEVICE_CONFIGS[deviceType];
};

// Нова функція для отримання динамічної конфігурації
export const getDynamicLayoutConfig = (
  deviceType: DeviceType, 
  adminSettings?: AdminIntegrationSettings
): LayoutConfig => {
  return createDynamicLayoutConfig(deviceType, adminSettings);
};

export const getResponsiveValue = <T>(
  deviceType: DeviceType,
  values: Record<DeviceType, T>
): T => {
  return values[deviceType];
};

// Нова утилітарна функція для отримання динамічної конфігурації боксу
export const getDynamicBoxConfig = (
  deviceType: DeviceType, 
  boxName: keyof MainScreenBoxes,
  adminSettings?: AdminIntegrationSettings
): BoxConfig => {
  const config = createDynamicLayoutConfig(deviceType, adminSettings);
  return config.boxes[boxName];
};

// Утилітарна функція для отримання конфігурації боксу (стара версія)
export const getBoxConfig = (deviceType: DeviceType, boxName: keyof MainScreenBoxes): BoxConfig => {
  return DEVICE_CONFIGS[deviceType].boxes[boxName];
};

// CSS-in-JS утиліти з підтримкою адмін панелі
export const generateDynamicResponsiveStyles = (
  deviceType: DeviceType,
  adminSettings?: AdminIntegrationSettings
) => {
  const config = createDynamicLayoutConfig(deviceType, adminSettings);
  
  return {
    container: {
      maxWidth: `${config.containerMaxWidth}%`,
      padding: `0 ${config.containerPadding}px`,
      margin: '0 auto'
    },
    header: {
      padding: `${config.headerContainerPadding}px`,
      marginTop: `${config.headerContainerMarginTop}px`,
      marginBottom: `${config.headerContainerMarginBottom}px`
    },
    title: {
      fontSize: `${config.headerTitleFontSize}px`,
      lineHeight: config.headerTitleLineHeight,
      letterSpacing: `${config.headerTitleLetterSpacing}px`,
      marginBottom: `${config.headerTitleMarginBottom}px`
    },
    subtitle: {
      fontSize: `${config.headerSubtitleFontSize}px`,
      lineHeight: config.headerSubtitleLineHeight,
      letterSpacing: `${config.headerSubtitleLetterSpacing}px`,
      marginBottom: `${config.headerSubtitleMarginBottom}px`
    },
    description: {
      fontSize: `${config.headerDescriptionFontSize}px`,
      lineHeight: config.headerDescriptionLineHeight,
      letterSpacing: `${config.headerDescriptionLetterSpacing}px`,
      marginBottom: `${config.headerDescriptionMarginBottom}px`
    },
    carousel: {
      padding: `${config.carouselPadding}px`,
      marginTop: `${config.carouselMarginTop}px`,
      marginBottom: `${config.carouselMarginBottom}px`,
      gap: `${config.carouselSpacing}px`
    },
    carouselItem: {
      width: `${config.carouselItemWidth}px`,
      height: `${config.carouselItemHeight}px`,
      minWidth: `${config.carouselItemWidth}px`,
      minHeight: `${config.touchTargetSize}px`
    },
    button: {
      height: `${config.buttonHeight}px`,
      padding: `0 ${config.buttonPadding}px`,
      minHeight: `${config.touchTargetSize}px`,
      minWidth: `${config.touchTargetSize}px`
    },
    animation: {
      duration: `${config.animationDuration}ms`,
      delay: `${config.animationDelay}ms`
    }
  };
};

// Стара функція для зворотної сумісності
export const generateResponsiveStyles = (
  deviceType: DeviceType,
  config: LayoutConfig
) => {
  return {
    container: {
      maxWidth: `${config.containerMaxWidth}%`,
      padding: `0 ${config.containerPadding}px`,
      margin: '0 auto'
    },
    header: {
      padding: `${config.headerContainerPadding}px`,
      marginTop: `${config.headerContainerMarginTop}px`,
      marginBottom: `${config.headerContainerMarginBottom}px`
    },
    title: {
      fontSize: `${config.headerTitleFontSize}px`,
      lineHeight: config.headerTitleLineHeight,
      letterSpacing: `${config.headerTitleLetterSpacing}px`,
      marginBottom: `${config.headerTitleMarginBottom}px`
    },
    subtitle: {
      fontSize: `${config.headerSubtitleFontSize}px`,
      lineHeight: config.headerSubtitleLineHeight,
      letterSpacing: `${config.headerSubtitleLetterSpacing}px`,
      marginBottom: `${config.headerSubtitleMarginBottom}px`
    },
    description: {
      fontSize: `${config.headerDescriptionFontSize}px`,
      lineHeight: config.headerDescriptionLineHeight,
      letterSpacing: `${config.headerDescriptionLetterSpacing}px`,
      marginBottom: `${config.headerDescriptionMarginBottom}px`
    },
    carousel: {
      padding: `${config.carouselPadding}px`,
      marginTop: `${config.carouselMarginTop}px`,
      marginBottom: `${config.carouselMarginBottom}px`,
      gap: `${config.carouselSpacing}px`
    },
    carouselItem: {
      width: `${config.carouselItemWidth}px`,
      height: `${config.carouselItemHeight}px`,
      minWidth: `${config.carouselItemWidth}px`,
      minHeight: `${config.touchTargetSize}px`
    },
    button: {
      height: `${config.buttonHeight}px`,
      padding: `0 ${config.buttonPadding}px`,
      minHeight: `${config.touchTargetSize}px`,
      minWidth: `${config.touchTargetSize}px`
    },
    animation: {
      duration: `${config.animationDuration}ms`,
      delay: `${config.animationDelay}ms`
    }
  };
};

// Утилітарна функція для генерації стилів боксу
export const generateBoxStyles = (boxConfig: BoxConfig) => {
  return {
    position: boxConfig.position.position,
    top: boxConfig.position.top,
    bottom: boxConfig.position.bottom,
    left: boxConfig.position.left,
    right: boxConfig.position.right,
    zIndex: boxConfig.position.zIndex,
    transform: boxConfig.position.transform,
    width: boxConfig.size.width,
    height: boxConfig.size.height,
    minWidth: boxConfig.size.minWidth,
    minHeight: boxConfig.size.minHeight,
    maxWidth: boxConfig.size.maxWidth,
    maxHeight: boxConfig.size.maxHeight,
    margin: boxConfig.spacing.margin,
    marginTop: boxConfig.spacing.marginTop,
    marginBottom: boxConfig.spacing.marginBottom,
    marginLeft: boxConfig.spacing.marginLeft,
    marginRight: boxConfig.spacing.marginRight,
    padding: boxConfig.spacing.padding,
    paddingTop: boxConfig.spacing.paddingTop,
    paddingBottom: boxConfig.spacing.paddingBottom,
    paddingLeft: boxConfig.spacing.paddingLeft,
    paddingRight: boxConfig.spacing.paddingRight,
    backgroundColor: boxConfig.style.backgroundColor,
    borderRadius: boxConfig.style.borderRadius,
    boxShadow: boxConfig.style.boxShadow,
    border: boxConfig.style.border,
    opacity: boxConfig.style.opacity,
    backdropFilter: boxConfig.style.backdropFilter
  };
};

// Медіа-запроси для CSS
export const MEDIA_QUERIES = {
  mobile: `(max-width: ${RESPONSIVE_BREAKPOINTS.mobile - 1}px)`,
  tablet: `(min-width: ${RESPONSIVE_BREAKPOINTS.mobile}px) and (max-width: ${RESPONSIVE_BREAKPOINTS.tablet - 1}px)`,
  desktop: `(min-width: ${RESPONSIVE_BREAKPOINTS.tablet}px)`,
  mobileUp: `(min-width: ${RESPONSIVE_BREAKPOINTS.mobile}px)`,
  tabletUp: `(min-width: ${RESPONSIVE_BREAKPOINTS.tablet}px)`,
  desktopUp: `(min-width: ${RESPONSIVE_BREAKPOINTS.desktop}px)`
};

export default {
  RESPONSIVE_BREAKPOINTS,
  DEVICE_CONFIGS,
  getDeviceType,
  getLayoutConfig,
  getDynamicLayoutConfig,
  getResponsiveValue,
  getBoxConfig,
  getDynamicBoxConfig,
  generateResponsiveStyles,
  generateDynamicResponsiveStyles,
  generateBoxStyles,
  createDynamicLayoutConfig,
  MEDIA_QUERIES
}; 