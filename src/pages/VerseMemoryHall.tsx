import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { 
  Brain, 
  Trophy, 
  Clock, 
  Target, 
  Zap, 
  Award,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Flame,
  Star
} from "lucide-react";

interface VerseCard {
  id: string;
  reference: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

interface UserProgress {
  verses_memorized: number;
  current_streak: number;
  best_streak: number;
  total_points: number;
  rank: string;
}

export default function VerseMemoryHall() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("flashcards");
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState("kjv");
  
  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [verseCards] = useState<VerseCard[]>([
    {
      id: "1",
      reference: "John 3:16",
      text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      difficulty: "easy",
      category: "Salvation"
    },
    {
      id: "2",
      reference: "Romans 8:28",
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      difficulty: "medium",
      category: "Providence"
    },
    {
      id: "3",
      reference: "Philippians 4:13",
      text: "I can do all this through him who gives me strength.",
      difficulty: "easy",
      category: "Strength"
    },
    {
      id: "4",
      reference: "Psalm 23:1",
      text: "The LORD is my shepherd, I lack nothing.",
      difficulty: "easy",
      category: "Comfort"
    },
    {
      id: "5",
      reference: "Proverbs 3:5-6",
      text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      difficulty: "medium",
      category: "Guidance"
    }
  ]);

  // Quiz state
  const [quizActive, setQuizActive] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizTimeLeft, setQuizTimeLeft] = useState(60);

  // Challenge state
  const [dailyChallenge] = useState({
    verse: "Memorize 3 new verses today",
    progress: 1,
    target: 3,
    points: 100
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (quizActive && quizTimeLeft > 0) {
      const timer = setTimeout(() => setQuizTimeLeft(quizTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (quizTimeLeft === 0 && quizActive) {
      endQuiz();
    }
  }, [quizActive, quizTimeLeft]);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mock progress data - in production, fetch from database
      setProgress({
        verses_memorized: 12,
        current_streak: 5,
        best_streak: 14,
        total_points: 1250,
        rank: "Memory Master"
      });
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.min(prev + 1, verseCards.length - 1));
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };

  const markAsMemorized = () => {
    toast.success("Verse marked as memorized! +10 points");
    nextCard();
  };

  const startQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    setQuizTimeLeft(60);
    setCurrentCardIndex(0);
  };

  const endQuiz = () => {
    setQuizActive(false);
    toast.success(`Quiz complete! You scored ${quizScore} points`);
  };

  const checkAnswer = () => {
    const currentCard = verseCards[currentCardIndex];
    const normalizedAnswer = quizAnswer.toLowerCase().trim();
    const normalizedCorrect = currentCard.text.toLowerCase().trim();
    
    if (normalizedAnswer.includes(normalizedCorrect.substring(0, 20))) {
      setQuizScore(quizScore + 10);
      toast.success("Correct! +10 points");
      setQuizAnswer("");
      nextCard();
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const currentCard = verseCards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Brain className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-bold text-white">Verse Memory Hall</h1>
                <p className="text-purple-200 text-lg">Master Scripture through active memorization</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/palace")}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Palace
            </Button>
          </div>

          {/* Progress Stats */}
          {progress && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <p className="text-purple-200 text-sm">Verses Memorized</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{progress.verses_memorized}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-300" />
                    <p className="text-purple-200 text-sm">Current Streak</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{progress.current_streak} days</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-300" />
                    <p className="text-purple-200 text-sm">Total Points</p>
                  </div>
                  <p className="text-3xl font-bold text-white">{progress.total_points}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-blue-300" />
                    <p className="text-purple-200 text-sm">Rank</p>
                  </div>
                  <p className="text-xl font-bold text-white">{progress.rank}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="flashcards">📇 Flashcards</TabsTrigger>
            <TabsTrigger value="mnemonics">🧠 Mnemonics</TabsTrigger>
            <TabsTrigger value="challenges">🎯 Challenges</TabsTrigger>
            <TabsTrigger value="quiz">⚡ Quick Quiz</TabsTrigger>
            <TabsTrigger value="leaderboard">🏆 Leaderboard</TabsTrigger>
          </TabsList>

          {/* Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Verse Flashcards</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      Card {currentCardIndex + 1} of {verseCards.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Bible Version:</label>
                    <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        {BIBLE_TRANSLATIONS.map((trans) => (
                          <SelectItem key={trans.value} value={trans.value}>
                            {trans.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] flex flex-col">
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="mb-6 text-center">
                      <h3 className="text-2xl font-bold text-primary mb-2">{currentCard.reference}</h3>
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {currentCard.difficulty} • {currentCard.category}
                      </span>
                    </div>

                    {!showAnswer ? (
                      <div className="text-center">
                        <p className="text-muted-foreground mb-6">Try to recall the verse...</p>
                        <Button onClick={() => setShowAnswer(true)} size="lg">
                          Show Verse
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center animate-in fade-in">
                        <p className="text-lg leading-relaxed mb-6">{currentCard.text}</p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={markAsMemorized} variant="default">
                            <Star className="w-4 h-4 mr-2" />
                            I Know This
                          </Button>
                          <Button onClick={() => setShowAnswer(false)} variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Practice Again
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t">
                    <Button
                      onClick={prevCard}
                      disabled={currentCardIndex === 0}
                      variant="outline"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Progress value={((currentCardIndex + 1) / verseCards.length) * 100} className="mx-4 flex-1" />
                    <Button
                      onClick={nextCard}
                      disabled={currentCardIndex === verseCards.length - 1}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mnemonics Tab */}
          <TabsContent value="mnemonics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>🎨 Visualization Method</CardTitle>
                  <CardDescription>Create vivid mental images for each verse</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transform abstract concepts into concrete, memorable scenes. For John 3:16, imagine a glowing globe 
                    with a figure extending a gift to silhouettes below.
                  </p>
                  <Button variant="outline" className="w-full">
                    Try Visualization Exercise
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>🔤 Acronym Builder</CardTitle>
                  <CardDescription>Build memorable acronyms from verse keywords</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use first letters of key words to create memorable acronyms. Example: "The LORD is my shepherd" 
                    becomes "TLIMS" - imagine a "slim" shepherd.
                  </p>
                  <Button variant="outline" className="w-full">
                    Generate Acronym
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>🎵 Rhythm & Rhyme</CardTitle>
                  <CardDescription>Set verses to familiar tunes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Singing verses to familiar melodies dramatically improves retention. Try setting short verses 
                    to nursery rhyme patterns or popular song structures.
                  </p>
                  <Button variant="outline" className="w-full">
                    Create Melody
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>🧩 Chunking Technique</CardTitle>
                  <CardDescription>Break verses into memorable phrases</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Divide long verses into 3-5 word chunks. Memorize each chunk separately, then link them together 
                    with visual or logical connections.
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Chunking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-white/95 backdrop-blur-sm border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Daily Challenge
                      </CardTitle>
                      <CardDescription>Complete today's memorization goal</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">+{dailyChallenge.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{dailyChallenge.verse}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{dailyChallenge.progress}/{dailyChallenge.target}</span>
                    </div>
                    <Progress value={(dailyChallenge.progress / dailyChallenge.target) * 100} />
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">7-Day Streak</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Memorize at least 1 verse every day for 7 days
                    </p>
                    <Button variant="outline" className="w-full">
                      Join Challenge
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Chapter Master</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Memorize an entire chapter word-for-word
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Speed Round</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Recall 10 verses in under 5 minutes
                    </p>
                    <Button variant="outline" className="w-full">
                      Begin Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quick Fire Quiz</CardTitle>
                    <CardDescription>Test your memory under time pressure</CardDescription>
                  </div>
                  {quizActive && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold text-primary">{quizTimeLeft}s</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!quizActive ? (
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ready to test your memory?</h3>
                    <p className="text-muted-foreground mb-6">
                      You'll have 60 seconds to recall as many verses as possible
                    </p>
                    <Button onClick={startQuiz} size="lg">
                      Start Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-primary mb-4">{currentCard.reference}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Type the verse from memory:</p>
                      <Input
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="Start typing..."
                        className="text-center text-lg"
                        onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={checkAnswer} className="flex-1">
                        Submit Answer
                      </Button>
                      <Button onClick={endQuiz} variant="outline">
                        End Quiz
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Score: <span className="font-bold">{quizScore}</span></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-6">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Global Leaderboard
                </CardTitle>
                <CardDescription>Top memorizers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "David M.", verses: 156, points: 3420 },
                    { rank: 2, name: "Sarah K.", verses: 142, points: 3180 },
                    { rank: 3, name: "John P.", verses: 138, points: 3050 },
                    { rank: 4, name: "Mary W.", verses: 125, points: 2850 },
                    { rank: 5, name: "You", verses: 12, points: 1250 },
                  ].map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        user.name === "You" ? "bg-primary/10 border-2 border-primary" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                        {user.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.verses} verses</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
