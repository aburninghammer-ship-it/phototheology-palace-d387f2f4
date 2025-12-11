import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PresenceIndicatorsProps {
  eventId: string;
  guestCount: number;
}

export function PresenceIndicators({ eventId, guestCount }: PresenceIndicatorsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-4 bg-card/80 backdrop-blur-xl border-border/50 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{guestCount}</span>
              <span className="text-muted-foreground">guests waiting</span>
            </div>
          </div>

          {/* Animated avatars */}
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(5, guestCount) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-background flex items-center justify-center"
              >
                <span className="text-xs font-medium text-primary">
                  {String.fromCharCode(65 + i)}
                </span>
              </motion.div>
            ))}
            {guestCount > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  +{guestCount - 5}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
