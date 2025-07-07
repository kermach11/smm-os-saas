// Простий скрипт для консолі браузера - скопіюйте і вставте в консоль на мобільному пристрої

(function() {
  console.log('🔄 Скидання мобільних позицій...');
  
  // Відкриваємо IndexedDB
  const request = indexedDB.open('SmartContentDB', 1);
  
  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    // Отримуємо boxPositions
    const getRequest = store.get('boxPositions');
    
    getRequest.onsuccess = function() {
      const result = getRequest.result;
      
      if (result && result.data) {
        const boxPositions = result.data;
        
        // Знаходимо і видаляємо всі мобільні ключі
        const mobileKeys = Object.keys(boxPositions).filter(key => key.includes('_mobile'));
        
        mobileKeys.forEach(key => {
          delete boxPositions[key];
        });
        
        console.log('🗑️ Видалено:', mobileKeys);
        
        // Зберігаємо
        const putRequest = store.put({
          ...result,
          data: boxPositions,
          timestamp: Date.now()
        });
        
        putRequest.onsuccess = function() {
          console.log('✅ Готово! Перезавантажуємо сторінку...');
          setTimeout(() => window.location.reload(), 1000);
        };
        
      } else {
        console.log('ℹ️ Позиції не знайдено');
      }
    };
  };
  
  request.onerror = function() {
    console.error('❌ Помилка відкриття бази даних');
  };
})();

// Функция для очистки админ-настроек из localStorage
function clearAdminSettings() {
  try {
    // Очищаем настройки showAdminButton из localStorage
    const savedData = localStorage.getItem('immersiveExperienceData');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.adminSettings?.showAdminButton) {
        delete data.adminSettings.showAdminButton;
        localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
        console.log('🔧 Очищено неправильную настройку showAdminButton из localStorage');
      }
    }
    
    // Очищаем админ-сессию если она есть
    if (localStorage.getItem('adminSession')) {
      localStorage.removeItem('adminSession');
      console.log('🔧 Очищена админ-сессия');
    }
    
    console.log('✅ Админ-настройки очищены. Перезагрузите страницу.');
  } catch (error) {
    console.error('❌ Ошибка при очистке админ-настроек:', error);
  }
} 