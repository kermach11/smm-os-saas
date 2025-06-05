// 🎵 Конфігурація аудіо системи
export const audioConfig = {
  // Режим з реальною музикою через Web Audio API
  realMusic: {
    useRealAudioFirst: true,
    fallbackToWebAudio: true,
    oscillatorFrequency: 220,
    oscillatorType: 'sine' as const,
    volume: 0.7,
    fadeInDuration: 1200,
    fadeOutDuration: 800,
  },
  
  // Тихий режим (тільки осцилятор)
  silent: {
    useRealAudioFirst: false,
    fallbackToWebAudio: true,
    oscillatorFrequency: 220,
    oscillatorType: 'sine' as const,
    volume: 0.05,
    fadeInDuration: 800,
    fadeOutDuration: 600,
  },
  
  // Тільки Web Audio API (без спроб завантажити файл)
  webAudioOnly: {
    useRealAudioFirst: false,
    fallbackToWebAudio: true,
    oscillatorFrequency: 440,
    oscillatorType: 'triangle' as const,
    volume: 0.3,
    fadeInDuration: 1000,
    fadeOutDuration: 600,
  },
  
  // Демо режим (швидкі таймаути)
  demo: {
    useRealAudioFirst: true,
    fallbackToWebAudio: true,
    oscillatorFrequency: 330,
    oscillatorType: 'sawtooth' as const,
    volume: 0.4,
    fadeInDuration: 500,
    fadeOutDuration: 300,
  }
};

// Пресети для швидкого доступу
export const audioPresets = {
  production: audioConfig.realMusic,
  development: audioConfig.demo,
  silent: audioConfig.silent,
  testing: audioConfig.webAudioOnly,
};

// Поточна конфігурація (можна змінювати динамічно)
export const currentAudioConfig = audioConfig.realMusic;

// 🎵 Функція для легкої зміни конфігурації
export const getAudioConfig = (preset?: keyof typeof audioPresets) => {
  if (preset && audioPresets[preset]) {
    return audioPresets[preset];
  }
  return audioConfig.realMusic;
}; 