import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface RoomLinkProps {
  roomTag: string;
  inline?: boolean;
}

const ROOM_INFO: Record<string, { name: string; floor: number }> = {
  "SR": { name: "Story Room", floor: 1 },
  "IR": { name: "Imagination Room", floor: 1 },
  "F24": { name: "24FPS Room", floor: 1 },
  "BR": { name: "Bible Rendered", floor: 1 },
  "GEM": { name: "Gems Room", floor: 1 },
  "OR": { name: "Observation Room", floor: 2 },
  "DC": { name: "Def-Com Room", floor: 2 },
  "SY": { name: "Symbols Room", floor: 2 },
  "QR": { name: "Questions Room", floor: 2 },
  "QA": { name: "Q&A Room", floor: 2 },
  "MT": { name: "Mathematics Room", floor: 2 },
  "BF": { name: "Bible Freestyle", floor: 3 },
  "NF": { name: "Nature Freestyle", floor: 3 },
  "HF": { name: "History Freestyle", floor: 3 },
  "PF": { name: "Personal Freestyle", floor: 3 },
  "RF": { name: "Recipe Room", floor: 3 },
  "TR": { name: "Theme Room", floor: 4 },
  "CR": { name: "Concentration Room", floor: 4 },
  "DR": { name: "Dimensions Room", floor: 4 },
  "PR": { name: "Prophecy Room", floor: 5 },
  "TZ": { name: "Time Zones Room", floor: 5 },
  "CY": { name: "Cycles Room", floor: 6 },
  "CH": { name: "Chiasm Room", floor: 7 },
  "C6": { name: "Connect-6 Room", floor: 7 },
  "ST": { name: "Synthesis Room", floor: 8 },
  "ASC": { name: "Ascension Room", floor: 8 }
};

export const RoomLink: React.FC<RoomLinkProps> = ({ roomTag, inline = false }) => {
  const room = ROOM_INFO[roomTag];
  
  if (!room) return <span>{roomTag}</span>;
  
  if (inline) {
    return (
      <Link 
        to={`/palace?floor=${room.floor}&room=${roomTag}`}
        className="text-primary hover:underline font-semibold"
      >
        {room.name}
      </Link>
    );
  }
  
  return (
    <Link to={`/palace?floor=${room.floor}&room=${roomTag}`}>
      <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
        {roomTag} - {room.name} (Floor {room.floor})
      </Badge>
    </Link>
  );
};
