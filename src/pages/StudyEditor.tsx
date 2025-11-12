import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Star,
  Tag,
  X,
  Loader2,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { JeevesStudyAssistant } from "@/components/studies/JeevesStudyAssistant";
import { ScriptureInsertDialog } from "@/components/studies/ScriptureInsertDialog";
import { TextFormatToolbar } from "@/components/studies/TextFormatToolbar";
import { ShareStudyDialog } from "@/components/studies/ShareStudyDialog";
import { VoiceRecorder } from "@/components/studies/VoiceRecorder";

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
}

const StudyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchStudy();
    }
  }, [id, user]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (hasChanges && !saving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 30000); // 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasChanges, title, content, tags, isFavorite, saving]);

  const fetchStudy = async () => {
    try {
      const { data, error } = await supabase
        .from("user_studies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setTitle(data.title);
      setContent(data.content);
      setTags(data.tags || []);
      setIsFavorite(data.is_favorite);
    } catch (error) {
      console.error("Error fetching study:", error);
      toast({
        title: "Error",
        description: "Failed to load study",
        variant: "destructive",
      });
      navigate("/my-studies");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!hasChanges || saving || isAutoSaving) return;

    setIsAutoSaving(true);
    try {
      const { error } = await supabase
        .from("user_studies")
        .update({
          title,
          content,
          tags,
          is_favorite: isFavorite,
        })
        .eq("id", id);

      if (error) throw error;

      setHasChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error auto-saving study:", error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const saveStudy = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_studies")
        .update({
          title,
          content,
          tags,
          is_favorite: isFavorite,
        })
        .eq("id", id);

      if (error) throw error;

      setHasChanges(false);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Study saved successfully",
      });
    } catch (error) {
      console.error("Error saving study:", error);
      toast({
        title: "Error",
        description: "Failed to save study",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    
    // Title
    doc.setFontSize(18);
    doc.text(title || "Untitled Study", margin, margin);
    
    // Tags
    if (tags.length > 0) {
      doc.setFontSize(10);
      doc.text(`Tags: ${tags.join(", ")}`, margin, margin + 10);
    }
    
    // Content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, maxWidth);
    doc.text(lines, margin, margin + 20);
    
    // Save
    doc.save(`${title || "study"}.pdf`);
    
    toast({
      title: "Export successful",
      description: "Study exported as PDF",
    });
  };

  const exportAsMarkdown = () => {
    let markdown = `# ${title}\n\n`;
    
    if (tags.length > 0) {
      markdown += `*Tags: ${tags.join(", ")}*\n\n`;
    }
    
    markdown += content;
    
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "study"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Study exported as Markdown",
    });
  };

  const exportAsText = () => {
    let text = `${title}\n\n`;
    
    if (tags.length > 0) {
      text += `Tags: ${tags.join(", ")}\n\n`;
    }
    
    text += content;
    
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "study"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Study exported as text file",
    });
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
      setHasChanges(true);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setHasChanges(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = content;
    let newCursorPos = start;

    if (format.startsWith("#") || format.startsWith(">") || format.startsWith("•")) {
      // For headings, quotes, and bullets, insert at line start
      const lineStart = content.lastIndexOf("\n", start - 1) + 1;
      newText = content.substring(0, lineStart) + format + " " + content.substring(lineStart);
      newCursorPos = lineStart + format.length + 1;
    } else {
      // For bold/italic, wrap selection
      const wrapper = format;
      if (selectedText) {
        newText = content.substring(0, start) + wrapper.replace(/\*/g, selectedText) + content.substring(end);
        newCursorPos = start + wrapper.length;
      } else {
        newText = content.substring(0, start) + wrapper + content.substring(end);
        newCursorPos = start + Math.floor(wrapper.length / 2);
      }
    }

    setContent(newText);
    setHasChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleInsertScripture = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(content + text);
      setHasChanges(true);
      return;
    }

    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + text + content.substring(start);
    setContent(newText);
    setHasChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const handleVoiceTranscription = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent(content + " " + text);
      setHasChanges(true);
      return;
    }

    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + " " + text + content.substring(start);
    setContent(newText);
    setHasChanges(true);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length + 1, start + text.length + 1);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading study...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-studies")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studies
          </Button>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportAsPDF}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsMarkdown}>
                  Export as Markdown
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsText}>
                  Export as Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ShareStudyDialog title={title} content={content} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsFavorite(!isFavorite);
                setHasChanges(true);
              }}
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite ? "fill-amber-500 text-amber-500" : ""
                }`}
              />
            </Button>
            <Button
              onClick={saveStudy}
              disabled={saving || !hasChanges}
              className="gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Title */}
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Study Title"
                className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 mb-6"
              />

              {/* Tags */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                      {tag}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="max-w-xs"
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="mb-4 flex gap-2">
                <TextFormatToolbar onFormat={handleFormat} />
                <ScriptureInsertDialog onInsert={handleInsertScripture} />
                <VoiceRecorder onTranscription={handleVoiceTranscription} />
              </div>

              {/* Content */}
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Start writing your study notes here...

You can use:
• **bold** for emphasis
• *italic* for subtle emphasis
• # for headings
• > for quotes
• • for bullet points

Or use the formatting toolbar above!"
                className="min-h-[500px] border-0 px-0 focus-visible:ring-0 resize-none text-base leading-relaxed"
              />
            </Card>
          </div>

          {/* Sidebar with Jeeves */}
          <div className="lg:col-span-1">
            <JeevesStudyAssistant studyContext={`Title: ${title}\n\nContent: ${content.substring(0, 500)}`} />
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="mt-4 text-center">
          {isAutoSaving ? (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Auto-saving...
            </p>
          ) : lastSaved ? (
            <p className="text-sm text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          ) : hasChanges ? (
            <p className="text-sm text-muted-foreground">
              You have unsaved changes (auto-saves every 30s)
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StudyEditor;
