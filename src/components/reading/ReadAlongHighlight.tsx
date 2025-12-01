import { useEffect } from 'react';
import { useReadAlong } from '@/hooks/useReadAlong';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadAlongHighlightProps {
  text: string;
  className?: string;
  onComplete?: () => void;
  autoStart?: boolean;
  defaultSpeed?: number; // Words per minute (default: 200)
}

/**
 * Read-along component that highlights words as they are "read"
 * Provides a visual reading experience with adjustable speed
 */
export function ReadAlongHighlight({
  text,
  className,
  onComplete,
  autoStart = false,
  defaultSpeed = 200,
}: ReadAlongHighlightProps) {
  const {
    initialize,
    play,
    pause,
    stop,
    jumpToWord,
    setSpeed,
    isPlaying,
    currentWordIndex,
    words,
    progress,
    wordsPerMinute,
  } = useReadAlong({
    wordsPerMinute: defaultSpeed,
    onComplete,
  });

  // Initialize with text
  useEffect(() => {
    initialize(text);
  }, [text, initialize]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && words.length > 0) {
      const timer = setTimeout(() => play(), 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart, words.length, play]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0]);
  };

  const estimatedMinutes = Math.ceil((words.length / wordsPerMinute));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Controls */}
      <div className="flex items-center gap-3 p-4 bg-accent/50 rounded-lg">
        <Button
          size="sm"
          onClick={handlePlayPause}
          className="flex items-center gap-2"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play
            </>
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={stop}
          disabled={currentWordIndex === -1}
        >
          <Square className="h-4 w-4" />
        </Button>

        {/* Speed Control */}
        <div className="flex items-center gap-2 ml-auto">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground min-w-[60px]">
            {wordsPerMinute} WPM
          </span>
          <Slider
            value={[wordsPerMinute]}
            onValueChange={handleSpeedChange}
            min={100}
            max={400}
            step={25}
            className="w-32"
          />
        </div>

        {/* Reading Time Estimate */}
        <div className="text-sm text-muted-foreground">
          ~{estimatedMinutes} min
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-accent rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Text Display with Highlighting */}
      <div className="p-6 bg-card rounded-lg border leading-relaxed text-lg">
        {words.map((word, index) => {
          const isCurrentWord = index === currentWordIndex;
          const isPastWord = index < currentWordIndex;
          const isFutureWord = index > currentWordIndex;

          return (
            <span
              key={`${word.text}-${index}`}
              onClick={() => jumpToWord(index)}
              className={cn(
                'inline-block px-1 py-0.5 mx-0.5 rounded cursor-pointer transition-all duration-200',
                'hover:bg-accent/30',
                isCurrentWord && 'bg-primary text-primary-foreground font-semibold scale-110 shadow-sm',
                isPastWord && 'text-muted-foreground opacity-60',
                isFutureWord && 'text-foreground'
              )}
              style={{
                transitionProperty: 'all',
                transitionTimingFunction: 'ease-out',
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      {/* Statistics */}
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
        <span>
          Word {currentWordIndex + 1} of {words.length}
        </span>
        <span>
          {Math.round(progress)}% complete
        </span>
      </div>
    </div>
  );
}
