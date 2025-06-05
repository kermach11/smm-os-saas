import { useState, useEffect, useCallback } from 'react';

interface AdminSessionData {
  timestamp: number;
  expiry: number;
}

export const useSimpleAdminSession = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Перевірка активної сесії при завантаженні
  useEffect(() => {
    checkExistingSession();
    checkAdminUrlParameter();
  }, []);

  // Перевірка URL параметра admin
  const checkAdminUrlParameter = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('admin');
  }, []);

  const checkExistingSession = useCallback(() => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (sessionData) {
        const session = JSON.parse(sessionData) as { expiry: number };
        const now = new Date().getTime();
        return now < session.expiry;
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
    return false;
  }, []);

  const login = useCallback(() => {
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminSession');
    setIsAdmin(false);
  }, []);

  const shouldShowAdminButton = useCallback((): boolean => {
    // Перевіряємо URL параметр
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('admin')) {
      return true;
    }
    
    try {
      const savedData = localStorage.getItem('immersiveExperienceData');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.adminSettings?.showAdminButton) {
          return true;
        }
      }
    } catch (error) {
      console.error('Помилка завантаження налаштувань:', error);
    }
    
    return isAdmin; // Показуємо кнопку тільки якщо користувач авторизований
  }, [isAdmin]);

  return {
    isAdmin,
    login,
    logout,
    checkExistingSession,
    shouldShowAdminButton,
    checkAdminUrlParameter
  };
}; 