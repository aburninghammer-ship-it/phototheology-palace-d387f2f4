import { useGuestMode } from "@/hooks/useGuestMode";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { X, User, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const GuestModeBanner = () => {
  const { isGuestMode, getSessionMinutes, pagesVisited, clearGuestSession } = useGuestMode();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Don't show if user is logged in or not in guest mode
  if (user || !isGuestMode) return null;
  
  const minutes = getSessionMinutes();
  const showUpgradePrompt = minutes >= 3 || pagesVisited.length >= 3;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-accent/90 via-primary/90 to-accent/90 text-primary-foreground shadow-lg backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Guest Preview</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-4 text-xs opacity-90">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {minutes} min
              </span>
              <span>{pagesVisited.length} pages explored</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showUpgradePrompt ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary hover:bg-white/90 text-xs sm:text-sm"
              >
                <User className="w-3.5 h-3.5 mr-1.5" />
                Create Free Account
              </Button>
            ) : (
              <span className="text-xs opacity-75 hidden sm:inline">
                Try features without signing up
              </span>
            )}
            
            <Button
              size="icon"
              variant="ghost"
              onClick={clearGuestSession}
              className="h-7 w-7 text-primary-foreground hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
