import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { responsiveFontSize } from '../lib/utils';
import SplineAnimation from './SplineAnimation';
import indexedDBService from '../services/IndexedDBService';

interface WelcomeScreenPreviewProps {
  className?: string;
}

interface WelcomeSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hintText: string;
  backgroundType: 'gradient' | 'color' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  textColor: string;
  subtitleColor: string;
  descriptionColor: string;
  buttonColor: string;
  buttonTextColor: string;
  logoUrl: string;
  logoSize?: number;
  showLogo: boolean;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  musicLoop: boolean;
  autoPlay: boolean;
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
  // Анімації
  titleAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  subtitleAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  descriptionAnimation?: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  titleExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  subtitleExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  descriptionExitAnimation?: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  animationDuration?: number;
  animationDelay?: number;
  // Typography settings
  titleFontSize?: number;
  subtitleFontSize?: number;
  descriptionFontSize?: number;
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
  titleShadowIntensity?: number;
  subtitleShadowIntensity?: number;
  descriptionShadowIntensity?: number;
  titleShadowColor?: string;
  subtitleShadowColor?: string;
  descriptionShadowColor?: string;
  title3DDepth?: number;
  subtitle3DDepth?: number;
  description3DDepth?: number;
  splineSettings?: {
    enabled: boolean;
    sceneUrl: string;
    embedCode: string;
    localFile: string;
    position: 'background' | 'foreground' | 'overlay';
    opacity: number;
    scale: number;
    autoplay: boolean;
    controls: boolean;
    method: 'iframe' | 'component' | 'local';
  };
}

const defaultSettings: WelcomeSettings = {
  title: "SMM OS",
  subtitle: "Welcome",
  description: "Everything you need for your SMM\nin one place",
  buttonText: "Enter",
  hintText: "Tap to enter and start music",
  backgroundType: 'gradient',
  backgroundColor: '#f9fafb',
  gradientFrom: '#f9fafb',
  gradientTo: '#f7f8fa',
  backgroundImage: '',
  backgroundVideo: '',
  textColor: '#111111',
  subtitleColor: '#333333',
  descriptionColor: '#666666',
  buttonColor: '#4a4b57',
  buttonTextColor: '#ffffff',
  logoUrl: '',
  showLogo: true,
  hasMusic: false,
  musicUrl: '',
  musicVolume: 0.5,
  musicLoop: true,
  autoPlay: true,
  showParticles: false,
  particleColor: '#ffffff',
  animationSpeed: 'normal',
  // Дефолтні анімації
  titleAnimation: 'fadeIn',
  subtitleAnimation: 'slideUp',
  descriptionAnimation: 'fadeIn',
  titleExitAnimation: 'fadeOut',
  subtitleExitAnimation: 'slideDown',
  descriptionExitAnimation: 'fadeOut',
  animationDuration: 800,
  animationDelay: 200,
  // Default typography settings
  titleFontSize: 32,
  subtitleFontSize: 20,
  descriptionFontSize: 14,
  titleFontFamily: 'Inter',
  subtitleFontFamily: 'Inter',
  descriptionFontFamily: 'Inter',
  titleFontWeight: 300,
  subtitleFontWeight: 300,
  descriptionFontWeight: 400,
  titleFontStyle: 'normal',
  subtitleFontStyle: 'normal',
  descriptionFontStyle: 'normal',
  // Тіні та ефекти
  titleShadowIntensity: 0,
  subtitleShadowIntensity: 0,
  descriptionShadowIntensity: 0,
  titleShadowColor: '#000000',
  subtitleShadowColor: '#000000',
  descriptionShadowColor: '#000000',
  title3DDepth: 0,
  subtitle3DDepth: 0,
  description3DDepth: 0,
  splineSettings: {
    enabled: true,
    sceneUrl: "https://prod.spline.design/Li0xtQwxHAu6qXGd/scene.splinecode",
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

const WelcomeScreenPreview = ({ className }: WelcomeScreenPreviewProps) => {
  console.log('🎬 WelcomeScreenPreview: Component rendering');
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Завантаження налаштувань
  useEffect(() => {
    console.log('🔄 WelcomeScreenPreview: useEffect triggered, loading settings...');
    loadWelcomeSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 WelcomeScreenPreview: Отримано оновлення налаштувань:', {
        titleFontSize: event.detail.titleFontSize,
        titleFontFamily: event.detail.titleFontFamily,
        titleFontWeight: event.detail.titleFontWeight,
        titleText: event.detail.title,
        // Додаю логи для тіней
        titleShadowIntensity: event.detail.titleShadowIntensity,
        titleShadowColor: event.detail.titleShadowColor,
        title3DDepth: event.detail.title3DDepth,
        subtitleShadowIntensity: event.detail.subtitleShadowIntensity,
        descriptionShadowIntensity: event.detail.descriptionShadowIntensity,
        // Додаю логи для анімацій
        titleAnimation: event.detail.titleAnimation,
        subtitleAnimation: event.detail.subtitleAnimation,
        descriptionAnimation: event.detail.descriptionAnimation,
        animationDuration: event.detail.animationDuration,
        animationDelay: event.detail.animationDelay,
        // ПОВНИЙ ОБ'ЄКТ для діагностики
        fullDetailKeys: Object.keys(event.detail),
        fullDetail: event.detail
      });
      setSettings(prev => {
        const newSettings = { ...prev, ...event.detail };
        console.log('🔄 WelcomeScreenPreview: Нові налаштування після мержингу:', {
          titleFontSize: newSettings.titleFontSize,
          titleFontFamily: newSettings.titleFontFamily,
          titleFontWeight: newSettings.titleFontWeight,
          title: newSettings.title,
          // Додаю логи для тіней
          titleShadowIntensity: newSettings.titleShadowIntensity,
          titleShadowColor: newSettings.titleShadowColor,
          title3DDepth: newSettings.title3DDepth,
          // Додаю логи для анімацій
          titleAnimation: newSettings.titleAnimation,
          subtitleAnimation: newSettings.subtitleAnimation,
          descriptionAnimation: newSettings.descriptionAnimation,
          animationDuration: newSettings.animationDuration,
          animationDelay: newSettings.animationDelay
        });
        return newSettings;
      });
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // Перезапуск анімацій при зміні налаштувань
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
    console.log('🎭 WelcomeScreenPreview: Animation key updated:', animationKey + 1);
  }, [settings.titleAnimation, settings.subtitleAnimation, settings.descriptionAnimation, settings.animationDuration, settings.animationDelay]);

  const loadWelcomeSettings = async () => {
    console.log('📥 WelcomeScreenPreview: loadWelcomeSettings called');
    try {
      // Load from IndexedDB first
      const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
      console.log('📂 WelcomeScreenPreview: IndexedDB result:', indexedDBSettings);
      
      if (indexedDBSettings) {
        console.log('✅ WelcomeScreenPreview: Settings found in IndexedDB');
        const safeSettings = {
          ...defaultSettings,
          ...indexedDBSettings,
          splineSettings: {
            ...defaultSettings.splineSettings,
            ...(indexedDBSettings.splineSettings || {})
          }
        };
        
        console.log('🔧 WelcomeScreenPreview: Merged settings:', safeSettings.splineSettings);
        setSettings(safeSettings);
        return;
      }
      
      // Fallback to localStorage
      const savedSettings = localStorage.getItem('welcomeSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        const safeSettings = {
          ...defaultSettings,
          ...parsed,
          splineSettings: {
            ...defaultSettings.splineSettings,
            ...(parsed.splineSettings || {})
          }
        };
        
        setSettings(safeSettings);
        
        // Migrate to IndexedDB
        await indexedDBService.saveSettings('welcomeSettings', safeSettings, 'project');
      }
    } catch (error) {
      console.error('❌ WelcomeScreenPreview: Помилка завантаження налаштувань:', error);
      setSettings(defaultSettings);
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

  // Функція для генерації стилів тексту з тінями та ефектами
  const getTextStyle = (element: 'title' | 'subtitle' | 'description') => {
    const baseStyle: any = {
      color: element === 'title' ? settings.textColor : 
             element === 'subtitle' ? settings.subtitleColor : 
             settings.descriptionColor,
      fontFamily: settings[`${element}FontFamily`] || 'Inter',
      fontWeight: settings[`${element}FontWeight`] || (element === 'description' ? 400 : 300),
      fontStyle: settings[`${element}FontStyle`] || 'normal',
      fontSize: element === 'title' ? responsiveFontSize(settings.titleFontSize || 32) :
                element === 'subtitle' ? `${settings.subtitleFontSize || 20}px` :
                `${settings.descriptionFontSize || 14}px`
    };

    // Додавання тіней
    const shadowIntensity = settings[`${element}ShadowIntensity`] || 0;
    const shadowColor = settings[`${element}ShadowColor`] || '#000000';
    const depth3D = settings[`${element}3DDepth`] || 0;

    // Додаю логи для діагностики
    console.log(`🌟 WelcomeScreenPreview getTextStyle для ${element}:`, {
      shadowIntensity,
      shadowColor,
      depth3D,
      fullSettings: {
        titleShadowIntensity: settings.titleShadowIntensity,
        subtitleShadowIntensity: settings.subtitleShadowIntensity,
        descriptionShadowIntensity: settings.descriptionShadowIntensity
      }
    });

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };

    if (depth3D > 0) {
      // 3D ефект
      const shadows = Array.from({ length: depth3D }, (_, i) => 
        `${i + 1}px ${i + 1}px 0 ${shadowColor}`
      ).join(', ');
      baseStyle.textShadow = shadows;
      console.log(`🌟 WelcomeScreenPreview: Застосовано 3D тінь для ${element}:`, shadows);
    } else if (shadowIntensity > 0) {
      // Звичайна тінь
      const offset = Math.round(shadowIntensity * 4);
      const blur = Math.round(shadowIntensity * 8);
      baseStyle.textShadow = `${offset}px ${offset}px ${blur}px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity})`;
      console.log(`🌟 WelcomeScreenPreview: Застосовано звичайну тінь для ${element}:`, baseStyle.textShadow);
    }

    return baseStyle;
  };

  // Функція для отримання варіантів анімацій
  const getAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? settings.titleAnimation :
                          element === 'subtitle' ? settings.subtitleAnimation :
                          settings.descriptionAnimation;
    
    console.log(`🎭 WelcomeScreenPreview: getAnimationVariants для ${element}:`, {
      enterAnimation,
      settingsAnimations: {
        titleAnimation: settings.titleAnimation,
        subtitleAnimation: settings.subtitleAnimation,
        descriptionAnimation: settings.descriptionAnimation
      }
    });

    // Якщо анімація 'none' або не задана, повертаємо статичну анімацію
    if (!enterAnimation || enterAnimation === 'none') {
      console.log(`🎭 WelcomeScreenPreview: No animation for ${element}, returning static`);
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }
    
    const exitAnimation = element === 'title' ? settings.titleExitAnimation :
                         element === 'subtitle' ? settings.subtitleExitAnimation :
                         settings.descriptionExitAnimation;

    const duration = (settings.animationDuration || 800) / 1000;
    const delay = (settings.animationDelay || 200) / 1000;

    const variants: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
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
      default:
        variants.hidden = { opacity: 0 };
        variants.visible = { opacity: 1 };
    }

    const animationConfig = {
      initial: 'hidden',
      animate: 'visible',
      variants,
      transition: {
        duration,
        delay: delay * (element === 'title' ? 0 : element === 'subtitle' ? 1 : 2),
        type: enterAnimation === 'bounce' ? 'spring' : 'tween',
        stiffness: enterAnimation === 'bounce' ? 300 : undefined,
        damping: enterAnimation === 'bounce' ? 20 : undefined
      }
    };

    console.log(`🎭 WelcomeScreenPreview: Animation config for ${element}:`, animationConfig);
    
    return animationConfig;
  };

  console.log('🎨 WelcomeScreenPreview: Rendering with settings:', settings.splineSettings);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full h-full flex items-center justify-center relative ${className}`}
      style={getBackgroundStyle()}
    >
      {/* Background video */}
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

      {/* Spline 3D Animation */}
      {(() => {
        console.log('🔍 WelcomeScreenPreview: Spline debug:', {
          hasSplineSettings: !!settings.splineSettings,
          enabled: settings.splineSettings?.enabled,
          sceneUrl: settings.splineSettings?.sceneUrl,
          fullSettings: settings.splineSettings
        });
        
        return settings.splineSettings?.enabled && (
          <SplineAnimation
            sceneUrl={settings.splineSettings.sceneUrl}
            embedCode={settings.splineSettings.embedCode}
            localFile={settings.splineSettings.localFile}
            position={settings.splineSettings.position}
            opacity={settings.splineSettings.opacity}
            scale={settings.splineSettings.scale}
            autoplay={settings.splineSettings.autoplay}
            controls={settings.splineSettings.controls}
            method={settings.splineSettings.method}
            className="absolute inset-0"
          />
        );
      })()}

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden z-1">
        <motion.div 
          className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="relative text-center px-6 max-w-md mx-auto z-10">
        {/* Logo and Title */}
        <div className="mb-8">
          {/* Logo - only if logoUrl exists */}
          {settings.logoUrl && (
            <div className="flex items-center justify-center mb-4">
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-auto h-auto object-contain"
                style={{ 
                  maxWidth: `${settings.logoSize || 96}px`, 
                  maxHeight: `${settings.logoSize || 96}px`,
                  width: 'auto',
                  height: 'auto'
                }}
              />
            </div>
          )}
          
          {/* Title - always show if exists */}
          {settings.title && (
            <motion.h1 
              key={`title-${animationKey}`}
              className="sf-text" 
              style={getTextStyle('title')}
              {...getAnimationVariants('title')}
            >
              {settings.title}
            </motion.h1>
          )}
        </div>

        {/* Welcome text */}
        <div className="mb-12">
          <motion.h2 
            key={`subtitle-${animationKey}`}
            className="mb-3 sf-heading" 
            style={getTextStyle('subtitle')}
            {...getAnimationVariants('subtitle')}
          >
            {settings.subtitle}
          </motion.h2>
          <motion.p 
            key={`description-${animationKey}`}
            className="leading-relaxed sf-body" 
            style={getTextStyle('description')}
            {...getAnimationVariants('description')}
          >
            {settings.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < settings.description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </motion.p>
        </div>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            className="relative px-8 py-4 rounded-full font-medium transition-all duration-300 transform scale-100 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: settings.buttonColor,
              color: settings.buttonTextColor,
            }}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">🎵</span>
              {settings.buttonText}
            </span>
          </button>
        </motion.div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xs mt-6 sf-body"
          style={{ color: settings.descriptionColor, opacity: 0.7 }}
        >
          {settings.hintText}
        </motion.p>
      </div>

      {/* Власна фонова музика для превью */}
      {settings.hasMusic && settings.musicUrl && (
        <audio 
          loop={settings.musicLoop}
          className="hidden"
        >
          <source src={settings.musicUrl} type="audio/mpeg" />
          <source src={settings.musicUrl} type="audio/wav" />
          <source src={settings.musicUrl} type="audio/ogg" />
        </audio>
      )}
    </motion.div>
  );
};

export default WelcomeScreenPreview;