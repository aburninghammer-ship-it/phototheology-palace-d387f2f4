import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";
import { 
  Trophy,
  Sparkles,
  Castle,
  Users,
  ArrowRight,
  Star,
  BarChart3
} from "lucide-react";
import { GuestReactions } from "@/components/guesthouse/GuestReactions";
import { SessionAnalytics } from "@/components/guesthouse/SessionAnalytics";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const GROUPS = [
  { name: "seekers", color: "#3B82F6", emoji: "🔍" },
  { name: "watchers", color: "#10B981", emoji: "👁️" },
  { name: "scribes", color: "#F59E0B", emoji: "📜" },
  { name: "pathfinders", color: "#8B5CF6", emoji: "🧭" }
];

interface GroupResult {
  group_name: string;
  discoveries: Record<string, unknown>;
  total_score: number;
}

interface GuestResult {
  id: string;
  display_name: string;
  score: number;
  correct_answers: number;
  rounds_played: number;
}

export default function GuestHouseAssembly() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [guestId, setGuestId] = useState<string | null>(null);
  const [results, setResults] = useState<GroupResult[]>([]);
  const [guestResults, setGuestResults] = useState<GuestResult[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);
  const [activeTab, setActiveTab] = useState("results");

  useEffect(() => {
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    setGuestId(storedGuestId);
    fetchResults();

    const phases = [0, 1, 2, 3, 4];
    phases.forEach((phase, i) => {
      setTimeout(() => setRevealPhase(phase), i * 1500);
    });

    setTimeout(() => setShowConfetti(false), 5000);
  }, [eventId]);

  const fetchResults = async () => {
    // Fetch group results
    const { data: groupData } = await supabase
      .from("guesthouse_group_results")
      .select("*")
      .eq("event_id", eventId)
      .order("total_score", { ascending: false });
    
    if (groupData) {
      setResults(groupData as GroupResult[]);
    }

    // Fetch individual guest results
    const { data: guestData } = await supabase
      .from("guesthouse_guests")
      .select("id, display_name, score, correct_answers, rounds_played")
      .eq("event_id", eventId)
      .order("score", { ascending: false });

    if (guestData) {
      setGuestResults(guestData);
    }
  };

  const sortedResults = [...results].sort((a, b) => b.total_score - a.total_score);
  const winner = sortedResults[0];
  const winnerGroup = GROUPS.find(g => g.name === winner?.group_name);
  const topGuest = guestResults[0];

  return (
    <>
      <Helmet>
        <title>Assembly | GuestHouse</title>
      </Helmet>

      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Sparkles className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                The Assembly
              </span>
            </h1>
            <p className="text-muted-foreground">
              All teams unite. Let's see what we discovered together.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="results" className="gap-2">
                <Trophy className="w-4 h-4" />
                Results
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Full Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="results">
              {/* Top Player */}
              {revealPhase >= 1 && topGuest && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8"
                >
                  <Card className="p-8 text-center border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-amber-600/5">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                    <Badge className="text-lg px-4 py-1 mb-4 bg-amber-500">
                      Tonight's Champion
                    </Badge>
                    <h2 className="text-3xl font-bold">{topGuest.display_name}</h2>
                    <p className="text-2xl font-bold mt-2 text-amber-500">
                      {topGuest.score} points
                    </p>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-muted-foreground">
                      <span>{topGuest.rounds_played} rounds played</span>
                      <span>{topGuest.correct_answers} correct answers</span>
                      <span>
                        {topGuest.rounds_played > 0 
                          ? Math.round((topGuest.correct_answers / topGuest.rounds_played) * 100)
                          : 0}% accuracy
                      </span>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Team Winner (if applicable) */}
              {revealPhase >= 2 && winner && winnerGroup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8"
                >
                  <Card 
                    className="p-6 text-center border-2"
                    style={{ borderColor: winnerGroup.color }}
                  >
                    <Badge 
                      className="text-sm px-3 py-1 mb-3"
                      style={{ backgroundColor: winnerGroup.color }}
                    >
                      Winning Team
                    </Badge>
                    <h2 className="text-2xl font-bold capitalize flex items-center justify-center gap-2">
                      <span className="text-3xl">{winnerGroup.emoji}</span>
                      Team {winnerGroup.name}
                    </h2>
                    <p className="text-xl font-bold mt-1" style={{ color: winnerGroup.color }}>
                      {winner.total_score} points
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* All Participants */}
              {revealPhase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    All Participants
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {guestResults.slice(0, 9).map((guest, index) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? "bg-amber-500 text-white" :
                              index === 1 ? "bg-gray-400 text-white" :
                              index === 2 ? "bg-amber-700 text-white" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-sm">{guest.display_name}</span>
                          </div>
                          <span className="font-bold text-primary">{guest.score}</span>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  {guestResults.length > 9 && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      +{guestResults.length - 9} more participants
                    </p>
                  )}
                </motion.div>
              )}

              {/* Master Revelation */}
              {revealPhase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-accent" />
                      <h3 className="text-xl font-bold">What We Discovered Together</h3>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-muted-foreground">
                        Tonight, we explored Scripture together, each bringing unique insights 
                        that reveal a fuller picture of God's truth.
                      </p>
                      <p className="text-foreground mt-4">
                        <em>"For now we see through a glass, darkly; but then face to face: 
                        now I know in part; but then shall I know even as also I am known."</em>
                        <br />
                        <span className="text-muted-foreground">— 1 Corinthians 13:12</span>
                      </p>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* CTA to Palace */}
              {revealPhase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20 text-center">
                    <Castle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Want to Go Deeper?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      The GuestHouse was just the beginning. The full Phototheology Palace 
                      has eight floors of rooms, tools, and adventures waiting for you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        size="lg"
                        onClick={() => navigate("/pricing")}
                      >
                        Explore the Palace <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/guesthouse")}
                      >
                        Back to GuestHouse
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <SessionAnalytics eventId={eventId!} />
            </TabsContent>
          </Tabs>
        </div>

        {guestId && <GuestReactions eventId={eventId!} guestId={guestId} />}
      </div>
    </>
  );
}
