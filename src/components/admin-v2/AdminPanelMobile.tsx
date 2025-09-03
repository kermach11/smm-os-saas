import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';
import { AdminTabId } from './AdminContentAdapter';
import AdminContentAdapter from './AdminContentAdapter';
import { DeviceType } from '../../config/admin-v2/responsiveConfig';
import { useAdminPanelV2 } from '../../hooks/admin-v2/useAdminPanelV2';

interface AdminPanelMobileProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  deviceType: DeviceType;
  onVersionSwitch: (version: 'v1' | 'v2') => void;
  currentVersion: 'v1' | 'v2';
}

/**
 * 📱 MOBILE ADMIN PANEL V2 - Точна копія V1 для мобільних пристроїв
 */
const AdminPanelMobile: React.FC<AdminPanelMobileProps> = ({
  isOpen,
  onClose,
  onLogout,
  deviceType,
  onVersionSwitch,
  currentVersion
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AdminTabId>('preview');
  const { config } = useAdminPanelV2();


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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0 lg:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-none lg:rounded-2xl shadow-2xl w-full max-w-[1400px] lg:h-[90vh] flex flex-col overflow-hidden border-0 lg:border border-slate-200/50"
            style={{ 
              marginBottom: '0',
              height: config.height
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header - точно як у V1 */}
            <div className="pt-4 px-3 pb-3 lg:p-4 bg-gradient-to-r from-blue-600 to-purple-600 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-xl flex items-center justify-center border border-white/30">
                    <span className="text-white font-bold text-base lg:text-base">🛠️</span>
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-bold text-white">{t('admin.title')}</h2>
                    <p className="text-blue-100 text-xs hidden lg:block">{t('admin.dashboard')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 lg:gap-2">
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 lg:px-3 lg:py-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 text-sm lg:text-sm touch-manipulation"
                  >
                    🚪 <span className="hidden sm:inline">{t('admin.logout')}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 lg:w-8 lg:h-8 flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200 touch-manipulation"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Tabs - точно як у V1 */}
            <div className="flex bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200/60 overflow-x-auto lg:overflow-x-visible">
              {tabs.map((tab) => {
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
                const shortLabels: { [key: string]: string } = {
                  'preview': 'Превю', 'intro': 'Інтро', 'main': 'Головна', 'content': 'Контент',
                  'analytics': 'Аналітика', 'instructions': 'Інструкції', 'settings': 'Налаштування'
                };
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AdminTabId)}
                    className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 lg:gap-2 px-0.5 lg:px-4 py-1.5 lg:py-3 text-sm font-medium transition-all duration-300 relative group touch-manipulation min-h-[44px] lg:min-h-[auto] ${
                      activeTab === tab.id
                        ? currentStyle.active
                        : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-t-md'
                    }`}
                  >
                    <span className={`text-sm lg:text-lg transition-transform duration-200 ${
                      activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {tab.icon}
                    </span>
                    <span className="text-[9px] sm:text-xs lg:text-sm font-semibold text-center leading-tight max-w-full truncate px-0.5">
                      <span className="lg:hidden">{shortLabels[tab.id] || tab.label}</span>
                      <span className="hidden lg:inline">{tab.label}</span>
                    </span>
                    {activeTab === tab.id && (
                      <div 
                        className={`absolute bottom-0 left-0 right-0 ${currentStyle.indicator}`}
                        style={{ height: '2px' }}
                      ></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Content - точно як у V1 + розширена полоска знизу проти сліпої зони */}
            <div className="flex-1 overflow-y-auto bg-white pb-24 md:pb-0">
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

export default AdminPanelMobile; 