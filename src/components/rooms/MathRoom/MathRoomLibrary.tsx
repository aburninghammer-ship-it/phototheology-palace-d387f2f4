import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Clock,
  BookOpen,
  Calculator,
  Layers,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Calendar,
  Target,
  Shield,
  Eye,
  Scale,
  Heart,
  Crown,
  Scroll,
  Zap,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Sparkles,
  Book,
  Timer,
  Compass,
  Hash,
  Star,
} from "lucide-react";
import { TIME_CYCLES, KEY_NUMBERS, THEOLOGICAL_FUNCTIONS, DAY_YEAR_PRINCIPLE, TimeCycle } from "./mathRoomData";

const iconMap: Record<string, React.ElementType> = {
  AlertTriangle,
  Shield,
  Target,
  Crown,
  Eye,
  Scale,
  Clock,
  BookOpen,
  Calculator,
  Heart,
  Scroll,
};

// Static color class mappings - Tailwind requires full class names at build time
const COLOR_CLASSES = {
  amber: {
    border: "border-amber-500/50",
    text: "text-amber-400",
    bg: "bg-amber-500/20",
    glow: "shadow-amber-500/20",
    gradient: "from-amber-500 to-amber-600",
    hoverBorder: "hover:border-amber-400/50",
  },
  rose: {
    border: "border-rose-500/50",
    text: "text-rose-400",
    bg: "bg-rose-500/20",
    glow: "shadow-rose-500/20",
    gradient: "from-rose-500 to-rose-600",
    hoverBorder: "hover:border-rose-400/50",
  },
  blue: {
    border: "border-blue-500/50",
    text: "text-blue-400",
    bg: "bg-blue-500/20",
    glow: "shadow-blue-500/20",
    gradient: "from-blue-500 to-blue-600",
    hoverBorder: "hover:border-blue-400/50",
  },
  violet: {
    border: "border-violet-500/50",
    text: "text-violet-400",
    bg: "bg-violet-500/20",
    glow: "shadow-violet-500/20",
    gradient: "from-violet-500 to-violet-600",
    hoverBorder: "hover:border-violet-400/50",
  },
  emerald: {
    border: "border-emerald-500/50",
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    glow: "shadow-emerald-500/20",
    gradient: "from-emerald-500 to-emerald-600",
    hoverBorder: "hover:border-emerald-400/50",
  },
  yellow: {
    border: "border-yellow-500/50",
    text: "text-yellow-400",
    bg: "bg-yellow-500/20",
    glow: "shadow-yellow-500/20",
    gradient: "from-yellow-500 to-yellow-600",
    hoverBorder: "hover:border-yellow-400/50",
  },
  purple: {
    border: "border-purple-500/50",
    text: "text-purple-400",
    bg: "bg-purple-500/20",
    glow: "shadow-purple-500/20",
    gradient: "from-purple-500 to-purple-600",
    hoverBorder: "hover:border-purple-400/50",
  },
} as const;

type ColorKey = keyof typeof COLOR_CLASSES;

const getColorClasses = (color: string) => {
  return COLOR_CLASSES[color as ColorKey] || COLOR_CLASSES.amber;
};

// Time Cycle Card Component
const TimeCycleCard: React.FC<{ cycle: TimeCycle }> = ({ cycle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState<Record<number, boolean>>({});
  const Icon = iconMap[cycle.icon] || Clock;
  const colors = getColorClasses(cycle.color);

  const toggleQuizAnswer = (index: number) => {
    setShowQuizAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`bg-gradient-to-br ${cycle.bgGradient} backdrop-blur-sm border ${colors.border} hover:shadow-lg transition-all duration-300`}>
        <CardHeader 
          className="cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className={`text-xl font-serif ${colors.text}`}>
                  {cycle.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm">{cycle.duration}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="group-hover:bg-white/5">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
          
          {/* Timeline Bar */}
          <div className={`mt-4 h-2 rounded-full ${colors.bg} overflow-hidden`}>
            <motion.div 
              className={`h-full bg-gradient-to-r ${colors.gradient}`}
              initial={{ width: "0%" }}
              animate={{ width: isExpanded ? "100%" : "30%" }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-6 pt-0">
                {/* Meaning */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold text-white">
                    <Lightbulb className={`w-4 h-4 ${colors.text}`} />
                    Core Meaning
                  </h4>
                  <p className="text-muted-foreground pl-6">{cycle.meaning}</p>
                </div>

                {/* Historical Application */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold text-white">
                    <BookOpen className={`w-4 h-4 ${colors.text}`} />
                    Historical Application
                  </h4>
                  <div className="pl-6 space-y-2">
                    <Badge variant="outline" className={colors.text}>{cycle.historicalApplication.reference}</Badge>
                    <p className="text-muted-foreground italic">{cycle.historicalApplication.description}</p>
                  </div>
                </div>

                {/* Theological Principle */}
                <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                  <h4 className="flex items-center gap-2 font-semibold text-white mb-2">
                    <Crown className={`w-4 h-4 ${colors.text}`} />
                    Theological Principle
                  </h4>
                  <p className={`${colors.text} font-medium text-lg mb-3`}>"{cycle.theologicalPrinciple.statement}"</p>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">This means:</p>
                    <ul className="space-y-1">
                      {cycle.theologicalPrinciple.implications.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className={`w-3 h-3 mt-1 ${colors.text} shrink-0`} />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Details for specific cycles */}
                {cycle.additionalDetails && cycle.id === "70-weeks" && (
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold text-white">
                      <Star className={`w-4 h-4 ${colors.text}`} />
                      The Six Purposes of Daniel 9:24
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cycle.additionalDetails.sixPurposes?.map((purpose: { purpose: string; meaning: string }, i: number) => (
                        <div key={i} className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                          <p className={`font-medium ${colors.text}`}>{i + 1}. {purpose.purpose}</p>
                          <p className="text-xs text-muted-foreground">{purpose.meaning}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 font-semibold text-white">
                        <Timer className={`w-4 h-4 ${colors.text}`} />
                        The Breakdown
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                          7 weeks (49 years): Jerusalem rebuilt
                        </Badge>
                        <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                          62 weeks (434 years): Waiting for Messiah
                        </Badge>
                        <Badge className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                          1 week (7 years): Messiah's ministry
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 font-semibold text-white">
                        <Calendar className={`w-4 h-4 ${colors.text}`} />
                        Key Dates
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {cycle.additionalDetails.keyDates?.map((kd: { date: string; event: string }, i: number) => (
                          <Badge key={i} variant="outline" className={colors.text}>
                            {kd.date}: {kd.event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {cycle.additionalDetails && cycle.id === "1260-days" && (
                  <div className="space-y-4">
                    <h4 className="flex items-center gap-2 font-semibold text-white">
                      <Layers className={`w-4 h-4 ${colors.text}`} />
                      Equivalent Expressions
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className={colors.bg}>
                            <th className="p-2 text-left">Expression</th>
                            <th className="p-2 text-left">Reference</th>
                            <th className="p-2 text-left">Calculation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cycle.additionalDetails.equivalentExpressions?.map((expr: { expression: string; reference: string; calculation: string }, i: number) => (
                            <tr key={i} className="border-t border-white/10">
                              <td className={`p-2 ${colors.text}`}>{expr.expression}</td>
                              <td className="p-2 text-muted-foreground">{expr.reference}</td>
                              <td className="p-2 text-muted-foreground">{expr.calculation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {cycle.additionalDetails && cycle.id === "2300-days" && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                      <h4 className="flex items-center gap-2 font-semibold text-white mb-2">
                        <Compass className={`w-4 h-4 ${colors.text}`} />
                        Connection to 70 Weeks
                      </h4>
                      <p className="text-muted-foreground text-sm">{cycle.additionalDetails.connectionTo70Weeks?.explanation}</p>
                      <Badge className="mt-2" variant="outline">
                        Shared starting point: {cycle.additionalDetails.connectionTo70Weeks?.sharedStartingPoint}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 font-semibold text-white">
                        <Scale className={`w-4 h-4 ${colors.text}`} />
                        What Began in 1844
                      </h4>
                      <ul className="space-y-1">
                        {cycle.additionalDetails.whatBeganIn1844?.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className={`w-3 h-3 mt-1 ${colors.text} shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Pattern Reappearance */}
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 font-semibold text-white">
                    <Zap className={`w-4 h-4 ${colors.text}`} />
                    Pattern Reappearance
                  </h4>
                  <ul className="space-y-1 pl-6">
                    {cycle.patternReappearance.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Sparkles className={`w-3 h-3 mt-1 ${colors.text} shrink-0`} />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Type → Antitype */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30">
                  <h4 className="flex items-center gap-2 font-semibold text-white mb-3">
                    <ArrowRight className="w-4 h-4 text-purple-400" />
                    Type → Antitype Connections
                  </h4>
                  <div className="space-y-2">
                    {cycle.typeAntitype.map((ta, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="text-amber-400 font-medium min-w-[120px]">{ta.type}</span>
                        <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-emerald-400">{ta.antitype}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz Questions */}
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-white">
                    <HelpCircle className={`w-4 h-4 ${colors.text}`} />
                    Study Questions
                  </h4>
                  {cycle.quizQuestions.map((q, i) => (
                    <div key={i} className={`p-3 rounded-lg bg-black/20 border ${colors.border}`}>
                      <p className="text-white text-sm mb-2">{q.question}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleQuizAnswer(i)}
                        className={`text-xs ${colors.text}`}
                      >
                        {showQuizAnswers[i] ? "Hide Answer" : "Show Answer"}
                      </Button>
                      <AnimatePresence>
                        {showQuizAnswers[i] && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="text-muted-foreground text-sm mt-2 pl-4 border-l-2 border-purple-500/50"
                          >
                            {q.answer}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Overview Tab
const OverviewTab: React.FC = () => (
  <div className="space-y-8">
    {/* Purpose Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
        Purpose of the Math Room
      </h2>
      <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
        Biblical time is not random—it is structured, covenantal, and purposeful. The Math Room exists to 
        help students of Scripture understand God's prophetic timelines and see how they reveal His 
        sovereign plan across history.
      </p>
    </motion.div>

    {/* Time Functions */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5 text-purple-400" />
            Time in Scripture Functions As
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Scale, title: "A measuring tool of obedience", desc: "Time reveals faithfulness and failure" },
              { icon: Shield, title: "A boundary marker of divine patience", desc: "Grace has limits—then judgment falls" },
              { icon: Target, title: "A fulfillment tracker of prophecy", desc: "Precise timing validates God's word" },
              { icon: CheckCircle, title: "A seal of authenticity", desc: "No human could fabricate prophetic accuracy" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-purple-500/20">
                <item.icon className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Six Time Systems Overview */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-2xl font-serif text-white mb-4 flex items-center gap-2">
        <Layers className="w-6 h-6 text-amber-400" />
        The Six Prophetic Time Systems
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIME_CYCLES.map((cycle, i) => {
          const Icon = iconMap[cycle.icon] || Clock;
          const colors = getColorClasses(cycle.color);
          return (
            <motion.div
              key={cycle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className={`bg-gradient-to-br ${cycle.bgGradient} ${colors.border} ${colors.hoverBorder} transition-all cursor-pointer group`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                    <h4 className={`font-semibold ${colors.text}`}>{cycle.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{cycle.duration}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>

    {/* What Each Period Includes */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Book className="w-5 h-5 text-emerald-400" />
            What Each Time Period Includes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { title: "Meaning", icon: Lightbulb, colorClass: "text-amber-400", borderClass: "border-amber-500/20" },
              { title: "Historical Application", icon: BookOpen, colorClass: "text-blue-400", borderClass: "border-blue-500/20" },
              { title: "Theological Principle", icon: Crown, colorClass: "text-purple-400", borderClass: "border-purple-500/20" },
              { title: "Pattern Reappearance", icon: Zap, colorClass: "text-emerald-400", borderClass: "border-emerald-500/20" },
              { title: "Type/Antitype Parallels", icon: ArrowRight, colorClass: "text-rose-400", borderClass: "border-rose-500/20" },
            ].map((item, i) => (
              <div key={i} className={`p-3 rounded-lg bg-black/20 border ${item.borderClass} text-center`}>
                <item.icon className={`w-5 h-5 ${item.colorClass} mx-auto mb-2`} />
                <p className="text-sm text-white font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

// Time Cycles Tab
const TimeCyclesTab: React.FC = () => (
  <div className="space-y-4">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400">
        The Six Prophetic Time Cycles
      </h2>
      <p className="text-muted-foreground mt-2">Click each card to explore in depth</p>
    </div>
    {TIME_CYCLES.map((cycle) => (
      <TimeCycleCard key={cycle.id} cycle={cycle} />
    ))}
  </div>
);

// Convergence Tab
const ConvergenceTab: React.FC = () => (
  <div className="space-y-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 mb-6">
        How the Cycles Fit Together
      </h2>
      
      <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-500/30 overflow-x-auto">
        <CardContent className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500/30">
                <th className="p-3 text-left text-amber-400">Period</th>
                <th className="p-3 text-left text-amber-400">Purpose</th>
                <th className="p-3 text-left text-amber-400">Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {[
                { period: "120 Years", purpose: "Warning before judgment", endpoint: "The Flood" },
                { period: "400 Years", purpose: "Formation through trial", endpoint: "The Exodus" },
                { period: "70 Years", purpose: "Discipline with restoration", endpoint: "Return from Babylon" },
                { period: "70 Weeks", purpose: "Messianic countdown", endpoint: "Gospel to Gentiles (AD 34)" },
                { period: "1260 Days/Years", purpose: "Witness under oppression", endpoint: "End of papal supremacy (1798)" },
                { period: "2300 Days/Years", purpose: "Judgment and vindication", endpoint: "Pre-Advent Judgment (1844)" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-3 text-white font-medium">{row.period}</td>
                  <td className="p-3 text-muted-foreground">{row.purpose}</td>
                  <td className="p-3 text-emerald-400">{row.endpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </motion.div>

    {/* Master Timeline */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Master Timeline Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual Timeline Bars */}
          <div className="space-y-3">
            {[
              { label: "70 Weeks (490 years)", start: "457 BC", end: "AD 34", width: "20%", gradientClass: "from-violet-500 to-violet-600" },
              { label: "2300 Days (2300 years)", start: "457 BC", end: "1844", width: "100%", gradientClass: "from-yellow-500 to-yellow-600" },
              { label: "1260 Days (1260 years)", start: "538", end: "1798", width: "55%", gradientClass: "from-emerald-500 to-emerald-600", offset: "23%" },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{item.label}</span>
                  <span>{item.start} → {item.end}</span>
                </div>
                <div className="h-4 bg-black/30 rounded-full overflow-hidden relative">
                  <div 
                    className={`absolute h-full bg-gradient-to-r ${item.gradientClass} rounded-full`}
                    style={{ width: item.width, left: item.offset || "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline mr-2 text-amber-400" />
              The 70 weeks are "cut off" from the 2300 days, sharing the same starting point (457 BC). 
              This connection is the key that unlocks both prophecies.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Progressive Revelation */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Progressive Revelation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { period: "120 Years", reveals: "God's patience has limits, but those limits are merciful" },
              { period: "400 Years", reveals: "Suffering prepares God's people for their mission" },
              { period: "70 Years", reveals: "Exile is not abandonment—restoration is planned" },
              { period: "70 Weeks", reveals: "Messiah comes at the precise appointed time" },
              { period: "1260 Years", reveals: "Truth survives persecution; God preserves witnesses" },
              { period: "2300 Years", reveals: "Judgment vindicates God and His people; the end is near" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-black/20">
                <Badge variant="outline" className="shrink-0">{item.period}</Badge>
                <p className="text-muted-foreground text-sm">{item.reveals}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

// Principles Tab
const PrinciplesTab: React.FC = () => (
  <div className="space-y-8">
    {/* Five Theological Functions */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-serif text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-purple-400 mb-6">
        Five Theological Functions of Prophetic Time
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEOLOGICAL_FUNCTIONS.map((func, i) => {
          const Icon = iconMap[func.icon] || Crown;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/30 h-full">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white">{func.title}</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">{func.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>

    {/* Day-Year Principle */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            {DAY_YEAR_PRINCIPLE.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{DAY_YEAR_PRINCIPLE.explanation}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Biblical Foundation:</h4>
            {DAY_YEAR_PRINCIPLE.foundation.map((f, i) => (
              <div key={i} className="p-3 rounded-lg bg-black/20 border border-amber-500/20">
                <Badge variant="outline" className="text-amber-400 mb-2">{f.reference}</Badge>
                <p className="text-sm text-muted-foreground italic">"{f.text}"</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/30">
            <p className="text-sm text-muted-foreground">
              <strong className="text-purple-400">Prophetic Year:</strong> {DAY_YEAR_PRINCIPLE.propheticYear}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Why This Matters */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" />
            Why This Matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Time prophecies prove the Bible is divinely inspired—no human could predict centuries in advance",
              "Understanding God's timeline builds confidence that we are living in the last days",
              "Prophetic time teaches us that God is patient but not passive—judgment is coming",
              "These patterns reveal Christ as the center of all history—past, present, and future",
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Summary Statement */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/30"
    >
      <Scroll className="w-8 h-8 text-amber-400 mx-auto mb-4" />
      <p className="text-lg text-white font-serif italic max-w-2xl mx-auto">
        "The prophetic time periods are God's signature across history—proving His sovereignty, 
        validating His Word, and assuring us that He who began a good work will complete it."
      </p>
    </motion.div>
  </div>
);

// Calculator Tab
const CalculatorTab: React.FC = () => {
  const [days, setDays] = useState<string>("");
  const propheticYears = days ? (parseFloat(days) / 360).toFixed(2) : "0";

  return (
    <div className="space-y-8">
      {/* Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-400" />
              Prophetic Time Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm text-muted-foreground">Enter Prophetic Days</label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g., 1260"
                  className="bg-black/30 border-purple-500/30"
                />
              </div>
              <div className="flex items-center gap-2 pb-2">
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm text-muted-foreground">Prophetic Years</label>
                <div className="h-10 flex items-center px-3 rounded-md bg-black/30 border border-purple-500/30 text-amber-400 font-mono text-lg">
                  {propheticYears} years
                </div>
              </div>
            </div>

            {/* Pre-set Calculations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "70 Weeks", days: 490 },
                { label: "1260 Days", days: 1260 },
                { label: "2300 Days", days: 2300 },
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20"
                  onClick={() => setDays(preset.days.toString())}
                >
                  {preset.label} ({preset.days})
                </Button>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <p className="text-sm text-muted-foreground">
                <Info className="w-4 h-4 inline mr-2 text-amber-400" />
                <strong className="text-amber-400">Prophetic Year:</strong> In biblical prophecy, a year = 360 days 
                (12 months × 30 days). This calculation uses the day-year principle where each prophetic day = 1 literal year.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Numbers Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-amber-400" />
              Key Prophetic Numbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {KEY_NUMBERS.map((num) => (
                <div 
                  key={num.number} 
                  className="p-4 rounded-lg bg-black/20 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                >
                  <div className="text-3xl font-bold text-amber-400 font-mono mb-2">
                    {num.number}
                  </div>
                  <p className="text-sm text-white font-medium mb-1">{num.significance}</p>
                  <p className="text-xs text-muted-foreground">{num.examples}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Main Component
export const MathRoomLibrary: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30">
              <Calculator className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400">
            The Math Room
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            A Library of Prophetic Time Periods
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Newly Renovated
            </Badge>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-5 mb-6 bg-black/30 border border-purple-500/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20">
              <Compass className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="cycles" className="data-[state=active]:bg-purple-500/20">
              <Timer className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Time Cycles</span>
            </TabsTrigger>
            <TabsTrigger value="convergence" className="data-[state=active]:bg-purple-500/20">
              <Layers className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Convergence</span>
            </TabsTrigger>
            <TabsTrigger value="principles" className="data-[state=active]:bg-purple-500/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Principles</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-purple-500/20">
              <Calculator className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <TabsContent value="overview" className="mt-0">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="cycles" className="mt-0">
              <TimeCyclesTab />
            </TabsContent>
            <TabsContent value="convergence" className="mt-0">
              <ConvergenceTab />
            </TabsContent>
            <TabsContent value="principles" className="mt-0">
              <PrinciplesTab />
            </TabsContent>
            <TabsContent value="calculator" className="mt-0">
              <CalculatorTab />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default MathRoomLibrary;
