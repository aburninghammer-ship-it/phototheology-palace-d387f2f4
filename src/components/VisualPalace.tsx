import { Link } from "react-router-dom";
import { Lock, Sparkles, Eye, Search, Zap, BookOpen, Telescope, Globe, Flame, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { palaceFloors } from "@/data/palaceData";

// Floor-specific icons and theming
const FLOOR_THEMES = [
  {
    icon: Eye,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    glow: "shadow-[0_0_80px_rgba(168,85,247,0.4)]",
    symbol: "📚",
    tagline: "Build Your Visual Library",
    pattern: "repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.05) 10px, transparent 20px)"
  },
  {
    icon: Search,
    gradient: "from-blue-600 via-indigo-600 to-blue-700",
    glow: "shadow-[0_0_80px_rgba(59,130,246,0.4)]",
    symbol: "🔍",
    tagline: "Investigate Every Detail",
    pattern: "repeating-conic-gradient(rgba(255,255,255,0.05) 0deg 90deg, transparent 90deg 180deg)"
  },
  {
    icon: Zap,
    gradient: "from-cyan-600 via-teal-600 to-emerald-600",
    glow: "shadow-[0_0_80px_rgba(6,182,212,0.4)]",
    symbol: "⚡",
    tagline: "Connect Scripture to Life",
    pattern: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)"
  },
  {
    icon: BookOpen,
    gradient: "from-emerald-600 via-green-600 to-teal-600",
    glow: "shadow-[0_0_80px_rgba(16,185,129,0.4)]",
    symbol: "✝️",
    tagline: "See Christ in Everything",
    pattern: "repeating-linear-gradient(0deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 16px)"
  },
  {
    icon: Telescope,
    gradient: "from-amber-600 via-orange-600 to-red-600",
    glow: "shadow-[0_0_80px_rgba(251,146,60,0.4)]",
    symbol: "🔭",
    tagline: "Unlock Prophecy & Sanctuary",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)"
  },
  {
    icon: Globe,
    gradient: "from-rose-600 via-pink-600 to-red-600",
    glow: "shadow-[0_0_80px_rgba(244,63,94,0.4)]",
    symbol: "🌍",
    tagline: "Master Cycles & Horizons",
    pattern: "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)"
  },
  {
    icon: Flame,
    gradient: "from-violet-600 via-purple-600 to-indigo-600",
    glow: "shadow-[0_0_80px_rgba(139,92,246,0.4)]",
    symbol: "🔥",
    tagline: "Experience Transformation",
    pattern: "repeating-radial-gradient(ellipse at 0 0, transparent 0, rgba(255,255,255,0.05) 15px, transparent 30px)"
  },
  {
    icon: Crown,
    gradient: "from-yellow-600 via-amber-600 to-orange-600",
    glow: "shadow-[0_0_80px_rgba(251,191,36,0.4)]",
    symbol: "👑",
    tagline: "Become the Master",
    pattern: "conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.05) 0deg, transparent 30deg, rgba(255,255,255,0.05) 60deg, transparent 90deg)"
  }
];

export const VisualPalace = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Palace Title */}
      <div className="text-center mb-12 animate-fade-in relative">
        <div className="inline-flex items-center gap-3 mb-6">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          <h2 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            The Eight-Floor Palace
          </h2>
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="font-cormorant text-lg md:text-xl text-muted-foreground italic mb-2">
          Master the Art of Phototheology
        </p>
        <p className="text-sm text-muted-foreground">
          38 Rooms across 8 Floors • Click any room to enter
        </p>
      </div>

      {/* Palace Structure */}
      <div className="relative flex flex-col-reverse gap-4 rounded-2xl overflow-hidden p-4 bg-gradient-to-b from-background via-muted/20 to-background border-2 border-border shadow-2xl">
        {palaceFloors.map((floor, floorIndex) => {
          const theme = FLOOR_THEMES[floorIndex];
          return (
            <FloorSection 
              key={floor.number} 
              floor={floor} 
              theme={theme}
              user={user}
            />
          );
        })}
        
        {/* Palace Roof - Ornamental */}
        <div className="relative h-24 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent rounded-t-2xl border-b-4 border-primary/50 overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, currentColor 50px, currentColor 51px)'
          }} />
          
          {/* Center ornament */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary via-accent to-primary shadow-2xl shadow-primary/50 animate-pulse border-4 border-primary-foreground/20" />
              <Crown className="absolute inset-0 m-auto h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          {/* Side ornaments */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/30 backdrop-blur-sm border-2 border-primary/50" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/30 backdrop-blur-sm border-2 border-primary/50" />
        </div>
      </div>

      {/* Palace Foundation - Ornamental */}
      <div className="relative h-16 rounded-b-2xl overflow-hidden mt-4 border-2 border-border">
        <div className="absolute inset-0 bg-gradient-to-t from-muted via-border/50 to-transparent" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, currentColor 8px, currentColor 9px)'
        }} />
      </div>
    </div>
  );
};

interface FloorSectionProps {
  floor: any;
  theme: typeof FLOOR_THEMES[0];
  user: any;
}

const FloorSection = ({ floor, theme, user }: FloorSectionProps) => {
  const Icon = theme.icon;
  
  return (
    <div className="relative group rounded-xl overflow-hidden border-2 border-border/50 transition-all duration-300 hover:border-primary/50">
      {/* Floor Header - Picturesque Design */}
      <div className={`relative bg-gradient-to-r ${theme.gradient} p-6 overflow-hidden ${theme.glow}`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          background: theme.pattern
        }} />
        
        {/* Diagonal shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floor content */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Floor number badge */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40 shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                <span className="font-cinzel text-2xl font-bold text-white drop-shadow-lg">
                  {floor.number}
                </span>
              </div>
              {/* Corner ornaments */}
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/60" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/60" />
            </div>
            
            {/* Floor info */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-white/90" />
                <span className="font-cinzel text-2xl font-bold text-white drop-shadow-lg">
                  {floor.name}
                </span>
              </div>
              <span className="font-cormorant text-white/90 text-sm italic">
                {theme.tagline}
              </span>
              <span className="text-white/70 text-xs font-medium">
                {floor.subtitle}
              </span>
            </div>
          </div>
          
          {/* Room count badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="relative">
              <div className="px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-xl">
                <span className="font-cinzel text-lg font-bold text-white">
                  {theme.symbol}
                </span>
              </div>
            </div>
            <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/30">
              <span className="text-white/90 text-xs font-semibold">
                {floor.rooms.length} rooms
              </span>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {/* Rooms Grid - Enhanced */}
      <div className="relative bg-gradient-to-b from-muted/40 via-background/50 to-background/80 backdrop-blur-sm p-8 min-h-[200px]">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-border/30" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-border/30" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-border/30" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-border/30" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
          {floor.rooms.map((room: any) => (
            <RoomDoor
              key={room.id}
              room={room}
              floorNumber={floor.number}
              theme={theme}
              user={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface RoomDoorProps {
  room: any;
  floorNumber: number;
  theme: typeof FLOOR_THEMES[0];
  user: any;
}

const RoomDoor = ({ room, floorNumber, theme, user }: RoomDoorProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
    >
      <div className="flex flex-col gap-3">
        {/* Door Card - Picturesque Design */}
        <div 
          className={`
            relative aspect-[3/4] rounded-2xl overflow-hidden border-3
            transition-all duration-500 cursor-pointer
            ${isUnlocked 
              ? `bg-gradient-to-br ${theme.gradient} hover:scale-105 hover:rotate-1 ${theme.glow} shadow-xl` 
              : 'bg-gradient-to-br from-muted via-muted-foreground/20 to-muted opacity-60 grayscale'
            }
          `}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            background: theme.pattern
          }} />
          
          {/* Card border frame */}
          <div className="absolute inset-3 border-2 border-white/30 rounded-xl" />
          <div className="absolute inset-4 border border-white/20 rounded-lg" />
          
          {/* Top ornamental banner */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/40 to-transparent flex items-center justify-center">
            <div className="px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/40">
              <span className="font-cinzel text-xs font-bold text-white tracking-wider">
                {room.tag}
              </span>
            </div>
          </div>
          
          {/* Center room name */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="font-cinzel text-sm font-bold text-white drop-shadow-2xl leading-tight px-2">
                {room.name}
              </div>
            </div>
          </div>
          
          {/* Door handle */}
          <div className={`
            absolute right-6 top-1/2 -translate-y-1/2 
            w-4 h-8 rounded-full 
            transition-all duration-300
            ${isUnlocked 
              ? 'bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-500 shadow-lg shadow-yellow-500/50 group-hover:scale-110' 
              : 'bg-muted-foreground/40'
            }
          `}>
            {/* Handle detail */}
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </div>

          {/* Lock/Unlock indicator */}
          <div className="absolute bottom-3 right-3">
            {isUnlocked ? (
              <div className="w-8 h-8 rounded-full bg-green-500/30 backdrop-blur-md border-2 border-green-400/60 flex items-center justify-center shadow-lg shadow-green-500/30">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-500/30 backdrop-blur-md border-2 border-red-400/60 flex items-center justify-center shadow-lg shadow-red-500/30">
                <Lock className="h-4 w-4 text-red-400" />
              </div>
            )}
          </div>

          {/* Shine effect on hover */}
          {isUnlocked && (
            <>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
              </div>
            </>
          )}
          
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/40" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-white/40" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-white/40" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/40" />
        </div>

        {/* Room tag label below */}
        <div className="text-center">
          <div className={`
            font-cormorant text-xs italic
            transition-all duration-300
            ${isUnlocked 
              ? 'text-foreground opacity-70 group-hover:opacity-100 group-hover:scale-105' 
              : 'text-muted-foreground opacity-50'
            }
          `}>
            {room.name}
          </div>
        </div>
      </div>
    </Link>
  );
};
