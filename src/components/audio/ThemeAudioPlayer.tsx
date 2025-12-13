import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Loader2,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { ThemeVerseSearch, VerseSuggestion } from "@/components/bible/ThemeVerseSearch";
import { useTextToSpeechEnhanced } from "@/hooks/useTextToSpeechEnhanced";

interface ThemeAudioPlayerProps {
  onClose?: () => void;
  className?: string;
}

export function ThemeAudioPlayer({ onClose, className }: ThemeAudioPlayerProps) {
  const [verses, setVerses] = useState<VerseSuggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [themeName, setThemeName] = useState<string>("");

  const {
    speak,
    stop,
    isLoading,
    isPlaying: ttsPlaying,
  } = useTextToSpeechEnhanced({
    onEnd: () => {
      // Auto-advance to next verse
      if (currentIndex < verses.length - 1) {
        setCurrentIndex(prev => prev + 1);
        playVerse(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    },
  });

  const playVerse = useCallback(async (index: number) => {
    if (index >= 0 && index < verses.length) {
      const verse = verses[index];
      setCurrentIndex(index);
      await speak(`${verse.reference}. ${verse.text}`);
    }
  }, [verses, speak]);

  const handlePlayVerses = (selectedVerses: VerseSuggestion[]) => {
    setVerses(selectedVerses);
    setCurrentIndex(0);
    setIsPlaying(true);
    // Start playing first verse
    setTimeout(() => {
      playVerse(0);
    }, 100);
  };

  const handlePlayPause = () => {
    if (ttsPlaying) {
      stop();
      setIsPlaying(false);
    } else if (verses.length > 0) {
      setIsPlaying(true);
      playVerse(currentIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      stop();
      playVerse(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < verses.length - 1) {
      stop();
      playVerse(currentIndex + 1);
    }
  };

  const handleStop = () => {
    stop();
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const currentVerse = verses[currentIndex];

  return (
    <div className={`space-y-4 ${className}`}>
      {verses.length === 0 ? (
        // Show theme search when no verses selected
        <ThemeVerseSearch 
          showAudioOption={true}
          onPlayVerses={handlePlayVerses}
        />
      ) : (
        // Show audio player when verses are loaded
        <Card className="p-4 space-y-4 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                stop();
                setVerses([]);
                setIsPlaying(false);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              New Search
            </Button>
            <Badge variant="secondary">
              {currentIndex + 1} / {verses.length}
            </Badge>
          </div>

          {/* Current Verse Display */}
          {currentVerse && (
            <div className="p-4 rounded-lg bg-card border border-border">
              <Badge variant="outline" className="mb-2 font-mono">
                {currentVerse.reference}
              </Badge>
              <p className="text-sm leading-relaxed mb-2">
                {currentVerse.text}
              </p>
              <p className="text-xs text-muted-foreground italic flex items-start gap-1">
                <BookOpen className="h-3 w-3 mt-0.5 flex-shrink-0" />
                {currentVerse.reason}
              </p>
            </div>
          )}

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isLoading}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              className="h-12 w-12"
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : ttsPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === verses.length - 1 || isLoading}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleStop}
              disabled={!isPlaying && !ttsPlaying}
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          </div>

          {/* Verse List */}
          <ScrollArea className="h-[200px]">
            <div className="space-y-1 pr-2">
              {verses.map((verse, index) => (
                <div
                  key={index}
                  className={`p-2 rounded cursor-pointer transition-colors ${
                    index === currentIndex
                      ? "bg-primary/20 border border-primary/30"
                      : "hover:bg-accent/10"
                  }`}
                  onClick={() => {
                    stop();
                    playVerse(index);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {index === currentIndex && ttsPlaying && (
                      <Volume2 className="h-3 w-3 text-primary animate-pulse" />
                    )}
                    <span className="text-xs font-mono">{verse.reference}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
