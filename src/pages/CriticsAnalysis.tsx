import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, CheckCircle, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  summary: string;
  mainClaims: Array<{
    claim: string;
    timestamp?: string;
    rebuttal: string;
  }>;
  logicalFallacies: Array<{
    fallacy: string;
    explanation: string;
    example: string;
  }>;
  biblicalResponses: Array<{
    topic: string;
    response: string;
    verses: string[];
  }>;
  additionalNotes: string;
}

export default function CriticsAnalysis() {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      toast.error("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-critic-video", {
        body: { videoUrl: videoUrl.trim() }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast.success("Analysis complete!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Failed to analyze video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Video className="w-8 h-8" />
            Critics Analysis
          </h1>
          <p className="text-muted-foreground">
            Analyze videos critical of SDA teaching or the Bible. Get detailed rebuttals, identify logical fallacies, and biblical responses.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Analyze Video</CardTitle>
            <CardDescription>
              Enter a YouTube URL to begin analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="claims">Claims & Rebuttals</TabsTrigger>
              <TabsTrigger value="fallacies">Logical Fallacies</TabsTrigger>
              <TabsTrigger value="biblical">Biblical Responses</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Video Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{analysis.summary}</p>
                </CardContent>
              </Card>
              
              {analysis.additionalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{analysis.additionalNotes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="claims" className="space-y-4">
              {analysis.mainClaims.map((claim, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">Claim #{idx + 1}</CardTitle>
                      {claim.timestamp && (
                        <Badge variant="outline">{claim.timestamp}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        Claim:
                      </h4>
                      <p className="text-muted-foreground">{claim.claim}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Rebuttal:
                      </h4>
                      <p className="whitespace-pre-wrap">{claim.rebuttal}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="fallacies" className="space-y-4">
              {analysis.logicalFallacies.map((fallacy, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Badge variant="destructive">{fallacy.fallacy}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Explanation:</h4>
                      <p className="text-muted-foreground">{fallacy.explanation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Example from Video:</h4>
                      <p className="italic">{fallacy.example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="biblical" className="space-y-4">
              {analysis.biblicalResponses.map((response, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{response.topic}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="whitespace-pre-wrap mb-4">{response.response}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Supporting Verses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {response.verses.map((verse, vIdx) => (
                          <Badge key={vIdx} variant="secondary">
                            {verse}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
