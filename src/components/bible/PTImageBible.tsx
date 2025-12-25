import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BIBLE_BOOKS, CHAPTER_COUNTS } from "@/types/bible";
import { Image, ChevronDown, ChevronRight, Loader2, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BibleImage {
  id: string;
  room_type: string;
  description: string;
  verse_reference: string | null;
  image_url: string;
  book: string | null;
  chapter: number | null;
}

interface ChapterImageMap {
  [book: string]: {
    [chapter: number]: BibleImage;
  };
}

export function PTImageBible() {
  const [images, setImages] = useState<BibleImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set(["Genesis"]));
  const [selectedImage, setSelectedImage] = useState<BibleImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("bible_images")
        .select("id, room_type, description, verse_reference, image_url, book, chapter")
        .not("book", "is", null)
        .not("chapter", "is", null)
        .order("book")
        .order("chapter");

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a map of book -> chapter -> image
  const imageMap: ChapterImageMap = {};
  images.forEach((img) => {
    if (img.book && img.chapter) {
      if (!imageMap[img.book]) imageMap[img.book] = {};
      imageMap[img.book][img.chapter] = img;
    }
  });

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

  const getChapterCount = (book: string): number => {
    return CHAPTER_COUNTS[book] || 50;
  };

  const getImagesForBook = (book: string): number => {
    return Object.keys(imageMap[book] || {}).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">PT Image Bible</h3>
          <p className="text-sm text-muted-foreground">
            Visual memories for every chapter • {images.length} images stored
          </p>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {BIBLE_BOOKS.map((book) => {
            const chapterCount = getChapterCount(book);
            const imagesCount = getImagesForBook(book);
            const isExpanded = expandedBooks.has(book);
            const hasImages = imagesCount > 0;

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
                        {chapterCount} ch
                      </Badge>
                    </div>
                    {hasImages && (
                      <Badge className="bg-primary/30 text-primary-foreground">
                        <Image className="h-3 w-3 mr-1" />
                        {imagesCount}
                      </Badge>
                    )}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-8 pr-2 py-3"
                  >
                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5">
                      {Array.from({ length: chapterCount }, (_, i) => i + 1).map(
                        (chapter) => {
                          const hasImage = imageMap[book]?.[chapter];
                          
                          return (
                            <Button
                              key={chapter}
                              variant={hasImage ? "default" : "outline"}
                              size="sm"
                              className={`h-8 w-8 p-0 text-xs ${
                                hasImage
                                  ? "bg-primary hover:bg-primary/90"
                                  : "border-border/50 text-muted-foreground hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                if (hasImage) {
                                  setSelectedImage(hasImage);
                                }
                              }}
                              disabled={!hasImage}
                              title={hasImage ? `View ${book} ${chapter}` : `No image for ${book} ${chapter}`}
                            >
                              {hasImage ? (
                                <Image className="h-3 w-3" />
                              ) : (
                                chapter
                              )}
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              {selectedImage?.book} {selectedImage?.chapter}
            </DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-muted/20">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.description}
                  className="w-full h-auto max-h-[50vh] object-contain"
                />
              </div>
              
              <Card className="p-4 bg-muted/30 border-border/50">
                <h4 className="font-semibold text-lg mb-2">{selectedImage.description}</h4>
                {selectedImage.verse_reference && (
                  <p className="text-sm text-muted-foreground">
                    Reference: {selectedImage.verse_reference}
                  </p>
                )}
                <Badge variant="outline" className="mt-2">
                  {selectedImage.room_type === "24fps" ? "24FPS Room" : "Translation Room"}
                </Badge>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
