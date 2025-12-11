import { useState } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const DonationBanner = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("donation-banner-dismissed") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: { email: user?.email },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Donation error:", error);
      toast.error("Failed to start donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("donation-banner-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/90 to-primary py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Heart className="h-5 w-5 text-primary-foreground animate-pulse" />
          <p className="text-sm text-primary-foreground font-medium">
            Help us make this app better! Your donation supports continued development.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDonate}
            disabled={isLoading}
            size="sm"
            variant="secondary"
            className="whitespace-nowrap"
          >
            {isLoading ? "Loading..." : "Donate $5"}
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};
