/**
 * AudioEngine - Simple singleton for audio playback
 * Handles iOS audio unlock and provides consistent playback across devices
 */

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

type AudioEventCallback = (state: AudioState, data?: any) => void;

class AudioEngine {
  private static instance: AudioEngine;
  private audio: HTMLAudioElement | null = null;
  private isUnlocked = false;
  private listeners: Set<AudioEventCallback> = new Set();
  private currentState: AudioState = 'idle';
  private playbackRate = 1.0;
  private volume = 1.0;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupEventListeners();
    }
  }

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', () => this.setState('loading'));
    this.audio.addEventListener('canplay', () => {
      if (this.currentState === 'loading') {
        this.audio?.play().catch(console.error);
      }
    });
    this.audio.addEventListener('playing', () => this.setState('playing'));
    this.audio.addEventListener('pause', () => {
      if (this.currentState !== 'ended') {
        this.setState('paused');
      }
    });
    this.audio.addEventListener('ended', () => this.setState('ended'));
    this.audio.addEventListener('error', (e) => {
      console.error('[AudioEngine] Error:', e);
      this.setState('error');
    });
  }

  private setState(state: AudioState, data?: any) {
    this.currentState = state;
    this.listeners.forEach(cb => cb(state, data));
  }

  subscribe(callback: AudioEventCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Unlock audio on iOS - must be called from user gesture
   */
  async unlock(): Promise<boolean> {
    if (this.isUnlocked || !this.audio) return true;

    try {
      // Tiny silent audio data URI
      const silentAudio = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRwmHAAAAAAD/+xBkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sQZB4P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';

      this.audio.src = silentAudio;
      this.audio.volume = 0.01;
      await this.audio.play();
      this.audio.pause();
      this.audio.volume = 1;
      this.isUnlocked = true;
      console.log('[AudioEngine] iOS audio unlocked');
      return true;
    } catch (error) {
      console.error('[AudioEngine] Failed to unlock:', error);
      return false;
    }
  }

  async play(url: string): Promise<void> {
    if (!this.audio) return;

    try {
      this.audio.src = url;
      this.audio.playbackRate = this.playbackRate;
      this.audio.volume = this.volume;
      this.setState('loading');
      await this.audio.load();
    } catch (error) {
      console.error('[AudioEngine] Play error:', error);
      this.setState('error');
    }
  }

  pause() {
    this.audio?.pause();
  }

  resume() {
    this.audio?.play().catch(console.error);
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.src = '';
      this.setState('idle');
    }
  }

  setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  getVolume(): number {
    return this.volume;
  }

  getState(): AudioState {
    return this.currentState;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  isAudioUnlocked(): boolean {
    return this.isUnlocked;
  }
}

export const audioEngine = AudioEngine.getInstance();
export type { AudioState };
