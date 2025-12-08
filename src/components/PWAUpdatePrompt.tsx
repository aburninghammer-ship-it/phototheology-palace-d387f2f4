import { useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, RefreshCw } from 'lucide-react';

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered:', swUrl);
      if (r) {
        // Check for updates every 2 minutes for faster detection
        setInterval(() => {
          console.log('Checking for SW update...');
          r.update();
        }, 2 * 60 * 1000);
        // Check immediately on registration
        r.update();
      }
    },
    onNeedRefresh() {
      console.log('New content available, showing update prompt');
      setShowReload(true);
    },
    onOfflineReady() {
      console.log('App ready for offline use');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const handleUpdate = useCallback(() => {
    updateServiceWorker(true);
    // Small delay to ensure SW is activated before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [updateServiceWorker]);

  const handleCheckForUpdates = useCallback(async () => {
    setIsChecking(true);
    try {
      // Try to get the SW registration and check for updates
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          // If there's a waiting worker, show the update prompt
          if (registration.waiting) {
            setShowReload(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  };

  if (!offlineReady && !showReload) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 sm:max-w-md animate-in slide-in-from-bottom-4">
      {offlineReady && !showReload && (
        <Alert className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/20">
          <Download className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground">App ready for offline use</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="flex-1 text-sm text-muted-foreground">The app is now available offline</span>
            <Button onClick={close} variant="outline" size="sm" className="w-full sm:w-auto">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {showReload && (
        <Alert className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-primary/20">
          <RefreshCw className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground">New version available</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="flex-1 text-sm text-muted-foreground">Click reload to update to the latest version</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={handleUpdate} 
                variant="default" 
                size="sm"
                className="flex-1 sm:flex-initial"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Reload
              </Button>
              <Button onClick={close} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                Later
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Export a hook for manual update checking from other components
export function useCheckForUpdates() {
  const [isChecking, setIsChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting) {
            setUpdateAvailable(true);
            return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  const applyUpdate = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    }
  }, []);

  return { checkForUpdates, applyUpdate, isChecking, updateAvailable };
}
