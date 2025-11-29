import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Layers, DoorOpen, Target, Sparkles, ChevronRight, ChevronLeft, X, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PalaceTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = [
  {
    id: "welcome",
    title: "Welcome to Your Palace",
    description: "Phototheology uses the ancient 'Memory Palace' method to help you store Scripture in your mind permanently. Think of it as building a mental library where every verse has its place.",
    icon: Building2,
    highlight: "palace-overview",
    tip: "The palace has 8 floors, each teaching different Bible study skills.",
  },
  {
    id: "floors",
    title: "8 Floors of Mastery",
    description: "Each floor represents a level of Bible study depth. Floor 1 teaches basic memory and storytelling. By Floor 8, you'll think Phototheologically without even trying.",
    icon: Layers,
    highlight: "floor-section",
    floors: [
      { num: 1, name: "Furnishing", focus: "Memory & Stories" },
      { num: 2, name: "Investigation", focus: "Detective Work" },
      { num: 3, name: "Freestyle", focus: "Daily Connections" },
      { num: 4, name: "Next Level", focus: "Christ-Centered Depth" },
    ],
  },
  {
    id: "rooms",
    title: "Rooms = Techniques",
    description: "Inside each floor are 'rooms' — specific techniques for studying Scripture. The Story Room helps you memorize narratives. The Gems Room stores your discoveries.",
    icon: DoorOpen,
    highlight: "room-door",
    examples: [
      { code: "SR", name: "Story Room", purpose: "Memorize Bible stories as mental movies" },
      { code: "GR", name: "Gems Room", purpose: "Store your insights and discoveries" },
      { code: "CR", name: "Concentration Room", purpose: "Find Christ in every text" },
    ],
  },
  {
    id: "christ-centered",
    title: "Every Text Points to Jesus",
    description: "The palace isn't just about memory — it's about seeing Christ in all Scripture. The Concentration Room (Floor 4) trains you to find Jesus in every chapter, from Genesis to Revelation.",
    icon: Target,
    highlight: "christ-focus",
    verse: "And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself. — Luke 24:27",
  },
  {
    id: "start",
    title: "Your First Room Awaits",
    description: "Ready to begin? Start with the Story Room on Floor 1. Pick a Bible story, turn it into a vivid mental movie, and watch how memory transforms into understanding.",
    icon: Sparkles,
    highlight: "story-room",
    cta: "Enter the Story Room",
  },
];

export function PalaceTour({ onComplete, onSkip }: PalaceTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <StepIcon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {tourSteps.length}
                    </p>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onSkip}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mb-6">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "w-8 bg-primary"
                        : index < currentStep
                        ? "w-2 bg-primary/50"
                        : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Step-specific content */}
                {step.id === "welcome" && step.tip && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary">💡 {step.tip}</p>
                  </div>
                )}

                {step.id === "floors" && step.floors && (
                  <div className="grid grid-cols-2 gap-3">
                    {step.floors.map((floor) => (
                      <div
                        key={floor.num}
                        className="bg-muted/50 rounded-lg p-3 border border-border"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-6 h-6 rounded bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                            {floor.num}
                          </span>
                          <span className="font-semibold text-sm">{floor.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{floor.focus}</p>
                      </div>
                    ))}
                  </div>
                )}

                {step.id === "rooms" && step.examples && (
                  <div className="space-y-3">
                    {step.examples.map((room) => (
                      <div
                        key={room.code}
                        className="flex items-start gap-3 bg-muted/30 rounded-lg p-3"
                      >
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono rounded">
                          {room.code}
                        </span>
                        <div>
                          <p className="font-medium text-sm">{room.name}</p>
                          <p className="text-xs text-muted-foreground">{room.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {step.id === "christ-centered" && step.verse && (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    "{step.verse}"
                  </blockquote>
                )}

                {step.id === "start" && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                    <Award className="h-10 w-10 text-primary" />
                    <div>
                      <p className="font-semibold">Badge Unlocked: Palace Explorer 🏛️</p>
                      <p className="text-sm text-muted-foreground">
                        You've completed the palace tour! Now let's put it into practice.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onSkip}>
                    Skip Tour
                  </Button>
                  <Button onClick={handleNext}>
                    {isLastStep ? (
                      <>
                        {step.cta || "Enter the Palace"}
                        <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
