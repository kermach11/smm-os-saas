import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Застарілі імпорти аудіо видалені - тепер вся музика керується через конструктори
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';
import { webAudioManager } from '../utils/webAudioUtils';

// 🚀 Global Spline Preloader для миттєвого завантаження
const SPLINE_SCENE_URL = "https://prod.spline.design/Li0xtQwxHAu6qXGd/scene.splinecode";

// Глобальний preload для Spline сцени
const preloadSplineScene = async () => {
  try {
    console.log('🚀 Index: Запуск preload для Spline сцени...');
    
    // Preconnect для швидшого з'єднання
    const preconnectLink = document.createElement('link');
    preconnectLink.rel = 'preconnect';
    preconnectLink.href = 'https://prod.spline.design';
    document.head.appendChild(preconnectLink);
    
    // Prefetch самої сцени
    const prefetchLink = document.createElement('link');
    prefetchLink.rel = 'prefetch';
    prefetchLink.href = SPLINE_SCENE_URL;
    document.head.appendChild(prefetchLink);
    
    // Додатковий fetch для кешування
    fetch(SPLINE_SCENE_URL, { 
      method: 'GET',
      mode: 'cors',
      cache: 'force-cache'
    }).then(() => {
      console.log('✅ Index: Spline сцена preload завершено');
    }).catch(() => {
      console.log('⚠️ Index: Spline preload не вдався (нормально)');
    });

    // 🚀 Повідомляємо Service Worker про prefetch
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PREFETCH_SPLINE',
        urls: [SPLINE_SCENE_URL]
      });
    }

    // 🎯 WebGL Context Warmup для швидшого старту 3D
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) {
        // Ініціалізуємо основні WebGL ресурси
        const shader = gl.createShader(gl.VERTEX_SHADER);
        gl.deleteShader(shader);
        console.log('✅ Index: WebGL context підготовлено');
      }
    } catch (error) {
      console.log('⚠️ Index: WebGL warmup не вдався:', error);
    }
    
  } catch (error) {
    console.log('⚠️ Index: Помилка Spline preload:', error);
  }
};

// Screen components
import IntroScreen from "../components/IntroScreen";
import MainScreen from "../components/MainScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import { useGlobalAudio } from '../hooks/useGlobalAudio';

// Audio context for global sound management
interface AudioContextType {
  isPlaying: boolean;
  toggle: () => void;
  isLoaded: boolean;
  canAutoPlay: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

// Хук винесено в окремий файл для виправлення HMR попереджень

// Глобальний стан для відстеження початкового завантаження
// ВИПРАВЛЕННЯ: Завжди починаємо з Welcome екрану при свіжому завантаженні сторінки
let hasInitialLoadCompleted = false;

const Index = () => {
  const [screenState, setScreenState] = useState<'welcome' | 'intro' | 'main'>(() => {
    // ВИПРАВЛЕННЯ: Завжди починаємо з Welcome екрану при свіжому завантаженні
    return 'welcome';
  });

  const [welcomeSettings, setWelcomeSettings] = useState<any>(null);
  const [userInteracted, setUserInteracted] = useState(() => {
    // ВИПРАВЛЕННЯ: Завжди починаємо з false при свіжому завантаженні
    return false;
  });

  // Global audio management with auto-play disabled
  const { isPlaying, isLoaded, canAutoPlay, toggle, play } = useGlobalAudio();

  // Стан для переходного затемнення
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Захист від "застрягання" затемнення - автоматично прибираємо через 2 секунди
  useEffect(() => {
    if (isTransitioning) {
      const clearTransitionTimer = setTimeout(() => {
        console.log('🛡️ Index: Захист від застрягання - прибираємо затемнення');
        setIsTransitioning(false);
      }, 2000); // 2 секунди максимум (достатньо для переходу 300ms + 300ms)
      
      return () => clearTimeout(clearTransitionTimer);
    }
  }, [isTransitioning]);

  // 🚀 Запускаємо preload Spline сцени асинхронно (без блокування UI)
  useEffect(() => {
    // Запускаємо preload в мікротаску щоб не блокувати початковий рендер
    Promise.resolve().then(() => {
      preloadSplineScene();
    });
  }, []);

  // Завантаження налаштувань превю через IndexedDB
  useEffect(() => {
    const loadWelcomeSettings = async () => {
      try {
        console.log('🔄 Index: Завантаження налаштувань Welcome через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        let indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
        
        // Якщо немає локальних налаштувань і це не адмін режим, логуємо це
        if (!indexedDBSettings && !domainSyncService.isAdminMode()) {
          console.log('🔄 Index: Локальні Welcome налаштування не знайдено в публічному режимі');
          // В Domain-based синхронізації ми автоматично отримуємо оновлення через localStorage events
        }
        
        if (indexedDBSettings) {
          console.log('✅ Index: Налаштування Welcome завантажено з IndexedDB');
          setWelcomeSettings(indexedDBSettings);
        } else {
          // Якщо IndexedDB порожній, пробуємо localStorage як резерв
          console.log('ℹ️ Index: Налаштування Welcome не знайдено в IndexedDB, перевіряємо localStorage...');
          const savedSettings = localStorage.getItem('welcomeSettings');
          if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            console.log('✅ Index: Налаштування Welcome завантажено з localStorage');
            setWelcomeSettings(parsed);
            
            // Мігруємо в IndexedDB
            console.log('🔄 Index: Міграція налаштувань Welcome в IndexedDB...');
            await indexedDBService.saveSettings('welcomeSettings', parsed, 'project');
            console.log('✅ Index: Міграція Welcome завершена');
          }
        }
      } catch (error) {
        console.error('❌ Index: Помилка завантаження налаштувань Welcome:', error);
      } finally {
        // Початкове завантаження завершено
      }
    };

    loadWelcomeSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      setWelcomeSettings(event.detail);
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // Handle welcome screen completion (user tapped to enter)
  const handleWelcomeComplete = async () => {
    console.log('🎵 UnifiedPage: Обробка завершення Welcome екрану');
    
    // Показуємо затемнення тільки якщо не на головній сторінці
    if (screenState !== 'main') {
      setIsTransitioning(true);
    }
    
    // Позначаємо що користувач вже взаємодіяв зі сторінкою
    setUserInteracted(true);
    
    try {
      // Паралельно виконуємо всі асинхронні операції
      const [mainSettings] = await Promise.all([
        indexedDBService.loadSettings('mainPageSettings'),
        // Додаємо мінімальну затримку для плавності
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      
      const backgroundMusic = mainSettings?.audioSettings?.backgroundMusic;
      
      // Обробка аудіо в background (не блокує перехід)
      Promise.resolve().then(async () => {
        if (backgroundMusic?.enabled && backgroundMusic?.autoStartAfterWelcome) {
          console.log('🎵 Index: Запуск постійної фонової музики після Welcome');
          if (backgroundMusic?.url) {
            try {
              await webAudioManager.loadAudio(backgroundMusic.url, 'background-music');
              await webAudioManager.playAudio('background-music', {
                loop: backgroundMusic.loop,
                volume: backgroundMusic.volume
              });
              console.log('✅ Index: Фонова музика запущена після Welcome');
            } catch (error) {
              console.log('⚠️ Index: Не вдалося запустити фонову музику:', error);
            }
          }
        }
        
        // Зупиняємо Welcome музику
        const welcomeAudio = document.querySelectorAll('audio');
        welcomeAudio.forEach(audio => {
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
            console.log('🔇 Index: Зупинено Welcome аудіо');
          }
        });
      });
      
      // Стандартизований тайминг: 300ms для переходу
      setTimeout(() => {
        setScreenState('intro');
        // Приховуємо затемнення через 300ms (синхронізовано з Framer Motion)
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
      
    } catch (error) {
      console.error('❌ Index: Помилка в handleWelcomeComplete:', error);
      // Fallback: продовжуємо перехід навіть при помилці
      setTimeout(() => {
        setScreenState('intro');
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  // Handle intro screen completion
  const handleIntroComplete = async () => {
    console.log('🎵 Index: Обробка завершення Intro екрану');
    
    // Показуємо затемнення для переходу на MainScreen
    setIsTransitioning(true);
    
    try {
      // Паралельно виконуємо всі асинхронні операції
      const [mainSettings] = await Promise.all([
        indexedDBService.loadSettings('mainPageSettings'),
        // Додаємо мінімальну затримку для плавності
        new Promise(resolve => setTimeout(resolve, 300))
      ]);
      
      const backgroundMusic = mainSettings?.audioSettings?.backgroundMusic;
      
      // Обробка аудіо в background (не блокує перехід)
      Promise.resolve().then(async () => {
        if (backgroundMusic?.enabled && backgroundMusic?.autoStartAfterWelcome) {
          console.log('🎵 Index: Режим постійної фонової музики - запускаємо фонову музику');
          if (backgroundMusic?.url) {
            try {
              await webAudioManager.loadAudio(backgroundMusic.url, 'background-music');
              await webAudioManager.playAudio('background-music', {
                loop: backgroundMusic.loop,
                volume: backgroundMusic.volume
              });
              console.log('✅ Index: Фонова музика запущена після Intro');
            } catch (error) {
              console.log('⚠️ Index: Не вдалося запустити фонову музику:', error);
            }
          }
        }
        
        // Зупиняємо Intro музику
        const introAudio = document.querySelectorAll('audio');
        introAudio.forEach(audio => {
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
        });
      });
      
      // Стандартизований тайминг: 300ms для переходу
      setTimeout(() => {
        setScreenState('main');
        hasInitialLoadCompleted = true;
        // Приховуємо затемнення через 300ms (синхронізовано з Framer Motion)
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
      
    } catch (error) {
      console.error('❌ Index: Помилка в handleIntroComplete:', error);
      // Fallback: продовжуємо перехід навіть при помилці
      setTimeout(() => {
        setScreenState('main');
        hasInitialLoadCompleted = true;
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      }, 300);
    }
  };

  // Fallback: Try to start audio on any user interaction (if not started yet)
  useEffect(() => {
    const handleFirstInteraction = async () => {
      // Позначаємо що користувач взаємодіяв зі сторінкою
      if (!userInteracted) {
        setUserInteracted(true);
      }
      
      const hasCustomMusic = welcomeSettings?.hasMusic && welcomeSettings?.musicUrl;
      
      if (!hasCustomMusic && isLoaded && !canAutoPlay && !isPlaying && screenState !== 'welcome') {
        await play();
      }
    };

    // Listen for first user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [isLoaded, canAutoPlay, isPlaying, play, screenState, welcomeSettings, userInteracted]);

  // НОВА ЛОГІКА МУЗИКИ: Залежить від налаштування autoStartAfterWelcome
  useEffect(() => {
    const handleMainScreenMusic = async () => {
      if (screenState === 'main') {
        // Завантажуємо налаштування головної сторінки
        const mainSettings = await indexedDBService.loadSettings('mainPageSettings');
        const backgroundMusic = mainSettings?.audioSettings?.backgroundMusic;
        
        if (backgroundMusic?.enabled && backgroundMusic?.autoStartAfterWelcome) {
          console.log('🎵 Index: Режим постійної фонової музики увімкнено');
          // Не зупиняємо стару музику, вона грає постійно
        } else {
          console.log('🎵 Index: Режим окремої музики для кожного екрану');
          // Зупиняємо стару глобальну музику
          if (isPlaying) {
            toggle(); // Це зупинить стару музику
          }
        }
        
        // Гарантуємо що затемнення вимкнено на головній сторінці
        if (isTransitioning) {
          console.log('🛡️ Автоматично вимикаємо затемнення на головній сторінці');
          setIsTransitioning(false);
        }
      }
    };
    
    handleMainScreenMusic();
  }, [screenState, isPlaying, toggle, isTransitioning]);

  // 🎬 ЦЕНТРАЛІЗОВАНА МЕДІА ІНІЦІАЛІЗАЦІЯ для Unified Page
  useEffect(() => {
    const initializeAllMedia = async () => {
      console.log('🎬 UnifiedPage: Початок централізованої ініціалізації медіа');
      
      // Завантажуємо всі налаштування одночасно
      const [welcomeSettings, introSettings, mainSettings] = await Promise.all([
        indexedDBService.loadSettings('welcomeSettings'),
        indexedDBService.loadSettings('introSettings'), 
        indexedDBService.loadSettings('mainPageSettings')
      ]);
      
      const mediaPromises: Promise<void>[] = [];
      
      // Ініціалізуємо Welcome відео
      if (welcomeSettings?.backgroundType === 'video' && welcomeSettings?.backgroundVideo) {
        console.log('🎬 UnifiedPage: Попередньо завантажуємо Welcome відео');
        mediaPromises.push(preloadVideo(welcomeSettings.backgroundVideo, 'welcome'));
      }
      
      // Ініціалізуємо Intro відео
      if (introSettings?.backgroundType === 'video' && introSettings?.backgroundVideo) {
        console.log('🎬 UnifiedPage: Попередньо завантажуємо Intro відео');
        mediaPromises.push(preloadVideo(introSettings.backgroundVideo, 'intro'));
      }
      
      // Ініціалізуємо Main відео
      if (mainSettings?.backgroundSettings?.backgroundType === 'video' && mainSettings?.backgroundSettings?.backgroundVideo) {
        console.log('🎬 UnifiedPage: Попередньо завантажуємо Main відео');
        mediaPromises.push(preloadVideo(mainSettings.backgroundSettings.backgroundVideo, 'main'));
      }
      
      // Ініціалізуємо всі аудіо
      if (welcomeSettings?.hasMusic && welcomeSettings?.musicUrl) {
        console.log('🎵 UnifiedPage: Попередньо завантажуємо Welcome аудіо');
        mediaPromises.push(preloadAudio(welcomeSettings.musicUrl, 'welcome'));
      }
      
      if (introSettings?.hasMusic && introSettings?.musicUrl) {
        console.log('🎵 UnifiedPage: Попередньо завантажуємо Intro аудіо');
        mediaPromises.push(preloadAudio(introSettings.musicUrl, 'intro'));
      }
      
      if (mainSettings?.backgroundSettings?.hasMusic && mainSettings?.backgroundSettings?.musicUrl) {
        console.log('🎵 UnifiedPage: Попередньо завантажуємо Main аудіо');
        mediaPromises.push(preloadAudio(mainSettings.backgroundSettings.musicUrl, 'main'));
      }
      
      // Чекаємо завантаження всіх медіа
      try {
        await Promise.all(mediaPromises);
        console.log('✅ UnifiedPage: Всі медіа успішно попередньо завантажені');
      } catch (error) {
        console.log('⚠️ UnifiedPage: Деякі медіа не завантажилися:', error);
      }
    };
    
    // Запускаємо ініціалізацію після монтування компонента
    initializeAllMedia();
  }, []);
  
  // Функція для попереднього завантаження відео
  const preloadVideo = async (videoUrl: string, context: string): Promise<void> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.style.display = 'none';
      
      // Додаємо мобільні атрибути
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
      
      const onLoad = () => {
        console.log(`✅ UnifiedPage: ${context} відео завантажено:`, videoUrl);
        video.removeEventListener('loadeddata', onLoad);
        video.removeEventListener('error', onError);
        resolve();
      };
      
      const onError = () => {
        console.log(`⚠️ UnifiedPage: ${context} відео не завантажилося:`, videoUrl);
        video.removeEventListener('loadeddata', onLoad);
        video.removeEventListener('error', onError);
        resolve(); // Продовжуємо навіть при помилці
      };
      
      video.addEventListener('loadeddata', onLoad);
      video.addEventListener('error', onError);
      
      // Додаємо до DOM для завантаження
      document.body.appendChild(video);
      
      // Видаляємо після завантаження
      setTimeout(() => {
        if (document.body.contains(video)) {
          document.body.removeChild(video);
        }
      }, 5000);
    });
  };
  
  // Функція для попереднього завантаження аудіо
  const preloadAudio = async (audioUrl: string, context: string): Promise<void> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.src = audioUrl;
      audio.preload = 'auto';
      audio.style.display = 'none';
      
      const onLoad = () => {
        console.log(`✅ UnifiedPage: ${context} аудіо завантажено:`, audioUrl);
        audio.removeEventListener('loadeddata', onLoad);
        audio.removeEventListener('error', onError);
        resolve();
      };
      
      const onError = () => {
        console.log(`⚠️ UnifiedPage: ${context} аудіо не завантажилося:`, audioUrl);
        audio.removeEventListener('loadeddata', onLoad);
        audio.removeEventListener('error', onError);
        resolve(); // Продовжуємо навіть при помилці
      };
      
      audio.addEventListener('loadeddata', onLoad);
      audio.addEventListener('error', onError);
      
      // Додаємо до DOM для завантаження
      document.body.appendChild(audio);
      
      // Видаляємо після завантаження
      setTimeout(() => {
        if (document.body.contains(audio)) {
          document.body.removeChild(audio);
        }
      }, 5000);
    });
  };

  const audioContextValue = {
    isPlaying,
    toggle,
    isLoaded,
    canAutoPlay
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      <div className="w-full h-screen overflow-x-hidden lg:overflow-hidden" style={{ backgroundColor: screenState === 'main' ? 'transparent' : 'black' }}>
        {/* 🎬 UNIFIED PAGE APPROACH - Всі компоненти рендеряться одночасно */}
        {/* Welcome Screen - завжди рендериться, показується умовно */}
        <WelcomeScreen 
          visible={screenState === 'welcome' && !hasInitialLoadCompleted}
          onComplete={handleWelcomeComplete}
          isAudioLoaded={isLoaded}
          settings={welcomeSettings}
        />
        
        {/* Intro Screen - завжди рендериться, показується умовно */}
        <IntroScreen 
          visible={screenState === 'intro' && !hasInitialLoadCompleted}
          onComplete={handleIntroComplete} 
        />
        
        {/* Main Screen - завжди рендериться, показується умовно */}
        <MainScreen 
          visible={screenState === 'main' || hasInitialLoadCompleted}
          userInteracted={userInteracted} 
        />
        
        {/* Затемнення під час переходу - з AnimatePresence для правильного exit */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-black z-[100] pointer-events-none"
              style={{
                backgroundColor: '#000000'
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </AudioContext.Provider>
  );
};

export default Index;
