import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useDragAndDrop from '../hooks/useDragAndDrop';
import { useResponsive } from '../hooks/useResponsive';
import { MainScreenBoxes } from '../config/responsiveConfig';

const ConstructorPanel: React.FC = () => {
  const { deviceType } = useResponsive();
  const {
    isConstructorMode,
    toggleConstructorMode,
    enableConstructorMode,
    disableConstructorMode,
    boxPositions,
    resetBoxPosition,
    resetAllPositions,
    snapToGrid,
    gridSize,
    setSnapToGrid,
    setGridSize,
    savePositions,
    loadPositions,
    snapLines,
    setCurrentPositionsAsDefault
  } = useDragAndDrop(deviceType);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBoxList, setShowBoxList] = useState(false);

  // Список всіх боксів
  const allBoxes: Array<{ key: keyof MainScreenBoxes; name: string; emoji: string }> = [
    { key: 'logoBox', name: 'Логотип', emoji: '🏷️' },
    { key: 'soundToggleBox', name: 'Sound Toggle', emoji: '🔊' },
    { key: 'headerTextBox', name: 'Header Text', emoji: '📝' },
    { key: 'carouselBox', name: 'Carousel', emoji: '🎠' },
    { key: 'paginationBox', name: 'Pagination', emoji: '📖' },
    { key: 'adminButtonBox', name: 'Admin Button', emoji: '⚙️' },
    { key: 'adminPanelBox', name: 'Admin Panel', emoji: '🎛️' }
  ];

  // Отримуємо статистику позицій
  const getPositionStats = () => {
    const devicePositions = Object.entries(boxPositions).filter(([key]) => 
      key.includes(`_${deviceType}`)
    );
    return {
      total: allBoxes.length,
      customized: devicePositions.length,
      percentage: Math.round((devicePositions.length / allBoxes.length) * 100)
    };
  };

  const stats = getPositionStats();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🎯 Конструктор сторінки
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">
            {deviceType.toUpperCase()}
          </span>
          <div className={`w-3 h-3 rounded-full ${
            isConstructorMode ? 'bg-green-500' : 'bg-gray-500'
          }`} />
        </div>
      </div>

      {/* Основні контролі */}
      <div className="space-y-4">
        {/* Увімкнути/вимкнути конструктор */}
        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isConstructorMode ? '🟢 Конструктор активний' : '🔴 Конструктор неактивний'}
            </h3>
            <p className="text-sm text-white/70">
              {isConstructorMode 
                ? 'Перетягуйте бокси мишкою для переміщення' 
                : 'Увімкніть для редагування позицій боксів'
              }
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleConstructorMode}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isConstructorMode
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConstructorMode ? 'Вимкнути' : 'Увімкнути'}
          </motion.button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-white/70">Всього боксів</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.customized}</div>
            <div className="text-sm text-white/70">Налаштовано</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.percentage}%</div>
            <div className="text-sm text-white/70">Прогрес</div>
          </div>
        </div>

        {/* 🎯 НОВИЙ: Стан направляючих ліній */}
        {(snapLines.showVerticalCenter || snapLines.showHorizontalCenter) && (
          <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">🎯 Направляючі лінії</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${snapLines.showVerticalCenter ? 'bg-purple-400' : 'bg-gray-500'}`} />
                <span className="text-white/70">Вертикальна вісь (X):</span>
                <span className={`font-semibold ${snapLines.snapToVerticalCenter ? 'text-purple-300' : 'text-white/50'}`}>
                  {snapLines.snapToVerticalCenter ? 'ЗАХОПЛЕНО' : snapLines.showVerticalCenter ? 'Видима' : 'Приховано'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${snapLines.showHorizontalCenter ? 'bg-purple-400' : 'bg-gray-500'}`} />
                <span className="text-white/70">Горизонтальна вісь (Y):</span>
                <span className={`font-semibold ${snapLines.snapToHorizontalCenter ? 'text-purple-300' : 'text-white/50'}`}>
                  {snapLines.snapToHorizontalCenter ? 'ЗАХОПЛЕНО' : snapLines.showHorizontalCenter ? 'Видима' : 'Приховано'}
                </span>
              </div>
              {snapLines.snapToVerticalCenter && snapLines.snapToHorizontalCenter && (
                <div className="mt-2 p-2 bg-purple-600/30 rounded text-center">
                  <span className="text-purple-200 text-sm font-semibold">✨ ІДЕАЛЬНИЙ ЦЕНТР ✨</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🎯 НОВИЙ: Кнопка для скидання до заводських налаштувань */}
        <div className="bg-green-500/20 rounded-xl p-4 border border-green-500/30">
          <h3 className="text-lg font-semibold text-green-300 mb-3">
            {deviceType === 'mobile' ? '📱 Мобільні налаштування' : 
             deviceType === 'tablet' ? '📟 Планшетні налаштування' : 
             '💻 Десктопні налаштування'}
          </h3>
          <p className="text-sm text-white/70 mb-4">
            Скинути позиції до нових заводських налаштувань для {deviceType === 'mobile' ? 'мобільних' : deviceType === 'tablet' ? 'планшетних' : 'десктопних'} пристроїв
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              // Скидаємо всі позиції для поточного пристрою
              await resetAllPositions();
              
              // Показуємо повідомлення
              console.log(`✅ Позиції скинуті до заводських налаштувань для ${deviceType}`);
              
              // Перезавантажуємо сторінку для застосування змін
              setTimeout(() => {
                window.location.reload();
              }, 500);
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            🏭 Застосувати заводські налаштування ({deviceType.toUpperCase()})
          </motion.button>
        </div>

        {/* Швидкі дії */}
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => savePositions()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            💾 Зберегти
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadPositions()}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            📂 Завантажити
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetAllPositions}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            🔄 Скинути все
          </motion.button>
                </div>

        {/* 🎯 НОВИЙ: Заводські налаштування */}
        <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30">
          <h3 className="text-lg font-semibold text-orange-300 mb-3">🏭 Заводські налаштування</h3>
          <p className="text-sm text-white/70 mb-4">
            Встановіть поточні позиції боксів як заводські для нових користувачів
          </p>
          
          {/* Кнопка для виведення координат */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              console.log('=== ПОТОЧНІ ПОЗИЦІЇ БОКСІВ ===');
              console.log('Тип пристрою:', deviceType);
              console.log('Всі позиції:', boxPositions);
              
              // Формуємо код для заводських позицій
              const positions: Record<string, { x: number; y: number }> = {};
              Object.keys(boxPositions).forEach(key => {
                const pos = boxPositions[key];
                if (pos.relativeX !== undefined && pos.relativeY !== undefined) {
                  positions[pos.boxName] = {
                    x: Math.round(pos.relativeX * 10) / 10,
                    y: Math.round(pos.relativeY * 10) / 10
                  };
                }
              });
              
              console.log('📋 КОД ДЛЯ ЗАВОДСЬКИХ ПОЗИЦІЙ:');
              console.log(JSON.stringify(positions, null, 2));
              
              alert(`✅ Координати виведено в консоль!\n\nПеревірте консоль браузера (F12) для деталей.\nЗнайдено ${Object.keys(positions).length} позицій.`);
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 mb-3"
          >
            📋 Показати координати
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const positions = setCurrentPositionsAsDefault();
              alert(`✅ Поточні позиції встановлено як заводські!\n\nЗбережено ${Object.keys(positions).length} позицій.\nПеревірте консоль браузера для деталей.`);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            🏭 Встановити як заводські
          </motion.button>
          <p className="text-xs text-orange-200/70 mt-2">
            ⚠️ Після встановлення, код буде виведено в консоль браузера
          </p>
        </div>

        {/* Налаштування сітки */}
        <div className="bg-black/20 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">⚙️ Налаштування сітки</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Прив'язка до сітки</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all duration-300 ${
                  snapToGrid
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}
              >
                {snapToGrid ? 'Увімкнено' : 'Вимкнено'}
              </motion.button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Розмір сітки</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="4"
                  max="32"
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-white text-sm w-8">{gridSize}px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Список боксів */}
        <div className="bg-black/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">📦 Управління боксами</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBoxList(!showBoxList)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {showBoxList ? '▼' : '▶'}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showBoxList && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {allBoxes.map((box) => {
                  const hasCustomPosition = boxPositions[`${box.key}_${deviceType}`];
                  const position = hasCustomPosition ? boxPositions[`${box.key}_${deviceType}`] : null;
                  
                  return (
                    <div
                      key={box.key}
                      className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{box.emoji}</span>
                        <div>
                          <div className="text-white font-semibold">{box.name}</div>
                          {position && (
                            <div className="text-xs text-white/50">
                              {/* Показуємо відносні координати якщо вони є */}
                              {position.relativeX !== undefined && position.relativeY !== undefined ? (
                                <div>
                                  <div>📍 {Math.round(position.x)}px, {Math.round(position.y)}px</div>
                                  <div className="text-purple-300">📐 {position.relativeX.toFixed(1)}%, {position.relativeY.toFixed(1)}%</div>
                                </div>
                              ) : (
                                <div>📍 {Math.round(position.x)}px, {Math.round(position.y)}px</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          hasCustomPosition ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                        {hasCustomPosition && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              resetBoxPosition(box.key).catch(error => {
                                console.error('❌ Помилка скидання позиції:', error);
                              });
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            ↺
                          </motion.button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Розширені налаштування */}
        <div className="bg-black/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">🔧 Розширені налаштування</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {showAdvanced ? '▼' : '▶'}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="text-sm text-white/70">
                  <p className="mb-2">
                    <strong>Як користуватися:</strong>
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Увімкніть конструктор для режиму редагування</li>
                    <li>• Перетягуйте бокси мишкою для переміщення</li>
                    <li>• Позиції зберігаються автоматично</li>
                    <li>• Налаштування окремі для кожного пристрою</li>
                  </ul>
                </div>
                <div className="text-sm text-white/70">
                  <p className="mb-2">
                    <strong>Поточний пристрій:</strong> {deviceType}
                  </p>
                  <p className="text-xs mb-2">
                    Позиції зберігаються окремо для мобільних, планшетів та десктопів
                  </p>
                  <div className="bg-purple-500/20 rounded p-2 text-xs">
                    <p className="text-purple-300 font-semibold mb-1">🎯 Автоматичне масштабування</p>
                    <p className="text-white/70">
                      Позиції тепер зберігаються у відносних координатах (%) і автоматично масштабуються при зміні розміру екрана
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ConstructorPanel; 