// Web Audio API утиліта для обходу autoplay політики
export class WebAudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private audioSources: Map<string, AudioBufferSourceNode> = new Map();
  private isInitialized = false;
  private activationListeners: Array<() => void> = [];

  constructor() {
    this.setupActivationListeners();
  }

  // Ініціалізація Web Audio Context
  private async initializeContext() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      console.log('✅ WebAudioManager: Context ініціалізовано');
    } catch (error) {
      console.warn('⚠️ WebAudioManager: Помилка ініціалізації контексту:', error);
    }
  }

  // Завантаження аудіо файлу
  async loadAudio(url: string, id: string): Promise<boolean> {
    if (!this.audioContext) {
      await this.initializeContext();
    }

    if (!this.audioContext) return false;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      this.audioBuffers.set(id, audioBuffer);
      console.log(`✅ WebAudioManager: Аудіо ${id} завантажено`);
      return true;
    } catch (error) {
      console.warn(`⚠️ WebAudioManager: Помилка завантаження ${id}:`, error);
      return false;
    }
  }

  // Програвання аудіо
  async playAudio(id: string, options: { loop?: boolean; volume?: number; singlePlay?: boolean } = {}): Promise<boolean> {
    if (!this.audioContext || !this.audioBuffers.has(id)) {
      console.warn(`⚠️ WebAudioManager: Аудіо ${id} не знайдено`);
      return false;
    }

    try {
      // Відновлюємо контекст якщо потрібно
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Зупиняємо попередній source
      if (this.audioSources.has(id)) {
        this.audioSources.get(id)?.stop();
        this.audioSources.delete(id);
      }

      // Створюємо новий source
      const source = this.audioContext.createBufferSource();
      source.buffer = this.audioBuffers.get(id)!;
      source.loop = options.loop || false;
      
      // Додаємо volume control
      if (options.volume !== undefined) {
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = options.volume;
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
      } else {
        source.connect(this.audioContext.destination);
      }

      // 🎵 ДОДАЄМО СЛУХАЧ ДЛЯ SINGLE PLAY
      if (options.singlePlay && !options.loop) {
        source.onended = () => {
          console.log(`🎵 WebAudioManager: [SINGLE PLAY] Аудіо ${id} закінчилося, зупиняємо і видаляємо`);
          this.audioSources.delete(id);
          // Додатково зупиняємо source (хоча він уже закінчився)
        };
      }

      // Запускаємо
      source.start(0);
      this.audioSources.set(id, source);
      
      console.log(`✅ WebAudioManager: Аудіо ${id} запущено${options.singlePlay ? ' [SINGLE PLAY MODE]' : ''}`);
      
      // 🎬 ДОМІНО ЕФЕКТ: Якщо звук запустився успішно, 
      // значить є user gesture - можемо запустити відео!
      console.log(`🎬 ДОМІНО ЕФЕКТ: Звук запущено успішно, тригеримо всі відео!`);
      this.triggerVideoDominoEffect();
      
      return true;
    } catch (error) {
      console.warn(`⚠️ WebAudioManager: Помилка запуску ${id}:`, error);
      return false;
    }
  }

  // Зупинка аудіо
  stopAudio(id: string) {
    if (this.audioSources.has(id)) {
      this.audioSources.get(id)?.stop();
      this.audioSources.delete(id);
      console.log(`🛑 WebAudioManager: Аудіо ${id} зупинено`);
    }
  }

  // Зупинка всіх аудіо
  stopAllAudio() {
    this.audioSources.forEach((source, id) => {
      source.stop();
      console.log(`🛑 WebAudioManager: Аудіо ${id} зупинено`);
    });
    this.audioSources.clear();
  }

  // Перевірка чи грає аудіо
  isAudioPlaying(id: string): boolean {
    return this.audioSources.has(id);
  }

  // Налаштування слухачів для активації
  private setupActivationListeners() {
    const activateAudio = async () => {
      if (!this.audioContext) {
        await this.initializeContext();
      }

      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
        console.log('✅ WebAudioManager: Контекст активовано через взаємодію');
        
        // Викликаємо зареєстровані колбеки
        this.activationListeners.forEach(listener => listener());
      }
    };

    // Агресивне слухання всіх можливих взаємодій
    const events = [
      'mousemove', 'mousedown', 'mouseup', 'click',
      'touchstart', 'touchend', 'touchmove',
      'scroll', 'wheel', 'keydown', 'keyup',
      'resize', 'focus', 'blur'
    ];

    events.forEach(event => {
      document.addEventListener(event, activateAudio, { 
        once: true,
        passive: true 
      });
    });

    // Також слухаємо візуальні зміни
    const observer = new IntersectionObserver(activateAudio, { threshold: 0.1 });
    
    // Спостерігаємо за body
    observer.observe(document.body);
  }

  // Реєстрація колбеку для активації
  onActivation(callback: () => void) {
    this.activationListeners.push(callback);
  }

  // Перевірка стану
  get isActive(): boolean {
    return this.audioContext?.state === 'running';
  }

  get isSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }

  // 🎬 ДОМІНО ЕФЕКТ: Тригер для запуску відео після успішного запуску звуку
  private triggerVideoDominoEffect() {
    try {
      console.log(`🎬 ДОМІНО ЕФЕКТ: Запускаємо всі відео через videoManager...`);
      
      // Запускаємо всі відео через публічний метод
      videoManager.playAllVideos().then(() => {
        console.log(`🎬 ДОМІНО ЕФЕКТ: Всі відео оброблено`);
      }).catch((error) => {
        console.warn(`🎬 ДОМІНО ЕФЕКТ: Помилка при запуску відео:`, error);
      });
      
    } catch (error) {
      console.warn(`🎬 ДОМІНО ЕФЕКТ: Помилка при тригері відео:`, error);
    }
  }
}

// Новий VideoManager для обходу autoplay політики відео
export class VideoManager {
  private videoElements: Map<string, HTMLVideoElement> = new Map();
  private isInitialized = false;
  private activationListeners: Array<() => void> = [];

  constructor() {
    this.setupActivationListeners();
  }

  // Спрощене створення фонового відео з МАКСИМАЛЬНОЮ агресивністю
  createBackgroundVideo(url: string, id: string): HTMLVideoElement {
    console.log(`🎬 VideoManager: [УЛЬТА-АГРЕСИВНИЙ ПІДХІД] Створюємо фонове відео з URL: ${url}`);
    
    // Видаляємо старе відео якщо існує
    this.removeVideo(id);
    
    const video = document.createElement('video');
    video.id = `video-${id}`;
    video.src = url;
    
    // МАКСИМАЛЬНО АГРЕСИВНІ АТРИБУТИ ДЛЯ ОБХОДУ AUTOPLAY БЛОКУВАННЯ
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.volume = 0;
    video.defaultMuted = true;
    video.preload = 'auto';
    
    // Додаткові атрибути для iOS та інших браузерів
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('x-webkit-airplay', 'allow');
    video.setAttribute('data-object-fit', 'cover');
    video.setAttribute('controls', 'false');
    video.setAttribute('disablePictureInPicture', 'true');
    video.setAttribute('disableRemotePlayback', 'true');
    
    // СТАНДАРТНІ СТИЛІ ДЛЯ ФОНОВОГО ВІДЕО
    video.style.cssText = `
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      z-index: -1 !important;
      pointer-events: none !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    // Додаємо CSS класи для фонового відео
    video.className = 'background-video';
    video.setAttribute('data-video-id', id);
    
    // Додаємо слухачі подій
    video.addEventListener('loadstart', () => {
      console.log(`🎬 VideoManager: [${id}] Загрузка почалась`);
    });
    
    video.addEventListener('canplay', () => {
      console.log(`🎬 VideoManager: [${id}] Готове до відтворення`);
      this.ensureVideoIsVisible(video, id);
    });
    
    video.addEventListener('play', () => {
      console.log(`🎬 VideoManager: [${id}] Подія PLAY`);
      this.logVideoInfo(video, id);
    });
    
    video.addEventListener('playing', () => {
      console.log(`🎬 VideoManager: [${id}] 🎬 ФАКТИЧНО ГРАЄ!`);
      this.logVideoInfo(video, id);
    });
    
    video.addEventListener('error', (e) => {
      console.error(`🎬 VideoManager: [${id}] ПОМИЛКА:`, e, video.error);
    });
    
    // Додаємо БЕЗПОСЕРЕДНЬО в body на початок
    document.body.insertBefore(video, document.body.firstChild);
    
    // Додаємо CSS правило в head для фонового відео
    this.addBackgroundVideoCSS();
    
    this.videoElements.set(id, video);
    
    console.log(`🎬 VideoManager: [${id}] Відео додано в DOM на позицію 0`);
    this.logDOMInfo(video, id);
    
    // УЛЬТРА-АГРЕСИВНИЙ ЗАПУСК ВІДЕО - КІЛЬКА СПРОБ
    setTimeout(() => {
      this.forcePlayVideo(id);
    }, 50);
    
    setTimeout(() => {
      this.forcePlayVideo(id);
    }, 200);
    
    setTimeout(() => {
      this.forcePlayVideo(id);
    }, 500);
    
    // Також пробуємо запустити при завантаженні метаданих
    video.addEventListener('loadedmetadata', () => {
      console.log(`🎬 VideoManager: [${id}] Метадані завантажено, пробуємо запуск`);
      this.forcePlayVideo(id);
    });
    
    // І при готовності до відтворення
    video.addEventListener('canplaythrough', () => {
      console.log(`🎬 VideoManager: [${id}] Готове до повного відтворення, пробуємо запуск`);
      this.forcePlayVideo(id);
    });
    
    return video;
  }

  // Додаємо CSS правило для фонового відео
  private addBackgroundVideoCSS(): void {
    const existingStyle = document.getElementById('background-video-style');
    if (existingStyle) return;
    
    const style = document.createElement('style');
    style.id = 'background-video-style';
    style.textContent = `
      .background-video {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: -1 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        object-fit: cover !important;
        pointer-events: none !important;
      }
      
      /* Забезпечуємо правильне позиціонування */
      video[data-video-id] {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: -1 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        object-fit: cover !important;
        pointer-events: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Примусове відтворення відео
  private async forcePlayVideo(id: string): Promise<void> {
    const video = this.videoElements.get(id);
    if (!video) return;
    
    console.log(`🎬 VideoManager: [${id}] ПРИМУСОВИЙ ЗАПУСК`);
    
    try {
      await video.play();
      console.log(`🎬 VideoManager: [${id}] ✅ Примусовий запуск успішний`);
      this.ensureVideoIsVisible(video, id);
    } catch (error) {
      console.warn(`🎬 VideoManager: [${id}] ⚠️ Примусовий запуск заблоковано:`, error);
    }
  }

  // Перевірка видимості відео
  private ensureVideoIsVisible(video: HTMLVideoElement, id: string): void {
    console.log(`🎬 VideoManager: [${id}] Перевіряємо видимість відео`);
    
    const rect = video.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(video);
    
    console.log(`🎬 VideoManager: [${id}] Позиція:`, {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      zIndex: computedStyle.zIndex,
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity
    });
    
    // Переконуємось що стилі застосовані правильно
    if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0') {
      console.warn(`🎬 VideoManager: [${id}] 🚨 ВІДЕО ПРИХОВАНО! Виправляємо...`);
      video.style.display = 'block !important';
      video.style.visibility = 'visible !important';
      video.style.opacity = '1 !important';
    }
    
    if (rect.width === 0 || rect.height === 0) {
      console.warn(`🎬 VideoManager: [${id}] 🚨 ВІДЕО БЕЗ РОЗМІРІВ! Виправляємо...`);
      video.style.width = '100vw !important';
      video.style.height = '100vh !important';
    }
  }

  // Логування інформації про відео
  private logVideoInfo(video: HTMLVideoElement, id: string): void {
    console.log(`🎬 VideoManager: [${id}] Інформація:`, {
      paused: video.paused,
      ended: video.ended,
      currentTime: video.currentTime,
      duration: video.duration,
      readyState: video.readyState,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      src: video.src
    });
  }

  // Логування DOM інформації
  private logDOMInfo(video: HTMLVideoElement, id: string): void {
    console.log(`🎬 VideoManager: [${id}] DOM інформація:`, {
      inDocument: document.contains(video),
      parentElement: video.parentElement?.tagName,
      nextSibling: video.nextElementSibling?.tagName,
      previousSibling: video.previousElementSibling?.tagName,
      elementIndex: Array.from(document.body.children).indexOf(video)
    });
  }

  // Програвання відео
  async playVideo(id: string): Promise<boolean> {
    const video = this.videoElements.get(id);
    if (!video) {
      console.warn(`🎬 VideoManager: [${id}] Відео не знайдено`);
      return false;
    }

    console.log(`🎬 VideoManager: [${id}] Спроба запуску відео`);
    
    try {
      if (!video.paused) {
        console.log(`🎬 VideoManager: [${id}] Відео вже грає`);
        this.ensureVideoIsVisible(video, id);
        return true;
      }

      await video.play();
      console.log(`🎬 VideoManager: [${id}] ✅ Відео запущено успішно`);
      this.ensureVideoIsVisible(video, id);
      return true;
    } catch (error: any) {
      console.error(`🎬 VideoManager: [${id}] ❌ Помилка запуску:`, error);
      return false;
    }
  }

  // Видалення відео
  removeVideo(id: string): void {
    const video = this.videoElements.get(id);
    if (video) {
      console.log(`🎬 VideoManager: [${id}] Видаляємо відео`);
      video.pause();
      video.remove();
      this.videoElements.delete(id);
    }
  }

  // Отримання відео
  getVideo(id: string): HTMLVideoElement | undefined {
    return this.videoElements.get(id);
  }

  // Статус відео
  getVideoStatus(id: string): { exists: boolean; playing: boolean; paused: boolean; ended: boolean; currentTime: number; duration: number; visible: boolean } {
    const video = this.videoElements.get(id);
    if (!video) {
      return { exists: false, playing: false, paused: true, ended: false, currentTime: 0, duration: 0, visible: false };
    }
    
    const rect = video.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(video);
    const visible = computedStyle.display !== 'none' && 
                   computedStyle.visibility !== 'hidden' && 
                   computedStyle.opacity !== '0' &&
                   rect.width > 0 && rect.height > 0;
    
    return {
      exists: true,
      playing: !video.paused && !video.ended,
      paused: video.paused,
      ended: video.ended,
      currentTime: video.currentTime,
      duration: video.duration || 0,
      visible: visible
    };
  }

  // Слухачі для активації відео
  private setupActivationListeners() {
    const activateVideo = async () => {
      // console.log('🎬 VideoManager: 🚀 УЛЬТРА-АГРЕСИВНА активація через взаємодію');
      
      // Запускаємо всі наявні відео
      for (const [id] of this.videoElements) {
        // console.log(`🎬 VideoManager: Пробуємо запустити відео ${id} через активацію`);
        await this.playVideo(id);
      }
      
      // Запускаємо всі зареєстровані колбеки
      this.activationListeners.forEach(listener => {
        try {
          listener();
        } catch (error) {
          console.warn('🎬 VideoManager: Помилка виконання колбеку активації:', error);
        }
      });
    };

    // Простий набір подій для активації відео
    const events = [
      'click', 'touchstart', 'keydown'
    ];

    // Додаємо слухачів для кожної події (тільки один раз)
    events.forEach(event => {
      document.addEventListener(event, activateVideo, { 
        once: true, // Тільки один раз
        passive: true 
      });
    });

    // Простий тригер для активації відео після першої взаємодії
    setTimeout(activateVideo, 1000);
  }

  // Реєстрація колбеку для активації
  onActivation(callback: () => void) {
    this.activationListeners.push(callback);
  }

  // Перевірка чи відео грає
  isVideoPlaying(id: string): boolean {
    const video = this.videoElements.get(id);
    return video ? !video.paused : false;
  }

  // Зупинка відео
  stopVideo(id: string) {
    const video = this.videoElements.get(id);
    if (video && !video.paused) {
      video.pause();
      video.currentTime = 0;
    }
  }

  // Зупинка всіх відео
  stopAllVideo() {
    this.videoElements.forEach((video, id) => {
      if (!video.paused) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  // Публічний метод для запуску всіх відео
  async playAllVideos() {
    const promises: Promise<void>[] = [];
    
    this.videoElements.forEach(async (video, id) => {
      promises.push(
        (async () => {
          try {
            if (video.paused) {
              await video.play();
            }
          } catch (error) {
            // Тихо ігноруємо помилки автозапуску
          }
        })()
      );
    });
    
    await Promise.all(promises);
  }
}

// Глобальні екземпляри
export const webAudioManager = new WebAudioManager();
export const videoManager = new VideoManager();

// Допоміжна функція для простого використання аудіо
export const playWebAudio = async (url: string, options: { 
  loop?: boolean; 
  volume?: number; 
  id?: string;
  singlePlay?: boolean;
} = {}) => {
  const id = options.id || `audio_${Date.now()}`;
  
  if (!webAudioManager.isSupported) {
    console.warn('⚠️ WebAudioManager: Web Audio API не підтримується');
    return false;
  }

  const loaded = await webAudioManager.loadAudio(url, id);
  if (!loaded) return false;

  return await webAudioManager.playAudio(id, options);
};

// Допоміжна функція для простого використання відео
export const playWebVideo = async (url: string, options: { 
  loop?: boolean; 
  volume?: number; 
  id?: string;
  muted?: boolean;
} = {}) => {
  const id = options.id || `video_${Date.now()}`;
  
  videoManager.createBackgroundVideo(url, id);
  
  return await videoManager.playVideo(id);
};

// Експорт для використання у компонентах
export default webAudioManager; 