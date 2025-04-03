import { useGameStore } from "@/store/gameStore";
import { formatDistanceToNow } from "date-fns";
import { CheckIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

export default function FeedbackContainer() {
  const { guesses } = useGameStore();
  
  if (guesses.length === 0) {
    return null;
  }
  
  // Reverse guesses array to show the newest guess on top
  const sortedGuesses = [...guesses].reverse();
  
  return (
    <div className="space-y-3 mb-8">
      {sortedGuesses.map((guess, index) => (
        <GuessCard 
          key={index} 
          guess={guess} 
          index={guesses.length - index - 1}
        />
      ))}
    </div>
  );
}

interface GuessCardProps {
  guess: any;
  index: number;
}

function GuessCard({ guess, index }: GuessCardProps) {
  const isCorrect = guess.correct;
  
  return (
    <div className={`p-3 rounded-lg shadow-md guess-result-animate ${
      isCorrect 
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500" 
        : "bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400"
    }`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-semibold text-base ${isCorrect ? "text-green-800" : "text-red-800"}`}>
          {isCorrect ? `Guess #${index + 1} - Correct!` : `Guess #${index + 1}`}
        </h3>
        <span className="text-slate-500 text-xs">
          {formatTimeAgo(guess.timestamp)}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        {guess.guessedPlayer.imageUrl ? (
          <img 
            src={guess.guessedPlayer.imageUrl} 
            alt={guess.guessedPlayer.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-lg font-bold text-slate-600">
            {guess.guessedPlayer.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-bold text-sm">{guess.guessedPlayer.name}</div>
          <div className="text-xs text-slate-600">
            {guess.guessedPlayer.club}, {guess.guessedPlayer.nationality}
          </div>
        </div>
      </div>
      
      {/* Changed to 3 columns by default, 6 columns on larger screens */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {/* Nationality */}
        <FeedbackItem 
          title="Nationality"
          status={guess.nationality.status}
          value={
            <div className="flex items-center gap-1">
              {guess.nationality.flag ? (
                <img src={guess.nationality.flag} alt={guess.nationality.value} className="w-5 h-5 rounded-full object-cover border border-gray-300" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">🏳️</div>
              )}
              <span>{guess.nationality.value}</span>
            </div>
          }
        />
        
        {/* Position */}
        <FeedbackItem 
          title="Position"
          status={guess.position.status}
          value={guess.position.value}
        />
        
        {/* Current club */}
        <FeedbackItem 
          title="Current club"
          status={guess.club.status}
          value={
            <div className="flex items-center gap-1">
              {guess.club.logo ? (
                <img src={guess.club.logo} alt={guess.club.value} className="w-5 h-5 rounded-full object-cover border border-gray-300" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xs">⚽</div>
              )}
              <span>{guess.club.value}</span>
            </div>
          }
        />
        
        {/* Age */}
        <FeedbackItem 
          title="Age"
          status={guess.age.difference === 0 ? "correct" : "wrong"}
          value={guess.age.difference === 0 
            ? guess.age.value 
            : (guess.age.difference > 0 
                ? `+${guess.age.difference}` 
                : `${guess.age.difference}`
              ) + " years"
          }
        />
        
        {/* Height */}
        <FeedbackItem 
          title="Height"
          status={guess.height.status}
          value={guess.height.status === "correct" 
            ? `${guess.height.value} cm` 
            : guess.height.status === "taller" 
              ? "Taller" 
              : "Shorter"
          }
          useHeightIcon={guess.height.status !== "correct"}
        />
        
        {/* Dominant foot */}
        <FeedbackItem 
          title="Dominant foot"
          status={guess.dominantFoot.status}
          value={guess.dominantFoot.value}
        />
      </div>
    </div>
  );
}

interface FeedbackItemProps {
  title: string;
  status: string;
  value: React.ReactNode;
  useHeightIcon?: boolean;
}

function FeedbackItem({ title, status, value, useHeightIcon = false }: FeedbackItemProps) {
  // Determine the status icon and color
  let icon;
  let bgColor = "bg-slate-300";
  let textColor = "text-slate-700";
  let containerBgColor = "";
  
  if (status === "correct") {
    icon = <CheckIcon className="h-4 w-4" />;
    bgColor = "bg-success";
    textColor = "text-white";
    containerBgColor = "bg-green-50";
  } else if (status === "same_continent" || status === "same_category" || status === "same_league") {
    icon = <ChevronUpIcon className="h-4 w-4" />;
    bgColor = "bg-warning";
    textColor = "text-white";
    containerBgColor = "bg-yellow-50";
  } else if (status === "wrong") {
    icon = <XIcon className="h-4 w-4" />;
    bgColor = "bg-error";
    textColor = "text-white";
    containerBgColor = "bg-red-50";
  } else if (status === "taller") {
    icon = <ChevronUpIcon className="h-4 w-4" />;
    containerBgColor = "bg-gray-100";
  } else if (status === "shorter") {
    icon = <ChevronDownIcon className="h-4 w-4" />;
    containerBgColor = "bg-gray-100";
  }
  
  return (
    <div className={`${containerBgColor} p-2 rounded-lg text-xs`}>
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="flex items-center gap-1">
        {icon && (
          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${bgColor} ${textColor} text-xs`}>
            {icon}
          </span>
        )}
        <span className="font-medium truncate">{value}</span>
      </div>
    </div>
  );
}

// Helper function to format timestamp
function formatTimeAgo(timestamp: string) {
  try {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return "Just now";
  }
}
