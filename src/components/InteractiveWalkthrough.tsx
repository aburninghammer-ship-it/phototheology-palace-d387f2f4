import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  Building2, 
  Link2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Target,
  Brain,
  RefreshCw,
  MessageSquare,
  Layers,
  Clock,
  Flame,
  Crown,
  Compass,
  Search,
  Lightbulb,
  Heart
} from "lucide-react";

interface PalacePrinciple {
  id: string;
  name: string;
  code: string;
  floor: number;
  icon: React.ReactNode;
  color: string;
  verse: string;
  verseText: string;
  explanation: string;
  christConnection: string;
  jeevesInsight: string;
  memoryHook: string;
}

const ALL_PRINCIPLES: PalacePrinciple[] = [
  {
    id: "story",
    name: "Story Room",
    code: "SR",
    floor: 1,
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/20 text-blue-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd; I shall not want.",
    explanation: "In the Story Room, we first collect the narrative. David pictures God as a shepherd — protector, provider, guide.",
    christConnection: "Jesus declares 'I am the Good Shepherd' (John 10:11), fulfilling this imagery.",
    jeevesInsight: "Notice how David doesn't say 'The LORD is A shepherd' but 'MY shepherd.' This possessive intimacy transforms theology into testimony. The Shepherd isn't distant — He's personally yours.",
    memoryHook: "Picture a shepherd's staff glowing with divine light, leading you through a green meadow."
  },
  {
    id: "imagination",
    name: "Imagination Room",
    code: "IR",
    floor: 1,
    icon: <Eye className="h-5 w-5" />,
    color: "bg-purple-500/20 text-purple-600",
    verse: "Psalm 23:2",
    verseText: "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    explanation: "The Imagination Room immerses you in the text. Feel the grass beneath you. Hear the quiet stream. Smell the fresh air.",
    christConnection: "Christ offers living water (John 4:14) and calls the weary to rest in Him (Matt 11:28-29).",
    jeevesInsight: "The Hebrew 'still waters' literally means 'waters of rest.' Sheep won't drink from rushing streams — they fear drowning. The Good Shepherd finds quiet pools for anxious souls.",
    memoryHook: "You're lying on soft grass beside crystal-clear water. The Shepherd sits nearby, watching over you."
  },
  {
    id: "concentration",
    name: "Concentration Room",
    code: "CR",
    floor: 4,
    icon: <Target className="h-5 w-5" />,
    color: "bg-red-500/20 text-red-600",
    verse: "Psalm 23:4",
    verseText: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me.",
    explanation: "The Concentration Room insists: every text must reveal Christ. The 'shadow of death' points to Calvary — where Christ walked through death itself.",
    christConnection: "Christ's presence in our darkest valleys is the fulfillment of 'Thou art with me.'",
    jeevesInsight: "Notice: it's the SHADOW of death, not death itself. Shadows cannot harm — they only frighten. Christ absorbed death's reality so we only pass through its shadow.",
    memoryHook: "A valley shrouded in shadow, but a bright figure walks ahead — the Shepherd leading through death to life."
  },
  {
    id: "patterns",
    name: "Patterns Room",
    code: "PRm",
    floor: 4,
    icon: <Link2 className="h-5 w-5" />,
    color: "bg-green-500/20 text-green-600",
    verse: "Psalm 23:5",
    verseText: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil.",
    explanation: "The Patterns Room traces recurring motifs. Table → Communion. Anointing → Priesthood. Enemies watching → Victory.",
    christConnection: "The table points to the Last Supper; the anointing foreshadows Christ as Prophet, Priest, and King.",
    jeevesInsight: "The enemies aren't destroyed — they're forced to WATCH. This is the ultimate vindication: dining with God while those who opposed you observe His favor upon you.",
    memoryHook: "A banquet table in the sanctuary, enemies watching from outside, the King serving you bread and wine."
  },
  {
    id: "dimensions",
    name: "Dimensions Room",
    code: "DR",
    floor: 4,
    icon: <Layers className="h-5 w-5" />,
    color: "bg-amber-500/20 text-amber-600",
    verse: "Psalm 23:3",
    verseText: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    explanation: "The Dimensions Room stretches the text across 5 levels: Literal, Christ, Me, Church, Heaven — revealing layers of meaning.",
    christConnection: "Literal: David's restoration. Christ: Jesus restores all things. Me: Personal renewal. Church: Corporate revival. Heaven: Ultimate restoration.",
    jeevesInsight: "'For HIS name's sake' — not for my worthiness. God leads us rightly to protect His reputation, not reward our merit. This removes performance anxiety from the spiritual life.",
    memoryHook: "Picture five transparent layers stacked like glass, each revealing a deeper dimension of the same truth."
  },
  {
    id: "timezones",
    name: "Time Zone Room",
    code: "TZ",
    floor: 4,
    icon: <Clock className="h-5 w-5" />,
    color: "bg-cyan-500/20 text-cyan-600",
    verse: "Psalm 23:6",
    verseText: "Surely goodness and mercy shall follow me all the days of my life.",
    explanation: "The Time Zone Room places texts across past, present, and future — both on earth and in heaven.",
    christConnection: "Past: God's faithfulness to David. Present: Christ's ongoing mercy. Future: Eternal dwelling with God.",
    jeevesInsight: "The Hebrew for 'follow' is RADAPH — to pursue, chase, hunt. God's goodness isn't passive; it actively hunts you down like a shepherd chasing a wandering sheep.",
    memoryHook: "A timeline stretching from Eden to New Jerusalem, with goodness and mercy running alongside every moment."
  },
  {
    id: "fire",
    name: "Fire Room",
    code: "FRm",
    floor: 7,
    icon: <Flame className="h-5 w-5" />,
    color: "bg-orange-500/20 text-orange-600",
    verse: "Psalm 23:4b",
    verseText: "Thy rod and thy staff they comfort me.",
    explanation: "The Fire Room engages emotions — conviction, awe, comfort, courage. Feel the weight of truth.",
    christConnection: "The rod protects; the staff rescues. Christ both defends us from wolves and pulls us from pits.",
    jeevesInsight: "The rod was for fighting wolves; the staff had a crook for rescuing stuck sheep. Comfort comes not from absence of danger but from presence of the equipped Protector.",
    memoryHook: "Feel the warmth of being defended — the rod raised against enemies, the staff's crook around your waist pulling you to safety."
  },
  {
    id: "blue",
    name: "Blue Room (Sanctuary)",
    code: "BL",
    floor: 5,
    icon: <Building2 className="h-5 w-5" />,
    color: "bg-blue-600/20 text-blue-700",
    verse: "Psalm 23:6b",
    verseText: "And I will dwell in the house of the LORD for ever.",
    explanation: "The Blue Room maps texts to sanctuary furniture and services — seeing heaven's pattern in earthly worship.",
    christConnection: "The 'house of the LORD' points to the Temple, Christ's body, and ultimately the New Jerusalem where God dwells with man.",
    jeevesInsight: "'Forever' in Hebrew is 'length of days' — but David extends it beyond life. He glimpses eternity, anticipating what the New Testament reveals fully.",
    memoryHook: "Stand in the sanctuary's Holy Place, then watch it transform into the eternal temple of Revelation 21."
  },
  {
    id: "symbols",
    name: "Symbols/Types Room",
    code: "@T",
    floor: 2,
    icon: <Search className="h-5 w-5" />,
    color: "bg-indigo-500/20 text-indigo-600",
    verse: "Psalm 23:5b",
    verseText: "My cup runneth over.",
    explanation: "The Symbols Room identifies God's recurring imagery — cup, oil, table — as prophetic pictures.",
    christConnection: "The overflowing cup anticipates the cup of the New Covenant — Christ's blood poured out for many.",
    jeevesInsight: "In the ancient world, a host filled your cup to show honor. An OVERFLOWING cup means God cannot contain His generosity toward you — blessing exceeds the vessel.",
    memoryHook: "Picture a golden cup being filled, then spilling over the edges as the Host keeps pouring."
  },
  {
    id: "observation",
    name: "Observation Room",
    code: "OR",
    floor: 2,
    icon: <Eye className="h-5 w-5" />,
    color: "bg-teal-500/20 text-teal-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... I will dwell in the house of the LORD for ever.",
    explanation: "The Observation Room logs details like a detective — names, numbers, actions, sequence — before interpretation.",
    christConnection: "Observe: The psalm moves from pasture (v.1-3) to valley (v.4) to banquet (v.5) to temple (v.6) — a journey from earth to heaven.",
    jeevesInsight: "Count the 'He' statements (what God does) vs 'I' statements (David's response). The psalm is 80% about God's action, 20% human response. Biblical faith is primarily receptive.",
    memoryHook: "Put on detective glasses and examine each verse for clues — who, what, where, when, why."
  },
  {
    id: "gems",
    name: "Gems Room",
    code: "GR",
    floor: 1,
    icon: <Sparkles className="h-5 w-5" />,
    color: "bg-pink-500/20 text-pink-600",
    verse: "Psalm 23:3a",
    verseText: "He restoreth my soul.",
    explanation: "The Gems Room stores powerful insights — striking truths that shine with clarity and transform understanding.",
    christConnection: "The Hebrew 'restoreth' (SHUB) means to turn back or return. Christ doesn't just heal — He returns us to Eden's original design.",
    jeevesInsight: "This is a gem: 'SHUB' is the same word used for repentance. When God restores your soul, He's essentially doing FOR you what repentance asks you to do — turning you back to Him.",
    memoryHook: "Picture a gemstone emerging from rough rock — the hidden treasure of soul restoration."
  },
  {
    id: "questions",
    name: "Questions Room",
    code: "QR",
    floor: 2,
    icon: <MessageSquare className="h-5 w-5" />,
    color: "bg-violet-500/20 text-violet-600",
    verse: "Psalm 23:4",
    verseText: "I will fear no evil.",
    explanation: "The Questions Room interrogates the text — asking 75 questions at text, chapter, and theological levels.",
    christConnection: "Why 'fear NO evil' rather than 'face no evil'? Because evil still exists — but fear is conquered by presence.",
    jeevesInsight: "Key question: Does David say evil won't exist in the valley, or that he won't FEAR it? The text admits evil is real but strips its power through relationship with the Shepherd.",
    memoryHook: "A room full of question marks floating in the air — each one unlocking deeper understanding."
  },
  {
    id: "freestyle",
    name: "Bible Freestyle Room",
    code: "BF",
    floor: 3,
    icon: <Compass className="h-5 w-5" />,
    color: "bg-emerald-500/20 text-emerald-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Bible Freestyle Room traces verse genetics — connecting this text to every shepherd passage in Scripture.",
    christConnection: "Genesis 49:24 (God as Shepherd of Israel) → Psalm 80:1 → Isaiah 40:11 → Ezekiel 34 → John 10 → Hebrews 13:20 → 1 Peter 5:4 → Revelation 7:17.",
    jeevesInsight: "Psalm 23 sits at the center of Scripture's shepherd theme. Behind it: patriarchal promises. Ahead of it: Messianic fulfillment. Every shepherd verse is a cousin to this one.",
    memoryHook: "Picture a genealogy tree with Psalm 23 at the center, branches connecting to every shepherd passage."
  },
  {
    id: "fruit",
    name: "Fruit Room",
    code: "FRt",
    floor: 4,
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-500/20 text-rose-600",
    verse: "Psalm 23:1-6",
    verseText: "The LORD is my shepherd... surely goodness and mercy shall follow me.",
    explanation: "The Fruit Room tests every interpretation: Does it produce love, joy, peace, patience, kindness, goodness, faith, meekness, temperance?",
    christConnection: "Psalm 23 produces trust (not fear), rest (not anxiety), confidence (not despair) — the fruits of walking with Christ.",
    jeevesInsight: "Any reading of Psalm 23 that produces fear, striving, or performance anxiety has missed the point. The fruit test: Does your interpretation produce rest in the Shepherd's care?",
    memoryHook: "A tree bearing nine fruits of the Spirit — each one growing from a branch rooted in Psalm 23."
  },
  {
    id: "cycles",
    name: "Cycles (@CyC)",
    code: "@CyC",
    floor: 6,
    icon: <Crown className="h-5 w-5" />,
    color: "bg-yellow-500/20 text-yellow-600",
    verse: "Psalm 23:1",
    verseText: "The LORD is my shepherd.",
    explanation: "The Cycles place texts within the eight great epochs of salvation history — from Adam to Remnant.",
    christConnection: "David in @Mo (Mosaic cycle) points to Christ in @CyC (Cyrus-Christ cycle) — the true Shepherd-King who delivers His people.",
    jeevesInsight: "David was a shepherd who became king. Jesus is the King who became a shepherd. The cycle inverts — God's pattern of exaltation through humiliation.",
    memoryHook: "A wheel with eight spokes, each representing a cycle, with Christ at the center where all spokes meet."
  },
  {
    id: "meditation",
    name: "Meditation Room",
    code: "MR",
    floor: 7,
    icon: <Lightbulb className="h-5 w-5" />,
    color: "bg-amber-600/20 text-amber-700",
    verse: "Psalm 23:2b",
    verseText: "He leadeth me beside the still waters.",
    explanation: "The Meditation Room slows down — marinating in truth until it saturates the soul.",
    christConnection: "Meditation isn't Eastern emptying but biblical filling — letting Christ's words dwell richly within.",
    jeevesInsight: "The 'still waters' are the perfect meditation image. Not rushing to the next verse. Not analyzing. Just resting beside quiet truth until it seeps into your being.",
    memoryHook: "Sit beside still water, letting each word ripple outward slowly, watching the reflections deepen."
  }
];

// Shuffle and pick 7 random principles
const shuffleAndPick = (array: PalacePrinciple[], count: number): PalacePrinciple[] => {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const InteractiveWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const selectedPrinciples = useMemo(() => {
    return shuffleAndPick(ALL_PRINCIPLES, 7);
  }, [refreshKey]);

  const step = selectedPrinciples[currentStep];

  const nextStep = () => {
    if (currentStep < selectedPrinciples.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setCurrentStep(0);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30">
            <Sparkles className="h-3 w-3 mr-1" />
            Interactive Demo — 7 Palace Principles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            See How the Palace Method Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Walk through Psalm 23 as Jeeves applies 7 random Palace principles — revealing Christ-centered depths in familiar verses.
          </p>
          
          {/* Refresh Button */}
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Apply 7 New Principles
          </Button>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {selectedPrinciples.map((p, idx) => (
            <button
              key={`${p.id}-${refreshKey}`}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep 
                  ? "w-8 bg-primary" 
                  : idx < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStep}-${refreshKey}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-border/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${step.color} w-fit`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{step.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.code} • Floor {step.floor}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Principle {currentStep + 1} of 7</p>
                  </div>
                </div>
              </div>

              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Scripture */}
                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">{step.verse}</p>
                  <p className="text-base sm:text-lg italic">"{step.verseText}"</p>
                </div>

                {/* Explanation */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <Brain className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Palace Method</p>
                      <p className="text-muted-foreground text-sm sm:text-base">{step.explanation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-accent/10 text-accent mt-0.5 flex-shrink-0">
                      <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-accent mb-1">Christ Connection</p>
                      <p className="text-muted-foreground text-sm sm:text-base">{step.christConnection}</p>
                    </div>
                  </div>

                  {/* Jeeves Insight - NEW */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-primary/20 text-primary mt-0.5 flex-shrink-0">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-primary mb-1">🎩 Jeeves Says...</p>
                        <p className="text-foreground text-sm sm:text-base italic">{step.jeevesInsight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5 flex-shrink-0">
                      <Eye className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary mb-1">Memory Hook</p>
                      <p className="text-muted-foreground italic text-sm sm:text-base">{step.memoryHook}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {currentStep + 1} / {selectedPrinciples.length}
                  </span>

                  <Button
                    onClick={nextStep}
                    disabled={currentStep === selectedPrinciples.length - 1}
                    className="gap-1 sm:gap-2 text-sm"
                    size="sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Final CTA if on last step */}
        {currentStep === selectedPrinciples.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 space-y-4"
          >
            <p className="text-lg font-medium">
              Ready to build your own palace with every book of the Bible?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleRefresh} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try 7 More Principles
              </Button>
              <Button size="lg" className="gradient-palace">
                Start Your Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
