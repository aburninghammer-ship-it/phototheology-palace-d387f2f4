import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const ClearHero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            The First Bible App That Shows You{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              How Everything Connects
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-3">
            Most people read the Bible and still feel lost.
          </p>
          
          <p className="text-xl md:text-2xl text-foreground max-w-4xl mx-auto font-medium">
            Phototheology turns Scripture into a visual palace of rooms, floors, and patterns—
            <span className="text-primary font-semibold"> so you finally understand what you study AND remember it.</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="text-lg px-8 py-6 gradient-palace shadow-xl hover:shadow-2xl transition-all"
          >
            Start Free Trial
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const howItWorksSection = document.getElementById('how-it-works');
              howItWorksSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-lg px-8 py-6 border-2"
          >
            <Play className="mr-2 h-5 w-5" />
            See How It Works
          </Button>
        </motion.div>

        {/* Quick Value Props */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur border border-primary/10">
            <div className="text-4xl mb-2">🏰</div>
            <p className="font-semibold text-foreground mb-1">Transform Your Study</p>
            <p className="text-sm text-muted-foreground">Turn books and chapters into visual rooms you can instantly recall</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur border border-accent/10">
            <div className="text-4xl mb-2">🔗</div>
            <p className="font-semibold text-foreground mb-1">Reveal the Patterns</p>
            <p className="text-sm text-muted-foreground">See how prophecies, symbols, and doctrines connect across Scripture</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur border border-primary/10">
            <div className="text-4xl mb-2">💡</div>
            <p className="font-semibold text-foreground mb-1">Make It Memorable</p>
            <p className="text-sm text-muted-foreground">Never lose track of what you read—the Palace locks it into memory</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
