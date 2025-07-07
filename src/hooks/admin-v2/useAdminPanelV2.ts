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

/**
 * 🎯 Hook для управління адмін панеллю V2
 * 
 * Переваги над старою системою:
 * - Централізоване управління станом
 * - Автоматичне визначення пристрою
 * - Легке налаштування розмірів
 * - Безпечне перемикання версій
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

  // 🔍 Перевірка показу кнопки адміна
  const shouldShowAdminButton = useCallback(() => {
    return adminManager.shouldShowAdminButton();
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
    
    // Конфігурація
    config,
    
    // Методи управління
    togglePanel,
    switchVersion,
    setActiveTab,
    setAuthenticated,
    
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