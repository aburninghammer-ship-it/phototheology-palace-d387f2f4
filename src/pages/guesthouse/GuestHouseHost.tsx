import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Calendar, 
  Users, 
  Play, 
  Settings, 
  Trash2, 
  Copy, 
  Clock,
  Zap,
  Sparkles,
  Loader2,
  Gamepad2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { suggestEventFromPrompt, createCustomChallenge } from "@/lib/guesthouseJeeves";

const GAME_TYPES = [
  { id: "custom_challenge", name: "✨ Custom Challenge", icon: "🎨", description: "Describe any challenge - Jeeves creates it!" },
  { id: "call_the_room", name: "Call the Room", icon: "🏠", description: "Assign PT rooms to verses" },
  { id: "verse_fracture", name: "Verse Fracture", icon: "🔧", description: "Rebuild scrambled verses" },
  { id: "build_the_study", name: "Build the Study", icon: "🏗️", description: "Collaborative outline building" },
  { id: "palace_pulse", name: "Palace Pulse", icon: "⚡", description: "Speed room identification" },
  { id: "silent_coexegesis", name: "Silent Co-Exegesis", icon: "🤫", description: "Collaborative silent study" },
  { id: "drill_drop", name: "Drill Drop", icon: "🎯", description: "Random drill challenges" },
  { id: "reveal_the_gem", name: "Reveal the Gem", icon: "💎", description: "Find the hidden insight" },
  { id: "verse_hunt", name: "Verse Hunt", icon: "🔍", description: "Follow clues to find the verse" },
  { id: "symbol_match", name: "Symbol Match", icon: "🎴", description: "Match symbols to meanings" },
  { id: "chain_chess", name: "Chain Chess", icon: "🔗", description: "Link verses by keywords" },
  { id: "prophecy_timeline", name: "Prophecy Timeline", icon: "📅", description: "Arrange prophetic events" }
];

interface GuestHouseEvent {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  status: string;
  max_guests: number;
  host_user_id: string;
  session_type: string;
  game_type: string | null;
  guest_count?: number;
  requires_access_code: boolean;
  access_code: string | null;
}

export default function GuestHouseHost() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<GuestHouseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jeevesPrompt, setJeevesPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_at: "",
    max_guests: 50,
    gameTypes: [] as string[],
    selectedGameType: "call_the_room",
    customChallengeDescription: "",
    requiresAccessCode: false
  });
  const [creatingCustomChallenge, setCreatingCustomChallenge] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to access host controls");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("guesthouse_events")
        .select(`
          *,
          guesthouse_guests(count)
        `)
        .eq("host_user_id", user.id)
        .order("scheduled_at", { ascending: false });

      if (error) throw error;

      const eventsWithCount = (data || []).map(event => ({
        ...event,
        guest_count: event.guesthouse_guests?.[0]?.count || 0
      })) as GuestHouseEvent[];

      setEvents(eventsWithCount);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let gameConfig: Record<string, Json> = {};
      
      // If custom challenge, create the spec first
      if (formData.selectedGameType === "custom_challenge" && formData.customChallengeDescription) {
        setCreatingCustomChallenge(true);
        try {
          const spec = await createCustomChallenge(formData.customChallengeDescription, false);
          if (spec) {
            gameConfig = { customChallengeSpec: spec as unknown as Json };
          }
        } finally {
          setCreatingCustomChallenge(false);
        }
      }

      // Generate access code if required
      let accessCode: string | null = null;
      if (formData.requiresAccessCode) {
        const { data: codeData, error: codeError } = await supabase.rpc('generate_guesthouse_access_code');
        if (codeError) throw codeError;
        accessCode = codeData;
      }

      const { error } = await supabase
        .from("guesthouse_events")
        .insert({
          host_user_id: user.id,
          title: formData.title,
          description: formData.description || null,
          scheduled_at: formData.scheduled_at || new Date().toISOString(),
          max_guests: formData.max_guests,
          status: "scheduled",
          session_type: "live_session",
          game_type: formData.selectedGameType,
          game_config: gameConfig,
          requires_access_code: formData.requiresAccessCode,
          access_code: accessCode
        });

      if (error) throw error;

      if (accessCode) {
        toast.success(`Event created! Access code: ${accessCode}`);
      } else {
        toast.success("Event created!");
      }
      setShowCreateForm(false);
      setFormData({ title: "", description: "", scheduled_at: "", max_guests: 50, gameTypes: [], selectedGameType: "call_the_room", customChallengeDescription: "", requiresAccessCode: false });
      setJeevesPrompt("");
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const updateEventStatus = async (eventId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("guesthouse_events")
        .update({ status })
        .eq("id", eventId);

      if (error) throw error;

      toast.success(`Event ${status === "live" ? "started" : status}!`);
      fetchEvents();

      if (status === "live") {
        navigate(`/guesthouse/host/live/${eventId}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase
        .from("guesthouse_events")
        .delete()
        .eq("id", eventId);

      if (error) throw error;

      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  const copyEventLink = (eventId: string) => {
    const link = `${window.location.origin}/guesthouse/event/${eventId}`;
    navigator.clipboard.writeText(link);
    toast.success("Event link copied!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "scheduled": return "bg-blue-500";
      case "completed": return "bg-muted";
      default: return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GuestHouse Host Controls</h1>
            <p className="text-muted-foreground">Create and manage your Bible study events</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Event
          </Button>
        </div>

        {/* Create Event Form */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Create New Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Jeeves AI Suggestion */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                    <Label className="flex items-center gap-2 text-primary font-medium">
                      <Sparkles className="w-4 h-4" />
                      Ask Jeeves to plan your event
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={jeevesPrompt}
                        onChange={(e) => setJeevesPrompt(e.target.value)}
                        placeholder="e.g., 'A fun youth group event about the sanctuary' or 'Deep dive into Daniel's prophecies for adults'"
                        className="flex-1"
                      />
                      <Button 
                        onClick={async () => {
                          if (!jeevesPrompt.trim()) return;
                          setIsGenerating(true);
                          try {
                            const suggestion = await suggestEventFromPrompt(jeevesPrompt);
                            if (suggestion) {
                              setFormData({
                                ...formData,
                                title: suggestion.title,
                                description: suggestion.description,
                                gameTypes: suggestion.gameTypes || []
                              });
                              toast.success(`Jeeves suggests: "${suggestion.theme}" theme, best for ${suggestion.targetAudience}`);
                            }
                          } finally {
                            setIsGenerating(false);
                          }
                        }}
                        disabled={isGenerating || !jeevesPrompt.trim()}
                        className="gap-2"
                      >
                        {isGenerating ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                        Suggest
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Jeeves will suggest a title, description, and recommended game types based on your input.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Friday Night Bible Study"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_at">Date & Time</Label>
                      <Input
                        id="scheduled_at"
                        type="datetime-local"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What will you be studying tonight?"
                      rows={3}
                    />
                  </div>
                  
                  {formData.gameTypes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Suggested Games</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.gameTypes.map((game) => (
                          <Badge key={game} variant="secondary" className="gap-1">
                            {game.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Pre-selected Game Type */}
                  <div className="space-y-2">
                    <Label htmlFor="game_type" className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4" />
                      Pre-selected Challenge
                    </Label>
                    <Select
                      value={formData.selectedGameType}
                      onValueChange={(value) => setFormData({ ...formData, selectedGameType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a challenge type" />
                      </SelectTrigger>
                      <SelectContent>
                        {GAME_TYPES.map((game) => (
                          <SelectItem key={game.id} value={game.id}>
                            <span className="flex items-center gap-2">
                              <span>{game.icon}</span>
                              <span>{game.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This challenge will auto-launch when the event goes live.
                    </p>
                  </div>

                  {/* Custom Challenge Description */}
                  {formData.selectedGameType === "custom_challenge" && (
                    <div className="space-y-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <Label htmlFor="custom_challenge_desc" className="flex items-center gap-2 text-primary">
                        <Sparkles className="w-4 h-4" />
                        Describe Your Custom Challenge
                      </Label>
                      <Textarea
                        id="custom_challenge_desc"
                        value={formData.customChallengeDescription}
                        onChange={(e) => setFormData({ ...formData, customChallengeDescription: e.target.value })}
                        placeholder="e.g., 'A Chef Challenge where teams race to answer but the best answer wins, not the fastest. Jeeves grades on creativity, theological depth, and use of PT principles.'"
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Jeeves will generate the full challenge specification when you create the event.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_guests">Max Guests</Label>
                      <Input
                        id="max_guests"
                        type="number"
                        value={formData.max_guests}
                        onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                        min={2}
                        max={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        Event locks when capacity is reached.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        🔐 Require Access Code
                      </Label>
                      <div className="flex items-center gap-3 pt-1">
                        <input
                          type="checkbox"
                          id="requiresAccessCode"
                          checked={formData.requiresAccessCode}
                          onChange={(e) => setFormData({ ...formData, requiresAccessCode: e.target.checked })}
                          className="w-5 h-5 rounded border-primary/50"
                        />
                        <label htmlFor="requiresAccessCode" className="text-sm">
                          Invite-only event
                        </label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Guests need a code to join. Code shown after creation.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      setShowCreateForm(false);
                      setJeevesPrompt("");
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={createEvent} 
                      disabled={!formData.title || creatingCustomChallenge || (formData.selectedGameType === "custom_challenge" && !formData.customChallengeDescription)}
                    >
                      {creatingCustomChallenge ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Creating Challenge...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="w-4 h-4" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="live" className="gap-2">
              <Zap className="w-4 h-4" />
              Live
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <Clock className="w-4 h-4" />
              Past
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {events.filter(e => e.status === "scheduled").length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No upcoming events</p>
                <Button variant="link" onClick={() => setShowCreateForm(true)}>
                  Create your first event
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.filter(e => e.status === "scheduled").map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onStart={() => updateEventStatus(event.id, "live")}
                    onDelete={() => deleteEvent(event.id)}
                    onCopyLink={() => copyEventLink(event.id)}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            {events.filter(e => e.status === "live").length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No live events</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.filter(e => e.status === "live").map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onManage={() => navigate(`/guesthouse/host/live/${event.id}`)}
                    onEnd={() => updateEventStatus(event.id, "completed")}
                    onCopyLink={() => copyEventLink(event.id)}
                    getStatusColor={getStatusColor}
                    isLive
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {events.filter(e => e.status === "completed").length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No past events</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {events.filter(e => e.status === "completed").map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={() => deleteEvent(event.id)}
                    getStatusColor={getStatusColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface EventCardProps {
  event: GuestHouseEvent;
  onStart?: () => void;
  onManage?: () => void;
  onEnd?: () => void;
  onDelete?: () => void;
  onCopyLink?: () => void;
  getStatusColor: (status: string) => string;
  isLive?: boolean;
}

function EventCard({ 
  event, 
  onStart, 
  onManage, 
  onEnd, 
  onDelete, 
  onCopyLink,
  getStatusColor,
  isLive 
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={isLive ? "border-green-500/50 bg-green-500/5" : ""}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <Badge className={getStatusColor(event.status)}>
                  {event.status}
                </Badge>
              </div>
              {event.description && (
                <p className="text-muted-foreground">{event.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.scheduled_at).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(event.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.guest_count || 0} / {event.max_guests || "∞"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Event ID:</span>
                  <code className="px-2 py-1 bg-muted rounded font-mono text-xs">
                    {event.id.slice(0, 8)}
                  </code>
                  <Button variant="ghost" size="icon" onClick={onCopyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                {event.requires_access_code && event.access_code && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-amber-500 font-medium">🔐 Access Code:</span>
                    <code className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-mono text-sm font-bold">
                      {event.access_code}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(event.access_code!);
                        toast.success("Access code copied!");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {onStart && (
                <Button onClick={onStart} className="gap-2">
                  <Play className="w-4 h-4" />
                  Go Live
                </Button>
              )}
              {onManage && (
                <Button onClick={onManage} className="gap-2">
                  <Settings className="w-4 h-4" />
                  Manage
                </Button>
              )}
              {onEnd && (
                <Button variant="outline" onClick={onEnd}>
                  End Event
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
