import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Instagram, 
  MessageCircle, 
  Linkedin, 
  Calendar,
  Users,
  Target,
  ArrowRight,
  Mail,
  Sun,
  Moon,
  ChevronLeft,
  Star,
  TrendingUp,
  Zap,
  Download,
  CheckCircle,
  Sparkles,
  Clock,
  Shield,
  Globe,
  Award,
  Play,
  ExternalLink,
  Heart,
  Eye,
  BarChart3,
  Rocket,
  Leaf,
  Camera,
  Video,
  Megaphone,
  PenTool,
  Lightbulb,
  Gift,
  Flame,
  Crown,
  Gem,
  Wand2,
  Headphones,
  Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LinkCore: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [email, setEmail] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Faster initial load for mobile
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Highly optimized animation variants for mobile performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: shouldReduceMotion ? 0.2 : 0.4,
        staggerChildren: shouldReduceMotion ? 0.02 : 0.05
      }
    }
  }), [shouldReduceMotion]);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 5 : 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: shouldReduceMotion ? 0.2 : 0.3,
        ease: "easeOut"
      }
    }
  }), [shouldReduceMotion]);

  // Simplified hover variants for better mobile performance
  const hoverVariants = useMemo(() => ({
    hover: shouldReduceMotion ? {} : { 
      scale: 1.02, 
      y: -1,
      transition: { duration: 0.2 }
    }
  }), [shouldReduceMotion]);

  const mainServices = [
    {
      id: 'consultation',
      title: 'VIP Консультація',
      subtitle: 'Персональний розбір твого профілю',
      description: 'Глибокий аудит + стратегія росту + план дій на місяць. 90 хвилин, які змінять твій SMM назавжди. Я особисто проаналізую твій контент і дам конкретні рекомендації.',
      price: '1,200',
      currency: 'грн',
      time: 'Сьогодні',
      icon: <Eye className="w-6 h-6" />,
      bgGradient: 'from-emerald-400 via-green-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/25',
      popular: true,
      features: ['Аудит профілю', 'Стратегія росту', 'План дій', 'Бонуси'],
      emoji: '🎯',
      guarantee: 'Гарантія результату або повернення коштів'
    },
    {
      id: 'content',
      title: 'Контент-стратегія',
      subtitle: 'Від ідеї до вірального контенту',
      description: 'Створюю контент, який зупиняє скрол і змушує підписуватися. Кожен пост — це крок до твоєї мети. Працюю з трендами і психологією аудиторії.',
      price: '2,500',
      currency: 'грн',
      time: '3-5 днів',
      icon: <PenTool className="w-6 h-6" />,
      bgGradient: 'from-green-400 via-emerald-500 to-cyan-600',
      shadowColor: 'shadow-green-500/25',
      features: ['Контент-план', 'Трендові формати', 'Копірайтинг', 'Візуали'],
      emoji: '✨',
      guarantee: 'Мінімум 30% зростання охоплення'
    },
    {
      id: 'ads',
      title: 'Таргетована реклама',
      subtitle: 'ROI від 300% гарантовано',
      description: 'Налаштовую рекламу, яка приносить клієнтів, а не просто лайки. Кожна гривня працює на результат. Використовую авторські методики таргетингу.',
      price: '3,000',
      currency: 'грн',
      time: '1-2 дні',
      icon: <Rocket className="w-6 h-6" />,
      bgGradient: 'from-teal-400 via-green-500 to-emerald-600',
      shadowColor: 'shadow-teal-500/25',
      features: ['Аналіз аудиторії', 'Креативи', 'A/B тести', 'Оптимізація'],
      emoji: '🚀',
      guarantee: 'ROI від 300% або доопрацювання безкоштовно'
    }
  ];

  const quickLinks = [
    {
      title: 'Instagram',
      subtitle: '25K підписників',
      icon: <Instagram className="w-5 h-5" />,
      bgGradient: 'from-pink-400 via-rose-500 to-pink-600',
      followers: '25K',
      verified: true,
      description: 'Щоденні кейси та лайфхаки'
    },
    {
      title: 'TikTok',
      subtitle: '45K підписників',
      icon: <Video className="w-5 h-5" />,
      bgGradient: 'from-gray-700 via-gray-800 to-black',
      followers: '45K',
      verified: true,
      description: 'Вірусні тренди та секрети'
    },
    {
      title: 'Telegram',
      subtitle: '12K підписників',
      icon: <MessageCircle className="w-5 h-5" />,
      bgGradient: 'from-blue-400 via-blue-500 to-cyan-600',
      followers: '12K',
      verified: false,
      description: 'Ексклюзивні матеріали'
    },
    {
      title: 'LinkedIn',
      subtitle: '8K підписників',
      icon: <Linkedin className="w-5 h-5" />,
      bgGradient: 'from-blue-600 via-blue-700 to-blue-800',
      followers: '8K',
      verified: true,
      description: 'Професійні інсайти'
    }
  ];

  const testimonials = [
    {
      text: "Юлія — справжній професіонал! Наш салон краси перетворився на магніт для клієнтів. Записи через Instagram зросли в 5 разів! Тепер ми не встигаємо обслуговувати всіх бажаючих.",
      author: "Олена Коваленко",
      position: "Власниця @beauty.club",
      rating: 5.0,
      result: "+540% охоплення",
      avatar: "👩‍💼",
      verified: true,
      location: "Київ"
    },
    {
      text: "Неймовірний результат! Юлія знайшла нашу аудиторію в TikTok і створила вірусний контент. Тепер ми топ у фітнес-ніші! Клієнти самі знаходять нас.",
      author: "Максим Петренко", 
      position: "Фітнес-тренер @fitness.pro",
      rating: 4.9,
      result: "+320% продажів",
      avatar: "💪",
      verified: true,
      location: "Львів"
    },
    {
      text: "Завдяки Юлії ми залучили $500K інвестицій! Її стратегія в LinkedIn допомогла знайти правильних людей. Тепер наш стартап на новому рівні.",
      author: "Дмитро Іваненко",
      position: "CEO @tech.startup", 
      rating: 5.0,
      result: "$500K інвестицій",
      avatar: "👨‍💻",
      verified: true,
      location: "Одеса"
    }
  ];

  const stats = [
    { 
      number: '150+', 
      label: 'Проєктів', 
      icon: <Award className="w-5 h-5" />,
      bgGradient: 'from-yellow-400 to-orange-500',
      description: 'Успішно завершених',
      detail: 'За останні 2 роки'
    },
    { 
      number: '4.9', 
      label: 'Рейтинг', 
      icon: <Star className="w-5 h-5" />,
      bgGradient: 'from-emerald-400 to-green-500',
      description: 'Середня оцінка',
      detail: 'На всіх платформах'
    },
    { 
      number: '340%', 
      label: 'Зростання', 
      icon: <TrendingUp className="w-5 h-5" />,
      bgGradient: 'from-green-400 to-teal-500',
      description: 'Середній ROI',
      detail: 'Мінімальний показник'
    },
    { 
      number: '2.5M+', 
      label: 'Охоплення', 
      icon: <BarChart3 className="w-5 h-5" />,
      bgGradient: 'from-teal-400 to-cyan-500',
      description: 'Загальний reach',
      detail: 'Щомісячно'
    }
  ];

  const achievements = [
    { 
      icon: <CheckCircle className="w-4 h-4" />, 
      text: 'Facebook Blueprint',
      color: 'text-emerald-500'
    },
    { 
      icon: <CheckCircle className="w-4 h-4" />, 
      text: 'Google Ads Expert',
      color: 'text-green-500'
    },
    { 
      icon: <CheckCircle className="w-4 h-4" />, 
      text: '5+ років досвіду',
      color: 'text-teal-500'
    },
    { 
      icon: <CheckCircle className="w-4 h-4" />, 
      text: 'Топ-10 в Україні',
      color: 'text-cyan-500'
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const button = e.target as HTMLFormElement;
    const submitBtn = button.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✅ Надіслано! Перевір пошту';
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      setEmail('');
    }, 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-900'
    }`}>
      {/* Highly optimized background for mobile performance */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Simplified static pattern - no complex animations */}
        <div className={`absolute inset-0 opacity-[0.015] ${isDark ? 'bg-white' : 'bg-green-900'}`} 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='currentColor' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Minimal floating shapes - only if motion is not reduced */}
        {!shouldReduceMotion && (
          <motion.div
            className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200/5 to-emerald-300/5 rounded-full blur-xl"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </div>

      {/* Simplified Navigation */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link 
            to="/"
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-200 group ${
              isDark 
                ? 'bg-gray-800/90 hover:bg-gray-700/90 text-gray-300 hover:text-white border border-gray-700/50' 
                : 'bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 border border-green-200/50 shadow-lg shadow-green-500/10'
            } backdrop-blur-xl`}
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-semibold">Назад до головної</span>
          </Link>

          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-2xl transition-all duration-200 ${
              isDark 
                ? 'bg-gray-800/90 hover:bg-gray-700/90 border border-gray-700/50' 
                : 'bg-white/95 hover:bg-white border border-green-200/50 shadow-lg shadow-green-500/10'
            } backdrop-blur-xl`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Main Content with optimized animations */}
      <motion.div 
        className="pt-24 pb-16 px-6"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="max-w-md mx-auto space-y-8">
          
          {/* Highly optimized Profile Header */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-6"
          >
            {/* Optimized Avatar with minimal animations */}
            <div className="relative inline-block">
              <motion.div 
                className="relative"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`w-28 h-28 rounded-2xl overflow-hidden border-4 ${
                  isDark ? 'border-gray-700/50' : 'border-white/90'
                } shadow-xl ${isDark ? 'shadow-gray-900/50' : 'shadow-green-500/20'} relative`}>
                  <img 
                    src="/photo/avatar/ChatGPT Image May 24, 2025, 01_50_31 PM.png" 
                    alt="Юлія Бондаренко"
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                </div>
                
                {/* Simplified online status - reduced animation complexity */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg"
                  animate={shouldReduceMotion ? {} : { 
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </motion.div>

                {/* Minimal floating elements - only essential ones */}
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute -top-1 -right-1 text-lg"
                    animate={{ 
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Streamlined Name & Title */}
            <div className="space-y-3">
              <div>
                <motion.h1 
                  className="text-2xl font-bold tracking-tight mb-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Юлія Бондаренко
                </motion.h1>
                <motion.p 
                  className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  SMM-спеціаліст • Топ-10 в Україні
                </motion.p>
                <motion.p 
                  className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-600'} font-medium`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  🎯 Допомагаю бізнесу заробляти в соцмережах
                </motion.p>
              </div>
              
              {/* Simplified Badge */}
              <motion.div
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                  isDark 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                } shadow-lg backdrop-blur-sm`}
              >
                <Crown className="w-4 h-4" />
                Сертифікований експерт
                <Sparkles className="w-4 h-4" />
              </motion.div>

              {/* Compact Achievements */}
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      isDark ? 'bg-gray-800/30' : 'bg-white/50'
                    } backdrop-blur-sm`}
                  >
                    <div className={achievement.color}>{achievement.icon}</div>
                    <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {achievement.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Optimized Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : hoverVariants.hover}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/50' 
                      : 'bg-white/90 border border-green-100/50 hover:border-green-200/50 shadow-lg hover:shadow-xl'
                  } backdrop-blur-md group cursor-pointer relative overflow-hidden`}
                >
                  {/* Simplified gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-3 group-hover:opacity-5 transition-opacity duration-200`}></div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient} text-white mb-2 ${!shouldReduceMotion ? 'group-hover:scale-105' : ''} transition-transform duration-200 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold mb-1">{stat.number}</div>
                    <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>
                      {stat.description}
                    </div>
                    <div className={`text-xs ${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-medium`}>
                      {stat.detail}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Simplified Bio */}
            <motion.div
              variants={itemVariants}
              className={`p-5 rounded-xl ${
                isDark ? 'bg-gray-800/40' : 'bg-white/60'
              } backdrop-blur-sm border border-white/20`}
            >
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Привіт! 👋 Я Юлія, і я <span className="font-semibold text-emerald-600">закохана</span> в те, що роблю. 
                Перетворюю <span className="font-semibold text-emerald-600">Instagram</span> і{' '}
                <span className="font-semibold text-green-600">TikTok</span> на справжні машини для залучення клієнтів. 
                <br /><br />
                <span className="text-xs">
                  💡 Моя місія — допомогти тобі <span className="font-semibold">заробляти</span> на тому, що любиш, 
                  через соціальні мережі. Разом ми створимо контент, який працює!
                </span>
              </p>
            </motion.div>
          </motion.div>

          {/* Highly optimized Main Services */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="text-center">
              <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                🌱 Мої послуги
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Обирай те, що підходить саме тобі
              </p>
            </div>
            
            {mainServices.map((service, index) => (
              <motion.button
                key={service.id}
                variants={itemVariants}
                whileHover={shouldReduceMotion ? {} : hoverVariants.hover}
                whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                className={`w-full p-5 rounded-2xl transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-800/70 hover:bg-gray-800/90 border border-gray-700/50 hover:border-gray-600/50' 
                    : 'bg-white/95 hover:bg-white border border-green-100/50 hover:border-green-200/50'
                } backdrop-blur-md group relative ${service.shadowColor} hover:shadow-xl`}
              >
                <div className="flex items-start gap-4 relative">
                  <motion.div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.bgGradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg ${!shouldReduceMotion ? 'group-hover:scale-105' : ''} transition-transform duration-200 relative overflow-hidden`}
                    whileHover={shouldReduceMotion ? {} : { rotate: 3 }}
                  >
                    {/* Simplified icon background effect */}
                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="relative z-10">{service.icon}</div>
                  </motion.div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">{service.title}</h3>
                          <span className="text-lg">{service.emoji}</span>
                        </div>
                        <p className={`text-xs font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          {service.subtitle}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          {service.price}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {service.currency}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {service.description}
                    </p>
                    
                    {/* Compact Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {service.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                            isDark 
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Compact Guarantee */}
                    <div className={`text-xs mb-3 p-2 rounded-lg ${
                      isDark ? 'bg-green-500/10 text-green-300' : 'bg-green-50 text-green-700'
                    } border border-green-200/30`}>
                      🛡️ {service.guarantee}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {service.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-emerald-500 group-hover:text-green-500">
                        <span className="text-sm font-medium">Обрати</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimized popular badge */}
                {service.popular && (
                  <motion.div 
                    className="absolute -top-3 -left-3 z-20"
                    animate={shouldReduceMotion ? {} : { 
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg border-2 border-white">
                      <Flame className="w-3 h-3" />
                      Хіт
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Highly optimized Social Media Links */}
          <motion.div
            variants={itemVariants}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                📱 Мої соціальні мережі
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Підписуйся для щоденних лайфхаків
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={itemVariants}
                  whileHover={shouldReduceMotion ? {} : hoverVariants.hover}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-800/70 hover:bg-gray-800/90 border border-gray-700/50 hover:border-gray-600/50' 
                      : 'bg-white/95 hover:bg-white border border-green-100/50 hover:border-green-200/50'
                  } backdrop-blur-md group shadow-lg hover:shadow-xl relative overflow-hidden`}
                >
                  {/* Simplified gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.bgGradient} opacity-3 group-hover:opacity-5 transition-opacity duration-200`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div 
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${link.bgGradient} flex items-center justify-center text-white shadow-lg ${!shouldReduceMotion ? 'group-hover:scale-105' : ''} transition-transform duration-200`}
                        whileHover={shouldReduceMotion ? {} : { rotate: 5 }}
                      >
                        {link.icon}
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="text-sm font-bold">{link.title}</div>
                          {link.verified && (
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {link.subtitle}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {link.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        Підписатися
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  💬 Відгуки клієнтів
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Реальні історії успіху
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(4.9)}
                </div>
                <span className="text-base font-bold">4.9</span>
              </div>
            </div>
            
            {testimonials.slice(0, 2).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-xl ${
                  isDark 
                    ? 'bg-gray-800/70 border border-gray-700/50' 
                    : 'bg-white/95 border border-green-100/50'
                } backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {/* Quote decoration */}
                <div className={`absolute top-3 right-3 text-4xl opacity-10 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                  "
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-xl shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{testimonial.author}</h4>
                        {testimonial.verified && (
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-1`}>
                        {testimonial.position}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        📍 {testimonial.location}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(testimonial.rating)}
                        <span className="text-xs font-medium ml-1">{testimonial.rating}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      isDark 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {testimonial.result}
                    </div>
                  </div>
                  
                  <blockquote className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'} italic`}>
                    "{testimonial.text}"
                  </blockquote>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Lead Magnet */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.0 }}
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-br from-emerald-900/50 to-green-900/50 border border-emerald-500/30' 
                : 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50'
            } backdrop-blur-md shadow-2xl relative overflow-hidden`}
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-400/15 to-teal-500/15 rounded-full blur-2xl"></div>
            
            <div className="text-center space-y-5 relative z-10">
              <motion.div
                animate={{ 
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="text-5xl"
              >
                🎁
              </motion.div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Безкоштовний AI-календар</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  <span className="font-semibold text-emerald-600">14 днів готового контенту</span> для Instagram
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  💰 Вартість: 500 грн • Тобі: <span className="font-bold text-emerald-600">БЕЗКОШТОВНО</span>
                </p>
              </div>

              {/* Compact Features */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: <Lightbulb className="w-4 h-4" />, text: 'Ідеї постів', desc: '14 унікальних' },
                  { icon: <Target className="w-4 h-4" />, text: 'Хештеги', desc: 'Топові теги' },
                  { icon: <TrendingUp className="w-4 h-4" />, text: 'Тренди', desc: 'Актуальні' }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg ${
                      isDark ? 'bg-emerald-500/10' : 'bg-emerald-100/50'
                    } backdrop-blur-sm`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`p-2 rounded-lg ${
                      isDark ? 'bg-emerald-500/20' : 'bg-emerald-200'
                    } text-emerald-600`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{item.text}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Твоя електронна пошта"
                  required
                  className={`w-full px-5 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                    isDark 
                      ? 'bg-gray-800/80 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/90 border-emerald-200 text-gray-900 placeholder-gray-500'
                  } shadow-lg`}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <Download className="w-4 h-4" />
                    Отримати календар безкоштовно
                    <Gift className="w-4 h-4" />
                  </span>
                </motion.button>
              </form>

              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Без спаму</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>GDPR</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-500" />
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>З любов'ю</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="space-y-3"
          >
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="flex items-center justify-center gap-3 relative z-10">
                <MessageCircle className="w-5 h-5" />
                Написати в Telegram
                <span className="text-xs bg-white/20 px-2 py-1 rounded-lg">Швидко</span>
              </span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 border-2 ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500' 
                  : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
              } shadow-lg hover:shadow-xl relative overflow-hidden`}
            >
              <span className="flex items-center justify-center gap-3">
                <Calendar className="w-5 h-5" />
                Забронювати дзвінок
                <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded-lg">Безкоштовно</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.4 }}
            className="text-center space-y-6 pt-8"
          >
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 Юлія Бондаренко • SMM-спеціаліст
            </div>
            
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className={`${isDark ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-500 hover:text-emerald-600'} transition-colors duration-300 hover:underline`}>
                Політика конфіденційності
              </a>
              <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
              <a href="#" className={`${isDark ? 'text-gray-500 hover:text-emerald-400' : 'text-gray-500 hover:text-emerald-600'} transition-colors duration-300 hover:underline`}>
                Контакти
              </a>
            </div>
            
            <motion.p 
              className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Зроблено з 💚 для твого успіху
            </motion.p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default LinkCore; 