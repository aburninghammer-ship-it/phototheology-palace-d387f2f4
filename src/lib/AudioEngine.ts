/**
 * AudioEngine - Simple audio playback singleton
 *
 * Features:
 * - Single HTMLAudioElement (never recreated)
 * - iOS audio unlock
 * - Simple state: idle | loading | playing | paused | ended
 * - Callback-based (no React coupling)
 */

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';

interface PlayOptions {
  volume?: number;
  playbackRate?: number;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

class AudioEngine {
  private audio: HTMLAudioElement;
  private state: AudioState = 'idle';
  private unlocked = false;
  private currentCallbacks: { onEnded?: () => void; onError?: (error: Error) => void } = {};

  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.addEventListener('playing', () => {
      this.state = 'playing';
    });

    this.audio.addEventListener('pause', () => {
      if (this.state !== 'ended') {
        this.state = 'paused';
      }
    });

    this.audio.addEventListener('ended', () => {
      this.state = 'ended';
      this.currentCallbacks.onEnded?.();
      this.currentCallbacks = {};
    });

    this.audio.addEventListener('error', () => {
      const error = new Error(this.audio.error?.message || 'Audio playback error');
      this.state = 'idle';
      this.currentCallbacks.onError?.(error);
      this.currentCallbacks = {};
    });
  }

  /**
   * Unlock audio for iOS (must be called from user gesture)
   */
  async unlock(): Promise<boolean> {
    if (this.unlocked) return true;

    try {
      // Play silent audio to unlock
      const silentDataUri = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAgAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/4zjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALCAZdAAAAAAAANIAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxCkAAADSAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/jGMR4AAAA0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4xjEmQAAA0gAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
      this.audio.src = silentDataUri;
      this.audio.volume = 0.01;
      await this.audio.play();
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.unlocked = true;
      console.log('[AudioEngine] Unlocked');
      return true;
    } catch (e) {
      console.warn('[AudioEngine] Unlock failed:', e);
      return false;
    }
  }

  /**
   * Play audio from URL
   */
  async play(url: string, options: PlayOptions = {}): Promise<boolean> {
    const { volume = 1, playbackRate = 1, onEnded, onError } = options;

    // Store callbacks
    this.currentCallbacks = { onEnded, onError };

    try {
      this.state = 'loading';

      // Stop any current playback
      this.audio.pause();
      this.audio.currentTime = 0;

      // Set new source and options
      this.audio.src = url;
      this.audio.volume = Math.max(0, Math.min(1, volume));
      this.audio.playbackRate = playbackRate;

      // Wait for audio to load
      await new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          this.audio.removeEventListener('canplaythrough', onCanPlay);
          this.audio.removeEventListener('error', onError);
          resolve();
        };
        const onError = () => {
          this.audio.removeEventListener('canplaythrough', onCanPlay);
          this.audio.removeEventListener('error', onError);
          reject(new Error('Failed to load audio'));
        };
        this.audio.addEventListener('canplaythrough', onCanPlay);
        this.audio.addEventListener('error', onError);
        this.audio.load();
      });

      // Play
      await this.audio.play();
      this.state = 'playing';
      return true;
    } catch (e) {
      console.error('[AudioEngine] Play error:', e);
      this.state = 'idle';
      onError?.(e instanceof Error ? e : new Error('Unknown error'));
      return false;
    }
  }

  pause() {
    if (this.state === 'playing') {
      this.audio.pause();
      this.state = 'paused';
    }
  }

  resume(): boolean {
    if (this.state === 'paused') {
      this.audio.play().catch(() => {});
      return true;
    }
    return false;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = '';
    this.state = 'idle';
    this.currentCallbacks = {};
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setPlaybackRate(rate: number) {
    this.audio.playbackRate = rate;
  }

  getState(): AudioState {
    return this.state;
  }

  isPlaying(): boolean {
    return this.state === 'playing';
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  seek(time: number) {
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(time, this.audio.duration));
    }
  }
}

// Export singleton
export const audioEngine = new AudioEngine();
export type { AudioState, PlayOptions };
