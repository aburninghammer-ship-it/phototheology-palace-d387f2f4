import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SeriesProgressTrackerProps {
  seriesId: string;
  lessonCount: number;
  onLessonSelect?: (lessonNumber: number) => void;
}

interface LessonProgress {
  lesson_id: string;
  lesson_number: number;
  completed_at: string;
}

export function SeriesProgressTracker({ seriesId, lessonCount, onLessonSelect }: SeriesProgressTrackerProps) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && seriesId) {
      loadProgress();
    }
  }, [user, seriesId]);

  const loadProgress = async () => {
    try {
      // Load lessons
      const { data: lessonData } = await supabase
        .from('bible_study_lessons')
        .select('id, lesson_number, title')
        .eq('series_id', seriesId)
        .order('lesson_number');

      setLessons(lessonData || []);

      // Load progress
      const { data: progressData } = await supabase
        .from('bible_study_series_progress')
        .select('lesson_id, completed_at')
        .eq('series_id', seriesId)
        .eq('user_id', user!.id);

      const progressWithNumbers = (progressData || []).map(p => {
        const lesson = lessonData?.find(l => l.id === p.lesson_id);
        return {
          ...p,
          lesson_number: lesson?.lesson_number || 0
        };
      });

      setProgress(progressWithNumbers);
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonComplete = async (lessonId: string, lessonNumber: number) => {
    if (!user) return;

    const isCompleted = progress.some(p => p.lesson_id === lessonId);

    try {
      if (isCompleted) {
        // Remove completion
        await supabase
          .from('bible_study_series_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);

        setProgress(progress.filter(p => p.lesson_id !== lessonId));
        toast.success('Lesson marked as incomplete');
      } else {
        // Add completion
        const { error } = await supabase
          .from('bible_study_series_progress')
          .insert({
            user_id: user.id,
            series_id: seriesId,
            lesson_id: lessonId
          });

        if (error) throw error;

        setProgress([...progress, {
          lesson_id: lessonId,
          lesson_number: lessonNumber,
          completed_at: new Date().toISOString()
        }]);
        toast.success('Lesson completed!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const completedCount = progress.length;
  const progressPercent = lessonCount > 0 ? (completedCount / lessonCount) * 100 : 0;

  return (
    <Card>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Your Progress</p>
            <p className="text-2xl font-bold">{completedCount} / {lessonCount}</p>
          </div>
          <Badge variant={progressPercent === 100 ? "default" : "secondary"}>
            {Math.round(progressPercent)}% Complete
          </Badge>
        </div>

        <Progress value={progressPercent} className="h-2" />

        <div className="space-y-2">
          {lessons.map((lesson) => {
            const isCompleted = progress.some(p => p.lesson_id === lesson.id);
            return (
              <div
                key={lesson.id}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => toggleLessonComplete(lesson.id, lesson.lesson_number)}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
                <button
                  className="flex-1 text-left text-sm hover:text-primary transition-colors"
                  onClick={() => onLessonSelect?.(lesson.lesson_number)}
                >
                  <span className={isCompleted ? "line-through text-muted-foreground" : ""}>
                    {lesson.lesson_number}. {lesson.title}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
