import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Eye, 
  Puzzle, 
  Zap, 
  BookOpen, 
  Target, 
  Gem,
  Play,
  Check,
  Clock
} from "lucide-react";

export interface SessionPhase {
  id: string;
  type: 'opening' | 'call_room' | 'verse_fracture' | 'build_study' | 'pulse' | 'co_exegesis' | 'drill_drop' | 'reveal_gem';
  name: string;
  duration: number; // in minutes
  description: string;
  status: 'pending' | 'active' | 'completed';
  startedAt?: Date;
  endedAt?: Date;
}

const PHASE_CONFIG: Record<SessionPhase['type'], { icon: typeof Users; color: string }> = {
  opening: { icon: Users, color: 'text-blue-500' },
  call_room: { icon: Users, color: 'text-purple-500' },
  verse_fracture: { icon: Eye, color: 'text-green-500' },
  build_study: { icon: Puzzle, color: 'text-orange-500' },
  pulse: { icon: Zap, color: 'text-yellow-500' },
  co_exegesis: { icon: BookOpen, color: 'text-cyan-500' },
  drill_drop: { icon: Target, color: 'text-red-500' },
  reveal_gem: { icon: Gem, color: 'text-pink-500' }
};

const DEFAULT_PHASES: SessionPhase[] = [
  { id: '1', type: 'opening', name: 'Opening & Orientation', duration: 5, description: 'Welcome and set expectations', status: 'pending' },
  { id: '2', type: 'call_room', name: 'Call the Room', duration: 5, description: 'Collective direction setting', status: 'pending' },
  { id: '3', type: 'verse_fracture', name: 'Verse Fracture', duration: 8, description: 'Distributed observation', status: 'pending' },
  { id: '4', type: 'build_study', name: 'Build the Study', duration: 7, description: 'Card assembly patterns', status: 'pending' },
  { id: '5', type: 'pulse', name: 'Palace Pulse', duration: 10, description: 'Directional discernment', status: 'pending' },
  { id: '6', type: 'co_exegesis', name: 'Silent Co-Exegesis', duration: 10, description: 'Deep, reverent reflection', status: 'pending' },
  { id: '7', type: 'drill_drop', name: 'Drill Drop', duration: 10, description: 'High-intensity focus', status: 'pending' },
  { id: '8', type: 'reveal_gem', name: 'Reveal the Gem', duration: 5, description: 'Climactic close', status: 'pending' }
];

interface SessionFlowTimelineProps {
  phases?: SessionPhase[];
  currentPhaseId?: string;
  onPhaseStart?: (phaseId: string) => void;
  onPhaseEnd?: (phaseId: string) => void;
  isHost?: boolean;
  totalTimeElapsed?: number;
}

export function SessionFlowTimeline({
  phases = DEFAULT_PHASES,
  currentPhaseId,
  onPhaseStart,
  onPhaseEnd,
  isHost = false,
  totalTimeElapsed = 0
}: SessionFlowTimelineProps) {
  const currentIndex = phases.findIndex(p => p.id === currentPhaseId);
  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const progress = (completedPhases / phases.length) * 100;

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Session Flow</h3>
          <p className="text-sm text-muted-foreground">
            {completedPhases}/{phases.length} phases complete
          </p>
        </div>
        <Badge variant="outline" className="font-mono">
          <Clock className="w-3 h-3 mr-1" />
          {Math.floor(totalTimeElapsed / 60)}:{(totalTimeElapsed % 60).toString().padStart(2, '0')}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Phase list */}
      <div className="space-y-2">
        {phases.map((phase, index) => {
          const config = PHASE_CONFIG[phase.type];
          const Icon = config.icon;
          const isActive = phase.id === currentPhaseId;
          const isCompleted = phase.status === 'completed';
          const isPending = phase.status === 'pending';

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-4 p-3 rounded-lg transition-all
                ${isActive ? 'bg-primary/10 border border-primary/30' : ''}
                ${isCompleted ? 'bg-muted/30 opacity-60' : ''}
                ${isPending ? 'hover:bg-muted/30' : ''}
              `}
            >
              {/* Status indicator */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isActive ? 'bg-primary text-primary-foreground' : ''}
                ${isCompleted ? 'bg-green-500/20 text-green-500' : ''}
                ${isPending ? 'bg-muted' : ''}
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : isActive ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              {/* Phase info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  <span className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                    {phase.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {phase.description}
                </p>
              </div>

              {/* Duration / Timer */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-mono text-muted-foreground">
                  {phase.duration} min
                </p>
              </div>

              {/* Host controls */}
              {isHost && isPending && !currentPhaseId && index === 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPhaseStart?.(phase.id)}
                >
                  Start
                </Button>
              )}
              {isHost && isActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onPhaseEnd?.(phase.id)}
                >
                  End
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

export { DEFAULT_PHASES };
