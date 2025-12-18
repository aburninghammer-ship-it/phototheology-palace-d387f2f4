import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { 
  Bell, BellRing, Check, CheckCheck, X, 
  MessageSquare, Megaphone, Calendar, Users,
  BookOpen, Flame, Heart, Trophy, Loader2
} from "lucide-react";

interface NotificationAlertsProps {
  churchId?: string;
  compact?: boolean;
}

// Personal notification types (not public announcements)
const PERSONAL_NOTIFICATION_TYPES = [
  'message', 'direct_message', 'prayer', 'achievement', 
  'challenge', 'study', 'devotional', 'comment', 'reply',
  'partnership', 'group_invite', 'mention'
];

export function NotificationAlerts({ churchId, compact = false }: NotificationAlertsProps) {
  const { user } = useAuth();
  const { notifications: allNotifications, unreadCount: totalUnread, loading, markAsRead, markAllAsRead } = useNotifications();
  
  // Filter to only personal notifications (not public announcements)
  const notifications = allNotifications.filter(n => 
    PERSONAL_NOTIFICATION_TYPES.includes(n.type) || 
    !['announcement', 'church_announcement', 'gem_release', 'new_study', 'quarterly_update', 'event', 'church_reminder', 'feature_release'].includes(n.type)
  );
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  const [expanded, setExpanded] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
      case 'direct_message':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'announcement':
      case 'church_announcement':
        return <Megaphone className="h-4 w-4 text-amber-500" />;
      case 'event':
      case 'calendar':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'community':
      case 'community_post':
        return <Users className="h-4 w-4 text-purple-500" />;
      case 'study':
      case 'devotional':
        return <BookOpen className="h-4 w-4 text-primary" />;
      case 'challenge':
        return <Flame className="h-4 w-4 text-orange-500" />;
      case 'prayer':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-foreground/60" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message':
      case 'direct_message':
        return 'border-l-blue-500';
      case 'announcement':
      case 'church_announcement':
        return 'border-l-amber-500';
      case 'event':
      case 'calendar':
        return 'border-l-green-500';
      case 'community':
      case 'community_post':
        return 'border-l-purple-500';
      case 'study':
      case 'devotional':
        return 'border-l-primary';
      case 'challenge':
        return 'border-l-orange-500';
      case 'prayer':
        return 'border-l-pink-500';
      case 'achievement':
        return 'border-l-yellow-500';
      default:
        return 'border-l-border';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  // Compact view - just the bell icon with count
  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setExpanded(!expanded)}
      >
        {unreadCount > 0 ? (
          <BellRing className="h-5 w-5 text-primary animate-pulse" />
        ) : (
          <Bell className="h-5 w-5" />
        )}
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  const displayNotifications = expanded ? notifications : notifications.slice(0, 5);
  const unreadNotifications = notifications.filter(n => !n.is_read);

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-primary" />
          ) : (
            <Bell className="h-5 w-5 text-foreground/60" />
          )}
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <CardContent className="py-8 text-center">
          <Bell className="h-10 w-10 text-foreground/20 mx-auto mb-3" />
          <p className="text-foreground/60">No notifications yet</p>
          <p className="text-sm text-foreground/40 mt-1">
            You'll see updates here when something happens
          </p>
        </CardContent>
      ) : (
        <>
          <ScrollArea className={expanded ? "h-[400px]" : "max-h-[300px]"}>
            <div className="divide-y divide-border/30">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/30 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.is_read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notification.is_read ? 'font-medium text-foreground' : 'text-foreground/80'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-foreground/60 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-foreground/40 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {notifications.length > 5 && (
            <div className="p-2 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show less' : `View all ${notifications.length} notifications`}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
