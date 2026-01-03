import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { ScriptureLookup } from './ScriptureLookup';
import { PTIntegrationPanel } from './PTIntegrationPanel';
import { SavedMaterialsPicker } from './SavedMaterialsPicker';
import { fetchChapter } from '@/services/bibleApi';
import { toast } from 'sonner';

interface SermonRichTextAreaProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  showTools?: boolean;
  themePassage?: string;
}

// Regex pattern to match Bible verse references like "John 3:16", "1 Corinthians 13:4-7", "Genesis 1:1"
const VERSE_REFERENCE_PATTERN = /\b([1-3]?\s?[A-Za-z]+)\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;

// Parse a verse reference string into components
function parseVerseReference(ref: string): { book: string; chapter: number; verseStart: number; verseEnd?: number } | null {
  const match = ref.match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verseStart: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : undefined
  };
}

export function SermonRichTextArea({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  minHeight = "120px",
  showTools = true,
  themePassage
}: SermonRichTextAreaProps) {
  const lastProcessedRef = useRef<Set<string>>(new Set());
  const processingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none px-3 py-2 h-full overflow-y-auto`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  // Auto-detect and expand verse references
  const processVerseReferences = useCallback(async () => {
    if (!editor || processingRef.current) return;
    
    const html = editor.getHTML();
    const plainText = html.replace(/<[^>]*>/g, ' ');
    
    // Find all verse references in the text
    const matches = [...plainText.matchAll(VERSE_REFERENCE_PATTERN)];
    
    for (const match of matches) {
      const fullRef = match[0];
      
      // Skip if already processed or inside a blockquote (already expanded)
      if (lastProcessedRef.current.has(fullRef)) continue;
      if (html.includes(`<strong>${fullRef}</strong>`)) {
        lastProcessedRef.current.add(fullRef);
        continue;
      }
      
      const parsed = parseVerseReference(fullRef);
      if (!parsed) continue;
      
      processingRef.current = true;
      
      try {
        const chapterData = await fetchChapter(parsed.book, parsed.chapter);
        
        if (chapterData?.verses?.length > 0) {
          const verseEnd = parsed.verseEnd || parsed.verseStart;
          const verses = chapterData.verses.filter(
            v => v.verse >= parsed.verseStart && v.verse <= verseEnd
          );
          
          if (verses.length > 0) {
            const verseText = verses.map(v => v.text).join(' ');
            
            // Find and replace the reference with the full verse
            const currentHtml = editor.getHTML();
            
            // Only replace if it's a standalone reference (not already in a blockquote)
            const refPattern = new RegExp(`(?<!<strong>)${fullRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!</strong>)`, 'g');
            
            if (refPattern.test(currentHtml) && !currentHtml.includes(`"${verseText}"`)) {
              const newHtml = currentHtml.replace(
                refPattern,
                `<blockquote><strong>${fullRef}</strong>: "${verseText}"</blockquote>`
              );
              
              editor.commands.setContent(newHtml);
              lastProcessedRef.current.add(fullRef);
              toast.success(`Inserted ${fullRef}`);
            } else {
              lastProcessedRef.current.add(fullRef);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching verse:', error);
      } finally {
        processingRef.current = false;
      }
    }
  }, [editor]);

  // Debounced verse detection - trigger after user stops typing
  useEffect(() => {
    if (!editor) return;
    
    const timeoutId = setTimeout(() => {
      processVerseReferences();
    }, 1500); // 1.5 second delay after typing stops
    
    return () => clearTimeout(timeoutId);
  }, [content, processVerseReferences, editor]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertText = (text: string) => {
    if (editor) {
      editor.chain().focus().insertContent(text + '\n\n').run();
    }
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-background h-full flex flex-col">
      {showTools && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />
          
          <ScriptureLookup onInsert={insertText} />
          <PTIntegrationPanel onInsert={insertText} themePassage={themePassage} />
          <SavedMaterialsPicker onSelectMaterial={(content, title) => insertText(`**From: ${title}**\n${content}`)} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}
