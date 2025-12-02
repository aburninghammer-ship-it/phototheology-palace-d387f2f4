import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useElevenLabsAudio = () => {
  const [loading, setLoading] = useState(false);

  const getCommentaryAudio = useCallback(async (
    commentary: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<string | null> => {
    try {
      setLoading(true);

      // Check cache first
      const { data: cached } = await supabase
        .from('bible_audio_cache')
        .select('storage_path')
        .eq('book', book)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .eq('voice_id', 'daniel')
        .maybeSingle();

      if (cached?.storage_path) {
        console.log('Audio retrieved from cache');
        const { data } = await supabase.storage
          .from('bible-audio')
          .createSignedUrl(cached.storage_path, 3600);
        
        return data?.signedUrl || null;
      }

      // Generate audio if not cached
      console.log('Generating new audio...');
      const { data, error } = await supabase.functions.invoke('generate-elevenlabs-audio', {
        body: { text: commentary, book, chapter, verse }
      });

      const QUOTA_MARKER = 'ELEVENLABS_QUOTA_EXCEEDED';

      if (error) {
        console.error('Error from generate-elevenlabs-audio function:', error, data);

        const message = (error as any)?.message ?? '';
        const dataError =
          data && typeof (data as any).error === 'string'
            ? (data as any).error
            : '';

        // Check if it's a quota error (can come from either error.message or data.error)
        if (
          (typeof message === 'string' && message.includes(QUOTA_MARKER)) ||
          (typeof dataError === 'string' && dataError.includes(QUOTA_MARKER))
        ) {
          console.error('ElevenLabs quota exceeded');
          throw new Error(QUOTA_MARKER);
        }

        throw error;
      }

      if (data?.storage_path) {
        const { data: urlData } = await supabase.storage
          .from('bible-audio')
          .createSignedUrl(data.storage_path, 3600);
        
        return urlData?.signedUrl || null;
      }

      return null;
    } catch (error) {
      console.error('Error getting commentary audio:', error);
      // Re-throw quota errors so they can be handled upstream
      if (error instanceof Error && error.message === 'ELEVENLABS_QUOTA_EXCEEDED') {
        throw error;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getCommentaryAudio, loading };
};
