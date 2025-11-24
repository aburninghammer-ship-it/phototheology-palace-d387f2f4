import { Sword } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserMasterySwordProps {
  masterTitle?: string | null;
  currentFloor?: number;
  size?: "sm" | "md" | "lg";
}

const MASTERY_COLORS: Record<string, { color: string; label: string }> = {
  "none": { color: "text-green-500", label: "Apprentice (Green Sword)" },
  "blue": { color: "text-blue-500", label: "Blue Master" },
  "red": { color: "text-red-500", label: "Red Master" },
  "gold": { color: "text-yellow-600", label: "Gold Master" },
  "purple": { color: "text-purple-500", label: "Purple Master" },
  "white": { color: "text-gray-400", label: "White Master" },
  "black_candidate": { color: "text-gray-600", label: "Black Candidate" },
  "black": { color: "text-black dark:text-white", label: "Black Master" },
};

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const UserMasterySword: React.FC<UserMasterySwordProps> = ({ 
  masterTitle, 
  currentFloor = 0,
  size = "md" 
}) => {
  // Determine sword color based on master title or current floor
  let swordConfig = MASTERY_COLORS["none"]; // Default green for apprentices
  
  if (masterTitle === "black") {
    swordConfig = MASTERY_COLORS["black"];
  } else if (currentFloor >= 7) {
    swordConfig = MASTERY_COLORS["black_candidate"];
  } else if (currentFloor >= 5) {
    swordConfig = MASTERY_COLORS["white"];
  } else if (currentFloor >= 4) {
    swordConfig = MASTERY_COLORS["purple"];
  } else if (currentFloor >= 3) {
    swordConfig = MASTERY_COLORS["gold"];
  } else if (currentFloor >= 2) {
    swordConfig = MASTERY_COLORS["red"];
  } else if (currentFloor >= 1) {
    swordConfig = MASTERY_COLORS["blue"];
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Sword className={`${swordConfig.color} ${SIZE_CLASSES[size]}`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>{swordConfig.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
