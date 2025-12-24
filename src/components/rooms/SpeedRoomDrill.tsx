import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Zap, Clock, Play, Send, RefreshCw, Loader2, CheckCircle, 
  XCircle, Trophy, Sparkles, BookOpen, Timer
} from "lucide-react";

// PT Principles/Cards for the drill
const PT_PRINCIPLES = [
  { code: "SR", name: "Story Room", hint: "What story or narrative arc does this verse belong to?" },
  { code: "IR", name: "Imagination Room", hint: "Step inside this scene - what do you see, hear, feel?" },
  { code: "OR", name: "Observation Room", hint: "List specific details you notice in this text" },
  { code: "DC", name: "Def-Com Room", hint: "What Hebrew/Greek word or commentary insight applies?" },
  { code: "ST", name: "Symbols/Types Room", hint: "What symbol or type is present pointing to Christ?" },
  { code: "CR", name: "Concentration Room", hint: "Where is Christ in this verse?" },
  { code: "DR", name: "Dimensions Room", hint: "Apply one dimension: Literal, Christ, Me, Church, or Heaven" },
  { code: "C6", name: "Connect-6 Room", hint: "What genre is this? Prophecy, Parable, Poetry, Gospel, Epistle, History?" },
  { code: "TRm", name: "Theme Room", hint: "Which wall: Sanctuary, Life of Christ, Great Controversy, Time Prophecy?" },
  { code: "PRm", name: "Patterns Room", hint: "What recurring biblical pattern appears here?" },
  { code: "P||", name: "Parallels Room", hint: "What event or action mirrors this across Scripture?" },
  { code: "FRt", name: "Fruit Room", hint: "What spiritual fruit does proper understanding produce?" },
  { code: "BL", name: "Blue/Sanctuary Room", hint: "Which sanctuary article or service connects?" },
  { code: "FE", name: "Feasts Room", hint: "Which biblical feast does this relate to?" },
  { code: "@", name: "Cycles Room", hint: "Which cycle: @Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re?" },
  { code: "123H", name: "Three Heavens Room", hint: "Which horizon: 1H (Babylon), 2H (70AD), 3H (Final)?" },
  { code: "FRm", name: "Fire Room", hint: "What emotional/spiritual conviction does this ignite?" },
  { code: "MR", name: "Meditation Room", hint: "What one truth from this verse to carry today?" },
];

interface SpeedRoomDrillProps {
  onComplete?: (score: number) => void;
}

interface GradeResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export function SpeedRoomDrill({ onComplete }: SpeedRoomDrillProps) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"setup" | "ready" | "active" | "grading" | "result" | "summary">("setup");
  const [verse, setVerse] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [timeLimit, setTimeLimit] = useState<60 | 120 | 180>(120);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentPrinciple, setCurrentPrinciple] = useState<typeof PT_PRINCIPLES[0] | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<{principle: string, score: number, feedback: string}[]>([]);
  const [usedPrinciples, setUsedPrinciples] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "active" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timeRemaining]);

  const handleTimeUp = () => {
    if (answer.trim()) {
      handleSubmitAnswer();
    } else {
      toast.error("Time's up! No answer submitted.");
      setGradeResult({
        score: 0,
        feedback: "Time expired without an answer. Speed requires preparation!",
        strengths: [],
        improvements: ["Practice recalling principles faster", "Start with simpler verses"]
      });
      setPhase("result");
    }
  };

  const getRandomVerse = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { 
          message: "Give me ONE Bible verse for Speed Room practice. Return ONLY the verse reference and text in this exact format:\n\nREFERENCE: [Book Chapter:Verse]\nTEXT: [The verse text]\n\nChoose a verse rich with theological depth for PT application.",
          conversation_history: [],
          mode: "speed_verse"
        }
      });

      if (error) throw error;

      const content = data?.content || "";
      const refMatch = content.match(/REFERENCE:\s*(.+)/i);
      const textMatch = content.match(/TEXT:\s*(.+)/is);
      
      if (refMatch && textMatch) {
        setVerseReference(refMatch[1].trim());
        setVerse(textMatch[1].trim().replace(/\n.*$/s, ''));
      } else {
        // Fallback
        setVerseReference("John 3:16");
        setVerse("For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.");
      }
    } catch (error) {
      console.error("Error getting verse:", error);
      setVerseReference("Romans 8:28");
      setVerse("And we know that all things work together for good to them that love God, to them who are the called according to his purpose.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomPrinciple = () => {
    const available = PT_PRINCIPLES.filter(p => !usedPrinciples.includes(p.code));
    if (available.length === 0) {
      setUsedPrinciples([]);
      return PT_PRINCIPLES[Math.floor(Math.random() * PT_PRINCIPLES.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
  };

  const startDrill = () => {
    const principle = getRandomPrinciple();
    setCurrentPrinciple(principle);
    setUsedPrinciples(prev => [...prev, principle.code]);
    setTimeRemaining(timeLimit);
    setAnswer("");
    setPhase("active");
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !currentPrinciple) return;
    
    setPhase("grading");
    setIsGrading(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { 
          message: `SPEED ROOM GRADING - Grade this Speed Room answer:

VERSE: ${verseReference} - "${verse}"

PRINCIPLE CARD: ${currentPrinciple.code} (${currentPrinciple.name})
PRINCIPLE HINT: ${currentPrinciple.hint}

STUDENT'S ANSWER (written in ${timeLimit} seconds or less):
"${answer}"

TIME LIMIT: ${timeLimit} seconds

Grade this answer on a scale of 0-100 considering:
1. Accuracy - Does the answer correctly apply the principle?
2. Depth - Is there meaningful insight, not just surface level?
3. Speed Context - Given time pressure, is this acceptable?
4. Christ-Centeredness - Does the answer ultimately connect to Christ?

Respond in this EXACT format:
SCORE: [0-100]
FEEDBACK: [2-3 sentence assessment]
STRENGTHS: [comma-separated list of what was done well]
IMPROVEMENTS: [comma-separated list of areas to improve]`,
          conversation_history: [],
          mode: "speed_grade"
        }
      });

      if (error) throw error;

      const content = data?.content || "";
      const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
      const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)(?=STRENGTHS:|$)/is);
      const strengthsMatch = content.match(/STRENGTHS:\s*(.+?)(?=IMPROVEMENTS:|$)/is);
      const improvementsMatch = content.match(/IMPROVEMENTS:\s*(.+?)$/is);

      const result: GradeResult = {
        score: scoreMatch ? parseInt(scoreMatch[1]) : 70,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : "Good effort under time pressure!",
        strengths: strengthsMatch ? strengthsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : ["Completed on time"],
        improvements: improvementsMatch ? improvementsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : ["Continue practicing"]
      };

      setGradeResult(result);
      setTotalScore(prev => prev + result.score);
      setCompletedRounds(prev => [...prev, {
        principle: `${currentPrinciple.code} (${currentPrinciple.name})`,
        score: result.score,
        feedback: result.feedback
      }]);
      setPhase("result");
    } catch (error) {
      console.error("Error grading:", error);
      setGradeResult({
        score: 50,
        feedback: "Unable to grade fully, but you completed the challenge!",
        strengths: ["Submitted an answer"],
        improvements: ["Keep practicing"]
      });
      setPhase("result");
    } finally {
      setIsGrading(false);
    }
  };

  const nextRound = () => {
    if (roundNumber >= 5) {
      setPhase("summary");
      onComplete?.(Math.round(totalScore / 5));
    } else {
      setRoundNumber(prev => prev + 1);
      setGradeResult(null);
      startDrill();
    }
  };

  const resetDrill = () => {
    setPhase("setup");
    setVerse("");
    setVerseReference("");
    setTimeRemaining(0);
    setCurrentPrinciple(null);
    setAnswer("");
    setGradeResult(null);
    setRoundNumber(1);
    setTotalScore(0);
    setCompletedRounds([]);
    setUsedPrinciples([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage > 50) return "text-green-500";
    if (percentage > 25) return "text-yellow-500";
    return "text-red-500 animate-pulse";
  };

  // Setup Phase
  if (phase === "setup") {
    return (
      <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-500" />
            Speed Room Drill
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Test your reflexive PT thinking! You'll receive a verse and a random principle card. 
            Connect them before time runs out. Jeeves will grade your response.
          </p>

          {/* Verse Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Verse</label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input 
                  placeholder="e.g., John 3:16"
                  value={verseReference}
                  onChange={(e) => setVerseReference(e.target.value)}
                />
                <Textarea 
                  placeholder="Enter verse text or let Jeeves pick one..."
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={getRandomVerse}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Getting verse...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Let Jeeves Pick a Verse</>
              )}
            </Button>
          </div>

          {/* Time Limit Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" /> Time Limit Per Card
            </label>
            <div className="flex gap-2">
              {[60, 120, 180].map((time) => (
                <Button
                  key={time}
                  variant={timeLimit === time ? "default" : "outline"}
                  onClick={() => setTimeLimit(time as 60 | 120 | 180)}
                  className="flex-1"
                >
                  {time / 60} min
                </Button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            size="lg"
            disabled={!verse.trim() || !verseReference.trim()}
            onClick={() => setPhase("ready")}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Speed Drill (5 Rounds)
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Ready Phase - Show verse before starting
  if (phase === "ready") {
    return (
      <Card className="border-2 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-amber-500" />
              Round {roundNumber} of 5
            </span>
            <Badge variant="outline">{timeLimit / 60} min per card</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <p className="text-sm font-medium text-primary mb-2">{verseReference}</p>
            <p className="text-lg italic">"{verse}"</p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              When you click start, you'll receive a random principle card.
            </p>
            <p className="text-sm text-muted-foreground">
              Connect the principle to the verse before time runs out!
            </p>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            size="lg"
            onClick={startDrill}
          >
            <Play className="h-5 w-5 mr-2" />
            Draw Card & Start Timer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active Phase - Answer the question
  if (phase === "active" && currentPrinciple) {
    return (
      <Card className="border-2 border-amber-500/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Round {roundNumber}/5</Badge>
            <div className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()}`}>
              <Clock className="h-6 w-6" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          <Progress value={(timeRemaining / timeLimit) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verse */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-primary">{verseReference}</p>
            <p className="text-sm italic">"{verse}"</p>
          </div>

          {/* Principle Card */}
          <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border-2 border-amber-500/50">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-amber-500">{currentPrinciple.code}</Badge>
              <span className="font-bold">{currentPrinciple.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentPrinciple.hint}</p>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Connection:</label>
            <Textarea
              placeholder={`Apply ${currentPrinciple.name} to this verse...`}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="resize-none"
              autoFocus
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmitAnswer}
            disabled={!answer.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Answer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Grading Phase
  if (phase === "grading") {
    return (
      <Card className="border-2 border-primary/30">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Jeeves is grading...</p>
          <p className="text-sm text-muted-foreground">Evaluating your response</p>
        </CardContent>
      </Card>
    );
  }

  // Result Phase
  if (phase === "result" && gradeResult) {
    const isPassing = gradeResult.score >= 60;
    return (
      <Card className={`border-2 ${isPassing ? 'border-green-500/50' : 'border-orange-500/50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isPassing ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-orange-500" />
              )}
              Round {roundNumber} Result
            </span>
            <Badge variant={isPassing ? "default" : "secondary"} className="text-lg px-3 py-1">
              {gradeResult.score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{gradeResult.feedback}</p>

          {gradeResult.strengths.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Strengths:</p>
              <ul className="text-sm space-y-1">
                {gradeResult.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {gradeResult.improvements.length > 0 && (
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Areas to Improve:</p>
              <ul className="text-sm space-y-1">
                {gradeResult.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button className="w-full" onClick={nextRound}>
            {roundNumber >= 5 ? (
              <><Trophy className="h-4 w-4 mr-2" /> See Final Results</>
            ) : (
              <><Zap className="h-4 w-4 mr-2" /> Next Card (Round {roundNumber + 1})</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Summary Phase
  if (phase === "summary") {
    const avgScore = Math.round(totalScore / 5);
    const grade = avgScore >= 90 ? "A" : avgScore >= 80 ? "B" : avgScore >= 70 ? "C" : avgScore >= 60 ? "D" : "F";
    
    return (
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Trophy className="h-8 w-8 text-amber-500" />
            Speed Drill Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{grade}</div>
            <p className="text-xl">Average Score: {avgScore}/100</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Round Breakdown:</p>
            {completedRounds.map((round, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <span className="text-sm">{round.principle}</span>
                <Badge variant={round.score >= 60 ? "default" : "secondary"}>
                  {round.score}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDrill} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              New Drill
            </Button>
            <Button onClick={resetDrill} className="flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Practice Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
