import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, Zap } from "lucide-react";

interface ValuePropositionProps {
  roomId: string;
}

export const ValueProposition = ({ roomId }: ValuePropositionProps) => {
  const values: Record<string, {
    why: string;
    whatYouGain: string;
    immediate: string;
  }> = {
    sr: {
      why: "You can't interpret what you can't remember. Every other room in the Palace depends on you knowing the storyline.",
      whatYouGain: "Instant recall of any Bible story in beats—teach it, preach it, reference it without notes",
      immediate: "In 5 minutes, you'll have David & Goliath locked in your memory forever"
    },
    ir: {
      why: "Facts alone don't transform you—but experiencing Scripture with all five senses burns it into your heart",
      whatYouGain: "Stories that stick for decades because you've truly 'been there'—not just read about it",
      immediate: "In 2 minutes, one scene will touch your emotions deeper than 10 commentaries"
    },
    "24fps": {
      why: "You've read it, but WHERE was it? This room makes every chapter instantly findable.",
      whatYouGain: "Never again stare blankly when someone references a chapter—you'll see the image and recall the content",
      immediate: "In 5 minutes, you'll have 3 chapters permanently indexed in your mind"
    },
    br: {
      why: "Without the big picture, you get lost in details. This gives you a mental map of all 1,189 chapters.",
      whatYouGain: "See how every passage fits into the grand narrative—sketch the whole Bible on a napkin",
      immediate: "In 5 minutes, you'll compress 24 chapters into one unforgettable symbol"
    },
    tr: {
      why: "Your brain remembers images 6x better than words. This turns abstract truth into concrete visuals.",
      whatYouGain: "Illustrations that make your teaching unforgettable—listeners forget points but remember pictures",
      immediate: "In 3 minutes, one verse will become a vivid image you'll never forget"
    },
    gr: {
      why: "The most powerful insights emerge when you combine texts that illuminate each other",
      whatYouGain: "Sermon-ready truths that defend the faith and reveal connections most readers miss",
      immediate: "In 5 minutes, discover one 'aha!' connection that will preach for years"
    },
    or: {
      why: "Interpretation built on sloppy observation is a house on sand. This trains your eye to see what's really there.",
      whatYouGain: "Patterns and details you never noticed before—the 23rd observation often unlocks everything",
      immediate: "In 5 minutes, find 10 details in one verse you've read a hundred times"
    },
    dc: {
      why: "English translations hide crucial meanings. You need to know what the original words meant THEN.",
      whatYouGain: "Stand on the shoulders of giants while keeping Scripture as final authority",
      immediate: "In 10 minutes, unlock one word that changes how you see an entire passage"
    },
    st: {
      why: "God's symbols are consistent throughout Scripture—learn the vocabulary He uses to teach",
      whatYouGain: "A theological toolbox of symbols that unlock hundreds of passages instantly",
      immediate: "In 10 minutes, map one symbol (like LAMB) from Genesis to Revelation"
    }
  };

  const value = values[roomId];
  if (!value) return null;

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Why This Room Matters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">The Foundation</h4>
              <p className="text-sm text-muted-foreground">{value.why}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">What You'll Gain</h4>
              <p className="text-sm text-muted-foreground">{value.whatYouGain}</p>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            ⚡ Quick Win: {value.immediate}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
