import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Droplets, 
  BookOpen, 
  FileText, 
  Library,
  Timer,
  Brain,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Trophy,
  Target,
  Zap,
  Scale
} from "lucide-react";

// Juicing modes configuration
const JUICING_MODES = {
  micro: {
    id: "micro",
    name: "Micro-Juicing",
    icon: Droplets,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    description: "Verse Level — Pull much from little",
    question: "How much can I legitimately pull from one text?",
    outputs: [
      "Doctrinal juice",
      "Narrative juice", 
      "Character/Christological juice",
      "Practical juice",
      "Prophetic or covenantal juice (if present)"
    ]
  },
  meso: {
    id: "meso",
    name: "Meso-Juicing",
    icon: FileText,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    description: "Chapter Level — Pull structure",
    question: "Can this chapter preach itself?",
    outputs: [
      "Central tension",
      "Flow of argument",
      "Key repeated ideas",
      "What this chapter adds that the Bible would lose without it"
    ]
  },
  macro: {
    id: "macro",
    name: "Macro-Juicing",
    icon: Library,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    description: "Book Level — Pull essence",
    question: "Can I explain this book accurately in under 60 seconds?",
    outputs: [
      "One-sentence thesis",
      "One-paragraph summary",
      "One-word identity",
      "What problem this book solves in Scripture"
    ]
  }
};

// Drill types
const DRILL_TYPES = [
  {
    id: "verse_explosion",
    name: "Verse Explosion",
    icon: Zap,
    description: "Extract at least 5 distinct truths from a single verse",
    prompt: "Extract at least 5 distinct truths from this single verse. No truth may repeat another in different words.",
    mode: "micro"
  },
  {
    id: "chapter_skeleton",
    name: "Chapter Skeleton",
    icon: Target,
    description: "Strip a chapter to its skeletal argument",
    prompt: "Strip this chapter down to its skeletal argument. No illustrations. No applications. Only logic.",
    mode: "meso"
  },
  {
    id: "book_in_breath",
    name: "Book-in-a-Breath",
    icon: Brain,
    description: "Explain a book in three sentences",
    prompt: "Explain this entire book in three sentences to a new believer.",
    mode: "macro"
  },
  {
    id: "compression_ladder",
    name: "Compression Ladder",
    icon: Scale,
    description: "Progressive compression: paragraph → sentence → 5 words → 1 word",
    prompt: "Explain this book in: 1) One paragraph, 2) One sentence, 3) Five words, 4) One word.",
    mode: "macro"
  },
  {
    id: "over_juicing_check",
    name: "Over-Juicing Check",
    icon: XCircle,
    description: "Identify if a claim is juice or pulp",
    prompt: "A student claims this verse teaches a specific doctrine. Identify whether this is legitimate juice or imported pulp—and explain why.",
    mode: "micro"
  }
];

// Scoring levels
const SCORING_LEVELS = [
  { level: 1, description: "Extracts obvious meaning", badge: null },
  { level: 2, description: "Identifies structure", badge: null },
  { level: 3, description: "Compresses accurately", badge: "Text Juicer" },
  { level: 4, description: "Balances depth and clarity", badge: "Chapter Distiller" },
  { level: 5, description: "Explains Scripture simply without loss", badge: "Biblical Sommelier 🧃" }
];

interface JuiceGrade {
  score: number;
  level: number;
  feedback: string;
  juiceExtracted: string[];
  pulpIdentified: string[];
  suggestions: string[];
  badge?: string;
}

export const JuiceRoomDrill = () => {
  const { user } = useAuth();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<typeof DRILL_TYPES[0] | null>(null);
  const [textInput, setTextInput] = useState("");
  const [reference, setReference] = useState("");
  const [userAnalysis, setUserAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState<JuiceGrade | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(3);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [drillStarted, setDrillStarted] = useState(false);

  const fetchScriptureText = async () => {
    if (!reference.trim()) {
      toast.error("Please enter a Scripture reference");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves-chat", {
        body: {
          message: `Provide the full text of ${reference} from the KJV Bible. Return ONLY the Scripture text, no commentary or introduction.`,
          context: "Scripture lookup for Juice Room drill"
        }
      });

      if (error) throw error;
      setTextInput(data.response || "");
      toast.success("Scripture loaded!");
    } catch (error) {
      console.error("Error fetching Scripture:", error);
      toast.error("Failed to fetch Scripture text");
    } finally {
      setIsLoading(false);
    }
  };

  const startDrill = () => {
    if (!textInput.trim()) {
      toast.error("Please provide Scripture text first");
      return;
    }
    setDrillStarted(true);
    setTimeRemaining(selectedTimeLimit * 60);
    setTimerActive(true);
    
    // Start timer
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          toast.warning("Time's up! Submit your analysis.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const gradeAnalysis = async () => {
    if (!userAnalysis.trim()) {
      toast.error("Please provide your analysis");
      return;
    }

    setIsGrading(true);
    setTimerActive(false);

    try {
      const mode = JUICING_MODES[selectedMode as keyof typeof JUICING_MODES];
      const drillPrompt = selectedDrill?.prompt || "";

      const { data, error } = await supabase.functions.invoke("jeeves-chat", {
        body: {
          message: `You are grading a Juice Room drill in the ${mode.name} mode.

SCRIPTURE TEXT:
"${textInput}"

REFERENCE: ${reference}

DRILL TYPE: ${selectedDrill?.name || "Free Juicing"}
DRILL INSTRUCTION: ${drillPrompt || mode.question}

REQUIRED OUTPUTS FOR THIS MODE:
${mode.outputs.map((o, i) => `${i + 1}. ${o}`).join('\n')}

STUDENT'S ANALYSIS:
"${userAnalysis}"

GUARDRAILS - The student must NOT:
- Add ideas not present in the text
- Flatten the text into clichés
- Confuse summary with commentary
- Import theology not anchored in the text

SCORING CRITERIA:
Level 1: Extracts obvious meaning only
Level 2: Identifies structure
Level 3: Compresses accurately
Level 4: Balances depth and clarity
Level 5: Explains Scripture simply without loss

Grade this analysis and return a JSON object with:
{
  "score": (0-100),
  "level": (1-5),
  "feedback": "Overall assessment",
  "juiceExtracted": ["List of legitimate truths the student extracted"],
  "pulpIdentified": ["Any ideas the student incorrectly imported or overstated"],
  "suggestions": ["Specific improvements"],
  "badge": "Award badge if level 3+ (Text Juicer, Chapter Distiller, Canon Compressor, or Biblical Sommelier)"
}

Be rigorous. If they added ideas not in the text, mark as pulp. If they missed major juice, note it.`,
          context: "Juice Room grading"
        }
      });

      if (error) throw error;

      // Parse the grade from response
      const responseText = data.response || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const gradeData = JSON.parse(jsonMatch[0]) as JuiceGrade;
        setGrade(gradeData);
        setTotalScore(prev => prev + gradeData.score);

        if (gradeData.badge) {
          toast.success(`🧃 Badge Earned: ${gradeData.badge}!`);
        }
      } else {
        throw new Error("Could not parse grade");
      }
    } catch (error) {
      console.error("Error grading:", error);
      toast.error("Failed to grade analysis");
    } finally {
      setIsGrading(false);
    }
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    setTextInput("");
    setReference("");
    setUserAnalysis("");
    setGrade(null);
    setDrillStarted(false);
    setTimeRemaining(null);
  };

  const resetDrill = () => {
    setSelectedMode(null);
    setSelectedDrill(null);
    setTextInput("");
    setReference("");
    setUserAnalysis("");
    setGrade(null);
    setRound(1);
    setTotalScore(0);
    setDrillStarted(false);
    setTimeRemaining(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mode selection
  if (!selectedMode) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Droplets className="h-6 w-6 text-primary" />
            The Juice Room
          </h2>
          <p className="text-muted-foreground">
            Extract maximum meaning with minimum waste
          </p>
          <p className="text-sm italic text-muted-foreground">
            Mantra: Much from little. Little from much.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(JUICING_MODES).map((mode) => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedMode(mode.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${mode.bgColor} flex items-center justify-center mb-2`}>
                    <Icon className={`h-6 w-6 ${mode.color}`} />
                  </div>
                  <CardTitle className="text-lg">{mode.name}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    "{mode.question}"
                  </p>
                  <div className="space-y-1">
                    {mode.outputs.slice(0, 3).map((output, i) => (
                      <p key={i} className="text-xs text-muted-foreground">• {output}</p>
                    ))}
                    {mode.outputs.length > 3 && (
                      <p className="text-xs text-muted-foreground">+ {mode.outputs.length - 3} more...</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Mastery Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {SCORING_LEVELS.filter(l => l.badge).map((level) => (
                <Badge key={level.level} variant="outline" className="text-xs">
                  Lvl {level.level}: {level.badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMode = JUICING_MODES[selectedMode as keyof typeof JUICING_MODES];
  const ModeIcon = currentMode.icon;

  // Drill selection
  if (!selectedDrill && !drillStarted) {
    const modeDrills = DRILL_TYPES.filter(d => d.mode === selectedMode || selectedMode === "micro");
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${currentMode.bgColor} flex items-center justify-center`}>
              <ModeIcon className={`h-5 w-5 ${currentMode.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentMode.name}</h2>
              <p className="text-sm text-muted-foreground">{currentMode.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedMode(null)}>
            Change Mode
          </Button>
        </div>

        <Tabs defaultValue="drills" className="space-y-4">
          <TabsList>
            <TabsTrigger value="drills">Structured Drills</TabsTrigger>
            <TabsTrigger value="free">Free Juicing</TabsTrigger>
          </TabsList>

          <TabsContent value="drills" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {modeDrills.map((drill) => {
                const DrillIcon = drill.icon;
                return (
                  <Card 
                    key={drill.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedDrill(drill)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <DrillIcon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{drill.name}</CardTitle>
                      </div>
                      <CardDescription>{drill.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="free" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Free Juicing Session
                </CardTitle>
                <CardDescription>
                  Enter any Scripture and extract meaning using the {currentMode.name} approach
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter reference (e.g., John 3:16, Romans 8, or Genesis)"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                  <Button onClick={fetchScriptureText} disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load"}
                  </Button>
                </div>

                {textInput && (
                  <>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm italic">{textInput}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Limit</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 5].map((mins) => (
                          <Button
                            key={mins}
                            variant={selectedTimeLimit === mins ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTimeLimit(mins)}
                          >
                            {mins} min
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button onClick={startDrill} className="w-full">
                      <Timer className="mr-2 h-4 w-4" />
                      Start Juicing
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Drill setup (if drill selected but not started)
  if (selectedDrill && !drillStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${currentMode.bgColor} flex items-center justify-center`}>
              <ModeIcon className={`h-5 w-5 ${currentMode.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedDrill.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedDrill.description}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setSelectedDrill(null)}>
            Change Drill
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup Your Drill</CardTitle>
            <CardDescription>{selectedDrill.prompt}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={`Enter ${selectedDrill.mode === 'micro' ? 'verse' : selectedDrill.mode === 'meso' ? 'chapter' : 'book'} reference`}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <Button onClick={fetchScriptureText} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load"}
              </Button>
            </div>

            {textInput && (
              <>
                <div className="p-4 bg-muted rounded-lg max-h-48 overflow-y-auto">
                  <p className="text-sm italic whitespace-pre-wrap">{textInput}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Limit</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map((mins) => (
                      <Button
                        key={mins}
                        variant={selectedTimeLimit === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeLimit(mins)}
                      >
                        {mins} min
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={startDrill} className="w-full">
                  <Timer className="mr-2 h-4 w-4" />
                  Start Drill
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active drill
  if (drillStarted && !grade) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Round {round}</Badge>
            <span className="text-sm text-muted-foreground">
              {selectedDrill?.name || "Free Juicing"}
            </span>
          </div>
          {timeRemaining !== null && (
            <Badge 
              variant={timeRemaining < 30 ? "destructive" : "secondary"}
              className="text-lg px-3 py-1"
            >
              <Timer className="mr-1 h-4 w-4" />
              {formatTime(timeRemaining)}
            </Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {reference}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
              <p className="text-sm italic whitespace-pre-wrap">{textInput}</p>
            </div>

            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-medium text-primary">
                {selectedDrill?.prompt || currentMode.question}
              </p>
              <div className="mt-2 space-y-1">
                {currentMode.outputs.map((output, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {output}</p>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Extract the juice... What truths, structures, and meanings can you pull from this text?"
              value={userAnalysis}
              onChange={(e) => setUserAnalysis(e.target.value)}
              className="min-h-[200px]"
            />

            <Button 
              onClick={gradeAnalysis} 
              disabled={isGrading || !userAnalysis.trim()}
              className="w-full"
            >
              {isGrading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Analysis
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Grade display
  if (grade) {
    const levelInfo = SCORING_LEVELS.find(l => l.level === grade.level);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Round {round} Complete</Badge>
          <Badge variant="secondary">Total: {totalScore} pts</Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Juice Analysis
              </CardTitle>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{grade.score}/100</div>
                <Badge className={grade.level >= 3 ? "bg-green-500" : grade.level >= 2 ? "bg-yellow-500" : "bg-red-500"}>
                  Level {grade.level}
                </Badge>
              </div>
            </div>
            {levelInfo && (
              <CardDescription>{levelInfo.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{grade.feedback}</p>
            </div>

            {grade.juiceExtracted.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Juice Extracted
                </h4>
                <ul className="space-y-1">
                  {grade.juiceExtracted.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {grade.pulpIdentified.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Pulp Identified (Over-juiced)
                </h4>
                <ul className="space-y-1">
                  {grade.pulpIdentified.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {grade.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suggestions
                </h4>
                <ul className="space-y-1">
                  {grade.suggestions.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground pl-6">• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {grade.badge && (
              <div className="p-4 bg-primary/10 rounded-lg text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold text-primary">{grade.badge}</p>
                <p className="text-sm text-muted-foreground">Badge Earned!</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={nextRound} className="flex-1">
                Next Round
              </Button>
              <Button variant="outline" onClick={resetDrill}>
                New Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
