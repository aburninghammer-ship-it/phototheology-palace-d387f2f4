import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderPlus, Sparkles } from "lucide-react";
import { useStudySession } from "@/contexts/StudySessionContext";

interface StartSessionDialogProps {
  trigger?: React.ReactNode;
  onSessionStarted?: () => void;
}

export function StartSessionDialog({ trigger, onSessionStarted }: StartSessionDialogProps) {
  const { startSession, isSessionActive } = useStudySession();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleStart = async () => {
    if (!title.trim()) return;
    
    await startSession(title.trim(), description.trim() || undefined);
    setOpen(false);
    setTitle("");
    setDescription("");
    onSessionStarted?.();
  };

  // If session is already active, don't show the dialog
  if (isSessionActive) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            Start Session
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Start Study Session
          </DialogTitle>
          <DialogDescription>
            Create a multi-tab study workspace. Your tabs, notes, and Jeeves conversations will be saved together.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              placeholder="e.g., Ten Commandments Deep Dive"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What are you studying today?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={!title.trim()}>
            <FolderPlus className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
