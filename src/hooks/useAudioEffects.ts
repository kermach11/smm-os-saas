import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioEffectsConfig {
  volume: number;
  enabled: boolean;
}

interface AudioFiles {
  hover?: string;
  click?: string;
  transition?: string;
  background?: string;
}

export const useAudioEffects = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Ініціалізація аудіо файлів
  useEffect(() => {
    initializeAudioFiles();
    loadAudioSettings();
  }, []);

  const initializeAudioFiles = useCallback(() => {
    const audioFiles: AudioFiles = {
      hover: '/audio/hover.mp3',
      click: '/audio/click.mp3',
      transition: '/audio/transition.mp3',
      background: '/audio/background.mp3'
    };

    Object.entries(audioFiles).forEach(([key, src]) => {
      if (src) {
        const audio = new Audio();
        audio.src = src;
        audio.volume = volume;
        audio.preload = 'auto';
        
        // Обробка помилок завантаження
        audio.onerror = () => {
          console.warn(`Не вдалося завантажити аудіо файл: ${src}`);
        };
        
        audioRefs.current[key] = audio;
      }
    });
  }, [volume]);

  const loadAudioSettings = useCallback(() => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.audioSettings) {
          setIsEnabled(data.audioSettings.enabled ?? true);
          setVolume(data.audioSettings.volume ?? 0.5);
        }
      }
    } catch (error) {
      console.error('Помилка завантаження налаштувань аудіо:', error);
    }
  }, []);

  const saveAudioSettings = useCallback(() => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      const data = savedData ? JSON.parse(savedData) : {};
      
      data.audioSettings = {
        enabled: isEnabled,
        volume: volume
      };
      
      localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
    } catch (error) {
      console.error('Помилка збереження налаштувань аудіо:', error);
    }
  }, [isEnabled, volume]);

  // Збереження налаштувань при зміні
  useEffect(() => {
    saveAudioSettings();
  }, [isEnabled, volume, saveAudioSettings]);

  // Оновлення гучності всіх аудіо файлів
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.volume = volume;
      }
    });
  }, [volume]);

  const playSound = useCallback((soundType: keyof AudioFiles) => {
    if (!isEnabled) return;
    
    const audio = audioRefs.current[soundType];
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn(`Не вдалося відтворити звук ${soundType}:`, error);
        });
      } catch (error) {
        console.warn(`Помилка відтворення звуку ${soundType}:`, error);
      }
    }
  }, [isEnabled]);

  const playHoverSound = useCallback(() => {
    playSound('hover');
  }, [playSound]);

  const playClickSound = useCallback(() => {
    playSound('click');
  }, [playSound]);

  const playTransitionSound = useCallback(() => {
    playSound('transition');
  }, [playSound]);

  const playBackgroundMusic = useCallback(() => {
    if (!isEnabled) return;
    
    const audio = audioRefs.current.background;
    if (audio) {
      try {
        audio.loop = true;
        audio.play().catch(error => {
          console.warn('Не вдалося відтворити фонову музику:', error);
        });
      } catch (error) {
        console.warn('Помилка відтворення фонової музики:', error);
      }
    }
  }, [isEnabled]);

  const stopBackgroundMusic = useCallback(() => {
    const audio = audioRefs.current.background;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setIsEnabled(prev => {
      const newState = !prev;
      
      // Якщо вимикаємо звук, зупиняємо фонову музику
      if (!newState) {
        stopBackgroundMusic();
      }
      
      return newState;
    });
  }, [stopBackgroundMusic]);

  const updateAudioFile = useCallback((type: keyof AudioFiles, file: File) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();
    audio.src = url;
    audio.volume = volume;
    audio.preload = 'auto';
    
    audio.onerror = () => {
      console.warn(`Не вдалося завантажити новий аудіо файл: ${file.name}`);
      URL.revokeObjectURL(url);
    };
    
    // Очищуємо попередній аудіо файл
    if (audioRefs.current[type]) {
      const oldAudio = audioRefs.current[type];
      if (oldAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(oldAudio.src);
      }
    }
    
    audioRefs.current[type] = audio;
  }, [volume]);

  // Очищення ресурсів при демонтажі
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        if (audio && audio.src.startsWith('blob:')) {
          URL.revokeObjectURL(audio.src);
        }
      });
    };
  }, []);

  return {
    isEnabled,
    volume,
    setVolume,
    toggleAudio,
    playHoverSound,
    playClickSound,
    playTransitionSound,
    playBackgroundMusic,
    stopBackgroundMusic,
    updateAudioFile,
    playSound
  };
}; 