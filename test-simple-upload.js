// Простий тест завантаження в PocketBase
async function testSimpleUpload() {
  console.log('🧪 Тестуємо простий upload в PocketBase...');
  
  // Створюємо тестовий файл
  const testContent = 'Test file content';
  const testFile = new Blob([testContent], { type: 'text/plain' });
  
  // Створюємо FormData з мінімальними даними
  const formData = new FormData();
  formData.append('file', testFile, 'test.txt');
  
  try {
    const response = await fetch('http://127.0.0.1:8090/api/collections/smm_os_images/records', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Успішно завантажено:', result);
    } else {
      const error = await response.text();
      console.log('❌ Помилка:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Помилка запиту:', error);
  }
}

// Запустити тест
testSimpleUpload();
