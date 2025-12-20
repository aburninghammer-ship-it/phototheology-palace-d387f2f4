import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, ExternalLink, Clock, Calendar, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LiveSermonBannerProps {
  churchId: string;
}

export function LiveSermonBanner({ churchId }: LiveSermonBannerProps) {
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [timeUntilLive, setTimeUntilLive] = useState<string | null>(null);

  useEffect(() => {
    loadYouTubeSettings();
    checkIfLive();
    
    // Update live status every minute
    const interval = setInterval(() => {
      checkIfLive();
    }, 60000);

    return () => clearInterval(interval);
  }, [churchId]);

  const loadYouTubeSettings = async () => {
    try {
      const { data } = await supabase
        .from('churches')
        .select('youtube_channel_url')
        .eq('id', churchId)
        .maybeSingle();

      if (data) {
        setYoutubeUrl((data as any).youtube_channel_url || 'https://www.youtube.com/@mylivingmanna');
      }
    } catch (error) {
      console.error('Error loading YouTube settings:', error);
    }
  };

  const checkIfLive = () => {
    const now = new Date();
    const cstOffset = -6; // CST is UTC-6
    const utcHours = now.getUTCHours();
    const utcDay = now.getUTCDay();
    
    // Convert to CST
    let cstHours = utcHours + cstOffset;
    let cstDay = utcDay;
    
    if (cstHours < 0) {
      cstHours += 24;
      cstDay = (cstDay - 1 + 7) % 7;
    }

    // Saturday = 6, Live at 12pm CST (noon)
    const isSaturday = cstDay === 6;
    const isNoonHour = cstHours >= 12 && cstHours < 14; // 12pm - 2pm window
    
    setIsLive(isSaturday && isNoonHour);

    // Calculate time until next live service
    if (!isLive) {
      const daysUntilSaturday = (6 - cstDay + 7) % 7;
      const adjustedDays = daysUntilSaturday === 0 && cstHours >= 14 ? 7 : daysUntilSaturday;
      
      if (adjustedDays === 0) {
        const hoursUntil = 12 - cstHours;
        if (hoursUntil > 0) {
          setTimeUntilLive(`${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`);
        } else {
          setTimeUntilLive(null);
        }
      } else if (adjustedDays === 1) {
        setTimeUntilLive("Tomorrow at 12pm CST");
      } else {
        setTimeUntilLive(`${adjustedDays} days`);
      }
    } else {
      setTimeUntilLive(null);
    }
  };

  const handleWatchLive = () => {
    const liveUrl = youtubeUrl?.includes('/live') 
      ? youtubeUrl 
      : `${youtubeUrl}/live`;
    window.open(liveUrl, '_blank');
  };

  return (
    <Card 
      className={`relative overflow-hidden border-2 transition-all duration-300 ${
        isLive 
          ? 'border-red-500 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent animate-pulse-slow' 
          : 'border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent'
      }`}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`relative w-14 h-14 rounded-full flex items-center justify-center ${
              isLive ? 'bg-red-500/20' : 'bg-primary/20'
            }`}>
              {isLive ? (
                <>
                  <Radio className="h-7 w-7 text-red-500 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
                </>
              ) : (
                <Video className="h-7 w-7 text-primary" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE NOW
                  </Badge>
                )}
                <h3 className="text-lg font-bold text-foreground">
                  {isLive ? "Join Sabbath Service" : "Sabbath Worship Service"}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Every Saturday
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  12:00 PM CST
                </span>
              </div>
              {!isLive && timeUntilLive && (
                <p className="text-xs text-muted-foreground mt-1">
                  Next service in {timeUntilLive}
                </p>
              )}
            </div>
          </div>

          <Button 
            onClick={handleWatchLive}
            className={`shrink-0 ${
              isLive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : ''
            }`}
            size="lg"
          >
            {isLive ? (
              <>
                <Radio className="h-4 w-4 mr-2 animate-pulse" />
                Watch Live
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch on YouTube
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
