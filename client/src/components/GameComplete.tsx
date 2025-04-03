import { Share2Icon, CalendarIcon } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function GameComplete() {
  const { guesses, score } = useGameStore();
  const attemptCount = guesses.length;
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Calculate percentage compared to other players (mock data for now)
  const percentageBetter = Math.floor(Math.random() * 100);
  
  const handleShare = async () => {
    // Create shareable text
    let shareText = `I guessed today's player in ${attemptCount} attempts with a score of ${score || 0}! Can you beat that?`;
    
    // Use translation if available
    if (t.shareText) {
      shareText = t.shareText
        .replace('{attempts}', attemptCount.toString())
        .replace('{score}', score?.toString() || '0');
    }
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: t.shareTitle || 'Football Player Guessing Game Result',
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: t.copiedToClipboard || 'Copied to clipboard',
          description: t.shareWithFriends || 'Share your result with friends!',
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: t.failedToShare || 'Failed to share',
        description: t.couldNotShare || 'Could not share your result',
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
        <h2 className="text-2xl font-bold text-primary mb-2">{t.congratulations}</h2>
        <p className="text-slate-600">
          {t.guessedIn && t.guessedIn.replace('{attempts}', String(attemptCount))}
          <span className="font-semibold">{attemptCount}</span> {t.attempts}
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center bg-slate-50 p-6 rounded-lg mb-6">
        <div className="text-sm text-slate-500 mb-2">{t.yourScore}</div>
        <div className="text-5xl font-bold text-accent mb-2">{score}</div>
        <div className="text-xs text-slate-400">
          {t.betterThan && t.betterThan.replace('{percent}', percentageBetter.toString())}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Share2Icon className="h-5 w-5" />
          {t.shareResult}
        </Button>
        <Button
          onClick={handleComeTomorrow}
          variant="outline" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
        >
          <CalendarIcon className="h-5 w-5" />
          {t.comeBackTomorrow}
        </Button>
      </div>
    </div>
  );
}
