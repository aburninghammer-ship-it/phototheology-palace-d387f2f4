import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle, Clock, Users, Play, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface StudyCyclesProps {
  churchId: string;
}

const CYCLE_TYPES = {
  character: { label: "Character & Formation", color: "bg-blue-500" },
  bible_study: { label: "How to Study the Bible", color: "bg-green-500" },
  doctrine: { label: "Core Doctrine", color: "bg-purple-500" },
  prophecy: { label: "Prophecy Without Fear", color: "bg-amber-500" },
};

export function StudyCycles({ churchId }: StudyCyclesProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);

  const { data: cycles, isLoading } = useQuery<any[], Error>({
    queryKey: ["six-week-cycles", churchId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("six_week_cycles")
        .select("id, title, description, theme, cycle_type, week_content, is_active, created_at")
        .eq("church_id", churchId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!churchId,
  });

  const { data: myProgress } = useQuery<any[], Error>({
    queryKey: ["cycle-progress", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cycle_enrollments")
        .select("*, six_week_cycles(*)")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const enrollMutation = useMutation({
    mutationFn: async (cycleId: string) => {
      const { error } = await supabase.from("cycle_enrollments").insert({
        user_id: user?.id,
        cycle_id: cycleId,
        status: "active",
        current_week: 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycle-progress"] });
      toast.success("Enrolled in study cycle!");
    },
    onError: () => toast.error("Failed to enroll"),
  });

  const isEnrolled = (cycleId: string) => 
    myProgress?.some((p) => p.cycle_id === cycleId);

  const getProgress = (cycleId: string) => 
    myProgress?.find((p) => p.cycle_id === cycleId);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">6-Week Study Cycles</h2>
          <p className="text-muted-foreground">
            Structured cycles create momentum without burnout
          </p>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList>
          <TabsTrigger value="available">Available Cycles</TabsTrigger>
          <TabsTrigger value="my-progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {cycles?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No study cycles available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cycles?.map((cycle) => {
                const typeInfo = CYCLE_TYPES[cycle.cycle_type as keyof typeof CYCLE_TYPES] || CYCLE_TYPES.character;
                const enrolled = isEnrolled(cycle.id);
                const progress = getProgress(cycle.id);
                const weekContent = cycle.week_content as any[];

                return (
                  <Card key={cycle.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className={`${typeInfo.color} text-white mb-2`}>
                            {typeInfo.label}
                          </Badge>
                          <CardTitle>{cycle.title}</CardTitle>
                          <CardDescription>{cycle.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          6 Weeks
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {weekContent?.length || 6} Lessons
                        </span>
                      </div>

                      {enrolled && progress ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Week {progress.current_week} of 6</span>
                            <span>{Math.round((progress.current_week / 6) * 100)}%</span>
                          </div>
                          <Progress value={(progress.current_week / 6) * 100} />
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedCycle(cycle.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Study
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => enrollMutation.mutate(cycle.id)}
                          disabled={enrollMutation.isPending}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Join Cycle
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-progress" className="space-y-4">
          {myProgress?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't joined any cycles yet</p>
                <Button variant="link" onClick={() => {}}>
                  Browse available cycles
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myProgress?.map((progress) => {
                const cycle = progress.six_week_cycles as any;
                if (!cycle) return null;
                const typeInfo = CYCLE_TYPES[cycle.cycle_type as keyof typeof CYCLE_TYPES] || CYCLE_TYPES.character;

                return (
                  <Card key={progress.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${typeInfo.color}`} />
                        <div>
                          <h3 className="font-semibold">{cycle.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Week {progress.current_week} of 6
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress 
                          value={(progress.current_week / 6) * 100} 
                          className="w-24"
                        />
                        <Button size="sm" onClick={() => setSelectedCycle(cycle.id)}>
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
