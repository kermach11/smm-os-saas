import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';
import { FileItem, ContentManagerProps } from '../types/contentManager';
import indexedDBService from '../services/IndexedDBService';
import SupabaseUploader from './SupabaseUploader';
import { UploadedFile } from '../services/SupabaseStorageService';

const ContentManager: React.FC<ContentManagerProps> = ({
  className = '',
  onFileSelect,
  maxFileSize = 10 * 1024 * 1024, // 10MB за замовчуванням
  allowedTypes = ['image', 'audio', 'video']
}) => {
  const { t } = useTranslation();
  // Стани
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'cloud'>('gallery');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'audio' | 'video'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertingFileName, setConvertingFileName] = useState<string>('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Обробник завантажених файлів з Supabase
  const handleSupabaseUpload = async (uploadedFiles: UploadedFile[]) => {
    console.log('🌐 ContentManager: Отримано файли з Supabase Storage:', uploadedFiles);
    
    try {
      // Конвертуємо SupabaseUploadedFile в FileItem формат (фільтруємо тільки підтримувані типи)
      const newFiles: FileItem[] = uploadedFiles
        .filter(file => ['image', 'audio', 'video'].includes(file.type)) // Фільтруємо тільки підтримувані типи
        .map(file => ({
          id: file.id,
          name: file.name,
          type: file.type as 'image' | 'audio' | 'video', // Кастимо до правильного типу
          size: file.size,
          url: file.publicUrl, // Використовуємо публічний URL з Supabase
          optimized: false,
          uploadDate: file.uploadDate,
          originalName: file.originalName,
          isSupabaseFile: true, // Позначаємо як файл з Supabase
          supabaseData: {
            bucket: file.bucket,
            path: file.path,
            publicUrl: file.publicUrl
          }
        }));

      // Додаємо файли до локального списку та IndexedDB для кешування
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Зберігаємо в IndexedDB для кешування (тільки метадані, не контент)
      await saveFilesToStorage(updatedFiles);
      
      console.log(`✅ ContentManager: Додано ${newFiles.length} файлів з Supabase Storage`);
      
      // Переключаємось на галерею, щоб показати завантажені файли
      setActiveTab('gallery');
      
    } catch (error) {
      console.error('❌ ContentManager: Помилка обробки файлів з Supabase:', error);
    }
  };

  // Ініціалізація файлів при завантаженні компонента
  useEffect(() => {
    const initializeFiles = async () => {
      try {
        console.log('🔄 ContentManager: Ініціалізація через IndexedDBService...');
        
        // Спочатку пробуємо завантажити з IndexedDB
        const indexedDBFiles = await indexedDBService.loadFiles();
        
        if (indexedDBFiles.length > 0) {
          console.log(`📂 ContentManager: Завантажено ${indexedDBFiles.length} файлів з IndexedDB`);
          setFiles(indexedDBFiles);
        } else {
          // Якщо в IndexedDB немає файлів, перевіряємо localStorage
          await loadFilesFromLocalStorage();
        }
      } catch (error) {
        console.error('❌ ContentManager: Помилка ініціалізації:', error);
        // Резервний варіант - завантажуємо з localStorage
        await loadFilesFromLocalStorage();
      }
    };

    initializeFiles();
  }, []);

  // Резервне завантаження з localStorage (для міграції)
  const loadFilesFromLocalStorage = async () => {
    try {
      const savedFiles = localStorage.getItem('smartContentManager_v2');
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        console.log(`📂 ContentManager: Завантажено ${parsedFiles.length} файлів з localStorage`);
        
        // Мігруємо файли в IndexedDB
        console.log('🔄 ContentManager: Міграція файлів в IndexedDB...');
        await indexedDBService.saveFiles(parsedFiles);
        
        setFiles(parsedFiles);
        console.log('✅ ContentManager: Міграція завершена');
      } else {
        console.log('📂 ContentManager: Немає збережених файлів');
        setFiles([]);
      }
    } catch (error) {
      console.error('❌ ContentManager: Помилка завантаження з localStorage:', error);
      setFiles([]);
    }
  };

  // Очищення таймерів при розмонтуванні
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  // Збереження файлів - тепер тільки через IndexedDB
  const saveFilesToStorage = async (newFiles: FileItem[]) => {
    try {
      console.log(`💾 ContentManager: Збереження ${newFiles.length} файлів через IndexedDBService...`);
      
      // Зберігаємо файли в IndexedDB
      await indexedDBService.saveFiles(newFiles);
      
      // Зберігаємо тільки мінімальні метадані в localStorage для швидкого доступу
      const minimalFiles = newFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        url: '', // Порожній URL - повні файли в IndexedDB
        originalName: file.originalName,
        size: file.size,
        uploadDate: file.uploadDate,
        optimized: file.optimized,
        isHeavy: true // Всі файли тепер в IndexedDB
      }));
      
      localStorage.setItem('smartContentManager_v2', JSON.stringify(minimalFiles));
      console.log('✅ ContentManager: Файли збережено успішно');
      
    } catch (error) {
      console.error('❌ ContentManager: Помилка збереження файлів:', error);
      
      // У випадку помилки IndexedDB, зберігаємо в localStorage
      try {
        console.log('🔄 ContentManager: Резервне збереження в localStorage...');
        const dataToSave = JSON.stringify(newFiles);
        localStorage.setItem('smartContentManager_v2', dataToSave);
        console.log('✅ ContentManager: Резервне збереження успішне');
      } catch (localStorageError) {
        console.error('❌ ContentManager: Помилка резервного збереження:', localStorageError);
        alert('❌ Помилка збереження файлів. Спробуйте очистити кеш браузера.');
        throw localStorageError;
      }
    }
  };

  // Універсальна оптимізація файлів
  const optimizeFile = async (file: File): Promise<{ optimizedFile: File; dataUrl: string; fullVideoUrl?: string }> => {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        // Оптимізація зображень
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            // Розраховуємо нові розміри (максимум 800x600 для економії місця)
            const maxWidth = 800;
            const maxHeight = 600;
            let { width, height } = img;
            
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width *= ratio;
              height *= ratio;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Малюємо оптимізоване зображення
            ctx?.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const optimizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                
                // Конвертуємо в Data URL
                const reader = new FileReader();
                reader.onload = (e) => {
                  const dataUrl = e.target?.result as string;
                  console.log(`✅ Зображення оптимізовано: ${file.name} (${formatFileSize(file.size)} → ${formatFileSize(optimizedFile.size)})`);
                  resolve({
                    optimizedFile,
                    dataUrl
                  });
                };
                reader.onerror = () => reject(new Error('Помилка конвертації зображення'));
                reader.readAsDataURL(optimizedFile);
              } else {
                reject(new Error('Помилка оптимізації зображення'));
              }
            }, 'image/jpeg', 0.6); // Знижуємо якість до 60% для економії місця
          } catch (error) {
            reject(new Error(`Помилка обробки зображення: ${error.message}`));
          }
        };
        
        img.onerror = () => reject(new Error('Помилка завантаження зображення'));
        
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Помилка читання файлу'));
        reader.readAsDataURL(file);
        
      } else if (file.type.startsWith('audio/')) {
        // Для аудіо файлів ЗАВЖДИ зберігаємо повний файл з правильним MIME-типом
        console.log(`🎵 Обробка аудіо файлу: ${file.name} (${file.type})`);
        
        try {
          console.log(`✅ Аудіо файл: ${file.name} (${formatFileSize(file.size)}), зберігаємо повністю`);
          
          // Для всіх аудіо файлів зберігаємо повністю з правильним MIME-типом
          const reader = new FileReader();
          
          reader.onload = (e) => {
            let dataUrl = e.target?.result as string;
            
            // Виправляємо MIME-тип якщо потрібно
            if (dataUrl.startsWith('data:application/octet-stream')) {
              console.log('🔧 Виправляємо MIME-тип аудіо файлу');
              const mimeType = file.type || 'audio/mpeg'; // Використовуємо оригінальний тип або MP3 за замовчуванням
              dataUrl = dataUrl.replace('data:application/octet-stream', `data:${mimeType}`);
            }
            
            // Додаємо підтримку UTF-8 для українських символів
            if (!dataUrl.includes('charset=utf-8') && file.name.match(/[а-яё]/i)) {
              console.log('🔧 Додаємо UTF-8 підтримку для українських символів');
              const parts = dataUrl.split(',');
              if (parts.length === 2) {
                const mimeWithCharset = parts[0].replace(';base64', ';charset=utf-8;base64');
                dataUrl = mimeWithCharset + ',' + parts[1];
              }
            }
            
            console.log(`✅ Аудіо файл оброблено: ${file.name} (MIME: ${file.type})`);
            console.log(`📊 Розмір даних: ${(dataUrl.length / 1024).toFixed(2)} KB`);
            resolve({
              optimizedFile: file,
              dataUrl
            });
          };
          reader.onerror = () => reject(new Error('Помилка обробки аудіо файлу'));
          reader.readAsDataURL(file);
          
        } catch (error) {
          reject(new Error(`Помилка обробки аудіо: ${error.message}`));
        }
        
      } else if (file.type.startsWith('video/')) {
        // АВТОМАТИЧНА КОНВЕРТАЦІЯ ВІДЕО ДЛЯ БРАУЗЕРНОЇ СУМІСНОСТІ
        console.log(`🎬 Обробка відео файлу: ${file.name} (${file.type})`);
        
                 // Функція для конвертації відео в підтримуваний формат
         const convertVideoToBrowserCompatible = async (videoFile: File): Promise<{ success: boolean; convertedDataUrl?: string; error?: string }> => {
           return new Promise((resolve) => {
             console.log(`🔄 Початок конвертації відео: ${videoFile.name}`);
             
             // Показуємо індикатор конвертації
             setIsConverting(true);
             setConvertingFileName(videoFile.name);
             
             // Перевіряємо чи потрібна конвертація
            const needsConversion = videoFile.type.includes('quicktime') || 
                                  videoFile.type.includes('mov') || 
                                  videoFile.type.includes('avi') ||
                                  videoFile.type.includes('wmv') ||
                                  !videoFile.type.includes('mp4') && !videoFile.type.includes('webm');
            
                         if (!needsConversion && (videoFile.type.includes('mp4') || videoFile.type.includes('webm'))) {
               console.log(`✅ Відео вже в підтримуваному форматі: ${videoFile.type}`);
               setIsConverting(false);
               setConvertingFileName('');
               resolve({ success: false }); // Не потрібна конвертація
               return;
             }
            
            try {
              const video = document.createElement('video');
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
                             if (!ctx) {
                 setIsConverting(false);
                 setConvertingFileName('');
                 resolve({ success: false, error: 'Не вдалося створити контекст canvas' });
                 return;
               }
              
              // Створюємо URL для оригінального відео
              const videoUrl = URL.createObjectURL(videoFile);
              video.src = videoUrl;
              video.crossOrigin = 'anonymous';
              video.muted = true;
              
              video.onloadedmetadata = () => {
                console.log(`📹 Метадані завантажено для конвертації: ${videoFile.name}`, {
                  duration: video.duration,
                  width: video.videoWidth,
                  height: video.videoHeight
                });
                
                // Налаштовуємо canvas з оптимальним розміром
                const maxWidth = 1920; // Full HD максимум
                const maxHeight = 1080;
                let { videoWidth: width, videoHeight: height } = video;
                
                if (width > maxWidth || height > maxHeight) {
                  const ratio = Math.min(maxWidth / width, maxHeight / height);
                  width = Math.round(width * ratio);
                  height = Math.round(height * ratio);
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Перевіряємо підтримку MediaRecorder для WebM
                const supportedTypes = [
                  'video/webm; codecs="vp9,opus"',
                  'video/webm; codecs="vp8,opus"', 
                  'video/webm',
                  'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
                  'video/mp4'
                ];
                
                let selectedMimeType = '';
                for (const type of supportedTypes) {
                  if (MediaRecorder.isTypeSupported(type)) {
                    selectedMimeType = type;
                    console.log(`✅ Використовуємо MIME-тип для конвертації: ${type}`);
                    break;
                  }
                }
                
                                 if (!selectedMimeType) {
                   console.warn('⚠️ MediaRecorder не підтримує жоден з бажаних форматів');
                   setIsConverting(false);
                   setConvertingFileName('');
                   resolve({ success: false, error: 'MediaRecorder не підтримується' });
                   return;
                 }
                
                // Створюємо stream з canvas
                const stream = canvas.captureStream(30); // 30 FPS
                const mediaRecorder = new MediaRecorder(stream, {
                  mimeType: selectedMimeType,
                  videoBitsPerSecond: 2500000 // 2.5 Mbps для хорошої якості
                });
                
                const chunks: Blob[] = [];
                let isRecordingComplete = false;
                
                mediaRecorder.ondataavailable = (event) => {
                  if (event.data.size > 0) {
                    chunks.push(event.data);
                  }
                };
                
                mediaRecorder.onstop = () => {
                  if (isRecordingComplete) {
                    const convertedBlob = new Blob(chunks, { type: selectedMimeType.split(';')[0] });
                    console.log(`✅ Конвертація завершена: ${videoFile.name} -> ${convertedBlob.type} (${(convertedBlob.size / 1024 / 1024).toFixed(2)} MB)`);
                    
                                         // Конвертуємо в Data URL
                     const reader = new FileReader();
                     reader.onload = () => {
                       URL.revokeObjectURL(videoUrl);
                       setIsConverting(false);
                       setConvertingFileName('');
                       resolve({ 
                         success: true, 
                         convertedDataUrl: reader.result as string 
                       });
                     };
                     reader.onerror = () => {
                       URL.revokeObjectURL(videoUrl);
                       setIsConverting(false);
                       setConvertingFileName('');
                       resolve({ success: false, error: 'Помилка читання конвертованого відео' });
                     };
                     reader.readAsDataURL(convertedBlob);
                  }
                };
                
                                 mediaRecorder.onerror = (error) => {
                   console.error('❌ Помилка MediaRecorder:', error);
                   URL.revokeObjectURL(videoUrl);
                   setIsConverting(false);
                   setConvertingFileName('');
                   resolve({ success: false, error: 'Помилка конвертації відео' });
                 };
                
                // Функція для малювання кадрів
                let frameCount = 0;
                const maxFrames = Math.min(video.duration * 30, 300); // Максимум 10 секунд при 30 FPS
                
                const drawFrame = () => {
                  if (video.paused || video.ended || frameCount >= maxFrames) {
                    if (!isRecordingComplete) {
                      isRecordingComplete = true;
                      mediaRecorder.stop();
                    }
                    return;
                  }
                  
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  frameCount++;
                  
                  requestAnimationFrame(drawFrame);
                };
                
                // Запускаємо процес
                video.addEventListener('play', () => {
                  mediaRecorder.start();
                  drawFrame();
                });
                
                video.addEventListener('ended', () => {
                  if (!isRecordingComplete) {
                    isRecordingComplete = true;
                    mediaRecorder.stop();
                  }
                });
                
                // Починаємо відтворення для конвертації
                video.currentTime = 0;
                                 video.play().catch((error) => {
                   console.error('❌ Не вдалося запустити відео для конвертації:', error);
                   URL.revokeObjectURL(videoUrl);
                   setIsConverting(false);
                   setConvertingFileName('');
                   resolve({ success: false, error: 'Не вдалося запустити відео' });
                 });
                
                // Таймаут для уникнення зависання (30 секунд)
                                 setTimeout(() => {
                   if (!isRecordingComplete) {
                     console.warn('⏰ Таймаут конвертації відео');
                     isRecordingComplete = true;
                     if (mediaRecorder.state === 'recording') {
                       mediaRecorder.stop();
                     }
                     URL.revokeObjectURL(videoUrl);
                     setIsConverting(false);
                     setConvertingFileName('');
                     resolve({ success: false, error: 'Таймаут конвертації' });
                   }
                 }, 30000);
              };
              
                             video.onerror = () => {
                 console.error('❌ Помилка завантаження відео для конвертації');
                 URL.revokeObjectURL(videoUrl);
                 setIsConverting(false);
                 setConvertingFileName('');
                 resolve({ success: false, error: 'Не вдалося завантажити відео' });
               };
              
                         } catch (error) {
               console.error('❌ Критична помилка конвертації:', error);
               setIsConverting(false);
               setConvertingFileName('');
               resolve({ success: false, error: String(error) });
             }
          });
        };
        
        try {
          // Створюємо відео елемент для генерації превью
          const video = document.createElement('video');
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Створюємо URL для відео файлу
          const videoUrl = URL.createObjectURL(file);
          video.src = videoUrl;
          video.crossOrigin = 'anonymous';
          video.muted = true; // Важливо для автозапуску
          
          // Обробляємо завантаження відео
          const videoPromise = new Promise<string>((videoResolve, videoReject) => {
            let hasResolved = false;
            
            const cleanup = () => {
              URL.revokeObjectURL(videoUrl);
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('seeked', onSeeked);
              video.removeEventListener('error', onError);
            };
            
            const onLoadedMetadata = () => {
              console.log(`📹 Метадані відео завантажено: ${file.name}`, {
                duration: video.duration,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight
              });
              
              // Встановлюємо розміри canvas
              const maxWidth = 400;
              const maxHeight = 300;
              let { videoWidth: width, videoHeight: height } = video;
              
              if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width *= ratio;
                height *= ratio;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Переходимо до середини відео для кращого превью
              video.currentTime = Math.min(video.duration * 0.1, 2); // 10% або 2 секунди
            };
            
            const onSeeked = () => {
              if (hasResolved) return;
              
              try {
                // Малюємо кадр на canvas
                ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Конвертуємо в Data URL
                canvas.toBlob((blob) => {
                  if (blob && !hasResolved) {
                    hasResolved = true;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const previewDataUrl = e.target?.result as string;
                      console.log(`✅ Превью відео створено: ${file.name} (${(previewDataUrl.length / 1024).toFixed(2)} KB)`);
                      cleanup();
                      videoResolve(previewDataUrl);
                    };
                    reader.onerror = () => {
                      cleanup();
                      videoReject(new Error('Помилка конвертації превью'));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.8);
              } catch (drawError) {
                console.error(`❌ Помилка створення превью для ${file.name}:`, drawError);
                if (!hasResolved) {
                  hasResolved = true;
                  cleanup();
                  // Використовуємо стандартне превью
                  videoResolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+');
                }
              }
            };
            
            const onError = (error: any) => {
              console.error(`❌ Помилка завантаження відео ${file.name}:`, error);
              if (!hasResolved) {
                hasResolved = true;
                cleanup();
                // Використовуємо стандартне превью
                videoResolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+');
              }
            };
            
            // Таймаут для уникнення зависання
            setTimeout(() => {
              if (!hasResolved) {
                console.warn(`⏰ Таймаут створення превью для ${file.name}`);
                hasResolved = true;
                cleanup();
                videoResolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+');
              }
            }, 10000); // 10 секунд таймаут
            
            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('seeked', onSeeked);
            video.addEventListener('error', onError);
            
            // Запускаємо завантаження
            video.load();
          });
          
          // Одночасно читаємо повний відео файл
          const fullVideoPromise = new Promise<string>((fullResolve, fullReject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              let dataUrl = e.target?.result as string;
              
              // Виправляємо MIME-тип якщо потрібно
              if (dataUrl.startsWith('data:application/octet-stream')) {
                console.log('🔧 Виправляємо MIME-тип відео файлу');
                const mimeType = file.type || 'video/mp4';
                dataUrl = dataUrl.replace('data:application/octet-stream', `data:${mimeType}`);
              }
              
              console.log(`✅ Повний відео файл прочитано: ${file.name} (${(dataUrl.length / 1024 / 1024).toFixed(2)} MB)`);
              fullResolve(dataUrl);
            };
            
            reader.onerror = () => {
              console.error(`❌ Помилка читання повного відео файлу: ${file.name}`);
              fullReject(new Error('Помилка читання відео файлу'));
            };
            
            reader.readAsDataURL(file);
          });
          
          // Спробуємо автоматичну конвертацію відео для кращої сумісності
          const conversionPromise = convertVideoToBrowserCompatible(file);
          
          // Чекаємо усі три процеси
          Promise.all([videoPromise, fullVideoPromise, conversionPromise]).then(([previewDataUrl, fullVideoDataUrl, conversionResult]) => {
            console.log(`✅ Відео файл повністю оброблено: ${file.name}`);
            console.log(`📊 Превью: ${(previewDataUrl.length / 1024).toFixed(2)} KB`);
            console.log(`📊 Повний файл: ${(fullVideoDataUrl.length / 1024 / 1024).toFixed(2)} MB`);
            
            // Використовуємо конвертоване відео якщо конвертація успішна
            const finalVideoUrl = conversionResult.success && conversionResult.convertedDataUrl 
              ? conversionResult.convertedDataUrl 
              : fullVideoDataUrl;
            
            if (conversionResult.success) {
              console.log(`🎯 Використовуємо конвертоване відео для кращої сумісності з браузером`);
              console.log(`📊 Конвертоване відео: ${(finalVideoUrl.length / 1024 / 1024).toFixed(2)} MB`);
            } else if (conversionResult.error) {
              console.warn(`⚠️ Конвертація не вдалася (${conversionResult.error}), використовуємо оригінальне відео`);
            }
            
            // Повертаємо об'єкт з превью для відображення та найкращим файлом для використання
            resolve({
              optimizedFile: file,
              dataUrl: previewDataUrl, // Превью для відображення в галереї
              fullVideoUrl: finalVideoUrl // Конвертоване або оригінальне відео
            });
          }).catch((error) => {
            console.error(`❌ Помилка обробки відео ${file.name}:`, error);
            
            // У випадку помилки превью спробуємо хоча б зберегти повний файл
            const reader = new FileReader();
            reader.onload = (e) => {
              let fullVideoDataUrl = e.target?.result as string;
              
              // Виправляємо MIME-тип якщо потрібно
              if (fullVideoDataUrl.startsWith('data:application/octet-stream')) {
                const mimeType = file.type || 'video/mp4';
                fullVideoDataUrl = fullVideoDataUrl.replace('data:application/octet-stream', `data:${mimeType}`);
              }
              
              console.log(`⚠️ Превью не вдалося, але повний відео файл збережено: ${file.name}`);
              resolve({
                optimizedFile: file,
                dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+',
                fullVideoUrl: fullVideoDataUrl // Справжній відео файл навіть при помилці превью
              });
            };
            
            reader.onerror = () => {
              console.error(`❌ Критична помилка читання відео файлу: ${file.name}`);
              resolve({
                optimizedFile: file,
                dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+',
                fullVideoUrl: undefined // Тільки якщо читання файлу теж не вдалося
              });
            };
            
            reader.readAsDataURL(file);
          });
          
        } catch (error) {
          console.error(`❌ Помилка обробки відео ${file.name}:`, error);
          
          // У випадку помилки спробуємо хоча б зберегти повний файл
          const reader = new FileReader();
          reader.onload = (e) => {
            let fullVideoDataUrl = e.target?.result as string;
            
            // Виправляємо MIME-тип якщо потрібно
            if (fullVideoDataUrl.startsWith('data:application/octet-stream')) {
              const mimeType = file.type || 'video/mp4';
              fullVideoDataUrl = fullVideoDataUrl.replace('data:application/octet-stream', `data:${mimeType}`);
            }
            
            console.log(`⚠️ Помилка обробки, але повний відео файл збережено: ${file.name}`);
            resolve({
              optimizedFile: file,
              dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+',
              fullVideoUrl: fullVideoDataUrl // Справжній відео файл навіть при помилці
            });
          };
          
          reader.onerror = () => {
            console.error(`❌ Критична помилка читання відео файлу: ${file.name}`);
            resolve({
              optimizedFile: file,
              dataUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iPvCfj6UgVmlkZW88L3RleHQ+PC9zdmc+',
              fullVideoUrl: undefined // Тільки якщо читання файлу теж не вдалося
            });
          };
          
          reader.readAsDataURL(file);
        }
      } else {
        reject(new Error('Непідтримуваний тип файлу'));
      }
    });
  };

  // Нова стабільна функція завантаження файлів
  const handleFileUpload = async (uploadedFiles: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const newFiles: FileItem[] = [];
    const totalFiles = uploadedFiles.length;
    
    console.log(`🚀 Початок завантаження ${totalFiles} файлів`);
    
    for (let i = 0; i < totalFiles; i++) {
      const file = uploadedFiles[i];
      
      try {
        console.log(`📁 Обробка файлу ${i + 1}/${totalFiles}: ${file.name} (${formatFileSize(file.size)})`);
        
        // Перевірка розміру файлу
        if (file.size > maxFileSize) {
          console.warn(`⚠️ Файл занадто великий: ${file.name}`);
          alert(`⚠️ Файл "${file.name}" занадто великий (${formatFileSize(file.size)}). Максимальний розмір: ${formatFileSize(maxFileSize)}`);
          setUploadProgress(((i + 1) / totalFiles) * 100);
          continue;
        }
        
        // Визначаємо тип файлу на основі MIME-типу та розширення
        let fileType: 'image' | 'audio' | 'video';
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop() || '';
        
        console.log(`🔍 Аналіз файлу: ${file.name}`, {
          mimeType: file.type,
          extension: fileExtension,
          size: formatFileSize(file.size)
        });
        
        // Визначаємо тип на основі MIME-типу та розширення
        if (file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileExtension)) {
          fileType = 'image';
          if (!allowedTypes.includes('image')) {
            console.warn(`❌ Зображення не дозволені`);
            setUploadProgress(((i + 1) / totalFiles) * 100);
            continue;
          }
        } else if (file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(fileExtension)) {
          fileType = 'audio';
          if (!allowedTypes.includes('audio')) {
            console.warn(`❌ Аудіо не дозволене`);
            setUploadProgress(((i + 1) / totalFiles) * 100);
            continue;
          }
        } else if (file.type.startsWith('video/') || ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(fileExtension)) {
          fileType = 'video';
          if (!allowedTypes.includes('video')) {
            console.warn(`❌ Відео не дозволене`);
            setUploadProgress(((i + 1) / totalFiles) * 100);
            continue;
          }
        } else {
          console.warn(`❌ Непідтримуваний тип файлу: ${file.type} (розширення: ${fileExtension})`);
          alert(`❌ Непідтримуваний тип файлу: ${file.name}\\nMIME: ${file.type}\\nРозширення: ${fileExtension}`);
          setUploadProgress(((i + 1) / totalFiles) * 100);
          continue;
        }
        
        console.log(`✅ Тип файлу визначено: ${fileType} для ${file.name}`);
        
        // Оптимізуємо файл
        console.log(`⚙️ Оптимізація файлу: ${file.name}`);
        const { optimizedFile, dataUrl, fullVideoUrl } = await optimizeFile(file);
        
        // Створюємо об'єкт файлу
        const fileItem: FileItem = {
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name.split('.')[0],
          type: fileType,
          url: dataUrl,
          originalName: file.name,
          size: optimizedFile.size,
          uploadDate: new Date().toISOString(),
          optimized: true,
          hasContent: true
        };
        
        // Для відео файлів зберігаємо повний файл окремо в IndexedDB
        if (fileType === 'video' && fullVideoUrl) {
          console.log(`💾 Зберігаємо повний відео файл в IndexedDB: ${file.name}`);
          
          try {
            // Зберігаємо в IndexedDB
            const dbRequest = indexedDB.open('ContentManagerDB', 2);
            
            dbRequest.onupgradeneeded = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
              }
            };
            
            dbRequest.onsuccess = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              const transaction = db.transaction(['files'], 'readwrite');
              const store = transaction.objectStore('files');
              
              const fullFileItem = {
                ...fileItem,
                url: fullVideoUrl, // Зберігаємо повний відео файл
                fullSize: file.size,
                isFullFile: true
              };
              
              store.put(fullFileItem);
              
              transaction.oncomplete = () => {
                console.log(`✅ Повний відео файл збережено в IndexedDB: ${file.name}`);
                db.close();
              };
              
              transaction.onerror = () => {
                console.error(`❌ Помилка збереження в IndexedDB: ${file.name}`);
                db.close();
              };
            };
            
            dbRequest.onerror = () => {
              console.error(`❌ Помилка відкриття IndexedDB для ${file.name}`);
            };
            
          } catch (indexedDBError) {
            console.error(`❌ Помилка роботи з IndexedDB для ${file.name}:`, indexedDBError);
          }
        }
        
        // Для великих аудіо файлів зберігаємо повний файл в IndexedDB
        if (fileType === 'audio' && file.size > 50 * 1024) { // Більше 50KB
          console.log(`💾 Зберігаємо повний аудіо файл в IndexedDB: ${file.name}`);
          
          try {
            // Читаємо повний файл
            const fullFileReader = new FileReader();
            const fullFilePromise = new Promise<string>((resolve, reject) => {
              fullFileReader.onload = (e) => {
                let fullDataUrl = e.target?.result as string;
                
                // Виправляємо MIME-тип якщо потрібно
                if (fullDataUrl.startsWith('data:application/octet-stream')) {
                  const mimeType = file.type || 'audio/mpeg';
                  fullDataUrl = fullDataUrl.replace('data:application/octet-stream', `data:${mimeType}`);
                }
                
                resolve(fullDataUrl);
              };
              fullFileReader.onerror = () => reject(new Error('Помилка читання повного файлу'));
            });
            
            fullFileReader.readAsDataURL(file);
            const fullDataUrl = await fullFilePromise;
            
            // Зберігаємо в IndexedDB
            const dbRequest = indexedDB.open('ContentManagerDB', 2);
            
            dbRequest.onupgradeneeded = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files', { keyPath: 'id' });
              }
            };
            
            dbRequest.onsuccess = (event) => {
              const db = (event.target as IDBOpenDBRequest).result;
              const transaction = db.transaction(['files'], 'readwrite');
              const store = transaction.objectStore('files');
              
              const fullFileItem = {
                ...fileItem,
                url: fullDataUrl,
                fullSize: file.size,
                isFullFile: true
              };
              
              store.put(fullFileItem);
              
              transaction.oncomplete = () => {
                console.log(`✅ Повний аудіо файл збережено в IndexedDB: ${file.name}`);
                db.close();
              };
              
              transaction.onerror = () => {
                console.error(`❌ Помилка збереження в IndexedDB: ${file.name}`);
                db.close();
              };
            };
            
            dbRequest.onerror = () => {
              console.error(`❌ Помилка відкриття IndexedDB для ${file.name}`);
            };
            
          } catch (indexedDBError) {
            console.error(`❌ Помилка роботи з IndexedDB для ${file.name}:`, indexedDBError);
          }
        }
        
        newFiles.push(fileItem);
        console.log(`✅ Файл успішно оброблено: ${file.name}`);
        
      } catch (error) {
        console.error(`❌ Помилка обробки файлу ${file.name}:`, error);
        alert(`❌ Помилка обробки файлу "${file.name}": ${error.message}`);
      }
      
      // Оновлюємо прогрес
      setUploadProgress(((i + 1) / totalFiles) * 100);
    }
    
    if (newFiles.length === 0) {
      alert('❌ Жоден файл не було успішно завантажено.');
      setIsUploading(false);
      setUploadProgress(0);
      return;
    }
    
    // Додаємо нові файли до списку
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Намагаємося зберегти файли
    try {
      await saveFilesToStorage(updatedFiles);
      console.log(`🎉 Завантаження завершено! Успішно оброблено ${newFiles.length} з ${totalFiles} файлів`);
      alert(`✅ Успішно завантажено ${newFiles.length} файлів!`);
    } catch (saveError) {
      console.error('❌ Помилка збереження після завантаження:', saveError);
      // Файли все одно додані в стан, просто збереження не вдалося
      alert(`⚠️ Файли завантажено (${newFiles.length}), але збереження не вдалося. Вони будуть доступні до перезавантаження сторінки.`);
    }
    
    setIsUploading(false);
    setUploadProgress(0);
    setActiveTab('gallery');
  };

  // Drag & Drop обробники
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [handleFileUpload]);

  // Видалення файлу
  const deleteFile = async (fileId: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей файл?')) {
      try {
        // Видаляємо з IndexedDB
        await indexedDBService.deleteFile(fileId);
        
        // Оновлюємо локальний стан
        const updatedFiles = files.filter(file => file.id !== fileId);
        setFiles(updatedFiles);
        
        // Оновлюємо localStorage
        await saveFilesToStorage(updatedFiles);
        
        console.log(`🗑️ ContentManager: Файл видалено: ${fileId}`);
      } catch (error) {
        console.error('❌ ContentManager: Помилка видалення файлу:', error);
        alert('❌ Помилка видалення файлу');
      }
    }
  };

  // Вибір файлу (якщо передано callback)
  const selectFile = async (file: FileItem) => {
    if (onFileSelect) {
      console.log(`📋 Вибрано файл: ${file.name} (${file.type})`);
      
      // Для аудіо файлів ЗАВЖДИ перевіряємо чи потрібно завантажити повний файл з IndexedDB
      if (file.type === 'audio' && (file.isHeavy || !file.url || file.url.length < 1000)) {
        console.log(`🔄 Аудіо файл потребує завантаження з IndexedDB: ${file.name}`);
        
        try {
          // Відкриваємо IndexedDB
          const request = indexedDB.open('ContentManagerDB', 2);
          
          request.onerror = () => {
            console.error('❌ Помилка відкриття IndexedDB');
            // Використовуємо те що є
            onFileSelect(file);
          };
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            
            if (!db.objectStoreNames.contains('files')) {
              console.warn('⚠️ Об\'єкт-сховище "files" не існує в IndexedDB');
              // Використовуємо те що є
              onFileSelect(file);
              db.close();
              return;
            }
            
            const transaction = db.transaction(['files'], 'readonly');
            const store = transaction.objectStore('files');
            const getRequest = store.get(file.id);
            
            getRequest.onsuccess = () => {
              const fullFile = getRequest.result;
              if (fullFile && fullFile.url && fullFile.url.length > 1000) {
                console.log(`✅ Повний аудіо файл завантажено з IndexedDB: ${file.name}`);
                console.log(`📊 Розмір URL: ${(fullFile.url.length / 1024).toFixed(2)} KB`);
                
                // Перевіряємо чи це справді повний файл, а не мініатюра
                if (fullFile.url.startsWith('data:audio/') || fullFile.url.startsWith('data:application/octet-stream')) {
                  // Передаємо повний файл з IndexedDB
                  onFileSelect({
                    ...file,
                    url: fullFile.url,
                    hasContent: true,
                    isFullFile: true
                  });
                } else {
                  console.warn(`⚠️ Файл з IndexedDB не схожий на аудіо: ${fullFile.url.substring(0, 50)}...`);
                  onFileSelect(file);
                }
              } else {
                console.log(`⚠️ Повний файл не знайдено в IndexedDB або він порожній, використовуємо метадані`);
                // Якщо повного файлу немає, але це аудіо файл, спробуємо знайти за назвою
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = () => {
                  const allFiles = getAllRequest.result;
                  const audioFiles = allFiles.filter((f: any) => 
                    f.type === 'audio' && f.url && f.url.length > 1000
                  );
                  
                  // Шукаємо файл за назвою
                  const matchingFile = audioFiles.find((f: any) => 
                    f.name === file.name || f.originalName === file.originalName
                  );
                  
                  if (matchingFile) {
                    console.log(`✅ Знайдено відповідний аудіо файл за назвою: ${matchingFile.name}`);
                    onFileSelect({
                      ...file,
                      url: matchingFile.url,
                      hasContent: true,
                      isFullFile: true
                    });
                  } else {
                    console.log(`❌ Аудіо файл не знайдено в IndexedDB`);
                    onFileSelect(file);
                  }
                };
              }
              db.close();
            };
            
            getRequest.onerror = () => {
              console.error('❌ Помилка завантаження файлу з IndexedDB');
              // Використовуємо те що є
              onFileSelect(file);
              db.close();
            };
          };
          
        } catch (error) {
          console.error('❌ Помилка роботи з IndexedDB:', error);
          // Використовуємо те що є
          onFileSelect(file);
        }
      } else {
        // Для інших файлів або повних аудіо файлів використовуємо як є
        console.log(`✅ Використовуємо файл як є: ${file.name}`);
        onFileSelect(file);
      }
    }
  };

  // Фільтрація файлів
  const filteredFiles = files.filter(file => {
    if (selectedType !== 'all' && file.type !== selectedType) return false;
    if (!allowedTypes.includes(file.type)) return false;
    return true;
  });

  // Форматування розміру файлу
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Іконки для типів файлів
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      case 'video': return '🎬';
      default: return '📁';
    }
  };

  // Експорт всіх файлів
  const exportFiles = () => {
    const dataToExport = {
      files,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-manager-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Імпорт файлів
  const importFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (importedData.files && Array.isArray(importedData.files)) {
            setFiles(importedData.files);
            saveFilesToStorage(importedData.files);
            alert('Файли успішно імпортовано!');
          } else {
            alert('Невірний формат файлу');
          }
        } catch (error) {
          alert('Помилка при імпорті файлу');
        }
      };
      reader.readAsText(file);
    }
  };

  // Повне очищення всіх даних
  const clearAllData = () => {
    if (confirm('⚠️ УВАГА! Ви впевнені, що хочете видалити всі файли? Цю дію неможливо скасувати!')) {
      try {
        console.log('🧹 ContentManager: Очищення всіх даних...');
        
        // Очищуємо IndexedDB
        indexedDBService.clearAllData();
        
        // Очищуємо localStorage
        const allKeys = [
          'smartContentManager_v2',
          'contentManagerFiles',
          'contentManagerMetadata',
          'contentManagerIndexedDB',
          'audioFiles',
          'imageFiles',
          'videoFiles'
        ];
        
        allKeys.forEach(key => {
          localStorage.removeItem(key);
        });

        // Очищаємо стан
        setFiles([]);
        
        console.log('✅ ContentManager: Всі дані очищено');
        alert('✅ Всі дані успішно очищено!');
        
      } catch (error) {
        console.error('❌ ContentManager: Помилка очищення даних:', error);
        alert('❌ Помилка очищення даних');
      }
    }
  };

  // Функція для повної міграції в IndexedDB
  const migrateToIndexedDB = async () => {
    if (confirm('🔄 Мігрувати всі дані проекту в IndexedDB? Це покращить продуктивність та усуне басейни з localStorage.')) {
      try {
        console.log('🚀 ContentManager: Початок повної міграції...');
        
        // Виконуємо повну міграцію через IndexedDBService
        await indexedDBService.migrateFromLocalStorage();
        
        // Перезавантажуємо файли
        const migratedFiles = await indexedDBService.loadFiles();
        setFiles(migratedFiles);
        
        console.log('✅ ContentManager: Повна міграція завершена');
        alert('✅ Міграція успішно завершена! Всі дані тепер зберігаються в IndexedDB.');
        
      } catch (error) {
        console.error('❌ ContentManager: Помилка міграції:', error);
        alert('❌ Помилка міграції. Спробуйте ще раз або зверніться до підтримки.');
      }
    }
  };

  // Функції для редагування назв файлів
  const startEditing = (file: FileItem) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const saveFileName = async (fileId: string) => {
    if (!editingName.trim()) {
      alert('Назва файлу не може бути пустою!');
      return;
    }

    const updatedFiles = files.map(file => 
      file.id === fileId 
        ? { ...file, name: editingName.trim() }
        : file
    );
    
    setFiles(updatedFiles);
    await saveFilesToStorage(updatedFiles);
    setEditingFileId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingFileId(null);
    setEditingName('');
  };

  // Обробка подвійного кліку (десктоп)
  const handleDoubleClick = (file: FileItem) => {
    startEditing(file);
  };

  // Обробка довгого натискання (мобільні)
  const handleTouchStart = (file: FileItem) => {
    const timer = setTimeout(() => {
      startEditing(file);
      // Додаємо віброзворотний зв'язок для мобільних
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms для довгого натискання

    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Обробка клавіш в режимі редагування
  const handleKeyPress = (e: React.KeyboardEvent, fileId: string) => {
    if (e.key === 'Enter') {
      saveFileName(fileId);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg lg:rounded-2xl p-1.5 lg:p-6 border border-slate-200 shadow-lg ${className}`}>
      {/* Заголовок - ультра-компактний */}
      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-6 h-6 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-xl">📁</span>
        </div>
        <div>
          <h2 className="text-xs lg:text-2xl font-bold text-slate-800">{t('content.manager.title')}</h2>
          <p className="text-slate-600 text-xs lg:text-base hidden lg:block">{t('content.manager.description')}</p>
        </div>
      </div>

      {/* Статистика - адаптивна сітка */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-4 mb-2 lg:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-md lg:rounded-xl p-2 lg:p-4 text-center">
          <div className="text-sm lg:text-2xl font-bold text-blue-600">{files.length}</div>
          <div className="text-xs lg:text-sm text-blue-500">{t('content.manager.total.files')}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-md lg:rounded-xl p-2 lg:p-4 text-center">
          <div className="text-sm lg:text-2xl font-bold text-green-600">{files.filter(f => f.type === 'image').length}</div>
          <div className="text-xs lg:text-sm text-green-500">{t('content.manager.images.count')}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-md lg:rounded-xl p-2 lg:p-4 text-center">
          <div className="text-sm lg:text-2xl font-bold text-purple-600">{files.filter(f => f.type === 'audio').length}</div>
          <div className="text-xs lg:text-sm text-purple-500">{t('content.manager.audio.count')}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-md lg:rounded-xl p-2 lg:p-4 text-center">
          <div className="text-sm lg:text-2xl font-bold text-orange-600">{files.filter(f => f.type === 'video').length}</div>
          <div className="text-xs lg:text-sm text-orange-500">{t('content.manager.video.count')}</div>
        </div>
      </div>

      {/* Вкладки та дії - ультра-компактні */}
      <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 lg:justify-between lg:items-center mb-2 lg:mb-6">
        {/* Навігаційні вкладки - адаптивні */}
        <div className="flex justify-between lg:justify-start items-center gap-2">
          {/* Ліва частина - навігаційні кнопки */}
          <div className="flex gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-2 lg:px-6 py-1 lg:py-3 rounded-md lg:rounded-xl font-medium transition-all duration-200 text-xs lg:text-base min-h-[36px] touch-manipulation ${
                activeTab === 'gallery'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/60 text-slate-600 hover:bg-white/80'
              }`}
            >
              <span className="hidden lg:inline">📚 {t('content.manager.gallery')} ({files.length})</span>
              <span className="lg:hidden">📚 {t('content.manager.gallery')} ({files.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-2 lg:px-6 py-1 lg:py-3 rounded-md lg:rounded-xl font-medium transition-all duration-200 text-xs lg:text-base min-h-[36px] touch-manipulation ${
                activeTab === 'upload'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              <span className="hidden lg:inline">⬆️ {t('content.manager.upload.btn')}</span>
              <span className="lg:hidden">⬆️ {t('content.manager.upload.btn')}</span>
            </button>
            <button
              onClick={() => setActiveTab('cloud')}
              className={`px-2 lg:px-6 py-1 lg:py-3 rounded-md lg:rounded-xl font-medium transition-all duration-200 text-xs lg:text-base min-h-[36px] touch-manipulation ${
                activeTab === 'cloud'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <span className="hidden lg:inline">🌐 {t('content.manager.cloud')}</span>
              <span className="lg:hidden">🌐 {t('content.manager.cloud')}</span>
            </button>
          </div>
          
          {/* Права частина - кнопка очистки (тільки мобільна) */}
          <button
            onClick={clearAllData}
            className="lg:hidden px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-xs font-medium shadow-md hover:shadow-lg min-h-[32px] touch-manipulation whitespace-nowrap"
            title={t('content.manager.clear.tooltip')}
          >
            🗑️ {t('content.manager.clear.btn')}
          </button>
        </div>
        
        {/* Кнопка очистки (тільки десктоп) */}
        <button
          onClick={clearAllData}
          className="hidden lg:block px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg min-h-[36px] touch-manipulation whitespace-nowrap"
          title={t('content.manager.clear.tooltip')}
        >
          🗑️ {t('content.manager.clear.btn')}
        </button>
      </div>

      {/* Контент вкладок */}
      <AnimatePresence mode="wait">
        {activeTab === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2 lg:space-y-6"
          >
            {/* Зона завантаження - компактна */}
            <div
              className={`
                relative border-2 border-dashed rounded-md lg:rounded-xl p-3 lg:p-8 text-center cursor-pointer
                transition-all duration-300 ease-out
                ${dragActive 
                  ? 'border-green-500 bg-green-50 scale-105 shadow-lg' 
                  : 'border-green-300 hover:border-green-400 hover:bg-green-50 hover:shadow-md'
                }
                ${isUploading || isConverting ? 'pointer-events-none' : ''}
              `}
              onClick={() => !(isUploading || isConverting) && fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedTypes.map(type => `${type}/*`).join(',')}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              {isUploading || isConverting ? (
                <div className="space-y-2 lg:space-y-4">
                  <div className="text-2xl lg:text-4xl">
                    {isConverting ? '🎬' : '⏳'}
                  </div>
                  <div className="text-sm lg:text-lg font-medium text-slate-700">
                    {isConverting 
                      ? <span className="block"><span className="hidden lg:inline">{`${t('content.manager.converting')}: `}</span>{convertingFileName}</span>
                      : `${t('content.manager.uploading')}... ${Math.round(uploadProgress)}%`
                    }
                  </div>
                  {!isConverting && (
                    <div className="w-full bg-slate-200 rounded-full h-1.5 lg:h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 lg:h-3 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  {isConverting && (
                    <div className="space-y-1 lg:space-y-2">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 lg:h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-1.5 lg:h-3 rounded-full transition-all duration-1000 animate-pulse"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div className="text-xs lg:text-sm text-slate-600">
                        ⚡ {t('content.manager.auto.convert')}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2 lg:space-y-4">
                  <div className="text-3xl lg:text-6xl">
                    {dragActive ? '📥' : '📁'}
                  </div>
                  <div className="text-sm lg:text-xl font-medium text-slate-700">
                    {dragActive ? t('content.manager.drop.files') : t('content.manager.drag.here')}
                  </div>
                  
                  {/* Кнопка для завантаження */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mx-auto px-4 lg:px-8 py-2 lg:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg lg:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm lg:text-lg flex items-center gap-2"
                  >
                    <span>📤</span>
                    <span>{t('content.manager.upload.btn')}</span>
                  </button>
                  
                  <div className="text-xs lg:text-base text-slate-500">
                    {t('content.manager.or.click')}
                  </div>
                  <div className="text-xs lg:text-sm text-slate-400 space-y-1">
                    <div>{t('content.manager.supported')}: {allowedTypes.join(', ')}</div>
                    <div>{t('content.manager.max.size')}: {formatFileSize(maxFileSize)}</div>
                    {allowedTypes.includes('image') && <div>{t('content.manager.image.optimize')}</div>}
                    {allowedTypes.includes('video') && <div>🎬 {t('content.manager.video.convert')}</div>}
                  </div>
                  
                  {/* Інформація про ліміти пам'яті - компактна */}
                  <div className="mt-2 lg:mt-4 p-2 lg:p-3 bg-blue-50 rounded-md lg:rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium mb-1 lg:mb-2">💡 {t('content.manager.memory.management')}:</div>
                    <div className="text-xs text-blue-600 space-y-0.5 lg:space-y-1">
                      <div>• {t('content.manager.files.small')}</div>
                      <div>• {t('content.manager.files.large')}</div>
                      <div className="hidden lg:block">• {t('content.manager.auto.move')}</div>
                      <div className="hidden lg:block">• {t('content.manager.audio.recommend')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2 lg:space-y-6"
          >
            {/* Фільтри - адаптивна сітка */}
            <div className="grid grid-cols-2 lg:flex gap-1 lg:gap-2">
              {['all', ...allowedTypes].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type as any)}
                  className={`px-2 lg:px-4 py-1 lg:py-2 rounded-md lg:rounded-lg font-medium transition-all duration-200 text-xs lg:text-base min-h-[32px] touch-manipulation ${
                    selectedType === type
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white/60 text-slate-600 hover:bg-white/80'
                  }`}
                >
                  {type === 'all' ? `🗂️ ${t('content.manager.filter.all')}` : 
                   type === 'image' ? `🖼️ ${t('content.manager.filter.images')}` :
                   type === 'audio' ? `🎵 ${t('content.manager.filter.audio')}` : `🎬 ${t('content.manager.filter.video')}`}
                  {type !== 'all' && ` (${files.filter(f => f.type === type).length})`}
                </button>
              ))}
            </div>

            {/* Галерея файлів - мобільна сітка */}
            {filteredFiles.length === 0 ? (
              <div className="text-center py-6 lg:py-12">
                <div className="text-3xl lg:text-6xl mb-2 lg:mb-4">📭</div>
                <div className="text-sm lg:text-xl font-medium text-slate-600 mb-1 lg:mb-2">
                  {t('content.manager.no.files')}
                </div>
                <div className="text-xs lg:text-base text-slate-500">
                  {t('content.manager.upload.to.start')}
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 
                hover:scrollbar-thumb-blue-600 rounded-md lg:rounded-lg bg-white/50 p-2 lg:p-4 min-h-[200px] lg:min-h-[400px] max-h-[50vh] lg:max-h-[700px]">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">
                  {filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Превью файлу - компактне */}
                      <div className="aspect-square bg-slate-100 rounded-md lg:rounded-lg mb-2 lg:mb-3 overflow-hidden relative">
                        {file.type === 'image' && file.url ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Помилка завантаження зображення: ${file.name}`);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : file.type === 'video' && file.url ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error(`Помилка завантаження превью відео: ${file.name}`);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl lg:text-4xl">{getFileIcon(file.type)}</span>
                          </div>
                        )}
                        
                        {/* Індикатор оптимізації - компактний */}
                        {file.optimized && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                            <span className="hidden lg:inline">✨ {t('content.manager.status.optimized')}</span>
                            <span className="lg:hidden">✨</span>
                          </div>
                        )}
                        
                        {/* Оверлей з кнопками - touch-friendly */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 lg:gap-2 p-1">
                          {onFileSelect && (
                            <button
                              onClick={() => selectFile(file)}
                              className="px-1 lg:px-3 py-1 lg:py-2 bg-green-500 text-white rounded text-xs lg:text-sm hover:bg-green-600 transition-colors font-medium min-h-[28px] touch-manipulation"
                            >
                              <span className="hidden lg:inline">{t('content.manager.action.select')}</span>
                              <span className="lg:hidden">✓</span>
                            </button>
                          )}
                          {file.url && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(file.url);
                                alert(t('content.manager.url.copied'));
                              }}
                              className="px-1 lg:px-3 py-1 lg:py-2 bg-blue-500 text-white rounded text-xs lg:text-sm hover:bg-blue-600 transition-colors font-medium min-h-[28px] touch-manipulation"
                            >
                              <span className="hidden lg:inline">{t('content.manager.action.copy')}</span>
                              <span className="lg:hidden">📋</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="px-1 lg:px-3 py-1 lg:py-2 bg-red-500 text-white rounded text-xs lg:text-sm hover:bg-red-600 transition-colors font-medium min-h-[28px] touch-manipulation"
                          >
                            <span className="hidden lg:inline">{t('content.manager.action.delete')}</span>
                            <span className="lg:hidden">🗑️</span>
                          </button>
                        </div>
                      </div>

                      {/* Інформація про файл - компактна */}
                      <div className="space-y-1 lg:space-y-2">
                        {/* Назва файлу з можливістю редагування */}
                        <div className="relative">
                          {editingFileId === file.id ? (
                            <div className="flex gap-1 lg:gap-2">
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, file.id)}
                                onBlur={() => saveFileName(file.id)}
                                className="flex-1 px-1 lg:px-2 py-0.5 lg:py-1 text-xs lg:text-sm border border-blue-300 rounded focus:outline-none focus:border-blue-500 bg-white min-h-[24px] touch-manipulation"
                                autoFocus
                                placeholder={t('content.manager.enter.name')}
                              />
                              <button
                                onClick={() => saveFileName(file.id)}
                                className="px-1 lg:px-2 py-0.5 lg:py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors min-w-[24px] touch-manipulation"
                                title={t('content.manager.action.save')}
                              >
                                ✓
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="px-1 lg:px-2 py-0.5 lg:py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors min-w-[24px] touch-manipulation"
                                title={t('content.manager.action.cancel')}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div
                              className="font-medium text-slate-800 truncate cursor-pointer hover:text-blue-600 transition-colors relative group text-xs lg:text-base"
                              onDoubleClick={() => handleDoubleClick(file)}
                              onTouchStart={() => handleTouchStart(file)}
                              onTouchEnd={handleTouchEnd}
                              onTouchCancel={handleTouchEnd}
                              title={t('content.manager.edit.tooltip')}
                            >
                              {file.name}
                              <span className="absolute -top-6 left-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                                {t('content.manager.edit.tooltip')}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs lg:text-sm text-slate-500 space-y-0.5 lg:space-y-1">
                          <div className="flex items-center gap-1 lg:gap-2">
                            <span className="text-xs lg:text-base">{getFileIcon(file.type)}</span>
                            <span className="capitalize text-xs lg:text-sm">{file.type}</span>
                            {file.optimized && <span className="text-green-500 text-xs lg:text-sm" title={t('content.manager.status.optimized')}>✨</span>}
                          </div>
                          <div className="text-xs lg:text-sm">{formatFileSize(file.size)}</div>
                          <div className="text-xs lg:text-sm hidden lg:block">{new Date(file.uploadDate).toLocaleDateString()}</div>
                          {file.optimized && (
                            <div className="text-xs text-green-600 bg-green-50 px-1 lg:px-2 py-0.5 lg:py-1 rounded">
                              {t('content.manager.auto.optimized')}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'cloud' && (
                     <motion.div
             key="cloud"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="space-y-2 lg:space-y-6"
           >
             <SupabaseUploader 
               onUpload={handleSupabaseUpload}
               allowedTypes={allowedTypes}
               maxFiles={10}
               maxSize={50}
             />
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentManager; 