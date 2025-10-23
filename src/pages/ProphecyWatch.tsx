import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Telescope, Sparkles, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProphecySignal {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const ProphecyWatch = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signals, setSignals] = useState<ProphecySignal[]>([]);
  const [filter, setFilter] = useState("all");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadSignals();
    }
  }, [user]);

  const loadSignals = async () => {
    const { data } = await supabase
      .from("challenges")
      .select("*")
      .eq("challenge_type", "prophecy")
      .order("created_at", { ascending: false });

    if (data) {
      setSignals(
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.difficulty || "general",
          created_at: item.created_at,
        }))
      );
    }
  };

  const generateSignal = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "prophecy-signal",
        },
      });

      if (error) throw error;

      await supabase.from("challenges").insert({
        title: data.title,
        description: data.description,
        challenge_type: "prophecy",
        difficulty: data.category,
        verses: data.verses || [],
      });

      toast({
        title: "Signal Generated",
        description: "New prophetic signal added to your watch list",
      });

      loadSignals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (!user) return null;

  const filteredSignals = filter === "all" ? signals : signals.filter((s) => s.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-block bg-white rounded-2xl p-6 shadow-lg mb-6">
              <Telescope className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Prophecy Watch</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Monitoring signals of end-time events. Watching for the fulfillment of Daniel and
              Revelation.
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-slate-800 text-white py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex gap-4 items-center">
              <Button
                onClick={generateSignal}
                disabled={generating}
                className="flex-1 h-16 text-lg bg-blue-600 hover:bg-blue-700"
              >
                {generating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating Signal...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate New Signal with AI
                  </>
                )}
              </Button>
              <div className="w-64">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="h-16 bg-slate-700 border-slate-600 text-white">
                    <Filter className="mr-2 h-5 w-5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Signals</SelectItem>
                    <SelectItem value="political">Political</SelectItem>
                    <SelectItem value="natural">Natural Events</SelectItem>
                    <SelectItem value="technological">Technological</SelectItem>
                    <SelectItem value="spiritual">Spiritual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Signals List */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {filteredSignals.length === 0 ? (
            <div className="text-center py-20">
              <Telescope className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold mb-2 text-muted-foreground">No Signals Yet</h2>
              <p className="text-muted-foreground mb-6">
                Generate your first prophetic signal to start watching
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSignals.map((signal) => (
                <Card key={signal.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Telescope className="h-5 w-5 text-blue-600" />
                          {signal.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{signal.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{signal.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Detected: {new Date(signal.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProphecyWatch;
