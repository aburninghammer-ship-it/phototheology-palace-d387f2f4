import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Crown } from "lucide-react";
import { GLOBAL_TITLES } from "@/utils/masteryCalculations";
import { useState } from "react";

interface FloorProgressTowerProps {
  floors: any[];
  globalTitle: any;
}

const FLOOR_CONFIG: Record<number, { color: string; bg: string; text: string; title: string; name: string }> = {
  1: { color: "blue", bg: "bg-blue-500", text: "text-blue-500", title: "Blue Master", name: "Furnishing" },
  2: { color: "red", bg: "bg-red-500", text: "text-red-500", title: "Red Master", name: "Investigation" },
  3: { color: "yellow", bg: "bg-yellow-500", text: "text-yellow-500", title: "Gold Master", name: "Freestyle" },
  4: { color: "purple", bg: "bg-purple-500", text: "text-purple-500", title: "Purple Master", name: "Next Level" },
  5: { color: "white", bg: "bg-white border border-border", text: "text-white", title: "White Master", name: "Vision" },
  6: { color: "white", bg: "bg-white border border-border", text: "text-white", title: "White Master", name: "Three Heavens" },
  7: { color: "gray", bg: "bg-gray-800", text: "text-gray-300", title: "Black Candidate", name: "Transformation" },
  8: { color: "black", bg: "bg-black", text: "text-white", title: "Black Master", name: "Master" },
};

export const FloorProgressTower: React.FC<FloorProgressTowerProps> = ({
  floors,
  globalTitle,
}) => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (floorNum: number) => {
    setOpenSections(prev => 
      prev.includes(floorNum) 
        ? prev.filter(l => l !== floorNum)
        : [...prev, floorNum]
    );
  };

  // Sort floors 1-8 for display
  const sortedFloors = [...floors].sort((a, b) => a.floor_number - b.floor_number);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-6 w-6" />
          Global Master Titles
        </CardTitle>
        <CardDescription>
          Master rooms to unlock prestigious titles across the Palace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedFloors.map((floor) => {
            const config = FLOOR_CONFIG[floor.floor_number];
            const isCompleted = !!floor.floor_completed_at;
            const isUnlocked = floor.is_unlocked;
            const isCurrent = floor.floor_number === globalTitle?.current_floor;
            const roomsRemaining = Math.max(0, floor.rooms_required - floor.rooms_completed);

            return (
              <Collapsible
                key={floor.floor_number}
                open={openSections.includes(floor.floor_number)}
                onOpenChange={() => toggleSection(floor.floor_number)}
              >
                <div className={`rounded-lg border-2 ${isCurrent ? 'border-primary/50' : 'border-border'} bg-card transition-all`}>
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center text-xs font-bold ${config.color === 'white' || config.color === 'black' ? 'text-black' : 'text-white'}`}>
                        {floor.floor_number}
                      </div>
                      <h3 className={`font-bold text-lg uppercase ${config.text}`}>
                        {config.title.toUpperCase()} — {floor.rooms_completed}/{floor.rooms_required} Rooms Mastered
                      </h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 transition-transform ${openSections.includes(floor.floor_number) ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="animate-accordion-down">
                    <div className="px-4 pb-4 space-y-2">
                      <div>
                        <span className="font-bold">Requirements: </span>
                        <span className="text-muted-foreground">
                          {isCompleted 
                            ? `Complete ${floor.rooms_required} rooms + pass assessment` 
                            : roomsRemaining > 0 
                              ? `${roomsRemaining} more rooms to complete`
                              : "Assessment unlocked"}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">Reward: </span>
                        <span className="text-muted-foreground">
                          {config.title} title
                          {floor.floor_number === 8 && " + Black Master privileges"}
                        </span>
                      </div>
                      {!isCompleted && roomsRemaining > 0 && (
                        <p className="text-sm text-primary">
                          {roomsRemaining} more {roomsRemaining === 1 ? 'room' : 'rooms'} to unlock
                        </p>
                      )}
                      {isCurrent && !isCompleted && (
                        <Badge variant="default" className="mt-2">
                          Current Floor
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="default" className="mt-2 bg-green-500">
                          ✓ Completed
                        </Badge>
                      )}
                      {floor.floor_number === 8 && isUnlocked && !isCompleted && (
                        <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/20">
                          <p className="text-xs font-semibold text-destructive">
                            ⚠️ BLACK MASTER EXAM: 95% required. No mercy.
                          </p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
