import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, useLanguage } from '../hooks/useTranslation';

const InstructionsPanel: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Function to get localized text for complex sections
  const getLocalizedText = (key: string) => {
    const texts = {
      // Instructions header
      'instructions.full.guide': {
        uk: 'Повний посібник роботи з системою',
        en: 'Complete system guide',
        ru: 'Полное руководство по работе с системой'
      },
      'instructions.version': {
        uk: 'v1.0.0',
        en: 'v1.0.0',
        ru: 'v1.0.0'
      },
      
      // Main titles and descriptions
      'overview.main.title': {
        uk: 'SMM OS - Операційна система для SMM',
        en: 'SMM OS - Operating System for SMM',
        ru: 'SMM OS - Операционная система для SMM'
      },
      'overview.main.subtitle': {
        uk: 'Професійна платформа нового покоління для створення інтерактивних веб-презентацій',
        en: 'Next-generation professional platform for creating interactive web presentations',
        ru: 'Профессиональная платформа нового поколения для создания интерактивных веб-презентаций'
      },
      'overview.description': {
        uk: 'це революційна система для створення професійних веб-сайтів з найсучаснішими технологіями. Платформа поєднує потужність React, красу Tailwind CSS, інтерактивність Framer Motion та магію 3D анімацій Spline в одній зручній системі керування.',
        en: 'is a revolutionary system for creating professional websites with cutting-edge technologies. The platform combines the power of React, the beauty of Tailwind CSS, Framer Motion interactivity and the magic of Spline 3D animations in one convenient management system.',
        ru: 'это революционная система для создания профессиональных веб-сайтов с самыми современными технологиями. Платформа объединяет мощь React, красоту Tailwind CSS, интерактивность Framer Motion и магию 3D анимаций Spline в одной удобной системе управления.'
      },
      'overview.main.idea': {
        uk: 'Основна ідея',
        en: 'Main Idea',
        ru: 'Основная идея'
      },
      'overview.main.idea.description': {
        uk: 'Створити "all-in-one" рішення, де SMM спеціаліст може за лічені хвилини зробити сайт, який виглядає як результат роботи цілої команди розробників протягом місяців.',
        en: 'Create an "all-in-one" solution where an SMM specialist can create a website in minutes that looks like the result of an entire development team\'s work over months.',
        ru: 'Создать "all-in-one" решение, где SMM специалист может за считанные минуты сделать сайт, который выглядит как результат работы целой команды разработчиков в течение месяцев.'
      },

      // Section headers
      'overview.unique.technologies': {
        uk: 'Унікальні технології',
        en: 'Unique Technologies',
        ru: 'Уникальные технологии'
      },
      'overview.frontend.stack': {
        uk: 'FRONTEND STACK',
        en: 'FRONTEND STACK',
        ru: 'FRONTEND СТЕК'
      },
      'overview.animations.3d': {
        uk: 'АНІМАЦІЇ ТА 3D',
        en: 'ANIMATIONS & 3D',
        ru: 'АНИМАЦИИ И 3D'
      },
      'overview.system.architecture': {
        uk: 'Архітектура системи',
        en: 'System Architecture',
        ru: 'Архитектура системы'
      },
      'overview.constructors': {
        uk: 'КОНСТРУКТОРИ',
        en: 'CONSTRUCTORS',
        ru: 'КОНСТРУКТОРЫ'
      },
      'overview.media.system': {
        uk: 'МЕДІА СИСТЕМА',
        en: 'MEDIA SYSTEM',
        ru: 'МЕДИА СИСТЕМА'
      },
      'overview.analytics': {
        uk: 'АНАЛІТИКА',
        en: 'ANALYTICS',
        ru: 'АНАЛИТИКА'
      },
      'overview.carousel.main.feature': {
        uk: '3D Карусель - головна фішка',
        en: '3D Carousel - Main Feature',
        ru: '3D Карусель - главная фишка'
      },
      'overview.carousel.unique.styles': {
        uk: '10 унікальних стилів каруселі:',
        en: '10 unique carousel styles:',
        ru: '10 уникальных стилей карусели:'
      },
      'overview.carousel.technical.capabilities': {
        uk: 'Технічні можливості:',
        en: 'Technical capabilities:',
        ru: 'Технические возможности:'
      },
      'overview.audio.system': {
        uk: 'Професійна аудіо система',
        en: 'Professional Audio System',
        ru: 'Профессиональная аудио система'
      },
      'overview.audio.types': {
        uk: 'ТИПИ ЗВУКІВ',
        en: 'SOUND TYPES',
        ru: 'ТИПЫ ЗВУКОВ'
      },
      'overview.audio.technologies': {
        uk: 'ТЕХНОЛОГІЇ',
        en: 'TECHNOLOGIES',
        ru: 'ТЕХНОЛОГИИ'
      },
      'overview.target.audience': {
        uk: 'Для кого призначена система',
        en: 'Who the system is for',
        ru: 'Для кого предназначена система'
      },

      // Frontend Stack details
      'frontend.react18': {
        uk: 'Найновіша версія з Concurrent Features',
        en: 'Latest version with Concurrent Features',
        ru: 'Новейшая версия с Concurrent Features'
      },
      'frontend.typescript': {
        uk: 'Типобезпека та автодоповнення',
        en: 'Type safety and autocompletion',
        ru: 'Типобезопасность и автодополнение'
      },
      'frontend.vite': {
        uk: 'Миттєве завантаження і Hot Reload',
        en: 'Instant loading and Hot Reload',
        ru: 'Мгновенная загрузка и Hot Reload'
      },
      'frontend.tailwind': {
        uk: 'Utility-first стилізація',
        en: 'Utility-first styling',
        ru: 'Utility-first стилизация'
      },

      // Animations & 3D details
      'animations.framer': {
        uk: '12 типів анімацій (fadeIn, slideUp, bounce, typewriter тощо)',
        en: '12 animation types (fadeIn, slideUp, bounce, typewriter, etc.)',
        ru: '12 типов анимаций (fadeIn, slideUp, bounce, typewriter и др.)'
      },
      'animations.spline': {
        uk: 'Інтеграція інтерактивних 3D сцен',
        en: 'Interactive 3D scenes integration',
        ru: 'Интеграция интерактивных 3D сцен'
      },
      'animations.particles': {
        uk: 'Динамічні частинки',
        en: 'Dynamic particles',
        ru: 'Динамические частицы'
      },
      'animations.css3d': {
        uk: 'Апаратне прискорення',
        en: 'Hardware acceleration',
        ru: 'Аппаратное ускорение'
      },

      // Constructors details
      'constructors.intro': {
        uk: 'Вступна сторінка з 3D',
        en: 'Intro page with 3D',
        ru: 'Вступительная страница с 3D'
      },
      'constructors.main': {
        uk: '3D карусель з 10 стилями',
        en: '3D carousel with 10 styles',
        ru: '3D карусель с 10 стилями'
      },
      'constructors.preview': {
        uk: 'Система попереднього перегляду',
        en: 'Preview system',
        ru: 'Система предварительного просмотра'
      },

      // Media System details
      'media.indexeddb': {
        uk: 'Збереження великих файлів',
        en: 'Large file storage',
        ru: 'Хранение больших файлов'
      },
      'media.smart.upload': {
        uk: 'Автооптимізація медіа',
        en: 'Auto media optimization',
        ru: 'Автооптимизация медиа'
      },
      'media.drag.drop': {
        uk: 'Інтуїтивне завантаження',
        en: 'Intuitive uploading',
        ru: 'Интуитивная загрузка'
      },
      'media.format.convert': {
        uk: 'Автоконвертація форматів',
        en: 'Auto format conversion',
        ru: 'Автоконвертация форматов'
      },

      // Analytics details
      'analytics.realtime': {
        uk: 'Відстеження в реальному часі',
        en: 'Real-time tracking',
        ru: 'Отслеживание в реальном времени'
      },
      'analytics.google': {
        uk: 'Інтеграція з GA4',
        en: 'GA4 integration',
        ru: 'Интеграция с GA4'
      },
      'analytics.charts': {
        uk: 'Інтерактивні графіки Recharts',
        en: 'Interactive Recharts graphics',
        ru: 'Интерактивные графики Recharts'
      },
      'analytics.export': {
        uk: 'CSV/PDF звіти',
        en: 'CSV/PDF reports',
        ru: 'CSV/PDF отчеты'
      },

      // Carousel styles
      'carousel.classic.desc': {
        uk: 'Класичний дизайн',
        en: 'Classic design',
        ru: 'Классический дизайн'
      },
      'carousel.modern.desc': {
        uk: 'Сучасні градієнти',
        en: 'Modern gradients',
        ru: 'Современные градиенты'
      },
      'carousel.premium.desc': {
        uk: 'Преміум анімації',
        en: 'Premium animations',
        ru: 'Премиум анимации'
      },
      'carousel.neon.desc': {
        uk: 'Неонові ефекти',
        en: 'Neon effects',
        ru: 'Неоновые эффекты'
      },
      'carousel.glass.desc': {
        uk: 'Скляний морфізм',
        en: 'Glass morphism',
        ru: 'Стеклянный морфизм'
      },
      'carousel.elegant.desc': {
        uk: 'Елегантність',
        en: 'Elegance',
        ru: 'Элегантность'
      },

      // Technical capabilities
      'technical.css3d': {
        uk: 'CSS 3D Transforms для апаратного прискорення',
        en: 'CSS 3D Transforms for hardware acceleration',
        ru: 'CSS 3D Transforms для аппаратного ускорения'
      },
      'technical.smooth60fps': {
        uk: 'Smooth 60fps анімації через Framer Motion',
        en: 'Smooth 60fps animations via Framer Motion',
        ru: 'Плавные 60fps анимации через Framer Motion'
      },
      'technical.responsive': {
        uk: 'Responsive дизайн з автоадаптацією',
        en: 'Responsive design with auto-adaptation',
        ru: 'Responsive дизайн с автоадаптацией'
      },
      'technical.touch.mouse': {
        uk: 'Touch/Mouse support для всіх пристроїв',
        en: 'Touch/Mouse support for all devices',
        ru: 'Touch/Mouse поддержка для всех устройств'
      },
      'technical.lazy.loading': {
        uk: 'Lazy loading для оптимізації швидкості',
        en: 'Lazy loading for speed optimization',
        ru: 'Lazy loading для оптимизации скорости'
      },
      'technical.custom.sounds': {
        uk: 'Custom звукові ефекти для взаємодії',
        en: 'Custom sound effects for interaction',
        ru: 'Кастомные звуковые эффекты для взаимодействия'
      },

      // Audio types
      'audio.background.music': {
        uk: 'Фонова музика з автозапуском',
        en: 'Background music with autostart',
        ru: 'Фоновая музыка с автостартом'
      },
      'audio.hover.sounds': {
        uk: 'Звуки при наведенні',
        en: 'Hover sounds',
        ru: 'Звуки при наведении'
      },
      'audio.click.sounds': {
        uk: 'Звуки натискань',
        en: 'Click sounds',
        ru: 'Звуки нажатий'
      },
      'audio.carousel.sounds': {
        uk: 'Спеціальні звуки для каруселі',
        en: 'Special carousel sounds',
        ru: 'Специальные звуки для карусели'
      },
      'audio.ui.sounds': {
        uk: 'Звуки інтерфейсу',
        en: 'UI sounds',
        ru: 'Звуки интерфейса'
      },

      // Audio technologies
      'audio.web.api': {
        uk: 'Високоякісне відтворення',
        en: 'High-quality playback',
        ru: 'Высококачественное воспроизведение'
      },
      'audio.volume.control': {
        uk: 'Індивідуальне керування гучністю',
        en: 'Individual volume control',
        ru: 'Индивидуальное управление громкостью'
      },
      'audio.auto.optimization': {
        uk: 'Автооптимізація аудіо',
        en: 'Auto audio optimization',
        ru: 'Автооптимизация аудио'
      },
      'audio.format.support': {
        uk: 'MP3, WAV, OGG, M4A',
        en: 'MP3, WAV, OGG, M4A',
        ru: 'MP3, WAV, OGG, M4A'
      },

      // Target audience
      'audience.smm.agencies': {
        uk: 'SMM агентства',
        en: 'SMM agencies',
        ru: 'SMM агентства'
      },
      'audience.smm.desc': {
        uk: 'Створення сайтів для клієнтів',
        en: 'Creating websites for clients',
        ru: 'Создание сайтов для клиентов'
      },
      'audience.designers': {
        uk: 'Дизайнери',
        en: 'Designers',
        ru: 'Дизайнеры'
      },
      'audience.designers.desc': {
        uk: 'Реалізація креативних ідей без коду',
        en: 'Creative ideas implementation without code',
        ru: 'Реализация креативных идей без кода'
      },
      'audience.entrepreneurs': {
        uk: 'Підприємці',
        en: 'Entrepreneurs',
        ru: 'Предприниматели'
      },
      'audience.entrepreneurs.desc': {
        uk: 'Презентація бізнесу та послуг',
        en: 'Business and services presentation',
        ru: 'Презентация бизнеса и услуг'
      },
      'audience.freelancers': {
        uk: 'Фрілансери',
        en: 'Freelancers',
        ru: 'Фрилансеры'
      },
      'audience.freelancers.desc': {
        uk: 'Швидке створення портфоліо',
        en: 'Quick portfolio creation',
        ru: 'Быстрое создание портфолио'
      },
      'audience.startups': {
        uk: 'Стартапи',
        en: 'Startups',
        ru: 'Стартапы'
      },
      'audience.startups.desc': {
        uk: 'Презентація продукту інвесторам',
        en: 'Product presentation to investors',
        ru: 'Презентация продукта инвесторам'
      },
      'audience.students': {
        uk: 'Студенти IT',
        en: 'IT Students',
        ru: 'Студенты IT'
      },
      'audience.students.desc': {
        uk: 'Вивчення сучасних веб-технологій',
        en: 'Learning modern web technologies',
        ru: 'Изучение современных веб-технологий'
      },

      // Tips sections
      'tips.main.title': {
        uk: 'Корисні поради та секрети',
        en: 'Useful Tips and Secrets',
        ru: 'Полезные советы и секреты'
      },
      'tips.main.subtitle': {
        uk: 'Професійні лайфхаки для максимальної ефективності',
        en: 'Professional lifehacks for maximum efficiency',
        ru: 'Профессиональные лайфхаки для максимальной эффективности'
      },
      'tips.performance.optimization': {
        uk: '🚀 Оптимізація швидкості та продуктивності',
        en: '🚀 Speed and Performance Optimization',
        ru: '🚀 Оптимизация скорости и производительности'
      },
      'tips.file.sizes': {
        uk: '📁 Розміри файлів для ідеальної роботи',
        en: '📁 File sizes for perfect operation',
        ru: '📁 Размеры файлов для идеальной работы'
      },
      'tips.best.formats': {
        uk: '🎯 Формати для найкращої якості',
        en: '🎯 Formats for best quality',
        ru: '🎯 Форматы для лучшего качества'
      },
      'tips.design.secrets': {
        uk: '🎨 Секрети професійного дизайну',
        en: '🎨 Professional Design Secrets',
        ru: '🎨 Секреты профессионального дизайна'
      },
      'tips.color.harmony': {
        uk: '🎨 Кольорова гармонія',
        en: '🎨 Color harmony',
        ru: '🎨 Цветовая гармония'
      },
      'tips.responsive.design': {
        uk: '📱 Адаптивний дизайн',
        en: '📱 Responsive design',
        ru: '📱 Адаптивный дизайн'
      },
      'tips.audio.mastery': {
        uk: '🎵 Майстерність звукового дизайну',
        en: '🎵 Audio Design Mastery',
        ru: '🎵 Мастерство звукового дизайна'
      },
      'tips.volume.settings': {
        uk: '🔊 Налаштування гучності',
        en: '🔊 Volume settings',
        ru: '🔊 Настройки громкости'
      },
      'tips.professional.advice': {
        uk: '🎼 Професійні поради',
        en: '🎼 Professional advice',
        ru: '🎼 Профессиональные советы'
      },
      'tips.animations.3d.effects': {
        uk: '✨ Анімації та 3D ефекти',
        en: '✨ Animations and 3D Effects',
        ru: '✨ Анимации и 3D эффекты'
      },
      'tips.animation.choice': {
        uk: '🎬 Вибір анімацій для елементів',
        en: '🎬 Animation choice for elements',
        ru: '🎬 Выбор анимаций для элементов'
      },
      'tips.spline.optimization': {
        uk: '🚀 Spline 3D оптимізація',
        en: '🚀 Spline 3D optimization',
        ru: '🚀 Spline 3D оптимизация'
      },
      'tips.hotkeys': {
        uk: '⚡ Швидкі клавіші та лайфхаки',
        en: '⚡ Hotkeys and Lifehacks',
        ru: '⚡ Горячие клавиши и лайфхаки'
      },
      'tips.keyboard.shortcuts': {
        uk: '⌨️ Горячі клавіші',
        en: '⌨️ Keyboard shortcuts',
        ru: '⌨️ Горячие клавиши'
      },
      'tips.quick.actions': {
        uk: '🎯 Швидкі дії',
        en: '🎯 Quick actions',
        ru: '🎯 Быстрые действия'
      },
      'tips.data.security': {
        uk: '💾 Безпека та резервування даних',
        en: '💾 Data Security and Backup',
        ru: '💾 Безопасность и резервирование данных'
      },
      'tips.backup.strategy': {
        uk: '🛡️ Стратегія резервування',
        en: '🛡️ Backup strategy',
        ru: '🛡️ Стратегия резервирования'
      },
      'tips.device.migration': {
        uk: '🔄 Міграція між пристроями',
        en: '🔄 Device migration',
        ru: '🔄 Миграция между устройствами'
      },
      'tips.seo.promotion': {
        uk: '📊 SEO та продвижение',
        en: '📊 SEO and Promotion',
        ru: '📊 SEO и продвижение'
      },
      'tips.seo.basics': {
        uk: '🔍 Основи SEO',
        en: '🔍 SEO basics',
        ru: '🔍 Основы SEO'
      },
      'tips.technical.optimization': {
        uk: '🚀 Технічна оптимізація',
        en: '🚀 Technical optimization',
        ru: '🚀 Техническая оптимизация'
      },
      'tips.professional.tricks': {
        uk: '🎯 Професійні трюки',
        en: '🎯 Professional Tricks',
        ru: '🎯 Профессиональные трюки'
      },
      'tips.design.secrets.pro': {
        uk: '🎨 Дизайнерські секрети',
        en: '🎨 Design secrets',
        ru: '🎨 Дизайнерские секреты'
      },
      'tips.client.work': {
        uk: '⚡ Для клієнтської роботи',
        en: '⚡ For client work',
        ru: '⚡ Для клиентской работы'
      },

      // Navigation
      'nav.overview.title': {
        uk: 'Огляд системи',
        en: 'System Overview',
        ru: 'Обзор системы'
      },
      'nav.tips.title': {
        uk: 'Корисні поради',
        en: 'Useful Tips',
        ru: 'Полезные советы'
      },
      'nav.preview': {
        uk: 'Попередній перегляд',
        en: 'Preview Constructor',
        ru: 'Предварительный просмотр'
      },
      'nav.preview.desc': {
        uk: 'Покрокові інструкції для тестування та публікації сайту',
        en: 'Step-by-step instructions for testing and publishing the site',
        ru: 'Пошаговые инструкции для тестирования и публикации сайта'
      },
      'nav.intro': {
        uk: 'Конструктор інтро',
        en: 'Intro Constructor',
        ru: 'Конструктор интро'
      },
      'nav.main': {
        uk: 'Головний конструктор',
        en: 'Main Constructor',
        ru: 'Главный конструктор'
      },
      'nav.content': {
        uk: 'Менеджер контенту',
        en: 'Content Manager',
        ru: 'Менеджер контента'
      },
      'nav.analytics': {
        uk: 'Система аналітики',
        en: 'Analytics System',
        ru: 'Система аналитики'
      },
      'nav.settings': {
        uk: 'Налаштування системи',
        en: 'System Settings',
        ru: 'Настройки системы'
      },

      // Preview section detailed instructions
      'preview.step1.title': {
        uk: '1️⃣ Тестування сайту',
        en: '1️⃣ Website Testing',
        ru: '1️⃣ Тестирование сайта'
      },
      'preview.step1.desc1': {
        uk: 'Натисніть кнопку "Попередній перегляд" в нижній частині панелі',
        en: 'Click the "Preview" button at the bottom of the panel',
        ru: 'Нажмите кнопку "Предварительный просмотр" в нижней части панели'
      },
      'preview.step1.desc2': {
        uk: 'Перевірте всі сторінки:',
        en: 'Check all pages:',
        ru: 'Проверьте все страницы:'
      },
      'preview.step1.intro': {
        uk: 'Інтро сторінка: Переконайтеся що всі тексти відображаються правильно',
        en: 'Intro page: Make sure all texts display correctly',
        ru: 'Интро страница: Убедитесь, что все тексты отображаются правильно'
      },
      'preview.step1.main': {
        uk: 'Головна сторінка: Протестуйте роботу каруселі',
        en: 'Main page: Test carousel functionality',
        ru: 'Главная страница: Протестируйте работу карусели'
      },
      'preview.step1.responsive': {
        uk: 'Адаптивність: Змініть розмір вікна браузера',
        en: 'Responsiveness: Change browser window size',
        ru: 'Адаптивность: Измените размер окна браузера'
      },
      'preview.step1.desc3': {
        uk: 'Протестуйте інтерактивність:',
        en: 'Test interactivity:',
        ru: 'Протестируйте интерактивность:'
      },
      'preview.step1.hover': {
        uk: 'Наведіть мишку на кнопки (повинен з\'явитися звук)',
        en: 'Hover over buttons (sound should appear)',
        ru: 'Наведите мышку на кнопки (должен появиться звук)'
      },
      'preview.step1.click': {
        uk: 'Клікніть по елементах каруселі',
        en: 'Click on carousel elements',
        ru: 'Кликните по элементам карусели'
      },
      'preview.step1.links': {
        uk: 'Перевірте всі посилання',
        en: 'Check all links',
        ru: 'Проверьте все ссылки'
      },
      'preview.step1.music': {
        uk: 'Протестуйте фонову музику',
        en: 'Test background music',
        ru: 'Протестируйте фоновую музыку'
      },

      'preview.step2.title': {
        uk: '2️⃣ Тестування на різних пристроях',
        en: '2️⃣ Testing on Different Devices',
        ru: '2️⃣ Тестирование на разных устройствах'
      },
      'preview.step2.desc1': {
        uk: 'Відкрийте інструменти розробника (F12)',
        en: 'Open developer tools (F12)',
        ru: 'Откройте инструменты разработчика (F12)'
      },
      'preview.step2.desc2': {
        uk: 'Натисніть на іконку мобільного режиму',
        en: 'Click on mobile mode icon',
        ru: 'Нажмите на иконку мобильного режима'
      },
      'preview.step2.desc3': {
        uk: 'Протестуйте на різних розмірах:',
        en: 'Test on different sizes:',
        ru: 'Протестируйте на разных размерах:'
      },
      'preview.step2.desc4': {
        uk: 'Перевірте швидкість завантаження:',
        en: 'Check loading speed:',
        ru: 'Проверьте скорость загрузки:'
      },
      'preview.step2.network': {
        uk: 'Оберіть вкладку "Network" в інструментах розробника',
        en: 'Select "Network" tab in developer tools',
        ru: 'Выберите вкладку "Network" в инструментах разработчика'
      },
      'preview.step2.slow3g': {
        uk: 'Встановіть повільне з\'єднання "Slow 3G"',
        en: 'Set slow connection "Slow 3G"',
        ru: 'Установите медленное соединение "Slow 3G"'
      },
      'preview.step2.reload': {
        uk: 'Перезавантажте сторінку та перевірте час завантаження',
        en: 'Reload page and check loading time',
        ru: 'Перезагрузите страницу и проверьте время загрузки'
      },

      'preview.step3.title': {
        uk: '3️⃣ Експорт для публікації',
        en: '3️⃣ Export for Publishing',
        ru: '3️⃣ Экспорт для публикации'
      },
      'preview.step3.desc1': {
        uk: 'Натисніть кнопку "Експорт сайту" в адмін панелі',
        en: 'Click "Export Site" button in admin panel',
        ru: 'Нажмите кнопку "Экспорт сайта" в админ панели'
      },
      'preview.step3.desc2': {
        uk: 'Оберіть тип експорту:',
        en: 'Choose export type:',
        ru: 'Выберите тип экспорта:'
      },
      'preview.step3.html': {
        uk: 'HTML + CSS + JS: Статичний сайт для хостингу',
        en: 'HTML + CSS + JS: Static site for hosting',
        ru: 'HTML + CSS + JS: Статичный сайт для хостинга'
      },
      'preview.step3.zip': {
        uk: 'ZIP архів: Всі файли в одному архіві',
        en: 'ZIP archive: All files in one archive',
        ru: 'ZIP архив: Все файлы в одном архиве'
      },
      'preview.step3.pwa': {
        uk: 'Progressive Web App: PWA для мобільних пристроїв',
        en: 'Progressive Web App: PWA for mobile devices',
        ru: 'Progressive Web App: PWA для мобильных устройств'
      },
      'preview.step3.desc3': {
        uk: 'Налаштуйте параметри експорту:',
        en: 'Configure export parameters:',
        ru: 'Настройте параметры экспорта:'
      },
      'preview.step3.minify': {
        uk: 'Увімкніть мінімізацію коду для швидкості',
        en: 'Enable code minification for speed',
        ru: 'Включите минимизацию кода для скорости'
      },
      'preview.step3.optimize': {
        uk: 'Оптимізуйте зображення для мінімального розміру',
        en: 'Optimize images for minimal size',
        ru: 'Оптимизируйте изображения для минимального размера'
      },
      'preview.step3.service': {
        uk: 'Включіть Service Worker для офлайн роботи',
        en: 'Include Service Worker for offline functionality',
        ru: 'Включите Service Worker для офлайн работы'
      },

      'preview.step4.title': {
        uk: '4️⃣ Завантаження на хостинг',
        en: '4️⃣ Upload to Hosting',
        ru: '4️⃣ Загрузка на хостинг'
      },
      'preview.step4.popular': {
        uk: 'Популярні хостинги (безкоштовні):',
        en: 'Popular hosting services (free):',
        ru: 'Популярные хостинги (бесплатные):'
      },
      'preview.step4.netlify.desc': {
        uk: 'Netlify: Перетягніть ZIP файл на netlify.com',
        en: 'Netlify: Drag ZIP file to netlify.com',
        ru: 'Netlify: Перетащите ZIP файл на netlify.com'
      },
      'preview.step4.vercel.desc': {
        uk: 'Vercel: Підключіть GitHub репозиторій',
        en: 'Vercel: Connect GitHub repository',
        ru: 'Vercel: Подключите GitHub репозиторий'
      },
      'preview.step4.github.desc': {
        uk: 'GitHub Pages: Завантажте файли в репозиторій',
        en: 'GitHub Pages: Upload files to repository',
        ru: 'GitHub Pages: Загрузите файлы в репозиторий'
      },
      'preview.step4.firebase.desc': {
        uk: 'Firebase Hosting: Використовуйте Firebase CLI',
        en: 'Firebase Hosting: Use Firebase CLI',
        ru: 'Firebase Hosting: Используйте Firebase CLI'
      },
      'preview.step4.netlify.steps': {
        uk: 'Крок 1 (Netlify - найпростіший):',
        en: 'Step 1 (Netlify - easiest):',
        ru: 'Шаг 1 (Netlify - самый простой):'
      },
      'preview.step4.register': {
        uk: 'Зайдіть на netlify.com та зареєструйтеся',
        en: 'Go to netlify.com and register',
        ru: 'Зайдите на netlify.com и зарегистрируйтесь'
      },
      'preview.step4.drag': {
        uk: 'Перетягніть ZIP файл на головну сторінку',
        en: 'Drag ZIP file to the main page',
        ru: 'Перетащите ZIP файл на главную страницу'
      },
      'preview.step4.wait': {
        uk: 'Дочекайтеся завантаження - отримаєте посилання',
        en: 'Wait for upload - you will get a link',
        ru: 'Дождитесь загрузки - получите ссылку'
      },

      'preview.step5.title': {
        uk: '5️⃣ SEO оптимізація',
        en: '5️⃣ SEO Optimization',
        ru: '5️⃣ SEO оптимизация'
      },
      'preview.step5.desc1': {
        uk: 'Перейдіть в розділ "SEO налаштування"',
        en: 'Go to "SEO Settings" section',
        ru: 'Перейдите в раздел "SEO настройки"'
      },
      'preview.step5.desc2': {
        uk: 'Заповніть мета дані:',
        en: 'Fill in meta data:',
        ru: 'Заполните мета данные:'
      },
      'preview.step5.title.desc': {
        uk: 'Title: Заголовок сторінки (до 60 символів)',
        en: 'Title: Page title (up to 60 characters)',
        ru: 'Title: Заголовок страницы (до 60 символов)'
      },
      'preview.step5.description': {
        uk: 'Description: Опис для пошукових систем (до 160 символів)',
        en: 'Description: Description for search engines (up to 160 characters)',
        ru: 'Description: Описание для поисковых систем (до 160 символов)'
      },
      'preview.step5.keywords': {
        uk: 'Keywords: Ключові слова через кому',
        en: 'Keywords: Keywords separated by commas',
        ru: 'Keywords: Ключевые слова через запятую'
      },
      'preview.step5.og': {
        uk: 'OG Image: Зображення для соціальних мереж',
        en: 'OG Image: Image for social networks',
        ru: 'OG Image: Изображение для социальных сетей'
      },
      'preview.step5.desc3': {
        uk: 'Налаштуйте структуровані дані:',
        en: 'Configure structured data:',
        ru: 'Настройте структурированные данные:'
      },
      'preview.step5.business': {
        uk: 'Вкажіть тип бізнесу (Organization, Service, Person)',
        en: 'Specify business type (Organization, Service, Person)',
        ru: 'Укажите тип бизнеса (Organization, Service, Person)'
      },
      'preview.step5.contact': {
        uk: 'Додайте контактну інформацію',
        en: 'Add contact information',
        ru: 'Добавьте контактную информацию'
      },
      'preview.step5.geo': {
        uk: 'Встановіть геолокацію якщо потрібно',
        en: 'Set geolocation if needed',
        ru: 'Установите геолокацию если нужно'
      },
      'preview.note': {
        uk: 'ще потрібно зробити цей розділ',
        en: 'this section still needs to be implemented',
        ru: 'этот раздел еще нужно реализовать'
      },

      // Intro section detailed instructions
      'intro.step1.title': {
        uk: '1️⃣ Додавання тексту та логотипу',
        en: '1️⃣ Adding Text and Logo',
        ru: '1️⃣ Добавление текста и логотипа'
      },
      'intro.step1.desc1': {
        uk: 'Перейдіть на вкладку "Заголовок"',
        en: 'Go to the "Title" tab',
        ru: 'Перейдите на вкладку "Заголовок"'
      },
      'intro.step1.desc2': {
        uk: 'Заповніть поля:',
        en: 'Fill in the fields:',
        ru: 'Заполните поля:'
      },
      'intro.step1.title.field': {
        uk: 'Заголовок: Введіть основний заголовок (наприклад: "Усе що треба")',
        en: 'Title: Enter the main title (e.g., "Everything you need")',
        ru: 'Заголовок: Введите основной заголовок (например: "Всё что нужно")'
      },
      'intro.step1.subtitle.field': {
        uk: 'Підзаголовок: Додайте підзаголовок (наприклад: "для твого SMM")',
        en: 'Subtitle: Add a subtitle (e.g., "for your SMM")',
        ru: 'Подзаголовок: Добавьте подзаголовок (например: "для твоего SMM")'
      },
      'intro.step1.description.field': {
        uk: 'Опис: Коротко опишіть ваші послуги',
        en: 'Description: Briefly describe your services',
        ru: 'Описание: Кратко опишите ваши услуги'
      },
      'intro.step1.button.text': {
        uk: 'Текст кнопки: Напишіть заклик до дії (наприклад: "Почати роботу")',
        en: 'Button text: Write a call to action (e.g., "Get Started")',
        ru: 'Текст кнопки: Напишите призыв к действию (например: "Начать работу")'
      },
      'intro.step1.button.link': {
        uk: 'Посилання кнопки: Введіть URL або анкор (#start)',
        en: 'Button link: Enter URL or anchor (#start)',
        ru: 'Ссылка кнопки: Введите URL или якорь (#start)'
      },
      'intro.step1.desc3': {
        uk: 'Натисніть "Вибрати з медіа-бібліотеки" для завантаження логотипу',
        en: 'Click "Select from media library" to upload logo',
        ru: 'Нажмите "Выбрать из медиа-библиотеки" для загрузки логотипа'
      },
      'intro.step1.desc4': {
        uk: 'Натисніть "Зберегти" для збереження змін',
        en: 'Click "Save" to save changes',
        ru: 'Нажмите "Сохранить" для сохранения изменений'
      },

      'intro.step2.title': {
        uk: '2️⃣ Налаштування шрифтів і кольорів',
        en: '2️⃣ Font and Color Settings',
        ru: '2️⃣ Настройка шрифтов и цветов'
      },
      'intro.step2.desc1': {
        uk: 'Перейдіть на вкладку "Дизайн"',
        en: 'Go to the "Design" tab',
        ru: 'Перейдите на вкладку "Дизайн"'
      },
      'intro.step2.desc2': {
        uk: 'В розділі "Типографіка" оберіть елемент для редагування:',
        en: 'In the "Typography" section, select an element to edit:',
        ru: 'В разделе "Типографика" выберите элемент для редактирования:'
      },
      'intro.step2.element.select': {
        uk: 'Виберіть "Заголовок", "Підзаголовок" або "Опис"',
        en: 'Select "Title", "Subtitle" or "Description"',
        ru: 'Выберите "Заголовок", "Подзаголовок" или "Описание"'
      },
      'intro.step2.font.family': {
        uk: 'Оберіть сімейство шрифтів (Inter, Arial, Roboto тощо)',
        en: 'Choose font family (Inter, Arial, Roboto, etc.)',
        ru: 'Выберите семейство шрифтов (Inter, Arial, Roboto и др.)'
      },
      'intro.step2.font.weight': {
        uk: 'Встановіть товщину шрифту (Звичайний, Жирний)',
        en: 'Set font weight (Normal, Bold)',
        ru: 'Установите толщину шрифта (Обычный, Жирный)'
      },
      'intro.step2.font.style': {
        uk: 'Оберіть стиль (Звичайний або Курсив)',
        en: 'Choose style (Normal or Italic)',
        ru: 'Выберите стиль (Обычный или Курсив)'
      },
      'intro.step2.desc3': {
        uk: 'В розділі "Кольори" встановіть:',
        en: 'In the "Colors" section, set:',
        ru: 'В разделе "Цвета" установите:'
      },
      'intro.step2.primary.color': {
        uk: 'Основний колір: Головний колір бренду',
        en: 'Primary color: Main brand color',
        ru: 'Основной цвет: Главный цвет бренда'
      },
      'intro.step2.accent.color': {
        uk: 'Акцентний колір: Колір для кнопок та акцентів',
        en: 'Accent color: Color for buttons and accents',
        ru: 'Акцентный цвет: Цвет для кнопок и акцентов'
      },
      'intro.step2.text.color': {
        uk: 'Колір тексту: Колір всього тексту',
        en: 'Text color: Color for all text',
        ru: 'Цвет текста: Цвет всего текста'
      },

      'intro.step3.title': {
        uk: '3️⃣ Встановлення фону',
        en: '3️⃣ Background Setup',
        ru: '3️⃣ Установка фона'
      },
      'intro.step3.desc1': {
        uk: 'Перейдіть на вкладку "Фон"',
        en: 'Go to the "Background" tab',
        ru: 'Перейдите на вкладку "Фон"'
      },
      'intro.step3.desc2': {
        uk: 'Оберіть тип фону:',
        en: 'Choose background type:',
        ru: 'Выберите тип фона:'
      },
      'intro.step3.color': {
        uk: 'Колір: Просто виберіть колір',
        en: 'Color: Simply choose a color',
        ru: 'Цвет: Просто выберите цвет'
      },
      'intro.step3.gradient': {
        uk: 'Градієнт: Встановіть початковий та кінцевий кольори',
        en: 'Gradient: Set start and end colors',
        ru: 'Градиент: Установите начальный и конечный цвета'
      },
      'intro.step3.image': {
        uk: 'Зображення: Натисніть "Вибрати з медіа" та оберіть фото',
        en: 'Image: Click "Select from media" and choose a photo',
        ru: 'Изображение: Нажмите "Выбрать из медиа" и выберите фото'
      },
      'intro.step3.video': {
        uk: 'Відео: Завантажте відео для фону',
        en: 'Video: Upload video for background',
        ru: 'Видео: Загрузите видео для фона'
      },
      'intro.step3.desc3': {
        uk: 'Налаштуйте ефекти:',
        en: 'Configure effects:',
        ru: 'Настройте эффекты:'
      },
      'intro.step3.particles.enable': {
        uk: 'Увімкніть частинки якщо потрібно',
        en: 'Enable particles if needed',
        ru: 'Включите частицы если нужно'
      },
      'intro.step3.particles.color': {
        uk: 'Оберіть колір частинок',
        en: 'Choose particle color',
        ru: 'Выберите цвет частиц'
      },
      'intro.step3.animation.speed': {
        uk: 'Встановіть швидкість анімації',
        en: 'Set animation speed',
        ru: 'Установите скорость анимации'
      },

      'intro.step4.title': {
        uk: '4️⃣ Додавання звуків',
        en: '4️⃣ Adding Sounds',
        ru: '4️⃣ Добавление звуков'
      },
      'intro.step4.desc1': {
        uk: 'Перейдіть на вкладку "Аудіо"',
        en: 'Go to the "Audio" tab',
        ru: 'Перейдите на вкладку "Аудио"'
      },
      'intro.step4.desc2': {
        uk: 'Налаштуйте фонову музику:',
        en: 'Configure background music:',
        ru: 'Настройте фоновую музыку:'
      },
      'intro.step4.music.enable': {
        uk: 'Увімкніть перемикач "Фонова музика"',
        en: 'Enable "Background music" toggle',
        ru: 'Включите переключатель "Фоновая музыка"'
      },
      'intro.step4.music.select': {
        uk: 'Натисніть "Вибрати з медіа" та оберіть аудіо файл',
        en: 'Click "Select from media" and choose an audio file',
        ru: 'Нажмите "Выбрать из медиа" и выберите аудио файл'
      },
      'intro.step4.music.volume': {
        uk: 'Встановіть гучність (0-100%)',
        en: 'Set volume (0-100%)',
        ru: 'Установите громкость (0-100%)'
      },
      'intro.step4.music.loop': {
        uk: 'Увімкніть "Зациклити" для повторення',
        en: 'Enable "Loop" for repetition',
        ru: 'Включите "Зациклить" для повторения'
      },
      'intro.step4.music.autoplay': {
        uk: 'Увімкніть "Автозапуск" якщо потрібно',
        en: 'Enable "Autoplay" if needed',
        ru: 'Включите "Автозапуск" если нужно'
      },
      'intro.step4.desc3': {
        uk: 'Додайте звукові ефекти:',
        en: 'Add sound effects:',
        ru: 'Добавьте звуковые эффекты:'
      },
      'intro.step4.hover.sound': {
        uk: 'Завантажте звук для наведення на кнопки',
        en: 'Upload sound for button hover',
        ru: 'Загрузите звук для наведения на кнопки'
      },
      'intro.step4.click.sound': {
        uk: 'Додайте звук для кліків',
        en: 'Add sound for clicks',
        ru: 'Добавьте звук для кликов'
      },

      'intro.step5.title': {
        uk: '5️⃣ 3D анімації (опціонально)',
        en: '5️⃣ 3D Animations (Optional)',
        ru: '5️⃣ 3D анимации (опционально)'
      },
      'intro.step5.desc1': {
        uk: 'Перейдіть на вкладку "3D"',
        en: 'Go to the "3D" tab',
        ru: 'Перейдите на вкладку "3D"'
      },
      'intro.step5.desc2': {
        uk: 'Увімкніть перемикач "Увімкнути 3D анімації"',
        en: 'Enable "Enable 3D animations" toggle',
        ru: 'Включите переключатель "Включить 3D анимации"'
      },
      'intro.step5.desc3': {
        uk: 'Додайте Spline сцену:',
        en: 'Add Spline scene:',
        ru: 'Добавьте Spline сцену:'
      },
      'intro.step5.spline.url': {
        uk: 'Вставте URL з spline.design',
        en: 'Paste URL from spline.design',
        ru: 'Вставьте URL с spline.design'
      },
      'intro.step5.spline.file': {
        uk: 'АБО завантажте .spline файл',
        en: 'OR upload .spline file',
        ru: 'ИЛИ загрузите .spline файл'
      },
      'intro.step5.spline.position': {
        uk: 'Оберіть позицію (Фон, Накладка, Передній план)',
        en: 'Choose position (Background, Overlay, Foreground)',
        ru: 'Выберите позицию (Фон, Наложение, Передний план)'
      },
      'intro.step5.spline.settings': {
        uk: 'Встановіть прозорість та масштаб',
        en: 'Set transparency and scale',
        ru: 'Установите прозрачность и масштаб'
      },

      // Main constructor section detailed instructions
      'main.step1.title': {
        uk: '1️⃣ Налаштування заголовка сторінки',
        en: '1️⃣ Page Header Setup',
        ru: '1️⃣ Настройка заголовка страницы'
      },
      'main.step1.desc1': {
        uk: 'Перейдіть на вкладку "Заголовок"',
        en: 'Go to the "Title" tab',
        ru: 'Перейдите на вкладку "Заголовок"'
      },
      'main.step1.desc2': {
        uk: 'Заповніть основну інформацію:',
        en: 'Fill in the main information:',
        ru: 'Заполните основную информацию:'
      },
      'main.step1.title.field': {
        uk: 'Заголовок: Назва вашого бізнесу або послуги',
        en: 'Title: Your business or service name',
        ru: 'Заголовок: Название вашего бизнеса или услуги'
      },
      'main.step1.subtitle.field': {
        uk: 'Підзаголовок: Короткий опис діяльності',
        en: 'Subtitle: Brief description of activities',
        ru: 'Подзаголовок: Краткое описание деятельности'
      },
      'main.step1.description.field': {
        uk: 'Опис: Детальніше про ваші можливості',
        en: 'Description: More details about your capabilities',
        ru: 'Описание: Подробнее о ваших возможностях'
      },
      'main.step1.desc3': {
        uk: 'Завантажте логотип через "Вибрати з медіа-бібліотеки"',
        en: 'Upload logo via "Select from media library"',
        ru: 'Загрузите логотип через "Выбрать из медиа-библиотеки"'
      },

      'main.step2.title': {
        uk: '2️⃣ Створення 3D каруселі',
        en: '2️⃣ Creating 3D Carousel',
        ru: '2️⃣ Создание 3D карусели'
      },
      'main.step2.desc1': {
        uk: 'Перейдіть на вкладку "Карусель"',
        en: 'Go to the "Carousel" tab',
        ru: 'Перейдите на вкладку "Карусель"'
      },
      'main.step2.desc2': {
        uk: 'Додайте елементи каруселі:',
        en: 'Add carousel elements:',
        ru: 'Добавьте элементы карусели:'
      },
      'main.step2.add.element': {
        uk: 'Натисніть "Додати елемент" для нової картки',
        en: 'Click "Add element" for a new card',
        ru: 'Нажмите "Добавить элемент" для новой карточки'
      },
      'main.step2.project.name': {
        uk: 'Введіть назву проекту або послуги',
        en: 'Enter project or service name',
        ru: 'Введите название проекта или услуги'
      },
      'main.step2.service.description': {
        uk: 'Напишіть опис (що включає ця послуга)',
        en: 'Write description (what this service includes)',
        ru: 'Напишите описание (что включает эта услуга)'
      },
      'main.step2.add.image': {
        uk: 'Додайте зображення через "Вибрати зображення"',
        en: 'Add image via "Select image"',
        ru: 'Добавьте изображение через "Выбрать изображение"'
      },
      'main.step2.add.link': {
        uk: 'Вкажіть посилання (URL або #анкор)',
        en: 'Specify link (URL or #anchor)',
        ru: 'Укажите ссылку (URL или #якорь)'
      },
      'main.step2.desc3': {
        uk: 'Оберіть стиль каруселі:',
        en: 'Choose carousel style:',
        ru: 'Выберите стиль карусели:'
      },
      'main.step2.style.classic': {
        uk: 'Classic - класичний вигляд',
        en: 'Classic - classic appearance',
        ru: 'Classic - классический вид'
      },
      'main.step2.style.modern': {
        uk: 'Modern - сучасний дизайн',
        en: 'Modern - modern design',
        ru: 'Modern - современный дизайн'
      },
      'main.step2.style.premium': {
        uk: 'Premium - преміум стиль',
        en: 'Premium - premium style',
        ru: 'Premium - премиум стиль'
      },
      'main.step2.style.glass': {
        uk: 'Glass - скляний ефект',
        en: 'Glass - glass effect',
        ru: 'Glass - стеклянный эффект'
      },
      'main.step2.style.neon': {
        uk: 'Neon - неонове підсвічування',
        en: 'Neon - neon lighting',
        ru: 'Neon - неоновое освещение'
      },
      'main.step2.desc4': {
        uk: 'Повторіть для всіх ваших проектів/послуг',
        en: 'Repeat for all your projects/services',
        ru: 'Повторите для всех ваших проектов/услуг'
      },

      'main.step3.title': {
        uk: '3️⃣ Адаптивні налаштування',
        en: '3️⃣ Responsive Settings',
        ru: '3️⃣ Адаптивные настройки'
      },
      'main.step3.desc1': {
        uk: 'Перейдіть на вкладку "Стиль"',
        en: 'Go to the "Style" tab',
        ru: 'Перейдите на вкладку "Стиль"'
      },
      'main.step3.desc2': {
        uk: 'В розділі "Адаптивність" оберіть пристрій:',
        en: 'In "Responsiveness" section, select device:',
        ru: 'В разделе "Адаптивность" выберите устройство:'
      },
      'main.step3.mobile.settings': {
        uk: 'Мобільний: Налаштування для телефонів',
        en: 'Mobile: Settings for phones',
        ru: 'Мобильный: Настройки для телефонов'
      },
      'main.step3.tablet.settings': {
        uk: 'Планшет: Налаштування для планшетів',
        en: 'Tablet: Settings for tablets',
        ru: 'Планшет: Настройки для планшетов'
      },
      'main.step3.desktop.settings': {
        uk: 'Десктоп: Налаштування для комп\'ютерів',
        en: 'Desktop: Settings for computers',
        ru: 'Десктоп: Настройки для компьютеров'
      },
      'main.step3.desc3': {
        uk: 'Для кожного пристрою встановіть:',
        en: 'For each device, set:',
        ru: 'Для каждого устройства установите:'
      },
      'main.step3.font.sizes': {
        uk: 'Розмір шрифтів',
        en: 'Font sizes',
        ru: 'Размер шрифтов'
      },
      'main.step3.element.spacing': {
        uk: 'Відступи між елементами',
        en: 'Spacing between elements',
        ru: 'Отступы между элементами'
      },
      'main.step3.line.height': {
        uk: 'Висоту рядків',
        en: 'Line height',
        ru: 'Высоту строк'
      },

      'main.step4.title': {
        uk: '4️⃣ Звукові ефекти для каруселі',
        en: '4️⃣ Carousel Sound Effects',
        ru: '4️⃣ Звуковые эффекты для карусели'
      },
      'main.step4.desc1': {
        uk: 'Перейдіть на вкладку "Звук"',
        en: 'Go to the "Sound" tab',
        ru: 'Перейдите на вкладку "Звук"'
      },
      'main.step4.desc2': {
        uk: 'Налаштуйте звуки каруселі:',
        en: 'Configure carousel sounds:',
        ru: 'Настройте звуки карусели:'
      },
      'main.step4.transition.sound': {
        uk: 'Звук переходу: При перегортанні карток',
        en: 'Transition sound: When flipping cards',
        ru: 'Звук перехода: При перелистывании карточек'
      },
      'main.step4.hover.sound': {
        uk: 'Звук наведення: При наведенні на картку',
        en: 'Hover sound: When hovering over card',
        ru: 'Звук наведения: При наведении на карточку'
      },
      'main.step4.click.sound': {
        uk: 'Звук кліку: При натисканні на картку',
        en: 'Click sound: When clicking on card',
        ru: 'Звук клика: При нажатии на карточку'
      },
      'main.step4.desc3': {
        uk: 'Для кожного звуку:',
        en: 'For each sound:',
        ru: 'Для каждого звука:'
      },
      'main.step4.upload.audio': {
        uk: 'Завантажте аудіо файл через медіа-бібліотеку',
        en: 'Upload audio file via media library',
        ru: 'Загрузите аудио файл через медиа-библиотеку'
      },
      'main.step4.set.volume': {
        uk: 'Встановіть гучність (рекомендовано 30-50%)',
        en: 'Set volume (recommended 30-50%)',
        ru: 'Установите громкость (рекомендуется 30-50%)'
      },

      'main.step5.title': {
        uk: '5️⃣ Попередній перегляд та збереження',
        en: '5️⃣ Preview and Save',
        ru: '5️⃣ Предварительный просмотр и сохранение'
      },
      'main.step5.desc1': {
        uk: 'Натисніть кнопку "Попередній перегляд" внизу екрану',
        en: 'Click "Preview" button at the bottom of the screen',
        ru: 'Нажмите кнопку "Предварительный просмотр" внизу экрана'
      },
      'main.step5.desc2': {
        uk: 'Перевірте як виглядає карусель:',
        en: 'Check how the carousel looks:',
        ru: 'Проверьте как выглядит карусель:'
      },
      'main.step5.test.scroll': {
        uk: 'Прокрутіть карусель мишкою',
        en: 'Scroll carousel with mouse',
        ru: 'Прокрутите карусель мышкой'
      },
      'main.step5.test.links': {
        uk: 'Перевірте всі посилання',
        en: 'Check all links',
        ru: 'Проверьте все ссылки'
      },
      'main.step5.test.sounds': {
        uk: 'Протестуйте звуки',
        en: 'Test sounds',
        ru: 'Протестируйте звуки'
      },
      'main.step5.desc3': {
        uk: 'Збережіть зміни натиснувши "Зберегти"',
        en: 'Save changes by clicking "Save"',
        ru: 'Сохраните изменения нажав "Сохранить"'
      },
      'main.step5.desc4': {
        uk: 'Експортуйте налаштування для резервного копіювання',
        en: 'Export settings for backup',
        ru: 'Экспортируйте настройки для резервного копирования'
      },

      // Content manager section detailed instructions
      'content.step1.title': {
        uk: '1️⃣ Завантаження файлів',
        en: '1️⃣ File Upload',
        ru: '1️⃣ Загрузка файлов'
      },
      'content.step1.method1.title': {
        uk: 'Спосіб 1 - Перетягування (рекомендовано):',
        en: 'Method 1 - Drag & Drop (recommended):',
        ru: 'Способ 1 - Перетаскивание (рекомендуется):'
      },
      'content.step1.method1.step1': {
        uk: 'Відкрийте папку з файлами на комп\'ютері',
        en: 'Open the folder with files on your computer',
        ru: 'Откройте папку с файлами на компьютере'
      },
      'content.step1.method1.step2': {
        uk: 'Перетягніть файли прямо в область менеджера контенту',
        en: 'Drag files directly into the content manager area',
        ru: 'Перетащите файлы прямо в область менеджера контента'
      },
      'content.step1.method1.step3': {
        uk: 'Відпустіть файли - вони автоматично завантажаться',
        en: 'Release files - they will upload automatically',
        ru: 'Отпустите файлы - они автоматически загрузятся'
      },
      'content.step1.method2.title': {
        uk: 'Спосіб 2 - Кнопка завантаження:',
        en: 'Method 2 - Upload button:',
        ru: 'Способ 2 - Кнопка загрузки:'
      },
      'content.step1.method2.step1': {
        uk: 'Натисніть кнопку "Завантажити файли"',
        en: 'Click "Upload files" button',
        ru: 'Нажмите кнопку "Загрузить файлы"'
      },
      'content.step1.method2.step2': {
        uk: 'Оберіть файли у вікні що відкрилося',
        en: 'Select files in the opened window',
        ru: 'Выберите файлы в открывшемся окне'
      },
      'content.step1.method2.step3': {
        uk: 'Натисніть "Відкрити"',
        en: 'Click "Open"',
        ru: 'Нажмите "Открыть"'
      },
      'content.step1.formats.title': {
        uk: 'Підтримувані формати:',
        en: 'Supported formats:',
        ru: 'Поддерживаемые форматы:'
      },
      'content.step1.formats.images': {
        uk: 'Зображення: JPG, PNG, GIF, WEBP',
        en: 'Images: JPG, PNG, GIF, WEBP',
        ru: 'Изображения: JPG, PNG, GIF, WEBP'
      },
      'content.step1.formats.audio': {
        uk: 'Аудіо: MP3, WAV, OGG, M4A',
        en: 'Audio: MP3, WAV, OGG, M4A',
        ru: 'Аудио: MP3, WAV, OGG, M4A'
      },
      'content.step1.formats.video': {
        uk: 'Відео: MP4, WEBM, MOV',
        en: 'Video: MP4, WEBM, MOV',
        ru: 'Видео: MP4, WEBM, MOV'
      },

      'content.step2.title': {
        uk: '2️⃣ Пошук та фільтрація',
        en: '2️⃣ Search and Filtering',
        ru: '2️⃣ Поиск и фильтрация'
      },
      'content.step2.desc1': {
        uk: 'Крок 1: Використовуйте пошукове поле вгорі',
        en: 'Step 1: Use the search field at the top',
        ru: 'Шаг 1: Используйте поисковое поле вверху'
      },
      'content.step2.search.name': {
        uk: 'Введіть назву файлу для пошуку',
        en: 'Enter file name to search',
        ru: 'Введите название файла для поиска'
      },
      'content.step2.search.realtime': {
        uk: 'Пошук працює в реальному часі',
        en: 'Search works in real-time',
        ru: 'Поиск работает в реальном времени'
      },
      'content.step2.desc2': {
        uk: 'Крок 2: Використовуйте фільтри за типом:',
        en: 'Step 2: Use filters by type:',
        ru: 'Шаг 2: Используйте фильтры по типу:'
      },
      'content.step2.filter.all': {
        uk: '"Всі" - показує всі файли',
        en: '"All" - shows all files',
        ru: '"Все" - показывает все файлы'
      },
      'content.step2.filter.images': {
        uk: '"Зображення" - тільки фото та картинки',
        en: '"Images" - only photos and pictures',
        ru: '"Изображения" - только фото и картинки'
      },
      'content.step2.filter.audio': {
        uk: '"Аудіо" - тільки музика та звуки',
        en: '"Audio" - only music and sounds',
        ru: '"Аудио" - только музыка и звуки'
      },
      'content.step2.filter.video': {
        uk: '"Відео" - тільки відео файли',
        en: '"Video" - only video files',
        ru: '"Видео" - только видео файлы'
      },

      'content.step3.title': {
        uk: '3️⃣ Керування файлами',
        en: '3️⃣ File Management',
        ru: '3️⃣ Управление файлами'
      },
      'content.step3.rename.title': {
        uk: 'Перейменування файлу:',
        en: 'File renaming:',
        ru: 'Переименование файла:'
      },
      'content.step3.rename.step1': {
        uk: 'Двічі клікніть на назву файлу',
        en: 'Double-click on the file name',
        ru: 'Дважды кликните на название файла'
      },
      'content.step3.rename.step2': {
        uk: 'Введіть нову назву',
        en: 'Enter new name',
        ru: 'Введите новое название'
      },
      'content.step3.rename.step3': {
        uk: 'Натисніть Enter або клікніть поза полем',
        en: 'Press Enter or click outside the field',
        ru: 'Нажмите Enter или кликните вне поля'
      },
      'content.step3.delete.title': {
        uk: 'Видалення файлу:',
        en: 'File deletion:',
        ru: 'Удаление файла:'
      },
      'content.step3.delete.step1': {
        uk: 'Натисніть кнопку "🗑️" біля файлу',
        en: 'Click "🗑️" button next to the file',
        ru: 'Нажмите кнопку "🗑️" рядом с файлом'
      },
      'content.step3.delete.step2': {
        uk: 'Підтвердіть видалення в діалозі',
        en: 'Confirm deletion in the dialog',
        ru: 'Подтвердите удаление в диалоге'
      },
      'content.step3.select.title': {
        uk: 'Вибір файлу для використання:',
        en: 'File selection for use:',
        ru: 'Выбор файла для использования:'
      },
      'content.step3.select.step1': {
        uk: 'Натисніть кнопку "Вибрати" біля потрібного файлу',
        en: 'Click "Select" button next to the needed file',
        ru: 'Нажмите кнопку "Выбрать" рядом с нужным файлом'
      },
      'content.step3.select.step2': {
        uk: 'Файл автоматично застосується в конструкторі',
        en: 'File will automatically apply in constructor',
        ru: 'Файл автоматически применится в конструкторе'
      },

      'content.step4.title': {
        uk: '4️⃣ Експорт та імпорт',
        en: '4️⃣ Export and Import',
        ru: '4️⃣ Экспорт и импорт'
      },
      'content.step4.backup.title': {
        uk: 'Створення резервної копії:',
        en: 'Creating backup:',
        ru: 'Создание резервной копии:'
      },
      'content.step4.backup.step1': {
        uk: 'Натисніть кнопку "Експорт файлів"',
        en: 'Click "Export files" button',
        ru: 'Нажмите кнопку "Экспорт файлов"'
      },
      'content.step4.backup.step2': {
        uk: 'Файл з усіма медіа завантажиться на комп\'ютер',
        en: 'File with all media will download to computer',
        ru: 'Файл со всеми медиа загрузится на компьютер'
      },
      'content.step4.backup.step3': {
        uk: 'Збережіть його в безпечному місці',
        en: 'Save it in a secure place',
        ru: 'Сохраните его в безопасном месте'
      },
      'content.step4.restore.title': {
        uk: 'Відновлення з резервної копії:',
        en: 'Restoring from backup:',
        ru: 'Восстановление из резервной копии:'
      },
      'content.step4.restore.step1': {
        uk: 'Натисніть кнопку "Імпорт файлів"',
        en: 'Click "Import files" button',
        ru: 'Нажмите кнопку "Импорт файлов"'
      },
      'content.step4.restore.step2': {
        uk: 'Оберіть файл резервної копії',
        en: 'Select backup file',
        ru: 'Выберите файл резервной копии'
      },
      'content.step4.restore.step3': {
        uk: 'Підтвердіть імпорт',
        en: 'Confirm import',
        ru: 'Подтвердите импорт'
      },

      'content.step5.title': {
        uk: '5️⃣ Оптимізація та продуктивність',
        en: '5️⃣ Optimization and Performance',
        ru: '5️⃣ Оптимизация и производительность'
      },
      'content.step5.auto.title': {
        uk: 'Автоматична оптимізація:',
        en: 'Automatic optimization:',
        ru: 'Автоматическая оптимизация:'
      },
      'content.step5.auto.images': {
        uk: 'Зображення автоматично стискаються до 800x600px',
        en: 'Images automatically compressed to 800x600px',
        ru: 'Изображения автоматически сжимаются до 800x600px'
      },
      'content.step5.auto.audio': {
        uk: 'Аудіо конвертується в оптимальний формат',
        en: 'Audio converted to optimal format',
        ru: 'Аудио конвертируется в оптимальный формат'
      },
      'content.step5.auto.video': {
        uk: 'Відео обробляється для веб-сумісності',
        en: 'Video processed for web compatibility',
        ru: 'Видео обрабатывается для веб-совместимости'
      },
      'content.step5.tips.title': {
        uk: 'Рекомендації:',
        en: 'Recommendations:',
        ru: 'Рекомендации:'
      },
      'content.step5.tips.filesize': {
        uk: 'Використовуйте файли до 10MB для швидкої роботи',
        en: 'Use files up to 10MB for fast performance',
        ru: 'Используйте файлы до 10MB для быстрой работы'
      },
      'content.step5.tips.jpg': {
        uk: 'JPG краще для фотографій, PNG для графіки',
        en: 'JPG better for photos, PNG for graphics',
        ru: 'JPG лучше для фотографий, PNG для графики'
      },
      'content.step5.tips.mp3': {
        uk: 'MP3 оптимальний для музики',
        en: 'MP3 optimal for music',
        ru: 'MP3 оптимален для музыки'
      },
      'content.step5.cleanup.title': {
        uk: 'Очищення:',
        en: 'Cleanup:',
        ru: 'Очистка:'
      },
      'content.step5.cleanup.step1': {
        uk: 'Натисніть "Очистити всі дані" для повного видалення',
        en: 'Click "Clear all data" for complete deletion',
        ru: 'Нажмите "Очистить все данные" для полного удаления'
      },
      'content.step5.cleanup.step2': {
        uk: 'Використовуйте перед імпортом нової колекції',
        en: 'Use before importing new collection',
        ru: 'Используйте перед импортом новой коллекции'
      },

      // Analytics section detailed instructions
      'analytics.step1.title': {
        uk: '1️⃣ Налаштування відстеження',
        en: '1️⃣ Tracking Setup',
        ru: '1️⃣ Настройка отслеживания'
      },
      'analytics.step1.desc1': {
        uk: 'Перейдіть у розділ "Аналітика" в адмін панелі',
        en: 'Go to "Analytics" section in admin panel',
        ru: 'Перейдите в раздел "Аналитика" в админ панели'
      },
      'analytics.step1.desc2': {
        uk: 'Увімкніть базове відстеження:',
        en: 'Enable basic tracking:',
        ru: 'Включите базовое отслеживание:'
      },
      'analytics.step1.visitors': {
        uk: 'Відвідувачі: Увімкніть перемикач "Відстежувати відвідувачів"',
        en: 'Visitors: Enable "Track visitors" toggle',
        ru: 'Посетители: Включите переключатель "Отслеживать посетителей"'
      },
      'analytics.step1.pages': {
        uk: 'Сторінки: Активуйте "Аналітика сторінок"',
        en: 'Pages: Activate "Page analytics"',
        ru: 'Страницы: Активируйте "Аналитика страниц"'
      },
      'analytics.step1.clicks': {
        uk: 'Кліки: Увімкніть "Відстеження кліків по елементах"',
        en: 'Clicks: Enable "Element click tracking"',
        ru: 'Клики: Включите "Отслеживание кликов по элементам"'
      },
      'analytics.step1.session': {
        uk: 'Час сесії: Активуйте "Час перебування на сайті"',
        en: 'Session time: Activate "Time spent on site"',
        ru: 'Время сессии: Активируйте "Время пребывания на сайте"'
      },
      'analytics.step1.desc3': {
        uk: 'Налаштуйте додаткові параметри:',
        en: 'Configure additional parameters:',
        ru: 'Настройте дополнительные параметры:'
      },
      'analytics.step1.interval': {
        uk: 'Встановіть інтервал збору даних (1 хвилина - рекомендовано)',
        en: 'Set data collection interval (1 minute - recommended)',
        ru: 'Установите интервал сбора данных (1 минута - рекомендуется)'
      },
      'analytics.step1.retention': {
        uk: 'Оберіть період зберігання даних (30, 60, 90 днів)',
        en: 'Choose data retention period (30, 60, 90 days)',
        ru: 'Выберите период хранения данных (30, 60, 90 дней)'
      },
      'analytics.step1.anonymize': {
        uk: 'Увімкніть анонімізацію IP адрес для конфіденційності',
        en: 'Enable IP address anonymization for privacy',
        ru: 'Включите анонимизацию IP адресов для конфиденциальности'
      },

      'analytics.step2.title': {
        uk: '2️⃣ Інтеграція з Google Analytics',
        en: '2️⃣ Google Analytics Integration',
        ru: '2️⃣ Интеграция с Google Analytics'
      },
      'analytics.step2.desc1': {
        uk: 'Отримайте Google Analytics ID:',
        en: 'Get Google Analytics ID:',
        ru: 'Получите Google Analytics ID:'
      },
      'analytics.step2.ga.login': {
        uk: 'Зайдіть на analytics.google.com',
        en: 'Go to analytics.google.com',
        ru: 'Зайдите на analytics.google.com'
      },
      'analytics.step2.ga.account': {
        uk: 'Створіть новий акаунт або оберіть існуючий',
        en: 'Create new account or select existing one',
        ru: 'Создайте новый аккаунт или выберите существующий'
      },
      'analytics.step2.ga.property': {
        uk: 'Додайте новий ресурс (ваш сайт)',
        en: 'Add new property (your website)',
        ru: 'Добавьте новый ресурс (ваш сайт)'
      },
      'analytics.step2.ga.copy': {
        uk: 'Скопіюйте Measurement ID (формат: G-XXXXXXXXXX)',
        en: 'Copy Measurement ID (format: G-XXXXXXXXXX)',
        ru: 'Скопируйте Measurement ID (формат: G-XXXXXXXXXX)'
      },
      'analytics.step2.desc2': {
        uk: 'Введіть ID в системі:',
        en: 'Enter ID in system:',
        ru: 'Введите ID в системе:'
      },
      'analytics.step2.paste': {
        uk: 'В розділі "Зовнішня аналітика" вставте Measurement ID',
        en: 'In "External Analytics" section paste Measurement ID',
        ru: 'В разделе "Внешняя аналитика" вставьте Measurement ID'
      },
      'analytics.step2.enable': {
        uk: 'Увімкніть перемикач "Google Analytics 4"',
        en: 'Enable "Google Analytics 4" toggle',
        ru: 'Включите переключатель "Google Analytics 4"'
      },
      'analytics.step2.test': {
        uk: 'Натисніть "Перевірити підключення"',
        en: 'Click "Test connection"',
        ru: 'Нажмите "Проверить подключение"'
      },
      'analytics.step2.save': {
        uk: 'Збережіть налаштування',
        en: 'Save settings',
        ru: 'Сохраните настройки'
      },

      'analytics.step3.title': {
        uk: '3️⃣ Перегляд статистики',
        en: '3️⃣ Statistics Overview',
        ru: '3️⃣ Просмотр статистики'
      },
      'analytics.step3.desc1': {
        uk: 'Основні показники (панель "Огляд"):',
        en: 'Main metrics ("Overview" panel):',
        ru: 'Основные показатели (панель "Обзор"):'
      },
      'analytics.step3.total.visitors': {
        uk: 'Всього відвідувачів: Унікальні користувачі за період',
        en: 'Total visitors: Unique users for the period',
        ru: 'Всего посетителей: Уникальные пользователи за период'
      },
      'analytics.step3.page.views': {
        uk: 'Перегляди сторінок: Загальна кількість переглядів',
        en: 'Page views: Total number of views',
        ru: 'Просмотры страниц: Общее количество просмотров'
      },
      'analytics.step3.avg.time': {
        uk: 'Середній час: Час що відвідувачі проводять на сайті',
        en: 'Average time: Time visitors spend on site',
        ru: 'Среднее время: Время которое посетители проводят на сайте'
      },
      'analytics.step3.bounce.rate': {
        uk: 'Показник відмов: % користувачів що залишили сайт з першої сторінки',
        en: 'Bounce rate: % users who left site from first page',
        ru: 'Показатель отказов: % пользователей которые покинули сайт с первой страницы'
      },
      'analytics.step3.desc2': {
        uk: 'Детальна статистика:',
        en: 'Detailed statistics:',
        ru: 'Детальная статистика:'
      },
      'analytics.step3.visits.chart': {
        uk: 'Графік відвідувань: Динаміка по годинах та дням',
        en: 'Visits chart: Dynamics by hours and days',
        ru: 'График посещений: Динамика по часам и дням'
      },
      'analytics.step3.popular.pages': {
        uk: 'Популярні сторінки: Найбільш відвідувані розділи',
        en: 'Popular pages: Most visited sections',
        ru: 'Популярные страницы: Наиболее посещаемые разделы'
      },
      'analytics.step3.traffic.sources': {
        uk: 'Джерела трафіку: Звідки приходять користувачі',
        en: 'Traffic sources: Where users come from',
        ru: 'Источники трафика: Откуда приходят пользователи'
      },
      'analytics.step3.devices': {
        uk: 'Пристрої: Розподіл за мобільними, планшетами, десктопом',
        en: 'Devices: Distribution by mobile, tablet, desktop',
        ru: 'Устройства: Распределение по мобильным, планшетам, десктопу'
      },

      'analytics.step4.title': {
        uk: '4️⃣ Налаштування цілей та подій',
        en: '4️⃣ Goals and Events Setup',
        ru: '4️⃣ Настройка целей и событий'
      },
      'analytics.step4.desc1': {
        uk: 'Створення цілей:',
        en: 'Creating goals:',
        ru: 'Создание целей:'
      },
      'analytics.step4.add.goal': {
        uk: 'Натисніть "Додати ціль" в розділі "Конверсії"',
        en: 'Click "Add goal" in "Conversions" section',
        ru: 'Нажмите "Добавить цель" в разделе "Конверсии"'
      },
      'analytics.step4.goal.name': {
        uk: 'Введіть назву цілі (наприклад: "Заповнення контактної форми")',
        en: 'Enter goal name (e.g., "Contact form submission")',
        ru: 'Введите название цели (например: "Заполнение контактной формы")'
      },
      'analytics.step4.goal.type': {
        uk: 'Оберіть тип: клік по кнопці, відвідування сторінки, час на сайті',
        en: 'Choose type: button click, page visit, time on site',
        ru: 'Выберите тип: клик по кнопке, посещение страницы, время на сайте'
      },
      'analytics.step4.goal.conditions': {
        uk: 'Встановіть умови спрацювання',
        en: 'Set trigger conditions',
        ru: 'Установите условия срабатывания'
      },
      'analytics.step4.desc2': {
        uk: 'Відстеження подій:',
        en: 'Event tracking:',
        ru: 'Отслеживание событий:'
      },
      'analytics.step4.phone.clicks': {
        uk: 'Кліки по телефону: Автоматично відстежуються',
        en: 'Phone clicks: Automatically tracked',
        ru: 'Клики по телефону: Автоматически отслеживаются'
      },
      'analytics.step4.file.downloads': {
        uk: 'Завантаження файлів: PDF, DOC та інші документи',
        en: 'File downloads: PDF, DOC and other documents',
        ru: 'Загрузка файлов: PDF, DOC и другие документы'
      },
      'analytics.step4.external.links': {
        uk: 'Зовнішні посилання: Переходи на інші сайти',
        en: 'External links: Transitions to other sites',
        ru: 'Внешние ссылки: Переходы на другие сайты'
      },
      'analytics.step4.social.media': {
        uk: 'Соціальні мережі: Кліки по іконках соцмереж',
        en: 'Social media: Clicks on social media icons',
        ru: 'Социальные сети: Клики по иконкам соцсетей'
      },

      'analytics.step5.title': {
        uk: '5️⃣ Експорт та звіти',
        en: '5️⃣ Export and Reports',
        ru: '5️⃣ Экспорт и отчеты'
      },
      'analytics.step5.desc1': {
        uk: 'Автоматичні звіти:',
        en: 'Automatic reports:',
        ru: 'Автоматические отчеты:'
      },
      'analytics.step5.frequency': {
        uk: 'Оберіть періодичність: щоденно, щотижня, щомісяця',
        en: 'Choose frequency: daily, weekly, monthly',
        ru: 'Выберите периодичность: ежедневно, еженедельно, ежемесячно'
      },
      'analytics.step5.email': {
        uk: 'Вкажіть email для отримання звітів',
        en: 'Specify email for receiving reports',
        ru: 'Укажите email для получения отчетов'
      },
      'analytics.step5.format': {
        uk: 'Виберіть формат: PDF або Excel',
        en: 'Choose format: PDF or Excel',
        ru: 'Выберите формат: PDF или Excel'
      },
      'analytics.step5.desc2': {
        uk: 'Ручний експорт:',
        en: 'Manual export:',
        ru: 'Ручной экспорт:'
      },
      'analytics.step5.period': {
        uk: 'Оберіть період для експорту',
        en: 'Choose period for export',
        ru: 'Выберите период для экспорта'
      },
      'analytics.step5.export.btn': {
        uk: 'Натисніть "Експорт в CSV" або "Експорт в PDF"',
        en: 'Click "Export to CSV" or "Export to PDF"',
        ru: 'Нажмите "Экспорт в CSV" или "Экспорт в PDF"'
      },
      'analytics.step5.download': {
        uk: 'Файл автоматично завантажиться',
        en: 'File will download automatically',
        ru: 'Файл автоматически загрузится'
      },
      'analytics.step5.desc3': {
        uk: 'API доступ:',
        en: 'API access:',
        ru: 'API доступ:'
      },
      'analytics.step5.api.key': {
        uk: 'Згенеруйте API ключ в розділі "Налаштування"',
        en: 'Generate API key in "Settings" section',
        ru: 'Сгенерируйте API ключ в разделе "Настройки"'
      },
      'analytics.step5.crm': {
        uk: 'Використовуйте для інтеграції з CRM системами',
        en: 'Use for integration with CRM systems',
        ru: 'Используйте для интеграции с CRM системами'
      },
      'analytics.step5.docs': {
        uk: 'Документація API доступна в розділі "Допомога"',
        en: 'API documentation available in "Help" section',
        ru: 'Документация API доступна в разделе "Помощь"'
      },

      // Settings section detailed instructions
      'settings.step1.title': {
        uk: '1️⃣ Загальні налаштування сайту',
        en: '1️⃣ General Site Settings',
        ru: '1️⃣ Общие настройки сайта'
      },
      'settings.step1.desc1': {
        uk: 'Перейдіть у розділ "Налаштування" → "Загальне"',
        en: 'Go to "Settings" → "General" section',
        ru: 'Перейдите в раздел "Настройки" → "Общее"'
      },
      'settings.step1.desc2': {
        uk: 'Налаштуйте основну інформацію:',
        en: 'Configure basic information:',
        ru: 'Настройте основную информацию:'
      },
      'settings.step1.site.name': {
        uk: 'Назва сайту: Введіть назву вашого бізнесу',
        en: 'Site name: Enter your business name',
        ru: 'Название сайта: Введите название вашего бизнеса'
      },
      'settings.step1.site.desc': {
        uk: 'Опис сайту: Короткий опис для пошукових систем',
        en: 'Site description: Brief description for search engines',
        ru: 'Описание сайта: Краткое описание для поисковых систем'
      },
      'settings.step1.email': {
        uk: 'Контактний email: Email для зворотного зв\'язку',
        en: 'Contact email: Email for feedback',
        ru: 'Контактный email: Email для обратной связи'
      },
      'settings.step1.phone': {
        uk: 'Телефон: Основний номер телефону',
        en: 'Phone: Main phone number',
        ru: 'Телефон: Основной номер телефона'
      },
      'settings.step1.address': {
        uk: 'Адреса: Фізична адреса компанії',
        en: 'Address: Physical company address',
        ru: 'Адрес: Физический адрес компании'
      },
      'settings.step1.desc3': {
        uk: 'Завантажте файли:',
        en: 'Upload files:',
        ru: 'Загрузите файлы:'
      },
      'settings.step1.favicon': {
        uk: 'Favicon: Іконка сайту (16x16px або 32x32px)',
        en: 'Favicon: Site icon (16x16px or 32x32px)',
        ru: 'Favicon: Иконка сайта (16x16px или 32x32px)'
      },
      'settings.step1.logo': {
        uk: 'Логотип: Основний логотип компанії',
        en: 'Logo: Main company logo',
        ru: 'Логотип: Основной логотип компании'
      },
      'settings.step1.og.image': {
        uk: 'OG зображення: Картинка для соціальних мереж (1200x630px)',
        en: 'OG image: Picture for social networks (1200x630px)',
        ru: 'OG изображение: Картинка для социальных сетей (1200x630px)'
      },

      'settings.step2.title': {
        uk: '2️⃣ Мова та локалізація',
        en: '2️⃣ Language and Localization',
        ru: '2️⃣ Язык и локализация'
      },
      'settings.step2.desc1': {
        uk: 'Перейдіть у розділ "Мова інтерфейсу"',
        en: 'Go to "Interface Language" section',
        ru: 'Перейдите в раздел "Язык интерфейса"'
      },
      'settings.step2.desc2': {
        uk: 'Оберіть основну мову:',
        en: 'Choose main language:',
        ru: 'Выберите основной язык:'
      },
      'settings.step2.ukrainian': {
        uk: 'Українська: Для українськомовної аудиторії',
        en: 'Ukrainian: For Ukrainian-speaking audience',
        ru: 'Украинский: Для украиноязычной аудитории'
      },
      'settings.step2.english': {
        uk: 'English: Для міжнародної аудиторії',
        en: 'English: For international audience',
        ru: 'English: Для международной аудитории'
      },
      'settings.step2.russian': {
        uk: 'Русский: Для російськомовної аудиторії',
        en: 'Russian: For Russian-speaking audience',
        ru: 'Русский: Для русскоязычной аудитории'
      },
      'settings.step2.desc3': {
        uk: 'Налаштуйте додаткові мови:',
        en: 'Configure additional languages:',
        ru: 'Настройте дополнительные языки:'
      },
      'settings.step2.switcher': {
        uk: 'Увімкніть перемикач мови на сайті',
        en: 'Enable language switcher on site',
        ru: 'Включите переключатель языка на сайте'
      },
      'settings.step2.position': {
        uk: 'Оберіть позицію перемикача (правий верхній кут рекомендовано)',
        en: 'Choose switcher position (top right corner recommended)',
        ru: 'Выберите позицию переключателя (правый верхний угол рекомендуется)'
      },
      'settings.step2.default': {
        uk: 'Встановіть мову за замовчуванням для нових відвідувачів',
        en: 'Set default language for new visitors',
        ru: 'Установите язык по умолчанию для новых посетителей'
      },

      'settings.step3.title': {
        uk: '3️⃣ Безпека та доступ',
        en: '3️⃣ Security and Access',
        ru: '3️⃣ Безопасность и доступ'
      },
      'settings.step3.desc1': {
        uk: 'Налаштування паролю адміністратора:',
        en: 'Administrator password settings:',
        ru: 'Настройки пароля администратора:'
      },
      'settings.step3.password.section': {
        uk: 'Перейдіть у розділ "Безпека" → "Зміна паролю"',
        en: 'Go to "Security" → "Change Password" section',
        ru: 'Перейдите в раздел "Безопасность" → "Смена пароля"'
      },
      'settings.step3.current.password': {
        uk: 'Введіть поточний пароль',
        en: 'Enter current password',
        ru: 'Введите текущий пароль'
      },
      'settings.step3.new.password': {
        uk: 'Створіть новий пароль (мінімум 8 символів)',
        en: 'Create new password (minimum 8 characters)',
        ru: 'Создайте новый пароль (минимум 8 символов)'
      },
      'settings.step3.password.rules': {
        uk: 'Використовуйте літери, цифри та спецсимволи',
        en: 'Use letters, numbers and special characters',
        ru: 'Используйте буквы, цифры и спецсимволы'
      },
      'settings.step3.confirm.password': {
        uk: 'Підтвердіть новий пароль та збережіть',
        en: 'Confirm new password and save',
        ru: 'Подтвердите новый пароль и сохраните'
      },
      'settings.step3.desc2': {
        uk: 'Налаштування сесій:',
        en: 'Session settings:',
        ru: 'Настройки сессий:'
      },
      'settings.step3.session.duration': {
        uk: 'Тривалість сесії: 1 година (рекомендовано), 8 годин, 24 години',
        en: 'Session duration: 1 hour (recommended), 8 hours, 24 hours',
        ru: 'Длительность сессии: 1 час (рекомендуется), 8 часов, 24 часа'
      },
      'settings.step3.auto.logout': {
        uk: 'Автовихід: Увімкніть для додаткової безпеки',
        en: 'Auto logout: Enable for additional security',
        ru: 'Автовыход: Включите для дополнительной безопасности'
      },
      'settings.step3.login.button': {
        uk: 'Відображення кнопки входу: Можна приховати на публічному сайті',
        en: 'Login button display: Can be hidden on public site',
        ru: 'Отображение кнопки входа: Можно скрыть на публичном сайте'
      },

      'settings.step4.title': {
        uk: '4️⃣ Резервне копіювання та експорт',
        en: '4️⃣ Backup and Export',
        ru: '4️⃣ Резервное копирование и экспорт'
      },
      'settings.step4.desc1': {
        uk: 'Створення повної резервної копії:',
        en: 'Creating full backup:',
        ru: 'Создание полной резервной копии:'
      },
      'settings.step4.backup.section': {
        uk: 'Перейдіть у розділ "Резервні копії"',
        en: 'Go to "Backups" section',
        ru: 'Перейдите в раздел "Резервные копии"'
      },
      'settings.step4.create.backup': {
        uk: 'Натисніть "Створити повну копію"',
        en: 'Click "Create full backup"',
        ru: 'Нажмите "Создать полную копию"'
      },
      'settings.step4.select.include': {
        uk: 'Виберіть що включити: налаштування, медіафайли, аналітика',
        en: 'Select what to include: settings, media files, analytics',
        ru: 'Выберите что включить: настройки, медиафайлы, аналитика'
      },
      'settings.step4.download.backup': {
        uk: 'Натисніть "Завантажити копію" - файл збережеться на комп\'ютер',
        en: 'Click "Download backup" - file will save to computer',
        ru: 'Нажмите "Скачать копию" - файл сохранится на компьютер'
      },
      'settings.step4.desc2': {
        uk: 'Відновлення з резервної копії:',
        en: 'Restoring from backup:',
        ru: 'Восстановление из резервной копии:'
      },
      'settings.step4.restore.click': {
        uk: 'Натисніть "Відновити з копії"',
        en: 'Click "Restore from backup"',
        ru: 'Нажмите "Восстановить из копии"'
      },
      'settings.step4.select.file': {
        uk: 'Оберіть файл резервної копії',
        en: 'Select backup file',
        ru: 'Выберите файл резервной копии'
      },
      'settings.step4.confirm.restore': {
        uk: 'Підтвердіть операцію (це замінить поточні дані)',
        en: 'Confirm operation (this will replace current data)',
        ru: 'Подтвердите операцию (это заменит текущие данные)'
      },
      'settings.step4.wait.complete': {
        uk: 'Дочекайтеся завершення процесу',
        en: 'Wait for process completion',
        ru: 'Дождитесь завершения процесса'
      },

      'settings.step5.title': {
        uk: '5️⃣ Очищення та скидання',
        en: '5️⃣ Cleanup and Reset',
        ru: '5️⃣ Очистка и сброс'
      },
      'settings.step5.desc1': {
        uk: 'Селективне очищення:',
        en: 'Selective cleanup:',
        ru: 'Селективная очистка:'
      },
      'settings.step5.clear.media': {
        uk: 'Очистити медіафайли: Видаляє всі завантажені файли',
        en: 'Clear media files: Deletes all uploaded files',
        ru: 'Очистить медиафайлы: Удаляет все загруженные файлы'
      },
      'settings.step5.clear.settings': {
        uk: 'Очистити налаштування: Скидає до заводських налаштувань',
        en: 'Clear settings: Resets to factory defaults',
        ru: 'Очистить настройки: Сбрасывает до заводских настроек'
      },
      'settings.step5.clear.analytics': {
        uk: 'Очистити аналітику: Видаляє всі дані відвідувань',
        en: 'Clear analytics: Deletes all visit data',
        ru: 'Очистить аналитику: Удаляет все данные посещений'
      },
      'settings.step5.clear.cache': {
        uk: 'Очистити кеш: Очищає тимчасові файли (безпечно)',
        en: 'Clear cache: Clears temporary files (safe)',
        ru: 'Очистить кеш: Очищает временные файлы (безопасно)'
      },
      'settings.step5.desc2': {
        uk: 'Повне скидання системи:',
        en: 'Full system reset:',
        ru: 'Полный сброс системы:'
      },
      'settings.step5.warning': {
        uk: '⚠️ УВАГА: Ця операція незворотна!',
        en: '⚠️ WARNING: This operation is irreversible!',
        ru: '⚠️ ВНИМАНИЕ: Эта операция необратима!'
      },
      'settings.step5.backup.before': {
        uk: 'Перед скиданням обов\'язково створіть резервну копію',
        en: 'Before reset, be sure to create a backup',
        ru: 'Перед сбросом обязательно создайте резервную копию'
      },
      'settings.step5.reset.button': {
        uk: 'Натисніть "Скинути все до заводських налаштувань"',
        en: 'Click "Reset everything to factory settings"',
        ru: 'Нажмите "Сбросить все до заводских настроек"'
      },
      'settings.step5.confirm.word': {
        uk: 'Введіть слово "СКИНУТИ" для підтвердження',
        en: 'Enter word "RESET" for confirmation',
        ru: 'Введите слово "СБРОС" для подтверждения'
      },
      'settings.step5.system.restart': {
        uk: 'Система перезавантажиться з чистими налаштуваннями',
        en: 'System will restart with clean settings',
        ru: 'Система перезагрузится с чистыми настройками'
      },

      'settings.step6.title': {
        uk: '6️⃣ Технічні налаштування',
        en: '6️⃣ Technical Settings',
        ru: '6️⃣ Технические настройки'
      },
      'settings.step6.desc1': {
        uk: 'Продуктивність:',
        en: 'Performance:',
        ru: 'Производительность:'
      },
      'settings.step6.caching': {
        uk: 'Кешування: Увімкніть для швидшої роботи',
        en: 'Caching: Enable for faster performance',
        ru: 'Кеширование: Включите для быстрой работы'
      },
      'settings.step6.image.compression': {
        uk: 'Стиснення зображень: Автоматична оптимізація',
        en: 'Image compression: Automatic optimization',
        ru: 'Сжатие изображений: Автоматическая оптимизация'
      },
      'settings.step6.lazy.loading': {
        uk: 'Відкладене завантаження: Покращує швидкість',
        en: 'Lazy loading: Improves speed',
        ru: 'Отложенная загрузка: Улучшает скорость'
      },
      'settings.step6.desc2': {
        uk: 'Інтеграції:',
        en: 'Integrations:',
        ru: 'Интеграции:'
      },
      'settings.step6.google.analytics': {
        uk: 'Google Analytics: Введіть Measurement ID',
        en: 'Google Analytics: Enter Measurement ID',
        ru: 'Google Analytics: Введите Measurement ID'
      },
      'settings.step6.meta.pixel': {
        uk: 'Meta Pixel: Додайте Pixel ID для Facebook',
        en: 'Meta Pixel: Add Pixel ID for Facebook',
        ru: 'Meta Pixel: Добавьте Pixel ID для Facebook'
      },
      'settings.step6.search.console': {
        uk: 'Google Search Console: Підтвердіть володіння сайтом',
        en: 'Google Search Console: Verify site ownership',
        ru: 'Google Search Console: Подтвердите владение сайтом'
      },

      // Tips section detailed translations
      'tips.speed.title': {
        uk: '🚀 Оптимізація швидкості та продуктивності',
        en: '🚀 Speed and Performance Optimization',
        ru: '🚀 Оптимизация скорости и производительности'
      },
      'tips.file.sizes.title': {
        uk: '📁 Розміри файлів для ідеальної роботи:',
        en: '📁 File sizes for perfect operation:',
        ru: '📁 Размеры файлов для идеальной работы:'
      },
      'tips.images.size': {
        uk: 'Зображення: До 2MB (система автооптимізує до 800x600px)',
        en: 'Images: Up to 2MB (system auto-optimizes to 800x600px)',
        ru: 'Изображения: До 2MB (система автооптимизирует до 800x600px)'
      },
      'tips.audio.size': {
        uk: 'Аудіо файли: До 5MB (оптимально MP3 128-320kbps)',
        en: 'Audio files: Up to 5MB (optimal MP3 128-320kbps)',
        ru: 'Аудио файлы: До 5MB (оптимально MP3 128-320kbps)'
      },
      'tips.video.size': {
        uk: 'Відео: До 10MB (система конвертує в WebM/MP4)',
        en: 'Video: Up to 10MB (system converts to WebM/MP4)',
        ru: 'Видео: До 10MB (система конвертирует в WebM/MP4)'
      },
      'tips.spline.size': {
        uk: 'Spline 3D файли: До 15MB для плавної роботи',
        en: 'Spline 3D files: Up to 15MB for smooth operation',
        ru: 'Spline 3D файлы: До 15MB для плавной работы'
      },
      'tips.formats.title': {
        uk: '🎯 Формати для найкращої якості:',
        en: '🎯 Formats for best quality:',
        ru: '🎯 Форматы для лучшего качества:'
      },
      'tips.jpg.format': {
        uk: 'JPG: Фотографії та складні зображення',
        en: 'JPG: Photos and complex images',
        ru: 'JPG: Фотографии и сложные изображения'
      },
      'tips.png.format': {
        uk: 'PNG: Логотипи, іконки, графіка з прозорістю',
        en: 'PNG: Logos, icons, graphics with transparency',
        ru: 'PNG: Логотипы, иконки, графика с прозрачностью'
      },
      'tips.webp.format': {
        uk: 'WEBP: Найкраща оптимізація (якщо підтримується)',
        en: 'WEBP: Best optimization (if supported)',
        ru: 'WEBP: Лучшая оптимизация (если поддерживается)'
      },
      'tips.mp3.format': {
        uk: 'MP3: Універсальний аудіо формат',
        en: 'MP3: Universal audio format',
        ru: 'MP3: Универсальный аудио формат'
      },
      'tips.mp4.format': {
        uk: 'MP4: Найкраща сумісність для відео',
        en: 'MP4: Best compatibility for video',
        ru: 'MP4: Лучшая совместимость для видео'
      },

      'tips.design.title': {
        uk: '🎨 Секрети професійного дизайну',
        en: '🎨 Professional Design Secrets',
        ru: '🎨 Секреты профессионального дизайна'
      },
      'tips.color.harmony.title': {
        uk: '🎨 Кольорова гармонія:',
        en: '🎨 Color harmony:',
        ru: '🎨 Цветовая гармония:'
      },
      'tips.color.limit': {
        uk: 'Використовуйте не більше 3-4 основних кольорів',
        en: 'Use no more than 3-4 main colors',
        ru: 'Используйте не более 3-4 основных цветов'
      },
      'tips.accent.color': {
        uk: 'Акцентний колір - для кнопок та важливих елементів',
        en: 'Accent color - for buttons and important elements',
        ru: 'Акцентный цвет - для кнопок и важных элементов'
      },
      'tips.contrast.check': {
        uk: 'Перевіряйте контраст тексту (мінімум 4.5:1 для доступності)',
        en: 'Check text contrast (minimum 4.5:1 for accessibility)',
        ru: 'Проверяйте контраст текста (минимум 4.5:1 для доступности)'
      },
      'tips.dark.text': {
        uk: 'Темний текст (#333) на світлому фоні завжди читається краще',
        en: 'Dark text (#333) on light background always reads better',
        ru: 'Темный текст (#333) на светлом фоне всегда читается лучше'
      },
      'tips.responsive.title': {
        uk: '📱 Адаптивний дизайн:',
        en: '📱 Responsive design:',
        ru: '📱 Адаптивный дизайн:'
      },
      'tips.mobile.first': {
        uk: 'Mobile First: Спочатку налаштуйте мобільну версію',
        en: 'Mobile First: Configure mobile version first',
        ru: 'Mobile First: Сначала настройте мобильную версию'
      },
      'tips.font.sizes': {
        uk: 'Розміри шрифтів: 16px+ на мобільних, 18px+ на десктопі',
        en: 'Font sizes: 16px+ on mobile, 18px+ on desktop',
        ru: 'Размеры шрифтов: 16px+ на мобильных, 18px+ на десктопе'
      },
      'tips.button.sizes': {
        uk: 'Кнопки: Мінімум 44px висота для зручного натискання',
        en: 'Buttons: Minimum 44px height for comfortable tapping',
        ru: 'Кнопки: Минимум 44px высота для удобного нажатия'
      },
      'tips.mobile.padding': {
        uk: 'Відступи: Збільшуйте padding на мобільних пристроях',
        en: 'Spacing: Increase padding on mobile devices',
        ru: 'Отступы: Увеличивайте padding на мобильных устройствах'
      },

      'tips.audio.title': {
        uk: '🎵 Майстерність звукового дизайну',
        en: '🎵 Audio Design Mastery',
        ru: '🎵 Мастерство звукового дизайна'
      },
      'tips.volume.title': {
        uk: '🔊 Налаштування гучності:',
        en: '🔊 Volume settings:',
        ru: '🔊 Настройки громкости:'
      },
      'tips.background.music': {
        uk: 'Фонова музика: 20-30% (не заважає концентрації)',
        en: 'Background music: 20-30% (doesn\'t interfere with concentration)',
        ru: 'Фоновая музыка: 20-30% (не мешает концентрации)'
      },
      'tips.hover.sounds': {
        uk: 'Hover звуки: 40-50% (помітно, але делікатно)',
        en: 'Hover sounds: 40-50% (noticeable but delicate)',
        ru: 'Hover звуки: 40-50% (заметно, но деликатно)'
      },
      'tips.click.sounds': {
        uk: 'Click звуки: 60-70% (чіткий фідбек)',
        en: 'Click sounds: 60-70% (clear feedback)',
        ru: 'Click звуки: 60-70% (четкий фидбэк)'
      },
      'tips.carousel.sounds': {
        uk: 'Карусель: 30-40% (супроводжує анімацію)',
        en: 'Carousel: 30-40% (accompanies animation)',
        ru: 'Карусель: 30-40% (сопровождает анимацию)'
      },
      'tips.audio.pro.title': {
        uk: '🎼 Професійні поради:',
        en: '🎼 Professional tips:',
        ru: '🎼 Профессиональные советы:'
      },
      'tips.short.sounds': {
        uk: 'Використовуйте короткі звуки (0.2-0.5 сек) для UI',
        en: 'Use short sounds (0.2-0.5 sec) for UI',
        ru: 'Используйте короткие звуки (0.2-0.5 сек) для UI'
      },
      'tips.instrumental.music': {
        uk: 'Фонова музика - інструментальна, без вокалу',
        en: 'Background music - instrumental, without vocals',
        ru: 'Фоновая музыка - инструментальная, без вокала'
      },
      'tips.mute.option': {
        uk: 'Завжди додавайте можливість відключення звуку',
        en: 'Always add mute option',
        ru: 'Всегда добавляйте возможность отключения звука'
      },
      'tips.test.devices': {
        uk: 'Тестуйте на різних пристроях (динаміки/навушники)',
        en: 'Test on different devices (speakers/headphones)',
        ru: 'Тестируйте на разных устройствах (динамики/наушники)'
      },

      'tips.animations.title': {
        uk: '✨ Анімації та 3D ефекти',
        en: '✨ Animations and 3D Effects',
        ru: '✨ Анимации и 3D эффекты'
      },
      'tips.animations.choice.title': {
        uk: '🎬 Вибір анімацій для елементів:',
        en: '🎬 Animation choice for elements:',
        ru: '🎬 Выбор анимаций для элементов:'
      },
      'tips.titles.animations': {
        uk: 'Заголовки: fadeIn, slideUp, zoomIn (солідно та професійно)',
        en: 'Titles: fadeIn, slideUp, zoomIn (solid and professional)',
        ru: 'Заголовки: fadeIn, slideUp, zoomIn (солидно и профессионально)'
      },
      'tips.subtitles.animations': {
        uk: 'Підзаголовки: slideLeft, slideRight (динаміка)',
        en: 'Subtitles: slideLeft, slideRight (dynamic)',
        ru: 'Подзаголовки: slideLeft, slideRight (динамика)'
      },
      'tips.descriptions.animations': {
        uk: 'Описи: fadeIn з затримкою (послідовність)',
        en: 'Descriptions: fadeIn with delay (sequence)',
        ru: 'Описания: fadeIn с задержкой (последовательность)'
      },
      'tips.buttons.animations': {
        uk: 'Кнопки: bounce, glow (привертають увагу)',
        en: 'Buttons: bounce, glow (attract attention)',
        ru: 'Кнопки: bounce, glow (привлекают внимание)'
      },
      'tips.spline.optimization.title': {
        uk: '🚀 Spline 3D оптимізація:',
        en: '🚀 Spline 3D optimization:',
        ru: '🚀 Spline 3D оптимизация:'
      },
      'tips.low.poly': {
        uk: 'Використовуйте Low-poly моделі для швидкості',
        en: 'Use Low-poly models for speed',
        ru: 'Используйте Low-poly модели для скорости'
      },
      'tips.background.position': {
        uk: 'Position: \'background\' для декоративних елементів',
        en: 'Position: \'background\' for decorative elements',
        ru: 'Position: \'background\' для декоративных элементов'
      },
      'tips.foreground.position': {
        uk: 'Position: \'foreground\' для інтерактивних об\'єктів',
        en: 'Position: \'foreground\' for interactive objects',
        ru: 'Position: \'foreground\' для интерактивных объектов'
      },
      'tips.opacity.setting': {
        uk: 'Opacity 80-90% для гармонійного поєднання',
        en: 'Opacity 80-90% for harmonious combination',
        ru: 'Opacity 80-90% для гармоничного сочетания'
      },

      'tips.hotkeys.title': {
        uk: '⚡ Швидкі клавіші та лайфхаки',
        en: '⚡ Hotkeys and Lifehacks',
        ru: '⚡ Горячие клавиши и лайфхаки'
      },
      'tips.keyboard.shortcuts.title': {
        uk: '⌨️ Горячі клавіші:',
        en: '⌨️ Keyboard shortcuts:',
        ru: '⌨️ Горячие клавиши:'
      },
      'tips.ctrl.s': {
        uk: 'Ctrl+S: Швидке збереження в будь-якому конструкторі',
        en: 'Ctrl+S: Quick save in any constructor',
        ru: 'Ctrl+S: Быстрое сохранение в любом конструкторе'
      },
      'tips.ctrl.z': {
        uk: 'Ctrl+Z: Скасування останньої дії',
        en: 'Ctrl+Z: Undo last action',
        ru: 'Ctrl+Z: Отмена последнего действия'
      },
      'tips.ctrl.shift.p': {
        uk: 'Ctrl+Shift+P: Швидкий попередній перегляд',
        en: 'Ctrl+Shift+P: Quick preview',
        ru: 'Ctrl+Shift+P: Быстрый предварительный просмотр'
      },
      'tips.ctrl.e': {
        uk: 'Ctrl+E: Експорт поточних налаштувань',
        en: 'Ctrl+E: Export current settings',
        ru: 'Ctrl+E: Экспорт текущих настроек'
      },
      'tips.quick.actions.title': {
        uk: '🎯 Швидкі дії:',
        en: '🎯 Quick actions:',
        ru: '🎯 Быстрые действия:'
      },
      'tips.drag.drop': {
        uk: 'Drag & Drop: Перетягуйте файли з провідника прямо в контент-менеджер',
        en: 'Drag & Drop: Drag files from explorer directly to content manager',
        ru: 'Drag & Drop: Перетаскивайте файлы из проводника прямо в контент-менеджер'
      },
      'tips.double.click': {
        uk: 'Подвійний клік: Швидке редагування назви файлу',
        en: 'Double click: Quick file name editing',
        ru: 'Двойной клик: Быстрое редактирование имени файла'
      },
      'tips.f12.mobile': {
        uk: 'F12 + мобільний режим: Тестування адаптивності',
        en: 'F12 + mobile mode: Responsiveness testing',
        ru: 'F12 + мобильный режим: Тестирование адаптивности'
      },
      'tips.ctrl.shift.i': {
        uk: 'Ctrl+Shift+I: Інспектор елементів для дебагу',
        en: 'Ctrl+Shift+I: Element inspector for debugging',
        ru: 'Ctrl+Shift+I: Инспектор элементов для отладки'
      },

      'tips.security.title': {
        uk: '💾 Безпека та резервування даних',
        en: '💾 Security and Data Backup',
        ru: '💾 Безопасность и резервирование данных'
      },
      'tips.backup.strategy.title': {
        uk: '🛡️ Стратегія резервування:',
        en: '🛡️ Backup strategy:',
        ru: '🛡️ Стратегия резервирования:'
      },
      'tips.daily.backup': {
        uk: 'Щодня: Експорт налаштувань конструкторів',
        en: 'Daily: Export constructor settings',
        ru: 'Ежедневно: Экспорт настроек конструкторов'
      },
      'tips.weekly.backup': {
        uk: 'Щотижня: Повна резервна копія включно з медіа',
        en: 'Weekly: Full backup including media',
        ru: 'Еженедельно: Полная резервная копия включая медиа'
      },
      'tips.before.changes': {
        uk: 'Перед великими змінами: Обов\'язковий експорт',
        en: 'Before major changes: Mandatory export',
        ru: 'Перед большими изменениями: Обязательный экспорт'
      },
      'tips.versioning': {
        uk: 'Версіонування: Додавайте дату до назви копій',
        en: 'Versioning: Add date to backup names',
        ru: 'Версионирование: Добавляйте дату к названиям копий'
      },
      'tips.device.migration.title': {
        uk: '🔄 Міграція пристроїв:',
        en: '🔄 Device migration:',
        ru: '🔄 Миграция устройств:'
      },
      'tips.export.old.device': {
        uk: 'Експортуйте повну копію на старому пристрої',
        en: 'Export full backup on old device',
        ru: 'Экспортируйте полную копию на старом устройстве'
      },
      'tips.import.new.device': {
        uk: 'Імпортуйте дані через розділ "Налаштування"',
        en: 'Import data through "Settings" section',
        ru: 'Импортируйте данные через раздел "Настройки"'
      },
      'tips.check.media.files': {
        uk: 'Перевірте роботу всіх медіафайлів',
        en: 'Check all media files work',
        ru: 'Проверьте работу всех медиафайлов'
      },
      'tips.test.interactive': {
        uk: 'Протестуйте всі інтерактивні елементи',
        en: 'Test all interactive elements',
        ru: 'Протестируйте все интерактивные элементы'
      },

      'tips.seo.title': {
        uk: '📊 SEO та просування',
        en: '📊 SEO and Promotion',
        ru: '📊 SEO и продвижение'
      },
      'tips.seo.basics.title': {
        uk: '🔍 Основи SEO:',
        en: '🔍 SEO basics:',
        ru: '🔍 Основы SEO:'
      },
      'tips.title.length': {
        uk: 'Title: 50-60 символів, включає ключові слова',
        en: 'Title: 50-60 characters, include keywords',
        ru: 'Title: 50-60 символов, включает ключевые слова'
      },
      'tips.description.length': {
        uk: 'Description: 150-160 символів, заклик до дії',
        en: 'Description: 150-160 characters, call to action',
        ru: 'Description: 150-160 символов, призыв к действию'
      },
      'tips.keywords.count': {
        uk: 'Keywords: 5-10 ключових слів через кому',
        en: 'Keywords: 5-10 keywords separated by commas',
        ru: 'Keywords: 5-10 ключевых слов через запятую'
      },
      'tips.og.image.size': {
        uk: 'OG Image: 1200x630px для соціальних мереж',
        en: 'OG Image: 1200x630px for social networks',
        ru: 'OG Image: 1200x630px для социальных сетей'
      },
      'tips.technical.optimization.title': {
        uk: '🚀 Технічна оптимізація:',
        en: '🚀 Technical optimization:',
        ru: '🚀 Техническая оптимизация:'
      },
      'tips.enable.compression': {
        uk: 'Увімкніть стиснення зображень в налаштуваннях',
        en: 'Enable image compression in settings',
        ru: 'Включите сжатие изображений в настройках'
      },
      'tips.add.analytics': {
        uk: 'Додайте Google Analytics ID для відстеження',
        en: 'Add Google Analytics ID for tracking',
        ru: 'Добавьте Google Analytics ID для отслеживания'
      },
      'tips.set.language': {
        uk: 'Встановіть правильну мову сайту',
        en: 'Set correct site language',
        ru: 'Установите правильный язык сайта'
      },
      'tips.check.pagespeed': {
        uk: 'Перевірте швидкість завантаження на PageSpeed Insights',
        en: 'Check loading speed on PageSpeed Insights',
        ru: 'Проверьте скорость загрузки на PageSpeed Insights'
      },

      'tips.professional.title': {
        uk: '🎯 Професійні трюки',
        en: '🎯 Professional Tricks',
        ru: '🎯 Профессиональные трюки'
      },
      'tips.design.secrets.title': {
        uk: '🎨 Дизайн секрети:',
        en: '🎨 Design secrets:',
        ru: '🎨 Дизайн секреты:'
      },
      'tips.color.rule': {
        uk: 'Правило 60-30-10: 60% основний колір, 30% вторинний, 10% акцент',
        en: 'Rule 60-30-10: 60% main color, 30% secondary, 10% accent',
        ru: 'Правило 60-30-10: 60% основной цвет, 30% вторичный, 10% акцент'
      },
      'tips.golden.ratio': {
        uk: 'Золоте січення: 1:1.618 для пропорцій елементів',
        en: 'Golden ratio: 1:1.618 for element proportions',
        ru: 'Золотое сечение: 1:1.618 для пропорций элементов'
      },
      'tips.typewriter.animation': {
        uk: 'Typewriter анімація: Ідеальна для IT/Tech тематики',
        en: 'Typewriter animation: Perfect for IT/Tech themes',
        ru: 'Typewriter анимация: Идеальна для IT/Tech тематики'
      },
      'tips.gradient.backgrounds': {
        uk: 'Gradient backgrounds: Додають глибину та сучасність',
        en: 'Gradient backgrounds: Add depth and modernity',
        ru: 'Gradient backgrounds: Добавляют глубину и современность'
      },
      'tips.client.work.title': {
        uk: '⚡ Для роботи з клієнтами:',
        en: '⚡ For client work:',
        ru: '⚡ Для работы с клиентами:'
      },
      'tips.carousel.variants': {
        uk: 'Створюйте 2-3 варіанти стилю каруселі для вибору',
        en: 'Create 2-3 carousel style variants for choice',
        ru: 'Создавайте 2-3 варианта стиля карусели для выбора'
      },
      'tips.client.logo': {
        uk: 'Додавайте логотип клієнта на всі сторінки',
        en: 'Add client logo to all pages',
        ru: 'Добавляйте логотип клиента на все страницы'
      },
      'tips.corporate.colors': {
        uk: 'Використовуйте корпоративні кольори в градієнтах',
        en: 'Use corporate colors in gradients',
        ru: 'Используйте корпоративные цвета в градиентах'
      },
      'tips.setup.analytics.early': {
        uk: 'Налаштуйте аналітику з самого початку',
        en: 'Set up analytics from the beginning',
        ru: 'Настройте аналитику с самого начала'
      }
    };
    
    return texts[key] ? texts[key][language] || texts[key]['uk'] : key;
  };

  const sections = [
    {
      id: 'overview',
      title: getLocalizedText('nav.overview.title'),
      icon: '🏠',
      color: 'blue'
    },
    {
      id: 'preview',
      title: t('nav.preview'),
      icon: '🎨',
      color: 'pink'
    },
    {
      id: 'intro',
      title: t('nav.intro'),
      icon: '🎬',
      color: 'purple'
    },
    {
      id: 'main',
      title: t('nav.main'),
      icon: '🎠',
      color: 'green'
    },
    {
      id: 'content',
      title: t('nav.content'),
      icon: '📁',
      color: 'orange'
    },
    {
      id: 'analytics',
      title: t('nav.analytics'),
      icon: '📊',
      color: 'indigo'
    },
    {
      id: 'settings',
      title: t('nav.settings'),
      icon: '⚙️',
      color: 'slate'
    },
    {
      id: 'tips',
      title: getLocalizedText('nav.tips.title'),
      icon: '💡',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-100',
        icon: 'from-blue-500 to-cyan-500',
        text: 'text-blue-800',
        button: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-100',
        icon: 'from-purple-500 to-violet-500',
        text: 'text-purple-800',
        button: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200'
      },
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-100',
        icon: 'from-green-500 to-emerald-500',
        text: 'text-green-800',
        button: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200'
      },
      orange: {
        bg: 'from-orange-50 to-amber-50',
        border: 'border-orange-100',
        icon: 'from-orange-500 to-amber-500',
        text: 'text-orange-800',
        button: 'text-orange-600 bg-orange-50 hover:bg-orange-100 border-orange-200'
      },
      pink: {
        bg: 'from-pink-50 to-rose-50',
        border: 'border-pink-100',
        icon: 'from-pink-500 to-rose-500',
        text: 'text-pink-800',
        button: 'text-pink-600 bg-pink-50 hover:bg-pink-100 border-pink-200'
      },
      indigo: {
        bg: 'from-indigo-50 to-blue-50',
        border: 'border-indigo-100',
        icon: 'from-indigo-500 to-blue-500',
        text: 'text-indigo-800',
        button: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200'
      },
      slate: {
        bg: 'from-slate-50 to-gray-50',
        border: 'border-slate-100',
        icon: 'from-slate-500 to-gray-500',
        text: 'text-slate-800',
        button: 'text-slate-600 bg-slate-50 hover:bg-slate-100 border-slate-200'
      },
      yellow: {
        bg: 'from-yellow-50 to-amber-50',
        border: 'border-yellow-100',
        icon: 'from-yellow-500 to-amber-500',
        text: 'text-yellow-800',
        button: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">🚀</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('overview.main.title')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('overview.main.subtitle')}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-2 lg:mb-4 text-xs lg:text-base">
                <strong>SMM OS</strong> - {getLocalizedText('overview.description')}
              </p>
              <div className="bg-white/70 rounded-md lg:rounded-xl p-2 lg:p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-1 lg:mb-2 text-xs lg:text-base">🎯 {getLocalizedText('overview.main.idea')}</h4>
                <p className="text-xs lg:text-sm text-gray-700">
                  {getLocalizedText('overview.main.idea.description')}
                </p>
              </div>
            </div>

            <div className="grid gap-2 lg:gap-4">
              <div className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-green-100 shadow-sm">
                <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 flex items-center gap-2 text-xs lg:text-base">
                  ✨ {getLocalizedText('overview.unique.technologies')}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-green-600">{getLocalizedText('overview.frontend.stack')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>React 18:</strong> {getLocalizedText('frontend.react18')}</li>
                      <li>• <strong>TypeScript:</strong> {getLocalizedText('frontend.typescript')}</li>
                      <li>• <strong>Vite:</strong> {getLocalizedText('frontend.vite')}</li>
                      <li>• <strong>Tailwind CSS:</strong> {getLocalizedText('frontend.tailwind')}</li>
                    </ul>
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-blue-600">{getLocalizedText('overview.animations.3d')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>Framer Motion:</strong> {getLocalizedText('animations.framer')}</li>
                      <li>• <strong>Spline 3D:</strong> {getLocalizedText('animations.spline')}</li>
                      <li>• <strong>Particles.js:</strong> {getLocalizedText('animations.particles')}</li>
                      <li>• <strong>CSS 3D Transform:</strong> {getLocalizedText('animations.css3d')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-purple-100 shadow-sm">
                <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 flex items-center gap-2 text-xs lg:text-base">
                  🏗️ {getLocalizedText('overview.system.architecture')}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3">
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-purple-600">{getLocalizedText('overview.constructors')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>Intro Constructor:</strong> {getLocalizedText('constructors.intro')}</li>
                      <li>• <strong>Main Constructor:</strong> {getLocalizedText('constructors.main')}</li>
                      <li>• <strong>Preview Constructor:</strong> {getLocalizedText('constructors.preview')}</li>
                    </ul>
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-orange-600">{getLocalizedText('overview.media.system')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>IndexedDB:</strong> {getLocalizedText('media.indexeddb')}</li>
                      <li>• <strong>Smart Upload:</strong> {getLocalizedText('media.smart.upload')}</li>
                      <li>• <strong>Drag & Drop:</strong> {getLocalizedText('media.drag.drop')}</li>
                      <li>• <strong>Format Convert:</strong> {getLocalizedText('media.format.convert')}</li>
                    </ul>
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-indigo-600">{getLocalizedText('overview.analytics')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>Real-time:</strong> {getLocalizedText('analytics.realtime')}</li>
                      <li>• <strong>Google Analytics:</strong> {getLocalizedText('analytics.google')}</li>
                      <li>• <strong>Charts:</strong> {getLocalizedText('analytics.charts')}</li>
                      <li>• <strong>Export:</strong> {getLocalizedText('analytics.export')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-amber-100 shadow-sm">
                <h4 className="font-semibold text-amber-700 mb-2 lg:mb-3 flex items-center gap-2 text-xs lg:text-base">
                  🎨 {getLocalizedText('overview.carousel.main.feature')}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs lg:text-sm text-gray-700 mb-1 lg:mb-2">
                      <strong>{getLocalizedText('overview.carousel.unique.styles')}</strong>
                    </p>
                    <div className="grid grid-cols-2 gap-1 lg:gap-2">
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.classic.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.classic.desc')}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.modern.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.modern.desc')}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.premium.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.premium.desc')}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.neon.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.neon.desc')}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.glass.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.glass.desc')}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-1 lg:p-2">
                        <p className="text-xs font-medium text-gray-800">{getLocalizedText('carousel.elegant.desc')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('carousel.elegant.desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs lg:text-sm text-gray-700 mb-1 lg:mb-2">
                      <strong>{getLocalizedText('overview.carousel.technical.capabilities')}</strong>
                    </p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('technical.css3d')}</li>
                      <li>• {getLocalizedText('technical.smooth60fps')}</li>
                      <li>• {getLocalizedText('technical.responsive')}</li>
                      <li>• {getLocalizedText('technical.touch.mouse')}</li>
                      <li>• {getLocalizedText('technical.lazy.loading')}</li>
                      <li>• {getLocalizedText('technical.custom.sounds')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-rose-100 shadow-sm">
                <h4 className="font-semibold text-rose-700 mb-2 lg:mb-3 flex items-center gap-2 text-xs lg:text-base">
                  🎵 {getLocalizedText('overview.audio.system')}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-rose-600">{getLocalizedText('overview.audio.types')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>Background Music:</strong> {getLocalizedText('audio.background.music')}</li>
                      <li>• <strong>Hover Sounds:</strong> {getLocalizedText('audio.hover.sounds')}</li>
                      <li>• <strong>Click Sounds:</strong> {getLocalizedText('audio.click.sounds')}</li>
                      <li>• <strong>Carousel Sounds:</strong> {getLocalizedText('audio.carousel.sounds')}</li>
                      <li>• <strong>UI Sounds:</strong> {getLocalizedText('audio.ui.sounds')}</li>
                    </ul>
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <p className="text-xs font-medium text-blue-600">{getLocalizedText('overview.audio.technologies')}</p>
                    <ul className="text-xs lg:text-sm text-gray-600 space-y-0.5 lg:space-y-1">
                      <li>• <strong>Web Audio API:</strong> {getLocalizedText('audio.web.api')}</li>
                      <li>• <strong>Volume Control:</strong> {getLocalizedText('audio.volume.control')}</li>
                      <li>• <strong>Auto Optimization:</strong> {getLocalizedText('audio.auto.optimization')}</li>
                      <li>• <strong>Format Support:</strong> {getLocalizedText('audio.format.support')}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-md lg:rounded-xl p-2 lg:p-4 border border-emerald-100 shadow-sm">
                <h4 className="font-semibold text-emerald-700 mb-2 lg:mb-3 flex items-center gap-2 text-xs lg:text-base">
                  🎯 {getLocalizedText('overview.target.audience')}
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4">
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs">👥</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('overview.target.audience')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.smm.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 text-xs">🎨</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('audience.designers')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.designers.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">💼</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('audience.entrepreneurs')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.entrepreneurs.desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">⚡</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('audience.freelancers')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.freelancers.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-600 text-xs">🚀</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('audience.startups')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.startups.desc')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="w-4 h-4 lg:w-6 lg:h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-xs">📚</span>
                      </div>
                      <div>
                        <p className="text-xs lg:text-sm font-medium text-gray-800">{getLocalizedText('audience.students')}</p>
                        <p className="text-xs text-gray-600 hidden lg:block">{getLocalizedText('audience.students.desc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'intro':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">🎬</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('constructors.intro')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('constructors.intro')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('intro.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('intro.step1.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('intro.step1.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step1.title.field')}</li>
                      <li>• {getLocalizedText('intro.step1.subtitle.field')}</li>
                      <li>• {getLocalizedText('intro.step1.description.field')}</li>
                      <li>• {getLocalizedText('intro.step1.button.text')}</li>
                      <li>• {getLocalizedText('intro.step1.button.link')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('intro.step1.desc3')}</p>
                    <p><strong>Крок 4:</strong> {getLocalizedText('intro.step1.desc4')}</p>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('intro.step2.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('intro.step2.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('intro.step2.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step2.element.select')}</li>
                      <li>• {getLocalizedText('intro.step2.font.family')}</li>
                      <li>• {getLocalizedText('intro.step2.font.weight')}</li>
                      <li>• {getLocalizedText('intro.step2.font.style')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('intro.step2.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step2.primary.color')}</li>
                      <li>• {getLocalizedText('intro.step2.accent.color')}</li>
                      <li>• {getLocalizedText('intro.step2.text.color')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('intro.step3.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('intro.step3.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('intro.step3.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step3.color')}</li>
                      <li>• {getLocalizedText('intro.step3.gradient')}</li>
                      <li>• {getLocalizedText('intro.step3.image')}</li>
                      <li>• {getLocalizedText('intro.step3.video')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('intro.step3.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step3.particles.enable')}</li>
                      <li>• {getLocalizedText('intro.step3.particles.color')}</li>
                      <li>• {getLocalizedText('intro.step3.animation.speed')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('intro.step4.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('intro.step4.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('intro.step4.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step4.music.enable')}</li>
                      <li>• {getLocalizedText('intro.step4.music.select')}</li>
                      <li>• {getLocalizedText('intro.step4.music.volume')}</li>
                      <li>• {getLocalizedText('intro.step4.music.loop')}</li>
                      <li>• {getLocalizedText('intro.step4.music.autoplay')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('intro.step4.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step4.hover.sound')}</li>
                      <li>• {getLocalizedText('intro.step4.click.sound')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-purple-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('intro.step5.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('intro.step5.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('intro.step5.desc2')}</p>
                    <p><strong>Крок 3:</strong> {getLocalizedText('intro.step5.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('intro.step5.spline.url')}</li>
                      <li>• {getLocalizedText('intro.step5.spline.file')}</li>
                      <li>• {getLocalizedText('intro.step5.spline.position')}</li>
                      <li>• {getLocalizedText('intro.step5.spline.settings')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'main':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-green-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">🎠</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('constructors.main')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('constructors.main')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('main.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('main.step1.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('main.step1.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step1.title.field')}</li>
                      <li>• {getLocalizedText('main.step1.subtitle.field')}</li>
                      <li>• {getLocalizedText('main.step1.description.field')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('main.step1.desc3')}</p>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('main.step2.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('main.step2.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('main.step2.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step2.add.element')}</li>
                      <li>• {getLocalizedText('main.step2.project.name')}</li>
                      <li>• {getLocalizedText('main.step2.service.description')}</li>
                      <li>• {getLocalizedText('main.step2.add.image')}</li>
                      <li>• {getLocalizedText('main.step2.add.link')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('main.step2.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step2.style.classic')}</li>
                      <li>• {getLocalizedText('main.step2.style.modern')}</li>
                      <li>• {getLocalizedText('main.step2.style.premium')}</li>
                      <li>• {getLocalizedText('main.step2.style.glass')}</li>
                      <li>• {getLocalizedText('main.step2.style.neon')}</li>
                    </ul>
                    <p><strong>Крок 4:</strong> {getLocalizedText('main.step2.desc4')}</p>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('main.step3.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('main.step3.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('main.step3.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step3.mobile.settings')}</li>
                      <li>• {getLocalizedText('main.step3.tablet.settings')}</li>
                      <li>• {getLocalizedText('main.step3.desktop.settings')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('main.step3.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step3.font.sizes')}</li>
                      <li>• {getLocalizedText('main.step3.element.spacing')}</li>
                      <li>• {getLocalizedText('main.step3.line.height')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('main.step4.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('main.step4.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('main.step4.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step4.transition.sound')}</li>
                      <li>• {getLocalizedText('main.step4.hover.sound')}</li>
                      <li>• {getLocalizedText('main.step4.click.sound')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('main.step4.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step4.upload.audio')}</li>
                      <li>• {getLocalizedText('main.step4.set.volume')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-green-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('main.step5.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('main.step5.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('main.step5.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('main.step5.test.scroll')}</li>
                      <li>• {getLocalizedText('main.step5.test.links')}</li>
                      <li>• {getLocalizedText('main.step5.test.sounds')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('main.step5.desc3')}</p>
                    <p><strong>Крок 4:</strong> {getLocalizedText('main.step5.desc4')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-orange-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">📁</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('nav.content')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('nav.content')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-orange-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('content.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('content.step1.method1.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step1.method1.step1')}</li>
                      <li>• {getLocalizedText('content.step1.method1.step2')}</li>
                      <li>• {getLocalizedText('content.step1.method1.step3')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step1.method2.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step1.method2.step1')}</li>
                      <li>• {getLocalizedText('content.step1.method2.step2')}</li>
                      <li>• {getLocalizedText('content.step1.method2.step3')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step1.formats.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step1.formats.images')}</li>
                      <li>• {getLocalizedText('content.step1.formats.audio')}</li>
                      <li>• {getLocalizedText('content.step1.formats.video')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-orange-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('content.step2.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('content.step2.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step2.search.name')}</li>
                      <li>• {getLocalizedText('content.step2.search.realtime')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('content.step2.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step2.filter.all')}</li>
                      <li>• {getLocalizedText('content.step2.filter.images')}</li>
                      <li>• {getLocalizedText('content.step2.filter.audio')}</li>
                      <li>• {getLocalizedText('content.step2.filter.video')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-orange-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('content.step3.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('content.step3.rename.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step3.rename.step1')}</li>
                      <li>• {getLocalizedText('content.step3.rename.step2')}</li>
                      <li>• {getLocalizedText('content.step3.rename.step3')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step3.delete.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step3.delete.step1')}</li>
                      <li>• {getLocalizedText('content.step3.delete.step2')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step3.select.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step3.select.step1')}</li>
                      <li>• {getLocalizedText('content.step3.select.step2')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-orange-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('content.step4.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('content.step4.backup.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step4.backup.step1')}</li>
                      <li>• {getLocalizedText('content.step4.backup.step2')}</li>
                      <li>• {getLocalizedText('content.step4.backup.step3')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step4.restore.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step4.restore.step1')}</li>
                      <li>• {getLocalizedText('content.step4.restore.step2')}</li>
                      <li>• {getLocalizedText('content.step4.restore.step3')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-orange-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('content.step5.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('content.step5.auto.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step5.auto.images')}</li>
                      <li>• {getLocalizedText('content.step5.auto.audio')}</li>
                      <li>• {getLocalizedText('content.step5.auto.video')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step5.tips.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step5.tips.filesize')}</li>
                      <li>• {getLocalizedText('content.step5.tips.jpg')}</li>
                      <li>• {getLocalizedText('content.step5.tips.mp3')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('content.step5.cleanup.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('content.step5.cleanup.step1')}</li>
                      <li>• {getLocalizedText('content.step5.cleanup.step2')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-pink-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">👁️</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('nav.preview')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('nav.preview.desc')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-pink-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('preview.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('preview.step1.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('preview.step1.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('preview.step1.intro')}</li>
                      <li>• {getLocalizedText('preview.step1.main')}</li>
                      <li>• {getLocalizedText('preview.step1.responsive')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('preview.step1.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('preview.step1.hover')}</li>
                      <li>• {getLocalizedText('preview.step1.click')}</li>
                      <li>• {getLocalizedText('preview.step1.links')}</li>
                      <li>• {getLocalizedText('preview.step1.music')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-3">{getLocalizedText('preview.step2.title')}</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('preview.step2.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('preview.step2.desc2')}</p>
                    <p><strong>Крок 3:</strong> {getLocalizedText('preview.step2.desc3')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• <strong>iPhone 12/13:</strong> 390x844px</li>
                      <li>• <strong>Samsung Galaxy:</strong> 360x740px</li>
                      <li>• <strong>iPad:</strong> 768x1024px</li>
                      <li>• <strong>Desktop:</strong> 1920x1080px</li>
                    </ul>
                    <p><strong>Крок 4:</strong> {getLocalizedText('preview.step2.desc4')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step2.network')}</li>
                      <li>• {getLocalizedText('preview.step2.slow3g')}</li>
                      <li>• {getLocalizedText('preview.step2.reload')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-3">{getLocalizedText('preview.step3.title')}</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('preview.step3.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('preview.step3.desc2')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step3.html')}</li>
                      <li>• {getLocalizedText('preview.step3.zip')}</li>
                      <li>• {getLocalizedText('preview.step3.pwa')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('preview.step3.desc3')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step3.minify')}</li>
                      <li>• {getLocalizedText('preview.step3.optimize')}</li>
                      <li>• {getLocalizedText('preview.step3.service')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-3">{getLocalizedText('preview.step4.title')}</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>{getLocalizedText('preview.step4.popular')}</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step4.netlify.desc')}</li>
                      <li>• {getLocalizedText('preview.step4.vercel.desc')}</li>
                      <li>• {getLocalizedText('preview.step4.github.desc')}</li>
                      <li>• {getLocalizedText('preview.step4.firebase.desc')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('preview.step4.netlify.steps')}</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step4.register')}</li>
                      <li>• {getLocalizedText('preview.step4.drag')}</li>
                      <li>• {getLocalizedText('preview.step4.wait')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-700 mb-3">{getLocalizedText('preview.step5.title')}</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('preview.step5.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('preview.step5.desc2')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step5.title.desc')}</li>
                      <li>• {getLocalizedText('preview.step5.description')}</li>
                      <li>• {getLocalizedText('preview.step5.keywords')}</li>
                      <li>• {getLocalizedText('preview.step5.og')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('preview.step5.desc3')}</p>
                    <ul className="ml-4 space-y-1">
                      <li>• {getLocalizedText('preview.step5.business')}</li>
                      <li>• {getLocalizedText('preview.step5.contact')}</li>
                      <li>• {getLocalizedText('preview.step5.geo')}</li>
                    </ul>
                    <p className="text-xs italic text-gray-500">* {getLocalizedText('preview.note')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">📊</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('nav.analytics')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('nav.analytics')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('analytics.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('analytics.step1.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('analytics.step1.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step1.visitors')}</li>
                      <li>• {getLocalizedText('analytics.step1.pages')}</li>
                      <li>• {getLocalizedText('analytics.step1.clicks')}</li>
                      <li>• {getLocalizedText('analytics.step1.session')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('analytics.step1.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step1.interval')}</li>
                      <li>• {getLocalizedText('analytics.step1.retention')}</li>
                      <li>• {getLocalizedText('analytics.step1.anonymize')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('analytics.step2.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('analytics.step2.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step2.ga.login')}</li>
                      <li>• {getLocalizedText('analytics.step2.ga.account')}</li>
                      <li>• {getLocalizedText('analytics.step2.ga.property')}</li>
                      <li>• {getLocalizedText('analytics.step2.ga.copy')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('analytics.step2.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step2.paste')}</li>
                      <li>• {getLocalizedText('analytics.step2.enable')}</li>
                      <li>• {getLocalizedText('analytics.step2.test')}</li>
                      <li>• {getLocalizedText('analytics.step2.save')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('analytics.step3.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('analytics.step3.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step3.total.visitors')}</li>
                      <li>• {getLocalizedText('analytics.step3.page.views')}</li>
                      <li>• {getLocalizedText('analytics.step3.avg.time')}</li>
                      <li>• {getLocalizedText('analytics.step3.bounce.rate')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('analytics.step3.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step3.visits.chart')}</li>
                      <li>• {getLocalizedText('analytics.step3.popular.pages')}</li>
                      <li>• {getLocalizedText('analytics.step3.traffic.sources')}</li>
                      <li>• {getLocalizedText('analytics.step3.devices')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('analytics.step4.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('analytics.step4.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step4.add.goal')}</li>
                      <li>• {getLocalizedText('analytics.step4.goal.name')}</li>
                      <li>• {getLocalizedText('analytics.step4.goal.type')}</li>
                      <li>• {getLocalizedText('analytics.step4.goal.conditions')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('analytics.step4.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step4.phone.clicks')}</li>
                      <li>• {getLocalizedText('analytics.step4.file.downloads')}</li>
                      <li>• {getLocalizedText('analytics.step4.external.links')}</li>
                      <li>• {getLocalizedText('analytics.step4.social.media')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-indigo-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('analytics.step5.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('analytics.step5.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step5.frequency')}</li>
                      <li>• {getLocalizedText('analytics.step5.email')}</li>
                      <li>• {getLocalizedText('analytics.step5.format')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('analytics.step5.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step5.period')}</li>
                      <li>• {getLocalizedText('analytics.step5.export.btn')}</li>
                      <li>• {getLocalizedText('analytics.step5.download')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('analytics.step5.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('analytics.step5.api.key')}</li>
                      <li>• {getLocalizedText('analytics.step5.crm')}</li>
                      <li>• {getLocalizedText('analytics.step5.docs')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-slate-500 to-gray-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">⚙️</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('nav.settings')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('nav.settings')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step1.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step1.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step1.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step1.site.name')}</li>
                      <li>• {getLocalizedText('settings.step1.site.desc')}</li>
                      <li>• {getLocalizedText('settings.step1.email')}</li>
                      <li>• {getLocalizedText('settings.step1.phone')}</li>
                      <li>• {getLocalizedText('settings.step1.address')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('settings.step1.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step1.favicon')}</li>
                      <li>• {getLocalizedText('settings.step1.logo')}</li>
                      <li>• {getLocalizedText('settings.step1.og.image')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step2.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step2.desc1')}</p>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step2.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step2.ukrainian')}</li>
                      <li>• {getLocalizedText('settings.step2.english')}</li>
                      <li>• {getLocalizedText('settings.step2.russian')}</li>
                    </ul>
                    <p><strong>Крок 3:</strong> {getLocalizedText('settings.step2.desc3')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step2.switcher')}</li>
                      <li>• {getLocalizedText('settings.step2.position')}</li>
                      <li>• {getLocalizedText('settings.step2.default')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step3.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step3.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step3.password.section')}</li>
                      <li>• {getLocalizedText('settings.step3.current.password')}</li>
                      <li>• {getLocalizedText('settings.step3.new.password')}</li>
                      <li>• {getLocalizedText('settings.step3.password.rules')}</li>
                      <li>• {getLocalizedText('settings.step3.confirm.password')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step3.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step3.session.duration')}</li>
                      <li>• {getLocalizedText('settings.step3.auto.logout')}</li>
                      <li>• {getLocalizedText('settings.step3.login.button')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step4.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step4.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step4.backup.section')}</li>
                      <li>• {getLocalizedText('settings.step4.create.backup')}</li>
                      <li>• {getLocalizedText('settings.step4.select.include')}</li>
                      <li>• {getLocalizedText('settings.step4.download.backup')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step4.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step4.restore.click')}</li>
                      <li>• {getLocalizedText('settings.step4.select.file')}</li>
                      <li>• {getLocalizedText('settings.step4.confirm.restore')}</li>
                      <li>• {getLocalizedText('settings.step4.wait.complete')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step5.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step5.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step5.clear.media')}</li>
                      <li>• {getLocalizedText('settings.step5.clear.settings')}</li>
                      <li>• {getLocalizedText('settings.step5.clear.analytics')}</li>
                      <li>• {getLocalizedText('settings.step5.clear.cache')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step5.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step5.warning')}</li>
                      <li>• {getLocalizedText('settings.step5.backup.before')}</li>
                      <li>• {getLocalizedText('settings.step5.reset.button')}</li>
                      <li>• {getLocalizedText('settings.step5.confirm.word')}</li>
                      <li>• {getLocalizedText('settings.step5.system.restart')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-slate-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('settings.step6.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>Крок 1:</strong> {getLocalizedText('settings.step6.desc1')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step6.caching')}</li>
                      <li>• {getLocalizedText('settings.step6.image.compression')}</li>
                      <li>• {getLocalizedText('settings.step6.lazy.loading')}</li>
                    </ul>
                    <p><strong>Крок 2:</strong> {getLocalizedText('settings.step6.desc2')}</p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('settings.step6.google.analytics')}</li>
                      <li>• {getLocalizedText('settings.step6.meta.pixel')}</li>
                      <li>• {getLocalizedText('settings.step6.search.console')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tips':
        return (
          <div className="space-y-2 lg:space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-md lg:rounded-2xl p-2 lg:p-6 border border-yellow-100 shadow-sm">
              <div className="flex items-center gap-1 lg:gap-3 mb-2 lg:mb-4">
                <div className="w-4 h-4 lg:w-10 lg:h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-md lg:rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs lg:text-lg">💡</span>
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-bold text-slate-800">{getLocalizedText('tips.main.title')}</h3>
                  <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">{getLocalizedText('tips.main.subtitle')}</p>
                </div>
              </div>
              
              <div className="space-y-2 lg:space-y-4">
                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.speed.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.file.sizes.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.images.size')}</li>
                      <li>• {getLocalizedText('tips.audio.size')}</li>
                      <li>• {getLocalizedText('tips.video.size')}</li>
                      <li>• {getLocalizedText('tips.spline.size')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.formats.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.jpg.format')}</li>
                      <li>• {getLocalizedText('tips.png.format')}</li>
                      <li>• {getLocalizedText('tips.webp.format')}</li>
                      <li>• {getLocalizedText('tips.mp3.format')}</li>
                      <li>• {getLocalizedText('tips.mp4.format')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.design.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.color.harmony.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.color.limit')}</li>
                      <li>• {getLocalizedText('tips.accent.color')}</li>
                      <li>• {getLocalizedText('tips.contrast.check')}</li>
                      <li>• {getLocalizedText('tips.dark.text')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.responsive.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.mobile.first')}</li>
                      <li>• {getLocalizedText('tips.font.sizes')}</li>
                      <li>• {getLocalizedText('tips.button.sizes')}</li>
                      <li>• {getLocalizedText('tips.mobile.padding')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.audio.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.volume.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.background.music')}</li>
                      <li>• {getLocalizedText('tips.hover.sounds')}</li>
                      <li>• {getLocalizedText('tips.click.sounds')}</li>
                      <li>• {getLocalizedText('tips.carousel.sounds')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.audio.pro.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.short.sounds')}</li>
                      <li>• {getLocalizedText('tips.instrumental.music')}</li>
                      <li>• {getLocalizedText('tips.mute.option')}</li>
                      <li>• {getLocalizedText('tips.test.devices')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.animations.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.animations.choice.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.titles.animations')}</li>
                      <li>• {getLocalizedText('tips.subtitles.animations')}</li>
                      <li>• {getLocalizedText('tips.descriptions.animations')}</li>
                      <li>• {getLocalizedText('tips.buttons.animations')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.spline.optimization.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.low.poly')}</li>
                      <li>• {getLocalizedText('tips.background.position')}</li>
                      <li>• {getLocalizedText('tips.foreground.position')}</li>
                      <li>• {getLocalizedText('tips.opacity.setting')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.hotkeys.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.keyboard.shortcuts.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.ctrl.s')}</li>
                      <li>• {getLocalizedText('tips.ctrl.z')}</li>
                      <li>• {getLocalizedText('tips.ctrl.shift.p')}</li>
                      <li>• {getLocalizedText('tips.ctrl.e')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.quick.actions.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.drag.drop')}</li>
                      <li>• {getLocalizedText('tips.double.click')}</li>
                      <li>• {getLocalizedText('tips.f12.mobile')}</li>
                      <li>• {getLocalizedText('tips.ctrl.shift.i')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.security.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.backup.strategy.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.daily.backup')}</li>
                      <li>• {getLocalizedText('tips.weekly.backup')}</li>
                      <li>• {getLocalizedText('tips.before.changes')}</li>
                      <li>• {getLocalizedText('tips.versioning')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.device.migration.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.export.old.device')}</li>
                      <li>• {getLocalizedText('tips.import.new.device')}</li>
                      <li>• {getLocalizedText('tips.check.media.files')}</li>
                      <li>• {getLocalizedText('tips.test.interactive')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.seo.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.seo.basics.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.title.length')}</li>
                      <li>• {getLocalizedText('tips.description.length')}</li>
                      <li>• {getLocalizedText('tips.keywords.count')}</li>
                      <li>• {getLocalizedText('tips.og.image.size')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.technical.optimization.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.enable.compression')}</li>
                      <li>• {getLocalizedText('tips.add.analytics')}</li>
                      <li>• {getLocalizedText('tips.set.language')}</li>
                      <li>• {getLocalizedText('tips.check.pagespeed')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white/50 rounded-md lg:rounded-lg p-2 lg:p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2 lg:mb-3 text-xs lg:text-base">{getLocalizedText('tips.professional.title')}</h4>
                  <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-gray-700">
                    <p><strong>{getLocalizedText('tips.design.secrets.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.color.rule')}</li>
                      <li>• {getLocalizedText('tips.golden.ratio')}</li>
                      <li>• {getLocalizedText('tips.typewriter.animation')}</li>
                      <li>• {getLocalizedText('tips.gradient.backgrounds')}</li>
                    </ul>
                    <p><strong>{getLocalizedText('tips.client.work.title')}</strong></p>
                    <ul className="ml-2 lg:ml-4 space-y-0.5 lg:space-y-1">
                      <li>• {getLocalizedText('tips.carousel.variants')}</li>
                      <li>• {getLocalizedText('tips.client.logo')}</li>
                      <li>• {getLocalizedText('tips.corporate.colors')}</li>
                      <li>• {getLocalizedText('tips.setup.analytics.early')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - ультра-компактний */}
      <div className="p-1 lg:p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="w-4 h-4 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-md lg:rounded-xl flex items-center justify-center">
              <span className="text-white text-xs lg:text-lg">📚</span>
            </div>
            <div>
              <h2 className="text-xs lg:text-lg font-bold text-white">{t('nav.instructions')}</h2>
              <p className="text-blue-100 text-xs hidden lg:block">{getLocalizedText('instructions.full.guide')}</p>
            </div>
          </div>
          <div className="px-1 lg:px-3 py-0.5 lg:py-1 bg-white/20 backdrop-blur-sm rounded-md lg:rounded-lg border border-white/20">
            <span className="text-white text-xs font-medium">{getLocalizedText('instructions.version')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Navigation - адаптивна */}
        <div className="w-full lg:w-64 bg-slate-50 border-b lg:border-r lg:border-b-0 border-slate-200 overflow-y-auto flex-shrink-0">
          <div className="p-1 lg:p-4">
            {/* Мобільна горизонтальна навігація */}
            <div className="grid grid-cols-4 lg:block gap-1 lg:space-y-2">
              {sections.map((section) => {
                const colors = getColorClasses(section.color);
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-1 lg:p-3 rounded-md lg:rounded-xl transition-all duration-200 border text-center lg:text-left min-h-[50px] lg:min-h-auto touch-manipulation ${
                      isActive 
                        ? `${colors.button} border-current shadow-sm`
                        : 'text-slate-600 hover:bg-white hover:text-slate-800 border-transparent'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-center gap-1 lg:gap-3">
                      <span className="text-sm lg:text-lg">{section.icon}</span>
                      <div>
                        <div className="font-medium text-xs lg:text-sm">{section.title}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Area - адаптивні відступи */}
        <div className="flex-1 overflow-y-auto p-1.5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderSectionContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel; 