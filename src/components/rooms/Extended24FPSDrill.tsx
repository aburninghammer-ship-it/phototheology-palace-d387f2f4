import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Zap,
  Trophy,
  WifiOff
} from "lucide-react";
import { OfflineIndicator } from "@/components/bible/OfflineIndicator";
import { ChapterFrame } from "@/data/exodus24fpsData";
import { genesis25to50Data } from "@/data/genesis25to50Data";
import { exodus25toLev8Data } from "@/data/exodus25toLev8Data";
import { lev9toNum5Data } from "@/data/lev9toNum5Data";
import { numbers6to29Data } from "@/data/numbers6to29Data";
import { toast } from "sonner";

type DrillMode = 'learn' | 'symbol-to-chapter' | 'chapter-to-symbol' | 'summary-quiz' | 'full-test';

interface BookSet {
  id: string;
  label: string;
  theme: string;
  data: ChapterFrame[];
  color: string;
}

const BOOK_SETS: BookSet[] = [
  {
    id: 'genesis-25-50',
    label: 'Genesis 25-50',
    theme: 'Multiplication',
    data: genesis25to50Data,
    color: 'from-green-900/30 to-emerald-900/20'
  },
  {
    id: 'exodus-25-lev-8',
    label: 'Exodus 25 - Leviticus 8',
    theme: 'Sanctuary',
    data: exodus25toLev8Data,
    color: 'from-blue-900/30 to-indigo-900/20'
  },
  {
    id: 'lev-9-num-5',
    label: 'Leviticus 9 - Numbers 5',
    theme: 'Laws',
    data: lev9toNum5Data,
    color: 'from-purple-900/30 to-violet-900/20'
  },
  {
    id: 'numbers-6-29',
    label: 'Numbers 6-29',
    theme: 'Wilderness',
    data: numbers6to29Data,
    color: 'from-amber-900/30 to-orange-900/20'
  }
];

export const Extended24FPSDrill: React.FC = () => {
  const [activeSet, setActiveSet] = useState<string>('genesis-25-50');
  const [mode, setMode] = useState<DrillMode>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [shuffledCards, setShuffledCards] = useState<ChapterFrame[]>([]);
  const [quizOptions, setQuizOptions] = useState<ChapterFrame[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [masteredChapters, setMasteredChapters] = useState<Set<string>>(new Set());

  const currentBookSet = BOOK_SETS.find(s => s.id === activeSet) || BOOK_SETS[0];

  useEffect(() => {
    setShuffledCards([...currentBookSet.data]);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [activeSet]);

  useEffect(() => {
    if (mode !== 'learn' && shuffledCards.length > 0) {
      generateQuizOptions();
    }
  }, [currentIndex, mode, shuffledCards]);

  const currentCard = shuffledCards[currentIndex];

  const shuffleCards = () => {
    const shuffled = [...currentBookSet.data].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const generateQuizOptions = () => {
    if (!currentCard) return;
    const correct = currentCard;
    const others = currentBookSet.data
      .filter(c => c.chapter !== correct.chapter || c.book !== correct.book)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correct, ...others].sort(() => Math.random() - 0.5);
    setQuizOptions(options);
  };

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const getChapterKey = (card: ChapterFrame) => `${card.book || ''}-${card.chapter}`;

  const handleAnswer = (selected: ChapterFrame) => {
    if (selectedAnswer !== null || !currentCard) return;
    
    const isCorrect = selected.chapter === currentCard.chapter && selected.book === currentCard.book;
    setSelectedAnswer(selected.chapter);
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (isCorrect) {
      setMasteredChapters(prev => new Set([...prev, getChapterKey(currentCard)]));
      toast.success("Correct!");
    } else {
      const bookLabel = currentCard.book ? `${currentCard.book} ` : '';
      toast.error(`Wrong! It was: ${bookLabel}${currentCard.chapter}`);
    }

    setTimeout(() => {
      if (currentIndex < shuffledCards.length - 1) {
        handleNext();
      } else {
        toast.success(`Quiz complete! Score: ${score.correct + (isCorrect ? 1 : 0)}/${score.total + 1}`);
      }
    }, 1500);
  };

  const resetDrill = () => {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setShowAnswer(false);
    setSelectedAnswer(null);
    shuffleCards();
  };

  const getChapterLabel = (card: ChapterFrame) => {
    if (card.book) {
      return `${card.book} ${card.chapter}`;
    }
    return `Chapter ${card.chapter}`;
  };

  if (!currentCard) {
    return <div className="text-center text-muted-foreground">Loading...</div>;
  }

  const renderModeSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'symbol-to-chapter', label: 'Symbol → Chapter', icon: Eye },
        { id: 'chapter-to-symbol', label: 'Chapter → Symbol', icon: Zap },
        { id: 'summary-quiz', label: 'Summary Quiz', icon: CheckCircle2 },
        { id: 'full-test', label: 'Full Test', icon: Trophy }
      ].map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={mode === id ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setMode(id as DrillMode);
            resetDrill();
          }}
          className="gap-2"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </div>
  );

  const cardGradient = `bg-gradient-to-br ${currentBookSet.color} border-primary/30`;

  const renderLearnMode = () => (
    <Card className={cardGradient}>
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{currentCard.symbol}</div>
        <Badge variant="outline" className="w-fit mx-auto mb-2 text-primary border-primary/50">
          {getChapterLabel(currentCard)}
        </Badge>
        <CardTitle className="text-2xl">{currentCard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">Summary</h4>
          <p className="text-foreground/90">{currentCard.summary}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-primary mb-2">Memory Hook</h4>
          <p className="text-foreground/90 italic">"{currentCard.memoryHook}"</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSymbolToChapterMode = () => (
    <Card className={cardGradient}>
      <CardHeader className="text-center">
        <div className="text-8xl mb-4">{currentCard.symbol}</div>
        <p className="text-muted-foreground">Which chapter does this represent?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option, idx) => (
            <Button
              key={`${option.book}-${option.chapter}-${idx}`}
              variant={
                selectedAnswer === option.chapter && option.book === currentCard.book
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter && option.book === currentCard.book
                  ? "default"
                  : "outline"
              }
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-lg font-bold">{getChapterLabel(option)}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderChapterToSymbolMode = () => (
    <Card className={cardGradient}>
      <CardHeader className="text-center">
        <Badge variant="outline" className="w-fit mx-auto mb-2 text-primary border-primary/50">
          {getChapterLabel(currentCard)}
        </Badge>
        <CardTitle className="text-2xl">{currentCard.title}</CardTitle>
        <p className="text-muted-foreground mt-2">What symbol represents this chapter?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option, idx) => (
            <Button
              key={`${option.book}-${option.chapter}-${idx}`}
              variant={
                selectedAnswer === option.chapter && option.book === currentCard.book
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter && option.book === currentCard.book
                  ? "default"
                  : "outline"
              }
              className="h-20 text-4xl"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              {option.symbol}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSummaryQuizMode = () => (
    <Card className={cardGradient}>
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{currentCard.symbol}</div>
        <p className="text-foreground/90 text-sm px-4">{currentCard.summary}</p>
        <p className="text-muted-foreground mt-4">Which chapter is this?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option, idx) => (
            <Button
              key={`${option.book}-${option.chapter}-${idx}`}
              variant={
                selectedAnswer === option.chapter && option.book === currentCard.book
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter && option.book === currentCard.book
                  ? "default"
                  : "outline"
              }
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-lg font-bold">{getChapterLabel(option)}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderFullTestMode = () => (
    <Card className={cardGradient}>
      <CardHeader className="text-center">
        <p className="text-muted-foreground mb-4">Memory Hook:</p>
        <p className="text-xl italic mb-4">"{currentCard.memoryHook}"</p>
        <p className="text-muted-foreground">Which chapter does this hint refer to?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option, idx) => (
            <Button
              key={`${option.book}-${option.chapter}-${idx}`}
              variant={
                selectedAnswer === option.chapter && option.book === currentCard.book
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter && option.book === currentCard.book
                  ? "default"
                  : "outline"
              }
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-3xl mb-1">{option.symbol}</span>
              <span className="text-lg font-bold">{getChapterLabel(option)}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Offline indicator */}
      <OfflineIndicator />
      
      {/* Offline-ready badge */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <WifiOff className="h-4 w-4" />
        <span>Works offline - all {shuffledCards.length} chapters stored locally</span>
      </div>

      {/* Book Set Tabs */}
      <Tabs value={activeSet} onValueChange={setActiveSet}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          {BOOK_SETS.map((set) => (
            <TabsTrigger key={set.id} value={set.id} className="flex flex-col py-2 text-xs">
              <span className="font-medium">{set.label}</span>
              <span className="text-muted-foreground text-[10px]">{set.theme}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {currentIndex + 1} / {shuffledCards.length}
          </Badge>
          {mode !== 'learn' && (
            <Badge variant="outline" className="text-green-400 border-green-500/50">
              Score: {score.correct}/{score.total}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={shuffleCards}>
            <Shuffle className="w-4 h-4 mr-2" />
            Shuffle
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress 
        value={(currentIndex + 1) / shuffledCards.length * 100} 
        className="h-2"
      />

      {/* Mode Selector */}
      {renderModeSelector()}

      {/* Main Card */}
      {mode === 'learn' && renderLearnMode()}
      {mode === 'symbol-to-chapter' && renderSymbolToChapterMode()}
      {mode === 'chapter-to-symbol' && renderChapterToSymbolMode()}
      {mode === 'summary-quiz' && renderSummaryQuizMode()}
      {mode === 'full-test' && renderFullTestMode()}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {mode === 'learn' && (
          <Button
            variant="ghost"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showAnswer ? 'Hide Details' : 'Show Details'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Chapter Overview Grid */}
      <Card className="bg-black/20 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">{currentBookSet.label} Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {currentBookSet.data.map((chapter, idx) => (
              <Button
                key={`${chapter.book}-${chapter.chapter}`}
                variant={currentIndex === idx ? "default" : "ghost"}
                size="sm"
                className={`h-12 w-12 flex flex-col p-1 ${
                  masteredChapters.has(getChapterKey(chapter)) ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => {
                  const newIdx = currentBookSet.data.indexOf(chapter);
                  setShuffledCards([...currentBookSet.data]);
                  setCurrentIndex(newIdx);
                  setShowAnswer(false);
                  setSelectedAnswer(null);
                }}
              >
                <span className="text-lg">{chapter.symbol}</span>
                <span className="text-[10px]">{chapter.chapter}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Extended24FPSDrill;
