export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  originalName: string;
  size: number;
  uploadDate: string;
  optimized: boolean;
  hasContent?: boolean; // Чи є повний контент файлу
  corrupted?: boolean; // Чи пошкоджений файл
  isHeavy?: boolean; // Чи файл зберігається в IndexedDB (важкий файл >2MB)
  hasFullFile?: boolean; // Чи повний файл доступний в IndexedDB
  isFullFile?: boolean; // Чи це повний файл (не мініатюра)
  fullVideoUrl?: string; // Повний URL відео файлу (для відео з превью)
  isSupabaseFile?: boolean; // Чи файл завантажений через Supabase Storage
  supabaseData?: {
    bucket: string;
    path: string;
    publicUrl: string;
  };
  isPocketBaseFile?: boolean; // Чи файл завантажений через PocketBase Storage
  pocketbaseData?: {
    collection: string;
    path: string;
    publicUrl: string;
    recordId?: string; // PocketBase record ID для видалення
  };
  // Розширені метадані для кращого відображення
  sizeFormatted?: string; // Форматований розмір (наприклад, "2.5 MB")
  uploadDateFormatted?: string; // Форматована дата (наприклад, "2 хв. тому")
  fileExtension?: string; // Розширення файлу (.jpg, .mp4, тощо)
}

export interface ContentManagerProps {
  className?: string;
  onFileSelect?: (file: FileItem) => void;
  maxFileSize?: number; // в байтах
  allowedTypes?: ('image' | 'audio' | 'video')[];
}

export interface ContentManagerExport {
  files: FileItem[];
  exportDate: string;
  version: string;
} 