import { useState } from "react";
import { Sparkles, Loader2, X, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export function QuickDevotion({ onClose }: QuickDevotionProps) {
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [devotion, setDevotion] = useState<DevotionContent | null>(null);

  const generateDevotion = async () => {
    if (!theme.trim()) {
      toast.error("Please enter a theme");
      return;
    }

    setIsGenerating(true);
    try {
      // Combine theme and description for richer context
      const fullTheme = description.trim() 
        ? `${theme.trim()} - ${description.trim()}`
        : theme.trim();
      
      const { data, error } = await supabase.functions.invoke("generate-quick-devotion", {
        body: { theme: fullTheme },
      });

      if (error) throw error;
      setDevotion(data);
    } catch (error) {
      console.error("Error generating devotion:", error);
      toast.error("Failed to generate devotion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setDevotion(null);
    generateDevotion();
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
                <Label htmlFor="description">Tell us more about what you'd like (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., I'm struggling with anxiety at work and need encouragement... or I want to understand how God's faithfulness applies to my current situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Share your situation, questions, or what you hope to receive from this devotion.
                </p>
              </div>
              <Button
                onClick={generateDevotion}
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
              {/* Title */}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{devotion.title}</h2>
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
                <Button variant="outline" onClick={handleRegenerate} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
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
