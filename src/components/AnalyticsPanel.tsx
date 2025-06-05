import React from 'react';
import { motion } from 'framer-motion';
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

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ className }) => {
  const { analyticsData, clearAnalytics, exportAnalytics } = useAnalytics();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}хв ${remainingSeconds}с`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('uk-UA');
  };

  const getClickTrend = () => {
    const today = analyticsData.dailyStats[analyticsData.dailyStats.length - 1];
    const yesterday = analyticsData.dailyStats[analyticsData.dailyStats.length - 2];
    
    if (!today || !yesterday) return 0;
    
    const change = ((today.clicks - yesterday.clicks) / (yesterday.clicks || 1)) * 100;
    return Math.round(change);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок та дії */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Аналітика та метрики</h2>
          <p className="text-muted-foreground">
            Відстежуйте активність користувачів та популярність посилань
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="w-4 h-4 mr-2" />
            Експорт
          </Button>
          <Button variant="destructive" onClick={clearAnalytics}>
            <Trash2 className="w-4 h-4 mr-2" />
            Очистити
          </Button>
        </div>
      </div>

      {/* Основні метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього переглядів</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Унікальні відвідувачі
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього кліків</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalClicks}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1" />
              {getClickTrend() > 0 ? '+' : ''}{getClickTrend()}% за день
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активні сесії</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              Завершені сесії
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сер. час сесії</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(analyticsData.averageSessionDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Середня тривалість
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Графіки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Денна активність */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Денна активність
            </CardTitle>
            <CardDescription>
              Кліки та перегляди за останні 7 днів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('uk-UA', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('uk-UA')}
                />
                <Bar dataKey="views" fill="#8884d8" name="Перегляди" />
                <Bar dataKey="clicks" fill="#82ca9d" name="Кліки" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Топ посилання */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Популярні посилання
            </CardTitle>
            <CardDescription>
              Найчастіше відвідувані посилання
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsData.topClickedLinks.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.topClickedLinks.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ title, percentage }) => `${title}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="clicks"
                  >
                    {analyticsData.topClickedLinks.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Немає даних про кліки
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Детальна статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Топ посилання список */}
        <Card>
          <CardHeader>
            <CardTitle>Рейтинг посилань</CardTitle>
            <CardDescription>
              Детальна статистика по кожному посиланню
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topClickedLinks.slice(0, 10).map((link, index) => (
                <motion.div
                  key={link.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">#{index + 1}</Badge>
                      <p className="font-medium truncate">{link.title}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{link.clicks}</p>
                    <p className="text-sm text-muted-foreground">{link.percentage}%</p>
                  </div>
                </motion.div>
              ))}
              {analyticsData.topClickedLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Поки що немає даних про кліки
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Останні кліки */}
        <Card>
          <CardHeader>
            <CardTitle>Останні кліки</CardTitle>
            <CardDescription>
              Реальний час активності користувачів
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {analyticsData.recentClicks.map((click, index) => (
                <motion.div
                  key={click.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{click.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {click.url}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(click.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
              {analyticsData.recentClicks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Поки що немає кліків
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPanel; 