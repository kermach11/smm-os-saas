interface SyncMessage {
  type: 'SYNC_SETTINGS' | 'REQUEST_SETTINGS' | 'SETTINGS_RESPONSE';
  data?: any;
  settingsKey?: string;
}

class SyncService {
  private targetOrigins = [
    'http://192.168.1.49:8080',
    'http://192.168.1.49:8081',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:5173'
  ];

  constructor() {
    this.setupMessageListener();
  }

  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Перевіряємо origin для безпеки
      if (!this.targetOrigins.includes(event.origin)) {
        return;
      }

      const message: SyncMessage = event.data;
      
      switch (message.type) {
        case 'REQUEST_SETTINGS':
          this.handleSettingsRequest(event.source as Window, event.origin, message.settingsKey);
          break;
        case 'SYNC_SETTINGS':
          this.handleSyncSettings(message.data, message.settingsKey);
          break;
        case 'SETTINGS_RESPONSE':
          this.handleSettingsResponse(message.data, message.settingsKey);
          break;
      }
    });
  }

  private async handleSettingsRequest(source: Window, origin: string, settingsKey?: string) {
    try {
      // Завантажуємо налаштування з IndexedDB
      const { default: indexedDBService } = await import('./IndexedDBService');
      const settings = await indexedDBService.loadSettings(settingsKey || 'mainPageSettings');
      
      // Відправляємо відповідь
      source.postMessage({
        type: 'SETTINGS_RESPONSE',
        data: settings,
        settingsKey: settingsKey
      }, origin);
      
      console.log(`📤 SyncService: Відправлено налаштування ${settingsKey || 'mainPageSettings'} на ${origin}`);
    } catch (error) {
      console.error('❌ SyncService: Помилка завантаження налаштувань для відправки:', error);
    }
  }

  private async handleSyncSettings(data: any, settingsKey?: string) {
    try {
      // Зберігаємо отримані налаштування в IndexedDB
      const { default: indexedDBService } = await import('./IndexedDBService');
      await indexedDBService.saveSettings(settingsKey || 'mainPageSettings', data, 'project');
      
      // Відправляємо подію для оновлення компонентів
      const eventName = settingsKey === 'introSettings' ? 'introSettingsUpdated' : 'mainPageSettingsUpdated';
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
      
      console.log(`📥 SyncService: Отримано та збережено налаштування ${settingsKey || 'mainPageSettings'}`);
    } catch (error) {
      console.error('❌ SyncService: Помилка збереження синхронізованих налаштувань:', error);
    }
  }

  private handleSettingsResponse(data: any, settingsKey?: string) {
    // Обробляємо отримані налаштування (наприклад, для попереднього завантаження)
    console.log(`📨 SyncService: Отримано налаштування ${settingsKey || 'mainPageSettings'} як відповідь`);
  }

  // Метод для синхронізації налаштувань на інші сайти
  async syncSettings(settingsKey: string, data: any) {
    this.targetOrigins.forEach(origin => {
      if (origin !== window.location.origin) {
        try {
          // Відкриваємо невидимий iframe для комунікації
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = origin;
          
          iframe.onload = () => {
            iframe.contentWindow?.postMessage({
              type: 'SYNC_SETTINGS',
              data: data,
              settingsKey: settingsKey
            }, origin);
            
            // Видаляємо iframe через 2 секунди
            setTimeout(() => {
              document.body.removeChild(iframe);
            }, 2000);
          };
          
          document.body.appendChild(iframe);
          console.log(`🔄 SyncService: Синхронізація ${settingsKey} на ${origin}`);
        } catch (error) {
          console.error(`❌ SyncService: Помилка синхронізації на ${origin}:`, error);
        }
      }
    });
  }

  // Метод для запиту налаштувань з інших сайтів
  async requestSettings(settingsKey: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let responseReceived = false;
      const timeout = 5000; // 5 секунд таймаут

      // Слухач для отримання відповіді
      const responseHandler = (event: MessageEvent) => {
        if (!this.targetOrigins.includes(event.origin)) return;
        
        const message: SyncMessage = event.data;
        if (message.type === 'SETTINGS_RESPONSE' && message.settingsKey === settingsKey) {
          responseReceived = true;
          window.removeEventListener('message', responseHandler);
          resolve(message.data);
        }
      };

      window.addEventListener('message', responseHandler);

      // Таймаут
      setTimeout(() => {
        if (!responseReceived) {
          window.removeEventListener('message', responseHandler);
          reject(new Error('Таймаут запиту налаштувань'));
        }
      }, timeout);

      // Відправляємо запити на всі цільові origins
      this.targetOrigins.forEach(origin => {
        if (origin !== window.location.origin) {
          try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = origin;
            
            iframe.onload = () => {
              iframe.contentWindow?.postMessage({
                type: 'REQUEST_SETTINGS',
                settingsKey: settingsKey
              }, origin);
              
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            };
            
            document.body.appendChild(iframe);
          } catch (error) {
            console.error(`❌ SyncService: Помилка запиту з ${origin}:`, error);
          }
        }
      });
    });
  }

  // Перевірка чи запущений адмін режим
  isAdminMode(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin') || window.location.port === '8081';
  }

  // Автоматична синхронізація при зміні налаштувань (для адмін режиму)
  enableAutoSync() {
    if (!this.isAdminMode()) return;

    // Слухаємо події оновлення налаштувань
    ['mainPageSettingsUpdated', 'introSettingsUpdated', 'welcomeSettingsUpdated'].forEach(eventName => {
      window.addEventListener(eventName, (event: CustomEvent) => {
        const settingsKey = eventName.replace('Updated', '');
        this.syncSettings(settingsKey, event.detail);
      });
    });

    console.log('🔄 SyncService: Автоматична синхронізація увімкнена для адмін режиму');
  }
}

// Експортуємо єдиний екземпляр сервісу
export const syncService = new SyncService();
export default syncService; 