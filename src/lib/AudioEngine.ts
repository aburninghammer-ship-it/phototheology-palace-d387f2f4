/**
 * AudioEngine - Unified audio playback engine for Bible TTS
 *
 * Key features:
 * 1. Single persistent audio element (never destroyed)
 * 2. iOS audio unlock with silent MP3
 * 3. Event emitter for React state sync
 * 4. Media Session API for lock screen controls
 * 5. Simple state machine
 */

export type AudioState = 'idle' | 'unlocking' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface AudioEngineEvents {
  stateChange: (state: AudioState) => void;
  progress: (currentTime: number, duration: number) => void;
  ended: () => void;
  error: (error: Error) => void;
}

export interface PlayOptions {
  volume?: number;
  playbackRate?: number;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  // For Media Session
  title?: string;
  artist?: string;
  album?: string;
}

// Minimal silent MP3 for iOS unlock (~10ms)
const SILENT_MP3 = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAbD/rU9UAAAAAAAAAAAAAAAAAAAAAP/jOMAAABQAJQCAAAhDAH+AIACQA/xQAP/zDAIAAAFPAQD/8wgD/+M4wAAAGMAlAAA';

class AudioEngineClass {
  private static instance: AudioEngineClass | null = null;

  private audio: HTMLAudioElement;
  private state: AudioState = 'idle';
  private unlocked = false;
  private hasEndedFired = false;

  // Event listeners
  private listeners: Map<keyof AudioEngineEvents, Set<Function>> = new Map();

  // Current playback callbacks
  private currentCallbacks: { onEnded?: () => void; onError?: (error: Error) => void } = {};

  // Progress interval
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  private constructor() {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.setAttribute('playsinline', 'true');
    this.audio.setAttribute('webkit-playsinline', 'true');

    this.setupListeners();
    console.log('[AudioEngine] Initialized');
  }

  static getInstance(): AudioEngineClass {
    if (!AudioEngineClass.instance) {
      AudioEngineClass.instance = new AudioEngineClass();
    }
    return AudioEngineClass.instance;
  }

  private setupListeners(): void {
    this.audio.addEventListener('play', () => {
      this.setState('playing');
      this.startProgressInterval();
    });

    this.audio.addEventListener('pause', () => {
      if (this.state === 'playing') {
        this.setState('paused');
      }
      this.stopProgressInterval();
    });

    this.audio.addEventListener('ended', () => {
      if (!this.hasEndedFired) {
        this.hasEndedFired = true;
        this.setState('ended');
        this.emit('ended');
        this.currentCallbacks.onEnded?.();
      }
      this.stopProgressInterval();
    });

    this.audio.addEventListener('error', () => {
      const error = new Error(`Audio error: ${this.audio.error?.message || 'Unknown'}`);
      this.setState('error');
      this.emit('error', error);
      this.currentCallbacks.onError?.(error);
      this.stopProgressInterval();
    });

    // Fallback end detection for mobile
    this.audio.addEventListener('timeupdate', () => {
      if (!this.hasEndedFired &&
          this.audio.duration > 0 &&
          this.audio.currentTime >= this.audio.duration - 0.05) {
        this.hasEndedFired = true;
        this.setState('ended');
        this.emit('ended');
        this.currentCallbacks.onEnded?.();
        this.stopProgressInterval();
      }
    });
  }

  private setState(newState: AudioState): void {
    if (newState !== this.state) {
      console.log(`[AudioEngine] State: ${this.state} → ${newState}`);
      this.state = newState;
      this.emit('stateChange', newState);
    }
  }

  private startProgressInterval(): void {
    this.stopProgressInterval();
    this.progressInterval = setInterval(() => {
      if (this.state === 'playing') {
        this.emit('progress', this.audio.currentTime, this.audio.duration || 0);
      }
    }, 250);
  }

  private stopProgressInterval(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  // Event emitter methods
  on<K extends keyof AudioEngineEvents>(event: K, callback: AudioEngineEvents[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off<K extends keyof AudioEngineEvents>(event: K, callback: AudioEngineEvents[K]): void {
    this.listeners.get(event)?.delete(callback);
  }

  private emit<K extends keyof AudioEngineEvents>(event: K, ...args: Parameters<AudioEngineEvents[K]>): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        (callback as Function)(...args);
      } catch (e) {
        console.error(`[AudioEngine] Event handler error:`, e);
      }
    });
  }

  /**
   * Unlock audio context - MUST be called during user gesture on iOS
   */
  async unlock(): Promise<boolean> {
    if (this.unlocked) {
      return true;
    }

    console.log('[AudioEngine] Attempting unlock...');
    this.setState('unlocking');

    try {
      const prevSrc = this.audio.src;

      this.audio.src = SILENT_MP3;
      this.audio.volume = 0.01;

      await this.audio.play();

      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.volume = 1;
      this.audio.src = prevSrc || '';

      this.unlocked = true;
      this.setState('idle');
      console.log('[AudioEngine] ✓ Unlock successful');
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.warn('[AudioEngine] ✗ Unlock failed:', message);
      this.setState('idle');
      return false;
    }
  }

  isUnlocked(): boolean {
    return this.unlocked;
  }

  /**
   * Play audio from URL
   */
  async play(url: string, options: PlayOptions = {}): Promise<boolean> {
    console.log('[AudioEngine] play() called, url length:', url.length);

    // Auto-unlock if needed
    if (!this.unlocked) {
      await this.unlock();
    }

    // Store callbacks
    this.currentCallbacks = {
      onEnded: options.onEnded,
      onError: options.onError,
    };
    this.hasEndedFired = false;

    // Stop current playback
    if (!this.audio.paused) {
      this.audio.pause();
    }

    // Configure audio
    this.audio.src = url;
    this.audio.volume = options.volume ?? 1;
    this.audio.playbackRate = options.playbackRate ?? 1;
    this.audio.currentTime = 0;

    this.setState('loading');

    // Update Media Session
    if (options.title && 'mediaSession' in navigator) {
      this.updateMediaSession(options);
    }

    try {
      await this.waitForCanPlay();
      await this.audio.play();
      console.log('[AudioEngine] ✓ Playback started');
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('[AudioEngine] ✗ Play failed:', message);
      this.setState('error');
      const error = new Error(`Play failed: ${message}`);
      this.currentCallbacks.onError?.(error);
      return false;
    }
  }

  private waitForCanPlay(timeoutMs = 3000): Promise<void> {
    return new Promise((resolve) => {
      if (this.audio.readyState >= 2) {
        resolve();
        return;
      }

      let resolved = false;

      const cleanup = () => {
        this.audio.removeEventListener('canplaythrough', onReady);
        this.audio.removeEventListener('canplay', onReady);
        this.audio.removeEventListener('loadeddata', onReady);
        this.audio.removeEventListener('error', onReady);
      };

      const onReady = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      };

      this.audio.addEventListener('canplaythrough', onReady);
      this.audio.addEventListener('canplay', onReady);
      this.audio.addEventListener('loadeddata', onReady);
      this.audio.addEventListener('error', onReady);

      this.audio.load();

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          console.log('[AudioEngine] Timeout - trying play anyway');
          resolve();
        }
      }, timeoutMs);
    });
  }

  private updateMediaSession(options: PlayOptions): void {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: options.title || 'Bible Audio',
        artist: options.artist || 'Phototheology',
        album: options.album || 'Bible Reading',
      });

      navigator.mediaSession.setActionHandler('play', () => this.resume());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('stop', () => this.stop());
    } catch (e) {
      // Media Session not supported
    }
  }

  pause(): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
  }

  async resume(): Promise<boolean> {
    if (!this.audio.src) {
      return false;
    }

    if (!this.audio.paused) {
      return true;
    }

    try {
      await this.audio.play();
      return true;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('[AudioEngine] Resume failed:', message);
      return false;
    }
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentCallbacks = {};
    this.hasEndedFired = true;
    this.setState('idle');
    this.stopProgressInterval();
  }

  seek(time: number): void {
    this.audio.currentTime = time;
    this.hasEndedFired = false;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setPlaybackRate(rate: number): void {
    this.audio.playbackRate = Math.max(0.5, Math.min(2, rate));
  }

  getState(): AudioState {
    return this.state;
  }

  isPlaying(): boolean {
    return !this.audio.paused && this.state === 'playing';
  }

  isPaused(): boolean {
    return this.state === 'paused';
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  getDuration(): number {
    return this.audio.duration || 0;
  }

  getProgress(): number {
    const duration = this.getDuration();
    if (duration === 0) return 0;
    return (this.audio.currentTime / duration) * 100;
  }
}

// Export singleton instance
export const audioEngine = AudioEngineClass.getInstance();

// Export class for testing
export { AudioEngineClass as AudioEngine };
