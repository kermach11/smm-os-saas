// PocketBase Setup Script для Hetzner VPS
// Ідентичні налаштування до Supabase для повної сумісності

const PB_URL = process.env.POCKETBASE_URL || 'http://your-server.com:8090';
const PB_ADMIN_EMAIL = process.env.POCKETBASE_ADMIN_EMAIL || 'admin@example.com';
const PB_ADMIN_PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD || 'your-secure-password';

class PocketBaseSetup {
  constructor() {
    this.baseUrl = PB_URL;
    this.adminEmail = PB_ADMIN_EMAIL;
    this.adminPassword = PB_ADMIN_PASSWORD;
    this.authToken = null;
  }

  // Логування з кольорами
  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    const color = colors[type] || colors.info;
    console.log(`${color}[PocketBaseSetup] ${message}${colors.reset}`);
  }

  // Перевірка доступності сервера
  async checkServer() {
    try {
      this.log('Перевірка доступності PocketBase сервера...');
      
      const response = await fetch(`${this.baseUrl}/api/health`);
      
      if (response.ok) {
        this.log('✅ PocketBase сервер доступний', 'success');
        return true;
      } else {
        this.log(`❌ PocketBase сервер відповів з помилкою: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Не можу підключитися до PocketBase сервера: ${error.message}`, 'error');
      return false;
    }
  }

  // Авторизація адміністратора
  async authenticateAdmin() {
    try {
      this.log('Авторизація адміністратора...');
      
      const response = await fetch(`${this.baseUrl}/api/admins/auth-with-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identity: this.adminEmail,
          password: this.adminPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.token;
        this.log('✅ Успішна авторизація адміністратора', 'success');
        return true;
      } else {
        const errorText = await response.text();
        this.log(`❌ Помилка авторизації: ${response.status} - ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Помилка авторизації: ${error.message}`, 'error');
      return false;
    }
  }

  // Створення collection
  async createCollection(collectionData) {
    try {
      this.log(`Створення collection: ${collectionData.name}...`);
      
      const response = await fetch(`${this.baseUrl}/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(collectionData)
      });

      if (response.ok) {
        this.log(`✅ Collection ${collectionData.name} створено`, 'success');
        return true;
      } else {
        const errorText = await response.text();
        
        // Якщо collection вже існує, це не помилка
        if (response.status === 400 && errorText.includes('already exists')) {
          this.log(`⚠️ Collection ${collectionData.name} вже існує`, 'warning');
          return true;
        }
        
        this.log(`❌ Помилка створення collection ${collectionData.name}: ${response.status} - ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Помилка створення collection ${collectionData.name}: ${error.message}`, 'error');
      return false;
    }
  }

  // Отримання схеми для медіа collection (ідентичної до Supabase buckets)
  getMediaCollectionSchema(name, type) {
    return {
      name: name,
      type: 'base',
      schema: [
        {
          name: 'file',
          type: 'file',
          required: true,
          options: {
            maxSelect: 1,
            maxSize: type === 'videos' ? 100000000 : 50000000, // Як в Supabase
            mimeTypes: this.getMimeTypes(type),
            thumbs: type === 'images' ? ['100x100', '300x300', '800x600'] : []
          }
        },
        {
          name: 'site_id',
          type: 'text',
          required: true,
          options: {
            min: 1,
            max: 255
          }
        },
        {
          name: 'original_name',
          type: 'text',
          required: true,
          options: {
            min: 1,
            max: 255
          }
        },
        {
          name: 'file_type',
          type: 'select',
          required: true,
          options: {
            maxSelect: 1,
            values: ['image', 'video', 'audio', 'document']
          }
        },
        {
          name: 'file_size',
          type: 'number',
          required: false
        },
        {
          name: 'mime_type',
          type: 'text',
          required: false,
          options: {
            max: 100
          }
        },
        {
          name: 'file_path',
          type: 'text',
          required: false,
          options: {
            max: 500
          }
        }
      ],
      indexes: [
        'CREATE INDEX idx_site_id ON ' + name + ' (site_id)',
        'CREATE INDEX idx_file_type ON ' + name + ' (file_type)',
        'CREATE INDEX idx_file_path ON ' + name + ' (file_path)'
      ],
      listRule: '', // Публічний доступ як в Supabase
      viewRule: '', 
      createRule: '', 
      updateRule: '', 
      deleteRule: ''
    };
  }

  // Отримання MIME типів (ідентичних до Supabase)
  getMimeTypes(type) {
    const mimeTypes = {
      images: [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'image/gif',
        'image/avif'
      ],
      videos: [
        'video/mp4',
        'video/webm',
        'video/quicktime'
      ],
      audio: [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp4'
      ],
      documents: [
        'application/pdf',
        'text/plain'
      ]
    };
    
    return mimeTypes[type] || [];
  }

  // Створення всіх медіа collections (ідентичних до Supabase buckets)
  async createMediaCollections() {
    const collections = [
      { name: 'smm-os-images', type: 'images' },
      { name: 'smm-os-videos', type: 'videos' },
      { name: 'smm-os-audio', type: 'audio' },
      { name: 'smm-os-documents', type: 'documents' }
    ];

    let successCount = 0;
    
    for (const collection of collections) {
      const schema = this.getMediaCollectionSchema(collection.name, collection.type);
      const success = await this.createCollection(schema);
      
      if (success) {
        successCount++;
      }
      
      // Невелика затримка між створенням collections
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.log(`Створено ${successCount}/${collections.length} collections`, successCount === collections.length ? 'success' : 'warning');
    return successCount === collections.length;
  }

  // Перевірка існування collections
  async checkCollections() {
    try {
      this.log('Перевірка існування collections...');
      
      const response = await fetch(`${this.baseUrl}/api/collections`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const existingCollections = data.items.map(item => item.name);
        
        const requiredCollections = [
          'smm-os-images',
          'smm-os-videos', 
          'smm-os-audio',
          'smm-os-documents'
        ];
        
        const missingCollections = requiredCollections.filter(name => !existingCollections.includes(name));
        
        if (missingCollections.length === 0) {
          this.log('✅ Всі необхідні collections існують', 'success');
          return true;
        } else {
          this.log(`⚠️ Відсутні collections: ${missingCollections.join(', ')}`, 'warning');
          return false;
        }
      } else {
        this.log(`❌ Помилка отримання списку collections: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Помилка перевірки collections: ${error.message}`, 'error');
      return false;
    }
  }

  // Тестування завантаження файлу
  async testFileUpload() {
    try {
      this.log('Тестування завантаження файлу...');
      
      // Створюємо тестовий файл
      const testContent = 'PocketBase test file content - ідентичний до Supabase';
      const testFile = new Blob([testContent], { type: 'text/plain' });
      
      const formData = new FormData();
      formData.append('file', testFile, 'test-file.txt');
      formData.append('site_id', 'test-site');
      formData.append('original_name', 'test-file.txt');
      formData.append('file_type', 'document');
      formData.append('file_size', testFile.size.toString());
      formData.append('mime_type', 'text/plain');
      formData.append('file_path', 'test-site/document/test-file.txt');
      
      const response = await fetch(`${this.baseUrl}/api/collections/smm-os-documents/records`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        this.log('✅ Тестове завантаження файлу успішне', 'success');
        
        // Видаляємо тестовий файл
        await fetch(`${this.baseUrl}/api/collections/smm-os-documents/records/${result.id}`, {
          method: 'DELETE'
        });
        
        return true;
      } else {
        const errorText = await response.text();
        this.log(`❌ Помилка тестового завантаження: ${response.status} - ${errorText}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Помилка тестового завантаження: ${error.message}`, 'error');
      return false;
    }
  }

  // Генерація конфігураційного файлу (ідентичного до Supabase)
  generateConfigFile() {
    const config = {
      // Environment variables для .env (ідентичні до Supabase)
      env: {
        VITE_POCKETBASE_URL: this.baseUrl,
        VITE_POCKETBASE_ANON_KEY: 'public', // PocketBase не потребує ключа
      },
      
      // Collections info (ідентичні назви до Supabase buckets)
      buckets: {
        images: 'smm-os-images',
        videos: 'smm-os-videos',
        audio: 'smm-os-audio',
        documents: 'smm-os-documents'
      },
      
      // Інструкції для додавання в .env файл
      envInstructions: [
        '# Додайте ці змінні в ваш .env файл:',
        `VITE_POCKETBASE_URL=${this.baseUrl}`,
        'VITE_POCKETBASE_ANON_KEY=public',
        '',
        '# PocketBase буде працювати ідентично до Supabase!',
        '# Той самий код, ті самі методи, повна сумісність.'
      ]
    };
    
    this.log('\n📋 Конфігурація PocketBase (Supabase-сумісна):', 'info');
    console.log(JSON.stringify(config, null, 2));
    
    this.log('\n📝 Інструкції для інтеграції:', 'info');
    config.envInstructions.forEach(line => console.log(line));
    
    return config;
  }

  // Основний метод налаштування
  async setup() {
    this.log('🚀 Початок налаштування PocketBase (Supabase-сумісний)...', 'info');
    
    // 1. Перевірка сервера
    const serverOk = await this.checkServer();
    if (!serverOk) {
      this.log('❌ Не можу продовжити без доступного сервера', 'error');
      return false;
    }
    
    // 2. Авторизація
    const authOk = await this.authenticateAdmin();
    if (!authOk) {
      this.log('❌ Не можу продовжити без авторизації', 'error');
      return false;
    }
    
    // 3. Перевірка існуючих collections
    const collectionsExist = await this.checkCollections();
    
    // 4. Створення collections якщо потрібно
    if (!collectionsExist) {
      const collectionsOk = await this.createMediaCollections();
      if (!collectionsOk) {
        this.log('❌ Не вдалося створити всі collections', 'error');
        return false;
      }
    }
    
    // 5. Тестування завантаження
    const uploadOk = await this.testFileUpload();
    if (!uploadOk) {
      this.log('⚠️ Тестове завантаження не вдалося, але setup продовжується', 'warning');
    }
    
    // 6. Генерація конфігурації
    this.generateConfigFile();
    
    this.log('✅ Налаштування PocketBase завершено успішно!', 'success');
    this.log('🎯 PocketBase тепер працює ідентично до Supabase Storage!', 'success');
    return true;
  }
}

// Запуск setup якщо файл викликається напряму
if (import.meta.url === `file://${process.argv[1]}`) {
  const setup = new PocketBaseSetup();
  setup.setup().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Критична помилка:', error);
    process.exit(1);
  });
}

export default PocketBaseSetup;
