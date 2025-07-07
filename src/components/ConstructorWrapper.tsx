import React, { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainScreenBoxes } from '../config/responsiveConfig';
import BoxResizeControls from './BoxResizeControls';
import useDragAndDrop from '../hooks/useDragAndDrop';

interface ConstructorWrapperProps {
  boxName: keyof MainScreenBoxes;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ConstructorWrapper: React.FC<ConstructorWrapperProps> = ({
  boxName,
  deviceType,
  children,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDoubleClick,
  onContextMenu
}) => {
  const {
    isConstructorMode,
    handleMouseDown,
    handleTouchStart,
    getBoxPosition,
    getBoxSize,
    increaseBoxSize,
    decreaseBoxSize,
    snapLines,
    boxPositions
  } = useDragAndDrop(deviceType);

  const position = getBoxPosition(boxName);
  const size = getBoxSize(boxName);
  
  // Отримуємо збережені відносні координати
  const boxKey = `${boxName}_${deviceType}`;
  const savedPosition = boxPositions[boxKey];
  const hasRelativeCoords = savedPosition?.relativeX !== undefined && savedPosition?.relativeY !== undefined;

  // Слухач для синхронізації позицій з іншими компонентами (аналогічно до фону)
  useEffect(() => {
    const handleBoxPositionsUpdate = (event: CustomEvent) => {
      const { updatedBox, deviceType: eventDeviceType } = event.detail;
      
      // Перерендеримо тільки якщо це наш бокс і наш deviceType
      if (updatedBox === boxName && eventDeviceType === deviceType) {
        console.log(`📡 ConstructorWrapper [${boxName}]: Отримано оновлення позиції`);
        // React автоматично перерендерить через getBoxPosition
      }
    };

    // Слухач для збереження всіх позицій
    const handleAllBoxPositionsSaved = (event: CustomEvent) => {
      const { savedCount, deviceType: eventDeviceType } = event.detail;
      console.log(`📡 ConstructorWrapper [${boxName}]: Збережено ${savedCount} позицій для ${eventDeviceType}`);
    };

    window.addEventListener('boxPositionsUpdated', handleBoxPositionsUpdate as EventListener);
    window.addEventListener('allBoxPositionsSaved', handleAllBoxPositionsSaved as EventListener);
    
    return () => {
      window.removeEventListener('boxPositionsUpdated', handleBoxPositionsUpdate as EventListener);
      window.removeEventListener('allBoxPositionsSaved', handleAllBoxPositionsSaved as EventListener);
    };
  }, [boxName, deviceType]);

  // Логування для діагностики
  if (isConstructorMode && position) {
    console.log(`🎯 ConstructorWrapper [${boxName}]:`, {
      position,
      size,
      deviceType
    });
  }

  // Розраховуємо transform правильно
  const getTransform = () => {
    const transforms = [];
    
    if (size?.scale && size.scale !== 1) {
      transforms.push(`scale(${size.scale})`);
    }
    
    return transforms.length > 0 ? transforms.join(' ') : undefined;
  };

  const constructorStyles: React.CSSProperties = {
    ...style,
    // Застосовуємо кастомну позицію якщо вона є
    ...(position && {
      position: 'absolute',
      left: position.x,
      top: position.y,
      zIndex: isConstructorMode ? 1000 : 'auto' // Піднімаємо z-index в режимі конструктора
    }),
    // Застосовуємо масштаб якщо він є
    ...(size?.scale && {
      transform: getTransform(),
      transformOrigin: 'center'
    }),
    // Застосовуємо кастомні розміри
    ...(size?.width && { width: size.width }),
    ...(size?.height && { height: size.height })
  };

  // Функція для обробки кліків - враховую режим конструктора
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isConstructorMode) {
      // У режимі конструктора ігнорую клік для переміщення
      return;
    }
    if (onClick) {
      onClick(event);
    }
  };

  // Функція для обробки mouseEnter
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseEnter) {
      onMouseEnter(event);
    }
  };

  // Функція для обробки mouseLeave
  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  };

  return (
    <>
      {/* Сітка для конструктора */}
      {isConstructorMode && (
        <>
          {/* Сітка */}
          <div
            className="fixed inset-0 z-10 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
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
          
          {/* Візуальні межі безпечної зони (тільки для великих екранів) */}
          <div 
            className="fixed z-10 pointer-events-none border-2 border-dashed border-yellow-400 opacity-30 hidden lg:block"
            style={{
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px'
            }}
          />
        </>
      )}

      {/* Обгортка боксу */}
      <motion.div
        className={`relative ${className} ${isConstructorMode ? 'cursor-move' : ''}`}
        style={constructorStyles}
        onMouseDown={isConstructorMode ? (e) => handleMouseDown(boxName, e) : undefined}
        onTouchStart={isConstructorMode ? (e) => handleTouchStart(boxName, e) : undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        whileHover={isConstructorMode ? { 
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
          border: '2px dashed rgba(59, 130, 246, 0.8)'
        } : {}}
        transition={{ duration: 0.2 }}
      >
        {/* Контент боксу */}
        {children}

        {/* Кнопки зміни розміру */}
        <BoxResizeControls
          boxName={boxName}
          isVisible={isConstructorMode}
          onIncrease={() => increaseBoxSize(boxName)}
          onDecrease={() => decreaseBoxSize(boxName)}
          position="top-right"
        />

        {/* 🎯 ПОКРАЩЕНИЙ ІНДИКАТОР З КООРДИНАТАМИ в режимі конструктора */}
        <AnimatePresence>
          {isConstructorMode && (
            <>
              {/* Індикатор назви боксу */}
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
                  {size?.scale && size.scale !== 1 && (
                    <span className="text-blue-200 ml-1">({Math.round(size.scale * 100)}%)</span>
                  )}
                </div>
              </motion.div>

              {/* Індикатор координат */}
              {position && (
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
                    <span>{Math.round(position.x)}px, {Math.round(position.y)}px</span>
                  </div>
                  
                  {/* Відносні координати у відсотках */}
                  {(() => {
                    // Використовуємо збережені відносні координати якщо вони є
                    const relativeX = hasRelativeCoords 
                      ? savedPosition.relativeX 
                      : (position.x / window.innerWidth) * 100;
                    const relativeY = hasRelativeCoords 
                      ? savedPosition.relativeY 
                      : (position.y / window.innerHeight) * 100;
                    
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
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default ConstructorWrapper; 