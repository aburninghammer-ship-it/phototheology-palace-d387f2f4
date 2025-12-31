import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, Trail } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { PalaceRoom3D } from "@/components/3d/PalaceRoom3D";

// Prophecy timeline data - key prophetic periods
const PROPHECY_TIMELINE = [
  {
    id: "babylon",
    name: "Babylon",
    years: "605-539 BC",
    symbol: "🦁",
    color: "#FFD700",
    position: [-10, 0, 0],
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
    position: [-6, 0, 0],
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
    position: [-2, 0, 0],
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
    position: [2, 0, 0],
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
    position: [6, 0, 0],
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
    position: [10, 0, 0],
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
  const height = kingdom.duration ? Math.min(Math.log(kingdom.duration) * 1.2, 5) : 4;
  
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
      {/* Pedestal base */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[2, 0.3, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.8, 0.1, 1.8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Glow effect for selected */}
      {isSelected && (
        <mesh ref={glowRef} position={[0, height / 2 + 0.5, 0]}>
          <cylinderGeometry args={[1.2, 1.2, height + 0.5, 32]} />
          <meshBasicMaterial color={kingdom.color} transparent opacity={0.2} />
        </mesh>
      )}
      
      {/* Main pillar */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        position={[0, height / 2 + 0.5, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.7, 0.9, height, 8]} />
        <meshStandardMaterial
          color={kingdom.color}
          metalness={0.6}
          roughness={0.3}
          emissive={kingdom.color}
          emissiveIntensity={isSelected ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Top cap */}
      <mesh position={[0, height + 0.7, 0]}>
        <cylinderGeometry args={[0.8, 0.7, 0.4, 8]} />
        <meshStandardMaterial
          color={kingdom.color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Kingdom name */}
      <Text
        position={[0, height + 1.5, 0]}
        fontSize={0.4}
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
        position={[0, -0.5, 1.2]}
        fontSize={0.8}
        anchorX="center"
        anchorY="middle"
      >
        {kingdom.symbol}
      </Text>
      
      {/* Years */}
      <Text
        position={[0, -1.2, 1.2]}
        fontSize={0.25}
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
    <mesh ref={beamRef} position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.08, 0.08, 24, 16]} />
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
        <mesh castShadow>
          <boxGeometry args={[2.5, 0.08, 0.6]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
        {/* Scroll ends */}
        <mesh position={[-1.3, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[1.3, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <Text
          position={[0, 0.05, 0]}
          fontSize={0.12}
          color="#4a3728"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.2}
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
      stoneRef.current.position.y = 7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });
  
  return (
    <Trail
      width={2}
      length={6}
      color="#00BFFF"
      attenuation={(t) => t * t}
    >
      <mesh ref={stoneRef} position={[10, 7, 0]}>
        <dodecahedronGeometry args={[0.8, 0]} />
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

// Oracle room contents
function OracleContents({ selectedKingdom, onSelectKingdom }: {
  selectedKingdom: string | null;
  onSelectKingdom: (id: string) => void;
}) {
  return (
    <>
      {/* Extra mystical lighting */}
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.4} color="#4488ff" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#8b5cf6" />
      
      {/* Stars visible through mystical ceiling */}
      <Stars radius={50} depth={30} count={2000} factor={3} saturation={0} fade speed={1} />
      
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
      <ProphecyScroll position={[-8, 6, -8]} text="Daniel 2:28 - There is a God in heaven that revealeth secrets" />
      <ProphecyScroll position={[8, 6.5, -8]} text="Daniel 2:44 - The God of heaven shall set up a kingdom" />
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
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
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
          🔮 Prophecy Room - Daniel's Timeline
        </h3>
        <p className="text-sm text-white/70">Click pillars to explore • Drag to rotate</p>
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <PalaceRoom3D theme="oracle" width={35} height={10} depth={25}>
            <OracleContents
              selectedKingdom={selectedKingdom}
              onSelectKingdom={setSelectedKingdom}
            />
          </PalaceRoom3D>
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={28}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 2, 0]}
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:top-16 md:left-1/2 flex gap-2 z-20 flex-wrap justify-center max-w-lg">
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
