import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Gamepad2, Users } from "lucide-react";

const Games = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const adultGames = [
    { id: "chain_chess", name: "Chain Chess", description: "Build biblical chains with Jeeves", featured: true },
    { id: "palace_quiz", name: "Palace Quiz", description: "Test your knowledge of the Palace principles" },
    { id: "verse_match", name: "Verse Match", description: "Match verses to their books and chapters" },
    { id: "principle_puzzle", name: "Principle Puzzle", description: "Connect verses to Palace principles" },
    { id: "timeline_challenge", name: "Timeline Challenge", description: "Order biblical events correctly" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Gamepad2 className="h-8 w-8" />
              Palace Games
            </h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adultGames.map((game) => (
              <Card key={game.id} className={game.featured ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {game.featured && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {game.name}
                  </CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/games/${game.id}`)}
                      className="w-full"
                      variant={game.featured ? "default" : "outline"}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Play vs Player
                    </Button>
                    <Button
                      onClick={() => navigate(`/games/${game.id}/jeeves`)}
                      className="w-full"
                      variant="outline"
                    >
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      Play vs Jeeves
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;
