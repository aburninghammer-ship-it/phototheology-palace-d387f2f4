import { useState, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PenLine, 
  Save, 
  Trash2, 
  Plus, 
  Search, 
  Clock, 
  WifiOff,
  Check,
  BookOpen,
  Lightbulb,
  Heart,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

const NOTES_STORAGE_KEY = "phototheology_notes";

const CATEGORIES = [
  { id: "thought", label: "Thought", icon: Lightbulb, color: "bg-yellow-500/20 text-yellow-600" },
  { id: "prayer", label: "Prayer", icon: Heart, color: "bg-pink-500/20 text-pink-600" },
  { id: "study", label: "Study", icon: BookOpen, color: "bg-blue-500/20 text-blue-600" },
  { id: "insight", label: "Insight", icon: Star, color: "bg-purple-500/20 text-purple-600" },
];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load notes:", e);
    }
  }, []);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Save notes to localStorage
  const saveNotes = useCallback((updatedNotes: Note[]) => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save notes:", e);
      toast.error("Failed to save notes");
    }
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (!selectedNote) return;
    
    setIsSaving(true);
    const timer = setTimeout(() => {
      const updatedNotes = notes.map(n => 
        n.id === selectedNote.id 
          ? { ...selectedNote, updatedAt: Date.now() }
          : n
      );
      saveNotes(updatedNotes);
      setIsSaving(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedNote?.title, selectedNote?.content, selectedNote?.category]);

  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "New Note",
      content: "",
      category: "thought",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setSelectedNote(newNote);
    toast.success("New note created");
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    saveNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
    }
    toast.success("Note deleted");
  };

  const toggleFavorite = (noteId: string) => {
    const updatedNotes = notes.map(n =>
      n.id === noteId ? { ...n, isFavorite: !n.isFavorite } : n
    );
    saveNotes(updatedNotes);
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, isFavorite: !selectedNote.isFavorite });
    }
  };

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || note.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Favorites first, then by updatedAt
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.updatedAt - a.updatedAt;
    });

  const getCategoryInfo = (categoryId: string) => 
    CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <PenLine className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              My Notes
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Jot down thoughts, prayers, and insights
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline Mode
              </Badge>
            )}
            <Button onClick={createNewNote} className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Notes List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge
                  variant={!filterCategory ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterCategory(null)}
                >
                  All
                </Badge>
                {CATEGORIES.map(cat => (
                  <Badge
                    key={cat.id}
                    variant={filterCategory === cat.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterCategory(cat.id)}
                  >
                    <cat.icon className="h-3 w-3 mr-1" />
                    {cat.label}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] sm:h-[500px]">
                {filteredNotes.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <PenLine className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No notes yet</p>
                    <p className="text-sm">Click "New Note" to get started</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotes.map(note => {
                      const category = getCategoryInfo(note.category);
                      return (
                        <div
                          key={note.id}
                          onClick={() => setSelectedNote(note)}
                          className={cn(
                            "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedNote?.id === note.id && "bg-primary/10 border-l-4 border-primary"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {note.isFavorite && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                )}
                                <h3 className="font-medium truncate">{note.title}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {note.content || "No content"}
                              </p>
                            </div>
                            <Badge className={cn("text-xs", category.color)}>
                              <category.icon className="h-3 w-3" />
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {format(note.updatedAt, "MMM d, h:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Note Editor */}
          <Card className="lg:col-span-2">
            {selectedNote ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <Input
                      value={selectedNote.title}
                      onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                      className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0"
                      placeholder="Note title..."
                    />
                    <div className="flex items-center gap-2">
                      {isSaving ? (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1 animate-spin" />
                          Saving...
                        </Badge>
                      ) : lastSaved && (
                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                          <Check className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(selectedNote.id)}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          selectedNote.isFavorite && "text-yellow-500 fill-yellow-500"
                        )} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteNote(selectedNote.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Category Selector */}
                  <div className="flex gap-2 mt-2">
                    {CATEGORIES.map(cat => (
                      <Badge
                        key={cat.id}
                        variant={selectedNote.category === cat.id ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedNote.category === cat.id && cat.color
                        )}
                        onClick={() => setSelectedNote({ ...selectedNote, category: cat.id })}
                      >
                        <cat.icon className="h-3 w-3 mr-1" />
                        {cat.label}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <Textarea
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                    placeholder="Start writing your thoughts, prayers, or insights..."
                    className="min-h-[300px] sm:min-h-[400px] resize-none border-none shadow-none focus-visible:ring-0"
                  />
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <PenLine className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Select a note or create a new one</p>
                <p className="text-sm">Your notes are saved automatically and work offline</p>
                <Button onClick={createNewNote} className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Note
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notes;
