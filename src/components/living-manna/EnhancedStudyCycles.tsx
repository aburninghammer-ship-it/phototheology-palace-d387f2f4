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
  BookOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  Play, 
  ChevronRight,
  ArrowLeft,
  Flame,
  Target,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { LIVING_MANNA_CYCLES, StudyCycle, CycleWeek } from "@/data/livingMannaCycles";

interface EnhancedStudyCyclesProps {
  churchId: string;
}

const SANCTUARY_COLORS: Record<string, string> = {
  "Outer Court": "bg-amber-500",
  "Laver": "bg-blue-500",
  "Candlestick": "bg-yellow-500",
  "Table of Showbread": "bg-orange-500",
  "Altar of Incense": "bg-purple-500",
  "Ark of the Covenant": "bg-indigo-500",
  "Most Holy Place": "bg-red-500",
  "Full Sanctuary": "bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500",
};

export function EnhancedStudyCycles({ churchId }: EnhancedStudyCyclesProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCycle, setSelectedCycle] = useState<StudyCycle | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<CycleWeek | null>(null);

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ["cycle-enrollments", user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("cycle_enrollments")
        .select("*")
        .eq("user_id", user?.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const enrollMutation = useMutation({
    mutationFn: async (cycleId: string) => {
      // First check if there's an existing enrollment for this cycle
      const { data: existingEnrollments } = await (supabase as any)
        .from("cycle_enrollments")
        .select("id")
        .eq("user_id", user?.id)
        .eq("cycle_id", cycleId);
      
      if (existingEnrollments && existingEnrollments.length > 0) {
        throw new Error("Already enrolled in this cycle");
      }

      const { error } = await (supabase as any).from("cycle_enrollments").insert({
        user_id: user?.id,
        cycle_id: cycleId,
        status: "active",
        current_week: 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycle-enrollments"] });
      toast.success("Enrolled in study cycle!");
    },
    onError: (error: any) => {
      if (error.message === "Already enrolled in this cycle") {
        toast.info("You're already enrolled in this cycle");
      } else {
        toast.error("Failed to enroll");
      }
    },
  });

  const progressMutation = useMutation({
    mutationFn: async ({ cycleId, weekNumber }: { cycleId: string; weekNumber: number }) => {
      const nextWeek = Math.min(weekNumber + 1, 6);
      const { error } = await (supabase as any)
        .from("cycle_enrollments")
        .update({ 
          current_week: nextWeek,
          status: nextWeek > 6 ? 'completed' : 'active'
        })
        .eq("user_id", user?.id)
        .eq("cycle_id", cycleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cycle-enrollments"] });
      toast.success("Week completed!");
      setSelectedWeek(null);
    },
  });

  const getEnrollment = (cycleId: string) => 
    enrollments?.find((e: any) => e.cycle_id === cycleId);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Clock className="animate-spin" /></div>;
  }

  // Week Detail View
  if (selectedCycle && selectedWeek) {
    const enrollment = getEnrollment(selectedCycle.id);
    const canComplete = enrollment && enrollment.current_week === selectedWeek.weekNumber;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedWeek(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {selectedCycle.title}
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline">Week {selectedWeek.weekNumber}</Badge>
              <Badge className="bg-primary/20 text-primary">
                {selectedCycle.sanctuaryFocus}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{selectedWeek.title}</CardTitle>
            <CardDescription className="text-base">{selectedWeek.theme}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scripture Focus */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Scripture Focus
              </h4>
              <p className="text-foreground font-medium">{selectedWeek.scriptureFocus}</p>
            </div>

            {/* Outcome */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                Spiritual Outcome
              </h4>
              <p className="text-muted-foreground">{selectedWeek.outcome}</p>
            </div>

            {/* Discussion Questions */}
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4" />
                Discussion Questions
              </h4>
              <ol className="space-y-3">
                {selectedWeek.discussionQuestions.map((question, idx) => (
                  <li key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                    <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
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

            {/* Action Button */}
            {canComplete && (
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => progressMutation.mutate({ 
                  cycleId: selectedCycle.id, 
                  weekNumber: selectedWeek.weekNumber 
                })}>
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

  // Cycle Detail View
  if (selectedCycle) {
    const enrollment = getEnrollment(selectedCycle.id);
    const currentWeek = enrollment?.current_week || 0;
    const isEnrolled = !!enrollment;

    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => setSelectedCycle(null)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Cycles
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${SANCTUARY_COLORS[selectedCycle.sanctuaryFocus] || 'bg-primary'} text-white`}>
                {selectedCycle.sanctuaryFocus}
              </Badge>
              <Badge variant="outline">Cycle {selectedCycle.sequenceNumber}</Badge>
            </div>
            <CardTitle className="text-2xl">{selectedCycle.title}</CardTitle>
            <CardDescription className="text-base">{selectedCycle.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2">Goal</h4>
              <p className="text-muted-foreground">{selectedCycle.goal}</p>
            </div>

            {/* Progress (if enrolled) */}
            {isEnrolled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Week {currentWeek} of 6</span>
                  <span>{Math.round((currentWeek / 6) * 100)}% Complete</span>
                </div>
                <Progress value={(currentWeek / 6) * 100} />
              </div>
            )}

            {/* Weeks List */}
            <div className="space-y-3">
              <h4 className="font-semibold">Weekly Studies</h4>
              {selectedCycle.weeks.map((week) => {
                const isCompleted = currentWeek > week.weekNumber;
                const isCurrent = currentWeek === week.weekNumber;
                const isLocked = !isEnrolled || currentWeek < week.weekNumber;

                return (
                  <Card 
                    key={week.weekNumber}
                    className={`cursor-pointer transition-all ${
                      isCurrent ? 'ring-2 ring-primary' :
                      isCompleted ? 'bg-green-500/5 border-green-500/30' :
                      isLocked ? 'opacity-60' : ''
                    }`}
                    onClick={() => !isLocked && setSelectedWeek(week)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' :
                          isCurrent ? 'bg-primary' :
                          'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-white font-bold">{week.weekNumber}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{week.title}</h3>
                          <p className="text-sm text-muted-foreground">{week.scriptureFocus}</p>
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

            {/* Enroll Button */}
            {!isEnrolled && (
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => enrollMutation.mutate(selectedCycle.id)}
                disabled={enrollMutation.isPending}
              >
                <Users className="h-5 w-5 mr-2" />
                Join This Cycle
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Cycles Grid
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            6-Week Study Cycles
          </h2>
          <p className="text-muted-foreground">
            12 sanctuary-centered cycles for deep discipleship
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Cycles</TabsTrigger>
          <TabsTrigger value="enrolled">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {LIVING_MANNA_CYCLES.map((cycle) => {
                const enrollment = getEnrollment(cycle.id);
                const isEnrolled = !!enrollment;
                const progress = enrollment ? (enrollment.current_week / 6) * 100 : 0;

                return (
                  <Card 
                    key={cycle.id}
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedCycle(cycle)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${SANCTUARY_COLORS[cycle.sanctuaryFocus] || 'bg-primary'} text-white text-xs`}>
                          {cycle.sanctuaryFocus}
                        </Badge>
                        {isEnrolled && (
                          <Badge variant="outline" className="text-xs">Enrolled</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-1">{cycle.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{cycle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          6 Weeks
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          Cycle {cycle.sequenceNumber}
                        </span>
                      </div>

                      {isEnrolled ? (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Week {enrollment.current_week} of 6
                          </p>
                        </div>
                      ) : (
                        <Button variant="outline" className="w-full" size="sm">
                          View Cycle
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="enrolled" className="space-y-4">
          {enrollments?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't joined any cycles yet</p>
                <Button variant="outline">Browse Cycles</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments?.map((enrollment: any) => {
                const cycle = LIVING_MANNA_CYCLES.find(c => c.id === enrollment.cycle_id);
                if (!cycle) return null;

                return (
                  <Card 
                    key={enrollment.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedCycle(cycle)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-12 rounded-full ${SANCTUARY_COLORS[cycle.sanctuaryFocus] || 'bg-primary'}`} />
                        <div>
                          <h3 className="font-semibold">{cycle.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Week {enrollment.current_week} of 6 • {cycle.sanctuaryFocus}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress value={(enrollment.current_week / 6) * 100} className="w-24" />
                        <Button size="sm">
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
