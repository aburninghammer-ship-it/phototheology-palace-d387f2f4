import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  Settings,
  Loader2,
  Download,
} from "lucide-react";
import { Verse } from "@/types/bible";
import { OPENAI_VOICES, OpenAIVoice } from "@/services/ttsService";

// Alias for backward compatibility
type VoiceId = OpenAIVoice;
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { ExportBibleAudioDialog } from "./ExportBibleAudioDialog";
import { getCachedTTSAudio, cacheTTSAudio } from "@/services/offlineAudioCache";

interface AudioControlsProps {
  verses: Verse[];
  book?: string;
  chapter?: number;
  onVerseHighlight?: (verseNumber: number) => void;
  className?: string;
}

// Tiny silent WAV as data URI to unlock iOS audio
// This is a valid 44-byte WAV file with 2 bytes of silent audio data
const SILENT_AUDIO = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";

// Better silent audio for iOS 17+ (requires slightly longer duration)
const SILENT_AUDIO_IOS = "data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1NvZnR3YXJlAExhdmY1OC43Ni4xMDAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7v/////////////////////////////////";

// Detect if we're on mobile/Capacitor
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window as any).Capacitor?.isNativePlatform?.();
};

export const AudioControls = ({ verses, book = "", chapter = 1, onVerseHighlight, className }: AudioControlsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>("onyx");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [useBrowserTTS, setUseBrowserTTS] = useState(false); // Fallback for mobile
  
  // Use a persistent audio element to avoid iOS autoplay restrictions
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const versesRef = useRef(verses);
  const playbackRateRef = useRef(playbackRate);
  const selectedVoiceRef = useRef(selectedVoice);
  const playVerseAtIndexRef = useRef<((index: number) => Promise<void>) | null>(null);
  const audioUnlockedRef = useRef(false);
  
  // Prefetch cache for smoother playback
  const prefetchCacheRef = useRef<Map<number, string>>(new Map());
  const prefetchingRef = useRef<Set<number>>(new Set());

  // Keep refs in sync
  versesRef.current = verses;
  playbackRateRef.current = playbackRate;
  selectedVoiceRef.current = selectedVoice;

  // Clear prefetch cache when voice changes
  useEffect(() => {
    prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
    prefetchCacheRef.current.clear();
  }, [selectedVoice]);

  // Eager-load first 3 verses when component mounts for instant playback
  const eagerLoadedRef = useRef(false);
  useEffect(() => {
    if (eagerLoadedRef.current || verses.length === 0) return;
    eagerLoadedRef.current = true;

    // Use requestIdleCallback for non-blocking prefetch, with timeout fallback
    const prefetchFirst = () => {
      // Prefetch first 3 verses in parallel
      Promise.all([
        generateTTSForEagerLoad(verses[0]?.text, selectedVoice, verses[0]?.verse),
        verses[1] ? generateTTSForEagerLoad(verses[1].text, selectedVoice, verses[1].verse) : null,
        verses[2] ? generateTTSForEagerLoad(verses[2].text, selectedVoice, verses[2].verse) : null,
      ]).then(urls => {
        urls.forEach((url, index) => {
          if (url && !prefetchCacheRef.current.has(index)) {
            prefetchCacheRef.current.set(index, url);
          }
        });
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchFirst, { timeout: 2000 });
    } else {
      setTimeout(prefetchFirst, 500);
    }
  }, [verses, selectedVoice]);

  // Lightweight TTS call for eager loading (doesn't set loading state)
  const generateTTSForEagerLoad = async (text: string | undefined, voice: VoiceId, verseNum?: number): Promise<string | null> => {
    if (!text) return null;
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text,
          voice,
          returnType: "url",
          book,
          chapter,
          verse: verseNum,
          useCache: verseNum !== undefined,
          provider: "openai",
        },
      });
      if (error || !data?.audioUrl) return null;
      return data.audioUrl as string;
    } catch {
      return null;
    }
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Initialize persistent audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      let isProcessingEnded = false; // Prevent double-firing

      audio.onended = () => {
        console.log("[AudioControls] onended fired, isPlaying:", isPlayingRef.current, "currentIndex:", currentIndexRef.current);

        if (!isPlayingRef.current) {
          console.log("[AudioControls] Not playing, ignoring onended");
          return;
        }

        // Prevent double-firing
        if (isProcessingEnded) {
          console.log("[AudioControls] Already processing onended, ignoring");
          return;
        }
        isProcessingEnded = true;

        const nextIndex = currentIndexRef.current + 1;
        console.log("[AudioControls] Moving to next verse:", nextIndex, "of", versesRef.current.length);

        if (nextIndex < versesRef.current.length) {
          // Small delay to prevent race conditions
          setTimeout(() => {
            isProcessingEnded = false;
            if (isPlayingRef.current) {
              playVerseAtIndexRef.current?.(nextIndex);
            }
          }, 100);
        } else {
          isProcessingEnded = false;
          setIsPlaying(false);
          isPlayingRef.current = false;
          notifyTTSStopped();
          toast.success("Finished reading chapter");
        }
      };

      audio.onerror = () => {
        isProcessingEnded = false;
        const mediaError = audio?.error;
        console.error("[Audio] Playback error:", {
          code: mediaError?.code,
          message: mediaError?.message,
          src: audio?.src?.substring(0, 100),
        });
        // Don't show error for silent audio unlock
        if (audio.src !== SILENT_AUDIO) {
          toast.error("Audio playback failed");
          setIsPlaying(false);
          isPlayingRef.current = false;
        }
      };
      
      audioRef.current = audio;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      // Clear prefetch cache on unmount
      prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
      prefetchCacheRef.current.clear();
    };
  }, []);

  // Unlock audio on iOS by playing silent audio on first user interaction
  const unlockAudio = useCallback(async () => {
    if (audioUnlockedRef.current || !audioRef.current) return;

    try {
      const audio = audioRef.current;
      // Try iOS-specific audio first, fall back to WAV
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      audio.src = isIOS ? SILENT_AUDIO_IOS : SILENT_AUDIO;
      audio.volume = 0.5; // Use audible volume - iOS may not unlock with 0 volume
      audio.muted = false;

      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      audio.src = ''; // Clear but keep element
      audioUnlockedRef.current = true;
      console.log("[Audio] Audio unlocked for iOS/mobile");
    } catch (e: any) {
      console.log("[Audio] Audio unlock attempt:", e?.message || e);
      // Mark as attempted even on failure to prevent blocking
      // Next user gesture will try again
    }
  }, []);

  const generateTTS = useCallback(async (text: string, voice: VoiceId, verseNum?: number): Promise<string | null> => {
    try {
      // Check client-side cache first for instant playback
      if (book && verseNum !== undefined) {
        const cachedUrl = await getCachedTTSAudio(book, chapter, verseNum);
        if (cachedUrl) {
          console.log("[TTS] Using client-cached audio for", book, chapter, verseNum);
          return cachedUrl;
        }
      }

      console.log("[TTS] Calling text-to-speech function, mobile:", isMobile());

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: {
          text,
          voice,
          // Prefer URL responses on mobile to avoid huge base64 payloads
          returnType: "url",
          // Enable backend caching when verse metadata is available
          book,
          chapter,
          verse: verseNum,
          useCache: verseNum !== undefined,
          provider: "openai",
        },
      });

      if (error) {
        console.error("[TTS] Function error:", error);
        throw error;
      }

      // Preferred path: URL (cached or freshly generated)
      if (data?.audioUrl) {
        console.log("[TTS] Got audio URL, fetching as blob for reliable mobile playback...");

        // On mobile, always fetch as blob for more reliable playback
        // Direct URL playback can fail due to CORS/autoplay policies
        try {
          const response = await fetch(data.audioUrl);
          if (!response.ok) {
            console.warn("[TTS] Failed to fetch audio blob, using URL directly");
            return data.audioUrl as string;
          }
          const blob = await response.blob();

          // Cache the blob for faster repeat access
          if (book && verseNum !== undefined) {
            cacheTTSAudio(book, chapter, verseNum, blob).catch(() => {});
          }

          const blobUrl = URL.createObjectURL(blob);
          console.log("[TTS] Created blob URL for playback");
          return blobUrl;
        } catch (fetchErr) {
          console.warn("[TTS] Blob fetch failed, using URL directly:", fetchErr);
          return data.audioUrl as string;
        }
      }

      // Fallback: base64
      if (data?.audioContent) {
        console.log("[TTS] Using base64 fallback");
        const binaryString = atob(data.audioContent);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: "audio/mpeg" });
        // Cache the blob for faster repeat access
        if (book && verseNum !== undefined) {
          cacheTTSAudio(book, chapter, verseNum, blob).catch(() => {});
        }
        return URL.createObjectURL(blob);
      }

      console.error("[TTS] No audioUrl/audioContent in response:", data);
      return null;
    } catch (e) {
      console.error("[TTS] Error generating TTS:", e);
      return null;
    }
  }, [book, chapter]);

  // Prefetch audio for a verse index
  const prefetchVerse = useCallback(async (verseIndex: number) => {
    const currentVerses = versesRef.current;
    if (verseIndex < 0 || verseIndex >= currentVerses.length) return;
    if (prefetchCacheRef.current.has(verseIndex)) return;
    if (prefetchingRef.current.has(verseIndex)) return;
    
    prefetchingRef.current.add(verseIndex);
    const verse = currentVerses[verseIndex];
    const url = await generateTTS(verse.text, selectedVoiceRef.current);
    prefetchingRef.current.delete(verseIndex);
    
    if (url) {
      prefetchCacheRef.current.set(verseIndex, url);
    }
  }, [generateTTS]);

  const playVerseAtIndex = useCallback(async (verseIndex: number) => {
    const currentVerses = versesRef.current;
    const audio = audioRef.current;

    console.log("[AudioControls] playVerseAtIndex called with index:", verseIndex, "total verses:", currentVerses.length);

    if (verseIndex < 0 || verseIndex >= currentVerses.length || !audio) {
      console.log("[AudioControls] Invalid index or no audio element, stopping");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Update index BEFORE doing anything else
    currentIndexRef.current = verseIndex;
    console.log("[AudioControls] Set currentIndexRef to:", verseIndex);

    const verse = currentVerses[verseIndex];
    setCurrentVerse(verse.verse);
    onVerseHighlight?.(verse.verse);
    
    // Check if we have prefetched audio
    let url = prefetchCacheRef.current.get(verseIndex);
    
    if (!url) {
      setIsLoading(true);
      url = await generateTTS(verse.text, selectedVoiceRef.current);
      setIsLoading(false);
    } else {
      // Remove from cache since we're using it
      prefetchCacheRef.current.delete(verseIndex);
    }

    if (!url) {
      toast.error("Failed to generate audio");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    // Prefetch next 5 verses in parallel for smooth playback
    Promise.all([
      prefetchVerse(verseIndex + 1),
      prefetchVerse(verseIndex + 2),
      prefetchVerse(verseIndex + 3),
      prefetchVerse(verseIndex + 4),
      prefetchVerse(verseIndex + 5),
    ]);

    // Revoke old URL
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    audioUrlRef.current = url;

    // Update existing audio element instead of creating new one
    audio.src = url;
    audio.playbackRate = playbackRateRef.current;

    try {
      console.log("[AudioControls] Attempting to play audio...");
      await audio.play();
      console.log("[AudioControls] Audio playing successfully");
      notifyTTSStarted();
    } catch (err: any) {
      console.error("[AudioControls] Play error:", err?.name, err?.message);

      // On mobile, if autoplay is blocked, try to recover
      if (err?.name === 'NotAllowedError') {
        console.log("[AudioControls] Autoplay blocked, showing user prompt");
        toast.info("Tap play again to start audio");
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }

      // Check if it's a media error
      if (err?.name === 'AbortError') {
        console.log("[AudioControls] Play aborted, possibly due to source change");
        return;
      }

      toast.error("Could not play audio. Please try again.");
      setIsPlaying(false);
      isPlayingRef.current = false;
      notifyTTSStopped();
    }
  }, [generateTTS, onVerseHighlight, prefetchVerse]);

  // Keep the ref updated
  playVerseAtIndexRef.current = playVerseAtIndex;

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  // Clear prefetch cache when voice changes
  const clearPrefetchCache = useCallback(() => {
    prefetchCacheRef.current.forEach(url => URL.revokeObjectURL(url));
    prefetchCacheRef.current.clear();
  }, []);

  // Wait for voices to load with timeout
  const waitForVoices = useCallback((): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      // Set up listener for voiceschanged event
      const onVoicesChanged = () => {
        voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(voices);
        }
      };

      speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

      // Trigger voice loading on some browsers
      speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      speechSynthesis.cancel();

      // Timeout after 2 seconds - use default voice if voices still don't load
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        resolve(speechSynthesis.getVoices());
      }, 2000);
    });
  }, []);

  // Browser TTS playback for mobile fallback
  const playVerseBrowserTTS = useCallback(async (verseIndex: number) => {
    if (!('speechSynthesis' in window)) {
      console.error('[AudioControls] speechSynthesis not available');
      toast.error("Speech synthesis not supported on this device");
      setIsPlaying(false);
      isPlayingRef.current = false;
      return;
    }

    const verse = versesRef.current[verseIndex];
    if (!verse) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      notifyTTSStopped();
      toast.success("Finished reading chapter");
      return;
    }

    currentIndexRef.current = verseIndex;
    setCurrentVerse(verse.verse);
    onVerseHighlight?.(verse.verse);

    // Cancel any existing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(verse.text);
    utterance.rate = playbackRateRef.current;
    utterance.pitch = 1;
    utterance.lang = 'en-US';

    // Wait for voices to load with proper timeout
    console.log('[AudioControls] Waiting for voices to load...');
    const voices = await waitForVoices();
    console.log('[AudioControls] Loaded', voices.length, 'voices');

    if (voices.length > 0) {
      // Prefer high-quality voices
      const englishVoice = voices.find(v =>
        v.lang.startsWith('en') && (v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Premium'))
      ) || voices.find(v => v.lang.startsWith('en') && !v.localService) // Prefer non-local voices
        || voices.find(v => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
        console.log('[AudioControls] Using voice:', englishVoice.name);
      }
    } else {
      console.warn('[AudioControls] No voices available, using system default');
    }

    // Set up a safety timeout in case onend never fires (common iOS issue)
    let safetyTimeout: NodeJS.Timeout | null = null;
    const estimatedDuration = Math.max(5000, verse.text.length * 80); // Rough estimate: 80ms per character

    const cleanup = () => {
      if (safetyTimeout) {
        clearTimeout(safetyTimeout);
        safetyTimeout = null;
      }
    };

    utterance.onend = () => {
      cleanup();
      if (!isPlayingRef.current) return;
      const nextIndex = verseIndex + 1;
      if (nextIndex < versesRef.current.length) {
        // Small pause between verses
        setTimeout(() => {
          if (isPlayingRef.current) {
            playVerseBrowserTTS(nextIndex);
          }
        }, 300);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        notifyTTSStopped();
        toast.success("Finished reading chapter");
      }
    };

    utterance.onerror = (e) => {
      cleanup();
      console.error('[AudioControls] Speech synthesis error:', e);
      setIsPlaying(false);
      isPlayingRef.current = false;
      notifyTTSStopped();
      // Don't show toast on 'interrupted' or 'canceled' errors
      if ((e as any).error !== 'interrupted' && (e as any).error !== 'canceled') {
        toast.error("Speech synthesis error - try cloud audio instead");
      }
    };

    // Safety timeout - if speech takes too long, assume it's stuck
    safetyTimeout = setTimeout(() => {
      console.warn('[AudioControls] Safety timeout triggered - speech may be stuck');
      // Check if speech is still pending
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        console.log('[AudioControls] Canceling stuck speech');
        speechSynthesis.cancel();
        // Move to next verse anyway
        if (isPlayingRef.current) {
          const nextIndex = verseIndex + 1;
          if (nextIndex < versesRef.current.length) {
            setTimeout(() => playVerseBrowserTTS(nextIndex), 100);
          } else {
            setIsPlaying(false);
            isPlayingRef.current = false;
            notifyTTSStopped();
          }
        }
      }
    }, estimatedDuration);

    notifyTTSStarted();

    try {
      speechSynthesis.speak(utterance);
      console.log('[AudioControls] Speaking verse', verse.verse, '- estimated duration:', estimatedDuration, 'ms');

      // iOS fix: Check if speaking actually started after a short delay
      setTimeout(() => {
        if (isPlayingRef.current && !speechSynthesis.speaking && !speechSynthesis.pending) {
          console.warn('[AudioControls] Speech did not start - trying again');
          speechSynthesis.speak(utterance);
        }
      }, 200);
    } catch (err) {
      cleanup();
      console.error('[AudioControls] Failed to speak:', err);
      setIsPlaying(false);
      isPlayingRef.current = false;
      notifyTTSStopped();
      toast.error("Failed to start speech - try cloud audio");
    }
  }, [onVerseHighlight, waitForVoices]);

  const play = useCallback(async (startVerseIndex?: number) => {
    const index = startVerseIndex ?? verses.findIndex(v => v.verse === currentVerse);
    const verseIdx = index >= 0 ? index : 0;

    // Unlock audio on iOS/mobile first (critical for cloud TTS playback)
    await unlockAudio();

    // On mobile, use cloud TTS for reliability (browser speechSynthesis is unreliable on iOS/Android)
    console.log('[AudioControls] Starting playback, mobile:', isMobile());

    setIsPlaying(true);
    isPlayingRef.current = true;
    setUseBrowserTTS(false);
    playVerseAtIndex(verseIdx);
  }, [currentVerse, verses, playVerseAtIndex, unlockAudio]);

  const pause = useCallback(() => {
    if (useBrowserTTS && 'speechSynthesis' in window) {
      speechSynthesis.pause();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    isPlayingRef.current = false;
    notifyTTSStopped();
  }, [useBrowserTTS]);

  const stop = useCallback(() => {
    if (useBrowserTTS && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    cleanupAudio();
    clearPrefetchCache();
    setIsPlaying(false);
    isPlayingRef.current = false;
    notifyTTSStopped();
    setCurrentVerse(1);
    onVerseHighlight?.(1);
  }, [cleanupAudio, clearPrefetchCache, onVerseHighlight, useBrowserTTS]);

  const nextVerse = useCallback(() => {
    const currentIndex = verses.findIndex(v => v.verse === currentVerse);
    if (currentIndex < verses.length - 1) {
      if (useBrowserTTS && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      cleanupAudio();
      if (isPlaying) {
        if (useBrowserTTS) {
          playVerseBrowserTTS(currentIndex + 1);
        } else {
          playVerseAtIndex(currentIndex + 1);
        }
      } else {
        setCurrentVerse(verses[currentIndex + 1].verse);
        onVerseHighlight?.(verses[currentIndex + 1].verse);
      }
    }
  }, [verses, currentVerse, isPlaying, cleanupAudio, playVerseAtIndex, playVerseBrowserTTS, onVerseHighlight, useBrowserTTS]);

  const previousVerse = useCallback(() => {
    const currentIndex = verses.findIndex(v => v.verse === currentVerse);
    if (currentIndex > 0) {
      if (useBrowserTTS && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      cleanupAudio();
      if (isPlaying) {
        if (useBrowserTTS) {
          playVerseBrowserTTS(currentIndex - 1);
        } else {
          playVerseAtIndex(currentIndex - 1);
        }
      } else {
        setCurrentVerse(verses[currentIndex - 1].verse);
        onVerseHighlight?.(verses[currentIndex - 1].verse);
      }
    }
  }, [verses, currentVerse, isPlaying, cleanupAudio, playVerseAtIndex, playVerseBrowserTTS, onVerseHighlight, useBrowserTTS]);

  const changePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  if (verses.length === 0) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg bg-accent/30 border border-accent/20",
      className
    )}>
      {/* Main Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={previousVerse}
          disabled={currentVerse <= 1 || isLoading}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => isPlaying ? pause() : play()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={nextVerse}
          disabled={currentVerse >= verses.length || isLoading}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={stop}
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Verse Indicator */}
      <div className="flex items-center gap-2 px-2 min-w-[80px]">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">
          v.{currentVerse}/{verses.length}
        </span>
      </div>

      {/* Speed Control */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Speed:</span>
        <Select
          value={playbackRate.toString()}
          onValueChange={(value) => changePlaybackRate(parseFloat(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {playbackRates.map((rate) => (
              <SelectItem key={rate} value={rate.toString()}>
                {rate}x
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Download Button */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setShowExportDialog(true)}
        title="Download chapter audio"
      >
        <Download className="h-4 w-4" />
      </Button>

      {/* Settings Popover */}
      <Popover open={showSettings} onOpenChange={setShowSettings}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Voice</h4>
              <Select
                value={selectedVoice}
                onValueChange={(value) => setSelectedVoice(value as VoiceId)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {OPENAI_VOICES.map((voice) => (
                    <SelectItem 
                      key={voice.id} 
                      value={voice.id}
                      className="py-2.5 px-3 cursor-pointer data-[state=checked]:bg-amber-500 data-[state=checked]:text-amber-950 focus:bg-amber-500/80 focus:text-amber-950"
                    >
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {OPENAI_VOICES.find(v => v.id === selectedVoice)?.description}
              </p>
            </div>
            
            <div className="sm:hidden">
              <h4 className="font-medium mb-2">Playback Speed</h4>
              <Select
                value={playbackRate.toString()}
                onValueChange={(value) => changePlaybackRate(parseFloat(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playbackRates.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>
                      {rate}x
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">
              Tip: Click any verse while playing to jump to it.
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Export Dialog */}
      <ExportBibleAudioDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        book={book}
        chapter={chapter}
        verses={verses}
      />
    </div>
  );
};
