import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Sparkles, Send, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { palaceFloors } from "@/data/palaceData";

interface JeevesVerseAssistantProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const JeevesVerseAssistant = ({ book, chapter, verse, verseText, onClose }: JeevesVerseAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Flatten all rooms from all floors into a single list
  const allRooms = palaceFloors.flatMap(floor => 
    floor.rooms.map(room => ({
      ...room,
      floorName: floor.name,
      floorNumber: floor.number
    }))
  );

  const handleAskJeeves = async () => {
    if (!question.trim()) {
      toast({
        title: "Question Required",
        description: "Please enter a question for Jeeves",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedRoomData = allRooms.find(r => r.id === selectedRoom);
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "verse-assistant",
          book,
          chapter,
          verse,
          verseText,
          question,
          roomTag: selectedRoomData?.tag || "General",
          roomName: selectedRoomData?.name || "General Study",
          roomPurpose: selectedRoomData?.purpose || "",
        },
      });

      if (error) throw error;

      setResponse(data.content);
    } catch (error: any) {
      console.error("Jeeves error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Jeeves",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant border-2 border-primary/20">
      <CardHeader className="gradient-palace text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                Ask Jeeves
                <Sparkles className="h-4 w-4 animate-pulse-glow" />
              </CardTitle>
              <CardDescription className="text-white/90 text-sm">
                {book} {chapter}:{verse}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* Verse Display */}
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
          <p className="text-sm italic text-foreground">{verseText}</p>
        </div>

        {/* Room/Principle Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Select a Room or Principle (Optional)
          </label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Use any room or principle..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">General Analysis</SelectItem>
              {palaceFloors.map((floor) => (
                <div key={floor.number}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                    Floor {floor.number}: {floor.name}
                  </div>
                  {floor.rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {room.tag}
                        </Badge>
                        {room.name}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Question
          </label>
          <Textarea
            placeholder="Ask Jeeves about this verse... (e.g., 'What symbols do you see here?' or 'How does this connect to Jesus?')"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Ask Button */}
        <Button
          onClick={handleAskJeeves}
          disabled={loading}
          className="w-full gradient-palace text-white shadow-blue"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Jeeves is thinking...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Ask Jeeves
            </>
          )}
        </Button>

        {/* Response Display */}
        {response && (
          <ScrollArea className="h-[300px]">
            <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border-2 border-primary/30 animate-fade-in space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Jeeves responds:</span>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                {response.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
