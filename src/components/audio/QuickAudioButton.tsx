import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { getGlobalMusicVolume, subscribeToMusicVolume } from "@/hooks/useMusicVolumeControl";

// Longer silent audio that works more reliably on iOS
const SILENT_AUDIO = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

// Detect if we're on mobile/Capacitor
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window as any).Capacitor?.isNativePlatform?.();
};

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

    // Also stop any browser speech synthesis
    if (isPlaying && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    if (!text.trim()) {
      toast.error("No text to read");
      return;
    }

    // On mobile, try browser TTS first as it's more reliable
    if (isMobile() && 'speechSynthesis' in window) {
      console.log('[QuickAudio] Mobile detected, using browser speechSynthesis');
      try {
        // Cancel any existing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.lang = 'en-US'; // Set language explicitly for better mobile support

        // Get available voices - may need to wait for voiceschanged on some browsers
        let voices = speechSynthesis.getVoices();

        // If voices not loaded yet, try to trigger load and wait briefly
        if (voices.length === 0) {
          console.log('[QuickAudio] Voices not loaded, attempting to trigger...');
          // Some browsers need this to trigger voice loading
          speechSynthesis.speak(new SpeechSynthesisUtterance(''));
          speechSynthesis.cancel();
          // Wait a moment for voices to load
          await new Promise(resolve => setTimeout(resolve, 100));
          voices = speechSynthesis.getVoices();
        }

        if (voices.length > 0) {
          const englishVoice = voices.find(v =>
            v.lang.startsWith('en') && (v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Google'))
          ) || voices.find(v => v.lang.startsWith('en'));

          if (englishVoice) {
            utterance.voice = englishVoice;
            console.log('[QuickAudio] Using voice:', englishVoice.name);
          }
        } else {
          console.log('[QuickAudio] No voices available, using default');
        }

        // Set state immediately for better UX
        setIsPlaying(true);
        notifyTTSStarted();

        utterance.onend = () => {
          console.log('[QuickAudio] Speech ended');
          setIsPlaying(false);
          notifyTTSStopped();
        };

        utterance.onerror = (e) => {
          console.error('[QuickAudio] Speech synthesis error:', e);
          setIsPlaying(false);
          notifyTTSStopped();
          // Don't show toast on 'interrupted' or 'canceled' errors
          if (e.error !== 'interrupted' && e.error !== 'canceled') {
            toast.error("Speech failed, try again");
          }
        };

        speechSynthesis.speak(utterance);
        console.log('[QuickAudio] Speaking started');
        return;
      } catch (err) {
        console.error('[QuickAudio] Browser TTS failed, trying cloud TTS:', err);
        setIsPlaying(false);
      }
    }

    // CRITICAL: Unlock audio BEFORE async work to preserve user gesture on mobile
    unlockAudio();

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice: "daniel", returnType: "url" }
      });

      if (error) throw error;

      // Prefer URL response (better for mobile)
      const audioUrl = data?.audioUrl || (data?.audioContent ? `data:audio/mpeg;base64,${data.audioContent}` : null);

      if (!audioUrl) {
        throw new Error("No audio content returned");
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.volume = volumeRef.current / 100;
      console.log('[QuickAudio] Volume set to:', volumeRef.current, '%');

      audio.onended = () => {
        setIsPlaying(false);
        notifyTTSStopped();
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
        notifyTTSStopped();
        // Fallback to browser TTS on error
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
          toast.error("Audio playback failed");
        }
      };

      try {
        await audio.play();
        setIsPlaying(true);
        notifyTTSStarted();
      } catch (playErr) {
        console.warn("[QuickAudio] Play blocked, falling back to browser TTS:", playErr);

        // On mobile, fallback immediately to browser TTS instead of waiting
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
          toast.info('Tap anywhere to start audio');
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
        }
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
