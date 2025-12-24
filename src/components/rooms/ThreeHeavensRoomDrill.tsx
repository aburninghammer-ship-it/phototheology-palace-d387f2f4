import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  RefreshCw, 
  BookOpen, 
  Timer,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Eye,
  Layers,
  CloudSun,
  Sun,
  Moon,
  Star,
  Scale,
  AlertTriangle
} from "lucide-react";

// The Three Heavens (Fixed Definitions)
const HEAVENS = [
  {
    id: "1h",
    name: "First Heaven",
    tag: "1H",
    icon: "☁️",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    focus: "Near / Historical",
    description: "Israel's return from Babylonian exile and post-exilic restoration",
    historicalAnchor: "Decree of Cyrus (539 BC), rebuilding temple and Jerusalem",
    prophets: ["Isaiah 40-55", "Jeremiah 29-33", "Ezekiel 36-37", "Zechariah", "Haggai"],
    characteristics: [
      "Literal Israel",
      "Local geography",
      "Immediate historical audience",
      "Restoration after judgment"
    ],
    coreQuestion: "How did this prophecy speak to its original audience?",
    timeMarkers: ["70 years", "Cyrus decree", "return from exile", "rebuild temple"],
    audienceClues: ["exiles in Babylon", "remnant", "Judah"]
  },
  {
    id: "2h",
    name: "Second Heaven",
    tag: "2H",
    icon: "🌤",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    focus: "Intermediate / Transitional",
    description: "Destruction of Jerusalem (AD 70), 'this generation,' church age",
    historicalAnchor: "Ministry of Christ, Olivet Discourse, fall of Jerusalem, church as new temple",
    prophets: ["Matthew 24", "Luke 21", "Mark 13", "Acts", "Hebrews"],
    characteristics: [
      "Covenant transition",
      "Judgment on apostate systems",
      "Expansion of the gospel",
      "Spiritual Israel emerges"
    ],
    coreQuestion: "How does this prophecy expand or intensify beyond the first fulfillment?",
    timeMarkers: ["this generation", "before you see death", "not one stone left"],
    audienceClues: ["disciples", "early church", "this generation"]
  },
  {
    id: "3h",
    name: "Third Heaven",
    tag: "3H",
    icon: "🌌",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    focus: "Ultimate / Eschatological",
    description: "Second Coming, final judgment, resurrection, new creation",
    historicalAnchor: "Day of the Lord, Millennium, new heavens and new earth",
    prophets: ["Revelation 19-22", "2 Peter 3", "1 Thessalonians 4", "Isaiah 65-66 (ultimate)"],
    characteristics: [
      "Universal scope",
      "Finality",
      "No further fulfillment beyond this",
      "God dwelling with humanity"
    ],
    coreQuestion: "How does this prophecy reach its final and complete fulfillment?",
    timeMarkers: ["day of the Lord", "no one knows the hour", "last day", "final judgment"],
    audienceClues: ["all nations", "every knee", "the whole earth"]
  }
];

// Training Modes
const TRAINING_MODES = {
  beginner: {
    id: "beginner",
    name: "Recognition",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Identify the correct horizon(s)",
    prompt: "Which of the three heavens is this prophecy primarily addressing? List one textual reason."
  },
  intermediate: {
    id: "intermediate",
    name: "Distinction",
    icon: Layers,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    description: "Separate primary and secondary fulfillments",
    prompt: "This prophecy appears to operate in more than one horizon. Identify the primary horizon and explain how another is echoed without confusion."
  },
  master: {
    id: "master",
    name: "Telescoping Control",
    icon: Eye,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    description: "Track prophecy across all horizons without collapsing them",
    prompt: "Trace how this prophecy unfolds from First Heaven to Third Heaven, explaining what changes and what remains constant."
  }
};

// Drill Types
const DRILL_TYPES = [
  {
    id: "horizon_snap",
    name: "Horizon Snap",
    icon: Timer,
    description: "10 seconds. Name the primary heaven and why.",
    instruction: "Quick identification—name the primary horizon and ONE supporting reason."
  },
  {
    id: "misapplication_check",
    name: "Misapplication Check",
    icon: AlertTriangle,
    description: "A student applies this passage directly to the Second Coming. Is this valid or premature?",
    instruction: "Evaluate whether a 3H application is warranted or if the passage is primarily 1H/2H."
  },
  {
    id: "prophet_practice",
    name: "Prophet Practice",
    icon: BookOpen,
    description: "Identify which heaven Isaiah/Jeremiah/Jesus is primarily speaking to.",
    instruction: "Read the prophetic text and identify its primary horizon with textual markers."
  },
  {
    id: "olivet_discernment",
    name: "Olivet Discernment",
    icon: Layers,
    description: "Separate which parts belong to 2H and which extend to 3H.",
    instruction: "The Olivet Discourse shifts horizons. Identify where 2H ends and 3H begins."
  },
  {
    id: "fulfillment_status",
    name: "Fulfillment Status",
    icon: CheckCircle2,
    description: "Which part has been fulfilled, and which remains future?",
    instruction: "Determine fulfillment status: fulfilled (1H/2H historically) vs. still future (3H)."
  }
];

// Sample texts for training
const SAMPLE_TEXTS = [
  {
    reference: "Isaiah 65:17-25",
    text: "For, behold, I create new heavens and a new earth... They shall build houses, and inhabit them... The wolf and the lamb shall feed together...",
    expectedHorizons: ["1h", "3h"],
    explanation: "Dual horizon: 1H restoration after Babylon (building houses), 3H ultimate new creation (wolf/lamb peace)."
  },
  {
    reference: "Matthew 24:1-35",
    text: "There shall not be left here one stone upon another... When ye therefore shall see the abomination of desolation... This generation shall not pass...",
    expectedHorizons: ["2h"],
    explanation: "Primary 2H: Temple destruction in AD 70. 'This generation' = within 40 years, historically fulfilled."
  },
  {
    reference: "Matthew 24:36-51",
    text: "But of that day and hour knoweth no man... Then shall two be in the field; one shall be taken, and one left...",
    expectedHorizons: ["3h"],
    explanation: "Primary 3H: Shifts to unknown day/hour = Second Coming, not AD 70 (which was knowable)."
  },
  {
    reference: "Jeremiah 31:31-34",
    text: "I will make a new covenant with the house of Israel... I will put my law in their inward parts... they shall all know me...",
    expectedHorizons: ["1h", "2h", "3h"],
    explanation: "Triple telescope: 1H post-exilic hope, 2H inaugurated at Last Supper/church age, 3H fully realized when all know the Lord."
  },
  {
    reference: "Zechariah 14:1-21",
    text: "Behold, the day of the LORD cometh... His feet shall stand in that day upon the mount of Olives... living waters shall go out from Jerusalem...",
    expectedHorizons: ["1h", "3h"],
    explanation: "Dual: 1H deliverance for post-exilic Jerusalem, 3H cosmic language (no more night) echoes Revelation 21-22."
  },
  {
    reference: "Joel 2:28-32",
    text: "I will pour out my spirit upon all flesh... your sons and your daughters shall prophesy... before the great and terrible day of the LORD...",
    expectedHorizons: ["2h", "3h"],
    explanation: "2H: Peter quotes at Pentecost (Acts 2:17). 3H: 'Day of the LORD' extends to final judgment."
  },
  {
    reference: "Daniel 9:24-27",
    text: "Seventy weeks are determined upon thy people... to finish the transgression... Messiah shall be cut off...",
    expectedHorizons: ["1h", "2h"],
    explanation: "1H: Decree to restore Jerusalem. 2H: Messiah cut off = Christ's death, AD 70 destruction."
  }
];

export const ThreeHeavensRoomDrill = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<keyof typeof TRAINING_MODES>("beginner");
  const [drillType, setDrillType] = useState(DRILL_TYPES[0].id);
  const [scripture, setScripture] = useState("");
  const [scriptureReference, setScriptureReference] = useState("");
  const [selectedHorizons, setSelectedHorizons] = useState<string[]>([]);
  const [userAnalysis, setUserAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [grade, setGrade] = useState<{
    score: number;
    feedback: string;
    horizonAccuracy: string;
    markerAnalysis: string;
    fulfillmentCheck: string;
    recommendations: string[];
  } | null>(null);
  const [showHeavenDetails, setShowHeavenDetails] = useState<string | null>(null);

  const currentMode = TRAINING_MODES[mode];
  const currentDrill = DRILL_TYPES.find(d => d.id === drillType)!;

  const toggleHorizon = (horizonId: string) => {
    setSelectedHorizons(prev => 
      prev.includes(horizonId) 
        ? prev.filter(h => h !== horizonId)
        : [...prev, horizonId]
    );
  };

  const loadSampleText = () => {
    const sample = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setScriptureReference(sample.reference);
    setScripture(sample.text);
    setSelectedHorizons([]);
    setUserAnalysis("");
    setGrade(null);
  };

  const generateScripture = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "three_heavens_scripture",
          drillType,
          trainingMode: mode
        }
      });

      if (error) throw error;

      if (data?.reference && data?.text) {
        setScriptureReference(data.reference);
        setScripture(data.text);
        setSelectedHorizons([]);
        setUserAnalysis("");
        setGrade(null);
      }
    } catch (error) {
      console.error("Error generating scripture:", error);
      toast.error("Failed to generate scripture. Using sample text instead.");
      loadSampleText();
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnalysis = async () => {
    if (!scripture || selectedHorizons.length === 0 || !userAnalysis.trim()) {
      toast.error("Please provide scripture, select horizon(s), and write your analysis");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "grade_three_heavens",
          scripture,
          scriptureReference,
          selectedHorizons,
          userAnalysis,
          trainingMode: mode,
          drillType
        }
      });

      if (error) throw error;

      setGrade({
        score: data?.score || 0,
        feedback: data?.feedback || "Analysis received.",
        horizonAccuracy: data?.horizonAccuracy || "",
        markerAnalysis: data?.markerAnalysis || "",
        fulfillmentCheck: data?.fulfillmentCheck || "",
        recommendations: data?.recommendations || []
      });

      if (data?.score >= 80) {
        toast.success(`Excellent horizon discernment! Score: ${data.score}/100`);
      } else if (data?.score >= 60) {
        toast.info(`Good analysis. Score: ${data.score}/100. Review the feedback.`);
      } else {
        toast.warning(`Needs improvement. Score: ${data.score}/100. Check the horizon markers.`);
      }
    } catch (error) {
      console.error("Error grading analysis:", error);
      toast.error("Failed to grade analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetDrill = () => {
    setScripture("");
    setScriptureReference("");
    setSelectedHorizons([]);
    setUserAnalysis("");
    setGrade(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getMasteryLevel = (score: number) => {
    if (score >= 90) return { level: 5, title: "Prophetic Cartographer 🗺️", description: "Navigates all horizons with precision" };
    if (score >= 80) return { level: 4, title: "Horizon Master", description: "Distinguishes fulfillments accurately" };
    if (score >= 70) return { level: 3, title: "Telescope Operator", description: "Sees layers clearly" };
    if (score >= 60) return { level: 2, title: "Horizon Spotter", description: "Identifies primary horizons" };
    return { level: 1, title: "Learner", description: "Beginning to see depth" };
  };

  return (
    <div className="space-y-6">
      {/* Room Header */}
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Three Heavens Room</CardTitle>
              <CardDescription>Prophetic Horizon Discernment • 1H → 2H → 3H</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <strong>Core Principle:</strong> One prophecy can speak more than once—but not all fulfillments are equal.
            Prophecy often unfolds in: a near historical fulfillment (1H), a greater intermediate fulfillment (2H), 
            and an ultimate final fulfillment (3H).
          </p>
        </CardContent>
      </Card>

      {/* The Three Heavens Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudSun className="h-5 w-5" />
            The Three Horizons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HEAVENS.map(heaven => (
              <div 
                key={heaven.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${heaven.bgColor} ${heaven.borderColor} ${showHeavenDetails === heaven.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setShowHeavenDetails(showHeavenDetails === heaven.id ? null : heaven.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{heaven.icon}</span>
                  <div>
                    <h4 className={`font-bold ${heaven.color}`}>{heaven.name}</h4>
                    <Badge variant="outline" className="text-xs">{heaven.tag}</Badge>
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{heaven.focus}</p>
                <p className="text-xs text-muted-foreground">{heaven.description}</p>
                
                {showHeavenDetails === heaven.id && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    <div>
                      <p className="text-xs font-semibold">Historical Anchor:</p>
                      <p className="text-xs text-muted-foreground">{heaven.historicalAnchor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Key Characteristics:</p>
                      <ul className="text-xs text-muted-foreground list-disc pl-4">
                        {heaven.characteristics.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Time Markers:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {heaven.timeMarkers.map((marker, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{marker}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-semibold text-primary">Core Question:</p>
                      <p className="text-xs italic">{heaven.coreQuestion}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Mode Selection */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as keyof typeof TRAINING_MODES)}>
        <TabsList className="grid w-full grid-cols-3">
          {Object.entries(TRAINING_MODES).map(([key, m]) => {
            const Icon = m.icon;
            return (
              <TabsTrigger key={key} value={key} className="gap-2">
                <Icon className={`h-4 w-4 ${m.color}`} />
                <span className="hidden sm:inline">{m.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(TRAINING_MODES).map(([key, m]) => (
          <TabsContent key={key} value={key}>
            <Card className={m.bgColor}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                  <span className="font-semibold">{m.name} Mode</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                <p className="text-sm mt-2 italic">"{m.prompt}"</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Drill Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Select Drill Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {DRILL_TYPES.map(drill => {
              const Icon = drill.icon;
              return (
                <Button
                  key={drill.id}
                  variant={drillType === drill.id ? "default" : "outline"}
                  className="h-auto py-3 flex flex-col items-start gap-1"
                  onClick={() => setDrillType(drill.id)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{drill.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">{drill.description}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scripture Input */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Scripture Text
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadSampleText}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Sample
              </Button>
              <Button variant="outline" size="sm" onClick={generateScripture} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                Generate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Scripture reference (e.g., Isaiah 65:17-25)"
              value={scriptureReference}
              onChange={(e) => setScriptureReference(e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Enter or paste the prophetic text to analyze..."
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Horizon Selection */}
      {scripture && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Select Horizon(s)
            </CardTitle>
            <CardDescription>
              Click one or more horizons this prophecy addresses. Primary horizon should be identified first.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {HEAVENS.map(heaven => (
                <Button
                  key={heaven.id}
                  variant={selectedHorizons.includes(heaven.id) ? "default" : "outline"}
                  className={`h-auto py-4 flex flex-col items-center gap-2 ${selectedHorizons.includes(heaven.id) ? '' : heaven.bgColor}`}
                  onClick={() => toggleHorizon(heaven.id)}
                >
                  <span className="text-3xl">{heaven.icon}</span>
                  <span className="font-bold">{heaven.name}</span>
                  <Badge variant="secondary">{heaven.tag}</Badge>
                  <span className="text-xs text-center">{heaven.focus}</span>
                </Button>
              ))}
            </div>
            
            {selectedHorizons.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <p className="text-sm">
                  <strong>Selected:</strong>{" "}
                  {selectedHorizons.map(h => {
                    const heaven = HEAVENS.find(hv => hv.id === h);
                    return heaven ? `${heaven.icon} ${heaven.tag}` : h;
                  }).join(" + ")}
                </p>
                {selectedHorizons.length > 1 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Multi-horizon prophecy detected. Explain primary vs secondary in your analysis.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analysis Input */}
      {scripture && selectedHorizons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Your Horizon Analysis
            </CardTitle>
            <CardDescription>
              {currentDrill.instruction}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={`${currentMode.prompt}\n\nInclude:\n• Which horizon is PRIMARY (and why)\n• Textual markers that confirm the horizon(s)\n• Fulfillment status (fulfilled/ongoing/future)\n• Great Controversy perspective (what's being judged/defended)`}
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              rows={8}
            />
            <div className="flex gap-2">
              <Button 
                onClick={submitAnalysis} 
                disabled={isLoading || !userAnalysis.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Submit Analysis
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetDrill}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grade Display */}
      {grade && (
        <Card className={grade.score >= 80 ? "border-green-500/30 bg-green-500/5" : grade.score >= 60 ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${getScoreColor(grade.score)}`} />
                Analysis Result
              </CardTitle>
              <div className="text-right">
                <span className={`text-3xl font-bold ${getScoreColor(grade.score)}`}>
                  {grade.score}/100
                </span>
                <p className="text-sm text-muted-foreground">
                  {getMasteryLevel(grade.score).title}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mastery Badge */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(level => (
                  <Star 
                    key={level}
                    className={`h-5 w-5 ${level <= getMasteryLevel(grade.score).level ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <div>
                <p className="font-medium">{getMasteryLevel(grade.score).title}</p>
                <p className="text-xs text-muted-foreground">{getMasteryLevel(grade.score).description}</p>
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-background border">
                <p className="font-medium flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Overall Feedback
                </p>
                <p className="text-sm text-muted-foreground">{grade.feedback}</p>
              </div>

              {grade.horizonAccuracy && (
                <div className="p-3 rounded-lg bg-background border">
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-blue-500" />
                    Horizon Accuracy
                  </p>
                  <p className="text-sm text-muted-foreground">{grade.horizonAccuracy}</p>
                </div>
              )}

              {grade.markerAnalysis && (
                <div className="p-3 rounded-lg bg-background border">
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-amber-500" />
                    Marker Analysis
                  </p>
                  <p className="text-sm text-muted-foreground">{grade.markerAnalysis}</p>
                </div>
              )}

              {grade.fulfillmentCheck && (
                <div className="p-3 rounded-lg bg-background border">
                  <p className="font-medium flex items-center gap-2 mb-1">
                    <Scale className="h-4 w-4 text-purple-500" />
                    Fulfillment Status
                  </p>
                  <p className="text-sm text-muted-foreground">{grade.fulfillmentCheck}</p>
                </div>
              )}

              {grade.recommendations && grade.recommendations.length > 0 && (
                <div className="p-3 rounded-lg bg-background border">
                  <p className="font-medium flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    Recommendations
                  </p>
                  <ul className="space-y-1">
                    {grade.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">→</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hard Rules Reminder */}
      <Card className="border-red-500/20 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Hard Rules (Do Not Break)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Not every prophecy is Third Heaven</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Near fulfillment (1H) does not cancel ultimate fulfillment (3H)</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Telescoping is controlled, not imaginative</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Jesus often speaks in 2H with 3H extensions—distinguish them</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Primary horizon must ALWAYS be identified first</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
