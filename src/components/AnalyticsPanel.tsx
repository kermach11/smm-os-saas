import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation, useLanguage } from '../hooks/useTranslation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, Users, MousePointer, Clock, Download, Trash2,
  ExternalLink, Calendar, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAnalytics } from '../hooks/useAnalytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface AnalyticsPanelProps {
  className?: string;
}

// Статичні дані для демонстрації
const demoAnalyticsData = {
  totalViews: 2847,
  totalClicks: 5234,
  totalSessions: 892,
  averageSessionDuration: 285, // секунди
  topClickedLinks: [
    { url: 'https://linkcore.com', title: 'LINKCORE', clicks: 1832, percentage: 35 },
    { url: 'https://casemachine.dev', title: 'CASEMACHINE', clicks: 1466, percentage: 28 },
    { url: 'https://bookme.ua', title: 'BOOKME', clicks: 1151, percentage: 22 },
    { url: '#navigation', title: 'Navigation', clicks: 523, percentage: 10 },
    { url: '#sound-toggle', title: 'Sound Toggle', clicks: 262, percentage: 5 }
  ],
  dailyStats: [
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), views: 342, clicks: 567 },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), views: 298, clicks: 423 },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), views: 445, clicks: 789 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), views: 523, clicks: 934 },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), views: 389, clicks: 645 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), views: 467, clicks: 823 },
    { date: new Date().toISOString(), views: 383, clicks: 1053 }
  ],
  recentClicks: [
    { id: '1', timestamp: Date.now() - 2 * 60 * 1000, url: 'https://linkcore.com', title: 'LINKCORE' },
    { id: '2', timestamp: Date.now() - 5 * 60 * 1000, url: 'https://casemachine.dev', title: 'CASEMACHINE' },
    { id: '3', timestamp: Date.now() - 8 * 60 * 1000, url: 'https://bookme.ua', title: 'BOOKME' },
    { id: '4', timestamp: Date.now() - 12 * 60 * 1000, url: '#navigation', title: 'Navigation - Next' },
    { id: '5', timestamp: Date.now() - 15 * 60 * 1000, url: 'https://linkcore.com', title: 'LINKCORE' },
    { id: '6', timestamp: Date.now() - 18 * 60 * 1000, url: '#sound-toggle', title: 'Sound Toggle' },
    { id: '7', timestamp: Date.now() - 22 * 60 * 1000, url: 'https://casemachine.dev', title: 'CASEMACHINE' },
    { id: '8', timestamp: Date.now() - 25 * 60 * 1000, url: 'https://bookme.ua', title: 'BOOKME' },
    { id: '9', timestamp: Date.now() - 28 * 60 * 1000, url: '#navigation', title: 'Navigation - Previous' },
    { id: '10', timestamp: Date.now() - 31 * 60 * 1000, url: 'https://linkcore.com', title: 'LINKCORE' }
  ]
};

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Динамічна локаль для форматування дат
  const getLocale = () => {
    switch (language) {
      case 'en': return 'en-US';
      case 'ru': return 'ru-RU';
      default: return 'uk-UA';
    }
  };
  
  // Динамічні переклади для тексту "%% за день"
  const getPerDayText = () => {
    switch (language) {
      case 'en': return 'per day';
      case 'ru': return 'за день';
      default: return 'за день';
    }
  };
  
  // Динамічні переклади для статичних текстів
  const getDynamicText = (key: string) => {
    const texts = {
      'export.data': {
        uk: 'Експортувати дані',
        en: 'Export data',
        ru: 'Экспортировать данные'
      },
      'clean.old.data': {
        uk: 'Очистити застарілі дані',
        en: 'Clean old data',
        ru: 'Очистить устаревшие данные'
      },
      'clear.all.data': {
        uk: 'Очистити всі дані',
        en: 'Clear all data',
        ru: 'Очистить все данные'
      },
      'data.cleaned': {
        uk: 'Застарілі дані видалено з аналітики!',
        en: 'Old data removed from analytics!',
        ru: 'Устаревшие данные удалены из аналитики!'
      },
      'data.up.to.date': {
        uk: 'Всі дані актуальні, очищення не потрібне.',
        en: 'All data is up to date, no cleaning needed.',
        ru: 'Все данные актуальны, очистка не нужна.'
      },
      'error.cleaning': {
        uk: 'Помилка при очищенні аналітики',
        en: 'Error cleaning analytics',
        ru: 'Ошибка при очистке аналитики'
      },
      'daily.activity': {
        uk: 'Денна активність',
        en: 'Daily Activity', 
        ru: 'Дневная активность'
      },
      'clicks.and.views': {
        uk: 'Кліки та перегляди за останні 7 днів',
        en: 'Clicks and views for the last 7 days',
        ru: 'Клики и просмотры за последние 7 дней'
      },
      'popular.links': {
        uk: 'Популярні посилання',
        en: 'Popular Links',
        ru: 'Популярные ссылки'
      },
      'most.visited': {
        uk: 'Найчастіше відвідувані посилання',
        en: 'Most frequently visited links',
        ru: 'Наиболее часто посещаемые ссылки'
      },
      'links.rating': {
        uk: 'Рейтинг посилань',
        en: 'Links Rating',
        ru: 'Рейтинг ссылок'
      },
      'detailed.stats': {
        uk: 'Детальна статистика по кожному посиланню',
        en: 'Detailed statistics for each link',
        ru: 'Подробная статистика по каждой ссылке'
      },
      'recent.clicks': {
        uk: 'Останні кліки',
        en: 'Recent Clicks',
        ru: 'Последние клики'
      },
      'realtime.activity': {
        uk: 'Реальний час активності користувачів',
        en: 'Real-time user activity',
        ru: 'Активность пользователей в реальном времени'
      },
      'views': {
        uk: 'Перегляди',
        en: 'Views',
        ru: 'Просмотры'
      },
      'clicks': {
        uk: 'Кліки',
        en: 'Clicks',
        ru: 'Клики'
      }
    };
    
    return texts[key] ? texts[key][language] || texts[key]['uk'] : key;
  };
  const { clearAnalytics, exportAnalytics, cleanupRemovedCarouselItems } = useAnalytics();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Динамічний переклад коротких форм часу
    const { language } = useLanguage();
    const minText = language === 'en' ? 'min' : language === 'ru' ? 'мин' : 'хв';
    const secText = language === 'en' ? 's' : 'с';
    
    return `${minutes}${minText} ${remainingSeconds}${secText}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(getLocale());
  };

  const getClickTrend = () => {
    const today = demoAnalyticsData.dailyStats[demoAnalyticsData.dailyStats.length - 1];
    const yesterday = demoAnalyticsData.dailyStats[demoAnalyticsData.dailyStats.length - 2];
    
    if (!today || !yesterday) return 0;
    
    const change = ((today.clicks - yesterday.clicks) / (yesterday.clicks || 1)) * 100;
    return Math.round(change);
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden ${className}`}>
      {/* Compact Header - ультра-компактний */}
      <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-emerald-600 to-teal-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="w-4 h-4 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">📊</span>
            </div>
            <div>
              <h2 className="text-xs lg:text-lg font-bold text-white">{t('analytics.title')}</h2>
              <p className="text-emerald-100 text-xs hidden lg:block">{t('analytics.overview')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <button
              onClick={exportAnalytics}
              className="px-1 lg:px-2 py-1 lg:py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md lg:rounded-lg transition-all duration-200 text-xs min-h-[24px] lg:min-h-[32px] touch-manipulation"
              title={getDynamicText('export.data')}
            >
              <Download className="w-2 h-2 lg:w-3 lg:h-3" />
            </button>
            <button
              onClick={() => {
                try {
                  const carouselData = localStorage.getItem('mainPageSettings');
                  if (carouselData) {
                    const settings = JSON.parse(carouselData);
                    const carouselItems = settings.carouselItems || [];
                    const cleaned = cleanupRemovedCarouselItems(carouselItems);
                    if (cleaned) {
                      alert('✅ ' + getDynamicText('data.cleaned'));
                    } else {
                      alert('ℹ️ ' + getDynamicText('data.up.to.date'));
                    }
                  }
                } catch (error) {
                  console.error('Помилка при очищенні:', error);
                  alert('❌ ' + getDynamicText('error.cleaning'));
                }
              }}
              className="px-1 lg:px-2 py-1 lg:py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-md lg:rounded-lg transition-all duration-200 text-xs min-h-[24px] lg:min-h-[32px] touch-manipulation"
              title={getDynamicText('clean.old.data')}
            >
              🧹
            </button>
            <button
              onClick={() => {
                clearAnalytics();
                window.location.reload();
              }}
              className="px-1 lg:px-2 py-1 lg:py-1.5 bg-red-500/80 hover:bg-red-600 text-white rounded-md lg:rounded-lg transition-all duration-200 text-xs min-h-[24px] lg:min-h-[32px] touch-manipulation"
              title={getDynamicText('clear.all.data')}
            >
              <Trash2 className="w-2 h-2 lg:w-3 lg:h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content - адаптивні відступи */}
      <div className="flex-1 overflow-y-auto p-1.5 lg:p-4 space-y-2 lg:space-y-4">
        {/* Modern Metrics Cards - мобільна сітка */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <Users className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-semibold text-slate-600 hidden lg:block">{t('analytics.pageviews')}</h3>
              </div>
            </div>
            <div className="text-sm lg:text-3xl font-bold text-slate-800">{demoAnalyticsData.totalViews.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">{t('analytics.users')}</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <MousePointer className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-semibold text-slate-600 hidden lg:block">{t('analytics.visits')}</h3>
              </div>
            </div>
            <div className="text-sm lg:text-3xl font-bold text-slate-800">{demoAnalyticsData.totalClicks.toLocaleString()}</div>
            <div className="flex items-center text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:flex">
              <TrendingUp className="w-2 h-2 lg:w-3 lg:h-3 mr-1" />
              {getClickTrend() > 0 ? '+' : ''}{getClickTrend()}% {getPerDayText()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <Activity className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-semibold text-slate-600 hidden lg:block">{t('analytics.realtime')}</h3>
              </div>
            </div>
            <div className="text-sm lg:text-3xl font-bold text-slate-800">{demoAnalyticsData.totalSessions.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">{t('status.completed')}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-orange-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <Clock className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-semibold text-slate-600 hidden lg:block">{t('analytics.avg.session')}</h3>
              </div>
            </div>
            <div className="text-sm lg:text-3xl font-bold text-slate-800">
              {formatDuration(demoAnalyticsData.averageSessionDuration)}
            </div>
            <p className="text-xs text-slate-500 mt-1 lg:mt-2 hidden lg:block">{t('form.duration')}</p>
          </div>
        </div>

        {/* Modern Charts Section - адаптивна сітка */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Денна активність - компактний графік */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <Calendar className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getDynamicText('daily.activity')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getDynamicText('clicks.and.views')}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={demoAnalyticsData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(getLocale(), { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                  tick={{ fontSize: 10 }}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString(getLocale())}
                />
                <Bar dataKey="views" fill="#8884d8" name={getDynamicText('views')} />
                <Bar dataKey="clicks" fill="#82ca9d" name={getDynamicText('clicks')} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Топ посилання - компактний піч */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-rose-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-2 h-2 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getDynamicText('popular.links')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getDynamicText('most.visited')}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={demoAnalyticsData.topClickedLinks.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ title, percentage }) => `${title}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {demoAnalyticsData.topClickedLinks.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modern Detailed Statistics - адаптивна сітка */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
          {/* Топ посилання список - компактний */}
          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <span className="text-white text-xs lg:text-lg">🏆</span>
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getDynamicText('links.rating')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getDynamicText('detailed.stats')}</p>
              </div>
            </div>
            <div className="space-y-1 lg:space-y-3 max-h-[200px] lg:max-h-[400px] overflow-y-auto">
              {demoAnalyticsData.topClickedLinks.slice(0, 10).map((link, index) => (
                <motion.div
                  key={link.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 lg:p-4 rounded-md lg:rounded-xl bg-white/60 border border-cyan-100"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 lg:gap-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs">
                        #{index + 1}
                      </Badge>
                      <p className="font-semibold truncate text-slate-800 text-xs lg:text-base">{link.title}</p>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2 mt-1 lg:mt-2">
                      <ExternalLink className="w-2 h-2 lg:w-3 lg:h-3 text-slate-400" />
                      <p className="text-xs lg:text-sm text-slate-500 truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-xs lg:text-base">{link.clicks.toLocaleString()}</p>
                    <p className="text-xs lg:text-sm text-slate-500">{link.percentage}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Останні кліки - компактний */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-violet-100 shadow-sm">
            <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-6">
              <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-md lg:rounded-xl flex items-center justify-center">
                <span className="text-white text-xs lg:text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getDynamicText('recent.clicks')}</h3>
                <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getDynamicText('realtime.activity')}</p>
              </div>
            </div>
            <div className="space-y-1 lg:space-y-3 max-h-[200px] lg:max-h-[400px] overflow-y-auto">
              {demoAnalyticsData.recentClicks.map((click, index) => (
                <motion.div
                  key={click.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-2 lg:gap-3 p-2 lg:p-4 rounded-md lg:rounded-xl bg-white/60 border border-violet-100"
                >
                  <div className="w-1 h-1 lg:w-2 lg:h-2 bg-green-500 rounded-full mt-1 lg:mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-slate-800 text-xs lg:text-base">{click.title}</p>
                    <p className="text-xs lg:text-sm text-slate-500 truncate">
                      {click.url}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 lg:mt-1 hidden lg:block">
                      {formatDate(click.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel; 