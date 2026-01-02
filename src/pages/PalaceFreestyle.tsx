import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Brain, 
  Zap, 
  Target,
  AlertTriangle,
  Gem,
  Home,
  MessageCircle,
  Lightbulb,
  Flame,
  RefreshCw
} from "lucide-react";
import { useFreestyleMentor, type ExitCommand, type FreestyleMessage } from "@/hooks/useFreestyleMentor";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { VoiceInput } from "@/components/analyze/VoiceInput";

const TAG_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  EMERGING_PATTERN: { 
    label: "Emerging Pattern", 
    icon: Brain, 
    className: "bg-purple-500/20 text-purple-300 border-purple-500/30" 
  },
  CROSS_ROOM_ECHO: { 
    label: "Cross-Room Echo", 
    icon: RefreshCw, 
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30" 
  },
  GENTLE_TENSION: { 
    label: "Gentle Tension", 
    icon: Zap, 
    className: "bg-amber-500/20 text-amber-300 border-amber-500/30" 
  },
  UNRESOLVED_THREAD: { 
    label: "Unresolved Thread", 
    icon: Lightbulb, 
    className: "bg-orange-500/20 text-orange-300 border-orange-500/30" 
  },
  STRONG_ALIGNMENT: { 
    label: "Strong Alignment", 
    icon: Flame, 
    className: "bg-green-500/20 text-green-300 border-green-500/30" 
  },
};

const EXIT_COMMANDS: { id: ExitCommand; label: string; icon: React.ElementType }[] = [
  { id: "stabilize", label: "Stabilize This", icon: Target },
  { id: "gem", label: "Make a Gem", icon: Gem },
  { id: "which_room", label: "Which Room?", icon: Home },
  { id: "is_dangerous", label: "Is This Safe?", icon: AlertTriangle },
  { id: "where_break", label: "Where Could This Break?", icon: Zap },
];

const STARTER_PROMPTS = [
  "I'm noticing that exile always precedes clarity. Daniel, Joseph, even Jesus...",
  "What if the sanctuary isn't just a building but a map of my spiritual journey?",
  "I keep seeing patterns between Noah's ark and baptism. Is there something there?",
  "Why does God seem to use 40 so often? Days, years, wilderness...",
  "I'm wondering if the serpent in Eden connects to the bronze serpent in Numbers...",
];

export default function PalaceFreestyle() {
  const { messages, isLoading, sendMessage, clearMessages } = useFreestyleMentor();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (exitCommand?: ExitCommand) => {
    if (!input.trim() && !exitCommand) return;
    
    const messageToSend = input.trim() || (exitCommand ? EXIT_COMMANDS.find(c => c.id === exitCommand)?.label || "" : "");
    setInput("");
    await sendMessage(messageToSend, exitCommand);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = (text: string) => {
    setInput(prev => prev + (prev ? " " : "") + text);
    textareaRef.current?.focus();
  };

  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-500/20">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
            8th Floor: Palace Freestyle
          </h1>
          <p className="text-muted-foreground italic text-lg">
            "Come, let us reason together." — Isaiah 1:18
          </p>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto">
            Think out loud with Scripture. Build before you conclude. Jeeves will walk with you as a thinking partner—not a grader.
          </p>
        </motion.div>

        {/* Chat Area */}
        <Card className="border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm min-h-[400px] flex flex-col">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="text-center py-12 space-y-6">
                <div className="flex items-center justify-center gap-2 text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">Freestyle Study</span>
                </div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Share what you're noticing in Scripture. Ask wild questions. Build slowly. 
                  Jeeves will walk with you—excited by truth, careful with conclusions.
                </p>
                
                {/* Starter Prompts */}
                <div className="space-y-3 max-w-lg mx-auto">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Try starting with...</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {STARTER_PROMPTS.map((prompt, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs border-indigo-500/30 hover:bg-indigo-500/10 text-left h-auto py-2 whitespace-normal"
                        onClick={() => handleStarterPrompt(prompt)}
                      >
                        {prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message, idx) => (
                    <MessageBubble key={idx} message={message} />
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-indigo-400"
                  >
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm">Jeeves is thinking with you...</span>
                  </motion.div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Exit Commands Bar */}
          {messages.length > 0 && (
            <div className="px-4 py-2 border-t border-indigo-500/20">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">Exit to precision:</span>
                {EXIT_COMMANDS.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <Button
                      key={cmd.id}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                      onClick={() => handleSend(cmd.id)}
                      disabled={isLoading}
                    >
                      <Icon className="h-3 w-3" />
                      {cmd.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-indigo-500/20">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Think out loud... What patterns are you seeing?"
                  className="min-h-[80px] resize-none bg-slate-800/50 border-indigo-500/30 focus:border-indigo-400 pr-12"
                  disabled={isLoading}
                />
                <div className="absolute right-2 bottom-2">
                  <VoiceInput onTranscript={handleVoiceInput} variant="icon" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 h-12"
                >
                  <Send className="h-4 w-4" />
                </Button>
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearMessages}
                    className="text-muted-foreground hover:text-destructive"
                    title="Clear conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Floor Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Card className="inline-flex items-center gap-4 px-6 py-3 bg-slate-900/50 border-indigo-500/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4 text-indigo-400" />
              <span>Relational Study Environment</span>
            </div>
            <div className="w-px h-4 bg-indigo-500/30" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4 text-purple-400" />
              <span>Pattern Discovery Mode</span>
            </div>
            <div className="w-px h-4 bg-indigo-500/30" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>All Rooms Available</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: FreestyleMessage }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-slate-800 border border-indigo-500/20 rounded-bl-md"
        )}
      >
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "prose-invert"
        )}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        
        {/* Tags */}
        {message.tags && message.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-indigo-500/20">
            {message.tags.map((tag) => {
              const config = TAG_CONFIG[tag];
              if (!config) return null;
              const Icon = config.icon;
              return (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn("text-xs gap-1", config.className)}
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
