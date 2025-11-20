import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Heart, Church, ChevronRight, ChevronLeft, Building2, Sparkles, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type OnboardingStep = "welcome" | "discovery" | "role" | "tutorial" | "quick-win" | "complete";

const roles = [
  {
    value: "teacher",
    label: "Teacher / Pastor",
    description: "Leading Bible studies and teaching others",
    icon: BookOpen,
    features: ["Lesson plans", "Teaching tools", "Series builder"]
  },
  {
    value: "student",
    label: "Student",
    description: "Learning and growing in biblical knowledge",
    icon: Target,
    features: ["Structured courses", "Interactive drills", "Progress tracking"]
  },
  {
    value: "personal",
    label: "Personal Growth",
    description: "Deepening my personal walk with God",
    icon: Heart,
    features: ["Daily devotions", "Memory tools", "Journaling"]
  },
  {
    value: "church_leader",
    label: "Church Leader",
    description: "Equipping and empowering my congregation",
    icon: Church,
    features: ["Church dashboard", "Member tracking", "Group challenges"]
  }
];

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const tutorialSteps = [
    {
      title: "Welcome to the Palace",
      description: "Phototheology uses the 'Memory Palace' method - 8 floors, each with specific rooms that teach you how to study the Bible using mental images and structured principles.",
      icon: Building2
    },
    {
      title: "Each Floor Has a Purpose",
      description: "Floor 1 helps you memorize stories. Floor 2 teaches investigation. Floor 3 trains freestyle thinking. And so on, building your skills progressively.",
      icon: Sparkles
    },
    {
      title: "Rooms = Techniques",
      description: "Inside each floor are 'rooms' - specific techniques like the Story Room (memorizing narratives) or the Concentration Room (finding Christ in every text).",
      icon: Target
    }
  ];

  const progressPercentage = 
    step === "welcome" ? 0 :
    step === "discovery" ? 20 :
    step === "role" ? 40 :
    step === "tutorial" ? 60 :
    step === "quick-win" ? 80 :
    100;

  const handleNext = () => {
    if (step === "welcome") setStep("discovery");
    else if (step === "discovery") setStep("role");
    else if (step === "role" && selectedRole) setStep("tutorial");
    else if (step === "tutorial") {
      if (tutorialIndex < tutorialSteps.length - 1) {
        setTutorialIndex(tutorialIndex + 1);
      } else {
        setStep("quick-win");
      }
    }
  };

  const handleBack = () => {
    if (step === "discovery") setStep("welcome");
    else if (step === "role") setStep("discovery");
    else if (step === "tutorial") {
      if (tutorialIndex > 0) {
        setTutorialIndex(tutorialIndex - 1);
      } else {
        setStep("role");
      }
    }
    else if (step === "quick-win") setStep("tutorial");
  };

  const handleComplete = async () => {
    if (!selectedRole) return;

    try {
      if (user) {
        // Insert role into user_roles table
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: selectedRole as any });

        // Update profile
        await supabase
          .from("profiles")
          .update({ 
            primary_role: selectedRole,
            onboarding_step: 100,
            onboarding_completed: true,
          })
          .eq("id", user.id);
      }
      
      localStorage.setItem("onboarding_completed", "true");
      
      toast({
        title: "Welcome to Phototheology! 🎉",
        description: "Let's start your journey in the Story Room",
      });
      
      // Navigate to Story Room for quick win
      navigate("/palace/floor/1/room/sr");
    } catch (error) {
      console.error("Error saving onboarding:", error);
      toast({
        title: "Something went wrong",
        description: "But don't worry, you can still continue!",
        variant: "destructive"
      });
      navigate("/palace");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center">
          {step !== "complete" && (
            <>
              <div className="mb-4">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <div className="mx-auto w-16 h-16 rounded-full gradient-ocean flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </>
          )}
          
          {step === "welcome" && (
            <>
              <CardTitle className="text-4xl font-bold">Welcome to Phototheology! 🎉</CardTitle>
              <CardDescription className="text-lg mt-2">
                Master the Bible through the ancient Memory Palace method
              </CardDescription>
            </>
          )}

          {step === "discovery" && (
            <>
              <CardTitle className="text-4xl font-bold">See What Others Miss</CardTitle>
              <CardDescription className="text-lg mt-2">
                Discovering hidden patterns in Scripture
              </CardDescription>
            </>
          )}

          {step === "role" && (
            <>
              <CardTitle className="text-4xl font-bold">Choose Your Path</CardTitle>
              <CardDescription className="text-lg mt-2">
                Personalize your Phototheology experience
              </CardDescription>
            </>
          )}

          {step === "tutorial" && (
            <>
              <CardTitle className="text-4xl font-bold">The Palace Method</CardTitle>
              <CardDescription className="text-lg mt-2">
                Understanding the 8-floor structure
              </CardDescription>
            </>
          )}

          {step === "quick-win" && (
            <>
              <CardTitle className="text-4xl font-bold">Your First Win</CardTitle>
              <CardDescription className="text-lg mt-2">
                Master the Story Room technique
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* WELCOME STEP */}
          {step === "welcome" && (
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-center text-lg">
                  Phototheology trains you to <strong>see</strong>, <strong>remember</strong>, and <strong>teach</strong> Scripture 
                  like never before. Using mental imagery and structured techniques, you'll build a permanent biblical memory system.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <Building2 className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">8 Floors</h3>
                  <p className="text-sm text-muted-foreground">Progressive levels from memory to mastery</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Sparkles className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">38+ Rooms</h3>
                  <p className="text-sm text-muted-foreground">Specific techniques for Bible study</p>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Christ-Centered</h3>
                  <p className="text-sm text-muted-foreground">Every text points to Jesus</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tour
                </Button>
                <Button onClick={handleNext}>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* DISCOVERY STEP - THE UNNAMED SON OF DAVID */}
          {step === "discovery" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">The Unnamed Son of David</h3>
                <p className="text-muted-foreground">A hidden gem from 2 Samuel 12</p>
              </div>

              {/* Context Setting */}
              <div className="bg-muted/30 rounded-lg p-5 space-y-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">The Context:</span> King David has committed adultery with Bathsheba and arranged for her husband Uriah to be killed in battle. 
                  The prophet Nathan confronts David with his sin, and David repents. But Nathan delivers God's judgment:
                </p>
                <p className="text-sm italic text-muted-foreground pl-4 border-l-2 border-border">
                  "The child also that is born unto thee shall surely die." (2 Samuel 12:14)
                </p>
              </div>

              {/* The Story */}
              <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg border border-border/50 space-y-4">
                <p className="text-lg leading-relaxed">
                  Then, in 2 Samuel 12:15-23, a male child is born to David and Bathsheba. He is never given a name—he is simply identified as <span className="font-semibold italic">"the son of David."</span>
                </p>
                
                <p className="text-base leading-relaxed text-muted-foreground">
                  David fasts and prays desperately for seven days while the child lies sick. But on the seventh day, the child dies. 
                  David rises, washes, worships, and eats—shocking his servants with his composure.
                </p>

                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-foreground">Notice the pattern:</p>
                  <div className="pl-4 border-l-4 border-primary/30 space-y-2">
                    <p className="text-base text-muted-foreground">
                      • He enters the world <span className="font-medium text-foreground">because of someone else's sin</span>
                    </p>
                    <p className="text-base text-muted-foreground">
                      • He <span className="font-medium text-foreground">commits no wrong</span>—an innocent child
                    </p>
                    <p className="text-base text-muted-foreground">
                      • Yet he <span className="font-medium text-foreground">dies in the place of the guilty</span>
                    </p>
                  </div>
                </div>

                <p className="text-lg leading-relaxed pt-2">
                  A quiet shadow of the <span className="font-semibold text-primary">Greater Son of David</span>—Jesus Christ—who would enter the world because of <span className="italic">our</span> sin, 
                  and die as the innocent substitute to bear the judgment we deserved.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg mb-2">If connections like this make Scripture come alive...</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      This app is for you. Phototheology trains you to see patterns, recognize types, and discover Christ in every chapter—from Genesis to Revelation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  Find More Hidden Gems
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ROLE SELECTION STEP */}
          {step === "role" && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">I'm here as a...</h3>
                <p className="text-muted-foreground">Choose your primary role (you can change this later)</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => {
                  const RoleIcon = role.icon;
                  const isSelected = selectedRole === role.value;
                  
                  return (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-6 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-lg" 
                          : "border-border bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                          <RoleIcon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg mb-1">{role.label}</div>
                          <div className="text-sm text-muted-foreground mb-3">{role.description}</div>
                          <div className="space-y-1">
                            {role.features.map((feature, i) => (
                              <div key={i} className="text-xs flex items-center gap-2">
                                <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground"}`} />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!selectedRole}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* TUTORIAL STEP */}
          {step === "tutorial" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  {(() => {
                    const StepIcon = tutorialSteps[tutorialIndex].icon;
                    return <StepIcon className="h-10 w-10 text-primary" />;
                  })()}
                </div>
                <h3 className="text-2xl font-bold mb-2">{tutorialSteps[tutorialIndex].title}</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  {tutorialSteps[tutorialIndex].description}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === tutorialIndex
                        ? "w-8 bg-primary"
                        : index < tutorialIndex
                        ? "w-2 bg-primary/50"
                        : "w-2 bg-muted"
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext}>
                  {tutorialIndex === tutorialSteps.length - 1 ? "Try It Now" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* QUICK WIN STEP */}
          {step === "quick-win" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-4 animate-pulse">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Your First Quick Win!</h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Let's start with the <strong>Story Room</strong> on Floor 1. You'll learn to break down 
                  any Bible story into 3-7 memorable "beats" - like movie frames.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-lg">What you'll do:</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Pick a story</p>
                      <p className="text-sm text-muted-foreground">Choose from Joseph, David & Goliath, or Daniel in the lions' den</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Break it into beats</p>
                      <p className="text-sm text-muted-foreground">Write 3-7 punchy words that capture the key moments</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Get feedback</p>
                      <p className="text-sm text-muted-foreground">Our AI assistant Jeeves will guide you</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded">
                <p className="text-sm">
                  <strong>Pro tip:</strong> This will take about 5 minutes. Once you complete it, 
                  you'll have the foundation for memorizing any Bible story!
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleComplete} size="lg" className="shadow-lg">
                  Start Story Room
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
