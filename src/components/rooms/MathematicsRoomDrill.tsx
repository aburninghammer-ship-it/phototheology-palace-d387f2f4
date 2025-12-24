import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Calculator, Clock, Play, Send, RefreshCw, Loader2, CheckCircle, 
  XCircle, Trophy, Sparkles, BookOpen, Timer, Target, Brain,
  Zap, AlertTriangle, ChevronRight, Award, HelpCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// The 6 Time-Prophecy Matrix (Fixed Canon)
const TIME_PROPHECIES = [
  {
    code: "@120",
    name: "120 Years",
    meaning: "Probation before judgment",
    theme: "Mercy limit",
    description: "The 120 years of Noah's warning before the Flood represents God's patience and probation period before divine judgment falls.",
    scriptureRef: "Genesis 6:3",
    example: "Universal probation extended before closure; love before judgment"
  },
  {
    code: "@400",
    name: "400 Years",
    meaning: "Affliction before deliverance",
    theme: "Covenant oppression",
    description: "The 400 years of Egyptian bondage before the Exodus shows how God delivers His people from covenant oppression after a set time.",
    scriptureRef: "Genesis 15:13",
    example: "Deliverance after affliction; Christ enters humanity's bondage to sin"
  },
  {
    code: "@70y",
    name: "70 Years",
    meaning: "Captivity → restoration",
    theme: "Discipline",
    description: "The 70 years of Babylonian captivity before restoration demonstrates God's disciplinary timeline and restoration promise.",
    scriptureRef: "Jeremiah 29:10",
    example: "Exile → return; alienation → restoration through belief"
  },
  {
    code: "@490",
    name: "70 Weeks (490 Years)",
    meaning: "Messiah & covenant confirmation",
    theme: "Redemption",
    description: "Daniel's 70 weeks prophecy precisely times the Messiah's ministry, death, and the confirmation of the new covenant.",
    scriptureRef: "Daniel 9:24-27",
    example: "Gift of the Son; covenant confirmation; fulfillment of Daniel 9"
  },
  {
    code: "@1260",
    name: "1260 Years",
    meaning: "Suppressed truth under counterfeit authority",
    theme: "Persecution",
    description: "The 1260-year papal supremacy period when biblical truth was suppressed and God's people persecuted.",
    scriptureRef: "Daniel 7:25; Revelation 12:6,14",
    example: "Truth suppressed during medieval distortion; light shining in long darkness"
  },
  {
    code: "@2300",
    name: "2300 Years",
    meaning: "Cosmic judgment & cleansing",
    theme: "Final resolution",
    description: "The 2300-day prophecy leading to the sanctuary cleansing and investigative judgment before Christ's return.",
    scriptureRef: "Daniel 8:14",
    example: "Investigative separation; belief vs rejection; eschatological horizon"
  }
];

// Drill Types
const DRILL_TYPES = [
  { 
    id: "identify", 
    name: "Time Signature Identification", 
    icon: Target,
    description: "Identify which prophetic time structure is dominant and explain why",
    prompt: "Which prophetic time structure is DOMINANT in this verse? Why does it not primarily belong to the others?"
  },
  { 
    id: "translate", 
    name: "Cross-Time Translation", 
    icon: RefreshCw,
    description: "Translate the verse into another time structure without changing theological meaning",
    prompt: "Translate this verse into another prophetic time structure without changing its theological meaning."
  },
  { 
    id: "hidden", 
    name: "Hidden Time Detection", 
    icon: HelpCircle,
    description: "Find implicit time prophecy in verses with no explicit time reference",
    prompt: "This verse contains no explicit time reference. Identify the IMPLICIT time prophecy embedded in its logic."
  },
  { 
    id: "collision", 
    name: "Time Collision", 
    icon: Zap,
    description: "Identify when two time structures overlap and explain the resolution",
    prompt: "Two prophetic time structures overlap in this verse. Identify the tension and explain how Scripture resolves it."
  },
  { 
    id: "validate", 
    name: "False Mapping Check", 
    icon: AlertTriangle,
    description: "Refute or affirm a claim about which time prophecy applies",
    prompt: "A student claims this verse belongs to a specific time prophecy. Evaluate whether this claim is valid with precision."
  }
];

// Practice Modes
const PRACTICE_MODES = [
  { 
    id: "beginner", 
    name: "Beginner", 
    color: "bg-green-500",
    badge: "🟢",
    description: "Recognition - One-to-one mapping only",
    maxMappings: 1
  },
  { 
    id: "intermediate", 
    name: "Intermediate", 
    color: "bg-yellow-500",
    badge: "🟡",
    description: "Multi-Mapping - Connect verse to 2-3 time structures",
    maxMappings: 3
  },
  { 
    id: "master", 
    name: "Master", 
    color: "bg-red-500",
    badge: "🔴",
    description: "Full Compression - All 6 structures, no redundancy",
    maxMappings: 6
  }
];

interface MathematicsRoomDrillProps {
  onComplete?: (score: number) => void;
}

interface GradeResult {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  mappingScores?: { prophecy: string; valid: boolean; reason: string }[];
}

export function MathematicsRoomDrill({ onComplete }: MathematicsRoomDrillProps) {
  const { user } = useAuth();
  const [phase, setPhase] = useState<"setup" | "learn" | "ready" | "active" | "grading" | "result" | "summary">("setup");
  const [verse, setVerse] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [practiceMode, setPracticeMode] = useState<"beginner" | "intermediate" | "master">("beginner");
  const [drillType, setDrillType] = useState<string>("identify");
  const [timeLimit, setTimeLimit] = useState<number>(180);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedProphecies, setSelectedProphecies] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [completedRounds, setCompletedRounds] = useState<{verse: string, score: number, mode: string}[]>([]);
  const [showReference, setShowReference] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "active" && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timeRemaining]);

  const handleTimeUp = () => {
    if (answer.trim()) {
      handleSubmitAnswer();
    } else {
      toast.error("Time's up! No answer submitted.");
      setGradeResult({
        score: 0,
        feedback: "Time expired without an answer. Time prophecy requires diligent study!",
        strengths: [],
        improvements: ["Study the six time prophecies more deeply", "Start with beginner mode"]
      });
      setPhase("result");
    }
  };

  const getRandomVerse = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { 
          message: `Give me ONE Bible verse for Mathematics Room practice. This verse should connect to prophetic time structures (120 years, 400 years, 70 years, 70 weeks/490 years, 1260 years, or 2300 years).

Return ONLY in this exact format:
REFERENCE: [Book Chapter:Verse]
TEXT: [The verse text]

Choose a verse with clear time-prophecy potential.`,
          conversation_history: [],
          mode: "mathematics_verse"
        }
      });

      if (error) throw error;

      const content = data?.content || "";
      const refMatch = content.match(/REFERENCE:\s*(.+)/i);
      const textMatch = content.match(/TEXT:\s*(.+)/is);
      
      if (refMatch && textMatch) {
        setVerseReference(refMatch[1].trim());
        setVerse(textMatch[1].trim().replace(/\n.*$/s, ''));
      } else {
        // Fallback to John 3:16 for full analysis
        setVerseReference("John 3:16");
        setVerse("For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.");
      }
    } catch (error) {
      console.error("Error getting verse:", error);
      setVerseReference("Daniel 9:24");
      setVerse("Seventy weeks are determined upon thy people and upon thy holy city, to finish the transgression, and to make an end of sins, and to make reconciliation for iniquity, and to bring in everlasting righteousness, and to seal up the vision and prophecy, and to anoint the most Holy.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProphecy = (code: string) => {
    const mode = PRACTICE_MODES.find(m => m.id === practiceMode);
    const maxAllowed = mode?.maxMappings || 1;
    
    if (selectedProphecies.includes(code)) {
      setSelectedProphecies(prev => prev.filter(p => p !== code));
    } else if (selectedProphecies.length < maxAllowed) {
      setSelectedProphecies(prev => [...prev, code]);
    } else {
      toast.error(`${mode?.name} mode allows only ${maxAllowed} selection(s)`);
    }
  };

  const startDrill = () => {
    setTimeRemaining(timeLimit);
    setAnswer("");
    setSelectedProphecies([]);
    setPhase("active");
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    
    setPhase("grading");
    setIsGrading(true);

    const selectedDrill = DRILL_TYPES.find(d => d.id === drillType);
    const mode = PRACTICE_MODES.find(m => m.id === practiceMode);
    const prophecyDetails = selectedProphecies.map(code => 
      TIME_PROPHECIES.find(p => p.code === code)
    ).filter(Boolean);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: { 
          message: `MATHEMATICS ROOM GRADING - Grade this time-prophecy analysis:

VERSE: ${verseReference} - "${verse}"

PRACTICE MODE: ${mode?.name} (${mode?.description})
DRILL TYPE: ${selectedDrill?.name}
DRILL PROMPT: ${selectedDrill?.prompt}

STUDENT SELECTED TIME PROPHECIES: ${prophecyDetails.map(p => `${p?.code} (${p?.name})`).join(', ') || 'None selected'}

STUDENT'S ANALYSIS:
"${answer}"

TIME LIMIT: ${timeLimit} seconds

THE SIX TIME PROPHECIES (FIXED CANON):
1. @120 (120 Years) - Probation before judgment / Mercy limit
2. @400 (400 Years) - Affliction before deliverance / Covenant oppression  
3. @70y (70 Years) - Captivity → restoration / Discipline
4. @490 (70 Weeks) - Messiah & covenant confirmation / Redemption
5. @1260 (1260 Years) - Suppressed truth under counterfeit authority / Persecution
6. @2300 (2300 Years) - Cosmic judgment & cleansing / Final resolution

ANTI-HALLUCINATION RULES:
- Never invent new time periods
- Never confuse symbolic and literal time
- Every mapping must include WHY, a BOUNDARY, and a LIMITATION

Grade this answer on a scale of 0-100:
1. Accuracy - Are the time prophecy connections correct?
2. Precision - No invented time periods, proper distinction of literal/symbolic
3. Depth - Is there meaningful theological insight?
4. Boundaries - Does the answer explain WHY and recognize limitations?
5. Christ-Centeredness - Does it connect to redemption?

Respond in this EXACT format:
SCORE: [0-100]
FEEDBACK: [2-3 sentence assessment with theological precision]
STRENGTHS: [comma-separated list]
IMPROVEMENTS: [comma-separated list]
MAPPING_VALIDITY: [For each prophecy selected: CODE:VALID/INVALID:brief reason]`,
          conversation_history: [],
          mode: "mathematics_grade"
        }
      });

      if (error) throw error;

      const content = data?.content || "";
      const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
      const feedbackMatch = content.match(/FEEDBACK:\s*(.+?)(?=STRENGTHS:|$)/is);
      const strengthsMatch = content.match(/STRENGTHS:\s*(.+?)(?=IMPROVEMENTS:|$)/is);
      const improvementsMatch = content.match(/IMPROVEMENTS:\s*(.+?)(?=MAPPING_VALIDITY:|$)/is);
      const mappingMatch = content.match(/MAPPING_VALIDITY:\s*(.+?)$/is);

      const mappingScores: { prophecy: string; valid: boolean; reason: string }[] = [];
      if (mappingMatch) {
        const mappings = mappingMatch[1].split(/[@,\n]/).filter(Boolean);
        mappings.forEach(m => {
          const parts = m.split(':');
          if (parts.length >= 2) {
            mappingScores.push({
              prophecy: parts[0].trim(),
              valid: parts[1].trim().toUpperCase() === 'VALID',
              reason: parts[2]?.trim() || ''
            });
          }
        });
      }

      const result: GradeResult = {
        score: scoreMatch ? parseInt(scoreMatch[1]) : 70,
        feedback: feedbackMatch ? feedbackMatch[1].trim() : "Good analysis of time prophecy structures!",
        strengths: strengthsMatch ? strengthsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : ["Completed analysis"],
        improvements: improvementsMatch ? improvementsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : ["Continue studying"],
        mappingScores
      };

      setGradeResult(result);
      setTotalScore(prev => prev + result.score);
      setCompletedRounds(prev => [...prev, {
        verse: verseReference,
        score: result.score,
        mode: practiceMode
      }]);
      setPhase("result");
    } catch (error) {
      console.error("Error grading:", error);
      setGradeResult({
        score: 50,
        feedback: "Unable to grade fully, but you engaged with time prophecy!",
        strengths: ["Submitted an analysis"],
        improvements: ["Keep studying the six time structures"]
      });
      setPhase("result");
    } finally {
      setIsGrading(false);
    }
  };

  const nextRound = () => {
    if (roundNumber >= 5) {
      setPhase("summary");
      onComplete?.(Math.round(totalScore / 5));
    } else {
      setRoundNumber(prev => prev + 1);
      setGradeResult(null);
      setVerse("");
      setVerseReference("");
      setPhase("setup");
    }
  };

  const resetDrill = () => {
    setPhase("setup");
    setVerse("");
    setVerseReference("");
    setTimeRemaining(0);
    setSelectedProphecies([]);
    setAnswer("");
    setGradeResult(null);
    setRoundNumber(1);
    setTotalScore(0);
    setCompletedRounds([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / timeLimit) * 100;
    if (percentage > 50) return "text-green-500";
    if (percentage > 25) return "text-yellow-500";
    return "text-red-500 animate-pulse";
  };

  const getModeColor = (modeId: string) => {
    const colors: Record<string, string> = {
      beginner: "border-green-500/50 bg-green-500/10",
      intermediate: "border-yellow-500/50 bg-yellow-500/10",
      master: "border-red-500/50 bg-red-500/10"
    };
    return colors[modeId] || "";
  };

  // Learn Phase - Time Prophecy Reference
  if (phase === "learn") {
    return (
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            The 6 Time-Prophecy Matrix
          </CardTitle>
          <CardDescription>
            These are the ONLY valid time constants in the Mathematics Room. Study them well.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {TIME_PROPHECIES.map((prophecy) => (
              <div 
                key={prophecy.code}
                className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-600 shrink-0">{prophecy.code}</Badge>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{prophecy.name}</span>
                      <Badge variant="outline" className="text-xs">{prophecy.theme}</Badge>
                    </div>
                    <p className="text-sm font-medium text-primary mt-1">{prophecy.meaning}</p>
                    <p className="text-sm text-muted-foreground mt-1">{prophecy.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      📖 {prophecy.scriptureRef}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Anti-Hallucination Guardrails</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Never invent new time periods</li>
                  <li>• Never confuse symbolic and literal time</li>
                  <li>• Every mapping must include WHY, a BOUNDARY, and a LIMITATION</li>
                </ul>
              </div>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={() => setPhase("setup")}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Continue to Practice
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Setup Phase
  if (phase === "setup") {
    return (
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-purple-500" />
            Mathematics Room
          </CardTitle>
          <CardDescription>
            Train to recognize time-prophecy structures in Scripture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setPhase("learn")}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Review the 6 Time Prophecies
          </Button>

          {/* Practice Mode Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Practice Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {PRACTICE_MODES.map((mode) => (
                <Button
                  key={mode.id}
                  variant={practiceMode === mode.id ? "default" : "outline"}
                  onClick={() => setPracticeMode(mode.id as any)}
                  className={`flex-col h-auto py-3 ${practiceMode === mode.id ? '' : getModeColor(mode.id)}`}
                >
                  <span className="text-lg">{mode.badge}</span>
                  <span className="text-xs">{mode.name}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {PRACTICE_MODES.find(m => m.id === practiceMode)?.description}
            </p>
          </div>

          {/* Drill Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Drill Type</label>
            <Select value={drillType} onValueChange={setDrillType}>
              <SelectTrigger>
                <SelectValue placeholder="Select drill type" />
              </SelectTrigger>
              <SelectContent>
                {DRILL_TYPES.map((drill) => (
                  <SelectItem key={drill.id} value={drill.id}>
                    <div className="flex items-center gap-2">
                      <drill.icon className="h-4 w-4" />
                      {drill.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {DRILL_TYPES.find(d => d.id === drillType)?.description}
            </p>
          </div>

          {/* Verse Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Verse</label>
            <div className="space-y-2">
              <Input 
                placeholder="e.g., Daniel 9:24"
                value={verseReference}
                onChange={(e) => setVerseReference(e.target.value)}
              />
              <Textarea 
                placeholder="Enter verse text or let Jeeves pick one..."
                value={verse}
                onChange={(e) => setVerse(e.target.value)}
                rows={3}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={getRandomVerse}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Getting verse...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Let Jeeves Pick a Verse</>
              )}
            </Button>
          </div>

          {/* Time Limit Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" /> Time Limit
            </label>
            <div className="flex gap-2">
              {[120, 180, 300].map((time) => (
                <Button
                  key={time}
                  variant={timeLimit === time ? "default" : "outline"}
                  onClick={() => setTimeLimit(time)}
                  className="flex-1"
                >
                  {time / 60} min
                </Button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            size="lg"
            disabled={!verse.trim() || !verseReference.trim()}
            onClick={() => setPhase("ready")}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Mathematics Drill
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Ready Phase
  if (phase === "ready") {
    const selectedDrill = DRILL_TYPES.find(d => d.id === drillType);
    const mode = PRACTICE_MODES.find(m => m.id === practiceMode);
    
    return (
      <Card className="border-2 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-purple-500" />
              Round {roundNumber} of 5
            </span>
            <div className="flex items-center gap-2">
              <Badge className={mode?.color}>{mode?.badge} {mode?.name}</Badge>
              <Badge variant="outline">{timeLimit / 60} min</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary/5 rounded-lg border">
            <p className="text-sm font-medium text-primary mb-2">{verseReference}</p>
            <p className="text-lg italic">"{verse}"</p>
          </div>

          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-2">
              {selectedDrill && <selectedDrill.icon className="h-5 w-5 text-purple-500" />}
              <span className="font-bold">{selectedDrill?.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedDrill?.prompt}</p>
          </div>

          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              When you start, select time prophecies and write your analysis.
            </p>
            <p className="text-sm text-muted-foreground">
              {mode?.name} mode: Select up to {mode?.maxMappings} time structure(s)
            </p>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            size="lg"
            onClick={startDrill}
          >
            <Play className="h-5 w-5 mr-2" />
            Start Timer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active Phase
  if (phase === "active") {
    const selectedDrill = DRILL_TYPES.find(d => d.id === drillType);
    const mode = PRACTICE_MODES.find(m => m.id === practiceMode);
    
    return (
      <Card className="border-2 border-purple-500/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline">Round {roundNumber}/5 • {mode?.name}</Badge>
            <div className={`flex items-center gap-2 text-2xl font-bold ${getTimerColor()}`}>
              <Clock className="h-6 w-6" />
              {formatTime(timeRemaining)}
            </div>
          </div>
          <Progress value={(timeRemaining / timeLimit) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verse */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-primary">{verseReference}</p>
            <p className="text-sm italic">"{verse}"</p>
          </div>

          {/* Drill Prompt */}
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-1">
              {selectedDrill && <selectedDrill.icon className="h-4 w-4 text-purple-500" />}
              <span className="font-semibold text-sm">{selectedDrill?.name}</span>
            </div>
            <p className="text-xs text-muted-foreground">{selectedDrill?.prompt}</p>
          </div>

          {/* Time Prophecy Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Select Time Prophecies ({selectedProphecies.length}/{mode?.maxMappings}):</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReference(!showReference)}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                {showReference ? "Hide" : "Show"} Reference
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {TIME_PROPHECIES.map((prophecy) => (
                <Button
                  key={prophecy.code}
                  variant={selectedProphecies.includes(prophecy.code) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleProphecy(prophecy.code)}
                  className="justify-start text-left h-auto py-2"
                >
                  <div>
                    <div className="font-bold">{prophecy.code}</div>
                    <div className="text-xs opacity-80">{prophecy.name}</div>
                  </div>
                </Button>
              ))}
            </div>

            {showReference && (
              <div className="p-3 bg-muted/50 rounded-lg text-xs space-y-1 max-h-32 overflow-y-auto">
                {TIME_PROPHECIES.map((p) => (
                  <div key={p.code}>
                    <span className="font-bold">{p.code}</span>: {p.meaning} ({p.theme})
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Analysis:</label>
            <Textarea
              placeholder="Explain how this verse connects to the selected time prophecy/prophecies. Include WHY, boundaries, and limitations..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="resize-none"
              autoFocus
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || selectedProphecies.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Grading Phase
  if (phase === "grading") {
    return (
      <Card className="border-2 border-primary/30">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Jeeves is evaluating...</p>
          <p className="text-sm text-muted-foreground">Checking time-prophecy accuracy</p>
        </CardContent>
      </Card>
    );
  }

  // Result Phase
  if (phase === "result" && gradeResult) {
    const isPassing = gradeResult.score >= 60;
    const scoreLabel = gradeResult.score >= 90 ? "Mastery" : 
                       gradeResult.score >= 70 ? "Proficient" :
                       gradeResult.score >= 50 ? "Developing" : "Needs Study";
    
    return (
      <Card className={`border-2 ${isPassing ? 'border-green-500/50' : 'border-orange-500/50'}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isPassing ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-orange-500" />
              )}
              Round {roundNumber} Complete
            </span>
            <div className="text-right">
              <div className="text-3xl font-bold">{gradeResult.score}</div>
              <div className="text-xs text-muted-foreground">{scoreLabel}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{gradeResult.feedback}</p>

          {gradeResult.mappingScores && gradeResult.mappingScores.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Mapping Validity:</p>
              {gradeResult.mappingScores.map((mapping, idx) => (
                <div key={idx} className={`p-2 rounded text-sm flex items-center gap-2 ${
                  mapping.valid ? 'bg-green-500/10' : 'bg-red-500/10'
                }`}>
                  {mapping.valid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-bold">{mapping.prophecy}</span>
                  <span className="text-muted-foreground">- {mapping.reason}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <p className="text-xs font-medium text-green-600 mb-1">Strengths</p>
              <ul className="text-xs space-y-1">
                {gradeResult.strengths.map((s, i) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <p className="text-xs font-medium text-orange-600 mb-1">To Improve</p>
              <ul className="text-xs space-y-1">
                {gradeResult.improvements.map((s, i) => (
                  <li key={i}>→ {s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={nextRound}>
              <ChevronRight className="h-4 w-4 mr-2" />
              {roundNumber >= 5 ? "View Summary" : "Next Round"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Summary Phase
  if (phase === "summary") {
    const avgScore = Math.round(totalScore / 5);
    const masteryLevel = avgScore >= 90 ? "Time Architect" :
                         avgScore >= 75 ? "Prophetic Mathematician" :
                         avgScore >= 60 ? "Chronos Reader" : "Student";
    
    return (
      <Card className="border-2 border-purple-500/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Trophy className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Mathematics Room Complete!</CardTitle>
          <CardDescription>5 Rounds of Time-Prophecy Analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{avgScore}</div>
            <Badge className="bg-purple-600">{masteryLevel}</Badge>
          </div>

          <div className="space-y-2">
            {completedRounds.map((round, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/50">
                <span className="text-sm">{round.verse}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{round.mode}</Badge>
                  <span className="font-bold">{round.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <p className="font-semibold text-center mb-2">Achievement Badges</p>
            <div className="flex justify-center gap-3">
              {avgScore >= 60 && (
                <div className="text-center">
                  <div className="text-2xl">📖</div>
                  <div className="text-xs">Chronos Reader</div>
                </div>
              )}
              {avgScore >= 75 && (
                <div className="text-center">
                  <div className="text-2xl">🔢</div>
                  <div className="text-xs">Prophetic Math</div>
                </div>
              )}
              {avgScore >= 90 && (
                <div className="text-center">
                  <div className="text-2xl">🏛️</div>
                  <div className="text-xs">Time Architect</div>
                </div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={resetDrill}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Practice Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
