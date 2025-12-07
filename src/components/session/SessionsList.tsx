import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  FolderOpen, 
  Play, 
  Trash2, 
  Clock, 
  Layers, 
  BookOpen, 
  Search,
  Lightbulb,
  Loader2 
} from "lucide-react";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useStudySession, TabState } from "@/contexts/StudySessionContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const TAB_ICONS: Record<TabState["type"], React.ReactNode> = {
  "study-bible": <BookOpen className="h-3 w-3" />,
  "research": <Search className="h-3 w-3" />,
  "analyze": <Lightbulb className="h-3 w-3" />,
  "gems": <FolderOpen className="h-3 w-3" />,
  "commentary": <FolderOpen className="h-3 w-3" />,
  "my-studies": <FolderOpen className="h-3 w-3" />,
  "concordance": <Search className="h-3 w-3" />,
};

export function SessionsList() {
  const navigate = useNavigate();
  const { sessions, loading, deleteSession, refetch } = useStudySessions();
  const { loadSession, isSessionActive } = useStudySession();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [resuming, setResuming] = useState<string | null>(null);

  const handleResumeSession = async (sessionId: string, firstTabPath?: string) => {
    if (isSessionActive) {
      toast.error("Please end your current session first");
      return;
    }

    setResuming(sessionId);
    try {
      await loadSession(sessionId);
      // Navigate to the first tab's path if available
      if (firstTabPath) {
        navigate(firstTabPath);
      }
    } finally {
      setResuming(null);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionToDelete) return;
    
    const success = await deleteSession(sessionToDelete);
    if (success) {
      toast.success("Session deleted");
    } else {
      toast.error("Failed to delete session");
    }
    
    setDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="py-12 text-center">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Study Sessions Yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Start a study session to save multiple tabs, notes, and Jeeves conversations together.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            Study Sessions
          </h2>
          <Badge variant="secondary">{sessions.length} sessions</Badge>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {sessions.map((session) => {
              const tabCount = session.tabs_data?.length || 0;
              const firstTab = session.tabs_data?.[0];
              
              return (
                <Card 
                  key={session.id} 
                  className="hover:border-primary/50 transition-colors"
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/5 text-primary text-xs shrink-0">
                            Session
                          </Badge>
                          <span className="truncate">{session.title}</span>
                        </CardTitle>
                        {session.description && (
                          <CardDescription className="mt-1 text-xs line-clamp-1">
                            {session.description}
                          </CardDescription>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleResumeSession(session.id, firstTab?.path)}
                          disabled={resuming === session.id || isSessionActive}
                        >
                          {resuming === session.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </>
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => {
                            setSessionToDelete(session.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="py-2 px-4 pt-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {tabCount} {tabCount === 1 ? "tab" : "tabs"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    {tabCount > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {session.tabs_data.slice(0, 4).map((tab, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs gap-1">
                            {TAB_ICONS[tab.type]}
                            {tab.title.length > 15 ? tab.title.slice(0, 15) + "..." : tab.title}
                          </Badge>
                        ))}
                        {tabCount > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tabCount - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this study session and all its saved tabs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
