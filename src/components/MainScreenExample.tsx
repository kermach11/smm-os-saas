import React from 'react';
import { motion } from 'framer-motion';
import { 
  SmartLogoBox, 
  SoundToggleBox, 
  SmartHeaderTextBox, 
  CarouselBox, 
  SmartPaginationBox,
  SmartAdminButtonBox
} from './MainScreenBoxes';
import SoundToggle from './SoundToggle';
import Carousel3D from './Carousel3D';
import { useResponsive } from '../hooks/useResponsive';

// Приклад використання нової адаптивної системи
interface MainScreenExampleProps {
  visible: boolean;
  userInteracted?: boolean;
  // Дані для контенту
  logoUrl?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  carouselItems?: any[];
  carouselActiveIndex?: number;
  // Звукові налаштування
  isBackgroundMusicEnabled?: boolean;
  playHoverSound?: () => void;
  playClickSound?: () => void;
  playCarouselHoverSound?: () => void;
  playCarouselClickSound?: () => void;
  playCarouselTransitionSound?: () => void;
  // Carousel налаштування
  carouselSettings?: {
    carouselStyle?: string;
    animationSpeed?: number;
    showParticles?: boolean;
    particleColor?: string;
    brandColor?: string;
    accentColor?: string;
  };
  // Функції обробки подій
  onItemSelect?: (item: any) => void;
  onPaginationClick?: (index: number) => void;
  onCarouselIndexChange?: (index: number) => void;
  toggleBackgroundMusic?: () => void;
  trackClick?: (selector: string, event: string) => void;
  // Admin функції
  shouldShowAdminButton?: () => boolean;
  onAdminButtonClick?: () => void;
}

export const MainScreenExample: React.FC<MainScreenExampleProps> = ({
  visible,
  userInteracted = false,
  logoUrl,
  headerTitle = "Усе що треба",
  headerSubtitle = "для твого SMM",
  headerDescription = "Професійні інструменти в одному місці",
  carouselItems = [],
  carouselActiveIndex = 0,
  isBackgroundMusicEnabled = false,
  playHoverSound = () => {},
  playClickSound = () => {},
  playCarouselHoverSound = () => {},
  playCarouselClickSound = () => {},
  playCarouselTransitionSound = () => {},
  carouselSettings = {},
  onItemSelect = () => {},
  onPaginationClick = () => {},
  onCarouselIndexChange = () => {},
  toggleBackgroundMusic = () => {},
  trackClick = () => {},
  shouldShowAdminButton = () => false,
  onAdminButtonClick = () => {}
}) => {
  const { deviceType, config } = useResponsive();

  if (!visible) return null;

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background - такий же як в оригінальному MainScreen */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* ===== НОВА СИСТЕМА БОКСІВ ===== */}

      {/* БОКС 1: Логотип/Header */}
      <SmartLogoBox
        logoUrl={logoUrl}
        logoSize={config.logoSize}
        onMouseEnter={playHoverSound}
        onClick={() => {
          console.log('🖼️ MainScreen: Клік по логотипу, deviceType:', deviceType, 'logoUrl:', logoUrl);
          trackClick('#main-logo', 'Main Logo Click');
        }}
      >
        {/* children не потрібен для SmartLogoBox */}
      </SmartLogoBox>

      {/* БОКС 2: Sound Toggle */}
      <SoundToggleBox
        onMouseEnter={playHoverSound}
      >
        <SoundToggle 
          isOn={isBackgroundMusicEnabled} 
          onToggle={() => {
            toggleBackgroundMusic();
            trackClick('#sound-toggle', `Sound Toggle: ${!isBackgroundMusicEnabled ? 'On' : 'Off'}`);
          }} 
          isLoaded={true}
          onMouseEnter={playHoverSound}
          onClick={playClickSound}
        />
      </SoundToggleBox>

      {/* БОКС 3: Header Text */}
      <SmartHeaderTextBox
        title={headerTitle}
        subtitle={headerSubtitle}
        description={headerDescription}
        titleProps={{
          onClick: () => trackClick('#main-title', `Main Title Click: ${headerTitle}`)
        }}
        subtitleProps={{
          onClick: () => trackClick('#main-subtitle', `Main Subtitle Click: ${headerSubtitle}`)
        }}
        descriptionProps={{
          onClick: () => trackClick('#main-description', `Main Description Click: ${headerDescription}`)
        }}
        onMouseEnter={playHoverSound}
      />

      {/* БОКС 4: Carousel */}
      <CarouselBox>
        <div className="w-full h-full">
          <Carousel3D 
            items={carouselItems} 
            onSelectItem={onItemSelect}
            carouselStyle={carouselSettings.carouselStyle}
            animationSpeed={carouselSettings.animationSpeed}
            showParticles={carouselSettings.showParticles}
            particleColor={carouselSettings.particleColor}
            brandColor={carouselSettings.brandColor}
            accentColor={carouselSettings.accentColor}
            onHoverSound={playCarouselHoverSound}
            onClickSound={playCarouselClickSound}
            onTransitionSound={playCarouselTransitionSound}
            onActiveIndexChange={onCarouselIndexChange}
          />
        </div>
      </CarouselBox>

      {/* БОКС 5: Pagination */}
      {carouselItems.length > 1 && (
        <SmartPaginationBox
          items={carouselItems}
          activeIndex={carouselActiveIndex}
          onItemClick={onPaginationClick}
          dotSize={deviceType === 'mobile' ? 'small' : deviceType === 'tablet' ? 'medium' : 'large'}
          onMouseEnter={playHoverSound}
        />
      )}

      {/* БОКС 6: Admin Button */}
      {shouldShowAdminButton() && (
        <SmartAdminButtonBox
          onClick={(e) => {
            onAdminButtonClick();
            playClickSound();
            trackClick('#admin-panel-button', 'Admin Panel Access');
          }}
          onMouseEnter={playHoverSound}
          icon="⚙️"
          badge={false}
          badgeCount={0}
        />
      )}

      {/* МОБІЛЬНИЙ ФІКС: Невидиме muted відео для активації контексту */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hidden"
        style={{ 
          display: 'none', 
          width: '1px', 
          height: '1px',
          position: 'fixed',
          top: '-1000px',
          left: '-1000px',
          zIndex: -999,
          visibility: 'hidden',
          opacity: 0
        }}
        src="data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWRhdGEAAAABAAEAAAEAA"
        onCanPlay={() => console.log('🎬 Невидиме відео: готове до програвання')}
        onPlay={() => console.log('✅ Невидиме відео: грає - активую аудіо контекст')}
      />
    </div>
  );
};

// Порівняння старого та нового коду
export const ComparisonExample = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🔄 Порівняння: Стара vs Нова система
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Старий код */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-800">❌ Стара система</h2>
            <pre className="text-sm bg-red-100 p-4 rounded overflow-x-auto">
{`// Складна логіка в MainScreen.tsx
<motion.header 
  className="absolute top-4 sm:top-6 lg:top-8 xl:top-10 inset-x-0 flex justify-center px-4 z-20"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
>
  {logoUrl ? (
    <motion.div
      className="flex items-center justify-center cursor-pointer select-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={playHoverSound}
      onClick={() => {
        console.log('🖼️ MainScreen: Клік по логотипу');
        trackClick('#main-logo', 'Main Logo Click');
      }}
    >
      <img
        src={logoUrl}
        alt="Logo"
        className="object-contain"
        style={{
          width: \`\${logoSize}px\`,
          height: \`\${logoSize}px\`,
          maxWidth: '200px',
          maxHeight: '200px'
        }}
      />
    </motion.div>
  ) : (
    // Ще 50+ рядків коду для fallback...
  )}
</motion.header>`}
            </pre>
          </div>

          {/* Новий код */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-green-800">✅ Нова система</h2>
            <pre className="text-sm bg-green-100 p-4 rounded overflow-x-auto">
{`// Проста логіка з новою системою
<SmartLogoBox
  logoUrl={logoUrl}
  logoSize={config.logoSize}
  onMouseEnter={playHoverSound}
  onClick={() => {
    console.log('🖼️ MainScreen: Клік по логотипу');
    trackClick('#main-logo', 'Main Logo Click');
  }}
/>

// Все інше (позиція, розмір, анімація, стилі) 
// автоматично береться з конфігурації!`}
            </pre>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">🎯 Переваги нової системи:</h2>
          <ul className="space-y-2 text-blue-700">
            <li>✅ <strong>Централізована конфігурація</strong> - всі налаштування в одному файлі</li>
            <li>✅ <strong>Автоматична адаптивність</strong> - працює на всіх пристроях</li>
            <li>✅ <strong>Менше коду</strong> - замість 100+ рядків тепер 10 рядків</li>
            <li>✅ <strong>Легка підтримка</strong> - змінюєш конфігурацію і все оновлюється</li>
            <li>✅ <strong>Консистентність</strong> - однакова логіка для всіх боксів</li>
            <li>✅ <strong>TypeScript підтримка</strong> - повна типізація</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MainScreenExample; 