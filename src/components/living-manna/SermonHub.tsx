import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, Youtube, Video, Search, Calendar, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SermonHubProps {
  churchId: string;
}

interface Sermon {
  id: string;
  title: string;
  description: string | null;
  youtube_url: string;
  thumbnail_url: string | null;
  sermon_date: string;
  preacher: string | null;
  scripture_focus: string | null;
  duration_minutes: number | null;
  pt_framing: string | null;
}

interface ChurchYouTubeSettings {
  channel_url: string | null;
  channel_name: string | null;
}

export function SermonHub({ churchId }: SermonHubProps) {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [youtubeSettings, setYoutubeSettings] = useState<ChurchYouTubeSettings>({
    channel_url: null,
    channel_name: null
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSermons();
    loadYouTubeSettings();
  }, [churchId]);

  const loadSermons = async () => {
    try {
      // Using any for new table
      const { data } = await (supabase
        .from('church_sermons' as any)
        .select('*')
        .eq('church_id', churchId)
        .order('sermon_date', { ascending: false })
        .limit(20) as any);

      setSermons((data || []) as Sermon[]);
    } catch (error) {
      console.error('Error loading sermons:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadYouTubeSettings = async () => {
    try {
      const { data } = await supabase
        .from('churches')
        .select('youtube_channel_url, youtube_channel_name')
        .eq('id', churchId)
        .maybeSingle();

      if (data) {
        setYoutubeSettings({
          channel_url: (data as any).youtube_channel_url,
          channel_name: (data as any).youtube_channel_name
        });
      }
    } catch (error) {
      console.error('Error loading YouTube settings:', error);
    }
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.scripture_focus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sermon.preacher?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <Video className="h-6 w-6 text-primary" />
            Sermon Hub
          </h2>
          <p className="text-foreground/70">
            Weekly messages with clear Scripture focus and Phototheology framing
          </p>
        </div>
      </div>

      {/* YouTube Channel Embed */}
      <Card variant="glass" className="border-red-500/30 bg-card/80">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Living Manna YouTube Channel</h3>
                <p className="text-sm text-foreground/70">
                  {youtubeSettings.channel_name || "Watch live services and past sermons"}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => {
                const url = youtubeSettings.channel_url || 'https://youtube.com/@LivingMannaChurch';
                window.open(url, '_blank');
              }}
            >
              <Youtube className="h-4 w-4 mr-2" />
              Open Channel
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
          {/* YouTube Embed */}
          <div className="aspect-video rounded-lg overflow-hidden bg-black/50">
            <iframe
              src="https://www.youtube.com/embed?listType=user_uploads&list=@livingmanna"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Living Manna YouTube Channel"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      {sermons.length > 0 && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          <Input
            placeholder="Search sermons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Sermons Grid */}
      {filteredSermons.length === 0 ? (
        <Card variant="glass" className="bg-card/80">
          <CardContent className="py-12 text-center">
            <Video className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {sermons.length === 0 ? "Sermons Coming Soon" : "No Matching Sermons"}
            </h3>
            <p className="text-foreground/70 mb-4">
              {sermons.length === 0 
                ? "Check out the YouTube channel for the latest messages."
                : "Try a different search term."}
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                const url = youtubeSettings.channel_url || 'https://youtube.com/@LivingMannaChurch';
                window.open(url, '_blank');
              }}
            >
              <Youtube className="h-4 w-4 mr-2" />
              Visit YouTube Channel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSermons.map((sermon) => {
            const videoId = extractVideoId(sermon.youtube_url);
            const thumbnailUrl = sermon.thumbnail_url || 
              (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null);

            return (
              <Card 
                key={sermon.id} 
                variant="glass" 
                className="overflow-hidden hover:border-primary/30 transition-colors cursor-pointer bg-card/80"
                onClick={() => window.open(sermon.youtube_url, '_blank')}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-muted">
                  {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="h-12 w-12 text-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  {sermon.duration_minutes && (
                    <Badge className="absolute bottom-2 right-2 bg-black/80">
                      {sermon.duration_minutes} min
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/70 mb-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(sermon.sermon_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {sermon.preacher && (
                      <>
                        <span>•</span>
                        <span>{sermon.preacher}</span>
                      </>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2 text-foreground">{sermon.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  {sermon.scripture_focus && (
                    <Badge variant="outline" className="mb-2">
                      {sermon.scripture_focus}
                    </Badge>
                  )}
                  {sermon.pt_framing && (
                    <p className="text-xs text-foreground/60 mt-2">
                      PT Focus: {sermon.pt_framing}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Info Card */}
      <Card variant="glass" className="bg-card/80">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Weekly Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-2xl mb-2">📺</div>
              <h4 className="font-medium text-foreground">Sabbath Sermon</h4>
              <p className="text-sm text-foreground/70">
                Clear Scripture focus with explicit PT framing
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-2xl mb-2">📋</div>
              <h4 className="font-medium text-foreground">Central Study</h4>
              <p className="text-sm text-foreground/70">
                Released immediately after for all groups
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="text-2xl mb-2">🔥</div>
              <h4 className="font-medium text-foreground">Small Groups</h4>
              <p className="text-sm text-foreground/70">
                Leaders facilitate, not improvise
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
