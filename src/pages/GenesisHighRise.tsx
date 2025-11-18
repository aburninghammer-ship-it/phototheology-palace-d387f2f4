import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, ChevronUp, ChevronDown, Shuffle, Timer, Trophy, Share2, ArrowRight } from "lucide-react";
import { genesisImages } from "@/assets/24fps/genesis";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CHALLENGE_MODES = [
  { id: "sequential", name: "Floor by Floor", icon: ChevronUp, description: "Master each floor in order" },
  { id: "reverse", name: "Descending", icon: ChevronDown, description: "Go backwards from 50 to 1" },
  { id: "odd", name: "Odd Floors", icon: Shuffle, description: "1, 3, 5, 7... (25 floors)" },
  { id: "even", name: "Even Floors", icon: Shuffle, description: "2, 4, 6, 8... (25 floors)" },
  { id: "random", name: "Random Mode", icon: Shuffle, description: "Test your mastery!" },
];

const DAILY_GOALS = [
  { day: 1, floors: "1-7", title: "Foundation (Creation to Genealogy)" },
  { day: 2, floors: "8-14", title: "Abraham Begins (Abram's Call to Lot)" },
  { day: 3, floors: "15-21", title: "Abraham's Covenant (Promise to Isaac)" },
  { day: 4, floors: "22-28", title: "Isaac & Jacob (Sacrifice to Ladder)" },
  { day: 5, floors: "29-35", title: "Jacob's Family (Wives to Return)" },
  { day: 6, floors: "36-42", title: "Joseph's Journey (Sold to Egypt)" },
  { day: 7, floors: "43-50", title: "Restoration (Reunion to Promised Land)" },
];

export default function GenesisHighRise() {
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [mode, setMode] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [completedFloors, setCompletedFloors] = useState<Set<number>>(new Set());
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState(1);

  const progress = (completedFloors.size / 50) * 100;

  const startChallenge = (modeId: string) => {
    setMode(modeId);
    setCurrentFloor(modeId === "reverse" ? 50 : 1);
    setTimeStarted(Date.now());
    setShowImage(true);
  };

  const goToNextFloor = () => {
    setShowImage(false);
    setTimeout(() => {
      const newCompleted = new Set(completedFloors);
      newCompleted.add(currentFloor);
      setCompletedFloors(newCompleted);

      if (mode === "sequential") {
        if (currentFloor < 50) setCurrentFloor(currentFloor + 1);
      } else if (mode === "reverse") {
        if (currentFloor > 1) setCurrentFloor(currentFloor - 1);
      } else if (mode === "odd") {
        const nextOdd = currentFloor + 2;
        if (nextOdd <= 49) setCurrentFloor(nextOdd);
      } else if (mode === "even") {
        const nextEven = currentFloor + 2;
        if (nextEven <= 50) setCurrentFloor(nextEven);
      } else if (mode === "random") {
        setCurrentFloor(Math.floor(Math.random() * 50) + 1);
      }
      
      setShowImage(true);
    }, 300);
  };

  const shareChallenge = () => {
    const text = `I'm memorizing Genesis with the High Rise Challenge! 🏢📖 ${completedFloors.size}/50 floors completed. Join me!`;
    if (navigator.share) {
      navigator.share({ title: "Genesis High Rise Challenge", text, url: window.location.href });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4" variant="secondary">
            <Building2 className="w-3 h-3 mr-1" />
            7-Day Challenge
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            The Genesis High Rise
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Memorize all 50 chapters of Genesis in 7 days using the 24FPS visual method. Each chapter is a floor in this 50-story building.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <p className="text-3xl font-bold">{completedFloors.size}/50 Floors</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={shareChallenge} variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={() => navigate("/auth")} size="sm">
                  Save Progress
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* How It Works */}
        {!mode && (
          <Card className="mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                How The Challenge Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Imagine Genesis as a 50-story high-rise building. You step into the elevator and visit each floor. 
                When the doors open, you see a unique image representing that chapter's story. This is the <strong>24FPS principle</strong> - 
                turning Scripture into memorable "frames" you can replay in your mind anytime.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {DAILY_GOALS.map((goal) => (
                  <Card key={goal.day} className="bg-card/50">
                    <CardContent className="p-4">
                      <Badge variant="outline" className="mb-2">Day {goal.day}</Badge>
                      <p className="font-semibold">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">Floors {goal.floors}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Challenge Modes */}
        {!mode ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHALLENGE_MODES.map((challengeMode) => {
              const Icon = challengeMode.icon;
              return (
                <Card 
                  key={challengeMode.id}
                  className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
                  onClick={() => startChallenge(challengeMode.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className="w-5 h-5" />
                      {challengeMode.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{challengeMode.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Elevator View */
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-primary/50 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    <Building2 className="w-4 h-4 mr-2" />
                    Floor {currentFloor}
                  </Badge>
                  <Badge variant="secondary">
                    {CHALLENGE_MODES.find(m => m.id === mode)?.name}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {showImage && (
                    <motion.div
                      key={currentFloor}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="space-y-6"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden border-4 border-border shadow-lg">
                        <img 
                          src={genesisImages[currentFloor - 1]} 
                          alt={`Genesis Chapter ${currentFloor}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold mb-2">Genesis {currentFloor}</p>
                        <p className="text-muted-foreground">Study this image. What story does it tell?</p>
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={goToNextFloor} className="flex-1" size="lg">
                          Next Floor
                          <ChevronUp className="w-4 h-4 ml-2" />
                        </Button>
                        <Button onClick={() => setMode(null)} variant="outline" size="lg">
                          Exit
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
