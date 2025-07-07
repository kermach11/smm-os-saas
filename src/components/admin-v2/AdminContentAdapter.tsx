import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import IntroCustomizer from '../IntroCustomizer';
import MainPageCustomizer from '../MainPageCustomizer';
import PreviewCustomizer from '../PreviewCustomizer';
import AnalyticsPanel from '../AnalyticsPanel';
import InstructionsPanel from '../InstructionsPanel';
import ContentManager from '../ContentManager';
import { useTranslation } from '../../hooks/useTranslation';
import { DeviceType } from '../../config/admin-v2/responsiveConfig';

export type AdminTabId = 'preview' | 'intro' | 'main' | 'content' | 'analytics' | 'instructions' | 'settings';

interface AdminContentAdapterProps {
  activeTab: AdminTabId;
  deviceType: DeviceType;
  onClose?: () => void;
  onLogout?: () => void;
}

/**
 * 🔌 ADMIN CONTENT ADAPTER - Адаптер для V1 компонентів
 * 
 * Цей адаптер дозволяє використовувати всі існуючі компоненти V1
 * в новій V2 системі без жодних змін у оригінальному коді.
 * 
 * Переваги:
 * - Зберігає всю функціональність V1
 * - Адаптується до responsive конфігурації V2
 * - Легко додавати нові компоненти
 */
const AdminContentAdapter: React.FC<AdminContentAdapterProps> = ({ 
  activeTab, 
  deviceType, 
  onClose, 
  onLogout 
}) => {
  
  // 🎨 Рендер компонентів з V1 системи
  const renderContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="w-full h-full">
            <PreviewCustomizer />
          </div>
        );
        
      case 'intro':
        return (
          <div className="w-full h-full">
            <IntroCustomizer />
          </div>
        );
        
      case 'main':
        return (
          <div className="w-full h-full">
            <MainPageCustomizer />
          </div>
        );
        
      case 'content':
        return (
          <div className="w-full h-full">
            <ContentManager />
          </div>
        );
        
      case 'analytics':
        return (
          <div className="w-full h-full">
            <AnalyticsPanel />
          </div>
        );
        
      case 'instructions':
        return (
          <div className="w-full h-full">
            <InstructionsPanel />
          </div>
        );
        
      case 'settings':
        return (
          <div className="w-full h-full">
            <SettingsTab deviceType={deviceType} />
          </div>
        );
        
      default:
        return (
          <div className="w-full h-full">
            <PreviewCustomizer />
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {/* 🎯 Обгортка для V1 компонентів */}
      <div className="w-full h-full relative">
        {renderContent()}
      </div>
    </div>
  );
};

/**
 * 🛠️ SETTINGS TAB - Повноцінний компонент налаштувань з V1
 */
const SettingsTab: React.FC<{ deviceType: DeviceType }> = ({ deviceType }) => {
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
  useEffect(() => {
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
  useEffect(() => {
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
    <div className="h-full flex flex-col">
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
            <span className="text-white text-xs font-medium">V2.0.0 ({deviceType})</span>
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
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Інформація про V2 систему</p>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-2 lg:p-4">
              <div className="text-lg lg:text-2xl font-bold text-violet-600">V2.0</div>
              <div className="text-xs lg:text-sm text-slate-600">Версія</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 lg:p-4">
              <div className="text-lg lg:text-2xl font-bold text-purple-600 capitalize">{deviceType}</div>
              <div className="text-xs lg:text-sm text-slate-600">Пристрій</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 lg:p-4">
              <div className="text-lg lg:text-2xl font-bold text-green-600">100%</div>
              <div className="text-xs lg:text-sm text-slate-600">V1 функції</div>
            </div>
            <div className="bg-white/60 rounded-lg p-2 lg:p-4">
              <div className="text-lg lg:text-2xl font-bold text-blue-600">7</div>
              <div className="text-xs lg:text-sm text-slate-600">Активних модулів</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentAdapter; 