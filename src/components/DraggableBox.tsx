import React, { ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainScreenBoxes } from '../config/responsiveConfig';
import useDragAndDrop from '../hooks/useDragAndDrop';

interface DraggableBoxProps {
  boxName: keyof MainScreenBoxes;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  originalStyle?: CSSProperties;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const DraggableBox: React.FC<DraggableBoxProps> = ({
  boxName,
  deviceType,
  children,
  className = '',
  style = {},
  originalStyle = {},
  onClick,
  onMouseEnter,
  onMouseLeave
}) => {
  const {
    isConstructorMode,
    dragState,
    handleMouseDown,
    handleTouchStart,
    getBoxPosition,
    snapToGrid,
    gridSize,
    snapLines,
    boxPositions
  } = useDragAndDrop(deviceType);

  // Отримуємо кастомну позицію якщо вона є
  const customPosition = getBoxPosition(boxName);
  const isDraggedBox = dragState.draggedBox === boxName;
  const isDragging = dragState.isDragging && isDraggedBox;
  
  // Отримуємо збережені відносні координати
  const boxKey = `${boxName}_${deviceType}`;
  const savedPosition = boxPositions[boxKey];
  const hasRelativeCoords = savedPosition?.relativeX !== undefined && savedPosition?.relativeY !== undefined;

  // Обчислюємо фінальні стилі
  const computedStyle: CSSProperties = {
    ...originalStyle,
    ...style,
    // Застосовуємо кастомну позицію якщо вона є
    ...(customPosition && {
      left: customPosition.x,
      top: customPosition.y,
      transform: 'none' // Скидаємо базовий transform
    }),
    // Змінюємо курсор в режимі конструктора
    cursor: isConstructorMode ? 'grab' : originalStyle.cursor || style.cursor || 'default',
    // Додаємо z-index для перетягуваного елемента
    zIndex: isDragging ? 9999 : (style.zIndex || originalStyle.zIndex || 'auto'),
    // Додаємо обводку в режимі конструктора
    outline: isConstructorMode ? '2px dashed #3b82f6' : 'none',
    outlineOffset: isConstructorMode ? '2px' : '0'
  };

  return (
    <>
      {/* Сітка в режимі конструктора */}
      {isConstructorMode && (
        <>
          <div
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: snapToGrid ? `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              ` : 'none',
              backgroundSize: snapToGrid ? `${gridSize}px ${gridSize}px` : 'auto'
            }}
          />
          
          {/* 🎯 НОВИЙ: Направляючі лінії (snap lines) */}
          {(snapLines.showVerticalCenter || snapLines.showHorizontalCenter) && (
            <div className="fixed inset-0 z-20 pointer-events-none">
              {/* Вертикальна центральна лінія (вісь X) */}
              {snapLines.showVerticalCenter && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ 
                    opacity: snapLines.snapToVerticalCenter ? 1 : 0.6,
                    scaleY: 1
                  }}
                  exit={{ opacity: 0, scaleY: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-0 bottom-0 w-0.5"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: snapLines.snapToVerticalCenter 
                      ? 'linear-gradient(to bottom, #8B5CF6, #A855F7, #8B5CF6)'
                      : 'rgba(139, 92, 246, 0.6)',
                    boxShadow: snapLines.snapToVerticalCenter 
                      ? '0 0 20px rgba(139, 92, 246, 0.8), 0 0 10px rgba(139, 92, 246, 0.4)'
                      : '0 0 10px rgba(139, 92, 246, 0.3)'
                  }}
                />
              )}
              
              {/* Горизонтальна центральна лінія (вісь Y) */}
              {snapLines.showHorizontalCenter && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ 
                    opacity: snapLines.snapToHorizontalCenter ? 1 : 0.6,
                    scaleX: 1
                  }}
                  exit={{ opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: snapLines.snapToHorizontalCenter 
                      ? 'linear-gradient(to right, #8B5CF6, #A855F7, #8B5CF6)'
                      : 'rgba(139, 92, 246, 0.6)',
                    boxShadow: snapLines.snapToHorizontalCenter 
                      ? '0 0 20px rgba(139, 92, 246, 0.8), 0 0 10px rgba(139, 92, 246, 0.4)'
                      : '0 0 10px rgba(139, 92, 246, 0.3)'
                  }}
                />
              )}
              
              {/* Центральна точка (перетин осей) */}
              {snapLines.showVerticalCenter && snapLines.showHorizontalCenter && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: (snapLines.snapToVerticalCenter && snapLines.snapToHorizontalCenter) ? 1 : 0.7,
                    scale: (snapLines.snapToVerticalCenter && snapLines.snapToHorizontalCenter) ? 1.2 : 1
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: (snapLines.snapToVerticalCenter && snapLines.snapToHorizontalCenter)
                      ? 'radial-gradient(circle, #A855F7, #8B5CF6)'
                      : 'rgba(139, 92, 246, 0.8)',
                    boxShadow: (snapLines.snapToVerticalCenter && snapLines.snapToHorizontalCenter)
                      ? '0 0 15px rgba(139, 92, 246, 1), 0 0 30px rgba(139, 92, 246, 0.5)'
                      : '0 0 10px rgba(139, 92, 246, 0.4)'
                  }}
                />
              )}
            </div>
          )}
        </>
      )}

      <motion.div
        className={`${className} ${isConstructorMode ? 'constructor-mode' : ''}`}
        style={computedStyle}
        onMouseDown={(e) => handleMouseDown(boxName, e)}
        onTouchStart={(e) => handleTouchStart(boxName, e)}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // Анімації
        animate={{
          scale: isDragging ? 1.02 : 1,
          boxShadow: isDragging 
            ? '0 20px 40px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.1)' 
            : isConstructorMode 
              ? '0 4px 8px rgba(59, 130, 246, 0.2)' 
              : 'none'
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 30 
        }}
        // Додаткові класи для стилізації
        data-box-name={boxName}
        data-constructor-mode={isConstructorMode}
        data-dragging={isDragging}
      >
        {children}

        {/* 🎯 ПОКРАЩЕНИЙ ІНДИКАТОР НАЗВИ БОКСУ в режимі конструктора */}
        <AnimatePresence>
          {isConstructorMode && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute -top-8 left-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none z-50 shadow-lg border border-blue-400"
              style={{ fontSize: '10px', fontWeight: '600' }}
            >
              <div className="flex items-center gap-1">
                <span>📦</span>
                <span className="uppercase tracking-wide">{boxName}</span>
                {isDragging && (
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    🔄
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎯 ПОКРАЩЕНІ КООРДИНАТИ в режимі конструктора */}
        <AnimatePresence>
          {isConstructorMode && customPosition && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 left-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs px-2 py-1 rounded-lg pointer-events-none z-50 shadow-lg border border-gray-600"
              style={{ fontSize: '9px', fontWeight: '500' }}
            >
              {/* Абсолютні координати */}
              <div className="flex items-center gap-1">
                <span className="text-blue-300">📍</span>
                <span>{Math.round(customPosition.x)}px, {Math.round(customPosition.y)}px</span>
              </div>
              
              {/* Відносні координати у відсотках */}
              {(() => {
                // Використовуємо збережені відносні координати якщо вони є
                const relativeX = hasRelativeCoords 
                  ? savedPosition.relativeX 
                  : (customPosition.x / window.innerWidth) * 100;
                const relativeY = hasRelativeCoords 
                  ? savedPosition.relativeY 
                  : (customPosition.y / window.innerHeight) * 100;
                
                return (
                  <div className="flex items-center gap-1 text-purple-300 mt-0.5">
                    <span>📐</span>
                    <span>{relativeX.toFixed(1)}%, {relativeY.toFixed(1)}%</span>
                    {hasRelativeCoords && (
                      <span className="text-green-400 ml-1" title="Збережено">💾</span>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Індикатор центру для логотипу */}
        <AnimatePresence>
          {isConstructorMode && boxName === 'logoBox' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full pointer-events-none z-50"
              style={{ 
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 2px white, 0 0 0 4px red'
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Глобальні стилі для режиму конструктора */}
      {isConstructorMode && (
        <style>
          {`
            .constructor-mode {
              transition: all 0.2s ease !important;
            }
            .constructor-mode:hover {
              outline: 2px solid #3b82f6 !important;
              outline-offset: 4px !important;
              box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3) !important;
            }
            body.constructor-active {
              overflow: hidden;
            }
          `}
        </style>
      )}
    </>
  );
};

export default DraggableBox; 