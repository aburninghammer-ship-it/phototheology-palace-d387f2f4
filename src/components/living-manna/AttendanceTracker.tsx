import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Calendar, Check, X, Clock, Save, Users } from "lucide-react";
import { format } from "date-fns";

interface AttendanceTrackerProps {
  churchId: string;
}

interface Member {
  id: string;
  user_id: string;
  member_pathway: string;
  profile?: {
    display_name: string;
    avatar_url: string;
  };
  attendance_status?: "present" | "absent" | "excused" | "late";
  participation_level?: string;
}

interface Cohort {
  id: string;
  name: string;
  current_week: number;
}

export function AttendanceTracker({ churchId }: AttendanceTrackerProps) {
  const { user } = useAuth();
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    loadCohorts();
  }, [churchId]);

  useEffect(() => {
    if (selectedCohort) {
      loadMembers(selectedCohort);
    }
  }, [selectedCohort]);

  const loadCohorts = async () => {
    try {
      const { data, error } = await supabase
        .from("discipleship_cohorts")
        .select("id, name, current_week")
        .eq("church_id", churchId)
        .eq("status", "active");

      if (error) throw error;
      setCohorts(data || []);
      if (data && data.length > 0) {
        setSelectedCohort(data[0].id);
      }
    } catch (error) {
      console.error("Error loading cohorts:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (cohortId: string) => {
    setLoading(true);
    try {
      // Get cohort members
      const { data: membersData, error: membersError } = await supabase
        .from("cohort_members")
        .select("id, user_id, member_pathway")
        .eq("cohort_id", cohortId)
        .eq("is_active", true);

      if (membersError) throw membersError;

      // Get profiles for members
      const userIds = membersData?.map(m => m.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      // Check for existing attendance today
      const { data: existingAttendance } = await supabase
        .from("cohort_attendance")
        .select("user_id, attendance_status, participation_level")
        .eq("cohort_id", cohortId)
        .eq("session_date", sessionDate);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, any>);

      const attendanceMap = (existingAttendance || []).reduce((acc, a) => {
        acc[a.user_id] = a;
        return acc;
      }, {} as Record<string, any>);

      setMembers((membersData || []).map(m => ({
        ...m,
        profile: profileMap[m.user_id],
        attendance_status: attendanceMap[m.user_id]?.attendance_status || "present",
        participation_level: attendanceMap[m.user_id]?.participation_level || "medium"
      })));
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const updateMemberAttendance = (memberId: string, field: string, value: any) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, [field]: value } : m
    ));
  };

  const saveAttendance = async () => {
    if (!selectedCohort) return;

    setSaving(true);
    try {
      const cohort = cohorts.find(c => c.id === selectedCohort);
      
      // Upsert attendance records
      for (const member of members) {
        const { error } = await supabase
          .from("cohort_attendance")
          .upsert({
            cohort_id: selectedCohort,
            user_id: member.user_id,
            session_date: sessionDate,
            week_number: cohort?.current_week || 1,
            attendance_status: member.attendance_status || "present",
            participation_level: member.participation_level || "medium",
            recorded_by: user?.id
          }, {
            onConflict: "cohort_id,user_id,session_date"
          });

        if (error) throw error;

        // Update member's last attendance if present
        if (member.attendance_status === "present" || member.attendance_status === "late") {
          await supabase
            .from("cohort_members")
            .update({ 
              last_attendance: new Date().toISOString()
            })
            .eq("id", member.id);
        }
      }

      toast.success("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-4 w-4 text-green-500" />;
      case "absent": return <X className="h-4 w-4 text-red-500" />;
      case "late": return <Clock className="h-4 w-4 text-amber-500" />;
      case "excused": return <Calendar className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getPathwayBadge = (pathway: string) => {
    const colors: Record<string, string> = {
      guest: "bg-blue-500",
      disciple: "bg-green-500",
      leader: "bg-purple-500",
      trainer: "bg-amber-500"
    };
    return <Badge className={colors[pathway] || "bg-gray-500"}>{pathway}</Badge>;
  };

  if (loading && !selectedCohort) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (cohorts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Active Cohorts</h3>
          <p className="text-muted-foreground">
            Create a cohort and add members to track attendance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedCohort} onValueChange={setSelectedCohort}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a cohort" />
            </SelectTrigger>
            <SelectContent>
              {cohorts.map(cohort => (
                <SelectItem key={cohort.id} value={cohort.id}>
                  {cohort.name} (Week {cohort.current_week})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(sessionDate), "MMMM d, yyyy")}
          </Badge>
        </div>
        <Button onClick={saveAttendance} disabled={saving || members.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance for {cohorts.find(c => c.id === selectedCohort)?.name}</CardTitle>
          <CardDescription>
            Mark attendance and participation levels for each member
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members in this cohort yet
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <div className="col-span-4">Member</div>
                <div className="col-span-2">Pathway</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Participation</div>
              </div>
              {members.map(member => (
                <div key={member.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b last:border-b-0">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {member.profile?.avatar_url ? (
                        <img 
                          src={member.profile.avatar_url} 
                          alt="" 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold">
                          {member.profile?.display_name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">
                      {member.profile?.display_name || "Unknown Member"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    {getPathwayBadge(member.member_pathway)}
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={member.attendance_status}
                      onValueChange={(v) => updateMemberAttendance(member.id, "attendance_status", v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          <span className="flex items-center gap-2">
                            {getStatusIcon(member.attendance_status || "present")}
                            <span className="capitalize">{member.attendance_status}</span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" /> Present
                          </span>
                        </SelectItem>
                        <SelectItem value="absent">
                          <span className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" /> Absent
                          </span>
                        </SelectItem>
                        <SelectItem value="late">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" /> Late
                          </span>
                        </SelectItem>
                        <SelectItem value="excused">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" /> Excused
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Select
                      value={member.participation_level || "medium"}
                      onValueChange={(v) => updateMemberAttendance(member.id, "participation_level", v)}
                      disabled={member.attendance_status === "absent"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
