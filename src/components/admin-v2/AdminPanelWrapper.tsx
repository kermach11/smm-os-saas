import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAdminPanelV2 } from '../../hooks/admin-v2/useAdminPanelV2';
import AdminPanelV2 from './AdminPanelV2'; // V2 панель тепер єдина версія

interface AdminPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

/**
 * 🎯 ADMIN PANEL WRAPPER - V2 Only Architecture
 * 
 * Цей компонент тепер використовує виключно V2 версію адмін панелі.
 * V1 повністю видалено з проекту.
 * 
 * Особливості:
 * - Тільки V2 архітектура
 * - Повноцінна респонсивна підтримка
 * - Переклад інтерфейсу
 * - Development mode switcher (для майбутніх версій)
 */
const AdminPanelWrapper: React.FC<AdminPanelWrapperProps> = ({ 
  isOpen, 
  onClose, 
  onLogout 
}) => {
  const { t } = useTranslation();
  const { 
    currentVersion, 
    forceV1, 
    testV2, 
    isVisible,
    deviceType
  } = useAdminPanelV2();

  // Обробка перемикання версій (зараз завжди V2)
  const handleVersionSwitch = (version: 'v1' | 'v2') => {
    // V1 видалено, завжди перенаправляємо на V2
    testV2();
  };

  // Рендер відповідної версії (тільки V2)
  const renderAdminPanel = () => {
    // Завжди рендеримо V2 незалежно від currentVersion
    return (
      <AdminPanelV2
        isOpen={isOpen}
        onClose={onClose}
        onLogout={onLogout}
        onVersionSwitch={handleVersionSwitch}
        currentVersion="v2" // Завжди V2
      />
    );
  };

  return (
    <div className="admin-panel-wrapper">
      {/* 🎯 Рендер V2 панелі */}
      {renderAdminPanel()}
      
      {/* 🔄 VERSION SWITCHER - ТІЛЬКИ ДЛЯ DEVELOPMENT */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200 z-[65]">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
              ✅ Admin Panel V2 Active
            </div>
            
            <div className="flex gap-2">
              <button
                disabled={true}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                V1 (Removed)
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white shadow-lg"
              >
                V2 (Active)
              </button>
            </div>
            
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-blue-500">📱</span>
                <span>Пристрій: <span className="font-medium capitalize">{deviceType}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500">✅</span>
                <span>V1 компоненти видалено, тільки V2</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 🎯 SUCCESS MESSAGE - V2 Active */}
      {process.env.NODE_ENV === 'development' && isOpen && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-[65]">
          <div className="text-sm font-medium flex items-center gap-2">
            ✅ Admin Panel V2 - Production Ready
          </div>
          <div className="text-xs mt-1">
            V1 повністю видалено • Респонсивний дизайн • Стабільна версія
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelWrapper; 