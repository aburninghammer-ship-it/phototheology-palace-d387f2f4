import { useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, RefreshCw } from 'lucide-react';

// Key for tracking recent updates to prevent prompt spam
const UPDATE_COOLDOWN_KEY = 'pwa_update_cooldown';
const UPDATE_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown after update

function isInCooldown(): boolean {
  const cooldownUntil = localStorage.getItem(UPDATE_COOLDOWN_KEY);
  if (!cooldownUntil) return false;
  return Date.now() < parseInt(cooldownUntil, 10);
}

function setCooldown(): void {
  localStorage.setItem(UPDATE_COOLDOWN_KEY, String(Date.now() + UPDATE_COOLDOWN_MS));
}

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered:', swUrl);
      if (r) {
        // Check for updates every 5 minutes (less aggressive)
        setInterval(() => {
          // Don't check if in cooldown
          if (!isInCooldown()) {
            console.log('Checking for SW update...');
            r.update();
          }
        }, 5 * 60 * 1000);
        
        // Only check immediately if not in cooldown
        if (!isInCooldown()) {
          r.update();
        }
      }
    },
    onNeedRefresh() {
      console.log('New content available, checking cooldown...');
      // Only show prompt if not in cooldown period
      if (!isInCooldown()) {
        console.log('Showing update prompt');
        setShowReload(true);
      } else {
        console.log('In cooldown period, skipping prompt');
      }
    },
    onOfflineReady() {
      console.log('App ready for offline use');
    },
    onRegisterError(error) {
      console.error('SW registration error:', error);
    },
  });

  useEffect(() => {
    // Only show if needRefresh is true AND not in cooldown
    if (needRefresh && !isInCooldown()) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const handleUpdate = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      // Set cooldown before updating to prevent immediate re-prompt
      setCooldown();
      
      // Update the service worker
      await updateServiceWorker(true);
      
      // Wait for SW to activate, then reload
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          // Send skip waiting message
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Wait for the new SW to activate
          await new Promise<void>((resolve) => {
            const onControllerChange = () => {
              navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
              resolve();
            };
            navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
            // Timeout after 3 seconds
            setTimeout(resolve, 3000);
          });
        }
      }
      
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error during update:', error);
      setIsUpdating(false);
      // Still try to reload
      window.location.reload();
    }
  }, [updateServiceWorker, isUpdating]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
    // Set a shorter cooldown when user dismisses
    localStorage.setItem(UPDATE_COOLDOWN_KEY, String(Date.now() + 2 * 60 * 1000)); // 2 min cooldown
  };

  if (!offlineReady && !showReload) return null;

  return (
    <div className="fixed bottom-24 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] sm:max-w-md animate-in slide-in-from-bottom-4">
      {offlineReady && !showReload && (
        <Alert className="bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-teal-500/15 backdrop-blur-xl border-2 border-emerald-500/40 shadow-[0_8px_32px_-4px_rgba(16,185,129,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset] rounded-2xl">
          <Download className="h-4 w-4 text-emerald-500" />
          <AlertTitle className="text-foreground font-bold">✅ App ready for offline use</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="flex-1 text-sm text-muted-foreground">The app is now available offline</span>
            <Button onClick={close} variant="outline" size="sm" className="w-full sm:w-auto border-emerald-500/40 hover:bg-emerald-500/10">
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {showReload && (
        <Alert className="bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-violet-500/15 backdrop-blur-xl border-2 border-blue-500/40 shadow-[0_8px_32px_-4px_rgba(59,130,246,0.4),0_0_0_1px_rgba(255,255,255,0.1)_inset] rounded-2xl">
          <RefreshCw className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-foreground font-bold">🚀 New version available</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="flex-1 text-sm text-muted-foreground">Click reload to update to the latest version</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                onClick={handleUpdate} 
                variant="default" 
                size="sm"
                className="flex-1 sm:flex-initial"
                disabled={isUpdating}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Updating...' : 'Reload'}
              </Button>
              <Button onClick={close} variant="outline" size="sm" className="flex-1 sm:flex-initial" disabled={isUpdating}>
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
    // Don't check if in cooldown
    if (isInCooldown()) {
      return false;
    }
    
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
    setCooldown();
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
