import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, ChevronDown, ChevronUp, RefreshCw, Save, Share2 } from "lucide-react";
import { FragmentDialogue } from "./FragmentDialogue";
import { motion } from "framer-motion";

interface FragmentInsight {
  roomCode: string;
  roomName: string;
  floorNumber: number;
  content: string;
}

interface GatherFragmentsResultProps {
  verse: string;
  verseText: string;
  insights: FragmentInsight[];
  unifiedThread?: string;
  onRefresh: () => void;
  onSave?: () => void;
  loading?: boolean;
}

const floorColors: Record<number, string> = {
  1: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  2: "from-green-500/20 to-green-600/10 border-green-500/30",
  3: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
  4: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  5: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
  6: "from-red-500/20 to-red-600/10 border-red-500/30",
};

const floorNames: Record<number, string> = {
  1: "Furnishing",
  2: "Investigation",
  3: "Freestyle",
  4: "Next Level",
  5: "Vision",
  6: "Three Heavens",
};

export const GatherFragmentsResult = ({
  verse,
  verseText,
  insights,
  unifiedThread,
  onRefresh,
  onSave,
  loading,
}: GatherFragmentsResultProps) => {
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set(insights.map(i => i.roomCode)));

  const toggleRoom = (roomCode: string) => {
    setExpandedRooms(prev => {
      const next = new Set(prev);
      if (next.has(roomCode)) {
        next.delete(roomCode);
      } else {
        next.add(roomCode);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedRooms(new Set(insights.map(i => i.roomCode)));
  const collapseAll = () => setExpandedRooms(new Set());

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-primary">{verse}</h2>
              </div>
              <p className="text-muted-foreground italic">"{verseText}"</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                New Combination
              </Button>
              {onSave && (
                <Button variant="outline" size="sm" onClick={onSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fragment Insights */}
      <div className="grid gap-4">
        {insights.map((insight, idx) => (
          <motion.div
            key={insight.roomCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Collapsible
              open={expandedRooms.has(insight.roomCode)}
              onOpenChange={() => toggleRoom(insight.roomCode)}
            >
              <Card className={`bg-gradient-to-br ${floorColors[insight.floorNumber] || "from-muted/50 to-muted/30"} border`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="font-mono">
                          {insight.roomCode}
                        </Badge>
                        <div>
                          <CardTitle className="text-base">{insight.roomName}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            Floor {insight.floorNumber}: {floorNames[insight.floorNumber]}
                          </p>
                        </div>
                      </div>
                      {expandedRooms.has(insight.roomCode) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Insight Content */}
                    <div className="bg-background/60 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {insight.content}
                      </p>
                    </div>

                    {/* Interactive Dialogue */}
                    <FragmentDialogue
                      roomCode={insight.roomCode}
                      roomName={insight.roomName}
                      initialInsight={insight.content}
                      verseText={verseText}
                      verseReference={verse}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>
        ))}
      </div>

      {/* Unified Thread */}
      {unifiedThread && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: insights.length * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-primary/20 to-accent/10 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔗 Unified Thread
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{unifiedThread}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Footer */}
      <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm italic text-muted-foreground">
          "Gather up the fragments that remain, that nothing be lost." — John 6:12
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Click "Discuss with Jeeves" on any insight to explore deeper
        </p>
      </div>
    </div>
  );
};
