import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  Eye, Target, Layers, ArrowLeftRight, User, 
  Timer, CheckCircle2, XCircle, Sparkles, BookOpen,
  Zap, Trophy, ChevronRight, RefreshCw, Play, 
  Pause, Crown, Sword, Heart, Scale, Users
} from "lucide-react";
import { toast } from "sonner";

// The Five Christ Tracers - core patterns to recognize
const CHRIST_TRACERS = [
  { 
    id: "innocent_sufferer", 
    name: "The Innocent Sufferer", 
    icon: Crown,
    description: "Prefigures Christ's unjust suffering",
    examples: ["Joseph", "David", "Jeremiah", "Job"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  { 
    id: "substitute", 
    name: "The Substitute", 
    icon: Sword,
    description: "Points to atonement and substitution",
    examples: ["Passover lamb", "Ram for Isaac", "Scapegoat", "Burnt offerings"],
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30"
  },
  { 
    id: "deliverer", 
    name: "The Deliverer", 
    icon: Users,
    description: "Foreshadows Christ's redemptive role",
    examples: ["Moses", "Judges", "Kings", "Shepherds"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30"
  },
  { 
    id: "mediator", 
    name: "The Covenant Mediator", 
    icon: Scale,
    description: "Reveals Christ as mediator between God and humanity",
    examples: ["Prophets", "Priests", "Intercessors", "Moses at Sinai"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  { 
    id: "restorer", 
    name: "The Restorer / Bridegroom / King", 
    icon: Heart,
    description: "Anticipates Christ's reign and union with His people",
    examples: ["Boaz", "Solomon", "Davidic kingship", "Hosea's redemption"],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  }
];

// Pattern types to identify
const PATTERN_TYPES = [
  "Sacrifice", "Deliverer", "High Priest", "King", "Shepherd",
  "Bridegroom", "Temple", "Light", "Word", "Prophet", "Judge"
];

// Training passages with Christ connections
const TRAINING_PASSAGES = [
  {
    id: 1,
    reference: "Genesis 22:1-14",
    title: "Abraham Offers Isaac",
    text: "And Abraham took the wood of the burnt offering, and laid it upon Isaac his son; and he took the fire in his hand, and a knife; and they went both of them together. And Isaac spake unto Abraham his father, and said, My father: and he said, Here am I, my son. And he said, Behold the fire and the wood: but where is the lamb for a burnt offering?",
    tracers: ["substitute", "innocent_sufferer"],
    patterns: ["Sacrifice"],
    christConnection: "Isaac carrying the wood prefigures Christ carrying His cross. The ram caught in the thicket is the substitute provided by God, just as Christ was provided for us.",
    ntFulfillment: "John 1:29 - 'Behold the Lamb of God, which taketh away the sin of the world.'",
    shortcoming: "Isaac was spared; Christ was not. Isaac was the type; Jesus is the eternal reality.",
    difficulty: "easy"
  },
  {
    id: 2,
    reference: "Genesis 37:18-28",
    title: "Joseph Sold by His Brothers",
    text: "And when they saw him afar off, even before he came near unto them, they conspired against him to slay him... And Judah said unto his brethren, What profit is it if we slay our brother, and conceal his blood? Come, and let us sell him to the Ishmeelites.",
    tracers: ["innocent_sufferer", "restorer"],
    patterns: ["King", "Deliverer"],
    christConnection: "Joseph was betrayed by his brothers for silver, cast into a pit, and later raised to save the very ones who rejected him—prefiguring Christ's betrayal, death, and exaltation as Savior.",
    ntFulfillment: "Matthew 26:15 - Judas agreed to betray Jesus for thirty pieces of silver.",
    shortcoming: "Joseph eventually died; Christ rose eternally. Joseph saved from famine; Christ saves from sin and death.",
    difficulty: "easy"
  },
  {
    id: 3,
    reference: "Exodus 12:3-7,13",
    title: "The Passover Lamb",
    text: "Your lamb shall be without blemish, a male of the first year... And they shall take of the blood, and strike it on the two side posts and on the upper door post of the houses... And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you.",
    tracers: ["substitute"],
    patterns: ["Sacrifice"],
    christConnection: "The unblemished lamb slain at twilight, its blood applied to doorposts for protection from death—this is Christ, the Lamb of God whose blood shields us from judgment.",
    ntFulfillment: "1 Corinthians 5:7 - 'For even Christ our passover is sacrificed for us.'",
    shortcoming: "The lamb had to be slain yearly; Christ's sacrifice is once for all (Hebrews 10:10).",
    difficulty: "easy"
  },
  {
    id: 4,
    reference: "Leviticus 16:20-22",
    title: "The Scapegoat",
    text: "And Aaron shall lay both his hands upon the head of the live goat, and confess over him all the iniquities of the children of Israel... putting them upon the head of the goat, and shall send him away by the hand of a fit man into the wilderness.",
    tracers: ["substitute", "mediator"],
    patterns: ["High Priest", "Sacrifice"],
    christConnection: "The scapegoat bearing the sins of the people into the wilderness prefigures Christ bearing our sins away, removing them as far as the east is from the west.",
    ntFulfillment: "Hebrews 9:28 - 'So Christ was once offered to bear the sins of many.'",
    shortcoming: "The ceremony had to be repeated yearly; Christ entered the Most Holy Place once for all.",
    difficulty: "medium"
  },
  {
    id: 5,
    reference: "Ruth 4:4-10",
    title: "Boaz the Kinsman Redeemer",
    text: "And Boaz said, What day thou buyest the field of the hand of Naomi, thou must buy it also of Ruth the Moabitess... Moreover Ruth the Moabitess, the wife of Mahlon, have I purchased to be my wife, to raise up the name of the dead upon his inheritance.",
    tracers: ["restorer", "deliverer"],
    patterns: ["Bridegroom", "King"],
    christConnection: "Boaz redeems Ruth from poverty and foreign exile, bringing her into the covenant family—a picture of Christ redeeming His Gentile bride and giving her inheritance among His people.",
    ntFulfillment: "Ephesians 5:25-27 - 'Christ also loved the church, and gave himself for it.'",
    shortcoming: "Boaz redeemed one woman; Christ redeems people from every nation. Boaz purchased a field; Christ purchased souls.",
    difficulty: "medium"
  },
  {
    id: 6,
    reference: "2 Samuel 7:12-16",
    title: "The Davidic Covenant",
    text: "And when thy days be fulfilled... I will set up thy seed after thee, which shall proceed out of thy bowels, and I will establish his kingdom. He shall build an house for my name, and I will stablish the throne of his kingdom for ever.",
    tracers: ["restorer"],
    patterns: ["King"],
    christConnection: "God's promise to David of an eternal throne finds fulfillment only in Jesus, the Son of David who reigns forever at the Father's right hand.",
    ntFulfillment: "Luke 1:32-33 - 'The Lord God shall give unto him the throne of his father David: and he shall reign over the house of Jacob for ever.'",
    shortcoming: "Solomon and his successors all failed and died; Christ's kingdom has no end.",
    difficulty: "medium"
  },
  {
    id: 7,
    reference: "Isaiah 53:4-7",
    title: "The Suffering Servant",
    text: "Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted. But he was wounded for our transgressions, he was bruised for our iniquities... He is brought as a lamb to the slaughter.",
    tracers: ["innocent_sufferer", "substitute"],
    patterns: ["Sacrifice", "Prophet"],
    christConnection: "Isaiah 53 is the clearest Old Testament portrait of Christ—wounded for our transgressions, silent before His accusers, numbered with transgressors, yet through His suffering bringing healing and justification.",
    ntFulfillment: "Acts 8:32-35 - Philip explained to the Ethiopian that Isaiah spoke of Jesus.",
    shortcoming: "This IS Christ. The prophet saw the reality itself, though veiled in future tense.",
    difficulty: "easy"
  },
  {
    id: 8,
    reference: "Jonah 1:17, 2:10",
    title: "Jonah in the Fish",
    text: "Now the LORD had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights... And the LORD spake unto the fish, and it vomited out Jonah upon the dry land.",
    tracers: ["deliverer"],
    patterns: ["Prophet"],
    christConnection: "Jonah's three days in the belly of the fish and subsequent release to preach salvation to Gentiles prefigures Christ's death, burial, and resurrection unto the salvation of the nations.",
    ntFulfillment: "Matthew 12:40 - 'For as Jonas was three days and three nights in the whale's belly; so shall the Son of man be three days and three nights in the heart of the earth.'",
    shortcoming: "Jonah ran from his mission; Christ ran toward His. Jonah was there for disobedience; Christ descended willingly.",
    difficulty: "easy"
  },
  {
    id: 9,
    reference: "Zechariah 3:1-5",
    title: "Joshua the High Priest",
    text: "And he shewed me Joshua the high priest standing before the angel of the LORD, and Satan standing at his right hand to resist him... Now Joshua was clothed with filthy garments... And he answered and spake unto those that stood before him, saying, Take away the filthy garments from him... I will clothe thee with change of raiment.",
    tracers: ["mediator", "innocent_sufferer"],
    patterns: ["High Priest"],
    christConnection: "Joshua, accused by Satan yet clothed with clean garments by the Angel of the LORD, pictures believers who stand accused before God yet are clothed in Christ's righteousness.",
    ntFulfillment: "Romans 8:33-34 - 'Who shall lay any thing to the charge of God's elect? It is God that justifieth.'",
    shortcoming: "Joshua received righteousness; Christ IS righteousness. Joshua was a type; Christ is the eternal High Priest.",
    difficulty: "hard"
  },
  {
    id: 10,
    reference: "Daniel 3:24-25",
    title: "The Fourth Man in the Fire",
    text: "Then Nebuchadnezzar the king was astonied, and rose up in haste, and spake, and said unto his counsellers, Did not we cast three men bound into the midst of the fire? They answered and said unto the king, True, O king. He answered and said, Lo, I see four men loose, walking in the midst of the fire, and they have no hurt; and the form of the fourth is like the Son of God.",
    tracers: ["deliverer"],
    patterns: ["Deliverer", "King"],
    christConnection: "The mysterious fourth figure walking unharmed in the flames with the faithful three is a Christophany—Christ present with His people in their fiery trial, delivering them from destruction.",
    ntFulfillment: "Isaiah 43:2 - 'When thou walkest through the fire, thou shalt not be burned.'",
    shortcoming: "This may be a pre-incarnate appearance; the full revelation awaited Bethlehem and Calvary.",
    difficulty: "medium"
  }
];

// Get random passage based on difficulty
const getRandomPassage = (difficulty?: string) => {
  const filtered = difficulty 
    ? TRAINING_PASSAGES.filter(p => p.difficulty === difficulty)
    : TRAINING_PASSAGES;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export function ConcentrationRoomDrill() {
  const [activeMode, setActiveMode] = useState<string>("focus");
  const [currentPassage, setCurrentPassage] = useState(getRandomPassage());
  const [phase, setPhase] = useState<"observe" | "match" | "align" | "contrast" | "mirror">("observe");
  const [userObservations, setUserObservations] = useState("");
  const [selectedTracers, setSelectedTracers] = useState<string[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [mirrorReflection, setMirrorReflection] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Timer state for Challenge mode
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  
  // Pattern Match mode state
  const [matchPairs, setMatchPairs] = useState<{ot: string, nt: string, matched: boolean}[]>([]);
  const [selectedOT, setSelectedOT] = useState<string | null>(null);

  // Timer effect for Challenge mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setChallengeComplete(true);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const resetExercise = useCallback(() => {
    setCurrentPassage(getRandomPassage());
    setPhase("observe");
    setUserObservations("");
    setSelectedTracers([]);
    setSelectedPatterns([]);
    setMirrorReflection("");
    setShowResults(false);
    setTimeRemaining(60);
    setIsTimerRunning(false);
    setChallengeComplete(false);
  }, []);

  const handleTracerToggle = (tracerId: string) => {
    setSelectedTracers(prev => 
      prev.includes(tracerId) 
        ? prev.filter(t => t !== tracerId)
        : [...prev, tracerId]
    );
  };

  const handlePatternToggle = (pattern: string) => {
    setSelectedPatterns(prev => 
      prev.includes(pattern)
        ? prev.filter(p => p !== pattern)
        : [...prev, pattern]
    );
  };

  const nextPhase = () => {
    const phases: typeof phase[] = ["observe", "match", "align", "contrast", "mirror"];
    const currentIndex = phases.indexOf(phase);
    if (currentIndex < phases.length - 1) {
      setPhase(phases[currentIndex + 1]);
    } else {
      evaluateResults();
    }
  };

  const evaluateResults = () => {
    const correctTracers = currentPassage.tracers.filter(t => selectedTracers.includes(t));
    const correctPatterns = currentPassage.patterns.filter(p => selectedPatterns.includes(p));
    
    const tracerScore = (correctTracers.length / currentPassage.tracers.length) * 40;
    const patternScore = (correctPatterns.length / currentPassage.patterns.length) * 30;
    const observationScore = userObservations.length > 50 ? 15 : userObservations.length > 20 ? 10 : 5;
    const mirrorScore = mirrorReflection.length > 30 ? 15 : mirrorReflection.length > 10 ? 10 : 5;
    
    const totalScore = Math.round(tracerScore + patternScore + observationScore + mirrorScore);
    setScore(totalScore);
    
    if (totalScore >= 70) {
      setStreak(prev => prev + 1);
      toast.success(`Excellent! You've trained your eyes well. Streak: ${streak + 1}`);
    } else {
      setStreak(0);
      toast.info("Keep practicing! Christ is hidden in every passage.");
    }
    
    setShowResults(true);
  };

  // Start Challenge mode
  const startChallenge = () => {
    resetExercise();
    setActiveMode("challenge");
    setIsTimerRunning(true);
  };

  // Initialize Pattern Match mode
  const initPatternMatch = () => {
    const pairs = [
      { ot: "Isaac on the altar", nt: "Christ on the cross", matched: false },
      { ot: "Passover lamb's blood", nt: "Blood of Christ (1 Cor 5:7)", matched: false },
      { ot: "Joseph exalted in Egypt", nt: "Christ exalted at God's right hand", matched: false },
      { ot: "Jonah 3 days in fish", nt: "Christ 3 days in tomb", matched: false },
      { ot: "Boaz redeems Ruth", nt: "Christ redeems His bride", matched: false },
      { ot: "Moses lifts bronze serpent", nt: "Christ lifted on the cross (John 3:14)", matched: false },
    ];
    setMatchPairs(pairs.sort(() => Math.random() - 0.5));
    setActiveMode("pattern_match");
  };

  const handleMatchSelect = (item: string, type: "ot" | "nt") => {
    if (type === "ot") {
      setSelectedOT(item);
    } else if (selectedOT) {
      // Check if match is correct
      const pair = matchPairs.find(p => p.ot === selectedOT && p.nt === item);
      if (pair) {
        setMatchPairs(prev => prev.map(p => 
          p.ot === selectedOT ? { ...p, matched: true } : p
        ));
        setScore(prev => prev + 15);
        toast.success("Correct match!");
      } else {
        toast.error("Not quite. Try again!");
      }
      setSelectedOT(null);
    }
  };

  const renderPhaseContent = () => {
    switch (phase) {
      case "observe":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Eye className="h-5 w-5" />
              <h3 className="font-bold">Phase 1: Observation — "Spot Him"</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Read the passage with one goal: Where might Christ be hiding here?
            </p>
            
            <Card className="bg-muted/30 border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">{currentPassage.reference}</Badge>
                  <Badge className="bg-primary/20 text-primary">{currentPassage.difficulty}</Badge>
                </div>
                <h4 className="font-semibold mb-2">{currentPassage.title}</h4>
                <p className="text-sm italic leading-relaxed">{currentPassage.text}</p>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <p className="text-sm font-medium">What do you observe? Ask yourself:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                <li>• Who is innocent?</li>
                <li>• Who bears guilt they did not commit?</li>
                <li>• Who intercedes?</li>
                <li>• Who delivers others at personal cost?</li>
                <li>• Who restores what was lost?</li>
              </ul>
              <Textarea
                placeholder="Write your observations here..."
                value={userObservations}
                onChange={(e) => setUserObservations(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case "match":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" />
              <h3 className="font-bold">Phase 2: Pattern Matching — "Name the Type"</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Identify which Christ-patterns are present in this passage.
            </p>

            <div className="space-y-3">
              <p className="text-sm font-medium">Select the Christ Tracers you see:</p>
              <div className="grid grid-cols-1 gap-2">
                {CHRIST_TRACERS.map(tracer => {
                  const Icon = tracer.icon;
                  const isSelected = selectedTracers.includes(tracer.id);
                  return (
                    <Button
                      key={tracer.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`justify-start h-auto py-3 ${isSelected ? '' : tracer.bgColor + ' ' + tracer.borderColor}`}
                      onClick={() => handleTracerToggle(tracer.id)}
                    >
                      <Icon className={`h-5 w-5 mr-2 ${isSelected ? '' : tracer.color}`} />
                      <div className="text-left">
                        <div className="font-medium">{tracer.name}</div>
                        <div className="text-xs opacity-70">{tracer.description}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Select pattern types:</p>
              <div className="flex flex-wrap gap-2">
                {PATTERN_TYPES.map(pattern => (
                  <Badge
                    key={pattern}
                    variant={selectedPatterns.includes(pattern) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handlePatternToggle(pattern)}
                  >
                    {pattern}
                    {selectedPatterns.includes(pattern) && <CheckCircle2 className="h-3 w-3 ml-1" />}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case "align":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Layers className="h-5 w-5" />
              <h3 className="font-bold">Phase 3: Cross-Scripture Alignment</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Match the Old Testament shadow with its New Testament fulfillment.
            </p>

            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Old Testament Shadow</div>
                  <p className="font-medium">{currentPassage.title}</p>
                </div>
                <ChevronRight className="h-6 w-6 text-primary mx-auto" />
                <div>
                  <div className="text-xs text-muted-foreground mb-1">New Testament Fulfillment</div>
                  <p className="font-medium text-primary">{currentPassage.ntFulfillment}</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="font-medium text-sm">The Christ Connection</span>
              </div>
              <p className="text-sm">{currentPassage.christConnection}</p>
            </div>
          </div>
        );

      case "contrast":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ArrowLeftRight className="h-5 w-5" />
              <h3 className="font-bold">Phase 4: Contrast & Distortion Detection</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Where does this figure fall short of Christ? What part of the picture is incomplete?
            </p>

            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium text-sm mb-1">Where the Shadow Falls Short</div>
                    <p className="text-sm text-muted-foreground">{currentPassage.shortcoming}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm">
                <strong>Remember:</strong> Types and shadows are never perfect. They point to Christ but cannot contain Him. 
                Jesus surpasses every shadow—He is the eternal reality these figures could only hint at.
              </p>
            </div>
          </div>
        );

      case "mirror":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              <h3 className="font-bold">Phase 5: Personal Application — "Mirror Phase"</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Christ is not only seen—He is followed. How does this pattern appear in your life?
            </p>

            <Card className="bg-muted/30 border-primary/20">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium">Reflection prompts:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Am I called to suffer innocently like Christ did?</li>
                  <li>• Am I being asked to intercede for others?</li>
                  <li>• Am I in a season of waiting before exaltation?</li>
                  <li>• How does Christ's example reshape my response?</li>
                </ul>
              </CardContent>
            </Card>

            <Textarea
              placeholder="How does this passage speak to your life right now?"
              value={mirrorReflection}
              onChange={(e) => setMirrorReflection(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );
    }
  };

  const renderFocusMode = () => (
    <div className="space-y-6">
      {!showResults ? (
        <>
          {renderPhaseContent()}
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {["observe", "match", "align", "contrast", "mirror"].map((p, i) => (
              <div
                key={p}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= ["observe", "match", "align", "contrast", "mirror"].indexOf(phase)
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button onClick={nextPhase} className="w-full">
            {phase === "mirror" ? "Complete Exercise" : "Continue to Next Phase"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">
              {score >= 80 ? "🎯" : score >= 60 ? "👁️" : "📖"}
            </div>
            <h3 className="text-2xl font-bold mb-2">Score: {score}/100</h3>
            <p className="text-muted-foreground">
              {score >= 80 ? "Your eyes are trained to see Christ!" : 
               score >= 60 ? "Good observation skills. Keep practicing!" :
               "Practice makes perfect. Try again!"}
            </p>
            {streak > 0 && (
              <Badge className="mt-2 bg-amber-500">🔥 {streak} streak</Badge>
            )}
          </div>

          <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Full Christ Connection
              </h4>
              <p className="text-sm">{currentPassage.christConnection}</p>
              
              <div className="pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Correct Tracers:</div>
                <div className="flex flex-wrap gap-1">
                  {currentPassage.tracers.map(t => {
                    const tracer = CHRIST_TRACERS.find(ct => ct.id === t);
                    return tracer ? (
                      <Badge key={t} variant="outline" className={tracer.borderColor}>
                        {tracer.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Button onClick={resetExercise} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Train Again
          </Button>
        </div>
      )}
    </div>
  );

  const renderChallengeMode = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className={`h-5 w-5 ${timeRemaining <= 10 ? "text-red-500 animate-pulse" : "text-primary"}`} />
          <span className="text-2xl font-bold font-mono">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          Score: {score}
        </Badge>
      </div>

      <Progress value={(60 - timeRemaining) / 60 * 100} className="h-2" />

      {!challengeComplete ? (
        <>
          <Card className="bg-muted/30 border-primary/20">
            <CardContent className="p-4">
              <Badge variant="outline" className="mb-2">{currentPassage.reference}</Badge>
              <h4 className="font-semibold mb-2">{currentPassage.title}</h4>
              <p className="text-sm italic">{currentPassage.text}</p>
            </CardContent>
          </Card>

          <p className="text-sm text-center text-muted-foreground">
            Quickly identify the Christ Tracers!
          </p>

          <div className="grid grid-cols-1 gap-2">
            {CHRIST_TRACERS.map(tracer => {
              const Icon = tracer.icon;
              const isSelected = selectedTracers.includes(tracer.id);
              return (
                <Button
                  key={tracer.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`justify-start ${isSelected ? '' : tracer.bgColor}`}
                  onClick={() => {
                    handleTracerToggle(tracer.id);
                    if (!isSelected && currentPassage.tracers.includes(tracer.id)) {
                      setScore(prev => prev + 20);
                      toast.success("+20 points!");
                    }
                  }}
                >
                  <Icon className={`h-4 w-4 mr-2 ${isSelected ? '' : tracer.color}`} />
                  {tracer.name}
                </Button>
              );
            })}
          </div>

          <Button 
            onClick={() => {
              setCurrentPassage(getRandomPassage());
              setSelectedTracers([]);
            }}
            variant="outline"
            className="w-full"
          >
            Next Passage
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </>
      ) : (
        <div className="text-center space-y-4">
          <Trophy className="h-16 w-16 text-amber-400 mx-auto" />
          <h3 className="text-2xl font-bold">Challenge Complete!</h3>
          <p className="text-4xl font-bold text-primary">{score} points</p>
          <Button onClick={startChallenge} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );

  const renderPatternMatchMode = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Match OT Shadows → NT Fulfillments</h3>
        <Badge variant="outline">Score: {score}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-center text-muted-foreground">Old Testament</div>
          {matchPairs.filter(p => !p.matched).map(pair => (
            <Button
              key={pair.ot}
              variant={selectedOT === pair.ot ? "default" : "outline"}
              size="sm"
              className="w-full text-xs h-auto py-2"
              onClick={() => handleMatchSelect(pair.ot, "ot")}
            >
              {pair.ot}
            </Button>
          ))}
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-center text-muted-foreground">New Testament</div>
          {matchPairs.filter(p => !p.matched).sort(() => Math.random() - 0.5).map(pair => (
            <Button
              key={pair.nt}
              variant="outline"
              size="sm"
              className="w-full text-xs h-auto py-2"
              onClick={() => handleMatchSelect(pair.nt, "nt")}
              disabled={!selectedOT}
            >
              {pair.nt}
            </Button>
          ))}
        </div>
      </div>

      {matchPairs.filter(p => p.matched).length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-green-400">Matched Pairs:</div>
          {matchPairs.filter(p => p.matched).map(pair => (
            <div key={pair.ot} className="text-xs bg-green-500/10 p-2 rounded flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              {pair.ot} → {pair.nt}
            </div>
          ))}
        </div>
      )}

      {matchPairs.every(p => p.matched) && (
        <div className="text-center space-y-3">
          <Trophy className="h-12 w-12 text-amber-400 mx-auto" />
          <p className="font-bold">All pairs matched!</p>
          <Button onClick={initPatternMatch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );

  const renderBeforeAfterMode = () => (
    <div className="space-y-4">
      <h3 className="font-bold">Before & After: Shadow → Fulfillment → Experience</h3>
      
      <div className="space-y-3">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <Badge variant="outline" className="mb-2 border-amber-500/50">OT Shadow</Badge>
            <h4 className="font-medium">{currentPassage.title}</h4>
            <p className="text-sm text-muted-foreground">{currentPassage.reference}</p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ChevronRight className="h-6 w-6 text-primary rotate-90" />
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <Badge variant="outline" className="mb-2 border-primary/50">NT Fulfillment</Badge>
            <p className="text-sm">{currentPassage.ntFulfillment}</p>
            <p className="text-sm mt-2">{currentPassage.christConnection}</p>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <ChevronRight className="h-6 w-6 text-primary rotate-90" />
        </div>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4">
            <Badge variant="outline" className="mb-2 border-emerald-500/50">My Experience</Badge>
            <Textarea
              placeholder="How does this pattern appear in your life today?"
              value={mirrorReflection}
              onChange={(e) => setMirrorReflection(e.target.value)}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Button onClick={resetExercise} variant="outline" className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        New Passage
      </Button>
    </div>
  );

  const renderMirrorMode = () => (
    <div className="space-y-4">
      <div className="text-center">
        <User className="h-12 w-12 text-primary mx-auto mb-2" />
        <h3 className="font-bold text-lg">Mirror Mode</h3>
        <p className="text-sm text-muted-foreground">
          "How does this text expose or reshape my character?"
        </p>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <Badge variant="outline" className="mb-2">{currentPassage.reference}</Badge>
          <p className="text-sm italic">{currentPassage.text}</p>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm font-medium">The Christ Pattern here:</p>
        <div className="flex flex-wrap gap-2">
          {currentPassage.tracers.map(t => {
            const tracer = CHRIST_TRACERS.find(ct => ct.id === t);
            return tracer ? (
              <Badge key={t} className={tracer.bgColor + " " + tracer.color}>
                {tracer.name}
              </Badge>
            ) : null;
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Reflection Questions:</p>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>Where do I see myself in this story?</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>How is Christ calling me to respond?</span>
          </li>
          <li className="flex items-start gap-2">
            <span>•</span>
            <span>What must I surrender or embrace?</span>
          </li>
        </ul>
      </div>

      <Textarea
        placeholder="Write your reflection..."
        value={mirrorReflection}
        onChange={(e) => setMirrorReflection(e.target.value)}
        className="min-h-[120px]"
      />

      <div className="flex gap-2">
        <Button onClick={resetExercise} variant="outline" className="flex-1">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Passage
        </Button>
        <Button 
          onClick={() => {
            if (mirrorReflection.length > 20) {
              toast.success("Reflection saved. Keep walking with Christ!");
              resetExercise();
            } else {
              toast.error("Please write a longer reflection.");
            }
          }} 
          className="flex-1"
        >
          Save Reflection
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Eye className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">The Concentration Room</h2>
        </div>
        <p className="text-sm text-muted-foreground italic">
          "Train your eyes to see Christ where others see only text."
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span>John 5:39</span>
          <span>•</span>
          <span>Luke 24:27</span>
        </div>
      </div>

      {/* The Five Christ Tracers Reference */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            The Five Christ Tracers
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {CHRIST_TRACERS.map(tracer => {
                const Icon = tracer.icon;
                return (
                  <Badge 
                    key={tracer.id} 
                    variant="outline" 
                    className={`shrink-0 ${tracer.borderColor} ${tracer.bgColor}`}
                  >
                    <Icon className={`h-3 w-3 mr-1 ${tracer.color}`} />
                    <span className="text-xs">{tracer.name.split(' ')[1] || tracer.name.split('/')[0]}</span>
                  </Badge>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="focus" className="text-xs py-2 flex-col h-auto gap-1">
            <BookOpen className="h-4 w-4" />
            Focus
          </TabsTrigger>
          <TabsTrigger value="challenge" className="text-xs py-2 flex-col h-auto gap-1" onClick={startChallenge}>
            <Zap className="h-4 w-4" />
            Challenge
          </TabsTrigger>
          <TabsTrigger value="pattern_match" className="text-xs py-2 flex-col h-auto gap-1" onClick={initPatternMatch}>
            <Layers className="h-4 w-4" />
            Match
          </TabsTrigger>
          <TabsTrigger value="before_after" className="text-xs py-2 flex-col h-auto gap-1">
            <ArrowLeftRight className="h-4 w-4" />
            Before/After
          </TabsTrigger>
          <TabsTrigger value="mirror" className="text-xs py-2 flex-col h-auto gap-1">
            <User className="h-4 w-4" />
            Mirror
          </TabsTrigger>
        </TabsList>

        <TabsContent value="focus" className="mt-4">
          {renderFocusMode()}
        </TabsContent>

        <TabsContent value="challenge" className="mt-4">
          {renderChallengeMode()}
        </TabsContent>

        <TabsContent value="pattern_match" className="mt-4">
          {renderPatternMatchMode()}
        </TabsContent>

        <TabsContent value="before_after" className="mt-4">
          {renderBeforeAfterMode()}
        </TabsContent>

        <TabsContent value="mirror" className="mt-4">
          {renderMirrorMode()}
        </TabsContent>
      </Tabs>

      {/* Training Outcome */}
      {streak >= 3 && (
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="h-8 w-8 text-amber-400" />
            <div>
              <div className="font-bold">🔥 {streak} Streak!</div>
              <p className="text-xs text-muted-foreground">
                Your spiritual sight is sharpening. Keep training!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
