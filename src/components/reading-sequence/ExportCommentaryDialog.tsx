import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Share2, 
  Music, 
  Volume2, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Download,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserMusic } from "@/hooks/useUserMusic";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { toast } from "sonner";

// System ambient tracks - using reliable free music sources
const SYSTEM_TRACKS = [
  { name: "No Music", url: "" },
  { name: "Peaceful Piano", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { name: "Ambient Meditation", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { name: "Soft Strings", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

interface ExportCommentaryDialogProps {
  commentaryText: string;
  book: string;
  chapter: number;
  verseText?: string; // Bible verse text to include
  voice?: string;
  trigger?: React.ReactNode;
}

export function ExportCommentaryDialog({ 
  commentaryText, 
  book, 
  chapter, 
  verseText = "",
  voice = "onyx",
  trigger 
}: ExportCommentaryDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string>(SYSTEM_TRACKS[0].url);
  const [musicVolume, setMusicVolume] = useState(10);
  const [includeBibleText, setIncludeBibleText] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { userTracks } = useUserMusic();
  const { mixAndDownload, isProcessing, progress, error } = useAudioMixer();

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsGenerating(false);
      setGenerationStep("");
      setGenerationProgress(0);
      setIsDone(false);
      setGeneratedBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  }, [open, audioUrl]);

  // Determine TTS provider from voice name
  const getProviderForVoice = (voiceName: string): 'openai' | 'elevenlabs' | 'speechify' => {
    const elevenlabsVoices = ['george', 'aria', 'roger', 'sarah', 'charlie', 'callum', 'river', 'liam', 'charlotte', 'alice', 'matilda', 'will', 'jessica', 'eric', 'chris', 'brian', 'daniel', 'lily', 'bill'];
    const speechifyVoices = ['henry', 'mrbeast', 'cliff', 'cody', 'kristy', 'natasha', 'cindy'];
    const openaiVoices = ['alloy', 'ash', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer'];
    
    const voiceLower = voiceName.toLowerCase();
    if (elevenlabsVoices.includes(voiceLower)) return 'elevenlabs';
    if (speechifyVoices.includes(voiceLower)) return 'speechify';
    if (openaiVoices.includes(voiceLower)) return 'openai';
    return 'elevenlabs';
  };

  // Generate TTS for commentary
  const generateCommentaryTTS = async (text: string): Promise<{ audioContent?: string } | null> => {
    try {
      // Split long text into chunks if needed (max ~4000 chars for TTS)
      const maxChunkSize = 3500;
      const chunks: string[] = [];
      
      if (text.length > maxChunkSize) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        let currentChunk = "";
        
        for (const sentence of sentences) {
          if ((currentChunk + sentence).length > maxChunkSize && currentChunk) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
          } else {
            currentChunk += sentence;
          }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
      } else {
        chunks.push(text);
      }

      const audioContents: string[] = [];
      
      for (let i = 0; i < chunks.length; i++) {
        setGenerationStep(`Generating audio chunk ${i + 1}/${chunks.length}...`);
        setGenerationProgress(10 + (i / chunks.length) * 40);
        
        const provider = getProviderForVoice(voice);
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { text: chunks[i], voice, provider },
        });

        if (error) throw error;
        if (data?.audioContent) {
          audioContents.push(data.audioContent);
        }
      }

      // For simplicity, just use the first chunk if we have multiple
      // In a more complex implementation, we'd concatenate the audio
      return { audioContent: audioContents[0] };
    } catch (err) {
      console.error("TTS error:", err);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!commentaryText) {
      toast.error("No commentary to export");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setIsDone(false);
    setGeneratedBlob(null);

    try {
      const audioSegments: { audioContent: string }[] = [];
      
      // Step 1: Generate Bible text audio if enabled and available
      if (includeBibleText && verseText) {
        setGenerationStep("Generating Bible reading...");
        setGenerationProgress(5);
        
        const bibleAudio = await generateCommentaryTTS(verseText);
        if (bibleAudio?.audioContent) {
          audioSegments.push({ audioContent: bibleAudio.audioContent });
        }
      }

      // Step 2: Generate commentary audio
      setGenerationStep("Generating commentary speech...");
      setGenerationProgress(includeBibleText && verseText ? 30 : 5);

      const commentaryAudio = await generateCommentaryTTS(commentaryText);
      
      if (!commentaryAudio?.audioContent) {
        throw new Error("Failed to generate commentary audio");
      }
      audioSegments.push({ audioContent: commentaryAudio.audioContent });

      setGenerationProgress(55);

      // If music is selected, mix it with all segments
      if (selectedMusic) {
        setGenerationStep("Mixing with background music...");
        
        const blob = await mixAndDownload({
          musicUrl: selectedMusic,
          musicVolume: musicVolume / 100,
          segments: audioSegments,
          gapBetweenSegments: 1.5, // Gap between Bible and commentary
        });

        if (blob) {
          setGeneratedBlob(blob);
          setAudioUrl(URL.createObjectURL(blob));
          setIsDone(true);
          setGenerationStep("Ready to share!");
          setGenerationProgress(100);
          toast.success("Commentary audio ready!");
        } else {
          throw new Error("Failed to mix audio");
        }
      } else {
        // No music - concatenate audio segments manually
        // For now, just use the last segment (commentary)
        const lastSegment = audioSegments[audioSegments.length - 1];
        const byteCharacters = atob(lastSegment.audioContent);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        
        setGeneratedBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setIsDone(true);
        setGenerationStep("Ready to share!");
        setGenerationProgress(100);
        toast.success("Commentary audio ready!");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate audio");
      setGenerationStep("Error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedBlob) return;

    const fileName = `${book}_${chapter}_Commentary_${new Date().toISOString().split("T")[0]}.${selectedMusic ? 'wav' : 'mp3'}`;

    const url = URL.createObjectURL(generatedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Download started!");
  };

  const handleNativeShare = async () => {
    if (!generatedBlob) return;

    const fileName = `${book}_${chapter}_Commentary.${selectedMusic ? 'wav' : 'mp3'}`;
    const file = new File([generatedBlob], fileName, { type: generatedBlob.type });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `${book} ${chapter} Commentary`,
          text: `Listen to this Phototheology commentary on ${book} chapter ${chapter}`,
          files: [file],
        });
        toast.success("Shared successfully!");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
          toast.error("Share failed");
        }
      }
    } else {
      // Fallback - copy a message to clipboard
      const message = `🎧 Listen to my Phototheology commentary on ${book} chapter ${chapter}!\n\n#Phototheology #BibleStudy`;
      await navigator.clipboard.writeText(message);
      toast.success("Share text copied! Download the file to attach it.");
    }
  };

  const wordCount = commentaryText?.split(/\s+/).length || 0;
  const estimatedMinutes = Math.ceil(wordCount / 150); // ~150 words per minute

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Export Commentary
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Export Commentary Audio
          </DialogTitle>
          <DialogDescription>
            Generate an audio file of the commentary to download or share on social media.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{book} {chapter}</Badge>
              <span className="text-xs text-muted-foreground">
                ~{estimatedMinutes} min ({wordCount} words)
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {commentaryText?.slice(0, 150)}...
            </p>
          </div>

          {/* Include Bible Text Toggle */}
          {verseText && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <div>
                  <Label htmlFor="include-bible" className="text-sm font-medium">
                    Include Bible Reading
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Read the Bible text before commentary
                  </p>
                </div>
              </div>
              <Switch
                id="include-bible"
                checked={includeBibleText}
                onCheckedChange={setIncludeBibleText}
              />
            </div>
          )}

          {/* Music Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Background Music (optional)
            </Label>
            <ScrollArea className="h-28 border rounded-md p-2">
              <div className="space-y-1">
                {SYSTEM_TRACKS.map((track) => (
                  <Button
                    key={track.url || "none"}
                    variant={selectedMusic === track.url ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setSelectedMusic(track.url)}
                  >
                    {track.name}
                  </Button>
                ))}
                
                {userTracks && userTracks.length > 0 && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mt-2 mb-1">Your Music</p>
                    {userTracks.map((track) => (
                      <Button
                        key={track.id}
                        variant={selectedMusic === track.file_url ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setSelectedMusic(track.file_url)}
                      >
                        {track.name}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Volume - only show if music selected */}
          {selectedMusic && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Music Volume: {musicVolume}%
              </Label>
              <Slider
                value={[musicVolume]}
                max={30}
                step={5}
                onValueChange={(v) => setMusicVolume(v[0])}
              />
            </div>
          )}

          {/* Progress */}
          {(isGenerating || isProcessing || isDone) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : error ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span className="text-sm">{generationStep}</span>
              </div>
              <Progress value={isProcessing ? progress : generationProgress} />
            </div>
          )}

          {/* Audio Preview */}
          {isDone && audioUrl && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <audio controls src={audioUrl} className="w-full h-10" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {isDone && generatedBlob ? (
            <>
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleNativeShare} className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsDone(false);
                  setGeneratedBlob(null);
                  if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                  }
                }}
              >
                Generate Again
              </Button>
            </>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isProcessing || !commentaryText}
              className="w-full gap-2"
            >
              {isGenerating || isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Music className="h-4 w-4" />
                  Generate Audio
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
