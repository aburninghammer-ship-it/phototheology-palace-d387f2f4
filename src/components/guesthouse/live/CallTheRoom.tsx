import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Sparkles, Loader2 } from "lucide-react";
import { generateGamePrompt, gradePlayerResponse } from "@/lib/guesthouseJeeves";

interface CallTheRoomProps {
  onVote: (choice: string, score?: number) => void;
  votes: Record<string, number>;
  hasVoted: boolean;
  totalVotes: number;
  isHost?: boolean;
  verse?: string;
  promptData?: GamePromptData | null;
}

interface GamePromptData {
  promptText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  timeLimit: number;
  points: number;
}

export function CallTheRoom({ 
  onVote, 
  votes, 
  hasVoted, 
  totalVotes, 
  isHost,
  verse,
  promptData: externalPromptData
}: CallTheRoomProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [promptData, setPromptData] = useState<GamePromptData | null>(externalPromptData || null);
  const [loading, setLoading] = useState(!externalPromptData);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    if (!externalPromptData && !promptData) {
      loadPrompt();
    }
  }, [externalPromptData]);

  useEffect(() => {
    if (externalPromptData) {
      setPromptData(externalPromptData);
      setLoading(false);
      setTimeLeft(externalPromptData.timeLimit || 60);
    }
  }, [externalPromptData]);

  useEffect(() => {
    if (timeLeft > 0 && !hasVoted && !loading) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, hasVoted, loading]);

  const loadPrompt = async () => {
    setLoading(true);
    const prompt = await generateGamePrompt("call_the_room", verse, "medium");
    if (prompt) {
      setPromptData(prompt as GamePromptData);
      setTimeLeft(prompt.timeLimit || 60);
    }
    setLoading(false);
  };

  const handleVote = async (roomId: string) => {
    if (hasVoted || !promptData) return;
    setSelectedRoom(roomId);
    setGrading(true);

    // Grade the response
    const result = await gradePlayerResponse(
      "call_the_room",
      roomId,
      promptData.correctAnswer,
      promptData as unknown as Record<string, unknown>
    );

    const score = result?.score || (roomId === promptData.correctAnswer ? 100 : 0);
    onVote(roomId, score);
    setGrading(false);
  };

  const getPercentage = (roomId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((votes[roomId] || 0) / totalVotes) * 100);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-12 bg-card/80 backdrop-blur-xl border-border/50 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-bold mb-2">Preparing Challenge...</h2>
          <p className="text-muted-foreground">Jeeves is crafting your question</p>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Call the Room
            </h2>
          </div>
          <Badge variant="outline" className={`text-lg px-3 py-1 ${timeLeft <= 10 ? 'text-destructive border-destructive animate-pulse' : ''}`}>
            <Clock className="w-4 h-4 mr-1" />
            {timeLeft}s
          </Badge>
        </div>

        {/* Question */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-lg leading-relaxed">{promptData?.promptText}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {promptData?.options?.map((option, index) => {
            const isSelected = selectedRoom === option;
            const isCorrect = hasVoted && option === promptData.correctAnswer;
            const isWrong = hasVoted && isSelected && option !== promptData.correctAnswer;
            
            return (
              <motion.button
                key={index}
                onClick={() => handleVote(option)}
                disabled={hasVoted || grading}
                whileHover={!hasVoted ? { scale: 1.02 } : {}}
                whileTap={!hasVoted ? { scale: 0.98 } : {}}
                className={`
                  relative p-4 rounded-xl border-2 transition-all text-left
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-primary/50'}
                  ${isCorrect ? 'border-green-500 bg-green-500/10' : ''}
                  ${isWrong ? 'border-destructive bg-destructive/10' : ''}
                  ${hasVoted && !isSelected && !isCorrect ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                </div>
                
                {isSelected && !hasVoted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}

                {isHost && hasVoted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 right-2"
                  >
                    <span className="text-sm font-bold text-primary">
                      {getPercentage(option)}%
                    </span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Status */}
        {grading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Grading your answer...</p>
          </motion.div>
        )}

        {hasVoted && !grading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {selectedRoom === promptData?.correctAnswer ? (
              <p className="text-green-500 font-bold">Correct! 🎉</p>
            ) : (
              <p className="text-muted-foreground">
                Correct answer: <strong>{promptData?.correctAnswer}</strong>
              </p>
            )}
            {promptData?.explanation && (
              <p className="text-sm text-muted-foreground mt-2">
                {promptData.explanation}
              </p>
            )}
          </motion.div>
        )}

        {!hasVoted && !grading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground"
          >
            Select the Palace room that best fits this verse
          </motion.p>
        )}

        {isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 pt-4 border-t border-border/50 text-center"
          >
            <p className="text-sm text-muted-foreground">
              {totalVotes} response{totalVotes !== 1 ? 's' : ''} received
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
