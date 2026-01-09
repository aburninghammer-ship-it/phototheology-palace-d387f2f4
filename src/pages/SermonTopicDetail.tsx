import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Eye,
  Shapes,
  Church,
  BookMarked,
  Telescope,
  Cross,
  Users,
  Heart,
  Loader2,
  GraduationCap,
  Trophy,
  Crown,
  Wand2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SermonTopic {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  tags: string[];
  anchor_scriptures: string[];
  category: string | null;
}

interface StarterFloors {
  floor1?: {
    roomUsed: string;
    keyWords: string[];
    observationQuestions: string[];
    historicalNotes?: string;
  };
  floor2?: {
    roomUsed: string;
    symbols: Array<{
      symbol: string;
      definition: string;
      crossRefs: string[];
    }>;
  };
  floor3?: {
    roomUsed: string;
    connection?: string;
    article?: string;
    explanation?: string;
  };
  floor4?: {
    roomUsed: string;
    stories: Array<{
      reference: string;
      parallels: string;
      contrasts: string;
      caution?: string;
    }>;
  };
  floor5?: {
    roomsUsed: string[];
    propheticConnections: Array<{
      type: string;
      description: string;
    }>;
  };
  floor6?: {
    roomUsed: string;
    guidedQuestions: string[];
    christPresence?: string;
    ntReferences?: string[];
  };
  floor7?: {
    roomUsed: string;
    applicationAngles: Array<{
      area: string;
      question: string;
    }>;
  };
  floor8?: {
    roomUsed: string;
    responseMovements: string[];
    songThemes?: string[];
    prayerFocus?: string;
    callToAction?: string;
  };
}

interface SermonStarter {
  id: string;
  topic_id: string;
  starter_title: string;
  level: "Beginner" | "Intermediate" | "Master";
  floors: StarterFloors;
  room_refs: string[];
  quality_status: string;
}

const FLOOR_CONFIG = [
  { num: 1, name: "Observation Floor", icon: Eye, color: "from-violet-500 to-purple-600", key: "floor1" },
  { num: 2, name: "Symbol Floor", icon: Shapes, color: "from-blue-500 to-indigo-600", key: "floor2" },
  { num: 3, name: "Sanctuary Floor", icon: Church, color: "from-amber-500 to-orange-600", key: "floor3" },
  { num: 4, name: "Story Floor", icon: BookMarked, color: "from-emerald-500 to-teal-600", key: "floor4" },
  { num: 5, name: "Prophecy Floor", icon: Telescope, color: "from-rose-500 to-red-600", key: "floor5" },
  { num: 6, name: "Christ-Centered Floor", icon: Cross, color: "from-yellow-500 to-amber-600", key: "floor6" },
  { num: 7, name: "Application Floor", icon: Users, color: "from-cyan-500 to-blue-600", key: "floor7" },
  { num: 8, name: "Worship Floor", icon: Heart, color: "from-pink-500 to-rose-600", key: "floor8" },
];

const LEVEL_CONFIG = {
  Beginner: { icon: GraduationCap, color: "from-emerald-500 to-teal-600", label: "Beginner" },
  Intermediate: { icon: Trophy, color: "from-amber-500 to-orange-600", label: "Intermediate" },
  Master: { icon: Crown, color: "from-violet-500 to-purple-600", label: "Master" },
};

export default function SermonTopicDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [topic, setTopic] = useState<SermonTopic | null>(null);
  const [starters, setStarters] = useState<SermonStarter[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [expandedStarter, setExpandedStarter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      setLoading(true);

      // Fetch topic
      const { data: topicData, error: topicError } = await supabase
        .from("sermon_topics")
        .select("*")
        .eq("slug", slug)
        .single();

      if (topicError) {
        console.error("Error fetching topic:", topicError);
        setLoading(false);
        return;
      }

      setTopic(topicData as SermonTopic);

      // Fetch starters for this topic
      const { data: startersData, error: startersError } = await supabase
        .from("sermon_starters")
        .select("*")
        .eq("topic_id", topicData.id)
        .eq("quality_status", "published")
        .order("level");

      if (startersError) {
        console.error("Error fetching starters:", startersError);
      } else {
        setStarters((startersData as SermonStarter[]) || []);
        if (startersData && startersData.length > 0) {
          setExpandedStarter(startersData[0].id);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  const handleGenerateStarter = async (level: string) => {
    if (!topic) return;
    setGenerating(true);
    setSelectedLevel(level);

    try {
      const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
        body: {
          topic: topic.title,
          topicId: topic.id,
          level,
          anchorScriptures: topic.anchor_scriptures,
        },
      });

      if (error) throw error;

      toast.success("Sermon starter generated!");

      // Refresh starters
      const { data: newStarters } = await supabase
        .from("sermon_starters")
        .select("*")
        .eq("topic_id", topic.id)
        .order("level");

      if (newStarters) {
        setStarters(newStarters as SermonStarter[]);
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate starter. Please try again.");
    } finally {
      setGenerating(false);
      setSelectedLevel(null);
    }
  };

  const renderFloorContent = (starter: SermonStarter, floorKey: string, floorNum: number) => {
    const floors = starter.floors as StarterFloors;
    const floor = floors[floorKey as keyof StarterFloors];
    if (!floor) return <p className="text-muted-foreground italic">Content not available for this floor.</p>;

    switch (floorNum) {
      case 1:
        const f1 = floor as StarterFloors["floor1"];
        return (
          <div className="space-y-4">
            {f1?.roomUsed && (
              <Badge variant="outline">{f1.roomUsed}</Badge>
            )}
            {f1?.keyWords && f1.keyWords.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Words to Circle:</h4>
                <div className="flex flex-wrap gap-2">
                  {f1.keyWords.map((word, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary">{word}</Badge>
                  ))}
                </div>
              </div>
            )}
            {f1?.observationQuestions && f1.observationQuestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Observation Questions:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {f1.observationQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {f1?.historicalNotes && (
              <div>
                <h4 className="font-medium mb-2">Historical Notes:</h4>
                <p className="text-muted-foreground">{f1.historicalNotes}</p>
              </div>
            )}
          </div>
        );

      case 2:
        const f2 = floor as StarterFloors["floor2"];
        return (
          <div className="space-y-4">
            {f2?.roomUsed && <Badge variant="outline">{f2.roomUsed}</Badge>}
            {f2?.symbols && f2.symbols.length > 0 ? (
              <div className="space-y-3">
                {f2.symbols.map((sym, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">{sym.symbol}</h4>
                    <p className="text-sm text-muted-foreground">{sym.definition}</p>
                    {sym.crossRefs.length > 0 && (
                      <p className="text-xs text-primary mt-1">
                        Cross-refs: {sym.crossRefs.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No dominant symbols present in this passage.</p>
            )}
          </div>
        );

      case 3:
        const f3 = floor as StarterFloors["floor3"];
        return (
          <div className="space-y-4">
            {f3?.roomUsed && <Badge variant="outline">{f3.roomUsed}</Badge>}
            {f3?.article && (
              <div>
                <h4 className="font-medium mb-2">Sanctuary Article:</h4>
                <p className="text-muted-foreground">{f3.article}</p>
              </div>
            )}
            {f3?.connection && (
              <div>
                <h4 className="font-medium mb-2">Connection:</h4>
                <p className="text-muted-foreground">{f3.connection}</p>
              </div>
            )}
            {f3?.explanation && (
              <div>
                <h4 className="font-medium mb-2">Explanation:</h4>
                <p className="text-muted-foreground">{f3.explanation}</p>
              </div>
            )}
            {!f3?.article && !f3?.connection && (
              <p className="text-muted-foreground italic">No direct sanctuary connection identified.</p>
            )}
          </div>
        );

      case 4:
        const f4 = floor as StarterFloors["floor4"];
        return (
          <div className="space-y-4">
            {f4?.roomUsed && <Badge variant="outline">{f4.roomUsed}</Badge>}
            {f4?.stories && f4.stories.length > 0 && (
              <div className="space-y-3">
                {f4.stories.map((story, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <h4 className="font-medium">{story.reference}</h4>
                    <p className="text-sm text-muted-foreground"><strong>Parallels:</strong> {story.parallels}</p>
                    <p className="text-sm text-muted-foreground"><strong>Contrasts:</strong> {story.contrasts}</p>
                    {story.caution && (
                      <p className="text-xs text-amber-600 mt-1">Caution: {story.caution}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        const f5 = floor as StarterFloors["floor5"];
        return (
          <div className="space-y-4">
            {f5?.roomsUsed && f5.roomsUsed.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {f5.roomsUsed.map((room, i) => (
                  <Badge key={i} variant="outline">{room}</Badge>
                ))}
              </div>
            )}
            {f5?.propheticConnections && f5.propheticConnections.length > 0 ? (
              <div className="space-y-3">
                {f5.propheticConnections.map((conn, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <Badge className="mb-2" variant={
                      conn.type === "Confirmed Fulfillment" ? "default" :
                      conn.type === "Typological Echo" ? "secondary" : "outline"
                    }>
                      {conn.type}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{conn.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No direct prophetic connections identified.</p>
            )}
          </div>
        );

      case 6:
        const f6 = floor as StarterFloors["floor6"];
        return (
          <div className="space-y-4">
            {f6?.roomUsed && <Badge variant="outline">{f6.roomUsed}</Badge>}
            {f6?.guidedQuestions && f6.guidedQuestions.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Guided Questions:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {f6.guidedQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}
            {f6?.christPresence && (
              <div>
                <h4 className="font-medium mb-2">Christ's Presence:</h4>
                <p className="text-muted-foreground">{f6.christPresence}</p>
              </div>
            )}
            {f6?.ntReferences && f6.ntReferences.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">NT References:</h4>
                <div className="flex flex-wrap gap-2">
                  {f6.ntReferences.map((ref, i) => (
                    <Badge key={i} variant="secondary">{ref}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        const f7 = floor as StarterFloors["floor7"];
        return (
          <div className="space-y-4">
            {f7?.roomUsed && <Badge variant="outline">{f7.roomUsed}</Badge>}
            {f7?.applicationAngles && f7.applicationAngles.length > 0 && (
              <div className="space-y-3">
                {f7.applicationAngles.map((angle, i) => (
                  <div key={i} className="p-3 bg-muted/50 rounded-lg">
                    <Badge className="mb-2" variant={
                      angle.area === "Personal" ? "default" :
                      angle.area === "Community" ? "secondary" : "outline"
                    }>
                      {angle.area}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{angle.question}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 8:
        const f8 = floor as StarterFloors["floor8"];
        return (
          <div className="space-y-4">
            {f8?.roomUsed && <Badge variant="outline">{f8.roomUsed}</Badge>}
            {f8?.responseMovements && f8.responseMovements.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Response Movements:</h4>
                <div className="flex flex-wrap gap-2">
                  {f8.responseMovements.map((resp, i) => (
                    <Badge key={i} className="bg-rose-100 text-rose-700">{resp}</Badge>
                  ))}
                </div>
              </div>
            )}
            {f8?.songThemes && f8.songThemes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Song Themes:</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {f8.songThemes.map((theme, i) => (
                    <li key={i}>{theme}</li>
                  ))}
                </ul>
              </div>
            )}
            {f8?.prayerFocus && (
              <div>
                <h4 className="font-medium mb-2">Prayer Focus:</h4>
                <p className="text-muted-foreground">{f8.prayerFocus}</p>
              </div>
            )}
            {f8?.callToAction && (
              <div>
                <h4 className="font-medium mb-2">Call to Action:</h4>
                <p className="text-muted-foreground">{f8.callToAction}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-96 mb-4" />
        <Skeleton className="h-24 w-full mb-8" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The sermon topic you're looking for doesn't exist.
        </p>
        <Link to="/sermon-topics">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/sermon-topics"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Link>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              {topic.category && (
                <Badge variant="outline" className="text-sm">
                  {topic.category}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Sermons on {topic.title}
            </h1>
            {topic.summary && (
              <p className="text-lg text-muted-foreground mb-6">{topic.summary}</p>
            )}

            {/* Tags */}
            {topic.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Anchor Scriptures */}
            {topic.anchor_scriptures.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {topic.anchor_scriptures.join(" | ")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Starter Level Cards */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            PhotoTheology Sermon Starters
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {(["Beginner", "Intermediate", "Master"] as const).map((level) => {
              const config = LEVEL_CONFIG[level];
              const Icon = config.icon;
              const starter = starters.find((s) => s.level === level);

              return (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card
                    className={`h-full cursor-pointer transition-all ${
                      expandedStarter === starter?.id
                        ? "border-primary shadow-lg"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => starter && setExpandedStarter(starter.id)}
                  >
                    <CardHeader>
                      <div
                        className={`w-14 h-14 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center mb-3`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle>{level}</CardTitle>
                      <CardDescription>
                        {level === "Beginner"
                          ? "More guiding questions, step-by-step structure"
                          : level === "Intermediate"
                          ? "Balanced guidance with room for exploration"
                          : "Dense prompts for PT-fluent pastors"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {starter ? (
                        <div>
                          <p className="text-sm font-medium mb-2">{starter.starter_title}</p>
                          <Badge variant="outline" className="text-xs">
                            {starter.room_refs.length} rooms referenced
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGenerateStarter(level);
                          }}
                          disabled={generating}
                        >
                          {generating && selectedLevel === level ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Generate Starter
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Expanded Starter Content */}
        {expandedStarter && (
          <section>
            {starters
              .filter((s) => s.id === expandedStarter)
              .map((starter) => (
                <motion.div
                  key={starter.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Card className="mb-8">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className={`bg-gradient-to-r ${LEVEL_CONFIG[starter.level].color} text-white mb-2`}>
                            {starter.level} Level
                          </Badge>
                          <CardTitle className="text-2xl">{starter.starter_title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {FLOOR_CONFIG.map((floor) => {
                          const Icon = floor.icon;
                          return (
                            <AccordionItem key={floor.num} value={`floor-${floor.num}`}>
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${floor.color} flex items-center justify-center`}
                                  >
                                    <Icon className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="text-left">
                                    <span className="font-semibold">Floor {floor.num}</span>
                                    <span className="text-muted-foreground ml-2">
                                      {floor.name}
                                    </span>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-14">
                                {renderFloorContent(starter, floor.key, floor.num)}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </section>
        )}

        {starters.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Starters Yet</h3>
              <p className="text-muted-foreground mb-6">
                Be the first to generate a PhotoTheology sermon starter for this topic.
              </p>
              <Button onClick={() => handleGenerateStarter("Beginner")} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Beginner Starter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
