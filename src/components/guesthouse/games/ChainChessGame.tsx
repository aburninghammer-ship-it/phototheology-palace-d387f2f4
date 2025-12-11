import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, ArrowRight, Link, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ChainLink {
  verse: string;
  keyword: string;
  hint?: string;
}

interface ChainChessGameProps {
  startingVerse: string;
  chain: ChainLink[];
  timeLimit?: number;
  onComplete: (score: number, linksFound: number, timeTaken: number) => void;
  isHost?: boolean;
}

export function ChainChessGame({ 
  startingVerse, 
  chain, 
  timeLimit = 180, 
  onComplete,
  isHost = false
}: ChainChessGameProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentLinkIndex, setCurrentLinkIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [foundLinks, setFoundLinks] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isComplete || isHost) return;

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
  }, [isComplete, isHost]);

  const handleGuess = async () => {
    if (!guess.trim()) return;
    setChecking(true);

    const currentLink = chain[currentLinkIndex];
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedAnswer = currentLink.verse.toLowerCase().trim();

    // Check if guess matches (allow partial matches like "John 3:16" vs "John 3:16-17")
    const isCorrect = normalizedAnswer.includes(normalizedGuess) || 
                      normalizedGuess.includes(normalizedAnswer.split('-')[0]);

    if (isCorrect) {
      setFoundLinks(prev => [...prev, currentLinkIndex]);
      toast.success(`Correct! Found the link: ${currentLink.keyword}`);
      
      if (currentLinkIndex + 1 < chain.length) {
        setCurrentLinkIndex(prev => prev + 1);
        setGuess("");
        setShowHint(false);
      } else {
        handleGameEnd();
      }
    } else {
      toast.error("Not quite right. Try again!");
    }

    setChecking(false);
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const skipLink = () => {
    if (currentLinkIndex + 1 < chain.length) {
      setCurrentLinkIndex(prev => prev + 1);
      setGuess("");
      setShowHint(false);
    } else {
      handleGameEnd();
    }
  };

  const handleGameEnd = () => {
    setIsComplete(true);
    const timeTaken = timeLimit - timeRemaining;
    // Score: base points per link found, minus hint penalties, plus time bonus
    const baseScore = foundLinks.length * 100;
    const hintPenalty = hintsUsed * 15;
    const timeBonus = Math.floor((timeRemaining / timeLimit) * 50);
    const score = Math.max(0, baseScore - hintPenalty + timeBonus);
    onComplete(score, foundLinks.length, timeTaken);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining <= 30;
  const currentLink = chain[currentLinkIndex];

  // Host view - show the full chain
  if (isHost) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Chain Chess - Host View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Starting Verse</p>
              <p className="font-bold text-lg">{startingVerse}</p>
            </div>

            <div className="space-y-2">
              {chain.map((link, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
                >
                  <Badge>{index + 1}</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium">{link.verse}</p>
                    <p className="text-sm text-muted-foreground">
                      Keyword: <span className="text-primary">{link.keyword}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Chain Complete!</h2>
        <p className="text-muted-foreground mb-4">
          You found {foundLinks.length} of {chain.length} links
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge variant="outline" className="text-lg py-2 px-4">
            Links: {foundLinks.length}/{chain.length}
          </Badge>
          <Badge variant="outline" className="text-lg py-2 px-4">
            Hints: {hintsUsed}
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
            <Link className="w-5 h-5 text-primary" />
            Chain Chess
          </CardTitle>
          <Badge variant={isLowTime ? "destructive" : "secondary"}>
            <Clock className={`w-3 h-3 mr-1 ${isLowTime ? "animate-pulse" : ""}`} />
            {formatTime(timeRemaining)}
          </Badge>
        </div>
        <Progress value={(foundLinks.length / chain.length) * 100} className="h-2 mt-2" />
        <p className="text-sm text-muted-foreground mt-1">
          Link {currentLinkIndex + 1} of {chain.length}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current position in chain */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            {foundLinks.length === 0 ? "Starting Verse" : "Previous Link"}
          </p>
          <p className="font-serif text-lg">
            {foundLinks.length === 0 ? startingVerse : chain[currentLinkIndex - 1]?.verse}
          </p>
        </div>

        {/* Search clue */}
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Find a verse connected by the keyword:</p>
          <Badge className="text-lg py-2 px-6 bg-primary">
            {currentLink.keyword}
          </Badge>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && currentLink.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <p className="text-sm text-amber-700 dark:text-amber-400">
                💡 Hint: {currentLink.hint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guess input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter verse reference (e.g., Romans 8:28)"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGuess()}
            className="flex-1"
          />
          <Button onClick={handleGuess} disabled={checking || !guess.trim()}>
            {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={useHint}
            disabled={showHint || !currentLink.hint}
            className="flex-1"
          >
            Use Hint (-15 pts)
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={skipLink}
            className="flex-1"
          >
            Skip Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
