import { useState } from "react";
import { Settings, HelpCircle, SliderIcon } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GameHeader() {
  return (
    <header className="bg-primary text-white py-4 px-6 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">FootballGuesser</h1>
        <div className="flex gap-4">
          <SettingsDialog />
          <HelpDialog />
        </div>
      </div>
    </header>
  );
}

function SettingsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded hover:bg-slate-700 transition-colors">
          <Settings className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Theme</label>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md">Dark</button>
              <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-md">Light</button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-md">Easy</button>
              <button className="px-4 py-2 bg-primary text-white rounded-md">Normal</button>
              <button className="px-4 py-2 bg-slate-200 text-slate-900 rounded-md">Hard</button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded hover:bg-slate-700 transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="rules">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rules">Game Rules</TabsTrigger>
            <TabsTrigger value="feedback">Understanding Feedback</TabsTrigger>
          </TabsList>
          <TabsContent value="rules" className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              FootballGuesser is a daily challenge where you need to guess a football player in 6 attempts or fewer.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
              <li>Search and select a player name to submit your guess</li>
              <li>After each guess, you'll receive feedback about how close you are</li>
              <li>Use the feedback to refine your next guess</li>
              <li>If you fail after 6 attempts, you can continue in unlimited mode</li>
              <li>A new player is selected each day</li>
            </ul>
          </TabsContent>
          <TabsContent value="feedback" className="space-y-4 py-4">
            <p className="text-sm text-slate-600">
              After each guess, you'll get clues about the correct player:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-sm">Nationality</h3>
                <p className="text-xs text-slate-500">🔴 Wrong | 🟠 Same continent | ✅ Flag shown</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Position</h3>
                <p className="text-xs text-slate-500">🔴 Wrong | 🟠 Same category | ✅ Correct position</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Club</h3>
                <p className="text-xs text-slate-500">🔴 Wrong | 🟠 Same league | ✅ Logo shown</p>
              </div>
              <div>
                <h3 className="font-medium text-sm">Other Attributes</h3>
                <p className="text-xs text-slate-500">Age (±years), Height (↑/↓), Foot (✅/🔴)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
