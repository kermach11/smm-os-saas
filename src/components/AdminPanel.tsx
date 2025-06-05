import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroCustomizer from './IntroCustomizer';
import MainPageCustomizer from './MainPageCustomizer';
import WelcomeCustomizer from './WelcomeCustomizer';
import PreviewCustomizer from './PreviewCustomizer';
import PreviewGenerator from './PreviewGenerator';
import ClientManager from './ClientManager';
import AnalyticsPanel from './AnalyticsPanel';
import InstructionsPanel from './InstructionsPanel';
import ContentManager from './ContentManager';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabId = 'intro' | 'main' | 'content' | 'preview' | 'generator' | 'clients' | 'analytics' | 'instructions' | 'settings';

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabId>('preview');

  const tabs = [
    { id: 'preview', label: 'Превью Конструктор', icon: '🎨' },
    { id: 'intro', label: 'Конструктор Інтро', icon: '🎬' },
    { id: 'main', label: 'Конструктор Головної', icon: '🎠' },
    { id: 'content', label: 'Контенти', icon: '📁' },
    { id: 'generator', label: 'Генератор', icon: '⚡' },
    { id: 'clients', label: 'Клієнти', icon: '👥' },
    { id: 'analytics', label: 'Аналітика', icon: '📊' },
    { id: 'instructions', label: 'Інструкції', icon: '📚' },
    { id: 'settings', label: 'Налаштування', icon: '⚙️' }
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
      case 'generator':
        return <PreviewGenerator />;
      case 'clients':
        return <ClientManager />;
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Адміністративна панель</h2>
                  <p className="text-sm text-gray-600">Керування контентом та налаштуваннями</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Вийти
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600 bg-white'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
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
  const [settings, setSettings] = useState({
    siteName: 'SMM OS',
    adminEmail: 'admin@smmOS.com',
    enableAnalytics: true,
    enableNotifications: true,
    autoSave: true,
    theme: 'light',
    language: 'uk'
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    alert('Налаштування збережено!');
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
    <div className="p-6 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Загальні налаштування</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Назва сайту</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email адміністратора</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => updateSetting('adminEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тема</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Світла</option>
                <option value="dark">Темна</option>
                <option value="auto">Автоматично</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Мова</label>
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="uk">Українська</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Функції</h3>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableAnalytics}
                onChange={(e) => updateSetting('enableAnalytics', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-gray-700">Увімкнути аналітику</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-gray-700">Увімкнути сповіщення</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="mr-3"
              />
              <span className="text-sm font-medium text-gray-700">Автоматичне збереження</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Дані та резервне копіювання</h3>
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Зберегти налаштування
            </button>
            <button
              onClick={exportAllData}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Експорт всіх даних
            </button>
            <button
              onClick={clearAllData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Очистити всі дані
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Інформація про систему</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Версія:</span>
              <span className="ml-2 text-gray-600">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Останнє оновлення:</span>
              <span className="ml-2 text-gray-600">{new Date().toLocaleDateString('uk-UA')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Статус:</span>
              <span className="ml-2 text-green-600">Активний</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Режим:</span>
              <span className="ml-2 text-gray-600">Розробка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 