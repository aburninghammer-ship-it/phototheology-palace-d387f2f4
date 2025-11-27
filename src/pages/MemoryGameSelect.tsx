import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Puzzle, Type, Shuffle } from "lucide-react";

export default function MemoryGameSelect() {
  const navigate = useNavigate();

  const games = [
    {
      id: "word-order",
      title: "Word Order Challenge",
      description: "Rearrange scrambled words to rebuild the verse correctly",
      icon: Shuffle,
      difficulty: "Medium",
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: "fill-blank",
      title: "Fill in the Blanks",
      description: "Complete missing words in verses from memory",
      icon: Type,
      difficulty: "Easy",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "first-letter",
      title: "First Letter Hints",
      description: "Recall verses using only first-letter hints",
      icon: Puzzle,
      difficulty: "Hard",
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/memory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Memory
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Memory Games</h1>
            <p className="text-muted-foreground">
              Practice your memory verses through interactive games
            </p>
          </div>

          <div className="grid gap-4">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/memory/game/${game.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color}`}>
                      <game.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted">
                      {game.difficulty}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}