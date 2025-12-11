import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Medal, Award, Flame, Star } from "lucide-react";

interface GuestScore {
  id: string;
  display_name: string;
  score: number;
  rounds_played: number;
  correct_answers: number;
}

interface LeaderboardProps {
  guests: GuestScore[];
  currentGuestId?: string;
  compact?: boolean;
}

export function Leaderboard({ guests, currentGuestId, compact = false }: LeaderboardProps) {
  const sortedGuests = [...guests].sort((a, b) => (b.score || 0) - (a.score || 0));
  const topScore = sortedGuests[0]?.score || 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30";
      case 2:
        return "bg-gradient-to-r from-gray-400/20 to-gray-300/10 border-gray-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30";
      default:
        return "bg-muted/30";
    }
  };

  if (compact) {
    return (
      <div className="space-y-1">
        {sortedGuests.slice(0, 5).map((guest, index) => (
          <div
            key={guest.id}
            className={`flex items-center justify-between p-2 rounded-lg ${
              guest.id === currentGuestId ? "bg-primary/10 border border-primary/30" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              {getRankIcon(index + 1)}
              <span className="font-medium text-sm truncate max-w-[100px]">
                {guest.display_name}
              </span>
            </div>
            <span className="font-bold text-primary">{guest.score || 0}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <AnimatePresence mode="popLayout">
            {sortedGuests.map((guest, index) => {
              const rank = index + 1;
              const isCurrentUser = guest.id === currentGuestId;
              const scorePercent = topScore > 0 ? ((guest.score || 0) / topScore) * 100 : 0;

              return (
                <motion.div
                  key={guest.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`relative p-3 border-b last:border-b-0 ${
                    isCurrentUser ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Score bar background */}
                  <div
                    className={`absolute inset-0 opacity-30 ${getRankBg(rank)}`}
                    style={{ width: `${Math.max(scorePercent, 10)}%` }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        rank <= 3 ? getRankBg(rank) : "bg-muted"
                      }`}>
                        {getRankIcon(rank)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${isCurrentUser ? "text-primary" : ""}`}>
                            {guest.display_name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3" />
                            {guest.rounds_played || 0} rounds
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {guest.correct_answers || 0} correct
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <motion.span
                        key={guest.score}
                        initial={{ scale: 1.5, color: "hsl(var(--primary))" }}
                        animate={{ scale: 1, color: "inherit" }}
                        className="text-2xl font-bold"
                      >
                        {guest.score || 0}
                      </motion.span>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
