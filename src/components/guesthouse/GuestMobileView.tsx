import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Clock, 
  Loader2,
  Sparkles,
  Star,
  Bell
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GuestReactions } from "./GuestReactions";
import { GameRound } from "./GameRound";
import { SymbolMatchGame } from "./games/SymbolMatchGame";
import { ChainChessGame } from "./games/ChainChessGame";
import { ProphecyTimelineGame } from "./games/ProphecyTimelineGame";
import { SparkContainer } from "@/components/sparks/SparkContainer";
import { useGuesthouseSparks } from "@/hooks/useGuesthouseSparks";
import type { Json } from "@/integrations/supabase/types";

interface GuestMobileViewProps {
  eventId: string;
  guestId: string;
  guestName: string;
}

interface ActivePrompt {
  id: string;
  prompt_type: string;
  prompt_data: Json;
  is_active: boolean;
}

const GAME_ICONS: Record<string, string> = {
  call_the_room: "🏠",
  verse_fracture: "🔧",
  build_the_study: "🏗️",
  palace_pulse: "⚡",
  silent_coexegesis: "🤫",
  drill_drop: "🎯",
  reveal_the_gem: "💎",
  verse_hunt: "🔍",
};

const GAME_NAMES: Record<string, string> = {
  call_the_room: "Call the Room",
  verse_fracture: "Verse Fracture",
  build_the_study: "Build the Study",
  palace_pulse: "Palace Pulse",
  silent_coexegesis: "Silent Co-Exegesis",
  drill_drop: "Drill Drop",
  reveal_the_gem: "Reveal the Gem",
  verse_hunt: "Verse Hunt",
};

export function GuestMobileView({ eventId, guestId, guestName }: GuestMobileViewProps) {
  const [activePrompt, setActivePrompt] = useState<ActivePrompt | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [myRank, setMyRank] = useState(0);
  const [totalGuests, setTotalGuests] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastPoints, setLastPoints] = useState(0);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  
  // Guesthouse sparks for unauthenticated guests
  const {
    sparks,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark
  } = useGuesthouseSparks({ eventId, guestId, guestName });

  useEffect(() => {
    fetchInitialData();

    // Subscribe to game events
    const channel = supabase
      .channel(`guest-${eventId}`)
      .on('broadcast', { event: 'game_start' }, ({ payload }) => {
        setActivePrompt({
          id: payload.promptId,
          prompt_type: payload.gameType,
          prompt_data: payload.promptData,
          is_active: true
        });
        setHasSubmitted(false);
      })
      .on('broadcast', { event: 'game_end' }, () => {
        setActivePrompt(null);
        setHasSubmitted(false);
      })
      .on('broadcast', { event: 'score_update' }, ({ payload }) => {
        if (payload.guestId === guestId) {
          setMyScore(prev => prev + payload.points);
          setLastPoints(payload.points);
          setShowScoreAnimation(true);
          setTimeout(() => setShowScoreAnimation(false), 2000);
        }
        fetchRanking();
      })
      .on('broadcast', { event: 'bonus_points' }, ({ payload }) => {
        if (payload.guestId === guestId) {
          setMyScore(prev => prev + payload.points);
          setLastPoints(payload.points);
          setShowScoreAnimation(true);
          toast.success(`Bonus: ${payload.reason} (+${payload.points} pts)`);
          setTimeout(() => setShowScoreAnimation(false), 2000);
        }
        fetchRanking();
      })
      .on('broadcast', { event: 'announcement' }, ({ payload }) => {
        setAnnouncement(payload.message);
        toast.info(payload.message, { duration: 5000 });
        setTimeout(() => setAnnouncement(null), 5000);
      })
      .on('broadcast', { event: 'time_extension' }, ({ payload }) => {
        toast.success(`+${payload.seconds} seconds added!`);
      })
      .subscribe();

    // Subscribe to prompt changes via postgres
    const promptChannel = supabase
      .channel(`prompts-guest-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guesthouse_session_prompts', filter: `event_id=eq.${eventId}` },
        () => fetchActivePrompt()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(promptChannel);
    };
  }, [eventId, guestId]);

  const fetchInitialData = async () => {
    await Promise.all([
      fetchMyScore(),
      fetchRanking(),
      fetchActivePrompt()
    ]);
    setLoading(false);
  };

  const fetchMyScore = async () => {
    const { data } = await supabase
      .from("guesthouse_guests")
      .select("score")
      .eq("id", guestId)
      .single();
    
    if (data) setMyScore(data.score || 0);
  };

  const fetchRanking = async () => {
    const { data } = await supabase
      .from("guesthouse_guests")
      .select("id, score")
      .eq("event_id", eventId)
      .order("score", { ascending: false });
    
    if (data) {
      setTotalGuests(data.length);
      const rank = data.findIndex(g => g.id === guestId) + 1;
      setMyRank(rank);
    }
  };

  const fetchActivePrompt = async () => {
    const { data } = await supabase
      .from("guesthouse_session_prompts")
      .select("id, prompt_type, prompt_data, is_active")
      .eq("event_id", eventId)
      .eq("is_active", true)
      .maybeSingle();
    
    if (data) {
      setActivePrompt(data);
      // Check if already submitted
      const { data: response } = await supabase
        .from("guesthouse_responses")
        .select("id")
        .eq("prompt_id", data.id)
        .eq("guest_id", guestId)
        .maybeSingle();
      setHasSubmitted(!!response);
    } else {
      setActivePrompt(null);
    }
  };

  const handleSubmitResponse = async (responseData: any) => {
    if (!activePrompt) return;

    try {
      const { error } = await supabase
        .from("guesthouse_responses")
        .upsert({
          prompt_id: activePrompt.id,
          guest_id: guestId,
          response_data: responseData,
        }, { onConflict: 'prompt_id,guest_id' });

      if (error) throw error;
      
      setHasSubmitted(true);
      toast.success("Response submitted!");
      
      // Generate a spark after successful submission
      generateSpark({
        promptType: activePrompt.prompt_type,
        promptData: activePrompt.prompt_data,
        response: responseData
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {guestName[0]?.toUpperCase()}
            </div>
            <span className="font-medium text-sm">{guestName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sparks for guests */}
            {sparks.length > 0 && (
              <SparkContainer
                sparks={sparks}
                onOpen={openSpark}
                onSave={saveSpark}
                onDismiss={dismissSpark}
                onExplore={exploreSpark}
                position="floating"
              />
            )}
            
            {/* Score Display */}
            <div className="relative">
              <Badge variant="outline" className="gap-1">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="font-bold">{myScore}</span>
              </Badge>
              
              {/* Score Animation */}
              <AnimatePresence>
                {showScoreAnimation && (
                  <motion.div
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-green-500 font-bold text-sm"
                  >
                    +{lastPoints}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rank Display */}
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
              <Trophy className="w-3 h-3 mr-1" />
              #{myRank}/{totalGuests}
            </Badge>
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-16 left-4 right-4 z-50"
          >
            <Card className="p-3 bg-primary text-primary-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">{announcement}</span>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activePrompt ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Render specialized game components for new game types */}
              {activePrompt.prompt_type === "symbol_match" && (activePrompt.prompt_data as any)?.symbols ? (
                <SymbolMatchGame
                  symbols={(activePrompt.prompt_data as any).symbols}
                  timeLimit={(activePrompt.prompt_data as any).timeLimit || 120}
                  onComplete={async (score, timeTaken) => {
                    await handleSubmitResponse({ score, timeTaken, gameType: "symbol_match" });
                  }}
                />
              ) : activePrompt.prompt_type === "chain_chess" && (activePrompt.prompt_data as any)?.chain ? (
                <ChainChessGame
                  startingVerse={(activePrompt.prompt_data as any).startingVerse}
                  chain={(activePrompt.prompt_data as any).chain}
                  timeLimit={(activePrompt.prompt_data as any).timeLimit || 180}
                  onComplete={async (score, linksFound, timeTaken) => {
                    await handleSubmitResponse({ score, linksFound, timeTaken, gameType: "chain_chess" });
                  }}
                />
              ) : activePrompt.prompt_type === "prophecy_timeline" && (activePrompt.prompt_data as any)?.events ? (
                <ProphecyTimelineGame
                  events={(activePrompt.prompt_data as any).events}
                  timeLimit={(activePrompt.prompt_data as any).timeLimit || 150}
                  onComplete={async (score, correctOrder, timeTaken) => {
                    await handleSubmitResponse({ score, correctOrder, timeTaken, gameType: "prophecy_timeline" });
                  }}
                />
              ) : (
                <GameRound
                  promptId={activePrompt.id}
                  promptType={activePrompt.prompt_type}
                  promptData={activePrompt.prompt_data}
                  timeLimit={90}
                  onSubmit={handleSubmitResponse}
                  isSubmitted={hasSubmitted}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-12 text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity 
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              
              <h2 className="text-xl font-bold mb-2">Waiting for Host</h2>
              <p className="text-muted-foreground mb-6">
                The next challenge will appear here
              </p>

              {/* Quick Stats */}
              <Card className="p-4 bg-muted/50 w-full max-w-sm">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{myScore}</div>
                    <div className="text-xs text-muted-foreground">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">#{myRank}</div>
                    <div className="text-xs text-muted-foreground">Rank</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalGuests}</div>
                    <div className="text-xs text-muted-foreground">Guests</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Reactions Bar */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-xl border-t p-2">
        <GuestReactions eventId={eventId} guestId={guestId} />
      </div>
    </div>
  );
}
