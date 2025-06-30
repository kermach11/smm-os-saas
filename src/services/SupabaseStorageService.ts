// Інтерфейс для завантаженого файлу
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
  bucket: string;
  path: string;
}

// Конфігурація buckets для різних типів файлів
interface BucketConfig {
  images: string;
  videos: string;
  audio: string;
  documents: string;
}

class SupabaseStorageService {
  private supabaseUrl: string;
  private supabaseKey: string;
  private buckets: BucketConfig;
  private siteId: string;

  constructor() {
    // Отримуємо Supabase credentials з environment
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                      (window as any).ENV?.SUPABASE_URL || 
                      '';
    this.supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                      (window as any).ENV?.SUPABASE_ANON_KEY || 
                      '';

    // Налаштування buckets
    this.buckets = {
      images: 'smm-os-images',
      videos: 'smm-os-videos', 
      audio: 'smm-os-audio',
      documents: 'smm-os-documents'
    };

    // Генеруємо унікальний ID сайту
    this.siteId = this.generateSiteId();

    console.log('🚀 SupabaseStorageService: Ініціалізовано для сайту:', this.siteId);
  }

  // Генерація унікального ID сайту
  private generateSiteId(): string {
    const domain = window.location.hostname;
    if (domain === 'localhost' || domain === '127.0.0.1') {
      return `dev-${Date.now()}`;
    }
    return domain.replace(/\./g, '-');
  }

  // Визначення типу файлу та bucket
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

  // Генерація унікального шляху для файлу
  private generateFilePath(file: File, type: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || '';
    const fileName = `${timestamp}-${randomId}.${extension}`;
    
    return `${this.siteId}/${type}/${fileName}`;
  }

  // Завантаження файлу в Supabase Storage через REST API
  async uploadFile(file: File): Promise<UploadedFile> {
    try {
      console.log(`📤 SupabaseStorage: Починаємо завантаження файлу: ${file.name} (${Math.round(file.size/1024)}KB)`);
      
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase credentials не налаштовані');
      }
      
      // Визначаємо тип та bucket
      const { type, bucket } = this.getFileTypeAndBucket(file);
      
      // Генеруємо унікальний шлях
      const filePath = this.generateFilePath(file, type);
      
      console.log(`📁 SupabaseStorage: Завантажуємо в bucket: ${bucket}, шлях: ${filePath}`);
      
      // Завантажуємо файл через Supabase Storage REST API
      const uploadUrl = `${this.supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': file.type,
          'x-upsert': 'false'
        },
        body: file
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Помилка завантаження: ${response.status} - ${errorText}`);
      }

      // Формуємо публічний URL
      const publicUrl = `${this.supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;

      // Формуємо результат
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

      console.log(`✅ SupabaseStorage: Файл успішно завантажено:`, uploadedFile);
      return uploadedFile;
      
    } catch (error) {
      console.error(`❌ SupabaseStorage: Помилка завантаження файлу ${file.name}:`, error);
      throw error;
    }
  }

  // Завантаження декількох файлів
  async uploadFiles(files: File[]): Promise<UploadedFile[]> {
    console.log(`📤 SupabaseStorage: Завантаження ${files.length} файлів...`);
    
    const uploadPromises = files.map(file => this.uploadFile(file));
    
    try {
      const results = await Promise.all(uploadPromises);
      console.log(`✅ SupabaseStorage: Успішно завантажено ${results.length} файлів`);
      return results;
    } catch (error) {
      console.error(`❌ SupabaseStorage: Помилка завантаження файлів:`, error);
      throw error;
    }
  }

  // Видалення файлу
  async deleteFile(filePath: string, bucket: string): Promise<boolean> {
    try {
      console.log(`🗑️ SupabaseStorage: Видалення файлу: ${filePath} з bucket: ${bucket}`);
      
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase credentials не налаштовані');
      }
      
      const deleteUrl = `${this.supabaseUrl}/storage/v1/object/${bucket}/${filePath}`;
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Помилка видалення: ${response.status} - ${errorText}`);
      }

      console.log(`✅ SupabaseStorage: Файл успішно видалено`);
      return true;
      
    } catch (error) {
      console.error(`❌ SupabaseStorage: Помилка видалення файлу:`, error);
      return false;
    }
  }

  // Перевірка доступності Supabase
  async checkConnection(): Promise<boolean> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        console.warn('⚠️ SupabaseStorage: Credentials не налаштовані');
        return false;
      }
      
      const response = await fetch(`${this.supabaseUrl}/storage/v1/bucket`, {
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
        }
      });
      
      if (!response.ok) {
        console.warn('⚠️ SupabaseStorage: Помилка підключення:', response.status);
        return false;
      }
      
      console.log('✅ SupabaseStorage: Підключення успішне');
      return true;
      
    } catch (error) {
      console.warn('⚠️ SupabaseStorage: Не вдалося підключитися:', error);
      return false;
    }
  }

  // Отримання інформації про сервіс
  getServiceInfo(): { siteId: string, buckets: BucketConfig, hasCredentials: boolean } {
    return {
      siteId: this.siteId,
      buckets: this.buckets,
      hasCredentials: !!(this.supabaseUrl && this.supabaseKey)
    };
  }
}

// Експортуємо єдиний екземпляр сервісу
export const supabaseStorageService = new SupabaseStorageService();
export type { UploadedFile }; 