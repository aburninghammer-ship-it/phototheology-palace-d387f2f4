import { useState } from "react";
import { Sparkles, Loader2, X, BookOpen, RefreshCw, Share2, Copy, Mail, MessageCircle, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FreeAudioButton } from "@/components/audio/FreeAudioButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoiceRecorder } from "@/components/studies/VoiceRecorder";

type DepthLevel = "light" | "standard" | "deep";
type WritingStyle = "mixed-audience" | "academic" | "pastoral" | "youth";

interface QuickDevotionProps {
  onClose: () => void;
}

interface DevotionContent {
  title: string;
  scripture_reference: string;
  scripture_text: string;
  christ_connection: string;
  application: string;
  prayer: string;
  memory_hook: string;
}

const REGEN_STORAGE_KEY = "devotion_regen_count";
const MAX_REGENERATIONS = 3;

function getRegenData(): { date: string; count: number } {
  try {
    const stored = localStorage.getItem(REGEN_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { date: "", count: 0 };
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function QuickDevotion({ onClose }: QuickDevotionProps) {
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [depth, setDepth] = useState<DepthLevel>("standard");
  const [writingStyle, setWritingStyle] = useState<WritingStyle>("mixed-audience");
  const [isGenerating, setIsGenerating] = useState(false);
  const [devotion, setDevotion] = useState<DevotionContent | null>(null);
  const [regenCount, setRegenCount] = useState(() => {
    const data = getRegenData();
    return data.date === getTodayString() ? data.count : 0;
  });

  const remainingRegens = MAX_REGENERATIONS - regenCount;

  const generateDevotion = async (isRegeneration = false) => {
    if (!theme.trim()) {
      toast.error("Please enter a theme");
      return;
    }

    if (isRegeneration && regenCount >= MAX_REGENERATIONS) {
      toast.error(`You've used all ${MAX_REGENERATIONS} regenerations for today. Try again tomorrow!`);
      return;
    }

    setIsGenerating(true);
    try {
      const fullTheme = description.trim() 
        ? `${theme.trim()} - ${description.trim()}`
        : theme.trim();
      
      const { data, error } = await supabase.functions.invoke("generate-quick-devotion", {
        body: { theme: fullTheme, depth, writingStyle },
      });

      if (error) throw error;
      setDevotion(data);

      // Track regeneration
      if (isRegeneration) {
        const newCount = regenCount + 1;
        setRegenCount(newCount);
        localStorage.setItem(REGEN_STORAGE_KEY, JSON.stringify({ 
          date: getTodayString(), 
          count: newCount 
        }));
      }
    } catch (error) {
      console.error("Error generating devotion:", error);
      toast.error("Failed to generate devotion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (regenCount >= MAX_REGENERATIONS) {
      toast.error(`You've used all ${MAX_REGENERATIONS} regenerations for today.`);
      return;
    }
    setDevotion(null);
    generateDevotion(true);
  };

  const getShareContent = () => {
    if (!devotion) return "";
    const appLink = window.location.origin;
    const divider = "═".repeat(20);
    
    const parts: string[] = [];
    parts.push(`✨ ${devotion.title} ✨`);
    parts.push("");
    parts.push(`📖 ${devotion.scripture_reference}`);
    parts.push("");
    parts.push(`"${devotion.scripture_text}"`);
    parts.push("");
    parts.push(divider);
    parts.push("");
    parts.push("✝️ Christ Connection:");
    parts.push("");
    parts.push(devotion.christ_connection);
    parts.push("");
    parts.push(divider);
    parts.push("");
    parts.push("🎯 Application:");
    parts.push("");
    parts.push(devotion.application);
    parts.push("");
    parts.push(divider);
    parts.push("");
    parts.push(`🧠 Remember: "${devotion.memory_hook}"`);
    parts.push("");
    parts.push(divider);
    parts.push("");
    parts.push("🙏 Prayer:");
    parts.push("");
    parts.push(devotion.prayer);
    parts.push("");
    parts.push(divider);
    parts.push("");
    parts.push("🌟 Get your own daily devotionals:");
    parts.push(`📱 ${appLink}`);
    
    return parts.join("\n");
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(getShareContent());
    toast.success("Devotional copied to clipboard!");
  };

  const handleShareViaEmail = () => {
    if (!devotion) return;
    const subject = encodeURIComponent(devotion.title);
    const body = encodeURIComponent(getShareContent());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareViaSMS = () => {
    const text = encodeURIComponent(getShareContent());
    window.open(`sms:?body=${text}`);
  };

  const handleShareViaTwitter = () => {
    if (!devotion) return;
    const text = encodeURIComponent(`📖 ${devotion.title} - ${devotion.scripture_reference}\n\n${window.location.origin}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(getShareContent());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Daily Devotion
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {!devotion ? (
<div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">What theme would you like to explore today?</Label>
                <Input
                  id="theme"
                  placeholder="e.g., Trust in God, Forgiveness, Patience..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Tell us more about what you'd like (optional)</Label>
                  <VoiceRecorder 
                    onTranscription={(text) => setDescription(prev => prev ? `${prev} ${text}` : text)} 
                  />
                </div>
                <Textarea
                  id="description"
                  placeholder="e.g., I'm struggling with anxiety at work and need encouragement... or I want to understand how God's faithfulness applies to my current situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Share your situation, questions, or what you hope to receive from this devotion. Use voice input to speak your thoughts.
                </p>
              </div>

              {/* Depth & Writing Style */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Depth</Label>
                  <Select value={depth} onValueChange={(v) => setDepth(v as DepthLevel)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (2-3 min read)</SelectItem>
                      <SelectItem value="standard">Standard (4-5 min)</SelectItem>
                      <SelectItem value="deep">Deep (6-8 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Writing Style</Label>
                  <Select value={writingStyle} onValueChange={(v) => setWritingStyle(v as WritingStyle)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed-audience">Mixed (Teens & Adults)</SelectItem>
                      <SelectItem value="pastoral">Pastoral</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="youth">Youth-focused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => generateDevotion(false)}
                disabled={isGenerating || !theme.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Devotion...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Today's Devotion
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title with Audio */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold">{devotion.title}</h2>
                  <FreeAudioButton 
                    text={`${devotion.title}. ${devotion.scripture_reference}. ${devotion.scripture_text}. Christ Connection: ${devotion.christ_connection}. Application: ${devotion.application}. Memory Hook: ${devotion.memory_hook}. Prayer: ${devotion.prayer}`}
                    variant="ghost"
                    size="sm"
                  />
                </div>
                <p className="text-muted-foreground">Theme: {theme}</p>
              </div>

              {/* Scripture */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{devotion.scripture_reference}</span>
                </div>
                <p className="italic text-foreground/90">{devotion.scripture_text}</p>
              </div>

              {/* Christ Connection */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">✝️ Christ Connection</h3>
                <p className="text-muted-foreground">{devotion.christ_connection}</p>
              </div>

              {/* Application */}
              <div>
                <h3 className="font-semibold mb-2 text-lg">🎯 Application</h3>
                <p className="text-muted-foreground">{devotion.application}</p>
              </div>

              {/* Memory Hook */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">🧠 Memory Hook</h3>
                <p className="text-foreground/90">{devotion.memory_hook}</p>
              </div>

              {/* Prayer */}
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">🙏 Prayer</h3>
                <p className="italic text-muted-foreground">{devotion.prayer}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={handleCopyContent}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Content
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareViaEmail}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareViaSMS}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Text Message
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareViaWhatsApp}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareViaTwitter}>
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter/X
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="outline" 
                  onClick={handleRegenerate} 
                  disabled={remainingRegens <= 0 || isGenerating}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  Regenerate ({remainingRegens} left)
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
