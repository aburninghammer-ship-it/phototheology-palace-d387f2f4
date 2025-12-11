import { useState, useRef, useEffect } from "react";
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
  Wifi,
  WifiOff,
  CloudOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTextToSpeechEnhanced, VoiceId } from "@/hooks/useTextToSpeechEnhanced";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface AudioNarratorEnhancedProps {
  text: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  voice?: VoiceId;
  showVoiceSelector?: boolean;
  mode?: 'speechify' | 'browser' | 'auto';
}

export const AudioNarratorEnhanced = ({
  text,
  title,
  className,
  autoPlay = false,
  voice: initialVoice = "henry",
  showVoiceSelector = true,
  mode = 'auto'
}: AudioNarratorEnhancedProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  const isMobile = useIsMobile();

  const {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices,
    currentMode,
    networkStatus,
    browserVoices,
    selectedBrowserVoice,
    setSelectedBrowserVoice,
  } = useTextToSpeechEnhanced({
    defaultVoice: initialVoice,
    mode,
    onStart: () => {
      notifyTTSStarted();
    },
    onEnd: () => {
      notifyTTSStopped();
    },
    timeout: 15000, // 15 second timeout
  });

  // Auto-play on mount if requested and online
  useEffect(() => {
    if (autoPlay && text && networkStatus !== 'offline') {
      speak(text);
    }
  }, [autoPlay]); // Only run on mount

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      speak(text);
    }
  };

  const handleVoiceChange = (newVoice: VoiceId) => {
    setSelectedVoice(newVoice);
    // If currently playing, stop and restart with new voice
    if (isPlaying) {
      stop();
    }
  };

  const handleBrowserVoiceChange = (voiceName: string) => {
    const voice = browserVoices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedBrowserVoice(voice);
      // If currently playing with browser TTS, restart
      if (isPlaying && currentMode === 'browser') {
        stop();
      }
    }
  };

  const getNetworkStatusIcon = () => {
    switch (networkStatus) {
      case 'offline':
        return <WifiOff className="h-3 w-3 text-destructive" />;
      case 'slow':
        return <CloudOff className="h-3 w-3 text-yellow-500" />;
      default:
        return <Wifi className="h-3 w-3 text-green-500" />;
    }
  };

  const getNetworkStatusText = () => {
    switch (networkStatus) {
      case 'offline':
        return 'Offline';
      case 'slow':
        return 'Slow Connection';
      default:
        return 'Online';
    }
  };

  const getModeStatusBadge = () => {
    if (currentMode === 'browser') {
      return (
        <Badge variant="outline" className="text-xs">
          <Smartphone className="h-3 w-3 mr-1" />
          Browser Voice
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-xs bg-primary/10">
          <Headphones className="h-3 w-3 mr-1" />
          Premium Voice
        </Badge>
      );
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      <CardContent className="p-4 space-y-3">
        {/* Header with title and network status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {title && (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Headphones className="h-4 w-4 text-primary" />
                {title}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isPlaying && getModeStatusBadge()}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getNetworkStatusIcon()}
              <span className="hidden sm:inline">{getNetworkStatusText()}</span>
            </div>
          </div>
        </div>

        {/* Voice Selector */}
        {showVoiceSelector && (
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-muted-foreground" />

            {/* Show browser voice selector if using browser mode or offline */}
            {(currentMode === 'browser' || networkStatus === 'offline') ? (
              <Select
                value={selectedBrowserVoice?.name || ''}
                onValueChange={handleBrowserVoiceChange}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select browser voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {browserVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name} className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-muted-foreground text-[10px]">{voice.lang}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={selectedVoice} onValueChange={(v) => handleVoiceChange(v as VoiceId)}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {voices.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id} className="text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-muted-foreground text-[10px]">{voice.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {/* Offline mode indicator */}
        {networkStatus === 'offline' && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-xs">
            <CloudOff className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Using offline browser voice. Connect to internet for premium voices.
            </span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-3">
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

          {/* Volume - hidden on mobile */}
          {!isMobile ? (
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
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
                onValueChange={(value) => {
                  setVolume(value[0]);
                  setIsMuted(false);
                }}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">
                {isMuted ? 0 : volume}%
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Smartphone className="h-3 w-3" />
              <span>System volume</span>
            </div>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-xs text-center text-muted-foreground">
            {networkStatus === 'slow' ? 'Slow connection detected...' : 'Generating audio...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
