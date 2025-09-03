// Скрипт для перевірки налаштування environment змінних
// Запуск: node check-env.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnvironmentChecker {
  constructor() {
    this.requiredVars = [
      'VITE_POCKETBASE_URL',
      'VITE_POCKETBASE_ANON_KEY'
    ];
    
    this.optionalVars = [
      'POCKETBASE_ADMIN_EMAIL',
      'POCKETBASE_ADMIN_PASSWORD',
      'VITE_DEFAULT_STORAGE_PROVIDER'
    ];
    
    this.existingSupabaseVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',    
      success: '\x1b[32m', 
      warning: '\x1b[33m', 
      error: '\x1b[31m',   
      reset: '\x1b[0m'     
    };
    
    const color = colors[type] || colors.info;
    console.log(`${color}[EnvChecker] ${message}${colors.reset}`);
  }

  // Читання .env файлу
  readEnvFile() {
    const envPath = path.join(__dirname, '.env.local');
    
    if (!fs.existsSync(envPath)) {
      this.log('❌ .env файл не знайдено!', 'error');
      this.log('📝 Створіть .env файл в корені проекту', 'info');
      return null;
    }

    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = {};
      
      envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
          }
        }
      });
      
      return envVars;
    } catch (error) {
      this.log(`❌ Помилка читання .env файлу: ${error.message}`, 'error');
      return null;
    }
  }

  // Перевірка обов'язкових змінних
  checkRequiredVars(envVars) {
    let allPresent = true;
    
    this.log('🔍 Перевірка обов\'язкових змінних для PocketBase:', 'info');
    
    this.requiredVars.forEach(varName => {
      if (envVars[varName]) {
        if (envVars[varName] === 'http://your-server.com:8090' || 
            envVars[varName] === 'your-server.com' ||
            envVars[varName].includes('your-server')) {
          this.log(`⚠️ ${varName}: потребує заміни placeholder значення`, 'warning');
          this.log(`   Поточне: ${envVars[varName]}`, 'warning');
          allPresent = false;
        } else {
          this.log(`✅ ${varName}: ${envVars[varName]}`, 'success');
        }
      } else {
        this.log(`❌ ${varName}: не знайдено`, 'error');
        allPresent = false;
      }
    });
    
    return allPresent;
  }

  // Перевірка опціональних змінних
  checkOptionalVars(envVars) {
    this.log('\n🔍 Перевірка опціональних змінних:', 'info');
    
    this.optionalVars.forEach(varName => {
      if (envVars[varName]) {
        if (envVars[varName].includes('example.com') || 
            envVars[varName].includes('your-')) {
          this.log(`⚠️ ${varName}: рекомендується замінити placeholder`, 'warning');
          this.log(`   Поточне: ${envVars[varName]}`, 'warning');
        } else {
          this.log(`✅ ${varName}: налаштовано`, 'success');
        }
      } else {
        this.log(`ℹ️ ${varName}: не встановлено (опціонально)`, 'info');
      }
    });
  }

  // Перевірка існуючих Supabase налаштувань
  checkExistingSupabase(envVars) {
    this.log('\n🔍 Перевірка існуючих Supabase налаштувань:', 'info');
    
    let hasSupabase = false;
    
    this.existingSupabaseVars.forEach(varName => {
      if (envVars[varName]) {
        this.log(`✅ ${varName}: налаштовано`, 'success');
        hasSupabase = true;
      } else {
        this.log(`ℹ️ ${varName}: не знайдено`, 'info');
      }
    });
    
    if (hasSupabase) {
      this.log('🎯 Supabase налаштування знайдено - можна використовувати dual-mode!', 'success');
    } else {
      this.log('📝 Supabase не налаштовано - буде використовуватися тільки PocketBase', 'info');
    }
    
    return hasSupabase;
  }

  // Тестування URL доступності
  async testPocketBaseConnection(url) {
    if (!url || url.includes('your-server')) {
      this.log('⚠️ PocketBase URL містить placeholder - пропускаємо тест підключення', 'warning');
      return false;
    }

    this.log(`🌐 Тестування підключення до: ${url}`, 'info');
    
    try {
      const response = await fetch(`${url}/api/health`, { 
        timeout: 5000 
      });
      
      if (response.ok) {
        this.log('✅ PocketBase сервер доступний!', 'success');
        return true;
      } else {
        this.log(`❌ PocketBase сервер відповів з помилкою: ${response.status}`, 'error');
        return false;
      }
    } catch (error) {
      this.log(`❌ Не вдалося підключитися до PocketBase: ${error.message}`, 'error');
      this.log('💡 Переконайтеся що PocketBase запущений на сервері', 'info');
      return false;
    }
  }

  // Генерація рекомендацій
  generateRecommendations(envVars, hasRequiredVars, hasSupabase, connectionWorking) {
    this.log('\n📋 Рекомендації:', 'info');
    
    if (!hasRequiredVars) {
      this.log('1. Налаштуйте обов\'язкові змінні в .env файлі', 'warning');
      this.log('   Скопіюйте з env.pocketbase.example та замініть placeholder значення', 'info');
    }
    
    if (!connectionWorking) {
      this.log('2. Налаштуйте PocketBase сервер на Hetzner VPS', 'warning');
      this.log('   Дивіться POCKETBASE_SETUP_GUIDE.md для інструкцій', 'info');
    }
    
    if (hasRequiredVars && connectionWorking) {
      this.log('3. Запустіть setup скрипт: node pocketbase-setup.js', 'success');
    }
    
    if (hasSupabase) {
      this.log('4. Налаштуйте VITE_DEFAULT_STORAGE_PROVIDER для автоматичного вибору', 'info');
    }
    
    this.log('5. Протестуйте функціонал з PocketBaseTestPage компонентом', 'info');
  }

  // Головний метод перевірки
  async check() {
    this.log('🚀 Початок перевірки environment налаштувань для PocketBase', 'info');
    this.log('=' * 60, 'info');
    
    // Читання .env файлу
    const envVars = this.readEnvFile();
    if (!envVars) {
      return false;
    }
    
    // Перевірка змінних
    const hasRequiredVars = this.checkRequiredVars(envVars);
    this.checkOptionalVars(envVars);
    const hasSupabase = this.checkExistingSupabase(envVars);
    
    // Тестування підключення
    let connectionWorking = false;
    if (envVars['VITE_POCKETBASE_URL']) {
      connectionWorking = await this.testPocketBaseConnection(envVars['VITE_POCKETBASE_URL']);
    }
    
    // Підсумок
    this.log('\n📊 Підсумок перевірки:', 'info');
    this.log(`Environment файл: ${envVars ? '✅' : '❌'}`, envVars ? 'success' : 'error');
    this.log(`Обов'язкові змінні: ${hasRequiredVars ? '✅' : '❌'}`, hasRequiredVars ? 'success' : 'error');
    this.log(`PocketBase підключення: ${connectionWorking ? '✅' : '❌'}`, connectionWorking ? 'success' : 'error');
    this.log(`Supabase налаштування: ${hasSupabase ? '✅' : 'ℹ️'}`, hasSupabase ? 'success' : 'info');
    
    // Рекомендації
    this.generateRecommendations(envVars, hasRequiredVars, hasSupabase, connectionWorking);
    
    const isReady = hasRequiredVars && connectionWorking;
    
    this.log(`\n🎯 Статус готовності: ${isReady ? 'ГОТОВО ДО НАСТУПНОГО ЕТАПУ!' : 'ПОТРЕБУЄ НАЛАШТУВАННЯ'}`, 
            isReady ? 'success' : 'warning');
    
    return isReady;
  }
}

// Запуск перевірки (завжди запускаємо коли імпортується)
const checker = new EnvironmentChecker();
checker.check().then(isReady => {
  process.exit(isReady ? 0 : 1);
}).catch(error => {
  console.error('Критична помилка:', error);
  process.exit(1);
});

export default EnvironmentChecker;
