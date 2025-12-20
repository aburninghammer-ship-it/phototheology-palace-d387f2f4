import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, Send, Pause, Play, Trash2, BookOpen, 
  Lightbulb, HelpCircle, Clock, AlertCircle 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Commentary {
  id: string;
  sermonPoint: string;
  ptRooms: string[];
  insight: string;
  crossReference: string | null;
  engagementPrompt: string | null;
  floor: number;
  timestamp: Date;
}

interface LiveJeevesCommentaryProps {
  sessionId?: string;
  isLive?: boolean;
}

const PT_ROOM_LABELS: Record<string, string> = {
  SR: "Story Room",
  IR: "Imagination Room",
  "24F": "24FPS",
  BR: "Bible Rendered",
  TR: "Translation",
  GR: "Gems",
  OR: "Observation",
  DC: "Def-Com",
  ST: "Symbols/Types",
  QR: "Questions",
  QA: "Q&A Chains",
  NF: "Nature Freestyle",
  PF: "Personal Freestyle",
  BF: "Bible Freestyle",
  HF: "History Freestyle",
  LR: "Listening Room",
  CR: "Concentration",
  DR: "Dimensions",
  C6: "Connect 6",
  TRm: "Theme Room",
  TZ: "Time Zone",
  PRm: "Patterns",
  "P‖": "Parallels",
  FRt: "Fruit",
  BL: "Blue (Sanctuary)",
  PR: "Prophecy",
  "3A": "Three Angels",
  FRm: "Fire Room",
  MR: "Meditation",
  SRm: "Speed Room",
};

export function LiveJeevesCommentary({ sessionId, isLive = false }: LiveJeevesCommentaryProps) {
  const [inputText, setInputText] = useState("");
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Cooldown timer for rate limiting safeguard
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Auto-scroll to latest commentary
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [commentaries]);

  const generateCommentary = async () => {
    if (!inputText.trim() || isPaused || cooldown > 0) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("live-sermon-commentary", {
        body: { 
          sermonPoint: inputText.trim(),
          sessionId 
        },
      });

      if (error) throw error;

      if (data?.commentary) {
        const newCommentary: Commentary = {
          id: crypto.randomUUID(),
          sermonPoint: inputText.trim(),
          ptRooms: data.commentary.ptRooms || ["CR"],
          insight: data.commentary.insight || "",
          crossReference: data.commentary.crossReference,
          engagementPrompt: data.commentary.engagementPrompt,
          floor: data.commentary.floor || 4,
          timestamp: new Date(),
        };
        setCommentaries(prev => [...prev, newCommentary]);
        setInputText("");
        // Apply cooldown safeguard (10 seconds between requests)
        setCooldown(10);
      }
    } catch (error: any) {
      console.error("Commentary error:", error);
      if (error.message?.includes("429") || error.message?.includes("rate")) {
        toast.error("Rate limited. Please wait before submitting again.");
        setCooldown(30);
      } else {
        toast.error(error.message || "Failed to generate commentary");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateCommentary();
    }
  };

  const clearCommentaries = () => {
    setCommentaries([]);
    toast.success("Commentary cleared");
  };

  const getRoomColor = (room: string) => {
    const floor = getFloorFromRoom(room);
    switch (floor) {
      case 1: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 2: return "bg-green-500/20 text-green-400 border-green-500/30";
      case 3: return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 4: return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case 5: return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getFloorFromRoom = (room: string) => {
    const floor1 = ["SR", "IR", "24F", "BR", "TR", "GR"];
    const floor2 = ["OR", "DC", "ST", "QR", "QA"];
    const floor3 = ["NF", "PF", "BF", "HF", "LR"];
    const floor4 = ["CR", "DR", "C6", "TRm", "TZ", "PRm", "P‖", "FRt"];
    const floor5 = ["BL", "PR", "3A"];
    
    if (floor1.includes(room)) return 1;
    if (floor2.includes(room)) return 2;
    if (floor3.includes(room)) return 3;
    if (floor4.includes(room)) return 4;
    if (floor5.includes(room)) return 5;
    return 4;
  };

  return (
    <Card className="border-primary/30 bg-card/80 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Live Jeeves Commentary
            {isLive && (
              <Badge className="bg-red-500 text-white animate-pulse text-xs">LIVE</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className={isPaused ? "text-yellow-500" : ""}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCommentaries}
              disabled={commentaries.length === 0}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isPaused && (
          <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
            <AlertCircle className="h-4 w-4" />
            Commentary paused - click play to resume
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            placeholder="Enter the current sermon point for Jeeves to comment on..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none"
            disabled={isPaused || isGenerating}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {cooldown > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Wait {cooldown}s
                </span>
              )}
            </div>
            <Button
              onClick={generateCommentary}
              disabled={!inputText.trim() || isPaused || isGenerating || cooldown > 0}
              size="sm"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Get Commentary
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Commentary Feed */}
        <ScrollArea className="h-[400px]" ref={scrollRef}>
          <div className="space-y-4 pr-4">
            {commentaries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Enter a sermon point above and Jeeves will provide<br />
                  instant Phototheology commentary
                </p>
              </div>
            ) : (
              commentaries.map((c) => (
                <Card key={c.id} className="bg-muted/30 border-primary/20">
                  <CardContent className="pt-4 space-y-3">
                    {/* Sermon Point */}
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {c.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <p className="text-sm font-medium text-foreground/90 italic">
                        "{c.sermonPoint}"
                      </p>
                    </div>

                    {/* PT Rooms */}
                    <div className="flex flex-wrap gap-1.5">
                      {c.ptRooms.map((room) => (
                        <Badge 
                          key={room} 
                          variant="outline" 
                          className={`text-xs ${getRoomColor(room)}`}
                        >
                          {room} • {PT_ROOM_LABELS[room] || room}
                        </Badge>
                      ))}
                      <Badge variant="secondary" className="text-xs">
                        Floor {c.floor}
                      </Badge>
                    </div>

                    {/* Insight */}
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                      <p className="text-sm">{c.insight}</p>
                    </div>

                    {/* Cross Reference */}
                    {c.crossReference && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500 shrink-0" />
                        <span className="text-sm text-blue-400">{c.crossReference}</span>
                      </div>
                    )}

                    {/* Engagement Prompt */}
                    {c.engagementPrompt && (
                      <div className="flex items-start gap-2 bg-primary/10 p-2 rounded-md">
                        <HelpCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-primary">{c.engagementPrompt}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
