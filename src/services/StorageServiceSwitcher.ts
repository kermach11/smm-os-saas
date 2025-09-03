// Storage Service Switcher - керування переключенням між різними storage провайдерами
// Уніфікована робота з ідентичними інтерфейсами

import { pocketbaseStorageService, UploadedFile as PocketBaseFile } from './PocketBaseStorageService';
import { supabaseStorageService, UploadedFile as SupabaseFile } from './SupabaseStorageService';

// Універсальний інтерфейс для всіх storage провайдерів
export interface UniversalUploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  provider: 'supabase' | 'pocketbase';
  bucket?: string;
  collection?: string;
  path: string;
  siteId?: string;
}

type StorageProvider = 'supabase' | 'pocketbase' | 'auto';

interface StorageProviderInfo {
  name: string;
  isAvailable: boolean;
  isHealthy: boolean;
  priority: number;
  lastCheck: Date | null;
  url?: string;
}

class StorageServiceSwitcher {
  private currentProvider: StorageProvider = 'auto';
  private providers: Map<StorageProvider, StorageProviderInfo> = new Map();
  private healthCheckInterval: number = 60000; // 1 хвилина

  constructor() {
    this.initializeProviders();
    this.startHealthMonitoring();
    console.log('🔄 StorageServiceSwitcher: Ініціалізовано');
  }

  // Ініціалізація провайдерів
  private initializeProviders(): void {
    this.providers.set('supabase', {
      name: 'Supabase Storage',
      isAvailable: true,
      isHealthy: false,
      priority: 2,
      lastCheck: null
    });

    this.providers.set('pocketbase', {
      name: 'PocketBase (Hetzner)',
      isAvailable: true,
      isHealthy: false,
      priority: 1,
      lastCheck: null
    });
  }

  // Моніторинг здоров'я провайдерів
  private startHealthMonitoring(): void {
    // Перевіряємо одразу
    this.checkAllProvidersHealth();
    
    // Потім періодично
    setInterval(() => {
      this.checkAllProvidersHealth();
    }, this.healthCheckInterval);
  }

  // Перевірка здоров'я всіх провайдерів
  private async checkAllProvidersHealth(): Promise<void> {
    const checks = [
      this.checkProviderHealth('supabase'),
      this.checkProviderHealth('pocketbase')
    ];

    await Promise.allSettled(checks);
    
    // Логування статусу
    this.logProvidersStatus();
  }

  // Перевірка здоров'я конкретного провайдера
  private async checkProviderHealth(provider: StorageProvider): Promise<boolean> {
    if (provider === 'auto') return false;

    try {
      let isHealthy = false;
      let url = '';

      switch (provider) {
        case 'supabase':
          isHealthy = await supabaseStorageService.checkConnection();
          const supabaseInfo = supabaseStorageService.getServiceInfo();
          url = 'Supabase Cloud';
          break;

        case 'pocketbase':
          isHealthy = await pocketbaseStorageService.checkConnection();
          const pbInfo = pocketbaseStorageService.getServiceInfo();
          url = 'PocketBase Hetzner';
          break;
      }

      const providerInfo = this.providers.get(provider);
      if (providerInfo) {
        providerInfo.isHealthy = isHealthy;
        providerInfo.lastCheck = new Date();
        providerInfo.url = url;
      }

      return isHealthy;
    } catch (error) {
      console.warn(`⚠️ StorageServiceSwitcher: Помилка перевірки ${provider}:`, error);
      
      const providerInfo = this.providers.get(provider);
      if (providerInfo) {
        providerInfo.isHealthy = false;
        providerInfo.lastCheck = new Date();
      }
      
      return false;
    }
  }

  // Логування статусу провайдерів
  private logProvidersStatus(): void {
    console.log('📊 StorageServiceSwitcher: Статус провайдерів:');
    
    for (const [key, info] of this.providers.entries()) {
      const status = info.isHealthy ? '✅' : '❌';
      const time = info.lastCheck ? info.lastCheck.toLocaleTimeString() : 'Не перевірено';
      console.log(`   ${status} ${info.name} (${key}) - ${time}`);
    }
  }

  // Отримання найкращого доступного провайдера
  private getBestAvailableProvider(): StorageProvider {
    const sortedProviders = Array.from(this.providers.entries())
      .filter(([_, info]) => info.isAvailable && info.isHealthy)
      .sort(([_, a], [__, b]) => a.priority - b.priority);

    if (sortedProviders.length === 0) {
      console.warn('⚠️ StorageServiceSwitcher: Жоден провайдер не доступний, використовуємо supabase');
      return 'supabase';
    }

    const bestProvider = sortedProviders[0][0] as StorageProvider;
    console.log(`🎯 StorageServiceSwitcher: Найкращий провайдер: ${bestProvider}`);
    return bestProvider;
  }

  // Конвертація різних типів файлів у універсальний формат
  private convertToUniversalFile(
    file: SupabaseFile | PocketBaseFile, 
    provider: StorageProvider
  ): UniversalUploadedFile {
    const universalFile: UniversalUploadedFile = {
      id: file.id,
      name: file.name,
      originalName: file.originalName,
      type: file.type,
      url: file.url,
      publicUrl: file.publicUrl,
      size: file.size,
      mimeType: file.mimeType,
      uploadDate: file.uploadDate,
      provider: provider,
      path: file.path
    };

    // Додаємо специфічні поля
    if ('bucket' in file) {
      universalFile.bucket = file.bucket;
    }

    if ('collection' in file) {
      universalFile.collection = file.collection;
    }

    if ('siteId' in file) {
      universalFile.siteId = file.siteId;
    }

    return universalFile;
  }

  // Встановлення конкретного провайдера
  setProvider(provider: StorageProvider): void {
    this.currentProvider = provider;
    console.log(`🔄 StorageServiceSwitcher: Встановлено провайдер: ${provider}`);
  }

  // Отримання поточного провайдера
  getCurrentProvider(): StorageProvider {
    return this.currentProvider;
  }

  // Завантаження файлу через обраний провайдер
  async uploadFile(file: File, preferredProvider?: StorageProvider): Promise<UniversalUploadedFile> {
    const provider = preferredProvider || 
                    (this.currentProvider === 'auto' ? this.getBestAvailableProvider() : this.currentProvider);

    console.log(`📤 StorageServiceSwitcher: Завантаження файлу ${file.name} через ${provider}`);

    try {
      let uploadedFile: SupabaseFile | PocketBaseFile;

      switch (provider) {
        case 'supabase':
          uploadedFile = await supabaseStorageService.uploadFile(file);
          break;

        case 'pocketbase':
          uploadedFile = await pocketbaseStorageService.uploadFile(file);
          break;

        default:
          throw new Error(`Невідомий провайдер: ${provider}`);
      }

      const universalFile = this.convertToUniversalFile(uploadedFile, provider);
      console.log(`✅ StorageServiceSwitcher: Файл завантажено через ${provider}`);
      return universalFile;

    } catch (error) {
      console.error(`❌ StorageServiceSwitcher: Помилка завантаження через ${provider}:`, error);

      // Якщо поточний провайдер не працює, спробуємо інший
      if (this.currentProvider === 'auto' && !preferredProvider) {
        const otherProviders = ['supabase', 'pocketbase'] as StorageProvider[];
        
        for (const otherProvider of otherProviders) {
          if (otherProvider !== provider) {
            try {
              console.log(`🔄 StorageServiceSwitcher: Спроба через резервний провайдер: ${otherProvider}`);
              return await this.uploadFile(file, otherProvider);
            } catch (fallbackError) {
              console.warn(`⚠️ StorageServiceSwitcher: Резервний провайдер ${otherProvider} також не працює`);
            }
          }
        }
      }

      throw error;
    }
  }

  // Завантаження декількох файлів
  async uploadFiles(
    files: File[], 
    onProgress?: (progress: number, currentFile: string) => void,
    preferredProvider?: StorageProvider
  ): Promise<UniversalUploadedFile[]> {
    const provider = preferredProvider || 
                    (this.currentProvider === 'auto' ? this.getBestAvailableProvider() : this.currentProvider);

    console.log(`📤 StorageServiceSwitcher: Завантаження ${files.length} файлів через ${provider}`);

    const results: UniversalUploadedFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        if (onProgress) {
          onProgress((i / files.length) * 100, file.name);
        }

        const result = await this.uploadFile(file, provider);
        results.push(result);
        
      } catch (error) {
        const errorMsg = `Помилка завантаження ${file.name}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ StorageServiceSwitcher: ${errorMsg}`);
      }
    }

    if (onProgress) {
      onProgress(100, 'Завершено');
    }

    if (errors.length > 0) {
      console.warn(`⚠️ StorageServiceSwitcher: Завантажено ${results.length}/${files.length} файлів. Помилки:`, errors);
    }

    return results;
  }

  // Тестування провайдера
  async testProvider(provider: StorageProvider): Promise<{
    success: boolean,
    message: string,
    details: any
  }> {
    if (provider === 'auto') {
      return {
        success: false,
        message: 'Неможливо тестувати "auto" провайдер',
        details: {}
      };
    }

    try {
      switch (provider) {
        case 'supabase':
          const supabaseHealthy = await supabaseStorageService.checkConnection();
          return {
            success: supabaseHealthy,
            message: supabaseHealthy ? 'Supabase працює' : 'Supabase недоступний',
            details: supabaseStorageService.getServiceInfo()
          };

        case 'pocketbase':
          const pocketbaseHealthy = await pocketbaseStorageService.checkConnection();
          return {
            success: pocketbaseHealthy,
            message: pocketbaseHealthy ? 'PocketBase працює' : 'PocketBase недоступний',
            details: pocketbaseStorageService.getServiceInfo()
          };

        default:
          return {
            success: false,
            message: `Невідомий провайдер: ${provider}`,
            details: {}
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Помилка тестування ${provider}: ${error}`,
        details: { error: error.toString() }
      };
    }
  }

  // Отримання статистики всіх провайдерів
  getProvidersStatus(): Map<StorageProvider, StorageProviderInfo> {
    return new Map(this.providers);
  }

  // Ручна перевірка здоров'я
  async refreshProvidersHealth(): Promise<void> {
    console.log('🔄 StorageServiceSwitcher: Ручна перевірка здоров\'я провайдерів...');
    await this.checkAllProvidersHealth();
  }

  // Отримання рекомендацій по провайдерам
  getProviderRecommendations(): {
    recommended: StorageProvider,
    available: StorageProvider[],
    unavailable: StorageProvider[]
  } {
    const available: StorageProvider[] = [];
    const unavailable: StorageProvider[] = [];

    for (const [provider, info] of this.providers.entries()) {
      if (info.isAvailable && info.isHealthy) {
        available.push(provider);
      } else {
        unavailable.push(provider);
      }
    }

    // Сортуємо за пріоритетом
    available.sort((a, b) => {
      const aInfo = this.providers.get(a);
      const bInfo = this.providers.get(b);
      return (aInfo?.priority || 999) - (bInfo?.priority || 999);
    });

    return {
      recommended: available[0] || 'supabase',
      available,
      unavailable
    };
  }
}

// Експортуємо єдиний екземпляр
export const storageServiceSwitcher = new StorageServiceSwitcher();
export type { UniversalUploadedFile, StorageProvider };
