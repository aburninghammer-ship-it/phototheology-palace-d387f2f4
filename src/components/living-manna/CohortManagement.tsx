import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, Calendar, MapPin, Video, Plus, 
  MoreVertical, Edit, Trash2, UserPlus
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CohortManagementProps {
  churchId: string;
}

interface Cohort {
  id: string;
  name: string;
  description: string | null;
  status: string;
  current_week: number;
  max_members: number;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
  is_online: boolean;
  start_date: string | null;
  leader_id: string | null;
  member_count?: number;
}

export function CohortManagement({ churchId }: CohortManagementProps) {
  const { user } = useAuth();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCohort, setNewCohort] = useState({
    name: "",
    description: "",
    meeting_day: "",
    meeting_time: "",
    meeting_location: "",
    is_online: false,
    max_members: 12
  });

  useEffect(() => {
    loadCohorts();
  }, [churchId]);

  const loadCohorts = async () => {
    setLoading(true);
    try {
      const { data: cohortsData, error } = await supabase
        .from("discipleship_cohorts")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get member counts
      const cohortIds = cohortsData?.map(c => c.id) || [];
      const { data: membersData } = await supabase
        .from("cohort_members")
        .select("cohort_id")
        .in("cohort_id", cohortIds)
        .eq("is_active", true);

      const memberCounts = (membersData || []).reduce((acc, m) => {
        acc[m.cohort_id] = (acc[m.cohort_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setCohorts((cohortsData || []).map(c => ({
        ...c,
        member_count: memberCounts[c.id] || 0
      })));
    } catch (error) {
      console.error("Error loading cohorts:", error);
      toast.error("Failed to load cohorts");
    } finally {
      setLoading(false);
    }
  };

  const createCohort = async () => {
    if (!newCohort.name.trim()) {
      toast.error("Please enter a cohort name");
      return;
    }

    try {
      const { error } = await supabase
        .from("discipleship_cohorts")
        .insert({
          church_id: churchId,
          name: newCohort.name,
          description: newCohort.description || null,
          meeting_day: newCohort.meeting_day || null,
          meeting_time: newCohort.meeting_time || null,
          meeting_location: newCohort.meeting_location || null,
          is_online: newCohort.is_online,
          max_members: newCohort.max_members,
          leader_id: user?.id,
          status: "forming"
        });

      if (error) throw error;

      toast.success("Cohort created successfully!");
      setShowCreateDialog(false);
      setNewCohort({
        name: "",
        description: "",
        meeting_day: "",
        meeting_time: "",
        meeting_location: "",
        is_online: false,
        max_members: 12
      });
      loadCohorts();
    } catch (error) {
      console.error("Error creating cohort:", error);
      toast.error("Failed to create cohort");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "forming": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "completed": return "bg-muted text-muted-foreground";
      case "paused": return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSanctuaryWeekLabel = (week: number) => {
    const labels: Record<number, string> = {
      1: "The Gate",
      2: "The Altar",
      3: "The Laver",
      4: "Holy Place Overview",
      5: "The Lampstand",
      6: "Table of Shewbread",
      7: "Altar of Incense",
      8: "The Veil",
      9: "Most Holy Place",
      10: "Three Angels' Messages",
      11: "Evangelism",
      12: "Consecration"
    };
    return labels[week] || `Week ${week}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Discipleship Cohorts</h3>
          <p className="text-sm text-muted-foreground">
            Manage your 12-week sanctuary-based discipleship groups
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Cohort
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Cohort</DialogTitle>
              <DialogDescription>
                Start a new 12-week sanctuary discipleship journey
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Cohort Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fall 2024 Disciples"
                  value={newCohort.name}
                  onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of this cohort..."
                  value={newCohort.description}
                  onChange={(e) => setNewCohort({ ...newCohort, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day">Meeting Day</Label>
                  <Select
                    value={newCohort.meeting_day}
                    onValueChange={(v) => setNewCohort({ ...newCohort, meeting_day: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <SelectItem key={day} value={day.toLowerCase()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Meeting Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newCohort.meeting_time}
                    onChange={(e) => setNewCohort({ ...newCohort, meeting_time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Meeting Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Fellowship Hall"
                  value={newCohort.meeting_location}
                  onChange={(e) => setNewCohort({ ...newCohort, meeting_location: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="online"
                  checked={newCohort.is_online}
                  onChange={(e) => setNewCohort({ ...newCohort, is_online: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="online">This is an online cohort</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createCohort}>Create Cohort</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} variant="glass" className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted/50 rounded w-3/4" />
                <div className="h-3 bg-muted/50 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted/50 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cohorts.length === 0 ? (
        <Card variant="glass" className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Cohorts Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start your first discipleship cohort and begin the 12-week sanctuary journey
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Cohort
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cohorts.map(cohort => (
            <Card key={cohort.id} variant="glass" className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{cohort.name}</CardTitle>
                    <CardDescription>
                      Week {cohort.current_week}: {getSanctuaryWeekLabel(cohort.current_week)}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Cohort
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Members
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Cohort
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(cohort.status)}>
                    {cohort.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {cohort.member_count}/{cohort.max_members} members
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round((cohort.current_week / 12) * 100)}%</span>
                  </div>
                  <Progress value={(cohort.current_week / 12) * 100} className="h-2" />
                </div>

                {/* Meeting Info */}
                <div className="space-y-2 text-sm">
                  {cohort.meeting_day && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">
                        {cohort.meeting_day}s at {cohort.meeting_time || "TBD"}
                      </span>
                    </div>
                  )}
                  {cohort.is_online ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video className="h-4 w-4" />
                      <span>Online Meeting</span>
                    </div>
                  ) : cohort.meeting_location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{cohort.meeting_location}</span>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
