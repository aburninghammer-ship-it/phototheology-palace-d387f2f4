import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Building2, 
  Link2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Target,
  Brain
} from "lucide-react";

interface WalkthroughStep {
  id: number;
  title: string;
  subtitle: string;
  verse: string;
  verseText: string;
  palaceElement: string;
  palaceIcon: React.ReactNode;
  explanation: string;
  christConnection: string;
  memoryHook: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: "Step 1: Read the Text",
    subtitle: "Story Room (Floor 1)",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd; I shall not want.",
    palaceElement: "Story Room",
    palaceIcon: <BookOpen className="h-5 w-5" />,
    explanation: "In the Story Room, we first collect the narrative. David pictures God as a shepherd — protector, provider, guide.",
    christConnection: "Jesus declares 'I am the Good Shepherd' (John 10:11), fulfilling this imagery.",
    memoryHook: "Picture a shepherd's staff glowing with divine light, leading you through a green meadow."
  },
  {
    id: 2,
    title: "Step 2: Visualize the Scene",
    subtitle: "Imagination Room (Floor 1)",
    verse: "Psalm 23:2-3",
    verseText: "He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",
    palaceElement: "Imagination Room",
    palaceIcon: <Eye className="h-5 w-5" />,
    explanation: "The Imagination Room immerses you in the text. Feel the grass beneath you. Hear the quiet stream. Smell the fresh air.",
    christConnection: "Christ offers living water (John 4:14) and calls the weary to rest in Him (Matt 11:28-29).",
    memoryHook: "You're lying on soft grass beside crystal-clear water. The Shepherd sits nearby, watching over you."
  },
  {
    id: 3,
    title: "Step 3: Find Christ",
    subtitle: "Concentration Room (Floor 4)",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
    palaceElement: "Concentration Room",
    palaceIcon: <Target className="h-5 w-5" />,
    explanation: "The Concentration Room insists: every text must reveal Christ. The 'shadow of death' points to Calvary — where Christ walked through death itself.",
    christConnection: "Christ's presence in our darkest valleys is the fulfillment of 'Thou art with me.'",
    memoryHook: "A valley shrouded in shadow, but a bright figure walks ahead — the Shepherd leading through death to life."
  },
  {
    id: 4,
    title: "Step 4: Connect the Pattern",
    subtitle: "Patterns Room (Floor 4)",
    verse: "Psalm 23:5-6",
    verseText: "Thou preparest a table before me in the presence of mine enemies... I will dwell in the house of the LORD for ever.",
    palaceElement: "Patterns Room",
    palaceIcon: <Link2 className="h-5 w-5" />,
    explanation: "The Patterns Room traces recurring motifs. Table → Communion. Anointing → Priesthood. House of the LORD → Temple/Heaven.",
    christConnection: "The table points to the Last Supper; dwelling in God's house points to the New Jerusalem (Rev 21).",
    memoryHook: "A banquet table in the sanctuary, enemies watching from outside, the King serving you bread and wine."
  },
  {
    id: 5,
    title: "Step 5: Store in the Palace",
    subtitle: "Full Integration",
    verse: "Psalm 23 Complete",
    verseText: "The entire Psalm is now a visual journey stored in your memory palace.",
    palaceElement: "Palace Integration",
    palaceIcon: <Building2 className="h-5 w-5" />,
    explanation: "Now Psalm 23 isn't just words — it's a living scene in your memory palace. You can walk through it anytime, recalling every detail.",
    christConnection: "Christ is visible in every verse: Shepherd, Provider, Companion through death, Host, and eternal Dwelling.",
    memoryHook: "Your palace now has a 'Shepherd Room' — enter anytime to walk with Christ through green pastures, dark valleys, and the heavenly banquet."
  }
];

export const InteractiveWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const step = WALKTHROUGH_STEPS[currentStep];

  const nextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive Demo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How the Palace Method Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Walk through Psalm 23 and experience how Phototheology transforms Scripture into unforgettable, Christ-centered visual memory.
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {WALKTHROUGH_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? "w-8 bg-primary" 
                  : idx < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/20 text-primary">
                    {step.palaceIcon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Scripture */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">{step.verse}</p>
                  <p className="text-lg italic">"{step.verseText}"</p>
                </div>

                {/* Explanation */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Palace Method</p>
                      <p className="text-muted-foreground">{step.explanation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-accent/10 text-accent mt-0.5">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-accent mb-1">Christ Connection</p>
                      <p className="text-muted-foreground">{step.christConnection}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Memory Hook</p>
                      <p className="text-muted-foreground italic">{step.memoryHook}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {WALKTHROUGH_STEPS.length}
                  </span>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === WALKTHROUGH_STEPS.length - 1}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Final CTA if on last step */}
        {currentStep === WALKTHROUGH_STEPS.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <p className="text-lg font-medium mb-4">
              Ready to build your own palace with every book of the Bible?
            </p>
            <Button size="lg" className="gradient-palace">
              Start Your Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
