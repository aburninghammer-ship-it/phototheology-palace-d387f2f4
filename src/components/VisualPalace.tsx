import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { palaceFloors } from "@/data/palaceData";

const floorGradients = [
  "gradient-palace",
  "gradient-royal",
  "gradient-ocean",
  "gradient-forest",
  "gradient-sunset",
  "gradient-warmth",
  "gradient-dreamy",
  "gradient-palace"
];

const floorColors = [
  "from-purple-600 via-purple-500 to-purple-600",
  "from-blue-600 via-blue-500 to-blue-600",
  "from-cyan-600 via-cyan-500 to-cyan-600",
  "from-emerald-600 via-emerald-500 to-emerald-600",
  "from-orange-600 via-orange-500 to-orange-600",
  "from-rose-600 via-rose-500 to-rose-600",
  "from-violet-600 via-violet-500 to-violet-600",
  "from-indigo-600 via-indigo-500 to-indigo-600"
];

export const VisualPalace = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Palace Title */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold bg-gradient-palace bg-clip-text text-transparent">
            The Eight-Floor Palace
          </h2>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm">
          Click any room door to enter • 38 Rooms across 8 Floors
        </p>
      </div>

      {/* Palace Structure */}
      <div className="relative flex flex-col-reverse gap-0 shadow-2xl rounded-lg overflow-hidden border-4 border-border bg-gradient-to-b from-background to-muted/30">
        {palaceFloors.map((floor, floorIndex) => (
          <FloorSection 
            key={floor.number} 
            floor={floor} 
            gradient={floorGradients[floorIndex]}
            floorColor={floorColors[floorIndex]}
            user={user}
          />
        ))}
        
        {/* Palace Roof */}
        <div className="relative h-16 bg-gradient-to-b from-primary/20 to-primary/10 border-b-2 border-primary/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-palace shadow-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Palace Foundation */}
      <div className="h-12 bg-gradient-to-t from-muted via-border to-transparent rounded-b-lg shadow-xl" />
    </div>
  );
};

interface FloorSectionProps {
  floor: any;
  gradient: string;
  floorColor: string;
  user: any;
}

const FloorSection = ({ floor, gradient, floorColor, user }: FloorSectionProps) => {
  return (
    <div className="relative group border-t-2 border-border/50">
      {/* Floor Header */}
      <div className={`bg-gradient-to-r ${floorColor} p-4 flex items-center justify-between shadow-lg relative overflow-hidden`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px)',
          }} />
        </div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg border-2 border-white/30">
            {floor.number}
          </div>
          <div>
            <span className="text-white font-bold text-lg block">{floor.name}</span>
            <span className="text-white/80 text-xs">{floor.subtitle}</span>
          </div>
        </div>
        <div className="text-white/90 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
          {floor.rooms.length} rooms
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="bg-gradient-to-b from-muted/30 to-background/50 backdrop-blur-sm p-6 min-h-[180px]">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {floor.rooms.map((room: any) => (
            <RoomDoor
              key={room.id}
              room={room}
              floorNumber={floor.number}
              gradient={gradient}
              floorColor={floorColor}
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
  gradient: string;
  floorColor: string;
  user: any;
}

const RoomDoor = ({ room, floorNumber, gradient, floorColor, user }: RoomDoorProps) => {
  const { isUnlocked, loading } = useRoomUnlock(floorNumber, room.id);

  return (
    <Link
      to={`/palace/floor/${floorNumber}/room/${room.id}`}
      className={`group relative ${!isUnlocked ? 'pointer-events-none' : ''}`}
    >
      <div className="flex flex-col gap-2">
        {/* Door */}
        <div 
          className={`
            relative aspect-[3/4] rounded-xl border-3 overflow-hidden
            transition-all duration-300 cursor-pointer
            ${isUnlocked 
              ? `${gradient} hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 shadow-lg` 
              : 'bg-muted border-muted-foreground/20 opacity-60 grayscale'
            }
          `}
        >
          {/* Door Panel Design */}
          <div className="absolute inset-3 flex flex-col gap-2">
            {/* Upper Panel */}
            <div className="flex-1 bg-card/10 rounded-lg border border-white/20 backdrop-blur-sm" />
            {/* Lower Panel */}
            <div className="flex-1 bg-card/10 rounded-lg border border-white/20 backdrop-blur-sm" />
          </div>
          
          {/* Door Handle */}
          <div className={`
            absolute right-4 top-1/2 -translate-y-1/2 
            w-3 h-6 rounded-full 
            ${isUnlocked ? 'bg-yellow-400 shadow-md' : 'bg-muted-foreground/40'}
          `} />

          {/* Lock/Unlock Indicator */}
          <div className="absolute top-2 right-2">
            {isUnlocked ? (
              <div className="w-6 h-6 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-400/50 flex items-center justify-center">
                <Lock className="h-3 w-3 text-red-400" />
              </div>
            )}
          </div>

          {/* Shine effect on hover */}
          {isUnlocked && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
            </div>
          )}
        </div>

        {/* Room Tag - Always Visible */}
        <div className="text-center">
          <div className={`
            inline-block px-2 py-1 rounded-md text-xs font-bold
            transition-all duration-300
            ${isUnlocked 
              ? 'bg-primary text-primary-foreground shadow-sm group-hover:shadow-md group-hover:scale-105' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {room.tag}
          </div>
          {/* Room name on hover */}
          <div className="mt-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2 px-1">
            {room.name}
          </div>
        </div>
      </div>
    </Link>
  );
};
