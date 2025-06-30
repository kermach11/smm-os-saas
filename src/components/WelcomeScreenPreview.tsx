import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import SplineAnimation from './SplineAnimation';
import indexedDBService from '../services/IndexedDBService';

interface WelcomeScreenPreviewProps {
  className?: string;
}

interface WelcomeSettings {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  hintText: string;
  backgroundType: 'gradient' | 'color' | 'image' | 'video';
  backgroundColor: string;
  gradientFrom: string;
  gradientTo: string;
  backgroundImage: string;
  backgroundVideo: string;
  textColor: string;
  subtitleColor: string;
  descriptionColor: string;
  buttonColor: string;
  buttonTextColor: string;
  logoUrl: string;
  showLogo: boolean;
  hasMusic: boolean;
  musicUrl: string;
  musicVolume: number;
  autoPlay: boolean;
  showParticles: boolean;
  particleColor: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
  // Typography settings
  titleFontSize?: number;
  subtitleFontSize?: number;
  descriptionFontSize?: number;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
  descriptionFontFamily?: string;
  titleFontWeight?: number;
  subtitleFontWeight?: number;
  descriptionFontWeight?: number;
  titleFontStyle?: string;
  subtitleFontStyle?: string;
  descriptionFontStyle?: string;
  splineSettings?: {
    enabled: boolean;
    sceneUrl: string;
    embedCode: string;
    localFile: string;
    position: 'background' | 'foreground' | 'overlay';
    opacity: number;
    scale: number;
    autoplay: boolean;
    controls: boolean;
    method: 'iframe' | 'component' | 'local';
  };
}

const defaultSettings: WelcomeSettings = {
  title: "SMM OS",
  subtitle: "Welcome",
  description: "Everything you need for your SMM\nin one place",
  buttonText: "Enter",
  hintText: "Tap to enter and start music",
  backgroundType: 'gradient',
  backgroundColor: '#f9fafb',
  gradientFrom: '#f9fafb',
  gradientTo: '#f7f8fa',
  backgroundImage: '',
  backgroundVideo: '',
  textColor: '#111111',
  subtitleColor: '#333333',
  descriptionColor: '#666666',
  buttonColor: '#4a4b57',
  buttonTextColor: '#ffffff',
  logoUrl: '',
  showLogo: true,
  hasMusic: false,
  musicUrl: '',
  musicVolume: 0.5,
  autoPlay: true,
  showParticles: false,
  particleColor: '#ffffff',
  animationSpeed: 'normal',
  // Default typography settings
  titleFontSize: 32,
  subtitleFontSize: 20,
  descriptionFontSize: 14,
  titleFontFamily: 'Inter',
  subtitleFontFamily: 'Inter',
  descriptionFontFamily: 'Inter',
  titleFontWeight: 300,
  subtitleFontWeight: 300,
  descriptionFontWeight: 400,
  titleFontStyle: 'normal',
  subtitleFontStyle: 'normal',
  descriptionFontStyle: 'normal',
  splineSettings: {
    enabled: true,
    sceneUrl: "https://prod.spline.design/Li0xtQwxHAu6qXGd/scene.splinecode",
    embedCode: "",
    localFile: "",
    position: 'background',
    opacity: 1,
    scale: 1,
    autoplay: true,
    controls: false,
    method: 'component'
  }
};

const WelcomeScreenPreview = ({ className }: WelcomeScreenPreviewProps) => {
  console.log('🎬 WelcomeScreenPreview: Component rendering');
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  
  // Завантаження налаштувань
  useEffect(() => {
    console.log('🔄 WelcomeScreenPreview: useEffect triggered, loading settings...');
    loadWelcomeSettings();

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('🔄 WelcomeScreenPreview: Отримано оновлення налаштувань:', {
        titleFontSize: event.detail.titleFontSize,
        titleFontFamily: event.detail.titleFontFamily,
        titleFontWeight: event.detail.titleFontWeight,
        titleText: event.detail.title,
        fullDetail: event.detail
      });
      setSettings(prev => {
        const newSettings = { ...prev, ...event.detail };
        console.log('🔄 WelcomeScreenPreview: Нові налаштування після мержингу:', {
          titleFontSize: newSettings.titleFontSize,
          titleFontFamily: newSettings.titleFontFamily,
          titleFontWeight: newSettings.titleFontWeight,
          title: newSettings.title
        });
        return newSettings;
      });
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  const loadWelcomeSettings = async () => {
    console.log('📥 WelcomeScreenPreview: loadWelcomeSettings called');
    try {
      // Load from IndexedDB first
      const indexedDBSettings = await indexedDBService.loadSettings('welcomeSettings');
      console.log('📂 WelcomeScreenPreview: IndexedDB result:', indexedDBSettings);
      
      if (indexedDBSettings) {
        console.log('✅ WelcomeScreenPreview: Settings found in IndexedDB');
        const safeSettings = {
          ...defaultSettings,
          ...indexedDBSettings,
          splineSettings: {
            ...defaultSettings.splineSettings,
            ...(indexedDBSettings.splineSettings || {})
          }
        };
        
        console.log('🔧 WelcomeScreenPreview: Merged settings:', safeSettings.splineSettings);
        setSettings(safeSettings);
        return;
      }
      
      // Fallback to localStorage
      const savedSettings = localStorage.getItem('welcomeSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        
        const safeSettings = {
          ...defaultSettings,
          ...parsed,
          splineSettings: {
            ...defaultSettings.splineSettings,
            ...(parsed.splineSettings || {})
          }
        };
        
        setSettings(safeSettings);
        
        // Migrate to IndexedDB
        await indexedDBService.saveSettings('welcomeSettings', safeSettings, 'project');
      }
    } catch (error) {
      console.error('❌ WelcomeScreenPreview: Помилка завантаження налаштувань:', error);
      setSettings(defaultSettings);
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
        return { 
          background: `linear-gradient(135deg, ${settings.gradientFrom} 0%, ${settings.gradientTo} 100%)` 
        };
    }
  };

  console.log('🎨 WelcomeScreenPreview: Rendering with settings:', settings.splineSettings);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full h-full flex items-center justify-center relative ${className}`}
      style={getBackgroundStyle()}
    >
      {/* Background video */}
      {settings.backgroundType === 'video' && settings.backgroundVideo && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={settings.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Spline 3D Animation */}
      {(() => {
        console.log('🔍 WelcomeScreenPreview: Spline debug:', {
          hasSplineSettings: !!settings.splineSettings,
          enabled: settings.splineSettings?.enabled,
          sceneUrl: settings.splineSettings?.sceneUrl,
          fullSettings: settings.splineSettings
        });
        
        return settings.splineSettings?.enabled && (
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
        );
      })()}

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden z-1">
        <motion.div 
                        className="absolute inset-0 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="relative text-center px-6 max-w-md mx-auto z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          {/* Logo - only if logoUrl exists */}
          {settings.logoUrl && (
            <div className="flex items-center justify-center mb-4">
              <img 
                src={settings.logoUrl} 
                alt="Logo" 
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          )}
          
          {/* Title - always show if exists */}
          {settings.title && (
            <h1 
              className="sf-text" 
              style={{ 
                color: settings.textColor,
                fontSize: `${settings.titleFontSize || 32}px`,
                fontFamily: settings.titleFontFamily || 'Inter',
                fontWeight: settings.titleFontWeight || 300,
                fontStyle: settings.titleFontStyle || 'normal'
              }}
            >
              {settings.title}
            </h1>
          )}
        </motion.div>

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 
            className="mb-3 sf-heading" 
            style={{ 
              color: settings.subtitleColor,
              fontSize: `${settings.subtitleFontSize || 20}px`,
              fontFamily: settings.subtitleFontFamily || 'Inter',
              fontWeight: settings.subtitleFontWeight || 300,
              fontStyle: settings.subtitleFontStyle || 'normal'
            }}
          >
            {settings.subtitle}
          </h2>
          <p 
            className="leading-relaxed sf-body" 
            style={{ 
              color: settings.descriptionColor,
              fontSize: `${settings.descriptionFontSize || 14}px`,
              fontFamily: settings.descriptionFontFamily || 'Inter',
              fontWeight: settings.descriptionFontWeight || 400,
              fontStyle: settings.descriptionFontStyle || 'normal'
            }}
          >
            {settings.description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < settings.description.split('\n').length - 1 && <br />}
              </span>
            ))}
          </p>
        </motion.div>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button
            className="relative px-8 py-4 rounded-full font-medium transition-all duration-300 transform scale-100 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
            style={{
              backgroundColor: settings.buttonColor,
              color: settings.buttonTextColor,
            }}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">🎵</span>
              {settings.buttonText}
            </span>
          </button>
        </motion.div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xs mt-6 sf-body"
          style={{ color: settings.descriptionColor, opacity: 0.7 }}
        >
          {settings.hintText}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default WelcomeScreenPreview; 