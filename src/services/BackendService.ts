// Backend Service для роботи з серверним зберіганням
class BackendService {
  private siteId: string;
  private baseUrl: string;

  constructor() {
    // Генеруємо унікальний ID сайту на основі домену
    this.siteId = this.generateSiteId();
    this.baseUrl = '/.netlify/functions';
  }

  // Генерація унікального ID сайту
  private generateSiteId(): string {
    const domain = window.location.hostname;
    // Для localhost використовуємо унікальний ідентифікатор
    if (domain === 'localhost' || domain === '127.0.0.1') {
      return `dev-${Date.now()}`;
    }
    return domain.replace(/\./g, '-');
  }

  // Збереження налаштувань на сервері
  async saveSettings(settingsType: string, data: any): Promise<boolean> {
    try {
      console.log(`💾 BackendService: Збереження ${settingsType} для сайту ${this.siteId}`);
      
      const response = await fetch(`${this.baseUrl}/save-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: this.siteId,
          settingsType,
          data
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ BackendService: ${settingsType} збережено успішно`);
      return result.success;

    } catch (error) {
      console.error(`❌ BackendService: Помилка збереження ${settingsType}:`, error);
      return false;
    }
  }

  // Завантаження налаштувань з сервера
  async loadSettings(settingsType: string): Promise<any | null> {
    try {
      console.log(`🔄 BackendService: Завантаження ${settingsType} для сайту ${this.siteId}`);
      
      const response = await fetch(
        `${this.baseUrl}/load-settings?siteId=${this.siteId}&settingsType=${settingsType}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ BackendService: ${settingsType} завантажено успішно`);
        return result.data;
      } else {
        console.log(`ℹ️ BackendService: ${settingsType} не знайдено на сервері`);
        return null;
      }

    } catch (error) {
      console.error(`❌ BackendService: Помилка завантаження ${settingsType}:`, error);
      return null;
    }
  }

  // Перевірка доступності backend сервісу
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/load-settings?siteId=test&settingsType=test`);
      return response.status !== 404; // 404 означає що функція не знайдена
    } catch (error) {
      console.warn('⚠️ BackendService: Backend недоступний, використовуємо локальне зберігання');
      return false;
    }
  }

  // Отримання інформації про сайт
  getSiteInfo(): { siteId: string; domain: string } {
    return {
      siteId: this.siteId,
      domain: window.location.hostname
    };
  }

  // Синхронізація локальних даних з сервером
  async syncWithServer(settingsType: string, localData: any): Promise<any> {
    try {
      // Спочатку завантажуємо серверні дані
      const serverData = await this.loadSettings(settingsType);
      
      if (!serverData) {
        // Якщо на сервері немає даних, зберігаємо локальні
        await this.saveSettings(settingsType, localData);
        return localData;
      }

      // Порівнюємо timestamp і використовуємо свіжіші дані
      const serverTime = new Date(serverData.lastModified || 0).getTime();
      const localTime = new Date(localData.lastModified || 0).getTime();

      if (serverTime > localTime) {
        console.log(`🔄 BackendService: Використовуємо серверні дані для ${settingsType}`);
        return serverData;
      } else {
        console.log(`🔄 BackendService: Оновлюємо сервер локальними даними для ${settingsType}`);
        await this.saveSettings(settingsType, localData);
        return localData;
      }

    } catch (error) {
      console.error(`❌ BackendService: Помилка синхронізації ${settingsType}:`, error);
      return localData; // Повертаємо локальні дані в разі помилки
    }
  }
}

// Експортуємо єдиний екземпляр сервісу
export const backendService = new BackendService(); 