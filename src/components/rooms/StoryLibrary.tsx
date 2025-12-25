import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Book, Users, MapPin, Sparkles, Cross, Church, CloudSun, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { allStoriesComplete, getVolumesComplete, getStoriesByVolumeComplete, searchStoriesComplete, type BiblicalStory } from "@/data/storyLibraryComplete";
import { StoryOfTheDay } from "./StoryOfTheDay";

interface StoryLibraryProps {
  onBack?: () => void;
}

export function StoryLibrary({ onBack }: StoryLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState<BiblicalStory | null>(null);
  const [selectedVolume, setSelectedVolume] = useState("Genesis");

  const volumes = getVolumesComplete();
  const displayedStories = searchQuery 
    ? searchStoriesComplete(searchQuery) 
    : getStoriesByVolumeComplete(selectedVolume);

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Room
        </Button>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">📚 Story Room Library</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore biblical narratives with Christ patterns and multi-dimensional applications. 
          Each story is designed for memorization as vivid mental movies.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search stories, people, or references..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Volume Tabs */}
      {!searchQuery && (
        <Tabs value={selectedVolume} onValueChange={setSelectedVolume} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {volumes.map(vol => (
              <TabsTrigger key={vol} value={vol}>{vol}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStories.map(story => (
          <Card 
            key={story.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedStory(story)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{story.title}</CardTitle>
                <Badge variant="secondary" className="text-xs shrink-0">{story.reference}</Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{story.category}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{story.summary}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{story.keyFigures?.slice(0, 2).join(", ")}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedStories.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No stories found. Try a different search.</p>
        </div>
      )}

      {/* Story Detail Dialog */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedStory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  {selectedStory.title}
                  <Badge>{selectedStory.reference}</Badge>
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Book className="h-4 w-4" /> Summary
                    </h3>
                    <p className="text-muted-foreground">{selectedStory.summary}</p>
                  </div>

                  {/* Key Figures & Setting */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedStory.keyFigures && (
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4" /> Key Figures
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedStory.keyFigures.map(fig => (
                            <Badge key={fig} variant="secondary">{fig}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedStory.setting && (
                      <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" /> Setting
                        </h3>
                        <p className="text-muted-foreground">{selectedStory.setting}</p>
                      </div>
                    )}
                  </div>

                  {/* Key Elements */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4" /> Key Elements
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                      {selectedStory.keyElements.map((el, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary">•</span> {el}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Christ Pattern */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
                      <Cross className="h-4 w-4" /> Christ Pattern
                    </h3>
                    <div className="grid gap-2">
                      {selectedStory.christPattern.map((cp, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm">
                          <span className="font-medium min-w-[140px]">{cp.element}</span>
                          <span className="text-muted-foreground">→ {cp.christApplication}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Six Dimensions */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                      Six Dimensions
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      {[
                        { key: "literal", label: "1D Literal", icon: "📖" },
                        { key: "christ", label: "2D Christ", icon: "✝️" },
                        { key: "personal", label: "3D Personal", icon: "👤" },
                        { key: "church", label: "4D Church", icon: "⛪" },
                        { key: "heavenFuture", label: "5D Heaven Future", icon: "🌟" },
                        { key: "heavenPast", label: "6D Heaven Past", icon: "⏳" },
                      ].map(dim => (
                        <div key={dim.key} className="p-2 bg-muted/50 rounded-lg">
                          <span className="font-medium">{dim.icon} {dim.label}:</span>
                          <p className="text-muted-foreground">{selectedStory.dimensions[dim.key as keyof typeof selectedStory.dimensions]}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Stories */}
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" /> Related Passages
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedStory.relatedStories.map((rs, i) => (
                        <li key={i}>• {rs}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
