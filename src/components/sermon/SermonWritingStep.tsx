import { useState, useEffect, useCallback, useRef } from "react";
import { SermonRichTextArea } from "./SermonRichTextArea";
import { SermonSidePanel } from "./SermonSidePanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, PanelRightClose, PanelRight, Save, Check, Loader2, MessageSquare, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const AUTOSAVE_KEY = "sermon_autosave_content";

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

  // Parentheses-based scripture lookup state
  const [processingRequest, setProcessingRequest] = useState(false);
  const [clarificationDialog, setClarificationDialog] = useState<{
    open: boolean;
    question: string;
    originalRequest: string;
    matchedText: string;
  }>({ open: false, question: "", originalRequest: "", matchedText: "" });
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const processedRequestsRef = useRef<Set<string>>(new Set());

  // Load autosaved content from localStorage on mount (protects against browser crashes)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (savedData) {
        const { content, timestamp, title } = JSON.parse(savedData);
        const hoursSaved = (Date.now() - timestamp) / (1000 * 60 * 60);
        const currentContent = sermon.full_sermon || '';
        // Restore if: content exists, within 24 hours, and current content is empty or shorter
        if (content && hoursSaved < 24 && (!currentContent || currentContent.length < content.length)) {
          setSermon({ ...sermon, full_sermon: content });
          toast.success("Restored your autosaved sermon draft");
        }
      }
    } catch (error) {
      console.error("Error loading autosaved content:", error);
    }
  }, []); // Only run once on mount

  // Auto-save every 15 seconds if content has changed (also saves to localStorage)
  useEffect(() => {
    const currentContent = sermon.full_sermon || '';
    autoSaveRef.current = setInterval(() => {
      if (currentContent !== lastSavedContentRef.current) {
        setIsSaving(true);
        lastSavedContentRef.current = currentContent;
        setLastSaved(new Date());
        // Save to localStorage for crash recovery
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
            content: currentContent,
            timestamp: Date.now(),
            title: sermon.title || "untitled",
          }));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 15000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [sermon.full_sermon, sermon.title]);

  // Process parentheses-based scripture requests
  const processScriptureRequest = useCallback(async (request: string, matchedText: string, additionalContext?: string) => {
    setProcessingRequest(true);
    try {
      // Use sermon-assistant mode with a specific prompt to find scripture
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon-assistant",
          sermon_title: sermon.title,
          themePassage: themePassage,
          sermon_content: (sermon.full_sermon || '').replace(/<[^>]*>/g, '').slice(-300),
          smooth_stones: sermon.smooth_stones,
          chatMessages: [{
            role: "user",
            content: `Find and provide the exact scripture passage for this request: "${request}"${additionalContext ? ` (Additional context: ${additionalContext})` : ''}

IMPORTANT: Respond in this exact JSON format only:
{
  "reference": "Book Chapter:Verse(s)",
  "scripture": "The full text of the scripture passage"
}

If the request is ambiguous, respond with:
{
  "needs_clarification": true,
  "clarification_question": "Your question"
}

Return ONLY the JSON, no other text.`
          }]
        },
      });

      if (error) throw error;

      // Parse the response - it might be in data.content or data directly
      let responseText = data?.content || data?.response || (typeof data === 'string' ? data : JSON.stringify(data));

      // Try to extract JSON from the response
      let parsed: any = null;
      try {
        // Clean markdown code blocks if present
        let cleanResponse = responseText.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.slice(7);
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.slice(0, -3);
        }
        parsed = JSON.parse(cleanResponse.trim());
      } catch {
        // If not JSON, try to extract scripture reference from text
        console.log("Response wasn't JSON, attempting to parse:", responseText);
      }

      if (parsed?.needs_clarification) {
        setClarificationDialog({
          open: true,
          question: parsed.clarification_question || "Could you be more specific about what you're looking for?",
          originalRequest: request,
          matchedText: matchedText,
        });
        setClarificationAnswer("");
        return;
      }

      if (parsed?.scripture && parsed?.reference) {
        const scriptureHtml = `<blockquote><strong>${parsed.reference}</strong>: "${parsed.scripture}"</blockquote>`;
        const newContent = (sermon.full_sermon || '').replace(matchedText, scriptureHtml);
        setSermon({ ...sermon, full_sermon: newContent });
        toast.success(`Scripture added: ${parsed.reference}`);
        processedRequestsRef.current.add(matchedText);
        return;
      }

      // Fallback: if we got any text response, show it
      if (responseText && responseText.length > 10) {
        toast.info("Jeeves found some context but couldn't format it as scripture. Check the assistant panel.");
        return;
      }

      throw new Error("Could not find the requested scripture");
    } catch (error: any) {
      console.error("Error processing scripture request:", error);
      // Show more helpful error message
      const errorMsg = error?.message || "Unknown error";
      if (errorMsg.includes("not found") || errorMsg.includes("mode")) {
        toast.error("Scripture lookup feature is being deployed. Please try again in a few minutes.");
      } else {
        toast.error(`Failed to fetch scripture: ${errorMsg}`);
      }
    } finally {
      setProcessingRequest(false);
    }
  }, [sermon, setSermon, themePassage]);

  // Handle clarification submission
  const handleClarificationSubmit = async () => {
    if (!clarificationAnswer.trim()) return;

    setClarificationDialog({ ...clarificationDialog, open: false });
    await processScriptureRequest(
      clarificationDialog.originalRequest,
      clarificationDialog.matchedText,
      clarificationAnswer
    );
    setClarificationAnswer("");
  };

  // Check for parentheses requests in content
  const checkForScriptureRequests = useCallback((content: string) => {
    // Match text in parentheses that looks like a request (contains keywords or is > 10 chars)
    const regex = /\(([^)]{10,})\)/g;
    const plainContent = content.replace(/<[^>]*>/g, '');
    let match;

    while ((match = regex.exec(plainContent)) !== null) {
      const fullMatch = match[0];
      const innerText = match[1].trim();

      // Skip if already processed
      if (processedRequestsRef.current.has(fullMatch)) continue;

      // Check if it looks like a scripture request (contains trigger words)
      const triggerWords = [
        'need', 'find', 'get', 'show', 'pull', 'insert', 'add',
        'text', 'verse', 'passage', 'scripture', 'bible',
        'where', 'when', 'about', 'story', 'chapter'
      ];

      const lowerText = innerText.toLowerCase();
      const isRequest = triggerWords.some(word => lowerText.includes(word));

      if (isRequest) {
        // Process this request
        processScriptureRequest(innerText, fullMatch);
        break; // Process one at a time
      }
    }
  }, [processScriptureRequest]);

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
      // Also check for parentheses-based scripture requests
      if (!processingRequest) {
        checkForScriptureRequests(content);
      }
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
    <div className="h-[calc(100vh-280px)] min-h-[500px]">
      {/* Clarification Dialog */}
      <Dialog open={clarificationDialog.open} onOpenChange={(open) => setClarificationDialog({ ...clarificationDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Jeeves Needs Clarification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Your request: <em>"{clarificationDialog.originalRequest}"</em>
            </p>
            <p className="text-sm font-medium">{clarificationDialog.question}</p>
            <Input
              placeholder="Type your answer..."
              value={clarificationAnswer}
              onChange={(e) => setClarificationAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleClarificationSubmit()}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setClarificationDialog({ ...clarificationDialog, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleClarificationSubmit} disabled={!clarificationAnswer.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header bar with save indicator */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-purple-600" />
          <div>
            <h3 className="font-semibold text-sm">Write Your Sermon</h3>
            <div className="flex items-center gap-2">
              {processingRequest ? (
                <Badge variant="outline" className="gap-1 text-xs text-purple-600 border-purple-200">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Fetching scripture...
                </Badge>
              ) : isSaving ? (
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
              <span className="text-xs text-muted-foreground">
                {(sermon.full_sermon || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>
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

      {/* Main 50/50 split layout */}
      <div className={`grid gap-4 h-[calc(100%-60px)] ${showPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Left: Writing area - full half */}
        <div className="h-full flex flex-col min-h-0">
          <SermonRichTextArea
            content={sermon.full_sermon}
            onChange={handleContentChange}
            placeholder="Begin writing your sermon here. Start with your opening hook, weave through your smooth stones, build bridges between ideas, lead to your climax, and close with a powerful call to action..."
            minHeight="100%"
            showTools={true}
            themePassage={themePassage}
          />
        </div>

        {/* Right: Assistant Panel with Sparks/Verses/Jeeves + Your 5 Stones - full half */}
        {showPanel && (
          <div className="h-full overflow-hidden min-h-0">
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
