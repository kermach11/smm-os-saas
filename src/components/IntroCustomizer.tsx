import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreenPreview from './IntroScreenPreview';
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import SyncButton from './SyncButton';
import MediaSelector from './MediaSelector';

// Типи для MediaSelector
interface FileItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'audio' | 'video';
  size: number;
  uploadDate: string;
}

interface IntroSettings {
  // Основний контент
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  logoUrl: string;
  
  // Типографіка
  titleFontSize: number;
  subtitleFontSize: number;
  descriptionFontSize: number;
  titleFontFamily: string;
  subtitleFontFamily: string;
  descriptionFontFamily: string;
  titleFontWeight: number;
  subtitleFontWeight: number;
  descriptionFontWeight: number;
  titleFontStyle: string;
  subtitleFontStyle: string;
  descriptionFontStyle: string;
  
  // Анімації
  titleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  subtitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  descriptionAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  titleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  subtitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  descriptionExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  
  // Тіні та ефекти
  title3DDepth: number;
  subtitle3DDepth: number;
  description3DDepth: number;
  titleShadowIntensity: number;
  subtitleShadowIntensity: number;
  descriptionShadowIntensity: number;
  titleShadowColor: string;
  subtitleShadowColor: string;
  descriptionShadowColor: string;
  animationDuration: number;
  animationDelay: number;
  
  // Адаптивні налаштування
  mobile: {
    titleFontSize: number;
    subtitleFontSize: number;
    descriptionFontSize: number;
    titleMarginBottom: number;
    subtitleMarginBottom: number;
    descriptionMarginBottom: number;
    titleLineHeight: number;
    subtitleLineHeight: number;
    descriptionLineHeight: number;
    titleLetterSpacing: number;
    subtitleLetterSpacing: number;
    descriptionLetterSpacing: number;
    containerPadding: number;
    containerMarginTop: number;
    containerMarginBottom: number;
  };
  
  tablet: {
    titleFontSize: number;
    subtitleFontSize: number;
    descriptionFontSize: number;
    titleMarginBottom: number;
    subtitleMarginBottom: number;
    descriptionMarginBottom: number;
    titleLineHeight: number;
    subtitleLineHeight: number;
    descriptionLineHeight: number;
    titleLetterSpacing: number;
    subtitleLetterSpacing: number;
    descriptionLetterSpacing: number;
    containerPadding: number;
    containerMarginTop: number;
    containerMarginBottom: number;
  };
  
  desktop: {
    titleFontSize: number;
    subtitleFontSize: number;
    descriptionFontSize: number;
    titleMarginBottom: number;
    subtitleMarginBottom: number;
    descriptionMarginBottom: number;
    titleLineHeight: number;
    subtitleLineHeight: number;
    descriptionLineHeight: number;
    titleLetterSpacing: number;
    subtitleLetterSpacing: number;
    descriptionLetterSpacing: number;
    containerPadding: number;
    containerMarginTop: number;
    containerMarginBottom: number;
  };
  
  // Дизайн
  device: 'mobile' | 'tablet' | 'desktop';
  brandColor: string;
  accentColor: string;
  textColor: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  
  // Звук
  hasMusic: boolean;
  musicUrl: string;
  audioSettings: {
    backgroundMusic: {
      enabled: boolean;
      url: string;
      volume: number;
      loop: boolean;
      autoPlay: boolean;
    };
    hoverSounds: {
      enabled: boolean;
      url: string;
      volume: number;
    };
    clickSounds: {
      enabled: boolean;
      url: string;
      volume: number;
    };
  };
  
  // Ефекти
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
  autoPlay: boolean;
}

const defaultSettings: IntroSettings = {
  // Основний контент
  title: "Усе що треба",
  subtitle: "для твого SMM",
  description: "Професійні інструменти в одному місці",
  buttonText: "Почати роботу",
  buttonUrl: "#start",
  logoUrl: "",
  
  // Типографіка
  titleFontSize: 48,
  subtitleFontSize: 36,
  descriptionFontSize: 20,
  titleFontFamily: 'Inter',
  subtitleFontFamily: 'Inter',
  descriptionFontFamily: 'Inter',
  titleFontWeight: 700,
  subtitleFontWeight: 600,
  descriptionFontWeight: 400,
  titleFontStyle: 'normal',
  subtitleFontStyle: 'normal',
  descriptionFontStyle: 'normal',
  
  // Анімації
  titleAnimation: 'fadeIn',
  subtitleAnimation: 'slideUp',
  descriptionAnimation: 'fadeIn',
  titleExitAnimation: 'fadeOut',
  subtitleExitAnimation: 'slideDown',
  descriptionExitAnimation: 'fadeOut',
  
  // Тіні та ефекти
  title3DDepth: 0,
  subtitle3DDepth: 0,
  description3DDepth: 0,
  titleShadowIntensity: 0.3,
  subtitleShadowIntensity: 0.2,
  descriptionShadowIntensity: 0.1,
  titleShadowColor: '#000000',
  subtitleShadowColor: '#000000',
  descriptionShadowColor: '#000000',
  animationDuration: 800,
  animationDelay: 200,
  
  // Адаптивні налаштування
  mobile: {
    titleFontSize: 36,
    subtitleFontSize: 24,
    descriptionFontSize: 16,
    titleMarginBottom: 16,
    subtitleMarginBottom: 12,
    descriptionMarginBottom: 8,
    titleLineHeight: 1.5,
    subtitleLineHeight: 1.5,
    descriptionLineHeight: 1.5,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 24,
    containerMarginTop: 24,
    containerMarginBottom: 24
  },
  
  tablet: {
    titleFontSize: 48,
    subtitleFontSize: 36,
    descriptionFontSize: 20,
    titleMarginBottom: 16,
    subtitleMarginBottom: 12,
    descriptionMarginBottom: 8,
    titleLineHeight: 1.5,
    subtitleLineHeight: 1.5,
    descriptionLineHeight: 1.5,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 24,
    containerMarginTop: 24,
    containerMarginBottom: 24
  },
  
  desktop: {
    titleFontSize: 60,
    subtitleFontSize: 48,
    descriptionFontSize: 24,
    titleMarginBottom: 16,
    subtitleMarginBottom: 12,
    descriptionMarginBottom: 8,
    titleLineHeight: 1.5,
    subtitleLineHeight: 1.5,
    descriptionLineHeight: 1.5,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 24,
    containerMarginTop: 24,
    containerMarginBottom: 24
  },
  
  // Дизайн
  device: 'desktop',
  brandColor: "#4a4b57",
  accentColor: "#3b82f6",
  textColor: "#ffffff",
  backgroundType: 'gradient',
  backgroundColor: "#1a1a1a",
  gradientFrom: "#f9fafb",
  gradientTo: "#f7f8fa",
  backgroundImage: "",
  backgroundVideo: "",
  
  // Звук
  hasMusic: false,
  musicUrl: "",
  audioSettings: {
    backgroundMusic: {
      enabled: false,
      url: "",
      volume: 0.5,
      loop: true,
      autoPlay: false
    },
    hoverSounds: {
      enabled: false,
      url: "",
      volume: 0.5
    },
    clickSounds: {
      enabled: false,
      url: "",
      volume: 0.5
    }
  },
  
  // Ефекти
  showParticles: false,
  particleColor: "#ffffff",
  animationSpeed: 'normal',
  autoPlay: true
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'header' | 'design' | 'background' | 'audio';

const IntroCustomizer: React.FC = () => {
  const [settings, setSettings] = useState<IntroSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('header');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [activeTypographyElement, setActiveTypographyElement] = useState<'title' | 'subtitle' | 'description'>('title');
  
  // Refs removed - using MediaSelector instead

  // Smart Content Manager стан
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSelectorType, setMediaSelectorType] = useState<'backgroundImage' | 'backgroundVideo' | 'logo' | 'backgroundMusic' | 'hoverSound' | 'clickSound'>('backgroundImage');

  // Завантаження існуючих налаштувань при ініціалізації
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 IntroCustomizer: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        let savedSettings = await indexedDBService.loadSettings('introSettings');
        
        if (!savedSettings) {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ IntroCustomizer: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          const localSettings = localStorage.getItem('introSettings');
          if (localSettings) {
            savedSettings = JSON.parse(localSettings);
            console.log('✅ IntroCustomizer: Налаштування завантажено з localStorage');
            
            // Мігруємо в IndexedDB
            await indexedDBService.saveSettings('introSettings', savedSettings, 'project');
            console.log('✅ IntroCustomizer: Міграція завершена');
          }
        } else {
          console.log('✅ IntroCustomizer: Налаштування завантажено з IndexedDB');
        }
        
        if (savedSettings) {
          // Перевіряємо що дані мають правильний формат для IntroSettings
          const typedSettings = savedSettings as IntroSettings;
          setSettings(typedSettings);
        }
      } catch (error) {
        console.error('❌ IntroCustomizer: Помилка завантаження налаштувань:', error);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<IntroSettings>) => {
    setSyncStatus('syncing');
    
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    try {
      console.log('🔄 IntroCustomizer: Збереження налаштувань...', Object.keys(updates));
      
      // Зберігаємо повні налаштування в IndexedDB
      await indexedDBService.saveSettings('introSettings', newSettings, 'project');
      console.log('✅ IntroCustomizer: Налаштування збережено в IndexedDB');
      
      // Відправляємо подію для оновлення компонентів
      const syncEvent = new CustomEvent('introSettingsUpdated', { detail: newSettings });
      window.dispatchEvent(syncEvent);
      
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 800);
      
    } catch (error) {
      console.error('❌ IntroCustomizer: Помилка збереження:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  }, [settings]);

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'backgroundImage' | 'backgroundVideo' | 'music' | 'backgroundMusic' | 'hoverSound' | 'clickSound') => {
    // Конвертуємо файл в Base64
    const base64Url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    
    switch (type) {
      case 'logo':
        updateSettings({ logoUrl: base64Url });
        break;
      case 'backgroundImage':
        updateSettings({ backgroundImage: base64Url, backgroundType: 'image' });
        break;
      case 'backgroundVideo':
        updateSettings({ backgroundVideo: base64Url, backgroundType: 'video' });
        break;
      case 'music':
        updateSettings({ musicUrl: base64Url, hasMusic: true });
        break;
      case 'backgroundMusic':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            backgroundMusic: { 
              ...settings.audioSettings.backgroundMusic, 
              url: base64Url, 
              enabled: true 
            } 
          } 
        });
        break;
      case 'hoverSound':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            hoverSounds: { 
              ...settings.audioSettings.hoverSounds, 
              url: base64Url, 
              enabled: true 
            } 
          } 
        });
        break;
      case 'clickSound':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            clickSounds: { 
              ...settings.audioSettings.clickSounds, 
              url: base64Url, 
              enabled: true 
            } 
          } 
        });
        break;
    }
  }, [updateSettings, settings.audioSettings]);

  // Функції для роботи з MediaSelector (Smart Content Manager)
  const openMediaSelector = (type: typeof mediaSelectorType, allowedTypes?: ('image' | 'audio' | 'video')[]) => {
    setMediaSelectorType(type);
    setIsMediaSelectorOpen(true);
  };

  const handleMediaSelect = (file: FileItem) => {
    console.log('🔄 IntroCustomizer: Вибрано файл з Smart Content Manager:', file.name, file.type);
    
    switch (mediaSelectorType) {
      case 'logo':
        updateSettings({ logoUrl: file.url });
        break;
      case 'backgroundImage':
        updateSettings({ backgroundImage: file.url, backgroundType: 'image' });
        break;
      case 'backgroundVideo':
        updateSettings({ backgroundVideo: file.url, backgroundType: 'video' });
        break;
      case 'backgroundMusic':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            backgroundMusic: { 
              ...settings.audioSettings.backgroundMusic, 
              url: file.url, 
              enabled: true 
            } 
          } 
        });
        break;
      case 'hoverSound':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            hoverSounds: { 
              ...settings.audioSettings.hoverSounds, 
              url: file.url, 
              enabled: true 
            } 
          } 
        });
        break;
      case 'clickSound':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            clickSounds: { 
              ...settings.audioSettings.clickSounds, 
              url: file.url, 
              enabled: true 
            } 
          } 
        });
        break;
    }
    
    setIsMediaSelectorOpen(false);
    console.log('✅ IntroCustomizer: Файл застосовано через Smart Content Manager');
  };

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
        return { backgroundColor: settings.backgroundColor };
    }
  };

  const saveSettings = () => {
    localStorage.setItem('introSettings', JSON.stringify(settings));
    
    // Також зберігаємо в старому форматі для сумісності
    const legacyData = {
      introSettings: {
        titleTop: settings.title,
        titleMiddle: settings.subtitle,
        description: settings.description,
        buttonText: settings.buttonText
      }
    };
    localStorage.setItem('immersiveExperienceData', JSON.stringify(legacyData));
    
    // Dispatch event to update main screen
    window.dispatchEvent(new CustomEvent('introSettingsUpdated', { detail: settings }));
    alert('Налаштування збережено!');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'intro-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
        } catch (error) {
          alert('Помилка імпорту файлу');
        }
      };
      reader.readAsText(file);
    }
  };

  const getTypographyValue = (property: 'fontFamily' | 'fontWeight' | 'fontStyle') => {
    switch (activeTypographyElement) {
      case 'title':
        return property === 'fontFamily' ? settings.titleFontFamily :
               property === 'fontWeight' ? settings.titleFontWeight :
               settings.titleFontStyle;
      case 'subtitle':
        return property === 'fontFamily' ? settings.subtitleFontFamily :
               property === 'fontWeight' ? settings.subtitleFontWeight :
               settings.subtitleFontStyle;
      case 'description':
        return property === 'fontFamily' ? settings.descriptionFontFamily :
               property === 'fontWeight' ? settings.descriptionFontWeight :
               settings.descriptionFontStyle;
    }
  };

  const updateTypographyValue = (property: 'fontFamily' | 'fontWeight' | 'fontStyle', value: string | number) => {
    switch (activeTypographyElement) {
      case 'title':
        if (property === 'fontFamily') updateSettings({ titleFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ titleFontWeight: value as number });
        else updateSettings({ titleFontStyle: value as string });
        break;
      case 'subtitle':
        if (property === 'fontFamily') updateSettings({ subtitleFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ subtitleFontWeight: value as number });
        else updateSettings({ subtitleFontStyle: value as string });
        break;
      case 'description':
        if (property === 'fontFamily') updateSettings({ descriptionFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ descriptionFontWeight: value as number });
        else updateSettings({ descriptionFontStyle: value as string });
        break;
    }
  };

  return (
    <>
      <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Modern Sidebar with controls */}
        <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl">
          {/* Modern Header */}
          <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Конструктор Інтро</h2>
                <p className="text-blue-100 text-sm">Створіть захоплюючу вступну сторінку</p>
              </div>
              <div className="flex items-center gap-3">
                {syncStatus === 'syncing' && (
                  <div className="flex items-center gap-2 text-white/90">
                    <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Синхронізація...</span>
                  </div>
                )}
                {syncStatus === 'synced' && (
                  <div className="flex items-center gap-2 text-green-100">
                    <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm">Збережено</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modern Tabs */}
          <div className="flex bg-slate-50/80 border-b border-slate-200/60">
            {[
              { id: 'header', label: 'Контент', icon: '✍️', color: 'blue' },
              { id: 'design', label: 'Стиль', icon: '🎨', color: 'purple' },
              { id: 'background', label: 'Фон', icon: '🌅', color: 'indigo' },
              { id: 'audio', label: 'Звук', icon: '🎵', color: 'green' }
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
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${tab.color}-400 to-${tab.color}-600`}></div>
                )}
              </button>
            ))}
          </div>

          {/* Modern Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'header' && (
              <div className="space-y-6">
                {/* 1. Логотип - ПЕРШИЙ БЛОК */}
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
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => openMediaSelector('logo', ['image'])}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      📚 Вибрати з медіа-бібліотеки
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
                  {settings.logoUrl && (
                    <div className="mt-4 p-3 bg-white/60 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-3">
                        <img src={settings.logoUrl} alt="Логотип" className="w-12 h-12 object-contain rounded-lg border border-amber-200" />
                        <div>
                          <p className="text-sm font-medium text-slate-700">Логотип завантажено</p>
                          <p className="text-xs text-slate-500">Відображається у верхній частині сторінки</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Текстовий контент - ДРУГИЙ БЛОК */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">📝</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Текстовий контент</h3>
                      <p className="text-sm text-slate-600">Основний текст інтро сторінки</p>
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
                        Посилання кнопки
                      </label>
                      <input
                        type="text"
                        value={settings.buttonUrl}
                        onChange={(e) => updateSettings({ buttonUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                        placeholder="Введіть URL..."
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Типографіка - ТРЕТІЙ БЛОК */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🔤</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Типографіка</h3>
                      <p className="text-sm text-slate-600">Стиль та вигляд шрифтів</p>
                    </div>
                  </div>

                  {/* Переключення між елементами */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Оберіть елемент для редагування:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'title', label: 'Заголовок', icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: 'Підзаголовок', icon: '📝', color: 'purple' },
                        { type: 'description', label: 'Опис', icon: '📄', color: 'green' }
                      ].map((element) => (
                        <button
                          key={element.type}
                          onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            activeTypographyElement === element.type
                              ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{element.icon}</div>
                          <div className="text-xs font-semibold">{element.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Спільні налаштування для обраного елемента */}
                  <div className="bg-white/60 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-4 h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="font-semibold text-slate-800">
                        Налаштування для: {
                          activeTypographyElement === 'title' ? 'Заголовка' :
                          activeTypographyElement === 'subtitle' ? 'Підзаголовка' : 'Опису'
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Сімейство шрифтів */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-3">Сімейство шрифтів</label>
                        <select
                          value={getTypographyValue('fontFamily') as string}
                          onChange={(e) => updateTypographyValue('fontFamily', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm transition-all duration-200"
                        >
                          <option value="Inter">Inter</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Playfair Display">Playfair Display</option>
                          <option value="Oswald">Oswald</option>
                        </select>
                      </div>

                      {/* Товщина шрифту */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-4">Товщина шрифту</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: 400, label: 'Звичайний', weight: 'font-normal' },
                            { value: 600, label: 'Напівжирний', weight: 'font-semibold' },
                            { value: 700, label: 'Жирний', weight: 'font-bold' }
                          ].map((weight) => (
                            <button
                              key={weight.value}
                              onClick={() => updateTypographyValue('fontWeight', weight.value)}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                                getTypographyValue('fontWeight') === weight.value
                                  ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className={`${weight.weight} text-lg mb-1`}>Aa</div>
                              <div className="text-xs font-semibold leading-tight break-words">{weight.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Стиль тексту */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-4">Стиль тексту</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'normal', label: 'Звичайний', style: 'font-normal' },
                            { value: 'italic', label: 'Курсив', style: 'italic' }
                          ].map((style) => (
                            <button
                              key={style.value}
                              onClick={() => updateTypographyValue('fontStyle', style.value)}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                                getTypographyValue('fontStyle') === style.value
                                  ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className={`${style.style} text-base mb-1 truncate`}>
                                {activeTypographyElement === 'title' ? 'Заголовок' :
                                 activeTypographyElement === 'subtitle' ? 'Підзаголовок' : 'Опис'}
                              </div>
                              <div className="text-xs font-semibold leading-tight">{style.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Адаптивність - ЧЕТВЕРТИЙ БЛОК */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">📱</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Адаптивність</h3>
                      <p className="text-sm text-slate-600">Налаштування для різних пристроїв</p>
                    </div>
                  </div>
                  
                  {/* Вибір пристрою */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Оберіть пристрій:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'mobile', label: 'Мобільний', icon: '📱', color: 'emerald' },
                        { type: 'tablet', label: 'Планшет', icon: '📟', color: 'teal' },
                        { type: 'desktop', label: 'Десктоп', icon: '🖥️', color: 'cyan' }
                      ].map((device) => (
                        <button
                          key={device.type}
                          onClick={() => setDeviceType(device.type as DeviceType)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            deviceType === device.type
                              ? `border-${device.color}-500 bg-${device.color}-100 text-${device.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{device.icon}</div>
                          <div className="text-xs font-semibold">{device.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування для обраного пристрою */}
                  <div className="space-y-5">
                    {/* Заголовок */}
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        Заголовок
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Розмір: {settings[deviceType].titleFontSize}px
                          </label>
                          <input
                            type="range"
                            min="16"
                            max="120"
                            value={settings[deviceType].titleFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                titleFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Відступ: {settings[deviceType].titleMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={settings[deviceType].titleMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                titleMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Підзаголовок */}
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                        Підзаголовок
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Розмір: {settings[deviceType].subtitleFontSize}px
                          </label>
                          <input
                            type="range"
                            min="14"
                            max="100"
                            value={settings[deviceType].subtitleFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                subtitleFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Відступ: {settings[deviceType].subtitleMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={settings[deviceType].subtitleMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                subtitleMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Опис */}
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Опис
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Розмір: {settings[deviceType].descriptionFontSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="72"
                            value={settings[deviceType].descriptionFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                descriptionFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Відступ: {settings[deviceType].descriptionMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            value={settings[deviceType].descriptionMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...settings[deviceType],
                                descriptionMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Тіні та ефекти - П'ЯТИЙ БЛОК */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🌟</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Тіні та ефекти</h3>
                      <p className="text-sm text-slate-600">3D глибина та тіні для тексту</p>
                    </div>
                  </div>

                  {/* Переключення між елементами */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Оберіть елемент для налаштування:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'title', label: 'Заголовок', icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: 'Підзаголовок', icon: '📝', color: 'purple' },
                        { type: 'description', label: 'Опис', icon: '📄', color: 'green' }
                      ].map((element) => (
                        <button
                          key={element.type}
                          onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            activeTypographyElement === element.type
                              ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{element.icon}</div>
                          <div className="text-xs font-semibold">{element.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Спільні налаштування для обраного елемента */}
                  <div className="bg-white/60 rounded-xl p-5 border border-indigo-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-4 h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="font-semibold text-slate-800">
                        Ефекти для: {
                          activeTypographyElement === 'title' ? 'Заголовка' :
                          activeTypographyElement === 'subtitle' ? 'Підзаголовка' : 'Опису'
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-5">
                      {/* 3D Глибина */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-3">
                          3D Глибина: {
                            activeTypographyElement === 'title' ? settings.title3DDepth :
                            activeTypographyElement === 'subtitle' ? settings.subtitle3DDepth :
                            settings.description3DDepth
                          }px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={
                            activeTypographyElement === 'title' ? settings.title3DDepth :
                            activeTypographyElement === 'subtitle' ? settings.subtitle3DDepth :
                            settings.description3DDepth
                          }
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (activeTypographyElement === 'title') {
                              updateSettings({ title3DDepth: value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ subtitle3DDepth: value });
                            } else {
                              updateSettings({ description3DDepth: value });
                            }
                          }}
                          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer modern-slider"
                        />
                      </div>

                      {/* Інтенсивність тіні */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-3">
                          Інтенсивність тіні: {
                            Math.round((
                              activeTypographyElement === 'title' ? settings.titleShadowIntensity :
                              activeTypographyElement === 'subtitle' ? settings.subtitleShadowIntensity :
                              settings.descriptionShadowIntensity
                            ) * 100)
                          }%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={
                            activeTypographyElement === 'title' ? settings.titleShadowIntensity :
                            activeTypographyElement === 'subtitle' ? settings.subtitleShadowIntensity :
                            settings.descriptionShadowIntensity
                          }
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (activeTypographyElement === 'title') {
                              updateSettings({ titleShadowIntensity: value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ subtitleShadowIntensity: value });
                            } else {
                              updateSettings({ descriptionShadowIntensity: value });
                            }
                          }}
                          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer modern-slider"
                        />
                      </div>

                      {/* Колір тіні */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-3">Колір тіні</label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={
                              activeTypographyElement === 'title' ? settings.titleShadowColor :
                              activeTypographyElement === 'subtitle' ? settings.subtitleShadowColor :
                              settings.descriptionShadowColor
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (activeTypographyElement === 'title') {
                                updateSettings({ titleShadowColor: value });
                              } else if (activeTypographyElement === 'subtitle') {
                                updateSettings({ subtitleShadowColor: value });
                              } else {
                                updateSettings({ descriptionShadowColor: value });
                              }
                            }}
                            className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                          />
                          <input
                            type="text"
                            value={
                              activeTypographyElement === 'title' ? settings.titleShadowColor :
                              activeTypographyElement === 'subtitle' ? settings.subtitleShadowColor :
                              settings.descriptionShadowColor
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (activeTypographyElement === 'title') {
                                updateSettings({ titleShadowColor: value });
                              } else if (activeTypographyElement === 'subtitle') {
                                updateSettings({ subtitleShadowColor: value });
                              } else {
                                updateSettings({ descriptionShadowColor: value });
                              }
                            }}
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                            placeholder="Колір тіні"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Анімації тексту - ШОСТИЙ БЛОК */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Анімації тексту</h3>
                      <p className="text-sm text-slate-600">Динамічні ефекти появи та зникнення</p>
                    </div>
                  </div>

                  {/* Переключення між елементами */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Оберіть елемент для анімації:</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { type: 'title', label: 'Заголовок', icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: 'Підзаголовок', icon: '📝', color: 'purple' },
                        { type: 'description', label: 'Опис', icon: '📄', color: 'green' }
                      ].map((element) => (
                        <button
                          key={element.type}
                          onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            activeTypographyElement === element.type
                              ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{element.icon}</div>
                          <div className="text-xs font-semibold">{element.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Спільні налаштування для обраного елемента */}
                  <div className="bg-white/60 rounded-xl p-5 border border-rose-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-4 h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="font-semibold text-slate-800">
                        Анімації для: {
                          activeTypographyElement === 'title' ? 'Заголовка' :
                          activeTypographyElement === 'subtitle' ? 'Підзаголовка' : 'Опису'
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-5">
                      {/* Анімація входу */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-4">Анімація входу</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'none', label: 'Без анімації', icon: '⚪' },
                            { value: 'fadeIn', label: 'Поява', icon: '🌅' },
                            { value: 'slideUp', label: 'Знизу вгору', icon: '⬆️' },
                            { value: 'slideDown', label: 'Згори вниз', icon: '⬇️' },
                            { value: 'slideLeft', label: 'Справа вліво', icon: '⬅️' },
                            { value: 'slideRight', label: 'Зліва вправо', icon: '➡️' },
                            { value: 'zoomIn', label: 'Збільшення', icon: '🔍' },
                            { value: 'zoomOut', label: 'Зменшення', icon: '🔎' },
                            { value: 'rotateIn', label: 'Обертання', icon: '🔄' },
                            { value: 'bounce', label: 'Підстрибування', icon: '⚡' },
                            { value: 'typewriter', label: 'Друкарська машинка', icon: '⌨️' },
                            { value: 'glow', label: 'Світіння', icon: '✨' }
                          ].map((animation) => (
                            <button
                              key={animation.value}
                              onClick={() => {
                                if (activeTypographyElement === 'title') {
                                  updateSettings({ titleAnimation: animation.value as any });
                                } else if (activeTypographyElement === 'subtitle') {
                                  updateSettings({ subtitleAnimation: animation.value as any });
                                } else {
                                  updateSettings({ descriptionAnimation: animation.value as any });
                                }
                              }}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                                (activeTypographyElement === 'title' ? settings.titleAnimation :
                                 activeTypographyElement === 'subtitle' ? settings.subtitleAnimation :
                                 settings.descriptionAnimation) === animation.value
                                  ? 'border-rose-500 bg-rose-100 text-rose-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className="text-lg mb-1">{animation.icon}</div>
                              <div className="text-xs font-semibold leading-tight break-words">{animation.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Анімація виходу */}
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-4">Анімація виходу</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { value: 'none', label: 'Без анімації', icon: '⚪' },
                            { value: 'fadeOut', label: 'Зникнення', icon: '🌇' },
                            { value: 'slideUp', label: 'Вгору', icon: '⬆️' },
                            { value: 'slideDown', label: 'Вниз', icon: '⬇️' },
                            { value: 'slideLeft', label: 'Вліво', icon: '⬅️' },
                            { value: 'slideRight', label: 'Вправо', icon: '➡️' },
                            { value: 'zoomOut', label: 'Зменшення', icon: '🔎' },
                            { value: 'zoomIn', label: 'Збільшення', icon: '🔍' },
                            { value: 'rotateOut', label: 'Обертання', icon: '🔄' },
                            { value: 'dissolve', label: 'Розчинення', icon: '💫' }
                          ].map((animation) => (
                            <button
                              key={animation.value}
                              onClick={() => {
                                if (activeTypographyElement === 'title') {
                                  updateSettings({ titleExitAnimation: animation.value as any });
                                } else if (activeTypographyElement === 'subtitle') {
                                  updateSettings({ subtitleExitAnimation: animation.value as any });
                                } else {
                                  updateSettings({ descriptionExitAnimation: animation.value as any });
                                }
                              }}
                              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                                (activeTypographyElement === 'title' ? settings.titleExitAnimation :
                                 activeTypographyElement === 'subtitle' ? settings.subtitleExitAnimation :
                                 settings.descriptionExitAnimation) === animation.value
                                  ? 'border-rose-500 bg-rose-100 text-rose-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className="text-lg mb-1">{animation.icon}</div>
                              <div className="text-xs font-semibold leading-tight break-words">{animation.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Налаштування часу */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-3">
                            Тривалість: {settings.animationDuration}мс
                          </label>
                          <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={settings.animationDuration}
                            onChange={(e) => updateSettings({ animationDuration: parseInt(e.target.value) })}
                            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-3">
                            Затримка: {settings.animationDelay}мс
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="50"
                            value={settings.animationDelay}
                            onChange={(e) => updateSettings({ animationDelay: parseInt(e.target.value) })}
                            className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* Кольорова схема */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🎨</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Кольорова схема</h3>
                      <p className="text-sm text-slate-600">Налаштуйте кольори вашого сайту</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                        Основний колір бренду
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settings.brandColor}
                          onChange={(e) => updateSettings({ brandColor: e.target.value })}
                          className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                        />
                        <input
                          type="text"
                          value={settings.brandColor}
                          onChange={(e) => updateSettings({ brandColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Акцентний колір
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => updateSettings({ accentColor: e.target.value })}
                          className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => updateSettings({ accentColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                        Колір тексту
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => updateSettings({ textColor: e.target.value })}
                          className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                        />
                        <input
                          type="text"
                          value={settings.textColor}
                          onChange={(e) => updateSettings({ textColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ефекти */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">✨</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Візуальні ефекти</h3>
                      <p className="text-sm text-slate-600">Додайте магії вашому сайту</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-cyan-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✨</span>
                        <div>
                          <h4 className="font-semibold text-slate-800">Частинки</h4>
                          <p className="text-sm text-slate-600">Анімовані частинки на фоні</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.showParticles}
                          onChange={(e) => updateSettings({ showParticles: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    {settings.showParticles && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          Колір частинок
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={settings.particleColor}
                            onChange={(e) => updateSettings({ particleColor: e.target.value })}
                            className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                          />
                          <input
                            type="text"
                            value={settings.particleColor}
                            onChange={(e) => updateSettings({ particleColor: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800"
                            placeholder="Колір частинок"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-6">
                {/* Тип фону */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🌅</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Фон сторінки</h3>
                      <p className="text-sm text-slate-600">Оберіть тип фону для вашої сторінки</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Тип фону:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'color', label: 'Колір', icon: '🎨', color: 'red' },
                        { value: 'gradient', label: 'Градієнт', icon: '🌈', color: 'orange' },
                        { value: 'image', label: 'Зображення', icon: '🖼️', color: 'green' },
                        { value: 'video', label: 'Відео', icon: '🎬', color: 'blue' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateSettings({ backgroundType: type.value as IntroSettings['backgroundType'] })}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            settings.backgroundType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-100 text-${type.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="text-sm font-semibold">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування фону */}
                  {settings.backgroundType === 'color' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        Колір фону
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                          className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                        />
                        <input
                          type="text"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                          className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'gradient' && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Початковий колір
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={settings.gradientFrom}
                            onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                            className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                          />
                          <input
                            type="text"
                            value={settings.gradientFrom}
                            onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Кінцевий колір
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            value={settings.gradientTo}
                            onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                            className="w-16 h-12 border-2 border-slate-200 rounded-xl cursor-pointer shadow-sm"
                          />
                          <input
                            type="text"
                            value={settings.gradientTo}
                            onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'image' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Фонове зображення
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundImage', ['image'])}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          📚 Вибрати з медіа-бібліотеки
                        </button>
                        {settings.backgroundImage && (
                          <button
                            onClick={() => updateSettings({ backgroundImage: '' })}
                            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      {/* Показуємо інформацію про обране зображення */}
                      {settings.backgroundImage && (
                        <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg border border-green-300 overflow-hidden">
                              <img src={settings.backgroundImage} alt="Фонове зображення" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-700">Фонове зображення завантажене</p>
                              <p className="text-xs text-green-600">Використовується як фон сторінки</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {settings.backgroundType === 'video' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Фонове відео
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundVideo', ['video'])}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          📚 Вибрати з медіа-бібліотеки
                        </button>
                        {settings.backgroundVideo && (
                          <button
                            onClick={() => updateSettings({ backgroundVideo: '' })}
                            className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      {/* Показуємо інформацію про обране відео */}
                      {settings.backgroundVideo && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg border border-blue-300 flex items-center justify-center">
                              <span className="text-blue-600 text-lg">🎬</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-blue-700">Фонове відео завантажене</p>
                              <p className="text-xs text-blue-600">Відео буде відтворюватися на фоні</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-6">
                {/* Фонова музика */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🎵</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Фонова музика</h3>
                      <p className="text-sm text-slate-600">Додайте атмосферу звуком</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-green-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎵</span>
                        <div>
                          <h4 className="font-semibold text-slate-800">Фонова музика</h4>
                          <p className="text-sm text-slate-600">Автоматичне відтворення музики</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.audioSettings.backgroundMusic.enabled}
                          onChange={(e) => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              backgroundMusic: { 
                                ...settings.audioSettings.backgroundMusic, 
                                enabled: e.target.checked 
                              } 
                            } 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    {settings.audioSettings.backgroundMusic.enabled && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Аудіо файл
                          </label>
                          <div className="flex gap-3">
                            <button
                              onClick={() => openMediaSelector('backgroundMusic', ['audio'])}
                              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                              📚 Вибрати з медіа-бібліотеки
                            </button>
                            {settings.audioSettings.backgroundMusic.url && (
                              <button
                                onClick={() => updateSettings({ 
                                  audioSettings: { 
                                    ...settings.audioSettings, 
                                    backgroundMusic: { 
                                      ...settings.audioSettings.backgroundMusic, 
                                      url: '', 
                                      enabled: false 
                                    } 
                                  } 
                                })}
                                className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл */}
                          {settings.audioSettings.backgroundMusic.url && (
                            <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-lg border border-green-300 flex items-center justify-center">
                                  <span className="text-green-600 text-lg">🎵</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-green-700">Фонова музика завантажена</p>
                                  <p className="text-xs text-green-600">Музика буде відтворюватися на фоні</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-3">
                            Гучність: {Math.round(settings.audioSettings.backgroundMusic.volume * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.audioSettings.backgroundMusic.volume}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                backgroundMusic: { 
                                  ...settings.audioSettings.backgroundMusic, 
                                  volume: parseFloat(e.target.value) 
                                } 
                              } 
                            })}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-green-100">
                            <div>
                              <h5 className="font-medium text-slate-800">Зациклити</h5>
                              <p className="text-xs text-slate-600">Повторювати музику</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.audioSettings.backgroundMusic.loop}
                                onChange={(e) => updateSettings({ 
                                  audioSettings: { 
                                    ...settings.audioSettings, 
                                    backgroundMusic: { 
                                      ...settings.audioSettings.backgroundMusic, 
                                      loop: e.target.checked 
                                    } 
                                  } 
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-green-100">
                            <div>
                              <h5 className="font-medium text-slate-800">Автозапуск</h5>
                              <p className="text-xs text-slate-600">Грати автоматично</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.audioSettings.backgroundMusic.autoPlay}
                                onChange={(e) => updateSettings({ 
                                  audioSettings: { 
                                    ...settings.audioSettings, 
                                    backgroundMusic: { 
                                      ...settings.audioSettings.backgroundMusic, 
                                      autoPlay: e.target.checked 
                                    } 
                                  } 
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Звукові ефекти */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🔊</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Звукові ефекти</h3>
                      <p className="text-sm text-slate-600">Інтерактивні звуки для кнопок</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Звуки наведення */}
                    <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🖱️</span>
                          <div>
                            <h4 className="font-semibold text-slate-800">Звуки наведення</h4>
                            <p className="text-sm text-slate-600">При наведенні на кнопки</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.audioSettings.hoverSounds.enabled}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                hoverSounds: { 
                                  ...settings.audioSettings.hoverSounds, 
                                  enabled: e.target.checked 
                                } 
                              } 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {settings.audioSettings.hoverSounds.enabled && (
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openMediaSelector('hoverSound', ['audio'])}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
                            >
                              📚 Вибрати з медіа-бібліотеки
                            </button>
                            {settings.audioSettings.hoverSounds.url && (
                              <button
                                onClick={() => updateSettings({ 
                                  audioSettings: { 
                                    ...settings.audioSettings, 
                                    hoverSounds: { 
                                      ...settings.audioSettings.hoverSounds, 
                                      url: '', 
                                      enabled: false 
                                    } 
                                  } 
                                })}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 text-sm"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл */}
                          {settings.audioSettings.hoverSounds.url && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg border border-blue-300 flex items-center justify-center">
                                  <span className="text-blue-600 text-lg">🖱️</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-700">Звук наведення встановлений</p>
                                  <p className="text-xs text-blue-600">Звук буде відтворюватися при наведенні</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">
                              Гучність: {Math.round(settings.audioSettings.hoverSounds.volume * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={settings.audioSettings.hoverSounds.volume}
                              onChange={(e) => updateSettings({ 
                                audioSettings: { 
                                  ...settings.audioSettings, 
                                  hoverSounds: { 
                                    ...settings.audioSettings.hoverSounds, 
                                    volume: parseFloat(e.target.value) 
                                  } 
                                } 
                              })}
                              className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Звуки кліків */}
                    <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">👆</span>
                          <div>
                            <h4 className="font-semibold text-slate-800">Звуки кліків</h4>
                            <p className="text-sm text-slate-600">При натисканні кнопок</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.audioSettings.clickSounds.enabled}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                clickSounds: { 
                                  ...settings.audioSettings.clickSounds, 
                                  enabled: e.target.checked 
                                } 
                              } 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {settings.audioSettings.clickSounds.enabled && (
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openMediaSelector('clickSound', ['audio'])}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-sm font-medium"
                            >
                              📚 Вибрати з медіа-бібліотеки
                            </button>
                            {settings.audioSettings.clickSounds.url && (
                              <button
                                onClick={() => updateSettings({ 
                                  audioSettings: { 
                                    ...settings.audioSettings, 
                                    clickSounds: { 
                                      ...settings.audioSettings.clickSounds, 
                                      url: '', 
                                      enabled: false 
                                    } 
                                  } 
                                })}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 text-sm"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл */}
                          {settings.audioSettings.clickSounds.url && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg border border-blue-300 flex items-center justify-center">
                                  <span className="text-blue-600 text-lg">👆</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-blue-700">Звук кліку встановлений</p>
                                  <p className="text-xs text-blue-600">Звук буде відтворюватися при кліку</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-2">
                              Гучність: {Math.round(settings.audioSettings.clickSounds.volume * 100)}%
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={settings.audioSettings.clickSounds.volume}
                              onChange={(e) => updateSettings({ 
                                audioSettings: { 
                                  ...settings.audioSettings, 
                                  clickSounds: { 
                                    ...settings.audioSettings.clickSounds, 
                                    volume: parseFloat(e.target.value) 
                                  } 
                                } 
                              })}
                              className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modern Actions */}
          <div className="p-6 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={saveSettings}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  <span>Зберегти</span>
                </button>
              </div>


              
              {/* Індикатор синхронізації */}
              <SyncButton className="w-full" />
              
              <div className="flex gap-3">
                <button
                  onClick={exportSettings}
                  className="flex-1 bg-white/80 text-slate-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 text-sm font-medium border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  <span>Експорт</span>
                </button>
                <label className="flex-1 bg-white/80 text-slate-700 px-4 py-3 rounded-xl hover:bg-white transition-all duration-200 text-sm font-medium cursor-pointer border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  <span>📥</span>
                  <span>Імпорт</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-100 to-slate-200 p-8">
          <div className="h-full flex flex-col">
            {/* Device selector */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Попередній перегляд</h3>
                <p className="text-slate-600">Перегляньте як виглядатиме ваша інтро сторінка</p>
              </div>
              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
                {[
                  { type: 'mobile' as DeviceType, icon: '📱', label: 'Мобільний' },
                  { type: 'tablet' as DeviceType, icon: '📱', label: 'Планшет' },
                  { type: 'desktop' as DeviceType, icon: '💻', label: 'Комп\'ютер' }
                ].map((device) => (
                  <button
                    key={device.type}
                    onClick={() => setDeviceType(device.type)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      deviceType === device.type
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    {device.icon} {device.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview container */}
            <div className="flex-1 flex items-center justify-center">
              <div 
                className={`${getDeviceClasses()} bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-white/20`}
                style={{ maxHeight: '85vh' }}
              >
                {/* Real IntroScreen Preview */}
                <div className="w-full h-full relative">
                  <div className="w-full h-full relative overflow-hidden">
                    <IntroScreenPreview />
                  </div>
                  
                  {/* Overlay to prevent interaction */}
                  <div className="absolute inset-0 bg-transparent pointer-events-none z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Content Manager */}
      {isMediaSelectorOpen && (
        <MediaSelector
          isOpen={isMediaSelectorOpen}
          onClose={() => setIsMediaSelectorOpen(false)}
          onSelect={handleMediaSelect}
          allowedTypes={
            mediaSelectorType === 'backgroundImage' ? ['image'] :
            mediaSelectorType === 'backgroundVideo' ? ['video'] :
            mediaSelectorType === 'logo' ? ['image'] :
            ['audio']
          }
          title={
            mediaSelectorType === 'backgroundImage' ? 'Вибрати фонове зображення' :
            mediaSelectorType === 'backgroundVideo' ? 'Вибрати фонове відео' :
            mediaSelectorType === 'logo' ? 'Вибрати логотип' :
            mediaSelectorType === 'backgroundMusic' ? 'Вибрати фонову музику' :
            mediaSelectorType === 'hoverSound' ? 'Вибрати звук наведення' :
            'Вибрати звук кліку'
          }
          description={
            mediaSelectorType === 'backgroundImage' ? 'Оберіть зображення для фону інтро сторінки' :
            mediaSelectorType === 'backgroundVideo' ? 'Оберіть відео для фону інтро сторінки' :
            mediaSelectorType === 'logo' ? 'Оберіть логотип для інтро сторінки' :
            mediaSelectorType === 'backgroundMusic' ? 'Оберіть фонову музику для інтро сторінки' :
            mediaSelectorType === 'hoverSound' ? 'Оберіть звук для ефекту наведення' :
            'Оберіть звук для ефекту кліку'
          }
        />
      )}
    </>
  );
};

export default IntroCustomizer; 