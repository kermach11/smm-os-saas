import React from 'react';
import { motion } from 'framer-motion';
import { MainScreenBoxes } from '../config/responsiveConfig';

interface BoxResizeControlsProps {
  boxName: keyof MainScreenBoxes;
  isVisible: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const BoxResizeControls: React.FC<BoxResizeControlsProps> = ({
  boxName,
  isVisible,
  onIncrease,
  onDecrease,
  position = 'top-right'
}) => {
  if (!isVisible) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return { top: -10, right: -10 };
      case 'top-left':
        return { top: -10, left: -10 };
      case 'bottom-right':
        return { bottom: -10, right: -10 };
      case 'bottom-left':
        return { bottom: -10, left: -10 };
      default:
        return { top: -10, right: -10 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="absolute z-50 flex flex-col gap-1"
      style={getPositionStyles()}
    >
      {/* Кнопка збільшення */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onIncrease();
        }}
        className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full 
                   flex items-center justify-center font-bold text-sm shadow-lg
                   transition-colors duration-200"
        title="Збільшити розмір"
      >
        +
      </motion.button>

      {/* Кнопка зменшення */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          onDecrease();
        }}
        className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full 
                   flex items-center justify-center font-bold text-sm shadow-lg
                   transition-colors duration-200"
        title="Зменшити розмір"
      >
        -
      </motion.button>

      {/* Індикатор назви боксу */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                      bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
        {boxName}
      </div>
    </motion.div>
  );
};

export default BoxResizeControls; 