import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Loader2, AlertTriangle, Heart, HelpCircle, 
  Droplets, Users, CheckCircle, MessageSquare
} from "lucide-react";

interface JourneyEscalationsProps {
  seriesId: string;
  onUpdate?: () => void;
}

interface Escalation {
  id: string;
  progress_id: string;
  session_id: string;
  escalation_type: string;
  user_message: string;
  ai_detected_reason: string;
  status: string;
  resolution_notes: string | null;
  created_at: string;
  user_profile?: {
    display_name: string;
    avatar_url: string;
  };
  session?: {
    session_number: number;
    title: string;
  };
}

export function JourneyEscalations({ seriesId, onUpdate }: JourneyEscalationsProps) {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    loadEscalations();
  }, [seriesId]);

  const loadEscalations = async () => {
    setLoading(true);
    try {
      // First get progress IDs for this series
      const { data: progressData } = await supabase
        .from("sanctuary_journey_progress")
        .select("id, user_id")
        .eq("series_id", seriesId);

      if (!progressData || progressData.length === 0) {
        setEscalations([]);
        setLoading(false);
        return;
      }

      const progressIds = progressData.map(p => p.id);
      const userIds = progressData.map(p => p.user_id);

      // Load escalations
      const { data: escalationData } = await supabase
        .from("sanctuary_journey_escalations")
        .select("*")
        .in("progress_id", progressIds)
        .order("created_at", { ascending: false });

      if (!escalationData || escalationData.length === 0) {
        setEscalations([]);
        setLoading(false);
        return;
      }

      // Load profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      // Load sessions
      const sessionIds = escalationData.map(e => e.session_id).filter(Boolean);
      const { data: sessions } = await supabase
        .from("sanctuary_journey_sessions")
        .select("id, session_number, title")
        .in("id", sessionIds);

      // Combine data
      const enrichedEscalations = escalationData.map(e => {
        const progress = progressData.find(p => p.id === e.progress_id);
        return {
          ...e,
          user_profile: profiles?.find(p => p.id === progress?.user_id),
          session: sessions?.find(s => s.id === e.session_id)
        };
      });

      setEscalations(enrichedEscalations);
    } catch (error) {
      console.error("Error loading escalations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedEscalation || !user) return;

    setResolving(true);
    try {
      await supabase
        .from("sanctuary_journey_escalations")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolution_notes: resolutionNotes,
          assigned_to: user.id
        })
        .eq("id", selectedEscalation.id);

      toast.success("Escalation resolved");
      setSelectedEscalation(null);
      setResolutionNotes("");
      loadEscalations();
      onUpdate?.();
    } catch (error) {
      console.error("Error resolving escalation:", error);
      toast.error("Failed to resolve escalation");
    } finally {
      setResolving(false);
    }
  };

  const typeIcons: Record<string, any> = {
    baptism_interest: Droplets,
    doctrinal_question: HelpCircle,
    emotional_distress: Heart,
    lifestyle_conflict: AlertTriangle,
    prayer_request: Heart,
    group_connection: Users
  };

  const typeLabels: Record<string, string> = {
    baptism_interest: "Baptism Interest",
    doctrinal_question: "Doctrinal Question",
    emotional_distress: "Emotional Support",
    lifestyle_conflict: "Lifestyle Conflict",
    prayer_request: "Prayer Request",
    group_connection: "Group Connection"
  };

  const typeColors: Record<string, string> = {
    baptism_interest: "bg-blue-100 text-blue-800",
    doctrinal_question: "bg-purple-100 text-purple-800",
    emotional_distress: "bg-red-100 text-red-800",
    lifestyle_conflict: "bg-amber-100 text-amber-800",
    prayer_request: "bg-pink-100 text-pink-800",
    group_connection: "bg-green-100 text-green-800"
  };

  const statusColors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    assigned: "bg-blue-100 text-blue-800",
    in_progress: "bg-purple-100 text-purple-800",
    resolved: "bg-green-100 text-green-800"
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (escalations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Escalations</h3>
          <p className="text-muted-foreground">
            All journey participants are progressing smoothly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {escalations.map((escalation) => {
          const Icon = typeIcons[escalation.escalation_type] || AlertTriangle;
          return (
            <Card key={escalation.id} className={escalation.status === "pending" ? "border-amber-500/50" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={escalation.user_profile?.avatar_url} />
                    <AvatarFallback>
                      {escalation.user_profile?.display_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">
                        {escalation.user_profile?.display_name || "Unknown User"}
                      </p>
                      <Badge className={typeColors[escalation.escalation_type]} variant="secondary">
                        <Icon className="h-3 w-3 mr-1" />
                        {typeLabels[escalation.escalation_type]}
                      </Badge>
                      <Badge className={statusColors[escalation.status]} variant="secondary">
                        {escalation.status}
                      </Badge>
                    </div>
                    
                    {escalation.session && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Session {escalation.session.session_number}: {escalation.session.title}
                      </p>
                    )}

                    {escalation.user_message && (
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                          "{escalation.user_message}"
                        </p>
                      </div>
                    )}

                    {escalation.resolution_notes && (
                      <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          <strong>Resolution:</strong> {escalation.resolution_notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-muted-foreground">
                        {new Date(escalation.created_at).toLocaleString()}
                      </p>
                      {escalation.status !== "resolved" && (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedEscalation(escalation)}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={!!selectedEscalation} onOpenChange={() => setSelectedEscalation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Escalation</DialogTitle>
            <DialogDescription>
              Add notes about how this escalation was addressed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedEscalation?.user_message && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>User Message:</strong> "{selectedEscalation.user_message}"
                </p>
              </div>
            )}
            
            <Textarea
              placeholder="Describe how this was resolved (e.g., contacted member, scheduled meeting, prayed together)..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEscalation(null)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={resolving || !resolutionNotes.trim()}>
              {resolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
