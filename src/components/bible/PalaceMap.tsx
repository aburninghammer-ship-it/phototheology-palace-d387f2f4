import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, ChevronDown, ChevronRight } from "lucide-react";

interface PalaceMapProps {
  onRoomClick?: (roomCode: string, roomName: string) => void;
}

interface Room {
  code: string;
  name: string;
  color: string;
}

interface Floor {
  number: number;
  name: string;
  description: string;
  color: string;
  rooms: Room[];
}

const PALACE_STRUCTURE: Floor[] = [
  {
    number: 1,
    name: "Furnishing Floor",
    description: "Memory & Visualization (Width)",
    color: "bg-blue-500",
    rooms: [
      { code: "SR", name: "Story Room", color: "bg-blue-400" },
      { code: "IR", name: "Imagination Room", color: "bg-blue-400" },
      { code: "24F", name: "24FPS", color: "bg-blue-400" },
      { code: "BR", name: "Bible Rendered", color: "bg-blue-400" },
      { code: "TR", name: "Translation Room", color: "bg-blue-400" },
      { code: "GR", name: "Gems Room", color: "bg-blue-400" },
    ],
  },
  {
    number: 2,
    name: "Investigation Floor",
    description: "Detective Work (Width)",
    color: "bg-amber-500",
    rooms: [
      { code: "OR", name: "Observation Room", color: "bg-amber-400" },
      { code: "DC", name: "Def-Com", color: "bg-amber-400" },
      { code: "ST", name: "Symbols/Types", color: "bg-amber-400" },
      { code: "QR", name: "Questions Room", color: "bg-amber-400" },
      { code: "QA", name: "Q&A Chains", color: "bg-amber-400" },
    ],
  },
  {
    number: 3,
    name: "Freestyle Floor",
    description: "Connections (Time)",
    color: "bg-green-500",
    rooms: [
      { code: "NF", name: "Nature Freestyle", color: "bg-green-400" },
      { code: "PF", name: "Personal Freestyle", color: "bg-green-400" },
      { code: "BF", name: "Bible Freestyle", color: "bg-green-400" },
      { code: "HF", name: "History Freestyle", color: "bg-green-400" },
      { code: "LR", name: "Listening Room", color: "bg-green-400" },
    ],
  },
  {
    number: 4,
    name: "Next Level Floor",
    description: "Christ-Centered Depth",
    color: "bg-purple-500",
    rooms: [
      { code: "CR", name: "Concentration", color: "bg-purple-400" },
      { code: "DR", name: "Dimensions", color: "bg-purple-400" },
      { code: "C6", name: "Connect 6", color: "bg-purple-400" },
      { code: "TRm", name: "Theme Room", color: "bg-purple-400" },
      { code: "TZ", name: "Time Zone", color: "bg-purple-400" },
      { code: "PRm", name: "Patterns", color: "bg-purple-400" },
      { code: "P‖", name: "Parallels", color: "bg-purple-400" },
      { code: "FRt", name: "Fruit", color: "bg-purple-400" },
      { code: "CEC", name: "Christ/Chapter", color: "bg-purple-400" },
      { code: "R66", name: "Room 66", color: "bg-purple-400" },
    ],
  },
  {
    number: 5,
    name: "Vision Floor",
    description: "Prophecy & Sanctuary",
    color: "bg-pink-500",
    rooms: [
      { code: "BL", name: "Blue Room", color: "bg-pink-400" },
      { code: "PR", name: "Prophecy Room", color: "bg-pink-400" },
      { code: "3A", name: "Three Angels", color: "bg-pink-400" },
    ],
  },
  {
    number: 6,
    name: "Three Heavens Floor",
    description: "Cycles & Cosmic Context",
    color: "bg-indigo-500",
    rooms: [
      { code: "JR", name: "Juice Room", color: "bg-indigo-400" },
    ],
  },
  {
    number: 7,
    name: "Spiritual Floor",
    description: "Transformation (Height)",
    color: "bg-rose-500",
    rooms: [
      { code: "FRm", name: "Fire Room", color: "bg-rose-400" },
      { code: "MR", name: "Meditation Room", color: "bg-rose-400" },
      { code: "SRm", name: "Speed Room", color: "bg-rose-400" },
    ],
  },
  {
    number: 8,
    name: "Master Floor",
    description: "Reflexive Mastery (Height)",
    color: "bg-gray-500",
    rooms: [],
  },
];

export const PalaceMap = ({ onRoomClick }: PalaceMapProps) => {
  const [expandedFloors, setExpandedFloors] = useState<number[]>([1, 4]);

  const toggleFloor = (floorNumber: number) => {
    setExpandedFloors(prev =>
      prev.includes(floorNumber)
        ? prev.filter(f => f !== floorNumber)
        : [...prev, floorNumber]
    );
  };

  return (
    <Card className="p-4 space-y-3 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-2 border-indigo-500/20">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-indigo-600" />
        <h4 className="font-semibold text-sm text-foreground">Palace Map</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Navigate the 8-floor Phototheology Palace
      </p>

      <ScrollArea className="h-[600px]">
        <div className="space-y-2 pr-4">
          {PALACE_STRUCTURE.map((floor) => {
            const isExpanded = expandedFloors.includes(floor.number);
            
            return (
              <div key={floor.number} className="space-y-2">
                <div
                  onClick={() => toggleFloor(floor.number)}
                  className={`${floor.color} text-white p-3 rounded-lg cursor-pointer hover:opacity-90 transition-all`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-bold text-sm">
                          Floor {floor.number}
                        </span>
                        {floor.rooms.length > 0 && (
                          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                            {floor.rooms.length} rooms
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs mt-1 ml-6 opacity-90">
                        {floor.name} • {floor.description}
                      </p>
                    </div>
                  </div>
                </div>

                {isExpanded && floor.rooms.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {floor.rooms.map((room) => (
                      <div
                        key={room.code}
                        onClick={() => onRoomClick?.(room.code, room.name)}
                        className={`${room.color} text-white p-2 rounded cursor-pointer hover:opacity-90 transition-all flex items-center justify-between`}
                      >
                        <span className="text-sm">{room.name}</span>
                        <code className="text-xs font-mono bg-white/20 px-2 py-1 rounded">
                          {room.code}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && floor.number === 8 && (
                  <p className="ml-6 text-xs text-muted-foreground italic p-2 bg-accent/10 rounded">
                    No rooms — Reflexive mastery. The palace becomes you.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Click floors to expand/collapse. Click rooms to see all verses using that principle.
        </p>
      </div>
    </Card>
  );
};
