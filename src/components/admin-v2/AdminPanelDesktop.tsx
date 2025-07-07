import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminTabId } from './AdminContentAdapter';
import AdminContentAdapter from './AdminContentAdapter';
import { DeviceType } from '../../config/admin-v2/responsiveConfig';

interface AdminPanelDesktopProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  deviceType: DeviceType;
  onVersionSwitch: (version: 'v1' | 'v2') => void;
  currentVersion: 'v1' | 'v2';
}

/**
 * 🖥️ DESKTOP ADMIN PANEL V2 - Точна копія V1 для десктопів
 */
const AdminPanelDesktop: React.FC<AdminPanelDesktopProps> = ({
  isOpen,
  onClose,
  onLogout,
  deviceType,
  onVersionSwitch,
  currentVersion
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTabId>('preview');
  const [isDesktop] = useState(true);

  const tabs = [
    { id: 'preview', label: t('nav.preview'), icon: '🎨' },
    { id: 'intro', label: t('nav.intro'), icon: '🎬' },
    { id: 'main', label: t('nav.main'), icon: '🎠' },
    { id: 'content', label: t('nav.content'), icon: '📁' },
    { id: 'analytics', label: t('nav.analytics'), icon: '📊' },
    { id: 'instructions', label: t('nav.instructions'), icon: '📚' },
    { id: 'settings', label: t('nav.settings'), icon: '⚙️' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ 
            scale: isDesktop ? 0.85 : 1, 
            opacity: 1, 
            y: 0 
          }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-2xl w-full max-w-[1400px] h-[90vh] flex flex-col overflow-hidden border border-slate-200/50"
          style={{ 
            marginBottom: '0' 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Desktop Header - Exact V1 Copy */}
          <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                  <span className="text-white font-bold text-base">🛠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{t('admin.title')}</h2>
                  <p className="text-blue-100 text-xs">{t('admin.dashboard')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-sm"
                >
                  🚪 <span>{t('admin.logout')}</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Tabs - Exact V1 Copy */}
          <div className="flex bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60 overflow-x-visible">
            {tabs.map((tab) => {
              // Статичні стилі для кожної вкладки як у V1
              const tabStyles = {
                'preview': {
                  active: 'text-blue-600 bg-white shadow-md rounded-t-lg border-t-2 border-blue-500',
                  indicator: 'bg-gradient-to-r from-blue-400 to-blue-600'
                },
                'intro': {
                  active: 'text-emerald-600 bg-white shadow-md rounded-t-lg border-t-2 border-emerald-500',
                  indicator: 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                },
                'main': {
                  active: 'text-purple-600 bg-white shadow-md rounded-t-lg border-t-2 border-purple-500',
                  indicator: 'bg-gradient-to-r from-purple-400 to-purple-600'
                },
                'content': {
                  active: 'text-amber-600 bg-white shadow-md rounded-t-lg border-t-2 border-amber-500',
                  indicator: 'bg-gradient-to-r from-amber-400 to-amber-600'
                },
                'analytics': {
                  active: 'text-rose-600 bg-white shadow-md rounded-t-lg border-t-2 border-rose-500',
                  indicator: 'bg-gradient-to-r from-rose-400 to-rose-600'
                },
                'instructions': {
                  active: 'text-cyan-600 bg-white shadow-md rounded-t-lg border-t-2 border-cyan-500',
                  indicator: 'bg-gradient-to-r from-cyan-400 to-cyan-600'
                },
                'settings': {
                  active: 'text-indigo-600 bg-white shadow-md rounded-t-lg border-t-2 border-indigo-500',
                  indicator: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
                }
              };
              
              const currentStyle = tabStyles[tab.id as keyof typeof tabStyles];
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTabId)}
                  className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 relative group ${
                    isActive
                      ? currentStyle.active
                      : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-t-md'
                  }`}
                >
                  <span className={`text-lg transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-semibold text-center leading-tight max-w-full truncate px-0.5">
                    {tab.label}
                  </span>
                  {isActive && (
                    <div 
                      className={`absolute bottom-0 left-0 right-0 ${currentStyle.indicator}`}
                      style={{ height: '2px' }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area - Exact V1 Copy */}
          <div className="flex-1 overflow-hidden">
            <AdminContentAdapter
              activeTab={activeTab}
              deviceType={deviceType}
              onClose={onClose}
              onLogout={onLogout}
            />
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanelDesktop; 