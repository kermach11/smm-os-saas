import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


interface SimpleAdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface CarouselItem {
  title: string;
  description: string;
  image: string;
  url?: string;
}

const SimpleAdminPanel: React.FC<SimpleAdminPanelProps> = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([
    {
      title: "LINKCORE",
      description: "Мінімалістичний профіль-хаб. Один лінк, що відкриває весь твій цифровий слід.",
      image: "/photo/photo-1.png",
      url: "#linkcore"
    },
    {
      title: "CASEMACHINE", 
      description: "Сайт-кейсбук: твої проєкти в деталях, цифри, візуали, відгуки.",
      image: "/photo/photo-2.png",
      url: "#casemachine"
    },
    {
      title: "BOOKME",
      description: "Інструмент бронювання консультацій. Години, оплата, зручність.",
      image: "/photo/photo-3.png", 
      url: "/bookme"
    },
    {
      title: "ADLAND",
      description: "Посадкові сторінки під рекламу. Швидкі, точні, ефективні.",
      image: "/photo/photo-4.png",
      url: "#adland"
    },
    {
      title: "SELLKIT",
      description: "Магазин цифрових продуктів: гайдпаки, шаблони, caption-сети.",
      image: "/photo/photo-5.png",
      url: "#sellkit"
    }
  ]);

  const [introSettings, setIntroSettings] = useState({
          titleTop: "Beyond",
          titleMiddle: "Reality", 
          description: "Travel through time and space in the exciting universe of the future.",
    buttonText: "Start Journey"
  });

  const [adminSettings, setAdminSettings] = useState({
    password: 'admin123',
    showAdminButton: false,
    autoLogout: true,
    logoutTime: 30
  });

  const [audioSettings, setAudioSettings] = useState({
    backgroundMusic: null,
    hoverSound: null,
    clickSound: null,
    transitionSound: null
  });

  const [backgroundSettings, setBackgroundSettings] = useState({
    intro: {
      type: 'color',
      color: '#000000',
      image: null,
      video: null
    },
    main: {
      type: 'color', 
      color: '#121420',
      image: null,
      video: null
    }
  });

  // Завантаження даних з localStorage
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  // Простий фікс скролу для SimpleAdminPanel
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (isVisible) {
        document.body.style.overflow = '';
      }
    };
  }, [isVisible]);

  const loadDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.carouselItems) setCarouselItems(data.carouselItems);
        if (data.introSettings) setIntroSettings(data.introSettings);
        if (data.adminSettings) {
          setAdminSettings({
            ...data.adminSettings,
            showAdminButton: false // ЗАВЖДИ false - контролюється через URL
          });
        }
        if (data.audioSettings) setAudioSettings(data.audioSettings);
        if (data.backgroundSettings) setBackgroundSettings(data.backgroundSettings);
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
    }
  };

  const saveChanges = () => {
    try {
      const dataToSave = {
        carouselItems,
        introSettings,
        adminSettings: {
          ...adminSettings,
          showAdminButton: false // ЗАВЖДИ false при збереженні
        },
        audioSettings,
        backgroundSettings,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('immersiveExperienceData', JSON.stringify(dataToSave));
      
      // Тригеримо подію для оновлення основного інтерфейсу
      window.dispatchEvent(new CustomEvent('adminDataUpdated', { 
        detail: { carouselItems, introSettings, adminSettings, audioSettings, backgroundSettings }
      }));
      
      alert('Зміни збережено успішно!');
    } catch (error) {
      console.error('Помилка збереження:', error);
      alert('Помилка при збереженні змін');
    }
  };

  const addCarouselItem = () => {
    const newItem: CarouselItem = {
      title: "Новий елемент",
      description: "Опис нового елемента",
      image: "/photo/placeholder.jpg",
      url: ""
    };
    setCarouselItems([...carouselItems, newItem]);
  };

  const removeCarouselItem = (index: number) => {
    const newItems = carouselItems.filter((_, i) => i !== index);
    setCarouselItems(newItems);
  };

  const updateCarouselItem = (index: number, field: keyof CarouselItem, value: string) => {
    const newItems = [...carouselItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setCarouselItems(newItems);
  };

  const handleImageUpload = (index: number, file: File) => {
    // ВИДАЛЕНО: Застаріла логіка FileReader - використовуйте Smart Content Manager
    console.warn('⚠️ handleImageUpload застаріла - використовуйте Smart Content Manager');
  };

  const handleAudioUpload = (field: keyof typeof audioSettings, file: File | undefined) => {
    if (!file) return;
    // ВИДАЛЕНО: Застаріла логіка FileReader - використовуйте Smart Content Manager
    console.warn('⚠️ handleAudioUpload застаріла - використовуйте Smart Content Manager');
  };

  const handleBackgroundUpload = (section: 'intro' | 'main', type: 'image' | 'video', file: File | undefined) => {
    if (!file) return;
    // ВИДАЛЕНО: Застаріла логіка FileReader - використовуйте Smart Content Manager
    console.warn('⚠️ handleBackgroundUpload застаріла - використовуйте Smart Content Manager');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="simple-admin-panel-container fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              ⚙️ Панель адміністратора
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { id: 'content', label: 'Контент' },
              { id: 'intro', label: 'Інтро' },
              { id: 'audio', label: 'Аудіо' },
              { id: 'background', label: 'Фон' },
              { id: 'settings', label: 'Налаштування' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium transition-colors text-sm ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Контент каруселі */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Елементи каруселі</h3>
                  <button 
                    onClick={addCarouselItem}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Додати елемент
                  </button>
                </div>
                
                <div className="space-y-4">
                  {carouselItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Елемент {index + 1}</h4>
                        <button 
                          onClick={() => removeCarouselItem(index)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Видалити
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Назва</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateCarouselItem(index, 'title', e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">URL посилання</label>
                          <input
                            type="text"
                            value={item.url || ''}
                            onChange={(e) => updateCarouselItem(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Опис</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateCarouselItem(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Зображення</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(index, file);
                            }}
                            className="flex-1 p-2 border rounded"
                          />
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Налаштування інтро */}
            {activeTab === 'intro' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Налаштування інтро екрану</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Верхній заголовок</label>
                    <input
                      type="text"
                      value={introSettings.titleTop}
                      onChange={(e) => setIntroSettings({...introSettings, titleTop: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Основний заголовок</label>
                    <input
                      type="text"
                      value={introSettings.titleMiddle}
                      onChange={(e) => setIntroSettings({...introSettings, titleMiddle: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Опис</label>
                  <textarea
                    value={introSettings.description}
                    onChange={(e) => setIntroSettings({...introSettings, description: e.target.value})}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Текст кнопки</label>
                  <input
                    type="text"
                    value={introSettings.buttonText}
                    onChange={(e) => setIntroSettings({...introSettings, buttonText: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Налаштування аудіо */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Налаштування аудіо</h3>
                <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded">
                  <p><strong>Рекомендовані формати:</strong> MP3, WAV, OGG</p>
                  <p><strong>Макс. розмір:</strong> 2MB для ефектів, 10MB для фонової музики</p>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">Фонова музика</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioUpload('backgroundMusic', e.target.files?.[0])}
                      className="w-full p-2 border rounded"
                    />
                    {audioSettings.backgroundMusic && (
                      <audio controls className="w-full mt-2">
                        <source src={audioSettings.backgroundMusic} />
                      </audio>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">Звук при наведенні</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioUpload('hoverSound', e.target.files?.[0])}
                      className="w-full p-2 border rounded"
                    />
                    {audioSettings.hoverSound && (
                      <audio controls className="w-full mt-2">
                        <source src={audioSettings.hoverSound} />
                      </audio>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">Звук при кліку</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioUpload('clickSound', e.target.files?.[0])}
                      className="w-full p-2 border rounded"
                    />
                    {audioSettings.clickSound && (
                      <audio controls className="w-full mt-2">
                        <source src={audioSettings.clickSound} />
                      </audio>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">Звук переходу</label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleAudioUpload('transitionSound', e.target.files?.[0])}
                      className="w-full p-2 border rounded"
                    />
                    {audioSettings.transitionSound && (
                      <audio controls className="w-full mt-2">
                        <source src={audioSettings.transitionSound} />
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Налаштування фону */}
            {activeTab === 'background' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Налаштування фону</h3>
                <div className="text-sm text-gray-600 mb-4 p-3 bg-blue-50 rounded">
                  <p><strong>Зображення:</strong> JPG, PNG, WebP (оптимально 1920x1080px)</p>
                  <p><strong>Відео:</strong> MP4, WebM (H.264 кодек)</p>
                  <p><strong>Розмір:</strong> Рекомендовано до 10MB</p>
                </div>
                
                {/* Фон інтро екрану */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Фон інтро екрану</h4>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Тип фону:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="introBackgroundType"
                          value="color"
                          checked={backgroundSettings.intro.type === 'color'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            intro: { ...backgroundSettings.intro, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Колір
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="introBackgroundType"
                          value="image"
                          checked={backgroundSettings.intro.type === 'image'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            intro: { ...backgroundSettings.intro, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Зображення
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="introBackgroundType"
                          value="video"
                          checked={backgroundSettings.intro.type === 'video'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            intro: { ...backgroundSettings.intro, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Відео
                      </label>
                    </div>
                  </div>
                  
                  {backgroundSettings.intro.type === 'color' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Колір фону:</label>
                      <input
                        type="color"
                        value={backgroundSettings.intro.color}
                        onChange={(e) => setBackgroundSettings({
                          ...backgroundSettings,
                          intro: { ...backgroundSettings.intro, color: e.target.value }
                        })}
                        className="w-full h-10 border rounded"
                      />
                    </div>
                  )}
                  
                  {backgroundSettings.intro.type === 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Зображення фону:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundUpload('intro', 'image', e.target.files?.[0])}
                        className="w-full p-2 border rounded"
                      />
                      {backgroundSettings.intro.image && (
                        <img 
                          src={backgroundSettings.intro.image} 
                          alt="Intro background preview"
                          className="w-full h-32 object-cover mt-2 rounded"
                        />
                      )}
                    </div>
                  )}
                  
                  {backgroundSettings.intro.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Відео фону:</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleBackgroundUpload('intro', 'video', e.target.files?.[0])}
                        className="w-full p-2 border rounded"
                      />
                      {backgroundSettings.intro.video && (
                        <video 
                          src={backgroundSettings.intro.video}
                          controls
                          className="w-full h-32 mt-2 rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Фон головного контенту */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">Фон головного контенту</h4>
                  
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Тип фону:</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mainBackgroundType"
                          value="color"
                          checked={backgroundSettings.main.type === 'color'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            main: { ...backgroundSettings.main, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Колір
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mainBackgroundType"
                          value="image"
                          checked={backgroundSettings.main.type === 'image'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            main: { ...backgroundSettings.main, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Зображення
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="mainBackgroundType"
                          value="video"
                          checked={backgroundSettings.main.type === 'video'}
                          onChange={(e) => setBackgroundSettings({
                            ...backgroundSettings,
                            main: { ...backgroundSettings.main, type: e.target.value }
                          })}
                          className="mr-2"
                        />
                        Відео
                      </label>
                    </div>
                  </div>
                  
                  {backgroundSettings.main.type === 'color' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Колір фону:</label>
                      <input
                        type="color"
                        value={backgroundSettings.main.color}
                        onChange={(e) => setBackgroundSettings({
                          ...backgroundSettings,
                          main: { ...backgroundSettings.main, color: e.target.value }
                        })}
                        className="w-full h-10 border rounded"
                      />
                    </div>
                  )}
                  
                  {backgroundSettings.main.type === 'image' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Зображення фону:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBackgroundUpload('main', 'image', e.target.files?.[0])}
                        className="w-full p-2 border rounded"
                      />
                      {backgroundSettings.main.image && (
                        <img 
                          src={backgroundSettings.main.image} 
                          alt="Main background preview"
                          className="w-full h-32 object-cover mt-2 rounded"
                        />
                      )}
                    </div>
                  )}
                  
                  {backgroundSettings.main.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Відео фону:</label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleBackgroundUpload('main', 'video', e.target.files?.[0])}
                        className="w-full p-2 border rounded"
                      />
                      {backgroundSettings.main.video && (
                        <video 
                          src={backgroundSettings.main.video}
                          controls
                          className="w-full h-32 mt-2 rounded"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Налаштування адміністратора */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Налаштування адміністратора</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Пароль адміністратора</label>
                  <input
                    type="password"
                    value={adminSettings.password}
                    onChange={(e) => setAdminSettings({...adminSettings, password: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* ВІДКЛЮЧЕНО: Показ адмін кнопки контролюється через URL (?admin) */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Показ кнопки адміністратора:</strong><br/>
                    Адмін-панель відображається тільки при додаванні <code>?admin</code> до URL.<br/>
                    Наприклад: <code>http://192.168.1.49:8080/?admin</code>
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoLogout"
                    checked={adminSettings.autoLogout}
                    onChange={(e) => setAdminSettings({...adminSettings, autoLogout: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="autoLogout" className="text-sm">
                    Автоматичний вихід
                  </label>
                </div>
                
                {adminSettings.autoLogout && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Час до автоматичного виходу</label>
                    <select 
                      value={adminSettings.logoutTime}
                      onChange={(e) => setAdminSettings({...adminSettings, logoutTime: parseInt(e.target.value)})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={10}>10 хвилин</option>
                      <option value={30}>30 хвилин</option>
                      <option value={60}>1 година</option>
                      <option value={120}>2 години</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-600">
              Для входу в панель адміністратора натисніть на кнопку ⚙️ та введіть пароль
            </p>
            <button 
              onClick={saveChanges}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              💾 Зберегти зміни
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleAdminPanel; 