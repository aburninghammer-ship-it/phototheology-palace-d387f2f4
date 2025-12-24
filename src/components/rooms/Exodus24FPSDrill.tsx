import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Trophy
} from "lucide-react";
import { exodus24fpsData, ChapterFrame } from "@/data/exodus24fpsData";
import { toast } from "sonner";

type DrillMode = 'learn' | 'symbol-to-chapter' | 'chapter-to-symbol' | 'summary-quiz' | 'full-test';

export const Exodus24FPSDrill: React.FC = () => {
  const [mode, setMode] = useState<DrillMode>('learn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [shuffledCards, setShuffledCards] = useState<ChapterFrame[]>([...exodus24fpsData]);
  const [quizOptions, setQuizOptions] = useState<ChapterFrame[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [masteredChapters, setMasteredChapters] = useState<Set<number>>(new Set());

  const currentCard = shuffledCards[currentIndex];

  useEffect(() => {
    if (mode !== 'learn') {
      generateQuizOptions();
    }
  }, [currentIndex, mode]);

  const shuffleCards = () => {
    const shuffled = [...exodus24fpsData].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const generateQuizOptions = () => {
    const correct = currentCard;
    const others = exodus24fpsData
      .filter(c => c.chapter !== correct.chapter)
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

  const handleAnswer = (selected: ChapterFrame) => {
    if (selectedAnswer !== null) return;
    
    const isCorrect = selected.chapter === currentCard.chapter;
    setSelectedAnswer(selected.chapter);
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));

    if (isCorrect) {
      setMasteredChapters(prev => new Set([...prev, currentCard.chapter]));
      toast.success("Correct!");
    } else {
      toast.error(`Wrong! It was: Exodus ${currentCard.chapter}`);
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

  const renderLearnMode = () => (
    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{currentCard.symbol}</div>
        <Badge variant="outline" className="w-fit mx-auto mb-2 text-amber-300 border-amber-500/50">
          Exodus {currentCard.chapter}
        </Badge>
        <CardTitle className="text-2xl text-amber-100">{currentCard.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-300 mb-2">Summary</h4>
          <p className="text-amber-100/90">{currentCard.summary}</p>
        </div>
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-amber-300 mb-2">Memory Hook</h4>
          <p className="text-amber-100/90 italic">"{currentCard.memoryHook}"</p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSymbolToChapterMode = () => (
    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
      <CardHeader className="text-center">
        <div className="text-8xl mb-4">{currentCard.symbol}</div>
        <p className="text-amber-200/70">Which Exodus chapter does this represent?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option) => (
            <Button
              key={option.chapter}
              variant={
                selectedAnswer === option.chapter
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter
                  ? "default"
                  : "outline"
              }
              className={`h-auto py-4 flex flex-col gap-1 ${
                selectedAnswer === null ? 'hover:bg-amber-500/20' : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-lg font-bold">Exodus {option.chapter}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderChapterToSymbolMode = () => (
    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
      <CardHeader className="text-center">
        <Badge variant="outline" className="w-fit mx-auto mb-2 text-amber-300 border-amber-500/50">
          Exodus {currentCard.chapter}
        </Badge>
        <CardTitle className="text-2xl text-amber-100">{currentCard.title}</CardTitle>
        <p className="text-amber-200/70 mt-2">What symbol represents this chapter?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option) => (
            <Button
              key={option.chapter}
              variant={
                selectedAnswer === option.chapter
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter
                  ? "default"
                  : "outline"
              }
              className={`h-20 text-4xl ${
                selectedAnswer === null ? 'hover:bg-amber-500/20' : ''
              }`}
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
    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">{currentCard.symbol}</div>
        <p className="text-amber-200/90 text-sm px-4">{currentCard.summary}</p>
        <p className="text-amber-200/70 mt-4">Which chapter is this?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option) => (
            <Button
              key={option.chapter}
              variant={
                selectedAnswer === option.chapter
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter
                  ? "default"
                  : "outline"
              }
              className={`h-auto py-4 flex flex-col gap-1 ${
                selectedAnswer === null ? 'hover:bg-amber-500/20' : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-lg font-bold">Exodus {option.chapter}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderFullTestMode = () => (
    <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-amber-500/30">
      <CardHeader className="text-center">
        <p className="text-amber-200/70 mb-4">Memory Hook:</p>
        <p className="text-xl text-amber-100 italic mb-4">"{currentCard.memoryHook}"</p>
        <p className="text-amber-200/70">Which chapter does this hint refer to?</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quizOptions.map((option) => (
            <Button
              key={option.chapter}
              variant={
                selectedAnswer === option.chapter
                  ? option.chapter === currentCard.chapter
                    ? "default"
                    : "destructive"
                  : selectedAnswer !== null && option.chapter === currentCard.chapter
                  ? "default"
                  : "outline"
              }
              className={`h-auto py-4 flex flex-col gap-1 ${
                selectedAnswer === null ? 'hover:bg-amber-500/20' : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="text-3xl mb-1">{option.symbol}</span>
              <span className="text-lg font-bold">Exodus {option.chapter}</span>
              <span className="text-xs opacity-80">{option.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
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
        className="h-2 bg-amber-900/30"
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
      <Card className="bg-black/20 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-lg text-amber-200">Exodus 1-24 Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {exodus24fpsData.map((chapter) => (
              <Button
                key={chapter.chapter}
                variant={currentIndex === exodus24fpsData.indexOf(chapter) ? "default" : "ghost"}
                size="sm"
                className={`h-12 w-12 flex flex-col p-1 ${
                  masteredChapters.has(chapter.chapter) ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => {
                  setCurrentIndex(exodus24fpsData.indexOf(chapter));
                  setShuffledCards([...exodus24fpsData]);
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

export default Exodus24FPSDrill;
