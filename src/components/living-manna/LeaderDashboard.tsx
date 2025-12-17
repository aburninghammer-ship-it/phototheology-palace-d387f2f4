import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, Calendar, AlertTriangle, TrendingUp, 
  CheckCircle, Clock, UserPlus, MessageSquare, BookOpen, Flame, Video, ExternalLink
} from "lucide-react";
import { CohortManagement } from "./CohortManagement";
import { AttendanceTracker } from "./AttendanceTracker";
import { EscalationPanel } from "./EscalationPanel";
import { MemberPathwayView } from "./MemberPathwayView";
import { SanctuaryJourneyDashboard } from "./sanctuary-journey";
import { SmallGroupsHub } from "./SmallGroupsHub";
import { StudyFeed } from "./StudyFeed";
import { SermonHub } from "./SermonHub";
import { CentralStudyAdmin } from "./admin/CentralStudyAdmin";
interface LeaderDashboardProps {
  churchId: string;
}

interface DashboardStats {
  totalCohorts: number;
  activeCohorts: number;
  totalMembers: number;
  avgAttendance: number;
  openEscalations: number;
  guestsThisMonth: number;
}

export function LeaderDashboard({ churchId }: LeaderDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCohorts: 0,
    activeCohorts: 0,
    totalMembers: 0,
    avgAttendance: 0,
    openEscalations: 0,
    guestsThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, [churchId]);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      // Load cohorts
      const { data: cohorts } = await supabase
        .from("discipleship_cohorts")
        .select("id, status")
        .eq("church_id", churchId);

      // Load cohort members
      const { data: members } = await supabase
        .from("cohort_members")
        .select("id, member_pathway, joined_at, cohort_id")
        .in("cohort_id", cohorts?.map(c => c.id) || []);

      // Load escalations
      const { data: escalations } = await supabase
        .from("leader_escalations")
        .select("id")
        .eq("church_id", churchId)
        .eq("status", "open");

      // Calculate stats
      const activeCohorts = cohorts?.filter(c => c.status === "active").length || 0;
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const guestsThisMonth = members?.filter(
        m => m.member_pathway === "guest" && new Date(m.joined_at) >= thisMonth
      ).length || 0;

      setStats({
        totalCohorts: cohorts?.length || 0,
        activeCohorts,
        totalMembers: members?.length || 0,
        avgAttendance: 85, // This would be calculated from actual attendance data
        openEscalations: escalations?.length || 0,
        guestsThisMonth
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description, 
    trend 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    description: string;
    trend?: "up" | "down" | "neutral";
  }) => (
    <Card variant="glass">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${
            trend === "up" ? "text-green-500" : 
            trend === "down" ? "text-red-500" : "text-muted-foreground"
          }`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${trend === "down" ? "rotate-180" : ""}`} />
            {trend === "up" ? "Improving" : trend === "down" ? "Needs attention" : "Stable"}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            Living Manna Online Church
          </h2>
          <p className="text-muted-foreground">
            Leader Dashboard — Manage discipleship, small groups, and member progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open('/living-manna', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Member View
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            New Cohort
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Cohorts"
          value={stats.activeCohorts}
          icon={Users}
          description={`${stats.totalCohorts} total cohorts`}
          trend="up"
        />
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={CheckCircle}
          description="Across all cohorts"
          trend="up"
        />
        <StatCard
          title="Avg Attendance"
          value={`${stats.avgAttendance}%`}
          icon={Calendar}
          description="Last 4 weeks"
          trend="neutral"
        />
        <StatCard
          title="Open Escalations"
          value={stats.openEscalations}
          icon={AlertTriangle}
          description="Require attention"
          trend={stats.openEscalations > 3 ? "down" : "neutral"}
        />
      </div>

      {/* Quick Actions */}
      {stats.openEscalations > 0 && (
        <Card variant="glass" className="border-amber-500/50">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">You have {stats.openEscalations} open escalation(s)</p>
                <p className="text-sm text-muted-foreground">
                  Review and respond to member concerns
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="small-groups" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="small-groups" className="gap-2">
            <Flame className="h-4 w-4" />
            Small Groups
          </TabsTrigger>
          <TabsTrigger value="studies" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Central Studies
          </TabsTrigger>
          <TabsTrigger value="sermons" className="gap-2">
            <Video className="h-4 w-4" />
            Sermons
          </TabsTrigger>
          <TabsTrigger value="sanctuary-journey">Sanctuary Journey</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="pathway">Member Pathway</TabsTrigger>
          <TabsTrigger value="escalations">
            Escalations
            {stats.openEscalations > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.openEscalations}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="small-groups">
          <SmallGroupsHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="studies">
          <CentralStudyAdmin churchId={churchId} />
        </TabsContent>

        <TabsContent value="sermons">
          <SermonHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="sanctuary-journey">
          <SanctuaryJourneyDashboard churchId={churchId} />
        </TabsContent>

        <TabsContent value="cohorts">
          <CohortManagement churchId={churchId} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceTracker churchId={churchId} />
        </TabsContent>

        <TabsContent value="pathway">
          <MemberPathwayView churchId={churchId} />
        </TabsContent>

        <TabsContent value="escalations">
          <EscalationPanel churchId={churchId} onUpdate={loadDashboardStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
