import { Info, Lock, Unlock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSequentialMastery } from "@/hooks/useSequentialMastery";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SequentialMasteryNoticeProps {
  floorNumber: number;
  variant?: "compact" | "full";
}

export const SequentialMasteryNotice = ({ 
  floorNumber, 
  variant = "full" 
}: SequentialMasteryNoticeProps) => {
  const { canMaster, nextFloorToMaster, loading, masteryMessage } = useSequentialMastery(floorNumber);

  if (loading) return null;

  // Floor 1 always shows the welcome message
  if (floorNumber === 1) {
    if (variant === "compact") return null;
    return (
      <Alert className="border-primary/30 bg-primary/5">
        <Unlock className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Welcome to the Palace</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          You're free to explore any floor, but <strong>mastery progresses sequentially</strong>. 
          Complete this floor's training and assessment to unlock mastery for Floor 2.
        </AlertDescription>
      </Alert>
    );
  }

  // If they can master this floor
  if (canMaster) {
    if (variant === "compact") return null;
    return (
      <Alert className="border-emerald-500/30 bg-emerald-500/5">
        <Unlock className="h-4 w-4 text-emerald-500" />
        <AlertTitle className="text-emerald-600 dark:text-emerald-400">Ready to Master</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          You've completed all previous floors. Complete this floor's training and assessment to earn your mastery badge.
        </AlertDescription>
      </Alert>
    );
  }

  // If they cannot master this floor yet
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm">
        <Info className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-amber-600 dark:text-amber-400">
          Explore freely — mastery unlocks after completing Floor {nextFloorToMaster}
        </span>
      </div>
    );
  }

  return (
    <Alert className="border-amber-500/30 bg-amber-500/5">
      <Info className="h-4 w-4 text-amber-500" />
      <AlertTitle className="text-amber-600 dark:text-amber-400">Exploration Mode</AlertTitle>
      <AlertDescription className="text-muted-foreground space-y-2">
        <p>
          You're free to explore and learn from any room on any floor. However, <strong>mastery must be earned sequentially</strong>, 
          floor by floor, to ensure a solid foundation.
        </p>
        <p className="text-sm">
          {masteryMessage}
        </p>
        <div className="pt-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/palace/floor/${nextFloorToMaster}`}>
              Go to Floor {nextFloorToMaster}
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
