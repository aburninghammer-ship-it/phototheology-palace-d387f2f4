import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, ExternalLink, Volume2, Loader2, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ThemeVerseSearchProps {
  onPlayVerses?: (verses: VerseSuggestion[]) => void;
  showAudioOption?: boolean;
  className?: string;
}

export interface VerseSuggestion {
  reference: string;
  text: string;
  reason: string;
}

const POPULAR_THEMES = [
  "Law", "Grace", "Faith", "Sabbath", "Death", "Prophecy",
  "Love", "Salvation", "Sanctuary", "Second Coming", "Resurrection",
  "Holy Spirit", "Trinity", "Atonement", "Judgment"
];

export function ThemeVerseSearch({ 
  onPlayVerses, 
  showAudioOption = false,
  className 
}: ThemeVerseSearchProps) {
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [customTheme, setCustomTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [results, setResults] = useState<VerseSuggestion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const addCustomTheme = () => {
    const trimmed = customTheme.trim();
    if (trimmed && !selectedThemes.map(t => t.toUpperCase()).includes(trimmed.toUpperCase())) {
      setSelectedThemes(prev => [...prev, trimmed]);
      setCustomTheme("");
    }
  };

  const getSearchTopic = () => {
    return selectedThemes.join(", ");
  };

  const handleSearch = async () => {
    const queryTopic = getSearchTopic();
    if (!queryTopic) {
      toast.error("Please select at least one theme to search");
      return;
    }

    setLoading(true);
    setCurrentTopic(queryTopic);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-verses-by-topic', {
        body: { topic: queryTopic }
      });

      if (error) throw error;

      if (data.verses && data.verses.length > 0) {
        setResults(data.verses);
        toast.success(`Found ${data.verses.length} verses on "${queryTopic}"!`);
      } else {
        setResults([]);
        toast.error("No verses found. Try a different theme.");
      }
    } catch (error) {
      console.error("Error searching theme verses:", error);
      toast.error("Failed to search verses");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!currentTopic) return;

    setLoadingMore(true);

    try {
      const existingRefs = results.map(r => r.reference);
      const { data, error } = await supabase.functions.invoke('suggest-verses-by-topic', {
        body: { 
          topic: currentTopic,
          excludeVerses: existingRefs
        }
      });

      if (error) throw error;

      if (data.verses && data.verses.length > 0) {
        const newVerses = data.verses.filter(
          (v: VerseSuggestion) => !existingRefs.includes(v.reference)
        );
        if (newVerses.length > 0) {
          setResults(prev => [...prev, ...newVerses]);
          toast.success(`Added ${newVerses.length} more verses!`);
        } else {
          toast.info("No additional verses found for this theme.");
        }
      } else {
        toast.info("No additional verses found for this theme.");
      }
    } catch (error) {
      console.error("Error loading more verses:", error);
      toast.error("Failed to load more verses");
    } finally {
      setLoadingMore(false);
    }
  };

  const navigateToVerse = (reference: string) => {
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (match) {
      const [, book, chapter, verse] = match;
      navigate(`/bible/${book}/${chapter}?verse=${verse}`);
    }
  };

  const handlePlayAll = () => {
    if (onPlayVerses && results.length > 0) {
      onPlayVerses(results);
    }
  };

  return (
    <Card className={`p-4 space-y-4 bg-gradient-to-br from-purple-500/5 via-primary/5 to-accent/5 border-2 border-primary/20 ${className}`}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-sm text-foreground">Theme Verse Search</h4>
        <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
      </div>

      <p className="text-xs text-muted-foreground">
        Find key verses on any biblical theme. Select multiple themes to combine them.
      </p>

      {/* Popular Theme Chips - Toggle Selection */}
      <div className="flex flex-wrap gap-1.5">
        {POPULAR_THEMES.map((theme) => {
          const isSelected = selectedThemes.includes(theme);
          return (
            <Badge
              key={theme}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer text-xs transition-colors ${
                isSelected 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "hover:bg-primary/10 hover:border-primary"
              }`}
              onClick={() => toggleTheme(theme)}
            >
              {theme}
            </Badge>
          );
        })}
      </div>

      {/* Selected Themes Display */}
      {selectedThemes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-2 rounded-md bg-muted/50 border border-border">
          <span className="text-xs text-muted-foreground">Selected:</span>
          {selectedThemes.map((theme) => (
            <Badge 
              key={theme} 
              variant="secondary" 
              className="text-xs flex items-center gap-1"
            >
              {theme}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => toggleTheme(theme)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Custom Theme Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom theme (e.g., Millennium)"
          value={customTheme}
          onChange={(e) => setCustomTheme(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustomTheme();
            }
          }}
          className="text-sm"
          disabled={loading}
        />
        <Button 
          onClick={addCustomTheme} 
          size="sm" 
          variant="outline"
          disabled={loading || !customTheme.trim()}
        >
          Add
        </Button>
        <Button 
          onClick={handleSearch} 
          size="sm" 
          disabled={loading || selectedThemes.length === 0}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {/* Results */}
      {currentTopic && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-foreground">
              Verses on "{currentTopic}"
            </h5>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {results.length} verse{results.length !== 1 ? "s" : ""}
              </Badge>
              {showAudioOption && results.length > 0 && onPlayVerses && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayAll}
                  className="h-7 text-xs"
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  Play All
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">Searching Scripture...</span>
            </div>
          ) : results.length > 0 ? (
            <>
              <ScrollArea className="h-[350px]">
                <div className="space-y-2 pr-4">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-border bg-card hover:bg-accent/10 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {result.reference}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigateToVerse(result.reference)}
                          className="h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-foreground mb-2 leading-relaxed">
                        {result.text}
                      </p>

                      <p className="text-xs text-muted-foreground italic flex items-start gap-1">
                        <BookOpen className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {result.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              {/* Load More Button */}
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="w-full mt-3"
                size="sm"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate More Verses
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No verses found for "{currentTopic}"</p>
              <p className="text-xs mt-1">Try a different theme or keyword</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
