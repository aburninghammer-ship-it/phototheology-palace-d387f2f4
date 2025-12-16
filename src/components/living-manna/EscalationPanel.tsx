import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  AlertTriangle, Plus, MessageSquare, CheckCircle, 
  Clock, ArrowUpCircle, User, Calendar 
} from "lucide-react";
import { format } from "date-fns";

interface EscalationPanelProps {
  churchId: string;
  onUpdate?: () => void;
}

interface Escalation {
  id: string;
  title: string;
  description: string;
  escalation_type: string;
  priority: string;
  status: string;
  raised_by: string;
  assigned_to: string | null;
  resolution: string | null;
  created_at: string;
  resolved_at: string | null;
  member_id: string | null;
  cohort_id: string | null;
}

export function EscalationPanel({ churchId, onUpdate }: EscalationPanelProps) {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [resolution, setResolution] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("open");

  const [newEscalation, setNewEscalation] = useState({
    title: "",
    description: "",
    escalation_type: "attendance",
    priority: "normal"
  });

  useEffect(() => {
    loadEscalations();
  }, [churchId, filter]);

  const loadEscalations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("leader_escalations")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      if (filter === "open") {
        query = query.in("status", ["open", "in_progress"]);
      } else if (filter === "resolved") {
        query = query.eq("status", "resolved");
      }

      const { data, error } = await query;
      if (error) throw error;
      setEscalations(data || []);
    } catch (error) {
      console.error("Error loading escalations:", error);
      toast.error("Failed to load escalations");
    } finally {
      setLoading(false);
    }
  };

  const createEscalation = async () => {
    if (!newEscalation.title.trim() || !newEscalation.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from("leader_escalations")
        .insert({
          church_id: churchId,
          title: newEscalation.title,
          description: newEscalation.description,
          escalation_type: newEscalation.escalation_type,
          priority: newEscalation.priority,
          raised_by: user?.id,
          status: "open"
        });

      if (error) throw error;

      toast.success("Escalation created successfully");
      setShowCreateDialog(false);
      setNewEscalation({
        title: "",
        description: "",
        escalation_type: "attendance",
        priority: "normal"
      });
      loadEscalations();
      onUpdate?.();
    } catch (error) {
      console.error("Error creating escalation:", error);
      toast.error("Failed to create escalation");
    }
  };

  const resolveEscalation = async () => {
    if (!selectedEscalation || !resolution.trim()) {
      toast.error("Please provide a resolution");
      return;
    }

    try {
      const { error } = await supabase
        .from("leader_escalations")
        .update({
          status: "resolved",
          resolution: resolution,
          resolved_at: new Date().toISOString()
        })
        .eq("id", selectedEscalation.id);

      if (error) throw error;

      toast.success("Escalation resolved");
      setShowResolveDialog(false);
      setSelectedEscalation(null);
      setResolution("");
      loadEscalations();
      onUpdate?.();
    } catch (error) {
      console.error("Error resolving escalation:", error);
      toast.error("Failed to resolve escalation");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "normal": return "bg-blue-500";
      case "low": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance": return <Calendar className="h-4 w-4" />;
      case "behavior": return <AlertTriangle className="h-4 w-4" />;
      case "spiritual_concern": return <MessageSquare className="h-4 w-4" />;
      case "doctrinal_question": return <MessageSquare className="h-4 w-4" />;
      case "crisis": return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Open</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Raise Escalation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Raise an Escalation</DialogTitle>
              <DialogDescription>
                Report a concern that needs attention from church leadership
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Brief summary of the concern"
                  value={newEscalation.title}
                  onChange={(e) => setNewEscalation({ ...newEscalation, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newEscalation.escalation_type}
                  onValueChange={(v) => setNewEscalation({ ...newEscalation, escalation_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attendance">Attendance Concern</SelectItem>
                    <SelectItem value="behavior">Behavior Issue</SelectItem>
                    <SelectItem value="spiritual_concern">Spiritual Concern</SelectItem>
                    <SelectItem value="doctrinal_question">Doctrinal Question</SelectItem>
                    <SelectItem value="crisis">Crisis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newEscalation.priority}
                  onValueChange={(v) => setNewEscalation({ ...newEscalation, priority: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Provide details about the concern..."
                  value={newEscalation.description}
                  onChange={(e) => setNewEscalation({ ...newEscalation, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createEscalation}>Submit Escalation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : escalations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">
              {filter === "open" ? "No Open Escalations" : "No Escalations Found"}
            </h3>
            <p className="text-muted-foreground">
              {filter === "open" 
                ? "All concerns have been addressed" 
                : "No escalations match your filter"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {escalations.map(escalation => (
            <Card key={escalation.id} className={
              escalation.priority === "urgent" ? "border-red-500/50" :
              escalation.priority === "high" ? "border-orange-500/50" : ""
            }>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(escalation.escalation_type)}
                      <h4 className="font-semibold">{escalation.title}</h4>
                      <Badge className={getPriorityColor(escalation.priority)}>
                        {escalation.priority}
                      </Badge>
                      {getStatusBadge(escalation.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {escalation.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(escalation.created_at), "MMM d, yyyy")}
                      </span>
                      <span className="capitalize">
                        {escalation.escalation_type.replace(/_/g, " ")}
                      </span>
                    </div>
                    {escalation.resolution && (
                      <div className="mt-2 p-2 bg-green-500/10 rounded text-sm">
                        <strong>Resolution:</strong> {escalation.resolution}
                      </div>
                    )}
                  </div>
                  {escalation.status !== "resolved" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedEscalation(escalation);
                        setShowResolveDialog(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Escalation</DialogTitle>
            <DialogDescription>
              Provide details on how this concern was addressed
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>Resolution</Label>
            <Textarea
              placeholder="Describe how the concern was resolved..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={resolveEscalation}>Mark Resolved</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
