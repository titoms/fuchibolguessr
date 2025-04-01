import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GameHeader from "@/components/GameHeader";
import GameInfo from "@/components/GameInfo";
import FeedbackContainer from "@/components/FeedbackContainer";
import GameComplete from "@/components/GameComplete";
import { useGameStore } from "@/store/gameStore";

export default function Home() {
  const { isCompleted, resetGame } = useGameStore();

  // Fetch game state when component mounts
  const { data: gameState, isLoading } = useQuery({
    queryKey: ["/api/game/state"],
  });

  // Initialize game state from API
  useEffect(() => {
    if (gameState) {
      useGameStore.getState().initializeState(gameState);
    }
  }, [gameState]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
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
          
          {isCompleted && <GameComplete />}
        </div>
      </main>
      
      <footer className="bg-slate-100 py-4 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} FootballGuesser. A daily football player guessing challenge.</p>
        </div>
      </footer>
    </div>
  );
}
