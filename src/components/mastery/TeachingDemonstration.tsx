import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TeachingDemonstrationProps {
  roomId: string;
  roomName: string;
  floorNumber: number;
  onSuccess: () => void;
}

export const TeachingDemonstration: React.FC<TeachingDemonstrationProps> = ({
  roomId,
  roomName,
  floorNumber,
  onSuccess,
}) => {
  const [explanation, setExplanation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (explanation.length < 200) {
      toast({
        title: "Explanation Too Short",
        description: "Please provide at least 200 characters to demonstrate your understanding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("grade-teaching-demo", {
        body: {
          roomId,
          roomName,
          floorNumber,
          explanation,
        },
      });

      if (error) throw error;

      setResult(data);

      if (data.passed) {
        toast({
          title: "🎓 Teaching Demo Passed!",
          description: `Score: ${data.score}% - You've demonstrated true mastery!`,
        });
        onSuccess();
      } else {
        toast({
          title: "Not Quite There Yet",
          description: "Review the feedback and try again. You need 80% to pass.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Teaching demo error:", error);
      toast({
        title: "Submission Error",
        description: "Failed to grade your demonstration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassed = result?.passed;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Teaching Demonstration
        </CardTitle>
        <CardDescription>
          Explain this room's principles as if teaching another student (minimum 200 characters)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result && (
          <>
            <div className="space-y-2">
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={`Explain the ${roomName} room's purpose, principles, practice methods, and how you know you've mastered it...`}
                className="min-h-[200px]"
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{explanation.length} / 200 characters minimum</span>
                {explanation.length >= 200 && (
                  <Badge variant="default">Ready to submit</Badge>
                )}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Your explanation should cover:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Purpose: What is this room for?</li>
                <li>• Principles: What core concepts does it teach?</li>
                <li>• Practice: How do you practice this principle?</li>
                <li>• Mastery: How do you know you've mastered it?</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || explanation.length < 200}
              className="w-full gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Grading Your Teaching...
                </>
              ) : (
                <>
                  <GraduationCap className="h-4 w-4" />
                  Submit for Grading
                </>
              )}
            </Button>
          </>
        )}

        {result && (
          <div className="space-y-4">
            {/* Score Display */}
            <div className={`p-4 rounded-lg border-2 ${
              isPassed ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isPassed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  <span className="font-semibold">
                    {isPassed ? "Passed!" : "Not Yet - Try Again"}
                  </span>
                </div>
                <Badge variant={isPassed ? "default" : "destructive"}>
                  {result.score}%
                </Badge>
              </div>
              <Progress value={result.score} className="h-2" />
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Grading Breakdown:</h4>
              {Object.entries(result.breakdown).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <Badge variant="outline">{value}/25</Badge>
                </div>
              ))}
            </div>

            {/* Feedback */}
            <div className="p-3 rounded-lg border bg-card">
              <h4 className="font-semibold text-sm mb-2">Feedback:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {result.feedback}
              </p>
            </div>

            {!isPassed && (
              <Button
                onClick={() => setResult(null)}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
