export interface ClickEvent {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
  clickType: 'carousel-card' | 'navigation' | 'admin' | 'sound' | 'pagination' | 'welcome-entry' | 'other';
}

export interface SessionData {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: number;
  clicks: number;
  userAgent: string;
  referrer: string;
  country?: string;
  city?: string;
}

export interface AnalyticsData {
  totalPageViews: number; // Кліки по картках каруселі (посилання)
  totalVisits: number; // Завантаження + Welcome клік
  totalSessions: number; // Завершені сесії
  activeSessions: number; // Поточні активні на головній
  averageSessionDuration: number;
  topClickedLinks: Array<{
    url: string;
    title: string;
    clicks: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    pageViews: number; // Кліки по картках
    visits: number; // Welcome кліки
    sessions: number;
  }>;
  recentClicks: ClickEvent[];
  allSessions: SessionData[];
}

export interface AnalyticsConfig {
  trackClicks: boolean;
  trackSessions: boolean;
  trackLocation: boolean;
  retentionDays: number;
} 