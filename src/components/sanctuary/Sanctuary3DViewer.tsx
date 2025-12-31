import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text, 
  Environment, 
  PerspectiveCamera,
  Html,
  Float,
  Sparkles,
  MeshReflectorMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X, RotateCcw, Eye } from 'lucide-react';

// Sanctuary furniture data with positions along the path
const SANCTUARY_ITEMS = [
  {
    id: 'gate',
    name: 'Gate',
    position: [0, 0, 12] as [number, number, number],
    color: '#8B4513',
    meaning: 'Jesus is the Door (John 10:9)',
    gospel: 'Entry point: Only one way into salvation',
    reference: 'John 10:9',
    size: [4, 3, 0.3] as [number, number, number],
    type: 'gate'
  },
  {
    id: 'altar',
    name: 'Altar of Burnt Offering',
    position: [0, 0.5, 8] as [number, number, number],
    color: '#7C2D12',
    meaning: 'The Cross where Christ\'s blood was shed',
    gospel: 'We must come by way of the sacrifice',
    reference: 'Hebrews 13:10-12',
    size: [2.5, 1.5, 2.5] as [number, number, number],
    type: 'altar'
  },
  {
    id: 'laver',
    name: 'Bronze Laver',
    position: [0, 0.3, 5] as [number, number, number],
    color: '#60A5FA',
    meaning: 'Baptism and cleansing by the Word',
    gospel: 'Washed clean by water and the Word',
    reference: 'Ephesians 5:26',
    size: [1.5, 1, 1.5] as [number, number, number],
    type: 'laver'
  },
  {
    id: 'lampstand',
    name: 'Golden Lampstand',
    position: [-2, 1, 0] as [number, number, number],
    color: '#FBBF24',
    meaning: 'Light of the Holy Spirit',
    gospel: 'The Spirit illuminates truth',
    reference: 'Revelation 1:20',
    size: [0.5, 2.5, 0.5] as [number, number, number],
    type: 'lampstand'
  },
  {
    id: 'table',
    name: 'Table of Showbread',
    position: [2, 0.6, 0] as [number, number, number],
    color: '#78350F',
    meaning: 'Christ, the Bread of Life',
    gospel: 'Fed by the Word made flesh',
    reference: 'John 6:35',
    size: [1.5, 0.8, 1] as [number, number, number],
    type: 'table'
  },
  {
    id: 'incense',
    name: 'Altar of Incense',
    position: [0, 0.8, -2] as [number, number, number],
    color: '#D97706',
    meaning: 'Christ\'s intercession and our prayers',
    gospel: 'Prayers rise with Christ\'s mediation',
    reference: 'Revelation 8:3-4',
    size: [0.8, 1.2, 0.8] as [number, number, number],
    type: 'incense'
  },
  {
    id: 'ark',
    name: 'Ark of the Covenant',
    position: [0, 0.5, -6] as [number, number, number],
    color: '#1D4ED8',
    meaning: 'God\'s throne, law, and mercy seat',
    gospel: 'Law met by mercy through Christ\'s blood',
    reference: 'Hebrews 9:4-5',
    size: [2, 1.5, 1.2] as [number, number, number],
    type: 'ark'
  }
];

// Animated fire particles for altar
function FireParticles({ position }: { position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group position={position}>
      <Sparkles 
        count={30}
        scale={[2, 2, 2]}
        size={3}
        speed={0.4}
        color="#FF6B35"
      />
      <pointLight color="#FF6B35" intensity={2} distance={5} />
    </group>
  );
}

// Glowing effect for holy items
function GlowEffect({ color, intensity = 1 }: { color: string; intensity?: number }) {
  return (
    <pointLight color={color} intensity={intensity} distance={3} />
  );
}

// Individual sanctuary furniture piece
function SanctuaryItem({ 
  item, 
  isSelected, 
  onClick 
}: { 
  item: typeof SANCTUARY_ITEMS[0];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current && (isSelected || hovered)) {
      meshRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const getGeometry = () => {
    switch (item.type) {
      case 'gate':
        return (
          <group>
            {/* Gate posts */}
            <mesh position={[-1.8, 1.5, 0]}>
              <boxGeometry args={[0.3, 3, 0.3]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            <mesh position={[1.8, 1.5, 0]}>
              <boxGeometry args={[0.3, 3, 0.3]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Gate top */}
            <mesh position={[0, 3, 0]}>
              <boxGeometry args={[4, 0.3, 0.3]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
            {/* Gate curtain */}
            <mesh position={[0, 1.5, 0]}>
              <planeGeometry args={[3.3, 2.8]} />
              <meshStandardMaterial color="#4338CA" side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>
          </group>
        );
      case 'altar':
        return (
          <group>
            <mesh>
              <boxGeometry args={item.size} />
              <meshStandardMaterial color={item.color} metalness={0.3} roughness={0.7} />
            </mesh>
            {/* Four horns */}
            {[[-1, 0.75, -1], [1, 0.75, -1], [-1, 0.75, 1], [1, 0.75, 1]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <coneGeometry args={[0.15, 0.4, 4]} />
                <meshStandardMaterial color={item.color} />
              </mesh>
            ))}
            <FireParticles position={[0, 1.2, 0]} />
          </group>
        );
      case 'laver':
        return (
          <group>
            {/* Basin */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.8, 0.6, 0.6, 32]} />
              <meshStandardMaterial color="#B87333" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Water */}
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
              <meshStandardMaterial color="#3B82F6" transparent opacity={0.7} metalness={0.1} roughness={0.1} />
            </mesh>
            {/* Base */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.5, 0.4, 32]} />
              <meshStandardMaterial color="#B87333" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      case 'lampstand':
        return (
          <group>
            {/* Central stem */}
            <mesh>
              <cylinderGeometry args={[0.08, 0.12, 2, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Branches - 7 lamps */}
            {[-0.6, -0.3, 0, 0.3, 0.6].map((x, i) => (
              <group key={i}>
                <mesh position={[x, 1, 0]}>
                  <sphereGeometry args={[0.12, 16, 16]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} emissive="#FBBF24" emissiveIntensity={0.5} />
                </mesh>
                {i !== 2 && (
                  <mesh position={[x / 2, 0.5 + Math.abs(x) * 0.5, 0]} rotation={[0, 0, x > 0 ? -0.5 : 0.5]}>
                    <cylinderGeometry args={[0.03, 0.03, Math.abs(x) * 1.5, 8]} />
                    <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                  </mesh>
                )}
              </group>
            ))}
            <GlowEffect color="#FBBF24" intensity={2} />
          </group>
        );
      case 'table':
        return (
          <group>
            {/* Table top */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[1.5, 0.1, 0.8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Legs */}
            {[[-0.6, 0, -0.3], [0.6, 0, -0.3], [-0.6, 0, 0.3], [0.6, 0, 0.3]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Bread loaves */}
            {[[-0.4, 0.55, 0], [0, 0.55, 0], [0.4, 0.55, 0]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <capsuleGeometry args={[0.12, 0.2, 4, 8]} />
                <meshStandardMaterial color="#DEB887" />
              </mesh>
            ))}
          </group>
        );
      case 'incense':
        return (
          <group>
            <mesh>
              <boxGeometry args={[0.8, 1, 0.8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Horns */}
            {[[-0.35, 0.5, -0.35], [0.35, 0.5, -0.35], [-0.35, 0.5, 0.35], [0.35, 0.5, 0.35]].map((pos, i) => (
              <mesh key={i} position={pos as [number, number, number]}>
                <coneGeometry args={[0.08, 0.25, 4]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
              </mesh>
            ))}
            {/* Smoke/incense rising */}
            <Sparkles 
              count={20}
              scale={[0.5, 2, 0.5]}
              position={[0, 1.5, 0]}
              size={1.5}
              speed={0.2}
              color="#E5E7EB"
            />
          </group>
        );
      case 'ark':
        return (
          <group>
            {/* Ark box */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 1.2, 1.2]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Mercy seat */}
            <mesh position={[0, 0.7, 0]}>
              <boxGeometry args={[2.2, 0.15, 1.4]} />
              <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Cherubim (simplified) */}
            {[[-0.7, 1.2, 0], [0.7, 1.2, 0]].map((pos, i) => (
              <group key={i} position={pos as [number, number, number]}>
                <mesh>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Wings */}
                <mesh position={[i === 0 ? 0.3 : -0.3, 0, 0]} rotation={[0, i === 0 ? 0.5 : -0.5, 0]}>
                  <planeGeometry args={[0.5, 0.8]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} side={THREE.DoubleSide} />
                </mesh>
              </group>
            ))}
            {/* Shekinah glory */}
            <pointLight color="#FFFFFF" intensity={3} distance={8} position={[0, 2, 0]} />
            <Sparkles 
              count={50}
              scale={[3, 3, 3]}
              position={[0, 1.5, 0]}
              size={2}
              speed={0.3}
              color="#FFFFFF"
            />
          </group>
        );
      default:
        return (
          <mesh>
            <boxGeometry args={item.size} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        );
    }
  };

  return (
    <Float 
      speed={isSelected ? 2 : 0} 
      rotationIntensity={isSelected ? 0.1 : 0}
      floatIntensity={isSelected ? 0.3 : 0}
    >
      <group 
        ref={meshRef as any}
        position={item.position}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getGeometry()}
        
        {/* Label */}
        <Html position={[0, item.type === 'lampstand' ? 2.5 : 2, 0]} center>
          <div 
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer
              ${isSelected 
                ? 'bg-primary text-primary-foreground scale-110' 
                : hovered 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'bg-background/80 text-foreground border border-border'
              }`}
            style={{ transform: 'translateY(-50%)' }}
          >
            {item.name}
          </div>
        </Html>
        
        {/* Selection ring */}
        {isSelected && (
          <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.8, 32]} />
            <meshBasicMaterial color="#3B82F6" transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Tabernacle structure (walls/curtains)
function TabernacleStructure() {
  return (
    <group>
      {/* Outer Court fence */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[12, 2.5, 20]} />
        <meshStandardMaterial color="#F5F5DC" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>
      
      {/* Outer Court fence posts */}
      {Array.from({ length: 21 }).map((_, i) => (
        <group key={`post-${i}`}>
          {/* Left side */}
          <mesh position={[-6, 1.25, -10 + i]}>
            <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
            <meshStandardMaterial color="#B87333" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Right side */}
          <mesh position={[6, 1.25, -10 + i]}>
            <cylinderGeometry args={[0.08, 0.08, 2.5, 8]} />
            <meshStandardMaterial color="#B87333" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}
      
      {/* Linen curtains */}
      <mesh position={[-6, 1.25, 0]}>
        <planeGeometry args={[0.1, 2.5, 1, 20]} />
        <meshStandardMaterial color="#F5F5DC" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh position={[6, 1.25, 0]}>
        <planeGeometry args={[0.1, 2.5, 1, 20]} />
        <meshStandardMaterial color="#F5F5DC" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      
      {/* Holy Place structure */}
      <mesh position={[0, 2, -1]}>
        <boxGeometry args={[6, 4, 8]} />
        <meshStandardMaterial color="#8B4513" transparent opacity={0.3} side={THREE.BackSide} />
      </mesh>
      
      {/* Veil between Holy and Most Holy */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[5.8, 3.8]} />
        <meshStandardMaterial color="#4338CA" side={THREE.DoubleSide} transparent opacity={0.9} />
      </mesh>
      
      {/* Zone labels */}
      <Text
        position={[0, 0.1, 8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="#92400E"
        anchorX="center"
      >
        OUTER COURT
      </Text>
      <Text
        position={[0, 0.1, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#D97706"
        anchorX="center"
      >
        HOLY PLACE
      </Text>
      <Text
        position={[0, 0.1, -6]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#1D4ED8"
        anchorX="center"
      >
        MOST HOLY PLACE
      </Text>
    </group>
  );
}

// Ground with path
function Ground() {
  return (
    <group>
      {/* Sandy ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 40]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>
      
      {/* Path stones */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh key={i} position={[0, 0.01, 10 - i * 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 8]} />
          <meshStandardMaterial color="#A0A0A0" />
        </mesh>
      ))}
    </group>
  );
}

// Camera controller for guided tour
function CameraController({ 
  targetPosition,
  lookAtPosition 
}: { 
  targetPosition: [number, number, number];
  lookAtPosition: [number, number, number];
}) {
  const { camera } = useThree();
  
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.02);
    const lookAt = new THREE.Vector3(...lookAtPosition);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.add(camera.position);
    currentLookAt.lerp(lookAt, 0.02);
  });
  
  return null;
}

// Main 3D Scene
function SanctuaryScene({ 
  selectedItem, 
  onSelectItem,
  tourMode,
  tourIndex
}: {
  selectedItem: string | null;
  onSelectItem: (id: string | null) => void;
  tourMode: boolean;
  tourIndex: number;
}) {
  const getCameraPosition = (): [number, number, number] => {
    if (tourMode && SANCTUARY_ITEMS[tourIndex]) {
      const item = SANCTUARY_ITEMS[tourIndex];
      return [item.position[0] + 3, item.position[1] + 2, item.position[2] + 4];
    }
    if (selectedItem) {
      const item = SANCTUARY_ITEMS.find(i => i.id === selectedItem);
      if (item) {
        return [item.position[0] + 3, item.position[1] + 2, item.position[2] + 4];
      }
    }
    return [8, 12, 18];
  };

  const getLookAtPosition = (): [number, number, number] => {
    if (tourMode && SANCTUARY_ITEMS[tourIndex]) {
      return SANCTUARY_ITEMS[tourIndex].position;
    }
    if (selectedItem) {
      const item = SANCTUARY_ITEMS.find(i => i.id === selectedItem);
      if (item) return item.position;
    }
    return [0, 0, 0];
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[8, 12, 18]} fov={50} />
      <CameraController 
        targetPosition={getCameraPosition()} 
        lookAtPosition={getLookAtPosition()}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} color="#FEF3C7" />
      
      {/* Sky */}
      <color attach="background" args={['#87CEEB']} />
      <fog attach="fog" args={['#87CEEB', 30, 60]} />
      
      {/* Scene elements */}
      <Ground />
      <TabernacleStructure />
      
      {/* Sanctuary items */}
      {SANCTUARY_ITEMS.map((item) => (
        <SanctuaryItem
          key={item.id}
          item={item}
          isSelected={selectedItem === item.id || (tourMode && SANCTUARY_ITEMS[tourIndex]?.id === item.id)}
          onClick={() => onSelectItem(item.id)}
        />
      ))}
      
      {/* Controls */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}

// Info panel for selected item
function ItemInfoPanel({ 
  item, 
  onClose 
}: { 
  item: typeof SANCTUARY_ITEMS[0] | null;
  onClose: () => void;
}) {
  if (!item) return null;

  return (
    <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-bold text-primary">{item.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold text-muted-foreground">Meaning: </span>
            <span>{item.meaning}</span>
          </div>
          <div>
            <span className="font-semibold text-muted-foreground">Gospel Connection: </span>
            <span>{item.gospel}</span>
          </div>
          <div className="text-xs text-muted-foreground italic">
            📖 {item.reference}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export function Sanctuary3DViewer() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [tourMode, setTourMode] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const handleSelectItem = useCallback((id: string | null) => {
    if (tourMode) return;
    setSelectedItem(id);
  }, [tourMode]);

  const startTour = () => {
    setTourMode(true);
    setTourIndex(0);
    setSelectedItem(null);
  };

  const stopTour = () => {
    setTourMode(false);
    setTourIndex(0);
  };

  const nextTourItem = () => {
    if (tourIndex < SANCTUARY_ITEMS.length - 1) {
      setTourIndex(tourIndex + 1);
    } else {
      stopTour();
    }
  };

  const prevTourItem = () => {
    if (tourIndex > 0) {
      setTourIndex(tourIndex - 1);
    }
  };

  const currentTourItem = tourMode ? SANCTUARY_ITEMS[tourIndex] : null;
  const selectedItemData = selectedItem 
    ? SANCTUARY_ITEMS.find(i => i.id === selectedItem) 
    : null;

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-xl overflow-hidden border bg-gradient-to-b from-sky-100 to-sky-200">
      {/* Controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {!tourMode ? (
          <Button onClick={startTour} variant="secondary" size="sm" className="shadow-lg">
            <Eye className="h-4 w-4 mr-2" />
            Guided Tour
          </Button>
        ) : (
          <Button onClick={stopTour} variant="secondary" size="sm" className="shadow-lg">
            <X className="h-4 w-4 mr-2" />
            Exit Tour
          </Button>
        )}
        <Button 
          onClick={() => { setSelectedItem(null); setTourIndex(0); }}
          variant="outline" 
          size="sm" 
          className="shadow-lg bg-background/80"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tour navigation */}
      {tourMode && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-background/90 rounded-lg px-3 py-2 shadow-lg">
          <Button 
            onClick={prevTourItem} 
            variant="ghost" 
            size="icon"
            disabled={tourIndex === 0}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[80px] text-center">
            {tourIndex + 1} / {SANCTUARY_ITEMS.length}
          </span>
          <Button 
            onClick={nextTourItem} 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows>
        <Suspense fallback={null}>
          <SanctuaryScene 
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            tourMode={tourMode}
            tourIndex={tourIndex}
          />
        </Suspense>
      </Canvas>

      {/* Info panel */}
      <ItemInfoPanel 
        item={currentTourItem || selectedItemData}
        onClose={() => tourMode ? stopTour() : setSelectedItem(null)}
      />

      {/* Instructions */}
      {!selectedItem && !tourMode && (
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-3 py-2 rounded-lg">
          🖱️ Click items to learn • Drag to rotate • Scroll to zoom
        </div>
      )}
    </div>
  );
}

export default Sanctuary3DViewer;
