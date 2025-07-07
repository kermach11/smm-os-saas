// Скрипт для отладки localStorage и очистки админ-настроек
console.log('🔍 === ПРОВЕРКА LOCALSTORAGE ===');

// Проверяем immersiveExperienceData
const immersiveData = localStorage.getItem('immersiveExperienceData');
console.log('immersiveExperienceData:', immersiveData);

if (immersiveData) {
  try {
    const data = JSON.parse(immersiveData);
    console.log('📊 Parsed data:', data);
    
    if (data.adminSettings) {
      console.log('⚙️ Admin settings found:', data.adminSettings);
      
      if (data.adminSettings.showAdminButton) {
        console.log('🔧 showAdminButton is TRUE - это может быть проблема!');
        console.log('Очищаю showAdminButton...');
        
        delete data.adminSettings.showAdminButton;
        localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
        console.log('✅ showAdminButton очищен');
      }
    }
  } catch (error) {
    console.error('❌ Ошибка парсинга immersiveExperienceData:', error);
  }
}

// Проверяем adminSession
const adminSession = localStorage.getItem('adminSession');
console.log('adminSession:', adminSession);

if (adminSession) {
  console.log('Очищаю adminSession...');
  localStorage.removeItem('adminSession');
  console.log('✅ adminSession очищен');
}

// Проверяем все ключи localStorage
console.log('🔍 === ВСЕ КЛЮЧИ В LOCALSTORAGE ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`${key}: ${localStorage.getItem(key)}`);
}

console.log('🔄 Перезагрузите страницу после очистки!'); 