import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Network, Brain, Sparkles } from "lucide-react";

const frames = [
  {
    icon: Building2,
    title: "Transform Your Study",
    description: "Turn books, chapters, and stories into visual rooms you can instantly recall.",
    gradient: "from-palace-purple via-palace-pink to-palace-purpleLight",
    iconColor: "text-palace-purple",
    bgGlow: "bg-palace-purple/20",
    borderColor: "border-palace-purple/30",
  },
  {
    icon: Network,
    title: "Reveal the Patterns",
    description: "See how prophecy, symbols, stories, and doctrines connect across Scripture.",
    gradient: "from-palace-teal via-palace-blue to-palace-tealLight",
    iconColor: "text-palace-teal",
    bgGlow: "bg-palace-teal/20",
    borderColor: "border-palace-teal/30",
  },
  {
    icon: Brain,
    title: "Make It Memorable",
    description: "Never lose track of what you read—the Palace locks Scripture into long-term memory.",
    gradient: "from-palace-orange via-palace-yellow to-palace-orangeLight",
    iconColor: "text-palace-orange",
    bgGlow: "bg-palace-orange/20",
    borderColor: "border-palace-orange/30",
  },
];

export const WhatPhototheologyDoes = () => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const frame = frames[currentFrame];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-palace-purple/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Discover the Method</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            What Phototheology Does
          </h2>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`relative rounded-2xl p-10 md:p-14 border-2 ${frame.borderColor} backdrop-blur-sm`}
              style={{
                background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)/0.5) 100%)`,
              }}
            >
              {/* Glow effect behind card */}
              <div className={`absolute -inset-1 ${frame.bgGlow} rounded-2xl blur-xl opacity-50`} />
              
              <div className="relative flex flex-col items-center text-center space-y-8">
                {/* Icon with gradient background */}
                <motion.div 
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${frame.gradient} shadow-lg`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <frame.icon className="w-14 h-14 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm" />
                </motion.div>
                
                <div className="space-y-4">
                  <h3 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${frame.gradient} bg-clip-text text-transparent`}>
                    {frame.title}
                  </h3>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    {frame.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators with colors */}
          <div className="flex justify-center gap-3 mt-10">
            {frames.map((f, index) => (
              <button
                key={index}
                onClick={() => setCurrentFrame(index)}
                className={`h-3 rounded-full transition-all duration-500 ${
                  index === currentFrame
                    ? `w-10 bg-gradient-to-r ${f.gradient} shadow-lg`
                    : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to frame ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
