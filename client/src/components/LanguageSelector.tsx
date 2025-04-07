import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Language } from '@/lib/i18n/translations';

export default function LanguageSelector() {
  const { language, setLanguage, availableLanguages, isInitialized } = useLanguage();
  
  if (!isInitialized) return null;
  
  const currentLanguage = useMemo(() => 
    availableLanguages.find(lang => lang.code === language),
    [availableLanguages, language]
  );

  const handleLanguageChange = useCallback((langCode: Language) => {
    setLanguage(langCode);
  }, [setLanguage]);

  if (!currentLanguage) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-1 bg-white text-gray-900 border-gray-300 hover:bg-gray-100 font-medium"
        >
          <span className="text-lg mr-1">{currentLanguage.flag}</span>
          <span className="hidden md:inline-block">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-2 cursor-pointer text-gray-900 hover:bg-gray-100"
            onClick={() => handleLanguageChange(lang.code)}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}