import { useState, useCallback, useEffect, useRef } from 'react';

export interface ReadAlongWord {
  text: string;
  index: number;
  startTime: number;
  duration: number;
}

export interface ReadAlongOptions {
  wordsPerMinute?: number; // Reading speed (default: 200)
  pauseAfterSentence?: number; // Extra pause after sentences in ms (default: 500)
  pauseAfterComma?: number; // Extra pause after commas in ms (default: 200)
  onComplete?: () => void;
  onWordChange?: (wordIndex: number) => void;
}

/**
 * Hook for read-along functionality with text highlighting
 * Simulates natural reading pace with pauses for punctuation
 */
export function useReadAlong(options: ReadAlongOptions = {}) {
  const {
    wordsPerMinute = 200,
    pauseAfterSentence = 500,
    pauseAfterComma = 200,
    onComplete,
    onWordChange,
  } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [words, setWords] = useState<ReadAlongWord[]>([]);
  const [progress, setProgress] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Calculate reading duration based on WPM
  const msPerWord = (60 / wordsPerMinute) * 1000;

  /**
   * Parse text into words with timing information
   */
  const parseText = useCallback((text: string): ReadAlongWord[] => {
    const wordMatches = text.match(/\S+/g) || [];
    let currentTime = 0;

    const parsedWords: ReadAlongWord[] = wordMatches.map((word, index) => {
      const duration = msPerWord;
      const wordObj: ReadAlongWord = {
        text: word,
        index,
        startTime: currentTime,
        duration,
      };

      currentTime += duration;

      // Add pauses for punctuation
      if (word.match(/[.!?]$/)) {
        currentTime += pauseAfterSentence;
      } else if (word.match(/[,;:]$/)) {
        currentTime += pauseAfterComma;
      }

      return wordObj;
    });

    return parsedWords;
  }, [msPerWord, pauseAfterSentence, pauseAfterComma]);

  /**
   * Initialize read-along with text
   */
  const initialize = useCallback((text: string) => {
    stop();
    const parsedWords = parseText(text);
    setWords(parsedWords);
    setCurrentWordIndex(-1);
    setProgress(0);
  }, [parseText]);

  /**
   * Advance to next word
   */
  const advanceWord = useCallback(() => {
    setCurrentWordIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;

      if (nextIndex >= words.length) {
        setIsPlaying(false);
        setProgress(100);
        onComplete?.();
        return prevIndex;
      }

      const word = words[nextIndex];
      const totalDuration = words[words.length - 1].startTime + words[words.length - 1].duration;
      const newProgress = ((word.startTime / totalDuration) * 100);
      setProgress(newProgress);

      onWordChange?.(nextIndex);

      // Schedule next word
      const delay = word.duration + (
        word.text.match(/[.!?]$/) ? pauseAfterSentence :
        word.text.match(/[,;:]$/) ? pauseAfterComma : 0
      );

      timeoutRef.current = setTimeout(advanceWord, delay);

      return nextIndex;
    });
  }, [words, pauseAfterSentence, pauseAfterComma, onComplete, onWordChange]);

  /**
   * Start or resume read-along
   */
  const play = useCallback(() => {
    if (words.length === 0) {
      console.warn('No text initialized for read-along');
      return;
    }

    if (isPlaying) return;

    setIsPlaying(true);
    startTimeRef.current = Date.now();

    // Start from current position or beginning
    if (currentWordIndex === -1 || currentWordIndex >= words.length - 1) {
      setCurrentWordIndex(-1);
      setProgress(0);
    }

    advanceWord();
  }, [words, isPlaying, currentWordIndex, advanceWord]);

  /**
   * Pause read-along
   */
  const pause = useCallback(() => {
    if (!isPlaying) return;

    setIsPlaying(false);
    pausedAtRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [isPlaying]);

  /**
   * Stop and reset read-along
   */
  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    setProgress(0);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Jump to specific word
   */
  const jumpToWord = useCallback((wordIndex: number) => {
    if (wordIndex < 0 || wordIndex >= words.length) return;

    const wasPlaying = isPlaying;
    stop();
    setCurrentWordIndex(wordIndex - 1);

    const word = words[wordIndex];
    const totalDuration = words[words.length - 1].startTime + words[words.length - 1].duration;
    setProgress((word.startTime / totalDuration) * 100);

    if (wasPlaying) {
      play();
    }
  }, [words, isPlaying, stop, play]);

  /**
   * Adjust reading speed
   */
  const setSpeed = useCallback((newWordsPerMinute: number) => {
    const wasPlaying = isPlaying;
    const currentIndex = currentWordIndex;

    if (wasPlaying) {
      pause();
    }

    // Re-parse with new speed
    if (words.length > 0) {
      const text = words.map(w => w.text).join(' ');
      initialize(text);
      if (currentIndex >= 0) {
        setCurrentWordIndex(currentIndex);
      }
    }

    if (wasPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [isPlaying, currentWordIndex, words, pause, initialize, play]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get current word text
  const currentWord = currentWordIndex >= 0 && currentWordIndex < words.length
    ? words[currentWordIndex]
    : null;

  // Calculate total duration
  const totalDuration = words.length > 0
    ? words[words.length - 1].startTime + words[words.length - 1].duration
    : 0;

  return {
    initialize,
    play,
    pause,
    stop,
    jumpToWord,
    setSpeed,
    isPlaying,
    currentWordIndex,
    currentWord,
    words,
    progress,
    totalDuration,
    wordsPerMinute,
  };
}
