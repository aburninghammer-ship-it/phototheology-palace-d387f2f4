import { useState, useEffect, useCallback, useRef } from "react";
import { SermonRichTextArea } from "./SermonRichTextArea";
import { SermonSidePanel } from "./SermonSidePanel";
import { Button } from "@/components/ui/button";
import { FileText, PanelRightClose, PanelRight, Save, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SuggestedVerse {
  reference: string;
  text: string;
  reason: string;
  type?: 'descriptive' | 'connection' | 'amplifying';
}

interface SermonWritingStepProps {
  sermon: {
    title: string;
    theme_passage: string;
    sermon_style: string;
    smooth_stones: string[];
    bridges: string[];
    movie_structure: any;
    full_sermon: string;
  };
  setSermon: (sermon: any) => void;
  themePassage: string;
}

export function SermonWritingStep({ sermon, setSermon, themePassage }: SermonWritingStepProps) {
  const [suggestedVerses, setSuggestedVerses] = useState<SuggestedVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>(sermon.full_sermon);

  // Auto-save every 15 seconds if content has changed
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      if (sermon.full_sermon !== lastSavedContentRef.current) {
        setIsSaving(true);
        lastSavedContentRef.current = sermon.full_sermon;
        setLastSaved(new Date());
        // The setSermon already updates parent state which persists
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 15000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [sermon.full_sermon]);

  // Debounced function to get verse suggestions based on sermon content
  const fetchVerseSuggestions = useCallback(async (content: string) => {
    if (!content || content.length < 100) {
      setSuggestedVerses([]);
      return;
    }

    // Only fetch if content has meaningfully changed
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (plainText === lastContentRef.current) return;
    lastContentRef.current = plainText;

    setLoadingVerses(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon-verse-suggestions",
          sermon_content: plainText.slice(-500), // Last 500 characters
          theme_passage: themePassage,
          stones: sermon.smooth_stones.join("\n"),
        },
      });

      if (error) throw error;
      
      // Parse the JSON response
      if (data?.verses && Array.isArray(data.verses)) {
        setSuggestedVerses(data.verses.slice(0, 5));
      } else if (data?.content) {
        // Try to parse content as JSON
        try {
          const parsed = JSON.parse(data.content);
          if (parsed.verses && Array.isArray(parsed.verses)) {
            setSuggestedVerses(parsed.verses.slice(0, 5));
          }
        } catch {
          // If not JSON, clear suggestions
          setSuggestedVerses([]);
        }
      }
    } catch (error) {
      console.error("Error fetching verse suggestions:", error);
    } finally {
      setLoadingVerses(false);
    }
  }, [themePassage, sermon.smooth_stones]);

  // Handle content change with debounce
  const handleContentChange = (content: string) => {
    setSermon({ ...sermon, full_sermon: content });
    
    // Debounce the verse suggestions
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchVerseSuggestions(content);
    }, 2000); // 2 second debounce
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Insert verse into sermon
  const insertVerse = (verse: SuggestedVerse) => {
    const verseHtml = `<blockquote><strong>${verse.reference}</strong>: "${verse.text}"</blockquote>\n`;
    setSermon({ ...sermon, full_sermon: sermon.full_sermon + verseHtml });
    toast.success(`${verse.reference} added to sermon`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Write Your Sermon
          </h3>
          <p className="text-sm text-muted-foreground">
            Use this space to write out your full sermon. Sparks, verses, and Jeeves will assist on the side.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isSaving ? (
              <Badge variant="outline" className="gap-1 text-xs">
                <Save className="w-3 h-3 animate-pulse" />
                Saving...
              </Badge>
            ) : lastSaved ? (
              <Badge variant="outline" className="gap-1 text-xs text-green-600 border-green-200">
                <Check className="w-3 h-3" />
                Saved {lastSaved.toLocaleTimeString()}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-xs">
                <Save className="w-3 h-3" />
                Auto-saves every 15s
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPanel(!showPanel)}
            className="gap-2"
          >
            {showPanel ? (
              <>
                <PanelRightClose className="w-4 h-4" />
                <span className="hidden sm:inline">Hide Assistant</span>
              </>
            ) : (
              <>
                <PanelRight className="w-4 h-4" />
                <span className="hidden sm:inline">Show Assistant</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${showPanel ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Main writing area */}
        <div className="min-h-[500px]">
          <SermonRichTextArea
            content={sermon.full_sermon}
            onChange={handleContentChange}
            placeholder="Begin writing your sermon here. Start with your opening hook, weave through your smooth stones, build bridges between ideas, lead to your climax, and close with a powerful call to action..."
            minHeight="480px"
            showTools={true}
            themePassage={themePassage}
          />
          
          {/* Word count */}
          <div className="mt-2 text-xs text-muted-foreground text-right">
            {sermon.full_sermon.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Side Panel: Sparks, Verses, Jeeves Chat + 5 Stones */}
        {showPanel && (
          <div className="lg:col-span-1 h-[500px]">
            <SermonSidePanel
              suggestedVerses={suggestedVerses}
              loadingVerses={loadingVerses}
              onInsertVerse={insertVerse}
              smoothStones={sermon.smooth_stones}
              sermonTitle={sermon.title}
              themePassage={themePassage}
              sermonContent={sermon.full_sermon}
            />
          </div>
        )}
      </div>
    </div>
  );
}
