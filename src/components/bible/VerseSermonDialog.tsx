import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  Church,
  Telescope,
  Heart,
  Sparkles,
  Loader2,
  ChevronDown,
  Mic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FullStarter {
  starterTitle: string;
  starterParagraph?: string;
  bigIdea: string;
  palaceAnchors?: string[];
  roomRefs?: string[];
  internalTemplate?: {
    governingPrinciple?: string;
    christologicalAxis?: string;
    falseCenterExposed?: string;
    gospelResolution?: string;
  };
}

interface VerseSermonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseRef: string;
  verseText: string;
}

const CATEGORIES = [
  { id: "everlasting-gospel", label: "Themes", icon: BookOpen },
  { id: "occasions", label: "Occasions", icon: Calendar },
  { id: "sanctuary", label: "Doctrine", icon: Church },
  { id: "prophecy", label: "Prophecy", icon: Telescope },
  { id: "righteousness-by-faith", label: "Christian Living", icon: Heart },
];

export function VerseSermonDialog({
  open,
  onOpenChange,
  verseRef,
  verseText,
}: VerseSermonDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [starter, setStarter] = useState<FullStarter | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCategory(null);
      setStarter(null);
      setExpandedSection(null);
    }
  }, [open]);

  const generateStarter = async (category: string) => {
    setSelectedCategory(category);
    setGenerating(true);
    setStarter(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
        body: {
          topic: verseRef,
          level: "Intermediate",
          anchorScriptures: [verseRef],
          category: category === "occasions" ? null : category,
        },
      });

      if (error) throw error;

      if (data?.success && data?.starter) {
        setStarter(data.starter);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating starter:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate sermon starter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-amber-500" />
            <span>Sermon Idea Starters</span>
          </DialogTitle>
          <DialogDescription>
            {verseRef} — "{verseText.substring(0, 80)}{verseText.length > 80 ? "..." : ""}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Select a category to generate PT-based sermon ideas:
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => generateStarter(cat.id)}
                    disabled={generating}
                    className={isActive ? "" : ""}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <ScrollArea className="max-h-[50vh]">
            <AnimatePresence mode="wait">
              {generating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 p-4"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Jeeves is generating sermon ideas...</span>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </motion.div>
              )}

              {!generating && starter && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-1"
                >
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-lg">{starter.starterTitle}</h3>
                  </div>

                  {/* Big Idea */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      💡 {starter.bigIdea}
                    </p>
                  </div>

                  {/* Starter Paragraph */}
                  {starter.starterParagraph && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {starter.starterParagraph}
                    </p>
                  )}

                  {/* Palace Anchors */}
                  {starter.palaceAnchors && starter.palaceAnchors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {starter.palaceAnchors.map((anchor, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {anchor}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Room Refs */}
                  {starter.roomRefs && starter.roomRefs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {starter.roomRefs.map((ref) => (
                        <Badge
                          key={ref}
                          variant="outline"
                          className="text-xs bg-primary/10"
                        >
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Internal Template Section */}
                  {starter.internalTemplate && (
                    <div
                      className="pt-3 border-t cursor-pointer"
                      onClick={() =>
                        setExpandedSection(expandedSection === "template" ? null : "template")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Theological Framework</h4>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedSection === "template" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {expandedSection === "template" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2 text-sm"
                          >
                            {starter.internalTemplate.governingPrinciple && (
                              <div>
                                <span className="text-muted-foreground">Governing Principle: </span>
                                <span>{starter.internalTemplate.governingPrinciple}</span>
                              </div>
                            )}
                            {starter.internalTemplate.christologicalAxis && (
                              <div>
                                <span className="text-muted-foreground">Christ Connection: </span>
                                <span>{starter.internalTemplate.christologicalAxis}</span>
                              </div>
                            )}
                            {starter.internalTemplate.falseCenterExposed && (
                              <div>
                                <span className="text-muted-foreground">False Center Exposed: </span>
                                <span>{starter.internalTemplate.falseCenterExposed}</span>
                              </div>
                            )}
                            {starter.internalTemplate.gospelResolution && (
                              <div>
                                <span className="text-muted-foreground">Gospel Resolution: </span>
                                <span>{starter.internalTemplate.gospelResolution}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {!generating && !starter && selectedCategory === null && (
                <div className="text-center py-8 text-muted-foreground">
                  <Mic className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Select a category above to generate sermon ideas</p>
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
