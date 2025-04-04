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
  guessedPlayers: Set<number>;
  
  // Actions
  initializeState: (state: GameStateResponse) => void;
  addGuess: (guess: FeedbackResponse) => void;
  enableContinuousMode: () => void;
  resetGame: () => void;
  setGuessing: (isGuessing: boolean) => void;
  regenerateGame: () => void;
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
  guessedPlayers: new Set(),
  
  initializeState: (state) => set({
    gameId: state.gameId,
    attempts: state.attempts,
    maxAttempts: state.maxAttempts,
    continuousModeEnabled: state.continuousModeEnabled,
    isCompleted: state.completed,
    guesses: state.guesses,
    score: state.score || null,
    nextGameTime: state.nextGameTime || null,
    guessedPlayers: new Set(state.guesses.map(guess => guess.guessedPlayer.id)),
  }),
  
  addGuess: (guess) => set((state) => {
    // Prevent guessing the same player again
    if (state.guessedPlayers.has(guess.guessedPlayer.id)) {
      return state;
    }
    
    const newGuesses = [...state.guesses, guess];
    const isCompleted = guess.correct;
    const newGuessedPlayers = new Set(state.guessedPlayers);
    newGuessedPlayers.add(guess.guessedPlayer.id);
    
    return {
      guesses: newGuesses,
      attempts: state.attempts + 1,
      isCompleted,
      isGuessing: false,
      guessedPlayers: newGuessedPlayers,
    };
  }),
  
  enableContinuousMode: () => set({ continuousModeEnabled: true }),
  
  resetGame: () => set((state) => ({
    gameId: null,
    attempts: 0,
    continuousModeEnabled: false,
    isCompleted: false,
    guesses: [],
    score: null,
    nextGameTime: null,
    guessedPlayers: new Set(),
    isGuessing: false,
  })),
  
  regenerateGame: () => set((state) => ({
    attempts: 0,
    isCompleted: false,
    guesses: [],
    score: null,
    guessedPlayers: new Set(),
    isGuessing: false,
  })),
  
  setGuessing: (isGuessing) => set({ isGuessing }),
}));
