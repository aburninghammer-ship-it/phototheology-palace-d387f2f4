import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, Loader2, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface VerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  principles?: string[];
  book?: string;
  chapter?: number;
}

export const VerseView = ({ 
  verse, 
  isSelected, 
  onSelect, 
  showPrinciples, 
  isHighlighted, 
  principles,
  book,
  chapter
}: VerseViewProps) => {
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);
  const [principleExplanation, setPrincipleExplanation] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const { toast } = useToast();
  const colors = ["gradient-palace", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-royal"];
  
  const handlePrincipleClick = async (principle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPrinciple(principle);
    setLoadingExplanation(true);
    setPrincipleExplanation(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "principle-explanation",
          book: book || verse.book,
          chapter: chapter || verse.chapter,
          verse: verse.verse,
          verseText: verse.text,
          principle: principle
        },
      });

      if (error) throw error;

      setPrincipleExplanation(data.content);
    } catch (error: any) {
      console.error("Jeeves principle explanation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get principle explanation from Jeeves",
        variant: "destructive",
      });
      setPrincipleExplanation("Failed to load explanation. Please try again.");
    } finally {
      setLoadingExplanation(false);
    }
  };
  
  return (
    <div
      className={`group cursor-pointer transition-all duration-300 p-3 rounded-lg ${
        isSelected
          ? "bg-primary/10 border-2 border-primary shadow-lg"
          : isHighlighted
          ? "bg-accent/20 border-2 border-accent shadow-md animate-pulse-glow"
          : "hover:bg-muted/50 border-2 border-transparent"
      }`}
      onClick={onSelect}
    >
      <div className="flex gap-3">
        <span
          className={`font-serif font-bold text-sm flex-shrink-0 ${
            isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          } transition-colors`}
        >
          {verse.verse}
        </span>
        
        <div className="flex-1">
          <p className="text-foreground leading-relaxed">
            {verse.text}
          </p>
          
          {showPrinciples && principles && principles.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {principles.map((principle, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  onClick={(e) => handlePrincipleClick(principle, e)}
                  className={`text-xs ${colors[idx % colors.length]} text-white cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  {idx === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                  {principle}
                </Badge>
              ))}
            </div>
          )}

          {/* Principle Explanation */}
          {selectedPrinciple && (
            <div className="mt-3 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Why {selectedPrinciple}?</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPrinciple(null);
                    setPrincipleExplanation(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {loadingExplanation ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Jeeves is analyzing...
                </div>
              ) : principleExplanation ? (
                <div className="prose prose-sm max-w-none text-foreground">
                  {formatJeevesResponse(principleExplanation)}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
