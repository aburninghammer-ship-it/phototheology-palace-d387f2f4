/**
 * useAudioBible - React hook for Audio Bible playback
 * Manages playback state, voice selection, and chapter/verse navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { audioEngine, AudioState } from "@/lib/AudioEngine";
import {
  generateTTSAudio,
  generateCommentary,
  CommentaryTier,
  OpenAIVoice,
  OPENAI_VOICES,
} from "@/services/audioBibleService";

interface Verse {
  verse: number;
  text: string;
}

interface PlaybackItem {
  book: string;
  chapter: number;
  verses: Verse[];
}

interface UseAudioBibleOptions {
  defaultVoice?: OpenAIVoice;
  defaultSpeed?: number;
  defaultVolume?: number;
  defaultTier?: CommentaryTier;
  onVerseChange?: (book: string, chapter: number, verse: number) => void;
  onChapterComplete?: (book: string, chapter: number) => void;
}

export function useAudioBible(options: UseAudioBibleOptions = {}) {
  const {
    defaultVoice = "onyx",
    defaultSpeed = 1.0,
    defaultVolume = 1.0,
    defaultTier = "surface",
    onVerseChange,
    onChapterComplete,
  } = options;

  // State
  const [audioState, setAudioState] = useState<AudioState>("idle");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [voice, setVoice] = useState<OpenAIVoice>(defaultVoice);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [commentaryTier, setCommentaryTier] = useState<CommentaryTier>(defaultTier);
  const [includeCommentary, setIncludeCommentary] = useState(true);
  const [commentaryOnly, setCommentaryOnly] = useState(false);

  // Playback tracking
  const [currentBook, setCurrentBook] = useState<string>("");
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [isPlayingCommentary, setIsPlayingCommentary] = useState(false);
  const [currentCommentary, setCurrentCommentary] = useState<string>("");

  // Refs for async operations
  const playbackQueueRef = useRef<PlaybackItem[]>([]);
  const currentItemRef = useRef<PlaybackItem | null>(null);
  const isStoppedRef = useRef(false);
  const loadingRef = useRef(false);

  // Subscribe to audio engine events
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);

      if (state === "ended") {
        handlePlaybackEnded();
      }
    });

    return unsubscribe;
  }, []);

  // Update playback rate when speed changes
  useEffect(() => {
    audioEngine.setPlaybackRate(speed);
  }, [speed]);

  // Update volume when it changes
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  // Volume setter
  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    audioEngine.setVolume(vol);
  }, []);

  /**
   * Unlock iOS audio - call on first user interaction
   */
  const unlock = useCallback(async () => {
    const success = await audioEngine.unlock();
    setIsUnlocked(success);
    return success;
  }, []);

  /**
   * Handle when current audio ends
   */
  const handlePlaybackEnded = useCallback(() => {
    if (isStoppedRef.current) return;

    const item = currentItemRef.current;
    if (!item) return;

    // If we just played a verse and commentary is enabled, play commentary next
    if (!isPlayingCommentary && includeCommentary && !commentaryOnly) {
      playCurrentVerseCommentary();
      return;
    }

    // Move to next verse
    setIsPlayingCommentary(false);
    setCurrentCommentary("");

    const nextIndex = currentVerseIndex + 1;
    if (nextIndex < item.verses.length) {
      setCurrentVerseIndex(nextIndex);
      playVerseAtIndex(item, nextIndex);
    } else {
      // Chapter complete
      onChapterComplete?.(item.book, item.chapter);

      // Check for more items in queue
      if (playbackQueueRef.current.length > 0) {
        const nextItem = playbackQueueRef.current.shift()!;
        startPlayback(nextItem);
      } else {
        // All done
        currentItemRef.current = null;
        setAudioState("idle");
      }
    }
  }, [currentVerseIndex, includeCommentary, commentaryOnly, onChapterComplete]);

  /**
   * Play commentary for current verse
   */
  const playCurrentVerseCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    const verse = item.verses[currentVerseIndex];
    if (!verse) return;

    setIsPlayingCommentary(true);
    loadingRef.current = true;

    try {
      const result = await generateCommentary({
        book: item.book,
        chapter: item.chapter,
        verse: verse.verse,
        verseText: verse.text,
        tier: commentaryTier,
        generateAudio: true,
        voice,
      });

      if (isStoppedRef.current || !result) {
        loadingRef.current = false;
        return;
      }

      setCurrentCommentary(result.commentary);

      if (result.audioUrl) {
        await audioEngine.play(result.audioUrl);
      } else {
        // Generate TTS for commentary text
        const audioUrl = await generateTTSAudio({ text: result.commentary, voice });
        if (audioUrl && !isStoppedRef.current) {
          await audioEngine.play(audioUrl);
        }
      }
    } catch (error) {
      console.error("[useAudioBible] Commentary error:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [currentVerseIndex, commentaryTier, voice]);

  /**
   * Play a specific verse
   */
  const playVerseAtIndex = useCallback(async (item: PlaybackItem, index: number) => {
    if (isStoppedRef.current) return;

    const verse = item.verses[index];
    if (!verse) return;

    onVerseChange?.(item.book, item.chapter, verse.verse);

    // If commentary only, skip verse reading
    if (commentaryOnly) {
      setIsPlayingCommentary(true);
      await playCurrentVerseCommentary();
      return;
    }

    loadingRef.current = true;

    try {
      // Generate TTS for verse text
      const verseWithRef = `${item.book} chapter ${item.chapter}, verse ${verse.verse}. ${verse.text}`;
      const audioUrl = await generateTTSAudio({ text: verseWithRef, voice });

      if (audioUrl && !isStoppedRef.current) {
        await audioEngine.play(audioUrl);
      }
    } catch (error) {
      console.error("[useAudioBible] Verse playback error:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [voice, commentaryOnly, onVerseChange, playCurrentVerseCommentary]);

  /**
   * Start playback for an item
   */
  const startPlayback = useCallback((item: PlaybackItem) => {
    currentItemRef.current = item;
    isStoppedRef.current = false;

    setCurrentBook(item.book);
    setCurrentChapter(item.chapter);
    setCurrentVerseIndex(0);
    setTotalVerses(item.verses.length);
    setIsPlayingCommentary(false);
    setCurrentCommentary("");

    playVerseAtIndex(item, 0);
  }, [playVerseAtIndex]);

  /**
   * Play a chapter
   */
  const playChapter = useCallback(async (book: string, chapter: number, verses: Verse[]) => {
    if (!isUnlocked) {
      await unlock();
    }

    isStoppedRef.current = false;
    playbackQueueRef.current = [];

    const item: PlaybackItem = { book, chapter, verses };
    startPlayback(item);
  }, [isUnlocked, unlock, startPlayback]);

  /**
   * Add chapters to queue
   */
  const queueChapters = useCallback((items: PlaybackItem[]) => {
    playbackQueueRef.current.push(...items);
  }, []);

  /**
   * Play a single verse
   */
  const playSingleVerse = useCallback(async (book: string, chapter: number, verse: number, text: string) => {
    if (!isUnlocked) {
      await unlock();
    }

    isStoppedRef.current = false;
    playbackQueueRef.current = [];

    const item: PlaybackItem = {
      book,
      chapter,
      verses: [{ verse, text }],
    };
    startPlayback(item);
  }, [isUnlocked, unlock, startPlayback]);

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    audioEngine.pause();
  }, []);

  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    audioEngine.resume();
  }, []);

  /**
   * Stop playback completely
   */
  const stop = useCallback(() => {
    isStoppedRef.current = true;
    playbackQueueRef.current = [];
    currentItemRef.current = null;
    audioEngine.stop();
    setCurrentBook("");
    setCurrentChapter(0);
    setCurrentVerseIndex(0);
    setTotalVerses(0);
    setIsPlayingCommentary(false);
    setCurrentCommentary("");
  }, []);

  /**
   * Skip to next verse
   */
  const skipNext = useCallback(() => {
    const item = currentItemRef.current;
    if (!item) return;

    audioEngine.stop();

    const nextIndex = currentVerseIndex + 1;
    if (nextIndex < item.verses.length) {
      setCurrentVerseIndex(nextIndex);
      setIsPlayingCommentary(false);
      playVerseAtIndex(item, nextIndex);
    }
  }, [currentVerseIndex, playVerseAtIndex]);

  /**
   * Skip to previous verse
   */
  const skipPrevious = useCallback(() => {
    const item = currentItemRef.current;
    if (!item) return;

    audioEngine.stop();

    const prevIndex = Math.max(0, currentVerseIndex - 1);
    setCurrentVerseIndex(prevIndex);
    setIsPlayingCommentary(false);
    playVerseAtIndex(item, prevIndex);
  }, [currentVerseIndex, playVerseAtIndex]);

  // Computed states
  const isPlaying = audioState === "playing";
  const isPaused = audioState === "paused";
  const isLoading = audioState === "loading" || loadingRef.current;
  const isIdle = audioState === "idle";
  const currentVerse = currentItemRef.current?.verses[currentVerseIndex];

  return {
    // State
    isPlaying,
    isPaused,
    isLoading,
    isIdle,
    isUnlocked,
    audioState,

    // Playback info
    currentBook,
    currentChapter,
    currentVerse: currentVerse?.verse || 0,
    currentVerseText: currentVerse?.text || "",
    currentVerseIndex,
    totalVerses,
    isPlayingCommentary,
    currentCommentary,

    // Settings
    voice,
    setVoice,
    speed,
    setSpeed,
    volume,
    setVolume,
    commentaryTier,
    setCommentaryTier,
    includeCommentary,
    setIncludeCommentary,
    commentaryOnly,
    setCommentaryOnly,

    // Actions
    unlock,
    playChapter,
    playSingleVerse,
    queueChapters,
    pause,
    resume,
    stop,
    skipNext,
    skipPrevious,

    // Constants
    voices: OPENAI_VOICES,
  };
}
