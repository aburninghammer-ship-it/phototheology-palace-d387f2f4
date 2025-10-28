import { useState } from "react";
import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { StrongsModal } from "./StrongsModal";
import { getVerseWithStrongs } from "@/services/strongsApi";
import { Sparkles } from "lucide-react";

interface StrongsVerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  principles?: string[];
}

export const StrongsVerseView = ({ 
  verse, 
  isSelected, 
  onSelect, 
  showPrinciples, 
  isHighlighted,
  principles 
}: StrongsVerseViewProps) => {
  const [selectedStrongs, setSelectedStrongs] = useState<string | null>(null);
  const displayPrinciples = principles || ["2D", "@Ab", "Altar", "Passover"];
  const colors = ["gradient-palace", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-royal"];
  
  const strongsData = getVerseWithStrongs(verse.book, verse.chapter, verse.verse);

  const handleStrongsClick = (strongsNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStrongs(strongsNumber);
  };

  return (
    <>
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
            <div className="text-foreground leading-relaxed">
              {strongsData ? (
                <span>
                  {strongsData.words.map((word, idx) => (
                    <span key={idx}>
                      {word.text}
                      {word.strongs && (
                        <sup 
                          className="text-xs text-primary/70 hover:text-primary cursor-pointer font-semibold ml-0.5 transition-colors"
                          onClick={(e) => handleStrongsClick(word.strongs!, e)}
                          title={`Click to see Strong's ${word.strongs}`}
                        >
                          {word.strongs.replace(/[GH]/, "")}
                        </sup>
                      )}
                      {idx < strongsData.words.length - 1 && " "}
                    </span>
                  ))}
                </span>
              ) : (
                <div>
                  <p className="mb-2">{verse.text}</p>
                  {verse.verse === 1 && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-semibold text-foreground">
                            ✨ Strong's Numbers Active
                          </p>
                          <p className="text-muted-foreground">
                            Strong's concordance data is currently available for these demonstration verses:
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-0.5">
                            <li><strong>John 1:1</strong> - "In the beginning was the Word"</li>
                            <li><strong>John 3:3</strong> - "Ye must be born again"</li>
                            <li><strong>John 3:16</strong> - "For God so loved the world"</li>
                            <li><strong>John 14:6</strong> - "I am the way, the truth, and the life"</li>
                          </ul>
                          <p className="text-muted-foreground mt-2">
                            When viewing these verses, click the superscript numbers to see original Hebrew/Greek definitions and usage. 
                            <span className="text-primary font-medium"> Full Bible concordance integration coming soon!</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {showPrinciples && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {displayPrinciples.map((principle, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`text-xs ${colors[idx % colors.length]} text-white`}
                  >
                    {idx === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                    {principle}
                  </Badge>
                ))}
              </div>
            )}

            {strongsData && (
              <div className="mt-2 text-xs text-primary/60 italic font-semibold">
                ✨ Click superscript numbers to see Hebrew/Greek definitions
              </div>
            )}
          </div>
        </div>
      </div>

      <StrongsModal
        strongsNumber={selectedStrongs || ""}
        isOpen={!!selectedStrongs}
        onClose={() => setSelectedStrongs(null)}
      />
    </>
  );
};
