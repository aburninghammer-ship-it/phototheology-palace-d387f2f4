/**
 * Audio Cache Service - Unified caching for TTS audio
 *
 * Cache layers:
 * 1. In-memory Map for current session (fastest)
 * 2. Cache API for offline/persistent storage
 * 3. Supabase Storage (handled by edge function)
 */

const TTS_CACHE_NAME = 'pt-audio-cache-v2';

// In-memory cache for session
const memoryCache = new Map<string, string>();

/**
 * Generate cache key for a verse
 */
export function verseKey(book: string, chapter: number, verse: number, voice: string): string {
  return `verse:${book.toLowerCase()}:${chapter}:${verse}:${voice}`;
}

/**
 * Generate cache key for commentary
 */
export function commentaryKey(book: string, chapter: number, voice: string): string {
  return `commentary:${book.toLowerCase()}:${chapter}:${voice}`;
}

/**
 * Generate cache key for arbitrary text
 */
export function textKey(text: string, voice: string): string {
  // Simple hash for text-based key
  const hash = text.slice(0, 50).replace(/[^a-zA-Z0-9]/g, '');
  return `text:${hash}:${voice}`;
}

/**
 * Get audio from cache (checks memory first, then Cache API)
 */
export async function getAudio(key: string): Promise<string | null> {
  // Check memory cache first
  const memoryUrl = memoryCache.get(key);
  if (memoryUrl) {
    console.log('[AudioCache] Memory hit:', key);
    return memoryUrl;
  }

  // Check Cache API
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const response = await cache.match(key);

    if (response) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      // Store in memory for faster subsequent access
      memoryCache.set(key, url);
      console.log('[AudioCache] Cache API hit:', key);
      return url;
    }
  } catch (e) {
    console.warn('[AudioCache] Cache API error:', e);
  }

  return null;
}

/**
 * Cache audio blob
 */
export async function cacheAudio(key: string, blob: Blob): Promise<void> {
  try {
    // Store in Cache API
    const cache = await caches.open(TTS_CACHE_NAME);
    const response = new Response(blob, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
    await cache.put(key, response);

    // Also store blob URL in memory
    const url = URL.createObjectURL(blob);
    memoryCache.set(key, url);

    console.log('[AudioCache] Cached:', key, `(${(blob.size / 1024).toFixed(1)}KB)`);
  } catch (e) {
    console.error('[AudioCache] Cache error:', e);
  }
}

/**
 * Cache audio from URL (fetches and stores)
 */
export async function cacheFromUrl(key: string, url: string): Promise<void> {
  try {
    // Check if already cached
    const existing = await getAudio(key);
    if (existing) return;

    // Fetch and cache
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status}`);
    }

    const blob = await response.blob();
    await cacheAudio(key, blob);
  } catch (e) {
    console.warn('[AudioCache] Failed to cache from URL:', e);
  }
}

/**
 * Clear session memory cache
 */
export function clearSession(): void {
  // Revoke all blob URLs
  memoryCache.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
  memoryCache.clear();
  console.log('[AudioCache] Session cache cleared');
}

/**
 * Clear all caches
 */
export async function clearAll(): Promise<void> {
  clearSession();
  try {
    await caches.delete(TTS_CACHE_NAME);
    console.log('[AudioCache] All caches cleared');
  } catch (e) {
    console.error('[AudioCache] Error clearing cache:', e);
  }
}

/**
 * Get cache size in bytes
 */
export async function getCacheSize(): Promise<number> {
  let totalSize = 0;

  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const keys = await cache.keys();

    for (const req of keys) {
      const resp = await cache.match(req);
      if (resp) {
        const blob = await resp.blob();
        totalSize += blob.size;
      }
    }
  } catch (e) {
    console.warn('[AudioCache] Error calculating size:', e);
  }

  return totalSize;
}

/**
 * Get number of cached items
 */
export async function getCacheCount(): Promise<number> {
  try {
    const cache = await caches.open(TTS_CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}
