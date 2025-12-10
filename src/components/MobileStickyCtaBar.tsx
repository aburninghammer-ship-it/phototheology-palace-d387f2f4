import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export function MobileStickyCtaBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Only show after scrolling past the hero section
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show after scrolling 400px (past hero)
      setIsVisible(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Don't show if user is logged in or not on mobile
  if (user || !isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-primary via-primary to-accent p-3 shadow-2xl shadow-primary/30 border-t border-primary/20">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Sparkles className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">Master the Bible</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate("/auth")}
            className="bg-white text-primary hover:bg-white/90 font-bold whitespace-nowrap shadow-lg"
          >
            Start Free
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
