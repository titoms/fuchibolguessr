import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

// Check for DATABASE_URL environment variable
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

// Create a postgres client with the connection string
const client = postgres(process.env.DATABASE_URL);

// Create a drizzle instance with the postgres client
export const db = drizzle(client, { schema });

// Export for direct use
export { schema };