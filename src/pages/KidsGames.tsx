import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

const KidsGames = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const youngKidsGames = [
    { id: "palace_explorer", name: "Palace Explorer", description: "Discover the rooms of the Palace" },
    { id: "verse_memory", name: "Verse Memory Match", description: "Match Bible verses" },
    { id: "color_prophet", name: "Color the Prophets", description: "Learn about biblical characters" },
    { id: "palace_builder", name: "Palace Builder", description: "Build your own memory palace" },
    { id: "story_time", name: "Story Time", description: "Interactive Bible stories" },
  ];

  const middleKidsGames = [
    { id: "principle_detective", name: "Principle Detective", description: "Find hidden principles in verses" },
    { id: "palace_race", name: "Palace Race", description: "Race through the floors" },
    { id: "jeeves_helper", name: "Jeeves' Helper", description: "Assist Jeeves in studies" },
    { id: "verse_builder", name: "Verse Builder", description: "Complete Bible verses" },
    { id: "timeline_adventure", name: "Timeline Adventure", description: "Place events in order" },
  ];

  const olderKidsGames = [
    { id: "chain_junior", name: "Chain Chess Junior", description: "Build biblical connections" },
    { id: "palace_master", name: "Palace Master", description: "Master all Palace principles" },
    { id: "prophecy_puzzle", name: "Prophecy Puzzle", description: "Connect prophetic verses" },
    { id: "principle_challenge", name: "Principle Challenge", description: "Advanced principle matching" },
    { id: "study_creator", name: "Study Creator", description: "Create your own studies" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              Kids Games
            </h1>
          </div>

          <Tabs defaultValue="6-9" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="6-9">Ages 6-9</TabsTrigger>
              <TabsTrigger value="10-12">Ages 10-12</TabsTrigger>
              <TabsTrigger value="13-15">Ages 13-15</TabsTrigger>
            </TabsList>

            <TabsContent value="6-9" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youngKidsGames.map((game) => (
                  <Card key={game.id}>
                    <CardHeader>
                      <CardTitle>{game.name}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="10-12" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {middleKidsGames.map((game) => (
                  <Card key={game.id}>
                    <CardHeader>
                      <CardTitle>{game.name}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="13-15" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {olderKidsGames.map((game) => (
                  <Card key={game.id}>
                    <CardHeader>
                      <CardTitle>{game.name}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full">
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default KidsGames;
