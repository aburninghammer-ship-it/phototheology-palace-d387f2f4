import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Available OpenAI gpt-4o-mini-tts voices
export const OPENAI_VOICES = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced voice' },
  { id: 'ash', name: 'Ash', description: 'Warm and conversational' },
  { id: 'ballad', name: 'Ballad', description: 'Soft and melodic storyteller' },
  { id: 'coral', name: 'Coral', description: 'Clear and professional' },
  { id: 'echo', name: 'Echo', description: 'Clear and articulate male voice' },
  { id: 'fable', name: 'Fable', description: 'Warm British male voice' },
  { id: 'nova', name: 'Nova', description: 'Friendly and energetic female voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative male voice' },
  { id: 'sage', name: 'Sage', description: 'Wise and thoughtful' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle female voice' },
  { id: 'verse', name: 'Verse', description: 'Expressive and dynamic' },
] as const;

export type VoiceId = typeof OPENAI_VOICES[number]['id'];

interface UseTextToSpeechOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface SpeakOptions {
  voice?: VoiceId;
  book?: string;
  chapter?: number;
  verse?: number;
  useCache?: boolean;
  speed?: number; // 0.25 to 4.0, default 1.0
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { defaultVoice = 'onyx', onStart, onEnd, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const [speed, setSpeed] = useState(1.0);
  const [wasCached, setWasCached] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use refs for callbacks to avoid stale closures in event handlers
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  
  // Keep refs updated
  useEffect(() => {
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
  }, [onEnd, onError, onStart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      setIsPlaying(false);
      onEndRef.current?.();
    }
  }, []);

  const speak = useCallback(async (text: string, speakOptions?: SpeakOptions | VoiceId) => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    const opts: SpeakOptions = typeof speakOptions === 'string' 
      ? { voice: speakOptions } 
      : speakOptions || {};

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    setIsPlaying(false);

    setIsLoading(true);
    setWasCached(false);
    onStartRef.current?.();

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.trim(),
          voice: opts.voice || selectedVoice,
          speed: opts.speed || speed,
          book: opts.book,
          chapter: opts.chapter,
          verse: opts.verse,
          useCache: opts.useCache !== false
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      let audioUrl: string;
      let isBlobUrl = false;

      if (data?.audioUrl) {
        audioUrl = data.audioUrl;
        setWasCached(data.cached === true);
        console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio`);
      } else if (data?.audioContent) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        audioUrl = URL.createObjectURL(audioBlob);
        isBlobUrl = true;
        setWasCached(false);
      } else {
        throw new Error('No audio content received');
      }

      // Create audio element if needed
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      const audio = audioRef.current;
      
      // Set up event handlers BEFORE setting src
      audio.onended = () => {
        console.log('[TTS] Audio ended naturally');
        setIsPlaying(false);
        if (isBlobUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        onEndRef.current?.();
      };
      
      audio.onerror = (e) => {
        console.error('[TTS] Audio playback error:', e);
        setIsPlaying(false);
        if (isBlobUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        onErrorRef.current?.('Audio playback failed');
      };

      // Now set src and play
      audio.src = audioUrl;
      audio.load();
      
      await audio.play();
      setIsPlaying(true);
      console.log('[TTS] Audio playback started');

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('TTS error:', error);
      toast.error(message);
      onErrorRef.current?.(message);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice, speed]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    speed,
    setSpeed,
    voices: OPENAI_VOICES,
    wasCached,
  };
}
