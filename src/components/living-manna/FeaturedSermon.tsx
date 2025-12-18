import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Calendar, User, ExternalLink } from "lucide-react";

interface FeaturedSermonProps {
  churchId: string;
}

interface Sermon {
  id: string;
  title: string;
  preacher: string | null;
  sermon_date: string;
  youtube_url: string;
  thumbnail_url: string | null;
  description: string | null;
  scripture_focus: string | null;
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

export function FeaturedSermon({ churchId }: FeaturedSermonProps) {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedSermon();
  }, [churchId]);

  const loadFeaturedSermon = async () => {
    try {
      const { data } = await (supabase
        .from('church_sermons' as any)
        .select('*')
        .eq('church_id', churchId)
        .order('sermon_date', { ascending: false })
        .limit(1) as any);

      if (data && data.length > 0) {
        setSermon(data[0]);
      }
    } catch (error) {
      console.error('Error loading sermon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sermon) {
    return null;
  }

  const videoId = extractYouTubeId(sermon.youtube_url);
  const thumbnailUrl = sermon.thumbnail_url || 
    (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null);

  return (
    <Card variant="glass" className="overflow-hidden">
      <div className="relative aspect-video bg-black/20">
        {thumbnailUrl ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={sermon.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <a 
              href={sermon.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors shadow-lg">
                <Play className="h-8 w-8 text-primary-foreground ml-1" />
              </div>
            </a>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Play className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Featured Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground">
            Featured Message
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{sermon.title}</h3>
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          {sermon.preacher && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{sermon.preacher}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(sermon.sermon_date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          {sermon.scripture_focus && (
            <Badge variant="outline">{sermon.scripture_focus}</Badge>
          )}
        </div>

        {sermon.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {sermon.description}
          </p>
        )}

        <Button asChild className="w-full">
          <a href={sermon.youtube_url} target="_blank" rel="noopener noreferrer">
            <Play className="h-4 w-4 mr-2" />
            Watch Now
            <ExternalLink className="h-3 w-3 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
