import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronRight, Library, Sparkles, Cloud, AlertTriangle, CheckCircle } from "lucide-react";
import { 
  threeHeavensExplanations,
  propheticPassages,
  type PropheticPassage,
  type HeavenLevel
} from "@/data/threeHeavensLibrary";

interface ThreeHeavensLibraryProps {
  onClose?: () => void;
}

const HEAVEN_CONFIG: Record<HeavenLevel, { icon: string; color: string; bg: string; name: string }> = {
  "1H": { 
    icon: "🌍", 
    color: "text-blue-700 dark:text-blue-400", 
    bg: "bg-blue-500/10 border-blue-500/30",
    name: "First Heaven" 
  },
  "2H": { 
    icon: "⛪", 
    color: "text-purple-700 dark:text-purple-400", 
    bg: "bg-purple-500/10 border-purple-500/30",
    name: "Second Heaven" 
  },
  "3H": { 
    icon: "👑", 
    color: "text-amber-700 dark:text-amber-400", 
    bg: "bg-amber-500/10 border-amber-500/30",
    name: "Third Heaven" 
  }
};

type LibraryTab = "overview" | "horizons" | "passages" | "patterns" | "rules";

export function ThreeHeavensLibrary({ onClose }: ThreeHeavensLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("overview");
  const [selectedHorizon, setSelectedHorizon] = useState<HeavenLevel | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<PropheticPassage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PropheticPassage[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const lowerQuery = query.toLowerCase();
      const results = propheticPassages.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.reference.toLowerCase().includes(lowerQuery) ||
        p.text.toLowerCase().includes(lowerQuery) ||
        p.primaryContext.toLowerCase().includes(lowerQuery) ||
        p.fulfillments.some(f => 
          f.event.toLowerCase().includes(lowerQuery) ||
          f.description.toLowerCase().includes(lowerQuery)
        )
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Render passage detail view
  if (selectedPassage) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedPassage(null)}>
              ← Back to Library
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <CardTitle className="mt-2">{selectedPassage.title}</CardTitle>
          <CardDescription>{selectedPassage.reference}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Primary Text */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="italic text-sm">&ldquo;{selectedPassage.text}&rdquo;</p>
              </div>

              {/* Category & Context */}
              <div>
                <Badge variant="secondary" className="mb-2">{selectedPassage.category}</Badge>
                <p className="text-sm">{selectedPassage.primaryContext}</p>
              </div>

              {/* Three Heaven Fulfillments */}
              <div>
                <h4 className="font-semibold mb-3">Fulfillments Across the Three Heavens</h4>
                <div className="space-y-4">
                  {selectedPassage.fulfillments.map((f, i) => {
                    const config = HEAVEN_CONFIG[f.heaven];
                    return (
                      <div key={i} className={`p-4 rounded-lg border ${config.bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{config.icon}</span>
                          <span className={`font-bold ${config.color}`}>{config.name} ({f.heaven})</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div><strong>Event:</strong> {f.event}</div>
                          <div><strong>Date:</strong> {f.date}</div>
                          <div><strong>Description:</strong> {f.description}</div>
                          <div><strong>Historical Connection:</strong> {f.historicalConnection}</div>
                          <div><strong>Spiritual Significance:</strong> {f.spiritualSignificance}</div>
                          {f.textualMarkers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {f.textualMarkers.map((m, j) => (
                                <Badge key={j} variant="outline" className="text-xs">{m}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interpretive Notes */}
              {selectedPassage.interpretiveNotes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Interpretive Notes</h4>
                  <ul className="space-y-1">
                    {selectedPassage.interpretiveNotes.map((note, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Sparkles className="h-3 w-3 mt-1 text-primary shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Render horizon detail view
  if (selectedHorizon) {
    const explanation = threeHeavensExplanations.find(e => e.level === selectedHorizon);
    const config = HEAVEN_CONFIG[selectedHorizon];
    const horizonPassages = propheticPassages.filter(p => 
      p.fulfillments.some(f => f.heaven === selectedHorizon)
    );

    if (!explanation) return null;

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedHorizon(null)}>
              ← Back to Overview
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <CardTitle className={config.color}>{explanation.fullName}</CardTitle>
              <CardDescription>{explanation.timeframe}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Description */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{explanation.description}</p>
              </div>

              {/* Characteristics */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Characteristics
                </h4>
                <ul className="space-y-1">
                  {explanation.characteristics.map((c, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Markers */}
              <div>
                <h4 className="font-semibold mb-2">Key Markers to Identify</h4>
                <div className="flex flex-wrap gap-2">
                  {explanation.keyMarkers.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </div>

              {/* Audience Clues */}
              <div>
                <h4 className="font-semibold mb-2">Audience Clues</h4>
                <ul className="space-y-1">
                  {explanation.audienceClues.map((c, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">→</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" /> Common Mistakes
                </h4>
                <ul className="space-y-1">
                  {explanation.commonMistakes.map((m, i) => (
                    <li key={i} className="text-sm">• {m}</li>
                  ))}
                </ul>
              </div>

              {/* Example Passages */}
              <div>
                <h4 className="font-semibold mb-3">Example Passages ({horizonPassages.length})</h4>
                <div className="space-y-2">
                  {horizonPassages.slice(0, 5).map(p => (
                    <div
                      key={p.id}
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setSelectedPassage(p)}
                    >
                      <div className="font-medium">{p.reference}</div>
                      <div className="text-sm text-muted-foreground">{p.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Main Library View
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-purple-500" />
              Three Heavens Library
            </CardTitle>
            <CardDescription>
              Prophetic horizons: 1H, 2H, and 3H fulfillments
            </CardDescription>
          </div>
          {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prophecies, passages..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {searchResults.map(passage => (
                <div
                  key={passage.id}
                  className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setSelectedPassage(passage)}
                >
                  <div className="font-medium">{passage.reference}</div>
                  <div className="text-sm text-muted-foreground">{passage.title}</div>
                  <div className="flex gap-1 mt-1">
                    {passage.fulfillments.map((f, i) => {
                      const config = HEAVEN_CONFIG[f.heaven];
                      return (
                        <Badge key={i} className={config.bg} variant="outline">{f.heaven}</Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No passages found for &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Main Content */}
        {searchQuery.length < 2 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
            <TabsList className="grid grid-cols-4 w-full mb-2">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="horizons" className="text-xs">3 Horizons</TabsTrigger>
              <TabsTrigger value="passages" className="text-xs">Passages</TabsTrigger>
              <TabsTrigger value="rules" className="text-xs">Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Core Concept */}
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-purple-500" />
                      The Three Heavens Framework
                    </h4>
                    <p className="text-sm mb-3">
                      A prophecy must be <strong>ANCHORED</strong> in its PRIMARY horizon before any SECONDARY or TERTIARY application is allowed.
                    </p>
                    <div className="text-xs p-2 bg-amber-500/10 rounded border border-amber-500/20">
                      <strong>Core Rule:</strong> No anchoring → no expansion. No exceptions.
                    </div>
                  </div>

                  {/* The Three Horizons Quick View */}
                  <div className="space-y-3">
                    {threeHeavensExplanations.map(exp => {
                      const config = HEAVEN_CONFIG[exp.level];
                      return (
                        <div
                          key={exp.level}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.bg}`}
                          onClick={() => setSelectedHorizon(exp.level)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{config.icon}</span>
                              <div>
                                <div className={`font-bold ${config.color}`}>{exp.level} — {exp.name}</div>
                                <div className="text-xs opacity-75">{exp.fullName}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 opacity-50" />
                          </div>
                          <p className="text-sm mt-2 opacity-80">{exp.timeframe}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="horizons">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {threeHeavensExplanations.map(exp => {
                    const config = HEAVEN_CONFIG[exp.level];
                    return (
                      <div
                        key={exp.level}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.bg}`}
                        onClick={() => setSelectedHorizon(exp.level)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <div className={`font-bold ${config.color}`}>{exp.fullName}</div>
                            <div className="text-xs">{exp.timeframe}</div>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-3">{exp.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.keyMarkers.slice(0, 3).map((m, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                          ))}
                          {exp.keyMarkers.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{exp.keyMarkers.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="passages">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2">
                  {propheticPassages.map(passage => (
                    <div
                      key={passage.id}
                      className="p-3 bg-muted/50 rounded-lg border cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => setSelectedPassage(passage)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{passage.reference}</div>
                          <div className="text-sm text-muted-foreground">{passage.title}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex gap-1 mt-2">
                        {passage.fulfillments.map((f, i) => {
                          const config = HEAVEN_CONFIG[f.heaven];
                          return (
                            <Badge key={i} className={config.bg} variant="outline">{f.heaven}</Badge>
                          );
                        })}
                        <Badge variant="secondary">{passage.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="rules">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-red-600">Core Governing Law</h4>
                    <p className="text-sm">
                      A prophecy must be ANCHORED in its PRIMARY horizon before any SECONDARY or TERTIARY application is allowed.
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• No anchoring → no expansion</li>
                      <li>• No exceptions</li>
                      <li>• No &quot;both/and&quot; hand-waving</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-blue-600">1H — First Heaven Rule</h4>
                    <p className="text-sm">
                      If a passage speaks directly to Israel returning, rebuilding, replanting, or reconstituting, it belongs here first.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-purple-600">2H — Second Heaven Rule</h4>
                    <p className="text-sm">
                      If Jesus says &quot;this generation&quot; or the temple is in view → check 2H first.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-amber-600">3H — Third Heaven Rule</h4>
                    <p className="text-sm">
                      3H NEVER replaces 1H or 2H — it consummates what they prefigure.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Decision Questions</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Is the audience explicitly post-exilic Israel? → 1H</li>
                      <li>2. Is the temple standing or about to fall? → 2H</li>
                      <li>3. Is death abolished and God dwelling with humanity? → 3H</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">No skipping steps.</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
