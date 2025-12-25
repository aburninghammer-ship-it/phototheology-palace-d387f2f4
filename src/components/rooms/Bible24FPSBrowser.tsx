import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Book, Sparkles, X, Palette, Layers } from "lucide-react";
import { allBibleSets, BibleSet, ChapterFrame } from "@/data/bible24fps/allBooks";

interface Bible24FPSBrowserProps {
  onClose?: () => void;
}

// Creative color palettes for sets - rotating through vibrant colors
const SET_COLORS = [
  { bg: "from-emerald-500/20 to-teal-600/20", accent: "text-emerald-400", glow: "shadow-emerald-500/30" },
  { bg: "from-red-500/20 to-orange-600/20", accent: "text-red-400", glow: "shadow-red-500/30" },
  { bg: "from-amber-500/20 to-yellow-600/20", accent: "text-amber-400", glow: "shadow-amber-500/30" },
  { bg: "from-blue-500/20 to-indigo-600/20", accent: "text-blue-400", glow: "shadow-blue-500/30" },
  { bg: "from-purple-500/20 to-violet-600/20", accent: "text-purple-400", glow: "shadow-purple-500/30" },
  { bg: "from-orange-500/20 to-red-600/20", accent: "text-orange-400", glow: "shadow-orange-500/30" },
  { bg: "from-rose-500/20 to-pink-600/20", accent: "text-rose-400", glow: "shadow-rose-500/30" },
  { bg: "from-pink-400/20 to-rose-500/20", accent: "text-pink-400", glow: "shadow-pink-500/30" },
  { bg: "from-cyan-500/20 to-blue-600/20", accent: "text-cyan-400", glow: "shadow-cyan-500/30" },
  { bg: "from-sky-500/20 to-cyan-600/20", accent: "text-sky-400", glow: "shadow-sky-500/30" },
  { bg: "from-yellow-500/20 to-amber-600/20", accent: "text-yellow-400", glow: "shadow-yellow-500/30" },
  { bg: "from-teal-500/20 to-cyan-600/20", accent: "text-teal-400", glow: "shadow-teal-500/30" },
  { bg: "from-fuchsia-500/20 to-purple-600/20", accent: "text-fuchsia-400", glow: "shadow-fuchsia-500/30" },
  { bg: "from-violet-500/20 to-purple-600/20", accent: "text-violet-400", glow: "shadow-violet-500/30" },
  { bg: "from-lime-500/20 to-green-600/20", accent: "text-lime-400", glow: "shadow-lime-500/30" },
  { bg: "from-indigo-500/20 to-blue-600/20", accent: "text-indigo-400", glow: "shadow-indigo-500/30" },
];

const getSetColor = (index: number) => SET_COLORS[index % SET_COLORS.length];

export function Bible24FPSBrowser({ onClose }: Bible24FPSBrowserProps) {
  const [selectedSet, setSelectedSet] = useState<BibleSet | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<ChapterFrame | null>(null);
  const [view, setView] = useState<"sets" | "chapters">("sets");
  
  const oldTestamentSets = allBibleSets.filter(s => s.testament === 'old');
  const newTestamentSets = allBibleSets.filter(s => s.testament === 'new');
  
  const totalSets = allBibleSets.length;
  const totalChapters = allBibleSets.reduce((sum, set) => sum + set.chapters.length, 0);
  
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
  
  const renderSetButton = (set: BibleSet, index: number) => {
    const colors = getSetColor(index);
    const firstSymbol = set.chapters[0]?.symbol || "📖";
    const lastSymbol = set.chapters[set.chapters.length - 1]?.symbol || "📖";
    
    return (
      <Button
        key={set.id}
        variant="outline"
        className={`h-auto p-3 flex flex-col items-start gap-1 border-0 bg-gradient-to-br ${colors.bg} hover:scale-105 hover:shadow-lg ${colors.glow} transition-all duration-300 backdrop-blur-sm`}
        onClick={() => handleSetSelect(set)}
      >
        <div className="flex items-center gap-2 w-full">
          <span className="text-2xl">{firstSymbol}</span>
          <span className="text-lg">→</span>
          <span className="text-2xl">{lastSymbol}</span>
        </div>
        <div className={`text-sm font-bold ${colors.accent} text-left`}>
          {set.label}
        </div>
        <div className="text-[10px] text-muted-foreground text-left line-clamp-1">
          {set.theme}
        </div>
        <Badge variant="secondary" className="text-[9px] px-1.5 py-0 bg-background/50 mt-1">
          {set.chapters.length} chapters
        </Badge>
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
          <div className={`flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r ${currentSetColor.bg}`}>
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
          
          {/* Chapter grid - vibrant cards */}
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pr-4">
              {selectedSet?.chapters.map((chapter, idx) => {
                const hueOffset = (idx * 15) % 360;
                return (
                  <Card
                    key={`${chapter.book}-${chapter.chapter}`}
                    className={`cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl border-0 bg-gradient-to-br ${currentSetColor.bg} hover:brightness-125`}
                    style={{
                      filter: `hue-rotate(${hueOffset}deg)`,
                    }}
                    onClick={() => handleChapterSelect(chapter)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-3xl mb-1 drop-shadow-lg transform transition-transform hover:scale-125">
                        {chapter.symbol}
                      </div>
                      <div className={`text-xs font-bold ${currentSetColor.accent}`}>
                        {chapter.book} {chapter.chapter}
                      </div>
                      <div className="text-[9px] text-muted-foreground line-clamp-1">
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
        <DialogContent className={`max-w-md border-0 bg-gradient-to-br ${currentSetColor.bg} backdrop-blur-xl`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="text-5xl drop-shadow-xl animate-pulse">
                {selectedChapter?.symbol}
              </div>
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
