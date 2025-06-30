import React from 'react';
import { TranslationContext, useLanguage } from '../hooks/useTranslation';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}; 