interface SyncData {
  timestamp: number;
  dataType: 'mainPageSettings' | 'introSettings' | 'welcomeSettings';
  action: 'sync' | 'reload';
}

class DomainSyncService {
  private readonly CHANNEL_NAME = 'website_sync_channel';
  private broadcastChannel: BroadcastChannel;
  
  constructor() {
    this.broadcastChannel = new BroadcastChannel(this.CHANNEL_NAME);
    this.setupChannelListener();
  }

  // Слухаємо повідомлення від інших вкладок через BroadcastChannel
  private setupChannelListener() {
    this.broadcastChannel.addEventListener('message', (event) => {
      const syncData: SyncData = event.data;
      this.handleIncomingSync(syncData);
    });
  }

  // Обробка вхідних даних синхронізації
  private async handleIncomingSync(syncData: SyncData) {
    // Перевіряємо, чи це не адмін режим (щоб не синхронізувати самого себе)
    if (this.isAdminMode()) {
      return;
    }

    console.log(`📥 DomainSync: Отримано оновлення ${syncData.dataType}`);

    try {
      // Завантажуємо актуальні дані з IndexedDB
      const { default: indexedDBService } = await import('./IndexedDBService');
      const latestData = await indexedDBService.loadSettings(syncData.dataType);

      if (latestData) {
        // Відправляємо подію для оновлення компонентів
        const eventName = syncData.dataType === 'introSettings' ? 'introSettingsUpdated' : 
                         syncData.dataType === 'welcomeSettings' ? 'welcomeSettingsUpdated' : 
                         'mainPageSettingsUpdated';
        
        window.dispatchEvent(new CustomEvent(eventName, { detail: latestData }));
        
        console.log(`✅ DomainSync: Успішно застосовано оновлення ${syncData.dataType}`);
      } else {
        console.log(`ℹ️ DomainSync: Немає даних для ${syncData.dataType}`);
      }
    } catch (error) {
      console.error(`❌ DomainSync: Помилка застосування оновлення ${syncData.dataType}:`, error);
    }
  }

  // Відправка повідомлення про синхронізацію (викликається з адмін панелі)
  async syncToPublicSite(settingsType: 'mainPageSettings' | 'introSettings' | 'welcomeSettings'): Promise<boolean> {
    if (!this.isAdminMode()) {
      console.warn('⚠️ DomainSync: Синхронізація доступна тільки в адмін режимі');
      return false;
    }

    try {
      console.log(`🔄 DomainSync: Починаємо синхронізацію ${settingsType}...`);

      // Створюємо повідомлення для синхронізації
      const syncData: SyncData = {
        timestamp: Date.now(),
        dataType: settingsType,
        action: 'sync'
      };

      // Відправляємо повідомлення через BroadcastChannel
      this.broadcastChannel.postMessage(syncData);

      console.log(`✅ DomainSync: Синхронізація ${settingsType} завершена`);
      return true;
    } catch (error) {
      console.error(`❌ DomainSync: Помилка синхронізації ${settingsType}:`, error);
      return false;
    }
  }

  // Синхронізація всіх налаштувань одразу
  async syncAllSettings(): Promise<{ success: boolean; results: Record<string, boolean> }> {
    const results: Record<string, boolean> = {};
    
    try {
      // Завантажуємо всі налаштування з IndexedDB
      const { default: indexedDBService } = await import('./IndexedDBService');
      
      // Синхронізуємо головну сторінку
      const mainPageSettings = await indexedDBService.loadSettings('mainPageSettings');
      if (mainPageSettings) {
        results.mainPageSettings = await this.syncToPublicSite('mainPageSettings');
      }

      // Синхронізуємо інтро сторінку
      const introSettings = await indexedDBService.loadSettings('introSettings');
      if (introSettings) {
        results.introSettings = await this.syncToPublicSite('introSettings');
      }

      // Синхронізуємо welcome екран
      const welcomeSettings = await indexedDBService.loadSettings('welcomeSettings');
      if (welcomeSettings) {
        results.welcomeSettings = await this.syncToPublicSite('welcomeSettings');
      }

      const allSuccess = Object.values(results).every(result => result);
      
      // Оновлюємо статистику тільки якщо все успішно
      if (allSuccess) {
        this.updateSyncStats();
      }
      
      console.log(`🎯 DomainSync: Повна синхронізація ${allSuccess ? 'успішна' : 'з помилками'}:`, results);
      
      return { success: allSuccess, results };
    } catch (error) {
      console.error('❌ DomainSync: Помилка повної синхронізації:', error);
      return { success: false, results };
    }
  }

  // Перевірка чи це адмін режим
  isAdminMode(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin');
  }

  // Перевірка чи є нові дані для синхронізації
  hasUnsyncedChanges(): boolean {
    // Можна реалізувати логіку перевірки чи є незинхронізовані зміни
    // Наприклад, порівнювати timestamp останньої синхронізації
    return true; // Поки що завжди показуємо кнопку
  }

  // Отримання статистики синхронізації
  getSyncStats(): { lastSyncTime: Date | null; syncCount: number } {
    const stats = localStorage.getItem('sync_stats');
    if (stats) {
      const parsed = JSON.parse(stats);
      return {
        lastSyncTime: parsed.lastSyncTime ? new Date(parsed.lastSyncTime) : null,
        syncCount: parsed.syncCount || 0
      };
    }
    return { lastSyncTime: null, syncCount: 0 };
  }

  // Оновлення статистики синхронізації
  private updateSyncStats() {
    const currentStats = this.getSyncStats();
    const newStats = {
      lastSyncTime: new Date().toISOString(),
      syncCount: currentStats.syncCount + 1
    };
    localStorage.setItem('sync_stats', JSON.stringify(newStats));
  }

  // Закриття BroadcastChannel
  destroy() {
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }
}

// Експортуємо єдиний екземпляр сервісу
export const domainSyncService = new DomainSyncService();
export default domainSyncService; 