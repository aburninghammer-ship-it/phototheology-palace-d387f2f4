import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User } from "lucide-react";

interface JourneyParticipantsProps {
  seriesId: string;
}

interface Participant {
  id: string;
  user_id: string;
  current_session: number;
  status: string;
  journey_mode: string;
  started_at: string;
  profile?: {
    display_name: string;
    avatar_url: string;
  };
}

export function JourneyParticipants({ seriesId }: JourneyParticipantsProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const totalSessions = 12;

  useEffect(() => {
    loadParticipants();
  }, [seriesId]);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const { data: progressData } = await supabase
        .from("sanctuary_journey_progress")
        .select("*")
        .eq("series_id", seriesId)
        .order("started_at", { ascending: false });

      if (progressData && progressData.length > 0) {
        // Load profiles for each participant
        const userIds = progressData.map(p => p.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", userIds);

        const participantsWithProfiles = progressData.map(p => ({
          ...p,
          profile: profiles?.find(pr => pr.id === p.user_id)
        }));

        setParticipants(participantsWithProfiles);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error("Error loading participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    paused: "bg-amber-100 text-amber-800",
    completed: "bg-blue-100 text-blue-800"
  };

  const modeLabels: Record<string, string> = {
    individual: "Individual",
    group: "Group",
    sponsored: "Sponsored"
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Participants Yet</h3>
          <p className="text-muted-foreground">
            Share the Sanctuary Journey with members to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {participants.map((participant) => (
          <Card key={participant.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={participant.profile?.avatar_url} />
                  <AvatarFallback>
                    {participant.profile?.display_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {participant.profile?.display_name || "Unknown User"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={statusColors[participant.status]} variant="secondary">
                      {participant.status}
                    </Badge>
                    <Badge variant="outline">
                      {modeLabels[participant.journey_mode]}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    Session {participant.current_session}/{totalSessions}
                  </span>
                </div>
                <Progress 
                  value={(participant.current_session / totalSessions) * 100} 
                  className="h-2"
                />
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Started {new Date(participant.started_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
