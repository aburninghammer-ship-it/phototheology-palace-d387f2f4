import { useState, useEffect, useCallback, useRef } from "react";
import { SermonRichTextArea } from "./SermonRichTextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Loader2, Sparkles, X, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");

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
            Use this space to write out your full sermon. Relevant verses will appear as you type.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPanel(!showPanel)}
          className="text-muted-foreground"
        >
          {showPanel ? "Hide Suggestions" : "Show Suggestions"}
        </Button>
      </div>

      <div className={`grid gap-4 ${showPanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
        {/* Main writing area */}
        <div className={showPanel ? 'lg:col-span-2' : ''}>
          <SermonRichTextArea
            content={sermon.full_sermon}
            onChange={handleContentChange}
            placeholder="Begin writing your sermon here. Start with your opening hook, weave through your smooth stones, build bridges between ideas, lead to your climax, and close with a powerful call to action..."
            minHeight="400px"
            showTools={true}
            themePassage={themePassage}
          />
          
          {/* Word count */}
          <div className="mt-2 text-xs text-muted-foreground text-right">
            {sermon.full_sermon.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Verse suggestions panel */}
        {showPanel && (
          <div className="lg:col-span-1">
            <Card className="h-full border-purple-200 dark:border-purple-800/50">
              <CardHeader className="py-3 px-4 bg-purple-50 dark:bg-purple-900/20 border-b">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Suggested Verses
                  {loadingVerses && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[350px]">
                  {suggestedVerses.length > 0 ? (
                    <div className="space-y-2">
                      {suggestedVerses.map((verse, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg border hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer group"
                          onClick={() => insertVerse(verse)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm text-purple-700 dark:text-purple-400">
                                  {verse.reference}
                                </p>
                                {verse.type && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    verse.type === 'descriptive' 
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                      : verse.type === 'connection'
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                  }`}>
                                    {verse.type === 'descriptive' ? '📖 Describes' : 
                                     verse.type === 'connection' ? '🔗 Connects' : '✨ Amplifies'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-foreground/80 mt-1 line-clamp-2">
                                "{verse.text}"
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 italic">
                                {verse.reason}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                      <BookOpen className="w-8 h-8 mb-2 opacity-30" />
                      <p className="text-sm">
                        {loadingVerses 
                          ? "Finding relevant verses..." 
                          : "As you write, relevant scripture references will appear here."}
                      </p>
                      <p className="text-xs mt-1">Click a verse to add it to your sermon</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
