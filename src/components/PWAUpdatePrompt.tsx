import { useEffect, useState, useCallback } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { APP_VERSION } from '@/lib/version';

export function PWAUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isReloading, setIsReloading] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Check for updates every 30 seconds
        setInterval(() => {
          r.update();
        }, 30 * 1000);
        // Check immediately on registration
        r.update();
      }
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Handle update detection
  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
      setCountdown(5);
    }
  }, [needRefresh]);

  // Auto-reload countdown
  useEffect(() => {
    if (!showReload || isReloading) return;

    if (countdown <= 0) {
      handleReload();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showReload, countdown, isReloading]);

  const handleReload = useCallback(() => {
    setIsReloading(true);
    updateServiceWorker(true);
    // Small delay to ensure SW updates before reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [updateServiceWorker]);

  const dismissOfflineReady = () => {
    setOfflineReady(false);
  };

  // Don't render if nothing to show
  if (!offlineReady && !showReload) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] max-w-md mx-auto animate-in slide-in-from-top-4 duration-300">
      {/* Offline Ready Notification */}
      {offlineReady && !showReload && (
        <Alert className="bg-background/95 backdrop-blur border-green-500/50 shadow-lg">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-600">Ready for Offline</AlertTitle>
          <AlertDescription className="mt-2 flex items-center gap-2">
            <span className="flex-1 text-sm">App cached for offline use</span>
            <Button onClick={dismissOfflineReady} variant="outline" size="sm">
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Update Available - Auto-reload with countdown */}
      {showReload && (
        <Alert className="bg-primary/95 text-primary-foreground backdrop-blur border-primary shadow-xl animate-pulse">
          <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
          <AlertTitle className="font-bold">
            {isReloading ? 'Updating...' : 'New Version Available!'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <div className="flex items-center gap-3">
              <span className="flex-1 text-sm">
                {isReloading 
                  ? 'Please wait while we update the app...'
                  : `Auto-updating in ${countdown}s`
                }
              </span>
              {!isReloading && (
                <Button 
                  onClick={handleReload} 
                  variant="secondary" 
                  size="sm"
                  className="font-semibold"
                >
                  Update Now
                </Button>
              )}
            </div>
            <div className="mt-2 text-xs opacity-75">
              Current: v{APP_VERSION}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Export a manual update check function for use elsewhere
export async function checkForUpdates(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
    return true;
  }
  return false;
}
