import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CarouselItem } from "../types/types";
import { ChevronLeft, ChevronRight, ExternalLink, ChevronDown } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";

interface Carousel3DProps {
  items: CarouselItem[];
  onSelectItem: (item: CarouselItem) => void;
  carouselStyle?: 'classic' | 'modern' | 'minimal' | 'premium' | 'neon' | 'glass' | 'retro' | 'elegant' | 'tech' | 'organic';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  showParticles?: boolean;
  particleColor?: string;
  brandColor?: string;
  accentColor?: string;
  onHoverSound?: () => void;
  onClickSound?: () => void;
  onTransitionSound?: () => void;
}

const Carousel3D = ({ 
  items, 
  onSelectItem, 
  carouselStyle = 'premium',
  animationSpeed = 'normal',
  showParticles = false,
  particleColor = '#ffffff',
  brandColor = '#4a4b57',
  accentColor = '#3b82f6',
  onHoverSound,
  onClickSound,
  onTransitionSound
}: Carousel3DProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Analytics hook
  const { trackClick } = useAnalytics();

  // Touch/Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Стан для відстеження розміру екрану
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // Стан для відстеження завантаження зображень
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Функція для обробки завантаження зображення
  const handleImageLoad = (imageUrl: string) => {
    setLoadedImages(prev => new Set(prev).add(imageUrl));
  };

  // Функція для обробки помилки завантаження зображення
  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
  };

  // Перевірка чи зображення завантажене
  const isImageLoaded = (imageUrl: string) => loadedImages.has(imageUrl);
  const hasImageError = (imageUrl: string) => imageErrors.has(imageUrl);

  // Скидаємо стан завантаження при зміні items
  useEffect(() => {
    // Перевіряємо чи дійсно змінилися URL зображень
    const currentImageUrls = new Set(items.map(item => item.imageUrl).filter(Boolean));
    const loadedImageUrls = new Set([...loadedImages]);
    
    // Якщо є нові зображення, які ще не завантажені, скидаємо тільки їх
    const hasNewImages = [...currentImageUrls].some(url => !loadedImageUrls.has(url));
    
    if (hasNewImages) {
      console.log('🔄 Carousel3D: Виявлено нові зображення, оновлюємо стан завантаження');
      // Зберігаємо вже завантажені зображення, які все ще присутні
      const stillRelevantImages = new Set([...loadedImages].filter(url => currentImageUrls.has(url)));
      setLoadedImages(stillRelevantImages);
      
      // Очищаємо помилки для зображень, які більше не використовуються
      const stillRelevantErrors = new Set([...imageErrors].filter(url => currentImageUrls.has(url)));
      setImageErrors(stillRelevantErrors);
    }
  }, [items]);

  // Функція для отримання швидкості анімації
  const getAnimationDuration = () => {
    switch (animationSpeed) {
      case 'slow': return 0.8;
      case 'fast': return 0.3;
      default: return 0.5; // normal
    }
  };

  // Функція для отримання стилів каруселі
  const getCarouselStyles = () => {
    const baseStyles = {
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.8)'
    };

    switch (carouselStyle) {
      case 'classic':
        return {
          ...baseStyles,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        };
      case 'modern':
        return {
          ...baseStyles,
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${brandColor}15, ${accentColor}15)`,
          border: `1px solid ${accentColor}30`
        };
      case 'minimal':
        return {
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        };
      case 'neon':
        return {
          background: 'rgba(0,0,0,0.9)',
          border: `2px solid ${accentColor}`,
          borderRadius: '6px',
          boxShadow: `0 0 20px ${accentColor}60, inset 0 0 20px ${accentColor}20`,
          backdropFilter: 'blur(5px)'
        };
      case 'glass':
        return {
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(25px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
        };
      case 'retro':
        return {
          background: 'linear-gradient(135deg, #ff6b6b20, #feca5720)',
          border: '3px solid #ff6b6b',
          borderRadius: '2px',
          boxShadow: '4px 4px 0px #ff6b6b60, 8px 8px 0px #feca5760'
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, rgba(139,69,19,0.2), rgba(160,82,45,0.3))',
          border: '1px solid rgba(139,69,19,0.6)',
          borderRadius: '14px',
          boxShadow: '0 6px 24px rgba(139,69,19,0.3)'
        };
      case 'tech':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,255,0.1), rgba(0,100,255,0.2))',
          border: '1px solid rgba(0,255,255,0.6)',
          borderRadius: '1px',
          boxShadow: '0 0 20px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,100,255,0.15)'
        };
      case 'organic':
        return {
          background: 'linear-gradient(135deg, rgba(34,139,34,0.2), rgba(144,238,144,0.3))',
          border: '2px solid rgba(34,139,34,0.6)',
          borderRadius: '60% 25% 75% 35%',
          boxShadow: '0 6px 24px rgba(34,139,34,0.3)'
        };
      default: // premium
        return baseStyles;
    }
  };

  // Функція для отримання стилів карточок каруселі
  const getCarouselCardStyles = (isActive: boolean) => {
    const baseCardStyles = {
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    };

    switch (carouselStyle) {
      case 'classic':
        return {
          ...baseCardStyles,
          borderRadius: '12px',
          boxShadow: isActive 
            ? '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.9)' 
            : '0 10px 25px -5px rgba(0,0,0,0.2)',
          border: '2px solid rgba(255,255,255,0.8)'
        };
      case 'modern':
        return {
          ...baseCardStyles,
          borderRadius: '20px',
          boxShadow: isActive 
            ? `0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 3px ${accentColor}` 
            : '0 10px 25px -5px rgba(0,0,0,0.2)',
          border: `2px solid ${accentColor}60`
        };
      case 'minimal':
        return {
          ...baseCardStyles,
          borderRadius: '16px',
          boxShadow: isActive 
            ? '0 15px 30px -5px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.1)' 
            : '0 5px 15px -3px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.1)'
        };
      case 'premium':
        return {
          ...baseCardStyles,
          borderRadius: '20px',
          boxShadow: isActive 
            ? '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,215,0,0.8)' 
            : '0 15px 30px -8px rgba(0,0,0,0.25)',
          border: '2px solid rgba(255,215,0,0.6)'
        };
      case 'neon':
        return {
          ...baseCardStyles,
          borderRadius: '8px',
          boxShadow: isActive 
            ? `0 20px 40px -10px rgba(0,0,0,0.6), 0 0 30px ${accentColor}80, 0 0 0 2px ${accentColor}` 
            : `0 10px 25px -5px rgba(0,0,0,0.4), 0 0 15px ${accentColor}40`,
          border: `2px solid ${accentColor}`,
          filter: isActive ? `drop-shadow(0 0 20px ${accentColor}60)` : `drop-shadow(0 0 10px ${accentColor}30)`
        };
      case 'glass':
        return {
          ...baseCardStyles,
          borderRadius: '28px',
          boxShadow: isActive 
            ? '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.4)' 
            : '0 15px 30px -8px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(20px) saturate(180%)',
          background: 'rgba(255,255,255,0.1)'
        };
      case 'retro':
        return {
          ...baseCardStyles,
          borderRadius: '4px',
          boxShadow: isActive 
            ? '6px 6px 0px #ff6b6b, 12px 12px 0px #feca57, 0 20px 40px -10px rgba(0,0,0,0.3)' 
            : '3px 3px 0px #ff6b6b60, 6px 6px 0px #feca5760',
          border: '3px solid #ff6b6b',
          transform: isActive ? 'rotate(-1deg)' : 'rotate(0deg)'
        };
      case 'elegant':
        return {
          ...baseCardStyles,
          borderRadius: '18px',
          boxShadow: isActive 
            ? '0 25px 50px -12px rgba(139,69,19,0.4), 0 0 0 2px rgba(160,82,45,0.8)' 
            : '0 15px 30px -8px rgba(139,69,19,0.25)',
          border: '2px solid rgba(160,82,45,0.6)',
          background: 'linear-gradient(135deg, rgba(139,69,19,0.05), rgba(160,82,45,0.1))'
        };
      case 'tech':
        return {
          ...baseCardStyles,
          borderRadius: '2px',
          boxShadow: isActive 
            ? '0 20px 40px -10px rgba(0,0,0,0.4), 0 0 30px rgba(0,255,255,0.6), 0 0 0 1px rgba(0,255,255,0.8)' 
            : '0 10px 25px -5px rgba(0,0,0,0.3), 0 0 15px rgba(0,255,255,0.3)',
          border: '1px solid rgba(0,255,255,0.8)',
          background: 'linear-gradient(135deg, rgba(0,255,255,0.05), rgba(0,100,255,0.1))'
        };
      case 'organic':
        return {
          ...baseCardStyles,
          borderRadius: '40% 60% 70% 30% / 50% 40% 60% 50%',
          boxShadow: isActive 
            ? '0 25px 50px -12px rgba(34,139,34,0.4), 0 0 0 3px rgba(144,238,144,0.8)' 
            : '0 15px 30px -8px rgba(34,139,34,0.25)',
          border: '2px solid rgba(144,238,144,0.6)',
          background: 'linear-gradient(135deg, rgba(34,139,34,0.05), rgba(144,238,144,0.1))'
        };
      default:
        return {
          ...baseCardStyles,
          boxShadow: isActive 
            ? '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.9)' 
            : '0 10px 25px -5px rgba(0,0,0,0.2)'
        };
    }
  };

  // Функція для отримання стилів кнопок
  const getButtonStyles = () => {
    const baseStyles = {
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.8)'
    };

    switch (carouselStyle) {
      case 'classic':
        return {
          ...baseStyles,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.9)'
        };
      case 'modern':
        return {
          ...baseStyles,
          background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
          border: 'none',
          color: 'white',
          borderRadius: '50%'
        };
      case 'minimal':
        return {
          background: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderRadius: '50%'
        };
      case 'neon':
        return {
          background: 'rgba(0,0,0,0.8)',
          border: `2px solid ${accentColor}`,
          borderRadius: '50%',
          boxShadow: `0 0 15px ${accentColor}60`,
          color: accentColor
        };
      case 'glass':
        return {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%'
        };
      case 'retro':
        return {
          background: 'linear-gradient(135deg, #ff6b6b, #feca57)',
          border: '2px solid #ff6b6b',
          borderRadius: '20%',
          color: 'white'
        };
      case 'elegant':
        return {
          background: 'linear-gradient(135deg, rgba(139,69,19,0.8), rgba(160,82,45,0.9))',
          border: '1px solid rgba(139,69,19,0.8)',
          borderRadius: '50%',
          color: 'white'
        };
      case 'tech':
        return {
          background: 'linear-gradient(135deg, rgba(0,255,255,0.3), rgba(0,100,255,0.4))',
          border: '1px solid rgba(0,255,255,0.8)',
          borderRadius: '10%',
          color: 'rgba(0,255,255,1)'
        };
      case 'organic':
        return {
          background: 'linear-gradient(135deg, rgba(34,139,34,0.8), rgba(144,238,144,0.9))',
          border: '2px solid rgba(34,139,34,0.8)',
          borderRadius: '40% 60% 70% 30%',
          color: 'white'
        };
      default:
        return baseStyles;
    }
  };

  // Select active item - виправлено для уникнення нескінченного циклу
  useEffect(() => {
    if (items && items.length > 0 && items[activeIndex]) {
      onSelectItem(items[activeIndex]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, items.length]); // onSelectItem навмисно виключено щоб уникнути нескінченного циклу

  // Скидаємо activeIndex якщо він більший за кількість елементів
  useEffect(() => {
    if (items && items.length > 0 && activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [items, activeIndex]);

  const goToNext = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    setExpandedCard(null);
    onTransitionSound?.();
  }, [items.length, onTransitionSound]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    setExpandedCard(null);
    onTransitionSound?.();
  }, [items.length, onTransitionSound]);

  const handleItemClick = useCallback((index: number) => {
    // Don't handle click if we were dragging
    if (isDragging) return;
    
    // Play click sound
    onClickSound?.();
    
    if (index === activeIndex) {
      // Toggle expanded state for active card
      setExpandedCard(expandedCard === index ? null : index);
    } else {
      setActiveIndex(index);
      setExpandedCard(null);
    }
  }, [activeIndex, expandedCard, isDragging, onClickSound]);

  const handleCTAClick = useCallback((item: CarouselItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Play click sound
    onClickSound?.();
    
    // Відстежуємо клік по CTA кнопці
    if (item.url) {
      trackClick(item.url, `${item.title} - CTA Click`);
    }
    
    if (item.title === "LINKCORE") {
      // Navigate to LinkCore page
      navigate("/linkcore");
    } else if (item.title === "CASEMACHINE") {
      // Navigate to CaseMachine page
      navigate("/casemachine");
    } else if (item.title === "BOOKME") {
      // Navigate to BookMe page
      navigate("/bookme");
    } else {
      // Open external link for other items
      window.open(item.url, "_blank");
    }
  }, [navigate, trackClick, onClickSound]);

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart !== null) {
      const distance = Math.abs(e.targetTouches[0].clientX - touchStart);
      if (distance > 10) {
        setIsDragging(true);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrev();
    }
    
    // Reset touch state
    setTimeout(() => setIsDragging(false), 100);
  };

  // Mouse event handlers for desktop drag support
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isMouseDragging, setIsMouseDragging] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseStart(e.clientX);
    setIsMouseDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (mouseStart !== null) {
      const distance = Math.abs(e.clientX - mouseStart);
      if (distance > 10) {
        setIsMouseDragging(true);
      }
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart) return;
    
    const distance = mouseStart - e.clientX;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag) {
      goToNext();
    } else if (isRightDrag) {
      goToPrev();
    }
    
    setMouseStart(null);
    setTimeout(() => setIsMouseDragging(false), 100);
  };

  const ctaLabels: Record<string, string> = {
    "LINKCORE": "Переглянути",
    "CASEMACHINE": "Приклади",
    "BOOKME": "Бронювати",
    "ADLAND": "Запустити",
    "SELLKIT": "Магазин"
  };

  // Функція для отримання стилів градієнтного оверлею
  const getGradientOverlayStyles = () => {
    switch (carouselStyle) {
      case 'neon':
        return {
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
        };
      case 'glass':
        return {
          background: 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          backdropFilter: 'blur(5px)'
        };
      case 'retro':
        return {
          background: 'linear-gradient(to top, rgba(255,107,107,0.8) 0%, rgba(254,202,87,0.4) 50%, transparent 100%)'
        };
      case 'elegant':
        return {
          background: 'linear-gradient(to top, rgba(139,69,19,0.8) 0%, rgba(160,82,45,0.4) 50%, transparent 100%)'
        };
      case 'tech':
        return {
          background: 'linear-gradient(to top, rgba(0,255,255,0.6) 0%, rgba(0,100,255,0.3) 50%, transparent 100%)'
        };
      case 'organic':
        return {
          background: 'linear-gradient(to top, rgba(34,139,34,0.8) 0%, rgba(144,238,144,0.4) 50%, transparent 100%)'
        };
      default:
        return {
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
        };
    }
  };

  // Функція для отримання стилів тексту
  const getTextStyles = () => {
    switch (carouselStyle) {
      case 'neon':
        return {
          color: accentColor,
          textShadow: `0 0 10px ${accentColor}60`
        };
      case 'glass':
        return {
          color: 'rgba(0,0,0,0.9)',
          textShadow: '0 1px 2px rgba(255,255,255,0.5)'
        };
      case 'retro':
        return {
          color: '#ffffff',
          textShadow: '2px 2px 0px #ff6b6b, 4px 4px 0px #feca57'
        };
      case 'elegant':
        return {
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(139,69,19,0.8)'
        };
      case 'tech':
        return {
          color: '#ffffff',
          textShadow: `0 0 8px ${accentColor}80`
        };
      case 'organic':
        return {
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(34,139,34,0.8)'
        };
      default:
        return {
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        };
    }
  };

  // Відстеження зміни розміру екрану для перерахунку позицій
  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      className="relative w-full h-full overflow-visible"
      style={{
        '--animation-duration': `${getAnimationDuration()}s`
      } as React.CSSProperties}
    >
      {/* 
        Логіка красивого відображення каруселі:
        - 1 карточка: тільки центральна
        - 2 карточки: перша головна, друга ззаду
        - 3 карточки: всі демонструються
        - 4 карточки: 3 демонструються, 1 ховається ззаду
        - 5 карточок: всі демонструються
        - 6+ карточок: максимум 5 спереду, решта ховається ззаду
      */}
      
      {/* Перевірка на порожній масив карточок */}
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white/60">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Карточки не знайдено</h3>
            <p className="text-sm opacity-80">Додайте карточки через конструктор</p>
          </div>
        </div>
      ) : (
        <>
          {/* Частинки */}
          {showParticles && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-pulse"
                  style={{
                    backgroundColor: particleColor,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Центрований 3D Carousel з touch підтримкою */}
          <div 
            ref={carouselRef} 
            className="carousel-grid-center carousel-3d-perspective select-none"
            style={{ perspective: '1200px' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => {
              setMouseStart(null);
              setIsMouseDragging(false);
            }}
          >
            {/* Flex-контейнер для стрілок і каруселі з ідеальною симетрією */}
            <div className="carousel-nav-symmetric max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
              {/* Стрілка вліво - фіксована позиція */}
              <div className="carousel-nav-arrow">
                <button 
                  onClick={() => {
                    goToPrev();
                    onClickSound?.();
                  }}
                  onMouseEnter={onHoverSound}
                  className="text-[#4a4b57] p-2 sm:p-2.5 lg:p-3 rounded-full smooth-transition focus:outline-none group hover:scale-110"
                  style={getCarouselStyles()}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>

              {/* Карусель - центральна частина */}
              <div className="carousel-content-center px-4 sm:px-6 lg:px-8">
                <div className="carousel-perfect-center w-full h-full max-w-5xl">
                  <div className="relative w-full h-full flex items-center justify-center">
                    {items.map((item, index) => {
                      const isActive = index === activeIndex;
                      const isExpanded = expandedCard === index;
                      const positions = calculatePositions(index, activeIndex, items.length, screenSize);
                      
                      return (
                        <div
                          key={item.id}
                          className="carousel-card-symmetric carousel-smooth-enhanced"
                          style={{
                            transform: `translate(-50%, -50%) ${positions.transform}`,
                            opacity: positions.opacity,
                            zIndex: positions.zIndex,
                            width: 'clamp(200px, 22vw, 280px)',
                            height: 'clamp(300px, 32vw, 420px)',
                            pointerEvents: isDragging || isMouseDragging ? 'none' : 'auto',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleItemClick(index)}
                          onMouseEnter={onHoverSound}
                        >
                          <div 
                            className="w-full h-full rounded-[20px] overflow-hidden smooth-transition"
                            style={getCarouselCardStyles(isActive)}
                          >
                            {/* Card content */}
                            <div className="w-full h-full relative overflow-hidden rounded-[20px]">
                              {/* Placeholder/Loading state */}
                              {!isImageLoaded(item.imageUrl) && !hasImageError(item.imageUrl) && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-500 ease-out">
                                  <div className="text-center text-gray-500">
                                    <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 transition-all duration-300"></div>
                                    <div className="text-sm font-medium opacity-80 animate-pulse">Завантаження зображення...</div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Error state */}
                              {hasImageError(item.imageUrl) && (
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                                  <div className="text-center text-gray-600">
                                    <div className="text-2xl mb-2">🖼️</div>
                                    <div className="text-sm font-medium">Зображення недоступне</div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Main image with smooth loading animation */}
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                                  isImageLoaded(item.imageUrl) ? 'opacity-100' : 'opacity-0'
                                }`}
                                loading="lazy"
                                style={{
                                  filter: isActive ? 'brightness(1.05)' : 'brightness(0.95)',
                                  transform: isImageLoaded(item.imageUrl) ? 'scale(1)' : 'scale(1.02)',
                                  transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                                draggable={false}
                                onLoad={() => handleImageLoad(item.imageUrl)}
                                onError={() => handleImageError(item.imageUrl)}
                              />
                              
                              {/* Gradient overlay */}
                              <div className="absolute inset-0" style={getGradientOverlayStyles()}></div>
                              
                              {/* Always visible title */}
                              <div className="absolute bottom-0 left-0 right-0 p-4" style={getTextStyles()}>
                                <h3 className="text-lg font-semibold mb-1 sf-heading">
                                  {item.title}
                                </h3>
                                
                                {/* Show details button for active card */}
                                {isActive && !isExpanded && (
                                  <button 
                                    className="flex items-center text-sm opacity-80 hover:opacity-100 smooth-transition"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedCard(index);
                                    }}
                                  >
                                    <span>Деталі</span>
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                  </button>
                                )}
                              </div>
                              
                              {/* Expandable details */}
                              {isExpanded && (
                                <div 
                                  className="absolute inset-0 flex flex-col justify-end"
                                  style={{
                                    ...getGradientOverlayStyles(),
                                    background: carouselStyle === 'glass' 
                                      ? 'linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.3))'
                                      : carouselStyle === 'neon'
                                      ? 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6))'
                                      : 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))'
                                  }}
                                >
                                  <div className="p-4" style={getTextStyles()}>
                                    <h3 className="text-xl font-semibold mb-3 sf-heading">
                                      {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed mb-4 sf-body opacity-90">
                                      {item.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <button
                                        onClick={(e) => handleCTAClick(item, e)}
                                        className="inline-flex items-center justify-center rounded-full font-medium 
                                                 py-2 px-4 text-sm smooth-transition"
                                        style={getButtonStyles()}
                                      >
                                        <span className="font-medium sf-body">
                                          {ctaLabels[item.title] || "Дізнатися"}
                                        </span>
                                        <ExternalLink className="h-3 w-3 ml-1.5" />
                                      </button>
                                      
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedCard(null);
                                        }}
                                        className="opacity-60 hover:opacity-100 smooth-transition"
                                      >
                                        <ChevronDown className="w-4 h-4 rotate-180" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Стрілка вправо - фіксована позиція */}
              <div className="carousel-nav-arrow">
                <button 
                  onClick={() => {
                    goToNext();
                    onClickSound?.();
                  }}
                  onMouseEnter={onHoverSound}
                  className="text-[#4a4b57] p-2 sm:p-2.5 lg:p-3 rounded-full smooth-transition focus:outline-none group hover:scale-110"
                  style={getCarouselStyles()}
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Simple dot indicators з покращеним центруванням */}
          <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center justify-center space-x-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setExpandedCard(null);
                    onClickSound?.();
                    onTransitionSound?.();
                  }}
                  onMouseEnter={onHoverSound}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full smooth-transition ${
                    index === activeIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  style={{
                    boxShadow: index === activeIndex 
                      ? '0 2px 8px rgba(0,0,0,0.3)' 
                      : '0 1px 4px rgba(0,0,0,0.2)'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Swipe hint для мобільних користувачів з покращеним центруванням */}
          <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2 z-10 sm:hidden">
            <div className="flex items-center justify-center space-x-2 text-white/60 text-xs px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
              <span>←</span>
              <span>Гортайте пальцем</span>
              <span>→</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Симетричне позиціонування карточок з покращеною адаптивністю та логікою відображення
const calculatePositions = (index: number, activeIndex: number, totalItems: number, currentScreenSize: number) => {
  const relativePosition = index - activeIndex;
  
  // Нормалізуємо позицію для циклічного відображення
  let normalizedPosition = relativePosition;
  if (normalizedPosition > totalItems / 2) {
    normalizedPosition -= totalItems;
  } else if (normalizedPosition < -totalItems / 2) {
    normalizedPosition += totalItems;
  }
  
  let transform = 'translateZ(0) scale(1)';
  let opacity = 1;
  let zIndex = 10;
  
  // Адаптивні значення для різних розмірів екрану
  const getResponsiveValues = () => {
    if (currentScreenSize < 640) { // Mobile
      return {
        baseSpacing: 140,
        depthSpacing: 20,
        scaleStep: 0.2,
        opacityStep: 0.2,
        rotationAngle: 12
      };
    } else if (currentScreenSize < 1024) { // Tablet
      return {
        baseSpacing: 170,
        depthSpacing: 25,
        scaleStep: 0.18,
        opacityStep: 0.18,
        rotationAngle: 14
      };
    } else { // Desktop
      return {
        baseSpacing: 200,
        depthSpacing: 30,
        scaleStep: 0.15,
        opacityStep: 0.15,
        rotationAngle: 15
      };
    }
  };
  
  const { baseSpacing, depthSpacing, scaleStep, opacityStep, rotationAngle } = getResponsiveValues();
  
  // Логіка красивого відображення каруселі
  const getVisibilityLogic = () => {
    if (totalItems <= 1) {
      // 1 карточка - тільки центральна
      return { maxVisible: 1, hidePositions: [] };
    } else if (totalItems === 2) {
      // 2 карточки - перша головна, друга ззаду
      return { maxVisible: 1, hidePositions: [1, -1] };
    } else if (totalItems === 3) {
      // 3 карточки - всі демонструються
      return { maxVisible: 3, hidePositions: [] };
    } else if (totalItems === 4) {
      // 4 карточки - 3 демонструються, 1 ховається ззаду
      return { maxVisible: 3, hidePositions: [2, -2] };
    } else if (totalItems === 5) {
      // 5 карточок - всі демонструються
      return { maxVisible: 5, hidePositions: [] };
    } else if (totalItems === 6) {
      // 6 карточок - 5 демонструються, 1 ховається ззаду
      return { maxVisible: 5, hidePositions: [3, -3] };
    } else if (totalItems === 7) {
      // 7 карточок - 5 демонструються, 2 ховаються ззаду
      return { maxVisible: 5, hidePositions: [3, -3] };
    } else if (totalItems === 8) {
      // 8 карточок - 5 демонструються, 3 ховаються ззаду
      return { maxVisible: 5, hidePositions: [3, -3] };
    } else {
      // Більше 8 карточок - завжди 5 спереду, решта ззаду
      return { maxVisible: 5, hidePositions: [3, -3] };
    }
  };
  
  const { hidePositions } = getVisibilityLogic();
  
  // Перевіряємо чи потрібно ховати цю позицію ззаду
  const shouldHidePosition = (pos: number) => {
    if (totalItems === 2) {
      return Math.abs(pos) >= 1 && pos !== 0;
    } else if (totalItems === 4) {
      return Math.abs(pos) >= 2;
    } else if (totalItems >= 6) {
      return Math.abs(pos) >= 3;
    }
    return false;
  };
  
  // Якщо карточка має бути схована ззаду
  if (shouldHidePosition(normalizedPosition)) {
    return {
      transform: 'translateX(0) translateZ(-150px) scale(0.4)',
      opacity: 0.1,
      zIndex: 1
    };
  }
  
  // Ідеально симетричне позиціонування для видимих карточок
  if (normalizedPosition === 0) {
    // Центральний активний елемент
    transform = 'translateX(0) translateZ(50px) scale(1)';
    opacity = 1;
    zIndex = 10;
  } else if (normalizedPosition === 1) {
    // Перший елемент праворуч - точно симетрично до лівого
    transform = `translateX(${baseSpacing}px) translateZ(-${depthSpacing}px) scale(${1 - scaleStep}) rotateY(-${rotationAngle}deg)`;
    opacity = 1 - opacityStep;
    zIndex = 9;
  } else if (normalizedPosition === -1) {
    // Перший елемент ліворуч - точно симетрично до правого
    transform = `translateX(-${baseSpacing}px) translateZ(-${depthSpacing}px) scale(${1 - scaleStep}) rotateY(${rotationAngle}deg)`;
    opacity = 1 - opacityStep;
    zIndex = 9;
  } else if (normalizedPosition === 2) {
    // Другий елемент праворуч
    transform = `translateX(${baseSpacing * 2}px) translateZ(-${depthSpacing * 2}px) scale(${1 - scaleStep * 2}) rotateY(-${rotationAngle * 1.5}deg)`;
    opacity = 1 - opacityStep * 2;
    zIndex = 8;
  } else if (normalizedPosition === -2) {
    // Другий елемент ліворуч - точно симетрично до правого
    transform = `translateX(-${baseSpacing * 2}px) translateZ(-${depthSpacing * 2}px) scale(${1 - scaleStep * 2}) rotateY(${rotationAngle * 1.5}deg)`;
    opacity = 1 - opacityStep * 2;
    zIndex = 8;
  } else {
    // Приховуємо елементи що не поміщаються
    opacity = 0;
    zIndex = 0;
    transform = 'translateX(0) translateZ(-100px) scale(0.3)';
  }
  
  return { transform, opacity, zIndex };
};

export default Carousel3D;
