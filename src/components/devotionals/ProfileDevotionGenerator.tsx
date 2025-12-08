import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send, Copy, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { StyledMarkdown } from "@/components/ui/styled-markdown";

interface ProfileDevotionGeneratorProps {
  profile: DevotionalProfile;
  onDevotionGenerated?: (devotion: GeneratedDevotion) => void;
}

export interface GeneratedDevotion {
  title: string;
  scripture_reference: string;
  scripture_text: string;
  devotional_body: string;
  strike_line: string;
  prayer: string;
  memory_hook: string;
  generated_for: string;
  theme_used: string | null;
  generated_at: string;
}

const SUGGESTED_THEMES = [
  "Hope in darkness",
  "Overcoming fear",
  "God's faithfulness",
  "Finding purpose",
  "Healing and restoration",
  "Trusting God's timing",
  "Forgiveness",
  "Identity in Christ",
  "Peace in anxiety",
  "Strength in weakness",
];

export function ProfileDevotionGenerator({ profile, onDevotionGenerated }: ProfileDevotionGeneratorProps) {
  const [theme, setTheme] = useState("");
  const [scripture, setScripture] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDevotion, setGeneratedDevotion] = useState<GeneratedDevotion | null>(null);
  const [copied, setCopied] = useState(false);

  const generateDevotion = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-profile-devotion", {
        body: {
          profile: {
            name: profile.name,
            relationship: profile.relationship,
            age_group: profile.age_group,
            primary_issue: profile.primary_issue,
            issue_description: profile.issue_description,
            struggles: profile.struggles,
            spiritual_goals: profile.spiritual_goals,
            preferred_tone: profile.preferred_tone,
            preferred_themes: profile.preferred_themes,
            preferred_rooms: profile.preferred_rooms,
            current_situation: profile.current_situation,
            pastoral_notes: profile.pastoral_notes,
          },
          theme: theme || undefined,
          scripture: scripture || undefined,
        },
      });

      if (error) throw error;

      setGeneratedDevotion(data);
      onDevotionGenerated?.(data);
      toast.success(`Devotion generated for ${profile.name}`);
    } catch (error) {
      console.error("Error generating devotion:", error);
      toast.error("Failed to generate devotion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedDevotion) return;
    
    const text = `${generatedDevotion.title}\n\n${generatedDevotion.scripture_reference}\n"${generatedDevotion.scripture_text}"\n\n${generatedDevotion.devotional_body}\n\n${generatedDevotion.strike_line}\n\n🙏 Prayer:\n${generatedDevotion.prayer}`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Devotion copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = () => {
    setGeneratedDevotion(null);
    generateDevotion();
  };

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      {!generatedDevotion && (
        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Deep Devotion for {profile.name}
            </CardTitle>
            <CardDescription>
              Create a personalized, Phototheology-rich devotional using the master framework
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Selection */}
            <div className="space-y-2">
              <Label>Theme (optional)</Label>
              <Input
                placeholder="e.g., Hope in darkness, Finding peace..."
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {SUGGESTED_THEMES.slice(0, 5).map((t) => (
                  <Badge
                    key={t}
                    variant={theme === t ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => setTheme(t)}
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Scripture (optional) */}
            <div className="space-y-2">
              <Label>Scripture Reference (optional)</Label>
              <Input
                placeholder="e.g., Psalm 23, Isaiah 41:10... (leave blank for AI selection)"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank and the AI will choose the perfect Scripture for {profile.name}'s situation
              </p>
            </div>

            {/* Profile Context Preview */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium">Context being used:</p>
              <div className="flex flex-wrap gap-1">
                {profile.struggles?.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
                {profile.spiritual_goals?.map((g) => (
                  <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                ))}
                {profile.preferred_tone && (
                  <Badge variant="outline" className="text-xs">Tone: {profile.preferred_tone}</Badge>
                )}
              </div>
            </div>

            <Button 
              onClick={generateDevotion} 
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Crafting Deep Devotion...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Deep Devotion
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Devotion Display */}
      {generatedDevotion && (
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{generatedDevotion.title}</CardTitle>
                <CardDescription className="mt-1">
                  For {profile.name} • {generatedDevotion.theme_used && `Theme: ${generatedDevotion.theme_used}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={regenerate}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scripture */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/50">
              <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                📖 {generatedDevotion.scripture_reference}
              </p>
              <p className="text-amber-900 dark:text-amber-100 italic">
                "{generatedDevotion.scripture_text}"
              </p>
            </div>

            {/* Devotional Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <StyledMarkdown content={generatedDevotion.devotional_body} />
            </div>

            {/* Strike Line */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-lg font-medium italic text-primary">
                ✨ {generatedDevotion.strike_line}
              </p>
            </div>

            {/* Prayer */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold mb-2">🙏 Prayer</p>
              <p className="text-muted-foreground">{generatedDevotion.prayer}</p>
            </div>

            {/* Memory Hook */}
            <div className="flex items-center gap-3 bg-accent/10 rounded-lg p-3">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="text-sm font-medium">Memory Hook</p>
                <p className="text-sm text-muted-foreground">{generatedDevotion.memory_hook}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1" onClick={copyToClipboard}>
                <Send className="h-4 w-4 mr-2" />
                Share with {profile.name}
              </Button>
              <Button variant="outline" onClick={() => setGeneratedDevotion(null)}>
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
