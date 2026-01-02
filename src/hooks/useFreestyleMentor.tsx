import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FreestyleMessage {
  role: "user" | "assistant";
  content: string;
  tags?: string[];
  timestamp: Date;
}

export type ExitCommand = 
  | "stabilize" 
  | "gem" 
  | "which_room" 
  | "is_dangerous" 
  | "where_break";

export const useFreestyleMentor = () => {
  const [messages, setMessages] = useState<FreestyleMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (
    userMessage: string, 
    exitCommand?: ExitCommand
  ) => {
    const newUserMsg: FreestyleMessage = { 
      role: "user", 
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMsg]);
    setIsLoading(true);

    try {
      // Get user profile for personalization
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = user ? await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single() : { data: null };

      const userName = profile?.display_name || null;

      // Map exit command to text
      const exitCommandText = exitCommand ? {
        stabilize: "Stabilize this",
        gem: "Turn this into a Gem",
        which_room: "Which room owns this?",
        is_dangerous: "Is this dangerous?",
        where_break: "Where could this break?"
      }[exitCommand] : null;

      const { data, error } = await supabase.functions.invoke("freestyle-mentor", {
        body: {
          messages: [...messages, newUserMsg].map(m => ({
            role: m.role,
            content: m.content
          })),
          userName,
          exitCommand: exitCommandText,
        },
      });

      if (error) throw error;

      if (data?.response) {
        const assistantMsg: FreestyleMessage = {
          role: "assistant",
          content: data.response,
          tags: data.tags || [],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error("Freestyle mentor error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Let's try that again in a moment.",
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
