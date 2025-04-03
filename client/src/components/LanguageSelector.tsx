import React from 'react';
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
  const { language, setLanguage, availableLanguages } = useLanguage();
  
  // Get the current language display
  const currentLanguage = availableLanguages.find(lang => lang.code === language);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200 hover:text-slate-900 font-medium">
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="hidden md:inline-block">{currentLanguage?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setLanguage(lang.code)}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}