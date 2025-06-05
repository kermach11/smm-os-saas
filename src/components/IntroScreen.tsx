import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import DynamicBackground from "./DynamicBackground";
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';

interface IntroScreenProps {
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
}

const defaultSettings: IntroSettings = {
  title: "За межами",
  subtitle: "Реальності",
  description: "Подорожуйте крізь час і простір у захоплюючому всесвіті майбутнього.",
  buttonText: "Розпочати подорож",
  buttonUrl: "#start",
  brandColor: "#4a4b57",
  accentColor: "#3b82f6",
  textColor: "#ffffff",
  logoUrl: "",
  backgroundType: 'gradient',
  backgroundColor: "#1a1a1a",
  gradientFrom: "#f9fafb",
  gradientTo: "#f7f8fa",
  backgroundImage: "",
  backgroundVideo: "",
  hasMusic: false,
  musicUrl: "",
  animationStyle: 'fade',
  showParticles: false,
  particleColor: "#ffffff"
};

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [step, setStep] = useState<number>(0);
  const [introSettings, setIntroSettings] = useState<IntroSettings>(defaultSettings);
  const controls = useAnimation();
  
  // Завантаження налаштувань інтро через IndexedDB
  useEffect(() => {
    loadIntroSettings();
    
    // Слухач для оновлення даних з конструктора інтро
    const handleIntroSettingsUpdate = (event: CustomEvent) => {
      setIntroSettings(event.detail);
    };

    window.addEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('introSettingsUpdated', handleIntroSettingsUpdate as EventListener);
    };
  }, []);

  const loadIntroSettings = async () => {
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
          particleColor: indexedDBSettings.particleColor || defaultSettings.particleColor
        };
        setIntroSettings(convertedSettings);
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
          particleColor: settings.particleColor || defaultSettings.particleColor
        };
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

  const getAnimationVariants = () => {
    switch (introSettings.animationStyle) {
      case 'slide':
        return {
          initial: { opacity: 0, x: -100 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 100 }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.2 }
        };
      case 'bounce':
        return {
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 }
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };
  
  // Анімаційна послідовність
  useEffect(() => {
    const runAnimation = async () => {
      const variants = getAnimationVariants();
      
      // Step 0: Show Logo
      await controls.start({
        ...variants.animate,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94] 
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 1: Show Subtitle
      setStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Start zoom effect
      setStep(2);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Step 3: Smooth zoom
      await controls.start({
        scale: 1.2,
        opacity: 0.9,
        transition: { 
          duration: 0.8, 
          ease: [0.25, 0.46, 0.45, 0.94],
        }
      });
      
      // Step 4: Final zoom and fade out
      await controls.start({
        scale: 2.2,
        opacity: 0,
        transition: { 
          duration: 1.0, 
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      });
      
      // Complete animation
      onComplete();
    };
    
    runAnimation();
  }, [controls, onComplete, introSettings.animationStyle]);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 flex flex-col items-center justify-center z-50"
        style={getBackgroundStyle()}
      >
        {/* Background video */}
        {introSettings.backgroundType === 'video' && introSettings.backgroundVideo && (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={introSettings.backgroundVideo} type="video/mp4" />
          </video>
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

        <motion.div
          className="w-full h-full flex flex-col items-center justify-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, ease: [0.1, 0.4, 0.2, 1.0] } }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 1.2, 
              ease: [0.1, 0.4, 0.2, 1.0] 
            }
          }}
        >
          <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center px-4">
            {/* Background elements */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: [0.1, 0.4, 0.2, 1.0] }}
            >
              <motion.div
                className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 2.5, delay: 0.4, ease: [0.1, 0.4, 0.2, 1.0] }}
              />
              <motion.div
                className="absolute -bottom-[150px] -right-[150px] w-[300px] h-[300px] rounded-full bg-white/10 blur-3xl opacity-60"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 2.5, delay: 0.5, ease: [0.1, 0.4, 0.2, 1.0] }}
              />
            </motion.div>
            
            {/* Main content */}
            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
            >
              {/* Logo */}
              {introSettings.logoUrl && (
                <motion.img
                  src={introSettings.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 object-contain mb-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Title */}
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-2 drop-shadow-lg"
                style={{ color: introSettings.textColor }}
              >
                <span className="font-light">{introSettings.title}</span>{" "}
                <span className="tracking-tight">{introSettings.subtitle}</span>
              </h1>
              
              {/* Description */}
              {step >= 1 && (
                <motion.p
                  className="text-lg md:text-xl mt-4 max-w-md text-center drop-shadow-md opacity-80"
                  style={{ color: introSettings.textColor }}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ 
                    opacity: 0.8, 
                    filter: "blur(0px)",
                    transition: { 
                      opacity: { duration: 1.8, ease: [0.1, 0.4, 0.2, 1.0] },
                      filter: { duration: 2.2, ease: [0.1, 0.4, 0.2, 1.0] }
                    }
                  }}
                >
                  {introSettings.description}
                </motion.p>
              )}
              
              {/* Decorative line */}
              {step >= 2 && (
                <motion.div
                  className="w-[80px] h-[3px] rounded-full mt-8 mb-1"
                  style={{ 
                    background: `linear-gradient(to right, ${introSettings.textColor}, ${introSettings.textColor}70)` 
                  }}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ 
                    width: 80, 
                    opacity: 1,
                    transition: { 
                      duration: 1.2, 
                      ease: [0.1, 0.4, 0.2, 1.0], 
                      delay: 0.15 
                    }
                  }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Background music */}
        {introSettings.hasMusic && introSettings.musicUrl && (
          <audio autoPlay loop className="hidden">
            <source src={introSettings.musicUrl} type="audio/mpeg" />
          </audio>
        )}
      </div>
    </AnimatePresence>
  );
};

export default IntroScreen;
