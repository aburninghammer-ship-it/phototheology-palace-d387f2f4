import { useState } from "react";
import { Heart, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const PRESET_AMOUNTS = [5, 50, 500];

export const DonationBanner = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("donation-banner-dismissed") === "true";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(5);
  const [customAmount, setCustomAmount] = useState("");
  const { user } = useAuth();

  const handleDonate = async () => {
    const amount = selectedAmount === "custom" ? Number(customAmount) : selectedAmount;
    
    if (!amount || amount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-donation", {
        body: { email: user?.email, amount },
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
          <p className="text-sm text-primary-foreground font-medium hidden sm:block">
            Help us make this app better!{" "}
            <Link to="/donate" className="underline hover:no-underline">
              Learn more
            </Link>
          </p>
          <p className="text-sm text-primary-foreground font-medium sm:hidden">
            <Link to="/donate" className="underline">Support us!</Link>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="whitespace-nowrap"
              >
                {selectedAmount === "custom" 
                  ? (customAmount ? `$${customAmount}` : "Custom") 
                  : `$${selectedAmount}`}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PRESET_AMOUNTS.map((amount) => (
                <DropdownMenuItem
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className="cursor-pointer"
                >
                  ${amount}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setSelectedAmount("custom")}
                className="cursor-pointer"
              >
                Custom amount
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedAmount === "custom" && (
            <Input
              type="number"
              placeholder="Amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-20 h-8 text-sm"
              min="1"
            />
          )}

          <Button
            onClick={handleDonate}
            disabled={isLoading || (selectedAmount === "custom" && !customAmount)}
            size="sm"
            variant="secondary"
            className="whitespace-nowrap bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            {isLoading ? "..." : "Donate"}
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
