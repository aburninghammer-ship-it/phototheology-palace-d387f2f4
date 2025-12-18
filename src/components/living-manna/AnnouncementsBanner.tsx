import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, X, Megaphone, AlertTriangle, PartyPopper, Info, ChevronRight, Pin
} from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_pinned: boolean;
  created_at: string;
  expires_at: string | null;
}

interface AnnouncementsBannerProps {
  churchId: string;
}

const TYPE_CONFIG = {
  info: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
  celebration: { icon: PartyPopper, bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500' },
  urgent: { icon: Megaphone, bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500' },
};

export function AnnouncementsBanner({ churchId }: AnnouncementsBannerProps) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && churchId) {
      loadAnnouncements();
    }
  }, [user, churchId]);

  const loadAnnouncements = async () => {
    try {
      // Load announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('church_announcements')
        .select('*')
        .eq('church_id', churchId)
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (announcementsError) throw announcementsError;

      // Load dismissed IDs
      const { data: dismissalsData } = await supabase
        .from('church_announcement_dismissals')
        .select('announcement_id')
        .eq('user_id', user?.id);

      const dismissed = new Set((dismissalsData || []).map(d => d.announcement_id));
      setDismissedIds(dismissed);
      setAnnouncements(announcementsData || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissAnnouncement = async (announcementId: string) => {
    try {
      await supabase
        .from('church_announcement_dismissals')
        .insert({ announcement_id: announcementId, user_id: user?.id });
      
      setDismissedIds(prev => new Set([...prev, announcementId]));
    } catch (error) {
      console.error('Error dismissing announcement:', error);
    }
  };

  // Filter out dismissed announcements (except pinned ones)
  const visibleAnnouncements = announcements.filter(
    a => a.is_pinned || !dismissedIds.has(a.id)
  );

  if (loading || visibleAnnouncements.length === 0) {
    return null;
  }

  const primaryAnnouncement = visibleAnnouncements[0];
  const otherAnnouncements = visibleAnnouncements.slice(1);
  const config = TYPE_CONFIG[primaryAnnouncement.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.info;
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      {/* Primary Announcement */}
      <Card className={`${config.bg} ${config.border} border`}>
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full ${config.bg}`}>
              <Icon className={`h-4 w-4 ${config.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{primaryAnnouncement.title}</h4>
                {primaryAnnouncement.is_pinned && (
                  <Pin className="h-3 w-3 text-primary" />
                )}
                {primaryAnnouncement.type === 'urgent' && (
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                )}
              </div>
              <p className={`text-sm text-foreground/80 ${expanded ? '' : 'line-clamp-2'}`}>
                {primaryAnnouncement.message}
              </p>
              {primaryAnnouncement.message.length > 100 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Show less' : 'Read more'}
                </Button>
              )}
            </div>
            {!primaryAnnouncement.is_pinned && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => dismissAnnouncement(primaryAnnouncement.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Other Announcements (collapsed) */}
      {otherAnnouncements.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              <span className="flex items-center gap-2">
                <Bell className="h-3 w-3" />
                {otherAnnouncements.length} more announcement{otherAnnouncements.length > 1 ? 's' : ''}
              </span>
              <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </Button>
            
            {expanded && (
              <ScrollArea className="max-h-48 mt-2">
                <div className="space-y-2">
                  {otherAnnouncements.map((announcement) => {
                    const announcementConfig = TYPE_CONFIG[announcement.type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.info;
                    const AnnouncementIcon = announcementConfig.icon;
                    
                    return (
                      <div 
                        key={announcement.id}
                        className={`p-2 rounded-lg ${announcementConfig.bg} ${announcementConfig.border} border`}
                      >
                        <div className="flex items-start gap-2">
                          <AnnouncementIcon className={`h-4 w-4 mt-0.5 ${announcementConfig.text}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs">{announcement.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {announcement.message}
                            </p>
                          </div>
                          {!announcement.is_pinned && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 flex-shrink-0"
                              onClick={() => dismissAnnouncement(announcement.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
