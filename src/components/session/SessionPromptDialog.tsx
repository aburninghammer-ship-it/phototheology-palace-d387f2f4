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
import { BookOpen, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function SessionPromptDialog() {
  const { 
    showSessionPrompt, 
    setShowSessionPrompt, 
    dismissSessionPrompt,
    startSession,
    isLoading
  } = useSessionMode();
  
  const [sessionTitle, setSessionTitle] = useState('');
  const [neverAskAgain, setNeverAskAgain] = useState(false);

  const handleStartSession = async () => {
    await startSession(sessionTitle || undefined);
    setSessionTitle('');
  };

  const handleDismiss = () => {
    if (neverAskAgain) {
      localStorage.setItem('session_prompt_disabled', 'true');
    }
    dismissSessionPrompt();
    setSessionTitle('');
  };

  // Check if prompt is disabled
  const isPromptDisabled = localStorage.getItem('session_prompt_disabled') === 'true';
  if (isPromptDisabled) return null;

  return (
    <Dialog open={showSessionPrompt} onOpenChange={setShowSessionPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Start Study Session?
          </DialogTitle>
          <DialogDescription>
            You're diving into a multi-panel study. Session Mode will track your entire study journey — 
            every verse, PT room, Jeeves analysis, and note — so you can resume or share it later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="session-title">Session Title (optional)</Label>
            <Input
              id="session-title"
              placeholder="e.g., Ten Commandments Study"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="never-ask" 
              checked={neverAskAgain}
              onCheckedChange={(checked) => setNeverAskAgain(checked === true)}
            />
            <label 
              htmlFor="never-ask" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't ask again
            </label>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            Not now
          </Button>
          <Button
            onClick={handleStartSession}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Starting...' : 'Start Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
