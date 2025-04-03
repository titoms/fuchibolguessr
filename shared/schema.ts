import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (maintaining the existing schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Football Players table
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nationality: text("nationality").notNull(),
  continent: text("continent").notNull(),
  position: text("position").notNull(), // e.g., "Forward", "Midfielder", "Defender", "Goalkeeper"
  positionCategory: text("position_category").notNull(), // e.g., "Attack", "Midfield", "Defense"
  club: text("club").notNull(),
  league: text("league").notNull(),
  age: integer("age").notNull(),
  height: integer("height").notNull(), // in cm
  dominantFoot: text("dominant_foot").notNull(), // "Left" or "Right"
  isActive: boolean("is_active").notNull().default(true),
  careerStart: integer("career_start").notNull(), // Year career started
  careerEnd: integer("career_end"), // Year career ended (null if still active)
  imageUrl: text("image_url"), // URL to player's image
  clubImageUrl: text("club_image_url"), // URL to club's logo
  nationalityImageUrl: text("nationality_image_url"), // URL to country's flag
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;

// Game session table
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  dailyPlayerId: integer("daily_player_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  continuousModeEnabled: boolean("continuous_mode_enabled").notNull().default(false),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  sessionId: text("session_id"),
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
});

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

// Guesses table
export const guesses = pgTable("guesses", {
  id: serial("id").primaryKey(),
  gameSessionId: integer("game_session_id").notNull(),
  feedbackData: json("feedback_data").notNull(), // Store the entire feedback JSON
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertGuessSchema = createInsertSchema(guesses).omit({
  id: true,
});

export type InsertGuess = z.infer<typeof insertGuessSchema>;
export type Guess = typeof guesses.$inferSelect;

// Game guess schema for API communication
export const guessSchema = z.object({
  playerId: z.number(),
});

export type GuessRequest = z.infer<typeof guessSchema>;

// Feedback response schema
export const feedbackSchema = z.object({
  correct: z.boolean(),
  nationality: z.object({
    status: z.enum(["correct", "same_continent", "wrong"]),
    value: z.string().optional(),
    flag: z.string().optional(),
  }),
  position: z.object({
    status: z.enum(["correct", "same_category", "wrong"]),
    value: z.string(),
  }),
  club: z.object({
    status: z.enum(["correct", "same_league", "wrong"]),
    value: z.string(),
    logo: z.string().optional(),
  }),
  age: z.object({
    difference: z.number(),
    value: z.number().optional(),
  }),
  height: z.object({
    status: z.enum(["taller", "correct", "shorter"]),
    value: z.number().optional(),
  }),
  dominantFoot: z.object({
    status: z.enum(["correct", "wrong"]),
    value: z.string(),
  }),
  careerStart: z.object({
    status: z.enum(["earlier", "correct", "later"]),
    value: z.number().optional(),
  }),
  guessedPlayer: z.object({
    id: z.number(),
    name: z.string(),
    nationality: z.string(),
    club: z.string(),
    imageUrl: z.string().optional(),
  }),
  timestamp: z.string(),
});

export type FeedbackResponse = z.infer<typeof feedbackSchema>;

// Game state schema for API communication
export const gameStateSchema = z.object({
  gameId: z.number(),
  dailyPlayerId: z.number(),
  attempts: z.number(),
  maxAttempts: z.number(),
  continuousModeEnabled: z.boolean(),
  completed: z.boolean(),
  guesses: z.array(feedbackSchema),
  score: z.number().optional(),
  nextGameTime: z.string().optional(),
});

export type GameStateResponse = z.infer<typeof gameStateSchema>;

// Player search schema
export const playerSearchSchema = z.object({
  id: z.number(),
  name: z.string(),
  nationality: z.string(),
  club: z.string(),
  imageUrl: z.string().optional(),
});

export type PlayerSearchResult = z.infer<typeof playerSearchSchema>;
