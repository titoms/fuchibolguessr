import { create } from 'zustand';
import { FeedbackResponse, GameStateResponse } from '@shared/schema';

interface GameState {
  gameId: number | null;
  attempts: number;
  maxAttempts: number;
  continuousModeEnabled: boolean;
  isCompleted: boolean;
  guesses: FeedbackResponse[];
  score: number | null;
  nextGameTime: string | null;
  isGuessing: boolean;
  
  // Actions
  initializeState: (state: GameStateResponse) => void;
  addGuess: (guess: FeedbackResponse) => void;
  enableContinuousMode: () => void;
  resetGame: () => void;
  setGuessing: (isGuessing: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
  gameId: null,
  attempts: 0,
  maxAttempts: 6,
  continuousModeEnabled: false,
  isCompleted: false,
  guesses: [],
  score: null,
  nextGameTime: null,
  isGuessing: false,
  
  initializeState: (state) => set({
    gameId: state.gameId,
    attempts: state.attempts,
    maxAttempts: state.maxAttempts,
    continuousModeEnabled: state.continuousModeEnabled,
    isCompleted: state.completed,
    guesses: state.guesses,
    score: state.score || null,
    nextGameTime: state.nextGameTime || null,
  }),
  
  addGuess: (guess) => set((state) => {
    const newGuesses = [...state.guesses, guess];
    const isCompleted = guess.correct;
    
    return {
      guesses: newGuesses,
      attempts: state.attempts + 1,
      isCompleted,
      isGuessing: false,
    };
  }),
  
  enableContinuousMode: () => set({ continuousModeEnabled: true }),
  
  resetGame: () => set({
    attempts: 0,
    continuousModeEnabled: false,
    isCompleted: false,
    guesses: [],
    score: null,
  }),
  
  setGuessing: (isGuessing) => set({ isGuessing }),
}));
