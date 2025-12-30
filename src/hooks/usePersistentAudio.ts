import { useRef, useCallback, useEffect } from 'react';

interface PersistentAudioOptions {
  onEnded?: () => void;
  onError?: (error: Event) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

/**
 * Hook that manages a single persistent audio element for mobile compatibility.
 * iOS blocks new Audio() calls after async operations, so we must:
 * 1. Create the audio element once during user gesture
 * 2. Reuse it for all playback by changing src
 * 3. Never destroy it - just pause and clear src
 */
export const usePersistentAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUnlockedRef = useRef(false);
  const callbacksRef = useRef<PersistentAudioOptions>({});
  const hasEndedRef = useRef(false);

  // Create the persistent audio element
  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
      console.log('[PersistentAudio] Created new audio element');
    }
    return audioRef.current;
  }, []);

  // Unlock audio on user gesture (required for iOS)
  const unlock = useCallback(() => {
    if (isUnlockedRef.current) return true;

    const audio = getAudio();
    
    // Play a tiny silent audio to unlock
    audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA';
    audio.volume = 0.01;
    
    return audio.play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        isUnlockedRef.current = true;
        console.log('[PersistentAudio] Audio unlocked successfully');
        return true;
      })
      .catch((e) => {
        console.log('[PersistentAudio] Unlock failed (expected before user gesture):', e.message);
        return false;
      });
  }, [getAudio]);

  // Check if audio is unlocked
  const isUnlocked = useCallback(() => isUnlockedRef.current, []);

  // Play audio from URL
  const play = useCallback(async (
    url: string,
    options: PersistentAudioOptions & {
      volume?: number;
      playbackRate?: number;
    } = {}
  ): Promise<boolean> => {
    const audio = getAudio();
    
    // Store callbacks
    callbacksRef.current = options;
    hasEndedRef.current = false;

    // Stop any current playback
    audio.pause();
    
    // Configure audio
    audio.src = url;
    audio.volume = options.volume ?? 1;
    audio.playbackRate = options.playbackRate ?? 1;
    audio.currentTime = 0;

    // Set up event handlers
    const handleEnded = () => {
      if (hasEndedRef.current) return;
      hasEndedRef.current = true;
      console.log('[PersistentAudio] Audio ended');
      callbacksRef.current.onEnded?.();
    };

    const handleError = (e: Event) => {
      console.error('[PersistentAudio] Audio error:', e);
      callbacksRef.current.onError?.(e);
    };

    const handleTimeUpdate = () => {
      if (!hasEndedRef.current && audio.duration > 0) {
        callbacksRef.current.onTimeUpdate?.(audio.currentTime, audio.duration);
        
        // Fallback end detection for mobile
        if (audio.currentTime >= audio.duration - 0.1) {
          handleEnded();
        }
      }
    };

    const handlePlay = () => {
      callbacksRef.current.onPlay?.();
    };

    const handlePause = () => {
      callbacksRef.current.onPause?.();
    };

    // Remove old handlers and add new ones
    audio.onended = handleEnded;
    audio.onerror = handleError;
    audio.ontimeupdate = handleTimeUpdate;
    audio.onplay = handlePlay;
    audio.onpause = handlePause;

    try {
      await audio.play();
      console.log('[PersistentAudio] Playback started');
      return true;
    } catch (e) {
      console.error('[PersistentAudio] Play failed:', e);
      return false;
    }
  }, [getAudio]);

  // Pause playback
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      console.log('[PersistentAudio] Paused');
    }
  }, []);

  // Resume playback
  const resume = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;
    if (audio && audio.paused && audio.src) {
      try {
        await audio.play();
        console.log('[PersistentAudio] Resumed');
        return true;
      } catch (e) {
        console.error('[PersistentAudio] Resume failed:', e);
        return false;
      }
    }
    return false;
  }, []);

  // Stop playback (but keep element alive)
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      // Don't clear src - just stop. Clearing src can cause issues.
      hasEndedRef.current = true;
      console.log('[PersistentAudio] Stopped');
    }
  }, []);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
    }
  }, []);

  // Get current time
  const getCurrentTime = useCallback(() => {
    return audioRef.current?.currentTime ?? 0;
  }, []);

  // Set current time
  const setCurrentTime = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      hasEndedRef.current = false; // Allow replay
    }
  }, []);

  // Check if playing
  const isPlaying = useCallback(() => {
    const audio = audioRef.current;
    return audio ? !audio.paused : false;
  }, []);

  // Check if has source
  const hasSource = useCallback(() => {
    return !!audioRef.current?.src;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.onended = null;
        audio.onerror = null;
        audio.ontimeupdate = null;
        audio.onplay = null;
        audio.onpause = null;
      }
    };
  }, []);

  return {
    unlock,
    isUnlocked,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setPlaybackRate,
    getCurrentTime,
    setCurrentTime,
    isPlaying,
    hasSource,
    getAudio,
  };
};

