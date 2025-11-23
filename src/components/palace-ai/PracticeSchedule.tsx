import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePalaceAI } from "@/hooks/usePalaceAI";
import { Calendar, Target, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export const PracticeSchedule = () => {
  const { schedules, schedulesLoading, createSchedule, isCreatingSchedule } = usePalaceAI();

  const handleCreateSchedule = () => {
    // For now, create a basic schedule with common rooms
    createSchedule({ focusRooms: ["SR", "CR", "OR"], duration: "weekly" });
  };

  return (
    <div className="space-y-6">
      {schedulesLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading your schedules...</p>
          </CardContent>
        </Card>
      ) : schedules && schedules.length > 0 ? (
        schedules.map((schedule) => (
          <Card key={schedule.id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {schedule.schedule_name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {format(new Date(schedule.start_date), "MMM d")} - {schedule.end_date ? format(new Date(schedule.end_date), "MMM d, yyyy") : "Ongoing"}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {schedule.schedule_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion</span>
                  <span className="font-semibold">{Math.round(schedule.completion_rate * 100)}%</span>
                </div>
                <Progress value={schedule.completion_rate * 100} />
              </div>

              {/* Focus Rooms */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  Focus Rooms:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {schedule.focus_rooms.map((room, idx) => (
                    <Badge key={idx} variant="outline">{room}</Badge>
                  ))}
                </div>
              </div>

              {/* Daily Goals */}
              {schedule.daily_goals && (
                <div>
                  <p className="text-sm font-medium mb-2">Daily Goals:</p>
                  <div className="space-y-2">
                    {Object.entries(schedule.daily_goals as Record<string, any>).slice(0, 3).map(([key, goal]) => (
                      <div key={key} className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{goal.day || key}</p>
                          <p className="text-xs text-muted-foreground">{goal.focus}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {goal.drills} drills
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {goal.time_minutes}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progression */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Difficulty: <span className="font-medium capitalize">{schedule.difficulty_progression}</span>
                </p>
                {schedule.adjusts_to_progress && (
                  <Badge variant="outline" className="ml-auto">Auto-adjusts</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold mb-2">No Practice Schedule</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Let AI create a personalized practice schedule based on your learning profile
            </p>
            <Button
              onClick={handleCreateSchedule}
              disabled={isCreatingSchedule}
              size="lg"
              className="gap-2"
            >
              <Calendar className="h-4 w-4" />
              {isCreatingSchedule ? "Creating..." : "Create Schedule"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};