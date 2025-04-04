import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/GameHeader";
import GameInfo from "@/components/GameInfo";
import FeedbackContainer from "@/components/FeedbackContainer";
import GameComplete from "@/components/GameComplete";
import { useGameStore } from "@/store/gameStore";
import { GameStateResponse } from "@shared/schema";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isCompleted, attempts, maxAttempts, regenerateGame, resetGame } = useGameStore();
  const { t } = useLanguage();

  // Fetch game state when component mounts
  const { data: gameState, isLoading } = useQuery<GameStateResponse>({
    queryKey: ["/api/game/state"],
  });

  // Initialize game state from API
  useEffect(() => {
    if (gameState && 'gameId' in gameState && 'attempts' in gameState && 'guesses' in gameState) {
      useGameStore.getState().initializeState(gameState);
    }
  }, [gameState]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        <span className="ml-3">{t.loading}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <GameHeader />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <GameInfo />
          <FeedbackContainer />
          
          {isCompleted && (
            <div className="mt-6">
              {attempts < maxAttempts ? (
                <Button 
                  onClick={regenerateGame} 
                  className="w-full md:w-auto"
                >
                  {t.regenerateGame}
                </Button>
              ) : (
                <Button 
                  onClick={resetGame} 
                  className="w-full md:w-auto"
                >
                  {t.newGame}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-slate-100 py-4 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p> {new Date().getFullYear()} {t.gameName}</p>
        </div>
      </footer>
    </div>
  );
}
