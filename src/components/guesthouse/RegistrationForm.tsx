import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { User, Mail, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RegistrationFormProps {
  eventId: string;
  onComplete: (guestId: string) => void;
}

export function RegistrationForm({ eventId, onComplete }: RegistrationFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
