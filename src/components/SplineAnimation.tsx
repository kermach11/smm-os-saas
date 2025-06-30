import React, { useEffect, useRef, useState, memo } from 'react';
import Spline from '@splinetool/react-spline';

// Глобальний кеш для preload операцій
const splinePreloadCache = new Map<string, Promise<boolean>>();
const isPreloadingMap = new Map<string, boolean>();

interface SplineAnimationProps {
  sceneUrl?: string;
  embedCode?: string;
  localFile?: string; // Локальний файл .spline
  position?: 'background' | 'foreground' | 'overlay';
  opacity?: number;
  scale?: number;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  method?: 'iframe' | 'component' | 'local'; // Додано 'local' метод
}

const SplineAnimation: React.FC<SplineAnimationProps> = ({
  sceneUrl,
  embedCode,
  localFile,
  position = 'background',
  opacity = 1,
  scale = 1,
  autoplay = true,
  controls = false,
  className = '',
  method = 'component'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [splineOpacity, setSplineOpacity] = useState(0);

  // 🚀 Ultra-optimized Preloading з жорстким кешуванням
  useEffect(() => {
    if (!sceneUrl && !embedCode && !localFile) {
      setIsLoading(false);
      return;
    }
    
    // Локальні файли завантажуються миттєво
    if (method === 'local' && localFile) {
      setIsLoading(false);
      return;
    }

    // Preload для .splinecode файлів з жорстким кешуванням
    if (sceneUrl && sceneUrl.includes('.splinecode')) {
      // Якщо вже кешовано - миттєво завершуємо
      if (splinePreloadCache.has(sceneUrl)) {
        setIsPreloaded(true);
        setIsLoading(false);
        return;
      }
      
      // Якщо зараз йде preload цього URL - чекаємо
      if (isPreloadingMap.get(sceneUrl)) {
        setIsLoading(false);
        return;
      }
      
      // Запускаємо preload тільки один раз
      isPreloadingMap.set(sceneUrl, true);
      
      const preloadPromise = fetch(sceneUrl)
        .then(response => response.ok)
        .catch(() => false)
        .finally(() => {
          isPreloadingMap.set(sceneUrl, false);
        });
      
      // Зберігаємо в кеш
      splinePreloadCache.set(sceneUrl, preloadPromise);
      
      // Виконуємо preload
      preloadPromise.then((success) => {
        if (success) {
          setIsPreloaded(true);
        }
        setIsLoading(false);
      });
      
      return;
    }
    
    // Стандартний таймер безпеки
    setIsLoading(false);
  }, [sceneUrl, method]);

  // 🎯 Resource Hints для швидшого завантаження
  useEffect(() => {
    if (sceneUrl && sceneUrl.includes('.splinecode')) {
      // Додаємо prefetch link для сцени
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = sceneUrl;
      document.head.appendChild(prefetchLink);
      
      // Додаємо preconnect для домену Spline
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://prod.spline.design';
      document.head.appendChild(preconnectLink);

      return () => {
        document.head.removeChild(prefetchLink);
        document.head.removeChild(preconnectLink);
      };
    }
  }, [sceneUrl]);

  useEffect(() => {
    if (!sceneUrl && !embedCode && !localFile) {
      return;
    }

    // Якщо є embed код, використовуємо його
    if (embedCode && containerRef.current) {
      containerRef.current.innerHTML = embedCode;
      return;
    }

    // Якщо є URL Spline сцени, створюємо iframe
    if (sceneUrl && containerRef.current && method === 'iframe') {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'camera; microphone; xr-spatial-tracking';
        iframe.allowFullscreen = true;
        
        // 🚀 Додаємо оптимізації завантаження
        iframe.loading = 'eager'; // Пріоритетне завантаження
        
        // Додаємо параметри оптимізації в URL
        try {
          const url = new URL(sceneUrl);
          if (!autoplay) url.searchParams.set('autoplay', '0');
          if (!controls) url.searchParams.set('controls', '0');
          
          // 🎯 Spline performance параметри
          url.searchParams.set('quality', 'high');
          url.searchParams.set('antialiasing', 'true');
          url.searchParams.set('shadows', 'true');
          url.searchParams.set('postprocessing', 'true');
          
          iframe.src = url.toString();
        } catch (urlError) {
          iframe.src = sceneUrl;
        }
        
        // 🚀 Швидке прибирання лоадера після load
        iframe.onload = () => {
          setIsLoading(false);
        };
        
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(iframe);
      } catch (error) {
        console.error('Error creating iframe:', error);
        setIsLoading(false);
      }
    }
  }, [sceneUrl, embedCode, localFile, autoplay, controls, method]);

  const getPositionClasses = () => {
    const classes = (() => {
      switch (position) {
        case 'background':
          return 'absolute inset-0 z-0'; // Під усім контентом
        case 'overlay':
          return 'absolute inset-0 z-5'; // Над фоном, під контентом  
        case 'foreground':
          return 'absolute inset-0 z-40'; // Над усім контентом
        default:
          return 'absolute inset-0 z-0';
      }
    })();
    
    return classes;
  };



  if (!sceneUrl && !embedCode && !localFile) return null;

  // 🚀 Офіційний Spline компонент з оптимізаціями
  if (method === 'component' && sceneUrl && sceneUrl.includes('.splinecode')) {
    return (
      <div 
        className={`${getPositionClasses()} ${className}`}
        style={{
          opacity: opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          pointerEvents: controls ? 'auto' : 'none'
        }}
      >
        <Spline 
          scene={sceneUrl}
          style={{ 
            width: '100%', 
            height: '100%',
            // 🎯 CSS оптимізації для плавності + швидкий старт
            opacity: splineOpacity,
            transition: 'opacity 1.2s ease-out',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
          onLoad={() => {
            console.log('✅ Spline component loaded');
            setIsLoading(false);
            
            // 🎯 Миттєвий перехід: показуємо Spline анімацію ОДРАЗУ
            setSplineOpacity(1); // Показуємо Spline миттєво без затримки
          }}
          onError={(error) => {
            console.error('❌ Spline load error:', error);
            setIsLoading(false);
          }}
          // 🚀 Performance оптимізації
          renderOnDemand={false} // Завжди рендерити для кращої performance
        />

      </div>
    );
  }

  // Якщо використовуємо локальний файл
  if (method === 'local' && localFile) {
    return (
      <div 
        className={`${getPositionClasses()} ${className}`}
        style={{
          opacity: opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
          pointerEvents: controls ? 'auto' : 'none'
        }}
      >
        <Spline 
          scene={localFile}
          style={{ 
            width: '100%', 
            height: '100%',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
          onLoad={() => {
            setIsLoading(false);
          }}
          renderOnDemand={false}
        />
      </div>
    );
  }

  // Fallback на iframe метод з оптимізаціями
  return (
    <div 
      ref={containerRef}
      className={`${getPositionClasses()} ${className}`}
      style={{
        opacity: opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        pointerEvents: controls ? 'auto' : 'none',
        // 🎯 CSS оптимізації
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    />
  );
};

// Мемоізуємо компонент для запобігання зайвих re-render'ів
export default memo(SplineAnimation, (prevProps, nextProps) => {
  // Порівнюємо тільки критичні prop'и
  return (
    prevProps.sceneUrl === nextProps.sceneUrl &&
    prevProps.embedCode === nextProps.embedCode &&
    prevProps.localFile === nextProps.localFile &&
    prevProps.method === nextProps.method &&
    prevProps.position === nextProps.position &&
    prevProps.opacity === nextProps.opacity &&
    prevProps.scale === nextProps.scale &&
    prevProps.autoplay === nextProps.autoplay &&
    prevProps.controls === nextProps.controls
  );
}); 