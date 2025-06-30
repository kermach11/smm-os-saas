import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import indexedDBService from '../services/IndexedDBService';
import SplineAnimation from './SplineAnimation';

interface WelcomeScreenProps {
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
  showLogo: boolean;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  autoPlay: boolean;
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
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
  title: "",
  subtitle: "",
  description: "",
  buttonText: "",
  hintText: "",
  backgroundType: 'color',
  backgroundColor: '#000000',
  gradientFrom: '#000000',
  gradientTo: '#000000',
  backgroundImage: '',
  backgroundVideo: '',
  textColor: '#ffffff',
  subtitleColor: '#ffffff',
  descriptionColor: '#ffffff',
  buttonColor: '#000000',
  buttonTextColor: '#ffffff',
  logoUrl: '',
  showLogo: false,
  hasMusic: false,
  musicUrl: '',
  musicVolume: 0.5,
  autoPlay: false,
  showParticles: false,
  particleColor: '#ffffff',
  animationSpeed: 'normal',
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
  splineSettings: {
    enabled: false,
    sceneUrl: "",
    embedCode: "",
    localFile: "",
    position: 'background',
    opacity: 1,
    scale: 1,
    autoplay: false,
    controls: false,
    method: 'component'
  }
};

const WelcomeScreen = ({ onComplete, isAudioLoaded, settings: propsSettings }: WelcomeScreenProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [settings, setSettings] = useState<WelcomeSettings>(propsSettings || minimalDefaultSettings);
  const [customMusicLoaded, setCustomMusicLoaded] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(!!propsSettings);
  
  const musicRef = useRef<HTMLAudioElement>(null);

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
          const savedSettings = localStorage.getItem('welcomeSettings');
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
            
            // Мігруємо в IndexedDB
            console.log('🔄 WelcomeScreen: Міграція налаштувань в IndexedDB...');
            await indexedDBService.saveSettings('welcomeSettings', safeSettings, 'project');
            console.log('✅ WelcomeScreen: Міграція завершена');
          } else {
            console.log('ℹ️ WelcomeScreen: Використовуємо мінімальні налаштування за замовчуванням');
            setSettings(minimalDefaultSettings);
          }
        }
        
        // Завжди встановлюємо isSettingsLoaded в true після спроби завантаження
        setIsSettingsLoaded(true);
      } catch (error) {
        console.error('❌ WelcomeScreen: Помилка завантаження налаштувань:', error);
        // Навіть у випадку помилки, встановлюємо налаштування за замовчуванням
        setSettings(minimalDefaultSettings);
        setIsSettingsLoaded(true);
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
    
    // Запускаємо власну музику якщо вона є і не грає
    if (settings.hasMusic && settings.musicUrl && musicRef.current) {
      try {
        await musicRef.current.play();
      } catch (error) {
        // Тихо ігноруємо помилки
      }
    }
    
    // Small delay for visual feedback
    setTimeout(() => {
      onComplete();
    }, 200);
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

  // Визначаємо чи готовий до запуску (системна музика або власна музика)
  const isReady = settings.hasMusic ? (customMusicLoaded || !settings.musicUrl) : isAudioLoaded;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isSettingsLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 flex items-center justify-center z-50"
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

      <div className="relative text-center px-6 max-w-md mx-auto z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSettingsLoaded ? 1 : 0 }}
          transition={{ 
            duration: 1.2, 
            delay: isSettingsLoaded ? 0.3 : 0, 
            ease: "easeOut"
          }}
          className="mb-8"
        >
          {/* Logo - only if logoUrl exists */}
          {settings.logoUrl && (
            <div className="flex items-center justify-center mb-4">
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          )}
          
          {/* Title - always show if exists */}
          {settings.title && (
            <h1 
              className="sf-text" 
              style={{ 
                color: settings.textColor,
                fontSize: `${settings.titleFontSize || 32}px`,
                fontFamily: settings.titleFontFamily || 'Inter',
                fontWeight: settings.titleFontWeight || 300,
                fontStyle: settings.titleFontStyle || 'normal'
              }}
            >
              {settings.title}
            </h1>
          )}
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSettingsLoaded ? 1 : 0 }}
          transition={{ 
            duration: 1.2, 
            delay: isSettingsLoaded ? 0.8 : 0, 
            ease: "easeOut"
          }}
          className="mb-12"
        >
          <h2 
            className="mb-3 sf-heading" 
            style={{ 
              color: settings.subtitleColor,
              fontSize: `${settings.subtitleFontSize || 20}px`,
              fontFamily: settings.subtitleFontFamily || 'Inter',
              fontWeight: settings.subtitleFontWeight || 300,
              fontStyle: settings.subtitleFontStyle || 'normal'
            }}
          >
            {settings.subtitle}
          </h2>
          <p 
            className="leading-relaxed sf-body" 
            style={{ 
              color: settings.descriptionColor,
              fontSize: `${settings.descriptionFontSize || 14}px`,
              fontFamily: settings.descriptionFontFamily || 'Inter',
              fontWeight: settings.descriptionFontWeight || 400,
              fontStyle: settings.descriptionFontStyle || 'normal'
            }}
          >
            {settings.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < settings.description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </motion.div>

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
            onClick={handleEnter}
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
                  <span className="text-lg">🎵</span>
                  {settings.buttonText}
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
          loop 
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