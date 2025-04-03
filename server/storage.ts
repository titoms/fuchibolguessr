import { 
  type User, 
  type InsertUser, 
  type Player, 
  type InsertPlayer,
  type GameSession,
  type Guess,
  type FeedbackResponse,
  type GameStateResponse
} from "@shared/schema";
import { playerData } from "./data/players";
import { isSameDay } from "@/lib/utils";
import Fuse from "fuse.js";

// Database imports
import { 
  drizzle 
} from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like, and, or, desc } from "drizzle-orm";
import { 
  players as playersTable, 
  users as usersTable,
  gameSessions as gameSessionsTable,
  guesses as guessesTable
} from "./db/schema";

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
  getOrCreateGameState(sessionId?: string): Promise<GameStateResponse>;
  getSessionGameState(sessionId: string): Promise<GameStateResponse | undefined>;
  recordGuess(gameId: number, feedback: FeedbackResponse): Promise<void>;
  enableContinuousMode(gameId: number): Promise<void>;
  completeGame(gameId: number, score: number): Promise<void>;
}

// PostgreSQL database storage implementation
export class PostgresStorage implements IStorage {
  private db: any; // DrizzlePostgresJsDatabase type
  private fuse: Fuse<Player> | null = null;
  private players: Player[] = [];

  constructor() {
    // Create database connection
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    const client = postgres(connectionString);
    this.db = drizzle(client);
    
    // Initialize player data and search index
    this.initializePlayerData();
  }

  private async initializePlayerData() {
    try {
      // Check if players table is empty
      const existingPlayers = await this.db.select().from(playersTable).limit(1);
      
      if (existingPlayers.length === 0) {
        console.log("Initializing player database with sample data...");
        
        // Insert player data in batches
        for (const player of playerData) {
          await this.db.insert(playersTable).values(player);
        }
        
        console.log("Player data initialized successfully");
      }
      
      // Load all players for search capabilities
      this.players = await this.getAllPlayers();
      
      // Initialize Fuse.js for fuzzy search
      this.fuse = new Fuse(this.players, {
        keys: ['name', 'nationality', 'club'],
        threshold: 0.3,
        includeScore: true
      });
      
      console.log(`Loaded ${this.players.length} players into search index`);
    } catch (error) {
      console.error("Error initializing player data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.db.select().from(usersTable).where(eq(usersTable.id, id));
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.db.select().from(usersTable).where(eq(usersTable.username, username));
    return users[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(usersTable).values(insertUser).returning();
    return user;
  }
  
  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    const players = await this.db.select().from(playersTable).where(eq(playersTable.id, id));
    return players[0];
  }
  
  async getAllPlayers(): Promise<Player[]> {
    return await this.db.select().from(playersTable);
  }
  
  async searchPlayers(query: string): Promise<Player[]> {
    // Use Fuse.js for fuzzy search if available
    if (this.fuse && query.length >= 3) {
      const searchResults = this.fuse.search(query);
      return searchResults.slice(0, 10).map(result => result.item);
    }
    
    // Fallback to database search
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    const players = await this.db.select()
      .from(playersTable)
      .where(
        or(
          like(playersTable.name, lowercaseQuery),
          like(playersTable.nationality, lowercaseQuery),
          like(playersTable.club, lowercaseQuery)
        )
      )
      .limit(10);
    
    return players;
  }
  
  // Game session methods
  async getOrCreateGameState(sessionId?: string): Promise<GameStateResponse> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Try to find a game session for today
    const recentGames = await this.db.select()
      .from(gameSessionsTable)
      .orderBy(desc(gameSessionsTable.id))
      .limit(5);
    
    let todayGame = recentGames.find((game: GameSession) => {
      const gameDate = new Date(game.date);
      return isSameDay(gameDate, today);
    });
    
    // If no game for today, create a new one
    if (!todayGame) {
      // Get a random player for today's challenge
      const allPlayers = await this.getAllPlayers();
      if (allPlayers.length === 0) {
        throw new Error("No players found in the database");
      }
      
      const randomIndex = Math.floor(Math.random() * allPlayers.length);
      const dailyPlayer = allPlayers[randomIndex];
      
      // Insert new game session
      [todayGame] = await this.db.insert(gameSessionsTable)
        .values({
          dailyPlayerId: dailyPlayer.id,
          date: today,
          continuousModeEnabled: false,
          completed: false,
          // If we have a session ID, store it with the game
          sessionId: sessionId || null
        })
        .returning();
      
      console.log(`Created new game with ID ${todayGame.id} for today with player ${dailyPlayer.name}`);
    } 
    // If we have a session ID but the game doesn't, update it
    else if (sessionId && !todayGame.sessionId) {
      // Create a clone of the game with a session ID
      const [newSessionGame] = await this.db.insert(gameSessionsTable)
        .values({
          dailyPlayerId: todayGame.dailyPlayerId,
          date: today,
          continuousModeEnabled: false,
          completed: false,
          sessionId: sessionId
        })
        .returning();
      
      todayGame = newSessionGame;
      console.log(`Created new session game with ID ${todayGame.id} for session ${sessionId}`);
    }
    // If we have a session ID, check if there's already a game for this session
    else if (sessionId) {
      const sessionGames = await this.db.select()
        .from(gameSessionsTable)
        .where(eq(gameSessionsTable.sessionId, sessionId))
        .orderBy(desc(gameSessionsTable.id))
        .limit(1);
      
      if (sessionGames.length > 0) {
        todayGame = sessionGames[0];
      } else {
        // Create a clone of the game with a session ID
        const [newSessionGame] = await this.db.insert(gameSessionsTable)
          .values({
            dailyPlayerId: todayGame.dailyPlayerId,
            date: today,
            continuousModeEnabled: false,
            completed: false,
            sessionId: sessionId
          })
          .returning();
        
        todayGame = newSessionGame;
        console.log(`Created new session game with ID ${todayGame.id} for session ${sessionId}`);
      }
    }
    
    // Get all guesses for this game
    const guessRecords = await this.db.select()
      .from(guessesTable)
      .where(eq(guessesTable.gameSessionId, todayGame.id))
      .orderBy(guessesTable.timestamp);
    
    // Parse the JSON feedback data
    const guesses: FeedbackResponse[] = guessRecords.map((record: { feedbackData: any }) => 
      typeof record.feedbackData === 'string' 
        ? JSON.parse(record.feedbackData) 
        : record.feedbackData
    );
    
    return {
      gameId: todayGame.id,
      dailyPlayerId: todayGame.dailyPlayerId,
      attempts: guesses.length,
      maxAttempts: 6,
      continuousModeEnabled: todayGame.continuousModeEnabled,
      completed: todayGame.completed,
      guesses,
      score: todayGame.score || undefined,
      nextGameTime: todayGame.completed ? this.getNextGameTime() : undefined,
    };
  }
  
  async getSessionGameState(sessionId: string): Promise<GameStateResponse | undefined> {
    if (!sessionId) {
      return undefined;
    }
    
    // Find the session's game
    const sessionGames = await this.db.select()
      .from(gameSessionsTable)
      .where(eq(gameSessionsTable.sessionId, sessionId))
      .orderBy(desc(gameSessionsTable.id))
      .limit(1);
    
    if (sessionGames.length === 0) {
      return undefined;
    }
    
    const game = sessionGames[0];
    
    // Get all guesses for this game
    const guessRecords = await this.db.select()
      .from(guessesTable)
      .where(eq(guessesTable.gameSessionId, game.id))
      .orderBy(guessesTable.timestamp);
    
    // Parse the JSON feedback data
    const guesses: FeedbackResponse[] = guessRecords.map((record: { feedbackData: any }) => 
      typeof record.feedbackData === 'string' 
        ? JSON.parse(record.feedbackData) 
        : record.feedbackData
    );
    
    return {
      gameId: game.id,
      dailyPlayerId: game.dailyPlayerId,
      attempts: guesses.length,
      maxAttempts: 6,
      continuousModeEnabled: game.continuousModeEnabled,
      completed: game.completed,
      guesses,
      score: game.score || undefined,
      nextGameTime: game.completed ? this.getNextGameTime() : undefined,
    };
  }
  
  async recordGuess(gameId: number, feedback: FeedbackResponse): Promise<void> {
    // Clean the feedback object to replace undefined values with null
    // PostgreSQL doesn't accept undefined values in JSON
    const cleanedFeedback = JSON.parse(JSON.stringify(feedback));
    
    // Insert guess record with JSON feedback data
    await this.db.insert(guessesTable)
      .values({
        gameSessionId: gameId,
        feedbackData: cleanedFeedback, // JSON type column
        timestamp: new Date(),
      });
  }
  
  async enableContinuousMode(gameId: number): Promise<void> {
    await this.db.update(gameSessionsTable)
      .set({ continuousModeEnabled: true })
      .where(eq(gameSessionsTable.id, gameId));
  }
  
  async completeGame(gameId: number, score: number): Promise<void> {
    await this.db.update(gameSessionsTable)
      .set({ 
        completed: true,
        score: score 
      })
      .where(eq(gameSessionsTable.id, gameId));
  }
  
  // Helper methods
  private getNextGameTime(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }
}

// In-memory storage fallback implementation
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
  async getOrCreateGameState(sessionId?: string): Promise<GameStateResponse> {
    const today = new Date();
    
    // If we have a session ID, check for a session-specific game
    if (sessionId) {
      // Look for a game with this session ID
      const sessionGame = Array.from(this.games.values()).find(
        (game) => game.sessionId === sessionId && isSameDay(new Date(game.date), today)
      );
      
      if (sessionGame) {
        const guesses = this.guesses.get(sessionGame.id) || [];
        
        return {
          gameId: sessionGame.id,
          dailyPlayerId: sessionGame.dailyPlayerId,
          attempts: guesses.length,
          maxAttempts: 6,
          continuousModeEnabled: sessionGame.continuousModeEnabled,
          completed: sessionGame.completed,
          guesses: guesses,
          score: sessionGame.score,
          nextGameTime: sessionGame.completed ? this.getNextGameTime() : undefined,
        };
      }
    }
    
    // Check if we have today's game already (no session)
    if (this.todayGame && isSameDay(new Date(this.todayGame.date), today)) {
      // If we have a session ID, create a session-specific copy of today's game
      if (sessionId) {
        const gameId = this.currentGameId++;
        const newSessionGame = {
          id: gameId,
          dailyPlayerId: this.todayGame.dailyPlayerId,
          date: today,
          continuousModeEnabled: false,
          completed: false,
          score: null,
          sessionId: sessionId
        };
        
        this.games.set(gameId, newSessionGame);
        this.guesses.set(gameId, []);
        
        return {
          gameId,
          dailyPlayerId: newSessionGame.dailyPlayerId,
          attempts: 0,
          maxAttempts: 6,
          continuousModeEnabled: false,
          completed: false,
          guesses: [],
          nextGameTime: undefined,
        };
      }
      
      // Return existing game state (no session)
      const guesses = this.guesses.get(this.todayGame.id) || [];
      
      return {
        gameId: this.todayGame.id,
        dailyPlayerId: this.todayGame.dailyPlayerId,
        attempts: guesses.length,
        maxAttempts: 6,
        continuousModeEnabled: this.todayGame.continuousModeEnabled,
        completed: this.todayGame.completed,
        guesses: guesses,
        score: this.todayGame.score,
        nextGameTime: this.todayGame.completed ? this.getNextGameTime() : undefined,
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
      sessionId: sessionId || null
    };
    
    this.games.set(gameId, newGame);
    this.guesses.set(gameId, []);
    
    // Only set as todayGame if not session-specific
    if (!sessionId) {
      this.todayGame = newGame;
    }
    
    return {
      gameId,
      dailyPlayerId: dailyPlayer.id,
      attempts: 0,
      maxAttempts: 6,
      continuousModeEnabled: false,
      completed: false,
      guesses: [],
      nextGameTime: undefined,
    };
  }
  
  async getSessionGameState(sessionId: string): Promise<GameStateResponse | undefined> {
    if (!sessionId) {
      return undefined;
    }
    
    // Find a game for this session
    const sessionGame = Array.from(this.games.values()).find(
      (game) => game.sessionId === sessionId
    );
    
    if (!sessionGame) {
      return undefined;
    }
    
    const guesses = this.guesses.get(sessionGame.id) || [];
    
    return {
      gameId: sessionGame.id,
      dailyPlayerId: sessionGame.dailyPlayerId,
      attempts: guesses.length,
      maxAttempts: 6,
      continuousModeEnabled: sessionGame.continuousModeEnabled,
      completed: sessionGame.completed,
      guesses: guesses,
      score: sessionGame.score,
      nextGameTime: sessionGame.completed ? this.getNextGameTime() : undefined,
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

// Create and export the storage instance
// Use PostgreSQL if DATABASE_URL is available, otherwise fall back to memory storage
let storageInstance: IStorage;

try {
  if (process.env.DATABASE_URL) {
    storageInstance = new PostgresStorage();
    console.log("Using PostgreSQL database storage");
  } else {
    throw new Error("DATABASE_URL not set");
  }
} catch (error) {
  console.warn("Failed to initialize PostgreSQL storage, falling back to in-memory storage:", error);
  storageInstance = new MemStorage();
  console.log("Using in-memory storage");
}

export const storage = storageInstance;
