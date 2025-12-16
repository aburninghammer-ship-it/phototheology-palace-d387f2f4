import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  User, UserCheck, Crown, GraduationCap, 
  ArrowRight, ChevronRight, Calendar, Target 
} from "lucide-react";
import { format } from "date-fns";

interface MemberPathwayViewProps {
  churchId: string;
}

interface PathwayMember {
  id: string;
  user_id: string;
  current_level: string;
  guest_started_at: string | null;
  disciple_started_at: string | null;
  leader_started_at: string | null;
  trainer_started_at: string | null;
  programs_completed: number;
  cycles_completed: number;
  people_discipled: number;
  baptism_date: string | null;
  profile?: {
    display_name: string;
    avatar_url: string;
  };
}

const PATHWAY_LEVELS = [
  { id: "guest", label: "Guest", icon: User, color: "bg-blue-500", description: "New to the community" },
  { id: "disciple", label: "Disciple", icon: UserCheck, color: "bg-green-500", description: "Completed 12-week program" },
  { id: "leader", label: "Leader", icon: Crown, color: "bg-purple-500", description: "Leading a cohort" },
  { id: "trainer", label: "Trainer", icon: GraduationCap, color: "bg-amber-500", description: "Training new leaders" }
];

export function MemberPathwayView({ churchId }: MemberPathwayViewProps) {
  const [members, setMembers] = useState<PathwayMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    guests: 0,
    disciples: 0,
    leaders: 0,
    trainers: 0
  });

  useEffect(() => {
    loadMembers();
  }, [churchId]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data: pathwayData, error } = await supabase
        .from("member_pathway_progress")
        .select("*")
        .eq("church_id", churchId);

      if (error) throw error;

      // Get profiles
      const userIds = pathwayData?.map(p => p.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
      }, {} as Record<string, any>);

      const membersWithProfiles = (pathwayData || []).map(m => ({
        ...m,
        profile: profileMap[m.user_id]
      }));

      setMembers(membersWithProfiles);

      // Calculate stats
      const levelCounts = membersWithProfiles.reduce((acc, m) => {
        acc[m.current_level] = (acc[m.current_level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStats({
        guests: levelCounts.guest || 0,
        disciples: levelCounts.disciple || 0,
        leaders: levelCounts.leader || 0,
        trainers: levelCounts.trainer || 0
      });
    } catch (error) {
      console.error("Error loading members:", error);
      toast.error("Failed to load pathway data");
    } finally {
      setLoading(false);
    }
  };

  const getLevelIndex = (level: string) => {
    return PATHWAY_LEVELS.findIndex(l => l.id === level);
  };

  const getProgressPercentage = (level: string) => {
    const index = getLevelIndex(level);
    return ((index + 1) / PATHWAY_LEVELS.length) * 100;
  };

  const PathwayFunnel = () => (
    <Card>
      <CardHeader>
        <CardTitle>Member Pathway Funnel</CardTitle>
        <CardDescription>
          Track progression from Guest → Disciple → Leader → Trainer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          {PATHWAY_LEVELS.map((level, index) => {
            const Icon = level.icon;
            const count = stats[level.id as keyof typeof stats];
            return (
              <div key={level.id} className="flex items-center">
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full ${level.color} flex items-center justify-center mb-2`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{level.label}s</div>
                  <div className="text-xs text-muted-foreground">{level.description}</div>
                </div>
                {index < PATHWAY_LEVELS.length - 1 && (
                  <ChevronRight className="h-6 w-6 text-muted-foreground mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const MemberCard = ({ member }: { member: PathwayMember }) => {
    const currentLevel = PATHWAY_LEVELS.find(l => l.id === member.current_level);
    const Icon = currentLevel?.icon || User;

    return (
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              {member.profile?.avatar_url ? (
                <img 
                  src={member.profile.avatar_url} 
                  alt="" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <Icon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">
                  {member.profile?.display_name || "Unknown Member"}
                </span>
                <Badge className={currentLevel?.color}>
                  {currentLevel?.label}
                </Badge>
              </div>
              <Progress value={getProgressPercentage(member.current_level)} className="h-2" />
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {member.programs_completed} programs
              </div>
              {member.baptism_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Baptized {format(new Date(member.baptism_date), "MMM yyyy")}
                </div>
              )}
            </div>
          </div>

          {/* Pathway Timeline */}
          <div className="mt-4 flex items-center justify-between">
            {PATHWAY_LEVELS.map((level, index) => {
              const isCompleted = getLevelIndex(member.current_level) >= index;
              const isCurrent = member.current_level === level.id;
              const LevelIcon = level.icon;
              const dateField = `${level.id}_started_at` as keyof PathwayMember;
              const startDate = member[dateField];

              return (
                <div key={level.id} className="flex items-center">
                  <div className="relative">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isCompleted ? level.color : "bg-muted"}
                      ${isCurrent ? "ring-2 ring-offset-2 ring-primary" : ""}
                    `}>
                      <LevelIcon className={`h-4 w-4 ${isCompleted ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    {startDate && (
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(new Date(startDate as string), "MMM yy")}
                      </div>
                    )}
                  </div>
                  {index < PATHWAY_LEVELS.length - 1 && (
                    <div className={`w-12 h-0.5 ${
                      getLevelIndex(member.current_level) > index ? level.color : "bg-muted"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardContent className="py-12">
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PathwayFunnel />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Member Progress</h3>
        {members.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Members Yet</h3>
              <p className="text-muted-foreground">
                Members will appear here as they join discipleship cohorts
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {members.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
