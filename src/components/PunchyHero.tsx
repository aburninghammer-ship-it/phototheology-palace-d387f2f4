import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroCardsDisplay from "@/assets/branding/hero-cards-display.png";

export const PunchyHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-safe">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-0">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium text-primary">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-normal sm:whitespace-nowrap">A 2-year mastery journey • Not another quick-fix app</span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight sm:leading-[1.1] px-2"
        >
          The Bible,{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block">
            but unforgettable.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-2 px-4"
        >
          Most people read Scripture and forget it by lunch.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto mb-6 px-4"
        >
          Phototheology turns the Bible into a{" "}
          <span className="text-primary font-semibold whitespace-nowrap">visual palace</span>
          {" "}—so you understand it, connect it, and{" "}
          <span className="text-accent font-semibold whitespace-nowrap">actually remember it</span>.
        </motion.p>

        {/* Hero Card Deck Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-8 px-4"
        >
          <img 
            src={heroCardsDisplay} 
            alt="Phototheology Card Deck - 8 floors of Bible study principles" 
            className="w-full max-w-4xl mx-auto drop-shadow-2xl"
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-3 sm:gap-4 px-4"
        >
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 gradient-palace shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Start Free — No Credit Card
            <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
            Free forever tier • Upgrade when you're ready
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50 px-4"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">2yr</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Mastery Journey</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">8</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Palace Floors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">100+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Principle Cards</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};