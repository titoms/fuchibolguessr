import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { guessSchema, playerSearchSchema, GameStateResponse } from "@shared/schema";
import { z } from "zod";
import { getRandomInt, calculateScore } from "@/lib/utils";
import { comparePlayers } from "./utils";

// Type augmentation to add session properties
declare module 'express-session' {
  interface SessionData {
    gameState?: GameStateResponse;
    sessionId?: string;
  }
}

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
      // Ensure the session has a unique ID
      if (!req.session.sessionId) {
        req.session.sessionId = Math.random().toString(36).substring(2, 15) + 
                               Math.random().toString(36).substring(2, 15);
      }
      
      // Check if we already have a game state for this session
      if (!req.session.gameState) {
        // Get or initialize today's game with a session ID
        const gameState = await storage.getOrCreateGameState(req.session.sessionId);
        req.session.gameState = gameState;
      } else {
        // Refresh the game state from storage to get the latest data
        const refreshedState = await storage.getSessionGameState(req.session.sessionId);
        if (refreshedState) {
          req.session.gameState = refreshedState;
        }
      }
      
      res.json(req.session.gameState);
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
      
      // Check if session exists
      if (!req.session.sessionId || !req.session.gameState) {
        return res.status(400).json({ message: "No active game session. Please refresh the page." });
      }
      
      const gameState = req.session.gameState;
      
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
      
      // Update session state
      const updatedGameState = await storage.getSessionGameState(req.session.sessionId);
      if (updatedGameState) {
        req.session.gameState = updatedGameState;
      }
      
      // Check if guess is correct and update game state if needed
      if (feedback.correct) {
        const score = calculateScore(gameState.attempts + 1, gameState.maxAttempts);
        await storage.completeGame(gameState.gameId, score);
        
        // Get the final updated state
        const finalGameState = await storage.getSessionGameState(req.session.sessionId);
        if (finalGameState) {
          req.session.gameState = finalGameState;
        }
      }
      
      res.json(feedback);
    } catch (error) {
      console.error("Guess error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid guess data", errors: error.errors });
      }
      
      res.status(500).json({ 
        message: "Failed to process guess",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // Enable continuous mode
  app.post("/api/game/continuous-mode", async (req, res) => {
    try {
      // Check if session exists
      if (!req.session.sessionId || !req.session.gameState) {
        return res.status(400).json({ message: "No active game session. Please refresh the page." });
      }
      
      const gameState = req.session.gameState;
      
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
      
      // Update session state
      const updatedGameState = await storage.getSessionGameState(req.session.sessionId);
      if (updatedGameState) {
        req.session.gameState = updatedGameState;
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Continuous mode error:", error);
      res.status(500).json({ message: "Failed to enable continuous mode" });
    }
  });

  return httpServer;
}
