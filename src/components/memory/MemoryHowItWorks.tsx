import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Lightbulb, 
  Home, 
  Brain, 
  Play, 
  Pause,
  RotateCcw,
  Sparkles
} from "lucide-react";

const DEMO_STEPS = [
  {
    id: 1,
    title: "Read the Verse",
    icon: Eye,
    color: "bg-blue-500",
    verse: "John 3:16",
    content: "\"For God so loved the world, that he gave his only begotten Son...\"",
    description: "Start by reading the verse slowly, understanding each word.",
  },
  {
    id: 2,
    title: "Create a Visual Hook",
    icon: Lightbulb,
    color: "bg-amber-500",
    verse: "John 3:16",
    content: "🌍 → ❤️ → 🎁 → 👑",
    description: "Transform key words into vivid images: World (globe), Love (heart), Gave (gift), Son (crown).",
  },
  {
    id: 3,
    title: "Place in Your Palace",
    icon: Home,
    color: "bg-purple-500",
    verse: "John 3:16",
    content: "🚪 Entry Hall → Globe by door → Heart on table → Gift on chair → Crown on throne",
    description: "Walk through your mental palace, placing each image in a specific location.",
  },
  {
    id: 4,
    title: "Recall & Reinforce",
    icon: Brain,
    color: "bg-green-500",
    verse: "John 3:16",
    content: "✓ Close eyes → Walk the palace → See the images → Speak the verse",
    description: "Practice recalling by mentally walking through your palace and seeing each image.",
  },
];

export function MemoryHowItWorks() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DEMO_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = () => {
    setHasStarted(true);
    if (currentStep >= DEMO_STEPS.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const step = DEMO_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            How Memory Palace Works
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={currentStep === 0 && !isPlaying}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => isPlaying ? setIsPlaying(false) : handlePlay()}
              className="gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {!hasStarted ? "Watch Demo" : isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Steps */}
        <div className="flex gap-2">
          {DEMO_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setCurrentStep(i); setIsPlaying(false); setHasStarted(true); }}
              className={`flex-1 h-2 rounded-full transition-all ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Current Step Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${step.color}`}>
                <StepIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <Badge variant="outline" className="mb-1">
                  Step {step.id} of {DEMO_STEPS.length}
                </Badge>
                <h3 className="text-lg font-semibold">{step.title}</h3>
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 border">
              <p className="text-xs text-muted-foreground mb-2">{step.verse}</p>
              <p className="text-xl font-mono text-center py-4">{step.content}</p>
            </div>

            <p className="text-sm text-muted-foreground">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Why This Works */}
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            <strong className="text-primary">Why it works:</strong> Your brain remembers images 65,000x faster than text. 
            By converting verses to vivid pictures placed in familiar locations, you leverage spatial memory—the same 
            system that helps you navigate your home in the dark.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
