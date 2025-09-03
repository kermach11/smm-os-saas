import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreenPreview from './IntroScreenPreview';
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import SyncButton from './SyncButton';
import MediaSelector from './MediaSelector';
import { useTranslation } from '../hooks/useTranslation';

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
  logoSize: number;
  
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
  titleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  subtitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  descriptionAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  titleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  subtitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  descriptionExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  
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
  
  // 3D Анімації (Spline)
  splineSettings: {
    enabled: boolean;
    sceneUrl: string;
    embedCode: string;
    localFile: string; // Локальний файл .spline
    position: 'background' | 'foreground' | 'overlay';
    opacity: number;
    scale: number;
    autoplay: boolean;
    controls: boolean;
    method: 'iframe' | 'component' | 'local';
  };
}

const defaultSettings: IntroSettings = {
  // Основний контент
  title: "Усе що треба",
  subtitle: "для твого SMM",
  description: "Професійні інструменти в одному місці",
  buttonText: "Почати роботу",
  buttonUrl: "#start",
  logoUrl: "",
  logoSize: 64,
  
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
  showParticles: true,
  particleColor: "#ff6b35",
  animationSpeed: 'normal',
  autoPlay: true,
  
  // 3D Анімації (Spline)
      splineSettings: {
      enabled: false,
      sceneUrl: "",
      embedCode: "",
      localFile: "",
      position: 'background',
      opacity: 1,
      scale: 1,
      autoplay: true,
      controls: false,
      method: 'component'
    }
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'header' | 'design' | 'background' | 'audio' | '3d';

const IntroCustomizer: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<IntroSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('header');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [activeTypographyElement, setActiveTypographyElement] = useState<'title' | 'subtitle' | 'description'>('title');
  
  // Refs removed - using MediaSelector instead

  // Smart Content Manager стан
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSelectorType, setMediaSelectorType] = useState<'backgroundImage' | 'backgroundVideo' | 'logo' | 'backgroundMusic' | 'hoverSound' | 'clickSound'>('backgroundImage');
  
  // Debounce ref для оптимізації оновлень
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Завантаження існуючих налаштувань при ініціалізації
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 IntroCustomizer: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        let savedSettings = await indexedDBService.loadSettings('introSettings');
        
        if (savedSettings) {
          console.log('✅ IntroCustomizer: Налаштування завантажено з IndexedDB');
        } else {
          console.log('ℹ️ IntroCustomizer: Налаштування не знайдено, використовуємо дефолтні');
        }
        
        if (savedSettings) {
          // Перевіряємо що дані мають правильний формат для IntroSettings
          const typedSettings = savedSettings as IntroSettings;
          
          // Забезпечуємо наявність адаптивних налаштувань
          const safeSettings: IntroSettings = {
            ...defaultSettings,
            ...typedSettings,
            mobile: { ...defaultSettings.mobile, ...typedSettings.mobile },
            tablet: { ...defaultSettings.tablet, ...typedSettings.tablet },
            desktop: { ...defaultSettings.desktop, ...typedSettings.desktop },
            audioSettings: {
              ...defaultSettings.audioSettings,
              ...typedSettings.audioSettings,
              backgroundMusic: { ...defaultSettings.audioSettings.backgroundMusic, ...typedSettings.audioSettings?.backgroundMusic },
              hoverSounds: { ...defaultSettings.audioSettings.hoverSounds, ...typedSettings.audioSettings?.hoverSounds },
              clickSounds: { ...defaultSettings.audioSettings.clickSounds, ...typedSettings.audioSettings?.clickSounds }
            },
            splineSettings: { ...defaultSettings.splineSettings, ...typedSettings.splineSettings }
          };
          
          setSettings(safeSettings);
        }
      } catch (error) {
        console.error('❌ IntroCustomizer: Помилка завантаження налаштувань:', error);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (updates: Partial<IntroSettings>) => {
    console.log('🔄 IntroCustomizer: updateSettings викликано з оновленнями:', updates);
    
    // Спеціальне логування для анімацій
    if (updates.titleAnimation || updates.subtitleAnimation || updates.descriptionAnimation) {
      console.log('🎭 IntroCustomizer: Оновлення анімацій:', {
        titleAnimation: updates.titleAnimation,
        subtitleAnimation: updates.subtitleAnimation,
        descriptionAnimation: updates.descriptionAnimation
      });
    }
    
    // Спеціальне логування для текстових змін
    if (updates.title || updates.subtitle || updates.description || updates.buttonText) {
      console.log('📝 IntroCustomizer: Текстові зміни:', {
        title: updates.title,
        subtitle: updates.subtitle,
        description: updates.description,
        buttonText: updates.buttonText
      });
    }
    
    // Спеціальне логування для Spline налаштувань
    if (updates.splineSettings) {
      console.log('🌐 IntroCustomizer: Spline налаштування оновлюються:', updates.splineSettings);
    }
    
    setSyncStatus('syncing');
    
    const newSettings = { ...settings, ...updates };
    console.log('📝 IntroCustomizer: Нові налаштування сформовано:', {
      title: newSettings.title,
      subtitle: newSettings.subtitle,
      description: newSettings.description,
      buttonText: newSettings.buttonText,
      logoUrl: newSettings.logoUrl ? 'є' : 'немає',
      titleFontSize: newSettings.titleFontSize,
      titleAnimation: newSettings.titleAnimation
    });
    
    setSettings(newSettings);
    
    try {
      console.log('🔄 IntroCustomizer: Збереження налаштувань...', Object.keys(updates));
      
      // Зберігаємо повні налаштування в IndexedDB
      await indexedDBService.saveSettings('introSettings', newSettings, 'project');
      console.log('✅ IntroCustomizer: Налаштування збережено в IndexedDB');
      
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 800);
      
    } catch (error) {
      console.error('❌ IntroCustomizer: Помилка збереження:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  }, [settings]);

  // Відстежуємо зміни settings і відправляємо події оновлення з debouncing
  useEffect(() => {
    // Очищуємо попередній timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Debounce відправки події (300ms)
    updateTimeoutRef.current = setTimeout(() => {
      console.log('🔄 IntroCustomizer: Відправляємо подію introSettingsUpdated з налаштуваннями:', {
        titleAnimation: settings.titleAnimation,
        subtitleAnimation: settings.subtitleAnimation,
        descriptionAnimation: settings.descriptionAnimation,
        animationDuration: settings.animationDuration,
        animationDelay: settings.animationDelay
      });
      const syncEvent = new CustomEvent('introSettingsUpdated', { detail: settings });
      window.dispatchEvent(syncEvent);
      console.log('✅ IntroCustomizer: Подія introSettingsUpdated відправлена');
    }, 300);
    
    // Cleanup function
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
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
        return 'w-[320px] h-[568px]';
      case 'tablet':
        return 'w-[640px] h-[480px]';
      default:
        return 'w-[800px] h-[450px]';
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

  const saveSettings = async () => {
    try {
      // Зберігаємо тільки в IndexedDB
      await indexedDBService.saveSettings('introSettings', settings, 'project');
      
      // Dispatch event to update main screen
      window.dispatchEvent(new CustomEvent('introSettingsUpdated', { detail: settings }));
      alert('Налаштування збережено!');
      console.log('✅ IntroCustomizer: Налаштування збережено в IndexedDB');
    } catch (error) {
      console.error('❌ IntroCustomizer: Помилка збереження:', error);
      alert('Помилка збереження налаштувань');
    }
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
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          
          // Якщо це новий формат з metadata
          const importedSettings = imported.settings || imported;
          
          setSettings(importedSettings);
          
          // Зберігаємо імпортовані налаштування в IndexedDB
          await indexedDBService.saveSettings('introSettings', importedSettings, 'project');
          console.log('✅ IntroCustomizer: Імпортовані налаштування збережено в IndexedDB');
          
          alert('Налаштування успішно імпортовано!');
        } catch (error) {
          console.error('❌ IntroCustomizer: Помилка імпорту:', error);
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

  // Безпечний доступ до адаптивних налаштувань
  const getDeviceSettings = (device: DeviceType) => {
    return settings[device] || defaultSettings[device];
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Mobile-первые оптимизации для конструктора интро */
        @media (max-width: 1023px) {
          .mobile-compact-input {
            min-height: 40px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 12px;
          }
          
          .mobile-compact-textarea {
            min-height: 60px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 12px;
          }
          
          .mobile-compact-button {
            min-height: 40px;
            min-width: 40px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 12px;
            touch-action: manipulation;
          }
          
          .mobile-compact-select {
            min-height: 36px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 6px;
          }
          
          .mobile-compact-slider {
            height: 16px;
            touch-action: manipulation;
          }
          
          .mobile-compact-container {
            padding: 6px;
            border-radius: 8px;
          }
          
          .mobile-compact-header {
            padding: 6px;
            margin-bottom: 8px;
          }
          
          .mobile-compact-icon {
            width: 20px;
            height: 20px;
            font-size: 12px;
          }
          
          .mobile-compact-title {
            font-size: 12px;
            font-weight: 600;
          }
          
          .mobile-compact-grid {
            gap: 4px;
          }
          
          .mobile-compact-space {
            gap: 8px;
          }
          
          .touch-manipulation {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Улучшенные слайдеры для мобильных */
          .modern-slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
          
          .modern-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #10b981;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
        }
        `
      }} />
      <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100" data-intro-customizer="true">
        {/* Mobile & Desktop Responsive Sidebar */}
        <div className="w-full lg:w-[520px] lg:min-w-[520px] lg:max-w-[520px] bg-white/80 backdrop-blur-xl lg:border-r border-slate-200/60 flex flex-col shadow-xl">
          {/* Ultra-Compact Mobile Header */}
          <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs lg:text-2xl font-bold text-white mb-0 lg:mb-2">{t('intro.constructor.title')}</h2>
                <p className="text-blue-100 text-xs lg:text-sm hidden lg:block">{t('intro.constructor.description')}</p>
              </div>
              <div className="flex items-center gap-1 lg:gap-3">
                {syncStatus === 'syncing' && (
                  <div className="flex items-center gap-1 lg:gap-2 text-white/90">
                    <div className="w-2 h-2 lg:w-4 lg:h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></div>
                    <span className="text-xs lg:text-sm hidden lg:inline">Синхронізація...</span>
                  </div>
                )}
                {syncStatus === 'synced' && (
                  <div className="flex items-center gap-1 lg:gap-2 text-green-100">
                    <div className="w-2 h-2 lg:w-4 lg:h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-xs lg:text-sm hidden lg:inline">Збережено</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ultra-Compact Mobile Tabs */}
          <div className="flex bg-slate-50/80 border-b border-slate-200/60">
            {[
              { id: 'header', label: t('tabs.header'), icon: '✍️', color: 'blue' },
              { id: 'design', label: t('tabs.design'), icon: '🎨', color: 'purple' },
              { id: 'background', label: t('tabs.background'), icon: '🌅', color: 'indigo' },
              { id: 'audio', label: t('tabs.audio'), icon: '🎵', color: 'green' },
              { id: '3d', label: t('tabs.3d'), icon: '🌐', color: 'cyan' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 px-1 lg:px-3 py-1 lg:py-4 text-sm font-medium transition-all duration-300 relative group min-w-[45px] lg:min-w-0 touch-manipulation ${
                  activeTab === tab.id
                    ? (tab.id === 'header' ? 'text-blue-600 bg-white shadow-sm' :
                       tab.id === 'design' ? 'text-purple-600 bg-white shadow-sm' :
                       tab.id === 'background' ? 'text-indigo-600 bg-white shadow-sm' :
                       tab.id === 'audio' ? 'text-green-600 bg-white shadow-sm' :
                       tab.id === '3d' ? 'text-cyan-600 bg-white shadow-sm' : 'text-slate-600 bg-white shadow-sm')
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                              <div className="flex flex-col items-center gap-0 lg:gap-2">
                <span className="text-xs lg:text-lg">{tab.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight">{tab.label}</span>
              </div>
                {activeTab === tab.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    tab.id === 'header' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                    tab.id === 'design' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                    tab.id === 'background' ? 'bg-gradient-to-r from-indigo-400 to-indigo-600' :
                    tab.id === 'audio' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    tab.id === '3d' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' : 'bg-gradient-to-r from-slate-400 to-slate-600'
                  }`}></div>
                )}
              </button>
            ))}
          </div>

                  {/* Ultra-Compact Tab Content */}
        <div className="flex-1 overflow-y-auto p-1.5 lg:p-6 space-y-2 lg:space-y-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
            {activeTab === 'header' && (
              <div className="space-y-2 lg:space-y-6">
                {/* 1. 📝 Текстовий контент - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">📝</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.text.content')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.text.content.description')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-5">
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                        {t('intro.text.title')}
                      </label>
                      <input
                        type="text"
                        value={settings.title}
                        onChange={(e) => updateSettings({ title: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                        placeholder={t('intro.enter.title.placeholder')}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                        {t('intro.text.subtitle')}
                      </label>
                      <input
                        type="text"
                        value={settings.subtitle}
                        onChange={(e) => updateSettings({ subtitle: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                        placeholder={t('intro.enter.subtitle.placeholder')}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                        {t('intro.text.description')}
                      </label>
                      <textarea
                        value={settings.description}
                        onChange={(e) => updateSettings({ description: e.target.value })}
                        rows={2}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none min-h-[60px] touch-manipulation text-xs lg:text-sm"
                        placeholder={t('intro.enter.description.placeholder')}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-500 rounded-full"></span>
                        {t('intro.text.button')}
                      </label>
                      <input
                        type="text"
                        value={settings.buttonText}
                        onChange={(e) => updateSettings({ buttonText: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                        placeholder={t('intro.enter.button.placeholder')}
                      />
                    </div>

                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full"></span>
                        {t('intro.button.url')}
                      </label>
                      <input
                        type="text"
                        value={settings.buttonUrl}
                        onChange={(e) => updateSettings({ buttonUrl: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                        placeholder="Введіть URL..."
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Типографіка - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-purple-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🔤</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.typography.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.typography.description')}</p>
                    </div>
                  </div>

                {/* Переключення між елементами - MOBILE OPTIMIZED */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.select.element.edit')}</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('intro.text.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('intro.text.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('intro.text.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[50px] lg:min-h-[auto] ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-lg mb-0.5 lg:mb-1 text-center">{element.icon}</div>
                        <div className="text-xs font-semibold text-center leading-tight">{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                  {/* Спільні налаштування для обраного елемента - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-5 border border-purple-100">
                    <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-5">
                      <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                        {t('intro.settings.for')} {
                          activeTypographyElement === 'title' ? t('preview.element.title') :
                          activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-2 lg:space-y-5">
                      {/* Сімейство шрифтів - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('intro.font.family')}</label>
                        <select
                          value={getTypographyValue('fontFamily') as string}
                          onChange={(e) => updateTypographyValue('fontFamily', e.target.value)}
                          className="w-full px-2 lg:px-4 py-1.5 lg:py-3 bg-white border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs lg:text-sm transition-all duration-200 min-h-[36px] lg:min-h-[auto]"
                        >
                          <optgroup label="🔥 Сучасні Sans-Serif (з кирилицею)">
                            <option value="Inter">Inter</option>
                            <option value="Source Sans Pro">Source Sans Pro</option>
                            <option value="Nunito">Nunito</option>
                            <option value="IBM Plex Sans">IBM Plex Sans</option>
                            <option value="Fira Sans">Fira Sans</option>
                          </optgroup>
                          <optgroup label="📖 Класичні Sans-Serif (з кирилицею)">
                            <option value="Roboto">Roboto</option>
                            <option value="Open Sans">Open Sans</option>
                            <option value="Lato">Lato</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Oswald">Oswald</option>
                          </optgroup>
                          <optgroup label="✍️ Елегантні Serif (з кирилицею)">
                            <option value="Source Serif Pro">Source Serif Pro</option>
                            <option value="Lora">Lora</option>
                            <option value="IBM Plex Serif">IBM Plex Serif</option>
                            <option value="Georgia">Georgia</option>
                          </optgroup>
                          <optgroup label="🎨 Декоративні (обмежена кирилиця)">
                            <option value="Playfair Display">Playfair Display</option>
                          </optgroup>
                          <optgroup label="💻 Спеціальні (з кирилицею)">
                            <option value="JetBrains Mono">JetBrains Mono (моноширинний)</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Arial">Arial</option>
                            <option value="Helvetica">Helvetica</option>
                          </optgroup>
                        </select>
                      </div>

                      {/* Товщина шрифту - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('intro.font.weight')}</label>
                        <div className="grid grid-cols-3 gap-1 lg:gap-3">
                          {[
                            { value: 400, label: t('preview.font.weight.normal'), weight: 'font-normal' },
                            { value: 600, label: t('preview.font.weight.semi'), weight: 'font-semibold' },
                            { value: 700, label: t('preview.font.weight.bold'), weight: 'font-bold' }
                          ].map((weight) => (
                            <button
                              key={weight.value}
                              onClick={() => updateTypographyValue('fontWeight', weight.value)}
                              className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[40px] lg:min-h-[auto] touch-manipulation ${
                                getTypographyValue('fontWeight') === weight.value
                                  ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className={`${weight.weight} text-xs lg:text-lg mb-0.5 lg:mb-1`}>Aa</div>
                              <div className="text-xs font-semibold leading-tight break-words">{weight.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Стиль тексту - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('preview.text.style')}</label>
                        <div className="grid grid-cols-2 gap-1 lg:gap-3">
                          {[
                            { value: 'normal', label: t('preview.text.style.normal'), style: 'font-normal' },
                            { value: 'italic', label: t('preview.text.style.italic'), style: 'italic' }
                          ].map((style) => (
                            <button
                              key={style.value}
                              onClick={() => updateTypographyValue('fontStyle', style.value)}
                              className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[40px] lg:min-h-[auto] touch-manipulation ${
                                getTypographyValue('fontStyle') === style.value
                                  ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className={`${style.style} text-xs lg:text-base mb-0.5 lg:mb-1 truncate`}>
                                {activeTypographyElement === 'title' ? t('intro.text.title') :
                                 activeTypographyElement === 'subtitle' ? t('intro.text.subtitle') : t('intro.text.description')}
                              </div>
                              <div className="text-xs font-semibold leading-tight">{style.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Адаптивність - ЧЕТВЕРТИЙ БЛОК - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">📱</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.responsive.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.responsive.description')}</p>
                    </div>
                  </div>
                  
                  {/* Вибір пристрою - MOBILE OPTIMIZED */}
                  <div className="mb-2 lg:mb-6">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.select.device')}</label>
                    <div className="grid grid-cols-3 gap-1 lg:gap-3">
                      {[
                        { type: 'mobile', label: t('intro.device.mobile'), icon: '📱', color: 'emerald' },
                        { type: 'tablet', label: t('intro.device.tablet'), icon: '📟', color: 'teal' },
                        { type: 'desktop', label: t('intro.device.desktop'), icon: '🖥️', color: 'cyan' }
                      ].map((device) => (
                        <button
                          key={device.type}
                          onClick={() => setDeviceType(device.type as DeviceType)}
                          className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[50px] lg:min-h-[auto] ${
                            deviceType === device.type
                              ? `border-${device.color}-500 bg-${device.color}-100 text-${device.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-xs lg:text-lg mb-0.5 lg:mb-1 text-center">{device.icon}</div>
                          <div className="text-xs font-semibold text-center leading-tight">{device.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування для обраного пристрою - MOBILE OPTIMIZED */}
                  <div className="space-y-2 lg:space-y-5">
                    {/* Заголовок - MOBILE COMPACT */}
                    <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-2 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full"></span>
                        {t('intro.text.title')}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.font.size')} {getDeviceSettings(deviceType).titleFontSize}px
                          </label>
                          <input
                            type="range"
                            min="16"
                            max="120"
                            value={getDeviceSettings(deviceType).titleFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                titleFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.margin.bottom')} {getDeviceSettings(deviceType).titleMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={getDeviceSettings(deviceType).titleMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                titleMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Підзаголовок - MOBILE COMPACT */}
                    <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-2 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></span>
                        {t('intro.text.subtitle')}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.font.size')} {getDeviceSettings(deviceType).subtitleFontSize}px
                          </label>
                          <input
                            type="range"
                            min="14"
                            max="100"
                            value={getDeviceSettings(deviceType).subtitleFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                subtitleFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.margin.bottom')} {getDeviceSettings(deviceType).subtitleMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="40"
                            value={getDeviceSettings(deviceType).subtitleMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                subtitleMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Опис - MOBILE COMPACT */}
                    <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-4 border border-emerald-100">
                      <h4 className="font-semibold text-slate-800 mb-2 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-sm">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></span>
                        {t('intro.text.description')}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.font.size')} {getDeviceSettings(deviceType).descriptionFontSize}px
                          </label>
                          <input
                            type="range"
                            min="12"
                            max="72"
                            value={getDeviceSettings(deviceType).descriptionFontSize}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                descriptionFontSize: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('responsive.margin.bottom')} {getDeviceSettings(deviceType).descriptionMarginBottom}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="30"
                            value={getDeviceSettings(deviceType).descriptionMarginBottom}
                            onChange={(e) => updateSettings({
                              [deviceType]: {
                                ...getDeviceSettings(deviceType),
                                descriptionMarginBottom: parseInt(e.target.value)
                              }
                            })}
                            className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Тіні та ефекти - П'ЯТИЙ БЛОК - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🌟</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.shadows.effects')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.shadows.description')}</p>
                    </div>
                  </div>

                  {/* Переключення між елементами - MOBILE OPTIMIZED */}
                  <div className="mb-2 lg:mb-6">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.select.element.effects')}</label>
                    <div className="grid grid-cols-3 gap-1 lg:gap-3">
                      {[
                        { type: 'title', label: t('intro.text.title'), icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: t('intro.text.subtitle'), icon: '📝', color: 'purple' },
                        { type: 'description', label: t('intro.text.description'), icon: '📄', color: 'green' }
                      ].map((element) => (
                        <button
                          key={element.type}
                          onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                          className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[50px] lg:min-h-[auto] ${
                            activeTypographyElement === element.type
                              ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-xs lg:text-lg mb-0.5 lg:mb-1 text-center">{element.icon}</div>
                          <div className="text-xs font-semibold text-center leading-tight">{element.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Спільні налаштування для обраного елемента - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-5 border border-indigo-100">
                    <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-5">
                      <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                        {t('intro.effects.for')} {
                          activeTypographyElement === 'title' ? t('preview.element.title') :
                          activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-2 lg:space-y-5">
                      {/* 3D Глибина - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                          {t('intro.3d.depth')}: {
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
                          className="w-full h-1.5 lg:h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>

                      {/* Інтенсивність тіні - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                          {t('intro.shadow.intensity')}: {
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
                          className="w-full h-1.5 lg:h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>

                      {/* Колір тіні - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('intro.shadow.color')}</label>
                        <div className="flex gap-1 lg:gap-3">
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
                            className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm"
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
                            className="flex-1 px-2 py-1.5 lg:px-4 lg:py-3 bg-white border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm"
                            placeholder={t('intro.shadow.color')}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Анімації тексту - ШОСТИЙ БЛОК - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-rose-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.text.animations')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.animations.description')}</p>
                    </div>
                  </div>

                  {/* Переключення між елементами - MOBILE OPTIMIZED */}
                  <div className="mb-2 lg:mb-6">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.select.element.animation')}</label>
                    <div className="grid grid-cols-3 gap-1 lg:gap-3">
                      {[
                        { type: 'title', label: t('intro.text.title'), icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: t('intro.text.subtitle'), icon: '📝', color: 'purple' },
                        { type: 'description', label: t('intro.text.description'), icon: '📄', color: 'green' }
                      ].map((element) => (
                        <button
                          key={element.type}
                          onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                          className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[50px] lg:min-h-[auto] ${
                            activeTypographyElement === element.type
                              ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-xs lg:text-lg mb-0.5 lg:mb-1 text-center">{element.icon}</div>
                          <div className="text-xs font-semibold text-center leading-tight">{element.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Спільні налаштування для обраного елемента - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-5 border border-rose-100">
                    <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-5">
                      <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                        activeTypographyElement === 'title' ? 'bg-blue-500' :
                        activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                      }`}></div>
                      <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                        {t('intro.animations.for')} {
                          activeTypographyElement === 'title' ? t('preview.element.title') :
                          activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                        }
                      </h4>
                    </div>
                    
                    <div className="space-y-2 lg:space-y-5">
                      {/* Анімація входу - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('intro.entrance.animation')}</label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-3">
                          {[
                            { value: 'none', label: t('preview.animation.none'), icon: '⚪' },
                            { value: 'fadeIn', label: t('preview.animation.fade'), icon: '🌅' },
                            { value: 'slideUp', label: t('preview.animation.bottom'), icon: '⬆️' },
                            { value: 'slideDown', label: t('preview.animation.top'), icon: '⬇️' },
                            { value: 'slideLeft', label: t('preview.animation.right'), icon: '⬅️' },
                            { value: 'slideRight', label: t('preview.animation.left'), icon: '➡️' },
                            { value: 'zoomIn', label: t('preview.animation.zoom'), icon: '🔍' },
                            { value: 'zoomOut', label: t('preview.animation.zoom.out'), icon: '🔎' },
                            { value: 'rotateIn', label: t('preview.animation.rotate'), icon: '🔄' },
                            { value: 'bounce', label: t('preview.animation.bounce'), icon: '⚡' },
                            { value: 'typewriter', label: t('preview.animation.typewriter'), icon: '⌨️' },
                            { value: 'glow', label: t('preview.animation.glow'), icon: '✨' },
                            { value: 'cinematicZoom', label: 'Кіно-зум', icon: '🎬' }
                          ].map((animation) => (
                            <button
                              key={animation.value}
                              onClick={() => {
                                console.log(`🎭 IntroCustomizer: Змінюємо анімацію для ${activeTypographyElement} на ${animation.value}`);
                                if (activeTypographyElement === 'title') {
                                  updateSettings({ titleAnimation: animation.value as any });
                                } else if (activeTypographyElement === 'subtitle') {
                                  updateSettings({ subtitleAnimation: animation.value as any });
                                } else {
                                  updateSettings({ descriptionAnimation: animation.value as any });
                                }
                              }}
                              className={`px-1 py-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[40px] lg:min-h-[auto] touch-manipulation ${
                                (activeTypographyElement === 'title' ? settings.titleAnimation :
                                 activeTypographyElement === 'subtitle' ? settings.subtitleAnimation :
                                 settings.descriptionAnimation) === animation.value
                                  ? 'border-rose-500 bg-rose-100 text-rose-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className="text-xs lg:text-lg mb-0.5 lg:mb-1">{animation.icon}</div>
                              <div className="text-xs font-semibold leading-tight break-words">{animation.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Анімація виходу - MOBILE OPTIMIZED */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('intro.exit.animation')}</label>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-3">
                          {[
                            { value: 'none', label: t('preview.animation.none'), icon: '⚪' },
                            { value: 'fadeOut', label: t('preview.animation.fade.out'), icon: '🌇' },
                            { value: 'slideUp', label: t('preview.animation.top.out'), icon: '⬆️' },
                            { value: 'slideDown', label: t('preview.animation.bottom.out'), icon: '⬇️' },
                            { value: 'slideLeft', label: t('preview.animation.left.out'), icon: '⬅️' },
                            { value: 'slideRight', label: t('preview.animation.right.out'), icon: '➡️' },
                            { value: 'zoomOut', label: t('preview.animation.zoom.out'), icon: '🔎' },
                            { value: 'zoomIn', label: t('preview.animation.zoom'), icon: '🔍' },
                            { value: 'rotateOut', label: t('preview.animation.rotate'), icon: '🔄' },
                            { value: 'dissolve', label: t('preview.animation.dissolve'), icon: '💫' },
                            { value: 'cinematicZoomOut', label: 'Кіно-зум виходу', icon: '🎭' }
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
                              className={`px-1 py-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[40px] lg:min-h-[auto] touch-manipulation ${
                                (activeTypographyElement === 'title' ? settings.titleExitAnimation :
                                 activeTypographyElement === 'subtitle' ? settings.subtitleExitAnimation :
                                 settings.descriptionExitAnimation) === animation.value
                                  ? 'border-rose-500 bg-rose-100 text-rose-700 shadow-md'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                              }`}
                            >
                              <div className="text-xs lg:text-lg mb-0.5 lg:mb-1">{animation.icon}</div>
                              <div className="text-xs font-semibold leading-tight break-words">{animation.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Налаштування часу - MOBILE OPTIMIZED */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                            {t('preview.duration')}: {settings.animationDuration}{t('common.time.ms')}
                          </label>
                          <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={settings.animationDuration}
                            onChange={(e) => updateSettings({ animationDuration: parseInt(e.target.value) })}
                            className="w-full h-1.5 lg:h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                            {t('preview.delay')}: {settings.animationDelay}{t('common.time.ms')}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1000"
                            step="50"
                            value={settings.animationDelay}
                            onChange={(e) => updateSettings({ animationDelay: parseInt(e.target.value) })}
                            className="w-full h-1.5 lg:h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="space-y-2 lg:space-y-6">
                {/* 🖼️ Логотип - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-amber-100 shadow-sm">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🖼️</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">Логотип</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Завантажити медіа</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 lg:gap-3">
                    <button
                      onClick={() => openMediaSelector('logo', ['image'])}
                      className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md lg:rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[40px] lg:min-h-[auto] touch-manipulation text-xs lg:text-base"
                    >
                      📚 Вибрати з медіа-бібліотеки
                    </button>
                    {settings.logoUrl && (
                      <button
                        onClick={() => updateSettings({ logoUrl: '' })}
                        className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  {settings.logoUrl && (
                    <div className="mt-2 lg:mt-4 p-2 lg:p-3 bg-white/60 rounded-xl border border-amber-100 space-y-3">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <img src={settings.logoUrl} alt="Логотип" className="w-8 h-8 lg:w-12 lg:h-12 object-contain rounded-lg border border-amber-200" />
                        <div>
                          <p className="text-xs lg:text-sm font-medium text-slate-700">Логотип завантажено</p>
                          <p className="hidden lg:block text-xs text-slate-500">Відображається у верхній частині сторінки</p>
                        </div>
                      </div>
                      
                      {/* Контрол розміру логотипа */}
                      <div>
                        <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-2">
                          Розмір логотипа: {settings.logoSize || 64}px
                        </label>
                        <input
                          type="range"
                          min="32"
                          max="200"
                          step="8"
                          value={settings.logoSize || 64}
                          onChange={(e) => updateSettings({ logoSize: parseInt(e.target.value) })}
                          className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>32px</span>
                          <span>200px</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Кольорова схема - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-pink-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🎨</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('colors.scheme')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('colors.scheme.description')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-5">
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-pink-500 rounded-full"></span>
                        {t('colors.primary')}
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <input
                          type="color"
                          value={settings.brandColor}
                          onChange={(e) => updateSettings({ brandColor: e.target.value })}
                          className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.brandColor}
                          onChange={(e) => updateSettings({ brandColor: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                        {t('colors.accent')}
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => updateSettings({ accentColor: e.target.value })}
                          className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => updateSettings({ accentColor: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-slate-500 rounded-full"></span>
                        {t('colors.text')}
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <input
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => updateSettings({ textColor: e.target.value })}
                          className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.textColor}
                          onChange={(e) => updateSettings({ textColor: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ефекти - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.visual.effects')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.visual.effects.description')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-5">
                    <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100">
                      <div className="flex items-center gap-1.5 lg:gap-3">
                        <span className="text-lg lg:text-2xl">✨</span>
                        <div>
                          <h4 className="text-xs lg:text-base font-semibold text-slate-800 leading-tight">{t('intro.particles')}</h4>
                          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.particles.description')}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                        <input
                          type="checkbox"
                          checked={settings.showParticles}
                          onChange={(e) => updateSettings({ showParticles: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>

                    {settings.showParticles && (
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-500 rounded-full"></span>
                          {t('intro.particles.color')}
                        </label>
                        <div className="flex gap-1.5 lg:gap-3">
                          <input
                            type="color"
                            value={settings.particleColor}
                            onChange={(e) => updateSettings({ particleColor: e.target.value })}
                            className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                          />
                          <input
                            type="text"
                            value={settings.particleColor}
                            onChange={(e) => updateSettings({ particleColor: e.target.value })}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                            placeholder={t('intro.particles.color')}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="space-y-2 lg:space-y-6">
                {/* Тип фону - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🌅</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.background.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.background.description')}</p>
                    </div>
                  </div>

                  <div className="mb-2 lg:mb-6">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.background.type')}</label>
                    <div className="grid grid-cols-2 gap-1 lg:gap-3">
                      {[
                          { value: 'color', label: t('intro.background.types.color'), icon: '🎨', color: 'red' },
                          { value: 'gradient', label: t('intro.background.types.gradient'), icon: '🌈', color: 'orange' },
                          { value: 'image', label: t('intro.background.types.image'), icon: '🖼️', color: 'green' },
                          { value: 'video', label: t('intro.background.types.video'), icon: '🎬', color: 'blue' }
                        ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => updateSettings({ backgroundType: type.value as IntroSettings['backgroundType'] })}
                          className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                            settings.backgroundType === type.value
                              ? `border-${type.color}-500 bg-${type.color}-100 text-${type.color}-700 shadow-lg scale-105`
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-sm lg:text-xl mb-0.5 lg:mb-1 text-center">{type.icon}</div>
                          <div className="text-xs font-semibold text-center leading-tight">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування фону - MOBILE OPTIMIZED */}
                  {settings.backgroundType === 'color' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full"></span>
                        {t('intro.background.color.label')}
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                          className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                        />
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'gradient' && (
                    <div className="space-y-2 lg:space-y-5">
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-500 rounded-full"></span>
                          {t('intro.background.gradient.from')}
                        </label>
                        <div className="flex gap-1.5 lg:gap-3">
                          <input
                            type="color"
                            value={settings.gradientFrom}
                            onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                            className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                          />
                          <input
                            type="text"
                            value={settings.gradientFrom}
                            onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-yellow-500 rounded-full"></span>
                          {t('intro.background.gradient.to')}
                        </label>
                        <div className="flex gap-1.5 lg:gap-3">
                          <input
                            type="color"
                            value={settings.gradientTo}
                            onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                            className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                          />
                          <input
                            type="text"
                            value={settings.gradientTo}
                            onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] lg:min-h-[auto] text-xs lg:text-base"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {settings.backgroundType === 'image' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                        {t('intro.background.image.label')}
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundImage', ['image'])}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md lg:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[40px] lg:min-h-[auto] touch-manipulation text-xs lg:text-base"
                        >
                          📚 {t('intro.select.from.media')}
                        </button>
                        {settings.backgroundImage && (
                          <button
                            onClick={() => updateSettings({ backgroundImage: '' })}
                            className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      {/* Показуємо інформацію про обране зображення - MOBILE OPTIMIZED */}
                      {settings.backgroundImage && (
                        <div className="mt-2 lg:mt-3 p-2 lg:p-3 bg-green-50 rounded-md lg:rounded-xl border border-green-200">
                          <div className="flex items-center gap-1.5 lg:gap-3">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-md lg:rounded-lg border border-green-300 overflow-hidden">
                              <img src={settings.backgroundImage} alt={t('intro.background.image.label')} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-green-700">{t('intro.background.image.loaded')}</p>
                              <p className="text-xs lg:text-xs text-green-600 hidden lg:block">{t('intro.background.image.used')}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {settings.backgroundType === 'video' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                        Фонове відео
                      </label>
                      <div className="flex gap-1.5 lg:gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundVideo', ['video'])}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[40px] lg:min-h-[auto] touch-manipulation text-xs lg:text-base"
                        >
                          📚 {t('intro.select.from.media')}
                        </button>
                        {settings.backgroundVideo && (
                          <button
                            onClick={() => updateSettings({ backgroundVideo: '' })}
                            className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      
                      {/* Показуємо інформацію про обране відео - MOBILE OPTIMIZED */}
                      {settings.backgroundVideo && (
                        <div className="mt-2 lg:mt-3 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-xl border border-blue-200">
                          <div className="flex items-center gap-1.5 lg:gap-3">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-md lg:rounded-lg border border-blue-300 flex items-center justify-center">
                              <span className="text-blue-600 text-sm lg:text-lg">🎬</span>
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-blue-700">Фонове відео завантажене</p>
                              <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">Відео буде відтворюватися на фоні</p>
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
              <div className="space-y-2 lg:space-y-6">
                {/* Фонова музика - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-green-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🎵</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('audio.bg.music')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.bg.music.description')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-5">
                    <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-green-100">
                      <div className="flex items-center gap-1.5 lg:gap-3">
                        <span className="text-lg lg:text-2xl">🎵</span>
                        <div>
                          <h4 className="text-xs lg:text-base font-semibold text-slate-800 leading-tight">{t('audio.bg.music.enabled')}</h4>
                          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.bg.music.autoplay.description')}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
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
                        <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>

                    {settings.audioSettings.backgroundMusic.enabled && (
                      <div className="space-y-2 lg:space-y-4">
                        <div>
                          <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                            {t('audio.file.label')}
                          </label>
                          <div className="flex gap-1.5 lg:gap-3">
                            <button
                              onClick={() => openMediaSelector('backgroundMusic', ['audio'])}
                              className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md lg:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[40px] lg:min-h-[auto] touch-manipulation text-xs lg:text-base"
                            >
                              📚 {t('intro.select.from.media')}
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
                                className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл - MOBILE OPTIMIZED */}
                          {settings.audioSettings.backgroundMusic.url && (
                            <div className="mt-2 lg:mt-3 p-2 lg:p-3 bg-green-50 rounded-md lg:rounded-xl border border-green-200">
                              <div className="flex items-center gap-1.5 lg:gap-3">
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-100 rounded-md lg:rounded-lg border border-green-300 flex items-center justify-center">
                                  <span className="text-green-600 text-sm lg:text-lg">🎵</span>
                                </div>
                                <div>
                                  <p className="text-xs lg:text-sm font-medium text-green-700">{t('audio.bg.music.loaded')}</p>
                                  <p className="text-xs lg:text-xs text-green-600 hidden lg:block">{t('audio.bg.music.loaded.description')}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                            {t('audio.volume.label')}: {Math.round(settings.audioSettings.backgroundMusic.volume * 100)}%
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
                            className="w-full h-1.5 lg:h-2 bg-green-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                          <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-green-100">
                            <div>
                              <h5 className="text-xs lg:text-base font-medium text-slate-800 leading-tight">{t('audio.loop.label')}</h5>
                              <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('audio.loop.description')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
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
                              <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-green-100">
                            <div>
                              <h5 className="text-xs lg:text-base font-medium text-slate-800 leading-tight">{t('audio.autoplay.label')}</h5>
                              <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('audio.autoplay.description')}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
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
                              <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Звукові ефекти - MOBILE OPTIMIZED */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🔊</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('audio.sound.effects')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.sound.effects.description')}</p>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-5">
                    {/* Звуки наведення - MOBILE OPTIMIZED */}
                    <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-2 lg:mb-4">
                        <div className="flex items-center gap-1.5 lg:gap-3">
                          <span className="text-lg lg:text-xl">🖱️</span>
                          <div>
                            <h4 className="text-xs lg:text-base font-semibold text-slate-800 leading-tight">{t('audio.hover.sounds')}</h4>
                            <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.hover.sounds.description')}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
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
                          <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {settings.audioSettings.hoverSounds.enabled && (
                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex gap-1.5 lg:gap-3">
                            <button
                              onClick={() => openMediaSelector('hoverSound', ['audio'])}
                              className="flex-1 px-2 py-2 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md lg:rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-xs lg:text-sm font-medium min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              📚 {t('intro.select.from.media')}
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
                                className="px-2 py-2 lg:px-3 lg:py-2 text-red-600 hover:bg-red-50 rounded-md lg:rounded-lg transition-all duration-200 border border-red-200 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] min-w-[36px] lg:min-w-[auto] touch-manipulation"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл - MOBILE OPTIMIZED */}
                          {settings.audioSettings.hoverSounds.url && (
                            <div className="mt-2 lg:mt-3 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-xl border border-blue-200">
                              <div className="flex items-center gap-1.5 lg:gap-3">
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-md lg:rounded-lg border border-blue-300 flex items-center justify-center">
                                  <span className="text-blue-600 text-sm lg:text-lg">🖱️</span>
                                </div>
                                <div>
                                  <p className="text-xs lg:text-sm font-medium text-blue-700">{t('audio.hover.sound.loaded')}</p>
                                  <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">{t('audio.hover.sound.loaded.description')}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs lg:text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                              {t('audio.volume.label')}: {Math.round(settings.audioSettings.hoverSounds.volume * 100)}%
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
                              className="w-full h-1.5 lg:h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Звуки кліків - MOBILE OPTIMIZED */}
                    <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-2 lg:mb-4">
                        <div className="flex items-center gap-1.5 lg:gap-3">
                          <span className="text-lg lg:text-xl">👆</span>
                          <div>
                            <h4 className="text-xs lg:text-base font-semibold text-slate-800 leading-tight">{t('audio.click.sounds')}</h4>
                            <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.click.sounds.description')}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
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
                          <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>

                      {settings.audioSettings.clickSounds.enabled && (
                        <div className="space-y-2 lg:space-y-3">
                          <div className="flex gap-1.5 lg:gap-3">
                            <button
                              onClick={() => openMediaSelector('clickSound', ['audio'])}
                              className="flex-1 px-2 py-2 lg:px-3 lg:py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md lg:rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 text-xs lg:text-sm font-medium min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              📚 {t('intro.select.from.media')}
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
                                className="px-2 py-2 lg:px-3 lg:py-2 text-red-600 hover:bg-red-50 rounded-md lg:rounded-lg transition-all duration-200 border border-red-200 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] min-w-[36px] lg:min-w-[auto] touch-manipulation"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                          
                          {/* Показуємо інформацію про обраний файл - MOBILE OPTIMIZED */}
                          {settings.audioSettings.clickSounds.url && (
                            <div className="mt-2 lg:mt-3 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-xl border border-blue-200">
                              <div className="flex items-center gap-1.5 lg:gap-3">
                                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-md lg:rounded-lg border border-blue-300 flex items-center justify-center">
                                  <span className="text-blue-600 text-sm lg:text-lg">👆</span>
                                </div>
                                <div>
                                  <p className="text-xs lg:text-sm font-medium text-blue-700">{t('audio.click.sound.loaded')}</p>
                                  <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">{t('audio.click.sound.loaded.description')}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs lg:text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                              {t('audio.volume.label')}: {Math.round(settings.audioSettings.clickSounds.volume * 100)}%
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
                              className="w-full h-1.5 lg:h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Section - MOBILE OPTIMIZED */}
            {activeTab === '3d' && (
              <div className="space-y-3 lg:space-y-6">
                {/* Spline 3D Animation */}
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                  <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                    <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-md lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🌐</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('preview.spline.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.spline.description')}</p>
                    </div>
                  </div>

                  {/* Enable Toggle - MOBILE OPTIMIZED */}
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100 mb-2 lg:mb-6">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-lg lg:text-2xl">🌐</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800 leading-tight">{t('preview.spline.enable')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.spline.enable.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.splineSettings.enabled}
                        onChange={(e) => {
                          console.log('🌐 Spline enabled перемикнуто:', e.target.checked);
                          updateSettings({ 
                            splineSettings: { 
                              ...settings.splineSettings, 
                              enabled: e.target.checked 
                            } 
                          });
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {settings.splineSettings.enabled && (
                    <div className="space-y-2 lg:space-y-5">
                      {/* Scene URL Input - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-500 rounded-full"></span>
                          {t('preview.spline.url')}
                        </label>
                        <input
                          type="url"
                          value={settings.splineSettings.sceneUrl}
                          onChange={(e) => {
                            console.log('🌐 Spline URL змінено:', e.target.value);
                            updateSettings({ 
                              splineSettings: { 
                                ...settings.splineSettings, 
                                sceneUrl: e.target.value 
                              } 
                            });
                          }}
                          className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-xs lg:text-base min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          placeholder={t('preview.spline.url.placeholder')}
                        />
                        <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                          {t('preview.spline.url.tip')}
                        </p>
                      </div>

                      {/* Embed Code Input - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-teal-500 rounded-full"></span>
                          {t('preview.spline.embed')}
                        </label>
                        <textarea
                          value={settings.splineSettings.embedCode}
                          onChange={(e) => updateSettings({ 
                            splineSettings: { 
                              ...settings.splineSettings, 
                              embedCode: e.target.value 
                            } 
                          })}
                          rows={3}
                          className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none font-mono text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          placeholder="<iframe src='...' ...></iframe>"
                        />
                        <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                          {t('preview.spline.embed.tip')}
                        </p>
                      </div>

                      {/* Local File Input - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                          {t('preview.spline.file')}
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".spline,.json"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Створюємо локальний URL для файлу
                                const localUrl = URL.createObjectURL(file);
                                updateSettings({ 
                                  splineSettings: { 
                                    ...settings.splineSettings, 
                                    localFile: localUrl,
                                    method: 'local'
                                  } 
                                });
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 touch-manipulation"
                            id="spline-file-input"
                          />
                          <label
                            htmlFor="spline-file-input"
                            className="flex items-center justify-center w-full px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-md lg:rounded-xl hover:from-purple-100 hover:to-indigo-100 hover:border-purple-400 transition-all duration-200 cursor-pointer group min-h-[40px] lg:min-h-[auto] touch-manipulation"
                          >
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-md lg:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="text-white text-xs lg:text-sm">📁</span>
                              </div>
                              <div className="text-center">
                                <p className="text-xs lg:text-sm font-semibold text-slate-700">{t('preview.spline.file.select')}</p>
                                <p className="text-xs lg:text-xs text-slate-500 hidden lg:block">{t('preview.spline.file.drag')}</p>
                              </div>
                            </div>
                          </label>
                        </div>
                        <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                          {t('preview.spline.file.tip')}
                        </p>
                      </div>



                      {/* Position Selection - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('preview.spline.position')}</label>
                        <div className="grid grid-cols-3 gap-1.5 lg:gap-3">
                          {[
                            { value: 'background', label: t('preview.spline.position.background'), icon: '🖼️', desc: t('preview.spline.position.background.desc') },
                            { value: 'overlay', label: t('preview.spline.position.overlay'), icon: '📱', desc: t('preview.spline.position.overlay.desc') },
                            { value: 'foreground', label: t('preview.spline.position.foreground'), icon: '🎯', desc: t('preview.spline.position.foreground.desc') }
                          ].map((pos) => (
                            <button
                              key={pos.value}
                              onClick={() => {
                                console.log('🌐 Position змінено на:', pos.value);
                                updateSettings({ 
                                  splineSettings: { 
                                    ...settings.splineSettings, 
                                    position: pos.value as any 
                                  } 
                                });
                              }}
                              className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                                settings.splineSettings.position === pos.value
                                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                  : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-600'
                              }`}
                            >
                              <div className="text-sm lg:text-lg mb-1">{pos.icon}</div>
                              <div className="text-xs lg:text-xs font-semibold">{pos.label}</div>
                              <div className="text-xs lg:text-xs text-slate-500 mt-1 hidden lg:block">{pos.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Opacity Control - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                          {t('preview.spline.opacity')}: {Math.round(settings.splineSettings.opacity * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.splineSettings.opacity}
                          onChange={(e) => updateSettings({ 
                            splineSettings: { 
                              ...settings.splineSettings, 
                              opacity: parseFloat(e.target.value) 
                            } 
                          })}
                          className="w-full h-1.5 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                        />
                      </div>

                      {/* Scale Control - MOBILE OPTIMIZED */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                          {t('preview.spline.scale')}: {Math.round(settings.splineSettings.scale * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={settings.splineSettings.scale}
                          onChange={(e) => updateSettings({ 
                            splineSettings: { 
                              ...settings.splineSettings, 
                              scale: parseFloat(e.target.value) 
                            } 
                          })}
                          className="w-full h-1.5 lg:h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                        />
                      </div>

                      {/* Additional Options - MOBILE OPTIMIZED */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100">
                          <div>
                            <h5 className="font-medium text-xs lg:text-base text-slate-800 leading-tight">{t('preview.spline.autoplay')}</h5>
                            <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('preview.spline.autoplay.description')}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={settings.splineSettings.autoplay}
                              onChange={(e) => updateSettings({ 
                                splineSettings: { 
                                  ...settings.splineSettings, 
                                  autoplay: e.target.checked 
                                } 
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-7 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100">
                          <div>
                            <h5 className="font-medium text-xs lg:text-base text-slate-800 leading-tight">{t('preview.spline.controls')}</h5>
                            <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('preview.spline.controls.description')}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                            <input
                              type="checkbox"
                              checked={settings.splineSettings.controls}
                              onChange={(e) => updateSettings({ 
                                splineSettings: { 
                                  ...settings.splineSettings, 
                                  controls: e.target.checked 
                                } 
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-7 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] lg:after:top-[2px] after:left-[1px] lg:after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                          </label>
                        </div>
                      </div>

                      {/* Preview Info - MOBILE OPTIMIZED */}
                      {(settings.splineSettings.sceneUrl || settings.splineSettings.embedCode) && (
                        <div className="mt-2 lg:mt-4 p-2 lg:p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-md lg:rounded-xl border border-cyan-200">
                          <div className="flex items-center gap-1.5 lg:gap-3">
                            <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-md lg:rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm lg:text-lg">🌐</span>
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-cyan-700">{t('preview.spline.configured')}</p>
                              <p className="text-xs lg:text-xs text-cyan-600 hidden lg:block">
                                {t('preview.spline.status')
                                  .replace('{position}', settings.splineSettings.position)
                                  .replace('{opacity}', Math.round(settings.splineSettings.opacity * 100).toString())
                                  .replace('{scale}', Math.round(settings.splineSettings.scale * 100).toString())}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modern Actions */}
          <div className="p-2 lg:p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="space-y-2 lg:space-y-4">
              <div className="flex gap-1.5 lg:gap-3">
                <button
                  onClick={saveSettings}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform lg:hover:scale-105 lg:hover:-translate-y-0.5 lg:active:scale-102 lg:active:translate-y-0 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-base min-h-[44px] touch-manipulation"
                >
                  <span className="text-sm lg:text-base">💾</span>
                  <span>{t('common.save')}</span>
                </button>
              </div>

              {/* Індикатор синхронізації */}
              <SyncButton className="w-full" />
              
            </div>
          </div>
        </div>

        {/* Preview Area - Hidden on Mobile */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-100 to-slate-200 p-8">
          <div className="h-full flex flex-col">
            {/* Device selector */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('intro.preview.title')}</h3>
                <p className="text-slate-600">{t('intro.preview.description')}</p>
              </div>
              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
                {[
                  { type: 'mobile' as DeviceType, icon: '📱', label: t('intro.device.mobile') },
                  { type: 'tablet' as DeviceType, icon: '📱', label: t('intro.device.tablet') },
                  { type: 'desktop' as DeviceType, icon: '💻', label: t('intro.device.desktop') }
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
                style={{ 
                  maxHeight: '65vh',
                  minHeight: '500px',
                  aspectRatio: deviceType === 'mobile' ? '9/16' : deviceType === 'tablet' ? '4/3' : '16/9'
                }}
              >
                {/* Real IntroScreen Preview */}
                <div className="w-full h-full relative">
                  <div 
                    className="w-full h-full relative overflow-hidden"
                    style={{
                      transform: `scale(${deviceType === 'mobile' ? '0.3' : deviceType === 'tablet' ? '0.5' : '0.6'}) translate(-50%, -50%)`,
                      transformOrigin: 'top left',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: deviceType === 'mobile' ? '333%' : deviceType === 'tablet' ? '200%' : '167%',
                      height: deviceType === 'mobile' ? '333%' : deviceType === 'tablet' ? '200%' : '167%'
                    }}
                  >
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
            mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.title') :
            mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.title') :
            mediaSelectorType === 'logo' ? t('media.selector.logo.title') :
            mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.title') :
            mediaSelectorType === 'hoverSound' ? t('media.selector.hover.sound.title') :
            t('media.selector.click.sound.title')
          }
          description={
            mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.description') :
            mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.description') :
            mediaSelectorType === 'logo' ? t('media.selector.logo.description') :
            mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.description') :
            mediaSelectorType === 'hoverSound' ? t('media.selector.hover.sound.description') :
            t('media.selector.click.sound.description')
          }
        />
      )}
    </>
  );
};

export default IntroCustomizer; 