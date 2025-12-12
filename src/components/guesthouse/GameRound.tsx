import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

interface GameRoundProps {
  promptId: string;
  promptType: string;
  promptData: Json;
  timeLimit?: number; // seconds
  onSubmit: (response: any) => Promise<void>;
  onTimeUp?: () => void;
  isSubmitted?: boolean;
}

const GAME_ICONS: Record<string, string> = {
  custom_challenge: "🎨",
  call_the_room: "🏠",
  verse_fracture: "🔧",
  build_the_study: "🏗️",
  palace_pulse: "⚡",
  silent_coexegesis: "🤫",
  drill_drop: "🎯",
  reveal_the_gem: "💎",
  verse_hunt: "🔍",
  symbol_match: "🎴",
  chain_chess: "🔗",
  prophecy_timeline: "📅",
};

const GAME_NAMES: Record<string, string> = {
  custom_challenge: "Custom Challenge",
  call_the_room: "Call the Room",
  verse_fracture: "Verse Fracture",
  build_the_study: "Build the Study",
  palace_pulse: "Palace Pulse",
  silent_coexegesis: "Silent Co-Exegesis",
  drill_drop: "Drill Drop",
  reveal_the_gem: "Reveal the Gem",
  verse_hunt: "Verse Hunt",
  symbol_match: "Symbol Match",
  chain_chess: "Chain Chess",
  prophecy_timeline: "Prophecy Timeline",
};

export function GameRound({
  promptId,
  promptType,
  promptData,
  timeLimit = 90,
  onSubmit,
  onTimeUp,
  isSubmitted = false,
}: GameRoundProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [response, setResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(isSubmitted);

  const data = promptData as Record<string, any>;

  useEffect(() => {
    if (submitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, onTimeUp]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        text: response,
        submittedAt: new Date().toISOString(),
        timeUsed: timeLimit - timeRemaining,
      });
      setSubmitted(true);
      toast.success("Response submitted!");
    } catch (error) {
      toast.error("Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const timePercent = (timeRemaining / timeLimit) * 100;
  const isLowTime = timeRemaining <= 15;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{GAME_ICONS[promptType] || "🎮"}</span>
            {GAME_NAMES[promptType] || promptType}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isLowTime ? "destructive" : "secondary"}>
              <Clock className={`w-3 h-3 mr-1 ${isLowTime ? "animate-pulse" : ""}`} />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
        </div>
        <Progress
          value={timePercent}
          className={`h-1 ${isLowTime ? "bg-destructive/20" : ""}`}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI Generated Challenge */}
        <AnimatePresence mode="wait">
          {data.challenge && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20"
            >
              <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                <span className="text-sm font-medium text-primary">AI Challenge</span>
              </div>
              <p className="text-foreground leading-relaxed">{data.challenge}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scripture Reference */}
        {data.verse && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              Scripture
            </div>
            <p className="font-serif text-lg">{data.verse}</p>
          </div>
        )}

        {/* Instructions */}
        {data.instructions && (
          <div className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> {data.instructions}
          </div>
        )}

        {/* Response Area */}
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="text-xl font-bold text-green-600">Submitted!</h3>
            <p className="text-muted-foreground">
              Waiting for other guests to finish...
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <Textarea
              placeholder="Type your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={timeRemaining === 0}
            />
            <Button
              onClick={handleSubmit}
              disabled={submitting || timeRemaining === 0 || !response.trim()}
              className="w-full"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Response
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
