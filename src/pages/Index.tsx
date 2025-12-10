import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { 
  Download,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { StreamlinedTestimonials } from "@/components/StreamlinedTestimonials";
import { FinalCTA } from "@/components/FinalCTA";
import { PunchyHero } from "@/components/PunchyHero";
import { ExplainerVideo } from "@/components/ExplainerVideo";
import { InteractiveWalkthrough } from "@/components/InteractiveWalkthrough";
import { TransparencySection } from "@/components/TransparencySection";
import { ExitIntentPopup } from "@/components/retention/ExitIntentPopup";
import { SessionTracker } from "@/components/analytics/SessionTracker";
import { FourPathsShowcase } from "@/components/FourPathsShowcase";
import { MobileStickyCtaBar } from "@/components/MobileStickyCtaBar";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    const bannerDismissed = localStorage.getItem('installBannerDismissed');
    
    if (!isStandalone && !bannerDismissed) {
      setShowInstallBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="The Phototheology Digital Bible"
        description="Master Bible study through the 8-floor Palace method. Store Scripture as images, patterns, and structures with Christ-centered interpretation."
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      <SessionTracker />
      <ExitIntentPopup />
      
      {/* Install App Banner */}
      {showInstallBanner && (
        <div className="sticky top-16 z-40 bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Download className="w-5 h-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm">📱 Get the App!</p>
                  <p className="text-xs opacity-90">Install for offline access</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PWAInstallButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismissBanner}
                  className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero - The 10-second hook */}
      <PunchyHero />

      {/* 2. Explainer Video */}
      <ExplainerVideo />

      {/* 3. Interactive Demo - Try it yourself */}
      <InteractiveWalkthrough />

      {/* 4. Four Paths - What you can do */}
      <FourPathsShowcase />

      {/* 5. Transparency - Pricing + FAQ */}
      <TransparencySection />

      {/* 6. Social Proof */}
      <StreamlinedTestimonials />

      {/* 7. Final CTA */}
      <FinalCTA />

      <Footer />
      
      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCtaBar />
    </div>
  );
};

export default Index;
