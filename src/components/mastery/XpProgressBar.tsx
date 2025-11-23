import { Progress } from "@/components/ui/progress";
import { calculateProgressPercentage } from "@/utils/masteryCalculations";
import { cn } from "@/lib/utils";

interface XpProgressBarProps {
  currentXp: number;
  xpRequired: number;
  level: number;
  showLabel?: boolean;
  className?: string;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  currentXp,
  xpRequired,
  level,
  showLabel = true,
  className,
}) => {
  const percentage = calculateProgressPercentage(currentXp, xpRequired);
  const isMaxLevel = level === 5;

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {isMaxLevel ? "Max Level Reached" : "Progress to Next Level"}
          </span>
          {!isMaxLevel && (
            <span className="font-semibold">
              {currentXp} / {xpRequired} XP
            </span>
          )}
        </div>
      )}
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isMaxLevel && "bg-gradient-to-r from-amber-200 to-yellow-200"
        )}
      />
      {isMaxLevel && (
        <p className="text-xs text-center text-muted-foreground">
          ✨ You've mastered this room! ✨
        </p>
      )}
    </div>
  );
};
