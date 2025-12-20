import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { BookOpen, Copy, Download, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface VerseExtractionProps {
  inputText: string;
  scriptureConnections?: Array<{ reference: string; connection: string }>;
  typologyLayers?: Array<{ symbol: string; meaning: string; reference: string }>;
  followUpConversation?: Array<{ role: "user" | "assistant"; content: string }>;
}

interface ExtractedVerse {
  reference: string;
  source: string;
  context?: string;
}

// Common verse reference patterns
const versePatterns = [
  // Book Chapter:Verse (with optional verse range)
  /\b(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\s*Samuel|2\s*Samuel|1\s*Kings|2\s*Kings|1\s*Chronicles|2\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\s*of\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\s*Corinthians|2\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\s*Thessalonians|2\s*Thessalonians|1\s*Timothy|2\s*Timothy|Titus|Philemon|Hebrews|James|1\s*Peter|2\s*Peter|1\s*John|2\s*John|3\s*John|Jude|Revelation)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/gi,
  // Abbreviated books
  /\b(Gen|Exod?|Lev|Num|Deut|Josh|Judg|Ru|1\s*Sam|2\s*Sam|1\s*Kgs?|2\s*Kgs?|1\s*Chr|2\s*Chr|Neh|Est|Ps|Prov|Eccl|Song|Isa|Jer|Lam|Ezek?|Dan|Hos|Am|Ob|Jon|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt?|Mk|Lk|Jn|Ac|Rom|1\s*Cor|2\s*Cor|Gal|Eph|Phil|Col|1\s*Thess?|2\s*Thess?|1\s*Tim|2\s*Tim|Tit|Phlm|Heb|Jas|1\s*Pet|2\s*Pet|1\s*Jn|2\s*Jn|3\s*Jn|Rev)\.?\s+(\d+)(?::(\d+)(?:-(\d+))?)?/gi,
];

export const VerseExtraction = ({
  inputText,
  scriptureConnections,
  typologyLayers,
  followUpConversation
}: VerseExtractionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const extractedVerses = useMemo(() => {
    const versesMap = new Map<string, ExtractedVerse>();

    // Helper to add verse to map (avoiding duplicates)
    const addVerse = (reference: string, source: string, context?: string) => {
      const normalizedRef = reference.trim();
      if (!versesMap.has(normalizedRef.toLowerCase())) {
        versesMap.set(normalizedRef.toLowerCase(), { 
          reference: normalizedRef, 
          source, 
          context 
        });
      }
    };

    // Extract from scripture connections
    scriptureConnections?.forEach(sc => {
      if (sc.reference) {
        addVerse(sc.reference, "Scripture Connection", sc.connection);
      }
    });

    // Extract from typology layers
    typologyLayers?.forEach(tl => {
      if (tl.reference) {
        addVerse(tl.reference, "Typology Layer", `${tl.symbol}: ${tl.meaning}`);
      }
    });

    // Extract from input text using regex
    const extractFromText = (text: string, source: string) => {
      versePatterns.forEach(pattern => {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          addVerse(match[0], source);
        }
      });
    };

    extractFromText(inputText, "Your Input");

    // Extract from follow-up conversation
    followUpConversation?.forEach((msg, idx) => {
      extractFromText(msg.content, msg.role === "user" ? "Your Follow-up" : "Jeeves Response");
    });

    return Array.from(versesMap.values());
  }, [inputText, scriptureConnections, typologyLayers, followUpConversation]);

  const generateOutline = () => {
    const lines = [
      "═══════════════════════════════════════",
      "       VERSE EXTRACTION OUTLINE        ",
      "═══════════════════════════════════════",
      `Generated: ${new Date().toLocaleString()}`,
      `Total Verses: ${extractedVerses.length}`,
      "",
      "───────────────────────────────────────",
      ""
    ];

    // Group by source
    const bySource = extractedVerses.reduce((acc, verse) => {
      if (!acc[verse.source]) acc[verse.source] = [];
      acc[verse.source].push(verse);
      return acc;
    }, {} as Record<string, ExtractedVerse[]>);

    Object.entries(bySource).forEach(([source, verses]) => {
      lines.push(`▸ ${source.toUpperCase()}`);
      lines.push("");
      verses.forEach(v => {
        lines.push(`  • ${v.reference}`);
        if (v.context) {
          lines.push(`    └─ ${v.context}`);
        }
      });
      lines.push("");
    });

    lines.push("───────────────────────────────────────");
    lines.push("");
    lines.push("QUICK REFERENCE LIST:");
    lines.push(extractedVerses.map(v => v.reference).join(", "));

    return lines.join("\n");
  };

  const handleCopy = () => {
    const outline = generateOutline();
    navigator.clipboard.writeText(outline);
    toast.success("Verses copied to clipboard!");
  };

  const handleExport = () => {
    const outline = generateOutline();
    const blob = new Blob([outline], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verse-extraction-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Verses exported!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-amber-500/10 border-amber-500/30 text-amber-400">
          <FileText className="h-4 w-4" />
          <span>Extract Verses {extractedVerses.length > 0 && `(${extractedVerses.length})`}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Verse Extraction
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button onClick={handleCopy} variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            Copy All
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <ScrollArea className="h-[50vh] pr-4">
          {extractedVerses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-4 opacity-30" />
              <p className="font-medium">No verses detected yet</p>
              <p className="text-sm mt-1">
                Scripture references will appear here as they're mentioned in your analysis
              </p>
            </div>
          ) : (
          <div className="space-y-4">
            {/* Group by source */}
            {Object.entries(
              extractedVerses.reduce((acc, verse) => {
                if (!acc[verse.source]) acc[verse.source] = [];
                acc[verse.source].push(verse);
                return acc;
              }, {} as Record<string, ExtractedVerse[]>)
            ).map(([source, verses]) => (
              <Card key={source} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {source}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {verses.map((verse, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-semibold text-primary">
                          {verse.reference}
                        </span>
                        {verse.context && (
                          <p className="text-muted-foreground text-xs mt-0.5 pl-4 border-l-2 border-muted">
                            {verse.context}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Quick reference */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Quick Reference List
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {extractedVerses.map(v => v.reference).join(", ")}
                </p>
              </CardContent>
            </Card>
          </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
