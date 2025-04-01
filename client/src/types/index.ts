export interface PlayerSearchProps {
  id: number;
  name: string;
  nationality: string;
  club: string;
  imageUrl?: string;
}

export interface GuessResult {
  correct: boolean;
  nationality: {
    status: 'correct' | 'same_continent' | 'wrong';
    value?: string;
    flag?: string;
  };
  position: {
    status: 'correct' | 'same_category' | 'wrong';
    value: string;
  };
  club: {
    status: 'correct' | 'same_league' | 'wrong';
    value: string;
    logo?: string;
  };
  age: {
    difference: number;
    value?: number;
  };
  height: {
    status: 'taller' | 'correct' | 'shorter';
    value?: number;
  };
  dominantFoot: {
    status: 'correct' | 'wrong';
    value: string;
  };
  careerStart: {
    status: 'earlier' | 'correct' | 'later';
    value?: number;
  };
  guessedPlayer: {
    id: number;
    name: string;
    nationality: string;
    club: string;
    imageUrl?: string;
  };
  timestamp: string;
}

export interface GameState {
  gameId: number;
  attempts: number;
  maxAttempts: number;
  continuousModeEnabled: boolean;
  completed: boolean;
  guesses: GuessResult[];
  score?: number;
  nextGameTime?: string;
}
