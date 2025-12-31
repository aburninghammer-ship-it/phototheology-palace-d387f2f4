/**
 * MobileAudioEngine - Centralized audio management for mobile devices
 *
 * Solves iOS/mobile audio restrictions by:
 * 1. Creating a single persistent audio element (never destroyed)
 * 2. Unlocking audio on first user gesture with silent audio
 * 3. Providing a clean state machine for playback states
 * 4. Handling all event listeners in one place to avoid race conditions
 */

export type AudioState = 'idle' | 'unlocking' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface AudioCallbacks {
  onStateChange?: (state: AudioState, prevState: AudioState) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

export interface PlayOptions {
  volume?: number;
  playbackRate?: number;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

class MobileAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private state: AudioState = 'idle';
  private isUnlocked = false;
  private callbacks: AudioCallbacks = {};
  private currentPlayCallbacks: PlayOptions = {};
  private hasEndedForCurrentSource = false;
  private progressInterval: number | null = null;
  private loadTimeoutId: number | null = null;

  // Silent audio for iOS unlock (minimal valid MP3)
  private static SILENT_AUDIO = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA';

  constructor() {
    // Don't create audio element in constructor - create on first use
    console.log('[MobileAudioEngine] Initialized');
  }

  /**
   * Get or create the persistent audio element
   */
  private getAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.setupEventListeners();
      console.log('[MobileAudioEngine] Created audio element');
    }
    return this.audio;
  }

  /**
   * Set up all event listeners once
   */
  private setupEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('pause', this.handlePause);
    this.audio.addEventListener('ended', this.handleEnded);
    this.audio.addEventListener('error', this.handleError);
    this.audio.addEventListener('loadstart', this.handleLoadStart);
    this.audio.addEventListener('canplaythrough', this.handleCanPlayThrough);
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
  }

  private handlePlay = (): void => {
    console.log('[MobileAudioEngine] Play event');
    this.setState('playing');
    this.callbacks.onPlay?.();
    this.startProgressTracking();
  };

  private handlePause = (): void => {
    console.log('[MobileAudioEngine] Pause event');
    // Only set paused state if we were playing (not if we're stopping)
    if (this.state === 'playing') {
      this.setState('paused');
      this.callbacks.onPause?.();
    }
    this.stopProgressTracking();
  };

  private handleEnded = (): void => {
    if (this.hasEndedForCurrentSource) {
      console.log('[MobileAudioEngine] End already handled, skipping');
      return;
    }
    this.hasEndedForCurrentSource = true;
    console.log('[MobileAudioEngine] Ended event');
    this.setState('ended');
    this.stopProgressTracking();
    this.callbacks.onEnded?.();
    this.currentPlayCallbacks.onEnded?.();
  };

  private handleError = (e: Event): void => {
    const error = new Error(`Audio error: ${(e.target as HTMLAudioElement)?.error?.message || 'Unknown error'}`);
    console.error('[MobileAudioEngine] Error:', error.message);
    this.setState('error');
    this.stopProgressTracking();
    this.callbacks.onError?.(error);
    this.currentPlayCallbacks.onError?.(error);
  };

  private handleLoadStart = (): void => {
    console.log('[MobileAudioEngine] Load started');
  };

  private handleCanPlayThrough = (): void => {
    console.log('[MobileAudioEngine] Can play through');
  };

  private handleTimeUpdate = (): void => {
    if (!this.audio) return;

    // Fallback end detection for mobile (some devices don't fire 'ended')
    if (!this.hasEndedForCurrentSource &&
        this.audio.duration > 0 &&
        this.audio.currentTime >= this.audio.duration - 0.1) {
      console.log('[MobileAudioEngine] Timeupdate fallback end detection');
      this.handleEnded();
    }
  };

  private startProgressTracking(): void {
    this.stopProgressTracking();
    this.progressInterval = window.setInterval(() => {
      if (this.audio && this.audio.duration > 0) {
        this.callbacks.onProgress?.(this.audio.currentTime, this.audio.duration);
      }
    }, 250);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval !== null) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private setState(newState: AudioState): void {
    const prevState = this.state;
    if (newState !== prevState) {
      this.state = newState;
      console.log(`[MobileAudioEngine] State: ${prevState} -> ${newState}`);
      this.callbacks.onStateChange?.(newState, prevState);
    }
  }

  /**
   * Set callbacks for audio events
   */
  setCallbacks(callbacks: AudioCallbacks): void {
    this.callbacks = callbacks;
  }

  /**
   * Get current state
   */
  getState(): AudioState {
    return this.state;
  }

  /**
   * Check if audio is unlocked (can play without user gesture)
   */
  isAudioUnlocked(): boolean {
    return this.isUnlocked;
  }

  /**
   * Unlock audio for iOS - must be called during user gesture
   * Returns a promise that resolves when unlock is complete
   */
  async unlock(): Promise<boolean> {
    if (this.isUnlocked) {
      console.log('[MobileAudioEngine] Already unlocked');
      return true;
    }

    this.setState('unlocking');
    const audio = this.getAudio();

    try {
      // Play silent audio to unlock the audio context
      audio.src = MobileAudioEngine.SILENT_AUDIO;
      audio.volume = 0.01;

      await audio.play();

      // Successfully played - audio is now unlocked
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.volume = 1;

      this.isUnlocked = true;
      this.setState('idle');
      console.log('[MobileAudioEngine] Unlocked successfully');
      return true;
    } catch (e: any) {
      console.warn('[MobileAudioEngine] Unlock failed:', e?.message);
      this.setState('idle');
      return false;
    }
  }

  /**
   * Play audio from URL
   * Automatically attempts unlock if needed (important for mobile)
   */
  async play(url: string, options: PlayOptions = {}): Promise<boolean> {
    // CRITICAL: Auto-unlock on mobile if not already unlocked
    // This ensures playback works even if the component didn't call unlock() first
    if (!this.isUnlocked) {
      console.log('[MobileAudioEngine] Not unlocked, attempting auto-unlock before play...');
      const unlockResult = await this.unlock();
      if (!unlockResult) {
        console.warn('[MobileAudioEngine] Auto-unlock failed - playback may fail');
        // Continue anyway - might work on some browsers
      }
    }

    const audio = this.getAudio();

    // Store callbacks for this playback
    this.currentPlayCallbacks = options;
    this.hasEndedForCurrentSource = false;

    // Clear any pending load timeout
    if (this.loadTimeoutId !== null) {
      clearTimeout(this.loadTimeoutId);
      this.loadTimeoutId = null;
    }

    // Stop any current playback
    audio.pause();

    // Configure audio
    audio.src = url;
    audio.volume = options.volume ?? 1;
    audio.playbackRate = options.playbackRate ?? 1;
    audio.currentTime = 0;

    this.setState('loading');
    console.log('[MobileAudioEngine] Loading:', url.substring(0, 50) + '...');

    return new Promise<boolean>((resolve) => {
      let playAttempted = false;

      const attemptPlay = async (): Promise<void> => {
        if (playAttempted) return;
        playAttempted = true;

        try {
          await audio.play();
          console.log('[MobileAudioEngine] Playback started');
          resolve(true);
        } catch (e: any) {
          console.error('[MobileAudioEngine] Play failed:', e?.message);
          this.setState('error');
          const error = new Error(`Play failed: ${e?.message}`);
          this.currentPlayCallbacks.onError?.(error);
          resolve(false);
        }
      };

      // If audio is already ready (cached), play immediately
      if (audio.readyState >= 3) {
        attemptPlay();
        return;
      }

      // Wait for audio to be ready
      const onCanPlay = (): void => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        if (this.loadTimeoutId !== null) {
          clearTimeout(this.loadTimeoutId);
          this.loadTimeoutId = null;
        }
        attemptPlay();
      };

      audio.addEventListener('canplaythrough', onCanPlay);

      // Timeout fallback - try to play anyway after 3s
      this.loadTimeoutId = window.setTimeout(() => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        if (!playAttempted) {
          console.log('[MobileAudioEngine] Load timeout, attempting play anyway');
          attemptPlay();
        }
      }, 3000);

      // Trigger load explicitly for mobile
      audio.load();
    });
  }

  /**
   * Pause playback
   */
  pause(): void {
    const audio = this.audio;
    if (audio && !audio.paused) {
      audio.pause();
      console.log('[MobileAudioEngine] Paused');
    }
  }

  /**
   * Resume playback
   */
  async resume(): Promise<boolean> {
    const audio = this.audio;
    if (!audio || !audio.src) {
      console.warn('[MobileAudioEngine] No audio to resume');
      return false;
    }

    if (!audio.paused) {
      console.log('[MobileAudioEngine] Already playing');
      return true;
    }

    try {
      await audio.play();
      console.log('[MobileAudioEngine] Resumed');
      return true;
    } catch (e: any) {
      console.error('[MobileAudioEngine] Resume failed:', e?.message);
      return false;
    }
  }

  /**
   * Stop playback (keeps element alive for reuse)
   */
  stop(): void {
    const audio = this.audio;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      // Clear callbacks for current playback
      this.currentPlayCallbacks = {};
      this.hasEndedForCurrentSource = true;
      this.stopProgressTracking();
      this.setState('idle');
      console.log('[MobileAudioEngine] Stopped');
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.audio?.currentTime ?? 0;
  }

  /**
   * Get duration
   */
  getDuration(): number {
    return this.audio?.duration ?? 0;
  }

  /**
   * Seek to position
   */
  seek(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
      this.hasEndedForCurrentSource = false; // Allow replay
    }
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  /**
   * Clean up resources (call on component unmount)
   */
  destroy(): void {
    this.stopProgressTracking();

    if (this.loadTimeoutId !== null) {
      clearTimeout(this.loadTimeoutId);
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener('play', this.handlePlay);
      this.audio.removeEventListener('pause', this.handlePause);
      this.audio.removeEventListener('ended', this.handleEnded);
      this.audio.removeEventListener('error', this.handleError);
      this.audio.removeEventListener('loadstart', this.handleLoadStart);
      this.audio.removeEventListener('canplaythrough', this.handleCanPlayThrough);
      this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.audio.src = '';
    }

    this.callbacks = {};
    this.currentPlayCallbacks = {};
    console.log('[MobileAudioEngine] Destroyed');
  }
}

// Export singleton instance for app-wide use
export const mobileAudioEngine = new MobileAudioEngine();

// Also export class for testing or multiple instances
export { MobileAudioEngine };
