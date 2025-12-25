import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Layers, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  Search,
  Target,
  Crown,
  Shield,
  Heart,
  Users,
  Droplets
} from "lucide-react";
import { 
  SIX_PICTURE_PATTERNS, 
  SIX_DIMENSIONS, 
  FEAST_PATTERNS, 
  BOOK_PATTERNS,
  KEY_FIGURE_PATTERNS,
  WATERS_PATTERNS,
  getBookPattern,
  getKeyFigurePattern
} from "@/data/phototheologyMasterPatterns";

const CHRIST_TRACERS = [
  {
    id: "innocent_sufferer",
    name: "The Innocent Sufferer",
    icon: Heart,
    description: "Joseph, David, Jeremiah, Job - Prefigures Christ's unjust suffering",
    examples: ["Joseph falsely accused", "David persecuted by Saul", "Jeremiah rejected by his people"]
  },
  {
    id: "substitute",
    name: "The Substitute",
    icon: Shield,
    description: "Sacrifices, rams, lambs, scapegoat - Points to atonement and substitution",
    examples: ["Isaac's ram", "Passover lamb", "Day of Atonement goats"]
  },
  {
    id: "deliverer",
    name: "The Deliverer",
    icon: Crown,
    description: "Moses, judges, kings, shepherds - Foreshadows Christ's redemptive role",
    examples: ["Moses leading Exodus", "Gideon saving Israel", "David defeating Goliath"]
  },
  {
    id: "covenant_mediator",
    name: "The Covenant Mediator",
    icon: Users,
    description: "Prophets, priests, intercessors - Reveals Christ as mediator between God and humanity",
    examples: ["Abraham interceding for Sodom", "Moses on Sinai", "Samuel anointing kings"]
  },
  {
    id: "restorer",
    name: "The Restorer / Bridegroom / King",
    icon: Sparkles,
    description: "Boaz, Solomon, Davidic kingship - Anticipates Christ's reign and union with His people",
    examples: ["Boaz redeeming Ruth", "Solomon building the temple", "David's eternal throne promise"]
  }
];

export function PatternExplorer() {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null);

  const bookPattern = selectedBook ? getBookPattern(selectedBook) : null;
  const figurePattern = selectedFigure ? getKeyFigurePattern(selectedFigure) : null;

  return (
    <Card className="bg-card/50 backdrop-blur border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Phototheology Pattern Explorer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Discover Christ patterns across Scripture using the master frameworks
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patterns" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="patterns" className="text-xs">
              <Layers className="h-3 w-3 mr-1" />
              6 Walls
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              6 Dimensions
            </TabsTrigger>
            <TabsTrigger value="tracers" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              5 Tracers
            </TabsTrigger>
            <TabsTrigger value="feasts" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Feasts
            </TabsTrigger>
            <TabsTrigger value="books" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              Books
            </TabsTrigger>
          </TabsList>

          {/* Six Pattern Walls */}
          <TabsContent value="patterns" className="space-y-3">
            <ScrollArea className="h-[400px] pr-4">
              {SIX_PICTURE_PATTERNS.map((pattern, idx) => (
                <Card key={pattern.id} className="mb-3 bg-background/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10">
                        {idx + 1}
                      </Badge>
                      <CardTitle className="text-base">{pattern.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2">{pattern.description}</p>
                    <div className="space-y-1">
                      {pattern.applications.map((app, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <ChevronRight className="h-3 w-3 mt-0.5 text-primary" />
                          <span>{app}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Six Dimensions */}
          <TabsContent value="dimensions" className="space-y-3">
            <ScrollArea className="h-[400px] pr-4">
              {SIX_DIMENSIONS.map((dim) => (
                <Card key={dim.level} className="mb-3 bg-background/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground">
                        {dim.level}D
                      </Badge>
                      <CardTitle className="text-base">{dim.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    <p className="text-sm font-medium">{dim.question}</p>
                    <div className="bg-muted/50 p-2 rounded text-xs italic">
                      <span className="text-primary font-medium">Example: </span>
                      {dim.example}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Five Christ Tracers */}
          <TabsContent value="tracers" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Use these "visual cues" to spot Christ patterns in any passage—like finding Waldo:
            </p>
            <ScrollArea className="h-[380px] pr-4">
              {CHRIST_TRACERS.map((tracer) => {
                const Icon = tracer.icon;
                return (
                  <Card key={tracer.id} className="mb-3 bg-background/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">{tracer.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <p className="text-sm text-muted-foreground">{tracer.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tracer.examples.map((ex, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {ex}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </ScrollArea>
          </TabsContent>

          {/* Feast Patterns */}
          <TabsContent value="feasts" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Each feast has Christ, Personal, and Church level fulfillment:
            </p>
            <ScrollArea className="h-[380px] pr-4">
              {FEAST_PATTERNS.map((feast) => (
                <Card key={feast.feast} className="mb-3 bg-background/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{feast.feast}</CardTitle>
                      <Badge variant="outline">{feast.meaning}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-primary/5 p-2 rounded">
                        <p className="font-medium text-primary mb-1">Christ Level</p>
                        <p className="text-muted-foreground">{feast.christLevel}</p>
                      </div>
                      <div className="bg-secondary/30 p-2 rounded">
                        <p className="font-medium mb-1">Personal Level</p>
                        <p className="text-muted-foreground">{feast.personalLevel}</p>
                      </div>
                      <div className="bg-accent/30 p-2 rounded">
                        <p className="font-medium mb-1">Church Level</p>
                        <p className="text-muted-foreground">{feast.churchLevel}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">NT Parallel:</span> {feast.ntBook}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* Book Patterns */}
          <TabsContent value="books" className="space-y-3">
            <div className="flex flex-wrap gap-1 mb-3">
              {BOOK_PATTERNS.slice(0, 15).map((book) => (
                <Button
                  key={book.book}
                  variant={selectedBook === book.book ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setSelectedBook(selectedBook === book.book ? null : book.book)}
                >
                  {book.book}
                </Button>
              ))}
            </div>
            
            <ScrollArea className="h-[340px] pr-4">
              {bookPattern ? (
                <div className="space-y-4">
                  <Card className="bg-background/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{bookPattern.book} Pattern</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Book Structure
                        </h4>
                        <div className="space-y-1">
                          {bookPattern.sections.map((sec, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-muted/30 p-2 rounded">
                              {sec.chapters && (
                                <Badge variant="outline" className="shrink-0">{sec.chapters}</Badge>
                              )}
                              <span>{sec.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2 text-primary">
                          <Sparkles className="h-4 w-4" />
                          Christ Parallel
                        </h4>
                        <div className="space-y-1">
                          {bookPattern.christParallel.map((par, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-primary/5 p-2 rounded">
                              {par.chapters && (
                                <Badge className="shrink-0 bg-primary/20 text-primary">{par.chapters}</Badge>
                              )}
                              <span>{par.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {bookPattern.thirdDimension && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">3D: Personal Application</h4>
                          <div className="space-y-1">
                            {bookPattern.thirdDimension.map((app, i) => (
                              <div key={i} className="text-xs bg-secondary/20 p-2 rounded">
                                {app.description}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select a book above to see its Christ pattern</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
