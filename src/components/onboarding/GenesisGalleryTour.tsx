import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Play, Sparkles, Eye, Building2 } from "lucide-react";
import { genesisImages } from "@/assets/24fps/genesis";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEventTracking } from "@/hooks/useEventTracking";

const TOUR_IMAGES = [
  { chapter: 1, title: "Creation", description: "Birthday Cake Earth — God creates the world in 6 days" },
  { chapter: 2, title: "Adam & Eve", description: "Garden with 4 rivers — Eden's paradise before the Fall" },
  { chapter: 3, title: "The Fall", description: "Snake + Apple + Clock — Sin enters, time begins running out" },
  { chapter: 4, title: "Cain & Abel", description: "Two altars, one rejected — First murder, first sacrifice" },
  { chapter: 5, title: "Genealogy of Adam", description: "Family tree — The 'Jean'-eology of Adam" },
  { chapter: 6, title: "The Ark", description: "Boat blueprints — God's rescue plan begins" },
  { chapter: 7, title: "The Flood", description: "Rising waters — Judgment and salvation combined" },
];

interface GenesisGalleryTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function GenesisGalleryTour({ onComplete, onSkip }: GenesisGalleryTourProps) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const totalSteps = TOUR_IMAGES.length + 1; // +1 for CTA step
  const { trackEvent } = useEventTracking();

  // Track tour start
  useEffect(() => {
    trackEvent({ eventType: "24fps_tour_started" });
  }, []);

  // Track step views
  useEffect(() => {
    if (step < TOUR_IMAGES.length) {
      trackEvent({ 
        eventType: "24fps_tour_step", 
        eventData: { step, chapter: TOUR_IMAGES[step].chapter } 
      });
    } else {
      trackEvent({ eventType: "24fps_tour_cta_shown" });
    }
  }, [step]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleStartChallenge = () => {
    trackEvent({ eventType: "24fps_tour_completed", eventData: { action: "start_challenge" } });
    onComplete();
    navigate("/genesis-challenge");
  };

  const handleSkipTour = () => {
    trackEvent({ eventType: "24fps_tour_skipped", eventData: { step } });
    onSkip();
  };

  const currentImage = TOUR_IMAGES[step];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Genesis Gallery Tour
            </Badge>
            <Button variant="ghost" size="sm" onClick={handleSkipTour} className="text-muted-foreground">
              Skip Tour
            </Button>
          </div>
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {step < TOUR_IMAGES.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <Badge className="mb-2">Chapter {currentImage.chapter}</Badge>
                  <CardTitle className="text-2xl">{currentImage.title}</CardTitle>
                </div>

                <div className="relative aspect-square max-w-sm mx-auto rounded-xl overflow-hidden border-4 border-primary/20 shadow-lg">
                  <img
                    src={genesisImages[currentImage.chapter - 1]}
                    alt={`Genesis Chapter ${currentImage.chapter}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{currentImage.description}</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 inline mr-1 text-primary" />
                    This single image unlocks instant recall of Genesis {currentImage.chapter}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-4"
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl mb-2">Ready for Your First Win?</CardTitle>
                  <p className="text-muted-foreground">
                    You've seen 7 images. Now test yourself on the <strong>Genesis High Rise</strong> — 
                    a 50-floor tower where each floor is a chapter.
                  </p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium">
                    Complete Day 1 (Floors 1-7) to earn your <Badge variant="secondary">First Win</Badge> badge
                  </p>
                </div>
                <Button size="lg" onClick={handleStartChallenge} className="shadow-lg">
                  <Play className="h-4 w-4 mr-2" />
                  Take the Genesis Challenge
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < TOUR_IMAGES.length && (
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
