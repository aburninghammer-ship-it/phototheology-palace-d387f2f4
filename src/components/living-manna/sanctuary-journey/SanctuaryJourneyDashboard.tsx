import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  BookOpen, Users, AlertTriangle, Play, 
  ChevronRight, Loader2, UserPlus, Eye
} from "lucide-react";
import { SanctuaryJourneyViewer } from "./SanctuaryJourneyViewer";
import { JourneyEscalations } from "./JourneyEscalations";
import { JourneyParticipants } from "./JourneyParticipants";

interface SanctuaryJourneyDashboardProps {
  churchId: string;
}

interface JourneyStats {
  totalParticipants: number;
  activeJourneys: number;
  completedJourneys: number;
  pendingEscalations: number;
  averageProgress: number;
}

interface Series {
  id: string;
  title: string;
  description: string;
  total_sessions: number;
  is_active: boolean;
}

export function SanctuaryJourneyDashboard({ churchId }: SanctuaryJourneyDashboardProps) {
  const { user } = useAuth();
  const [series, setSeries] = useState<Series | null>(null);
  const [stats, setStats] = useState<JourneyStats>({
    totalParticipants: 0,
    activeJourneys: 0,
    completedJourneys: 0,
    pendingEscalations: 0,
    averageProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const [showViewer, setShowViewer] = useState(false);
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    loadJourneyData();
  }, [churchId]);

  const loadJourneyData = async () => {
    setLoading(true);
    try {
      // Load series for this church
      const { data: seriesData, error: seriesError } = await supabase
        .from("sanctuary_journey_series")
        .select("*")
        .eq("church_id", churchId)
        .eq("is_active", true)
        .single();

      if (seriesError) {
        console.error("Error loading series:", seriesError);
        setLoading(false);
        return;
      }

      setSeries(seriesData);

      // Load progress stats
      const { data: progressData } = await supabase
        .from("sanctuary_journey_progress")
        .select("*, sanctuary_journey_session_completions(count)")
        .eq("series_id", seriesData.id);

      // Load escalations
      const { data: escalations } = await supabase
        .from("sanctuary_journey_escalations")
        .select("id")
        .in("progress_id", progressData?.map(p => p.id) || [])
        .eq("status", "pending");

      // Check if current user has progress
      if (user) {
        const userProg = progressData?.find(p => p.user_id === user.id);
        setUserProgress(userProg);
      }

      // Calculate stats
      const activeJourneys = progressData?.filter(p => p.status === "active").length || 0;
      const completedJourneys = progressData?.filter(p => p.status === "completed").length || 0;
      const avgProgress = progressData?.length 
        ? progressData.reduce((sum, p) => sum + (p.current_session / seriesData.total_sessions) * 100, 0) / progressData.length
        : 0;

      setStats({
        totalParticipants: progressData?.length || 0,
        activeJourneys,
        completedJourneys,
        pendingEscalations: escalations?.length || 0,
        averageProgress: Math.round(avgProgress)
      });
    } catch (error) {
      console.error("Error loading journey data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startJourney = async () => {
    if (!user || !series) return;

    try {
      const { data, error } = await supabase
        .from("sanctuary_journey_progress")
        .insert({
          user_id: user.id,
          series_id: series.id,
          current_session: 1,
          status: "active",
          journey_mode: "individual"
        })
        .select()
        .single();

      if (error) throw error;

      setUserProgress(data);
      setShowViewer(true);
      toast.success("Your Sanctuary Journey has begun!");
    } catch (error) {
      console.error("Error starting journey:", error);
      toast.error("Failed to start journey");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!series) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Sanctuary Journey Configured</h3>
          <p className="text-muted-foreground mb-4">
            The Sanctuary Journey evangelistic series hasn't been set up for this church yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showViewer && userProgress) {
    return (
      <SanctuaryJourneyViewer 
        progressId={userProgress.id}
        seriesId={series.id}
        onBack={() => setShowViewer(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            The Sanctuary Journey
          </h2>
          <p className="text-muted-foreground">
            AI-guided evangelistic series • 12 Sessions • Christ-centered discovery
          </p>
        </div>
        {userProgress ? (
          <Button onClick={() => setShowViewer(true)}>
            <Play className="h-4 w-4 mr-2" />
            Continue Journey
          </Button>
        ) : (
          <Button onClick={startJourney}>
            <Play className="h-4 w-4 mr-2" />
            Start Journey
          </Button>
        )}
      </div>

      {/* User Progress Card (if enrolled) */}
      {userProgress && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Your Progress</span>
              <Badge variant="outline">
                Session {userProgress.current_session} of {series.total_sessions}
              </Badge>
            </div>
            <Progress 
              value={(userProgress.current_session / series.total_sessions) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {userProgress.status === "completed" 
                ? "Journey completed! 🎉" 
                : `${Math.round((userProgress.current_session / series.total_sessions) * 100)}% complete`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">Enrolled in journey</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Journeys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeJourneys}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedJourneys}</div>
            <p className="text-xs text-muted-foreground">Finished all sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Escalations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingEscalations}</div>
            <p className="text-xs text-muted-foreground">Need follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Escalations Alert */}
      {stats.pendingEscalations > 0 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">{stats.pendingEscalations} journey escalation(s) need attention</p>
                <p className="text-sm text-muted-foreground">
                  Review baptism interests, questions, and prayer requests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Management Tabs */}
      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">
            <Users className="h-4 w-4 mr-2" />
            Participants
          </TabsTrigger>
          <TabsTrigger value="escalations">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Escalations
            {stats.pendingEscalations > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.pendingEscalations}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview Sessions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <JourneyParticipants seriesId={series.id} />
        </TabsContent>

        <TabsContent value="escalations">
          <JourneyEscalations seriesId={series.id} onUpdate={loadJourneyData} />
        </TabsContent>

        <TabsContent value="preview">
          <SessionPreview seriesId={series.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SessionPreview({ seriesId }: { seriesId: string }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [seriesId]);

  const loadSessions = async () => {
    const { data } = await supabase
      .from("sanctuary_journey_sessions")
      .select("*")
      .eq("series_id", seriesId)
      .order("session_number");
    
    setSessions(data || []);
    setLoading(false);
  };

  const phaseColors: Record<string, string> = {
    gospel_foundation: "bg-green-100 text-green-800",
    daily_walk: "bg-blue-100 text-blue-800",
    most_holy_place: "bg-purple-100 text-purple-800",
    end_time_message: "bg-amber-100 text-amber-800"
  };

  const phaseLabels: Record<string, string> = {
    gospel_foundation: "Gospel Foundation",
    daily_walk: "Daily Walk",
    most_holy_place: "Most Holy Place",
    end_time_message: "End-Time Message"
  };

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <Card key={session.id} className={session.is_checkpoint ? "ring-2 ring-primary/50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline">Session {session.session_number}</Badge>
              <Badge className={phaseColors[session.phase]}>
                {phaseLabels[session.phase]}
              </Badge>
            </div>
            <CardTitle className="text-lg">{session.title}</CardTitle>
            <CardDescription>{session.sanctuary_frame}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Core Truth</p>
              <p className="text-sm">{session.core_truth}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Scriptures</p>
              <p className="text-sm">{session.primary_scriptures?.join(", ")}</p>
            </div>
            {session.is_checkpoint && (
              <Badge variant="secondary" className="mt-2">
                Checkpoint Session
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
