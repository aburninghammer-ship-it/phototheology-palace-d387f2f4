import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, ArrowLeft, Calendar, Clock, Target } from "lucide-react";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  created_at: string;
  content: string;
  submission_data: any;
  principle_applied: string;
  time_spent: number;
  challenge_title: string;
  challenge_type: string;
  challenge_subtype: string;
  challenge_tier: string;
  principle_used: string;
  room_codes: string[];
}

const GrowthJournal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchJournal();
    }
  }, [user]);

  const fetchJournal = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_growth_journal")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching journal:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = filter === "all" 
    ? entries 
    : entries.filter(e => e.challenge_tier === filter);

  const stats = {
    total: entries.length,
    quick: entries.filter(e => e.challenge_tier === "Quick").length,
    core: entries.filter(e => e.challenge_tier === "Core").length,
    advance: entries.filter(e => e.challenge_tier === "Advance").length,
    totalTime: entries.reduce((sum, e) => sum + (e.time_spent || 0), 0),
  };

  const renderSubmissionData = (entry: JournalEntry) => {
    const data = entry.submission_data;
    if (!data) return null;

    return (
      <div className="space-y-2 text-sm">
        {data.dimension && (
          <div>
            <span className="font-semibold">Dimension: </span>
            <span className="text-muted-foreground">{data.dimension.toUpperCase()}</span>
          </div>
        )}
        {data.answer && (
          <div>
            <span className="font-semibold">Answer: </span>
            <p className="text-muted-foreground mt-1">{data.answer}</p>
          </div>
        )}
        {data.connected_verse && (
          <div>
            <span className="font-semibold">Connected Verse: </span>
            <p className="text-muted-foreground mt-1">{data.connected_verse}</p>
          </div>
        )}
        {data.explanation && (
          <div>
            <span className="font-semibold">Explanation: </span>
            <p className="text-muted-foreground mt-1">{data.explanation}</p>
          </div>
        )}
        {data.furniture && (
          <div>
            <span className="font-semibold">Sanctuary Furniture: </span>
            <span className="text-muted-foreground">{data.furniture}</span>
          </div>
        )}
        {data.christ_reflection && (
          <div>
            <span className="font-semibold">Christ Reflection: </span>
            <p className="text-muted-foreground mt-1">{data.christ_reflection}</p>
          </div>
        )}
        {data.action_today && (
          <div>
            <span className="font-semibold">Action Today: </span>
            <p className="text-muted-foreground mt-1">{data.action_today}</p>
          </div>
        )}
        {data.growth_needed && (
          <div>
            <span className="font-semibold">Growth Area: </span>
            <p className="text-muted-foreground mt-1">{data.growth_needed}</p>
          </div>
        )}
      </div>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/daily-challenges")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <BookOpen className="h-8 w-8 text-primary" />
                Growth Journal
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{stats.total}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Entries</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.quick}</p>
                  <p className="text-sm text-muted-foreground mt-1">Quick Challenges</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.core}</p>
                  <p className="text-sm text-muted-foreground mt-1">Core Challenges</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{Math.floor(stats.totalTime / 60)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Minutes Studying</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-sm">
              <span className="font-semibold">Your Growth Journal</span> is your testimony and training record. 
              Every entry shows you're building Phototheology reflexes. This is discipleship evidence and content fuel 
              for sharing insights with others.
            </p>
          </div>

          <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="Quick">Quick ({stats.quick})</TabsTrigger>
              <TabsTrigger value="Core">Core ({stats.core})</TabsTrigger>
              <TabsTrigger value="Advance">Advance ({stats.advance})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4 mt-6">
              {loading ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Loading your journal...</p>
                  </CardContent>
                </Card>
              ) : filteredEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {filter === "all" 
                        ? "Your journal is empty. Complete your first daily challenge to begin!"
                        : `No ${filter} challenges completed yet.`
                      }
                    </p>
                    <Button onClick={() => navigate("/daily-challenges")}>
                      Start a Challenge
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredEntries.map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-xl">{entry.challenge_title}</CardTitle>
                            <Badge variant={
                              entry.challenge_tier === "Quick" ? "default" :
                              entry.challenge_tier === "Core" ? "secondary" :
                              "outline"
                            }>
                              {entry.challenge_tier}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(entry.created_at), "MMM dd, yyyy")}
                            </div>
                            {entry.time_spent && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {Math.floor(entry.time_spent / 60)}m {entry.time_spent % 60}s
                              </div>
                            )}
                            {entry.principle_applied && (
                              <div className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {entry.principle_applied}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderSubmissionData(entry)}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default GrowthJournal;
