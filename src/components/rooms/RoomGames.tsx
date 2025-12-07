import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Swords, Trophy, Sparkles, Play } from "lucide-react";

interface RoomGame {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  badge?: string;
}

// Map room IDs to their specific games
const roomGamesMap: Record<string, RoomGame[]> = {
  // Floor 1 - Furnishing Floor
  sr: [
    { id: "story-room", name: "Story Sequence", description: "Put Bible stories in correct order", path: "/games/story-room", icon: "📖", difficulty: "easy", xpReward: 25 },
    { id: "story-sprint", name: "Story Sprint", description: "Speed-identify Bible narratives", path: "/games/principle-sprint", icon: "⚡", difficulty: "medium", xpReward: 35 },
  ],
  ir: [
    { id: "frame-snapshot", name: "Frame Snapshot", description: "Visualize and describe scenes", path: "/games/frame-snapshot", icon: "👁️", difficulty: "medium", xpReward: 30 },
    { id: "memory-palace", name: "Memory Palace Builder", description: "Build mental palaces from Scripture", path: "/games/memory-palace-builder", icon: "🏰", difficulty: "hard", xpReward: 50 },
  ],
  "24fps": [
    { id: "frame-snapshot", name: "24FPS Challenge", description: "Create chapter image associations", path: "/games/frame-snapshot", icon: "🎬", difficulty: "medium", xpReward: 35 },
    { id: "genesis-highrise", name: "Genesis HighRise", description: "Build the Genesis tower", path: "/genesis-highrise", icon: "🏗️", difficulty: "easy", xpReward: 25 },
  ],
  br: [
    { id: "first-letter", name: "First Letter Game", description: "Recall verses by first letters", path: "/games/first-letter", icon: "🔤", difficulty: "medium", xpReward: 30 },
    { id: "memory-practice", name: "Memory Palace Practice", description: "Navigate your mental palace", path: "/games/memory-palace-practice", icon: "🗺️", difficulty: "medium", xpReward: 35 },
  ],
  tr: [
    { id: "verse-match", name: "Verse Match", description: "Match verses to visual translations", path: "/verse-match", icon: "🎨", difficulty: "easy", xpReward: 20 },
    { id: "concentration", name: "Concentration Game", description: "Memory matching with verses", path: "/concentration-game", icon: "🧠", difficulty: "easy", xpReward: 25 },
  ],
  gr: [
    { id: "treasure-hunt", name: "Treasure Hunt", description: "Find hidden gems in Scripture", path: "/treasure-hunt", icon: "💎", difficulty: "medium", xpReward: 40 },
    { id: "chef-challenge", name: "Chef Challenge", description: "Cook up theological connections", path: "/chef-challenge", icon: "👨‍🍳", difficulty: "hard", xpReward: 50 },
  ],
  
  // Floor 2 - Investigation Floor
  or: [
    { id: "observation-game", name: "Observation Detective", description: "Find details others miss", path: "/games/observation-room", icon: "🔍", difficulty: "medium", xpReward: 35 },
    { id: "witness-trial", name: "Witness Trial", description: "Cross-examine Scripture passages", path: "/games/witness-trial", icon: "⚖️", difficulty: "hard", xpReward: 45 },
  ],
  dc: [
    { id: "equation-builder", name: "Equation Builder", description: "Build theological equations", path: "/games/equation-builder", icon: "🧮", difficulty: "hard", xpReward: 50 },
    { id: "equations-challenge", name: "Equations Challenge", description: "Solve symbolic Bible puzzles", path: "/equations-challenge", icon: "🔢", difficulty: "hard", xpReward: 45 },
  ],
  st: [
    { id: "connection-dash", name: "Connection Dash", description: "Link symbols to meanings", path: "/games/connection-dash", icon: "🔗", difficulty: "medium", xpReward: 35 },
    { id: "chain-chess", name: "Chain Chess", description: "Build symbolic verse chains", path: "/games/chain-chess/new", icon: "♟️", difficulty: "hard", xpReward: 50 },
  ],
  qr: [
    { id: "principle-sprint", name: "Question Blitz", description: "Generate questions rapidly", path: "/games/principle-sprint", icon: "❓", difficulty: "medium", xpReward: 30 },
    { id: "escape-room", name: "Escape Room", description: "Solve puzzles to escape", path: "/escape-room", icon: "🚪", difficulty: "hard", xpReward: 60 },
  ],
  qa: [
    { id: "chain-chess", name: "Q&A Chains", description: "Build question-answer chains", path: "/games/chain-chess/new", icon: "💬", difficulty: "medium", xpReward: 40 },
    { id: "branch-study", name: "Branch Study", description: "Explore branching connections", path: "/branch-study", icon: "🌳", difficulty: "medium", xpReward: 35 },
  ],
  
  // Floor 3 - Freestyle Floor
  nf: [
    { id: "connection-dash", name: "Nature Connections", description: "Find Scripture in nature", path: "/games/connection-dash", icon: "🌿", difficulty: "medium", xpReward: 35 },
  ],
  pf: [
    { id: "principle-sprint", name: "Personal Parable", description: "Create life-to-Scripture links", path: "/games/principle-sprint", icon: "🪞", difficulty: "medium", xpReward: 35 },
  ],
  bf: [
    { id: "chain-chess", name: "Verse Genetics", description: "Find verse family connections", path: "/games/chain-chess/new", icon: "🧬", difficulty: "hard", xpReward: 45 },
    { id: "connection-dash", name: "Bible Freestyle", description: "Speed-link verses", path: "/games/connection-dash", icon: "⚡", difficulty: "medium", xpReward: 35 },
  ],
  hf: [
    { id: "controversy-raid", name: "Controversy Raid", description: "Navigate cultural debates", path: "/games/controversy-raid", icon: "📜", difficulty: "hard", xpReward: 50 },
    { id: "culture-controversy", name: "Culture Analysis", description: "Analyze with Scripture lens", path: "/culture-controversy", icon: "🌍", difficulty: "medium", xpReward: 40 },
  ],
  lr: [
    { id: "principle-sprint", name: "Listen & Link", description: "Connect what you hear", path: "/games/principle-sprint", icon: "👂", difficulty: "medium", xpReward: 30 },
  ],
  
  // Floor 4 - Next Level Floor
  cr: [
    { id: "concentration-room", name: "Concentration Room", description: "Christ-centered focus", path: "/games/concentration-room", icon: "✝️", difficulty: "medium", xpReward: 40 },
    { id: "christ-lock", name: "Christ Lock", description: "Unlock Christ in every text", path: "/games/christ-lock", icon: "🔓", difficulty: "hard", xpReward: 50, badge: "Popular" },
  ],
  dr: [
    { id: "dimensions-room", name: "Dimensions Room", description: "See all 5 dimensions", path: "/games/dimensions-room", icon: "💠", difficulty: "hard", xpReward: 50 },
  ],
  c6: [
    { id: "connect-6", name: "Connect 6 Draft", description: "Match genres to texts", path: "/games/connect-6-draft", icon: "📚", difficulty: "medium", xpReward: 35 },
  ],
  trm: [
    { id: "sanctuary-run", name: "Theme Wall Run", description: "Navigate the theme walls", path: "/games/sanctuary-run", icon: "🏛️", difficulty: "medium", xpReward: 40 },
  ],
  tz: [
    { id: "time-zone", name: "Time Zone Invasion", description: "Defend the timeline", path: "/games/time-zone-invasion", icon: "⏰", difficulty: "hard", xpReward: 50, badge: "New" },
  ],
  prm: [
    { id: "pattern-match", name: "Pattern Match", description: "Find recurring patterns", path: "/games/connection-dash", icon: "🎵", difficulty: "medium", xpReward: 35 },
  ],
  "p||": [
    { id: "parallels", name: "Parallel Vision", description: "Match mirrored events", path: "/games/connection-dash", icon: "🪞", difficulty: "hard", xpReward: 45 },
  ],
  frt: [
    { id: "fruit-test", name: "Fruit Inspector", description: "Test for spiritual fruit", path: "/games/principle-sprint", icon: "🍇", difficulty: "medium", xpReward: 30 },
  ],
  cec: [
    { id: "christ-lock", name: "Christ Every Chapter", description: "Find Christ in each chapter", path: "/games/christ-lock", icon: "👑", difficulty: "hard", xpReward: 50 },
  ],
  r66: [
    { id: "r66-trace", name: "66-Book Trace", description: "Trace themes through all 66", path: "/games/chain-chess/new", icon: "📿", difficulty: "hard", xpReward: 60 },
  ],
  
  // Floor 5 - Vision Floor
  bl: [
    { id: "blue-room", name: "Blue Room Challenge", description: "Navigate the sanctuary", path: "/games/blue-room", icon: "⛪", difficulty: "hard", xpReward: 50, badge: "Popular" },
    { id: "sanctuary-run", name: "Sanctuary Run", description: "Race through the temple", path: "/games/sanctuary-run", icon: "🏃", difficulty: "medium", xpReward: 40 },
  ],
  pr: [
    { id: "escape-dragon", name: "Escape the Dragon", description: "Navigate prophecy puzzles", path: "/games/escape-the-dragon", icon: "🐉", difficulty: "hard", xpReward: 55, badge: "Popular" },
    { id: "prophecy-watch", name: "Prophecy Watch", description: "Track prophetic timelines", path: "/prophecy-watch", icon: "🔮", difficulty: "hard", xpReward: 50 },
  ],
  "3a": [
    { id: "three-angels", name: "Three Angels Sprint", description: "Master the messages", path: "/games/principle-sprint", icon: "👼", difficulty: "hard", xpReward: 45 },
  ],
  fe: [
    { id: "feasts-game", name: "Feast Calendar", description: "Match feasts to meanings", path: "/games/connection-dash", icon: "🎊", difficulty: "medium", xpReward: 35 },
  ],
  
  // Floor 6 - Three Heavens Floor
  "123h": [
    { id: "three-heavens", name: "Heaven Sorter", description: "Place events in correct heaven", path: "/games/time-zone-invasion", icon: "☁️", difficulty: "hard", xpReward: 50 },
  ],
  cycles: [
    { id: "cycle-race", name: "Cycle Race", description: "Navigate the 8 cycles", path: "/games/chain-chess/new", icon: "🔄", difficulty: "hard", xpReward: 55 },
  ],
  jr: [
    { id: "juice-room", name: "Juice Extractor", description: "Squeeze meaning from books", path: "/games/principle-sprint", icon: "🍊", difficulty: "hard", xpReward: 50 },
  ],
  math: [
    { id: "equation-builder", name: "Math Room", description: "Build complex equations", path: "/games/equation-builder", icon: "🔢", difficulty: "hard", xpReward: 55 },
  ],
  
  // Floor 7 - Spiritual & Emotional Floor
  frm: [
    { id: "fire-room", name: "Fire Room Challenge", description: "Face the flames of conviction", path: "/games/principle-sprint", icon: "🔥", difficulty: "hard", xpReward: 45 },
  ],
  mr: [
    { id: "meditation-game", name: "Meditation Master", description: "Deep meditative practice", path: "/games/concentration-room", icon: "🙏", difficulty: "medium", xpReward: 35 },
  ],
  srm: [
    { id: "speed-room", name: "Speed Drill", description: "Rapid-fire applications", path: "/games/principle-sprint", icon: "⚡", difficulty: "hard", xpReward: 50 },
  ],
};

const difficultyColors = {
  easy: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
  medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  hard: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
};

interface RoomGamesProps {
  roomId: string;
  roomName: string;
}

export const RoomGames = ({ roomId, roomName }: RoomGamesProps) => {
  const games = roomGamesMap[roomId] || [];
  
  if (games.length === 0) return null;
  
  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-accent to-primary rounded-xl">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              🎮 Room Games
              <Badge variant="secondary" className="text-xs">
                {games.length} {games.length === 1 ? "game" : "games"}
              </Badge>
            </CardTitle>
            <CardDescription>
              Practice {roomName} principles through interactive challenges
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {games.map((game) => (
            <Link key={game.id} to={game.path}>
              <div className="group p-4 rounded-xl border bg-card hover:bg-accent/10 hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{game.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold group-hover:text-accent transition-colors">
                        {game.name}
                      </h4>
                      {game.badge && (
                        <Badge variant="default" className="text-xs bg-primary">
                          {game.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {game.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={difficultyColors[game.difficulty]}>
                      {game.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      +{game.xpReward} XP
                    </span>
                  </div>
                  <Play className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link to="/games">
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="h-4 w-4" />
              View All Games
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
