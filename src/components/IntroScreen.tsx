import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DynamicBackground from "./DynamicBackground";
import SplineAnimation from "./SplineAnimation";
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';
import { webAudioManager } from '../utils/webAudioUtils';
import StandardVideoPlayer from './StandardVideoPlayer';

interface IntroScreenProps {
  visible: boolean;
  onComplete: () => void;
}

interface IntroSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  brandColor: string;
  accentColor: string;
  textColor: string;
  logoUrl: string;
  logoSize: number;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  hasMusic: boolean;
  musicUrl: string;
  animationStyle: 'fade' | 'slide' | 'zoom' | 'bounce';
  showParticles: boolean;
  particleColor: string;
  
  // Детальні анімації - вхідні
  titleAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  subtitleAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  descriptionAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  // Детальні анімації - вихідні
  titleExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  subtitleExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  descriptionExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve' | 'cinematicZoomOut';
  animationDuration?: number;
  animationDelay?: number;
  
  // Типографіка
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  descriptionFontFamily?: string;
  titleFontWeight?: number;
  subtitleFontWeight?: number;
  descriptionFontWeight?: number;
  titleFontStyle?: string;
  subtitleFontStyle?: string;
  descriptionFontStyle?: string;
  
  // Тіні та ефекти
  title3DDepth?: number;
  subtitle3DDepth?: number;
  description3DDepth?: number;
  titleShadowIntensity?: number;
  subtitleShadowIntensity?: number;
  descriptionShadowIntensity?: number;
  titleShadowColor?: string;
  subtitleShadowColor?: string;
  descriptionShadowColor?: string;
  
  // Адаптивні налаштування
  mobile?: {
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
  
  tablet?: {
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
  
  desktop?: {
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
  
  // Поточний пристрій
  device?: 'mobile' | 'tablet' | 'desktop';
  
  // 3D Анімації (Spline)
  splineSettings?: {
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
  title: "Beyond",
  subtitle: "Reality",
  description: "Travel through time and space in the exciting universe of the future.",
  buttonText: "Start Journey",
  buttonUrl: "#start",
  brandColor: "#4a4b57",
  accentColor: "#3b82f6",
  textColor: "#ffffff",
  logoUrl: "",
  logoSize: 64,
  backgroundType: 'gradient',
  backgroundColor: "#1a1a1a",
  gradientFrom: "#1a1a1a",
  gradientTo: "#2d2d2d",
  backgroundImage: "",
  backgroundVideo: "",
  hasMusic: false,
  musicUrl: "",
  animationStyle: 'fade',
  showParticles: false,
  particleColor: "#ffffff",
  
  // Детальні анімації - вхідні
  titleAnimation: 'fadeIn',
  subtitleAnimation: 'slideDown',
  descriptionAnimation: 'fadeIn',
  // Детальні анімації - вихідні
  titleExitAnimation: 'fadeOut',
  subtitleExitAnimation: 'slideDown',
  descriptionExitAnimation: 'fadeOut',
  animationDuration: 800,
  animationDelay: 200,
  
  // Типографіка
  titleFontFamily: "Arial",
  subtitleFontFamily: "Arial",
  descriptionFontFamily: "Arial",
  titleFontWeight: 400,
  subtitleFontWeight: 400,
  descriptionFontWeight: 400,
  titleFontStyle: "normal",
  subtitleFontStyle: "normal",
  descriptionFontStyle: "normal",
  
  // Тіні та ефекти
  title3DDepth: 0,
  subtitle3DDepth: 0,
  description3DDepth: 0,
  titleShadowIntensity: 0,
  subtitleShadowIntensity: 0,
  descriptionShadowIntensity: 0,
  titleShadowColor: '#000000',
  subtitleShadowColor: '#000000',
  descriptionShadowColor: '#000000',
  
  // Адаптивні налаштування
  mobile: {
    titleFontSize: 16,
    subtitleFontSize: 14,
    descriptionFontSize: 12,
    titleMarginBottom: 20,
    subtitleMarginBottom: 20,
    descriptionMarginBottom: 20,
    titleLineHeight: 1.2,
    subtitleLineHeight: 1.2,
    descriptionLineHeight: 1.2,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 20,
    containerMarginTop: 0,
    containerMarginBottom: 0
  },
  
  tablet: {
    titleFontSize: 18,
    subtitleFontSize: 16,
    descriptionFontSize: 14,
    titleMarginBottom: 20,
    subtitleMarginBottom: 20,
    descriptionMarginBottom: 20,
    titleLineHeight: 1.2,
    subtitleLineHeight: 1.2,
    descriptionLineHeight: 1.2,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 20,
    containerMarginTop: 0,
    containerMarginBottom: 0
  },
  
  desktop: {
    titleFontSize: 20,
    subtitleFontSize: 18,
    descriptionFontSize: 16,
    titleMarginBottom: 20,
    subtitleMarginBottom: 20,
    descriptionMarginBottom: 20,
    titleLineHeight: 1.2,
    subtitleLineHeight: 1.2,
    descriptionLineHeight: 1.2,
    titleLetterSpacing: 0.5,
    subtitleLetterSpacing: 0.5,
    descriptionLetterSpacing: 0.5,
    containerPadding: 20,
    containerMarginTop: 0,
    containerMarginBottom: 0
  },
  
  // Поточний пристрій
  device: 'desktop',
  
  // 3D Анімації (Spline)
  splineSettings: {
    enabled: false,
    sceneUrl: "",
    embedCode: "",
    localFile: "",
    position: 'background',
    opacity: 80,
    scale: 100,
    autoplay: true,
    controls: false,
    method: 'component'
  }
};

const IntroScreen = ({ visible, onComplete }: IntroScreenProps) => {
  const [introSettings, setIntroSettings] = useState<IntroSettings>(defaultSettings);
  const [animationKey, setAnimationKey] = useState(1); // Починаємо з 1 для запуску анімацій
  const [isTextExiting, setIsTextExiting] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);



  // Відео тепер обробляється StandardVideoPlayer компонентом

  // Простий фікс - тільки приховання скролбарів
  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);
  
  // Завантаження налаштувань інтро через IndexedDB
  useEffect(() => {
    loadIntroSettings();
    
    // Слухач для оновлення даних з конструктора інтро
    const handleIntroSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 IntroScreen: Отримано оновлення з конструктора:', event.detail);
      console.log('🌐 IntroScreen: Spline налаштування з події:', event.detail?.splineSettings);

      
      // Конвертуємо розширений формат з IntroCustomizer в базовий для IntroScreen
      const extendedSettings = event.detail;
      const convertedSettings = {
        title: extendedSettings.title || defaultSettings.title,
        subtitle: extendedSettings.subtitle || defaultSettings.subtitle,
        description: extendedSettings.description || defaultSettings.description,
        buttonText: extendedSettings.buttonText || defaultSettings.buttonText,
        buttonUrl: extendedSettings.buttonUrl || defaultSettings.buttonUrl,
        brandColor: extendedSettings.brandColor || defaultSettings.brandColor,
        accentColor: extendedSettings.accentColor || defaultSettings.accentColor,
        textColor: extendedSettings.textColor || defaultSettings.textColor,
        logoUrl: extendedSettings.logoUrl || defaultSettings.logoUrl,
        logoSize: extendedSettings.logoSize || defaultSettings.logoSize,
        backgroundType: extendedSettings.backgroundType || defaultSettings.backgroundType,
        backgroundColor: extendedSettings.backgroundColor || defaultSettings.backgroundColor,
        gradientFrom: extendedSettings.gradientFrom || defaultSettings.gradientFrom,
        gradientTo: extendedSettings.gradientTo || defaultSettings.gradientTo,
        backgroundImage: extendedSettings.backgroundImage || defaultSettings.backgroundImage,
        backgroundVideo: extendedSettings.backgroundVideo || defaultSettings.backgroundVideo,
        hasMusic: extendedSettings.audioSettings?.backgroundMusic?.enabled || defaultSettings.hasMusic,
        musicUrl: extendedSettings.audioSettings?.backgroundMusic?.url || defaultSettings.musicUrl,
        animationStyle: defaultSettings.animationStyle, // Базова анімація для IntroScreen
        showParticles: extendedSettings.showParticles || defaultSettings.showParticles,
        particleColor: extendedSettings.particleColor || defaultSettings.particleColor,
        
        // Типографіка
        titleFontFamily: extendedSettings.titleFontFamily || defaultSettings.titleFontFamily,
        subtitleFontFamily: extendedSettings.subtitleFontFamily || defaultSettings.subtitleFontFamily,
        descriptionFontFamily: extendedSettings.descriptionFontFamily || defaultSettings.descriptionFontFamily,
        titleFontWeight: extendedSettings.titleFontWeight || defaultSettings.titleFontWeight,
        subtitleFontWeight: extendedSettings.subtitleFontWeight || defaultSettings.subtitleFontWeight,
        descriptionFontWeight: extendedSettings.descriptionFontWeight || defaultSettings.descriptionFontWeight,
        titleFontStyle: extendedSettings.titleFontStyle || defaultSettings.titleFontStyle,
        subtitleFontStyle: extendedSettings.subtitleFontStyle || defaultSettings.subtitleFontStyle,
        descriptionFontStyle: extendedSettings.descriptionFontStyle || defaultSettings.descriptionFontStyle,
        
        // Тіні та ефекти
        title3DDepth: extendedSettings.title3DDepth || defaultSettings.title3DDepth,
        subtitle3DDepth: extendedSettings.subtitle3DDepth || defaultSettings.subtitle3DDepth,
        description3DDepth: extendedSettings.description3DDepth || defaultSettings.description3DDepth,
        titleShadowIntensity: extendedSettings.titleShadowIntensity || defaultSettings.titleShadowIntensity,
        subtitleShadowIntensity: extendedSettings.subtitleShadowIntensity || defaultSettings.subtitleShadowIntensity,
        descriptionShadowIntensity: extendedSettings.descriptionShadowIntensity || defaultSettings.descriptionShadowIntensity,
        titleShadowColor: extendedSettings.titleShadowColor || defaultSettings.titleShadowColor,
        subtitleShadowColor: extendedSettings.subtitleShadowColor || defaultSettings.subtitleShadowColor,
        descriptionShadowColor: extendedSettings.descriptionShadowColor || defaultSettings.descriptionShadowColor,
        
        // Детальні анімації
        titleAnimation: extendedSettings.titleAnimation || defaultSettings.titleAnimation,
        subtitleAnimation: extendedSettings.subtitleAnimation || defaultSettings.subtitleAnimation,
        descriptionAnimation: extendedSettings.descriptionAnimation || defaultSettings.descriptionAnimation,
        titleExitAnimation: extendedSettings.titleExitAnimation || defaultSettings.titleExitAnimation,
        subtitleExitAnimation: extendedSettings.subtitleExitAnimation || defaultSettings.subtitleExitAnimation,
        descriptionExitAnimation: extendedSettings.descriptionExitAnimation || defaultSettings.descriptionExitAnimation,
        animationDuration: extendedSettings.animationDuration || defaultSettings.animationDuration,
        animationDelay: extendedSettings.animationDelay || defaultSettings.animationDelay,
        
        // Адаптивні налаштування
        mobile: extendedSettings.mobile || defaultSettings.mobile,
        tablet: extendedSettings.tablet || defaultSettings.tablet,
        desktop: extendedSettings.desktop || defaultSettings.desktop,
        device: extendedSettings.device || defaultSettings.device,
        
        // 🌐 Spline 3D анімації
        splineSettings: extendedSettings.splineSettings || defaultSettings.splineSettings
      };
      
      console.log('🔄 IntroScreen: Конвертовані налаштування:', {
        title: convertedSettings.title,
        subtitle: convertedSettings.subtitle,
        description: convertedSettings.description,
        buttonText: convertedSettings.buttonText,
        animationDuration: convertedSettings.animationDuration,
        animationDelay: convertedSettings.animationDelay
      });
      
      // Якщо змінилося відео, скидаємо ініціалізацію
      if (convertedSettings.backgroundVideo !== introSettings.backgroundVideo) {
        console.log('🎬 IntroScreen: Виявлена зміна відео');
      }
      
      setIntroSettings(convertedSettings);
      console.log('🎬 IntroScreen: Налаштування оновлено через подію, нові значення:', convertedSettings);
    };

    window.addEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
    };
  }, [introSettings.backgroundVideo]);

  const loadIntroSettings = async () => {
    console.log('🎬 IntroScreen: Початок завантаження налаштувань');
    console.log('🎬 IntroScreen: Поточні налаштування до завантаження:', introSettings);
    
    try {
      console.log('🔄 IntroScreen: Завантаження налаштувань через IndexedDBService...');
      
      // Спочатку пробуємо завантажити з IndexedDB
      let indexedDBSettings = await indexedDBService.loadSettings('introSettings');
      
      // Якщо немає локальних налаштувань і це не адмін режим, логуємо це
      if (!indexedDBSettings && !domainSyncService.isAdminMode()) {
        console.log('🔄 IntroScreen: Локальні Intro налаштування не знайдено в публічному режимі');
        // В Domain-based синхронізації ми автоматично отримуємо оновлення через localStorage events
      }
      
      if (indexedDBSettings) {
        console.log('✅ IntroScreen: Налаштування завантажено з IndexedDB');
        console.log('🌐 IntroScreen: Spline налаштування:', indexedDBSettings.splineSettings);
        console.log('🔍 IntroScreen: Детальні Spline параметри:', {
          enabled: indexedDBSettings.splineSettings?.enabled,
          opacity: indexedDBSettings.splineSettings?.opacity,
          scale: indexedDBSettings.splineSettings?.scale,
          position: indexedDBSettings.splineSettings?.position
        });
        
        // Конвертуємо розширений формат в базовий для IntroScreen
        const convertedSettings = {
          title: indexedDBSettings.title || defaultSettings.title,
          subtitle: indexedDBSettings.subtitle || defaultSettings.subtitle,
          description: indexedDBSettings.description || defaultSettings.description,
          buttonText: indexedDBSettings.buttonText || defaultSettings.buttonText,
          buttonUrl: indexedDBSettings.buttonUrl || defaultSettings.buttonUrl,
          brandColor: indexedDBSettings.brandColor || defaultSettings.brandColor,
          accentColor: indexedDBSettings.accentColor || defaultSettings.accentColor,
          textColor: indexedDBSettings.textColor || defaultSettings.textColor,
          logoUrl: indexedDBSettings.logoUrl || defaultSettings.logoUrl,
          logoSize: indexedDBSettings.logoSize || defaultSettings.logoSize,
          backgroundType: indexedDBSettings.backgroundType || defaultSettings.backgroundType,
          backgroundColor: indexedDBSettings.backgroundColor || defaultSettings.backgroundColor,
          gradientFrom: indexedDBSettings.gradientFrom || defaultSettings.gradientFrom,
          gradientTo: indexedDBSettings.gradientTo || defaultSettings.gradientTo,
          backgroundImage: indexedDBSettings.backgroundImage || defaultSettings.backgroundImage,
          backgroundVideo: indexedDBSettings.backgroundVideo || defaultSettings.backgroundVideo,
          hasMusic: indexedDBSettings.audioSettings?.backgroundMusic?.enabled || defaultSettings.hasMusic,
          musicUrl: indexedDBSettings.audioSettings?.backgroundMusic?.url || defaultSettings.musicUrl,
          animationStyle: defaultSettings.animationStyle, // Базова анімація для IntroScreen
          showParticles: indexedDBSettings.showParticles || defaultSettings.showParticles,
          particleColor: indexedDBSettings.particleColor || defaultSettings.particleColor,
          
          // Типографіка
          titleFontFamily: indexedDBSettings.titleFontFamily || defaultSettings.titleFontFamily,
          subtitleFontFamily: indexedDBSettings.subtitleFontFamily || defaultSettings.subtitleFontFamily,
          descriptionFontFamily: indexedDBSettings.descriptionFontFamily || defaultSettings.descriptionFontFamily,
          titleFontWeight: indexedDBSettings.titleFontWeight || defaultSettings.titleFontWeight,
          subtitleFontWeight: indexedDBSettings.subtitleFontWeight || defaultSettings.subtitleFontWeight,
          descriptionFontWeight: indexedDBSettings.descriptionFontWeight || defaultSettings.descriptionFontWeight,
          titleFontStyle: indexedDBSettings.titleFontStyle || defaultSettings.titleFontStyle,
          subtitleFontStyle: indexedDBSettings.subtitleFontStyle || defaultSettings.subtitleFontStyle,
          descriptionFontStyle: indexedDBSettings.descriptionFontStyle || defaultSettings.descriptionFontStyle,
          
          // Тіні та ефекти
          title3DDepth: indexedDBSettings.title3DDepth || defaultSettings.title3DDepth,
          subtitle3DDepth: indexedDBSettings.subtitle3DDepth || defaultSettings.subtitle3DDepth,
          description3DDepth: indexedDBSettings.description3DDepth || defaultSettings.description3DDepth,
          titleShadowIntensity: indexedDBSettings.titleShadowIntensity || defaultSettings.titleShadowIntensity,
          subtitleShadowIntensity: indexedDBSettings.subtitleShadowIntensity || defaultSettings.subtitleShadowIntensity,
          descriptionShadowIntensity: indexedDBSettings.descriptionShadowIntensity || defaultSettings.descriptionShadowIntensity,
          titleShadowColor: indexedDBSettings.titleShadowColor || defaultSettings.titleShadowColor,
          subtitleShadowColor: indexedDBSettings.subtitleShadowColor || defaultSettings.subtitleShadowColor,
          descriptionShadowColor: indexedDBSettings.descriptionShadowColor || defaultSettings.descriptionShadowColor,
          
          // Детальні анімації
          titleAnimation: indexedDBSettings.titleAnimation || defaultSettings.titleAnimation,
          subtitleAnimation: indexedDBSettings.subtitleAnimation || defaultSettings.subtitleAnimation,
          descriptionAnimation: indexedDBSettings.descriptionAnimation || defaultSettings.descriptionAnimation,
          titleExitAnimation: indexedDBSettings.titleExitAnimation || defaultSettings.titleExitAnimation,
          subtitleExitAnimation: indexedDBSettings.subtitleExitAnimation || defaultSettings.subtitleExitAnimation,
          descriptionExitAnimation: indexedDBSettings.descriptionExitAnimation || defaultSettings.descriptionExitAnimation,
          animationDuration: indexedDBSettings.animationDuration || defaultSettings.animationDuration,
          animationDelay: indexedDBSettings.animationDelay || defaultSettings.animationDelay,
          
          // Адаптивні налаштування
          mobile: indexedDBSettings.mobile || defaultSettings.mobile,
          tablet: indexedDBSettings.tablet || defaultSettings.tablet,
          desktop: indexedDBSettings.desktop || defaultSettings.desktop,
          device: indexedDBSettings.device || defaultSettings.device,
          
          // 🌐 Spline 3D анімації
          splineSettings: indexedDBSettings.splineSettings || defaultSettings.splineSettings
        };
        
        console.log('🎭 IntroScreen: Оброблені налаштування з Spline:', convertedSettings.splineSettings);
        setIntroSettings(convertedSettings);
        console.log('🎬 IntroScreen: Налаштування оновлено, нові значення:', convertedSettings);
        return;
      }
      
      // Якщо IndexedDB порожній, пробуємо localStorage як резерв
      console.log('ℹ️ IntroScreen: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
      
      // Спочатку пробуємо завантажити з нового ключа для IntroScreen
      const savedSettings = localStorage.getItem('introScreenSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('✅ IntroScreen: Налаштування завантажено з localStorage (introScreenSettings)');
        setIntroSettings(settings);
        
        // Мігруємо в IndexedDB
        console.log('🔄 IntroScreen: Міграція налаштувань в IndexedDB...');
        await indexedDBService.saveSettings('introSettings', settings, 'project');
        console.log('✅ IntroScreen: Міграція завершена');
        return;
      }
      
      // Якщо немає, пробуємо старий ключ
      const legacySettings = localStorage.getItem('introSettings');
      if (legacySettings) {
        const settings = JSON.parse(legacySettings);
        console.log('✅ IntroScreen: Налаштування завантажено з localStorage (introSettings)');
        // Конвертуємо розширений формат в базовий
        const convertedSettings = {
          title: settings.title || defaultSettings.title,
          subtitle: settings.subtitle || defaultSettings.subtitle,
          description: settings.description || defaultSettings.description,
          buttonText: settings.buttonText || defaultSettings.buttonText,
          buttonUrl: settings.buttonUrl || defaultSettings.buttonUrl,
          brandColor: settings.brandColor || defaultSettings.brandColor,
          accentColor: settings.accentColor || defaultSettings.accentColor,
          textColor: settings.textColor || defaultSettings.textColor,
          logoUrl: settings.logoUrl || defaultSettings.logoUrl,
          logoSize: settings.logoSize || defaultSettings.logoSize,
          backgroundType: settings.backgroundType || defaultSettings.backgroundType,
          backgroundColor: settings.backgroundColor || defaultSettings.backgroundColor,
          gradientFrom: settings.gradientFrom || defaultSettings.gradientFrom,
          gradientTo: settings.gradientTo || defaultSettings.gradientTo,
          backgroundImage: settings.backgroundImage || defaultSettings.backgroundImage,
          backgroundVideo: settings.backgroundVideo || defaultSettings.backgroundVideo,
          hasMusic: settings.audioSettings?.backgroundMusic?.enabled || defaultSettings.hasMusic,
          musicUrl: settings.audioSettings?.backgroundMusic?.url || defaultSettings.musicUrl,
          animationStyle: defaultSettings.animationStyle, // Базова анімація для IntroScreen
          showParticles: settings.showParticles || defaultSettings.showParticles,
          particleColor: settings.particleColor || defaultSettings.particleColor,
          
          // Типографіка
          titleFontFamily: settings.titleFontFamily || defaultSettings.titleFontFamily,
          subtitleFontFamily: settings.subtitleFontFamily || defaultSettings.subtitleFontFamily,
          descriptionFontFamily: settings.descriptionFontFamily || defaultSettings.descriptionFontFamily,
          titleFontWeight: settings.titleFontWeight || defaultSettings.titleFontWeight,
          subtitleFontWeight: settings.subtitleFontWeight || defaultSettings.subtitleFontWeight,
          descriptionFontWeight: settings.descriptionFontWeight || defaultSettings.descriptionFontWeight,
          titleFontStyle: settings.titleFontStyle || defaultSettings.titleFontStyle,
          subtitleFontStyle: settings.subtitleFontStyle || defaultSettings.subtitleFontStyle,
          descriptionFontStyle: settings.descriptionFontStyle || defaultSettings.descriptionFontStyle,
          
          // Тіні та ефекти
          title3DDepth: settings.title3DDepth || defaultSettings.title3DDepth,
          subtitle3DDepth: settings.subtitle3DDepth || defaultSettings.subtitle3DDepth,
          description3DDepth: settings.description3DDepth || defaultSettings.description3DDepth,
          titleShadowIntensity: settings.titleShadowIntensity || defaultSettings.titleShadowIntensity,
          subtitleShadowIntensity: settings.subtitleShadowIntensity || defaultSettings.subtitleShadowIntensity,
          descriptionShadowIntensity: settings.descriptionShadowIntensity || defaultSettings.descriptionShadowIntensity,
          titleShadowColor: settings.titleShadowColor || defaultSettings.titleShadowColor,
          subtitleShadowColor: settings.subtitleShadowColor || defaultSettings.subtitleShadowColor,
          descriptionShadowColor: settings.descriptionShadowColor || defaultSettings.descriptionShadowColor,
          
          // Детальні анімації
          titleAnimation: settings.titleAnimation || defaultSettings.titleAnimation,
          subtitleAnimation: settings.subtitleAnimation || defaultSettings.subtitleAnimation,
          descriptionAnimation: settings.descriptionAnimation || defaultSettings.descriptionAnimation,
          titleExitAnimation: settings.titleExitAnimation || defaultSettings.titleExitAnimation,
          subtitleExitAnimation: settings.subtitleExitAnimation || defaultSettings.subtitleExitAnimation,
          descriptionExitAnimation: settings.descriptionExitAnimation || defaultSettings.descriptionExitAnimation,
          animationDuration: settings.animationDuration || defaultSettings.animationDuration,
          animationDelay: settings.animationDelay || defaultSettings.animationDelay,
          
          // Адаптивні налаштування
          mobile: settings.mobile || defaultSettings.mobile,
          tablet: settings.tablet || defaultSettings.tablet,
          desktop: settings.desktop || defaultSettings.desktop,
          device: settings.device || defaultSettings.device,
          
          // 🌐 Spline 3D анімації
          splineSettings: settings.splineSettings || defaultSettings.splineSettings
        };
        console.log('🎭 IntroScreen: localStorage конвертовані налаштування з Spline:', convertedSettings.splineSettings);
        setIntroSettings(convertedSettings);
        
        // Мігруємо в IndexedDB
        console.log('🔄 IntroScreen: Міграція налаштувань в IndexedDB...');
        await indexedDBService.saveSettings('introSettings', convertedSettings, 'project');
        console.log('✅ IntroScreen: Міграція завершена');
      }
    } catch (error) {
      console.error('❌ IntroScreen: Помилка завантаження налаштувань:', error);
    }
  };

  const getBackgroundStyle = () => {
    console.log('🎨 IntroScreen: getBackgroundStyle викликано з налаштуваннями:', {
      backgroundType: introSettings.backgroundType,
      backgroundColor: introSettings.backgroundColor,
      gradientFrom: introSettings.gradientFrom,
      gradientTo: introSettings.gradientTo,
      backgroundImage: introSettings.backgroundImage,
      backgroundVideo: introSettings.backgroundVideo
    });
    
    switch (introSettings.backgroundType) {
      case 'color':
        return { backgroundColor: introSettings.backgroundColor };
      case 'gradient':
        return { 
          background: `linear-gradient(135deg, ${introSettings.gradientFrom} 0%, ${introSettings.gradientTo} 100%)` 
        };
      case 'image':
        return introSettings.backgroundImage ? {
          backgroundImage: `url(${introSettings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : { backgroundColor: introSettings.backgroundColor };
      case 'video':
        return { backgroundColor: introSettings.backgroundColor };
      default:
        return { backgroundColor: introSettings.backgroundColor };
    }
  };



  // Функція для визначення поточного пристрою
  const getCurrentDevice = (): 'mobile' | 'tablet' | 'desktop' => {
    if (window.innerWidth < 768) return 'mobile';
    if (window.innerWidth < 1024) return 'tablet';
    return 'desktop';
  };

  // Функція для отримання адаптивних налаштувань
  const getResponsiveSettings = () => {
    const device = getCurrentDevice();
    return introSettings[device] || introSettings.desktop || defaultSettings.desktop;
  };

  // Функція для створення стилів тексту з тінями та ефектами
  const getTextStyle = (element: 'title' | 'subtitle' | 'description') => {
    
    const responsiveSettings = getResponsiveSettings();
    
    const baseStyle: any = {
      color: introSettings.textColor,
      fontFamily: introSettings[`${element}FontFamily`] || 'Arial',
      fontWeight: introSettings[`${element}FontWeight`] || 400,
      fontStyle: introSettings[`${element}FontStyle`] || 'normal',
      fontSize: `${responsiveSettings[`${element}FontSize`]}px`,
      lineHeight: responsiveSettings[`${element}LineHeight`],
      letterSpacing: `${responsiveSettings[`${element}LetterSpacing`]}px`,
      marginBottom: `${responsiveSettings[`${element}MarginBottom`]}px`,
    };

    // Функція для конвертації hex в rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    // Додавання тіней
    const shadowIntensity = introSettings[`${element}ShadowIntensity`] || 0;
    const shadowColor = introSettings[`${element}ShadowColor`] || '#000000';
    const depth3D = introSettings[`${element}3DDepth`] || 0;

    // Додавання 3D ефекту
    if (depth3D > 0) {
      const shadows = Array.from({ length: depth3D }, (_, i) => 
        `${i + 1}px ${i + 1}px 0 ${shadowColor}`
      ).join(', ');
      baseStyle.textShadow = shadows;
    } else if (shadowIntensity > 0) {
      // Звичайна тінь без 3D ефекту
      const offset = Math.round(shadowIntensity * 4);
      const blur = Math.round(shadowIntensity * 8);
      baseStyle.textShadow = `${offset}px ${offset}px ${blur}px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity})`;
    }

    return baseStyle;
  };

  // useEffect для перезапуску анімацій при зміні налаштувань
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [introSettings.titleAnimation, introSettings.subtitleAnimation, introSettings.descriptionAnimation, introSettings.titleExitAnimation, introSettings.subtitleExitAnimation, introSettings.descriptionExitAnimation, introSettings.animationDuration, introSettings.animationDelay]);

  // Функція для отримання варіантів анімацій
  const getAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? introSettings.titleAnimation :
                          element === 'subtitle' ? introSettings.subtitleAnimation :
                          introSettings.descriptionAnimation;
    
    const exitAnimation = element === 'title' ? introSettings.titleExitAnimation :
                         element === 'subtitle' ? introSettings.subtitleExitAnimation :
                         introSettings.descriptionExitAnimation;
    
    console.log(`🎭 IntroScreen: getAnimationVariants для ${element}:`, {
      enterAnimation,
      exitAnimation,
      settingsAnimations: {
        titleAnimation: introSettings.titleAnimation,
        subtitleAnimation: introSettings.subtitleAnimation,
        descriptionAnimation: introSettings.descriptionAnimation,
        titleExitAnimation: introSettings.titleExitAnimation,
        subtitleExitAnimation: introSettings.subtitleExitAnimation,
        descriptionExitAnimation: introSettings.descriptionExitAnimation
      }
    });

    // Якщо анімація 'none' або не задана, повертаємо статичну анімацію
    if (!enterAnimation || enterAnimation === 'none') {
      console.log(`🎭 IntroScreen: No animation for ${element}, returning static`);
      return {
        initial: { opacity: 0 }, // ⚠️ ВИПРАВЛЕННЯ: Починаємо з невидимого стану
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    const duration = (introSettings.animationDuration || 800) / 1000;
    const delay = (introSettings.animationDelay || 200) / 1000;
    
    const variants: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    };
    
    // Налаштування входу
      switch (enterAnimation) {
      case 'fadeIn':
        variants.hidden = { opacity: 0 };
        variants.visible = { opacity: 1 };
        break;
      case 'slideUp':
        variants.hidden = { opacity: 0, y: '100vh' };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case 'slideDown':
        variants.hidden = { opacity: 0, y: '-100vh' };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case 'slideLeft':
        variants.hidden = { opacity: 0, x: '100vw' };
        variants.visible = { opacity: 1, x: 0 };
        break;
      case 'slideRight':
        variants.hidden = { opacity: 0, x: '-100vw' };
        variants.visible = { opacity: 1, x: 0 };
        break;
      case 'zoomIn':
        variants.hidden = { opacity: 0, scale: 0.5 };
        variants.visible = { opacity: 1, scale: 1 };
        break;
      case 'zoomOut':
        variants.hidden = { opacity: 0, scale: 1.5 };
        variants.visible = { opacity: 1, scale: 1 };
        break;
      case 'rotateIn':
        variants.hidden = { opacity: 0, rotate: -360 };
        variants.visible = { opacity: 1, rotate: 0 };
        break;
      case 'bounce':
        variants.hidden = { opacity: 0, y: '100vh' };
        variants.visible = { 
          opacity: 1, 
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
          }
        };
        break;
      case 'typewriter':
        variants.hidden = { opacity: 0, width: 0 };
        variants.visible = { opacity: 1, width: 'auto' };
        break;
      case 'glow':
        variants.hidden = { opacity: 0, textShadow: '0 0 0px rgba(255,255,255,0)' };
        variants.visible = { opacity: 1, textShadow: '0 0 40px rgba(255,255,255,0.9)' };
        break;
      case 'cinematicZoom':
        variants.hidden = { opacity: 0, scale: 2.0, filter: 'blur(20px)' };
        variants.visible = { opacity: 1, scale: 1, filter: 'blur(0px)' };
        break;
      default:
        variants.hidden = { opacity: 0 };
        variants.visible = { opacity: 1 };
    }
    
    // Налаштування виходу
    if (exitAnimation && exitAnimation !== 'none') {
      switch (exitAnimation) {
        case 'fadeOut':
          variants.exit = { opacity: 0 };
          break;
        case 'slideUp':
          variants.exit = { opacity: 0, y: '-100vh' };
          break;
        case 'slideDown':
          variants.exit = { opacity: 0, y: '100vh' };
          break;
        case 'slideLeft':
          variants.exit = { opacity: 0, x: '-100vw' };
          break;
        case 'slideRight':
          variants.exit = { opacity: 0, x: '100vw' };
          break;
        case 'zoomOut':
          variants.exit = { opacity: 0, scale: 0.5 };
          break;
        case 'zoomIn':
          variants.exit = { opacity: 0, scale: 1.5 };
          break;
        case 'rotateOut':
          variants.exit = { opacity: 0, rotate: 360 };
          break;
        case 'dissolve':
          variants.exit = { opacity: 0, filter: 'blur(20px)' };
          break;
        case 'cinematicZoomOut':
          variants.exit = { opacity: 0, scale: 2.0, filter: 'blur(20px)' };
          break;
        default:
          variants.exit = { opacity: 0 };
      }
    }
    const animationConfig = {
      initial: 'hidden',
      animate: isTextExiting ? 'exit' : 'visible',
      exit: 'exit',
      variants,
      transition: {
        duration,
        delay: delay * (element === 'title' ? 0 : element === 'subtitle' ? 1 : 2),
        type: enterAnimation === 'bounce' ? 'spring' : 'tween',
        stiffness: enterAnimation === 'bounce' ? 300 : undefined,
        damping: enterAnimation === 'bounce' ? 20 : undefined
      }
    };

    console.log(`🎭 IntroScreen: Animation config for ${element} (key: ${animationKey}):`, animationConfig);
    
    return animationConfig;
  };

  
  
  // ВИПРАВЛЕННЯ: Запуск музики тільки якщо НЕ увімкнено autoStartAfterWelcome
  useEffect(() => {
    const handleIntroMusic = async () => {
      // ВАЖЛИВО: Музика має грати тільки коли IntroScreen видимий і активний
      if (!visible || !introSettings.hasMusic || !introSettings.musicUrl || !audioRef.current) {
        console.log('🎵 IntroScreen: Музика НЕ запускається - компонент не видимий або налаштування відсутні');
        return;
      }

      // Перевіряємо чи не відкрита адмін панель або конструктор (музика не має грати в конструкторі)
      const isAdminPanelOpen = document.querySelector('.admin-panel-container') !== null;
      const isIntroCustomizerOpen = document.querySelector('[data-intro-customizer="true"]') !== null;
      const isMainCustomizerOpen = document.querySelector('[data-main-customizer="true"]') !== null;
      const isWelcomeCustomizerOpen = document.querySelector('[data-welcome-customizer="true"]') !== null;
      const isAnyCustomizerOpen = document.querySelector('[class*="customizer"]') !== null;
      
      if (isAdminPanelOpen || isIntroCustomizerOpen || isMainCustomizerOpen || isWelcomeCustomizerOpen || isAnyCustomizerOpen) {
        console.log('🎵 IntroScreen: Музика НЕ запускається - відкрита адмін панель або конструктор');
        return;
      }

      // Перевіряємо налаштування головної сторінки
      const mainSettings = await indexedDBService.loadSettings('mainPageSettings');
      const backgroundMusic = mainSettings?.audioSettings?.backgroundMusic;
      
      if (backgroundMusic?.enabled && backgroundMusic?.autoStartAfterWelcome) {
        console.log('🎵 IntroScreen: Режим постійної фонової музики - НЕ запускаємо власну музику');
        return; // Не запускаємо власну музику, грає фонова
      }

      console.log('🎵 IntroScreen: Режим окремої музики - запускаємо власну музику');
      
      // Спробуємо запустити музику
      const playAudio = async () => {
        try {
          await audioRef.current!.play();
          console.log('✅ IntroScreen: Власна музика запущена');
        } catch (error) {
          console.log('⚠️ IntroScreen: Автозапуск музики заблоковано, чекаємо взаємодії');
        }
      };
      
      playAudio();
    };
    
    handleIntroMusic();
  }, [visible, introSettings.hasMusic, introSettings.musicUrl]);

  // Автоматичне завершення інтро через 4 секунди + exit анімація тексту через 3 секунди
  useEffect(() => {
    if (!visible) {
      setIsTextExiting(false);
      return;
    }

    // Таймер для початку exit анімації тексту на 2.5 секунді
    const exitTimer = setTimeout(() => {
      setIsTextExiting(true);
    }, 2500);

    // Таймер для завершення інтро на 4 секунді
    const completeTimer = setTimeout(() => {
      // Зупиняємо аудіо і відео перед переходом на MainScreen
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Зупиняємо відео безпосередньо
      
      // Також зупиняємо стандартне відео якщо воно є
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      
      // Завершуємо інтро - exit анімація відбудеться автоматично
      onComplete();
    }, 4000); // Завершуємо на 4 секунді

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [visible, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div 
          key={`intro-container-${animationKey}`}
          className="intro-screen-container fixed inset-0 flex flex-col items-center justify-center z-50 overflow-visible"
          style={{
            ...getBackgroundStyle(),
            pointerEvents: 'auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1.0] // Плавніша крива анімації
            }
          }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.4, 
              ease: [0.25, 0.1, 0.25, 1.0] 
            }
          }}
        >
        {/* Фонове відео для IntroScreen - Стандартний підхід */}
        {introSettings.backgroundType === 'video' && introSettings.backgroundVideo && (
          <StandardVideoPlayer
            src={introSettings.backgroundVideo}
            context="IntroScreen"
            onPlay={() => console.log('🎬 IntroScreen: Відео почало відтворюватися')}
            onError={(e) => console.error('❌ IntroScreen: Помилка відео:', e)}
            onLoadStart={() => console.log('🎬 IntroScreen: Відео почало завантажуватися')}
            onCanPlay={() => console.log('🎬 IntroScreen: Відео готове до відтворення')}
            onLoadedData={() => console.log('🎬 IntroScreen: Відео дані завантажені')}
            onCanPlayThrough={() => console.log('🎬 IntroScreen: Відео може відтворюватися повністю')}
          />
        )}

        {/* Particles */}
        {introSettings.showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ backgroundColor: introSettings.particleColor }}
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: '100%',
                  opacity: 0 
                }}
                animate={{ 
                  y: '-10%',
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* 🌐 Spline 3D Animation */}
        {introSettings.splineSettings?.enabled && (
          <SplineAnimation
            sceneUrl={introSettings.splineSettings.sceneUrl}
            embedCode={introSettings.splineSettings.embedCode}
            localFile={introSettings.splineSettings.localFile}
            position={introSettings.splineSettings.position}
            opacity={introSettings.splineSettings.opacity}
            scale={introSettings.splineSettings.scale}
            autoplay={introSettings.splineSettings.autoplay}
            controls={introSettings.splineSettings.controls}
            method={introSettings.splineSettings.method}
            className="intro-screen-spline"
          />
        )}

        <div
          className="w-full h-full flex flex-col items-center justify-center relative z-10"
        >
          <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center px-4">
            {/* Background elements */}
            <div
              className="absolute inset-0 -z-10"
            >
              <div
                className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
              />
              <div
                className="absolute -bottom-[150px] -right-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
              />
            </div>
            
            {/* Main content */}
            <div className="flex flex-col items-center text-center">
              {/* Logo */}
              {introSettings.logoUrl && (
                <motion.img
                  key={`logo-${animationKey}`}
                  src={introSettings.logoUrl}
                  alt="Logo"
                  className="object-contain mb-6"
                  style={{
                    width: `${introSettings.logoSize}px`,
                    height: `${introSettings.logoSize}px`
                  }}
                  {...getAnimationVariants('title')}
                />
              )}

              {/* Title */}
              <motion.h1 
                key={`title-${animationKey}`}
                className="text-4xl md:text-5xl font-light mb-6 text-center leading-tight"
                style={getTextStyle('title')}
                {...getAnimationVariants('title')}
              >
                <span className="font-light">{introSettings.title}</span>
              </motion.h1>
              
              {/* Subtitle */}
              <motion.h2 
                key={`subtitle-${animationKey}`}
                className="text-lg md:text-xl mb-8 text-center leading-relaxed"
                style={getTextStyle('subtitle')}
                {...getAnimationVariants('subtitle')}
              >
                <span className="tracking-tight">{introSettings.subtitle}</span>
              </motion.h2>
              
              {/* Description */}
              <motion.p 
                key={`description-${animationKey}`}
                className="text-base md:text-lg mb-8 text-center leading-relaxed max-w-md mx-auto"
                style={getTextStyle('description')}
                {...getAnimationVariants('description')}
              >
                {introSettings.description}
              </motion.p>
              
              {/* Decorative line */}
              <motion.div
                key={`line-${animationKey}`}
                className="w-[80px] h-[3px] rounded-full mt-8 mb-1"
                style={{ 
                  background: `linear-gradient(to right, ${introSettings.textColor}, ${introSettings.textColor}70)` 
                }}
                {...getAnimationVariants('description')}
              />
            </div>
          </div>
        </div>

        {/* Background music */}
        {introSettings.hasMusic && introSettings.musicUrl && (
          <audio autoPlay loop className="hidden" ref={audioRef}>
            <source src={introSettings.musicUrl} type="audio/mpeg" />
          </audio>
        )}
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
