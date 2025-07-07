import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  ResponsiveHeader, 
  ResponsiveMain, 
  ResponsiveCarousel, 
  ResponsiveText, 
  ShowOn, 
  HideOn 
} from '../components/ResponsiveContainer';
import { useResponsive } from '../hooks/useResponsive';
import Carousel3D from '../components/Carousel3D';
import { CarouselItem } from '../types/types';

// Приклад даних для каруселі
const sampleCarouselItems: CarouselItem[] = [
  {
    id: "1",
    title: "LINKCORE",
    description: "Мінімалістичний профіль-хаб",
    imageUrl: "/photo/photo-1.png",
    url: "#linkcore"
  },
  {
    id: "2", 
    title: "CASEMACHINE",
    description: "Сайт-кейсбук для проєктів",
    imageUrl: "/photo/photo-2.png",
    url: "#casemachine"
  },
  {
    id: "3",
    title: "BOOKME", 
    description: "Бронювання консультацій",
    imageUrl: "/photo/photo-3.png",
    url: "/bookme"
  }
];

const ResponsiveMainExample: React.FC = () => {
  const { deviceType, isMobile, isTablet, isDesktop, config } = useResponsive();

  return (
    <ResponsiveMain 
      fullWidth 
      fullHeight 
      centerContent 
      animated
      className="main-screen-example"
    >
      {/* Заголовок з адаптивними налаштуваннями */}
      <ResponsiveHeader 
        animated 
        animationDelay={0.2}
        centerContent
        className="mb-8"
      >
        {/* Логотип - показуємо тільки на desktop */}
        <ShowOn devices={['desktop']}>
          <div className="logo-container mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ width: config.logoSize, height: config.logoSize }}
              />
            </motion.div>
          </div>
        </ShowOn>

        {/* Заголовки з автоматичною адаптацією */}
        <ResponsiveText 
          as="h1" 
          textType="title" 
          animated 
          animationDelay={0.3}
          className="text-white font-bold text-center mb-4"
        >
          Усе що треба
        </ResponsiveText>

        <ResponsiveText 
          as="h2" 
          textType="subtitle" 
          animated 
          animationDelay={0.4}
          className="text-white/90 text-center mb-6"
        >
          для твого SMM
        </ResponsiveText>

        <ResponsiveText 
          as="p" 
          textType="description" 
          animated 
          animationDelay={0.5}
          className="text-white/80 text-center max-w-2xl mx-auto"
        >
          Професійні інструменти в одному місці
        </ResponsiveText>
      </ResponsiveHeader>

      {/* Карусель з адаптивними налаштуваннями */}
      <ResponsiveCarousel 
        animated 
        animationDelay={0.6}
        className="carousel-container"
        // Різні налаштування для різних пристроїв
        mobileProps={{
          style: { 
            padding: '16px',
            marginTop: '24px' 
          }
        }}
        tabletProps={{
          style: { 
            padding: '24px',
            marginTop: '32px' 
          }
        }}
        desktopProps={{
          style: { 
            padding: '32px',
            marginTop: '40px' 
          }
        }}
      >
        <Carousel3D 
          items={sampleCarouselItems}
          onSelectItem={(item) => console.log('Selected item:', item)}
        />
      </ResponsiveCarousel>

      {/* Додаткова інформація - приховуємо на мобільних */}
      <HideOn devices={['mobile']}>
        <ResponsiveContainer 
          animated 
          animationDelay={0.8}
          className="mt-8 text-center"
        >
          <ResponsiveText 
            as="p" 
            textType="small" 
            className="text-white/60"
          >
            Натисніть на картку для детальної інформації
          </ResponsiveText>
        </ResponsiveContainer>
      </HideOn>

      {/* Показуємо додаткові кнопки тільки на мобільних */}
      <ShowOn devices={['mobile']}>
        <ResponsiveContainer 
          animated 
          animationDelay={0.9}
          className="mt-6 flex justify-center space-x-4"
        >
          <ResponsiveContainer 
            containerType="button"
            className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3"
          >
            <ResponsiveText 
              as="span" 
              textType="secondary" 
              className="text-white font-medium"
            >
              Дізнатися більше
            </ResponsiveText>
          </ResponsiveContainer>
        </ResponsiveContainer>
      </ShowOn>

      {/* Налаштування для різних орієнтацій */}
      <ResponsiveContainer 
        showOn={['mobile']}
        className="fixed bottom-4 right-4"
      >
        <ResponsiveText 
          as="div" 
          textType="small" 
          className="text-white/50"
        >
          {deviceType === 'mobile' ? '📱' : deviceType === 'tablet' ? '💻' : '🖥️'} 
          {deviceType.toUpperCase()}
        </ResponsiveText>
      </ResponsiveContainer>
    </ResponsiveMain>
  );
};

export default ResponsiveMainExample; 