import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RoomInsightChatProps {
  roomCode: string;
  roomName: string;
  roomContent: string;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export const RoomInsightChat = ({
  roomCode,
  roomName,
  roomContent,
  book,
  chapter,
  verse,
  verseText,
}: RoomInsightChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "room-insight-chat",
          roomCode,
          roomName,
          roomContent,
          book,
          chapter,
          verse,
          verseText,
          question: question,
          conversationHistory: messages,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Room insight chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l-4 border-primary/30 pl-4 mt-4">
      <div className="mb-3">
        <Badge className="gradient-palace text-white text-xs mb-2">
          {roomCode}
        </Badge>
        <h3 className="font-bold text-lg mb-2 text-primary">{roomName}</h3>
        <div className="text-sm leading-relaxed text-foreground/90">
          {roomContent}
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between hover:bg-primary/5"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask about this room
              {messages.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {messages.length}
                </Badge>
              )}
            </span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-3 space-y-3">
          {messages.length > 0 && (
            <ScrollArea className="h-[200px] rounded-lg border bg-card/50 p-3">
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary/10 ml-4"
                        : "bg-secondary/50 mr-4"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">
                      {msg.role === "user" ? "You" : "Jeeves"}
                    </div>
                    <div className="text-sm">
                      {msg.role === "assistant"
                        ? formatJeevesResponse(msg.content)
                        : msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder={`Ask a question about ${roomName}...`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  askQuestion();
                }
              }}
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={askQuestion}
              disabled={loading || !question.trim()}
              size="sm"
              className="px-3"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
