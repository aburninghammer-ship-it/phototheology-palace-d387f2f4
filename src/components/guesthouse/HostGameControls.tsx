import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  SkipForward,
  Clock,
  Users,
  Gift,
  MessageSquare,
  Settings,
  Zap,
  Eye,
  Volume2,
  VolumeX,
  RefreshCw,
  Trophy
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Guest {
  id: string;
  display_name: string;
  score: number;
}

interface HostGameControlsProps {
  eventId: string;
  activePromptId?: string;
  guests: Guest[];
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onEndGame: () => void;
  onNextPhase?: () => void;
  onAwardPoints: (guestId: string, points: number, reason: string) => void;
}

export function HostGameControls({
  eventId,
  activePromptId,
  guests,
  isPaused,
  onPause,
  onResume,
  onEndGame,
  onNextPhase,
  onAwardPoints
}: HostGameControlsProps) {
  const [selectedGuest, setSelectedGuest] = useState<string>("");
  const [bonusPoints, setBonusPoints] = useState(25);
  const [bonusReason, setBonusReason] = useState("Great insight!");
  const [announcement, setAnnouncement] = useState("");
  const [muteReactions, setMuteReactions] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [timeExtension, setTimeExtension] = useState(30);

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;

    await supabase.channel(`event-${eventId}`).send({
      type: 'broadcast',
      event: 'announcement',
      payload: { message: announcement, timestamp: new Date().toISOString() }
    });

    toast.success("Announcement sent!");
    setAnnouncement("");
  };

  const extendTime = async () => {
    await supabase.channel(`event-${eventId}`).send({
      type: 'broadcast',
      event: 'time_extension',
      payload: { seconds: timeExtension }
    });

    toast.success(`Added ${timeExtension} seconds!`);
  };

  const awardBonusPoints = () => {
    if (!selectedGuest) {
      toast.error("Select a guest first");
      return;
    }
    onAwardPoints(selectedGuest, bonusPoints, bonusReason);
    toast.success(`Awarded ${bonusPoints} points!`);
  };

  const toggleReactionMute = async () => {
    const newState = !muteReactions;
    setMuteReactions(newState);

    await supabase.channel(`event-${eventId}`).send({
      type: 'broadcast',
      event: 'reactions_toggle',
      payload: { muted: newState }
    });

    toast.info(newState ? "Reactions muted" : "Reactions enabled");
  };

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Host Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="game" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="game" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Game
            </TabsTrigger>
            <TabsTrigger value="points" className="text-xs">
              <Gift className="w-3 h-3 mr-1" />
              Points
            </TabsTrigger>
            <TabsTrigger value="announce" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Announce
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Game Controls */}
          <TabsContent value="game" className="space-y-4 mt-4">
            {/* Pause/Resume/End */}
            <div className="flex gap-2">
              {isPaused ? (
                <Button onClick={onResume} className="flex-1" variant="default">
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </Button>
              ) : (
                <Button onClick={onPause} className="flex-1" variant="outline">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={onEndGame} variant="destructive" className="flex-1">
                End Game
              </Button>
            </div>

            {/* Time Extension */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Extension</span>
                <Badge variant="outline">{timeExtension}s</Badge>
              </div>
              <div className="flex gap-2">
                <Slider
                  value={[timeExtension]}
                  onValueChange={([v]) => setTimeExtension(v)}
                  min={15}
                  max={120}
                  step={15}
                  className="flex-1"
                />
                <Button size="sm" onClick={extendTime}>
                  <Clock className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Next Phase */}
            {onNextPhase && (
              <Button onClick={onNextPhase} className="w-full" variant="secondary">
                <SkipForward className="w-4 h-4 mr-2" />
                Next Phase
              </Button>
            )}
          </TabsContent>

          {/* Points Tab */}
          <TabsContent value="points" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Guest</label>
              <select
                value={selectedGuest}
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="w-full p-2 rounded-md border bg-background"
              >
                <option value="">Choose a guest...</option>
                {guests.map(guest => (
                  <option key={guest.id} value={guest.id}>
                    {guest.display_name} ({guest.score} pts)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Bonus Points</span>
                <Badge>{bonusPoints} pts</Badge>
              </div>
              <Slider
                value={[bonusPoints]}
                onValueChange={([v]) => setBonusPoints(v)}
                min={5}
                max={100}
                step={5}
              />
            </div>

            <Input
              placeholder="Reason for bonus"
              value={bonusReason}
              onChange={(e) => setBonusReason(e.target.value)}
            />

            <Button onClick={awardBonusPoints} className="w-full">
              <Gift className="w-4 h-4 mr-2" />
              Award Bonus Points
            </Button>

            {/* Quick bonus buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  if (selectedGuest) {
                    onAwardPoints(selectedGuest, 10, "Quick bonus");
                  }
                }}
              >
                +10
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  if (selectedGuest) {
                    onAwardPoints(selectedGuest, 25, "Good answer");
                  }
                }}
              >
                +25
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  if (selectedGuest) {
                    onAwardPoints(selectedGuest, 50, "Excellent insight");
                  }
                }}
              >
                +50
              </Button>
            </div>
          </TabsContent>

          {/* Announcement Tab */}
          <TabsContent value="announce" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Announcement</label>
              <Input
                placeholder="Type your announcement..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendAnnouncement()}
              />
            </div>

            <Button onClick={sendAnnouncement} className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send to All Guests
            </Button>

            {/* Quick announcements */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Quick Messages:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setAnnouncement("Great work everyone! Keep it up!")}
                >
                  Encourage
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setAnnouncement("30 seconds remaining!")}
                >
                  Time Warning
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setAnnouncement("Next challenge coming up...")}
                >
                  Next Up
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setAnnouncement("Take a moment to reflect...")}
                >
                  Reflect
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {muteReactions ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-sm">Mute Reactions</span>
              </div>
              <Switch checked={muteReactions} onCheckedChange={toggleReactionMute} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Auto-Advance</span>
              </div>
              <Switch checked={autoAdvance} onCheckedChange={setAutoAdvance} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Show Leaderboard</span>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Session Stats</p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-lg font-bold">{guests.length}</div>
                  <div className="text-xs text-muted-foreground">Guests</div>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <div className="text-lg font-bold">
                    {guests.reduce((sum, g) => sum + g.score, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
