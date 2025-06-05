import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import DynamicBackground from './DynamicBackground';
import indexedDBService from '../services/IndexedDBService';

interface IntroScreenPreviewProps {
  className?: string;
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

const IntroScreenPreview = ({ className }: IntroScreenPreviewProps) => {
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
      console.log('🔄 IntroScreenPreview: Завантаження налаштувань через IndexedDBService...');
      
      // Спочатку пробуємо завантажити з IndexedDB
      const indexedDBSettings = await indexedDBService.loadSettings('introSettings');
      
      if (indexedDBSettings) {
        console.log('✅ IntroScreenPreview: Налаштування завантажено з IndexedDB');
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
      console.log('ℹ️ IntroScreenPreview: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
      
      // Спочатку пробуємо завантажити з нового ключа для IntroScreen
      const savedSettings = localStorage.getItem('introScreenSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        console.log('✅ IntroScreenPreview: Налаштування завантажено з localStorage (introScreenSettings)');
        setIntroSettings(settings);
        
        // Мігруємо в IndexedDB
        console.log('🔄 IntroScreenPreview: Міграція налаштувань в IndexedDB...');
        await indexedDBService.saveSettings('introSettings', settings, 'project');
        console.log('✅ IntroScreenPreview: Міграція завершена');
        return;
      }
      
      // Якщо немає, пробуємо старий ключ
      const legacySettings = localStorage.getItem('introSettings');
      if (legacySettings) {
        const settings = JSON.parse(legacySettings);
        console.log('✅ IntroScreenPreview: Налаштування завантажено з localStorage (introSettings)');
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
        console.log('🔄 IntroScreenPreview: Міграція налаштувань в IndexedDB...');
        await indexedDBService.saveSettings('introSettings', convertedSettings, 'project');
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
  
  // Анімаційна послідовність для превью (скорочена версія)
  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    let isActive = true;
    
    const runPreviewAnimation = async () => {
      if (!isActive) return;
      
      const variants = getAnimationVariants();
      
      try {
        // Step 0: Show Logo
        await controls.start({
          ...variants.animate,
          transition: { 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }
        });
        
        if (!isActive) return;
        
        timeoutIds.push(setTimeout(() => {
          if (!isActive) return;
          // Step 1: Show Subtitle
          setStep(1);
          
          timeoutIds.push(setTimeout(() => {
            if (!isActive) return;
            // Step 2: Start zoom effect
            setStep(2);
            
            // Зациклюємо анімацію для превью
            timeoutIds.push(setTimeout(() => {
              if (!isActive) return;
              setStep(0);
              controls.set({ opacity: 0, scale: 0.9 });
              runPreviewAnimation();
            }, 3000));
          }, 200));
        }, 500));
      } catch (error) {
        console.error('Animation error:', error);
      }
    };
    
    runPreviewAnimation();
    
    // Cleanup function
    return () => {
      isActive = false;
      timeoutIds.forEach(id => clearTimeout(id));
      controls.stop();
    };
  }, [controls, introSettings.animationStyle]);

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden ${className}`}
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
        <div className="w-full max-w-screen-xl mx-auto flex flex-col items-center justify-center px-4">
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
            animate={controls}
          >
            {/* Logo */}
            {introSettings.logoUrl && (
              <motion.img
                src={introSettings.logoUrl}
                alt="Logo"
                className="w-12 h-12 object-contain mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Title */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter mb-2 drop-shadow-lg"
              style={{ color: introSettings.textColor }}
            >
              <span className="font-light">{introSettings.title}</span>{" "}
              <span className="tracking-tight">{introSettings.subtitle}</span>
            </h1>
            
            {/* Description */}
            {step >= 1 && (
              <motion.p
                className="text-sm md:text-base mt-2 max-w-md text-center drop-shadow-md opacity-80"
                style={{ color: introSettings.textColor }}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ 
                  opacity: 0.8, 
                  filter: "blur(0px)",
                  transition: { 
                    opacity: { duration: 0.9, ease: [0.1, 0.4, 0.2, 1.0] },
                    filter: { duration: 1.1, ease: [0.1, 0.4, 0.2, 1.0] }
                  }
                }}
              >
                {introSettings.description}
              </motion.p>
            )}
            
            {/* Decorative line */}
            {step >= 2 && (
              <motion.div
                className="w-[60px] h-[2px] rounded-full mt-4 mb-1"
                style={{ 
                  background: `linear-gradient(to right, ${introSettings.textColor}, ${introSettings.textColor}70)` 
                }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ 
                  width: 60, 
                  opacity: 1,
                  transition: { 
                    duration: 0.6, 
                    ease: [0.1, 0.4, 0.2, 1.0], 
                    delay: 0.1 
                  }
                }}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default IntroScreenPreview; 