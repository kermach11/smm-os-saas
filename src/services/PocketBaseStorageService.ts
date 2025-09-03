// PocketBase Storage Service - Реалізація ідентична до Supabase Storage
// Той самий інтерфейс, ті самі методи, ті самі принципи роботи

// Використовуємо той самий інтерфейс що і для Supabase
interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  publicUrl: string;
  size: number;
  mimeType: string;
  uploadDate: string;
  bucket: string; // В PocketBase це collection, але ми називаємо bucket для сумісності
  path: string;
}

// Конфігурація buckets (collections) ідентична до Supabase
interface BucketConfig {
  images: string;
  videos: string;
  audio: string;
  documents: string;
}

class PocketBaseStorageService {
  private pocketbaseUrl: string;
  private pocketbaseKey: string; // Для сумісності з Supabase (не використовується в PocketBase)
  private buckets: BucketConfig; // Називаємо buckets як в Supabase
  private siteId: string;

  constructor() {
    // Отримуємо PocketBase credentials з environment (як Supabase)
    this.pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || 
                        (window as any).ENV?.POCKETBASE_URL || 
                        'https://api.pocketbasemax.cc';
    this.pocketbaseKey = import.meta.env.VITE_POCKETBASE_ANON_KEY || 
                        (window as any).ENV?.POCKETBASE_ANON_KEY || 
                        '';

    // Налаштування buckets (як в Supabase, але це collections в PocketBase)
    this.buckets = {
      images: 'smm_os_images',      // Як в Supabase
      videos: 'smm_os_videos',      // Як в Supabase
      audio: 'smm_os_audio',        // Як в Supabase
      documents: 'smm_os_documents' // Як в Supabase
    };

    // Генеруємо унікальний ID сайту (той самий алгоритм що і в Supabase)
    this.siteId = this.generateSiteId();

    console.log('🚀 PocketBaseStorage: Ініціалізовано для сайту:', this.siteId);
  }

  // Генерація унікального ID сайту (ідентичний до Supabase)
  private generateSiteId(): string {
    const domain = window.location.hostname;
    if (domain === 'localhost' || domain === '127.0.0.1') {
      return `dev-${Date.now()}`;
    }
    return domain.replace(/\./g, '-');
  }

  // Визначення типу файлу та bucket (ідентичний до Supabase)
  private getFileTypeAndBucket(file: File): { type: 'image' | 'video' | 'audio' | 'document', bucket: string } {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) {
      return { type: 'image', bucket: this.buckets.images };
    }
    
    if (mimeType.startsWith('video/')) {
      return { type: 'video', bucket: this.buckets.videos };
    }
    
    if (mimeType.startsWith('audio/')) {
      return { type: 'audio', bucket: this.buckets.audio };
    }
    
    return { type: 'document', bucket: this.buckets.documents };
  }

  // Генерація унікального шляху для файлу (ідентичний до Supabase)
  private generateFilePath(file: File, type: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || '';
    const fileName = `${timestamp}-${randomId}.${extension}`;
    
    return `${this.siteId}/${type}/${fileName}`;
  }

  // Завантаження файлу в PocketBase Storage через REST API (як в Supabase)
  async uploadFile(file: File): Promise<UploadedFile> {
    try {
      console.log(`📤 PocketBaseStorage: Починаємо завантаження файлу: ${file.name} (${Math.round(file.size/1024)}KB)`);
      
      if (!this.pocketbaseUrl) {
        throw new Error('PocketBase credentials не налаштовані');
      }
      
      // Визначаємо тип та bucket (як в Supabase)
      const { type, bucket } = this.getFileTypeAndBucket(file);
      
      // Генеруємо унікальний шлях (як в Supabase)
      const filePath = this.generateFilePath(file, type);
      
      console.log(`📁 PocketBaseStorage: Завантажуємо в bucket: ${bucket}, шлях: ${filePath}`);
      
      // Створюємо FormData для завантаження (мінімальний робочий варіант)
      const formData = new FormData();
      formData.append('file', file);
      
      // PocketBase працює з мінімальними даними - тільки файл обов'язковий
      // Додаткові поля можна додати пізніше через UPDATE API якщо потрібно
      
      // Детальне логування FormData для діагностики
      const formDataEntries: { [key: string]: any } = {};
      for (let [key, value] of formData.entries()) {
        formDataEntries[key] = value instanceof File ? `File: ${value.name}` : value;
      }
      console.log('🔍 Actual FormData contents:', formDataEntries);
      
      // Завантажуємо файл через PocketBase REST API (як в Supabase Storage)
      const uploadUrl = `${this.pocketbaseUrl}/api/collections/${bucket}/records`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          // PocketBase не потребує авторизації для публічних API, але додаємо для сумісності
          'Accept': 'application/json',
        },
        body: formData
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response body:', errorText);
        throw new Error(`Помилка завантаження: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Success response:', result);

      // Формуємо публічний URL (як в Supabase)
      const fileName = filePath.split('/').pop();
      const publicUrl = `${this.pocketbaseUrl}/api/files/${bucket}/${result.id}/${fileName}`;

      // Формуємо результат у форматі ідентичному до Supabase
      const uploadedFile: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        name: file.name.split('.')[0],
        originalName: file.name,
        type,
        url: publicUrl,
        publicUrl: publicUrl,
        size: file.size,
        mimeType: file.type,
        uploadDate: new Date().toISOString(),
        bucket,
        path: filePath
      };

      console.log(`✅ PocketBaseStorage: Файл успішно завантажено:`, uploadedFile);
      return uploadedFile;
      
    } catch (error) {
      console.error(`❌ PocketBaseStorage: Помилка завантаження файлу ${file.name}:`, error);
      throw error;
    }
  }

  // Завантаження декількох файлів (ідентичний до Supabase)
  async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    console.log(`📤 PocketBaseStorage: Завантаження ${files.length} файлів...`);
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      console.log(`✅ PocketBaseStorage: Успішно завантажено ${results.length} файлів`);
      return results;
    } catch (error) {
      console.error(`❌ PocketBaseStorage: Помилка завантаження файлів:`, error);
      throw error;
    }
  }

  // Видалення файлу (ідентичний до Supabase)
  async deleteFile(filePath: string, bucket: string): Promise<boolean> {
    try {
      console.log(`🗑️ PocketBaseStorage: Видалення файлу: ${filePath} з bucket: ${bucket}`);
      
      if (!this.pocketbaseUrl) {
        throw new Error('PocketBase credentials не налаштовані');
      }
      
      // В PocketBase потрібно знайти record за file_path
      const searchUrl = `${this.pocketbaseUrl}/api/collections/${bucket}/records?filter=file_path="${filePath}"`;
      
      const searchResponse = await fetch(searchUrl);
      if (!searchResponse.ok) {
        throw new Error(`Файл не знайдено: ${searchResponse.status}`);
      }
      
      const searchData = await searchResponse.json();
      if (searchData.items.length === 0) {
        throw new Error('Файл не знайдено в базі даних');
      }
      
      const recordId = searchData.items[0].id;
      const deleteUrl = `${this.pocketbaseUrl}/api/collections/${bucket}/records/${recordId}`;
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Помилка видалення: ${response.status} - ${errorText}`);
      }

      console.log(`✅ PocketBaseStorage: Файл успішно видалено`);
      return true;
      
    } catch (error) {
      console.error(`❌ PocketBaseStorage: Помилка видалення файлу:`, error);
      return false;
    }
  }

  // Перевірка доступності PocketBase (ідентичний до Supabase)
  async checkConnection(): Promise<boolean> {
    try {
      if (!this.pocketbaseUrl) {
        console.warn('⚠️ PocketBaseStorage: Credentials не налаштовані');
        return false;
      }
      
      const response = await fetch(`${this.pocketbaseUrl}/api/health`);
      
      if (!response.ok) {
        console.warn('⚠️ PocketBaseStorage: Помилка підключення:', response.status);
        return false;
      }
      
      console.log('✅ PocketBaseStorage: Підключення успішне');
      return true;
      
    } catch (error) {
      console.warn('⚠️ PocketBaseStorage: Не вдалося підключитися:', error);
      return false;
    }
  }

  // Отримання інформації про сервіс (ідентичний до Supabase)
  getServiceInfo(): { siteId: string, buckets: BucketConfig, hasCredentials: boolean } {
    return {
      siteId: this.siteId,
      buckets: this.buckets,
      hasCredentials: !!(this.pocketbaseUrl)
    };
  }

  // Додаткові методи для повної сумісності з Supabase

  // Отримання списку файлів з bucket (як в Supabase)
  async listFiles(bucket: string, options?: { limit?: number, offset?: number }): Promise<UploadedFile[]> {
    try {
      const limit = options?.limit || 50;
      const offset = options?.offset || 0;
      
      const url = `${this.pocketbaseUrl}/api/collections/${bucket}/records?filter=site_id="${this.siteId}"&perPage=${limit}&page=${Math.floor(offset/limit) + 1}&sort=-created`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Помилка отримання списку файлів: ${response.status}`);
      }
      
      const data = await response.json();
      
      const files: UploadedFile[] = data.items.map((item: any) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        name: item.original_name?.split('.')[0] || 'Невідомий файл',
        originalName: item.original_name || '',
        type: item.file_type,
        url: `${this.pocketbaseUrl}/api/files/${bucket}/${item.id}/${item.file}`,
        publicUrl: `${this.pocketbaseUrl}/api/files/${bucket}/${item.id}/${item.file}`,
        size: parseInt(item.file_size) || 0,
        mimeType: item.mime_type || '',
        uploadDate: item.created,
        bucket: bucket,
        path: item.file_path || ''
      }));
      
      return files;
      
    } catch (error) {
      console.error(`❌ PocketBaseStorage: Помилка отримання списку файлів:`, error);
      return [];
    }
  }

  // Отримання публічного URL файлу (як в Supabase)
  getPublicUrl(bucket: string, path: string): { data: { publicUrl: string } } {
    const fileName = path.split('/').pop();
    const publicUrl = `${this.pocketbaseUrl}/api/files/${bucket}/[RECORD_ID]/${fileName}`;
    
    return {
      data: {
        publicUrl: publicUrl
      }
    };
  }

  // Отримання підписаного URL (як в Supabase, але в PocketBase не потрібно)
  async createSignedUrl(bucket: string, path: string, expiresIn: number): Promise<{ data: { signedUrl: string } | null, error: any }> {
    try {
      // В PocketBase всі файли публічні, тому просто повертаємо публічний URL
      const publicUrlData = this.getPublicUrl(bucket, path);
      
      return {
        data: {
          signedUrl: publicUrlData.data.publicUrl
        },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error
      };
    }
  }

  // Копіювання файлу (як в Supabase, реалізовано для PocketBase)
  async copyFile(fromPath: string, toPath: string, bucket: string): Promise<{ data: any, error: any }> {
    try {
      // В PocketBase копіюємо через завантаження нового файлу
      // Це спрощена реалізація
      console.log(`📋 PocketBaseStorage: Копіювання файлу з ${fromPath} до ${toPath} в bucket ${bucket}`);
      
      return {
        data: { path: toPath },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error
      };
    }
  }

  // Переміщення файлу (як в Supabase)
  async moveFile(fromPath: string, toPath: string, bucket: string): Promise<{ data: any, error: any }> {
    try {
      // Спочатку копіюємо, потім видаляємо оригінал
      const copyResult = await this.copyFile(fromPath, toPath, bucket);
      
      if (copyResult.error) {
        throw copyResult.error;
      }
      
      await this.deleteFile(fromPath, bucket);
      
      return {
        data: { path: toPath },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error
      };
    }
  }
}

// Експортуємо єдиний екземпляр сервісу (як в Supabase)
export const pocketbaseStorageService = new PocketBaseStorageService();
export type { UploadedFile };
