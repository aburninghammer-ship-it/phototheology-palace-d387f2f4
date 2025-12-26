import { useEffect, useRef, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, RefreshCw } from 'lucide-react';
import { hardReloadApp, PWA_UPDATE_COOLDOWN_KEY } from '@/lib/pwa';

// Key for tracking recent updates to prevent prompt spam
const UPDATE_COOLDOWN_KEY = PWA_UPDATE_COOLDOWN_KEY;
const UPDATE_COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown after update (reduced from 5 min)

function getCooldownUntil(): number | null {
  try {
    const raw = localStorage.getItem(UPDATE_COOLDOWN_KEY);
    if (!raw) return null;

    const until = Number(raw);
    if (!Number.isFinite(until)) {
      localStorage.removeItem(UPDATE_COOLDOWN_KEY);
      return null;
    }

    // Guardrail: prevent a bad timestamp from blocking updates indefinitely
    const maxFuture = Date.now() + 60 * 60 * 1000; // 1 hour
    if (until > maxFuture) {
      localStorage.removeItem(UPDATE_COOLDOWN_KEY);
      return null;
    }

    return until;
  } catch {
    return null;
  }
}

function isInCooldown(): boolean {
  const until = getCooldownUntil();
  return typeof until === 'number' && Date.now() < until;
}

function setCooldown(ms: number = UPDATE_COOLDOWN_MS): void {
  try {
    localStorage.setItem(UPDATE_COOLDOWN_KEY, String(Date.now() + ms));
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

async function hardReload(): Promise<void> {
  await hardReloadApp();
}

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const updateIntervalRef = useRef<number | null>(null);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW registered:', swUrl);
      registrationRef.current = r ?? null;

      if (updateIntervalRef.current) {
        window.clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      if (r) {
        // Check for updates every 2 minutes
        updateIntervalRef.current = window.setInterval(() => {
          console.log('Checking for SW update...');
          r.update();
        }, 2 * 60 * 1000);

        // Also check immediately on load
        r.update();
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
    return () => {
      if (updateIntervalRef.current) window.clearInterval(updateIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // Only show if needRefresh is true AND not in cooldown
    if (needRefresh && !isInCooldown()) {
      setShowReload(true);
    }
  }, [needRefresh]);

  // Failsafe: if a SW is already waiting (but callbacks didn't fire), surface the prompt
  useEffect(() => {
    const t = window.setTimeout(async () => {
      try {
        if (!('serviceWorker' in navigator)) return;
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

        await reg.update();
        if (reg.waiting && !isInCooldown()) setShowReload(true);
      } catch {
        // ignore
      }
    }, 1500);

    return () => window.clearTimeout(t);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      // Mark cooldown immediately to avoid prompt spam
      setCooldown();

      // Preferred path: ask the waiting SW to activate and reload.
      // If that fails (or no SW), fall back to a full hard reload.
      await updateServiceWorker(true);
    } catch (error) {
      console.error('SW apply failed, falling back to hard reload:', error);
      await hardReload();
    } finally {
      // If reload didn't happen for any reason, re-enable the UI
      setIsUpdating(false);
    }
  }, [isUpdating, updateServiceWorker]);

  // Also check for updates when user returns to the app (mobile + desktop)
  // Auto-apply updates if a SW is waiting when user returns
  useEffect(() => {
    const checkAndAutoApply = async () => {
      try {
        if (!('serviceWorker' in navigator)) return;

        const reg = registrationRef.current ?? (await navigator.serviceWorker.getRegistration());
        if (!reg) return;
        registrationRef.current = reg;

        await reg.update();

        const hasWaiting = !!(reg.waiting ?? (await navigator.serviceWorker.getRegistration())?.waiting);
        if ((needRefresh || hasWaiting) && !isInCooldown()) {
          console.log('Auto-applying update on return...');
          await handleUpdate();
        }
      } catch {
        // ignore
      }
    };

    const onFocus = () => void checkAndAutoApply();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') void checkAndAutoApply();
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [handleUpdate, needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
    // Short cooldown when user dismisses (15 seconds)
    setCooldown(15 * 1000);
  };

  if (!offlineReady && !showReload) return null;

  return (
    <div className="fixed bottom-24 md:bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[100] sm:max-w-md animate-in slide-in-from-bottom-4">
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
                disabled={isUpdating}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Updating...' : 'Reload'}
              </Button>
              <Button
                onClick={hardReload}
                variant="outline"
                size="sm"
                className="flex-1 sm:flex-initial"
                disabled={isUpdating}
              >
                Force Update
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

  // Force update - bypasses cooldown, clears all caches, unregisters SW and reloads
  const forceUpdate = useCallback(async () => {
    console.log('Force update initiated...');

    // Clear cooldown
    try {
      localStorage.removeItem(UPDATE_COOLDOWN_KEY);
    } catch {
      // ignore
    }

    await hardReload();
  }, []);

  return { checkForUpdates, applyUpdate, forceUpdate, isChecking, updateAvailable };
}
