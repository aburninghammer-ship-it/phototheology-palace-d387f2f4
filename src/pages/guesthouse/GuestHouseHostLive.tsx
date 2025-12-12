import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Clock,
  Zap,
  Sparkles,
  Loader2,
  BarChart3,
  Gamepad2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PresenceIndicators } from "@/components/guesthouse/PresenceIndicators";
import { Leaderboard } from "@/components/guesthouse/Leaderboard";
import { HostGameControls } from "@/components/guesthouse/HostGameControls";
import { SessionAnalytics } from "@/components/guesthouse/SessionAnalytics";
import { generateGamePrompt, generateSymbolMatch, generateChainChess, generateProphecyTimeline, createCustomChallenge } from "@/lib/guesthouseJeeves";
import { useGuesthouseScoring } from "@/hooks/useGuesthouseScoring";
import type { Json } from "@/integrations/supabase/types";

const GAME_TYPES = [
  { id: "custom_challenge", name: "✨ Custom Challenge", icon: "🎨", description: "Describe any challenge - Jeeves creates it!", category: "custom" },
  { id: "call_the_room", name: "Call the Room", icon: "🏠", description: "Assign PT rooms to verses", category: "core" },
  { id: "verse_fracture", name: "Verse Fracture", icon: "🔧", description: "Rebuild scrambled verses", category: "core" },
  { id: "build_the_study", name: "Build the Study", icon: "🏗️", description: "Collaborative outline building", category: "core" },
  { id: "palace_pulse", name: "Palace Pulse", icon: "⚡", description: "Speed room identification", category: "core" },
  { id: "silent_coexegesis", name: "Silent Co-Exegesis", icon: "🤫", description: "Collaborative silent study", category: "core" },
  { id: "drill_drop", name: "Drill Drop", icon: "🎯", description: "Random drill challenges", category: "core" },
  { id: "reveal_the_gem", name: "Reveal the Gem", icon: "💎", description: "Find the hidden insight", category: "core" },
  { id: "verse_hunt", name: "Verse Hunt", icon: "🔍", description: "Follow clues to find the verse", category: "hunt" },
  { id: "symbol_match", name: "Symbol Match", icon: "🎴", description: "Match symbols to meanings", category: "match" },
  { id: "chain_chess", name: "Chain Chess", icon: "🔗", description: "Link verses by keywords", category: "chain" },
  { id: "prophecy_timeline", name: "Prophecy Timeline", icon: "📅", description: "Arrange prophetic events", category: "timeline" }
];

interface Guest {
  id: string;
  display_name: string;
  is_checked_in: boolean;
  score?: number;
  rounds_played?: number;
  correct_answers?: number;
}

interface SessionPrompt {
  id: string;
  prompt_type: string;
  prompt_data: Json;
  is_active: boolean;
  created_at: string;
}

export default function GuestHouseHostLive() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [prompts, setPrompts] = useState<SessionPrompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<SessionPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [customVerse, setCustomVerse] = useState("John 3:16");
  const [customChallengeDescription, setCustomChallengeDescription] = useState("");
  const [showCustomChallengeInput, setShowCustomChallengeInput] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState("games");

  const { leaderboard, awardBonusPoints } = useGuesthouseScoring(eventId || "");

  useEffect(() => {
    if (!eventId) return;
    fetchEventData();
    const interval = setInterval(() => {
      if (!isPaused) setSessionTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [eventId, isPaused]);

  useEffect(() => {
    if (!eventId) return;

    const guestChannel = supabase
      .channel(`guests-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guesthouse_guests', filter: `event_id=eq.${eventId}` },
        () => fetchGuests()
      )
      .subscribe();

    const promptChannel = supabase
      .channel(`prompts-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guesthouse_session_prompts', filter: `event_id=eq.${eventId}` },
        () => fetchPrompts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(guestChannel);
      supabase.removeChannel(promptChannel);
    };
  }, [eventId]);

  const fetchEventData = async () => {
    try {
      await Promise.all([fetchEvent(), fetchGuests(), fetchPrompts()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from("guesthouse_events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) throw error;
    setEvent(data);
  };

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guesthouse_guests")
      .select("id, display_name, is_checked_in, score, rounds_played, correct_answers")
      .eq("event_id", eventId)
      .order("score", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      return;
    }
    setGuests(data || []);
  };

  const fetchResponseCount = async () => {
    if (!activePrompt) return;
    const { count } = await supabase
      .from("guesthouse_responses")
      .select("*", { count: "exact", head: true })
      .eq("prompt_id", activePrompt.id);
    setResponseCount(count || 0);
  };

  useEffect(() => {
    if (activePrompt) {
      fetchResponseCount();
      const interval = setInterval(fetchResponseCount, 3000);
      return () => clearInterval(interval);
    }
  }, [activePrompt]);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from("guesthouse_session_prompts")
      .select("id, prompt_type, prompt_data, is_active, created_at")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching prompts:", error);
      return;
    }
    setPrompts(data || []);
    const active = data?.find((p) => p.is_active);
    setActivePrompt(active || null);
  };

  const launchGame = async (gameType: string) => {
    try {
      setGeneratingPrompt(true);
      
      await supabase
        .from("guesthouse_session_prompts")
        .update({ is_active: false })
        .eq("event_id", eventId);

      let promptData: any = { 
        started_at: new Date().toISOString(),
        verse: customVerse || "John 3:16"
      };

      // Generate game-specific data
      if (gameType === "custom_challenge") {
        if (!customChallengeDescription.trim()) {
          toast.error("Please describe your custom challenge first");
          setGeneratingPrompt(false);
          return;
        }
        const spec = await createCustomChallenge(customChallengeDescription, false);
        if (spec) {
          promptData = { ...promptData, ...spec, isCustomChallenge: true };
        } else {
          toast.error("Failed to create custom challenge");
          setGeneratingPrompt(false);
          return;
        }
      } else if (gameType === "symbol_match") {
        const data = await generateSymbolMatch("medium");
        if (data) promptData = { ...promptData, ...data };
      } else if (gameType === "chain_chess") {
        const data = await generateChainChess(customVerse, "medium");
        if (data) promptData = { ...promptData, ...data };
      } else if (gameType === "prophecy_timeline") {
        const data = await generateProphecyTimeline("medium");
        if (data) promptData = { ...promptData, ...data };
      } else {
        const aiPrompt = await generateGamePrompt(gameType, customVerse || "John 3:16", "medium");
        if (aiPrompt) promptData = { ...promptData, ...aiPrompt };
      }

      const maxOrder = prompts.length > 0 ? Math.max(...prompts.map(p => (p as any).sequence_order || 0)) : 0;

      const { data, error } = await supabase
        .from("guesthouse_session_prompts")
        .insert({
          event_id: eventId,
          prompt_type: gameType,
          prompt_data: promptData,
          is_active: true,
          sequence_order: maxOrder + 1
        })
        .select("id, prompt_type, prompt_data, is_active, created_at")
        .single();

      if (error) throw error;

      setActivePrompt(data);
      setGeneratingPrompt(false);
      toast.success(`${GAME_TYPES.find(g => g.id === gameType)?.name} launched!`);
      
      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'game_start',
        payload: { promptId: data.id, gameType, promptData }
      });

      fetchPrompts();
    } catch (error) {
      console.error("Error launching game:", error);
      toast.error("Failed to launch game");
      setGeneratingPrompt(false);
    }
  };

  const endCurrentGame = async () => {
    if (!activePrompt) return;

    try {
      await supabase
        .from("guesthouse_session_prompts")
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq("id", activePrompt.id);

      setActivePrompt(null);
      toast.success("Game ended");

      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'game_end',
        payload: { promptId: activePrompt.id }
      });

      fetchPrompts();
    } catch (error) {
      console.error("Error ending game:", error);
      toast.error("Failed to end game");
    }
  };

  const handlePause = async () => {
    setIsPaused(true);
    await supabase.channel(`event-${eventId}`).send({
      type: 'broadcast',
      event: 'session_pause',
      payload: {}
    });
  };

  const handleResume = async () => {
    setIsPaused(false);
    await supabase.channel(`event-${eventId}`).send({
      type: 'broadcast',
      event: 'session_resume',
      payload: {}
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge className={isPaused ? "bg-amber-500" : "bg-green-500 animate-pulse"}>
              {isPaused ? "PAUSED" : "LIVE"}
            </Badge>
            <h1 className="text-xl font-bold">{event?.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(sessionTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-bold">{guests.length}</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (confirm("End this event?")) {
                  supabase
                    .from("guesthouse_events")
                    .update({ status: "completed" })
                    .eq("id", eventId)
                    .then(() => navigate("/guesthouse/host"));
                }
              }}
            >
              End Event
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="games" className="gap-2">
              <Gamepad2 className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="controls" className="gap-2">
              <Zap className="w-4 h-4" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 space-y-4">
                {/* Active Game Panel */}
                <Card className={activePrompt ? "border-green-500/50 bg-green-500/5" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Current Activity
                      </span>
                      {activePrompt && (
                        <Button variant="outline" size="sm" onClick={endCurrentGame}>
                          End Game
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {generatingPrompt ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <h3 className="text-xl font-bold mb-2">Jeeves is crafting your challenge...</h3>
                        <p className="text-muted-foreground">Preparing AI-powered Bible study prompt</p>
                      </div>
                    ) : activePrompt ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">
                            {GAME_TYPES.find(g => g.id === activePrompt.prompt_type)?.icon}
                          </span>
                          <div>
                            <h3 className="text-2xl font-bold">
                              {GAME_TYPES.find(g => g.id === activePrompt.prompt_type)?.name}
                            </h3>
                            <p className="text-muted-foreground">
                              {GAME_TYPES.find(g => g.id === activePrompt.prompt_type)?.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {responseCount} / {guests.length} responses
                          </span>
                          <Progress value={(responseCount / Math.max(guests.length, 1)) * 100} className="w-48 h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <div className="flex-1">
                            <label className="text-sm font-medium">Study Verse</label>
                            <Input
                              value={customVerse}
                              onChange={(e) => setCustomVerse(e.target.value)}
                              placeholder="John 3:16"
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Custom Challenge - Featured */}
                          <div className="p-4 rounded-lg border-2 border-primary/50 bg-primary/5">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">🎨</span>
                              <div>
                                <h4 className="font-semibold text-primary">Custom Challenge</h4>
                                <p className="text-xs text-muted-foreground">Describe any challenge - Jeeves creates it!</p>
                              </div>
                            </div>
                            {showCustomChallengeInput ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={customChallengeDescription}
                                  onChange={(e) => setCustomChallengeDescription(e.target.value)}
                                  placeholder="Describe your challenge... e.g., 'Teams race to find the most Christ-centered connection in Leviticus. Best answer wins, not fastest. Grade on creativity and theological depth.'"
                                  rows={3}
                                  className="resize-none"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    className="flex-1 gap-2"
                                    onClick={() => launchGame("custom_challenge")}
                                    disabled={generatingPrompt || !customChallengeDescription.trim()}
                                  >
                                    {generatingPrompt ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Sparkles className="w-4 h-4" />
                                    )}
                                    Create & Launch
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => setShowCustomChallengeInput(false)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                className="w-full gap-2"
                                onClick={() => setShowCustomChallengeInput(true)}
                              >
                                <Sparkles className="w-4 h-4" />
                                Create Custom Challenge
                              </Button>
                            )}
                          </div>

                          <p className="text-muted-foreground text-center text-sm">Or select a preset game:</p>
                          
                          {/* Core Games */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Core Games</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {GAME_TYPES.filter(g => g.category === "core").map((game) => (
                                <Button
                                  key={game.id}
                                  variant="outline"
                                  className="h-auto py-3 flex flex-col items-center gap-1"
                                  onClick={() => launchGame(game.id)}
                                  disabled={generatingPrompt}
                                >
                                  <span className="text-xl">{game.icon}</span>
                                  <span className="text-xs font-medium">{game.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Special Games */}
                          <div>
                            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Special Games</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {GAME_TYPES.filter(g => g.category !== "core" && g.category !== "custom").map((game) => (
                                <Button
                                  key={game.id}
                                  variant="outline"
                                  className="h-auto py-3 flex flex-col items-center gap-1 border-primary/30"
                                  onClick={() => launchGame(game.id)}
                                  disabled={generatingPrompt}
                                >
                                  <span className="text-xl">{game.icon}</span>
                                  <span className="text-xs font-medium">{game.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Game History */}
                <Card>
                  <CardHeader>
                    <CardTitle>Session History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      {prompts.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No games played yet</p>
                      ) : (
                        <div className="space-y-2">
                          {prompts.map((prompt) => (
                            <div 
                              key={prompt.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xl">
                                  {GAME_TYPES.find(g => g.id === prompt.prompt_type)?.icon}
                                </span>
                                <span className="font-medium">
                                  {GAME_TYPES.find(g => g.id === prompt.prompt_type)?.name}
                                </span>
                                {prompt.is_active && <Badge className="bg-green-500">Active</Badge>}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(prompt.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 space-y-4">
                <PresenceIndicators eventId={eventId!} guestCount={guests.length} />
                <Leaderboard 
                  guests={leaderboard.length > 0 ? leaderboard : guests.map(g => ({
                    id: g.id,
                    display_name: g.display_name,
                    score: g.score || 0,
                    rounds_played: g.rounds_played || 0,
                    correct_answers: g.correct_answers || 0
                  }))} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Controls Tab */}
          <TabsContent value="controls">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <HostGameControls
                  eventId={eventId!}
                  activePromptId={activePrompt?.id}
                  guests={guests.map(g => ({
                    id: g.id,
                    display_name: g.display_name,
                    score: g.score || 0
                  }))}
                  isPaused={isPaused}
                  onPause={handlePause}
                  onResume={handleResume}
                  onEndGame={endCurrentGame}
                  onAwardPoints={(guestId, points, reason) => {
                    awardBonusPoints(guestId, points, reason);
                  }}
                />
              </div>
              <div className="col-span-4 space-y-4">
                <PresenceIndicators eventId={eventId!} guestCount={guests.length} />
                <Leaderboard 
                  guests={leaderboard.length > 0 ? leaderboard : guests.map(g => ({
                    id: g.id,
                    display_name: g.display_name,
                    score: g.score || 0,
                    rounds_played: g.rounds_played || 0,
                    correct_answers: g.correct_answers || 0
                  }))} 
                />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SessionAnalytics eventId={eventId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
