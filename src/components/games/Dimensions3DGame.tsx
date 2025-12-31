import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Html, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, Sparkles as SparklesIcon, Check } from "lucide-react";
import { PalaceRoom3D } from "@/components/3d/PalaceRoom3D";
import { useToast } from "@/hooks/use-toast";

// The 5 Dimensions
const DIMENSIONS = [
  {
    id: "literal",
    name: "Literal",
    emoji: "📖",
    color: "#3B82F6",
    question: "What does the text literally mean in its context?",
    position: [-4, 2, 0] as [number, number, number],
  },
  {
    id: "christ",
    name: "Christ",
    emoji: "✝️",
    color: "#DC2626",
    question: "How does this text point to or reveal Jesus Christ?",
    position: [-2, 3.5, -2] as [number, number, number],
  },
  {
    id: "me",
    name: "Personal",
    emoji: "👤",
    color: "#16A34A",
    question: "How does this apply to my personal life and walk with God?",
    position: [0, 4.5, 0] as [number, number, number],
  },
  {
    id: "church",
    name: "Church",
    emoji: "⛪",
    color: "#7C3AED",
    question: "How does this apply to the church corporately?",
    position: [2, 3.5, -2] as [number, number, number],
  },
  {
    id: "heaven",
    name: "Heaven",
    emoji: "🌟",
    color: "#F59E0B",
    question: "How does this relate to heaven and eternity?",
    position: [4, 2, 0] as [number, number, number],
  },
];

// Scripture passages for the game
const PASSAGES = [
  {
    reference: "Exodus 12:13",
    text: "The blood will be a sign for you on the houses where you are, and when I see the blood, I will pass over you.",
    hints: {
      literal: "Israelites put blood on doorposts; the destroyer passes over those houses.",
      christ: "Christ is our Passover Lamb (1 Cor 5:7); His blood saves from death and judgment.",
      me: "I must apply Christ's blood through faith; salvation is personal, not automatic.",
      church: "The church is protected by Christ's sacrifice; we are marked by His blood.",
      heaven: "Passover foreshadows eternal deliverance; ultimate Passover in new creation."
    }
  },
  {
    reference: "John 15:5",
    text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.",
    hints: {
      literal: "Jesus uses vine/branch metaphor to teach about connection and dependence.",
      christ: "Christ is the source of all spiritual life and fruitfulness.",
      me: "I must abide in Christ daily; apart from Him I can do nothing spiritually.",
      church: "The church is one body connected to Christ; we bear fruit together.",
      heaven: "Eternal fruitfulness flows from union with Christ; perfected in heaven."
    }
  },
  {
    reference: "Psalm 23:1",
    text: "The LORD is my shepherd, I shall not want.",
    hints: {
      literal: "David uses shepherd imagery from his own experience tending sheep.",
      christ: "Jesus is the Good Shepherd who lays down His life for the sheep (John 10:11).",
      me: "The LORD personally shepherds me; I lack nothing when He leads.",
      church: "Christ shepherds His flock corporately; the church follows one Shepherd.",
      heaven: "The Lamb will shepherd us eternally (Rev 7:17); perfect provision forever."
    }
  },
];

// Floating dimension crystal
function DimensionCrystal({ dimension, isActive, isComplete, onClick }: {
  dimension: typeof DIMENSIONS[0];
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
}) {
  const crystalRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (crystalRef.current) {
      // Rotate and float
      crystalRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      crystalRef.current.position.y = dimension.position[1] + Math.sin(state.clock.elapsedTime + dimension.position[0]) * 0.2;
      
      // Pulse when active
      if (isActive) {
        const scale = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        crystalRef.current.scale.setScalar(scale);
      } else {
        crystalRef.current.scale.setScalar(1);
      }
    }
  });
  
  return (
    <group position={dimension.position}>
      {/* Pedestal */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 8]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.4} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#4a4a5e" metalness={0.5} />
      </mesh>
      
      {/* Crystal group */}
      <group ref={crystalRef} onClick={onClick}>
        {/* Main crystal */}
        <mesh>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial
            color={dimension.color}
            metalness={0.3}
            roughness={0.4}
            emissive={dimension.color}
            emissiveIntensity={isActive ? 0.6 : isComplete ? 0.4 : 0.1}
            transparent
            opacity={isComplete ? 1 : 0.8}
          />
        </mesh>
        
        {/* Completion check */}
        {isComplete && (
          <mesh position={[0, 0, 0.7]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
          </mesh>
        )}
        
        {/* Sparkles when active */}
        {isActive && (
          <Sparkles count={30} scale={2} size={3} speed={1} color={dimension.color} />
        )}
      </group>
      
      {/* Label */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="black"
      >
        {dimension.emoji} {dimension.name}
      </Text>
      
      {/* Light */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isActive ? 1.5 : isComplete ? 0.8 : 0.3}
        distance={5}
        color={dimension.color}
      />
    </group>
  );
}

// Central scripture display
function ScriptureDisplay({ passage }: { passage: typeof PASSAGES[0] }) {
  return (
    <group position={[0, 1, 0]}>
      {/* Floating scroll/tablet */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 2.5, 0.1]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[4.2, 2.7, 0.05]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[3.8, 2.3, 0.02]} />
          <meshStandardMaterial color="#fefae0" />
        </mesh>
        
        {/* Reference */}
        <Text
          position={[0, 0.8, 0.12]}
          fontSize={0.2}
          color="#1e3a5f"
          anchorX="center"
        >
          {passage.reference}
        </Text>
        
        {/* Text (abbreviated for display) */}
        <Text
          position={[0, 0, 0.12]}
          fontSize={0.12}
          color="#333333"
          anchorX="center"
          maxWidth={3.5}
          textAlign="center"
        >
          {passage.text.length > 80 ? passage.text.substring(0, 80) + "..." : passage.text}
        </Text>
      </Float>
      
      {/* Illumination effect */}
      <pointLight position={[0, 2, 2]} intensity={0.5} color="#ffd700" />
    </group>
  );
}

// Main game scene content
function GameContent({ 
  passage, 
  activeDimension, 
  completedDimensions,
  onSelectDimension 
}: {
  passage: typeof PASSAGES[0];
  activeDimension: string | null;
  completedDimensions: Set<string>;
  onSelectDimension: (id: string) => void;
}) {
  return (
    <>
      {/* Scripture in center */}
      <ScriptureDisplay passage={passage} />
      
      {/* Dimension crystals arranged in arc */}
      {DIMENSIONS.map((dim) => (
        <DimensionCrystal
          key={dim.id}
          dimension={dim}
          isActive={activeDimension === dim.id}
          isComplete={completedDimensions.has(dim.id)}
          onClick={() => onSelectDimension(dim.id)}
        />
      ))}
      
      {/* Floor decoration - pentagram of light connecting dimensions */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <ringGeometry args={[4, 4.1, 64]} />
        <meshBasicMaterial color="#DAA520" transparent opacity={0.3} />
      </mesh>
    </>
  );
}

// Main scene
function DimensionsScene({ 
  passage, 
  activeDimension, 
  completedDimensions,
  onSelectDimension 
}: {
  passage: typeof PASSAGES[0];
  activeDimension: string | null;
  completedDimensions: Set<string>;
  onSelectDimension: (id: string) => void;
}) {
  return (
    <>
      <PalaceRoom3D theme="oracle" width={14} depth={14} height={10}>
        <GameContent 
          passage={passage}
          activeDimension={activeDimension}
          completedDimensions={completedDimensions}
          onSelectDimension={onSelectDimension}
        />
      </PalaceRoom3D>
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={6}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 2, 0]}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#7c3aed" />
    </mesh>
  );
}

interface Dimensions3DGameProps {
  onClose?: () => void;
  onComplete?: (score: number) => void;
}

export function Dimensions3DGame({ onClose, onComplete }: Dimensions3DGameProps) {
  const { toast } = useToast();
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [completedDimensions, setCompletedDimensions] = useState<Set<string>>(new Set());
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  
  const passage = PASSAGES[currentPassageIndex];
  const activeDimensionData = DIMENSIONS.find(d => d.id === activeDimension);
  
  const allDimensionsComplete = completedDimensions.size === 5;
  const gameComplete = currentPassageIndex === PASSAGES.length - 1 && allDimensionsComplete;
  
  const handleSubmit = () => {
    if (userAnswer.trim().length < 15) {
      toast({
        title: "Add More Detail",
        description: "Explain this dimension more fully!",
        variant: "destructive",
      });
      return;
    }
    
    if (activeDimension) {
      setCompletedDimensions(prev => new Set(prev).add(activeDimension));
      setScore(prev => prev + 1);
      setUserAnswer("");
      setShowHint(false);
      
      toast({
        title: "✓ Dimension Complete!",
        description: `${activeDimensionData?.emoji} ${activeDimensionData?.name} unlocked!`,
      });
      
      // Auto-select next incomplete dimension
      const nextIncomplete = DIMENSIONS.find(d => 
        !completedDimensions.has(d.id) && d.id !== activeDimension
      );
      setActiveDimension(nextIncomplete?.id || null);
    }
  };
  
  const handleNextPassage = () => {
    if (currentPassageIndex < PASSAGES.length - 1) {
      setCurrentPassageIndex(prev => prev + 1);
      setCompletedDimensions(new Set());
      setActiveDimension(null);
      setUserAnswer("");
      setShowHint(false);
    }
  };
  
  const handlePrevPassage = () => {
    if (currentPassageIndex > 0) {
      setCurrentPassageIndex(prev => prev - 1);
      setCompletedDimensions(new Set());
      setActiveDimension(null);
      setUserAnswer("");
      setShowHint(false);
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 rounded-xl overflow-hidden">
      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      
      {/* Title & progress */}
      <div className="absolute top-4 left-4 z-20">
        <h3 className="text-xl font-bold text-white drop-shadow-lg flex items-center gap-2">
          <SparklesIcon className="h-5 w-5" />
          5 Dimensions Chamber
        </h3>
        <p className="text-sm text-white/70">
          Passage {currentPassageIndex + 1}/{PASSAGES.length} • {completedDimensions.size}/5 Dimensions
        </p>
      </div>
      
      {/* Passage navigation */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevPassage}
          disabled={currentPassageIndex === 0}
          className="bg-background/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Badge variant="secondary" className="px-4 py-2">
          {passage.reference}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPassage}
          disabled={currentPassageIndex === PASSAGES.length - 1 || !allDimensionsComplete}
          className="bg-background/50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <DimensionsScene
            passage={passage}
            activeDimension={activeDimension}
            completedDimensions={completedDimensions}
            onSelectDimension={setActiveDimension}
          />
        </Suspense>
      </Canvas>
      
      {/* Dimension selector pills */}
      <div className="absolute bottom-[220px] left-4 right-4 flex justify-center gap-2 z-20 flex-wrap">
        {DIMENSIONS.map((dim) => (
          <button
            key={dim.id}
            onClick={() => setActiveDimension(dim.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              activeDimension === dim.id
                ? "scale-110 ring-2 ring-white"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              backgroundColor: completedDimensions.has(dim.id) 
                ? dim.color 
                : activeDimension === dim.id 
                  ? dim.color + "cc"
                  : "rgba(0,0,0,0.5)",
              color: "white",
              borderColor: dim.color,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            {dim.emoji} {dim.name}
            {completedDimensions.has(dim.id) && <Check className="h-3 w-3" />}
          </button>
        ))}
      </div>
      
      {/* Answer panel */}
      {activeDimensionData && !completedDimensions.has(activeDimensionData.id) && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[450px] bg-background/95 backdrop-blur-md border-primary/30 z-20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeDimensionData.emoji}</span>
                <span className="font-bold">{activeDimensionData.name} Dimension</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHint(!showHint)}
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">{activeDimensionData.question}</p>
            
            {showHint && (
              <div className="p-3 bg-amber-500/10 rounded-lg text-sm border border-amber-500/30">
                💡 {passage.hints[activeDimensionData.id as keyof typeof passage.hints]}
              </div>
            )}
            
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={`Explain the ${activeDimensionData.name.toLowerCase()} dimension...`}
              className="min-h-[80px]"
            />
            
            <Button onClick={handleSubmit} className="w-full" disabled={userAnswer.trim().length < 5}>
              Submit {activeDimensionData.name}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Completion message */}
      {allDimensionsComplete && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-background/95 backdrop-blur-md border-green-500/50 z-20">
          <CardContent className="p-4 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h4 className="font-bold text-lg">All 5 Dimensions Complete!</h4>
            <p className="text-sm text-muted-foreground">
              Like viewing a diamond under five different lights!
            </p>
            {currentPassageIndex < PASSAGES.length - 1 ? (
              <Button onClick={handleNextPassage} className="w-full">
                Next Passage →
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-green-500 font-bold">🏆 Game Complete!</p>
                <p className="text-sm">Score: {score} dimensions explored</p>
                {onComplete && (
                  <Button onClick={() => onComplete(score)} className="w-full">
                    Finish
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dimensions3DGame;
