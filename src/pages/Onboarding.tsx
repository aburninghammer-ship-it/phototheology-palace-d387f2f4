import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Gamepad2, Users, GraduationCap, ChevronRight, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const onboardingSteps = [
  {
    icon: BookOpen,
    title: "Master Bible Typology",
    description: "Phototheology uses the Memory Palace technique to help you understand how Bible stories connect through typology - patterns and prophecies that point to Christ.",
    image: "🏛️",
  },
  {
    icon: Gamepad2,
    title: "Learn Through Interactive Games",
    description: "Engage with Escape Rooms, Chain Chess, and Treasure Hunts that make Bible study fun and memorable. Each game teaches typological connections.",
    image: "🎮",
  },
  {
    icon: GraduationCap,
    title: "Structured Learning Paths",
    description: "Follow our Daniel, Revelation, and Blueprint courses. Each course builds your understanding of Bible prophecy and symbolism step by step.",
    image: "📚",
  },
  {
    icon: Users,
    title: "Study With Community",
    description: "Join live study rooms, share insights in the community, and compete on leaderboards. Learning together makes it better.",
    image: "👥",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }
    localStorage.setItem("onboarding_completed", "true");
    navigate("/dashboard");
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/dashboard");
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">{step.title}</CardTitle>
          <CardDescription className="text-lg mt-2">{step.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center text-8xl mb-4">
            {step.image}
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, index) => (
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

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              variant="ghost"
              onClick={handleSkip}
            >
              Skip Tour
            </Button>

            <Button onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
