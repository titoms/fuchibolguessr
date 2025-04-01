import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate random integer between min and max (inclusive)
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Calculate scoring based on attempts
export function calculateScore(attempts: number, maxAttempts: number): number {
  // Base score for guessing correctly
  let baseScore = 100;
  
  // Penalize for each attempt (more attempts = lower score)
  const penaltyPerAttempt = 100 / maxAttempts;
  
  // Calculate final score
  let finalScore = Math.max(0, baseScore - ((attempts - 1) * penaltyPerAttempt));
  
  // Bonus for guessing on first try
  if (attempts === 1) {
    finalScore = 100;
  }
  
  return Math.round(finalScore);
}

// Compare two dates to see if they're the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Get continent based on country
export function getContinent(country: string): string {
  const continentMap: { [key: string]: string } = {
    // Europe
    'England': 'Europe',
    'Spain': 'Europe',
    'France': 'Europe',
    'Germany': 'Europe',
    'Italy': 'Europe',
    'Portugal': 'Europe',
    'Netherlands': 'Europe',
    'Belgium': 'Europe',
    'Croatia': 'Europe',
    'Wales': 'Europe',
    'Scotland': 'Europe',
    'Norway': 'Europe',
    'Sweden': 'Europe',
    'Denmark': 'Europe',
    'Switzerland': 'Europe',
    'Austria': 'Europe',
    'Poland': 'Europe',
    'Ukraine': 'Europe',
    'Russia': 'Europe',
    'Serbia': 'Europe',
    'Greece': 'Europe',
    
    // South America
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Uruguay': 'South America',
    'Colombia': 'South America',
    'Chile': 'South America',
    'Peru': 'South America',
    'Ecuador': 'South America',
    'Venezuela': 'South America',
    'Paraguay': 'South America',
    
    // North America
    'United States': 'North America',
    'Mexico': 'North America',
    'Canada': 'North America',
    'Jamaica': 'North America',
    'Costa Rica': 'North America',
    
    // Africa
    'Senegal': 'Africa',
    'Egypt': 'Africa',
    'Morocco': 'Africa',
    'Nigeria': 'Africa',
    'Ghana': 'Africa',
    'Cameroon': 'Africa',
    'Ivory Coast': 'Africa',
    'Algeria': 'Africa',
    
    // Asia
    'Japan': 'Asia',
    'South Korea': 'Asia',
    'China': 'Asia',
    'Iran': 'Asia',
    'Saudi Arabia': 'Asia',
    'Qatar': 'Asia',
    'Australia': 'Asia', // FIFA classification
    
    // Default
    'Unknown': 'Unknown',
  };
  
  return continentMap[country] || 'Unknown';
}

// Get position category based on specific position
export function getPositionCategory(position: string): string {
  if (['Forward', 'Striker', 'Center-Forward', 'Winger'].includes(position)) {
    return 'Attack';
  } else if (['Midfielder', 'Central Midfielder', 'Defensive Midfielder', 'Attacking Midfielder'].includes(position)) {
    return 'Midfield';
  } else if (['Defender', 'Center-Back', 'Full-Back', 'Left-Back', 'Right-Back'].includes(position)) {
    return 'Defense';
  } else if (position === 'Goalkeeper') {
    return 'Goalkeeper';
  } else {
    return 'Unknown';
  }
}
