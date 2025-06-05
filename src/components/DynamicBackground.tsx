import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BackgroundSettings {
  type: 'color' | 'image' | 'video';
  color: string;
  image?: string;
  video?: string;
}

interface DynamicBackgroundProps {
  section: 'intro' | 'main';
  className?: string;
  children?: React.ReactNode;
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ 
  section, 
  className = "", 
  children 
}) => {
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'color',
    color: '#f9fafb'
  });

  // Функція завантаження налаштувань фону
  const loadBackgroundSettings = useCallback(() => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        const sectionSettings = section === 'intro' ? data.introSettings : data.mainPageSettings;
        
        if (sectionSettings) {
          setBackgroundSettings({
            type: sectionSettings.backgroundType || 'color',
            color: sectionSettings.backgroundColor || '#f9fafb',
            image: sectionSettings.backgroundImage,
            video: sectionSettings.backgroundVideo
          });
        }
      }
    } catch (error) {
      console.error('Помилка завантаження налаштувань фону:', error);
    }
  }, [section]);

  useEffect(() => {
    loadBackgroundSettings();
  }, [loadBackgroundSettings]);

  // Слухач для оновлення даних з адмін-панелі
  const handleAdminDataUpdate = useCallback((event: CustomEvent<Record<string, unknown>>) => {
    const data = event.detail;
    if (data && typeof data === 'object') {
      loadBackgroundSettings();
    }
  }, [loadBackgroundSettings]);

  useEffect(() => {
    window.addEventListener('adminDataUpdated', handleAdminDataUpdate as EventListener);
    window.addEventListener('introSettingsUpdated', handleAdminDataUpdate as EventListener);
    window.addEventListener('mainPageSettingsUpdated', handleAdminDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('adminDataUpdated', handleAdminDataUpdate as EventListener);
      window.removeEventListener('introSettingsUpdated', handleAdminDataUpdate as EventListener);
      window.removeEventListener('mainPageSettingsUpdated', handleAdminDataUpdate as EventListener);
    };
  }, [handleAdminDataUpdate]);

  const getBackgroundStyle = (): React.CSSProperties => {
    switch (backgroundSettings.type) {
      case 'image':
        return backgroundSettings.image ? {
          backgroundImage: `url(${backgroundSettings.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        } : { backgroundColor: backgroundSettings.color };
      
      case 'video':
        return { backgroundColor: backgroundSettings.color };
      
      default:
        return { backgroundColor: backgroundSettings.color };
    }
  };

  const renderBackground = () => {
    if (backgroundSettings.type === 'video' && backgroundSettings.video) {
      return (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: -1 }}
        >
          <source src={backgroundSettings.video} type="video/mp4" />
          {/* Fallback для браузерів, що не підтримують відео */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: backgroundSettings.color }}
          />
        </motion.video>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
        style={{
          ...getBackgroundStyle(),
          zIndex: -1
        }}
      />
    );
  };

  return (
    <div className={`relative ${className}`}>
      {renderBackground()}
      
      {/* Overlay для кращої читабельності тексту */}
      {(backgroundSettings.type === 'image' || backgroundSettings.type === 'video') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 bg-black/30"
          style={{ zIndex: 0 }}
        />
      )}
      
      {/* Контент */}
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground; 