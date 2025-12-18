import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles } from "lucide-react";

interface AlwaysOnStudyProps {
  activeStudyTitle?: string | null;
}

// Default Sabbath-focused content when no active study exists
const SABBATH_FALLBACK = {
  title: "Sabbath Focus",
  subtitle: "Resting in His Presence",
  verses: [
    { ref: "Isaiah 58:13-14", text: "If thou turn away thy foot from the sabbath, from doing thy pleasure on my holy day; and call the sabbath a delight..." },
    { ref: "Matthew 11:28", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
    { ref: "Hebrews 4:9-10", text: "There remaineth therefore a rest to the people of God." }
  ],
  reflection: "This week, consider how the Sabbath points us to Christ — our true rest. He is both the Lord of the Sabbath and the One who gives us rest from our striving.",
  prayerPrompt: "Lord, teach us to cease from our own works and enter into Your rest..."
};

export function AlwaysOnStudy({ activeStudyTitle }: AlwaysOnStudyProps) {
  const hasActiveStudy = activeStudyTitle && activeStudyTitle !== "No active study";

  if (hasActiveStudy) {
    return null; // Don't show fallback when there's an active study
  }

  return (
    <Card variant="glass" className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{SABBATH_FALLBACK.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{SABBATH_FALLBACK.subtitle}</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Always Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scripture Verses */}
        <div className="space-y-3">
          {SABBATH_FALLBACK.verses.map((verse, index) => (
            <div key={index} className="p-3 rounded-lg bg-background/50 border border-border/50">
              <p className="text-sm italic text-foreground/90">"{verse.text}"</p>
              <p className="text-xs text-primary mt-1 font-medium">{verse.ref}</p>
            </div>
          ))}
        </div>

        {/* Reflection */}
        <div className="pt-2">
          <h4 className="text-sm font-semibold mb-2 text-foreground/80">Reflection</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {SABBATH_FALLBACK.reflection}
          </p>
        </div>

        {/* Prayer Prompt */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground italic">
            {SABBATH_FALLBACK.prayerPrompt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
