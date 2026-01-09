import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Quote, Type, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentBlock {
  id: string;
  type: 'verse' | 'paragraph';
  content: string;
  reference?: string; // For verses
}

interface SermonBlockEditorProps {
  content: string;
  onChange: (content: string) => void;
  onClose: () => void;
}

// Parse HTML content into blocks
function parseContentToBlocks(html: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let blockId = 0;

  if (!html || html.trim() === '') return blocks;

  // Strip HTML tags first
  const strippedText = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .trim();

  if (!strippedText) return blocks;

  // Bible book names for matching
  const bibleBooks = '(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1\\s*Samuel|2\\s*Samuel|1\\s*Kings|2\\s*Kings|1\\s*Chronicles|2\\s*Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Song\\s*of\\s*Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1\\s*Corinthians|2\\s*Corinthians|Galatians|Ephesians|Philippians|Colossians|1\\s*Thessalonians|2\\s*Thessalonians|1\\s*Timothy|2\\s*Timothy|Titus|Philemon|Hebrews|James|1\\s*Peter|2\\s*Peter|1\\s*John|2\\s*John|3\\s*John|Jude|Revelation)';

  // Pattern to match Bible verse references like "Matthew 6:33:" or "John 3:5-6:"
  const verseRefPattern = new RegExp(`(${bibleBooks})\\s+(\\d+):(\\d+)(?:-(\\d+))?\\s*:`, 'gi');

  // Split content by lines first
  const lines = strippedText.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);
  
  let currentParagraph = '';

  for (const line of lines) {
    // Check if this line starts with a Bible reference like "Matthew 6:33:"
    const verseMatch = line.match(new RegExp(`^(${bibleBooks}\\s+\\d+:\\d+(?:-\\d+)?)\\s*:\\s*(.+)$`, 'i'));
    
    if (verseMatch) {
      // Save any accumulated paragraph first
      if (currentParagraph.trim()) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          content: currentParagraph.trim(),
        });
        currentParagraph = '';
      }
      
      // Extract the verse reference and content
      const reference = verseMatch[1].trim();
      let verseContent = verseMatch[2].trim();
      
      // Remove surrounding quotes from verse content
      verseContent = verseContent.replace(/^["'"']+|["'"']+$/g, '');
      
      blocks.push({
        id: `block-${blockId++}`,
        type: 'verse',
        reference,
        content: verseContent,
      });
    } else if (line.length > 0) {
      // This is a regular text line
      // Check if it's a very short line (likely a heading or standalone thought)
      if (line.length < 100 && !line.endsWith('.') && !line.endsWith('!') && !line.endsWith('?')) {
        // Treat short standalone lines as separate paragraphs
        if (currentParagraph.trim()) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'paragraph',
            content: currentParagraph.trim(),
          });
          currentParagraph = '';
        }
        blocks.push({
          id: `block-${blockId++}`,
          type: 'paragraph',
          content: line,
        });
      } else if (currentParagraph && !currentParagraph.endsWith(' ')) {
        currentParagraph += ' ' + line;
      } else {
        currentParagraph += line;
      }
    }
  }

  // Don't forget any remaining paragraph
  if (currentParagraph.trim()) {
    blocks.push({
      id: `block-${blockId++}`,
      type: 'paragraph',
      content: currentParagraph.trim(),
    });
  }

  return blocks;
}


// Convert blocks back to HTML
function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    if (block.type === 'verse') {
      if (block.reference) {
        return `<blockquote><strong>${block.reference}</strong>: "${block.content}"</blockquote>`;
      }
      return `<blockquote>${block.content}</blockquote>`;
    }
    return `<p>${block.content}</p>`;
  }).join('\n');
}

// Sortable block component
function SortableBlock({
  block,
  onDelete,
}: {
  block: ContentBlock;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'z-50'
      )}
    >
      <div
        className={cn(
          'relative p-4 rounded-xl transition-all duration-300 backdrop-blur-xl border overflow-hidden',
          isDragging && 'shadow-2xl scale-[1.02]',
          block.type === 'verse'
            ? 'bg-gradient-to-br from-amber-500/25 via-amber-400/15 to-yellow-500/20 border-amber-400/40 shadow-[0_4px_20px_rgba(251,191,36,0.2)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.3)] hover:border-amber-400/60'
            : 'bg-gradient-to-br from-white/15 via-purple-500/10 to-white/10 border-white/30 shadow-[0_4px_20px_rgba(168,85,247,0.15)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)] hover:border-purple-400/50'
        )}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        {/* Dragging glow ring */}
        {isDragging && (
          <div className={cn(
            'absolute inset-0 rounded-xl ring-2',
            block.type === 'verse' ? 'ring-amber-400/60' : 'ring-purple-400/60'
          )} />
        )}

        <div className="relative flex gap-3">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className={cn(
              'cursor-grab active:cursor-grabbing touch-none p-1.5 -ml-1 rounded-lg transition-all',
              block.type === 'verse' 
                ? 'text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/20' 
                : 'text-purple-400/70 hover:text-purple-300 hover:bg-purple-500/20'
            )}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {block.type === 'verse' ? (
                <>
                  <div className="p-1 rounded-md bg-amber-500/20 backdrop-blur-sm">
                    <Quote className="h-4 w-4 text-amber-300" />
                  </div>
                  <Badge className="text-xs bg-amber-500/30 border-amber-400/50 text-amber-200 backdrop-blur-sm shadow-sm">
                    {block.reference || 'Scripture'}
                  </Badge>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-md bg-purple-500/20 backdrop-blur-sm">
                    <Type className="h-4 w-4 text-purple-300" />
                  </div>
                  <Badge className="text-xs bg-purple-500/30 border-purple-400/50 text-purple-200 backdrop-blur-sm shadow-sm">
                    Paragraph
                  </Badge>
                </>
              )}
            </div>
            <p className={cn(
              'text-sm leading-relaxed text-foreground/90',
              block.type === 'verse' && 'italic text-amber-100/90'
            )}>
              {block.content.length > 200
                ? block.content.slice(0, 200) + '...'
                : block.content}
            </p>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all text-destructive/70 hover:text-destructive hover:bg-destructive/20 backdrop-blur-sm rounded-lg"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SermonBlockEditor({ content, onChange, onClose }: SermonBlockEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => parseContentToBlocks(content));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDelete = (id: string) => {
    setBlocks((items) => items.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    const newHtml = blocksToHtml(blocks);
    onChange(newHtml);
    onClose();
  };

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const verseCount = blocks.filter(b => b.type === 'verse').length;
  const paragraphCount = blocks.filter(b => b.type === 'paragraph').length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-950/30 via-background to-amber-950/30 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-white/5 to-amber-500/10 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm bg-gradient-to-r from-purple-300 to-amber-300 bg-clip-text text-transparent">
            Block Editor
          </h3>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30">
              <Quote className="h-3 w-3 text-amber-300" />
              <span className="text-amber-200">{verseCount} verses</span>
            </span>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30">
              <Type className="h-3 w-3 text-purple-300" />
              <span className="text-purple-200">{paragraphCount} paragraphs</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="backdrop-blur-sm border-white/20 hover:bg-white/10">
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 border-0 shadow-lg shadow-purple-500/20">
            <Check className="h-4 w-4 mr-1" />
            Apply Changes
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="relative px-4 py-2.5 bg-gradient-to-r from-blue-500/15 to-cyan-500/10 backdrop-blur-xl border-b border-blue-400/20">
        <div className="flex items-center gap-2 text-xs text-blue-300">
          <GripVertical className="h-4 w-4" />
          <span>Drag blocks to reorder your sermon. <span className="text-amber-300">Verses</span> and <span className="text-purple-300">paragraphs</span> can be freely rearranged.</span>
        </div>
      </div>

      {/* Block list */}
      <div className="relative flex-1 overflow-y-auto p-4">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
              <div className="p-4 rounded-xl bg-purple-500/20 mb-4 mx-auto w-fit">
                <Type className="h-10 w-10 text-purple-300" />
              </div>
              <p className="text-sm text-foreground/80">No content blocks found.</p>
              <p className="text-xs mt-2 text-muted-foreground max-w-xs">Write some content first, then use block mode to rearrange your sermon structure.</p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
