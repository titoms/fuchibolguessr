import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translation, translations } from './translations';

// Define language options type
type LanguageOption = {
  code: Language;
  name: string;
  flag: string;
};

// Interface for the language context
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
  availableLanguages: LanguageOption[];
}

// Define available languages
const availableLanguageOptions: LanguageOption[] = [
  { code: 'en', name: translations.en.languageName, flag: translations.en.flag },
  { code: 'fr', name: translations.fr.languageName, flag: translations.fr.flag },
  { code: 'es', name: translations.es.languageName, flag: translations.es.flag },
];

// Create the language context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  availableLanguages: availableLanguageOptions,
});

// Language provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Get the initial language
  const getInitialLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang && Object.keys(translations).includes(browserLang)) {
      return browserLang as Language;
    }
    
    // Default to English
    return 'en';
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  // Set language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t: translations[language],
        availableLanguages: availableLanguageOptions 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Convenience hook to directly access translations
export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}