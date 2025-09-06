import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselItem } from '../types/types';
import MediaSelector from './MediaSelector';
import VideoDebugger from './VideoDebugger';
import { FileItem } from '../types/contentManager';
import indexedDBService from '../services/IndexedDBService';
import syncService from '../services/SyncService';
import SyncButton from './SyncButton';
import SplineAnimation from './SplineAnimation';
import SimpleConstructorToggle from './SimpleConstructorToggle';

interface MainPageSettings {
  headerTitle: string;
  headerSubtitle: string;
  headerDescription: string;
  // Нові поля для розширеного редагування тексту
  headerTitleFontSize: number;
  headerSubtitleFontSize: number;
  headerDescriptionFontSize: number;
  headerTitleFontFamily: string;
  headerSubtitleFontFamily: string;
  headerDescriptionFontFamily: string;
  headerTitleFontWeight: number;
  headerSubtitleFontWeight: number;
  headerDescriptionFontWeight: number;
  headerTitleFontStyle: string;
  headerSubtitleFontStyle: string;
  headerDescriptionFontStyle: string;
  headerTitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  headerSubtitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  headerDescriptionAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  headerTitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  headerSubtitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  headerDescriptionExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  headerTitle3DDepth: number;
  headerSubtitle3DDepth: number;
  headerDescription3DDepth: number;
  headerTitleShadowIntensity: number;
  headerSubtitleShadowIntensity: number;
  headerDescriptionShadowIntensity: number;
  headerTitleShadowColor: string;
  headerSubtitleShadowColor: string;
  headerDescriptionShadowColor: string;
  headerAnimationDuration: number;
  headerAnimationDelay: number;
  
  // Адаптивні налаштування для мобільних пристроїв
  mobile: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
  
  // Адаптивні налаштування для планшетів
  tablet: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
  
  // Адаптивні налаштування для десктопу
  desktop: {
    headerTitleFontSize: number;
    headerSubtitleFontSize: number;
    headerDescriptionFontSize: number;
    headerTitleMarginBottom: number;
    headerSubtitleMarginBottom: number;
    headerDescriptionMarginBottom: number;
    headerTitleLineHeight: number;
    headerSubtitleLineHeight: number;
    headerDescriptionLineHeight: number;
    headerTitleLetterSpacing: number;
    headerSubtitleLetterSpacing: number;
    headerDescriptionLetterSpacing: number;
    headerContainerPadding: number;
    headerContainerMarginTop: number;
    headerContainerMarginBottom: number;
  };
  
  brandColor: string;
  accentColor: string;
  textColor: string;
  logoUrl: string;
  logoSize?: number;
  backgroundType: 'color' | 'gradient' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  hasMusic: boolean;
  musicUrl: string;
  // Розширені звукові налаштування
  audioSettings: {
    backgroundMusic: {
      enabled: boolean;
      url: string;
      volume: number;
      loop: boolean;
      autoPlay: boolean;
      fileName?: string; // Додаємо ім'я файлу для ідентифікації
      autoStartAfterWelcome?: boolean; // НОВЕ: Автозапуск після Welcome
    };
    hoverSounds: {
      enabled: boolean;
      url: string;
      volume: number;
      fileName?: string;
    };
    clickSounds: {
      enabled: boolean;
      url: string;
      volume: number;
      fileName?: string;
    };
    carouselSounds: {
      enabled: boolean;
      transitionUrl: string;
      hoverUrl: string;
      clickUrl: string;
      volume: number;
      transitionFileName?: string;
      hoverFileName?: string;
      clickFileName?: string;
    };
    uiSounds: {
      enabled: boolean;
      buttonHoverUrl: string;
      buttonClickUrl: string;
      notificationUrl: string;
      volume: number;
      buttonHoverFileName?: string;
      buttonClickFileName?: string;
      notificationFileName?: string;
    };
  };
  carouselItems: CarouselItem[];
  carouselStyle: 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic';
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
  
  // 3D Анімації (Spline)
  splineSettings: {
    enabled: boolean;
    sceneUrl: string;
    embedCode: string;
    localFile: string; // Локальний файл .spline
    position: 'background' | 'foreground' | 'overlay';
    opacity: number;
    scale: number;
    autoplay: boolean;
    controls: boolean;
    method: 'iframe' | 'component' | 'local';
  };
}

const defaultCarouselItems: CarouselItem[] = [
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
  }
];

const defaultSettings: MainPageSettings = {
  headerTitle: "Усе що треба",
  headerSubtitle: "для твого SMM",
  headerDescription: "Професійні інструменти в одному місці",
  // Налаштування шрифтів та розмірів
  headerTitleFontSize: 48,
  headerSubtitleFontSize: 36,
  headerDescriptionFontSize: 20,
  headerTitleFontFamily: 'Inter',
  headerSubtitleFontFamily: 'Inter',
  headerDescriptionFontFamily: 'Inter',
  // Нові налаштування стилю шрифтів
  headerTitleFontWeight: 700,
  headerSubtitleFontWeight: 600,
  headerDescriptionFontWeight: 400,
  headerTitleFontStyle: 'normal',
  headerSubtitleFontStyle: 'normal',
  headerDescriptionFontStyle: 'normal',
  // Анімації появи
  headerTitleAnimation: 'fadeIn',
  headerSubtitleAnimation: 'slideUp',
  headerDescriptionAnimation: 'fadeIn',
  // Анімації зникання
  headerTitleExitAnimation: 'fadeOut',
  headerSubtitleExitAnimation: 'slideDown',
  headerDescriptionExitAnimation: 'fadeOut',
  // 3D ефекти та глибина
  headerTitle3DDepth: 0,
  headerSubtitle3DDepth: 0,
  headerDescription3DDepth: 0,
  // Інтенсивність тіней
  headerTitleShadowIntensity: 0.3,
  headerSubtitleShadowIntensity: 0.2,
  headerDescriptionShadowIntensity: 0.1,
  // Кольори тіней
  headerTitleShadowColor: '#000000',
  headerSubtitleShadowColor: '#000000',
  headerDescriptionShadowColor: '#000000',
  // Тайминги анімацій
  headerAnimationDuration: 800,
  headerAnimationDelay: 200,
  brandColor: "#4a4b57",
  accentColor: "#3b82f6",
  textColor: "#ffffff",
  logoUrl: "",
  logoSize: 96,
  backgroundType: 'gradient',
  backgroundColor: "#1a1a1a",
  gradientFrom: "#f9fafb",
  gradientTo: "#f7f8fa",
  backgroundImage: "",
  backgroundVideo: "",
  hasMusic: false,
  musicUrl: "",
  // Розширені звукові налаштування
  audioSettings: {
    backgroundMusic: {
      enabled: false,
      url: "",
      volume: 0.5,
      loop: true,
      autoPlay: false,
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
  },
  carouselItems: defaultCarouselItems,
  carouselStyle: 'premium',
  showParticles: false,
  particleColor: "#ffffff",
  animationSpeed: 'normal',
  
  // 3D Анімації (Spline)
  splineSettings: {
    enabled: false,
    sceneUrl: "",
    embedCode: "",
    localFile: "",
    position: 'background',
    opacity: 1,
    scale: 1,
    autoplay: true,
    controls: false,
    method: 'component'
  },
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
};

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type TabId = 'header' | 'carousel' | 'design' | 'background' | 'audio' | '3d';

const MainPageCustomizer: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<MainPageSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<TabId>('header');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [editingItem, setEditingItem] = useState<CarouselItem | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  
  // Додаємо стан для інтерактивного попереднього перегляду каруселі
  const [previewActiveIndex, setPreviewActiveIndex] = useState(0);
  const [previewExpandedCard, setPreviewExpandedCard] = useState<number | null>(null);
  
  // Додаємо стан для активного елемента типографіки
  const [activeTypographyElement, setActiveTypographyElement] = useState<'title' | 'subtitle' | 'description'>('title');
  
  // Стани для MediaSelector
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSelectorType, setMediaSelectorType] = useState<'backgroundImage' | 'backgroundVideo' | 'logo' | 'itemImage' | 'backgroundMusic' | 'hoverSound' | 'clickSound' | 'carouselTransition' | 'carouselHover' | 'carouselClick' | 'buttonHover' | 'buttonClick' | 'notification'>('backgroundImage');
  


  const musicInputRef = useRef<HTMLInputElement>(null);

  
  // Завантаження існуючих налаштувань при ініціалізації
  useEffect(() => {
    const loadSettings = async () => {
      try {
        console.log('🔄 MainPageCustomizer: Завантаження налаштувань через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB через новий сервіс
        const indexedDBSettings = await indexedDBService.loadSettings('mainPageSettings');
        
        let loadedSettings = indexedDBSettings;
        
        // Якщо IndexedDB порожній, пробуємо localStorage як резерв
        if (!loadedSettings) {
          console.log('ℹ️ MainPageCustomizer: Налаштування не знайдено в IndexedDB, перевіряємо localStorage...');
          try {
            const savedSettings = localStorage.getItem('mainPageSettings');
            if (savedSettings) {
              loadedSettings = JSON.parse(savedSettings);
              console.log('✅ MainPageCustomizer: Налаштування завантажено з localStorage');
              
              // Мігруємо в IndexedDB
              console.log('🔄 MainPageCustomizer: Міграція налаштувань в IndexedDB...');
              await indexedDBService.saveSettings('mainPageSettings', loadedSettings, 'project');
              console.log('✅ MainPageCustomizer: Міграція завершена');
            }
          } catch (localStorageError) {
            console.log('⚠️ MainPageCustomizer: Помилка читання localStorage:', localStorageError);
          }
        }
        
        if (loadedSettings) {
          // Гарантуємо, що carouselItems завжди є масивом та адаптивні налаштування існують
          const safeSettings = {
            ...defaultSettings,
            ...loadedSettings,
            carouselItems: Array.isArray(loadedSettings.carouselItems) ? loadedSettings.carouselItems : defaultSettings.carouselItems,
            // Забезпечуємо наявність адаптивних налаштувань
            mobile: {
              ...defaultSettings.mobile,
              ...(loadedSettings.mobile || {})
            },
            tablet: {
              ...defaultSettings.tablet,
              ...(loadedSettings.tablet || {})
            },
            desktop: {
              ...defaultSettings.desktop,
              ...(loadedSettings.desktop || {})
            },
            // Забезпечуємо наявність аудіо налаштувань
            audioSettings: {
              ...defaultSettings.audioSettings,
              ...(loadedSettings.audioSettings || {}),
              backgroundMusic: {
                ...defaultSettings.audioSettings.backgroundMusic,
                ...(loadedSettings.audioSettings?.backgroundMusic || {})
              },
              hoverSounds: {
                ...defaultSettings.audioSettings.hoverSounds,
                ...(loadedSettings.audioSettings?.hoverSounds || {})
              },
              clickSounds: {
                ...defaultSettings.audioSettings.clickSounds,
                ...(loadedSettings.audioSettings?.clickSounds || {})
              },
              carouselSounds: {
                ...defaultSettings.audioSettings.carouselSounds,
                ...(loadedSettings.audioSettings?.carouselSounds || {})
              },
              uiSounds: {
                ...defaultSettings.audioSettings.uiSounds,
                ...(loadedSettings.audioSettings?.uiSounds || {})
              }
            },
            // Забезпечуємо наявність 3D налаштувань
            splineSettings: {
              ...defaultSettings.splineSettings,
              ...(loadedSettings.splineSettings || {})
            }
          };
          setSettings(safeSettings);
          console.log('✅ MainPageCustomizer: Налаштування успішно завантажено та застосовано');
        } else {
          // У випадку відсутності збережених налаштувань використовуємо дефолтні
          console.log('ℹ️ MainPageCustomizer: Використовуємо дефолтні налаштування');
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error('❌ MainPageCustomizer: Помилка завантаження налаштувань:', error);
        // У випадку помилки використовуємо дефолтні налаштування
        setSettings(defaultSettings);
      }
    };

    loadSettings();
  }, []);

  // Відстеження змін у налаштуваннях заголовка для попереднього перегляду
  useEffect(() => {
    // Відстеження змін у налаштуваннях заголовка для попереднього перегляду
  }, [
    settings.headerTitle, settings.headerSubtitle, settings.headerDescription,
    settings.headerTitleFontSize, settings.headerSubtitleFontSize, settings.headerDescriptionFontSize,
    settings.headerTitleFontFamily, settings.headerSubtitleFontFamily, settings.headerDescriptionFontFamily,
    settings.headerTitleAnimation, settings.headerSubtitleAnimation, settings.headerDescriptionAnimation,
    settings.headerTitleExitAnimation, settings.headerSubtitleExitAnimation, settings.headerDescriptionExitAnimation,
    settings.headerTitle3DDepth, settings.headerSubtitle3DDepth, settings.headerDescription3DDepth,
    settings.headerTitleShadowIntensity, settings.headerSubtitleShadowIntensity, settings.headerDescriptionShadowIntensity,
    settings.headerTitleShadowColor, settings.headerSubtitleShadowColor, settings.headerDescriptionShadowColor,
    settings.headerAnimationDuration, settings.headerAnimationDelay
  ]);

  // Скидаємо активний індекс попереднього перегляду при зміні елементів каруселі
  useEffect(() => {
    // Додаємо перевірку на існування carouselItems та його довжину
    const carouselLength = settings.carouselItems?.length || 0;
    if (previewActiveIndex >= carouselLength && carouselLength > 0) {
      setPreviewActiveIndex(0);
      setPreviewExpandedCard(null);
    }
  }, [settings.carouselItems?.length, previewActiveIndex]);

  // Клавіатурна навігація для попереднього перегляду
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Перевіряємо чи фокус не на input/textarea
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevPreview();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextPreview();
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (previewExpandedCard === previewActiveIndex) {
            setPreviewExpandedCard(null);
          } else {
            setPreviewExpandedCard(previewActiveIndex);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setPreviewExpandedCard(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Увімкнути автоматичну синхронізацію для адмін режиму
    syncService.enableAutoSync();
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewActiveIndex, previewExpandedCard]);

  const updateSettings = useCallback((updates: Partial<MainPageSettings>) => {
    setSyncStatus('syncing');
    
    // Створюємо нові налаштування
    const newSettings = { ...settings, ...updates };
    
    // Миттєво оновлюємо локальний стан
    setSettings(newSettings);
    
    // АВТОМАТИЧНЕ ЗБЕРЕЖЕННЯ при кожній зміні
    try {
      // Зберігаємо через IndexedDBService
      indexedDBService.saveSettings('mainPageSettings', newSettings, 'project').catch(error => {
        console.error('❌ MainPageCustomizer: Помилка збереження в IndexedDB:', error);
        // Резервне збереження в localStorage (мінімальна версія)
        try {
          const minimalSettings = {
            headerTitle: newSettings.headerTitle,
            headerSubtitle: newSettings.headerSubtitle,
            headerDescription: newSettings.headerDescription,
            brandColor: newSettings.brandColor,
            accentColor: newSettings.accentColor,
            textColor: newSettings.textColor,
            carouselItems: newSettings.carouselItems?.map(item => ({
              ...item,
              imageUrl: item.imageUrl?.length > 100000 ? '' : item.imageUrl
            })) || [],
            // Зберігаємо тільки назви аудіо файлів, не URL
            audioSettings: {
              backgroundMusic: {
                ...newSettings.audioSettings.backgroundMusic,
                url: '',
                fileName: newSettings.audioSettings.backgroundMusic.fileName
              },
              hoverSounds: {
                ...newSettings.audioSettings.hoverSounds,
                url: '',
                fileName: newSettings.audioSettings.hoverSounds.fileName
              },
              clickSounds: {
                ...newSettings.audioSettings.clickSounds,
                url: '',
                fileName: newSettings.audioSettings.clickSounds.fileName
              },
              carouselSounds: {
                ...newSettings.audioSettings.carouselSounds,
                transitionUrl: '',
                hoverUrl: '',
                clickUrl: '',
                transitionFileName: newSettings.audioSettings.carouselSounds.transitionFileName,
                hoverFileName: newSettings.audioSettings.carouselSounds.hoverFileName,
                clickFileName: newSettings.audioSettings.carouselSounds.clickFileName
              },
              uiSounds: {
                ...newSettings.audioSettings.uiSounds,
                buttonHoverUrl: '',
                buttonClickUrl: '',
                notificationUrl: '',
                buttonHoverFileName: newSettings.audioSettings.uiSounds.buttonHoverFileName,
                buttonClickFileName: newSettings.audioSettings.uiSounds.buttonClickFileName,
                notificationFileName: newSettings.audioSettings.uiSounds.notificationFileName
              }
            }
          };
          localStorage.setItem('mainPageSettings', JSON.stringify(minimalSettings));
        } catch (localStorageError) {
          console.log('ℹ️ MainPageCustomizer: localStorage недоступний');
        }
      });
      
          // Додаткове логування для відео оновлень
    if (updates.backgroundVideo !== undefined) {
      console.log('🎬 MainPageCustomizer: Оновлення відео URL:', {
        oldUrl: settings.backgroundVideo ? (settings.backgroundVideo.substring(0, 50) + '...') : 'немає',
        newUrl: updates.backgroundVideo ? (updates.backgroundVideo.substring(0, 50) + '...') : 'немає',
        isVideo: updates.backgroundVideo ? updates.backgroundVideo.includes('data:video/') : false,
        isImage: updates.backgroundVideo ? updates.backgroundVideo.includes('data:image/') : false,
        size: updates.backgroundVideo ? (updates.backgroundVideo.length / 1024 / 1024).toFixed(2) + ' MB' : '0 MB'
      });
    }
    
    // Відправляємо подію для миттєвого оновлення превью
    const syncEvent = new CustomEvent('mainPageSettingsUpdated', { detail: newSettings });
    window.dispatchEvent(syncEvent);
      
      // Показуємо статус синхронізації
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 800);
      
    } catch (error) {
      setSyncStatus('idle');
    }
  }, [settings]);

  const handleFileUpload = useCallback(async (file: File, type: 'logo' | 'backgroundImage' | 'backgroundVideo' | 'music' | 'itemImage') => {
    // Конвертуємо файл в Base64
    const base64Url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    
    switch (type) {
      case 'logo':
        updateSettings({ logoUrl: base64Url });
        break;
      case 'backgroundImage':
        updateSettings({ backgroundImage: base64Url, backgroundType: 'image' });
        break;
      case 'backgroundVideo':
        console.log('🎬 Завантаження відео файлу:', {
          fileName: file.name,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          fileType: file.type,
          base64Length: base64Url.length
        });
        updateSettings({ backgroundVideo: base64Url, backgroundType: 'video' });
        break;
      case 'music':
        updateSettings({ musicUrl: base64Url, hasMusic: true });
        break;
      case 'itemImage':
        if (editingItem) {
          const currentItems = Array.isArray(settings.carouselItems) ? settings.carouselItems : [];
          const updatedItems = currentItems.map(item =>
            item.id === editingItem.id ? { ...item, imageUrl: base64Url } : item
          );
          updateSettings({ carouselItems: updatedItems });
          setEditingItem({ ...editingItem, imageUrl: base64Url });
        }
        break;
    }
  }, [updateSettings, settings.carouselItems, editingItem]);

  // Функції для роботи з MediaSelector (Smart Content Manager)
  const openMediaSelector = (type: typeof mediaSelectorType, allowedTypes?: ('image' | 'audio' | 'video')[]) => {
    setMediaSelectorType(type);
    setIsMediaSelectorOpen(true);
  };

  // Функція для видалення аудіо файлу з поточного блоку (не видаляє файл зі збереження)
  const removeAudioFile = async (audioType: string, fileName?: string) => {
    try {
      console.log(`🗑️ Видалення аудіо з блоку: ${audioType}, fileName: ${fileName}`);

      // Оновлюємо налаштування згідно з типом аудіо (тільки очищаємо URL)
      let updatedAudioSettings = { ...settings.audioSettings };

      switch (audioType) {
        case 'backgroundMusic':
          updatedAudioSettings.backgroundMusic = {
            ...updatedAudioSettings.backgroundMusic,
            url: '',
            enabled: false,
            fileName: undefined
          };
          break;
        case 'hoverSound':
          updatedAudioSettings.hoverSounds = {
            ...updatedAudioSettings.hoverSounds,
            url: '',
            enabled: false,
            fileName: undefined
          };
          break;
        case 'clickSound':
          updatedAudioSettings.clickSounds = {
            ...updatedAudioSettings.clickSounds,
            url: '',
            enabled: false,
            fileName: undefined
          };
          break;
        case 'carouselTransition':
          updatedAudioSettings.carouselSounds = {
            ...updatedAudioSettings.carouselSounds,
            transitionUrl: '',
            transitionFileName: undefined
          };
          break;
        case 'carouselHover':
          updatedAudioSettings.carouselSounds = {
            ...updatedAudioSettings.carouselSounds,
            hoverUrl: '',
            hoverFileName: undefined
          };
          break;
        case 'carouselClick':
          updatedAudioSettings.carouselSounds = {
            ...updatedAudioSettings.carouselSounds,
            clickUrl: '',
            clickFileName: undefined
          };
          break;
        case 'buttonHover':
          updatedAudioSettings.uiSounds = {
            ...updatedAudioSettings.uiSounds,
            buttonHoverUrl: '',
            buttonHoverFileName: undefined
          };
          break;
        case 'buttonClick':
          updatedAudioSettings.uiSounds = {
            ...updatedAudioSettings.uiSounds,
            buttonClickUrl: '',
            buttonClickFileName: undefined
          };
          break;
        case 'notification':
          updatedAudioSettings.uiSounds = {
            ...updatedAudioSettings.uiSounds,
            notificationUrl: '',
            notificationFileName: undefined
          };
          break;
      }

      // Оновлюємо стан (тільки очищаємо URL, файл залишається в збереженні)
      updateSettings({ audioSettings: updatedAudioSettings });

      console.log(`✅ Аудіо файл видалено з блоку ${audioType}, але залишається в медіа-бібліотеці`);
    } catch (error) {
      console.error('❌ Помилка видалення аудіо файлу з блоку:', error);
    }
  };

  const handleMediaSelect = async (file: FileItem) => {
    // Отримуємо правильний URL для файлу (PocketBase або звичайний)
    const fileUrl = file.isPocketBaseFile ? file.pocketbaseData?.publicUrl : file.url;
    
    switch (mediaSelectorType) {
      case 'backgroundImage':
        updateSettings({ backgroundImage: fileUrl, backgroundType: 'image' });
        break;
      case 'backgroundVideo':
        // Валідація типу файлу для відео
        console.log('🎬 Конструктор: Перевірка відео файлу:', {
          fileName: file.name,
          originalName: file.originalName,
          type: file.type,
          urlType: file.url.substring(0, 50) + '...',
          hasFullVideoUrl: !!file.fullVideoUrl
        });
        
        // Перевіряємо тип файлу на основі збереженого типу та розширення
        const isVideoExtension = file.originalName && /\.(mp4|mov|avi|webm|mkv|wmv|flv|m4v)$/i.test(file.originalName);
        const isVideoType = file.type === 'video';
        
        // Якщо файл збережено як відео або має відео розширення - це відео
        if (!isVideoType && !isVideoExtension) {
          console.error('❌ Конструктор: Спроба зберегти не-відео файл як відео:', {
            fileName: file.name,
            originalName: file.originalName,
            type: file.type,
            isVideoExtension,
            isVideoType
          });
          alert('Помилка: Ви вибрали не відео файл.\n\nБудь ласка, виберіть відео файл (MP4, MOV, WebM, AVI).');
          setIsMediaSelectorOpen(false);
          setMediaSelectorType(null);
          return;
        }
        
        // Для відео файлів завантажуємо повний файл
        if (file.type === 'video') {
          // Для PocketBase файлів використовуємо публічний URL
          if (file.isPocketBaseFile) {
            console.log('✅ Конструктор: Використовуємо PocketBase відео файл');
            updateSettings({ backgroundVideo: fileUrl, backgroundType: 'video' });
          } else {
            // Перевіряємо чи файл вже містить повне відео
            const isFullVideo = file.url && file.url.startsWith('data:video/') && file.url.length > 100000;
            
            if (isFullVideo) {
              console.log('✅ Конструктор: Основний URL вже містить повне відео');
              updateSettings({ backgroundVideo: file.url, backgroundType: 'video' });
            } else if (file.fullVideoUrl) {
              console.log('✅ Конструктор: Використовуємо повний відео файл з fullVideoUrl');
              updateSettings({ backgroundVideo: file.fullVideoUrl, backgroundType: 'video' });
            } else {
              console.log('🔄 Конструктор: Потрібно завантажити повний файл з IndexedDB...');
              
              // Завантажуємо повний файл з IndexedDB
              const loadFullVideoFromIndexedDB = async (fileId: string): Promise<string | null> => {
                return new Promise((resolve) => {
                  try {
                    const request = indexedDB.open('ContentManagerDB', 2);
                    
                    request.onsuccess = (event) => {
                      const db = (event.target as IDBOpenDBRequest).result;
                      
                      if (!db.objectStoreNames.contains('files')) {
                        console.warn('⚠️ Конструктор: Об\'єкт-сховище "files" не існує');
                        db.close();
                        resolve(null);
                        return;
                      }
                      
                      const transaction = db.transaction(['files'], 'readonly');
                      const store = transaction.objectStore('files');
                      const getRequest = store.get(fileId);
                      
                      getRequest.onsuccess = () => {
                        const fullFile = getRequest.result;
                        if (fullFile && fullFile.url && 
                            fullFile.url.startsWith('data:video/') && 
                            fullFile.url.length > (file.url?.length || 0)) {
                          console.log(`✅ Конструктор: Повний відео файл завантажено з IndexedDB: ${fullFile.name}`);
                          console.log(`📊 Розмір превью: ${((file.url?.length || 0) / 1024).toFixed(2)} KB`);
                          console.log(`📊 Розмір повного файлу: ${(fullFile.url.length / 1024 / 1024).toFixed(2)} MB`);
                          db.close();
                          resolve(fullFile.url);
                        } else {
                          console.warn('⚠️ Конструктор: Повний відео файл не знайдено або не валідний в IndexedDB', {
                            hasFile: !!fullFile,
                            hasUrl: !!fullFile?.url,
                            isVideoMime: fullFile?.url?.startsWith('data:video/') || false,
                            urlLength: fullFile?.url?.length || 0
                          });
                          db.close();
                          resolve(null);
                        }
                      };
                      
                      getRequest.onerror = () => {
                        console.error('❌ Конструктор: Помилка завантаження з IndexedDB');
                        db.close();
                        resolve(null);
                      };
                    };
                    
                    request.onerror = () => {
                      console.error('❌ Конструктор: Помилка відкриття IndexedDB');
                      resolve(null);
                    };
                  } catch (error) {
                    console.error('❌ Конструктор: Помилка завантаження повного відео:', error);
                    resolve(null);
                  }
                });
              };
              
              try {
                const fullVideoUrl = await loadFullVideoFromIndexedDB(file.id);
                if (fullVideoUrl) {
                  console.log('✅ Конструктор: Використовуємо повний відео файл з IndexedDB');
                  updateSettings({ backgroundVideo: fullVideoUrl, backgroundType: 'video' });
                } else {
                  console.warn('⚠️ Конструктор: Не вдалося завантажити повний відео файл, використовуємо превью');
                  alert('⚠️ Увага: Не вдалося завантажити повний відео файл.\nВикористовується превью, яке може не відтворюватися як відео.');
                  updateSettings({ backgroundVideo: file.url, backgroundType: 'video' });
                }
              } catch (error) {
                console.error('❌ Конструктор: Помилка завантаження повного відео файлу:', error);
                updateSettings({ backgroundVideo: file.url, backgroundType: 'video' });
              }
            }
          }
        } else {
          console.warn('⚠️ Конструктор: Використовуємо превью URL, можливі проблеми з відтворенням');
          updateSettings({ backgroundVideo: file.url, backgroundType: 'video' });
        }
        break;
      case 'logo':
        updateSettings({ logoUrl: fileUrl });
        break;
      case 'itemImage':
        if (editingItem) {
          const currentItems = Array.isArray(settings.carouselItems) ? settings.carouselItems : [];
          const updatedItems = currentItems.map(item =>
            item.id === editingItem.id ? { ...item, imageUrl: fileUrl } : item
          );
          updateSettings({ carouselItems: updatedItems });
          setEditingItem({ ...editingItem, imageUrl: fileUrl });
        }
        break;
      case 'backgroundMusic':
        console.log('🎵 Конструктор: Оновлюємо фонову музику через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - URL довжина:', fileUrl?.length || 0);
        console.log('  - PocketBase файл:', file.isPocketBaseFile);
        console.log('  - Дозволяємо використання того самого файлу в різних блоках');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            backgroundMusic: { 
              ...settings.audioSettings.backgroundMusic, 
              url: fileUrl, 
              enabled: true,
              fileName: file.name // Додаємо ім'я файлу для ідентифікації
            } 
          } 
        });
        console.log('✅ Конструктор: Фонова музика оновлена в стані');
        break;
      case 'hoverSound':
        console.log('🎵 Конструктор: Оновлюємо звуки наведення через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - PocketBase файл:', file.isPocketBaseFile);
        console.log('  - Дозволяємо повторне використання файлів');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            hoverSounds: { 
              ...settings.audioSettings.hoverSounds, 
              url: fileUrl, 
              enabled: true,
              fileName: file.name
            } 
          } 
        });
        break;
      case 'clickSound':
        console.log('🎵 Конструктор: Оновлюємо звуки кліків через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - Дозволяємо повторне використання файлів');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            clickSounds: { 
              ...settings.audioSettings.clickSounds, 
              url: fileUrl, 
              enabled: true,
              fileName: file.name
            } 
          } 
        });
        break;
      case 'carouselTransition':
        console.log('🎵 Конструктор: Оновлюємо звуки переходу каруселі через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - Дозволяємо повторне використання файлів');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            carouselSounds: { 
              ...settings.audioSettings.carouselSounds, 
              transitionUrl: fileUrl, 
              enabled: true,
              transitionFileName: file.name
            } 
          } 
        });
        break;
      case 'carouselHover':
        console.log('🎵 Конструктор: Оновлюємо звуки наведення каруселі через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - Дозволяємо повторне використання файлів');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            carouselSounds: { 
              ...settings.audioSettings.carouselSounds, 
              hoverUrl: fileUrl, 
              enabled: true,
              hoverFileName: file.name
            } 
          } 
        });
        break;
      case 'carouselClick':
        console.log('🎵 Конструктор: Оновлюємо звуки кліків каруселі через handleMediaSelect');
        console.log('  - Файл:', file.name);
        console.log('  - Дозволяємо повторне використання файлів');
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            carouselSounds: { 
              ...settings.audioSettings.carouselSounds, 
              clickUrl: fileUrl, 
              enabled: true,
              clickFileName: file.name
            } 
          } 
        });
        break;
      case 'buttonHover':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            uiSounds: { 
              ...settings.audioSettings.uiSounds, 
              buttonHoverUrl: fileUrl, 
              enabled: true,
              buttonHoverFileName: file.name
            } 
          } 
        });
        break;
      case 'buttonClick':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            uiSounds: { 
              ...settings.audioSettings.uiSounds, 
              buttonClickUrl: fileUrl, 
              enabled: true,
              buttonClickFileName: file.name
            } 
          } 
        });
        break;
      case 'notification':
        updateSettings({ 
          audioSettings: { 
            ...settings.audioSettings, 
            uiSounds: { 
              ...settings.audioSettings.uiSounds, 
              notificationUrl: fileUrl, 
              enabled: true,
              notificationFileName: file.name
            } 
          } 
        });
        break;
    }
    
    setIsMediaSelectorOpen(false);
    setMediaSelectorType(null);
  };

  const addCarouselItem = useCallback(() => {
    try {
      // Створюємо нову карточку з унікальним ID
      const newItem: CarouselItem = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: "Новий елемент",
        description: "Опис нового елемента",
        imageUrl: "/photo/photo-1.png",
        url: "#new"
      };
      
      // Отримуємо поточний стан карточок з перевіркою безпеки
      const currentItems = Array.isArray(settings.carouselItems) ? [...settings.carouselItems] : [];
      
      // Додаємо нову карточку
      const updatedItems = [...currentItems, newItem];
      
      // Створюємо повні налаштування для оновлення
      const updatedSettings = {
        ...settings,
        carouselItems: updatedItems
      };
      
      // Миттєво оновлюємо локальний стан
      setSettings(updatedSettings);
      
      // Зберігаємо в localStorage синхронно
      try {
        localStorage.setItem('mainPageSettings', JSON.stringify(updatedSettings));
        
        // Зберігаємо в старому форматі для сумісності
        const legacyData = {
          carouselItems: updatedItems,
          headerTitle: updatedSettings.headerTitle,
          headerSubtitle: updatedSettings.headerSubtitle,
          headerDescription: updatedSettings.headerDescription
        };
        localStorage.setItem('immersiveExperienceData', JSON.stringify(legacyData));
        
      } catch (storageError) {
        // Тихо ігноруємо помилки збереження
      }
      
      // Відправляємо подію синхронізації МИТТЄВО
      const syncEvent = new CustomEvent('mainPageSettingsUpdated', { 
        detail: updatedSettings 
      });
      window.dispatchEvent(syncEvent);
      
      // Показуємо статус синхронізації
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('synced');
        setTimeout(() => setSyncStatus('idle'), 800);
      }, 100);
      
    } catch (error) {
      setSyncStatus('idle');
    }
  }, [settings]);

  const updateCarouselItem = useCallback((updatedItem: CarouselItem) => {
    try {
      // Оновлюємо карточку в масиві з перевіркою безпеки
      const currentItems = Array.isArray(settings.carouselItems) ? settings.carouselItems : [];
      const updatedItems = currentItems.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );
      
      // Створюємо повні налаштування
      const updatedSettings = {
        ...settings,
        carouselItems: updatedItems
      };
      
      // Миттєво оновлюємо локальний стан
      setSettings(updatedSettings);
      setEditingItem(updatedItem);
      
      // Зберігаємо синхронно
      try {
        localStorage.setItem('mainPageSettings', JSON.stringify(updatedSettings));
        
        const legacyData = {
          carouselItems: updatedItems,
          headerTitle: updatedSettings.headerTitle,
          headerSubtitle: updatedSettings.headerSubtitle,
          headerDescription: updatedSettings.headerDescription
        };
        localStorage.setItem('immersiveExperienceData', JSON.stringify(legacyData));
        
      } catch (storageError) {
        // Тихо ігноруємо помилки збереження
      }
      
      // Відправляємо подію синхронізації
      const syncEvent = new CustomEvent('mainPageSettingsUpdated', { 
        detail: updatedSettings 
      });
      window.dispatchEvent(syncEvent);
      
    } catch (error) {
      // Тихо ігноруємо помилки
    }
  }, [settings]);

  const deleteCarouselItem = useCallback((itemId: string) => {
    try {
      // Видаляємо карточку з масиву з перевіркою безпеки
      const currentItems = Array.isArray(settings.carouselItems) ? settings.carouselItems : [];
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      
      // Створюємо повні налаштування
      const updatedSettings = {
        ...settings,
        carouselItems: updatedItems
      };
      
      // Миттєво оновлюємо локальний стан
      setSettings(updatedSettings);
      
      // Закриваємо редагування якщо видаляємо поточну карточку
      if (editingItem?.id === itemId) {
        setEditingItem(null);
      }
      
      // Зберігаємо синхронно
      try {
        localStorage.setItem('mainPageSettings', JSON.stringify(updatedSettings));
        
        const legacyData = {
          carouselItems: updatedItems,
          headerTitle: updatedSettings.headerTitle,
          headerSubtitle: updatedSettings.headerSubtitle,
          headerDescription: updatedSettings.headerDescription
        };
        localStorage.setItem('immersiveExperienceData', JSON.stringify(legacyData));
        
      } catch (storageError) {
        // Тихо ігноруємо помилки збереження
      }
      
      // Відправляємо подію синхронізації
      const syncEvent = new CustomEvent('mainPageSettingsUpdated', { 
        detail: updatedSettings 
      });
      window.dispatchEvent(syncEvent);
      
    } catch (error) {
      // Тихо ігноруємо помилки
    }
  }, [settings, editingItem]);

  const getDeviceClasses = () => {
    switch (deviceType) {
      case 'mobile':
        return 'w-[320px] h-[568px]';
      case 'tablet':
        return 'w-[640px] h-[480px]';
      default:
        return 'w-[800px] h-[450px]';
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
        return { backgroundColor: settings.backgroundColor };
    }
  };

  // Функція для отримання стилів карточок каруселі
  const getCarouselCardStyles = (isActive: boolean) => {
    const baseCardStyles = {
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)'
    };

    switch (settings.carouselStyle) {
      case 'classic':
        return {
          ...baseCardStyles,
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))',
          border: isActive ? '2px solid rgba(255,255,255,0.8)' : '1px solid rgba(255,255,255,0.3)',
          boxShadow: isActive ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.2)'
        };
      case 'modern':
        return {
          ...baseCardStyles,
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${settings.brandColor}15, ${settings.accentColor}15)`,
          border: isActive ? `2px solid ${settings.accentColor}` : `1px solid ${settings.accentColor}40`,
          boxShadow: isActive ? `0 8px 32px ${settings.accentColor}30` : '0 4px 16px rgba(0,0,0,0.15)'
        };
      case 'minimal':
        return {
          background: 'rgba(255,255,255,0.1)',
          border: isActive ? '2px solid rgba(255,255,255,0.6)' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '4px',
          boxShadow: 'none'
        };
      case 'premium':
        return {
          ...baseCardStyles,
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,255,255,0.2))',
          border: isActive ? '3px solid rgba(255,215,0,0.8)' : '2px solid rgba(255,215,0,0.4)',
          boxShadow: isActive ? '0 12px 40px rgba(255,215,0,0.4)' : '0 6px 24px rgba(255,215,0,0.2)'
        };
      case 'neon':
        return {
          background: 'rgba(0,0,0,0.8)',
          border: isActive ? `3px solid ${settings.accentColor}` : `2px solid ${settings.accentColor}80`,
          borderRadius: '6px',
          boxShadow: isActive 
            ? `0 0 30px ${settings.accentColor}, inset 0 0 30px ${settings.accentColor}20` 
            : `0 0 15px ${settings.accentColor}60, inset 0 0 15px ${settings.accentColor}10`,
          backdropFilter: 'blur(5px)'
        };
      case 'glass':
        return {
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(25px) saturate(200%)',
          border: isActive ? '2px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: isActive ? '0 12px 40px rgba(0,0,0,0.2)' : '0 6px 20px rgba(0,0,0,0.1)'
        };
      case 'retro':
        return {
          background: 'linear-gradient(135deg, #ff6b6b15, #feca5715)',
          border: isActive ? '4px solid #ff6b6b' : '3px solid #ff6b6b80',
          borderRadius: '2px',
          boxShadow: isActive 
            ? '6px 6px 0px #ff6b6b60, 12px 12px 0px #feca5760' 
            : '3px 3px 0px #ff6b6b40, 6px 6px 0px #feca5740'
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, rgba(139,69,19,0.15), rgba(160,82,45,0.2))',
          border: isActive ? '2px solid rgba(139,69,19,0.8)' : '1px solid rgba(139,69,19,0.4)',
          borderRadius: '14px',
          boxShadow: isActive ? '0 8px 32px rgba(139,69,19,0.4)' : '0 4px 16px rgba(139,69,19,0.2)'
        };
      case 'tech':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,255,0.08), rgba(0,100,255,0.15))',
          border: isActive ? '2px solid rgba(0,255,255,0.8)' : '1px solid rgba(0,255,255,0.4)',
          borderRadius: '1px',
          boxShadow: isActive 
            ? '0 0 25px rgba(0,255,255,0.5), inset 0 0 25px rgba(0,100,255,0.2)' 
            : '0 0 12px rgba(0,255,255,0.3), inset 0 0 12px rgba(0,100,255,0.1)'
        };
      case 'organic':
        return {
          background: 'linear-gradient(135deg, rgba(34,139,34,0.15), rgba(144,238,144,0.2))',
          border: isActive ? '3px solid rgba(34,139,34,0.8)' : '2px solid rgba(34,139,34,0.4)',
          borderRadius: '60% 25% 75% 35%',
          boxShadow: isActive ? '0 8px 32px rgba(34,139,34,0.4)' : '0 4px 16px rgba(34,139,34,0.2)'
        };
      default:
        return baseCardStyles;
    }
  };

  // Функція для отримання стилів навігаційних елементів каруселі
  const getCarouselPreviewStyles = () => {
    const baseStyles = {
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)'
    };

    switch (settings.carouselStyle) {
      case 'classic':
        return {
          ...baseStyles,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)'
        };
      case 'modern':
        return {
          ...baseStyles,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${settings.brandColor}40, ${settings.accentColor}40)`,
          border: `1px solid ${settings.accentColor}60`
        };
      case 'minimal':
        return {
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%'
        };
      case 'premium':
        return {
          ...baseStyles,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,255,255,0.4))',
          border: '1px solid rgba(255,215,0,0.6)'
        };
      case 'neon':
        return {
          background: 'rgba(0,0,0,0.8)',
          border: `2px solid ${settings.accentColor}`,
          borderRadius: '50%',
          boxShadow: `0 0 15px ${settings.accentColor}60`
        };
      case 'glass':
        return {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%'
        };
      case 'retro':
        return {
          background: 'linear-gradient(135deg, #ff6b6b40, #feca5740)',
          border: '2px solid #ff6b6b',
          borderRadius: '20%'
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, rgba(139,69,19,0.3), rgba(160,82,45,0.4))',
          border: '1px solid rgba(139,69,19,0.6)',
          borderRadius: '50%'
        };
      case 'tech':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,100,255,0.3))',
          border: '1px solid rgba(0,255,255,0.6)',
          borderRadius: '10%'
        };
      case 'organic':
        return {
          background: 'linear-gradient(135deg, rgba(34,139,34,0.3), rgba(144,238,144,0.4))',
          border: '2px solid rgba(34,139,34,0.6)',
          borderRadius: '40% 60% 70% 30%'
        };
      default:
        return baseStyles;
    }
  };

  // Функції для інтерактивного попереднього перегляду каруселі
  const goToNextPreview = () => {
    const carouselLength = settings.carouselItems?.length || 0;
    if (carouselLength > 0) {
      setPreviewActiveIndex((prevIndex) => (prevIndex + 1) % carouselLength);
      setPreviewExpandedCard(null);
    }
  };

  const goToPrevPreview = () => {
    const carouselLength = settings.carouselItems?.length || 0;
    if (carouselLength > 0) {
      setPreviewActiveIndex((prevIndex) => (prevIndex - 1 + carouselLength) % carouselLength);
      setPreviewExpandedCard(null);
    }
  };

  const handlePreviewItemClick = (index: number) => {
    if (index === previewActiveIndex) {
      // Toggle expanded state for active card
      setPreviewExpandedCard(previewExpandedCard === index ? null : index);
    } else {
      setPreviewActiveIndex(index);
      setPreviewExpandedCard(null);
    }
  };

  const saveSettings = async () => {
    try {
      console.log('💾 MainPageCustomizer: Початок збереження налаштувань через IndexedDBService...');
      
      // Зберігаємо налаштування через новий сервіс
      await indexedDBService.saveSettings('mainPageSettings', settings, 'project');
      
      // Також зберігаємо мінімальну версію в localStorage для швидкого доступу
      try {
        const minimalSettings = {
          headerTitle: settings.headerTitle,
          headerSubtitle: settings.headerSubtitle,
          headerDescription: settings.headerDescription,
          brandColor: settings.brandColor,
          accentColor: settings.accentColor,
          textColor: settings.textColor,
          
          // ВАЖЛИВО: Включаємо налаштування фону
          backgroundType: settings.backgroundType,
          backgroundColor: settings.backgroundColor,
          gradientFrom: settings.gradientFrom,
          gradientTo: settings.gradientTo,
          backgroundImage: settings.backgroundImage,
          backgroundVideo: settings.backgroundVideo,
          logoUrl: settings.logoUrl,
          
          carouselItems: settings.carouselItems?.map(item => ({
            ...item,
            imageUrl: item.imageUrl?.length > 100000 ? '' : item.imageUrl
          })) || [],
          
          // Зберігаємо тільки назви аудіо файлів, не URL
          audioSettings: {
            backgroundMusic: {
              ...settings.audioSettings.backgroundMusic,
              url: '',
              fileName: settings.audioSettings.backgroundMusic.fileName
            },
            hoverSounds: {
              ...settings.audioSettings.hoverSounds,
              url: '',
              fileName: settings.audioSettings.hoverSounds.fileName
            },
            clickSounds: {
              ...settings.audioSettings.clickSounds,
              url: '',
              fileName: settings.audioSettings.clickSounds.fileName
            },
            carouselSounds: {
              ...settings.audioSettings.carouselSounds,
              transitionUrl: '',
              hoverUrl: '',
              clickUrl: '',
              transitionFileName: settings.audioSettings.carouselSounds.transitionFileName,
              hoverFileName: settings.audioSettings.carouselSounds.hoverFileName,
              clickFileName: settings.audioSettings.carouselSounds.clickFileName
            },
            uiSounds: {
              ...settings.audioSettings.uiSounds,
              buttonHoverUrl: '',
              buttonClickUrl: '',
              notificationUrl: '',
              buttonHoverFileName: settings.audioSettings.uiSounds.buttonHoverFileName,
              buttonClickFileName: settings.audioSettings.uiSounds.buttonClickFileName,
              notificationFileName: settings.audioSettings.uiSounds.notificationFileName
            }
          }
        };
        
        localStorage.setItem('mainPageSettings', JSON.stringify(minimalSettings));
        console.log('✅ MainPageCustomizer: Мінімальні налаштування збережено в localStorage');
        
      } catch (localStorageError) {
        console.log('ℹ️ MainPageCustomizer: localStorage недоступний, використовуємо тільки IndexedDB');
      }
      
      // Dispatch event to update main screen
      window.dispatchEvent(new CustomEvent('mainPageSettingsUpdated', { detail: settings }));
      
      console.log('✅ MainPageCustomizer: Налаштування успішно збережено');
      alert('✅ Налаштування збережено успішно!');
      
    } catch (error) {
      console.error('❌ MainPageCustomizer: Помилка збереження налаштувань:', error);
      alert('❌ Помилка збереження налаштувань. Спробуйте ще раз.');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main-page-settings.json';
    link.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
        } catch (error) {
          alert('Помилка імпорту файлу');
        }
      };
      reader.readAsText(file);
    }
  };

  // Функція для закриття адмін панелі
  const handleCloseAdminPanel = () => {
    // Відправляємо event щоб закрити адмін панель
    window.dispatchEvent(new CustomEvent('closeAdminPanel'));
  };



  // Функції для динамічного стилювання попереднього перегляду
  const getPreviewTextStyle = (element: 'title' | 'subtitle' | 'description') => {
    // Отримуємо адаптивні налаштування для поточного типу пристрою
    const adaptiveSettings = settings[deviceType];
    
    const baseStyle: React.CSSProperties = {
      color: settings.textColor,
      fontFamily: element === 'title' ? settings.headerTitleFontFamily :
                  element === 'subtitle' ? settings.headerSubtitleFontFamily :
                  settings.headerDescriptionFontFamily,
      // Використовуємо адаптивні розміри шрифтів
      fontSize: element === 'title' ? `${adaptiveSettings.headerTitleFontSize}px` :
               element === 'subtitle' ? `${adaptiveSettings.headerSubtitleFontSize}px` :
               `${adaptiveSettings.headerDescriptionFontSize}px`,
      // Додаємо товщину шрифту
      fontWeight: element === 'title' ? settings.headerTitleFontWeight :
                  element === 'subtitle' ? settings.headerSubtitleFontWeight :
                  settings.headerDescriptionFontWeight,
      // Додаємо стиль шрифту
      fontStyle: element === 'title' ? settings.headerTitleFontStyle :
                 element === 'subtitle' ? settings.headerSubtitleFontStyle :
                 settings.headerDescriptionFontStyle,
      // Додаємо адаптивні відступи знизу
      marginBottom: element === 'title' ? `${adaptiveSettings.headerTitleMarginBottom}px` :
                   element === 'subtitle' ? `${adaptiveSettings.headerSubtitleMarginBottom}px` :
                   `${adaptiveSettings.headerDescriptionMarginBottom}px`,
      // Додаємо адаптивну висоту рядка
      lineHeight: element === 'title' ? adaptiveSettings.headerTitleLineHeight :
                 element === 'subtitle' ? adaptiveSettings.headerSubtitleLineHeight :
                 adaptiveSettings.headerDescriptionLineHeight,
      // Додаємо адаптивний інтервал між літерами
      letterSpacing: element === 'title' ? `${adaptiveSettings.headerTitleLetterSpacing}px` :
                    element === 'subtitle' ? `${adaptiveSettings.headerSubtitleLetterSpacing}px` :
                    `${adaptiveSettings.headerDescriptionLetterSpacing}px`
    };

    // Отримуємо налаштування тіней та 3D ефектів
    const depth = element === 'title' ? settings.headerTitle3DDepth :
                  element === 'subtitle' ? settings.headerSubtitle3DDepth :
                  settings.headerDescription3DDepth;
    
    const shadowIntensity = element === 'title' ? settings.headerTitleShadowIntensity :
                           element === 'subtitle' ? settings.headerSubtitleShadowIntensity :
                           settings.headerDescriptionShadowIntensity;
    
    const shadowColor = element === 'title' ? settings.headerTitleShadowColor :
                       element === 'subtitle' ? settings.headerSubtitleShadowColor :
                       settings.headerDescriptionShadowColor;

    // Допоміжна функція для конвертації hex в rgb
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    };

    // Створюємо тіні та 3D ефекти
    if (depth > 0) {
      // Створюємо багатошарову тінь для 3D ефекту
      const shadows = [];
      const maxLayers = Math.min(depth, 50); // Обмежуємо кількість шарів для продуктивності
      
      for (let i = 1; i <= maxLayers; i++) {
        const opacity = Math.max(0.05, shadowIntensity - (i * 0.015));
        const offsetX = Math.round(i * 0.5);
        const offsetY = Math.round(i * 0.5);
        shadows.push(`${offsetX}px ${offsetY}px 0px rgba(${hexToRgb(shadowColor)}, ${opacity})`);
      }
      
      // Додаємо основну тінь для глибини
      if (shadowIntensity > 0) {
        shadows.push(`${Math.round(depth * 0.8)}px ${Math.round(depth * 0.8)}px ${Math.round(depth * 0.3)}px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity * 0.3})`);
      }
      
      baseStyle.textShadow = shadows.join(', ');
      baseStyle.transform = `translateZ(${depth}px)`;
    } else if (shadowIntensity > 0) {
      // Звичайна тінь без 3D ефекту
      baseStyle.textShadow = `2px 2px 8px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity}), 0 0 16px rgba(${hexToRgb(shadowColor)}, ${shadowIntensity * 0.5})`;
    }

    return baseStyle;
  };

  const getPreviewAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? settings.headerTitleAnimation :
                          element === 'subtitle' ? settings.headerSubtitleAnimation :
                          settings.headerDescriptionAnimation;
    
    const exitAnimation = element === 'title' ? settings.headerTitleExitAnimation :
                         element === 'subtitle' ? settings.headerSubtitleExitAnimation :
                         settings.headerDescriptionExitAnimation;

    const duration = settings.headerAnimationDuration / 1000;
    const delay = settings.headerAnimationDelay / 1000;

    // Варіанти анімацій появи
    const enterVariants: any = {
      none: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      fadeIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideUp: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideDown: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideLeft: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      slideRight: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      zoomIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      zoomOut: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      rotateIn: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      bounce: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      typewriter: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      glow: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }
    };

    // Початкові стани
    const initialVariants: any = {
      none: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      fadeIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
      slideUp: { opacity: 0, x: 0, y: 50, scale: 1, rotate: 0 },
      slideDown: { opacity: 0, x: 0, y: -50, scale: 1, rotate: 0 },
      slideLeft: { opacity: 0, x: 50, y: 0, scale: 1, rotate: 0 },
      slideRight: { opacity: 0, x: -50, y: 0, scale: 1, rotate: 0 },
      zoomIn: { opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 0 },
      zoomOut: { opacity: 0, x: 0, y: 0, scale: 1.5, rotate: 0 },
      rotateIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: -180 },
      bounce: { opacity: 0, x: 0, y: -100, scale: 1, rotate: 0 },
      typewriter: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      glow: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
    };

    return {
      initial: initialVariants[enterAnimation],
      animate: enterVariants[enterAnimation],
      transition: {
        duration,
        delay: delay * (element === 'title' ? 0 : element === 'subtitle' ? 1 : 2),
        type: enterAnimation === 'bounce' ? 'spring' : 'tween',
        stiffness: enterAnimation === 'bounce' ? 300 : undefined,
        damping: enterAnimation === 'bounce' ? 20 : undefined
      }
    };
  };

  // Функція для генерації унікального ключа для перерендерингу
  const getPreviewElementKey = (element: 'title' | 'subtitle' | 'description') => {
    // Отримуємо адаптивні налаштування для поточного пристрою
    const adaptiveSettings = settings[deviceType];
    
    // Базові налаштування тексту
    const baseText = element === 'title' ? settings.headerTitle : 
                    element === 'subtitle' ? settings.headerSubtitle : 
                    settings.headerDescription;
    
    // Налаштування шрифтів
    const fontSettings = element === 'title' ? 
      `${settings.headerTitleFontFamily}-${settings.headerTitleFontWeight}-${settings.headerTitleFontStyle}` :
      element === 'subtitle' ?
      `${settings.headerSubtitleFontFamily}-${settings.headerSubtitleFontWeight}-${settings.headerSubtitleFontStyle}` :
      `${settings.headerDescriptionFontFamily}-${settings.headerDescriptionFontWeight}-${settings.headerDescriptionFontStyle}`;
    
    // Налаштування анімацій
    const animationSettings = element === 'title' ?
      `${settings.headerTitleAnimation}-${settings.headerTitleExitAnimation}` :
      element === 'subtitle' ?
      `${settings.headerSubtitleAnimation}-${settings.headerSubtitleExitAnimation}` :
      `${settings.headerDescriptionAnimation}-${settings.headerDescriptionExitAnimation}`;
    
    // Налаштування тіней та 3D ефектів
    const shadowSettings = element === 'title' ?
      `${settings.headerTitle3DDepth}-${settings.headerTitleShadowIntensity}-${settings.headerTitleShadowColor}` :
      element === 'subtitle' ?
      `${settings.headerSubtitle3DDepth}-${settings.headerSubtitleShadowIntensity}-${settings.headerSubtitleShadowColor}` :
      `${settings.headerDescription3DDepth}-${settings.headerDescriptionShadowIntensity}-${settings.headerDescriptionShadowColor}`;
    
    // Адаптивні налаштування
    const adaptiveKey = element === 'title' ?
      `${adaptiveSettings.headerTitleFontSize}-${adaptiveSettings.headerTitleMarginBottom}-${adaptiveSettings.headerTitleLineHeight}-${adaptiveSettings.headerTitleLetterSpacing}` :
      element === 'subtitle' ?
      `${adaptiveSettings.headerSubtitleFontSize}-${adaptiveSettings.headerSubtitleMarginBottom}-${adaptiveSettings.headerSubtitleLineHeight}-${adaptiveSettings.headerSubtitleLetterSpacing}` :
      `${adaptiveSettings.headerDescriptionFontSize}-${adaptiveSettings.headerDescriptionMarginBottom}-${adaptiveSettings.headerDescriptionLineHeight}-${adaptiveSettings.headerDescriptionLetterSpacing}`;
    
    // Загальні налаштування анімації
    const globalAnimationSettings = `${settings.headerAnimationDuration}-${settings.headerAnimationDelay}`;
    
    // Об'єднуємо всі ключі
    const fullKey = `${baseText}-${fontSettings}-${animationSettings}-${shadowSettings}-${adaptiveKey}-${globalAnimationSettings}-${deviceType}-${settings.textColor}`;
    
    return `preview-${element}-${fullKey}`;
  };

  // Допоміжні функції для роботи з типографікою
  const getTypographyValue = (property: 'fontFamily' | 'fontWeight' | 'fontStyle') => {
    switch (activeTypographyElement) {
      case 'title':
        return property === 'fontFamily' ? settings.headerTitleFontFamily :
               property === 'fontWeight' ? settings.headerTitleFontWeight :
               settings.headerTitleFontStyle;
      case 'subtitle':
        return property === 'fontFamily' ? settings.headerSubtitleFontFamily :
               property === 'fontWeight' ? settings.headerSubtitleFontWeight :
               settings.headerSubtitleFontStyle;
      case 'description':
        return property === 'fontFamily' ? settings.headerDescriptionFontFamily :
               property === 'fontWeight' ? settings.headerDescriptionFontWeight :
               settings.headerDescriptionFontStyle;
    }
  };

  const updateTypographyValue = (property: 'fontFamily' | 'fontWeight' | 'fontStyle', value: string | number) => {
    switch (activeTypographyElement) {
      case 'title':
        if (property === 'fontFamily') updateSettings({ headerTitleFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ headerTitleFontWeight: value as number });
        else updateSettings({ headerTitleFontStyle: value as string });
        break;
      case 'subtitle':
        if (property === 'fontFamily') updateSettings({ headerSubtitleFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ headerSubtitleFontWeight: value as number });
        else updateSettings({ headerSubtitleFontStyle: value as string });
        break;
      case 'description':
        if (property === 'fontFamily') updateSettings({ headerDescriptionFontFamily: value as string });
        else if (property === 'fontWeight') updateSettings({ headerDescriptionFontWeight: value as number });
        else updateSettings({ headerDescriptionFontStyle: value as string });
        break;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Mobile-первые улучшения для всех элементов управления */
        @media (max-width: 768px) {
          .mobile-compact-button {
            min-height: 40px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 6px;
          }
          
          .mobile-compact-input {
            min-height: 36px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 6px;
          }
          
          .mobile-compact-select {
            min-height: 36px;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 6px;
          }
          
          .mobile-compact-slider {
            height: 16px;
          }
          
          .mobile-compact-container {
            padding: 8px;
            border-radius: 8px;
          }
          
          .mobile-compact-header {
            padding: 6px;
            margin-bottom: 8px;
          }
          
          .mobile-compact-icon {
            width: 20px;
            height: 20px;
            font-size: 12px;
          }
          
          .mobile-compact-title {
            font-size: 12px;
            font-weight: 600;
          }
          
          .mobile-compact-grid {
            gap: 4px;
          }
          
          .mobile-compact-space {
            gap: 8px;
          }
        }
        `
      }} />
      <div className="flex h-full bg-gradient-to-br from-slate-50 to-slate-100" data-main-customizer="true">
      {/* Mobile & Desktop Responsive Sidebar */}
              <div className="w-full lg:w-[520px] lg:min-w-[520px] lg:max-w-[520px] bg-white/80 backdrop-blur-xl lg:border-r border-slate-200/60 flex flex-col shadow-xl overflow-hidden">
        {/* Mobile-Optimized Header */}
        <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs lg:text-2xl font-bold text-white mb-0 lg:mb-2">{t('main.constructor.title')}</h2>
              <p className="text-blue-100 text-xs lg:text-sm hidden lg:block">{t('main.constructor.description')}</p>
            </div>
            <div className="flex items-center gap-1 lg:gap-3">
              {syncStatus === 'syncing' && (
                <div className="flex items-center gap-1 lg:gap-1.5 text-white/90">
                  <div className="w-2 h-2 lg:w-4 lg:h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></div>
                  <span className="text-xs lg:text-sm hidden sm:inline">{t('main.constructor.syncing')}</span>
                </div>
              )}
              {syncStatus === 'synced' && (
                <div className="flex items-center gap-1 lg:gap-1.5 text-green-100">
                  <div className="w-2 h-2 lg:w-4 lg:h-4 bg-green-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-xs lg:text-sm hidden sm:inline">{t('main.constructor.saved')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Tabs */}
        <div className="flex bg-slate-50/80 border-b border-slate-200/60">
          {[
            { id: 'header', label: t('main.tab.content'), icon: '✍️', color: 'blue' },
            { id: 'carousel', label: t('main.tab.carousel'), icon: '🎠', color: 'purple' },
            { id: 'design', label: t('main.tab.style'), icon: '🎨', color: 'pink' },
            { id: 'background', label: t('main.tab.background'), icon: '🌅', color: 'indigo' },
            { id: 'audio', label: t('main.tab.audio'), icon: '🎵', color: 'green' },
            { id: '3d', label: t('main.tab.3d'), icon: '🌐', color: 'cyan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex-1 px-1 lg:px-3 py-1 lg:py-4 text-sm font-medium transition-all duration-300 relative group touch-manipulation ${
                activeTab === tab.id
                  ? `text-${tab.color}-600 bg-white shadow-sm`
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <div className="flex flex-col items-center gap-0 lg:gap-2">
                <span className="text-xs lg:text-lg">{tab.icon}</span>
                <span className="text-xs font-semibold text-center leading-tight">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${tab.color}-400 to-${tab.color}-600`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile-Optimized Tab Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 lg:p-6 space-y-2 lg:space-y-6" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
          {activeTab === 'header' && (
            <div className="space-y-4 lg:space-y-6">
              {/* 1. Текстовий контент - ПЕРШИЙ БЛОК */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg lg:rounded-2xl p-2 lg:p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">📝</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.text.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.text.description')}</p>
                  </div>
                </div>
                
                <div className="space-y-2 lg:space-y-5">
                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {t('main.text.header.title')}
                    </label>
                    <input
                      type="text"
                      value={settings.headerTitle}
                      onChange={(e) => updateSettings({ headerTitle: e.target.value })}
                      className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] lg:min-h-[auto] text-xs lg:text-base"
                      placeholder={t('main.text.header.title.placeholder')}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      {t('main.text.header.subtitle')}
                    </label>
                    <input
                      type="text"
                      value={settings.headerSubtitle}
                      onChange={(e) => updateSettings({ headerSubtitle: e.target.value })}
                      className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 min-h-[40px] lg:min-h-[auto] text-xs lg:text-base"
                      placeholder={t('main.text.header.subtitle.placeholder')}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {t('main.text.header.description')}
                    </label>
                    <textarea
                      value={settings.headerDescription}
                      onChange={(e) => updateSettings({ headerDescription: e.target.value })}
                      rows={2}
                      className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-white/80 border border-slate-200 rounded-md lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none min-h-[60px] lg:min-h-[120px] text-xs lg:text-base"
                      placeholder={t('main.text.header.description.placeholder')}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Типографіка - ДРУГИЙ БЛОК */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg lg:rounded-2xl p-2 lg:p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🔤</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.typography.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.typography.description')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами */}
                <div className="mb-2 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.typography.select.element')}</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                                              { type: 'title', label: t('main.typography.element.title'), icon: '🔤', color: 'blue' },
                        { type: 'subtitle', label: t('main.typography.element.subtitle'), icon: '📝', color: 'purple' },
                        { type: 'description', label: t('main.typography.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`p-1.5 lg:p-3 rounded-md lg:rounded-xl border-2 transition-all duration-300 min-w-fit flex-1 ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-lg scale-105`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-xl mb-0 lg:mb-1 text-center">{element.icon}</div>
                        <div className="text-xs font-semibold text-center leading-tight">{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування для обраного елемента */}
                <div className="bg-white/60 rounded-md lg:rounded-xl p-2 lg:p-5 border border-purple-100">
                  <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-5">
                    <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                      {t('main.typography.settings.for').replace('{element}', 
                        activeTypographyElement === 'title' ? t('main.typography.element.title') :
                        activeTypographyElement === 'subtitle' ? t('main.typography.element.subtitle') : 
                        t('main.typography.element.description')
                      )}
                    </h4>
                  </div>
                  
                  <div className="space-y-2 lg:space-y-5">
                    {/* Сімейство шрифтів */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('main.typography.font.family')}</label>
                      <select
                        value={getTypographyValue('fontFamily') as string}
                        onChange={(e) => updateTypographyValue('fontFamily', e.target.value)}
                        className="w-full px-2 lg:px-4 py-1.5 lg:py-3 bg-white border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs lg:text-sm transition-all duration-200 min-h-[36px] lg:min-h-[auto]"
                      >
                        <optgroup label="🔥 Сучасні Sans-Serif (Кирилиця)">
                          <option value="Inter">Inter</option>
                          <option value="Source Sans Pro">Source Sans Pro</option>
                          <option value="Nunito">Nunito</option>
                          <option value="IBM Plex Sans">IBM Plex Sans</option>
                          <option value="Fira Sans">Fira Sans</option>
                        </optgroup>
                        
                        <optgroup label="📖 Класичні Sans-Serif (Кирилиця)">
                          <option value="Roboto">Roboto</option>
                          <option value="Open Sans">Open Sans</option>
                          <option value="Lato">Lato</option>
                          <option value="Montserrat">Montserrat</option>
                          <option value="Poppins">Poppins</option>
                          <option value="Oswald">Oswald</option>
                        </optgroup>
                        
                        <optgroup label="✍️ Елегантні Serif (Кирилиця)">
                          <option value="Source Serif Pro">Source Serif Pro</option>
                          <option value="Lora">Lora</option>
                          <option value="IBM Plex Serif">IBM Plex Serif</option>
                          <option value="Georgia">Georgia</option>
                        </optgroup>
                        
                        <optgroup label="🎨 Декоративні (обмежена кирилиця)">
                          <option value="Playfair Display">Playfair Display</option>
                        </optgroup>
                        
                        <optgroup label="💻 Спеціальні (Кирилиця)">
                          <option value="JetBrains Mono">JetBrains Mono</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Товщина шрифту */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('main.typography.font.weight')}</label>
                      <div className="grid grid-cols-3 gap-1 lg:gap-3">
                        {[
                          { value: 400, label: t('main.typography.weight.normal'), weight: 'font-normal' },
                          { value: 600, label: t('main.typography.weight.semibold'), weight: 'font-semibold' },
                          { value: 700, label: t('main.typography.weight.bold'), weight: 'font-bold' }
                        ].map((weight) => (
                          <button
                            key={weight.value}
                            onClick={() => updateTypographyValue('fontWeight', weight.value)}
                            className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-200 text-center min-h-[32px] lg:min-h-[auto] touch-manipulation ${
                              getTypographyValue('fontWeight') === weight.value
                                ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                            }`}
                          >
                            <div className={`${weight.weight} text-xs lg:text-lg`}>Aa</div>
                            <div className="text-xs leading-none break-words">{weight.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Стиль тексту */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('main.typography.font.style')}</label>
                      <div className="grid grid-cols-2 gap-1 lg:gap-3">
                        {[
                          { value: 'normal', label: t('main.typography.style.normal'), style: 'font-normal' },
                          { value: 'italic', label: t('main.typography.style.italic'), style: 'italic' }
                        ].map((style) => (
                          <button
                            key={style.value}
                            onClick={() => updateTypographyValue('fontStyle', style.value)}
                            className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-200 text-center min-h-[32px] lg:min-h-[auto] touch-manipulation ${
                              getTypographyValue('fontStyle') === style.value
                                ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                            }`}
                          >
                            <div className={`${style.style} text-xs lg:text-sm truncate`}>
                              {activeTypographyElement === 'title' ? t('main.typography.element.title') :
                               activeTypographyElement === 'subtitle' ? t('main.typography.element.subtitle') : t('main.typography.element.description')}
                            </div>
                            <div className="text-xs leading-none">{style.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Адаптивність - ЧЕТВЕРТИЙ БЛОК */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">📱</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.responsive.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.responsive.description')}</p>
                  </div>
                </div>
                
                {/* Вибір пристрою */}
                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.responsive.select.device')}</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                                              { type: 'mobile', label: t('main.responsive.device.mobile'), icon: '📱', color: 'emerald' },
                        { type: 'tablet', label: t('main.responsive.device.tablet'), icon: '📟', color: 'teal' },
                        { type: 'desktop', label: t('main.responsive.device.desktop'), icon: '🖥️', color: 'cyan' }
                    ].map((device) => (
                      <button
                        key={device.type}
                        onClick={() => setDeviceType(device.type as DeviceType)}
                        className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-w-fit flex-1 min-h-[32px] lg:min-h-[auto] touch-manipulation ${
                          deviceType === device.type
                            ? `border-${device.color}-500 bg-${device.color}-100 text-${device.color}-700 shadow-sm`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-xl text-center">{device.icon}</div>
                        <div className="text-xs text-center leading-none">{device.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Налаштування для обраного пристрою */}
                <div className="space-y-1.5 lg:space-y-5">
                  {/* Заголовок */}
                  <div className="bg-white/60 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-1.5 lg:mb-4 flex items-center gap-1">
                      <span className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full"></span>
                      {t('main.typography.element.title')}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.size')}: {settings[deviceType].headerTitleFontSize}px
                        </label>
                        <input
                          type="range"
                          min="16"
                          max="120"
                          value={settings[deviceType].headerTitleFontSize}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerTitleFontSize: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.margin')}: {settings[deviceType].headerTitleMarginBottom}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={settings[deviceType].headerTitleMarginBottom}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerTitleMarginBottom: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Підзаголовок */}
                  <div className="bg-white/60 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-1.5 lg:mb-4 flex items-center gap-1">
                      <span className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></span>
                      {t('main.typography.element.subtitle')}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.size')}: {settings[deviceType].headerSubtitleFontSize}px
                        </label>
                        <input
                          type="range"
                          min="14"
                          max="100"
                          value={settings[deviceType].headerSubtitleFontSize}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerSubtitleFontSize: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.margin')}: {settings[deviceType].headerSubtitleMarginBottom}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={settings[deviceType].headerSubtitleMarginBottom}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerSubtitleMarginBottom: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Опис */}
                  <div className="bg-white/60 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-emerald-100">
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-1.5 lg:mb-4 flex items-center gap-1">
                      <span className="w-2 h-2 lg:w-3 lg:h-3 bg-green-500 rounded-full"></span>
                      {t('main.typography.element.description')}
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 lg:gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.size')}: {settings[deviceType].headerDescriptionFontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={settings[deviceType].headerDescriptionFontSize}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerDescriptionFontSize: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          {t('main.responsive.margin')}: {settings[deviceType].headerDescriptionMarginBottom}px
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={settings[deviceType].headerDescriptionMarginBottom}
                          onChange={(e) => updateSettings({
                            [deviceType]: {
                              ...settings[deviceType],
                              headerDescriptionMarginBottom: parseInt(e.target.value)
                            }
                          })}
                          className="w-full h-3 lg:h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Тіні та ефекти - П'ЯТИЙ БЛОК */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-violet-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.shadows.title')}</h3>
                    <p className="text-xs text-slate-600 hidden lg:block">{t('main.shadows.description')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами */}
                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.shadows.select.element')}</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('main.typography.element.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('main.typography.element.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('main.typography.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[32px] lg:min-h-[auto] ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-sm`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-xl text-center">{element.icon}</div>
                        <div className="text-xs text-center leading-none">{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування ефектів для обраного елемента */}
                <div className="bg-white/60 rounded-sm lg:rounded-xl p-1.5 lg:p-5 border border-violet-100">
                  <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-5">
                    <div className={`w-2 h-2 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                      {t('main.shadows.effects.for').replace('{element}', 
                        activeTypographyElement === 'title' ? t('main.typography.element.title') :
                        activeTypographyElement === 'subtitle' ? t('main.typography.element.subtitle') : 
                        t('main.typography.element.description')
                      )}
                    </h4>
                  </div>
                  
                  <div className="space-y-1.5 lg:space-y-5">
                    {/* Інтенсивність тіні */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">
                        {t('main.shadows.intensity')}: {
                          activeTypographyElement === 'title' ? settings.headerTitleShadowIntensity :
                          activeTypographyElement === 'subtitle' ? settings.headerSubtitleShadowIntensity :
                          settings.headerDescriptionShadowIntensity
                        }
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={
                          activeTypographyElement === 'title' ? settings.headerTitleShadowIntensity :
                          activeTypographyElement === 'subtitle' ? settings.headerSubtitleShadowIntensity :
                          settings.headerDescriptionShadowIntensity
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (activeTypographyElement === 'title') {
                            updateSettings({ headerTitleShadowIntensity: value });
                          } else if (activeTypographyElement === 'subtitle') {
                            updateSettings({ headerSubtitleShadowIntensity: value });
                          } else {
                            updateSettings({ headerDescriptionShadowIntensity: value });
                          }
                        }}
                        className="w-full h-3 lg:h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                      />
                    </div>

                    {/* Колір тіні */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('main.shadows.color')}</label>
                      <div className="flex gap-1 lg:gap-3">
                        <input
                          type="color"
                          value={
                            activeTypographyElement === 'title' ? settings.headerTitleShadowColor :
                            activeTypographyElement === 'subtitle' ? settings.headerSubtitleShadowColor :
                            settings.headerDescriptionShadowColor
                          }
                          onChange={(e) => {
                            if (activeTypographyElement === 'title') {
                              updateSettings({ headerTitleShadowColor: e.target.value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ headerSubtitleShadowColor: e.target.value });
                            } else {
                              updateSettings({ headerDescriptionShadowColor: e.target.value });
                            }
                          }}
                          className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={
                            activeTypographyElement === 'title' ? settings.headerTitleShadowColor :
                            activeTypographyElement === 'subtitle' ? settings.headerSubtitleShadowColor :
                            settings.headerDescriptionShadowColor
                          }
                          onChange={(e) => {
                            if (activeTypographyElement === 'title') {
                              updateSettings({ headerTitleShadowColor: e.target.value });
                            } else if (activeTypographyElement === 'subtitle') {
                              updateSettings({ headerSubtitleShadowColor: e.target.value });
                            } else {
                              updateSettings({ headerDescriptionShadowColor: e.target.value });
                            }
                          }}
                          className="flex-1 px-2 py-1.5 lg:px-3 lg:py-2 bg-white border border-slate-200 rounded-sm lg:rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-xs lg:text-sm min-h-[36px] lg:min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* 3D глибина */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-2 lg:mb-3">
                        {t('main.shadows.depth')}: {
                          activeTypographyElement === 'title' ? settings.headerTitle3DDepth :
                          activeTypographyElement === 'subtitle' ? settings.headerSubtitle3DDepth :
                          settings.headerDescription3DDepth
                        }
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={
                          activeTypographyElement === 'title' ? settings.headerTitle3DDepth :
                          activeTypographyElement === 'subtitle' ? settings.headerSubtitle3DDepth :
                          settings.headerDescription3DDepth
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (activeTypographyElement === 'title') {
                            updateSettings({ headerTitle3DDepth: value });
                          } else if (activeTypographyElement === 'subtitle') {
                            updateSettings({ headerSubtitle3DDepth: value });
                          } else {
                            updateSettings({ headerDescription3DDepth: value });
                          }
                        }}
                        className="w-full h-3 lg:h-2 bg-violet-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Анімації тексту - ШОСТИЙ БЛОК */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">✨</span>
                  </div>
                  <div>
                                        <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.animations.title')}</h3>
                    <p className="text-xs text-slate-600 hidden lg:block">{t('main.animations.description')}</p>
                  </div>
                </div>
                
                {/* Переключення між елементами */}
                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.animations.select.element')}</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { type: 'title', label: t('main.typography.element.title'), icon: '🔤', color: 'blue' },
                      { type: 'subtitle', label: t('main.typography.element.subtitle'), icon: '📝', color: 'purple' },
                      { type: 'description', label: t('main.typography.element.description'), icon: '📄', color: 'green' }
                    ].map((element) => (
                      <button
                        key={element.type}
                        onClick={() => setActiveTypographyElement(element.type as 'title' | 'subtitle' | 'description')}
                        className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-w-fit flex-1 touch-manipulation min-h-[32px] lg:min-h-[auto] ${
                          activeTypographyElement === element.type
                            ? `border-${element.color}-500 bg-${element.color}-100 text-${element.color}-700 shadow-sm`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-xl text-center">{element.icon}</div>
                        <div className="text-xs text-center leading-none">{element.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Спільні налаштування анімації для обраного елемента */}
                <div className="bg-white/60 rounded-sm lg:rounded-xl p-1.5 lg:p-5 border border-cyan-100">
                  <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-5">
                    <div className={`w-2 h-2 lg:w-4 lg:h-4 rounded-full ${
                      activeTypographyElement === 'title' ? 'bg-blue-500' :
                      activeTypographyElement === 'subtitle' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <h4 className="text-xs lg:text-sm font-semibold text-slate-800">
                      {t('main.animations.for').replace('{element}', 
                        activeTypographyElement === 'title' ? t('main.typography.element.title') :
                        activeTypographyElement === 'subtitle' ? t('main.typography.element.subtitle') : 
                        t('main.typography.element.description')
                      )}
                    </h4>
                  </div>
                  
                  <div className="space-y-1.5 lg:space-y-5">
                    {/* Анімація входу */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-3">{t('main.animations.entrance')}</label>
                      <div className="grid grid-cols-3 gap-0.5 lg:gap-2">
                        {[
                          { value: 'none', label: t('main.animations.type.none'), icon: '⚪' },
                          { value: 'fadeIn', label: t('main.animations.type.fadeIn'), icon: '🌅' },
                          { value: 'slideUp', label: t('main.animations.type.slideUp'), icon: '⬆️' },
                          { value: 'slideDown', label: t('main.animations.type.slideDown'), icon: '⬇️' },
                          { value: 'slideLeft', label: t('main.animations.type.slideLeft'), icon: '⬅️' },
                          { value: 'slideRight', label: t('main.animations.type.slideRight'), icon: '➡️' },
                          { value: 'zoomIn', label: t('main.animations.type.zoomIn'), icon: '🔍' },
                          { value: 'rotateIn', label: t('main.animations.type.rotateIn'), icon: '🔄' },
                          { value: 'bounce', label: t('main.animations.type.bounce'), icon: '⚡' },
                          { value: 'typewriter', label: t('main.animations.type.typewriter'), icon: '⌨️' },
                          { value: 'glow', label: t('main.animations.type.glow'), icon: '💫' }
                        ].map((animation) => {
                          const currentAnimation = activeTypographyElement === 'title' ? settings.headerTitleAnimation :
                                                 activeTypographyElement === 'subtitle' ? settings.headerSubtitleAnimation :
                                                 settings.headerDescriptionAnimation;
                          
                          return (
                            <button
                              key={animation.value}
                              onClick={() => {
                                if (activeTypographyElement === 'title') {
                                  updateSettings({ headerTitleAnimation: animation.value as MainPageSettings['headerTitleAnimation'] });
                                } else if (activeTypographyElement === 'subtitle') {
                                  updateSettings({ headerSubtitleAnimation: animation.value as MainPageSettings['headerSubtitleAnimation'] });
                                } else {
                                  updateSettings({ headerDescriptionAnimation: animation.value as MainPageSettings['headerDescriptionAnimation'] });
                                }
                              }}
                              className={`px-1 py-1 lg:p-3 rounded-sm lg:rounded-lg border transition-all duration-200 text-xs touch-manipulation min-h-[28px] lg:min-h-[auto] ${
                                currentAnimation === animation.value
                                  ? 'border-cyan-500 bg-cyan-100 text-cyan-700'
                                  : 'border-slate-200 hover:border-slate-300 bg-white/60'
                              }`}
                            >
                              <div className="text-xs lg:text-lg">{animation.icon}</div>
                              <div className="text-xs leading-none">{animation.label}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Загальні налаштування анімації */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-600 mb-1 lg:mb-4">{t('main.animations.settings')}</label>
                      <div className="grid grid-cols-2 gap-1.5 lg:gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t('main.animations.duration')}: {settings.headerAnimationDuration}мс
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="3000"
                            step="100"
                            value={settings.headerAnimationDuration}
                            onChange={(e) => updateSettings({ headerAnimationDuration: parseInt(e.target.value) })}
                            className="w-full h-3 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            {t('main.animations.delay')}: {settings.headerAnimationDelay}мс
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            step="100"
                            value={settings.headerAnimationDelay}
                            onChange={(e) => updateSettings({ headerAnimationDelay: parseInt(e.target.value) })}
                            className="w-full h-3 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer modern-slider touch-manipulation"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'carousel' && (
            <div className="space-y-2 lg:space-y-6">
              {/* Управління каруселлю */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-1.5 lg:mb-6">
                  <div className="flex items-center gap-1 lg:gap-3">
                    <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">🎠</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.carousel.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.carousel.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={addCarouselItem}
                    className="px-2 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-sm lg:rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium shadow-sm lg:shadow-lg hover:shadow-md lg:hover:shadow-xl flex items-center gap-1 lg:gap-2 min-h-[36px] lg:min-h-[auto] touch-manipulation"
                  >
                    <span className="text-sm lg:text-base">+</span>
                    <span className="text-xs lg:text-sm">{t('main.carousel.add')}</span>
                  </button>
                </div>

                {/* Стиль каруселі */}
                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.carousel.style')}:</label>
                  <div className="grid grid-cols-3 lg:grid-cols-2 gap-1 lg:gap-3">
                    {[
                      { value: 'classic', label: t('main.carousel.style.classic'), icon: '🎨', color: 'blue' },
                      { value: 'modern', label: t('main.carousel.style.modern'), icon: '✨', color: 'purple' },
                      { value: 'minimal', label: t('main.carousel.style.minimal'), icon: '⚪', color: 'gray' },
                      { value: 'premium', label: t('main.carousel.style.premium'), icon: '💎', color: 'yellow' },
                      { value: 'neon', label: t('main.carousel.style.neon'), icon: '🌟', color: 'cyan' },
                      { value: 'glass', label: t('main.carousel.style.glass'), icon: '🔮', color: 'indigo' },
                      { value: 'retro', label: t('main.carousel.style.retro'), icon: '🕒', color: 'orange' },
                      { value: 'elegant', label: t('main.carousel.style.elegant'), icon: '💃', color: 'rose' },
                      { value: 'tech', label: t('main.carousel.style.tech'), icon: '🤖', color: 'emerald' },
                      { value: 'organic', label: t('main.carousel.style.organic'), icon: '🌱', color: 'green' }
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => updateSettings({ carouselStyle: style.value as MainPageSettings['carouselStyle'] })}
                        className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-h-[32px] lg:min-h-[auto] touch-manipulation ${
                          settings.carouselStyle === style.value
                            ? `border-${style.color}-500 bg-${style.color}-100 text-${style.color}-700 shadow-sm lg:shadow-lg`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-lg">{style.icon}</div>
                        <div className="text-xs leading-none">{style.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Швидкість анімації */}
                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('main.carousel.animation.speed')}:</label>
                  <div className="grid grid-cols-3 gap-1 lg:gap-3">
                    {[
                      { value: 'slow', label: t('main.carousel.animation.slow'), icon: '🐌' },
                      { value: 'normal', label: t('main.carousel.animation.normal'), icon: '🚶' },
                      { value: 'fast', label: t('main.carousel.animation.fast'), icon: '🏃' }
                    ].map((speed) => (
                      <button
                        key={speed.value}
                        onClick={() => updateSettings({ animationSpeed: speed.value as MainPageSettings['animationSpeed'] })}
                        className={`px-1 py-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-h-[32px] lg:min-h-[auto] touch-manipulation ${
                          settings.animationSpeed === speed.value
                            ? 'border-purple-500 bg-purple-100 text-purple-700 shadow-sm lg:shadow-lg'
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-xs lg:text-lg">{speed.icon}</div>
                        <div className="text-xs leading-none">{speed.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Список елементів */}
                <div className="space-y-1 lg:space-y-3">
                  {(settings.carouselItems || []).map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-1.5 lg:p-4 border rounded-sm lg:rounded-xl cursor-pointer transition-all duration-300 ${
                        editingItem?.id === item.id
                          ? 'border-purple-500 bg-purple-50 shadow-sm lg:shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 bg-white/60 hover:bg-white/80'
                      }`}
                      onClick={() => setEditingItem(item)}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs lg:text-sm font-semibold text-slate-800 mb-0.5 lg:mb-1 truncate">{item.title}</h4>
                          <p className="text-xs lg:text-sm text-slate-600 line-clamp-2 break-words leading-tight lg:leading-relaxed">
                            {item.description.length > 60 ? `${item.description.substring(0, 60)}...` : item.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCarouselItem(item.id);
                          }}
                          className="text-red-500 hover:bg-red-50 p-1 lg:p-2 rounded-sm lg:rounded-lg transition-all duration-200 hover:text-red-600 text-xs lg:text-sm min-w-[24px] lg:min-w-[auto] flex-shrink-0 touch-manipulation"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Редагування елемента */}
              {editingItem && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                  <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                    <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs lg:text-lg">✏️</span>
                    </div>
                    <div>
                      <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.carousel.editing.title')}</h3>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.carousel.editing.description')}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 lg:space-y-5">
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-indigo-500 rounded-full"></span>
                        {t('main.carousel.editing.name')}
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => updateCarouselItem({ ...editingItem, title: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                        {t('main.carousel.editing.description.field')}
                      </label>
                      <textarea
                        value={editingItem.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 200) {
                            updateCarouselItem({ ...editingItem, description: e.target.value });
                          }
                        }}
                        rows={2}
                        maxLength={200}
                        placeholder="Введіть опис карточки (до 200 символів)"
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 resize-none text-xs lg:text-sm"
                      />
                      <div className="flex justify-between items-center mt-1 lg:mt-2">
                        <p className="text-xs text-slate-500">
                          Символів: {editingItem.description.length}/200
                        </p>
                        <p className="text-xs text-slate-400 hidden lg:block">
                          Короткий опис краще сприймається користувачами
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                        {t('main.carousel.editing.link')}
                      </label>
                      <input
                        type="text"
                        value={editingItem.url}
                        onChange={(e) => updateCarouselItem({ ...editingItem, url: e.target.value })}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                        {t('main.carousel.editing.image')}
                      </label>
                      <div className="flex gap-1 lg:gap-3">
                        <button
                          onClick={() => openMediaSelector('itemImage', ['image'])}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-sm lg:rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-sm lg:shadow-lg hover:shadow-md lg:hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                        >
                          📚 {t('common.select.from.media')}
                        </button>
                        {editingItem.imageUrl && (
                          <button
                            onClick={() => updateCarouselItem({ ...editingItem, imageUrl: '' })}
                            className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-2 lg:space-y-6">
              {/* 🎯 Конструктор позицій */}
                              <SimpleConstructorToggle onCloseAdminPanel={handleCloseAdminPanel} />

              {/* 🖼️ Логотип - MOBILE OPTIMIZED */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-amber-100 shadow-sm">
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
                  <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🖼️</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">Логотип</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Завантажити медіа</p>
                  </div>
                </div>
                
                <div className="flex gap-1.5 lg:gap-3">
                  <button
                    onClick={() => openMediaSelector('logo', ['image'])}
                    className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md lg:rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl min-h-[40px] lg:min-h-[auto] touch-manipulation text-xs lg:text-base"
                  >
                    📚 Вибрати з медіа-бібліотеки
                  </button>
                  {settings.logoUrl && (
                    <button
                      onClick={() => updateSettings({ logoUrl: '' })}
                      className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-md lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 min-h-[40px] lg:min-h-[auto] min-w-[40px] lg:min-w-[auto] touch-manipulation"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {settings.logoUrl && (
                  <div className="mt-2 lg:mt-4 p-2 lg:p-3 bg-white/60 rounded-xl border border-amber-100 space-y-3">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <img src={settings.logoUrl} alt="Логотип" className="w-8 h-8 lg:w-12 lg:h-12 object-contain rounded-lg border border-amber-200" />
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-slate-700">Логотип завантажено</p>
                        <p className="hidden lg:block text-xs text-slate-500">Відображається у верхній частині сторінки</p>
                      </div>
                    </div>
                    
                    {/* Контрол розміру логотипа */}
                    <div>
                      <label className="block text-xs lg:text-sm font-medium text-slate-700 mb-2">
                        Розмір логотипа: {settings.logoSize || 64}px
                      </label>
                      <input
                        type="range"
                        min="32"
                        max="200"
                        step="8"
                        value={settings.logoSize || 64}
                        onChange={(e) => updateSettings({ logoSize: parseInt(e.target.value) })}
                        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>32px</span>
                        <span>200px</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Кольорова схема */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-pink-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🎨</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.design.colors.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.design.colors.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-pink-500 rounded-full"></span>
                      {t('main.design.colors.brand')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <input
                        type="color"
                        value={settings.brandColor}
                        onChange={(e) => updateSettings({ brandColor: e.target.value })}
                        className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                      />
                      <input
                        type="text"
                        value={settings.brandColor}
                        onChange={(e) => updateSettings({ brandColor: e.target.value })}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                      {t('main.design.colors.accent')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => updateSettings({ accentColor: e.target.value })}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-slate-500 rounded-full"></span>
                      {t('main.design.colors.text')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <input
                        type="color"
                        value={settings.textColor}
                        onChange={(e) => updateSettings({ textColor: e.target.value })}
                        className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                      />
                      <input
                        type="text"
                        value={settings.textColor}
                        onChange={(e) => updateSettings({ textColor: e.target.value })}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ефекти */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">✨</span>
                  </div>
                  <div>
                                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.visual.effects')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.visual.effects.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-cyan-100">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-sm lg:text-2xl">✨</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('intro.particles')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.particles.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.showParticles}
                        onChange={(e) => updateSettings({ showParticles: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {settings.showParticles && (
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-500 rounded-full"></span>
                        {t('intro.particles.color')}
                      </label>
                      <div className="flex gap-1 lg:gap-3">
                        <input
                          type="color"
                          value={settings.particleColor}
                          onChange={(e) => updateSettings({ particleColor: e.target.value })}
                          className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.particleColor}
                          onChange={(e) => updateSettings({ particleColor: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                          placeholder={t('intro.particles.color')}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="space-y-2 lg:space-y-6">
              {/* Тип фону */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌅</span>
                  </div>
                  <div>
                                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('intro.background.title')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('intro.background.description')}</p>
                  </div>
                </div>

                <div className="mb-1.5 lg:mb-6">
                  <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-4">{t('intro.background.type')}</label>
                  <div className="grid grid-cols-2 gap-1 lg:gap-3">
                    {[
                                              { value: 'color', label: t('intro.background.types.color'), icon: '🎨', color: 'red' },
                        { value: 'gradient', label: t('intro.background.types.gradient'), icon: '🌈', color: 'orange' },
                        { value: 'image', label: t('intro.background.types.image'), icon: '🖼️', color: 'green' },
                        { value: 'video', label: t('intro.background.types.video'), icon: '🎬', color: 'blue' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => updateSettings({ backgroundType: type.value as MainPageSettings['backgroundType'] })}
                        className={`p-1.5 lg:p-3 rounded-sm lg:rounded-xl border transition-all duration-300 min-w-fit flex-1 min-h-[44px] lg:min-h-[auto] touch-manipulation ${
                          settings.backgroundType === type.value
                            ? `border-${type.color}-500 bg-${type.color}-100 text-${type.color}-700 shadow-lg scale-105`
                            : 'border-slate-200 hover:border-slate-300 bg-white/60'
                        }`}
                      >
                        <div className="text-sm lg:text-xl mb-0.5 lg:mb-1 text-center">{type.icon}</div>
                        <div className="text-xs lg:text-xs font-semibold text-center leading-tight">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Налаштування фону */}
                {settings.backgroundType === 'color' && (
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-500 rounded-full"></span>
                      {t('main.background.color')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <input
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                        className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                      />
                      <input
                        type="text"
                        value={settings.backgroundColor}
                        onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                      />
                    </div>
                  </div>
                )}

                {settings.backgroundType === 'gradient' && (
                  <div className="space-y-1.5 lg:space-y-5">
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-500 rounded-full"></span>
                        {t('main.background.gradient.from')}
                      </label>
                      <div className="flex gap-1 lg:gap-3">
                        <input
                          type="color"
                          value={settings.gradientFrom}
                          onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                          className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.gradientFrom}
                          onChange={(e) => updateSettings({ gradientFrom: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-yellow-500 rounded-full"></span>
                        {t('main.background.gradient.to')}
                      </label>
                      <div className="flex gap-1 lg:gap-3">
                        <input
                          type="color"
                          value={settings.gradientTo}
                          onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                          className="w-8 h-8 lg:w-16 lg:h-12 border border-slate-200 rounded-sm lg:rounded-xl cursor-pointer shadow-sm touch-manipulation"
                        />
                        <input
                          type="text"
                          value={settings.gradientTo}
                          onChange={(e) => updateSettings({ gradientTo: e.target.value })}
                          className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 text-slate-800 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settings.backgroundType === 'image' && (
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                      {t('intro.background.image.label')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <button
                        onClick={() => openMediaSelector('backgroundImage', ['image'])}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-sm lg:rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                      >
                        📚 {t('intro.select.from.media')}
                      </button>
                      {settings.backgroundImage && (
                        <button
                          onClick={() => updateSettings({ backgroundImage: '' })}
                          className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                        >
                          ✕
                        </button>
                      )}
                    </div>


                  </div>
                )}

                {settings.backgroundType === 'video' && (
                  <div>
                    <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                      <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                      {t('main.background.video')}
                    </label>
                    <div className="flex gap-1 lg:gap-3">
                      <button
                        onClick={() => openMediaSelector('backgroundVideo', ['video'])}
                        className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                      >
                        📚 {t('main.background.select.media')}
                      </button>
                      {settings.backgroundVideo && (
                        <button
                          onClick={() => updateSettings({ backgroundVideo: '' })}
                          className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {settings.backgroundVideo && (
                      <div className="mt-1 lg:mt-3 space-y-1 lg:space-y-3">
                        <div className="p-1.5 lg:p-3 bg-blue-50 rounded-sm lg:rounded-xl border border-blue-200">
                          <div className="flex items-center gap-1.5 lg:gap-3">
                            <div className="w-6 h-6 lg:w-12 lg:h-12 bg-blue-100 rounded-sm lg:rounded-lg border border-blue-300 flex items-center justify-center">
                              <span className="text-blue-600 text-xs lg:text-lg">🎬</span>
                            </div>
                            <div>
                              <p className="text-xs lg:text-sm font-medium text-blue-700">{t('main.background.video.loaded')}</p>
                              <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">{t('main.background.video.description')}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Діагностика відео */}
                        <VideoDebugger videoUrl={settings.backgroundVideo} />
                      </div>
                    )}

                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-2 lg:space-y-6">
              {/* Фонова музика */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-green-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🎵</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.audio.background.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.background.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-green-100">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-sm lg:text-2xl">🎵</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('main.audio.background.enable')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.background.autoplay.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.audioSettings.backgroundMusic.enabled}
                        onChange={(e) => updateSettings({ 
                          audioSettings: { 
                            ...settings.audioSettings, 
                            backgroundMusic: { 
                              ...settings.audioSettings.backgroundMusic, 
                              enabled: e.target.checked 
                            } 
                          } 
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  {settings.audioSettings.backgroundMusic.enabled && (
                    <div className="space-y-1.5 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                          {t('main.audio.file')}
                        </label>
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('backgroundMusic', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.backgroundMusic.url && (
                            <button
                              onClick={() => removeAudioFile('backgroundMusic', settings.audioSettings.backgroundMusic.fileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.backgroundMusic.url && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-green-50 rounded-sm lg:rounded-xl border border-green-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-green-100 rounded-sm lg:rounded-lg border border-green-300 flex items-center justify-center">
                                <span className="text-green-600 text-xs lg:text-lg">🎵</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-green-700">
                                  {settings.audioSettings.backgroundMusic.fileName || t('main.audio.background.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-green-600 hidden lg:block">{t('main.audio.background.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Гучність */}
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-500 rounded-full"></span>
                          {t('main.audio.volume')}: {Math.round(settings.audioSettings.backgroundMusic.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.audioSettings.backgroundMusic.volume}
                          onChange={(e) => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              backgroundMusic: { 
                                ...settings.audioSettings.backgroundMusic, 
                                volume: parseFloat(e.target.value) 
                              } 
                            } 
                          })}
                          className="w-full h-3 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                        />
                      </div>

                      {/* Додаткові налаштування */}
                      <div className="grid grid-cols-1 gap-1 lg:gap-4">
                        <label className="flex items-center gap-1 lg:gap-2 p-1.5 lg:p-3 bg-white/60 rounded-sm lg:rounded-xl border border-green-100 cursor-pointer hover:bg-white/80 transition-all min-h-[40px] lg:min-h-[auto] touch-manipulation">
                          <input
                            type="checkbox"
                            checked={settings.audioSettings.backgroundMusic.loop}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                backgroundMusic: { 
                                  ...settings.audioSettings.backgroundMusic, 
                                  loop: e.target.checked 
                                } 
                              } 
                            })}
                            className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-xs lg:text-sm font-medium text-slate-700">Повторювати</span>
                        </label>
                        <label className="flex items-center gap-1 lg:gap-2 p-1.5 lg:p-3 bg-white/60 rounded-sm lg:rounded-xl border border-green-100 cursor-pointer hover:bg-white/80 transition-all min-h-[40px] lg:min-h-[auto] touch-manipulation">
                          <input
                            type="checkbox"
                            checked={settings.audioSettings.backgroundMusic.autoPlay}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                backgroundMusic: { 
                                  ...settings.audioSettings.backgroundMusic, 
                                  autoPlay: e.target.checked 
                                } 
                              } 
                            })}
                            className="w-3 h-3 lg:w-4 lg:h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-xs lg:text-sm font-medium text-slate-700">Автозапуск</span>
                        </label>
                        {/* НОВА ГАЛОЧКА: Автозапуск після Welcome */}
                        <label className="flex items-center gap-1 lg:gap-2 p-1.5 lg:p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-sm lg:rounded-xl border border-purple-200 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all min-h-[40px] lg:min-h-[auto] touch-manipulation">
                          <input
                            type="checkbox"
                            checked={settings.audioSettings.backgroundMusic.autoStartAfterWelcome || false}
                            onChange={(e) => updateSettings({ 
                              audioSettings: { 
                                ...settings.audioSettings, 
                                backgroundMusic: { 
                                  ...settings.audioSettings.backgroundMusic, 
                                  autoStartAfterWelcome: e.target.checked 
                                } 
                              } 
                            })}
                            className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs lg:text-sm font-medium text-slate-700">🎵 Автозапуск після Welcome</span>
                            <span className="text-xs text-slate-500 hidden lg:block">Музика грає постійно після натискання кнопки Welcome</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Звуки наведення */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-blue-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">👆</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.audio.hover.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.hover.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-blue-100">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-sm lg:text-2xl">👆</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('main.audio.hover.enable')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.hover.cursor.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.audioSettings.hoverSounds.enabled}
                        onChange={(e) => updateSettings({ 
                          audioSettings: { 
                            ...settings.audioSettings, 
                            hoverSounds: { 
                              ...settings.audioSettings.hoverSounds, 
                              enabled: e.target.checked 
                            } 
                          } 
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  {settings.audioSettings.hoverSounds.enabled && (
                    <div className="space-y-1.5 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                          {t('main.audio.file')}
                        </label>
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('hoverSound', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.hoverSounds.url && (
                            <button
                              onClick={() => removeAudioFile('hoverSound', settings.audioSettings.hoverSounds.fileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.hoverSounds.url && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-blue-50 rounded-sm lg:rounded-xl border border-blue-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-blue-100 rounded-sm lg:rounded-lg border border-blue-300 flex items-center justify-center">
                                <span className="text-blue-600 text-xs lg:text-lg">👆</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-blue-700">
                                  {settings.audioSettings.hoverSounds.fileName || t('main.audio.hover.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">{t('main.audio.hover.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Гучність */}
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-500 rounded-full"></span>
                          {t('main.audio.volume')}: {Math.round(settings.audioSettings.hoverSounds.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.audioSettings.hoverSounds.volume}
                          onChange={(e) => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              hoverSounds: { 
                                ...settings.audioSettings.hoverSounds, 
                                volume: parseFloat(e.target.value) 
                              } 
                            } 
                          })}
                          className="w-full h-3 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Звуки кліків */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-purple-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">👆</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.audio.click.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.click.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-purple-100">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-sm lg:text-2xl">🖱️</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('main.audio.click.enable')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.click.press.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.audioSettings.clickSounds.enabled}
                        onChange={(e) => updateSettings({ 
                          audioSettings: { 
                            ...settings.audioSettings, 
                            clickSounds: { 
                              ...settings.audioSettings.clickSounds, 
                              enabled: e.target.checked 
                            } 
                          } 
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                    </label>
                  </div>

                  {settings.audioSettings.clickSounds.enabled && (
                    <div className="space-y-1.5 lg:space-y-4">
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                          {t('main.audio.file')}
                        </label>
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('clickSound', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.clickSounds.url && (
                            <button
                              onClick={() => removeAudioFile('clickSound', settings.audioSettings.clickSounds.fileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.clickSounds.url && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-purple-50 rounded-sm lg:rounded-xl border border-purple-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-purple-100 rounded-sm lg:rounded-lg border border-purple-300 flex items-center justify-center">
                                <span className="text-purple-600 text-xs lg:text-lg">👆</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-purple-700">
                                  {settings.audioSettings.clickSounds.fileName || t('main.audio.click.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-purple-600 hidden lg:block">{t('main.audio.click.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Гучність */}
                      <div>
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                          {t('main.audio.volume')}: {Math.round(settings.audioSettings.clickSounds.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.audioSettings.clickSounds.volume}
                          onChange={(e) => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              clickSounds: { 
                                ...settings.audioSettings.clickSounds, 
                                volume: parseFloat(e.target.value) 
                              } 
                            } 
                          })}
                          className="w-full h-3 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Звуки каруселі */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🎠</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.audio.carousel.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.carousel.description')}</p>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-5">
                  <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-1.5 lg:gap-3">
                      <span className="text-sm lg:text-2xl">🎵</span>
                      <div>
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('main.audio.carousel.enable')}</h4>
                        <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.audio.carousel.interaction.description')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                      <input
                        type="checkbox"
                        checked={settings.audioSettings.carouselSounds.enabled}
                        onChange={(e) => updateSettings({ 
                          audioSettings: { 
                            ...settings.audioSettings, 
                            carouselSounds: { 
                              ...settings.audioSettings.carouselSounds, 
                              enabled: e.target.checked 
                            } 
                          } 
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>

                  {settings.audioSettings.carouselSounds.enabled && (
                    <div className="space-y-1.5 lg:space-y-6">
                      {/* Звук переходу */}
                      <div className="bg-white/40 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-indigo-100">
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="text-sm lg:text-lg">🔄</span>
                          {t('main.audio.carousel.transition.title')}
                        </h4>
                        <p className="text-xs lg:text-sm text-slate-600 mb-1 lg:mb-4 hidden lg:block">{t('main.audio.carousel.transition.description')}</p>
                        
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('carouselTransition', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.carouselSounds.transitionUrl && (
                            <button
                              onClick={() => removeAudioFile('carouselTransition', settings.audioSettings.carouselSounds.transitionFileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.carouselSounds.transitionUrl && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-indigo-50 rounded-sm lg:rounded-xl border border-indigo-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-indigo-100 rounded-sm lg:rounded-lg border border-indigo-300 flex items-center justify-center">
                                <span className="text-indigo-600 text-xs lg:text-lg">🔄</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-indigo-700">
                                  {settings.audioSettings.carouselSounds.transitionFileName || t('main.audio.carousel.transition.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-indigo-600 hidden lg:block">{t('main.audio.carousel.transition.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Звук наведення на карточки */}
                      <div className="bg-white/40 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-indigo-100">
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="text-sm lg:text-lg">👆</span>
                          {t('main.audio.carousel.hover.title')}
                        </h4>
                        <p className="text-xs lg:text-sm text-slate-600 mb-1 lg:mb-4 hidden lg:block">{t('main.audio.carousel.hover.description')}</p>
                        
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('carouselHover', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.carouselSounds.hoverUrl && (
                            <button
                              onClick={() => removeAudioFile('carouselHover', settings.audioSettings.carouselSounds.hoverFileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.carouselSounds.hoverUrl && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-blue-50 rounded-sm lg:rounded-xl border border-blue-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-blue-100 rounded-sm lg:rounded-lg border border-blue-300 flex items-center justify-center">
                                <span className="text-blue-600 text-xs lg:text-lg">👆</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-blue-700">
                                  {settings.audioSettings.carouselSounds.hoverFileName || t('main.audio.carousel.hover.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-blue-600 hidden lg:block">{t('main.audio.carousel.hover.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Звук кліку на карточки */}
                      <div className="bg-white/40 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-indigo-100">
                        <h4 className="text-xs lg:text-base font-semibold text-slate-800 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="text-sm lg:text-lg">🎯</span>
                          {t('main.audio.carousel.click.title')}
                        </h4>
                        <p className="text-xs lg:text-sm text-slate-600 mb-1 lg:mb-4 hidden lg:block">{t('main.audio.carousel.click.description')}</p>
                        
                        <div className="flex gap-1 lg:gap-3 mb-1 lg:mb-3">
                          <button
                            onClick={() => openMediaSelector('carouselClick', ['audio'])}
                            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-sm lg:rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                          >
                            📚 {t('main.audio.select.media')}
                          </button>
                          {settings.audioSettings.carouselSounds.clickUrl && (
                            <button
                              onClick={() => removeAudioFile('carouselClick', settings.audioSettings.carouselSounds.clickFileName)}
                              className="px-2 py-2 lg:px-4 lg:py-3 text-red-600 hover:bg-red-50 rounded-sm lg:rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 text-xs lg:text-sm min-h-[36px] lg:min-h-[auto] touch-manipulation"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        
                        {/* Показуємо інформацію про обраний файл */}
                        {settings.audioSettings.carouselSounds.clickUrl && (
                          <div className="mt-1 lg:mt-3 p-1.5 lg:p-3 bg-purple-50 rounded-sm lg:rounded-xl border border-purple-200">
                            <div className="flex items-center gap-1.5 lg:gap-3">
                              <div className="w-6 h-6 lg:w-12 lg:h-12 bg-purple-100 rounded-sm lg:rounded-lg border border-purple-300 flex items-center justify-center">
                                <span className="text-purple-600 text-xs lg:text-lg">🎯</span>
                              </div>
                              <div>
                                <p className="text-xs lg:text-sm font-medium text-purple-700">
                                  {settings.audioSettings.carouselSounds.clickFileName || t('main.audio.carousel.click.loaded')}
                                </p>
                                <p className="text-xs lg:text-xs text-purple-600 hidden lg:block">{t('main.audio.carousel.click.will.play')}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Загальна гучність каруселі */}
                      <div className="bg-white/40 rounded-sm lg:rounded-xl p-1.5 lg:p-4 border border-indigo-100">
                        <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                          <span className="text-sm lg:text-lg">🔊</span>
                          {t('main.audio.carousel.volume')}: {Math.round(settings.audioSettings.carouselSounds.volume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={settings.audioSettings.carouselSounds.volume}
                          onChange={(e) => updateSettings({ 
                            audioSettings: { 
                              ...settings.audioSettings, 
                              carouselSounds: { 
                                ...settings.audioSettings.carouselSounds, 
                                volume: parseFloat(e.target.value) 
                              } 
                            } 
                          })}
                          className="w-full h-3 lg:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 3D TAB */}
          {activeTab === '3d' && (
            <div className="space-y-6">
              {/* 3D Анімації - Spline */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-md lg:rounded-2xl p-1.5 lg:p-6 border border-cyan-100 shadow-sm">
                <div className="flex items-center gap-1 lg:gap-3 mb-1.5 lg:mb-6">
                  <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-sm lg:rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs lg:text-lg">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-lg font-bold text-slate-800">{t('main.3d.title')}</h3>
                    <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.3d.description')}</p>
                  </div>
                </div>

                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-sm lg:rounded-xl border border-cyan-100 mb-1.5 lg:mb-6">
                  <div className="flex items-center gap-1.5 lg:gap-3">
                    <span className="text-sm lg:text-2xl">🌐</span>
                    <div>
                      <h4 className="text-xs lg:text-base font-semibold text-slate-800">{t('main.3d.enable')}</h4>
                      <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{t('main.3d.enable.description')}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                    <input
                      type="checkbox"
                      checked={settings.splineSettings.enabled}
                      onChange={(e) => {
                        console.log('🌐 Spline enabled перемикнуто:', e.target.checked);
                        updateSettings({ 
                          splineSettings: { 
                            ...settings.splineSettings, 
                            enabled: e.target.checked 
                          } 
                        });
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 lg:w-11 lg:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 lg:peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 lg:after:h-5 lg:after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>

                {settings.splineSettings.enabled && (
                  <div className="space-y-1.5 lg:space-y-5">
                    {/* Scene URL Input */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-cyan-500 rounded-full"></span>
                        {t('main.3d.scene.url')}
                      </label>
                      <input
                        type="url"
                        value={settings.splineSettings.sceneUrl}
                        onChange={(e) => {
                          console.log('🌐 Spline URL змінено:', e.target.value);
                          updateSettings({ 
                            splineSettings: { 
                              ...settings.splineSettings, 
                              sceneUrl: e.target.value 
                            } 
                          });
                        }}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 text-xs lg:text-base min-h-[36px] lg:min-h-[auto] touch-manipulation"
                        placeholder="https://my.spline.design/your-scene"
                      />
                      <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('main.3d.scene.url.tip')}
                      </p>
                    </div>

                    {/* Embed Code Input */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-teal-500 rounded-full"></span>
                        {t('main.3d.embed.code')}
                      </label>
                      <textarea
                        value={settings.splineSettings.embedCode}
                        onChange={(e) => updateSettings({ 
                          splineSettings: { 
                            ...settings.splineSettings, 
                            embedCode: e.target.value 
                          } 
                        })}
                        rows={2}
                        className="w-full px-2 py-2 lg:px-4 lg:py-3 bg-white/80 border border-slate-200 rounded-sm lg:rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400 resize-none font-mono text-xs lg:text-sm min-h-[60px] lg:min-h-[auto] touch-manipulation"
                        placeholder="<iframe src='...' ...></iframe>"
                      />
                      <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('main.3d.embed.tip')}
                      </p>
                    </div>

                    {/* Local File Input */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3 flex items-center gap-1 lg:gap-2">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-purple-500 rounded-full"></span>
                        {t('main.3d.local.file')}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".spline,.json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Створюємо локальний URL для файлу
                              const localUrl = URL.createObjectURL(file);
                              updateSettings({ 
                                splineSettings: { 
                                  ...settings.splineSettings, 
                                  localFile: localUrl,
                                  method: 'local'
                                } 
                              });
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="spline-file-input-main"
                        />
                        <label
                          htmlFor="spline-file-input-main"
                          className="flex items-center justify-center w-full px-2 py-2 lg:px-4 lg:py-3 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-dashed border-purple-300 rounded-sm lg:rounded-xl hover:from-purple-100 hover:to-indigo-100 hover:border-purple-400 transition-all duration-200 cursor-pointer group min-h-[40px] lg:min-h-[auto] touch-manipulation"
                        >
                          <div className="flex items-center gap-1.5 lg:gap-3">
                            <div className="w-5 h-5 lg:w-8 lg:h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-sm lg:rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-white text-xs lg:text-sm">📁</span>
                            </div>
                            <div className="text-center">
                              <p className="text-xs lg:text-sm font-semibold text-slate-700">{t('main.3d.local.select')}</p>
                              <p className="text-xs lg:text-xs text-slate-500 hidden lg:block">{t('main.3d.local.drag')}</p>
                            </div>
                          </div>
                        </label>
                      </div>
                      <p className="text-xs lg:text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">
                        {t('main.3d.local.tip')}
                      </p>
                    </div>

                    {/* Position Selection */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">{t('main.3d.position')}</label>
                      <div className="grid grid-cols-3 gap-1 lg:gap-3">
                        {[
                          { value: 'background', label: t('main.3d.position.background'), icon: '🖼️', desc: t('main.3d.position.background.desc') },
                          { value: 'overlay', label: t('main.3d.position.overlay'), icon: '📱', desc: t('main.3d.position.overlay.desc') },
                          { value: 'foreground', label: t('main.3d.position.foreground'), icon: '🎯', desc: t('main.3d.position.foreground.desc') }
                        ].map((pos) => (
                          <button
                            key={pos.value}
                            onClick={() => {
                              console.log('🌐 Position змінено на:', pos.value);
                              updateSettings({ 
                                splineSettings: { 
                                  ...settings.splineSettings, 
                                  position: pos.value as any 
                                } 
                              });
                            }}
                            className={`p-1.5 lg:p-3 rounded-sm lg:rounded-xl border-2 transition-all duration-200 text-center min-h-[50px] lg:min-h-[auto] touch-manipulation ${
                              settings.splineSettings.position === pos.value
                                ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                : 'border-slate-200 bg-white hover:border-cyan-300 text-slate-600'
                            }`}
                          >
                            <div className="text-sm lg:text-lg mb-0.5 lg:mb-1">{pos.icon}</div>
                            <div className="text-xs lg:text-xs font-semibold">{pos.label}</div>
                            <div className="text-xs lg:text-xs text-slate-500 mt-0.5 lg:mt-1 hidden lg:block">{pos.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Opacity Control */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                        {t('main.3d.opacity')}: {Math.round(settings.splineSettings.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.splineSettings.opacity}
                        onChange={(e) => updateSettings({ 
                          splineSettings: { 
                            ...settings.splineSettings, 
                            opacity: parseFloat(e.target.value) 
                          } 
                        })}
                        className="w-full h-3 lg:h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                      />
                    </div>

                    {/* Scale Control */}
                    <div className="group">
                      <label className="block text-xs lg:text-sm font-semibold text-slate-700 mb-1 lg:mb-3">
                        {t('main.3d.scale')}: {Math.round(settings.splineSettings.scale * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.splineSettings.scale}
                        onChange={(e) => updateSettings({ 
                          splineSettings: { 
                            ...settings.splineSettings, 
                            scale: parseFloat(e.target.value) 
                          } 
                        })}
                        className="w-full h-3 lg:h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                      />
                    </div>

                    {/* Additional Options */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 lg:gap-4">
                      <div className="flex items-center justify-between p-1.5 lg:p-3 bg-white/60 rounded-sm lg:rounded-xl border border-cyan-100">
                        <div>
                          <h5 className="text-xs lg:text-base font-medium text-slate-800">{t('main.3d.autoplay')}</h5>
                          <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('main.3d.autoplay.description')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                          <input
                            type="checkbox"
                            checked={settings.splineSettings.autoplay}
                            onChange={(e) => updateSettings({ 
                              splineSettings: { 
                                ...settings.splineSettings, 
                                autoplay: e.target.checked 
                              } 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-1 lg:peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-1.5 lg:p-3 bg-white/60 rounded-sm lg:rounded-xl border border-cyan-100">
                        <div>
                          <h5 className="text-xs lg:text-base font-medium text-slate-800">{t('main.3d.controls')}</h5>
                          <p className="text-xs lg:text-xs text-slate-600 hidden lg:block">{t('main.3d.controls.description')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer touch-manipulation">
                          <input
                            type="checkbox"
                            checked={settings.splineSettings.controls}
                            onChange={(e) => updateSettings({ 
                              splineSettings: { 
                                ...settings.splineSettings, 
                                controls: e.target.checked 
                              } 
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 lg:w-9 lg:h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-1 lg:peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 lg:after:h-4 lg:after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                      </div>
                    </div>

                    {/* Preview Info */}
                    {(settings.splineSettings.sceneUrl || settings.splineSettings.embedCode) && (
                      <div className="mt-1 lg:mt-4 p-1.5 lg:p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-sm lg:rounded-xl border border-cyan-200">
                        <div className="flex items-center gap-1.5 lg:gap-3">
                          <div className="w-6 h-6 lg:w-12 lg:h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-sm lg:rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm lg:text-xl">🌐</span>
                          </div>
                          <div>
                            <h4 className="text-xs lg:text-base font-semibold text-slate-800 mb-0.5 lg:mb-1">{t('main.3d.active')}</h4>
                            <p className="text-xs lg:text-sm text-slate-600">
                              {t('main.3d.status').replace('{position}', settings.splineSettings.position).replace('{opacity}', Math.round(settings.splineSettings.opacity * 100).toString()).replace('{scale}', Math.round(settings.splineSettings.scale * 100).toString())}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}


        </div>

        {/* Modern Actions */}
        <div className="p-2 lg:p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="space-y-2 lg:space-y-4">
            <div className="flex gap-1.5 lg:gap-3">
              <button
                onClick={saveSettings}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform lg:hover:scale-105 lg:hover:-translate-y-0.5 lg:active:scale-102 lg:active:translate-y-0 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-base min-h-[44px] touch-manipulation"
              >
                <span className="text-sm lg:text-base">💾</span>
                <span>{t('main.actions.save')}</span>
              </button>
            </div>

            {/* Індикатор синхронізації */}
            <SyncButton className="w-full" />
            

          </div>
        </div>
      </div>

      {/* Preview Area - Hidden on Mobile */}
      <div className="hidden lg:flex flex-1 bg-slate-100 p-8">
        <div className="h-full flex flex-col">
          {/* Device selector */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {t('main.preview.title')} 
                <span className="text-lg font-normal text-slate-500 ml-3">
                                      ({previewActiveIndex + 1} {t('main.preview.of')} {settings.carouselItems?.length || 0})
                </span>
              </h3>
              <p className="text-slate-600">
                {t('main.preview.navigation')}
              </p>
            </div>
            <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
              {[
                { type: 'mobile' as DeviceType, icon: '📱', label: t('main.responsive.device.mobile') },
                { type: 'tablet' as DeviceType, icon: '📱', label: t('main.responsive.device.tablet') },
                { type: 'desktop' as DeviceType, icon: '💻', label: t('main.responsive.device.desktop') }
              ].map((device) => (
                <button
                  key={device.type}
                  onClick={() => setDeviceType(device.type)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    deviceType === device.type
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/60'
                  }`}
                >
                  {device.icon} {device.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview container */}
          <div className="flex-1 flex items-center justify-center">
            <div 
              className={`${getDeviceClasses()} bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-white/20`}
              style={{ 
                maxHeight: '65vh',
                minHeight: '500px',
                aspectRatio: deviceType === 'mobile' ? '9/16' : deviceType === 'tablet' ? '4/3' : '16/9'
              }}
            >
              {/* Preview content */}
              <div className="w-full h-full relative overflow-hidden">
                <div 
                  className="w-full h-full relative"
                  style={{
                    ...getBackgroundStyle(),
                    transform: `scale(${deviceType === 'mobile' ? '0.3' : deviceType === 'tablet' ? '0.5' : '0.6'}) translate(-50%, -50%)`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: deviceType === 'mobile' ? '333%' : deviceType === 'tablet' ? '200%' : '167%',
                    height: deviceType === 'mobile' ? '333%' : deviceType === 'tablet' ? '200%' : '167%'
                  }}
                >
                {/* Background video */}
                {settings.backgroundType === 'video' && settings.backgroundVideo && (
                  <video
                    ref={(video) => {
                      if (video) {
                        // Спробуємо запустити відео з обробкою помилок
                        const playVideo = async () => {
                          try {
                            await video.play();
                            console.log('✅ MainPageCustomizer: Попередній перегляд відео запущено');
                          } catch (error) {
                            console.log('⚠️ MainPageCustomizer: Автозапуск відео заблоковано:', error);
                          }
                        };
                        
                        // Запускаємо відео після завантаження
                        if (video.readyState >= 3) {
                          playVideo();
                        } else {
                          video.addEventListener('canplay', playVideo, { once: true });
                        }
                      }
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: 'brightness(0.8)', // Трохи затемнюємо для кращої читабельності
                    }}
                    onError={(e) => {
                      console.error('❌ MainPageCustomizer: Помилка завантаження відео в попередньому перегляді:', e);
                    }}
                    onLoadStart={() => {
                      console.log('🔄 MainPageCustomizer: Початок завантаження відео в попередньому перегляді');
                    }}
                    onLoadedData={() => {
                      console.log('✅ MainPageCustomizer: Відео завантажено в попередньому перегляді');
                    }}
                  >
                    {/* Визначаємо формат відео та завантажуємо тільки відповідний */}
                    {(() => {
                      const videoUrl = settings.backgroundVideo;
                      const getVideoType = (url: string) => {
                        if (url.includes('.mp4') || url.includes('video/mp4')) return 'video/mp4';
                        if (url.includes('.webm') || url.includes('video/webm')) return 'video/webm';
                        if (url.includes('.ogg') || url.includes('.ogv') || url.includes('video/ogg')) return 'video/ogg';
                        // За замовчуванням припускаємо mp4
                        return 'video/mp4';
                      };
                      
                      const videoType = getVideoType(videoUrl);
                      console.log('🎬 MainPageCustomizer: Визначено тип відео:', videoType, 'для URL:', videoUrl);
                      
                      return <source src={videoUrl} type={videoType} />;
                    })()}
                    {/* Fallback для попереднього перегляду */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white text-sm">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🎬</div>
                        <p>Відео недоступне</p>
                      </div>
                    </div>
                  </video>
                )}

                {/* 3D Анімація Spline */}
                {settings.splineSettings.enabled && (
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

                {/* Particles */}
                {settings.showParticles && (
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{ backgroundColor: settings.particleColor }}
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

                {/* Header */}
                <div className="absolute top-6 left-0 right-0 flex justify-center px-6 z-20">
                  <div className="flex items-center gap-4">
                    {/* Логотип - тільки якщо є URL з конструктора */}
                    {settings.logoUrl && (
                      <div className="flex items-center justify-center">
                        <img 
                          src={settings.logoUrl} 
                          alt="Logo" 
                          className="object-contain" 
                          style={{
                            width: `${(settings.logoSize || 64) * 0.5}px`,
                            height: `${(settings.logoSize || 64) * 0.5}px`,
                            maxWidth: '100px',
                            maxHeight: '100px'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="relative z-10 h-full flex flex-col items-center justify-center text-center"
                  style={{
                    padding: `${settings[deviceType].headerContainerPadding}px`,
                    marginTop: `${settings[deviceType].headerContainerMarginTop}px`,
                    marginBottom: `${settings[deviceType].headerContainerMarginBottom}px`
                  }}
                >
                  {/* Title */}
                  <motion.h1
                    key={getPreviewElementKey('title')}
                    className="font-bold mb-6"
                    style={getPreviewTextStyle('title')}
                    {...getPreviewAnimationVariants('title')}
                  >
                    <span className="font-light block">{settings.headerTitle}</span>
                  </motion.h1>

                  <motion.h2
                    key={getPreviewElementKey('subtitle')}
                    className="font-bold mb-6"
                    style={getPreviewTextStyle('subtitle')}
                    {...getPreviewAnimationVariants('subtitle')}
                  >
                    <span className="font-bold block">{settings.headerSubtitle}</span>
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    key={getPreviewElementKey('description')}
                    className="mb-12 max-w-3xl opacity-90"
                    style={getPreviewTextStyle('description')}
                    {...getPreviewAnimationVariants('description')}
                  >
                    {settings.headerDescription}
                  </motion.p>

                  {/* Carousel Preview */}
                  <motion.div
                    className="w-full max-w-5xl h-80 relative flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{ perspective: deviceType === 'mobile' ? '500px' : deviceType === 'tablet' ? '700px' : '1000px' }}
                  >
                    {/* Mini 3D Carousel */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {(settings.carouselItems || []).map((item, index) => {
                        const isActive = index === previewActiveIndex;
                        const isExpanded = previewExpandedCard === index;
                        const relativePosition = index - previewActiveIndex;
                        const carouselLength = settings.carouselItems?.length || 0;
                        
                        // Нормалізуємо позицію для циклічного відображення
                        let normalizedPosition = relativePosition;
                        if (normalizedPosition > carouselLength / 2) {
                          normalizedPosition -= carouselLength;
                        } else if (normalizedPosition < -carouselLength / 2) {
                          normalizedPosition += carouselLength;
                        }
                        
                        let transform = 'translateZ(0) scale(1)';
                        let opacity = 1;
                        let zIndex = 10;
                        let visible = true;
                        
                        // Адаптивні розміри та позиції
                        const cardWidth = deviceType === 'mobile' ? 'w-24' : deviceType === 'tablet' ? 'w-32' : 'w-40';
                        const cardHeight = deviceType === 'mobile' ? 'h-32' : deviceType === 'tablet' ? 'h-40' : 'h-52';
                        const spacing = deviceType === 'mobile' ? 100 : deviceType === 'tablet' ? 130 : 160;
                        const farSpacing = deviceType === 'mobile' ? 200 : deviceType === 'tablet' ? 260 : 320;
                        
                        // Швидкість анімації
                        const animationDuration = settings.animationSpeed === 'slow' ? '800ms' : 
                                                settings.animationSpeed === 'fast' ? '300ms' : '500ms';
                        
                        if (normalizedPosition === 0) {
                          // Центральний активний елемент
                          transform = `translateX(0) translateZ(${deviceType === 'mobile' ? '30px' : '40px'}) scale(1)`;
                          opacity = 1;
                          zIndex = 10;
                        } else if (normalizedPosition === 1) {
                          // Перший елемент праворуч
                          transform = `translateX(${spacing}px) translateZ(-20px) scale(0.85) rotateY(-15deg)`;
                          opacity = 0.8;
                          zIndex = 9;
                        } else if (normalizedPosition === -1) {
                          // Перший елемент ліворуч
                          transform = `translateX(-${spacing}px) translateZ(-20px) scale(0.85) rotateY(15deg)`;
                          opacity = 0.8;
                          zIndex = 9;
                        } else if (normalizedPosition === 2 && deviceType !== 'mobile') {
                          // Другий елемент праворуч (тільки для планшета і десктопа)
                          transform = `translateX(${farSpacing}px) translateZ(-40px) scale(0.7) rotateY(-25deg)`;
                          opacity = 0.6;
                          zIndex = 8;
                        } else if (normalizedPosition === -2 && deviceType !== 'mobile') {
                          // Другий елемент ліворуч (тільки для планшета і десктопа)
                          transform = `translateX(-${farSpacing}px) translateZ(-40px) scale(0.7) rotateY(25deg)`;
                          opacity = 0.6;
                          zIndex = 8;
                        } else {
                          // Приховуємо елементи що не поміщаються
                          visible = false;
                        }
                        
                        if (!visible) return null;
                        
                        return (
                          <div
                            key={item.id}
                            className={`absolute ${cardWidth} ${cardHeight} ease-out cursor-pointer`}
                            style={{
                              transform: `translate(-50%, -50%) ${transform}`,
                              opacity,
                              zIndex,
                              left: '50%',
                              top: '50%',
                              transformStyle: 'preserve-3d',
                              transition: `all ${animationDuration} ease-out`
                            }}
                            onClick={() => handlePreviewItemClick(index)}
                          >
                            <div 
                              className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20"
                              style={getCarouselCardStyles(isActive)}
                            >
                              {/* Фонове зображення */}
                              {item.imageUrl && (
                                <div 
                                  className="absolute inset-0 w-full h-full"
                                  style={{
                                    backgroundImage: `url(${item.imageUrl})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                />
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                              
                              {/* Завжди видимий заголовок */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className={`font-bold mb-2 truncate ${deviceType === 'mobile' ? 'text-sm' : 'text-base'}`}>
                                  {item.title}
                                </h3>
                                
                                {/* Кнопка деталей для активної карточки */}
                                {isActive && !isExpanded && deviceType !== 'mobile' && (
                                  <button 
                                    className="flex items-center text-sm text-white/80 hover:text-white transition-all duration-200 hover:scale-105"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewExpandedCard(index);
                                    }}
                                  >
                                    <span>Деталі</span>
                                    <span className="ml-2">▼</span>
                                  </button>
                                )}
                              </div>
                              
                              {/* Розгорнуті деталі */}
                              {isExpanded && (
                                <div 
                                  className="absolute inset-0 flex flex-col justify-end"
                                  style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4))',
                                  }}
                                >
                                  <div className="p-4 text-white">
                                    <h3 className="text-base font-bold mb-3">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed mb-4 text-white/90 line-clamp-3">
                                      {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Відкриваємо посилання в новій вкладці
                                          if (item.url && item.url !== '#') {
                                            window.open(item.url, '_blank');
                                          }
                                        }}
                                        className="inline-flex items-center justify-center rounded-full text-white font-semibold 
                                               py-2 px-4 text-sm transition-all hover:scale-105 shadow-lg"
                                        style={getCarouselPreviewStyles()}
                                      >
                                        <span className="font-semibold">
                                          {item.title === "LINKCORE" ? "Переглянути" :
                                           item.title === "CASEMACHINE" ? "Приклади" :
                                           item.title === "BOOKME" ? "Бронювати" :
                                           item.title === "ADLAND" ? "Запустити" :
                                           item.title === "SELLKIT" ? "Магазин" : "Дізнатися"}
                                        </span>
                                        <span className="ml-2">↗</span>
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewExpandedCard(null);
                                        }}
                                        className="text-white/60 hover:text-white transition-all duration-200 p-2 hover:bg-white/10 rounded-lg"
                                      >
                                        <span className="text-sm rotate-180">▼</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Navigation arrows for preview - тепер інтерактивні */}
                    <div className={`absolute ${deviceType === 'mobile' ? 'left-4' : 'left-6'} top-1/2 transform -translate-y-1/2 z-20`}>
                      <button 
                        onClick={goToPrevPreview}
                        className={`${deviceType === 'mobile' ? 'w-8 h-8' : 'w-12 h-12'} rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg backdrop-blur-sm border border-white/20`}
                        style={getCarouselPreviewStyles()}
                      >
                        <span className={`text-white ${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold`}>‹</span>
                      </button>
                    </div>
                    <div className={`absolute ${deviceType === 'mobile' ? 'right-4' : 'right-6'} top-1/2 transform -translate-y-1/2 z-20`}>
                      <button 
                        onClick={goToNextPreview}
                        className={`${deviceType === 'mobile' ? 'w-8 h-8' : 'w-12 h-12'} rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-lg backdrop-blur-sm border border-white/20`}
                        style={getCarouselPreviewStyles()}
                      >
                        <span className={`text-white ${deviceType === 'mobile' ? 'text-lg' : 'text-xl'} font-bold`}>›</span>
                      </button>
                    </div>
                    
                    {/* Dots indicator - тепер інтерактивні */}
                    <div className={`absolute ${deviceType === 'mobile' ? 'bottom-4' : 'bottom-6'} left-1/2 transform -translate-x-1/2 z-20`}>
                      <div className="flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                        {(settings.carouselItems || []).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setPreviewActiveIndex(index);
                              setPreviewExpandedCard(null);
                            }}
                            className={`${deviceType === 'mobile' ? 'w-2 h-2' : 'w-3 h-3'} rounded-full transition-all cursor-pointer hover:scale-125 ${
                              index === previewActiveIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/50 hover:bg-white/70'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Background music - ЗАКОМЕНТОВАНО щоб уникнути конфліктів з головною сторінкою */}
                {/* {settings.audioSettings.backgroundMusic.enabled && settings.audioSettings.backgroundMusic.url && (
                  <audio autoPlay={settings.audioSettings.backgroundMusic.autoPlay} loop={settings.audioSettings.backgroundMusic.loop} className="hidden">
                    <source src={settings.audioSettings.backgroundMusic.url} type="audio/mpeg" />
                  </audio>
                )} */}
                </div>
                
                {/* Overlay to prevent interaction */}
                <div className="absolute inset-0 bg-transparent pointer-events-none z-30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MediaSelector */}
      <MediaSelector
        isOpen={isMediaSelectorOpen}
        onClose={() => setIsMediaSelectorOpen(false)}
        onSelect={handleMediaSelect}
        allowedTypes={
          mediaSelectorType === 'backgroundImage' ? ['image'] :
          mediaSelectorType === 'backgroundVideo' ? ['video'] :
          mediaSelectorType === 'logo' ? ['image'] :
          mediaSelectorType === 'itemImage' ? ['image'] :
          ['audio']
        }
        title={
          mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.title') :
          mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.title') :
          mediaSelectorType === 'logo' ? t('media.selector.logo.title') :
          mediaSelectorType === 'itemImage' ? t('media.selector.title') :
          mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.title') :
          mediaSelectorType === 'hoverSound' ? t('media.selector.hover.sound.title') :
          mediaSelectorType === 'clickSound' ? t('media.selector.click.sound.title') :
          t('media.selector.title')
        }
        description={
          mediaSelectorType === 'backgroundImage' ? t('media.selector.background.image.description') :
          mediaSelectorType === 'backgroundVideo' ? t('media.selector.background.video.description') :
          mediaSelectorType === 'logo' ? t('media.selector.logo.description') :
          mediaSelectorType === 'itemImage' ? t('media.selector.description') :
          mediaSelectorType === 'backgroundMusic' ? t('media.selector.background.music.description') :
          mediaSelectorType === 'hoverSound' ? t('media.selector.hover.sound.description') :
          mediaSelectorType === 'clickSound' ? t('media.selector.click.sound.description') :
          t('media.selector.description')
        }
      />
    </div>
    </>
  );
};

export default MainPageCustomizer; 