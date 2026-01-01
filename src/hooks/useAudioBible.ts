/**
 * useAudioBible - Unified hook for Bible audio playback
 *
 * Features:
 * - Single/verse playback
 * - Chapter playback with auto-advance
 * - Commentary narration
 * - Voice and speed control
 * - iOS audio unlock
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { audioEngine, AudioState } from '@/lib/AudioEngine';
import { generateTTS, generateCommentaryTTS, OpenAIVoice, DEFAULT_VOICE, prefetchVerse } from '@/services/ttsService';
import * as audioCache from '@/services/audioCacheService';

export interface Verse {
  verse: number;
  text: string;
}

export interface UseAudioBibleOptions {
  voice?: OpenAIVoice;
  speed?: number;
  onVerseChange?: (verse: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export interface UseAudioBibleReturn {
  // State
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isUnlocked: boolean;
  currentVerse: number;
  progress: number;
  duration: number;
  error: string | null;

  // Voice settings
  voice: OpenAIVoice;
  setVoice: (voice: OpenAIVoice) => void;
  speed: number;
  setSpeed: (speed: number) => void;

  // Playback controls
  playVerse: (book: string, chapter: number, verse: number, text: string) => Promise<void>;
  playChapter: (book: string, chapter: number, verses: Verse[]) => Promise<void>;
  playCommentary: (text: string) => Promise<void>;
  playText: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  skip: (seconds: number) => void;
  nextVerse: () => void;
  previousVerse: () => void;

  // Utility
  unlock: () => Promise<boolean>;
  prefetchUpcoming: (book: string, chapter: number, verses: Verse[], startIndex: number) => void;
}

export function useAudioBible(options: UseAudioBibleOptions = {}): UseAudioBibleReturn {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(audioEngine.isUnlocked());
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Voice settings
  const [voice, setVoice] = useState<OpenAIVoice>(options.voice || DEFAULT_VOICE);
  const [speed, setSpeed] = useState(options.speed || 1.0);

  // Chapter playback state
  const [currentVerse, setCurrentVerse] = useState(0);
  const chapterDataRef = useRef<{
    book: string;
    chapter: number;
    verses: Verse[];
    index: number;
  } | null>(null);

  // Callbacks ref to avoid stale closures
  const callbacksRef = useRef(options);
  callbacksRef.current = options;

  // Subscribe to audio engine events
  useEffect(() => {
    const handleStateChange = (state: AudioState) => {
      setIsPlaying(state === 'playing');
      setIsPaused(state === 'paused');
      setIsLoading(state === 'loading' || state === 'unlocking');

      if (state === 'idle' || state === 'ended') {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    const handleProgress = (currentTime: number, dur: number) => {
      setProgress(dur > 0 ? (currentTime / dur) * 100 : 0);
      setDuration(dur);
    };

    const handleEnded = () => {
      // If we're in chapter mode, play next verse
      if (chapterDataRef.current) {
        const { verses, index } = chapterDataRef.current;
        if (index < verses.length - 1) {
          playNextVerseInChapter();
          return;
        }
      }
      // Otherwise, notify completion
      callbacksRef.current.onEnded?.();
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setIsLoading(false);
      callbacksRef.current.onError?.(err);
    };

    audioEngine.on('stateChange', handleStateChange);
    audioEngine.on('progress', handleProgress);
    audioEngine.on('ended', handleEnded);
    audioEngine.on('error', handleError);

    return () => {
      audioEngine.off('stateChange', handleStateChange);
      audioEngine.off('progress', handleProgress);
      audioEngine.off('ended', handleEnded);
      audioEngine.off('error', handleError);
    };
  }, []);

  // Unlock audio context
  const unlock = useCallback(async (): Promise<boolean> => {
    const success = await audioEngine.unlock();
    setIsUnlocked(success);
    return success;
  }, []);

  // Play a single verse
  const playVerse = useCallback(async (
    book: string,
    chapter: number,
    verseNum: number,
    text: string
  ): Promise<void> => {
    setError(null);
    setIsLoading(true);
    chapterDataRef.current = null;

    try {
      // Check local cache first
      const cacheKey = audioCache.verseKey(book, chapter, verseNum, voice);
      let audioUrl = await audioCache.getAudio(cacheKey);

      if (!audioUrl) {
        // Generate TTS
        const result = await generateTTS({
          text,
          voice,
          speed,
          book,
          chapter,
          verse: verseNum,
        });
        audioUrl = result.audioUrl;

        // Cache from URL in background
        if (audioUrl && !audioUrl.startsWith('data:')) {
          audioCache.cacheFromUrl(cacheKey, audioUrl).catch(() => {});
        }
      }

      if (!audioUrl) {
        throw new Error('Failed to get audio URL');
      }

      setCurrentVerse(verseNum);
      await audioEngine.play(audioUrl, {
        playbackRate: speed,
        title: `${book} ${chapter}:${verseNum}`,
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      callbacksRef.current.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [voice, speed]);

  // Play next verse in chapter
  const playNextVerseInChapter = useCallback(async () => {
    if (!chapterDataRef.current) return;

    const { book, chapter, verses, index } = chapterDataRef.current;
    const nextIndex = index + 1;

    if (nextIndex >= verses.length) {
      chapterDataRef.current = null;
      callbacksRef.current.onEnded?.();
      return;
    }

    chapterDataRef.current.index = nextIndex;
    const verse = verses[nextIndex];
    setCurrentVerse(verse.verse);
    callbacksRef.current.onVerseChange?.(verse.verse);

    try {
      setIsLoading(true);

      const cacheKey = audioCache.verseKey(book, chapter, verse.verse, voice);
      let audioUrl = await audioCache.getAudio(cacheKey);

      if (!audioUrl) {
        const result = await generateTTS({
          text: verse.text,
          voice,
          speed,
          book,
          chapter,
          verse: verse.verse,
        });
        audioUrl = result.audioUrl;

        if (audioUrl && !audioUrl.startsWith('data:')) {
          audioCache.cacheFromUrl(cacheKey, audioUrl).catch(() => {});
        }
      }

      if (!audioUrl) {
        throw new Error('Failed to get audio URL');
      }

      await audioEngine.play(audioUrl, {
        playbackRate: speed,
        title: `${book} ${chapter}:${verse.verse}`,
      });

      // Prefetch next verse
      if (nextIndex + 1 < verses.length) {
        const nextVerse = verses[nextIndex + 1];
        prefetchVerse(book, chapter, nextVerse.verse, nextVerse.text, voice).catch(() => {});
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      callbacksRef.current.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [voice, speed]);

  // Play entire chapter
  const playChapter = useCallback(async (
    book: string,
    chapter: number,
    verses: Verse[]
  ): Promise<void> => {
    if (verses.length === 0) return;

    setError(null);

    // Set up chapter data
    chapterDataRef.current = {
      book,
      chapter,
      verses,
      index: 0,
    };

    const firstVerse = verses[0];
    setCurrentVerse(firstVerse.verse);
    callbacksRef.current.onVerseChange?.(firstVerse.verse);

    // Play first verse
    await playVerse(book, chapter, firstVerse.verse, firstVerse.text);

    // Re-establish chapter reference after playVerse clears it
    chapterDataRef.current = {
      book,
      chapter,
      verses,
      index: 0,
    };

    // Prefetch second verse
    if (verses.length > 1) {
      prefetchVerse(book, chapter, verses[1].verse, verses[1].text, voice).catch(() => {});
    }
  }, [playVerse, voice]);

  // Play commentary text
  const playCommentary = useCallback(async (text: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    chapterDataRef.current = null;

    try {
      const result = await generateCommentaryTTS(text, voice, speed);

      await audioEngine.play(result.audioUrl, {
        playbackRate: speed,
        title: 'Commentary',
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      callbacksRef.current.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [voice, speed]);

  // Play arbitrary text
  const playText = useCallback(async (text: string): Promise<void> => {
    setError(null);
    setIsLoading(true);
    chapterDataRef.current = null;

    try {
      const result = await generateTTS({ text, voice, speed });

      await audioEngine.play(result.audioUrl, {
        playbackRate: speed,
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err.message);
      callbacksRef.current.onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [voice, speed]);

  // Playback controls
  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  const resume = useCallback(() => {
    audioEngine.resume();
  }, []);

  const stop = useCallback(() => {
    chapterDataRef.current = null;
    audioEngine.stop();
    setProgress(0);
    setDuration(0);
  }, []);

  const skip = useCallback((seconds: number) => {
    const current = audioEngine.getCurrentTime();
    audioEngine.seek(Math.max(0, current + seconds));
  }, []);

  const nextVerse = useCallback(() => {
    if (!chapterDataRef.current) return;

    const { verses, index } = chapterDataRef.current;
    if (index < verses.length - 1) {
      audioEngine.stop();
      playNextVerseInChapter();
    }
  }, [playNextVerseInChapter]);

  const previousVerse = useCallback(() => {
    if (!chapterDataRef.current) return;

    const { book, chapter, verses, index } = chapterDataRef.current;
    if (index > 0) {
      const prevIndex = index - 1;
      chapterDataRef.current.index = prevIndex - 1; // Will be incremented in playNextVerseInChapter
      audioEngine.stop();
      playNextVerseInChapter();
    }
  }, [playNextVerseInChapter]);

  // Prefetch upcoming verses
  const prefetchUpcoming = useCallback((
    book: string,
    chapter: number,
    verses: Verse[],
    startIndex: number
  ) => {
    const PREFETCH_COUNT = 3;
    for (let i = startIndex; i < Math.min(startIndex + PREFETCH_COUNT, verses.length); i++) {
      const v = verses[i];
      prefetchVerse(book, chapter, v.verse, v.text, voice).catch(() => {});
    }
  }, [voice]);

  // Update playback rate when speed changes
  useEffect(() => {
    audioEngine.setPlaybackRate(speed);
  }, [speed]);

  return {
    // State
    isPlaying,
    isPaused,
    isLoading,
    isUnlocked,
    currentVerse,
    progress,
    duration,
    error,

    // Voice settings
    voice,
    setVoice,
    speed,
    setSpeed,

    // Playback controls
    playVerse,
    playChapter,
    playCommentary,
    playText,
    pause,
    resume,
    stop,
    skip,
    nextVerse,
    previousVerse,

    // Utility
    unlock,
    prefetchUpcoming,
  };
}

export { OpenAIVoice, OPENAI_VOICES, DEFAULT_VOICE } from '@/services/ttsService';
