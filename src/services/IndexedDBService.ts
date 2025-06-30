interface DBConfig {
  name: string;
  version: number;
  stores: {
    [storeName: string]: {
      keyPath: string;
      indexes?: { name: string; keyPath: string; unique: boolean }[];
    };
  };
}

interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  originalName: string;
  size: number;
  uploadDate: string;
  optimized: boolean;
  isHeavy?: boolean;
  hasFullFile?: boolean;
}

interface SettingsData {
  [key: string]: any;
}

interface DBData {
  id: string;
  data: any;
  timestamp: number;
  type: string;
}

class IndexedDBService {
  private dbConfig: DBConfig = {
    name: 'SmartContentDB',
    version: 1,
    stores: {
      // Медіафайли (об'єднуємо ContentManager і основні файли)
      files: {
        keyPath: 'id',
        indexes: [
          { name: 'name', keyPath: 'name', unique: false },
          { name: 'type', keyPath: 'type', unique: false },
          { name: 'uploadDate', keyPath: 'uploadDate', unique: false }
        ]
      },
      
      // Налаштування проекту (mainPageSettings, welcomeSettings тощо)
      settings: {
        keyPath: 'settingsKey',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'type', keyPath: 'type', unique: false }
        ]
      },
      
      // Дані адмін-панелі (adminSession, adminSettings)
      admin: {
        keyPath: 'adminKey',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp', unique: false }
        ]
      },
      
      // Аналітика та клієнти (analyticsData, clientsData)
      analytics: {
        keyPath: 'analyticsKey',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp', unique: false },
          { name: 'type', keyPath: 'type', unique: false }
        ]
      },
      
      // Іммерсивний досвід та контент (immersiveExperienceData)
      experience: {
        keyPath: 'experienceKey',
        indexes: [
          { name: 'timestamp', keyPath: 'timestamp', unique: false }
        ]
      }
    }
  };

  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initDB();
  }

  // Метод для очікування ініціалізації
  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // Ініціалізація бази даних
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbConfig.name, this.dbConfig.version);

      request.onerror = () => {
        console.error('❌ IndexedDBService: Помилка відкриття бази даних');
        reject(new Error('Не вдалося відкрити базу даних'));
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        console.log('🔄 IndexedDBService: Оновлення структури бази даних...');

        // Створюємо всі необхідні сховища
        Object.entries(this.dbConfig.stores).forEach(([storeName, config]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: config.keyPath });
            
            // Додаємо індекси
            if (config.indexes) {
              config.indexes.forEach(index => {
                store.createIndex(index.name, index.keyPath, { unique: index.unique });
              });
            }
            
            console.log(`✅ Створено сховище: ${storeName}`);
          }
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('✅ IndexedDBService: База даних успішно ініціалізована');
        
        // Виводимо статистику
        this.logDBStats();
        resolve();
      };
    });
  }

  // Статистика бази даних
  private async logDBStats(): Promise<void> {
    if (!this.db) return;

    try {
      const stats = await Promise.all(
        Object.keys(this.dbConfig.stores).map(async (storeName) => {
          const count = await this.countRecords(storeName);
          return { store: storeName, count };
        })
      );

      console.log('📊 IndexedDBService - Статистика бази даних:');
      stats.forEach(({ store, count }) => {
        console.log(`   ${store}: ${count} записів`);
      });
    } catch (error) {
      console.warn('⚠️ Помилка отримання статистики:', error);
    }
  }

  // Підрахунок записів у сховищі
  private async countRecords(storeName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // === МЕДІАФАЙЛИ ===

  // Збереження файлів (замінює ContentManager логіку)
  async saveFiles(files: FileItem[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');

      let completed = 0;
      const total = files.length;

      if (total === 0) {
        resolve();
        return;
      }

      files.forEach(file => {
        const request = store.put(file);
        
        request.onsuccess = () => {
          completed++;
          if (completed === total) {
            console.log(`✅ IndexedDBService: Збережено ${total} файлів`);
            resolve();
          }
        };
        
        request.onerror = () => {
          console.error('❌ IndexedDBService: Помилка збереження файлу:', file.name);
          reject(request.error);
        };
      });
    });
  }

  // Завантаження всіх файлів
  async loadFiles(): Promise<FileItem[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const request = store.getAll();

      request.onsuccess = () => {
        const files = request.result || [];
        console.log(`📂 IndexedDBService: Завантажено ${files.length} файлів`);
        resolve(files);
      };

      request.onerror = () => {
        console.error('❌ IndexedDBService: Помилка завантаження файлів');
        reject(new Error('Помилка завантаження файлів'));
      };
    });
  }

  // Завантаження файлів за ID
  async loadFilesByIds(fileIds: string[]): Promise<FileItem[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const results: FileItem[] = [];

      let completed = 0;
      const total = fileIds.length;

      if (total === 0) {
        resolve([]);
        return;
      }

      fileIds.forEach((fileId) => {
        const request = store.get(fileId);

        request.onsuccess = () => {
          completed++;

          if (request.result) {
            results.push(request.result);
          }

          if (completed === total) {
            resolve(results);
          }
        };

        request.onerror = () => {
          completed++;
          console.error(`❌ IndexedDBService: Помилка завантаження файлу: ${fileId}`);

          if (completed === total) {
            resolve(results);
          }
        };
      });
    });
  }

  // Видалення файлу
  async deleteFile(fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');
      const request = store.delete(fileId);

      request.onsuccess = () => {
        console.log(`🗑️ IndexedDBService: Файл видалено: ${fileId}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка видалення файлу: ${fileId}`);
        reject(new Error(`Не вдалося видалити файл: ${fileId}`));
      };
    });
  }

  // Очищення неправильно збережених відео файлів
  async cleanupInvalidVideoFiles(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        console.warn('⚠️ IndexedDBService: База даних не ініціалізована для очищення');
        resolve();
        return;
      }

      try {
        const transaction = this.db.transaction(['files'], 'readwrite');
        const store = transaction.objectStore('files');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const files = getAllRequest.result as FileItem[];
          console.log(`🔍 IndexedDBService: Перевірка ${files.length} файлів на валідність типу`);
          
          let fixedCount = 0;
          let deletedCount = 0;
          const filesToUpdate: FileItem[] = [];
          const filesToDelete: string[] = [];

          files.forEach(file => {
            if (!file.url || !file.url.startsWith('data:')) {
              return; // Пропускаємо файли без data URL
            }

            const mimeType = file.url.split(';')[0].replace('data:', '');
            let shouldFix = false;
            let correctType: 'image' | 'audio' | 'video' | null = null;

            // Виявляємо неправильно збережені типи
            if (file.type === 'video' && mimeType.startsWith('image/')) {
              console.warn(`🔧 Виправляємо: ${file.name} збережено як відео, але це зображення (${mimeType})`);
              correctType = 'image';
              shouldFix = true;
            } else if (file.type === 'image' && mimeType.startsWith('video/')) {
              console.warn(`🔧 Виправляємо: ${file.name} збережено як зображення, але це відео (${mimeType})`);
              correctType = 'video';
              shouldFix = true;
            } else if (file.type === 'audio' && (mimeType.startsWith('image/') || mimeType.startsWith('video/'))) {
              console.warn(`🔧 Виправляємо: ${file.name} збережено як аудіо, але це ${mimeType.split('/')[0]}`);
              correctType = mimeType.startsWith('image/') ? 'image' : 'video';
              shouldFix = true;
            }

            // Видаляємо файли з SVG placeholder замість відео
            if (file.type === 'video' && file.url.includes('data:image/svg+xml') && file.url.includes('🎬')) {
              console.warn(`🗑️ Видаляємо SVG placeholder замість відео: ${file.name}`);
              filesToDelete.push(file.id);
              deletedCount++;
              return;
            }

            if (shouldFix && correctType) {
              const fixedFile = {
                ...file,
                type: correctType
              };
              filesToUpdate.push(fixedFile);
              fixedCount++;
            }
          });

          // Оновлюємо виправлені файли
          let operationsCompleted = 0;
          const totalOperations = filesToUpdate.length + filesToDelete.length;

          if (totalOperations === 0) {
            console.log('✅ IndexedDBService: Всі файли мають правильний тип');
            resolve();
            return;
          }

          const checkCompletion = () => {
            operationsCompleted++;
            if (operationsCompleted === totalOperations) {
              console.log(`✅ IndexedDBService: Очищення завершено. Виправлено: ${fixedCount}, видалено: ${deletedCount}`);
              resolve();
            }
          };

          // Оновлюємо файли з виправленим типом
          filesToUpdate.forEach(file => {
            const updateRequest = store.put(file);
            updateRequest.onsuccess = () => {
              console.log(`✅ Виправлено тип файлу: ${file.name} → ${file.type}`);
              checkCompletion();
            };
            updateRequest.onerror = () => {
              console.error(`❌ Помилка виправлення файлу: ${file.name}`);
              checkCompletion();
            };
          });

          // Видаляємо невалідні файли
          filesToDelete.forEach(fileId => {
            const deleteRequest = store.delete(fileId);
            deleteRequest.onsuccess = () => {
              console.log(`🗑️ Видалено невалідний файл: ${fileId}`);
              checkCompletion();
            };
            deleteRequest.onerror = () => {
              console.error(`❌ Помилка видалення файлу: ${fileId}`);
              checkCompletion();
            };
          });
        };

        getAllRequest.onerror = () => {
          console.error('❌ IndexedDBService: Помилка отримання файлів для очищення');
          reject(new Error('Помилка отримання файлів'));
        };

        transaction.onerror = () => {
          console.error('❌ IndexedDBService: Помилка транзакції очищення');
          reject(new Error('Помилка транзакції'));
        };

      } catch (error) {
        console.error('❌ IndexedDBService: Помилка очищення неправильних файлів:', error);
        reject(error);
      }
    });
  }

  // === НАЛАШТУВАННЯ ===

  // Збереження налаштувань (з інтеграцією backend)
  async saveSettings(settingsKey: string, data: SettingsData, type: string = 'project'): Promise<void> {
    console.log(`🔄 IndexedDBService: Збереження ${settingsKey}, спочатку локально...`);
    
    // Спочатку зберігаємо локально (швидко)
    await this.saveSettingsLocal(settingsKey, data, type);
    
    console.log(`☁️ IndexedDBService: Локальне збереження завершено, починаємо синхронізацію з сервером...`);
    
    // Потім намагаємося зберегти на сервері (асинхронно)
    this.saveSettingsToBackend(settingsKey, data).catch(error => {
      console.warn(`⚠️ IndexedDBService: Не вдалося зберегти ${settingsKey} на сервері:`, error);
    });
  }

  // Локальне збереження налаштувань
  private async saveSettingsLocal(settingsKey: string, data: SettingsData, type: string = 'project'): Promise<void> {
    // Очікуємо ініціалізації бази даних
    await this.waitForInit();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const settingsData = {
        settingsKey,
        data: {
          ...data,
          lastModified: new Date().toISOString()
        },
        timestamp: Date.now(),
        type
      };

      const transaction = this.db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put(settingsData);

      request.onsuccess = () => {
        console.log(`💾 IndexedDBService: Налаштування збережено локально: ${settingsKey}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка збереження налаштувань: ${settingsKey}`);
        reject(new Error(`Помилка збереження налаштувань: ${settingsKey}`));
      };
    });
  }

  // Збереження на сервері через Backend Service
  private async saveSettingsToBackend(settingsKey: string, data: SettingsData): Promise<void> {
    try {
      console.log(`🌐 IndexedDBService: Починаємо збереження ${settingsKey} на сервері...`);
      
      // Тимчасово відключаємо серверне збереження для стабільності
      console.log(`📱 IndexedDBService: Серверна синхронізація відключена - використовуємо тільки локальне зберігання`);
      return;
      
      // Динамічно імпортуємо BackendService
      console.log(`📦 IndexedDBService: Імпортуємо BackendService...`);
      const { backendService } = await import('./BackendService');
      console.log(`✅ IndexedDBService: BackendService імпортовано успішно`);
      
      // Перевіряємо доступність backend
      console.log(`🔗 IndexedDBService: Перевіряємо з'єднання з backend...`);
      const isBackendAvailable = await backendService.checkConnection();
      console.log(`🔗 IndexedDBService: Backend доступний: ${isBackendAvailable}`);
      
      if (isBackendAvailable) {
        // Фільтруємо великі base64 зображення перед відправкою
        const filteredData = this.filterLargeBase64Images(data);
        
        console.log(`💾 IndexedDBService: Викликаємо backendService.saveSettings для ${settingsKey}...`);
        const success = await backendService.saveSettings(settingsKey, filteredData);
        if (success) {
          console.log(`☁️ IndexedDBService: ${settingsKey} збережено на сервері`);
        } else {
          throw new Error('Backend повернув помилку');
        }
      } else {
        console.log(`📱 IndexedDBService: Backend недоступний, використовуємо тільки локальне зберігання`);
      }
    } catch (error) {
      console.warn(`⚠️ IndexedDBService: Помилка збереження на сервері:`, error);
      // Не перериваємо роботу - локальне зберігання вже виконане
    }
  }

  // Фільтрація великих base64 зображень для серверного збереження
  private filterLargeBase64Images(data: any): any {
    const MAX_BASE64_SIZE = 500000; // 500KB ліміт для base64
    
    const filterObject = (obj: any): any => {
      if (typeof obj === 'string') {
        // Перевіряємо чи це base64 зображення
        if (obj.startsWith('data:image/') && obj.includes('base64,')) {
          const base64Size = obj.length;
          if (base64Size > MAX_BASE64_SIZE) {
            console.warn(`🚫 IndexedDBService: Видаляємо велике base64 зображення (${Math.round(base64Size/1024)}KB) для серверного збереження`);
            return '[LARGE_IMAGE_FILTERED]'; // Замінюємо на плейсхолдер
          }
        }
        return obj;
      }
      
      if (Array.isArray(obj)) {
        return obj.map(filterObject);
      }
      
      if (obj && typeof obj === 'object') {
        const filtered: any = {};
        for (const [key, value] of Object.entries(obj)) {
          filtered[key] = filterObject(value);
        }
        return filtered;
      }
      
      return obj;
    };
    
    return filterObject(data);
  }

  // Завантаження налаштувань (з перевіркою backend)
  async loadSettings(settingsKey: string): Promise<SettingsData | null> {
    try {
      // Спочатку пробуємо завантажити з сервера
      const serverData = await this.loadSettingsFromBackend(settingsKey);
      
      if (serverData) {
        // Якщо є серверні дані, зберігаємо їх локально і повертаємо
        await this.saveSettingsLocal(settingsKey, serverData);
        console.log(`☁️ IndexedDBService: ${settingsKey} завантажено з сервера`);
        return serverData;
      }
    } catch (error) {
      console.warn(`⚠️ IndexedDBService: Не вдалося завантажити ${settingsKey} з сервера:`, error);
    }

    // Якщо сервер недоступний або немає даних, завантажуємо локально
    return await this.loadSettingsLocal(settingsKey);
  }

  // Локальне завантаження налаштувань
  private async loadSettingsLocal(settingsKey: string): Promise<SettingsData | null> {
    // Очікуємо ініціалізації бази даних
    await this.waitForInit();
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(settingsKey);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`📂 IndexedDBService: ${settingsKey} завантажено локально`);
          resolve(request.result.data);
        } else {
          console.log(`📂 IndexedDBService: ${settingsKey} не знайдено локально`);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка завантаження налаштувань: ${settingsKey}`);
        reject(new Error(`Помилка завантаження налаштувань: ${settingsKey}`));
      };
    });
  }

  // Завантаження з сервера через Backend Service
  private async loadSettingsFromBackend(settingsKey: string): Promise<SettingsData | null> {
    try {
      // Динамічно імпортуємо BackendService
      const { backendService } = await import('./BackendService');
      
      // Перевіряємо доступність backend
      const isBackendAvailable = await backendService.checkConnection();
      
      if (isBackendAvailable) {
        const data = await backendService.loadSettings(settingsKey);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.warn(`⚠️ IndexedDBService: Помилка завантаження з сервера:`, error);
      return null;
    }
  }

  // Синхронізація локальних та серверних даних
  async syncSettingsWithBackend(settingsKey: string): Promise<SettingsData | null> {
    try {
      const { backendService } = await import('./BackendService');
      const localData = await this.loadSettingsLocal(settingsKey);
      
      if (localData) {
        return await backendService.syncWithServer(settingsKey, localData);
      } else {
        return await this.loadSettingsFromBackend(settingsKey);
      }
    } catch (error) {
      console.error(`❌ IndexedDBService: Помилка синхронізації ${settingsKey}:`, error);
      return await this.loadSettingsLocal(settingsKey);
    }
  }

  // === АДМІН ДАНІ ===

  // Збереження адмін даних
  async saveAdminData(adminKey: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const adminData = {
        adminKey,
        data,
        timestamp: Date.now()
      };

      const transaction = this.db.transaction(['admin'], 'readwrite');
      const store = transaction.objectStore('admin');
      const request = store.put(adminData);

      request.onsuccess = () => {
        console.log(`💾 IndexedDBService: Адмін дані збережено: ${adminKey}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка збереження адмін даних: ${adminKey}`);
        reject(new Error(`Не вдалося зберегти адмін дані: ${adminKey}`));
      };
    });
  }

  // Завантаження адмін даних
  async loadAdminData(adminKey: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['admin'], 'readonly');
      const store = transaction.objectStore('admin');
      const request = store.get(adminKey);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`📂 IndexedDBService: Адмін дані завантажено: ${adminKey}`);
          resolve(request.result.data);
        } else {
          console.log(`📂 IndexedDBService: Адмін дані не знайдено: ${adminKey}`);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка завантаження адмін даних: ${adminKey}`);
        reject(new Error(`Помилка завантаження адмін даних: ${adminKey}`));
      };
    });
  }

  // === АНАЛІТИКА ===

  // Збереження аналітики
  async saveAnalytics(analyticsKey: string, data: any, type: string = 'general'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const analyticsData = {
        analyticsKey,
        data,
        type,
        timestamp: Date.now()
      };

      const transaction = this.db.transaction(['analytics'], 'readwrite');
      const store = transaction.objectStore('analytics');
      const request = store.put(analyticsData);

      request.onsuccess = () => {
        console.log(`📊 IndexedDBService: Аналітика збережена: ${analyticsKey}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка збереження аналітики: ${analyticsKey}`);
        reject(new Error(`Не вдалося зберегти аналітику: ${analyticsKey}`));
      };
    });
  }

  // Завантаження аналітики
  async loadAnalytics(analyticsKey: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['analytics'], 'readonly');
      const store = transaction.objectStore('analytics');
      const request = store.get(analyticsKey);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`📊 IndexedDBService: Аналітика завантажена: ${analyticsKey}`);
          resolve(request.result.data);
        } else {
          console.log(`📊 IndexedDBService: Аналітика не знайдена: ${analyticsKey}`);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка завантаження аналітики: ${analyticsKey}`);
        reject(new Error(`Помилка завантаження аналітики: ${analyticsKey}`));
      };
    });
  }

  // === ІММЕРСИВНИЙ ДОСВІД ===

  // Збереження даних досвіду
  async saveExperience(experienceKey: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const experienceData = {
        experienceKey,
        data,
        timestamp: Date.now()
      };

      const transaction = this.db.transaction(['experience'], 'readwrite');
      const store = transaction.objectStore('experience');
      const request = store.put(experienceData);

      request.onsuccess = () => {
        console.log(`🌟 IndexedDBService: Досвід збережено: ${experienceKey}`);
        resolve();
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка збереження досвіду: ${experienceKey}`);
        reject(new Error(`Не вдалося зберегти досвід: ${experienceKey}`));
      };
    });
  }

  // Завантаження даних досвіду
  async loadExperience(experienceKey: string): Promise<any | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const transaction = this.db.transaction(['experience'], 'readonly');
      const store = transaction.objectStore('experience');
      const request = store.get(experienceKey);

      request.onsuccess = () => {
        if (request.result) {
          console.log(`🌟 IndexedDBService: Досвід завантажено: ${experienceKey}`);
          resolve(request.result.data);
        } else {
          console.log(`🌟 IndexedDBService: Досвід не знайдено: ${experienceKey}`);
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error(`❌ IndexedDBService: Помилка завантаження досвіду: ${experienceKey}`);
        reject(new Error(`Помилка завантаження досвіду: ${experienceKey}`));
      };
    });
  }

  // === МІГРАЦІЯ З LOCALSTORAGE ===

  // Міграція всіх даних з localStorage в IndexedDB
  async migrateFromLocalStorage(): Promise<void> {
    console.log('🔄 IndexedDBService: Початок міграції з localStorage...');

    try {
      // Міграція медіафайлів
      await this.migrateContentManagerFiles();
      
      // Міграція налаштувань проекту
      await this.migrateProjectSettings();
      
      // Міграція адмін даних
      await this.migrateAdminData();
      
      // Міграція аналітики
      await this.migrateAnalyticsData();
      
      // Міграція іммерсивного досвіду
      await this.migrateExperienceData();

      console.log('✅ IndexedDBService: Міграція завершена успішно');
    } catch (error) {
      console.error('❌ IndexedDBService: Помилка міграції:', error);
      throw error;
    }
  }

  // Міграція файлів ContentManager
  private async migrateContentManagerFiles(): Promise<void> {
    const contentManagerData = localStorage.getItem('smartContentManager_v2');
    if (contentManagerData) {
      try {
        const files: FileItem[] = JSON.parse(contentManagerData);
        await this.saveFiles(files);
        console.log(`✅ Мігровано ${files.length} файлів з ContentManager`);
      } catch (error) {
        console.error('❌ Помилка міграції файлів ContentManager:', error);
      }
    }
  }

  // Міграція налаштувань проекту
  private async migrateProjectSettings(): Promise<void> {
    const settingsKeys = [
      'mainPageSettings',
      'welcomeSettings', 
      'introSettings',
      'previewSettings'
    ];

    for (const key of settingsKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          await this.saveSettings(key, parsedData, 'project');
          console.log(`✅ Мігровано налаштування: ${key}`);
        } catch (error) {
          console.error(`❌ Помилка міграції налаштувань ${key}:`, error);
        }
      }
    }
  }

  // Міграція адмін даних
  private async migrateAdminData(): Promise<void> {
    const adminKeys = ['adminSession', 'adminSettings'];

    for (const key of adminKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          await this.saveAdminData(key, parsedData);
          console.log(`✅ Мігровано адмін дані: ${key}`);
        } catch (error) {
          console.error(`❌ Помилка міграції адмін даних ${key}:`, error);
        }
      }
    }
  }

  // Міграція аналітики
  private async migrateAnalyticsData(): Promise<void> {
    const analyticsKeys = ['analyticsData', 'clientsData'];

    for (const key of analyticsKeys) {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          await this.saveAnalytics(key, parsedData, key === 'clientsData' ? 'clients' : 'analytics');
          console.log(`✅ Мігровано аналітику: ${key}`);
        } catch (error) {
          console.error(`❌ Помилка міграції аналітики ${key}:`, error);
        }
      }
    }
  }

  // Міграція іммерсивного досвіду
  private async migrateExperienceData(): Promise<void> {
    const data = localStorage.getItem('immersiveExperienceData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        await this.saveExperience('immersiveExperienceData', parsedData);
        console.log('✅ Мігровано дані іммерсивного досвіду');
      } catch (error) {
        console.error('❌ Помилка міграції іммерсивного досвіду:', error);
      }
    }
  }

  // === ОЧИЩЕННЯ ===

  // Очищення всіх даних
  async clearAllData(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('База даних не ініціалізована'));
        return;
      }

      const storeNames = Object.keys(this.dbConfig.stores);
      const transaction = this.db.transaction(storeNames, 'readwrite');

      let completed = 0;
      const total = storeNames.length;

      storeNames.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          completed++;
          console.log(`🧹 Очищено сховище: ${storeName}`);

          if (completed === total) {
            console.log('✅ IndexedDBService: Всі дані очищено');
            resolve();
          }
        };

        request.onerror = () => {
          console.error(`❌ Помилка очищення сховища: ${storeName}`);
          reject(new Error(`Помилка очищення сховища: ${storeName}`));
        };
      });

      transaction.onerror = () => {
        reject(new Error('Помилка транзакції очищення'));
      };
    });
  }

  // Закриття бази даних
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('📛 IndexedDBService: База даних закрита');
    }
  }
}

// Експорт єдиного екземпляра сервісу
export const indexedDBService = new IndexedDBService();
export default indexedDBService; 