import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X, BookOpen, Search, Lightbulb, Gem, FileText, BookMarked, Save, FolderOpen } from "lucide-react";
import { useStudySession, TabState } from "@/contexts/StudySessionContext";
import { cn } from "@/lib/utils";

const TAB_ICONS: Record<TabState["type"], React.ReactNode> = {
  "study-bible": <BookOpen className="h-3.5 w-3.5" />,
  "research": <Search className="h-3.5 w-3.5" />,
  "analyze": <Lightbulb className="h-3.5 w-3.5" />,
  "gems": <Gem className="h-3.5 w-3.5" />,
  "commentary": <FileText className="h-3.5 w-3.5" />,
  "my-studies": <BookMarked className="h-3.5 w-3.5" />,
  "concordance": <Search className="h-3.5 w-3.5" />,
};

export function SessionTabBar() {
  const navigate = useNavigate();
  const { 
    currentSession, 
    isSessionActive, 
    tabs, 
    activeTab, 
    switchTab, 
    closeTab,
    saveSession,
    endSession,
  } = useStudySession();

  if (!isSessionActive || tabs.length === 0) return null;

  const handleTabClick = (tab: TabState) => {
    switchTab(tab.id);
    navigate(tab.path);
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-2">
          {/* Session Info */}
          <div className="flex items-center gap-2 shrink-0 border-r border-border pr-3 mr-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              <FolderOpen className="h-3 w-3 mr-1" />
              {currentSession?.title}
            </Badge>
          </div>

          {/* Tabs */}
          <ScrollArea className="flex-1">
            <div className="flex items-center gap-1">
                {tabs.map((tab) => {
                const isActive = tab.id === activeTab?.id;
                return (
                  <div
                    key={tab.id}
                    className={cn(
                      "group flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all relative",
                      isActive 
                        ? "bg-primary/15 text-primary border border-primary/40 shadow-[0_0_20px_4px_hsl(var(--primary)/0.3),inset_0_1px_0_hsl(var(--primary-foreground)/0.1)] backdrop-blur-sm" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => handleTabClick(tab)}
                  >
                    {/* Glassy halo effect for active tab */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                    )}
                    {TAB_ICONS[tab.type]}
                    <span className="text-xs font-medium max-w-24 truncate">
                      {tab.title}
                    </span>
                    {tab.state.insertedScriptures.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1 text-[10px]">
                        {tab.state.insertedScriptures.length}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Session Controls */}
          <div className="flex items-center gap-1 shrink-0 border-l border-border pl-3 ml-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveSession}>
                  <Save className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Session</TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={endSession}>
              End
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
