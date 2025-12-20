import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, Mic, MicOff, Trash2, BookOpen, 
  Lightbulb, HelpCircle, Clock, AlertCircle, Radio
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useScribe, CommitStrategy } from "@elevenlabs/react";

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

// Minimum text length before triggering commentary
const MIN_TRANSCRIPT_LENGTH = 50;
// Time to wait after speech stops before generating commentary (ms)
const COMMENTARY_DELAY = 3000;

export function LiveJeevesCommentary({ sessionId, isLive = false }: LiveJeevesCommentaryProps) {
  const [commentaries, setCommentaries] = useState<Commentary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [transcriptBuffer, setTranscriptBuffer] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const commentaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processedTextRef = useRef<string>("");

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: CommitStrategy.VAD,
    onPartialTranscript: (data) => {
      setLiveTranscript(data.text);
    },
    onCommittedTranscript: (data) => {
      console.log("Committed transcript:", data.text);
      if (data.text.trim()) {
        setTranscriptBuffer(prev => {
          const newBuffer = prev + " " + data.text.trim();
          return newBuffer.trim();
        });
        setLiveTranscript("");
      }
    },
  });

  // Cooldown timer for rate limiting
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

  // Process transcript buffer and generate commentary
  useEffect(() => {
    if (!transcriptBuffer || isGenerating || cooldown > 0) return;
    
    // Check if we have enough new content to process
    const newContent = transcriptBuffer.slice(processedTextRef.current.length).trim();
    
    if (newContent.length >= MIN_TRANSCRIPT_LENGTH) {
      // Clear any existing timeout
      if (commentaryTimeoutRef.current) {
        clearTimeout(commentaryTimeoutRef.current);
      }
      
      // Wait for a pause in speech before generating
      commentaryTimeoutRef.current = setTimeout(() => {
        generateCommentary(newContent);
      }, COMMENTARY_DELAY);
    }
    
    return () => {
      if (commentaryTimeoutRef.current) {
        clearTimeout(commentaryTimeoutRef.current);
      }
    };
  }, [transcriptBuffer, isGenerating, cooldown]);

  const generateCommentary = async (sermonPoint: string) => {
    if (!sermonPoint.trim() || isGenerating || cooldown > 0) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("live-sermon-commentary", {
        body: { 
          sermonPoint: sermonPoint.trim(),
          sessionId 
        },
      });

      if (error) throw error;

      if (data?.commentary) {
        const newCommentary: Commentary = {
          id: crypto.randomUUID(),
          sermonPoint: sermonPoint.trim(),
          ptRooms: data.commentary.ptRooms || ["CR"],
          insight: data.commentary.insight || "",
          crossReference: data.commentary.crossReference,
          engagementPrompt: data.commentary.engagementPrompt,
          floor: data.commentary.floor || 4,
          timestamp: new Date(),
        };
        setCommentaries(prev => [...prev, newCommentary]);
        // Mark this content as processed
        processedTextRef.current = transcriptBuffer;
        // Apply cooldown (10 seconds between commentaries)
        setCooldown(10);
      }
    } catch (error: unknown) {
      console.error("Commentary error:", error);
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage.includes("429") || errorMessage.includes("rate")) {
        toast.error("Rate limited. Please wait before next commentary.");
        setCooldown(30);
      } else {
        toast.error("Failed to generate commentary");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const startListening = useCallback(async () => {
    setIsConnecting(true);
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");

      if (error) throw error;
      if (!data?.token) {
        throw new Error("No token received");
      }

      // Start the scribe session
      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setIsListening(true);
      toast.success("Jeeves is now listening to the sermon");
    } catch (error) {
      console.error("Failed to start listening:", error);
      toast.error("Failed to start listening. Please check microphone permissions.");
    } finally {
      setIsConnecting(false);
    }
  }, [scribe]);

  const stopListening = useCallback(() => {
    scribe.disconnect();
    setIsListening(false);
    setLiveTranscript("");
    toast.info("Jeeves stopped listening");
  }, [scribe]);

  const clearCommentaries = () => {
    setCommentaries([]);
    setTranscriptBuffer("");
    processedTextRef.current = "";
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
            {isListening && (
              <Badge className="bg-red-500 text-white animate-pulse text-xs">LISTENING</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Listening Controls */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            {!isListening ? (
              <Button
                onClick={startListening}
                disabled={isConnecting}
                className="flex-1"
                variant="default"
              >
                {isConnecting ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={stopListening}
                variant="destructive"
                className="flex-1"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </Button>
            )}
            
            {cooldown > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Next in {cooldown}s
              </span>
            )}
          </div>

          {/* Live Transcript Display */}
          {isListening && (
            <div className="bg-muted/30 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="h-4 w-4 text-red-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Live Transcript</span>
              </div>
              <p className="text-sm text-foreground/80 min-h-[40px]">
                {liveTranscript || transcriptBuffer.slice(-200) || "Listening for sermon..."}
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex items-center gap-2 text-primary text-sm">
              <div className="h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
              Generating commentary...
            </div>
          )}
        </div>

        {/* Commentary Feed */}
        <ScrollArea className="h-[350px]" ref={scrollRef}>
          <div className="space-y-4 pr-4">
            {commentaries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">
                  Click "Start Listening" and Jeeves will automatically<br />
                  provide Phototheology commentary as the sermon plays
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
                      <p className="text-sm font-medium text-foreground/90 italic line-clamp-2">
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
