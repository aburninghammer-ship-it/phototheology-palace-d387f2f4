import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Trash2, Loader2, BookOpen, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SermonTitle {
  id: string;
  title: string;
  description: string | null;
  scripture_references: string[] | null;
  tags: string[] | null;
  is_ai_generated: boolean;
  created_at: string;
}

export const SermonTitlesList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [titles, setTitles] = useState<SermonTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newReferences, setNewReferences] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTitles();
    }
  }, [user]);

  const fetchTitles = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("sermon_titles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load sermon titles",
        variant: "destructive",
      });
    } else {
      setTitles(data || []);
    }
    setLoading(false);
  };

  const generateAITitles = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon_titles",
          user_id: user.id,
        },
      });

      if (error) throw error;

      if (data.titles && Array.isArray(data.titles)) {
        // Insert the AI-generated titles
        const titlesToInsert = data.titles.map((item: any) => ({
          user_id: user.id,
          title: item.title,
          description: item.description || null,
          scripture_references: item.scripture_references || null,
          tags: item.tags || null,
          is_ai_generated: true,
        }));

        const { error: insertError } = await supabase
          .from("sermon_titles")
          .insert(titlesToInsert);

        if (insertError) throw insertError;

        toast({
          title: "Success!",
          description: `Generated ${data.titles.length} sermon title ideas`,
        });

        fetchTitles();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate titles",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    setSubmitting(true);
    const references = newReferences
      .split(",")
      .map(ref => ref.trim())
      .filter(ref => ref.length > 0);

    const { error } = await supabase.from("sermon_titles").insert({
      user_id: user.id,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      scripture_references: references.length > 0 ? references : null,
      is_ai_generated: false,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save sermon title",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Sermon title saved!",
      });
      setNewTitle("");
      setNewDescription("");
      setNewReferences("");
      setShowForm(false);
      fetchTitles();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("sermon_titles")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete sermon title",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Sermon title deleted",
      });
      fetchTitles();
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sermon Title Bank
          </CardTitle>
          <CardDescription>
            Sign in to save and generate sermon title ideas
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Sermon Title Bank
            </CardTitle>
            <CardDescription>
              Save and generate compelling sermon titles for future messages
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={generateAITitles}
              disabled={generating}
              size="sm"
              variant="outline"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggest
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
              variant={showForm ? "ghost" : "default"}
            >
              {showForm ? (
                <X className="h-4 w-4" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Title
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Sermon title..."
                required
              />
            </div>
            <div>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description or key idea (optional)"
                rows={2}
              />
            </div>
            <div>
              <Input
                value={newReferences}
                onChange={(e) => setNewReferences(e.target.value)}
                placeholder="Scripture references (comma separated, e.g. John 3:16, Romans 8:28)"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Title"
              )}
            </Button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : titles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No sermon titles saved yet</p>
            <p className="text-sm">Click "AI Suggest" or "Add Title" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {titles.map((title) => (
              <div
                key={title.id}
                className="p-4 bg-card border rounded-lg space-y-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg line-clamp-2">{title.title}</h4>
                    {title.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {title.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(title.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {title.is_ai_generated && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                  {title.scripture_references && title.scripture_references.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {title.scripture_references.map((ref, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {title.tags && title.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {title.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
