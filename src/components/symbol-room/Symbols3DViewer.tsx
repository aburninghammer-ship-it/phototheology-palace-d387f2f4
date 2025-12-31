import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { PalaceRoom3D } from "@/components/3d/PalaceRoom3D";

// Biblical symbols library
const BIBLICAL_SYMBOLS = [
  {
    id: "lamb",
    name: "Lamb",
    emoji: "🐑",
    meaning: "Christ as the sacrificial Lamb of God",
    scripture: "John 1:29, Revelation 5:6",
    color: "#FFFFFF",
    category: "Christ Types",
  },
  {
    id: "lion",
    name: "Lion",
    emoji: "🦁",
    meaning: "Christ as the conquering King, Lion of Judah",
    scripture: "Revelation 5:5, Genesis 49:9",
    color: "#D4A574",
    category: "Christ Types",
  },
  {
    id: "rock",
    name: "Rock",
    emoji: "🪨",
    meaning: "Christ as the foundation and living water source",
    scripture: "1 Corinthians 10:4, Matthew 16:18",
    color: "#8B7355",
    category: "Christ Types",
  },
  {
    id: "light",
    name: "Light",
    emoji: "💡",
    meaning: "Truth, Christ as the Light of the world",
    scripture: "John 8:12, Psalm 119:105",
    color: "#FFD700",
    category: "Truth & Spirit",
  },
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    meaning: "Holy Spirit, cleansing Word of God",
    scripture: "John 7:38, Ephesians 5:26",
    color: "#4A90D9",
    category: "Truth & Spirit",
  },
  {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    meaning: "God's presence, judgment, purification",
    scripture: "Hebrews 12:29, Acts 2:3",
    color: "#FF6B35",
    category: "Truth & Spirit",
  },
  {
    id: "bread",
    name: "Bread",
    emoji: "🍞",
    meaning: "Christ as Bread of Life, Word sustaining",
    scripture: "John 6:35, Matthew 4:4",
    color: "#DEB887",
    category: "Sanctuary",
  },
  {
    id: "vine",
    name: "Vine",
    emoji: "🍇",
    meaning: "Christ as source; believers as branches",
    scripture: "John 15:5, Isaiah 5:7",
    color: "#6B2D5C",
    category: "Christ Types",
  },
  {
    id: "door",
    name: "Door",
    emoji: "🚪",
    meaning: "Christ as the only way of salvation",
    scripture: "John 10:9, Revelation 3:20",
    color: "#8B4513",
    category: "Sanctuary",
  },
  {
    id: "shepherd",
    name: "Shepherd",
    emoji: "🧑‍🌾",
    meaning: "Christ as the Good Shepherd caring for His flock",
    scripture: "John 10:11, Psalm 23:1",
    color: "#228B22",
    category: "Christ Types",
  },
  {
    id: "crown",
    name: "Crown",
    emoji: "👑",
    meaning: "Victory, eternal reward, Christ's kingship",
    scripture: "Revelation 2:10, James 1:12",
    color: "#FFD700",
    category: "Victory",
  },
  {
    id: "sword",
    name: "Sword",
    emoji: "⚔️",
    meaning: "Word of God, spiritual warfare",
    scripture: "Ephesians 6:17, Hebrews 4:12",
    color: "#C0C0C0",
    category: "Warfare",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Christ Types": "#E74C3C",
  "Truth & Spirit": "#3498DB",
  "Sanctuary": "#9B59B6",
  "Victory": "#F39C12",
  "Warfare": "#1ABC9C",
};

// Painting frame on wall
function PaintingFrame({ position, rotation, symbol, isSelected, onClick }: {
  position: [number, number, number];
  rotation: [number, number, number];
  symbol: typeof BIBLICAL_SYMBOLS[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const frameRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (frameRef.current && isSelected) {
      // Subtle glow pulse
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      frameRef.current.scale.setScalar(scale);
    } else if (frameRef.current) {
      frameRef.current.scale.setScalar(1);
    }
  });
  
  return (
    <group ref={frameRef} position={position} rotation={rotation} onClick={onClick}>
      {/* Ornate frame */}
      <mesh>
        <boxGeometry args={[1.4, 1.8, 0.15]} />
        <meshStandardMaterial color={isSelected ? "#D4A574" : "#4a3728"} metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Inner frame detail */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.2, 1.6, 0.05]} />
        <meshStandardMaterial color="#2a1a0a" />
      </mesh>
      {/* Canvas background */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[1, 1.4]} />
        <meshStandardMaterial 
          color={CATEGORY_COLORS[symbol.category] || "#333333"} 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      {/* Symbol emoji */}
      <Text
        position={[0, 0.2, 0.1]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        {symbol.emoji}
      </Text>
      {/* Symbol name */}
      <Text
        position={[0, -0.4, 0.1]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="black"
      >
        {symbol.name}
      </Text>
      {/* Selection glow */}
      {isSelected && (
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[1.6, 2, 0.05]} />
          <meshBasicMaterial color={symbol.color} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}

// Gallery bench
function GalleryBench({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2, 0.1, 0.6]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.8, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#3a2718" />
      </mesh>
      <mesh position={[0.8, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.5]} />
        <meshStandardMaterial color="#3a2718" />
      </mesh>
    </group>
  );
}

// Sculpture pedestal with rotating symbol
function SymbolSculpture({ position, symbol, isSelected, onClick }: {
  position: [number, number, number];
  symbol: typeof BIBLICAL_SYMBOLS[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const sculptureRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (sculptureRef.current) {
      sculptureRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      if (isSelected) {
        sculptureRef.current.position.y = 1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        sculptureRef.current.position.y = 1.2;
      }
    }
  });
  
  return (
    <group position={position} onClick={onClick}>
      {/* Pedestal */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 16]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
      
      {/* Floating symbol orb */}
      <group ref={sculptureRef} position={[0, 1.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial 
            color={symbol.color} 
            metalness={0.4} 
            roughness={0.5}
            emissive={symbol.color}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text
          position={[0, 0, 0.45]}
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
        >
          {symbol.emoji}
        </Text>
      </group>
      
      {/* Spotlight from above */}
      <pointLight position={[0, 3, 0]} intensity={isSelected ? 0.8 : 0.3} color={symbol.color} distance={4} />
    </group>
  );
}

// Category label plaque
function CategoryPlaque({ position, category, color }: {
  position: [number, number, number];
  category: string;
  color: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} />
      </mesh>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {category}
      </Text>
    </group>
  );
}

// Calculate positions for wall paintings
function getWallPositions(): { symbol: typeof BIBLICAL_SYMBOLS[0]; position: [number, number, number]; rotation: [number, number, number] }[] {
  const positions: { symbol: typeof BIBLICAL_SYMBOLS[0]; position: [number, number, number]; rotation: [number, number, number] }[] = [];
  
  // Left wall paintings
  const leftWallSymbols = BIBLICAL_SYMBOLS.slice(0, 3);
  leftWallSymbols.forEach((symbol, i) => {
    positions.push({
      symbol,
      position: [-5.8, 2.5, -3 + i * 3],
      rotation: [0, Math.PI / 2, 0],
    });
  });
  
  // Right wall paintings
  const rightWallSymbols = BIBLICAL_SYMBOLS.slice(3, 6);
  rightWallSymbols.forEach((symbol, i) => {
    positions.push({
      symbol,
      position: [5.8, 2.5, -3 + i * 3],
      rotation: [0, -Math.PI / 2, 0],
    });
  });
  
  // Back wall paintings
  const backWallSymbols = BIBLICAL_SYMBOLS.slice(6, 9);
  backWallSymbols.forEach((symbol, i) => {
    positions.push({
      symbol,
      position: [-3 + i * 3, 2.5, -5.8],
      rotation: [0, 0, 0],
    });
  });
  
  return positions;
}

// Main gallery content
function GalleryContent({ selectedSymbol, onSelectSymbol }: {
  selectedSymbol: string | null;
  onSelectSymbol: (id: string) => void;
}) {
  const wallPaintings = useMemo(() => getWallPositions(), []);
  const centerSymbols = BIBLICAL_SYMBOLS.slice(9);
  
  return (
    <>
      {/* Wall paintings */}
      {wallPaintings.map(({ symbol, position, rotation }) => (
        <PaintingFrame
          key={symbol.id}
          symbol={symbol}
          position={position}
          rotation={rotation}
          isSelected={selectedSymbol === symbol.id}
          onClick={() => onSelectSymbol(symbol.id)}
        />
      ))}
      
      {/* Center sculptures */}
      {centerSymbols.map((symbol, i) => (
        <SymbolSculpture
          key={symbol.id}
          symbol={symbol}
          position={[(i - 1) * 3, 0, 2]}
          isSelected={selectedSymbol === symbol.id}
          onClick={() => onSelectSymbol(symbol.id)}
        />
      ))}
      
      {/* Gallery benches */}
      <GalleryBench position={[0, 0, 0]} />
      <GalleryBench position={[-3, 0, -2]} rotation={[0, Math.PI / 4, 0]} />
      <GalleryBench position={[3, 0, -2]} rotation={[0, -Math.PI / 4, 0]} />
      
      {/* Category plaques */}
      <CategoryPlaque position={[-5.8, 4.2, 0]} category="Christ Types" color={CATEGORY_COLORS["Christ Types"]} />
      <CategoryPlaque position={[5.8, 4.2, 0]} category="Truth & Spirit" color={CATEGORY_COLORS["Truth & Spirit"]} />
      <CategoryPlaque position={[0, 4.2, -5.8]} category="Sanctuary" color={CATEGORY_COLORS["Sanctuary"]} />
      
      {/* Floating descriptions */}
      {selectedSymbol && (
        <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
          <Text
            position={[0, 5, 0]}
            fontSize={0.2}
            color="#aaaaaa"
            anchorX="center"
            maxWidth={8}
          >
            {BIBLICAL_SYMBOLS.find(s => s.id === selectedSymbol)?.meaning || ""}
          </Text>
        </Float>
      )}
    </>
  );
}

// Main scene
function SymbolsScene({ selectedSymbol, onSelectSymbol }: {
  selectedSymbol: string | null;
  onSelectSymbol: (id: string) => void;
}) {
  return (
    <>
      <PalaceRoom3D theme="gallery" width={12} depth={12}>
        <GalleryContent selectedSymbol={selectedSymbol} onSelectSymbol={onSelectSymbol} />
      </PalaceRoom3D>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={16}
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
      <meshStandardMaterial color="#ffd700" />
    </mesh>
  );
}

interface Symbols3DViewerProps {
  onClose?: () => void;
}

export function Symbols3DViewer({ onClose }: Symbols3DViewerProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>("lamb");
  const selectedData = useMemo(
    () => BIBLICAL_SYMBOLS.find((s) => s.id === selectedSymbol),
    [selectedSymbol]
  );
  
  const handlePrev = () => {
    const currentIndex = BIBLICAL_SYMBOLS.findIndex((s) => s.id === selectedSymbol);
    const prevIndex = currentIndex <= 0 ? BIBLICAL_SYMBOLS.length - 1 : currentIndex - 1;
    setSelectedSymbol(BIBLICAL_SYMBOLS[prevIndex].id);
  };
  
  const handleNext = () => {
    const currentIndex = BIBLICAL_SYMBOLS.findIndex((s) => s.id === selectedSymbol);
    const nextIndex = currentIndex >= BIBLICAL_SYMBOLS.length - 1 ? 0 : currentIndex + 1;
    setSelectedSymbol(BIBLICAL_SYMBOLS[nextIndex].id);
  };

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-900 rounded-xl overflow-hidden">
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
          🖼️ Symbols Gallery
        </h3>
        <p className="text-sm text-white/70">Click paintings or sculptures to explore</p>
      </div>
      
      <Canvas camera={{ position: [0, 4, 10], fov: 50 }} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <SymbolsScene selectedSymbol={selectedSymbol} onSelectSymbol={setSelectedSymbol} />
        </Suspense>
      </Canvas>
      
      {selectedData && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background/90 backdrop-blur-md border-primary/30 z-20">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <span className="text-3xl mr-2">{selectedData.emoji}</span>
                <span className="text-xl font-bold">{selectedData.name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-center mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: CATEGORY_COLORS[selectedData.category] + "33",
                  color: CATEGORY_COLORS[selectedData.category],
                }}
              >
                {selectedData.category}
              </span>
            </div>
            <p className="text-sm mb-3">{selectedData.meaning}</p>
            <div className="flex items-center gap-2 text-xs text-primary">
              <Info className="h-3 w-3" />
              <span>{selectedData.scripture}</span>
            </div>
          </div>
        </Card>
      )}
      
      <div className="absolute top-16 left-4 flex flex-wrap gap-2 z-20 max-w-xs">
        {[...new Set(BIBLICAL_SYMBOLS.map((s) => s.category))].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              const firstInCategory = BIBLICAL_SYMBOLS.find((s) => s.category === cat);
              if (firstInCategory) setSelectedSymbol(firstInCategory.id);
            }}
            className="px-2 py-1 rounded text-xs font-medium bg-background/50 hover:bg-background/80 transition-all"
            style={{
              borderColor: CATEGORY_COLORS[cat],
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Symbols3DViewer;
