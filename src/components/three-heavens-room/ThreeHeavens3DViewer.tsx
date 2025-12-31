import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, Sphere } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";

// Three Heavens data based on Phototheology
const THREE_HEAVENS_DATA = [
  {
    id: "1h",
    name: "First Heaven (1H)",
    subtitle: "DoL¹ → NE¹",
    period: "586 BC Babylon → Cyrusic Restoration",
    color: "#4A90A4",
    position: [0, -4, 0],
    radius: 3,
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
    position: [0, 0, 0],
    radius: 4,
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
    position: [0, 4, 0],
    radius: 5,
    description: "The third Day of the LORD is the final, universal judgment culminating in the literal New Heavens and New Earth—eternal creation.",
    keyEvent: "Second Coming → New Creation",
    scripture: "2 Peter 3, Revelation 21-22",
    cycles: ["@Re"],
  },
];

// Rotating heaven sphere
function HeavenSphere({ heaven, isSelected, onClick }: {
  heaven: typeof THREE_HEAVENS_DATA[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      // Slow rotation
      sphereRef.current.rotation.y += 0.002;
      
      // Pulse when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        sphereRef.current.scale.setScalar(scale);
      } else {
        sphereRef.current.scale.setScalar(1);
      }
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <group position={heaven.position as [number, number, number]}>
      {/* Outer glow ring when selected */}
      {isSelected && (
        <mesh ref={ringRef}>
          <torusGeometry args={[heaven.radius + 0.8, 0.1, 16, 100]} />
          <meshBasicMaterial color={heaven.color} transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Main sphere */}
      <mesh ref={sphereRef} onClick={onClick}>
        <sphereGeometry args={[heaven.radius, 64, 64]} />
        <meshStandardMaterial
          color={heaven.color}
          transparent
          opacity={isSelected ? 0.9 : 0.6}
          metalness={0.3}
          roughness={0.7}
          emissive={heaven.color}
          emissiveIntensity={isSelected ? 0.4 : 0.1}
        />
      </mesh>
      
      {/* Inner glow */}
      <Sphere args={[heaven.radius * 0.8, 32, 32]}>
        <meshBasicMaterial
          color={heaven.color}
          transparent
          opacity={0.2}
        />
      </Sphere>
      
      {/* Heaven label */}
      <Text
        position={[heaven.radius + 1.5, 0, 0]}
        fontSize={0.6}
        color="white"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {heaven.name}
      </Text>
      
      {/* Period text */}
      <Text
        position={[heaven.radius + 1.5, -0.7, 0]}
        fontSize={0.3}
        color="#aaaaaa"
        anchorX="left"
        anchorY="middle"
      >
        {heaven.subtitle}
      </Text>
    </group>
  );
}

// Connecting beam between heavens
function ConnectorBeam({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });
  
  const direction = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  const length = direction.length();
  const midpoint: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];
  
  return (
    <mesh ref={beamRef} position={midpoint} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, length, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Floating scripture reference
function FloatingScripture({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <Text
        position={position}
        fontSize={0.25}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {text}
      </Text>
    </Float>
  );
}

// Cycle badges floating around heavens
function CycleBadge({ position, cycle, color }: { position: [number, number, number]; cycle: string; color: string }) {
  const badgeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (badgeRef.current) {
      // Orbit around center
      const angle = state.clock.elapsedTime * 0.3 + position[0];
      badgeRef.current.position.x = Math.cos(angle) * 2 + position[0];
      badgeRef.current.position.z = Math.sin(angle) * 2;
    }
  });
  
  return (
    <group ref={badgeRef} position={position}>
      <mesh>
        <boxGeometry args={[1.2, 0.4, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {cycle}
      </Text>
    </group>
  );
}

// Main scene
function ThreeHeavensScene({ selectedHeaven, onSelectHeaven }: {
  selectedHeaven: string | null;
  onSelectHeaven: (id: string) => void;
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 10, 5]} intensity={0.5} color="#F39C12" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#9B59B6" />
      <pointLight position={[0, -10, 5]} intensity={0.5} color="#4A90A4" />
      
      {/* Stars background */}
      <Stars radius={150} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
      
      {/* Heaven spheres */}
      {THREE_HEAVENS_DATA.map((heaven) => (
        <HeavenSphere
          key={heaven.id}
          heaven={heaven}
          isSelected={selectedHeaven === heaven.id}
          onClick={() => onSelectHeaven(heaven.id)}
        />
      ))}
      
      {/* Connecting beams */}
      <ConnectorBeam
        from={[0, -4, 0]}
        to={[0, 0, 0]}
        color="#6B7A8C"
      />
      <ConnectorBeam
        from={[0, 0, 0]}
        to={[0, 4, 0]}
        color="#8B6B9C"
      />
      
      {/* Floating scriptures */}
      <FloatingScripture position={[-6, -4, 2]} text="Isaiah 65:17 - 'New heavens and new earth'" />
      <FloatingScripture position={[-6, 0, 2]} text="Hebrews 12:28 - 'Kingdom which cannot be moved'" />
      <FloatingScripture position={[-6, 4, 2]} text="Revelation 21:1 - 'I saw a new heaven'" />
      
      {/* Cycle badges */}
      {THREE_HEAVENS_DATA.map((heaven) =>
        heaven.cycles.map((cycle, i) => (
          <CycleBadge
            key={`${heaven.id}-${cycle}`}
            position={[
              heaven.position[0] - 3 - i * 0.5,
              heaven.position[1],
              heaven.position[2],
            ]}
            cycle={cycle}
            color={heaven.color}
          />
        ))
      )}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={40}
        target={[0, 0, 0]}
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
          ☁️ Three Heavens Framework
        </h3>
        <p className="text-sm text-white/70">Day of the LORD → New Heavens & Earth cycles</p>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [12, 2, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ThreeHeavensScene
            selectedHeaven={selectedHeaven}
            onSelectHeaven={setSelectedHeaven}
          />
        </Suspense>
      </Canvas>
      
      {/* Info panel */}
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
            <div
              className="h-1 rounded-full mb-3"
              style={{ backgroundColor: selectedData.color }}
            />
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
      
      {/* Heaven selector */}
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
