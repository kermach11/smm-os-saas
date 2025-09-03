// Простий тест для перевірки .env файлу
import fs from 'fs';

console.log('🔍 Простий тест .env.local файлу');

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('📄 Вміст файлу:');
  console.log(envContent);
  
  console.log('\n🔍 Пошук PocketBase змінних:');
  const lines = envContent.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('VITE_POCKETBASE') || line.includes('POCKETBASE_ADMIN')) {
      console.log(`Лінія ${index + 1}: ${line}`);
    }
  });
  
  // Парсимо змінні
  const envVars = {};
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  console.log('\n📋 Знайдені змінні:');
  Object.entries(envVars).forEach(([key, value]) => {
    if (key.includes('POCKET')) {
      console.log(`${key}: ${value}`);
    }
  });
  
} catch (error) {
  console.error('❌ Помилка:', error);
}

