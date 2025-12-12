import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { 
  Castle, 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft,
  Video,
  Gamepad2,
  Zap
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { RegistrationForm } from "@/components/guesthouse/RegistrationForm";
import { toast } from "sonner";

interface GuestHouseEvent {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  max_guests: number;
  status: string;
  session_type: string;
  youtube_url: string | null;
  game_type: string | null;
  requires_access_code: boolean;
  access_code: string | null;
}

export default function GuestHouseEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GuestHouseEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchGuestCount();
      checkExistingRegistration();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("guesthouse_events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setEvent(data as GuestHouseEvent);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Event not found");
      navigate("/guesthouse");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestCount = async () => {
    const { count } = await supabase
      .from("guesthouse_guests")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);
    
    setGuestCount(count || 0);
  };

  const checkExistingRegistration = () => {
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    if (storedGuestId) {
      setIsRegistered(true);
      setGuestId(storedGuestId);
    }
  };

  const handleRegistrationComplete = (newGuestId: string) => {
    localStorage.setItem(`guesthouse_guest_${eventId}`, newGuestId);
    setIsRegistered(true);
    setGuestId(newGuestId);
    setGuestCount(prev => prev + 1);
    toast.success("You're registered! See you soon.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading event...</div>
      </div>
    );
  }

  if (!event) return null;

  const eventDate = new Date(event.scheduled_at);
  const isLive = event.session_type === "live_session";
  const isFull = guestCount >= event.max_guests;
  const spotsLeft = event.max_guests - guestCount;

  return (
    <>
      <Helmet>
        <title>{event.title} | GuestHouse</title>
        <meta name="description" content={event.description || "Join this free Scripture adventure!"} />
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description || "Join this free Scripture adventure!"} />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/guesthouse")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to GuestHouse
          </Button>

          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20 mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant={isLive ? "secondary" : "default"} className="flex items-center gap-1">
                  {isLive ? (
                    <><Video className="w-3 h-3" /> Live Session</>
                  ) : (
                    <><Gamepad2 className="w-3 h-3" /> Game Night</>
                  )}
                </Badge>
                
                {event.status === "live" && (
                  <Badge className="bg-destructive animate-pulse">
                    <Zap className="w-3 h-3 mr-1" /> LIVE NOW
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>

              {event.description && (
                <p className="text-lg text-muted-foreground mb-6">
                  {event.description}
                </p>
              )}

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{format(eventDate, "EEEE, MMM d")}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{format(eventDate, "h:mm a")} ({event.duration_minutes} min)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Spots</p>
                    <p className="font-medium">
                      {spotsLeft > 0 ? `${spotsLeft} of ${event.max_guests} left` : "Full"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Registration or Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {isRegistered ? (
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-green-500/30 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Castle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-green-500">You're Registered!</h2>
                <p className="text-muted-foreground mb-6">
                  Come back {formatDistanceToNow(eventDate, { addSuffix: true })} to join the event.
                </p>
                
                {event.status === "live" || (eventDate.getTime() - Date.now() < 1000 * 60 * 5) ? (
                  <Button 
                    size="lg"
                    onClick={() => navigate(`/guesthouse/lobby/${eventId}`)}
                  >
                    Enter Lobby
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    The lobby will open 5 minutes before the event starts.
                  </p>
                )}
              </Card>
            ) : isFull ? (
              <Card className="p-8 bg-card/80 backdrop-blur-xl border-destructive/30 text-center">
                <h2 className="text-xl font-bold mb-2 text-destructive">Event Full</h2>
                <p className="text-muted-foreground">
                  This event has reached capacity. Check back for future events!
                </p>
              </Card>
            ) : (
              <RegistrationForm 
                eventId={eventId!}
                onComplete={handleRegistrationComplete}
                requiresAccessCode={event.requires_access_code}
              />
            )}
          </motion.div>

          {/* YouTube embed for live sessions */}
          {isLive && event.youtube_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Watch Live on YouTube
                </h3>
                <Button 
                  variant="outline"
                  onClick={() => window.open(event.youtube_url!, "_blank")}
                >
                  Open YouTube Stream
                </Button>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
