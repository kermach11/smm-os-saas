import { useState, useEffect, createContext, useContext } from "react";
import { AnimatePresence } from "framer-motion";
// Застарілі імпорти аудіо видалені - тепер вся музика керується через конструктори
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';

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

// Audio context for global sound management
interface AudioContextType {
  isPlaying: boolean;
  toggle: () => void;
  isLoaded: boolean;
  canAutoPlay: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useGlobalAudio = () => {
  // Застарілий глобальний аудіо більше не використовується - вся музика тепер керується через конструктори
  return {
    isPlaying: false,
    toggle: () => {},
    isLoaded: true,
    canAutoPlay: true,
    play: () => Promise.resolve()
  };
};

// Глобальний стан для відстеження початкового завантаження
let hasInitialLoadCompleted = false;

const Index = () => {
  const [screenState, setScreenState] = useState<'welcome' | 'intro' | 'main'>(() => {
    // Якщо початкове завантаження вже було - одразу показуємо головний екран
    return hasInitialLoadCompleted ? 'main' : 'welcome';
  });

  const [welcomeSettings, setWelcomeSettings] = useState<any>(null);

  // Global audio management with auto-play disabled
  const { isPlaying, isLoaded, canAutoPlay, toggle, play } = useGlobalAudio();

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
    // Запускаємо стару музику тільки якщо в превю немає власної музики
    const hasCustomMusic = welcomeSettings?.hasMusic && welcomeSettings?.musicUrl;
    
    if (!hasCustomMusic && isLoaded) {
      try {
        await play();
      } catch (error) {
        // Тихо ігноруємо помилки аудіо
      }
    }
    
    // Move to intro screen
    setScreenState('intro');
  };

  // Handle intro screen completion
  const handleIntroComplete = () => {
    setTimeout(() => {
      setScreenState('main');
      hasInitialLoadCompleted = true; // Позначаємо, що початкове завантаження завершено
    }, 300);
  };

  // Fallback: Try to start audio on any user interaction (if not started yet)
  useEffect(() => {
    const handleFirstInteraction = async () => {
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
  }, [isLoaded, canAutoPlay, isPlaying, play, screenState, welcomeSettings]);

  // Зупиняємо стару музику коли переходимо на головну сторінку
  useEffect(() => {
    if (screenState === 'main' && isPlaying) {
      // Зупиняємо стару глобальну музику на головній сторінці
      toggle(); // Це зупинить стару музику
    }
  }, [screenState, isPlaying, toggle]);

  const audioContextValue = {
    isPlaying,
    toggle,
    isLoaded,
    canAutoPlay
  };

  return (
    <AudioContext.Provider value={audioContextValue}>
      <div className="w-full h-screen overflow-hidden bg-black">

        
        <AnimatePresence mode="wait" initial={false}>
          {screenState === 'welcome' && !hasInitialLoadCompleted && (
            <WelcomeScreen 
              key="welcome" 
              onComplete={handleWelcomeComplete}
              isAudioLoaded={isLoaded}
              settings={welcomeSettings}
            />
          )}
          
          {screenState === 'intro' && !hasInitialLoadCompleted && (
            <IntroScreen 
              key="intro" 
              onComplete={handleIntroComplete} 
            />
          )}
          
          {(screenState === 'main' || hasInitialLoadCompleted) && (
            <MainScreen key="main" />
          )}
        </AnimatePresence>
      </div>
    </AudioContext.Provider>
  );
};

export default Index;
