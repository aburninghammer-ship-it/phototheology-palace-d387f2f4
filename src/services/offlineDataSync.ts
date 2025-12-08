// Offline data sync service for caching and syncing user data

const OFFLINE_STORAGE_KEY = 'phototheology_offline_data';
const PENDING_SYNC_KEY = 'phototheology_pending_sync';

interface OfflineData {
  notes: Array<{
    id: string;
    content: string;
    category: string;
    updatedAt: string;
  }>;
  bookmarks: Array<{
    book: string;
    chapter: number;
    verse?: number;
    note?: string;
  }>;
  readingProgress: {
    book?: string;
    chapter?: number;
    lastRead?: string;
  };
  preferences: Record<string, unknown>;
  cachedAt: string;
}

interface PendingSync {
  type: 'note' | 'bookmark' | 'progress';
  action: 'create' | 'update' | 'delete';
  data: unknown;
  timestamp: string;
}

// Check if we're online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Get cached offline data
export const getOfflineData = (): OfflineData | null => {
  try {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

// Save data for offline use
export const saveOfflineData = (data: Partial<OfflineData>): void => {
  try {
    const existing = getOfflineData() || {
      notes: [],
      bookmarks: [],
      readingProgress: {},
      preferences: {},
      cachedAt: new Date().toISOString()
    };
    
    const updated = {
      ...existing,
      ...data,
      cachedAt: new Date().toISOString()
    };
    
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};

// Add pending sync item
export const addPendingSync = (item: Omit<PendingSync, 'timestamp'>): void => {
  try {
    const pending = getPendingSyncs();
    pending.push({
      ...item,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Failed to add pending sync:', error);
  }
};

// Get pending sync items
export const getPendingSyncs = (): PendingSync[] => {
  try {
    const data = localStorage.getItem(PENDING_SYNC_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Clear pending syncs
export const clearPendingSyncs = (): void => {
  localStorage.removeItem(PENDING_SYNC_KEY);
};

// Cache notes for offline
export const cacheNotes = (notes: OfflineData['notes']): void => {
  saveOfflineData({ notes });
};

// Get cached notes
export const getCachedNotes = (): OfflineData['notes'] => {
  return getOfflineData()?.notes || [];
};

// Cache bookmarks
export const cacheBookmarks = (bookmarks: OfflineData['bookmarks']): void => {
  saveOfflineData({ bookmarks });
};

// Get cached bookmarks
export const getCachedBookmarks = (): OfflineData['bookmarks'] => {
  return getOfflineData()?.bookmarks || [];
};

// Cache reading progress
export const cacheReadingProgress = (progress: OfflineData['readingProgress']): void => {
  saveOfflineData({ readingProgress: progress });
};

// Get cached reading progress
export const getCachedReadingProgress = (): OfflineData['readingProgress'] => {
  return getOfflineData()?.readingProgress || {};
};

// Save user preferences
export const cachePreferences = (prefs: Record<string, unknown>): void => {
  saveOfflineData({ preferences: prefs });
};

// Get cached preferences
export const getCachedPreferences = (): Record<string, unknown> => {
  return getOfflineData()?.preferences || {};
};

// Get offline storage stats
export const getOfflineStorageStats = (): { used: number; available: boolean } => {
  try {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY) || '';
    const pending = localStorage.getItem(PENDING_SYNC_KEY) || '';
    const used = new Blob([data, pending]).size;
    return { used, available: true };
  } catch {
    return { used: 0, available: false };
  }
};

// Clear all offline data
export const clearOfflineData = (): void => {
  localStorage.removeItem(OFFLINE_STORAGE_KEY);
  localStorage.removeItem(PENDING_SYNC_KEY);
};
