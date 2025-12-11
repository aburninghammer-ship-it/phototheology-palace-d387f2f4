import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// TTS Providers
export type TTSProvider = 'openai' | 'elevenlabs' | 'speechify';

export const TTS_PROVIDERS = [
  { id: 'openai' as TTSProvider, name: 'OpenAI', description: 'High quality, fast generation' },
  { id: 'elevenlabs' as TTSProvider, name: 'ElevenLabs', description: 'Ultra-realistic voices' },
  { id: 'speechify' as TTSProvider, name: 'Speechify', description: 'Natural reading voices' },
] as const;

// OpenAI gpt-4o-mini-tts voices
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

// ElevenLabs voices
export const ELEVENLABS_VOICES = [
  { id: 'george', name: 'George', description: 'Warm British male' },
  { id: 'aria', name: 'Aria', description: 'Expressive female' },
  { id: 'roger', name: 'Roger', description: 'Confident male' },
  { id: 'sarah', name: 'Sarah', description: 'Soft female' },
  { id: 'charlie', name: 'Charlie', description: 'Casual Australian' },
  { id: 'callum', name: 'Callum', description: 'Intense male' },
  { id: 'river', name: 'River', description: 'Non-binary, calm' },
  { id: 'liam', name: 'Liam', description: 'Articulate male' },
  { id: 'charlotte', name: 'Charlotte', description: 'Swedish female' },
  { id: 'alice', name: 'Alice', description: 'British female' },
  { id: 'matilda', name: 'Matilda', description: 'Warm female' },
  { id: 'will', name: 'Will', description: 'Friendly male' },
  { id: 'jessica', name: 'Jessica', description: 'Expressive female' },
  { id: 'eric', name: 'Eric', description: 'Friendly male' },
  { id: 'chris', name: 'Chris', description: 'Casual male' },
  { id: 'brian', name: 'Brian', description: 'Deep male' },
  { id: 'daniel', name: 'Daniel', description: 'Authoritative male' },
  { id: 'lily', name: 'Lily', description: 'Warm British female' },
  { id: 'bill', name: 'Bill', description: 'Trustworthy male' },
] as const;

// Speechify voices
export const SPEECHIFY_VOICES = [
  { id: 'henry', name: 'Henry', description: 'Natural male' },
  { id: 'mrbeast', name: 'MrBeast', description: 'Energetic male' },
  { id: 'gwyneth', name: 'Gwyneth', description: 'Calm female' },
  { id: 'snoop', name: 'Snoop', description: 'Laid-back male' },
  { id: 'matthew', name: 'Matthew', description: 'Clear male' },
  { id: 'george', name: 'George', description: 'British male' },
  { id: 'oliver', name: 'Oliver', description: 'Young male' },
  { id: 'emma', name: 'Emma', description: 'Friendly female' },
  { id: 'james', name: 'James', description: 'Professional male' },
  { id: 'sophia', name: 'Sophia', description: 'Warm female' },
] as const;

export type VoiceId = string;

export function getVoicesForProvider(provider: TTSProvider) {
  switch (provider) {
    case 'elevenlabs':
      return ELEVENLABS_VOICES;
    case 'speechify':
      return SPEECHIFY_VOICES;
    case 'openai':
    default:
      return OPENAI_VOICES;
  }
}

export function getDefaultVoiceForProvider(provider: TTSProvider): string {
  switch (provider) {
    case 'elevenlabs':
      return 'george';
    case 'speechify':
      return 'henry';
    case 'openai':
    default:
      return 'onyx';
  }
}

interface UseTextToSpeechOptions {
  defaultVoice?: VoiceId;
  defaultProvider?: TTSProvider;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface SpeakOptions {
  voice?: VoiceId;
  provider?: TTSProvider;
  book?: string;
  chapter?: number;
  verse?: number;
  useCache?: boolean;
  speed?: number;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { 
    defaultVoice = 'henry', 
    defaultProvider = 'speechify',
    onStart, 
    onEnd, 
    onError 
  } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<TTSProvider>(defaultProvider);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const [speed, setSpeed] = useState(1.0);
  const [wasCached, setWasCached] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  
  useEffect(() => {
    onEndRef.current = onEnd;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
  }, [onEnd, onError, onStart]);

  // Update voice when provider changes
  useEffect(() => {
    setSelectedVoice(getDefaultVoiceForProvider(selectedProvider));
  }, [selectedProvider]);

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

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    setIsPlaying(false);

    setIsLoading(true);
    setWasCached(false);
    onStartRef.current?.();

    const provider = opts.provider || selectedProvider;
    const voice = opts.voice || selectedVoice;

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.trim(),
          voice,
          provider,
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
        console.log(`[TTS] Using ${data.cached ? 'cached' : 'newly cached'} audio from ${provider}`);
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

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      const audio = audioRef.current;
      
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

      audio.src = audioUrl;
      audio.load();
      
      await audio.play();
      setIsPlaying(true);
      console.log(`[TTS] Audio playback started (${provider})`);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('TTS error:', error);
      toast.error(message);
      onErrorRef.current?.(message);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice, selectedProvider, speed]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    selectedProvider,
    setSelectedProvider,
    speed,
    setSpeed,
    voices: getVoicesForProvider(selectedProvider),
    providers: TTS_PROVIDERS,
    wasCached,
  };
}
