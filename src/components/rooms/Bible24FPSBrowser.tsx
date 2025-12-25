import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Book, Sparkles, X, WifiOff } from "lucide-react";
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
  
  const totalChapters = allBibleSets.reduce((sum, set) => sum + set.chapters.length, 0);
  
  return (
    <div className="space-y-4">
      {/* Header with offline indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">24FPS Bible</h2>
          <Badge variant="secondary" className="text-xs">
            {totalChapters} Chapters
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <WifiOff className="h-3 w-3" />
            <span>Available Offline</span>
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
            <TabsTrigger value="old">Old Testament</TabsTrigger>
            <TabsTrigger value="new">New Testament</TabsTrigger>
          </TabsList>
          
          <TabsContent value="old" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {oldTestamentBooks.map(book => {
                  const chapters = getBookChapters(book);
                  return (
                    <Button
                      key={book}
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-start justify-start text-left"
                      onClick={() => handleBookSelect(book)}
                    >
                      <span className="font-medium text-sm">{book}</span>
                      <span className="text-xs text-muted-foreground">
                        {chapters.length} chapters
                      </span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="new" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {newTestamentBooks.map(book => {
                  const chapters = getBookChapters(book);
                  return (
                    <Button
                      key={book}
                      variant="outline"
                      className="h-auto py-3 flex flex-col items-start justify-start text-left"
                      onClick={() => handleBookSelect(book)}
                    >
                      <span className="font-medium text-sm">{book}</span>
                      <span className="text-xs text-muted-foreground">
                        {chapters.length} chapters
                      </span>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {/* Back button and book title */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h3 className="text-lg font-semibold">{selectedBook}</h3>
          </div>
          
          {/* Chapter grid */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {bookChapters.map(chapter => (
                <Card
                  key={chapter.chapter}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleChapterSelect(chapter)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{chapter.symbol}</div>
                    <div className="text-sm font-medium">Ch. {chapter.chapter}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {chapter.title}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Chapter Detail Dialog */}
      <Dialog open={!!selectedChapter} onOpenChange={(open) => !open && setSelectedChapter(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">{selectedChapter?.symbol}</span>
              <div>
                <div>{selectedChapter?.book} {selectedChapter?.chapter}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedChapter?.title}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Summary */}
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">Summary</h4>
              <p className="text-sm text-muted-foreground">
                {selectedChapter?.summary}
              </p>
            </div>
            
            {/* Memory Hook */}
            <div className="bg-primary/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Memory Hook</h4>
              </div>
              <p className="text-sm italic">
                {selectedChapter?.memoryHook}
              </p>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("prev")}
                disabled={!selectedChapter || selectedChapter.chapter === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("next")}
                disabled={!selectedChapter || selectedChapter.chapter === bookChapters.length}
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
