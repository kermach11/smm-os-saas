import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import SupabaseUploader from './SupabaseUploader';
import PocketBaseUploader from './PocketBaseUploader';
// import { storageServiceSwitcher } from '../services/StorageServiceSwitcher'; // Removed due to empty file
import { UploadedFile } from '../services/SupabaseStorageService';

interface CloudStorageManagerProps {
  onSupabaseUpload: (files: UploadedFile[]) => void;
  onPocketBaseUpload: (files: any[]) => void;
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[];
}

type StorageProvider = 'supabase' | 'pocketbase' | 'auto';

const CloudStorageManager: React.FC<CloudStorageManagerProps> = ({
  onSupabaseUpload,
  onPocketBaseUpload,
  allowedTypes = ['image', 'video', 'audio']
}) => {
  const { t } = useTranslation();
  const [activeProvider, setActiveProvider] = useState<StorageProvider>('pocketbase');

  // Обробник завантаження з автоматичним перемиканням
  const handleAutoUpload = async (files: File[]) => {
    try {
      console.log('🔄 CloudStorageManager: Використовуємо автоматичне перемикання');
      
      const results: any[] = [];
      
      for (const file of files) {
        try {
          // TODO: Implement unified storage service switcher
          console.warn('⚠️ CloudStorageManager: storageServiceSwitcher not available');
          // const result = await storageServiceSwitcher.uploadFile(file);
          // results.push(result);
        } catch (error) {
          console.error(`❌ Помилка завантаження файлу ${file.name}:`, error);
          throw error;
        }
      }
      
      if (results.length > 0) {
        console.log(`✅ Автоматично завантажено ${results.length} файлів`);
        
        // Визначаємо провайдера з результатів та викликаємо відповідний обробник
        const provider = results[0]?.provider || 'pocketbase';
        if (provider === 'pocketbase') {
          onPocketBaseUpload(results);
        } else {
          onSupabaseUpload(results);
        }
      }
    } catch (error) {
      console.error('❌ Помилка автоматичного завантаження:', error);
      throw error;
    }
  };

  const getProviderIcon = (provider: StorageProvider) => {
    switch (provider) {
      case 'supabase':
        return '🟢';
      case 'pocketbase':
        return '🔵';
      case 'auto':
        return '🔄';
      default:
        return '🌐';
    }
  };

  const getProviderName = (provider: StorageProvider) => {
    switch (provider) {
      case 'supabase':
        return 'Supabase Storage';
      case 'pocketbase':
        return 'PocketBase Storage';
      case 'auto':
        return 'Автоматичний вибір';
      default:
        return 'Cloud Storage';
    }
  };

  return (
    <motion.div
      key="cloud"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4 lg:space-y-6"
    >
      {/* Заголовок та опис */}
      <div className="text-center space-y-2">
        <h3 className="text-lg lg:text-xl font-bold text-slate-800">
          🌐 {t('content.manager.cloud')}
        </h3>
        <p className="text-sm text-slate-600">
          Завантажуйте файли в хмарне сховище з автоматичним резервуванням
        </p>
      </div>

      {/* ПРИХОВАНО: Вкладки провайдерів - тепер показуємо тільки PocketBase */}
      {/*
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-50 rounded-xl">
        {(['auto', 'supabase', 'pocketbase'] as StorageProvider[]).map((provider) => (
          <button
            key={provider}
            onClick={() => setActiveProvider(provider)}
            className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs lg:text-sm min-h-[36px] touch-manipulation flex items-center gap-2 ${
              activeProvider === provider
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700 shadow-sm'
            }`}
          >
            <span>{getProviderIcon(provider)}</span>
            <span className="hidden sm:inline">{getProviderName(provider)}</span>
            <span className="sm:hidden">{provider === 'auto' ? 'Авто' : provider === 'supabase' ? 'Supa' : 'Pocket'}</span>
          </button>
        ))}
      </div>
      */}

      {/* Контент провайдерів */}
      <AnimatePresence mode="wait">
        {/* ПРИХОВАНО: Автоматичний вибір - логіка залишена для стабільності */}
        {/*
        {activeProvider === 'auto' && (
          <motion.div
            key="auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 lg:p-6 border border-purple-100"
          >
            <div className="text-center space-y-3 mb-4">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔄</span>
              </div>
              <h4 className="font-semibold text-slate-800">Розумне завантаження</h4>
              <p className="text-sm text-slate-600">
                Система автоматично обирає найкращий доступний провайдер
              </p>
            </div>
            
            <AutoUploader 
              onUpload={handleAutoUpload}
              allowedTypes={allowedTypes}
              maxFiles={10}
              maxSize={50}
            />
          </motion.div>
        )}
        */}

        {/* ПРИХОВАНО: Supabase Storage - логіка залишена для стабільності */}
        {/*
        {activeProvider === 'supabase' && (
          <motion.div
            key="supabase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <SupabaseUploader 
              onUpload={onSupabaseUpload}
              allowedTypes={allowedTypes}
              maxFiles={10}
              maxSize={50}
            />
          </motion.div>
        )}
        */}

        {activeProvider === 'pocketbase' && (
          <motion.div
            key="pocketbase"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <PocketBaseUploader 
              onUpload={onPocketBaseUpload}
              allowedTypes={allowedTypes}
              maxFiles={10}
              maxSize={50}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Компонент для автоматичного завантаження
interface AutoUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  allowedTypes: ('image' | 'video' | 'audio' | 'document')[];
  maxFiles: number;
  maxSize: number;
}

const AutoUploader: React.FC<AutoUploaderProps> = ({
  onUpload,
  allowedTypes,
  maxFiles,
  maxSize
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length > maxFiles) {
      setError(`Максимум ${maxFiles} файлів за раз`);
      return;
    }

    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Файли перевищують розмір ${maxSize}MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await onUpload(files);
      setUploadProgress(100);
    } catch (error) {
      console.error('Помилка завантаження:', error);
      setError(`Помилка завантаження: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  const getAcceptTypes = (): string => {
    const mimeTypes: { [key: string]: string } = {
      image: '.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,image/*',
      video: '.mp4,.avi,.mov,.wmv,.mkv,.webm,.m4v,video/*',
      audio: '.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma,audio/*',
      document: '.pdf,.doc,.docx,.txt'
    };
    
    return allowedTypes.map(type => mimeTypes[type]).join(',');
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop зона */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 lg:p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-purple-400 bg-purple-50'
            : 'border-slate-300 hover:border-purple-300 hover:bg-slate-50'
        }`}
      >
        <input
          type="file"
          multiple
          accept={getAcceptTypes()}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔄</span>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-slate-800 mb-1">
              Розумне завантаження файлів
            </h4>
            <p className="text-sm text-slate-600">
              Перетягніть файли сюди або клікніть для вибору
            </p>
          </div>
          
          <div className="text-xs text-slate-500">
            Підтримуються: {allowedTypes.join(', ')} • Максимум {maxFiles} файлів • До {maxSize}MB кожен
          </div>
        </div>
      </div>

      {/* Прогрес завантаження */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Завантаження...</span>
            <span className="text-purple-600 font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Помилки */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CloudStorageManager;
