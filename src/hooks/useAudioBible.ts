/**
 * useAudioBible - React hook for Audio Bible playback
 * Manages playback state, voice selection, and chapter/verse navigation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { audioEngine, AudioState } from "@/lib/AudioEngine";
import {
  generateTTSAudio,
  generateCommentary,
  prefetchUpcomingCommentary,
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

  // Refs for async operations and avoiding stale closures
  const playbackQueueRef = useRef<PlaybackItem[]>([]);
  const currentItemRef = useRef<PlaybackItem | null>(null);
  const isStoppedRef = useRef(false);
  const loadingRef = useRef(false);

  // Ref for playVerseAtIndex to avoid circular dependencies
  const playVerseAtIndexRef = useRef<((item: PlaybackItem, index: number) => Promise<void>) | null>(null);

  // Refs to store current values for callbacks (avoid stale closures)
  const currentVerseIndexRef = useRef(currentVerseIndex);
  const isPlayingCommentaryRef = useRef(isPlayingCommentary);
  const includeCommentaryRef = useRef(includeCommentary);
  const commentaryOnlyRef = useRef(commentaryOnly);
  const commentaryTierRef = useRef(commentaryTier);
  const voiceRef = useRef(voice);
  const onChapterCompleteRef = useRef(onChapterComplete);
  const onVerseChangeRef = useRef(onVerseChange);

  // Keep refs in sync with state
  useEffect(() => { currentVerseIndexRef.current = currentVerseIndex; }, [currentVerseIndex]);
  useEffect(() => { isPlayingCommentaryRef.current = isPlayingCommentary; }, [isPlayingCommentary]);
  useEffect(() => { includeCommentaryRef.current = includeCommentary; }, [includeCommentary]);
  useEffect(() => { commentaryOnlyRef.current = commentaryOnly; }, [commentaryOnly]);
  useEffect(() => { commentaryTierRef.current = commentaryTier; }, [commentaryTier]);
  useEffect(() => { voiceRef.current = voice; }, [voice]);
  useEffect(() => { onChapterCompleteRef.current = onChapterComplete; }, [onChapterComplete]);
  useEffect(() => { onVerseChangeRef.current = onVerseChange; }, [onVerseChange]);

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
   * Play commentary for current verse
   */
  const playCurrentVerseCommentary = useCallback(async () => {
    const item = currentItemRef.current;
    if (!item || isStoppedRef.current) return;

    const verseIdx = currentVerseIndexRef.current;
    const verse = item.verses[verseIdx];
    if (!verse) return;

    setIsPlayingCommentary(true);
    loadingRef.current = true;

    try {
      console.log(`[useAudioBible] Generating commentary for ${item.book} ${item.chapter}:${verse.verse}`);

      // Add timeout for commentary generation (30 seconds)
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => reject(new Error("Commentary generation timed out")), 30000);
      });

      const commentaryPromise = generateCommentary({
        book: item.book,
        chapter: item.chapter,
        verse: verse.verse,
        verseText: verse.text,
        tier: commentaryTierRef.current,
        generateAudio: true,
        voice: voiceRef.current,
      });

      const result = await Promise.race([commentaryPromise, timeoutPromise]);

      if (isStoppedRef.current || !result) {
        console.log("[useAudioBible] Stopped or no result");
        loadingRef.current = false;
        // Move to next verse if no commentary
        setIsPlayingCommentary(false);
        return;
      }

      console.log(`[useAudioBible] Commentary received: ${result.commentary?.substring(0, 100)}...`);
      setCurrentCommentary(result.commentary);

      if (result.audioUrl) {
        await audioEngine.play(result.audioUrl);
      } else if (result.commentary) {
        // Generate TTS for commentary text
        const audioUrl = await generateTTSAudio({ text: result.commentary, voice: voiceRef.current });
        if (audioUrl && !isStoppedRef.current) {
          await audioEngine.play(audioUrl);
        } else {
          // If TTS fails, just show text and auto-advance after delay
          console.log("[useAudioBible] TTS failed, showing text only");
          await new Promise(resolve => setTimeout(resolve, 5000));
          if (!isStoppedRef.current) {
            audioEngine.stop(); // Trigger "ended" event
          }
        }
      }
    } catch (error) {
      console.error("[useAudioBible] Commentary error:", error);
      setCurrentCommentary("Commentary unavailable. Moving to next verse...");
      // Auto-advance after showing error message
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isStoppedRef.current) {
        setIsPlayingCommentary(false);
        setCurrentCommentary("");
        // Move to next verse
        const nextIndex = currentVerseIndexRef.current + 1;
        if (nextIndex < item.verses.length) {
          setCurrentVerseIndex(nextIndex);
          playVerseAtIndexRef.current?.(item, nextIndex);
        }
      }
    } finally {
      loadingRef.current = false;
    }
  }, []);

  /**
   * Play a specific verse
   */
  const playVerseAtIndex = useCallback(async (item: PlaybackItem, index: number) => {
    if (isStoppedRef.current) return;

    const verse = item.verses[index];
    if (!verse) return;

    onVerseChangeRef.current?.(item.book, item.chapter, verse.verse);

    // If commentary only, skip verse reading
    if (commentaryOnlyRef.current) {
      setIsPlayingCommentary(true);
      await playCurrentVerseCommentary();
      return;
    }

    loadingRef.current = true;

    try {
      // Generate TTS for verse text
      const verseWithRef = `${item.book} chapter ${item.chapter}, verse ${verse.verse}. ${verse.text}`;
      const audioUrl = await generateTTSAudio({ text: verseWithRef, voice: voiceRef.current });

      if (audioUrl && !isStoppedRef.current) {
        await audioEngine.play(audioUrl);
      }
    } catch (error) {
      console.error("[useAudioBible] Verse playback error:", error);
    } finally {
      loadingRef.current = false;
    }
  }, [playCurrentVerseCommentary]);

  // Keep playVerseAtIndex ref updated
  useEffect(() => { playVerseAtIndexRef.current = playVerseAtIndex; }, [playVerseAtIndex]);

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

    // Prefetch commentary for upcoming verses in the background
    if (includeCommentaryRef.current && item.verses.length > 1) {
      prefetchUpcomingCommentary(
        item.book,
        item.chapter,
        0,
        item.verses,
        commentaryTierRef.current,
        3 // Prefetch next 3 verses
      ).catch(console.error);
    }

    playVerseAtIndex(item, 0);
  }, [playVerseAtIndex]);

  /**
   * Handle when current audio ends - uses refs to avoid stale closures
   */
  const handlePlaybackEnded = useCallback(() => {
    if (isStoppedRef.current) return;

    const item = currentItemRef.current;
    if (!item) return;

    console.log(`[useAudioBible] Playback ended. isPlayingCommentary: ${isPlayingCommentaryRef.current}, includeCommentary: ${includeCommentaryRef.current}`);

    // If we just played a verse and commentary is enabled, play commentary next
    if (!isPlayingCommentaryRef.current && includeCommentaryRef.current && !commentaryOnlyRef.current) {
      console.log("[useAudioBible] Starting commentary playback");
      playCurrentVerseCommentary();
      return;
    }

    // Move to next verse
    setIsPlayingCommentary(false);
    setCurrentCommentary("");

    const nextIndex = currentVerseIndexRef.current + 1;
    console.log(`[useAudioBible] Moving to verse index ${nextIndex} of ${item.verses.length}`);

    if (nextIndex < item.verses.length) {
      setCurrentVerseIndex(nextIndex);

      // Prefetch more commentary ahead when advancing verses
      if (includeCommentaryRef.current && nextIndex + 2 < item.verses.length) {
        prefetchUpcomingCommentary(
          item.book,
          item.chapter,
          nextIndex,
          item.verses,
          commentaryTierRef.current,
          3 // Keep 3 verses ahead prefetched
        ).catch(console.error);
      }

      playVerseAtIndex(item, nextIndex);
    } else {
      // Chapter complete
      onChapterCompleteRef.current?.(item.book, item.chapter);

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
  }, [playCurrentVerseCommentary, playVerseAtIndex, startPlayback]);

  // Subscribe to audio engine events - use ref to always get latest handler
  const handlePlaybackEndedRef = useRef(handlePlaybackEnded);
  useEffect(() => { handlePlaybackEndedRef.current = handlePlaybackEnded; }, [handlePlaybackEnded]);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setAudioState(state);

      if (state === "ended") {
        handlePlaybackEndedRef.current();
      }
    });

    return unsubscribe;
  }, []);

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

    const nextIndex = currentVerseIndexRef.current + 1;
    if (nextIndex < item.verses.length) {
      setCurrentVerseIndex(nextIndex);
      setIsPlayingCommentary(false);
      playVerseAtIndex(item, nextIndex);
    }
  }, [playVerseAtIndex]);

  /**
   * Skip to previous verse
   */
  const skipPrevious = useCallback(() => {
    const item = currentItemRef.current;
    if (!item) return;

    audioEngine.stop();

    const prevIndex = Math.max(0, currentVerseIndexRef.current - 1);
    setCurrentVerseIndex(prevIndex);
    setIsPlayingCommentary(false);
    playVerseAtIndex(item, prevIndex);
  }, [playVerseAtIndex]);

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
