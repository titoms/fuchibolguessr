import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={t.themeToggle.toggleTheme}
      title={t.themeToggle.toggleTheme}
      className="rounded-full"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}