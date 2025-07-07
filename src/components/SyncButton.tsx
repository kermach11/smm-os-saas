import React, { useState, useEffect } from 'react';
import domainSyncService from '../services/DomainSyncService';
import { useTranslation, useLanguage } from '../hooks/useTranslation';

interface SyncButtonProps {
  className?: string;
}

const SyncButton: React.FC<SyncButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncResult, setSyncResult] = useState<'success' | 'error' | null>(null);

  // Завантажуємо статистику синхронізації при завантаженні компонента
  useEffect(() => {
    const stats = domainSyncService.getSyncStats();
    setLastSyncTime(stats.lastSyncTime);
  }, []);

  // Обробник клацання кнопки синхронізації
  const handleSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncResult(null);

    try {
      console.log('🚀 SyncButton: Починаємо повну синхронізацію...');
      
      const result = await domainSyncService.syncAllSettings();
      
      if (result.success) {
        setSyncResult('success');
        setLastSyncTime(new Date());
        console.log('✅ SyncButton: Синхронізація успішна!', result.results);
        
        // Показуємо повідомлення про успіх
        setTimeout(() => setSyncResult(null), 3000);
      } else {
        setSyncResult('error');
        console.error('❌ SyncButton: Синхронізація з помилками:', result.results);
        
        // Показуємо повідомлення про помилку довше
        setTimeout(() => setSyncResult(null), 5000);
      }
    } catch (error) {
      console.error('❌ SyncButton: Критична помилка синхронізації:', error);
      setSyncResult('error');
      setTimeout(() => setSyncResult(null), 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Показуємо кнопку тільки в адмін режимі
  if (!domainSyncService.isAdminMode()) {
    return null;
  }

  return (
    <div className={`sync-button-container ${className}`}>
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`sync-button ${isSyncing ? 'syncing' : ''} ${syncResult ? syncResult : ''}`}
        title={isSyncing ? t('sync.button.syncing') : t('sync.button.tooltip')}
      >
        {isSyncing ? (
          <>
            <div className="sync-spinner" />
            <span>{t('sync.button.syncing')}</span>
          </>
        ) : syncResult === 'success' ? (
          <>
            <span className="sync-icon">✅</span>
            <span>{t('sync.button.success')}</span>
          </>
        ) : syncResult === 'error' ? (
          <>
            <span className="sync-icon">❌</span>
            <span>{t('sync.button.error')}</span>
          </>
        ) : (
          <>
            <span className="sync-icon">🔄</span>
            <span>{t('sync.button.changes')}</span>
          </>
        )}
      </button>
      
      {lastSyncTime && !isSyncing && (
        <div className="last-sync-info">
          {t('sync.button.last')} {lastSyncTime.toLocaleTimeString(language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'uk-UA')}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .sync-button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin: 16px 0;
          width: 100%;
        }

        .sync-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          width: 100%;
          justify-content: center;
        }

        .sync-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .sync-button:active:not(:disabled) {
          transform: translateY(0px) scale(1.02);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        }

        .sync-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .sync-button.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%) !important;
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
        }

        .sync-button.error {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%) !important;
          box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
        }

        .sync-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .sync-icon {
          font-size: 18px;
        }

        .last-sync-info {
          font-size: 12px;
          color: #718096;
          text-align: center;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .sync-button-container {
            margin: 8px 0 !important;
            gap: 4px !important;
          }
          
          .sync-button {
            min-width: 100% !important;
            padding: 8px 16px !important;
            font-size: 12px !important;
            border-radius: 6px !important;
            gap: 6px !important;
            min-height: 44px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
          }
          
          .sync-button:hover:not(:disabled) {
            transform: none !important;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4) !important;
          }
          
          .sync-spinner {
            width: 12px !important;
            height: 12px !important;
          }
          
          .sync-icon {
            font-size: 14px !important;
          }
          
          .last-sync-info {
            font-size: 10px !important;
          }
        }
        `
      }} />
    </div>
  );
};

export default SyncButton; 