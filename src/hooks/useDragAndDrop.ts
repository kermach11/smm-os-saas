import { useState, useCallback, useRef, useEffect } from 'react';
import { MainScreenBoxes } from '../config/responsiveConfig';

// Импортируем IndexedDB сервис
import { indexedDBService } from '../services/IndexedDBService';

interface Position {
  x: number;
  y: number;
}

// 🎯 НОВИЙ: Інтерфейс для відносних позицій (у відсотках)
interface RelativePosition {
  x: number; // відсоток від ширини екрана (0-100)
  y: number; // відсоток від висоти екрана (0-100)
}

interface BoxPosition extends Position {
  boxName: keyof MainScreenBoxes;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  width?: number;
  height?: number;
  scale?: number;
  // 🎯 НОВИЙ: Додаємо відносну позицію для масштабування
  relativeX?: number; // відсоток від ширини екрана
  relativeY?: number; // відсоток від висоти екрана
}

interface DragState {
  isDragging: boolean;
  draggedBox: keyof MainScreenBoxes | null;
  startPosition: Position;
  currentPosition: Position;
  offset: Position;
}

// 🎯 НОВИЙ інтерфейс для направляючих ліній
interface SnapLines {
  showVerticalCenter: boolean;
  showHorizontalCenter: boolean;
  snapToVerticalCenter: boolean;
  snapToHorizontalCenter: boolean;
  snapThreshold: number;
}

interface UseDragAndDropReturn {
  // Стани
  isConstructorMode: boolean;
  dragState: DragState;
  boxPositions: Record<string, BoxPosition>;
  
  // 🎯 НОВИЙ стан для направляючих ліній
  snapLines: SnapLines;
  
  // Функції управління
  enableConstructorMode: () => void;
  disableConstructorMode: () => void;
  toggleConstructorMode: () => void;
  
  // Drag & Drop функції
  handleMouseDown: (boxName: keyof MainScreenBoxes, event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: () => void;
  
  // 🎯 НОВИЙ: Touch функції для мобільних пристроїв
  handleTouchStart: (boxName: keyof MainScreenBoxes, event: React.TouchEvent) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  
  // Позиції боксів
  getBoxPosition: (boxName: keyof MainScreenBoxes) => Position | null;
  setBoxPosition: (boxName: keyof MainScreenBoxes, position: Position, shouldSave?: boolean) => void;
  resetBoxPosition: (boxName: keyof MainScreenBoxes) => Promise<void>;
  resetAllPositions: () => Promise<void>;
  
  // Розміри боксів
  getBoxSize: (boxName: keyof MainScreenBoxes) => { width?: number; height?: number; scale?: number } | null;
  setBoxSize: (boxName: keyof MainScreenBoxes, size: { width?: number; height?: number; scale?: number }) => void;
  increaseBoxSize: (boxName: keyof MainScreenBoxes, step?: number) => void;
  decreaseBoxSize: (boxName: keyof MainScreenBoxes, step?: number) => void;
  
  // Збереження/завантаження
  savePositions: () => Promise<void>;
  loadPositions: () => Promise<void>;
  saveAllPositions: () => Promise<{ success: boolean; savedCount?: number; error?: any }>;
  
  // 🎯 НОВИЙ: Заводські налаштування
  setCurrentPositionsAsDefault: () => Record<string, RelativePosition>;
  
  // Утиліти
  snapToGrid: boolean;
  gridSize: number;
  setSnapToGrid: (snap: boolean) => void;
  setGridSize: (size: number) => void;
}

export const useDragAndDrop = (deviceType: 'mobile' | 'tablet' | 'desktop'): UseDragAndDropReturn => {
  // Основні стани
  const [isConstructorMode, setIsConstructorMode] = useState<boolean>(() => {
    // 🎯 НОВИЙ: Завжди закриваємо конструктор при перезавантаженні сторінки
    // Це покращує UX - користувач не залишається в режимі конструктора випадково
    return false;
  });
  const [boxPositions, setBoxPositions] = useState<Record<string, BoxPosition>>({});
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(8);
  
  // 🎯 НОВИЙ стан для направляючих ліній
  const [snapLines, setSnapLines] = useState<SnapLines>({
    showVerticalCenter: false,
    showHorizontalCenter: false,
    snapToVerticalCenter: false,
    snapToHorizontalCenter: false,
    snapThreshold: 15 // пікселів для спрацьовування
  });
  
  // Стан перетягування
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedBox: null,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  // Реф для відстеження глобальних подій
  const isDraggingRef = useRef<boolean>(false);

  // 🎯 НОВИЙ: Функції для конвертації між абсолютними і відносними позиціями
  const absoluteToRelative = useCallback((position: Position): RelativePosition => {
    const { innerWidth, innerHeight } = window;
    return {
      x: (position.x / innerWidth) * 100,
      y: (position.y / innerHeight) * 100
    };
  }, []);

  const relativeToAbsolute = useCallback((relativePosition: RelativePosition): Position => {
    const { innerWidth, innerHeight } = window;
    return {
      x: (relativePosition.x / 100) * innerWidth,
      y: (relativePosition.y / 100) * innerHeight
    };
  }, []);

  // 🎯 НОВИЙ: Спеціальна функція для коригування позиції paginationBox
  const adjustPositionForPagination = useCallback((position: Position, boxName: keyof MainScreenBoxes): Position => {
    if (boxName !== 'paginationBox') return position;
    
    // Для paginationBox застосовуємо коригування через flex center
    // Віднімаємо половину ширини контейнера для центрування
    const estimatedWidth = 200; // Приблизна ширина pagination контейнера
    
    return {
      x: position.x - estimatedWidth / 2,
      y: position.y
    };
  }, []);

  // Утилітарна функція для snap to grid
  const snapPositionToGrid = useCallback((position: Position): Position => {
    if (!snapToGrid) return position;
    
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize
    };
  }, [snapToGrid, gridSize]);

  // 🎯 НОВИЙ: Утилітарна функція для обчислення центральних ліній
  const calculateSnapLines = useCallback((boxName: keyof MainScreenBoxes, position: Position, boxSize?: { width?: number; height?: number }) => {
    const windowCenterX = window.innerWidth / 2;
    const windowCenterY = window.innerHeight / 2;
    
    // 📱 Адаптивні розміри боксів для різних пристроїв
    const estimatedBoxSizes = deviceType === 'mobile' ? {
      // Мобільні розміри (менші)
      logoBox: { width: 150, height: 45 },
      soundToggleBox: { width: 45, height: 45 },
      headerTextBox: { width: 280, height: 80 },
      carouselBox: { width: 320, height: 240 },
      paginationBox: { width: 150, height: 40 },
      adminButtonBox: { width: 45, height: 45 },
      adminPanelBox: { width: 300, height: 200 }
    } : deviceType === 'tablet' ? {
      // Планшетні розміри (середні)
      logoBox: { width: 175, height: 52 },
      soundToggleBox: { width: 52, height: 52 },
      headerTextBox: { width: 350, height: 90 },
      carouselBox: { width: 480, height: 320 },
      paginationBox: { width: 175, height: 45 },
      adminButtonBox: { width: 52, height: 52 },
      adminPanelBox: { width: 350, height: 250 }
    } : {
      // Десктопні розміри (стандартні)
      logoBox: { width: 200, height: 60 },
      soundToggleBox: { width: 60, height: 60 },
      headerTextBox: { width: 400, height: 100 },
      carouselBox: { width: 600, height: 400 },
      paginationBox: { width: 200, height: 50 },
      adminButtonBox: { width: 60, height: 60 },
      adminPanelBox: { width: 400, height: 300 }
    };
    
    const boxDimensions = boxSize || estimatedBoxSizes[boxName] || { width: 100, height: 100 };
    
    // Центр боксу
    const boxCenterX = position.x + boxDimensions.width / 2;
    const boxCenterY = position.y + boxDimensions.height / 2;
    
    // Відстань до центральних осей
    const distanceToVerticalCenter = Math.abs(boxCenterX - windowCenterX);
    const distanceToHorizontalCenter = Math.abs(boxCenterY - windowCenterY);
    
    // Перевіряємо, чи потрібно показувати лінії
    const showVerticalCenter = distanceToVerticalCenter <= snapLines.snapThreshold * 3; // показуємо трохи раніше
    const showHorizontalCenter = distanceToHorizontalCenter <= snapLines.snapThreshold * 3;
    
    // Перевіряємо, чи потрібно snap-ити
    const snapToVerticalCenter = distanceToVerticalCenter <= snapLines.snapThreshold;
    const snapToHorizontalCenter = distanceToHorizontalCenter <= snapLines.snapThreshold;
    
    return {
      showVerticalCenter,
      showHorizontalCenter,
      snapToVerticalCenter,
      snapToHorizontalCenter,
      windowCenterX,
      windowCenterY,
      boxCenterX,
      boxCenterY,
      distanceToVerticalCenter,
      distanceToHorizontalCenter
    };
  }, [snapLines.snapThreshold, deviceType]);

  // 🎯 НОВИЙ: Функція для snap до центральних ліній
  const snapToCenter = useCallback((position: Position, boxName: keyof MainScreenBoxes) => {
    const snapInfo = calculateSnapLines(boxName, position);
    
    let snappedPosition = { ...position };
    
    // Snap до вертикального центру (вісь X)
    if (snapInfo.snapToVerticalCenter) {
      const estimatedBoxSizes = deviceType === 'mobile' ? {
        // Мобільні розміри (менші)
        logoBox: { width: 150, height: 45 },
        soundToggleBox: { width: 45, height: 45 },
        headerTextBox: { width: 280, height: 80 },
        carouselBox: { width: 320, height: 240 },
        paginationBox: { width: 150, height: 40 },
        adminButtonBox: { width: 45, height: 45 },
        adminPanelBox: { width: 300, height: 200 }
      } : deviceType === 'tablet' ? {
        // Планшетні розміри (середні)
        logoBox: { width: 175, height: 52 },
        soundToggleBox: { width: 52, height: 52 },
        headerTextBox: { width: 350, height: 90 },
        carouselBox: { width: 480, height: 320 },
        paginationBox: { width: 175, height: 45 },
        adminButtonBox: { width: 52, height: 52 },
        adminPanelBox: { width: 350, height: 250 }
      } : {
        // Десктопні розміри (стандартні)
        logoBox: { width: 200, height: 60 },
        soundToggleBox: { width: 60, height: 60 },
        headerTextBox: { width: 400, height: 100 },
        carouselBox: { width: 600, height: 400 },
        paginationBox: { width: 200, height: 50 },
        adminButtonBox: { width: 60, height: 60 },
        adminPanelBox: { width: 400, height: 300 }
      };
      
      const boxWidth = estimatedBoxSizes[boxName]?.width || 100;
      snappedPosition.x = snapInfo.windowCenterX - boxWidth / 2;
    }
    
    // Snap до горизонтального центру (вісь Y)
    if (snapInfo.snapToHorizontalCenter) {
      const estimatedBoxSizes = deviceType === 'mobile' ? {
        // Мобільні розміри (менші)
        logoBox: { width: 150, height: 45 },
        soundToggleBox: { width: 45, height: 45 },
        headerTextBox: { width: 280, height: 80 },
        carouselBox: { width: 320, height: 240 },
        paginationBox: { width: 150, height: 40 },
        adminButtonBox: { width: 45, height: 45 },
        adminPanelBox: { width: 300, height: 200 }
      } : deviceType === 'tablet' ? {
        // Планшетні розміри (середні)
        logoBox: { width: 175, height: 52 },
        soundToggleBox: { width: 52, height: 52 },
        headerTextBox: { width: 350, height: 90 },
        carouselBox: { width: 480, height: 320 },
        paginationBox: { width: 175, height: 45 },
        adminButtonBox: { width: 52, height: 52 },
        adminPanelBox: { width: 350, height: 250 }
      } : {
        // Десктопні розміри (стандартні)
        logoBox: { width: 200, height: 60 },
        soundToggleBox: { width: 60, height: 60 },
        headerTextBox: { width: 400, height: 100 },
        carouselBox: { width: 600, height: 400 },
        paginationBox: { width: 200, height: 50 },
        adminButtonBox: { width: 60, height: 60 },
        adminPanelBox: { width: 400, height: 300 }
      };
      
      const boxHeight = estimatedBoxSizes[boxName]?.height || 100;
      snappedPosition.y = snapInfo.windowCenterY - boxHeight / 2;
    }
    
    // Оновлюємо стан направляючих ліній
    setSnapLines(prev => ({
      ...prev,
      showVerticalCenter: snapInfo.showVerticalCenter,
      showHorizontalCenter: snapInfo.showHorizontalCenter,
      snapToVerticalCenter: snapInfo.snapToVerticalCenter,
      snapToHorizontalCenter: snapInfo.snapToHorizontalCenter
    }));
    
    return snappedPosition;
  }, [calculateSnapLines, deviceType]);

  // Функції управління конструктором
  const enableConstructorMode = useCallback(() => {
    setIsConstructorMode(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'crosshair';
    
    // Відправляємо подію для синхронізації між компонентами
    window.dispatchEvent(new CustomEvent('constructorModeChanged', { 
      detail: { isConstructorMode: true } 
    }));
    

  }, []);

  const disableConstructorMode = useCallback(() => {
    setIsConstructorMode(false);
    setDragState(prev => ({ ...prev, isDragging: false, draggedBox: null }));
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    
    // Відправляємо подію для синхронізації між компонентами
    window.dispatchEvent(new CustomEvent('constructorModeChanged', { 
      detail: { isConstructorMode: false } 
    }));
    

  }, []);

  const toggleConstructorMode = useCallback(() => {
    if (isConstructorMode) {
      disableConstructorMode();
    } else {
      enableConstructorMode();
    }
  }, [isConstructorMode, enableConstructorMode, disableConstructorMode]);



  // Drag & Drop обробники (існуючі mouse обробники)
  const handleMouseDown = useCallback((boxName: keyof MainScreenBoxes, event: React.MouseEvent) => {
    if (!isConstructorMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    // Offset - це зміщення курсора від лівого верхнього кута елемента
    const offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    // Поточна позиція елемента на екрані
    const currentPosition = { x: rect.left, y: rect.top };
    
    setDragState({
      isDragging: true,
      draggedBox: boxName,
      startPosition: { x: event.clientX, y: event.clientY },
      currentPosition,
      offset
    });
    
    isDraggingRef.current = true;
    document.body.style.cursor = 'grabbing';
    

  }, [isConstructorMode]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDraggingRef.current || !dragState.isDragging || !dragState.draggedBox) return;
    
    // Розраховуємо нову позицію: поточна позиція миші мінус offset
    const newPosition = {
      x: event.clientX - dragState.offset.x,
      y: event.clientY - dragState.offset.y
    };
    
    // 🎯 СПРОЩЕНІ обмеження для мобільних, АДАПТИВНІ для більших екранів
    const getBoxConstraints = (boxName: string) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth <= 768;
      
      if (isMobile) {
        // 📱 МОБІЛЬНІ: Максимальна свобода - мінімальні обмеження  
        const margin = 0; // Без відступів від краю
        return {
          minX: margin,
          maxX: screenWidth - 10 - margin, // Резервуємо тільки 10px для елемента
          minY: margin,
          maxY: screenHeight - 10 - margin // Резервуємо тільки 10px для елемента
        };
      } else {
        // 💻 ДЕСКТОП/ПЛАНШЕТ: Детальні обмеження з урахуванням розмірів боксів
        const margin = 20;
        const isTablet = screenWidth <= 1024;
        
        const getAdaptiveBoxSize = (boxName: string) => {
          const sizes = {
            adminButtonBox: { width: 60, height: 60 },
            logoBox: { width: isTablet ? 250 : 200, height: isTablet ? 80 : 100 },
            soundToggleBox: { width: 60, height: 60 },
            headerTextBox: { width: isTablet ? 450 : 400, height: isTablet ? 150 : 200 },
            carouselBox: { width: isTablet ? 500 : 600, height: isTablet ? 350 : 400 },
            paginationBox: { width: isTablet ? 280 : 300, height: 50 }
          };
          return sizes[boxName] || { width: 100, height: 100 };
        };
        
        const boxSize = getAdaptiveBoxSize(boxName);
        const maxX = Math.max(margin, screenWidth - boxSize.width - margin);
        const maxY = Math.max(margin, screenHeight - boxSize.height - margin);
        
        return {
          minX: margin,
          maxX: maxX,
          minY: margin,
          maxY: maxY
        };
      }
    };
    
    const constraints = getBoxConstraints(dragState.draggedBox);
    
    // Застосовуємо обмеження
    const boundedPosition = {
      x: Math.max(constraints.minX, Math.min(constraints.maxX, newPosition.x)),
      y: Math.max(constraints.minY, Math.min(constraints.maxY, newPosition.y))
    };
    
    const gridSnappedPosition = snapPositionToGrid(boundedPosition);
    
    // 🎯 НОВИЙ: Застосовуємо snap до центральних ліній
    const centerSnappedPosition = snapToCenter(gridSnappedPosition, dragState.draggedBox);
    
    setDragState(prev => ({
      ...prev,
      currentPosition: centerSnappedPosition
    }));
    
    // Використовуємо setBoxPosition для обновлення позиції
    // Не зберігаємо під час перетягування (shouldSave = false)
    setBoxPosition(dragState.draggedBox, centerSnappedPosition, false);
    

      }, [dragState, deviceType, snapPositionToGrid, snapToCenter]);

  const handleMouseUp = useCallback(async () => {
    if (!isDraggingRef.current || !dragState.isDragging) return;
    

    
    // Фінальне збереження позиції після завершення перетягування
    if (dragState.draggedBox && dragState.currentPosition) {
      setBoxPosition(dragState.draggedBox, dragState.currentPosition, true);

      
      // Негайно зберігаємо в IndexedDB після завершення перетягування
      try {
        const key = `${dragState.draggedBox}_${deviceType}`;
        const updatedPositions = {
          ...boxPositions,
          [key]: {
            boxName: dragState.draggedBox,
            deviceType,
            ...dragState.currentPosition
          }
        };
        
        await indexedDBService.saveSettings('boxPositions', updatedPositions, 'constructor');

      } catch (error) {
        console.error('❌ Помилка негайного збереження позиції:', error);
      }
    }
    
    setDragState({
      isDragging: false,
      draggedBox: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
    
    isDraggingRef.current = false;
    document.body.style.cursor = isConstructorMode ? 'crosshair' : '';
    
    // 🎯 НОВИЙ: Скидаємо направляючі лінії після завершення перетягування
    setSnapLines(prev => ({
      ...prev,
      showVerticalCenter: false,
      showHorizontalCenter: false,
      snapToVerticalCenter: false,
      snapToHorizontalCenter: false
    }));
  }, [dragState, isConstructorMode, deviceType, boxPositions]);



  // Глобальні обробники подій
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        handleMouseMove(event as any);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current) {
        handleMouseUp();
      }
    };

    if (isConstructorMode) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isConstructorMode, handleMouseMove, handleMouseUp]);

  // 🎯 ОНОВЛЕНО: Стандартні позиції для боксів у відносних координатах (адаптивні для різних пристроїв)
  const getDefaultRelativePosition = useCallback((boxName: keyof MainScreenBoxes): RelativePosition => {
    // 📱 МОБІЛЬНІ НАЛАШТУВАННЯ (вертикальна орієнтація, менший екран)
    if (deviceType === 'mobile') {
      switch (boxName) {
        case 'logoBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр по горизонталі)
            y: 5.0   // 5% від висоти екрана (вгорі з більшим відступом)
          };
        case 'soundToggleBox':
          return {
            x: 85.0, // 85% від ширини екрана (праворуч, але не впритул)
            y: 5.0   // 5% від висоти екрана (вгорі поруч з логотипом)
          };
        case 'headerTextBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр по горизонталі)
            y: 12.0  // 12% від висоти екрана (під логотипом)
          };
        case 'carouselBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр по горизонталі)
            y: 35.0  // 35% від висоти екрана (центральна область)
          };
        case 'paginationBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр по горизонталі)
            y: 75.0  // 75% від висоти екрана (під каруселлю)
          };
        case 'adminButtonBox':
          return {
            x: 15.0, // 15% від ширини екрана (ліворуч внизу)
            y: 85.0  // 85% від висоти екрана (внизу)
          };
        case 'adminPanelBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр)
            y: 50.0  // 50% від висоти екрана (центр)
          };
        default:
          return {
            x: 50.0, // 50% від ширини екрана (центр)
            y: 50.0  // 50% від висоти екрана (центр)
          };
      }
    }
    
    // 📟 ПЛАНШЕТНІ НАЛАШТУВАННЯ (середній екран, гібридна орієнтація)
    if (deviceType === 'tablet') {
      switch (boxName) {
        case 'logoBox':
          return {
            x: 50.0, // 50% від ширини екрана (центр по горизонталі)
            y: 3.5   // 3.5% від висоти екрана (вгорі з помірним відступом)
          };
        case 'soundToggleBox':
          return {
            x: 90.0, // 90% від ширини екрана (праворуч з помірним відступом)
            y: 3.5   // 3.5% від висоти екрана (вгорі поруч з логотипом)
          };
        case 'headerTextBox':
          return {
            x: 25.0, // 25% від ширини екрана (ліворуч від центру)
            y: 9.0   // 9% від висоти екрана (під логотипом)
          };
        case 'carouselBox':
          return {
            x: 25.0, // 25% від ширини екрана (ліворуч від центру, як header)
            y: 30.0  // 30% від висоти екрана (центральна область)
          };
        case 'paginationBox':
          return {
            x: 50.5, // 50.5% від ширини екрана (центр по горизонталі)
            y: 85.0  // 85% від висоти екрана (внизу під каруселлю)
          };
        case 'adminButtonBox':
          return {
            x: 85.0, // 85% від ширини екрана (праворуч внизу)
            y: 80.0  // 80% від висоти екрана (внизу)
          };
        case 'adminPanelBox':
          return {
            x: 35.0, // 35% від ширини екрана (трохи ліворуч від центру)
            y: 35.0  // 35% від висоти екрана (трохи вище центру)
          };
        default:
          return {
            x: 35.0, // 35% від ширини екрана
            y: 35.0  // 35% від висоти екрана
          };
      }
    }
    
    // 💻 ДЕСКТОПНІ НАЛАШТУВАННЯ (горизонтальна орієнтація, більший екран)
    switch (boxName) {
      case 'logoBox':
        return {
          x: 50.0, // 50.0% від ширини екрана (центр по горизонталі)
          y: 2.5   // 2.5% від висоти екрана (вгорі з невеликим відступом)
        };
      case 'soundToggleBox':
        return {
          x: 95.8, // 95.8% від ширини екрана (праворуч з невеликим відступом)
          y: 2.5   // 2.5% від висоти екрана (вгорі з невеликим відступом)
        };
      case 'headerTextBox':
        return {
          x: 10.0, // 10.0% від ширини екрана (ліворуч з відступом)
          y: 6.7   // 6.7% від висоти екрана (під логотипом)
        };
      case 'carouselBox':
        return {
          x: 10.0, // 10.0% від ширини екрана (ліворуч з відступом, як header)
          y: 26.8  // 26.8% від висоти екрана (центральна область)
        };
      case 'paginationBox':
        return {
          x: 51.0, // 51.0% від ширини екрана (центр по горизонталі)
          y: 92.0  // 92.0% від висоти екрана (внизу під каруселлю)
        };
      case 'adminButtonBox':
        return {
          x: 95.0, // 95.0% від ширини екрана (праворуч з відступом)
          y: 88.6  // 88.6% від висоти екрана (внизу)
        };
      case 'adminPanelBox':
        return {
          x: 25.0, // 25% від ширини екрана (ліворуч від центру)
          y: 25.0  // 25% від висоти екрана (вгорі від центру)
        };
      default:
        return {
          x: 10.0, // 10% від ширини екрана
          y: 10.0  // 10% від висоти екрана
        };
    }
  }, [deviceType]);

  // Стандартні позиції для боксів (конвертовані з відносних)
  const getDefaultBoxPosition = useCallback((boxName: keyof MainScreenBoxes): Position => {
    const relativePos = getDefaultRelativePosition(boxName);
    return relativeToAbsolute(relativePos);
  }, [getDefaultRelativePosition, relativeToAbsolute]);

  // 🎯 ОНОВЛЕНО: Функції роботи з позиціями з підтримкою відносних координат
  const getBoxPosition = useCallback((boxName: keyof MainScreenBoxes): Position | null => {
    const key = `${boxName}_${deviceType}`;
    const position = boxPositions[key];
    

    
    // Якщо позиція не знайдена, повертаємо стандартну
    if (!position) {
      const defaultPos = getDefaultBoxPosition(boxName);
      // 🎯 НОВИЙ: Застосовуємо коригування для paginationBox
      const adjustedDefaultPos = adjustPositionForPagination(defaultPos, boxName);

      return adjustedDefaultPos;
    }
    
    // 🎯 НОВИЙ: Якщо є відносні координати, використовуємо їх (масштабуються автоматично)
    if (position.relativeX !== undefined && position.relativeY !== undefined) {
      const relativePos: RelativePosition = {
        x: position.relativeX,
        y: position.relativeY
      };
      const absolutePos = relativeToAbsolute(relativePos);
      // 🎯 НОВИЙ: Застосовуємо коригування для paginationBox
      const adjustedPos = adjustPositionForPagination(absolutePos, boxName);

      return adjustedPos;
    }
    
    // Використовуємо абсолютну позицію (застаріла логіка для сумісності)
    const result = { x: position.x, y: position.y };
    return result;
  }, [boxPositions, deviceType, getDefaultBoxPosition, relativeToAbsolute, adjustPositionForPagination]);

  // 🎯 ОНОВЛЕНО: setBoxPosition тепер зберігає і абсолютні, і відносні координати
  const setBoxPosition = useCallback((boxName: keyof MainScreenBoxes, position: Position, shouldSave: boolean = true) => {
    const key = `${boxName}_${deviceType}`;
    
    // 🎯 НОВИЙ: Для paginationBox застосовуємо зворотне коригування при збереженні
    const adjustedPosition = boxName === 'paginationBox' ? {
      x: position.x + 100, // Додаємо половину ширини назад
      y: position.y
    } : position;
    
    // 🎯 НОВИЙ: Конвертуємо абсолютну позицію у відносну для масштабування
    const relativePosition = absoluteToRelative(adjustedPosition);
    
    setBoxPositions(prev => {
      const newPositions = {
        ...prev,
        [key]: {
          boxName,
          deviceType,
          // Зберігаємо абсолютну позицію для сумісності (з коригуванням)
          x: adjustedPosition.x,
          y: adjustedPosition.y,
          // 🎯 НОВИЙ: Зберігаємо відносну позицію для автоматичного масштабування
          relativeX: relativePosition.x,
          relativeY: relativePosition.y,
          // Зберігаємо інші властивості якщо вони є
          ...(prev[key] && {
            width: prev[key].width,
            height: prev[key].height,
            scale: prev[key].scale
          })
        }
      };
      

      
      // Відправляємо подію для синхронізації (аналогічно до фону)
      if (shouldSave) {
        try {
          const syncEvent = new CustomEvent('boxPositionsUpdated', { 
            detail: { 
              boxPositions: newPositions, 
              deviceType,
              updatedBox: boxName,
              newPosition: position,
              newRelativePosition: relativePosition
            } 
          });
          window.dispatchEvent(syncEvent);

        } catch (error) {
          console.error('❌ Помилка відправки події:', error);
        }
      }
      
      return newPositions;
    });
  }, [deviceType, absoluteToRelative]);

  const resetBoxPosition = useCallback(async (boxName: keyof MainScreenBoxes) => {
    const key = `${boxName}_${deviceType}`;
    setBoxPositions(prev => {
      const newPositions = { ...prev };
      delete newPositions[key];
      return newPositions;
    });
    
    // Негайно зберігаємо зміни в IndexedDB
    try {
      const updatedPositions = { ...boxPositions };
      delete updatedPositions[key];
      
      await indexedDBService.saveSettings('boxPositions', updatedPositions, 'constructor');
      console.log('💾 Скинуто позицію боксу та збережено в IndexedDB:', boxName);
    } catch (error) {
      console.error('❌ Помилка збереження після скидання позиції:', error);
    }
  }, [deviceType, boxPositions]);

  const resetAllPositions = useCallback(async () => {
    // Скидаємо тільки позиції для поточного пристрою, а не всі
    const updatedPositions = { ...boxPositions };
    
    // Видаляємо всі позиції для поточного deviceType
    Object.keys(updatedPositions).forEach(key => {
      if (key.endsWith(`_${deviceType}`)) {
        delete updatedPositions[key];
      }
    });
    
    setBoxPositions(updatedPositions);
    console.log(`🎯 Скинуто всі позиції боксів для ${deviceType}`);
    
    // Негайно зберігаємо зміни в IndexedDB
    try {
      await indexedDBService.saveSettings('boxPositions', updatedPositions, 'constructor');
      console.log(`💾 Скинуто позиції для ${deviceType} та збережено в IndexedDB`);
    } catch (error) {
      console.error('❌ Помилка збереження після скидання позицій:', error);
    }
  }, [boxPositions, deviceType]);

  // Функції роботи з розмірами
  const getBoxSize = useCallback((boxName: keyof MainScreenBoxes): { width?: number; height?: number; scale?: number } | null => {
    const key = `${boxName}_${deviceType}`;
    const position = boxPositions[key];
    return position ? { width: position.width, height: position.height, scale: position.scale } : null;
  }, [boxPositions, deviceType]);

  const setBoxSize = useCallback((boxName: keyof MainScreenBoxes, size: { width?: number; height?: number; scale?: number }) => {
    const key = `${boxName}_${deviceType}`;
    setBoxPositions(prev => {
      const newPositions = {
        ...prev,
        [key]: {
          ...prev[key],
          boxName,
          deviceType,
          x: prev[key]?.x || 0,
          y: prev[key]?.y || 0,
          ...size
        }
      };
      
      return newPositions;
    });
  }, [deviceType]);

  const increaseBoxSize = useCallback((boxName: keyof MainScreenBoxes, step?: number) => {
    const currentSize = getBoxSize(boxName);
    const newScale = Math.min(3, (currentSize?.scale || 1) + (step || 0.1));
    setBoxSize(boxName, { 
      ...currentSize, 
      scale: newScale
    });
    console.log(`🎯 Збільшено розмір ${boxName}: ${newScale}`);
  }, [getBoxSize, setBoxSize]);

  const decreaseBoxSize = useCallback((boxName: keyof MainScreenBoxes, step?: number) => {
    const currentSize = getBoxSize(boxName);
    const newScale = Math.max(0.2, (currentSize?.scale || 1) - (step || 0.1));
    setBoxSize(boxName, { 
      ...currentSize, 
      scale: newScale
    });
    console.log(`🎯 Зменшено розмір ${boxName}: ${newScale}`);
  }, [getBoxSize, setBoxSize]);

  // Збереження/завантаження
  const savePositions = useCallback(async () => {
    try {
      console.log('🔄 СОХРАНЕНИЕ ПОЗИЦИЙ - начало');
      
      // Используем IndexedDB точно так же, как для фона
      await indexedDBService.saveSettings('boxPositions', boxPositions, 'constructor');
      
      console.log('✅ СОХРАНЕНИЕ ПОЗИЦИЙ - успешно:', boxPositions);
    } catch (error) {
      console.error('❌ СОХРАНЕНИЕ ПОЗИЦИЙ - ошибка:', error);
    }
  }, [boxPositions]);

  const saveAllPositions = useCallback(async () => {
    try {
      console.log('🔄 СОХРАНЕНИЕ ВСЕХ ПОЗИЦИЙ - начало');
      
      // Збираємо всі поточні позиції боксів
      const currentPositions = { ...boxPositions };
      
      // Додаємо поточні позиції з DOM, якщо вони не збережені
      const boxNames: (keyof MainScreenBoxes)[] = [
        'logoBox', 'soundToggleBox', 'headerTextBox', 
        'carouselBox', 'paginationBox', 'adminButtonBox'
      ];
      
      let updatedCount = 0;
      boxNames.forEach(boxName => {
        const key = `${boxName}_${deviceType}`;
        if (currentPositions[key]) {
          updatedCount++;
        }
      });
      
      // Используем IndexedDB точно так же, как для фона
      await indexedDBService.saveSettings('boxPositions', currentPositions, 'constructor');
      
      console.log('💾 ===== СОХРАНЕНИЕ ВСЕХ ПОЗИЦИЙ - УСПЕШНО =====');
      console.log(`✅ Сохранено ${updatedCount} позиций для ${deviceType}:`);
      
      Object.entries(currentPositions).forEach(([key, position]) => {
        if (key.includes(`_${deviceType}`)) {
          console.log(`📍 ${key}: x=${position.x}, y=${position.y}`);
        }
      });
      
      console.log('🎯 Все позиции успешно сохранены в IndexedDB!');
      
      // Відправляємо подію для синхронізації
      const syncEvent = new CustomEvent('allBoxPositionsSaved', { 
        detail: { 
          boxPositions: currentPositions, 
          deviceType,
          timestamp: Date.now(),
          savedCount: updatedCount
        } 
      });
      window.dispatchEvent(syncEvent);
      
      return { success: true, savedCount: updatedCount };
    } catch (error) {
      console.error('❌ СОХРАНЕНИЕ ВСЕХ ПОЗИЦИЙ - ошибка:', error);
      return { success: false, error };
    }
  }, [boxPositions, deviceType]);

  const loadPositions = useCallback(async () => {
    try {
      // Завантаження позицій боксів
      
      // Используем IndexedDB точно так же, как для фона
      const positions = await indexedDBService.loadSettings('boxPositions');
      
      // Дані з IndexedDB завантажено
      console.log('🔍 Текущий deviceType:', deviceType);
      
      if (positions) {
        // Фільтруємо позиції для поточного deviceType
        const devicePositions = Object.entries(positions).filter(([key]) => 
          key.includes(`_${deviceType}`)
        );
        console.log('🔍 Позиции для текущего deviceType:', devicePositions);
        
        // 🎯 НОВИЙ: Адаптація позицій між пристроями
        if (devicePositions.length === 0) {
          console.log('🔄 Позиції для поточного пристрою не знайдено, спробуємо адаптувати з інших пристроїв');
          
          // Шукаємо позиції для інших пристроїв
          const allDeviceTypes = ['desktop', 'tablet', 'mobile'];
          const sourceDeviceType = allDeviceTypes.find(type => 
            type !== deviceType && 
            Object.keys(positions).some(key => key.includes(`_${type}`))
          );
          
          if (sourceDeviceType) {
            console.log(`🔄 Знайдено позиції для ${sourceDeviceType}, адаптуємо для ${deviceType}`);
            
            const adaptedPositions = { ...positions };
            
            // Адаптуємо кожну позицію з sourceDeviceType для поточного deviceType
            Object.entries(positions).forEach(([key, position]) => {
              if (key.includes(`_${sourceDeviceType}`)) {
                const boxName = key.replace(`_${sourceDeviceType}`, '') as keyof MainScreenBoxes;
                const newKey = `${boxName}_${deviceType}`;
                
                // Використовуємо відносні координати для адаптації
                let adaptedPosition;
                if (position.relativeX !== undefined && position.relativeY !== undefined) {
                  // Якщо є відносні координати, просто переносимо їх
                  adaptedPosition = {
                    ...position,
                    deviceType: deviceType as 'mobile' | 'tablet' | 'desktop',
                    boxName: boxName
                  };
                } else {
                  // Якщо немає відносних координат, конвертуємо абсолютні в відносні
                  const absolutePos = { x: position.x, y: position.y };
                  const relativePos = absoluteToRelative(absolutePos);
                  adaptedPosition = {
                    ...position,
                    deviceType: deviceType as 'mobile' | 'tablet' | 'desktop',
                    boxName: boxName,
                    relativeX: relativePos.x,
                    relativeY: relativePos.y
                  };
                }
                
                adaptedPositions[newKey] = adaptedPosition;
                console.log(`🔄 Адаптовано позицію ${boxName}: ${sourceDeviceType} -> ${deviceType}`, {
                  original: position,
                  adapted: adaptedPosition
                });
              }
            });
            
            // Зберігаємо адаптовані позиції
            await indexedDBService.saveSettings('boxPositions', adaptedPositions, 'constructor');
            setBoxPositions(adaptedPositions);
            console.log('✅ Адаптовані позиції збережено та завантажено');
            return;
          }
        }
        
        setBoxPositions(positions);
        // Позиції успішно завантажено
      } else {
        // Дані не знайдено в IndexedDB
      }
    } catch (error) {
      console.error('❌ ЗАГРУЗКА ПОЗИЦИЙ - ошибка:', error);
    }
  }, [deviceType, absoluteToRelative]);

  // �� НОВИЙ: Функція для міграції старих абсолютних позицій до відносних
  const migrateAbsoluteToRelativePositions = useCallback(async () => {

    
    const updatedPositions = { ...boxPositions };
    let hasUpdates = false;
    
    Object.entries(boxPositions).forEach(([key, position]) => {
      // Якщо позиція не має відносних координат, додаємо їх
      if (position.relativeX === undefined || position.relativeY === undefined) {
        const absolutePos: Position = { x: position.x, y: position.y };
        const relativePos = absoluteToRelative(absolutePos);
        
        updatedPositions[key] = {
          ...position,
          relativeX: relativePos.x,
          relativeY: relativePos.y
        };
        
        hasUpdates = true;

      }
    });
    
    if (hasUpdates) {
      setBoxPositions(updatedPositions);
      
      // Зберігаємо оновлені позиції
      try {
        await indexedDBService.saveSettings('boxPositions', updatedPositions, 'constructor');
        console.log('💾 Міграція завершена, позиції збережено');
      } catch (error) {
        console.error('❌ Помилка збереження після міграції:', error);
      }
    }
  }, [boxPositions, absoluteToRelative]);

  // Завантажуємо позиції при ініціалізації
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  // 🎯 НОВИЙ: Виконуємо міграцію після завантаження позицій
  useEffect(() => {
    if (Object.keys(boxPositions).length > 0) {
      migrateAbsoluteToRelativePositions();
    }
  }, [boxPositions, migrateAbsoluteToRelativePositions]);

  // 🔥 НОВИЙ useEffect для автоматичного збереження позицій при їх зміні
  useEffect(() => {
    // Перевіряємо, чи є позиції для збереження
    const hasPositions = Object.keys(boxPositions).length > 0;
    
    if (hasPositions) {
      // Додаємо невелику затримку для уникнення частих збережень під час перетягування
      const saveTimeout = setTimeout(async () => {
        try {
          await indexedDBService.saveSettings('boxPositions', boxPositions, 'constructor');
          console.log('💾 Автоматичне збереження позицій боксів:', boxPositions);
        } catch (error) {
          console.error('❌ Помилка автоматичного збереження позицій:', error);
        }
      }, 500); // Затримка 500мс
      
      return () => clearTimeout(saveTimeout);
    }
  }, [boxPositions]); // Спостерігаємо за змінами boxPositions

  // 🎯 НОВИЙ: Обробник зміни розміру вікна для автоматичного перерахунку позицій
  useEffect(() => {
    const handleWindowResize = () => {

      
      // Примусово перерендерюємо компоненти, щоб позиції оновилися
      // Це спрацьовує тому, що getBoxPosition тепер використовує відносні координати
      setBoxPositions(prev => ({ ...prev }));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Синхронізація стану конструктора між компонентами
  useEffect(() => {
    const handleConstructorModeChange = (event: CustomEvent) => {
      const { isConstructorMode: newMode } = event.detail;
      console.log('🎯 Отримано подію зміни режиму конструктора:', newMode);
      setIsConstructorMode(newMode);
      
      if (newMode) {
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'crosshair';
      } else {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        setDragState(prev => ({ ...prev, isDragging: false, draggedBox: null }));
      }
    };

    window.addEventListener('constructorModeChanged', handleConstructorModeChange as EventListener);
    return () => {
      window.removeEventListener('constructorModeChanged', handleConstructorModeChange as EventListener);
    };
  }, []);

  // 🎯 НОВИЙ: Touch обробники для мобільних пристроїв
  const handleTouchStart = useCallback((boxName: keyof MainScreenBoxes, event: React.TouchEvent) => {
    if (!isConstructorMode) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const touch = event.touches[0];
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    
    // Offset - це зміщення пальця від лівого верхнього кута елемента
    const offset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    // Поточна позиція елемента на екрані
    const currentPosition = { x: rect.left, y: rect.top };
    
    setDragState({
      isDragging: true,
      draggedBox: boxName,
      startPosition: { x: touch.clientX, y: touch.clientY },
      currentPosition,
      offset
    });
    
    isDraggingRef.current = true;
    
    console.log(`📱 Почато touch перетягування: ${boxName}`, { 
      offset, 
      currentPosition, 
      touchPosition: { x: touch.clientX, y: touch.clientY },
      elementRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
    });
  }, [isConstructorMode]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    if (!isDraggingRef.current || !dragState.isDragging || !dragState.draggedBox) return;
    
    event.preventDefault(); // Важливо для мобільних пристроїв
    
    const touch = event.touches[0];
    
    // Розраховуємо нову позицію: поточна позиція пальця мінус offset
    const newPosition = {
      x: touch.clientX - dragState.offset.x,
      y: touch.clientY - dragState.offset.y
    };
    
    // 🎯 СПРОЩЕНІ обмеження для мобільних Touch (той же код що і для миші)
    const getBoxConstraints = (boxName: string) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const isMobile = screenWidth <= 768;
      
      if (isMobile) {
        // 📱 МОБІЛЬНІ: Максимальна свобода - мінімальні обмеження  
        const margin = 0; // Без відступів від краю
        return {
          minX: margin,
          maxX: screenWidth - 10 - margin, // Резервуємо тільки 10px для елемента
          minY: margin,
          maxY: screenHeight - 10 - margin // Резервуємо тільки 10px для елемента
        };
      } else {
        // 💻 ДЕСКТОП/ПЛАНШЕТ: Детальні обмеження з урахуванням розмірів боксів
        const margin = 20;
        const isTablet = screenWidth <= 1024;
        
        const getAdaptiveBoxSize = (boxName: string) => {
          const sizes = {
            adminButtonBox: { width: 60, height: 60 },
            logoBox: { width: isTablet ? 250 : 200, height: isTablet ? 80 : 100 },
            soundToggleBox: { width: 60, height: 60 },
            headerTextBox: { width: isTablet ? 450 : 400, height: isTablet ? 150 : 200 },
            carouselBox: { width: isTablet ? 500 : 600, height: isTablet ? 350 : 400 },
            paginationBox: { width: isTablet ? 280 : 300, height: 50 }
          };
          return sizes[boxName] || { width: 100, height: 100 };
        };
        
        const boxSize = getAdaptiveBoxSize(boxName);
        const maxX = Math.max(margin, screenWidth - boxSize.width - margin);
        const maxY = Math.max(margin, screenHeight - boxSize.height - margin);
        
        return {
          minX: margin,
          maxX: maxX,
          minY: margin,
          maxY: maxY
        };
      }
    };
    
    const constraints = getBoxConstraints(dragState.draggedBox);
    
    // Застосовуємо обмеження
    const boundedPosition = {
      x: Math.max(constraints.minX, Math.min(constraints.maxX, newPosition.x)),
      y: Math.max(constraints.minY, Math.min(constraints.maxY, newPosition.y))
    };
    
    const gridSnappedPosition = snapPositionToGrid(boundedPosition);
    
    // Застосовуємо snap до центральних ліній
    const centerSnappedPosition = snapToCenter(gridSnappedPosition, dragState.draggedBox);
    
    setDragState(prev => ({
      ...prev,
      currentPosition: centerSnappedPosition
    }));
    
    // Не зберігаємо під час перетягування
    setBoxPosition(dragState.draggedBox, centerSnappedPosition, false);
    
    console.log(`📱 Touch переміщення: ${dragState.draggedBox}`, {
      constraints,
      touchPosition: { x: touch.clientX, y: touch.clientY },
      offset: dragState.offset,
      newPosition,
      boundedPosition,
      gridSnappedPosition,
      centerSnappedPosition
    });
  }, [dragState, snapPositionToGrid, snapToCenter, setBoxPosition]);

  const handleTouchEnd = useCallback(async () => {
    if (!isDraggingRef.current || !dragState.isDragging) return;
    
    console.log(`📱 Завершено touch перетягування: ${dragState.draggedBox}`, {
      finalPosition: dragState.currentPosition
    });
    
    // Фінальне збереження позиції після завершення перетягування
    if (dragState.draggedBox && dragState.currentPosition) {
      setBoxPosition(dragState.draggedBox, dragState.currentPosition, true);
      console.log('💾 Touch: Фінальна позиція збережена:', dragState.draggedBox, dragState.currentPosition);
      
      // Негайно зберігаємо в IndexedDB після завершення перетягування
      try {
        const key = `${dragState.draggedBox}_${deviceType}`;
        const updatedPositions = {
          ...boxPositions,
          [key]: {
            boxName: dragState.draggedBox,
            deviceType,
            ...dragState.currentPosition
          }
        };
        
        await indexedDBService.saveSettings('boxPositions', updatedPositions, 'constructor');
        console.log('💾 Touch: Негайне збереження позиції в IndexedDB:', dragState.draggedBox, dragState.currentPosition);
      } catch (error) {
        console.error('❌ Touch: Помилка негайного збереження позиції:', error);
      }
    }
    
    setDragState({
      isDragging: false,
      draggedBox: null,
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
    
    isDraggingRef.current = false;
    
    // Скидаємо направляючі лінії після завершення перетягування
    setSnapLines(prev => ({
      ...prev,
      showVerticalCenter: false,
      showHorizontalCenter: false,
      snapToVerticalCenter: false,
      snapToHorizontalCenter: false
    }));
  }, [dragState, deviceType, boxPositions, setBoxPosition, setSnapLines]);

  // 🎯 НОВИЙ: Глобальні touch обробники подій
  useEffect(() => {
    const handleGlobalTouchMove = (event: TouchEvent) => {
      if (isDraggingRef.current) {
        handleTouchMove(event as any);
      }
    };

    const handleGlobalTouchEnd = () => {
      if (isDraggingRef.current) {
        handleTouchEnd();
      }
    };

    if (isConstructorMode) {
      // 🎯 НОВИЙ: Додаємо глобальні touch обробники
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isConstructorMode, handleTouchMove, handleTouchEnd]);

  // 🎯 НОВИЙ: Функція для встановлення поточних позицій як заводських
  const setCurrentPositionsAsDefault = useCallback(() => {
    console.log('🏭 Встановлення поточних позицій як заводських...');
    
    // Отримуємо всі поточні позиції
    const currentPositions: Record<string, RelativePosition> = {};
    
    Object.keys(boxPositions).forEach(key => {
      const position = boxPositions[key];
      if (position.relativeX !== undefined && position.relativeY !== undefined) {
        const boxName = position.boxName;
        const deviceKey = `${boxName}_${position.deviceType}`;
        currentPositions[deviceKey] = {
          x: position.relativeX,
          y: position.relativeY
        };
      }
    });
    
    console.log('📊 Поточні позиції для встановлення як заводські:', currentPositions);
    
    // Тут можна додати логіку збереження цих позицій як заводських
    // Наприклад, експорт в JSON або оновлення коду
    const exportCode = generateDefaultPositionsCode(currentPositions);
    console.log('📝 Код для оновлення заводських позицій:');
    console.log(exportCode);
    
    return currentPositions;
  }, [boxPositions]);

  // Функція для генерації коду заводських позицій
  const generateDefaultPositionsCode = useCallback((positions: Record<string, RelativePosition>) => {
    const desktopPositions: Record<string, RelativePosition> = {};
    const mobilePositions: Record<string, RelativePosition> = {};
    
    Object.keys(positions).forEach(key => {
      if (key.includes('_desktop')) {
        const boxName = key.replace('_desktop', '');
        desktopPositions[boxName] = positions[key];
      } else if (key.includes('_mobile')) {
        const boxName = key.replace('_mobile', '');
        mobilePositions[boxName] = positions[key];
      }
    });
    
    let code = `// Заводські позиції на основі ваших налаштувань\n`;
    code += `const getDefaultRelativePosition = (boxName, deviceType = 'desktop') => {\n`;
    code += `  const positions = {\n`;
    code += `    desktop: {\n`;
    
    Object.keys(desktopPositions).forEach(boxName => {
      const pos = desktopPositions[boxName];
      code += `      ${boxName}: { x: ${pos.x.toFixed(1)}, y: ${pos.y.toFixed(1)} },\n`;
    });
    
    code += `    },\n`;
    code += `    mobile: {\n`;
    
    Object.keys(mobilePositions).forEach(boxName => {
      const pos = mobilePositions[boxName];
      code += `      ${boxName}: { x: ${pos.x.toFixed(1)}, y: ${pos.y.toFixed(1)} },\n`;
    });
    
    code += `    }\n`;
    code += `  };\n`;
    code += `  return positions[deviceType][boxName] || { x: 10, y: 10 };\n`;
    code += `};\n`;
    
    return code;
  }, []);

  return {
    // Стани
    isConstructorMode,
    dragState,
    boxPositions,
    
    // 🎯 НОВИЙ стан для направляючих ліній
    snapLines,
    
    // Функції управління
    enableConstructorMode,
    disableConstructorMode,
    toggleConstructorMode,
    
    // Drag & Drop функції
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    
    // 🎯 НОВИЙ: Touch функції для мобільних пристроїв
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Позиції боксів
    getBoxPosition,
    setBoxPosition,
    resetBoxPosition,
    resetAllPositions,
    
    // Розміри боксів
    getBoxSize,
    setBoxSize,
    increaseBoxSize,
    decreaseBoxSize,
    
    // Збереження/завантаження
    savePositions,
    loadPositions,
    saveAllPositions,
    
    // 🎯 НОВИЙ: Заводські налаштування
    setCurrentPositionsAsDefault,
    
    // Утиліти
    snapToGrid,
    gridSize,
    setSnapToGrid,
    setGridSize
  };
};

export default useDragAndDrop; 