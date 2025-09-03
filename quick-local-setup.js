// Швидке налаштування локального PocketBase
const PB_URL = 'http://127.0.0.1:8090';

async function quickSetup() {
  console.log('🚀 Швидке налаштування локального PocketBase...');
  
  // Перевіримо чи сервер доступний
  try {
    const response = await fetch(`${PB_URL}/api/health`);
    if (!response.ok) {
      console.log('❌ PocketBase сервер недоступний');
      return;
    }
    console.log('✅ PocketBase сервер працює');
  } catch (error) {
    console.log('❌ Помилка підключення до PocketBase:', error.message);
    return;
  }

  // Створимо колекції без авторизації (публічні)
  const collections = [
    'smm_os_images',
    'smm_os_videos', 
    'smm_os_audio',
    'smm_os_documents'
  ];

  for (const name of collections) {
    try {
      const collectionData = {
        name: name,
        type: 'base',
        schema: [
          {
            name: 'file',
            type: 'file',
            required: true,
            options: {
              maxSelect: 1,
              maxSize: 50000000,
              mimeTypes: []
            }
          },
          {
            name: 'site_id',
            type: 'text',
            required: false
          },
          {
            name: 'original_name',
            type: 'text',
            required: false
          },
          {
            name: 'file_type',
            type: 'text',
            required: false
          },
          {
            name: 'file_size',
            type: 'number',
            required: false
          },
          {
            name: 'mime_type',
            type: 'text',
            required: false
          },
          {
            name: 'file_path',
            type: 'text',
            required: false
          }
        ],
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: ''
      };

      console.log(`Створюю колекцію: ${name}...`);
      
      // Спробуємо створити без авторизації
      const response = await fetch(`${PB_URL}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(collectionData)
      });

      if (response.ok) {
        console.log(`✅ Колекція ${name} створена`);
      } else {
        const error = await response.text();
        console.log(`❌ Помилка створення ${name}: ${error}`);
      }
    } catch (error) {
      console.log(`❌ Помилка: ${error.message}`);
    }
  }
  
  console.log('🎯 Налаштування завершено! Спробуйте завантажити файли знову.');
}

quickSetup();
