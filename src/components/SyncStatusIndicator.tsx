import React, { useState, useEffect } from 'react';
import syncService from '../services/SyncService';

interface SyncStatusIndicatorProps {
  className?: string;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ className = '' }) => {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    // Слухаємо події синхронізації
    const handleSyncStart = () => {
      setSyncStatus('syncing');
    };

    const handleSyncSuccess = () => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncStatus('idle'), 2000);
    };

    const handleSyncError = () => {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    };

    // Слухаємо події оновлення налаштувань
    const handleSettingsUpdate = () => {
      if (syncService.isAdminMode()) {
        handleSyncStart();
        // Симулюємо успішну синхронізацію через короткий час
        setTimeout(handleSyncSuccess, 500);
      }
    };

    window.addEventListener('mainPageSettingsUpdated', handleSettingsUpdate);
    window.addEventListener('introSettingsUpdated', handleSettingsUpdate);
    window.addEventListener('welcomeSettingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('mainPageSettingsUpdated', handleSettingsUpdate);
      window.removeEventListener('introSettingsUpdated', handleSettingsUpdate);
      window.removeEventListener('welcomeSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const getStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return '🔄';
      case 'synced':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '💾';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Синхронізація...';
      case 'synced':
        return 'Синхронізовано';
      case 'error':
        return 'Помилка синхронізації';
      default:
        return 'Готово до синхронізації';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'synced':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Показуємо індикатор тільки в адмін режимі
  if (!syncService.isAdminMode()) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${getStatusColor()} ${className}`}>
      <span className={syncStatus === 'syncing' ? 'animate-spin' : ''}>{getStatusIcon()}</span>
      <span>{getStatusText()}</span>
      {lastSyncTime && syncStatus === 'idle' && (
        <span className="text-xs opacity-70">
          {lastSyncTime.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default SyncStatusIndicator; 