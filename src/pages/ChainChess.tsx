import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Trophy, MessageSquare, Sparkles, Target, Share2, Copy,
  AlertTriangle, CheckCircle2, XCircle, Crown, Zap, BookOpen,
  Building2, Lightbulb, ChevronDown, User, Bot
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ptRooms, biblicalBooks, ptPrinciples,
  chainChessRules, getRandomChallenge,
  type PTRoom, type BiblicalBook, type PTPrinciple
} from "@/data/chainChessData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

interface Move {
  id: string;
  player: "user" | "jeeves" | "opponent";
  verse: string;
  verseText?: string;
  comment: string;
  challengeType: "room" | "book" | "principle";
  challengeId: string;
  challengeName: string;
  connection?: string;
  ruling?: {
    approved: boolean;
    explanation: string;
    bonusPoints?: number;
  };
  score: number;
  timestamp: string;
}

interface GameState {
  playerStrikes: number;
  opponentStrikes: number;
  playerScore: number;
  opponentScore: number;
  playerBonusPoints: number;
  opponentBonusPoints: number;
  currentChallenge?: {
    type: "room" | "book" | "principle";
    id: string;
    name: string;
  };
  roundNumber: number;
  gameMode: "vs-jeeves" | "vs-player";
  difficulty: "kids" | "adults";
  currentTurn: "player" | "opponent";
  status: "setup" | "in_progress" | "completed";
  winner?: "player" | "opponent" | "tie";
}

const ChainChess = () => {
  const { gameId, mode } = useParams<{ gameId: string; mode?: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    playerStrikes: 0,
    opponentStrikes: 0,
    playerScore: 0,
    opponentScore: 0,
    playerBonusPoints: 0,
    opponentBonusPoints: 0,
    roundNumber: 0,
    gameMode: mode === "jeeves" ? "vs-jeeves" : "vs-player",
    difficulty: "adults",
    currentTurn: "player",
    status: "setup"
  });

  const [moves, setMoves] = useState<Move[]>([]);
  const [processing, setProcessing] = useState(false);

  // Input state
  const [verse, setVerse] = useState("");
  const [verseText, setVerseText] = useState("");
  const [comment, setComment] = useState("");
  const [connection, setConnection] = useState("");
  const [challengeType, setChallengeType] = useState<"room" | "book" | "principle">("room");
  const [challengeId, setChallengeid] = useState("");

  // UI state
  const [showRules, setShowRules] = useState(false);
  const [whoStarts, setWhoStarts] = useState<"player" | "jeeves">("player");

  const isVsJeeves = gameState.gameMode === "vs-jeeves";

  // Get current challenge details
  const getCurrentChallenge = useCallback(() => {
    if (!gameState.currentChallenge) return null;
    const { type, id } = gameState.currentChallenge;

    switch (type) {
      case "room":
        return ptRooms.find(r => r.id === id);
      case "book":
        return biblicalBooks.find(b => b.id === id);
      case "principle":
        return ptPrinciples.find(p => p.id === id);
      default:
        return null;
    }
  }, [gameState.currentChallenge]);

  // Fetch verse text
  const fetchVerseText = async (verseRef: string): Promise<string> => {
    try {
      const parts = verseRef.match(/^(\d?\s?\w+)\s(\d+):(\d+)(-\d+)?$/);
      if (parts) {
        const [, book, chapter, verse] = parts;
        const formattedBook = book.trim().replace(/\s+/g, '%20');

        const response = await fetch(
          `https://bible-api.com/${formattedBook}%20${chapter}:${verse}?translation=kjv`,
          { signal: AbortSignal.timeout(5000) }
        );

        if (response.ok) {
          const data = await response.json();
          return data.text?.trim() || data.verses?.[0]?.text?.trim() || "Verse text unavailable";
        }
      }
      return "Verse text unavailable";
    } catch {
      return "Verse text unavailable";
    }
  };

  // Start new game
  const startGame = async () => {
    if (!user) return;

    try {
      setProcessing(true);

      // Create game in database
      const { data: newGame, error } = await supabase
        .from("games")
        .insert({
          game_type: "chain_chess_v2",
          player1_id: user.id,
          player2_id: isVsJeeves ? null : null,
          status: "in_progress",
          game_state: {
            version: 2,
            gameMode: gameState.gameMode,
            difficulty: gameState.difficulty,
            whoStarts,
            playerStrikes: 0,
            opponentStrikes: 0,
            playerScore: 0,
            opponentScore: 0,
            roundNumber: 0
          }
        })
        .select()
        .single();

      if (error) throw error;

      // Navigate to game
      const newUrl = `/games/chain-chess/${newGame.id}${isVsJeeves ? "/jeeves" : ""}`;
      navigate(newUrl, { replace: true });

      setGameState(prev => ({
        ...prev,
        status: "in_progress",
        currentTurn: whoStarts === "player" ? "player" : "opponent"
      }));

      // If Jeeves starts, trigger first move
      if (whoStarts === "jeeves" && isVsJeeves) {
        await jeevesOpeningMove(newGame.id);
      }

    } catch (error: any) {
      toast({
        title: "Error starting game",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  // Jeeves opening move
  const jeevesOpeningMove = async (currentGameId: string) => {
    setProcessing(true);
    try {
      console.log("[ChainChess] Requesting Jeeves opening move...");
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v2-opening",
          difficulty: gameState.difficulty
        }
      });

      if (error) {
        console.error("[ChainChess] Jeeves function error:", error);
        throw error;
      }

      if (!data) {
        console.error("[ChainChess] No data returned from Jeeves");
        throw new Error("No response from Jeeves");
      }

      console.log("[ChainChess] Jeeves opening response:", data);

      const newMove: Move = {
        id: crypto.randomUUID(),
        player: "jeeves",
        verse: data.verse || "Genesis 1:1",
        verseText: data.verseText || "",
        comment: data.comment || "Let's begin our exploration of Scripture!",
        challengeType: data.challengeType || "room",
        challengeId: data.challengeId || "sr",
        challengeName: data.challengeName || "Story Room",
        score: 0,
        timestamp: new Date().toISOString()
      };

      // Save move to database
      await supabase.from("game_moves").insert([{
        game_id: currentGameId,
        player_id: null,
        move_data: JSON.parse(JSON.stringify(newMove))
      }]);

      setMoves([newMove]);
      setGameState(prev => ({
        ...prev,
        currentChallenge: {
          type: data.challengeType,
          id: data.challengeId,
          name: data.challengeName
        },
        roundNumber: 1,
        currentTurn: "player"
      }));

    } catch (error: any) {
      toast({
        title: "Jeeves error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  // Submit player move
  const submitMove = async () => {
    if (!verse.trim() || !comment.trim() || !challengeId) {
      toast({
        title: "Missing information",
        description: "Please provide a verse, your connection/comment, and select a challenge",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Fetch verse text
      const fetchedVerseText = await fetchVerseText(verse);
      setVerseText(fetchedVerseText);

      // Get challenge details
      const challengeName = getChallengeNameById(challengeType, challengeId);
      const currentChallengeDetails = getCurrentChallenge();

      // Judge the connection
      const { data: ruling, error: rulingError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v2-judge",
          verse,
          verseText: fetchedVerseText,
          comment,
          connection,
          challengeType: gameState.currentChallenge?.type,
          challengeId: gameState.currentChallenge?.id,
          challengeName: gameState.currentChallenge?.name,
          challengeDetails: currentChallengeDetails,
          previousMoves: moves,
          difficulty: gameState.difficulty
        }
      });

      if (rulingError) throw rulingError;

      const isApproved = ruling.approved;
      const bonusPoints = ruling.bonusPoints || 0;

      const newMove: Move = {
        id: crypto.randomUUID(),
        player: "user",
        verse,
        verseText: fetchedVerseText,
        comment,
        connection,
        challengeType,
        challengeId,
        challengeName,
        ruling: {
          approved: isApproved,
          explanation: ruling.explanation,
          bonusPoints
        },
        score: isApproved ? (ruling.score || 1) + bonusPoints : 0,
        timestamp: new Date().toISOString()
      };

      // Save move
      await supabase.from("game_moves").insert([{
        game_id: gameId,
        player_id: user!.id,
        move_data: JSON.parse(JSON.stringify(newMove))
      }]);

      const newMoves = [...moves, newMove];
      setMoves(newMoves);

      // Update game state
      const newPlayerStrikes = isApproved ? gameState.playerStrikes : gameState.playerStrikes + 1;
      const newPlayerScore = gameState.playerScore + newMove.score;
      const newPlayerBonus = gameState.playerBonusPoints + bonusPoints;

      // Check for game end
      if (newPlayerStrikes >= chainChessRules.strikesForLoss) {
        setGameState(prev => ({
          ...prev,
          playerStrikes: newPlayerStrikes,
          playerScore: newPlayerScore,
          playerBonusPoints: newPlayerBonus,
          status: "completed",
          winner: "opponent"
        }));
        toast({
          title: "Game Over",
          description: "You've accumulated 3 strikes. Jeeves wins!",
        });
        return;
      }

      setGameState(prev => ({
        ...prev,
        playerStrikes: newPlayerStrikes,
        playerScore: newPlayerScore,
        playerBonusPoints: newPlayerBonus,
        currentChallenge: {
          type: challengeType,
          id: challengeId,
          name: challengeName
        },
        roundNumber: prev.roundNumber + 1,
        currentTurn: "opponent"
      }));

      // Clear form
      setVerse("");
      setComment("");
      setConnection("");
      setChallengeType("room");
      setChallengeid("");

      if (isApproved) {
        toast({
          title: "✅ Connection Approved!",
          description: `+${newMove.score} points${bonusPoints > 0 ? ` (includes +${bonusPoints} bonus!)` : ""}`,
        });
      } else {
        toast({
          title: "❌ Connection Denied",
          description: `Strike ${newPlayerStrikes}/3 - ${ruling.explanation}`,
          variant: "destructive"
        });
      }

      // Trigger Jeeves response if vs Jeeves
      if (isVsJeeves && isApproved) {
        setTimeout(() => jeevesResponse(), 1500);
      }

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  // Jeeves response move
  const jeevesResponse = async () => {
    setProcessing(true);
    try {
      const currentChallenge = gameState.currentChallenge;
      const challengeDetails = getCurrentChallenge();

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-chess-v2-response",
          challengeType: currentChallenge?.type,
          challengeId: currentChallenge?.id,
          challengeName: currentChallenge?.name,
          challengeDetails,
          previousMoves: moves,
          difficulty: gameState.difficulty
        }
      });

      if (error) throw error;

      const newMove: Move = {
        id: crypto.randomUUID(),
        player: "jeeves",
        verse: data.verse,
        verseText: data.verseText,
        comment: data.comment,
        connection: data.connection,
        challengeType: data.challengeType,
        challengeId: data.challengeId,
        challengeName: data.challengeName,
        score: data.score || 1,
        timestamp: new Date().toISOString()
      };

      // Save move
      await supabase.from("game_moves").insert([{
        game_id: gameId,
        player_id: null,
        move_data: JSON.parse(JSON.stringify(newMove))
      }]);

      setMoves(prev => [...prev, newMove]);

      setGameState(prev => ({
        ...prev,
        opponentScore: prev.opponentScore + newMove.score,
        currentChallenge: {
          type: data.challengeType,
          id: data.challengeId,
          name: data.challengeName
        },
        roundNumber: prev.roundNumber + 1,
        currentTurn: "player"
      }));

    } catch (error: any) {
      toast({
        title: "Jeeves error",
        description: error.message,
        variant: "destructive"
      });
      setGameState(prev => ({ ...prev, currentTurn: "player" }));
    } finally {
      setProcessing(false);
    }
  };

  // Helper to get challenge name
  const getChallengeNameById = (type: "room" | "book" | "principle", id: string): string => {
    switch (type) {
      case "room":
        return ptRooms.find(r => r.id === id)?.name || id;
      case "book":
        return biblicalBooks.find(b => b.id === id)?.name || id;
      case "principle":
        return ptPrinciples.find(p => p.id === id)?.name || id;
      default:
        return id;
    }
  };

  // Load existing game
  useEffect(() => {
    if (user && gameId && gameId !== "new") {
      loadGame();
    }
  }, [user, gameId]);

  const loadGame = async () => {
    try {
      const { data: game } = await supabase
        .from("games")
        .select("*")
        .eq("id", gameId)
        .single();

      if (game) {
        const state = game.game_state as any;
        setGameState({
          playerStrikes: state.playerStrikes || 0,
          opponentStrikes: state.opponentStrikes || 0,
          playerScore: state.playerScore || 0,
          opponentScore: state.opponentScore || 0,
          playerBonusPoints: state.playerBonusPoints || 0,
          opponentBonusPoints: state.opponentBonusPoints || 0,
          currentChallenge: state.currentChallenge,
          roundNumber: state.roundNumber || 0,
          gameMode: state.gameMode || (mode === "jeeves" ? "vs-jeeves" : "vs-player"),
          difficulty: state.difficulty || "adults",
          currentTurn: game.current_turn === user?.id ? "player" : "opponent",
          status: game.status === "completed" ? "completed" : "in_progress",
          winner: state.winner
        });

        // Load moves
        const { data: movesData } = await supabase
          .from("game_moves")
          .select("*")
          .eq("game_id", gameId)
          .order("created_at", { ascending: true });

        if (movesData) {
          setMoves(movesData.map(m => m.move_data as unknown as Move));
        }
      }
    } catch (error) {
      console.error("Error loading game:", error);
    }
  };

  // Render strike indicators
  const renderStrikes = (strikes: number, label: string) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i < strikes
                ? "bg-red-500 border-red-600"
                : "bg-transparent border-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );

  // Render challenge selector
  const renderChallengeSelector = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Challenge Type</label>
        <div className="flex gap-2">
          <Button
            variant={challengeType === "room" ? "default" : "outline"}
            size="sm"
            onClick={() => { setChallengeType("room"); setChallengeid(""); }}
          >
            <Building2 className="h-4 w-4 mr-1" />
            PT Room
          </Button>
          <Button
            variant={challengeType === "book" ? "default" : "outline"}
            size="sm"
            onClick={() => { setChallengeType("book"); setChallengeid(""); }}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Biblical Book
          </Button>
          <Button
            variant={challengeType === "principle" ? "default" : "outline"}
            size="sm"
            onClick={() => { setChallengeType("principle"); setChallengeid(""); }}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            PT Principle
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select {challengeType === "room" ? "Room" : challengeType === "book" ? "Book" : "Principle"}
        </label>
        <Select value={challengeId} onValueChange={setChallengeid}>
          <SelectTrigger>
            <SelectValue placeholder={`Choose a ${challengeType}...`} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {challengeType === "room" && ptRooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{room.tag}</Badge>
                  {room.name}
                </div>
              </SelectItem>
            ))}
            {challengeType === "book" && biblicalBooks.map(book => (
              <SelectItem key={book.id} value={book.id}>
                <div className="flex items-center gap-2">
                  <Badge variant={book.testament === "OT" ? "secondary" : "default"} className="text-xs">
                    {book.testament}
                  </Badge>
                  {book.name}
                </div>
              </SelectItem>
            ))}
            {challengeType === "principle" && ptPrinciples.map(principle => (
              <SelectItem key={principle.id} value={principle.id}>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{principle.shortName}</Badge>
                  {principle.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Chain Chess
              </h1>
              <p className="text-muted-foreground mt-1">
                Connect verses through PT Rooms, Books & Principles
              </p>
            </div>

            {gameState.status === "in_progress" && (
              <div className="flex items-center gap-4">
                {renderStrikes(gameState.playerStrikes, "Your Strikes")}
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Target className="mr-2 h-4 w-4" />
                  You: {gameState.playerScore}
                </Badge>
                {isVsJeeves && (
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Jeeves: {gameState.opponentScore}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Rules Collapsible */}
          <Collapsible open={showRules} onOpenChange={setShowRules}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>Game Rules</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showRules ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Objective</h4>
                    <p className="text-sm text-muted-foreground">{chainChessRules.objective}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Win Condition</h4>
                    <p className="text-sm text-muted-foreground">{chainChessRules.winCondition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-green-600">Valid Connections</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {chainChessRules.validConnectionCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Invalid Connections (Strike)</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {chainChessRules.invalidConnectionCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-amber-600">Bonus Points</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {chainChessRules.bonusPointCriteria.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Setup Screen */}
          {gameState.status === "setup" && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl">Setup Chain Chess</CardTitle>
                <CardDescription>
                  Configure your game before starting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <div className="flex gap-3">
                    <Button
                      variant={gameState.difficulty === "kids" ? "default" : "outline"}
                      onClick={() => setGameState(prev => ({ ...prev, difficulty: "kids" }))}
                      className="flex-1"
                    >
                      Kids
                    </Button>
                    <Button
                      variant={gameState.difficulty === "adults" ? "default" : "outline"}
                      onClick={() => setGameState(prev => ({ ...prev, difficulty: "adults" }))}
                      className="flex-1"
                    >
                      Adults
                    </Button>
                  </div>
                </div>

                {/* Who Starts */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Who starts first?</label>
                  <div className="flex gap-3">
                    <Button
                      variant={whoStarts === "player" ? "default" : "outline"}
                      onClick={() => setWhoStarts("player")}
                      className="flex-1 h-auto py-4"
                    >
                      <div className="text-center">
                        <User className="h-6 w-6 mx-auto mb-1" />
                        <div className="font-semibold">You Start</div>
                        <div className="text-xs opacity-80 mt-1">
                          Choose the opening verse
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={whoStarts === "jeeves" ? "default" : "outline"}
                      onClick={() => setWhoStarts("jeeves")}
                      className="flex-1 h-auto py-4"
                    >
                      <div className="text-center">
                        <Bot className="h-6 w-6 mx-auto mb-1" />
                        <div className="font-semibold">Jeeves Starts</div>
                        <div className="text-xs opacity-80 mt-1">
                          Jeeves chooses the opening
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={startGame}
                  disabled={processing}
                  className="w-full"
                  size="lg"
                >
                  {processing ? (
                    <Sparkles className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Trophy className="h-5 w-5 mr-2" />
                  )}
                  Start Game
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Game Board */}
          {gameState.status === "in_progress" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Conversation */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Game Conversation
                    </CardTitle>
                    {gameState.currentChallenge && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current Challenge:</span>
                        <Badge variant="outline" className="font-semibold">
                          {gameState.currentChallenge.name}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 pr-4">
                      <div className="space-y-4">
                        <AnimatePresence>
                          {moves.map((move, idx) => (
                            <motion.div
                              key={move.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`p-4 rounded-lg ${
                                move.player === "jeeves"
                                  ? "bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500"
                                  : "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                              }`}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Badge variant={move.player === "jeeves" ? "default" : "secondary"}>
                                    {move.player === "jeeves" ? "Jeeves" : "You"}
                                  </Badge>
                                  <Badge variant="outline">Round {idx + 1}</Badge>
                                </div>
                                {move.score > 0 && (
                                  <Badge className="bg-green-500">
                                    <Trophy className="h-3 w-3 mr-1" />
                                    +{move.score}
                                  </Badge>
                                )}
                              </div>

                              {/* Verse */}
                              <div className="mb-3">
                                <p className="font-semibold text-primary">{move.verse}</p>
                                {move.verseText && (
                                  <p className="text-sm italic text-muted-foreground mt-1">
                                    "{move.verseText}"
                                  </p>
                                )}
                              </div>

                              {/* Comment/Connection */}
                              <p className="text-foreground mb-3">{move.comment}</p>

                              {move.connection && (
                                <div className="p-2 bg-background/50 rounded text-sm mb-3">
                                  <span className="font-medium">Connection: </span>
                                  {move.connection}
                                </div>
                              )}

                              {/* Challenge */}
                              <div className="p-2 bg-primary/10 rounded border-l-2 border-primary">
                                <p className="text-sm font-semibold text-primary">
                                  Challenge: {move.challengeName}
                                </p>
                              </div>

                              {/* Ruling */}
                              {move.ruling && (
                                <div className={`mt-3 p-3 rounded ${
                                  move.ruling.approved
                                    ? "bg-green-100 dark:bg-green-900/30 border border-green-300"
                                    : "bg-red-100 dark:bg-red-900/30 border border-red-300"
                                }`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    {move.ruling.approved ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className="font-semibold text-sm">
                                      {move.ruling.approved ? "✅ APPROVED" : "❌ DENIED"}
                                    </span>
                                    {move.ruling.bonusPoints && move.ruling.bonusPoints > 0 && (
                                      <Badge className="bg-amber-500 ml-2">
                                        <Zap className="h-3 w-3 mr-1" />
                                        +{move.ruling.bonusPoints} Bonus
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm">{move.ruling.explanation}</p>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {processing && (
                          <div className="text-center py-8">
                            <Sparkles className="h-8 w-8 animate-spin mx-auto mb-2 text-purple-500" />
                            <p className="text-muted-foreground">
                              {gameState.currentTurn === "opponent" ? "Jeeves is thinking..." : "Processing..."}
                            </p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Input Panel */}
              <div className="space-y-4">
                {gameState.currentTurn === "player" && !processing ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Move</CardTitle>
                      {gameState.currentChallenge && (
                        <CardDescription>
                          Respond to: <strong>{gameState.currentChallenge.name}</strong>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Verse Input */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Verse</label>
                        <input
                          type="text"
                          placeholder="e.g., Romans 8:28"
                          value={verse}
                          onChange={(e) => setVerse(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                      </div>

                      {/* Connection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Connection</label>
                        <Textarea
                          placeholder="Explain how your verse connects to the challenge using PT methodology..."
                          value={connection}
                          onChange={(e) => setConnection(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {/* Comment */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Comment</label>
                        <Textarea
                          placeholder="Add your biblical insight and exposition..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={3}
                        />
                      </div>

                      {/* Challenge Selector */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Challenge Your Opponent</h4>
                        {renderChallengeSelector()}
                      </div>

                      <Button
                        onClick={submitMove}
                        disabled={!verse.trim() || !comment.trim() || !challengeId || processing}
                        className="w-full"
                      >
                        Submit Move
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      {processing ? (
                        <>
                          <Sparkles className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
                          <p className="text-lg font-medium">
                            {gameState.currentTurn === "opponent" ? "Jeeves is thinking..." : "Processing your move..."}
                          </p>
                        </>
                      ) : (
                        <>
                          <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium">Waiting for Jeeves...</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={jeevesResponse}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Nudge Jeeves
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Current Challenge Info */}
                {gameState.currentChallenge && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Challenge Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const challenge = getCurrentChallenge();
                        if (!challenge) return null;

                        if ('methodology' in challenge) {
                          const room = challenge as PTRoom;
                          return (
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{room.name}</p>
                              <p className="text-muted-foreground">{room.shortDescription}</p>
                              <p className="text-xs"><strong>Method:</strong> {room.methodology}</p>
                            </div>
                          );
                        } else if ('themes' in challenge) {
                          const book = challenge as BiblicalBook;
                          return (
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{book.name}</p>
                              <p className="text-muted-foreground">Themes: {book.themes.join(", ")}</p>
                            </div>
                          );
                        } else if ('description' in challenge) {
                          const principle = challenge as PTPrinciple;
                          return (
                            <div className="space-y-2 text-sm">
                              <p className="font-medium">{principle.name}</p>
                              <p className="text-muted-foreground">{principle.description}</p>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState.status === "completed" && (
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <Crown className={`h-16 w-16 mx-auto mb-4 ${
                  gameState.winner === "player" ? "text-yellow-500" : "text-purple-500"
                }`} />
                <CardTitle className="text-3xl">
                  {gameState.winner === "player" ? "You Won!" : "Jeeves Wins!"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {gameState.winner === "player"
                    ? "Congratulations on your Chain Chess victory!"
                    : "Good game! Keep practicing your PT connections."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold">{gameState.playerScore}</p>
                    <p className="text-sm text-muted-foreground">Your Score</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-2xl font-bold">{gameState.opponentScore}</p>
                    <p className="text-sm text-muted-foreground">Jeeves' Score</p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games/chain-chess/new/jeeves")}>
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/games")}>
                    Back to Games
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChainChess;
