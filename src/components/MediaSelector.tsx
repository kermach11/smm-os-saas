import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileItem } from '../types/contentManager';
import indexedDBService from '../services/IndexedDBService';
import { useTranslation } from '../hooks/useTranslation';

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
  title,
  description
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFileId, setLoadingFileId] = useState<string | null>(null);
  
  // Використовуємо переклади якщо не передані пропси
  const modalTitle = title || t('media.selector.title');
  const modalDescription = description || t('media.selector.description');

  // Завантаження файлів з localStorage
  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      
      // Спочатку пробуємо завантажити з IndexedDB через новий сервіс
      const indexedDBFiles = await indexedDBService.loadFiles();
      
      if (indexedDBFiles.length > 0) {
        console.log(`📂 MediaSelector: Завантажено ${indexedDBFiles.length} файлів з IndexedDB`);
        
        // Автоматично виправляємо неправильно збережені файли
        const correctedFiles = await fixIncorrectFileTypes(indexedDBFiles);
        setFiles(correctedFiles);
      } else {
        // Якщо IndexedDB порожній, пробуємо localStorage як резерв
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
    
    // ✅ SUPABASE STORAGE: Дозволяємо всі HTTPS URLs з Supabase
    if (file.url.startsWith('https://') && file.url.includes('supabase.co')) {
      console.log(`✅ Supabase Storage файл: ${file.name} - пропускаємо валідацію`);
      return true;
    }
    
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
        // Спробуємо завантажити повний файл з IndexedDB
        const fullVideoFile = await loadSingleFileFromIndexedDB(file.id);
        
        if (fullVideoFile && fullVideoFile.url) {
          // Перевіряємо чи це справжній відео файл
          const isValidVideoUrl = fullVideoFile.url.startsWith('data:video/') && fullVideoFile.url.length > (file.url?.length || 0);
          
          if (isValidVideoUrl) {
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
          }
        }
        
        // Показуємо повідомлення користувачу
        console.warn(`⚠️ MediaSelector: Повний відео файл не знайдено в IndexedDB для ${file.name}`);
        
        // Спробуємо використати превью якщо воно достатньо велике
        if (file.url && file.url.length > 50000) { // Якщо превью більше 50KB
          console.log(`📹 MediaSelector: Використовуємо превью як відео (${(file.url.length / 1024).toFixed(2)} KB): ${file.name}`);
          onSelect(file);
          onClose();
          return;
        }
        
        // Тільки якщо файл дуже малий, показуємо попередження
        const userChoice = confirm(`❌ Відео файл "${file.name}" не доступний для відтворення.\n\n` +
          `Це може статися якщо файл не був повністю завантажений або IndexedDB було очищено.\n\n` +
          `Натисніть OK, щоб спробувати використати превью (може не працювати як відео),\n` +
          `або Cancel, щоб перезавантажити файл через Content Manager.`);
        
        if (userChoice) {
          // Користувач хоче спробувати превью
          console.log(`⚠️ MediaSelector: Використовуємо превью як відео (може не працювати)`);
          onSelect(file);
          onClose();
          return;
        } else {
          // Користувач хоче перезавантажити файл
          console.log(`💡 MediaSelector: Користувач обрав перезавантаження файлу "${file.name}"`);
          return;
        }
        
      } catch (error) {
        console.error(`❌ MediaSelector: Помилка завантаження повного відео файлу з IndexedDB:`, error);
        
        // Показуємо повідомлення про помилку
        alert(`❌ Помилка завантаження відео файлу "${file.name}".\n\n` +
          `Причина: ${error.message || 'Невідома помилка'}\n\n` +
          `Спробуйте перезавантажити файл через Content Manager.`);
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
    return new Promise((resolve) => {
      try {
        console.log(`🔄 MediaSelector: Завантаження файлу з IndexedDB: ${fileId}`);
        
        // Таймаут для уникнення зависання
        const timeout = setTimeout(() => {
          console.warn(`⏰ MediaSelector: Таймаут завантаження файлу ${fileId} (10 секунд)`);
          resolve(null);
        }, 10000);
        
        // Спробуємо різні версії бази даних
        const tryOpenDB = (version: number) => {
          const request = indexedDB.open('ContentManagerDB', version);
          
          request.onupgradeneeded = (event) => {
            console.log(`🔧 MediaSelector: Оновлення IndexedDB до версії ${version}`);
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Створюємо сховище якщо воно не існує
            if (!db.objectStoreNames.contains('files')) {
              db.createObjectStore('files', { keyPath: 'id' });
              console.log('✅ MediaSelector: Створено об\'єкт-сховище "files"');
            }
          };
          
          request.onsuccess = (event) => {
            clearTimeout(timeout);
            const db = (event.target as IDBOpenDBRequest).result;
            
            // Перевіряємо, чи існує об'єкт-сховище
            if (!db.objectStoreNames.contains('files')) {
              console.warn(`⚠️ MediaSelector: Об\'єкт-сховище "files" не існує у версії ${version}`);
              db.close();
              
              // Спробуємо іншу версію
              if (version === 2) {
                tryOpenDB(1);
              } else {
                resolve(null);
              }
              return;
            }
            
            try {
              const transaction = db.transaction(['files'], 'readonly');
              const store = transaction.objectStore('files');
              const getRequest = store.get(fileId);
              
              getRequest.onsuccess = () => {
                const file = getRequest.result;
                if (file && file.url && file.id && file.name) {
                  console.log(`📂 MediaSelector: Файл знайдено в IndexedDB v${version}: ${file.name}`);
                  console.log(`📊 Тип файлу: ${file.type}, URL довжина: ${(file.url.length / 1024).toFixed(2)} KB`);
                  
                  // Додаткова перевірка для відео файлів
                  if (file.type === 'video' && !file.url.startsWith('data:video/')) {
                    console.warn(`⚠️ MediaSelector: Відео файл має неправильний MIME-тип: ${file.url.substring(0, 50)}...`);
                  }
                  
                  db.close();
                  resolve(file);
                } else if (file) {
                  console.warn(`⚠️ MediaSelector: Файл знайдено, але він пошкоджений: ${fileId}`, file);
                  db.close();
                  resolve(null);
                } else {
                  console.warn(`⚠️ MediaSelector: Файл не знайдено в IndexedDB v${version}: ${fileId}`);
                  db.close();
                  
                  // Спробуємо іншу версію
                  if (version === 2) {
                    tryOpenDB(1);
                  } else {
                    resolve(null);
                  }
                }
              };
              
              getRequest.onerror = () => {
                console.error(`❌ MediaSelector: Помилка отримання файлу ${fileId} з IndexedDB v${version}`, getRequest.error);
                db.close();
                resolve(null);
              };
              
              transaction.onerror = () => {
                console.error(`❌ MediaSelector: Помилка транзакції при отриманні файлу ${fileId} з IndexedDB v${version}`, transaction.error);
                db.close();
                resolve(null);
              };
              
              transaction.onabort = () => {
                console.error(`❌ MediaSelector: Транзакція завантаження файлу ${fileId} перервана в версії ${version}`);
                db.close();
                resolve(null);
              };
            } catch (transactionError) {
              console.error(`❌ MediaSelector: Помилка створення транзакції для файлу ${fileId} v${version}:`, transactionError);
              db.close();
              resolve(null);
            }
          };
          
          request.onerror = () => {
            console.error(`❌ MediaSelector: Помилка відкриття IndexedDB v${version} для файлу ${fileId}`, request.error);
            clearTimeout(timeout);
            resolve(null);
          };
          
          request.onblocked = () => {
            console.warn(`⚠️ MediaSelector: IndexedDB v${version} заблоковано для файлу ${fileId}`);
            clearTimeout(timeout);
            resolve(null);
          };
        };
        
        // Починаємо з версії 2
        tryOpenDB(2);
        
      } catch (error) {
        console.error(`❌ MediaSelector: Критична помилка завантаження файлу ${fileId}:`, error);
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-1 lg:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg lg:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] lg:max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 📚 Заголовок - MOBILE OPTIMIZED */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 lg:p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg lg:text-2xl font-bold truncate">{modalTitle}</h2>
                <p className="text-blue-100 mt-1 text-xs lg:text-base hidden lg:block">{modalDescription}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 hover:bg-white/30 rounded-lg lg:rounded-xl flex items-center justify-center transition-colors touch-manipulation ml-2"
              >
                <span className="text-lg lg:text-xl">✕</span>
              </button>
            </div>
          </div>

          {/* 🔍 Фільтри та пошук - MOBILE OPTIMIZED */}
          <div className="p-2 lg:p-6 border-b border-slate-200">
            <div className="flex flex-col gap-2 lg:gap-4">
              {/* Пошук */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t('media.selector.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 lg:px-4 lg:py-3 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs lg:text-base min-h-[36px] touch-manipulation"
                />
              </div>

              {/* Фільтри за типом - MOBILE GRID */}
              <div className="grid grid-cols-2 lg:flex gap-1 lg:gap-2">
                {['all', ...allowedTypes].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type as any)}
                    className={`px-2 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-200 whitespace-nowrap text-xs lg:text-sm min-h-[36px] touch-manipulation ${
                      selectedType === type
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type === 'all' ? `🗂️ ${t('media.selector.filter.all')}` : 
                     type === 'image' ? `🖼️ ${t('media.selector.filter.images')}` :
                     type === 'audio' ? `🎵 ${t('media.selector.filter.audio')}` : `🎬 ${t('media.selector.filter.video')}`}
                  </button>
                ))}
              </div>
              
              {/* Кнопка виправлення файлів - MOBILE OPTIMIZED */}
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
                className="px-2 lg:px-4 py-2 lg:py-3 bg-orange-500 text-white rounded-lg lg:rounded-xl hover:bg-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-xs lg:text-base min-h-[36px] touch-manipulation"
                title={t('media.selector.fix.tooltip')}
              >
                🔧 <span className="hidden lg:inline">{t('media.selector.fix.button')}</span>
                <span className="lg:hidden">Виправити</span>
              </button>
            </div>

            {/* 📊 Статистика - MOBILE COMPACT */}
            <div className="mt-2 lg:mt-4">
              {/* Основна статистика - завжди видима */}
              <div className="flex items-center gap-1 lg:gap-4 text-xs lg:text-sm">
                <span className="text-slate-600">{t('media.selector.stats.found')} <span className="font-medium text-slate-800">{filteredFiles.length}</span></span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600">{t('media.selector.stats.total')} <span className="font-medium text-slate-800">{files.length}</span></span>
                
                {/* Статистика проблемних файлів - мобільно компактна */}
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
                          ⚠️ {problematicFiles.length} <span className="hidden lg:inline">{t('media.selector.stats.need.fix')}</span>
                        </span>
                      </>
                    );
                  }
                  return null;
                })()}
              </div>
              
              {/* Детальна статистика - тільки на десктопі */}
              <div className="hidden lg:flex flex-wrap gap-4 mt-2 text-sm">
                {/* Статистика по типах файлів */}
                {files.length > 0 && (
                  <>
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
                      💾 {files.filter(f => f.type === 'audio' && !f.url && f.size > 2 * 1024 * 1024).length} {t('media.selector.stats.extended.storage')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 📁 Список файлів - MOBILE OPTIMIZED */}
          <div className="p-2 lg:p-6 overflow-y-auto max-h-[50vh] lg:max-h-96">
            {isLoading ? (
              <div className="text-center py-8 lg:py-12">
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-4">⏳</div>
                <div className="text-sm lg:text-lg font-medium text-slate-600">
                  {t('media.selector.loading')}
                </div>
                <div className="text-xs lg:text-sm text-slate-500 mt-1 lg:mt-2">
                  {t('media.selector.loading.extended')}
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-8 lg:py-12">
                <div className="text-4xl lg:text-6xl mb-2 lg:mb-4">📭</div>
                <div className="text-base lg:text-xl font-medium text-slate-600 mb-2">
                  {files.length === 0 ? t('media.selector.empty.title') : t('media.selector.not.found.title')}
                </div>
                <div className="text-sm lg:text-base text-slate-500 mb-4">
                  {files.length === 0 
                    ? t('media.selector.empty.description') 
                    : t('media.selector.not.found.description')
                  }
                </div>
                {files.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg lg:rounded-xl p-3 lg:p-4 max-w-md mx-auto">
                    <div className="text-xs lg:text-sm text-blue-700">
                      <div className="font-medium mb-2">📚 {t('media.selector.how.to.add')}</div>
                      <ol className="text-left space-y-1 text-xs lg:text-sm">
                        <li>{t('media.selector.how.to.add.step1')}</li>
                        <li>{t('media.selector.how.to.add.step2')}</li>
                        <li>{t('media.selector.how.to.add.step3')}</li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-slate-50 rounded-lg lg:rounded-xl p-2 lg:p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group touch-manipulation ${
                      file.type === 'audio' && !file.url ? 'opacity-50' : ''
                    } ${loadingFileId === file.id ? 'pointer-events-none' : ''}`}
                    onClick={() => handleSelect(file)}
                  >
                    {/* 🖼️ Превью файлу - MOBILE OPTIMIZED */}
                    <div className="aspect-square bg-white rounded-md lg:rounded-lg mb-2 lg:mb-3 overflow-hidden relative">
                      {file.type === 'image' ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl lg:text-4xl">{getFileIcon(file.type)}</span>
                          {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && loadingFileId !== file.id && (
                            <div className="absolute top-1 right-1 lg:top-2 lg:right-2 bg-blue-500 text-white text-xs px-1 py-0.5 lg:px-2 lg:py-1 rounded">
                              <span className="hidden lg:inline">{t('media.selector.extended.storage')}</span>
                              <span className="lg:hidden">💾</span>
                            </div>
                          )}
                          {loadingFileId === file.id && (
                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                              <div className="bg-white/90 px-2 py-1 lg:px-3 lg:py-2 rounded-md lg:rounded-lg font-medium text-blue-600 text-xs lg:text-sm">
                                ⏳ <span className="hidden lg:inline">{t('media.selector.loading.file')}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Оверлей при ховері - MOBILE OPTIMIZED */}
                      {loadingFileId !== file.id && (
                        <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="bg-white/90 px-2 py-1 lg:px-3 lg:py-2 rounded-md lg:rounded-lg font-medium text-blue-600 text-xs lg:text-sm">
                            <span className="hidden lg:inline">
                              {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 ? t('media.selector.download.file') : t('media.selector.select.file')}
                            </span>
                            <span className="lg:hidden">Вибрати</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ℹ️ Інформація про файл - MOBILE COMPACT */}
                    <div className="space-y-1 lg:space-y-2">
                      <div className="font-medium text-slate-800 truncate text-xs lg:text-base" title={file.name}>
                        {file.name}
                      </div>
                      <div className="text-xs lg:text-sm text-slate-500 space-y-1">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <span className="text-xs lg:text-base">{getFileIcon(file.type)}</span>
                          <span className="capitalize">{file.type}</span>
                          {file.optimized && <span className="text-green-500" title={t('media.selector.optimized')}>✨</span>}
                          {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && (
                            <span className="text-blue-500" title={t('media.selector.extended.storage')}>💾</span>
                          )}
                        </div>
                        <div className="flex justify-between text-xs lg:text-sm">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="hidden lg:inline">{new Date(file.uploadDate).toLocaleDateString()}</span>
                          <span className="lg:hidden">{new Date(file.uploadDate).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}</span>
                        </div>
                        {file.type === 'audio' && !file.url && file.size > 2 * 1024 * 1024 && (
                          <div className="text-xs text-blue-600 bg-blue-50 px-1 lg:px-2 py-0.5 lg:py-1 rounded hidden lg:block">
                            {t('media.selector.extended.storage')}
                          </div>
                        )}
                      </div>
                      
                      {/* 📱 Мобільна кнопка вибору - ТІЛЬКИ НА МОБІЛЬНОМУ */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(file);
                        }}
                        className="lg:hidden w-full mt-2 px-2 py-1.5 bg-blue-500 text-white rounded-md text-xs font-medium touch-manipulation"
                        disabled={loadingFileId === file.id}
                      >
                        {loadingFileId === file.id ? '⏳' : 'Вибрати'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* 🔽 Футер - MOBILE COMPACT */}
          <div className="p-2 lg:p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-xs lg:text-sm text-slate-600 hidden lg:block">
                {t('media.selector.footer.info')}
              </div>
              <div className="text-xs lg:text-sm text-slate-600 lg:hidden">
                📚 Файли зберігаються в вашій медіа-бібліотеці
              </div>
              <button
                onClick={onClose}
                className="px-3 py-2 lg:px-6 lg:py-3 bg-slate-200 text-slate-700 rounded-lg lg:rounded-xl hover:bg-slate-300 transition-colors font-medium text-xs lg:text-base min-h-[36px] touch-manipulation"
              >
                {t('media.selector.cancel')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaSelector; 