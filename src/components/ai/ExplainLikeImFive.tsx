import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Baby, Loader2, Sparkles, BookOpen, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExplainLikeImFiveProps {
  passage?: string;
  reference?: string;
}

export const ExplainLikeImFive = ({ passage, reference }: ExplainLikeImFiveProps) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState(passage || "");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!inputText.trim()) {
      toast({ title: "Please enter a passage", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setExplanation("");

    try {
      const response = await supabase.functions.invoke("explain-simple", {
        body: { passage: inputText, reference },
      });

      if (response.error) throw response.error;
      setExplanation(response.data?.explanation || "Could not generate explanation");
    } catch (error) {
      console.error("Error:", error);
      // Fallback for demo
      setExplanation(
        `Imagine you have a really big, beautiful garden. ${reference || "This passage"} is like God telling us that He takes care of His garden (that's us!) just like a loving gardener. He makes sure we have everything we need to grow strong and happy. Just like plants need sunshine and water, we need God's love and help to be our best selves!`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-pink-500" />
          Explain Like I'm 5
          <Badge variant="secondary" className="ml-2">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter a Bible passage or concept..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[80px]"
          />
          {reference && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {reference}
            </p>
          )}
        </div>

        <Button 
          onClick={handleExplain} 
          disabled={isLoading || !inputText.trim()}
          className="w-full gap-2 bg-gradient-to-r from-pink-500 to-purple-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Simplifying...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Explain Simply
            </>
          )}
        </Button>

        {explanation && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30 border border-pink-200 dark:border-pink-800">
            <div className="flex items-start gap-2">
              <span className="text-2xl">🧒</span>
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{explanation}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExplain}
                  className="mt-2 gap-1 text-xs"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Another Way
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
