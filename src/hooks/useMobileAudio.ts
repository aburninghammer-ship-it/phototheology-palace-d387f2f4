import { useState, useCallback, useEffect, useRef } from 'react';
import { mobileAudioEngine, AudioState, PlayOptions } from '@/lib/MobileAudioEngine';

export interface UseMobileAudioReturn {
  // State
  state: AudioState;
  isUnlocked: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;

  // Actions
  unlock: () => Promise<boolean>;
  play: (url: string, options?: PlayOptions) => Promise<boolean>;
  pause: () => void;
  resume: () => Promise<boolean>;
  stop: () => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  seek: (time: number) => void;
}

/**
 * React hook for mobile audio playback
 *
 * Provides a clean interface to the MobileAudioEngine with React state management.
 * Handles iOS audio unlock requirements and provides reliable cross-device playback.
 *
 * @example
 * ```tsx
 * const { unlock, play, pause, isPlaying, state } = useMobileAudio();
 *
 * const handleTap = async () => {
 *   await unlock(); // First user gesture unlocks audio
 *   await play(audioUrl, { volume: 0.8, onEnded: handleNext });
 * };
 * ```
 */
export function useMobileAudio(): UseMobileAudioReturn {
  const [state, setState] = useState<AudioState>('idle');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Track component mount state to avoid state updates after unmount
  const isMountedRef = useRef(true);

  // Set up callbacks on mount
  useEffect(() => {
    isMountedRef.current = true;

    mobileAudioEngine.setCallbacks({
      onStateChange: (newState) => {
        if (isMountedRef.current) {
          setState(newState);
        }
      },
      onProgress: (time, dur) => {
        if (isMountedRef.current) {
          setCurrentTime(time);
          setDuration(dur);
        }
      },
    });

    // Check if already unlocked (e.g., from previous component)
    setIsUnlocked(mobileAudioEngine.isAudioUnlocked());
    setState(mobileAudioEngine.getState());

    return () => {
      isMountedRef.current = false;
      // Don't destroy the engine - it's a singleton that persists across components
    };
  }, []);

  // Unlock audio (call during user gesture)
  const unlock = useCallback(async (): Promise<boolean> => {
    const success = await mobileAudioEngine.unlock();
    if (isMountedRef.current) {
      setIsUnlocked(success);
    }
    return success;
  }, []);

  // Play audio URL
  const play = useCallback(async (url: string, options?: PlayOptions): Promise<boolean> => {
    return mobileAudioEngine.play(url, options);
  }, []);

  // Pause playback
  const pause = useCallback((): void => {
    mobileAudioEngine.pause();
  }, []);

  // Resume playback
  const resume = useCallback(async (): Promise<boolean> => {
    return mobileAudioEngine.resume();
  }, []);

  // Stop playback
  const stop = useCallback((): void => {
    mobileAudioEngine.stop();
  }, []);

  // Set volume (0-1)
  const setVolume = useCallback((volume: number): void => {
    mobileAudioEngine.setVolume(volume);
  }, []);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number): void => {
    mobileAudioEngine.setPlaybackRate(rate);
  }, []);

  // Seek to position
  const seek = useCallback((time: number): void => {
    mobileAudioEngine.seek(time);
  }, []);

  return {
    // State
    state,
    isUnlocked,
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isLoading: state === 'loading' || state === 'unlocking',
    currentTime,
    duration,

    // Actions
    unlock,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setPlaybackRate,
    seek,
  };
}

export default useMobileAudio;
