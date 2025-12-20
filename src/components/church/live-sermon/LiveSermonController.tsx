import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Radio, RefreshCw, BookOpen, Lightbulb, HelpCircle, Landmark, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LiveJeevesCommentary } from "./LiveJeevesCommentary";

interface StudyCard {
  id: string;
  card_type: string;
  sermon_point: string;
  pt_rooms: string[];
  floor_number: number | null;
  cross_references: string[];
  reflection_question: string | null;
  sanctuary_connection: string | null;
  created_at: string;
}

interface LiveSermonControllerProps {
  sessionId: string;
  onEnd: () => void;
  onBack: () => void;
}

export function LiveSermonController({ sessionId, onEnd, onBack }: LiveSermonControllerProps) {
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [session, setSession] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadSession();
    loadCards();

    // Subscribe to realtime updates for new cards
    const channel = supabase
      .channel(`sermon-cards-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sermon_study_cards",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          setCards((prev) => [...prev, payload.new as StudyCard]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const loadSession = async () => {
    const { data } = await supabase
      .from("live_sermon_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();
    
    if (data) setSession(data);
  };

  const loadCards = async () => {
    const { data } = await supabase
      .from("sermon_study_cards")
      .select("*")
      .eq("session_id", sessionId)
      .order("display_order", { ascending: true });
    
    if (data) setCards(data);
  };

  const generateCards = async () => {
    if (!session?.sermon_outline) {
      toast.error("No sermon outline found");
      return;
    }

    setIsGenerating(true);
    try {
      const { error } = await supabase.functions.invoke("generate-sermon-cards", {
        body: { sessionId },
      });

      if (error) throw error;
      toast.success("Study cards generated!");
      loadCards();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate cards");
    } finally {
      setIsGenerating(false);
    }
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "pt_tag":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "cross_reference":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "reflection":
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      case "sanctuary":
        return <Landmark className="h-4 w-4 text-amber-500" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCardLabel = (type: string) => {
    switch (type) {
      case "pt_tag":
        return "PT Room";
      case "cross_reference":
        return "Cross-Reference";
      case "reflection":
        return "Reflection";
      case "sanctuary":
        return "Sanctuary";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {session?.status === "live" && (
            <Badge className="bg-red-500 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          )}
        </div>
      </div>

      {/* Session Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{session?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={generateCards}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating..." : "Generate Study Cards"}
            </Button>
            {session?.status === "live" && (
              <Button variant="destructive" size="sm" onClick={onEnd}>
                End Session
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content: Jeeves Commentary + Study Cards */}
      <Tabs defaultValue="jeeves" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur">
          <TabsTrigger value="jeeves" className="gap-2">
            <Bot className="h-4 w-4" />
            Live Jeeves Commentary
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Study Cards ({cards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jeeves">
          <LiveJeevesCommentary 
            sessionId={sessionId} 
            isLive={session?.status === "live"} 
          />
        </TabsContent>

        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Study Cards ({cards.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {cards.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No study cards yet. Click "Generate Study Cards" to create them from your outline.
                    </p>
                  ) : (
                    cards.map((card) => (
                      <Card key={card.id} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {getCardIcon(card.card_type)}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getCardLabel(card.card_type)}
                                </Badge>
                                {card.floor_number && (
                                  <Badge variant="secondary" className="text-xs">
                                    Floor {card.floor_number}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm font-medium">{card.sermon_point}</p>
                              
                              {card.pt_rooms.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {card.pt_rooms.map((room) => (
                                    <Badge key={room} className="text-xs">
                                      {room}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              {card.cross_references.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                  📖 {card.cross_references.join(", ")}
                                </p>
                              )}

                              {card.reflection_question && (
                                <p className="text-sm italic text-primary">
                                  ❓ {card.reflection_question}
                                </p>
                              )}

                              {card.sanctuary_connection && (
                                <p className="text-xs text-amber-600">
                                  🏛️ {card.sanctuary_connection}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
