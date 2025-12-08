import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle, Info } from 'lucide-react';
import { APP_VERSION, BUILD_DATE } from '@/lib/version';
import { checkForUpdates } from '@/components/PWAUpdatePrompt';
import { toast } from 'sonner';

export function AppVersionCard() {
  const [checking, setChecking] = useState(false);

  const handleCheckUpdates = async () => {
    setChecking(true);
    try {
      const hasServiceWorker = await checkForUpdates();
      if (hasServiceWorker) {
        toast.success('Checked for updates. If a new version is available, you\'ll see a prompt shortly.');
      } else {
        toast.info('Service worker not available. Try refreshing the page.');
      }
    } catch (error) {
      toast.error('Failed to check for updates');
    } finally {
      setTimeout(() => setChecking(false), 2000);
    }
  };

  const handleForceRefresh = () => {
    // Clear caches and reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    window.location.reload();
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          App Version
        </CardTitle>
        <CardDescription>Check for updates and app information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="secondary" className="font-mono">
                v{APP_VERSION}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {BUILD_DATE}
            </p>
          </div>
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleCheckUpdates} 
            variant="outline" 
            className="w-full"
            disabled={checking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
            {checking ? 'Checking...' : 'Check for Updates'}
          </Button>
          
          <Button 
            onClick={handleForceRefresh} 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground"
          >
            Force Refresh (Clear Cache)
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Updates are automatically applied when available
        </p>
      </CardContent>
    </Card>
  );
}
