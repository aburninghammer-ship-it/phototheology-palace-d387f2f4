import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SPEECHIFY_VOICES } from './useTextToSpeech';

export interface SpeechifyVoice {
  id: string;
  name: string;
  description: string;
  gender?: string;
  locale?: string;
  previewAudio?: string;
  avatarImage?: string;
}

export function useSpeechifyVoices() {
  const [voices, setVoices] = useState<SpeechifyVoice[]>(
    // Start with fallback static voices
    SPEECHIFY_VOICES.map(v => ({ ...v }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('list-speechify-voices');
        
        if (fnError) {
          throw new Error(fnError.message);
        }
        
        if (data?.voices && Array.isArray(data.voices) && data.voices.length > 0) {
          setVoices(data.voices);
          console.log(`[Speechify] Loaded ${data.voices.length} voices from API`);
        } else {
          console.log('[Speechify] Using fallback static voices');
        }
      } catch (err) {
        console.error('[Speechify] Failed to fetch voices:', err);
        setError(err instanceof Error ? err.message : 'Failed to load voices');
        // Keep using fallback voices
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoices();
  }, []);

  return { voices, isLoading, error };
}
