import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { 
  Megaphone, Calendar, BookOpen, Sparkles, 
  Bell, ChevronDown, ChevronUp, Loader2 
} from "lucide-react";

interface PublicAnnouncementsBoardProps {
  churchId: string;
}

interface PublicAnnouncement {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_pinned?: boolean;
}

const PUBLIC_NOTIFICATION_TYPES = [
  'announcement',
  'church_announcement', 
  'gem_release',
  'new_study',
  'quarterly_update',
  'event',
  'church_reminder',
  'feature_release'
];

export function PublicAnnouncementsBoard({ churchId }: PublicAnnouncementsBoardProps) {
  const [announcements, setAnnouncements] = useState<PublicAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadPublicAnnouncements();
  }, [churchId]);

  const loadPublicAnnouncements = async () => {
    try {
      // Get church announcements
      const { data: churchAnnouncements } = await supabase
        .from('church_announcements')
        .select('id, title, message, type, created_at, is_pinned')
        .eq('church_id', churchId)
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      // Get app-wide public announcements
      const { data: appAnnouncements } = await supabase
        .from('announcements')
        .select('id, title, message, type, created_at')
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.now()')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and sort
      const allAnnouncements: PublicAnnouncement[] = [
        ...(churchAnnouncements || []),
        ...(appAnnouncements || []).map(a => ({ ...a, is_pinned: false }))
      ].sort((a, b) => {
        // Pinned first
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        // Then by date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setAnnouncements(allAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'announcement':
      case 'church_announcement':
        return <Megaphone className="h-4 w-4 text-amber-500" />;
      case 'event':
      case 'church_reminder':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'new_study':
      case 'quarterly_update':
        return <BookOpen className="h-4 w-4 text-primary" />;
      case 'gem_release':
      case 'feature_release':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-foreground/60" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'gem_release':
      case 'feature_release':
        return 'bg-purple-500/20 text-purple-400';
      case 'event':
      case 'church_reminder':
        return 'bg-green-500/20 text-green-400';
      case 'new_study':
      case 'quarterly_update':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-amber-500/20 text-amber-400';
    }
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="py-6 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (announcements.length === 0) {
    return null;
  }

  const displayAnnouncements = expanded ? announcements : announcements.slice(0, 3);

  return (
    <Card variant="glass" className="border-amber-500/20 overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base">Announcements Board</CardTitle>
          {announcements.length > 0 && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
              {announcements.length}
            </Badge>
          )}
        </div>
      </CardHeader>

      <ScrollArea className={expanded ? "max-h-[400px]" : "max-h-[200px]"}>
        <div className="divide-y divide-border/30">
          {displayAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAnnouncementIcon(announcement.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{announcement.title}</span>
                    {announcement.is_pinned && (
                      <Badge variant="outline" className="text-xs h-5">
                        📌 Pinned
                      </Badge>
                    )}
                    <Badge className={`text-xs h-5 ${getBadgeColor(announcement.type)}`}>
                      {announcement.type.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/70 mt-1 line-clamp-2">
                    {announcement.message}
                  </p>
                  <p className="text-xs text-foreground/40 mt-1">
                    {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {announcements.length > 3 && (
        <div className="p-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                View all {announcements.length} announcements
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
