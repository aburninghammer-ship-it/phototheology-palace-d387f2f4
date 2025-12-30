import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { SEO } from "@/components/SEO";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { QuickNotes } from "@/components/notes/QuickNotes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CloudOff, Info, BookOpen, StickyNote, Trash2, Edit3, ExternalLink } from "lucide-react";
import { useOfflineNotes } from "@/hooks/useOfflineNotes";
import { usePreservePage } from "@/hooks/usePreservePage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerseNote {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  content: string;
  created_at: string;
  updated_at: string;
}

const Notes = () => {
  const { preferences } = useUserPreferences();
  const { isOnline, notes } = useOfflineNotes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [verseNotes, setVerseNotes] = useState<VerseNote[]>([]);
  const [verseNotesLoading, setVerseNotesLoading] = useState(true);

  // Enable scroll position preservation for this page
  usePreservePage();

  // Fetch all verse notes
  useEffect(() => {
    const fetchVerseNotes = async () => {
      if (!user) {
        setVerseNotes([]);
        setVerseNotesLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("verse_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setVerseNotes(data || []);
      } catch (error) {
        console.error("Error fetching verse notes:", error);
      } finally {
        setVerseNotesLoading(false);
      }
    };

    fetchVerseNotes();
  }, [user]);

  const deleteVerseNote = async (noteId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("verse_notes")
        .delete()
        .eq("id", noteId)
        .eq("user_id", user.id);

      if (error) throw error;

      setVerseNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const goToVerse = (book: string, chapter: number, verse: number) => {
    navigate(`/bible?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`);
  };

  // Group notes by book
  const groupedNotes = verseNotes.reduce((acc, note) => {
    const key = note.book;
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {} as Record<string, VerseNote[]>);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="My Notes | Phototheology"
        description="Jot down thoughts, contemplations, and insights from your Bible study. Available offline."
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Notes</h1>
            <p className="text-muted-foreground">
              Capture your thoughts and contemplations
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Cloud className="h-4 w-4 text-green-500" />
                Online
              </>
            ) : (
              <>
                <CloudOff className="h-4 w-4" />
                Offline Mode
              </>
            )}
          </Badge>
        </div>

        {/* Tabs for Quick Notes and Bible Notes */}
        <Tabs defaultValue="quick" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Quick Notes
            </TabsTrigger>
            <TabsTrigger value="bible" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Bible Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-6">
            {/* Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Offline Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Your notes are saved locally and will sync when you're back online.
                      Write anytime, anywhere — even without internet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Notes Component */}
            <QuickNotes />
          </TabsContent>

          <TabsContent value="bible" className="space-y-6">
            {/* Info Card */}
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Bible Verse Notes</h3>
                    <p className="text-sm text-muted-foreground">
                      Notes you've added directly to Bible verses while reading.
                      Click on any note to go to that verse in the Bible reader.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!user ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Sign in to view your Bible verse notes</p>
                  <Button onClick={() => navigate("/auth")}>Sign In</Button>
                </CardContent>
              </Card>
            ) : verseNotesLoading ? (
              <div className="text-center py-12">Loading notes...</div>
            ) : verseNotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No Bible verse notes yet</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add notes to verses by clicking the sticky note icon next to any verse in the Bible reader.
                  </p>
                  <Button onClick={() => navigate("/bible")}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Go to Bible Reader
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedNotes).map(([bookName, bookNotes]) => (
                  <Card key={bookName}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {bookName}
                        <Badge variant="secondary" className="ml-auto">
                          {bookNotes.length} {bookNotes.length === 1 ? 'note' : 'notes'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {bookNotes
                        .sort((a, b) => a.chapter - b.chapter || a.verse - b.verse)
                        .map((note) => (
                          <div
                            key={note.id}
                            className="p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="outline"
                                    className="cursor-pointer hover:bg-primary/10"
                                    onClick={() => goToVerse(note.book, note.chapter, note.verse)}
                                  >
                                    {note.book} {note.chapter}:{note.verse}
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.updated_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => goToVerse(note.book, note.chapter, note.verse)}
                                  title="Go to verse"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                  onClick={() => deleteVerseNote(note.id)}
                                  title="Delete note"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Notes;
