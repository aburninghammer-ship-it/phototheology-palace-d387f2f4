import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, Trail } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";

// Prophecy timeline data - key prophetic periods
const PROPHECY_TIMELINE = [
  {
    id: "babylon",
    name: "Babylon",
    years: "605-539 BC",
    symbol: "🦁",
    color: "#FFD700",
    position: [-12, 0, 0],
    description: "Head of Gold - Nebuchadnezzar's kingdom",
    danielRef: "Daniel 2:37-38",
    duration: 66,
  },
  {
    id: "medopersia",
    name: "Medo-Persia",
    years: "539-331 BC",
    symbol: "🐻",
    color: "#C0C0C0",
    position: [-8, 0, 0],
    description: "Chest of Silver - Cyrus conquers Babylon",
    danielRef: "Daniel 2:39, 8:20",
    duration: 208,
  },
  {
    id: "greece",
    name: "Greece",
    years: "331-168 BC",
    symbol: "🐆",
    color: "#CD7F32",
    position: [-4, 0, 0],
    description: "Thighs of Bronze - Alexander's swift conquest",
    danielRef: "Daniel 2:39, 8:21",
    duration: 163,
  },
  {
    id: "rome",
    name: "Rome",
    years: "168 BC - 476 AD",
    symbol: "🦅",
    color: "#4A4A4A",
    position: [0, 0, 0],
    description: "Legs of Iron - The iron monarchy",
    danielRef: "Daniel 2:40",
    duration: 644,
  },
  {
    id: "divided",
    name: "Divided Europe",
    years: "476 AD - Present",
    symbol: "👑",
    color: "#8B4513",
    position: [4, 0, 0],
    description: "Feet of Iron & Clay - Nations never reunited",
    danielRef: "Daniel 2:41-43",
    duration: 1548,
  },
  {
    id: "stone",
    name: "God's Kingdom",
    years: "Future",
    symbol: "⛰️",
    color: "#00BFFF",
    position: [8, 0, 0],
    description: "The Stone Kingdom - Christ's eternal reign",
    danielRef: "Daniel 2:44-45",
    duration: null,
  },
];

// Animated kingdom pillar
function KingdomPillar({ kingdom, isSelected, onClick }: { 
  kingdom: typeof PROPHECY_TIMELINE[0]; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Pillar height based on duration (scaled)
  const height = kingdom.duration ? Math.min(Math.log(kingdom.duration) * 1.5, 6) : 5;
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + kingdom.position[0]) * 0.1;
      
      // Pulse when selected
      if (isSelected && glowRef.current) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        glowRef.current.scale.setScalar(scale);
      }
    }
  });
  
  return (
    <group position={kingdom.position as [number, number, number]}>
      {/* Glow effect for selected */}
      {isSelected && (
        <mesh ref={glowRef} position={[0, height / 2, 0]}>
          <cylinderGeometry args={[1.2, 1.2, height + 0.5, 32]} />
          <meshBasicMaterial color={kingdom.color} transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Main pillar */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        position={[0, height / 2, 0]}
      >
        <cylinderGeometry args={[0.8, 1, height, 8]} />
        <meshStandardMaterial
          color={kingdom.color}
          metalness={0.6}
          roughness={0.3}
          emissive={kingdom.color}
          emissiveIntensity={isSelected ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Top cap */}
      <mesh position={[0, height + 0.2, 0]}>
        <cylinderGeometry args={[0.9, 0.8, 0.4, 8]} />
        <meshStandardMaterial
          color={kingdom.color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Kingdom name */}
      <Text
        position={[0, height + 1.2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {kingdom.name}
      </Text>
      
      {/* Symbol */}
      <Text
        position={[0, -1, 0]}
        fontSize={1}
        anchorX="center"
        anchorY="middle"
      >
        {kingdom.symbol}
      </Text>
      
      {/* Years */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
      >
        {kingdom.years}
      </Text>
    </group>
  );
}

// Timeline connector beam
function TimelineBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      // Flowing energy effect
      const material = beamRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  
  return (
    <mesh ref={beamRef} position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.1, 0.1, 24, 16]} />
      <meshStandardMaterial
        color="#4488ff"
        transparent
        opacity={0.6}
        emissive="#4488ff"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Floating prophecy scroll
function ProphecyScroll({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh>
          <boxGeometry args={[2, 0.1, 0.5]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        <Text
          position={[0, 0.1, 0]}
          fontSize={0.15}
          color="#4a3728"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8}
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

// Stone falling from heaven (for God's Kingdom)
function FallingStone() {
  const stoneRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (stoneRef.current) {
      // Floating and rotating
      stoneRef.current.rotation.x += 0.005;
      stoneRef.current.rotation.y += 0.01;
      stoneRef.current.position.y = 8 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });
  
  return (
    <Trail
      width={2}
      length={6}
      color="#00BFFF"
      attenuation={(t) => t * t}
    >
      <mesh ref={stoneRef} position={[8, 8, 0]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#00BFFF"
          emissive="#00BFFF"
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
    </Trail>
  );
}

// Main scene
function ProphecyScene({ selectedKingdom, onSelectKingdom }: {
  selectedKingdom: string | null;
  onSelectKingdom: (id: string) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} color="#4488ff" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffd700" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Timeline beam */}
      <TimelineBeam />
      
      {/* Kingdom pillars */}
      {PROPHECY_TIMELINE.map((kingdom) => (
        <KingdomPillar
          key={kingdom.id}
          kingdom={kingdom}
          isSelected={selectedKingdom === kingdom.id}
          onClick={() => onSelectKingdom(kingdom.id)}
        />
      ))}
      
      {/* Falling stone for God's Kingdom */}
      <FallingStone />
      
      {/* Floating scrolls with key verses */}
      <ProphecyScroll position={[-10, 5, -3]} text="Daniel 2:28 - There is a God in heaven that revealeth secrets" />
      <ProphecyScroll position={[10, 6, -4]} text="Daniel 2:44 - The God of heaven shall set up a kingdom" />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={35}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4488ff" />
    </mesh>
  );
}

interface Prophecy3DViewerProps {
  onClose?: () => void;
}

export function Prophecy3DViewer({ onClose }: Prophecy3DViewerProps) {
  const [selectedKingdom, setSelectedKingdom] = useState<string | null>(null);
  const selectedData = useMemo(
    () => PROPHECY_TIMELINE.find((k) => k.id === selectedKingdom),
    [selectedKingdom]
  );
  
  const handlePrev = () => {
    const currentIndex = PROPHECY_TIMELINE.findIndex((k) => k.id === selectedKingdom);
    const prevIndex = currentIndex <= 0 ? PROPHECY_TIMELINE.length - 1 : currentIndex - 1;
    setSelectedKingdom(PROPHECY_TIMELINE[prevIndex].id);
  };
  
  const handleNext = () => {
    const currentIndex = PROPHECY_TIMELINE.findIndex((k) => k.id === selectedKingdom);
    const nextIndex = currentIndex >= PROPHECY_TIMELINE.length - 1 ? 0 : currentIndex + 1;
    setSelectedKingdom(PROPHECY_TIMELINE[nextIndex].id);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-xl overflow-hidden">
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
      
      {/* Title */}
      <div className="absolute top-4 left-4 z-20">
        <h3 className="text-xl font-bold text-white drop-shadow-lg">
          🔮 Daniel's Prophecy Timeline
        </h3>
        <p className="text-sm text-white/70">Click pillars to explore • Drag to rotate</p>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 8, 20], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ProphecyScene
            selectedKingdom={selectedKingdom}
            onSelectKingdom={setSelectedKingdom}
          />
        </Suspense>
      </Canvas>
      
      {/* Info panel */}
      {selectedData && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background/90 backdrop-blur-md border-primary/30 z-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <span className="text-3xl mr-2">{selectedData.symbol}</span>
                <span className="text-xl font-bold">{selectedData.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div
              className="h-1 rounded-full mb-3"
              style={{ backgroundColor: selectedData.color }}
            />
            <p className="text-sm text-muted-foreground mb-2">{selectedData.years}</p>
            <p className="text-sm mb-3">{selectedData.description}</p>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Info className="h-3 w-3" />
              <span>{selectedData.danielRef}</span>
            </div>
          </div>
        </Card>
      )}
      
      {/* Kingdom selector pills */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-4 md:left-1/2 flex gap-2 z-20 flex-wrap justify-center max-w-md">
        {PROPHECY_TIMELINE.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKingdom(k.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedKingdom === k.id
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-background/50 text-foreground/70 hover:bg-background/80"
            }`}
            style={{
              borderColor: k.color,
              borderWidth: selectedKingdom === k.id ? 2 : 1,
            }}
          >
            {k.symbol} {k.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Prophecy3DViewer;
