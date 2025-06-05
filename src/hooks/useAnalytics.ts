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
    totalViews: 0,
    totalClicks: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    topClickedLinks: [],
    dailyStats: [],
    recentClicks: [],
    activeSessions: []
  });
  
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);

  // Utility functions
  const getStoredSessions = useCallback((): SessionData[] => {
    try {
      const stored = localStorage.getItem('analyticsSessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const getStoredClicks = useCallback((): ClickEvent[] => {
    try {
      const stored = localStorage.getItem('analyticsClicks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const saveSessionToStorage = useCallback((session: SessionData) => {
    try {
      const sessions = getStoredSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }
      
      localStorage.setItem('analyticsSessions', JSON.stringify(sessions));
    } catch (error) {
      // Тихо ігноруємо помилки localStorage в продакшені
    }
  }, [getStoredSessions]);

  const updateTotalViews = useCallback(() => {
    const sessions = getStoredSessions();
    const totalViews = sessions.length;
    const totalSessions = sessions.filter(s => s.endTime).length;
    const averageSessionDuration = sessions
      .filter(s => s.duration)
      .reduce((acc, s) => acc + (s.duration || 0), 0) / totalSessions || 0;

    setAnalyticsData(prev => ({
      ...prev,
      totalViews,
      totalSessions,
      averageSessionDuration: Math.round(averageSessionDuration / 1000) // в секундах
    }));
  }, [getStoredSessions]);

  const updateAnalyticsAfterClick = useCallback((allClicks: ClickEvent[]) => {
    const totalClicks = allClicks.length;
    
    // Підрахунок топ посилань
    const linkCounts = allClicks.reduce((acc, click) => {
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
          percentage: Math.round((count / totalClicks) * 100)
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Останні кліки
    const recentClicks = allClicks
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);

    setAnalyticsData(prev => ({
      ...prev,
      totalClicks,
      topClickedLinks,
      recentClicks
    }));
  }, []);

  // Ініціалізація сесії
  useEffect(() => {
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
      
      setCurrentSession(session);
      saveSessionToStorage(session);
      
      // Оновлюємо загальну статистику
      updateTotalViews();
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
    try {
      const stored = localStorage.getItem('analyticsData');
      if (stored) {
        const data = JSON.parse(stored);
        setAnalyticsData(data);
      }
    } catch (error) {
      // Тихо ігноруємо помилки localStorage в продакшені
    }
  }, []);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const trackClick = useCallback((url: string, title: string) => {
    if (!finalConfig.trackClicks || !currentSession) return;

    const clickEvent: ClickEvent = {
      id: generateId(),
      timestamp: Date.now(),
      url,
      title,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      sessionId: currentSession.id
    };

    // Зберігаємо клік
    try {
      const clicks = getStoredClicks();
      clicks.push(clickEvent);
      localStorage.setItem('analyticsClicks', JSON.stringify(clicks));

      // Оновлюємо сесію
      const updatedSession = {
        ...currentSession,
        clicks: currentSession.clicks + 1
      };
      setCurrentSession(updatedSession);
      saveSessionToStorage(updatedSession);

      // Оновлюємо аналітику
      updateAnalyticsAfterClick(clicks);
    } catch (error) {
      // Тихо ігноруємо помилки localStorage в продакшені
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

      const dayClicks = clicks.filter(c => 
        c.timestamp >= dayStart.getTime() && c.timestamp <= dayEnd.getTime()
      ).length;

      const daySessions = sessions.filter(s => 
        s.startTime >= dayStart.getTime() && s.startTime <= dayEnd.getTime()
      ).length;

      stats.push({
        date: dateStr,
        views: daySessions,
        clicks: dayClicks,
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
      totalViews: 0,
      totalClicks: 0,
      totalSessions: 0,
      averageSessionDuration: 0,
      topClickedLinks: [],
      dailyStats: [],
      recentClicks: [],
      activeSessions: []
    });
  }, []);

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
    exportAnalytics,
    currentSession
  };
}; 