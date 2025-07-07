import React, { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { DeviceType } from '../config/responsiveConfig';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  
  // Опції для різних пристроїв
  mobileProps?: Partial<ResponsiveContainerProps>;
  tabletProps?: Partial<ResponsiveContainerProps>;
  desktopProps?: Partial<ResponsiveContainerProps>;
  
  // Показати/приховати на певних пристроях
  hideOn?: DeviceType[];
  showOn?: DeviceType[];
  
  // Анімації
  animated?: boolean;
  animationDelay?: number;
  
  // Типи контейнерів
  containerType?: 'default' | 'header' | 'main' | 'carousel' | 'button' | 'custom';
  
  // Додаткові опції
  centerContent?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  
  // Подія для кліків
  onClick?: () => void;
  onHover?: () => void;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  style = {},
  mobileProps = {},
  tabletProps = {},
  desktopProps = {},
  hideOn = [],
  showOn = [],
  animated = false,
  animationDelay = 0,
  containerType = 'default',
  centerContent = false,
  fullWidth = false,
  fullHeight = false,
  onClick,
  onHover
}) => {
  const { 
    deviceType, 
    isMobile, 
    isTablet, 
    isDesktop, 
    styles, 
    config 
  } = useResponsive();

  // Перевіряємо, чи потрібно показувати компонент
  const shouldHide = hideOn.includes(deviceType);
  const shouldShow = showOn.length === 0 || showOn.includes(deviceType);
  
  if (shouldHide || !shouldShow) {
    return null;
  }

  // Отримуємо пропси для поточного пристрою
  const deviceSpecificProps = 
    isMobile ? mobileProps :
    isTablet ? tabletProps :
    desktopProps;

  // Об'єднуємо пропси
  const finalProps = {
    className: deviceSpecificProps.className || className,
    style: { ...style, ...deviceSpecificProps.style },
    onClick: deviceSpecificProps.onClick || onClick,
    onHover: deviceSpecificProps.onHover || onHover
  };

  // Генеруємо стилі залежно від типу контейнера
  const getContainerStyles = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      ...finalProps.style
    };

    // Базові стилі залежно від типу контейнера
    switch (containerType) {
      case 'header':
        return {
          ...baseStyles,
          ...styles.header,
          textAlign: centerContent ? 'center' : 'left'
        };
      
      case 'main':
        return {
          ...baseStyles,
          ...styles.container,
          width: fullWidth ? '100%' : 'auto',
          height: fullHeight ? '100vh' : 'auto',
          display: centerContent ? 'flex' : 'block',
          justifyContent: centerContent ? 'center' : 'flex-start',
          alignItems: centerContent ? 'center' : 'flex-start',
          flexDirection: centerContent ? 'column' : 'row'
        };
      
      case 'carousel':
        return {
          ...baseStyles,
          ...styles.carousel
        };
      
      case 'button':
        return {
          ...baseStyles,
          ...styles.button,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        };
      
      case 'custom':
        return baseStyles;
      
      default:
        return {
          ...baseStyles,
          width: fullWidth ? '100%' : 'auto',
          height: fullHeight ? '100vh' : 'auto',
          display: centerContent ? 'flex' : 'block',
          justifyContent: centerContent ? 'center' : 'flex-start',
          alignItems: centerContent ? 'center' : 'flex-start',
          flexDirection: centerContent ? 'column' : 'row'
        };
    }
  };

  // Генеруємо класи
  const getContainerClasses = (): string => {
    const classes = [
      finalProps.className,
      `responsive-${deviceType}`,
      `container-${containerType}`
    ];

    if (centerContent) classes.push('centered-content');
    if (fullWidth) classes.push('full-width');
    if (fullHeight) classes.push('full-height');

    return classes.filter(Boolean).join(' ');
  };

  // Анімації
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      duration: config.animationDuration / 1000,
      delay: animationDelay + (config.animationDelay / 1000),
      ease: "easeOut"
    }
  } : {};

  const containerStyles = getContainerStyles();
  const containerClasses = getContainerClasses();

  // Рендеримо з анімацією або без
  if (animated) {
    return (
      <motion.div
        {...animationProps}
        className={containerClasses}
        style={containerStyles}
        onClick={finalProps.onClick}
        onMouseEnter={finalProps.onHover}
        whileHover={containerType === 'button' ? { scale: 1.05 } : undefined}
        whileTap={containerType === 'button' ? { scale: 0.95 } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={containerClasses}
      style={containerStyles}
      onClick={finalProps.onClick}
      onMouseEnter={finalProps.onHover}
    >
      {children}
    </div>
  );
};

// Спеціалізовані компоненти для різних випадків використання
export const ResponsiveHeader: React.FC<Omit<ResponsiveContainerProps, 'containerType'>> = (props) => (
  <ResponsiveContainer {...props} containerType="header" />
);

export const ResponsiveMain: React.FC<Omit<ResponsiveContainerProps, 'containerType'>> = (props) => (
  <ResponsiveContainer {...props} containerType="main" />
);

export const ResponsiveCarousel: React.FC<Omit<ResponsiveContainerProps, 'containerType'>> = (props) => (
  <ResponsiveContainer {...props} containerType="carousel" />
);

export const ResponsiveButton: React.FC<Omit<ResponsiveContainerProps, 'containerType'>> = (props) => (
  <ResponsiveContainer {...props} containerType="button" />
);

// Компонент для тексту з адаптивними розмірами
interface ResponsiveTextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  textType?: 'title' | 'subtitle' | 'description' | 'primary' | 'secondary' | 'small';
  className?: string;
  style?: CSSProperties;
  animated?: boolean;
  animationDelay?: number;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  as: Component = 'div',
  textType = 'primary',
  className = '',
  style = {},
  animated = false,
  animationDelay = 0
}) => {
  const { styles, config } = useResponsive();

  const getTextStyles = (): CSSProperties => {
    switch (textType) {
      case 'title':
        return { ...styles.title, ...style };
      case 'subtitle':
        return { ...styles.subtitle, ...style };
      case 'description':
        return { ...styles.description, ...style };
      case 'primary':
        return { fontSize: `${config.primaryFontSize}px`, ...style };
      case 'secondary':
        return { fontSize: `${config.secondaryFontSize}px`, ...style };
      case 'small':
        return { fontSize: `${config.smallFontSize}px`, ...style };
      default:
        return style;
    }
  };

  const textStyles = getTextStyles();
  const textClasses = `responsive-text text-${textType} ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: config.animationDuration / 1000,
          delay: animationDelay + (config.animationDelay / 1000),
          ease: "easeOut"
        }}
      >
        <Component className={textClasses} style={textStyles}>
          {children}
        </Component>
      </motion.div>
    );
  }

  return (
    <Component className={textClasses} style={textStyles}>
      {children}
    </Component>
  );
};

// Утилітарний компонент для показу/приховування на певних пристроях
interface ShowOnProps {
  devices: DeviceType[];
  children: ReactNode;
}

export const ShowOn: React.FC<ShowOnProps> = ({ devices, children }) => {
  const { deviceType } = useResponsive();
  
  if (!devices.includes(deviceType)) {
    return null;
  }
  
  return <>{children}</>;
};

interface HideOnProps {
  devices: DeviceType[];
  children: ReactNode;
}

export const HideOn: React.FC<HideOnProps> = ({ devices, children }) => {
  const { deviceType } = useResponsive();
  
  if (devices.includes(deviceType)) {
    return null;
  }
  
  return <>{children}</>;
};

export default ResponsiveContainer; 