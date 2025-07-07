// Скрипт для скидання мобільних позицій до заводських налаштувань
// Запустіть цей скрипт в консолі браузера на мобільному пристрої

async function resetMobilePositions() {
  console.log('🔄 Скидання мобільних позицій до заводських налаштувань...');
  
  try {
    // Відкриваємо базу даних
    const dbRequest = indexedDB.open('SmartContentDB', 1);
    
    dbRequest.onsuccess = function(event) {
      const db = event.target.result;
      
      // Створюємо транзакцію
      const transaction = db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      
      // Отримуємо поточні налаштування
      const getRequest = store.get('boxPositions');
      
      getRequest.onsuccess = function() {
        const result = getRequest.result;
        
        if (result && result.data) {
          const boxPositions = result.data;
          
          // Видаляємо всі мобільні позиції
          const keysToDelete = Object.keys(boxPositions).filter(key => key.includes('_mobile'));
          
          keysToDelete.forEach(key => {
            delete boxPositions[key];
          });
          
          console.log('🗑️ Видалено мобільні позиції:', keysToDelete);
          
          // Зберігаємо оновлені налаштування
          const updatedData = {
            ...result,
            data: boxPositions,
            timestamp: Date.now()
          };
          
          const putRequest = store.put(updatedData);
          
          putRequest.onsuccess = function() {
            console.log('✅ Мобільні позиції успішно скинуті до заводських налаштувань!');
            console.log('🔄 Перезавантажте сторінку для застосування змін');
            
            // Автоматично перезавантажуємо сторінку
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          };
          
          putRequest.onerror = function() {
            console.error('❌ Помилка збереження:', putRequest.error);
          };
        } else {
          console.log('ℹ️ Налаштування позицій не знайдено');
        }
      };
      
      getRequest.onerror = function() {
        console.error('❌ Помилка отримання налаштувань:', getRequest.error);
      };
    };
    
    dbRequest.onerror = function() {
      console.error('❌ Помилка відкриття бази даних:', dbRequest.error);
    };
    
  } catch (error) {
    console.error('❌ Помилка скидання позицій:', error);
  }
}

// Запускаємо скрипт
resetMobilePositions(); 