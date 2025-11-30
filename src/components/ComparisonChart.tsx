import { Check, X, Minus, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feature {
  name: string;
  description?: string;
  phototheology: "yes" | "no" | "partial";
  youversion: "yes" | "no" | "partial";
  blueletter: "yes" | "no" | "partial";
  logos: "yes" | "no" | "partial";
  biblegateway: "yes" | "no" | "partial";
}

const features: Feature[] = [
  {
    name: "Visual Bible Memory System",
    description: "Full 8-Floor Memory Palace — store Scripture as vivid mental architecture",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "24FPS Full-Book Memorization",
    description: "Turn entire books into mental film strips with one image per chapter",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Story → Theme → Prophecy Connections",
    description: "Unified architecture linking narrative, doctrine, and end-time prophecy",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Gamified Scripture Learning",
    description: "Escape rooms, challenges, and mastery games to make learning stick",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "AI Study Partner (Jeeves)",
    description: "Phototheology-trained AI that guides you through the Palace method",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "See-Jesus Mode",
    description: "Find Christ in every chapter — the Concentration Room applied everywhere",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Memory Floors & Room Mastery",
    description: "Track progress through 8 floors of Bible study methodology",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Prophecy Integration",
    description: "Daniel, Revelation, and Sanctuary woven into every study path",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "AI-Powered Bible Encyclopedia",
    description: "PT Engine connecting topics to rooms, floors, and Christ-centered insights",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Personal Devotional Profiles",
    description: "Issue-specific devotionals tailored to your spiritual journey",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Interactive Sanctuary Study",
    description: "Walk through the sanctuary blueprint as a map of salvation",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Kid Mode",
    description: "Age-appropriate memory games and palace training for children",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Live Study Drills & Mastery Tests",
    description: "Active recall exercises that cement Scripture in memory",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Multiplayer Bible Study",
    description: "Team challenges and collaborative learning modes",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Reading Plans",
    description: "Structured daily reading schedules",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "no",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Audio Bible",
    description: "Listen to Scripture read aloud",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Commentary Access",
    description: "In-depth verse-by-verse explanations",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "partial",
  },
];

const StatusIcon = ({ status }: { status: "yes" | "no" | "partial" }) => {
  if (status === "yes") {
    return <Check className="h-5 w-5 text-green-500" />;
  }
  if (status === "partial") {
    return <Minus className="h-5 w-5 text-yellow-500" />;
  }
  return <X className="h-5 w-5 text-red-400" />;
};

const FeatureWithTooltip = ({ name, description }: { name: string; description?: string }) => {
  if (!description) return <span>{name}</span>;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 cursor-help">
            {name}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[250px] text-xs">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function ComparisonChart() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            App Comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Only Bible App That Helps You <span className="text-primary">Actually Remember</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Other apps help you read. Phototheology helps you <em>retain</em>.
          </p>
        </div>

        {/* Glass Container */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl" />
          
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />

          {/* Table Content */}
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 md:px-6 font-semibold text-foreground min-w-[200px]">
                    Feature
                  </th>
                  <th className="py-4 px-2 md:px-3 text-center min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs md:text-sm font-bold text-primary">Phototheology</span>
                      <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30">OURS</Badge>
                    </div>
                  </th>
                  <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">YouVersion</span>
                  </th>
                  <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Blue Letter</span>
                  </th>
                  <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Logos</span>
                  </th>
                  <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Bible Gateway</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                      index % 2 === 0 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="py-3 px-4 md:px-6 text-sm font-medium text-foreground">
                      <FeatureWithTooltip name={feature.name} description={feature.description} />
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      <div className="flex justify-center">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <StatusIcon status={feature.phototheology} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.youversion} />
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.blueletter} />
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.logos} />
                      </div>
                    </td>
                    <td className="py-3 px-2 md:px-3 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.biblegateway} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 py-4 px-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Full Support</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Minus className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Partial / Limited</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <X className="h-4 w-4 text-red-400" />
              <span className="text-muted-foreground">Not Available</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-muted-foreground mt-6 text-sm">
          Hover over features to learn what makes them unique to Phototheology
        </p>
      </div>
    </section>
  );
}
