import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  Play, 
  ChevronRight,
  Target,
  Flame,
  Shield,
  Star,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";
import { DISCIPLE_TRAINING_WEEKS, TrainingWeek } from "@/data/discipleTrainingCurriculum";

interface DiscipleTrainingProps {
  churchId: string;
}

// Assign phases based on week number
const getPhase = (weekNumber: number): string => {
  if (weekNumber <= 3) return "foundation";
  if (weekNumber <= 6) return "formation";
  if (weekNumber <= 9) return "fire";
  return "frontline";
};

const PHASE_INFO = {
  foundation: { label: "Foundation", color: "bg-blue-500", icon: BookOpen },
  formation: { label: "Formation", color: "bg-purple-500", icon: Target },
  fire: { label: "Fire", color: "bg-orange-500", icon: Flame },
  frontline: { label: "Frontline", color: "bg-green-500", icon: Shield },
};

export function DiscipleTraining({ churchId }: DiscipleTrainingProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedWeek, setSelectedWeek] = useState<TrainingWeek | null>(null);

  const { data: enrollment, isLoading } = useQuery({
    queryKey: ["disciple-training-enrollment", user?.id, churchId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("disciple_training_enrollments")
        .select("*")
        .eq("user_id", user?.id)
        .eq("church_id", churchId)
        .maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id && !!churchId,
  });

  const enrollMutation = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any)
        .from("disciple_training_enrollments")
        .insert({
          user_id: user?.id,
          church_id: churchId,
          program_id: "disciple-training-12-week",
          status: "active",
          current_week: 1,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciple-training-enrollment"] });
      toast.success("Enrolled in Disciple Training!");
    },
    onError: () => toast.error("Failed to enroll"),
  });

  const progressMutation = useMutation({
    mutationFn: async (weekNumber: number) => {
      const nextWeek = Math.min(weekNumber + 1, 12);
      const { error } = await (supabase as any)
        .from("disciple_training_enrollments")
        .update({ 
          current_week: nextWeek,
          status: nextWeek > 12 ? 'completed' : 'active'
        })
        .eq("user_id", user?.id)
        .eq("church_id", churchId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciple-training-enrollment"] });
      toast.success("Progress saved!");
      setSelectedWeek(null);
    },
  });

  const currentWeek = enrollment?.current_week || 0;
  const progressPercentage = (currentWeek / 12) * 100;

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  // Week Detail View
  if (selectedWeek) {
    const weekPhase = getPhase(selectedWeek.weekNumber);
    const PhaseIcon = PHASE_INFO[weekPhase as keyof typeof PHASE_INFO]?.icon || BookOpen;
    const phaseInfo = PHASE_INFO[weekPhase as keyof typeof PHASE_INFO];

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedWeek(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${phaseInfo?.color} text-white`}>
                {phaseInfo?.label} Phase
              </Badge>
              <Badge variant="outline">Week {selectedWeek.weekNumber}</Badge>
            </div>
            <CardTitle className="text-2xl">{selectedWeek.title}</CardTitle>
            <CardDescription className="text-base">{selectedWeek.theme}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Truth */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-semibold mb-2">Key Truth</h4>
              <p className="text-foreground italic">{selectedWeek.keyTruth}</p>
            </div>

            {/* Sanctuary Focus & Goal */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  Sanctuary Focus
                </h4>
                <p className="text-sm text-muted-foreground">{selectedWeek.sanctuaryFocus}</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-primary" />
                  Goal
                </h4>
                <p className="text-sm text-muted-foreground">{selectedWeek.goal}</p>
              </div>
            </div>

            {/* Scripture Focus */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold mb-2">Scripture Focus</h4>
              <p className="text-foreground">{Array.isArray(selectedWeek.scriptureFocus) ? selectedWeek.scriptureFocus.join(', ') : selectedWeek.scriptureFocus}</p>
            </div>

            {/* Practices */}
            <div>
              <h4 className="font-semibold mb-3">Weekly Practices</h4>
              <ul className="space-y-2">
                {selectedWeek.practices.map((practice, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{practice}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discussion Questions */}
            <div>
              <h4 className="font-semibold mb-3">Discussion Questions</h4>
              <ol className="space-y-3">
                {selectedWeek.discussionQuestions.map((question, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-primary font-bold">{idx + 1}.</span>
                    <span className="text-sm">{question}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* PT Rooms */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">PT Rooms:</span>
              {selectedWeek.ptRooms.map((room) => (
                <Badge key={room} variant="secondary" className="text-xs">
                  {room}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            {enrollment && currentWeek === selectedWeek.weekNumber && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => progressMutation.mutate(selectedWeek.weekNumber)}>
                  Complete Week {selectedWeek.weekNumber}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not Enrolled View
  if (!enrollment) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">12-Week Disciple Training</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            A comprehensive training program to transform members into movement leaders.
            Four phases: Foundation → Formation → Fire → Frontline.
          </p>
          <Button size="lg" onClick={() => enrollMutation.mutate()} disabled={enrollMutation.isPending}>
            <Users className="h-5 w-5 mr-2" />
            Begin Training
          </Button>
        </div>

        {/* Curriculum Preview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(PHASE_INFO).map(([phase, info]) => {
            const PhaseIcon = info.icon;
            const phaseWeeks = DISCIPLE_TRAINING_WEEKS.filter(w => getPhase(w.weekNumber) === phase);
            return (
              <Card key={phase} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center mb-2`}>
                    <PhaseIcon className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{info.label}</CardTitle>
                  <CardDescription>Weeks {phaseWeeks[0]?.weekNumber}-{phaseWeeks[phaseWeeks.length - 1]?.weekNumber}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {phaseWeeks.map(week => (
                      <li key={week.weekNumber} className="truncate">• {week.title}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Enrolled Overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            12-Week Disciple Training
          </h2>
          <p className="text-muted-foreground">
            Your journey from member to movement leader
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Progress</p>
          <p className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</p>
        </div>
      </div>

      <Progress value={progressPercentage} className="h-3" />

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="phases">Phases Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {DISCIPLE_TRAINING_WEEKS.map((week) => {
                const weekPhase = getPhase(week.weekNumber);
                const phaseInfo = PHASE_INFO[weekPhase as keyof typeof PHASE_INFO];
                const PhaseIcon = phaseInfo?.icon || BookOpen;
                const isCompleted = currentWeek > week.weekNumber;
                const isCurrent = currentWeek === week.weekNumber;
                const isLocked = currentWeek < week.weekNumber;

                return (
                  <Card 
                    key={week.weekNumber}
                    className={`transition-all cursor-pointer ${
                      isCurrent ? 'ring-2 ring-primary border-primary' : 
                      isCompleted ? 'border-green-500/30 bg-green-500/5' :
                      isLocked ? 'opacity-60' : ''
                    }`}
                    onClick={() => !isLocked && setSelectedWeek(week)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : 
                          isCurrent ? phaseInfo?.color : 
                          'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-bold">{week.weekNumber}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {phaseInfo?.label}
                            </Badge>
                            {isCurrent && (
                              <Badge className="bg-primary text-xs">Current</Badge>
                            )}
                          </div>
                          <h3 className="font-semibold">{week.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{week.theme}</p>
                        </div>
                      </div>
                      {!isLocked && (
                        <Button variant="ghost" size="sm">
                          {isCurrent ? <Play className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="phases" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(PHASE_INFO).map(([phase, info]) => {
              const PhaseIcon = info.icon;
              const phaseWeeks = DISCIPLE_TRAINING_WEEKS.filter(w => getPhase(w.weekNumber) === phase);
              const completedInPhase = phaseWeeks.filter(w => currentWeek > w.weekNumber).length;
              const phaseProgress = (completedInPhase / phaseWeeks.length) * 100;

              return (
                <Card key={phase}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${info.color} flex items-center justify-center`}>
                        <PhaseIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{info.label} Phase</CardTitle>
                        <CardDescription>
                          {completedInPhase}/{phaseWeeks.length} weeks completed
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={phaseProgress} className="mb-4" />
                    <ul className="space-y-2">
                      {phaseWeeks.map(week => (
                        <li 
                          key={week.weekNumber} 
                          className={`flex items-center gap-2 text-sm ${
                            currentWeek > week.weekNumber ? 'text-green-600' : 
                            currentWeek === week.weekNumber ? 'text-primary font-medium' : 
                            'text-muted-foreground'
                          }`}
                        >
                          {currentWeek > week.weekNumber ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : currentWeek === week.weekNumber ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                          Week {week.weekNumber}: {week.title}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
