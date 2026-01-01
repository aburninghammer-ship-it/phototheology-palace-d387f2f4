/**
 * MiniPlayer - Floating mini audio player
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, X, ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { audioEngine, AudioState } from "@/lib/AudioEngine";
import { motion, AnimatePresence } from "framer-motion";

interface MiniPlayerProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  onExpand?: () => void;
  className?: string;
}

export function MiniPlayer({
  title = "Now Playing",
  subtitle,
  onClose,
  onExpand,
  className,
}: MiniPlayerProps) {
  const [state, setState] = useState<AudioState>(audioEngine.getState());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleStateChange = (newState: AudioState) => {
      setState(newState);
    };

    const handleProgress = (currentTime: number, duration: number) => {
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    };

    audioEngine.on('stateChange', handleStateChange);
    audioEngine.on('progress', handleProgress);

    return () => {
      audioEngine.off('stateChange', handleStateChange);
      audioEngine.off('progress', handleProgress);
    };
  }, []);

  const isPlaying = state === 'playing';
  const isPaused = state === 'paused';
  const isLoading = state === 'loading' || state === 'unlocking';
  const isActive = isPlaying || isPaused || isLoading;

  const handlePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
    } else if (isPaused) {
      audioEngine.resume();
    }
  };

  const handleClose = () => {
    audioEngine.stop();
    onClose?.();
  };

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className={cn(
          "fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80",
          className
        )}
      >
        <div className="bg-card/95 backdrop-blur-lg border border-border rounded-xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-3 flex items-center gap-3">
            {/* Play/Pause button */}
            <Button
              onClick={handlePlayPause}
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full bg-primary/10 hover:bg-primary/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 text-primary" />
              ) : (
                <Play className="h-5 w-5 text-primary ml-0.5" />
              )}
            </Button>

            {/* Title/Info */}
            <div className="flex-1 min-w-0" onClick={onExpand}>
              <p className="text-sm font-medium truncate">{title}</p>
              {subtitle && (
                <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>

            {/* Expand button (optional) */}
            {onExpand && (
              <Button
                onClick={onExpand}
                size="icon"
                variant="ghost"
                className="h-8 w-8"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            )}

            {/* Close button */}
            <Button
              onClick={handleClose}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
