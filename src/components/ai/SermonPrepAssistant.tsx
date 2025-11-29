import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Loader2, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Copy, 
  Download,
  Lightbulb,
  MessageSquare,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SermonPrepAssistant = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [scripture, setScripture] = useState("");
  const [audienceType, setAudienceType] = useState("general");
  const [sermonLength, setSermonLength] = useState("20");
  const [isLoading, setIsLoading] = useState(false);
  const [outline, setOutline] = useState<{
    title: string;
    introduction: string;
    points: { title: string; content: string; illustration: string }[];
    conclusion: string;
    callToAction: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim() && !scripture.trim()) {
      toast({ title: "Please enter a topic or scripture", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await supabase.functions.invoke("sermon-assistant", {
        body: { topic, scripture, audienceType, sermonLength },
      });

      if (response.error) throw response.error;
      setOutline(response.data);
    } catch (error) {
      console.error("Error:", error);
      // Demo fallback
      setOutline({
        title: topic || `Understanding ${scripture}`,
        introduction: `Today we explore the profound truths found in ${scripture || topic}. This message will transform how you see God's Word and apply it to your daily life.`,
        points: [
          {
            title: "The Context",
            content: "Understanding the historical and spiritual setting of this passage reveals deeper meaning.",
            illustration: "Like an archaeologist uncovering ancient treasures, we dig into the layers of meaning.",
          },
          {
            title: "The Christ Connection",
            content: "Every passage points to Jesus. Here we see how this text reveals the Savior.",
            illustration: "Just as the North Star guided travelers, Christ is the focal point of all Scripture.",
          },
          {
            title: "The Application",
            content: "What does this mean for us today? Practical steps to live out this truth.",
            illustration: "A seed only grows when planted - truth must be applied to bear fruit.",
          },
        ],
        conclusion: "As we close, remember that God's Word is not just information but transformation.",
        callToAction: "This week, commit to one specific action that applies this truth to your life.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outline) return;
    const text = `
${outline.title}

INTRODUCTION:
${outline.introduction}

${outline.points.map((p, i) => `
POINT ${i + 1}: ${p.title}
${p.content}
Illustration: ${p.illustration}
`).join("")}

CONCLUSION:
${outline.conclusion}

CALL TO ACTION:
${outline.callToAction}
    `.trim();
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Sermon outline copied to clipboard" });
  };

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-amber-500" />
          Sermon Prep Assistant
          <Badge variant="secondary" className="ml-2">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="input">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Setup</TabsTrigger>
            <TabsTrigger value="outline" disabled={!outline}>Outline</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Topic/Theme</Label>
                <Input
                  placeholder="e.g., Faith in Hard Times"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <Label>Primary Scripture</Label>
                <Input
                  placeholder="e.g., Romans 8:28"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Audience</Label>
                <Select value={audienceType} onValueChange={setAudienceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Church</SelectItem>
                    <SelectItem value="youth">Youth Group</SelectItem>
                    <SelectItem value="children">Children's Church</SelectItem>
                    <SelectItem value="seekers">Seekers/Visitors</SelectItem>
                    <SelectItem value="mature">Mature Believers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sermon Length (minutes)</Label>
                <Select value={sermonLength} onValueChange={setSermonLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 min (Short)</SelectItem>
                    <SelectItem value="20">20 min (Standard)</SelectItem>
                    <SelectItem value="30">30 min (Full)</SelectItem>
                    <SelectItem value="45">45 min (Extended)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || (!topic.trim() && !scripture.trim())}
              className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Outline...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Sermon Outline
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="outline" className="space-y-4">
            {outline && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{outline.title}</h3>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-300">Introduction</p>
                      <p className="text-sm mt-1">{outline.introduction}</p>
                    </div>
                  </div>
                </div>

                {outline.points.map((point, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-bold">Point {idx + 1}: {point.title}</p>
                        <p className="text-sm mt-1">{point.content}</p>
                        <div className="mt-2 p-2 rounded bg-purple-50 dark:bg-purple-950/30 text-sm">
                          <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                            <Lightbulb className="h-3 w-3" />
                            Illustration:
                          </span>
                          <p className="text-xs mt-1">{point.illustration}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <p className="font-medium text-emerald-700 dark:text-emerald-300">Conclusion</p>
                  <p className="text-sm mt-1">{outline.conclusion}</p>
                  <p className="text-sm mt-3 font-medium text-emerald-600 dark:text-emerald-400">
                    Call to Action: {outline.callToAction}
                  </p>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
