import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Sparkles, Clock, Heart, User, Check } from "lucide-react";

interface PalacePulseProps {
  question: string;
  timeRemaining: number;
  onVote: (choice: string) => void;
  hasVoted: boolean;
  results?: Record<string, number>;
  totalVotes: number;
  isHost?: boolean;
}

const PULSE_OPTIONS = [
  { id: 'history', label: 'Past / History', icon: History, color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'experience', label: 'Present / Experience', icon: Sparkles, color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'fulfillment', label: 'Future / Fulfillment', icon: Clock, color: 'from-purple-500/20 to-pink-500/20' },
  { id: 'character', label: "God's Character", icon: Heart, color: 'from-red-500/20 to-rose-500/20' },
  { id: 'response', label: 'Human Response', icon: User, color: 'from-green-500/20 to-emerald-500/20' }
];

export function PalacePulse({
  question,
  timeRemaining,
  onVote,
  hasVoted,
  results = {},
  totalVotes,
  isHost
}: PalacePulseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    onVote(optionId);
  };

  const getPercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((results[optionId] || 0) / totalVotes) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Palace Pulse</h2>
          <p className="text-lg text-muted-foreground">{question}</p>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 5 ? 'bg-red-500/20 text-red-500' : 'bg-muted'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg">{timeRemaining}s</span>
          </div>
        </div>

        <div className="space-y-3">
          {PULSE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            const percentage = getPercentage(option.id);
            
            return (
              <motion.button
                key={option.id}
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
                whileHover={!hasVoted ? { scale: 1.02 } : {}}
                whileTap={!hasVoted ? { scale: 0.98 } : {}}
                className={`
                  relative w-full flex items-center p-4 rounded-xl border-2 transition-all overflow-hidden
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-primary/50'}
                  ${hasVoted && !isSelected ? 'opacity-60' : ''}
                  bg-gradient-to-r ${option.color}
                `}
              >
                {/* Progress bar for results */}
                {(isHost || hasVoted) && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-y-0 left-0 bg-primary/20"
                  />
                )}
                
                <Icon className={`w-6 h-6 mr-4 z-10 ${isSelected ? 'text-primary' : ''}`} />
                <span className="font-medium z-10">{option.label}</span>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
                
                {(isHost || hasVoted) && (
                  <span className="ml-auto font-bold text-primary z-10">
                    {percentage}%
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <Badge variant="outline" className="text-lg px-4 py-2">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} received
            </Badge>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
