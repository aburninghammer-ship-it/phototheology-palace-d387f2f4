import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Swords, Trophy, Star, BookOpen, Brain, User, Dna } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface BibleFreestyleGameProps {
  roomId: string;
  roomName: string;
}

interface ChallengeData {
  verse1: { reference: string; text: string };
  verse2: { reference: string; text: string };
  difficulty: number;
  hint?: string;
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

export const BibleFreestyleGame = ({ roomId, roomName }: BibleFreestyleGameProps) => {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<"test" | "challenge" | "solo">("test");
  
  // Test Jeeves mode state
  const [testVerse1, setTestVerse1] = useState("");
  const [testVerse2, setTestVerse2] = useState("");
  const [jeevesConnection, setJeevesConnection] = useState("");
  const [isTestingJeeves, setIsTestingJeeves] = useState(false);
  
  // Challenge mode state
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isGeneratingChallenge, setIsGeneratingChallenge] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  
  // Solo mode state
  const [soloVerse1, setSoloVerse1] = useState("");
  const [soloVerse2, setSoloVerse2] = useState("");
  const [soloNotes, setSoloNotes] = useState("");
  const [savedConnections, setSavedConnections] = useState<Array<{
    verse1: string;
    verse2: string;
    notes: string;
    timestamp: Date;
  }>>([]);

  const testJeeves = async () => {
    if (!testVerse1.trim() || !testVerse2.trim()) {
      toast({
        title: "Two verses required",
        description: "Enter two verse references for Jeeves to connect.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTestingJeeves(true);
    setJeevesConnection("");
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "test_jeeves",
          verse1: testVerse1.trim(),
          verse2: testVerse2.trim()
        }
      });
      
      if (error) throw error;
      
      if (data.connection) {
        setJeevesConnection(data.connection);
      }
    } catch (error) {
      console.error("Error testing Jeeves:", error);
      toast({
        title: "Error",
        description: "Failed to generate connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTestingJeeves(false);
    }
  };

  const generateChallenge = async (difficulty?: number) => {
    setIsGeneratingChallenge(true);
    setChallenge(null);
    setUserAnswer("");
    setEvaluation(null);
    setShowHint(false);
    
    const difficultyLevel = difficulty ?? Math.min(currentRound, 5);
    
    try {
      const { data, error } = await supabase.functions.invoke("bible-freestyle", {
        body: { 
          mode: "generate_challenge",
          difficulty: difficultyLevel
        }
      });
      
      if (error) throw error;
      
      if (data.verse1 && data.verse2) {
        setChallenge({
          verse1: data.verse1,
          verse2: data.verse2,
          difficulty: difficultyLevel,
          hint: data.hint
        });
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to generate challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingChallenge(false);
    }
  };

  const submitAnswer = async () => {
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
        setEvaluation(data);
        setTotalScore(prev => prev + data.score);
        
        if (data.score >= 80) {
          toast({
            title: "🏆 Excellent Connection!",
            description: `Round ${currentRound}: ${data.score} points! You found a master-level connection!`
          });
        } else if (data.score >= 60) {
          toast({
            title: "⭐ Good Work!",
            description: `Round ${currentRound}: ${data.score} points! Keep strengthening your verse genetics!`
          });
        }
      }
    } catch (error) {
      console.error("Error evaluating answer:", error);
      toast({
        title: "Error",
        description: "Failed to evaluate your answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextRound = () => {
    setCurrentRound(prev => prev + 1);
    generateChallenge(Math.min(currentRound + 1, 5));
  };

  const resetGame = () => {
    setCurrentRound(1);
    setTotalScore(0);
    setChallenge(null);
    setUserAnswer("");
    setEvaluation(null);
  };

  const saveSoloConnection = () => {
    if (!soloVerse1.trim() || !soloVerse2.trim() || !soloNotes.trim()) {
      toast({
        title: "Complete all fields",
        description: "Enter both verses and your connection notes.",
        variant: "destructive"
      });
      return;
    }
    
    setSavedConnections(prev => [...prev, {
      verse1: soloVerse1.trim(),
      verse2: soloVerse2.trim(),
      notes: soloNotes.trim(),
      timestamp: new Date()
    }]);
    
    toast({
      title: "Connection Saved!",
      description: "Your verse genetics study has been recorded."
    });
    
    setSoloVerse1("");
    setSoloVerse2("");
    setSoloNotes("");
  };

  const getDifficultyLabel = (level: number) => {
    const labels = ["Beginner", "Easy", "Medium", "Hard", "Master"];
    return labels[Math.min(level - 1, 4)];
  };

  const getDifficultyColor = (level: number) => {
    const colors = ["text-green-500", "text-blue-500", "text-amber-500", "text-orange-500", "text-red-500"];
    return colors[Math.min(level - 1, 4)];
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-orange-500";
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
            <CardDescription>
              Every verse is related to every other verse—find the family connections!
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "test" | "challenge" | "solo")}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="test" className="gap-2">
              <Swords className="h-4 w-4" />
              Test Jeeves
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-2">
              <Brain className="h-4 w-4" />
              Jeeves Challenges
            </TabsTrigger>
            <TabsTrigger value="solo" className="gap-2">
              <User className="h-4 w-4" />
              Solo Study
            </TabsTrigger>
          </TabsList>

          {/* TEST JEEVES MODE */}
          <TabsContent value="test" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
              <h4 className="font-semibold mb-2">⚔️ Test Jeeves!</h4>
              <p className="text-sm text-muted-foreground">
                Give Jeeves two verses and watch him reveal their genetic connection. Siblings, cousins, or distant relatives—all verses are family!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Verse 1</label>
                <Input
                  placeholder="e.g., John 3:16"
                  value={testVerse1}
                  onChange={(e) => setTestVerse1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Verse 2</label>
                <Input
                  placeholder="e.g., Romans 5:8"
                  value={testVerse2}
                  onChange={(e) => setTestVerse2(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={testJeeves}
              disabled={!testVerse1.trim() || !testVerse2.trim() || isTestingJeeves}
              className="w-full gap-2"
            >
              {isTestingJeeves ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Jeeves is analyzing verse genetics...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Show Me the Connection
                </>
              )}
            </Button>

            {jeevesConnection && (
              <div className="p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h4 className="font-bold">Jeeves' Verse Genetics Analysis:</h4>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {formatJeevesResponse(jeevesConnection)}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTestVerse1("");
                    setTestVerse2("");
                    setJeevesConnection("");
                  }}
                  className="mt-4 w-full"
                >
                  Try Another Pair
                </Button>
              </div>
            )}
          </TabsContent>

          {/* JEEVES CHALLENGES MODE */}
          <TabsContent value="challenge" className="space-y-4">
            {!challenge ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🧬</div>
                <h3 className="text-xl font-bold mb-2">Ready for Verse Genetics?</h3>
                <p className="text-muted-foreground mb-4">
                  Jeeves will give you two verses. Your mission: discover their connection!
                </p>
                
                {currentRound > 1 && (
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Current Score</div>
                    <div className="text-3xl font-bold text-primary">{totalScore} pts</div>
                    <div className="text-sm text-muted-foreground">Round {currentRound}</div>
                  </div>
                )}
                
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => generateChallenge(1)} 
                    disabled={isGeneratingChallenge}
                    size="lg"
                    className="gap-2"
                  >
                    {isGeneratingChallenge ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Selecting verses...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        {currentRound === 1 ? "Start Challenge" : "Continue Game"}
                      </>
                    )}
                  </Button>
                  
                  {currentRound > 1 && (
                    <Button variant="outline" onClick={resetGame}>
                      Reset Game
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Challenge Header */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="gap-1">
                    Round {currentRound}
                  </Badge>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </Badge>
                  <Badge variant="secondary">
                    Score: {totalScore}
                  </Badge>
                </div>

                {/* Verses Display */}
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

                {/* Hint Toggle */}
                {challenge.hint && !showHint && !evaluation && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowHint(true)}
                    className="text-muted-foreground"
                  >
                    💡 Need a hint? (-10 points)
                  </Button>
                )}
                
                {showHint && challenge.hint && (
                  <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <p className="text-sm italic">💡 {challenge.hint}</p>
                  </div>
                )}

                {/* User Answer */}
                {!evaluation ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="What's the connection between these verses? How are they related? Are they siblings, cousins, or distant relatives in the verse family?"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <Button 
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim() || isEvaluating}
                      className="w-full gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Trophy className="h-4 w-4" />
                          Submit Answer
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  /* Evaluation Results */
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-background/50 rounded-xl border">
                      <div className={`text-5xl font-black mb-2 ${getScoreColor(evaluation.score)}`}>
                        {showHint ? Math.max(0, evaluation.score - 10) : evaluation.score}/100
                      </div>
                      <div className="text-muted-foreground">
                        {showHint && <span className="text-sm">(Hint used: -10)</span>}
                      </div>
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
                          <div className="text-right text-xs mt-1 text-muted-foreground">
                            {item.value}/25
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg space-y-3">
                      <div>
                        <h5 className="font-semibold mb-1">Your Answer:</h5>
                        <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-1">Master Connection:</h5>
                        <p className="text-sm">{evaluation.correctConnection}</p>
                      </div>
                      {evaluation.relatedVerses && evaluation.relatedVerses.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">More family:</span>
                          {evaluation.relatedVerses.map((verse, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{verse}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={nextRound} className="flex-1 gap-2">
                        <Sparkles className="h-4 w-4" />
                        Next Round (Harder!)
                      </Button>
                      <Button variant="outline" onClick={resetGame}>
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* SOLO STUDY MODE */}
          <TabsContent value="solo" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border">
              <h4 className="font-semibold mb-2">📝 Solo Verse Genetics</h4>
              <p className="text-sm text-muted-foreground">
                Practice finding verse connections on your own. No Jeeves help—just you and the Word. Build your own verse family tree!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Verse 1</label>
                <Input
                  placeholder="e.g., Genesis 3:15"
                  value={soloVerse1}
                  onChange={(e) => setSoloVerse1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Verse 2</label>
                <Input
                  placeholder="e.g., Revelation 12:17"
                  value={soloVerse2}
                  onChange={(e) => setSoloVerse2(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Connection Discovery</label>
              <Textarea
                placeholder="How are these verses related? What's their genetic connection—siblings, cousins, or distant relatives? What themes, symbols, or patterns link them?"
                value={soloNotes}
                onChange={(e) => setSoloNotes(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <Button 
              onClick={saveSoloConnection}
              disabled={!soloVerse1.trim() || !soloVerse2.trim() || !soloNotes.trim()}
              className="w-full gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Save Connection
            </Button>

            {savedConnections.length > 0 && (
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold">📚 Your Verse Family Tree ({savedConnections.length})</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {savedConnections.map((conn, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg border">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">{conn.verse1}</Badge>
                        <span className="text-muted-foreground">↔</span>
                        <Badge variant="outline" className="text-xs">{conn.verse2}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{conn.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
