import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Image, ChevronDown, ChevronRight, Camera, Sparkles, BookOpen, Search, Wand2, Loader2, Play, Pause, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { allBibleSets, ChapterFrame } from "@/data/bible24fps/allBooks";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

// Image array refs - will be populated by dynamic imports
const imageArraysRef: Record<string, string[]> = {
  Genesis: [],
  Exodus: [],
  Leviticus: [],
  Numbers: [],
  Deuteronomy: [],
  Joshua: [],
};

// Dynamic imports for static image arrays
const loadImageArrays = async () => {
  const [genesis, exodus, leviticus, numbers, deuteronomy, joshua] = await Promise.all([
    import("@/assets/24fps/genesis").then(m => m.genesisImages),
    import("@/assets/24fps/exodus").then(m => m.exodusImages),
    import("@/assets/24fps/leviticus").then(m => m.leviticusImages),
    import("@/assets/24fps/numbers").then(m => m.numbersImages),
    import("@/assets/24fps/deuteronomy").then(m => m.deuteronomyImages),
    import("@/assets/24fps/joshua").then(m => m.joshuaImages),
  ]);
  imageArraysRef.Genesis = genesis;
  imageArraysRef.Exodus = exodus;
  imageArraysRef.Leviticus = leviticus;
  imageArraysRef.Numbers = numbers;
  imageArraysRef.Deuteronomy = deuteronomy;
  imageArraysRef.Joshua = joshua;
};

interface SelectedChapter {
  book: string;
  chapter: number;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
  imageUrl?: string;
}

interface BatchProgress {
  current: number;
  total: number;
  currentBook: string;
  currentChapter: number;
  isRunning: boolean;
  isPaused: boolean;
}

// Combine all sets (full 66-book coverage)
const allSets = allBibleSets;

const STATIC_24FPS_BOOKS = new Set([
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
]);

const STATIC_24FPS_IMAGE_COUNT = 211; // Genesis(50)+Exodus(40)+Leviticus(27)+Numbers(36)+Deuteronomy(34)+Joshua(24)

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
  const [batchProgress, setBatchProgress] = useState<BatchProgress | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const isPausedRef = useRef(false);
  const shouldStopRef = useRef(false);
  const { user } = useAuth();

  // Load static image arrays on mount
  useEffect(() => {
    loadImageArrays().then(() => setImagesLoaded(true));
  }, []);

  const chaptersByBook = useMemo(() => getChaptersByBook(), []);

  // Load previously generated images from database
  useEffect(() => {
    const loadGeneratedImages = async () => {
      const { data } = await supabase
        .from("bible_images")
        .select("book, chapter, image_url, created_at")
        .eq("room_type", "24fps")
        .eq("is_public", true)
        .order("created_at", { ascending: true });
      
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

  // Get all chapters that need images
  const chaptersNeedingImages = useMemo(() => {
    const needsImage: ChapterFrame[] = [];
    const allBooks = [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS];
    
    allBooks.forEach(book => {
      const chapters = chaptersByBook.get(book) || [];
      chapters.forEach(chapter => {
        const key = `${chapter.book}-${chapter.chapter}`;
        // Skip books with static images and any already generated
        const hasStaticImages = STATIC_24FPS_BOOKS.has(chapter.book);
        if (!hasStaticImages && !generatedImages.has(key)) {
          needsImage.push(chapter);
        }
      });
    });
    
    return needsImage;
  }, [chaptersByBook, generatedImages]);

  // Generate image for a single chapter (with delay for rate limiting)
  const generateSingleImage = useCallback(async (chapter: ChapterFrame): Promise<boolean> => {
    try {
      const prompt = [
        `Create a flashcard-front illustration (no text) for ${chapter.book} chapter ${chapter.chapter}: "${chapter.title}".`,
        `Use this summary to choose distinct visual elements: ${chapter.summary}`,
        `Primary symbol to feature: ${chapter.symbol}.`,
        "Rules: NO words, NO letters, NO numbers, NO captions, NO watermarks, NO signatures.",
        "Style: bold iconic composition, high contrast, clean shapes, rich color, single clear focal point, minimal background.",
      ].join(" ");

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

      const fileName = `24fps/${chapter.book.toLowerCase().replace(/\s+/g, '-')}/${chapter.book.toLowerCase().replace(/\s+/g, '-')}-${chapter.chapter}-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("bible-images")
        .upload(fileName, blob, { contentType: "image/png", upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("bible-images")
        .getPublicUrl(fileName);

      // Save to database
      await supabase.from("bible_images").insert({
        user_id: user!.id,
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
      
      return true;
    } catch (err: any) {
      console.error(`Error generating image for ${chapter.book} ${chapter.chapter}:`, err);
      return false;
    }
  }, [user]);

  // Batch generate all missing images
  const startBatchGeneration = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to generate images");
      return;
    }

    const chaptersToGenerate = chaptersNeedingImages;
    if (chaptersToGenerate.length === 0) {
      toast.info("All chapters already have images!");
      return;
    }

    shouldStopRef.current = false;
    isPausedRef.current = false;

    setBatchProgress({
      current: 0,
      total: chaptersToGenerate.length,
      currentBook: chaptersToGenerate[0].book,
      currentChapter: chaptersToGenerate[0].chapter,
      isRunning: true,
      isPaused: false
    });

    toast.info(`Starting batch generation for ${chaptersToGenerate.length} chapters...`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < chaptersToGenerate.length; i++) {
      // Check if stopped
      if (shouldStopRef.current) {
        toast.info("Batch generation stopped");
        break;
      }

      // Wait while paused
      while (isPausedRef.current && !shouldStopRef.current) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const chapter = chaptersToGenerate[i];
      
      setBatchProgress(prev => prev ? {
        ...prev,
        current: i,
        currentBook: chapter.book,
        currentChapter: chapter.chapter,
      } : null);

      const success = await generateSingleImage(chapter);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }

      // Add delay between requests to avoid rate limiting
      if (i < chaptersToGenerate.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setBatchProgress(null);
    toast.success(`Batch complete! Generated ${successCount} images. ${failCount > 0 ? `${failCount} failed.` : ''}`);
  }, [user, chaptersNeedingImages, generateSingleImage]);

  const pauseBatchGeneration = useCallback(() => {
    isPausedRef.current = true;
    setBatchProgress(prev => prev ? { ...prev, isPaused: true } : null);
    toast.info("Batch generation paused");
  }, []);

  const resumeBatchGeneration = useCallback(() => {
    isPausedRef.current = false;
    setBatchProgress(prev => prev ? { ...prev, isPaused: false } : null);
    toast.info("Batch generation resumed");
  }, []);

  const stopBatchGeneration = useCallback(() => {
    shouldStopRef.current = true;
    isPausedRef.current = false;
    setBatchProgress(null);
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
    return STATIC_24FPS_BOOKS.has(book) || Array.from(generatedImages.keys()).some(key => key.startsWith(`${book}-`));
  };

  const getImageForChapter = (book: string, chapter: number): string | undefined => {
    // Check for generated images first
    const generatedKey = `${book}-${chapter}`;
    if (generatedImages.has(generatedKey)) {
      return generatedImages.get(generatedKey);
    }
    // Fall back to static images
    if (book === "Genesis" && chapter >= 1 && chapter <= 50) {
      return imageArraysRef.Genesis[chapter - 1];
    }
    if (book === "Exodus" && chapter >= 1 && chapter <= 40) {
      return imageArraysRef.Exodus[chapter - 1];
    }
    if (book === "Leviticus" && chapter >= 1 && chapter <= 27) {
      return imageArraysRef.Leviticus[chapter - 1];
    }
    if (book === "Numbers" && chapter >= 1 && chapter <= 36) {
      return imageArraysRef.Numbers[chapter - 1];
    }
    if (book === "Deuteronomy" && chapter >= 1 && chapter <= 34) {
      return imageArraysRef.Deuteronomy[chapter - 1];
    }
    if (book === "Joshua" && chapter >= 1 && chapter <= 24) {
      return imageArraysRef.Joshua[chapter - 1];
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
      const prompt = [
        `Create a flashcard-front illustration (no text) for ${chapter.book} chapter ${chapter.chapter}: "${chapter.title}".`,
        `Use this summary to choose distinct visual elements: ${chapter.summary}`,
        `Primary symbol to feature: ${chapter.symbol}.`,
        "Rules: NO words, NO letters, NO numbers, NO captions, NO watermarks, NO signatures.",
        "Style: bold iconic composition, high contrast, clean shapes, rich color, single clear focal point, minimal background.",
      ].join(" ");

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

      const fileName = `24fps/${chapter.book.toLowerCase().replace(/\s+/g, '-')}/${chapter.book.toLowerCase().replace(/\s+/g, '-')}-${chapter.chapter}-${Date.now()}.png`;
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
            <div className={`grid gap-1.5 sm:gap-2 ${hasImages ? "grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10" : "grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12"}`}>
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
                      <img
                        src={imageUrl}
                        alt={`${book} ${chapter.chapter}`}
                        className="w-full h-full object-cover"
                      />
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
      {/* Mobile-optimized header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 shrink-0">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold">PT Image Bible</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalChapters}+ chapter frames
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={startBatchGeneration}
            disabled={!user || !!batchProgress?.isRunning || chaptersNeedingImages.length === 0}
            className="h-8"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Generate missing</span>
            <span className="sm:hidden">Generate</span>
            <span className="ml-1">({chaptersNeedingImages.length})</span>
          </Button>

          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {generatedImages.size + STATIC_24FPS_IMAGE_COUNT} Images
          </Badge>
        </div>
      </div>

      {/* Batch Progress - Mobile optimized */}
      {batchProgress && (
        <Card className="p-3 sm:p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400 shrink-0" />
              <span className="font-medium text-sm truncate">
                {batchProgress.currentBook} {batchProgress.currentChapter}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {batchProgress.isPaused ? (
                <Button size="sm" variant="outline" onClick={resumeBatchGeneration} className="flex-1 sm:flex-none">
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={pauseBatchGeneration} className="flex-1 sm:flex-none">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={stopBatchGeneration} className="flex-1 sm:flex-none">
                Stop
              </Button>
            </div>
          </div>
          <Progress value={(batchProgress.current / batchProgress.total) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {batchProgress.current}/{batchProgress.total} ({Math.round((batchProgress.current / batchProgress.total) * 100)}%)
          </p>
        </Card>
      )}

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
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="old" className="text-xs sm:text-sm py-2.5">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Old Testament</span>
              <span className="xs:hidden">OT</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="text-xs sm:text-sm py-2.5">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">New Testament</span>
              <span className="xs:hidden">NT</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="old">
            <ScrollArea className="h-[calc(100vh-300px)] sm:h-[600px] pr-2 sm:pr-4">
              <div className="space-y-1">
                {OLD_TESTAMENT_BOOKS.map((book) => renderBookSection(book))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="new">
            <ScrollArea className="h-[calc(100vh-300px)] sm:h-[600px] pr-2 sm:pr-4">
              <div className="space-y-1">
                {NEW_TESTAMENT_BOOKS.map((book) => renderBookSection(book))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      )}

      {/* Chapter Detail Dialog - Mobile optimized */}
      <Dialog open={!!selectedChapter} onOpenChange={() => setSelectedChapter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <span className="text-xl sm:text-2xl">{selectedChapter?.symbol}</span>
              <span className="truncate">{selectedChapter?.book} {selectedChapter?.chapter}: {selectedChapter?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedChapter && (
            <div className="space-y-3 sm:space-y-4">
              <Tabs defaultValue="front" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="front">Front</TabsTrigger>
                  <TabsTrigger value="back">Back</TabsTrigger>
                </TabsList>

                <TabsContent value="front" className="mt-3 sm:mt-4">
                  {selectedChapter.imageUrl ? (
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden bg-muted/20 border border-border/50">
                        <img
                          src={selectedChapter.imageUrl}
                          alt={`${selectedChapter.book} ${selectedChapter.chapter} visual flashcard`}
                          className="w-full aspect-[3/4] object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const chapter = chaptersByBook.get(selectedChapter.book)?.find(
                              (c) => c.chapter === selectedChapter.chapter
                            );
                            if (chapter) generateImageForChapter(chapter);
                          }}
                          disabled={isGenerating || !user}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Regenerating…
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Regenerate (no text)
                            </>
                          )}
                        </Button>

                        {!user && (
                          <p className="text-xs text-muted-foreground">Sign in to regenerate</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-lg overflow-hidden bg-muted/20 border border-dashed border-border/50 p-4 sm:p-8 text-center">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{selectedChapter.symbol}</div>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4">No unique image yet</p>
                      <Button
                        onClick={() => {
                          const chapter = chaptersByBook.get(selectedChapter.book)?.find(
                            (c) => c.chapter === selectedChapter.chapter
                          );
                          if (chapter) generateImageForChapter(chapter);
                        }}
                        disabled={isGenerating || !user}
                        size="sm"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating…
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4 mr-2" />
                            Generate (no text)
                          </>
                        )}
                      </Button>
                      {!user && (
                        <p className="text-xs text-muted-foreground mt-2">Sign in to generate</p>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="back" className="mt-3 sm:mt-4">
                  <Card className="p-3 sm:p-4 bg-muted/30 border-border/50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm sm:text-base leading-relaxed">{selectedChapter.summary}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/50">
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Memory Hook
                        </Badge>
                        <span className="text-xs sm:text-sm font-medium">{selectedChapter.memoryHook}</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>

              
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={selectedChapter.chapter <= 1}
                  onClick={() => {
                    const chapters = chaptersByBook.get(selectedChapter.book);
                    const prevChapter = chapters?.find(c => c.chapter === selectedChapter.chapter - 1);
                    if (prevChapter) handleChapterClick(prevChapter);
                  }}
                  className="text-xs sm:text-sm"
                >
                  ← <span className="hidden xs:inline">Previous</span><span className="xs:hidden">Prev</span>
                </Button>
                <Badge className="self-center bg-gradient-to-r from-purple-500 to-pink-500 text-xs">
                  {selectedChapter.imageUrl ? "24FPS" : "Frame"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const chapters = chaptersByBook.get(selectedChapter.book);
                    const nextChapter = chapters?.find(c => c.chapter === selectedChapter.chapter + 1);
                    if (nextChapter) handleChapterClick(nextChapter);
                  }}
                  className="text-xs sm:text-sm"
                >
                  <span className="hidden xs:inline">Next</span><span className="xs:hidden">Next</span> →
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
