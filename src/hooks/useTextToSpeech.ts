import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface UseTextToSpeechOptions {
  defaultVoice?: VoiceId;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const { defaultVoice = 'daniel', onStart, onEnd, onError } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>(defaultVoice);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      onEnd?.();
    }
  }, [onEnd]);

  const speak = useCallback(async (text: string, voice?: VoiceId) => {
    if (!text.trim()) {
      toast.error('No text to speak');
      return;
    }

    // Stop any currently playing audio
    stop();

    setIsLoading(true);
    onStart?.();

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.trim(),
          voice: voice || selectedVoice 
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate speech');
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      // Create audio from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
        { type: 'audio/mpeg' }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      
      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };
      audioRef.current.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        onError?.('Audio playback failed');
      };

      await audioRef.current.play();
      setIsPlaying(true);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      console.error('TTS error:', error);
      toast.error(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedVoice, stop, onStart, onEnd, onError]);

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    selectedVoice,
    setSelectedVoice,
    voices: ELEVENLABS_VOICES,
  };
}
