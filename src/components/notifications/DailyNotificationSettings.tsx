import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Gamepad2, BookOpen, Lightbulb, Star, MessageSquare } from "lucide-react";
import { useDailyNotifications, NotificationPreferences } from "@/hooks/useDailyNotifications";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NOTIFICATION_TYPES = [
  { id: "room", label: "Room Suggestions", icon: BookOpen, color: "bg-blue-500/20 text-blue-600" },
  { id: "game", label: "Game Challenges", icon: Gamepad2, color: "bg-green-500/20 text-green-600" },
  { id: "verse", label: "Verse of the Day", icon: MessageSquare, color: "bg-purple-500/20 text-purple-600" },
  { id: "fact", label: "Did You Know?", icon: Lightbulb, color: "bg-yellow-500/20 text-yellow-600" },
  { id: "gem", label: "Palace Gems", icon: Star, color: "bg-pink-500/20 text-pink-600" },
];

export const DailyNotificationSettings = () => {
  const { preferences, updatePreferences, requestPermission, triggerNow, getTodayContent } = useDailyNotifications();
  const [hasPermission, setHasPermission] = useState(
    "Notification" in window && Notification.permission === "granted"
  );

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    setHasPermission(granted);
    if (granted) {
      updatePreferences({ enabled: true });
      toast.success("Notifications enabled!");
    } else {
      toast.error("Permission denied. Check your browser settings.");
    }
  };

  const toggleType = (typeId: string) => {
    const newTypes = preferences.types.includes(typeId)
      ? preferences.types.filter(t => t !== typeId)
      : [...preferences.types, typeId];
    
    if (newTypes.length === 0) {
      toast.error("You need at least one notification type");
      return;
    }
    
    updatePreferences({ types: newTypes });
  };

  const todayContent = getTodayContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Daily Notifications
        </CardTitle>
        <CardDescription>
          Get daily reminders to explore rooms, play games, and study Scripture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Daily Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive one message per day
            </p>
          </div>
          <Switch
            checked={preferences.enabled}
            onCheckedChange={(checked) => {
              if (checked && !hasPermission) {
                handleEnableNotifications();
              } else {
                updatePreferences({ enabled: checked });
              }
            }}
          />
        </div>

        {preferences.enabled && (
          <>
            {/* Time Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Notification Time
              </Label>
              <Input
                type="time"
                value={preferences.time}
                onChange={(e) => updatePreferences({ time: e.target.value })}
                className="w-32"
              />
            </div>

            {/* Content Types */}
            <div className="space-y-3">
              <Label>Notification Types</Label>
              <div className="flex flex-wrap gap-2">
                {NOTIFICATION_TYPES.map(type => (
                  <Badge
                    key={type.id}
                    variant={preferences.types.includes(type.id) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all",
                      preferences.types.includes(type.id) && type.color
                    )}
                    onClick={() => toggleType(type.id)}
                  >
                    <type.icon className="h-3 w-3 mr-1" />
                    {type.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Today's Message Preview:</p>
              <div className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{todayContent.title}</p>
                  <p className="text-sm text-muted-foreground">{todayContent.message}</p>
                </div>
              </div>
            </div>

            {/* Test Button */}
            <Button variant="outline" onClick={triggerNow} className="w-full">
              <Bell className="h-4 w-4 mr-2" />
              Test Notification Now
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
