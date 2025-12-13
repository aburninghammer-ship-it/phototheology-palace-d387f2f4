import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, ExternalLink, Volume2, Loader2, Sparkles } from "lucide-react";
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
  const [searchTopic, setSearchTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VerseSuggestion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async (topic?: string) => {
    const queryTopic = topic || searchTopic;
    if (!queryTopic.trim()) {
      toast.error("Please enter a theme to search");
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

  const navigateToVerse = (reference: string) => {
    // Parse verse reference like "John 3:16" or "1 John 4:8"
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
        Find key verses on any biblical theme (Law, Grace, Faith, Sabbath, etc.)
      </p>

      {/* Popular Theme Chips */}
      <div className="flex flex-wrap gap-1.5">
        {POPULAR_THEMES.map((theme) => (
          <Badge
            key={theme}
            variant="outline"
            className="cursor-pointer text-xs hover:bg-primary/10 hover:border-primary transition-colors"
            onClick={() => {
              setSearchTopic(theme);
              handleSearch(theme);
            }}
          >
            {theme}
          </Badge>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter theme (e.g., Sanctuary, Atonement)"
          value={searchTopic}
          onChange={(e) => setSearchTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="text-sm"
          disabled={loading}
        />
        <Button onClick={() => handleSearch()} size="sm" disabled={loading}>
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
