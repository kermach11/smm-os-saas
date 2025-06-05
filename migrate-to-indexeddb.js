// Скрипт для повної міграції даних з localStorage в IndexedDB
// Запустіть цей скрипт в консолі браузера для міграції всіх даних

console.log('🚀 Початок повної міграції даних в IndexedDB...');

// Імпортуємо IndexedDBService (якщо доступний)
if (typeof indexedDBService === 'undefined') {
  console.error('❌ IndexedDBService не доступний. Переконайтеся, що сторінка завантажена повністю.');
} else {
  // Виконуємо повну міграцію
  indexedDBService.migrateFromLocalStorage()
    .then(() => {
      console.log('✅ Повна міграція завершена успішно!');
      console.log('📊 Перевіряємо результати...');
      
      // Показуємо статистику
      return Promise.all([
        indexedDBService.loadFiles(),
        indexedDBService.loadSettings('mainPageSettings'),
        indexedDBService.loadSettings('welcomeSettings'),
        indexedDBService.loadSettings('introSettings'),
        indexedDBService.loadSettings('previewSettings'),
        indexedDBService.loadAdminData('adminSession'),
        indexedDBService.loadAnalytics('analyticsData'),
        indexedDBService.loadExperience('immersiveExperienceData')
      ]);
    })
    .then(([files, mainPage, welcome, intro, preview, admin, analytics, experience]) => {
      console.log('📊 Результати міграції:');
      console.log(`   📁 Файлів: ${files.length}`);
      console.log(`   ⚙️ Налаштування головної сторінки: ${mainPage ? 'мігровано' : 'відсутні'}`);
      console.log(`   🎉 Налаштування привітання: ${welcome ? 'мігровано' : 'відсутні'}`);
      console.log(`   📖 Налаштування інтро: ${intro ? 'мігровано' : 'відсутні'}`);
      console.log(`   👁️ Налаштування превью: ${preview ? 'мігровано' : 'відсутні'}`);
      console.log(`   👤 Адмін сесія: ${admin ? 'мігровано' : 'відсутня'}`);
      console.log(`   📈 Аналітика: ${analytics ? 'мігровано' : 'відсутня'}`);
      console.log(`   🌟 Іммерсивний досвід: ${experience ? 'мігровано' : 'відсутній'}`);
      
      console.log('🎉 Міграція завершена! Тепер всі дані зберігаються в IndexedDB.');
      console.log('💡 Рекомендується перезавантажити сторінку для повного переходу на IndexedDB.');
    })
    .catch(error => {
      console.error('❌ Помилка міграції:', error);
      console.log('💡 Спробуйте перезавантажити сторінку та запустити скрипт знову.');
    });
}

// Функція для очищення localStorage після успішної міграції
function clearLocalStorageAfterMigration() {
  const keysToRemove = [
    'smartContentManager_v2',
    'mainPageSettings',
    'welcomeSettings',
    'introSettings',
    'previewSettings',
    'adminSession',
    'adminSettings',
    'analyticsData',
    'clientsData',
    'immersiveExperienceData'
  ];
  
  console.log('🧹 Очищення localStorage після міграції...');
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`   🗑️ Видалено: ${key}`);
    }
  });
  console.log('✅ localStorage очищено!');
}

// Експортуємо функції для ручного використання
window.migrateToIndexedDB = () => {
  if (typeof indexedDBService !== 'undefined') {
    return indexedDBService.migrateFromLocalStorage();
  } else {
    console.error('❌ IndexedDBService не доступний');
  }
};

window.clearLocalStorageAfterMigration = clearLocalStorageAfterMigration;

console.log('💡 Доступні команди:');
console.log('   migrateToIndexedDB() - запустити міграцію');
console.log('   clearLocalStorageAfterMigration() - очистити localStorage після міграції'); 