import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Monitor, CheckCircle2, Chrome, Apple } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";

const InstallApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detect Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Download className="h-16 w-16 text-primary" />
                <Smartphone className="h-8 w-8 text-accent absolute -bottom-2 -right-2" />
              </div>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-palace bg-clip-text text-transparent">
              Install Phototheology Palace
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the full app experience! Install PT Palace on your device for offline access, faster loading, and a native app feel.
            </p>
          </div>

          {/* Install Status */}
          {isInstalled && (
            <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
              <CardContent className="flex items-center gap-3 py-6">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">App Already Installed!</p>
                  <p className="text-sm text-muted-foreground">You can access PT Palace from your home screen</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Install Button for Chrome/Edge Android */}
          {!isInstalled && deferredPrompt && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-primary" />
                  Quick Install
                </CardTitle>
                <CardDescription>
                  Install with one click on your Android device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInstallClick}
                  size="lg"
                  className="w-full"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Install PT Palace Now
                </Button>
              </CardContent>
            </Card>
          )}

          {/* iOS Instructions */}
          {isIOS && !isInstalled && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-primary" />
                  Install on iOS
                </CardTitle>
                <CardDescription>
                  Follow these steps to install on your iPhone or iPad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Tap the Share button</p>
                    <p className="text-sm text-muted-foreground">Look for the share icon at the bottom of Safari (square with arrow pointing up)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Select "Add to Home Screen"</p>
                    <p className="text-sm text-muted-foreground">Scroll down in the share menu and tap this option</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Tap "Add"</p>
                    <p className="text-sm text-muted-foreground">The PT Palace icon will appear on your home screen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Android Chrome Instructions */}
          {isAndroid && !deferredPrompt && !isInstalled && (
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-primary" />
                  Install on Android
                </CardTitle>
                <CardDescription>
                  Manual installation steps for Android devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Open the browser menu</p>
                    <p className="text-sm text-muted-foreground">Tap the three dots in the top-right corner</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Select "Install app" or "Add to Home screen"</p>
                    <p className="text-sm text-muted-foreground">The option may vary by browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Confirm installation</p>
                    <p className="text-sm text-muted-foreground">The app will be added to your home screen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Desktop Instructions */}
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                Install on Desktop
              </CardTitle>
              <CardDescription>
                Install PT Palace on your computer (Chrome, Edge, or Brave)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium">Look for the install icon</p>
                  <p className="text-sm text-muted-foreground">Find the install icon (⊕ or computer screen) in the address bar</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium">Click "Install"</p>
                  <p className="text-sm text-muted-foreground">The app will open in a standalone window</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium">Launch from desktop or taskbar</p>
                  <p className="text-sm text-muted-foreground">Access PT Palace like any other desktop app</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Why Install?</CardTitle>
              <CardDescription>
                Benefits of installing the app
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Offline Access</p>
                  <p className="text-sm text-muted-foreground">Study even without internet</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Faster Loading</p>
                  <p className="text-sm text-muted-foreground">Instant access to content</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Full-Screen Experience</p>
                  <p className="text-sm text-muted-foreground">No browser UI distractions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Home Screen Icon</p>
                  <p className="text-sm text-muted-foreground">Quick access like a native app</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default InstallApp;
