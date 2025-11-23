import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getMasteryTitle } from "@/utils/masteryCalculations";
import { Star, Award, Trophy, Crown, Sparkles } from "lucide-react";

interface MasteryBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
  className?: string;
}

const LEVEL_ICONS = {
  1: Star,
  2: Award,
  3: Trophy,
  4: Crown,
  5: Sparkles,
} as const;

const LEVEL_COLORS = {
  1: "bg-slate-500",
  2: "bg-blue-500",
  3: "bg-purple-500",
  4: "bg-amber-500",
  5: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500",
} as const;

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({
  level,
  size = "md",
  showTitle = true,
  className,
}) => {
  const Icon = LEVEL_ICONS[level as keyof typeof LEVEL_ICONS] || Star;
  const title = getMasteryTitle(level);
  
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1.5 font-semibold",
        LEVEL_COLORS[level as keyof typeof LEVEL_COLORS],
        level === 5 && "animate-pulse",
        className
      )}
    >
      <Icon className={sizeClasses[size]} />
      {showTitle && <span>{title}</span>}
    </Badge>
  );
};
