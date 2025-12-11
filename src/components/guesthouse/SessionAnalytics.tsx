import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Users,
  Clock,
  Target,
  TrendingUp,
  Award,
  Star,
  BarChart3,
  Download,
  Share2,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SessionAnalyticsProps {
  eventId: string;
}

interface GuestStats {
  id: string;
  display_name: string;
  score: number;
  rounds_played: number;
  correct_answers: number;
  accuracy: number;
}

interface GameStat {
  prompt_type: string;
  response_count: number;
  avg_score: number;
}

export function SessionAnalytics({ eventId }: SessionAnalyticsProps) {
  const [guestStats, setGuestStats] = useState<GuestStats[]>([]);
  const [gameStats, setGameStats] = useState<GameStat[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [eventId]);

  const fetchAnalytics = async () => {
    try {
      // Fetch guest stats
      const { data: guests } = await supabase
        .from("guesthouse_guests")
        .select("id, display_name, score, rounds_played, correct_answers")
        .eq("event_id", eventId)
        .order("score", { ascending: false });

      if (guests) {
        setGuestStats(guests.map(g => ({
          ...g,
          accuracy: g.rounds_played > 0 
            ? Math.round((g.correct_answers / g.rounds_played) * 100) 
            : 0
        })));
      }

      // Fetch prompts and responses for game stats
      const { data: prompts } = await supabase
        .from("guesthouse_session_prompts")
        .select("id, prompt_type, created_at")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

      if (prompts && prompts.length > 0) {
        // Calculate session duration
        const firstPrompt = new Date(prompts[0].created_at);
        const lastPrompt = new Date(prompts[prompts.length - 1].created_at);
        setSessionDuration(Math.round((lastPrompt.getTime() - firstPrompt.getTime()) / 1000 / 60));

        // Get response counts per game type
        const gameStatsMap: Record<string, { count: number; totalScore: number }> = {};
        
        for (const prompt of prompts) {
          const { count } = await supabase
            .from("guesthouse_responses")
            .select("*", { count: "exact", head: true })
            .eq("prompt_id", prompt.id);

          const { data: responses } = await supabase
            .from("guesthouse_responses")
            .select("points_earned")
            .eq("prompt_id", prompt.id);

          const responseCount = count || 0;
          const totalScore = responses?.reduce((sum, r) => sum + (r.points_earned || 0), 0) || 0;

          if (!gameStatsMap[prompt.prompt_type]) {
            gameStatsMap[prompt.prompt_type] = { count: 0, totalScore: 0 };
          }
          gameStatsMap[prompt.prompt_type].count += responseCount;
          gameStatsMap[prompt.prompt_type].totalScore += totalScore;
        }

        setGameStats(Object.entries(gameStatsMap).map(([type, stats]) => ({
          prompt_type: type,
          response_count: stats.count,
          avg_score: stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0
        })));

        setTotalResponses(Object.values(gameStatsMap).reduce((sum, s) => sum + s.count, 0));
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGameIcon = (type: string) => {
    const icons: Record<string, string> = {
      call_the_room: "🏠",
      verse_fracture: "🔧",
      build_the_study: "🏗️",
      palace_pulse: "⚡",
      silent_coexegesis: "🤫",
      drill_drop: "🎯",
      reveal_the_gem: "💎",
      verse_hunt: "🔍",
    };
    return icons[type] || "🎮";
  };

  const getGameName = (type: string) => {
    const names: Record<string, string> = {
      call_the_room: "Call the Room",
      verse_fracture: "Verse Fracture",
      build_the_study: "Build the Study",
      palace_pulse: "Palace Pulse",
      silent_coexegesis: "Silent Co-Exegesis",
      drill_drop: "Drill Drop",
      reveal_the_gem: "Reveal the Gem",
      verse_hunt: "Verse Hunt",
    };
    return names[type] || type;
  };

  const topScorer = guestStats[0];
  const mostAccurate = [...guestStats].sort((a, b) => b.accuracy - a.accuracy)[0];
  const mostActive = [...guestStats].sort((a, b) => b.rounds_played - a.rounds_played)[0];
  const avgScore = guestStats.length > 0 
    ? Math.round(guestStats.reduce((sum, g) => sum + g.score, 0) / guestStats.length)
    : 0;

  if (loading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{guestStats.length}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalResponses}</p>
              <p className="text-xs text-muted-foreground">Responses</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessionDuration}m</p>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgScore}</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Award Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Session Awards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {topScorer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-lg border border-amber-500/30 text-center"
              >
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-bold">{topScorer.display_name}</p>
                <p className="text-sm text-muted-foreground">Top Scorer</p>
                <Badge className="mt-2 bg-amber-500">{topScorer.score} pts</Badge>
              </motion.div>
            )}

            {mostAccurate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg border border-green-500/30 text-center"
              >
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-bold">{mostAccurate.display_name}</p>
                <p className="text-sm text-muted-foreground">Most Accurate</p>
                <Badge className="mt-2 bg-green-500">{mostAccurate.accuracy}%</Badge>
              </motion.div>
            )}

            {mostActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg border border-blue-500/30 text-center"
              >
                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-bold">{mostActive.display_name}</p>
                <p className="text-sm text-muted-foreground">Most Active</p>
                <Badge className="mt-2 bg-blue-500">{mostActive.rounds_played} rounds</Badge>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="leaderboard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="games">
            <BarChart3 className="w-4 h-4 mr-2" />
            Game Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {guestStats.map((guest, index) => (
                    <motion.div
                      key={guest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? "bg-amber-500 text-white" :
                        index === 1 ? "bg-gray-400 text-white" :
                        index === 2 ? "bg-amber-700 text-white" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-medium">{guest.display_name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{guest.rounds_played} rounds</span>
                          <span>{guest.accuracy}% accuracy</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">{guest.score}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {gameStats.map((game, index) => (
                  <motion.div
                    key={game.prompt_type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-2xl">{getGameIcon(game.prompt_type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{getGameName(game.prompt_type)}</span>
                        <span className="text-sm text-muted-foreground">
                          {game.response_count} responses
                        </span>
                      </div>
                      <Progress 
                        value={(game.response_count / Math.max(...gameStats.map(g => g.response_count))) * 100} 
                        className="h-2"
                      />
                    </div>
                    <Badge variant="outline">
                      Avg: {game.avg_score} pts
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Export Results
        </Button>
        <Button variant="outline" className="flex-1">
          <Share2 className="w-4 h-4 mr-2" />
          Share Summary
        </Button>
      </div>
    </div>
  );
}
