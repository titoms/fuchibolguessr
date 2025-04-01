import { 
  users, 
  players, 
  gameSession, 
  type User, 
  type InsertUser, 
  type Player, 
  type InsertPlayer,
  type GameSession,
  type FeedbackResponse,
  type GameStateResponse
} from "@shared/schema";
import { playerData } from "./data/players";
import { isSameDay } from "@/lib/utils";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player methods
  getPlayer(id: number): Promise<Player | undefined>;
  getAllPlayers(): Promise<Player[]>;
  searchPlayers(query: string): Promise<Player[]>;
  
  // Game session methods
  getOrCreateGameState(): Promise<GameStateResponse>;
  recordGuess(gameId: number, feedback: FeedbackResponse): Promise<void>;
  enableContinuousMode(gameId: number): Promise<void>;
  completeGame(gameId: number, score: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private players: Map<number, Player>;
  private games: Map<number, any>;
  private guesses: Map<number, FeedbackResponse[]>;
  
  private currentUserId: number;
  private currentGameId: number;
  private todayGame: any | null;
  
  constructor() {
    this.users = new Map();
    this.players = new Map();
    this.games = new Map();
    this.guesses = new Map();
    
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.todayGame = null;
    
    // Initialize with player data
    this.initializePlayerData();
  }
  
  private initializePlayerData() {
    // Load player data from the mock data file
    playerData.forEach((player, index) => {
      const id = index + 1;
      this.players.set(id, { ...player, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }
  
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }
  
  async searchPlayers(query: string): Promise<Player[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.players.values())
      .filter(player => 
        player.name.toLowerCase().includes(lowercaseQuery) ||
        player.nationality.toLowerCase().includes(lowercaseQuery) ||
        player.club.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 10); // Limit to 10 results
  }
  
  // Game session methods
  async getOrCreateGameState(): Promise<GameStateResponse> {
    const today = new Date();
    
    // Check if we have today's game already
    if (this.todayGame && isSameDay(new Date(this.todayGame.date), today)) {
      // Return existing game state
      const guesses = this.guesses.get(this.todayGame.id) || [];
      
      return {
        gameId: this.todayGame.id,
        attempts: guesses.length,
        maxAttempts: 6,
        continuousModeEnabled: this.todayGame.continuousModeEnabled,
        completed: this.todayGame.completed,
        guesses: guesses,
        score: this.todayGame.score,
        nextGameTime: this.getNextGameTime(),
      };
    }
    
    // Create a new game for today
    const allPlayers = await this.getAllPlayers();
    const randomIndex = Math.floor(Math.random() * allPlayers.length);
    const dailyPlayer = allPlayers[randomIndex];
    
    const gameId = this.currentGameId++;
    const newGame = {
      id: gameId,
      dailyPlayerId: dailyPlayer.id,
      date: today,
      continuousModeEnabled: false,
      completed: false,
      score: null,
    };
    
    this.games.set(gameId, newGame);
    this.guesses.set(gameId, []);
    this.todayGame = newGame;
    
    return {
      gameId,
      attempts: 0,
      maxAttempts: 6,
      continuousModeEnabled: false,
      completed: false,
      guesses: [],
      nextGameTime: this.getNextGameTime(),
    };
  }
  
  async recordGuess(gameId: number, feedback: FeedbackResponse): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    const guesses = this.guesses.get(gameId) || [];
    guesses.push(feedback);
    this.guesses.set(gameId, guesses);
  }
  
  async enableContinuousMode(gameId: number): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    game.continuousModeEnabled = true;
    this.games.set(gameId, game);
    this.todayGame = game;
  }
  
  async completeGame(gameId: number, score: number): Promise<void> {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    game.completed = true;
    game.score = score;
    this.games.set(gameId, game);
    this.todayGame = game;
  }
  
  // Helper methods
  private getNextGameTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }
}

export const storage = new MemStorage();
