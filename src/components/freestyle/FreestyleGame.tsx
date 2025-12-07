import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Swords, Trophy, Star, Zap, Target, Plus, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FreestyleGameProps {
  roomId: string;
  roomName: string;
}

interface ChallengeData {
  objects: string[];
  hint: string;
}

interface EvaluationResult {
  score: number;
  breakdown: {
    christCenteredness: number;
    biblicalAccuracy: number;
    creativity: number;
    practicalApplication: number;
  };
  feedback: string;
  enhancement: string;
  relatedVerses: string[];
}

export const FreestyleGame = ({ roomId, roomName }: FreestyleGameProps) => {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<"play" | "challenge">("play");
  
  // Play mode state
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userResponse, setUserResponse] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Challenge Jeeves mode state
  const [userObjects, setUserObjects] = useState<string[]>([]);
  const [newObject, setNewObject] = useState("");
  const [jeevesResponse, setJeevesResponse] = useState("");
  const [isChallenging, setIsChallenging] = useState(false);

  const generateChallenge = async () => {
    setIsGenerating(true);
    setChallenge(null);
    setUserResponse("");
    setEvaluation(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { mode: "generate_challenge" }
      });
      
      if (error) throw error;
      
      if (data.objects && data.hint) {
        setChallenge(data);
      } else {
        throw new Error("Invalid challenge format");
      }
    } catch (error) {
      console.error("Error generating challenge:", error);
      toast({
        title: "Error",
        description: "Failed to generate challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const submitFreestyle = async () => {
    if (!userResponse.trim() || !challenge) return;
    
    setIsEvaluating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { 
          mode: "evaluate_freestyle",
          challengeObjects: challenge.objects,
          userResponse: userResponse.trim()
        }
      });
      
      if (error) throw error;
      
      if (data.score !== undefined) {
        setEvaluation(data);
        
        if (data.score >= 80) {
          toast({
            title: "🏆 Excellent Freestyle!",
            description: `You scored ${data.score}/100! Master-level connection!`
          });
        } else if (data.score >= 60) {
          toast({
            title: "⭐ Good Connection!",
            description: `You scored ${data.score}/100! Keep practicing!`
          });
        }
      }
    } catch (error) {
      console.error("Error evaluating freestyle:", error);
      toast({
        title: "Error",
        description: "Failed to evaluate your response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const addObject = () => {
    if (newObject.trim() && userObjects.length < 5) {
      setUserObjects([...userObjects, newObject.trim()]);
      setNewObject("");
    }
  };

  const removeObject = (index: number) => {
    setUserObjects(userObjects.filter((_, i) => i !== index));
  };

  const challengeJeeves = async () => {
    if (userObjects.length < 2) {
      toast({
        title: "Add more objects",
        description: "Give Jeeves at least 2 objects to connect!",
        variant: "destructive"
      });
      return;
    }
    
    setIsChallenging(true);
    setJeevesResponse("");
    
    try {
      const { data, error } = await supabase.functions.invoke("freestyle-game", {
        body: { 
          mode: "challenge_jeeves",
          userObjects
        }
      });
      
      if (error) throw error;
      
      if (data.response) {
        setJeevesResponse(data.response);
      }
    } catch (error) {
      console.error("Error challenging Jeeves:", error);
      toast({
        title: "Error",
        description: "Jeeves couldn't complete the challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChallenging(false);
    }
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
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">🎤 Freestyle Arena</CardTitle>
            <CardDescription>
              Connect everyday objects to spiritual truths—like a hip hop artist freestyling Scripture!
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as "play" | "challenge")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="play" className="gap-2">
              <Target className="h-4 w-4" />
              Play Challenge
            </TabsTrigger>
            <TabsTrigger value="challenge" className="gap-2">
              <Swords className="h-4 w-4" />
              Challenge Jeeves
            </TabsTrigger>
          </TabsList>

          {/* PLAY MODE */}
          <TabsContent value="play" className="space-y-4">
            {!challenge ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Ready to Freestyle?</h3>
                <p className="text-muted-foreground mb-6">
                  Jeeves will give you random objects. Your mission: connect them to Scripture!
                </p>
                <Button 
                  onClick={generateChallenge} 
                  disabled={isGenerating}
                  size="lg"
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Start Challenge
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Challenge Display */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <h4 className="font-semibold mb-3">🎲 Your Objects:</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {challenge.objects.map((obj, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="text-lg px-4 py-2 bg-background/80"
                      >
                        {obj}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    💡 Hint: {challenge.hint}
                  </p>
                </div>

                {/* User Response */}
                {!evaluation ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Connect these objects to a spiritual truth... How do they point to Christ, reveal a biblical principle, or teach a life lesson?"
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={submitFreestyle}
                        disabled={!userResponse.trim() || isEvaluating}
                        className="flex-1 gap-2"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4" />
                            Submit Freestyle
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={generateChallenge}
                        disabled={isGenerating}
                      >
                        New Challenge
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Evaluation Results */
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-background/50 rounded-xl border">
                      <div className={`text-5xl font-black mb-2 ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}/100
                      </div>
                      <div className="text-muted-foreground">Your Freestyle Score</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Christ-Centeredness", value: evaluation.breakdown.christCenteredness, icon: "✝️" },
                        { label: "Biblical Accuracy", value: evaluation.breakdown.biblicalAccuracy, icon: "📖" },
                        { label: "Creativity", value: evaluation.breakdown.creativity, icon: "💡" },
                        { label: "Practical Application", value: evaluation.breakdown.practicalApplication, icon: "🎯" },
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

                    <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                      <p className="text-sm">{evaluation.feedback}</p>
                      <p className="text-sm text-muted-foreground italic">
                        💡 {evaluation.enhancement}
                      </p>
                      {evaluation.relatedVerses?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {evaluation.relatedVerses.map((verse, i) => (
                            <Badge key={i} variant="outline">{verse}</Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button onClick={generateChallenge} className="w-full gap-2">
                      <Sparkles className="h-4 w-4" />
                      Try Another Challenge
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* CHALLENGE JEEVES MODE */}
          <TabsContent value="challenge" className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl border border-accent/20">
              <h4 className="font-semibold mb-2">⚔️ Challenge Jeeves!</h4>
              <p className="text-sm text-muted-foreground">
                Give Jeeves 2-5 random objects and watch him create a master-level freestyle connection!
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter an object, event, or nature element..."
                  value={newObject}
                  onChange={(e) => setNewObject(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addObject()}
                  disabled={userObjects.length >= 5}
                />
                <Button 
                  onClick={addObject} 
                  disabled={!newObject.trim() || userObjects.length >= 5}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {userObjects.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {userObjects.map((obj, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="text-base px-3 py-1.5 gap-2"
                    >
                      {obj}
                      <button 
                        onClick={() => removeObject(i)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <Button 
                onClick={challengeJeeves}
                disabled={userObjects.length < 2 || isChallenging}
                className="w-full gap-2"
              >
                {isChallenging ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Jeeves is freestyling...
                  </>
                ) : (
                  <>
                    <Swords className="h-4 w-4" />
                    Challenge Jeeves ({userObjects.length}/5 objects)
                  </>
                )}
              </Button>
            </div>

            {jeevesResponse && (
              <div className="p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl border-2 border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-amber-500" />
                  <h4 className="font-bold">Jeeves' Master Freestyle:</h4>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {jeevesResponse}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUserObjects([]);
                    setJeevesResponse("");
                  }}
                  className="mt-4 w-full"
                >
                  Try Again with New Objects
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
