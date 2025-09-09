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
  logoSize: number; // Розмір логотипа в пікселях
  
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
      singlePlay: boolean;
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

const defaultSettings: PreviewSettings = {
  // Основний контент
  titleText: "",
  subtitleText: "",
  descriptionText: "",
  buttonText: "",
  logoUrl: "",
  logoSize: 96, // Розмір логотипа за замовчуванням
  
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
      autoPlay: false,
      singlePlay: false
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
  
  // 3D Анімації (Spline) - контролюється конструктором
  splineSettings: undefined             // 🌐 Контролюється конструктором!
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'header' | 'design' | 'background' | 'audio' | '3d';

const PreviewCustomizer: React.FC<PreviewCustomizerProps> = ({ className }) => {
  const { t } = useTranslation();
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
            },
            splineSettings: {
              ...defaultSettings.splineSettings,
              ...(indexedDBSettings.splineSettings || {})
            }
          };
          setSettings(safeSettings);
          
          // 🔄 АВТОМАТИЧНА СИНХРОНІЗАЦІЯ ПРИ ЗАВАНТАЖЕННІ!
          // Конвертуємо та зберігаємо налаштування для WelcomeScreenPreview
          const adaptiveSettings = safeSettings[deviceType];
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
            logoSize: safeSettings.logoSize,
            showLogo: !!safeSettings.logoUrl,
            hasMusic: safeSettings.audioSettings.backgroundMusic.enabled,
            musicUrl: safeSettings.audioSettings.backgroundMusic.url,
            musicVolume: safeSettings.audioSettings.backgroundMusic.volume,
            musicLoop: safeSettings.audioSettings.backgroundMusic.loop,
            autoPlay: safeSettings.audioSettings.backgroundMusic.autoPlay,
            showParticles: safeSettings.showParticles,
            particleColor: safeSettings.particleColor,
            animationSpeed: safeSettings.animationSpeed,
            // Налаштування типографіки
            titleFontSize: adaptiveSettings.titleFontSize,
            subtitleFontSize: adaptiveSettings.subtitleFontSize,
            descriptionFontSize: adaptiveSettings.descriptionFontSize,
            titleFontFamily: safeSettings.titleFontFamily,
            subtitleFontFamily: safeSettings.subtitleFontFamily,
            descriptionFontFamily: safeSettings.descriptionFontFamily,
            titleFontWeight: safeSettings.titleFontWeight,
            subtitleFontWeight: safeSettings.subtitleFontWeight,
            descriptionFontWeight: safeSettings.descriptionFontWeight,
            titleFontStyle: safeSettings.titleFontStyle,
            subtitleFontStyle: safeSettings.subtitleFontStyle,
            descriptionFontStyle: safeSettings.descriptionFontStyle,
            // Налаштування анімацій
            titleAnimation: safeSettings.titleAnimation,
            subtitleAnimation: safeSettings.subtitleAnimation,
            descriptionAnimation: safeSettings.descriptionAnimation,
            titleExitAnimation: safeSettings.titleExitAnimation,
            subtitleExitAnimation: safeSettings.subtitleExitAnimation,
            descriptionExitAnimation: safeSettings.descriptionExitAnimation,
            animationDuration: safeSettings.animationDuration,
            animationDelay: safeSettings.animationDelay,
            // Налаштування тіней
            titleShadowIntensity: safeSettings.titleShadowIntensity,
            subtitleShadowIntensity: safeSettings.subtitleShadowIntensity,
            descriptionShadowIntensity: safeSettings.descriptionShadowIntensity,
            titleShadowColor: safeSettings.titleShadowColor,
            subtitleShadowColor: safeSettings.subtitleShadowColor,
            descriptionShadowColor: safeSettings.descriptionShadowColor,
            title3DDepth: safeSettings.title3DDepth,
            subtitle3DDepth: safeSettings.subtitle3DDepth,
            description3DDepth: safeSettings.description3DDepth,
            // 3D налаштування
            splineSettings: safeSettings.splineSettings
          };
          
          // Зберігаємо конвертовані налаштування для WelcomeScreenPreview
          await indexedDBService.saveSettings('welcomeSettings', welcomeSettings, 'project');
          console.log('🔄 PreviewCustomizer: Налаштування синхронізовано з WelcomeScreenPreview при завантаженні');
          
          // Синхронізуємо з WelcomeScreen форматом
          const welcomeEvent = {
            title: safeSettings.titleText,
            subtitle: safeSettings.subtitleText,
            description: safeSettings.descriptionText,
            buttonText: safeSettings.buttonText,
            hintText: "Tap to enter and start music",
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
            animationSpeed: safeSettings.animationSpeed,
            // Додаємо налаштування анімацій
            titleAnimation: safeSettings.titleAnimation,
            subtitleAnimation: safeSettings.subtitleAnimation,
            descriptionAnimation: safeSettings.descriptionAnimation,
            titleExitAnimation: safeSettings.titleExitAnimation,
            subtitleExitAnimation: safeSettings.subtitleExitAnimation,
            descriptionExitAnimation: safeSettings.descriptionExitAnimation,
            animationDuration: safeSettings.animationDuration,
            animationDelay: safeSettings.animationDelay,
            // Додаємо налаштування тіней та ефектів
            titleShadowIntensity: safeSettings.titleShadowIntensity,
            subtitleShadowIntensity: safeSettings.subtitleShadowIntensity,
            descriptionShadowIntensity: safeSettings.descriptionShadowIntensity,
            titleShadowColor: safeSettings.titleShadowColor,
            subtitleShadowColor: safeSettings.subtitleShadowColor,
            descriptionShadowColor: safeSettings.descriptionShadowColor,
            title3DDepth: safeSettings.title3DDepth,
            subtitle3DDepth: safeSettings.subtitle3DDepth,
            description3DDepth: safeSettings.description3DDepth,
            splineSettings: safeSettings.splineSettings
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
              },
              splineSettings: {
                ...defaultSettings.splineSettings,
                ...(parsed.splineSettings || {})
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
              hintText: "Tap to enter and start music",
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
              animationSpeed: safeSettings.animationSpeed,
              // Додаємо налаштування анімацій
              titleAnimation: safeSettings.titleAnimation,
              subtitleAnimation: safeSettings.subtitleAnimation,
              descriptionAnimation: safeSettings.descriptionAnimation,
              titleExitAnimation: safeSettings.titleExitAnimation,
              subtitleExitAnimation: safeSettings.subtitleExitAnimation,
              descriptionExitAnimation: safeSettings.descriptionExitAnimation,
              animationDuration: safeSettings.animationDuration,
              animationDelay: safeSettings.animationDelay,
              // Додаємо налаштування тіней та ефектів
              titleShadowIntensity: safeSettings.titleShadowIntensity,
              subtitleShadowIntensity: safeSettings.subtitleShadowIntensity,
              descriptionShadowIntensity: safeSettings.descriptionShadowIntensity,
              titleShadowColor: safeSettings.titleShadowColor,
              subtitleShadowColor: safeSettings.subtitleShadowColor,
              descriptionShadowColor: safeSettings.descriptionShadowColor,
              title3DDepth: safeSettings.title3DDepth,
              subtitle3DDepth: safeSettings.subtitle3DDepth,
              description3DDepth: safeSettings.description3DDepth,
              splineSettings: safeSettings.splineSettings
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
    console.log('🔧 PreviewCustomizer: updateSettings called with:', updates);
    setSyncStatus('syncing');
    
    const newSettings = { ...settings, ...updates };
    console.log('🔧 PreviewCustomizer: newSettings splineSettings:', newSettings.splineSettings);
    setSettings(newSettings);
    
    try {
      // Зберігаємо через IndexedDBService
      indexedDBService.saveSettings('previewSettings', newSettings, 'project').catch(error => {
        console.error('❌ PreviewCustomizer: Помилка збереження в IndexedDB:', error);
        // Резервне збереження в localStorage
        localStorage.setItem('previewSettings', JSON.stringify(newSettings));
      });
      
      // Конвертуємо та зберігаємо налаштування для WelcomeScreen
      const adaptiveSettings = newSettings[deviceType]; // Використовуємо налаштування для поточного пристрою
      const welcomeSettings = {
        title: newSettings.titleText,
        subtitle: newSettings.subtitleText,
        description: newSettings.descriptionText,
        buttonText: newSettings.buttonText,
        hintText: "Tap to enter and start music",
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
        logoSize: newSettings.logoSize,
        showLogo: true, // Завжди показуємо блок з заголовком/логотипом
        hasMusic: newSettings.audioSettings.backgroundMusic.enabled,
        musicUrl: newSettings.audioSettings.backgroundMusic.url,
        musicVolume: newSettings.audioSettings.backgroundMusic.volume,
        musicLoop: newSettings.audioSettings.backgroundMusic.loop,
        autoPlay: newSettings.audioSettings.backgroundMusic.autoPlay,
        showParticles: newSettings.showParticles,
        particleColor: newSettings.particleColor,
        animationSpeed: newSettings.animationSpeed,
        // Додаємо налаштування анімацій
        titleAnimation: newSettings.titleAnimation,
        subtitleAnimation: newSettings.subtitleAnimation,
        descriptionAnimation: newSettings.descriptionAnimation,
        titleExitAnimation: newSettings.titleExitAnimation,
        subtitleExitAnimation: newSettings.subtitleExitAnimation,
        descriptionExitAnimation: newSettings.descriptionExitAnimation,
        animationDuration: newSettings.animationDuration,
        animationDelay: newSettings.animationDelay,
        // Typography settings based on current device
        titleFontSize: adaptiveSettings.titleFontSize,
        subtitleFontSize: adaptiveSettings.subtitleFontSize,
        descriptionFontSize: adaptiveSettings.descriptionFontSize,
        titleFontFamily: newSettings.titleFontFamily,
        subtitleFontFamily: newSettings.subtitleFontFamily,
        descriptionFontFamily: newSettings.descriptionFontFamily,
        titleFontWeight: newSettings.titleFontWeight,
        subtitleFontWeight: newSettings.subtitleFontWeight,
        descriptionFontWeight: newSettings.descriptionFontWeight,
        titleFontStyle: newSettings.titleFontStyle,
        subtitleFontStyle: newSettings.subtitleFontStyle,
        descriptionFontStyle: newSettings.descriptionFontStyle,
        // Додаємо налаштування тіней та ефектів
        titleShadowIntensity: newSettings.titleShadowIntensity,
        subtitleShadowIntensity: newSettings.subtitleShadowIntensity,
        descriptionShadowIntensity: newSettings.descriptionShadowIntensity,
        titleShadowColor: newSettings.titleShadowColor,
        subtitleShadowColor: newSettings.subtitleShadowColor,
        descriptionShadowColor: newSettings.descriptionShadowColor,
        title3DDepth: newSettings.title3DDepth,
        subtitle3DDepth: newSettings.subtitle3DDepth,
        description3DDepth: newSettings.description3DDepth,
        splineSettings: newSettings.splineSettings
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
      console.log('📤 PreviewCustomizer: Dispatching welcomeSettingsUpdated with splineSettings:', welcomeSettings.splineSettings);
      console.log('📤 PreviewCustomizer: Dispatching welcomeSettingsUpdated with animations:', {
        titleAnimation: welcomeSettings.titleAnimation,
        subtitleAnimation: welcomeSettings.subtitleAnimation,
        descriptionAnimation: welcomeSettings.descriptionAnimation,
        animationDuration: welcomeSettings.animationDuration,
        animationDelay: welcomeSettings.animationDelay
      });
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
      const adaptiveSettings = settings[deviceType]; // Використовуємо налаштування для поточного пристрою
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
        logoSize: settings.logoSize,
        showLogo: !!settings.logoUrl,
        hasMusic: settings.audioSettings.backgroundMusic.enabled,
        musicUrl: settings.audioSettings.backgroundMusic.url,
        musicVolume: settings.audioSettings.backgroundMusic.volume,
        musicLoop: settings.audioSettings.backgroundMusic.loop,
        autoPlay: settings.audioSettings.backgroundMusic.autoPlay,
        showParticles: settings.showParticles,
        particleColor: settings.particleColor,
        animationSpeed: settings.animationSpeed,
        // Додаємо налаштування анімацій
        titleAnimation: settings.titleAnimation,
        subtitleAnimation: settings.subtitleAnimation,
        descriptionAnimation: settings.descriptionAnimation,
        titleExitAnimation: settings.titleExitAnimation,
        subtitleExitAnimation: settings.subtitleExitAnimation,
        descriptionExitAnimation: settings.descriptionExitAnimation,
        animationDuration: settings.animationDuration,
        animationDelay: settings.animationDelay,
        // Typography settings based on current device
        titleFontSize: adaptiveSettings.titleFontSize,
        subtitleFontSize: adaptiveSettings.subtitleFontSize,
        descriptionFontSize: adaptiveSettings.descriptionFontSize,
        titleFontFamily: settings.titleFontFamily,
        subtitleFontFamily: settings.subtitleFontFamily,
        descriptionFontFamily: settings.descriptionFontFamily,
        titleFontWeight: settings.titleFontWeight,
        subtitleFontWeight: settings.subtitleFontWeight,
        descriptionFontWeight: settings.descriptionFontWeight,
        titleFontStyle: settings.titleFontStyle,
        subtitleFontStyle: settings.subtitleFontStyle,
        descriptionFontStyle: settings.descriptionFontStyle,
        // Додаємо налаштування тіней та ефектів
        titleShadowIntensity: settings.titleShadowIntensity,
        subtitleShadowIntensity: settings.subtitleShadowIntensity,
        descriptionShadowIntensity: settings.descriptionShadowIntensity,
        titleShadowColor: settings.titleShadowColor,
        subtitleShadowColor: settings.subtitleShadowColor,
        descriptionShadowColor: settings.descriptionShadowColor,
        title3DDepth: settings.title3DDepth,
        subtitle3DDepth: settings.subtitle3DDepth,
        description3DDepth: settings.description3DDepth,
        splineSettings: settings.splineSettings
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
      
      const adaptiveSettings = settings[deviceType]; // Використовуємо налаштування для поточного пристрою
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
        logoSize: settings.logoSize,
        showLogo: true, // Завжди показуємо блок з заголовком/логотипом (в catch блоці)
        hasMusic: settings.audioSettings.backgroundMusic.enabled,
        musicUrl: settings.audioSettings.backgroundMusic.url,
        musicVolume: settings.audioSettings.backgroundMusic.volume,
        musicLoop: settings.audioSettings.backgroundMusic.loop,
        autoPlay: settings.audioSettings.backgroundMusic.autoPlay,
        showParticles: settings.showParticles,
        particleColor: settings.particleColor,
        animationSpeed: settings.animationSpeed,
        // Додаємо налаштування анімацій
        titleAnimation: settings.titleAnimation,
        subtitleAnimation: settings.subtitleAnimation,
        descriptionAnimation: settings.descriptionAnimation,
        titleExitAnimation: settings.titleExitAnimation,
        subtitleExitAnimation: settings.subtitleExitAnimation,
        descriptionExitAnimation: settings.descriptionExitAnimation,
        animationDuration: settings.animationDuration,
        animationDelay: settings.animationDelay,
        // Typography settings based on current device
        titleFontSize: adaptiveSettings.titleFontSize,
        subtitleFontSize: adaptiveSettings.subtitleFontSize,
        descriptionFontSize: adaptiveSettings.descriptionFontSize,
        titleFontFamily: settings.titleFontFamily,
        subtitleFontFamily: settings.subtitleFontFamily,
        descriptionFontFamily: settings.descriptionFontFamily,
        titleFontWeight: settings.titleFontWeight,
        subtitleFontWeight: settings.subtitleFontWeight,
        descriptionFontWeight: settings.descriptionFontWeight,
        titleFontStyle: settings.titleFontStyle,
        subtitleFontStyle: settings.subtitleFontStyle,
        descriptionFontStyle: settings.descriptionFontStyle,
        // Додаємо налаштування тіней та ефектів
        titleShadowIntensity: settings.titleShadowIntensity,
        subtitleShadowIntensity: settings.subtitleShadowIntensity,
        descriptionShadowIntensity: settings.descriptionShadowIntensity,
        titleShadowColor: settings.titleShadowColor,
        subtitleShadowColor: settings.subtitleShadowColor,
        descriptionShadowColor: settings.descriptionShadowColor,
        title3DDepth: settings.title3DDepth,
        subtitle3DDepth: settings.subtitle3DDepth,
        description3DDepth: settings.description3DDepth,
        splineSettings: settings.splineSettings
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
      {/* Mobile & Desktop Responsive Sidebar */}
      <div className="w-full lg:w-[520px] lg:min-w-[520px] lg:max-w-[520px] bg-white/80 backdrop-blur-xl lg:border-r border-slate-200/60 flex flex-col shadow-xl">
        {/* Ultra-Compact Mobile Header */}
        <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs lg:text-2xl font-bold text-white mb-0 lg:mb-2">{t('preview.constructor.title')}</h2>
              <p className="text-blue-100 text-xs lg:text-sm hidden lg:block">{t('preview.constructor.description')}</p>
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
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('preview.text.content')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.text.content.description')}</p>
                  </div>
                </div>
                
                <div className="space-y-2 lg:space-y-5">
                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                      {t('preview.text.title')}
                    </label>
                    <input
                      type="text"
                      value={settings.titleText}
                      onChange={(e) => updateSettings({ titleText: e.target.value })}
                      className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                      placeholder={t('preview.enter.title.placeholder')}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                      {t('preview.text.subtitle')}
                    </label>
                    <input
                      type="text"
                      value={settings.subtitleText}
                      onChange={(e) => updateSettings({ subtitleText: e.target.value })}
                      className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                      placeholder={t('preview.enter.subtitle.placeholder')}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                      {t('form.description')}
                    </label>
                    <textarea
                      value={settings.descriptionText}
                      onChange={(e) => updateSettings({ descriptionText: e.target.value })}
                      rows={3}
                      className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none min-h-[90px] touch-manipulation text-xs lg:text-sm"
                      placeholder={t('form.description')}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-500 rounded-full"></span>
                      {t('common.save')}
                    </label>
                    <input
                      type="text"
                      value={settings.buttonText}
                      onChange={(e) => updateSettings({ buttonText: e.target.value })}
                      className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] touch-manipulation text-xs lg:text-sm"
                      placeholder={t('common.add')}
                    />
                  </div>
                </div>
              </div>

              {/* 2. 🔤 Типографіка - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🔤</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.typography.font.family')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('form.font')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами - MOBILE OPTIMIZED */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('common.edit')}:</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('preview.element.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('preview.element.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('preview.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 touch-manipulation min-h-[50px] lg:min-h-[60px] flex flex-col items-center justify-center ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-sm lg:text-xl mb-0.5 lg:mb-1">{element.icon}</div>
                        <div className="text-[10px] lg:text-xs font-semibold text-center leading-tight hyphens-auto" style={{wordBreak: 'break-word'}}>{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування для обраного елемента - MOBILE OPTIMIZED */}
                <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-5 border border-purple-100">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-5">
                    <div className={`w-2 h-2 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-semibold text-slate-800 text-xs lg:text-base">
                      {t('common.settings')}: {
                        activeTypographyElement === 'title' ? t('preview.element.title') :
                        activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                      }
                    </h4>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-5">
                    {/* Сімейство шрифтів - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('typography.font.family')}</label>
                      <select
                        value={getTypographyValue('fontFamily') as string}
                        onChange={(e) => updateTypographyValue('fontFamily', e.target.value)}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs lg:text-sm transition-all duration-200 min-h-[40px] touch-manipulation"
                      >
                        <optgroup label="🔥 Сучасні Sans-Serif (Кирилиця)">
                          <option value="Inter">Inter</option>
                          <option value="Source Sans Pro">Source Sans Pro</option>
                          <option value="Nunito">Nunito</option>
                          <option value="IBM Plex Sans">IBM Plex Sans</option>
                          <option value="Fira Sans">Fira Sans</option>
                        </optgroup>
                        
                        <optgroup label="📖 Класичні Sans-Serif (Кирилиця)">
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Oswald">Oswald</option>
                        </optgroup>
                        
                        <optgroup label="✍️ Елегантні Serif (Кирилиця)">
                          <option value="Source Serif Pro">Source Serif Pro</option>
                          <option value="Lora">Lora</option>
                          <option value="IBM Plex Serif">IBM Plex Serif</option>
                          <option value="Georgia">Georgia</option>
                        </optgroup>
                        
                        <optgroup label="🎨 Декоративні (обмежена кирилиця)">
                          <option value="Playfair Display">Playfair Display</option>
                        </optgroup>
                        
                        <optgroup label="💻 Спеціальні (Кирилиця)">
                          <option value="JetBrains Mono">JetBrains Mono</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Товщина шрифту - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('typography.font.weight')}</label>
                      <div className="grid grid-cols-3 gap-1.5 lg:gap-3">
                        {[
                          { value: 400, label: t('preview.font.weight.normal'), weight: 'font-normal' },
                          { value: 600, label: t('preview.font.weight.semi'), weight: 'font-semibold' },
                          { value: 700, label: t('preview.font.weight.bold'), weight: 'font-bold' }
                        ].map((weight) => (
                          <button
                            key={weight.value}
                            onClick={() => updateTypographyValue('fontWeight', weight.value)}
                            className={`p-2 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                              getTypographyValue('fontWeight') === weight.value
                                ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                            }`}
                          >
                            <div className={`${weight.weight} text-xs lg:text-lg mb-0.5 lg:mb-1`}>Aa</div>
                            <div className="text-[10px] lg:text-xs font-semibold leading-tight break-words">{weight.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Стиль тексту - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('preview.text.style')}</label>
                      <div className="grid grid-cols-2 gap-1.5 lg:gap-3">
                        {[
                          { value: 'normal', label: t('preview.text.style.normal'), style: 'font-normal' },
                          { value: 'italic', label: t('preview.text.style.italic'), style: 'italic' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => updateTypographyValue('fontStyle', style.value)}
                            className={`p-2 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                              getTypographyValue('fontStyle') === style.value
                                ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-md'
                                : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                            }`}
                          >
                            <div className={`${style.style} text-sm lg:text-base mb-0.5 lg:mb-1 truncate`}>
                              {activeTypographyElement === 'title' ? t('preview.element.title') :
                               activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')}
                            </div>
                            <div className="text-[10px] lg:text-xs font-semibold leading-tight">{style.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 📱 Адаптивність - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('responsive.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('responsive.description')}</p>
                  </div>
                </div>
                
                {/* Вибір пристрою - MOBILE OPTIMIZED */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('preview.select.device')}:</label>
                  <div className="grid grid-cols-3 gap-1.5 lg:gap-3">
                    {[
                      { type: 'mobile', label: t('preview.device.mobile'), icon: '📱', color: 'emerald' },
                      { type: 'tablet', label: t('preview.device.tablet'), icon: '📟', color: 'teal' },
                      { type: 'desktop', label: t('preview.device.computer'), icon: '🖥️', color: 'cyan' }
                    ].map((device) => (
                      <button
                        key={device.type}
                        onClick={() => setDeviceType(device.type as DeviceType)}
                        className={`p-2 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                          deviceType === device.type
                            ? `border-${device.color}-500 bg-${device.color}-100 text-${device.color}-700 shadow-lg scale-105`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-lg mb-0.5 lg:mb-1 text-center">{device.icon}</div>
                        <div className="text-[10px] lg:text-xs font-semibold text-center leading-tight">{device.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Налаштування для обраного пристрою - MOBILE OPTIMIZED */}
                <div className="space-y-2 lg:space-y-5">
                  {/* Заголовок - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="font-semibold text-slate-800 mb-1 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-base">
                      <span className="w-1.5 h-1.5 lg:w-3 lg:h-3 bg-blue-500 rounded-full"></span>
                      {t('preview.element.title')}
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.font.size')}: {settings[deviceType].titleFontSize}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.margin.bottom')}: {settings[deviceType].titleMarginBottom}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Підзаголовок - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="font-semibold text-slate-800 mb-1 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-base">
                      <span className="w-1.5 h-1.5 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></span>
                      {t('preview.element.subtitle')}
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.font.size')}: {settings[deviceType].subtitleFontSize}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.margin.bottom')}: {settings[deviceType].subtitleMarginBottom}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Опис - MOBILE OPTIMIZED */}
                  <div className="bg-white/60 rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="font-semibold text-slate-800 mb-1 lg:mb-4 flex items-center gap-1 lg:gap-2 text-xs lg:text-base">
                      <span className="w-1.5 h-1.5 lg:w-3 lg:h-3 bg-green-500 rounded-full"></span>
                      {t('preview.element.description')}
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.font.size')}: {settings[deviceType].descriptionFontSize}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                          {t('responsive.margin.bottom')}: {settings[deviceType].descriptionMarginBottom}px
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
                          className="w-full h-1.5 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. 🌟 Тіні та ефекти - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-violet-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('preview.shadows.effects')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.add.depth')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами - MOBILE OPTIMIZED */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('preview.select.element.effects')}:</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('preview.element.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('preview.element.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('preview.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 touch-manipulation min-h-[50px] lg:min-h-[60px] flex flex-col items-center justify-center ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-sm lg:text-xl mb-0.5 lg:mb-1">{element.icon}</div>
                        <div className="text-[10px] lg:text-xs font-semibold text-center leading-tight hyphens-auto" style={{wordBreak: 'break-word'}}>{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування ефектів для обраного елемента - MOBILE OPTIMIZED */}
                <div className="bg-white/60 rounded-xl p-2 lg:p-5 border border-violet-100">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-5">
                    <div className={`w-2 h-2 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-semibold text-slate-800 text-xs lg:text-base">
                      {t('preview.effects.for')}: {
                        activeTypographyElement === 'title' ? t('preview.element.title') :
                        activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                      }
                    </h4>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-5">
                    {/* Інтенсивність тіні - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                        {t('preview.shadow.intensity')}: {
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
                        className="w-full h-1.5 lg:h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                      />
                    </div>

                    {/* Колір тіні - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('preview.shadow.color')}</label>
                      <div className="flex gap-2 lg:gap-3">
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
                          className="w-10 h-8 lg:w-16 lg:h-12 border-2 border-slate-200 rounded-md lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
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
                          className="flex-1 px-2 py-2 lg:px-3 lg:py-2 bg-white border border-slate-200 rounded-md lg:rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs lg:text-sm min-h-[32px] lg:min-h-[auto] touch-manipulation"
                        />
                      </div>
                    </div>

                    {/* 3D глибина - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                        {t('preview.3d.depth')}: {
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
                        className="w-full h-1.5 lg:h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. ✨ Анімації тексту - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">✨</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('preview.text.animations')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.add.dynamic')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами - MOBILE OPTIMIZED */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('preview.select.element.animation')}:</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('preview.element.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('preview.element.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('preview.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 touch-manipulation min-h-[50px] lg:min-h-[60px] flex flex-col items-center justify-center ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-sm lg:text-xl mb-0.5 lg:mb-1">{element.icon}</div>
                        <div className="text-[10px] lg:text-xs font-semibold text-center leading-tight hyphens-auto" style={{wordBreak: 'break-word'}}>{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування анімації для обраного елемента - MOBILE OPTIMIZED */}
                <div className="bg-white/60 rounded-xl p-2 lg:p-5 border border-cyan-100">
                  <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-5">
                    <div className={`w-2 h-2 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="font-semibold text-slate-800 text-xs lg:text-base">
                      {t('preview.animation.for')}: {
                        activeTypographyElement === 'title' ? t('preview.element.title') :
                        activeTypographyElement === 'subtitle' ? t('preview.element.subtitle') : t('preview.element.description')
                      }
                    </h4>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-5">
                    {/* Анімація входу - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('preview.entrance.animation')}</label>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 lg:gap-2">
                        {[
                          { value: 'none', label: t('preview.animation.none'), icon: '⚪' },
                          { value: 'fadeIn', label: t('preview.animation.fade'), icon: '🌅' },
                          { value: 'slideUp', label: t('preview.animation.bottom'), icon: '⬆️' },
                          { value: 'slideDown', label: t('preview.animation.top'), icon: '⬇️' },
                          { value: 'slideLeft', label: t('preview.animation.right'), icon: '⬅️' },
                          { value: 'slideRight', label: t('preview.animation.left'), icon: '➡️' },
                          { value: 'zoomIn', label: t('preview.animation.zoom'), icon: '🔍' },
                          { value: 'rotateIn', label: t('preview.animation.rotate'), icon: '🔄' },
                          { value: 'bounce', label: t('preview.animation.bounce'), icon: '⚡' },
                          { value: 'typewriter', label: t('preview.animation.typewriter'), icon: '⌨️' },
                          { value: 'glow', label: t('preview.animation.glow'), icon: '💫' }
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
                              className={`p-2 lg:p-3 rounded-md lg:rounded-lg border-2 transition-all duration-200 text-xs min-h-[60px] lg:min-h-[auto] touch-manipulation ${
                                currentAnimation === animation.value
                                  ? 'border-cyan-500 bg-cyan-100 text-cyan-700'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60'
                              }`}
                            >
                              <div className="text-xs lg:text-lg mb-0.5 lg:mb-1">{animation.icon}</div>
                              <div className="text-[10px] lg:text-xs font-semibold leading-tight">{animation.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Загальні налаштування анімації - MOBILE OPTIMIZED */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('preview.animation.settings')}</label>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('preview.duration')}: {settings.animationDuration}мс
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="3000"
                            step="100"
                            value={settings.animationDuration}
                            onChange={(e) => updateSettings({ animationDuration: parseInt(e.target.value) })}
                            className="w-full h-1.5 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1 lg:mb-2">
                            {t('preview.delay')}: {settings.animationDelay}мс
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            step="100"
                            value={settings.animationDelay}
                            onChange={(e) => updateSettings({ animationDelay: parseInt(e.target.value) })}
                            className="w-full h-1.5 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
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
                        Розмір логотипа: {settings.logoSize}px
                      </label>
                      <input
                        type="range"
                        min="32"
                        max="200"
                        step="8"
                        value={settings.logoSize}
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

              {/* 🎨 Кольорова схема - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-pink-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
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
                    <div className="flex gap-2 lg:gap-3">
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
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                        placeholder="#ff6b9d"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                      {t('colors.accent')}
                    </label>
                    <div className="flex gap-2 lg:gap-3">
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
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                      {t('colors.text')}
                    </label>
                    <div className="flex gap-2 lg:gap-3">
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
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                        placeholder="#1e293b"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-2 lg:space-y-6">
              {/* 🌅 Тип фону - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌅</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('background.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('background.description')}</p>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-6">
                  {/* Вибір типу фону - MOBILE OPTIMIZED */}
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('background.type')}</label>
                    <div className="grid grid-cols-2 gap-1 lg:gap-3">
                      {[
                        { type: 'color', label: t('background.type.color'), icon: '🎨' },
                        { type: 'gradient', label: t('background.type.gradient'), icon: '🌈' },
                        { type: 'image', label: t('background.type.image'), icon: '🖼️' },
                        { type: 'video', label: t('background.type.video'), icon: '🎬' }
                      ].map((bgType) => (
                        <button
                          key={bgType.type}
                          onClick={() => updateSettings({ backgroundType: bgType.type as PreviewSettings['backgroundType'] })}
                          className={`p-2 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-h-[50px] touch-manipulation ${
                            settings.backgroundType === bgType.type
                              ? 'border-indigo-500 bg-indigo-100 text-indigo-700 shadow-lg'
                              : 'border-slate-200 hover:border-slate-300 bg-white/60'
                          }`}
                        >
                          <div className="text-xs lg:text-lg mb-1 text-center">{bgType.icon}</div>
                          <div className="text-[10px] lg:text-xs font-semibold text-center leading-tight">{bgType.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Налаштування для кольору - MOBILE OPTIMIZED */}
                  {settings.backgroundType === 'color' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('background.color')}</label>
                      <div className="flex gap-2 lg:gap-3">
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
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                          placeholder="#f8fafc"
                        />
                      </div>
                    </div>
                  )}

                  {/* Налаштування для градієнта - MOBILE OPTIMIZED */}
                  {settings.backgroundType === 'gradient' && (
                    <div className="space-y-2 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('background.gradient.start')}</label>
                        <div className="flex gap-2 lg:gap-3">
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
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('background.gradient.end')}</label>
                        <div className="flex gap-2 lg:gap-3">
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
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 min-h-[32px] touch-manipulation text-xs lg:text-sm"
                            placeholder="#ec4899"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Налаштування для зображення - MOBILE OPTIMIZED */}
                  {settings.backgroundType === 'image' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('background.image')}</label>
                      <div className="flex gap-2 lg:gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundImage', ['image'])}
                          className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[36px] touch-manipulation text-xs lg:text-base"
                        >
                          📚 <span className="hidden lg:inline">{settings.backgroundImage ? t('background.image.change') : t('background.image.select')}</span>
                          <span className="lg:hidden">Вибрати</span>
                        </button>
                        {settings.backgroundImage && (
                          <button
                            onClick={() => updateSettings({ backgroundImage: '' })}
                            className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[36px] min-w-[36px] touch-manipulation"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Налаштування для відео - MOBILE OPTIMIZED */}
                  {settings.backgroundType === 'video' && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('background.video')}</label>
                      <div className="flex gap-2 lg:gap-3">
                        <button
                          onClick={() => openMediaSelector('backgroundVideo', ['video'])}
                          className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[36px] touch-manipulation text-xs lg:text-base"
                        >
                          📚 <span className="hidden lg:inline">{settings.backgroundVideo ? t('background.video.change') : t('background.video.select')}</span>
                          <span className="lg:hidden">Вибрати</span>
                        </button>
                        {settings.backgroundVideo && (
                          <button
                            onClick={() => updateSettings({ backgroundVideo: '' })}
                            className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[36px] min-w-[36px] touch-manipulation"
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
            <div className="space-y-2 lg:space-y-6">
              {/* Фонова музика - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-green-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🎵</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('audio.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('audio.description')}</p>
                  </div>
                </div>

                <div className="space-y-2 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-0">
                    <label className="text-xs lg:text-sm font-semibold text-slate-700">{t('audio.enable')}</label>
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
                      className={`relative inline-flex h-4 w-8 lg:h-6 lg:w-11 items-center rounded-full transition-colors touch-manipulation ${
                        settings.audioSettings.backgroundMusic.enabled ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                          settings.audioSettings.backgroundMusic.enabled ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.audioSettings.backgroundMusic.enabled && (
                    <>
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('audio.file')}</label>
                        <div className="flex gap-2 lg:gap-3">
                          <button
                            onClick={() => openMediaSelector('backgroundMusic', ['audio'])}
                            className="flex-1 px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-base min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {settings.audioSettings.backgroundMusic.url ? t('audio.change') : t('audio.select')}
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
                              className="px-2 lg:px-4 py-2 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[36px] lg:min-h-[auto] min-w-[36px] lg:min-w-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                          {t('audio.volume')}: {Math.round(settings.audioSettings.backgroundMusic.volume * 100)}%
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
                        <div className="flex items-center justify-between p-2 lg:p-0">
                          <label className="text-xs lg:text-sm font-semibold text-slate-700">{t('audio.loop')}</label>
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
                            className={`relative inline-flex h-4 w-8 lg:h-6 lg:w-11 items-center rounded-full transition-colors touch-manipulation ${
                              settings.audioSettings.backgroundMusic.loop ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                                settings.audioSettings.backgroundMusic.loop ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2 lg:p-0">
                          <label className="text-xs lg:text-sm font-semibold text-slate-700">{t('audio.autoplay')}</label>
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
                            className={`relative inline-flex h-4 w-8 lg:h-6 lg:w-11 items-center rounded-full transition-colors touch-manipulation ${
                              settings.audioSettings.backgroundMusic.autoPlay ? 'bg-green-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                                settings.audioSettings.backgroundMusic.autoPlay ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-2 lg:p-0">
                          <label className="text-xs lg:text-sm font-semibold text-slate-700">{t('audio.singlePlay')}</label>
                          <button
                            onClick={() => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                backgroundMusic: { 
                                  ...settings.audioSettings.backgroundMusic, 
                                  singlePlay: !settings.audioSettings.backgroundMusic.singlePlay 
                                } 
                              } 
                            })}
                            disabled={!settings.audioSettings.backgroundMusic.autoPlay}
                            className={`relative inline-flex h-4 w-8 lg:h-6 lg:w-11 items-center rounded-full transition-colors touch-manipulation ${
                              settings.audioSettings.backgroundMusic.singlePlay && settings.audioSettings.backgroundMusic.autoPlay ? 'bg-green-600' : 'bg-gray-200'
                            } ${!settings.audioSettings.backgroundMusic.autoPlay ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span
                              className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                                settings.audioSettings.backgroundMusic.singlePlay && settings.audioSettings.backgroundMusic.autoPlay ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === '3d' && (
            <div className="space-y-2 lg:space-y-6">
              {/* Spline 3D Animation - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('preview.spline.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.spline.description')}</p>
                  </div>
                </div>

                {/* Enable Toggle - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
                <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100 mb-2 lg:mb-6">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <span className="text-lg lg:text-2xl">🌐</span>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs lg:text-base">{t('preview.spline.enable')}</h4>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('preview.spline.enable.description')}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
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
                    <div className="w-8 h-4 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-cyan-500 touch-manipulation"></div>
                  </label>
                </div>

                {settings.splineSettings.enabled && (
                  <div className="space-y-2 lg:space-y-5">
                    {/* Scene URL Input - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
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
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-xs lg:text-sm min-h-[36px] touch-manipulation"
                        placeholder={t('preview.spline.url.placeholder')}
                      />
                      <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('preview.spline.url.tip')}
                      </p>
                    </div>

                    {/* Embed Code Input - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
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
                        rows={2}
                        className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none font-mono text-xs lg:text-sm min-h-[60px] touch-manipulation"
                        placeholder={t('preview.spline.embed.placeholder')}
                      />
                      <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('preview.spline.embed.tip')}
                      </p>
                    </div>

                    {/* Local File Input - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
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
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="spline-file-input-preview"
                        />
                        <label
                          htmlFor="spline-file-input-preview"
                          className="flex items-center justify-center w-full px-2 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-xl hover:from-purple-100 hover:to-indigo-100 hover:border-purple-400 transition-all duration-200 cursor-pointer group min-h-[50px] touch-manipulation"
                        >
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-md lg:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-white text-xs lg:text-sm">📁</span>
                            </div>
                            <div className="text-center">
                              <p className="text-xs lg:text-sm font-semibold text-slate-700">{t('preview.spline.file.select')}</p>
                              <p className="text-xs text-slate-500 hidden lg:block">{t('preview.spline.file.drag')}</p>
                            </div>
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('preview.spline.file.tip')}
                      </p>
                    </div>

                    {/* Position Selection - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('preview.spline.position')}</label>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
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
                            className={`p-2 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[60px] lg:min-h-[auto] touch-manipulation ${
                              settings.splineSettings.position === pos.value
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-600'
                            }`}
                          >
                            <div className="text-lg mb-1">{pos.icon}</div>
                            <div className="text-xs font-semibold">{pos.label}</div>
                            <div className="text-xs text-slate-500 mt-1 hidden lg:block">{pos.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sliders - МОБІЛЬНО ОПТИМІЗОВАНІ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                      {/* Opacity Control */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">
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
                          className="w-full h-1.5 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>

                      {/* Scale Control */}
                      <div className="group">
                        <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-1 lg:mb-2">
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
                          className="w-full h-1.5 lg:h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>

                    {/* Additional Options - МОБІЛЬНО ОПТИМІЗОВАНІ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                      <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100">
                        <div className="flex-1 pr-2">
                          <h5 className="font-medium text-slate-800 text-xs lg:text-base">{t('preview.spline.autoplay')}</h5>
                          <p className="text-xs text-slate-600 hidden lg:block">{t('preview.spline.autoplay.description')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
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
                          <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500 touch-manipulation"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-2 lg:p-3 bg-white/60 rounded-md lg:rounded-xl border border-cyan-100">
                        <div className="flex-1 pr-2">
                          <h5 className="font-medium text-slate-800 text-xs lg:text-base">{t('preview.spline.controls')}</h5>
                          <p className="text-xs text-slate-600 hidden lg:block">{t('preview.spline.controls.description')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
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
                          <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500 touch-manipulation"></div>
                        </label>
                      </div>
                    </div>

                    {/* Preview Info - МОБІЛЬНО ОПТИМІЗОВАНИЙ */}
                    {(settings.splineSettings.sceneUrl || settings.splineSettings.embedCode) && (
                      <div className="mt-2 lg:mt-4 p-2 lg:p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-md lg:rounded-xl border border-cyan-200">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-md lg:rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm lg:text-lg">🌐</span>
                          </div>
                          <div>
                            <p className="text-xs lg:text-sm font-medium text-cyan-700">{t('preview.spline.configured')}</p>
                            <p className="text-xs text-cyan-600 hidden lg:block">
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
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('preview.preview.title')}</h3>
              <p className="text-slate-600">{t('preview.preview.description')}</p>
            </div>
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              {[
                { type: 'mobile', icon: '📱', label: t('preview.device.mobile') },
                { type: 'tablet', icon: '📟', label: t('preview.device.tablet') },
                { type: 'desktop', icon: '💻', label: t('preview.device.computer') }
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
              style={{ 
                maxHeight: '65vh',
                minHeight: '500px',
                aspectRatio: deviceType === 'mobile' ? '9/16' : deviceType === 'tablet' ? '4/3' : '16/9'
              }}
            >
              {/* Real WelcomeScreen Preview */}
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
            mediaSelectorType === 'logo' ? t('media.selector.logo.title') :
            mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.title') :
            mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.title') :
            mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.title') :
            t('media.selector.title')
          }
          description={
            mediaSelectorType === 'logo' ? t('media.selector.logo.description') :
            mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.description') :
            mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.description') :
            mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.description') :
            t('media.selector.description')
          }
        />
      )}
    </div>
  );
};

export default PreviewCustomizer; 