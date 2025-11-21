import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VerseLink {
  reference: string;
  principle: string;
  explanation: string;
}

interface VerseLinksPanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export const VerseLinksPanel = ({ book, chapter, verse, verseText }: VerseLinksPanelProps) => {
  const [links, setLinks] = useState<VerseLink[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    generateLinks();
  }, [book, chapter, verse, verseText]);

  const generateLinks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-verse-links', {
        body: { book, chapter, verse, verseText }
      });

      if (error) {
        if (error.message?.includes("429") || error.message?.includes("rate limit")) {
          toast.error("Rate limit exceeded. Please try again in a moment.");
        } else if (error.message?.includes("402") || error.message?.includes("payment")) {
          toast.error("AI credits exhausted. Please add credits to your workspace.");
        } else {
          toast.error("Failed to generate links. Please try again.");
        }
        console.error("Error generating links:", error);
        return;
      }

      if (data?.links) {
        setLinks(data.links);
      }
    } catch (err) {
      console.error("Error generating verse links:", err);
      toast.error("Failed to load verse connections");
    } finally {
      setLoading(false);
    }
  };

  const parseReference = (reference: string) => {
    // Parse "Book Chapter:Verse" format
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      return {
        book: match[1],
        chapter: parseInt(match[2]),
        verse: parseInt(match[3])
      };
    }
    return null;
  };

  const handleLinkClick = (reference: string) => {
    const parsed = parseReference(reference);
    if (parsed) {
      navigate(`/bible/${parsed.book}/${parsed.chapter}?verse=${parsed.verse}`);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Palace Principle Links</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Finding connections...</span>
        </div>
      </Card>
    );
  }

  if (links.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Palace Principle Links</h3>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={generateLinks}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Links
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          Click "Generate Links" to discover verses connected through palace principles.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Palace Principle Links</h3>
          <Badge variant="secondary" className="text-xs">
            {links.length} {links.length === 1 ? "connection" : "connections"}
          </Badge>
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={generateLinks}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          New Links
        </Button>
      </div>

      <div className="space-y-4">
        {links.map((link, index) => (
          <div 
            key={index}
            className="border-l-2 border-primary/30 pl-4 py-2 hover:border-primary/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div 
                className="font-semibold text-primary hover:underline cursor-pointer flex items-center gap-2"
                onClick={() => handleLinkClick(link.reference)}
              >
                {link.reference}
                <ExternalLink className="h-3 w-3" />
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {link.principle}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {link.explanation}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          Links generated using rotating palace principles from Phototheology.
          Click "New Links" to see connections through different principles.
        </p>
      </div>
    </Card>
  );
};
