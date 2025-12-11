import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lamp, DoorOpen, Wheat, BedDouble, Crown, Check } from "lucide-react";

interface CallTheRoomProps {
  onVote: (choice: string) => void;
  votes: Record<string, number>;
  hasVoted: boolean;
  totalVotes: number;
  isHost?: boolean;
}

const ROOM_OPTIONS = [
  { id: 'light', label: 'Light', icon: Lamp, color: 'from-yellow-500/20 to-amber-500/20' },
  { id: 'door', label: 'Door', icon: DoorOpen, color: 'from-blue-500/20 to-cyan-500/20' },
  { id: 'bread', label: 'Bread', icon: Wheat, color: 'from-orange-500/20 to-yellow-500/20' },
  { id: 'rest', label: 'Rest', icon: BedDouble, color: 'from-purple-500/20 to-indigo-500/20' },
  { id: 'crown', label: 'Crown', icon: Crown, color: 'from-amber-500/20 to-yellow-500/20' }
];

export function CallTheRoom({ onVote, votes, hasVoted, totalVotes, isHost }: CallTheRoomProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleVote = (roomId: string) => {
    if (hasVoted) return;
    setSelectedRoom(roomId);
    onVote(roomId);
  };

  const getPercentage = (roomId: string) => {
    if (totalVotes === 0) return 0;
    return Math.round(((votes[roomId] || 0) / totalVotes) * 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Call the Room</h2>
          <p className="text-muted-foreground">
            Choose where the study should begin
          </p>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {ROOM_OPTIONS.map((room) => {
            const Icon = room.icon;
            const percentage = getPercentage(room.id);
            const isSelected = selectedRoom === room.id;
            
            return (
              <motion.button
                key={room.id}
                onClick={() => handleVote(room.id)}
                disabled={hasVoted}
                whileHover={!hasVoted ? { scale: 1.05 } : {}}
                whileTap={!hasVoted ? { scale: 0.95 } : {}}
                className={`
                  relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border/50 hover:border-primary/50'}
                  ${hasVoted && !isSelected ? 'opacity-60' : ''}
                  bg-gradient-to-br ${room.color}
                `}
              >
                <Icon className={`w-10 h-10 mb-3 ${isSelected ? 'text-primary' : 'text-foreground'}`} />
                <span className="font-medium">{room.label}</span>
                
                {/* Vote indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}

                {/* Results overlay for host */}
                {isHost && totalVotes > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2"
                  >
                    <span className="text-sm font-bold text-primary">
                      {percentage}%
                    </span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {hasVoted && !isHost && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6 text-muted-foreground"
          >
            Waiting for others to vote...
          </motion.p>
        )}

        {isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-muted-foreground">
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} received
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
