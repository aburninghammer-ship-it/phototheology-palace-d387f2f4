import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Users, CheckCircle, Plus } from "lucide-react";

interface PrayerMinistryHubProps {
  churchId: string;
}

export function PrayerMinistryHub({ churchId }: PrayerMinistryHubProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [churchId]);

  const loadData = async () => {
    try {
      const [teamsRes, requestsRes] = await Promise.all([
        supabase.from("prayer_teams").select("*").eq("church_id", churchId),
        supabase.from("church_prayer_requests").select("*").eq("church_id", churchId).order("created_at", { ascending: false }).limit(20)
      ]);
      setTeams(teamsRes.data || []);
      setRequests(requestsRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prayer Ministry Hub</h2>
          <p className="text-muted-foreground">Manage intercessory teams and prayer requests</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" />New Team</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Active Teams</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{teams.filter(t => t.is_active).length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Open Requests</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{requests.filter(r => !r.is_answered).length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Answered</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-500">{requests.filter(r => r.is_answered).length}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList><TabsTrigger value="requests">Prayer Requests</TabsTrigger><TabsTrigger value="teams">Teams</TabsTrigger></TabsList>
        <TabsContent value="requests" className="space-y-4">
          {requests.map(req => (
            <Card key={req.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{req.title}</h4>
                    <p className="text-sm text-muted-foreground">{req.content}</p>
                    <Badge variant={req.is_answered ? "default" : "outline"} className="mt-2">
                      {req.is_answered ? <><CheckCircle className="h-3 w-3 mr-1"/>Answered</> : "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="h-4 w-4" />{req.prayer_count}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="teams" className="grid gap-4 md:grid-cols-2">
          {teams.map(team => (
            <Card key={team.id}>
              <CardHeader><CardTitle>{team.name}</CardTitle><CardDescription>{team.focus_area}</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{team.meeting_schedule}</p></CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
