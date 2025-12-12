import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Link2, Sparkles, ChevronDown, ChevronUp, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Verse } from "@/types/bible";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { motion, AnimatePresence } from "framer-motion";

interface CrossReference {
  reference: string;
  relationship: string;
  confidence: number;
  note: string;
}

interface ChainReferenceResult {
  verse: number;
  reference: string;
  principle: string;
  ptCodes: string[];
  connection: string;
  crossReferences: CrossReference[];
  expounded: string;
}

interface ChainReferencePanelProps {
  book: string;
  chapter: number;
  verses: Verse[];
  onHighlight: (verseNumbers: number[]) => void;
}

const PRINCIPLES = [
  { value: "parables", label: "Parables of Jesus" },
  { value: "prophecy", label: "Prophecy Connections" },
  { value: "life-of-christ", label: "Life of Christ Wall" },
  { value: "70-weeks", label: "70 Week Connections" },
  { value: "2d", label: "2D Christ Dimension" },
  { value: "3d", label: "3D Kingdom Dimension" },
  { value: "sanctuary", label: "Sanctuary Principles" },
  { value: "feasts", label: "Feast Connections" },
  { value: "types", label: "Types & Shadows" },
  { value: "covenant", label: "Covenant Themes" },
];

export const ChainReferencePanel = ({ book, chapter, verses, onHighlight }: ChainReferencePanelProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChainReferenceResult[]>([]);
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("parables");
  const { toast } = useToast();

  const analyzePrinciple = async () => {
    setLoading(true);
    setResults([]); // Clear previous results
    try {
      console.log("Chain reference: Calling jeeves with", { mode: "chain-reference", principle: selectedPrinciple, book, chapter });
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-reference",
          principle: selectedPrinciple,
          book,
          chapter,
          verses: verses.map(v => ({ verse: v.verse, text: v.text })),
        },
      });

      if (error) {
        console.error("Chain reference API error:", error);
        throw error;
      }

      console.log("Chain reference: Raw response", data);

      // Parse the AI response to extract JSON
      let parsedResults: ChainReferenceResult[] = [];
      try {
        const content = data?.content || "";
        console.log("Chain reference: Content to parse", content);
        
        if (!content) {
          throw new Error("Empty response from Jeeves");
        }
        
        // Clean control characters and fix common JSON issues
        let cleanedContent = content
          .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control chars
          .replace(/```json\s*/g, '') // Remove markdown code blocks
          .replace(/```\s*/g, '');
        
        // Try to extract JSON array from the content
        const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          console.log("Chain reference: JSON match found", jsonMatch[0].substring(0, 200));
          parsedResults = JSON.parse(jsonMatch[0]);
          console.log("Chain reference: Parsed results count", parsedResults.length);
        } else {
          console.warn("Chain reference: No JSON array found in response");
          throw new Error("No JSON array found in response");
        }
      } catch (parseError) {
        console.error("Chain reference: Failed to parse AI response:", parseError);
        toast({
          title: "Parsing Error",
          description: "Failed to parse principle connections. Try again.",
          variant: "destructive",
        });
        return;
      }

      if (parsedResults.length === 0) {
        toast({
          title: "No Connections Found",
          description: `No ${PRINCIPLES.find(p => p.value === selectedPrinciple)?.label} connections found in this chapter.`,
        });
        return;
      }

      setResults(parsedResults);
      onHighlight(parsedResults.map(r => r.verse));

      const principleLabel = PRINCIPLES.find(p => p.value === selectedPrinciple)?.label;
      toast({
        title: "Analysis Complete",
        description: `Found ${parsedResults.length} ${principleLabel} connections`,
      });
    } catch (error: any) {
      console.error("Chain reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze principle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant">
      <CardHeader className="gradient-palace text-white">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Chain Reference Mode
        </CardTitle>
        <CardDescription className="text-white/90">
          Find principle connections in this chapter
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Principle to Analyze</label>
          <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a principle" />
            </SelectTrigger>
            <SelectContent>
              {PRINCIPLES.map((principle) => (
                <SelectItem key={principle.value} value={principle.value}>
                  {principle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={analyzePrinciple}
          disabled={loading}
          className="w-full gradient-royal text-white shadow-blue"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing {PRINCIPLES.find(p => p.value === selectedPrinciple)?.label}...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Find Connections
            </>
          )}
        </Button>

        <ScrollArea className="h-[450px]">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.verse}
                  className="p-4 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="gradient-palace text-white">
                        {result.reference || `Verse ${result.verse}`}
                      </Badge>
                      {result.ptCodes && result.ptCodes.length > 0 && (
                        <div className="flex gap-1">
                          {result.ptCodes.map((code, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {result.principle}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {result.connection}
                  </p>

                  {result.crossReferences && result.crossReferences.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Cross References:</p>
                      {result.crossReferences.map((ref, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {ref.reference}
                          </Badge>
                          <div className="flex-1">
                            <span className="font-medium text-primary">{ref.relationship}</span>
                            <span className="text-muted-foreground"> ({ref.confidence}%)</span>
                            <p className="text-muted-foreground mt-0.5">{ref.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedVerse(expandedVerse === result.verse ? null : result.verse)}
                    className="w-full justify-between hover:bg-primary/10"
                  >
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {expandedVerse === result.verse ? "Hide Explanation" : "How This Connects"}
                    </span>
                    {expandedVerse === result.verse ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {expandedVerse === result.verse && result.expounded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground leading-relaxed">
                          {formatJeevesResponse(result.expounded)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Link2 className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                Select a principle and click "Find Connections" to discover how verses 
                in this chapter connect to that biblical principle
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
