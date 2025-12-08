import { useState } from "react";
import { motion } from "framer-motion";
import { getCardImage, getCardBack, floorColors } from "@/data/cardImages";
import { cn } from "@/lib/utils";

interface RoomCardProps {
  roomId: string;
  roomName: string;
  floor: number;
  className?: string;
  showBack?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-32 h-48",
  md: "w-48 h-72",
  lg: "w-64 h-96",
};

export function RoomCard({
  roomId,
  roomName,
  floor,
  className,
  showBack = false,
  onClick,
  size = "md",
}: RoomCardProps) {
  const [isFlipped, setIsFlipped] = useState(showBack);
  const cardImage = getCardImage(roomId);
  const cardBackImage = getCardBack(floor);
  const floorColor = floorColors[floor] || floorColors[1];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (cardImage) {
      setIsFlipped(!isFlipped);
    }
  };

  // If no card image exists, show a placeholder
  if (!cardImage) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "rounded-xl border-2 flex items-center justify-center",
          floorColor.bg,
          floorColor.border,
          "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="text-center p-4">
          <p className="text-sm text-muted-foreground">Card Coming Soon</p>
          <p className="text-xs mt-1">{roomName}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        "perspective-1000 cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={cardImage}
            alt={roomName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-lg"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)" 
          }}
        >
          <img
            src={cardBackImage}
            alt="Card back"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default RoomCard;
