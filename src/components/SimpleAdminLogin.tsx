import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SimpleAdminLoginProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SimpleAdminLogin: React.FC<SimpleAdminLoginProps> = ({ isVisible, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getAdminPassword = (): string => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings?.password) {
          return data.adminSettings.password;
        }
      }
    } catch (error) {
      console.error('Помилка при зчитуванні пароля:', error);
    }
    return 'admin123'; // Пароль за замовчуванням
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Введіть пароль!');
      return;
    }

    setIsLoading(true);
    setError('');

    // Імітуємо затримку для перевірки пароля
    setTimeout(() => {
      const correctPassword = getAdminPassword();
      
      if (password === correctPassword) {
        // Зберігаємо сесію
        const now = new Date().getTime();
        const expiry = now + 30 * 60 * 1000; // 30 хвилин
        
        const sessionData = {
          timestamp: now,
          expiry: expiry
        };
        
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        onLogin();
        setPassword('');
      } else {
        setError('Невірний пароль. Спробуйте ще раз.');
      }
      
      setIsLoading(false);
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h2 className="text-xl font-semibold">Вхід в панель адміністратора</h2>
            <p className="text-gray-600 mt-2">Введіть пароль для доступу до налаштувань</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Пароль адміністратора
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введіть пароль"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Скасувати
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Перевірка...
                  </>
                ) : (
                  'Увійти'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              Стандартний пароль: <code className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">admin123</code>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleAdminLogin; 