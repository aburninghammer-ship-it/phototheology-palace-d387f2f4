import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Sphere } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { PalaceRoom3D } from "@/components/3d/PalaceRoom3D";

// Three Heavens data based on Phototheology
const THREE_HEAVENS_DATA = [
  {
    id: "1h",
    name: "First Heaven (1H)",
    subtitle: "DoL¹ → NE¹",
    period: "586 BC Babylon → Cyrusic Restoration",
    color: "#4A90A4",
    position: [-6, 2, 0],
    radius: 1.5,
    description: "The first Day of the LORD culminates in Jerusalem's destruction by Babylon, followed by post-exilic restoration under Cyrus.",
    keyEvent: "Babylonian Exile → Return",
    scripture: "Isaiah 65-66, Ezra-Nehemiah",
    cycles: ["@Mo", "@Cy"],
  },
  {
    id: "2h", 
    name: "Second Heaven (2H)",
    subtitle: "DoL² → NE²",
    period: "70 AD → New Covenant Order",
    color: "#9B59B6",
    position: [0, 3, 0],
    radius: 1.8,
    description: "The second Day of the LORD is Jerusalem's destruction in 70 AD. The 'new heavens and earth' is the New-Covenant order—Christ's heavenly sanctuary.",
    keyEvent: "Temple Destroyed → Heavenly Ministry",
    scripture: "Matthew 24, Hebrews 8-12",
    cycles: ["@CyC", "@Sp"],
  },
  {
    id: "3h",
    name: "Third Heaven (3H)",
    subtitle: "DoL³ → NE³",
    period: "Final Judgment → Eternal Kingdom",
    color: "#F39C12",
    position: [6, 2, 0],
    radius: 2,
    description: "The third Day of the LORD is the final, universal judgment culminating in the literal New Heavens and New Earth—eternal creation.",
    keyEvent: "Second Coming → New Creation",
    scripture: "2 Peter 3, Revelation 21-22",
    cycles: ["@Re"],
  },
];

// Telescope prop
function Telescope({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tripod */}
      <mesh position={[0.3, 0.5, 0.3]} rotation={[0.3, 0, 0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[-0.3, 0.5, 0.3]} rotation={[-0.3, 0, -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh position={[0, 0.5, -0.4]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 8]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Telescope body */}
      <mesh position={[0, 1.1, 0]} rotation={[0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#8B7355" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Lens */}
      <mesh position={[0.35, 1.25, -0.2]} rotation={[0.3, 0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
        <meshStandardMaterial color="#4A90A4" metalness={0.8} roughness={0.2} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Orrery (planetary model)
function Orrery({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#8B7355" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Central pillar */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 8]} />
        <meshStandardMaterial color="#D4A574" metalness={0.6} />
      </mesh>
      {/* Rotating arm group */}
      <group ref={groupRef} position={[0, 0.7, 0]}>
        {/* Sun */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#F39C12" emissive="#F39C12" emissiveIntensity={0.5} />
        </mesh>
        {/* Planet 1 arm */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
          <meshStandardMaterial color="#D4A574" metalness={0.6} />
        </mesh>
        <mesh position={[0.25, 0, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#4A90A4" />
        </mesh>
        {/* Planet 2 arm */}
        <mesh rotation={[0, Math.PI / 3, Math.PI / 2]}>
          <cylinderGeometry args={[0.01, 0.01, 0.7, 8]} />
          <meshStandardMaterial color="#D4A574" metalness={0.6} />
        </mesh>
        <mesh position={[-0.2, 0, 0.28]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#9B59B6" />
        </mesh>
      </group>
    </group>
  );
}

// Star chart on wall
function StarChart({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[1.5, 1, 0.05]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Chart surface */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.3, 0.85]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Constellation dots */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[(Math.random() - 0.5) * 1.1, (Math.random() - 0.5) * 0.7, 0.04]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Heaven orb display
function HeavenOrb({ heaven, isSelected, onClick }: {
  heaven: typeof THREE_HEAVENS_DATA[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        sphereRef.current.scale.setScalar(scale);
      } else {
        sphereRef.current.scale.setScalar(1);
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });
  
  return (
    <group position={heaven.position as [number, number, number]}>
      {/* Display pedestal */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.3, 16]} />
        <meshStandardMaterial color="#2a2a3e" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 8]} />
        <meshStandardMaterial color="#4a4a5e" metalness={0.5} />
      </mesh>
      
      {/* Glow ring when selected */}
      {isSelected && (
        <mesh ref={ringRef}>
          <torusGeometry args={[heaven.radius + 0.3, 0.05, 16, 100]} />
          <meshBasicMaterial color={heaven.color} transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Main orb */}
      <mesh ref={sphereRef} onClick={onClick}>
        <sphereGeometry args={[heaven.radius, 64, 64]} />
        <meshStandardMaterial
          color={heaven.color}
          transparent
          opacity={isSelected ? 0.9 : 0.7}
          metalness={0.3}
          roughness={0.7}
          emissive={heaven.color}
          emissiveIntensity={isSelected ? 0.4 : 0.15}
        />
      </mesh>
      
      {/* Inner glow */}
      <Sphere args={[heaven.radius * 0.7, 32, 32]}>
        <meshBasicMaterial color={heaven.color} transparent opacity={0.15} />
      </Sphere>
      
      {/* Label */}
      <Text
        position={[0, heaven.radius + 0.5, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="black"
      >
        {heaven.id.toUpperCase()}
      </Text>
    </group>
  );
}

// Floating scripture
function FloatingScripture({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <Text
        position={position}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {text}
      </Text>
    </Float>
  );
}

// Main scene content
function ObservatoryContent({ selectedHeaven, onSelectHeaven }: {
  selectedHeaven: string | null;
  onSelectHeaven: (id: string) => void;
}) {
  return (
    <>
      {/* Observatory props */}
      <Telescope position={[-4, 0, 4]} />
      <Telescope position={[4, 0, -3]} />
      <Orrery position={[0, 0.5, 5]} />
      <Orrery position={[-5, 0.5, -2]} />
      
      {/* Star charts on walls */}
      <StarChart position={[-5.9, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <StarChart position={[5.9, 2.5, -2]} rotation={[0, -Math.PI / 2, 0]} />
      <StarChart position={[0, 2.5, -5.9]} rotation={[0, 0, 0]} />
      
      {/* Heaven orbs */}
      {THREE_HEAVENS_DATA.map((heaven) => (
        <HeavenOrb
          key={heaven.id}
          heaven={heaven}
          isSelected={selectedHeaven === heaven.id}
          onClick={() => onSelectHeaven(heaven.id)}
        />
      ))}
      
      {/* Floating scriptures */}
      <FloatingScripture position={[-6, 4.5, 0]} text="Isaiah 65:17" />
      <FloatingScripture position={[0, 5, 0]} text="Hebrews 12:28" />
      <FloatingScripture position={[6, 4.5, 0]} text="Revelation 21:1" />
      
      {/* Cycle badges beneath orbs */}
      {THREE_HEAVENS_DATA.map((heaven) => (
        <group key={`cycles-${heaven.id}`} position={[heaven.position[0], -0.5, heaven.position[2]]}>
          {heaven.cycles.map((cycle, i) => (
            <Text
              key={cycle}
              position={[(i - (heaven.cycles.length - 1) / 2) * 0.8, 0, 0.5]}
              fontSize={0.15}
              color={heaven.color}
              anchorX="center"
            >
              {cycle}
            </Text>
          ))}
        </group>
      ))}
    </>
  );
}

// Main scene with room
function ThreeHeavensScene({ selectedHeaven, onSelectHeaven }: {
  selectedHeaven: string | null;
  onSelectHeaven: (id: string) => void;
}) {
  return (
    <>
      <PalaceRoom3D theme="observatory" width={12} depth={12}>
        <ObservatoryContent selectedHeaven={selectedHeaven} onSelectHeaven={onSelectHeaven} />
      </PalaceRoom3D>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={6}
        maxDistance={18}
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
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#9B59B6" />
    </mesh>
  );
}

interface ThreeHeavens3DViewerProps {
  onClose?: () => void;
}

export function ThreeHeavens3DViewer({ onClose }: ThreeHeavens3DViewerProps) {
  const [selectedHeaven, setSelectedHeaven] = useState<string | null>("2h");
  const selectedData = useMemo(
    () => THREE_HEAVENS_DATA.find((h) => h.id === selectedHeaven),
    [selectedHeaven]
  );
  
  const handlePrev = () => {
    const currentIndex = THREE_HEAVENS_DATA.findIndex((h) => h.id === selectedHeaven);
    const prevIndex = currentIndex <= 0 ? THREE_HEAVENS_DATA.length - 1 : currentIndex - 1;
    setSelectedHeaven(THREE_HEAVENS_DATA[prevIndex].id);
  };
  
  const handleNext = () => {
    const currentIndex = THREE_HEAVENS_DATA.findIndex((h) => h.id === selectedHeaven);
    const nextIndex = currentIndex >= THREE_HEAVENS_DATA.length - 1 ? 0 : currentIndex + 1;
    setSelectedHeaven(THREE_HEAVENS_DATA[nextIndex].id);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 rounded-xl overflow-hidden">
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
      
      <div className="absolute top-4 left-4 z-20">
        <h3 className="text-xl font-bold text-white drop-shadow-lg">
          🔭 Observatory of the Heavens
        </h3>
        <p className="text-sm text-white/70">Day of the LORD → New Heavens & Earth cycles</p>
      </div>
      
      <Canvas camera={{ position: [0, 4, 12], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <ThreeHeavensScene selectedHeaven={selectedHeaven} onSelectHeaven={setSelectedHeaven} />
        </Suspense>
      </Canvas>
      
      {selectedData && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] bg-background/90 backdrop-blur-md border-primary/30 z-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <div className="text-lg font-bold">{selectedData.name}</div>
                <div className="text-xs text-muted-foreground">{selectedData.subtitle}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-1 rounded-full mb-3" style={{ backgroundColor: selectedData.color }} />
            <p className="text-xs text-muted-foreground mb-2">{selectedData.period}</p>
            <p className="text-sm mb-3">{selectedData.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedData.cycles.map((cycle) => (
                <span
                  key={cycle}
                  className="px-2 py-1 rounded text-xs font-mono"
                  style={{ backgroundColor: selectedData.color + "33", color: selectedData.color }}
                >
                  {cycle}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Info className="h-3 w-3" />
              <span>{selectedData.scripture}</span>
            </div>
          </div>
        </Card>
      )}
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {THREE_HEAVENS_DATA.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHeaven(h.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedHeaven === h.id
                ? "bg-primary text-primary-foreground scale-110"
                : "bg-background/50 text-foreground/70 hover:bg-background/80"
            }`}
            style={{
              borderColor: h.color,
              borderWidth: selectedHeaven === h.id ? 2 : 1,
              borderStyle: "solid",
            }}
          >
            {h.id.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThreeHeavens3DViewer;
