import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Float, Stars, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ChevronLeft, ChevronRight, Info } from "lucide-react";

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

// Category colors
const CATEGORY_COLORS: Record<string, string> = {
  "Christ Types": "#E74C3C",
  "Truth & Spirit": "#3498DB",
  "Sanctuary": "#9B59B6",
  "Victory": "#F39C12",
  "Warfare": "#1ABC9C",
};

// Floating symbol orb
function SymbolOrb({ symbol, position, isSelected, onClick }: {
  symbol: typeof BIBLICAL_SYMBOLS[0];
  position: [number, number, number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (orbRef.current) {
      // Gentle floating
      orbRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      
      // Slow rotation
      orbRef.current.rotation.y += 0.005;
      
      // Pulse when selected
      if (isSelected && glowRef.current) {
        const scale = 1.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        glowRef.current.scale.setScalar(scale);
      }
    }
  });
  
  return (
    <group position={position}>
      {/* Selection glow */}
      {isSelected && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshBasicMaterial
            color={symbol.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Main orb */}
      <mesh ref={orbRef} onClick={onClick}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color={symbol.color}
          metalness={0.3}
          roughness={0.6}
          emissive={symbol.color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Symbol emoji */}
      <Text
        position={[0, 0, 1]}
        fontSize={0.6}
        anchorX="center"
        anchorY="middle"
      >
        {symbol.emoji}
      </Text>
      
      {/* Symbol name */}
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="black"
      >
        {symbol.name}
      </Text>
    </group>
  );
}

// Category platform
function CategoryPlatform({ category, position, color }: {
  category: string;
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.2, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <Text
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {category}
      </Text>
    </group>
  );
}

// Calculate symbol positions in a circular arrangement by category
function getSymbolPositions(): Map<string, [number, number, number]> {
  const positions = new Map<string, [number, number, number]>();
  const categories = [...new Set(BIBLICAL_SYMBOLS.map((s) => s.category))];
  
  categories.forEach((category, catIndex) => {
    const categorySymbols = BIBLICAL_SYMBOLS.filter((s) => s.category === category);
    const categoryAngle = (catIndex / categories.length) * Math.PI * 2;
    const categoryRadius = 8;
    const categoryX = Math.cos(categoryAngle) * categoryRadius;
    const categoryZ = Math.sin(categoryAngle) * categoryRadius;
    
    categorySymbols.forEach((symbol, symbolIndex) => {
      const symbolAngle = (symbolIndex / categorySymbols.length) * Math.PI * 2;
      const symbolRadius = 2;
      const x = categoryX + Math.cos(symbolAngle) * symbolRadius;
      const z = categoryZ + Math.sin(symbolAngle) * symbolRadius;
      positions.set(symbol.id, [x, 1, z]);
    });
  });
  
  return positions;
}

// Main scene
function SymbolsScene({ selectedSymbol, onSelectSymbol }: {
  selectedSymbol: string | null;
  onSelectSymbol: (id: string) => void;
}) {
  const positions = useMemo(() => getSymbolPositions(), []);
  const categories = [...new Set(BIBLICAL_SYMBOLS.map((s) => s.category))];
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#ffd700" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Category platforms */}
      {categories.map((category, index) => {
        const angle = (index / categories.length) * Math.PI * 2;
        const radius = 8;
        return (
          <CategoryPlatform
            key={category}
            category={category}
            position={[Math.cos(angle) * radius, -1, Math.sin(angle) * radius]}
            color={CATEGORY_COLORS[category] || "#888888"}
          />
        );
      })}
      
      {/* Symbol orbs */}
      {BIBLICAL_SYMBOLS.map((symbol) => (
        <SymbolOrb
          key={symbol.id}
          symbol={symbol}
          position={positions.get(symbol.id) || [0, 1, 0]}
          isSelected={selectedSymbol === symbol.id}
          onClick={() => onSelectSymbol(symbol.id)}
        />
      ))}
      
      {/* Central altar */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.5, 2, 1, 8]} />
        <meshStandardMaterial color="#4a3728" metalness={0.3} roughness={0.8} />
      </mesh>
      
      {/* Central light beam */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.1, 0.5, 6, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.3} />
      </mesh>
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.2}
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
          🔗 Biblical Symbols Gallery
        </h3>
        <p className="text-sm text-white/70">Click symbols to explore • Drag to rotate</p>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [12, 8, 12], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SymbolsScene
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
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
      
      {/* Category filter pills */}
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
