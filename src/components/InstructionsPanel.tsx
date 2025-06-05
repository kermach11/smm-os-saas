import React from 'react';

// ОНОВЛЕНО: 31.05.2025 12:50 - Відновлено оригінальну версію
const InstructionsPanel: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <span className="text-3xl">📖</span>
          🔥 ОНОВЛЕНО! Інструкції користування 🔥
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white/60 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Основні функції
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• <strong>Конструктор інтро:</strong> Налаштування вступної сторінки</li>
              <li>• <strong>Конструктор головної:</strong> Редагування основного контенту</li>
              <li>• <strong>Попередній перегляд:</strong> Перегляд результату в реальному часі</li>
              <li>• <strong>Генератор:</strong> Автоматичне створення контенту</li>
              <li>• <strong>Клієнти:</strong> Управління клієнтською базою</li>
              <li>• <strong>Аналітика:</strong> Статистика та звіти</li>
            </ul>
          </div>

          <div className="bg-white/60 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Звукова система
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• <strong>Фонова музика:</strong> Додайте атмосферну музику для сайту</li>
              <li>• <strong>Звуки наведення:</strong> Звукові ефекти при наведенні курсора</li>
              <li>• <strong>Звуки кліків:</strong> Аудіо відгук при натисканні</li>
              <li>• <strong>Звуки каруселі:</strong> Спеціальні ефекти для навігації</li>
              <li>• <strong>UI звуки:</strong> Системні звуки інтерфейсу</li>
            </ul>
          </div>

          <div className="bg-white/60 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              Швидкі клавіші
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• <strong>← →:</strong> Навігація по каруселі в попередньому перегляді</li>
              <li>• <strong>Enter/Space:</strong> Розгортання деталей карточки</li>
              <li>• <strong>Esc:</strong> Закриття розгорнутих деталей</li>
              <li>• <strong>Ctrl+S:</strong> Збереження налаштувань</li>
            </ul>
          </div>

          <div className="bg-white/60 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              Поради
            </h3>
            <ul className="space-y-2 text-slate-600">
              <li>• Використовуйте автозбереження для безпеки даних</li>
              <li>• Тестуйте на різних пристроях за допомогою перемикача</li>
              <li>• Експортуйте налаштування для резервного копіювання</li>
              <li>• Перевіряйте попередній перегляд перед публікацією</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPanel; 