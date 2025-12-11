import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const EMOJIS = ["🔥", "💡", "🙏", "❤️", "👏", "😮"];

interface GuestReactionsProps {
  eventId: string;
  guestId: string;
}

interface FloatingEmoji {
  id: string;
  emoji: string;
  x: number;
}

export function GuestReactions({ eventId, guestId }: GuestReactionsProps) {
  const [lastReaction, setLastReaction] = useState<number>(0);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // Subscribe to reactions broadcast
    channelRef.current = supabase
      .channel(`reactions:${eventId}`)
      .on("broadcast", { event: "reaction" }, ({ payload }) => {
        handleIncomingReaction(payload.emoji);
      })
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [eventId]);

  const handleIncomingReaction = (emoji: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    const x = Math.random() * 80 + 10; // 10-90% of width

    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setReactionCounts(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));

    // Remove after animation
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
  };

  const sendReaction = async (emoji: string) => {
    const now = Date.now();
    if (now - lastReaction < 2000) return; // Rate limit: 2 seconds
    
    setLastReaction(now);

    // Broadcast via Supabase Realtime
    channelRef.current?.send({
      type: "broadcast",
      event: "reaction",
      payload: { emoji, guestId }
    });

    // Also show locally
    handleIncomingReaction(emoji);

    // Optionally save to DB for analytics (fire and forget)
    supabase
      .from("guesthouse_reactions")
      .insert({ event_id: eventId, guest_id: guestId, emoji })
      .then(() => {});
  };

  return (
    <>
      {/* Floating emojis overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {floatingEmojis.map((fe) => (
            <motion.div
              key={fe.id}
              initial={{ y: "100vh", x: `${fe.x}%`, opacity: 1, scale: 1 }}
              animate={{ y: "-20vh", opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute text-4xl"
            >
              {fe.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Reaction bar */}
      <Card className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 p-3 bg-card/90 backdrop-blur-xl border-primary/20 shadow-[var(--shadow-elegant)]">
        <div className="flex items-center gap-2">
          {EMOJIS.map((emoji) => (
            <motion.button
              key={emoji}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => sendReaction(emoji)}
              className="relative p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              <span className="text-2xl">{emoji}</span>
              {reactionCounts[emoji] > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {reactionCounts[emoji] > 99 ? "99+" : reactionCounts[emoji]}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>
      </Card>
    </>
  );
}
