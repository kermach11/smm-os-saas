import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAdminPanelV2 } from '../../hooks/admin-v2/useAdminPanelV2';
import AdminPanelMobile from './AdminPanelMobile';
import AdminPanelDesktop from './AdminPanelDesktop';

interface AdminPanelV2Props {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onVersionSwitch: (version: 'v1' | 'v2') => void;
  currentVersion: 'v1' | 'v2';
}

/**
 * 🎯 ADMIN PANEL V2 - Головний компонент
 * 
 * Автоматично обирає між мобільним та десктопним інтерфейсом
 * на основі типу пристрою, який визначає AdminManager.
 * 
 * Особливості:
 * - Реактивний переклад інтерфейсу
 * - Автоматичний вибір responsive компонента
 * - Точна копія V1 стилізації
 * - Безпечне перемикання версій
 */
const AdminPanelV2: React.FC<AdminPanelV2Props> = ({ 
  isOpen, 
  onClose, 
  onLogout, 
  onVersionSwitch, 
  currentVersion 
}) => {
  const { t } = useTranslation();
  const { deviceType, config } = useAdminPanelV2();



  // Рендер відповідного компонента на основі типу пристрою
  const renderAdminPanel = () => {
    switch (deviceType) {
      case 'mobile':
        return (
          <AdminPanelMobile
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
            deviceType={deviceType}
            onVersionSwitch={onVersionSwitch}
            currentVersion={currentVersion}
          />
        );
      
      case 'tablet':
        return (
          <AdminPanelDesktop
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
            deviceType={deviceType}
            onVersionSwitch={onVersionSwitch}
            currentVersion={currentVersion}
          />
        );
      
      case 'desktop':
      default:
        return (
          <AdminPanelDesktop
            isOpen={isOpen}
            onClose={onClose}
            onLogout={onLogout}
            deviceType={deviceType}
            onVersionSwitch={onVersionSwitch}
            currentVersion={currentVersion}
          />
        );
    }
  };

  return (
    <div className="admin-panel-v2">
      {/* 🎯 Responsive Admin Panel */}
      {renderAdminPanel()}
    </div>
  );
};

export default AdminPanelV2; 