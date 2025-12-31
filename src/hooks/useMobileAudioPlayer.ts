/**
 * useMobileAudioPlayer - Simplified hook for mobile audio playback
 * 
 * Provides a clean, minimal API for playing audio on mobile devices.
 * Handles iOS unlock, state management, and all mobile quirks.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { mobileAudioEngine, AudioState, PlayOptions } from '@/lib/MobileAudioEngine';

export interface MobileAudioPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  isUnlocked: boolean;
  state: AudioState;
}

export interface MobileAudioPlayerActions {
  /**
   * Unlock audio - call during first user gesture (tap/click)
   */
  unlock: () => Promise<boolean>;
  
  /**
   * Play audio from URL
   */
  play: (url: string, options?: PlayOptions) => Promise<boolean>;
  
  /**
   * Pause current playback
   */
  pause: () => void;
  
  /**
   * Resume paused playback
   */
  resume: () => Promise<boolean>;
  
  /**
   * Stop playback completely
   */
  stop: () => void;
  
  /**
   * Set volume (0-1)
   */
  setVolume: (volume: number) => void;
  
  /**
   * Set playback speed
   */
  setPlaybackRate: (rate: number) => void;
}

export type UseMobileAudioPlayerReturn = MobileAudioPlayerState & MobileAudioPlayerActions;

/**
 * Hook for mobile audio playback
 * 
 * @example
 * ```tsx
 * const audio = useMobileAudioPlayer();
 * 
 * const handleTap = async () => {
 *   await audio.unlock(); // First tap unlocks audio
 *   await audio.play(myAudioUrl, {
 *     volume: 0.8,
 *     onEnded: () => console.log('Done!')
 *   });
 * };
 * ```
 */
export function useMobileAudioPlayer(): UseMobileAudioPlayerReturn {
  const [state, setState] = useState<AudioState>(() => mobileAudioEngine.getState());
  const [isUnlocked, setIsUnlocked] = useState(() => mobileAudioEngine.isUnlocked());
  const mountedRef = useRef(true);

  // Sync state with engine
  useEffect(() => {
    mountedRef.current = true;
    
    // Poll for state changes (simple approach that works reliably)
    const interval = setInterval(() => {
      if (mountedRef.current) {
        const engineState = mobileAudioEngine.getState();
        const engineUnlocked = mobileAudioEngine.isUnlocked();
        
        setState(prev => prev !== engineState ? engineState : prev);
        setIsUnlocked(prev => prev !== engineUnlocked ? engineUnlocked : prev);
      }
    }, 100);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  const unlock = useCallback(async (): Promise<boolean> => {
    const result = await mobileAudioEngine.unlock();
    if (mountedRef.current) {
      setIsUnlocked(result);
    }
    return result;
  }, []);

  const play = useCallback(async (url: string, options?: PlayOptions): Promise<boolean> => {
    return mobileAudioEngine.play(url, options);
  }, []);

  const pause = useCallback((): void => {
    mobileAudioEngine.pause();
  }, []);

  const resume = useCallback(async (): Promise<boolean> => {
    return mobileAudioEngine.resume();
  }, []);

  const stop = useCallback((): void => {
    mobileAudioEngine.stop();
  }, []);

  const setVolume = useCallback((volume: number): void => {
    mobileAudioEngine.setVolume(volume);
  }, []);

  const setPlaybackRate = useCallback((rate: number): void => {
    mobileAudioEngine.setPlaybackRate(rate);
  }, []);

  return {
    // State
    state,
    isUnlocked,
    isPlaying: state === 'playing',
    isPaused: state === 'paused',
    isLoading: state === 'loading' || state === 'unlocking',
    
    // Actions
    unlock,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setPlaybackRate,
  };
}

export default useMobileAudioPlayer;
