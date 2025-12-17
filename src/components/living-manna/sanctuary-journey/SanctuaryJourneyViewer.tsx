import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  ArrowLeft, Send, Loader2, BookOpen, 
  ChevronRight, ChevronLeft, MessageCircle,
  HandHeart, HelpCircle, Heart
} from "lucide-react";

interface SanctuaryJourneyViewerProps {
  progressId: string;
  seriesId: string;
  onBack: () => void;
}

interface Session {
  id: string;
  session_number: number;
  title: string;
  sanctuary_frame: string;
  primary_scriptures: string[];
  core_truth: string;
  guided_insight: string;
  reflection_question: string;
  prayer_prompt: string;
  is_checkpoint: boolean;
  phase: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SanctuaryJourneyViewer({ progressId, seriesId, onBack }: SanctuaryJourneyViewerProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessionData();
  }, [seriesId, progressId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadSessionData = async () => {
    setLoading(true);
    try {
      // Load sessions
      const { data: sessionData } = await supabase
        .from("sanctuary_journey_sessions")
        .select("*")
        .eq("series_id", seriesId)
        .order("session_number");

      setSessions(sessionData || []);

      // Load progress
      const { data: progressData } = await supabase
        .from("sanctuary_journey_progress")
        .select("*")
        .eq("id", progressId)
        .single();

      setProgress(progressData);
      
      // Set current session index based on progress
      const sessionIndex = (sessionData || []).findIndex(
        s => s.session_number === progressData?.current_session
      );
      setCurrentSessionIndex(sessionIndex >= 0 ? sessionIndex : 0);

      // Load existing conversation for this session
      const currentSession = sessionData?.[sessionIndex >= 0 ? sessionIndex : 0];
      if (currentSession) {
        const { data: completion } = await supabase
          .from("sanctuary_journey_session_completions")
          .select("ai_conversation_history")
          .eq("progress_id", progressId)
          .eq("session_id", currentSession.id)
          .single();

        if (completion?.ai_conversation_history && Array.isArray(completion.ai_conversation_history)) {
          setMessages(completion.ai_conversation_history as unknown as Message[]);
        } else {
          // Start with initial AI message
          setMessages([{
            role: "assistant",
            content: getInitialMessage(currentSession)
          }]);
        }
      }
    } catch (error) {
      console.error("Error loading session data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitialMessage = (session: Session): string => {
    return `Welcome to Session ${session.session_number}: **${session.title}**\n\n` +
      `*Sanctuary Frame: ${session.sanctuary_frame}*\n\n` +
      `Let's begin by reading: **${session.primary_scriptures.join(", ")}**\n\n` +
      `${session.guided_insight}\n\n` +
      `**Core Truth:** ${session.core_truth}\n\n` +
      `Take a moment to reflect: *${session.reflection_question}*\n\n` +
      `Feel free to share your thoughts, ask questions, or simply continue when you're ready.`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const currentSession = sessions[currentSessionIndex];
    if (!currentSession) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await supabase.functions.invoke("sanctuary-journey-guide", {
        body: {
          sessionContext: {
            sessionNumber: currentSession.session_number,
            title: currentSession.title,
            sanctuaryFrame: currentSession.sanctuary_frame,
            scriptures: currentSession.primary_scriptures,
            coreTruth: currentSession.core_truth,
            guidedInsight: currentSession.guided_insight,
            reflectionQuestion: currentSession.reflection_question,
            prayerPrompt: currentSession.prayer_prompt,
            phase: currentSession.phase
          },
          conversationHistory: newMessages,
          userMessage
        }
      });

      if (response.error) throw response.error;

      const aiResponse = response.data.response;
      const escalation = response.data.escalation;

      const updatedMessages: Message[] = [...newMessages, { role: "assistant", content: aiResponse }];
      setMessages(updatedMessages);

      // Save conversation history
      await saveConversation(currentSession.id, updatedMessages);

      // Handle escalation if detected
      if (escalation) {
        await createEscalation(currentSession.id, escalation, userMessage, aiResponse);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const saveConversation = async (sessionId: string, conversationHistory: Message[]) => {
    // Check if completion exists
    const { data: existing } = await supabase
      .from("sanctuary_journey_session_completions")
      .select("id")
      .eq("progress_id", progressId)
      .eq("session_id", sessionId)
      .single();

    if (existing) {
      await supabase
        .from("sanctuary_journey_session_completions")
        .update({ ai_conversation_history: conversationHistory as unknown as any })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("sanctuary_journey_session_completions")
        .insert({
          progress_id: progressId,
          session_id: sessionId,
          ai_conversation_history: conversationHistory as unknown as any
        });
    }
  };

  const createEscalation = async (sessionId: string, type: string, userMessage: string, aiReason: string) => {
    await supabase
      .from("sanctuary_journey_escalations")
      .insert({
        progress_id: progressId,
        session_id: sessionId,
        escalation_type: type,
        user_message: userMessage,
        ai_detected_reason: aiReason,
        status: "pending"
      });

    const typeLabels: Record<string, string> = {
      baptism_interest: "Your interest in baptism has been noted",
      doctrinal_question: "A Bible worker will follow up on your question",
      emotional_distress: "Someone will reach out to support you",
      lifestyle_conflict: "A leader will be in touch to help",
      prayer_request: "Your prayer request has been shared",
      group_connection: "We'll help connect you with a group"
    };

    toast.success(typeLabels[type] || "A leader will follow up with you");
  };

  const completeSession = async () => {
    const currentSession = sessions[currentSessionIndex];
    if (!currentSession) return;

    try {
      // Mark session as completed - check if exists first
      const { data: existing } = await supabase
        .from("sanctuary_journey_session_completions")
        .select("id")
        .eq("progress_id", progressId)
        .eq("session_id", currentSession.id)
        .single();

      if (existing) {
        await supabase
          .from("sanctuary_journey_session_completions")
          .update({ 
            ai_conversation_history: messages as unknown as any,
            completed_at: new Date().toISOString()
          })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("sanctuary_journey_session_completions")
          .insert({
            progress_id: progressId,
            session_id: currentSession.id,
            ai_conversation_history: messages as unknown as any,
            completed_at: new Date().toISOString()
          });
      }

      // Update progress
      const nextSession = currentSessionIndex + 1;
      const isComplete = nextSession >= sessions.length;

      await supabase
        .from("sanctuary_journey_progress")
        .update({
          current_session: isComplete ? sessions.length : sessions[nextSession].session_number,
          status: isComplete ? "completed" : "active",
          completed_at: isComplete ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", progressId);

      if (isComplete) {
        toast.success("Congratulations! You've completed The Sanctuary Journey! 🎉");
        onBack();
      } else {
        toast.success(`Session ${currentSession.session_number} completed!`);
        setCurrentSessionIndex(nextSession);
        setMessages([{
          role: "assistant",
          content: getInitialMessage(sessions[nextSession])
        }]);
      }
    } catch (error) {
      console.error("Error completing session:", error);
      toast.error("Failed to save progress");
    }
  };

  const currentSession = sessions[currentSessionIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentSession) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>No sessions available</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  const phaseColors: Record<string, string> = {
    gospel_foundation: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    daily_walk: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    most_holy_place: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    end_time_message: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <Badge className={phaseColors[currentSession.phase]}>
          {currentSession.phase.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>Session {currentSession.session_number} of {sessions.length}</span>
          <span>{Math.round((currentSessionIndex / sessions.length) * 100)}% Complete</span>
        </div>
        <Progress value={(currentSessionIndex / sessions.length) * 100} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Session Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>{currentSession.title}</CardTitle>
            </div>
            <CardDescription>{currentSession.sanctuary_frame}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chat Area */}
            <ScrollArea className="h-[400px] pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Share your thoughts, ask questions, or reflect..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-[60px]"
              />
              <Button onClick={sendMessage} disabled={sending || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Scripture Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Scripture Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {currentSession.primary_scriptures.map((scripture, idx) => (
                  <Badge key={idx} variant="outline" className="mr-1">
                    {scripture}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Core Truth */}
          <Card className="bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Core Truth</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{currentSession.core_truth}</p>
            </CardContent>
          </Card>

          {/* Prayer Prompt */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <HandHeart className="h-4 w-4" />
                Prayer Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic">"{currentSession.prayer_prompt}"</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setInputMessage("I have a question about this session...");
              }}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Ask a Question
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                setInputMessage("I would like to request prayer for...");
              }}
            >
              <Heart className="h-4 w-4 mr-2" />
              Request Prayer
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={currentSessionIndex === 0}
              onClick={() => {
                setCurrentSessionIndex(prev => prev - 1);
                setMessages([{
                  role: "assistant",
                  content: getInitialMessage(sessions[currentSessionIndex - 1])
                }]);
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              className="flex-1"
              onClick={completeSession}
            >
              {currentSessionIndex === sessions.length - 1 ? "Complete" : "Next"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
