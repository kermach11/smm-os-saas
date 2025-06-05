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