/**
 * ⚠️ DEPRECATED: AdminPanel V1 - ЗАСТАРІЛА ВЕРСІЯ
 * 
 * Цей компонент замінено на AdminPanelV2.
 * 
 * Статус: DEPRECATED since V2.0
 * Заміна: AdminPanelV2 (main/src/components/admin-v2/AdminPanelV2.tsx)
 * 
 * Причини deprecation:
 * - Відсутність responsive дизайну
 * - Застаріла архітектура
 * - Проблеми з touch scroll на мобільних
 * - Важко підтримувати код
 * 
 * Залишається для зворотної сумісності, але не розвивається.
 * Рекомендується використовувати AdminPanelV2.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import IntroCustomizer from './IntroCustomizer';
import MainPageCustomizer from './MainPageCustomizer';
import PreviewCustomizer from './PreviewCustomizer';
import AnalyticsPanel from './AnalyticsPanel';
import InstructionsPanel from './InstructionsPanel';
import ContentManager from './ContentManager';
import { useTranslation } from '../hooks/useTranslation';


interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabId = 'intro' | 'main' | 'content' | 'preview' | 'analytics' | 'instructions' | 'settings';

const AdminPanelContent: React.FC<AdminPanelProps> = ({ isOpen, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>('preview');
  const { t } = useTranslation();
  
  // Визначення типу пристрою для масштабування
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const tabs = [
    { id: 'preview', label: t('nav.preview'), icon: '🎨' },
    { id: 'intro', label: t('nav.intro'), icon: '🎬' },
    { id: 'main', label: t('nav.main'), icon: '🎠' },
    { id: 'content', label: t('nav.content'), icon: '📁' },
    { id: 'analytics', label: t('nav.analytics'), icon: '📊' },
    { id: 'instructions', label: t('nav.instructions'), icon: '📚' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroCustomizer />;
      case 'main':
        return <MainPageCustomizer />;
      case 'content':
        return <ContentManager />;
      case 'preview':
        return <PreviewCustomizer />;


      case 'analytics':
        return <AnalyticsPanel />;
      case 'instructions':
        return <InstructionsPanel />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <PreviewCustomizer />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 lg:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ 
              scale: isDesktop ? 0.85 : 1, 
              opacity: 1, 
              y: 0 
            }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-none lg:rounded-2xl shadow-2xl w-full max-w-[1400px] h-screen lg:h-[90vh] flex flex-col overflow-hidden border-0 lg:border border-slate-200/50"
            style={{ 
              marginBottom: window.innerWidth < 768 ? '20px' : '0' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fullscreen Mobile Header */}
            <div className="pt-4 px-3 pb-3 lg:p-4 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-xl flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-base lg:text-base">🛠️</span>
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-bold text-white">{t('admin.title')}</h2>
                    <p className="text-blue-100 text-xs hidden lg:block">{t('admin.dashboard')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-2">
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 lg:px-3 lg:py-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-sm lg:text-sm touch-manipulation"
                  >
                    🚪 <span className="hidden sm:inline">{t('admin.logout')}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 lg:w-8 lg:h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 touch-manipulation"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Ultra Compact Mobile Tabs */}
            <div className="flex bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60 overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab, index) => {
                // Статичні стилі для кожної вкладки
                const tabStyles = {
                  'preview': {
                    active: 'text-blue-600 bg-white shadow-md rounded-t-lg border-t-2 border-blue-500',
                    indicator: 'bg-gradient-to-r from-blue-400 to-blue-600'
                  },
                  'intro': {
                    active: 'text-emerald-600 bg-white shadow-md rounded-t-lg border-t-2 border-emerald-500',
                    indicator: 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  },
                  'main': {
                    active: 'text-purple-600 bg-white shadow-md rounded-t-lg border-t-2 border-purple-500',
                    indicator: 'bg-gradient-to-r from-purple-400 to-purple-600'
                  },
                  'content': {
                    active: 'text-amber-600 bg-white shadow-md rounded-t-lg border-t-2 border-amber-500',
                    indicator: 'bg-gradient-to-r from-amber-400 to-amber-600'
                  },
                  'analytics': {
                    active: 'text-rose-600 bg-white shadow-md rounded-t-lg border-t-2 border-rose-500',
                    indicator: 'bg-gradient-to-r from-rose-400 to-rose-600'
                  },
                  'instructions': {
                    active: 'text-cyan-600 bg-white shadow-md rounded-t-lg border-t-2 border-cyan-500',
                    indicator: 'bg-gradient-to-r from-cyan-400 to-cyan-600'
                  },
                  'settings': {
                    active: 'text-indigo-600 bg-white shadow-md rounded-t-lg border-t-2 border-indigo-500',
                    indicator: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
                  }
                };
                
                const currentStyle = tabStyles[tab.id as keyof typeof tabStyles];
                
                // Скорочені назви для мобільних
                const shortLabels: { [key: string]: string } = {
                  'preview': 'Превю',
                  'intro': 'Інтро', 
                  'main': 'Головна',
                  'content': 'Контент',
                  'analytics': 'Аналітика',
                  'instructions': 'Інструкції', 
                  'settings': 'Налаштування'
                };
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 lg:gap-2 px-0.5 lg:px-4 py-1.5 lg:py-3 text-sm font-medium transition-all duration-300 relative group touch-manipulation min-h-[44px] lg:min-h-[auto] ${
                      activeTab === tab.id
                        ? currentStyle.active
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-t-md'
                    }`}
                  >
                    <span className={`text-sm lg:text-lg transition-transform duration-200 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {tab.icon}
                    </span>
                    <span className="text-[9px] sm:text-xs lg:text-sm font-semibold text-center leading-tight max-w-full truncate px-0.5">
                      <span className="lg:hidden">{shortLabels[tab.id] || tab.label}</span>
                      <span className="hidden lg:inline">{tab.label}</span>
                    </span>
                    {activeTab === tab.id && (
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${currentStyle.indicator}`}
                        style={{ height: '2px' }}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {renderTabContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Settings Tab Component
const SettingsTab: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const [settings, setSettings] = useState({
    siteName: 'SMM OS',
    adminEmail: 'admin@smmOS.com',
    language: 'uk'
  });

  const [securitySettings, setSecuritySettings] = useState({
    adminLogin: 'admin',
    adminPassword: 'admin123',
    sessionDuration: 30,
    showAdminButton: false,
    autoLogout: true
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Синхронізуємо мову з контекстом при завантаженні
  React.useEffect(() => {
    setSettings(prev => ({ ...prev, language }));
  }, [language]);

  const updateSetting = (key: string, value: string | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    // Автоматично зберігаємо налаштування
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
    
    // Синхронізуємо зміну мови з контекстом
    if (key === 'language' && typeof value === 'string') {
      setLanguage(value as 'uk' | 'en' | 'ru');
    }
  };

  const updateSecuritySetting = (key: string, value: string | boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert(t('settings.saved'));
  };

  const saveSecuritySettings = () => {
    // Зберігаємо в immersiveExperienceData як робить поточна система
    try {
      const existingData = localStorage.getItem('immersiveExperienceData');
      let data = {};
      if (existingData) {
        data = JSON.parse(existingData);
      }
      
      // Оновлюємо секцію adminSettings
      (data as any).adminSettings = {
        login: securitySettings.adminLogin,
        password: securitySettings.adminPassword,
        sessionDuration: securitySettings.sessionDuration,
        // showAdminButton: securitySettings.showAdminButton, // ВІДКЛЮЧЕНО - контролюється через URL
        autoLogout: securitySettings.autoLogout
      };
      
      localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
      alert('🔐 Налаштування безпеки збережено!');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('❌ Помилка збереження налаштувань безпеки');
    }
  };

  // Завантаження наявних налаштувань при старті
  React.useEffect(() => {
    try {
      // Завантажуємо налаштування безпеки
      const existingData = localStorage.getItem('immersiveExperienceData');
      if (existingData) {
        const data = JSON.parse(existingData);
        if (data.adminSettings) {
          setSecuritySettings({
            adminLogin: data.adminSettings.login || 'admin',
            adminPassword: data.adminSettings.password || 'admin123',
            sessionDuration: data.adminSettings.sessionDuration || 30,
            showAdminButton: false, // ЗАВЖДИ false - контролюється через URL
            autoLogout: data.adminSettings.autoLogout !== false
          });
        }
      }

      // Завантажуємо загальні налаштування
      const generalSettings = localStorage.getItem('adminSettings');
      if (generalSettings) {
        const data = JSON.parse(generalSettings);
        setSettings({
          siteName: data.siteName || 'SMM OS',
          adminEmail: data.adminEmail || 'admin@smmOS.com',
          language: data.language || 'uk'
        });
      }
    } catch (error) {
      console.error('Помилка завантаження налаштувань:', error);
    }
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    // Зберігаємо вибір теми в localStorage
    localStorage.setItem('selectedTheme', newTheme);
  };

  const exportAllData = () => {
    const allData = {
      settings,
      introSettings: localStorage.getItem('introSettings'),
      mainPageSettings: localStorage.getItem('mainPageSettings'),
      previewSettings: localStorage.getItem('previewSettings'),
      immersiveExperienceData: localStorage.getItem('immersiveExperienceData'),
      analyticsData: localStorage.getItem('analyticsData'),
      clientsData: localStorage.getItem('clientsData')
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smm-os-backup.json';
    link.click();
  };

  const clearAllData = () => {
    if (confirm('Ви впевнені, що хочете очистити всі дані? Цю дію неможливо скасувати.')) {
      localStorage.clear();
      alert('Всі дані очищено!');
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Ultra-Compact Header - IntroCustomizer Style */}
      <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-600 to-gray-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="w-4 h-4 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">⚙️</span>
            </div>
            <div>
              <h2 className="text-xs lg:text-lg font-bold text-white">{t('settings.system.title')}</h2>
              <p className="text-white/80 text-xs hidden lg:block">{t('settings.system.description')}</p>
            </div>
          </div>
          <div className="px-1 lg:px-3 py-0.5 lg:py-1 bg-white/20 backdrop-blur-sm rounded-md lg:rounded-lg border border-white/20">
            <span className="text-white text-xs font-medium">v1.0.0</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-1.5 lg:p-4 space-y-2 lg:space-y-4">
        {/* General Settings - Ultra-Compact */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
            <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">🏢</span>
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold text-slate-800">{t('settings.general')}</h3>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('settings.general.description')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6">
            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                {t('settings.site.name')}
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm lg:text-base min-h-[36px] touch-manipulation"
                placeholder={t('settings.site.name.placeholder')}
              />
            </div>

            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-cyan-500 rounded-full"></span>
                {t('settings.admin.email')}
              </label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm lg:text-base min-h-[36px] touch-manipulation"
                placeholder={t('settings.admin.email.placeholder')}
              />
            </div>

            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-indigo-500 rounded-full"></span>
                {t('settings.theme')}
              </label>
              <select
                value={theme || 'light'}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[36px] touch-manipulation"
              >
                <option value="light">{t('settings.theme.light')}</option>
                <option value="dark">{t('settings.theme.dark')}</option>
                <option value="system">{t('settings.theme.system')}</option>
              </select>
              <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                {t('settings.theme.current')} <span className="font-semibold">{
                  theme === 'light' ? t('settings.theme.light') : 
                  theme === 'dark' ? t('settings.theme.dark') : 
                  t('settings.theme.system')
                }</span>
              </p>
            </div>

            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                {t('settings.language')}
              </label>
              <select
                value={language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[36px] touch-manipulation"
              >
                <option value="uk">{t('settings.language.uk')}</option>
                <option value="en">{t('settings.language.en')}</option>
                <option value="ru">{t('settings.language.ru')}</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-2 lg:pt-4 border-t border-blue-100">
            <button
              onClick={saveSettings}
              className="px-3 lg:px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-md lg:rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base min-h-[36px] touch-manipulation"
            >
              {t('settings.save')}
            </button>
          </div>
        </div>

        {/* Security Settings - Ultra-Compact */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-red-100 shadow-sm">
          <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
            <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">🔐</span>
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold text-slate-800">{t('security.title')}</h3>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('security.description')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-6">
            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-red-500 rounded-full"></span>
                {t('security.admin.login')}
              </label>
              <input
                type="text"
                value={securitySettings.adminLogin}
                onChange={(e) => updateSecuritySetting('adminLogin', e.target.value)}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-sm lg:text-base min-h-[36px] touch-manipulation"
                placeholder={t('security.admin.login.placeholder')}
              />
            </div>

            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-pink-500 rounded-full"></span>
                {t('security.admin.password')}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={securitySettings.adminPassword}
                  onChange={(e) => updateSecuritySetting('adminPassword', e.target.value)}
                  className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 pr-8 lg:pr-12 text-sm lg:text-base min-h-[36px] touch-manipulation"
                  placeholder={t('security.admin.password.placeholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors min-w-[24px] min-h-[24px] touch-manipulation"
                >
                  <span className="text-xs lg:text-sm">{showCurrentPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                <span className="w-1 h-1 lg:w-2 lg:h-2 bg-orange-500 rounded-full"></span>
                {t('security.session.duration')}
              </label>
              <select
                value={securitySettings.sessionDuration}
                onChange={(e) => updateSecuritySetting('sessionDuration', parseInt(e.target.value))}
                className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 text-sm lg:text-base min-h-[36px] touch-manipulation"
              >
                <option value={15}>{t('security.session.15min')}</option>
                <option value={30}>{t('security.session.30min')}</option>
                <option value={60}>{t('security.session.1hour')}</option>
                <option value={120}>{t('security.session.2hours')}</option>
                <option value={480}>{t('security.session.8hours')}</option>
              </select>
            </div>

            <div className="group">
              <label className="flex items-center p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-red-100 hover:bg-white/80 transition-all duration-200 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={securitySettings.showAdminButton}
                  onChange={(e) => updateSecuritySetting('showAdminButton', e.target.checked)}
                  className="w-4 h-4 lg:w-5 lg:h-5 text-red-600 border-red-300 rounded focus:ring-red-500 mr-2 lg:mr-4 touch-manipulation"
                />
                <div>
                  <span className="text-xs lg:text-sm font-semibold text-slate-800">{t('security.show.admin.button')}</span>
                  <p className="text-xs text-slate-500 hidden lg:block">{t('security.show.admin.button.description')}</p>
                </div>
              </label>
            </div>
          </div>

          <div className="mt-2 lg:mt-6 flex gap-2 lg:gap-4">
            <button
              onClick={saveSecuritySettings}
              className="px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-md lg:rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-1 lg:gap-2 text-sm lg:text-base min-h-[36px] touch-manipulation"
            >
              {t('security.save')}
            </button>
          </div>
        </div>



        {/* Data & Backup - Ultra-Compact */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
            <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">💾</span>
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold text-slate-800">{t('data.title')}</h3>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('data.description')}</p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-4">
            <button
              onClick={saveSettings}
              className="w-full lg:w-auto px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md lg:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-1 lg:gap-2 text-sm lg:text-base min-h-[36px] touch-manipulation"
            >
              {t('settings.save')}
            </button>
            <button
              onClick={exportAllData}
              className="w-full lg:w-auto px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md lg:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-1 lg:gap-2 text-sm lg:text-base min-h-[36px] touch-manipulation"
            >
              {t('data.export')}
            </button>
            <button
              onClick={clearAllData}
              className="w-full lg:w-auto px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md lg:rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-1 lg:gap-2 text-sm lg:text-base min-h-[36px] touch-manipulation"
            >
              {t('data.clear')}
            </button>
          </div>
        </div>

        {/* System Info - Ultra-Compact */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-violet-100 shadow-sm mb-2 lg:mb-6">
          <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
            <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">ℹ️</span>
            </div>
            <div>
              <h3 className="text-sm lg:text-lg font-bold text-slate-800">{t('system.title')}</h3>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('system.description')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
            <div className="bg-white/60 p-2 lg:p-4 rounded-md lg:rounded-xl border border-violet-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-xs lg:text-sm">{t('system.version')}</span>
                <span className="text-slate-600 font-mono text-xs lg:text-sm">1.0.0</span>
              </div>
            </div>
            <div className="bg-white/60 p-2 lg:p-4 rounded-md lg:rounded-xl border border-violet-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-xs lg:text-sm">{t('system.last.update')}</span>
                <span className="text-slate-600 text-xs lg:text-sm">{new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : language === 'ru' ? 'ru-RU' : 'en-US')}</span>
              </div>
            </div>
            <div className="bg-white/60 p-2 lg:p-4 rounded-md lg:rounded-xl border border-violet-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-xs lg:text-sm">{t('system.status')}</span>
                <span className="text-green-600 font-semibold flex items-center gap-1 text-xs lg:text-sm">
                  <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                  {t('system.status.active')}
                </span>
              </div>
            </div>
            <div className="bg-white/60 p-2 lg:p-4 rounded-md lg:rounded-xl border border-violet-100">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-xs lg:text-sm">{t('system.mode')}</span>
                <span className="text-slate-600 text-xs lg:text-sm">{t('system.mode.development')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel: React.FC<AdminPanelProps> = (props) => (
  <AdminPanelContent {...props} />
);

export default AdminPanel; 