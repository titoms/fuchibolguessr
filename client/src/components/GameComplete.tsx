import { Share2Icon, CalendarIcon } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function GameComplete() {
  const { guesses, score } = useGameStore();
  const attemptCount = guesses.length;
  const { toast } = useToast();
  
  // Calculate percentage compared to other players (mock data for now)
  const percentageBetter = Math.floor(Math.random() * 100);
  
  const handleShare = async () => {
    // Create shareable text
    const shareText = `I guessed today's FootballGuesser player in ${attemptCount} attempts with a score of ${score}! Can you beat that?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'FootballGuesser Result',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Share your result with friends!",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Failed to share",
        description: "Could not share your result",
        variant: "destructive",
      });
    }
  };
  
  const handleComeTomorrow = () => {
    // Simply reload the page - this is just a UI element
    window.location.reload();
  };
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6 border-2 border-accent">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
        <p className="text-slate-600">
          You guessed the player in <span className="font-semibold">{attemptCount}</span> attempts
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg mb-6">
        <div className="text-sm text-slate-500 mb-2">Your efficiency score</div>
        <div className="text-5xl font-bold text-accent mb-2">{score}</div>
        <div className="text-xs text-slate-400">
          Better than {percentageBetter}% of players today
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Share2Icon className="h-5 w-5" />
          Share Result
        </Button>
        <Button
          onClick={handleComeTomorrow}
          variant="outline" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <CalendarIcon className="h-5 w-5" />
          Come Back Tomorrow
        </Button>
      </div>
    </div>
  );
}
