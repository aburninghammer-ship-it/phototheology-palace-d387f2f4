import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bell, X, Smartphone, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PROMPT_STORAGE_KEY = "phototheology_sms_prompt_shown";
const PROMPT_DELAY_MS = 5000; // Show after 5 seconds

export const SMSOptInPrompt = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"intro" | "phone">("intro");

  useEffect(() => {
    if (!user) return;

    // Check if we've already shown the prompt
    const alreadyShown = localStorage.getItem(PROMPT_STORAGE_KEY);
    if (alreadyShown) return;

    // Check if user already has SMS preferences
    const checkExisting = async () => {
      const { data } = await supabase
        .from("sms_notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        // Already has preferences, don't show prompt
        localStorage.setItem(PROMPT_STORAGE_KEY, "true");
        return;
      }

      // Show prompt after delay
      const timeout = setTimeout(() => {
        setIsOpen(true);
      }, PROMPT_DELAY_MS);

      return () => clearTimeout(timeout);
    };

    checkExisting();
  }, [user]);

  const handleDismiss = () => {
    localStorage.setItem(PROMPT_STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleMaybeLater = () => {
    // Don't permanently dismiss, just close for this session
    setIsOpen(false);
  };

  const handleEnableNotifications = async () => {
    if (!user) return;

    if (step === "intro") {
      setStep("phone");
      return;
    }

    // Validate phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhone = cleanPhone.startsWith("1") ? `+${cleanPhone}` : `+1${cleanPhone}`;

      const { error } = await supabase
        .from("sms_notification_preferences")
        .insert({
          user_id: user.id,
          phone_number: formattedPhone,
          is_enabled: true,
        });

      if (error) throw error;

      localStorage.setItem(PROMPT_STORAGE_KEY, "true");
      toast.success("Daily tips enabled! You'll receive your first message tomorrow.");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error enabling SMS:", error);
      toast.error("Failed to enable notifications. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="secondary">New Feature</Badge>
          </div>
          <DialogTitle className="text-xl">
            {step === "intro" ? "Get Daily Bible Tips via Text" : "Enter Your Phone Number"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === "intro" ? (
              <>
                Receive a daily text with room suggestions, game tips, verses of the day, 
                fascinating Bible facts, and powerful gems — delivered right to your phone!
              </>
            ) : (
              <>
                We'll send you one text per day with Bible study content. You can unsubscribe anytime.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === "intro" ? (
          <div className="grid grid-cols-2 gap-3 py-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm">Room Tips</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm">Daily Gems</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="text-sm">Game Suggestions</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span className="text-sm">Verse of Day</span>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2">
              US numbers only. Standard messaging rates may apply.
            </p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={step === "intro" ? handleDismiss : () => setStep("intro")}
          >
            {step === "intro" ? "No thanks" : "Back"}
          </Button>
          <Button
            variant="outline"
            onClick={handleMaybeLater}
          >
            Maybe later
          </Button>
          <Button
            onClick={handleEnableNotifications}
            disabled={isSubmitting || (step === "phone" && phoneNumber.replace(/\D/g, "").length < 10)}
          >
            {step === "intro" ? "Enable Daily Tips" : isSubmitting ? "Saving..." : "Subscribe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
