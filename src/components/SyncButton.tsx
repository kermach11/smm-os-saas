import React, { useState, useEffect } from 'react';
import domainSyncService from '../services/DomainSyncService';

interface SyncButtonProps {
  className?: string;
}

const SyncButton: React.FC<SyncButtonProps> = ({ className = '' }) => {
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
        title={isSyncing ? 'Синхронізація...' : 'Синхронізувати зміни з публічним сайтом'}
      >
        {isSyncing ? (
          <>
            <div className="sync-spinner" />
            <span>Синхронізація...</span>
          </>
        ) : syncResult === 'success' ? (
          <>
            <span className="sync-icon">✅</span>
            <span>Синхронізовано!</span>
          </>
        ) : syncResult === 'error' ? (
          <>
            <span className="sync-icon">❌</span>
            <span>Помилка синхронізації</span>
          </>
        ) : (
          <>
            <span className="sync-icon">🔄</span>
            <span>Синхронізувати зміни</span>
          </>
        )}
      </button>
      
      {lastSyncTime && !isSyncing && (
        <div className="last-sync-info">
          Остання синхронізація: {lastSyncTime.toLocaleTimeString('uk-UA')}
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
          min-width: 200px;
          justify-content: center;
        }

        .sync-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
          background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .sync-button:active:not(:disabled) {
          transform: translateY(0px);
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

        @media (max-width: 480px) {
          .sync-button {
            min-width: 180px !important;
            padding: 10px 20px !important;
            font-size: 14px !important;
          }
          
          .last-sync-info {
            font-size: 11px !important;
          }
        }
        `
      }} />
    </div>
  );
};

export default SyncButton; 