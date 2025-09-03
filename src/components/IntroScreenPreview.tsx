import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import indexedDBService from '../services/IndexedDBService';
import SplineAnimation from './SplineAnimation';
import { responsiveFontSize } from '../lib/utils';


interface IntroScreenPreviewProps {
  className?: string;
}

interface IntroSettings {
  // Основний контент
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  logoUrl: string;
  logoSize?: number;
  
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
  
  // Анімації - вхідні
  titleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  subtitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  descriptionAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow' | 'cinematicZoom';
  // Анімації - вихідні
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
  audioSettings?: {
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
  animationSpeed?: 'slow' | 'normal' | 'fast';
  autoPlay?: boolean;
  
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
  
  // Анімації - вхідні
  titleAnimation: 'fadeIn',
  subtitleAnimation: 'slideDown',
  descriptionAnimation: 'fadeIn',
  // Анімації - вихідні
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

const IntroScreenPreview = ({ className }: IntroScreenPreviewProps) => {
  const [introSettings, setIntroSettings] = useState<IntroSettings>(defaultSettings);
  const [windowWidth, setWindowWidth] = useState<number>(1200); // Default desktop width
  const [animationKey, setAnimationKey] = useState(0);

  // Детекція розміру екрану
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Визначення поточного пристрою
  const getCurrentDevice = (): 'mobile' | 'tablet' | 'desktop' => {
    if (windowWidth < 768) return 'mobile';
    if (windowWidth < 1024) return 'tablet';
    return 'desktop';
  };

  // Отримання адаптивних налаштувань
  const getResponsiveSettings = () => {
    const device = getCurrentDevice();
    return introSettings[device];
  };
  
  // Debounce ref для оптимізації оновлень
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Завантаження налаштувань інтро через IndexedDB з debouncing
  useEffect(() => {
    loadIntroSettings();
    
    // Debounced слухач для оновлення даних з конструктора інтро
    const handleIntroSettingsUpdate = (event: CustomEvent) => {

      const newSettings = event.detail;
      
      // Очищуємо попередній timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      // Debounce оновлення (200ms)
      updateTimeoutRef.current = setTimeout(() => {
        const updatedSettings = { ...introSettings, ...newSettings };
        setIntroSettings(updatedSettings);
      }, 200);
    };

    window.addEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const loadIntroSettings = async () => {
    try {
      console.log('🔄 IntroScreenPreview: Завантаження налаштувань через IndexedDBService...');
      
      // Спочатку пробуємо завантажити з IndexedDB
      const indexedDBSettings = await indexedDBService.loadSettings('introSettings');
      
      if (indexedDBSettings) {
        console.log('✅ IntroScreenPreview: Налаштування завантажено з IndexedDB');
        setIntroSettings(prev => ({ ...prev, ...indexedDBSettings }));
        return;
      }
      
      // Якщо IndexedDB порожній, пробуємо localStorage як резерв
      console.log('ℹ️ IntroScreenPreview: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
      
      const savedSettings = localStorage.getItem('introSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('✅ IntroScreenPreview: Налаштування завантажено з localStorage');
        setIntroSettings(prev => ({ ...prev, ...settings }));
        
        // Мігруємо в IndexedDB
        console.log('🔄 IntroScreenPreview: Міграція налаштувань в IndexedDB...');
        await indexedDBService.saveSettings('introSettings', settings, 'project');
        console.log('✅ IntroScreenPreview: Міграція завершена');
      }
    } catch (error) {
      console.error('❌ IntroScreenPreview: Помилка завантаження налаштувань:', error);
    }
  };

  const getBackgroundStyle = () => {
    switch (introSettings.backgroundType) {
      case 'color':
        return { backgroundColor: introSettings.backgroundColor };
      case 'gradient':
        return { 
          background: `linear-gradient(135deg, ${introSettings.gradientFrom}, ${introSettings.gradientTo})` 
        };
      case 'image':
        return { 
          backgroundImage: `url(${introSettings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: introSettings.backgroundColor };
    }
  };



  // Генерація стилів тексту з тінями та ефектами
  const getTextStyle = (
    element: 'title' | 'subtitle' | 'description',
    responsiveSettings: any
  ) => {
    const baseStyle: any = {
      color: introSettings.textColor,
      fontFamily: introSettings[`${element}FontFamily`],
      fontWeight: introSettings[`${element}FontWeight`],
      fontStyle: introSettings[`${element}FontStyle`],
      fontSize: responsiveFontSize(responsiveSettings[`${element}FontSize`]),
      lineHeight: responsiveSettings[`${element}LineHeight`],
      letterSpacing: `${responsiveSettings[`${element}LetterSpacing`]}px`,
      marginBottom: `${responsiveSettings[`${element}MarginBottom`]}px`,
    };

    // Додавання тіней
    const shadowIntensity = introSettings[`${element}ShadowIntensity`];
    const shadowColor = introSettings[`${element}ShadowColor`];
    if (shadowIntensity > 0) {
      const offset = Math.round(shadowIntensity * 4);
      const blur = Math.round(shadowIntensity * 8);
      baseStyle.textShadow = `${offset}px ${offset}px ${blur}px ${shadowColor}${Math.round(shadowIntensity * 255).toString(16).padStart(2, '0')}`;
    }

    // Додавання 3D ефекту
    const depth3D = introSettings[`${element}3DDepth`];
    if (depth3D > 0) {
      const shadows = Array.from({ length: depth3D }, (_, i) => 
        `${i + 1}px ${i + 1}px 0 ${shadowColor}`
      ).join(', ');
      baseStyle.textShadow = shadows;
    }

    return baseStyle;
  };

  // useEffect для перезапуску анімацій при зміні налаштувань
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [introSettings.titleAnimation, introSettings.subtitleAnimation, introSettings.descriptionAnimation, introSettings.titleExitAnimation, introSettings.subtitleExitAnimation, introSettings.descriptionExitAnimation, introSettings.animationDuration, introSettings.animationDelay]);

  // useEffect для циклічного показу анімацій вхід -> показ -> вихід -> повтор
  useEffect(() => {
    const enterDuration = (introSettings.animationDuration || 800);
    const maxDelay = (introSettings.animationDelay || 200) * 2; // Максимальна затримка для опису
    const showTime = 800; // 0.8 секунди показу після входу
    const totalCycleTime = enterDuration + maxDelay + showTime + enterDuration + 500; // Вхід + показ + вихід + пауза

    const timer = setTimeout(() => {
      setAnimationKey(prev => prev + 1); // Перезапускаємо цикл
    }, totalCycleTime);

    return () => clearTimeout(timer);
  }, [animationKey, introSettings.animationDuration, introSettings.animationDelay]);

  // Функція для отримання варіантів анімацій
  const getAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? introSettings.titleAnimation :
                          element === 'subtitle' ? introSettings.subtitleAnimation :
                          introSettings.descriptionAnimation;
    
    const exitAnimation = element === 'title' ? introSettings.titleExitAnimation :
                         element === 'subtitle' ? introSettings.subtitleExitAnimation :
                         introSettings.descriptionExitAnimation;
    
    console.log(`🎭 IntroScreenPreview: getAnimationVariants для ${element}:`, {
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
      console.log(`🎭 IntroScreenPreview: No animation for ${element}, returning static`);
      return {
        initial: { opacity: 1 },
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
        variants.hidden = { opacity: 0, y: 50 };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case 'slideDown':
        variants.hidden = { opacity: 0, y: -50 };
        variants.visible = { opacity: 1, y: 0 };
        break;
      case 'slideLeft':
        variants.hidden = { opacity: 0, x: 50 };
        variants.visible = { opacity: 1, x: 0 };
        break;
      case 'slideRight':
        variants.hidden = { opacity: 0, x: -50 };
        variants.visible = { opacity: 1, x: 0 };
        break;
      case 'zoomIn':
        variants.hidden = { opacity: 0, scale: 0.8 };
        variants.visible = { opacity: 1, scale: 1 };
        break;
      case 'zoomOut':
        variants.hidden = { opacity: 0, scale: 1.2 };
        variants.visible = { opacity: 1, scale: 1 };
        break;
      case 'rotateIn':
        variants.hidden = { opacity: 0, rotate: -180 };
        variants.visible = { opacity: 1, rotate: 0 };
        break;
      case 'bounce':
        variants.hidden = { opacity: 0, y: 50 };
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
        variants.visible = { opacity: 1, textShadow: '0 0 20px rgba(255,255,255,0.8)' };
        break;
      case 'cinematicZoom':
        variants.hidden = { opacity: 0, scale: 1.5, filter: 'blur(10px)' };
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
          variants.exit = { opacity: 0, y: -50 };
          break;
        case 'slideDown':
          variants.exit = { opacity: 0, y: 50 };
          break;
        case 'slideLeft':
          variants.exit = { opacity: 0, x: -50 };
          break;
        case 'slideRight':
          variants.exit = { opacity: 0, x: 50 };
          break;
        case 'zoomOut':
          variants.exit = { opacity: 0, scale: 0.8 };
          break;
        case 'zoomIn':
          variants.exit = { opacity: 0, scale: 1.2 };
          break;
        case 'rotateOut':
          variants.exit = { opacity: 0, rotate: 180 };
          break;
        case 'dissolve':
          variants.exit = { opacity: 0, filter: 'blur(10px)' };
          break;
        case 'cinematicZoomOut':
          variants.exit = { opacity: 0, scale: 1.5, filter: 'blur(10px)' };
          break;
        default:
          variants.exit = { opacity: 0 };
      }
    }

    const animationConfig = {
      initial: 'hidden',
      animate: 'visible',
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

    console.log(`🎭 IntroScreenPreview: Animation config for ${element}:`, animationConfig);
    
    return animationConfig;
  };

  const responsiveSettings = getResponsiveSettings();

  // Відстеження критичних змін introSettings (зменшено логування)
  useEffect(() => {
    // Логуємо тільки важливі зміни
    if (introSettings.splineSettings?.enabled && introSettings.splineSettings.sceneUrl) {
      console.log('🌐 IntroScreenPreview: Spline активний з URL:', introSettings.splineSettings.sceneUrl.substring(0, 50) + '...');
    }
  }, [introSettings.splineSettings?.enabled, introSettings.splineSettings?.sceneUrl]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        ...getBackgroundStyle(),
        padding: `${responsiveSettings.containerPadding}px`,
        marginTop: `${responsiveSettings.containerMarginTop}px`,
        marginBottom: `${responsiveSettings.containerMarginBottom}px`
      }}
    >

      {/* Background video */}
      {introSettings.backgroundType === 'video' && introSettings.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={introSettings.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Spline 3D Animation - мемоізовано */}
      {useMemo(() => {
        const splineSettings = introSettings.splineSettings;
        const shouldRender = splineSettings?.enabled && 
                           (splineSettings.sceneUrl || splineSettings.embedCode || splineSettings.localFile);
        
        if (!shouldRender) return null;
        
        return (
          <SplineAnimation
            sceneUrl={splineSettings.sceneUrl || ''}
            embedCode={splineSettings.embedCode || ''}
            localFile={splineSettings.localFile || ''}
            position={splineSettings.position || 'background'}
            opacity={splineSettings.opacity ?? 1}
            scale={splineSettings.scale ?? 1}
            autoplay={splineSettings.autoplay ?? true}
            controls={splineSettings.controls ?? false}
            method={splineSettings.method || 'component'}
          />
        );
      }, [
        introSettings.splineSettings?.enabled,
        introSettings.splineSettings?.sceneUrl,
        introSettings.splineSettings?.embedCode,
        introSettings.splineSettings?.localFile,
        introSettings.splineSettings?.position,
        introSettings.splineSettings?.opacity,
        introSettings.splineSettings?.scale,
        introSettings.splineSettings?.autoplay,
        introSettings.splineSettings?.controls,
        introSettings.splineSettings?.method
      ])}

      {/* Particles */}
      {introSettings.showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
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

      <motion.div
        className="w-full h-full flex flex-col items-center justify-center relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: [0.1, 0.4, 0.2, 1.0] } }}
      >
        <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center">
          {/* Background elements */}
          <motion.div
            className="absolute inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.1, 0.4, 0.2, 1.0] }}
          >
            <motion.div
              className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.1, 0.4, 0.2, 1.0] }}
            />
            <motion.div
              className="absolute -bottom-[150px] -right-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.1, 0.4, 0.2, 1.0] }}
            />
          </motion.div>
          
          {/* Main content */}
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo */}
            {introSettings.logoUrl && (
              <AnimatePresence mode="wait">
                <motion.img
                  key={`logo-${animationKey}`}
                  src={introSettings.logoUrl}
                  alt="Logo"
                  className="w-auto h-auto object-contain mb-4"
                  style={{ 
                    maxWidth: `${introSettings.logoSize || 96}px`, 
                    maxHeight: `${introSettings.logoSize || 96}px`,
                    width: 'auto',
                    height: 'auto'
                  }}
                  {...getAnimationVariants('title')}
                />
              </AnimatePresence>
            )}

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${animationKey}`}
                style={getTextStyle('title', responsiveSettings)}
                className="font-bold tracking-tighter drop-shadow-lg"
                {...getAnimationVariants('title')}
              >
                {introSettings.title}
              </motion.h1>
            </AnimatePresence>
            
            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${animationKey}`}
                style={getTextStyle('subtitle', responsiveSettings)}
                className="tracking-tight drop-shadow-md"
                {...getAnimationVariants('subtitle')}
              >
                {introSettings.subtitle}
              </motion.p>
            </AnimatePresence>
            
            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`description-${animationKey}`}
                style={getTextStyle('description', responsiveSettings)}
                className="max-w-md text-center drop-shadow-md opacity-80"
                {...getAnimationVariants('description')}
              >
                {introSettings.description}
              </motion.p>
            </AnimatePresence>
            
            {/* Decorative line */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`line-${animationKey}`}
                className="w-[60px] h-[2px] rounded-full mt-4 mb-1"
                style={{ 
                  background: `linear-gradient(to right, ${introSettings.textColor}, ${introSettings.textColor}70)` 
                }}
                {...getAnimationVariants('description')}
              />
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>


    </div>
  );
};

export default IntroScreenPreview; 