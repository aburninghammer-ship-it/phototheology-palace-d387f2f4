import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Symbol {
  id: string;
  symbol: string;
  meaning: string;
  verse: string;
}

interface SymbolMatchGameProps {
  symbols: Symbol[];
  timeLimit?: number;
  onComplete: (score: number, timeTaken: number) => void;
}

export function SymbolMatchGame({ symbols, timeLimit = 120, onComplete }: SymbolMatchGameProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [incorrect, setIncorrect] = useState<string[]>([]);
  const [shuffledMeanings, setShuffledMeanings] = useState<Symbol[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Shuffle meanings
    setShuffledMeanings([...symbols].sort(() => Math.random() - 0.5));
  }, [symbols]);

  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  useEffect(() => {
    if (selectedSymbol && selectedMeaning) {
      checkMatch();
    }
  }, [selectedSymbol, selectedMeaning]);

  const checkMatch = () => {
    const symbol = symbols.find(s => s.id === selectedSymbol);
    const meaning = shuffledMeanings.find(s => s.id === selectedMeaning);

    if (symbol && meaning && symbol.id === meaning.id) {
      // Correct match
      setMatched(prev => [...prev, symbol.id]);
      toast.success("Correct match!");
      
      // Check if all matched
      if (matched.length + 1 === symbols.length) {
        handleGameEnd();
      }
    } else {
      // Incorrect
      setIncorrect([selectedSymbol!, selectedMeaning!]);
      setTimeout(() => setIncorrect([]), 500);
    }

    setSelectedSymbol(null);
    setSelectedMeaning(null);
  };

  const handleGameEnd = () => {
    setIsComplete(true);
    const timeTaken = timeLimit - timeRemaining;
    const score = Math.round((matched.length / symbols.length) * 100 + (timeRemaining / timeLimit) * 50);
    onComplete(score, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 20;

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Symbol Match Complete!</h2>
        <p className="text-muted-foreground mb-4">
          You matched {matched.length} of {symbols.length} symbols
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-lg py-2 px-4">
            Score: {Math.round((matched.length / symbols.length) * 100)}
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            Time: {formatTime(timeLimit - timeRemaining)}
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Symbol Match
          </CardTitle>
          <Badge variant={isLowTime ? "destructive" : "secondary"}>
            <Clock className={`w-3 h-3 mr-1 ${isLowTime ? "animate-pulse" : ""}`} />
            {formatTime(timeRemaining)}
          </Badge>
        </div>
        <Progress value={(matched.length / symbols.length) * 100} className="h-2 mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          {matched.length} / {symbols.length} matched
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <p className="text-center text-muted-foreground">
          Match each biblical symbol with its meaning
        </p>

        <div className="grid grid-cols-2 gap-6">
          {/* Symbols Column */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Symbols</h3>
            {symbols.map(symbol => (
              <motion.button
                key={symbol.id}
                whileHover={{ scale: matched.includes(symbol.id) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !matched.includes(symbol.id) && setSelectedSymbol(symbol.id)}
                disabled={matched.includes(symbol.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  matched.includes(symbol.id)
                    ? "bg-green-500/20 border-green-500 opacity-50"
                    : selectedSymbol === symbol.id
                    ? "bg-primary/20 border-primary ring-2 ring-primary"
                    : incorrect.includes(symbol.id)
                    ? "bg-destructive/20 border-destructive animate-shake"
                    : "bg-card hover:bg-muted/50 border-border"
                }`}
              >
                <span className="text-2xl mr-2">{symbol.symbol}</span>
                <span className="text-sm">{symbol.symbol}</span>
              </motion.button>
            ))}
          </div>

          {/* Meanings Column */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Meanings</h3>
            {shuffledMeanings.map(symbol => (
              <motion.button
                key={`meaning-${symbol.id}`}
                whileHover={{ scale: matched.includes(symbol.id) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !matched.includes(symbol.id) && setSelectedMeaning(symbol.id)}
                disabled={matched.includes(symbol.id)}
                className={`w-full p-3 rounded-lg border text-left transition-all text-sm ${
                  matched.includes(symbol.id)
                    ? "bg-green-500/20 border-green-500 opacity-50"
                    : selectedMeaning === symbol.id
                    ? "bg-primary/20 border-primary ring-2 ring-primary"
                    : incorrect.includes(symbol.id)
                    ? "bg-destructive/20 border-destructive animate-shake"
                    : "bg-card hover:bg-muted/50 border-border"
                }`}
              >
                {symbol.meaning}
              </motion.button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
