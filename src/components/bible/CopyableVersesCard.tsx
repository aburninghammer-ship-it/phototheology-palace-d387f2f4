import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface Verse {
  verse: number;
  text: string;
}

interface CopyableVersesCardProps {
  book: string;
  chapter: number;
  selectedVerses: number[];
  verses: Verse[];
  onClear: () => void;
  children?: React.ReactNode;
}

export const CopyableVersesCard = ({
  book,
  chapter,
  selectedVerses,
  verses,
  onClear,
  children,
}: CopyableVersesCardProps) => {
  const [copied, setCopied] = useState(false);

  const formatVerseRange = () => {
    if (selectedVerses.length === 0) return "";
    
    const sorted = [...selectedVerses].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    // Check if consecutive
    const isConsecutive = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
    
    if (isConsecutive && sorted.length > 1) {
      return `${book} ${chapter}:${min}-${max}`;
    } else if (sorted.length === 1) {
      return `${book} ${chapter}:${min}`;
    } else {
      return `${book} ${chapter}:${sorted.join(",")}`;
    }
  };

  const handleCopyRange = async () => {
    const sorted = [...selectedVerses].sort((a, b) => a - b);
    const reference = formatVerseRange();
    
    const verseTexts = sorted.map(v => {
      const verse = verses.find(verse => verse.verse === v);
      return verse ? `${v}. ${verse.text}` : "";
    }).filter(Boolean).join("\n");
    
    const fullText = `${reference}\n\n${verseTexts}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success(`Copied ${selectedVerses.length} verse${selectedVerses.length > 1 ? 's' : ''}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy verses");
    }
  };

  return (
    <Card variant="glass" className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Selected Verses ({selectedVerses.length})</h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyRange}
            className="gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy {selectedVerses.length > 1 ? "Range" : "Verse"}
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground font-medium">
        {formatVerseRange()}
      </div>
      <div className="space-y-2 max-h-[400px] overflow-auto">
        {[...selectedVerses].sort((a, b) => a - b).map(v => (
          <div key={v} className="p-3 rounded-lg border bg-card/50 text-sm">
            <span className="font-semibold text-primary">{v}.</span>{" "}
            {verses.find(verse => verse.verse === v)?.text}
          </div>
        ))}
      </div>
      {children}
    </Card>
  );
};
