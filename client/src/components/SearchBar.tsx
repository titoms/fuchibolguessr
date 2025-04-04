import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGameStore } from "@/store/gameStore";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PlayerSearchResult } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getCountryFlag } from "@/lib/i18n/translations";
import { FlagImage } from "@/lib/i18n/translations";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { toast } = useToast();
  const { addGuess, isGuessing } = useGameStore();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Fetch player search results
  const { data: searchResults, isLoading: isSearching } = useQuery<PlayerSearchResult[]>({
    queryKey: ['/api/players/search', searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 3) return [];
      console.log('Searching for:', searchQuery);
      const response = await fetch(`/api/players/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to search players');
      }
      const data = await response.json();
      console.log('Search results:', data);
      return data;
    },
    enabled: searchQuery.length > 2,
    retry: 1,
    retryDelay: 500
  });

  // Submit guess mutation
  const guessMutation = useMutation({
    mutationFn: async (playerId: number) => {
      return apiRequest('POST', '/api/game/guess', { playerId });
    },
    onSuccess: async (response) => {
      const result = await response.json();
      addGuess(result);
      queryClient.invalidateQueries({ queryKey: ['/api/game/state'] });
      setSearchQuery("");
    },
    onError: (error) => {
      toast({
        title: t.incorrectGuess,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle player selection
  const handlePlayerSelect = (player: PlayerSearchResult) => {
    setSearchQuery(player.name);
    setIsSearchActive(false);
    
    // Submit the guess
    guessMutation.mutate(player.id);
  };

  // Handle form submission
  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we have search results and a selection, submit the first result
    if (searchResults && searchResults.length > 0) {
      handlePlayerSelect(searchResults[0]);
    } else {
      toast({
        title: t.incorrectGuess,
        description: "Please select a player from the dropdown",
        variant: "destructive",
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <form onSubmit={handleSubmitGuess}>
        <div className="relative">
          <Input
            ref={searchInputRef}
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent shadow-sm"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            disabled={guessMutation.isPending || isGuessing}
          />
          <Button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-md hover:bg-primary/90 transition-colors"
            disabled={searchQuery.length < 3 || guessMutation.isPending || isGuessing}
            variant="default"
          >
            {guessMutation.isPending ? t.loading : t.guessButton}
          </Button>
        </div>
      </form>
      
      {/* Autocomplete dropdown */}
      {isSearchActive && searchQuery.length > 2 && (
        <div 
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-slate-200 max-h-60 overflow-auto"
        >
          {isSearching && (
            <div className="px-4 py-2 text-slate-500 text-sm">{t.loading}</div>
          )}
          
          {!isSearching && searchResults && searchResults.length === 0 && (
            <div className="px-4 py-2 text-slate-500 text-sm">No players found</div>
          )}
          
          {!isSearching && searchResults && searchResults.map((player) => (
            <div 
              key={player.id}
              className="px-4 py-2 cursor-pointer autocomplete-item flex items-center gap-2 hover:bg-slate-100"
              onClick={() => handlePlayerSelect(player)}
            >
              {player.imageUrl ? (
                <img src={player.imageUrl} alt={player.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs text-slate-600">
                  {player.name.substring(0, 2)}
                </div>
              )}
              <div>
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {player.club} <FlagImage countryName={player.nationality} /> {player.nationality}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
