import { useState } from "react";
import { HelpCircle, Loader2, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type HelpContextType = "challenge" | "game" | "quiz" | "drill" | "verse_study" | "general";

interface HelpMeButtonProps {
  contextType?: HelpContextType;
  question?: string;
  context?: string;
  verseReference?: string;
  userAttempt?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const HelpMeButton = ({
  contextType = "general",
  question,
  context,
  verseReference,
  userAttempt,
  className,
  variant = "outline",
  size = "sm",
}: HelpMeButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);

  const getHelp = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("get-contextual-help", {
        body: {
          contextType,
          question,
          context: hintCount > 0 
            ? `${context || ""}\n\nPrevious hint given: "${hint}"\n\nUser still needs help. Provide a MORE SPECIFIC hint this time (hint #${hintCount + 1}).`
            : context,
          verseReference,
          userAttempt,
        },
      });

      if (error) throw error;

      if (data?.hint) {
        setHint(data.hint);
        setHintCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Help request error:", error);
      toast.error("Couldn't get help right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !hint) {
      getHelp();
    }
  };

  const resetHint = () => {
    setHint(null);
    setHintCount(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-950/30",
            className
          )}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Help Me</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 overflow-hidden" 
        align="end"
        side="top"
      >
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Lightbulb className="h-5 w-5" />
            <span className="font-semibold">Hint {hintCount > 0 ? `#${hintCount}` : ""}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
              <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
            </div>
          ) : hint ? (
            <div className="space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{hint}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getHelp}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Need More Help
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetHint();
                    setIsOpen(false);
                  }}
                  className="text-muted-foreground"
                >
                  Got It!
                </Button>
              </div>
              {hintCount >= 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  Tip: Sometimes stepping away and coming back helps!
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Click to get a helpful hint!
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
