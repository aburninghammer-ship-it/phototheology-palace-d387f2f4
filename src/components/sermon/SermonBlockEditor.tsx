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

  // Normalize the HTML
  let normalizedHtml = html
    .replace(/\n/g, '')
    .replace(/<br\s*\/?>/gi, '\n');

  // Match blockquotes (verses) and paragraphs
  const blockquoteRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi;
  const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;

  // Split content by blockquotes first, preserving order
  const parts: { type: 'verse' | 'paragraph' | 'text'; content: string; index: number }[] = [];

  // Find all blockquotes with their positions
  let match;
  let lastIndex = 0;

  while ((match = blockquoteRegex.exec(normalizedHtml)) !== null) {
    // Add any text before this blockquote
    if (match.index > lastIndex) {
      const textBetween = normalizedHtml.slice(lastIndex, match.index);
      if (textBetween.trim()) {
        parts.push({ type: 'text', content: textBetween, index: lastIndex });
      }
    }

    // Add the blockquote
    parts.push({ type: 'verse', content: match[1], index: match.index });
    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < normalizedHtml.length) {
    const remaining = normalizedHtml.slice(lastIndex);
    if (remaining.trim()) {
      parts.push({ type: 'text', content: remaining, index: lastIndex });
    }
  }

  // Sort by index
  parts.sort((a, b) => a.index - b.index);

  // Process parts into blocks
  for (const part of parts) {
    if (part.type === 'verse') {
      // Extract reference from verse
      const verseMatch = part.content.match(/<strong>([^<]+)<\/strong>:\s*["']?([^"'<]+)["']?/);
      if (verseMatch) {
        blocks.push({
          id: `block-${blockId++}`,
          type: 'verse',
          reference: verseMatch[1],
          content: verseMatch[2].trim(),
        });
      } else {
        // Plain blockquote without our format
        const plainText = part.content.replace(/<[^>]*>/g, '').trim();
        if (plainText) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'verse',
            content: plainText,
          });
        }
      }
    } else {
      // Extract paragraphs from text content
      let pMatch;
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let foundParagraphs = false;

      while ((pMatch = pRegex.exec(part.content)) !== null) {
        const plainText = pMatch[1].replace(/<[^>]*>/g, '').trim();
        if (plainText && plainText.length > 0) {
          blocks.push({
            id: `block-${blockId++}`,
            type: 'paragraph',
            content: plainText,
          });
          foundParagraphs = true;
        }
      }

      // If no paragraphs found, treat as plain text and split by double newlines or <br><br>
      if (!foundParagraphs) {
        const plainText = part.content.replace(/<[^>]*>/g, '').trim();
        if (plainText) {
          // Split by double line breaks or multiple spaces
          const paragraphs = plainText.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim());
          for (const p of paragraphs) {
            if (p.trim()) {
              blocks.push({
                id: `block-${blockId++}`,
                type: 'paragraph',
                content: p.trim(),
              });
            }
          }
        }
      }
    }
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
        isDragging && 'z-50 opacity-90'
      )}
    >
      <Card
        className={cn(
          'p-3 transition-all backdrop-blur-md border',
          isDragging && 'shadow-2xl ring-2 ring-primary scale-[1.02]',
          block.type === 'verse'
            ? 'bg-amber-500/10 border-amber-400/30 shadow-amber-500/10 hover:bg-amber-500/15 hover:border-amber-400/50'
            : 'bg-white/10 dark:bg-white/5 border-white/20 hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/30'
        )}
      >
        <div className="flex gap-2">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {block.type === 'verse' ? (
                <>
                  <Quote className="h-4 w-4 text-amber-400 shrink-0" />
                  <Badge variant="outline" className="text-xs bg-amber-500/20 border-amber-400/40 text-amber-300">
                    {block.reference || 'Scripture'}
                  </Badge>
                </>
              ) : (
                <>
                  <Type className="h-4 w-4 text-purple-400 shrink-0" />
                  <Badge variant="outline" className="text-xs bg-purple-500/20 border-purple-400/40 text-purple-300">
                    Paragraph
                  </Badge>
                </>
              )}
            </div>
            <p className={cn(
              'text-sm leading-relaxed',
              block.type === 'verse' && 'italic'
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
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(block.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
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
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-950/20 via-background to-amber-950/20">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-semibold text-sm">Block Editor</h3>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Quote className="h-3 w-3" />
              {verseCount} verses
            </span>
            <span className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              {paragraphCount} paragraphs
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Apply Changes
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-3 py-2 bg-blue-500/10 backdrop-blur-sm border-b border-blue-400/20 text-xs text-blue-400">
        Drag blocks to reorder your sermon. Verses (amber) and paragraphs (glass) can be freely rearranged.
      </div>

      {/* Block list */}
      <div className="flex-1 overflow-y-auto p-3">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <Type className="h-12 w-12 mb-4 mx-auto text-purple-400/50" />
              <p className="text-sm text-foreground/70">No content blocks found.</p>
              <p className="text-xs mt-1 text-muted-foreground">Write some content first, then use block mode to rearrange.</p>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
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
