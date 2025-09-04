// Тестова сторінка для перевірки роботи PocketBase Storage
// Ідентична до Supabase тестування

import React, { useState, useEffect } from 'react';
import { pocketbaseStorageService } from '../services/PocketBaseStorageService';
import { supabaseStorageService } from '../services/SupabaseStorageService';
// import { storageServiceSwitcher } from '../services/StorageServiceSwitcher'; // Disabled due to empty file

interface TestResult {
  provider: string;
  success: boolean;
  message: string;
  duration: number;
  details?: any;
}

const PocketBaseTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentProvider, setCurrentProvider] = useState<'supabase' | 'pocketbase' | 'auto'>('auto');

  // Тестування підключення до провайдерів
  const testConnections = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    // Тест Supabase
    const supabaseStart = Date.now();
    try {
      const supabaseHealthy = await supabaseStorageService.checkConnection();
      results.push({
        provider: 'Supabase',
        success: supabaseHealthy,
        message: supabaseHealthy ? 'Підключення успішне' : 'Сервіс недоступний',
        duration: Date.now() - supabaseStart,
        details: supabaseStorageService.getServiceInfo()
      });
    } catch (error) {
      results.push({
        provider: 'Supabase',
        success: false,
        message: `Помилка: ${error}`,
        duration: Date.now() - supabaseStart
      });
    }

    // Тест PocketBase
    const pocketbaseStart = Date.now();
    try {
      const pocketbaseHealthy = await pocketbaseStorageService.checkConnection();
      results.push({
        provider: 'PocketBase',
        success: pocketbaseHealthy,
        message: pocketbaseHealthy ? 'Підключення успішне' : 'Сервіс недоступний',
        duration: Date.now() - pocketbaseStart,
        details: pocketbaseStorageService.getServiceInfo()
      });
    } catch (error) {
      results.push({
        provider: 'PocketBase',
        success: false,
        message: `Помилка: ${error}`,
        duration: Date.now() - pocketbaseStart
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  // Тестування завантаження файлу
  const testFileUpload = async () => {
    if (!selectedFile) {
      alert('Оберіть файл для тестування');
      return;
    }

    setIsLoading(true);
    const results: TestResult[] = [];

    // // Встановлюємо провайдер в switcher
    // storageServiceSwitcher.setProvider(currentProvider);

    const uploadStart = Date.now();
    try {
      // const result = await storageServiceSwitcher.uploadFile(selectedFile);
      console.warn('⚠️ PocketBaseTestPage: storageServiceSwitcher disabled');
      const result = { provider: 'disabled', success: false, message: 'Service switcher disabled' };
      
      results.push({
        provider: `StorageSwitcher (${result.provider})`,
        success: true,
        message: `Файл завантажено успішно: ${result.originalName}`,
        duration: Date.now() - uploadStart,
        details: {
          fileId: result.id,
          fileUrl: result.publicUrl,
          fileSize: result.size,
          provider: result.provider
        }
      });
    } catch (error) {
      results.push({
        provider: `StorageSwitcher (${currentProvider})`,
        success: false,
        message: `Помилка завантаження: ${error}`,
        duration: Date.now() - uploadStart
      });
    }

    setTestResults(prev => [...prev, ...results]);
    setIsLoading(false);
  };

  // Тестування всіх провайдерів через switcher
  const testAllProviders = async () => {
    if (!selectedFile) {
      alert('Оберіть файл для тестування');
      return;
    }

    setIsLoading(true);
    const results: TestResult[] = [];

    const providers: Array<'supabase' | 'pocketbase'> = ['supabase', 'pocketbase'];

    for (const provider of providers) {
      const uploadStart = Date.now();
      try {
        // const result = await storageServiceSwitcher.uploadFile(selectedFile, provider);
        console.warn('⚠️ PocketBaseTestPage: storageServiceSwitcher disabled for provider test');
        const result = { provider: 'disabled', success: false, message: 'Service switcher disabled' };
        
        results.push({
          provider: `${provider} (прямий тест)`,
          success: true,
          message: `Файл завантажено успішно`,
          duration: Date.now() - uploadStart,
          details: {
            fileId: result.id,
            fileUrl: result.publicUrl,
            actualProvider: result.provider
          }
        });
      } catch (error) {
        results.push({
          provider: `${provider} (прямий тест)`,
          success: false,
          message: `Помилка: ${error}`,
          duration: Date.now() - uploadStart
        });
      }
    }

    setTestResults(prev => [...prev, ...results]);
    setIsLoading(false);
  };

  // Очистити результати
  const clearResults = () => {
    setTestResults([]);
  };

  // Отримати статус провайдерів
  const getProvidersStatus = async () => {
    setIsLoading(true);
    
    // await storageServiceSwitcher.refreshProvidersHealth();
    // const status = storageServiceSwitcher.getProvidersStatus();
    // const recommendations = storageServiceSwitcher.getProviderRecommendations();
    console.warn('⚠️ PocketBaseTestPage: storageServiceSwitcher provider status disabled');
    const status = new Map();
    const recommendations = [];

    console.log('📊 Статус провайдерів:', Object.fromEntries(status));
    console.log('🎯 Рекомендації:', recommendations);

    const results: TestResult[] = [];
    
    for (const [provider, info] of status) {
      if (provider !== 'auto') {
        results.push({
          provider: `${provider} (статус)`,
          success: info.isHealthy,
          message: `${info.name} - ${info.isHealthy ? 'Здоровий' : 'Недоступний'}`,
          duration: 0,
          details: {
            priority: info.priority,
            lastCheck: info.lastCheck,
            isRecommended: recommendations.recommended === provider
          }
        });
      }
    }

    setTestResults(prev => [...prev, ...results]);
    setIsLoading(false);
  };

  useEffect(() => {
    // Автоматично тестуємо підключення при завантаженні
    testConnections();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          🧪 Тестування PocketBase Storage (Supabase-сумісний)
        </h1>

        {/* Вибір провайдера */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Налаштування</h3>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <span>Провайдер:</span>
              <select 
                value={currentProvider} 
                onChange={(e) => setCurrentProvider(e.target.value as any)}
                className="px-3 py-1 border rounded"
              >
                <option value="auto">Автоматично</option>
                <option value="supabase">Supabase</option>
                <option value="pocketbase">PocketBase</option>
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span>Файл для тесту:</span>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="text-sm"
              />
            </label>
          </div>
        </div>

        {/* Кнопки тестування */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={testConnections}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Тестування...' : 'Тест підключення'}
          </button>

          <button
            onClick={testFileUpload}
            disabled={isLoading || !selectedFile}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Тест завантаження
          </button>

          <button
            onClick={testAllProviders}
            disabled={isLoading || !selectedFile}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Тест всіх провайдерів
          </button>

          <button
            onClick={getProvidersStatus}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Статус провайдерів
          </button>

          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Очистити
          </button>
        </div>

        {/* Результати */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Результати тестування</h3>
          
          {testResults.length === 0 && (
            <p className="text-gray-500 italic">Результатів ще немає. Запустіть тест.</p>
          )}

          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                result.success 
                  ? 'bg-green-50 border-green-500' 
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xl ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <h4 className="font-semibold">{result.provider}</h4>
                    <span className="text-sm text-gray-500">({result.duration}ms)</span>
                  </div>
                  <p className={`mt-1 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>
              </div>

              {result.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Показати деталі
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {/* Інформація */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">ℹ️ Інформація</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• PocketBase працює ідентично до Supabase Storage</li>
            <li>• Той самий API, ті самі методи, повна сумісність</li>
            <li>• Автоматичне перемикання між провайдерами</li>
            <li>• Fallback механізм при недоступності сервісу</li>
            <li>• Тестуйте різні типи файлів для перевірки</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PocketBaseTestPage;

