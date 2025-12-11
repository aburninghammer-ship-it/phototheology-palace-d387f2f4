import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

const GROUPS = [
  { name: "seekers", color: "#3B82F6", emoji: "🔍" },
  { name: "watchers", color: "#10B981", emoji: "👁️" },
  { name: "scribes", color: "#F59E0B", emoji: "📜" },
  { name: "pathfinders", color: "#8B5CF6", emoji: "🧭" }
];

interface ParallelLeaderboardProps {
  eventId: string;
  myGroup: string;
}

interface GroupScore {
  group_name: string;
  total_score: number;
}

export function ParallelLeaderboard({ eventId, myGroup }: ParallelLeaderboardProps) {
  const [scores, setScores] = useState<GroupScore[]>([]);

  useEffect(() => {
    fetchScores();
    
    const channel = supabase
      .channel(`leaderboard:${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guesthouse_group_results", filter: `event_id=eq.${eventId}` },
        () => fetchScores()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const fetchScores = async () => {
    const { data } = await supabase
      .from("guesthouse_group_results")
      .select("group_name, total_score")
      .eq("event_id", eventId);
    
    if (data) {
      setScores(data);
    }
  };

  const getGroupScore = (groupName: string) => {
    return scores.find(s => s.group_name === groupName)?.total_score || 0;
  };

  const sortedGroups = [...GROUPS].sort((a, b) => getGroupScore(b.name) - getGroupScore(a.name));

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-xl border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Team Leaderboard</h3>
      </div>

      <div className="space-y-2">
        {sortedGroups.map((group, index) => {
          const score = getGroupScore(group.name);
          const isMyGroup = group.name === myGroup;
          const maxScore = Math.max(...sortedGroups.map(g => getGroupScore(g.name)), 1);
          const percentage = (score / maxScore) * 100;

          return (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-lg p-3 ${isMyGroup ? "ring-2 ring-primary" : ""}`}
              style={{ backgroundColor: `${group.color}10` }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.emoji}</span>
                  <span 
                    className="font-medium capitalize"
                    style={{ color: group.color }}
                  >
                    {group.name}
                  </span>
                  {isMyGroup && (
                    <span className="text-xs text-muted-foreground">(You)</span>
                  )}
                </div>
                <span className="font-bold">{score}</span>
              </div>

              {/* Progress bar */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg opacity-20"
                style={{ backgroundColor: group.color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
