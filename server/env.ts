// server/env.ts
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

// Path to the .env file in the root directory
const envPath = resolve(rootDir, '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  const result = config({ path: envPath });
  
  if (result.error) {
    console.error('Error loading .env file:', result.error);
  } else {
    console.log('Environment variables loaded successfully');
  }
} else {
  console.warn(`.env file not found at ${envPath}`);
}

// Verify DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set!');
  console.log('Available environment variables:', Object.keys(process.env).join(', '));
}

export default process.env;