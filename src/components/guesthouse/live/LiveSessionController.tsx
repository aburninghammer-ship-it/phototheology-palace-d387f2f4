import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Eye, 
  Clock, 
  Users,
  Radio
} from "lucide-react";

interface LiveSessionControllerProps {
  eventId: string;
  currentPhase: number;
  totalPhases: number;
  phaseType: string;
  timeRemaining: number;
  guestCount: number;
  responsesCount: number;
  isPaused: boolean;
  onNextPhase: () => void;
  onPause: () => void;
  onResume: () => void;
  onViewResponses: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  'call_room': 'Call the Room',
  'verse_fracture': 'Verse Fracture',
  'build_study': 'Build the Study',
  'pulse': 'Palace Pulse',
  'co_exegesis': 'Silent Co-Exegesis',
  'drill_drop': 'Drill Drop',
  'reveal_gem': 'Reveal the Gem'
};

export function LiveSessionController({
  eventId,
  currentPhase,
  totalPhases,
  phaseType,
  timeRemaining,
  guestCount,
  responsesCount,
  isPaused,
  onNextPhase,
  onPause,
  onResume,
  onViewResponses
}: LiveSessionControllerProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <Card className="p-4 bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
        <div className="flex items-center gap-6">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-5 h-5 text-red-500" />
              <div className="absolute inset-0 w-5 h-5 rounded-full bg-red-500/30 animate-ping" />
            </div>
            <span className="font-bold text-red-500">LIVE</span>
          </div>

          {/* Phase indicator */}
          <div className="flex flex-col items-center">
            <Badge variant="outline" className="mb-1">
              Phase {currentPhase}/{totalPhases}
            </Badge>
            <span className="text-sm font-medium text-primary">
              {PHASE_LABELS[phaseType] || phaseType}
            </span>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className={`font-mono text-lg ${timeRemaining < 10 ? 'text-red-500' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{guestCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{responsesCount} responses</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewResponses}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            
            {isPaused ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onResume}
              >
                <Play className="w-4 h-4 mr-1" />
                Resume
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onPause}
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </Button>
            )}
            
            <Button
              onClick={onNextPhase}
              className="bg-primary hover:bg-primary/90"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Next Phase
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
