import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAdminPanelV2 } from '../../hooks/admin-v2/useAdminPanelV2';
import AdminPanel from '../AdminPanel'; // Поточна v1 панель
import AdminPanelV2 from './AdminPanelV2'; // Нова v2 панель

interface AdminPanelWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

/**
 * 🎯 ADMIN PANEL WRAPPER - Обгортка для безпечного перемикання версій
 * 
 * Цей компонент керує перемиканням між V1 та V2 версіями адмін панелі.
 * V1 залишається основною версією, V2 - для тестування.
 * 
 * Особливості:
 * - Безпечне перемикання версій
 * - V1 як основна версія
 * - V2 для тестування та розробки
 * - Переклад інтерфейсу
 * - Переключення версій поза панеллю
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

  // Обробка перемикання версій
  const handleVersionSwitch = (version: 'v1' | 'v2') => {
    if (version === 'v1') {
      forceV1();
    } else if (version === 'v2') {
      testV2();
    }
  };

  // Рендер відповідної версії
  const renderAdminPanel = () => {
    switch (currentVersion) {
      case 'v1':
        return (
          <AdminPanel
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
          />
        );
      
      case 'v2':
        return (
          <AdminPanelV2
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
            onVersionSwitch={handleVersionSwitch}
            currentVersion={currentVersion}
          />
        );
      
      default:
        // Fallback на V1 якщо щось пішло не так
        return (
          <AdminPanel
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
          />
        );
    }
  };

  return (
    <div className="admin-panel-wrapper">
      {/* 🎯 Рендер активної версії */}
      {renderAdminPanel()}
      
      {/* 🔄 VERSION SWITCHER - ЗАВЖДИ ВИДИМИЙ ПІД ЧАС РОЗРОБКИ */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-2xl border border-gray-200 z-[65]">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
              🔄 {t('admin.panel.version.switcher')}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleVersionSwitch('v1')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentVersion === 'v1'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('admin.panel.version.v1')}
              </button>
              <button
                onClick={() => handleVersionSwitch('v2')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentVersion === 'v2'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t('admin.panel.version.v2')} 
                <span className="text-xs bg-orange-500 text-white px-1 rounded ml-1">
                  {t('admin.panel.beta.badge')}
                </span>
              </button>
            </div>
            
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-blue-500">📱</span>
                <span>Пристрій: <span className="font-medium capitalize">{deviceType}</span></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-500">✅</span>
                <span>{t('admin.panel.all.functions')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 🎯 INFO MESSAGE - Коли активна V2 */}
      {process.env.NODE_ENV === 'development' && currentVersion === 'v2' && isOpen && (
        <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg shadow-lg z-[65]">
          <div className="text-sm font-medium flex items-center gap-2">
            🧪 Тестування Admin Panel V2
          </div>
          <div className="text-xs mt-1">
            {t('admin.panel.new.responsive')} • {t('admin.panel.safe.testing')}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelWrapper; 