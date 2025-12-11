import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { 
  Clock, 
  Users,
  Trophy,
  Sparkles
} from "lucide-react";
import { GuestReactions } from "@/components/guesthouse/GuestReactions";
import { ParallelLeaderboard } from "@/components/guesthouse/ParallelLeaderboard";
import { toast } from "sonner";

const GROUPS = [
  { name: "seekers", color: "#3B82F6", emoji: "🔍" },
  { name: "watchers", color: "#10B981", emoji: "👁️" },
  { name: "scribes", color: "#F59E0B", emoji: "📜" },
  { name: "pathfinders", color: "#8B5CF6", emoji: "🧭" }
];

interface GuestHouseEvent {
  id: string;
  title: string;
  status: string;
  duration_minutes: number;
  game_config: Record<string, unknown>;
  session_type: string;
}

export default function GuestHousePlay() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GuestHouseEvent | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [myGroup, setMyGroup] = useState<typeof GROUPS[0] | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [gamePhase, setGamePhase] = useState<"intro" | "playing" | "finished">("intro");

  useEffect(() => {
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    if (!storedGuestId) {
      toast.error("Please register first");
      navigate(`/guesthouse/event/${eventId}`);
      return;
    }
    setGuestId(storedGuestId);
    fetchData(storedGuestId);
  }, [eventId]);

  useEffect(() => {
    if (gamePhase !== "playing" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGamePhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, timeRemaining]);

  const fetchData = async (gId: string) => {
    try {
      const [eventRes, guestRes] = await Promise.all([
        supabase
          .from("guesthouse_events")
          .select("*")
          .eq("id", eventId)
          .single(),
        supabase
          .from("guesthouse_guests")
          .select("*")
          .eq("id", gId)
          .single()
      ]);

      if (eventRes.error) throw eventRes.error;
      const eventData = eventRes.data as GuestHouseEvent;
      setEvent(eventData);
      setTimeRemaining(eventData.duration_minutes * 60);

      if (guestRes.data) {
        setGuestName(guestRes.data.display_name);
        const group = GROUPS.find(g => g.name === guestRes.data.group_name);
        if (group) setMyGroup(group);
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/guesthouse");
    }
  };

  const startGame = () => {
    setGamePhase("playing");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!event || !myGroup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading game...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Playing | {event.title}</title>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background with group color */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-10"
          style={{ backgroundColor: myGroup.color }}
        />

        <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{myGroup.emoji}</span>
              <div>
                <Badge style={{ backgroundColor: myGroup.color }} className="text-white capitalize">
                  Team {myGroup.name}
                </Badge>
                <p className="text-sm text-muted-foreground">{guestName}</p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Game Area */}
          {gamePhase === "intro" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20 text-center">
                <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You're on Team <strong className="capitalize" style={{ color: myGroup.color }}>{myGroup.name}</strong>. 
                  Work together to complete the challenge faster than the other teams!
                </p>
                <Button size="lg" onClick={startGame}>
                  Start Challenge
                </Button>
              </Card>
            </motion.div>
          )}

          {gamePhase === "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Game content placeholder - will integrate with actual game types */}
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
                  <h2 className="text-xl font-bold mb-2">Game in Progress</h2>
                  <p className="text-muted-foreground">
                    Challenge content will appear here based on the game type.
                  </p>
                </div>
              </Card>

              {/* Leaderboard */}
              <ParallelLeaderboard eventId={eventId!} myGroup={myGroup.name} />
            </motion.div>
          )}

          {gamePhase === "finished" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-accent/30 text-center">
                <Trophy className="w-16 h-16 text-accent mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">Time's Up!</h1>
                <p className="text-muted-foreground mb-6">
                  Great work, Team {myGroup.name}! Let's see how everyone did.
                </p>
                <Button 
                  size="lg"
                  onClick={() => navigate(`/guesthouse/assembly/${eventId}`)}
                >
                  Go to Assembly
                </Button>
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
