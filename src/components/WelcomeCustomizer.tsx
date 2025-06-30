import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignTab, BackgroundTab, AudioTab, AnimationTab } from './WelcomeCustomizerTabs';
import indexedDBService from '../services/IndexedDBService';

interface WelcomeSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hintText: string;
  brandColor: string;
  accentColor: string;
  textColor: string;
  subtitleColor: string;
  descriptionColor: string;
  buttonTextColor: string;
  logoUrl: string;
  showLogo: boolean;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  autoPlay: boolean;
  animationStyle: 'fade' | 'slide' | 'zoom' | 'bounce';
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

const defaultSettings: WelcomeSettings = {
  title: "SMM OS",
  subtitle: "Welcome",
  description: "Everything you need for your SMM\nin one place",
  buttonText: "Enter",
  hintText: "Tap to enter and start music",
  brandColor: "#4a4b57",
  accentColor: "#3b82f6",
  textColor: "#111111",
  subtitleColor: "#333333",
  descriptionColor: "#666666",
  buttonTextColor: "#ffffff",
  logoUrl: "",
  showLogo: true,
  backgroundType: 'gradient',
  backgroundColor: "#f9fafb",
  gradientFrom: "#f9fafb",
  gradientTo: "#f7f8fa",
  backgroundImage: "",
  backgroundVideo: "",
  hasMusic: false,
  musicUrl: "",
  musicVolume: 0.5,
  autoPlay: true,
  animationStyle: 'fade',
  showParticles: false,
  particleColor: "#ffffff",
  animationSpeed: 'normal'
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'content' | 'design' | 'background' | 'audio' | 'animation' | 'preview';

const WelcomeCustomizer: React.FC = () => {
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('content');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundImageRef = useRef<HTMLInputElement>(null);
  const backgroundVideoRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);

  // Завантаження існуючих налаштувань при ініціалізації
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 WelcomeCustomizer: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
        
        if (indexedDBSettings) {
          console.log('✅ WelcomeCustomizer: Налаштування завантажено з IndexedDB');
          setSettings(prev => ({ ...prev, ...indexedDBSettings }));
        } else {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ WelcomeCustomizer: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          
          const savedSettings = localStorage.getItem('welcomeSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('✅ WelcomeCustomizer: Налаштування завантажено з localStorage');
            
            // Мігруємо в IndexedDB
            console.log('🔄 WelcomeCustomizer: Міграція налаштувань в IndexedDB...');
            await indexedDBService.saveSettings('welcomeSettings', parsed, 'project');
            
            setSettings(prev => ({ ...prev, ...parsed }));
            console.log('✅ WelcomeCustomizer: Міграція завершена');
          }
        }
      } catch (error) {
        console.error('❌ WelcomeCustomizer: Помилка завантаження налаштувань:', error);
        
        // У випадку помилки пробуємо localStorage
        try {
          const savedSettings = localStorage.getItem('welcomeSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            setSettings(prev => ({ ...prev, ...parsed }));
            console.log('✅ WelcomeCustomizer: Резервне завантаження з localStorage успішне');
          }
        } catch (localStorageError) {
          console.error('❌ WelcomeCustomizer: Помилка резервного завантаження:', localStorageError);
        }
      }
    };

    loadSettings();
  }, []);

  // Ефект для керування гучністю музики
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = settings.musicVolume;
    }
  }, [settings.musicVolume]);

  const updateSettings = useCallback((updates: Partial<WelcomeSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      
      // Зберігаємо через IndexedDBService
      indexedDBService.saveSettings('welcomeSettings', newSettings, 'project').catch(error => {
        console.error('❌ WelcomeCustomizer: Помилка збереження в IndexedDB:', error);
        // Резервне збереження в localStorage
        localStorage.setItem('welcomeSettings', JSON.stringify(newSettings));
      });
      
      // Відправляємо подію для синхронізації
      const syncEvent = new CustomEvent('welcomeSettingsUpdated', { detail: newSettings });
      window.dispatchEvent(syncEvent);
      
      return newSettings;
    });
  }, []);

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'backgroundImage' | 'backgroundVideo' | 'music') => {
    // ВИДАЛЕНО: Застаріла логіка FileReader - тепер використовуємо тільки Smart Content Manager
    console.warn('⚠️ handleFileUpload застаріла - використовуйте Smart Content Manager');
  }, []);

  const getDeviceClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'w-[375px] h-[667px]';
      case 'tablet':
        return 'w-[768px] h-[1024px]';
      default:
        return 'w-full h-full';
    }
  };

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'color':
        return { backgroundColor: settings.backgroundColor };
      case 'gradient':
        return { 
          background: `linear-gradient(135deg, ${settings.gradientFrom} 0%, ${settings.gradientTo} 100%)` 
        };
      case 'image':
        return settings.backgroundImage ? {
          backgroundImage: `url(${settings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : { backgroundColor: settings.backgroundColor };
      case 'video':
        return { backgroundColor: settings.backgroundColor };
      default:
        return { 
          background: `linear-gradient(135deg, ${settings.gradientFrom} 0%, ${settings.gradientTo} 100%)` 
        };
    }
  };

  const getAnimationVariants = () => {
    const speed = settings.animationSpeed === 'slow' ? 1.2 : settings.animationSpeed === 'fast' ? 0.4 : 0.8;
    
    switch (settings.animationStyle) {
      case 'slide':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: speed }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: speed }
        };
      case 'bounce':
        return {
          initial: { opacity: 0, y: -30 },
          animate: { opacity: 1, y: 0 },
          transition: { 
            duration: speed,
            type: "spring",
            bounce: 0.4
          }
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: speed }
        };
    }
  };

  const ParticleBackground = () => {
    if (!settings.showParticles) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 4 + 2; // 2-6px
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;
          const duration = Math.random() * 20 + 15; // 15-35s
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{ 
                backgroundColor: settings.particleColor,
                width: `${size}px`,
                height: `${size}px`,
                left: `${initialX}%`,
                top: `${initialY}%`
              }}
              animate={{
                y: [0, -30, 0, 30, 0],
                x: [0, 20, -10, 15, 0],
                opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
                scale: [1, 1.2, 0.8, 1.1, 1]
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          );
        })}
      </div>
    );
  };

  const toggleMusic = () => {
    if (musicRef.current) {
      if (musicRef.current.paused) {
        musicRef.current.play();
      } else {
        musicRef.current.pause();
      }
    }
  };

  const saveSettings = async () => {
    try {
      console.log('💾 WelcomeCustomizer: Збереження налаштувань через IndexedDBService...');
      await indexedDBService.saveSettings('welcomeSettings', settings, 'project');
      console.log('✅ WelcomeCustomizer: Налаштування збережено успішно');
      
      // Dispatch event to update welcome screen
      window.dispatchEvent(new CustomEvent('welcomeSettingsUpdated', { detail: settings }));
      alert('Налаштування збережено!');
    } catch (error) {
      console.error('❌ WelcomeCustomizer: Помилка збереження:', error);
      
      // Резервне збереження в localStorage
      localStorage.setItem('welcomeSettings', JSON.stringify(settings));
      alert('Налаштування збережено (резервно)!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'welcome-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ВИДАЛЕНО: Застаріла логіка FileReader - використовуйте Smart Content Manager для імпорту
      console.warn('⚠️ importSettings застаріла - використовуйте Smart Content Manager');
      alert('Використовуйте Smart Content Manager для імпорту файлів');
    }
  };

  const renderTabContent = () => {
    const tabProps = {
      activeTab,
      settings,
      updateSettings,
      handleFileUpload,
      toggleMusic,
      backgroundImageRef,
      backgroundVideoRef,
      musicInputRef
    };

    switch (activeTab) {
      case 'content':
        return (
          <div className="space-y-6">
            {/* Контент секція */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Текстовий контент</h3>
                  <p className="text-sm text-slate-600">Основний текст welcome екрану</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Заголовок
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => updateSettings({ title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="Введіть заголовок..."
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Підзаголовок
                  </label>
                  <input
                    type="text"
                    value={settings.subtitle}
                    onChange={(e) => updateSettings({ subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="Введіть підзаголовок..."
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Опис
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => updateSettings({ description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none"
                    placeholder="Введіть опис..."
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    Текст кнопки
                  </label>
                  <input
                    type="text"
                    value={settings.buttonText}
                    onChange={(e) => updateSettings({ buttonText: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="Введіть текст кнопки..."
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Підказка
                  </label>
                  <input
                    type="text"
                    value={settings.hintText}
                    onChange={(e) => updateSettings({ hintText: e.target.value })}
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                    placeholder="Введіть текст підказки..."
                  />
                </div>
              </div>
            </div>

            {/* Логотип */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">🖼️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Логотип</h3>
                  <p className="text-sm text-slate-600">Завантажте ваш логотип</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 cursor-pointer hover:bg-amber-100 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.showLogo}
                    onChange={(e) => updateSettings({ showLogo: e.target.checked })}
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Показувати логотип</span>
                </label>

                {settings.showLogo && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      {settings.logoUrl ? 'Змінити логотип' : 'Завантажити логотип'}
                    </button>
                    {settings.logoUrl && (
                      <button
                        onClick={() => updateSettings({ logoUrl: '' })}
                        className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'logo');
                  }}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        );
      case 'design':
        return <DesignTab {...tabProps} />;
      case 'background':
        return <BackgroundTab {...tabProps} />;
      case 'audio':
        return <AudioTab {...tabProps} />;
      case 'animation':
        return <AnimationTab {...tabProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Sidebar with controls */}
      <div className="w-full lg:w-[520px] lg:min-w-[520px] lg:max-w-[520px] bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl">
        {/* Modern Header */}
        <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Конструктор Превю</h2>
              <p className="text-emerald-100 text-sm">Створіть привабливий welcome екран</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/90">
                <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">Готово</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tabs */}
        <div className="flex bg-slate-50/80 border-b border-slate-200/60">
          {[
            { id: 'content', label: 'Контент', icon: '✍️', color: 'blue' },
            { id: 'design', label: 'Стиль', icon: '🎨', color: 'purple' },
            { id: 'background', label: 'Фон', icon: '🌅', color: 'indigo' },
            { id: 'audio', label: 'Звук', icon: '🎵', color: 'green' },
            { id: 'animation', label: 'Анімація', icon: '✨', color: 'pink' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex-1 px-3 py-4 text-sm font-medium transition-all duration-300 relative group ${
                activeTab === tab.id
                  ? `text-${tab.color}-600 bg-white shadow-sm`
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs font-semibold">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-500`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 p-8 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Device toggle */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Попередній перегляд</h3>
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              {[
                { type: 'mobile', icon: '📱', label: 'Mobile' },
                { type: 'tablet', icon: '📊', label: 'Tablet' },
                { type: 'desktop', icon: '💻', label: 'Desktop' }
              ].map((device) => (
                <button
                  key={device.type}
                  onClick={() => setDeviceType(device.type as DeviceType)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    deviceType === device.type
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-1">{device.icon}</span>
                  {device.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview container */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-2xl p-8">
            <div className={`${getDeviceClasses()} bg-white rounded-2xl shadow-2xl overflow-hidden relative`}>
              <div className="w-full h-full relative overflow-hidden" style={getBackgroundStyle()}>
                {settings.backgroundType === 'video' && settings.backgroundVideo && (
                  <video
                    autoPlay
                    muted
                    loop
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={settings.backgroundVideo} type="video/mp4" />
                  </video>
                )}

                {settings.showParticles && <ParticleBackground />}

                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  {/* Logo */}
                  {settings.showLogo && settings.logoUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="mb-8"
                    >
                      <img 
                        src={settings.logoUrl} 
                        alt="Logo" 
                        className="h-16 w-auto max-w-32 object-contain"
                      />
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h1
                    {...getAnimationVariants()}
                    className="text-4xl md:text-5xl font-bold mb-4"
                    style={{ color: settings.textColor }}
                  >
                    {settings.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.h2
                    {...getAnimationVariants()}
                    className="text-xl md:text-2xl font-medium mb-6"
                    style={{ color: settings.subtitleColor }}
                    transition={{ ...getAnimationVariants().transition, delay: 0.2 }}
                  >
                    {settings.subtitle}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    {...getAnimationVariants()}
                    className="text-lg mb-8 max-w-md leading-relaxed whitespace-pre-line"
                    style={{ color: settings.descriptionColor }}
                    transition={{ ...getAnimationVariants().transition, delay: 0.4 }}
                  >
                    {settings.description}
                  </motion.p>

                  {/* Button */}
                  <motion.button
                    {...getAnimationVariants()}
                    className="px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      backgroundColor: settings.accentColor,
                      color: settings.buttonTextColor 
                    }}
                    transition={{ ...getAnimationVariants().transition, delay: 0.6 }}
                  >
                    {settings.buttonText}
                  </motion.button>

                  {/* Hint */}
                  <motion.p
                    {...getAnimationVariants()}
                    className="text-sm mt-6 opacity-70"
                    style={{ color: settings.descriptionColor }}
                    transition={{ ...getAnimationVariants().transition, delay: 0.8 }}
                  >
                    {settings.hintText}
                  </motion.p>
                </div>

                {/* Background music */}
                {settings.hasMusic && settings.musicUrl && (
                  <audio
                    ref={musicRef}
                    src={settings.musicUrl}
                    loop
                    autoPlay={settings.autoPlay}
                    style={{ display: 'none' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCustomizer;