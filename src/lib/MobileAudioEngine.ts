/**
 * MobileAudioEngine v2 - Rebuilt from scratch for reliable mobile playback
 *
 * Key principles:
 * 1. Single persistent audio element (never destroyed between plays)
 * 2. Explicit unlock flow with silent audio on first user gesture
 * 3. Simple state machine with clear transitions
 * 4. Mobile-first design (iOS Safari, Chrome Android)
 */

export type AudioState = 'idle' | 'unlocking' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface PlayCallbacks {
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export interface PlayOptions extends PlayCallbacks {
  volume?: number;
  playbackRate?: number;
}

class MobileAudioEngineV2 {
  private audio: HTMLAudioElement;
  private state: AudioState = 'idle';
  private unlocked = false;
  private currentCallbacks: PlayCallbacks = {};
  private hasEndedFired = false;

  // Minimal valid MP3 for iOS unlock (silent, ~10ms)
  private static readonly SILENT_MP3 = 
    'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA';

  constructor() {
    // Create the persistent audio element immediately
    this.audio = new Audio();
    this.audio.preload = 'auto';
    // playsInline for iOS - use setAttribute for compatibility
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');
    
    this.setupListeners();
    console.log('[MobileAudioV2] Engine initialized');
  }

  private setupListeners(): void {
    this.audio.addEventListener('play', () => {
      console.log('[MobileAudioV2] Event: play');
      this.setState('playing');
    });

    this.audio.addEventListener('pause', () => {
      console.log('[MobileAudioV2] Event: pause, state:', this.state);
      // Only set paused if we were playing (not if stopping)
      if (this.state === 'playing') {
        this.setState('paused');
      }
    });

    this.audio.addEventListener('ended', () => {
      console.log('[MobileAudioV2] Event: ended, hasEndedFired:', this.hasEndedFired);
      if (!this.hasEndedFired) {
        this.hasEndedFired = true;
        this.setState('ended');
        this.currentCallbacks.onEnded?.();
      }
    });

    this.audio.addEventListener('error', (e) => {
      const error = new Error(`Audio error: ${this.audio.error?.message || 'Unknown'}`);
      console.error('[MobileAudioV2] Event: error', error.message);
      this.setState('error');
      this.currentCallbacks.onError?.(error);
    });

    // Fallback end detection for mobile (some devices don't fire 'ended')
    this.audio.addEventListener('timeupdate', () => {
      if (!this.hasEndedFired && 
          this.audio.duration > 0 && 
          this.audio.currentTime >= this.audio.duration - 0.05) {
        console.log('[MobileAudioV2] Timeupdate fallback end detection');
        this.hasEndedFired = true;
        this.setState('ended');
        this.currentCallbacks.onEnded?.();
      }
    });
  }

  private setState(newState: AudioState): void {
    if (newState !== this.state) {
      console.log(`[MobileAudioV2] State: ${this.state} → ${newState}`);
      this.state = newState;
    }
  }

  /**
   * Unlock audio context - MUST be called during a user gesture
   * Call this on first tap/click before any audio playback
   */
  async unlock(): Promise<boolean> {
    if (this.unlocked) {
      console.log('[MobileAudioV2] Already unlocked');
      return true;
    }

    console.log('[MobileAudioV2] Attempting unlock...');
    this.setState('unlocking');

    try {
      // Save any existing source
      const prevSrc = this.audio.src;
      
      // Play silent audio to unlock
      this.audio.src = MobileAudioEngineV2.SILENT_MP3;
      this.audio.volume = 0.01;
      
      await this.audio.play();
      
      // Successfully played - now unlock is complete
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.volume = 1;
      this.audio.src = prevSrc || '';
      
      this.unlocked = true;
      this.setState('idle');
      console.log('[MobileAudioV2] ✓ Unlock successful');
      return true;
    } catch (e: any) {
      console.warn('[MobileAudioV2] ✗ Unlock failed:', e?.message);
      this.setState('idle');
      return false;
    }
  }

  /**
   * Check if audio is unlocked
   */
  isUnlocked(): boolean {
    return this.unlocked;
  }

  /**
   * Play audio from URL
   * Auto-unlocks if needed (but should prefer explicit unlock during user gesture)
   */
  async play(url: string, options: PlayOptions = {}): Promise<boolean> {
    console.log('[MobileAudioV2] play() called, url length:', url.length, 'unlocked:', this.unlocked);
    
    // Auto-unlock if needed
    if (!this.unlocked) {
      console.log('[MobileAudioV2] Not unlocked, attempting auto-unlock...');
      await this.unlock();
    }

    // Reset state for new playback
    this.currentCallbacks = {
      onEnded: options.onEnded,
      onError: options.onError,
    };
    this.hasEndedFired = false;

    // Stop any current playback cleanly
    if (!this.audio.paused) {
      this.audio.pause();
    }

    // Configure and load new source
    this.audio.src = url;
    this.audio.volume = options.volume ?? 1;
    this.audio.playbackRate = options.playbackRate ?? 1;
    this.audio.currentTime = 0;

    this.setState('loading');

    try {
      // Wait for audio to be ready enough to play
      await this.waitForCanPlay();
      
      // Attempt playback
      await this.audio.play();
      console.log('[MobileAudioV2] ✓ Playback started');
      return true;
    } catch (e: any) {
      console.error('[MobileAudioV2] ✗ Play failed:', e?.message);
      this.setState('error');
      const error = new Error(`Play failed: ${e?.message}`);
      this.currentCallbacks.onError?.(error);
      return false;
    }
  }

  /**
   * Wait for audio to be ready to play, with timeout
   */
  private waitForCanPlay(timeoutMs = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      // If already ready, resolve immediately
      if (this.audio.readyState >= 3) {
        resolve();
        return;
      }

      let resolved = false;
      
      const onCanPlay = () => {
        if (!resolved) {
          resolved = true;
          this.audio.removeEventListener('canplaythrough', onCanPlay);
          this.audio.removeEventListener('canplay', onCanPlay);
          resolve();
        }
      };

      this.audio.addEventListener('canplaythrough', onCanPlay);
      this.audio.addEventListener('canplay', onCanPlay);
      
      // Explicit load for mobile
      this.audio.load();

      // Timeout - try to play anyway after waiting
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.audio.removeEventListener('canplaythrough', onCanPlay);
          this.audio.removeEventListener('canplay', onCanPlay);
          console.log('[MobileAudioV2] Load timeout, attempting play anyway');
          resolve();
        }
      }, timeoutMs);
    });
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.audio.paused) {
      this.audio.pause();
      console.log('[MobileAudioV2] Paused');
    }
  }

  /**
   * Resume playback
   */
  async resume(): Promise<boolean> {
    if (!this.audio.src) {
      console.warn('[MobileAudioV2] No source to resume');
      return false;
    }
    
    if (!this.audio.paused) {
      console.log('[MobileAudioV2] Already playing');
      return true;
    }

    try {
      await this.audio.play();
      console.log('[MobileAudioV2] Resumed');
      return true;
    } catch (e: any) {
      console.error('[MobileAudioV2] Resume failed:', e?.message);
      return false;
    }
  }

  /**
   * Stop playback completely
   */
  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentCallbacks = {};
    this.hasEndedFired = true; // Prevent onEnded from firing
    this.setState('idle');
    console.log('[MobileAudioV2] Stopped');
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  /**
   * Get duration
   */
  getDuration(): number {
    return this.audio.duration || 0;
  }

  /**
   * Seek to position
   */
  seek(time: number): void {
    this.audio.currentTime = time;
    this.hasEndedFired = false;
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return !this.audio.paused && this.state === 'playing';
  }

  /**
   * Get current state
   */
  getState(): AudioState {
    return this.state;
  }

  /**
   * Clean up (rarely needed - engine is singleton)
   */
  destroy(): void {
    this.stop();
    this.audio.src = '';
    console.log('[MobileAudioV2] Destroyed');
  }
}

// Export singleton
export const mobileAudioEngine = new MobileAudioEngineV2();

// Also export class for testing
export { MobileAudioEngineV2 as MobileAudioEngine };
