import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Link2, ChevronDown, ChevronUp, Search, Info, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface PTChainReferenceBoxProps {
  book?: string;
  chapter?: number;
  chapterText?: string;
  onHighlightVerses?: (verses: number[]) => void;
}

// All 37 Palace Rooms organized by floor
const PRINCIPLES = [
  // Floor 1 - Furnishing (Memory & Visualization)
  { value: "SR", label: "Story Room (SR)", floor: 1 },
  { value: "IR", label: "Imagination Room (IR)", floor: 1 },
  { value: "24F", label: "24FPS Room (24F)", floor: 1 },
  { value: "BR", label: "Bible Rendered (BR)", floor: 1 },
  { value: "TR", label: "Translation Room (TR)", floor: 1 },
  { value: "GR", label: "Gems Room (GR)", floor: 1 },
  
  // Floor 2 - Investigation (Detective Work)
  { value: "OR", label: "Observation Room (OR)", floor: 2 },
  { value: "DC", label: "Def-Com Room (DC)", floor: 2 },
  { value: "ST", label: "Symbols/Types Room (ST)", floor: 2 },
  { value: "QR", label: "Questions Room (QR)", floor: 2 },
  { value: "QA", label: "Q&A Internship (QA)", floor: 2 },
  
  // Floor 3 - Freestyle (Connections)
  { value: "NF", label: "Nature Freestyle (NF)", floor: 3 },
  { value: "PF", label: "Personal Freestyle (PF)", floor: 3 },
  { value: "BF", label: "Bible Freestyle (BF)", floor: 3 },
  { value: "HF", label: "History Freestyle (HF)", floor: 3 },
  { value: "LR", label: "Listening Room (LR)", floor: 3 },
  
  // Floor 4 - Next Level (Christ-Centered Depth)
  { value: "CR", label: "Concentration Room (CR)", floor: 4 },
  { value: "DR", label: "Dimensions Room (DR)", floor: 4 },
  { value: "C6", label: "Connect 6 Room (C6)", floor: 4 },
  { value: "TRm", label: "Theme Room (TRm)", floor: 4 },
  { value: "TZ", label: "Time Zone Room (TZ)", floor: 4 },
  { value: "PRm", label: "Patterns Room (PRm)", floor: 4 },
  { value: "P", label: "Parallels Room (P‖)", floor: 4 },
  { value: "FRt", label: "Fruit Room (FRt)", floor: 4 },
  { value: "CEC", label: "Christ in Every Chapter (CEC)", floor: 4 },
  { value: "R66", label: "Room 66 (R66)", floor: 4 },
  
  // Floor 5 - Vision (Prophecy & Sanctuary)
  { value: "BL", label: "Blue Room / Sanctuary (BL)", floor: 5 },
  { value: "PR", label: "Prophecy Room (PR)", floor: 5 },
  { value: "3A", label: "Three Angels' Room (3A)", floor: 5 },
  { value: "FR", label: "Feasts Room (FR)", floor: 5 },
  
  // Floor 6 - Three Heavens (Cycles & Cosmic Context)
  { value: "cycles", label: "Eight Cycles (@Ad-@Re)", floor: 6 },
  { value: "horizons", label: "Three Heavens (1H-3H)", floor: 6 },
  { value: "JR", label: "Juice Room (JR)", floor: 6 },
  
  // Floor 7 - Spiritual & Emotional
  { value: "FRm", label: "Fire Room (FRm)", floor: 7 },
  { value: "MR", label: "Meditation Room (MR)", floor: 7 },
  { value: "SRm", label: "Speed Room (SRm)", floor: 7 },
];

export const PTChainReferenceBox = ({ book, chapter, chapterText, onHighlightVerses }: PTChainReferenceBoxProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChainReferenceResult[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("ST");
  const { toast } = useToast();

  const currentChapter = book && chapter ? `${book} ${chapter}` : null;

  // Reset results when chapter changes
  useEffect(() => {
    setResults([]);
    setExpandedIndex(null);
  }, [book, chapter]);

  // Update highlighted verses when results change
  useEffect(() => {
    if (onHighlightVerses && results.length > 0) {
      const verseNumbers = results.map(r => r.verse).filter(v => v > 0);
      onHighlightVerses(verseNumbers);
    } else if (onHighlightVerses) {
      onHighlightVerses([]);
    }
  }, [results, onHighlightVerses]);

  const scanChapter = async () => {
    if (!currentChapter) {
      toast({
        title: "No Chapter Selected",
        description: "Please navigate to a chapter first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults([]);
    try {
      console.log("PT Chain Reference: Scanning chapter", { 
        mode: "pt-chain-chapter", 
        principle: selectedPrinciple, 
        book,
        chapter,
      });
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "pt-chain-chapter",
          principle: selectedPrinciple,
          book,
          chapter,
          chapterText,
        },
      });

      if (error) {
        console.error("PT Chain Reference API error:", error);
        throw error;
      }

      console.log("PT Chain Reference: Raw response", data);

      let parsedResults: ChainReferenceResult[] = [];
      try {
        const content = data?.content || "";
        console.log("PT Chain Reference: Content to parse", content);
        
        if (!content) {
          throw new Error("Empty response from Jeeves");
        }
        
        let cleanedContent = content
          .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '');
        
        const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      } catch (parseError) {
        console.error("PT Chain Reference: Failed to parse:", parseError);
        toast({
          title: "Parsing Error",
          description: "Failed to parse chain references. Try again.",
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
      const principleLabel = PRINCIPLES.find(p => p.value === selectedPrinciple)?.label;
      toast({
        title: "Chain References Found",
        description: `Found ${parsedResults.length} verses with ${principleLabel} connections`,
      });
    } catch (error: any) {
      console.error("PT Chain Reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to find chain references. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="gradient-palace text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          PT Chain Reference
        </CardTitle>
        <CardDescription className="text-white/90">
          Scan the current chapter to discover principle-based connections
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Current Chapter Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Chapter</label>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/30">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">
              {currentChapter || "Navigate to a chapter"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Principle Lens</label>
          <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a principle" />
            </SelectTrigger>
            <SelectContent className="max-h-[400px]">
              {[1, 2, 3, 4, 5, 6, 7].map((floor) => {
                const floorPrinciples = PRINCIPLES.filter(p => p.floor === floor);
                const floorNames = ["", "Furnishing", "Investigation", "Freestyle", "Next Level", "Vision", "Three Heavens", "Spiritual"];
                return (
                  <div key={floor}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                      Floor {floor}: {floorNames[floor]}
                    </div>
                    {floorPrinciples.map((principle) => (
                      <SelectItem key={principle.value} value={principle.value}>
                        {principle.label}
                      </SelectItem>
                    ))}
                  </div>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={scanChapter}
          disabled={loading || !currentChapter}
          className="w-full gradient-royal text-white shadow-blue disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning {currentChapter}...
            </>
          ) : !currentChapter ? (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              Navigate to a Chapter First
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Scan {currentChapter} for Connections
            </>
          )}
        </Button>

        <ScrollArea className="h-[400px]">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="gradient-palace text-white">
                        v{result.verse}: {result.reference}
                      </Badge>
                      {result.ptCodes && result.ptCodes.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
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
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Related Scriptures:</p>
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
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full justify-between hover:bg-primary/10"
                  >
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {expandedIndex === index ? "Hide Explanation" : "How This Connects"}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {expandedIndex === index && result.expounded && (
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
                {currentChapter 
                  ? `Select a principle and scan ${currentChapter} to discover how Scripture interprets Scripture`
                  : "Navigate to a chapter to scan for principle-based connections"
                }
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
