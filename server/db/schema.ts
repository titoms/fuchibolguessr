import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  timestamp, 
  boolean, 
  json 
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Players table
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

// Game sessions table
export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  dailyPlayerId: integer("daily_player_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  continuousModeEnabled: boolean("continuous_mode_enabled").notNull().default(false),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  sessionId: text("session_id"),
});

// Guesses table - stores player guesses for each game
export const guesses = pgTable("guesses", {
  id: serial("id").primaryKey(),
  gameSessionId: integer("game_session_id").notNull(),
  feedbackData: json("feedback_data").notNull(), // Store the entire feedback JSON
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});