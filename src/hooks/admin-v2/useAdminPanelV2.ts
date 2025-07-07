import { useState, useEffect, useCallback } from 'react';
import { adminManager, AdminPanelVersion, DeviceType } from '../../components/admin-v2/AdminManager';

interface AdminPanelV2State {
  isVisible: boolean;
  currentVersion: AdminPanelVersion;
  deviceType: DeviceType;
  activeTab: string;
  isAuthenticated: boolean;
}

interface AdminPanelV2Config {
  width: string;
  height: string;
  padding: string;
  fontSize: {
    header: string;
    body: string;
    small: string;
  };
  spacing: {
    tabs: string;
    content: string;
    margins: string;
  };
}

interface AdminSessionData {
  timestamp: number;
  expiry: number;
}

/**
 * 🎯 Hook для управління адмін панеллю V2
 * 
 * Переваги над старою системою:
 * - Централізоване управління станом
 * - Автоматичне визначення пристрою
 * - Легке налаштування розмірів
 * - Безпечне перемикання версій
 * - Повна заміна V1 useSimpleAdminSession
 */
export const useAdminPanelV2 = () => {
  const [state, setState] = useState<AdminPanelV2State>(adminManager.getState());
  const [config, setConfig] = useState<AdminPanelV2Config>(adminManager.getDeviceConfig());

  // 📡 Підписка на зміни стану
  useEffect(() => {
    const unsubscribe = adminManager.subscribe((newState) => {
      setState(newState);
      setConfig(adminManager.getDeviceConfig());
    });

    return unsubscribe;
  }, []);

  // 🔐 SESSION MANAGEMENT (з V1 useSimpleAdminSession)
  // Перевірка активної сесії при завантаженні
  useEffect(() => {
    // Очищаємо застарілі налаштування showAdminButton
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings?.showAdminButton) {
          delete data.adminSettings.showAdminButton;
          localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
          console.log('🔧 Очищено застарілу настройку showAdminButton');
        }
      }
    } catch (error) {
      console.error('Помилка при очищенні застарілих настройок:', error);
    }

    const hasValidSession = checkExistingSession();
    if (hasValidSession) {
      setAuthenticated(true);
      console.log('✅ Admin session V2: Відновлено валідну сесію');
    }
    checkAdminUrlParameter();
  }, []);

  // Автоматичний logout при закінченні сесії
  useEffect(() => {
    if (state.isAuthenticated) {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as AdminSessionData;
          const now = new Date().getTime();
          const timeLeft = session.expiry - now;
          
          if (timeLeft > 0) {
            // Встановлюємо таймер для автоматичного logout
            const timer = setTimeout(() => {
              console.log('⏰ Admin session V2: Сесія закінчилась, автоматичний вихід');
              logout();
            }, timeLeft);
            
            return () => clearTimeout(timer);
          } else {
            // Сесія вже закінчилась
            logout();
          }
        } catch (error) {
          console.error('Помилка при налаштуванні автоматичного logout:', error);
          logout();
        }
      }
    }
  }, [state.isAuthenticated]);

  // 🎛️ Методи управління панеллю
  const togglePanel = useCallback((forceState?: boolean) => {
    adminManager.togglePanel(forceState);
  }, []);

  const switchVersion = useCallback((version: AdminPanelVersion) => {
    adminManager.switchVersion(version);
  }, []);

  const setActiveTab = useCallback((tab: string) => {
    adminManager.setActiveTab(tab);
  }, []);

  const setAuthenticated = useCallback((isAuthenticated: boolean) => {
    adminManager.setAuthenticated(isAuthenticated);
  }, []);

  // 🔐 SESSION METHODS (з V1 useSimpleAdminSession)
  const checkExistingSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session = JSON.parse(sessionData) as AdminSessionData;
        const now = new Date().getTime();
        
        if (now < session.expiry) {
          console.log('✅ Admin session V2: Знайдено валідну сесію, залишилось:', Math.round((session.expiry - now) / 1000 / 60), 'хвилин');
          return true;
        } else {
          console.log('⏰ Admin session V2: Сесія застаріла, видаляємо');
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Помилка при перевірці сесії:', error);
      localStorage.removeItem('adminSession');
    }
    return false;
  }, []);

  const login = useCallback(() => {
    setAuthenticated(true);
    console.log('🔐 Admin session V2: Користувач увійшов');
  }, [setAuthenticated]);

  const logout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setAuthenticated(false);
    console.log('🔐 Admin session V2: Користувач вийшов');
  }, [setAuthenticated]);

  // Перевірка URL параметра admin
  const checkAdminUrlParameter = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin');
  }, []);

  // 🔍 Перевірка показу кнопки адміна (покращена версія з V1)
  const shouldShowAdminButton = useCallback((): boolean => {
    // Перевіряємо URL параметр
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      return true;
    }
    
    // Перевіряємо чи це порт 8081 (админ-сервер)
    if (window.location.port === '8081') {
      return true;
    }
    
    // V2: Додаткова перевірка для development mode
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    return false;
  }, []);

  // 📐 Отримання розмірів для поточного пристрою
  const getOptimalDimensions = useCallback(() => {
    return adminManager.getOptimalDimensions();
  }, []);

  // 🎨 Генерація стилів для поточного пристрою
  const getDeviceStyles = useCallback(() => {
    const { isMobile, isTablet, isDesktop } = adminManager.getOptimalDimensions();
    
    return {
      container: {
        width: config.width,
        height: config.height,
        padding: config.padding,
        fontSize: config.fontSize.body,
        // Responsive класи
        className: `
          ${isMobile ? 'admin-panel-mobile' : ''}
          ${isTablet ? 'admin-panel-tablet' : ''}
          ${isDesktop ? 'admin-panel-desktop' : ''}
        `.trim()
      },
      header: {
        fontSize: config.fontSize.header,
        marginBottom: config.spacing.margins
      },
      tabs: {
        gap: config.spacing.tabs,
        fontSize: config.fontSize.small
      },
      content: {
        padding: config.spacing.content,
        fontSize: config.fontSize.body
      }
    };
  }, [config]);

  // 🔄 Перемикання між версіями
  const toggleVersionSafely = useCallback(() => {
    const newVersion: AdminPanelVersion = state.currentVersion === 'v1' ? 'v2' : 'v1';
    switchVersion(newVersion);
  }, [state.currentVersion, switchVersion]);

  // 🚨 Аварійне повернення до v1
  const forceV1 = useCallback(() => {
    switchVersion('v1');
    console.log('🚨 Forced switch to Admin Panel V1');
  }, [switchVersion]);

  // 🧪 Тестування нової версії
  const testV2 = useCallback(() => {
    switchVersion('v2');
    console.log('🧪 Testing Admin Panel V2');
  }, [switchVersion]);

  return {
    // Стан
    isVisible: state.isVisible,
    currentVersion: state.currentVersion,
    deviceType: state.deviceType,
    activeTab: state.activeTab,
    isAuthenticated: state.isAuthenticated,
    
    // V1 Compatibility (alias для isAuthenticated)
    isAdmin: state.isAuthenticated,
    
    // Конфігурація
    config,
    
    // Методи управління
    togglePanel,
    switchVersion,
    setActiveTab,
    setAuthenticated,
    
    // V1 Session Management
    login,
    logout,
    checkExistingSession,
    checkAdminUrlParameter,
    
    // Утилітарні функції
    shouldShowAdminButton,
    getOptimalDimensions,
    getDeviceStyles,
    
    // Безпечне перемикання версій
    toggleVersionSafely,
    forceV1,
    testV2,
    
    // Метадані
    isV1: state.currentVersion === 'v1',
    isV2: state.currentVersion === 'v2',
    isMobile: state.deviceType === 'mobile',
    isTablet: state.deviceType === 'tablet',
    isDesktop: state.deviceType === 'desktop'
  };
}; 