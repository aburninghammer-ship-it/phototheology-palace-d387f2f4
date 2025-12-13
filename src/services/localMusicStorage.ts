// Local music storage using IndexedDB - keeps music private on user's device

const DB_NAME = 'pt-local-music';
const DB_VERSION = 1;
const STORE_NAME = 'tracks';

export interface LocalTrack {
  id: string;
  name: string;
  mood?: string;
  category: 'local';
  blob: Blob;
  blobUrl?: string;
  created_at: string;
  is_favorite: boolean;
}

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;
  
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
  
  return dbPromise;
};

export const saveLocalTrack = async (file: File, name: string, mood?: string): Promise<LocalTrack> => {
  const db = await openDB();
  const track: LocalTrack = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: name || file.name.replace(/\.[^/.]+$/, ''),
    mood,
    category: 'local',
    blob: file,
    created_at: new Date().toISOString(),
    is_favorite: false,
  };
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(track);
    
    request.onsuccess = () => resolve(track);
    request.onerror = () => reject(request.error);
  });
};

export const getLocalTracks = async (): Promise<LocalTrack[]> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onsuccess = () => {
      const tracks = request.result.map((track: LocalTrack) => ({
        ...track,
        blobUrl: URL.createObjectURL(track.blob),
      }));
      resolve(tracks);
    };
    request.onerror = () => reject(request.error);
  });
};

export const deleteLocalTrack = async (id: string): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const toggleLocalFavorite = async (id: string): Promise<void> => {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const track = getRequest.result;
      if (track) {
        track.is_favorite = !track.is_favorite;
        store.put(track);
      }
      resolve();
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
};

// Cleanup blob URLs when component unmounts
export const revokeTrackUrls = (tracks: LocalTrack[]) => {
  tracks.forEach(track => {
    if (track.blobUrl) {
      URL.revokeObjectURL(track.blobUrl);
    }
  });
};
