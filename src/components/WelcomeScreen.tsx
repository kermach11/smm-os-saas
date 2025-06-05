import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import indexedDBService from '../services/IndexedDBService';

interface WelcomeScreenProps {
  onComplete: () => void;
  isAudioLoaded: boolean;
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
}

const defaultSettings: WelcomeSettings = {
  title: "SMM OS",
  subtitle: "Ласкаво просимо",
  description: "Усе що треба для твого SMM\nв одному місці",
  buttonText: "Увійти",
  hintText: "Тапніть щоб увійти та запустити музику",
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
  autoPlay: true,
  showParticles: false,
  particleColor: '#ffffff',
  animationSpeed: 'normal'
};

const WelcomeScreen = ({ onComplete, isAudioLoaded }: WelcomeScreenProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  const [customMusicLoaded, setCustomMusicLoaded] = useState(false);
  
  const musicRef = useRef<HTMLAudioElement>(null);

  // Завантаження налаштувань через IndexedDB
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 WelcomeScreen: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
        
        if (indexedDBSettings) {
          console.log('✅ WelcomeScreen: Налаштування завантажено з IndexedDB');
          setSettings(prev => ({ ...prev, ...indexedDBSettings }));
        } else {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ WelcomeScreen: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          const savedSettings = localStorage.getItem('welcomeSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('✅ WelcomeScreen: Налаштування завантажено з localStorage');
            setSettings(prev => ({ ...prev, ...parsed }));
            
            // Мігруємо в IndexedDB
            console.log('🔄 WelcomeScreen: Міграція налаштувань в IndexedDB...');
            await indexedDBService.saveSettings('welcomeSettings', parsed, 'project');
            console.log('✅ WelcomeScreen: Міграція завершена');
          }
        }
      } catch (error) {
        console.error('❌ WelcomeScreen: Помилка завантаження налаштувань:', error);
      }
    };

    loadSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(prev => ({ ...prev, ...event.detail }));
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

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
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
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

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="relative text-center px-6 max-w-md mx-auto z-10">
        {/* Logo */}
        {settings.showLogo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #4a4b57 0%, #303142 100%)',
                    boxShadow: '0 4px 12px rgba(48,49,66,0.3)'
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-light sf-text" style={{ color: settings.textColor }}>
              {settings.title}
            </h1>
          </motion.div>
        )}

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl font-light mb-3 sf-heading" style={{ color: settings.subtitleColor }}>
            {settings.subtitle}
          </h2>
          <p className="text-sm leading-relaxed sf-body" style={{ color: settings.descriptionColor }}>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-xs mt-6 sf-body"
            style={{ color: settings.descriptionColor, opacity: 0.7 }}
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