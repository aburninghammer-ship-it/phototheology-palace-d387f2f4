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
  description: string | null;
  total_sessions: number;
  is_active: boolean;
  church_id: string | null;
  created_at: string;
  updated_at: string;
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
      let { data: seriesData, error: seriesError } = await supabase
        .from("sanctuary_journey_series")
        .select("*")
        .eq("church_id", churchId)
        .eq("is_active", true)
        .single();

      // If no series exists, auto-initialize one
      if (seriesError && seriesError.code === "PGRST116") {
        console.log("No series found, initializing Sanctuary Journey for church");
        seriesData = await initializeSanctuaryJourney();
        if (!seriesData) {
          setLoading(false);
          return;
        }
      } else if (seriesError) {
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

  const initializeSanctuaryJourney = async (): Promise<Series | null> => {
    try {
      // Create the series
      const { data: newSeries, error: seriesError } = await supabase
        .from("sanctuary_journey_series")
        .insert({
          church_id: churchId,
          title: "The Sanctuary Journey",
          description: "A 12-session AI-guided evangelistic series through the sanctuary, discovering Christ-centered biblical truth.",
          total_sessions: 12,
          is_active: true
        })
        .select()
        .single();

      if (seriesError) throw seriesError;

      // Insert all 12 sessions
      const sessions = getSanctuaryJourneySessions(newSeries.id);
      const { error: sessionsError } = await supabase
        .from("sanctuary_journey_sessions")
        .insert(sessions);

      if (sessionsError) throw sessionsError;

      toast.success("Sanctuary Journey initialized for your church!");
      return newSeries;
    } catch (error) {
      console.error("Error initializing Sanctuary Journey:", error);
      toast.error("Failed to initialize Sanctuary Journey");
      return null;
    }
  };

  const getSanctuaryJourneySessions = (seriesId: string) => [
    // Phase 1: Gospel Foundation (Courtyard)
    {
      series_id: seriesId,
      session_number: 1,
      title: "The Altar of Sacrifice",
      phase: "gospel_foundation",
      sanctuary_frame: "Courtyard - Altar of Burnt Offering",
      primary_scriptures: ["Genesis 22:1-14", "Leviticus 1:3-9", "John 1:29", "Hebrews 9:22"],
      core_truth: "Without the shedding of blood there is no forgiveness. The altar reveals that approaching God requires a substitute.",
      guided_insight: "Every morning and evening, smoke rose from the altar. The constant sacrifice pointed to a Lamb who would come once for all. Abraham saw this on Moriah when God provided the ram.",
      reflection_question: "If you had to approach God on your own merits, could you? What does the altar teach you about how God makes a way?",
      prayer_prompt: "Lord, I come to Your altar acknowledging I cannot save myself. Thank You for the Lamb who was slain for me."
    },
    {
      series_id: seriesId,
      session_number: 2,
      title: "The Laver of Cleansing",
      phase: "gospel_foundation",
      sanctuary_frame: "Courtyard - Bronze Laver",
      primary_scriptures: ["Exodus 30:17-21", "John 13:1-17", "Titus 3:5", "Ephesians 5:26"],
      core_truth: "The blood of the altar provides forgiveness; the water of the laver provides cleansing. Both are essential for approaching God.",
      guided_insight: "The priests washed at the laver before ministry. Jesus knelt to wash His disciples' feet. The Word washes us daily, preparing us for service.",
      reflection_question: "Forgiveness deals with guilt, but cleansing deals with contamination. What areas of your life need the daily washing of the Word?",
      prayer_prompt: "Father, wash me with Your Word. Cleanse not just my record but my heart, that I may serve You with pure hands."
    },
    {
      series_id: seriesId,
      session_number: 3,
      title: "Entering the Holy Place",
      phase: "gospel_foundation",
      sanctuary_frame: "The Veil - Access to God's Presence",
      primary_scriptures: ["Hebrews 10:19-22", "John 14:6", "Exodus 26:31-33", "Matthew 27:51"],
      core_truth: "Through Christ's blood, we have bold access through the veil into God's presence. What was once restricted is now open.",
      guided_insight: "Only priests could enter the Holy Place. But when Jesus died, the veil tore from top to bottom—God's hand opening the way. Now all believers are priests with access.",
      reflection_question: "Do you approach God with timidity or with bold confidence? What does the torn veil mean for your prayer life?",
      prayer_prompt: "Jesus, thank You for tearing the veil. I enter boldly, not because I am worthy, but because You have made me welcome.",
      is_checkpoint: true,
      checkpoint_options: { question: "How has your understanding of approaching God changed through these sessions?" }
    },
    // Phase 2: Daily Walk (Holy Place)
    {
      series_id: seriesId,
      session_number: 4,
      title: "The Lampstand: Walking in Light",
      phase: "daily_walk",
      sanctuary_frame: "Holy Place - Golden Lampstand",
      primary_scriptures: ["Exodus 25:31-40", "John 8:12", "Psalm 119:105", "Revelation 1:12-20"],
      core_truth: "Christ is the Light of the World. His Word is a lamp to our feet. The church is called to bear His light to the nations.",
      guided_insight: "The lampstand had seven branches, beaten from one piece of pure gold. It was the only light source in the Holy Place. Without it, the priests worked in darkness.",
      reflection_question: "What happens when we try to serve God without His light? How does Scripture illuminate your daily decisions?",
      prayer_prompt: "Lord, be my light. Let Your Word guide my steps today. May I reflect Your light to those in darkness."
    },
    {
      series_id: seriesId,
      session_number: 5,
      title: "The Table of Showbread: Fed by the Word",
      phase: "daily_walk",
      sanctuary_frame: "Holy Place - Table of Showbread",
      primary_scriptures: ["Exodus 25:23-30", "John 6:32-35", "Matthew 4:4", "Jeremiah 15:16"],
      core_truth: "Man shall not live by bread alone. Christ is the Bread of Life. We are sustained not by physical food but by every word from God's mouth.",
      guided_insight: "Twelve loaves sat on the table—one for each tribe. Fresh bread every Sabbath. The priests ate in God's presence, fellowship and sustenance combined.",
      reflection_question: "How regularly do you feed on Scripture? Is it daily bread or occasional snack? What would change if you feasted daily?",
      prayer_prompt: "Bread of Life, feed my hungry soul. May Your Word be sweeter than honey, more necessary than my daily food."
    },
    {
      series_id: seriesId,
      session_number: 6,
      title: "The Altar of Incense: Ascending Prayer",
      phase: "daily_walk",
      sanctuary_frame: "Holy Place - Altar of Incense",
      primary_scriptures: ["Exodus 30:1-10", "Revelation 8:3-4", "Psalm 141:2", "Romans 8:26-27"],
      core_truth: "Our prayers rise like incense before God's throne. Christ intercedes for us, and the Spirit helps our weakness in prayer.",
      guided_insight: "The incense altar stood closest to the veil, right before God's presence. Morning and evening incense—prayer is not optional but essential rhythm.",
      reflection_question: "If your prayer life were incense, would it rise steadily or sporadically? What keeps you from consistent communion with God?",
      prayer_prompt: "Father, let my prayers rise as incense before You. Holy Spirit, intercede through me when I do not know what to pray.",
      is_checkpoint: true,
      checkpoint_options: { question: "What daily spiritual disciplines are you committing to continue?" }
    },
    // Phase 3: Most Holy Place
    {
      series_id: seriesId,
      session_number: 7,
      title: "The Ark and the Law",
      phase: "most_holy_place",
      sanctuary_frame: "Most Holy Place - Ark of the Covenant",
      primary_scriptures: ["Exodus 25:10-22", "Deuteronomy 10:1-5", "Romans 3:31", "James 2:10-12"],
      core_truth: "God's law is not abolished but established by grace. The Ten Commandments reveal God's character and remain the standard of righteousness.",
      guided_insight: "Inside the Ark rested the tablets of stone—God's own handwriting. The law is not burdensome chains but the character of the Lawgiver written for our good.",
      reflection_question: "Does the law feel like a burden or a blessing to you? How does understanding God's character change your view of His commands?",
      prayer_prompt: "Lord, write Your law on my heart. Not as burden but as blessing. Let me love Your commands because I love You."
    },
    {
      series_id: seriesId,
      session_number: 8,
      title: "The Mercy Seat: Grace Above the Law",
      phase: "most_holy_place",
      sanctuary_frame: "Most Holy Place - Mercy Seat",
      primary_scriptures: ["Exodus 25:17-22", "Romans 3:23-26", "Hebrews 4:14-16", "1 John 2:1-2"],
      core_truth: "The mercy seat covered the law. Blood was sprinkled there, and from above it, God spoke. Justice and mercy meet at the cross.",
      guided_insight: "The Hebrew word for mercy seat is kapporeth—the place of covering, of atonement. The cherubim looked down at the blood, not at the broken law beneath.",
      reflection_question: "When God looks at you, does He see your failures or the blood that covers them? How does the mercy seat change how you approach God?",
      prayer_prompt: "Thank You, Lord, that mercy triumphs over judgment. I approach Your throne not as accused but as beloved, covered by Christ's blood."
    },
    {
      series_id: seriesId,
      session_number: 9,
      title: "The High Priest's Ministry",
      phase: "most_holy_place",
      sanctuary_frame: "Most Holy Place - Christ's Heavenly Ministry",
      primary_scriptures: ["Hebrews 7:23-28", "Hebrews 8:1-6", "Hebrews 9:11-14", "1 John 2:1"],
      core_truth: "Jesus is our High Priest in the heavenly sanctuary. He ever lives to intercede for us. His priesthood is permanent and perfect.",
      guided_insight: "Aaron wore the names of Israel on his shoulders and heart when he entered. Jesus bears our names before the Father even now.",
      reflection_question: "Do you live with awareness that Jesus is actively interceding for you right now? How would daily consciousness of His priesthood change your confidence?",
      prayer_prompt: "Great High Priest, thank You for carrying my name before the Father. I rest knowing You never cease to intercede.",
      is_checkpoint: true,
      checkpoint_options: { question: "How has understanding the Most Holy Place deepened your relationship with Christ?" }
    },
    // Phase 4: End-Time Message
    {
      series_id: seriesId,
      session_number: 10,
      title: "The Day of Atonement: Judgment and Cleansing",
      phase: "end_time_message",
      sanctuary_frame: "Day of Atonement - Investigative Judgment",
      primary_scriptures: ["Leviticus 16:1-34", "Daniel 8:14", "Hebrews 9:23-28", "Revelation 14:7"],
      core_truth: "The Day of Atonement prefigured a final judgment—the cleansing of the heavenly sanctuary. We live in the antitypical day of atonement.",
      guided_insight: "Once a year, Israel afflicted their souls while the high priest cleansed the sanctuary. Sins confessed through the year were finally removed. A final accounting.",
      reflection_question: "If we are living in the antitypical Day of Atonement, what should characterize our lives? What does it mean to 'afflict your soul' today?",
      prayer_prompt: "Lord, search my heart. As You cleanse the heavenly sanctuary, cleanse me. Let nothing unconfessed remain."
    },
    {
      series_id: seriesId,
      session_number: 11,
      title: "The Three Angels' Messages",
      phase: "end_time_message",
      sanctuary_frame: "Revelation 14 - God's Final Appeal",
      primary_scriptures: ["Revelation 14:6-12", "Revelation 18:1-4", "Matthew 24:14", "Daniel 7:9-14"],
      core_truth: "God's final message to the world calls humanity to worship the Creator, warns of Babylon's fall, and calls His people out before judgment.",
      guided_insight: "These messages are not fear-mongering but the everlasting gospel in end-time context. Fear God = reverent worship. Babylon = confusion. The beast = counterfeit worship.",
      reflection_question: "How do you share urgent truth without creating fear? What does it mean to worship the Creator in an age that denies Him?",
      prayer_prompt: "Father, give me wisdom to share the three angels' messages with grace and urgency. May I be a voice calling people to true worship."
    },
    {
      series_id: seriesId,
      session_number: 12,
      title: "The Sanctuary Complete: New Jerusalem",
      phase: "end_time_message",
      sanctuary_frame: "Revelation 21-22 - God Dwells With His People",
      primary_scriptures: ["Revelation 21:1-7", "Revelation 21:22-27", "Revelation 22:1-5", "John 14:1-3"],
      core_truth: "The sanctuary journey ends in the New Jerusalem—where there is no temple because God Himself is the temple. Face to face at last.",
      guided_insight: "The whole sanctuary system was scaffolding—temporary structure pointing to permanent reality. When shadow meets substance, scaffolding comes down.",
      reflection_question: "What does it mean to you that one day you will see God face to face? How does this hope shape how you live now?",
      prayer_prompt: "Come, Lord Jesus. I long for the day when the sanctuary journey ends in Your presence forever. Until then, may I walk faithfully.",
      is_checkpoint: true,
      checkpoint_options: { question: "What decision are you making as a result of this journey? Would you like to talk with someone about baptism or joining God's remnant people?" }
    }
  ];

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
