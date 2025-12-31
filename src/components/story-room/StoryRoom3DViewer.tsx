import { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  Html,
  Float,
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, RotateCcw, X } from 'lucide-react';
import { PalaceRoom3D } from '@/components/3d/PalaceRoom3D';

// Bible books organized by section
const BIBLE_SECTIONS = [
  {
    name: 'Torah / Pentateuch',
    color: '#3b82f6',
    books: ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy']
  },
  {
    name: 'Historical Books',
    color: '#22c55e',
    books: ['Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther']
  },
  {
    name: 'Wisdom Literature',
    color: '#f59e0b',
    books: ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon']
  },
  {
    name: 'Major Prophets',
    color: '#ef4444',
    books: ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel']
  },
  {
    name: 'Minor Prophets',
    color: '#8b5cf6',
    books: ['Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi']
  },
  {
    name: 'Gospels',
    color: '#ec4899',
    books: ['Matthew', 'Mark', 'Luke', 'John']
  },
  {
    name: 'Acts & Letters',
    color: '#14b8a6',
    books: ['Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians']
  },
  {
    name: 'Pastoral & General',
    color: '#f97316',
    books: ['1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation']
  }
];

// Book with story highlights
const BOOK_STORIES: Record<string, string[]> = {
  'Genesis': ['Creation', 'Fall', 'Flood', 'Tower of Babel', 'Abraham\'s Call', 'Isaac\'s Birth', 'Jacob\'s Ladder', 'Joseph\'s Dreams'],
  'Exodus': ['Burning Bush', 'Ten Plagues', 'Red Sea Crossing', 'Mount Sinai', 'Golden Calf', 'Tabernacle Built'],
  'Daniel': ['Refuses King\'s Table', 'Fiery Furnace', 'Lions\' Den', 'Vision of Beasts'],
  'Matthew': ['Birth of Jesus', 'Sermon on the Mount', 'Miracles', 'Parables', 'Crucifixion', 'Resurrection'],
  'John': ['Word Made Flesh', 'Water to Wine', 'Nicodemus', 'Woman at Well', 'Lazarus', 'Last Supper', 'Crucifixion', 'Resurrection'],
  'Acts': ['Pentecost', 'Stephen\'s Martyrdom', 'Paul\'s Conversion', 'Cornelius', 'Missionary Journeys', 'Shipwreck'],
  'Revelation': ['Seven Churches', 'Throne Room', 'Seven Seals', 'Seven Trumpets', 'Woman & Dragon', 'Seven Plagues', 'New Jerusalem']
};

// 3D Book component
interface Book3DProps {
  name: string;
  position: [number, number, number];
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function Book3D({ name, position, color, isSelected, onClick }: Book3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Slight floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
      
      // Pull out when selected
      const targetZ = isSelected ? position[2] + 0.5 : hovered ? position[2] + 0.2 : position[2];
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
    }
  });

  const height = 1.2 + (name.length % 3) * 0.1;
  const thickness = 0.15 + (name.length % 4) * 0.02;

  return (
    <group 
      ref={meshRef} 
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Book spine */}
      <mesh castShadow>
        <boxGeometry args={[thickness, height, 0.8]} />
        <meshStandardMaterial 
          color={isSelected ? '#ffd700' : hovered ? '#ffffff' : color} 
          roughness={0.6}
        />
      </mesh>
      
      {/* Book title on spine */}
      <Html
        position={[thickness / 2 + 0.01, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        center
        distanceFactor={6}
        style={{ pointerEvents: 'none' }}
      >
        <div 
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            color: isSelected || hovered ? '#000' : '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            textShadow: '0 0 3px rgba(0,0,0,0.5)'
          }}
        >
          {name}
        </div>
      </Html>

      {/* Glow effect when selected */}
      {isSelected && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.5}
          distance={2}
          color="#ffd700"
        />
      )}
    </group>
  );
}

// Bookshelf component
interface BookshelfProps {
  section: typeof BIBLE_SECTIONS[0];
  position: [number, number, number];
  selectedBook: string | null;
  onBookSelect: (book: string) => void;
}

function Bookshelf({ section, position, selectedBook, onBookSelect }: BookshelfProps) {
  const booksPerShelf = 8;
  const shelves = Math.ceil(section.books.length / booksPerShelf);

  return (
    <group position={position}>
      {/* Shelf structure */}
      {Array.from({ length: shelves + 1 }).map((_, shelfIndex) => (
        <mesh key={shelfIndex} position={[0, shelfIndex * 1.5 - 0.1, 0]} receiveShadow>
          <boxGeometry args={[3, 0.1, 1]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
      ))}

      {/* Back panel */}
      <mesh position={[0, shelves * 0.75, -0.45]}>
        <boxGeometry args={[3.2, shelves * 1.5 + 0.2, 0.1]} />
        <meshStandardMaterial color="#3d2817" roughness={0.9} />
      </mesh>

      {/* Ornate top trim */}
      <mesh position={[0, shelves * 1.5 + 0.15, 0]}>
        <boxGeometry args={[3.4, 0.2, 1.1]} />
        <meshStandardMaterial color="#DAA520" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Section label */}
      <Html position={[0, shelves * 1.5 + 0.5, 0]} center distanceFactor={8}>
        <div 
          style={{
            background: section.color,
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {section.name}
        </div>
      </Html>

      {/* Books on shelves */}
      {section.books.map((book, index) => {
        const shelfIndex = Math.floor(index / booksPerShelf);
        const positionInShelf = index % booksPerShelf;
        const xOffset = (positionInShelf - (Math.min(section.books.length - shelfIndex * booksPerShelf, booksPerShelf) - 1) / 2) * 0.35;

        return (
          <Book3D
            key={book}
            name={book}
            position={[xOffset, shelfIndex * 1.5 + 0.6, 0]}
            color={section.color}
            isSelected={selectedBook === book}
            onClick={() => onBookSelect(book)}
          />
        );
      })}
    </group>
  );
}

// Reading desk with selected book info
function ReadingDesk({ book, stories }: { book: string | null; stories: string[] }) {
  if (!book) return null;

  return (
    <group position={[0, 0, 5]}>
      {/* Ornate desk */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshStandardMaterial color="#654321" roughness={0.5} />
      </mesh>
      {/* Gold inlay on desk */}
      <mesh position={[0, 0.81, 0]}>
        <boxGeometry args={[2.8, 0.01, 1.8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Carved legs */}
      {[[-1.3, 0.4, -0.8], [1.3, 0.4, -0.8], [-1.3, 0.4, 0.8], [1.3, 0.4, 0.8]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.8, 8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}

      {/* Open book with gentle float */}
      <Float speed={1} rotationIntensity={0.02}>
        <group position={[0, 1.2, 0]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <boxGeometry args={[2, 0.05, 1.5]} />
            <meshStandardMaterial color="#f5f5dc" />
          </mesh>
          {/* Book pages texture lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[0, 0.03, -0.6 + i * 0.12]}>
              <boxGeometry args={[1.8, 0.01, 0.01]} />
              <meshStandardMaterial color="#666" />
            </mesh>
          ))}
        </group>
      </Float>

      {/* Desk lamp */}
      <group position={[1.2, 0.9, -0.5]}>
        <mesh>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 0.15, 8, 1, true]} />
          <meshStandardMaterial color="#DAA520" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.4, 0]} intensity={0.5} distance={3} color="#ffcc88" />
      </group>

      {/* Book info panel */}
      <Html position={[0, 2.5, 0]} center distanceFactor={6}>
        <div className="bg-black/90 text-white p-4 rounded-xl min-w-[250px] text-center backdrop-blur-sm border border-primary/30">
          <h3 className="text-xl font-bold mb-2">{book}</h3>
          <p className="text-sm text-muted-foreground mb-3">Key Stories:</p>
          <div className="flex flex-wrap gap-1 justify-center">
            {stories.slice(0, 6).map((story, i) => (
              <span 
                key={i}
                className="bg-primary/20 px-2 py-1 rounded text-xs"
              >
                {story}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

// Library room contents (bookshelves arranged in semicircle)
function LibraryContents({ selectedBook, onBookSelect }: {
  selectedBook: string | null;
  onBookSelect: (book: string) => void;
}) {
  const selectedStories = selectedBook ? (BOOK_STORIES[selectedBook] || ['Explore this book to discover its stories']) : [];

  return (
    <>
      {/* Bookshelves arranged in a semicircle against the back wall */}
      {BIBLE_SECTIONS.map((section, i) => {
        const angle = (i / (BIBLE_SECTIONS.length - 1)) * Math.PI - Math.PI / 2;
        const radius = 12;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 8;
        
        return (
          <Bookshelf
            key={section.name}
            section={section}
            position={[x, 0, z]}
            selectedBook={selectedBook}
            onBookSelect={onBookSelect}
          />
        );
      })}

      {/* Central reading desk */}
      <ReadingDesk book={selectedBook} stories={selectedStories} />

      {/* Decorative rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#8B0000" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]}>
        <ringGeometry args={[4, 5.8, 32]} />
        <meshStandardMaterial color="#DAA520" roughness={0.9} />
      </mesh>
    </>
  );
}

interface StoryRoom3DViewerProps {
  onClose?: () => void;
}

export function StoryRoom3DViewer({ onClose }: StoryRoom3DViewerProps) {
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const handleBookSelect = useCallback((book: string) => {
    setSelectedBook(book === selectedBook ? null : book);
  }, [selectedBook]);

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-border">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={50} />
          
          <PalaceRoom3D theme="library" width={40} height={12} depth={30}>
            <LibraryContents 
              selectedBook={selectedBook} 
              onBookSelect={handleBookSelect} 
            />
          </PalaceRoom3D>
          
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            minDistance={5}
            maxDistance={25}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 2, 0]}
          />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <Card className="bg-background/90 backdrop-blur-sm pointer-events-auto">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              📖 Story Room Library
            </h3>
            <p className="text-sm text-muted-foreground">
              Click books to explore their stories
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-2 pointer-events-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSelectedBook(null)}
            className="bg-background/90 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4" />
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

      {/* Section Legend */}
      <div className="absolute bottom-4 left-4 pointer-events-auto">
        <Card className="bg-background/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-2">
              {BIBLE_SECTIONS.slice(0, 4).map((section) => (
                <div key={section.name} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: section.color }}
                  />
                  <span className="text-xs">{section.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <p className="text-white/70 text-xs bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
          Drag to rotate • Scroll to zoom • Click books to select
        </p>
      </div>
    </div>
  );
}

export default StoryRoom3DViewer;
