import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Sparkles, MessageCircle, BookOpen, Loader2, Trash2, Gem } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SparkContainer } from "@/components/sparks/SparkContainer";
import { useSparks } from "@/hooks/useSparks";
import { SaveJeevesResponseButton } from "@/components/jeeves/SaveJeevesResponseButton";

interface SuggestedVerse {
  reference: string;
  text: string;
  reason: string;
  type?: 'descriptive' | 'connection' | 'amplifying';
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface SermonSidePanelProps {
  suggestedVerses: SuggestedVerse[];
  loadingVerses: boolean;
  onInsertVerse: (verse: SuggestedVerse) => void;
  smoothStones: string[];
  sermonTitle: string;
  themePassage: string;
  sermonContent: string;
}

export function SermonSidePanel({
  suggestedVerses,
  loadingVerses,
  onInsertVerse,
  smoothStones,
  sermonTitle,
  themePassage,
  sermonContent
}: SermonSidePanelProps) {
  const [activeTab, setActiveTab] = useState("verses");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize sparks for sermon context
  const {
    sparks: activeSparks,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: sermonTitle || 'sermon-writing'
  });

  // Generate sparks based on sermon content changes
  useEffect(() => {
    if (!sermonContent || typeof sermonContent !== 'string') return;
    const plainText = sermonContent.replace(/<[^>]*>/g, '').trim();
    if (plainText.length > 200) {
      const timer = setTimeout(() => {
        generateSpark(plainText, themePassage);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [sermonContent, generateSpark]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = profile?.display_name || null;

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon-assistant",
          messages: [...messages, userMessage],
          sermon_title: sermonTitle,
          theme_passage: themePassage,
          sermon_content: (sermonContent || '').replace(/<[^>]*>/g, '').slice(-1000),
          smooth_stones: smoothStones,
          userName,
        },
      });

      if (error) throw error;

      if (data?.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Jeeves sermon error:", error);
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col gap-3 min-h-0">
      {/* Top Section: Tabbed Panel - Takes most of the space */}
      <Card className="flex-1 min-h-0 border-purple-200 dark:border-purple-800/50 flex flex-col">
        <CardHeader className="py-2 px-3 bg-purple-50 dark:bg-purple-900/20 border-b shrink-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-8">
              <TabsTrigger value="sparks" className="text-xs gap-1">
                <Sparkles className="w-3 h-3" />
                Sparks
              </TabsTrigger>
              <TabsTrigger value="verses" className="text-xs gap-1">
                <BookOpen className="w-3 h-3" />
                Verses
              </TabsTrigger>
              <TabsTrigger value="jeeves" className="text-xs gap-1">
                <MessageCircle className="w-3 h-3" />
                Jeeves
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-2 flex-1 min-h-0 overflow-hidden">
          {activeTab === "sparks" && (
            <ScrollArea className="h-full">
              {activeSparks.length > 0 ? (
                <div className="space-y-2">
                  <SparkContainer
                    sparks={activeSparks}
                    onOpen={openSpark}
                    onSave={saveSpark}
                    onDismiss={dismissSpark}
                    onExplore={exploreSpark}
                    position="inline"
                    className="flex-wrap"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Click on a spark to explore connections and insights for your sermon.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground">
                  <Sparkles className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">
                    Keep writing! Jeeves will spark ideas as your sermon develops.
                  </p>
                </div>
              )}
            </ScrollArea>
          )}

          {activeTab === "verses" && (
            <ScrollArea className="h-full">
              {suggestedVerses.length > 0 ? (
                <div className="space-y-2">
                  {suggestedVerses.map((verse, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg border hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer group"
                      onClick={() => onInsertVerse(verse)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-xs text-purple-700 dark:text-purple-400">
                              {verse.reference}
                            </p>
                            {verse.type && (
                              <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${
                                verse.type === 'descriptive' 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                                  : verse.type === 'connection'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              }`}>
                                {verse.type === 'descriptive' ? '📖' : verse.type === 'connection' ? '🔗' : '✨'}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-foreground/80 mt-0.5 line-clamp-2">
                            "{verse.text}"
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 italic line-clamp-1">
                            {verse.reason}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-6 text-xs px-2"
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
                      : "Verses will appear as you write."}
                  </p>
                  {loadingVerses && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
                </div>
              )}
            </ScrollArea>
          )}

          {activeTab === "jeeves" && (
            <div className="h-full flex flex-col min-h-0">
              <ScrollArea className="flex-1 pr-2 mb-2">
                <div className="space-y-2">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                      <p className="text-xs font-medium">Ask Jeeves about your sermon</p>
                      <p className="text-[10px] mt-1">Connections, illustrations, structure...</p>
                    </div>
                  )}
                  
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-2 py-1.5 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-[11px] whitespace-pre-wrap">{msg.content}</p>
                        {msg.role === "assistant" && idx > 0 && (
                          <div className="mt-1 pt-1 border-t border-border/50">
                            <SaveJeevesResponseButton
                              question={messages[idx - 1]?.content || "Sermon question"}
                              response={msg.content}
                              context={`Sermon: ${sermonTitle}`}
                              variant="small"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-2 py-1.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span>Thinking...</span>
                          <Sparkles className="h-3 w-3 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-1.5 shrink-0">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about your sermon..."
                  className="min-h-[36px] max-h-[60px] text-xs resize-none"
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-1">
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    size="icon"
                    className="h-7 w-7"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  {messages.length > 0 && (
                    <Button
                      onClick={() => setMessages([])}
                      disabled={isLoading}
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Section: 5 Stones - Fixed height */}
      <Card className="shrink-0 border-amber-200 dark:border-amber-800/50 max-h-[180px]">
        <CardHeader className="py-2 px-3 bg-amber-50 dark:bg-amber-900/20 border-b">
          <CardTitle className="text-xs flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-amber-600" />
            Your 5 Stones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-[120px]">
            {smoothStones.length > 0 ? (
              <div className="space-y-1.5">
                {smoothStones.map((stone, idx) => {
                  // Strip HTML tags to get clean text
                  const cleanText = stone
                    .replace(/<ol>|<\/ol>|<ul>|<\/ul>|<li>|<\/li>|<p>|<\/p>|<br\s*\/?>/gi, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                  
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-1.5 rounded bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-[11px] text-foreground/90 line-clamp-2">{cleanText}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Gem className="w-6 h-6 mb-1 opacity-30" />
                <p className="text-[10px]">No stones yet. Complete Step 2 to add them.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
