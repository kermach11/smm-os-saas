import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import indexedDBService from '../services/IndexedDBService';
import SplineAnimation from './SplineAnimation';
import { responsiveFontSize } from '../lib/utils';
import { useAnalytics } from '../hooks/useAnalytics';

interface WelcomeScreenProps {
  visible: boolean;
  onComplete: () => void;
  isAudioLoaded: boolean;
  settings?: WelcomeSettings;
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

// Мінімальні дефолтні налаштування тільки для темного фону під час завантаження
const minimalDefaultSettings: WelcomeSettings = {
  title: undefined,           // ✍️ Контролюється конструктором
  subtitle: undefined,        // ✍️ Контролюється конструктором
  description: undefined,     // ✍️ Контролюється конструктором
  buttonText: undefined,      // ✍️ Контролюється конструктором (з fallback)
  hintText: "",              // ✅ Залишаємо - не в конструкторі
  backgroundType: undefined,   // 🌅 Контролюється конструктором
  backgroundColor: '#000000',  // ✅ Залишаємо - для завантаження
  gradientFrom: undefined,     // 🌅 Контролюється конструктором
  gradientTo: undefined,       // 🌅 Контролюється конструктором
  backgroundImage: undefined,  // 🌅 Контролюється конструктором
  backgroundVideo: undefined,  // 🌅 Контролюється конструктором
  textColor: '#ffffff',       // 🔧 Мінімальний дефолт
  subtitleColor: '#ffffff',   // 🔧 Мінімальний дефолт
  descriptionColor: '#ffffff', // 🔧 Мінімальний дефолт
  buttonColor: '#000000',     // 🔧 Мінімальний дефолт
  buttonTextColor: '#ffffff', // 🔧 Мінімальний дефолт
  logoUrl: undefined,         // ✍️ Контролюється конструктором
  logoSize: undefined,        // ✍️ Контролюється конструктором
  showLogo: false,           // ✅ Залишаємо - логіка показу
  hasMusic: undefined,        // 🎵 Контролюється конструктором  
  musicUrl: undefined,        // 🎵 Контролюється конструктором
  musicVolume: 0.5,
  musicLoop: true,
  autoPlay: false,
  showParticles: false,
  particleColor: '#ffffff',
  animationSpeed: 'normal',
  // Анімації - мінімальні дефолти для безпеки
  titleAnimation: 'fadeIn',         // 🔧 Мінімальний дефолт
  subtitleAnimation: 'fadeIn',      // 🔧 Мінімальний дефолт
  descriptionAnimation: 'fadeIn',   // 🔧 Мінімальний дефолт
  titleExitAnimation: 'fadeOut',    // 🔧 Мінімальний дефолт
  subtitleExitAnimation: 'fadeOut', // 🔧 Мінімальний дефолт
  descriptionExitAnimation: 'fadeOut', // 🔧 Мінімальний дефолт
  animationDuration: 800,           // 🔧 Мінімальний дефолт
  animationDelay: 200,              // 🔧 Мінімальний дефолт
  // Typography settings - мінімальні дефолти для безпеки
  titleFontSize: 32,            // 🔧 Мінімальний дефолт
  subtitleFontSize: 20,         // 🔧 Мінімальний дефолт
  descriptionFontSize: 14,      // 🔧 Мінімальний дефолт
  titleFontFamily: 'Inter',     // 🔧 Мінімальний дефолт
  subtitleFontFamily: 'Inter',  // 🔧 Мінімальний дефолт
  descriptionFontFamily: 'Inter', // 🔧 Мінімальний дефолт
  titleFontWeight: undefined,   // ✅ Контролюється конструктором
  subtitleFontWeight: undefined, // ✅ Контролюється конструктором
  descriptionFontWeight: undefined, // ✅ Контролюється конструктором
  titleFontStyle: 'normal',     // 🔧 Мінімальний дефолт
  subtitleFontStyle: 'normal',  // 🔧 Мінімальний дефолт
  descriptionFontStyle: 'normal', // 🔧 Мінімальний дефолт
  // Тіні та ефекти - контролюються конструктором
  titleShadowIntensity: undefined,    // 🌟 Контролюється конструктором
  subtitleShadowIntensity: undefined, // 🌟 Контролюється конструктором
  descriptionShadowIntensity: undefined, // 🌟 Контролюється конструктором
  titleShadowColor: undefined,        // 🌟 Контролюється конструктором
  subtitleShadowColor: undefined,     // 🌟 Контролюється конструктором
  descriptionShadowColor: undefined,  // 🌟 Контролюється конструктором
  title3DDepth: undefined,            // 🌟 Контролюється конструктором
  subtitle3DDepth: undefined,         // 🌟 Контролюється конструктором
  description3DDepth: undefined,      // 🌟 Контролюється конструктором
  splineSettings: undefined     // 🌐 Контролюється конструктором
};

const WelcomeScreen = ({ visible, onComplete, isAudioLoaded, settings: propsSettings }: WelcomeScreenProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [settings, setSettings] = useState<WelcomeSettings>(propsSettings || minimalDefaultSettings);
  const [customMusicLoaded, setCustomMusicLoaded] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(!!propsSettings);
  const [animationKey, setAnimationKey] = useState(0);
  
  // 🚀 ОПТИМІЗАЦІЯ: Стан для плейсхолдера (не впливає на існуючу логіку)
  const [isContentReady, setIsContentReady] = useState(!!propsSettings);
  
  const musicRef = useRef<HTMLAudioElement>(null);
  
  // Аналітика для відстеження входу клієнтів
  const { trackClick } = useAnalytics();



  // Простий фікс - тільки приховання скролбарів
  useEffect(() => {
    // Тільки приховуємо скролбари, без зміни позиціонування
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);

  // Зупинка музики при зміні видимості
  useEffect(() => {
    if (!visible && musicRef.current) {
      console.log('🎵 WelcomeScreen: Зупиняємо музику при переході');
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
  }, [visible]);

  // Cleanup при демонтажі компонента
  useEffect(() => {
    return () => {
      if (musicRef.current) {
        console.log('🎵 WelcomeScreen: Очищення музики при демонтажі');
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    };
  }, []);

  // Використовуємо налаштування з props якщо є, інакше завантажуємо
  useEffect(() => {
    if (propsSettings) {
      const safeSettings = {
        ...minimalDefaultSettings,
        ...propsSettings,
        splineSettings: {
          ...minimalDefaultSettings.splineSettings,
          ...(propsSettings.splineSettings || {})
        }
      };
      setSettings(safeSettings);
      return;
    }

    const loadSettings = async () => {
      try {
        console.log('🔄 WelcomeScreen: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
        
        if (indexedDBSettings) {
          console.log('✅ WelcomeScreen: Налаштування завантажено з IndexedDB');
          const safeSettings = {
            ...minimalDefaultSettings,
            ...indexedDBSettings,
            splineSettings: {
              ...minimalDefaultSettings.splineSettings,
              ...(indexedDBSettings.splineSettings || {})
            }
          };
          setSettings(safeSettings);
        } else {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ WelcomeScreen: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          const savedSettings = localStorage.getItem('welcomeSettings') || localStorage.getItem('welcomeSettings_backup');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('✅ WelcomeScreen: Налаштування завантажено з localStorage');
            const safeSettings = {
              ...minimalDefaultSettings,
              ...parsed,
              splineSettings: {
                ...minimalDefaultSettings.splineSettings,
                ...(parsed.splineSettings || {})
              }
            };
            setSettings(safeSettings);
            
            // Мігруємо в IndexedDB ТІЛЬКИ ОДИН РАЗ
            console.log('🔄 WelcomeScreen: Міграція налаштувань в IndexedDB...');
            await indexedDBService.saveSettings('welcomeSettings', safeSettings, 'project');
            console.log('✅ WelcomeScreen: Міграція завершена');
            
            // Видаляємо з localStorage після успішної міграції
            localStorage.removeItem('welcomeSettings');
            localStorage.removeItem('welcomeSettings_backup');
            console.log('🗑️ WelcomeScreen: Видалено з localStorage після міграції');
          } else {
            console.log('ℹ️ WelcomeScreen: Використовуємо мінімальні налаштування за замовчуванням');
            setSettings(minimalDefaultSettings);
          }
        }
        
        // Завжди встановлюємо isSettingsLoaded в true після спроби завантаження
        setIsSettingsLoaded(true);
        // 🚀 ОПТИМІЗАЦІЯ: Контент готовий до показу
        setIsContentReady(true);
      } catch (error) {
        console.error('❌ WelcomeScreen: Помилка завантаження налаштувань:', error);
        // Навіть у випадку помилки, встановлюємо налаштування за замовчуванням
        setSettings(minimalDefaultSettings);
        setIsSettingsLoaded(true);
        // 🚀 ОПТИМІЗАЦІЯ: Контент готовий до показу (навіть при помилці)
        setIsContentReady(true);
      }
    };

    loadSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 WelcomeScreen: Отримано оновлення налаштувань:', {
        splineSettings: event.detail.splineSettings,
        titleFontSize: event.detail.titleFontSize,
        titleFontFamily: event.detail.titleFontFamily,
        titleFontWeight: event.detail.titleFontWeight,
        title: event.detail.title
      });
      const safeSettings = {
        ...minimalDefaultSettings,
        ...event.detail,
        splineSettings: {
          ...minimalDefaultSettings.splineSettings,
          ...(event.detail.splineSettings || {})
        }
      };
      console.log('🔄 WelcomeScreen: Фінальні налаштування:', {
        titleFontSize: safeSettings.titleFontSize,
        titleFontFamily: safeSettings.titleFontFamily,
        titleFontWeight: safeSettings.titleFontWeight,
        title: safeSettings.title
      });
      setSettings(safeSettings);
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, [propsSettings]);

  // Перезапуск анімацій при зміні налаштувань
  useEffect(() => {
    if (isSettingsLoaded) {
      setAnimationKey(prev => prev + 1);
      console.log('🎭 WelcomeScreen: Animation key updated:', animationKey + 1);
    }
  }, [settings.titleAnimation, settings.subtitleAnimation, settings.descriptionAnimation, settings.animationDuration, settings.animationDelay, isSettingsLoaded]);

  // Ефект для керування власною музикою
  useEffect(() => {
    if (musicRef.current && settings.hasMusic && settings.musicUrl) {
      musicRef.current.volume = settings.musicVolume;
      
      const handleCanPlay = () => {
        setCustomMusicLoaded(true);
        if (settings.autoPlay) {
          musicRef.current?.play().catch(() => {
            // Тихо ігноруємо помилки автоплею
          });
        }
      };

      musicRef.current.addEventListener('canplay', handleCanPlay);
      
      return () => {
        musicRef.current?.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [settings.hasMusic, settings.musicUrl, settings.musicVolume, settings.autoPlay]);

  const handleEnter = async () => {
    setIsPressed(true);
    
    console.log('🎬 WelcomeScreen: handleEnter викликано, buttonText:', settings.buttonText);
    
    // 📊 АНАЛІТИКА: Відстежуємо вхід клієнта (це головна метрика входу)
    const clickTitle = `Client Entry - ${settings.buttonText || 'Почати'}`;
    console.log('📊 WelcomeScreen: Викликаємо trackClick з параметрами:', {
      url: '#welcome-enter-button',
      title: clickTitle
    });
    
    trackClick('#welcome-enter-button', clickTitle, 'welcome-entry');
    
    // Запускаємо музику в фоні без блокування UI
    // Власна музика Welcome сторінки
    if (settings.hasMusic && settings.musicUrl && musicRef.current) {
      musicRef.current.play().catch(() => {
        // Тихо ігноруємо помилки
      });
    }

    // Фонова музика MainScreen тепер запускається автоматично - не потрібно викликати
    
    // Негайно переходимо далі без очікування музики
    setTimeout(() => {
      console.log('🎬 WelcomeScreen: Перехід до MainScreen через 150ms');
      onComplete();
      setIsPressed(false);
    }, 150);
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
      fontFamily: settings[`${element}FontFamily`],
      fontWeight: settings[`${element}FontWeight`],
      fontStyle: settings[`${element}FontStyle`],
      fontSize: responsiveFontSize(settings[`${element}FontSize`])
    };

    // Додавання тіней
    const shadowIntensity = settings[`${element}ShadowIntensity`];
    const shadowColor = settings[`${element}ShadowColor`];
    const depth3D = settings[`${element}3DDepth`];

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
    
    console.log(`🎭 WelcomeScreen: getAnimationVariants для ${element}:`, {
      enterAnimation,
      settingsAnimations: {
        titleAnimation: settings.titleAnimation,
        subtitleAnimation: settings.subtitleAnimation,
        descriptionAnimation: settings.descriptionAnimation
      }
    });

    // Якщо анімація 'none' або не задана, повертаємо статичну анімацію
    if (!enterAnimation || enterAnimation === 'none') {
      console.log(`🎭 WelcomeScreen: No animation for ${element}, returning static`);
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

    console.log(`🎭 WelcomeScreen: Animation config for ${element}:`, animationConfig);
    
    return animationConfig;
  };

  // Спрощена логіка готовності - кнопка доступна після завантаження налаштувань
  // Не залежить від аудіо стану для уникнення проблем на мобільних пристроях
  const isReady = isSettingsLoaded;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible && isSettingsLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 1.2, 
        ease: [0.25, 0.1, 0.25, 1.0] // Плавніша крива анімації
      }}
      className="welcome-screen-container fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ 
        ...getBackgroundStyle(),
        display: visible ? 'flex' : 'none',
        pointerEvents: visible ? 'auto' : 'none'
      }}
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
      {settings.splineSettings?.enabled && (
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
      )}

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
                        className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="relative text-center px-6 max-w-md mx-auto z-10 overflow-hidden">
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
          initial={{ opacity: 0 }}
          animate={{ opacity: isSettingsLoaded ? 1 : 0 }}
          transition={{ 
            duration: 1.2, 
            delay: isSettingsLoaded ? 1.5 : 0, 
            ease: "easeOut"
          }}
        >
          <button
            onClick={(e) => {
              console.log('🖱️ WelcomeScreen: onClick викликано', {
                clientX: e.clientX,
                clientY: e.clientY,
                target: e.target,
                pointerType: (e as any).pointerType || 'unknown'
              });
              handleEnter();
            }}
            onTouchStart={() => {
              console.log('📱 WelcomeScreen: onTouchStart (мобільний дотик)');
            }}
            onTouchEnd={() => {
              console.log('📱 WelcomeScreen: onTouchEnd (мобільний дотик завершено)');
            }}
            disabled={!isReady}
            className={`
              relative px-8 py-4 rounded-full font-medium
              transition-all duration-300 transform
              ${isPressed ? 'scale-95' : 'scale-100 hover:scale-105'}
              ${!isReady ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              shadow-lg hover:shadow-xl
            `}
            style={{
              backgroundColor: isReady ? settings.buttonColor : '#9ca3af',
              color: settings.buttonTextColor,
            }}
          >
            <span className="flex items-center gap-3">
              {!isReady ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Завантаження...
                </>
              ) : (
                <>
                  {settings.buttonText || "Почати"}
                </>
              )}
            </span>
          </button>
        </motion.div>

        {/* Hint text */}
        {isReady && (
                    <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isSettingsLoaded ? 1 : 0 }}
            transition={{ 
              duration: 1.2, 
              delay: isSettingsLoaded ? 2.2 : 0, 
              ease: "easeOut"
            }}
            className="text-xs mt-6 sf-body"
            style={{ 
              color: settings.descriptionColor, 
              opacity: isSettingsLoaded ? 0.7 : 0
            }}
          >
            {settings.hintText}
          </motion.p>
        )}
      </div>

      {/* Власна фонова музика */}
      {settings.hasMusic && settings.musicUrl && (
        <audio 
          ref={musicRef}
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

export default WelcomeScreen; 