import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Sparkles } from "lucide-react";

interface BuildTheStudyProps {
  verseCards: Array<{ id: string; reference: string; preview: string }>;
  themeWords: string[];
  onSubmit: (selections: string[]) => void;
  hasSubmitted: boolean;
  isHost?: boolean;
  patterns?: Array<{ cards: string[]; count: number }>;
}

export function BuildTheStudy({
  verseCards,
  themeWords,
  onSubmit,
  hasSubmitted,
  isHost,
  patterns = []
}: BuildTheStudyProps) {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const toggleCard = (cardId: string) => {
    if (hasSubmitted) return;
    
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, cardId];
    });
  };

  const handleSubmit = () => {
    if (selectedCards.length === 3) {
      onSubmit(selectedCards);
    }
  };

  // Guest view
  if (!isHost) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Build the Study</h2>
            <p className="text-muted-foreground">
              Select 3 cards that belong together
            </p>
            <Badge variant="outline" className="mt-2">
              {selectedCards.length}/3 selected
            </Badge>
          </div>

          {/* Verse Cards */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Verse Cards
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {verseCards.map((card) => {
                const isSelected = selectedCards.includes(card.id);
                return (
                  <motion.button
                    key={card.id}
                    onClick={() => toggleCard(card.id)}
                    disabled={hasSubmitted || (selectedCards.length >= 3 && !isSelected)}
                    whileHover={!hasSubmitted ? { scale: 1.02 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.98 } : {}}
                    className={`
                      relative p-4 rounded-xl border-2 text-left transition-all
                      ${isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border/50 hover:border-primary/50 bg-muted/30'}
                      ${hasSubmitted && !isSelected ? 'opacity-50' : ''}
                    `}
                  >
                    <p className="font-medium text-sm mb-1">{card.reference}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {card.preview}
                    </p>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Theme Words */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              Theme Words
            </h3>
            <div className="flex flex-wrap gap-3">
              {themeWords.map((word) => {
                const cardId = `theme-${word}`;
                const isSelected = selectedCards.includes(cardId);
                return (
                  <motion.button
                    key={cardId}
                    onClick={() => toggleCard(cardId)}
                    disabled={hasSubmitted || (selectedCards.length >= 3 && !isSelected)}
                    whileHover={!hasSubmitted ? { scale: 1.05 } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.95 } : {}}
                    className={`
                      relative px-4 py-2 rounded-full border-2 font-medium transition-all
                      ${isSelected 
                        ? 'border-secondary bg-secondary/10 text-secondary' 
                        : 'border-border/50 hover:border-secondary/50'}
                      ${hasSubmitted && !isSelected ? 'opacity-50' : ''}
                    `}
                  >
                    {word}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center"
                      >
                        <Check className="w-3 h-3 text-secondary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {!hasSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedCards.length !== 3}
              className="w-full"
            >
              Submit Selection
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-4 bg-muted/50 rounded-lg"
            >
              <p className="text-muted-foreground">Selection submitted! Waiting for patterns...</p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Host view - shows patterns
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        <h2 className="text-2xl font-bold mb-6 text-center">Dominant Patterns</h2>
        
        <div className="space-y-4">
          {patterns.map((pattern, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-muted/30 border border-border/30"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Pattern #{index + 1}</Badge>
                <span className="text-sm text-muted-foreground">
                  {pattern.count} guests saw this
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pattern.cards.map((card, i) => (
                  <Badge key={i} variant="outline">
                    {card}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
