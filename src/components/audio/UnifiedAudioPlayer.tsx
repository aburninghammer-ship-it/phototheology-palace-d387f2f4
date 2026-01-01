/**
 * UnifiedAudioPlayer - Clean, simple audio player for Bible TTS
 */

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Loader2,
  Headphones,
  Mic,
  Smartphone,
  Square,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioBible, OpenAIVoice, OPENAI_VOICES } from "@/hooks/useAudioBible";
import { useIsMobile } from "@/hooks/use-mobile";
import { audioEngine } from "@/lib/AudioEngine";
import { useState } from "react";

interface UnifiedAudioPlayerProps {
  text: string;
  title?: string;
  className?: string;
  showVoiceSelector?: boolean;
  showSpeedSelector?: boolean;
  compact?: boolean;
  onEnded?: () => void;
}

export function UnifiedAudioPlayer({
  text,
  title,
  className,
  showVoiceSelector = true,
  showSpeedSelector = true,
  compact = false,
  onEnded,
}: UnifiedAudioPlayerProps) {
  const isMobile = useIsMobile();
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const {
    isPlaying,
    isPaused,
    isLoading,
    progress,
    duration,
    error,
    voice,
    setVoice,
    speed,
    setSpeed,
    playText,
    pause,
    resume,
    stop,
    skip,
    unlock,
  } = useAudioBible({ onEnded });

  const handlePlayPause = async () => {
    // Unlock audio on first interaction
    await unlock();

    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      await playText(text);
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleVoiceChange = (newVoice: OpenAIVoice) => {
    setVoice(newVoice);
    // Stop current playback when voice changes
    if (isPlaying || isPaused) {
      stop();
    }
  };

  const handleSpeedChange = (newSpeed: string) => {
    setSpeed(parseFloat(newSpeed));
  };

  const handleProgressChange = (value: number[]) => {
    const newProgress = value[0];
    const currentDuration = duration || 0;
    if (currentDuration > 0) {
      const seekTime = (newProgress / 100) * currentDuration;
      audioEngine.seek(seekTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioEngine.setVolume(newVolume / 100);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      audioEngine.setVolume(volume / 100);
      setIsMuted(false);
    } else {
      audioEngine.setVolume(0);
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentTime = duration ? (progress / 100) * duration : 0;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Button
          onClick={handlePlayPause}
          disabled={isLoading}
          size="icon"
          variant="ghost"
          className="h-8 w-8"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        {(isPlaying || isPaused) && (
          <Button
            onClick={handleStop}
            size="icon"
            variant="ghost"
            className="h-8 w-8"
          >
            <Square className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-4 space-y-3">
        {/* Header Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {title && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <Headphones className="h-4 w-4 text-primary" />
              {title}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            {/* Voice Selector */}
            {showVoiceSelector && (
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-muted-foreground" />
                <Select value={voice} onValueChange={handleVoiceChange}>
                  <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-background border-border">
                    {OPENAI_VOICES.map((v) => (
                      <SelectItem
                        key={v.id}
                        value={v.id}
                        className="text-xs py-2.5 px-3 cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{v.name}</span>
                          <span className="text-muted-foreground text-[10px]">
                            {v.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Speed Selector */}
            {showSpeedSelector && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Speed:</span>
                <Select value={speed.toString()} onValueChange={handleSpeedChange}>
                  <SelectTrigger className="w-[90px] h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5" className="text-xs">0.5x</SelectItem>
                    <SelectItem value="0.75" className="text-xs">0.75x</SelectItem>
                    <SelectItem value="1" className="text-xs">1.0x</SelectItem>
                    <SelectItem value="1.25" className="text-xs">1.25x</SelectItem>
                    <SelectItem value="1.5" className="text-xs">1.5x</SelectItem>
                    <SelectItem value="2" className="text-xs">2.0x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
            {error}
          </div>
        )}

        {/* Controls Row */}
        <div className="flex items-center gap-3">
          {/* Skip Back */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(-10)}
            disabled={!isPlaying && !isPaused}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {/* Play/Pause */}
          <Button
            onClick={handlePlayPause}
            disabled={isLoading}
            size="icon"
            className="h-12 w-12 rounded-full gradient-palace"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => skip(10)}
            disabled={!isPlaying && !isPaused}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          {/* Progress */}
          <div className="flex-1 space-y-1">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              disabled={!isPlaying && !isPaused}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume (desktop only) */}
          {!isMobile ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>System vol</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
