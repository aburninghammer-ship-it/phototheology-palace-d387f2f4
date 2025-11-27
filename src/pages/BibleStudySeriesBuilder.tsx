import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, FileText, Loader2, Edit, Presentation, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SeriesWizard } from "@/components/series-builder/SeriesWizard";
import { SeriesTemplateList } from "@/components/series-builder/SeriesTemplateList";
import { SeriesList } from "@/components/series-builder/SeriesList";
import { SeriesOnboarding } from "@/components/series-builder/SeriesOnboarding";
import { SeriesProgressTracker } from "@/components/series-builder/SeriesProgressTracker";
import { SeriesShareDialog } from "@/components/series-builder/SeriesShareDialog";

const BibleStudySeriesBuilder = () => {
  const { user } = useAuth();
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [userSeries, setUserSeries] = useState<any[]>([]);
  const [enrolledSeries, setEnrolledSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUserSeries();
      loadEnrolledSeries();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (seriesId) {
      loadSeriesDetail(seriesId);
    } else {
      setSelectedSeries(null);
      setLessons([]);
    }
  }, [seriesId]);

  const loadUserSeries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_template', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setUserSeries(data || []);
    } catch (error: any) {
      console.error('Error loading series:', error);
      toast.error('Failed to load your series');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledSeries = async () => {
    if (!user) return;

    try {
      const { data: enrollments } = await supabase
        .from('bible_study_series_enrollments')
        .select('series_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!enrollments?.length) return;

      const seriesIds = enrollments.map(e => e.series_id);
      const { data: series } = await supabase
        .from('bible_study_series')
        .select('*')
        .in('id', seriesIds)
        .neq('user_id', user.id);

      setEnrolledSeries(series || []);
    } catch (error) {
      console.error('Error loading enrolled series:', error);
    }
  };

  const loadSeriesDetail = async (id: string) => {
    try {
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('id', id)
        .single();

      if (seriesError) throw seriesError;
      setSelectedSeries(seriesData);

      const { data: lessonData, error: lessonError } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', id)
        .order('lesson_number');

      if (lessonError) throw lessonError;
      setLessons(lessonData || []);
    } catch (error) {
      console.error('Error loading series detail:', error);
      toast.error('Failed to load series');
    }
  };

  if (showWizard) {
    return (
      <SeriesWizard 
        onComplete={() => {
          setShowWizard(false);
          loadUserSeries();
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  if (showTemplates) {
    return (
      <SeriesTemplateList 
        onSelect={(template) => {
          setShowTemplates(false);
        }}
        onBack={() => setShowTemplates(false)}
      />
    );
  }

  // Series Detail View
  if (selectedSeries) {
    const isOwner = selectedSeries.user_id === user?.id;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/bible-study-series')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Series
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">{selectedSeries.title}</h1>
                <p className="text-muted-foreground mt-1">{selectedSeries.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge>{selectedSeries.lesson_count} lessons</Badge>
                  <Badge variant="outline">{selectedSeries.audience_type}</Badge>
                  <Badge variant="outline">{selectedSeries.context}</Badge>
                  <Badge variant={selectedSeries.status === 'published' ? 'default' : 'secondary'}>
                    {selectedSeries.status}
                  </Badge>
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <SeriesShareDialog
                    seriesId={selectedSeries.id}
                    seriesTitle={selectedSeries.title}
                    isPublic={selectedSeries.is_public}
                    shareToken={selectedSeries.share_token}
                    onUpdate={() => loadSeriesDetail(selectedSeries.id)}
                  />
                  <Button onClick={() => navigate(`/series/${selectedSeries.id}/present`)}>
                    <Presentation className="h-4 w-4 mr-2" />
                    Present
                  </Button>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lessons List */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-bold">Lessons</h2>
                {lessons.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No lessons yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson) => (
                      <Card key={lesson.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Lesson {lesson.lesson_number}
                                </Badge>
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              {lesson.big_idea && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                  {lesson.big_idea}
                                </p>
                              )}
                              {lesson.key_passages && (
                                <p className="text-xs text-primary mt-1">{lesson.key_passages}</p>
                              )}
                            </div>
                            {isOwner && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/series/${selectedSeries.id}/lesson/${lesson.lesson_number}`)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Progress Sidebar */}
              <div className="space-y-4">
                <SeriesProgressTracker
                  seriesId={selectedSeries.id}
                  lessonCount={selectedSeries.lesson_count}
                  onLessonSelect={(num) => {
                    if (isOwner) {
                      navigate(`/series/${selectedSeries.id}/lesson/${num}`);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Build a Bible Study Series with the Palace
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create ready-to-teach studies that walk people through Scripture visually—floor by floor, room by room.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userSeries.length === 0 && enrolledSeries.length === 0 ? (
            <SeriesOnboarding
              onCreateNew={() => setShowWizard(true)}
              onStartFromTemplate={() => setShowTemplates(true)}
              onBrowsePublic={() => navigate('/bible-study-series/discover')}
            />
          ) : (
            <>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowWizard(true)}
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create New Series
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="gap-2"
                >
                  <FileText className="h-5 w-5" />
                  Start from a Template
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/bible-study-series/discover')}
                  className="gap-2"
                >
                  <BookOpen className="h-5 w-5" />
                  Discover Public Series
                </Button>
              </div>

              {/* User's Series */}
              {userSeries.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Your Series</h2>
                  <SeriesList series={userSeries} onUpdate={loadUserSeries} />
                </div>
              )}

              {/* Enrolled Series */}
              {enrolledSeries.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Enrolled Series</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {enrolledSeries.map((s) => (
                      <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/series/${s.id}`)}>
                        <CardHeader>
                          <CardTitle className="text-lg">{s.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-2">
                            <Badge variant="outline">{s.lesson_count} lessons</Badge>
                            <Badge variant="secondary">Enrolled</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibleStudySeriesBuilder;
