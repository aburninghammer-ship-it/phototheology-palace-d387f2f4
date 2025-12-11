import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Chrome, Globe, Apple } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [browserType, setBrowserType] = useState<'chrome' | 'edge' | 'firefox' | 'safari' | 'other'>('other');

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    // If already installed, don't show the button
    if (isStandalone) {
      console.log('App already installed');
      setIsInstallable(false);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('edg/')) {
      setBrowserType('edge');
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      setBrowserType('chrome');
    } else if (userAgent.includes('firefox')) {
      setBrowserType('firefox');
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      setBrowserType('safari');
    }
    
    // Check if mobile (any mobile device)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('PWA Install Button - Device detection:', { 
      isIOSDevice, 
      isMobile, 
      isStandalone,
      browserType,
      userAgent: navigator.userAgent 
    });
    
    // Show on all devices unless already installed - PWAs work on desktop too!
    if (!isStandalone) {
      console.log('Showing install button - app not yet installed');
      setIsInstallable(true);
    }

    // Listen for install prompt event (Android/Desktop Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    console.log('Install button clicked', { isIOS, hasDeferredPrompt: !!deferredPrompt });
    
    // If we have the native prompt (Chrome/Edge desktop & Android), trigger it automatically
    if (deferredPrompt) {
      try {
        console.log('Triggering native browser install prompt');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setDeferredPrompt(null);
          setIsInstallable(false);
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
        // If native prompt fails, show instructions as fallback
        setShowInstructions(true);
      }
      return;
    }

    // Fallback: show manual instructions for browsers that don't support automatic install
    console.log('No native install prompt available, showing manual instructions');
    setShowInstructions(true);
  };

  if (!isInstallable) return null;

  return (
    <>
      <Button
        onClick={handleInstall}
        size="sm"
        className="relative gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex-shrink-0"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install App</span>
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground"
        >
          ✓
        </Badge>
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Install Phototheology App</DialogTitle>
            <DialogDescription>
              Choose your browser below for specific installation instructions
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue={isIOS ? 'safari' : browserType} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chrome" className="flex items-center gap-2">
                <Chrome className="h-4 w-4" />
                <span className="hidden sm:inline">Chrome</span>
              </TabsTrigger>
              <TabsTrigger value="edge" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Edge</span>
              </TabsTrigger>
              <TabsTrigger value="firefox" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Firefox</span>
              </TabsTrigger>
              <TabsTrigger value="safari" className="flex items-center gap-2">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Safari</span>
              </TabsTrigger>
            </TabsList>

            {/* Chrome Instructions */}
            <TabsContent value="chrome" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Chrome className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Google Chrome</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">Click the <strong>install icon</strong> in the address bar</p>
                      <p className="text-muted-foreground text-xs">Look for a small computer/mobile icon or ⊕ plus icon on the right side of the URL</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">Or use the <strong>three-dot menu</strong> (⋮)</p>
                      <p className="text-muted-foreground text-xs">Click the menu → Select "Install Phototheology" or "Install app"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">Confirm installation</p>
                      <p className="text-muted-foreground text-xs">Click "Install" in the popup dialog</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">✨ The app will open in its own window and be accessible from your desktop/home screen!</p>
            </TabsContent>

            {/* Edge Instructions */}
            <TabsContent value="edge" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Microsoft Edge</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">Look for the <strong>app available</strong> icon</p>
                      <p className="text-muted-foreground text-xs">A small ⊕ plus or download icon will appear in the address bar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">Or click the <strong>Settings menu</strong> (⋯)</p>
                      <p className="text-muted-foreground text-xs">Select "Apps" → "Install this site as an app"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">Click <strong>Install</strong></p>
                      <p className="text-muted-foreground text-xs">The app will pin to your taskbar and start menu</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">✨ Edge offers excellent PWA support with desktop integration!</p>
            </TabsContent>

            {/* Firefox Instructions */}
            <TabsContent value="firefox" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Mozilla Firefox</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">Click the <strong>three-line menu</strong> (☰)</p>
                      <p className="text-muted-foreground text-xs">Located in the top-right corner of Firefox</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">Select <strong>"Install"</strong> or <strong>"Install Site as App"</strong></p>
                      <p className="text-muted-foreground text-xs">This option appears for installable web apps</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">Confirm installation</p>
                      <p className="text-muted-foreground text-xs">The app will be added to your applications</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">💡 Note: Firefox mobile on Android supports "Add to Home Screen" from the menu</p>
            </TabsContent>

            {/* Safari Instructions */}
            <TabsContent value="safari" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Apple className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Safari (iOS/Mac)</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">Tap the <strong>Share</strong> button</p>
                      <p className="text-muted-foreground text-xs">On iOS: Square with arrow at bottom. On Mac: Share icon in toolbar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">Scroll and tap <strong>"Add to Home Screen"</strong></p>
                      <p className="text-muted-foreground text-xs">On Mac, select "Add to Dock"</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">Tap <strong>"Add"</strong> in the top-right</p>
                      <p className="text-muted-foreground text-xs">The app icon will appear on your home screen/dock</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">🍎 Works on iPhone, iPad, and Mac with Safari 16+</p>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-center">
              <strong>Benefits:</strong> Offline access • Faster loading • Home screen icon • Native app feel
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
