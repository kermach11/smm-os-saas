import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

interface SimpleAdminLoginProps {
  isVisible: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const SimpleAdminLogin: React.FC<SimpleAdminLoginProps> = ({ isVisible, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { t } = useTranslation();

  const getAdminCredentials = (): { login: string; password: string } => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings) {
          return {
            login: data.adminSettings.login || 'admin',
            password: data.adminSettings.password || 'admin123'
          };
        }
      }
    } catch (error) {
      console.error('Помилка при зчитуванні даних:', error);
    }
    return { login: 'admin', password: 'admin123' }; // Дані за замовчуванням
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError(t('login.error.username'));
      return;
    }
    
    if (!password.trim()) {
      setError(t('login.error.password'));
      return;
    }

    setIsLoading(true);
    setError('');

    // Імітуємо затримку для перевірки даних
    setTimeout(() => {
      const credentials = getAdminCredentials();
      
      // Перевіряємо і логін і пароль
      if (username === credentials.login && password === credentials.password) {
        // Зберігаємо сесію з налаштуваннями
        const savedData = localStorage.getItem('immersiveExperienceData');
        let sessionDuration = 30; // За замовчуванням 30 хвилин
        
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            // Перевіряємо різні варіанти назв поля для сумісності
            if (data.adminSettings?.sessionDuration) {
              sessionDuration = data.adminSettings.sessionDuration;
            } else if (data.adminSettings?.logoutTime) {
              sessionDuration = data.adminSettings.logoutTime;
            }
            console.log('🔐 Admin login: Використовується тривалість сесії:', sessionDuration, 'хвилин');
          } catch (error) {
            console.error('Помилка читання налаштувань сесії:', error);
          }
        }
        
        const now = new Date().getTime();
        const expiry = now + sessionDuration * 60 * 1000; // Використовуємо налаштування
        
        const sessionData = {
          timestamp: now,
          expiry: expiry
        };
        
        localStorage.setItem('adminSession', JSON.stringify(sessionData));
        console.log('🔐 Admin login: Сесія збережена до:', new Date(expiry).toLocaleString(), 'тривалість:', sessionDuration, 'хвилин');
        
        onLogin();
        setUsername('');
        setPassword('');
      } else {
        setError(t('login.error.invalid'));
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 lg:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-md lg:rounded-lg shadow-xl w-full max-w-sm lg:max-w-md p-3 lg:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-3 lg:mb-6">
            <div className="mx-auto w-10 h-10 lg:w-16 lg:h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2 lg:mb-4">
              <span className="text-lg lg:text-2xl">⚙️</span>
            </div>
            <h2 className="text-base lg:text-xl font-semibold">{t('admin.title')}</h2>
            <p className="text-xs lg:text-sm text-gray-600 mt-1 lg:mt-2 hidden lg:block">{t('security.description')}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-2 lg:space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs lg:text-sm font-medium mb-1 lg:mb-2">
                {t('security.admin.login')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('security.admin.login.placeholder')}
                className="w-full px-2 lg:px-3 py-2 lg:py-3 border rounded-md lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base min-h-[36px] touch-manipulation"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs lg:text-sm font-medium mb-1 lg:mb-2">
                {t('security.admin.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('security.admin.password.placeholder')}
                className="w-full px-2 lg:px-3 py-2 lg:py-3 border rounded-md lg:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base min-h-[36px] touch-manipulation"
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 lg:p-3 text-xs lg:text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md lg:rounded-lg border border-red-200 dark:border-red-800"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-2 lg:gap-3 pt-2 lg:pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-3 lg:px-4 py-2 border border-gray-300 rounded-md lg:rounded-lg hover:bg-gray-50 transition-colors text-xs lg:text-sm min-h-[36px] touch-manipulation"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-md lg:rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm min-h-[36px] touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <div className="w-3 h-3 lg:w-4 lg:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden lg:inline">{t('common.loading')}</span>
                  </>
                ) : (
                  t('admin.login')
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleAdminLogin; 