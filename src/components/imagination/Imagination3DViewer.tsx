import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Html,
  Float,
  Sparkles,
  Sky,
  Cloud,
  Stars
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, X, RotateCcw, Eye, Volume2, VolumeX } from 'lucide-react';

// Bible scenes for immersive experience
const BIBLE_SCENES = [
  {
    id: 'red-sea',
    name: 'Red Sea Crossing',
    reference: 'Exodus 14',
    description: 'Stand among the Israelites as the waters part',
    environment: 'sea',
    skyColor: '#1a365d',
    groundColor: '#c2b280',
    ambientColor: '#87CEEB',
    elements: ['water-walls', 'dry-path', 'pillar-fire', 'crowd'],
    prompts: [
      'Feel the sand beneath your feet - it was sea floor moments ago',
      'Hear the roar of water held back by invisible walls',
      'See the pillar of fire illuminating the path ahead',
      'Smell the salt air mixed with the scent of freedom'
    ],
    christConnection: 'Christ is the true Deliverer who parts the waters of death'
  },
  {
    id: 'garden-gethsemane',
    name: 'Garden of Gethsemane',
    reference: 'Matthew 26:36-46',
    description: 'Watch with Jesus in His darkest hour',
    environment: 'garden',
    skyColor: '#0f172a',
    groundColor: '#2d4a2d',
    ambientColor: '#334155',
    elements: ['olive-trees', 'moonlight', 'sleeping-disciples', 'praying-christ'],
    prompts: [
      'Feel the cool night air in the garden',
      'See the moonlight filtering through ancient olive branches',
      'Hear the distant sounds of the sleeping city',
      'Sense the weight of the world on Christ\'s shoulders'
    ],
    christConnection: 'Christ chose the cup of suffering for us'
  },
  {
    id: 'burning-bush',
    name: 'The Burning Bush',
    reference: 'Exodus 3:1-6',
    description: 'Remove your sandals - this is holy ground',
    environment: 'desert',
    skyColor: '#fed7aa',
    groundColor: '#a16207',
    ambientColor: '#fbbf24',
    elements: ['burning-bush', 'mountain', 'sheep', 'desert'],
    prompts: [
      'Feel the desert heat on your skin',
      'See the bush blazing but not consumed',
      'Hear the voice calling your name',
      'Remove your shoes - you stand on holy ground'
    ],
    christConnection: 'The I AM reveals Himself - Christ is the eternal I AM'
  },
  {
    id: 'fiery-furnace',
    name: 'The Fiery Furnace',
    reference: 'Daniel 3:19-27',
    description: 'Walk with the three Hebrews and the Fourth Man',
    environment: 'fire',
    skyColor: '#7c2d12',
    groundColor: '#1c1917',
    ambientColor: '#f97316',
    elements: ['furnace', 'flames', 'fourth-man', 'three-hebrews'],
    prompts: [
      'Feel the heat that should consume but doesn\'t',
      'See the flames dancing around you harmlessly',
      'Notice the Fourth Man walking beside you',
      'Breathe easily in what should be a tomb'
    ],
    christConnection: 'The Fourth Man is Christ - present in our trials'
  },
  {
    id: 'empty-tomb',
    name: 'The Empty Tomb',
    reference: 'John 20:1-18',
    description: 'Be the first to see the stone rolled away',
    environment: 'dawn',
    skyColor: '#fef3c7',
    groundColor: '#78716c',
    ambientColor: '#fcd34d',
    elements: ['tomb', 'stone', 'garden', 'morning-light'],
    prompts: [
      'Feel the dew on the grass in early morning',
      'See the first rays of light on resurrection morning',
      'Hear the birds singing a new song',
      'Approach the tomb expecting death, finding life'
    ],
    christConnection: 'He is risen! Death could not hold Him'
  },
  {
    id: 'pentecost',
    name: 'Day of Pentecost',
    reference: 'Acts 2:1-4',
    description: 'Receive the fire of the Holy Spirit',
    environment: 'room',
    skyColor: '#7c3aed',
    groundColor: '#44403c',
    ambientColor: '#a855f7',
    elements: ['upper-room', 'tongues-fire', 'disciples', 'wind'],
    prompts: [
      'Feel the rushing mighty wind filling the room',
      'See the tongues of fire resting on each person',
      'Hear the languages of all nations spoken',
      'Experience the power transforming fearful disciples'
    ],
    christConnection: 'Christ sends His Spirit to empower His church'
  }
];

// Camera controller for smooth transitions
function CameraController({ targetPosition, targetLookAt }: { 
  targetPosition: [number, number, number]; 
  targetLookAt: [number, number, number];
}) {
  const { camera } = useThree();
  const positionRef = useRef(new THREE.Vector3(...targetPosition));
  const lookAtRef = useRef(new THREE.Vector3(...targetLookAt));

  useEffect(() => {
    positionRef.current.set(...targetPosition);
    lookAtRef.current.set(...targetLookAt);
  }, [targetPosition, targetLookAt]);

  useFrame(() => {
    camera.position.lerp(positionRef.current, 0.02);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

// Water wall effect for Red Sea
function WaterWall({ position, side }: { position: [number, number, number]; side: 'left' | 'right' }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + (side === 'left' ? 0 : Math.PI)) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 8, 20]} />
      <meshStandardMaterial 
        color="#1e40af" 
        transparent 
        opacity={0.7}
        roughness={0.1}
      />
    </mesh>
  );
}

// Pillar of fire
function PillarFire({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Sparkles
        count={200}
        scale={[2, 15, 2]}
        size={6}
        speed={2}
        color="#ff6600"
      />
      <pointLight intensity={2} distance={30} color="#ff4400" />
    </group>
  );
}

// Olive tree
function OliveTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 3, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial color="#3d5a3d" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Burning bush
function BurningBush({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Bush */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color="#2d4a2d" roughness={0.8} />
      </mesh>
      {/* Fire effect */}
      <Sparkles
        count={150}
        scale={[3, 4, 3]}
        size={4}
        speed={1.5}
        color="#ff4400"
      />
      <pointLight intensity={3} distance={15} color="#ff6600" />
    </group>
  );
}

// Flame particles for furnace
function FurnaceFlames() {
  return (
    <group>
      <Sparkles
        count={500}
        scale={[15, 10, 15]}
        size={8}
        speed={3}
        color="#ff3300"
      />
      <Sparkles
        count={300}
        scale={[12, 8, 12]}
        size={5}
        speed={2}
        color="#ffaa00"
      />
      <pointLight position={[0, 5, 0]} intensity={5} distance={30} color="#ff4400" />
    </group>
  );
}

// Tomb structure
function Tomb({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Rock face */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 4, 3]} />
        <meshStandardMaterial color="#78716c" roughness={0.9} />
      </mesh>
      {/* Opening */}
      <mesh position={[0, 1.5, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
      {/* Rolled stone */}
      <mesh position={[2.5, 1, 1.5]} rotation={[Math.PI / 2, 0, 0.2]}>
        <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.8} />
      </mesh>
      {/* Light from inside */}
      <pointLight position={[0, 1.5, 0]} intensity={2} distance={10} color="#fef3c7" />
    </group>
  );
}

// Tongues of fire for Pentecost
function TongueOfFire({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <coneGeometry args={[0.2, 0.6, 4]} />
        <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={2} />
      </mesh>
      <pointLight intensity={0.5} distance={3} color="#ff6600" />
    </group>
  );
}

// Scene environment based on type
function SceneEnvironment({ scene }: { scene: typeof BIBLE_SCENES[0] }) {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={scene.groundColor} roughness={0.9} />
      </mesh>

      {/* Scene-specific elements */}
      {scene.id === 'red-sea' && (
        <>
          <WaterWall position={[-5, 4, 0]} side="left" />
          <WaterWall position={[5, 4, 0]} side="right" />
          <PillarFire position={[0, 0, -15]} />
        </>
      )}

      {scene.id === 'garden-gethsemane' && (
        <>
          <OliveTree position={[-4, 0, 2]} />
          <OliveTree position={[5, 0, -3]} />
          <OliveTree position={[-2, 0, -5]} />
          <Stars radius={100} depth={50} count={2000} factor={4} fade />
        </>
      )}

      {scene.id === 'burning-bush' && (
        <>
          <BurningBush position={[0, 0, -5]} />
          {/* Mountain backdrop */}
          <mesh position={[0, 10, -30]}>
            <coneGeometry args={[20, 25, 4]} />
            <meshStandardMaterial color="#7c2d12" roughness={0.9} />
          </mesh>
        </>
      )}

      {scene.id === 'fiery-furnace' && (
        <>
          <FurnaceFlames />
          {/* Furnace walls */}
          <mesh position={[-8, 5, 0]}>
            <boxGeometry args={[1, 10, 16]} />
            <meshStandardMaterial color="#1c1917" emissive="#7c2d12" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[8, 5, 0]}>
            <boxGeometry args={[1, 10, 16]} />
            <meshStandardMaterial color="#1c1917" emissive="#7c2d12" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}

      {scene.id === 'empty-tomb' && (
        <>
          <Tomb position={[0, 0, -5]} />
          {/* Garden elements */}
          <Float speed={1} rotationIntensity={0.1}>
            <mesh position={[-3, 0.5, 2]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#4ade80" />
            </mesh>
          </Float>
        </>
      )}

      {scene.id === 'pentecost' && (
        <>
          {/* Upper room walls */}
          <mesh position={[0, 3, -8]}>
            <boxGeometry args={[16, 6, 0.5]} />
            <meshStandardMaterial color="#44403c" />
          </mesh>
          <mesh position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[16, 6, 0.5]} />
            <meshStandardMaterial color="#44403c" />
          </mesh>
          {/* Tongues of fire */}
          {[[-2, 3, -2], [2, 3, -2], [0, 3, 2], [-3, 3, 0], [3, 3, 0]].map((pos, i) => (
            <TongueOfFire key={i} position={pos as [number, number, number]} />
          ))}
          <Sparkles count={100} scale={[10, 5, 10]} size={3} speed={5} color="#7c3aed" />
        </>
      )}

      {/* Ambient lighting based on scene */}
      <ambientLight intensity={0.3} color={scene.ambientColor} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
    </group>
  );
}

// Sensory prompt display
function SensoryPrompt({ prompts, currentIndex }: { prompts: string[]; currentIndex: number }) {
  return (
    <Html position={[0, 3, -3]} center>
      <div 
        className="bg-black/80 text-white p-6 rounded-xl max-w-md text-center backdrop-blur-sm border border-primary/30 max-h-[200px] overflow-y-auto"
        data-scrollable="true"
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <p className="text-lg italic leading-relaxed">
          "{prompts[currentIndex]}"
        </p>
        <div className="flex justify-center gap-1 mt-3">
          {prompts.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? 'bg-primary' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </Html>
  );
}

interface Imagination3DViewerProps {
  onClose?: () => void;
}

export function Imagination3DViewer({ onClose }: Imagination3DViewerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const currentScene = BIBLE_SCENES[currentSceneIndex];

  // Auto-cycle prompts
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const timer = setInterval(() => {
      setCurrentPromptIndex((prev) => 
        (prev + 1) % currentScene.prompts.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, currentScene.prompts.length]);

  const nextScene = useCallback(() => {
    setCurrentSceneIndex((prev) => (prev + 1) % BIBLE_SCENES.length);
    setCurrentPromptIndex(0);
  }, []);

  const prevScene = useCallback(() => {
    setCurrentSceneIndex((prev) => (prev - 1 + BIBLE_SCENES.length) % BIBLE_SCENES.length);
    setCurrentPromptIndex(0);
  }, []);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
          <CameraController 
            targetPosition={[0, 2, 10]} 
            targetLookAt={[0, 2, 0]} 
          />
          
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0.5}
            azimuth={0.25}
            rayleigh={currentScene.environment === 'night' ? 0 : 2}
          />
          
          <SceneEnvironment scene={currentScene} />
          <SensoryPrompt prompts={currentScene.prompts} currentIndex={currentPromptIndex} />
          
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={20}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
          />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <Card className="bg-background/90 backdrop-blur-sm pointer-events-auto">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg">{currentScene.name}</h3>
            <p className="text-sm text-muted-foreground">{currentScene.reference}</p>
          </CardContent>
        </Card>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="bg-background/90 backdrop-blur-sm"
          >
            {isAutoPlay ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="outline"
              size="icon"
              onClick={onClose}
              className="bg-background/90 backdrop-blur-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Christ Connection Panel */}
      {showInfo && (
        <div className="absolute top-20 right-4 pointer-events-auto">
          <Card className="bg-background/95 backdrop-blur-sm max-w-xs">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Christ Connection</h4>
              <p className="text-sm text-muted-foreground">
                {currentScene.christConnection}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={prevScene}
          className="bg-background/90 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex gap-2">
          {BIBLE_SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => {
                setCurrentSceneIndex(i);
                setCurrentPromptIndex(0);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSceneIndex 
                  ? 'bg-primary scale-125' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextScene}
          className="bg-background/90 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Scene description */}
      <div className="absolute bottom-16 left-4 right-4 text-center pointer-events-none">
        <p className="text-white/80 text-sm bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
          {currentScene.description}
        </p>
      </div>
    </div>
  );
}

export default Imagination3DViewer;
