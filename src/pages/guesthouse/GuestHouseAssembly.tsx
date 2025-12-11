import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { 
  Trophy,
  Sparkles,
  Castle,
  Users,
  ArrowRight,
  Star
} from "lucide-react";
import { GuestReactions } from "@/components/guesthouse/GuestReactions";
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

export default function GuestHouseAssembly() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [guestId, setGuestId] = useState<string | null>(null);
  const [results, setResults] = useState<GroupResult[]>([]);
  const [showConfetti, setShowConfetti] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  useEffect(() => {
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    setGuestId(storedGuestId);
    fetchResults();

    // Progressive reveal animation
    const phases = [0, 1, 2, 3, 4];
    phases.forEach((phase, i) => {
      setTimeout(() => setRevealPhase(phase), i * 1500);
    });

    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  }, [eventId]);

  const fetchResults = async () => {
    const { data } = await supabase
      .from("guesthouse_group_results")
      .select("*")
      .eq("event_id", eventId)
      .order("total_score", { ascending: false });
    
    if (data) {
      setResults(data as GroupResult[]);
    }
  };

  const sortedResults = [...results].sort((a, b) => b.total_score - a.total_score);
  const winner = sortedResults[0];
  const winnerGroup = GROUPS.find(g => g.name === winner?.group_name);

  return (
    <>
      <Helmet>
        <title>Assembly | GuestHouse</title>
      </Helmet>

      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
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

          {/* Winner Announcement */}
          {revealPhase >= 1 && winner && winnerGroup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <Card 
                className="p-8 text-center border-2"
                style={{ borderColor: winnerGroup.color }}
              >
                <Trophy className="w-20 h-20 mx-auto mb-4" style={{ color: winnerGroup.color }} />
                <Badge 
                  className="text-lg px-4 py-1 mb-4"
                  style={{ backgroundColor: winnerGroup.color }}
                >
                  Tonight's Champions
                </Badge>
                <h2 className="text-3xl font-bold capitalize flex items-center justify-center gap-3">
                  <span className="text-4xl">{winnerGroup.emoji}</span>
                  Team {winnerGroup.name}
                  <span className="text-4xl">{winnerGroup.emoji}</span>
                </h2>
                <p className="text-2xl font-bold mt-2" style={{ color: winnerGroup.color }}>
                  {winner.total_score} points
                </p>
              </Card>
            </motion.div>
          )}

          {/* All Teams Results */}
          {revealPhase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                All Teams
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {sortedResults.map((result, index) => {
                  const group = GROUPS.find(g => g.name === result.group_name);
                  if (!group) return null;
                  
                  return (
                    <motion.div
                      key={result.group_name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Card 
                        className="p-4 flex items-center justify-between"
                        style={{ borderColor: `${group.color}40` }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{group.emoji}</span>
                          <div>
                            <p className="font-semibold capitalize" style={{ color: group.color }}>
                              {group.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              #{index + 1} Place
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">{result.total_score}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Master Revelation */}
          {revealPhase >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-accent" />
                  <h3 className="text-xl font-bold">What We Discovered Together</h3>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    Tonight, four teams explored the same Scripture from different angles. 
                    Each team brought unique insights that, together, reveal a fuller picture 
                    of God's truth.
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
        </div>

        {/* Reactions */}
        {guestId && <GuestReactions eventId={eventId!} guestId={guestId} />}
      </div>
    </>
  );
}
