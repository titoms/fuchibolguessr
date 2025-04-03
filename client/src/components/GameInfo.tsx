import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import SearchBar from "@/components/SearchBar";
import { useGameStore } from "@/store/gameStore";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GameInfo() {
  const { attempts, maxAttempts, continuousModeEnabled, isCompleted, enableContinuousMode } = useGameStore();
  const [countdown, setCountdown] = useState<string>("Loading...");
  const { t } = useLanguage();
  
  // Determine if continuous mode should be offered (after 6 failed attempts)
  const showContinuousMode = attempts >= maxAttempts && !continuousModeEnabled && !isCompleted;
  
  // Calculate time until next challenge
  useEffect(() => {
    const calculateCountdown = () => {
      // Get tomorrow at midnight
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      // Calculate difference
      const diff = tomorrow.getTime() - now.getTime();
      
      // Format as hours:minutes:seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    setCountdown(calculateCountdown());
    
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Mutation for enabling continuous mode
  const continuousModeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/game/continuous-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to enable continuous mode');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      enableContinuousMode();
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
    },
  });

  const handleContinuousModeEnable = () => {
    continuousModeMutation.mutate();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{t.todaysChallenge}</h2>
          <p className="text-slate-600">{t.rule1}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-slate-500">{t.nextChallenge}</div>
          <div className="text-lg font-semibold">{countdown}</div>
        </div>
      </div>
      
      {/* Game Progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{t.attempts}</span>
          <span className="text-sm font-medium">
            {continuousModeEnabled ? `${attempts}/∞` : `${attempts}/${maxAttempts}`}
          </span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`progress-indicator ${isCompleted ? 'bg-success' : 'bg-accent'} rounded-full`} 
            style={{ 
              width: isCompleted 
                ? '100%' 
                : continuousModeEnabled 
                  ? '100%' 
                  : `${Math.min(100, (attempts / maxAttempts) * 100)}%` 
            }}
          ></div>
        </div>
      </div>
      
      {/* Search Bar Component */}
      {!isCompleted && <SearchBar />}
      
      {/* Continuous mode toggle */}
      {showContinuousMode && (
        <div className="mt-4">
          <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div>
              <h3 className="font-medium text-amber-800">{t.outOfAttempts}</h3>
              <p className="text-sm text-amber-700">{t.continuousModePrompt}</p>
            </div>
            <button 
              className="px-3 py-1 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
              onClick={handleContinuousModeEnable}
              disabled={continuousModeMutation.isPending}
            >
              {continuousModeMutation.isPending ? t.loading : t.continuePlaying}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
