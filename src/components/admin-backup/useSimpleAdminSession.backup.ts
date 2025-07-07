import { useState, useEffect, useCallback } from 'react';

interface AdminSessionData {
  timestamp: number;
  expiry: number;
}

export const useSimpleAdminSession = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Перевірка активної сесії при завантаженні
  useEffect(() => {
    // Очищаємо застарілі налаштування showAdminButton
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings?.showAdminButton) {
          delete data.adminSettings.showAdminButton;
          localStorage.setItem('immersiveExperienceData', JSON.stringify(data));
          console.log('🔧 Очищено застарілу настройку showAdminButton');
        }
      }
    } catch (error) {
      console.error('Помилка при очищенні застарілих настройок:', error);
    }

    const hasValidSession = checkExistingSession();
    if (hasValidSession) {
      setIsAdmin(true);
      console.log('✅ Admin session: Відновлено валідну сесію');
    }
    checkAdminUrlParameter();
  }, []);

  // Автоматичний logout при закінченні сесії
  useEffect(() => {
    if (isAdmin) {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData) as AdminSessionData;
          const now = new Date().getTime();
          const timeLeft = session.expiry - now;
          
          if (timeLeft > 0) {
            // Встановлюємо таймер для автоматичного logout
            const timer = setTimeout(() => {
              console.log('⏰ Admin session: Сесія закінчилась, автоматичний вихід');
              logout();
            }, timeLeft);
            
            return () => clearTimeout(timer);
          } else {
            // Сесія вже закінчилась
            logout();
          }
        } catch (error) {
          console.error('Помилка при налаштуванні автоматичного logout:', error);
          logout();
        }
      }
    }
  }, [isAdmin]);

  // Перевірка URL параметра admin
  const checkAdminUrlParameter = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin');
  }, []);

  const checkExistingSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session = JSON.parse(sessionData) as AdminSessionData;
        const now = new Date().getTime();
        
        if (now < session.expiry) {
          console.log('✅ Admin session: Знайдено валідну сесію, залишилось:', Math.round((session.expiry - now) / 1000 / 60), 'хвилин');
          return true;
        } else {
          console.log('⏰ Admin session: Сесія застаріла, видаляємо');
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Помилка при перевірці сесії:', error);
      localStorage.removeItem('adminSession');
    }
    return false;
  }, []);

  const login = useCallback(() => {
    setIsAdmin(true);
    console.log('🔐 Admin session: Користувач увійшов');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    console.log('🔐 Admin session: Користувач вийшов');
  }, []);

  const shouldShowAdminButton = useCallback((): boolean => {
    // Перевіряємо URL параметр
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      // console.log('🔧 Admin button: Показую через URL параметр ?admin');
      return true;
    }
    
    // Перевіряємо чи це порт 8081 (админ-сервер)
    if (window.location.port === '8081') {
      // console.log('🔧 Admin button: Показую через порт 8081');
      return true;
    }
    
    // ВИПРАВЛЕНО: Кнопка має показуватись тільки при наявності ?admin параметра
    // Не показуємо кнопку лише на основі авторизації
    
    // console.log('🔧 Admin button: Приховую - немає підстав для показу');
    return false;
  }, []);

  return {
    isAdmin,
    login,
    logout,
    checkExistingSession,
    shouldShowAdminButton,
    checkAdminUrlParameter
  };
}; 