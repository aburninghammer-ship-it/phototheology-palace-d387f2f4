import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Reaction {
  id: string;
  emoji: string;
  guestId: string;
  timestamp: number;
}

interface ReactionCounts {
  [emoji: string]: number;
}

export function useGuestReactions(eventId: string, guestId: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [counts, setCounts] = useState<ReactionCounts>({});
  const [canReact, setCanReact] = useState(true);
  const lastReactionTime = useRef<number>(0);
  const cooldownMs = 2000; // 2 second cooldown

  useEffect(() => {
    const channel = supabase
      .channel(`reactions-${eventId}`)
      .on('broadcast', { event: 'reaction' }, (payload) => {
        const reaction: Reaction = {
          id: `${payload.payload.guestId}-${Date.now()}`,
          emoji: payload.payload.emoji,
          guestId: payload.payload.guestId,
          timestamp: Date.now()
        };
        
        setReactions(prev => [...prev.slice(-50), reaction]); // Keep last 50 reactions
        
        setCounts(prev => ({
          ...prev,
          [reaction.emoji]: (prev[reaction.emoji] || 0) + 1
        }));

        // Remove reaction after animation (3 seconds)
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== reaction.id));
        }, 3000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  const sendReaction = useCallback(async (emoji: string) => {
    const now = Date.now();
    if (now - lastReactionTime.current < cooldownMs) {
      return false; // Still in cooldown
    }

    lastReactionTime.current = now;
    setCanReact(false);

    // Broadcast reaction
    await supabase.channel(`reactions-${eventId}`).send({
      type: 'broadcast',
      event: 'reaction',
      payload: { emoji, guestId }
    });

    // Re-enable after cooldown
    setTimeout(() => {
      setCanReact(true);
    }, cooldownMs);

    return true;
  }, [eventId, guestId]);

  return {
    reactions,
    counts,
    canReact,
    sendReaction
  };
}
