import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Book, Sparkles, X, Palette } from "lucide-react";
import { allBibleSets, getAllBooks, getBookChapters, ChapterFrame } from "@/data/bible24fps/allBooks";

interface Bible24FPSBrowserProps {
  onClose?: () => void;
}

const BOOK_ORDER = [
  // Old Testament
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
  "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  // New Testament
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
  "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
  "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// Creative color palettes for visual memorization
const BOOK_COLORS: Record<string, { bg: string; accent: string; glow: string }> = {
  "Genesis": { bg: "from-emerald-500/20 to-teal-600/20", accent: "text-emerald-400", glow: "shadow-emerald-500/20" },
  "Exodus": { bg: "from-red-500/20 to-orange-600/20", accent: "text-red-400", glow: "shadow-red-500/20" },
  "Leviticus": { bg: "from-amber-500/20 to-yellow-600/20", accent: "text-amber-400", glow: "shadow-amber-500/20" },
  "Numbers": { bg: "from-blue-500/20 to-indigo-600/20", accent: "text-blue-400", glow: "shadow-blue-500/20" },
  "Deuteronomy": { bg: "from-purple-500/20 to-violet-600/20", accent: "text-purple-400", glow: "shadow-purple-500/20" },
  "Joshua": { bg: "from-orange-500/20 to-red-600/20", accent: "text-orange-400", glow: "shadow-orange-500/20" },
  "Judges": { bg: "from-rose-500/20 to-pink-600/20", accent: "text-rose-400", glow: "shadow-rose-500/20" },
  "Ruth": { bg: "from-pink-400/20 to-rose-500/20", accent: "text-pink-400", glow: "shadow-pink-500/20" },
  "1 Samuel": { bg: "from-cyan-500/20 to-blue-600/20", accent: "text-cyan-400", glow: "shadow-cyan-500/20" },
  "2 Samuel": { bg: "from-sky-500/20 to-cyan-600/20", accent: "text-sky-400", glow: "shadow-sky-500/20" },
  "1 Kings": { bg: "from-yellow-500/20 to-amber-600/20", accent: "text-yellow-400", glow: "shadow-yellow-500/20" },
  "2 Kings": { bg: "from-orange-400/20 to-amber-500/20", accent: "text-orange-400", glow: "shadow-orange-500/20" },
  "1 Chronicles": { bg: "from-slate-500/20 to-gray-600/20", accent: "text-slate-400", glow: "shadow-slate-500/20" },
  "2 Chronicles": { bg: "from-zinc-500/20 to-slate-600/20", accent: "text-zinc-400", glow: "shadow-zinc-500/20" },
  "Ezra": { bg: "from-teal-500/20 to-cyan-600/20", accent: "text-teal-400", glow: "shadow-teal-500/20" },
  "Nehemiah": { bg: "from-stone-500/20 to-amber-600/20", accent: "text-stone-400", glow: "shadow-stone-500/20" },
  "Esther": { bg: "from-fuchsia-500/20 to-purple-600/20", accent: "text-fuchsia-400", glow: "shadow-fuchsia-500/20" },
  "Job": { bg: "from-neutral-500/20 to-stone-600/20", accent: "text-neutral-400", glow: "shadow-neutral-500/20" },
  "Psalms": { bg: "from-violet-500/20 to-purple-600/20", accent: "text-violet-400", glow: "shadow-violet-500/20" },
  "Proverbs": { bg: "from-lime-500/20 to-green-600/20", accent: "text-lime-400", glow: "shadow-lime-500/20" },
  "Ecclesiastes": { bg: "from-gray-500/20 to-slate-600/20", accent: "text-gray-400", glow: "shadow-gray-500/20" },
  "Song of Solomon": { bg: "from-rose-400/20 to-red-500/20", accent: "text-rose-400", glow: "shadow-rose-500/20" },
  "Isaiah": { bg: "from-indigo-500/20 to-blue-600/20", accent: "text-indigo-400", glow: "shadow-indigo-500/20" },
  "Jeremiah": { bg: "from-blue-600/20 to-indigo-700/20", accent: "text-blue-400", glow: "shadow-blue-500/20" },
  "Ezekiel": { bg: "from-cyan-600/20 to-teal-700/20", accent: "text-cyan-400", glow: "shadow-cyan-500/20" },
  "Daniel": { bg: "from-amber-500/20 to-orange-600/20", accent: "text-amber-400", glow: "shadow-amber-500/20" },
  "Matthew": { bg: "from-blue-500/20 to-indigo-600/20", accent: "text-blue-400", glow: "shadow-blue-500/20" },
  "Mark": { bg: "from-red-500/20 to-rose-600/20", accent: "text-red-400", glow: "shadow-red-500/20" },
  "Luke": { bg: "from-green-500/20 to-emerald-600/20", accent: "text-green-400", glow: "shadow-green-500/20" },
  "John": { bg: "from-purple-500/20 to-violet-600/20", accent: "text-purple-400", glow: "shadow-purple-500/20" },
  "Acts": { bg: "from-orange-500/20 to-amber-600/20", accent: "text-orange-400", glow: "shadow-orange-500/20" },
  "Romans": { bg: "from-teal-500/20 to-cyan-600/20", accent: "text-teal-400", glow: "shadow-teal-500/20" },
  "1 Corinthians": { bg: "from-pink-500/20 to-rose-600/20", accent: "text-pink-400", glow: "shadow-pink-500/20" },
  "2 Corinthians": { bg: "from-fuchsia-500/20 to-pink-600/20", accent: "text-fuchsia-400", glow: "shadow-fuchsia-500/20" },
  "Galatians": { bg: "from-lime-500/20 to-green-600/20", accent: "text-lime-400", glow: "shadow-lime-500/20" },
  "Ephesians": { bg: "from-sky-500/20 to-blue-600/20", accent: "text-sky-400", glow: "shadow-sky-500/20" },
  "Philippians": { bg: "from-yellow-500/20 to-amber-600/20", accent: "text-yellow-400", glow: "shadow-yellow-500/20" },
  "Colossians": { bg: "from-emerald-500/20 to-green-600/20", accent: "text-emerald-400", glow: "shadow-emerald-500/20" },
  "Hebrews": { bg: "from-amber-600/20 to-orange-700/20", accent: "text-amber-400", glow: "shadow-amber-500/20" },
  "James": { bg: "from-stone-500/20 to-amber-600/20", accent: "text-stone-400", glow: "shadow-stone-500/20" },
  "1 Peter": { bg: "from-slate-500/20 to-blue-600/20", accent: "text-slate-400", glow: "shadow-slate-500/20" },
  "2 Peter": { bg: "from-zinc-500/20 to-slate-600/20", accent: "text-zinc-400", glow: "shadow-zinc-500/20" },
  "1 John": { bg: "from-rose-500/20 to-pink-600/20", accent: "text-rose-400", glow: "shadow-rose-500/20" },
  "Jude": { bg: "from-red-600/20 to-orange-700/20", accent: "text-red-400", glow: "shadow-red-500/20" },
  "Revelation": { bg: "from-violet-600/20 to-purple-700/20", accent: "text-violet-400", glow: "shadow-violet-500/20" },
};

const getBookColor = (book: string) => {
  return BOOK_COLORS[book] || { bg: "from-primary/20 to-primary/10", accent: "text-primary", glow: "shadow-primary/20" };
};

export function Bible24FPSBrowser({ onClose }: Bible24FPSBrowserProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterFrame | null>(null);
  const [view, setView] = useState<"books" | "chapters">("books");
  
  const availableBooks = useMemo(() => {
    const books = getAllBooks();
    return BOOK_ORDER.filter(b => books.includes(b));
  }, []);
  
  const oldTestamentBooks = availableBooks.filter(b => BOOK_ORDER.indexOf(b) < 39);
  const newTestamentBooks = availableBooks.filter(b => BOOK_ORDER.indexOf(b) >= 39);
  
  const bookChapters = useMemo(() => {
    if (!selectedBook) return [];
    return getBookChapters(selectedBook);
  }, [selectedBook]);
  
  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setView("chapters");
  };
  
  const handleChapterSelect = (chapter: ChapterFrame) => {
    setSelectedChapter(chapter);
  };
  
  const handleBack = () => {
    if (view === "chapters") {
      setView("books");
      setSelectedBook(null);
    }
  };
  
  const navigateChapter = (direction: "prev" | "next") => {
    if (!selectedChapter || !bookChapters.length) return;
    const currentIndex = bookChapters.findIndex(c => c.chapter === selectedChapter.chapter);
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < bookChapters.length) {
      setSelectedChapter(bookChapters[newIndex]);
    }
  };
  
  const totalSets = allBibleSets.length;
  const totalChapters = allBibleSets.reduce((sum, set) => sum + set.chapters.length, 0);
  
  const currentBookColor = selectedBook ? getBookColor(selectedBook) : null;
  
  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Palette className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">24FPS Bible</h2>
            <p className="text-xs text-muted-foreground">Visual Chapter Memory System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs bg-primary/10">
              {totalSets} Sets
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {totalChapters} Chapters
            </Badge>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      {view === "books" ? (
        <Tabs defaultValue="old" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="old" className="gap-2">
              <Book className="h-4 w-4" />
              Old Testament ({oldTestamentBooks.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <Sparkles className="h-4 w-4" />
              New Testament ({newTestamentBooks.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="old" className="mt-4">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {oldTestamentBooks.map(book => {
                  const chapters = getBookChapters(book);
                  const colors = getBookColor(book);
                  return (
                    <Card
                      key={book}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.glow} border-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm`}
                      onClick={() => handleBookSelect(book)}
                    >
                      <CardContent className="p-4">
                        <div className={`text-lg font-bold ${colors.accent}`}>{book}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-background/50">
                            {chapters.length} ch
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="new" className="mt-4">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {newTestamentBooks.map(book => {
                  const chapters = getBookChapters(book);
                  const colors = getBookColor(book);
                  return (
                    <Card
                      key={book}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.glow} border-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm`}
                      onClick={() => handleBookSelect(book)}
                    >
                      <CardContent className="p-4">
                        <div className={`text-lg font-bold ${colors.accent}`}>{book}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-background/50">
                            {chapters.length} ch
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {/* Back button and book title */}
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${currentBookColor?.bg}`}>
            <Button variant="ghost" size="sm" onClick={handleBack} className="shrink-0">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${currentBookColor?.accent}`}>{selectedBook}</h3>
              <p className="text-xs text-muted-foreground">{bookChapters.length} chapters to memorize</p>
            </div>
          </div>
          
          {/* Chapter grid - vibrant cards */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {bookChapters.map((chapter, idx) => {
                // Create rotating hue effect for visual variety
                const hueOffset = (idx * 15) % 360;
                return (
                  <Card
                    key={chapter.chapter}
                    className={`cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl border-0 bg-gradient-to-br ${currentBookColor?.bg} hover:brightness-125`}
                    style={{
                      filter: `hue-rotate(${hueOffset}deg)`,
                    }}
                    onClick={() => handleChapterSelect(chapter)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-3xl mb-1 drop-shadow-lg transform transition-transform hover:scale-125">
                        {chapter.symbol}
                      </div>
                      <div className={`text-sm font-bold ${currentBookColor?.accent}`}>
                        Ch. {chapter.chapter}
                      </div>
                      <div className="text-[10px] text-muted-foreground line-clamp-1">
                        {chapter.title}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Chapter Detail Dialog - Enhanced visual */}
      <Dialog open={!!selectedChapter} onOpenChange={(open) => !open && setSelectedChapter(null)}>
        <DialogContent className={`max-w-md border-0 bg-gradient-to-br ${currentBookColor?.bg || ''} backdrop-blur-xl`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="text-5xl drop-shadow-xl animate-pulse">
                {selectedChapter?.symbol}
              </div>
              <div>
                <div className={`text-xl font-bold ${currentBookColor?.accent}`}>
                  {selectedChapter?.book} {selectedChapter?.chapter}
                </div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedChapter?.title}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-background/50 backdrop-blur rounded-lg p-4">
              <h4 className={`text-sm font-semibold ${currentBookColor?.accent} mb-2 flex items-center gap-2`}>
                <Book className="h-4 w-4" />
                Summary
              </h4>
              <p className="text-sm leading-relaxed">
                {selectedChapter?.summary}
              </p>
            </div>
            
            {/* Memory Hook - Highlighted */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className={`h-4 w-4 ${currentBookColor?.accent} animate-pulse`} />
                <h4 className="text-sm font-bold">Memory Hook</h4>
              </div>
              <p className="text-base italic font-medium">
                "{selectedChapter?.memoryHook}"
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("prev")}
                disabled={!selectedChapter || selectedChapter.chapter === 1}
                className="bg-background/50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("next")}
                disabled={!selectedChapter || selectedChapter.chapter === bookChapters.length}
                className="bg-background/50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
