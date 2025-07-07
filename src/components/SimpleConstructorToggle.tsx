import React from 'react';
import { motion } from 'framer-motion';
import useDragAndDrop from '../hooks/useDragAndDrop';
import { useResponsive } from '../hooks/useResponsive';

interface SimpleConstructorToggleProps {
  onCloseAdminPanel?: () => void;
}

const SimpleConstructorToggle: React.FC<SimpleConstructorToggleProps> = ({ onCloseAdminPanel }) => {
  const { deviceType } = useResponsive();
  const {
    isConstructorMode,
    enableConstructorMode,
    disableConstructorMode
  } = useDragAndDrop(deviceType);

  const handleToggle = () => {
    if (isConstructorMode) {
      disableConstructorMode();
    } else {
      enableConstructorMode();
      // Закриваємо адмін панель при увімкненні конструктора
      if (onCloseAdminPanel) {
        setTimeout(() => {
          onCloseAdminPanel();
        }, 100);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg lg:rounded-2xl p-2 lg:p-6 border border-orange-100 shadow-sm">
      <div className="flex items-center gap-1.5 lg:gap-3 mb-2 lg:mb-6">
        <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-md lg:rounded-xl flex items-center justify-center">
          <span className="text-white text-xs lg:text-lg">🎯</span>
        </div>
        <div>
          <h3 className="text-xs lg:text-lg font-bold text-slate-800">Конструктор позицій</h3>
          <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">Перетягуйте елементи мишкою для зміни позицій</p>
        </div>
      </div>

      <div className="space-y-2 lg:space-y-3">
        <div className="flex items-center justify-between p-2 lg:p-4 bg-white/60 rounded-md lg:rounded-xl border border-orange-100">
          <div className="flex items-center gap-1.5 lg:gap-3">
            <span className="text-sm lg:text-2xl">🎯</span>
            <div>
              <h4 className="text-xs lg:text-base font-semibold text-slate-800">
                {isConstructorMode ? '🟢 Активний' : '🔴 Неактивний'}
              </h4>
              <p className="text-xs lg:text-sm text-slate-600 hidden lg:block">
                {isConstructorMode 
                  ? 'Перетягуйте бокси для переміщення' 
                  : 'Увімкніть для редагування позицій'
                }
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
            className={`px-3 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl font-semibold transition-all duration-300 text-xs lg:text-base ${
              isConstructorMode
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConstructorMode ? 'Вимкнути' : 'Увімкнути'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SimpleConstructorToggle; 