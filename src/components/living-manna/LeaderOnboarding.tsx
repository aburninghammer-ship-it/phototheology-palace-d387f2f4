import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, Clock, CheckCircle, Play, ChevronRight, 
  Award, BookOpen, Users, Heart, Target
} from "lucide-react";
import { toast } from "sonner";

interface LeaderOnboardingProps {
  churchId: string;
}

const WEEK_THEMES = [
  {
    week: 1,
    title: "Vision & Method",
    icon: Target,
    topics: [
      "Why Living Manna uses Phototheology",
      "Why text-first groups",
      "Role of leader vs app vs Scripture"
    ]
  },
  {
    week: 2,
    title: "How to Run a Group",
    icon: BookOpen,
    topics: [
      "Starting a session",
      "Using guided prompts",
      "Managing discussion flow",
      "Handling silence & dominance"
    ]
  },
  {
    week: 3,
    title: "Shepherding & Escalation",
    icon: Heart,
    topics: [
      "Identifying seekers vs members",
      "When to escalate to Bible worker",
      "Prayer care online",
      "Boundaries & safety"
    ]
  },
  {
    week: 4,
    title: "Evangelism Through Groups",
    icon: Users,
    topics: [
      "Inviting guests",
      "Hosting seekers without pressure",
      "Transitioning from curiosity to conviction"
    ]
  }
];

export function LeaderOnboarding({ churchId }: LeaderOnboardingProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentWeek, setCurrentWeek] = useState(1);

  const { data: myProgress, isLoading } = useQuery({
    queryKey: ["leader-onboarding-progress", user?.id, churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leader_onboarding_progress")
        .select("*")
        .eq("user_id", user?.id)
        .eq("church_id", churchId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && !!churchId,
  });

  const startTrainingMutation = useMutation({
    mutationFn: async () => {
      // First get or create track
      let { data: track } = await supabase
        .from("leader_onboarding_tracks")
        .select("id")
        .eq("church_id", churchId)
        .maybeSingle();

      if (!track) {
        const { data: newTrack, error: trackError } = await supabase
          .from("leader_onboarding_tracks")
          .insert([{
            church_id: churchId,
            title: "Leader Onboarding",
            week_content: WEEK_THEMES as any,
          }])
          .select()
          .single();
        if (trackError) throw trackError;
        track = newTrack;
      }

      const { error } = await supabase.from("leader_onboarding_progress").insert([{
        user_id: user?.id,
        track_id: track.id,
        church_id: churchId,
        current_week: 1,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leader-onboarding-progress"] });
      toast.success("Started leader onboarding!");
    },
    onError: () => toast.error("Failed to start training"),
  });

  const completeWeekMutation = useMutation({
    mutationFn: async (week: number) => {
      const completedWeeks = [...(myProgress?.completed_weeks || []), week];
      const nextWeek = week < 4 ? week + 1 : 4;
      const isComplete = completedWeeks.length >= 4;

      const { error } = await supabase
        .from("leader_onboarding_progress")
        .update({
          completed_weeks: completedWeeks,
          current_week: nextWeek,
          completed_at: isComplete ? new Date().toISOString() : null,
          is_certified: isComplete,
        })
        .eq("id", myProgress?.id);
      if (error) throw error;
    },
    onSuccess: (_, week) => {
      queryClient.invalidateQueries({ queryKey: ["leader-onboarding-progress"] });
      if (week >= 4) {
        toast.success("Congratulations! You are now a certified leader!");
      } else {
        toast.success(`Week ${week} completed!`);
      }
    },
    onError: () => toast.error("Failed to complete week"),
  });

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  const completedWeeks = myProgress?.completed_weeks || [];
  const progressPercent = (completedWeeks.length / 4) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Leader Onboarding Track
          </h2>
          <p className="text-muted-foreground">
            4-week training to become a certified small group leader
          </p>
        </div>
        {myProgress?.is_certified && (
          <Badge className="bg-green-500 text-white">
            <Award className="h-4 w-4 mr-1" />
            Certified Leader
          </Badge>
        )}
      </div>

      {!myProgress ? (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Begin Your Leadership Journey</CardTitle>
            <CardDescription>
              Leaders must complete this 4-week track before hosting groups.
              This protects doctrine and ensures quality discipleship.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {WEEK_THEMES.map((theme) => {
                const Icon = theme.icon;
                return (
                  <div key={theme.week} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Week {theme.week}: {theme.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {theme.topics.length} topics
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => startTrainingMutation.mutate()}
              disabled={startTrainingMutation.isPending}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Training
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedWeeks.length} of 4 weeks completed
                </span>
              </div>
              <Progress value={progressPercent} className="h-3" />
            </CardContent>
          </Card>

          {/* Weekly Modules */}
          <div className="grid gap-4">
            {WEEK_THEMES.map((theme) => {
              const Icon = theme.icon;
              const isCompleted = completedWeeks.includes(theme.week);
              const isCurrent = myProgress.current_week === theme.week;
              const isLocked = theme.week > myProgress.current_week && !isCompleted;

              return (
                <Card 
                  key={theme.week} 
                  className={`transition-all ${
                    isCompleted 
                      ? "border-green-500/30 bg-green-500/5" 
                      : isCurrent 
                        ? "border-primary/30 bg-primary/5" 
                        : isLocked 
                          ? "opacity-50" 
                          : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : isCurrent 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Icon className="h-6 w-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            Week {theme.week}: {theme.title}
                            {isCurrent && (
                              <Badge variant="secondary" className="text-xs">Current</Badge>
                            )}
                          </h3>
                          <ul className="mt-2 space-y-1">
                            {theme.topics.map((topic, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <ChevronRight className="h-3 w-3" />
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        {isCompleted ? (
                          <Badge className="bg-green-500 text-white">Completed</Badge>
                        ) : isCurrent ? (
                          <Button 
                            size="sm"
                            onClick={() => completeWeekMutation.mutate(theme.week)}
                            disabled={completeWeekMutation.isPending}
                          >
                            Mark Complete
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {myProgress.is_certified && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="flex items-center gap-4 p-6">
                <Award className="h-12 w-12 text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">Congratulations!</h3>
                  <p className="text-muted-foreground">
                    You are now a certified leader and can host small groups.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
