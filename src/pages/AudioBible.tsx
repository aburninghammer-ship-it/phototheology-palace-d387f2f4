/**
 * Audio Bible Page
 * Listen to Bible chapters with optional AI-generated commentary
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAudioBible } from "@/hooks/useAudioBible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { READING_SERIES, getThemes, CommentaryTier } from "@/services/audioBibleService";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  BookOpen,
  MessageSquare,
  Loader2,
  Headphones,
  ListMusic,
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  category: string;
  verse_count: number;
}

export default function AudioBible() {
  const [searchParams] = useSearchParams();
  const { preferences } = useUserPreferences();

  // Audio Bible hook
  const {
    isPlaying,
    isPaused,
    isLoading,
    isIdle,
    currentBook,
    currentChapter,
    currentVerse,
    currentVerseText,
    currentVerseIndex,
    totalVerses,
    isPlayingCommentary,
    currentCommentary,
    voice,
    setVoice,
    speed,
    setSpeed,
    volume,
    setVolume,
    commentaryTier,
    setCommentaryTier,
    includeCommentary,
    setIncludeCommentary,
    unlock,
    playChapter,
    pause,
    resume,
    stop,
    skipNext,
    skipPrevious,
    voices,
  } = useAudioBible({
    onVerseChange: (book, chapter, verse) => {
      console.log(`[AudioBible] Now playing ${book} ${chapter}:${verse}`);
    },
    onChapterComplete: (book, chapter) => {
      console.log(`[AudioBible] Completed ${book} ${chapter}`);
    },
  });

  // Selection state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [themes, setThemes] = useState<Theme[]>([]);

  // Load themes on mount
  useEffect(() => {
    loadThemes();
  }, []);

  // Handle URL params
  useEffect(() => {
    const book = searchParams.get("book");
    const chapter = searchParams.get("chapter");
    if (book) setSelectedBook(book);
    if (chapter) setSelectedChapter(parseInt(chapter, 10));
  }, [searchParams]);

  const loadThemes = async () => {
    const data = await getThemes();
    setThemes(data);
  };

  // Get chapter count for selected book
  const getChapterCount = () => {
    const book = BIBLE_BOOK_METADATA.find((b) => b.name === selectedBook);
    return book?.chapters || 1;
  };

  // Fetch verses for a chapter
  const fetchChapterVerses = async (book: string, chapter: number) => {
    try {
      const response = await fetch(
        `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`
      );
      const data = await response.json();

      if (data.verses) {
        return data.verses.map((v: any) => ({
          verse: v.verse,
          text: v.text.trim(),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching verses:", error);
      return [];
    }
  };

  // Handle play button
  const handlePlay = async () => {
    if (isPaused) {
      resume();
      return;
    }

    if (isPlaying) {
      pause();
      return;
    }

    // Unlock audio first (iOS requirement)
    await unlock();

    // Fetch verses and start playback
    const verses = await fetchChapterVerses(selectedBook, selectedChapter);
    if (verses.length > 0) {
      playChapter(selectedBook, selectedChapter, verses);
    }
  };

  // Handle series play
  const handlePlaySeries = async (series: typeof READING_SERIES[0]) => {
    await unlock();

    const firstItem = series.items[0];
    const verses = await fetchChapterVerses(firstItem.book, firstItem.chapter);
    if (verses.length > 0) {
      playChapter(firstItem.book, firstItem.chapter, verses);
    }
  };

  const progress = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;

  return (
    <div className="min-h-screen gradient-subtle">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="pt-24 pb-32 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="glass-card mb-8 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <img
                src="/pwa-192x192.png"
                alt="Phototheology"
                className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
              />
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1 bg-gradient-palace bg-clip-text text-transparent">
                  Audio Bible & Commentary
                </h1>
                <p className="text-muted-foreground">
                  Listen to Scripture with AI-powered insights
                </p>
              </div>
            </div>
          </div>

          {/* Now Playing Card (when active) */}
          {!isIdle && (
            <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isPlayingCommentary ? "Commentary" : "Now Playing"}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {currentBook} {currentChapter}:{currentVerse}
                    </h2>
                  </div>
                  <Badge variant={isPlayingCommentary ? "secondary" : "default"} className="text-sm px-3 py-1">
                    {isPlayingCommentary ? commentaryTier : "Verse"}
                  </Badge>
                </div>

                {/* Current text */}
                <div className="bg-background/80 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto border">
                  <p className="text-base leading-relaxed">
                    {isPlayingCommentary ? currentCommentary : `"${currentVerseText}"`}
                  </p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Verse {currentVerseIndex + 1} of {totalVerses}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Button variant="outline" size="icon" onClick={skipPrevious} className="h-12 w-12 rounded-full">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-lg"
                    onClick={handlePlay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-7 w-7" />
                    ) : (
                      <Play className="h-7 w-7 ml-1" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={skipNext} className="h-12 w-12 rounded-full">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={stop} className="h-12 w-12 rounded-full">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Selection */}
            <div className="space-y-6">
              {/* Book/Chapter Selection */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Select Chapter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Book</Label>
                      <Select value={selectedBook} onValueChange={setSelectedBook}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-64">
                            {BIBLE_BOOK_METADATA.map((book) => (
                              <SelectItem key={book.name} value={book.name}>
                                {book.name}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Chapter</Label>
                      <Select
                        value={selectedChapter.toString()}
                        onValueChange={(v) => setSelectedChapter(parseInt(v, 10))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-64">
                            {Array.from({ length: getChapterCount() }, (_, i) => i + 1).map((ch) => (
                              <SelectItem key={ch} value={ch.toString()}>
                                Chapter {ch}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePlay}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-5 w-5 mr-2" />
                    )}
                    Play {selectedBook} {selectedChapter}
                  </Button>
                </CardContent>
              </Card>

              {/* Reading Series */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-primary" />
                    Reading Series
                  </CardTitle>
                  <CardDescription>Curated multi-chapter journeys</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {READING_SERIES.slice(0, 4).map((series) => (
                      <div
                        key={series.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handlePlaySeries(series)}
                      >
                        <div>
                          <h3 className="font-medium text-sm">{series.name}</h3>
                          <p className="text-xs text-muted-foreground">{series.items.length} chapters</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Listening Mode - Prominent */}
              <Card className="glass-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    Listening Mode
                  </CardTitle>
                  <CardDescription>Choose how you want to listen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bible Only vs With Commentary Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={!includeCommentary ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-1"
                      onClick={() => setIncludeCommentary(false)}
                    >
                      <BookOpen className="h-6 w-6 mb-1" />
                      <span className="font-semibold">Bible Only</span>
                      <span className="text-xs opacity-80">Just Scripture</span>
                    </Button>
                    <Button
                      variant={includeCommentary ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-1"
                      onClick={() => setIncludeCommentary(true)}
                    >
                      <MessageSquare className="h-6 w-6 mb-1" />
                      <span className="font-semibold">With Commentary</span>
                      <span className="text-xs opacity-80">AI insights</span>
                    </Button>
                  </div>

                  {/* Commentary Depth (only show if enabled) */}
                  {includeCommentary && (
                    <div className="space-y-2 pt-2">
                      <Label>Commentary Depth</Label>
                      <Select
                        value={commentaryTier}
                        onValueChange={(v) => setCommentaryTier(v as CommentaryTier)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="surface">Surface - Brief (2-3 sentences)</SelectItem>
                          <SelectItem value="intermediate">Intermediate - Deeper (2-3 paragraphs)</SelectItem>
                          <SelectItem value="scholarly">Scholarly - Comprehensive (4-6 paragraphs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Audio Settings */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Voice Selection */}
                  <div className="space-y-2">
                    <Label>Voice</Label>
                    <Select value={voice} onValueChange={(v) => setVoice(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} - {v.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Playback Speed</Label>
                      <span className="text-sm font-medium">{speed}x</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={2}
                      step={0.25}
                    />
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([v]) => setVolume(v)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Themes (if available) */}
              {themes.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Themes</CardTitle>
                    <CardDescription>Verses by topic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.slice(0, 8).map((theme) => (
                        <div
                          key={theme.id}
                          className="p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer text-center"
                        >
                          <span className="text-xl block">{theme.icon}</span>
                          <span className="text-xs">{theme.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
