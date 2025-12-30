import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Box,
  Plane,
  Cylinder,
  Sphere,
  Float,
  Stars
} from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { palaceFloors as floors } from "@/data/palaceData";
import { ChevronUp, ChevronDown, Home, Info } from "lucide-react";

// Floor color schemes
const floorColors: Record<number, { primary: string; secondary: string; accent: string }> = {
  1: { primary: "#8B4513", secondary: "#D2691E", accent: "#FFD700" }, // Earth/Foundation
  2: { primary: "#2E4057", secondary: "#048A81", accent: "#54C6EB" }, // Investigation Blue
  3: { primary: "#6B4423", secondary: "#8B6914", accent: "#DAA520" }, // Freestyle Gold
  4: { primary: "#4A0E4E", secondary: "#8E44AD", accent: "#E056FD" }, // Deep Purple
  5: { primary: "#1A5276", secondary: "#2980B9", accent: "#5DADE2" }, // Prophecy Blue
  6: { primary: "#0E6251", secondary: "#1ABC9C", accent: "#76D7C4" }, // Heavenly Teal
  7: { primary: "#B03A2E", secondary: "#E74C3C", accent: "#F5B7B1" }, // Fire Red
  8: { primary: "#1C2833", secondary: "#34495E", accent: "#85929E" }, // Master Gray
};

// Floor names for labels
const floorNames: Record<number, string> = {
  1: "Furnishing",
  2: "Investigation",
  3: "Freestyle",
  4: "Next Level",
  5: "Vision",
  6: "Three Heavens",
  7: "Spiritual",
  8: "Master",
};

interface RoomDoorProps {
  position: [number, number, number];
  room: {
    id: string;
    name: string;
    tag: string;
  };
  floorNumber: number;
  isUnlocked: boolean;
  onClick: () => void;
}

function RoomDoor({ position, room, floorNumber, isUnlocked, onClick }: RoomDoorProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const colors = floorColors[floorNumber];

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    } else if (meshRef.current) {
      meshRef.current.scale.y = 1;
    }
  });

  return (
    <group position={position}>
      {/* Door frame */}
      <Box args={[1.2, 2.4, 0.3]} position={[0, 1.2, -0.15]}>
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
      </Box>

      {/* Door */}
      <Box
        ref={meshRef}
        args={[1, 2.2, 0.2]}
        position={[0, 1.1, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <meshStandardMaterial
          color={hovered ? colors.accent : (isUnlocked ? colors.secondary : "#555")}
          roughness={0.5}
          emissive={hovered ? colors.accent : "#000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </Box>

      {/* Door handle */}
      <Sphere args={[0.08, 16, 16]} position={[0.35, 1.1, 0.15]}>
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </Sphere>

      {/* Room tag */}
      <Text
        position={[0, 2.0, 0.15]}
        fontSize={0.25}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {room.tag}
      </Text>

      {/* Hover info */}
      {hovered && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black/90 text-white px-4 py-2 rounded-lg shadow-xl border border-white/20 min-w-[150px] text-center">
            <p className="font-bold text-sm">{room.name}</p>
            <p className="text-xs text-gray-400 mt-1">Floor {floorNumber} - {floorNames[floorNumber]}</p>
            {!isUnlocked && <p className="text-xs text-red-400 mt-1">🔒 Locked</p>}
          </div>
        </Html>
      )}

      {/* Lock indicator */}
      {!isUnlocked && (
        <Sphere args={[0.15, 16, 16]} position={[0, 0.5, 0.2]}>
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </Sphere>
      )}

      {/* Glow for unlocked */}
      {isUnlocked && (
        <pointLight position={[0, 1, 0.5]} color={colors.accent} intensity={0.3} distance={2} />
      )}
    </group>
  );
}

interface FloorPlatformProps {
  floorNumber: number;
  yPosition: number;
  rooms: Array<{ id: string; name: string; tag: string }>;
  onRoomClick: (roomId: string) => void;
  unlockedRooms: Set<string>;
}

function FloorPlatform({ floorNumber, yPosition, rooms, onRoomClick, unlockedRooms }: FloorPlatformProps) {
  const colors = floorColors[floorNumber];
  const roomsPerRow = 5;
  const spacing = 2.5;

  // Calculate room positions in a grid
  const roomPositions = useMemo(() => {
    return rooms.map((room, index) => {
      const row = Math.floor(index / roomsPerRow);
      const col = index % roomsPerRow;
      const x = (col - (Math.min(rooms.length, roomsPerRow) - 1) / 2) * spacing;
      const z = -row * spacing - 2;
      return { room, position: [x, 0, z] as [number, number, number] };
    });
  }, [rooms]);

  const platformWidth = Math.max(roomsPerRow * spacing + 4, 16);
  const platformDepth = Math.ceil(rooms.length / roomsPerRow) * spacing + 6;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Floor platform */}
      <Box args={[platformWidth, 0.5, platformDepth]} position={[0, -0.25, -platformDepth / 2 + 2]}>
        <meshStandardMaterial color={colors.primary} roughness={0.8} />
      </Box>

      {/* Floor edge trim */}
      <Box args={[platformWidth + 0.4, 0.3, 0.3]} position={[0, 0.15, 2]}>
        <meshStandardMaterial color={colors.secondary} roughness={0.5} />
      </Box>

      {/* Floor number pillar */}
      <group position={[-platformWidth / 2 - 1, 0, 0]}>
        <Cylinder args={[0.4, 0.5, 3, 8]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color={colors.secondary} roughness={0.6} />
        </Cylinder>
        <Text
          position={[0, 2.5, 0.5]}
          fontSize={0.6}
          color={colors.accent}
          anchorX="center"
          anchorY="middle"
        >
          {floorNumber}
        </Text>
      </group>

      {/* Floor name */}
      <Text
        position={[0, 0.5, 3]}
        fontSize={0.5}
        color={colors.accent}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 6, 0, 0]}
      >
        {floorNames[floorNumber]}
      </Text>

      {/* Room doors */}
      {roomPositions.map(({ room, position }) => (
        <RoomDoor
          key={room.id}
          position={position}
          room={room}
          floorNumber={floorNumber}
          isUnlocked={unlockedRooms.has(room.id)}
          onClick={() => onRoomClick(room.id)}
        />
      ))}

      {/* Ambient floor light */}
      <pointLight position={[0, 4, 0]} color={colors.accent} intensity={0.5} distance={15} />
    </group>
  );
}

// Camera controller with floor focus
function CameraController({ targetFloor }: { targetFloor: number }) {
  const { camera } = useThree();
  const targetY = useRef((targetFloor - 1) * 8);

  useEffect(() => {
    targetY.current = (targetFloor - 1) * 8 + 4;
  }, [targetFloor]);

  useFrame(() => {
    // Smoothly move camera Y to target floor
    const currentY = camera.position.y;
    const diff = targetY.current - currentY;
    if (Math.abs(diff) > 0.1) {
      camera.position.y += diff * 0.05;
    }
  });

  return null;
}

interface Palace3DViewerProps {
  unlockedRooms?: Set<string>;
  onClose?: () => void;
}

export function Palace3DViewer({ unlockedRooms = new Set(), onClose }: Palace3DViewerProps) {
  const navigate = useNavigate();
  const [currentFloor, setCurrentFloor] = useState(1);
  const [showHelp, setShowHelp] = useState(true);

  // Auto-hide help after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRoomClick = (roomId: string) => {
    // Navigate to room detail
    const floor = floors.find(f => f.rooms.some(r => r.id === roomId));
    if (floor) {
      navigate(`/palace/floor/${floor.number}/room/${roomId}`);
    }
  };

  const floorSpacing = 8;

  return (
    <div className="relative w-full h-full min-h-[600px] bg-slate-900 rounded-lg overflow-hidden">
      {/* Floor navigation UI */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="bg-black/50 border-white/30 text-white hover:bg-black/70"
        >
          <Home className="h-4 w-4 mr-2" /> Exit 3D
        </Button>
      </div>

      {/* Floor selector */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 bg-black/50 rounded-lg p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFloor(Math.min(8, currentFloor + 1))}
          disabled={currentFloor >= 8}
          className="text-white hover:bg-white/20"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>

        <div className="flex flex-col gap-1">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(floor => (
            <button
              key={floor}
              onClick={() => setCurrentFloor(floor)}
              className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                currentFloor === floor
                  ? 'bg-purple-600 text-white scale-110'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              {floor}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentFloor(Math.max(1, currentFloor - 1))}
          disabled={currentFloor <= 1}
          className="text-white hover:bg-white/20"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      </div>

      {/* Current floor info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Badge className="bg-black/70 text-white text-lg px-4 py-2">
          Floor {currentFloor}: {floorNames[currentFloor]}
        </Badge>
      </div>

      {/* Help tooltip */}
      {showHelp && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 bg-black/80 text-white px-4 py-3 rounded-lg max-w-xs text-center">
          <p className="text-sm">Drag to look around • Scroll to zoom</p>
          <p className="text-sm">Click room doors to enter • Use floor buttons to navigate</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(false)}
            className="mt-2 text-xs text-gray-400"
          >
            Got it
          </Button>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows camera={{ fov: 60, position: [15, 8, 20] }}>
        <Suspense fallback={null}>
          <CameraController targetFloor={currentFloor} />

          {/* Sky/background */}
          <color attach="background" args={["#0a0a1a"]} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

          {/* Ambient lighting */}
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 50, 10]} intensity={0.5} castShadow />

          {/* Palace floors */}
          {floors.map((floor) => (
            <FloorPlatform
              key={floor.number}
              floorNumber={floor.number}
              yPosition={(floor.number - 1) * floorSpacing}
              rooms={floor.rooms.map(r => ({ id: r.id, name: r.name, tag: r.tag }))}
              onRoomClick={handleRoomClick}
              unlockedRooms={unlockedRooms}
            />
          ))}

          {/* Central pillar connecting floors */}
          <Cylinder args={[0.5, 0.5, 8 * floorSpacing, 16]} position={[8, 4 * floorSpacing - 4, -5]}>
            <meshStandardMaterial color="#333" roughness={0.6} transparent opacity={0.5} />
          </Cylinder>

          {/* Camera controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={8}
            maxDistance={50}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, (currentFloor - 1) * floorSpacing + 2, -4]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
