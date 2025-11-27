import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VerseSuggestion {
  reference: string;
  text: string;
  reason: string;
}

interface JeevesVerseSuggestionsProps {
  onAddVerse: (verse: { reference: string; text: string }) => void;
}

export function JeevesVerseSuggestions({ onAddVerse }: JeevesVerseSuggestionsProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<VerseSuggestion[]>([]);

  const handleSuggest = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-verses-by-topic', {
        body: { topic }
      });

      if (error) throw error;

      if (data.verses && data.verses.length > 0) {
        setSuggestions(data.verses);
        toast.success(`Jeeves found ${data.verses.length} verses on "${topic}"!`);
      } else {
        toast.error("No verses found. Try a different topic.");
      }
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast.error("Failed to get verse suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Ask Jeeves for Verse Suggestions</CardTitle>
          </div>
          <CardDescription>
            Let Jeeves recommend key verses on any topic for your memory list
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a topic (e.g., 'state of the dead', 'salvation', 'prayer')"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSuggest()}
            />
            <Button onClick={handleSuggest} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Thinking...
                </>
              ) : (
                "Suggest Verses"
              )}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3 mt-4">
              <h4 className="font-semibold text-sm">Jeeves suggests these verses:</h4>
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="border-muted">
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-primary">
                          {suggestion.reference}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {suggestion.text.length > 150 
                            ? suggestion.text.substring(0, 150) + "..." 
                            : suggestion.text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          💡 {suggestion.reason}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onAddVerse({
                            reference: suggestion.reference,
                            text: suggestion.text
                          });
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}