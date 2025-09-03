/**
 * Централізована служба для очищення недоступних PocketBase файлів
 */

import { indexedDBService } from './IndexedDBService';
import { FileItem } from '../types/contentManager';

class PocketBaseCleanupService {
  private static instance: PocketBaseCleanupService;
  private isRunning = false;
  private cleanupPromise: Promise<void> | null = null;

  static getInstance(): PocketBaseCleanupService {
    if (!PocketBaseCleanupService.instance) {
      PocketBaseCleanupService.instance = new PocketBaseCleanupService();
    }
    return PocketBaseCleanupService.instance;
  }

  /**
   * Перевіряє чи файл є PocketBase файлом (по URL або флагу)
   */
  private isPocketBaseFile(file: FileItem): boolean {
    // Перевіряємо флаг
    if (file.isPocketBaseFile) return true;
    
    // Перевіряємо URL
    if (file.url && file.url.includes('api.pocketbasemax.cc')) return true;
    
    // Перевіряємо pocketbaseData
    if (file.pocketbaseData?.publicUrl) return true;
    
    return false;
  }

  /**
   * Отримує URL для перевірки доступності файлу
   */
  private getFileUrl(file: FileItem): string | null {
    if (file.pocketbaseData?.publicUrl) {
      return file.pocketbaseData.publicUrl;
    }
    
    if (file.url && file.url.includes('api.pocketbasemax.cc')) {
      return file.url;
    }
    
    return null;
  }

  /**
   * Перевіряє доступність файлу
   */
  private async isFileAccessible(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Очищує недоступні PocketBase файли з усіх кешів
   */
  async cleanupInvalidFiles(): Promise<{ removed: number; total: number }> {
    // Якщо очищення вже виконується, чекаємо його завершення
    if (this.isRunning && this.cleanupPromise) {
      await this.cleanupPromise;
      return { removed: 0, total: 0 };
    }

    this.isRunning = true;
    
    this.cleanupPromise = this.performCleanup();
    const result = await this.cleanupPromise;
    
    this.isRunning = false;
    this.cleanupPromise = null;
    
    return result;
  }

  private async performCleanup(): Promise<{ removed: number; total: number }> {
    try {
      console.log('🧹 PocketBaseCleanupService: Починаємо глобальне очищення...');
      
      // Завантажуємо всі файли з IndexedDB
      const allFiles = await indexedDBService.loadFiles();
      console.log(`📂 PocketBaseCleanupService: Завантажено ${allFiles.length} файлів для перевірки`);
      
      const validFiles: FileItem[] = [];
      const invalidFiles: FileItem[] = [];
      
      // Перевіряємо кожен файл
      for (const file of allFiles) {
        if (this.isPocketBaseFile(file)) {
          const fileUrl = this.getFileUrl(file);
          
          if (fileUrl) {
            const isAccessible = await this.isFileAccessible(fileUrl);
            
            if (isAccessible) {
              validFiles.push(file);
              console.log(`✅ PocketBaseCleanupService: Файл доступний: ${file.name}`);
            } else {
              invalidFiles.push(file);
              console.warn(`🗑️ PocketBaseCleanupService: Файл недоступний: ${file.name} (${fileUrl})`);
            }
          } else {
            // Файл без URL - видаляємо
            invalidFiles.push(file);
            console.warn(`🗑️ PocketBaseCleanupService: Файл без URL: ${file.name}`);
          }
        } else {
          // Не PocketBase файл - залишаємо
          validFiles.push(file);
        }
        
        // Невелика затримка щоб не перевантажити сервер
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Зберігаємо тільки валідні файли
      if (invalidFiles.length > 0) {
        await indexedDBService.saveFiles(validFiles);
        console.log(`🧹 PocketBaseCleanupService: Видалено ${invalidFiles.length} недоступних файлів`);
        
        // Очищуємо localStorage як резерв
        this.cleanupLocalStorage(invalidFiles);
      }
      
      return {
        removed: invalidFiles.length,
        total: allFiles.length
      };
      
    } catch (error) {
      console.error('❌ PocketBaseCleanupService: Помилка очищення:', error);
      return { removed: 0, total: 0 };
    }
  }

  /**
   * Очищає localStorage від недоступних файлів
   */
  private cleanupLocalStorage(invalidFiles: FileItem[]) {
    try {
      const savedFiles = localStorage.getItem('smartContentManager_v2');
      if (savedFiles) {
        const allFiles = JSON.parse(savedFiles) as FileItem[];
        const invalidIds = new Set(invalidFiles.map(f => f.id));
        
        const validFiles = allFiles.filter(file => !invalidIds.has(file.id));
        
        if (validFiles.length !== allFiles.length) {
          localStorage.setItem('smartContentManager_v2', JSON.stringify(validFiles));
          console.log(`🧹 PocketBaseCleanupService: Очищено localStorage від ${allFiles.length - validFiles.length} файлів`);
        }
      }
    } catch (error) {
      console.error('❌ PocketBaseCleanupService: Помилка очищення localStorage:', error);
    }
  }

  /**
   * Запускає очищення з затримкою
   */
  async scheduleCleanup(delayMs: number = 2000): Promise<void> {
    setTimeout(async () => {
      const result = await this.cleanupInvalidFiles();
      if (result.removed > 0) {
        console.log(`🎯 PocketBaseCleanupService: Очищення завершено - видалено ${result.removed} з ${result.total} файлів`);
        
        // Повідомляємо інші компоненти про зміни
        window.dispatchEvent(new CustomEvent('pocketbaseCleanupCompleted', {
          detail: result
        }));
      }
    }, delayMs);
  }
}

export const pocketbaseCleanupService = PocketBaseCleanupService.getInstance();
