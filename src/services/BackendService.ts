// Backend Service для роботи з серверним зберіганням
class BackendService {
  private siteId: string;
  private baseUrl: string;
  private isLocalDev: boolean;

  constructor() {
    // Генеруємо унікальний ID сайту на основі домену
    this.siteId = this.generateSiteId();
    this.baseUrl = '/.netlify/functions';
    this.isLocalDev = this.checkIfLocalDev();
  }

  // Перевірка чи це локальна розробка
  private checkIfLocalDev(): boolean {
    const hostname = window.location.hostname;
    const port = window.location.port;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.includes('192.168') || 
           port === '5173' || 
           port === '3000';
  }

  // Генерація унікального ID сайту
  private generateSiteId(): string {
    const domain = window.location.hostname;
    // Для localhost використовуємо унікальний ідентифікатор
    if (domain === 'localhost' || domain === '127.0.0.1' || domain.includes('192.168')) {
      return domain.replace(/\./g, '-');
    }
    return domain.replace(/\./g, '-');
  }

  // Перевірка авторизації адміна
  private isAdminAuthenticated(): boolean {
    try {
      // На клієнтських сайтах (не localhost) дозволяємо збереження без авторизації
      if (!this.isLocalDev) {
        return true;
      }
      
      const sessionData = localStorage.getItem('adminSession');
      if (!sessionData) return false;
      
      const session = JSON.parse(sessionData);
      const now = new Date().getTime();
      
      return session.expiry > now;
    } catch {
      return false;
    }
  }

  // Збереження налаштувань на сервері
  async saveSettings(settingsType: string, data: any): Promise<boolean> {
    try {
      // В режимі локальної розробки не використовуємо backend
      if (this.isLocalDev) {
        // Тихо повертаємо true без логування
        return true;
      }

      // Перевіряємо авторизацію для серверного збереження
      if (!this.isAdminAuthenticated()) {
        console.warn(`🔒 BackendService: Неавторизований доступ до збереження ${settingsType}`);
        return false;
      }
      
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
      // В режимі локальної розробки не використовуємо backend
      if (this.isLocalDev) {
        // Тихо повертаємо null без логування
        return null;
      }

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
      // В режимі локальної розробки завжди повертаємо false
      if (this.isLocalDev) {
        // Тихо повертаємо false без логування
        return false;
      }

      const response = await fetch(`${this.baseUrl}/load-settings?siteId=test&settingsType=test`);
      return response.status !== 404; // 404 означає що функція не знайдена
    } catch (error) {
      console.warn('⚠️ BackendService: Backend недоступний, використовуємо локальне зберігання');
      return false;
    }
  }

  // Отримання інформації про сайт
  getSiteInfo(): { siteId: string; domain: string; isLocalDev: boolean } {
    return {
      siteId: this.siteId,
      domain: window.location.hostname,
      isLocalDev: this.isLocalDev
    };
  }

  // Синхронізація локальних даних з сервером
  async syncWithServer(settingsType: string, localData: any): Promise<any> {
    try {
      // В режимі локальної розробки завжди використовуємо локальні дані
      if (this.isLocalDev) {
        console.log(`🔧 BackendService: Локальна розробка - використовуємо тільки локальні дані для ${settingsType}`);
        return localData;
      }

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