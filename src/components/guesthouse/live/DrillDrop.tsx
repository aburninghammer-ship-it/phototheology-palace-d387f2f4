import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Send, Zap, Clock } from "lucide-react";

interface DrillDropProps {
  currentPromptIndex: number;
  timeRemaining: number;
  onSubmit: (promptIndex: number, response: string) => void;
  submittedPrompts: number[];
  isHost?: boolean;
  insights?: Array<{ promptIndex: number; text: string }>;
}

const DRILL_PROMPTS = [
  "What stands out most?",
  "Where else does Scripture echo this?",
  "What does this demand of me?"
];

export function DrillDrop({
  currentPromptIndex,
  timeRemaining,
  onSubmit,
  submittedPrompts,
  isHost,
  insights = []
}: DrillDropProps) {
  const [response, setResponse] = useState("");
  const totalTime = 30;
  const progress = (timeRemaining / totalTime) * 100;

  const handleSubmit = () => {
    if (response.trim().length > 0) {
      onSubmit(currentPromptIndex, response.trim());
      setResponse("");
    }
  };

  const hasSubmittedCurrent = submittedPrompts.includes(currentPromptIndex);

  // Host view
  if (isHost) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
          <div className="text-center mb-6">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Drill Drop Complete</h2>
            <p className="text-muted-foreground">Sharpest insights from the room</p>
          </div>

          <div className="space-y-6">
            {DRILL_PROMPTS.map((prompt, index) => {
              const promptInsights = insights.filter(i => i.promptIndex === index);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30"
                >
                  <p className="font-medium text-primary mb-2">{prompt}</p>
                  {promptInsights.length > 0 ? (
                    <p className="text-muted-foreground">{promptInsights[0].text}</p>
                  ) : (
                    <p className="text-muted-foreground/50 italic">No insights yet</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    );
  }

  // Guest view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Drill Drop</h2>
          </div>
          <p className="text-muted-foreground">90-second rapid drill</p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {DRILL_PROMPTS.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index < currentPromptIndex
                  ? 'bg-primary'
                  : index === currentPromptIndex
                  ? 'bg-primary/50 animate-pulse'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Timer bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Prompt {currentPromptIndex + 1}/3
            </span>
            <div className={`flex items-center gap-1 ${timeRemaining < 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeRemaining}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromptIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Current prompt */}
            <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
              <p className="text-xl font-bold text-primary">
                {DRILL_PROMPTS[currentPromptIndex]}
              </p>
            </div>

            {!hasSubmittedCurrent ? (
              <>
                <Textarea
                  value={response}
                  onChange={(e) => setResponse(e.target.value.slice(0, 200))}
                  placeholder="Your quick insight..."
                  className="min-h-[80px] mb-4 resize-none"
                  maxLength={200}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {response.length}/200
                  </span>
                  <Button onClick={handleSubmit} disabled={response.trim().length === 0}>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4 bg-muted/50 rounded-lg"
              >
                <p className="text-muted-foreground">
                  ✓ Submitted! Waiting for next prompt...
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
