import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Trophy, Sparkles, Play } from "lucide-react";

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

// Map room IDs to their specific games - each game links to a valid route
const roomGamesMap: Record<string, RoomGame[]> = {
  // Floor 1 - Furnishing Floor
  sr: [
    { id: "story-room", name: "Story Sequence", description: "Put Bible stories in correct order", path: "/games/story-room", icon: "📖", difficulty: "easy", xpReward: 25 },
    { id: "genesis-highrise", name: "Genesis HighRise", description: "Build the Genesis tower chapter by chapter", path: "/genesis-highrise", icon: "🏗️", difficulty: "medium", xpReward: 35 },
  ],
  ir: [
    { id: "frame-snapshot", name: "Frame Snapshot", description: "Visualize and describe biblical scenes", path: "/games/frame-snapshot", icon: "👁️", difficulty: "medium", xpReward: 30 },
    { id: "concentration-room", name: "Imagination Practice", description: "Deep immersion into Scripture scenes", path: "/games/concentration-room", icon: "🎭", difficulty: "medium", xpReward: 35 },
  ],
  "24fps": [
    { id: "frame-snapshot-24", name: "24FPS Challenge", description: "Create chapter image associations", path: "/games/frame-snapshot", icon: "🎬", difficulty: "medium", xpReward: 35 },
    { id: "genesis-highrise-24", name: "Genesis HighRise", description: "Build the Genesis tower", path: "/genesis-highrise", icon: "🏗️", difficulty: "easy", xpReward: 25 },
  ],
  br: [
    { id: "bible-rendered", name: "Bible Rendered", description: "Render Scripture into mental images", path: "/bible-rendered", icon: "🖼️", difficulty: "medium", xpReward: 30 },
    { id: "memory-games", name: "Memory Games", description: "Test your Scripture memory", path: "/memory/games", icon: "🧠", difficulty: "medium", xpReward: 35 },
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
    { id: "connection-dash", name: "Symbol Connections", description: "Link symbols to meanings", path: "/games/connection-dash", icon: "🔗", difficulty: "medium", xpReward: 35 },
    { id: "chain-chess", name: "Chain Chess", description: "Build symbolic verse chains", path: "/games/chain-chess/new", icon: "♟️", difficulty: "hard", xpReward: 50 },
  ],
  qr: [
    { id: "principle-sprint", name: "Question Blitz", description: "Generate questions rapidly", path: "/games/principle-sprint", icon: "❓", difficulty: "medium", xpReward: 30 },
    { id: "escape-room", name: "Escape Room", description: "Solve puzzles to escape", path: "/escape-room", icon: "🚪", difficulty: "hard", xpReward: 60 },
  ],
  qa: [
    { id: "branch-study", name: "Branch Study", description: "Build question-answer branches", path: "/branch-study", icon: "🌳", difficulty: "medium", xpReward: 40 },
    { id: "chain-chess-qa", name: "Q&A Chains", description: "Chain verses that answer each other", path: "/games/chain-chess/new", icon: "💬", difficulty: "medium", xpReward: 35 },
  ],
  
  // Floor 3 - Freestyle Floor
  nf: [
    { id: "connection-dash-nf", name: "Nature Connections", description: "Find Scripture in nature", path: "/games/connection-dash", icon: "🌿", difficulty: "medium", xpReward: 35 },
    { id: "controversy-raid-nf", name: "Nature Freestyle", description: "Link natural world to biblical truth", path: "/games/controversy-raid", icon: "🌳", difficulty: "medium", xpReward: 40 },
  ],
  pf: [
    { id: "principle-sprint-pf", name: "Personal Parable", description: "Create life-to-Scripture links", path: "/games/principle-sprint", icon: "🪞", difficulty: "medium", xpReward: 35 },
    { id: "story-room-pf", name: "My Story Game", description: "Turn your story into Scripture", path: "/games/story-room", icon: "📔", difficulty: "easy", xpReward: 30 },
  ],
  bf: [
    { id: "chain-chess-bf", name: "Verse Genetics", description: "Find verse family connections", path: "/games/chain-chess/new", icon: "🧬", difficulty: "hard", xpReward: 45 },
    { id: "connection-dash-bf", name: "Bible Freestyle", description: "Speed-link verses together", path: "/games/connection-dash", icon: "⚡", difficulty: "medium", xpReward: 35 },
  ],
  hf: [
    { id: "controversy-raid", name: "Controversy Raid", description: "Navigate cultural debates biblically", path: "/games/controversy-raid", icon: "📜", difficulty: "hard", xpReward: 50 },
    { id: "culture-controversy", name: "Culture Analysis", description: "Analyze culture with Scripture lens", path: "/culture-controversy", icon: "🌍", difficulty: "medium", xpReward: 40 },
  ],
  lr: [
    { id: "witness-trial-lr", name: "Listen & Respond", description: "Hear and connect what you learn", path: "/games/witness-trial", icon: "👂", difficulty: "medium", xpReward: 30 },
    { id: "observation-lr", name: "Active Listening", description: "Observe what others share", path: "/games/observation-room", icon: "🎧", difficulty: "easy", xpReward: 25 },
  ],
  
  // Floor 4 - Next Level Floor
  cr: [
    { id: "concentration-room-cr", name: "Concentration Room", description: "Christ-centered focus training", path: "/games/concentration-room", icon: "✝️", difficulty: "medium", xpReward: 40 },
    { id: "christ-lock", name: "Christ Lock", description: "Unlock Christ in every text", path: "/games/christ-lock", icon: "🔓", difficulty: "hard", xpReward: 50, badge: "Popular" },
  ],
  dr: [
    { id: "dimensions-room", name: "Dimensions Room", description: "See all 5 dimensions of Scripture", path: "/games/dimensions-room", icon: "💠", difficulty: "hard", xpReward: 50 },
    { id: "principle-sprint-dr", name: "Dimension Sprint", description: "Rapidly apply all dimensions", path: "/games/principle-sprint", icon: "🎯", difficulty: "medium", xpReward: 35 },
  ],
  c6: [
    { id: "connect-6", name: "Connect 6 Draft", description: "Match genres to texts strategically", path: "/games/connect6-draft", icon: "📚", difficulty: "medium", xpReward: 35 },
    { id: "story-room-c6", name: "Genre Stories", description: "Identify story genres", path: "/games/story-room", icon: "🎭", difficulty: "easy", xpReward: 25 },
  ],
  trm: [
    { id: "sanctuary-run", name: "Theme Wall Run", description: "Navigate the sanctuary theme walls", path: "/games/sanctuary-run", icon: "🏛️", difficulty: "medium", xpReward: 40 },
    { id: "blue-room-trm", name: "Theme Explorer", description: "Explore major biblical themes", path: "/games/blue-room", icon: "🧱", difficulty: "medium", xpReward: 35 },
  ],
  tz: [
    { id: "time-zone", name: "Time Zone Invasion", description: "Defend the biblical timeline", path: "/games/time-zone-invasion", icon: "⏰", difficulty: "hard", xpReward: 50, badge: "New" },
    { id: "chain-chess-tz", name: "Timeline Chain", description: "Chain events chronologically", path: "/games/chain-chess/new", icon: "📅", difficulty: "hard", xpReward: 45 },
  ],
  prm: [
    { id: "connection-dash-prm", name: "Pattern Match", description: "Find recurring biblical patterns", path: "/games/connection-dash", icon: "🎵", difficulty: "medium", xpReward: 35 },
    { id: "chain-chess-prm", name: "Pattern Chains", description: "Build pattern connections", path: "/games/chain-chess/new", icon: "🔄", difficulty: "hard", xpReward: 45 },
  ],
  "p||": [
    { id: "connection-dash-parallel", name: "Parallel Vision", description: "Match mirrored biblical events", path: "/games/connection-dash", icon: "🪞", difficulty: "hard", xpReward: 45 },
    { id: "observation-parallel", name: "Parallel Detective", description: "Spot parallel structures", path: "/games/observation-room", icon: "👁️", difficulty: "medium", xpReward: 35 },
  ],
  frt: [
    { id: "principle-sprint-frt", name: "Fruit Inspector", description: "Test interpretations for spiritual fruit", path: "/games/principle-sprint", icon: "🍇", difficulty: "medium", xpReward: 30 },
    { id: "observation-frt", name: "Fruit Finder", description: "Identify fruit of the Spirit", path: "/games/observation-room", icon: "🌱", difficulty: "easy", xpReward: 25 },
  ],
  cec: [
    { id: "christ-lock-cec", name: "Christ Every Chapter", description: "Find Christ in each chapter", path: "/games/christ-lock", icon: "👑", difficulty: "hard", xpReward: 50 },
    { id: "concentration-cec", name: "Chapter Focus", description: "Deep dive into chapters", path: "/games/concentration-room", icon: "📖", difficulty: "medium", xpReward: 40 },
  ],
  r66: [
    { id: "chain-chess-r66", name: "66-Book Trace", description: "Trace themes through all 66 books", path: "/games/chain-chess/new", icon: "📿", difficulty: "hard", xpReward: 60 },
    { id: "story-room-r66", name: "Book Stories", description: "Know each book's narrative", path: "/games/story-room", icon: "📚", difficulty: "medium", xpReward: 40 },
  ],
  
  // Floor 5 - Vision Floor
  bl: [
    { id: "blue-room", name: "Blue Room Challenge", description: "Navigate the sanctuary blueprint", path: "/games/blue-room", icon: "⛪", difficulty: "hard", xpReward: 50, badge: "Popular" },
    { id: "sanctuary-run-bl", name: "Sanctuary Run", description: "Race through the temple stations", path: "/games/sanctuary-run", icon: "🏃", difficulty: "medium", xpReward: 40 },
  ],
  pr: [
    { id: "escape-dragon", name: "Escape the Dragon", description: "Navigate prophecy puzzles", path: "/games/escape-dragon", icon: "🐉", difficulty: "hard", xpReward: 55, badge: "Popular" },
    { id: "time-zone-pr", name: "Prophecy Timeline", description: "Track prophetic timelines", path: "/games/time-zone-invasion", icon: "🔮", difficulty: "hard", xpReward: 50 },
  ],
  "3a": [
    { id: "principle-sprint-3a", name: "Three Angels Sprint", description: "Master the three angels' messages", path: "/games/principle-sprint", icon: "👼", difficulty: "hard", xpReward: 45 },
    { id: "controversy-3a", name: "Angels' Mission", description: "Apply the messages to issues", path: "/games/controversy-raid", icon: "📢", difficulty: "hard", xpReward: 50 },
  ],
  fe: [
    { id: "connection-dash-fe", name: "Feast Calendar", description: "Match feasts to their meanings", path: "/games/connection-dash", icon: "🎊", difficulty: "medium", xpReward: 35 },
    { id: "sanctuary-run-fe", name: "Feast Journey", description: "Walk through the feast cycle", path: "/games/sanctuary-run", icon: "🗓️", difficulty: "medium", xpReward: 40 },
  ],
  
  // Floor 6 - Three Heavens Floor
  "123h": [
    { id: "time-zone-123h", name: "Heaven Sorter", description: "Place events in correct heaven era", path: "/games/time-zone-invasion", icon: "☁️", difficulty: "hard", xpReward: 50 },
    { id: "dimensions-123h", name: "Heaven Dimensions", description: "See heavenly perspectives", path: "/games/dimensions-room", icon: "🌌", difficulty: "hard", xpReward: 55 },
  ],
  cycles: [
    { id: "chain-chess-cycles", name: "Cycle Race", description: "Navigate the 8 redemptive cycles", path: "/games/chain-chess/new", icon: "🔄", difficulty: "hard", xpReward: 55 },
    { id: "time-zone-cycles", name: "Cycle Timeline", description: "Map cycles chronologically", path: "/games/time-zone-invasion", icon: "⚙️", difficulty: "hard", xpReward: 50 },
  ],
  jr: [
    { id: "principle-sprint-jr", name: "Juice Extractor", description: "Squeeze meaning from entire books", path: "/games/principle-sprint", icon: "🍊", difficulty: "hard", xpReward: 50 },
    { id: "observation-jr", name: "Deep Observation", description: "Find every detail in a book", path: "/games/observation-room", icon: "🔬", difficulty: "hard", xpReward: 55 },
  ],
  math: [
    { id: "equation-builder-math", name: "Math Room", description: "Build complex theological equations", path: "/games/equation-builder", icon: "🔢", difficulty: "hard", xpReward: 55 },
    { id: "equations-math", name: "Equation Master", description: "Solve advanced equation puzzles", path: "/equations-challenge", icon: "🧮", difficulty: "hard", xpReward: 50 },
  ],
  
  // Floor 7 - Spiritual & Emotional Floor
  frm: [
    { id: "concentration-frm", name: "Fire Room Challenge", description: "Face the flames of conviction", path: "/games/concentration-room", icon: "🔥", difficulty: "hard", xpReward: 45 },
    { id: "principle-sprint-frm", name: "Fire Sprint", description: "Rapid conviction applications", path: "/games/principle-sprint", icon: "⚡", difficulty: "hard", xpReward: 50 },
  ],
  mr: [
    { id: "concentration-mr", name: "Meditation Master", description: "Deep meditative Scripture practice", path: "/games/concentration-room", icon: "🙏", difficulty: "medium", xpReward: 35 },
    { id: "observation-mr", name: "Slow Observation", description: "Patient, detailed study", path: "/games/observation-room", icon: "🕯️", difficulty: "medium", xpReward: 30 },
  ],
  srm: [
    { id: "principle-sprint-srm", name: "Speed Drill", description: "Rapid-fire Scripture applications", path: "/games/principle-sprint", icon: "⚡", difficulty: "hard", xpReward: 50 },
    { id: "connection-dash-srm", name: "Speed Connections", description: "Fast verse linking", path: "/games/connection-dash", icon: "🏎️", difficulty: "hard", xpReward: 45 },
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
