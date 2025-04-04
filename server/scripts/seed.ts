import { db } from "../db";
import { players } from "@shared/schema";
import { playerData } from "../data/players";
import { getContinent, getPositionCategory } from "@/lib/utils";

/**
 * Seed script to populate the database with player data
 * Run with: npx tsx server/scripts/seed.ts
 */
async function seed() {
  console.log("Starting database seed...");

  try {
    // Check if we already have players in the database
    const existingPlayers = await db.select().from(players);
    
    if (existingPlayers.length > 0) {
      console.log(`Database already contains ${existingPlayers.length} players. Skipping seed.`);
      console.log("To reset data, run 'npx drizzle-kit drop' followed by 'npx drizzle-kit push' before seeding again.");
      return;
    }

    // Process player data - add continent and position category
    const enrichedPlayerData = playerData.map(player => {
      return {
        ...player,
        continent: getContinent(player.nationality),
        positionCategory: getPositionCategory(player.position)
      };
    });

    // Insert players into the database
    const insertedPlayers = await db.insert(players).values(enrichedPlayerData).returning();
    
    console.log(`Successfully inserted ${insertedPlayers.length} players into the database`);
    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });