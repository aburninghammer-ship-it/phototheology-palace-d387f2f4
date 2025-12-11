import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Send, BookOpen } from "lucide-react";

interface SilentCoExegesisProps {
  prompt: string;
  verse: string;
  verseReference: string;
  timeRemaining: number;
  onSubmit: (response: string) => void;
  hasSubmitted: boolean;
  isHost?: boolean;
  synthesizedParagraph?: string;
}

export function SilentCoExegesis({
  prompt,
  verse,
  verseReference,
  timeRemaining,
  onSubmit,
  hasSubmitted,
  isHost,
  synthesizedParagraph
}: SilentCoExegesisProps) {
  const [response, setResponse] = useState("");

  const handleSubmit = () => {
    if (response.trim().length > 0) {
      onSubmit(response.trim());
    }
  };

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  // Host view - shows synthesized paragraph
  if (isHost && synthesizedParagraph) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
          <div className="text-center mb-8">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold">The Room Speaks</h2>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">— {verseReference}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-primary/5 border border-primary/20"
          >
            <p className="text-lg leading-relaxed italic">
              "{synthesizedParagraph}"
            </p>
          </motion.div>
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
          <h2 className="text-2xl font-bold mb-2">Silent Co-Exegesis</h2>
          <p className="text-muted-foreground">One minute of shared discovery</p>
        </div>

        {/* Verse */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-lg italic leading-relaxed">"{verse}"</p>
          <p className="text-sm text-muted-foreground mt-2">— {verseReference}</p>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 15 ? 'bg-red-500/20 text-red-500' : 'bg-muted'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{timeRemaining}s</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-primary">{prompt}</p>
          <p className="text-sm text-muted-foreground mt-1">Max 12 words</p>
        </div>

        {!hasSubmitted ? (
          <>
            <Input
              value={response}
              onChange={(e) => {
                const words = e.target.value.split(/\s+/).filter(Boolean);
                if (words.length <= 12) {
                  setResponse(e.target.value);
                }
              }}
              placeholder="Complete the sentence..."
              className="mb-4 text-lg"
            />
            <div className="flex justify-between items-center">
              <span className={`text-sm ${wordCount > 10 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                {wordCount}/12 words
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
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">Your voice has been heard</p>
            <p className="text-muted-foreground">Waiting for synthesis...</p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
