import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { getGlobalMusicVolume, subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";

const SILENT_AUDIO = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA';

interface QuickAudioButtonProps {
  text: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function QuickAudioButton({ 
  text, 
  variant = "ghost", 
  size = "icon",
  className 
}: QuickAudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(getGlobalMusicVolume);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const volumeRef = useRef(volume);

  // Keep volumeRef in sync and apply to current audio
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Subscribe to global volume changes
  useEffect(() => {
    const unsubscribe = subscribeToMusicVolume((newVolume) => {
      setVolume(newVolume);
    });
    return unsubscribe;
  }, []);

  // Unlock audio for mobile before async work
  const unlockAudio = useCallback(() => {
    if (audioUnlockedRef.current) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    audio.src = SILENT_AUDIO;
    audio.volume = 0.01;
    audio.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      audioUnlockedRef.current = true;
      console.log('[QuickAudio] Audio unlocked for mobile');
    }).catch(() => {
      // Expected to fail if not in user gesture context
    });
  }, []);

  const handleClick = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    // CRITICAL: Unlock audio BEFORE async work to preserve user gesture on mobile
    unlockAudio();

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "daniel" }
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        
        const audio = audioRef.current;
        audio.src = audioUrl;
        audio.volume = volumeRef.current / 100; // Apply volume from 0-100 scale
        console.log('[QuickAudio] Volume set to:', volumeRef.current, '%');
        
        audio.onended = () => {
          setIsPlaying(false);
          notifyTTSStopped();
        };

        audio.onerror = (e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          notifyTTSStopped();
          toast.error("Audio playback failed");
        };

        try {
          await audio.play();
          setIsPlaying(true);
          notifyTTSStarted();
        } catch (playErr) {
          console.warn("[QuickAudio] Play blocked, waiting for interaction:", playErr);
          
          const playOnInteraction = async () => {
            try {
              await audio.play();
              setIsPlaying(true);
              notifyTTSStarted();
              document.body.removeEventListener('click', playOnInteraction);
              document.body.removeEventListener('touchstart', playOnInteraction);
            } catch (err) {
              console.error("[QuickAudio] Play still failed:", err);
            }
          };
          
          document.body.addEventListener('click', playOnInteraction, { once: true });
          document.body.addEventListener('touchstart', playOnInteraction, { once: true });
          toast.info('Tap anywhere to start audio');
        }
      } else {
        throw new Error("No audio content returned");
      }
    } catch (err) {
      console.error("TTS error:", err);
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => {
          setIsPlaying(false);
          notifyTTSStopped();
        };
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
        notifyTTSStarted();
      } else {
        toast.error("Audio not available");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      title={isPlaying ? "Stop" : "Listen"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </Button>
  );
}
