// Translation file for Football Player Guessing Game
// You can edit this file to update translations

export type Language = 'en' | 'fr' | 'es';

export interface Translation {
  // Language metadata
  languageName: string;
  flag: string;

  // Game interface elements
  gameName: string;
  guessThePlayer: string;
  attempts: string;
  searchPlaceholder: string;
  guessButton: string;
  correctGuess: string;
  incorrectGuess: string;
  gameComplete: string;
  playAgain: string;
  nextGame: string;
  continuousMode: string;
  loading: string;
  settings: string;
  help: string;
  
  // Feedback elements 
  nationality: string;
  position: string;
  club: string;
  age: string;
  height: string;
  dominantFoot: string;
  careerStart: string;
  years: string;
  cm: string;
  
  // Feedback statuses
  correct: string;
  wrong: string;
  sameContinent: string;
  sameCategory: string;
  sameLeague: string;
  taller: string;
  shorter: string;
  earlier: string;
  later: string;
  
  // Settings and help content
  theme: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  language: string;
  howToPlay: string;
  rules: string;
  rule1: string;
  rule2: string;
  rule3: string;
  rule4: string;
  rule5: string;
  closeButton: string;
  
  // Game info component
  todaysChallenge: string;
  nextChallenge: string;
  outOfAttempts: string;
  continuousModePrompt: string;
  continuePlaying: string;
  
  // Game complete component
  congratulations: string;
  guessedIn: string;
  yourScore: string;
  betterThan: string;
  shareResult: string;
  shareText: string;
  shareTitle: string;
  copiedToClipboard: string;
  shareWithFriends: string;
  failedToShare: string;
  couldNotShare: string;
  comeBackTomorrow: string;
}

export const translations: Record<Language, Translation> = {
  // English translations
  en: {
    languageName: 'English',
    flag: '🇬🇧',
    
    gameName: 'Football Player Guessing Game',
    guessThePlayer: 'Guess today\'s mystery player!',
    attempts: 'Attempts',
    searchPlaceholder: 'Search for a player...',
    guessButton: 'Make Guess',
    correctGuess: 'Correct!',
    incorrectGuess: 'Try again!',
    gameComplete: 'Game Complete!',
    playAgain: 'Play Again',
    nextGame: 'Next game in',
    continuousMode: 'Continuous Mode',
    loading: 'Loading...',
    settings: 'Settings',
    help: 'How to Play',
    
    nationality: 'Nationality',
    position: 'Position',
    club: 'Club',
    age: 'Age',
    height: 'Height',
    dominantFoot: 'Dominant Foot',
    careerStart: 'Career Start',
    years: 'years',
    cm: 'cm',
    
    correct: 'Correct',
    wrong: 'Wrong',
    sameContinent: 'Same Continent',
    sameCategory: 'Same Category',
    sameLeague: 'Same League',
    taller: 'Taller',
    shorter: 'Shorter',
    earlier: 'Earlier',
    later: 'Later',
    
    theme: 'Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    systemMode: 'System',
    language: 'Language',
    howToPlay: 'How to Play',
    rules: 'Rules',
    rule1: 'Guess the mystery footballer in as few attempts as possible.',
    rule2: 'After each guess, you\'ll receive feedback on how close you are.',
    rule3: 'Green indicators show correct attributes, yellow shows partial matches.',
    rule4: 'Arrows indicate if the mystery player is taller/shorter or started earlier/later.',
    rule5: 'You have 8 attempts to guess correctly.',
    closeButton: 'Close',
    
    // Game info component
    todaysChallenge: 'Today\'s Challenge',
    nextChallenge: 'Next challenge in',
    outOfAttempts: 'Out of attempts?',
    continuousModePrompt: 'Switch to continuous mode for unlimited tries',
    continuePlaying: 'Continue Playing',
    
    // Game complete component
    congratulations: 'Congratulations!',
    guessedIn: 'You guessed the player in {attempts} attempts',
    yourScore: 'Your efficiency score',
    betterThan: 'Better than {percent}% of players today',
    shareResult: 'Share Result',
    shareText: 'I guessed today\'s FootballGuesser player in {attempts} attempts with a score of {score}! Can you beat that?',
    shareTitle: 'FootballGuesser Result',
    copiedToClipboard: 'Copied to clipboard',
    shareWithFriends: 'Share your result with friends!',
    failedToShare: 'Failed to share',
    couldNotShare: 'Could not share your result',
    comeBackTomorrow: 'Come Back Tomorrow'
  },
  
  // French translations
  fr: {
    languageName: 'Français',
    flag: '🇫🇷',
    
    gameName: 'Jeu de Devinettes de Footballeur',
    guessThePlayer: 'Devinez le joueur mystère du jour !',
    attempts: 'Essais',
    searchPlaceholder: 'Rechercher un joueur...',
    guessButton: 'Deviner',
    correctGuess: 'Correct !',
    incorrectGuess: 'Essayez encore !',
    gameComplete: 'Jeu Terminé !',
    playAgain: 'Rejouer',
    nextGame: 'Prochain jeu dans',
    continuousMode: 'Mode Continu',
    loading: 'Chargement...',
    settings: 'Paramètres',
    help: 'Comment Jouer',
    
    nationality: 'Nationalité',
    position: 'Poste',
    club: 'Club',
    age: 'Âge',
    height: 'Taille',
    dominantFoot: 'Pied Dominant',
    careerStart: 'Début de Carrière',
    years: 'ans',
    cm: 'cm',
    
    correct: 'Correct',
    wrong: 'Incorrect',
    sameContinent: 'Même Continent',
    sameCategory: 'Même Catégorie',
    sameLeague: 'Même Ligue',
    taller: 'Plus Grand',
    shorter: 'Plus Petit',
    earlier: 'Plus Tôt',
    later: 'Plus Tard',
    
    theme: 'Thème',
    lightMode: 'Clair',
    darkMode: 'Sombre',
    systemMode: 'Système',
    language: 'Langue',
    howToPlay: 'Comment Jouer',
    rules: 'Règles',
    rule1: 'Devinez le footballeur mystère en aussi peu d\'essais que possible.',
    rule2: 'Après chaque essai, vous recevrez des indices sur votre proximité.',
    rule3: 'Les indicateurs verts montrent les attributs corrects, les jaunes montrent les correspondances partielles.',
    rule4: 'Les flèches indiquent si le joueur mystère est plus grand/petit ou a commencé plus tôt/tard.',
    rule5: 'Vous avez 8 tentatives pour deviner correctement.',
    closeButton: 'Fermer',
    
    // Game info component
    todaysChallenge: 'Le Défi du Jour',
    nextChallenge: 'Prochain défi dans',
    outOfAttempts: 'Plus de tentatives ?',
    continuousModePrompt: 'Passez en mode continu pour des essais illimités',
    continuePlaying: 'Continuer à Jouer',
    
    // Game complete component
    congratulations: 'Félicitations !',
    guessedIn: 'Vous avez deviné le joueur en {attempts} tentatives',
    yourScore: 'Votre score d\'efficacité',
    betterThan: 'Meilleur que {percent}% des joueurs aujourd\'hui',
    shareResult: 'Partager le Résultat',
    shareText: 'J\'ai deviné le joueur du jour de FootballGuesser en {attempts} tentatives avec un score de {score} ! Pouvez-vous faire mieux ?',
    shareTitle: 'Résultat FootballGuesser',
    copiedToClipboard: 'Copié dans le presse-papiers',
    shareWithFriends: 'Partagez votre résultat avec vos amis !',
    failedToShare: 'Échec du partage',
    couldNotShare: 'Impossible de partager votre résultat',
    comeBackTomorrow: 'Revenir Demain'
  },
  
  // Spanish translations
  es: {
    languageName: 'Español',
    flag: '🇪🇸',
    
    gameName: 'Juego de Adivinar Futbolistas',
    guessThePlayer: '¡Adivina el jugador misterioso de hoy!',
    attempts: 'Intentos',
    searchPlaceholder: 'Buscar un jugador...',
    guessButton: 'Adivinar',
    correctGuess: '¡Correcto!',
    incorrectGuess: '¡Inténtalo de nuevo!',
    gameComplete: '¡Juego Completado!',
    playAgain: 'Jugar de Nuevo',
    nextGame: 'Próximo juego en',
    continuousMode: 'Modo Continuo',
    loading: 'Cargando...',
    settings: 'Configuración',
    help: 'Cómo Jugar',
    
    nationality: 'Nacionalidad',
    position: 'Posición',
    club: 'Club',
    age: 'Edad',
    height: 'Altura',
    dominantFoot: 'Pie Dominante',
    careerStart: 'Inicio de Carrera',
    years: 'años',
    cm: 'cm',
    
    correct: 'Correcto',
    wrong: 'Incorrecto',
    sameContinent: 'Mismo Continente',
    sameCategory: 'Misma Categoría',
    sameLeague: 'Misma Liga',
    taller: 'Más Alto',
    shorter: 'Más Bajo',
    earlier: 'Más Temprano',
    later: 'Más Tarde',
    
    theme: 'Tema',
    lightMode: 'Claro',
    darkMode: 'Oscuro',
    systemMode: 'Sistema',
    language: 'Idioma',
    howToPlay: 'Cómo Jugar',
    rules: 'Reglas',
    rule1: 'Adivina el futbolista misterioso en la menor cantidad de intentos posible.',
    rule2: 'Después de cada intento, recibirás pistas sobre qué tan cerca estás.',
    rule3: 'Los indicadores verdes muestran atributos correctos, los amarillos muestran coincidencias parciales.',
    rule4: 'Las flechas indican si el jugador misterioso es más alto/bajo o comenzó antes/después.',
    rule5: 'Tienes 8 intentos para adivinar correctamente.',
    closeButton: 'Cerrar',
    
    // Game info component
    todaysChallenge: 'El Desafío de Hoy',
    nextChallenge: 'Próximo desafío en',
    outOfAttempts: '¿Sin intentos?',
    continuousModePrompt: 'Cambia al modo continuo para intentos ilimitados',
    continuePlaying: 'Continuar Jugando',
    
    // Game complete component
    congratulations: '¡Felicidades!',
    guessedIn: 'Adivinaste al jugador en {attempts} intentos',
    yourScore: 'Tu puntuación de eficiencia',
    betterThan: 'Mejor que el {percent}% de los jugadores hoy',
    shareResult: 'Compartir Resultado',
    shareText: '¡Adiviné el jugador de FootballGuesser hoy en {attempts} intentos con una puntuación de {score}! ¿Puedes superarlo?',
    shareTitle: 'Resultado de FootballGuesser',
    copiedToClipboard: 'Copiado al portapapeles',
    shareWithFriends: '¡Comparte tu resultado con amigos!',
    failedToShare: 'Error al compartir',
    couldNotShare: 'No se pudo compartir tu resultado',
    comeBackTomorrow: 'Vuelve Mañana'
  }
};

// Utility function to get country flag emoji
export function getCountryFlag(countryCode: string): string {
  const flagEmojis: Record<string, string> = {
    'Argentina': '🇦🇷',
    'Brazil': '🇧🇷',
    'England': '🇬🇧',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Norway': '🇳🇴',
    'Poland': '🇵🇱',
    'Portugal': '🇵🇹',
    'Spain': '🇪🇸',
    'Belgium': '🇧🇪',
    'Croatia': '🇭🇷',
    'Egypt': '🇪🇬',
    'Senegal': '🇸🇳',
    'Uruguay': '🇺🇾',
    'Sweden': '🇸🇪',
    'Denmark': '🇩🇰',
    'Switzerland': '🇨🇭',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'USA': '🇺🇸',
    'Canada': '🇨🇦',
    'Mexico': '🇲🇽',
    'Australia': '🇦🇺',
    // Add more countries as needed
  };
  
  return flagEmojis[countryCode] || '🏳️';
}