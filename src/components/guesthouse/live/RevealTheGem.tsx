import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gem, BookOpen, Sparkles } from "lucide-react";

interface RevealTheGemProps {
  verses: Array<{ reference: string; text: string }>;
  unifiedTheme: string;
  devotionalSynthesis: string;
}

export function RevealTheGem({
  verses,
  unifiedTheme,
  devotionalSynthesis
}: RevealTheGemProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 bg-card/80 backdrop-blur-xl border-border/50 overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative z-10"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Gem className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">The Gem Revealed</h2>
            <p className="text-muted-foreground">
              The room built something together tonight
            </p>
          </div>

          {/* Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <Badge 
              variant="outline" 
              className="text-lg px-6 py-2 bg-primary/10 border-primary/30"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {unifiedTheme}
            </Badge>
          </motion.div>

          {/* Verses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mb-8"
          >
            {verses.map((verse, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.2 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-primary mb-1">{verse.reference}</p>
                    <p className="text-muted-foreground italic">"{verse.text}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Devotional synthesis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
          >
            <p className="text-lg leading-relaxed text-center">
              {devotionalSynthesis}
            </p>
          </motion.div>

          {/* Subtle invitation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mt-8 text-muted-foreground"
          >
            Want to go deeper? The Palace awaits.
          </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
}
