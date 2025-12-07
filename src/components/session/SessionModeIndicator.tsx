import React from 'react';
import { useSessionMode } from '@/contexts/SessionModeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Save, 
  Square, 
  Clock,
  Loader2
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';

export function SessionModeIndicator() {
  const { 
    isSessionActive, 
    currentSession, 
    isSaving,
    lastAutoSave,
    endSession
  } = useSessionMode();

  if (!isSessionActive || !currentSession) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-primary">Session Active</span>
        </div>
        
        <Badge variant="secondary" className="text-xs">
          {currentSession.title}
        </Badge>

        {currentSession.totalDurationSeconds > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatDuration(currentSession.totalDurationSeconds)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Session duration</p>
            </TooltipContent>
          </Tooltip>
        )}

        {lastAutoSave && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                {!isSaving && formatDistanceToNow(lastAutoSave, { addSuffix: true })}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last auto-save</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-destructive/10"
              onClick={endSession}
            >
              <Square className="h-3 w-3 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>End session</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
