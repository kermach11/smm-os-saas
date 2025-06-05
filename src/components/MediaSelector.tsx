import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem } from '../types/contentManager';
import indexedDBService from '../services/IndexedDBService';

interface MediaSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (file: FileItem) => void;
  allowedTypes?: ('image' | 'audio' | 'video')[];
  title?: string;
  description?: string;
}

const MediaSelector: React.FC<MediaSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ['image', 'audio', 'video'],
  title = 'Вибрати медіа файл',
  description = 'Оберіть файл з вашої медіа-бібліотеки'
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);

  // Завантаження файлів з localStorage
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 MediaSelector відкрито, починаємо завантаження файлів');
      console.log('🎯 Дозволені типи:', allowedTypes);
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 MediaSelector: Завантаження файлів через IndexedDBService...');
      console.log('🎯 Дозволені типи файлів:', allowedTypes);
      
      // Спочатку пробуємо завантажити з IndexedDB через новий сервіс
      const indexedDBFiles = await indexedDBService.loadFiles();
      
      if (indexedDBFiles.length > 0) {
        console.log(`📂 MediaSelector: Завантажено ${indexedDBFiles.length} файлів з IndexedDB`);
        
        // Автоматично виправляємо неправильно збережені файли
        const correctedFiles = await fixIncorrectFileTypes(indexedDBFiles);
        setFiles(correctedFiles);
      } else {
        // Якщо IndexedDB порожній, пробуємо localStorage як резерв
        console.log('ℹ️ MediaSelector: IndexedDB порожній, перевіряємо localStorage...');
        
        const savedFiles = localStorage.getItem('smartContentManager_v2');
        if (savedFiles) {
          const allFiles = JSON.parse(savedFiles) as FileItem[];
          console.log(`📂 MediaSelector: Завантажено ${allFiles.length} файлів з localStorage`);
          
          // Виправляємо файли та мігруємо в IndexedDB
          const correctedFiles = await fixIncorrectFileTypes(allFiles);
          await indexedDBService.saveFiles(correctedFiles);
          
          setFiles(correctedFiles);
          console.log('✅ MediaSelector: Міграція та виправлення завершено');
        } else {
          console.log('📂 MediaSelector: Немає збережених файлів');
          setFiles([]);
        }
      }
    } catch (error) {
      console.error('❌ MediaSelector: Помилка завантаження файлів:', error);
      
      // У випадку помилки пробуємо localStorage
      try {
        const savedFiles = localStorage.getItem('smartContentManager_v2');
        if (savedFiles) {
          const allFiles = JSON.parse(savedFiles) as FileItem[];
          const correctedFiles = await fixIncorrectFileTypes(allFiles);
          setFiles(correctedFiles);
          console.log('✅ MediaSelector: Резервне завантаження з localStorage успішне');
        } else {
          setFiles([]);
        }
      } catch (localStorageError) {
        console.error('❌ MediaSelector: Помилка резервного завантаження:', localStorageError);
        setFiles([]);
      }
    } finally {
      setIsLoading(false);
      console.log('🏁 MediaSelector: Завантаження файлів завершено');
    }
  };

  // Функція для автоматичного виправлення неправильно збережених файлів
  const fixIncorrectFileTypes = async (files: FileItem[]): Promise<FileItem[]> => {
    console.log('🔧 MediaSelector: Початок автоматичного виправлення файлів...');
    
    const correctedFiles: FileItem[] = [];
    let fixedCount = 0;
    let deletedCount = 0;
    
    for (const file of files) {
      if (!file.url || !file.url.startsWith('data:')) {
        correctedFiles.push(file);
        continue;
      }
      
      const mimeType = file.url.split(';')[0].replace('data:', '');
      let shouldFix = false;
      let correctType: 'image' | 'audio' | 'video' | null = null;
      
      // Спеціальна логіка для файлів з розширенням відео
      const isVideoExtension = file.originalName && /\.(mp4|mov|avi|webm|mkv|wmv|flv|m4v)$/i.test(file.originalName);
      const isAudioExtension = file.originalName && /\.(mp3|wav|ogg|aac|m4a|flac|wma)$/i.test(file.originalName);
      const isImageExtension = file.originalName && /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.originalName);
      
      console.log(`🔍 Аналіз файлу: ${file.name}`, {
        originalName: file.originalName,
        storedType: file.type,
        mimeType: mimeType,
        isVideoExtension,
        isAudioExtension,
        isImageExtension
      });
      
      // Виявляємо неправильно збережені типи на основі розширення та MIME-типу
      if (isVideoExtension && file.type !== 'video') {
        console.log(`🔧 Виправляємо: ${file.name} має відео розширення, але збережено як ${file.type}`);
        correctType = 'video';
        shouldFix = true;
      } else if (isAudioExtension && file.type !== 'audio') {
        console.log(`🔧 Виправляємо: ${file.name} має аудіо розширення, але збережено як ${file.type}`);
        correctType = 'audio';
        shouldFix = true;
      } else if (isImageExtension && file.type !== 'image') {
        console.log(`🔧 Виправляємо: ${file.name} має зображення розширення, але збережено як ${file.type}`);
        correctType = 'image';
        shouldFix = true;
      } else if (file.type === 'video' && mimeType.startsWith('image/') && !isImageExtension) {
        console.log(`🔧 Виправляємо: ${file.name} збережено як відео, але MIME-тип зображення (${mimeType})`);
        // Якщо оригінальна назва вказує на відео, залишаємо як відео
        if (isVideoExtension) {
          console.log(`📹 Залишаємо як відео через розширення файлу`);
          correctedFiles.push(file); // Залишаємо як є
          continue;
        } else {
          correctType = 'image';
          shouldFix = true;
        }
      } else if (file.type === 'image' && mimeType.startsWith('video/')) {
        console.log(`🔧 Виправляємо: ${file.name} збережено як зображення, але це відео (${mimeType})`);
        correctType = 'video';
        shouldFix = true;
      } else if (file.type === 'audio' && (mimeType.startsWith('image/') || mimeType.startsWith('video/'))) {
        console.log(`🔧 Виправляємо: ${file.name} збережено як аудіо, але це ${mimeType.split('/')[0]}`);
        correctType = mimeType.startsWith('image/') ? 'image' : 'video';
        shouldFix = true;
      }
      
      // Видаляємо файли з SVG placeholder замість відео
      if (file.type === 'video' && file.url.includes('data:image/svg+xml') && file.url.includes('🎬')) {
        console.log(`🗑️ Видаляємо SVG placeholder замість відео: ${file.name}`);
        deletedCount++;
        continue; // Не додаємо цей файл до результату
      }
      
      // Видаляємо дублікати файлів (якщо є файл з тим же ім'ям але правильним типом)
      const duplicateFile = correctedFiles.find(f => 
        f.originalName === file.originalName && f.name === file.name && f.type !== file.type
      );
      if (duplicateFile) {
        console.log(`🗑️ Видаляємо дублікат: ${file.name} (${file.type}), залишаємо (${duplicateFile.type})`);
        deletedCount++;
        continue;
      }
      
      if (shouldFix && correctType) {
        const fixedFile = {
          ...file,
          type: correctType
        };
        correctedFiles.push(fixedFile);
        fixedCount++;
        console.log(`✅ Виправлено тип файлу: ${file.name} (${file.originalName}) → ${file.type} → ${correctType}`);
      } else {
        correctedFiles.push(file);
      }
    }
    
    if (fixedCount > 0 || deletedCount > 0) {
      console.log(`✅ MediaSelector: Автоматичне виправлення завершено. Виправлено: ${fixedCount}, видалено: ${deletedCount}`);
      
      // Зберігаємо виправлені файли назад в IndexedDB
      try {
        await indexedDBService.saveFiles(correctedFiles);
        console.log('💾 MediaSelector: Виправлені файли збережено в IndexedDB');
        
        // LocalStorage тільки для мінімальних даних (без великих URL)
        const minimalFiles = correctedFiles.map(file => ({
          ...file,
          url: file.url && file.url.length > 100000 ? '' : file.url // Очищаємо великі URL
        }));
        localStorage.setItem('smartContentManager_v2', JSON.stringify(minimalFiles));
        console.log('💾 MediaSelector: Мінімальні дані збережено в localStorage');
      } catch (saveError) {
        console.error('❌ MediaSelector: Помилка збереження виправлених файлів:', saveError);
      }
    } else {
      console.log('✅ MediaSelector: Всі файли мають правильний тип');
    }
    
    return correctedFiles;
  };

  // Завантаження повних файлів з IndexedDB
  const loadFullFilesFromIndexedDB = async (currentFiles: FileItem[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Таймаут для уникнення зависання
      const timeout = setTimeout(() => {
        console.warn('⏰ Таймаут завантаження з IndexedDB (5 секунд)');
        reject(new Error('Таймаут завантаження з IndexedDB'));
      }, 5000);

      try {
        const request = indexedDB.open('ContentManagerDB', 2); // Оновлено до версії 2
        
        request.onupgradeneeded = (event) => {
          console.log('🔧 Створення/оновлення структури IndexedDB в MediaSelector');
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Видаляємо старе сховище якщо воно існує
          if (db.objectStoreNames.contains('files')) {
            db.deleteObjectStore('files');
            console.log('🗑️ Видалено старе об\'єкт-сховище в MediaSelector');
          }
          
          // Створюємо нове сховище
          const store = db.createObjectStore('files', { keyPath: 'id' });
          console.log('✅ Створено об\'єкт-сховище "files" в MediaSelector');
        };
        
        request.onsuccess = (event) => {
          clearTimeout(timeout);
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Перевіряємо, чи існує об'єкт-сховище
          if (!db.objectStoreNames.contains('files')) {
            console.warn('⚠️ Об\'єкт-сховище "files" не існує в MediaSelector');
            db.close();
            resolve();
            return;
          }
          
          try {
            const transaction = db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
              const indexedDBFiles = getAllRequest.result as FileItem[];
              console.log(`📂 MediaSelector: Знайдено ${indexedDBFiles.length} файлів в IndexedDB`);
              
              // Об'єднуємо файли з localStorage та IndexedDB
              const mergedFiles = currentFiles.map(localFile => {
                // Для аудіо файлів
                if (localFile.type === 'audio' && (localFile.isHeavy || !localFile.url || localFile.url.length < 500 * 1024)) {
                  const fullFile = indexedDBFiles.find(dbFile => dbFile.id === localFile.id);
                  if (fullFile && fullFile.url && fullFile.url.length > 1000) {
                    console.log(`✅ MediaSelector: Завантажено аудіо файл з IndexedDB: ${fullFile.name} (${(fullFile.url.length / 1024).toFixed(2)} KB)`);
                    return fullFile;
                  } else {
                    console.warn(`⚠️ MediaSelector: Аудіо файл не знайдено або неповний в IndexedDB: ${localFile.name}`, {
                      foundInDB: !!fullFile,
                      hasUrl: !!fullFile?.url,
                      urlLength: fullFile?.url?.length || 0
                    });
                    return localFile;
                  }
                }
                
                // Для відео файлів
                if (localFile.type === 'video') {
                  // Перевіряємо чи це превью (SVG або мале зображення) замість повного відео
                  const isPreview = localFile.url && (
                    localFile.url.includes('data:image/svg+xml') ||
                    localFile.url.includes('data:image/') ||
                    localFile.url.length < 50000 // Менше 50KB це скоріше превью
                  );
                  
                  if (isPreview) {
                    const fullFile = indexedDBFiles.find(dbFile => dbFile.id === localFile.id);
                    if (fullFile && fullFile.url && fullFile.url.length > localFile.url.length && 
                        fullFile.url.startsWith('data:video/')) {
                      console.log(`✅ MediaSelector: Завантажено повний відео файл з IndexedDB: ${fullFile.name} (${(fullFile.url.length / 1024 / 1024).toFixed(2)} MB)`);
                      return { ...fullFile, fullVideoUrl: fullFile.url };
                    } else {
                      console.warn(`⚠️ MediaSelector: Повний відео файл не знайдено в IndexedDB: ${localFile.name}`, {
                        foundInDB: !!fullFile,
                        hasUrl: !!fullFile?.url,
                        fullUrlLength: fullFile?.url?.length || 0,
                        localUrlLength: localFile.url?.length || 0,
                        isVideoMime: fullFile?.url?.startsWith('data:video/') || false
                      });
                      return localFile;
                    }
                  } else {
                    // Якщо локальний файл вже має повне відео, використовуємо його
                    console.log(`✅ MediaSelector: Локальний відео файл вже повний: ${localFile.name}`);
                    return localFile;
                  }
                }
                
                return localFile;
              });
              
              setFiles(mergedFiles);
              console.log(`✅ MediaSelector: Завантажено повні дані для аудіо файлів з IndexedDB`);
              db.close();
              resolve();
            };
            
            getAllRequest.onerror = () => {
              clearTimeout(timeout);
              console.error('❌ MediaSelector: Помилка отримання файлів з IndexedDB');
              db.close();
              reject(new Error('Помилка отримання файлів з IndexedDB'));
            };
            
            transaction.onerror = () => {
              clearTimeout(timeout);
              console.error('❌ MediaSelector: Помилка транзакції IndexedDB');
              db.close();
              reject(new Error('Помилка транзакції IndexedDB'));
            };
            
            transaction.onabort = () => {
              clearTimeout(timeout);
              console.error('❌ MediaSelector: Транзакція IndexedDB перервана');
              db.close();
              reject(new Error('Транзакція IndexedDB перервана'));
            };
          } catch (transactionError) {
            clearTimeout(timeout);
            console.error('❌ MediaSelector: Помилка створення транзакції:', transactionError);
            db.close();
            reject(new Error(`Помилка створення транзакції: ${transactionError.message}`));
          }
        };
        
        request.onerror = () => {
          clearTimeout(timeout);
          console.error('❌ MediaSelector: Помилка відкриття IndexedDB');
          reject(new Error('Помилка відкриття IndexedDB'));
        };
        
        request.onblocked = () => {
          clearTimeout(timeout);
          console.warn('⚠️ MediaSelector: IndexedDB заблокована');
          reject(new Error('IndexedDB заблокована'));
        };
      } catch (error) {
        clearTimeout(timeout);
        console.error('❌ MediaSelector: Помилка завантаження з IndexedDB:', error);
        reject(error);
      }
    });
  };

  // Функція валідації типу файлу (переміщуємо перед використанням)
  const validateFileType = (file: FileItem): boolean => {
    if (!file.url) return true; // Якщо немає URL, не можемо валідувати
    
    // Перевіряємо data URL
    if (file.url.startsWith('data:')) {
      const mimeType = file.url.split(';')[0].replace('data:', '');
      
      // Спеціальна логіка для відео файлів з превью
      const isVideoExtension = file.originalName && /\.(mp4|mov|avi|webm|mkv|wmv|flv|m4v)$/i.test(file.originalName);
      const isAudioExtension = file.originalName && /\.(mp3|wav|ogg|aac|m4a|flac|wma)$/i.test(file.originalName);
      const isImageExtension = file.originalName && /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(file.originalName);
      
      // Якщо файл має відео розширення та збережено як відео, але MIME-тип зображення - це нормально (превью)
      if (file.type === 'video' && mimeType.startsWith('image/') && isVideoExtension) {
        console.log(`📹 Файл ${file.name} - відео з превью зображення, це нормально`);
        return true; // Це нормально для відео з превью
      }
      
      // Перевіряємо відповідність MIME-типу та збереженого типу
      if (file.type === 'video' && mimeType.startsWith('image/') && !isVideoExtension) {
        console.error(`❌ Файл ${file.name} збережено як відео, але це зображення (${mimeType})`);
        return false;
      }
      
      if (file.type === 'image' && mimeType.startsWith('video/')) {
        console.error(`❌ Файл ${file.name} збережено як зображення, але це відео (${mimeType})`);
        return false;
      }
      
      if (file.type === 'audio' && (mimeType.startsWith('image/') || mimeType.startsWith('video/'))) {
        console.error(`❌ Файл ${file.name} збережено як аудіо, але це ${mimeType.split('/')[0]}`);
        return false;
      }
    }
    
    return true;
  };

  // Фільтрація файлів з валідацією типу
  const filteredFiles = files.filter(file => {
    // Валідація типу файлу на основі URL
    const isValidType = validateFileType(file);
    if (!isValidType) {
      console.warn(`⚠️ MediaSelector: Файл ${file.name} має неправильний тип. Збережено як ${file.type}, але URL вказує на інший тип`);
      return false;
    }
    
    // Фільтр за типом
    if (selectedType !== 'all' && file.type !== selectedType) return false;
    
    // Фільтр за дозволеними типами
    if (!allowedTypes.includes(file.type)) return false;
    
    // Фільтр за пошуковим запитом
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Логування фільтрації файлів
  useEffect(() => {
    if (files.length > 0) {
      console.log(`🔍 Фільтрація файлів:`, {
        totalFiles: files.length,
        selectedType,
        allowedTypes,
        searchQuery,
        filteredCount: filteredFiles.length,
        filteredFiles: filteredFiles.map(f => `${f.name} (${f.type})`)
      });
      
      // Додаткова діагностика для аудіо файлів
      const audioFiles = files.filter(f => f.type === 'audio');
      if (audioFiles.length > 0) {
        console.log(`🎵 Знайдено ${audioFiles.length} аудіо файлів:`, audioFiles.map(f => ({
          name: f.name,
          hasUrl: !!f.url,
          size: f.size,
          isHeavy: f.size > 2 * 1024 * 1024,
          urlLength: f.url?.length || 0
        })));
        
        // ДІАГНОСТИКА: Показуємо всі аудіо файли незалежно від фільтрації
        console.log(`🔍 ДІАГНОСТИКА: Всі аудіо файли в системі:`, audioFiles.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          hasUrl: !!f.url,
          urlLength: f.url?.length || 0,
          size: f.size,
          isHeavy: f.isHeavy,
          passesTypeFilter: selectedType === 'all' || f.type === selectedType,
          passesAllowedTypesFilter: allowedTypes.includes(f.type),
          passesSearchFilter: !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase())
        })));
      }
    }
  }, [files, selectedType, allowedTypes, searchQuery, filteredFiles]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      case 'video': return '🎬';
      default: return '📁';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelect = async (file: FileItem) => {
    console.log(`🔄 MediaSelector: Спроба вибору файлу: ${file.name} (${file.type})`);
    console.log(`📊 MediaSelector: Файл - ID: ${file.id}, hasUrl: ${!!file.url}, urlLength: ${file.url?.length || 0}, isHeavy: ${file.isHeavy}`);
    
    // Для відео файлів завантажуємо повний файл з IndexedDB
    if (file.type === 'video') {
      // Перевіряємо чи це вже повний відео файл
      const isFullVideo = file.url && file.url.startsWith('data:video/') && file.url.length > 100000; // Більше 100KB
      
      if (isFullVideo) {
        console.log(`✅ MediaSelector: Файл вже містить повне відео: ${file.name}`);
        onSelect(file);
        onClose();
        return;
      }
      
      // Якщо це превью, завантажуємо повний файл
      console.log(`🎬 MediaSelector: Відео файл потребує завантаження повного файлу з IndexedDB: ${file.name}`);
      
      setLoadingFileId(file.id); // Показуємо індикатор завантаження
      
      try {
        const fullVideoFile = await loadSingleFileFromIndexedDB(file.id);
        if (fullVideoFile && fullVideoFile.url && 
            fullVideoFile.url.startsWith('data:video/') && 
            fullVideoFile.url.length > (file.url?.length || 0)) {
          console.log(`✅ MediaSelector: Повний відео файл завантажено з IndexedDB: ${fullVideoFile.name}`);
          console.log(`📊 Розмір превью: ${((file.url?.length || 0) / 1024).toFixed(2)} KB`);
          console.log(`📊 Розмір повного файлу: ${(fullVideoFile.url.length / 1024 / 1024).toFixed(2)} MB`);
          
          // Створюємо об'єкт з превью та повним файлом
          const videoFileWithFull: FileItem = {
            ...file,
            url: fullVideoFile.url, // Основний URL - повний файл
            fullVideoUrl: fullVideoFile.url // Додатково для сумісності
          };
          
          onSelect(videoFileWithFull);
          onClose();
          return;
        } else {
          console.warn(`⚠️ MediaSelector: Повний відео файл не знайдено або не валідний:`, {
            hasFullFile: !!fullVideoFile,
            hasUrl: !!fullVideoFile?.url,
            isVideoMime: fullVideoFile?.url?.startsWith('data:video/') || false,
            fullUrlLength: fullVideoFile?.url?.length || 0,
            previewUrlLength: file.url?.length || 0
          });
          
          // Використовуємо превью якщо повний файл недоступний
          onSelect(file);
          onClose();
          return;
        }
      } catch (error) {
        console.error(`❌ MediaSelector: Помилка завантаження повного відео файлу з IndexedDB:`, error);
        // Використовуємо превью у випадку помилки
        onSelect(file);
        onClose();
        return;
      } finally {
        setLoadingFileId(null); // Приховуємо індикатор завантаження
      }
    }
    
    // Якщо файл має URL, вибираємо його відразу
    if (file.url && file.url.length > 100) {
      console.log(`✅ MediaSelector: Файл має повний URL, вибираємо: ${file.name}`);
      onSelect(file);
      onClose();
      return;
    }
    
    // Для аудіо файлів перевіряємо чи потрібно завантажити з IndexedDB
    if (file.type === 'audio' && (file.isHeavy || !file.url || file.url.length < 500 * 1024)) {
      console.log(`🔄 MediaSelector: Аудіо файл потребує завантаження з IndexedDB: ${file.name}`);
      
      setLoadingFileId(file.id); // Показуємо індикатор завантаження
      
      try {
        const fullFile = await loadSingleFileFromIndexedDB(file.id);
        if (fullFile && fullFile.url && fullFile.url.length > 1000) {
          console.log(`✅ MediaSelector: Файл успішно завантажено з IndexedDB: ${fullFile.name}`);
          console.log(`📊 Розмір URL: ${(fullFile.url.length / 1024).toFixed(2)} KB`);
          onSelect(fullFile);
          onClose();
          return;
        } else {
          console.warn(`⚠️ MediaSelector: Файл завантажено, але URL недостатній:`, {
            hasFile: !!fullFile,
            hasUrl: !!fullFile?.url,
            urlLength: fullFile?.url?.length || 0
          });
        }
      } catch (error) {
        console.error(`❌ MediaSelector: Помилка завантаження файлу з IndexedDB:`, error);
      } finally {
        setLoadingFileId(null); // Приховуємо індикатор завантаження
      }
      
      // Якщо не вдалося завантажити
      alert(`❌ Файл "${file.name}" недоступний. Спробуйте перезавантажити файл через Content Manager.`);
      return;
    }
    
    // Для інших типів файлів без URL
    console.warn(`❌ MediaSelector: Файл недоступний:`, {
      name: file.name,
      type: file.type,
      hasUrl: !!file.url,
      urlLength: file.url?.length || 0
    });
    alert(`❌ Файл "${file.name}" недоступний. Спробуйте перезавантажити файл через Content Manager.`);
  };

  // Завантаження одного файлу з IndexedDB
  const loadSingleFileFromIndexedDB = async (fileId: string): Promise<FileItem | null> => {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔄 MediaSelector: Завантаження файлу з IndexedDB: ${fileId}`);
        
        // Таймаут для уникнення зависання
        const timeout = setTimeout(() => {
          console.warn(`⏰ MediaSelector: Таймаут завантаження файлу ${fileId} (5 секунд)`);
          resolve(null);
        }, 5000);
        
        const request = indexedDB.open('ContentManagerDB', 2); // Оновлено до версії 2
        
        request.onupgradeneeded = (event) => {
          console.log('🔧 MediaSelector: Створення/оновлення структури IndexedDB для одного файлу');
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Видаляємо старе сховище якщо воно існує
          if (db.objectStoreNames.contains('files')) {
            db.deleteObjectStore('files');
            console.log('🗑️ MediaSelector: Видалено старе об\'єкт-сховище для файлу');
          }
          
          // Створюємо нове сховище
          const store = db.createObjectStore('files', { keyPath: 'id' });
          console.log('✅ MediaSelector: Створено об\'єкт-сховище "files" для файлу');
        };
        
        request.onsuccess = (event) => {
          clearTimeout(timeout);
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Перевіряємо, чи існує об'єкт-сховище
          if (!db.objectStoreNames.contains('files')) {
            console.warn(`⚠️ MediaSelector: Об\'єкт-сховище "files" не існує для файлу ${fileId}`);
            db.close();
            resolve(null);
            return;
          }
          
          try {
            const transaction = db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const getRequest = store.get(fileId);
            
            getRequest.onsuccess = () => {
              const file = getRequest.result;
              if (file && file.url && file.id && file.name) {
                console.log(`📂 MediaSelector: Знайдено файл в IndexedDB: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                db.close();
                resolve(file);
              } else if (file) {
                console.warn(`⚠️ MediaSelector: Файл знайдено, але він пошкоджений: ${fileId}`, file);
                db.close();
                resolve(null);
              } else {
                console.warn(`⚠️ MediaSelector: Файл не знайдено або без URL в IndexedDB: ${fileId}`);
                db.close();
                resolve(null);
              }
            };
            
            getRequest.onerror = () => {
              console.error(`❌ MediaSelector: Помилка отримання файлу ${fileId} з IndexedDB`, getRequest.error);
              db.close();
              resolve(null);
            };
            
            transaction.onerror = () => {
              console.error(`❌ MediaSelector: Помилка транзакції при отриманні файлу ${fileId} з IndexedDB`, transaction.error);
              db.close();
              resolve(null);
            };
            
            transaction.onabort = () => {
              console.error(`❌ MediaSelector: Транзакція завантаження файлу ${fileId} перервана`);
              db.close();
              resolve(null);
            };
          } catch (transactionError) {
            console.error(`❌ MediaSelector: Помилка створення транзакції для файлу ${fileId}:`, transactionError);
            db.close();
            resolve(null);
          }
        };
        
        request.onerror = () => {
          clearTimeout(timeout);
          console.error(`❌ MediaSelector: Помилка відкриття IndexedDB для файлу ${fileId}`, request.error);
          resolve(null);
        };
        
        request.onblocked = () => {
          clearTimeout(timeout);
          console.warn(`⚠️ MediaSelector: IndexedDB заблокована при завантаженні файлу ${fileId}`);
          resolve(null);
        };
      } catch (error) {
        console.error(`❌ MediaSelector: Помилка завантаження файлу ${fileId} з IndexedDB:`, error);
        resolve(null);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-blue-100 mt-1">{description}</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* Фільтри та пошук */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Пошук */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Пошук файлів..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Фільтри за типом */}
              <div className="flex gap-2">
                {['all', ...allowedTypes].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedType === type
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? '🗂️ Всі' : 
                     type === 'image' ? '🖼️ Зображення' :
                     type === 'audio' ? '🎵 Аудіо' : '🎬 Відео'}
                  </button>
                ))}
                
                {/* Кнопка виправлення файлів */}
                <button
                  onClick={async () => {
                    console.log('🔧 Ручне виправлення файлів...');
                    setIsLoading(true);
                    try {
                      const correctedFiles = await fixIncorrectFileTypes(files);
                      setFiles(correctedFiles);
                      console.log('✅ Ручне виправлення завершено');
                    } catch (error) {
                      console.error('❌ Помилка ручного виправлення:', error);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all duration-200 whitespace-nowrap font-medium shadow-md hover:shadow-lg"
                  title="Виправити неправильно збережені файли"
                >
                  🔧 Виправити
                </button>
              </div>
            </div>

            {/* Статистика */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <span className="text-slate-600">Знайдено: <span className="font-medium text-slate-800">{filteredFiles.length}</span></span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">Всього: <span className="font-medium text-slate-800">{files.length}</span></span>
              
              {/* Статистика проблемних файлів */}
              {(() => {
                const problematicFiles = files.filter(file => {
                  if (!file.url || !file.url.startsWith('data:')) return false;
                  const mimeType = file.url.split(';')[0].replace('data:', '');
                  const isVideoExtension = file.originalName && /\.(mp4|mov|avi|webm|mkv|wmv|flv|m4v)$/i.test(file.originalName);
                  
                  // Файли з неправильним типом
                  if (file.type === 'video' && mimeType.startsWith('image/') && !isVideoExtension) return true;
                  if (file.type === 'image' && mimeType.startsWith('video/')) return true;
                  if (file.type === 'audio' && (mimeType.startsWith('image/') || mimeType.startsWith('video/'))) return true;
                  
                  // SVG placeholder замість відео
                  if (file.type === 'video' && file.url.includes('data:image/svg+xml') && file.url.includes('🎬')) return true;
                  
                  return false;
                });
                
                if (problematicFiles.length > 0) {
                  return (
                    <>
                      <span className="text-slate-400">•</span>
                      <span className="text-orange-600">
                        ⚠️ {problematicFiles.length} потребують виправлення
                      </span>
                    </>
                  );
                }
                return null;
              })()}
              
              {/* Статистика по типах файлів */}
              {files.length > 0 && (
                <>
                  <span className="text-slate-400">•</span>
                  {allowedTypes.map(type => {
                    const count = files.filter(f => f.type === type).length;
                    if (count === 0) return null;
                    return (
                      <span key={type} className="text-slate-600">
                        {type === 'image' ? '🖼️' : type === 'audio' ? '🎵' : '🎬'} {count}
                      </span>
                    );
                  })}
                </>
              )}
              
              {/* Спеціальна інформація для аудіо файлів */}
              {allowedTypes.includes('audio') && files.filter(f => f.type === 'audio').length > 0 && (
                <>
                  <span className="text-slate-400">•</span>
                  <span className="text-blue-600">
                    💾 {files.filter(f => f.type === 'audio' && !f.url && f.size > 2 * 1024 * 1024).length} в розширеному сховищі
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Список файлів */}
          <div className="p-6 overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <div className="text-lg font-medium text-slate-600">
                  Завантаження файлів...
                </div>
                <div className="text-sm text-slate-500 mt-2">
                  Завантажуємо аудіо файли з розширеного сховища
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <div className="text-xl font-medium text-slate-600 mb-2">
                  {files.length === 0 ? 'Медіа-бібліотека порожня' : 'Файлів не знайдено'}
                </div>
                <div className="text-slate-500 mb-4">
                  {files.length === 0 
                    ? 'Завантажте файли через Smart Content Manager' 
                    : 'Спробуйте змінити фільтри або пошуковий запит'
                  }
                </div>
                {files.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                    <div className="text-sm text-blue-700">
                      <div className="font-medium mb-2">📚 Як додати файли:</div>
                      <ol className="text-left space-y-1">
                        <li>1. Перейдіть в Smart Content Manager</li>
                        <li>2. Завантажте аудіо файли</li>
                        <li>3. Поверніться сюди та оберіть файл</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group ${
                      file.type === 'audio' && !file.url ? 'opacity-50' : ''
                    } ${loadingFileId === file.id ? 'pointer-events-none' : ''}`}
                    onClick={() => handleSelect(file)}
                  >
                    {/* Превью файлу */}
                    <div className="aspect-square bg-white rounded-lg mb-3 overflow-hidden relative">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">{getFileIcon(file.type)}</span>
                          {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && loadingFileId !== file.id && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Розширене сховище
                            </div>
                          )}
                          {loadingFileId === file.id && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-white/90 px-3 py-2 rounded-lg font-medium text-blue-600">
                                ⏳ Завантаження...
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Оверлей при ховері */}
                      {loadingFileId !== file.id && (
                        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="bg-white/90 px-3 py-2 rounded-lg font-medium text-blue-600">
                            {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 ? 'Завантажити' : 'Вибрати'}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Інформація про файл */}
                    <div className="space-y-2">
                      <div className="font-medium text-slate-800 truncate" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-sm text-slate-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <span>{getFileIcon(file.type)}</span>
                          <span className="capitalize">{file.type}</span>
                          {file.optimized && <span className="text-green-500" title="Оптимізовано">✨</span>}
                          {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && (
                            <span className="text-blue-500" title="Збережено в розширеному сховищі">💾</span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                        {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Розширене сховище
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Футер */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-600">
                Файли зберігаються в вашій медіа-бібліотеці
              </div>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-medium"
              >
                Скасувати
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaSelector; 