import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Calendar,
  ExternalLink,
  Star,
  Award,
  Target,
  BarChart3,
  Zap,
  Crown,
  Flame,
  Instagram,
  Play,
  Sun,
  Moon,
  Search,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CaseMachine: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [currentCase, setCurrentCase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const cases = [
    {
      id: 1,
      username: '@greenbeauty.studio',
      niche: 'Краса',
      goal: 'Збільшення охоплення',
      difficulty: 'Середня',
      beforeImage: '/api/placeholder/300/400',
      afterImage: '/api/placeholder/300/400',
      results: {
        reach: '+210%',
        saves: '+84%',
        followers: '+1.2K'
      },
      timeframe: '30 днів',
      testimonial: 'Ми ніколи не думали, що контент може бути і стильним, і ефективним одночасно!',
      clientName: 'Марія',
      clientRole: 'власниця студії',
      metrics: [
        { label: 'Охоплення', value: '45.2K', growth: '+210%' },
        { label: 'Збереження', value: '2.8K', growth: '+84%' },
        { label: 'Коментарі', value: '890', growth: '+156%' }
      ]
    },
    {
      id: 2,
      username: '@fitness.pro.ua',
      niche: 'Фітнес',
      goal: 'Генерація лідів',
      difficulty: 'Висока',
      beforeImage: '/api/placeholder/300/400',
      afterImage: '/api/placeholder/300/400',
      results: {
        leads: '+340%',
        engagement: '+125%',
        sales: '+89%'
      },
      timeframe: '45 днів',
      testimonial: 'Кількість заявок зросла в 3 рази! Тепер ми не встигаємо обробляти всіх клієнтів.',
      clientName: 'Олексій',
      clientRole: 'фітнес-тренер',
      metrics: [
        { label: 'Ліди', value: '127', growth: '+340%' },
        { label: 'Залученість', value: '8.9%', growth: '+125%' },
        { label: 'Продажі', value: '89K', growth: '+89%' }
      ]
    },
    {
      id: 3,
      username: '@tech.startup.kyiv',
      niche: 'IT/Tech',
      goal: 'Brand awareness',
      difficulty: 'Висока',
      beforeImage: '/api/placeholder/300/400',
      afterImage: '/api/placeholder/300/400',
      results: {
        reach: '+450%',
        mentions: '+280%',
        traffic: '+190%'
      },
      timeframe: '60 днів',
      testimonial: 'Завдяки новій стратегії ми залучили $500K інвестицій від топових фондів!',
      clientName: 'Дмитро',
      clientRole: 'CEO стартапу',
      metrics: [
        { label: 'Охоплення', value: '156K', growth: '+450%' },
        { label: 'Згадки', value: '89', growth: '+280%' },
        { label: 'Трафік', value: '12.4K', growth: '+190%' }
      ]
    }
  ];

  const achievements = [
    {
      icon: <Eye className="w-8 h-8" />,
      number: '140K',
      label: 'переглядів на одному Reels',
      description: 'Рекордний показник серед наших клієнтів',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: '+1200',
      label: 'нових підписників за тиждень',
      description: 'Органічний ріст без реклами',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: '8 з 10',
      label: 'клієнтів повертаються знову',
      description: 'Високий рівень задоволеності',
      gradient: 'from-emerald-500 to-green-500'
    }
  ];

  const chartData = [
    { month: 'Січ', ctr: 2.1, reach: 15000, followers: 1200 },
    { month: 'Лют', ctr: 3.2, reach: 28000, followers: 1850 },
    { month: 'Бер', ctr: 4.8, reach: 45000, followers: 2900 },
    { month: 'Кві', ctr: 6.2, reach: 67000, followers: 4200 },
    { month: 'Тра', ctr: 7.9, reach: 89000, followers: 5800 }
  ];

  const nextCase = () => {
    setCurrentCase((prev) => (prev + 1) % cases.length);
  };

  const prevCase = () => {
    setCurrentCase((prev) => (prev - 1 + cases.length) % cases.length);
  };

  const currentCaseData = cases[currentCase];

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 opacity-[0.02] ${isDark ? 'bg-white' : 'bg-gray-900'}`} 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='1'%3E%3Cpath d='M30 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15zm15 0c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }}>
        </div>
        
        {/* Floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/15 to-pink-300/15 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-cyan-300/15 rounded-full blur-2xl"
          animate={{
            y: [0, 35, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <Link 
            to="/"
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 group ${
              isDark 
                ? 'bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white border border-gray-700/50 hover:border-gray-600/50' 
                : 'bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200/50 hover:border-gray-300/50 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20'
            } backdrop-blur-xl hover:scale-105`}
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-semibold">Назад до головної</span>
          </Link>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600/50' 
                : 'bg-white/95 hover:bg-white border border-gray-200/50 hover:border-gray-300/50 shadow-lg shadow-gray-500/10 hover:shadow-gray-500/20'
            } backdrop-blur-xl`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-6xl mb-4"
              >
                🪩
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Кейси, що говорять{' '}
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  голосніше
                </span>
                <br />
                ніж будь-яке портфоліо
              </h1>
              
              <p className={`text-lg md:text-xl leading-relaxed max-w-3xl mx-auto ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                SMM — це не просто картинки. Це <span className="font-semibold text-purple-600">цифри</span>, 
                <span className="font-semibold text-pink-600"> охоплення</span>, 
                <span className="font-semibold text-blue-600"> зростання</span> і 
                <span className="font-semibold text-emerald-600"> продажі</span>. 
                <br />
                Подивись, що ми зробили для інших — і уяви, що можемо зробити для тебе.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <Search className="w-5 h-5" />
              <span className="relative z-10">Замовити аудит профілю</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Case Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                📈 Було → Стало
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Реальні результати наших клієнтів
              </p>
            </div>

            <div className="relative">
              {/* Case Navigation */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={prevCase}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/50' 
                      : 'bg-white/90 hover:bg-white border border-gray-200/50 shadow-lg'
                  } backdrop-blur-md hover:scale-110`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {cases.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCase(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentCase 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                          : isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextCase}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800/70 hover:bg-gray-700/70 border border-gray-700/50' 
                      : 'bg-white/90 hover:bg-white border border-gray-200/50 shadow-lg'
                  } backdrop-blur-md hover:scale-110`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Current Case */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCase}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className={`p-8 rounded-3xl ${
                    isDark 
                      ? 'bg-gray-800/70 border border-gray-700/50' 
                      : 'bg-white/90 border border-gray-200/50'
                  } backdrop-blur-md shadow-2xl`}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Case Info */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-2xl font-bold">{currentCaseData.username}</h3>
                          <Instagram className="w-6 h-6 text-pink-500" />
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {currentCaseData.niche}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {currentCaseData.goal}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            currentCaseData.difficulty === 'Висока' 
                              ? isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                              : isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {currentCaseData.difficulty}
                          </span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4">
                        {currentCaseData.metrics.map((metric, index) => (
                          <div key={index} className={`p-4 rounded-xl text-center ${
                            isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <div className="text-2xl font-bold mb-1">{metric.value}</div>
                            <div className="text-xs text-gray-500 mb-2">{metric.label}</div>
                            <div className="text-sm font-semibold text-green-500">{metric.growth}</div>
                          </div>
                        ))}
                      </div>

                      {/* Testimonial */}
                      <div className={`p-4 rounded-xl ${
                        isDark ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30' : 'bg-gradient-to-r from-purple-50 to-pink-50'
                      } border-l-4 border-purple-500`}>
                        <p className="italic mb-2">"{currentCaseData.testimonial}"</p>
                        <div className="text-sm font-medium">
                          — {currentCaseData.clientName}, {currentCaseData.clientRole}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 rounded-lg ${
                          isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          ⏱️ {currentCaseData.timeframe}
                        </div>
                        <button className="flex items-center gap-2 text-purple-500 hover:text-purple-600 font-medium">
                          <ExternalLink className="w-4 h-4" />
                          Детальніше
                        </button>
                      </div>
                    </div>

                    {/* Before/After Images */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-center font-medium text-red-500">Було</div>
                          <div className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden">
                            <img 
                              src={currentCaseData.beforeImage} 
                              alt="До" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-center font-medium text-green-500">Стало</div>
                          <div className="aspect-[3/4] bg-gray-200 rounded-xl overflow-hidden">
                            <img 
                              src={currentCaseData.afterImage} 
                              alt="Після" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-bold">
                          <TrendingUp className="w-4 h-4" />
                          Результат досягнуто
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Growth Chart */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                📊 Що змінюється, коли ми працюємо разом?
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Середній результат по 5 останніх клієнтах
              </p>
            </div>

            <div className={`p-8 rounded-3xl ${
              isDark 
                ? 'bg-gray-800/70 border border-gray-700/50' 
                : 'bg-white/90 border border-gray-200/50'
            } backdrop-blur-md shadow-2xl`}>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">CTR</div>
                  <div className="text-sm text-gray-500">Click Through Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">Reach</div>
                  <div className="text-sm text-gray-500">Охоплення</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500 mb-2">Followers</div>
                  <div className="text-sm text-gray-500">Підписники</div>
                </div>
              </div>

              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 text-sm font-medium">{data.month}</div>
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.ctr / 8) * 100}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium">{data.ctr}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.reach / 100000) * 100}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(data.reach / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(data.followers / 6000) * 100}%` }}
                            transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(data.followers / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-xl ${
                isDark ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'
              }`}>
                <p className="text-sm">
                  📈 Дані підтягуємо з Instagram/Meta Ads Manager. 
                  Це реальні показники, а не прогнози!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                🏆 Топ 3 досягнення
              </h2>
              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Рекорди, якими ми пишаємося
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-8 rounded-2xl text-center ${
                    isDark 
                      ? 'bg-gray-800/70 border border-gray-700/50' 
                      : 'bg-white/90 border border-gray-200/50'
                  } backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-5`}></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${achievement.gradient} text-white mb-6 shadow-lg`}>
                      {achievement.icon}
                    </div>
                    
                    <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                    <div className="text-lg font-semibold mb-3">{achievement.label}</div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.description}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className={`p-12 rounded-3xl text-center ${
              isDark 
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30' 
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50'
            } backdrop-blur-md shadow-2xl relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/15 to-purple-500/15 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  🤝 Хочеш подібні результати у своєму бізнесі?
                </h2>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Почни з безкоштовної консультації та отримай персональний план росту
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <Calendar className="w-5 h-5" />
                  <span className="relative z-10">Бронювати консультацію</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Або пиши напряму в{' '}
                  <a href="#" className="text-blue-500 hover:text-blue-600 font-medium">
                    Telegram → @yourhandle
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center space-y-6 pt-8"
          >
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Made with ❤️ for growth-driven brands
            </div>
            
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Юлія Бондаренко
            </div>
            
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className={`${isDark ? 'text-gray-500 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'} transition-colors duration-300 hover:underline`}>
                Instagram
              </a>
              <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
              <a href="#" className={`${isDark ? 'text-gray-500 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'} transition-colors duration-300 hover:underline`}>
                Telegram
              </a>
              <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
              <a href="#" className={`${isDark ? 'text-gray-500 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'} transition-colors duration-300 hover:underline`}>
                Політика конфіденційності
              </a>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-40">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl shadow-purple-500/25 backdrop-blur-md"
        >
          <span className="flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Бронювати консультацію
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default CaseMachine; 