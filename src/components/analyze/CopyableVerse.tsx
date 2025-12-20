import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyableVerseProps {
  reference: string;
  className?: string;
}

export const CopyableVerse = ({ reference, className = "" }: CopyableVerseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      toast.success(`Copied: ${reference}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span>{reference}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 p-0 hover:bg-primary/20 shrink-0"
        onClick={handleCopy}
        title={`Copy "${reference}"`}
      >
        {copied ? (
          <Check className="h-3 w-3 text-green-400" />
        ) : (
          <Copy className="h-3 w-3 text-muted-foreground hover:text-primary" />
        )}
      </Button>
    </span>
  );
};
