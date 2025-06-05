export interface ClickEvent {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  userAgent: string;
  referrer: string;
  sessionId: string;
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
  totalViews: number;
  totalClicks: number;
  totalSessions: number;
  averageSessionDuration: number;
  topClickedLinks: Array<{
    url: string;
    title: string;
    clicks: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
    sessions: number;
  }>;
  recentClicks: ClickEvent[];
  activeSessions: SessionData[];
}

export interface AnalyticsConfig {
  trackClicks: boolean;
  trackSessions: boolean;
  trackLocation: boolean;
  retentionDays: number;
} 