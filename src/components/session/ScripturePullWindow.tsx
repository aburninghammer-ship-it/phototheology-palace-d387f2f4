import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Book, Search, Plus, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchChapter, searchBible } from "@/services/bibleApi";
import { BIBLE_BOOKS } from "@/types/bible";
import { useStudySession } from "@/contexts/StudySessionContext";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface ScripturePullWindowProps {
  onInsert?: (text: string) => void;
  trigger?: React.ReactNode;
  floating?: boolean;
}

export function ScripturePullWindow({ onInsert, trigger, floating = false }: ScripturePullWindowProps) {
  const { insertScriptureToActiveTab, isSessionActive } = useStudySession();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"browse" | "search">("browse");
  
  // Browse mode state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  
  // Search mode state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Verse[]>([]);
  const [searching, setSearching] = useState(false);
  
  // Selection state
  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);

  // Get chapter count for selected book
  const getChapterCount = (book: string) => {
    const chapterCounts: Record<string, number> = {
      "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34,
      "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24,
      "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
      "Ezra": 10, "Nehemiah": 13, "Esther": 10, "Job": 42, "Psalms": 150,
      "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66,
      "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, "Hosea": 14,
      "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3,
      "Habakkuk": 3, "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4,
      "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28,
      "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6,
      "Ephesians": 6, "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5,
      "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, "Titus": 3,
      "Philemon": 1, "Hebrews": 13, "James": 5, "1 Peter": 5, "2 Peter": 3,
      "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22,
    };
    return chapterCounts[book] || 1;
  };

  // Load chapter when book/chapter changes
  useEffect(() => {
    if (mode === "browse") {
      loadChapter();
    }
  }, [selectedBook, selectedChapter, mode]);

  const loadChapter = async () => {
    setLoadingVerses(true);
    try {
      const data = await fetchChapter(selectedBook, selectedChapter);
      setVerses(data.verses.map(v => ({
        book: selectedBook,
        chapter: selectedChapter,
        verse: v.verse,
        text: v.text,
      })));
    } catch (error) {
      console.error("Error loading chapter:", error);
      toast.error("Failed to load chapter");
    } finally {
      setLoadingVerses(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const results = await searchBible(searchQuery);
      setSearchResults(results.map((v: any) => ({
        book: v.book || v.book_name || "Unknown",
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
      })));
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const toggleVerseSelection = (verse: Verse) => {
    const key = `${verse.book}-${verse.chapter}-${verse.verse}`;
    const exists = selectedVerses.find(v => 
      `${v.book}-${v.chapter}-${v.verse}` === key
    );
    
    if (exists) {
      setSelectedVerses(prev => prev.filter(v => 
        `${v.book}-${v.chapter}-${v.verse}` !== key
      ));
    } else {
      setSelectedVerses(prev => [...prev, verse]);
    }
  };

  const formatScripture = (verses: Verse[]) => {
    if (verses.length === 0) return "";
    
    // Group by reference
    const grouped = verses.reduce((acc, v) => {
      const ref = `${v.book} ${v.chapter}`;
      if (!acc[ref]) acc[ref] = [];
      acc[ref].push(v);
      return acc;
    }, {} as Record<string, Verse[]>);

    return Object.entries(grouped).map(([ref, vList]) => {
      const sortedVerses = vList.sort((a, b) => a.verse - b.verse);
      const verseRange = sortedVerses.length === 1 
        ? sortedVerses[0].verse 
        : `${sortedVerses[0].verse}-${sortedVerses[sortedVerses.length - 1].verse}`;
      
      const text = sortedVerses.map(v => v.text).join(" ");
      
      return `📖 **${ref}:${verseRange} (KJV)**\n"${text}"`;
    }).join("\n\n");
  };

  const handleInsert = () => {
    if (selectedVerses.length === 0) {
      toast.error("Select at least one verse");
      return;
    }

    const formatted = formatScripture(selectedVerses);
    
    // Use provided callback or session context
    if (onInsert) {
      onInsert(formatted);
    }
    
    if (isSessionActive) {
      insertScriptureToActiveTab(formatted);
    }
    
    setOpen(false);
    setSelectedVerses([]);
    toast.success("Scripture inserted!");
  };

  const navigateChapter = (direction: "prev" | "next") => {
    const maxChapters = getChapterCount(selectedBook);
    if (direction === "prev" && selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else if (direction === "next" && selectedChapter < maxChapters) {
      setSelectedChapter(prev => prev + 1);
    }
  };

  const displayVerses = mode === "browse" ? verses : searchResults;

  const triggerButton = trigger || (
    <Button 
      variant={floating ? "default" : "outline"} 
      size={floating ? "icon" : "sm"} 
      className={floating ? "h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90" : "gap-2"}
    >
      <Book className={floating ? "h-5 w-5" : "h-4 w-4"} />
      {!floating && "Pull Scripture"}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {triggerButton}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Pull Scripture
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button 
              variant={mode === "browse" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setMode("browse")}
              className="flex-1"
            >
              Browse
            </Button>
            <Button 
              variant={mode === "search" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setMode("search")}
              className="flex-1"
            >
              Search
            </Button>
          </div>

          {mode === "browse" ? (
            <>
              {/* Book & Chapter Selection */}
              <div className="flex gap-2">
                <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(1); }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {BIBLE_BOOKS.map(book => (
                      <SelectItem key={book} value={book}>{book}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateChapter("prev")}
                    disabled={selectedChapter <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Select 
                    value={selectedChapter.toString()} 
                    onValueChange={(v) => setSelectedChapter(parseInt(v))}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Array.from({ length: getChapterCount(selectedBook) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => navigateChapter("next")}
                    disabled={selectedChapter >= getChapterCount(selectedBook)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Search (e.g., 'love', 'faith', 'John 3:16')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searching}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          )}

          {/* Selected Verses */}
          {selectedVerses.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Selected ({selectedVerses.length})
                  </span>
                  <Button size="sm" onClick={handleInsert}>
                    <Plus className="h-4 w-4 mr-1" />
                    Insert
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedVerses.map((v, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="cursor-pointer text-xs"
                      onClick={() => toggleVerseSelection(v)}
                    >
                      {v.book} {v.chapter}:{v.verse}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verses List */}
          <ScrollArea className="h-[400px] pr-2">
            {(loadingVerses || searching) ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : displayVerses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Book className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{mode === "search" ? "Enter a search term above" : "Loading..."}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {displayVerses.map((verse, idx) => {
                  const isSelected = selectedVerses.some(v => 
                    v.book === verse.book && v.chapter === verse.chapter && v.verse === verse.verse
                  );
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary/10 border border-primary/30" 
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                      onClick={() => toggleVerseSelection(verse)}
                    >
                      <span className="text-xs font-medium text-primary mr-2">
                        {mode === "search" ? `${verse.book} ${verse.chapter}:` : ""}{verse.verse}
                      </span>
                      <span className="text-sm">{verse.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
