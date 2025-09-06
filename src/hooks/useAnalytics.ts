import { useState, useEffect, useCallback } from 'react';
import { AnalyticsData, SessionData, ClickEvent, AnalyticsConfig } from '../types/analytics';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultConfig: AnalyticsConfig = {
  trackClicks: true,
  trackSessions: true,
  trackLocation: false,
  retentionDays: 30
};

export const useAnalytics = (config: Partial<AnalyticsConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalPageViews: 0, // Кліки по картках каруселі
    totalVisits: 0, // Welcome кліки
    totalSessions: 0, // Завершені сесії
    activeSessions: 0, // Поточні активні
    averageSessionDuration: 0,
    topClickedLinks: [],
    dailyStats: [],
    recentClicks: [],
    allSessions: []
  });
  
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);

  // Utility functions
  const getStoredSessions = useCallback((): SessionData[] => {
    try {
      const stored = localStorage.getItem('analyticsSessions');
      if (!stored) {
        console.log('📊 Analytics: Немає збережених сесій в localStorage');
        return [];
      }
      
      const sessions = JSON.parse(stored);
      console.log('📊 Analytics: Завантажено сесій з localStorage:', {
        total: sessions.length,
        sessions: sessions.map((s: SessionData) => ({
          id: s.id.slice(0, 8),
          startTime: new Date(s.startTime).toLocaleString(),
          endTime: s.endTime ? new Date(s.endTime).toLocaleString() : 'ongoing',
          clicks: s.clicks
        }))
      });
      
      return sessions;
    } catch (error) {
      console.error('❌ Analytics: Помилка читання сесій з localStorage:', error);
      return [];
    }
  }, []);

  const getStoredClicks = useCallback((): ClickEvent[] => {
    try {
      const stored = localStorage.getItem('analyticsClicks');
      if (!stored) {
        console.log('🖱️ Analytics: Немає збережених кліків в localStorage');
        return [];
      }
      
      const clicks = JSON.parse(stored);
      console.log('🖱️ Analytics: Завантажено кліків з localStorage:', {
        total: clicks.length,
        recentClicks: clicks.slice(-5).map((c: ClickEvent) => ({
          id: c.id.slice(0, 8),
          timestamp: new Date(c.timestamp).toLocaleString(),
          url: c.url,
          title: c.title.slice(0, 30) + '...'
        }))
      });
      
      return clicks;
    } catch (error) {
      console.error('❌ Analytics: Помилка читання кліків з localStorage:', error);
      return [];
    }
  }, []);

  const saveSessionToStorage = useCallback((session: SessionData) => {
    console.log('💾 Analytics: saveSessionToStorage викликано для сесії:', session.id);
    
    try {
      const sessions = getStoredSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      console.log('📊 Analytics: Поточні сесії в localStorage:', {
        total: sessions.length,
        existingIndex,
        sessionIds: sessions.map(s => ({ id: s.id.slice(0, 8), startTime: new Date(s.startTime).toLocaleString() }))
      });
      
      if (existingIndex >= 0) {
        console.log('🔄 Analytics: Оновлюємо існуючу сесію');
        sessions[existingIndex] = session;
      } else {
        console.log('➕ Analytics: Додаємо нову сесію');
        sessions.push(session);
      }
      
      localStorage.setItem('analyticsSessions', JSON.stringify(sessions));
      console.log('✅ Analytics: Сесія збережена в localStorage. Всього сесій:', sessions.length);
      
      // Перевіряємо чи дійсно збереглося
      const verification = localStorage.getItem('analyticsSessions');
      if (verification) {
        const parsed = JSON.parse(verification);
        console.log('✓ Analytics: Верифікація збереження:', { savedSessions: parsed.length });
      }
      
    } catch (error) {
      console.error('❌ Analytics: Помилка збереження сесії:', error);
      console.error('❌ Analytics: Деталі сесії яку не вдалося зберегти:', session);
    }
  }, [getStoredSessions]);

  const updateTotalViews = useCallback(() => {
    const sessions = getStoredSessions();
    
    // ЗАВЕРШЕНІ СЕСІЇ = ті що мають endTime
    const completedSessions = sessions.filter(s => s.endTime);
    const totalSessions = completedSessions.length;
    
    // АКТИВНІ СЕСІЇ = ті що не мають endTime і створені менше ніж 30 хв тому
    const now = Date.now();
    const thirtyMinutesAgo = now - (30 * 60 * 1000);
    const activeSessions = sessions.filter(s => !s.endTime && s.startTime > thirtyMinutesAgo).length;
    
    // СЕРЕДНЯ СЕСІЯ = тільки з завершених сесій
    const averageSessionDuration = completedSessions
      .filter(s => s.duration)
      .reduce((acc, s) => acc + (s.duration || 0), 0) / totalSessions || 0;

    console.log('📈 Analytics: updateTotalViews:', {
      allSessions: sessions.length,
      completedSessions: totalSessions,
      activeSessions: activeSessions,
      avgDuration: Math.round(averageSessionDuration / 1000),
      sessionsData: sessions.map(s => ({
        id: s.id.slice(0, 8),
        startTime: new Date(s.startTime).toLocaleString(),
        endTime: s.endTime ? new Date(s.endTime).toLocaleString() : 'ongoing',
        clicks: s.clicks,
        isActive: !s.endTime && s.startTime > thirtyMinutesAgo
      }))
    });

    setAnalyticsData(prev => {
      const newData = {
        ...prev,
        totalSessions,
        activeSessions,
        averageSessionDuration: Math.round(averageSessionDuration / 1000), // в секундах
        allSessions: sessions
      };
      
      // ⚠️ КРИТИЧНО: Зберігаємо оновлені дані в localStorage
      try {
        localStorage.setItem('analyticsData', JSON.stringify(newData));
        console.log('💾 Analytics: Дані аналітики збережено в localStorage після оновлення переглядів');
      } catch (error) {
        console.error('❌ Analytics: Помилка збереження даних аналітики після переглядів:', error);
      }
      
      return newData;
    });
  }, [getStoredSessions]);

  const updateAnalyticsAfterClick = useCallback((allClicks: ClickEvent[]) => {
    console.log('📊 Analytics: updateAnalyticsAfterClick викликано з кліками:', allClicks.length);
    
    // ПЕРЕГЛЯДИ СТОРІНОК = тільки кліки по картках каруселі (посилання)
    const carouselCardClicks = allClicks.filter(click => click.clickType === 'carousel-card');
    const totalPageViews = carouselCardClicks.length;
    
    // ВІДВІДУВАННЯ = кліки Welcome кнопки
    const welcomeClicks = allClicks.filter(click => click.clickType === 'welcome-entry');
    const totalVisits = welcomeClicks.length;
    
    console.log('📈 Analytics: Метрики по типах кліків:', {
      totalPageViews: totalPageViews,
      totalVisits: totalVisits,
      carouselCardClicks: carouselCardClicks.length,
      welcomeClicks: welcomeClicks.length,
      allClicks: allClicks.length
    });
    
    // Підрахунок топ посилань (тільки картки каруселі)
    const linkCounts = carouselCardClicks.reduce((acc, click) => {
      const key = `${click.url}|${click.title}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topClickedLinks = Object.entries(linkCounts)
      .map(([key, count]) => {
        const [url, title] = key.split('|');
        return {
          url,
          title,
          clicks: count,
          percentage: totalPageViews > 0 ? Math.round((count / totalPageViews) * 100) : 0
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Останні кліки (всі типи)
    const recentClicks = allClicks
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    const updatedData = {
      totalPageViews,
      totalVisits,
      topClickedLinks,
      recentClicks
    };
    
    console.log('📊 Analytics: updateAnalyticsAfterClick - оновлення:', updatedData);
    
    setAnalyticsData(prev => {
      const newData = {
        ...prev,
        ...updatedData
      };
      
      // ⚠️ КРИТИЧНО: Зберігаємо оновлені дані в localStorage
      try {
        localStorage.setItem('analyticsData', JSON.stringify(newData));
        console.log('💾 Analytics: Дані аналітики збережено в localStorage після оновлення кліків');
      } catch (error) {
        console.error('❌ Analytics: Помилка збереження даних аналітики після кліків:', error);
      }
      
      return newData;
    });
  }, []);

  // Ініціалізація сесії
  useEffect(() => {
    console.log('🔍 Analytics: Ініціалізація сесії...', { 
      trackSessions: finalConfig.trackSessions,
      device: {
        isMobile: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent),
        userAgent: navigator.userAgent.slice(0, 100),
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled
      },
      localStorage: {
        available: typeof Storage !== 'undefined',
        quota: (() => {
          try {
            return navigator.storage?.estimate ? 'supported' : 'not supported';
          } catch {
            return 'error';
          }
        })()
      }
    });
    
    if (finalConfig.trackSessions) {
      const session: SessionData = {
        id: generateId(),
        startTime: Date.now(),
        endTime: undefined,
        duration: undefined,
        pageViews: 1,
        clicks: 0,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      };
      
      console.log('📊 Analytics: Створено нову сесію:', {
        sessionId: session.id,
        startTime: new Date(session.startTime).toLocaleString(),
        userAgent: session.userAgent.slice(0, 50) + '...'
      });
      
      setCurrentSession(session);
      saveSessionToStorage(session);
      
      // Оновлюємо загальну статистику
      updateTotalViews();
      
      console.log('✅ Analytics: Сесія збережена та статистика оновлена');
    }
  }, [finalConfig.trackSessions, saveSessionToStorage, updateTotalViews]);

  // Завершення сесії при закритті сторінки
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          endTime: Date.now(),
          duration: Date.now() - currentSession.startTime
        };
        saveSessionToStorage(updatedSession);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentSession, saveSessionToStorage]);

  // Завантаження даних з localStorage
  const loadAnalyticsData = useCallback(() => {
    console.log('📤 Analytics: loadAnalyticsData викликано');
    
    try {
      const stored = localStorage.getItem('analyticsData');
      if (stored) {
        const data = JSON.parse(stored);
        console.log('📊 Analytics: Завантажено дані аналітики з localStorage:', {
          totalViews: data.totalViews,
          totalClicks: data.totalClicks,
          totalSessions: data.totalSessions,
          topLinksCount: data.topClickedLinks?.length || 0,
          recentClicksCount: data.recentClicks?.length || 0
        });
        setAnalyticsData(data);
      } else {
        console.log('📊 Analytics: Немає збережених даних аналітики в localStorage, використовуємо початкові значення');
      }
    } catch (error) {
      console.error('❌ Analytics: Помилка завантаження даних аналітики:', error);
    }
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const trackClick = useCallback((url: string, title: string, clickType: ClickEvent['clickType'] = 'other') => {
    console.log('🎯 Analytics: trackClick викликано:', { url, title, clickType, hasSession: !!currentSession, trackClicks: finalConfig.trackClicks });
    
    if (!finalConfig.trackClicks) {
      console.log('⚠️ Analytics: trackClicks вимкнено в конфігурації');
      return;
    }
    
    if (!currentSession) {
      console.log('⚠️ Analytics: Немає поточної сесії для трекінгу кліку');
      return;
    }

    const clickEvent: ClickEvent = {
      id: generateId(),
      timestamp: Date.now(),
      url,
      title,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: currentSession.id,
      clickType
    };

    console.log('📝 Analytics: Створено подію кліку:', {
      clickId: clickEvent.id,
      timestamp: new Date(clickEvent.timestamp).toLocaleString(),
      url: clickEvent.url,
      title: clickEvent.title,
      sessionId: clickEvent.sessionId
    });

    // Зберігаємо клік
    try {
      const clicks = getStoredClicks();
      clicks.push(clickEvent);
      localStorage.setItem('analyticsClicks', JSON.stringify(clicks));
      
      console.log('💾 Analytics: Клік збережено в localStorage. Всього кліків:', clicks.length);

      // Оновлюємо сесію
      const updatedSession = {
        ...currentSession,
        clicks: currentSession.clicks + 1
      };
      setCurrentSession(updatedSession);
      saveSessionToStorage(updatedSession);
      
      console.log('🔄 Analytics: Сесія оновлена. Кліків в сесії:', updatedSession.clicks);

      // Оновлюємо аналітику
      updateAnalyticsAfterClick(clicks);
      
      console.log('✅ Analytics: Аналітика оновлена після кліку');
    } catch (error) {
      console.error('❌ Analytics: Помилка збереження кліку:', error);
    }
  }, [currentSession, finalConfig.trackClicks, saveSessionToStorage, updateAnalyticsAfterClick, getStoredClicks]);

  const getDailyStats = useCallback((days: number = 7) => {
    const clicks = getStoredClicks();
    const sessions = getStoredSessions();
    const stats = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // ПЕРЕГЛЯДИ СТОРІНОК = кліки по картках каруселі за день
      const dayPageViews = clicks.filter(c => 
        c.timestamp >= dayStart.getTime() && c.timestamp <= dayEnd.getTime() &&
        c.clickType === 'carousel-card'
      ).length;

      // ВІДВІДУВАННЯ = Welcome кліки за день
      const dayVisits = clicks.filter(c => 
        c.timestamp >= dayStart.getTime() && c.timestamp <= dayEnd.getTime() &&
        c.clickType === 'welcome-entry'
      ).length;

      const daySessions = sessions.filter(s => 
        s.startTime >= dayStart.getTime() && s.startTime <= dayEnd.getTime()
      ).length;

      stats.push({
        date: dateStr,
        pageViews: dayPageViews,
        visits: dayVisits,
        sessions: daySessions
      });
    }

    return stats;
  }, []);

  const clearAnalytics = useCallback(() => {
    localStorage.removeItem('analyticsData');
    localStorage.removeItem('analyticsSessions');
    localStorage.removeItem('analyticsClicks');
    setAnalyticsData({
      totalPageViews: 0,
      totalVisits: 0,
      totalSessions: 0,
      activeSessions: 0,
      averageSessionDuration: 0,
      topClickedLinks: [],
      dailyStats: [],
      recentClicks: [],
      allSessions: []
    });
  }, []);

  // Нова функція для очищення аналітики від видалених елементів каруселі
  const cleanupRemovedCarouselItems = useCallback((currentItems: Array<{title: string, url?: string}>) => {
    try {
      const clicks = getStoredClicks();
      const currentItemTitles = new Set(currentItems.map(item => item.title));
      const currentItemUrls = new Set(currentItems.map(item => item.url).filter(Boolean));
      
      // Фільтруємо кліки, залишаючи тільки ті, що відносяться до поточних елементів каруселі
      // або до системних елементів (навігація, звук, тощо)
      const filteredClicks = clicks.filter(click => {
        const isSystemClick = click.url.startsWith('#') && !click.url.includes('carousel-item-');
        const isCurrentCarouselItem = currentItemTitles.has(click.title.split(' - ')[0]);
        const isCurrentUrl = click.url && currentItemUrls.has(click.url);
        
        return isSystemClick || isCurrentCarouselItem || isCurrentUrl;
      });
      
      // Якщо є зміни, оновлюємо localStorage
      if (filteredClicks.length !== clicks.length) {
        localStorage.setItem('analyticsClicks', JSON.stringify(filteredClicks));
        
        // Оновлюємо аналітику з новими даними
        updateAnalyticsAfterClick(filteredClicks);
        
        console.log(`🧹 Очищено аналітику: видалено ${clicks.length - filteredClicks.length} кліків по видалених елементах`);
        
        return true; // Повертаємо true, якщо були зміни
      }
      
      return false; // Повертаємо false, якщо змін не було
    } catch (error) {
      console.error('Помилка при очищенні аналітики:', error);
      return false;
    }
  }, [getStoredClicks, updateAnalyticsAfterClick]);

  const exportAnalytics = useCallback(() => {
    const data = {
      analytics: analyticsData,
      sessions: getStoredSessions(),
      clicks: getStoredClicks(),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [analyticsData]);

  return {
    analyticsData: {
      ...analyticsData,
      dailyStats: getDailyStats()
    },
    trackClick,
    clearAnalytics,
    cleanupRemovedCarouselItems,
    exportAnalytics,
    currentSession
  };
}; 