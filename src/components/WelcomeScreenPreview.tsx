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
  title: undefined,               // 🔴 Контролюється конструктором!
  subtitle: undefined,            // 🔴 Контролюється конструктором!
  description: undefined,         // 🔴 Контролюється конструктором!
  buttonText: undefined,          // 🔴 Контролюється конструктором!
  hintText: "Tap to enter and start music",
  backgroundType: 'gradient',
  backgroundColor: '#f9fafb',
  gradientFrom: '#f9fafb',
  gradientTo: '#f7f8fa',
  backgroundImage: '',
  backgroundVideo: '',
  textColor: undefined,           // 🎨 Контролюється конструктором!
  subtitleColor: undefined,       // 🎨 Контролюється конструктором!
  descriptionColor: undefined,    // 🎨 Контролюється конструктором!
  buttonColor: undefined,         // 🎨 Контролюється конструктором!
  buttonTextColor: undefined,     // 🎨 Контролюється конструктором!
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
  titleAnimation: undefined,      // 🔴 Контролюється конструктором!
  subtitleAnimation: undefined,   // 🔴 Контролюється конструктором!
  descriptionAnimation: undefined, // 🔴 Контролюється конструктором!
  titleExitAnimation: undefined,  // 🔴 Контролюється конструктором!
  subtitleExitAnimation: undefined, // 🔴 Контролюється конструктором!
  descriptionExitAnimation: undefined, // 🔴 Контролюється конструктором!
  animationDuration: undefined,   // 🔴 Контролюється конструктором!
  animationDelay: undefined,      // 🔴 Контролюється конструктором!
  // Default typography settings
  titleFontSize: undefined,       // 🔴 Контролюється конструктором!
  subtitleFontSize: undefined,    // 🔴 Контролюється конструктором!
  descriptionFontSize: undefined, // 🔴 Контролюється конструктором!
  titleFontFamily: undefined,     // 🔴 Контролюється конструктором!
  subtitleFontFamily: undefined,  // 🔴 Контролюється конструктором!
  descriptionFontFamily: undefined, // 🔴 Контролюється конструктором!
  titleFontWeight: undefined,     // 🔴 Контролюється конструктором!
  subtitleFontWeight: undefined,  // 🔴 Контролюється конструктором!
  descriptionFontWeight: undefined, // 🔴 Контролюється конструктором!
  titleFontStyle: undefined,      // 🔴 Контролюється конструктором!
  subtitleFontStyle: undefined,   // 🔴 Контролюється конструктором!
  descriptionFontStyle: undefined, // 🔴 Контролюється конструктором!
  // Тіні та ефекти - контролюються конструктором
  titleShadowIntensity: undefined,    // 🌟 Контролюється конструктором!
  subtitleShadowIntensity: undefined, // 🌟 Контролюється конструктором!
  descriptionShadowIntensity: undefined, // 🌟 Контролюється конструктором!
  titleShadowColor: undefined,        // 🌟 Контролюється конструктором!
  subtitleShadowColor: undefined,     // 🌟 Контролюється конструктором!
  descriptionShadowColor: undefined,  // 🌟 Контролюється конструктором!
  title3DDepth: undefined,            // 🌟 Контролюється конструктором!
  subtitle3DDepth: undefined,         // 🌟 Контролюється конструктором!
  description3DDepth: undefined,      // 🌟 Контролюється конструктором!
  splineSettings: undefined             // 🌐 Контролюється конструктором!
};

const WelcomeScreenPreview = ({ className }: WelcomeScreenPreviewProps) => {
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  const [animationKey, setAnimationKey] = useState(0);
  
  // Завантаження налаштувань
  useEffect(() => {
    loadWelcomeSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
              setSettings(prev => {
        const newSettings = { ...prev, ...event.detail };
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
  }, [settings.titleAnimation, settings.subtitleAnimation, settings.descriptionAnimation, settings.animationDuration, settings.animationDelay]);

  const loadWelcomeSettings = async () => {
    try {
      // Load from IndexedDB first
      const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
      
      if (indexedDBSettings) {
        const safeSettings = {
          ...defaultSettings,
          ...indexedDBSettings,
          splineSettings: {
            ...defaultSettings.splineSettings,
            ...(indexedDBSettings.splineSettings || {})
          }
        };
        
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
    };

    // 🔴 ТІЛЬКИ ЯКЩО ЗАДАНО В КОНСТРУКТОРІ!
    if (settings[`${element}FontFamily`]) {
      baseStyle.fontFamily = settings[`${element}FontFamily`];
    }
    
    if (settings[`${element}FontWeight`]) {
      baseStyle.fontWeight = settings[`${element}FontWeight`];
    }
    
    if (settings[`${element}FontStyle`]) {
      baseStyle.fontStyle = settings[`${element}FontStyle`];
    }
    
    if (settings[`${element}FontSize`]) {
      if (element === 'title') {
        baseStyle.fontSize = responsiveFontSize(settings.titleFontSize);
      } else if (element === 'subtitle') {
        baseStyle.fontSize = `${settings.subtitleFontSize}px`;
      } else {
        baseStyle.fontSize = `${settings.descriptionFontSize}px`;
      }
    }

    // Додавання тіней - 🔴 ТІЛЬКИ ЯКЩО ЗАДАНО В КОНСТРУКТОРІ!
    const shadowIntensity = settings[`${element}ShadowIntensity`] ?? 0;
    const shadowColor = settings[`${element}ShadowColor`] ?? '#000000';
    const depth3D = settings[`${element}3DDepth`] ?? 0;



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

    } else if (shadowIntensity > 0) {
      // Звичайна тінь
      const offset = Math.round(shadowIntensity * 4);
      const blur = Math.round(shadowIntensity * 8);
      baseStyle.textShadow = `${offset}px ${offset}px ${blur}px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity})`;

    }

    return baseStyle;
  };

  // Функція для отримання варіантів анімацій
  const getAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? settings.titleAnimation :
                          element === 'subtitle' ? settings.subtitleAnimation :
                          settings.descriptionAnimation;
    


    // Якщо анімація 'none' або не задана, повертаємо статичну анімацію
    if (!enterAnimation || enterAnimation === 'none') {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }
    
    const exitAnimation = element === 'title' ? settings.titleExitAnimation :
                         element === 'subtitle' ? settings.subtitleExitAnimation :
                         settings.descriptionExitAnimation;

    const duration = settings.animationDuration ? settings.animationDuration / 1000 : 0.8;
    const delay = settings.animationDelay ? settings.animationDelay / 1000 : 0.2;

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

    return animationConfig;
  };



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
                  maxWidth: settings.logoSize ? `${settings.logoSize}px` : '96px', 
                  maxHeight: settings.logoSize ? `${settings.logoSize}px` : '96px',
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
            {settings.description ? settings.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < settings.description.split('\n').length - 1 && <br />}
              </span>
            )) : ''}
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