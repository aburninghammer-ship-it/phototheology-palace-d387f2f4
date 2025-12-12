import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Send, 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle,
  Loader2,
  Users
} from "lucide-react";
import { gradeCustomChallenge } from "@/lib/guesthouseJeeves";

interface CustomChallengeSpec {
  title: string;
  description: string;
  instructions: string;
  submissionType: string;
  submissionPrompt: string;
  gradingCriteria: Array<{
    criterion: string;
    weight: number;
    description: string;
  }>;
  timeLimit: number;
  bonusOpportunities: string[];
  specialRules: string[];
  ptRoomsRelevant: string[];
  teamMode: boolean;
}

interface Submission {
  id: string;
  guestName: string;
  teamName?: string;
  response: string;
  submittedAt: Date;
  grade?: {
    overallScore: number;
    feedbackMessage: string;
    rank: string;
    bonusPointsEarned: number;
  };
  isGrading?: boolean;
}

interface CustomChallengeGameProps {
  challengeSpec: CustomChallengeSpec;
  isHost: boolean;
  playerName?: string;
  teamName?: string;
  onSubmit?: (response: string) => void;
  submissions?: Submission[];
  timeRemaining?: number;
  onGradeComplete?: (submissionId: string, grade: any) => void;
}

export function CustomChallengeGame({
  challengeSpec,
  isHost,
  playerName,
  teamName,
  onSubmit,
  submissions = [],
  timeRemaining,
  onGradeComplete
}: CustomChallengeGameProps) {
  const [response, setResponse] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingQueue, setGradingQueue] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!response.trim() || hasSubmitted) return;
    setIsSubmitting(true);
    try {
      onSubmit?.(response);
      setHasSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Host: Auto-grade submissions
  useEffect(() => {
    if (!isHost) return;
    
    const ungradedSubmissions = submissions.filter(s => !s.grade && !s.isGrading);
    ungradedSubmissions.forEach(async (sub) => {
      if (gradingQueue.includes(sub.id)) return;
      setGradingQueue(prev => [...prev, sub.id]);
      
      const grade = await gradeCustomChallenge(
        challengeSpec as any,
        sub.response,
        sub.teamName
      );
      
      if (grade) {
        onGradeComplete?.(sub.id, grade);
      }
      setGradingQueue(prev => prev.filter(id => id !== sub.id));
    });
  }, [submissions, isHost, challengeSpec, onGradeComplete, gradingQueue]);

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a.grade && b.grade) return b.grade.overallScore - a.grade.overallScore;
    if (a.grade) return -1;
    if (b.grade) return 1;
    return 0;
  });

  const getRankColor = (rank: string) => {
    switch (rank) {
      case "excellent": return "bg-yellow-500 text-yellow-950";
      case "good": return "bg-green-500 text-green-950";
      case "fair": return "bg-blue-500 text-blue-950";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Challenge Header */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline" className="mb-2 gap-1">
                <Sparkles className="w-3 h-3" />
                Custom Challenge
              </Badge>
              <CardTitle className="text-2xl">{challengeSpec.title}</CardTitle>
              <p className="text-muted-foreground mt-1">{challengeSpec.description}</p>
            </div>
            {timeRemaining !== undefined && (
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="w-5 h-5" />
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-background/50 border">
            <h4 className="font-semibold mb-2">Instructions:</h4>
            <p className="text-sm">{challengeSpec.instructions}</p>
          </div>

          {challengeSpec.gradingCriteria.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {challengeSpec.gradingCriteria.map((c, i) => (
                <div key={i} className="text-center p-2 rounded bg-muted/50">
                  <div className="text-xs text-muted-foreground">{c.criterion}</div>
                  <div className="font-semibold">{c.weight}%</div>
                </div>
              ))}
            </div>
          )}

          {challengeSpec.bonusOpportunities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Bonus:</span>
              {challengeSpec.bonusOpportunities.map((bonus, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  {bonus}
                </Badge>
              ))}
            </div>
          )}

          {challengeSpec.teamMode && (
            <Badge className="gap-1">
              <Users className="w-3 h-3" />
              Team Mode
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Player Submission */}
      {!isHost && (
        <Card>
          <CardContent className="pt-6">
            {hasSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-xl font-semibold">Submitted!</h3>
                <p className="text-muted-foreground">
                  Waiting for Jeeves to grade your response...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {challengeSpec.submissionPrompt || "Your Response:"}
                  </label>
                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Enter your answer..."
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!response.trim() || isSubmitting}
                  className="w-full gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit Answer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Host: Submissions & Results */}
      {isHost && submissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Submissions ({submissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence>
                {sortedSubmissions.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {index === 0 && sub.grade && (
                            <Trophy className="w-4 h-4 text-yellow-500" />
                          )}
                          <span className="font-medium">
                            {sub.teamName || sub.guestName}
                          </span>
                          {sub.grade && (
                            <Badge className={getRankColor(sub.grade.rank)}>
                              {sub.grade.overallScore} pts
                            </Badge>
                          )}
                          {sub.isGrading && (
                            <Badge variant="outline" className="gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Grading...
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {sub.response}
                        </p>
                        {sub.grade && (
                          <p className="text-sm mt-2 text-primary">
                            {sub.grade.feedbackMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
