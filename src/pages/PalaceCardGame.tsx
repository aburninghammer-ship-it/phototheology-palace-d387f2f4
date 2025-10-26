import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, Trophy, RotateCcw, Eye, Search, Zap, 
  Layers, Telescope, Globe, Flame, Crown, Book,
  Lightbulb, Target, Sparkles, Mountain, Compass
} from "lucide-react";
import { toast } from "sonner";
import { palaceFloors } from "@/data/palaceData";

// Room icon mapping
const ROOM_ICONS: Record<string, any> = {
  'SR': Book,
  'IR': Eye,
  '24F': Layers,
  'BR': Mountain,
  'TR': Lightbulb,
  'GR': Sparkles,
  'OR': Search,
  'DC': Book,
  'ST': Target,
  'QR': Search,
  'QA': Compass,
  'NF': Mountain,
  'PF': Eye,
  'BF': Book,
  'HF': Globe,
  'LR': Eye,
  'CR': Crown,
  'DR': Layers,
  'C6': Book,
  'TRm': Target,
  'TZ': Globe,
  'PRm': Layers,
  'P‖': Compass,
  'FRt': Sparkles,
  'BL': Crown,
  'PR': Telescope,
  '3A': Flame,
  'JR': Zap,
  'FRm': Flame,
  'MR': Eye,
  'SRm': Zap,
};

interface GameCard {
  id: string;
  floorNumber: number;
  floorName: string;
  roomTag: string;
  roomName: string;
  roomPurpose: string;
  color: string;
  tagline: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FLOOR_COLORS = [
  { 
    floor: 1, 
    color: "from-rose-600 via-red-700 to-rose-800", 
    border: "border-rose-400",
    glow: "shadow-rose-500/50",
    tagline: "MEMORY & VISUALIZATION",
    symbol: "🏛️",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(255,0,100,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 2, 
    color: "from-blue-600 via-indigo-700 to-blue-800", 
    border: "border-blue-400",
    glow: "shadow-blue-500/50",
    tagline: "DETECTIVE INVESTIGATION",
    symbol: "🔍",
    bgPattern: "radial-gradient(circle at 80% 20%, rgba(0,100,255,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 3, 
    color: "from-emerald-600 via-green-700 to-emerald-800", 
    border: "border-emerald-400",
    glow: "shadow-emerald-500/50",
    tagline: "FREESTYLE CONNECTIONS",
    symbol: "🎭",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(0,255,100,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 4, 
    color: "from-amber-600 via-yellow-700 to-amber-800", 
    border: "border-amber-400",
    glow: "shadow-amber-500/50",
    tagline: "CHRIST-CENTERED DEPTH",
    symbol: "✝️",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(255,200,0,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 5, 
    color: "from-purple-600 via-violet-700 to-purple-800", 
    border: "border-purple-400",
    glow: "shadow-purple-500/50",
    tagline: "PROPHETIC VISION",
    symbol: "🔭",
    bgPattern: "radial-gradient(circle at 70% 30%, rgba(150,0,255,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 6, 
    color: "from-orange-600 via-amber-700 to-orange-800", 
    border: "border-orange-400",
    glow: "shadow-orange-500/50",
    tagline: "COSMIC CYCLES",
    symbol: "🌍",
    bgPattern: "radial-gradient(circle at 20% 20%, rgba(255,150,0,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 7, 
    color: "from-pink-600 via-rose-700 to-pink-800", 
    border: "border-pink-400",
    glow: "shadow-pink-500/50",
    tagline: "SPIRITUAL FIRE",
    symbol: "🔥",
    bgPattern: "radial-gradient(circle at 80% 80%, rgba(255,0,150,0.15) 0%, transparent 50%)"
  },
  { 
    floor: 8, 
    color: "from-cyan-600 via-teal-700 to-cyan-800", 
    border: "border-cyan-400",
    glow: "shadow-cyan-500/50",
    tagline: "REFLEXIVE MASTERY",
    symbol: "👑",
    bgPattern: "radial-gradient(circle at 50% 10%, rgba(0,200,255,0.15) 0%, transparent 50%)"
  },
];

export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Select 8 random rooms from the palace
    const allRooms: GameCard[] = [];
    palaceFloors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const colorScheme = FLOOR_COLORS.find(c => c.floor === floor.number) || FLOOR_COLORS[0];
        allRooms.push({
          id: `${floor.number}-${room.tag}`,
          floorNumber: floor.number,
          floorName: floor.name,
          roomTag: room.tag,
          roomName: room.name,
          roomPurpose: room.purpose.substring(0, 150) + "...",
          color: colorScheme.color,
          tagline: colorScheme.tagline,
          isFlipped: false,
          isMatched: false,
        });
      });
    });

    // Shuffle and take 8 rooms
    const shuffled = allRooms.sort(() => Math.random() - 0.5);
    const selectedRooms = shuffled.slice(0, 8);

    // Create pairs and shuffle
    const cardPairs = [...selectedRooms, ...selectedRooms].map((card, index) => ({
      ...card,
      id: `${card.id}-${index}`,
    }));

    setCards(cardPairs.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card?.isMatched) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      // Check if they match (same room tag)
      if (firstCard?.roomTag === secondCard?.roomTag) {
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
          toast.success(`Matched! ${firstCard.roomName}`);

          // Check if game is won
          if (matches + 1 === 8) {
            setGameWon(true);
            toast.success(`🎉 You won in ${moves + 1} moves!`);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(c => 
            c.id === first || c.id === second 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
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
                PALACE MEMORY
              </h1>
              <p className="text-sm text-amber-200/80" style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.2em" }}>
                Match the Sacred Rooms
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
              <p className="text-xs text-amber-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Matches</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent">
                {matches}<span className="text-2xl text-amber-500/50">/8</span>
              </p>
            </div>
          </div>
          <div className="relative text-center group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:blur-2xl transition-all" />
            <div className="relative bg-black/40 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-xs text-blue-200/80 mb-1 uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>Moves</p>
              <p className="text-5xl font-bold bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                {moves}
              </p>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card) => {
            const floorConfig = FLOOR_COLORS.find(c => c.floor === card.floorNumber) || FLOOR_COLORS[0];
            const RoomIcon = ROOM_ICONS[card.roomTag] || Book;
            
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-[2/3] cursor-pointer transition-all duration-500 ${
                  card.isFlipped || card.isMatched ? "" : "hover:scale-105 hover:-translate-y-2"
                }`}
                style={{ perspective: "1500px" }}
              >
                <div
                  className={`relative w-full h-full transition-all duration-700 ${
                    card.isFlipped || card.isMatched ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Card Back - Phototheology Branding */}
                  <div
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br ${floorConfig.color} border-4 ${floorConfig.border} ${floorConfig.glow} shadow-2xl flex flex-col overflow-hidden`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      boxShadow: `0 25px 50px -12px ${floorConfig.glow}, 0 0 0 1px rgba(255,255,255,0.1) inset`
                    }}
                  >
                    {/* Decorative pattern overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `
                        repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(255,255,255,.05) 15px, rgba(255,255,255,.05) 30px),
                        ${floorConfig.bgPattern}
                      `
                    }} />
                    
                    {/* Glowing orb effect */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-30 blur-3xl"
                      style={{ background: floorConfig.bgPattern }} />
                    
                    <div className="relative flex-1 flex flex-col items-center justify-center p-6">
                      {/* Floor Symbol */}
                      <div className="text-6xl mb-4 animate-pulse">
                        {floorConfig.symbol}
                      </div>
                      
                      {/* Title */}
                      <div className="text-center mb-6">
                        <h2 className="text-4xl font-black mb-2" style={{ 
                          fontFamily: "'Cinzel', serif",
                          color: "#ffd700",
                          textShadow: "0 0 20px rgba(255,215,0,0.6), 3px 3px 8px rgba(0,0,0,0.9)",
                          letterSpacing: "0.1em"
                        }}>
                          PHOTO
                        </h2>
                        <h3 className="text-3xl font-black" style={{ 
                          fontFamily: "'Cinzel', serif",
                          color: "#ffd700",
                          textShadow: "0 0 20px rgba(255,215,0,0.6), 3px 3px 8px rgba(0,0,0,0.9)",
                          letterSpacing: "0.1em"
                        }}>
                          THEOLOGY
                        </h3>
                      </div>
                      
                      {/* Visual Metaphor */}
                      <div className="relative mb-6">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/30 via-amber-200/20 to-white/10 backdrop-blur-md flex items-center justify-center border-4 border-amber-300/50 shadow-2xl">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/40 to-yellow-500/40 flex items-center justify-center">
                            <RoomIcon className="w-10 h-10 text-white drop-shadow-2xl" />
                          </div>
                        </div>
                        {/* Decorative rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: "3s" }} />
                      </div>
                      
                      {/* Scripture Reference Icon */}
                      <div className="text-4xl mb-2 opacity-80">📖</div>
                    </div>
                    
                    {/* Bottom Tagline Section */}
                    <div className="relative h-20 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                      <div className="absolute inset-0 flex items-center justify-center px-4">
                        <p className="text-xs font-bold tracking-widest text-center uppercase" style={{
                          fontFamily: "'Cinzel', serif",
                          color: "#ffd700",
                          textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(255,215,0,0.3)"
                        }}>
                          {floorConfig.tagline}
                        </p>
                      </div>
                      
                      {/* Cityscape/Palace silhouette */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 flex items-end justify-center gap-1 px-3">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-amber-400/60 to-amber-300/30 rounded-t-sm"
                            style={{
                              width: `${Math.random() * 6 + 3}px`,
                              height: `${Math.random() * 25 + 15}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Front - Room Details */}
                  <div
                    className={`absolute w-full h-full rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50/80 to-amber-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 border-4 ${floorConfig.border} shadow-2xl flex flex-col overflow-hidden ${
                      card.isMatched ? "opacity-60" : ""
                    }`}
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px ${floorConfig.border} inset`
                    }}
                  >
                    {/* Decorative corner ornaments */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-amber-400/50 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-amber-400/50 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-amber-400/50 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-amber-400/50 rounded-br-lg" />
                    
                    {/* Top Gold Banner */}
                    <div className="relative bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 px-4 py-3 shadow-lg">
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 11px)"
                      }} />
                      <h3 className="relative text-center font-black text-gray-900 text-base uppercase tracking-wide" style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: "1px 1px 2px rgba(255,255,255,0.5)"
                      }}>
                        {card.roomName}
                      </h3>
                    </div>
                    
                    {/* Main Content */}
                    <div className="flex-1 p-4 flex flex-col justify-between relative">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                      }} />
                      
                      {/* Room Icon & Tag */}
                      <div className="relative text-center mb-4">
                        <div className="inline-flex flex-col items-center gap-2">
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${floorConfig.color} flex items-center justify-center shadow-xl border-4 ${floorConfig.border}`}>
                            <RoomIcon className="w-10 h-10 text-white drop-shadow-lg" />
                          </div>
                          <div className={`text-5xl font-black bg-gradient-to-br ${floorConfig.color} bg-clip-text text-transparent`} style={{
                            fontFamily: "'Playfair Display', serif"
                          }}>
                            {card.roomTag}
                          </div>
                        </div>
                      </div>
                      
                      {/* Room Description */}
                      <div className="relative flex-1 flex items-center justify-center px-3">
                        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 backdrop-blur-sm border border-amber-200/50 dark:border-slate-700/50">
                          <p className="text-xs text-center leading-relaxed text-gray-800 dark:text-gray-200" style={{
                            fontFamily: "'Cormorant Garamond', serif"
                          }}>
                            {card.roomPurpose}
                          </p>
                        </div>
                      </div>
                      
                      {/* Match Trophy */}
                      {card.isMatched && (
                        <div className="relative text-center my-3">
                          <div className="inline-block relative">
                            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse" />
                            <Trophy className="relative w-12 h-12 text-yellow-500 drop-shadow-2xl animate-bounce" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Floor Info Banner */}
                    <div className={`relative bg-gradient-to-r ${floorConfig.color} px-4 py-3 shadow-lg`}>
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.2) 10px, rgba(255,255,255,.2) 20px)"
                      }} />
                      <div className="relative text-center">
                        <p className="text-xs text-white font-black mb-1 uppercase tracking-wider" style={{
                          fontFamily: "'Cinzel', serif",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                        }}>
                          Floor {card.floorNumber} • {card.floorName}
                        </p>
                        
                        {/* Mini cityscape */}
                        <div className="flex items-end justify-center gap-px h-4">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-yellow-300/70 rounded-t-sm"
                              style={{
                                width: "5px",
                                height: `${Math.random() * 12 + 4}px`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
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
                    You mastered the Palace in <span className="font-bold text-yellow-400">{moves}</span> moves!
                  </p>
                  
                  <p className="text-sm text-amber-300/80 mb-8 italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    "The palace of wisdom is built one room at a time"
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
