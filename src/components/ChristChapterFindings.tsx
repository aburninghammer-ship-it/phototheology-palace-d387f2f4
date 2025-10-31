import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Save } from "lucide-react";
import { BIBLE_BOOK_METADATA, getChapterCount } from "@/data/bibleBooks";

interface ChristFinding {
  id: string;
  book: string;
  chapter: number;
  christ_name: string;
  christ_action: string;
  crosslink_verses: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ChristChapterFindings() {
  const { user } = useAuth();
  const [findings, setFindings] = useState<ChristFinding[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [christName, setChristName] = useState("");
  const [christAction, setChristAction] = useState("");
  const [crosslinkVerses, setCrosslinkVerses] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchFindings();
    }
  }, [user]);

  const fetchFindings = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("christ_chapter_findings")
      .select("*")
      .eq("user_id", user.id)
      .order("book", { ascending: true })
      .order("chapter", { ascending: true });

    if (error) {
      toast.error("Failed to load findings");
      console.error(error);
    } else {
      setFindings(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!user || !selectedBook || !christName.trim() || !christAction.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const crosslinkArray = crosslinkVerses
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const findingData = {
      user_id: user.id,
      book: selectedBook,
      chapter: selectedChapter,
      christ_name: christName,
      christ_action: christAction,
      crosslink_verses: crosslinkArray,
      notes: notes.trim() || null,
    };

    if (editingId) {
      // Update existing
      const { error } = await supabase
        .from("christ_chapter_findings")
        .update(findingData)
        .eq("id", editingId);

      if (error) {
        toast.error("Failed to update finding");
        console.error(error);
      } else {
        toast.success("Finding updated!");
        resetForm();
        fetchFindings();
      }
    } else {
      // Insert new
      const { error } = await supabase
        .from("christ_chapter_findings")
        .insert(findingData);

      if (error) {
        if (error.code === "23505") {
          toast.error("You already have a finding for this chapter. Edit it instead.");
        } else {
          toast.error("Failed to save finding");
          console.error(error);
        }
      } else {
        toast.success("Finding saved!");
        resetForm();
        fetchFindings();
      }
    }
  };

  const handleEdit = (finding: ChristFinding) => {
    setEditingId(finding.id);
    setSelectedBook(finding.book);
    setSelectedChapter(finding.chapter);
    setChristName(finding.christ_name);
    setChristAction(finding.christ_action);
    setCrosslinkVerses(finding.crosslink_verses.join(", "));
    setNotes(finding.notes || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this finding?")) return;

    const { error } = await supabase
      .from("christ_chapter_findings")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete finding");
      console.error(error);
    } else {
      toast.success("Finding deleted");
      fetchFindings();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setSelectedBook("");
    setSelectedChapter(1);
    setChristName("");
    setChristAction("");
    setCrosslinkVerses("");
    setNotes("");
  };

  if (loading) {
    return <div className="text-center py-8">Loading your findings...</div>;
  }

  const maxChapters = selectedBook ? getChapterCount(selectedBook) || 1 : 1;
  const bookNames = BIBLE_BOOK_METADATA.map(b => b.name);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit" : "New"} Christ Finding</CardTitle>
          <CardDescription>
            Record how Christ appears in each chapter: His name/title, His action, and NT crosslinks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Book</label>
              <Select value={selectedBook} onValueChange={setSelectedBook}>
                <SelectTrigger>
                  <SelectValue placeholder="Select book" />
                </SelectTrigger>
                <SelectContent>
                  {bookNames.map((book) => (
                    <SelectItem key={book} value={book}>
                      {book}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Chapter</label>
              <Select
                value={selectedChapter.toString()}
                onValueChange={(v) => setSelectedChapter(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxChapters }, (_, i) => i + 1).map((ch) => (
                    <SelectItem key={ch} value={ch.toString()}>
                      Chapter {ch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Christ's Name/Title *</label>
            <Input
              placeholder="e.g., Passover Lamb, Good Shepherd, Suffering Servant"
              value={christName}
              onChange={(e) => setChristName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Christ's Action *</label>
            <Textarea
              placeholder="What does Christ do/accomplish in this chapter?"
              value={christAction}
              onChange={(e) => setChristAction(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">NT Crosslink Verses</label>
            <Input
              placeholder="e.g., John 1:29, 1 Cor 5:7 (comma-separated)"
              value={crosslinkVerses}
              onChange={(e) => setCrosslinkVerses(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
            <Textarea
              placeholder="Additional observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {editingId ? "Update" : "Save"} Finding
            </Button>
            {editingId && (
              <Button onClick={resetForm} variant="outline">
                Cancel Edit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Findings ({findings.length})</CardTitle>
          <CardDescription>
            Click a finding to edit it
          </CardDescription>
        </CardHeader>
        <CardContent>
          {findings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No findings yet. Start recording Christ in every chapter!
            </p>
          ) : (
            <div className="space-y-3">
              {findings.map((finding) => (
                <Card key={finding.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-4" onClick={() => handleEdit(finding)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {finding.book} {finding.chapter}
                        </h4>
                        <p className="text-sm text-primary font-medium mt-1">
                          {finding.christ_name}
                        </p>
                        <p className="text-sm mt-2">{finding.christ_action}</p>
                        {finding.crosslink_verses.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            <span className="font-medium">Crosslinks:</span>{" "}
                            {finding.crosslink_verses.join(", ")}
                          </p>
                        )}
                        {finding.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            {finding.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(finding.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}