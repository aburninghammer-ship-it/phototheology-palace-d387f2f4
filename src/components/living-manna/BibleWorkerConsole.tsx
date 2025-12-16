import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, Target, GraduationCap, Plus } from "lucide-react";

interface BibleWorkerConsoleProps {
  churchId: string;
}

export function BibleWorkerConsole({ churchId }: BibleWorkerConsoleProps) {
  const [interests, setInterests] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [releases, setReleases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [churchId]);

  const loadData = async () => {
    try {
      const [interestsRes, candidatesRes, releasesRes] = await Promise.all([
        supabase.from("evangelism_interests").select("*").eq("church_id", churchId),
        supabase.from("baptism_candidates").select("*").eq("church_id", churchId),
        supabase.from("bible_worker_study_releases").select("*").eq("church_id", churchId)
      ]);
      setInterests(interestsRes.data || []);
      setCandidates(candidatesRes.data || []);
      setReleases(releasesRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  const getInterestBadge = (level: string) => {
    const colors: Record<string, string> = { curious: "bg-blue-500", interested: "bg-green-500", studying: "bg-purple-500", ready: "bg-amber-500", decided: "bg-red-500" };
    return <Badge className={colors[level] || "bg-gray-500"}>{level}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bible Worker Console</h2>
          <p className="text-muted-foreground">Manage interests, studies, and baptism pipeline</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />Add Interest</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Interests</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{interests.filter(i => i.status === "active").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Studying</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-purple-500">{interests.filter(i => i.interest_level === "studying").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Baptism Pipeline</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-500">{candidates.filter(c => c.stage !== "baptized").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Baptized</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{candidates.filter(c => c.stage === "baptized").length}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="interests">
        <TabsList><TabsTrigger value="interests">Interests</TabsTrigger><TabsTrigger value="baptism">Baptism Pipeline</TabsTrigger><TabsTrigger value="studies">Study Materials</TabsTrigger></TabsList>
        
        <TabsContent value="interests" className="space-y-4">
          {interests.length === 0 ? (
            <Card><CardContent className="py-12 text-center"><Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><p>No interests yet</p></CardContent></Card>
          ) : interests.map(interest => (
            <Card key={interest.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{interest.name}</h4>
                  <p className="text-sm text-muted-foreground">{interest.email} • {interest.total_studies} studies</p>
                </div>
                {getInterestBadge(interest.interest_level)}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="baptism" className="space-y-4">
          {candidates.map(c => (
            <Card key={c.id}>
              <CardContent className="py-4 flex items-center justify-between">
                <div><h4 className="font-semibold">{c.name}</h4><p className="text-sm text-muted-foreground capitalize">{c.stage}</p></div>
                <Badge>{c.stage}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="studies" className="grid gap-4 md:grid-cols-2">
          {releases.map(r => (
            <Card key={r.id}>
              <CardHeader><CardTitle className="text-lg">{r.title}</CardTitle><CardDescription>{r.description}</CardDescription></CardHeader>
              <CardContent><Badge>{r.status}</Badge></CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
