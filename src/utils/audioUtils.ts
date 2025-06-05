// Утилітарні функції для роботи зі звуками

export interface AudioSettings {
  enabled: boolean;
  url: string;
  volume: number;
}

// Кеш для аудіо файлів
const audioCache = new Map<string, HTMLAudioElement>();

// Функція для виправлення MIME-типу аудіо файлів
const fixAudioMimeType = (url: string): string => {
  if (!url.startsWith('data:application/octet-stream')) {
    return url; // Вже правильний MIME-тип
  }

  try {
    // Визначаємо тип файлу за сигнатурою
    const base64Data = url.split(',')[1];
    if (!base64Data) return url;
    
    const binaryString = atob(base64Data.substring(0, 20));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Перевіряємо сигнатури файлів
    if (bytes[0] === 0xFF && (bytes[1] === 0xFB || bytes[1] === 0xF3 || bytes[1] === 0xF2)) {
      // MP3 файл
      return url.replace('data:application/octet-stream', 'data:audio/mpeg');
    } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      // WAV файл (RIFF header)
      return url.replace('data:application/octet-stream', 'data:audio/wav');
    } else if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
      // OGG файл
      return url.replace('data:application/octet-stream', 'data:audio/ogg');
    } else if (bytes[0] === 0x66 && bytes[1] === 0x74 && bytes[2] === 0x79 && bytes[3] === 0x70) {
      // M4A файл
      return url.replace('data:application/octet-stream', 'data:audio/mp4');
    } else {
      // За замовчуванням припускаємо MP3
      return url.replace('data:application/octet-stream', 'data:audio/mpeg');
    }
  } catch (error) {
    console.error('❌ fixAudioMimeType: Помилка виправлення MIME-типу:', error);
    // Якщо не вдалося визначити, припускаємо MP3
    return url.replace('data:application/octet-stream', 'data:audio/mpeg');
  }
};

// Функція для швидкого відтворення звуку
export const playSound = (settings: AudioSettings): void => {
  if (!settings.enabled || !settings.url) {
    return;
  }

  try {
    // Виправляємо MIME-тип перед створенням аудіо елемента
    const correctedUrl = fixAudioMimeType(settings.url);
    
    // Створюємо новий аудіо елемент для кожного відтворення
    const audio = new Audio(correctedUrl);
    audio.volume = Math.max(0, Math.min(1, settings.volume));
    audio.currentTime = 0;
    
    // Миттєве відтворення
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Тихо ігноруємо помилки автозапуску
      });
    }
    
    // Очищуємо пам'ять після завершення
    audio.addEventListener('ended', () => {
      audio.src = '';
      audio.load();
    });
    
    // Автоматичне видалення через 5 секунд (на випадок зависання)
    setTimeout(() => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.load();
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ playSound: Критична помилка:', error);
  }
};

// Функція для попереднього завантаження звуку
export const preloadSound = (url: string): void => {
  if (!url || audioCache.has(url)) {
    return;
  }

  try {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
    audio.load();
    audioCache.set(url, audio);
  } catch (error) {
    // Тихо ігноруємо помилки
  }
};

// Функція для очищення кешу
export const clearAudioCache = (): void => {
  audioCache.forEach((audio) => {
    audio.pause();
    audio.src = '';
    audio.load();
  });
  audioCache.clear();
}; 