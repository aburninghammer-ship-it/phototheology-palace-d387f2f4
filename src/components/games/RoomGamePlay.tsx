import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Star, Lightbulb, CheckCircle, XCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMastery } from "@/hooks/useMastery";
import { Navigation } from "@/components/Navigation";

interface GameConfig {
  id: string;
  name: string;
  roomId: string;
  roomName: string;
  description: string;
  icon: string;
  xpReward: number;
  difficulty: "easy" | "medium" | "hard";
  gameType: string;
  instructions: string;
  promptTemplate: string;
}

// Game configurations by room and game type
const gameConfigs: Record<string, GameConfig> = {
  // Floor 1 - Story Room
  "sr-sequence": {
    id: "sr-sequence",
    name: "Story Sequence",
    roomId: "sr",
    roomName: "Story Room",
    description: "Arrange Bible stories in chronological order",
    icon: "📖",
    xpReward: 25,
    difficulty: "easy",
    gameType: "sequence",
    instructions: "List 5 Bible stories in their correct chronological order. Explain why each comes before the next.",
    promptTemplate: "validate_story_sequence"
  },
  "sr-beat-builder": {
    id: "sr-beat-builder",
    name: "Beat Builder",
    roomId: "sr",
    roomName: "Story Room",
    description: "Create story beats from narrative passages",
    icon: "🎬",
    xpReward: 30,
    difficulty: "medium",
    gameType: "beats",
    instructions: "Choose a Bible story and break it into 5-7 key story beats (major plot points). Each beat should capture a pivotal moment.",
    promptTemplate: "validate_story_beats"
  },
  // Floor 1 - Imagination Room
  "ir-sense-finder": {
    id: "ir-sense-finder",
    name: "Sense Finder",
    roomId: "ir",
    roomName: "Imagination Room",
    description: "Identify all 5 senses in a passage",
    icon: "🎭",
    xpReward: 25,
    difficulty: "easy",
    gameType: "senses",
    instructions: "Choose a Bible scene and describe what you would SEE, HEAR, SMELL, TASTE, and TOUCH if you were there.",
    promptTemplate: "validate_senses"
  },
  "ir-empathy-walk": {
    id: "ir-empathy-walk",
    name: "Empathy Walk",
    roomId: "ir",
    roomName: "Imagination Room",
    description: "Step into a biblical character's shoes",
    icon: "👣",
    xpReward: 45,
    difficulty: "hard",
    gameType: "empathy",
    instructions: "Choose a biblical character in a key moment. Describe their thoughts, emotions, fears, and hopes from their perspective.",
    promptTemplate: "validate_empathy"
  },
  // Floor 2 - Observation Room
  "or-fingerprint": {
    id: "or-fingerprint",
    name: "Fingerprint Logger",
    roomId: "or",
    roomName: "Observation Room",
    description: "Catalog observations without interpretation",
    icon: "🔎",
    xpReward: 25,
    difficulty: "easy",
    gameType: "observations",
    instructions: "Read a passage and list 15+ observations (what you SEE in the text). No interpretations - just facts!",
    promptTemplate: "validate_observations"
  },
  "or-30": {
    id: "or-30",
    name: "30 Observations",
    roomId: "or",
    roomName: "Observation Room",
    description: "Generate 30 observations from one text",
    icon: "📝",
    xpReward: 50,
    difficulty: "hard",
    gameType: "observations_30",
    instructions: "Choose a short passage (5-10 verses) and generate exactly 30 distinct observations. No interpretations!",
    promptTemplate: "validate_observations_30"
  },
  // Floor 2 - Questions Room
  "qr-75": {
    id: "qr-75",
    name: "75 Questions",
    roomId: "qr",
    roomName: "Questions Room",
    description: "Generate 75 questions from one passage",
    icon: "🤔",
    xpReward: 55,
    difficulty: "hard",
    gameType: "questions_75",
    instructions: "Choose a passage and generate 75 questions: 25 intratextual (within text), 25 intertextual (cross-reference), 25 Phototheological (PT framework).",
    promptTemplate: "validate_questions_75"
  },
  // Floor 3 - Nature Freestyle
  "nf-parable": {
    id: "nf-parable",
    name: "Nature Parable",
    roomId: "nf",
    roomName: "Nature Freestyle",
    description: "Turn natural objects into spiritual lessons",
    icon: "🍃",
    xpReward: 35,
    difficulty: "medium",
    gameType: "nature_parable",
    instructions: "Choose something from nature (tree, water, light, etc.) and create a spiritual parable from it, like Jesus did.",
    promptTemplate: "validate_nature_parable"
  },
  // Floor 4 - Christ Room
  "cr-emmaus": {
    id: "cr-emmaus",
    name: "Emmaus Walk",
    roomId: "cr",
    roomName: "Concentration Room",
    description: "All Scripture points to Him",
    icon: "🚶",
    xpReward: 40,
    difficulty: "medium",
    gameType: "christ_centered",
    instructions: "Take any OT passage and explain how it points to Christ. Show the connection clearly.",
    promptTemplate: "validate_christ_centered"
  },
  // Floor 4 - Dimensions Room
  "dr-prism": {
    id: "dr-prism",
    name: "Prism Study",
    roomId: "dr",
    roomName: "Dimensions Room",
    description: "Refract one verse into 5 meanings",
    icon: "💎",
    xpReward: 55,
    difficulty: "hard",
    gameType: "five_dimensions",
    instructions: "Take one verse and explain it through all 5 dimensions: Literal, Christ, Me, Church, Heaven.",
    promptTemplate: "validate_five_dimensions"
  },
  // Floor 5 - Sanctuary
  "bl-journey": {
    id: "bl-journey",
    name: "Sanctuary Journey",
    roomId: "bl",
    roomName: "Blue Room (Sanctuary)",
    description: "Walk through the sanctuary stations",
    icon: "⛪",
    xpReward: 50,
    difficulty: "hard",
    gameType: "sanctuary_journey",
    instructions: "Trace the gospel through all sanctuary stations: Altar, Laver, Lampstand, Showbread, Incense, Ark. Explain each step.",
    promptTemplate: "validate_sanctuary_journey"
  },
  // Floor 7 - Fire Room
  "frm-burn": {
    id: "frm-burn",
    name: "Heart Fire",
    roomId: "frm",
    roomName: "Fire Room",
    description: "Let Scripture burn in your heart",
    icon: "🔥",
    xpReward: 40,
    difficulty: "medium",
    gameType: "heart_fire",
    instructions: "Choose a passage that moves you deeply. Write what it stirs in your heart - conviction, comfort, challenge, or change.",
    promptTemplate: "validate_heart_fire"
  },
};

export function RoomGamePlay() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; feedback: string; score: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);

  const game = gameId ? gameConfigs[gameId] : null;
  const { awardXp } = useMastery(game?.roomId || "", 1);

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Game Not Found</h1>
          <p className="text-muted-foreground mb-6">This game type is not yet implemented.</p>
          <Link to="/games">
            <Button><ArrowLeft className="mr-2 h-4 w-4" />Back to Games</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      toast.error("Please enter your response");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "validate_room_game",
          gameType: game.gameType,
          roomId: game.roomId,
          roomName: game.roomName,
          userInput,
          verseReference,
          difficulty: game.difficulty,
          instructions: game.instructions,
        }
      });

      if (error) throw error;

      const isValid = data.valid ?? (data.quality === "excellent" || data.quality === "good");
      const gameResult = {
        valid: isValid,
        feedback: data.feedback || "Good attempt!",
        score: data.score ?? (isValid ? game.xpReward : Math.floor(game.xpReward / 3))
      };

      setResult(gameResult);
      setTotalScore(prev => prev + gameResult.score);
      setRoundsPlayed(prev => prev + 1);

      if (gameResult.valid) {
        toast.success(`Excellent! +${gameResult.score} XP`);
        awardXp({ xpAmount: gameResult.score, exerciseCompleted: true });
      } else {
        toast.info("Keep practicing!");
      }
    } catch (error) {
      console.error("Game validation error:", error);
      toast.error("Failed to validate. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextRound = () => {
    setUserInput("");
    setVerseReference("");
    setResult(null);
  };

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-700 dark:text-green-300",
    medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    hard: "bg-red-500/20 text-red-700 dark:text-red-300"
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Game Header */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{game.icon}</span>
                  <div>
                    <CardTitle className="text-2xl">{game.name}</CardTitle>
                    <CardDescription>{game.roomName}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={difficultyColors[game.difficulty]}>{game.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    +{game.xpReward} XP
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Score Display */}
          {roundsPlayed > 0 && (
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Session Progress</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Rounds: {roundsPlayed}</span>
                    <span className="font-bold text-lg flex items-center gap-1">
                      <Star className="h-5 w-5 text-amber-500" />
                      {totalScore} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{game.instructions}</p>
            </CardContent>
          </Card>

          {/* Input Area */}
          {!result ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Verse/Passage Reference (optional)
                  </label>
                  <Input
                    value={verseReference}
                    onChange={(e) => setVerseReference(e.target.value)}
                    placeholder="e.g., Genesis 1:1-5 or John 3:16"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Your Answer
                  </label>
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response here..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !userInput.trim()}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className={result.valid ? "border-green-500/50" : "border-yellow-500/50"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.valid ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-yellow-500" />
                  )}
                  {result.valid ? "Excellent Work!" : "Keep Growing!"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Jeeves says:</p>
                  <p className="text-muted-foreground">{result.feedback}</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <span className="font-medium">XP Earned:</span>
                  <span className="text-xl font-bold text-primary">+{result.score}</span>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleNextRound} className="flex-1">
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    Back to Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomGamePlay;
