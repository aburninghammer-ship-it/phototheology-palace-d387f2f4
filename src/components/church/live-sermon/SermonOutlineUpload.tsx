import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Upload, BookOpen, Lightbulb, Youtube, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PT_ROOMS = [
  { code: "SR", name: "Story Room", floor: 1 },
  { code: "IR", name: "Imagination Room", floor: 1 },
  { code: "24", name: "24FPS", floor: 1 },
  { code: "BR", name: "Bible Rendered", floor: 1 },
  { code: "TR", name: "Translation Room", floor: 1 },
  { code: "GR", name: "Gems Room", floor: 1 },
  { code: "OR", name: "Observation Room", floor: 2 },
  { code: "DC", name: "Def-Com Room", floor: 2 },
  { code: "ST", name: "Symbols/Types Room", floor: 2 },
  { code: "QR", name: "Questions Room", floor: 2 },
  { code: "QA", name: "Q&A Room", floor: 2 },
  { code: "NF", name: "Nature Freestyle", floor: 3 },
  { code: "PF", name: "Personal Freestyle", floor: 3 },
  { code: "BF", name: "Bible Freestyle", floor: 3 },
  { code: "HF", name: "History Freestyle", floor: 3 },
  { code: "LR", name: "Listening Room", floor: 3 },
  { code: "CR", name: "Concentration Room", floor: 4 },
  { code: "DR", name: "Dimensions Room", floor: 4 },
  { code: "C6", name: "Connect 6 Room", floor: 4 },
  { code: "TRm", name: "Theme Room", floor: 4 },
  { code: "TZ", name: "Time Zone Room", floor: 4 },
  { code: "PRm", name: "Patterns Room", floor: 4 },
  { code: "P‖", name: "Parallels Room", floor: 4 },
  { code: "FRt", name: "Fruit Room", floor: 4 },
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5 },
  { code: "PR", name: "Prophecy Room", floor: 5 },
  { code: "3A", name: "Three Angels Room", floor: 5 },
];

interface SermonPoint {
  id: string;
  text: string;
  passages: string[];
  suggestedRooms: string[];
}

interface SermonOutlineUploadProps {
  churchId: string;
  onSessionCreated: (sessionId: string) => void;
}

export function SermonOutlineUpload({ churchId, onSessionCreated }: SermonOutlineUploadProps) {
  const [uploadMode, setUploadMode] = useState<"manual" | "youtube">("manual");
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState("");
  const [isExtractingTranscript, setIsExtractingTranscript] = useState(false);
  const [extractedTranscript, setExtractedTranscript] = useState("");
  const [points, setPoints] = useState<SermonPoint[]>([
    { id: crypto.randomUUID(), text: "", passages: [], suggestedRooms: [] }
  ]);
  const [newPassage, setNewPassage] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  
  // Church YouTube channel info
  const [churchYouTubeUrl, setChurchYouTubeUrl] = useState<string | null>(null);
  const [churchYouTubeName, setChurchYouTubeName] = useState<string | null>(null);
  const [isLoadingChannel, setIsLoadingChannel] = useState(true);

  // Load church YouTube channel info
  useEffect(() => {
    const loadChurchChannel = async () => {
      setIsLoadingChannel(true);
      const { data } = await supabase
        .from('churches')
        .select('youtube_channel_url, youtube_channel_name')
        .eq('id', churchId)
        .single();
      
      setChurchYouTubeUrl(data?.youtube_channel_url || null);
      setChurchYouTubeName(data?.youtube_channel_name || null);
      setIsLoadingChannel(false);
    };
    loadChurchChannel();
  }, [churchId]);

  // Check if URL is from church's YouTube channel
  const isFromChurchChannel = (url: string): boolean => {
    if (!churchYouTubeUrl || !url) return false;
    
    // Extract channel identifier from church URL
    const getChannelId = (channelUrl: string): string | null => {
      const patterns = [
        /youtube\.com\/@([^\/\?]+)/i,
        /youtube\.com\/channel\/([^\/\?]+)/i,
        /youtube\.com\/c\/([^\/\?]+)/i,
        /youtube\.com\/user\/([^\/\?]+)/i,
      ];
      for (const pattern of patterns) {
        const match = channelUrl.match(pattern);
        if (match) return match[1].toLowerCase();
      }
      return null;
    };
    
    const churchChannelId = getChannelId(churchYouTubeUrl);
    if (!churchChannelId) return false;
    
    // For video URLs, check if the URL contains the channel reference
    // This is a simplified check - the edge function will do full validation
    const urlLower = url.toLowerCase();
    return urlLower.includes(churchChannelId) || 
           urlLower.includes(churchYouTubeUrl.toLowerCase().split('/').pop() || '');
  };

  const hasYouTubeChannel = !!churchYouTubeUrl;

  const addPoint = () => {
    setPoints([...points, { id: crypto.randomUUID(), text: "", passages: [], suggestedRooms: [] }]);
  };

  const removePoint = (id: string) => {
    if (points.length > 1) {
      setPoints(points.filter(p => p.id !== id));
    }
  };

  const updatePointText = (id: string, text: string) => {
    setPoints(points.map(p => p.id === id ? { ...p, text } : p));
  };

  const addPassage = (pointId: string) => {
    const passage = newPassage[pointId]?.trim();
    if (passage) {
      setPoints(points.map(p => 
        p.id === pointId 
          ? { ...p, passages: [...p.passages, passage] }
          : p
      ));
      setNewPassage({ ...newPassage, [pointId]: "" });
    }
  };

  const removePassage = (pointId: string, passage: string) => {
    setPoints(points.map(p => 
      p.id === pointId 
        ? { ...p, passages: p.passages.filter(ps => ps !== passage) }
        : p
    ));
  };

  const toggleRoom = (pointId: string, roomCode: string) => {
    setPoints(points.map(p => {
      if (p.id !== pointId) return p;
      const hasRoom = p.suggestedRooms.includes(roomCode);
      return {
        ...p,
        suggestedRooms: hasRoom 
          ? p.suggestedRooms.filter(r => r !== roomCode)
          : [...p.suggestedRooms, roomCode]
      };
    }));
  };

  const extractTranscript = async () => {
    if (!youtubeVideoUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    // Validate it's from the church's channel
    if (!hasYouTubeChannel) {
      toast.error("No YouTube channel configured for this church. Please set it up in church settings first.");
      return;
    }

    setIsExtractingTranscript(true);
    try {
      const { data, error } = await supabase.functions.invoke("extract-youtube-transcript", {
        body: { 
          youtubeUrl: youtubeVideoUrl.trim(),
          churchChannelUrl: churchYouTubeUrl 
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExtractedTranscript(data.transcript);
      
      // Auto-populate title from URL if empty
      if (!title.trim()) {
        setTitle(`Sermon Study - ${new Date().toLocaleDateString()}`);
      }
      
      // Set as live URL too
      setYoutubeUrl(youtubeVideoUrl.trim());
      
      toast.success(`Transcript extracted! (${data.characterCount.toLocaleString()} characters)`);
    } catch (error: any) {
      console.error("Error extracting transcript:", error);
      toast.error(error.message || "Failed to extract transcript");
    } finally {
      setIsExtractingTranscript(false);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a sermon title");
      return;
    }

    // For YouTube mode, check transcript
    if (uploadMode === "youtube" && !extractedTranscript) {
      toast.error("Please extract the transcript first");
      return;
    }

    const validPoints = points.filter(p => p.text.trim());
    
    // For manual mode, require points
    if (uploadMode === "manual" && validPoints.length === 0) {
      toast.error("Please add at least one sermon point");
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Collect all passages and rooms
      const allPassages = validPoints.flatMap(p => p.passages);
      const allRooms = [...new Set(validPoints.flatMap(p => p.suggestedRooms))];

      // For YouTube mode, use the transcript as the outline
      const outlineData = uploadMode === "youtube"
        ? [{ text: extractedTranscript, passages: [], rooms: [] }]
        : validPoints.map(p => ({
            text: p.text,
            passages: p.passages,
            rooms: p.suggestedRooms
          }));

      const { data, error } = await supabase
        .from("live_sermon_sessions")
        .insert({
          church_id: churchId,
          pastor_id: user.id,
          title: title.trim(),
          youtube_url: youtubeUrl.trim() || null,
          sermon_outline: outlineData,
          key_passages: allPassages,
          pt_rooms_focus: allRooms,
          status: "draft"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Sermon session created! Ready to generate study cards.");
      onSessionCreated(data.id);
    } catch (error: any) {
      console.error("Error creating session:", error);
      toast.error(error.message || "Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Prepare Sermon Study Session
        </CardTitle>
        <CardDescription>
          Upload an outline or use a YouTube sermon video for AI-generated study cards (PT rooms, cross-references, reflection questions).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as "manual" | "youtube")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="gap-2">
              <FileText className="h-4 w-4" />
              Manual Outline
            </TabsTrigger>
            <TabsTrigger value="youtube" className="gap-2">
              <Youtube className="h-4 w-4" />
              YouTube Video
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-4 mt-4">
            {/* Channel Status */}
            {isLoadingChannel ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading channel info...
              </div>
            ) : hasYouTubeChannel ? (
              <Alert className="border-primary/30 bg-primary/5">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription>
                  Videos must be from your church's channel: <strong>{churchYouTubeName || churchYouTubeUrl}</strong>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No YouTube channel configured. Please set your church's YouTube channel in church settings to enable this feature.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="youtube-video">YouTube Video URL</Label>
              <div className="flex gap-2">
                <Input
                  id="youtube-video"
                  value={youtubeVideoUrl}
                  onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                  placeholder={hasYouTubeChannel ? "Paste a video URL from your church's channel..." : "Configure YouTube channel first"}
                  className="flex-1"
                  disabled={!hasYouTubeChannel}
                />
                <Button 
                  onClick={extractTranscript}
                  disabled={isExtractingTranscript || !youtubeVideoUrl.trim() || !hasYouTubeChannel}
                >
                  {isExtractingTranscript ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    "Extract Transcript"
                  )}
                </Button>
              </div>
              {hasYouTubeChannel && (
                <p className="text-xs text-muted-foreground">
                  Only videos from {churchYouTubeName || "your church's channel"} can be used
                </p>
              )}
            </div>

            {extractedTranscript && (
              <div className="space-y-2">
                <Label>Extracted Transcript Preview</Label>
                <div className="max-h-40 overflow-y-auto p-3 bg-muted/50 rounded-md text-sm">
                  {extractedTranscript.substring(0, 500)}...
                </div>
                <Badge variant="secondary">
                  {extractedTranscript.length.toLocaleString()} characters extracted
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title-yt">Session Title</Label>
              <Input
                id="title-yt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., 'Sunday Sermon Study - Dec 15'"
              />
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 mt-4">
            {/* Title for manual mode */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Sermon Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., 'The Prodigal Son: A Story of Grace'"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube Live URL (optional)</Label>
                <Input
                  id="youtube"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/live/..."
                />
              </div>
            </div>

            {/* Sermon Points */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Sermon Points</Label>
                <Button variant="outline" size="sm" onClick={addPoint}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Point
                </Button>
              </div>

              {points.map((point, index) => (
                <Card key={point.id} className="bg-muted/30">
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-muted-foreground mt-2">
                        {index + 1}.
                      </span>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          value={point.text}
                          onChange={(e) => updatePointText(point.id, e.target.value)}
                          placeholder="Enter your sermon point..."
                          className="min-h-[80px]"
                        />

                        {/* Key Passages */}
                        <div className="space-y-2">
                          <Label className="text-xs flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Key Passages
                          </Label>
                          <div className="flex flex-wrap gap-1">
                            {point.passages.map((passage) => (
                              <Badge key={passage} variant="secondary" className="gap-1">
                                {passage}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
                                  onClick={() => removePassage(point.id, passage)}
                                />
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newPassage[point.id] || ""}
                              onChange={(e) => setNewPassage({ ...newPassage, [point.id]: e.target.value })}
                              placeholder="e.g., Luke 15:11-32"
                              className="h-8 text-sm"
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPassage(point.id))}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8"
                              onClick={() => addPassage(point.id)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>

                        {/* PT Rooms */}
                        <div className="space-y-2">
                          <Label className="text-xs flex items-center gap-1">
                            <Lightbulb className="h-3 w-3" />
                            Suggested PT Rooms (click to toggle)
                          </Label>
                          <div className="flex flex-wrap gap-1">
                            {PT_ROOMS.map((room) => (
                              <Badge
                                key={room.code}
                                variant={point.suggestedRooms.includes(room.code) ? "default" : "outline"}
                                className="cursor-pointer text-xs"
                                onClick={() => toggleRoom(point.id, room.code)}
                              >
                                {room.code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      {points.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removePoint(point.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleCreate}
          disabled={isCreating || (uploadMode === "youtube" && !extractedTranscript)}
        >
          {isCreating ? "Creating..." : "Create Sermon Session"}
        </Button>
      </CardContent>
    </Card>
  );
}
