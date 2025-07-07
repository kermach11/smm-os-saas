import { useState, useEffect, useCallback } from 'react';

interface AdminSessionData {
  timestamp: number;
  expiry: number;
  duration: number;
}

interface AdminSettings {
  password: string;
  showAdminButton: boolean;
  autoLogout: boolean;
  logoutTime: number;
}

export const useAdminSession = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [autoLogoutTimer, setAutoLogoutTimer] = useState<NodeJS.Timeout | null>(null);

  // Перевірка активної сесії при завантаженні
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Автоматичний вихід при закінченні сесії
  useEffect(() => {
    if (sessionExpiry && isAdmin) {
      const now = Date.now();
      const timeLeft = sessionExpiry - now;
      
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeLeft);
        
        setAutoLogoutTimer(timer);
        
        return () => {
          if (timer) clearTimeout(timer);
        };
      } else {
        logout();
      }
    }
  }, [sessionExpiry, isAdmin]);

  const checkExistingSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session: AdminSessionData = JSON.parse(sessionData);
        const now = Date.now();
        
        if (session.expiry && session.expiry > now) {
          setIsAdmin(true);
          setSessionExpiry(session.expiry);
          return true;
        } else {
          // Сесія застаріла
          localStorage.removeItem('adminSession');
        }
      }
    } catch (error) {
      console.error('Помилка при перевірці сесії:', error);
      localStorage.removeItem('adminSession');
    }
    
    setIsAdmin(false);
    setSessionExpiry(null);
    return false;
  }, []);

  const login = useCallback((duration: number) => {
    const now = Date.now();
    const expiry = now + duration * 60 * 1000;
    
    const sessionData: AdminSessionData = {
      timestamp: now,
      expiry: expiry,
      duration: duration
    };
    
    localStorage.setItem('adminSession', JSON.stringify(sessionData));
    setIsAdmin(true);
    setSessionExpiry(expiry);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
    setSessionExpiry(null);
    
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
      setAutoLogoutTimer(null);
    }
  }, [autoLogoutTimer]);

  const extendSession = useCallback((additionalMinutes: number = 30) => {
    if (isAdmin && sessionExpiry) {
      const newExpiry = sessionExpiry + additionalMinutes * 60 * 1000;
      
      try {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
          const session: AdminSessionData = JSON.parse(sessionData);
          session.expiry = newExpiry;
          localStorage.setItem('adminSession', JSON.stringify(session));
          setSessionExpiry(newExpiry);
        }
      } catch (error) {
        console.error('Помилка при продовженні сесії:', error);
      }
    }
  }, [isAdmin, sessionExpiry]);

  const getTimeLeft = useCallback((): number => {
    if (!sessionExpiry) return 0;
    const now = Date.now();
    return Math.max(0, sessionExpiry - now);
  }, [sessionExpiry]);

  const getAdminSettings = useCallback((): AdminSettings => {
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings) {
          return data.adminSettings;
        }
      }
    } catch (error) {
      console.error('Помилка завантаження налаштувань адміністратора:', error);
    }
    
    // Налаштування за замовчуванням
    return {
      password: 'admin123',
      showAdminButton: false,
      autoLogout: true,
      logoutTime: 30
    };
  }, []);

  const shouldShowAdminButton = useCallback((): boolean => {
    // Перевіряємо URL параметр
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      return true;
    }
    
    // Перевіряємо чи це порт 8081 (админ-сервер)
    if (window.location.port === '8081') {
      return true;
    }
    
    // ВИПРАВЛЕНО: Кнопка має показуватись тільки при наявності ?admin параметра
    // Не показуємо кнопку лише на основі авторизації
    return false;
  }, []);

  return {
    isAdmin,
    sessionExpiry,
    login,
    logout,
    extendSession,
    getTimeLeft,
    checkExistingSession,
    getAdminSettings,
    shouldShowAdminButton
  };
}; 