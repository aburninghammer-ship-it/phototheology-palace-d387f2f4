import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Clock, Eye, Repeat, Footprints, Box, Timer, Heart } from "lucide-react";

interface VerseFractureProps {
  verse: string;
  verseReference: string;
  assignedAngle: 'repeated' | 'movement' | 'objects' | 'time' | 'tone';
  timeRemaining: number;
  onSubmit: (observation: string) => void;
  hasSubmitted: boolean;
  isHost?: boolean;
  submissions?: Array<{ angle: string; text: string }>;
}

const ANGLE_CONFIG = {
  repeated: {
    label: 'Repeated Words',
    description: 'Identify words or phrases that repeat',
    icon: Repeat,
    color: 'text-blue-500'
  },
  movement: {
    label: 'Movement & Action',
    description: 'Identify any movement or action',
    icon: Footprints,
    color: 'text-green-500'
  },
  objects: {
    label: 'Objects & Images',
    description: 'Identify objects or visual images',
    icon: Box,
    color: 'text-purple-500'
  },
  time: {
    label: 'Time & Sequence',
    description: 'Identify time or sequence language',
    icon: Timer,
    color: 'text-orange-500'
  },
  tone: {
    label: 'Emotion & Tone',
    description: 'Identify emotional weight or tone',
    icon: Heart,
    color: 'text-pink-500'
  }
};

export function VerseFracture({
  verse,
  verseReference,
  assignedAngle,
  timeRemaining,
  onSubmit,
  hasSubmitted,
  isHost,
  submissions = []
}: VerseFractureProps) {
  const [observation, setObservation] = useState("");
  const angleConfig = ANGLE_CONFIG[assignedAngle];
  const Icon = angleConfig.icon;

  const handleSubmit = () => {
    if (observation.trim().length > 0) {
      onSubmit(observation.trim());
    }
  };

  // Guest view
  if (!isHost) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
          {/* Verse display */}
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-lg italic leading-relaxed">"{verse}"</p>
            <p className="text-sm text-muted-foreground mt-2">— {verseReference}</p>
          </div>

          {/* Assigned angle */}
          <div className="mb-6 text-center">
            <Badge variant="outline" className={`text-lg px-4 py-2 ${angleConfig.color}`}>
              <Icon className="w-5 h-5 mr-2" />
              {angleConfig.label}
            </Badge>
            <p className="text-muted-foreground mt-2">{angleConfig.description}</p>
          </div>

          {/* Timer */}
          <div className="flex justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 15 ? 'bg-red-500/20 text-red-500' : 'bg-muted'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg">{timeRemaining}s</span>
            </div>
          </div>

          {!hasSubmitted ? (
            <>
              <Textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value.slice(0, 150))}
                placeholder="One sentence only..."
                className="min-h-[80px] mb-4 resize-none"
                maxLength={150}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {observation.length}/150 characters
                </span>
                <Button onClick={handleSubmit} disabled={observation.trim().length === 0}>
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
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium">Observation submitted!</p>
              <p className="text-muted-foreground">Waiting for others...</p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Host view - shows synthesized submissions
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-lg italic leading-relaxed">"{verse}"</p>
          <p className="text-sm text-muted-foreground mt-2">— {verseReference}</p>
        </div>

        <h3 className="text-xl font-bold mb-4">Synthesized Observations</h3>
        
        <div className="space-y-3">
          {Object.entries(ANGLE_CONFIG).map(([key, config]) => {
            const angleSubmissions = submissions.filter(s => s.angle === key);
            const AngleIcon = config.icon;
            
            return (
              <div key={key} className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <AngleIcon className={`w-4 h-4 ${config.color}`} />
                  <span className="font-medium">{config.label}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {angleSubmissions.length}
                  </Badge>
                </div>
                {angleSubmissions.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {angleSubmissions[0]?.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
