// Audio Preloader Service
// Handles background preloading of TTS audio for faster playback

import { supabase } from '@/integrations/supabase/client';
import { 
  getCachedTTSAudio, 
  cacheTTSAudio,
  getCachedCommentaryAudio,
  cacheCommentaryAudio,
  getCachedVerseCommentaryAudio,
  cacheVerseCommentaryAudio,
  isOnline 
} from './offlineAudioCache';

interface PreloadTask {
  id: string;
  priority: number;
  execute: () => Promise<void>;
}

class AudioPreloader {
  private queue: PreloadTask[] = [];
  private isProcessing = false;
  private preloadedUrls = new Map<string, string>();
  private inProgress = new Set<string>();
  private maxConcurrent = 2;
  private activeCount = 0;

  // Preload Bible verse TTS
  async preloadVerseTTS(
    book: string, 
    chapter: number, 
    verse: number, 
    text: string, 
    voice: string,
    priority: number = 5
  ): Promise<void> {
    const id = `verse-${book}-${chapter}-${verse}-${voice}`;
    
    // Skip if already preloaded or in progress
    if (this.preloadedUrls.has(id) || this.inProgress.has(id)) {
      console.log('[AudioPreloader] Already cached/loading:', id);
      return;
    }

    // Check offline cache first
    const cachedUrl = await getCachedTTSAudio(book, chapter, verse, voice);
    if (cachedUrl) {
      console.log('[AudioPreloader] Found in offline cache:', id);
      this.preloadedUrls.set(id, cachedUrl);
      return;
    }

    this.addToQueue({
      id,
      priority,
      execute: async () => {
        if (!isOnline()) return;
        
        try {
          console.log('[AudioPreloader] Preloading verse TTS:', id);
          const { data, error } = await supabase.functions.invoke('text-to-speech', {
            body: { 
              text, 
              voice, 
              provider: 'openai',
              book,
              chapter,
              verse,
              useCache: true
            }
          });

          if (error) throw error;

          if (data?.audioUrl) {
            this.preloadedUrls.set(id, data.audioUrl);
            console.log('[AudioPreloader] Preloaded verse:', id);
            
            // Cache blob for offline
            try {
              const response = await fetch(data.audioUrl);
              if (response.ok) {
                const blob = await response.blob();
                await cacheTTSAudio(book, chapter, verse, blob, voice);
              }
            } catch (e) {
              console.warn('[AudioPreloader] Failed to cache offline:', e);
            }
          } else if (data?.audioContent) {
            // Convert base64 to blob URL
            const byteCharacters = atob(data.audioContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'audio/mpeg' });
            const blobUrl = URL.createObjectURL(blob);
            this.preloadedUrls.set(id, blobUrl);
            
            // Cache for offline
            await cacheTTSAudio(book, chapter, verse, blob, voice);
            console.log('[AudioPreloader] Preloaded + cached verse:', id);
          }
        } catch (e) {
          console.error('[AudioPreloader] Failed to preload verse:', id, e);
        }
      }
    });
  }

  // Preload commentary TTS
  async preloadCommentaryTTS(
    book: string,
    chapter: number,
    depth: string,
    voice: string,
    text: string,
    priority: number = 3
  ): Promise<void> {
    const id = `commentary-${book}-${chapter}-${depth}-${voice}`;
    
    if (this.preloadedUrls.has(id) || this.inProgress.has(id)) {
      return;
    }

    // Check offline cache
    const cachedUrl = await getCachedCommentaryAudio(book, chapter, depth, voice);
    if (cachedUrl) {
      this.preloadedUrls.set(id, cachedUrl);
      return;
    }

    this.addToQueue({
      id,
      priority,
      execute: async () => {
        if (!isOnline()) return;
        
        try {
          console.log('[AudioPreloader] Preloading commentary TTS:', id);
          const { data, error } = await supabase.functions.invoke('text-to-speech', {
            body: { text, voice, provider: 'openai' }
          });

          if (error) throw error;

          if (data?.audioUrl) {
            this.preloadedUrls.set(id, data.audioUrl);
            
            // Cache for offline
            try {
              const response = await fetch(data.audioUrl);
              if (response.ok) {
                const blob = await response.blob();
                await cacheCommentaryAudio(book, chapter, depth, voice, blob);
              }
            } catch (e) {
              console.warn('[AudioPreloader] Failed to cache commentary offline:', e);
            }
          } else if (data?.audioContent) {
            const byteCharacters = atob(data.audioContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'audio/mpeg' });
            const blobUrl = URL.createObjectURL(blob);
            this.preloadedUrls.set(id, blobUrl);
            await cacheCommentaryAudio(book, chapter, depth, voice, blob);
          }
          
          console.log('[AudioPreloader] Preloaded commentary:', id);
        } catch (e) {
          console.error('[AudioPreloader] Failed to preload commentary:', id, e);
        }
      }
    });
  }

  // Get preloaded URL if available
  getPreloadedUrl(id: string): string | null {
    return this.preloadedUrls.get(id) || null;
  }

  // Check if URL is preloaded
  isPreloaded(id: string): boolean {
    return this.preloadedUrls.has(id);
  }

  // Clear preloaded cache (on unmount)
  clearCache(): void {
    // Revoke blob URLs to free memory
    this.preloadedUrls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    this.preloadedUrls.clear();
    this.queue = [];
    this.inProgress.clear();
  }

  private addToQueue(task: PreloadTask): void {
    // Insert based on priority (lower = higher priority)
    const insertIndex = this.queue.findIndex(t => t.priority > task.priority);
    if (insertIndex === -1) {
      this.queue.push(task);
    } else {
      this.queue.splice(insertIndex, 0, task);
    }
    
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.activeCount >= this.maxConcurrent) return;
    
    while (this.queue.length > 0 && this.activeCount < this.maxConcurrent) {
      const task = this.queue.shift();
      if (!task) break;
      
      if (this.inProgress.has(task.id) || this.preloadedUrls.has(task.id)) {
        continue;
      }
      
      this.activeCount++;
      this.inProgress.add(task.id);
      
      task.execute()
        .finally(() => {
          this.activeCount--;
          this.inProgress.delete(task.id);
          this.processQueue();
        });
    }
  }

  // Preload multiple verses ahead
  async preloadAhead(
    book: string,
    chapter: number,
    startVerse: number,
    verses: { verse: number; text: string }[],
    voice: string,
    count: number = 3
  ): Promise<void> {
    const versesToPreload = verses.slice(startVerse, startVerse + count);
    
    for (let i = 0; i < versesToPreload.length; i++) {
      const v = versesToPreload[i];
      // Higher priority for verses closer to current
      await this.preloadVerseTTS(book, chapter, v.verse, v.text, voice, i + 1);
    }
  }
}

// Singleton instance
export const audioPreloader = new AudioPreloader();
