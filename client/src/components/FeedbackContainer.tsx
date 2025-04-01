import { useGameStore } from "@/store/gameStore";
import { formatDistanceToNow } from "date-fns";
import { CheckIcon, XIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

export default function FeedbackContainer() {
  const { guesses } = useGameStore();
  
  if (guesses.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 mb-8">
      {guesses.map((guess, index) => (
        <GuessCard 
          key={index} 
          guess={guess} 
          index={index}
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
    <div className={`p-5 rounded-lg shadow-md guess-result-animate ${
      isCorrect 
        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500" 
        : "bg-white"
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold text-lg ${isCorrect ? "text-green-800" : ""}`}>
          {isCorrect ? `Guess #${index + 1} - Correct!` : `Guess #${index + 1}`}
        </h3>
        <span className="text-slate-500 text-sm">
          {formatTimeAgo(guess.timestamp)}
        </span>
      </div>
      
      <div className="flex items-center gap-3 mb-5">
        {guess.guessedPlayer.imageUrl ? (
          <img 
            src={guess.guessedPlayer.imageUrl} 
            alt={guess.guessedPlayer.name} 
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-xl font-bold text-slate-600">
            {guess.guessedPlayer.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-bold">{guess.guessedPlayer.name}</div>
          <div className="text-sm text-slate-600">
            {guess.guessedPlayer.club}, {guess.guessedPlayer.nationality}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Nationality */}
        <FeedbackItem 
          title="Nationality"
          status={guess.nationality.status}
          value={guess.nationality.status === "correct" && guess.nationality.flag 
            ? <img src={guess.nationality.flag} alt={guess.nationality.value} className="w-6 h-6 rounded-full object-cover" /> 
            : guess.nationality.value
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
          value={guess.club.status === "correct" && guess.club.logo 
            ? <img src={guess.club.logo} alt={guess.club.value} className="w-6 h-6 rounded-full object-cover" /> 
            : guess.club.value
          }
        />
        
        {/* Age */}
        <div className={`${isCorrect ? "bg-white" : "bg-slate-100"} p-3 rounded-lg`}>
          <div className="text-xs text-slate-500 mb-1">Age</div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {guess.age.difference === 0 
                ? guess.age.value 
                : (guess.age.difference > 0 
                    ? `+${guess.age.difference}` 
                    : `${guess.age.difference}`
                  ) + " years"
              }
            </span>
          </div>
        </div>
        
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
  
  if (status === "correct") {
    icon = <CheckIcon className="h-4 w-4" />;
    bgColor = "bg-success";
    textColor = "text-white";
  } else if (status === "same_continent" || status === "same_category" || status === "same_league") {
    icon = <ChevronUpIcon className="h-4 w-4" />;
    bgColor = "bg-warning";
    textColor = "text-white";
  } else if (status === "wrong") {
    icon = <XIcon className="h-4 w-4" />;
    bgColor = "bg-error";
    textColor = "text-white";
  } else if (status === "taller") {
    icon = <ChevronUpIcon className="h-4 w-4" />;
  } else if (status === "shorter") {
    icon = <ChevronDownIcon className="h-4 w-4" />;
  }
  
  return (
    <div className={`${status === "correct" ? "bg-white" : "bg-slate-100"} p-3 rounded-lg`}>
      <div className="text-xs text-slate-500 mb-1">{title}</div>
      <div className="flex items-center gap-2">
        {icon && (
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${bgColor} ${textColor} text-xs`}>
            {icon}
          </span>
        )}
        <span className="font-medium">{value}</span>
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
