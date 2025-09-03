import React, { useEffect, useRef } from 'react';

interface StandardVideoPlayerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  onPlay?: () => void;
  onError?: (error: any) => void;
  onLoadStart?: () => void;
  onCanPlay?: () => void;
  onLoadedData?: () => void;
  onCanPlayThrough?: () => void;
  context?: string; // Для логування
}

const StandardVideoPlayer: React.FC<StandardVideoPlayerProps> = ({
  src,
  className = "absolute inset-0 w-full h-full object-cover",
  style = {},
  onPlay,
  onError,
  onLoadStart,
  onCanPlay,
  onLoadedData,
  onCanPlayThrough,
  context = "VideoPlayer"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Стандартна логіка ініціалізації відео
  useEffect(() => {
    const initVideo = async () => {
      if (!src || !videoRef.current) return;

      const video = videoRef.current;
      console.log(`🎬 ${context}: Ініціалізація відео:`, src);

      // Стандартні налаштування для автозапуску
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'auto';

      // Детекція мобільного пристрою
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

      if (isMobile) {
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
      }

      // Спроба автозапуску
      try {
        await video.play();
        console.log(`✅ ${context}: Відео запущено автоматично`);
      } catch (error) {
        console.log(`⚠️ ${context}: Автозапуск заблоковано, додаємо слухачі взаємодії`);
        
        // Функція для запуску відео при першій взаємодії
        const playVideoOnInteraction = async () => {
          try {
            await video.play();
            console.log(`✅ ${context}: Відео запущено через взаємодію`);
            // Видаляємо слухачі після успішного запуску
            document.removeEventListener('touchstart', playVideoOnInteraction);
            document.removeEventListener('click', playVideoOnInteraction);
            document.removeEventListener('keydown', playVideoOnInteraction);
          } catch (err) {
            console.log(`⚠️ ${context}: Спроба запуску відео не вдалася:`, err);
          }
        };

        // Додаємо слухачі для взаємодії
        document.addEventListener('touchstart', playVideoOnInteraction, { once: true, passive: true });
        document.addEventListener('click', playVideoOnInteraction, { once: true, passive: true });
        document.addEventListener('keydown', playVideoOnInteraction, { once: true, passive: true });
      }
    };

    initVideo();
  }, [src, context]);

  // Стилі за замовчуванням
  const defaultStyle: React.CSSProperties = {
    pointerEvents: 'none',
    objectFit: 'cover',
    zIndex: -1,
    ...style
  };

  return (
    <video
      ref={videoRef}
      className={className}
      style={defaultStyle}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      disableRemotePlayback
      onPlay={onPlay}
      onError={onError}
      onLoadStart={onLoadStart}
      onCanPlay={onCanPlay}
      onLoadedData={onLoadedData}
      onCanPlayThrough={onCanPlayThrough}
      onContextMenu={(e) => e.preventDefault()}
      onDoubleClick={(e) => e.preventDefault()}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default StandardVideoPlayer; 