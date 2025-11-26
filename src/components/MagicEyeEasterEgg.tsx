import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import magicEyeImage from "@/assets/magic-eye.png";

export const MagicEyeEasterEgg = () => {
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Hidden Patterns — Just Like Scripture
        </h2>
        
        <p className="text-xl text-muted-foreground mb-4">
          Can You See It?
        </p>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Just like Scripture hides patterns, themes, and structures beneath the surface,
          Phototheology teaches you to spot what was always there.
        </p>

        {/* Magic Eye Image */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20 mb-6">
          <motion.div
            animate={{
              boxShadow: revealed
                ? "0 0 40px rgba(var(--primary), 0.3)"
                : "0 0 0px rgba(var(--primary), 0)",
            }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={magicEyeImage}
              alt="Magic Eye - Find the hidden word"
              className="w-full h-auto"
              style={{ minHeight: "300px" }}
            />
            
            {/* Reveal overlay */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center"
                >
                  <div className="text-center text-primary-foreground p-8">
                    <Eye className="h-24 w-24 mx-auto mb-4" />
                    <p className="text-3xl font-bold mb-2">"I Love You"</p>
                    <p className="text-lg">The hidden word is "Phototheology"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {!revealed && (
          <Button
            onClick={() => setRevealed(true)}
            variant="outline"
            size="lg"
            className="mb-6"
          >
            <Eye className="mr-2 h-4 w-4" />
            Reveal the Hidden Word
          </Button>
        )}

        <p className="text-lg text-muted-foreground italic mb-8">
          If you can find the hidden word, you'll love the Palace.
        </p>

        <div className="pt-6 border-t border-border">
          <p className="text-xl font-semibold text-foreground mb-6">
            What was once invisible becomes obvious.
            <br />
            <span className="text-primary">This is how your mind was designed to read the Bible.</span>
          </p>
          
          <Button
            size="lg"
            onClick={() => navigate(user ? "/palace" : "/auth")}
            className="gradient-palace"
          >
            Enter the Palace
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
