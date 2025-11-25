import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { GitBranch, Search, ExternalLink, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ThemeCrossReferenceProps {
  initialTheme?: string;
  currentVerse?: string;
}

interface TaggedVerse {
  id: string;
  gem_name: string; // verse reference
  gem_content: string; // verse text
  category: string; // themes
  floor_number: number;
  room_id: string;
  created_at: string;
}

export const ThemeCrossReference = ({ initialTheme, currentVerse }: ThemeCrossReferenceProps) => {
  const [searchTheme, setSearchTheme] = useState(initialTheme || "");
  const [results, setResults] = useState<TaggedVerse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialTheme) {
      handleSearch(initialTheme);
    }
  }, [initialTheme]);

  const handleSearch = async (theme?: string) => {
    const queryTheme = theme || searchTheme;
    if (!queryTheme.trim()) {
      toast({
        title: "Enter a theme",
        description: "Type a theme to search (e.g., Sanctuary, First Cause)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSelectedTheme(queryTheme);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Search for verses where category contains the theme
      const { data, error } = await supabase
        .from("user_gems")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("room_id", "thematic_tags")
        .ilike("category", `%${queryTheme}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResults(data || []);

      if (!data || data.length === 0) {
        toast({
          title: "No verses found",
          description: `No verses tagged with "${queryTheme}" yet. Tag some verses first!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search themes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToVerse = (verseRef: string) => {
    // Parse verse reference like "John 3:16"
    const match = verseRef.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, book, chapter, verse] = match;
      navigate(`/bible/${book}/${chapter}?verse=${verse}`);
    }
  };

  const getThemesList = (category: string): string[] => {
    return category.split(", ").filter(t => t.trim());
  };

  return (
    <Card className="p-4 space-y-4 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 border-2 border-cyan-500/20">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-cyan-600" />
        <h4 className="font-semibold text-sm text-foreground">Theme Cross-Reference</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Find all verses tagged with the same theme across Scripture
      </p>

      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Enter theme (e.g., Sanctuary, Trinity)"
          value={searchTheme}
          onChange={(e) => setSearchTheme(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="text-sm"
        />
        <Button onClick={() => handleSearch()} size="sm" disabled={loading}>
          {loading ? "..." : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {/* Results */}
      {selectedTheme && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-foreground">
              Results for "{selectedTheme}"
            </h5>
            <Badge variant="secondary" className="text-xs">
              {results.length} verse{results.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          {results.length > 0 ? (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {results.map((result) => {
                  const themes = getThemesList(result.category);
                  const isCurrentVerse = result.gem_name === currentVerse;

                  return (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                        isCurrentVerse
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:bg-accent/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {result.gem_name}
                          </Badge>
                          {isCurrentVerse && (
                            <MapPin className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigateToVerse(result.gem_name)}
                          className="h-6 px-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {result.gem_content}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {themes.map((theme, idx) => (
                          <Badge
                            key={idx}
                            variant={theme === selectedTheme ? "default" : "secondary"}
                            className={`text-xs ${
                              theme === selectedTheme
                                ? "bg-cyan-600 text-white"
                                : ""
                            }`}
                          >
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No verses tagged with "{selectedTheme}"</p>
                <p className="text-xs mt-1">
                  Start tagging verses to build your cross-reference network
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
        <p className="text-xs font-semibold mb-2 text-foreground">How it works:</p>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Tag verses with themes using Thematic Tagging</li>
          <li>• Search themes to see all related passages</li>
          <li>• Click <ExternalLink className="h-3 w-3 inline" /> to jump to verse</li>
          <li>• Build typology chains across Scripture</li>
        </ul>
      </div>
    </Card>
  );
};
