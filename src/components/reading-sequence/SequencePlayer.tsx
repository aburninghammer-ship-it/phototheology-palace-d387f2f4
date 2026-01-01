/**
 * SequencePlayer - Simple Bible audio player
 *
 * Rebuilt from scratch for reliability and simplicity.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { audioEngine } from "@/lib/AudioEngine";
import { generateTTS, OpenAIVoice, OPENAI_VOICES, DEFAULT_VOICE } from "@/services/ttsService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SequencePlayerProps {
  sequences: ReadingSequenceBlock[];
  onClose?: () => void;
  autoPlay?: boolean;
  sequenceName?: string;
}

interface ChapterContent {
  book: string;
  chapter: number;
  verses: { verse: number; text: string }[];
}

export const SequencePlayer = ({ sequences, onClose, autoPlay = false, sequenceName }: SequencePlayerProps) => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Position state
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);
  const [chapterContent, setChapterContent] = useState<ChapterContent | null>(null);

  // Settings
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState<OpenAIVoice>(DEFAULT_VOICE);
  const [speed, setSpeed] = useState(1.0);

  // Refs for async operations
  const shouldContinueRef = useRef(false);
  const isPlayingVerseRef = useRef(false);

  // Get active sequences and flatten items
  const activeSequences = sequences.filter(s => s.enabled && s.items.length > 0);
  const allItems = activeSequences.flatMap(seq => seq.items);
  const currentItem = allItems[currentItemIdx] || null;
  const totalItems = allItems.length;

  // Get current sequence settings
  const currentSequence = activeSequences.find((seq, idx) => {
    const itemsBefore = activeSequences.slice(0, idx).reduce((acc, s) => acc + s.items.length, 0);
    return currentItemIdx >= itemsBefore && currentItemIdx < itemsBefore + seq.items.length;
  });

  /**
   * Fetch chapter content from API
   */
  const fetchChapter = useCallback(async (book: string, chapter: number): Promise<ChapterContent | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("bible-api", {
        body: { book, chapter, version: "kjv" },
      });

      if (error || !data?.verses?.length) {
        console.error("[SequencePlayer] Failed to fetch chapter:", error);
        toast.error(`Failed to load ${book} ${chapter}`);
        return null;
      }

      return {
        book,
        chapter,
        verses: data.verses as { verse: number; text: string }[],
      };
    } catch (e) {
      console.error("[SequencePlayer] Error fetching chapter:", e);
      toast.error("Failed to load chapter");
      return null;
    }
  }, []);

  /**
   * Load chapter when item changes
   */
  useEffect(() => {
    if (!currentItem) return;

    const loadChapter = async () => {
      setIsLoading(true);
      const content = await fetchChapter(currentItem.book, currentItem.chapter);

      if (content) {
        // Filter verses if range specified
        if (currentItem.startVerse) {
          content.verses = content.verses.filter(
            v => v.verse >= (currentItem.startVerse || 1) &&
                 v.verse <= (currentItem.endVerse || content.verses.length)
          );
        }
        setChapterContent(content);
        setCurrentVerseIdx(0);
      }

      setIsLoading(false);
    };

    loadChapter();
  }, [currentItem?.book, currentItem?.chapter, fetchChapter]);

  /**
   * Play a single verse
   */
  const playVerse = useCallback(async (verseIdx: number): Promise<boolean> => {
    if (!chapterContent || verseIdx >= chapterContent.verses.length) {
      return false;
    }

    // Prevent overlapping plays
    if (isPlayingVerseRef.current) {
      console.log("[SequencePlayer] Already playing a verse, skipping");
      return false;
    }

    isPlayingVerseRef.current = true;
    const verse = chapterContent.verses[verseIdx];
    setCurrentVerseIdx(verseIdx);
    setIsLoading(true);

    try {
      // Generate TTS
      const audioUrl = await generateTTS(verse.text, {
        voice,
        speed,
        book: chapterContent.book,
        chapter: chapterContent.chapter,
        verse: verse.verse,
      });

      setIsLoading(false);

      // Play audio
      return new Promise((resolve) => {
        audioEngine.play(audioUrl, {
          volume: isMuted ? 0 : volume / 100,
          playbackRate: speed,
          onEnded: () => {
            console.log("[SequencePlayer] Verse", verseIdx + 1, "ended");
            isPlayingVerseRef.current = false;
            resolve(true);
          },
          onError: (error) => {
            console.error("[SequencePlayer] Playback error:", error);
            isPlayingVerseRef.current = false;
            resolve(false);
          },
        }).then((success) => {
          if (!success) {
            isPlayingVerseRef.current = false;
            resolve(false);
          }
        });
      });
    } catch (e) {
      console.error("[SequencePlayer] TTS error:", e);
      setIsLoading(false);
      isPlayingVerseRef.current = false;
      return false;
    }
  }, [chapterContent, voice, speed, isMuted, volume]);

  /**
   * Play all verses in sequence
   */
  const playAllVerses = useCallback(async (startIdx = 0) => {
    if (!chapterContent) return;

    shouldContinueRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);

    // Unlock audio for iOS
    await audioEngine.unlock();

    for (let i = startIdx; i < chapterContent.verses.length; i++) {
      // Check if we should stop
      if (!shouldContinueRef.current) {
        console.log("[SequencePlayer] Playback stopped by user");
        break;
      }

      console.log("[SequencePlayer] Playing verse", i + 1, "of", chapterContent.verses.length);
      const success = await playVerse(i);

      if (!success && shouldContinueRef.current) {
        console.error("[SequencePlayer] Verse failed, stopping");
        toast.error("Playback error, please try again");
        break;
      }
    }

    // Check if we completed the chapter
    if (shouldContinueRef.current && currentItemIdx < totalItems - 1) {
      // Move to next chapter
      console.log("[SequencePlayer] Chapter complete, moving to next");
      setCurrentItemIdx(prev => prev + 1);
      // Note: The useEffect will load the new chapter, and we should auto-continue
      // For now, just stop and let user click play again
    } else if (shouldContinueRef.current) {
      console.log("[SequencePlayer] All chapters complete!");
      toast.success("Reading sequence complete!");
    }

    setIsPlaying(false);
    shouldContinueRef.current = false;
  }, [chapterContent, playVerse, currentItemIdx, totalItems]);

  /**
   * Handle play button
   */
  const handlePlay = useCallback(async () => {
    if (isPaused) {
      // Resume from pause
      if (audioEngine.resume()) {
        setIsPaused(false);
        setIsPlaying(true);
      }
      return;
    }

    // Start fresh playback
    if (chapterContent) {
      await playAllVerses(currentVerseIdx);
    }
  }, [isPaused, chapterContent, currentVerseIdx, playAllVerses]);

  /**
   * Handle pause button
   */
  const handlePause = useCallback(() => {
    shouldContinueRef.current = false;
    audioEngine.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  /**
   * Handle stop button
   */
  const handleStop = useCallback(() => {
    shouldContinueRef.current = false;
    audioEngine.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentVerseIdx(0);
  }, []);

  /**
   * Skip to next chapter
   */
  const handleSkipNext = useCallback(() => {
    if (currentItemIdx < totalItems - 1) {
      handleStop();
      setCurrentItemIdx(prev => prev + 1);
    }
  }, [currentItemIdx, totalItems, handleStop]);

  /**
   * Skip to previous chapter
   */
  const handleSkipPrev = useCallback(() => {
    if (currentItemIdx > 0) {
      handleStop();
      setCurrentItemIdx(prev => prev - 1);
    }
  }, [currentItemIdx, handleStop]);

  /**
   * Handle volume change
   */
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    audioEngine.setVolume(isMuted ? 0 : newVolume / 100);
  }, [isMuted]);

  /**
   * Toggle mute
   */
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      audioEngine.setVolume(newMuted ? 0 : volume / 100);
      return newMuted;
    });
  }, [volume]);

  // Calculate progress
  const verseProgress = chapterContent
    ? ((currentVerseIdx + 1) / chapterContent.verses.length) * 100
    : 0;
  const chapterProgress = totalItems > 0
    ? ((currentItemIdx + 1) / totalItems) * 100
    : 0;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{sequenceName || "Bible Audio"}</span>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Chapter Display */}
        <div className="text-center py-4">
          {currentItem ? (
            <>
              <h2 className="text-2xl font-bold">
                {currentItem.book} {currentItem.chapter}
              </h2>
              {chapterContent && (
                <p className="text-muted-foreground">
                  Verse {currentVerseIdx + 1} of {chapterContent.verses.length}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">No content to play</p>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Loading...</span>
          </div>
        )}

        {/* Progress Bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Verse Progress</span>
            <span>{Math.round(verseProgress)}%</span>
          </div>
          <Progress value={verseProgress} className="h-2" />

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Chapter {currentItemIdx + 1} of {totalItems}</span>
            <span>{Math.round(chapterProgress)}%</span>
          </div>
          <Progress value={chapterProgress} className="h-2" />
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipPrev}
            disabled={currentItemIdx === 0 || isLoading}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          {isPlaying ? (
            <Button size="lg" onClick={handlePause} disabled={isLoading}>
              <Pause className="h-6 w-6" />
            </Button>
          ) : (
            <Button size="lg" onClick={handlePlay} disabled={isLoading || !chapterContent}>
              <Play className="h-6 w-6" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
          >
            <Square className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSkipNext}
            disabled={currentItemIdx >= totalItems - 1 || isLoading}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="w-10 text-sm text-muted-foreground">{volume}%</span>
        </div>

        {/* Voice Selection */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-16">Voice:</span>
          <Select value={voice} onValueChange={(v) => setVoice(v as OpenAIVoice)}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPENAI_VOICES.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-16">Speed:</span>
          <Slider
            value={[speed]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(v) => setSpeed(v[0])}
            className="flex-1"
          />
          <span className="w-10 text-sm text-muted-foreground">{speed}x</span>
        </div>

        {/* Verse List */}
        {chapterContent && (
          <ScrollArea className="h-48 border rounded-md p-2">
            <div className="space-y-1">
              {chapterContent.verses.map((verse, idx) => (
                <div
                  key={verse.verse}
                  className={`p-2 rounded text-sm cursor-pointer hover:bg-muted ${
                    idx === currentVerseIdx ? "bg-primary/10 font-medium" : ""
                  }`}
                  onClick={() => {
                    if (!isPlaying) {
                      setCurrentVerseIdx(idx);
                    }
                  }}
                >
                  <span className="font-bold mr-2">{verse.verse}</span>
                  {verse.text}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
