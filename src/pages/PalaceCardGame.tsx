import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Trophy, RotateCcw, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GameCard {
  id: string;
  event1Title: string;
  event1Story: string;
  event1Reference: string;
  event2Title: string;
  event2Story: string;
  event2Reference: string;
  parallelKey: string;
  color: string;
  isFlipped: boolean;
  isCompleted: boolean;
  userAnswer: string;
  isValidating: boolean;
}

// Biblical parallels for the game
const PARALLEL_PAIRS = [
  {
    event1Title: "Elijah's Mantle Transfer",
    event1Story: "Elijah struck the waters of Jordan with his mantle, and they parted. After crossing, he was taken up to heaven, and his mantle fell to Elisha, who struck the Jordan again and the waters parted.",
    event1Reference: "2 Kings 2:8-14",
    event2Title: "Jesus' Baptism",
    event2Story: "Jesus came to the Jordan to be baptized by John. When He came up from the water, the Spirit descended upon Him like a dove, and a voice from heaven declared Him God's Son.",
    event2Reference: "Matthew 3:13-17",
    parallelKey: "Transfer of power and anointing at the Jordan River; the passing of authority from one to another with divine confirmation",
    color: "from-blue-600 via-cyan-700 to-blue-800"
  },
  {
    event1Title: "Moses Lifted Up the Serpent",
    event1Story: "When fiery serpents bit the Israelites in the wilderness, Moses made a bronze serpent and lifted it up on a pole. Whoever looked at it lived.",
    event1Reference: "Numbers 21:8-9",
    event2Title: "Jesus Lifted Up on the Cross",
    event2Story: "Jesus told Nicodemus that as Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up, that whoever believes in Him should have eternal life.",
    event2Reference: "John 3:14-15",
    parallelKey: "Both involve being lifted up as the means of salvation from death; looking/believing brings life",
    color: "from-purple-600 via-violet-700 to-purple-800"
  },
  {
    event1Title: "Jonah in the Fish",
    event1Story: "Jonah was swallowed by a great fish and remained in its belly three days and three nights before being vomited out alive onto dry land.",
    event1Reference: "Jonah 1:17, 2:10",
    event2Title: "Jesus' Resurrection",
    event2Story: "Jesus said the only sign He would give was the sign of Jonah: as Jonah was three days and nights in the belly of the fish, so would the Son of Man be three days and nights in the heart of the earth.",
    event2Reference: "Matthew 12:39-40",
    parallelKey: "Three days in darkness/death followed by miraculous emergence to life; both are signs pointing to God's deliverance",
    color: "from-emerald-600 via-green-700 to-emerald-800"
  },
  {
    event1Title: "Passover Lamb",
    event1Story: "In Egypt, each household took a lamb without blemish, killed it at twilight, and put its blood on the doorposts. The destroyer passed over those houses, sparing the firstborn inside.",
    event1Reference: "Exodus 12:3-13",
    event2Title: "Christ Our Passover",
    event2Story: "John the Baptist declared Jesus 'the Lamb of God who takes away the sin of the world.' Paul wrote, 'Christ our Passover is sacrificed for us.'",
    event2Reference: "John 1:29; 1 Cor 5:7",
    parallelKey: "An unblemished lamb's blood provides protection from death; sacrifice at appointed time brings deliverance",
    color: "from-red-600 via-rose-700 to-red-800"
  },
  {
    event1Title: "Isaac on Mount Moriah",
    event1Story: "Abraham took his only son Isaac to Mount Moriah to offer him as a sacrifice. Isaac carried the wood for the burnt offering up the mountain.",
    event1Reference: "Genesis 22:1-10",
    event2Title: "Jesus on Calvary",
    event2Story: "God gave His only begotten Son. Jesus carried His cross to Golgotha, where He was offered as a sacrifice for the sins of the world.",
    event2Reference: "John 3:16; 19:17",
    parallelKey: "A father offering his only beloved son on a mountain; the son carries the instrument of sacrifice; substitutionary provision",
    color: "from-amber-600 via-yellow-700 to-amber-800"
  },
  {
    event1Title: "Manna from Heaven",
    event1Story: "God provided bread from heaven each morning for Israel in the wilderness. The people gathered it daily, and it sustained them for forty years.",
    event1Reference: "Exodus 16:4-35",
    event2Title: "Jesus the Bread of Life",
    event2Story: "Jesus declared, 'I am the bread of life. Your fathers ate manna in the wilderness and died, but I am the living bread that came down from heaven. Whoever eats this bread will live forever.'",
    event2Reference: "John 6:48-51",
    parallelKey: "Both are bread from heaven that sustains life; daily dependence required; points to eternal life through Christ",
    color: "from-orange-600 via-amber-700 to-orange-800"
  },
  {
    event1Title: "David Defeats Goliath",
    event1Story: "Young David, armed only with a sling and stones, defeated the giant Goliath who defied the armies of Israel. He struck him in the forehead and cut off his head with the giant's own sword.",
    event1Reference: "1 Samuel 17:41-51",
    event2Title: "Jesus Defeats Satan",
    event2Story: "Jesus, though tempted in the wilderness, defeated Satan with the Word of God. Through His death and resurrection, He crushed the serpent's head and triumphed over principalities and powers.",
    event2Reference: "Matthew 4:1-11; Col 2:15",
    parallelKey: "Unlikely champion defeats seemingly invincible enemy; victory secures deliverance for God's people; enemy's weapon turned against him",
    color: "from-indigo-600 via-blue-700 to-indigo-800"
  },
  {
    event1Title: "Tower of Babel Scattered",
    event1Story: "At Babel, God confused the languages of mankind, and they were scattered across the earth, unable to understand one another.",
    event1Reference: "Genesis 11:1-9",
    event2Title: "Pentecost Gathered",
    event2Story: "At Pentecost, the Holy Spirit came upon the disciples, and they spoke in various languages. People from every nation heard the gospel in their own tongue and were united in Christ.",
    event2Reference: "Acts 2:1-11",
    parallelKey: "Division of languages reversed; scattering becomes gathering; human pride judged vs. divine grace uniting; Babel divided, Pentecost united",
    color: "from-pink-600 via-rose-700 to-pink-800"
  }
];


export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Shuffle and select parallels for the game
    const shuffled = [...PARALLEL_PAIRS].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffled.slice(0, 6);

    const gameCards: GameCard[] = selectedPairs.map((pair, index) => ({
      id: `parallel-${index}`,
      event1Title: pair.event1Title,
      event1Story: pair.event1Story,
      event1Reference: pair.event1Reference,
      event2Title: pair.event2Title,
      event2Story: pair.event2Story,
      event2Reference: pair.event2Reference,
      parallelKey: pair.parallelKey,
      color: pair.color,
      isFlipped: false,
      isCompleted: false,
      userAnswer: '',
      isValidating: false,
    }));

    setCards(gameCards);
    setCurrentCardIndex(0);
    setCompletedCount(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
    ));
  };

  const handleAnswerChange = (cardId: string, answer: string) => {
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, userAnswer: answer } : c
    ));
  };

  const handleSubmitAnswer = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card || !card.userAnswer.trim()) {
      toast.error("Please write your answer first");
      return;
    }

    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isValidating: true } : c
    ));

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          event1: `${card.event1Title}: ${card.event1Story} (${card.event1Reference})`,
          event2: `${card.event2Title}: ${card.event2Story} (${card.event2Reference})`,
          parallelKey: card.parallelKey,
          userAnswer: card.userAnswer,
          validationType: 'parallel'
        }
      });

      if (error) throw error;

      const { isCorrect, feedback } = data;

      if (isCorrect) {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isCompleted: true, isValidating: false } : c
        ));
        setCompletedCount(prev => prev + 1);
        toast.success(feedback || "Excellent! You identified the parallel!");
        
        // Check if game is won
        if (completedCount + 1 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setCards(cards.map(c => 
          c.id === cardId ? { ...c, isValidating: false } : c
        ));
        toast.error(feedback || "Look deeper! How do these events mirror each other?");
      }
    } catch (error) {
      console.error('Error validating answer:', error);
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isValidating: false } : c
      ));
      toast.error("Failed to validate your answer. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `
        }} />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/games")}
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1" style={{ 
                fontFamily: "'Cinzel', serif",
                background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255,215,0,0.5)"
              }}>
                PARALLELS MATCH
              </h1>
              <p className="text-sm text-amber-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Discover Biblical Echoes Across Time
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={initializeGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex justify-center gap-12 mb-10">
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-amber-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-amber-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Completed</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                {completedCount}<span className="text-2xl text-amber-500/50">/{cards.length}</span>
              </p>
            </div>
          </div>
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-blue-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Progress</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {cards.length > 0 ? Math.round((completedCount / cards.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {cards.map((card) => {
            
            return (
              <div
                key={card.id}
                className="aspect-[2/3] transition-all duration-500"
                style={{ perspective: "1500px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-700 ${
                    card.isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Front - First Event */}
                  <div
                    onClick={() => !card.isCompleted && handleCardClick(card.id)}
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br ${card.color} border-4 border-amber-500/50 shadow-2xl flex flex-col overflow-hidden ${
                      !card.isCompleted ? 'cursor-pointer hover:border-amber-400 hover:scale-[1.02] transition-transform' : 'opacity-90'
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="relative flex-1 flex flex-col p-6">
                      {/* Event Title */}
                      <div className="text-center mb-4">
                        <h3 className="text-amber-100 font-bold text-lg mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                          {card.event1Title}
                        </h3>
                        <p className="text-amber-300/90 text-xs" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {card.event1Reference}
                        </p>
                      </div>

                      {/* Event Story */}
                      <div className="flex-1 flex items-center justify-center mb-4">
                        <div className="bg-black/30 rounded-lg p-4 border border-amber-400/30 backdrop-blur-sm">
                          <p className="text-white text-sm leading-relaxed" style={{ 
                            fontFamily: "'Cormorant Garamond', serif"
                          }}>
                            {card.event1Story}
                          </p>
                        </div>
                      </div>

                      {/* Instruction */}
                      <div className="text-center">
                        <p className="text-amber-200 text-sm font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                          {card.isCompleted ? '✓ Matched!' : 'CLICK TO FIND THE PARALLEL →'}
                        </p>
                      </div>

                      {/* Completion Badge */}
                      {card.isCompleted && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-10 h-10 text-amber-400 drop-shadow-2xl animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Back - Second Event & Input */}
                  <div
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-cyan-500/50 shadow-2xl flex flex-col overflow-hidden`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Top Banner */}
                    <div className="relative bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 px-3 py-2 shadow-lg">
                      <h3 className="relative text-center font-black text-gray-900 text-xs uppercase tracking-wide" style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.5)"
                      }}>
                        Find the Parallel
                      </h3>
                    </div>
                    
                    {/* Second Event */}
                    <div className="p-4 border-b border-cyan-500/30">
                      <h4 className="text-cyan-300 font-bold text-sm mb-1 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                        {card.event2Title}
                      </h4>
                      <p className="text-cyan-400/80 text-xs mb-2 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        {card.event2Reference}
                      </p>
                      <div className="bg-black/40 rounded-lg p-3 border border-cyan-500/20">
                        <p className="text-cyan-100 text-xs leading-relaxed" style={{ 
                          fontFamily: "'Cormorant Garamond', serif"
                        }}>
                          {card.event2Story}
                        </p>
                      </div>
                    </div>
                    
                    {/* Answer Input */}
                    <div className="flex-1 p-4 flex flex-col">
                      <label className="text-amber-300 text-xs font-semibold mb-2 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                        How do these events parallel each other?
                      </label>
                      <Textarea
                        value={card.userAnswer}
                        onChange={(e) => handleAnswerChange(card.id, e.target.value)}
                        placeholder="Explain the connection between these two events..."
                        className="flex-1 bg-black/50 border-cyan-500/30 text-white text-xs mb-3 resize-none"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        disabled={card.isCompleted || card.isValidating}
                      />
                      <Button
                        onClick={() => handleSubmitAnswer(card.id)}
                        disabled={card.isCompleted || card.isValidating || !card.userAnswer.trim()}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold"
                        size="sm"
                      >
                        {card.isValidating ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            Checking...
                          </>
                        ) : card.isCompleted ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory Message */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <Card className="max-w-lg mx-4 p-10 text-center bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-4 border-amber-500 shadow-2xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-3xl" />
                <div className="relative">
                  <div className="inline-block relative mb-6">
                    <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 animate-pulse" />
                    <Trophy className="relative w-24 h-24 text-yellow-500 drop-shadow-2xl animate-bounce" />
                  </div>
                  
                  <h2 className="text-5xl font-black mb-4" style={{
                    fontFamily: "'Cinzel', serif",
                    background: "linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 30px rgba(255,215,0,0.5)"
                  }}>
                    VICTORY! 🎉
                  </h2>
                  
                  <p className="text-xl text-amber-200 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    You matched all {cards.length} biblical parallels!
                  </p>
                  
                  <p className="text-sm text-amber-300/80 mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "Scripture echoes Scripture - Christ is the fulfillment of all things"
                  </p>
                  
                  <Button 
                    onClick={initializeGame} 
                    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-900 font-bold text-lg px-8 py-6 shadow-2xl border-2 border-amber-300"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <RotateCcw className="w-5 h-5" />
                    NEW CHALLENGE
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
