import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getValidatedRoom } from "@/utils/palaceValidation";

interface RoomLinkProps {
  roomTag: string;
  inline?: boolean;
}

export const RoomLink: React.FC<RoomLinkProps> = ({ roomTag, inline = false }) => {
  // Use the validated room registry from palaceValidation to prevent hallucinations
  const validatedRoom = getValidatedRoom(roomTag);
  
  if (!validatedRoom) return <span>{roomTag}</span>;
  
  if (inline) {
    return (
      <Link 
        to={`/palace?floor=${validatedRoom.floor}&room=${roomTag.toLowerCase()}`}
        className="text-primary hover:underline font-semibold"
      >
        {validatedRoom.name}
      </Link>
    );
  }
  
  return (
    <Link to={`/palace?floor=${validatedRoom.floor}&room=${roomTag.toLowerCase()}`}>
      <Badge variant="outline" className="hover:bg-primary/10 cursor-pointer">
        {validatedRoom.tag} - {validatedRoom.name} (Floor {validatedRoom.floor})
      </Badge>
    </Link>
  );
};