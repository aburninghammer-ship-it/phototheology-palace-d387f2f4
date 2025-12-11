import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MapPin, 
  Target, 
  CheckCircle2,
  Loader2,
  Lightbulb,
  ChevronRight,
  Trophy,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface ClueStep {
  clue: string;
  hintBook?: string;
  hintChapter?: string;
  ptPrinciple?: string;
  revealed: boolean;
}

interface VerseHuntProps {
  targetVerse: {
    book: string;
    chapter: number;
    verse: number;
    text: string;
  };
  clueTrail: ClueStep[];
  teamId?: string;
  onGuess: (guess: { book?: string; chapter?: number; verse?: number }) => Promise<{
    correct: boolean;
    level: "book" | "chapter" | "verse";
    feedback: string;
    pointsAwarded: number;
  }>;
  onComplete: (finalScore: number) => void;
  timeLimit?: number;
}

export function VerseHuntGame({
  targetVerse,
  clueTrail,
  teamId,
  onGuess,
  onComplete,
  timeLimit = 300, // 5 minutes default
}: VerseHuntProps) {
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [revealedClues, setRevealedClues] = useState<number[]>([0]);
  const [guessLevel, setGuessLevel] = useState<"book" | "chapter" | "verse">("book");
  const [bookGuess, setBookGuess] = useState("");
  const [chapterGuess, setChapterGuess] = useState("");
  const [verseGuess, setVerseGuess] = useState("");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [correctBook, setCorrectBook] = useState(false);
  const [correctChapter, setCorrectChapter] = useState(false);

  // Timer
  useEffect(() => {
    if (gameComplete) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameComplete]);

  const handleTimeUp = () => {
    toast.error("Time's up!");
    setGameComplete(true);
    onComplete(score);
  };

  const revealNextClue = () => {
    if (currentClueIndex < clueTrail.length - 1) {
      const nextIndex = currentClueIndex + 1;
      setCurrentClueIndex(nextIndex);
      setRevealedClues((prev) => [...prev, nextIndex]);
      // Penalty for needing more clues
      setScore((prev) => Math.max(0, prev - 5));
      toast.info("New clue revealed! (-5 points)");
    }
  };

  const handleSubmitGuess = async () => {
    setIsSubmitting(true);
    setAttempts((prev) => prev + 1);

    try {
      const guess: { book?: string; chapter?: number; verse?: number } = {};
      
      if (guessLevel === "book") {
        guess.book = bookGuess.trim();
      } else if (guessLevel === "chapter") {
        guess.book = bookGuess.trim();
        guess.chapter = parseInt(chapterGuess);
      } else {
        guess.book = bookGuess.trim();
        guess.chapter = parseInt(chapterGuess);
        guess.verse = parseInt(verseGuess);
      }

      const result = await onGuess(guess);

      if (result.correct) {
        setScore((prev) => prev + result.pointsAwarded);
        toast.success(result.feedback);

        if (result.level === "book") {
          setCorrectBook(true);
          setGuessLevel("chapter");
        } else if (result.level === "chapter") {
          setCorrectChapter(true);
          setGuessLevel("verse");
        } else {
          // Found the verse!
          setGameComplete(true);
          onComplete(score + result.pointsAwarded);
        }
      } else {
        toast.error(result.feedback);
        setScore((prev) => Math.max(0, prev - 2));
      }
    } catch (error) {
      toast.error("Error submitting guess");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentClue = clueTrail[currentClueIndex];
  const progress = ((guessLevel === "book" ? 0 : guessLevel === "chapter" ? 33 : 66) + 
    (gameComplete ? 34 : 0));

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verse Hunt Complete!</h2>
        <p className="text-muted-foreground mb-4">
          The answer was: <strong>{targetVerse.book} {targetVerse.chapter}:{targetVerse.verse}</strong>
        </p>
        <div className="p-4 bg-muted/50 rounded-lg mb-4 max-w-md mx-auto">
          <p className="font-serif italic">"{targetVerse.text}"</p>
        </div>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Final Score: {score} pts
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Attempts: {attempts}
          </Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Timer and Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <span className="font-bold">Verse Hunt</span>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant={timeRemaining < 60 ? "destructive" : "outline"}>
            {formatTime(timeRemaining)}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Find the Book</span>
          <span>Find the Chapter</span>
          <span>Find the Verse</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Clue Trail */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Clue Trail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {revealedClues.map((clueIdx) => (
              <motion.div
                key={clueIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${
                  clueIdx === currentClueIndex 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-muted/30 border-muted"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">
                    Clue {clueIdx + 1}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm">{clueTrail[clueIdx]?.clue}</p>
                    {clueTrail[clueIdx]?.ptPrinciple && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {clueTrail[clueIdx].ptPrinciple}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {currentClueIndex < clueTrail.length - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={revealNextClue}
              className="w-full"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Need Another Clue (-5 pts)
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Guess Input */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5" />
            {guessLevel === "book" && "Guess the Book"}
            {guessLevel === "chapter" && "Guess the Chapter"}
            {guessLevel === "verse" && "Guess the Verse"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Locked in values */}
          {correctBook && (
            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="font-medium">{bookGuess}</span>
            </div>
          )}
          {correctChapter && (
            <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="font-medium">Chapter {chapterGuess}</span>
            </div>
          )}

          {/* Current input */}
          <div className="flex gap-2">
            {guessLevel === "book" && (
              <Input
                placeholder="Enter book name (e.g., Genesis, Revelation)"
                value={bookGuess}
                onChange={(e) => setBookGuess(e.target.value)}
                className="flex-1"
              />
            )}
            {guessLevel === "chapter" && (
              <Input
                type="number"
                placeholder="Enter chapter number"
                value={chapterGuess}
                onChange={(e) => setChapterGuess(e.target.value)}
                className="flex-1"
                min={1}
              />
            )}
            {guessLevel === "verse" && (
              <Input
                type="number"
                placeholder="Enter verse number"
                value={verseGuess}
                onChange={(e) => setVerseGuess(e.target.value)}
                className="flex-1"
                min={1}
              />
            )}
            <Button 
              onClick={handleSubmitGuess} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Attempts: {attempts} | Wrong guesses: -2 pts each
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
