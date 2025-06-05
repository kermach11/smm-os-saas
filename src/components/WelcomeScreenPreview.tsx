import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

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
}

const defaultSettings: WelcomeSettings = {
  title: "SMM OS",
  subtitle: "Ласкаво просимо",
  description: "Усе що треба для твого SMM\nв одному місці",
  buttonText: "Увійти",
  hintText: "Тапніть щоб увійти та запустити музику",
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
  animationSpeed: 'normal'
};

const WelcomeScreenPreview = ({ className }: WelcomeScreenPreviewProps) => {
  const [settings, setSettings] = useState<WelcomeSettings>(defaultSettings);
  
  // Завантаження налаштувань з localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('welcomeSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Помилка завантаження налаштувань превю:', error);
      }
    }

    // Слухаємо оновлення налаштувань
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(prev => ({ ...prev, ...event.detail }));
    };

    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

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

      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VlZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <div className="relative text-center px-6 max-w-md mx-auto z-10">
        {/* Logo */}
        {settings.showLogo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #4a4b57 0%, #303142 100%)',
                    boxShadow: '0 4px 12px rgba(48,49,66,0.3)'
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-light sf-text" style={{ color: settings.textColor }}>
              {settings.title}
            </h1>
          </motion.div>
        )}

        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl font-light mb-3 sf-heading" style={{ color: settings.subtitleColor }}>
            {settings.subtitle}
          </h2>
          <p className="text-sm leading-relaxed sf-body" style={{ color: settings.descriptionColor }}>
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