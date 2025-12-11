import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Play, 
  MessageSquare,
  Trophy,
  Clock,
  Zap,
  SkipForward,
  Sparkles,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PresenceIndicators } from "@/components/guesthouse/PresenceIndicators";
import { generateGamePrompt } from "@/lib/guesthouseJeeves";
import type { Json } from "@/integrations/supabase/types";

const GAME_TYPES = [
  { id: "call_the_room", name: "Call the Room", icon: "🏠", description: "Assign PT rooms to verses" },
  { id: "verse_fracture", name: "Verse Fracture", icon: "🔧", description: "Rebuild scrambled verses" },
  { id: "build_the_study", name: "Build the Study", icon: "🏗️", description: "Collaborative outline building" },
  { id: "palace_pulse", name: "Palace Pulse", icon: "⚡", description: "Speed room identification" },
  { id: "silent_coexegesis", name: "Silent Co-Exegesis", icon: "🤫", description: "Collaborative silent study" },
  { id: "drill_drop", name: "Drill Drop", icon: "🎯", description: "Random drill challenges" },
  { id: "reveal_the_gem", name: "Reveal the Gem", icon: "💎", description: "Find the hidden insight" }
];

interface Guest {
  id: string;
  display_name: string;
  is_checked_in: boolean;
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

  useEffect(() => {
    if (!eventId) return;
    fetchEventData();
    const interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    // Subscribe to guest changes
    const guestChannel = supabase
      .channel(`guests-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guesthouse_guests', filter: `event_id=eq.${eventId}` },
        () => fetchGuests()
      )
      .subscribe();

    // Subscribe to prompt changes
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
      .select("id, display_name, is_checked_in")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guests:", error);
      return;
    }
    setGuests(data || []);
  };

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
      
      // Deactivate any existing prompts
      await supabase
        .from("guesthouse_session_prompts")
        .update({ is_active: false })
        .eq("event_id", eventId);

      // Generate AI prompt for the game
      const aiPrompt = await generateGamePrompt(gameType, customVerse || "John 3:16", "medium");
      
      // Get max sequence order
      const maxOrder = prompts.length > 0 ? Math.max(...prompts.map(p => (p as any).sequence_order || 0)) : 0;

      // Create new prompt with AI-generated content
      const { data, error } = await supabase
        .from("guesthouse_session_prompts")
        .insert({
          event_id: eventId,
          prompt_type: gameType,
          prompt_data: { 
            started_at: new Date().toISOString(),
            verse: customVerse || "John 3:16",
            ...aiPrompt
          },
          is_active: true,
          sequence_order: maxOrder + 1
        })
        .select("id, prompt_type, prompt_data, is_active, created_at")
        .single();

      if (error) throw error;

      setActivePrompt(data);
      setGeneratingPrompt(false);
      toast.success(`${GAME_TYPES.find(g => g.id === gameType)?.name} launched!`);
      
      // Broadcast to all guests
      await supabase.channel(`event-${eventId}`).send({
        type: 'broadcast',
        event: 'game_start',
        payload: { promptId: data.id, gameType, promptData: aiPrompt }
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

      // Broadcast to all guests
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
            <Badge className="bg-green-500 animate-pulse">LIVE</Badge>
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

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-4">
        {/* Left: Game Controls */}
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
                  <Progress value={65} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {guests.filter(g => g.is_checked_in).length} / {guests.length} guests checked in
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Verse Input */}
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
                  
                  <p className="text-muted-foreground text-center">Select a game to launch:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {GAME_TYPES.map((game) => (
                      <Button
                        key={game.id}
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center gap-2"
                        onClick={() => launchGame(game.id)}
                        disabled={generatingPrompt}
                      >
                        <span className="text-2xl">{game.icon}</span>
                        <span className="text-sm font-medium">{game.name}</span>
                      </Button>
                    ))}
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

        {/* Right: Guests & Leaderboard */}
        <div className="col-span-4 space-y-4">
          <PresenceIndicators eventId={eventId!} guestCount={guests.length} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Guests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {guests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Waiting for guests to join...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {guests.map((guest, index) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? "bg-yellow-500 text-yellow-950" :
                            index === 1 ? "bg-gray-300 text-gray-700" :
                            index === 2 ? "bg-amber-600 text-amber-50" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{guest.display_name}</span>
                        </div>
                        <Badge variant={guest.is_checked_in ? "default" : "outline"}>
                          {guest.is_checked_in ? "Ready" : "Joining"}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Announcement
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Trophy className="w-4 h-4" />
                Award Bonus Points
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <SkipForward className="w-4 h-4" />
                Skip to Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
