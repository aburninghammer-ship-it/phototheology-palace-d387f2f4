import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, X, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveDemo } from "@/hooks/useLiveDemo";
import { useNavigate } from "react-router-dom";
import { playChallengeNotification } from "@/utils/notificationSound";

export function LiveDemoNotification() {
  const { activeSession, viewerCount, loading } = useLiveDemo();
  const [dismissed, setDismissed] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const navigate = useNavigate();

  // Play notification sound when session goes live
  useEffect(() => {
    if (activeSession && !hasPlayed) {
      playChallengeNotification();
      setHasPlayed(true);
    }
    if (!activeSession) {
      setHasPlayed(false);
      setDismissed(false);
    }
  }, [activeSession, hasPlayed]);

  if (loading || !activeSession || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[95vw] max-w-md"
      >
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl shadow-2xl p-4 border border-red-400/30">
          <div className="flex items-start gap-3">
            {/* Pulsing live indicator */}
            <div className="relative flex-shrink-0 mt-1">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4" />
                <span className="font-bold text-sm uppercase tracking-wide">Live Now</span>
              </div>
              
              <h3 className="font-semibold text-lg leading-tight mb-1 truncate">
                {activeSession.title}
              </h3>
              
              {activeSession.description && (
                <p className="text-white/80 text-sm line-clamp-2 mb-2">
                  {activeSession.description}
                </p>
              )}

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{viewerCount} watching</span>
                </div>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate('/live-demo')}
                  className="bg-white text-red-600 hover:bg-white/90"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Join
                </Button>
              </div>
            </div>

            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white p-1 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
