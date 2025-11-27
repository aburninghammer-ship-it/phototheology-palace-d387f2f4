import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Lightbulb, Send, BookOpen, Target, TrendingUp, Sparkles, Building2, Link2, Loader2,
  ChevronDown, AlertTriangle, CheckCircle2, BookMarked, Layers, Shield, GraduationCap,
  Church, Cross, Moon, Scale, Compass
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalysisResult {
  summary: string;
  overallScore: number;
  categories: {
    biblicalAccuracy: number;
    theologicalDepth: number;
    christCenteredness: number;
    practicalApplication: number;
    doctrinalSoundness: number;
    sanctuaryHarmony: number;
  };
  strengths: string[];
  growthAreas: string[];
  palaceRooms: {
    code: string;
    name: string;
    relevance: string;
  }[];
  scriptureConnections: {
    reference: string;
    connection: string;
  }[];
  typologyLayers: {
    symbol: string;
    meaning: string;
    reference: string;
  }[];
  potentialMisinterpretations: string[];
  alignmentCheck: {
    status: "aligned" | "caution" | "concern";
    notes: string;
  };
  furtherStudy: string[];
  encouragement: string;
}

const scriptureSuggestions = [
  { label: "Sanctuary Typology", icon: Church, prompt: "Consider how this connects to the sanctuary services and furniture." },
  { label: "Gospel/Cross", icon: Cross, prompt: "Explore how this points to Christ's sacrifice and the gospel." },
  { label: "Prophetic Link", icon: Moon, prompt: "Look for connections to Daniel and Revelation prophecies." },
  { label: "Great Controversy", icon: Scale, prompt: "Consider the cosmic conflict dimension of this truth." },
];

const checklistItems = [
  { id: "scripture", label: "Is it rooted in Scripture?", icon: BookOpen },
  { id: "christ", label: "Is it consistent with the character of Christ?", icon: Cross },
  { id: "sanctuary", label: "Does it harmonize with the sanctuary pattern?", icon: Church },
  { id: "private", label: "Does it avoid private interpretations?", icon: Shield },
  { id: "humble", label: "Is it presented humbly, not dogmatically?", icon: Scale },
];

const AnalyzeThoughts = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      toast.error("Please enter your thoughts to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: 'analyze-thoughts',
          message: input
        }
      });

      if (error) throw error;

      let analysisResult: AnalysisResult;
      if (typeof data.response === 'string') {
        try {
          analysisResult = JSON.parse(data.response);
        } catch {
          toast.error("Failed to parse analysis. Please try again.");
          return;
        }
      } else {
        analysisResult = data.response;
      }

      setResult(analysisResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Failed to analyze. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSuggestion = (prompt: string) => {
    setInput(prev => prev + (prev ? "\n\n" : "") + prompt);
    toast.success("Suggestion added to your thoughts");
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getAlignmentBadge = (status: string) => {
    switch (status) {
      case "aligned":
        return <Badge className="bg-green-500/20 text-green-600 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" /> Aligned</Badge>;
      case "caution":
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><AlertTriangle className="h-3 w-3 mr-1" /> Caution</Badge>;
      case "concern":
        return <Badge className="bg-red-500/20 text-red-600 border-red-500/30"><AlertTriangle className="h-3 w-3 mr-1" /> Concern</Badge>;
      default:
        return null;
    }
  };

  const categoryLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    biblicalAccuracy: { label: "Biblical Accuracy", icon: <BookOpen className="h-4 w-4" /> },
    theologicalDepth: { label: "Theological Depth", icon: <Layers className="h-4 w-4" /> },
    christCenteredness: { label: "Christ-Centeredness", icon: <Cross className="h-4 w-4" /> },
    practicalApplication: { label: "Practical Application", icon: <Target className="h-4 w-4" /> },
    doctrinalSoundness: { label: "Doctrinal Soundness", icon: <Shield className="h-4 w-4" /> },
    sanctuaryHarmony: { label: "Sanctuary Harmony", icon: <Compass className="h-4 w-4" /> },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-serif font-bold">Analyze My Thoughts</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your biblical ideas, interpretations, or theological insights and receive comprehensive feedback 
            grounded in Phototheology principles and sound biblical hermeneutics.
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Share Your Thoughts
            </CardTitle>
            <CardDescription>
              Enter a biblical concept, interpretation, or theological idea you'd like analyzed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: I believe the sanctuary in Hebrews represents Christ's mediatorial work in heaven, connecting the earthly types with their heavenly antitype..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px]"
            />
            
            {/* Scripture Suggestion Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground mr-2 self-center">Add layer:</span>
              {scriptureSuggestions.map((suggestion) => (
                <Button
                  key={suggestion.label}
                  variant="outline"
                  size="sm"
                  onClick={() => addSuggestion(suggestion.prompt)}
                  className="text-xs"
                >
                  <suggestion.icon className="h-3 w-3 mr-1" />
                  {suggestion.label}
                </Button>
              ))}
            </div>

            {/* Before You Submit Checklist */}
            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Before You Submit Checklist
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  {checklistItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      onClick={() => toggleCheckItem(item.id)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        checkedItems.includes(item.id) ? 'bg-primary border-primary' : 'border-muted-foreground/30'
                      }`}>
                        {checkedItems.includes(item.id) && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !input.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Analyze My Thoughts
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            {result.summary && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <BookMarked className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Summary of Your Thought</p>
                      <p className="text-muted-foreground">{result.summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Overall Score & Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Doctrinal Integrity Score
                  </span>
                  <span className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                    {result.overallScore}/100
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(result.categories).map(([key, value]) => {
                    const category = categoryLabels[key];
                    if (!category) return null;
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm flex items-center gap-2">
                            {category.icon}
                            {category.label}
                          </span>
                          <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                            {value}%
                          </span>
                        </div>
                        <Progress value={value} className={getProgressColor(value)} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Alignment Check */}
            {result.alignmentCheck && (
              <Card className={`border-l-4 ${
                result.alignmentCheck.status === 'aligned' ? 'border-l-green-500' :
                result.alignmentCheck.status === 'caution' ? 'border-l-yellow-500' : 'border-l-red-500'
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Theological Alignment
                    </span>
                    {getAlignmentBadge(result.alignmentCheck.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.alignmentCheck.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Strengths & Growth Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Theological Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <Lightbulb className="h-5 w-5" />
                    Areas for Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.growthAreas.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">→</span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Potential Misinterpretations */}
            {result.potentialMisinterpretations && result.potentialMisinterpretations.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                    Potential Misinterpretations to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.potentialMisinterpretations.map((warning, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Palace Room Mapping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Phototheology Palace Mapping
                </CardTitle>
                <CardDescription>
                  PT principles that connect to your thoughts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.palaceRooms.map((room, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="font-mono shrink-0">
                        {room.code}
                      </Badge>
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-sm text-muted-foreground">{room.relevance}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Typology Layers */}
            {result.typologyLayers && result.typologyLayers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Typology & Symbol Layers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {result.typologyLayers.map((layer, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{layer.symbol}</Badge>
                          <span className="text-sm text-muted-foreground">→</span>
                          <span className="font-medium">{layer.meaning}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{layer.reference}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scripture Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  Scripture Connections
                </CardTitle>
                <CardDescription>
                  Bible passages that strengthen your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.scriptureConnections.map((conn, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-primary">{conn.reference}</p>
                        <p className="text-sm text-muted-foreground">{conn.connection}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Further Study */}
            {result.furtherStudy && result.furtherStudy.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Further Study Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.furtherStudy.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Encouragement */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-primary shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Encouragement from Jeeves</p>
                    <p className="text-muted-foreground">{result.encouragement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeThoughts;
