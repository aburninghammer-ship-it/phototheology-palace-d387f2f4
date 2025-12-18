import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { callJeeves } from "@/lib/jeevesClient";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, Sparkles, Loader2, Save, Send, Calendar,
  ChevronRight, FileText, Users, Flame
} from "lucide-react";

interface SmallGroupStudyGeneratorProps {
  churchId: string;
  groupId?: string;
}

interface SmallGroup {
  id: string;
  name: string;
}

interface GeneratedStudy {
  title: string;
  key_passages: string[];
  discussion_questions: string[];
  christ_synthesis: string;
  action_challenge: string;
  full_content: string;
}

export function SmallGroupStudyGenerator({ churchId, groupId }: SmallGroupStudyGeneratorProps) {
  const { user } = useAuth();
  const [myGroups, setMyGroups] = useState<SmallGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>(groupId || "");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Study inputs
  const [studyTitle, setStudyTitle] = useState("");
  const [studyTheme, setStudyTheme] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [scheduledDate, setScheduledDate] = useState("");
  
  // Generated content
  const [generatedStudy, setGeneratedStudy] = useState<GeneratedStudy | null>(null);
  const [existingStudies, setExistingStudies] = useState<any[]>([]);

  useEffect(() => {
    loadMyGroups();
  }, [churchId, user]);

  useEffect(() => {
    if (selectedGroup) {
      loadExistingStudies();
    }
  }, [selectedGroup]);

  const loadMyGroups = async () => {
    if (!user) return;
    
    try {
      // Get groups where user is leader
      const { data: ledGroups } = await (supabase
        .from('small_groups' as any)
        .select('id, name')
        .eq('church_id', churchId)
        .eq('leader_id', user.id)
        .eq('is_active', true) as any);

      // Also check ministry_leaders table
      const { data: assignedGroups } = await (supabase
        .from('ministry_leaders' as any)
        .select('assigned_group_id, small_groups:assigned_group_id(id, name)')
        .eq('church_id', churchId)
        .eq('user_id', user.id)
        .eq('role', 'small_group_leader')
        .eq('is_active', true) as any);

      const allGroups = [
        ...(ledGroups || []),
        ...(assignedGroups || []).map((a: any) => a.small_groups).filter(Boolean)
      ];
      
      // Deduplicate
      const uniqueGroups = Array.from(new Map(allGroups.map((g: any) => [g.id, g])).values()) as SmallGroup[];
      setMyGroups(uniqueGroups);
      
      if (uniqueGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(uniqueGroups[0].id);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingStudies = async () => {
    try {
      const { data } = await (supabase
        .from('small_group_studies' as any)
        .select('*')
        .eq('group_id', selectedGroup)
        .order('week_number', { ascending: false })
        .limit(10) as any);
      
      setExistingStudies(data || []);
    } catch (error) {
      console.error('Error loading studies:', error);
    }
  };

  const handleGenerate = async () => {
    if (!studyTheme.trim()) {
      toast.error("Please enter a theme or topic for the study");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await callJeeves({
        mode: "small-group-study",
        message: `Generate a small group Bible study for the theme: "${studyTheme}"
        
Title suggestion: ${studyTitle || 'Generate an appropriate title'}

Create a study using the Phototheology Palace approach that is designed for small group discussion:

## FORMAT:
1. **Opening Ice Breaker** (1-2 questions to warm up the group)

2. **Key Scripture Passages** (3-5 passages that anchor the study)
   - Include the full text of each passage
   - Brief context for each

3. **Christ-Centered Discovery** (Concentration Room - CR)
   - How does this theme reveal Jesus Christ?
   - What does it teach us about His character?

4. **Palace Floor Exploration**
   - Story Room (SR): A vivid Bible story illustrating this truth
   - Investigation (OR): Key observations and definitions
   - Dimensions (DR): Literal, symbolic, personal, church-wide applications

5. **Discussion Questions** (6-8 questions for group dialogue)
   - Questions that probe depth, not just surface understanding
   - Questions that invite personal sharing
   - Questions that connect to daily life

6. **Sanctuary Connection** (Blue Room - BL)
   - How does this theme connect to the sanctuary?

7. **Action Challenge**
   - Practical application for the coming week

8. **Closing Prayer Points**
   - Suggested prayer themes based on the study

TONE: Conversational, warm, Christ-exalting. Designed for a facilitator, not a lecturer.`,
      }, "small-group-study");

      if (error) throw error;
      
      const result = data as { response?: string; content?: string } | undefined;
      const content = result?.response || result?.content || "";
      
      // Parse the generated content
      const passages = content.match(/\*\*Key Scripture.*?\*\*([\s\S]*?)(?=\*\*Christ|$)/i)?.[1]?.match(/[A-Z][a-z]+ \d+:\d+(?:-\d+)?/g) || [];
      const questions = content.match(/Discussion Questions[\s\S]*?(?=\*\*Sanctuary|Action|$)/i)?.[0]?.match(/(?:^|\n)\s*[-•\d.]+\s+(.+?)(?=\n|$)/gm) || [];
      const christSection = content.match(/Christ-Centered[\s\S]*?(?=\*\*Palace|Discussion|$)/i)?.[0] || "";
      const actionMatch = content.match(/Action Challenge[\s\S]*?(?=\*\*Closing|$)/i)?.[0] || "";
      
      setGeneratedStudy({
        title: studyTitle || `Study: ${studyTheme}`,
        key_passages: passages,
        discussion_questions: questions.map((q: string) => q.replace(/^[\s\-•\d.]+/, '').trim()).filter(Boolean),
        christ_synthesis: christSection,
        action_challenge: actionMatch,
        full_content: content
      });

      toast.success("Study generated! Review and save when ready.");
    } catch (error) {
      console.error('Error generating study:', error);
      toast.error("Failed to generate study. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!selectedGroup || !generatedStudy || !user) return;

    setSaving(true);
    try {
      const { error } = await (supabase
        .from('small_group_studies' as any)
        .insert({
          group_id: selectedGroup,
          church_id: churchId,
          created_by: user.id,
          title: generatedStudy.title,
          week_number: weekNumber,
          study_content: { full_content: generatedStudy.full_content },
          key_passages: generatedStudy.key_passages,
          discussion_questions: generatedStudy.discussion_questions,
          christ_synthesis: generatedStudy.christ_synthesis,
          action_challenge: generatedStudy.action_challenge,
          status: publish ? 'published' : 'draft',
          scheduled_for: scheduledDate || null
        }) as any);

      if (error) throw error;

      toast.success(publish ? "Study published!" : "Study saved as draft");
      setGeneratedStudy(null);
      setStudyTitle("");
      setStudyTheme("");
      loadExistingStudies();
    } catch (error: any) {
      console.error('Error saving study:', error);
      toast.error(error.message || "Failed to save study");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (myGroups.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Groups Assigned</h3>
          <p className="text-muted-foreground">
            You are not assigned as a leader to any small groups yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Generate Small Group Study
          </h2>
          <p className="text-muted-foreground">
            Create AI-powered Bible studies for your group using Phototheology
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          Jeeves-Powered
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card variant="glass" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Study Details</CardTitle>
            <CardDescription>Configure your study parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Group Selection */}
            <div className="space-y-2">
              <Label>Select Group</Label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full p-2 rounded-lg bg-background border border-border"
              >
                {myGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label>Study Title (optional)</Label>
              <Input
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                placeholder="Leave blank for auto-generated"
              />
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme / Topic *</Label>
              <Textarea
                value={studyTheme}
                onChange={(e) => setStudyTheme(e.target.value)}
                placeholder="e.g., 'Faith in times of uncertainty' or 'The Sabbath as rest for the soul'"
                rows={3}
              />
            </div>

            {/* Week Number */}
            <div className="space-y-2">
              <Label>Week Number</Label>
              <Input
                type="number"
                min={1}
                max={52}
                value={weekNumber}
                onChange={(e) => setWeekNumber(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Scheduled Date */}
            <div className="space-y-2">
              <Label>Scheduled For</Label>
              <Input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={generating || !studyTheme.trim()}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Study
                </>
              )}
            </Button>

            {/* Existing Studies */}
            {existingStudies.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-3">Recent Studies</h4>
                <div className="space-y-2">
                  {existingStudies.slice(0, 5).map((study: any) => (
                    <div 
                      key={study.id}
                      className="p-2 rounded-lg bg-background/50 border border-border/50 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{study.title}</span>
                        <Badge variant={study.status === 'published' ? 'default' : 'outline'} className="text-xs">
                          {study.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Week {study.week_number}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Generated Study</CardTitle>
            <CardDescription>Review and edit before publishing</CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedStudy && !generating && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-16 w-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Create</h3>
                <p className="text-muted-foreground max-w-md">
                  Enter a theme and click "Generate Study" to have Jeeves create a 
                  Phototheology-based Bible study for your small group.
                </p>
              </div>
            )}

            {generating && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Jeeves is crafting your study...</p>
              </div>
            )}

            {generatedStudy && !generating && (
              <div className="space-y-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="prose prose-sm prose-invert max-w-none">
                    <ReactMarkdown>{generatedStudy.full_content}</ReactMarkdown>
                  </div>
                </ScrollArea>

                {/* Save Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    onClick={() => handleSave(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button 
                    onClick={() => handleSave(true)} 
                    className="flex-1"
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publish to Group
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
