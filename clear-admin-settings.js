// СКРИПТ ДЛЯ ОЧИСТКИ АДМИН-НАСТРОЕК
// Запустите в консоли браузера на странице http://192.168.1.49:8080

console.log('🧹 === ОЧИСТКА АДМИН-НАСТРОЕК ===');

// Функция для очистки showAdminButton из всех возможных мест
function clearAdminButtonSettings() {
  let changesCount = 0;
  
  // 1. Очищаем immersiveExperienceData
  try {
    const immersiveData = localStorage.getItem('immersiveExperienceData');
    if (immersiveData) {
      const data = JSON.parse(immersiveData);
      
      if (data.adminSettings?.showAdminButton) {
        console.log('🔧 Найдено showAdminButton в immersiveExperienceData');
        delete data.adminSettings.showAdminButton;
        localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
        changesCount++;
        console.log('✅ Очищено showAdminButton из immersiveExperienceData');
      }
    }
  } catch (error) {
    console.error('❌ Ошибка очистки immersiveExperienceData:', error);
  }
  
  // 2. Очищаем adminSession
  if (localStorage.getItem('adminSession')) {
    localStorage.removeItem('adminSession');
    changesCount++;
    console.log('✅ Очищена adminSession');
  }
  
  // 3. Проверяем другие возможные ключи
  const keysToCheck = [
    'adminSettings',
    'simpleAdminSettings', 
    'adminPanelSettings',
    'userSettings'
  ];
  
  keysToCheck.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.showAdminButton) {
          delete parsed.showAdminButton;
          localStorage.setItem(key, JSON.stringify(parsed));
          changesCount++;
          console.log(`✅ Очищено showAdminButton из ${key}`);
        }
      }
    } catch (error) {
      // Игнорируем ошибки парсинга для несуществующих ключей
    }
  });
  
  return changesCount;
}

// Выполняем очистку
const changes = clearAdminButtonSettings();

if (changes > 0) {
  console.log(`🎉 Внесено ${changes} изменений в localStorage`);
  console.log('🔄 ПЕРЕЗАГРУЗИТЕ СТРАНИЦУ для применения изменений');
  console.log('');
  console.log('Теперь проверьте:');
  console.log('❌ http://192.168.1.49:8080 - НЕ должно быть админ-кнопки');
  console.log('✅ http://192.168.1.49:8080/?admin - ДОЛЖНА быть админ-кнопка');
} else {
  console.log('ℹ️ Никаких изменений не требуется - админ-настройки уже корректны');
}

console.log('');
console.log('🔍 === СОСТОЯНИЕ ПОСЛЕ ОЧИСТКИ ===');
console.log('immersiveExperienceData:', localStorage.getItem('immersiveExperienceData'));
console.log('adminSession:', localStorage.getItem('adminSession')); 