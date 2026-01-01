/**
 * useAudioBible - Simple hook for Bible audio playback
 */

import { useState, useCallback, useRef } from 'react';
import { audioEngine } from '@/lib/AudioEngine';
import { generateTTS, generateCommentaryTTS, OpenAIVoice, DEFAULT_VOICE } from '@/services/ttsService';

export interface Verse {
  verse: number;
  text: string;
}

export interface UseAudioBibleOptions {
  voice?: OpenAIVoice;
  speed?: number;
  onVerseComplete?: (verseIndex: number) => void;
  onAllComplete?: () => void;
  onError?: (error: Error) => void;
}

export function useAudioBible(options: UseAudioBibleOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [voice, setVoice] = useState<OpenAIVoice>(options.voice || DEFAULT_VOICE);
  const [speed, setSpeed] = useState(options.speed || 1.0);

  // Refs to avoid stale closures
  const versesRef = useRef<Verse[]>([]);
  const bookRef = useRef<string>('');
  const chapterRef = useRef<number>(0);
  const shouldContinueRef = useRef(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  /**
   * Play a single verse
   */
  const playVerse = useCallback(async (
    book: string,
    chapter: number,
    verse: Verse,
    verseIndex: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setCurrentVerseIndex(verseIndex);

    try {
      const audioUrl = await generateTTS(verse.text, {
        voice,
        speed,
        book,
        chapter,
        verse: verse.verse,
      });

      return new Promise((resolve) => {
        audioEngine.play(audioUrl, {
          volume: 1,
          playbackRate: speed,
          onEnded: () => {
            setIsLoading(false);
            resolve(true);
          },
          onError: (err) => {
            setError(err.message);
            setIsLoading(false);
            optionsRef.current.onError?.(err);
            resolve(false);
          },
        }).then((success) => {
          setIsLoading(false);
          if (success) {
            setIsPlaying(true);
          } else {
            resolve(false);
          }
        });
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      setIsLoading(false);
      optionsRef.current.onError?.(err);
      return false;
    }
  }, [voice, speed]);

  /**
   * Play a chapter (all verses in sequence)
   */
  const playChapter = useCallback(async (
    book: string,
    chapter: number,
    verses: Verse[],
    startIndex = 0
  ) => {
    if (verses.length === 0) return;

    // Store for playback loop
    versesRef.current = verses;
    bookRef.current = book;
    chapterRef.current = chapter;
    shouldContinueRef.current = true;

    setIsPlaying(true);
    setError(null);

    // Unlock audio first (for iOS)
    await audioEngine.unlock();

    // Play verses sequentially
    for (let i = startIndex; i < verses.length; i++) {
      if (!shouldContinueRef.current) {
        console.log('[useAudioBible] Playback stopped');
        break;
      }

      const success = await playVerse(book, chapter, verses[i], i);

      if (!success) {
        console.error('[useAudioBible] Failed to play verse', i + 1);
        break;
      }

      // Notify verse complete
      optionsRef.current.onVerseComplete?.(i);
    }

    // All done
    if (shouldContinueRef.current) {
      optionsRef.current.onAllComplete?.();
    }

    setIsPlaying(false);
    setCurrentVerseIndex(-1);
    shouldContinueRef.current = false;
  }, [playVerse]);

  /**
   * Play commentary text
   */
  const playCommentary = useCallback(async (text: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const audioUrl = await generateCommentaryTTS(text, voice);

      return new Promise((resolve) => {
        audioEngine.play(audioUrl, {
          volume: 1,
          playbackRate: speed,
          onEnded: () => {
            setIsLoading(false);
            resolve(true);
          },
          onError: (err) => {
            setError(err.message);
            setIsLoading(false);
            resolve(false);
          },
        }).then((success) => {
          setIsLoading(false);
          if (!success) resolve(false);
        });
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      setIsLoading(false);
      return false;
    }
  }, [voice, speed]);

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    audioEngine.pause();
    setIsPlaying(false);
  }, []);

  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    if (audioEngine.resume()) {
      setIsPlaying(true);
    }
  }, []);

  /**
   * Stop playback
   */
  const stop = useCallback(() => {
    shouldContinueRef.current = false;
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentVerseIndex(-1);
  }, []);

  /**
   * Unlock audio (call on user gesture for iOS)
   */
  const unlock = useCallback(async () => {
    return audioEngine.unlock();
  }, []);

  return {
    // State
    isPlaying,
    isLoading,
    currentVerseIndex,
    error,

    // Settings
    voice,
    setVoice,
    speed,
    setSpeed,

    // Actions
    playChapter,
    playVerse,
    playCommentary,
    pause,
    resume,
    stop,
    unlock,
  };
}

export { OpenAIVoice, OPENAI_VOICES, DEFAULT_VOICE } from '@/services/ttsService';
