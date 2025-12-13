import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePageLock } from "@/hooks/usePageLock";
import { cn } from "@/lib/utils";

interface PageLockToggleProps {
  className?: string;
}

export const PageLockToggle = ({ className }: PageLockToggleProps) => {
  const { isLocked, toggleLock } = usePageLock();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLock}
            className={cn(
              "h-8 px-2 gap-1.5 transition-all duration-300",
              isLocked 
                ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              className
            )}
          >
            {isLocked ? (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Locked</span>
              </>
            ) : (
              <>
                <Unlock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Lock</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[200px]">
          {isLocked ? (
            <p className="text-xs">Page is locked. Your position and state will be preserved. Click to unlock.</p>
          ) : (
            <p className="text-xs">Lock this page to preserve your exact position and state across sessions.</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
