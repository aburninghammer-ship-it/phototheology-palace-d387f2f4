import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Swords, Trophy, Star, BookOpen, Brain, User, Users, Dna, RefreshCw, Save, HelpCircle, Eye, ArrowRight, Crown, Zap, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface VerseGeneticsArenaProps {
  roomId: string;
  roomName: string;
}

interface ChallengeData {
  verse1: { reference: string; text: string };
  verse2: { reference: string; text: string };
  difficulty: "beginner" | "intermediate" | "difficult";
  hint?: string;
  geneticLink?: string;
}

interface EvaluationResult {
  score: number;
  breakdown: {
    accuracy: number;
    depth: number;
    creativity: number;
    christCenteredness: number;
  };
  feedback: string;
  correctConnection: string;
  relatedVerses?: string[];
}

type GameMode = "solo_challenge" | "pvp" | "vs_jeeves";
type VsJeevesTurn = "player_challenge" | "player_answer" | "jeeves_challenge" | "jeeves_answer";

interface PvPGameState {
  phase: "setup" | "p1_challenge" | "p2_answer" | "p2_challenge" | "p1_answer" | "results";
  player1Name: string;
  player2Name: string;
  p1Challenge: { verse1: string; verse2: string } | null;
  p2Challenge: { verse1: string; verse2: string } | null;
  p1Answer: string;
  p2Answer: string;
  p1Score: number;
  p2Score: number;
  p1Evaluation: EvaluationResult | null;
  p2Evaluation: EvaluationResult | null;
  round: number;
}

interface VsJeevesGameState {
  turn: VsJeevesTurn;
  round: number;
  playerScore: number;
  jeevesScore: number;
  playerChallenge: { verse1: string; verse2: string } | null;
  jeevesChallenge: ChallengeData | null;
  playerAnswer: string;
  jeevesAnswer: string;
  playerEvaluation: EvaluationResult | null;
  jeevesEvaluation: EvaluationResult | null;
  difficulty: "beginner" | "intermediate" | "difficult";
}

export const VerseGeneticsArena = ({ roomId, roomName }: VerseGeneticsArenaProps) => {
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<GameMode>("solo_challenge");
  
  // Solo Challenge State (existing)
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [showGeneticLink, setShowGeneticLink] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "difficult">("beginner");

  // PvP State
  const [pvpState, setPvPState] = useState<PvPGameState>({
    phase: "setup",
    player1Name: "",
    player2Name: "",
    p1Challenge: null,
    p2Challenge: null,
    p1Answer: "",
    p2Answer: "",
    p1Score: 0,
    p2Score: 0,
    p1Evaluation: null,
    p2Evaluation: null,
    round: 1
  });
  const [pvpVerse1Input, setPvpVerse1Input] = useState("");
  const [pvpVerse2Input, setPvpVerse2Input] = useState("");
  const [pvpAnswerInput, setPvpAnswerInput] = useState("");
  const [isPvpEvaluating, setIsPvpEvaluating] = useState(false);

  // Vs Jeeves State
  const [vsJeevesState, setVsJeevesState] = useState<VsJeevesGameState>({
    turn: "player_challenge",
    round: 1,
    playerScore: 0,
    jeevesScore: 0,
    playerChallenge: null,
    jeevesChallenge: null,
    playerAnswer: "",
    jeevesAnswer: "",
    playerEvaluation: null,
    jeevesEvaluation: null,
    difficulty: "intermediate"
  });
  const [vsJeevesVerse1, setVsJeevesVerse1] = useState("");
  const [vsJeevesVerse2, setVsJeevesVerse2] = useState("");
  const [vsJeevesAnswer, setVsJeevesAnswer] = useState("");
  const [isVsJeevesProcessing, setIsVsJeevesProcessing] = useState(false);

  // Helper functions
  const getDifficultyColor = (level: "beginner" | "intermediate" | "difficult") => {
    const colors = { beginner: "text-green-500", intermediate: "text-amber-500", difficult: "text-red-500" };
    return colors[level];
  };

  const getDifficultyBg = (level: "beginner" | "intermediate" | "difficult") => {
    const bgs = { beginner: "bg-green-500/10 border-green-500/30", intermediate: "bg-amber-500/10 border-amber-500/30", difficult: "bg-red-500/10 border-red-500/30" };
    return bgs[level];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-orange-500";
  };

  // ========== SOLO CHALLENGE FUNCTIONS ==========
  const generateChallenge = async (difficulty: "beginner" | "intermediate" | "difficult") => {
    setIsGeneratingChallenge(true);
    setChallenge(null);
    setUserAnswer("");
    setEvaluation(null);
    setShowHint(false);
    setHintCount(0);
    setShowGeneticLink(false);
    setSelectedDifficulty(difficulty);
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { mode: "generate_challenge", difficulty }
      });
      
      if (error) throw error;
      
      if (data.verse1 && data.verse2) {
        setChallenge({
          verse1: data.verse1,
          verse2: data.verse2,
          difficulty,
          hint: data.hint,
          geneticLink: data.connection
        });
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({ title: "Error", description: "Failed to generate challenge.", variant: "destructive" });
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  const submitSoloAnswer = async () => {
    if (!userAnswer.trim() || !challenge) return;
    setIsEvaluating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "evaluate_answer",
          verse1: challenge.verse1,
          verse2: challenge.verse2,
          userAnswer: userAnswer.trim(),
          difficulty: challenge.difficulty
        }
      });
      
      if (error) throw error;
      
      if (data.score !== undefined) {
        const hintPenalty = hintCount * 15;
        const finalScore = Math.max(0, data.score - hintPenalty);
        setEvaluation({ ...data, score: finalScore });
        setTotalScore(prev => prev + finalScore);
      }
    } catch (error) {
      console.error("Error evaluating:", error);
      toast({ title: "Error", description: "Failed to evaluate.", variant: "destructive" });
    } finally {
      setIsEvaluating(false);
    }
  };

  // ========== PVP FUNCTIONS ==========
  const startPvPGame = () => {
    if (!pvpState.player1Name.trim() || !pvpState.player2Name.trim()) {
      toast({ title: "Enter both names", variant: "destructive" });
      return;
    }
    setPvPState(prev => ({ ...prev, phase: "p1_challenge" }));
  };

  const submitPvPChallenge = (player: 1 | 2) => {
    if (!pvpVerse1Input.trim() || !pvpVerse2Input.trim()) {
      toast({ title: "Enter both verses", variant: "destructive" });
      return;
    }
    
    const challengeData = { verse1: pvpVerse1Input.trim(), verse2: pvpVerse2Input.trim() };
    
    if (player === 1) {
      setPvPState(prev => ({ ...prev, p1Challenge: challengeData, phase: "p2_answer" }));
    } else {
      setPvPState(prev => ({ ...prev, p2Challenge: challengeData, phase: "p1_answer" }));
    }
    
    setPvpVerse1Input("");
    setPvpVerse2Input("");
    toast({ title: `${player === 1 ? pvpState.player1Name : pvpState.player2Name}'s challenge set!`, description: "Pass the device to the other player." });
  };

  const submitPvPAnswer = async (player: 1 | 2) => {
    if (!pvpAnswerInput.trim()) {
      toast({ title: "Enter your answer", variant: "destructive" });
      return;
    }
    
    setIsPvpEvaluating(true);
    
    try {
      const challengeToAnswer = player === 1 ? pvpState.p2Challenge : pvpState.p1Challenge;
      if (!challengeToAnswer) return;
      
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "evaluate_pvp_answer",
          verse1: challengeToAnswer.verse1,
          verse2: challengeToAnswer.verse2,
          userAnswer: pvpAnswerInput.trim()
        }
      });
      
      if (error) throw error;
      
      if (player === 1) {
        setPvPState(prev => ({
          ...prev,
          p1Answer: pvpAnswerInput.trim(),
          p1Evaluation: data,
          p1Score: prev.p1Score + (data.score || 0),
          phase: prev.p2Evaluation ? "results" : "p2_challenge"
        }));
      } else {
        setPvPState(prev => ({
          ...prev,
          p2Answer: pvpAnswerInput.trim(),
          p2Evaluation: data,
          p2Score: prev.p2Score + (data.score || 0),
          phase: prev.p1Evaluation ? "results" : "p1_answer"
        }));
      }
      
      setPvpAnswerInput("");
    } catch (error) {
      console.error("Error evaluating PvP:", error);
      toast({ title: "Error", description: "Failed to evaluate.", variant: "destructive" });
    } finally {
      setIsPvpEvaluating(false);
    }
  };

  const resetPvP = () => {
    setPvPState({
      phase: "setup",
      player1Name: "",
      player2Name: "",
      p1Challenge: null,
      p2Challenge: null,
      p1Answer: "",
      p2Answer: "",
      p1Score: 0,
      p2Score: 0,
      p1Evaluation: null,
      p2Evaluation: null,
      round: 1
    });
  };

  // ========== VS JEEVES FUNCTIONS ==========
  const startVsJeeves = (difficulty: "beginner" | "intermediate" | "difficult") => {
    setVsJeevesState({
      turn: "player_challenge",
      round: 1,
      playerScore: 0,
      jeevesScore: 0,
      playerChallenge: null,
      jeevesChallenge: null,
      playerAnswer: "",
      jeevesAnswer: "",
      playerEvaluation: null,
      jeevesEvaluation: null,
      difficulty
    });
  };

  const submitPlayerChallengeToJeeves = async () => {
    if (!vsJeevesVerse1.trim() || !vsJeevesVerse2.trim()) {
      toast({ title: "Enter both verses", variant: "destructive" });
      return;
    }
    
    setIsVsJeevesProcessing(true);
    const challengeData = { verse1: vsJeevesVerse1.trim(), verse2: vsJeevesVerse2.trim() };
    
    try {
      // Jeeves answers the player's challenge
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "jeeves_answers_challenge",
          verse1: challengeData.verse1,
          verse2: challengeData.verse2,
          difficulty: vsJeevesState.difficulty
        }
      });
      
      if (error) throw error;
      
      setVsJeevesState(prev => ({
        ...prev,
        playerChallenge: challengeData,
        jeevesAnswer: data.answer,
        jeevesEvaluation: data.evaluation,
        jeevesScore: prev.jeevesScore + (data.evaluation?.score || 0),
        turn: "jeeves_challenge"
      }));
      
      setVsJeevesVerse1("");
      setVsJeevesVerse2("");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to process.", variant: "destructive" });
    } finally {
      setIsVsJeevesProcessing(false);
    }
  };

  const getJeevesChallenge = async () => {
    setIsVsJeevesProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { mode: "generate_challenge", difficulty: vsJeevesState.difficulty }
      });
      
      if (error) throw error;
      
      setVsJeevesState(prev => ({
        ...prev,
        jeevesChallenge: {
          verse1: data.verse1,
          verse2: data.verse2,
          difficulty: prev.difficulty,
          hint: data.hint,
          geneticLink: data.connection
        },
        turn: "player_answer"
      }));
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to get challenge.", variant: "destructive" });
    } finally {
      setIsVsJeevesProcessing(false);
    }
  };

  const submitPlayerAnswerVsJeeves = async () => {
    if (!vsJeevesAnswer.trim() || !vsJeevesState.jeevesChallenge) return;
    
    setIsVsJeevesProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "evaluate_answer",
          verse1: vsJeevesState.jeevesChallenge.verse1,
          verse2: vsJeevesState.jeevesChallenge.verse2,
          userAnswer: vsJeevesAnswer.trim(),
          difficulty: vsJeevesState.difficulty
        }
      });
      
      if (error) throw error;
      
      setVsJeevesState(prev => ({
        ...prev,
        playerAnswer: vsJeevesAnswer.trim(),
        playerEvaluation: data,
        playerScore: prev.playerScore + (data.score || 0),
        round: prev.round + 1,
        turn: "player_challenge"
      }));
      
      setVsJeevesAnswer("");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to evaluate.", variant: "destructive" });
    } finally {
      setIsVsJeevesProcessing(false);
    }
  };

  const resetVsJeeves = () => {
    setVsJeevesState({
      turn: "player_challenge",
      round: 1,
      playerScore: 0,
      jeevesScore: 0,
      playerChallenge: null,
      jeevesChallenge: null,
      playerAnswer: "",
      jeevesAnswer: "",
      playerEvaluation: null,
      jeevesEvaluation: null,
      difficulty: "intermediate"
    });
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
            <Dna className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">🧬 Verse Genetics Arena</CardTitle>
            <CardDescription>Challenge others or Jeeves to find hidden Scripture connections!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={gameMode} onValueChange={(v) => setGameMode(v as GameMode)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="solo_challenge" className="gap-2">
              <Brain className="h-4 w-4" />
              Solo Challenge
            </TabsTrigger>
            <TabsTrigger value="pvp" className="gap-2">
              <Users className="h-4 w-4" />
              Player vs Player
            </TabsTrigger>
            <TabsTrigger value="vs_jeeves" className="gap-2">
              <Swords className="h-4 w-4" />
              vs Jeeves
            </TabsTrigger>
          </TabsList>

          {/* SOLO CHALLENGE MODE */}
          <TabsContent value="solo_challenge" className="space-y-4">
            {!challenge ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧬</div>
                <h3 className="text-xl font-bold mb-2">Solo Verse Genetics Challenge</h3>
                <p className="text-muted-foreground mb-6">Jeeves gives you two verses. Find their hidden genetic link!</p>
                
                {currentRound > 1 && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Score</div>
                    <div className="text-3xl font-bold text-primary">{totalScore} pts</div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["beginner", "intermediate", "difficult"] as const).map(diff => (
                    <Button 
                      key={diff}
                      onClick={() => generateChallenge(diff)} 
                      disabled={isGeneratingChallenge}
                      variant="outline"
                      className={`flex-col h-auto py-4 ${getDifficultyBg(diff)}`}
                    >
                      <span className={`text-lg font-bold ${getDifficultyColor(diff)}`}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </span>
                    </Button>
                  ))}
                </div>
                
                {isGeneratingChallenge && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mt-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Jeeves is selecting verses...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">Round {currentRound}</Badge>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</Badge>
                  <Badge variant="secondary">Score: {totalScore}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{challenge.verse1.reference}</span>
                    </div>
                    <p className="text-sm italic">"{challenge.verse1.text}"</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span className="font-semibold">{challenge.verse2.reference}</span>
                    </div>
                    <p className="text-sm italic">"{challenge.verse2.text}"</p>
                  </div>
                </div>

                {!evaluation && challenge.hint && !showHint && (
                  <Button variant="ghost" size="sm" onClick={() => { setShowHint(true); setHintCount(1); }} className="text-muted-foreground gap-2">
                    <HelpCircle className="h-4 w-4" /> Need Help? (-15 pts)
                  </Button>
                )}
                
                {showHint && challenge.hint && !evaluation && (
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm italic">💡 <strong>Hint:</strong> {challenge.hint}</p>
                  </div>
                )}

                {!evaluation ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="What's the hidden genetic link?"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <Button onClick={submitSoloAnswer} disabled={!userAnswer.trim() || isEvaluating} className="w-full gap-2">
                      {isEvaluating ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</> : <><Trophy className="h-4 w-4" /> Submit</>}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-background/50 rounded-xl border">
                      <div className={`text-5xl font-black mb-2 ${getScoreColor(evaluation.score)}`}>{evaluation.score}/100</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Accuracy", value: evaluation.breakdown.accuracy, icon: "🎯" },
                        { label: "Depth", value: evaluation.breakdown.depth, icon: "📖" },
                        { label: "Creativity", value: evaluation.breakdown.creativity, icon: "💡" },
                        { label: "Christ-Centered", value: evaluation.breakdown.christCenteredness, icon: "✝️" },
                      ].map((item) => (
                        <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                          </div>
                          <Progress value={(item.value / 25) * 100} className="h-2" />
                          <div className="text-right text-xs mt-1 text-muted-foreground">{item.value}/25</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg space-y-3">
                      <div>
                        <h5 className="font-semibold mb-1">Feedback:</h5>
                        <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
                      </div>
                      
                      {evaluation.score >= 70 ? (
                        <div>
                          <h5 className="font-semibold mb-1 text-green-600">🧬 The Genetic Link:</h5>
                          <p className="text-sm">{evaluation.correctConnection}</p>
                        </div>
                      ) : !showGeneticLink ? (
                        <Button variant="outline" onClick={() => setShowGeneticLink(true)} className="w-full gap-2 border-dashed">
                          <Eye className="h-4 w-4" /> Reveal the Genetic Link
                        </Button>
                      ) : (
                        <div>
                          <h5 className="font-semibold mb-1 text-amber-600">🧬 The Genetic Link (Revealed):</h5>
                          <p className="text-sm">{evaluation.correctConnection}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => { setCurrentRound(r => r + 1); generateChallenge(selectedDifficulty); }} className="flex-1 gap-2">
                        <Sparkles className="h-4 w-4" /> Next Round
                      </Button>
                      <Button variant="outline" onClick={() => { setCurrentRound(1); setTotalScore(0); setChallenge(null); setEvaluation(null); }}>
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* PVP MODE */}
          <TabsContent value="pvp" className="space-y-4">
            {pvpState.phase === "setup" && (
              <div className="text-center py-8 space-y-6">
                <div className="text-6xl mb-4">⚔️</div>
                <h3 className="text-xl font-bold">Player vs Player</h3>
                <p className="text-muted-foreground">Challenge each other with verse pairs. Jeeves judges who finds the best connection!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player 1 Name</label>
                    <Input
                      placeholder="Enter name"
                      value={pvpState.player1Name}
                      onChange={(e) => setPvPState(prev => ({ ...prev, player1Name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player 2 Name</label>
                    <Input
                      placeholder="Enter name"
                      value={pvpState.player2Name}
                      onChange={(e) => setPvPState(prev => ({ ...prev, player2Name: e.target.value }))}
                    />
                  </div>
                </div>
                
                <Button onClick={startPvPGame} disabled={!pvpState.player1Name.trim() || !pvpState.player2Name.trim()} className="gap-2">
                  <Swords className="h-4 w-4" /> Start Battle
                </Button>
              </div>
            )}

            {pvpState.phase === "p1_challenge" && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    {pvpState.player1Name}'s Turn: Set a Challenge
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Pick two seemingly unrelated verses for {pvpState.player2Name} to connect.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Verse 1 (e.g., Genesis 3:15)" value={pvpVerse1Input} onChange={(e) => setPvpVerse1Input(e.target.value)} />
                  <Input placeholder="Verse 2 (e.g., Revelation 12:17)" value={pvpVerse2Input} onChange={(e) => setPvpVerse2Input(e.target.value)} />
                </div>
                
                <Button onClick={() => submitPvPChallenge(1)} disabled={!pvpVerse1Input.trim() || !pvpVerse2Input.trim()} className="w-full gap-2">
                  <ArrowRight className="h-4 w-4" /> Set Challenge & Pass to {pvpState.player2Name}
                </Button>
              </div>
            )}

            {pvpState.phase === "p2_answer" && pvpState.p1Challenge && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    {pvpState.player2Name}'s Turn: Find the Connection
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">{pvpState.player1Name} challenges you with these verses:</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl border">
                    <span className="font-semibold">{pvpState.p1Challenge.verse1}</span>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-xl border">
                    <span className="font-semibold">{pvpState.p1Challenge.verse2}</span>
                  </div>
                </div>
                
                <Textarea
                  placeholder="What's the genetic connection between these verses?"
                  value={pvpAnswerInput}
                  onChange={(e) => setPvpAnswerInput(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <Button onClick={() => submitPvPAnswer(2)} disabled={!pvpAnswerInput.trim() || isPvpEvaluating} className="w-full gap-2">
                  {isPvpEvaluating ? <><Loader2 className="h-4 w-4 animate-spin" /> Jeeves is scoring...</> : <><Trophy className="h-4 w-4" /> Submit Answer</>}
                </Button>
              </div>
            )}

            {pvpState.phase === "p2_challenge" && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    {pvpState.player2Name}'s Turn: Set a Challenge
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Pick two verses for {pvpState.player1Name} to connect.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Verse 1" value={pvpVerse1Input} onChange={(e) => setPvpVerse1Input(e.target.value)} />
                  <Input placeholder="Verse 2" value={pvpVerse2Input} onChange={(e) => setPvpVerse2Input(e.target.value)} />
                </div>
                
                <Button onClick={() => submitPvPChallenge(2)} disabled={!pvpVerse1Input.trim() || !pvpVerse2Input.trim()} className="w-full gap-2">
                  <ArrowRight className="h-4 w-4" /> Set Challenge & Pass to {pvpState.player1Name}
                </Button>
              </div>
            )}

            {pvpState.phase === "p1_answer" && pvpState.p2Challenge && (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-xl border border-blue-500/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    {pvpState.player1Name}'s Turn: Find the Connection
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl border">
                    <span className="font-semibold">{pvpState.p2Challenge.verse1}</span>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-xl border">
                    <span className="font-semibold">{pvpState.p2Challenge.verse2}</span>
                  </div>
                </div>
                
                <Textarea
                  placeholder="What's the genetic connection?"
                  value={pvpAnswerInput}
                  onChange={(e) => setPvpAnswerInput(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <Button onClick={() => submitPvPAnswer(1)} disabled={!pvpAnswerInput.trim() || isPvpEvaluating} className="w-full gap-2">
                  {isPvpEvaluating ? <><Loader2 className="h-4 w-4 animate-spin" /> Scoring...</> : <><Trophy className="h-4 w-4" /> Submit</>}
                </Button>
              </div>
            )}

            {pvpState.phase === "results" && (
              <div className="space-y-6 text-center py-8">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold">Round Results</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className={`p-6 rounded-xl border-2 ${pvpState.p1Score > pvpState.p2Score ? 'border-green-500 bg-green-500/10' : 'border-muted bg-muted/30'}`}>
                    <div className="text-lg font-bold">{pvpState.player1Name}</div>
                    <div className="text-4xl font-black text-primary">{pvpState.p1Score}</div>
                    {pvpState.p1Score > pvpState.p2Score && <Crown className="h-6 w-6 text-amber-500 mx-auto mt-2" />}
                  </div>
                  <div className={`p-6 rounded-xl border-2 ${pvpState.p2Score > pvpState.p1Score ? 'border-green-500 bg-green-500/10' : 'border-muted bg-muted/30'}`}>
                    <div className="text-lg font-bold">{pvpState.player2Name}</div>
                    <div className="text-4xl font-black text-primary">{pvpState.p2Score}</div>
                    {pvpState.p2Score > pvpState.p1Score && <Crown className="h-6 w-6 text-amber-500 mx-auto mt-2" />}
                  </div>
                </div>
                
                <Button onClick={resetPvP} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Play Again
                </Button>
              </div>
            )}
          </TabsContent>

          {/* VS JEEVES MODE */}
          <TabsContent value="vs_jeeves" className="space-y-4">
            {vsJeevesState.round === 1 && vsJeevesState.turn === "player_challenge" && !vsJeevesState.playerChallenge && (
              <div className="text-center py-8 space-y-6">
                <div className="text-6xl mb-4">🤖⚔️👤</div>
                <h3 className="text-xl font-bold">You vs Jeeves</h3>
                <p className="text-muted-foreground">Take turns challenging each other. Can you stump Jeeves? Can Jeeves stump you?</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {(["beginner", "intermediate", "difficult"] as const).map(diff => (
                    <Button 
                      key={diff}
                      onClick={() => startVsJeeves(diff)} 
                      variant="outline"
                      className={`flex-col h-auto py-4 ${getDifficultyBg(diff)}`}
                    >
                      <span className={`text-lg font-bold ${getDifficultyColor(diff)}`}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {vsJeevesState.round >= 1 && vsJeevesState.turn === "player_challenge" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Badge variant="outline">Round {vsJeevesState.round}</Badge>
                  <div className="flex gap-4">
                    <span className="text-sm">You: <strong className="text-primary">{vsJeevesState.playerScore}</strong></span>
                    <span className="text-sm">Jeeves: <strong className="text-accent">{vsJeevesState.jeevesScore}</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Your Turn: Challenge Jeeves
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Give Jeeves two verses to connect. Try to stump him!</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Verse 1" value={vsJeevesVerse1} onChange={(e) => setVsJeevesVerse1(e.target.value)} />
                  <Input placeholder="Verse 2" value={vsJeevesVerse2} onChange={(e) => setVsJeevesVerse2(e.target.value)} />
                </div>
                
                <Button onClick={submitPlayerChallengeToJeeves} disabled={!vsJeevesVerse1.trim() || !vsJeevesVerse2.trim() || isVsJeevesProcessing} className="w-full gap-2">
                  {isVsJeevesProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Jeeves is thinking...</> : <><Swords className="h-4 w-4" /> Challenge Jeeves</>}
                </Button>
              </div>
            )}

            {vsJeevesState.turn === "jeeves_challenge" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Badge variant="outline">Round {vsJeevesState.round}</Badge>
                  <div className="flex gap-4">
                    <span className="text-sm">You: <strong className="text-primary">{vsJeevesState.playerScore}</strong></span>
                    <span className="text-sm">Jeeves: <strong className="text-accent">{vsJeevesState.jeevesScore}</strong></span>
                  </div>
                </div>

                {vsJeevesState.jeevesAnswer && (
                  <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                    <h5 className="font-semibold mb-2">🤖 Jeeves' Answer to Your Challenge:</h5>
                    <p className="text-sm">{vsJeevesState.jeevesAnswer}</p>
                    {vsJeevesState.jeevesEvaluation && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Score: <strong className={getScoreColor(vsJeevesState.jeevesEvaluation.score)}>{vsJeevesState.jeevesEvaluation.score}/100</strong>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    Jeeves' Turn: He Challenges You
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">Now Jeeves picks verses for YOU to connect.</p>
                </div>
                
                <Button onClick={getJeevesChallenge} disabled={isVsJeevesProcessing} className="w-full gap-2">
                  {isVsJeevesProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Get Jeeves' Challenge</>}
                </Button>
              </div>
            )}

            {vsJeevesState.turn === "player_answer" && vsJeevesState.jeevesChallenge && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <Badge variant="outline">Round {vsJeevesState.round}</Badge>
                  <div className="flex gap-4">
                    <span className="text-sm">You: <strong className="text-primary">{vsJeevesState.playerScore}</strong></span>
                    <span className="text-sm">Jeeves: <strong className="text-accent">{vsJeevesState.jeevesScore}</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Jeeves Challenges You!
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-xl border">
                    <div className="font-semibold">{vsJeevesState.jeevesChallenge.verse1.reference}</div>
                    <p className="text-sm italic mt-1">"{vsJeevesState.jeevesChallenge.verse1.text}"</p>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-xl border">
                    <div className="font-semibold">{vsJeevesState.jeevesChallenge.verse2.reference}</div>
                    <p className="text-sm italic mt-1">"{vsJeevesState.jeevesChallenge.verse2.text}"</p>
                  </div>
                </div>
                
                <Textarea
                  placeholder="What's the genetic link Jeeves is looking for?"
                  value={vsJeevesAnswer}
                  onChange={(e) => setVsJeevesAnswer(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <Button onClick={submitPlayerAnswerVsJeeves} disabled={!vsJeevesAnswer.trim() || isVsJeevesProcessing} className="w-full gap-2">
                  {isVsJeevesProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</> : <><Trophy className="h-4 w-4" /> Submit Answer</>}
                </Button>
              </div>
            )}

            {vsJeevesState.round > 1 && vsJeevesState.turn === "player_challenge" && vsJeevesState.playerEvaluation && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <h5 className="font-semibold mb-2">📊 Last Round Results:</h5>
                  <p className="text-sm text-muted-foreground">{vsJeevesState.playerEvaluation.feedback}</p>
                  <div className="mt-2">
                    Your score: <strong className={getScoreColor(vsJeevesState.playerEvaluation.score)}>{vsJeevesState.playerEvaluation.score}/100</strong>
                  </div>
                  {vsJeevesState.playerEvaluation.correctConnection && (
                    <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                      <strong>The Genetic Link:</strong> {vsJeevesState.playerEvaluation.correctConnection}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={resetVsJeeves} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> New Game
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
