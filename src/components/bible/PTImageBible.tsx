import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Image, ChevronDown, ChevronRight, Camera, Sparkles, BookOpen, Search, Wand2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { genesisImages } from "@/assets/24fps/genesis";
import { oldTestamentSets } from "@/data/bible24fps/oldTestament";
import { newTestamentSets } from "@/data/bible24fps/newTestament";
import { ChapterFrame } from "@/data/bible24fps";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SelectedChapter {
  book: string;
  chapter: number;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
  imageUrl?: string;
}

// Combine all sets
const allSets = [...oldTestamentSets, ...newTestamentSets];

// Group chapters by book
const getChaptersByBook = (): Map<string, ChapterFrame[]> => {
  const bookChapters = new Map<string, ChapterFrame[]>();
  
  allSets.forEach(set => {
    set.chapters.forEach(chapter => {
      const existing = bookChapters.get(chapter.book) || [];
      // Avoid duplicates
      if (!existing.find(c => c.chapter === chapter.chapter)) {
        existing.push(chapter);
      }
      bookChapters.set(chapter.book, existing);
    });
  });
  
  // Sort chapters within each book
  bookChapters.forEach((chapters, book) => {
    chapters.sort((a, b) => a.chapter - b.chapter);
  });
  
  return bookChapters;
};

// Book order for display
const OLD_TESTAMENT_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms",
  "Proverbs", "Ecclesiastes", "Song of Solomon",
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah",
  "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const NEW_TESTAMENT_BOOKS = [
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
  "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews",
  "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export function PTImageBible() {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set(["Genesis"]));
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapter | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("old");
  const [generatedImages, setGeneratedImages] = useState<Map<string, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const chaptersByBook = useMemo(() => getChaptersByBook(), []);

  // Load previously generated images from database
  useEffect(() => {
    const loadGeneratedImages = async () => {
      const { data } = await supabase
        .from("bible_images")
        .select("book, chapter, image_url")
        .eq("room_type", "24fps")
        .eq("is_public", true);
      
      if (data) {
        const imageMap = new Map<string, string>();
        data.forEach((img) => {
          imageMap.set(`${img.book}-${img.chapter}`, img.image_url);
        });
        setGeneratedImages(imageMap);
      }
    };
    loadGeneratedImages();
  }, []);

  const toggleBook = (book: string) => {
    setExpandedBooks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(book)) {
        newSet.delete(book);
      } else {
        newSet.add(book);
      }
      return newSet;
    });
  };

  const hasImagesForBook = (book: string): boolean => {
    return book === "Genesis" || Array.from(generatedImages.keys()).some(key => key.startsWith(`${book}-`));
  };

  const getImageForChapter = (book: string, chapter: number): string | undefined => {
    // Check for generated images first
    const generatedKey = `${book}-${chapter}`;
    if (generatedImages.has(generatedKey)) {
      return generatedImages.get(generatedKey);
    }
    // Fall back to static Genesis images
    if (book === "Genesis" && chapter >= 1 && chapter <= 50) {
      return genesisImages[chapter - 1];
    }
    return undefined;
  };

  const generateImageForChapter = async (chapter: ChapterFrame) => {
    if (!user) {
      toast.error("Please sign in to generate images");
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Create a memorable symbolic visual anchor for ${chapter.book} chapter ${chapter.chapter}: "${chapter.title}". ${chapter.summary}. The symbol is ${chapter.symbol}. Make it vivid, symbolic, and suitable for Bible memorization using the 24FPS method.`;

      const { data: response, error: fnError } = await supabase.functions.invoke(
        "generate-visual-anchor",
        { body: { prompt } }
      );

      if (fnError) throw fnError;
      if (!response?.image) throw new Error("No image generated");

      // Convert base64 to blob and upload
      const base64Data = response.image.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      const fileName = `24fps/${chapter.book.toLowerCase()}/${chapter.book.toLowerCase()}-${chapter.chapter}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("bible-images")
        .upload(fileName, blob, { contentType: "image/png", upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      // Save to database
      await supabase.from("bible_images").insert({
        user_id: user.id,
        book: chapter.book,
        chapter: chapter.chapter,
        image_url: urlData.publicUrl,
        description: `${chapter.book} ${chapter.chapter}: ${chapter.title}`,
        room_type: "24fps",
        is_public: true,
        is_favorite: false,
      });

      // Update local state
      const key = `${chapter.book}-${chapter.chapter}`;
      setGeneratedImages((prev) => new Map(prev).set(key, urlData.publicUrl));
      
      if (selectedChapter?.book === chapter.book && selectedChapter?.chapter === chapter.chapter) {
        setSelectedChapter({ ...selectedChapter, imageUrl: urlData.publicUrl });
      }

      toast.success(`Generated image for ${chapter.book} ${chapter.chapter}`);
    } catch (err: any) {
      console.error("Error generating image:", err);
      toast.error(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChapterClick = (chapter: ChapterFrame) => {
    const imageUrl = getImageForChapter(chapter.book, chapter.chapter);
    setSelectedChapter({
      book: chapter.book,
      chapter: chapter.chapter,
      title: chapter.title,
      summary: chapter.summary,
      memoryHook: chapter.memoryHook,
      symbol: chapter.symbol,
      imageUrl
    });
  };

  // Filter chapters based on search
  const filteredResults = useMemo(() => {
    if (searchQuery.length < 2) return null;
    
    const results: ChapterFrame[] = [];
    chaptersByBook.forEach((chapters) => {
      chapters.forEach(ch => {
        const searchLower = searchQuery.toLowerCase();
        if (
          ch.title.toLowerCase().includes(searchLower) ||
          ch.summary.toLowerCase().includes(searchLower) ||
          ch.book.toLowerCase().includes(searchLower) ||
          ch.symbol.includes(searchQuery)
        ) {
          results.push(ch);
        }
      });
    });
    return results.slice(0, 50); // Limit results
  }, [searchQuery, chaptersByBook]);

  const renderBookSection = (book: string) => {
    const chapters = chaptersByBook.get(book);
    if (!chapters || chapters.length === 0) return null;

    const isExpanded = expandedBooks.has(book);
    const hasImages = hasImagesForBook(book);

    return (
      <Collapsible
        key={book}
        open={isExpanded}
        onOpenChange={() => toggleBook(book)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-between p-3 h-auto ${
              hasImages ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium">{book}</span>
              <Badge variant="secondary" className="text-xs">
                {chapters.length} ch
              </Badge>
            </div>
            {hasImages && (
              <Badge className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white">
                <Image className="h-3 w-3 mr-1" />
                {chapters.length} frames
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-4 pr-2 py-3"
          >
            <div className={`grid gap-2 ${hasImages ? "grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10" : "grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12"}`}>
              {chapters.map((chapter) => {
                const imageUrl = getImageForChapter(book, chapter.chapter);
                
                return (
                  <button
                    key={chapter.chapter}
                    onClick={() => handleChapterClick(chapter)}
                    className={`group relative rounded-lg overflow-hidden border border-border/50 hover:border-primary transition-all hover:scale-105 hover:shadow-lg ${hasImages ? "aspect-square" : "aspect-square"}`}
                    title={`${book} ${chapter.chapter}: ${chapter.title}`}
                  >
                    {imageUrl ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={`${book} ${chapter.chapter}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-1 text-center">
                          <span className="text-[10px] font-bold text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            {chapter.chapter}
                          </span>
                        </div>
                        <div className="absolute top-1 right-1 text-sm opacity-70 group-hover:opacity-100">
                          {chapter.symbol}
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30 hover:from-primary/10 hover:to-accent/10 transition-colors">
                        <span className="text-lg">{chapter.symbol}</span>
                        <span className="text-xs text-muted-foreground font-medium">{chapter.chapter}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const totalChapters = useMemo(() => {
    let count = 0;
    chaptersByBook.forEach(chapters => count += chapters.length);
    return count;
  }, [chaptersByBook]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">PT Image Bible</h3>
          <p className="text-sm text-muted-foreground">
            {totalChapters}+ chapter frames with memory hooks & symbols
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          50 Genesis Images
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search chapters by title, content, or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Search Results */}
      {filteredResults ? (
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-muted-foreground">
            {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""} for "{searchQuery}"
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {filteredResults.map((chapter) => (
              <Card
                key={`${chapter.book}-${chapter.chapter}`}
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleChapterClick(chapter)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{chapter.symbol}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {chapter.book} {chapter.chapter}: {chapter.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {chapter.memoryHook}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {filteredResults.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No chapters found. Try a different search term.</p>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="old">
              <BookOpen className="h-4 w-4 mr-2" />
              Old Testament
            </TabsTrigger>
            <TabsTrigger value="new">
              <BookOpen className="h-4 w-4 mr-2" />
              New Testament
            </TabsTrigger>
          </TabsList>

          <TabsContent value="old">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-1">
                {OLD_TESTAMENT_BOOKS.map((book) => renderBookSection(book))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="new">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-1">
                {NEW_TESTAMENT_BOOKS.map((book) => renderBookSection(book))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      {/* Chapter Detail Dialog */}
      <Dialog open={!!selectedChapter} onOpenChange={() => setSelectedChapter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedChapter?.symbol}</span>
              {selectedChapter?.book} {selectedChapter?.chapter}: {selectedChapter?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedChapter && (
            <div className="space-y-4">
              {selectedChapter.imageUrl ? (
                <div className="relative rounded-lg overflow-hidden bg-muted/20">
                  <img
                    src={selectedChapter.imageUrl}
                    alt={`${selectedChapter.book} ${selectedChapter.chapter}`}
                    className="w-full h-auto max-h-[50vh] object-contain"
                  />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-dashed border-border/50 p-8 text-center">
                  <div className="text-6xl mb-4">{selectedChapter.symbol}</div>
                  <p className="text-muted-foreground mb-4">No unique image yet for this chapter</p>
                  <Button
                    onClick={() => {
                      const chapter = chaptersByBook.get(selectedChapter.book)?.find(
                        c => c.chapter === selectedChapter.chapter
                      );
                      if (chapter) generateImageForChapter(chapter);
                    }}
                    disabled={isGenerating || !user}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Unique Image
                      </>
                    )}
                  </Button>
                  {!user && (
                    <p className="text-xs text-muted-foreground mt-2">Sign in to generate images</p>
                  )}
                </div>
              )}
              
              <Card className="p-4 bg-muted/30 border-border/50">
                <p className="text-base leading-relaxed mb-3">{selectedChapter.summary}</p>
                
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Memory Hook
                  </Badge>
                  <span className="text-sm font-medium">{selectedChapter.memoryHook}</span>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  disabled={selectedChapter.chapter <= 1}
                  onClick={() => {
                    const chapters = chaptersByBook.get(selectedChapter.book);
                    const prevChapter = chapters?.find(c => c.chapter === selectedChapter.chapter - 1);
                    if (prevChapter) handleChapterClick(prevChapter);
                  }}
                >
                  ← Previous
                </Button>
                <Badge className="self-center bg-gradient-to-r from-purple-500 to-pink-500">
                  {selectedChapter.imageUrl ? "24FPS Frame" : "Chapter Frame"}
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => {
                    const chapters = chaptersByBook.get(selectedChapter.book);
                    const nextChapter = chapters?.find(c => c.chapter === selectedChapter.chapter + 1);
                    if (nextChapter) handleChapterClick(nextChapter);
                  }}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
