import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Cloud, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { pocketbaseStorageService, UploadedFile } from '../services/PocketBaseStorageService';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface PocketBaseUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  allowedTypes?: ('image' | 'video' | 'audio' | 'document')[];
  maxFiles?: number;
  maxSize?: number; // MB
}

const PocketBaseUploader: React.FC<PocketBaseUploaderProps> = ({
  onUpload,
  allowedTypes = ['image', 'video', 'audio'],
  maxFiles = 10,
  maxSize = 50
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Перевірка підключення при ініціалізації
  React.useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await pocketbaseStorageService.checkConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      
      if (!isConnected) {
        const serviceInfo = pocketbaseStorageService.getServiceInfo();
        if (!serviceInfo.hasCredentials) {
          setError('PocketBase URL не налаштований. Додайте VITE_POCKETBASE_URL в environment variables.');
        } else {
          setError('Не вдалося підключитися до PocketBase Storage. Перевірте URL та доступність сервера.');
        }
      }
    } catch (error) {
      console.error('Помилка перевірки підключення:', error);
      setConnectionStatus('error');
      setError('Помилка ініціалізації PocketBase Storage');
    }
  };

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
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    setError(null);
    
    // Валідація файлів (той самий код що в SupabaseUploader)
    const validFiles = files.filter(file => validateFile(file));
    
    if (validFiles.length === 0) {
      setError('Не вибрано жодного валідного файлу');
      return;
    }

    if (validFiles.length > maxFiles) {
      setError(`Можна завантажити максимум ${maxFiles} файлів за раз`);
      return;
    }

    await uploadFiles(validFiles);
  };

  const validateFile = (file: File): boolean => {
    // Перевірка розміру
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл ${file.name} перевищує максимальний розмір ${maxSize}MB`);
      return false;
    }

    // Перевірка типу
    const fileType = getFileType(file);
    if (!allowedTypes.includes(fileType)) {
      setError(`Тип файлу ${file.name} не підтримується. Дозволені: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  const getFileType = (file: File): 'image' | 'video' | 'audio' | 'document' => {
    const mimeType = file.type.toLowerCase();
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    
    return 'document';
  };

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);

    try {
      console.log(`🚀 PocketBaseUploader: Починаємо завантаження ${files.length} файлів`);
      
      const results: UploadedFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        console.log(`📤 Завантаження файлу ${i + 1}/${files.length}: ${file.name}`);
        setUploadProgress((i / files.length) * 100);
        
        try {
          const uploadedFile = await pocketbaseStorageService.uploadFile(file);
          results.push(uploadedFile);
          
          console.log(`✅ Файл завантажено: ${uploadedFile.name}`);
        } catch (fileError) {
          console.error(`❌ Помилка завантаження файлу ${file.name}:`, fileError);
          setError(`Помилка завантаження ${file.name}: ${fileError}`);
        }
      }
      
      setUploadProgress(100);
      setUploadedFiles(results);
      
      if (results.length > 0) {
        console.log(`🎉 Успішно завантажено ${results.length} файлів`);
        onUpload(results);
      }
      
    } catch (error) {
      console.error('❌ Загальна помилка завантаження:', error);
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

  // Якщо немає підключення до PocketBase
  if (connectionStatus === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span className="font-medium">PocketBase Storage недоступний</span>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={checkConnection}
          className="mt-3"
        >
          Спробувати знову
        </Button>
      </div>
    );
  }

  if (connectionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin mr-2" size={20} />
        <span>Перевірка підключення до PocketBase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Area - ІДЕНТИЧНИЙ UI як в SupabaseUploader */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Cloud className="mx-auto mb-4 text-gray-400" size={48} />
        
        <h3 className="text-lg font-medium mb-2">
          Завантажити в Cloud Storage
        </h3>
        
        <p className="text-gray-600 mb-4">
          Перетягніть файли сюди або натисніть для вибору
        </p>
        
        <input
          type="file"
          id="pocketbase-file-upload"
          multiple
          accept={getAcceptTypes()}
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        
        <label htmlFor="pocketbase-file-upload">
          <Button
            variant="outline"
            disabled={isUploading}
            className="cursor-pointer"
            asChild
          >
            <span>
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Завантаження...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={16} />
                  Вибрати файли
                </>
              )}
            </span>
          </Button>
        </label>
        
        <p className="text-xs text-gray-500 mt-2">
          Максимум {maxFiles} файлів, до {maxSize}MB кожен
        </p>
        <p className="text-xs text-gray-500">
          Підтримувані типи: {allowedTypes.join(', ')}
        </p>
      </motion.div>

      {/* Progress - ІДЕНТИЧНИЙ UI */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Завантаження...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Success - ІДЕНТИЧНИЙ UI */}
      {uploadedFiles.length > 0 && !isUploading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span className="font-medium">
              Успішно завантажено {uploadedFiles.length} файлів в Cloud Storage
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="text-sm text-green-600">
                ✓ {file.originalName} ({Math.round(file.size / 1024)}KB)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error - ІДЕНТИЧНИЙ UI */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span className="font-medium">Помилка завантаження</span>
          </div>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PocketBaseUploader;


