import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Presentation,
  Loader2,
  Sparkles,
  BookOpen,
  Palette,
  Settings2,
  ChevronRight,
  FileText,
  Download,
  ArrowLeft,
  Check,
  Wand2,
} from "lucide-react";
import {
  PPT_THEMES,
  VENUE_PRESETS,
  SLIDE_COUNT_OPTIONS,
  BIBLE_VERSIONS,
  DEFAULT_EXPORT_SETTINGS,
  type PPTExportSettings,
  type SermonDeck,
  type AudienceType,
} from "@/types/sermonPPT";
import { downloadSermonPPT } from "@/lib/sermonPPTRenderer";

// ============================================================================
// THEME PREVIEW COMPONENT
// ============================================================================

function ThemePreview({ themeId, selected }: { themeId: string; selected: boolean }) {
  const theme = PPT_THEMES[themeId];
  if (!theme) return null;

  return (
    <div
      className={`relative w-full aspect-video rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
        selected
          ? "border-purple-500 ring-2 ring-purple-500/30"
          : "border-transparent hover:border-purple-300"
      }`}
      style={{ backgroundColor: theme.colors.background_primary }}
    >
      {/* Selected check */}
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: theme.colors.accent }}
      />

      {/* Mini slide content */}
      <div className="p-3 flex flex-col justify-center h-full">
        <div
          className="text-sm font-bold mb-0.5 truncate"
          style={{ color: theme.colors.text_primary }}
        >
          Title
        </div>
        <div
          className="text-[10px]"
          style={{ color: theme.colors.text_secondary }}
        >
          Subtitle text
        </div>
        <div
          className="mt-2 w-8 h-0.5"
          style={{ backgroundColor: theme.colors.accent }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function SermonPowerPoint() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"full" | "verses">("full");
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState<"input" | "settings" | "preview">("input");

  // Input state
  const [sermonTitle, setSermonTitle] = useState("");
  const [sermonContent, setSermonContent] = useState("");
  const [versesInput, setVersesInput] = useState("");

  // Settings state
  const [settings, setSettings] = useState<PPTExportSettings>(DEFAULT_EXPORT_SETTINGS);

  // Generated deck
  const [generatedDeck, setGeneratedDeck] = useState<SermonDeck | null>(null);

  // Check if input is valid
  const isInputValid = activeTab === "verses"
    ? versesInput.trim().length > 0
    : sermonContent.trim().length > 50;

  // Generate presentation structure from AI
  const generatePresentation = async () => {
    setGenerating(true);
    try {
      const isVersesMode = activeTab === "verses";
      const verses = isVersesMode
        ? versesInput.split("\n").filter((v) => v.trim())
        : undefined;

      const { data, error } = await supabase.functions.invoke("sermon-to-ppt", {
        body: {
          // Verses mode
          verses,

          // Full sermon mode
          sermon_title: !isVersesMode ? sermonTitle : undefined,
          full_sermon: !isVersesMode ? sermonContent : undefined,

          // Settings
          settings,
        },
      });

      if (error) throw error;

      setGeneratedDeck(data as SermonDeck);
      setStep("preview");
      toast.success("Presentation structure generated!");
    } catch (error) {
      console.error("Error generating presentation:", error);
      toast.error("Failed to generate presentation. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Download the PowerPoint file
  const downloadPPT = async () => {
    if (!generatedDeck) return;

    setGenerating(true);
    try {
      await downloadSermonPPT(generatedDeck, PPT_THEMES, VENUE_PRESETS, {
        themeId: settings.theme_id,
        venuePresetId: settings.venue_preset,
        includeSpeakerNotes: settings.include_speaker_notes,
      });

      toast.success("PowerPoint downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PPT:", error);
      toast.error("Failed to download PowerPoint");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-x-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 -right-32 w-80 h-80 bg-indigo-500/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 left-1/4 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl"
        />
      </div>

      <Navigation />

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Presentation className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PowerPoint Generator</h1>
              <p className="text-purple-200">Transform your sermon into professional slides</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: "input", label: "Content", icon: FileText },
            { id: "settings", label: "Style", icon: Palette },
            { id: "preview", label: "Download", icon: Download },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => {
                  if (s.id === "input") setStep("input");
                  else if (s.id === "settings" && isInputValid) setStep("settings");
                  else if (s.id === "preview" && generatedDeck) setStep("preview");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  step === s.id
                    ? "bg-white text-purple-900 shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{s.label}</span>
              </button>
              {idx < 2 && (
                <ChevronRight className="w-5 h-5 text-white/30 mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Input */}
        {step === "input" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  What would you like to turn into slides?
                </CardTitle>
                <CardDescription>
                  Paste your sermon content or enter Scripture references
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Mode Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "full" | "verses")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="full" className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      Full Sermon
                    </TabsTrigger>
                    <TabsTrigger value="verses" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      Verses Only
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="full" className="mt-4 space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        Paste your sermon manuscript, outline, or notes. AI will extract the
                        structure (big idea, main points, application) and create a complete
                        presentation deck.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Sermon Title (optional)</Label>
                      <Input
                        placeholder="Enter your sermon title..."
                        value={sermonTitle}
                        onChange={(e) => setSermonTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sermon Content *</Label>
                      <Textarea
                        placeholder={`Paste your sermon manuscript, outline, or notes here...

Example:
Title: The Prodigal's Return
Text: Luke 15:11-32

Introduction:
Every family has a story of someone who wandered...

Point 1: The Father's Heart Never Changes
Even while the son was far away...

Point 2: Grace Meets Us Where We Are
The father didn't wait for the son to clean up...

Conclusion:
No matter how far you've wandered...`}
                        value={sermonContent}
                        onChange={(e) => setSermonContent(e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        {sermonContent.length} characters
                        {sermonContent.length < 50 && " (minimum 50 characters)"}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="verses" className="mt-4 space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Enter Scripture references (one per line). AI will build a presentation
                        that flows through these verses with transitions and a synthesized big idea.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Scripture References *</Label>
                      <Textarea
                        placeholder={`Enter Scripture references, one per line:

John 1:1-5
John 1:14
Colossians 1:15-17
Hebrews 1:1-3

You can also include the verse text:

John 3:16 - "For God so loved the world..."`}
                        value={versesInput}
                        onChange={(e) => setVersesInput(e.target.value)}
                        className="min-h-[250px] font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={() => setStep("settings")}
                  disabled={!isInputValid}
                  className="w-full gap-2"
                  size="lg"
                >
                  Continue to Style Settings
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Settings */}
        {step === "settings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Choose Your Style
                </CardTitle>
                <CardDescription>
                  Select a visual theme and configure presentation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection Grid */}
                <div className="space-y-3">
                  <Label>Visual Theme</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.values(PPT_THEMES).map((theme) => (
                      <div
                        key={theme.id}
                        onClick={() => setSettings({ ...settings, theme_id: theme.id })}
                        className="cursor-pointer"
                      >
                        <ThemePreview
                          themeId={theme.id}
                          selected={settings.theme_id === theme.id}
                        />
                        <p className="text-xs text-center mt-1 font-medium">{theme.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Settings */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Venue Size</Label>
                    <Select
                      value={settings.venue_preset}
                      onValueChange={(v) => setSettings({ ...settings, venue_preset: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(VENUE_PRESETS).map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name} - {venue.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Slide Count</Label>
                    <Select
                      value={settings.slide_count}
                      onValueChange={(v) => setSettings({ ...settings, slide_count: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SLIDE_COUNT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Bible Version</Label>
                    <Select
                      value={settings.bible_version}
                      onValueChange={(v) => setSettings({ ...settings, bible_version: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BIBLE_VERSIONS.map((version) => (
                          <SelectItem key={version.value} value={version.value}>
                            {version.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Audience Type</Label>
                    <Select
                      value={settings.audience}
                      onValueChange={(v) => setSettings({ ...settings, audience: v as AudienceType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="evangelistic">Evangelistic</SelectItem>
                        <SelectItem value="discipleship">Discipleship</SelectItem>
                        <SelectItem value="doctrinal">Doctrinal</SelectItem>
                        <SelectItem value="devotional">Devotional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <Label>Include Speaker Notes</Label>
                    <p className="text-xs text-muted-foreground">
                      Add detailed notes for the presenter
                    </p>
                  </div>
                  <Switch
                    checked={settings.include_speaker_notes}
                    onCheckedChange={(v) =>
                      setSettings({ ...settings, include_speaker_notes: v })
                    }
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep("input")}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={generatePresentation}
                    disabled={generating}
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Presentation
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Preview & Download */}
        {step === "preview" && generatedDeck && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Success Card */}
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Presentation Ready!</h3>
                    <p className="text-green-200">
                      {generatedDeck.slides.length} slides generated using{" "}
                      {PPT_THEMES[settings.theme_id]?.name || "Modern Dark"} theme
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deck Info */}
            <Card className="bg-white/90 dark:bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle>{generatedDeck.deck.title}</CardTitle>
                {generatedDeck.deck.subtitle && (
                  <CardDescription>{generatedDeck.deck.subtitle}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Big Idea */}
                {generatedDeck.sermon_map?.big_idea && (
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                    <p className="text-xs uppercase tracking-wider text-purple-700 dark:text-purple-300 mb-1">
                      Big Idea ({generatedDeck.sermon_map.big_idea_source})
                    </p>
                    <p className="font-medium text-purple-900 dark:text-purple-100">
                      "{generatedDeck.sermon_map.big_idea}"
                    </p>
                  </div>
                )}

                {/* Slide Structure */}
                <div className="space-y-2">
                  <Label>Slide Structure</Label>
                  <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-2">
                    <div className="space-y-1">
                      {generatedDeck.slides.map((slide, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-2 bg-background rounded border text-sm"
                        >
                          <span className="w-7 h-7 flex items-center justify-center bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs font-bold">
                            {slide.slide_number}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                            {slide.type}
                          </span>
                          <span className="flex-1 truncate text-muted-foreground">
                            {slide.title || slide.content?.text?.substring(0, 60) || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("settings")}
                    className="flex-1"
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Adjust Settings
                  </Button>
                  <Button
                    onClick={downloadPPT}
                    disabled={generating}
                    className="flex-1 gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PowerPoint
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Start Over */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep("input");
                  setGeneratedDeck(null);
                }}
                className="text-white/70 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Create Another Presentation
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
