import { useState, useRef, Suspense, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Text,
  Html,
  useTexture,
  Box,
  Plane,
  Cylinder,
  Sphere
} from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Lock, Unlock, Lightbulb, Check, X, HelpCircle, Trophy, Clock } from "lucide-react";
import { toast } from "sonner";
import { escapeRooms, type Puzzle, type EscapeRoom } from "@/data/escapeRoomData";

// Interactive 3D Object component
interface InteractiveObjectProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  objectType: 'scroll' | 'chest' | 'tablet' | 'altar' | 'lampstand' | 'door' | 'veil' | 'pillar';
  puzzleIndex: number;
  isSolved: boolean;
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function InteractiveObject({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  objectType,
  puzzleIndex,
  isSolved,
  isActive,
  onClick,
  label
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Hover animation
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered && !isSolved) {
        meshRef.current.scale.setScalar(scale * 1.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  const getObjectColor = () => {
    if (isSolved) return "#22c55e"; // Green for solved
    if (hovered) return "#fbbf24"; // Yellow for hover
    if (isActive) return "#8b5cf6"; // Purple for active/available
    return "#6b7280"; // Gray for locked
  };

  const renderObject = () => {
    switch (objectType) {
      case 'scroll':
        return (
          <group>
            <Cylinder args={[0.15, 0.15, 0.8, 16]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.6} />
            </Cylinder>
            {/* Scroll ends */}
            <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </Cylinder>
            <Cylinder args={[0.2, 0.2, 0.1, 16]} position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#8B4513" roughness={0.4} />
            </Cylinder>
          </group>
        );

      case 'chest':
        return (
          <group>
            {/* Base */}
            <Box args={[0.8, 0.5, 0.5]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Lid */}
            <Box
              args={[0.82, 0.1, 0.52]}
              position={[0, isSolved ? 0.5 : 0.3, isSolved ? -0.2 : 0]}
              rotation={[isSolved ? -Math.PI / 3 : 0, 0, 0]}
            >
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Lock */}
            {!isSolved && (
              <Box args={[0.1, 0.15, 0.05]} position={[0, 0.1, 0.27]}>
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </Box>
            )}
          </group>
        );

      case 'tablet':
        return (
          <Box args={[0.6, 0.8, 0.1]}>
            <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
          </Box>
        );

      case 'altar':
        return (
          <group>
            {/* Altar base */}
            <Box args={[1.2, 0.8, 1.2]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.8} />
            </Box>
            {/* Fire bowl */}
            <Cylinder args={[0.3, 0.4, 0.2, 16]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#4a3728" roughness={0.6} />
            </Cylinder>
            {/* Flames */}
            {isSolved && (
              <pointLight position={[0, 0.8, 0]} color="#ff6b35" intensity={2} distance={3} />
            )}
          </group>
        );

      case 'lampstand':
        return (
          <group>
            {/* Base */}
            <Cylinder args={[0.3, 0.4, 0.1, 16]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Main stem */}
            <Cylinder args={[0.05, 0.05, 1.5, 8]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Cylinder>
            {/* Branches - simplified menorah */}
            {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
              <group key={i}>
                <Sphere args={[0.08, 16, 16]} position={[x, 1.5, 0]}>
                  <meshStandardMaterial color={getObjectColor()} emissive={isSolved ? "#ffaa00" : "#000"} emissiveIntensity={isSolved ? 0.5 : 0} />
                </Sphere>
                {isSolved && (
                  <pointLight position={[x, 1.6, 0]} color="#ffaa00" intensity={0.5} distance={2} />
                )}
              </group>
            ))}
          </group>
        );

      case 'door':
        return (
          <group>
            {/* Door frame */}
            <Box args={[1.5, 2.5, 0.2]} position={[0, 0, -0.15]}>
              <meshStandardMaterial color="#4a3728" roughness={0.6} />
            </Box>
            {/* Door */}
            <Box
              args={[1.3, 2.3, 0.15]}
              position={[isSolved ? -0.6 : 0, 0, 0]}
              rotation={[0, isSolved ? -Math.PI / 3 : 0, 0]}
            >
              <meshStandardMaterial color={getObjectColor()} roughness={0.5} />
            </Box>
            {/* Door handle */}
            <Sphere args={[0.08, 16, 16]} position={[0.5, 0, 0.1]}>
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </Sphere>
          </group>
        );

      case 'veil':
        return (
          <Box args={[2, 3, 0.05]}>
            <meshStandardMaterial
              color={getObjectColor()}
              roughness={0.9}
              transparent
              opacity={isSolved ? 0.3 : 0.9}
            />
          </Box>
        );

      case 'pillar':
        return (
          <group>
            <Cylinder args={[0.3, 0.35, 3, 16]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
            </Cylinder>
            {/* Capital */}
            <Box args={[0.6, 0.2, 0.6]} position={[0, 1.6, 0]}>
              <meshStandardMaterial color={getObjectColor()} roughness={0.7} />
            </Box>
          </group>
        );

      default:
        return (
          <Box args={[0.5, 0.5, 0.5]}>
            <meshStandardMaterial color={getObjectColor()} />
          </Box>
        );
    }
  };

  return (
    <group
      position={position}
      rotation={rotation as [number, number, number]}
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSolved) onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = isSolved ? 'default' : 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {renderObject()}

      {/* Floating label */}
      {(hovered || isActive) && !isSolved && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
            {label}
            {isSolved && " ✓"}
          </div>
        </Html>
      )}

      {/* Solved indicator */}
      {isSolved && (
        <Html position={[0, 1, 0]} center>
          <div className="text-2xl">✓</div>
        </Html>
      )}

      {/* Glow effect for unsolved active objects */}
      {isActive && !isSolved && (
        <pointLight position={[0, 0.5, 0]} color="#8b5cf6" intensity={0.5} distance={2} />
      )}
    </group>
  );
}

// Sanctuary Room Environment
interface SanctuaryRoomProps {
  puzzles: Puzzle[];
  solvedPuzzles: Set<number>;
  currentPuzzle: number;
  onObjectClick: (index: number) => void;
}

function SanctuaryRoom({ puzzles, solvedPuzzles, currentPuzzle, onObjectClick }: SanctuaryRoomProps) {
  // Room dimensions
  const roomWidth = 12;
  const roomDepth = 16;
  const roomHeight = 6;

  // Object positions mapped to puzzles
  const objectConfigs: { type: InteractiveObjectProps['objectType']; position: [number, number, number]; rotation?: [number, number, number]; label: string }[] = [
    { type: 'altar', position: [0, 0.4, -6], label: 'Altar of Burnt Offering' },
    { type: 'lampstand', position: [-4, 0, -2], label: 'Golden Lampstand' },
    { type: 'tablet', position: [4, 1.2, -5], rotation: [0, -0.3, 0], label: 'Stone Tablets' },
    { type: 'scroll', position: [-3, 1, 2], label: 'Ancient Scroll' },
    { type: 'chest', position: [3, 0.25, 0], label: 'Treasure Chest' },
    { type: 'veil', position: [0, 1.5, -7], label: 'Holy Veil' },
  ];

  return (
    <group>
      {/* Floor - stone texture */}
      <Plane args={[roomWidth, roomDepth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3d3d3d" roughness={0.9} />
      </Plane>

      {/* Ceiling */}
      <Plane args={[roomWidth, roomDepth]} rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
      </Plane>

      {/* Walls */}
      {/* Back wall */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, -roomDepth / 2]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </Plane>

      {/* Front wall (with opening) */}
      <Plane args={[roomWidth, roomHeight]} position={[0, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </Plane>

      {/* Left wall */}
      <Plane args={[roomDepth, roomHeight]} position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </Plane>

      {/* Right wall */}
      <Plane args={[roomDepth, roomHeight]} position={[roomWidth / 2, roomHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
      </Plane>

      {/* Decorative pillars */}
      <InteractiveObject
        position={[-4, 1.5, -6]}
        objectType="pillar"
        puzzleIndex={-1}
        isSolved={true}
        isActive={false}
        onClick={() => {}}
        label=""
      />
      <InteractiveObject
        position={[4, 1.5, -6]}
        objectType="pillar"
        puzzleIndex={-1}
        isSolved={true}
        isActive={false}
        onClick={() => {}}
        label=""
      />

      {/* Interactive puzzle objects */}
      {objectConfigs.slice(0, puzzles.length).map((config, index) => (
        <InteractiveObject
          key={index}
          position={config.position}
          rotation={config.rotation}
          objectType={config.type}
          puzzleIndex={index}
          isSolved={solvedPuzzles.has(index)}
          isActive={index <= Math.max(...Array.from(solvedPuzzles), -1) + 1}
          onClick={() => onObjectClick(index)}
          label={config.label}
        />
      ))}

      {/* Ambient torches */}
      <pointLight position={[-5, 4, -4]} color="#ff6b35" intensity={1} distance={8} />
      <pointLight position={[5, 4, -4]} color="#ff6b35" intensity={1} distance={8} />
      <pointLight position={[0, 4, 4]} color="#ff6b35" intensity={0.5} distance={6} />

      {/* Main light */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} />
    </group>
  );
}

// Camera controller
function CameraController() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, -2);
  }, [camera]);

  return null;
}

// Main component
export default function EscapeRoom3D() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // Find room data
  const room = escapeRooms.find(r => r.id === roomId) || escapeRooms[0];

  // Game state
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<number>>(new Set());
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Timer
  useEffect(() => {
    if (gameComplete || showIntro) return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, gameComplete, showIntro]);

  // Check game completion
  useEffect(() => {
    if (solvedPuzzles.size === room.puzzles.length && room.puzzles.length > 0) {
      setGameComplete(true);
      toast.success("Room Escaped! You've uncovered all the mysteries!");
    }
  }, [solvedPuzzles, room.puzzles.length]);

  const handleObjectClick = (index: number) => {
    if (solvedPuzzles.has(index)) return;
    // Allow clicking any unsolved puzzle (not strictly sequential for better exploration)
    setCurrentPuzzleIndex(index);
    setAnswer("");
    setShowHint(false);
  };

  const currentPuzzle = currentPuzzleIndex !== null ? room.puzzles[currentPuzzleIndex] : null;

  const checkAnswer = () => {
    if (!currentPuzzle || currentPuzzleIndex === null) return;

    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = currentPuzzle.answer?.toLowerCase().trim() || "";

    // Flexible matching
    const isCorrect = normalizedAnswer === normalizedCorrect ||
      normalizedCorrect.split(' ').every(word => normalizedAnswer.includes(word));

    if (isCorrect) {
      const pointsEarned = showHint ? Math.max(currentPuzzle.points - 5, 5) : currentPuzzle.points;
      setScore(prev => prev + pointsEarned);
      setSolvedPuzzles(prev => new Set([...prev, currentPuzzleIndex]));
      toast.success(`Correct! +${pointsEarned} points`);

      // Show clue revealed
      setTimeout(() => {
        toast.info(currentPuzzle.clueRevealed, { duration: 5000 });
        setCurrentPuzzleIndex(null);
      }, 1000);
    } else {
      toast.error("Not quite right. Try again!");
    }
  };

  const useHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (solvedPuzzles.size / room.puzzles.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/escape-room')} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Exit Room
          </Button>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-white border-white/30">
              <Clock className="h-3 w-3 mr-1" /> {formatTime(elapsedTime)}
            </Badge>
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
              <Trophy className="h-3 w-3 mr-1" /> {score} pts
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400/30">
              {solvedPuzzles.size}/{room.puzzles.length} Solved
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-6xl mx-auto mt-2">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows camera={{ fov: 60, position: [0, 2, 8] }}>
        <Suspense fallback={null}>
          <CameraController />
          <SanctuaryRoom
            puzzles={room.puzzles}
            solvedPuzzles={solvedPuzzles}
            currentPuzzle={currentPuzzleIndex ?? 0}
            onObjectClick={handleObjectClick}
          />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={3}
            maxDistance={12}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            target={[0, 1, -2]}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/70 border-white/20 text-white max-w-xs">
          <CardContent className="p-3 text-sm">
            <p className="text-purple-300 font-medium mb-1">Controls:</p>
            <p>• Drag to look around</p>
            <p>• Scroll to zoom</p>
            <p>• Click glowing objects to solve puzzles</p>
          </CardContent>
        </Card>
      </div>

      {/* Intro Dialog */}
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className="text-4xl">{room.icon}</span>
              {room.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-purple-200 italic">{room.storyIntro}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <Badge className={
                room.difficulty === 'easy' ? 'bg-green-600' :
                room.difficulty === 'medium' ? 'bg-yellow-600' :
                room.difficulty === 'hard' ? 'bg-orange-600' : 'bg-red-600'
              }>
                {room.difficulty}
              </Badge>
              <span>{room.puzzles.length} puzzles</span>
              <span>{room.timeLimit} min limit</span>
            </div>
            <Button onClick={() => setShowIntro(false)} className="w-full bg-purple-600 hover:bg-purple-700">
              Enter the Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Puzzle Dialog */}
      <Dialog open={currentPuzzleIndex !== null} onOpenChange={() => setCurrentPuzzleIndex(null)}>
        <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-lg">
          {currentPuzzle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Puzzle {(currentPuzzleIndex ?? 0) + 1}: {currentPuzzle.type.replace('-', ' ').toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Principle badge */}
                <Badge variant="outline" className="text-purple-300 border-purple-500">
                  {currentPuzzle.principle.room} - {currentPuzzle.principle.name}
                </Badge>

                {/* Question */}
                <div className="bg-black/50 rounded-lg p-4">
                  <p className="text-lg">{currentPuzzle.question}</p>
                </div>

                {/* Hint */}
                {showHint && currentPuzzle.hint && (
                  <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-200 text-sm">
                      <Lightbulb className="h-4 w-4 inline mr-2" />
                      {currentPuzzle.hint}
                    </p>
                  </div>
                )}

                {/* Answer input for riddle/fill-blank */}
                {(currentPuzzle.type === 'riddle' || currentPuzzle.type === 'fill-blank') && (
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    className="bg-black/50 border-purple-500/50 text-white"
                    onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  />
                )}

                {/* Multiple choice */}
                {currentPuzzle.type === 'multiple-choice' && currentPuzzle.options && (
                  <div className="grid grid-cols-2 gap-2">
                    {currentPuzzle.options.map((option, idx) => (
                      <Button
                        key={idx}
                        variant={answer === option ? "default" : "outline"}
                        className={answer === option ? "bg-purple-600" : "border-purple-500/50"}
                        onClick={() => setAnswer(option)}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Points info */}
                <p className="text-sm text-gray-400">
                  Points: {currentPuzzle.points} {showHint && "(−5 for hint)"}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  {!showHint && currentPuzzle.hint && (
                    <Button variant="outline" onClick={useHint} className="border-yellow-500/50 text-yellow-400">
                      <Lightbulb className="h-4 w-4 mr-2" /> Use Hint (−5 pts)
                    </Button>
                  )}
                  <Button onClick={checkAnswer} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Check className="h-4 w-4 mr-2" /> Submit Answer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Game Complete Dialog */}
      <Dialog open={gameComplete} onOpenChange={() => {}}>
        <DialogContent className="bg-slate-900 border-green-500/30 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-green-400">
              🎉 Room Escaped!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="text-6xl">{room.icon}</div>
            <h3 className="text-xl font-bold">{room.title}</h3>

            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-yellow-400">{score}</p>
                <p className="text-sm text-gray-400">Points</p>
              </div>
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-400">{formatTime(elapsedTime)}</p>
                <p className="text-sm text-gray-400">Time</p>
              </div>
              <div className="bg-black/50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-400">{hintsUsed}</p>
                <p className="text-sm text-gray-400">Hints Used</p>
              </div>
            </div>

            {/* Final answer */}
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-200 font-medium mb-2">The Mystery Revealed:</p>
              <p className="text-white">{room.finalAnswer.explanation}</p>
              <p className="text-green-300 text-sm mt-2 italic">{room.finalAnswer.verse}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/escape-room')} className="flex-1 border-white/30">
                Back to Rooms
              </Button>
              <Button
                onClick={() => {
                  setSolvedPuzzles(new Set());
                  setScore(0);
                  setHintsUsed(0);
                  setGameComplete(false);
                  setShowIntro(true);
                }}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Play Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
