/**
 * Audio Bible Page
 * Listen to Bible chapters with AI-generated commentary
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Settings2,
  BookOpen,
  ListMusic,
  Sparkles,
  Heart,
  Loader2,
  ChevronRight,
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
  const navigate = useNavigate();
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
    commentaryTier,
    setCommentaryTier,
    includeCommentary,
    setIncludeCommentary,
    commentaryOnly,
    setCommentaryOnly,
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
  const [activeTab, setActiveTab] = useState("chapter");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [showSettings, setShowSettings] = useState(false);

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

  // Fetch verses for a chapter (mock for now - will connect to real API)
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

    // Start with first chapter
    const firstItem = series.items[0];
    const verses = await fetchChapterVerses(firstItem.book, firstItem.chapter);
    if (verses.length > 0) {
      playChapter(firstItem.book, firstItem.chapter, verses);
    }

    // TODO: Queue remaining chapters
  };

  const progress = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;

  return (
    <div className="min-h-screen gradient-dreamy">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="container mx-auto px-4 py-6 pb-32 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/20">
            <Volume2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audio Bible</h1>
            <p className="text-muted-foreground">Listen with AI commentary</p>
          </div>
        </div>

        {/* Now Playing Card (when active) */}
        {!isIdle && (
          <Card className="mb-6 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isPlayingCommentary ? "Commentary" : "Now Playing"}
                  </p>
                  <h2 className="text-lg font-semibold">
                    {currentBook} {currentChapter}:{currentVerse}
                  </h2>
                </div>
                <Badge variant={isPlayingCommentary ? "secondary" : "default"}>
                  {isPlayingCommentary ? commentaryTier : "Verse"}
                </Badge>
              </div>

              {/* Current text */}
              <div className="bg-background/50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                <p className="text-sm italic">
                  {isPlayingCommentary ? currentCommentary : currentVerseText}
                </p>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Verse {currentVerseIndex + 1} of {totalVerses}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon" onClick={skipPrevious}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  className="rounded-full h-14 w-14"
                  onClick={handlePlay}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={skipNext}>
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={stop}>
                  <Square className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chapter" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Chapter</span>
            </TabsTrigger>
            <TabsTrigger value="series" className="flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              <span className="hidden sm:inline">Series</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Themes</span>
            </TabsTrigger>
          </TabsList>

          {/* Chapter Selection */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader>
                <CardTitle>Select Chapter</CardTitle>
                <CardDescription>Choose a book and chapter to listen to</CardDescription>
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
          </TabsContent>

          {/* Reading Series */}
          <TabsContent value="series">
            <Card>
              <CardHeader>
                <CardTitle>Reading Series</CardTitle>
                <CardDescription>Curated multi-chapter journeys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {READING_SERIES.map((series) => (
                    <div
                      key={series.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => handlePlaySeries(series)}
                    >
                      <div>
                        <h3 className="font-medium">{series.name}</h3>
                        <p className="text-sm text-muted-foreground">{series.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {series.items.length} chapters
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Play className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Themes */}
          <TabsContent value="themes">
            <Card>
              <CardHeader>
                <CardTitle>Themes</CardTitle>
                <CardDescription>Verses organized by topic</CardDescription>
              </CardHeader>
              <CardContent>
                {themes.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-center"
                        onClick={() => {
                          // TODO: Load theme verses and play
                        }}
                      >
                        <span className="text-2xl mb-2 block">{theme.icon}</span>
                        <h3 className="font-medium text-sm">{theme.display_name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {theme.verse_count} verses
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Themes will appear here once configured
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Settings Panel */}
        <Card>
          <CardHeader
            className="cursor-pointer"
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                <CardTitle className="text-lg">Playback Settings</CardTitle>
              </div>
              <ChevronRight
                className={`h-5 w-5 transition-transform ${showSettings ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>

          {showSettings && (
            <CardContent className="space-y-6">
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
                  <span className="text-sm text-muted-foreground">{speed}x</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={([v]) => setSpeed(v)}
                  min={0.5}
                  max={2}
                  step={0.25}
                />
              </div>

              {/* Commentary Tier */}
              <div className="space-y-2">
                <Label>Commentary Depth</Label>
                <Select
                  value={commentaryTier}
                  onValueChange={(v) => setCommentaryTier(v as CommentaryTier)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surface">
                      Surface - Brief insights (2-3 sentences)
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate - Deeper exploration (2-3 paragraphs)
                    </SelectItem>
                    <SelectItem value="scholarly">
                      Scholarly - Comprehensive analysis (4-6 paragraphs)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Commentary Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Commentary</Label>
                  <p className="text-sm text-muted-foreground">
                    Play AI-generated insights after each verse
                  </p>
                </div>
                <Switch checked={includeCommentary} onCheckedChange={setIncludeCommentary} />
              </div>

              {/* Commentary Only Toggle */}
              {includeCommentary && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Commentary Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Skip verse reading, play only commentary
                    </p>
                  </div>
                  <Switch checked={commentaryOnly} onCheckedChange={setCommentaryOnly} />
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
