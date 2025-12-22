import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const GiveGemButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gem, setGem] = useState<{ title: string; content: string } | null>(null);
  const { toast } = useToast();

  const handleGenerateGem = async () => {
    setIsGenerating(true);
    setGem(null);
    setIsOpen(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-gem');

      if (error) {
        throw error;
      }

      // Check if limit was reached
      if (data?.limit_reached) {
        toast({
          title: "Daily Limit Reached",
          description: data.error || "You've discovered all your gems for today. Return tomorrow!",
          variant: "default"
        });
        setIsOpen(false);
        return;
      }

      if (data?.gem) {
        setGem({
          title: data.title || 'A Precious Gem',
          content: data.gem
        });
      }
    } catch (error: any) {
      console.error('Error generating gem:', error);
      
      // Handle rate limit from edge function
      if (error?.message?.includes('limit') || error?.status === 429) {
        toast({
          title: "Daily Limit Reached",
          description: "You've discovered all your gems for today. Return tomorrow!",
          variant: "default"
        });
      } else {
        toast({
          title: "Unable to generate gem",
          description: error.message || "Please try again in a moment",
          variant: "destructive"
        });
      }
      setIsOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setGem(null);
  };

  return (
    <>
      <Button
        onClick={handleGenerateGem}
        disabled={isGenerating}
        size="lg"
        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Discovering...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
            Give Me A Gem
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-amber-500" />
                {isGenerating ? "Discovering Your Gem..." : gem?.title || "Your Gem"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="px-6 pb-6 max-h-[calc(85vh-100px)]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-xl opacity-50 animate-pulse" />
                  <Sparkles className="h-16 w-16 text-amber-500 relative animate-bounce" />
                </div>
                <p className="text-muted-foreground text-center">
                  Searching the depths of Scripture for a unique gem just for you...
                </p>
              </div>
            ) : gem ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {gem.content}
                </div>
              </div>
            ) : null}
          </ScrollArea>

          {gem && !isGenerating && (
            <div className="px-6 pb-6 pt-2 border-t">
              <Button 
                onClick={handleGenerateGem} 
                variant="outline" 
                className="w-full"
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Discover Another Gem
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
