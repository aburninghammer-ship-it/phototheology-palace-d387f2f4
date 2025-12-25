import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Book, Sparkles, X, Layers, ImageIcon, Wand2, Loader2 } from "lucide-react";
import { allBibleSets, BibleSet, ChapterFrame } from "@/data/bible24fps/allBooks";
import { genesisImages } from "@/assets/24fps/genesis";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Bible24FPSBrowserProps {
  onClose?: () => void;
}

// Get image for a chapter - uses Genesis images for Genesis, falls back to database or null
const getChapterImage = (chapter: ChapterFrame, generatedImages: Map<string, string>): string | null => {
  // Check for generated images first
  const key = `${chapter.book}-${chapter.chapter}`;
  if (generatedImages.has(key)) {
    return generatedImages.get(key)!;
  }
  // Fall back to static Genesis images
  if (chapter.book === "Genesis" && chapter.chapter >= 1 && chapter.chapter <= 50) {
    return genesisImages[chapter.chapter - 1];
  }
  return chapter.imageUrl || null;
};

// Creative color palettes for sets - rotating through vibrant colors
const SET_COLORS = [
  { bg: "from-emerald-500/20 to-teal-600/20", accent: "text-emerald-400", glow: "shadow-emerald-500/30", border: "border-emerald-500/30" },
  { bg: "from-red-500/20 to-orange-600/20", accent: "text-red-400", glow: "shadow-red-500/30", border: "border-red-500/30" },
  { bg: "from-amber-500/20 to-yellow-600/20", accent: "text-amber-400", glow: "shadow-amber-500/30", border: "border-amber-500/30" },
  { bg: "from-blue-500/20 to-indigo-600/20", accent: "text-blue-400", glow: "shadow-blue-500/30", border: "border-blue-500/30" },
  { bg: "from-purple-500/20 to-violet-600/20", accent: "text-purple-400", glow: "shadow-purple-500/30", border: "border-purple-500/30" },
  { bg: "from-orange-500/20 to-red-600/20", accent: "text-orange-400", glow: "shadow-orange-500/30", border: "border-orange-500/30" },
  { bg: "from-rose-500/20 to-pink-600/20", accent: "text-rose-400", glow: "shadow-rose-500/30", border: "border-rose-500/30" },
  { bg: "from-pink-400/20 to-rose-500/20", accent: "text-pink-400", glow: "shadow-pink-500/30", border: "border-pink-500/30" },
  { bg: "from-cyan-500/20 to-blue-600/20", accent: "text-cyan-400", glow: "shadow-cyan-500/30", border: "border-cyan-500/30" },
  { bg: "from-sky-500/20 to-cyan-600/20", accent: "text-sky-400", glow: "shadow-sky-500/30", border: "border-sky-500/30" },
  { bg: "from-yellow-500/20 to-amber-600/20", accent: "text-yellow-400", glow: "shadow-yellow-500/30", border: "border-yellow-500/30" },
  { bg: "from-teal-500/20 to-cyan-600/20", accent: "text-teal-400", glow: "shadow-teal-500/30", border: "border-teal-500/30" },
  { bg: "from-fuchsia-500/20 to-purple-600/20", accent: "text-fuchsia-400", glow: "shadow-fuchsia-500/30", border: "border-fuchsia-500/30" },
  { bg: "from-violet-500/20 to-purple-600/20", accent: "text-violet-400", glow: "shadow-violet-500/30", border: "border-violet-500/30" },
  { bg: "from-lime-500/20 to-green-600/20", accent: "text-lime-400", glow: "shadow-lime-500/30", border: "border-lime-500/30" },
  { bg: "from-indigo-500/20 to-blue-600/20", accent: "text-indigo-400", glow: "shadow-indigo-500/30", border: "border-indigo-500/30" },
];

const getSetColor = (index: number) => SET_COLORS[index % SET_COLORS.length];

export function Bible24FPSBrowser({ onClose }: Bible24FPSBrowserProps) {
  const [selectedSet, setSelectedSet] = useState<BibleSet | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterFrame | null>(null);
  const [view, setView] = useState<"sets" | "chapters">("sets");
  const [generatedImages, setGeneratedImages] = useState<Map<string, string>>(new Map());
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  
  const oldTestamentSets = allBibleSets.filter(s => s.testament === 'old');
  const newTestamentSets = allBibleSets.filter(s => s.testament === 'new');
  
  const totalSets = allBibleSets.length;
  const totalChapters = allBibleSets.reduce((sum, set) => sum + set.chapters.length, 0);

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

      toast.success(`Generated image for ${chapter.book} ${chapter.chapter}`);
    } catch (err: any) {
      console.error("Error generating image:", err);
      toast.error(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSetSelect = (set: BibleSet) => {
    setSelectedSet(set);
    setView("chapters");
  };
  
  const handleChapterSelect = (chapter: ChapterFrame) => {
    setSelectedChapter(chapter);
  };
  
  const handleBack = () => {
    if (view === "chapters") {
      setView("sets");
      setSelectedSet(null);
    }
  };
  
  const navigateChapter = (direction: "prev" | "next") => {
    if (!selectedChapter || !selectedSet) return;
    const chapters = selectedSet.chapters;
    const currentIndex = chapters.findIndex(c => c.chapter === selectedChapter.chapter && c.book === selectedChapter.book);
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < chapters.length) {
      setSelectedChapter(chapters[newIndex]);
    }
  };
  
  const currentSetIndex = selectedSet ? allBibleSets.indexOf(selectedSet) : 0;
  const currentSetColor = getSetColor(currentSetIndex);
  
  // Check if a set has images (Genesis sets have images or any generated images)
  const setHasImages = (set: BibleSet) => {
    return set.chapters.some(ch => 
      ch.book === "Genesis" || generatedImages.has(`${ch.book}-${ch.chapter}`)
    );
  };
  
  const renderSetButton = (set: BibleSet, index: number) => {
    const colors = getSetColor(index);
    const hasImages = setHasImages(set);
    
    // Get preview images for sets with Genesis chapters
    const previewChapters = set.chapters.filter(ch => ch.book === "Genesis").slice(0, 3);
    
    return (
      <Button
        key={set.id}
        variant="outline"
        className={`h-auto p-3 flex flex-col items-start gap-1 border ${colors.border} bg-gradient-to-br ${colors.bg} hover:scale-105 hover:shadow-lg ${colors.glow} transition-all duration-300 backdrop-blur-sm relative overflow-hidden`}
        onClick={() => handleSetSelect(set)}
      >
        {/* Preview images for Genesis sets */}
        {hasImages && previewChapters.length > 0 ? (
          <div className="flex items-center gap-1 w-full mb-1">
            {previewChapters.map((ch, i) => (
              <div key={i} className="w-8 h-8 rounded overflow-hidden border border-white/20">
                <img 
                  src={getChapterImage(ch, generatedImages) || ''} 
                  alt={`${ch.book} ${ch.chapter}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {set.chapters.length > 3 && (
              <span className="text-xs text-muted-foreground">+{set.chapters.length - 3}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <span className="text-2xl">{set.chapters[0]?.symbol || "📖"}</span>
            <span className="text-lg">→</span>
            <span className="text-2xl">{set.chapters[set.chapters.length - 1]?.symbol || "📖"}</span>
          </div>
        )}
        <div className={`text-sm font-bold ${colors.accent} text-left`}>
          {set.label}
        </div>
        <div className="text-[10px] text-muted-foreground text-left line-clamp-1">
          {set.theme}
        </div>
        <div className="flex gap-1 mt-1">
          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-background/50">
            {set.chapters.length} chapters
          </Badge>
          {hasImages && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/50 text-primary">
              <ImageIcon className="h-2.5 w-2.5 mr-0.5" />
              Images
            </Badge>
          )}
        </div>
      </Button>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">24FPS Bible Sets</h2>
            <p className="text-xs text-muted-foreground">All 50 Memorization Sets</p>
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
      {view === "sets" ? (
        <Tabs defaultValue="old" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="old" className="gap-2">
              <Book className="h-4 w-4" />
              Old Testament ({oldTestamentSets.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="gap-2">
              <Sparkles className="h-4 w-4" />
              New Testament ({newTestamentSets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="old" className="mt-4">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-4">
                {oldTestamentSets.map((set, idx) => renderSetButton(set, idx))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="new" className="mt-4">
            <ScrollArea className="h-[450px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pr-4">
                {newTestamentSets.map((set, idx) => renderSetButton(set, oldTestamentSets.length + idx))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {/* Back button and set title */}
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${currentSetColor.bg} border ${currentSetColor.border}`}>
            <Button variant="ghost" size="sm" onClick={handleBack} className="shrink-0">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex-1">
              <h3 className={`text-lg font-bold ${currentSetColor.accent}`}>{selectedSet?.label}</h3>
              <p className="text-xs text-muted-foreground">{selectedSet?.theme}</p>
            </div>
            <Badge variant="secondary" className="bg-background/50">
              {selectedSet?.chapters.length} chapters
            </Badge>
          </div>
          
          {/* Chapter grid - with images when available */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pr-4">
              {selectedSet?.chapters.map((chapter, idx) => {
                const imageUrl = getChapterImage(chapter, generatedImages);
                
                return (
                  <Card
                    key={`${chapter.book}-${chapter.chapter}`}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border ${currentSetColor.border} bg-gradient-to-br ${currentSetColor.bg} overflow-hidden group`}
                    onClick={() => handleChapterSelect(chapter)}
                  >
                    <CardContent className="p-0">
                      {/* Image or Symbol */}
                      <div className="relative aspect-square">
                        {imageUrl ? (
                          <img 
                            src={imageUrl}
                            alt={`${chapter.book} ${chapter.chapter}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30">
                            <span className="text-4xl drop-shadow-lg transform transition-transform group-hover:scale-125">
                              {chapter.symbol}
                            </span>
                          </div>
                        )}
                        {/* Overlay with chapter info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <div className="text-white text-xs font-bold">
                            {chapter.book} {chapter.chapter}
                          </div>
                          <div className="text-white/70 text-[9px] line-clamp-1">
                            {chapter.title}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {/* Chapter Detail Dialog - Enhanced with image */}
      <Dialog open={!!selectedChapter} onOpenChange={(open) => !open && setSelectedChapter(null)}>
        <DialogContent className={`max-w-md border ${currentSetColor.border} bg-gradient-to-br ${currentSetColor.bg} backdrop-blur-xl`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {/* Image or Symbol */}
              {(() => {
                const imageUrl = selectedChapter ? getChapterImage(selectedChapter, generatedImages) : null;
                return imageUrl ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                    <img 
                      src={imageUrl}
                      alt={`${selectedChapter?.book} ${selectedChapter?.chapter}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-5xl drop-shadow-xl animate-pulse">
                    {selectedChapter?.symbol}
                  </div>
                );
              })()}
              <div>
                <div className={`text-xl font-bold ${currentSetColor.accent}`}>
                  {selectedChapter?.book} {selectedChapter?.chapter}
                </div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedChapter?.title}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Full image preview or Generate button */}
            {(() => {
              const imageUrl = selectedChapter ? getChapterImage(selectedChapter, generatedImages) : null;
              return imageUrl ? (
                <div className="rounded-lg overflow-hidden border border-white/20 shadow-lg">
                  <img 
                    src={imageUrl}
                    alt={`${selectedChapter?.book} ${selectedChapter?.chapter}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-white/20 p-6 text-center bg-background/20">
                  <div className="text-5xl mb-3">{selectedChapter?.symbol}</div>
                  <p className="text-sm text-muted-foreground mb-3">No unique image yet</p>
                  <Button
                    size="sm"
                    onClick={() => selectedChapter && generateImageForChapter(selectedChapter)}
                    disabled={isGenerating || !user}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 mr-1" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  {!user && <p className="text-xs text-muted-foreground mt-2">Sign in to generate</p>}
                </div>
              );
            })()}
            
            {/* Summary */}
            <div className="bg-background/50 backdrop-blur rounded-lg p-4">
              <h4 className={`text-sm font-semibold ${currentSetColor.accent} mb-2 flex items-center gap-2`}>
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
                <Sparkles className={`h-4 w-4 ${currentSetColor.accent} animate-pulse`} />
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
                disabled={!selectedChapter || !selectedSet || selectedSet.chapters.indexOf(selectedChapter) === 0}
                className="bg-background/50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateChapter("next")}
                disabled={!selectedChapter || !selectedSet || selectedSet.chapters.indexOf(selectedChapter) === selectedSet.chapters.length - 1}
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
