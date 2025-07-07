/**
 * 🎯 RESPONSIVE CONFIG V2 - Налаштування для адмін панелі V2
 * 
 * Легке корегування розмірів та стилів для кожного пристрою.
 * Тут ви можете змінювати всі параметри без лазіння в код компонентів!
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

// 🎨 Конфігурація кольорів
export const ADMIN_COLORS = {
  primary: {
    blue: '#3B82F6',
    purple: '#8B5CF6',
    green: '#10B981'
  },
  gradients: {
    header: 'from-blue-600 to-purple-600',
    background: 'from-slate-50 to-white',
    buttons: 'from-blue-500 to-blue-600'
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    white: '#FFFFFF'
  },
  borders: {
    light: 'border-slate-200/50',
    medium: 'border-slate-300',
    focus: 'border-blue-500'
  }
};

// 📱 Мобільна конфігурація (< 768px)
export const MOBILE_CONFIG = {
  // Розміри панелі
  panel: {
    width: '100vw',
    height: '100vh',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '0px', // На мобільному без заокруглень
    padding: '12px',
    margin: '0px'
  },
  
  // Хедер
  header: {
    height: '60px',
    padding: '12px 16px',
    fontSize: {
      title: '18px',
      subtitle: '12px'
    },
    spacing: '8px'
  },
  
  // Вкладки
  tabs: {
    height: '50px',
    fontSize: '10px',
    iconSize: '16px',
    padding: '8px 4px',
    gap: '2px',
    minWidth: '60px'
  },
  
  // Контент
  content: {
    padding: '16px 12px',
    fontSize: {
      body: '14px',
      small: '12px',
      large: '16px'
    },
    lineHeight: '1.4',
    spacing: '12px'
  },
  
  // Форми та інпути
  forms: {
    inputHeight: '44px', // Для touch-friendly
    buttonHeight: '44px',
    fontSize: '16px', // Щоб iOS не зумив
    borderRadius: '8px',
    spacing: '12px'
  },
  
  // Спеціальні налаштування
  special: {
    scrollable: true,
    touchOptimized: true,
    reduceAnimations: true
  }
};

// 📟 Планшетна конфігурація (768px - 1024px)
export const TABLET_CONFIG = {
  panel: {
    width: '90vw',
    height: '85vh',
    maxWidth: '800px',
    maxHeight: '700px',
    borderRadius: '16px',
    padding: '20px',
    margin: '20px'
  },
  
  header: {
    height: '70px',
    padding: '16px 24px',
    fontSize: {
      title: '20px',
      subtitle: '14px'
    },
    spacing: '12px'
  },
  
  tabs: {
    height: '60px',
    fontSize: '12px',
    iconSize: '20px',
    padding: '12px 8px',
    gap: '4px',
    minWidth: '80px'
  },
  
  content: {
    padding: '20px 16px',
    fontSize: {
      body: '16px',
      small: '14px',
      large: '18px'
    },
    lineHeight: '1.5',
    spacing: '16px'
  },
  
  forms: {
    inputHeight: '40px',
    buttonHeight: '40px',
    fontSize: '16px',
    borderRadius: '10px',
    spacing: '16px'
  },
  
  special: {
    scrollable: false,
    touchOptimized: true,
    reduceAnimations: false
  }
};

// 🖥️ Десктопна конфігурація (> 1024px)
export const DESKTOP_CONFIG = {
  panel: {
    width: '1200px',
    height: '800px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    borderRadius: '20px',
    padding: '32px',
    margin: '40px'
  },
  
  header: {
    height: '80px',
    padding: '20px 32px',
    fontSize: {
      title: '24px',
      subtitle: '16px'
    },
    spacing: '16px'
  },
  
  tabs: {
    height: '70px',
    fontSize: '14px',
    iconSize: '24px',
    padding: '16px 12px',
    gap: '8px',
    minWidth: '120px'
  },
  
  content: {
    padding: '24px 20px',
    fontSize: {
      body: '16px',
      small: '14px',
      large: '20px'
    },
    lineHeight: '1.6',
    spacing: '20px'
  },
  
  forms: {
    inputHeight: '42px',
    buttonHeight: '42px',
    fontSize: '16px',
    borderRadius: '12px',
    spacing: '20px'
  },
  
  special: {
    scrollable: false,
    touchOptimized: false,
    reduceAnimations: false
  }
};

// 🎛️ Динамічний вибір конфігурації
export const getDeviceConfig = (deviceType: DeviceType) => {
  switch (deviceType) {
    case 'mobile':
      return MOBILE_CONFIG;
    case 'tablet':
      return TABLET_CONFIG;
    case 'desktop':
      return DESKTOP_CONFIG;
    default:
      return DESKTOP_CONFIG;
  }
};

// 🎨 Генератор CSS стилів
export const generateDeviceStyles = (deviceType: DeviceType) => {
  const config = getDeviceConfig(deviceType);
  
  return {
    panel: {
      width: config.panel.width,
      height: config.panel.height,
      maxWidth: config.panel.maxWidth,
      maxHeight: config.panel.maxHeight,
      borderRadius: config.panel.borderRadius,
      padding: config.panel.padding,
      margin: config.panel.margin
    },
    
    header: {
      height: config.header.height,
      padding: config.header.padding,
      fontSize: config.header.fontSize.title,
      gap: config.header.spacing
    },
    
    tabs: {
      height: config.tabs.height,
      fontSize: config.tabs.fontSize,
      padding: config.tabs.padding,
      gap: config.tabs.gap,
      minWidth: config.tabs.minWidth
    },
    
    content: {
      padding: config.content.padding,
      fontSize: config.content.fontSize.body,
      lineHeight: config.content.lineHeight,
      gap: config.content.spacing
    },
    
    forms: {
      inputHeight: config.forms.inputHeight,
      buttonHeight: config.forms.buttonHeight,
      fontSize: config.forms.fontSize,
      borderRadius: config.forms.borderRadius,
      gap: config.forms.spacing
    }
  };
};

// 🔧 Утилітарні функції
export const isMobileDevice = (deviceType: DeviceType) => deviceType === 'mobile';
export const isTabletDevice = (deviceType: DeviceType) => deviceType === 'tablet';
export const isDesktopDevice = (deviceType: DeviceType) => deviceType === 'desktop';

// 📐 Breakpoints для автоматичного визначення
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024
};

export const detectDeviceType = (width: number): DeviceType => {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

// 🎯 Експорт всіх конфігурацій для легкого доступу
export const DEVICE_CONFIGS = {
  mobile: MOBILE_CONFIG,
  tablet: TABLET_CONFIG,
  desktop: DESKTOP_CONFIG
} as const; 