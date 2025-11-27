import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import { seriesTemplates, SeriesTemplate } from "@/data/seriesTemplates";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SeriesTemplateListProps {
  onSelect: (template: any) => void;
  onBack: () => void;
}

export const SeriesTemplateList = ({ onSelect, onBack }: SeriesTemplateListProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [creating, setCreating] = useState<string | null>(null);

  const createSeriesFromTemplate = async (template: SeriesTemplate) => {
    if (!user) {
      toast.error('Please sign in to create a series');
      return;
    }

    setCreating(template.id);
    try {
      // Create the series
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .insert({
          user_id: user.id,
          title: template.title,
          description: template.description,
          audience_type: template.audienceType,
          context: template.context,
          primary_goal: template.primaryGoal,
          theme_subject: template.themeSubject,
          lesson_count: template.lessonCount,
          status: 'draft'
        })
        .select()
        .single();

      if (seriesError) throw seriesError;

      // Create all lessons
      const lessonInserts = template.lessons.map(lesson => ({
        series_id: seriesData.id,
        lesson_number: lesson.lessonNumber,
        title: lesson.title,
        big_idea: lesson.bigIdea,
        main_floors: lesson.mainFloors,
        key_rooms: lesson.keyRooms,
        key_passages: lesson.keyPassages,
        core_points: lesson.corePoints,
        palace_mapping_notes: lesson.palaceMappingNotes,
        christ_emphasis: lesson.christEmphasis,
        discussion_questions: lesson.discussionQuestions,
        palace_activity: lesson.palaceActivity,
        take_home_challenge: lesson.takeHomeChallenge
      }));

      const { error: lessonsError } = await supabase
        .from('bible_study_lessons')
        .insert(lessonInserts);

      if (lessonsError) throw lessonsError;

      toast.success('Series created from template!');
      navigate(`/series/${seriesData.id}`);
    } catch (error: any) {
      console.error('Error creating series from template:', error);
      toast.error('Failed to create series');
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Bible Study Series Templates</h1>
            <p className="text-xl text-muted-foreground">
              Choose a pre-built series to customize or use as inspiration
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {seriesTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{template.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </div>
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{template.lessonCount} lessons</Badge>
                    <Badge variant="outline">{template.audienceType}</Badge>
                    <Badge variant="outline">{template.context}</Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Series Goal:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.primaryGoal}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Lesson Titles:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.lessons.slice(0, 3).map((lesson, index) => (
                        <li key={index} className="truncate">
                          {lesson.lessonNumber}. {lesson.title}
                        </li>
                      ))}
                      {template.lessons.length > 3 && (
                        <li className="text-primary">
                          + {template.lessons.length - 3} more lessons
                        </li>
                      )}
                    </ul>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => createSeriesFromTemplate(template)}
                    disabled={creating === template.id}
                  >
                    {creating === template.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Use This Template'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                More templates coming soon! You can also create your own custom series from scratch.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
