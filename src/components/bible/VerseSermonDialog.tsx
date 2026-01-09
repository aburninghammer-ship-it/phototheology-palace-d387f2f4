import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  Mic,
  Target,
  Heart,
  BookOpen,
  Building2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// New compact format from PT Sermon Idea Starters
interface SermonIdea {
  title: string;
  hook: string;
  bigIdea: string;
  seedMoves: string[];
  anchorTexts: string[];
  christResolution: string;
  application: string;
  memoryImage?: string | null;
}

interface VerseSermonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseRef: string;
  verseText: string;
}

// PT Palace rooms for sermon generation
const PT_ROOMS = [
  { name: "Observation Room", icon: "👁️", description: "Examine text details - who, what, when, where, why" },
  { name: "Concentration Room", icon: "✝️", description: "Find Christ in every passage (Luke 24:27)" },
  { name: "Fire Room", icon: "🔥", description: "Personal application and spiritual response" },
  { name: "Symbols Room", icon: "🔣", description: "Decode Bible symbols using Scripture's definitions" },
  { name: "Types Room", icon: "📐", description: "Connect OT types to NT antitypes" },
  { name: "Sanctuary Room", icon: "⛪", description: "Use the sanctuary blueprint to understand salvation" },
  { name: "Patterns Room", icon: "🔄", description: "Identify recurring biblical patterns" },
  { name: "Parallels Room", icon: "⚖️", description: "Find parallel stories, themes, and structures" },
  { name: "Prophecy Room", icon: "📜", description: "Interpret prophecy through proper hermeneutics" },
  { name: "Three Angels Room", icon: "👼", description: "The everlasting gospel of Revelation 14" },
  { name: "Story Room", icon: "📖", description: "Visualize Bible narratives as living scenes" },
  { name: "24FPS Room", icon: "🎬", description: "Create mental images for memory retention" },
];

export function VerseSermonDialog({
  open,
  onOpenChange,
  verseRef,
  verseText,
}: VerseSermonDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    "Observation Room",
    "Concentration Room",
    "Fire Room",
  ]);
  const [generating, setGenerating] = useState(false);
  const [idea, setIdea] = useState<SermonIdea | null>(null);
  const [roomsUsed, setRoomsUsed] = useState<string[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const { toast } = useToast();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setIdea(null);
      setExpandedSection(null);
      setShowRoomSelector(false);
    }
  }, [open]);

  const toggleRoom = (roomName: string) => {
    setSelectedRooms((prev) => {
      if (prev.includes(roomName)) {
        if (prev.length <= 1) return prev;
        return prev.filter((r) => r !== roomName);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), roomName];
      }
      return [...prev, roomName];
    });
  };

  const generateIdea = async () => {
    setGenerating(true);
    setIdea(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-sermon-idea", {
        body: {
          passage: `${verseRef}: "${verseText.substring(0, 200)}"`,
          selectedRooms: selectedRooms,
        },
      });

      if (error) throw error;

      if (data?.success && data?.idea) {
        setIdea(data.idea);
        setRoomsUsed(data.roomsUsed || selectedRooms);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating idea:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate sermon idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-amber-500" />
            <span>Sermon Idea Starters</span>
          </DialogTitle>
          <DialogDescription>
            {verseRef} — "{verseText.substring(0, 80)}{verseText.length > 80 ? "..." : ""}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Room Selector */}
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRoomSelector(!showRoomSelector)}
              className="w-full justify-between text-sm mb-2"
            >
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                PT Rooms: {selectedRooms.slice(0, 2).join(", ")}
                {selectedRooms.length > 2 && ` +${selectedRooms.length - 2}`}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showRoomSelector ? "rotate-180" : ""}`} />
            </Button>

            <AnimatePresence>
              {showRoomSelector && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-lg bg-muted/50 border mb-3"
                >
                  <p className="text-xs text-muted-foreground mb-3">
                    Select 1-3 Palace rooms to guide the sermon idea:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PT_ROOMS.map((room) => (
                      <label
                        key={room.name}
                        className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer transition-colors ${
                          selectedRooms.includes(room.name)
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted border border-transparent"
                        }`}
                        title={room.description}
                      >
                        <Checkbox
                          checked={selectedRooms.includes(room.name)}
                          onCheckedChange={() => toggleRoom(room.name)}
                        />
                        <span>{room.icon}</span>
                        <span className="truncate">{room.name.replace(" Room", "")}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            <Button
              onClick={generateIdea}
              disabled={generating}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : idea ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate New Idea
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Sermon Idea
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[50vh]">
            <AnimatePresence mode="wait">
              {generating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 p-4"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Jeeves is crafting a sermon idea...</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Using: {selectedRooms.join(", ")}
                  </p>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </motion.div>
              )}

              {!generating && idea && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-1"
                >
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-lg">{idea.title}</h3>
                  </div>

                  {/* Hook */}
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      🎣 Hook: {idea.hook}
                    </p>
                  </div>

                  {/* Big Idea */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      💡 Big Idea: {idea.bigIdea}
                    </p>
                  </div>

                  {/* Seed Moves */}
                  {idea.seedMoves && idea.seedMoves.length > 0 && (
                    <div>
                      <p className="text-xs font-medium mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Seed Moves:
                      </p>
                      <ul className="space-y-1">
                        {idea.seedMoves.map((move, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-4 relative">
                            <span className="absolute left-0">•</span>
                            {move}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Anchor Texts */}
                  {idea.anchorTexts && idea.anchorTexts.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {idea.anchorTexts.map((text, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <BookOpen className="h-2 w-2 mr-1" />
                          {text}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Christ Resolution */}
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      Christ Resolution:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {idea.christResolution}
                    </p>
                  </div>

                  {/* Application */}
                  <div>
                    <p className="text-xs font-medium mb-1">Application:</p>
                    <p className="text-sm text-muted-foreground italic">
                      {idea.application}
                    </p>
                  </div>

                  {/* Memory Image (if 24FPS was used) */}
                  {idea.memoryImage && (
                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <p className="text-xs font-medium mb-1">🎬 Memory Image:</p>
                      <p className="text-sm text-muted-foreground">
                        {idea.memoryImage}
                      </p>
                    </div>
                  )}

                  {/* Rooms Used */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t">
                    <span className="text-xs text-muted-foreground mr-1">Rooms used:</span>
                    {roomsUsed.map((room, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Building2 className="h-2 w-2 mr-1" />
                        {room}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}

              {!generating && !idea && (
                <div className="text-center py-8 text-muted-foreground">
                  <Mic className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Click "Generate Sermon Idea" to create a PT-powered sermon starter</p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
