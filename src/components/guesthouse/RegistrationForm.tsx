import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Sparkles, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface RegistrationFormProps {
  eventId: string;
  onComplete: (guestId: string) => void;
  requiresAccessCode?: boolean;
  onAccessCodeValidated?: () => void;
}

export function RegistrationForm({ 
  eventId, 
  onComplete, 
  requiresAccessCode = false,
  onAccessCodeValidated 
}: RegistrationFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [codeValidated, setCodeValidated] = useState(!requiresAccessCode);
  const [validatingCode, setValidatingCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidateCode = async () => {
    if (!accessCode.trim()) {
      toast.error("Please enter the access code");
      return;
    }

    setValidatingCode(true);
    try {
      const { data, error } = await supabase
        .from("guesthouse_events")
        .select("id")
        .eq("id", eventId)
        .eq("access_code", accessCode.trim().toUpperCase())
        .single();

      if (error || !data) {
        toast.error("Invalid access code");
        return;
      }

      setCodeValidated(true);
      onAccessCodeValidated?.();
      toast.success("Access granted!");
    } catch (error) {
      console.error("Code validation error:", error);
      toast.error("Failed to validate code");
    } finally {
      setValidatingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("guesthouse_guests")
        .insert({
          event_id: eventId,
          display_name: displayName.trim(),
          email: email.trim() || null,
        })
        .select("id")
        .single();

      if (error) throw error;

      onComplete(data.id);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show access code input first if required
  if (requiresAccessCode && !codeValidated) {
    return (
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Invite-Only Event</h2>
          <p className="text-muted-foreground">
            Enter the access code to join this event.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accessCode" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Access Code
            </Label>
            <Input
              id="accessCode"
              placeholder="e.g., GH1A2B3C"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="bg-background/50 text-center text-xl tracking-widest uppercase"
              maxLength={10}
            />
          </div>

          <Button 
            onClick={handleValidateCode}
            className="w-full"
            size="lg"
            disabled={validatingCode || !accessCode.trim()}
          >
            {validatingCode ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Enter Event"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ask the host for the access code if you don't have it.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Join This Event</h2>
        <p className="text-muted-foreground">
          No account needed. Just your name.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Your Name *
          </Label>
          <Input
            id="displayName"
            placeholder="What should we call you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-background/50"
            required
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email <span className="text-muted-foreground text-xs">(optional, for reminders)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            "Register for Free"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By registering, you agree to participate respectfully. 
          No account is created—your name is just for the event.
        </p>
      </form>
    </Card>
  );
}
