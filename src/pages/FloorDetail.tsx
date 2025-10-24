import { useParams, Link } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { useAuth } from "@/hooks/useAuth";
import { FloorRoomCard } from "@/components/FloorRoomCard";

export default function FloorDetail() {
  const { floorNumber } = useParams();
  const { user } = useAuth();
  const floor = palaceFloors.find(f => f.number === Number(floorNumber));

  if (!floor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Floor Not Found</h1>
          <Link to="/palace">
            <Button>Return to Palace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradient = [
    "gradient-palace",
    "gradient-royal", 
    "gradient-ocean",
    "gradient-forest",
    "gradient-sunset",
    "gradient-warmth",
    "gradient-dreamy",
    "gradient-palace"
  ][floor.number - 1];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/palace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Palace
          </Button>
        </Link>

        <div className={`${gradient} rounded-lg p-8 mb-8 text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-white border-white/50">
              Floor {floor.number}
            </Badge>
            <Badge variant="outline" className="text-white border-white/50">
              {floor.rooms.length} Rooms
            </Badge>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">{floor.name}</h1>
          <p className="text-xl mb-4 opacity-90">{floor.subtitle}</p>
          <p className="text-base opacity-80 leading-relaxed">{floor.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {floor.rooms.map((room) => (
            <FloorRoomCard
              key={room.id}
              room={room}
              floorNumber={floor.number}
              gradient={gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
