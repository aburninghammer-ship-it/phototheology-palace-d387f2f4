import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PalaceRoomProps {
  theme?: 'library' | 'treasury' | 'oracle' | 'observatory' | 'gallery' | 'sanctuary';
  width?: number;
  height?: number;
  depth?: number;
  children?: React.ReactNode;
}

// Color schemes for different room themes
const ROOM_THEMES = {
  library: {
    floor: '#2d1f14',
    walls: '#3d2817',
    ceiling: '#1a1209',
    trim: '#5c4033',
    accent: '#DAA520',
    ambient: '#ffcc88',
  },
  treasury: {
    floor: '#1a1a2e',
    walls: '#16213e',
    ceiling: '#0f0f1a',
    trim: '#2a2a4a',
    accent: '#FFD700',
    ambient: '#ff6600',
  },
  oracle: {
    floor: '#1a1a2e',
    walls: '#1e1b4b',
    ceiling: '#0f0f1a',
    trim: '#312e81',
    accent: '#8b5cf6',
    ambient: '#4488ff',
  },
  observatory: {
    floor: '#0a0a1a',
    walls: '#0f172a',
    ceiling: '#000510',
    trim: '#1e3a5f',
    accent: '#00BFFF',
    ambient: '#334155',
  },
  gallery: {
    floor: '#f5f5dc',
    walls: '#e8e4d4',
    ceiling: '#fafaf5',
    trim: '#8B4513',
    accent: '#DAA520',
    ambient: '#fffbeb',
  },
  sanctuary: {
    floor: '#1a1209',
    walls: '#2d1f14',
    ceiling: '#0f0a05',
    trim: '#DAA520',
    accent: '#FFD700',
    ambient: '#ffd700',
  },
};

// Ornate pillar component
function OrnamentPillar({ position, height = 8, color }: { 
  position: [number, number, number]; 
  height?: number;
  color: string;
}) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Column */}
      <mesh position={[0, height / 2 + 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, height, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height + 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

// Torch/sconce component
function WallSconce({ position, color = '#ff6600' }: { 
  position: [number, number, number];
  color?: string;
}) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Flickering effect
      lightRef.current.intensity = 0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Bracket */}
      <mesh>
        <boxGeometry args={[0.15, 0.3, 0.1]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Torch holder */}
      <mesh position={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.08, 0.06, 0.2, 8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.15, 0.2]}
        intensity={1}
        distance={8}
        color={color}
        castShadow
      />
    </group>
  );
}

// Chandelier component
function Chandelier({ position, color = '#ffcc88' }: { 
  position: [number, number, number];
  color?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle swaying
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Chain */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Main ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.08, 8, 32]} />
        <meshStandardMaterial color="#DAA520" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Candle holders */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
              <meshStandardMaterial color="#f5f5dc" />
            </mesh>
            <pointLight
              position={[0, 0.4, 0]}
              intensity={0.3}
              distance={5}
              color={color}
            />
          </group>
        );
      })}
      {/* Central light */}
      <pointLight position={[0, 0, 0]} intensity={0.5} distance={15} color={color} />
    </group>
  );
}

// Decorative arch for doorways
function Archway({ position, rotation = [0, 0, 0], width = 3, height = 5 }: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left pillar */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[width / 2, height / 2, 0]} castShadow>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width + 0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Main palace room component
export function PalaceRoom3D({ 
  theme = 'library', 
  width = 40, 
  height = 12, 
  depth = 30,
  children 
}: PalaceRoomProps) {
  const colors = ROOM_THEMES[theme];

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.floor} roughness={0.9} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={colors.walls} roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={colors.walls} roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={colors.walls} roughness={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={colors.ceiling} />
      </mesh>

      {/* Floor trim */}
      {[
        [0, 0.05, -depth / 2 + 0.1],
        [-width / 2 + 0.1, 0.05, 0],
        [width / 2 - 0.1, 0.05, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={i === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]}>
          <boxGeometry args={[i === 0 ? width : depth, 0.1, 0.2]} />
          <meshStandardMaterial color={colors.trim} roughness={0.7} />
        </mesh>
      ))}

      {/* Corner pillars */}
      {[
        [-width / 2 + 1, 0, -depth / 2 + 1],
        [width / 2 - 1, 0, -depth / 2 + 1],
      ].map((pos, i) => (
        <OrnamentPillar key={i} position={pos as [number, number, number]} height={height - 1} color={colors.trim} />
      ))}

      {/* Wall sconces */}
      {[
        [-width / 2 + 0.1, height * 0.6, -depth / 4],
        [-width / 2 + 0.1, height * 0.6, depth / 4],
        [width / 2 - 0.1, height * 0.6, -depth / 4],
        [width / 2 - 0.1, height * 0.6, depth / 4],
      ].map((pos, i) => (
        <WallSconce key={i} position={pos as [number, number, number]} color={colors.ambient} />
      ))}

      {/* Central chandelier */}
      <Chandelier position={[0, height - 0.5, 0]} color={colors.ambient} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.2} color={colors.ambient} />

      {/* Room contents */}
      {children}
    </group>
  );
}

// Export sub-components for custom use
export { OrnamentPillar, WallSconce, Chandelier, Archway, ROOM_THEMES };
