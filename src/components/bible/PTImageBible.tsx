import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BIBLE_BOOKS, CHAPTER_COUNTS } from "@/types/bible";
import { Image, ChevronDown, ChevronRight, Camera, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { genesisImages } from "@/assets/24fps/genesis";

// Genesis chapter data from 24FPS room
const genesisChapterData = [
  { chapter: 1, title: "Creation", summary: "God creates heavens, earth, light, sky, land, sea, plants, sun, moon, stars, fish, birds, animals, and mankind in 6 days.", memoryHook: "1 God, 1 creation", symbol: "🌍" },
  { chapter: 2, title: "Eden & Marriage", summary: "God rests on 7th day. Garden of Eden created. Adam formed from dust. Eve from Adam's rib. Marriage instituted.", memoryHook: "2 become 1 flesh", symbol: "💑" },
  { chapter: 3, title: "The Fall", summary: "Serpent tempts Eve. Adam and Eve eat forbidden fruit. Sin enters. Curses pronounced. Expelled from Eden.", memoryHook: "3 curses (serpent, woman, man)", symbol: "🐍" },
  { chapter: 4, title: "Cain & Abel", summary: "Cain kills Abel. Cain marked and sent away. Seth born to replace Abel.", memoryHook: "4th person (Cain) kills", symbol: "🩸" },
  { chapter: 5, title: "Genealogy to Noah", summary: "Genealogy from Adam to Noah through Seth. Enoch walks with God and is taken. Methuselah lives 969 years.", memoryHook: "5 fingers count generations", symbol: "📜" },
  { chapter: 6, title: "Wickedness & Ark", summary: "Wickedness fills earth. God regrets making man. Noah finds grace. Instructions for ark given.", memoryHook: "6 = man's number fails", symbol: "⚠️" },
  { chapter: 7, title: "The Flood", summary: "Noah enters ark with family and animals. Rain 40 days. All flesh dies. Waters prevail 150 days.", memoryHook: "7 pairs of clean animals", symbol: "🌧️" },
  { chapter: 8, title: "Waters Recede", summary: "Waters recede. Dove sent. Ark rests on Ararat. Noah exits and sacrifices. God promises no more flood.", memoryHook: "8 souls saved (new beginning)", symbol: "🕊️" },
  { chapter: 9, title: "Rainbow Covenant", summary: "God blesses Noah. Rainbow covenant. Noah plants vineyard, gets drunk. Ham's sin. Canaan cursed.", memoryHook: "9 = rainbow's arc", symbol: "🌈" },
  { chapter: 10, title: "Table of Nations", summary: "Genealogy of Noah's sons: Japheth, Ham, Shem. Nations spread across earth.", memoryHook: "10 = complete spread of nations", symbol: "🗺️" },
  { chapter: 11, title: "Tower of Babel", summary: "Tower of Babel built. God confuses languages. People scattered. Genealogy from Shem to Abram.", memoryHook: "11 = 2 towers (1+1) reaching up", symbol: "🗼" },
  { chapter: 12, title: "Abram's Call", summary: "God calls Abram to leave Ur. Promise of great nation. Abram goes to Canaan, then Egypt. Sarai taken by Pharaoh.", memoryHook: "12 = 12 tribes begin here", symbol: "🚶" },
  { chapter: 13, title: "Abram & Lot Separate", summary: "Abram and Lot separate due to strife. Lot chooses Sodom. God reconfirms promise to Abram.", memoryHook: "13 = unlucky choice (Lot)", symbol: "↔️" },
  { chapter: 14, title: "Abram Rescues Lot", summary: "War of kings. Lot captured. Abram rescues Lot with 318 men. Melchizedek blesses Abram.", memoryHook: "14 = 1 rescuer, 4 kings defeated", symbol: "⚔️" },
  { chapter: 15, title: "Covenant of Stars", summary: "God promises heir and descendants like stars. Abram believes, counted as righteousness. Covenant ceremony.", memoryHook: "15 = countless stars", symbol: "✨" },
  { chapter: 16, title: "Hagar & Ishmael", summary: "Sarai gives Hagar to Abram. Hagar conceives, flees. Angel finds her. Ishmael born.", memoryHook: "16 = Hagar's wilderness age", symbol: "🏜️" },
  { chapter: 17, title: "Circumcision Covenant", summary: "Abram becomes Abraham (99). Sarai becomes Sarah. Circumcision instituted. Isaac promised.", memoryHook: "17 = 1 cut, 7 (covenant) sealed", symbol: "✂️" },
  { chapter: 18, title: "Three Visitors", summary: "Three visitors promise Isaac. Abraham intercedes for Sodom. Negotiates from 50 to 10 righteous.", memoryHook: "18 = 1+8 = 9, but need 10", symbol: "👥" },
  { chapter: 19, title: "Sodom Destroyed", summary: "Angels rescue Lot. Sodom and Gomorrah destroyed. Lot's wife becomes salt pillar. Lot's daughters' sin.", memoryHook: "19 = destruction judgment", symbol: "🔥" },
  { chapter: 20, title: "Abraham & Abimelech", summary: "Abraham says Sarah is sister. Abimelech takes Sarah. God warns in dream. Sarah restored.", memoryHook: "20 = 2nd time Abraham lies", symbol: "👑" },
  { chapter: 21, title: "Isaac Born", summary: "Isaac born. Hagar and Ishmael sent away. God provides well. Covenant with Abimelech.", memoryHook: "21 = laughter fulfilled", symbol: "👶" },
  { chapter: 22, title: "Abraham Tested", summary: "God tests Abraham to sacrifice Isaac. Angel stops him. Ram provided. Blessings confirmed.", memoryHook: "22 = 2 (father+son) ascending", symbol: "🐏" },
  { chapter: 23, title: "Sarah Dies", summary: "Sarah dies at 127. Abraham buys cave of Machpelah from Hittites for burial.", memoryHook: "23 = death chapter", symbol: "⚰️" },
  { chapter: 24, title: "Isaac's Bride", summary: "Abraham sends servant to find wife for Isaac. Rebekah found at well. She returns to marry Isaac.", memoryHook: "24 elders witness (bride found)", symbol: "💍" },
  { chapter: 25, title: "Esau Sells Birthright", summary: "Abraham dies. Rebekah conceives twins. Esau sells birthright to Jacob for pottage.", memoryHook: "25 = 2 twins, 5 fingers grabbing", symbol: "🍲" },
  { chapter: 26, title: "Isaac's Wells", summary: "Isaac dwells in Gerar, digs wells. God confirms covenant. Esau marries Hittite women.", memoryHook: "26 = wells dug and redug", symbol: "💧" },
  { chapter: 27, title: "Jacob Steals Blessing", summary: "Jacob deceives Isaac with goat skins, steals Esau's blessing. Esau vows revenge.", memoryHook: "27 = deception complete", symbol: "🐐" },
  { chapter: 28, title: "Jacob's Ladder", summary: "Jacob flees to Haran. Dreams of ladder to heaven. God confirms covenant. Vows to tithe.", memoryHook: "28 = ladder rungs ascending", symbol: "🪜" },
  { chapter: 29, title: "Jacob Marries", summary: "Jacob works 7 years for Rachel, given Leah. Works 7 more for Rachel. Leah bears sons.", memoryHook: "29 = 2 wives, 9 years total", symbol: "👰" },
  { chapter: 30, title: "Jacob's Children", summary: "Leah and Rachel compete for children. Jacob's flocks multiply through striped rods.", memoryHook: "30 = multiplication of sons", symbol: "🐑" },
  { chapter: 31, title: "Jacob Flees Laban", summary: "Jacob secretly flees. Rachel steals idols. Laban pursues. Mizpah covenant made.", memoryHook: "31 = separation covenant", symbol: "🏃" },
  { chapter: 32, title: "Wrestling with God", summary: "Jacob sends gifts to Esau. Wrestles all night. Name changed to Israel. Hip dislocated.", memoryHook: "32 = wrestling til dawn", symbol: "💪" },
  { chapter: 33, title: "Jacob Meets Esau", summary: "Jacob and Esau reconcile. Jacob settles in Shechem, builds altar.", memoryHook: "33 = brothers reunite", symbol: "🤝" },
  { chapter: 34, title: "Dinah's Tragedy", summary: "Dinah violated. Simeon and Levi deceive and slaughter Shechem's men.", memoryHook: "34 = tragedy and revenge", symbol: "⚔️" },
  { chapter: 35, title: "Return to Bethel", summary: "Jacob returns to Bethel. Rachel dies birthing Benjamin. Isaac dies.", memoryHook: "35 = 3 deaths recorded", symbol: "🪦" },
  { chapter: 36, title: "Esau's Descendants", summary: "Genealogy of Esau (Edom). Chiefs and kings of Edom listed.", memoryHook: "36 = Esau's 36 chiefs", symbol: "👥" },
  { chapter: 37, title: "Joseph's Dreams", summary: "Joseph dreams of sheaves and stars bowing. Brothers sell him. Jacob mourns.", memoryHook: "37 = dreamer sold", symbol: "⭐" },
  { chapter: 38, title: "Judah & Tamar", summary: "Judah's sons die. Tamar disguises herself, conceives twins by Judah.", memoryHook: "38 = Judah's detour", symbol: "🎭" },
  { chapter: 39, title: "Potiphar's House", summary: "Joseph prospers with Potiphar. Resists wife. Falsely accused. Imprisoned.", memoryHook: "39 = 3 positions, 9 suffering", symbol: "🔒" },
  { chapter: 40, title: "Butler & Baker", summary: "Joseph interprets dreams. Butler restored, baker executed. Butler forgets Joseph.", memoryHook: "40 = 4 life, 0 death", symbol: "🍷" },
  { chapter: 41, title: "Pharaoh's Dreams", summary: "Pharaoh dreams of cows and grain. Joseph interprets. Made ruler of Egypt.", memoryHook: "41 = Joseph rises", symbol: "👑" },
  { chapter: 42, title: "Brothers to Egypt", summary: "Famine. Brothers come for grain. Joseph recognizes them. Simeon kept.", memoryHook: "42 = 10 brothers bow", symbol: "🌾" },
  { chapter: 43, title: "Benjamin Goes", summary: "Brothers return with Benjamin. Joseph weeps privately. Feast prepared.", memoryHook: "43 = feast with Benjamin", symbol: "🎊" },
  { chapter: 44, title: "Silver Cup Test", summary: "Cup planted in Benjamin's sack. Judah pleads for Benjamin's life.", memoryHook: "44 = cup test passed", symbol: "🏆" },
  { chapter: 45, title: "Joseph Revealed", summary: "Joseph reveals himself. Weeps aloud. Invites family to Egypt.", memoryHook: "45 = revelation weeping", symbol: "😭" },
  { chapter: 46, title: "Jacob to Egypt", summary: "Jacob travels to Egypt with 70 souls. God confirms journey at Beersheba.", memoryHook: "46 = 70 souls descend", symbol: "🐪" },
  { chapter: 47, title: "Before Pharaoh", summary: "Jacob blesses Pharaoh. Family in Goshen. Joseph manages famine.", memoryHook: "47 = Goshen settlement", symbol: "🙏" },
  { chapter: 48, title: "Ephraim & Manasseh", summary: "Jacob adopts Joseph's sons. Blesses Ephraim over Manasseh with crossed hands.", memoryHook: "48 = crossed hands blessing", symbol: "✋" },
  { chapter: 49, title: "Jacob's Prophecies", summary: "Jacob prophesies over 12 sons. Lion of Judah. Shiloh. Dies after blessing.", memoryHook: "49 = 12 tribes prophecy", symbol: "🦁" },
  { chapter: 50, title: "Burial & Death", summary: "Jacob buried in Canaan. Joseph reassures brothers. Joseph dies at 110.", memoryHook: "50 = Genesis complete", symbol: "⚰️" },
];

interface SelectedChapter {
  book: string;
  chapter: number;
  title: string;
  summary: string;
  memoryHook: string;
  symbol: string;
  imageUrl: string;
}

export function PTImageBible() {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set(["Genesis"]));
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapter | null>(null);

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

  const hasImagesForBook = (book: string): boolean => {
    return book === "Genesis"; // Only Genesis has 24FPS images for now
  };

  const getImageForChapter = (book: string, chapter: number): string | null => {
    if (book === "Genesis" && chapter >= 1 && chapter <= 50) {
      return genesisImages[chapter - 1];
    }
    return null;
  };

  const getChapterData = (book: string, chapter: number) => {
    if (book === "Genesis") {
      return genesisChapterData.find(c => c.chapter === chapter);
    }
    return null;
  };

  const handleChapterClick = (book: string, chapter: number) => {
    const imageUrl = getImageForChapter(book, chapter);
    const data = getChapterData(book, chapter);
    
    if (imageUrl && data) {
      setSelectedChapter({
        book,
        chapter,
        title: data.title,
        summary: data.summary,
        memoryHook: data.memoryHook,
        symbol: data.symbol,
        imageUrl
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold">PT Image Bible</h3>
          <p className="text-sm text-muted-foreground">
            Visual frames for every chapter • 24FPS Room imagery
          </p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          50 Genesis Frames
        </Badge>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-2">
          {BIBLE_BOOKS.map((book) => {
            const chapterCount = getChapterCount(book);
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
                        {chapterCount} ch
                      </Badge>
                    </div>
                    {hasImages && (
                      <Badge className="bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white">
                        <Image className="h-3 w-3 mr-1" />
                        {chapterCount} frames
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
                    {hasImages ? (
                      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                        {Array.from({ length: chapterCount }, (_, i) => i + 1).map(
                          (chapter) => {
                            const imageUrl = getImageForChapter(book, chapter);
                            const data = getChapterData(book, chapter);
                            
                            return (
                              <button
                                key={chapter}
                                onClick={() => handleChapterClick(book, chapter)}
                                className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-primary transition-all hover:scale-105 hover:shadow-lg"
                                title={data ? `${book} ${chapter}: ${data.title}` : `${book} ${chapter}`}
                              >
                                {imageUrl ? (
                                  <>
                                    <img
                                      src={imageUrl}
                                      alt={`${book} ${chapter}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-1 text-center">
                                      <span className="text-[10px] font-bold text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        {chapter}
                                      </span>
                                    </div>
                                    <div className="absolute top-1 right-1 text-sm opacity-70 group-hover:opacity-100">
                                      {data?.symbol}
                                    </div>
                                  </>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-muted/50 text-muted-foreground text-xs">
                                    {chapter}
                                  </div>
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 gap-1.5">
                        {Array.from({ length: chapterCount }, (_, i) => i + 1).map(
                          (chapter) => (
                            <Button
                              key={chapter}
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-xs border-border/50 text-muted-foreground"
                              disabled
                              title={`No image for ${book} ${chapter}`}
                            >
                              {chapter}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>

      {/* Image Preview Dialog */}
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
              <div className="relative rounded-lg overflow-hidden bg-muted/20">
                <img
                  src={selectedChapter.imageUrl}
                  alt={`${selectedChapter.book} ${selectedChapter.chapter}`}
                  className="w-full h-auto max-h-[50vh] object-contain"
                />
              </div>
              
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
                    if (selectedChapter.chapter > 1) {
                      handleChapterClick(selectedChapter.book, selectedChapter.chapter - 1);
                    }
                  }}
                >
                  ← Previous
                </Button>
                <Badge className="self-center bg-gradient-to-r from-purple-500 to-pink-500">
                  24FPS Frame
                </Badge>
                <Button
                  variant="outline"
                  disabled={selectedChapter.chapter >= 50}
                  onClick={() => {
                    if (selectedChapter.chapter < 50) {
                      handleChapterClick(selectedChapter.book, selectedChapter.chapter + 1);
                    }
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
