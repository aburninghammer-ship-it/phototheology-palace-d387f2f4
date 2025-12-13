// Hook for managing local-only music stored on user's device
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  LocalTrack,
  saveLocalTrack,
  getLocalTracks,
  deleteLocalTrack,
  toggleLocalFavorite,
  revokeTrackUrls,
} from '@/services/localMusicStorage';

export function useLocalMusic() {
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Load tracks on mount
  useEffect(() => {
    loadTracks();
    
    // Cleanup blob URLs on unmount
    return () => {
      revokeTrackUrls(localTracks);
    };
  }, []);

  const loadTracks = async () => {
    try {
      setIsLoading(true);
      const tracks = await getLocalTracks();
      setLocalTracks(tracks);
    } catch (error) {
      console.error('Failed to load local tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadLocalMusic = useCallback(async (file: File, name: string, mood?: string) => {
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return null;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('File size must be under 100MB');
      return null;
    }

    setUploading(true);
    try {
      const track = await saveLocalTrack(file, name, mood);
      // Reload to get blob URL
      await loadTracks();
      toast.success('Music saved to your device!');
      return track;
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save music');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const removeLocalTrack = useCallback(async (id: string) => {
    try {
      await deleteLocalTrack(id);
      setLocalTracks(prev => prev.filter(t => t.id !== id));
      toast.success('Track removed');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to remove track');
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      await toggleLocalFavorite(id);
      setLocalTracks(prev => 
        prev.map(t => t.id === id ? { ...t, is_favorite: !t.is_favorite } : t)
      );
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  }, []);

  return {
    localTracks,
    isLoading,
    uploading,
    uploadLocalMusic,
    removeLocalTrack,
    toggleFavorite,
    refreshTracks: loadTracks,
  };
}
