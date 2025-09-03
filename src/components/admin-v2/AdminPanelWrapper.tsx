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
    isVisible
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
      

      

    </div>
  );
};

export default AdminPanelWrapper; 