import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselItem } from '../types/types';
import Carousel3D from './Carousel3D';
import SoundToggle from "./SoundToggle";
import { playSound, preloadSound } from '../utils/audioUtils';
import { useGlobalAudio } from '../hooks/useGlobalAudio';
import { useSimpleAdminSession } from '../hooks/useSimpleAdminSession';
import SimpleAdminLogin from './SimpleAdminLogin';
import AdminPanel from './AdminPanel';
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';
import SplineAnimation from './SplineAnimation';
import { useAnalytics } from '../hooks/useAnalytics';
import { webAudioManager } from '../utils/webAudioUtils';


// Простий хук для визначення типу пристрою
const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return deviceType;
};

// Sample data for carousel with SMM products
const defaultItems: CarouselItem[] = [
  {
    id: "1",
    title: "LINKCORE",
    description: "Мінімалістичний профіль-хаб. Один лінк, що відкриває весь твій цифровий слід.",
    imageUrl: "/photo/photo-1.png",
    url: "#linkcore"
  },
  {
    id: "2",
    title: "CASEMACHINE",
    description: "Сайт-кейсбук: твої проєкти в деталях, цифри, візуали, відгуки.",
    imageUrl: "/photo/photo-2.png",
    url: "#casemachine"
  },
  {
    id: "3",
    title: "BOOKME",
    description: "Інструмент бронювання консультацій. Години, оплата, зручність.",
    imageUrl: "/photo/photo-3.png",
    url: "/bookme"
  },
  {
    id: "4",
    title: "ADLAND",
    description: "Посадкові сторінки під рекламу. Швидкі, точні, ефективні.",
    imageUrl: "/photo/photo-4.png",
    url: "#adland"
  },
  {
    id: "5",
    title: "SELLKIT",
    description: "Магазин цифрових продуктів: гайдпаки, шаблони, caption-сети.",
    imageUrl: "/photo/photo-5.png",
    url: "#sellkit"
  }
];

interface MainScreenProps {
  visible: boolean;
  userInteracted?: boolean;
}

const MainScreen = ({ visible, userInteracted = false }: MainScreenProps) => {
  // Стани компонента
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [activeItem, setActiveItem] = useState<CarouselItem | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isConstructorUpdate, setIsConstructorUpdate] = useState(false);

  // Базові налаштування без агресивних фіксів
  useEffect(() => {
    // Базові налаштування для MainScreen
    document.body.style.overflowX = 'hidden';
    
    return () => {
      document.body.style.overflowX = '';
    };
  }, []);


  
  // Додаємо стан для заголовків
  const [headerTitle, setHeaderTitle] = useState("Усе що треба");
  const [headerSubtitle, setHeaderSubtitle] = useState("для твого SMM");
  const [headerDescription, setHeaderDescription] = useState("Професійні інструменти в одному місці");

  // Додаємо стан для адаптивних налаштувань
  const [adaptiveSettings, setAdaptiveSettings] = useState({
    mobile: {
      headerTitleFontSize: 36,
      headerSubtitleFontSize: 24,
      headerDescriptionFontSize: 16,
      headerTitleMarginBottom: 16,
      headerSubtitleMarginBottom: 12,
      headerDescriptionMarginBottom: 8,
      headerTitleLineHeight: 1.5,
      headerSubtitleLineHeight: 1.5,
      headerDescriptionLineHeight: 1.5,
      headerTitleLetterSpacing: 0.5,
      headerSubtitleLetterSpacing: 0.5,
      headerDescriptionLetterSpacing: 0.5,
      headerContainerPadding: 24,
      headerContainerMarginTop: 24,
      headerContainerMarginBottom: 24
    },
    tablet: {
      headerTitleFontSize: 48,
      headerSubtitleFontSize: 36,
      headerDescriptionFontSize: 20,
      headerTitleMarginBottom: 16,
      headerSubtitleMarginBottom: 12,
      headerDescriptionMarginBottom: 8,
      headerTitleLineHeight: 1.5,
      headerSubtitleLineHeight: 1.5,
      headerDescriptionLineHeight: 1.5,
      headerTitleLetterSpacing: 0.5,
      headerSubtitleLetterSpacing: 0.5,
      headerDescriptionLetterSpacing: 0.5,
      headerContainerPadding: 24,
      headerContainerMarginTop: 24,
      headerContainerMarginBottom: 24
    },
    desktop: {
      headerTitleFontSize: 60,
      headerSubtitleFontSize: 48,
      headerDescriptionFontSize: 24,
      headerTitleMarginBottom: 16,
      headerSubtitleMarginBottom: 12,
      headerDescriptionMarginBottom: 8,
      headerTitleLineHeight: 1.5,
      headerSubtitleLineHeight: 1.5,
      headerDescriptionLineHeight: 1.5,
      headerTitleLetterSpacing: 0.5,
      headerSubtitleLetterSpacing: 0.5,
      headerDescriptionLetterSpacing: 0.5,
      headerContainerPadding: 24,
      headerContainerMarginTop: 24,
      headerContainerMarginBottom: 24
    }
  });

  // Додаємо стани для розширених налаштувань тексту
  const [headerTextSettings, setHeaderTextSettings] = useState({
    // Розміри шрифтів
    headerTitleFontSize: 48,
    headerSubtitleFontSize: 36,
    headerDescriptionFontSize: 20,
    // Типи шрифтів
    headerTitleFontFamily: 'Inter',
    headerSubtitleFontFamily: 'Inter',
    headerDescriptionFontFamily: 'Inter',
    // Товщина та стиль шрифтів
    headerTitleFontWeight: 700,
    headerSubtitleFontWeight: 600,
    headerDescriptionFontWeight: 400,
    headerTitleFontStyle: 'normal',
    headerSubtitleFontStyle: 'normal',
    headerDescriptionFontStyle: 'normal',
    // Анімації появи
    headerTitleAnimation: 'fadeIn' as 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow',
    headerSubtitleAnimation: 'slideUp' as 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow',
    headerDescriptionAnimation: 'fadeIn' as 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow',
    // Анімації зникання
    headerTitleExitAnimation: 'fadeOut' as 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve',
    headerSubtitleExitAnimation: 'slideDown' as 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve',
    headerDescriptionExitAnimation: 'fadeOut' as 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve',
    // Тайминги анімацій
    headerAnimationDuration: 800,
    headerAnimationDelay: 200,
    // 3D ефекти
    headerTitle3DDepth: 0,
    headerSubtitle3DDepth: 0,
    headerDescription3DDepth: 0,
    // Інтенсивність тіней
    headerTitleShadowIntensity: 0.5,
    headerSubtitleShadowIntensity: 0.3,
    headerDescriptionShadowIntensity: 0.2,
    // Кольори тіней
    headerTitleShadowColor: '#000000',
    headerSubtitleShadowColor: '#000000',
    headerDescriptionShadowColor: '#000000'
  });

  // Додаємо стан для фону
  const [backgroundSettings, setBackgroundSettings] = useState({
    backgroundType: 'gradient' as 'color' | 'gradient' | 'image' | 'video',
    backgroundColor: '#1a1a1a',
    gradientFrom: '#f9fafb',
    gradientTo: '#f7f8fa',
    backgroundImage: '',
    backgroundVideo: ''
  });

  // Додаємо стан для налаштувань каруселі
  const [carouselSettings, setCarouselSettings] = useState({
    carouselStyle: 'premium' as 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic',
    animationSpeed: 'normal' as 'slow' | 'normal' | 'fast',
    showParticles: false,
    particleColor: '#ffffff',
    brandColor: '#4a4b57',
    accentColor: '#3b82f6'
  });

  // Додаємо стан для звукових налаштувань
  const [audioSettings, setAudioSettings] = useState({
    backgroundMusic: {
      enabled: false,
      url: "",
      volume: 0.5,
      loop: true,
      autoPlay: true,
      autoStartAfterWelcome: false
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
    },
    carouselSounds: {
      enabled: false,
      transitionUrl: "",
      hoverUrl: "",
      clickUrl: "",
      volume: 0.5
    },
    uiSounds: {
      enabled: false,
      buttonHoverUrl: "",
      buttonClickUrl: "",
      notificationUrl: "",
      volume: 0.5
    }
  });

  // Додаємо стан для 3D налаштувань
  const [splineSettings, setSplineSettings] = useState({
    enabled: false,
    sceneUrl: "",
    embedCode: "",
    localFile: "",
    position: 'background' as 'background' | 'foreground' | 'overlay',
    opacity: 1,
    scale: 1,
    autoplay: true,
    controls: false,
    method: 'component' as 'iframe' | 'component' | 'local'
  });

  // Додаємо стан для логотипа
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSize, setLogoSize] = useState(96);
  const [carouselActiveIndex, setCarouselActiveIndex] = useState(0);

  // Додаємо флаг для відстеження завантаження
  const [isDataLoaded, setIsDataLoaded] = useState(false);



  // Refs для елементів
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);

  // Hooks
  const deviceType = useDeviceType();
  const { isPlaying, toggle, isLoaded } = useGlobalAudio();

  // Додатковий ефект для обробки змін deviceType
  useEffect(() => {
    if (deviceType === 'mobile') {
      // Додаткові налаштування для мобільної версії
      const timer = setTimeout(() => {
        // Примусово оновлюємо layout після зміни deviceType
        forceLayoutUpdate();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [deviceType]);

  // Слухач для змін орієнтації екрана
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerWidth < 768) {
        console.log('📱 MainScreen: Зміна орієнтації екрана, оновлюємо layout');
        setTimeout(() => {
          forceLayoutUpdate();
        }, 300); // Даємо час браузеру перерахувати розміри
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);
  const { 
    isAdmin, 
    login, 
    logout, 
    shouldShowAdminButton,
    checkAdminUrlParameter
  } = useSimpleAdminSession();
  
  // Аналітика
  const { trackClick, cleanupRemovedCarouselItems } = useAnalytics();
  
  // Стан для фонової музики - ПРОСТА ЛОГІКА + МОБІЛЬНИЙ ФІX
  const [isBackgroundMusicEnabled, setIsBackgroundMusicEnabled] = useState(false);
  
  // Стан для відстеження активного індексу каруселі

  
  // Refs для аудіо компонентів

  // Глобальний Web Audio Manager для обходу autoplay політики
  useEffect(() => {
    const initBackgroundMusic = async () => {
      if (audioSettings.backgroundMusic.enabled && audioSettings.backgroundMusic.url) {
        // Завжди завантажуємо аудіо файл для готовності (тільки якщо ще не завантажено)
        const success = await webAudioManager.loadAudio(audioSettings.backgroundMusic.url, 'background-music');
        
        if (success && isBackgroundMusicEnabled && !webAudioManager.isAudioPlaying('background-music')) {
          // Запускаємо тільки якщо музика увімкнена і не грає
          await webAudioManager.playAudio('background-music', {
            loop: audioSettings.backgroundMusic.loop,
            volume: audioSettings.backgroundMusic.volume
          });
        }
        
        // Регістрируємо колбек для активації при взаємодії (тільки якщо увімкнена)
        webAudioManager.onActivation(() => {
          if (isBackgroundMusicEnabled && !webAudioManager.isAudioPlaying('background-music')) {
            webAudioManager.playAudio('background-music', {
              loop: audioSettings.backgroundMusic.loop,
              volume: audioSettings.backgroundMusic.volume
            });
          }
        });
      }
    };

    initBackgroundMusic();
  }, [audioSettings.backgroundMusic.url, audioSettings.backgroundMusic.enabled]);

  // 🎵 АВТОМАТИЧНИЙ ЗАПУСК ФОНОВОЇ МУЗИКИ ПРИ ВІДКРИТТІ ГОЛОВНОЇ СТОРІНКИ
  useEffect(() => {
    if (!visible || !audioSettings.backgroundMusic.enabled || !audioSettings.backgroundMusic.url) {
      return;
    }

    const autoStartBackgroundMusic = async () => {
      console.log('🎵 MainScreen: Перевіряємо автозапуск фонової музики');
      console.log('🎵 MainScreen: autoStartAfterWelcome:', audioSettings.backgroundMusic.autoStartAfterWelcome);
      
      if (audioSettings.backgroundMusic.autoStartAfterWelcome) {
        // Режим "постійної фонової музики" - музика запускається після Welcome і грає постійно
        console.log('🎵 MainScreen: Режим постійної фонової музики - музика має грати з Welcome');
        // Перевіряємо чи вже грає музика (запущена з Welcome)
        if (webAudioManager.isAudioPlaying('background-music')) {
          console.log('🎵 MainScreen: Фонова музика вже грає з Welcome - встановлюємо стан');
          setIsBackgroundMusicEnabled(true);
        }
      } else {
        // Режим "музика тільки на головній сторінці" - автозапуск при відкритті головної
        console.log('🎵 MainScreen: Режим музики тільки на головній - автозапуск при відкритті');
        setIsBackgroundMusicEnabled(true);
        
        // Запускаємо музику автоматично
        if (!webAudioManager.isAudioPlaying('background-music')) {
          try {
            await webAudioManager.playAudio('background-music', {
              loop: audioSettings.backgroundMusic.loop,
              volume: audioSettings.backgroundMusic.volume
            });
            console.log('✅ MainScreen: Фонова музика запущена автоматично');
          } catch (error) {
            console.log('⚠️ MainScreen: Автозапуск музики заблоковано браузером - чекаємо взаємодії');
          }
        }
      }
    };

    // Невелика затримка щоб компонент повністю ініціалізувався
    const timer = setTimeout(autoStartBackgroundMusic, 500);
    
    return () => clearTimeout(timer);
  }, [visible, audioSettings.backgroundMusic.enabled, audioSettings.backgroundMusic.url, audioSettings.backgroundMusic.autoStartAfterWelcome]);

  // 🎵 ЗУПИНКА ФОНОВОЇ МУЗИКИ ПРИ ВИХОДІ З ГОЛОВНОЇ СТОРІНКИ
  useEffect(() => {
    if (!visible && audioSettings.backgroundMusic.enabled && !audioSettings.backgroundMusic.autoStartAfterWelcome) {
      // Зупиняємо музику тільки якщо це не режим постійної музики
      console.log('🎵 MainScreen: Зупиняємо фонову музику при виході з головної сторінки');
      setIsBackgroundMusicEnabled(false);
      if (webAudioManager.isAudioPlaying('background-music')) {
        webAudioManager.stopAudio('background-music');
      }
    }
  }, [visible, audioSettings.backgroundMusic.enabled, audioSettings.backgroundMusic.autoStartAfterWelcome]);

  // 🎬 АВТОМАТИЧНЕ ЗАВАНТАЖЕННЯ І ЗАПУСК ВІДЕО
  useEffect(() => {
    const initBackgroundVideo = async () => {
      if (backgroundSettings.backgroundType === 'video' && backgroundSettings.backgroundVideo) {
        console.log('🎬 MainScreen: Ініціалізація фонового відео:', backgroundSettings.backgroundVideo);
        
        // Детекція мобільного пристрою
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        console.log('📱 MainScreen: Мобільний пристрій:', isMobile);
        
        // Знаходимо відео елемент
        const videoElement = document.querySelector('video[src*="' + backgroundSettings.backgroundVideo + '"], video source[src*="' + backgroundSettings.backgroundVideo + '"]')?.closest('video') as HTMLVideoElement;
        
        if (videoElement) {
          console.log('🎬 MainScreen: Знайдено відео елемент, налаштовуємо автозапуск');
          
          // Агресивні налаштування для автозапуску
          videoElement.muted = true;
          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.playsInline = true;
          videoElement.preload = 'auto';
          
          // Додаткові мобільні атрибути
          if (isMobile) {
            videoElement.setAttribute('webkit-playsinline', 'true');
            videoElement.setAttribute('playsinline', 'true');
            videoElement.setAttribute('controls', 'false');
            // НЕ блокуємо pointer events на мобільних - це може заважати
            videoElement.style.pointerEvents = 'auto';
            // Але додаємо спеціальні стилі для запобігання показу контролів
            (videoElement.style as any).webkitTouchCallout = 'none';
            (videoElement.style as any).webkitUserSelect = 'none';
            videoElement.style.userSelect = 'none';
            videoElement.style.outline = 'none';
          } else {
            // На десктопі можемо блокувати pointer events
            videoElement.style.pointerEvents = 'none';
          }
          
          // Спробуємо запустити відразу
          try {
            await videoElement.play();
            console.log('✅ MainScreen: Відео запущено автоматично');
          } catch (error) {
            console.log('⚠️ MainScreen: Автозапуск відео заблоковано, налаштовуємо слухачі');
            
            // Регістрируємо колбек для запуску при взаємодії через webAudioManager
            webAudioManager.onActivation(async () => {
              try {
                await videoElement.play();
                console.log('✅ MainScreen: Відео запущено через доміно ефект');
              } catch (err) {
                console.error('❌ MainScreen: Помилка запуску відео через доміно ефект:', err);
              }
            });
            
            // 📱 СПЕЦІАЛЬНА ЛОГІКА ДЛЯ МОБІЛЬНИХ
            if (isMobile) {
              console.log('📱 MainScreen: Додаємо мобільні слухачі подій для відео');
              
              // Функція для запуску відео
              const playVideo = async (event: Event) => {
                // Запобігаємо відкриттю контролів відео
                event.preventDefault();
                event.stopPropagation();
                
                try {
                  await videoElement.play();
                  console.log('✅ MainScreen: Відео запущено через мобільну взаємодію');
                  // Видаляємо слухачі після успішного запуску
                  document.removeEventListener('touchstart', playVideo);
                  document.removeEventListener('click', playVideo);
                  videoElement.removeEventListener('touchstart', playVideo);
                  videoElement.removeEventListener('click', playVideo);
                } catch (err) {
                  console.log('⚠️ MainScreen: Спроба запуску відео через мобільну взаємодію не вдалася:', err);
                }
              };
              
              // Додаємо слухачі тільки на документ, не на відео елемент
              document.addEventListener('touchstart', playVideo, { once: true, passive: false });
              document.addEventListener('click', playVideo, { once: true, passive: false });
              
              // Додаємо спеціальний слухач на відео для запобігання показу контролів
              const preventVideoControls = (event: Event) => {
                event.preventDefault();
                event.stopPropagation();
                return false;
              };
              
              videoElement.addEventListener('contextmenu', preventVideoControls);
              videoElement.addEventListener('webkitfullscreenchange', preventVideoControls);
              videoElement.addEventListener('fullscreenchange', preventVideoControls);
            }
          }
        } else {
          console.log('⚠️ MainScreen: Відео елемент не знайдено, чекаємо на завантаження');
          
          // Якщо елемент ще не створений, чекаємо і пробуємо знову
          setTimeout(() => {
            const delayedVideoElement = document.querySelector('video[src*="' + backgroundSettings.backgroundVideo + '"], video source[src*="' + backgroundSettings.backgroundVideo + '"]')?.closest('video') as HTMLVideoElement;
            
            if (delayedVideoElement) {
              console.log('🎬 MainScreen: Знайдено відео елемент з затримкою, налаштовуємо автозапуск');
              
              delayedVideoElement.muted = true;
              delayedVideoElement.autoplay = true;
              delayedVideoElement.loop = true;
              delayedVideoElement.playsInline = true;
              delayedVideoElement.preload = 'auto';
              
              // Додаткові мобільні атрибути
              if (isMobile) {
                delayedVideoElement.setAttribute('webkit-playsinline', 'true');
                delayedVideoElement.setAttribute('playsinline', 'true');
                delayedVideoElement.setAttribute('controls', 'false');
                delayedVideoElement.style.pointerEvents = 'auto';
                (delayedVideoElement.style as any).webkitTouchCallout = 'none';
                (delayedVideoElement.style as any).webkitUserSelect = 'none';
                delayedVideoElement.style.userSelect = 'none';
                delayedVideoElement.style.outline = 'none';
              } else {
                delayedVideoElement.style.pointerEvents = 'none';
              }
              
              // Спробуємо запустити
              delayedVideoElement.play().then(() => {
                console.log('✅ MainScreen: Відео запущено з затримкою');
              }).catch(() => {
                console.log('⚠️ MainScreen: Автозапуск відео з затримкою заблоковано, додаємо до доміно ефекту');
                
                webAudioManager.onActivation(async () => {
                  try {
                    await delayedVideoElement.play();
                    console.log('✅ MainScreen: Відео запущено через доміно ефект (з затримкою)');
                  } catch (err) {
                    console.error('❌ MainScreen: Помилка запуску відео через доміно ефект (з затримкою):', err);
                  }
                });
                
                // Мобільні слухачі для затриманого елемента
                if (isMobile) {
                  const playDelayedVideo = async (event: Event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    try {
                      await delayedVideoElement.play();
                      console.log('✅ MainScreen: Затримане відео запущено через мобільну взаємодію');
                      document.removeEventListener('touchstart', playDelayedVideo);
                      document.removeEventListener('click', playDelayedVideo);
                    } catch (err) {
                      console.log('⚠️ MainScreen: Спроба запуску затриманого відео не вдалася:', err);
                    }
                  };
                  
                  document.addEventListener('touchstart', playDelayedVideo, { once: true, passive: false });
                  document.addEventListener('click', playDelayedVideo, { once: true, passive: false });
                  
                  // Запобігаємо показу контролів на затриманому відео
                  const preventControls = (event: Event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  };
                  
                  delayedVideoElement.addEventListener('contextmenu', preventControls);
                  delayedVideoElement.addEventListener('webkitfullscreenchange', preventControls);
                  delayedVideoElement.addEventListener('fullscreenchange', preventControls);
                }
              });
            }
          }, 1000);
        }
      }
    };

    initBackgroundVideo();
  }, [backgroundSettings.backgroundType, backgroundSettings.backgroundVideo]);

  // Логування налаштувань аудіо (відключено для чистоти консолі)
  // useEffect(() => {
  //   console.log('🎵 MainScreen: Налаштування аудіо:', audioSettings.backgroundMusic);
  // }, [audioSettings.backgroundMusic]);

  // Refs для звукових ефектів (не фонової музики)
  const hoverSoundRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const carouselTransitionSoundRef = useRef<HTMLAudioElement>(null);
  const carouselHoverSoundRef = useRef<HTMLAudioElement>(null);
  const carouselClickSoundRef = useRef<HTMLAudioElement>(null);

  // Функції для відтворення звуків
  const playHoverSound = useCallback(() => {
    playSound(audioSettings.hoverSounds);
  }, [audioSettings.hoverSounds]);

  const playClickSound = useCallback(() => {
    playSound(audioSettings.clickSounds);
  }, [audioSettings.clickSounds]);

  const playCarouselTransitionSound = useCallback(() => {
    if (audioSettings.carouselSounds.enabled && audioSettings.carouselSounds.transitionUrl) {
      playSound({
        enabled: audioSettings.carouselSounds.enabled,
        url: audioSettings.carouselSounds.transitionUrl,
        volume: audioSettings.carouselSounds.volume
      });
    }
  }, [audioSettings.carouselSounds]);

  const playCarouselHoverSound = useCallback(() => {
    if (audioSettings.carouselSounds.enabled && audioSettings.carouselSounds.hoverUrl) {
      playSound({
        enabled: audioSettings.carouselSounds.enabled,
        url: audioSettings.carouselSounds.hoverUrl,
        volume: audioSettings.carouselSounds.volume
      });
    }
  }, [audioSettings.carouselSounds]);

  const playCarouselClickSound = useCallback(() => {
    if (audioSettings.carouselSounds.enabled && audioSettings.carouselSounds.clickUrl) {
      playSound({
        enabled: audioSettings.carouselSounds.enabled,
        url: audioSettings.carouselSounds.clickUrl,
        volume: audioSettings.carouselSounds.volume
      });
    }
  }, [audioSettings.carouselSounds]);

  // Завантаження даних з IndexedDB
  const loadDataFromStorage = async () => {
    try {
      console.log('🔄 MainScreen: Завантаження налаштувань через IndexedDBService...');
      
      // Очищуємо неправильно збережені відео файли
      await indexedDBService.cleanupInvalidVideoFiles();
      
      let settings = await indexedDBService.loadSettings('mainPageSettings');
      
      // Якщо немає локальних налаштувань і це не адмін режим, завантажуємо дефолтні
      if (!settings && !domainSyncService.isAdminMode()) {
        console.log('🔄 MainScreen: Локальні налаштування не знайдено в публічному режимі');
        // В Domain-based синхронізації ми автоматично отримуємо оновлення через localStorage events
        // Тому просто логуємо що чекаємо на потенційні оновлення з адмін панелі
      }
      
      if (!settings) {
        console.log('ℹ️ MainScreen: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
        const mainPageData = localStorage.getItem('mainPageSettings');
        
        if (mainPageData) {
          settings = JSON.parse(mainPageData);
          console.log('✅ MainScreen: Налаштування завантажено з localStorage');
          
          await indexedDBService.saveSettings('mainPageSettings', settings, 'project');
          console.log('✅ MainScreen: Міграція завершена');
        }
      } else {
        console.log('✅ MainScreen: Налаштування завантажено з IndexedDB');
      }
      
      if (settings) {
        // Завантажуємо заголовки
        if (settings.headerTitle) setHeaderTitle(settings.headerTitle);
        if (settings.headerSubtitle) setHeaderSubtitle(settings.headerSubtitle);
        if (settings.headerDescription) setHeaderDescription(settings.headerDescription);
        
        // Завантажуємо налаштування фону з окремих полів
        if (settings.backgroundType || settings.backgroundColor || settings.gradientFrom || settings.gradientTo || settings.backgroundImage || settings.backgroundVideo) {
          console.log('🔄 MainScreen: Завантажуємо налаштування фону з окремих полів');
          
          // Якщо є відео, автоматично встановлюємо тип фону як 'video'
          const hasVideo = settings.backgroundVideo && settings.backgroundVideo.trim() !== '';
          const backgroundType = hasVideo ? 'video' : (settings.backgroundType as 'color' | 'gradient' | 'image' | 'video') || 'gradient';
          
          if (hasVideo) {
            console.log('🎬 MainScreen: Знайдено фонове відео, автоматично встановлюємо тип фону як "video":', settings.backgroundVideo);
          }
          
          setBackgroundSettings(prev => ({
            ...prev,
            backgroundType: backgroundType,
            backgroundColor: (settings.backgroundColor as string) || prev.backgroundColor,
            gradientFrom: (settings.gradientFrom as string) || prev.gradientFrom,
            gradientTo: (settings.gradientTo as string) || prev.gradientTo,
            backgroundImage: (settings.backgroundImage as string) || prev.backgroundImage,
            backgroundVideo: (settings.backgroundVideo as string) || prev.backgroundVideo
          }));
        }
        
        // Завантажуємо налаштування каруселі з окремих полів
        if (settings.carouselStyle || settings.showParticles !== undefined || settings.particleColor || settings.animationSpeed || settings.brandColor || settings.accentColor) {
          console.log('🔄 MainScreen: Завантажуємо налаштування каруселі з окремих полів');
          setCarouselSettings(prev => ({
            ...prev,
            carouselStyle: (settings.carouselStyle as 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic') || prev.carouselStyle,
            animationSpeed: (settings.animationSpeed as 'slow' | 'normal' | 'fast') || prev.animationSpeed,
            showParticles: settings.showParticles !== undefined ? (settings.showParticles as boolean) : prev.showParticles,
            particleColor: (settings.particleColor as string) || prev.particleColor,
            brandColor: (settings.brandColor as string) || prev.brandColor,
            accentColor: (settings.accentColor as string) || prev.accentColor
          }));
        }
        
        // Завантажуємо адаптивні налаштування
        if (settings.mobile || settings.tablet || settings.desktop) {
          console.log('🔄 MainScreen: Завантажуємо адаптивні налаштування');
          setAdaptiveSettings(prev => ({
            ...prev,
            ...(settings.mobile && typeof settings.mobile === 'object' ? { mobile: { ...prev.mobile, ...settings.mobile } } : {}),
            ...(settings.tablet && typeof settings.tablet === 'object' ? { tablet: { ...prev.tablet, ...settings.tablet } } : {}),
            ...(settings.desktop && typeof settings.desktop === 'object' ? { desktop: { ...prev.desktop, ...settings.desktop } } : {})
          }));
        }
        
        // Завантажуємо розширені налаштування тексту з окремих полів
        const textSettings: any = {};
        if (settings.headerTitleFontSize) textSettings.headerTitleFontSize = settings.headerTitleFontSize;
        if (settings.headerSubtitleFontSize) textSettings.headerSubtitleFontSize = settings.headerSubtitleFontSize;
        if (settings.headerDescriptionFontSize) textSettings.headerDescriptionFontSize = settings.headerDescriptionFontSize;
        if (settings.headerTitleFontFamily) textSettings.headerTitleFontFamily = settings.headerTitleFontFamily;
        if (settings.headerSubtitleFontFamily) textSettings.headerSubtitleFontFamily = settings.headerSubtitleFontFamily;
        if (settings.headerDescriptionFontFamily) textSettings.headerDescriptionFontFamily = settings.headerDescriptionFontFamily;
        if (settings.headerTitleFontWeight) textSettings.headerTitleFontWeight = settings.headerTitleFontWeight;
        if (settings.headerSubtitleFontWeight) textSettings.headerSubtitleFontWeight = settings.headerSubtitleFontWeight;
        if (settings.headerDescriptionFontWeight) textSettings.headerDescriptionFontWeight = settings.headerDescriptionFontWeight;
        if (settings.headerTitleFontStyle) textSettings.headerTitleFontStyle = settings.headerTitleFontStyle;
        if (settings.headerSubtitleFontStyle) textSettings.headerSubtitleFontStyle = settings.headerSubtitleFontStyle;
        if (settings.headerDescriptionFontStyle) textSettings.headerDescriptionFontStyle = settings.headerDescriptionFontStyle;
        if (settings.headerTitleShadowIntensity !== undefined) textSettings.headerTitleShadowIntensity = settings.headerTitleShadowIntensity;
        if (settings.headerSubtitleShadowIntensity !== undefined) textSettings.headerSubtitleShadowIntensity = settings.headerSubtitleShadowIntensity;
        if (settings.headerDescriptionShadowIntensity !== undefined) textSettings.headerDescriptionShadowIntensity = settings.headerDescriptionShadowIntensity;
        
        // Додаємо інші налаштування тексту
        if (settings.headerTitleShadowColor) textSettings.headerTitleShadowColor = settings.headerTitleShadowColor;
        if (settings.headerSubtitleShadowColor) textSettings.headerSubtitleShadowColor = settings.headerSubtitleShadowColor;
        if (settings.headerDescriptionShadowColor) textSettings.headerDescriptionShadowColor = settings.headerDescriptionShadowColor;
        
        if (settings.headerTitleAnimation) textSettings.headerTitleAnimation = settings.headerTitleAnimation;
        if (settings.headerSubtitleAnimation) textSettings.headerSubtitleAnimation = settings.headerSubtitleAnimation;
        if (settings.headerDescriptionAnimation) textSettings.headerDescriptionAnimation = settings.headerDescriptionAnimation;
        
        if (settings.headerTitleExitAnimation) textSettings.headerTitleExitAnimation = settings.headerTitleExitAnimation;
        if (settings.headerSubtitleExitAnimation) textSettings.headerSubtitleExitAnimation = settings.headerSubtitleExitAnimation;
        if (settings.headerDescriptionExitAnimation) textSettings.headerDescriptionExitAnimation = settings.headerDescriptionExitAnimation;
        
        if (settings.headerAnimationDuration !== undefined) textSettings.headerAnimationDuration = settings.headerAnimationDuration;
        if (settings.headerAnimationDelay !== undefined) textSettings.headerAnimationDelay = settings.headerAnimationDelay;
        
        if (settings.headerTitle3DDepth !== undefined) textSettings.headerTitle3DDepth = settings.headerTitle3DDepth;
        if (settings.headerSubtitle3DDepth !== undefined) textSettings.headerSubtitle3DDepth = settings.headerSubtitle3DDepth;
        if (settings.headerDescription3DDepth !== undefined) textSettings.headerDescription3DDepth = settings.headerDescription3DDepth;
        
        if (Object.keys(textSettings).length > 0) {
          console.log('🔄 MainScreen: Завантажуємо налаштування тексту з IndexedDB:', textSettings);
          setHeaderTextSettings(prev => ({
            ...prev,
            ...textSettings
          }));
        }
        
        // Завантажуємо звукові налаштування
        if (settings.audioSettings && typeof settings.audioSettings === 'object') {
          setAudioSettings(prev => ({
            ...prev,
            ...(settings.audioSettings as typeof audioSettings)
          }));
        }

        // Завантажуємо 3D налаштування
        if (settings.splineSettings && typeof settings.splineSettings === 'object') {
          console.log('🌐 MainScreen: Завантажуємо 3D налаштування з IndexedDB:', settings.splineSettings);
          setSplineSettings(prev => ({
            ...prev,
            ...(settings.splineSettings as typeof splineSettings)
          }));
        }

        // Завантажуємо логотип
        if (settings.logoUrl) {
          console.log('🖼️ MainScreen: Завантажуємо логотип з IndexedDB:', settings.logoUrl);
          console.log('🖼️ MainScreen: Розмір логотипа:', settings.logoUrl.length, 'символів');
          setLogoUrl(settings.logoUrl);
        } else {
          console.log('⚠️ MainScreen: Логотип не знайдено в IndexedDB');
        }
        if (settings.logoSize) {
          console.log('📏 MainScreen: Завантажуємо розмір логотипа з IndexedDB:', settings.logoSize);
          setLogoSize(settings.logoSize);
        } else {
          console.log('⚠️ MainScreen: Розмір логотипа не знайдено в IndexedDB, використовуємо за замовчуванням:', logoSize);
        }
        
        // Завантажуємо елементи каруселі
        if (settings.carouselItems !== undefined && Array.isArray(settings.carouselItems)) {
          console.log('✅ MainScreen: Завантажено елементи каруселі з налаштувань:', settings.carouselItems.length, 'елементів');
          setCarouselItems(settings.carouselItems);
          if (settings.carouselItems.length > 0) {
            setActiveItem(settings.carouselItems[0]);
          }
        } else {
          // Використовуємо defaultItems тільки якщо немає збережених даних
          console.log('ℹ️ MainScreen: Використовуємо defaultItems як fallback');
          setCarouselItems(defaultItems);
          setActiveItem(defaultItems[0]);
        }
      } else {
        // Якщо немає налаштувань взагалі, використовуємо defaultItems
        console.log('ℹ️ MainScreen: Немає збережених налаштувань, використовуємо defaultItems');
        setCarouselItems(defaultItems);
        setActiveItem(defaultItems[0]);
      }
    } catch (error) {
      console.error('❌ MainScreen: Помилка завантаження налаштувань:', error);
    }
  };

  // Обробники подій
  const handleItemSelect = useCallback(async (item: CarouselItem) => {
    setActiveItem(item);
    // Синхронізуємо з крапочками
    const itemIndex = carouselItems.findIndex(carouselItem => carouselItem.id === item.id);
    if (itemIndex !== -1) {
      setCarouselActiveIndex(itemIndex);
    }
    
    // 🎵 ЗВУКОВІ ЕФЕКТИ КАРУСЕЛІ - це ізюминка!
    playCarouselTransitionSound(); // Звук переходу при виборі елемента
  }, [playCarouselTransitionSound, carouselItems]);

  // Функція для обробки зміни індексу каруселі
  const handleCarouselIndexChange = (index: number) => {
    setCarouselActiveIndex(index);
    if (carouselItems[index]) {
      setActiveItem(carouselItems[index]);
    }
  };

  // Функція для обробки кліку по крапочці пагінації
  const handlePaginationClick = (index: number) => {
    setCarouselActiveIndex(index);
    if (carouselItems[index]) {
      setActiveItem(carouselItems[index]);
    }
    playClickSound();
    playCarouselTransitionSound();
    trackClick(`#pagination-dot-${index}`, `Pagination Dot ${index + 1} Click`);
  };

  const handleAdminButtonClick = () => {
    console.log('🔧 Admin button clicked:', { isAdmin, hasAdminParam: checkAdminUrlParameter() });
    
    if (isAdmin) {
      // Якщо вже залогінений - показуємо панель
      setShowAdminPanel(true);
    } else {
      // Якщо не залогінений - показуємо форму логіну
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogin = () => {
    login();
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  const handleAdminLogout = () => {
    logout();
    setShowAdminPanel(false);
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };





  // Ефект для завантаження даних при ініціалізації
  useEffect(() => {
    if (!isDataLoaded) {
      loadDataFromStorage().then(() => {
        setIsDataLoaded(true);
      });
    }
    
    // Слухач для оновлень з адмін панелі
    const handleAdminDataUpdate = (event: CustomEvent<Record<string, unknown>>) => {
      const data = event.detail;
      if (data && typeof data === 'object' && 'carouselItems' in data) {
        const newItems = data.carouselItems as CarouselItem[];
        if (Array.isArray(newItems)) {
          console.log('🔄 MainScreen: Оновлення з адмін панелі:', newItems.length, 'елементів');
          setCarouselItems(newItems);
          if (newItems.length > 0) {
            setActiveItem(newItems[0]);
          } else {
            setActiveItem(null);
          }
        }
      }
    };

    // Слухач для оновлень з MainPageCustomizer
    const handleMainPageUpdate = (event: CustomEvent<Record<string, unknown>>) => {
      const settings = event.detail;
      
      console.log('🔄 MainScreen: Отримано оновлення з конструктора:', settings);
      
      // Позначаємо що це оновлення з конструктора
      setIsConstructorUpdate(true);
      
      // Оновлюємо заголовки
      if (settings.headerTitle !== undefined) {
        setHeaderTitle(settings.headerTitle as string);
      }
      if (settings.headerSubtitle !== undefined) {
        setHeaderSubtitle(settings.headerSubtitle as string);
      }
      if (settings.headerDescription !== undefined) {
        setHeaderDescription(settings.headerDescription as string);
      }

      // Оновлюємо налаштування фону з окремих полів
      if (settings.backgroundType || settings.backgroundColor || settings.gradientFrom || settings.gradientTo || settings.backgroundImage || settings.backgroundVideo !== undefined) {
        console.log('🔄 MainScreen: Оновлюємо налаштування фону з конструктора', {
          backgroundType: settings.backgroundType,
          hasBackgroundVideo: !!settings.backgroundVideo,
          backgroundVideoSize: settings.backgroundVideo ? (settings.backgroundVideo as string).length : 0
        });
        setBackgroundSettings(prev => ({
          ...prev,
          backgroundType: (settings.backgroundType as 'color' | 'gradient' | 'image' | 'video') || prev.backgroundType,
          backgroundColor: (settings.backgroundColor as string) || prev.backgroundColor,
          gradientFrom: (settings.gradientFrom as string) || prev.gradientFrom,
          gradientTo: (settings.gradientTo as string) || prev.gradientTo,
          backgroundImage: (settings.backgroundImage as string) || prev.backgroundImage,
          backgroundVideo: settings.backgroundVideo !== undefined ? (settings.backgroundVideo as string) : prev.backgroundVideo
        }));
      }

      // Оновлюємо налаштування каруселі з окремих полів
      if (settings.carouselStyle || settings.showParticles !== undefined || settings.particleColor || settings.animationSpeed || settings.brandColor || settings.accentColor) {
        console.log('🔄 MainScreen: Оновлюємо налаштування каруселі з конструктора');
        setCarouselSettings(prev => ({
          ...prev,
          carouselStyle: (settings.carouselStyle as 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic') || prev.carouselStyle,
          animationSpeed: (settings.animationSpeed as 'slow' | 'normal' | 'fast') || prev.animationSpeed,
          showParticles: settings.showParticles !== undefined ? (settings.showParticles as boolean) : prev.showParticles,
          particleColor: (settings.particleColor as string) || prev.particleColor,
          brandColor: (settings.brandColor as string) || prev.brandColor,
          accentColor: (settings.accentColor as string) || prev.accentColor
        }));
      }

      // Оновлюємо звукові налаштування
      if (settings.audioSettings) {
        const newAudioSettings = settings.audioSettings as any;
        console.log('🔄 MainScreen: Оновлюємо аудіо налаштування з конструктора:', newAudioSettings);
        setAudioSettings(prev => ({
          ...prev,
          ...(newAudioSettings as typeof audioSettings)
        }));
      }

      // Оновлюємо налаштування шрифтів та тексту
      const textSettingsUpdate: any = {};
      
      // Розміри шрифтів
      if (settings.headerTitleFontSize !== undefined) textSettingsUpdate.headerTitleFontSize = settings.headerTitleFontSize;
      if (settings.headerSubtitleFontSize !== undefined) textSettingsUpdate.headerSubtitleFontSize = settings.headerSubtitleFontSize;
      if (settings.headerDescriptionFontSize !== undefined) textSettingsUpdate.headerDescriptionFontSize = settings.headerDescriptionFontSize;
      
      // Сімейства шрифтів
      if (settings.headerTitleFontFamily !== undefined) textSettingsUpdate.headerTitleFontFamily = settings.headerTitleFontFamily;
      if (settings.headerSubtitleFontFamily !== undefined) textSettingsUpdate.headerSubtitleFontFamily = settings.headerSubtitleFontFamily;
      if (settings.headerDescriptionFontFamily !== undefined) textSettingsUpdate.headerDescriptionFontFamily = settings.headerDescriptionFontFamily;
      
      // Товщина шрифтів
      if (settings.headerTitleFontWeight !== undefined) textSettingsUpdate.headerTitleFontWeight = settings.headerTitleFontWeight;
      if (settings.headerSubtitleFontWeight !== undefined) textSettingsUpdate.headerSubtitleFontWeight = settings.headerSubtitleFontWeight;
      if (settings.headerDescriptionFontWeight !== undefined) textSettingsUpdate.headerDescriptionFontWeight = settings.headerDescriptionFontWeight;
      
      // Стиль шрифтів
      if (settings.headerTitleFontStyle !== undefined) textSettingsUpdate.headerTitleFontStyle = settings.headerTitleFontStyle;
      if (settings.headerSubtitleFontStyle !== undefined) textSettingsUpdate.headerSubtitleFontStyle = settings.headerSubtitleFontStyle;
      if (settings.headerDescriptionFontStyle !== undefined) textSettingsUpdate.headerDescriptionFontStyle = settings.headerDescriptionFontStyle;
      
      // Анімації
      if (settings.headerTitleAnimation !== undefined) textSettingsUpdate.headerTitleAnimation = settings.headerTitleAnimation;
      if (settings.headerSubtitleAnimation !== undefined) textSettingsUpdate.headerSubtitleAnimation = settings.headerSubtitleAnimation;
      if (settings.headerDescriptionAnimation !== undefined) textSettingsUpdate.headerDescriptionAnimation = settings.headerDescriptionAnimation;
      
      if (settings.headerTitleExitAnimation !== undefined) textSettingsUpdate.headerTitleExitAnimation = settings.headerTitleExitAnimation;
      if (settings.headerSubtitleExitAnimation !== undefined) textSettingsUpdate.headerSubtitleExitAnimation = settings.headerSubtitleExitAnimation;
      if (settings.headerDescriptionExitAnimation !== undefined) textSettingsUpdate.headerDescriptionExitAnimation = settings.headerDescriptionExitAnimation;
      
      // Тайминги анімацій
      if (settings.headerAnimationDuration !== undefined) textSettingsUpdate.headerAnimationDuration = settings.headerAnimationDuration;
      if (settings.headerAnimationDelay !== undefined) textSettingsUpdate.headerAnimationDelay = settings.headerAnimationDelay;
      
      // 3D ефекти
      if (settings.headerTitle3DDepth !== undefined) textSettingsUpdate.headerTitle3DDepth = settings.headerTitle3DDepth;
      if (settings.headerSubtitle3DDepth !== undefined) textSettingsUpdate.headerSubtitle3DDepth = settings.headerSubtitle3DDepth;
      if (settings.headerDescription3DDepth !== undefined) textSettingsUpdate.headerDescription3DDepth = settings.headerDescription3DDepth;
      
      // Тіні
      if (settings.headerTitleShadowIntensity !== undefined) textSettingsUpdate.headerTitleShadowIntensity = settings.headerTitleShadowIntensity;
      if (settings.headerSubtitleShadowIntensity !== undefined) textSettingsUpdate.headerSubtitleShadowIntensity = settings.headerSubtitleShadowIntensity;
      if (settings.headerDescriptionShadowIntensity !== undefined) textSettingsUpdate.headerDescriptionShadowIntensity = settings.headerDescriptionShadowIntensity;
      
      if (settings.headerTitleShadowColor !== undefined) textSettingsUpdate.headerTitleShadowColor = settings.headerTitleShadowColor;
      if (settings.headerSubtitleShadowColor !== undefined) textSettingsUpdate.headerSubtitleShadowColor = settings.headerSubtitleShadowColor;
      if (settings.headerDescriptionShadowColor !== undefined) textSettingsUpdate.headerDescriptionShadowColor = settings.headerDescriptionShadowColor;
      
      // Оновлюємо налаштування тексту якщо є зміни
      if (Object.keys(textSettingsUpdate).length > 0) {
        console.log('🔄 MainScreen: Оновлюємо налаштування тексту з конструктора:', textSettingsUpdate);
        setHeaderTextSettings(prev => ({
          ...prev,
          ...textSettingsUpdate
        }));
      }

      // Оновлюємо адаптивні налаштування
      if (settings.mobile || settings.tablet || settings.desktop) {
        console.log('🔄 MainScreen: Оновлюємо адаптивні налаштування з конструктора');
        setAdaptiveSettings(prev => ({
          ...prev,
          ...(settings.mobile && typeof settings.mobile === 'object' ? { mobile: { ...prev.mobile, ...settings.mobile } } : {}),
          ...(settings.tablet && typeof settings.tablet === 'object' ? { tablet: { ...prev.tablet, ...settings.tablet } } : {}),
          ...(settings.desktop && typeof settings.desktop === 'object' ? { desktop: { ...prev.desktop, ...settings.desktop } } : {})
        }));
      }

      // Оновлюємо 3D налаштування
      if (settings.splineSettings) {
        console.log('🌐 MainScreen: Оновлюємо 3D налаштування з конструктора:', settings.splineSettings);
        setSplineSettings(prev => ({
          ...prev,
          ...(settings.splineSettings as typeof splineSettings)
        }));
      }

      // Оновлюємо логотип
      if (settings.logoUrl !== undefined) {
        console.log('🖼️ MainScreen: Оновлюємо логотип з конструктора:', settings.logoUrl);
        setLogoUrl(settings.logoUrl as string);
      }
      if (settings.logoSize !== undefined) {
        console.log('📏 MainScreen: Оновлюємо розмір логотипа з конструктора:', settings.logoSize);
        setLogoSize(settings.logoSize as number);
      }

      // Оновлюємо елементи каруселі
      if (settings.carouselItems && Array.isArray(settings.carouselItems)) {
        console.log('🔄 MainScreen: Оновлюємо елементи каруселі з конструктора:', settings.carouselItems.length, 'елементів');
        
        const updatedItems = settings.carouselItems.map((item: any, index: number) => ({
          id: item.id || `item-${index}`,
          title: item.title || `Елемент ${index + 1}`,
          description: item.description || `Опис елемента ${index + 1}`,
          imageUrl: item.imageUrl || '',
          videoUrl: item.videoUrl || '',
          url: item.url || '#'
        }));
        
        setCarouselItems(updatedItems);
        if (updatedItems.length > 0) {
          setActiveItem(updatedItems[0]);
        }
      }
      
      // Скидаємо прапорець через невеликий час та примусово оновлюємо layout
      setTimeout(() => {
        setIsConstructorUpdate(false);
        
        // Викликаємо функцію примусового оновлення layout
        forceLayoutUpdate();
      }, 1000);
    };

    // Слухач для синхронізації з адмін панелі через DomainSyncService
    const handleDomainSyncUpdate = (event: CustomEvent<Record<string, unknown>>) => {
      const settings = event.detail;
      console.log('🔄 MainScreen: Отримано синхронізацію з адмін панелі:', settings);
      
      // Викликаємо той же обробник що і для оновлень з конструктора
      handleMainPageUpdate(event);
    };

    window.addEventListener('adminDataUpdated', handleAdminDataUpdate as EventListener);
    window.addEventListener('mainPageSettingsUpdated', handleMainPageUpdate as EventListener);
    window.addEventListener('mainPageSettingsUpdated', handleDomainSyncUpdate as EventListener);
    
    return () => {
      window.removeEventListener('adminDataUpdated', handleAdminDataUpdate as EventListener);
      window.removeEventListener('mainPageSettingsUpdated', handleMainPageUpdate as EventListener);
      window.removeEventListener('mainPageSettingsUpdated', handleDomainSyncUpdate as EventListener);
    };
  }, [isDataLoaded]);

  // Ефект для обробки видимості компонента
  useEffect(() => {
    if (visible && deviceType === 'mobile') {
      // Коли компонент стає видимим на мобільному пристрої, примусово оновлюємо layout
      console.log('📱 MainScreen: Мобільна версія стала видимою, logoUrl:', logoUrl, 'logoSize:', logoSize);
      const timer = setTimeout(() => {
        forceLayoutUpdate();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [visible, deviceType, logoUrl, logoSize]);

  // Ефект для діагностики стану логотипа
  useEffect(() => {
    console.log('🔍 MainScreen: Стан логотипа змінився:', {
      deviceType,
      logoUrl: logoUrl ? 'є' : 'немає',
      logoUrlLength: logoUrl ? logoUrl.length : 0,
      logoSize,
      visible
    });
  }, [deviceType, logoUrl, logoSize, visible]);

  // Ефект для завантаження важких медіафайлів при зміні елементів каруселі
  useEffect(() => {
    // Запускаємо тільки якщо дані завантажені і є елементи що потребують медіафайли
    if (isDataLoaded && carouselItems.length > 0) {
      // Якщо це оновлення з конструктора, не додаємо затримку
      if (isConstructorUpdate) {
        console.log('🔄 MainScreen: Оновлення з конструктора - медіафайли завантажуються миттєво');
        return;
      }
      
      const needsMediaLoad = carouselItems.some(item => 
        (!item.imageUrl || item.imageUrl.length < 100 * 1024) ||
        (!item.videoUrl || item.videoUrl.length < 100 * 1024)
      );
      
      if (needsMediaLoad) {
        console.log('🔄 MainScreen: Медіафайли будуть завантажені через Carousel3D');
        // Тепер завантаження відбувається безпосередньо в Carousel3D компоненті
      }
    }
  }, [isDataLoaded, carouselItems.length, isConstructorUpdate]); // Додаємо isConstructorUpdate до залежностей

  // Автоматичне очищення аналітики при зміні елементів каруселі
  useEffect(() => {
    if (carouselItems.length > 0) {
      const wasCleanedUp = cleanupRemovedCarouselItems(carouselItems);
      if (wasCleanedUp) {
        console.log('✅ MainScreen: Аналітика автоматично очищена від видалених елементів каруселі');
      }
    }
  }, [carouselItems, cleanupRemovedCarouselItems]);

  // Видалено складну логіку валідації відео - тепер використовуємо просту реалізацію як у IntroScreen

  // Функція для генерації стилів фону
  const getBackgroundStyle = () => {
    switch (backgroundSettings.backgroundType) {
      case 'color':
        return {
          background: backgroundSettings.backgroundColor
        };
      case 'gradient':
        return {
          background: `linear-gradient(to bottom, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
        };
      case 'image':
        return backgroundSettings.backgroundImage ? {
          backgroundImage: `url(${backgroundSettings.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : {
          background: `linear-gradient(to bottom, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
        };
      case 'video':
        return {
          background: `linear-gradient(to bottom, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
        };
      default:
        return {
          background: `linear-gradient(to bottom, ${backgroundSettings.gradientFrom}, ${backgroundSettings.gradientTo})`
        };
    }
  };

  // Функція для примусового оновлення layout в мобільній версії
  const forceLayoutUpdate = () => {
    if (window.innerWidth < 768) {
      console.log('📱 MainScreen: Примусове оновлення layout для мобільної версії');
      
      // Примусово перерахуємо розміри
      window.dispatchEvent(new Event('resize'));
      
      // Примусово перемалюємо компонент
      const mainContainer = document.querySelector('.main-screen-container');
      if (mainContainer) {
        const element = mainContainer as HTMLElement;
        
        // Зберігаємо поточні стилі
        const currentDisplay = element.style.display;
        const currentTransform = element.style.transform;
        
        // Примусово викликаємо reflow
        element.style.display = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.display = currentDisplay || 'block';
        
        // Додаткові стилі для стабільності
        element.style.height = '100vh';
        element.style.minHeight = '100vh';
        element.style.width = '100vw';
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        // Використовуємо GPU acceleration для плавності
        element.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => {
          element.style.transform = currentTransform || '';
        });
      }
      
      // Також оновлюємо всі дочірні елементи з motion
      const motionElements = document.querySelectorAll('.main-screen-container [data-framer-motion], .main-screen-container > div');
      motionElements.forEach(el => {
        const element = el as HTMLElement;
        const currentTransform = element.style.transform;
        element.style.transform = 'translateZ(0)';
        requestAnimationFrame(() => {
          element.style.transform = currentTransform || '';
        });
      });
      
      // Додатковий фікс для Framer Motion компонентів
      setTimeout(() => {
        const motionDivs = document.querySelectorAll('.main-screen-container > div');
        motionDivs.forEach(div => {
          const element = div as HTMLElement;
          element.style.width = '100%';
          element.style.height = '100%';
          element.style.minHeight = '100vh';
        });
      }, 100);
      
      console.log('✅ MainScreen: Layout оновлено для мобільної версії');
    }
  };

  // Функція для toggle фонової музики через Web Audio API
  const toggleBackgroundMusic = () => {
    const newState = !isBackgroundMusicEnabled;
    setIsBackgroundMusicEnabled(newState);
    
    // Аналітика
    trackClick('#sound-toggle', `Sound Toggle: ${newState ? 'On' : 'Off'}`);
    
    if (newState) {
      // Включаємо музику (тільки якщо вона не грає)
      if (audioSettings.backgroundMusic.url && !webAudioManager.isAudioPlaying('background-music')) {
        webAudioManager.playAudio('background-music', {
          loop: audioSettings.backgroundMusic.loop,
          volume: audioSettings.backgroundMusic.volume
        });
      }
    } else {
      // Виключаємо музику (тільки якщо вона грає)
      if (webAudioManager.isAudioPlaying('background-music')) {
        webAudioManager.stopAudio('background-music');
      }
    }
  };



  return (
    <div 
      className="main-screen-container overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        position: 'relative',
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        display: visible ? 'block' : 'none',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      {/* Фонове відео якщо вибрано */}
      {backgroundSettings.backgroundType === 'video' && backgroundSettings.backgroundVideo && (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            webkit-playsinline="true"
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ pointerEvents: 'none' }}
            onPlay={() => {
              // Відео запустилося успішно
            }}
            onError={(e) => console.error('❌ MainScreen: Помилка відео:', e)}
          >
            <source src={backgroundSettings.backgroundVideo} type="video/mp4" />
          </video>
          

        </>
      )}



      {/* 3D Анімація Spline */}
      {splineSettings.enabled && (
        <SplineAnimation
          sceneUrl={splineSettings.sceneUrl}
          embedCode={splineSettings.embedCode}
          localFile={splineSettings.localFile}
          position={splineSettings.position}
          opacity={splineSettings.opacity}
          scale={splineSettings.scale}
          autoplay={splineSettings.autoplay}
          controls={splineSettings.controls}
          method={splineSettings.method}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 1.6, 
          ease: [0.25, 0.1, 0.25, 1.0] // Плавніша крива анімації
        }}
        className="relative w-full h-full z-10"
        style={{
          backgroundColor: 'transparent',
          minHeight: '100vh'
        }}
      >
        {/* Background pattern overlay - ВІДКЛЮЧЕНО для чистого фону */}
        {false && (backgroundSettings.backgroundType === 'gradient' || backgroundSettings.backgroundType === 'color') && (
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.08]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.08 }}
              transition={{ duration: 1.5, delay: 0.3 }}
            ></motion.div>
          </div>
        )}
        
        {/* Логотип по центру */}
        <motion.header 
          className="absolute top-4 sm:top-6 lg:top-8 xl:top-10 inset-x-0 flex justify-center px-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {/* Адаптивний логотип */}
          {logoUrl ? (
            <motion.div
              className="flex items-center justify-center cursor-pointer select-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              onMouseEnter={playHoverSound}
              onClick={() => {
                console.log('🖼️ MainScreen: Клік по логотипу, deviceType:', deviceType, 'logoUrl:', logoUrl);
                trackClick('#main-logo', 'Main Logo Click');
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                className="object-contain"
                style={{
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                  maxWidth: '200px',
                  maxHeight: '200px'
                }}
                onLoad={() => {
                  console.log('✅ MainScreen: Логотип успішно завантажено, deviceType:', deviceType, 'розмір:', logoSize);
                }}
                onError={(e) => {
                  console.error('❌ MainScreen: Помилка завантаження логотипа:', logoUrl, 'deviceType:', deviceType);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          ) : (
            <div className="flex items-center rounded-full px-4 py-2 lg:px-6 lg:py-3 smooth-transition glass-effect"
                 style={{
                   background: 'rgba(255,255,255,0.95)',
                   boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                   border: '1px solid rgba(255,255,255,0.8)',
                 }}>
              <motion.div 
                className="flex items-center space-x-2 lg:space-x-3 cursor-pointer select-none"
                onMouseEnter={playHoverSound}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #4a4b57 0%, #303142 100%)',
                    boxShadow: '0 1px 3px rgba(48,49,66,0.3)'
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <motion.div 
                    className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-white"
                    whileHover={{
                      scale: 1.2,
                      transition: { duration: 0.2 }
                    }}
                  />
                </motion.div>
                <motion.span 
                  className="text-base lg:text-lg xl:text-xl font-semibold text-[#111111] sf-text"
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <span className="font-light">SMM</span> <span className="font-semibold">OS</span>
                </motion.span>
              </motion.div>
            </div>
          )}
        </motion.header>

        {/* Кнопка звуку справа */}
        <motion.div
          className="absolute top-4 sm:top-6 lg:top-8 xl:top-10 right-4 z-20"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <SoundToggle 
            isOn={isBackgroundMusicEnabled} 
            onToggle={() => {
              toggleBackgroundMusic();
              trackClick('#sound-toggle', `Sound Toggle: ${!isBackgroundMusicEnabled ? 'On' : 'Off'}`);
            }} 
            isLoaded={true}
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
          />
        </motion.div>
        
        {/* Центрований контейнер для всього контенту */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 lg:px-8 xl:px-12 pt-20 lg:pt-24 xl:pt-28">
          {/* Заголовок */}
          <motion.div 
            className="text-center max-w-5xl w-full mb-4 lg:mb-6 xl:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          >
            <motion.h1 
              className="leading-tight tracking-tight text-balance drop-shadow-lg cursor-pointer select-none"
              style={{
                fontSize: deviceType === 'mobile' ? adaptiveSettings.mobile.headerTitleFontSize : 
                         deviceType === 'tablet' ? adaptiveSettings.tablet.headerTitleFontSize : 
                         adaptiveSettings.desktop.headerTitleFontSize,
                fontFamily: headerTextSettings.headerTitleFontFamily,
                fontWeight: headerTextSettings.headerTitleFontWeight,
                fontStyle: headerTextSettings.headerTitleFontStyle,
                lineHeight: deviceType === 'mobile' ? adaptiveSettings.mobile.headerTitleLineHeight : 
                           deviceType === 'tablet' ? adaptiveSettings.tablet.headerTitleLineHeight : 
                           adaptiveSettings.desktop.headerTitleLineHeight,
                letterSpacing: deviceType === 'mobile' ? adaptiveSettings.mobile.headerTitleLetterSpacing : 
                              deviceType === 'tablet' ? adaptiveSettings.tablet.headerTitleLetterSpacing : 
                              adaptiveSettings.desktop.headerTitleLetterSpacing,
                marginBottom: deviceType === 'mobile' ? adaptiveSettings.mobile.headerTitleMarginBottom : 
                             deviceType === 'tablet' ? adaptiveSettings.tablet.headerTitleMarginBottom : 
                             adaptiveSettings.desktop.headerTitleMarginBottom,
                color: 'white',
                textShadow: `0 2px 4px rgba(0,0,0,${headerTextSettings.headerTitleShadowIntensity})`
              }}
              onMouseEnter={playHoverSound}
              onClick={() => trackClick('#main-title', `Main Title Click: ${headerTitle}`)}
              whileHover={{ 
                scale: 1.025,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.975 }}
            >
              {headerTitle}
            </motion.h1>
            
            <motion.h2 
              className="font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent cursor-pointer select-none"
              style={{
                fontSize: deviceType === 'mobile' ? adaptiveSettings.mobile.headerSubtitleFontSize : 
                         deviceType === 'tablet' ? adaptiveSettings.tablet.headerSubtitleFontSize : 
                         adaptiveSettings.desktop.headerSubtitleFontSize,
                fontFamily: headerTextSettings.headerSubtitleFontFamily,
                fontWeight: headerTextSettings.headerSubtitleFontWeight,
                fontStyle: headerTextSettings.headerSubtitleFontStyle,
                lineHeight: deviceType === 'mobile' ? adaptiveSettings.mobile.headerSubtitleLineHeight : 
                           deviceType === 'tablet' ? adaptiveSettings.tablet.headerSubtitleLineHeight : 
                           adaptiveSettings.desktop.headerSubtitleLineHeight,
                letterSpacing: deviceType === 'mobile' ? adaptiveSettings.mobile.headerSubtitleLetterSpacing : 
                              deviceType === 'tablet' ? adaptiveSettings.tablet.headerSubtitleLetterSpacing : 
                              adaptiveSettings.desktop.headerSubtitleLetterSpacing,
                marginTop: 16,
                marginBottom: deviceType === 'mobile' ? adaptiveSettings.mobile.headerSubtitleMarginBottom : 
                             deviceType === 'tablet' ? adaptiveSettings.tablet.headerSubtitleMarginBottom : 
                             adaptiveSettings.desktop.headerSubtitleMarginBottom
              }}
              onMouseEnter={playHoverSound}
              onClick={() => trackClick('#main-subtitle', `Main Subtitle Click: ${headerSubtitle}`)}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.97 }}
            >
              {headerSubtitle}
            </motion.h2>
            
            <motion.p 
              className="font-light max-w-4xl mx-auto text-balance drop-shadow-md cursor-pointer select-none"
              style={{
                fontSize: deviceType === 'mobile' ? adaptiveSettings.mobile.headerDescriptionFontSize : 
                         deviceType === 'tablet' ? adaptiveSettings.tablet.headerDescriptionFontSize : 
                         adaptiveSettings.desktop.headerDescriptionFontSize,
                fontFamily: headerTextSettings.headerDescriptionFontFamily,
                fontWeight: headerTextSettings.headerDescriptionFontWeight,
                fontStyle: headerTextSettings.headerDescriptionFontStyle,
                lineHeight: deviceType === 'mobile' ? adaptiveSettings.mobile.headerDescriptionLineHeight : 
                           deviceType === 'tablet' ? adaptiveSettings.tablet.headerDescriptionLineHeight : 
                           adaptiveSettings.desktop.headerDescriptionLineHeight,
                letterSpacing: deviceType === 'mobile' ? adaptiveSettings.mobile.headerDescriptionLetterSpacing : 
                              deviceType === 'tablet' ? adaptiveSettings.tablet.headerDescriptionLetterSpacing : 
                              adaptiveSettings.desktop.headerDescriptionLetterSpacing,
                marginTop: 16,
                color: 'rgba(255, 255, 255, 0.8)',
                textShadow: `0 1px 2px rgba(0,0,0,${headerTextSettings.headerDescriptionShadowIntensity})`
              }}
              onMouseEnter={playHoverSound}
              onClick={() => trackClick('#main-description', `Main Description Click: ${headerDescription}`)}
              whileHover={{ 
                scale: 1.015,
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.985 }}
            >
              {headerDescription}
            </motion.p>
          </motion.div>
          
          {/* 3D Carousel */}
          <motion.div 
            className="w-full h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          >
            <div className="w-full max-w-7xl h-full">
              <Carousel3D 
                items={carouselItems} 
                onSelectItem={handleItemSelect}
                carouselStyle={carouselSettings.carouselStyle}
                animationSpeed={carouselSettings.animationSpeed}
                showParticles={carouselSettings.showParticles}
                particleColor={carouselSettings.particleColor}
                brandColor={carouselSettings.brandColor}
                accentColor={carouselSettings.accentColor}
                onHoverSound={playCarouselHoverSound}
                onClickSound={playCarouselClickSound}
                onTransitionSound={playCarouselTransitionSound}
                onActiveIndexChange={handleCarouselIndexChange}
              />
            </div>
          </motion.div>
          
          {/* Крапочки пагінації каруселі - безпосередньо під каруселлю */}
          {carouselItems.length > 1 && (
            <motion.div 
              className="flex items-center justify-center space-x-2 -mt-8 mb-4 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
            >
              {carouselItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handlePaginationClick(index)}
                  onMouseEnter={playHoverSound}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 rounded-full smooth-transition ${
                    index === carouselActiveIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  style={{
                    boxShadow: index === carouselActiveIndex 
                      ? '0 2px 8px rgba(0,0,0,0.4)' 
                      : '0 1px 4px rgba(0,0,0,0.3)'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          )}

        </div>

        {/* Кнопка адміністратора */}
        {shouldShowAdminButton() && (
          <motion.button
            onClick={(e) => {
              handleAdminButtonClick();
              playClickSound();
              trackClick('#admin-panel-button', 'Admin Panel Access');
            }}
            onMouseEnter={playHoverSound}
            className="fixed bottom-24 sm:bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-colors"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.button>
        )}

        {/* Модальні вікна адміністратора */}
        <SimpleAdminLogin
          isVisible={showAdminLogin}
          onClose={handleCloseAdminLogin}
          onLogin={handleAdminLogin}
        />

        <AdminPanel
          isOpen={showAdminPanel}
          onClose={handleCloseAdminPanel}
          onLogout={handleAdminLogout}
        />

        {/* МОБІЛЬНИЙ ФІКС: Невидиме muted відео для активації контексту */}
        <video
          ref={hiddenVideoRef}
          autoPlay
          muted
          loop
          playsInline
          className="hidden"
          style={{ 
            display: 'none', 
            width: '1px', 
            height: '1px',
            position: 'fixed',
            top: '-1000px',
            left: '-1000px',
            zIndex: -999,
            visibility: 'hidden',
            opacity: 0
          }}
          src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWRhdGEAAAABAAEAAAEAA"
          onCanPlay={() => console.log('🎬 Невидиме відео: готове до програвання')}
          onPlay={() => console.log('✅ Невидиме відео: грає - активую аудіо контекст')}
        />
      </motion.div>
    </div>
  );
};

export default MainScreen; 