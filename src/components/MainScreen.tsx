import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselItem } from '../types/types';
import Carousel3D from './Carousel3D';
import SoundToggle from "./SoundToggle";
import { playSound, preloadSound } from '../utils/audioUtils';
import { useGlobalAudio } from '../pages/Index';
import { useSimpleAdminSession } from '../hooks/useSimpleAdminSession';
import SimpleAdminLogin from './SimpleAdminLogin';
import AdminPanel from './AdminPanel';
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import domainSyncService from '../services/DomainSyncService';
import SplineAnimation from './SplineAnimation';
import { useAnalytics } from '../hooks/useAnalytics';

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

const MainScreen = () => {
  // Стани компонента
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [activeItem, setActiveItem] = useState<CarouselItem | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isConstructorUpdate, setIsConstructorUpdate] = useState(false);
  
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
      autoPlay: true
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

  // Додаємо флаг для відстеження завантаження
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Hooks
  const deviceType = useDeviceType();
  const { isPlaying, toggle, isLoaded } = useGlobalAudio();
  const { 
    isAdmin, 
    login, 
    logout, 
    shouldShowAdminButton,
    checkAdminUrlParameter
  } = useSimpleAdminSession();
  
  // Аналітика
  const { trackClick, cleanupRemovedCarouselItems } = useAnalytics();
  
  // Локальне стан для фонової музики
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(true);
  
  // Refs для аудіо
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);
  const musicInitializedRef = useRef<boolean>(false);
  const lastMusicUrlRef = useRef<string>('');
  const audioInitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Функція для перемикання фонової музики
  const toggleBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      if (isBackgroundMusicPlaying) {
        backgroundMusicRef.current.pause();
        setIsBackgroundMusicPlaying(false);
      } else {
        backgroundMusicRef.current.play().catch((error) => {
          console.log('Не вдалося відтворити музику:', error);
        });
        setIsBackgroundMusicPlaying(true);
      }
    }
  }, [isBackgroundMusicPlaying]);

  // Ефект для ініціалізації фонової музики
  useEffect(() => {
    if (audioSettings.backgroundMusic.enabled && audioSettings.backgroundMusic.url && backgroundMusicRef.current) {
      const audio = backgroundMusicRef.current;
      
      // Якщо URL змінився, оновлюємо джерело
      if (lastMusicUrlRef.current !== audioSettings.backgroundMusic.url) {
        audio.src = audioSettings.backgroundMusic.url;
        lastMusicUrlRef.current = audioSettings.backgroundMusic.url;
        
        // Налаштовуємо аудіо
        audio.volume = audioSettings.backgroundMusic.volume;
        audio.loop = audioSettings.backgroundMusic.loop;
        
        // Автоматичне відтворення
        if (audioSettings.backgroundMusic.autoPlay && !musicInitializedRef.current) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('✅ MainScreen: Фонова музика запущена автоматично');
              setIsBackgroundMusicPlaying(true);
              musicInitializedRef.current = true;
            }).catch((error) => {
              console.log('⚠️ MainScreen: Автоматичне відтворення заблоковано браузером:', error);
              setIsBackgroundMusicPlaying(false);
            });
          }
        }
      } else {
        // Якщо URL той самий, просто оновлюємо налаштування
        audio.volume = audioSettings.backgroundMusic.volume;
        audio.loop = audioSettings.backgroundMusic.loop;
      }
    }
  }, [audioSettings.backgroundMusic]);

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
          setBackgroundSettings(prev => ({
            ...prev,
            backgroundType: (settings.backgroundType as 'color' | 'gradient' | 'image' | 'video') || prev.backgroundType,
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
  const handleItemSelect = useCallback((item: CarouselItem) => {
    setActiveItem(item);
  }, []);

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
      
      // Скидаємо прапорець через невеликий час
      setTimeout(() => {
        setIsConstructorUpdate(false);
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

  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={getBackgroundStyle()}
    >
      {/* Фонове відео якщо вибрано */}
      {backgroundSettings.backgroundType === 'video' && backgroundSettings.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundSettings.backgroundVideo} type="video/mp4" />
        </video>
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
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-full z-10"
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
        
        {/* Компактний хедер по центру */}
        <motion.header 
          className="absolute top-4 sm:top-6 lg:top-8 xl:top-10 inset-x-0 flex justify-center px-4 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
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
            <SoundToggle 
              isOn={isBackgroundMusicPlaying} 
              onToggle={() => {
                toggleBackgroundMusic();
                trackClick('#sound-toggle', `Sound Toggle: ${!isBackgroundMusicPlaying ? 'On' : 'Off'}`);
              }} 
              isLoaded={true}
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
            />
          </div>
        </motion.header>
        
        {/* Центрований контейнер для всього контенту */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4 lg:px-8 xl:px-12">
          {/* Заголовок */}
          <motion.div 
            className="text-center max-w-5xl w-full mb-8 lg:mb-12 xl:mb-16"
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
              />
            </div>
          </motion.div>
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
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-colors"
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

        {/* Фонова музика */}
        {audioSettings.backgroundMusic.enabled && audioSettings.backgroundMusic.url && (
          <audio 
            ref={backgroundMusicRef}
            loop={audioSettings.backgroundMusic.loop} 
            className="hidden"
          >
            <source src={audioSettings.backgroundMusic.url} type="audio/mpeg" />
            <source src={audioSettings.backgroundMusic.url} type="audio/wav" />
            <source src={audioSettings.backgroundMusic.url} type="audio/ogg" />
          </audio>
        )}
      </motion.div>
    </div>
  );
};

export default MainScreen; 