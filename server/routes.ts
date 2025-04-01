import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { guessSchema, playerSearchSchema } from "@shared/schema";
import { z } from "zod";
import { getRandomInt, calculateScore } from "@/lib/utils";
import { comparePlayers } from "./utils";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // API Routes
  
  // Get player search results
  app.get("/api/players/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 3) {
        return res.status(400).json({ message: "Search query must be at least 3 characters" });
      }
      
      const players = await storage.searchPlayers(query);
      
      // Map to the search result schema
      const results = players.map(player => ({
        id: player.id,
        name: player.name,
        nationality: player.nationality,
        club: player.club,
        imageUrl: player.imageUrl,
      }));
      
      res.json(results);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to search players" });
    }
  });
  
  // Get current game state
  app.get("/api/game/state", async (req, res) => {
    try {
      // Get or initialize today's game
      const gameState = await storage.getOrCreateGameState();
      res.json(gameState);
    } catch (error) {
      console.error("Game state error:", error);
      res.status(500).json({ message: "Failed to get game state" });
    }
  });
  
  // Submit a guess
  app.post("/api/game/guess", async (req, res) => {
    try {
      // Validate request body
      const validatedData = guessSchema.parse(req.body);
      
      // Get current game state
      const gameState = await storage.getOrCreateGameState();
      
      // Check if game is already completed
      if (gameState.completed) {
        return res.status(400).json({ message: "Game is already completed" });
      }
      
      // Check if player has attempts left
      if (!gameState.continuousModeEnabled && gameState.attempts >= gameState.maxAttempts) {
        return res.status(400).json({ message: "No attempts left" });
      }
      
      // Get the guessed player
      const guessedPlayer = await storage.getPlayer(validatedData.playerId);
      if (!guessedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Get the answer player
      const answerPlayer = await storage.getPlayer(gameState.dailyPlayerId);
      if (!answerPlayer) {
        return res.status(500).json({ message: "Answer player not found" });
      }
      
      // Compare players and get feedback
      const feedback = comparePlayers(guessedPlayer, answerPlayer);
      
      // Update game state
      await storage.recordGuess(gameState.gameId, feedback);
      
      // Check if guess is correct and update game state if needed
      if (feedback.correct) {
        const score = calculateScore(gameState.attempts + 1, gameState.maxAttempts);
        await storage.completeGame(gameState.gameId, score);
      }
      
      res.json(feedback);
    } catch (error) {
      console.error("Guess error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guess data", errors: error.errors });
      }
      
      res.status(500).json({ message: "Failed to process guess" });
    }
  });
  
  // Enable continuous mode
  app.post("/api/game/continuous-mode", async (req, res) => {
    try {
      // Get current game state
      const gameState = await storage.getOrCreateGameState();
      
      // Check if the player has used all their attempts
      if (gameState.attempts < gameState.maxAttempts) {
        return res.status(400).json({ message: "You still have attempts left" });
      }
      
      // Check if game is completed
      if (gameState.completed) {
        return res.status(400).json({ message: "Game is already completed" });
      }
      
      // Enable continuous mode
      await storage.enableContinuousMode(gameState.gameId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Continuous mode error:", error);
      res.status(500).json({ message: "Failed to enable continuous mode" });
    }
  });

  return httpServer;
}
