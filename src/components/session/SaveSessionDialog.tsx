import React, { useState } from 'react';
import { useSessionMode } from '@/contexts/SessionModeContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Loader2, X, Sparkles } from 'lucide-react';

interface SaveSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateSummary?: () => void;
}

export function SaveSessionDialog({ 
  open, 
  onOpenChange,
  onGenerateSummary 
}: SaveSessionDialogProps) {
  const { currentSession, saveSession, isSaving } = useSessionMode();
  
  const [title, setTitle] = useState(currentSession?.title || '');
  const [description, setDescription] = useState(currentSession?.description || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(currentSession?.tags || []);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    await saveSession(title, description, tags);
    onOpenChange(false);
  };

  const handleSaveAndGenerate = async () => {
    await saveSession(title, description, tags);
    onGenerateSummary?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5 text-primary" />
            Save Session
          </DialogTitle>
          <DialogDescription>
            Save your study session to access it later. You can also add a description and tags.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="save-title">Session Title</Label>
            <Input
              id="save-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a memorable title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="save-description">Description (optional)</Label>
            <Textarea
              id="save-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you study? Any key insights?"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {currentSession && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Verses studied:</span>
                <span className="font-medium">{currentSession.verses.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>PT interactions:</span>
                <span className="font-medium">{currentSession.ptInteractions.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Jeeves analyses:</span>
                <span className="font-medium">{currentSession.jeevesInteractions.length}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Notes:</span>
                <span className="font-medium">{currentSession.notes.length}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {onGenerateSummary && (
            <Button 
              variant="secondary" 
              onClick={handleSaveAndGenerate}
              disabled={isSaving}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Save & Generate Summary
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Session'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
