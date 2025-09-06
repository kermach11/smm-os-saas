import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useResponsiveBox } from '../hooks/useResponsive';
import { MainScreenBoxes } from '../config/responsiveConfig';
import Carousel3D from './Carousel3D';
import { DraggableBox } from './DraggableBox';
import ConstructorWrapper from './ConstructorWrapper';

// Базовий інтерфейс для всіх боксів
interface BaseBoxProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Утилітарна функція для створення адаптивного боксу з drag & drop
const createResponsiveBox = (boxName: keyof MainScreenBoxes) => {
  const ResponsiveBox: React.FC<BaseBoxProps> = ({
    children,
    className = '',
    style = {},
    onClick,
    onMouseEnter,
    onMouseLeave
  }) => {
    const { 
      boxStyles, 
      boxClasses, 
      getAnimation,
      deviceType,
      boxConfig
    } = useResponsiveBox(boxName);



    const animation = getAnimation();
    
    // Об'єднуємо стилі з пріоритетом для наших стилів
    const finalStyles = { 
      ...boxStyles, 
      ...style,
      // Явно застосовуємо критичні стилі для центрування
      ...(boxName === 'logoBox' && {
        position: 'absolute',
        top: boxConfig.position.top,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: boxConfig.position.zIndex || 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        height: 'fit-content',
        margin: '0',
        padding: '0'
      })
    };
    
    const finalClasses = `${boxClasses} ${className}`.trim();

    return (
      <DraggableBox
        boxName={boxName}
        deviceType={deviceType}
        className={finalClasses}
        style={finalStyles}
        originalStyle={boxStyles}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <motion.div
          initial={animation.initial}
          animate={animation.animate}
          transition={animation.transition}
          whileHover={animation.hover}
          whileTap={animation.tap}
        >
          {children}
        </motion.div>
      </DraggableBox>
    );
  };

  return ResponsiveBox;
};

// БОКС 1: Логотип/Header Box
export const LogoBox = createResponsiveBox('logoBox');

// БОКС 2: Sound Toggle Box
export const SoundToggleBox = createResponsiveBox('soundToggleBox');

// БОКС 3: Header Text Box
export const HeaderTextBox = createResponsiveBox('headerTextBox');

// БОКС 4: Carousel Box
export const CarouselBox = createResponsiveBox('carouselBox');

// БОКС 5: Pagination Box
export const PaginationBox = createResponsiveBox('paginationBox');

// БОКС 6: Admin Button Box
export const AdminButtonBox = createResponsiveBox('adminButtonBox');

// БОКС 7: Admin Panel Box
export const AdminPanelBox = createResponsiveBox('adminPanelBox');

// Спеціалізовані компоненти з додатковою логікою

// Логотип компонент з додатковими можливостями
interface LogoBoxProps extends Omit<BaseBoxProps, 'children'> {
  logoUrl?: string;
  logoSize?: number;
  showFallback?: boolean;
  fallbackContent?: ReactNode;
  children?: ReactNode; // Опційні children для логотипа
}

export const SmartLogoBox: React.FC<LogoBoxProps> = ({
  logoUrl,
  logoSize,
  showFallback = true,
  fallbackContent,
  className = '',
  ...props
}) => {
  const { 
    boxConfig, 
    boxStyles, 
    boxClasses, 
    deviceType 
  } = useResponsiveBox('logoBox');
  
  const actualLogoSize = logoSize || 48; // fallback size



  return (
    <ConstructorWrapper
      boxName="logoBox"
      deviceType={deviceType}
      className={`${boxClasses} ${className}`}
      style={boxStyles}
    >
      {logoUrl ? (
        <motion.div
          className="flex items-center justify-center cursor-pointer select-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          {...props}
        >
          <img
            src={logoUrl}
            alt="Logo"
            className="object-contain transition-all duration-300"
            style={{
              width: `${actualLogoSize}px`,
              height: `${actualLogoSize}px`,
              maxWidth: '200px',
              maxHeight: '200px'
            }}
            onError={(e) => {
              console.error('❌ Logo loading error:', logoUrl);
              if (showFallback) {
                e.currentTarget.style.display = 'none';
              }
            }}
          />
        </motion.div>
      ) : null}
    </ConstructorWrapper>
  );
};

// Типи для carousel налаштувань
type CarouselSettings = {
  carouselStyle: 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic';
  animationSpeed: 'slow' | 'normal' | 'fast';
  showParticles: boolean;
  particleColor: string;
  brandColor: string;
  accentColor: string;
};

// Типи для адмін панелі
type DeviceSettings = {
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

type AdaptiveSettings = {
  mobile: DeviceSettings;
  tablet: DeviceSettings;
  desktop: DeviceSettings;
};

type HeaderTextSettings = {
  // Розміри шрифтів
  headerTitleFontSize: number;
  headerSubtitleFontSize: number;
  headerDescriptionFontSize: number;
  // Типи шрифтів
  headerTitleFontFamily: string;
  headerSubtitleFontFamily: string;
  headerDescriptionFontFamily: string;
  // Товщина та стиль шрифтів
  headerTitleFontWeight: number;
  headerSubtitleFontWeight: number;
  headerDescriptionFontWeight: number;
  headerTitleFontStyle: string;
  headerSubtitleFontStyle: string;
  headerDescriptionFontStyle: string;
  // Анімації появи
  headerTitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  headerSubtitleAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  headerDescriptionAnimation: 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'zoomOut' | 'rotateIn' | 'bounce' | 'typewriter' | 'glow';
  // Анімації зникання
  headerTitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  headerSubtitleExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  headerDescriptionExitAnimation: 'none' | 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'zoomIn' | 'rotateOut' | 'dissolve';
  // Тайминги анімацій
  headerAnimationDuration: number;
  headerAnimationDelay: number;
  // 3D ефекти
  headerTitle3DDepth: number;
  headerSubtitle3DDepth: number;
  headerDescription3DDepth: number;
  // Інтенсивність тіней
  headerTitleShadowIntensity: number;
  headerSubtitleShadowIntensity: number;
  headerDescriptionShadowIntensity: number;
  // Кольори тіней
  headerTitleShadowColor: string;
  headerSubtitleShadowColor: string;
  headerDescriptionShadowColor: string;
  [key: string]: any; // для інших налаштувань
};

// Carousel компонент з адаптивними налаштуваннями
interface CarouselBoxProps extends Omit<BaseBoxProps, 'children'> {
  items: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
    videoUrl?: string;
  }>;
  carouselSettings?: CarouselSettings;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  onSelectItem?: (item: any) => void;
  onActiveIndexChange?: (index: number) => void;
  onHoverSound?: () => void;
  onClickSound?: () => void;
  onTransitionSound?: () => void;
}

// Header Text компонент з адаптивним текстом
interface HeaderTextBoxProps extends Omit<BaseBoxProps, 'children'> {
  title?: string;
  subtitle?: string;
  description?: string;
  // Нові пропси для інтеграції з адмін панеллю
  adaptiveSettings?: AdaptiveSettings;
  headerTextSettings?: HeaderTextSettings;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  titleProps?: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  };
  subtitleProps?: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  };
  descriptionProps?: {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
  };
  children?: ReactNode; // Опційні children для header text
  onMouseEnter?: () => void; // Обробник для hover звуків
}

export const SmartHeaderTextBox: React.FC<HeaderTextBoxProps> = ({
  title = "Усе що треба",
  subtitle = "для твого SMM",
  description = "Професійні інструменти в одному місці",
  adaptiveSettings,
  headerTextSettings,
  deviceType: propDeviceType,
  titleProps = {},
  subtitleProps = {},
  descriptionProps = {},
  className = '',
  onMouseEnter, // Додаю пропс для звукових ефектів з MainScreen
  ...props
}) => {
  const { deviceType: hookDeviceType, boxStyles, boxClasses } = useResponsiveBox('headerTextBox');
  
  // Використовуємо deviceType з пропсів або з хука
  const currentDeviceType = propDeviceType || hookDeviceType;

  // Функція для отримання адаптивних значень
  const getAdaptiveValue = (key: keyof DeviceSettings) => {
    if (adaptiveSettings && currentDeviceType) {
      return adaptiveSettings[currentDeviceType][key];
    }
    // Fallback значення
    return currentDeviceType === 'mobile' ? 32 : 
           currentDeviceType === 'tablet' ? 42 : 56;
  };

  // Функція для отримання значень з headerTextSettings
  const getHeaderSetting = (key: keyof HeaderTextSettings, fallback: any) => {
    return headerTextSettings?.[key] ?? fallback;
  };

  // 🎭 Функція для отримання варіантів анімацій (аналогічно MainPageCustomizer)
  const getAnimationVariants = (element: 'title' | 'subtitle' | 'description') => {
    const enterAnimation = element === 'title' ? getHeaderSetting('headerTitleAnimation', 'none') :
                          element === 'subtitle' ? getHeaderSetting('headerSubtitleAnimation', 'none') :
                          getHeaderSetting('headerDescriptionAnimation', 'none');
    
    // 🚨 ДЕБАГ: Детальна перевірка що повертається
    console.log(`🎭 SmartHeaderTextBox ПОВНИЙ ЛОГ для ${element}:`, {
      enterAnimation,
      willBeStatic: !enterAnimation || enterAnimation === 'none'
    });
    
    // Якщо анімація не задана або 'none', повертаємо статичну анімацію
    if (!enterAnimation || enterAnimation === 'none') {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    const duration = getHeaderSetting('headerAnimationDuration', 800) / 1000;
    const delay = getHeaderSetting('headerAnimationDelay', 200) / 1000;

    // Варіанти анімацій появи
    const enterVariants: any = {
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
      fadeIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 },
      slideUp: { opacity: 0, x: 0, y: 50, scale: 1, rotate: 0 },
      slideDown: { opacity: 0, x: 0, y: -50, scale: 1, rotate: 0 },
      slideLeft: { opacity: 0, x: -50, y: 0, scale: 1, rotate: 0 },
      slideRight: { opacity: 0, x: 50, y: 0, scale: 1, rotate: 0 },
      zoomIn: { opacity: 0, x: 0, y: 0, scale: 0.5, rotate: 0 },
      zoomOut: { opacity: 0, x: 0, y: 0, scale: 1.5, rotate: 0 },
      rotateIn: { opacity: 0, x: 0, y: 0, scale: 1, rotate: -180 },
      bounce: { opacity: 0, x: 0, y: -100, scale: 1, rotate: 0 },
      typewriter: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
      glow: { opacity: 0, x: 0, y: 0, scale: 1, rotate: 0 }
    };

    const result = {
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
    
    // 🚨 ДЕБАГ: Показуємо що повертаємо з реальними значеннями
    console.log(`🎭 SmartHeaderTextBox РЕЗУЛЬТАТ для ${element}:`, {
      animation_type: enterAnimation,
      initial_exact: JSON.stringify(result.initial),
      animate_exact: JSON.stringify(result.animate),
      transition_exact: JSON.stringify(result.transition)
    });
    
    return result;
  };

  return (
    <ConstructorWrapper
      boxName="headerTextBox"
      deviceType={currentDeviceType}
      className={`${boxClasses} ${className}`}
      style={boxStyles}
    >
      {/* Заголовок */}
      <motion.h1 
        className={`leading-tight tracking-tight text-balance cursor-pointer select-none font-bold text-center mb-4 ${titleProps.className || ''}`}
        style={{
          fontSize: adaptiveSettings ? `${getAdaptiveValue('headerTitleFontSize')}px` : 
                   (currentDeviceType === 'mobile' ? '32px' : 
                    currentDeviceType === 'tablet' ? '42px' : '56px'),
          fontFamily: getHeaderSetting('headerTitleFontFamily', 'Inter'),
          fontWeight: getHeaderSetting('headerTitleFontWeight', 700),
          fontStyle: getHeaderSetting('headerTitleFontStyle', 'normal'),
          lineHeight: adaptiveSettings ? getAdaptiveValue('headerTitleLineHeight') : 
                     (currentDeviceType === 'mobile' ? 1.2 : 
                      currentDeviceType === 'tablet' ? 1.3 : 1.4),
          letterSpacing: adaptiveSettings ? `${getAdaptiveValue('headerTitleLetterSpacing')}px` : 
                        (currentDeviceType === 'mobile' ? '-0.5px' : 
                         currentDeviceType === 'tablet' ? '-0.3px' : '-0.5px'),
          marginBottom: adaptiveSettings ? `${getAdaptiveValue('headerTitleMarginBottom')}px` : '16px',
          color: getHeaderSetting('textColor', '#ffffff'),
          // Додаємо тінь для заголовка
          textShadow: `0 2px 4px rgba(0,0,0,${getHeaderSetting('headerTitleShadowIntensity', 0.5)})`,
          // Увімкнути pointer events для hover ефектів
          pointerEvents: 'auto',
          ...titleProps.style
        }}
        // 🎭 ДОДАЄМО АНІМАЦІЇ ВХОДУ (МАЄ БУТИ ПЕРШИМ!)
        {...getAnimationVariants('title')}
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.975 }}
        // ЧИСТО БЕЗ КОНФЛІКТІВ - АНАЛОГІЧНО ПІДЗАГОЛОВКУ ТА ОПИСУ
        onMouseEnter={onMouseEnter}
        onClick={titleProps.onClick}
      >
        {title}
      </motion.h1>

      {/* Підзаголовок */}
      <motion.h2 
        className={`leading-tight tracking-tight text-balance cursor-pointer select-none font-bold text-center mb-4 ${subtitleProps.className || ''}`}
        style={{
          fontSize: adaptiveSettings ? `${getAdaptiveValue('headerSubtitleFontSize')}px` : 
                   (currentDeviceType === 'mobile' ? '20px' : 
                    currentDeviceType === 'tablet' ? '28px' : '36px'),
          fontFamily: getHeaderSetting('headerSubtitleFontFamily', 'Inter'),
          fontWeight: getHeaderSetting('headerSubtitleFontWeight', 600),
          fontStyle: getHeaderSetting('headerSubtitleFontStyle', 'normal'),
          lineHeight: adaptiveSettings ? getAdaptiveValue('headerSubtitleLineHeight') : 
                     (currentDeviceType === 'mobile' ? 1.3 : 
                      currentDeviceType === 'tablet' ? 1.4 : 1.5),
          letterSpacing: adaptiveSettings ? `${getAdaptiveValue('headerSubtitleLetterSpacing')}px` : 
                        (currentDeviceType === 'mobile' ? '0px' : 
                         currentDeviceType === 'tablet' ? '0px' : '0px'),
          marginBottom: adaptiveSettings ? `${getAdaptiveValue('headerSubtitleMarginBottom')}px` : '16px',
          color: getHeaderSetting('textColor', '#ffffff'),
          // Додаємо тінь для підзаголовка
          textShadow: `0 2px 4px rgba(0,0,0,${getHeaderSetting('headerSubtitleShadowIntensity', 0.3)})`,
          // Увімкнути pointer events для hover ефектів
          pointerEvents: 'auto',
          ...subtitleProps.style
        }}
        // 🎭 ДОДАЄМО АНІМАЦІЇ ВХОДУ (МАЄ БУТИ ПЕРШИМ!)
        {...getAnimationVariants('subtitle')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        // ЧИСТО БЕЗ КОНФЛІКТІВ - АНАЛОГІЧНО ЗАГОЛОВКУ
        onMouseEnter={onMouseEnter}
        onClick={subtitleProps.onClick}
      >
        {subtitle}
      </motion.h2>

      {/* Опис */}
      <motion.p 
        className={`leading-tight tracking-tight text-balance cursor-pointer select-none font-light text-center ${descriptionProps.className || ''}`}
        style={{
          fontSize: adaptiveSettings ? `${getAdaptiveValue('headerDescriptionFontSize')}px` : 
                   (currentDeviceType === 'mobile' ? '14px' : 
                    currentDeviceType === 'tablet' ? '16px' : '20px'),
          fontFamily: getHeaderSetting('headerDescriptionFontFamily', 'Inter'),
          fontWeight: getHeaderSetting('headerDescriptionFontWeight', 400),
          fontStyle: getHeaderSetting('headerDescriptionFontStyle', 'normal'),
          lineHeight: adaptiveSettings ? getAdaptiveValue('headerDescriptionLineHeight') : 
                     (currentDeviceType === 'mobile' ? 1.4 : 
                      currentDeviceType === 'tablet' ? 1.5 : 1.6),
          letterSpacing: adaptiveSettings ? `${getAdaptiveValue('headerDescriptionLetterSpacing')}px` : 
                        (currentDeviceType === 'mobile' ? '0.2px' : 
                         currentDeviceType === 'tablet' ? '0.1px' : '0px'),
          color: getHeaderSetting('textColor', '#ffffff'),
          // Додаємо тінь для опису
          textShadow: `0 1px 2px rgba(0,0,0,${getHeaderSetting('headerDescriptionShadowIntensity', 0.3)})`,
          // Увімкнути pointer events для hover ефектів
          pointerEvents: 'auto',
          ...descriptionProps.style
        }}
        // 🎭 ДОДАЄМО АНІМАЦІЇ ВХОДУ (МАЄ БУТИ ПЕРШИМ!)
        {...getAnimationVariants('description')}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        // ЧИСТО БЕЗ КОНФЛІКТІВ - АНАЛОГІЧНО ЗАГОЛОВКУ
        onMouseEnter={onMouseEnter}
        onClick={descriptionProps.onClick}
      >
        {description}
      </motion.p>
    </ConstructorWrapper>
  );
};

// 🎠 Smart Carousel Box - адаптивна карусель з інтеграцією адмін панелі
export const SmartCarouselBox: React.FC<CarouselBoxProps> = ({
  items,
  carouselSettings,
  deviceType: propDeviceType,
  onSelectItem,
  onActiveIndexChange,
  onHoverSound,
  onClickSound,
  onTransitionSound,
  className = '',
  ...props
}) => {
  const { deviceType: hookDeviceType, boxStyles, boxClasses } = useResponsiveBox('carouselBox');
  
  // Використовуємо deviceType з пропсів або з хука
  const currentDeviceType = propDeviceType || hookDeviceType;

  // Функція для отримання адаптивних розмірів каруселі
  const getCarouselHeight = () => {
    if (currentDeviceType === 'mobile') return 'h-[400px]';
    if (currentDeviceType === 'tablet') return 'h-[500px]';
    return 'h-[600px] lg:h-[600px] xl:h-[700px]';
  };

  // Функція для отримання налаштувань каруселі
  const getCarouselSetting = <K extends keyof CarouselSettings>(key: K, fallback: CarouselSettings[K]): CarouselSettings[K] => {
    return carouselSettings?.[key] ?? fallback;
  };



  return (
    <ConstructorWrapper
      boxName="carouselBox"
      deviceType={currentDeviceType}
      className={`${boxClasses} ${className}`}
      style={boxStyles}
    >
      <motion.div 
        className={`w-full ${getCarouselHeight()} flex items-center justify-center`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
      >
        <div className="w-full max-w-7xl h-full">
          <Carousel3D 
            items={items}
            onSelectItem={onSelectItem}
            carouselStyle={getCarouselSetting('carouselStyle', 'premium')}
            animationSpeed={getCarouselSetting('animationSpeed', 'normal')}
            showParticles={getCarouselSetting('showParticles', false)}
            particleColor={getCarouselSetting('particleColor', '#ffffff')}
            brandColor={getCarouselSetting('brandColor', '#4a4b57')}
            accentColor={getCarouselSetting('accentColor', '#3b82f6')}
            onHoverSound={onHoverSound}
            onClickSound={onClickSound}
            onTransitionSound={onTransitionSound}
            onActiveIndexChange={onActiveIndexChange}
          />
        </div>
      </motion.div>
    </ConstructorWrapper>
  );
};

// Admin Button компонент з повною функціональністю
interface AdminButtonBoxProps extends Omit<BaseBoxProps, 'children'> {
  icon?: ReactNode;
  badge?: boolean;
  badgeCount?: number;
  position?: 'fixed' | 'absolute' | 'relative';
  size?: 'small' | 'medium' | 'large';
  deviceType?: 'mobile' | 'tablet' | 'desktop';
}

export const SmartAdminButtonBox: React.FC<AdminButtonBoxProps> = ({
  icon = '⚙️',
  badge = false,
  badgeCount = 0,
  position = 'fixed',
  size = 'medium',
  deviceType: propDeviceType,
  className = '',
  ...props
}) => {
  const { deviceType: hookDeviceType, boxStyles, boxClasses } = useResponsiveBox('adminButtonBox');
  
  // Використовуємо deviceType з пропсів або з хука
  const currentDeviceType = propDeviceType || hookDeviceType;

  // Функція для отримання адаптивних розмірів
  const getButtonSize = () => {
    const sizes = {
      mobile: { small: 40, medium: 48, large: 56 },
      tablet: { small: 44, medium: 52, large: 60 },
      desktop: { small: 48, medium: 56, large: 64 }
    };
    return sizes[currentDeviceType][size];
  };

  const buttonSizePx = getButtonSize();

  // Стандартні позиції для кнопки адмін панелі
  const getDefaultPosition = () => {
    if (typeof window !== 'undefined') {
      const { innerWidth, innerHeight } = window;
      return {
        x: innerWidth - 80,
        y: innerHeight - 80
      };
    }
    return { x: 1840, y: 1000 }; // fallback
  };

  return (
    <ConstructorWrapper
      boxName="adminButtonBox"
      deviceType={currentDeviceType}
      className={`text-white rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer backdrop-blur-sm hover:backdrop-blur-md antialiased select-none ${boxClasses} ${className}`} 
      style={{
        width: `${buttonSizePx}px`,
        height: `${buttonSizePx}px`,
        background: 'linear-gradient(145deg, #8B5CF6 0%, #A855F7 25%, #9333EA 50%, #7C3AED 75%, #6D28D9 100%)',
        boxShadow: `0 8px 25px rgba(139, 92, 246, 0.4), 
                   0 4px 12px rgba(0,0,0,0.15),
                   inset 0 1px 0 rgba(255,255,255,0.6),
                   inset 0 -1px 0 rgba(0,0,0,0.15),
                   0 0 0 1px rgba(255,255,255,0.2)`,
        border: 'none',
        transform: 'translateZ(0)',
        transformStyle: 'preserve-3d',
        zIndex: 30,
        ...boxStyles
      }}
      {...props}
    >
      <motion.div
        className="w-full h-full rounded-full flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: `0 12px 35px rgba(139, 92, 246, 0.5), 
                     0 6px 16px rgba(0,0,0,0.2),
                     inset 0 1px 0 rgba(255,255,255,0.8),
                     inset 0 -1px 0 rgba(0,0,0,0.2),
                     0 0 0 2px rgba(255,255,255,0.3)`,
          filter: 'brightness(1.05)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {typeof icon === 'string' ? (
            <span 
              className="text-xl font-bold"
              style={{
                textShadow: '0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.7)',
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
                transform: 'translateZ(1px)'
              }}
            >
              {icon}
            </span>
          ) : (
            <div style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6)) drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 0 2px rgba(255,255,255,0.7))',
              transform: 'translateZ(1px)'
            }}>
              {icon}
            </div>
          )}
          
          {badge && badgeCount > 0 && (
            <motion.div
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="text-xs text-white font-bold">
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </ConstructorWrapper>
  );
};

// Pagination компонент
interface PaginationBoxProps extends Omit<BaseBoxProps, 'children'> {
  items: any[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  dotSize?: 'small' | 'medium' | 'large';
}

export const SmartPaginationBox: React.FC<PaginationBoxProps> = ({
  items,
  activeIndex,
  onItemClick,
  dotSize = 'medium',
  className = '',
  ...props
}) => {
  const { deviceType, boxStyles, boxClasses } = useResponsiveBox('paginationBox');
  
  const getDotSize = () => {
    const sizes = {
      mobile: { small: 8, medium: 12, large: 16 },
      tablet: { small: 10, medium: 14, large: 18 },
      desktop: { small: 12, medium: 16, large: 20 }
    };
    return sizes[deviceType][dotSize];
  };

  const dotSizePx = getDotSize();

  if (items.length <= 1) return null;

  return (
    <ConstructorWrapper
      boxName="paginationBox"
      deviceType={deviceType}
      className={`${boxClasses} ${className}`}
      style={boxStyles}
    >
      {items.map((item, index) => (
        <motion.button
          key={item.id || index}
          onClick={() => onItemClick(index)}
          className={`rounded-full transition-all duration-300 backdrop-blur-sm border ${
            index === activeIndex 
              ? 'bg-white/90 border-white/50 scale-125' 
              : 'bg-white/40 border-white/30 hover:bg-white/60 hover:border-white/50'
          }`}
          style={{
            width: `${dotSizePx}px`,
            height: `${dotSizePx}px`,
            boxShadow: index === activeIndex 
              ? '0 4px 12px rgba(255,255,255,0.3), 0 0 0 2px rgba(255,255,255,0.1)' 
              : '0 2px 6px rgba(0,0,0,0.2)'
          }}
          whileHover={{ 
            scale: index === activeIndex ? 1.3 : 1.15,
            boxShadow: index === activeIndex 
              ? '0 6px 16px rgba(255,255,255,0.4), 0 0 0 3px rgba(255,255,255,0.15)' 
              : '0 4px 10px rgba(255,255,255,0.2)'
          }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </ConstructorWrapper>
  );
};

// Експорт всіх компонентів
export {
  createResponsiveBox
};

export default {
  LogoBox,
  SoundToggleBox,
  HeaderTextBox,
  CarouselBox,
  PaginationBox,
  AdminButtonBox,
  AdminPanelBox,
  SmartLogoBox,
  SmartHeaderTextBox,
  SmartCarouselBox,
  SmartAdminButtonBox,
  SmartPaginationBox
}; 