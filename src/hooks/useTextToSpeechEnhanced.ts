import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isOnline } from '@/services/offlineAudioCache';

// Available ElevenLabs voices
export const ELEVENLABS_VOICES = [
  { id: 'aria', name: 'Aria', description: 'Warm and expressive female voice' },
  { id: 'roger', name: 'Roger', description: 'Deep and authoritative male voice' },
  { id: 'sarah', name: 'Sarah', description: 'Clear and professional female voice' },
  { id: 'laura', name: 'Laura', description: 'Gentle and soothing female voice' },
  { id: 'charlie', name: 'Charlie', description: 'Friendly and casual male voice' },
  { id: 'george', name: 'George', description: 'Distinguished British male voice' },
  { id: 'callum', name: 'Callum', description: 'Young and energetic male voice' },
  { id: 'river', name: 'River', description: 'Calm and meditative voice' },
  { id: 'liam', name: 'Liam', description: 'Strong and confident male voice' },
  { id: 'charlotte', name: 'Charlotte', description: 'Elegant and refined female voice' },
  { id: 'alice', name: 'Alice', description: 'Bright and cheerful female voice' },
  { id: 'matilda', name: 'Matilda', description: 'Warm Australian female voice' },
  { id: 'will', name: 'Will', description: 'Casual American male voice' },
  { id: 'jessica', name: 'Jessica', description: 'Articulate and clear female voice' },
  { id: 'eric', name: 'Eric', description: 'Mature and wise male voice' },
  { id: 'chris', name: 'Chris', description: 'Versatile and natural male voice' },
  { id: 'brian', name: 'Brian', description: 'Deep and resonant male voice' },
  { id: 'daniel', name: 'Daniel', description: 'British narrator voice' },
  { id: 'lily', name: 'Lily', description: 'Sweet and youthful female voice' },
  { id: 'bill', name: 'Bill', description: 'Gravelly and distinctive male voice' },
] as const;

export type VoiceId = typeof ELEVENLABS_VOICES[number]['id'];

type TTSMode = 'elevenlabs' | 'browser' | 'auto';

interface UseTextToSpeechEnhancedOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  mode?: TTSMode; // 'elevenlabs', 'browser', or 'auto' (default: auto)
  timeout?: number; // Timeout for ElevenLabs requests (default: 10000ms)
}

interface SpeakOptions {
  voice?: VoiceId;
  book?: string;
  chapter?: number;
  verse?: number;
  useCache?: boolean;
}

/**
 * Enhanced TTS hook with offline fallback capabilities
 * - Automatically detects network connectivity
 * - Falls back to browser TTS when offline or ElevenLabs fails
 * - Supports manual mode selection
 * - Adds timeout protection for slow networks
 */
export function useTextToSpeechEnhanced(options: UseTextToSpeechEnhancedOptions = {}) {
  const {
    defaultVoice = 'daniel',
    onStart,
    onEnd,
    onError,
    mode = 'auto',
    timeout = 10000
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const [wasCached, setWasCached] = useState(false);
  const [currentMode, setCurrentMode] = useState<'elevenlabs' | 'browser'>('elevenlabs');
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedBrowserVoice, setSelectedBrowserVoice] = useState<SpeechSynthesisVoice | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load browser voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      setBrowserVoices(englishVoices);

      // Select a good default browser voice
      const preferredVoice = englishVoices.find(v =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel')
      ) || englishVoices[0];

      if (preferredVoice && !selectedBrowserVoice) {
        setSelectedBrowserVoice(preferredVoice);
      }
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedBrowserVoice]);

  // Monitor network status
  useEffect(() => {
    const checkNetwork = () => {
      if (!isOnline()) {
        setNetworkStatus('offline');
      } else {
        setNetworkStatus('online');
      }
    };

    checkNetwork();
    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    // Stop ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop browser TTS
    speechSynthesis.cancel();

    setIsPlaying(false);
    onEnd?.();
  }, [onEnd]);

  // Browser TTS fallback
  const speakWithBrowser = useCallback(async (text: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;

        if (selectedBrowserVoice) {
          utterance.voice = selectedBrowserVoice;
        }

        utterance.onstart = () => {
          setCurrentMode('browser');
          setIsPlaying(true);
          onStart?.();
        };

        utterance.onend = () => {
          setIsPlaying(false);
          onEnd?.();
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('[TTS] Browser TTS error:', event);
          setIsPlaying(false);
          reject(new Error('Browser TTS failed'));
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }, [selectedBrowserVoice, onStart, onEnd]);

  // ElevenLabs TTS with timeout
  const speakWithElevenLabs = useCallback(async (text: string, speakOptions?: SpeakOptions) => {
    const opts: SpeakOptions = speakOptions || {};

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setNetworkStatus('slow');
    }, timeout);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text.trim(),
          voice: opts.voice || selectedVoice,
          book: opts.book,
          chapter: opts.chapter,
          verse: opts.verse,
          useCache: opts.useCache !== false
        }
      });

      clearTimeout(timeoutId);

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      let audioUrl: string;

      // Check if we got a cached URL or need to decode base64
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
        setWasCached(false);
      } else {
        throw new Error('No audio content received');
      }

      // Create and play audio
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        onEnd?.();
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        if (audioUrl.startsWith('blob:')) {
          URL.revokeObjectURL(audioUrl);
        }
        throw new Error('Audio playback failed');
      };

      await audioRef.current.play();
      setCurrentMode('elevenlabs');
      setIsPlaying(true);
      onStart?.();

    } catch (error) {
      clearTimeout(timeoutId);

      // If abort, network is slow/offline
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Network timeout - connection too slow');
      }

      throw error;
    }
  }, [selectedVoice, timeout, onStart, onEnd]);

  const speak = useCallback(async (text: string, speakOptions?: SpeakOptions | VoiceId) => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    // Handle legacy call signature (voice as second param)
    const opts: SpeakOptions = typeof speakOptions === 'string'
      ? { voice: speakOptions }
      : speakOptions || {};

    // Stop any currently playing audio
    stop();

    setIsLoading(true);
    setWasCached(false);

    try {
      // Determine which TTS to use
      let shouldUseBrowser = false;

      if (mode === 'browser') {
        shouldUseBrowser = true;
      } else if (mode === 'elevenlabs') {
        shouldUseBrowser = false;
      } else {
        // Auto mode: decide based on network
        shouldUseBrowser = networkStatus === 'offline';
      }

      if (shouldUseBrowser || networkStatus === 'offline') {
        // Use browser TTS
        console.log('[TTS] Using browser TTS (offline or requested)');
        await speakWithBrowser(text);
      } else {
        // Try ElevenLabs first, fallback to browser on error
        try {
          console.log('[TTS] Attempting ElevenLabs TTS');
          await speakWithElevenLabs(text, opts);
        } catch (elevenLabsError) {
          console.warn('[TTS] ElevenLabs failed, falling back to browser TTS:', elevenLabsError);
          toast.info('Using offline voice mode');
          await speakWithBrowser(text);
        }
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('[TTS] Complete failure:', error);
      toast.error(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [mode, networkStatus, stop, speakWithBrowser, speakWithElevenLabs, onError]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices: ELEVENLABS_VOICES,
    wasCached,
    currentMode, // 'elevenlabs' or 'browser'
    networkStatus, // 'online', 'offline', or 'slow'
    browserVoices,
    selectedBrowserVoice,
    setSelectedBrowserVoice,
  };
}
