import { useState } from "react";
import { Settings, HelpCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";

export default function GameHeader() {
  const { t } = useLanguage();
  
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">{t.gameName}</h1>
        <div className="flex gap-4 items-center">
          <LanguageSelector />
          <SettingsDialog />
          <HelpDialog />
        </div>
      </div>
    </header>
  );
}

function SettingsDialog() {
  const { t } = useLanguage();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded hover:bg-slate-700 transition-colors" aria-label={t.settings}>
          <Settings className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.settings}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t.theme}</label>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md">{t.darkMode}</button>
              <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-md">{t.lightMode}</button>
            </div>
          </div>
          {/* Removed difficulty section as it's not in the translations */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HelpDialog() {
  const { t } = useLanguage();
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded hover:bg-slate-700 transition-colors" aria-label={t.help}>
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.howToPlay}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="rules">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules">{t.rules}</TabsTrigger>
            <TabsTrigger value="feedback">{t.help}</TabsTrigger>
          </TabsList>
          <TabsContent value="rules" className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              {t.rule1}
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li>{t.rule2}</li>
              <li>{t.rule3}</li>
              <li>{t.rule4}</li>
              <li>{t.rule5}</li>
            </ul>
          </TabsContent>
          <TabsContent value="feedback" className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              {t.rule2}
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm">{t.nationality}</h3>
                <p className="text-xs text-slate-500">🔴 {t.wrong} | 🟠 {t.sameContinent} | ✅ {t.correct}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">{t.position}</h3>
                <p className="text-xs text-slate-500">🔴 {t.wrong} | 🟠 {t.sameCategory} | ✅ {t.correct}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">{t.club}</h3>
                <p className="text-xs text-slate-500">🔴 {t.wrong} | 🟠 {t.sameLeague} | ✅ {t.correct}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">{t.age} & {t.height}</h3>
                <p className="text-xs text-slate-500">{t.age} (±{t.years}), {t.height} (↑ {t.taller}/↓ {t.shorter})</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
