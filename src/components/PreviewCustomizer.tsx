import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Smartphone, Monitor, Tablet, Palette, Music, Type, Image } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import WelcomeScreenPreview from './WelcomeScreenPreview';
import indexedDBService from '../services/IndexedDBService';
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

interface PreviewCustomizerProps {
  className?: string;
}

interface PreviewSettings {
  // Основний контент
  titleText: string;
  subtitleText: string;
  descriptionText: string;
  buttonText: string;
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
}

const defaultSettings: PreviewSettings = {
  // Основний контент
  titleText: "Ласкаво просимо",
  subtitleText: "до нашого бізнесу",
  descriptionText: "Ми створюємо неймовірні рішення для вашого успіху",
  buttonText: "Розпочати",
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
  animationSpeed: 'normal'
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'header' | 'design' | 'background' | 'audio';

const PreviewCustomizer: React.FC<PreviewCustomizerProps> = ({ className }) => {
  const [settings, setSettings] = useState<PreviewSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('header');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [activeTypographyElement, setActiveTypographyElement] = useState<'title' | 'subtitle' | 'description'>('title');
  
  // Refs removed - using MediaSelector instead
  
  // Smart Content Manager стан
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSelectorType, setMediaSelectorType] = useState<'backgroundImage' | 'backgroundVideo' | 'logo' | 'backgroundMusic' | 'hoverSound' | 'clickSound'>('backgroundImage');

  // Завантаження існуючих налаштувань при ініціалізації через IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 PreviewCustomizer: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        const indexedDBSettings = await indexedDBService.loadSettings('previewSettings');
        
        if (indexedDBSettings) {
          console.log('✅ PreviewCustomizer: Налаштування завантажено з IndexedDB');
          const safeSettings = {
            ...defaultSettings,
            ...indexedDBSettings,
            mobile: {
              ...defaultSettings.mobile,
              ...(indexedDBSettings.mobile || {})
            },
            tablet: {
              ...defaultSettings.tablet,
              ...(indexedDBSettings.tablet || {})
            },
            desktop: {
              ...defaultSettings.desktop,
              ...(indexedDBSettings.desktop || {})
            }
          };
          setSettings(safeSettings);
          
          // Синхронізуємо з WelcomeScreen форматом
          const welcomeSettings = {
            title: safeSettings.titleText,
            subtitle: safeSettings.subtitleText,
            description: safeSettings.descriptionText,
            buttonText: safeSettings.buttonText,
            hintText: "Тапніть щоб увійти та запустити музику",
            backgroundType: safeSettings.backgroundType,
            backgroundColor: safeSettings.backgroundColor,
            gradientFrom: safeSettings.gradientFrom,
            gradientTo: safeSettings.gradientTo,
            backgroundImage: safeSettings.backgroundImage,
            backgroundVideo: safeSettings.backgroundVideo,
            textColor: safeSettings.textColor,
            subtitleColor: safeSettings.textColor,
            descriptionColor: safeSettings.textColor,
            buttonColor: safeSettings.brandColor,
            buttonTextColor: '#ffffff',
            logoUrl: safeSettings.logoUrl,
            showLogo: !!safeSettings.logoUrl,
            hasMusic: safeSettings.audioSettings.backgroundMusic.enabled,
            musicUrl: safeSettings.audioSettings.backgroundMusic.url,
            musicVolume: safeSettings.audioSettings.backgroundMusic.volume,
            autoPlay: safeSettings.audioSettings.backgroundMusic.autoPlay,
            showParticles: safeSettings.showParticles,
            particleColor: safeSettings.particleColor,
            animationSpeed: safeSettings.animationSpeed
          };
          
          // Зберігаємо welcomeSettings через IndexedDB
          await indexedDBService.saveSettings('welcomeSettings', welcomeSettings, 'project');
        } else {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ PreviewCustomizer: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          const savedSettings = localStorage.getItem('previewSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('✅ PreviewCustomizer: Налаштування завантажено з localStorage');
            const safeSettings = {
              ...defaultSettings,
              ...parsed,
              mobile: {
                ...defaultSettings.mobile,
                ...(parsed.mobile || {})
              },
              tablet: {
                ...defaultSettings.tablet,
                ...(parsed.tablet || {})
              },
              desktop: {
                ...defaultSettings.desktop,
                ...(parsed.desktop || {})
              }
            };
            setSettings(safeSettings);
            
            // Мігруємо в IndexedDB
            console.log('🔄 PreviewCustomizer: Міграція налаштувань в IndexedDB...');
            await indexedDBService.saveSettings('previewSettings', safeSettings, 'project');
            console.log('✅ PreviewCustomizer: Міграція завершена');
            
            // Синхронізуємо з WelcomeScreen форматом
            const welcomeSettings = {
              title: safeSettings.titleText,
              subtitle: safeSettings.subtitleText,
              description: safeSettings.descriptionText,
              buttonText: safeSettings.buttonText,
              hintText: "Тапніть щоб увійти та запустити музику",
              backgroundType: safeSettings.backgroundType,
              backgroundColor: safeSettings.backgroundColor,
              gradientFrom: safeSettings.gradientFrom,
              gradientTo: safeSettings.gradientTo,
              backgroundImage: safeSettings.backgroundImage,
              backgroundVideo: safeSettings.backgroundVideo,
              textColor: safeSettings.textColor,
              subtitleColor: safeSettings.textColor,
              descriptionColor: safeSettings.textColor,
              buttonColor: safeSettings.brandColor,
              buttonTextColor: '#ffffff',
              logoUrl: safeSettings.logoUrl,
              showLogo: !!safeSettings.logoUrl,
              hasMusic: safeSettings.audioSettings.backgroundMusic.enabled,
              musicUrl: safeSettings.audioSettings.backgroundMusic.url,
              musicVolume: safeSettings.audioSettings.backgroundMusic.volume,
              autoPlay: safeSettings.audioSettings.backgroundMusic.autoPlay,
              showParticles: safeSettings.showParticles,
              particleColor: safeSettings.particleColor,
              animationSpeed: safeSettings.animationSpeed
            };
            
            // Зберігаємо welcomeSettings через IndexedDB
            await indexedDBService.saveSettings('welcomeSettings', welcomeSettings, 'project');
          }
        }
      } catch (error) {
        console.error('❌ PreviewCustomizer: Помилка завантаження налаштувань:', error);
        setSettings(defaultSettings);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = useCallback((updates: Partial<PreviewSettings>) => {
    setSyncStatus('syncing');
    
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    try {
      // Зберігаємо через IndexedDBService
      indexedDBService.saveSettings('previewSettings', newSettings, 'project').catch(error => {
        console.error('❌ PreviewCustomizer: Помилка збереження в IndexedDB:', error);
        // Резервне збереження в localStorage
        localStorage.setItem('previewSettings', JSON.stringify(newSettings));
      });
      
      // Конвертуємо та зберігаємо налаштування для WelcomeScreen
      const welcomeSettings = {
        title: newSettings.titleText,
        subtitle: newSettings.subtitleText,
        description: newSettings.descriptionText,
        buttonText: newSettings.buttonText,
        hintText: "Тапніть щоб увійти та запустити музику",
        backgroundType: newSettings.backgroundType,
        backgroundColor: newSettings.backgroundColor,
        gradientFrom: newSettings.gradientFrom,
        gradientTo: newSettings.gradientTo,
        backgroundImage: newSettings.backgroundImage,
        backgroundVideo: newSettings.backgroundVideo,
        textColor: newSettings.textColor,
        subtitleColor: newSettings.textColor,
        descriptionColor: newSettings.textColor,
        buttonColor: newSettings.brandColor,
        buttonTextColor: '#ffffff',
        logoUrl: newSettings.logoUrl,
        showLogo: !!newSettings.logoUrl,
        hasMusic: newSettings.audioSettings.backgroundMusic.enabled,
        musicUrl: newSettings.audioSettings.backgroundMusic.url,
        musicVolume: newSettings.audioSettings.backgroundMusic.volume,
        autoPlay: newSettings.audioSettings.backgroundMusic.autoPlay,
        showParticles: newSettings.showParticles,
        particleColor: newSettings.particleColor,
        animationSpeed: newSettings.animationSpeed
      };
      
      // Зберігаємо welcomeSettings через IndexedDBService
      indexedDBService.saveSettings('welcomeSettings', welcomeSettings, 'project').catch(error => {
        console.error('❌ PreviewCustomizer: Помилка збереження welcomeSettings в IndexedDB:', error);
        // Резервне збереження в localStorage
        localStorage.setItem('welcomeSettings', JSON.stringify(welcomeSettings));
      });
      
      // Відправляємо події для оновлення компонентів
      const syncEvent = new CustomEvent('previewSettingsUpdated', { detail: newSettings });
      window.dispatchEvent(syncEvent);
      const welcomeEvent = new CustomEvent('welcomeSettingsUpdated', { detail: welcomeSettings });
      window.dispatchEvent(welcomeEvent);
      
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 800);
      
    } catch (error) {
      setSyncStatus('idle');
    }
  }, [settings]);

  // Smart Content Manager функції
  const openMediaSelector = (type: 'backgroundImage' | 'backgroundVideo' | 'logo' | 'backgroundMusic' | 'hoverSound' | 'clickSound', acceptedTypes: ('image' | 'audio' | 'video')[]) => {
    setMediaSelectorType(type);
    setIsMediaSelectorOpen(true);
  };

  const handleMediaSelect = (file: FileItem) => {
    switch (mediaSelectorType) {
      case 'logo':
        updateSettings({ logoUrl: file.url });
        break;
      case 'backgroundImage':
        updateSettings({ backgroundImage: file.url });
        break;
      case 'backgroundVideo':
        updateSettings({ backgroundVideo: file.url });
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

  const getPreviewTextStyle = (element: 'title' | 'subtitle' | 'description') => {
    const adaptiveSettings = settings[deviceType];
    
    const baseStyle: React.CSSProperties = {
      color: settings.textColor,
      fontFamily: element === 'title' ? settings.titleFontFamily :
                  element === 'subtitle' ? settings.subtitleFontFamily :
                  settings.descriptionFontFamily,
      fontSize: element === 'title' ? `${adaptiveSettings.titleFontSize}px` :
               element === 'subtitle' ? `${adaptiveSettings.subtitleFontSize}px` :
               `${adaptiveSettings.descriptionFontSize}px`,
      fontWeight: element === 'title' ? settings.titleFontWeight :
                  element === 'subtitle' ? settings.subtitleFontWeight :
                  settings.descriptionFontWeight,
      fontStyle: element === 'title' ? settings.titleFontStyle :
                 element === 'subtitle' ? settings.subtitleFontStyle :
                 settings.descriptionFontStyle,
      marginBottom: element === 'title' ? `${adaptiveSettings.titleMarginBottom}px` :
                   element === 'subtitle' ? `${adaptiveSettings.subtitleMarginBottom}px` :
                   `${adaptiveSettings.descriptionMarginBottom}px`,
      lineHeight: element === 'title' ? adaptiveSettings.titleLineHeight :
                 element === 'subtitle' ? adaptiveSettings.subtitleLineHeight :
                 adaptiveSettings.descriptionLineHeight,
      letterSpacing: element === 'title' ? `${adaptiveSettings.titleLetterSpacing}px` :
                    element === 'subtitle' ? `${adaptiveSettings.subtitleLetterSpacing}px` :
                    `${adaptiveSettings.descriptionLetterSpacing}px`
    };

    const depth = element === 'title' ? settings.title3DDepth :
                  element === 'subtitle' ? settings.subtitle3DDepth :
                  settings.description3DDepth;
    
    const shadowIntensity = element === 'title' ? settings.titleShadowIntensity :
                           element === 'subtitle' ? settings.subtitleShadowIntensity :
                           settings.descriptionShadowIntensity;
    
    const shadowColor = element === 'title' ? settings.titleShadowColor :
                       element === 'subtitle' ? settings.subtitleShadowColor :
                       settings.descriptionShadowColor;

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };

    if (depth > 0) {
      const shadows = [];
      const maxLayers = Math.min(depth, 50);
      
      for (let i = 1; i <= maxLayers; i++) {
        const opacity = Math.max(0.05, shadowIntensity - (i * 0.015));
        const offsetX = Math.round(i * 0.5);
        const offsetY = Math.round(i * 0.5);
        shadows.push(`${offsetX}px ${offsetY}px 0px rgba(${hexToRgb(shadowColor)}, ${opacity})`);
      }
      
      if (shadowIntensity > 0) {
        shadows.push(`${Math.round(depth * 0.8)}px ${Math.round(depth * 0.8)}px ${Math.round(depth * 0.3)}px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity * 0.3})`);
      }
      
      baseStyle.textShadow = shadows.join(', ');
      baseStyle.transform = `translateZ(${depth}px)`;
    } else if (shadowIntensity > 0) {
      baseStyle.textShadow = `2px 2px 8px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity}), 0 0 16px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity * 0.5})`;
    }

    return baseStyle;
  };

  const getPreviewAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? settings.titleAnimation :
                          element === 'subtitle' ? settings.subtitleAnimation :
                          settings.descriptionAnimation;

    const duration = settings.animationDuration / 1000;
    const delay = settings.animationDelay / 1000;

    const enterVariants: any = {
      none: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      fadeIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideUp: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideDown: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideLeft: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideRight: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      zoomIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      zoomOut: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      rotateIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      bounce: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      typewriter: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      glow: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
    };

    const initialVariants: any = {
      none: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      fadeIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
      slideUp: { opacity: 0, x: 0, y: 50, scale: 1, rotate: 0 },
      slideDown: { opacity: 0, x: 0, y: -50, scale: 1, rotate: 0 },
      slideLeft: { opacity: 0, x: 50, y: 0, scale: 1, rotate: 0 },
      slideRight: { opacity: 0, x: -50, y: 0, scale: 1, rotate: 0 },
      zoomIn: { opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 0 },
      zoomOut: { opacity: 0, x: 0, y: 0, scale: 1.5, rotate: 0 },
      rotateIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: -180 },
      bounce: { opacity: 0, x: 0, y: -100, scale: 1, rotate: 0 },
      typewriter: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      glow: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
    };

    return {
      initial: initialVariants[enterAnimation],
      animate: enterVariants[enterAnimation],
      transition: {
        duration,
        delay: delay * (element === 'title' ? 0 : element === 'subtitle' ? 1 : 2),
        type: enterAnimation === 'bounce' ? 'spring' : 'tween',
        stiffness: enterAnimation === 'bounce' ? 300 : undefined,
        damping: enterAnimation === 'bounce' ? 20 : undefined
      }
    };
  };

  const getPreviewElementKey = (element: 'title' | 'subtitle' | 'description') => {
    const adaptiveSettings = settings[deviceType];
    
    const baseText = element === 'title' ? settings.titleText : 
                    element === 'subtitle' ? settings.subtitleText : 
                    settings.descriptionText;
    
    const fontSettings = element === 'title' ? 
      `${settings.titleFontFamily}-${settings.titleFontWeight}-${settings.titleFontStyle}` :
      element === 'subtitle' ?
      `${settings.subtitleFontFamily}-${settings.subtitleFontWeight}-${settings.subtitleFontStyle}` :
      `${settings.descriptionFontFamily}-${settings.descriptionFontWeight}-${settings.descriptionFontStyle}`;
    
    const animationSettings = element === 'title' ?
      `${settings.titleAnimation}-${settings.titleExitAnimation}` :
      element === 'subtitle' ?
      `${settings.subtitleAnimation}-${settings.subtitleExitAnimation}` :
      `${settings.descriptionAnimation}-${settings.descriptionExitAnimation}`;
    
    const shadowSettings = element === 'title' ?
      `${settings.title3DDepth}-${settings.titleShadowIntensity}-${settings.titleShadowColor}` :
      element === 'subtitle' ?
      `${settings.subtitle3DDepth}-${settings.subtitleShadowIntensity}-${settings.subtitleShadowColor}` :
      `${settings.description3DDepth}-${settings.descriptionShadowIntensity}-${settings.descriptionShadowColor}`;
    
    const adaptiveKey = element === 'title' ?
      `${adaptiveSettings.titleFontSize}-${adaptiveSettings.titleMarginBottom}-${adaptiveSettings.titleLineHeight}-${adaptiveSettings.titleLetterSpacing}` :
      element === 'subtitle' ?
      `${adaptiveSettings.subtitleFontSize}-${adaptiveSettings.subtitleMarginBottom}-${adaptiveSettings.subtitleLineHeight}-${adaptiveSettings.subtitleLetterSpacing}` :
      `${adaptiveSettings.descriptionFontSize}-${adaptiveSettings.descriptionMarginBottom}-${adaptiveSettings.descriptionLineHeight}-${adaptiveSettings.descriptionLetterSpacing}`;
    
    const globalAnimationSettings = `${settings.animationDuration}-${settings.animationDelay}`;
    
    const fullKey = `${baseText}-${fontSettings}-${animationSettings}-${shadowSettings}-${adaptiveKey}-${globalAnimationSettings}-${deviceType}-${settings.textColor}`;
    
    return `preview-${element}-${fullKey}`;
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

  const saveSettings = async () => {
    try {
      console.log('💾 PreviewCustomizer: Збереження налаштувань через IndexedDBService...');
      
      // Зберігаємо налаштування для PreviewCustomizer через IndexedDB
      await indexedDBService.saveSettings('previewSettings', settings, 'project');
      
      // Конвертуємо та зберігаємо налаштування для WelcomeScreen
      const welcomeSettings = {
        title: settings.titleText,
        subtitle: settings.subtitleText,
        description: settings.descriptionText,
        buttonText: settings.buttonText,
        hintText: "Тапніть щоб увійти та запустити музику",
        backgroundType: settings.backgroundType,
        backgroundColor: settings.backgroundColor,
        gradientFrom: settings.gradientFrom,
        gradientTo: settings.gradientTo,
        backgroundImage: settings.backgroundImage,
        backgroundVideo: settings.backgroundVideo,
        textColor: settings.textColor,
        subtitleColor: settings.textColor,
        descriptionColor: settings.textColor,
        buttonColor: settings.brandColor,
        buttonTextColor: '#ffffff',
        logoUrl: settings.logoUrl,
        showLogo: !!settings.logoUrl,
        hasMusic: settings.audioSettings.backgroundMusic.enabled,
        musicUrl: settings.audioSettings.backgroundMusic.url,
        musicVolume: settings.audioSettings.backgroundMusic.volume,
        autoPlay: settings.audioSettings.backgroundMusic.autoPlay,
        showParticles: settings.showParticles,
        particleColor: settings.particleColor,
        animationSpeed: settings.animationSpeed
      };
      
      // Зберігаємо welcomeSettings через IndexedDB
      await indexedDBService.saveSettings('welcomeSettings', welcomeSettings, 'project');
      
      console.log('✅ PreviewCustomizer: Налаштування збережено успішно');
      
      // Відправляємо події для оновлення компонентів
      window.dispatchEvent(new CustomEvent('previewSettingsUpdated', { detail: settings }));
      window.dispatchEvent(new CustomEvent('welcomeSettingsUpdated', { detail: welcomeSettings }));
      
      alert('Налаштування збережено!');
    } catch (error) {
      console.error('❌ PreviewCustomizer: Помилка збереження:', error);
      
      // Резервне збереження в localStorage
      localStorage.setItem('previewSettings', JSON.stringify(settings));
      
      const welcomeSettings = {
        title: settings.titleText,
        subtitle: settings.subtitleText,
        description: settings.descriptionText,
        buttonText: settings.buttonText,
        hintText: "Тапніть щоб увійти та запустити музику",
        backgroundType: settings.backgroundType,
        backgroundColor: settings.backgroundColor,
        gradientFrom: settings.gradientFrom,
        gradientTo: settings.gradientTo,
        backgroundImage: settings.backgroundImage,
        backgroundVideo: settings.backgroundVideo,
        textColor: settings.textColor,
        subtitleColor: settings.textColor,
        descriptionColor: settings.textColor,
        buttonColor: settings.brandColor,
        buttonTextColor: '#ffffff',
        logoUrl: settings.logoUrl,
        showLogo: !!settings.logoUrl,
        hasMusic: settings.audioSettings.backgroundMusic.enabled,
        musicUrl: settings.audioSettings.backgroundMusic.url,
        musicVolume: settings.audioSettings.backgroundMusic.volume,
        autoPlay: settings.audioSettings.backgroundMusic.autoPlay,
        showParticles: settings.showParticles,
        particleColor: settings.particleColor,
        animationSpeed: settings.animationSpeed
      };
      
      localStorage.setItem('welcomeSettings', JSON.stringify(welcomeSettings));
      
      // Відправляємо події для оновлення компонентів
      window.dispatchEvent(new CustomEvent('previewSettingsUpdated', { detail: settings }));
      window.dispatchEvent(new CustomEvent('welcomeSettingsUpdated', { detail: welcomeSettings }));
      
      alert('Налаштування збережено (резервно)!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'preview-settings.json';
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

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Sidebar with controls */}
      <div className="w-96 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-xl">
        {/* Modern Header */}
        <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Конструктор Превью</h2>
              <p className="text-blue-100 text-sm">Створіть персоналізовану превью-обгортку</p>
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
            { id: 'design', label: 'Стиль', icon: '🎨', color: 'pink' },
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
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    📚 {settings.logoUrl ? 'Змінити логотип' : 'Вибрати з медіа-бібліотеки'}
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
                    <p className="text-sm text-slate-600">Основний текст превью сторінки</p>
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
                      value={settings.titleText}
                      onChange={(e) => updateSettings({ titleText: e.target.value })}
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
                      value={settings.subtitleText}
                      onChange={(e) => updateSettings({ subtitleText: e.target.value })}
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
                      value={settings.descriptionText}
                      onChange={(e) => updateSettings({ descriptionText: e.target.value })}
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
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Тіні та ефекти</h3>
                    <p className="text-sm text-slate-600">Додайте глибину вашому тексту</p>
                  </div>
                </div>
                
                {/* Переключення між елементами */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-4">Оберіть елемент для ефектів:</label>
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

                {/* Спільні налаштування ефектів для обраного елемента */}
                <div className="bg-white/60 rounded-xl p-5 border border-violet-100">
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
                    {/* Інтенсивність тіні */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-3">
                        Інтенсивність тіні: {
                          activeTypographyElement === 'title' ? settings.titleShadowIntensity :
                          activeTypographyElement === 'subtitle' ? settings.subtitleShadowIntensity :
                          settings.descriptionShadowIntensity
                        }
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={
                          activeTypographyElement === 'title' ? settings.titleShadowIntensity :
                          activeTypographyElement === 'subtitle' ? settings.subtitleShadowIntensity :
                          settings.descriptionShadowIntensity
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (activeTypographyElement === 'title') {
                            updateSettings({ titleShadowIntensity: value });
                          } else if (activeTypographyElement === 'subtitle') {
                            updateSettings({ subtitleShadowIntensity: value });
                          } else {
                            updateSettings({ descriptionShadowIntensity: value });
                          }
                        }}
                        className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider"
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
                            if (activeTypographyElement === 'title') {
                              updateSettings({ titleShadowColor: e.target.value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ subtitleShadowColor: e.target.value });
                            } else {
                              updateSettings({ descriptionShadowColor: e.target.value });
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
                            if (activeTypographyElement === 'title') {
                              updateSettings({ titleShadowColor: e.target.value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ subtitleShadowColor: e.target.value });
                            } else {
                              updateSettings({ descriptionShadowColor: e.target.value });
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>

                    {/* 3D глибина */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-3">
                        3D глибина: {
                          activeTypographyElement === 'title' ? settings.title3DDepth :
                          activeTypographyElement === 'subtitle' ? settings.subtitle3DDepth :
                          settings.description3DDepth
                        }
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
                        className="w-full h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Анімації тексту - ШОСТИЙ БЛОК */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Анімації тексту</h3>
                    <p className="text-sm text-slate-600">Додайте динаміку вашому тексту</p>
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

                {/* Спільні налаштування анімації для обраного елемента */}
                <div className="bg-white/60 rounded-xl p-5 border border-cyan-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-4 h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-semibold text-slate-800">
                      Анімація для: {
                        activeTypographyElement === 'title' ? 'Заголовка' :
                        activeTypographyElement === 'subtitle' ? 'Підзаголовка' : 'Опису'
                      }
                    </h4>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Анімація входу */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-3">Анімація входу</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'none', label: 'Без анімації', icon: '⚪' },
                          { value: 'fadeIn', label: 'Поява', icon: '🌅' },
                          { value: 'slideUp', label: 'Знизу', icon: '⬆️' },
                          { value: 'slideDown', label: 'Зверху', icon: '⬇️' },
                          { value: 'slideLeft', label: 'Справа', icon: '⬅️' },
                          { value: 'slideRight', label: 'Зліва', icon: '➡️' },
                          { value: 'zoomIn', label: 'Збільшення', icon: '🔍' },
                          { value: 'rotateIn', label: 'Обертання', icon: '🔄' },
                          { value: 'bounce', label: 'Підскок', icon: '⚡' },
                          { value: 'typewriter', label: 'Друкарська', icon: '⌨️' },
                          { value: 'glow', label: 'Світіння', icon: '💫' }
                        ].map((animation) => {
                          const currentAnimation = activeTypographyElement === 'title' ? settings.titleAnimation :
                                                 activeTypographyElement === 'subtitle' ? settings.subtitleAnimation :
                                                 settings.descriptionAnimation;
                          
                          return (
                            <button
                              key={animation.value}
                              onClick={() => {
                                if (activeTypographyElement === 'title') {
                                  updateSettings({ titleAnimation: animation.value as PreviewSettings['titleAnimation'] });
                                } else if (activeTypographyElement === 'subtitle') {
                                  updateSettings({ subtitleAnimation: animation.value as PreviewSettings['subtitleAnimation'] });
                                } else {
                                  updateSettings({ descriptionAnimation: animation.value as PreviewSettings['descriptionAnimation'] });
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 text-xs ${
                                currentAnimation === animation.value
                                  ? 'border-cyan-500 bg-cyan-100 text-cyan-700'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60'
                              }`}
                            >
                              <div className="text-lg mb-1">{animation.icon}</div>
                              <div className="text-xs font-semibold leading-tight">{animation.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Загальні налаштування анімації */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-4">Налаштування анімації</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Тривалість: {settings.animationDuration}мс
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="3000"
                            step="100"
                            value={settings.animationDuration}
                            onChange={(e) => updateSettings({ animationDuration: parseInt(e.target.value) })}
                            className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-2">
                            Затримка: {settings.animationDelay}мс
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            step="100"
                            value={settings.animationDelay}
                            onChange={(e) => updateSettings({ animationDelay: parseInt(e.target.value) })}
                            className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider"
                          />
                        </div>
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
                      Основний колір
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
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
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
                        className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Текстовий колір
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
                        className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* Тип фону */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">🌅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Фон сторінки</h3>
                    <p className="text-sm text-slate-600">Оберіть тип та налаштуйте фон</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Вибір типу фону */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-4">Тип фону</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { type: 'color', label: 'Колір', icon: '🎨' },
                        { type: 'gradient', label: 'Градієнт', icon: '🌈' },
                        { type: 'image', label: 'Зображення', icon: '🖼️' },
                        { type: 'video', label: 'Відео', icon: '🎬' }
                      ].map((bgType) => (
                        <button
                          key={bgType.type}
                          onClick={() => updateSettings({ backgroundType: bgType.type as PreviewSettings['backgroundType'] })}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            settings.backgroundType === bgType.type
                              ? 'border-indigo-500 bg-indigo-100 text-indigo-700 shadow-lg scale-105'
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-2xl mb-2">{bgType.icon}</div>
                          <div className="text-sm font-semibold">{bgType.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування для кольору */}
                  {settings.backgroundType === 'color' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Колір фону</label>
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
                          className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* Налаштування для градієнта */}
                  {settings.backgroundType === 'gradient' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Початковий колір</label>
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
                            className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Кінцевий колір</label>
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
                            className="flex-1 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Налаштування для зображення */}
                  {settings.backgroundType === 'image' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Фонове зображення</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundImage', ['image'])}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          📚 {settings.backgroundImage ? 'Змінити зображення' : 'Вибрати з медіа-бібліотеки'}
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
                    </div>
                  )}

                  {/* Налаштування для відео */}
                  {settings.backgroundType === 'video' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Фонове відео</label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundVideo', ['video'])}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                          📚 {settings.backgroundVideo ? 'Змінити відео' : 'Вибрати з медіа-бібліотеки'}
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
                    </div>
                  )}
                </div>
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
                    <p className="text-sm text-slate-600">Додайте музичний супровід</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Увімкнути фонову музику</label>
                    <button
                      onClick={() => updateSettings({ 
                        audioSettings: { 
                          ...settings.audioSettings, 
                          backgroundMusic: { 
                            ...settings.audioSettings.backgroundMusic, 
                            enabled: !settings.audioSettings.backgroundMusic.enabled 
                          } 
                        } 
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.audioSettings.backgroundMusic.enabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.audioSettings.backgroundMusic.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.audioSettings.backgroundMusic.enabled && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">Аудіо файл</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => openMediaSelector('backgroundMusic', ['audio'])}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                          >
                            📚 {settings.audioSettings.backgroundMusic.url ? 'Змінити музику' : 'Вибрати з медіа-бібліотеки'}
                          </button>
                          {settings.audioSettings.backgroundMusic.url && (
                            <button
                              onClick={() => updateSettings({ 
                                audioSettings: { 
                                  ...settings.audioSettings, 
                                  backgroundMusic: { 
                                    ...settings.audioSettings.backgroundMusic, 
                                    url: '' 
                                  } 
                                } 
                              })}
                              className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
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

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Зациклити</label>
                        <button
                          onClick={() => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              backgroundMusic: { 
                                ...settings.audioSettings.backgroundMusic, 
                                loop: !settings.audioSettings.backgroundMusic.loop 
                              } 
                            } 
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.audioSettings.backgroundMusic.loop ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.audioSettings.backgroundMusic.loop ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700">Автовідтворення</label>
                        <button
                          onClick={() => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              backgroundMusic: { 
                                ...settings.audioSettings.backgroundMusic, 
                                autoPlay: !settings.audioSettings.backgroundMusic.autoPlay 
                              } 
                            } 
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.audioSettings.backgroundMusic.autoPlay ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.audioSettings.backgroundMusic.autoPlay ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Actions */}
        <div className="p-8 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={saveSettings}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💾 Зберегти
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
              <p className="text-slate-600">Перегляньте як виглядатиме ваша превью сторінка</p>
            </div>
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              {[
                { type: 'mobile', icon: '📱', label: 'Мобільний' },
                { type: 'tablet', icon: '📟', label: 'Планшет' },
                { type: 'desktop', icon: '💻', label: 'Комп\'ютер' }
              ].map((device) => (
                <button
                  key={device.type}
                  onClick={() => setDeviceType(device.type as DeviceType)}
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
              {/* Real WelcomeScreen Preview */}
              <div className="w-full h-full relative">
                <div className="w-full h-full relative overflow-hidden">
                  <WelcomeScreenPreview />
                </div>
                
                {/* Overlay to prevent interaction */}
                <div className="absolute inset-0 bg-transparent pointer-events-none z-10" />
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
            mediaSelectorType === 'logo' || mediaSelectorType === 'backgroundImage' ? ['image'] :
            mediaSelectorType === 'backgroundVideo' ? ['video'] :
            ['audio']
          }
          title={
            mediaSelectorType === 'logo' ? 'Вибрати логотип' :
            mediaSelectorType === 'backgroundImage' ? 'Вибрати фонове зображення' :
            mediaSelectorType === 'backgroundVideo' ? 'Вибрати фонове відео' :
            'Вибрати аудіо файл'
          }
          description={
            mediaSelectorType === 'logo' ? 'Оберіть логотип для превью сторінки' :
            mediaSelectorType === 'backgroundImage' ? 'Оберіть зображення для фону превью' :
            mediaSelectorType === 'backgroundVideo' ? 'Оберіть відео для фону превью' :
            'Оберіть аудіо файл для звукових ефектів'
          }
        />
      )}
    </div>
  );
};

export default PreviewCustomizer; 