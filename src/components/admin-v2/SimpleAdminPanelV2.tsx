/**
 * 🎯 SIMPLE ADMIN PANEL V2 - Спрощена версія адмін панелі на базі V2
 * 
 * Поєднує простоту SimpleAdminPanel з потужністю V2 архітектури:
 * - Responsive дизайн з V2
 * - Вся функціональність оригінального SimpleAdminPanel
 * - Покращена логіка скролу
 * - Сумісність з V2 hooks
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminPanelV2 } from '../../hooks/admin-v2/useAdminPanelV2';
import { useTranslation } from '../../hooks/useTranslation';

interface SimpleAdminPanelV2Props {
  isVisible: boolean;
  onClose: () => void;
}

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  url?: string;
}

const SimpleAdminPanelV2: React.FC<SimpleAdminPanelV2Props> = ({ isVisible, onClose }) => {
  const { t } = useTranslation();
  const { deviceType, config, getDeviceStyles } = useAdminPanelV2();
  const [activeTab, setActiveTab] = useState('content');
  
  // 📦 Стан даних (ідентичний оригінальному SimpleAdminPanel)
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([,
    {
      title: "ADLAND",
      description: "Посадкові сторінки під рекламу. Швидкі, точні, ефективні.",
      image: "/photo/photo-4.png",
      url: "#adland"
    },
    {
      title: "SELLKIT",
      description: "Магазин цифрових продуктів: гайдпаки, шаблони, caption-сети.",
      image: "/photo/photo-5.png",
      url: "#sellkit"
    }
  ]);

  const [introSettings, setIntroSettings] = useState({
    titleTop: "Beyond",
    titleMiddle: "Reality", 
    description: "Travel through time and space in the exciting universe of the future.",
    buttonText: "Start Journey"
  });

  const [adminSettings, setAdminSettings] = useState({
    password: 'admin123',
    showAdminButton: false,
    autoLogout: true,
    logoutTime: 30
  });

  const [audioSettings, setAudioSettings] = useState({
    backgroundMusic: null,
    hoverSound: null,
    clickSound: null,
    transitionSound: null
  });

  const [backgroundSettings, setBackgroundSettings] = useState({
    intro: {
      type: 'color',
      color: '#000000',
      image: null,
      video: null
    },
    main: {
      type: 'color', 
      color: '#121420',
      image: null,
      video: null
    }
  });

  // 🎨 V2 стилі
  const styles = getDeviceStyles();

  // 📱 Responsive розміри
  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';

  // 🔄 Завантаження даних з localStorage
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // 🎯 ПОКРАЩЕНИЙ ФІКС СКРОЛУ ДЛЯ V2
  useEffect(() => {
    if (isVisible) {
      // Використовуємо V2 логіку - не блокуємо скрол повністю
      document.body.style.position = 'relative';
      document.body.style.overflowX = 'hidden';
      
      // Додаємо V2 клас для CSS селекторів
      document.body.classList.add('simple-admin-panel-v2-active');
    }
    
    return () => {
      if (isVisible) {
        document.body.style.position = '';
        document.body.style.overflowX = '';
        document.body.classList.remove('simple-admin-panel-v2-active');
      }
    };
  }, [isVisible]);

  const loadDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.carouselItems) setCarouselItems(data.carouselItems);
        
        
        if (data.introSettings) setIntroSettings(data.introSettings);
        if (data.adminSettings) {
          setAdminSettings({
            ...data.adminSettings,
            showAdminButton: false
          });
        }
        if (data.audioSettings) setAudioSettings(data.audioSettings);
        if (data.backgroundSettings) setBackgroundSettings(data.backgroundSettings);
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    }
  };

  const saveChanges = () => {
    try {
      const dataToSave = {
        carouselItems,
        introSettings,
        adminSettings: {
          ...adminSettings,
          showAdminButton: false
        },
        audioSettings,
        backgroundSettings,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('immersiveExperienceData', JSON.stringify(dataToSave));
      
      window.dispatchEvent(new CustomEvent('adminDataUpdated', { 
        detail: { carouselItems, introSettings, adminSettings, audioSettings, backgroundSettings }
      }));
      
      alert('✅ Зміни збережено успішно! (SimpleAdminPanelV2)');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('❌ Помилка при збереженні змін');
    }
  };

  const addCarouselItem = () => {
    const newItem: CarouselItem = {
      title: "Новий елемент",
      description: "Опис нового елемента",
      image: "/photo/placeholder.jpg",
      url: ""
    };
    setCarouselItems([...carouselItems, newItem]);
  };

  const removeCarouselItem = (index: number) => {
    const newItems = carouselItems.filter((_, i) => i !== index);
    setCarouselItems(newItems);
  };

  const updateCarouselItem = (index: number, field: keyof CarouselItem, value: string) => {
    const newItems = [...carouselItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setCarouselItems(newItems);
  };

  // 🎯 Вкладки з V2 стилізацією
  const tabs = [
    { id: 'content', label: 'Контент', icon: '📝' },
    { id: 'intro', label: 'Інтро', icon: '🎬' },
    { id: 'admin', label: 'Адмін', icon: '⚙️' },
    { id: 'audio', label: 'Аудіо', icon: '🎵' },
    { id: 'background', label: 'Фон', icon: '🖼️' }
  ];

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="simple-admin-panel-v2-container fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 lg:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ 
            scale: isMobile ? 1 : 0.9, 
            opacity: 1, 
            y: 0 
          }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-50 to-white rounded-none lg:rounded-2xl shadow-2xl overflow-hidden border-0 lg:border border-slate-200/50"
          style={{
            width: config.width,
            height: config.height,
            maxWidth: isMobile ? '100%' : '1200px',
            maxHeight: isMobile ? '100%' : '85vh'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 🎯 V2 HEADER */}
          <div className={`${config.padding} bg-gradient-to-r from-blue-600 to-purple-600 relative`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-lg">🛠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Simple Admin V2</h2>
                  <p className="text-blue-100 text-sm">Покращена версія • {deviceType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border border-white/20">
                  <span className="text-white text-sm font-medium">V2.0</span>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* 🎯 V2 TABS */}
          <div className="flex bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-white shadow-md rounded-t-lg border-t-2 border-blue-500'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 🎯 V2 CONTENT */}
          <div className="flex-1 overflow-y-auto" style={{ padding: config.padding }}>
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">🎠 Carousel Items</h3>
                  <button
                    onClick={addCarouselItem}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    + Додати
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {carouselItems.map((item, index) => (
                    <div key={index} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-slate-800">Елемент {index + 1}</h4>
                        <button
                          onClick={() => removeCarouselItem(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateCarouselItem(index, 'title', e.target.value)}
                          placeholder="Заголовок"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={item.description}
                          onChange={(e) => updateCarouselItem(index, 'description', e.target.value)}
                          placeholder="Опис"
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => updateCarouselItem(index, 'image', e.target.value)}
                          placeholder="Шлях до зображення"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={item.url || ''}
                          onChange={(e) => updateCarouselItem(index, 'url', e.target.value)}
                          placeholder="URL (необов'язково)"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'intro' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">🎬 Intro Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title Top</label>
                    <input
                      type="text"
                      value={introSettings.titleTop}
                      onChange={(e) => setIntroSettings({...introSettings, titleTop: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Title Middle</label>
                    <input
                      type="text"
                      value={introSettings.titleMiddle}
                      onChange={(e) => setIntroSettings({...introSettings, titleMiddle: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      value={introSettings.description}
                      onChange={(e) => setIntroSettings({...introSettings, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Button Text</label>
                    <input
                      type="text"
                      value={introSettings.buttonText}
                      onChange={(e) => setIntroSettings({...introSettings, buttonText: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Інші вкладки... */}
            {activeTab === 'admin' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">⚙️ Admin Settings</h3>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ℹ️ Налаштування адміністратора керуються через основну адмін панель V2
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">🎵 Audio Settings</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    ℹ️ Аудіо налаштування тимчасово відключені. Використовуйте Smart Content Manager для завантаження файлів.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">🖼️ Background Settings</h3>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    ℹ️ Налаштування фону доступні через основну адмін панель V2 в розділі "Intro" та "Main".
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 🎯 V2 FOOTER */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Simple Admin V2 • {deviceType}</span>
            </div>
            <button
              onClick={saveChanges}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              💾 Зберегти
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleAdminPanelV2; 