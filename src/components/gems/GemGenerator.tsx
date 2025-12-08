import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Gem, Sparkles, Loader2, Save, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GemGeneratorProps {
  floorNumber: number;
  roomId: string;
  onGemSaved?: () => void;
}

export function GemGenerator({ floorNumber, roomId, onGemSaved }: GemGeneratorProps) {
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedGem, setGeneratedGem] = useState<{ gem: string; title: string } | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedGem(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-gem");

      if (error) {
        console.error("Error generating gem:", error);
        toast.error("Failed to generate gem. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.gem && data?.title) {
        setGeneratedGem({ gem: data.gem, title: data.title });
        toast.success("Gem generated! ✨");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the gem.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !generatedGem) return;

    setSaving(true);
    try {
      // First moderate the content
      const { data: moderationData, error: moderationError } = await supabase.functions.invoke(
        "moderate-content",
        {
          body: {
            content: generatedGem.gem,
            type: "text",
          },
        }
      );

      if (moderationError) {
        console.error("Moderation error:", moderationError);
      } else if (moderationData && !moderationData.safe) {
        toast.error(`Content not allowed: ${moderationData.reason}`);
        setSaving(false);
        return;
      }

      // Try to categorize
      let category = "AI Generated";
      try {
        const { data: categoryData, error: categoryError } = await supabase.functions.invoke(
          "categorize-gem",
          {
            body: {
              gemName: generatedGem.title,
              gemContent: generatedGem.gem.substring(0, 500),
            },
          }
        );

        if (!categoryError && categoryData?.category) {
          category = categoryData.category;
        }
      } catch (catError) {
        console.error("Categorization error:", catError);
      }

      // Save to database
      const { error: saveError } = await supabase.from("user_gems").insert({
        user_id: user.id,
        gem_name: generatedGem.title,
        gem_content: generatedGem.gem,
        room_id: roomId,
        floor_number: floorNumber,
        category: category,
      });

      if (saveError) throw saveError;

      toast.success(`Gem saved to ${category}! 💎`);
      setGeneratedGem(null);
      onGemSaved?.();
    } catch (error) {
      console.error("Error saving gem:", error);
      toast.error("Failed to save gem");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Sign in to generate and save gems!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5" />
              Gem Generator
            </CardTitle>
            <CardDescription>
              Discover hidden connections between Scripture passages using Phototheology
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            💎 Jeeves will select 2-3 seemingly unrelated Bible verses and reveal a powerful, 
            unexpected connection using the Phototheology Palace framework.
          </p>
          <p className="text-xs">
            Each gem is structured with: Title → Verses → Thread → Palace Method → The Gem → Adventist Alignment
          </p>
        </div>

        {!generatedGem && (
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Gem...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate New Gem
              </>
            )}
          </Button>
        )}

        {generatedGem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Gem className="h-5 w-5 text-primary" />
                {generatedGem.title}
              </h3>
            </div>

            <ScrollArea className="h-[400px] rounded-lg border bg-card p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {generatedGem.gem}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save to Collection
                  </>
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                variant="outline"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
