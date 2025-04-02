import { Player, FeedbackResponse } from "@shared/schema";
import { getContinent, getPositionCategory } from "@/lib/utils";

// Compare guessed player with answer player
// Type-safe helper to convert potentially null string to undefined
function nullToUndefined<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

export function comparePlayers(guessedPlayer: Player, answerPlayer: Player): FeedbackResponse {
  const isCorrect = guessedPlayer.id === answerPlayer.id;
  
  // Get continent info
  const guessedContinent = guessedPlayer.continent || 'Unknown';
  const answerContinent = answerPlayer.continent || 'Unknown';
  const sameContinent = guessedContinent === answerContinent;
  
  // Get position category info
  const guessedPositionCategory = guessedPlayer.positionCategory || 'Unknown';
  const answerPositionCategory = answerPlayer.positionCategory || 'Unknown';
  const samePositionCategory = guessedPositionCategory === answerPositionCategory;
  
  // Get league info
  const guessedLeague = guessedPlayer.league || 'Unknown';
  const answerLeague = answerPlayer.league || 'Unknown';
  const sameLeague = guessedLeague === answerLeague;
  
  // Calculate age difference
  const ageDifference = guessedPlayer.age - answerPlayer.age;
  
  // Height comparison
  let heightStatus: 'taller' | 'correct' | 'shorter' = 'correct';
  if (guessedPlayer.height > answerPlayer.height) {
    heightStatus = 'taller';
  } else if (guessedPlayer.height < answerPlayer.height) {
    heightStatus = 'shorter';
  }
  
  // Determine career start comparison
  let careerStartStatus: 'earlier' | 'correct' | 'later' = 'correct';
  if (guessedPlayer.careerStart < answerPlayer.careerStart) {
    careerStartStatus = 'earlier';
  } else if (guessedPlayer.careerStart > answerPlayer.careerStart) {
    careerStartStatus = 'later';
  }
  
  return {
    correct: isCorrect,
    nationality: {
      status: isCorrect ? 'correct' : (sameContinent ? 'same_continent' : 'wrong'),
      value: isCorrect ? guessedPlayer.nationality : (sameContinent ? 'Same continent' : 'Wrong country'),
      flag: isCorrect ? nullToUndefined(guessedPlayer.nationalityImageUrl) : undefined,
    },
    position: {
      status: isCorrect ? 'correct' : (samePositionCategory ? 'same_category' : 'wrong'),
      value: guessedPlayer.position,
    },
    club: {
      status: isCorrect ? 'correct' : (sameLeague ? 'same_league' : 'wrong'),
      value: guessedPlayer.club,
      logo: isCorrect ? nullToUndefined(guessedPlayer.clubImageUrl) : undefined,
    },
    age: {
      difference: ageDifference,
      value: isCorrect ? guessedPlayer.age : undefined,
    },
    height: {
      status: heightStatus,
      value: isCorrect ? guessedPlayer.height : undefined,
    },
    dominantFoot: {
      status: guessedPlayer.dominantFoot === answerPlayer.dominantFoot ? 'correct' : 'wrong',
      value: guessedPlayer.dominantFoot,
    },
    careerStart: {
      status: careerStartStatus,
      value: isCorrect ? guessedPlayer.careerStart : undefined,
    },
    guessedPlayer: {
      id: guessedPlayer.id,
      name: guessedPlayer.name,
      nationality: guessedPlayer.nationality,
      club: guessedPlayer.club,
      imageUrl: nullToUndefined(guessedPlayer.imageUrl),
    },
    timestamp: new Date().toISOString(),
  };
}
