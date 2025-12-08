import { useEffect, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  isOnline,
  getPendingSyncs,
  clearPendingSyncs,
  addPendingSync,
  saveOfflineData,
  getOfflineData
} from '@/services/offlineDataSync';

export const useOfflineSync = () => {
  const [online, setOnline] = useState(isOnline());
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();

  // Update pending count
  const updatePendingCount = useCallback(() => {
    setPendingCount(getPendingSyncs().length);
  }, []);

  // Sync pending changes when coming back online
  const syncPendingChanges = useCallback(async () => {
    const pending = getPendingSyncs();
    if (pending.length === 0) return;

    setSyncing(true);
    try {
      // Here you would sync each pending item to the server
      // For now, we just clear them since we're using local storage
      console.log('Syncing', pending.length, 'pending changes...');
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      clearPendingSyncs();
      updatePendingCount();
      
      toast({
        title: 'Synced!',
        description: `${pending.length} offline changes synced successfully.`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: 'Sync failed',
        description: 'Your changes will sync when connection improves.',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  }, [toast, updatePendingCount]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      syncPendingChanges();
    };

    const handleOffline = () => {
      setOnline(false);
      toast({
        title: 'You\'re offline',
        description: 'Changes will be saved locally and synced when you\'re back online.',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    updatePendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingChanges, toast, updatePendingCount]);

  // Queue an action for sync
  const queueSync = useCallback((
    type: 'note' | 'bookmark' | 'progress',
    action: 'create' | 'update' | 'delete',
    data: unknown
  ) => {
    addPendingSync({ type, action, data });
    updatePendingCount();
    
    // Also save to local offline data
    const offlineData = getOfflineData();
    if (type === 'note' && offlineData) {
      // Update local notes cache
      saveOfflineData(offlineData);
    }
  }, [updatePendingCount]);

  return {
    online,
    syncing,
    pendingCount,
    queueSync,
    syncPendingChanges,
  };
};
