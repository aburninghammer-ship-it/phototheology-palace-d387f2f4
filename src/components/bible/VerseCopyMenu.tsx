import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, FolderOpen, PenLine, FileText, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useOfflineNotes } from "@/hooks/useOfflineNotes";

interface VerseCopyMenuProps {
  reference: string;
  text: string;
  reason?: string;
  book?: string;
  chapter?: number;
  verse?: number;
  size?: "sm" | "default" | "icon";
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export function VerseCopyMenu({
  reference,
  text,
  reason,
  book,
  chapter,
  verse,
  size = "sm",
  variant = "ghost",
  className,
}: VerseCopyMenuProps) {
  const { user } = useAuth();
  const { addNote: addOfflineNote } = useOfflineNotes();
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studyTitle, setStudyTitle] = useState(`Verse Study: ${reference}`);
  const [studyNotes, setStudyNotes] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [tags, setTags] = useState<string[]>(["verse"]);
  const [newTag, setNewTag] = useState("");

  const formatVerseForCopy = (format: "plain" | "reference" | "full") => {
    switch (format) {
      case "plain":
        return text;
      case "reference":
        return `${reference} - "${text}"`;
      case "full":
        let formatted = `${reference}\n"${text}"`;
        if (reason) {
          formatted += `\n\nNote: ${reason}`;
        }
        return formatted;
      default:
        return text;
    }
  };

  const handleCopy = async (format: "plain" | "reference" | "full") => {
    try {
      const formatted = formatVerseForCopy(format);
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      toast.success("Verse copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy verse");
    }
  };

  const handleSaveToStudy = async () => {
    if (!user) {
      toast.error("Please sign in to save to My Studies");
      return;
    }

    setSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      let content = `# ${studyTitle}\n\n`;
      content += `**Date:** ${date}\n\n`;
      content += `---\n\n`;
      content += `## Scripture\n\n`;
      content += `> **${reference}**\n>\n`;
      content += `> "${text}"\n\n`;
      
      if (reason) {
        content += `## Theme Connection\n\n`;
        content += `${reason}\n\n`;
      }

      if (studyNotes.trim()) {
        content += `## My Notes\n\n`;
        content += `${studyNotes}\n\n`;
      }

      content += `---\n\n`;
      content += `## Reflection\n\n`;
      content += `- [ ] Meditate on this verse\n`;
      content += `- [ ] Find cross-references\n`;
      content += `- [ ] Apply to my life\n`;

      const { error } = await supabase
        .from("user_studies")
        .insert({
          user_id: user.id,
          title: studyTitle,
          content,
          tags,
        });

      if (error) throw error;

      toast.success("Saved to My Studies!");
      setSaveDialogOpen(false);
      setStudyTitle(`Verse Study: ${reference}`);
      setStudyNotes("");
    } catch (error) {
      console.error("Error saving to study:", error);
      toast.error("Failed to save to My Studies");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToNotes = () => {
    if (!noteContent.trim()) {
      toast.error("Please enter a note");
      return;
    }

    const noteWithVerse = `**${reference}**\n> "${text}"\n\n${noteContent}`;
    
    addOfflineNote(noteWithVerse, `Note on ${reference}`, ["verse", reference]);
    toast.success("Saved to Notes!");
    setNoteDialogOpen(false);
    setNoteContent("");
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size={size} 
            variant={variant} 
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={() => handleCopy("plain")}>
            <FileText className="h-4 w-4 mr-2" />
            Copy text only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopy("reference")}>
            <Copy className="h-4 w-4 mr-2" />
            Copy with reference
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCopy("full")}>
            <FileText className="h-4 w-4 mr-2" />
            Copy full (with notes)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSaveDialogOpen(true)}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Save to My Studies
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setNoteDialogOpen(true)}>
            <PenLine className="h-4 w-4 mr-2" />
            Add to Notes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Save to Study Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Save to My Studies
            </DialogTitle>
            <DialogDescription>
              Save this verse to your personal study collection
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">{reference}</p>
              <p className="text-sm italic">"{text}"</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-title">Study Title</Label>
              <Input
                id="study-title"
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                placeholder="Enter a title..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="study-notes">Your Notes (optional)</Label>
              <Textarea
                id="study-notes"
                value={studyNotes}
                onChange={(e) => setStudyNotes(e.target.value)}
                placeholder="Add your thoughts, observations, or applications..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="text-sm"
                />
                <Button size="sm" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveToStudy} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Save Study
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Notes Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              Add Note
            </DialogTitle>
            <DialogDescription>
              Save a quick note with this verse
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-1">{reference}</p>
              <p className="text-sm italic">"{text}"</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content">Your Note</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveToNotes} disabled={saving || !noteContent.trim()}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <PenLine className="h-4 w-4 mr-2" />
                  Save Note
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
