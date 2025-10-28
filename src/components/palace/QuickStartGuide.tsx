import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickStartGuideProps {
  roomId: string;
  roomName: string;
}

export const QuickStartGuide = ({ roomId, roomName }: QuickStartGuideProps) => {
  const { toast } = useToast();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickStarts: Record<string, {
    title: string;
    tagline: string;
    steps: Array<{
      action: string;
      example: string;
      tip: string;
    }>;
  }> = {
    sr: {
      title: "Try Your First Story Beat",
      tagline: "Turn one story into 5 memorable beats in 3 minutes",
      steps: [
        {
          action: "Pick a story",
          example: "David & Goliath (1 Samuel 17)",
          tip: "Start with a story you already know"
        },
        {
          action: "List 5 key moments",
          example: "Giant → Boy → Stones → Sling → Victory",
          tip: "Use punchy nouns and verbs, not sentences"
        },
        {
          action: "Test it",
          example: "Can you retell the story using just these 5 beats?",
          tip: "If you need more than 7 beats, you're covering too much"
        }
      ]
    },
    ir: {
      title: "Step Into One Scene",
      tagline: "Experience one verse with all five senses in 2 minutes",
      steps: [
        {
          action: "Pick a vivid scene",
          example: "Jesus calming the storm (Mark 4:39)",
          tip: "Choose action-packed moments for your first try"
        },
        {
          action: "Close your eyes & experience it",
          example: "Feel the rocking boat, hear the wind howling, see the panicked faces, smell the sea spray",
          tip: "Spend 30 seconds on each sense"
        },
        {
          action: "Write one powerful sentence",
          example: "The crushing fear in my chest as waves tower over me, then His voice—and sudden, eerie silence.",
          tip: "Capture the emotional shift"
        }
      ]
    },
    "24fps": {
      title: "Create Your First 3 Frames",
      tagline: "Turn 3 chapters into instant-recall images in 5 minutes",
      steps: [
        {
          action: "Choose 3 chapters you know",
          example: "Genesis 1, 3, and 22",
          tip: "Start with familiar chapters for quick wins"
        },
        {
          action: "Pick ONE striking image per chapter",
          example: "Gen 1 = Birthday cake Earth • Gen 3 = Snake+Apple+Clock • Gen 22 = Knife over altar",
          tip: "Quirky and weird sticks better than dignified"
        },
        {
          action: "Test instant recall",
          example: "Someone says 'Genesis 3'—does your image flash instantly?",
          tip: "The image is a trigger, not a summary"
        }
      ]
    },
    br: {
      title: "Map Your First Book Block",
      tagline: "Compress 24 chapters into 1 symbol in 5 minutes",
      steps: [
        {
          action: "Pick one 24-chapter block",
          example: "Genesis 1-24",
          tip: "Start with a book you know well"
        },
        {
          action: "Find the central movement",
          example: "Divisions emerge: light/dark, land/sea, nations splitting",
          tip: "What's the BIG arc across all 24 chapters?"
        },
        {
          action: "Choose a symbol",
          example: "Genesis 1-24 = '/' (slash = division)",
          tip: "Keep it simple—one symbol only"
        }
      ]
    },
    tr: {
      title: "Translate Your First Verse",
      tagline: "Turn one abstract verse into a concrete image in 3 minutes",
      steps: [
        {
          action: "Pick a metaphor verse",
          example: "Psalm 119:105 - 'Thy word is a lamp unto my feet'",
          tip: "Verses with objects work best first"
        },
        {
          action: "Draw or describe the image",
          example: "A glowing scroll unrolled on a dark trail, casting golden light 5 feet ahead",
          tip: "Bad art is fine—focus on memorability"
        },
        {
          action: "Test it",
          example: "Does this image stick in your mind better than the words alone?",
          tip: "Images should be 6x more memorable"
        }
      ]
    },
    gr: {
      title: "Mine Your First Gem",
      tagline: "Discover one hidden connection in 5 minutes",
      steps: [
        {
          action: "Pick 2 verses from different books",
          example: "Exodus 12:6 (Passover at twilight) + John 19:14 (crucifixion timing)",
          tip: "Look for unexpected connections"
        },
        {
          action: "Place them side by side",
          example: "Passover lamb slain at twilight... Jesus died at same hour",
          tip: "What beautiful truth emerges?"
        },
        {
          action: "Write the gem",
          example: "💎 Jesus died at the EXACT moment Passover lambs were being slain—He is the true Passover Lamb",
          tip: "One sentence that preaches"
        }
      ]
    },
    or: {
      title: "Observe One Verse",
      tagline: "Find 10 details you've never noticed in 5 minutes",
      steps: [
        {
          action: "Pick one rich verse",
          example: "Luke 15:20 (Prodigal's return)",
          tip: "Choose verses with action and detail"
        },
        {
          action: "List 10 things you SEE",
          example: "1. Father SAW (was watching) 2. 'While still far off' 3. Father RAN 4. Fell on neck 5. Kissed him 6. Before son finished speech...",
          tip: "No interpretation yet—just facts"
        },
        {
          action: "Notice the pattern",
          example: "All verbs show father's eager, undignified initiative—he doesn't wait",
          tip: "20+ observations reveal patterns"
        }
      ]
    }
  };

  const guide = quickStarts[roomId];
  if (!guide) return null;

  const handleStepComplete = (index: number) => {
    if (!completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
      if (index === guide.steps.length - 1) {
        toast({
          title: "Quick Start Complete! 🎉",
          description: "You've got the basics. Now dive deeper in the full room content.",
        });
      }
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Example copied—now try it yourself!",
    });
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Quick Start
              </Badge>
            </div>
            <CardTitle className="text-2xl">{guide.title}</CardTitle>
            <CardDescription className="text-base mt-1">
              {guide.tagline}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {guide.steps.map((step, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              completedSteps.includes(index)
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                completedSteps.includes(index)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-lg">{step.action}</h4>
                <div className="bg-muted/50 p-3 rounded border border-border relative group">
                  <p className="text-sm font-mono pr-8">{step.example}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(step.example, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  💡 {step.tip}
                </p>
                {!completedSteps.includes(index) && (
                  <Button
                    size="sm"
                    onClick={() => handleStepComplete(index)}
                    className="mt-2"
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {completedSteps.length === guide.steps.length && (
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border-2 border-primary/30">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <CheckCircle className="h-5 w-5" />
              <span>Quick Start Complete!</span>
            </div>
            <p className="text-sm">
              You've experienced the core method. Now scroll down to explore the full methodology, examples, and practice with Jeeves.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
