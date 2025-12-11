import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Sparkles, Play, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroCardsDisplay from "@/assets/branding/hero-cards-display.png";
import { UserCountBadge } from "@/components/UserCountBadge";
const socialProof = [
  "Thousands taught over 20 years",
  "Discover Christ in every chapter", 
  "Loved by pastors & teachers",
];

export const PunchyHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToDemo = () => {
    const demoSection = document.getElementById("interactive-demo");
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-safe">
      {/* Subtle animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-0">
        {/* Main Title - Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3 sm:mb-4"
        >
          <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-widest text-primary uppercase drop-shadow-[0_0_10px_hsl(var(--primary)/0.5)]">
            Phototheology Bible Study Suite
          </h2>
        </motion.div>

        {/* Badge - Glass Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-4 sm:mb-6"
        >
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-background/20 backdrop-blur-md border border-primary/30 text-xs sm:text-sm font-medium text-primary shadow-[0_4px_30px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="whitespace-normal sm:whitespace-nowrap">Not another devotional app • A complete Bible study system</span>
          </span>
        </motion.div>

        {/* Main Headline - Mobile-first, clearer */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 leading-tight sm:leading-[1.1] px-2"
        >
          {/* Mobile: Shorter, punchier headline */}
          <span className="sm:hidden">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Master
            </span>{" "}
            the Bible
          </span>
          {/* Desktop: Full headline */}
          <span className="hidden sm:inline">
            Finally{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              understand
            </span>{" "}
            the Bible
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              — and{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                remember it
              </span>
            </span>
          </span>
        </motion.h1>

        {/* Clear Subheadline - Mobile optimized */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 px-4"
        >
          {/* Mobile: Ultra-short */}
          <span className="sm:hidden">
            A visual system to <span className="font-medium text-foreground">understand & remember</span> Scripture.
          </span>
          {/* Desktop: Full message */}
          <span className="hidden sm:block">
            A visual memory system that transforms how you study Scripture.
            <br />
            <span className="font-medium text-foreground">
              See connections. Build understanding. Never forget what you learned.
            </span>
          </span>
        </motion.p>

        {/* Social Proof Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          {socialProof.map((item, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className={`bg-background/80 backdrop-blur-sm border-border/50 px-3 py-1 ${i === 2 ? 'hidden sm:flex' : ''}`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" />
              {item}
            </Badge>
          ))}
        </motion.div>

        {/* User Count Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-6"
        >
          <UserCountBadge />
        </motion.div>

        {/* Hero Card Deck Image - Glass container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-8 px-4"
        >
          <div className="relative p-3 sm:p-5 md:p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] max-w-xs sm:max-w-2xl md:max-w-4xl mx-auto overflow-hidden">
            {/* Inner gradient glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
            {/* Animated floating orbs */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-cyan-400/60 animate-pulse" />
            <div className="absolute bottom-6 right-8 w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse delay-300" />
            <div className="absolute top-1/2 right-4 w-1 h-1 rounded-full bg-primary/60 animate-pulse delay-700" />
            <img 
              src={heroCardsDisplay} 
              alt="Phototheology Card Deck - 8 floors of Bible study principles" 
              className="relative w-full drop-shadow-2xl"
              loading="eager"
              decoding="async"
            />
          </div>
        </motion.div>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
        >
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 gradient-palace shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Start Free — No Credit Card
            <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToDemo}
            className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-2 hover:bg-primary/5 w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Play className="mr-2 h-5 w-5" />
            See It In Action
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-xs sm:text-sm text-muted-foreground text-center mt-4 px-2"
        >
          Free forever tier • Cancel anytime • No spam
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="text-sm sm:text-base text-center mt-3 px-2"
        >
          <span 
            onClick={() => navigate("/auth?patreon=true")} 
            className="text-primary hover:text-primary/80 cursor-pointer font-medium underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-all"
          >
            Already a Patron? Connect for full access →
          </span>
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-2xl mx-auto mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border/50 px-4"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">8</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Palace Floors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-accent">100+</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Study Principles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">AI</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">Powered Guide</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};