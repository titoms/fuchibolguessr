import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Language, Translation, translations } from './translations';

type LanguageOption = {
  code: Language;
  name: string;
  flag: string;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  availableLanguages: LanguageOption[];
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Initialize language from localStorage or browser
    const savedLanguage = localStorage.getItem('language');
    const browserLang = navigator.language.split('-')[0];
    
    const initialLanguage = 
      savedLanguage && savedLanguage in translations ? savedLanguage as Language :
      browserLang in translations ? browserLang as Language : 'en';
    
    setLanguageState(initialLanguage);
    setIsInitialized(true);
    
    const handler = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue && e.newValue in translations) {
        setLanguageState(e.newValue as Language);
      }
    };
    
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const availableLanguages = useMemo<LanguageOption[]>(() => {
    return Object.entries(translations).map(([code, trans]) => ({
      code: code as Language,
      name: trans.languageName,
      flag: trans.flag
    }));
  }, []);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (newLanguage in translations) {
      localStorage.setItem('language', newLanguage);
      setLanguageState(newLanguage);
    }
  }, []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
    availableLanguages,
    isInitialized
  }), [language, setLanguage, availableLanguages, isInitialized]);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}