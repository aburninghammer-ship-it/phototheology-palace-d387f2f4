import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { WifiOff, Wifi, HardDrive, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { getPendingSyncs } from "@/services/offlineDataSync";

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Auto-sync when coming back online
        const pending = getPendingSyncs();
        if (pending.length > 0) {
          setSyncing(true);
          setTimeout(() => {
            setSyncing(false);
            setPendingCount(0);
            setTimeout(() => setWasOffline(false), 2000);
          }, 1500);
        } else {
          setTimeout(() => setWasOffline(false), 3000);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    // Check pending syncs periodically
    const checkPending = () => {
      setPendingCount(getPendingSyncs().length);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [wasOffline]);

  if (isOnline && !wasOffline && pendingCount === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slide-up">
      <Alert variant={isOnline ? "default" : "destructive"}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {syncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>Syncing changes...</AlertDescription>
              </>
            ) : isOnline ? (
              <>
                <Wifi className="h-4 w-4" />
                <AlertDescription>
                  Back online!{pendingCount > 0 ? ` Syncing ${pendingCount} changes...` : ' All synced.'}
                </AlertDescription>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You're offline.{pendingCount > 0 ? ` ${pendingCount} pending changes.` : ' App works offline!'}
                </AlertDescription>
              </>
            )}
          </div>
          {!isOnline && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/notes'}
              className="ml-2 flex-shrink-0"
            >
              <HardDrive className="w-3 h-3 mr-1" />
              Notes
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};
