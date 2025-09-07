import { AnalyticsData, SessionData, ClickEvent } from '../types/analytics';

interface IAnalyticsStorageService {
  saveAnalyticsData(data: AnalyticsData): Promise<void>;
  loadAnalyticsData(): Promise<AnalyticsData | null>;
  syncAnalytics(localClicks: ClickEvent[], localSessions: SessionData[]): Promise<{
    clicks: ClickEvent[];
    sessions: SessionData[];
  }>;
}

class AnalyticsStorageService implements IAnalyticsStorageService {
  private baseUrl: string;
  
  constructor() {
    // Використовуємо змінну середовища або localhost за замовчуванням
    this.baseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
  }

  async saveAnalyticsData(data: AnalyticsData): Promise<void> {
    try {
      console.log('📡 AnalyticsStorage: Збереження даних аналітики на сервер');
      
      const response = await fetch(`${this.baseUrl}/api/collections/analytics_data/records`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: JSON.stringify(data),
          timestamp: new Date().toISOString(),
          device_id: this.getDeviceId()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ AnalyticsStorage: Дані аналітики збережено на сервер');
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Не вдалося зберегти дані на сервер:', error);
      // Не кидаємо помилку, щоб не ламати основний функціонал
    }
  }

  async loadAnalyticsData(): Promise<AnalyticsData | null> {
    try {
      console.log('📡 AnalyticsStorage: Завантаження даних аналітики з сервера');
      
      const deviceId = this.getDeviceId();
      const response = await fetch(
        `${this.baseUrl}/api/collections/analytics_data/records?filter=(device_id='${deviceId}')&sort=-created`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.items && result.items.length > 0) {
        const latestRecord = result.items[0];
        const data = JSON.parse(latestRecord.data);
        console.log('✅ AnalyticsStorage: Дані аналітики завантажено з сервера');
        return data;
      }

      console.log('📡 AnalyticsStorage: Немає даних на сервері');
      return null;
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Не вдалося завантажити дані з сервера:', error);
      return null;
    }
  }

  async syncAnalytics(localClicks: ClickEvent[], localSessions: SessionData[]): Promise<{
    clicks: ClickEvent[];
    sessions: SessionData[];
  }> {
    try {
      console.log('🔄 AnalyticsStorage: Синхронізація аналітики з сервером');
      
      // Завантажуємо дані з сервера
      const serverClicks = await this.loadClicks();
      const serverSessions = await this.loadSessions();
      
      // Об'єднуємо локальні та серверні дані без дублювання
      const mergedClicks = this.mergeClickData(localClicks, serverClicks);
      const mergedSessions = this.mergeSessionData(localSessions, serverSessions);
      
      // Зберігаємо об'єднані дані на сервер
      await this.saveClicks(mergedClicks);
      await this.saveSessions(mergedSessions);
      
      console.log('✅ AnalyticsStorage: Синхронізація завершена', {
        totalClicks: mergedClicks.length,
        totalSessions: mergedSessions.length
      });
      
      return {
        clicks: mergedClicks,
        sessions: mergedSessions
      };
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Помилка синхронізації:', error);
      // Повертаємо локальні дані у випадку помилки
      return {
        clicks: localClicks,
        sessions: localSessions
      };
    }
  }

  private async loadClicks(): Promise<ClickEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/collections/analytics_clicks/records?perPage=1000`);
      if (!response.ok) return [];
      
      const result = await response.json();
      return result.items.map((item: any) => JSON.parse(item.data));
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Помилка завантаження кліків:', error);
      return [];
    }
  }

  private async loadSessions(): Promise<SessionData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/collections/analytics_sessions/records?perPage=1000`);
      if (!response.ok) return [];
      
      const result = await response.json();
      return result.items.map((item: any) => JSON.parse(item.data));
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Помилка завантаження сесій:', error);
      return [];
    }
  }

  private async saveClicks(clicks: ClickEvent[]): Promise<void> {
    try {
      // Видаляємо старі записи
      await this.clearCollection('analytics_clicks');
      
      // Зберігаємо нові дані порціями
      const batchSize = 50;
      for (let i = 0; i < clicks.length; i += batchSize) {
        const batch = clicks.slice(i, i + batchSize);
        const promises = batch.map(click => 
          fetch(`${this.baseUrl}/api/collections/analytics_clicks/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: JSON.stringify(click),
              click_id: click.id,
              timestamp: new Date(click.timestamp).toISOString()
            })
          })
        );
        await Promise.all(promises);
      }
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Помилка збереження кліків:', error);
    }
  }

  private async saveSessions(sessions: SessionData[]): Promise<void> {
    try {
      // Видаляємо старі записи
      await this.clearCollection('analytics_sessions');
      
      // Зберігаємо нові дані порціями
      const batchSize = 50;
      for (let i = 0; i < sessions.length; i += batchSize) {
        const batch = sessions.slice(i, i + batchSize);
        const promises = batch.map(session => 
          fetch(`${this.baseUrl}/api/collections/analytics_sessions/records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              data: JSON.stringify(session),
              session_id: session.id,
              start_time: new Date(session.startTime).toISOString()
            })
          })
        );
        await Promise.all(promises);
      }
    } catch (error) {
      console.warn('⚠️ AnalyticsStorage: Помилка збереження сесій:', error);
    }
  }

  private async clearCollection(collectionName: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/collections/${collectionName}/records?perPage=1000`);
      if (!response.ok) return;
      
      const result = await response.json();
      const deletePromises = result.items.map((item: any) =>
        fetch(`${this.baseUrl}/api/collections/${collectionName}/records/${item.id}`, {
          method: 'DELETE'
        })
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.warn(`⚠️ AnalyticsStorage: Помилка очищення колекції ${collectionName}:`, error);
    }
  }

  private mergeClickData(local: ClickEvent[], server: ClickEvent[]): ClickEvent[] {
    const allClicks = [...server, ...local];
    const uniqueClicks = allClicks.filter((click, index, arr) =>
      arr.findIndex(c => c.id === click.id) === index
    );
    return uniqueClicks.sort((a, b) => a.timestamp - b.timestamp);
  }

  private mergeSessionData(local: SessionData[], server: SessionData[]): SessionData[] {
    const allSessions = [...server, ...local];
    const uniqueSessions = allSessions.filter((session, index, arr) =>
      arr.findIndex(s => s.id === session.id) === index
    );
    return uniqueSessions.sort((a, b) => a.startTime - b.startTime);
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('analytics_device_id');
    if (!deviceId) {
      deviceId = `device_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem('analytics_device_id', deviceId);
    }
    return deviceId;
  }
}

export default AnalyticsStorageService;